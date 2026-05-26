/* ------------------------------------------------------------------
   Course-at-a-glance stats — a pure summary of a curriculum's scope
   (modules, lessons, hands-on exercises, quiz questions, mock exams,
   readiness checks). Used by the Start page's overview panel.
------------------------------------------------------------------ */

import type { Curriculum } from "@/content/curriculum-types";

export interface CourseStats {
  modules: number;
  /** Concepts that ship a lesson. */
  lessons: number;
  /** Concepts that ship an interactive code exercise. */
  exercises: number;
  /** Total quiz questions across every concept. */
  quizQuestions: number;
  mockExams: number;
  /** Questions in the readiness self-audit (0 if none). */
  auditQuestions: number;
  hasAudit: boolean;
}

export function courseStats(curriculum: Curriculum): CourseStats {
  const concepts = curriculum.sections.flatMap((s) => s.concepts);
  return {
    modules: curriculum.sections.length,
    lessons: concepts.filter((c) => c.lesson).length,
    exercises: concepts.filter((c) => c.exercise).length,
    quizQuestions: concepts.reduce(
      (n, c) => n + (c.quiz?.questions.length ?? 0),
      0
    ),
    mockExams: curriculum.mockExams?.length ?? 0,
    auditQuestions: curriculum.readinessAudit?.questions.length ?? 0,
    hasAudit: Boolean(curriculum.readinessAudit),
  };
}
