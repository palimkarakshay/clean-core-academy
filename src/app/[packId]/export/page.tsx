import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  GraduationCap,
  MonitorPlay,
  Package,
  Globe2,
  CheckCircle2,
} from "lucide-react";
import { getPack, ALL_PACK_IDS } from "@/content/pack-registry";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/primitives/Breadcrumbs";
import { journeyTrail } from "@/lib/nav-trail";

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
  if (!pack) return { title: "SCORM export" };
  return {
    title: "SCORM export",
    description: `Deploy ${pack.config.name} in your LMS as a SCORM 1.2 package.`,
  };
}

function Cmd({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-(--panel-2) px-1.5 py-0.5 font-mono text-[0.85em] text-(--accent-2)">
      {children}
    </code>
  );
}

/**
 * Facilitator-facing export surface — the "SME / L&D lead view". Learners
 * never need this; it gives the people who *roll the course out* a clear
 * path to a SCORM 1.2 package they can import into any LMS, plus an
 * in-browser preview of exactly how it behaves inside an LMS frame.
 */
export default async function ScormExportPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { packId } = await params;
  const pack = getPack(packId);
  if (!pack) notFound();

  return (
    <Container width="wide" className="py-2">
      <Breadcrumbs trail={journeyTrail(pack, { label: "SCORM export" })} />

      <header className="mb-6 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-(--accent-2)">
          <GraduationCap aria-hidden className="h-4 w-4" />
          For L&amp;D &amp; SME leads
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-(--ink) md:text-3xl">
          Deploy this course in your LMS
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-(--muted)">
          {pack.config.name} can be exported as a self-contained{" "}
          <strong className="text-(--ink)">SCORM 1.2</strong> package and
          imported into any conformant LMS (SuccessFactors, Cornerstone, Moodle,
          SCORM Cloud, …). The package reports score, completion, and a resume
          bookmark back to the LMS automatically — a learner can stop on one
          device and pick up where they left off on another.
        </p>
      </header>

      {/* Preview — the only immediately-clickable action; the others are
          one-command builds an operator runs. */}
      <section
        aria-labelledby="preview-heading"
        className="mb-6 rounded-xl border border-(--border) bg-(--panel) p-5 shadow-sm"
      >
        <h2
          id="preview-heading"
          className="flex items-center gap-2 text-base font-semibold text-(--ink)"
        >
          <MonitorPlay aria-hidden className="h-5 w-5 text-(--accent)" />
          Preview the SCORM player
        </h2>
        <p className="mt-1 text-sm text-(--muted)">
          See the single-page player the SCORM package launches — the whole
          course as one scrolling experience, with no route navigation, exactly
          as it renders inside an LMS iframe.
        </p>
        <Link
          href={`/${pack.config.id}/scorm`}
          className="group mt-3 inline-flex items-center gap-1.5 rounded-full bg-(--accent) px-4 py-2 text-sm font-semibold text-white no-underline shadow-sm transition-opacity hover:opacity-90"
        >
          Open the player preview
          <ArrowRight
            aria-hidden
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </section>

      {/* The two build options. */}
      <section
        aria-label="Package options"
        className="mb-6 grid gap-4 md:grid-cols-2"
      >
        <div className="flex flex-col rounded-xl border border-(--accent)/40 bg-(--panel-2) p-5">
          <div className="flex items-center gap-2">
            <Package aria-hidden className="h-5 w-5 text-(--accent)" />
            <h2 className="text-base font-semibold text-(--ink)">
              Self-contained package
            </h2>
            <span className="ml-auto rounded-full border border-(--accent-2)/40 bg-(--accent-2)/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-(--accent-2)">
              Recommended
            </span>
          </div>
          <p className="mt-2 flex-1 text-sm text-(--muted)">
            Ships the whole course inside the package, so it runs fully offline
            inside the LMS with no dependency on this website and no security
            trade-off. Build it with:
          </p>
          <p className="mt-3">
            <Cmd>npm run build:scorm</Cmd>
          </p>
          <p className="mt-2 text-xs text-(--muted)">
            Produces <Cmd>dist/scorm/{pack.config.id}-scorm12.zip</Cmd>. Import
            that zip into your LMS.
          </p>
        </div>

        <div className="flex flex-col rounded-xl border border-(--border) bg-(--panel-2) p-5">
          <div className="flex items-center gap-2">
            <Globe2 aria-hidden className="h-5 w-5 text-(--accent-2)" />
            <h2 className="text-base font-semibold text-(--ink)">
              Lightweight embed package
            </h2>
          </div>
          <p className="mt-2 flex-1 text-sm text-(--muted)">
            A tiny package that frames this live deployment. Always serves the
            latest content, but the learner needs network access and the site
            must permit framing. Build it with:
          </p>
          <p className="mt-3">
            <Cmd>npm run build:scorm:embed</Cmd>
          </p>
          <p className="mt-2 text-xs text-(--muted)">
            Requires <Cmd>ALLOW_LMS_EMBED=1</Cmd> on this deployment (off by
            default to keep the public site clickjacking-hardened). Prefer the
            self-contained package unless you specifically need always-fresh
            content.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="reports-heading"
        className="rounded-xl border border-(--border) bg-(--panel) p-5"
      >
        <h2
          id="reports-heading"
          className="text-base font-semibold text-(--ink)"
        >
          What the LMS receives
        </h2>
        <ul className="mt-3 grid gap-2 text-sm text-(--muted) sm:grid-cols-2">
          {[
            "Score — percent of modules passed (cmi.core.score.raw).",
            "Completion / pass status across the whole course.",
            "A resume bookmark, so a new session reopens the same module.",
            "Cross-device resume via the LMS suspend_data (no local storage needed).",
          ].map((line) => (
            <li key={line} className="flex items-start gap-2">
              <CheckCircle2
                aria-hidden
                className="mt-0.5 h-4 w-4 flex-none text-(--accent)"
              />
              {line}
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
