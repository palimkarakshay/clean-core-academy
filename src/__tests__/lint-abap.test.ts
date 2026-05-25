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
  it("flags the planted Clean-Core violation in the m1-c4 exercise starter", () => {
    const ex = findExercise("m1-c4-ex");
    expect(ex, "m1-c4 exercise should exist in the active pack").not.toBeNull();
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
});
