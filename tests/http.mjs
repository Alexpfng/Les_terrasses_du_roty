import assert from "node:assert/strict";
import { writeFile, mkdir, readFile, readdir } from "node:fs/promises";
import path from "node:path";
const base = process.env.ROTY_TEST_URL || "http://127.0.0.1:4173";
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(base))
  throw new Error("Loopback test target required");
const results = { checkedAt: new Date().toISOString(), base, checks: [] };
const checks = [
  ["/products/les-terrasses-du-roty-cuvee-2023", 301, "/vins/cuvee-2023/"],
  ["/products/cuvee-2024-les-terrasses-du-roty-precommande", 301, "/vins/cuvee-2024/"],
  ["/collections/all", 301, "/vins/"],
  ["/collections/cuvees-2023", 301, "/vins/cuvee-2023/"],
  ["/collections/frontpage", 301, "/vins/cuvee-2023/"],
  ["/pages/contact", 301, "/demande/"],
  ["/blogs/infos", 301, "/journal/"],
  ["/blogs/infos/l-origine-des-terrasses-du-roty", 301, "/domaine/"],
  [
    "/blogs/infos/la-syrah-un-cepage-noble-du-sud-qui-s-epanouit-au-coeur-du-bourbonnais",
    301,
    "/journal/syrah-saulcet-allier/",
  ],
  [
    "/blogs/infos/vendanges-2024-une-cuvee-qui-s-annonce-exceptionnelle-%F0%9F%8D%87",
    301,
    "/journal/vendanges-2024/",
  ],
  [
    "/blogs/infos/l-art-de-la-vinification-vendanges-maceration-et-elevage",
    301,
    "/journal/vinification-vendanges-maceration-elevage/",
  ],
  ["/blogs/vendanges-2024", 301, "/journal/vendanges-2024/"],
  ["/policies/legal-notice", 301, "/mentions-legales/"],
  ["/policies/privacy-policy", 301, "/confidentialite/"],
  ["/policies/contact-information", 301, "/demande/"],
  ["/pages/data-sharing-opt-out", 301, "/confidentialite/"],
  ["/policies/terms-of-service", 301, "/mentions-legales/"],
  ["/vins", 308, "/vins/"],
  ["/domaine?source=test", 308, "/domaine/?source=test"],
  ...[
    "/cart",
    "/cart/add",
    "/checkout",
    "/checkouts/old",
    "/account",
    "/account/login",
    "/policies/shipping-policy",
    "/policies/refund-policy",
    "/policies/terms-of-sale",
  ].map((p) => [p, 410]),
  ["/inconnue-test-404/", 404],
  ["/journal/article-inexistant/", 404],
  ["/products/produit-inconnu/", 404],
  ["/agents.md", 404],
];
try {
  for (const [path, status, location] of checks) {
    const response = await fetch(base + path, { redirect: "manual" });
    assert.equal(response.status, status, path);
    if (location) assert.equal(response.headers.get("location"), location, path);
    if (status >= 400) assert.ok(response.headers.get("x-robots-tag")?.includes("noindex"));
    results.checks.push({ path, status, location });
  }
  const response = await fetch(base + "/");
  const html = await response.text();
  const visible = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  assert.ok(visible.includes("Sept terrasses."));
  assert.ok(visible.includes("Découvrir les cuvées"));
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow");
  assert.equal(response.headers.get("cache-control"), "no-store");
  results.checks.push({ name: "Initial HTML and protected indexing", passed: true });
  const robots = await (await fetch(base + "/robots.txt")).text();
  assert.ok(robots.includes("Disallow: /"));
  results.checks.push({ name: "Local preview excluded from indexing", passed: true });
  const sitemap = await (await fetch(base + "/sitemap.xml")).text();
  assert.equal([...sitemap.matchAll(/<loc>/g)].length, 19);
  assert.ok(!/lastmod|products|checkout|cart/.test(sitemap));
  results.checks.push({ name: "Sitemap 19 canonical URLs, no invented dates", passed: true });
  const form = await fetch(base + "/api/demandes", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: base },
    body: JSON.stringify({
      name: "TEST TECHNIQUE CODEX",
      email: "test-technique@example.com",
      profile: "particulier",
      purpose: "autre",
      is_adult: true,
      idempotency_key: crypto.randomUUID(),
    }),
  });
  const body = await form.json();
  assert.equal(form.status, 503);
  assert.equal(body.code, "service_unavailable");
  assert.ok(!body.request_id);
  results.checks.push({ name: "Real endpoint without provider", status: 503, emailSent: false });
  const method = await fetch(base + "/api/demandes");
  assert.equal(method.status, 405);
  results.checks.push({ name: "Email endpoint rejects GET", status: 405 });
  async function files(dir) {
    return (
      await Promise.all(
        (await readdir(dir, { withFileTypes: true })).map((e) =>
          e.isDirectory() ? files(path.join(dir, e.name)) : [path.join(dir, e.name)],
        ),
      )
    ).flat();
  }
  const client = await files(".output/public");
  const code = (
    await Promise.all(
      client.filter((p) => /\.(js|css|html)$/.test(p)).map((p) => readFile(p, "utf8")),
    )
  ).join("\n");
  assert.ok(
    !/RESEND_API_KEY|ROTY_REDIS_REST_TOKEN|ROTY_FORM_HASH_SECRET|api\.resend\.com|redis\.call/.test(
      code,
    ),
    "Server code or env names in client",
  );
  assert.ok(
    !/three\.module|checkoutUrl|stripe\.com|paypal\.com|shopify\.com\/cart|window\.location[^\n]*checkout/.test(
      code,
    ),
    "Commercial or 3D code in browser bundle",
  );
  results.checks.push({
    name: "Browser bundle has no mail credentials/provider implementation/commerce/3D",
    passed: true,
  });
  results.status = "passed";
} catch (error) {
  results.status = "failed";
  results.error = error.stack;
  process.exitCode = 1;
} finally {
  await mkdir("test-results", { recursive: true });
  await writeFile("test-results/http.json", JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
}
