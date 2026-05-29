"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { usePack } from "@/content/pack-context";
import { useCopy, usePackId } from "@/content/pack-hooks";
import { recommendForPack } from "@/lib/recommendation";
import { authoredConcepts, masteredConceptCount } from "@/lib/progress";
import { cn } from "@/lib/utils";

/**
 * The always-visible progress strip. Mounted at the top of every
 * /[packId] page (inside PackProvider), it pins to the top on scroll so
 * the learner can always see how far they are and jump back into the
 * course — the "I always know where I am" guarantee. Links the % to the
 * full Progress page and the Resume chip to the recommended next step.
 *
 * Hydration-safe: server + first client render show a neutral 0%/"—"
 * shell with no Resume link (it depends on localStorage); the real
 * values fill in on the first post-hydration commit, matching the
 * useProgress() hydrated gate used across the app.
 */
export function PackProgressBar() {
  const { progress, hydrated } = useProgress();
  const pack = usePack();
  const packId = usePackId();
  const copy = useCopy();

  const pct = useMemo(() => {
    const total = authoredConcepts(pack.curriculum).length;
    const mastered = masteredConceptCount(progress, pack.curriculum);
    return total > 0 ? Math.round((mastered / total) * 100) : 0;
  }, [progress, pack]);

  const reco = useMemo(
    () => recommendForPack(progress, pack, copy, packId),
    [progress, pack, copy, packId]
  );

  const shownPct = hydrated ? pct : 0;

  return (
    <div className="sticky top-0 z-30 border-b border-(--border) bg-(--panel)/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-1.5 sm:px-6 lg:px-8">
        <Link
          href={`/${packId}/progress`}
          aria-label="Your progress"
          className="inline-flex items-baseline gap-1.5 text-xs no-underline"
        >
          <span className="font-mono font-semibold tabular-nums text-(--ink)">
            {hydrated ? `${pct}%` : "—"}
          </span>
          <span className="hidden text-(--muted) sm:inline">complete</span>
        </Link>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={shownPct}
          aria-label="Overall course progress"
          className="h-1.5 flex-1 overflow-hidden rounded-full bg-(--panel-2)"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-(--accent) to-(--accent-2) transition-[width] duration-500"
            style={{ width: `${shownPct}%` }}
          />
        </div>
        {hydrated && reco.kind !== "done" ? (
          <Link
            href={reco.href}
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-(--accent-2) no-underline",
              "hover:bg-(--panel-2) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
            )}
          >
            Resume
            <ArrowRight aria-hidden className="h-3.5 w-3.5" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
