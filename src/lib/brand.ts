/* ------------------------------------------------------------------
   Umbrella brand layer.

   The app shell is content-agnostic; the product that *delivers* the
   single ABAP course is branded here as **Clean Core Academy**. Chrome
   (Header / Footer / metadata) reads `BRAND`; pack-specific surfaces
   (course landing H1) still read the pack's own config via
   `useSiteConfig()`.
------------------------------------------------------------------ */

export const BRAND = {
  /** Course wordmark. */
  name: "Clean Core Academy",
  shortName: "Clean Core",
  /** One-line value prop shown under the wordmark. */
  tagline: "Modernize ABAP toward SAP Clean Core.",
  /** Longer description used in metadata + open graph. */
  description:
    "An ABAP developer academy for SAP Clean Core and S/4HANA readiness — Clean Core foundations, the HANA DB mindset, modern ABAP, RAP / CDS / AMDP, released APIs, performance, and ATC-driven custom-code migration. Tracks for new, intermediate, expert and admin developers, plus orientation for management, key users, and other stakeholders.",
} as const;

export type Brand = typeof BRAND;
