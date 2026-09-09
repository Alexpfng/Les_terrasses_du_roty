import { useEffect, useState } from "react";
import { useLtdrStore } from "@/terrasse/lib/store";
import { scrollLock } from "@/terrasse/lib/lenis";
import { LOGOS } from "@/terrasse/lib/assets";

/**
 * Age-gate obligatoire avant tout contenu.
 * Oui → localStorage 30 jours. Non → message de sortie.
 * Bloque le scroll tant que non répondu.
 */
export const AgeGate = () => {
  const ageOk = useLtdrStore((s) => s.ageOk);
  const confirmAge = useLtdrStore((s) => s.confirmAge);
  const [refused, setRefused] = useState(false);

  useEffect(() => {
    if (!ageOk) scrollLock(true);
  }, [ageOk]);

  if (ageOk) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="agegate-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: "var(--z-gate)" as unknown as number,
        background: "var(--ltdr-black)",
        display: "grid",
        placeItems: "center",
        padding: 24,
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "grid",
          justifyItems: "center",
          gap: "clamp(22px, 4vh, 38px)",
          maxWidth: 560,
        }}
      >
        <img
          src={LOGOS.sunGold}
          alt=""
          width={784}
          height={592}
          style={{ width: "clamp(90px, 14vmin, 150px)", height: "auto" }}
        />
        {refused ? (
          <>
            <p
              id="agegate-title"
              className="display"
              style={{ margin: 0, fontSize: "clamp(24px, 3.4vw, 40px)", lineHeight: 1.25 }}
            >
              Ce vin vous attendra.
            </p>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "var(--ltdr-ivory-60)" }}>
              L'accès à ce site est réservé aux personnes ayant l'âge légal pour consommer de
              l'alcool.
            </p>
          </>
        ) : (
          <>
            <p
              id="agegate-title"
              className="display"
              style={{ margin: 0, fontSize: "clamp(24px, 3.4vw, 40px)", lineHeight: 1.25 }}
            >
              Avez-vous l'âge légal pour consommer de l'alcool&nbsp;?
            </p>
            <div style={{ width: 42, height: 1, background: "var(--ltdr-gold)" }} />
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap", justifyContent: "center" }}>
              <button
                type="button"
                data-hover="1"
                onClick={confirmAge}
                style={{
                  padding: "16px 44px",
                  background: "var(--ltdr-gold)",
                  color: "var(--ltdr-black)",
                  border: "1px solid var(--ltdr-gold)",
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Oui
              </button>
              <button
                type="button"
                data-hover="1"
                onClick={() => setRefused(true)}
                style={{
                  padding: "16px 44px",
                  background: "none",
                  color: "var(--ltdr-ivory)",
                  border: "1px solid rgba(244,240,230,0.35)",
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Non
              </button>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 10,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "var(--ltdr-ivory-45)",
              }}
            >
              L'abus d'alcool est dangereux pour la santé. À consommer avec modération.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
