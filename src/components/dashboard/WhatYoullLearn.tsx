"use client";

import { useMemo } from "react";
import { Check } from "lucide-react";
import { usePack } from "@/content/pack-context";
import { useTrack } from "@/lib/track-filter";
import { audienceMatches, getAudienceInfo } from "@/content/audiences";
import { SECTION_META } from "@/content/section-meta";
import { Card } from "@/components/ui/card";

/**
 * Role-aware learning outcomes. Reads the selected track (the role
 * picker above) and lists the learning objectives of the modules that
 * track sees — so "what you'll learn" reacts to who the learner is.
 * Defaults to "all" on first render (hydration-safe, matching the
 * track-filter store).
 */
export function WhatYoullLearn() {
  const pack = usePack();
  const track = useTrack();

  const modules = useMemo(
    () =>
      pack.curriculum.sections
        .filter((s) => track === "all" || audienceMatches(s.audiences, track))
        .map((s) => ({
          id: s.id,
          n: s.n,
          title: s.title,
          objectives: Object.hasOwn(SECTION_META, s.id)
            ? SECTION_META[s.id].learningObjectives
            : [],
        }))
        .filter((m) => m.objectives.length > 0),
    [pack, track]
  );

  const roleLabel = track === "all" ? null : getAudienceInfo(track)?.shortLabel;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-(--muted)">
        {roleLabel ? (
          <>
            Tailored to{" "}
            <span className="font-medium text-(--ink)">{roleLabel}</span> —{" "}
            {modules.length} module{modules.length === 1 ? "" : "s"}.
          </>
        ) : (
          <>Across the whole course — {modules.length} modules.</>
        )}
      </p>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((m) => (
          <Card key={m.id} flat className="flex flex-col gap-2 p-4">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[11px] text-(--muted)">
                {String(m.n).padStart(2, "0")}
              </span>
              <h3 className="text-sm font-semibold text-(--ink)">{m.title}</h3>
            </div>
            <ul className="flex flex-col gap-1.5">
              {m.objectives.map((o) => (
                <li key={o} className="flex gap-2 text-xs text-(--muted)">
                  <Check
                    aria-hidden
                    className="mt-0.5 h-3.5 w-3.5 flex-none text-(--accent-2)"
                  />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
