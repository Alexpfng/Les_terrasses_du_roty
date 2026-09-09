import assert from "node:assert/strict";
import test from "node:test";
import { createDemandeHandler } from "../src/lib/demandes.server.js";
import { demandeSchema } from "../src/lib/demande-schema.js";
import { environment, fakeProviderId, fakeRequestId, request, submission } from "./helpers.js";

function fixture(
  options: {
    reservation?: unknown;
    provider?: () => Response | Promise<Response>;
    storageFails?: boolean;
    finalizeFails?: boolean;
    env?: Record<string, string>;
  } = {},
) {
  const calls: { url: string; init: RequestInit }[] = [];
  const audit: unknown[] = [];
  const handler = createDemandeHandler({
    env: () => options.env ?? environment(),
    fetch: async (url, init = {}) => {
      calls.push({ url: String(url), init });
      if (String(url) === "https://api.resend.com/emails")
        return options.provider?.() ?? Response.json({ id: fakeProviderId });
      if (options.storageFails) throw new Error("mock Redis outage");
      const command = JSON.parse(String(init.body));
      if (options.finalizeFails && command[2] === 1)
        throw new Error("mock finalize outage after provider acceptance");
      return Response.json({
        result:
          command[2] === 4 ? (options.reservation ?? ["reserved", fakeRequestId, "1788950000"]) : 1,
      });
    },
    audit: (event) => audit.push(event),
  });
  return { handler, calls, audit };
}

test("missing or unsafe server configuration fails closed before external calls", async () => {
  for (const env of [
    {},
    { ...environment(), ROTY_MAIL_FROM: "visitor@example.org\r\nBcc: x@example.org" },
    { ...environment(), ROTY_ALLOWED_ORIGINS: "*" },
    { ...environment(), ROTY_ALLOWED_ORIGINS: "https://example.org/path" },
    { ...environment(), ROTY_ALLOWED_ORIGINS: "http://localhost:5173" },
    { ...environment(), ROTY_REDIS_REST_URL: "http://redis.example.org" },
    { ...environment(), ROTY_FORM_HASH_SECRET: "short" },
  ] as Record<string, string>[]) {
    const f = fixture({ env });
    assert.equal((await f.handler(request())).status, 503);
    assert.equal(f.calls.length, 0);
  }
});

test("endpoint only accepts POST", async () => {
  const f = fixture();
  const response = await f.handler(
    new Request("https://www.les-terrasses-du-roty.fr/api/demandes"),
  );
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("Allow"), "POST");
  assert.equal(f.calls.length, 0);
});

test("strict origin and fetch metadata reject missing, spoofed and cross-site submissions", async () => {
  for (const headers of [
    { Origin: "" },
    { Origin: "null" },
    { Origin: "https://www.les-terrasses-du-roty.fr.attacker.test" },
    { Origin: "https://www.les-terrasses-du-roty.fr/" },
    { "Sec-Fetch-Site": "cross-site" },
  ] as Record<string, string>[]) {
    const f = fixture();
    assert.equal((await f.handler(request(submission(), headers))).status, 403);
    assert.equal(f.calls.length, 0);
  }
});

test("only uncompressed JSON is accepted", async () => {
  for (const headers of [
    { "Content-Type": "text/plain" },
    { "Content-Type": "application/x-www-form-urlencoded" },
    { "Content-Encoding": "gzip" },
  ] as Record<string, string>[]) {
    const f = fixture();
    assert.equal((await f.handler(request(submission(), headers))).status, 415);
    assert.equal(f.calls.length, 0);
  }
});

test("unknown routing/header fields, invalid types, campaign PII and honeypot cannot send", async () => {
  for (const changes of [
    { recipient: "attacker@example.org" },
    { from: "attacker@example.org" },
    { subject: "arbitrary" },
    { name: "A" },
    { email: "not-an-email" },
    { email: "user@example.org\r\nBcc: attacker@example.org" },
    { is_adult: false },
    { is_adult: "true" },
    { estimated_quantity: "1" },
    { estimated_quantity: 1.5 },
    { estimated_quantity: 0 },
    { estimated_quantity: 10001 },
    { cuvee: "2022" },
    { idempotency_key: "not-a-uuid" },
    { source_path: "https://example.org" },
    { campaign: { utm_source: "personal-email@example.org" } },
    { campaign: { visitor_id: "123" } },
    { website: "bot-filled-value" },
    { phone: "123\nInjected" },
    { message: "invalid\u0000control" },
    { message: "a".repeat(3001) },
    { name: "a".repeat(121) },
  ]) {
    const f = fixture();
    assert.equal(
      (await f.handler(request(submission(changes)))).status,
      422,
      JSON.stringify(changes),
    );
    assert.equal(f.calls.length, 0);
  }
});

test("streamed byte limit applies without content-length and with multibyte UTF-8", async () => {
  for (const [body, headers] of [
    [JSON.stringify(submission()), { "Content-Length": "16385" }],
    [JSON.stringify(submission({ message: "é".repeat(9000) })), {}],
    ["{broken", {}],
  ] as const) {
    const f = fixture();
    const r = new Request("https://www.les-terrasses-du-roty.fr/api/demandes", {
      method: "POST",
      headers: {
        Origin: "https://www.les-terrasses-du-roty.fr",
        "Content-Type": "application/json",
        ...headers,
      },
      body,
    });
    assert.equal((await f.handler(r)).status, body === "{broken" ? 400 : 413);
    assert.equal(f.calls.length, 0);
  }
});

test("mock provider acceptance is required; recipient fixed, Reply-To valid, input never becomes HTML", async () => {
  const f = fixture();
  const body = submission({
    name: "  TEST <b>visiteur</b>  ",
    email: "TEST@example.org",
    message: "<script>alert(1)</script>",
  });
  const r = await f.handler(request(body));
  assert.equal(r.status, 200);
  assert.equal(r.headers.get("Cache-Control"), "no-store, max-age=0");
  assert.equal(r.headers.get("Access-Control-Allow-Origin"), null);
  assert.deepEqual((await r.json()).status, "accepted");
  const provider = f.calls.find((call) => call.url === "https://api.resend.com/emails");
  assert.ok(provider);
  const payload = JSON.parse(String(provider.init.body));
  assert.deepEqual(payload.to, ["taff.roty@gmail.com"]);
  assert.equal(payload.from, "Les Terrasses du Roty <test-only@example.org>");
  assert.equal(payload.reply_to, "test@example.org");
  assert.equal(payload.html, undefined);
  assert.ok(payload.text.includes("TEST <b>visiteur</b>"));
  assert.match(new Headers(provider.init.headers).get("Idempotency-Key")!, /^roty\/test-/);
  const redisPayloads = f.calls
    .filter((call) => call !== provider)
    .map((call) => call.init.body)
    .join("");
  assert.ok(!redisPayloads.includes(body.email));
  assert.ok(!redisPayloads.includes("visiteur"));
  assert.ok(!JSON.stringify(f.audit).includes("test@example.org"));
  assert.ok(!JSON.stringify(f.audit).includes("script"));
});

test("accepted replay does not contact the mock provider", async () => {
  const f = fixture({ reservation: ["accepted", fakeRequestId] });
  assert.equal((await f.handler(request())).status, 200);
  assert.equal(f.calls.length, 1);
});

test("atomic storage outcomes are respected without a provider call", async () => {
  for (const [reservation, expected] of [
    [["conflict"], 409],
    [["processing", fakeRequestId, "30"], 409],
    [["review_required", fakeRequestId], 409],
    [["rate_limited", "900"], 429],
    [["failed", fakeRequestId], 502],
  ] as const) {
    const f = fixture({ reservation });
    const r = await f.handler(request());
    assert.equal(r.status, expected);
    assert.equal(f.calls.length, 1);
    assert.notEqual((await r.json()).status, "accepted");
  }
});

test("Redis outage fails closed without contacting the mock provider", async () => {
  const f = fixture({ storageFails: true });
  assert.equal((await f.handler(request())).status, 503);
  assert.equal(f.calls.length, 1);
});

test("mock provider rejection, rate limit, server failure or malformed success never shows acceptance", async () => {
  for (const provider of [
    () => Response.json({ error: "mock rejected" }, { status: 422 }),
    () => Response.json({ error: "mock limited" }, { status: 429 }),
    () => Response.json({ error: "mock failure" }, { status: 500 }),
    () => Response.json({ success: true }),
    () => new Response("not JSON", { status: 200 }),
  ]) {
    const f = fixture({ provider });
    const r = await f.handler(request());
    assert.equal(r.status, 502);
    assert.notEqual((await r.json()).status, "accepted");
    assert.ok(!JSON.stringify(f.audit).includes("provider_accepted"));
  }
});

test("mock provider network timeout returns uncertainty, not a simulated success", async () => {
  const f = fixture({
    provider: () => {
      throw new DOMException("mock timeout", "TimeoutError");
    },
  });
  const r = await f.handler(request());
  assert.equal(r.status, 504);
  const json = await r.json();
  assert.equal(json.status, "uncertain");
  assert.equal(json.request_id, fakeRequestId);
  assert.equal(r.headers.get("Retry-After"), "30");
});

test("mock provider acceptance remains factual if Redis finalization fails, and emits only a technical alert", async () => {
  const f = fixture({ finalizeFails: true });
  const r = await f.handler(request());
  assert.equal(r.status, 200);
  const result = await r.json();
  assert.equal(result.status, "accepted");
  assert.equal(result.request_id, fakeRequestId);
  assert.deepEqual(f.audit, [
    { event: "demande_storage_finalize_failed", request_id: fakeRequestId },
    { event: "demande_provider_accepted", request_id: fakeRequestId, provider_id: fakeProviderId },
  ]);
});

test("a body that never completes times out and is cancelled before external calls", async () => {
  const f = fixture();
  let cancelled = false;
  const stream = new ReadableStream<Uint8Array>({
    cancel() {
      cancelled = true;
    },
  });
  const r = new Request("https://www.les-terrasses-du-roty.fr/api/demandes", {
    method: "POST",
    headers: { Origin: "https://www.les-terrasses-du-roty.fr", "Content-Type": "application/json" },
    body: stream,
    duplex: "half",
  } as RequestInit & { duplex: string });
  assert.equal((await f.handler(r)).status, 408);
  assert.ok(cancelled);
  assert.equal(f.calls.length, 0);
});

test("schema normalizes acceptable strings and supports a complete professional request", () => {
  const data = demandeSchema.parse(
    submission({
      name: "  TEST TECHNIQUE  ",
      profile: "professionnel",
      purpose: "professionnel",
      company: "Établissement TEST",
      phone: "+33 0 00 00 00 00",
      cuvee: "a_conseiller",
      estimated_quantity: 12,
      country: "France",
      postal_code: "03500",
      message: "Ligne 1\nLigne 2",
      campaign: { utm_source: "google", utm_medium: "organic", utm_campaign: "professionnels" },
    }),
  );
  assert.equal(data.name, "TEST TECHNIQUE");
  assert.equal(data.estimated_quantity, 12);
});
