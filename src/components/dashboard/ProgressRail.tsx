"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { usePack } from "@/content/pack-context";
import { useCopy, usePackId } from "@/content/pack-hooks";
import { recommendForPack } from "@/lib/recommendation";
import { OverallProgressBar } from "./OverallProgressBar";
import { StatsPanel } from "./StatsPanel";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * The persistent right-side rail on the Start page: an overall
 * completion bar, a one-click "continue/review" CTA driven by the
 * recommendation engine, and the detailed stats panel.
 */
export function ProgressRail() {
  const { progress, hydrated } = useProgress();
  const pack = usePack();
  const packId = usePackId();
  const copy = useCopy();

  const reco = useMemo(
    () => recommendForPack(progress, pack, copy, packId),
    [progress, pack, copy, packId]
  );

  return (
    <div className="flex flex-col gap-4">
      <OverallProgressBar />
      {hydrated && reco.kind !== "done" ? (
        <Link
          href={reco.href}
          className={cn(
            buttonVariants({ variant: "default", size: "default" }),
            "w-full no-underline"
          )}
        >
          {reco.kind === "drill" ? "Review your weak spot" : "Continue learning"}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      ) : null}
      <StatsPanel />
    </div>
  );
}
