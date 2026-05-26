import { describe, expect, it } from "vitest";
import { lintAbap } from "@/lib/abap/lintAbap";
import { CURRICULUM } from "@/content/curriculum";
import type { CodeExercise } from "@/content/curriculum-types";

function findExercise(id: string): CodeExercise | null {
  for (const section of CURRICULUM.sections) {
    for (const concept of section.concepts) {
      if (concept.exercise?.id === id) return concept.exercise;
    }
  }
  return null;
}

describe("in-app abaplint check", () => {
  it("flags the planted Clean-Core violation in the m03-c1 exercise starter", () => {
    const ex = findExercise("m03-c1-ex");
    expect(ex, "m03-c1 exercise should exist in the active pack").not.toBeNull();
    const issues = lintAbap(ex!.starterCode);
    const rules = issues.map((i) => i.rule);
    expect(issues.length, `expected findings, got ${JSON.stringify(rules)}`).toBeGreaterThan(0);
    expect(rules).toContain("exit_or_check");
    // The exercise advertises the rule(s) it trips — keep advert + reality in sync.
    for (const r of ex!.flaggedRules ?? []) expect(rules).toContain(r);
  });

  it("a guard-clause fix lints clean (zero issues)", () => {
    const fixed = [
      "class zcl_au_ex_post definition public final create public.",
      "  public section.",
      "    class-methods post_invoice",
      "      importing",
      "        !iv_customer type string",
      "        !iv_amount   type i",
      "      raising",
      "        cx_static_check.",
      "endclass.",
      "",
      "class zcl_au_ex_post implementation.",
      "  method post_invoice.",
      "    if iv_customer is initial.",
      "      raise exception type cx_static_check.",
      "    endif.",
      "    if iv_amount <= 0.",
      "      raise exception type cx_static_check.",
      "    endif.",
      "  endmethod.",
      "endclass.",
    ].join("\n");
    expect(lintAbap(fixed)).toEqual([]);
  });

  it("empty / whitespace source produces no crash", () => {
    expect(Array.isArray(lintAbap("   "))).toBe(true);
  });

  // Each added exercise: the starter must trip exactly its advertised
  // rule(s) (no incidental lint noise for the learner to chase), and a
  // canonical fix must lint clean — so the exercise is always solvable.
  const CASES: Array<{ id: string; rule: string; fix: string }> = [
    {
      id: "m03-c2-ex",
      rule: "functional_writing",
      fix: [
        "class zcl_au_ex_call definition public final create public.",
        "  public section.",
        "    methods run.",
        "    methods step importing !iv_x type i.",
        "endclass.",
        "",
        "class zcl_au_ex_call implementation.",
        "  method run.",
        "    me->step( iv_x = 1 ).",
        "  endmethod.",
        "  method step.",
        "  endmethod.",
        "endclass.",
      ].join("\n"),
    },
    {
      id: "m04-c3-ex",
      rule: "avoid_use",
      fix: [
        "class zcl_au_ex_mac definition public final create public.",
        "  public section.",
        "    class-methods bump",
        "      importing !iv_x type i",
        "      returning value(rv_x) type i.",
        "endclass.",
        "",
        "class zcl_au_ex_mac implementation.",
        "  method bump.",
        "    rv_x = iv_x + 1.",
        "  endmethod.",
        "endclass.",
      ].join("\n"),
    },
    {
      id: "m10-c2-ex",
      rule: "identical_conditions",
      fix: [
        "class zcl_au_ex_dup definition public final create public.",
        "  public section.",
        "    class-methods grade",
        "      importing !iv_score type i",
        "      returning value(rv_grade) type string.",
        "endclass.",
        "",
        "class zcl_au_ex_dup implementation.",
        "  method grade.",
        "    if iv_score >= 90.",
        "      rv_grade = 'A'.",
        "    elseif iv_score >= 80.",
        "      rv_grade = 'B'.",
        "    endif.",
        "  endmethod.",
        "endclass.",
      ].join("\n"),
    },
  ];

  it.each(CASES)("exercise $id: starter trips exactly [$rule]", ({ id, rule }) => {
    const ex = findExercise(id);
    expect(ex, `${id} should exist in the active pack`).not.toBeNull();
    const rules = lintAbap(ex!.starterCode).map((i) => i.rule);
    expect(rules.length, `${id} starter produced no findings`).toBeGreaterThan(0);
    expect(rules).toContain(rule);
    // Advertised rule(s) and reality agree.
    for (const r of ex!.flaggedRules ?? []) expect(rules).toContain(r);
    // No incidental noise — the starter trips only what it advertises.
    expect(new Set(rules)).toEqual(new Set(ex!.flaggedRules ?? []));
  });

  it.each(CASES)("exercise $id: the canonical fix lints clean", ({ fix }) => {
    expect(lintAbap(fix)).toEqual([]);
  });
});
