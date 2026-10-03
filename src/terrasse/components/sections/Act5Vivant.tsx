import { useRef } from "react";
import { useScrollScene } from "@/terrasse/hooks/useScrollScene";
import { SectionText } from "@/terrasse/components/ui/SectionText";

const values = [
  {
    n: "I",
    title: "L'aventure humaine",
    text: "Un vignoble rendu à la vie par celles et ceux qui s'y engagent, saison après saison.",
  },
  {
    n: "II",
    title: "La préservation du vivant",
    text: "Pas de pesticides, pas d'intrants de synthèse. Le sol travaille, la vigne répond.",
  },
  {
    n: "III",
    title: "La production biologique",
    text: "Culture, vinification, mise en bouteille : tout se fait à la propriété, à Saulcet.",
  },
];

/** Acte V — Le vivant. Cartes valeurs, bordure qui se trace au survol. */
export const Act5Vivant = () => {
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref, 5);

  return (
    <section
      ref={ref}
      id="acte-5"
      aria-label="Acte V — Le vivant"
      style={{
        position: "relative",
        background: "var(--ltdr-black)",
        padding: "24vh var(--pad-x) 22vh",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h2 className="acte-kicker" style={{ margin: "0 0 36px", fontWeight: 300 }}>
          Acte V — Le vivant
        </h2>
        <SectionText
          style={{ margin: "0 0 18px", fontSize: "clamp(30px, 4.2vw, 58px)", maxWidth: 880 }}
        >
          Bio, parce qu'on ne ressuscite pas une terre en l'empoisonnant.
        </SectionText>
        <p
          style={{
            margin: "0 0 10vh",
            fontSize: 12,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(201,162,39,0.9)",
          }}
        >
          Cuvée 2024 certifiée Ecocert<span style={{ fontSize: 9, verticalAlign: "super" }}>®</span>
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 2,
          }}
        >
          {values.map((v) => (
            <div key={v.n} className="value-card" data-hover="1">
              <svg className="value-card-border" aria-hidden="true" preserveAspectRatio="none">
                <rect
                  x="0.5"
                  y="0.5"
                  width="100%"
                  height="100%"
                  pathLength={1}
                  style={{ width: "calc(100% - 1px)", height: "calc(100% - 1px)" }}
                />
              </svg>
              <div
                className="display"
                style={{ fontSize: 15, color: "var(--ltdr-gold)", marginBottom: 26 }}
              >
                {v.n}
              </div>
              <h3
                className="display"
                style={{
                  margin: "0 0 16px",
                  fontWeight: 500,
                  fontSize: "clamp(22px, 2vw, 28px)",
                  color: "var(--ltdr-ivory)",
                }}
              >
                {v.title}
              </h3>
              <p
                style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "var(--ltdr-ivory-60)" }}
              >
                {v.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
