"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { recommendForPack } from "@/lib/recommendation";
import { computeStreak } from "@/lib/streak";
import { useCopy, usePackId } from "@/content/pack-hooks";
import { usePack } from "@/content/pack-context";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/primitives/Skeleton";
import { StreakChip } from "./StreakChip";
import { cn } from "@/lib/utils";

export function RecommendationBanner() {
  const { progress, hydrated } = useProgress();
  const pack = usePack();
  const packId = usePackId();
  const copy = useCopy();
  const reco = useMemo(
    () => recommendForPack(progress, pack, copy, packId),
    [progress, pack, copy, packId]
  );
  const streak = useMemo(() => computeStreak(progress), [progress]);

  const KIND_LABEL: Record<string, string> = {
    drill: copy.recoDrillLabel,
    "section-test": copy.recoSectionTestLabel,
    lesson: copy.recoLessonLabel,
    quiz: copy.recoQuizLabel,
    done: copy.recoDoneLabel,
  };
  const KIND_TITLE: Record<string, string> = {
    drill: copy.recoDrillTitle,
    "section-test": copy.recoSectionTestTitle,
    lesson: copy.recoLessonTitle,
    quiz: copy.recoQuizTitle,
    done: copy.recoDoneTitle,
  };

  if (!hydrated) {
    return (
      <Card
        tone="accent"
        className="bg-(--panel-2) p-6 md:p-8"
        role="status"
        aria-busy="true"
        aria-label="Loading recommendation"
      >
        <Skeleton className="h-3 w-32" />
        <Skeleton className="mt-3 h-7 w-3/4" />
        <Skeleton className="mt-2 h-4 w-2/3" />
        <Skeleton className="mt-5 h-12 w-32" />
      </Card>
    );
  }

  return (
    <Card tone="accent" className="bg-(--panel-2) p-6 md:p-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-(--accent-2)">
            Recommended next · {KIND_LABEL[reco.kind] ?? "Next"}
          </p>
          <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl md:text-3xl font-semibold text-(--ink)">
            {KIND_TITLE[reco.kind] ?? "Next step"}
          </h2>
          <p className="mt-2 max-w-prose text-sm md:text-base text-(--muted)">
            {reco.why}
          </p>
        </div>
        {reco.kind !== "done" ? (
          <Link
            href={reco.href}
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "no-underline w-full md:w-auto"
            )}
          >
            Continue
            <ArrowRight className="h-5 w-5" aria-hidden />
          </Link>
        ) : null}
      </div>

      <StreakChip streak={streak} className="mt-5" />
    </Card>
  );
}
