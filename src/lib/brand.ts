/* ------------------------------------------------------------------
   Umbrella brand layer.

   The app shell is content-agnostic; the product that *delivers* the
   content pack is branded here as **Clean Core Academy**. Chrome
   (Header / Footer / metadata) reads `BRAND`; pack-specific surfaces
   (pack landing H1, picker card heading) still read the pack's own
   config via `useSiteConfig()`.
------------------------------------------------------------------ */

export const BRAND = {
  /** Consumer-facing wordmark. */
  name: "Clean Core Academy",
  shortName: "Clean Core",
  /** One-line value prop shown under the wordmark on the picker. */
  tagline: "Modernize ABAP toward Clean Core.",
  /** Longer description used in metadata + open graph. */
  description:
    "Interactive lessons that turn the ABAP-Utilities SAP-modernization cookbooks into hands-on modules — anti-patterns, Clean Core & ATC, BDC→API, RAP/CDS, and Fiori — each with concept notes, before/after ABAP, and spot-the-violation quizzes.",
  /** B2B variant name. Same shell, company-approved content. */
  b2bName: "Clean Core Academy for Teams",
  b2bTagline: "Clean Core Academy for teams.",
} as const;

export type Brand = typeof BRAND;
