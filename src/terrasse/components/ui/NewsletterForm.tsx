import { useState, type FormEvent } from "react";
import { useMagnetic } from "@/terrasse/hooks/useMagnetic";

/**
 * TODO_INTEGRATION : brancher sur le formulaire client du Shopify existant
 * (POST https://www.les-terrasses-du-roty.fr/contact — form_type "customer",
 * champ "contact[email]", tag "newsletter"). L'endpoint n'étant pas vérifiable
 * hors production (CORS + captcha Shopify), l'envoi est isolé ici :
 * remplacer le corps de `submit` une fois le shop accessible.
 */
export const NewsletterForm = () => {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const btnRef = useMagnetic<HTMLButtonElement>(0.3, 70);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    if (!email || !email.includes("@") || email.startsWith("@")) {
      setError("Une adresse email valide, s'il vous plaît");
      return;
    }
    setError(null);
    setDone(true);
  };

  if (done) {
    return (
      <p
        className="display"
        style={{
          padding: "14px 0",
          fontSize: 19,
          fontStyle: "italic",
          color: "var(--ltdr-gold)",
          margin: 0,
          animation: "ltdr-pop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        }}
        role="status"
      >
        Merci. Vous serez prévenus les premiers.
      </p>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      style={{
        display: "flex",
        gap: 0,
        marginTop: 28,
        maxWidth: 440,
        borderBottom: "1px solid rgba(244,240,230,0.3)",
      }}
    >
      <label
        htmlFor="ltdr-news"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clipPath: "inset(50%)",
        }}
      >
        Votre adresse email
      </label>
      <input
        id="ltdr-news"
        name="email"
        type="email"
        autoComplete="email"
        placeholder={error ?? "Votre adresse email"}
        style={{
          flex: 1,
          minWidth: 0,
          background: "none",
          border: "none",
          outline: "none",
          color: "var(--ltdr-ivory)",
          fontFamily: "var(--font-body)",
          fontWeight: 300,
          fontSize: 14,
          padding: "14px 0",
        }}
      />
      <button
        ref={btnRef}
        type="submit"
        data-hover="1"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--ltdr-gold)",
          fontSize: 11,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          padding: "14px 0 14px 18px",
          willChange: "transform",
        }}
      >
        S'inscrire
      </button>
    </form>
  );
};
