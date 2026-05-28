import { describe, it, expect } from "vitest";
import type { MockExam } from "@/content/curriculum-types";
import { bandForScore } from "@/components/quiz/mock-band";

const mock: MockExam = {
  id: "m",
  title: "Practice",
  blurb: "",
  timeMinutes: 30,
  passPct: 0.7,
  scoreBands: [
    { min: 0, max: 69, verdict: "Keep studying", message: "" },
    { min: 70, max: 89, verdict: "Solid", message: "" },
    { min: 90, max: 100, verdict: "Clean Core ready", message: "" },
  ],
  questions: [],
};

describe("bandForScore", () => {
  it("a perfect score lands in the top band (regression: raw score used to hit the bottom band)", () => {
    expect(bandForScore(mock, 20, 20)?.verdict).toBe("Clean Core ready");
  });
  it("converts the raw correct-count to a percentage before the lookup", () => {
    expect(bandForScore(mock, 14, 20)?.verdict).toBe("Solid"); // 70%
    expect(bandForScore(mock, 13, 20)?.verdict).toBe("Keep studying"); // 65%
  });
  it("a zero score lands in the bottom band", () => {
    expect(bandForScore(mock, 0, 20)?.verdict).toBe("Keep studying");
  });
  it("guards total=0 without dividing by zero", () => {
    expect(bandForScore(mock, 0, 0)?.verdict).toBe("Keep studying");
  });
});
