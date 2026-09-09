import process from "node:process";
import { timingSafeEqual } from "node:crypto";
import { SITE_URL } from "../content/seo";
import { publishedPaths, legacyRedirects, retiredPolicyPaths } from "./site-routing";
export function isPreview(request: Request) {
  return (
    process.env.ROTY_PREVIEW_MODE === "1" ||
    new URL(request.url).hostname !== "www.les-terrasses-du-roty.fr"
  );
}
function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}
export function beforeSiteRequest(request: Request): Response | null {
  const url = new URL(request.url);
  const isLocal = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if (
    isPreview(request) &&
    !isLocal &&
    !process.env.ROTY_PREVIEW_PASSWORD &&
    url.hostname !== "les-terrasses-du-roty.fr"
  ) {
    return new Response("La protection de cette préproduction doit être configurée.", {
      status: 503,
      headers: { "X-Robots-Tag": "noindex, nofollow", "Cache-Control": "no-store" },
    });
  }
  if (process.env.ROTY_PREVIEW_PASSWORD) {
    const expected = `Basic ${Buffer.from(`${process.env.ROTY_PREVIEW_USER || "roty"}:${process.env.ROTY_PREVIEW_PASSWORD}`).toString("base64")}`;
    if (!safeEqual(request.headers.get("authorization") || "", expected))
      return new Response("Préproduction privée", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Roty preproduction", charset="UTF-8"',
          "X-Robots-Tag": "noindex, nofollow",
          "Cache-Control": "no-store",
        },
      });
  }
  if (request.method === "GET" || request.method === "HEAD") {
    if (url.hostname === "les-terrasses-du-roty.fr")
      return Response.redirect(SITE_URL + url.pathname + url.search, 308);
    let path: string;
    try {
      path = decodeURIComponent(url.pathname).replace(/\/$/, "") || "/";
    } catch {
      return new Response("Chemin invalide", { status: 400 });
    }
    if (legacyRedirects[path])
      return new Response(null, { status: 301, headers: { Location: legacyRedirects[path] } });
    if (
      /^\/(cart|checkout|checkouts|account)(\/|$)/.test(path) ||
      retiredPolicyPaths.includes(path)
    )
      return new Response(
        '<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Parcours retiré | Les Terrasses du Roty</title><body style="background:#0a0908;color:#f4f0e6;font-family:Arial;padding:10vw;line-height:1.8"><main><h1>Ce parcours n’est plus proposé sur ce site.</h1><p>Pour connaître les cuvées ou poser une question sur un achat antérieur, contactez le domaine.</p><a style="color:#c9a227" href="/demande/">Contacter le domaine</a></main></body></html>',
        {
          status: 410,
          headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex" },
        },
      );
    if (publishedPaths.includes(path + "/") && !url.pathname.endsWith("/"))
      return new Response(null, {
        status: 308,
        headers: { Location: url.pathname + "/" + url.search },
      });
    if (url.pathname === "/robots.txt")
      return new Response(
        isPreview(request)
          ? "User-agent: *\nDisallow: /\n"
          : `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${SITE_URL}/sitemap.xml\n`,
        { headers: { "Content-Type": "text/plain; charset=utf-8" } },
      );
    if (url.pathname === "/sitemap.xml")
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${publishedPaths.map((path) => `<url><loc>${SITE_URL}${path}</loc></url>`).join("")}</urlset>`,
        { headers: { "Content-Type": "application/xml; charset=utf-8" } },
      );
  }
  return null;
}
export async function siteResponse(request: Request, response: Response) {
  const headers = new Headers(response.headers);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (isPreview(request) || response.status >= 400)
    headers.set("X-Robots-Tag", "noindex, nofollow");
  if (isPreview(request) || new URL(request.url).pathname.startsWith("/api/"))
    headers.set("Cache-Control", "no-store");
  // Consume SSR before suppressing HEAD's body: React 18's Node stream bridge
  // does not reliably propagate cancellation before its first pull. Draining
  // without buffering lets TanStack finish rendering and release its timers.
  if (request.method === "HEAD" && response.body) {
    const reader = response.body.getReader();
    try {
      while (!(await reader.read()).done) {
        /* Discard chunks without buffering. */
      }
    } catch (error) {
      await reader.cancel(error);
      throw error;
    } finally {
      reader.releaseLock();
    }
  }
  return new Response(request.method === "HEAD" ? null : response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
