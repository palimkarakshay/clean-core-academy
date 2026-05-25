import "server-only";
import * as abaplint from "@abaplint/core";
// Single source of truth: the same abaplint ruleset the CLI uses
// (npm run lint:abap), itself a faithful copy of the reference repo's
// abaplint.json. In-app checks and the CLI therefore agree.
import abaplintConfig from "../../../exercises/abaplint.json";

export interface AbapLintIssue {
  /** abaplint rule key, e.g. "exit_or_check". */
  rule: string;
  message: string;
  /** 1-based line / column of the finding. */
  line: number;
  column: number;
  severity: string;
}

/** Hard cap on submitted source — abaplint only parses (never executes)
 *  the input, but bound the work to keep the route cheap. */
export const MAX_ABAP_CHARS = 20000;

/**
 * Lint a single ABAP source string with the Clean Core ruleset and
 * return the findings. Pure: constructs a fresh in-memory registry per
 * call so concurrent requests don't share state.
 */
export function lintAbap(
  code: string,
  filename = "zcl_au_ex_solution.clas.abap"
): AbapLintIssue[] {
  const safeName = /^[a-zA-Z0-9_.-]+\.(clas|prog|intf|fugr)\.abap$/.test(filename)
    ? filename
    : "zcl_au_ex_solution.clas.abap";
  const config = new abaplint.Config(JSON.stringify(abaplintConfig));
  const registry = new abaplint.Registry(config);
  registry.addFile(new abaplint.MemoryFile(safeName, code.slice(0, MAX_ABAP_CHARS)));
  registry.parse();
  return registry.findIssues().map((issue) => {
    const start = issue.getStart();
    return {
      rule: issue.getKey(),
      message: issue.getMessage(),
      line: start.getRow(),
      column: start.getCol(),
      severity: String(issue.getSeverity()),
    };
  });
}
