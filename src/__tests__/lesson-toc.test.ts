import { describe, expect, it } from "vitest";
import { lessonTocItems } from "@/components/concept/LessonTOC";
import type { Lesson } from "@/content/curriculum-types";

const base: Lesson = { status: "ready", paragraphs: ["body"] };

describe("lessonTocItems", () => {
  it("easy depth always yields at least the Overview anchor (panel persists)", () => {
    const lesson: Lesson = { ...base, simplified: { oneLiner: "x" } };
    const items = lessonTocItems(lesson, "easy");
    expect(items.length).toBeGreaterThanOrEqual(1);
    expect(items[0].id).toBe("lesson-easy-top");
  });

  it("easy adds Quick takeaways when simplified.keyPoints exist", () => {
    const lesson: Lesson = {
      ...base,
      simplified: { oneLiner: "x", keyPoints: ["a", "b"] },
    };
    const ids = lessonTocItems(lesson, "easy").map((i) => i.id);
    expect(ids).toEqual(["lesson-easy-top", "easy-takeaways"]);
  });

  it("deeper depth always yields Overview plus its populated sections", () => {
    const lesson: Lesson = {
      ...base,
      deeper: {
        keyPoints: ["k"],
        examples: [{ title: "e", body: "b" }],
        pitfalls: ["p"],
        furtherReading: [{ title: "r", href: "https://x" }],
      },
    };
    const ids = lessonTocItems(lesson, "deeper").map((i) => i.id);
    expect(ids).toEqual([
      "lesson-deeper-top",
      "deeper-key-points",
      "deeper-examples",
      "deeper-pitfalls",
      "deeper-reading",
    ]);
  });

  it("conceptual depth anchors the populated canonical sections", () => {
    const lesson: Lesson = {
      ...base,
      keyPoints: ["k"],
      examples: [{ title: "e", body: "b" }],
      pitfalls: ["p"],
    };
    const ids = lessonTocItems(lesson, "conceptual").map((i) => i.id);
    expect(ids).toEqual(["key-points", "examples", "pitfalls"]);
  });

  it("conceptual with no sections yields no anchors (single-column flow)", () => {
    expect(lessonTocItems(base, "conceptual")).toEqual([]);
  });
});
