import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ALL_PACK_IDS, getPack } from "@/content/pack-registry";
import { Container } from "@/components/ui/Container";
import { ReadinessAuditView } from "@/components/audit/ReadinessAuditView";

type Params = { packId: string };

export function generateStaticParams(): Params[] {
  return ALL_PACK_IDS.filter((id) => getPack(id)?.curriculum.readinessAudit).map(
    (packId) => ({ packId })
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { packId } = await params;
  const audit = getPack(packId)?.curriculum.readinessAudit;
  if (!audit) return { title: "Self-audit not found" };
  return { title: audit.title, description: audit.intro.slice(0, 155) };
}

export default async function AuditPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { packId } = await params;
  const pack = getPack(packId);
  const audit = pack?.curriculum.readinessAudit;
  if (!pack || !audit) notFound();

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
          Self-audit
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-(--ink) md:text-3xl">
          {audit.title}
        </h1>
        <p className="max-w-3xl text-sm text-(--muted)">{audit.intro}</p>
      </header>
      <ReadinessAuditView audit={audit} packId={packId} />
    </Container>
  );
}
