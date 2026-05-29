"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  displayCanonicalAnswer,
  isCorrect,
  isFillIn,
  isMCQ,
  isTrueFalse,
  scoreAttempt,
} from "@/components/quiz/question-utils";
import type { AnswerValue, QuizAttempt } from "@/lib/progress-types";
import type { Question } from "@/content/curriculum-types";

const MCQ_LETTERS: Array<"A" | "B" | "C" | "D"> = ["A", "B", "C", "D"];

export interface InlineQuizProps {
  title: string;
  questions: Question[];
  /** "check" = low-stakes practice; "test" = pass/fail module check. */
  mode: "check" | "test";
  /** Pass threshold (0–1), used in "test" mode for the verdict. */
  passPct?: number;
  /** Receives the finished attempt to persist via the progress store. */
  onComplete: (attempt: QuizAttempt) => void;
}

/**
 * Self-contained, immediate-feedback quiz used inline in the linear
 * flow — one question at a time (pick → Check → see why → Next), then a
 * verdict. Used for both Practice knowledge checks and the in-page
 * module Test, so neither needs a separate route. Records the attempt
 * through the supplied callback; supports retaking.
 */
export function InlineQuiz({
  title,
  questions,
  mode,
  passPct = 0.7,
  onComplete,
}: InlineQuizProps) {
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [cursor, setCursor] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerValue | null>>({});
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState<QuizAttempt | null>(null);

  const total = questions.length;
  const current = questions[cursor];
  const selected = answers[current?.n] ?? null;
  const isLast = cursor === total - 1;

  function reset() {
    setStartedAt(Date.now());
    setCursor(0);
    setAnswers({});
    setRevealed(false);
    setFinished(null);
  }

  if (finished) {
    const pct = Math.round((finished.score / finished.total) * 100);
    const passed =
      mode === "test" ? pct >= Math.round(passPct * 100) : pct >= 67;
    const tone = passed ? "good" : mode === "test" ? "bad" : "warn";
    return (
      <div
        className={cn(
          "rounded-xl border p-5 shadow-sm",
          tone === "good" && "border-(--good)/40 bg-(--good)/8",
          tone === "warn" && "border-(--warn)/40 bg-(--warn)/8",
          tone === "bad" && "border-(--bad)/40 bg-(--bad)/8"
        )}
      >
        <p className="flex items-center gap-2 text-sm font-semibold text-(--ink)">
          {passed ? (
            <CheckCircle2 aria-hidden className="h-5 w-5 text-(--good)" />
          ) : mode === "test" ? (
            <XCircle aria-hidden className="h-5 w-5 text-(--bad)" />
          ) : (
            <HelpCircle aria-hidden className="h-5 w-5 text-(--warn)" />
          )}
          {title}: {finished.score}/{finished.total} ({pct}%)
        </p>
        <p className="mt-1 text-sm text-(--muted)">
          {mode === "test"
            ? passed
              ? "Passed — this module is complete. Nice work."
              : `You need ${Math.round(passPct * 100)}% to pass. Review the lessons and try again.`
            : passed
              ? "Nice — that concept is sticking. Keep going."
              : "Worth a quick re-read of the lesson above before the module check."}
        </p>
        <Button variant="ghost" size="sm" onClick={reset} className="mt-3">
          <RotateCcw aria-hidden className="mr-1.5 h-3.5 w-3.5" />
          Retake
        </Button>
      </div>
    );
  }

  function pick(value: AnswerValue) {
    if (revealed) return;
    setAnswers((a) => ({ ...a, [current.n]: value }));
  }

  function check() {
    if (
      selected == null ||
      (typeof selected === "string" && selected.trim() === "")
    ) {
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
      onComplete(attempt);
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
          {title}
        </span>
        <span className="text-xs text-(--muted)">
          {cursor + 1} / {total}
        </span>
      </div>

      <h3 className="mb-3 text-base font-semibold text-(--ink)">
        {current.question}
      </h3>

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
                  revealed && isAnswer && "border-(--good) bg-(--good)/10",
                  revealed && chosen && !isAnswer && "border-(--bad) bg-(--bad)/10",
                  revealed && !isAnswer && !chosen && "border-(--border) opacity-70"
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
                  revealed && chosen && !isAnswer && "border-(--bad) bg-(--bad)/10"
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

      {revealed ? (
        <div
          className={cn(
            "mt-4 rounded-md border-l-4 p-3 text-sm",
            correct ? "border-(--good) bg-(--good)/8" : "border-(--bad) bg-(--bad)/8"
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
              Answer:{" "}
              <span className="text-(--ink)">{displayCanonicalAnswer(current)}</span>
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
            {isLast ? "Finish" : "Next question →"}
          </Button>
        )}
      </div>
    </div>
  );
}
