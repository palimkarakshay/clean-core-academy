"use client";

import { useMemo } from "react";
import { useProgress } from "@/hooks/useProgress";
import { usePack } from "@/content/pack-context";
import { countsAsMastered } from "@/lib/progress";
import { Card } from "@/components/ui/card";

/**
 * Headline overall-completion bar for the progress rail. Counts lessons
 * (authored concepts) at a mastered level over the whole curriculum.
 * Renders 0% until hydrated so SSR and client agree.
 */
export function OverallProgressBar() {
  const { progress, hydrated } = useProgress();
  const pack = usePack();

  const { mastered, total, sectionsDone, sectionsTotal, pct } = useMemo(() => {
    const concepts = pack.curriculum.sections.flatMap((s) =>
      s.concepts.filter((c) => c.lesson && c.quiz)
    );
    const total = concepts.length;
    const masteredCount = concepts.filter((c) =>
      countsAsMastered(progress.concept[c.id]?.mastery ?? 0)
    ).length;
    const sectionsTotal = pack.curriculum.sections.length;
    const sectionsDone = pack.curriculum.sections.filter(
      (s) => progress.section[s.id]?.complete
    ).length;
    return {
      mastered: masteredCount,
      total,
      sectionsDone,
      sectionsTotal,
      pct: total > 0 ? Math.round((masteredCount / total) * 100) : 0,
    };
  }, [progress, pack]);

  const shownPct = hydrated ? pct : 0;

  return (
    <Card tone="accent" className="p-5">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold uppercase tracking-wide text-(--accent-2)">
          Overall progress
        </span>
        <span className="font-mono text-lg font-semibold tabular-nums text-(--ink)">
          {hydrated ? `${pct}%` : "—"}
        </span>
      </div>
      <div
        className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-(--panel-2)"
        role="progressbar"
        aria-valuenow={shownPct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Overall course progress"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-(--accent) to-(--accent-2) transition-[width] duration-500"
          style={{ width: `${shownPct}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-(--muted)">
        {hydrated
          ? `${mastered} of ${total} lessons mastered · ${sectionsDone}/${sectionsTotal} modules complete`
          : "Loading your progress…"}
      </p>
    </Card>
  );
}
