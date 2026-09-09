// Run against the completed LOCAL production build only:
// ROTY_TEST_URL=http://127.0.0.1:4173 node tests/seo.mjs
// Optional: ROTY_TEST_GSC_TOKEN=<public token expected from Search Console>.
// This checks server-rendered HTML with browser JavaScript disabled. It cannot
// prove Google ownership validation, indexing, ranking, or factual truth beyond
// the explicit, source-reviewed content contract below. No forms are submitted.
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const requestedBase = process.env.ROTY_TEST_URL || "http://127.0.0.1:4173";
const localOrigin = /^http:\/\/(127\.0\.0\.1|localhost):(\d+)$/.exec(requestedBase);
if (!localOrigin)
  throw new Error("SEO verification requires a local HTTP origin with an explicit port");
assert.ok(
  Number(localOrigin[2]) > 0 && Number(localOrigin[2]) <= 65535,
  "Valid local port required",
);
const base = new URL(requestedBase).origin;
const canonicalOrigin = "https://www.les-terrasses-du-roty.fr";
// Independently obtained on 2026-09-09 from the new URL-prefix property's HTML
// tag dialog in Search Console, not inferred from the application under test.
// Its presence proves deployment of the token, not ownership validation.
const expectedVerification =
  process.env.ROTY_TEST_GSC_TOKEN || "85RkIRx_0r7ElaMnrtFrwymUhGG2kCusNroF9-TvVaA";
assert.match(expectedVerification, /^[A-Za-z0-9_-]{20,200}$/, "Valid public GSC token required");
const expectedPaths = [
  "/",
  "/domaine/",
  "/terrasses-pierre-seche/",
  "/vins/",
  "/vins/cuvee-2024/",
  "/vins/cuvee-2023/",
  "/professionnels/",
  "/demande/",
  "/journal/",
  "/mentions-legales/",
  "/confidentialite/",
  "/conditions-de-vente/",
  "/journal/acheter-vin-direct-producteur-allier/",
  "/journal/vin-bio-pres-saint-pourcain/",
  "/journal/vignes-terrasses-pierre-seche-roty/",
  "/journal/syrah-saulcet-allier/",
  "/journal/cavistes-restaurateurs-syrah-roty/",
  "/journal/vinification-vendanges-maceration-elevage/",
  "/journal/vendanges-2024/",
];
const report = {
  checkedAt: new Date().toISOString(),
  base,
  target: "Local production SSR, JavaScript disabled, external browser requests blocked",
  pages: [],
  checks: [],
  passed: false,
};
let browser;

function one(values, label) {
  assert.equal(values.length, 1, `${label}: expected exactly one value`);
  assert.ok(typeof values[0] === "string" && values[0].trim(), `${label}: empty value`);
  return values[0];
}
function previewHeaders(headers, label) {
  assert.match(headers.get("x-robots-tag") || "", /\bnoindex\b/i, `${label}: preview noindex`);
  assert.match(headers.get("x-robots-tag") || "", /\bnofollow\b/i, `${label}: preview nofollow`);
  assert.match(headers.get("cache-control") || "", /\bno-store\b/i, `${label}: preview no-store`);
}
async function localFetch(path, method = "GET") {
  const url = new URL(path, base);
  assert.equal(url.origin, base, "Never fetch a non-local URL from a sitemap or metadata");
  return fetch(url, { method, redirect: "manual", signal: AbortSignal.timeout(15_000) });
}
function nestedObjects(value) {
  if (Array.isArray(value)) return value.flatMap(nestedObjects);
  if (!value || typeof value !== "object") return [];
  return [value, ...Object.values(value).flatMap(nestedObjects)];
}
function normalize(value) {
  return value.replace(/\s+/gu, " ").trim();
}

try {
  const robotsResponse = await localFetch("/robots.txt");
  assert.equal(robotsResponse.status, 200, "robots.txt HTTP status");
  previewHeaders(robotsResponse.headers, "robots.txt");
  const robots = await robotsResponse.text();
  assert.match(robots, /^User-agent:\s*\*\s*$/im);
  assert.match(robots, /^Disallow:\s*\/\s*$/im);
  assert.doesNotMatch(robots, /^Allow:/im, "Preview must not advertise an allow rule");
  report.checks.push({ name: "Preview blocked by robots.txt and response headers", passed: true });

  const sitemapResponse = await localFetch("/sitemap.xml");
  assert.equal(sitemapResponse.status, 200, "sitemap.xml HTTP status");
  assert.match(sitemapResponse.headers.get("content-type") || "", /xml/i);
  previewHeaders(sitemapResponse.headers, "sitemap.xml");
  const sitemap = await sitemapResponse.text();
  browser = await chromium.launch({
    ...(process.env.ROTY_TEST_CHROMIUM === "1" ? {} : { channel: "chrome" }),
    headless: true,
  });
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const blockedExternal = new Set();
  await context.route("**/*", (route) => {
    if (new URL(route.request().url()).origin === base) return route.continue();
    blockedExternal.add(new URL(route.request().url()).origin);
    return route.abort();
  });
  const page = await context.newPage();
  const xml = await page.evaluate((source) => {
    const document = new DOMParser().parseFromString(source, "application/xml");
    return {
      invalid: !!document.querySelector("parsererror"),
      namespace: document.documentElement.namespaceURI,
      root: document.documentElement.localName,
      urls: [...document.querySelectorAll("url > loc")].map((node) => node.textContent),
      lastmodCount: document.querySelectorAll("lastmod").length,
    };
  }, sitemap);
  assert.equal(xml.invalid, false, "Sitemap must be valid XML");
  assert.equal(xml.root, "urlset");
  assert.equal(xml.namespace, "http://www.sitemaps.org/schemas/sitemap/0.9");
  assert.equal(xml.lastmodCount, 0, "Do not invent sitemap modification dates");
  assert.deepEqual(
    [...xml.urls].sort(),
    expectedPaths.map((path) => canonicalOrigin + path).sort(),
    "Sitemap must contain exactly the 19 reviewed canonical pages, without duplicates",
  );
  report.checks.push({ name: "Valid sitemap with all 19 unique canonical URLs", passed: true });

  const imagePaths = new Set();
  const seen = { title: new Set(), description: new Set(), canonical: new Set() };
  for (const path of expectedPaths) {
    // The response is consumed independently of DOM rendering; the browser is
    // used for standards-based parsing and computed visibility, never hydration.
    const response = await localFetch(path);
    assert.equal(response.status, 200, `${path}: direct canonical route must return 200`);
    previewHeaders(response.headers, path);
    assert.match(response.headers.get("content-type") || "", /text\/html/i);
    const html = await response.text();
    assert.match(html, /<\/html>/i, `${path}: complete SSR stream`);
    assert.doesNotMatch(
      html,
      /\/@vite\/client|\/src\/routes\//,
      `${path}: production build required`,
    );
    await page.goto(base + path, { waitUntil: "load", timeout: 15_000 });
    assert.equal(page.url(), base + path, `${path}: unexpected browser redirect`);
    const data = await page.evaluate(() => {
      const all = (selector, attribute) =>
        [...document.head.querySelectorAll(selector)].map((node) =>
          attribute ? node.getAttribute(attribute) : node.textContent,
        );
      const metas = (name) => all(`meta[name="${name}"]`, "content");
      const properties = (name) => all(`meta[property="${name}"]`, "content");
      // Restrict this heuristic to substantive editorial blocks in main. A
      // responsive navigation, decorative vintage, honeypot and screen-reader
      // labels are legitimate and are not hidden SEO paragraphs.
      const hiddenEditorial = [
        ...document.querySelectorAll("main h1, main h2, main h3, main p, main li"),
      ]
        .filter((node) => (node.textContent || "").trim().length > 15)
        .filter((node) => !node.closest("form, nav, [data-form-honeypot]"))
        .filter((node) => {
          const rect = node.getBoundingClientRect();
          if (rect.width < 2 || rect.height < 2 || rect.right < -1000) return true;
          for (
            let current = node;
            current && current !== document.body;
            current = current.parentElement
          ) {
            const style = getComputedStyle(current);
            if (
              style.display === "none" ||
              style.visibility === "hidden" ||
              Number(style.opacity) === 0
            )
              return true;
          }
          return Number.parseFloat(getComputedStyle(node).fontSize) < 6;
        })
        .map((node) => ({ tag: node.tagName, text: node.textContent.trim().slice(0, 120) }));
      return {
        lang: document.documentElement.lang,
        title: all("title"),
        description: metas("description"),
        canonical: all('link[rel="canonical"]', "href"),
        verification: metas("google-site-verification"),
        robots: metas("robots"),
        ogTitle: properties("og:title"),
        ogDescription: properties("og:description"),
        ogUrl: properties("og:url"),
        ogType: properties("og:type"),
        ogImage: properties("og:image"),
        ogImageAlt: properties("og:image:alt"),
        twitterTitle: metas("twitter:title"),
        twitterDescription: metas("twitter:description"),
        twitterImage: metas("twitter:image"),
        json: [...document.querySelectorAll('script[type="application/ld+json"]')].map(
          (node) => node.textContent,
        ),
        h1: [...document.querySelectorAll("main h1")].map((node) => node.innerText),
        articleExcerpt: document.querySelector(".article-excerpt")?.innerText,
        articleText: document.querySelector("article .article-body")?.innerText,
        mainText: document.querySelector("main")?.innerText || "",
        hiddenEditorial,
        commerceLinks: [...document.querySelectorAll("a[href], form[action]")]
          .map((node) => node.getAttribute("href") || node.getAttribute("action"))
          .filter((href) =>
            /^(?:mailto:|\/(?:cart|checkout|checkouts|account|products)(?:\/|$))/.test(href),
          ),
      };
    });
    const canonical = canonicalOrigin + path;
    const title = one(data.title, `${path} title`);
    const description = one(data.description, `${path} description`);
    assert.ok(title.length > 20 && !/^Les Terrasses du Roty$/.test(title), `${path}: useful title`);
    assert.ok(description.length > 40, `${path}: useful description`);
    assert.equal(one(data.canonical, `${path} canonical`), canonical);
    assert.equal(one(data.verification, `${path} GSC token`), expectedVerification);
    assert.match(data.lang, /^fr(?:-|$)/i);
    assert.equal(data.h1.length, 1, `${path}: one server-rendered H1`);
    assert.ok(data.h1[0].trim() && data.mainText.length > 250, `${path}: substantive SSR content`);
    assert.deepEqual(data.hiddenEditorial, [], `${path}: hidden editorial content detected`);
    assert.deepEqual(data.commerceLinks, [], `${path}: removed commerce/mailto links`);
    assert.ok(
      data.robots.every((value) => !/(?:^|,)\s*(?:index|follow)\s*(?:,|$)/i.test(value)),
      `${path}: contradictory robots meta`,
    );
    for (const [kind, value] of Object.entries({ title, description, canonical })) {
      const key = normalize(value).toLocaleLowerCase("fr");
      assert.ok(!seen[kind].has(key), `${path}: duplicated ${kind}`);
      seen[kind].add(key);
    }
    assert.equal(one(data.ogTitle, `${path} OG title`), title);
    assert.equal(one(data.twitterTitle, `${path} Twitter title`), title);
    assert.equal(one(data.ogDescription, `${path} OG description`), description);
    assert.equal(one(data.twitterDescription, `${path} Twitter description`), description);
    assert.equal(one(data.ogUrl, `${path} OG URL`), canonical);
    const isArticle = path.startsWith("/journal/") && path !== "/journal/";
    assert.equal(one(data.ogType, `${path} OG type`), isArticle ? "article" : "website");
    const socialImage = one(data.ogImage, `${path} OG image`);
    assert.equal(one(data.twitterImage, `${path} Twitter image`), socialImage);
    one(data.ogImageAlt, `${path} OG image alternative text`);
    imagePaths.add(socialImage);

    const documents = data.json.map((text) => JSON.parse(text));
    assert.ok(documents.length >= 2, `${path}: Organization and WebSite JSON-LD required`);
    const nodes = documents.flatMap((document) => {
      assert.equal(document["@context"], "https://schema.org", `${path}: schema context`);
      return document["@graph"] || [document];
    });
    const allowedTypes = ["Organization", "WebSite", "BreadcrumbList", "BlogPosting"];
    assert.ok(
      nodes.every((node) => allowedTypes.includes(node["@type"])),
      `${path}: unreviewed schema type`,
    );
    for (const object of documents.flatMap(nestedObjects)) {
      assert.ok(
        !["Offer", "AggregateOffer", "AggregateRating", "Review", "Product", "Winery"].includes(
          object["@type"],
        ),
        `${path}: no unsupported offer, rating, product, or visitor-business schema`,
      );
      for (const key of [
        "offers",
        "aggregateRating",
        "review",
        "price",
        "priceCurrency",
        "availability",
        "award",
        "hasCertification",
        "openingHours",
        "openingHoursSpecification",
        "geo",
      ])
        assert.ok(
          !(key in object),
          `${path}: unverified commercial, certification, or local-business property ${key}`,
        );
    }
    const ofType = (type) => nodes.filter((node) => node["@type"] === type);
    assert.equal(ofType("Organization").length, 1, `${path}: one organization`);
    const organization = ofType("Organization")[0];
    assert.equal(organization["@id"], canonicalOrigin + "/#organisation");
    assert.equal(organization.name, "Les Terrasses du Roty");
    assert.equal(organization.legalName, "LES COTES DU ROTY");
    assert.equal(organization.taxID, "892392010");
    assert.equal(organization.url, canonicalOrigin + "/");
    assert.equal(organization.email, "taff.roty@gmail.com");
    assert.equal(organization.location?.address?.addressLocality, "Saulcet");
    assert.equal(organization.location?.address?.addressCountry, "FR");
    imagePaths.add(organization.logo);
    assert.equal(ofType("WebSite").length, 1, `${path}: one website`);
    const website = ofType("WebSite")[0];
    assert.equal(website["@id"], canonicalOrigin + "/#website");
    assert.equal(website.url, canonicalOrigin + "/");
    assert.equal(website.publisher?.["@id"], organization["@id"]);
    assert.equal(website.inLanguage, "fr-FR");
    const breadcrumbs = ofType("BreadcrumbList");
    // The editorial routes publish breadcrumb markup. Utility pages have a
    // visible trail but may omit this optional structured-data enhancement.
    const utilityPage = [
      "/demande/",
      "/mentions-legales/",
      "/confidentialite/",
      "/conditions-de-vente/",
    ].includes(path);
    if (utilityPage) assert.ok(breadcrumbs.length <= 1, `${path}: no duplicate breadcrumb schema`);
    else assert.equal(breadcrumbs.length, path === "/" ? 0 : 1, `${path}: breadcrumb schema count`);
    if (breadcrumbs.length) {
      const items = breadcrumbs[0].itemListElement;
      assert.ok(Array.isArray(items) && items.length >= 2, `${path}: breadcrumb items`);
      assert.equal(items[0].item, canonicalOrigin + "/");
      assert.equal(items.at(-1).item, canonical);
      items.forEach((item, index) => {
        assert.equal(item["@type"], "ListItem");
        assert.equal(item.position, index + 1, `${path}: breadcrumb position`);
        assert.ok(item.name?.trim());
        assert.ok(
          xml.urls.includes(item.item),
          `${path}: breadcrumb points outside reviewed pages`,
        );
      });
    }
    assert.equal(ofType("BlogPosting").length, isArticle ? 1 : 0, `${path}: article schema count`);
    if (isArticle) {
      const article = ofType("BlogPosting")[0];
      assert.equal(
        normalize(article.headline),
        normalize(data.h1[0]),
        `${path}: schema headline must be visible`,
      );
      assert.equal(article.description, description);
      // An excerpt may legitimately paraphrase the meta description (the two
      // preserved archives do). Require a visible intro, not verbatim duplication.
      assert.ok((data.articleExcerpt || "").trim().length > 40, `${path}: visible article intro`);
      assert.equal(article.mainEntityOfPage, canonical);
      assert.equal(article.publisher?.["@id"], organization["@id"]);
      assert.equal(article.inLanguage, "fr-FR");
      assert.ok(data.articleText?.length > 500, `${path}: article body available in initial HTML`);
      assert.ok(
        !article.author && !article.datePublished && !article.dateModified,
        `${path}: no invented author/publication date`,
      );
      imagePaths.add(article.image);
    }
    report.pages.push({
      path,
      title,
      description,
      canonical,
      h1: normalize(data.h1[0]),
      structuredTypes: nodes.map((node) => node["@type"]),
      hiddenEditorialBlocks: 0,
      verificationTokenMatches: true,
    });
  }
  for (const image of imagePaths) {
    const url = new URL(image);
    assert.equal(url.origin, canonicalOrigin, "Metadata image must use the canonical host");
    assert.ok(!url.search && !url.hash && url.pathname.startsWith("/assets/"));
    const response = await localFetch(url.pathname, "HEAD");
    assert.equal(response.status, 200, `Metadata image exists locally: ${url.pathname}`);
    assert.match(response.headers.get("content-type") || "", /^image\//i);
  }
  const queryPath = "/vins/?utm_source=seo-verification&cuvee=2024";
  await page.goto(base + queryPath, { waitUntil: "load" });
  assert.equal(
    await page.locator('link[rel="canonical"]').getAttribute("href"),
    canonicalOrigin + "/vins/",
  );
  assert.equal(
    await page.locator('meta[property="og:url"]').getAttribute("content"),
    canonicalOrigin + "/vins/",
  );
  report.checks.push({ name: "Canonical URLs ignore query parameters", passed: true });
  report.checks.push({
    name: "Unique titles, descriptions, canonicals and consistent social metadata on 19 SSR pages",
    passed: true,
  });
  report.checks.push({
    name: "JSON-LD parses and matches visible content and reviewed entity facts; no offer/review schema",
    passed: true,
  });
  report.checks.push({
    name: "Public GSC token matches the value obtained from Search Console; ownership validation not tested",
    passed: true,
  });
  report.checks.push({
    name: "All metadata image URLs resolve locally",
    count: imagePaths.size,
    passed: true,
  });
  report.blockedExternalOrigins = [...blockedExternal];
  assert.equal(
    blockedExternal.size,
    0,
    "SSR pages should not attempt external requests without JavaScript or consent",
  );
  report.passed = true;
} catch (error) {
  report.error = error instanceof Error ? error.stack : String(error);
  process.exitCode = 1;
} finally {
  await browser?.close();
  await mkdir(new URL("../test-results/", import.meta.url), { recursive: true });
  await writeFile(
    new URL("../test-results/seo.json", import.meta.url),
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(JSON.stringify(report, null, 2));
}
