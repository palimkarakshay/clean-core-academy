import { describe, expect, it } from "vitest";
import { CURRICULUM } from "@/content/curriculum";

describe("per-module skills matrix", () => {
  it("every module declares at least one skill", () => {
    for (const s of CURRICULUM.sections) {
      expect(s.skills?.length ?? 0, `${s.id} has no skills`).toBeGreaterThan(0);
    }
  });

  it("skill ids are unique pack-wide", () => {
    const ids = CURRICULUM.sections.flatMap((s) => (s.skills ?? []).map((k) => k.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each skill has a non-empty label", () => {
    for (const s of CURRICULUM.sections) {
      for (const k of s.skills ?? []) {
        expect(k.label.length, `${k.id} label`).toBeGreaterThan(0);
      }
    }
  });

  it("each skill conceptId resolves to a concept in the same module", () => {
    for (const s of CURRICULUM.sections) {
      const conceptIds = new Set(s.concepts.map((c) => c.id));
      for (const k of s.skills ?? []) {
        if (k.conceptId) {
          expect(conceptIds.has(k.conceptId), `${k.id} → ${k.conceptId}`).toBe(true);
        }
      }
    }
  });
});
