import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPack, ALL_PACK_IDS } from "@/content/pack-registry";
import { deriveSectionFlow } from "@/lib/lesson-flow/derive-flow";
import { Container } from "@/components/ui/Container";
import { ScormPlayer, type ScormModule } from "@/components/scorm/ScormPlayer";
import { copyFor } from "@/lib/pack-helpers";

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
  return { title: pack ? pack.config.name : "Course" };
}

/**
 * Single-page course player — the launch point of the self-contained
 * SCORM package. The whole course is one document; navigation between
 * the module list and a module happens via client state (see
 * ScormPlayer), so it runs at any path inside an LMS iframe.
 */
export default async function ScormPlayerPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { packId } = await params;
  const pack = getPack(packId);
  if (!pack) notFound();
  const copy = copyFor(pack);

  const modules: ScormModule[] = pack.curriculum.sections.map((section) => ({
    section,
    blocks: deriveSectionFlow(section, { scorm: true }),
  }));

  return (
    <Container width="wide" className="py-2">
      <ScormPlayer modules={modules} testLabel={copy.sectionTestSingular} />
    </Container>
  );
}
