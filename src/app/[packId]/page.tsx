import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  GraduationCap,
  ListChecks,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { ViewModeToggle } from "@/components/section/ViewModeToggle";
import { RecommendationBanner } from "@/components/dashboard/RecommendationBanner";
import { OverallProgressBar } from "@/components/dashboard/OverallProgressBar";
import { RecapStrip } from "@/components/dashboard/RecapStrip";
import { DailyInsightCard } from "@/components/dashboard/DailyInsightCard";
import { SectionList } from "@/components/dashboard/SectionList";
import { AuditCtaCard } from "@/components/dashboard/AuditCtaCard";
import { TrackFilter } from "@/components/dashboard/TrackFilter";
import { MockExamPanel } from "@/components/dashboard/MockExamPanel";
import { FirstVisitGate } from "@/components/dashboard/FirstVisitGate";
import { LastVisitTracker } from "@/components/layout/LastVisitTracker";
import { JourneyArt } from "@/components/dashboard/JourneyArt";
import { getPack } from "@/content/pack-registry";
import { siteConfigFor } from "@/lib/pack-helpers";

type Params = { packId: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { packId } = await params;
  const pack = getPack(packId);
  if (!pack) return { title: "Pack not found" };
  const cfg = siteConfigFor(pack);
  return { title: "Course overview", description: cfg.description };
}

/** Compact link card for the secondary actions row. */
function CtaCard({
  href,
  icon: Icon,
  title,
  desc,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-lg border border-(--border) bg-(--panel-2) p-4 no-underline transition-colors hover:border-(--accent)"
    >
      <Icon aria-hidden className="mt-0.5 h-5 w-5 flex-none text-(--accent)" />
      <div className="min-w-0 flex-1">
        <h2 className="text-sm font-semibold text-(--ink)">{title}</h2>
        <p className="mt-0.5 text-xs text-(--muted)">{desc}</p>
      </div>
      <ArrowRight
        aria-hidden
        className="mt-1 h-4 w-4 flex-none text-(--accent-2) transition-transform group-hover:translate-x-0.5"
      />
    </Link>
  );
}

export default async function PackHomePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { packId } = await params;
  const pack = getPack(packId);
  if (!pack) notFound();
  const cfg = siteConfigFor(pack);
  const hasSkills = pack.curriculum.sections.some(
    (s) => s.skills && s.skills.length > 0
  );

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 py-2 lg:max-w-6xl xl:max-w-[84rem]">
      <FirstVisitGate packId={pack.config.id} />
      <LastVisitTracker
        packId={pack.config.id}
        packName={pack.config.name}
        href={`/${pack.config.id}`}
      />

      <header className="flex items-center justify-between gap-4 rounded-xl border border-(--border) bg-gradient-to-br from-(--panel-2) to-(--panel) p-6 md:p-8">
        <div className="flex flex-col gap-2">
          <p className="font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.18em] text-(--muted)">
            Course
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-(--ink) md:text-3xl">
            {cfg.name}
          </h1>
          <p className="max-w-prose text-sm text-(--muted)">{cfg.tagline}</p>
        </div>
        <JourneyArt className="hidden h-16 w-28 flex-none sm:block md:h-24 md:w-40" />
      </header>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-(--border) bg-(--panel-2) px-4 py-3">
        <span className="text-sm text-(--muted)">
          Choose how you work through each module — switch anytime.
        </span>
        <ViewModeToggle />
      </div>

      <OverallProgressBar />
      <RecapStrip />
      <RecommendationBanner />

      <section id="sections" aria-label="All modules" className="scroll-mt-24">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
          Modules
        </h2>
        <div className="flex flex-col gap-4">
          <TrackFilter />
          <SectionList />
        </div>
      </section>

      <MockExamPanel />

      <DailyInsightCard />

      <section aria-label="More" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <CtaCard
          href={`/${pack.config.id}/start`}
          icon={Rocket}
          title="Start here"
          desc="Set your role, check the fit, and track your progress."
        />
        {pack.curriculum.readinessAudit ? (
          <AuditCtaCard
            packId={pack.config.id}
            title={pack.curriculum.readinessAudit.title}
          />
        ) : null}
        {hasSkills ? (
          <CtaCard
            href={`/${pack.config.id}/skills`}
            icon={ListChecks}
            title="Skills matrix"
            desc="Rate the competencies each module builds."
          />
        ) : null}
        <CtaCard
          href={`/${pack.config.id}/export`}
          icon={GraduationCap}
          title="Deploy in your LMS"
          desc="For L&D & SME leads — export this course as a SCORM 1.2 package."
        />
      </section>
    </div>
  );
}
