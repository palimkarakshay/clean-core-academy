"use client";

import Link from "next/link";
import { Award, Lock, CheckCircle2, ArrowRight } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";
import type { SectionTestBlock } from "@/lib/lesson-flow/blocks";

/**
 * Test-phase launch card. Gates on `sectionTestReady` (every readable
 * lesson visited) — the same rule the rest of the app uses — and links
 * into the existing section-test route, which owns the QuizRunner and
 * records the attempt. No quiz logic is duplicated here.
 */
export function SectionTestCard({
  block,
  packId,
  testLabel,
}: {
  block: SectionTestBlock;
  packId: string;
  testLabel: string;
}) {
  const { sectionTestReady, sectionComplete, hydrated } = useProgress();
  const ready = sectionTestReady(block.sectionId);
  const complete = sectionComplete(block.sectionId);
  const passPctLabel = Math.round(block.passPct * 100);
  const href = `/${packId}/section/${block.sectionId}/test`;

  if (complete) {
    return (
      <div className="rounded-xl border border-(--good)/40 bg-(--good)/8 p-5 shadow-sm">
        <p className="flex items-center gap-2 text-base font-semibold text-(--ink)">
          <CheckCircle2 aria-hidden className="h-5 w-5 text-(--good)" />
          {testLabel} passed
        </p>
        <p className="mt-1 text-sm text-(--muted)">
          You cleared the bar for this module. You can retake it any time.
        </p>
        <Link
          href={href}
          className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-(--good)/40 bg-(--panel) px-3 py-1.5 text-sm font-medium text-(--good) no-underline hover:bg-(--good)/8"
        >
          Retake {testLabel.toLowerCase()}
          <ArrowRight aria-hidden className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border p-5 shadow-sm",
        ready
          ? "border-(--accent)/40 bg-(--accent)/8"
          : "border-(--border) bg-(--panel-2)"
      )}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className={cn(
            "inline-flex h-10 w-10 flex-none items-center justify-center rounded-lg",
            ready ? "bg-(--accent)/15 text-(--accent)" : "bg-(--panel) text-(--muted)"
          )}
        >
          {ready ? <Award className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-(--ink)">{testLabel}</h3>
          <p className="mt-0.5 text-sm text-(--muted)">
            {block.questionCount} questions · pass at {passPctLabel}%
          </p>
          {hydrated && !ready ? (
            <p className="mt-2 text-sm text-(--warn)">
              Work through the lessons above to unlock this — then prove what you
              learned.
            </p>
          ) : (
            <Link
              href={href}
              className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-(--accent) px-3 py-2 text-sm font-semibold text-white no-underline hover:opacity-90"
            >
              Start the {testLabel.toLowerCase()}
              <ArrowRight aria-hidden className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
