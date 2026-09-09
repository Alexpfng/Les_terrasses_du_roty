import { randomUUID } from "node:crypto";
import type { DemandeInput } from "../src/lib/demande-schema.js";

export function environment() {
  return {
    NODE_ENV: "production",
    RESEND_API_KEY: "test-only-not-a-real-key",
    ROTY_MAIL_FROM: "test-only@example.org",
    ROTY_ALLOWED_ORIGINS: "https://www.les-terrasses-du-roty.fr",
    ROTY_REDIS_REST_URL: "https://redis.example.test",
    ROTY_REDIS_REST_TOKEN: "test-only-not-a-real-token",
    ROTY_FORM_HASH_SECRET: "test-only-secret-do-not-use-in-production-12345",
    ROTY_FORM_NAMESPACE: `test-${randomUUID().slice(0, 30)}`,
  };
}

export function submission(overrides: Record<string, unknown> = {}): DemandeInput {
  return {
    name: "TEST TECHNIQUE — NE PAS TRAITER",
    email: "test-technique@example.org",
    profile: "particulier",
    purpose: "conseil",
    is_adult: true,
    idempotency_key: randomUUID(),
    source_path: "/demande/",
    website: "",
    ...overrides,
  } as DemandeInput;
}

export function request(body: unknown = submission(), extraHeaders: Record<string, string> = {}) {
  return new Request("https://www.les-terrasses-du-roty.fr/api/demandes", {
    method: "POST",
    headers: {
      Origin: "https://www.les-terrasses-du-roty.fr",
      "Content-Type": "application/json",
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  });
}

export const fakeProviderId = "9380c2d7-3d27-4670-ae72-33b477b8a399";
export const fakeRequestId = "f8e2c80f-fbda-4234-9a13-0d93c2b8c02e";
