"use client";

import Link from "next/link";
import { useMemo } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { usePack } from "@/content/pack-context";
import { usePackId } from "@/content/pack-hooks";
import { recentlyLearnt } from "@/lib/recent-learning";

/**
 * "What you just learnt" — a one-line recap of the most recently
 * mastered lesson. Sits above the recommendation banner ("what's next")
 * so the two together brief a returning learner. Renders nothing until
 * hydrated, or when nothing has been mastered yet.
 */
export function RecapStrip() {
  const { progress, hydrated } = useProgress();
  const pack = usePack();
  const packId = usePackId();
  const recent = useMemo(
    () => recentlyLearnt(progress, pack.curriculum),
    [progress, pack]
  );

  if (!hydrated || !recent) return null;

  return (
    <Link
      href={`/${packId}/concept/${recent.sectionId}/${recent.conceptId}`}
      className="group flex items-center gap-2 rounded-md border border-(--good)/30 bg-(--good)/8 px-3 py-2 text-xs no-underline transition-colors hover:border-(--good)/60"
    >
      <CheckCircle2 aria-hidden className="h-4 w-4 flex-none text-(--good)" />
      <span className="text-(--muted)">You just learnt</span>
      <span className="min-w-0 truncate font-medium text-(--ink)">
        {recent.code} · {recent.title}
      </span>
      <span className="ml-auto inline-flex flex-none items-center gap-1 text-(--accent-2)">
        Revisit
        <ArrowRight
          aria-hidden
          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}
