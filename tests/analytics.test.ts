import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToString } from "react-dom/server";
import {
  CONSENT_DURATION_MS,
  googleSiteVerificationMeta,
  parseConsentRecord,
  safeAnalyticsCategories,
  safeAnalyticsPage,
  trackFormStart,
  trackAcceptedLead,
  validMeasurementId,
} from "../src/lib/analytics.js";
import {
  AnalyticsConsent,
  AnalyticsPreferencesButton,
} from "../src/components/roty/AnalyticsConsent.js";

test("analytics module and consent component are safe during SSR and render no Google tag", () => {
  assert.equal(typeof window, "undefined");
  const html = renderToString(
    React.createElement(AnalyticsConsent, { pathname: "/", allowedPaths: ["/"] }),
  );
  assert.ok(!/google|script|iframe|img|dataLayer/i.test(html));
  assert.equal(trackFormStart({ profile: "particulier" }), false);
  assert.equal(trackAcceptedLead({ cuvee: "2024" }), false);
  assert.ok(
    renderToString(React.createElement(AnalyticsPreferencesButton)).includes("Gérer les cookies"),
  );
});

test("analytics only accepts GA4 measurement identifiers and safe GSC tokens", () => {
  assert.ok(validMeasurementId("G-ABC123DEF4"));
  for (const id of [
    undefined,
    "",
    "UA-123456-1",
    "GTM-ABC123",
    "G-ABC<script>",
    " G-ABC123DEF4",
    "G-ABC123DEF4?email=test@example.org",
  ])
    assert.equal(validMeasurementId(id), false);
  assert.deepEqual(googleSiteVerificationMeta(undefined), []);
  assert.deepEqual(googleSiteVerificationMeta('unsafe"><script>'), []);
  assert.deepEqual(googleSiteVerificationMeta("a".repeat(43)), [
    { name: "google-site-verification", content: "a".repeat(43) },
  ]);
});

test("acceptance and refusal expire equally after 180 days; malformed or future records do not grant consent", () => {
  const now = 1_800_000_000_000;
  for (const choice of ["accepted", "refused"]) {
    const raw = JSON.stringify({
      version: 1,
      choice,
      updatedAt: now,
      expiresAt: now + CONSENT_DURATION_MS,
    });
    assert.equal(parseConsentRecord(raw, now)?.choice, choice);
    assert.equal(parseConsentRecord(raw, now + CONSENT_DURATION_MS), null);
    assert.equal(parseConsentRecord(raw, now - 1), null);
  }
  for (const raw of [
    null,
    "broken",
    "true",
    "[]",
    JSON.stringify({ choice: "accepted" }),
    JSON.stringify({
      version: 1,
      choice: "accepted",
      updatedAt: now,
      expiresAt: now + CONSENT_DURATION_MS + 1,
    }),
  ])
    assert.equal(parseConsentRecord(raw, now), null);
});

test("page metadata strips query and fragment and rejects external or unlisted personal paths", () => {
  const allowed = ["/", "/demande/", "/vins/cuvee-2024/"];
  assert.deepEqual(
    safeAnalyticsPage("/demande/?email=alice@example.org&token=secret#phone=0600000000", allowed),
    {
      page_location: "https://www.les-terrasses-du-roty.fr/demande/",
      page_title: "Les Terrasses du Roty — /demande/",
    },
  );
  for (const url of [
    "https://attacker.example/demande/",
    "/alice@example.org/",
    "/demande/alice@example.org/",
    "//attacker.example/",
  ])
    assert.equal(safeAnalyticsPage(url, allowed), null);
});

test("analytics receives only whitelisted categories, never arbitrary contact fields", () => {
  assert.deepEqual(safeAnalyticsCategories({ profile: "restaurateur", cuvee: "2024" }), {
    visitor_profile: "restaurateur",
    cuvee: "2024",
  });
  assert.deepEqual(
    safeAnalyticsCategories({ profile: "alice@example.org", cuvee: "secret text" }),
    {},
  );
  const input = {
    profile: "particulier",
    cuvee: "2023",
    email: "alice@example.org",
    name: "Alice",
    message: "private",
    request_id: "private-id",
  };
  assert.deepEqual(safeAnalyticsCategories(input), {
    visitor_profile: "particulier",
    cuvee: "2023",
  });
});
