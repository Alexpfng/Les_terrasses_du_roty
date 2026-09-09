import { allArticles as articles } from "@/content/historical-articles";
import { Photo, ButtonLink } from "./SiteLayout";
export function WineCards() {
  return (
    <div className="wine-grid">
      <a className="wine-card" href="/vins/cuvee-2024/">
        <Photo
          name="img-2855"
          alt="Les bouteilles de Syrah des Terrasses du Roty et leur étiquette noire et or"
        />
        <div className="wine-card-copy">
          <p className="eyebrow">Syrah · Millésime 2024</p>
          <h3>
            Cuvée 2024 <span aria-hidden="true">↗</span>
          </h3>
          <p>Découvrir la cuvée et demander sa disponibilité.</p>
        </div>
      </a>
      <a className="wine-card wine-archive" href="/vins/cuvee-2023/">
        <div className="vintage-art" aria-hidden="true">
          <span>LE ROTY</span>
          <strong>2023</strong>
          <span>AU FIL DES MILLÉSIMES</span>
        </div>
        <div className="wine-card-copy">
          <p className="eyebrow">Les millésimes du domaine</p>
          <h3>
            Cuvée 2023 <span aria-hidden="true">↗</span>
          </h3>
          <p>Retrouver une référence et se renseigner auprès du domaine.</p>
        </div>
      </a>
    </div>
  );
}
export function JournalCards({ limit }: { limit?: number }) {
  return (
    <div className="journal-grid">
      {articles.slice(0, limit).map((article, i) => (
        <article className="journal-card" key={article.slug}>
          <a href={`/journal/${article.slug}/`} tabIndex={-1} aria-hidden="true">
            <Photo
              name={["img-2855", "img-9683", "dji-0086", "img-2855", "img-9683"][i % 5]}
              alt=""
            />
          </a>
          <div>
            <p className="eyebrow">
              {article.category} <span>· {article.readingMinutes} min</span>
            </p>
            <h3>
              <a href={`/journal/${article.slug}/`}>{article.title}</a>
            </h3>
            <p>{article.excerpt}</p>
            <ButtonLink secondary href={`/journal/${article.slug}/`}>
              Lire l’article
            </ButtonLink>
          </div>
        </article>
      ))}
    </div>
  );
}
