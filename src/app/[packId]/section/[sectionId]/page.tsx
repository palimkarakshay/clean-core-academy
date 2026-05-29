import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPack, ALL_PACK_IDS } from "@/content/pack-registry";
import {
  formatMinutes,
  getAdjacentSectionsFrom,
  getSectionFrom,
  getSectionMeta,
} from "@/content/curriculum-loader";
import { ArrowLeft, ArrowRight, ChevronUp, Gamepad2 } from "lucide-react";
import { Breadcrumbs } from "@/components/primitives/Breadcrumbs";
import { NumberedJumper } from "@/components/primitives/NumberedJumper";
import { journeyTrail } from "@/lib/nav-trail";
import { GoalsPanel } from "@/components/section/GoalsPanel";
import { GamesPanel } from "@/components/section/GamesPanel";
import { LessonFlow } from "@/components/flow/LessonFlow";
import { deriveSectionFlow } from "@/lib/lesson-flow/derive-flow";
import { Container } from "@/components/ui/Container";
import { LastVisitTracker } from "@/components/layout/LastVisitTracker";
import { copyFor } from "@/lib/pack-helpers";

type Params = { packId: string; sectionId: string };

export function generateStaticParams(): Params[] {
  const out: Params[] = [];
  for (const packId of ALL_PACK_IDS) {
    const pack = getPack(packId);
    if (!pack) continue;
    for (const section of pack.curriculum.sections) {
      out.push({ packId, sectionId: section.id });
    }
  }
  return out;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { packId, sectionId } = await params;
  const pack = getPack(packId);
  if (!pack) return { title: "Section not found" };
  const section = getSectionFrom(pack.curriculum, sectionId);
  if (!section) return { title: "Section not found" };
  return {
    title: `Module ${section.n}: ${section.title}`,
    description: section.blurb,
  };
}

export default async function SectionPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { packId, sectionId } = await params;
  const pack = getPack(packId);
  if (!pack) notFound();
  const section = getSectionFrom(pack.curriculum, sectionId);
  if (!section) notFound();

  const meta = getSectionMeta(sectionId);
  const copy = copyFor(pack);
  const blocks = deriveSectionFlow(section, {
    scorm: process.env.NEXT_PUBLIC_SCORM === "1",
  });

  const goalsPanel = (
    <GoalsPanel section={section} meta={meta} formatMinutes={formatMinutes} />
  );

  const { prev: prevSection, next: nextSection } = getAdjacentSectionsFrom(
    pack.curriculum,
    sectionId
  );
  const sectionIndex =
    pack.curriculum.sections.findIndex((s) => s.id === sectionId) + 1;
  const totalSections = pack.curriculum.sections.length;

  return (
    <Container as="article" width="wide" className="py-2">
      <LastVisitTracker
        packId={pack.config.id}
        packName={pack.config.name}
        sectionId={section.id}
        sectionTitle={section.title}
        href={`/${pack.config.id}/section/${section.id}`}
      />
      <Breadcrumbs trail={journeyTrail(pack, { label: section.title })} />
      <nav
        aria-label="Module navigation"
        className="mb-4 flex flex-wrap items-center gap-3 rounded-md border border-(--border) bg-(--panel-2) p-3 text-xs"
      >
        <span className="text-(--muted)">
          Module <span className="font-mono">{sectionIndex}</span> of{" "}
          <span className="font-mono">{totalSections}</span>
        </span>
        <NumberedJumper
          ariaLabel="Jump to module"
          activeIndex={sectionIndex - 1}
          items={pack.curriculum.sections.map((s) => ({
            href: `/${packId}/section/${s.id}`,
            label: `Module ${s.n}: ${s.title}`,
          }))}
        />
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {prevSection ? (
            <Link
              href={`/${packId}/section/${prevSection.id}`}
              aria-label={`Previous module: ${prevSection.title}`}
              className="inline-flex min-h-9 items-center gap-1 rounded-md border border-(--border) bg-(--panel) px-2 py-1 text-(--ink) no-underline hover:border-(--accent) hover:text-(--accent-2) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
            >
              <ArrowLeft aria-hidden className="h-3 w-3" />
              <span className="hidden md:inline">
                Module {prevSection.n}: {prevSection.title}
              </span>
              <span className="md:hidden">Prev module</span>
            </Link>
          ) : null}
          {nextSection ? (
            <Link
              href={`/${packId}/section/${nextSection.id}`}
              aria-label={`Next module: ${nextSection.title}`}
              className="inline-flex min-h-9 items-center gap-1 rounded-md border border-(--border) bg-(--panel) px-2 py-1 text-(--ink) no-underline hover:border-(--accent) hover:text-(--accent-2) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
            >
              <span className="hidden md:inline">
                Module {nextSection.n}: {nextSection.title}
              </span>
              <span className="md:hidden">Next module</span>
              <ArrowRight aria-hidden className="h-3 w-3" />
            </Link>
          ) : null}
          <Link
            href={`/${packId}`}
            aria-label={`Course overview: ${pack.config.name}`}
            className="inline-flex min-h-9 items-center gap-1 rounded-md border border-(--border) bg-(--panel) px-2 py-1 text-(--ink) no-underline hover:border-(--accent) hover:text-(--accent-2) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
          >
            <ChevronUp aria-hidden className="h-3 w-3" />
            Course
          </Link>
        </div>
      </nav>

      <LessonFlow
        packId={packId}
        section={section}
        blocks={blocks}
        testLabel={copy.sectionTestSingular}
        goalsPanel={goalsPanel}
      />

      {process.env.NEXT_PUBLIC_SCORM === "1" ? null : (
        <details className="mt-8 rounded-lg border border-dashed border-(--border) bg-(--panel-2)/50">
          <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm font-medium text-(--ink)">
            <Gamepad2 aria-hidden className="h-4 w-4 text-(--accent)" />
            Optional: practice with games
          </summary>
          <div className="border-t border-(--border) px-4 pb-4 pt-3">
            <GamesPanel packId={packId} sectionId={sectionId} />
          </div>
        </details>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
        <Link href={`/${packId}`} className="text-(--muted) hover:text-(--ink)">
          ← Back to {pack.config.name} course
        </Link>
        <span aria-hidden className="text-(--muted)">
          ·
        </span>
        <Link href="/" className="text-(--muted) hover:text-(--ink)">
          All courses
        </Link>
      </div>
    </Container>
  );
}
