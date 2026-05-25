/* ------------------------------------------------------------------
   Learner-track registry.

   The course is one body of content tagged for several audiences (see
   `Section.audiences`). This shell-level table carries the *display*
   metadata for each track — label, ordering, family grouping, icon —
   so the track filter on the course home renders without the
   curriculum needing to know about the UI.

   Two families:
     - developer : new → intermediate → expert → admin (a skill ladder)
     - business  : management / key & end users / stakeholders
                   (independent orientation lenses, not a ladder)
------------------------------------------------------------------ */

import type { Audience } from "./curriculum-types";

export type AudienceFamily = "developer" | "business";

export interface AudienceInfo {
  id: Audience;
  /** Full label for headings. */
  label: string;
  /** Compact label for chips / tabs. */
  shortLabel: string;
  /** One-line "who this track is for". */
  description: string;
  family: AudienceFamily;
  /** Lucide icon name, resolved by the renderer. */
  icon: string;
}

/** Ordered — developer ladder first, then the business lenses. */
export const AUDIENCES: AudienceInfo[] = [
  {
    id: "new",
    label: "New developers",
    shortLabel: "New",
    description:
      "New to ABAP or to SAP — the vocabulary, the mindset shift, and the habits that keep code upgrade-safe from day one.",
    family: "developer",
    icon: "sprout",
  },
  {
    id: "intermediate",
    label: "Intermediate developers",
    shortLabel: "Intermediate",
    description:
      "Writing extensions day-to-day — modern ABAP, RAP, CDS, released APIs, and the performance patterns that win on HANA.",
    family: "developer",
    icon: "code",
  },
  {
    id: "expert",
    label: "Expert developers & architects",
    shortLabel: "Expert",
    description:
      "Owning the strategy — release contracts, decoupling, ATC governance, and end-to-end migration design.",
    family: "developer",
    icon: "compass",
  },
  {
    id: "admin",
    label: "Admin & Basis developers",
    shortLabel: "Admin",
    description:
      "Landscape-facing work — ATC topology, custom-code analysis, transports, decommissioning, and the operational tooling.",
    family: "developer",
    icon: "server",
  },
  {
    id: "management",
    label: "Management & leads",
    shortLabel: "Management",
    description:
      "The business case, governance, and roadmap — what Clean Core buys you and how to steer the migration.",
    family: "business",
    icon: "briefcase",
  },
  {
    id: "end-user",
    label: "Key & end users",
    shortLabel: "Key users",
    description:
      "Extending SAP from the app itself — custom fields and logic without touching the core, and when to call a developer.",
    family: "business",
    icon: "users",
  },
  {
    id: "stakeholder",
    label: "Other stakeholders",
    shortLabel: "Stakeholders",
    description:
      "A plain-language orientation — what Clean Core is, why upgrades get easier, and the words everyone keeps using.",
    family: "business",
    icon: "eye",
  },
];

export const AUDIENCE_IDS: Audience[] = AUDIENCES.map((a) => a.id);

export const DEVELOPER_AUDIENCES: AudienceInfo[] = AUDIENCES.filter(
  (a) => a.family === "developer"
);

export const BUSINESS_AUDIENCES: AudienceInfo[] = AUDIENCES.filter(
  (a) => a.family === "business"
);

export function getAudienceInfo(id: Audience): AudienceInfo | null {
  return AUDIENCES.find((a) => a.id === id) ?? null;
}

/**
 * Does a module (by its `audiences` tag list) belong to the given
 * track? Untagged modules (undefined / empty) belong to every track,
 * so nothing is ever hidden by accident.
 */
export function audienceMatches(
  audiences: Audience[] | undefined,
  track: Audience
): boolean {
  if (!audiences || audiences.length === 0) return true;
  return audiences.includes(track);
}
