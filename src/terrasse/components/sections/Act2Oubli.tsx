import { useRef } from "react";
import { gsap, useGSAP } from "@/terrasse/lib/gsapSetup";
import { ANIM } from "@/terrasse/lib/animConfig";
import { useScrollScene } from "@/terrasse/hooks/useScrollScene";
import { prefersReducedMotion } from "@/terrasse/hooks/useReducedMotion";
import { SectionText } from "@/terrasse/components/ui/SectionText";
import { Pic } from "@/terrasse/components/ui/Pic";
import { PHOTOS, TERRACE_VIDEO } from "@/terrasse/lib/assets";

/** Parallaxe 3 plans : chaque [data-depth] dérive selon sa profondeur. */
const useParallax = (ref: React.RefObject<HTMLElement>) => {
  useGSAP(
    () => {
      const root = ref.current;
      if (!root || prefersReducedMotion()) return;
      // amplitude mise à l'échelle : plus présente sur grand écran, contenue sur mobile
      const w = window.innerWidth;
      const amp = ANIM.parallax.amplitude * (w > 1600 ? 1.2 : w > 1024 ? 1 : 0.6);
      root.querySelectorAll<HTMLElement>("[data-depth]").forEach((el) => {
        const d = parseFloat(el.getAttribute("data-depth") ?? "0.3");
        gsap.fromTo(
          el,
          { yPercent: d * amp },
          {
            yPercent: -d * amp,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: ANIM.parallax.scrub,
            },
          },
        );
      });
    },
    { scope: ref },
  );
};

export const Act2Oubli = () => {
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref, 2);
  useParallax(ref);

  return (
    <section
      ref={ref}
      id="acte-2"
      aria-label="Acte II — L'oubli"
      style={{
        position: "relative",
        background: "linear-gradient(#0A0908, #0C0A08 50%, #0A0908)",
        overflow: "hidden",
        padding: "clamp(18vh, 22vh, 26vh) 0",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 var(--pad-x)" }}>
        {/* texte d'intro — colonne gauche, aligné à la grille */}
        <div style={{ maxWidth: 620 }}>
          <h2 className="acte-kicker" style={{ margin: "0 0 32px", fontWeight: 300 }}>
            Acte II — L'oubli
          </h2>
          <SectionText>
            Pendant des décennies, la vigne a dormi ici. Sept terrasses de pierre sèche, rendues aux
            ronces, face plein sud, sous le soleil de Saulcet.
          </SectionText>
        </div>

        {/* grande image — décalée à droite */}
        <figure
          data-depth="0.4"
          style={{ width: "clamp(280px, 56vw, 680px)", margin: "clamp(14vh, 18vh, 22vh) 0 0 auto" }}
        >
          <video
            src={TERRACE_VIDEO.src}
            poster={TERRACE_VIDEO.poster}
            autoPlay
            muted
            loop
            playsInline
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              filter: "var(--duotone) brightness(0.62)",
              opacity: 0.85,
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
            Saulcet — les terrasses
          </figcaption>
        </figure>

        {/* seconde image — décalée à gauche, plus petite (profondeur) */}
        <figure
          data-depth="0.2"
          style={{ width: "clamp(240px, 40vw, 460px)", margin: "clamp(12vh, 16vh, 20vh) 0 0" }}
        >
          <Pic
            photo={PHOTOS.drone}
            sizes="(max-width: 900px) 70vw, 40vw"
            style={{ filter: "var(--duotone) brightness(0.6)", opacity: 0.82 }}
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
            Sept terrasses rendues aux ronces
          </figcaption>
        </figure>
      </div>
    </section>
  );
};
