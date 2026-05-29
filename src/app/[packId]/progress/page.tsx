import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ALL_PACK_IDS, getPack } from "@/content/pack-registry";
import { Container } from "@/components/ui/Container";
import { ContinuePanel } from "@/components/dashboard/ContinuePanel";
import { ProgressCharts } from "@/components/dashboard/ProgressCharts";

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
  if (!pack) return { title: "Progress" };
  return {
    title: "Your progress",
    description: `Track how far you are through ${pack.config.name} — mastery, modules complete, and what to do next.`,
  };
}

export default async function ProgressPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { packId } = await params;
  const pack = getPack(packId);
  if (!pack) notFound();

  return (
    <Container width="wide" className="flex flex-col gap-6 py-2">
      <header className="flex flex-col gap-2">
        <Link
          href={`/${packId}`}
          className="inline-flex w-fit items-center gap-1 text-xs text-(--muted) hover:text-(--ink)"
        >
          <ArrowLeft aria-hidden className="h-3.5 w-3.5" />
          Back to {pack.config.name}
        </Link>
        <p className="font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.18em] text-(--muted)">
          Progress
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-(--ink) md:text-3xl">
          Where you are
        </h1>
        <p className="max-w-3xl text-sm text-(--muted)">
          Your mastery across the whole course, which modules are done, an
          estimate of the time left, and one click to pick up where you left
          off. Saved in your browser, so it&rsquo;s here every time you return.
        </p>
      </header>

      <ContinuePanel />
      <ProgressCharts />
    </Container>
  );
}
