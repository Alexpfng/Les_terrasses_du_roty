import { useRef } from "react";
import { gsap, useGSAP } from "@/terrasse/lib/gsapSetup";
import { ANIM } from "@/terrasse/lib/animConfig";
import { useScrollScene } from "@/terrasse/hooks/useScrollScene";
import { prefersReducedMotion } from "@/terrasse/hooks/useReducedMotion";
import { SectionText } from "@/terrasse/components/ui/SectionText";
import { Counter } from "@/terrasse/components/ui/Counter";
import { Pic } from "@/terrasse/components/ui/Pic";
import { PHOTOS } from "@/terrasse/lib/assets";

/** Acte III — Les mains. Le N&B passe en couleur, piloté par le scroll. */
export const Act3Mains = () => {
  const ref = useRef<HTMLElement>(null);
  const figRef = useRef<HTMLElement>(null);
  useScrollScene(ref, 3);

  useGSAP(
    () => {
      const root = ref.current;
      const fig = figRef.current;
      if (!root || !fig) return;
      const img = fig.querySelector("img");
      if (!img) return;
      if (prefersReducedMotion()) {
        img.style.filter = "grayscale(0) brightness(1)";
        return;
      }
      // variable CSS --desat interpolée par le scrub
      const state = { desat: 1 };
      gsap.to(state, {
        desat: 0,
        ease: "none",
        scrollTrigger: { trigger: root, start: ANIM.desat.start, end: ANIM.desat.end, scrub: true },
        onUpdate: () => {
          img.style.setProperty("--desat", state.desat.toFixed(3));
        },
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="acte-3"
      aria-label="Acte III — Les mains"
      style={{
        position: "relative",
        background: "var(--ltdr-black)",
        overflow: "hidden",
        padding: "clamp(16vh, 20vh, 24vh) 0 clamp(18vh, 22vh, 26vh)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 var(--pad-x)" }}>
        {/* texte — colonne droite */}
        <div style={{ maxWidth: 620, marginLeft: "auto" }}>
          <h2 className="acte-kicker" style={{ margin: "0 0 32px", fontWeight: 300 }}>
            Acte III — Les mains
          </h2>
          <SectionText>
            Nous les avons rouvertes. À la main. Pierre par pierre, cep par cep. Pas de machine sur
            ces pentes — seulement le geste, répété, exigeant.
          </SectionText>
        </div>

        {/* image (révélation gris→couleur au scroll) — décalée à gauche */}
        <figure
          ref={figRef}
          style={{ width: "clamp(260px, 46vw, 600px)", margin: "clamp(14vh, 18vh, 22vh) auto 0 0" }}
        >
          <Pic
            photo={PHOTOS.mains}
            sizes="(max-width: 900px) 75vw, 46vw"
            style={{
              filter:
                "grayscale(var(--desat, 1)) brightness(calc(0.7 + 0.3 * (1 - var(--desat, 1))))",
            }}
          />
          <figcaption
            style={{
              marginTop: 12,
              fontSize: 10,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: "var(--ltdr-ivory-35)",
            }}
          >
            Parcelle par parcelle
          </figcaption>
        </figure>
      </div>

      {/* compteurs — bandeau centré */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "clamp(40px, 8vw, 120px)",
          padding: "clamp(14vh, 18vh, 22vh) 24px 0",
        }}
      >
        <Counter value={7} label="terrasses de pierre sèche" />
        <Counter value={100} suffix=" %" label="Syrah, récoltée à la main" />
        <Counter value={0} label="intrant chimique de synthèse" />
      </div>
    </section>
  );
};
