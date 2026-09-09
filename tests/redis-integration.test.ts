import assert from "node:assert/strict";
import { execFile, spawn, type ChildProcess } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { promisify } from "node:util";
import { after, before, test } from "node:test";
import { createDemandeHandler } from "../src/lib/demandes.server.js";
import { environment, fakeProviderId, request, submission } from "./helpers.js";

// Optional real Redis tests: no email leaves this process. Set both binary
// paths to exercise the exact production Lua against an isolated local Redis.
const serverPath = process.env.ROTY_TEST_REDIS_SERVER;
const cliPath = process.env.ROTY_TEST_REDIS_CLI;
const enabled = Boolean(serverPath && cliPath);
const exec = promisify(execFile);
let directory = "";
let socket = "";
let server: ChildProcess | undefined;

async function command(args: (string | number)[]) {
  const { stdout } = await exec(cliPath!, ["-s", socket, "--json", ...args.map(String)]);
  return JSON.parse(stdout);
}

before(async () => {
  if (!enabled) return;
  directory = await mkdtemp(join(tmpdir(), "roty-form-tests-"));
  socket = join(directory, "redis.sock");
  server = spawn(
    serverPath!,
    ["--port", "0", "--unixsocket", socket, "--save", "", "--appendonly", "no", "--dir", directory],
    { stdio: "ignore" },
  );
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      if ((await command(["PING"])) === "PONG") return;
    } catch {
      /* startup */
    }
    await new Promise((resolve) => setTimeout(resolve, 40));
  }
  throw new Error("Isolated Redis did not start");
});

after(async () => {
  if (!server) return;
  const exited = new Promise((resolve) => server!.once("exit", resolve));
  server.kill("SIGTERM");
  await exited;
  await rm(directory, { recursive: true, force: true });
});

function integration(provider?: (payload: string, headers: Headers) => Promise<Response>) {
  const env = environment();
  const messages: { payload: string; headers: Headers }[] = [];
  const redisCommands: (string | number)[][] = [];
  const handler = createDemandeHandler({
    env: () => env,
    audit: () => undefined,
    fetch: async (url, init = {}) => {
      if (String(url) === "https://api.resend.com/emails") {
        const payload = String(init.body);
        const headers = new Headers(init.headers);
        messages.push({ payload, headers });
        return provider?.(payload, headers) ?? Response.json({ id: fakeProviderId });
      }
      assert.equal(String(url), env.ROTY_REDIS_REST_URL);
      const args = JSON.parse(String(init.body));
      redisCommands.push(args);
      return Response.json({ result: await command(args) });
    },
  });
  return { handler, env, messages, redisCommands };
}

const options = { skip: !enabled };

test(
  "real Redis Lua: concurrent identical requests produce only one mock-provider call",
  options,
  async () => {
    const f = integration(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return Response.json({ id: fakeProviderId });
    });
    const data = submission();
    const responses = await Promise.all(Array.from({ length: 20 }, () => f.handler(request(data))));
    assert.ok(responses.some((response) => response.status === 200));
    assert.ok(responses.every((response) => [200, 409].includes(response.status)));
    assert.equal(f.messages.length, 1);
    assert.equal((await f.handler(request(data))).status, 200);
    assert.equal(f.messages.length, 1);
  },
);

test("real Redis Lua: a key reused with changed contents is rejected", options, async () => {
  const f = integration();
  const data = submission();
  assert.equal((await f.handler(request(data))).status, 200);
  assert.equal((await f.handler(request({ ...data, message: "Changed contents" }))).status, 409);
  assert.equal(f.messages.length, 1);
});

test(
  "real Redis Lua: uncertain retry keeps provider payload, request ID and idempotency header identical",
  options,
  async () => {
    let count = 0;
    const f = integration(async () => {
      if (++count === 1)
        throw new DOMException("mock response lost after possible acceptance", "TimeoutError");
      return Response.json({ id: fakeProviderId });
    });
    const data = submission();
    const uncertain = await f.handler(request(data));
    assert.equal(uncertain.status, 504);
    const accepted = await f.handler(request(data));
    assert.equal(accepted.status, 200);
    assert.equal((await uncertain.json()).request_id, (await accepted.json()).request_id);
    assert.equal(f.messages[0].payload, f.messages[1].payload);
    assert.equal(
      f.messages[0].headers.get("Idempotency-Key"),
      f.messages[1].headers.get("Idempotency-Key"),
    );
  },
);

test(
  "real Redis Lua: per-address limit survives new UUIDs and spoofed proxy IP headers",
  options,
  async () => {
    const f = integration();
    for (let i = 0; i < 3; i++) assert.equal((await f.handler(request(submission()))).status, 200);
    const limited = await f.handler(
      request(submission(), { "X-Forwarded-For": "1.2.3.4", "CF-Connecting-IP": "5.6.7.8" }),
    );
    assert.equal(limited.status, 429);
    assert.ok(Number(limited.headers.get("Retry-After")) > 0);
    assert.equal(f.messages.length, 3);
  },
);

test(
  "real Redis Lua: global quota atomically caps concurrent requests with different addresses",
  options,
  async () => {
    const f = integration();
    const responses = await Promise.all(
      Array.from({ length: 40 }, (_, i) =>
        f.handler(request(submission({ email: `test-${i}@example.org` }))),
      ),
    );
    assert.equal(responses.filter((response) => response.status === 200).length, 30);
    assert.equal(responses.filter((response) => response.status === 429).length, 10);
    assert.equal(f.messages.length, 30);
  },
);

test("real Redis Lua: daily quota blocks sending across the short window", options, async () => {
  const f = integration();
  await command(["SET", `roty:{${f.env.ROTY_FORM_NAMESPACE}}:global:day`, 120, "EX", 86400]);
  assert.equal((await f.handler(request())).status, 429);
  assert.equal(f.messages.length, 0);
});

test(
  "real Redis Lua: definite provider rejection remains terminal for that key",
  options,
  async () => {
    const f = integration(async () =>
      Response.json({ error: "mock invalid sender" }, { status: 422 }),
    );
    const data = submission();
    assert.equal((await f.handler(request(data))).status, 502);
    assert.equal((await f.handler(request(data))).status, 502);
    assert.equal(f.messages.length, 1);
  },
);

test(
  "real Redis Lua: 23-hour uncertain requests require manual review before provider deduplication expires",
  options,
  async () => {
    const f = integration(async () => {
      throw new Error("mock timeout");
    });
    const data = submission();
    assert.equal((await f.handler(request(data))).status, 504);
    const stateKey = f.redisCommands[0][3];
    const state = JSON.parse(await command(["GET", stateKey]));
    state.created_at -= 82801;
    await command(["SET", stateKey, JSON.stringify(state), "EX", 86400]);
    const response = await f.handler(request(data));
    assert.equal(response.status, 409);
    assert.equal((await response.json()).code, "review_required");
    assert.equal(f.messages.length, 1);
  },
);

test(
  "real Redis Lua: stored state contains only pseudonymous metadata and expires within 48 hours",
  options,
  async () => {
    const f = integration();
    const data = submission();
    assert.equal((await f.handler(request(data))).status, 200);
    const stateKey = f.redisCommands[0][3];
    const raw = await command(["GET", stateKey]);
    const state = JSON.parse(raw);
    assert.equal(state.status, "accepted");
    assert.ok(!raw.includes(data.name));
    assert.ok(!raw.includes(data.email));
    assert.ok(!raw.includes(data.idempotency_key));
    const ttl = await command(["TTL", stateKey]);
    assert.ok(ttl > 0 && ttl <= 172800);
  },
);
