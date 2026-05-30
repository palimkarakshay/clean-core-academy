"use client";

import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import { MasteryBadge } from "@/components/primitives/MasteryBadge";
import { usePackId } from "@/content/pack-hooks";
import type { Section } from "@/content/curriculum-types";

export function SectionConceptList({
  section,
  packId: packIdProp,
}: {
  section: Section;
  /** Override the URL pack id when rendered outside [packId] routes. */
  packId?: string;
}) {
  const { hydrated, conceptMastery } = useProgress();
  const ctxPackId = usePackId();
  const packId = packIdProp ?? ctxPackId;

  return (
    <ul className="flex flex-col gap-2">
      {section.concepts.map((c) => {
        const authored = Boolean(c.lesson && c.quiz);
        const m = hydrated ? conceptMastery(c.id) : 0;
        const disabled = !authored;
        const inner = (
          <span className="flex w-full items-center gap-3">
            <span className="w-12 font-mono text-[11px] text-(--accent-2)">
              {c.code}
            </span>
            <span className="flex-1 text-sm">{c.title}</span>
            {c.bloom ? (
              <span className="rounded-full border border-(--border) px-2 py-0.5 text-[10px] text-(--muted)">
                {c.bloom}
              </span>
            ) : null}
            <MasteryBadge mastery={m} />
            {!authored ? (
              <span className="rounded-full border border-(--warn)/40 px-2 py-0.5 text-[10px] text-(--warn)">
                Stub
              </span>
            ) : null}
          </span>
        );
        if (disabled) {
          return (
            <li
              key={c.id}
              // No opacity — kills text contrast for AA. Disabled state is
              // signalled by cursor-not-allowed + the "Stub" badge.
              className="flex cursor-not-allowed items-center gap-3 rounded-md border border-transparent px-2 py-2"
            >
              {inner}
            </li>
          );
        }
        return (
          <li
            key={c.id}
            className="flex items-center gap-2 rounded-md border border-transparent px-2 py-1.5 hover:border-(--border) hover:bg-(--panel-2)"
          >
            <Link
              href={`/${packId}/concept/${section.id}/${c.id}`}
              className="min-w-0 flex-1 no-underline"
            >
              {inner}
            </Link>
            <Link
              href={`/${packId}/concept/${section.id}/${c.id}/quiz`}
              aria-label={`Take the quiz for ${c.code} ${c.title}`}
              className="inline-flex flex-none items-center rounded-full border border-(--border) bg-(--panel) px-2.5 py-1 text-[11px] font-medium text-(--accent-2) no-underline hover:border-(--accent) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
            >
              Quiz
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
