"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sprout,
  Code2,
  Compass,
  Server,
  Briefcase,
  Users,
  Eye,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  type LucideIcon,
} from "lucide-react";
import { usePack } from "@/content/pack-context";
import {
  DEVELOPER_AUDIENCES,
  BUSINESS_AUDIENCES,
  audienceMatches,
  type AudienceInfo,
} from "@/content/audiences";
import { setTrack, useTrack } from "@/lib/track-filter";
import { useProgress } from "@/hooks/useProgress";
import type { Audience } from "@/content/curriculum-types";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  sprout: Sprout,
  code: Code2,
  compass: Compass,
  server: Server,
  briefcase: Briefcase,
  users: Users,
  eye: Eye,
};

/**
 * Guided two-step entry funnel. Step 1: pick the role that fits you.
 * Step 2: see the exact ordered path for that role and step into the
 * first module that isn't done. Removes the old "land on a wall of
 * modules and guess" experience. The chosen role is written to the
 * shared track store so the rest of the app (module list, Before You
 * Begin) stays in sync.
 */
export function StartHere({ packId }: { packId: string }) {
  const pack = usePack();
  const track = useTrack();
  const { sectionStatus } = useProgress();
  const sections = pack.curriculum.sections;
  const hasAudit = Boolean(pack.curriculum.readinessAudit);

  // Treat a real (non-"all") persisted track as a prior choice so a
  // returning learner skips straight to their path.
  const [picked, setPicked] = useState<Audience | null>(
    track === "all" ? null : track
  );

  function choose(role: Audience) {
    setPicked(role);
    setTrack(role);
  }

  const path = picked
    ? sections.filter((s) => audienceMatches(s.audiences, picked))
    : [];
  const firstUnfinished =
    path.find((s) => sectionStatus(s.id) !== "complete") ?? path[0];

  return (
    <div className="flex flex-col gap-8">
      {/* Step 1 — choose a role */}
      <section aria-labelledby="start-step1">
        <div className="mb-3 flex items-center gap-3">
          <StepDot n={1} active={!picked} done={Boolean(picked)} />
          <h2
            id="start-step1"
            className="font-[family-name:var(--font-display)] text-lg font-semibold text-(--ink)"
          >
            Who are you?
          </h2>
        </div>
        <p className="mb-4 text-sm text-(--muted)">
          Pick the closest fit — it tailors your path and what you see first.
          You can change it any time.
        </p>

        <RoleGroup
          heading="Developers"
          audiences={DEVELOPER_AUDIENCES}
          picked={picked}
          onChoose={choose}
        />
        <div className="mt-4" />
        <RoleGroup
          heading="Business & stakeholders"
          audiences={BUSINESS_AUDIENCES}
          picked={picked}
          onChoose={choose}
        />
      </section>

      {/* Step 2 — your path */}
      {picked && firstUnfinished ? (
        <section aria-labelledby="start-step2">
          <div className="mb-3 flex items-center gap-3">
            <StepDot n={2} active done={false} />
            <h2
              id="start-step2"
              className="font-[family-name:var(--font-display)] text-lg font-semibold text-(--ink)"
            >
              Your path
            </h2>
          </div>

          <Link
            href={`/${packId}/section/${firstUnfinished.id}`}
            className="group mb-4 flex items-center gap-4 rounded-xl border border-(--accent)/40 bg-(--accent)/8 p-5 no-underline shadow-sm transition-colors hover:border-(--accent)"
          >
            <span className="flex h-12 w-12 flex-none items-center justify-center rounded-lg bg-(--accent) text-lg font-bold text-white">
              {firstUnfinished.n}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
                Start here
              </span>
              <span className="block text-base font-semibold text-(--ink)">
                Module {firstUnfinished.n}: {firstUnfinished.title}
              </span>
            </span>
            <ArrowRight
              aria-hidden
              className="h-5 w-5 flex-none text-(--accent) transition-transform group-hover:translate-x-1"
            />
          </Link>

          <ol className="flex flex-col gap-1.5">
            {path.map((s) => {
              const status = sectionStatus(s.id);
              const isStart = s.id === firstUnfinished.id;
              return (
                <li key={s.id}>
                  <Link
                    href={`/${packId}/section/${s.id}`}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border px-4 py-2.5 text-sm no-underline transition-colors",
                      isStart
                        ? "border-(--accent)/40 bg-(--panel)"
                        : "border-(--border) bg-(--panel) hover:border-(--accent)/50"
                    )}
                  >
                    <span className="font-mono text-xs text-(--muted)">
                      {s.n.toString().padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-(--ink)">
                      {s.title}
                    </span>
                    {status === "complete" ? (
                      <CheckCircle2
                        aria-label="complete"
                        className="h-4 w-4 flex-none text-(--good)"
                      />
                    ) : status === "in-progress" ? (
                      <span className="flex-none rounded-full bg-(--accent)/15 px-2 py-0.5 text-[10px] font-medium text-(--accent-2)">
                        in progress
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ol>

          {hasAudit ? (
            <Link
              href={`/${packId}/audit`}
              className="mt-4 inline-flex items-center gap-2 text-sm text-(--accent-2) hover:underline"
            >
              <ClipboardCheck aria-hidden className="h-4 w-4" />
              Not sure where you stand? Take the 2-minute readiness check first.
            </Link>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

function StepDot({ n, active, done }: { n: number; active: boolean; done: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex h-7 w-7 flex-none items-center justify-center rounded-full text-sm font-bold",
        done && "bg-(--good) text-white",
        !done && active && "bg-(--accent) text-white",
        !done && !active && "border border-(--border) text-(--muted)"
      )}
    >
      {done ? <CheckCircle2 className="h-4 w-4" /> : n}
    </span>
  );
}

function RoleGroup({
  heading,
  audiences,
  picked,
  onChoose,
}: {
  heading: string;
  audiences: AudienceInfo[];
  picked: Audience | null;
  onChoose: (role: Audience) => void;
}) {
  return (
    <div>
      <h3 className="mb-2 text-[11px] font-medium uppercase tracking-wide text-(--muted)">
        {heading}
      </h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {audiences.map((a) => {
          const Icon = ICONS[a.icon] ?? Compass;
          const active = picked === a.id;
          return (
            <button
              key={a.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChoose(a.id)}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-3 text-left transition-colors",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)",
                active
                  ? "border-(--accent) bg-(--accent)/10"
                  : "border-(--border) bg-(--panel) hover:border-(--accent)/50"
              )}
            >
              <span
                className={cn(
                  "mt-0.5 inline-flex h-9 w-9 flex-none items-center justify-center rounded-md",
                  active ? "bg-(--accent)/15 text-(--accent)" : "bg-(--panel-2) text-(--muted)"
                )}
              >
                <Icon aria-hidden className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-(--ink)">
                  {a.label}
                </span>
                <span className="mt-0.5 block text-xs leading-snug text-(--muted)">
                  {a.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
