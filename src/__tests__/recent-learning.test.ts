import { describe, expect, it } from "vitest";
import { CURRICULUM } from "@/content/curriculum";
import { masteryLevels } from "@/lib/site-config";
import { recentlyLearnt } from "@/lib/recent-learning";
import type { Progress } from "@/lib/progress-types";

const masteredLevel = masteryLevels.findIndex((l) => l.countsAsMastered);

function progressWith(
  entries: Record<string, { completedAt: number; mastery?: number }>
): Progress {
  const concept: Progress["concept"] = {};
  for (const [id, { completedAt, mastery }] of Object.entries(entries)) {
    concept[id] = {
      lessonRead: true,
      quizAttempts: [
        { startedAt: completedAt - 1, completedAt, total: 3, score: 3, answers: {} },
      ],
      mastery: mastery ?? masteredLevel,
      currentAttempt: null,
    };
  }
  return { concept } as unknown as Progress;
}

describe("recentlyLearnt", () => {
  it("returns the most recently completed mastered concept", () => {
    const [a, b] = CURRICULUM.sections[0].concepts;
    const result = recentlyLearnt(
      progressWith({
        [a.id]: { completedAt: 1000 },
        [b.id]: { completedAt: 2000 },
      }),
      CURRICULUM
    );
    expect(result?.conceptId).toBe(b.id);
    expect(result?.at).toBe(2000);
    expect(result?.title).toBe(b.title);
  });

  it("ignores concepts that are not yet mastered", () => {
    const [a] = CURRICULUM.sections[0].concepts;
    const result = recentlyLearnt(
      progressWith({ [a.id]: { completedAt: 1000, mastery: 0 } }),
      CURRICULUM
    );
    expect(result).toBeNull();
  });

  it("returns null for empty progress", () => {
    expect(recentlyLearnt({ concept: {} } as unknown as Progress, CURRICULUM)).toBeNull();
  });
});
