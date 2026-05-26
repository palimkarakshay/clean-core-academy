/* ------------------------------------------------------------------
   "What you just learnt" — the most recently completed lesson, by the
   latest quiz-attempt timestamp among concepts that count as mastered.
   Pairs with the recommendation engine ("what's next") to give a short
   continuity brief on the home page.
------------------------------------------------------------------ */

import type { Curriculum } from "@/content/curriculum-types";
import type { Progress } from "./progress-types";
import { countsAsMastered } from "./progress";

export interface RecentlyLearnt {
  sectionId: string;
  conceptId: string;
  code: string;
  title: string;
  /** Latest completed-at timestamp (ms) for the concept's quiz. */
  at: number;
}

export function recentlyLearnt(
  progress: Progress,
  curriculum: Curriculum
): RecentlyLearnt | null {
  let best: RecentlyLearnt | null = null;
  for (const section of curriculum.sections) {
    for (const c of section.concepts) {
      const cp = progress.concept[c.id];
      if (!cp || !countsAsMastered(cp.mastery)) continue;
      let last = 0;
      for (const a of cp.quizAttempts) {
        if (a.completedAt && a.completedAt > last) last = a.completedAt;
      }
      if (last > 0 && (!best || last > best.at)) {
        best = {
          sectionId: section.id,
          conceptId: c.id,
          code: c.code,
          title: c.title,
          at: last,
        };
      }
    }
  }
  return best;
}
