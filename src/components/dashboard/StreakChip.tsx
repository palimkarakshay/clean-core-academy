"use client";

import { Flame } from "lucide-react";
import type { StreakSummary } from "@/lib/streak";
import { cn } from "@/lib/utils";

/**
 * One streak pill, shared by the recommendation banner and the Progress
 * page so the "N-day study streak" message is authored in exactly one
 * place. Renders nothing when there's no streak to show (keeps callers
 * from sprinkling `streak.current > 0` checks).
 */
export function StreakChip({
  streak,
  className,
}: {
  streak: StreakSummary;
  className?: string;
}) {
  if (streak.current <= 0) return null;
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--panel) px-3 py-1.5 text-xs",
        className
      )}
      aria-label={`Study streak: ${streak.current} day${streak.current === 1 ? "" : "s"}${
        streak.studiedToday ? ", today complete" : ", study today to keep it"
      }`}
    >
      <Flame className="h-3.5 w-3.5 text-(--accent-2)" aria-hidden />
      <span className="text-(--muted)">
        <strong className="font-semibold text-(--ink)">
          {streak.current}-day
        </strong>{" "}
        study streak
        {streak.studiedToday ? (
          <span className="text-(--good)"> · today complete</span>
        ) : (
          <span> · study today to keep it</span>
        )}
      </span>
    </div>
  );
}
