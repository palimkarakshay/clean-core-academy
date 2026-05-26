import { describe, expect, it } from "vitest";
import { CURRICULUM } from "@/content/curriculum";
import { dailyInsightIndex, getDailyInsight } from "@/lib/daily-insight";

describe("dailyInsightIndex", () => {
  it("wraps within [0, total) and is stable within a calendar day", () => {
    const total = 7;
    const morning = new Date("2026-05-26T08:00:00Z");
    const evening = new Date("2026-05-26T22:30:00Z");
    const a = dailyInsightIndex(morning, total);
    const b = dailyInsightIndex(evening, total);
    expect(a).toBe(b);
    expect(a).toBeGreaterThanOrEqual(0);
    expect(a).toBeLessThan(total);
  });

  it("advances by one each day and wraps at the end of the pool", () => {
    const total = 5;
    const day0 = new Date("2026-01-01T00:00:00Z");
    const day1 = new Date("2026-01-02T00:00:00Z");
    const i0 = dailyInsightIndex(day0, total);
    const i1 = dailyInsightIndex(day1, total);
    expect(i1).toBe((i0 + 1) % total);
  });

  it("returns -1 for an empty pool", () => {
    expect(dailyInsightIndex(new Date(), 0)).toBe(-1);
  });
});

describe("getDailyInsight", () => {
  it("returns a fully-populated insight from the active curriculum", () => {
    const insight = getDailyInsight(CURRICULUM, new Date("2026-05-26T08:00:00Z"));
    expect(insight).not.toBeNull();
    if (!insight) return;
    expect(insight.flashcard.front.length).toBeGreaterThan(0);
    expect(insight.flashcard.back.length).toBeGreaterThan(0);
    expect(insight.sectionId).toBeTruthy();
    expect(insight.conceptId).toBeTruthy();
    // the referenced concept must actually exist in the curriculum
    const section = CURRICULUM.sections.find((s) => s.id === insight.sectionId);
    expect(section, `section ${insight.sectionId} exists`).toBeTruthy();
    expect(
      section?.concepts.some((c) => c.id === insight.conceptId),
      `concept ${insight.conceptId} exists in ${insight.sectionId}`
    ).toBe(true);
  });

  it("is deterministic for a given date and changes across days", () => {
    const d1 = new Date("2026-05-26T08:00:00Z");
    const d2 = new Date("2026-09-14T08:00:00Z");
    const a = getDailyInsight(CURRICULUM, d1);
    const b = getDailyInsight(CURRICULUM, d1);
    const c = getDailyInsight(CURRICULUM, d2);
    expect(a?.flashcard.id).toBe(b?.flashcard.id);
    // far-apart dates land on different cards (pool is large)
    expect(a?.flashcard.id).not.toBe(c?.flashcard.id);
  });
});
