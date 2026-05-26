/* ------------------------------------------------------------------
   Daily insight — one rotating nugget so a returning learner always
   gets value, even when they are between modules or have finished the
   course. We reuse the flashcard derivation (keyPoints + one-liners
   already encode the material) and pick deterministically by calendar
   day, so the insight is stable within a day and rotates across days.
------------------------------------------------------------------ */

import type { Curriculum, Flashcard } from "@/content/curriculum-types";
import { deriveFlashcards } from "@/lib/flashcard-derive";

export interface DailyInsight {
  flashcard: Flashcard;
  sectionId: string;
  sectionTitle: string;
  conceptId: string;
  conceptTitle: string;
  conceptCode: string;
}

/** Deterministic index into a pool of `total` items for a given date.
 *  Rotates once per calendar day (UTC) and wraps safely. Returns -1 for
 *  an empty pool. */
export function dailyInsightIndex(date: Date, total: number): number {
  if (total <= 0) return -1;
  const epochDay = Math.floor(date.getTime() / 86_400_000);
  return ((epochDay % total) + total) % total;
}

/** Flatten every concept's derived flashcards into a stable, ordered
 *  pool the daily pick can index into. */
function insightPool(curriculum: Curriculum): DailyInsight[] {
  const pool: DailyInsight[] = [];
  for (const section of curriculum.sections) {
    for (const concept of section.concepts) {
      if (!concept.lesson) continue;
      for (const flashcard of deriveFlashcards(concept)) {
        pool.push({
          flashcard,
          sectionId: section.id,
          sectionTitle: section.title,
          conceptId: concept.id,
          conceptTitle: concept.title,
          conceptCode: concept.code,
        });
      }
    }
  }
  return pool;
}

/** The insight for `date` (defaults to now). `null` only if the
 *  curriculum has no authored lessons at all. */
export function getDailyInsight(
  curriculum: Curriculum,
  date: Date = new Date()
): DailyInsight | null {
  const pool = insightPool(curriculum);
  const idx = dailyInsightIndex(date, pool.length);
  return idx >= 0 ? pool[idx] : null;
}
