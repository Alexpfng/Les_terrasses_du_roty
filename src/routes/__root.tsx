import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SiteLayout, ButtonLink } from "@/components/roty/SiteLayout";
import appCss from "../roty.css?url";
import { SITE_URL, structuredData } from "@/content/seo";
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { title: "Les Terrasses du Roty" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#F7F4ED" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/assets/img/favicon-etiquette.svg" },
      {
        rel: "preload",
        href: "/assets/fonts/cormorant-latin.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
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
