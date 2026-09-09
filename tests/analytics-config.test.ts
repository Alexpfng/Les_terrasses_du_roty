import { test } from "node:test";
import assert from "node:assert/strict";
import { analyticsConfiguration } from "../src/lib/analytics-config.server.js";

test("analytics configuration requires explicit enablement on HTTPS production and never leaks the ID on previews", async () => {
  const keys = ["ROTY_GA_ENABLED", "ROTY_GA_MEASUREMENT_ID", "ROTY_PREVIEW_MODE"] as const;
  const saved = keys.map((key) => process.env[key]);
  try {
    process.env.ROTY_GA_ENABLED = "1";
    process.env.ROTY_GA_MEASUREMENT_ID = "G-TEST123456";
    delete process.env.ROTY_PREVIEW_MODE;
    const response = analyticsConfiguration(
      new Request("https://www.les-terrasses-du-roty.fr/api/analytics-config"),
    );
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.deepEqual(await response.json(), { enabled: true, measurementId: "G-TEST123456" });
    for (const origin of [
      "http://www.les-terrasses-du-roty.fr",
      "https://les-terrasses-du-roty.fr",
      "http://127.0.0.1:4173",
      "https://preproduction--les-terrasses-du-roty.netlify.app",
    ]) {
      assert.deepEqual(
        await analyticsConfiguration(new Request(origin + "/api/analytics-config")).json(),
        { enabled: false, measurementId: null },
      );
    }
    const request = new Request("https://www.les-terrasses-du-roty.fr/api/analytics-config");
    process.env.ROTY_PREVIEW_MODE = "1";
    assert.deepEqual(await analyticsConfiguration(request).json(), {
      enabled: false,
      measurementId: null,
    });
    delete process.env.ROTY_PREVIEW_MODE;
    process.env.ROTY_GA_ENABLED = "0";
    assert.deepEqual(await analyticsConfiguration(request).json(), {
      enabled: false,
      measurementId: null,
    });
    process.env.ROTY_GA_ENABLED = "1";
    process.env.ROTY_GA_MEASUREMENT_ID = "not-an-id";
    assert.deepEqual(await analyticsConfiguration(request).json(), {
      enabled: false,
      measurementId: null,
    });
    assert.equal(analyticsConfiguration(new Request(request.url, { method: "POST" })).status, 405);
  } finally {
    keys.forEach((key, index) => {
      if (saved[index] === undefined) delete process.env[key];
      else process.env[key] = saved[index];
    });
  }
});
