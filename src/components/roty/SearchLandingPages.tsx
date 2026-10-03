import { Breadcrumb, ButtonLink, ContactBand, Photo } from "./SiteLayout";
import "../../editorial-premium.css";

function SearchHero({
  label,
  eyebrow,
  title,
  accent,
  description,
}: {
  label: string;
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
}) {
  return (
    <header className="ed-hero ed-width">
      <Breadcrumb items={[{ label }]} />
      <div className="ed-hero-copy">
        <p className="ed-eyebrow">{eyebrow}</p>
        <h1 className="ed-title">
          {title}
          <br />
          <span>{accent}</span>
        </h1>
        <p className="ed-lead">{description}</p>
      </div>
    </header>
  );
}

export function VinAllierPage() {
  return (
    <div className="ed-page search-landing">
      <SearchHero
        label="Vin de l’Allier"
        eyebrow="Producteur de vin · Saulcet, Allier"
        title="Un vin de l’Allier."
        accent="En direct du domaine."
        description="Les Terrasses du Roty cultivent la Syrah à Saulcet, sur sept terrasses en pierre sèche. Découvrez le lieu, les cuvées et la manière de demander des bouteilles directement au domaine."
      />
      <figure className="ed-width ed-immersive ed-immersive-landscape">
        <Photo
          name="roty-vineyard"
          alt="Les rangs de vigne des Terrasses du Roty à Saulcet dans l’Allier"
          eager
          sizes="100vw"
        />
        <figcaption>Les vignes du Roty à Saulcet. Archives photographiques du domaine.</figcaption>
      </figure>
      <section className="ed-width ed-story" aria-labelledby="vin-allier-local">
        <div className="ed-section-heading">
          <p className="ed-eyebrow">Une recherche locale</p>
          <h2 id="vin-allier-local">
            Où trouver le domaine ?
            <br />
            <span>À Saulcet.</span>
          </h2>
        </div>
        <div className="ed-copy">
          <p>
            Les Terrasses du Roty se trouvent au 8 Rue Louis Neillot, 03500 Saulcet, dans l’Allier.
            Le projet viticole relie ce lieu, ses murs en pierre sèche et la culture de la Syrah.
          </p>
          <p>
            Pour préparer un retrait, une rencontre ou une demande de bouteilles, contactez le
            domaine avant de vous déplacer. Les disponibilités, le tarif et les modalités sont
            confirmés au cas par cas.
          </p>
          <div className="ed-actions">
            <ButtonLink href="/demande/?profil=particulier&objet=bouteilles">
              Demander des bouteilles
            </ButtonLink>
            <a className="text-link" href="tel:+33621560117">
              Appeler le +33 6 21 56 01 17
            </a>
          </div>
        </div>
      </section>
      <section className="ed-soft-section" aria-labelledby="vin-allier-direct">
        <div className="ed-width ed-feature">
          <Photo
            name="roty-restoration"
            alt="Travail de restauration des terrasses du Roty à Saulcet"
            sizes="(max-width: 767px) 100vw, 50vw"
          />
          <div className="ed-feature-copy">
            <p className="ed-eyebrow">Du lieu à la bouteille</p>
            <h2 id="vin-allier-direct">
              Acheter en direct.
              <br />
              <span>Commencer par un échange.</span>
            </h2>
            <p>
              Le site ne propose ni panier ni paiement en ligne. Vous indiquez le millésime, la
              quantité envisagée et votre besoin ; le domaine répond avec les informations
              disponibles.
            </p>
            <p>
              Vous pouvez aussi découvrir <a href="/vins/">les cuvées de Syrah</a>, l’
              <a href="/domaine/">histoire du domaine</a> et le guide pour{" "}
              <a href="/journal/acheter-vin-direct-producteur-allier/">
                acheter du vin directement au producteur
              </a>
              .
            </p>
            <ButtonLink secondary href="/vins/">
              Voir les cuvées
            </ButtonLink>
          </div>
        </div>
      </section>
      <section className="ed-width ed-faq-layout search-faq" aria-labelledby="questions-allier">
        <div className="ed-section-heading">
          <p className="ed-eyebrow">Questions locales</p>
          <h2 id="questions-allier">
            Venir, choisir,
            <br />
            <span>prendre contact.</span>
          </h2>
        </div>
        <div className="ed-faq">
          <details open>
            <summary>Peut-on acheter du vin directement au domaine dans l’Allier ?</summary>
            <p>
              Vous pouvez demander des bouteilles directement aux Terrasses du Roty. Le domaine
              confirme ensuite le millésime disponible, le prix et les modalités possibles.
            </p>
          </details>
          <details open>
            <summary>Le domaine est-il près de Saint-Pourçain-sur-Sioule ?</summary>
            <p>
              Les vignes et l’adresse publique du domaine se trouvent à Saulcet, dans l’Allier.
              Cette proximité géographique ne constitue pas une revendication d’appellation pour la
              Syrah du Roty.
            </p>
          </details>
          <details open>
            <summary>Faut-il prendre rendez-vous avant de venir ?</summary>
            <p>
              Prenez contact avant tout déplacement afin de vérifier la présence du domaine et les
              modalités adaptées à votre demande.
            </p>
          </details>
        </div>
      </section>
      <ContactBand />
    </div>
  );
}

export function VinSyrahPage() {
  return (
    <div className="ed-page search-landing">
      <SearchHero
        label="Guide de la Syrah"
        eyebrow="Vin de Syrah · Cépage, origine et choix"
        title="Comprendre la Syrah."
        accent="Choisir une cuvée."
        description="Région, millésime, étiquette et accords : les repères essentiels pour chercher un vin de Syrah et découvrir la cuvée des Terrasses du Roty."
      />
      <figure className="ed-width ed-immersive ed-immersive-landscape">
        <Photo
          name="wine-motion"
          alt="Photographie d’illustration de vin rouge en mouvement dans un verre"
          eager
          sizes="100vw"
        />
        <figcaption>Photographie d’illustration · Unsplash.</figcaption>
      </figure>
      <section className="ed-width ed-story" aria-labelledby="syrah-choisir">
        <div className="ed-section-heading">
          <p className="ed-eyebrow">Avant de choisir</p>
          <h2 id="syrah-choisir">
            Un cépage.
            <br />
            <span>Des vins différents.</span>
          </h2>
        </div>
        <div className="ed-copy">
          <p>
            « Syrah » indique le cépage, mais ne suffit pas à décrire une bouteille. La région, le
            lieu des vignes, le millésime, la vinification et l’élevage donnent les informations qui
            permettent de comparer deux vins.
          </p>
          <p>
            Les Terrasses du Roty présentent une cuvée 100 % Syrah issue de vignes situées à
            Saulcet, dans l’Allier. Pour connaître son profil et son service, consultez la fiche du
            millésime ou demandez-la au domaine.
          </p>
          <ButtonLink href="/vins/">Découvrir la Syrah du Roty</ButtonLink>
        </div>
      </section>
      <section className="ed-soft-section" aria-labelledby="syrah-reperes">
        <div className="ed-width search-intent-grid">
          <article>
            <p className="ed-eyebrow">Quelle région ?</p>
            <h2 id="syrah-reperes">Lire l’origine exacte.</h2>
            <p>
              La Syrah est utilisée dans plusieurs régions et dénominations françaises. Regardez le
              lieu, la dénomination et le producteur réellement indiqués sur la bouteille. Au Roty,
              les vignes se trouvent à Saulcet, dans l’Allier.
            </p>
          </article>
          <article>
            <p className="ed-eyebrow">Quel millésime ?</p>
            <h2>Comparer la bonne fiche.</h2>
            <p>
              Une fiche ancienne ne garantit ni le même profil ni la disponibilité actuelle.
              Comparez les informations propres aux cuvées 2023 et 2024, puis demandez le millésime
              proposé.
            </p>
          </article>
          <article>
            <p className="ed-eyebrow">Avec quel plat ?</p>
            <h2>Partir du vin servi.</h2>
            <p>
              Un accord précis dépend de la cuvée et de sa présentation. Décrivez votre repas ou,
              pour un restaurant, votre carte : le domaine pourra fournir les conseils propres au
              millésime disponible.
            </p>
          </article>
        </div>
      </section>
      <section className="ed-width ed-faq-layout search-faq" aria-labelledby="questions-syrah">
        <div className="ed-section-heading">
          <p className="ed-eyebrow">Questions recherchées</p>
          <h2 id="questions-syrah">
            La Syrah,
            <br />
            <span>sans raccourci.</span>
          </h2>
        </div>
        <div className="ed-faq">
          <details open>
            <summary>La Syrah est-elle toujours un vin rouge identique ?</summary>
            <p>
              Non. Le nom du cépage ne remplace pas la fiche d’un vin. L’origine, le millésime et
              les choix d’élaboration permettent de comprendre la cuvée précise.
            </p>
          </details>
          <details open>
            <summary>Comment choisir un vin de Syrah ?</summary>
            <p>
              Vérifiez le producteur, l’origine, le millésime, la composition annoncée et les
              informations de service. Pour le Roty, les fiches des cuvées et le contact direct
              donnent ces repères sans supposer un stock.
            </p>
          </details>
          <details open>
            <summary>Où acheter la Syrah des Terrasses du Roty ?</summary>
            <p>
              Adressez une demande au domaine à Saulcet. Aucun panier ne réserve les bouteilles : le
              prix, la disponibilité et le retrait ou le transport sont confirmés lors de l’échange.
            </p>
          </details>
        </div>
      </section>
      <ContactBand />
    </div>
  );
}
