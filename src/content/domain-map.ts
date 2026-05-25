import type { CCAFDomain } from "./curriculum-types";

/**
 * Concept → exam-domain mapping.
 *
 * This is a CCA-F-specific shell extension (weighted exam domains) that
 * the Clean Core Academy course does not use — the academy organises by
 * cookbook module, not by weighted exam domains. The map is intentionally
 * empty: `getConceptDomain()` returns null for every concept and the
 * (unrendered) `groupConceptsByDomain()` helper yields empty buckets.
 *
 * Kept (rather than deleted) so the shell's domain helpers + types stay
 * intact for any future exam-style pack swapped in via active-pack.
 */
export const DOMAIN_MAP: Record<string, CCAFDomain> = {};
