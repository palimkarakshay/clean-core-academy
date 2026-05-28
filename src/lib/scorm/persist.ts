/* ------------------------------------------------------------------
   Resume snapshot (de)serialization for SCORM suspend_data.

   SCORM 1.2 caps cmi.suspend_data at ~4096 chars, so we cannot dump the
   full Progress JSON (per-question answers/reasons blow past that on a
   completed course). Instead we encode a *compact* snapshot of only the
   touched items — enough to fully restore what the learner sees:
   completed modules, last test scores, lesson-read flags, mastery, the
   active module bookmark — and reconstruct a valid Progress from it.

   Detail we intentionally drop on resume: individual question answers,
   reasons, and mid-quiz "current attempt" state. Scores and pass/fail
   survive (isSectionPassed only reads the last attempt's score/total),
   so nothing the learner can see regresses.
------------------------------------------------------------------ */

import { newProgress } from "@/lib/progress";
import type {
  Progress,
  QuizAttempt,
  SectionProgress,
} from "@/lib/progress-types";

/** Wire format. Tuples + touched-only keys keep this well under 4 KB. */
interface CompactV1 {
  v: 1;
  /** [view, sectionId, conceptId, mockId] — the resume bookmark. */
  loc: [string, string | null, string | null, string | null];
  /** sectionId → [unlocked, complete, lastScore, lastTotal]. */
  sec: Record<string, [number, number, number, number]>;
  /** conceptId → [lessonRead, mastery]. */
  con: Record<string, [number, number]>;
  /** mockId → [lastScore, lastTotal]. */
  mok: Record<string, [number, number]>;
}

function last(attempts: QuizAttempt[]): { score: number; total: number } {
  const a = attempts[attempts.length - 1];
  return a ? { score: a.score, total: a.total } : { score: 0, total: 0 };
}

function synth(score: number, total: number): QuizAttempt {
  return {
    startedAt: 0,
    completedAt: 0,
    score: Number(score) || 0,
    total: Number(total) || 0,
    answers: {},
  };
}

/** Encode the resumable parts of Progress into a compact JSON string. */
export function serializeProgress(p: Progress): string {
  const sec: CompactV1["sec"] = {};
  for (const [id, s] of Object.entries(p.section)) {
    if (!s.unlocked && !s.complete && s.testAttempts.length === 0) continue;
    const { score, total } = last(s.testAttempts);
    sec[id] = [s.unlocked ? 1 : 0, s.complete ? 1 : 0, score, total];
  }

  const con: CompactV1["con"] = {};
  for (const [id, c] of Object.entries(p.concept)) {
    if (!c.lessonRead && c.mastery <= 0 && c.quizAttempts.length === 0) continue;
    con[id] = [c.lessonRead ? 1 : 0, c.mastery];
  }

  const mok: CompactV1["mok"] = {};
  for (const [id, m] of Object.entries(p.mock)) {
    if (m.attempts.length === 0) continue;
    const { score, total } = last(m.attempts);
    mok[id] = [score, total];
  }

  const loc = p.location ?? {
    view: "dashboard",
    sectionId: null,
    conceptId: null,
    mockId: null,
  };

  const payload: CompactV1 = {
    v: 1,
    loc: [loc.view, loc.sectionId, loc.conceptId, loc.mockId],
    sec,
    con,
    mok,
  };
  return JSON.stringify(payload);
}

/**
 * Rebuild a Progress from a compact snapshot. Returns null on empty,
 * malformed, or wrong-version input so the caller can fall back to a
 * fresh attempt. `firstSectionId` keeps the opening module unlocked.
 */
export function deserializeProgress(
  raw: string,
  firstSectionId?: string
): Progress | null {
  if (!raw) return null;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!data || typeof data !== "object") return null;
  const d = data as Partial<CompactV1>;
  if (d.v !== 1) return null;

  const p = newProgress(firstSectionId);

  if (Array.isArray(d.loc) && d.loc.length === 4) {
    p.location = {
      view: typeof d.loc[0] === "string" ? d.loc[0] : "dashboard",
      sectionId: (d.loc[1] as string | null) ?? null,
      conceptId: (d.loc[2] as string | null) ?? null,
      mockId: (d.loc[3] as string | null) ?? null,
    };
  }

  if (d.sec && typeof d.sec === "object") {
    for (const [id, t] of Object.entries(d.sec)) {
      if (!Array.isArray(t)) continue;
      const [unlocked, complete, score, total] = t;
      const s: SectionProgress = {
        unlocked: Boolean(unlocked),
        complete: Boolean(complete),
        testAttempts: Number(total) > 0 ? [synth(score, total)] : [],
      };
      p.section[id] = s;
    }
  }

  if (d.con && typeof d.con === "object") {
    for (const [id, t] of Object.entries(d.con)) {
      if (!Array.isArray(t)) continue;
      const [lessonRead, mastery] = t;
      p.concept[id] = {
        lessonRead: Boolean(lessonRead),
        quizAttempts: [],
        mastery: typeof mastery === "number" ? mastery : 0,
        currentAttempt: null,
      };
    }
  }

  if (d.mok && typeof d.mok === "object") {
    for (const [id, t] of Object.entries(d.mok)) {
      if (!Array.isArray(t)) continue;
      const [score, total] = t;
      p.mock[id] = {
        attempts: Number(total) > 0 ? [synth(score, total)] : [],
        currentAttempt: null,
      };
    }
  }

  // The opening module must always be reachable, even on a corrupted or
  // partial snapshot — mirrors loadProgressFor's self-heal.
  if (firstSectionId) {
    const existing = p.section[firstSectionId];
    if (!existing) {
      p.section[firstSectionId] = {
        unlocked: true,
        testAttempts: [],
        complete: false,
      };
    } else if (!existing.unlocked) {
      existing.unlocked = true;
    }
  }

  return p;
}
