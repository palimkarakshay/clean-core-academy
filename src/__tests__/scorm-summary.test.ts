import { describe, expect, it } from "vitest";
import { newProgress, ensureSection } from "@/lib/progress";
import { computeScormSummary } from "@/lib/scorm/summary";
import type { Progress, QuizAttempt } from "@/lib/progress-types";

function passAttempt(): QuizAttempt {
  return { startedAt: 0, completedAt: 0, total: 5, score: 5, answers: {} };
}

function withPasses(ids: string[]): Progress {
  const p = newProgress();
  for (const id of ids) ensureSection(p, id).testAttempts.push(passAttempt());
  return p;
}

const FIVE = ["s1", "s2", "s3", "s4", "s5"];

describe("computeScormSummary", () => {
  it("is incomplete with a clean slate", () => {
    const s = computeScormSummary(newProgress(), FIVE);
    expect(s).toMatchObject({ status: "incomplete", scoreRaw: 0, passedSections: 0 });
  });

  it("scores the fraction of modules passed", () => {
    const s = computeScormSummary(withPasses(["s1", "s2"]), FIVE);
    expect(s.passedSections).toBe(2);
    expect(s.scoreRaw).toBe(40);
  });

  it("is 'passed' at or above the threshold but short of all", () => {
    const s = computeScormSummary(withPasses(["s1", "s2", "s3", "s4"]), FIVE);
    expect(s.status).toBe("passed");
    expect(s.scoreRaw).toBe(80);
  });

  it("is 'completed' once every module is passed", () => {
    const s = computeScormSummary(withPasses(FIVE), FIVE);
    expect(s.status).toBe("completed");
    expect(s.scoreRaw).toBe(100);
  });

  it("stays incomplete below the threshold", () => {
    const s = computeScormSummary(withPasses(["s1", "s2", "s3"]), FIVE);
    expect(s.status).toBe("incomplete");
    expect(s.scoreRaw).toBe(60);
  });

  it("honors a custom pass threshold", () => {
    const s = computeScormSummary(withPasses(["s1", "s2"]), FIVE, {
      passThreshold: 0.4,
    });
    expect(s.status).toBe("passed");
  });
});
