import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { chromium } from "playwright";

const base = process.env.ROTY_TEST_URL || "http://127.0.0.1:4173";
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(base))
  throw new Error("Photo verification requires a local production build.");
const report = {
  base,
  checkedAt: new Date().toISOString(),
  pages: [],
  variants: [],
  gallery: [],
  externalRequests: [],
  browserErrors: [],
  passed: false,
};
const browser = await chromium.launch({
  ...(process.env.ROTY_TEST_CHROMIUM === "1" ? {} : { channel: "chrome" }),
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  reducedMotion: "reduce",
});
await context.route("**/*", (route) => {
  if (new URL(route.request().url()).origin === base) return route.continue();
  report.externalRequests.push(route.request().url());
  return route.abort();
});
const page = await context.newPage();
page.on("pageerror", (error) => report.browserErrors.push(error.message));
const allVariants = new Set();
try {
  // Independently compared with the owner's original black vector on 2026-09-09.
  // Keep the reviewed fingerprint in CI without requiring a personal file path.
  const officialLogoPath = "/assets/img/logo-etiquette-black.svg";
  const expectedLogoSha256 = "7badf9367db345b8367a2a5af016fb2b768ac9ddfdb453485dc9557d86de16cd";
  const logoResponse = await fetch(base + officialLogoPath);
  assert.equal(logoResponse.status, 200);
  assert.match(logoResponse.headers.get("content-type") || "", /image\/svg\+xml/);
  const logoSha256 = createHash("sha256")
    .update(Buffer.from(await logoResponse.arrayBuffer()))
    .digest("hex");
  assert.equal(
    logoSha256,
    expectedLogoSha256,
    "Complete black logo matches the official source byte for byte",
  );
  report.officialLogo = {
    path: officialLogoPath,
    sha256: logoSha256,
    originalBytesPreserved: true,
    placements: [],
  };
  const sitemap = await (await fetch(base + "/sitemap.xml")).text();
  const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => new URL(match[1]).pathname,
  );
  assert.equal(paths.length, 19);
  for (const path of paths) {
    const response = await page.goto(base + path, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200, path);
    const photographs = await page.locator("main picture img").evaluateAll((nodes) =>
      nodes.map((node) => ({
        source: new URL(node.src).pathname,
        name: new URL(node.src).pathname.replace(/^.*\//, "").replace(/-\d+\.[^.]+$/, ""),
        alt: node.alt,
      })),
    );
    const names = photographs.map((photo) => photo.name);
    assert.equal(new Set(names).size, names.length, `${path}: photograph repeated within page`);
    const variants = await page.locator("main picture").evaluateAll((pictures) =>
      pictures.flatMap((picture) => [
        picture.querySelector("img").getAttribute("src"),
        ...[...picture.querySelectorAll("source")].flatMap((source) =>
          source
            .getAttribute("srcset")
            .split(",")
            .map((entry) => entry.trim().split(/\s+/)[0]),
        ),
      ]),
    );
    variants.forEach((path) => allVariants.add(path));
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      for (
        let y = 0;
        y < (await page.evaluate(() => document.documentElement.scrollHeight));
        y += 650
      )
        await page.evaluate(async (top) => {
          window.scrollTo(0, top);
          // Allow intersection observers and native lazy loading to observe each
          // viewport instead of jumping through the whole page in one frame.
          await new Promise(requestAnimationFrame);
          await new Promise(requestAnimationFrame);
        }, y);
      await page.evaluate(() => {
        for (const gallery of document.querySelectorAll(".home-work-grid"))
          gallery.scrollLeft = gallery.scrollWidth;
      });
      await page.waitForFunction(() =>
        [...document.querySelectorAll("main picture img")].every(
          (image) => image.complete && image.naturalWidth > 0,
        ),
      );
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        true,
        `${path}: body overflow at ${width}px`,
      );
    }
    report.pages.push({ path, photographs, duplicatePhotographs: 0, loadedWidths: [390, 1440] });
  }
  // Decode every picture variant, not only the format selected by Chrome. The
  // 1600px JPEG is also used in OG/JSON-LD and must remain a genuine image.
  for (const path of [...allVariants])
    if (/-800\.jpg$/.test(path)) allVariants.add(path.replace(/-800\.jpg$/, "-1600.jpg"));
  for (const path of allVariants) {
    assert.ok(path.startsWith("/assets/img/"), "Photo URLs remain local");
    const decoded = await page.evaluate(async (path) => {
      const image = new Image();
      image.src = path;
      await image.decode();
      return { width: image.naturalWidth, height: image.naturalHeight };
    }, path);
    assert.ok(decoded.width > 0 && decoded.height > 0, `${path}: decodable image`);
    report.variants.push({ path, ...decoded, decoded: true });
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + "/", { waitUntil: "networkidle" });
  for (const selector of [".shell-header .shell-brand", "#mobile-nav .shell-brand"]) {
    const brand = page.locator(selector);
    assert.equal(await brand.locator("img").count(), 1, "One complete official logo per brand");
    assert.equal(await brand.locator("img").getAttribute("src"), officialLogoPath);
    assert.equal(
      (await brand.textContent()).trim(),
      "",
      "No substituted lettering beside the official composition",
    );
    await brand.locator("img").evaluate((image) => image.decode());
    report.officialLogo.placements.push({
      selector,
      completeOfficialLogo: true,
      imageDecoded: true,
    });
  }
  report.headerBackdropFilter = await page
    .locator(".shell-header")
    .evaluate((node) => getComputedStyle(node).backdropFilter);
  assert.match(report.headerBackdropFilter, /saturate\(1\.4\)/);
  assert.match(report.headerBackdropFilter, /blur\(20px\)/);
  const gallery = page.locator(".home-work-grid");
  const cards = gallery.locator("figure");
  const links = gallery.locator("a[href]");
  assert.equal(await cards.count(), 3);
  assert.equal(await links.count(), 3);
  assert.equal(
    await gallery.evaluate((node) => node.scrollWidth > node.clientWidth),
    true,
    "Mobile gallery provides an internal horizontal scroll area",
  );
  await gallery.evaluate((node) => (node.scrollLeft = 0));
  await cards.first().scrollIntoViewIfNeeded();
  for (let index = 0; index < 3; index++) {
    if (index === 0) await links.first().focus();
    else await page.keyboard.press("Tab");
    assert.equal(
      await links.nth(index).evaluate((node) => document.activeElement === node),
      true,
      "Tab follows the three gallery links in reading order",
    );
    await page.waitForFunction(
      (index) => {
        const gallery = document.querySelector(".home-work-grid");
        const card = gallery.querySelectorAll("figure")[index].getBoundingClientRect();
        const bounds = gallery.getBoundingClientRect();
        return card.left >= bounds.left - 1 && card.right <= bounds.right + 1;
      },
      index,
      { timeout: 3000 },
    );
    const visibility = await links.nth(index).evaluate((node) => {
      const rect = node.getBoundingClientRect();
      const parent = node.closest(".home-work-grid").getBoundingClientRect();
      return {
        left: rect.left,
        right: rect.right,
        galleryLeft: parent.left,
        galleryRight: parent.right,
      };
    });
    assert.ok(
      visibility.left >= visibility.galleryLeft - 1 &&
        visibility.right <= visibility.galleryRight + 1,
      `Focused gallery link ${index + 1} is revealed without manual scroll`,
    );
    report.gallery.push({ card: index + 1, keyboardRevealed: true, fullCardVisible: true });
  }
  assert.ok(await gallery.evaluate((node) => node.scrollLeft > 0));
  // Explicit DOM scroll is used for inspection; this is not a claim of a native
  // touch swipe on a physical mobile device.
  await gallery.evaluate((node) => (node.scrollLeft = node.scrollWidth));
  await page.waitForFunction(() => {
    const gallery = document.querySelector(".home-work-grid");
    return gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 2;
  });
  const lastImage = cards.last().locator("img");
  assert.equal(await lastImage.evaluate((image) => image.complete && image.naturalWidth > 0), true);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  report.galleryInspection = "Third figure reached through internal DOM scroll; no body overflow";
  await mkdir("test-results", { recursive: true });
  await page.screenshot({ path: "test-results/photos-gallery-third-390.png", fullPage: false });
  assert.deepEqual(report.externalRequests, []);
  assert.deepEqual(report.browserErrors, []);
  report.passed = true;
} catch (error) {
  report.error = error.stack;
  process.exitCode = 1;
} finally {
  await writeFile("test-results/photos.json", JSON.stringify(report, null, 2));
  await browser.close();
  console.log(
    JSON.stringify(
      {
        passed: report.passed,
        pages: report.pages.length,
        variants: report.variants.length,
        gallery: report.gallery,
        headerBackdropFilter: report.headerBackdropFilter,
        error: report.error,
      },
      null,
      2,
    ),
  );
}
