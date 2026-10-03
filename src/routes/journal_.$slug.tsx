import { createFileRoute, notFound } from "@tanstack/react-router";
import { getJournalArticle } from "@/content/historical-articles";
import { editorialImages } from "@/content/editorial-images";
import { Breadcrumb, ButtonLink, Photo } from "@/components/roty/SiteLayout";
import { seo, SITE_URL, structuredData, breadcrumbsSchema } from "@/content/seo";
export const Route = createFileRoute("/journal_/$slug")({
  loader: ({ params }) => {
    const article = getJournalArticle(params.slug);
    if (!article) throw notFound();
    return article;
  },
  head: ({ loaderData: article }) =>
    article
      ? {
          ...seo(article.seoTitle, article.description, `/journal/${article.slug}/`, "article", {
            path: `/assets/img/${editorialImages[article.slug].imageName}-1600.jpg`,
            alt: editorialImages[article.slug].alt,
          }),
          scripts: [
            structuredData({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: article.title,
              description: article.description,
              image: SITE_URL + `/assets/img/${editorialImages[article.slug].imageName}-1600.jpg`,
              mainEntityOfPage: article.canonical,
              inLanguage: "fr-FR",
              publisher: { "@id": SITE_URL + "/#organisation" },
            }),
            structuredData(
              breadcrumbsSchema([
                { name: "Le journal", path: "/journal/" },
                { name: article.title, path: `/journal/${article.slug}/` },
              ]),
            ),
          ],
        }
      : {
          meta: [
            { title: "Article introuvable | Les Terrasses du Roty" },
            { name: "robots", content: "noindex" },
          ],
        },
  component: ArticlePage,
});
function ArticlePage() {
  const article = Route.useLoaderData();
  const visual = editorialImages[article.slug];
  return (
    <article className="wrap">
      <header className="article-header">
        <Breadcrumb
          items={[{ label: "Le journal", href: "/journal/" }, { label: article.title }]}
        />
        <p className="eyebrow">
          {article.category} · {article.readingMinutes} min de lecture
        </p>
        <h1>{article.title}</h1>
        <p className="article-excerpt">{article.excerpt}</p>
      </header>
      <figure
        className="article-cover"
        style={{ "--photo-position": visual.focalPoint || "center" } as React.CSSProperties}
      >
        <Photo
          name={visual.imageName}
          alt={visual.alt}
          eager
          sizes="(max-width: 767px) 100vw, 1100px"
        />
        {visual.credit && <figcaption>{visual.credit}</figcaption>}
      </figure>
      <div className="article-body" dangerouslySetInnerHTML={{ __html: article.bodyHtml }} />
      <aside className="article-related">
        <p className="eyebrow">Poursuivre la découverte</p>
        <h2>Du récit à la rencontre.</h2>
        <div className="actions">
          <ButtonLink href={article.relatedPath}>{article.relatedLabel}</ButtonLink>
          <ButtonLink secondary href="/journal/">
            Revenir au journal
          </ButtonLink>
        </div>
      </aside>
    </article>
  );
}
