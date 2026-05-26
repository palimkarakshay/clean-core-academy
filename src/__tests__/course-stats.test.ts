import { describe, expect, it } from "vitest";
import { CURRICULUM } from "@/content/curriculum";
import { courseStats } from "@/lib/course-stats";

describe("courseStats", () => {
  it("summarises the active curriculum consistently", () => {
    const s = courseStats(CURRICULUM);
    expect(s.modules).toBe(CURRICULUM.sections.length);
    expect(s.modules).toBeGreaterThan(0);
    expect(s.lessons).toBeGreaterThan(0);
    expect(s.quizQuestions).toBeGreaterThan(0);
    // at least one interactive exercise ships in the pack
    expect(s.exercises).toBeGreaterThanOrEqual(1);
    // lessons can't exceed the total concept count
    const totalConcepts = CURRICULUM.sections.flatMap((x) => x.concepts).length;
    expect(s.lessons).toBeLessThanOrEqual(totalConcepts);
    expect(s.hasAudit).toBe(Boolean(CURRICULUM.readinessAudit));
    if (s.hasAudit) expect(s.auditQuestions).toBeGreaterThan(0);
  });
});
