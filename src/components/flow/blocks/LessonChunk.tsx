"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { LessonBody, DeeperBody } from "@/components/concept/LessonBody";
import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";
import type { LessonChunkBlock } from "@/lib/lesson-flow/blocks";
import type { Bloom } from "@/content/curriculum-types";

const BLOOM_LABEL: Record<Bloom, string> = {
  R: "Remember",
  U: "Understand",
  A: "Apply",
  An: "Analyse",
  E: "Evaluate",
  C: "Create",
};

/**
 * One concept rendered as a self-contained Rise-style chunk: a simple
 * lead-in (the one-liner + analogy) up top so a skimmer gets the gist,
 * then the canonical body, with the advanced "deeper" material tucked
 * behind an accordion so the default view stays light. Marks the
 * concept's lesson read the moment the chunk is revealed.
 */
export function LessonChunk({ block }: { block: LessonChunkBlock }) {
  const { markLessonRead } = useProgress();
  const [deeperOpen, setDeeperOpen] = useState(false);
  const lesson = block.lesson;
  const lead = lesson.simplified;

  useEffect(() => {
    markLessonRead(block.conceptId);
  }, [block.conceptId, markLessonRead]);

  return (
    <article className="rounded-xl border border-(--border) bg-(--panel) p-5 shadow-sm md:p-6">
      <header className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-(--accent)/12 px-2.5 py-0.5 font-mono text-xs font-semibold text-(--accent-2)">
          {block.code}
        </span>
        {block.bloom ? (
          <span className="rounded-full border border-(--border) px-2 py-0.5 text-[10px] uppercase tracking-wide text-(--muted)">
            {BLOOM_LABEL[block.bloom]}
          </span>
        ) : null}
      </header>

      <h2 className="font-[family-name:var(--font-display)] text-xl md:text-2xl font-semibold text-(--ink)">
        {block.title}
      </h2>

      {lead?.oneLiner ? (
        <div className="my-4 flex items-start gap-3 rounded-lg border-l-4 border-(--accent) bg-(--panel-2) p-4">
          <Sparkles
            aria-hidden
            className="mt-0.5 h-4 w-4 flex-none text-(--accent)"
          />
          <div className="min-w-0">
            <p className="text-base font-medium leading-relaxed text-(--ink)">
              {lead.oneLiner}
            </p>
            {lead.analogy ? (
              <p className="mt-1.5 text-sm leading-relaxed text-(--muted)">
                {lead.analogy}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      <LessonBody lesson={lesson} />

      {lesson.deeper ? (
        <div className="mt-5 rounded-lg border border-dashed border-(--border)">
          <button
            type="button"
            onClick={() => setDeeperOpen((o) => !o)}
            aria-expanded={deeperOpen}
            className={cn(
              "flex w-full items-center justify-between gap-2 rounded-lg px-4 py-3 text-left text-sm font-medium text-(--ink)",
              "hover:bg-(--panel-2) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
            )}
          >
            <span>Go deeper — advanced detail &amp; edge cases</span>
            <ChevronDown
              aria-hidden
              className={cn(
                "h-4 w-4 flex-none text-(--muted) transition-transform",
                deeperOpen && "rotate-180"
              )}
            />
          </button>
          {deeperOpen ? (
            <div className="border-t border-dashed border-(--border) px-4 pb-4 pt-1">
              <DeeperBody deeper={lesson.deeper} />
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
