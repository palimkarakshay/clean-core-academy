import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ClipboardCheck,
  ListChecks,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { RecommendationBanner } from "@/components/dashboard/RecommendationBanner";
import { DailyInsightCard } from "@/components/dashboard/DailyInsightCard";
import { SectionList } from "@/components/dashboard/SectionList";
import { TrackFilter } from "@/components/dashboard/TrackFilter";
import { MockExamPanel } from "@/components/dashboard/MockExamPanel";
import { JourneyJumper } from "@/components/dashboard/JourneyJumper";
import { FirstVisitGate } from "@/components/dashboard/FirstVisitGate";
import { LastVisitTracker } from "@/components/layout/LastVisitTracker";
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

      <header className="flex flex-col gap-2">
        <p className="font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.18em] text-(--muted)">
          Course
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-(--ink) md:text-3xl">
          {cfg.name}
        </h1>
        <p className="text-sm text-(--muted)">{cfg.tagline}</p>
        {cfg.heroImagePath ? (
          <div className="mt-2 overflow-hidden rounded-lg border border-(--border) bg-(--panel-2)">
            <Image
              aria-hidden
              src={cfg.heroImagePath}
              alt=""
              width={1200}
              height={675}
              priority
              unoptimized={/^https?:\/\//.test(cfg.heroImagePath)}
              className="h-28 w-full object-cover sm:h-36 md:h-44"
            />
          </div>
        ) : null}
      </header>

      <RecommendationBanner />

      <section id="sections" aria-label="All modules" className="scroll-mt-24">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
          Modules
        </h2>
        <div className="flex flex-col gap-4">
          <JourneyJumper />
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
          <CtaCard
            href={`/${pack.config.id}/audit`}
            icon={ClipboardCheck}
            title={pack.curriculum.readinessAudit.title}
            desc="Readiness score + a worst-first remediation list."
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
      </section>
    </div>
  );
}
