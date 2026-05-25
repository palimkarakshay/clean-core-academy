import { describe, expect, it } from "vitest";
import { CURRICULUM } from "@/content/curriculum";
import { DOMAIN_LIST, DOMAINS } from "@/content/domains";
import { SECTION_META } from "@/content/section-meta";
import {
  getConceptDomain,
  getFlashcards,
  getSectionFlashcards,
  getSectionMeta,
} from "@/content/curriculum-loader";

/**
 * Active-pack shape guard. The Clean Core Academy course organises by
 * cookbook module (not by weighted exam domains), so the CCA-F-era
 * domain-coverage assertions are dropped. What remains validates the
 * extension data the section-landing page + flashcards actually use,
 * plus the shell's prototype-key safety contract.
 */
describe("section meta", () => {
  it("has metadata for every section", () => {
    for (const section of CURRICULUM.sections) {
      const meta = getSectionMeta(section.id);
      expect(meta, `missing SECTION_META for ${section.id}`).not.toBeNull();
      if (!meta) continue;
      expect(meta.academyUrl).toMatch(/^https:\/\//);
      expect(meta.timeMinutes).toBeGreaterThan(0);
      expect(meta.learningObjectives.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("SECTION_META keys match section ids exactly (no stale entries)", () => {
    const sectionIds = new Set(CURRICULUM.sections.map((s) => s.id));
    const metaIds = new Set(Object.keys(SECTION_META));
    for (const id of sectionIds) {
      expect(metaIds.has(id), `missing SECTION_META[${id}]`).toBe(true);
    }
    for (const id of metaIds) {
      expect(sectionIds.has(id), `stale SECTION_META[${id}]`).toBe(true);
    }
  });
});

describe("flashcard derivation", () => {
  it("derives at least one flashcard for every concept that has a lesson", () => {
    const empty: string[] = [];
    for (const section of CURRICULUM.sections) {
      for (const concept of section.concepts) {
        if (!concept.lesson) continue;
        if (getFlashcards(concept).length === 0) empty.push(concept.id);
      }
    }
    expect(empty, `concepts without derivable flashcards: ${empty.join(", ")}`).toEqual(
      []
    );
  });

  it("flashcard deck size never exceeds 6 per concept", () => {
    for (const section of CURRICULUM.sections) {
      for (const concept of section.concepts) {
        expect(
          getFlashcards(concept).length,
          `${concept.id} produced too many flashcards`
        ).toBeLessThanOrEqual(6);
      }
    }
  });

  it("flashcard ids are stable + unique within a section", () => {
    for (const section of CURRICULUM.sections) {
      const cards = getSectionFlashcards(section);
      const ids = new Set(cards.map((c) => c.id));
      expect(ids.size, `${section.id} has duplicate card ids`).toBe(cards.length);
    }
  });
});

describe("shell domain infra stays well-formed", () => {
  it("DOMAIN_LIST has all 5 domains in 1..5 order with weights summing to 1.0", () => {
    expect(DOMAIN_LIST.length).toBe(5);
    expect(DOMAIN_LIST.map((d) => d.n)).toEqual([1, 2, 3, 4, 5]);
    const total = DOMAIN_LIST.reduce((acc, d) => acc + d.weight, 0);
    expect(total).toBeCloseTo(1.0, 5);
  });

  it("DOMAINS is keyed by its own ids", () => {
    for (const [id, info] of Object.entries(DOMAINS)) {
      expect(info.id).toBe(id);
    }
  });
});

describe("lookup helpers reject inherited prototype keys", () => {
  it("getSectionMeta + getConceptDomain return null for prototype keys", () => {
    for (const proto of ["toString", "hasOwnProperty", "__proto__", "constructor"]) {
      expect(getSectionMeta(proto), `getSectionMeta("${proto}")`).toBeNull();
      expect(getConceptDomain(proto), `getConceptDomain("${proto}")`).toBeNull();
    }
  });
});
