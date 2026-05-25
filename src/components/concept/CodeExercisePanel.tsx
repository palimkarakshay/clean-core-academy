"use client";

import { useState } from "react";
import { Play, RotateCcw, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import type { CodeExercise } from "@/content/curriculum-types";

interface AbapLintIssue {
  rule: string;
  message: string;
  line: number;
  column: number;
  severity: string;
}

type CheckState =
  | { phase: "idle" }
  | { phase: "checking" }
  | { phase: "done"; issues: AbapLintIssue[] }
  | { phase: "error"; message: string };

/**
 * In-app code exercise. The learner edits ABAP starter code (which
 * carries a planted Clean-Core violation) and submits it to
 * POST /api/lint-abap, where abaplint runs the reference ruleset and
 * returns findings. The exercise is "solved" when the linter reports
 * zero issues. Pack-agnostic: driven entirely by the CodeExercise data.
 */
export function CodeExercisePanel({ exercise }: { exercise: CodeExercise }) {
  const [code, setCode] = useState(exercise.starterCode);
  const [state, setState] = useState<CheckState>({ phase: "idle" });

  async function check() {
    setState({ phase: "checking" });
    try {
      const res = await fetch("/api/lint-abap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setState({ phase: "error", message: body.error ?? `HTTP ${res.status}` });
        return;
      }
      const body = (await res.json()) as { issues: AbapLintIssue[] };
      setState({ phase: "done", issues: body.issues });
    } catch (e) {
      setState({ phase: "error", message: String(e) });
    }
  }

  function reset() {
    setCode(exercise.starterCode);
    setState({ phase: "idle" });
  }

  const clean = state.phase === "done" && state.issues.length === 0;

  return (
    <section
      aria-label="Code exercise"
      className="mt-8 scroll-mt-24 rounded-lg border border-(--border) bg-(--panel-2) p-4"
    >
      <h2 className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
        <Play className="h-3.5 w-3.5" aria-hidden />
        Code exercise {exercise.lang ? `· ${exercise.lang}` : null}
      </h2>
      <p className="mb-2 text-sm text-(--ink)">{exercise.prompt}</p>
      {exercise.flaggedRules && exercise.flaggedRules.length > 0 ? (
        <p className="mb-3 text-xs text-(--muted)">
          The starter trips abaplint rule
          {exercise.flaggedRules.length === 1 ? " " : "s "}
          {exercise.flaggedRules.map((r, i) => (
            <span key={r}>
              {i > 0 ? ", " : ""}
              <code className="rounded bg-(--ink)/[0.08] px-1 py-0.5 font-mono">{r}</code>
            </span>
          ))}
          . Fix the code until the check is clean.
        </p>
      ) : null}

      <label htmlFor="abap-exercise" className="sr-only">
        ABAP source
      </label>
      <textarea
        id="abap-exercise"
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
          if (state.phase !== "idle") setState({ phase: "idle" });
        }}
        spellCheck={false}
        rows={Math.min(20, Math.max(8, code.split("\n").length + 1))}
        className="w-full resize-y rounded-md border border-(--border) bg-(--panel) p-3 font-mono text-xs leading-relaxed text-(--ink) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={check}
          disabled={state.phase === "checking"}
          className="inline-flex items-center gap-2 rounded-md bg-(--accent) px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-(--accent-2) disabled:opacity-60"
        >
          {state.phase === "checking" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Play className="h-4 w-4" aria-hidden />
          )}
          Check with abaplint
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-md border border-(--border) bg-(--panel) px-3 py-2 text-sm text-(--ink) transition-colors hover:border-(--accent)"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Reset
        </button>
        {exercise.hint ? (
          <details className="ml-auto text-xs text-(--muted)">
            <summary className="cursor-pointer select-none hover:text-(--ink)">Hint</summary>
            <p className="mt-1 max-w-prose">{exercise.hint}</p>
          </details>
        ) : null}
      </div>

      <div aria-live="polite" className="mt-3">
        {state.phase === "error" ? (
          <p className="rounded-md border border-(--bad) bg-(--bad)/10 p-3 text-sm text-(--bad)">
            Couldn&apos;t run the check: {state.message}
          </p>
        ) : null}

        {clean ? (
          <div className="rounded-md border-l-4 border-(--good) bg-(--good)/10 p-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-(--good)">
              <CheckCircle2 className="h-4 w-4" aria-hidden />
              Clean — abaplint reports no issues.
            </p>
            {exercise.successNote ? (
              <p className="mt-1 text-sm text-(--ink)">{exercise.successNote}</p>
            ) : null}
          </div>
        ) : null}

        {state.phase === "done" && state.issues.length > 0 ? (
          <div className="rounded-md border-l-4 border-(--bad) bg-(--bad)/8 p-3">
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-(--bad)">
              <AlertTriangle className="h-4 w-4" aria-hidden />
              {state.issues.length} issue{state.issues.length === 1 ? "" : "s"} found
            </p>
            <ul className="flex flex-col gap-1 text-sm">
              {state.issues.map((issue, i) => (
                <li key={i} className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-mono text-xs text-(--muted)">
                    {issue.line}:{issue.column}
                  </span>
                  <code className="rounded bg-(--bad)/15 px-1 py-0.5 font-mono text-xs text-(--bad)">
                    {issue.rule}
                  </code>
                  <span className="text-(--ink)">{issue.message}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
