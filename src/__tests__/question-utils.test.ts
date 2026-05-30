import { describe, it, expect } from "vitest";
import type {
  FillInQuestion,
  MCQQuestion,
  TrueFalseQuestion,
} from "@/content/curriculum-types";
import {
  isAnswered,
  isCorrect,
  scoreAttempt,
} from "@/components/quiz/question-utils";

const mcq: MCQQuestion = {
  n: 1,
  question: "Q1",
  options: { A: "a", B: "b", C: "c", D: "d" },
  correct: "B",
};
const tf: TrueFalseQuestion = {
  n: 2,
  kind: "true-false",
  question: "Q2",
  correct: true,
};
const fill: FillInQuestion = {
  n: 3,
  kind: "fill-in",
  question: "Q3",
  acceptedAnswers: ["RAP", "ABAP RESTful"],
};

describe("isCorrect", () => {
  it("MCQ matches the correct letter only", () => {
    expect(isCorrect(mcq, "B")).toBe(true);
    expect(isCorrect(mcq, "A")).toBe(false);
  });
  it("treats null/undefined as wrong (no missing-kind crash)", () => {
    expect(isCorrect(mcq, null)).toBe(false);
    expect(isCorrect(mcq, undefined)).toBe(false);
  });
  it("true/false matches the boolean", () => {
    expect(isCorrect(tf, true)).toBe(true);
    expect(isCorrect(tf, false)).toBe(false);
  });
  it("fill-in is case- and whitespace-insensitive across accepted answers", () => {
    expect(isCorrect(fill, "rap")).toBe(true);
    expect(isCorrect(fill, "  ABAP RESTful  ")).toBe(true);
    expect(isCorrect(fill, "nope")).toBe(false);
    expect(isCorrect(fill, "")).toBe(false);
  });
});

describe("isAnswered", () => {
  it("null/undefined are not answered", () => {
    expect(isAnswered(null)).toBe(false);
    expect(isAnswered(undefined)).toBe(false);
  });
  it("empty / whitespace-only fill-in strings are not answered", () => {
    expect(isAnswered("")).toBe(false);
    expect(isAnswered("   ")).toBe(false);
  });
  it("a non-empty string, a letter, and both booleans count as answered", () => {
    expect(isAnswered("x")).toBe(true);
    expect(isAnswered("A")).toBe(true);
    expect(isAnswered(true)).toBe(true);
    expect(isAnswered(false)).toBe(true);
  });
});

describe("scoreAttempt", () => {
  it("counts correct answers across kinds, keyed by question number", () => {
    // mcq "B" correct; tf answered false but correct is true (wrong); fill "rap" correct => 2
    expect(scoreAttempt([mcq, tf, fill], { 1: "B", 2: false, 3: "rap" })).toBe(2);
  });
  it("missing answers score zero", () => {
    expect(scoreAttempt([mcq, tf, fill], {})).toBe(0);
  });
});
