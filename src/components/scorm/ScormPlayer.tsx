"use client";

import { useEffect } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronLeft } from "lucide-react";
import { usePack } from "@/content/pack-context";
import { useProgress } from "@/hooks/useProgress";
import { useLearnerName } from "@/lib/scorm/identity";
import { LessonFlow } from "@/components/flow/LessonFlow";
import { cn } from "@/lib/utils";
import type { LessonBlock } from "@/lib/lesson-flow/blocks";
import type { Section } from "@/content/curriculum-types";

export interface ScormModule {
  section: Section;
  blocks: LessonBlock[];
}

/**
 * Single-page course player for the self-contained SCORM package.
 *
 * The whole course lives in one document and switches between the
 * module list and a module's linear flow via client state — never a
 * route change. That's what lets the package run from any path inside
 * an LMS iframe (App Router route navigation uses absolute paths that
 * break there). Progress is recorded through the normal store, and the
 * SCORM bridge (mounted in the pack layout) reports score/completion.
 */
export function ScormPlayer({
  modules,
  testLabel,
}: {
  modules: ScormModule[];
  testLabel: string;
}) {
  const pack = usePack();
  const { sectionStatus, progress, setLocation } = useProgress();
  const learner = useLearnerName();

  // The open module is driven by stored location, not local state, so the
  // SCORM bridge persists it into suspend_data and a resumed attempt
  // reopens the same module.
  const activeId =
    progress.location?.view === "module" ? progress.location.sectionId : null;
  const setActive = (id: string | null) =>
    setLocation({
      view: id ? "module" : "dashboard",
      sectionId: id,
      conceptId: null,
      mockId: null,
    });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [activeId]);

  const activeIndex = activeId
    ? modules.findIndex((m) => m.section.id === activeId)
    : -1;
  const active = activeIndex >= 0 ? modules[activeIndex] : null;

  if (active) {
    const prev = modules[activeIndex - 1];
    const next = modules[activeIndex + 1];
    return (
      <div>
        <button
          type="button"
          onClick={() => setActive(null)}
          className="mb-4 inline-flex items-center gap-1.5 rounded-md border border-(--border) bg-(--panel) px-3 py-1.5 text-sm text-(--ink) hover:border-(--accent) hover:text-(--accent-2) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
        >
          <ChevronLeft aria-hidden className="h-4 w-4" />
          All modules
        </button>

        <LessonFlow
          packId={pack.config.id}
          section={active.section}
          blocks={active.blocks}
          testLabel={testLabel}
          inlineTest
        />

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-(--border) pt-4">
          {prev ? (
            <button
              type="button"
              onClick={() => setActive(prev.section.id)}
              className="inline-flex items-center gap-1.5 rounded-md border border-(--border) bg-(--panel) px-3 py-2 text-sm text-(--ink) hover:border-(--accent) hover:text-(--accent-2)"
            >
              <ArrowLeft aria-hidden className="h-4 w-4" />
              Previous
            </button>
          ) : (
            <span />
          )}
          {next ? (
            <button
              type="button"
              onClick={() => setActive(next.section.id)}
              className="inline-flex items-center gap-1.5 rounded-md bg-(--accent) px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Next: {next.section.title}
              <ArrowRight aria-hidden className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setActive(null)}
              className="inline-flex items-center gap-1.5 rounded-md border border-(--accent)/40 bg-(--accent)/8 px-4 py-2 text-sm font-semibold text-(--accent-2) hover:border-(--accent)"
            >
              Back to all modules
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <p className="font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.18em] text-(--muted)">
          Course
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-semibold text-(--ink)">
          {pack.config.name}
        </h1>
        <p className="text-sm text-(--muted)">{pack.config.tagline}</p>
        {learner ? (
          <p className="text-xs text-(--muted)">Signed in as {learner}</p>
        ) : null}
      </header>

      <ol className="flex flex-col gap-2">
        {modules.map(({ section }, i) => {
          const status = sectionStatus(section.id);
          return (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => setActive(section.id)}
                className="group flex w-full items-center gap-4 rounded-xl border border-(--border) bg-(--panel) p-4 text-left shadow-sm transition-colors hover:border-(--accent) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
              >
                <span
                  className={cn(
                    "flex h-10 w-10 flex-none items-center justify-center rounded-lg text-sm font-bold",
                    status === "complete"
                      ? "bg-(--good)/15 text-(--good)"
                      : "bg-(--accent)/12 text-(--accent-2)"
                  )}
                >
                  {status === "complete" ? (
                    <CheckCircle2 aria-hidden className="h-5 w-5" />
                  ) : (
                    i + 1
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-semibold text-(--ink)">
                    {section.title}
                  </span>
                  <span className="mt-0.5 line-clamp-2 block text-sm text-(--muted)">
                    {section.blurb}
                  </span>
                  {status === "in-progress" ? (
                    <span className="mt-1 inline-block rounded-full bg-(--accent)/15 px-2 py-0.5 text-[10px] font-medium text-(--accent-2)">
                      in progress
                    </span>
                  ) : null}
                </span>
                <ArrowRight
                  aria-hidden
                  className="h-5 w-5 flex-none text-(--accent) transition-transform group-hover:translate-x-1"
                />
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
