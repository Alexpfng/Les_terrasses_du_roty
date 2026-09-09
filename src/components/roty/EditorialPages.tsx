import type { ReactNode } from "react";
import { Photo, ButtonLink, Breadcrumb, ContactBand } from "./SiteLayout";
import { WineCards, JournalCards } from "./ContentCards";
import { editorialImages } from "@/content/editorial-images";
import "../../editorial-premium.css";

function EditorialHero({
  label,
  eyebrow,
  children,
  description,
  actions,
}: {
  label: string;
  eyebrow: string;
  children: ReactNode;
  description: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="ed-hero ed-width">
      <Breadcrumb items={[{ label }]} />
      <div className="ed-hero-copy">
        <p className="ed-eyebrow">{eyebrow}</p>
        <h1 className="ed-title">{children}</h1>
        <p className="ed-lead">{description}</p>
        {actions ? <div className="ed-actions">{actions}</div> : null}
      </div>
    </header>
  );
}

export function DomainePage() {
  return (
    <div className="ed-page">
      <EditorialHero
        label="Le domaine"
        eyebrow="Le domaine · Saulcet, Allier"
        description="À Saulcet, dans l’Allier, les Terrasses du Roty réunissent la Syrah et sept terrasses en pierre sèche. L’histoire d’un lieu que l’on choisit de remettre en culture."
      >
        Le Roty.
        <br />
        <span>Une nouvelle histoire.</span>
      </EditorialHero>
      <figure className="ed-width ed-immersive">
        <Photo
          name="roty-vineyard"
          alt="Des rangs de vigne sur un coteau, avec le paysage en arrière-plan"
          eager
          sizes="100vw"
        />
        <figcaption>
          Les rangs de vigne et le paysage. Archives photographiques du domaine.
        </figcaption>
      </figure>
      <dl className="ed-width ed-landmarks">
        <div>
          <dt>Le lieu</dt>
          <dd>
            Saulcet<span>Allier, France</span>
          </dd>
        </div>
        <div>
          <dt>Le commencement</dt>
          <dd>
            2021<span>Une rencontre, un projet</span>
          </dd>
        </div>
        <div>
          <dt>Le paysage</dt>
          <dd>
            7 terrasses<span>En pierre sèche</span>
          </dd>
        </div>
      </dl>
      <section className="ed-width ed-story">
        <div className="ed-section-heading">
          <p className="ed-eyebrow">L’origine du projet</p>
          <h2>
            Une rencontre.
            <br />
            <span>Tout commence là.</span>
          </h2>
        </div>
        <div className="ed-copy">
          <p>
            Le récit du domaine commence en octobre 2021. La rencontre avec François Ray et
            Alexandre Pinet, du Domaine Ray, conduit à la découverte de terrasses gagnées par la
            végétation, à Saulcet.
          </p>
          <p>
            Le projet prend forme autour d’une idée simple : redonner une fonction viticole à ce
            paysage. Les murs, la pente et les surfaces de culture deviennent le point de départ du
            travail.
          </p>
          <p>
            La restauration des terrasses, puis le retour de la vigne, ouvrent une nouvelle page de
            cette histoire.
          </p>
          <ButtonLink secondary href="/terrasses-pierre-seche/">
            Découvrir les sept terrasses
          </ButtonLink>
        </div>
      </section>
      <section className="ed-soft-section">
        <div className="ed-width ed-feature">
          <Photo
            name="roty-team"
            alt="Des personnes vues de dos portent les couleurs des Terrasses du Roty"
            className="ed-field-team"
          />
          <div className="ed-feature-copy">
            <p className="ed-eyebrow">Un lieu. Un cépage.</p>
            <h2>
              La Syrah.
              <br />
              <span>Le fil de l’histoire.</span>
            </h2>
            <p>
              La Syrah donne aux Terrasses du Roty une seconde porte d’entrée. Le lieu raconte le
              projet ; chaque millésime en prolonge le récit.
            </p>
            <p>
              Retrouvez les informations propres à chaque cuvée sur sa fiche. La dénomination du vin
              se précise à partir de son étiquette et des informations du domaine.
            </p>
            <ButtonLink href="/vins/">Explorer les cuvées</ButtonLink>
          </div>
        </div>
      </section>
      <ContactBand />
    </div>
  );
}

export function TerrassesPage() {
  return (
    <div className="ed-page">
      <EditorialHero
        label="Les terrasses"
        eyebrow="Vignes en terrasses · Saulcet, Allier"
        description="Sept terrasses en pierre sèche à Saulcet. Un paysage de travail, autant qu’un lieu à regarder."
      >
        Sept terrasses.
        <br />
        <span>Une même terre.</span>
      </EditorialHero>
      <figure className="ed-width ed-immersive ed-immersive-landscape">
        <Photo
          name="dji-0086"
          alt="Les terrasses du Roty pendant leur remise en état : murs de pierre, niveaux de culture et engins de chantier"
          eager
          sizes="100vw"
        />
        <figcaption>
          Remise en état des terrasses du Roty. Photographie des archives du domaine.
        </figcaption>
      </figure>
      <section className="ed-width ed-story">
        <div className="ed-section-heading">
          <p className="ed-eyebrow">Comprendre le lieu</p>
          <h2>
            La pierre dessine.
            <br />
            <span>La vigne reprend vie.</span>
          </h2>
        </div>
        <div className="ed-copy">
          <p>
            Les terrasses aménagent des surfaces cultivées dans une pente. Leurs murs de pierre
            sèche, assemblés sans mortier, marquent les niveaux et les passages.
          </p>
          <p>
            Au Roty, la remise en culture passe par la restauration de cet ensemble. La photographie
            du chantier et la vue aérienne des niveaux de culture donnent deux regards sur ce
            travail.
          </p>
          <p>
            Cette géographie explique le nom du domaine. Le cépage, le millésime et le travail
            d’élaboration prolongent l’histoire du lieu.
          </p>
          <ButtonLink secondary href="/journal/vignes-terrasses-pierre-seche-roty/">
            Lire le récit des terrasses
          </ButtonLink>
        </div>
      </section>
      <section className="ed-soft-section">
        <div className="ed-width ed-feature">
          <Photo
            name="roty-terraces"
            alt="Vue aérienne de niveaux de culture en terrasses, bordés de murs de pierre"
            className="ed-field-terraces"
          />
          <div className="ed-feature-copy">
            <p className="ed-eyebrow">Au fil des gestes</p>
            <h2>
              Le lieu se découvre.
              <br />
              <span>L’échange aussi.</span>
            </h2>
            <p>
              Le journal permet de découvrir la restauration, le choix de la Syrah et les questions
              qui accompagnent la vie du domaine.
            </p>
            <p>
              Vous envisagez un déplacement ? Prenez d’abord contact avec le domaine pour en
              discuter.
            </p>
            <ButtonLink href="/demande/?objet=autre">Contacter le domaine</ButtonLink>
          </div>
        </div>
      </section>
      <ContactBand />
    </div>
  );
}

export function VinsPage() {
  return (
    <div className="ed-page">
      <EditorialHero
        label="Les cuvées"
        eyebrow="Syrah de Saulcet · Achat en direct dans l’Allier"
        description="Découvrez les cuvées 2023 et 2024 des Terrasses du Roty. Pour acheter notre Syrah en direct, échangez avec le domaine sur les disponibilités, le tarif et les modalités adaptées à votre besoin."
      >
        Une Syrah.
        <br />
        <span>Deux millésimes.</span>
      </EditorialHero>
      <section className="ed-width ed-catalog" aria-label="Les cuvées des Terrasses du Roty">
        <WineCards />
        <p className="ed-note ed-note-center">
          Prix et disponibilités confirmés par le domaine. Les demandes ouvrent un échange, sans
          commande ni paiement en ligne.
        </p>
      </section>
      <section className="ed-soft-section" aria-labelledby="achat-direct">
        <div className="ed-width">
          <div className="ed-section-heading ed-heading-center">
            <p className="ed-eyebrow">Particuliers</p>
            <h2 id="achat-direct">
              Vos bouteilles.
              <br />
              <span>En direct du domaine.</span>
            </h2>
            <p>Quelques informations pour préparer un échange utile.</p>
          </div>
          <ol className="ed-steps">
            <li>
              <span className="ed-step-number" aria-hidden="true">
                01
              </span>
              <h3>Le millésime.</h3>
              <p>
                Une cuvée vous intéresse, ou vous découvrez la Syrah du Roty ? Vous pouvez demander
                conseil avant de choisir.
              </p>
            </li>
            <li>
              <span className="ed-step-number" aria-hidden="true">
                02
              </span>
              <h3>Votre besoin.</h3>
              <p>
                Indiquez la quantité envisagée et votre code postal si vous souhaitez étudier une
                expédition.
              </p>
            </li>
            <li>
              <span className="ed-step-number" aria-hidden="true">
                03
              </span>
              <h3>Les détails ensemble.</h3>
              <p>
                Conditionnement, prix total, retrait ou transport se précisent lors de l’échange.
                Prenez contact avant de vous déplacer.
              </p>
            </li>
          </ol>
          <div className="ed-actions ed-actions-center">
            <ButtonLink href="/demande/?profil=particulier&objet=bouteilles">
              Demander un tarif et une disponibilité
            </ButtonLink>
            <ButtonLink secondary href="/journal/acheter-vin-direct-producteur-allier/">
              Le guide de l’achat en direct
            </ButtonLink>
          </div>
        </div>
      </section>
      <ContactBand />
    </div>
  );
}

export function CuveePage({ year }: { year: "2024" | "2023" }) {
  return (
    <div className="ed-page">
      <div className="ed-width ed-product-breadcrumb">
        <Breadcrumb items={[{ label: "Les cuvées", href: "/vins/" }, { label: `Cuvée ${year}` }]} />
      </div>
      <section className="ed-width ed-product">
        <div className={`ed-product-visual${year === "2024" ? " ed-product-visual-studio" : ""}`}>
          {year === "2024" ? (
            <>
              <Photo
                name="bottle-studio"
                alt="Visuel studio de la bouteille des Terrasses du Roty, Syrah 2024"
                eager
                sizes="(max-width: 767px) 100vw, 50vw"
              />
              <p className="ed-note">
                Visuel de présentation réalisé à partir de la bouteille du domaine.
              </p>
            </>
          ) : (
            <div className="catalog-vintage ed-product-vintage" aria-hidden="true">
              <img src="/assets/img/favicon-etiquette.svg" alt="" width="80" height="80" />
              <strong>2023</strong>
              <span>LES TERRASSES DU ROTY</span>
            </div>
          )}
        </div>
        <div className="ed-product-copy">
          <p className="ed-eyebrow">Les Terrasses du Roty · Syrah</p>
          <h1 className="ed-title">Cuvée {year}.</h1>
          <p className="ed-product-lead">
            {year === "2024"
              ? "Le choix de la Syrah. Le récit des terrasses."
              : "Un millésime à retrouver. Une histoire à poursuivre."}
          </p>
          <p>
            {year === "2024"
              ? "Le domaine présente sa cuvée 2024 comme une Syrah issue du projet viticole des sept terrasses, à Saulcet dans l’Allier."
              : "La cuvée 2023 fait partie des références présentées par le domaine. Retrouvez ce millésime et demandez ses informations propres."}
          </p>
          <dl className="ed-product-facts">
            <div>
              <dt>Millésime</dt>
              <dd>{year}</dd>
            </div>
            <div>
              <dt>Cépage</dt>
              <dd>Syrah</dd>
            </div>
            <div>
              <dt>Le lieu</dt>
              <dd>Saulcet, Allier</dd>
            </div>
            <div>
              <dt>Disponibilité</dt>
              <dd>À demander au domaine</dd>
            </div>
          </dl>
          <ButtonLink href={`/demande/?cuvee=${year}&objet=bouteilles`}>
            Demander la disponibilité
          </ButtonLink>
          <p className="ed-note">
            Votre demande ouvre un échange. Elle ne réserve pas de bouteilles et ne confirme aucun
            achat.
          </p>
        </div>
      </section>
      <section className="ed-soft-section">
        <div className="ed-width ed-product-next">
          <div>
            <p className="ed-eyebrow">Les informations du millésime</p>
            <h2>Le détail compte.</h2>
            <p>
              Le domaine vous précisera la fiche technique, la dénomination figurant sur
              l’étiquette, le prix et les modalités possibles pour cette cuvée.
            </p>
          </div>
          <div>
            <p className="ed-eyebrow">Le cépage et le lieu</p>
            <h2>Comprendre la Syrah.</h2>
            <p>Découvrez le choix de ce cépage à Saulcet et l’histoire des sept terrasses.</p>
            <ButtonLink secondary href="/journal/syrah-saulcet-allier/">
              Lire l’article
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}

export function ProfessionnelsPage() {
  return (
    <div className="ed-page">
      <EditorialHero
        label="Professionnels"
        eyebrow="Cavistes · Restaurateurs"
        description="Une Syrah de Saulcet, dans l’Allier, à envisager pour votre cave ou votre carte des vins. Découvrez les cuvées et préparez votre approvisionnement en échangeant directement avec le domaine."
        actions={
          <>
            <a className="ed-choice" href="#cavistes">
              Pour ma cave <span aria-hidden="true">↓</span>
            </a>
            <a className="ed-choice" href="#restaurateurs">
              Pour mon restaurant <span aria-hidden="true">↓</span>
            </a>
          </>
        }
      >
        Votre sélection.
        <br />
        <span>Notre Syrah.</span>
      </EditorialHero>
      <section className="ed-width ed-pro-segments" aria-label="Votre activité professionnelle">
        <article className="ed-segment" id="cavistes">
          <p className="ed-eyebrow">Pour votre cave</p>
          <h2>
            Cavistes.
            <br />
            <span>Une référence à explorer.</span>
          </h2>
          <p>
            Vous recherchez un vin de l’Allier en direct du domaine ? Présentez votre cave et la
            place envisagée pour cette Syrah dans votre sélection. Un premier besoin estimatif
            suffit pour commencer l’échange.
          </p>
          <ul>
            <li>La cuvée et sa fiche technique à jour.</li>
            <li>Le tarif professionnel et le conditionnement.</li>
            <li>Les quantités envisagées, votre code postal et votre échéance.</li>
          </ul>
          <p>
            Quantités minimales éventuelles, transport et possibilités d’approvisionnement se
            précisent avec le domaine.
          </p>
          <ButtonLink href="/demande/?profil=caviste&objet=professionnel">
            Présenter mon projet de caviste
          </ButtonLink>
        </article>
        <article className="ed-segment" id="restaurateurs">
          <p className="ed-eyebrow">Pour votre restaurant</p>
          <h2>
            Restaurateurs.
            <br />
            <span>Une place sur votre carte.</span>
          </h2>
          <p>
            Indiquez le style de votre cuisine, les plats que vous souhaitez accompagner et la place
            envisagée à la carte : à la bouteille ou au verre. L’échange part de votre usage réel.
          </p>
          <ul>
            <li>Les informations et conseils de service du millésime.</li>
            <li>Les conditions professionnelles et les quantités indicatives.</li>
            <li>La ville de livraison et la date souhaitée pour votre carte.</li>
          </ul>
          <p>
            Les possibilités de dégustation, d’expédition et de réassort se discutent avec le
            domaine.
          </p>
          <ButtonLink href="/demande/?profil=restaurateur&objet=professionnel">
            Parler de ma carte des vins
          </ButtonLink>
        </article>
      </section>
      <section className="ed-width ed-feature ed-pro-feature">
        <figure className="ed-pro-image">
          <Photo name="wine-table" alt={editorialImages["cavistes-restaurateurs-syrah-roty"].alt} />
          <figcaption>{editorialImages["cavistes-restaurateurs-syrah-roty"].credit}</figcaption>
        </figure>
        <div className="ed-feature-copy">
          <p className="ed-eyebrow">Les bonnes informations</p>
          <h2>
            Un échange direct.
            <br />
            <span>Un projet précis.</span>
          </h2>
          <p>
            Pour préparer notre échange, indiquez votre activité, le millésime qui vous intéresse et
            un ordre de grandeur de votre besoin. Une première prise de contact peut rester
            exploratoire.
          </p>
          <p>
            Le <a href="/domaine/">récit du domaine</a> et les{" "}
            <a href="/terrasses-pierre-seche/">sept terrasses en pierre sèche</a> donnent des
            repères concrets sur le lieu. Les caractéristiques du vin restent propres à chaque
            millésime.
          </p>
          <p>
            Tarifs, quantités et modalités sont confirmés par le domaine. Le formulaire ne vaut ni
            allocation, ni accord commercial.
          </p>
          <ButtonLink secondary href="/journal/cavistes-restaurateurs-syrah-roty/">
            Préparer votre demande professionnelle
          </ButtonLink>
        </div>
      </section>
      <section className="ed-soft-section" aria-labelledby="questions-professionnelles">
        <div className="ed-width ed-faq-layout">
          <div className="ed-section-heading">
            <p className="ed-eyebrow">Avant de prendre contact</p>
            <h2 id="questions-professionnelles">
              Les premiers
              <br />
              <span>repères.</span>
            </h2>
          </div>
          <div className="ed-faq">
            <details open>
              <summary>Comment obtenir une fiche technique et un tarif professionnel ?</summary>
              <p>
                Utilisez le formulaire professionnel avec le nom de votre établissement, votre
                activité et la cuvée envisagée. Ajoutez les informations dont vous avez besoin :
                fiche du millésime, prix applicable ou conditions d’approvisionnement.
              </p>
            </details>
            <details open>
              <summary>Y a-t-il un minimum de commande ou une livraison garantie ?</summary>
              <p>
                Ces conditions doivent être confirmées avec le domaine pour votre demande. Le site
                n’annonce pas de minimum, de franco de port ou de délai garanti. Indiquez une
                quantité et une destination pour étudier les possibilités.
              </p>
            </details>
            <details open>
              <summary>Puis-je prendre contact avant de choisir une cuvée ?</summary>
              <p>
                Oui. Présentez votre projet de cave ou de restaurant, même exploratoire. Les{" "}
                <a href="/vins/">cuvées présentées</a> et le{" "}
                <a href="/journal/cavistes-restaurateurs-syrah-roty/">
                  guide pour les professionnels
                </a>{" "}
                vous donnent les premiers éléments pour cet échange.
              </p>
            </details>
          </div>
        </div>
      </section>
      <div className="ed-width ed-pro-action">
        <ButtonLink href="/demande/?profil=professionnel&objet=professionnel">
          Faire une demande professionnelle
        </ButtonLink>
      </div>
      <ContactBand />
    </div>
  );
}

export function JournalPage() {
  return (
    <div className="ed-page ed-journal-page">
      <EditorialHero
        label="Le journal"
        eyebrow="Le journal du Roty"
        description="La Syrah, les terrasses, l’achat en direct dans l’Allier et les échanges avec les professionnels. Cinq articles pour vous orienter, prolongés par les archives du domaine."
      >
        Un lieu à lire.
        <br />
        <span>Un vin à comprendre.</span>
      </EditorialHero>
      <section className="ed-width ed-journal-list" aria-label="Les articles du journal">
        <JournalCards />
      </section>
      <ContactBand />
    </div>
  );
}
