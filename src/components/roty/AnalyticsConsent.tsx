import { useEffect, useRef, useState } from "react";
import {
  ANALYTICS_PREFERENCES_EVENT,
  createAnalyticsController,
  registerAnalyticsController,
  type AnalyticsController,
  type AnalyticsState,
} from "../../lib/analytics.js";

export function AnalyticsPreferencesButton() {
  return (
    <button
      type="button"
      className="analytics-preferences"
      onClick={() => window.dispatchEvent(new CustomEvent(ANALYTICS_PREFERENCES_EVENT))}
    >
      Gérer les cookies
    </button>
  );
}

export function AnalyticsConsent({
  pathname,
  allowedPaths,
}: {
  pathname: string;
  allowedPaths: readonly string[];
}) {
  const [state, setState] = useState<AnalyticsState>({
    ready: false,
    available: false,
    choice: "unknown",
  });
  const [opened, setOpened] = useState(false);
  const [saved, setSaved] = useState("");
  const controller = useRef<AnalyticsController | null>(null);
  const panel = useRef<HTMLElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const initialPaths = useRef(allowedPaths);

  useEffect(() => {
    const analytics = createAnalyticsController({
      browser: window,
      allowedPaths: initialPaths.current,
    });
    controller.current = analytics;
    const unsubscribe = analytics.subscribe(setState);
    const unregister = registerAnalyticsController(analytics);
    const open = () => {
      returnFocus.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setSaved("");
      setOpened(true);
      requestAnimationFrame(() => panel.current?.focus());
    };
    window.addEventListener(ANALYTICS_PREFERENCES_EVENT, open);
    void analytics.initialize();
    return () => {
      unsubscribe();
      unregister();
      analytics.dispose();
      window.removeEventListener(ANALYTICS_PREFERENCES_EVENT, open);
      controller.current = null;
    };
  }, []);

  useEffect(() => {
    controller.current?.pageView(pathname);
  }, [pathname]);

  const visible = opened || (state.ready && state.available && state.choice === "unknown");
  function choose(choice: "accepted" | "refused") {
    controller.current?.choose(choice);
    setOpened(false);
    setSaved(
      choice === "accepted"
        ? "Votre accord pour la mesure d’audience est enregistré."
        : "La mesure d’audience est refusée. Votre choix est enregistré.",
    );
    returnFocus.current?.focus();
  }

  return (
    <>
      <span className="analytics-saved" role="status">
        {saved}
      </span>
      {visible ? (
        <section
          ref={panel}
          tabIndex={-1}
          className="analytics-consent"
          aria-labelledby="analytics-title"
          aria-describedby="analytics-description"
        >
          <div className="analytics-copy">
            <h2 id="analytics-title">Mesure d’audience</h2>
            <p id="analytics-description">
              {state.available
                ? "Avec votre accord, Google Analytics nous aide à comprendre les pages consultées et les demandes transmises. Aucun nom, e-mail ni message saisi n’est envoyé à cet outil."
                : "La mesure d’audience Google Analytics est désactivée sur cette version du site. Aucun traceur Google Analytics n’est chargé."}
            </p>
            <p>
              Votre choix est conservé pendant six mois et peut être modifié ici à tout moment.{" "}
              <a href="/confidentialite/">Informations sur vos données</a>.
            </p>
            {state.choice === "accepted" && state.available ? (
              <p>
                Vous avez accepté la mesure d’audience. Vous pouvez retirer cet accord ci-dessous.
              </p>
            ) : null}
          </div>
          <div className="analytics-actions">
            {state.available ? (
              <>
                <button
                  className="analytics-choice"
                  type="button"
                  onClick={() => choose("refused")}
                >
                  {state.choice === "accepted" ? "Retirer mon accord" : "Refuser"}
                </button>
                <button
                  className="analytics-choice"
                  type="button"
                  onClick={() => choose("accepted")}
                >
                  Accepter
                </button>
              </>
            ) : (
              <button
                className="analytics-choice"
                type="button"
                onClick={() => {
                  setOpened(false);
                  returnFocus.current?.focus();
                }}
              >
                Fermer
              </button>
            )}
          </div>
        </section>
      ) : null}
    </>
  );
}
