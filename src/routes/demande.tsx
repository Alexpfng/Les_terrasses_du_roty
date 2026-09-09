import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumb } from "@/components/roty/SiteLayout";
import { DemandeForm } from "@/components/roty/DemandeForm";
import { seo } from "@/content/seo";
export const Route = createFileRoute("/demande")({
  validateSearch: (search: Record<string, unknown>) => ({
    cuvee: ["2023", "2024"].includes(String(search.cuvee)) ? String(search.cuvee) : undefined,
    profil: search.profil === "professionnel" ? "professionnel" : undefined,
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
      <section className="wrap page-intro">
        <Breadcrumb items={[{ label: "Nous contacter" }]} />
        <p className="eyebrow">Écrire aux Terrasses du Roty</p>
        <h1>
          Tout commence
          <br />
          <em>par un échange.</em>
        </h1>
        <p>
          Quelques bouteilles, une cuvée à découvrir, un projet professionnel. Dites-nous ce que
          vous recherchez.
        </p>
      </section>
      <section className="wrap form-layout">
        <aside className="form-aside">
          <h2>
            Votre demande,
            <br />
            directement au domaine.
          </h2>
          <p>
            Nous préciserons ensemble le millésime, les disponibilités, le prix et les modalités
            possibles. Inutile de connaître déjà toutes les réponses.
          </p>
          <div className="contact-details">
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
        <DemandeForm defaults={defaults} />
      </section>
    </>
  );
}
