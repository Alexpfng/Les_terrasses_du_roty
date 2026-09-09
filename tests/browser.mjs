import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
const base = process.env.ROTY_TEST_URL || "http://127.0.0.1:4173";
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(base))
  throw new Error("This test submits synthetic data: a loopback URL is required.");
await mkdir("test-results", { recursive: true });
const result = {
  base,
  checkedAt: new Date().toISOString(),
  pages: [],
  responsive: [],
  accessibility: [],
  noJavaScript: [],
  form: [],
  errors: [],
};
const browser = await chromium.launch({
  ...(process.env.ROTY_TEST_CHROMIUM === "1" ? {} : { channel: "chrome" }),
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const page = await context.newPage();
const pageErrors = [];
page.on("pageerror", (error) => pageErrors.push(error.message));
const sitemap = await (await fetch(base + "/sitemap.xml")).text();
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
try {
  for (const path of paths) {
    const response = await page.goto(base + path, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200, path);
    assert.equal(await page.locator("h1").count(), 1, path + " single h1");
    const canonical = await page.locator("link[rel=canonical]").getAttribute("href");
    assert.equal(canonical, "https://www.les-terrasses-du-roty.fr" + path, path + " canonical");
    const desc = await page.locator("meta[name=description]").getAttribute("content");
    assert.ok(desc.length > 40, path + " description");
    const links = await page
      .locator("a[href]")
      .evaluateAll((nodes) => nodes.map((n) => n.getAttribute("href")));
    assert.equal(
      links.filter((href) =>
        /^(?:mailto:|\/(?:cart|checkout|checkouts|account|products)(?:\/|$))/.test(href),
      ).length,
      0,
      path + " no commerce/mailto links",
    );
    for (const href of links.filter((href) => href.startsWith("/") && !href.startsWith("//"))) {
      const url = new URL(href, base);
      const linked = await fetch(base + url.pathname, { method: "HEAD" });
      assert.ok(linked.status < 400, path + " broken " + href + " " + linked.status);
    }
    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    scripts.forEach((text) => JSON.parse(text));
    result.pages.push({
      path,
      status: response.status(),
      title: await page.title(),
      canonical,
      structuredData: scripts.length,
      internalLinks: "passed",
    });
    for (const width of [360, 390, 768, 1280, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      const dimensions = await page.evaluate(() => ({
        viewport: innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
      }));
      assert.ok(
        dimensions.document <= width && dimensions.body <= width,
        path + " overflow " + width + " " + JSON.stringify(dimensions),
      );
      const greens = await page.evaluate(() =>
        [...document.querySelectorAll("body *")]
          .flatMap((el) =>
            ["color", "backgroundColor", "borderTopColor", "outlineColor"].map((key) => ({
              tag: el.tagName,
              key,
              value: getComputedStyle(el)[key],
            })),
          )
          .filter(({ value }) => {
            const rgb = value.match(/rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)/);
            return rgb && rgb[4] !== "0" && +rgb[2] > +rgb[1] + 20 && +rgb[2] > +rgb[3] + 20;
          }),
      );
      assert.equal(greens.length, 0, path + " green UI");
      result.responsive.push({ path, width, overflow: false, greenUI: false });
      if (path === "/")
        await page.screenshot({ path: `test-results/home-${width}.png`, fullPage: true });
    }
    await page.setViewportSize({ width: 390, height: 844 });
    const accessibility = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    result.accessibility.push({
      path,
      violations: accessibility.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => n.target),
      })),
    });
  }
  const nojs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const nojsPage = await nojs.newPage();
  for (const path of paths) {
    await nojsPage.goto(base + path);
    const text = await nojsPage.locator("main").innerText();
    assert.ok(text.length > 150, path + " nojs empty");
    assert.equal(await nojsPage.locator("h1").count(), 1);
    result.noJavaScript.push({ path, characters: text.length });
  }
  await nojsPage.goto(base + "/demande/");
  assert.equal(
    await nojsPage.locator("button[type=submit]").isDisabled(),
    true,
    "nojs must not submit PII in URL",
  );
  await nojsPage.screenshot({ path: "test-results/demande-no-js.png", fullPage: true });
  await nojs.close();
  await page.goto(base + "/demande/?cuvee=2024&profil=professionnel&objet=professionnel");
  await page.waitForFunction(() => !document.querySelector("button[type=submit]").disabled);
  assert.equal(await page.locator("#cuvee").inputValue(), "2024");
  assert.equal(await page.locator("#purpose").inputValue(), "professionnel");
  assert.equal(await page.locator("#company").count(), 1);
  result.form.push("Cuvee and professional context prefilled");
  await page.getByRole("button", { name: "Envoyer ma demande" }).click();
  await page.getByRole("alert").waitFor();
  assert.ok((await page.locator("#name").getAttribute("aria-invalid")) === "true");
  await page.waitForFunction(() => document.activeElement.getAttribute("role") === "alert");
  result.form.push("Accessible validation summary receives focus");
  await page.locator("#name").fill("TEST TECHNIQUE CODEX — NE PAS TRAITER");
  await page.locator("#email").fill("test-technique@example.com");
  await page.locator("#company").fill("Recette locale");
  await page
    .locator("#message")
    .fill("Test technique local. Aucun achat, aucune réservation, aucun prospect réel.");
  await page.locator("#is_adult").check();
  const apiResponse = page.waitForResponse(
    (r) => r.url().endsWith("/api/demandes") && r.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Envoyer ma demande" }).click();
  const failed = await apiResponse;
  assert.equal(failed.status(), 503, "Unconfigured provider must fail closed");
  await page.getByRole("alert").waitFor();
  assert.equal(await page.locator("#name").inputValue(), "TEST TECHNIQUE CODEX — NE PAS TRAITER");
  assert.equal(await page.getByText("Merci pour votre message.").count(), 0);
  result.form.push("Real endpoint 503: no success, input retained");
  await page.screenshot({ path: "test-results/demande-service-unavailable.png", fullPage: true });
  await page.goto(base + "/");
  await page.keyboard.press("Tab");
  assert.equal(await page.evaluate(() => document.activeElement.textContent), "Aller au contenu");
  await page.keyboard.press("Enter");
  assert.equal(await page.evaluate(() => document.activeElement.id), "contenu");
  result.form.push("Keyboard skip link reaches main");
  assert.equal(
    await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior),
    "auto",
  );
  result.form.push("Reduced motion disables smooth scroll");
  assert.deepEqual(pageErrors, [], "Browser exceptions");
  result.pageErrors = pageErrors;
  const violations = result.accessibility.flatMap((p) =>
    p.violations.map((v) => ({ ...v, path: p.path })),
  );
  assert.deepEqual(violations, [], "WCAG A/AA violations");
  result.status = "passed";
} catch (error) {
  result.status = "failed";
  result.errors.push(error.stack);
  process.exitCode = 1;
} finally {
  await writeFile("test-results/browser.json", JSON.stringify(result, null, 2));
  await browser.close();
  console.log(
    JSON.stringify(
      {
        status: result.status,
        pages: result.pages.length,
        responsive: result.responsive.length,
        axePages: result.accessibility.length,
        nojsPages: result.noJavaScript.length,
        form: result.form,
        errors: result.errors,
      },
      null,
      2,
    ),
  );
}
