import { Photo, ButtonLink, Breadcrumb, ContactBand } from "./SiteLayout";
import { WineCards, JournalCards } from "./ContentCards";
export function DomainePage() {
  return (
    <>
      <section className="wrap page-intro">
        <Breadcrumb items={[{ label: "Le domaine" }]} />
        <p className="eyebrow">Le domaine · Saulcet, Allier</p>
        <h1>
          Retrouver la terre.
          <br />
          <em>Écrire la suite.</em>
        </h1>
        <p>
          À Saulcet, dans l’Allier, les Terrasses du Roty réunissent la Syrah et sept terrasses en
          pierre sèche. C’est l’histoire d’un lieu que l’on choisit de remettre en culture.
        </p>
      </section>
      <section className="wrap editorial-split">
        <Photo name="img-9683" alt="Les gestes du travail dans les rangs de vigne du Roty" eager />
        <div className="prose">
          <h2>
            Une rencontre,
            <br />
            puis <em>sept terrasses.</em>
          </h2>
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
            Le paysage des terrasses
          </ButtonLink>
        </div>
      </section>
      <section className="wrap story-section">
        <div>
          <p className="eyebrow">Un lieu, un cépage</p>
          <h2>
            Le choix
            <br />
            <em>de la Syrah.</em>
          </h2>
        </div>
        <div className="story-copy">
          <p>
            La Syrah donne aux Terrasses du Roty une seconde porte d’entrée. Le lieu raconte le
            projet ; chaque millésime en prolonge le récit.
          </p>
          <p>
            Saulcet est ici un repère géographique. La dénomination du vin et les informations d’un
            millésime se lisent sur sa fiche et son étiquette, sans déduire une appellation de la
            seule localisation.
          </p>
          <ButtonLink href="/vins/">Explorer les cuvées</ButtonLink>
        </div>
      </section>
      <ContactBand />
    </>
  );
}
export function TerrassesPage() {
  return (
    <>
      <section className="wrap page-intro">
        <Breadcrumb items={[{ label: "Les terrasses" }]} />
        <p className="eyebrow">Vignes en terrasses · Saulcet, Allier</p>
        <h1>
          La pierre dessine.
          <br />
          <em>La vigne reprend vie.</em>
        </h1>
        <p>
          Sept terrasses en pierre sèche à Saulcet. Un paysage de travail, autant qu’un lieu à
          regarder.
        </p>
      </section>
      <figure className="wrap wide-photo">
        <Photo
          name="dji-0086"
          alt="Les terrasses du Roty pendant leur remise en état : murs de pierre, niveaux de culture et engins de chantier"
          eager
        />
        <figcaption>
          Remise en état des terrasses du Roty. Photographie des archives du domaine.
        </figcaption>
      </figure>
      <section className="wrap story-section">
        <div>
          <p className="eyebrow">Comprendre le lieu</p>
          <h2>
            Une pente.
            <br />
            <em>Plusieurs niveaux.</em>
          </h2>
        </div>
        <div className="story-copy">
          <p>
            Les terrasses aménagent des surfaces cultivées dans une pente. Leurs murs de pierre
            sèche, assemblés sans mortier, marquent les niveaux et les passages.
          </p>
          <p>
            Au Roty, la remise en culture passe par la restauration de cet ensemble. La photographie
            du chantier et celle du travail de la vigne racontent deux moments du projet.
          </p>
          <p>
            Cette géographie explique le nom du domaine. Elle ne remplace pas les informations
            propres à un vin : le cépage, le millésime et le travail d’élaboration méritent aussi
            leur place.
          </p>
          <ButtonLink secondary href="/journal/vignes-terrasses-pierre-seche-roty/">
            Lire le récit des terrasses
          </ButtonLink>
        </div>
      </section>
      <section className="wrap editorial-split">
        <Photo
          name="img-9683"
          alt="Travail dans la vigne après le retour en culture des terrasses"
        />
        <div className="prose">
          <h2>
            Le lieu,
            <br />
            <em>au fil des gestes.</em>
          </h2>
          <p>
            Le journal permet de découvrir la restauration, le choix de la Syrah et les questions
            qui accompagnent la vie du domaine.
          </p>
          <p>
            Pour envisager un déplacement, prenez d’abord contact : la présentation du paysage ne
            constitue pas une réservation de visite.
          </p>
          <ButtonLink href="/demande/?objet=autre">Contacter le domaine</ButtonLink>
        </div>
      </section>
      <ContactBand />
    </>
  );
}
export function VinsPage() {
  return (
    <>
      <section className="wrap page-intro">
        <Breadcrumb items={[{ label: "Les cuvées" }]} />
        <p className="eyebrow">Syrah de Saulcet · Achat en direct dans l’Allier</p>
        <h1>
          Une Syrah.
          <br />
          <em>Des millésimes.</em>
        </h1>
        <p>
          Découvrez les cuvées 2023 et 2024 des Terrasses du Roty. Pour acheter notre Syrah en
          direct, demandez au domaine les disponibilités, le tarif et les modalités adaptées à votre
          besoin.
        </p>
      </section>
      <section className="wrap section-bottom">
        <WineCards />
        <p className="fine-print">
          Prix et disponibilités sont confirmés par le domaine lors de l’échange. Aucune commande ni
          aucun paiement ne sont effectués sur ce site.
        </p>
      </section>
      <section className="wrap story-section" aria-labelledby="achat-direct">
        <div>
          <p className="eyebrow">Particuliers</p>
          <h2 id="achat-direct">
            Vos bouteilles,
            <br />
            <em>en direct du domaine.</em>
          </h2>
        </div>
        <div className="story-copy">
          <p>
            Un millésime vous intéresse, ou vous découvrez la Syrah du Roty ? Indiquez la quantité
            envisagée et votre code postal si vous souhaitez étudier une expédition. Vous pouvez
            aussi demander conseil avant de choisir.
          </p>
          <p>
            Le conditionnement, le prix total et les possibilités de retrait ou de transport se
            précisent lors de l’échange. Pour un retrait, prenez contact avant de vous déplacer.
          </p>
          <p>
            Notre{" "}
            <a href="/journal/acheter-vin-direct-producteur-allier/">
              guide de l’achat en direct dans l’Allier
            </a>{" "}
            vous aide à préparer ces quelques informations.
          </p>
          <ButtonLink href="/demande/?profil=particulier&objet=bouteilles">
            Demander un tarif et une disponibilité
          </ButtonLink>
        </div>
      </section>
      <ContactBand />
    </>
  );
}
export function CuveePage({ year }: { year: "2024" | "2023" }) {
  return (
    <>
      <section className="wrap page-intro compact">
        <Breadcrumb items={[{ label: "Les cuvées", href: "/vins/" }, { label: `Cuvée ${year}` }]} />
      </section>
      <section className="wrap cuvee-detail">
        <div>
          {year === "2024" ? (
            <>
              <Photo
                name="img-2855"
                alt="Bouteilles des Terrasses du Roty, étiquetées Syrah, dans leur carton"
                eager
              />
              <p className="fine-print">
                Photographie des bouteilles du domaine ; le millésime n’est pas lisible sur ce
                visuel.
              </p>
            </>
          ) : (
            <div className="vintage-art large" aria-hidden="true">
              <span>LES TERRASSES DU ROTY</span>
              <strong>2023</strong>
              <span>LES MILLÉSIMES DU DOMAINE</span>
            </div>
          )}
        </div>
        <div className="cuvee-copy">
          <p className="eyebrow">Les Terrasses du Roty</p>
          <h1>
            Cuvée <em>{year}</em>
          </h1>
          <p className="lead">
            {year === "2024"
              ? "Le choix de la Syrah, le récit des terrasses."
              : "Un millésime à retrouver, une histoire à poursuivre."}
          </p>
          <p>
            {year === "2024"
              ? "Le domaine présente sa cuvée 2024 comme une Syrah issue du projet viticole des sept terrasses, à Saulcet dans l’Allier."
              : "La cuvée 2023 fait partie des références présentées par le domaine. Cette page permet de retrouver ce millésime et de demander ses informations propres."}
          </p>
          <dl className="wine-facts">
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
          <p>
            Le domaine vous précisera la fiche technique, la dénomination figurant sur l’étiquette,
            le prix et les modalités possibles pour ce millésime.
          </p>
          <ButtonLink href={`/demande/?cuvee=${year}&objet=bouteilles`}>
            Demander la disponibilité
          </ButtonLink>
          <p className="fine-print">
            Votre demande ouvre un échange. Elle ne réserve pas de bouteilles et ne confirme aucun
            achat.
          </p>
        </div>
      </section>
      <section className="wrap article-related">
        <p className="eyebrow">Pour aller plus loin</p>
        <h2>Le cépage et le lieu.</h2>
        <ButtonLink secondary href="/journal/syrah-saulcet-allier/">
          Comprendre le choix de la Syrah à Saulcet
        </ButtonLink>
      </section>
    </>
  );
}
export function ProfessionnelsPage() {
  return (
    <>
      <section className="wrap page-intro">
        <Breadcrumb items={[{ label: "Professionnels" }]} />
        <p className="eyebrow">Cavistes · Restaurateurs</p>
        <h1>
          Un vin à découvrir.
          <br />
          <em>Un dialogue à ouvrir.</em>
        </h1>
        <p>
          Une Syrah de Saulcet, dans l’Allier, à envisager pour votre cave ou votre carte des vins.
          Échangez directement avec le domaine pour connaître les cuvées et préparer votre
          approvisionnement.
        </p>
        <ButtonLink href="/demande/?profil=professionnel&objet=professionnel">
          Faire une demande professionnelle
        </ButtonLink>
      </section>
      <section className="wrap editorial-split">
        <Photo
          name="img-2855"
          alt="Bouteilles de Syrah des Terrasses du Roty et leurs étiquettes noires et or"
          eager
        />
        <div className="prose">
          <h2>
            Les bonnes informations,
            <br />
            <em>pour votre projet.</em>
          </h2>
          <p>
            Pour préparer notre échange, indiquez votre activité, le millésime qui vous intéresse et
            un ordre de grandeur de votre besoin. Une première prise de contact peut rester
            exploratoire.
          </p>
          <ul>
            <li>La fiche de la cuvée et ses caractéristiques.</li>
            <li>Les disponibilités et les conditions professionnelles.</li>
            <li>Les modalités pratiques adaptées à votre demande.</li>
          </ul>
          <p>
            Les tarifs, quantités et possibilités d’expédition sont confirmés par le domaine. Le
            formulaire ne vaut ni allocation, ni accord commercial.
          </p>
          <ButtonLink secondary href="/journal/cavistes-restaurateurs-syrah-roty/">
            Préparer votre demande
          </ButtonLink>
        </div>
      </section>
      <section className="wrap story-section" aria-labelledby="cavistes">
        <div>
          <p className="eyebrow">Pour votre cave</p>
          <h2 id="cavistes">
            Cavistes,
            <br />
            <em>une référence à explorer.</em>
          </h2>
        </div>
        <div className="story-copy">
          <p>
            Vous recherchez un vin de l’Allier en direct du domaine ? Présentez votre cave, la place
            envisagée pour cette Syrah dans votre sélection et le millésime qui vous intéresse. Un
            premier besoin estimatif suffit pour commencer l’échange.
          </p>
          <p>
            Demandez une fiche cuvée à jour, le tarif professionnel applicable, le conditionnement
            et les éventuelles quantités minimales. Votre code postal et votre échéance permettent
            d’aborder les frais de transport et les possibilités d’approvisionnement.
          </p>
          <p>
            Pour présenter le vin à vos clients, le <a href="/domaine/">récit du domaine</a> et les{" "}
            <a href="/terrasses-pierre-seche/">sept terrasses en pierre sèche</a> donnent des
            repères concrets sur le lieu. Les caractéristiques du vin restent propres à chaque
            millésime.
          </p>
          <ButtonLink href="/demande/?profil=caviste&objet=professionnel">
            Présenter mon projet de caviste
          </ButtonLink>
        </div>
      </section>
      <section className="wrap story-section" aria-labelledby="restaurateurs">
        <div>
          <p className="eyebrow">Pour votre restaurant</p>
          <h2 id="restaurateurs">
            Une Syrah,
            <br />
            <em>une place sur votre carte.</em>
          </h2>
        </div>
        <div className="story-copy">
          <p>
            Indiquez le style de votre cuisine, les plats que vous souhaitez accompagner et la place
            envisagée à la carte : à la bouteille ou au verre. Ces éléments permettent d’orienter
            les questions de dégustation vers votre usage réel.
          </p>
          <p>
            Pour étudier une Syrah pour votre restaurant, demandez les conseils de service du
            millésime concerné, ses informations techniques et ses conditions professionnelles.
            Précisez une quantité indicative, la ville de livraison et la date souhaitée pour votre
            carte.
          </p>
          <p>
            Les possibilités de dégustation, d’expédition et de réassort se discutent avec le
            domaine. Elles ne sont pas acquises à l’envoi d’une demande.
          </p>
          <ButtonLink href="/demande/?profil=restaurateur&objet=professionnel">
            Parler de ma carte des vins
          </ButtonLink>
        </div>
      </section>
      <section className="wrap story-section" aria-labelledby="questions-professionnelles">
        <div>
          <p className="eyebrow">Avant de prendre contact</p>
          <h2 id="questions-professionnelles">
            Vos questions,
            <br />
            <em>les premiers repères.</em>
          </h2>
        </div>
        <div className="story-copy article-body">
          <h3>Comment obtenir une fiche technique et un tarif professionnel ?</h3>
          <p>
            Utilisez le formulaire professionnel avec le nom de votre établissement, votre activité
            et la cuvée envisagée. Ajoutez les informations dont vous avez besoin : fiche du
            millésime, prix applicable ou conditions d’approvisionnement.
          </p>
          <h3>Y a-t-il un minimum de commande ou une livraison garantie ?</h3>
          <p>
            Ces conditions doivent être confirmées avec le domaine pour votre demande. Le site
            n’annonce pas de minimum, de franco de port ou de délai garanti. Indiquez une quantité
            et une destination pour étudier les possibilités.
          </p>
          <h3>Puis-je prendre contact avant de choisir une cuvée ?</h3>
          <p>
            Oui. Présentez votre projet de cave ou de restaurant, même exploratoire. Les{" "}
            <a href="/vins/">cuvées présentées</a> et le{" "}
            <a href="/journal/cavistes-restaurateurs-syrah-roty/">guide pour les professionnels</a>{" "}
            vous donnent les premiers éléments pour cet échange.
          </p>
        </div>
      </section>
      <ContactBand />
    </>
  );
}
export function JournalPage() {
  return (
    <>
      <section className="wrap page-intro">
        <Breadcrumb items={[{ label: "Le journal" }]} />
        <p className="eyebrow">Le journal du Roty</p>
        <h1>
          Un lieu à lire.
          <br />
          <em>Un vin à comprendre.</em>
        </h1>
        <p>
          Acheter du vin en direct dans l’Allier, découvrir la Syrah à Saulcet ou préparer une
          demande de caviste ou de restaurateur : cinq articles pour vous orienter, prolongés par le
          récit des terrasses et les archives du domaine.
        </p>
      </section>
      <section className="wrap section-bottom">
        <JournalCards />
      </section>
      <ContactBand />
    </>
  );
}
