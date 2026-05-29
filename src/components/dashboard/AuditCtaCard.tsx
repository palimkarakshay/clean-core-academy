"use client";

import Link from "next/link";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import { useTrack } from "@/lib/track-filter";
import { getAudienceInfo } from "@/content/audiences";

/**
 * The readiness self-audit CTA, made role-aware. The audit itself is a
 * developer codebase questionnaire ("does YOUR code UPDATE SAP tables /
 * use BDC / SELECT *?"). For the business tracks (management / key &
 * end users / stakeholders) that's not answerable, so we keep the card
 * visible but reframe it as a developer tool and set expectations up
 * front, rather than presenting it as something they should score
 * themselves on. Developer / "all" tracks see the original framing.
 *
 * Reads the persisted track (defaults to "all" pre-hydration, matching
 * the track-filter store, so SSR and first client render agree).
 */
export function AuditCtaCard({ packId, title }: { packId: string; title: string }) {
  const track = useTrack();
  const isBusiness =
    track !== "all" && getAudienceInfo(track)?.family === "business";

  const desc = isBusiness
    ? "A developer tool — answer questions about an ABAP codebase for a readiness score and worst-first fix-it list."
    : "A few questions about your code return a readiness score and a worst-first fix-it list.";

  return (
    <Link
      href={`/${packId}/audit`}
      className="group flex items-start gap-3 rounded-lg border border-(--border) bg-(--panel-2) p-4 no-underline transition-colors hover:border-(--accent)"
    >
      <ClipboardCheck aria-hidden className="mt-0.5 h-5 w-5 flex-none text-(--accent)" />
      <div className="min-w-0 flex-1">
        <h2 className="flex flex-wrap items-center gap-2 text-sm font-semibold text-(--ink)">
          {title}
          {isBusiness ? (
            <span className="rounded-full border border-(--border) bg-(--panel) px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-(--muted)">
              For developers
            </span>
          ) : null}
        </h2>
        <p className="mt-0.5 text-xs text-(--muted)">{desc}</p>
      </div>
      <ArrowRight
        aria-hidden
        className="mt-1 h-4 w-4 flex-none text-(--accent-2) transition-transform group-hover:translate-x-0.5"
      />
    </Link>
  );
}
