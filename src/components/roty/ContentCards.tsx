import { allArticles as articles } from "@/content/historical-articles";
import { editorialImages } from "@/content/editorial-images";
import { Photo } from "./SiteLayout";
import "../../editorial-premium.css";

export function WineCards() {
  return (
    <div className="wine-grid catalog-grid">
      <a className="wine-card catalog-card" href="/vins/cuvee-2024/" aria-labelledby="catalog-2024">
        <div className="catalog-visual catalog-visual-label">
          <Photo
            name="label-crop"
            alt="Détail de l’étiquette originale des Terrasses du Roty, Syrah 2024"
            sizes="(max-width: 767px) 100vw, 50vw"
          />
          <span className="catalog-label">Millésime 2024</span>
        </div>
        <div className="catalog-copy">
          <p className="catalog-kicker">Syrah · Saulcet, Allier</p>
          <h3 id="catalog-2024">Cuvée 2024.</h3>
          <p>Le choix de la Syrah, le récit des terrasses.</p>
          <span className="catalog-link">
            Découvrir la cuvée <span aria-hidden="true">↗</span>
          </span>
        </div>
      </a>
      <a className="wine-card catalog-card" href="/vins/cuvee-2023/" aria-labelledby="catalog-2023">
        <div className="catalog-visual catalog-visual-archive">
          <div className="catalog-vintage" aria-hidden="true">
            <img src="/assets/img/favicon-etiquette.svg" alt="" width="64" height="64" />
            <strong>2023</strong>
            <span>LES TERRASSES DU ROTY</span>
          </div>
          <span className="catalog-label">Millésime 2023</span>
        </div>
        <div className="catalog-copy">
          <p className="catalog-kicker">Les millésimes du domaine</p>
          <h3 id="catalog-2023">Cuvée 2023.</h3>
          <p>Un millésime à retrouver. Une histoire à poursuivre.</p>
          <span className="catalog-link">
            Explorer ce millésime <span aria-hidden="true">↗</span>
          </span>
        </div>
      </a>
    </div>
  );
}

export function JournalCards({ limit }: { limit?: number }) {
  return (
    <div className={`journal-grid journal-collection${limit ? "" : " journal-collection-full"}`}>
      {articles.slice(0, limit).map((article) => (
        <article className="journal-card journal-item" key={article.slug}>
          <a
            className="journal-item-link"
            href={`/journal/${article.slug}/`}
            aria-labelledby={`journal-${article.slug}`}
          >
            <figure
              className={`journal-visual journal-visual-${editorialImages[article.slug].imageName}`}
            >
              <Photo
                name={editorialImages[article.slug].imageName}
                alt={editorialImages[article.slug].alt}
                sizes="(max-width: 767px) 100vw, 50vw"
              />
              <figcaption className="journal-image-credit">
                {editorialImages[article.slug].credit}
              </figcaption>
            </figure>
            <div className="journal-copy">
              <p className="journal-meta">
                {article.category}
                <span>{article.readingMinutes} min de lecture</span>
              </p>
              <h3 id={`journal-${article.slug}`}>{article.title}</h3>
              <p className="journal-excerpt">{article.excerpt}</p>
              <span className="journal-read">
                Lire l’article <span aria-hidden="true">↗</span>
              </span>
            </div>
          </a>
        </article>
      ))}
    </div>
  );
}
