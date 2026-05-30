import type { MockExam, ScoreBand } from "@/content/curriculum-types";

/**
 * Resolve the verdict band for a mock-exam attempt.
 *
 * `scoreBands` are keyed by PERCENTAGE (0–100) — see the bands in
 * `content-packs/<pack>/modules/exams.ts` (e.g. 0–69 / 70–89 / 90–100) —
 * whereas an attempt's `score` is a raw correct-count. The raw score must be
 * converted to a percentage before the lookup. Passing the raw score directly
 * (as an earlier version did) put even a perfect score in the bottom band.
 */
export function bandForScore(
  mock: MockExam,
  score: number,
  total: number
): ScoreBand | null {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  return mock.scoreBands.find((b) => pct >= b.min && pct <= b.max) ?? null;
}
