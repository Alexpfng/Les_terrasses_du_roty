import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Photo, ButtonLink, ContactBand } from "@/components/roty/SiteLayout";
import { JournalCards, WineCards } from "@/components/roty/ContentCards";
import { seo } from "@/content/seo";
export const Route = createFileRoute("/")({
  head: () =>
    seo(
      "Les Terrasses du Roty — Syrah à Saulcet, Allier",
      "Découvrez les vins de Syrah des Terrasses du Roty à Saulcet, dans l’Allier. Cuvées et contact direct pour particuliers, cavistes et restaurateurs.",
      "/",
    ),
  component: Home,
});
function Home() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || !("IntersectionObserver" in window)) return;
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          if (preference.matches) continue;
          const animation = entry.target.animate(
            [
              { opacity: 0.3, transform: "translateY(20px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 550, easing: "cubic-bezier(.2,.65,.3,1)" },
          );
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
        }
      },
      { threshold: 0.12 },
    );
    document.querySelectorAll(".home-reveal").forEach((element) => observer.observe(element));
    const stopMotion = () => {
      if (preference.matches) animations.forEach((animation) => animation.cancel());
    };
    preference.addEventListener("change", stopMotion);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      preference.removeEventListener("change", stopMotion);
    };
  }, []);
  return (
    <>
      <section className="home-hero">
        <div className="home-hero-inner wrap">
          <div className="home-hero-copy">
            <p className="eyebrow">Les Terrasses du Roty · Saulcet, Allier</p>
            <h1>
              Sept terrasses.
              <br />
              <span>Une Syrah.</span>
            </h1>
            <p className="home-hero-intro">
              Un lieu à part. Un cépage singulier.
              <br />
              Le plaisir de les découvrir ensemble.
            </p>
            <div className="actions">
              <ButtonLink href="/vins/">Découvrir les cuvées</ButtonLink>
              <ButtonLink secondary href="/demande/">
                Nous contacter
              </ButtonLink>
            </div>
          </div>
          <figure className="home-product">
            <Photo
              name="bottle-studio"
              alt="Présentation de la bouteille de Syrah 2024, avec l’étiquette noire et or des Terrasses du Roty"
              eager
              sizes="(max-width: 767px) 450px, 50vw"
            />
            <figcaption className="home-product-caption">Cuvée 2024 · Syrah</figcaption>
          </figure>
        </div>
      </section>
      <div className="home-origin">
        <div className="home-origin-inner wrap">
          <span>Sept terrasses en pierre sèche</span>
          <span className="home-origin-dot" aria-hidden="true" />
          <span>Syrah à Saulcet</span>
          <span className="home-origin-dot" aria-hidden="true" />
          <span>En direct du domaine</span>
        </div>
      </div>
      <section className="home-collection" aria-labelledby="home-wines-title">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Les cuvées</p>
              <h2 id="home-wines-title" className="home-section-heading">
                Deux millésimes.<span>Une même signature.</span>
              </h2>
            </div>
            <ButtonLink secondary href="/vins/">
              Explorer les vins
            </ButtonLink>
          </div>
          <WineCards />
        </div>
      </section>
      <section className="home-story wrap" aria-labelledby="home-story-title">
        <div className="home-story-heading home-reveal">
          <div>
            <p className="eyebrow">Le domaine</p>
            <h2 id="home-story-title">
              Avant la bouteille,
              <br />
              <span>il y a ce lieu.</span>
            </h2>
          </div>
          <div className="home-story-copy">
            <p>
              À Saulcet, dans l’Allier, des murs de pierre sèche dessinent une autre idée du
              vignoble. Leur remise en culture ouvre un nouveau chapitre.
            </p>
            <ButtonLink secondary href="/domaine/">
              Découvrir notre histoire
            </ButtonLink>
          </div>
        </div>
        <figure className="home-landscape home-reveal">
          <Photo
            name="img-9683"
            alt="Travail de la vigne au Roty, sur les coteaux de Saulcet dans l’Allier"
            sizes="(max-width: 767px) 100vw, 1280px"
          />
          <figcaption className="home-landscape-caption">
            <p>Le paysage, la vigne et les gestes qui les relient.</p>
            <ButtonLink secondary href="/terrasses-pierre-seche/">
              Parcourir les terrasses
            </ButtonLink>
          </figcaption>
        </figure>
        <div className="home-work-heading">
          <p className="eyebrow">Les gestes du domaine</p>
          <h3>De la terre à la récolte.</h3>
          <p>Le travail se raconte aussi en images.</p>
        </div>
        <div
          className="home-work-grid"
          aria-label="Photographies du travail au domaine"
          onFocusCapture={(event) => {
            if (event.currentTarget.scrollWidth <= event.currentTarget.clientWidth) return;
            if (!(event.target instanceof HTMLElement) || !event.target.closest("a")) return;
            event.target.closest("figure")?.scrollIntoView({
              block: "nearest",
              inline: "start",
              behavior: "auto",
            });
          }}
        >
          <figure className="home-work-card home-reveal">
            <Photo
              name="roty-restoration"
              alt="Un engin à chenilles travaille le sol d’une terrasse, photographie des archives du domaine"
              sizes="(max-width: 767px) 85vw, 410px"
            />
            <figcaption>
              <span className="home-work-number">01 · Restaurer</span>
              <h3>Faire place à la vigne.</h3>
              <p>Redonner aux terrasses leur place dans le paysage viticole.</p>
              <ButtonLink secondary href="/terrasses-pierre-seche/">
                Les terrasses
              </ButtonLink>
            </figcaption>
          </figure>
          <figure className="home-work-card home-reveal">
            <Photo
              name="roty-planting"
              alt="Vue aérienne du travail manuel de plantation dans une parcelle, archives du domaine"
              sizes="(max-width: 767px) 85vw, 410px"
            />
            <figcaption>
              <span className="home-work-number">02 · Planter</span>
              <h3>Accompagner le retour de la vigne.</h3>
              <p>La remise en culture, des premiers gestes aux nouveaux rangs.</p>
              <ButtonLink secondary href="/domaine/">
                L’histoire du domaine
              </ButtonLink>
            </figcaption>
          </figure>
          <figure className="home-work-card home-reveal">
            <Photo
              name="roty-harvest-woman"
              alt="Une personne récolte des grappes dans les rangs avec un seau jaune, archives du domaine"
              sizes="(max-width: 767px) 85vw, 410px"
            />
            <figcaption>
              <span className="home-work-number">03 · Récolter</span>
              <h3>Chaque geste compte.</h3>
              <p>Des mains, des grappes et l’énergie d’une récolte partagée.</p>
              <ButtonLink secondary href="/journal/vendanges-2024/">
                Le récit des vendanges
              </ButtonLink>
            </figcaption>
          </figure>
        </div>
      </section>
      <section className="home-professionals">
        <div className="home-professionals-inner wrap home-reveal">
          <div>
            <p className="eyebrow">Cavistes & restaurateurs</p>
            <h2>
              Une place dans
              <br />
              <span>votre sélection.</span>
            </h2>
          </div>
          <div>
            <p>
              Pour votre cave ou votre carte des vins, faisons connaissance. Cuvées, informations
              techniques et disponibilités : tout commence par un échange avec le domaine.
            </p>
            <div className="actions">
              <ButtonLink href="/professionnels/">L’espace professionnels</ButtonLink>
            </div>
          </div>
        </div>
      </section>
      <section className="home-journal wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Le journal</p>
            <h2 className="home-section-heading">
              Le vin se découvre.<span>Son histoire aussi.</span>
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
