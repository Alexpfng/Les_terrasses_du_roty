import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SiteLayout, ButtonLink } from "@/components/roty/SiteLayout";
import appCss from "../roty.css?url";
import analyticsCss from "../analytics.css?url";
import shellCss from "../site-shell.css?url";
import editorialCss from "../editorial-premium.css?url";
import formCss from "../form-premium.css?url";
import { SITE_URL, structuredData } from "@/content/seo";
import { googleSiteVerificationMeta } from "@/lib/analytics";
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { title: "Les Terrasses du Roty" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#F5F5F7" },
      ...googleSiteVerificationMeta(
        import.meta.env.VITE_GOOGLE_SITE_VERIFICATION ||
          "85RkIRx_0r7ElaMnrtFrwymUhGG2kCusNroF9-TvVaA",
      ),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: analyticsCss },
      { rel: "stylesheet", href: shellCss },
      { rel: "stylesheet", href: editorialCss },
      { rel: "stylesheet", href: formCss },
      { rel: "icon", type: "image/svg+xml", href: "/assets/img/favicon-etiquette.svg" },
      {
        rel: "preload",
        href: "/assets/fonts/inter-latin.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
    ],
    scripts: [
      structuredData({
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": SITE_URL + "/#organisation",
        name: "Les Terrasses du Roty",
        legalName: "LES COTES DU ROTY",
        taxID: "892392010",
        url: SITE_URL + "/",
        logo: SITE_URL + "/assets/img/logo-etiquette-light.svg",
        email: "taff.roty@gmail.com",
        location: {
          "@type": "Place",
          name: "Saulcet, Allier",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Saulcet",
            addressRegion: "Allier",
            addressCountry: "FR",
          },
        },
      }),
      structuredData({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": SITE_URL + "/#website",
        name: "Les Terrasses du Roty",
        url: SITE_URL + "/",
        inLanguage: "fr-FR",
        publisher: { "@id": SITE_URL + "/#organisation" },
      }),
    ],
  }),
  shellComponent: ({ children }: { children: ReactNode }) => (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  ),
  component: Root,
  notFoundComponent: () => (
    <section className="wrap page-intro">
      <p className="eyebrow">Erreur 404</p>
      <h1>Ce chemin s’arrête ici.</h1>
      <p>La page demandée n’existe pas. Retrouvez le domaine, les cuvées et notre journal.</p>
      <ButtonLink href="/">Revenir à l’accueil</ButtonLink>
    </section>
  ),
  errorComponent: ({ reset }) => (
    <section className="wrap page-intro">
      <p className="eyebrow">Chargement interrompu</p>
      <h1>Cette page n’a pas pu s’afficher.</h1>
      <p>Vous pouvez réessayer ou revenir à l’accueil.</p>
      <button className="button" onClick={reset}>
        Réessayer
      </button>
      <a href="/">Accueil</a>
    </section>
  ),
});
function Root() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <SiteLayout>
        <Outlet />
      </SiteLayout>
    </QueryClientProvider>
  );
}
