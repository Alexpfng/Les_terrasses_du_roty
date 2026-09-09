import { Breadcrumb } from "./SiteLayout";
export function LegalPage({ kind }: { kind: "mentions" | "confidentialite" | "conditions" }) {
  const title =
    kind === "mentions"
      ? "Mentions légales"
      : kind === "confidentialite"
        ? "Vos données personnelles"
        : "Les modalités d’achat";
  return (
    <>
      <section className="wrap page-intro">
        <Breadcrumb items={[{ label: title }]} />
        <p className="eyebrow">Les Terrasses du Roty</p>
        <h1>{title}</h1>
      </section>
      <div className="wrap legal">
        {kind === "mentions" ? (
          <>
            <h2>Éditeur du site</h2>
            <p>LES COTES DU ROTY, société par actions simplifiée au capital de 4 000 €.</p>
            <dl>
              <dt>Siège social</dt>
              <dd>14 Chemin du Gravier, 03300 Cusset, France.</dd>
              <dt>Immatriculation</dt>
              <dd>SIREN 892 392 010 · SIRET 892 392 010 00013 · RCS Cusset.</dd>
              <dt>TVA intracommunautaire</dt>
              <dd>FR01892392010.</dd>
              <dt>Président</dt>
              <dd>TOMAX, SIREN 507 934 727.</dd>
              <dt>Directeur de la publication</dt>
              <dd>Jean-Christophe Corre.</dd>
            </dl>
            <h2>Nous contacter</h2>
            <p>
              Le formulaire de la page <a href="/demande/">Contacter le domaine</a> est destiné aux
              demandes d’information et de bouteilles. Vous pouvez également nous joindre au{" "}
              <a href="tel:+33621560117">+33 6 21 56 01 17</a> ou par courrier au siège social.
              Adresse électronique : taff.roty@gmail.com.
            </p>
            <p>
              Les vignes du Roty se trouvent à Saulcet, dans l’Allier. Le siège social ne constitue
              pas une adresse d’accueil sans rendez-vous.
            </p>
            <h2>Hébergement du domaine public</h2>
            <p>
              Au 9 septembre 2026, le domaine www.les-terrasses-du-roty.fr est servi par Shopify
              International Limited, Victoria Buildings, 2nd Floor, 1–2 Haddington Road, Dublin 4,
              D04 XN32, Irlande. <a href="https://www.shopify.com/fr/contact">Contacter Shopify</a>.
            </p>
            <h2>Contenus et crédits</h2>
            <p>
              Le logo et les photographies proviennent des fichiers du domaine. Leur reproduction ou
              leur réutilisation nécessite l’autorisation de leurs ayants droit. Les articles citent
              les références utiles à leur contenu.
            </p>
            <p>
              L’usage du site suppose de respecter son fonctionnement et de ne pas envoyer de
              contenus illicites, de fausses demandes ou de sollicitations automatisées abusives.
            </p>
          </>
        ) : kind === "confidentialite" ? (
          <>
            <h2>Qui traite vos données ?</h2>
            <p>
              LES COTES DU ROTY, 14 Chemin du Gravier, 03300 Cusset, est responsable des données
              communiquées au domaine. Contact : taff.roty@gmail.com ou{" "}
              <a href="tel:+33621560117">+33 6 21 56 01 17</a>.
            </p>
            <h2>À quoi servent-elles ?</h2>
            <p>
              Le formulaire sert à répondre à votre demande. Les nom, e-mail, profil, objet et
              déclaration de majorité sont nécessaires à ce parcours. Le téléphone, l’établissement,
              la cuvée, la quantité, le pays, le code postal et le message précisent votre besoin
              lorsque vous les renseignez.
            </p>
            <p>
              Les demandes de bouteilles sont traitées pour préparer, à votre initiative, un
              éventuel achat. Les autres échanges et les mesures de protection contre les abus
              répondent à l’intérêt légitime du domaine de vous répondre et de sécuriser son
              service. Le formulaire ne vous inscrit à aucune liste de prospection.
            </p>
            <h2>Qui reçoit votre demande ?</h2>
            <p>
              Votre message est destiné aux personnes habilitées du domaine, dans la boîte
              taff.roty@gmail.com. Les prestataires techniques d’hébergement, d’acheminement et de
              messagerie interviennent dans sa transmission et sa conservation. Aucun message n’est
              envoyé par cette version tant que le service d’acheminement n’a pas été configuré.
            </p>
            <h2>Conservation</h2>
            <p>
              Le site ne crée pas de compte client et ne conserve pas le texte de votre demande dans
              une base de prospects. Les identifiants techniques nécessaires à la prévention des
              doubles envois expirent après 48 heures ; les compteurs de limitation sont
              temporaires. Le serveur ne recopie pas votre message dans ses journaux applicatifs.
            </p>
            <p>
              Les échanges reçus dans la messagerie du domaine servent au suivi de votre demande.
              Leur effacement n’est pas piloté automatiquement par le formulaire. Vous pouvez
              demander au domaine les précisions sur la conservation de votre échange ou exercer
              votre droit à l’effacement, sous réserve des obligations de conservation applicables.
            </p>
            <h2>Vos droits</h2>
            <p>
              Vous pouvez demander l’accès, la rectification, l’effacement ou la limitation de
              l’utilisation de vos données et, selon le traitement, leur portabilité. Vous pouvez
              vous opposer aux traitements fondés sur l’intérêt légitime. Adressez votre demande à
              taff.roty@gmail.com ou au siège social, en précisant les informations nécessaires pour
              identifier l’échange concerné.
            </p>
            <p>
              Vous pouvez également adresser une réclamation à la{" "}
              <a href="https://www.cnil.fr/fr/plaintes">CNIL</a>.
            </p>
            <h2>Cookies et mesure d’audience</h2>
            <p>
              Cette version du site n’intègre ni publicité, ni outil de suivi d’audience, ni
              inscription automatique à une newsletter. Les polices et les images sont servies
              depuis le site. Aucun cookie publicitaire n’est déposé par l’application.
            </p>
          </>
        ) : (
          <>
            <h2>Une demande, puis un échange</h2>
            <p>
              Le site présente le domaine et ses cuvées. Il permet d’adresser une demande
              d’information ou de bouteilles. L’envoi du formulaire ne constitue ni une commande, ni
              une réservation, ni un paiement.
            </p>
            <h2>Disponibilités et informations</h2>
            <p>
              Le domaine confirme le millésime, la dénomination et la fiche de la cuvée, les
              quantités disponibles, le prix applicable et les conditions proposées. Une ancienne
              présentation de millésime ne garantit pas sa disponibilité actuelle.
            </p>
            <h2>Prix, retrait et expédition</h2>
            <p>
              Avant tout achat, le domaine précise les références, les quantités, le montant à
              régler, les frais éventuels et les modalités retenues. Les possibilités de retrait ou
              d’expédition doivent être confirmées au cas par cas. Prenez contact avant de vous
              déplacer.
            </p>
            <h2>Confirmation d’un achat</h2>
            <p>
              Si une vente est envisagée après l’échange, le domaine communique les conditions
              applicables avant votre accord. Les délais, modalités de paiement, livraison,
              réclamation et droits éventuellement applicables sont à vérifier dans cette
              proposition. Aucune condition de livraison ou de retour ancienne n’est reconduite par
              le simple usage du formulaire.
            </p>
            <h2>Majorité et consommation responsable</h2>
            <p>
              La vente d’alcool aux mineurs est interdite. La déclaration de majorité du formulaire
              ne remplace pas les vérifications qui s’appliquent lors d’une vente.
            </p>
            <p>L’abus d’alcool est dangereux pour la santé. À consommer avec modération.</p>
            <h2>Une question sur un achat antérieur ?</h2>
            <p>
              <a href="/demande/?objet=autre">Contactez le domaine</a> en précisant la référence
              utile. Le nouveau parcours ne supprime pas vos échanges ou documents commerciaux
              antérieurs.
            </p>
          </>
        )}
      </div>
    </>
  );
}
