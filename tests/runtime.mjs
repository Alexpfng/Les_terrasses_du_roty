import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile, access } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const entry = fileURLToPath(new URL("../.output/server/index.mjs", import.meta.url));
const instrumentation = fileURLToPath(new URL("./runtime-timers.mjs", import.meta.url));
const base = "http://127.0.0.1:4181";
const report = {
  checkedAt: new Date().toISOString(),
  base,
  target: "Real Node production build, instrumented SSR lifetime timers",
  checks: [],
  passed: false,
};
let child;
let stdout = "";
let stderr = "";

function snapshot() {
  return new Promise((resolve, reject) => {
    const requestId = randomUUID();
    const timeout = setTimeout(() => {
      child.off("message", listener);
      reject(new Error("No timer snapshot returned by the built server"));
    }, 3_000);
    const listener = (message) => {
      if (message?.type !== "roty-runtime-snapshot-result" || message.requestId !== requestId)
        return;
      clearTimeout(timeout);
      child.off("message", listener);
      const { type: _type, requestId: _requestId, ...counts } = message;
      resolve(counts);
    };
    child.on("message", listener);
    child.send({ type: "roty-runtime-snapshot", requestId });
  });
}

async function assertClean(label) {
  let counts;
  for (let attempt = 0; attempt < 25; attempt++) {
    counts = await snapshot();
    if (counts.active === 0) break;
    await delay(40);
  }
  assert.equal(counts.active, 0, `${label}: unfinished 120 s SSR timers ${JSON.stringify(counts)}`);
  assert.equal(counts.expired, 0, `${label}: SSR safety timer had to force cleanup`);
  assert.equal(counts.started, counts.cleared, `${label}: every created SSR timer was cleared`);
  report.checks.push({ name: label, passed: true, timers: counts });
  return counts;
}

try {
  await access(entry);
  const env = {
    ...process.env,
    HOST: "127.0.0.1",
    PORT: "4181",
    NODE_ENV: "production",
    ROTY_PREVIEW_MODE: "1",
  };
  // Test only a dedicated local process; do not carry preview credentials into
  // the test protocol or let an unrelated local process satisfy readiness.
  delete env.ROTY_PREVIEW_PASSWORD;
  delete env.ROTY_PREVIEW_USER;
  child = spawn(process.execPath, ["--import", instrumentation, entry], {
    cwd: root,
    env,
    stdio: ["ignore", "pipe", "pipe", "ipc"],
  });
  child.stdout.on("data", (chunk) => {
    stdout = (stdout + chunk.toString()).slice(-64_000);
  });
  child.stderr.on("data", (chunk) => {
    stderr = (stderr + chunk.toString()).slice(-64_000);
  });
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    if (child.exitCode !== null) throw new Error(`Built server exited before readiness: ${stderr}`);
    try {
      const response = await fetch(base + "/robots.txt", { signal: AbortSignal.timeout(300) });
      const body = await response.text();
      if (response.status === 200 && body.includes("Disallow: /")) {
        ready = true;
        break;
      }
    } catch {
      /* startup */
    }
    await delay(75);
  }
  assert.ok(ready, "Built server did not start on its dedicated test port");
  await assertClean("Before rendered requests");

  const paths = ["/", "/demande/", "/domaine/", "/vins/", "/professionnels/", "/journal/"];
  // Thirty parallel HEAD requests exercise cancellation/consumption across the
  // real React -> Node Readable -> Response bridge, not a hand-built stream.
  const headResponses = await Promise.all(
    Array.from({ length: 30 }, async (_, index) => {
      const path = paths[index % paths.length];
      const response = await fetch(base + path, {
        method: "HEAD",
        redirect: "manual",
        signal: AbortSignal.timeout(15_000),
      });
      assert.equal(response.status, 200, `HEAD ${path}`);
      assert.equal(await response.text(), "", `HEAD ${path} must have no body`);
      return { path, status: response.status, contentType: response.headers.get("content-type") };
    }),
  );
  const afterHeads = await assertClean("Thirty parallel HEAD responses release every SSR timer");
  assert.ok(
    afterHeads.started >= 30,
    "Instrumentation must observe SSR production timers; zero is not proof",
  );
  report.headRequests = headResponses.length;

  for (const path of paths) {
    const response = await fetch(base + path, { signal: AbortSignal.timeout(15_000) });
    const html = await response.text();
    assert.equal(response.status, 200, `GET ${path}`);
    assert.ok(html.includes("</html>"), `GET ${path}: complete HTML stream`);
    assert.equal(
      response.headers.get("content-type"),
      headResponses.find((item) => item.path === path).contentType,
      `HEAD and GET content type agree for ${path}`,
    );
  }
  await assertClean("Completed GET responses release every SSR timer");
  for (const [path, status] of [
    ["/runtime-inconnue-test/", 404],
    ["/cart", 410],
    ["/vins", 308],
  ]) {
    const response = await fetch(base + path, {
      method: "HEAD",
      redirect: "manual",
      signal: AbortSignal.timeout(15_000),
    });
    assert.equal(response.status, status, `HEAD ${path}`);
    assert.equal(await response.text(), "");
  }
  await assertClean("HEAD errors and redirects also release all SSR timers");
  assert.equal(stderr.trim(), "", `Unexpected server error output: ${stderr}`);
  assert.ok(
    !/SSR stream transform exceeded|Serialization timeout|Error in renderToPipeableStream|Error reading appStream|uncaught|unhandled/i.test(
      stdout,
    ),
    "Runtime emitted an SSR exception or forced cleanup warning",
  );
  report.checks.push({ name: "No runtime exceptions or forced cleanup warnings", passed: true });
  report.passed = true;
} catch (error) {
  report.error = error instanceof Error ? error.message : String(error);
  process.exitCode = 1;
} finally {
  if (child && child.exitCode === null) {
    const exited = new Promise((resolve) => child.once("exit", resolve));
    child.kill("SIGTERM");
    await Promise.race([exited, delay(2_000)]);
    if (child.exitCode === null) child.kill("SIGKILL");
  }
  report.serverStderr = stderr;
  await mkdir(new URL("../test-results/", import.meta.url), { recursive: true });
  await writeFile(
    new URL("../test-results/runtime.json", import.meta.url),
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(JSON.stringify(report, null, 2));
}
