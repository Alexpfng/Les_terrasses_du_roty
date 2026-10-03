import { useRef } from "react";
import { useScrollScene } from "@/terrasse/hooks/useScrollScene";
import { useMagnetic } from "@/terrasse/hooks/useMagnetic";
import { Accordion, type FaqItem } from "@/terrasse/components/ui/Accordion";
import { Pic } from "@/terrasse/components/ui/Pic";
import { Footer } from "@/terrasse/components/layout/Footer";
import { PHOTOS, SHOP } from "@/terrasse/lib/assets";

// Typographie FR : espaces insecables U+00A0 avant la ponctuation double et autour des guillemets
const FAQ: FaqItem[] = [
  {
    q: "Que contient la cuvée « Les Terrasses du Roty » ?",
    a: "Une Syrah 100 %, récoltée à la main sur les terrasses de pierre sèche de Saulcet, dans le vignoble de Saint-Pourçain. Un vin élégant, fruité, intense — issu d'une récolte certifiée biologique.",
  },
  {
    q: "Votre vin est-il bio ?",
    a: "Oui. Les parcelles sont cultivées selon les principes de l'agriculture biologique, sans pesticides ni intrants chimiques de synthèse. La cuvée 2024 est certifiée Ecocert®. Une démarche qui respecte le sol, la vigne et celles et ceux qui boivent ce vin.",
  },
  {
    q: "Quels sont les frais de livraison ?",
    a: "Ils sont calculés au moment du paiement, selon le nombre de bouteilles et le lieu de livraison. La livraison est offerte dès 300 € d'achat en France métropolitaine.",
  },
  {
    q: "Quand vais-je recevoir ma commande ?",
    a: "La cuvée 2024 est en précommande. Les premières livraisons partent à la mise en bouteille, en novembre 2025. Vous êtes informé par email à chaque étape.",
  },
  {
    q: "Où sont fabriqués vos produits ?",
    a: "Tout se fait à la propriété, à Saulcet : la culture, la vinification, la mise en bouteille. Rien ne quitte le domaine avant d’être prêt.",
  },
];

/** Acte VII — La rencontre. Boutique (checkout sur le Shopify existant), FAQ, footer. */
export const Act7Boutique = () => {
  const ref = useRef<HTMLElement>(null);
  const ctaRef = useMagnetic<HTMLAnchorElement>();
  useScrollScene(ref, 7);

  return (
    <section
      ref={ref}
      id="acte-7"
      aria-label="Acte VII — La rencontre"
      style={{ position: "relative" }}
    >
      {/* pont tonal : fond sombre de la bouteille → ivoire, sans coupe sèche */}
      <div
        aria-hidden="true"
        style={{
          height: "22vh",
          background:
            "linear-gradient(to bottom, var(--ltdr-black-bottle), #1c1712 35%, var(--ltdr-ivory))",
        }}
      />
      <div
        id="ltdr-light"
        style={{
          background: "var(--ltdr-ivory)",
          color: "var(--ltdr-black)",
          padding: "4vh var(--pad-x) 14vh",
        }}
      >
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <p className="acte-kicker" style={{ color: "var(--ltdr-gold-dark)" }}>
            Acte VII — La rencontre
          </p>
          <h2
            className="display"
            style={{
              margin: "0 0 14px",
              fontSize: "var(--fs-h2)",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
            }}
          >
            Deux cuvées.
            <br />
            Pas une de plus.
          </h2>
          <p
            style={{
              margin: "0 0 9vh",
              fontSize: "clamp(13px, 1vw, 15px)",
              letterSpacing: "0.04em",
              color: "var(--ltdr-ink-strong)",
            }}
          >
            Livraison offerte dès 300&nbsp;€ en France métropolitaine.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
              gap: "clamp(28px, 4vw, 56px)",
            }}
          >
            <article style={{ display: "grid", gap: 0, alignContent: "start" }}>
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  background: "var(--ltdr-black)",
                }}
              >
                <Pic
                  photo={PHOTOS.cuvee2023}
                  sizes="(max-width: 900px) 90vw, 45vw"
                  style={{
                    height: "clamp(300px, 36vw, 460px)",
                    objectFit: "cover",
                    opacity: 0.95,
                    filter: "var(--grade-photo)",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: 18,
                    left: 18,
                    padding: "8px 14px",
                    border: "1px solid rgba(244,240,230,0.8)",
                    color: "var(--ltdr-ivory)",
                    fontSize: 10,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                  }}
                >
                  Épuisée
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 16,
                  marginTop: 24,
                }}
              >
                <h3
                  className="display"
                  style={{ margin: 0, fontWeight: 500, fontSize: "clamp(24px, 2.4vw, 34px)" }}
                >
                  Cuvée 2023
                </h3>
                <span
                  className="display"
                  style={{
                    fontSize: 22,
                    color: "rgba(10,9,8,0.4)",
                    textDecoration: "line-through",
                  }}
                >
                  25 €
                </span>
              </div>
              <p
                style={{
                  margin: "10px 0 0",
                  fontSize: "clamp(13px, 1vw, 15px)",
                  lineHeight: 1.75,
                  color: "var(--ltdr-ink-strong)",
                }}
              >
                Première cuvée née des terrasses rouvertes. Partie en quelques semaines — la rareté
                n'est pas un argument, c'est un fait.
              </p>
            </article>

            <article style={{ display: "grid", gap: 0, alignContent: "start" }}>
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  background: "var(--ltdr-black)",
                }}
              >
                <Pic
                  photo={PHOTOS.coffret2024}
                  sizes="(max-width: 900px) 90vw, 45vw"
                  style={{
                    height: "clamp(300px, 36vw, 460px)",
                    objectFit: "cover",
                    objectPosition: "center 30%",
                    filter: "var(--grade-photo)",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: 18,
                    left: 18,
                    padding: "8px 14px",
                    background: "var(--ltdr-gold)",
                    color: "var(--ltdr-black)",
                    fontSize: 10,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                  }}
                >
                  Précommande
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 16,
                  marginTop: 24,
                }}
              >
                <h3
                  className="display"
                  style={{ margin: 0, fontWeight: 500, fontSize: "clamp(24px, 2.4vw, 34px)" }}
                >
                  Cuvée 2024
                </h3>
                <span className="display" style={{ fontSize: 26 }}>
                  25 €
                </span>
              </div>
              <p
                style={{
                  margin: "10px 0 0",
                  fontSize: "clamp(13px, 1vw, 15px)",
                  lineHeight: 1.75,
                  color: "var(--ltdr-ink-strong)",
                }}
              >
                Syrah 100 %, certifiée Ecocert
                <span style={{ fontSize: 9, verticalAlign: "super" }}>®</span>. Livraison à la mise
                en bouteille, novembre 2025.
              </p>
              <a
                ref={ctaRef}
                href={SHOP.cuvee2024}
                target="_blank"
                rel="noopener noreferrer"
                data-hover="1"
                className="cta-dark"
                style={{
                  marginTop: 26,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "18px 38px",
                  background: "var(--ltdr-black)",
                  color: "var(--ltdr-ivory)",
                  textDecoration: "none",
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  transition: "background .4s, color .4s",
                  justifySelf: "start",
                }}
              >
                Précommander
              </a>
            </article>
          </div>

          <div style={{ marginTop: "16vh", maxWidth: 820 }}>
            <h3
              className="display"
              style={{ margin: "0 0 5vh", fontSize: "clamp(28px, 3.4vw, 46px)" }}
            >
              Questions fréquentes
            </h3>
            <Accordion items={FAQ} />
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
};
