import { describe, expect, it } from "vitest";
import { ensureConcept, ensureSection, newProgress } from "@/lib/progress";
import { deserializeProgress, serializeProgress } from "@/lib/scorm/persist";
import type { Progress, QuizAttempt } from "@/lib/progress-types";

function attempt(score: number, total: number): QuizAttempt {
  // Bulky detail (answers/reasons) that must NOT survive into suspend_data.
  return {
    startedAt: 1,
    completedAt: 2,
    score,
    total,
    answers: { 1: "A", 2: "B", 3: "C" },
    reasons: { 1: "because", 2: "reasons", 3: "here" },
  };
}

describe("scorm persist round-trip", () => {
  it("restores completion, scores, mastery and the bookmark", () => {
    const p = newProgress("s1");
    const s1 = ensureSection(p, "s1");
    s1.complete = true;
    s1.testAttempts.push(attempt(8, 10));
    const c1 = ensureConcept(p, "c1");
    c1.lessonRead = true;
    c1.mastery = 4;
    p.location = { view: "module", sectionId: "s1", conceptId: null, mockId: null };

    const back = deserializeProgress(serializeProgress(p), "s1") as Progress;

    expect(back).not.toBeNull();
    expect(back.section.s1.complete).toBe(true);
    expect(back.section.s1.testAttempts.at(-1)).toMatchObject({ score: 8, total: 10 });
    expect(back.concept.c1).toMatchObject({ lessonRead: true, mastery: 4 });
    expect(back.location).toMatchObject({ view: "module", sectionId: "s1" });
  });

  it("drops per-question detail so a full course fits SCORM 1.2 (<4096)", () => {
    const p = newProgress("s0");
    for (let i = 0; i < 14; i++) {
      const s = ensureSection(p, `s${i}`);
      s.unlocked = true;
      s.complete = true;
      s.testAttempts.push(attempt(10, 10));
      for (let j = 0; j < 8; j++) {
        const c = ensureConcept(p, `s${i}-concept-${j}`);
        c.lessonRead = true;
        c.mastery = 4;
        c.quizAttempts.push(attempt(5, 5));
      }
    }
    const raw = serializeProgress(p);
    expect(raw.length).toBeLessThan(4000);
    // and it still round-trips
    const back = deserializeProgress(raw, "s0") as Progress;
    expect(back.section.s13.complete).toBe(true);
    expect(back.concept["s13-concept-7"].mastery).toBe(4);
  });

  it("rejects empty, malformed, or wrong-version payloads", () => {
    expect(deserializeProgress("", "s1")).toBeNull();
    expect(deserializeProgress("not json", "s1")).toBeNull();
    expect(deserializeProgress(JSON.stringify({ v: 2 }), "s1")).toBeNull();
  });

  it("keeps the opening module reachable even from a clean slate", () => {
    const back = deserializeProgress(serializeProgress(newProgress("s1")), "s1") as Progress;
    expect(back.section.s1.unlocked).toBe(true);
  });

  it("omits untouched items to keep a fresh attempt tiny", () => {
    const raw = serializeProgress(newProgress("s1"));
    const parsed = JSON.parse(raw) as { con: object; mok: object };
    expect(Object.keys(parsed.con)).toHaveLength(0);
    expect(Object.keys(parsed.mok)).toHaveLength(0);
  });
});
