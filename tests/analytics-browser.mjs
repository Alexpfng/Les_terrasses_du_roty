import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import ts from "typescript";
import { build } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

// Every URL, including Google's, is intercepted. No production property is
// contacted. The real controller runs on a canonical HTTPS document in Chrome.
const canonical = "https://www.les-terrasses-du-roty.fr";
const key = "roty-audience-choice-v1";
const id = "G-TEST123456";
const source = await readFile(new URL("../src/lib/analytics.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
}).outputText;
const uiBuild = await build({
  configFile: false,
  logLevel: "silent",
  plugins: [react()],
  resolve: { alias: { "@": fileURLToPath(new URL("../src/", import.meta.url)) } },
  define: { "process.env.NODE_ENV": '"production"' },
  build: {
    write: false,
    minify: false,
    lib: {
      entry: fileURLToPath(new URL("./analytics-ui-fixture.tsx", import.meta.url)),
      formats: ["es"],
      fileName: () => "fixture.js",
    },
  },
});
const uiBundle = (Array.isArray(uiBuild) ? uiBuild[0] : uiBuild).output.find(
  (item) => item.type === "chunk",
).code;
const consentCss = await readFile(new URL("../src/analytics.css", import.meta.url), "utf8");
const browser = await chromium.launch({
  ...(process.env.ROTY_TEST_CHROMIUM === "1" ? {} : { channel: "chrome" }),
  headless: true,
});
const report = {
  checkedAt: new Date().toISOString(),
  provider: "Mock Google tag; all external requests intercepted",
  checks: [],
  passed: false,
};

const mockGoogleTag = `
window.__googleCommands = window.__googleCommands || [];
const layer = window.dataLayer || (window.dataLayer = []);
const originalPush = Array.prototype.push;
let currentId = '';
function processCommand(entry) {
  const args = Array.from(entry);
  window.__googleCommands.push(args);
  if (args[0] === 'config') {
    currentId = args[1];
    if (!window['ga-disable-' + currentId]) document.cookie = '_ga=mock-test-only; Path=/; Secure; SameSite=Lax';
  }
  if (args[0] === 'event' && currentId && !window['ga-disable-' + currentId]) {
    fetch('https://www.google-analytics.com/g/collect', { method: 'POST', body: JSON.stringify(args), mode: 'no-cors', credentials: 'omit' });
  }
}
for (const item of layer) processCommand(item);
layer.push = (...items) => { for (const item of items) processCommand(item); return originalPush.apply(layer, items); };
`;

async function fixture(options = {}) {
  const origin = options.origin || canonical;
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const calls = [];
  const errors = [];
  let releaseGoogle;
  let releaseConfig;
  const googleGate = options.deferGoogle
    ? new Promise((resolve) => {
        releaseGoogle = resolve;
      })
    : Promise.resolve();
  const configGate = options.deferConfig
    ? new Promise((resolve) => {
        releaseConfig = resolve;
      })
    : Promise.resolve();
  if (options.preference)
    await context.addInitScript(
      ({ key, preference }) => localStorage.setItem(key, JSON.stringify(preference)),
      { key, preference: options.preference },
    );
  await context.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.origin === origin && url.pathname === "/analytics.js")
      return route.fulfill({ contentType: "text/javascript", body: compiled });
    if (url.origin === origin && url.pathname === "/fixture.js")
      return route.fulfill({ contentType: "text/javascript", body: uiBundle });
    if (url.origin === origin && url.pathname === "/api/demandes") {
      calls.push({ kind: "form", url: url.href, body: request.postData() });
      return route.fulfill({
        status: options.formStatus || 503,
        contentType: "application/json",
        body: JSON.stringify(
          options.formResponse || {
            status: "error",
            code: "service_unavailable",
            message: "TEST MOCK : service indisponible",
          },
        ),
      });
    }
    if (url.origin === origin && url.pathname === "/api/analytics-config") {
      calls.push({ kind: "config", url: url.href });
      await configGate;
      if (options.configFailure) return route.abort("failed").catch(() => {});
      return route
        .fulfill({
          status: options.configStatus || 200,
          contentType: "application/json",
          body: JSON.stringify(options.config ?? { enabled: true, measurementId: id }),
        })
        .catch(() => {});
    }
    if (url.hostname === "www.googletagmanager.com") {
      calls.push({ kind: "tag", url: url.href, headers: request.headers() });
      await googleGate;
      return route.fulfill({ contentType: "text/javascript", body: mockGoogleTag }).catch(() => {});
    }
    if (url.hostname === "www.google-analytics.com") {
      calls.push({ kind: "collect", url: url.href, body: request.postData() });
      return route.fulfill({ status: 204, body: "" });
    }
    if (url.origin === origin && options.ui)
      return route.fulfill({
        contentType: "text/html",
        body: `<!doctype html><html lang="fr"><head><title>Fixture React</title><style>${consentCss}</style></head><body><div id="fixture"></div><script type="module" src="/fixture.js"></script></body></html>`,
      });
    if (url.origin === origin)
      return route.fulfill({
        contentType: "text/html",
        body: `<!doctype html><html lang="fr"><head><title>Private title alice@example.org</title></head><body><input id="private" value="Texte à conserver"><script type="module">import { createAnalyticsController } from '/analytics.js'; window.controller=createAnalyticsController({ browser:window, allowedPaths:['/','/demande/','/vins/'] }); window.controller.initialize();</script></body></html>`,
      });
    calls.push({ kind: "unexpected", url: url.href });
    return route.abort();
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(
    origin + "/demande/?email=alice@example.org&secret=confidentiel#telephone=0600000000",
  );
  if (options.ui) await page.getByRole("button", { name: "Accepter", exact: true }).waitFor();
  else await page.waitForFunction(() => Boolean(window.controller));
  if (!options.ui && !options.deferConfig)
    await page.waitForFunction(() => window.controller.getState().ready);
  return {
    context,
    page,
    calls,
    errors,
    releaseGoogle: () => releaseGoogle?.(),
    releaseConfig: () => releaseConfig?.(),
    choose: (choice) => page.evaluate((value) => window.controller.choose(value), choice),
    events: () =>
      calls.filter((call) => call.kind === "collect").map((call) => JSON.parse(call.body)),
    close: async () => {
      releaseGoogle?.();
      releaseConfig?.();
      await context.close();
    },
  };
}

async function check(name, operation) {
  await operation();
  report.checks.push({ name, passed: true });
}
const stored = (choice, updatedAt = Date.now()) => ({
  version: 1,
  choice,
  updatedAt,
  expiresAt: updatedAt + 180 * 24 * 60 * 60 * 1000,
});

try {
  await check(
    "Before a choice: no Google request, cookie, event queue or consent storage write",
    async () => {
      const f = await fixture();
      try {
        await f.page.waitForTimeout(80);
        assert.equal(f.calls.filter((call) => call.kind !== "config").length, 0);
        assert.deepEqual(await f.context.cookies(), []);
        assert.equal(await f.page.evaluate(() => localStorage.length), 0);
        assert.equal(await f.page.evaluate(() => Boolean(window.dataLayer)), false);
        assert.equal(
          await f.page.evaluate(() =>
            window.controller.event("form_start", { profile: "particulier" }),
          ),
          false,
        );
      } finally {
        await f.close();
      }
    },
  );
  await check(
    "Refusal persists for the same duration and a later page load still makes no Google request",
    async () => {
      const f = await fixture();
      try {
        await f.choose("refused");
        const preference = await f.page.evaluate(
          (name) => JSON.parse(localStorage.getItem(name)),
          key,
        );
        assert.equal(preference.choice, "refused");
        assert.equal(preference.expiresAt - preference.updatedAt, 180 * 24 * 60 * 60 * 1000);
        await f.page.reload();
        await f.page.waitForFunction(() => window.controller?.getState().ready);
        assert.equal(
          f.calls.filter((call) => call.kind === "tag" || call.kind === "collect").length,
          0,
        );
        assert.deepEqual(await f.context.cookies(), []);
      } finally {
        await f.close();
      }
    },
  );
  await check(
    "After acceptance: one page view, safe SPA navigation, no query/hash/title/referrer/form PII",
    async () => {
      const f = await fixture();
      try {
        await f.choose("accepted");
        await f.page.waitForFunction(() =>
          window.__googleCommands?.some((entry) => entry[0] === "event"),
        );
        await f.page.evaluate(() => {
          window.controller.pageView("/demande/?email=other@example.org#secret");
          window.controller.pageView("/vins/?secret=private#alice@example.org");
          window.controller.event("form_start", {
            profile: "restaurateur",
            cuvee: "2024",
            email: "alice@example.org",
            name: "Private",
            message: "confidentiel",
          });
          window.controller.event("generate_lead", {
            profile: "alice@example.org",
            cuvee: "confidentiel",
            request_id: "PRIVATE-ID",
          });
        });
        await f.page.waitForTimeout(80);
        const events = f.events();
        assert.equal(events.filter((event) => event[1] === "page_view").length, 2);
        assert.equal(events.filter((event) => event[1] === "generate_lead").length, 1);
        assert.equal(events[1][2].page_referrer, canonical + "/demande/");
        const data = JSON.stringify(await f.page.evaluate(() => window.__googleCommands));
        assert.ok(!/alice|confidentiel|PRIVATE-ID|0600000000|\?|#/.test(data), data);
        assert.equal(
          events.find((event) => event[1] === "form_start")[2].visitor_profile,
          "restaurateur",
        );
        assert.ok((await f.context.cookies()).some((cookie) => cookie.name === "_ga"));
        const tag = f.calls.find((call) => call.kind === "tag");
        assert.equal(tag.headers.referer, undefined);
        const configuration = (await f.page.evaluate(() => window.__googleCommands)).find(
          (entry) => entry[0] === "config",
        )[2];
        assert.equal(configuration.send_page_view, false);
        assert.equal(configuration.allow_google_signals, false);
        assert.equal(configuration.allow_ad_personalization_signals, false);
        assert.deepEqual(f.errors, []);
      } finally {
        await f.close();
      }
    },
  );
  await check(
    "Withdrawal disables GA immediately, deletes its cookies/tag, sends no denial ping and preserves entered form text",
    async () => {
      const f = await fixture();
      try {
        await f.choose("accepted");
        await f.page.waitForFunction(() =>
          window.__googleCommands?.some((entry) => entry[0] === "event"),
        );
        await f.page.waitForTimeout(50);
        const count = f.events().length;
        const commandCount = await f.page.evaluate(() => window.__googleCommands.length);
        await f.page.locator("#private").fill("Saisie confidentielle à conserver");
        await f.choose("refused");
        await f.page.evaluate(() => {
          window.controller.pageView("/vins/");
          window.controller.event("generate_lead", { profile: "particulier" });
        });
        await f.page.waitForTimeout(80);
        assert.equal(await f.page.evaluate((id) => window["ga-disable-" + id], id), true);
        assert.equal(
          await f.page.locator("#private").inputValue(),
          "Saisie confidentielle à conserver",
        );
        assert.equal(await f.page.locator("#roty-google-analytics").count(), 0);
        assert.equal(
          (await f.context.cookies()).filter((cookie) => cookie.name.startsWith("_ga")).length,
          0,
        );
        assert.equal(f.events().length, count);
        assert.equal(await f.page.evaluate(() => window.__googleCommands.length), commandCount);
        await f.page.reload();
        await f.page.waitForFunction(() => window.controller?.getState().ready);
        assert.equal(f.calls.filter((call) => call.kind === "tag").length, 1);
      } finally {
        await f.close();
      }
    },
  );
  await check(
    "Stored acceptance cannot bypass missing/invalid/disabled/failing server configuration",
    async () => {
      for (const option of [
        { config: { enabled: false, measurementId: id } },
        { config: { enabled: true, measurementId: "UA-123456-1" } },
        { configFailure: true },
        { configStatus: 503 },
      ]) {
        const f = await fixture({ ...option, preference: stored("accepted") });
        try {
          assert.equal(await f.page.evaluate(() => window.controller.getState().available), false);
          assert.equal(
            f.calls.filter((call) => call.kind === "tag" || call.kind === "collect").length,
            0,
          );
        } finally {
          await f.close();
        }
      }
    },
  );
  await check(
    "Preview and HTTP hosts do not initialize GA, even with stored acceptance",
    async () => {
      for (const origin of [
        "https://preview.example.test",
        "http://www.les-terrasses-du-roty.fr",
        "http://127.0.0.1:4173",
      ]) {
        const f = await fixture({ origin, preference: stored("accepted") });
        try {
          assert.equal(f.calls.length, 0);
        } finally {
          await f.close();
        }
      }
    },
  );
  await check(
    "Accept then withdraw while config is pending: no tag is ever requested",
    async () => {
      const f = await fixture({ deferConfig: true });
      try {
        await f.choose("accepted");
        await f.choose("refused");
        f.releaseConfig();
        await f.page.waitForFunction(() => window.controller.getState().ready);
        assert.equal(
          f.calls.filter((call) => call.kind === "tag" || call.kind === "collect").length,
          0,
        );
      } finally {
        await f.close();
      }
    },
  );
  await check(
    "Accept then withdraw while Google script is loading: late completion cannot configure or send",
    async () => {
      const f = await fixture({ deferGoogle: true });
      try {
        await f.choose("accepted");
        await f.page.waitForFunction(() =>
          Boolean(document.querySelector("#roty-google-analytics")),
        );
        await f.choose("refused");
        f.releaseGoogle();
        await f.page.waitForTimeout(120);
        assert.equal(f.events().length, 0);
        assert.equal(
          (await f.context.cookies()).filter((cookie) => cookie.name.startsWith("_ga")).length,
          0,
        );
        assert.equal(await f.page.evaluate((id) => window["ga-disable-" + id], id), true);
      } finally {
        await f.close();
      }
    },
  );
  await check("Expired stored consent requires a fresh choice", async () => {
    const f = await fixture({
      preference: stored("accepted", Date.now() - 181 * 24 * 60 * 60 * 1000),
    });
    try {
      assert.equal(await f.page.evaluate(() => window.controller.getState().choice), "unknown");
      assert.equal(await f.page.evaluate((key) => localStorage.getItem(key), key), null);
      assert.equal(f.calls.filter((call) => call.kind === "tag").length, 0);
    } finally {
      await f.close();
    }
  });
  await check(
    "Reacceptance after withdrawal reuses a loaded tag without duplicate page views",
    async () => {
      const f = await fixture();
      try {
        await f.choose("accepted");
        await f.page.waitForFunction(() =>
          window.__googleCommands?.some((entry) => entry[0] === "event"),
        );
        await f.page.evaluate(() => {
          window.obsoleteGoogleLoad = document.querySelector("#roty-google-analytics").onload;
        });
        await f.choose("refused");
        await f.choose("accepted");
        await f.page.evaluate(() => window.obsoleteGoogleLoad());
        await f.page.waitForTimeout(80);
        assert.equal(await f.page.evaluate((id) => window["ga-disable-" + id], id), false);
        assert.equal(f.calls.filter((call) => call.kind === "tag").length, 1);
        assert.equal(f.events().filter((event) => event[1] === "page_view").length, 2);
        assert.deepEqual(f.errors, []);
      } finally {
        await f.close();
      }
    },
  );
  await check("An unlisted path containing personal data does not start Google", async () => {
    const f = await fixture();
    try {
      await f.page.evaluate(() => window.controller.pageView("/alice@example.org/"));
      await f.choose("accepted");
      assert.equal(f.calls.filter((call) => call.kind === "tag").length, 0);
    } finally {
      await f.close();
    }
  });
  await check(
    "Real React consent UI: equally presented acceptance/refusal, preferences keyboard access and no Google on refusal",
    async () => {
      const f = await fixture({ ui: true });
      try {
        const accept = f.page.getByRole("button", { name: "Accepter", exact: true });
        const refuse = f.page.getByRole("button", { name: "Refuser", exact: true });
        const a = await accept.evaluate((el) => ({
          width: el.getBoundingClientRect().width,
          background: getComputedStyle(el).backgroundColor,
          color: getComputedStyle(el).color,
        }));
        const r = await refuse.evaluate((el) => ({
          width: el.getBoundingClientRect().width,
          background: getComputedStyle(el).backgroundColor,
          color: getComputedStyle(el).color,
        }));
        assert.deepEqual(a, r);
        await refuse.click();
        assert.equal(f.calls.filter((call) => call.kind === "tag").length, 0);
        await f.page.getByRole("button", { name: "Gérer les cookies" }).click();
        await f.page.waitForFunction(() =>
          document.activeElement?.classList.contains("analytics-consent"),
        );
        await f.page.keyboard.press("Tab");
        assert.equal(
          await f.page.evaluate(() => document.activeElement?.textContent),
          "Informations sur vos données",
        );
        await refuse.click();
        assert.equal(
          await f.page.evaluate(() => document.activeElement?.textContent?.trim()),
          "Gérer les cookies",
        );
        assert.deepEqual(f.errors, []);
      } finally {
        await f.close();
      }
    },
  );
  await check(
    "Real DemandeForm: focus and validation/errors never produce a lead; only true accepted response does",
    async () => {
      for (const [formStatus, formResponse, expectedLead] of [
        [503, { status: "error", message: "TEST MOCK indisponible" }, 0],
        [504, { status: "uncertain", request_id: "test-id", message: "TEST MOCK incertain" }, 0],
        [200, { status: "accepted" }, 0],
        [200, { status: "accepted", request_id: "438cdefa-f91f-443e-85ce-b17cc8d5f8ac" }, 1],
      ]) {
        const f = await fixture({ ui: true, formStatus, formResponse });
        try {
          await f.page.getByRole("button", { name: "Accepter", exact: true }).click();
          await f.page.waitForFunction(() =>
            window.__googleCommands?.some((entry) => entry[0] === "event"),
          );
          await f.page.locator("#name").focus();
          assert.equal(f.events().filter((event) => event[1] === "form_start").length, 0);
          await f.page.getByRole("button", { name: "Envoyer ma demande" }).click();
          await f.page.getByRole("alert").waitFor();
          assert.equal(f.events().filter((event) => event[1] === "generate_lead").length, 0);
          await f.page.locator("#name").fill("TEST TECHNIQUE ALICE");
          await f.page.locator("#email").fill("alice@example.org");
          await f.page.locator("#cuvee").selectOption("2024");
          await f.page.locator("#message").fill("Contenu confidentiel TEST MOCK");
          await f.page.locator("#is_adult").check();
          await f.page.getByRole("button", { name: "Envoyer ma demande" }).click();
          if (expectedLead)
            await f.page.getByRole("heading", { name: "Merci pour votre message." }).waitFor();
          else await f.page.getByRole("alert").waitFor();
          await f.page.waitForTimeout(80);
          const events = f.events();
          assert.equal(events.filter((event) => event[1] === "form_start").length, 1);
          assert.equal(events.filter((event) => event[1] === "generate_lead").length, expectedLead);
          assert.ok(
            !/ALICE|alice@example|confidentiel|438cdefa|test-id/.test(JSON.stringify(events)),
          );
          assert.deepEqual(f.errors, []);
        } finally {
          await f.close();
        }
      }
    },
  );
  await check(
    "Caviste and restaurateur choices reveal company, select professional purpose and send the correct categorical profile",
    async () => {
      for (const [profile, label] of [
        ["caviste", "Caviste"],
        ["restaurateur", "Restaurateur"],
      ]) {
        const f = await fixture({ ui: true });
        try {
          await f.page.getByRole("button", { name: "Refuser", exact: true }).click();
          await f.page.getByRole("radio", { name: label, exact: true }).check();
          assert.equal(await f.page.locator("#purpose").inputValue(), "professionnel");
          await f.page.locator("#company").fill("Établissement TEST");
          await f.page.locator("#name").fill("TEST TECHNIQUE");
          await f.page.locator("#email").fill("test-technique@example.org");
          await f.page.locator("#is_adult").check();
          await f.page.getByRole("button", { name: "Envoyer ma demande" }).click();
          await f.page.getByRole("alert").waitFor();
          const payload = JSON.parse(f.calls.find((call) => call.kind === "form").body);
          assert.equal(payload.profile, profile);
          assert.equal(payload.purpose, "professionnel");
          assert.equal(payload.company, "Établissement TEST");
          assert.equal(f.calls.filter((call) => call.kind === "tag").length, 0);
        } finally {
          await f.close();
        }
      }
    },
  );
  report.passed = true;
} catch (error) {
  report.error = error instanceof Error ? error.message : String(error);
  process.exitCode = 1;
} finally {
  await browser.close();
  await mkdir(new URL("../test-results/", import.meta.url), { recursive: true });
  await writeFile(
    new URL("../test-results/analytics.json", import.meta.url),
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(JSON.stringify(report, null, 2));
}
