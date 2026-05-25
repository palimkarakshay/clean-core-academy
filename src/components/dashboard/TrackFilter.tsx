"use client";

import {
  Sprout,
  Code2,
  Compass,
  Server,
  Briefcase,
  Users,
  Eye,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import { usePack } from "@/content/pack-context";
import {
  AUDIENCES,
  DEVELOPER_AUDIENCES,
  BUSINESS_AUDIENCES,
  audienceMatches,
  type AudienceInfo,
} from "@/content/audiences";
import { useTrack, setTrack, type Track } from "@/lib/track-filter";
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
 * Track chooser shown above the module list on the course home. The
 * course is one body of content; this filter narrows it to the
 * modules tagged for the chosen audience. Selection is stored
 * (track-filter store) so the module list below reacts and the
 * choice survives reloads.
 */
export function TrackFilter() {
  const pack = usePack();
  const track = useTrack();
  const sections = pack.curriculum.sections;
  const total = sections.length;

  function countFor(a: AudienceInfo): number {
    return sections.filter((s) => audienceMatches(s.audiences, a.id)).length;
  }

  const selected =
    track === "all" ? null : AUDIENCES.find((a) => a.id === track) ?? null;

  return (
    <section
      aria-label="Choose your track"
      className="flex flex-col gap-3 rounded-lg border border-(--border) bg-(--panel-2)/50 p-4"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
          Choose your track
        </h3>
        <p className="text-xs text-(--muted)">
          One course, many lenses — filter the modules to your role.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Chip
          label="All modules"
          count={total}
          Icon={LayoutGrid}
          active={track === "all"}
          onClick={() => setTrack("all")}
        />

        <TrackGroup
          heading="Developers"
          audiences={DEVELOPER_AUDIENCES}
          track={track}
          countFor={countFor}
        />
        <TrackGroup
          heading="Business & stakeholders"
          audiences={BUSINESS_AUDIENCES}
          track={track}
          countFor={countFor}
        />
      </div>

      {selected ? (
        <p className="border-t border-dashed border-(--border) pt-3 text-sm text-(--muted)">
          <span className="font-semibold text-(--ink)">{selected.label}:</span>{" "}
          {selected.description}
        </p>
      ) : null}
    </section>
  );
}

function TrackGroup({
  heading,
  audiences,
  track,
  countFor,
}: {
  heading: string;
  audiences: AudienceInfo[];
  track: Track;
  countFor: (a: AudienceInfo) => number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-wide text-(--muted)">
        {heading}
      </span>
      <div className="flex flex-wrap gap-2">
        {audiences.map((a) => (
          <Chip
            key={a.id}
            label={a.shortLabel}
            count={countFor(a)}
            Icon={ICONS[a.icon] ?? LayoutGrid}
            active={track === a.id}
            onClick={() => setTrack(a.id)}
          />
        ))}
      </div>
    </div>
  );
}

function Chip({
  label,
  count,
  Icon,
  active,
  onClick,
}: {
  label: string;
  count: number;
  Icon: LucideIcon;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-(--accent) bg-(--accent)/12 text-(--accent-2)"
          : "border-(--border) bg-(--panel) text-(--muted) hover:border-(--accent)/50 hover:text-(--ink)"
      )}
    >
      <Icon aria-hidden className="h-3.5 w-3.5" />
      <span>{label}</span>
      <span
        className={cn(
          "rounded-full px-1.5 text-[10px] tabular-nums",
          active ? "bg-(--accent)/20" : "bg-(--panel-2) text-(--muted)"
        )}
      >
        {count}
      </span>
    </button>
  );
}
