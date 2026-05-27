"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProgress } from "@/hooks/useProgress";
import {
  displayCanonicalAnswer,
  isCorrect,
  isFillIn,
  isMCQ,
  isTrueFalse,
  scoreAttempt,
} from "@/components/quiz/question-utils";
import type { AnswerValue, QuizAttempt } from "@/lib/progress-types";
import type { KnowledgeCheckBlock } from "@/lib/lesson-flow/blocks";

const MCQ_LETTERS: Array<"A" | "B" | "C" | "D"> = ["A", "B", "C", "D"];

/**
 * Inline, immediate-feedback knowledge check for the Practice phase.
 * One question at a time: pick → Check → see why → Next. Records a
 * QuizAttempt through the existing progress mutator on finish, which
 * both nudges concept mastery and satisfies the section-test gate.
 */
export function InlineKnowledgeCheck({ block }: { block: KnowledgeCheckBlock }) {
  const { recordQuizAttempt } = useProgress();
  const [startedAt] = useState(() => Date.now());
  const [cursor, setCursor] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerValue | null>>({});
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState<QuizAttempt | null>(null);

  const questions = block.questions;
  const total = questions.length;
  const current = questions[cursor];
  const selected = answers[current?.n] ?? null;
  const isLast = cursor === total - 1;

  if (finished) {
    const pct = Math.round((finished.score / finished.total) * 100);
    const strong = pct >= 67;
    return (
      <div
        className={cn(
          "rounded-xl border p-5 shadow-sm",
          strong
            ? "border-(--good)/40 bg-(--good)/8"
            : "border-(--warn)/40 bg-(--warn)/8"
        )}
      >
        <p className="flex items-center gap-2 text-sm font-semibold text-(--ink)">
          {strong ? (
            <CheckCircle2 aria-hidden className="h-5 w-5 text-(--good)" />
          ) : (
            <HelpCircle aria-hidden className="h-5 w-5 text-(--warn)" />
          )}
          Knowledge check: {finished.score}/{finished.total} correct
        </p>
        <p className="mt-1 text-sm text-(--muted)">
          {strong
            ? "Nice — that concept is sticking. Keep going."
            : "Worth a quick re-read of the lesson above before the module check."}
        </p>
      </div>
    );
  }

  function pick(value: AnswerValue) {
    if (revealed) return;
    setAnswers((a) => ({ ...a, [current.n]: value }));
  }

  function check() {
    if (selected == null || (typeof selected === "string" && selected.trim() === "")) {
      return;
    }
    setRevealed(true);
  }

  function advance() {
    if (isLast) {
      const score = scoreAttempt(questions, answers);
      const attempt: QuizAttempt = {
        startedAt,
        completedAt: Date.now(),
        total,
        score,
        answers,
      };
      recordQuizAttempt(block.conceptId, attempt);
      setFinished(attempt);
      return;
    }
    setCursor((c) => c + 1);
    setRevealed(false);
  }

  const correct = revealed ? isCorrect(current, selected) : false;

  return (
    <div className="rounded-xl border border-(--border) bg-(--panel) p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
          Knowledge check
        </span>
        <span className="text-xs text-(--muted)">
          {cursor + 1} / {total}
        </span>
      </div>

      <h3 className="mb-3 text-base font-semibold text-(--ink)">
        {current.question}
      </h3>

      {/* Inputs by kind */}
      {isMCQ(current) ? (
        <div className="flex flex-col gap-2">
          {MCQ_LETTERS.map((L) => {
            const chosen = selected === L;
            const isAnswer = current.correct === L;
            return (
              <button
                key={L}
                type="button"
                onClick={() => pick(L)}
                disabled={revealed}
                aria-pressed={chosen}
                className={cn(
                  "flex items-start gap-3 rounded-md border p-3 text-left text-sm transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)",
                  !revealed &&
                    (chosen
                      ? "border-(--accent) bg-(--accent)/10"
                      : "border-(--border) bg-(--panel-2) hover:border-(--accent)/50"),
                  revealed &&
                    isAnswer &&
                    "border-(--good) bg-(--good)/10",
                  revealed &&
                    chosen &&
                    !isAnswer &&
                    "border-(--bad) bg-(--bad)/10",
                  revealed &&
                    !isAnswer &&
                    !chosen &&
                    "border-(--border) opacity-70"
                )}
              >
                <span className="mt-0.5 w-5 font-mono text-sm font-bold text-(--accent-2)">
                  {L}.
                </span>
                <span className="flex-1">{current.options[L]}</span>
              </button>
            );
          })}
        </div>
      ) : isTrueFalse(current) ? (
        <div className="flex gap-2">
          {[true, false].map((val) => {
            const chosen = selected === val;
            const isAnswer = current.correct === val;
            return (
              <button
                key={String(val)}
                type="button"
                onClick={() => pick(val)}
                disabled={revealed}
                aria-pressed={chosen}
                className={cn(
                  "flex-1 rounded-md border p-4 text-base font-semibold transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)",
                  !revealed &&
                    (chosen
                      ? "border-(--accent) bg-(--accent)/10 text-(--accent)"
                      : "border-(--border) bg-(--panel-2) hover:border-(--accent)/50"),
                  revealed && isAnswer && "border-(--good) bg-(--good)/10",
                  revealed &&
                    chosen &&
                    !isAnswer &&
                    "border-(--bad) bg-(--bad)/10"
                )}
              >
                {val ? "True" : "False"}
              </button>
            );
          })}
        </div>
      ) : isFillIn(current) ? (
        <input
          type="text"
          value={typeof selected === "string" ? selected : ""}
          placeholder={current.placeholder ?? "Type your answer…"}
          onChange={(e) => pick(e.target.value)}
          disabled={revealed}
          autoComplete="off"
          spellCheck={false}
          className={cn(
            "w-full rounded-md border bg-(--panel-2) p-3 text-base focus:border-(--accent) focus:outline-none",
            revealed
              ? correct
                ? "border-(--good)"
                : "border-(--bad)"
              : "border-(--border)"
          )}
        />
      ) : null}

      {/* Feedback */}
      {revealed ? (
        <div
          className={cn(
            "mt-4 rounded-md border-l-4 p-3 text-sm",
            correct
              ? "border-(--good) bg-(--good)/8"
              : "border-(--bad) bg-(--bad)/8"
          )}
        >
          <p className="flex items-center gap-2 font-semibold text-(--ink)">
            {correct ? (
              <CheckCircle2 aria-hidden className="h-4 w-4 text-(--good)" />
            ) : (
              <XCircle aria-hidden className="h-4 w-4 text-(--bad)" />
            )}
            {correct ? "Correct" : "Not quite"}
          </p>
          {!correct ? (
            <p className="mt-1 text-(--muted)">
              Answer: <span className="text-(--ink)">{displayCanonicalAnswer(current)}</span>
            </p>
          ) : null}
          {current.principle ? (
            <p className="mt-1 text-(--muted)">{current.principle}</p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-5 flex justify-end border-t border-dashed border-(--border) pt-4">
        {!revealed ? (
          <Button variant="default" size="sm" onClick={check} disabled={selected == null}>
            Check answer
          </Button>
        ) : (
          <Button variant="default" size="sm" onClick={advance}>
            {isLast ? "Finish check" : "Next question →"}
          </Button>
        )}
      </div>
    </div>
  );
}
