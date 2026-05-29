"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PHASE_META,
  PHASE_ORDER,
  type BlockPhase,
  type LessonBlock,
} from "@/lib/lesson-flow/blocks";

/**
 * Sticky Learn → Practice → Test → Apply rail. Shows which phase the
 * learner is in, ticks completed phases, and tracks overall reveal
 * progress through the module.
 */
export function ProgressRail({
  blocks,
  revealedCount,
  sectionComplete,
}: {
  blocks: LessonBlock[];
  revealedCount: number;
  sectionComplete: boolean;
}) {
  const present = PHASE_ORDER.filter((p) => blocks.some((b) => b.phase === p));
  const revealed = Math.min(revealedCount, blocks.length);
  const overallPct = blocks.length
    ? Math.round((revealed / blocks.length) * 100)
    : 0;

  const frontierPhase: BlockPhase | undefined =
    blocks[Math.min(revealed, blocks.length) - 1]?.phase ?? present[0];

  function phaseState(phase: BlockPhase): "done" | "current" | "upcoming" {
    const idxs = blocks
      .map((b, i) => (b.phase === phase ? i : -1))
      .filter((i) => i >= 0);
    const allRevealed = idxs.every((i) => i < revealed);
    if (phase === "test") {
      if (sectionComplete) return "done";
    } else if (allRevealed && idxs.length > 0) {
      return "done";
    }
    if (phase === frontierPhase) return "current";
    return "upcoming";
  }

  return (
    <div className="sticky top-0 z-20 -mx-4 mb-6 border-b border-(--border) bg-(--canvas)/90 px-4 py-3 backdrop-blur md:-mx-6 md:px-6">
      <ol className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
        {present.map((phase, i) => {
          const state = phaseState(phase);
          return (
            <li key={phase} className="flex items-center gap-1.5">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  state === "done" && "bg-(--good)/15 text-(--good)",
                  state === "current" && "bg-(--accent)/15 text-(--accent-2)",
                  state === "upcoming" && "text-(--muted)"
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold",
                    state === "done" && "bg-(--good) text-white",
                    state === "current" && "bg-(--accent) text-white",
                    state === "upcoming" && "border border-(--border) text-(--muted)"
                  )}
                >
                  {state === "done" ? (
                    <Check aria-hidden className="h-2.5 w-2.5" />
                  ) : (
                    i + 1
                  )}
                </span>
                {PHASE_META[phase].title}
              </span>
              {i < present.length - 1 ? (
                <span aria-hidden className="text-(--muted)">
                  →
                </span>
              ) : null}
            </li>
          );
        })}
        <li className="ml-auto pl-2 text-xs tabular-nums text-(--muted)">
          {overallPct}%
        </li>
      </ol>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={overallPct}
        aria-label="Module progress"
        className="mt-2 h-1 w-full overflow-hidden rounded-full bg-(--panel-2)"
      >
        <div
          className="h-full rounded-full bg-(--accent) transition-all"
          style={{ width: `${overallPct}%` }}
        />
      </div>
    </div>
  );
}
