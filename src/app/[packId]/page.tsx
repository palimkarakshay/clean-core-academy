import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ClipboardCheck, ListChecks } from "lucide-react";
import { RecommendationBanner } from "@/components/dashboard/RecommendationBanner";
import { DailyInsightCard } from "@/components/dashboard/DailyInsightCard";
import { SectionList } from "@/components/dashboard/SectionList";
import { TrackFilter } from "@/components/dashboard/TrackFilter";
import { MockExamPanel } from "@/components/dashboard/MockExamPanel";
import { StatsPanel } from "@/components/dashboard/StatsPanel";
import { ProgressCharts } from "@/components/dashboard/ProgressCharts";
import { JourneyJumper } from "@/components/dashboard/JourneyJumper";
import { BeforeYouBegin } from "@/components/dashboard/BeforeYouBegin";
import { Container } from "@/components/ui/Container";
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

export default async function PackHomePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { packId } = await params;
  const pack = getPack(packId);
  if (!pack) notFound();
  const cfg = siteConfigFor(pack);

  return (
    <Container width="wide" className="flex flex-col gap-6 py-2">
      <LastVisitTracker
        packId={pack.config.id}
        packName={pack.config.name}
        href={`/${pack.config.id}`}
      />
      <header className="flex flex-col gap-2">
        <p className="font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.18em] text-(--muted)">
          Course
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-semibold text-(--ink)">
          {cfg.name}
        </h1>
        <p className="text-sm text-(--muted)">{cfg.tagline}</p>
        {cfg.heroImagePath ? (
          <div className="mt-3 overflow-hidden rounded-lg border border-(--border) bg-(--panel-2)">
            <Image
              aria-hidden
              src={cfg.heroImagePath}
              alt=""
              width={1200}
              height={675}
              priority
              unoptimized={/^https?:\/\//.test(cfg.heroImagePath)}
              className="h-auto w-full object-cover"
            />
          </div>
        ) : null}
      </header>
      <RecommendationBanner />
      <DailyInsightCard />

      {pack.curriculum.readinessAudit ? (
        <Link
          href={`/${pack.config.id}/audit`}
          className="group flex items-start gap-3 rounded-lg border border-(--border) bg-(--panel-2) p-4 no-underline shadow-sm transition-colors hover:border-(--accent)"
        >
          <ClipboardCheck
            aria-hidden
            className="mt-0.5 h-5 w-5 flex-none text-(--accent)"
          />
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-(--ink)">
              {pack.curriculum.readinessAudit.title}
            </h2>
            <p className="mt-0.5 text-sm text-(--muted)">
              Questionnaire → readiness score → a remediation list sorted
              worst-first, each linked to the module that fixes it.
            </p>
          </div>
          <ArrowRight
            aria-hidden
            className="mt-1 h-4 w-4 flex-none text-(--accent-2) transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      ) : null}

      {pack.curriculum.sections.some((s) => s.skills && s.skills.length > 0) ? (
        <Link
          href={`/${pack.config.id}/skills`}
          className="group flex items-start gap-3 rounded-lg border border-(--border) bg-(--panel-2) p-4 no-underline shadow-sm transition-colors hover:border-(--accent)"
        >
          <ListChecks
            aria-hidden
            className="mt-0.5 h-5 w-5 flex-none text-(--accent)"
          />
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-(--ink)">
              Skills matrix
            </h2>
            <p className="mt-0.5 text-sm text-(--muted)">
              The competencies each module builds — rate your confidence and
              jump to the lesson that builds each one.
            </p>
          </div>
          <ArrowRight
            aria-hidden
            className="mt-1 h-4 w-4 flex-none text-(--accent-2) transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      ) : null}

      {pack.config.prerequisites ? (
        <BeforeYouBegin
          packId={pack.config.id}
          prerequisites={pack.config.prerequisites}
        />
      ) : null}

      <JourneyJumper />

      <section id="progress" aria-label="Progress overview" className="scroll-mt-24">
        <ProgressCharts />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px] lg:items-start">
        <div className="flex flex-col gap-6 min-w-0">
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
        </div>
        <aside aria-label="Your progress" className="lg:sticky lg:top-6">
          <StatsPanel />
        </aside>
      </div>
    </Container>
  );
}
