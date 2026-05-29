"use client";

import { useProgress } from "@/hooks/useProgress";
import { InlineQuiz } from "./InlineQuiz";
import type { KnowledgeCheckBlock } from "@/lib/lesson-flow/blocks";

/**
 * Practice-phase knowledge check for one concept. Records the attempt
 * via recordQuizAttempt, which nudges concept mastery and satisfies the
 * section-test gate.
 */
export function InlineKnowledgeCheck({ block }: { block: KnowledgeCheckBlock }) {
  const { recordQuizAttempt } = useProgress();
  return (
    <InlineQuiz
      title="Knowledge check"
      mode="check"
      questions={block.questions}
      onComplete={(attempt) => recordQuizAttempt(block.conceptId, attempt)}
    />
  );
}
