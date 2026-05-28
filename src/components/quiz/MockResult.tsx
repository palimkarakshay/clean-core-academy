"use client";

import type { MockExam } from "@/content/curriculum-types";
import type { QuizAttempt } from "@/lib/progress-types";
import { QuizResult } from "./QuizResult";
import { useCopy, usePackId } from "@/content/pack-hooks";
import { bandForScore } from "./mock-band";

/**
 * The headline verdict band for a mock attempt (score → verdict + message).
 * Rendered both on the dedicated result route and, via QuizRunner's
 * `resultHeader`, immediately on submit. Returns null when the pack defines
 * no band for the score.
 */
export function MockVerdictBanner({
  mock,
  attempt,
}: {
  mock: MockExam;
  attempt: QuizAttempt;
}) {
  const band = bandForScore(mock, attempt.score, attempt.total);
  if (!band) return null;
  return (
    <section
      aria-label="Verdict"
      className="mb-5 rounded-lg border border-(--accent)/40 bg-(--accent)/5 p-4"
    >
      <h2 className="text-base font-semibold text-(--accent-2)">
        {band.verdict}
      </h2>
      <p className="mt-1 text-sm text-(--ink)">{band.message}</p>
    </section>
  );
}

export function MockResult({
  mock,
  attempt,
}: {
  mock: MockExam;
  attempt: QuizAttempt;
}) {
  const packId = usePackId();
  const copy = useCopy();
  return (
    <div>
      <MockVerdictBanner mock={mock} attempt={attempt} />
      <QuizResult
        title={mock.title}
        questions={mock.questions}
        attempt={attempt}
        passPct={mock.passPct}
        exitHref={`/${packId}`}
        exitLabel="Back to dashboard"
        nextHref={`/${packId}/mock`}
        nextLabel={`Browse ${copy.mockExamsHeading.toLowerCase()}`}
      />
    </div>
  );
}
