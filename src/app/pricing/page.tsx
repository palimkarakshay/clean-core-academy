import type { Metadata } from "next";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { BRAND } from "@/lib/brand";
import { getPack } from "@/content/pack-registry";

export const metadata: Metadata = {
  title: `Pricing — ${BRAND.name}`,
  description: `Plans for ${BRAND.name}. Free and fully open during the demo — every module, the readiness audit, the skills matrix and the live abaplint exercises, no sign-up and no paywall.`,
};

/* ------------------------------------------------------------------
   Pricing page.

   The whole academy is FREE and FULLY OPEN right now — this page shows
   the *planned* launch tiers as a preview, with a banner making clear
   nothing is gated today. No paywall, no sign-up: the demo stays open.
   Numbers mirror the marketing site (lumivara) so the two don't drift;
   tune them there and here together before commercial launch.
------------------------------------------------------------------ */

interface Tier {
  name: string;
  price: string;
  unit: string;
  tagline: string;
  features: string[];
  featured?: boolean;
}

const packId = "clean-core-academy";

function moduleCount(): number {
  const pack = getPack(packId);
  return pack?.curriculum.sections.length ?? 17;
}

const tiers: Tier[] = [
  {
    name: "Demo",
    price: "Free",
    unit: "open now",
    tagline: "The whole academy, open to everyone.",
    features: [
      `All ${moduleCount()} modules — developer + business tracks`,
      "Readiness self-audit & skills matrix",
      "Live abaplint code-quality exercises",
      "Practice exam + module checks",
      "No sign-up, no paywall, progress saved in your browser",
    ],
    featured: true,
  },
  {
    name: "Individual",
    price: "$149",
    unit: "per seat · at launch",
    tagline: "For a single developer, post-launch.",
    features: [
      "Everything in the demo",
      "Saved progress across devices (once accounts ship)",
      "Completion record for your skills matrix",
      "Content updates as SAP evolves",
    ],
  },
  {
    name: "Team & Site",
    price: "from $2,500",
    unit: "volume · at launch",
    tagline: "Upskill the whole squad on Clean Core.",
    features: [
      "Volume seats for the whole team",
      "Team progress & skills-matrix roll-up",
      "Onboarding-track presets per role",
      "Priced with a Lumivara modernization engagement",
    ],
  },
];

export default function PricingPage() {
  return (
    <Container width="wide" className="flex flex-col gap-8 py-4">
      <header className="flex flex-col gap-2">
        <p className="font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.18em] text-(--muted)">
          Pricing
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-semibold text-(--ink)">
          Free and open while we build
        </h1>
        <p className="text-sm text-(--muted)">
          A preview of how {BRAND.name} will be priced at launch. Right now every
          part of it is free.
        </p>
      </header>

      {/* Free-demo banner — the headline message. */}
      <div className="flex items-start gap-3 rounded-lg border border-(--accent) bg-(--panel-2) p-4 shadow-sm">
        <Sparkles aria-hidden className="mt-0.5 h-5 w-5 flex-none text-(--accent)" />
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-(--ink)">
            The entire academy is free and fully open today
          </h2>
          <p className="mt-1 text-sm text-(--muted)">
            No account, no payment, nothing locked. Every module, the readiness
            audit, the skills matrix and the live abaplint exercises are open
            right now. The tiers below are the planned launch pricing — shown so
            you know what to expect, not a paywall.
          </p>
          <Link
            href={`/${packId}`}
            className="mt-3 inline-block text-sm font-semibold text-(--accent) underline hover:no-underline"
          >
            Start the course — free →
          </Link>
        </div>
      </div>

      <section aria-label="Plans" className="grid gap-4 md:grid-cols-3">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={
              "flex flex-col gap-4 rounded-lg border bg-(--panel-2) p-5 shadow-sm " +
              (t.featured
                ? "border-(--accent) ring-1 ring-(--accent)"
                : "border-(--border)")
            }
          >
            <div className="flex flex-col gap-1">
              {t.featured ? (
                <span className="inline-flex w-fit items-center rounded-full bg-(--accent) px-2.5 py-0.5 text-xs font-semibold text-(--panel)">
                  Open now
                </span>
              ) : null}
              <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-(--ink)">
                {t.name}
              </h3>
              <p className="text-sm text-(--muted)">{t.tagline}</p>
            </div>
            <p className="flex items-baseline gap-1.5">
              <span className="font-[family-name:var(--font-display)] text-2xl font-semibold text-(--ink)">
                {t.price}
              </span>
              <span className="text-xs text-(--muted)">{t.unit}</span>
            </p>
            <ul className="flex flex-1 flex-col gap-2 text-sm text-(--ink)">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check aria-hidden className="mt-0.5 h-4 w-4 flex-none text-(--accent)" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <p className="text-xs text-(--muted)">
        Launch prices are indicative and may change before accounts and billing
        ship. Looking for hands-on modernization help?{" "}
        <a
          href="https://lumivara.ca/pricing"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:no-underline"
        >
          See Lumivara&apos;s services and pricing
        </a>
        .
      </p>
    </Container>
  );
}
