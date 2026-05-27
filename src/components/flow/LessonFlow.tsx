"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown, ArrowDown, PartyPopper } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";
import {
  PHASE_META,
  type LessonBlock,
} from "@/lib/lesson-flow/blocks";
import { LessonChunk } from "./blocks/LessonChunk";
import { InlineKnowledgeCheck } from "./blocks/InlineKnowledgeCheck";
import { SectionTestCard } from "./blocks/SectionTestCard";
import { ProgressRail } from "./ProgressRail";
import { FlashcardsPanel } from "@/components/section/FlashcardsPanel";
import { AppliedPanel } from "@/components/section/AppliedPanel";
import { CodeExercisePanel } from "@/components/concept/CodeExercisePanel";
import type { Section } from "@/content/curriculum-types";

interface LessonFlowProps {
  packId: string;
  section: Section;
  blocks: LessonBlock[];
  testLabel: string;
  /** Server-rendered "what you'll learn" panel, shown collapsed up top. */
  goalsPanel: ReactNode;
}

function continueLabel(next: LessonBlock | undefined): string {
  if (!next) return "Continue";
  switch (next.kind) {
    case "lesson-chunk":
      return "Continue to the next lesson";
    case "flashcard-grid":
      return "Continue to flashcards";
    case "knowledge-check":
      return "Continue to a knowledge check";
    case "code-exercise":
      return "Continue to the hands-on exercise";
    case "section-test":
      return "Continue to the module check";
    case "applied":
      return "Continue to apply it";
    default:
      return "Continue";
  }
}

/**
 * The Rise-style linear module experience. Renders the module as one
 * scrolling column of blocks grouped into Learn → Practice → Test →
 * Apply, revealed a step at a time so a learner only ever faces one new
 * chunk. Progress, mastery, and the test gate all run through the
 * existing progress store via the individual block components.
 */
export function LessonFlow({
  packId,
  section,
  blocks,
  testLabel,
  goalsPanel,
}: LessonFlowProps) {
  const { sectionComplete } = useProgress();
  const [revealed, setRevealed] = useState(1);
  const [goalsOpen, setGoalsOpen] = useState(false);
  const didMount = useRef(false);

  const shown = blocks.slice(0, revealed);
  const hasMore = revealed < blocks.length;
  const complete = sectionComplete(section.id);

  // Scroll the newly revealed block into view — but never on first paint.
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    const last = blocks[revealed - 1];
    if (!last) return;
    document
      .getElementById(`block-${last.id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [revealed, blocks]);

  function renderBlock(block: LessonBlock): ReactNode {
    switch (block.kind) {
      case "lesson-chunk":
        return <LessonChunk block={block} />;
      case "flashcard-grid":
        return (
          <div className="rounded-xl border border-(--border) bg-(--panel) p-5 shadow-sm">
            <FlashcardsPanel cards={block.cards} />
          </div>
        );
      case "knowledge-check":
        return <InlineKnowledgeCheck block={block} />;
      case "code-exercise":
        return (
          <div className="rounded-xl border border-(--border) bg-(--panel) p-5 shadow-sm">
            <CodeExercisePanel exercise={block.exercise} />
          </div>
        );
      case "section-test":
        return (
          <SectionTestCard block={block} packId={packId} testLabel={testLabel} />
        );
      case "applied":
        return (
          <div className="rounded-xl border border-(--border) bg-(--panel) p-5 shadow-sm">
            <AppliedPanel section={section} packId={packId} />
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div>
      {/* Module header */}
      <header className="mb-4">
        <p className="font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.18em] text-(--muted)">
          Module {section.n}
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-2xl md:text-3xl font-semibold text-(--ink)">
          {section.title}
        </h1>
        <p className="mt-1 text-sm leading-relaxed text-(--muted)">
          {section.blurb}
        </p>
      </header>

      {/* Collapsible "what you'll learn" */}
      <div className="mb-2 rounded-lg border border-(--border) bg-(--panel-2)">
        <button
          type="button"
          onClick={() => setGoalsOpen((o) => !o)}
          aria-expanded={goalsOpen}
          className="flex w-full items-center justify-between gap-2 rounded-lg px-4 py-3 text-left text-sm font-medium text-(--ink) hover:bg-(--panel) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
        >
          <span>What you&rsquo;ll learn &amp; how long it takes</span>
          <ChevronDown
            aria-hidden
            className={cn(
              "h-4 w-4 flex-none text-(--muted) transition-transform",
              goalsOpen && "rotate-180"
            )}
          />
        </button>
        {goalsOpen ? (
          <div className="border-t border-(--border) px-4 pb-4 pt-3">
            {goalsPanel}
          </div>
        ) : null}
      </div>

      <ProgressRail
        blocks={blocks}
        revealedCount={revealed}
        sectionComplete={complete}
      />

      <div className="flex flex-col gap-5">
        {shown.map((block, i) => {
          const showDivider = i === 0 || shown[i - 1].phase !== block.phase;
          const meta = PHASE_META[block.phase];
          return (
            <div key={block.id} id={`block-${block.id}`} className="scroll-mt-24">
              {showDivider ? (
                <div className="mb-4 mt-2 flex items-baseline gap-3">
                  <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-(--accent-2)">
                    {meta.title}
                  </h2>
                  <span className="text-sm text-(--muted)">{meta.subtitle}</span>
                </div>
              ) : null}
              {renderBlock(block)}
            </div>
          );
        })}
      </div>

      {/* Stepper */}
      {hasMore ? (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setRevealed((r) => Math.min(r + 1, blocks.length))}
            className="inline-flex items-center gap-2 rounded-full bg-(--accent) px-6 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
          >
            {continueLabel(blocks[revealed])}
            <ArrowDown aria-hidden className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-dashed border-(--border) bg-(--panel-2) p-4 text-sm text-(--muted)">
          <PartyPopper aria-hidden className="h-4 w-4 text-(--accent)" />
          {complete
            ? "Module complete. On to the next one!"
            : "You've reached the end of this module — finish the module check to mark it complete."}
        </div>
      )}
    </div>
  );
}
