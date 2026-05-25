import { describe, expect, it } from "vitest";
import { CURRICULUM } from "@/content/curriculum";

const audit = CURRICULUM.readinessAudit;

describe("readiness self-audit", () => {
  it("is present and non-empty", () => {
    expect(audit, "active pack should ship a readinessAudit").toBeTruthy();
    expect(audit!.questions.length).toBeGreaterThan(0);
    expect(audit!.title).toBeTruthy();
    expect(audit!.intro).toBeTruthy();
  });

  it("every question is well-formed", () => {
    for (const q of audit!.questions) {
      expect(q.weight, `${q.id} weight`).toBeGreaterThan(0);
      expect(["yes", "no"]).toContain(q.riskAnswer);
      expect(q.remediation.length).toBeGreaterThan(0);
      expect(q.dimension.length).toBeGreaterThan(0);
    }
  });

  it("question ids are unique", () => {
    const ids = audit!.questions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every moduleId references a real section (so remediation links resolve)", () => {
    const sectionIds = new Set(CURRICULUM.sections.map((s) => s.id));
    for (const q of audit!.questions) {
      if (q.moduleId) {
        expect(sectionIds.has(q.moduleId), `${q.id} → ${q.moduleId}`).toBe(true);
      }
    }
  });

  it("verdict bands cover 0..100 contiguously with no gaps", () => {
    const bands = [...audit!.bands].sort((a, b) => a.min - b.min);
    expect(bands[0].min).toBe(0);
    expect(bands[bands.length - 1].max).toBe(100);
    for (let i = 1; i < bands.length; i++) {
      expect(bands[i].min, `gap before band ${i}`).toBe(bands[i - 1].max + 1);
    }
  });
});
