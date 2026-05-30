"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ClipboardCheck, RotateCcw, ArrowRight, AlertTriangle } from "lucide-react";
import type { ReadinessAudit, ReadinessAuditQuestion } from "@/content/curriculum-types";

type Answer = "yes" | "partial" | "no";

/** Risk contribution of one answer (0 = no risk, weight = full risk). */
function contribution(q: ReadinessAuditQuestion, a: Answer | undefined): number {
  if (a === undefined) return 0;
  if (a === "partial") return q.weight / 2;
  return a === q.riskAnswer ? q.weight : 0;
}

const ANSWER_LABEL: Record<Answer, string> = {
  yes: "Yes",
  partial: "Partly",
  no: "No",
};

export function ReadinessAuditView({
  audit,
  packId,
}: {
  audit: ReadinessAudit;
  packId: string;
}) {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [submitted, setSubmitted] = useState(false);

  const answeredCount = Object.keys(answers).length;

  const result = useMemo(() => {
    const answered = audit.questions.filter((q) => answers[q.id] !== undefined);
    if (answered.length === 0) return null;
    const maxRisk = answered.reduce((s, q) => s + q.weight, 0);
    const risk = answered.reduce((s, q) => s + contribution(q, answers[q.id]), 0);
    const readiness = maxRisk === 0 ? 100 : Math.round(100 * (1 - risk / maxRisk));
    const band =
      audit.bands.find((b) => readiness >= b.min && readiness <= b.max) ??
      audit.bands[audit.bands.length - 1];
    const findings = answered
      .map((q) => ({ q, score: contribution(q, answers[q.id]) }))
      .filter((f) => f.score > 0)
      .sort((a, b) => b.score - a.score || b.q.weight - a.q.weight);
    return { readiness, band, findings, answeredOf: answered.length };
  }, [answers, audit]);

  function setAnswer(id: string, a: Answer) {
    setAnswers((prev) => ({ ...prev, [id]: a }));
  }
  function reset() {
    setAnswers({});
    setSubmitted(false);
  }

  const toneForReadiness = (r: number) =>
    r >= 90 ? "good" : r >= 70 ? "accent-2" : r >= 40 ? "warn" : "bad";

  return (
    <div className="flex flex-col gap-6">
      <ol className="flex flex-col gap-4">
        {audit.questions.map((q, i) => (
          <li
            key={q.id}
            className="rounded-lg border border-(--border) bg-(--panel) p-4 shadow-sm"
          >
            <div className="mb-2 flex items-baseline gap-2">
              <span className="font-mono text-xs text-(--muted)">{i + 1}</span>
              <span className="rounded-full border border-(--border) px-2 py-0.5 text-[10px] uppercase tracking-wide text-(--muted)">
                {q.dimension}
              </span>
            </div>
            <p className="text-sm font-medium text-(--ink)">{q.question}</p>
            {q.detail ? (
              <p className="mt-1 text-xs text-(--muted)">{q.detail}</p>
            ) : null}
            <div role="radiogroup" aria-label={q.question} className="mt-3 flex gap-2">
              {(["yes", "partial", "no"] as Answer[]).map((a) => {
                const active = answers[q.id] === a;
                return (
                  <button
                    key={a}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setAnswer(q.id, a)}
                    className={
                      "min-w-16 rounded-md border px-3 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) " +
                      (active
                        ? "border-(--accent) bg-(--accent) font-semibold text-white"
                        : "border-(--border) bg-(--panel-2) text-(--ink) hover:border-(--accent)")
                    }
                  >
                    {ANSWER_LABEL[a]}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setSubmitted(true)}
          disabled={answeredCount === 0}
          className="inline-flex items-center gap-2 rounded-md bg-(--accent) px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-(--accent-2) disabled:opacity-60"
        >
          <ClipboardCheck className="h-4 w-4" aria-hidden />
          See my readiness
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-md border border-(--border) bg-(--panel) px-3 py-2 text-sm text-(--ink) transition-colors hover:border-(--accent)"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Start over
        </button>
        <span className="text-xs text-(--muted)">
          {answeredCount} of {audit.questions.length} answered
        </span>
      </div>

      {submitted && result ? (
        <section
          aria-label="Readiness result"
          className="flex flex-col gap-4 rounded-lg border border-(--border) bg-(--panel-2) p-5 scroll-mt-24"
        >
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <div className="text-xs uppercase tracking-wide text-(--muted)">
                Readiness
              </div>
              <div className={`text-4xl font-bold text-(--${toneForReadiness(result.readiness)})`}>
                {result.readiness}%
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className={`text-lg font-semibold text-(--${toneForReadiness(result.readiness)})`}>
                {result.band.verdict}
              </div>
              <p className="text-sm text-(--muted)">{result.band.message}</p>
            </div>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-(--border)">
            <div
              className={`h-full bg-(--${toneForReadiness(result.readiness)}) transition-[width]`}
              style={{ width: `${result.readiness}%` }}
            />
          </div>

          {result.findings.length > 0 ? (
            <div>
              <h2 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
                Prioritized remediation ({result.findings.length})
              </h2>
              <ol className="flex flex-col gap-3">
                {result.findings.map(({ q }) => (
                  <li
                    key={q.id}
                    className="rounded-md border-l-4 border-(--bad) bg-(--bad)/8 p-3"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-(--bad)">
                        {q.dimension}
                      </span>
                      <span className="font-mono text-[10px] text-(--muted)">
                        severity {q.weight}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-(--ink)">{q.remediation}</p>
                    {q.moduleId ? (
                      <Link
                        href={`/${packId}/section/${q.moduleId}`}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-(--accent-2) hover:underline"
                      >
                        Open the module that fixes this
                        <ArrowRight className="h-3 w-3" aria-hidden />
                      </Link>
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <p className="rounded-md border-l-4 border-(--good) bg-(--good)/10 p-3 text-sm text-(--good)">
              No risky practices flagged in what you answered. Confirm with ATC
              ABAP_CLOUD_DEVELOPMENT_DEFAULT on your target system.
            </p>
          )}
          <p className="text-xs text-(--muted)">
            Based on {result.answeredOf} answered question
            {result.answeredOf === 1 ? "" : "s"}. This is a triage signal, not an
            ATC result.
          </p>
        </section>
      ) : null}
    </div>
  );
}
