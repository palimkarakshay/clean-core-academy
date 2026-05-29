"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ModuleSkill } from "@/content/curriculum-types";
import {
  getServerSkillStore,
  getSkillStore,
  setSkillLevel,
  subscribeSkills,
  type SkillLevel,
} from "@/lib/skills-store";

export interface MatrixModule {
  sectionId: string;
  n: number;
  title: string;
  skills: ModuleSkill[];
}

const LEVELS: { value: SkillLevel; label: string; active: string }[] = [
  { value: "none", label: "Not yet", active: "border-(--border) bg-(--panel-2) text-(--muted)" },
  { value: "learning", label: "Learning", active: "border-(--warn) bg-(--warn)/15 text-(--warn)" },
  { value: "confident", label: "Confident", active: "border-(--good) bg-(--good)/15 text-(--good)" },
];

export function SkillsMatrix({
  packId,
  modules,
}: {
  packId: string;
  modules: MatrixModule[];
}) {
  const store = useSyncExternalStore(
    subscribeSkills,
    () => getSkillStore(packId),
    getServerSkillStore
  );

  const allSkills = modules.flatMap((m) => m.skills);
  const confident = allSkills.filter((s) => store[s.id] === "confident").length;
  const learning = allSkills.filter((s) => store[s.id] === "learning").length;
  const total = allSkills.length;
  const pct = total > 0 ? Math.round((confident / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-6">
      <section
        aria-label="Skills summary"
        className="rounded-lg border border-(--border) bg-(--panel-2) p-4"
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wide text-(--muted)">
              Skills you&apos;re confident in
            </div>
            <div className="text-3xl font-bold text-(--good)">
              {confident}
              <span className="text-lg font-medium text-(--muted)"> / {total}</span>
            </div>
          </div>
          <div className="text-xs text-(--muted)">
            {learning} learning · {total - confident - learning} not yet
          </div>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-(--border)">
          <div
            className="h-full bg-(--good) transition-[width]"
            style={{ width: `${pct}%` }}
          />
        </div>
      </section>

      {modules.map((m) => (
        <section key={m.sectionId} aria-label={`${m.title} skills`}>
          <h2 className="mb-2 flex items-baseline gap-2 text-sm font-semibold text-(--ink)">
            <Link
              href={`/${packId}/section/${m.sectionId}`}
              className="hover:text-(--accent-2) hover:underline"
            >
              {m.title}
            </Link>
          </h2>
          <ul className="flex flex-col gap-2">
            {m.skills.map((skill) => {
              const level = store[skill.id] ?? "none";
              return (
                <li
                  key={skill.id}
                  className="flex flex-col gap-2 rounded-md border border-(--border) bg-(--panel) p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-(--ink)">{skill.label}</p>
                    {skill.conceptId ? (
                      <Link
                        href={`/${packId}/concept/${m.sectionId}/${skill.conceptId}`}
                        className="mt-0.5 inline-flex items-center gap-1 text-xs text-(--accent-2) hover:underline"
                      >
                        Learn it
                        <ArrowRight className="h-3 w-3" aria-hidden />
                      </Link>
                    ) : null}
                  </div>
                  <div
                    role="radiogroup"
                    aria-label={`Your level: ${skill.label}`}
                    className="flex flex-none gap-1"
                  >
                    {LEVELS.map((opt) => {
                      const active = level === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => setSkillLevel(packId, skill.id, opt.value)}
                          className={
                            "rounded-md border px-2.5 py-1 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) " +
                            (active
                              ? opt.active + " font-semibold"
                              : "border-(--border) bg-(--panel-2) text-(--muted) hover:border-(--accent)")
                          }
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
      <p className="text-xs text-(--muted)">
        Your ratings are saved in this browser only (namespaced per course).
      </p>
    </div>
  );
}
