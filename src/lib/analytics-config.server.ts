import process from "node:process";

export function analyticsConfiguration(request: Request): Response {
  const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };
  if (request.method !== "GET" && request.method !== "HEAD") {
    return Response.json(
      { error: "method_not_allowed" },
      { status: 405, headers: { ...headers, Allow: "GET, HEAD" } },
    );
  }
  const url = new URL(request.url);
  const id = process.env.ROTY_GA_MEASUREMENT_ID || "";
  const enabled =
    process.env.ROTY_GA_ENABLED === "1" &&
    process.env.ROTY_PREVIEW_MODE !== "1" &&
    url.protocol === "https:" &&
    url.hostname === "www.les-terrasses-du-roty.fr" &&
    /^G-[A-Z0-9]{6,20}$/.test(id);
  return Response.json({ enabled, measurementId: enabled ? id : null }, { headers });
}
