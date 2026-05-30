import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ALL_PACK_IDS, getPack } from "@/content/pack-registry";
import { TrackFilter } from "@/components/dashboard/TrackFilter";
import { BeforeYouBegin } from "@/components/dashboard/BeforeYouBegin";
import { ProgressRail } from "@/components/dashboard/ProgressRail";
import { WhatYoullLearn } from "@/components/dashboard/WhatYoullLearn";
import { StartSeenMarker } from "@/components/dashboard/StartSeenMarker";
import { JourneyArt } from "@/components/dashboard/JourneyArt";
import { CourseAtAGlance } from "@/components/dashboard/CourseAtAGlance";
import { getSectionMeta } from "@/content/curriculum-loader";

type Params = { packId: string };

export function generateStaticParams(): Params[] {
  return ALL_PACK_IDS.map((packId) => ({ packId }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { packId } = await params;
  const pack = getPack(packId);
  if (!pack) return { title: "Start here" };
  return {
    title: "Start here",
    description: `Set your role, check whether ${pack.config.name} is right for you, and see what you'll learn — the things you set once.`,
  };
}

/** A labelled block in the setup flow. */
function SetupSection({
  step,
  title,
  description,
  children,
}: {
  step: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3" aria-label={title}>
      <div className="flex flex-col gap-0.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--accent-2)">
          {step}
        </span>
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-(--ink)">
          {title}
        </h2>
        <p className="text-sm text-(--muted)">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default async function StartPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { packId } = await params;
  const pack = getPack(packId);
  if (!pack) notFound();

  const totalMinutes = pack.curriculum.sections.reduce(
    (n, s) => n + (getSectionMeta(s.id)?.timeMinutes ?? 0),
    0
  );

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 py-2 lg:max-w-6xl xl:max-w-[84rem]">
      <StartSeenMarker packId={packId} />
      <Link
        href={`/${packId}`}
        className="inline-flex w-fit items-center gap-1 text-xs text-(--muted) hover:text-(--ink)"
      >
        <ArrowLeft aria-hidden className="h-3.5 w-3.5" />
        Back to {pack.config.name}
      </Link>
      <header className="flex items-center justify-between gap-4 rounded-xl border border-(--border) bg-gradient-to-br from-(--panel-2) to-(--panel) p-6 md:p-8">
        <div className="flex flex-col gap-2">
          <p className="font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.18em] text-(--muted)">
            Get set up
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-(--ink) md:text-3xl">
            Start here
          </h1>
          <p className="max-w-prose text-sm text-(--muted)">
            The things you set once: pick the role you're learning as, check the
            course is a fit, and see what you'll walk away able to do. Your
            progress stays pinned on the right as you go.
          </p>
        </div>
        <JourneyArt className="hidden h-16 w-28 flex-none sm:block md:h-24 md:w-40" />
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="flex min-w-0 flex-col gap-8">
          <SetupSection
            step="At a glance"
            title="What's in this course"
            description="The full scope, before you commit time — modules, lessons, hands-on exercises, and how long it runs."
          >
            <CourseAtAGlance
              curriculum={pack.curriculum}
              totalMinutes={totalMinutes}
            />
          </SetupSection>

          <SetupSection
            step="Step 1"
            title="Your role"
            description="One course, many lenses. Pick the role you're learning as — it tailors which modules you see and survives across visits."
          >
            <TrackFilter />
          </SetupSection>

          <SetupSection
            step="Step 2"
            title="What you'll learn"
            description="The concrete outcomes for your role — pick a different role above and this list re-tailors."
          >
            <WhatYoullLearn />
          </SetupSection>

          {pack.config.prerequisites ? (
            <SetupSection
              step="Step 3"
              title="Is this course right for you?"
              description="A quick self-check of what this course assumes — and when it isn't the right fit."
            >
              <BeforeYouBegin
                packId={packId}
                prerequisites={pack.config.prerequisites}
              />
            </SetupSection>
          ) : null}
        </div>

        <aside
          aria-label="Your progress"
          className="lg:sticky lg:top-6"
        >
          <ProgressRail />
        </aside>
      </div>
    </div>
  );
}
