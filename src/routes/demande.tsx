import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumb, Photo } from "@/components/roty/SiteLayout";
import { DemandeForm } from "@/components/roty/DemandeForm";
import { seo } from "@/content/seo";
export const Route = createFileRoute("/demande")({
  validateSearch: (search: Record<string, unknown>) => ({
    cuvee: ["2023", "2024"].includes(String(search.cuvee)) ? String(search.cuvee) : undefined,
    profil: ["particulier", "professionnel", "caviste", "restaurateur"].includes(
      String(search.profil),
    )
      ? String(search.profil)
      : undefined,
    objet: ["bouteilles", "conseil", "professionnel", "autre"].includes(String(search.objet))
      ? String(search.objet)
      : undefined,
  }),
  head: () =>
    seo(
      "Contacter le domaine — Demander des bouteilles",
      "Adressez votre demande aux Terrasses du Roty : bouteilles de Syrah, conseils, cuvées et informations professionnelles. Aucun achat confirmé par le formulaire.",
      "/demande/",
    ),
  component: DemandePage,
});
function DemandePage() {
  const defaults = Route.useSearch();
  return (
    <>
      <div className="wrap contact-breadcrumb">
        <Breadcrumb items={[{ label: "Nous contacter" }]} />
      </div>
      <section className="wrap form-layout">
        <div className="contact-intro">
          <p className="eyebrow">Un lien direct avec le domaine</p>
          <h1>
            Parlons <br />
            <em>du Roty.</em>
          </h1>
          <p>
            Quelques bouteilles, une cuvée à découvrir, un projet professionnel. Dites-nous ce que
            vous recherchez.
          </p>
        </div>
        <DemandeForm defaults={defaults} />
        <aside className="form-aside">
          <Photo
            name="img-9683"
            alt="Le travail de la vigne sur les terrasses à Saulcet"
            sizes="(max-width: 640px) 100vw, 35vw"
          />
          <div className="contact-details">
            <p className="eyebrow">Les coordonnées du domaine</p>
            <p>
              Les Terrasses du Roty
              <br />
              Saulcet, Allier
            </p>
            <p style={{ marginTop: 16 }}>
              taff.roty@gmail.com
              <br />
              <a href="tel:+33621560117">+33 6 21 56 01 17</a>
            </p>
          </div>
        </aside>
      </section>
    </>
  );
}
