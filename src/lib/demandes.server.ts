import process from "node:process";
import { z } from "zod";
import { demandeSchema, demandeAcceptedMessage, type DemandeData } from "./demande-schema.js";

const RECIPIENT = "taff.roty@gmail.com";
const MAX_BODY_BYTES = 16_384;
const BODY_TIMEOUT_MS = 5_000;
const SERVICE_TIMEOUT_MS = 8_000;
const STATE_TTL_SECONDS = 172_800;

type Environment = Record<string, string | undefined>;
type Dependencies = {
  env: () => Environment;
  fetch: typeof globalThis.fetch;
  audit: (event: { event: string; request_id?: string; provider_id?: string }) => void;
};

type Config = {
  apiKey: string;
  from: string;
  origins: string[];
  redisUrl: string;
  redisToken: string;
  hashSecret: string;
  namespace: string;
};

function configuration(env: Environment): Config | null {
  const apiKey = env.RESEND_API_KEY?.trim();
  const from = env.ROTY_MAIL_FROM?.trim();
  const redisToken = env.ROTY_REDIS_REST_TOKEN?.trim();
  const hashSecret = env.ROTY_FORM_HASH_SECRET;
  const namespace = env.ROTY_FORM_NAMESPACE;
  const origins = env.ROTY_ALLOWED_ORIGINS?.split(",").map((value) => value.trim());
  const redisUrl = env.ROTY_REDIS_REST_URL?.trim();
  if (
    !apiKey ||
    !from ||
    !redisToken ||
    !hashSecret ||
    hashSecret.length < 32 ||
    !namespace ||
    !/^[a-z0-9-]{3,40}$/.test(namespace) ||
    !origins?.length ||
    !redisUrl ||
    !z.string().email().safeParse(from).success ||
    /[\r\n]/.test(from + apiKey + redisToken)
  )
    return null;
  try {
    const redis = new URL(redisUrl);
    if (
      redis.protocol !== "https:" ||
      redis.username ||
      redis.password ||
      redis.search ||
      redis.hash ||
      redis.pathname !== "/"
    )
      return null;
    for (const origin of origins) {
      const url = new URL(origin);
      const developmentLocalhost =
        env.NODE_ENV !== "production" &&
        ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) &&
        url.protocol === "http:";
      if (origin !== url.origin || (url.protocol !== "https:" && !developmentLocalhost))
        return null;
    }
  } catch {
    return null;
  }
  return { apiKey, from, redisToken, hashSecret, namespace, origins, redisUrl };
}

function response(
  status: number,
  body: Record<string, unknown>,
  headers: Record<string, string> = {},
) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
      Vary: "Origin",
      ...headers,
    },
  });
}

function failure(
  status: number,
  code: string,
  message: string,
  extra: Record<string, unknown> = {},
  headers: Record<string, string> = {},
) {
  return response(status, { status: "error", code, message, ...extra }, headers);
}

class BodyError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
  ) {
    super(code);
  }
}

async function readBody(request: Request) {
  const declared = request.headers.get("content-length");
  if (declared && (!/^\d+$/.test(declared) || Number(declared) > MAX_BODY_BYTES))
    throw new BodyError(413, "body_too_large");
  if (!request.body) throw new BodyError(400, "invalid_json");
  const reader = request.body.getReader();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let completed = false;
  try {
    const contents = async () => {
      const chunks: Uint8Array[] = [];
      let size = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > MAX_BODY_BYTES) throw new BodyError(413, "body_too_large");
        chunks.push(value);
      }
      const bytes = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.byteLength;
      }
      try {
        return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
      } catch {
        throw new BodyError(400, "invalid_json");
      }
    };
    const body = await Promise.race([
      contents(),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new BodyError(408, "body_timeout")), BODY_TIMEOUT_MS);
      }),
    ]);
    completed = true;
    return body;
  } finally {
    clearTimeout(timer);
    if (!completed) void reader.cancel().catch(() => undefined);
    else reader.releaseLock();
  }
}

// All instances use the same Redis write endpoint. EVAL makes the three quotas
// and the idempotency reservation one atomic operation; no client IP is trusted.
export const RESERVE_SCRIPT = `
local raw = redis.call('GET', KEYS[1])
local clock = redis.call('TIME')
local now = tonumber(clock[1])
local state
if raw then
  state = cjson.decode(raw)
  if state.fingerprint ~= ARGV[1] then return {'conflict'} end
  if state.status == 'accepted' then return {'accepted', state.request_id} end
  if state.status == 'failed' then return {'failed', state.request_id} end
  if now - state.created_at >= 82800 or state.attempts >= 5 then return {'review_required', state.request_id} end
  if state.lock_until > now then return {'processing', state.request_id, tostring(state.lock_until - now)} end
end
local limits = {30, 120, 3}
local windows = {600, 86400, 900}
for i = 2, 4 do
  if tonumber(redis.call('GET', KEYS[i]) or '0') >= limits[i - 1] then
    return {'rate_limited', tostring(math.max(1, redis.call('TTL', KEYS[i])))}
  end
end
for i = 2, 4 do
  if redis.call('INCR', KEYS[i]) == 1 then redis.call('EXPIRE', KEYS[i], windows[i - 1]) end
end
if not state then
  state = {fingerprint = ARGV[1], request_id = ARGV[2], created_at = now, attempts = 0}
end
state.attempts = state.attempts + 1
state.owner = ARGV[3]
state.status = 'sending'
state.lock_until = now + 30
redis.call('SET', KEYS[1], cjson.encode(state), 'EX', math.max(1, tonumber(ARGV[4]) - (now - state.created_at)))
return {'reserved', state.request_id, tostring(state.created_at)}
`;

export const COMPLETE_SCRIPT = `
local raw = redis.call('GET', KEYS[1])
if not raw then return 0 end
local state = cjson.decode(raw)
if state.owner ~= ARGV[1] then return 0 end
state.status = ARGV[2]
state.provider_id = ARGV[3]
state.lock_until = 0
local ttl = redis.call('TTL', KEYS[1])
redis.call('SET', KEYS[1], cjson.encode(state), 'EX', math.max(1, ttl))
return 1
`;

async function hmac(secret: string, value: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function redis(dependencies: Dependencies, config: Config, command: (string | number)[]) {
  const result = await dependencies.fetch(config.redisUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${config.redisToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    signal: AbortSignal.timeout(4_000),
    redirect: "manual",
  });
  if (!result.ok) throw new Error("storage_unavailable");
  const data: unknown = await result.json();
  if (!data || typeof data !== "object" || !("result" in data) || "error" in data)
    throw new Error("storage_unavailable");
  return data.result;
}

const purposes = {
  bouteilles: "Demande de bouteilles",
  conseil: "Demande de conseil",
  professionnel: "Demande professionnelle",
  autre: "Demande d’information",
};

function message(data: DemandeData, config: Config, requestId: string, createdAt: number) {
  const cuvee = data.cuvee === "a_conseiller" ? "À conseiller" : data.cuvee;
  const text = [
    `Identifiant : ${requestId}`,
    `Date : ${new Date(createdAt * 1000).toISOString()}`,
    `Nom : ${data.name}`,
    `E-mail : ${data.email}`,
    `Profil : ${data.profile}`,
    `Objet : ${purposes[data.purpose]}`,
    data.company && `Établissement : ${data.company}`,
    data.phone && `Téléphone : ${data.phone}`,
    cuvee && `Cuvée : ${cuvee}`,
    data.estimated_quantity && `Quantité estimée : ${data.estimated_quantity}`,
    data.country && `Pays : ${data.country}`,
    data.postal_code && `Code postal : ${data.postal_code}`,
    `Majorité déclarée : oui (ne remplace pas les vérifications à la vente)`,
    data.source_path && `Page d’origine : ${data.source_path}`,
    data.campaign && `Campagne : ${JSON.stringify(data.campaign)}`,
    "",
    "Message du visiteur :",
    data.message || "(Non renseigné)",
    "",
    "Demande d’information ou d’achat à confirmer. Aucun paiement ni engagement de commande effectué sur le site.",
  ]
    .filter((line) => typeof line === "string")
    .join("\n");
  return {
    from: `Les Terrasses du Roty <${config.from}>`,
    to: [RECIPIENT],
    reply_to: data.email,
    subject: `[Roty] ${purposes[data.purpose]}${cuvee ? ` — Cuvée ${cuvee}` : ""}`,
    // Plain text intentionally avoids rendering visitor-controlled HTML.
    text,
    tags: [{ name: "request_id", value: requestId }],
  };
}

const uncertainMessage =
  "La transmission n’est pas confirmée. Conservez cette demande et réessayez avec les mêmes informations ; un contrôle évite les doublons.";

/** Dependency injection is for automated tests; production always uses real fetch. */
export function createDemandeHandler(dependencies: Dependencies) {
  return async function handle(request: Request): Promise<Response> {
    if (request.method !== "POST")
      return failure(
        405,
        "method_not_allowed",
        "Utilisez le formulaire pour transmettre une demande.",
        {},
        { Allow: "POST" },
      );
    const config = configuration(dependencies.env());
    if (!config)
      return failure(
        503,
        "service_unavailable",
        "L’envoi est momentanément indisponible. Votre demande n’a pas été transmise. Conservez votre saisie et réessayez plus tard.",
        {},
        { "Retry-After": "300" },
      );
    const origin = request.headers.get("origin");
    if (
      !origin ||
      !config.origins.includes(origin) ||
      request.headers.get("sec-fetch-site") === "cross-site"
    ) {
      return failure(
        403,
        "origin_forbidden",
        "Veuillez envoyer votre demande depuis le formulaire du site.",
      );
    }
    const contentType = request.headers.get("content-type") || "";
    if (
      !/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(contentType) ||
      (request.headers.has("content-encoding") &&
        request.headers.get("content-encoding") !== "identity")
    ) {
      return failure(
        415,
        "unsupported_media_type",
        "Le format de la demande n’est pas pris en charge.",
      );
    }
    let raw: unknown;
    try {
      raw = await readBody(request);
    } catch (error) {
      return failure(
        error instanceof BodyError ? error.status : 400,
        error instanceof BodyError ? error.code : "invalid_json",
        "La demande est invalide ou trop volumineuse. Vérifiez votre saisie.",
      );
    }
    const validation = demandeSchema.safeParse(raw);
    if (!validation.success) {
      return failure(422, "validation_failed", "Vérifiez les champs signalés avant de réessayer.", {
        field_errors: validation.error.flatten().fieldErrors,
      });
    }
    const data = validation.data;
    if (data.website)
      return failure(
        422,
        "request_rejected",
        "La demande ne peut pas être transmise. Rechargez le formulaire puis réessayez.",
      );

    let stateKey = "";
    let requestId = "";
    const owner = crypto.randomUUID();
    const finish = async (status: string, providerId = "") => {
      try {
        const saved = await redis(dependencies, config, [
          "EVAL",
          COMPLETE_SCRIPT,
          1,
          stateKey,
          owner,
          status,
          providerId,
        ]);
        if (saved !== 1) throw new Error("reservation_lost");
      } catch {
        dependencies.audit({ event: "demande_storage_finalize_failed", request_id: requestId });
      }
    };

    try {
      const { idempotency_key: key, website: _website, ...fields } = data;
      const [fingerprint, identity, opaqueKey] = await Promise.all([
        hmac(config.hashSecret, `payload-v1:${JSON.stringify(fields)}`),
        hmac(config.hashSecret, `email:${data.email}`),
        hmac(config.hashSecret, `key:${key}`),
      ]);
      const prefix = `roty:{${config.namespace}}`;
      stateKey = `${prefix}:request:${opaqueKey}`;
      const reservation = await redis(dependencies, config, [
        "EVAL",
        RESERVE_SCRIPT,
        4,
        stateKey,
        `${prefix}:global:10m`,
        `${prefix}:global:day`,
        `${prefix}:email:${identity}`,
        fingerprint,
        crypto.randomUUID(),
        owner,
        STATE_TTL_SECONDS,
      ]);
      if (!Array.isArray(reservation) || typeof reservation[0] !== "string")
        throw new Error("invalid_reservation");
      const [status, id, value] = reservation;
      if (status === "conflict")
        return failure(
          409,
          "idempotency_conflict",
          "Cette demande a déjà été utilisée avec d’autres informations. Vérifiez son état avant d’en créer une nouvelle.",
        );
      if (status === "rate_limited")
        return failure(
          429,
          "rate_limited",
          "Trop de demandes ont été envoyées. Conservez votre saisie et réessayez plus tard.",
          {},
          { "Retry-After": String(Number(id) || 900) },
        );
      if (typeof id !== "string" || !z.string().uuid().safeParse(id).success)
        throw new Error("invalid_reservation");
      requestId = id;
      if (status === "accepted")
        return response(200, {
          status: "accepted",
          request_id: requestId,
          message: demandeAcceptedMessage,
        });
      if (status === "failed")
        return failure(
          502,
          "provider_rejected",
          "Le service d’envoi a refusé cette demande. Aucun envoi n’a été confirmé.",
          { request_id: requestId },
        );
      if (status === "review_required")
        return failure(
          409,
          "review_required",
          "La transmission de cette demande nécessite une vérification par le domaine. Conservez son identifiant et évitez de la renvoyer.",
          { status: "uncertain", request_id: requestId },
        );
      if (status === "processing")
        return failure(
          409,
          "processing",
          uncertainMessage,
          { status: "uncertain", request_id: requestId },
          { "Retry-After": String(Number(value) || 30) },
        );
      if (status !== "reserved" || !Number.isFinite(Number(value)) || Number(value) <= 0)
        throw new Error("invalid_reservation");

      let provider: Response;
      try {
        provider = await dependencies.fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${config.apiKey}`,
            "Content-Type": "application/json",
            "Idempotency-Key": `roty/${config.namespace}/${opaqueKey}`,
          },
          body: JSON.stringify(message(data, config, requestId, Number(value))),
          signal: AbortSignal.timeout(SERVICE_TIMEOUT_MS),
          redirect: "manual",
        });
      } catch {
        await finish("uncertain");
        dependencies.audit({ event: "demande_provider_uncertain", request_id: requestId });
        return failure(
          504,
          "provider_timeout",
          uncertainMessage,
          { status: "uncertain", request_id: requestId },
          { "Retry-After": "30" },
        );
      }
      if (!provider.ok) {
        // A timeout or server error can occur after provider acceptance. Only
        // explicit validation/auth rejection is treated as a definite refusal.
        const definitive = [400, 401, 403, 404, 422].includes(provider.status);
        await provider.body?.cancel().catch(() => undefined);
        await finish(definitive ? "failed" : "uncertain");
        dependencies.audit({
          event: definitive ? "demande_provider_rejected" : "demande_provider_uncertain",
          request_id: requestId,
        });
        return failure(
          502,
          definitive ? "provider_rejected" : "provider_unavailable",
          definitive
            ? "Le service d’envoi a refusé la demande. Aucun envoi n’a été confirmé."
            : uncertainMessage,
          { status: definitive ? "error" : "uncertain", request_id: requestId },
          { "Retry-After": "30" },
        );
      }
      let result: unknown;
      try {
        result = await provider.json();
      } catch {
        result = null;
      }
      const providerData = z.object({ id: z.string().uuid() }).safeParse(result);
      if (!providerData.success) {
        await finish("uncertain");
        return failure(
          502,
          "provider_invalid_response",
          uncertainMessage,
          { status: "uncertain", request_id: requestId },
          { "Retry-After": "30" },
        );
      }
      await finish("accepted", providerData.data.id);
      dependencies.audit({
        event: "demande_provider_accepted",
        request_id: requestId,
        provider_id: providerData.data.id,
      });
      return response(200, {
        status: "accepted",
        request_id: requestId,
        message: demandeAcceptedMessage,
      });
    } catch {
      dependencies.audit({
        event: "demande_storage_unavailable",
        ...(requestId ? { request_id: requestId } : {}),
      });
      return failure(
        503,
        "service_unavailable",
        requestId
          ? uncertainMessage
          : "L’envoi est momentanément indisponible. Votre demande n’a pas été transmise. Conservez votre saisie et réessayez plus tard.",
        requestId ? { status: "uncertain", request_id: requestId } : {},
        { "Retry-After": "60" },
      );
    }
  };
}

export async function handleDemande(request: Request): Promise<Response> {
  return createDemandeHandler({
    env: () => process.env,
    // workerd requires the native receiver; redirects are checked above and never followed.
    fetch: globalThis.fetch.bind(globalThis),
    audit: (event) => console.info(JSON.stringify(event)),
  })(request);
}
