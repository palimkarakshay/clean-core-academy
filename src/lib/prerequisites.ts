/* ------------------------------------------------------------------
   Role-aware pre-flight resolver.

   The pack supplies a base `prerequisites` block plus optional
   per-role overrides (`byRole`). When the learner has picked a track
   on the course home, this merges the matching override over the base
   so the "Before you begin" card speaks to that role. The track store
   (src/lib/track-filter.ts) is the single source of the selected role;
   "all" (or an unknown track) yields the base block unchanged.
------------------------------------------------------------------ */

import type { Audience } from "@/content/curriculum-types";
import type { PackPrerequisites } from "@/content/pack-types";
import type { Track } from "@/lib/track-filter";

export interface ResolvedPrerequisites {
  heading: string;
  intro: string;
  requirements: PackPrerequisites["requirements"];
  assumptions?: PackPrerequisites["assumptions"];
  externalLinks?: PackPrerequisites["externalLinks"];
  notForYouIf?: string[];
  /** The role this resolved view targets, or null for the base view. */
  role: Audience | null;
  /** Display label for the active role (e.g. "New developers"), if any. */
  roleLabel?: string;
}

/**
 * Merge the role override (if any) over the base prerequisites. Fields
 * the role omits inherit from the base; fields it supplies replace the
 * base wholesale (a role's requirement list is its own, not appended).
 */
export function resolvePrerequisites(
  base: PackPrerequisites,
  track: Track
): ResolvedPrerequisites {
  const role: Audience | null = track === "all" ? null : track;
  const override = role ? base.byRole?.[role] : undefined;

  return {
    heading: base.heading,
    intro: override?.intro ?? base.intro,
    requirements: override?.requirements ?? base.requirements,
    assumptions: override?.assumptions ?? base.assumptions,
    externalLinks: base.externalLinks,
    notForYouIf: override?.notForYouIf ?? base.notForYouIf,
    role,
    roleLabel: override?.roleLabel,
  };
}
