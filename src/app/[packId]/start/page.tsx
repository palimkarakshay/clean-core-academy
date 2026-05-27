import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPack, ALL_PACK_IDS } from "@/content/pack-registry";
import { Breadcrumbs } from "@/components/primitives/Breadcrumbs";
import { journeyTrail } from "@/lib/nav-trail";
import { Container } from "@/components/ui/Container";
import { StartHere } from "@/components/start/StartHere";

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
    description: `Two quick questions and you're into ${pack.config.name}.`,
  };
}

export default async function StartPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { packId } = await params;
  const pack = getPack(packId);
  if (!pack) notFound();

  return (
    <Container width="narrow" className="flex flex-col gap-6 py-2">
      <Breadcrumbs trail={journeyTrail(pack, { label: "Start here" })} />
      <header className="flex flex-col gap-2">
        <p className="font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.18em] text-(--muted)">
          {pack.config.name}
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-semibold text-(--ink)">
          Start here
        </h1>
        <p className="text-sm text-(--muted)">
          Two quick questions and you&rsquo;re in — no scrolling through a wall
          of modules to figure out where to begin.
        </p>
      </header>
      <StartHere packId={pack.config.id} />
    </Container>
  );
}
