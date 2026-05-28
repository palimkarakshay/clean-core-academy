/* ------------------------------------------------------------------
   Derive a linear Learn → Practice → Test → Apply flow from a Section.

   Pure transform — no React, no side effects. Runs at render time in
   the (server) section page and passes a serializable LessonBlock[] to
   the client renderer. Reuses the established derivation helpers
   (getSectionFlashcards, getAppliedExperiences) rather than duplicating
   their logic, so the flow stays in sync with the rest of the app.
------------------------------------------------------------------ */

import type { Section } from "@/content/curriculum-types";
import type { LessonBlock } from "./blocks";
import { getSectionFlashcards } from "@/content/curriculum-loader";
import { getAppliedExperiences } from "@/lib/applied-experience";

export interface DeriveFlowOptions {
  /** When true, omit code-exercise blocks (the SCORM bundle has no
   *  serverless linter — see scripts/build-scorm.mjs). */
  scorm?: boolean;
}

const DEFAULT_PASS_PCT = 0.7;

export function deriveSectionFlow(
  section: Section,
  opts: DeriveFlowOptions = {}
): LessonBlock[] {
  const blocks: LessonBlock[] = [];
  const readable = section.concepts.filter((c) => c.lesson);

  // ---- LEARN: one chunk per concept, in curriculum order. ----
  for (const c of readable) {
    if (!c.lesson) continue;
    blocks.push({
      id: `${c.id}:lesson`,
      phase: "learn",
      kind: "lesson-chunk",
      conceptId: c.id,
      code: c.code,
      title: c.title,
      bloom: c.bloom,
      lesson: c.lesson,
    });
  }

  // ---- PRACTICE: flashcards, then a knowledge check per quiz, then
  //      any hands-on exercises (unless building for SCORM). ----
  const flashcards = getSectionFlashcards(section);
  if (flashcards.length > 0) {
    blocks.push({
      id: `${section.id}:flashcards`,
      phase: "practice",
      kind: "flashcard-grid",
      cards: flashcards,
    });
  }
  for (const c of readable) {
    if (c.quiz && c.quiz.questions.length > 0) {
      blocks.push({
        id: `${c.id}:check`,
        phase: "practice",
        kind: "knowledge-check",
        conceptId: c.id,
        title: c.title,
        questions: c.quiz.questions,
      });
    }
  }
  if (!opts.scorm) {
    for (const c of section.concepts) {
      if (c.exercise) {
        blocks.push({
          id: `${c.id}:exercise`,
          phase: "practice",
          kind: "code-exercise",
          conceptId: c.id,
          exercise: c.exercise,
        });
      }
    }
  }

  // ---- TEST: the gated end-of-module check. ----
  if (section.sectionTest && section.sectionTest.questions.length > 0) {
    blocks.push({
      id: `${section.id}:test`,
      phase: "test",
      kind: "section-test",
      sectionId: section.id,
      questionCount: section.sectionTest.questions.length,
      passPct: section.sectionTest.passPct ?? DEFAULT_PASS_PCT,
      questions: section.sectionTest.questions,
    });
  }

  // ---- APPLY: real-world tasks (authored or generated spine). ----
  const applied = getAppliedExperiences(section);
  if (applied.length > 0) {
    blocks.push({
      id: `${section.id}:applied`,
      phase: "apply",
      kind: "applied",
      items: applied,
    });
  }

  return blocks;
}
