/* ------------------------------------------------------------------
   Umbrella brand layer.

   The app shell is content-agnostic; the company that *delivers* the
   ABAP course is **Lumivara Forge**, and the product line is **Clean
   Core**. Chrome (Header / Footer / metadata) reads `BRAND`; pack-
   specific surfaces (course landing H1) still read the pack's own config
   via `useSiteConfig()`.
------------------------------------------------------------------ */

export const BRAND = {
  /** Company wordmark shown in the chrome. */
  name: "Lumivara Forge",
  shortName: "Lumivara Forge",
  /** Product line delivered under the brand (shown as a chip by the wordmark). */
  product: "Clean Core",
  /** One-line value prop shown under the wordmark. */
  tagline: "Clean Core engineering for SAP.",
  /** Longer description used in metadata + open graph. */
  description:
    "Lumivara Forge — Clean Core engineering for SAP. An ABAP developer academy for SAP Clean Core and S/4HANA readiness: Clean Core foundations, the HANA database mindset, modern ABAP, RAP / CDS / AMDP, released APIs, performance, ATC-driven custom-code migration, and delivery management. Tracks for new, intermediate, expert and admin developers, plus orientation for management, key users, and other stakeholders.",
} as const;

export type Brand = typeof BRAND;
