"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, PartyPopper } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { usePack } from "@/content/pack-context";
import { useCopy, usePackId } from "@/content/pack-hooks";
import { recommendForPack } from "@/lib/recommendation";
import { computeStreak } from "@/lib/streak";
import { StreakChip } from "./StreakChip";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Resume affordance for the Progress page: the study-streak chip plus a
 * single "continue where you left off" button driven by the same
 * recommendation engine the home banner uses. Renders nothing until
 * hydrated (the recommendation depends on localStorage progress).
 */
export function ContinuePanel() {
  const { progress, hydrated } = useProgress();
  const pack = usePack();
  const packId = usePackId();
  const copy = useCopy();
  const reco = useMemo(
    () => recommendForPack(progress, pack, copy, packId),
    [progress, pack, copy, packId]
  );
  const streak = useMemo(() => computeStreak(progress), [progress]);

  if (!hydrated) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-(--border) bg-(--panel-2) p-4">
      <StreakChip streak={streak} />
      {reco.kind === "done" ? (
        <span className="inline-flex items-center gap-2 text-sm font-medium text-(--good)">
          <PartyPopper className="h-4 w-4" aria-hidden />
          Course complete — every module mastered.
        </span>
      ) : (
        <Link
          href={reco.href}
          className={cn(buttonVariants({ variant: "default" }), "ml-auto no-underline")}
        >
          {reco.kind === "drill" ? "Review your weak spot" : "Continue learning"}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}
