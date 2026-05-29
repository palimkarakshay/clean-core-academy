/* ------------------------------------------------------------------
   Adaptive recommendation — picks the highest-priority next action.

   Priority order:
     1. Drill: any unlocked-section concept currently at a level
        flagged `isUnderwhelm` (e.g. "Below 60%" by default).
     2. Section-test: an unlocked section where every authored concept
        is at a level flagged `countsAsMastered` AND a section-test
        exists AND it hasn't been passed yet.
     3. Continue: earliest unlocked-incomplete section's first authored,
        not-yet-mastered concept (lesson-read -> quiz, else read lesson).
     4. Done: every authored section is complete.

   Two entry points:
     - `recommendForPack(p, pack, copy, packId)` — pack-aware, returns
        URL hrefs prefixed with /<packId>/. Used by the picker-era
        client components.
     - `recommend(p)` — back-compat wrapper that uses the env-var
        default pack + module-level singletons.
------------------------------------------------------------------ */

import { CURRICULUM } from "@/content/curriculum";
import type { Section } from "@/content/curriculum-types";
import { copy as defaultCopy } from "@/lib/site-config";
import { countsAsMastered, isUnderwhelm } from "./progress";
import type { Mastery, Progress } from "./progress-types";
import type { ContentPack, PackCopy } from "@/content/pack-types";

/* Read-only views of the progress snapshot. The recommendation engine
   runs inside render (useMemo), so it must NEVER mutate the store's
   snapshot — using ensure*() here would lazily insert empty records into
   the live object during render. These helpers read with safe defaults. */
function masteryOf(p: Progress, conceptId: string): Mastery {
  return p.concept[conceptId]?.mastery ?? 0;
}
function lessonReadOf(p: Progress, conceptId: string): boolean {
  return p.concept[conceptId]?.lessonRead ?? false;
}
function sectionCompleteOf(p: Progress, sectionId: string): boolean {
  return p.section[sectionId]?.complete ?? false;
}
function sectionPassedOf(p: Progress, section: Section): boolean {
  const attempts = p.section[section.id]?.testAttempts ?? [];
  const last = attempts[attempts.length - 1];
  if (!last) return false;
  const passPct = section.sectionTest?.passPct ?? 0.7;
  return last.total > 0 && last.score / last.total >= passPct;
}

export type Recommendation =
  | { kind: "drill"; section: Section; conceptId: string; href: string; why: string }
  | { kind: "section-test"; section: Section; href: string; why: string }
  | { kind: "lesson"; section: Section; conceptId: string; href: string; why: string }
  | { kind: "quiz"; section: Section; conceptId: string; href: string; why: string }
  | { kind: "done"; why: string };

export function recommendForPack(
  p: Progress,
  pack: ContentPack,
  copy: Required<PackCopy>,
  packId: string
): Recommendation {
  // 1. Drill — any concept landed on an "underwhelm" level. We no
  // longer gate this on `sp.unlocked` because the UI treats every
  // module as accessible; the recommendation engine should mirror
  // that and recommend the highest-value drill across the curriculum.
  for (const section of pack.curriculum.sections) {
    for (const c of section.concepts) {
      if (!c.lesson || !c.quiz) continue;
      if (isUnderwhelm(masteryOf(p, c.id))) {
        return {
          kind: "drill",
          section,
          conceptId: c.id,
          href: `/${packId}/concept/${section.id}/${c.id}`,
          why: `${c.code} ${c.title} is ${copy.belowPassGateLabel}. Re-read the lesson and re-take.`,
        };
      }
    }
  }

  // 2. Section-test ready — every authored concept counts as mastered.
  for (const section of pack.curriculum.sections) {
    if (!section.sectionTest) continue;
    const authored = section.concepts.filter((c) => c.lesson && c.quiz);
    if (authored.length === 0) continue;
    const allMastered = authored.every((c) =>
      countsAsMastered(masteryOf(p, c.id))
    );
    if (allMastered && !sectionPassedOf(p, section)) {
      return {
        kind: "section-test",
        section,
        href: `/${packId}/section/${section.id}/test`,
        why: `Every authored concept in "${section.title}" is at a mastered level. Take the ${copy.sectionTestSingular.toLowerCase()} to lock it in.`,
      };
    }
  }

  // 3. Continue — earliest incomplete section's first not-yet-mastered
  // authored concept.
  for (const section of pack.curriculum.sections) {
    if (sectionCompleteOf(p, section.id)) continue;
    for (const c of section.concepts) {
      if (!c.lesson || !c.quiz) continue;
      if (countsAsMastered(masteryOf(p, c.id))) continue;
      if (!lessonReadOf(p, c.id)) {
        return {
          kind: "lesson",
          section,
          conceptId: c.id,
          href: `/${packId}/concept/${section.id}/${c.id}`,
          why: `Read the next concept lesson: ${c.code} ${c.title}.`,
        };
      }
      return {
        kind: "quiz",
        section,
        conceptId: c.id,
        href: `/${packId}/concept/${section.id}/${c.id}/quiz`,
        why: `You've read ${c.code}. Take the quiz to lock it in.`,
      };
    }
  }

  return {
    kind: "done",
    why: copy.recoDoneMessage,
  };
}

/** Back-compat: env-var-default-pack scoped recommend(). */
export function recommend(p: Progress): Recommendation {
  // Lazily reconstruct a pack-shaped object from the env-var default
  // CURRICULUM. This wrapper exists so legacy single-pack callers and
  // tests don't break.
  const fakePack: ContentPack = {
    curriculum: CURRICULUM,
    // The recommend logic only uses pack.curriculum and packId for
    // hrefs; supply a minimal config to satisfy the type.
    config: { id: "" } as ContentPack["config"],
  };
  return recommendForPack(p, fakePack, defaultCopy, "");
}
