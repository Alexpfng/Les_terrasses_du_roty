import assert from "node:assert/strict";
import process from "node:process";
import test from "node:test";
import { handleDemande } from "../src/lib/demandes.server.js";
import { environment, fakeProviderId, fakeRequestId, request } from "./helpers.js";

test("production handler preserves native fetch context and refuses supplier redirects", async (t) => {
  const config = environment();
  const previous = Object.fromEntries(Object.keys(config).map((key) => [key, process.env[key]]));
  Object.assign(process.env, config);
  let scenario = "accepted";
  let calls: string[] = [];
  t.mock.method(console, "info", () => undefined);
  t.mock.method(
    globalThis,
    "fetch",
    async function (this: unknown, input: RequestInfo | URL, init?: RequestInit) {
      assert.equal(this, globalThis, "workerd requires its native fetch receiver");
      assert.equal(init?.redirect, "manual", "supplier redirects must never forward credentials");
      const url = String(input);
      calls.push(url);
      if (url === "https://api.resend.com/emails") {
        if (scenario === "provider-redirect")
          return Response.redirect("https://unexpected.example/", 302);
        return Response.json({ id: fakeProviderId });
      }
      assert.equal(url, config.ROTY_REDIS_REST_URL);
      if (scenario === "redis-redirect")
        return Response.redirect("https://unexpected.example/", 302);
      const command = JSON.parse(String(init?.body));
      return Response.json({
        result: command[2] === 4 ? ["reserved", fakeRequestId, "1788950000"] : 1,
      });
    },
  );
  try {
    for (const [mode, status, state, count] of [
      ["accepted", 200, "accepted", 3],
      ["redis-redirect", 503, "error", 1],
      ["provider-redirect", 502, "uncertain", 3],
    ] as const) {
      scenario = mode;
      calls = [];
      const response = await handleDemande(request());
      assert.equal(response.status, status, mode);
      assert.equal((await response.json()).status, state, mode);
      assert.equal(calls.length, count, mode);
      assert.ok(!calls.some((url) => url.includes("unexpected.example")));
    }
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});
