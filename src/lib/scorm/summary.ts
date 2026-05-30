/* ------------------------------------------------------------------
   Map the app's progress model onto the SCORM data model.

   Pure + framework-free so it can be unit-tested and called from the
   client bridge. "Score" is the percentage of modules whose test is
   passed; the course counts as passed once enough modules clear the
   bar. Reuses isSectionPassed so the SCORM number matches what the app
   shows everywhere else.
------------------------------------------------------------------ */

import type { Progress } from "@/lib/progress-types";
import { isSectionPassed } from "@/lib/progress";

export type ScormStatus = "passed" | "completed" | "incomplete";

export interface ScormSummary {
  /** 0–100, percentage of modules passed. */
  scoreRaw: number;
  status: ScormStatus;
  passedSections: number;
  totalSections: number;
}

export interface ScormSummaryOptions {
  /** Fraction of modules that must be passed to mark the course passed. */
  passThreshold?: number;
}

const DEFAULT_PASS_THRESHOLD = 0.8;

export function computeScormSummary(
  progress: Progress,
  sectionIds: string[],
  opts: ScormSummaryOptions = {}
): ScormSummary {
  const total = sectionIds.length;
  const passed = sectionIds.filter((id) => isSectionPassed(progress, id)).length;
  const scoreRaw = total > 0 ? Math.round((passed / total) * 100) : 0;
  const threshold = opts.passThreshold ?? DEFAULT_PASS_THRESHOLD;

  let status: ScormStatus;
  if (total > 0 && passed === total) {
    status = "completed";
  } else if (total > 0 && passed / total >= threshold) {
    status = "passed";
  } else {
    status = "incomplete";
  }

  return { scoreRaw, status, passedSections: passed, totalSections: total };
}
