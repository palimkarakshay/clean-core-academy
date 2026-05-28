/* ------------------------------------------------------------------
   Lesson-flow block model.

   A module (Section) is rendered as one linear, scrolling sequence of
   blocks grouped into four phases — Learn → Practice → Test → Apply.
   Blocks are *derived* from the existing curriculum shape at read time
   (see derive-flow.ts); the curriculum data is never re-authored. This
   file is pure types + the phase vocabulary, no React.
------------------------------------------------------------------ */

import type {
  AppliedExperience,
  Bloom,
  CodeExercise,
  Flashcard,
  Lesson,
  Question,
} from "@/content/curriculum-types";

/** The four-step intra-module spine. Order is meaningful. */
export type BlockPhase = "learn" | "practice" | "test" | "apply";

export const PHASE_ORDER: BlockPhase[] = [
  "learn",
  "practice",
  "test",
  "apply",
];

export interface PhaseInfo {
  title: string;
  /** One-line "what you do in this phase" shown under the divider. */
  subtitle: string;
}

export const PHASE_META: Record<BlockPhase, PhaseInfo> = {
  learn: { title: "Learn", subtitle: "Read the ideas, one chunk at a time." },
  practice: {
    title: "Practice",
    subtitle: "Quick checks and flashcards to make it stick.",
  },
  test: { title: "Test", subtitle: "Prove it with the module check." },
  apply: { title: "Apply", subtitle: "Do something real with what you learned." },
};

interface BlockBase {
  /** Stable, deterministic id — scroll anchor + React key + progress key. */
  id: string;
  phase: BlockPhase;
}

/** One concept's lesson, rendered as a single self-contained chunk. */
export interface LessonChunkBlock extends BlockBase {
  kind: "lesson-chunk";
  conceptId: string;
  code: string;
  title: string;
  bloom?: Bloom;
  lesson: Lesson;
}

/** Section-level flashcard deck (derived from concept key-points). */
export interface FlashcardGridBlock extends BlockBase {
  kind: "flashcard-grid";
  cards: Flashcard[];
}

/** Inline, immediate-feedback knowledge check for one concept. */
export interface KnowledgeCheckBlock extends BlockBase {
  kind: "knowledge-check";
  conceptId: string;
  title: string;
  questions: Question[];
}

/** Hands-on code exercise (omitted from the SCORM flow). */
export interface CodeExerciseBlock extends BlockBase {
  kind: "code-exercise";
  conceptId: string;
  exercise: CodeExercise;
}

/** Gate + launch card for the end-of-module test. Carries the questions
 *  so the single-page (SCORM) player can run the test in place. */
export interface SectionTestBlock extends BlockBase {
  kind: "section-test";
  sectionId: string;
  questionCount: number;
  passPct: number;
  questions: Question[];
}

/** Real-world application tasks that close the loop. */
export interface AppliedBlock extends BlockBase {
  kind: "applied";
  items: AppliedExperience[];
}

export type LessonBlock =
  | LessonChunkBlock
  | FlashcardGridBlock
  | KnowledgeCheckBlock
  | CodeExerciseBlock
  | SectionTestBlock
  | AppliedBlock;

/** The concept ids whose lessons must be read before the test unlocks. */
export function learnConceptIds(blocks: LessonBlock[]): string[] {
  return blocks
    .filter((b): b is LessonChunkBlock => b.kind === "lesson-chunk")
    .map((b) => b.conceptId);
}
