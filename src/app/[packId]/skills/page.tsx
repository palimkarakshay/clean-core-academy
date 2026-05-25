import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ALL_PACK_IDS, getPack } from "@/content/pack-registry";
import { Container } from "@/components/ui/Container";
import { SkillsMatrix, type MatrixModule } from "@/components/skills/SkillsMatrix";

type Params = { packId: string };

function modulesWithSkills(packId: string): MatrixModule[] {
  const pack = getPack(packId);
  if (!pack) return [];
  return pack.curriculum.sections
    .filter((s) => s.skills && s.skills.length > 0)
    .map((s) => ({
      sectionId: s.id,
      n: s.n,
      title: s.title,
      skills: s.skills ?? [],
    }));
}

export function generateStaticParams(): Params[] {
  return ALL_PACK_IDS.filter((id) => modulesWithSkills(id).length > 0).map(
    (packId) => ({ packId })
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { packId } = await params;
  const pack = getPack(packId);
  if (!pack) return { title: "Skills matrix not found" };
  return {
    title: "Skills matrix",
    description: `The competencies each module of ${pack.config.name} builds — rate your confidence in each.`,
  };
}

export default async function SkillsPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { packId } = await params;
  const pack = getPack(packId);
  const modules = modulesWithSkills(packId);
  if (!pack || modules.length === 0) notFound();

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
          Skills matrix
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-(--ink) md:text-3xl">
          What each module builds
        </h1>
        <p className="max-w-3xl text-sm text-(--muted)">
          Per-module competencies for this course. Rate your confidence in each
          and jump straight to the lesson that builds it — a living map of where
          you are on the road to Clean Core.
        </p>
      </header>
      <SkillsMatrix packId={packId} modules={modules} />
    </Container>
  );
}
