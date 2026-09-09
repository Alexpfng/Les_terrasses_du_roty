import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { demandeSchema, demandeAcceptedMessage } from "@/lib/demande-schema";

type Defaults = { cuvee?: string; profil?: string; objet?: string };
type Result = {
  status?: string;
  request_id?: string;
  message?: string;
  code?: string;
  field_errors?: Record<string, string | string[]>;
};
const fieldLabels: Record<string, string> = {
  name: "Nom",
  email: "E-mail",
  profile: "Profil",
  purpose: "Objet",
  company: "Établissement",
  phone: "Téléphone",
  cuvee: "Cuvée",
  estimated_quantity: "Quantité",
  country: "Pays",
  postal_code: "Code postal",
  message: "Message",
  is_adult: "Majorité",
};
export function DemandeForm({ defaults }: { defaults: Defaults }) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const [profile, setProfile] = useState(
    defaults.profil === "professionnel" ? "professionnel" : "particulier",
  );
  const [shipping, setShipping] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "error" | "success">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");
  const [requestId, setRequestId] = useState("");
  const key = useRef("");
  const firstAttemptAt = useRef(0);
  const previousPayload = useRef("");
  const inFlight = useRef(false);
  const uncertain = useRef(false);
  const summary = useRef<HTMLDivElement>(null);
  function showErrors(message: string, fields: Record<string, string> = {}) {
    setNotice(message);
    setErrors(fields);
    setState("error");
    requestAnimationFrame(() => summary.current?.focus());
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    if (
      uncertain.current &&
      firstAttemptAt.current &&
      Date.now() - firstAttemptAt.current >= 23 * 60 * 60 * 1000
    ) {
      showErrors(
        "Le délai de réessai sécurisé est dépassé. Contactez le domaine au +33 6 21 56 01 17 pour vérifier la réception avant toute nouvelle demande.",
      );
      return;
    }
    const form = new FormData(event.currentTarget);
    const optional = (name: string) => String(form.get(name) || "").trim() || undefined;
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      profile,
      purpose: form.get("purpose"),
      company: profile === "professionnel" ? optional("company") : undefined,
      phone: optional("phone"),
      cuvee: optional("cuvee"),
      estimated_quantity: optional("estimated_quantity")
        ? Number(form.get("estimated_quantity"))
        : undefined,
      country: shipping ? optional("country") : undefined,
      postal_code: shipping ? optional("postal_code") : undefined,
      message: optional("message"),
      is_adult: form.get("is_adult") === "on",
      website: String(form.get("website") || ""),
      source_path: "/demande/",
    };
    const fingerprint = JSON.stringify(payload);
    if (!key.current || (fingerprint !== previousPayload.current && !uncertain.current)) {
      key.current = crypto.randomUUID();
      firstAttemptAt.current = Date.now();
    }
    if (uncertain.current && fingerprint !== previousPayload.current) {
      showErrors(
        "La transmission précédente reste incertaine. Réessayez avec le même contenu pour éviter un double envoi, ou contactez le domaine par téléphone pour vérifier votre demande.",
      );
      return;
    }
    const parsed = demandeSchema.safeParse({ ...payload, idempotency_key: key.current });
    if (!parsed.success) {
      const fields: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const name = String(issue.path[0]);
        fields[name] ||= issue.message;
      }
      showErrors("Vérifiez les champs indiqués avant d’envoyer votre demande.", fields);
      return;
    }
    previousPayload.current = fingerprint;
    inFlight.current = true;
    setState("sending");
    setErrors({});
    setNotice("");
    try {
      const response = await fetch("/api/demandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
        signal: AbortSignal.timeout(25000),
      });
      const result = (await response.json()) as Result;
      if (response.ok && result.status === "accepted" && result.request_id) {
        uncertain.current = false;
        setRequestId(result.request_id);
        setState("success");
        requestAnimationFrame(() => summary.current?.focus());
      } else {
        uncertain.current = result.status === "uncertain";
        const fields = Object.fromEntries(
          Object.entries(result.field_errors || {}).map(([name, value]) => [
            name,
            Array.isArray(value) ? value[0] : value,
          ]),
        );
        showErrors(
          result.message ||
            "La transmission n’est pas confirmée. Votre saisie est conservée ; vous pouvez réessayer.",
          fields,
        );
      }
    } catch {
      uncertain.current = true;
      showErrors(
        "La connexion a été interrompue : la transmission n’est pas confirmée. Votre saisie est conservée. Réessayez sans modifier le contenu pour éviter un double envoi.",
      );
    } finally {
      inFlight.current = false;
    }
  }
  function fieldError(name: string) {
    return errors[name] ? (
      <span className="field-error" id={`${name}-error`}>
        {errors[name]}
      </span>
    ) : null;
  }
  const invalid = (name: string) => ({
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });
  if (state === "success")
    return (
      <div className="form-notice form-success" role="status" tabIndex={-1} ref={summary}>
        <p className="eyebrow">Demande transmise</p>
        <h2>Merci pour votre message.</h2>
        <p>{demandeAcceptedMessage}</p>
        <p className="fine-print">Référence : {requestId}</p>
        <a className="text-link" href="/vins/">
          Revenir aux cuvées <span aria-hidden="true">↗</span>
        </a>
      </div>
    );
  return (
    <form
      method="post"
      action="/api/demandes"
      className="request-form"
      onSubmit={submit}
      noValidate
      aria-busy={state === "sending"}
    >
      <noscript>
        <p className="form-notice">
          L’envoi sécurisé nécessite JavaScript. Vous pouvez joindre le domaine au +33 6 21 56 01
          17. Aucun message n’est envoyé tant que le formulaire n’a pas pu être transmis.
        </p>
      </noscript>
      {state === "error" ? (
        <div className="form-notice" role="alert" tabIndex={-1} ref={summary}>
          <h2>Votre demande n’est pas confirmée.</h2>
          <p>{notice}</p>
          {Object.keys(errors).length ? (
            <ul>
              {Object.entries(errors).map(([name, error]) => (
                <li key={name}>
                  <a href={`#${name}`}>
                    {fieldLabels[name] || name} : {error}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
      <p className="form-help">
        Les champs marqués * sont indispensables. Aucune information de paiement n’est demandée.
      </p>
      <hr className="form-divider" />
      <fieldset disabled={state === "sending"}>
        <legend className="form-legend">Vous êtes *</legend>
        <div className="profile-options">
          <label>
            <input
              type="radio"
              name="profile"
              id="profile"
              value="particulier"
              checked={profile === "particulier"}
              onChange={() => setProfile("particulier")}
            />{" "}
            Particulier
          </label>
          <label>
            <input
              type="radio"
              name="profile"
              value="professionnel"
              checked={profile === "professionnel"}
              onChange={() => setProfile("professionnel")}
            />{" "}
            Professionnel
          </label>
        </div>
        {fieldError("profile")}
        <hr className="form-divider" />
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="name">Votre nom *</label>
            <input
              id="name"
              name="name"
              autoComplete="name"
              required
              minLength={2}
              maxLength={120}
              {...invalid("name")}
            />
            {fieldError("name")}
          </div>
          <div className="form-field">
            <label htmlFor="email">Votre e-mail *</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              {...invalid("email")}
            />
            {fieldError("email")}
          </div>
          {profile === "professionnel" ? (
            <div className="form-field full-field">
              <label htmlFor="company">
                Établissement <span>facultatif</span>
              </label>
              <input
                id="company"
                name="company"
                autoComplete="organization"
                maxLength={160}
                {...invalid("company")}
              />
              {fieldError("company")}
            </div>
          ) : null}
          <div className="form-field">
            <label htmlFor="purpose">Objet de la demande *</label>
            <select
              id="purpose"
              name="purpose"
              defaultValue={
                defaults.objet || (profile === "professionnel" ? "professionnel" : "bouteilles")
              }
              required
              {...invalid("purpose")}
            >
              <option value="bouteilles">Demander des bouteilles</option>
              <option value="conseil">Découvrir / demander conseil</option>
              <option value="professionnel">Demande professionnelle</option>
              <option value="autre">Autre question</option>
            </select>
            {fieldError("purpose")}
          </div>
          <div className="form-field">
            <label htmlFor="phone">
              Téléphone <span>facultatif</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              maxLength={40}
              {...invalid("phone")}
            />
            {fieldError("phone")}
          </div>
          <div className="form-field">
            <label htmlFor="cuvee">Cuvée souhaitée</label>
            <select
              id="cuvee"
              name="cuvee"
              defaultValue={defaults.cuvee || "a_conseiller"}
              {...invalid("cuvee")}
            >
              <option value="a_conseiller">Je souhaite être conseillé(e)</option>
              <option value="2024">Cuvée 2024</option>
              <option value="2023">Cuvée 2023</option>
            </select>
            {fieldError("cuvee")}
          </div>
          <div className="form-field">
            <label htmlFor="estimated_quantity">
              Quantité estimée <span>facultative</span>
            </label>
            <input
              id="estimated_quantity"
              name="estimated_quantity"
              type="number"
              inputMode="numeric"
              min={1}
              max={10000}
              step={1}
              placeholder="Nombre de bouteilles"
              {...invalid("estimated_quantity")}
            />
            {fieldError("estimated_quantity")}
          </div>
          <label className="checkbox-line full-field">
            <input
              type="checkbox"
              checked={shipping}
              onChange={(event) => setShipping(event.target.checked)}
            />
            Je souhaite me renseigner sur une expédition.
          </label>
          {shipping ? (
            <>
              <div className="form-field">
                <label htmlFor="country">
                  Pays <span>facultatif</span>
                </label>
                <input
                  id="country"
                  name="country"
                  autoComplete="country-name"
                  maxLength={80}
                  {...invalid("country")}
                />
                {fieldError("country")}
              </div>
              <div className="form-field">
                <label htmlFor="postal_code">
                  Code postal <span>facultatif</span>
                </label>
                <input
                  id="postal_code"
                  name="postal_code"
                  autoComplete="postal-code"
                  maxLength={20}
                  {...invalid("postal_code")}
                />
                {fieldError("postal_code")}
              </div>
            </>
          ) : null}
          <div className="form-field full-field">
            <label htmlFor="message">
              Votre message <span>facultatif · 3 000 caractères maximum</span>
            </label>
            <textarea
              id="message"
              name="message"
              maxLength={3000}
              rows={5}
              {...invalid("message")}
            />
            {fieldError("message")}
          </div>
          <div className="honeypot" aria-hidden="true">
            <label htmlFor="website">Laisser vide</label>
            <input id="website" name="website" tabIndex={-1} autoComplete="off" />
          </div>
        </div>
        <hr className="form-divider" />
        <label className="checkbox-line">
          <input id="is_adult" name="is_adult" type="checkbox" required {...invalid("is_adult")} />
          Je certifie avoir 18 ans ou plus. *
        </label>
        {fieldError("is_adult")}
        <p className="form-help" style={{ marginTop: 18 }}>
          Vos informations servent à répondre à votre demande. Elles sont adressées au domaine et ne
          vous inscrivent à aucune newsletter.{" "}
          <a href="/confidentialite/">En savoir plus sur vos données.</a>
        </p>
      </fieldset>
      <button className="button" type="submit" disabled={!hydrated || state === "sending"}>
        {state === "sending" ? "Transmission en cours…" : "Envoyer ma demande"}
        <span aria-hidden="true">↗</span>
      </button>
      <p className="form-help" style={{ marginTop: 14 }}>
        Cet envoi ne confirme aucun achat ni aucune réservation. Les disponibilités et modalités
        seront précisées par le domaine.
      </p>
    </form>
  );
}
