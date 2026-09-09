import { z } from "zod";

// Shared validation contains no server configuration or secret.
const singleLine = (maximum: number) =>
  z
    .string()
    .trim()
    .max(maximum, `Maximum ${maximum} caractères.`)
    .refine(
      (value) => !/[\p{Cc}\p{Cf}]/u.test(value),
      "Veuillez saisir une seule ligne sans caractère de contrôle.",
    );

export const demandeSourcePaths = [
  "/",
  "/demande/",
  "/professionnels/",
  "/vins/",
  "/vins/cuvee-2024/",
  "/vins/cuvee-2023/",
  "/domaine/",
  "/terrasses-pierre-seche/",
] as const;

export const demandeSchema = z
  .object({
    name: singleLine(120).refine(
      (value) => value.length >= 2,
      "Indiquez votre nom (au moins 2 caractères).",
    ),
    email: singleLine(254)
      .pipe(z.string().email("Indiquez une adresse e-mail valide."))
      .transform((value) => value.toLowerCase()),
    profile: z.enum(["particulier", "professionnel"], {
      message: "Sélectionnez votre profil.",
    }),
    purpose: z.enum(["bouteilles", "conseil", "professionnel", "autre"], {
      message: "Sélectionnez l’objet de votre demande.",
    }),
    company: singleLine(160).optional(),
    phone: singleLine(40).optional(),
    cuvee: z.enum(["2024", "2023", "a_conseiller"]).optional(),
    estimated_quantity: z
      .number()
      .int("La quantité doit être un nombre entier.")
      .min(1, "Indiquez au moins une bouteille.")
      .max(10000, "La quantité ne peut pas dépasser 10 000 bouteilles.")
      .optional(),
    country: singleLine(80).optional(),
    postal_code: singleLine(20).optional(),
    message: z
      .string()
      .trim()
      .max(3000, "Maximum 3 000 caractères.")
      .refine(
        (value) => !/[\p{Cc}\p{Cf}]/u.test(value.replace(/[\r\n\t]/g, "")),
        "Le message contient un caractère de contrôle non autorisé.",
      )
      .optional(),
    is_adult: z.literal(true, {
      errorMap: () => ({ message: "Confirmez que vous êtes majeur(e)." }),
    }),
    idempotency_key: z.string().uuid("Identifiant de demande invalide."),
    source_path: z.enum(demandeSourcePaths).optional(),
    // Only approved campaign identifiers, never arbitrary URLs or tracking IDs.
    campaign: z
      .object({
        utm_source: z.enum(["google", "bing", "instagram", "facebook", "newsletter"]).optional(),
        utm_medium: z.enum(["organic", "social", "email", "referral"]).optional(),
        utm_campaign: z.enum(["domaine", "cuvee-2024", "cuvee-2023", "professionnels"]).optional(),
      })
      .strict()
      .optional(),
    // Honeypot: hidden from people and assistive technology in the form.
    website: z.string().max(200).optional(),
  })
  .strict();

export type DemandeInput = z.input<typeof demandeSchema>;
export type DemandeData = z.output<typeof demandeSchema>;

export const demandeAcceptedMessage =
  "Votre demande a bien été transmise. Le domaine vous répondra pour préciser les disponibilités et les modalités. Aucun achat n’est confirmé à ce stade.";
