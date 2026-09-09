import { createFileRoute } from "@tanstack/react-router";
import { Photo, ButtonLink, ContactBand } from "@/components/roty/SiteLayout";
import { JournalCards, WineCards } from "@/components/roty/ContentCards";
import { seo } from "@/content/seo";
export const Route = createFileRoute("/")({
  head: () =>
    seo(
      "Les Terrasses du Roty — Sept terrasses. Une Syrah.",
      "À Saulcet, dans l’Allier, découvrez les sept terrasses en pierre sèche du Roty, leur histoire et les cuvées de Syrah. Contactez directement le domaine.",
      "/",
    ),
  component: Home,
});
function Home() {
  return (
    <>
      <section className="hero">
        <Photo
          name="img-9683"
          alt="Travail de la vigne sur les terrasses du Roty, avec le paysage de Saulcet en arrière-plan"
          className="hero-landscape"
          eager
          sizes="100vw"
        />
        <div className="hero-inner wrap">
          <div className="hero-copy">
            <p className="eyebrow">Saulcet, Allier · Un lieu à part</p>
            <h1>
              Sept terrasses.
              <br />
              <em>Une Syrah.</em>
            </h1>
          </div>
          <div className="hero-details">
            <p className="hero-intro">
              À Saulcet, la vigne retrouve sa place sur des terrasses en pierre sèche. Découvrez le
              lieu, le travail qui le façonne et les cuvées des Terrasses du Roty.
            </p>
            <div className="actions">
              <ButtonLink href="/vins/">Découvrir les cuvées</ButtonLink>
              <ButtonLink secondary href="/demande/">
                Demander des bouteilles
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
      <div className="place-line wrap">
        <span>Sept terrasses en pierre sèche</span>
        <span>Un cépage : la Syrah</span>
        <span>Un lien direct avec le domaine</span>
      </div>
      <section className="story-section wrap">
        <div>
          <p className="eyebrow">Le domaine</p>
          <h2>
            Tout commence
            <br />
            par <em>un lieu.</em>
          </h2>
        </div>
        <div className="story-copy">
          <p>
            Une pente, des murs de pierre sèche et la volonté de leur redonner une place dans le
            paysage viticole. Au Roty, l’histoire du vin commence par celle des terrasses.
          </p>
          <p>
            À Saulcet, dans l’Allier, leur remise en culture ouvre un nouveau chapitre. Le lieu, les
            gestes et le choix de la Syrah donnent au projet son identité.
          </p>
          <ButtonLink secondary href="/domaine/">
            Découvrir notre histoire
          </ButtonLink>
        </div>
      </section>
      <section className="landscape-section wrap">
        <Photo
          name="dji-0086"
          alt="Vue du chantier de remise en état des niveaux de culture et des murs de pierre du Roty"
        />
        <div className="landscape-caption">
          <p className="eyebrow">La pierre, le temps, le geste</p>
          <h2>
            Redonner vie
            <br />
            <em>aux terrasses.</em>
          </h2>
          <p>Les murs dessinent le paysage. Leur restauration accompagne le retour de la vigne.</p>
          <ButtonLink secondary href="/terrasses-pierre-seche/">
            Parcourir les terrasses
          </ButtonLink>
        </div>
      </section>
      <section className="wrap section-pad">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Les cuvées du Roty</p>
            <h2>
              La Syrah,
              <br />
              <em>au fil des millésimes.</em>
            </h2>
          </div>
          <p>
            Découvrez les références du domaine.
            <br />
            Les disponibilités se précisent ensemble.
          </p>
        </div>
        <WineCards />
      </section>
      <section className="professional-band">
        <div className="wrap">
          <p className="eyebrow">Cavistes & restaurateurs</p>
          <h2>Faisons connaissance.</h2>
          <p>
            Une cuvée, une fiche technique, un projet de référencement.
            <br />
            Un échange direct pour préparer votre demande.
          </p>
          <ButtonLink href="/professionnels/">L’espace professionnels</ButtonLink>
        </div>
      </section>
      <section className="wrap section-pad">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Le journal du Roty</p>
            <h2>
              Lire le lieu.
              <br />
              <em>Comprendre le vin.</em>
            </h2>
          </div>
          <ButtonLink secondary href="/journal/">
            Tout le journal
          </ButtonLink>
        </div>
        <JournalCards limit={3} />
      </section>
      <ContactBand />
    </>
  );
}
