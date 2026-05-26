"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Lightbulb } from "lucide-react";
import { usePack } from "@/content/pack-context";
import { usePackId } from "@/content/pack-hooks";
import { useHydrated } from "@/hooks/useHydrated";
import { getDailyInsight } from "@/lib/daily-insight";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/primitives/Skeleton";

/**
 * A single rotating insight so a returning learner always gets value —
 * between modules, or after finishing. We compute the date-seeded pick
 * only after mount so server and client never disagree on "today".
 */
export function DailyInsightCard() {
  const pack = usePack();
  const packId = usePackId();
  const hydrated = useHydrated();
  const [revealed, setRevealed] = useState(false);

  const insight = useMemo(
    () => (hydrated ? getDailyInsight(pack.curriculum) : null),
    [hydrated, pack]
  );

  if (!hydrated) {
    return (
      <Card tone="accent" className="p-5" aria-busy="true" aria-label="Loading today's insight">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="mt-3 h-5 w-3/4" />
        <Skeleton className="mt-2 h-4 w-1/2" />
      </Card>
    );
  }

  if (!insight) return null;

  const href = `/${packId}/concept/${insight.sectionId}/${insight.conceptId}`;

  return (
    <Card tone="accent" className="p-5">
      <div className="flex items-start gap-3">
        <Lightbulb aria-hidden className="mt-0.5 h-5 w-5 flex-none text-(--accent)" />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-(--accent-2)">
            Today&apos;s insight · {insight.sectionTitle}
          </p>
          <p className="mt-1 text-base font-medium text-(--ink)">
            {insight.flashcard.front}
          </p>
          {revealed ? (
            <p className="mt-2 max-w-prose text-sm text-(--muted)">
              {insight.flashcard.back}
            </p>
          ) : (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="mt-2 text-sm font-medium text-(--accent) underline-offset-2 hover:underline"
            >
              Reveal
            </button>
          )}
          <Link
            href={href}
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-(--accent-2) no-underline hover:underline"
          >
            See lesson {insight.conceptCode}
            <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
