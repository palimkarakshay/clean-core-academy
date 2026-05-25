# Authoring Clean Core Academy lessons

This pack teaches SAP **Clean Core** / ABAP Cloud. Its content lives in
`content-packs/clean-core-academy/` (TypeScript: `curriculum.ts`,
`pack.config.ts`), and ABAP exercises are linted against the Clean Core
ruleset in `exercises/abaplint.json` — the same ruleset the in-app check
at `src/app/api/lint-abap/route.ts` runs.

## The rule that matters most: cite SAP Docs MCP, don't guess

ABAP and the Clean Core / ABAP Cloud surface move every release: released
APIs, the released-object allow-list, RAP behaviors, class and method
signatures, and deprecations all change. A model's training-cutoff memory
**drifts** from the current release and will confidently state APIs that
were renamed, restricted, or never existed.

**Therefore: every ABAP API fact in a lesson must be backed by a SAP Docs
MCP search result — never by training-cutoff recall.** This applies to:

- released vs. not-released objects (the `released` C1 contract),
- class / interface / method names and signatures,
- RAP, EML, CDS, and ABAP SQL syntax claims,
- "use X instead of Y" deprecation guidance.

The `sap-docs` MCP server (`marianfoo/mcp-sap-docs`, ABAP profile) is
wired in `.mcp.json` and exposes `search` + `fetch` over the real SAP
Help Portal and SAP Community, plus an `abap_lint` tool.

### Bring it up

```bash
docker compose up -d --build sap-docs      # http://localhost:3124/mcp
```

Then the `sap-docs` MCP server is available to Claude Code in this repo.

### Citation convention

When a lesson paragraph or a quiz explanation asserts an ABAP API or
behavior, capture the SAP Docs MCP source so a reviewer can verify it:

```ts
// content-packs/clean-core-academy/curriculum.ts
{
  // …
  // SAP Docs MCP: search "RAP managed implementation type" →
  // https://help.sap.com/docs/abap-cloud/... (verified 2026-05-25)
  paragraphs: ["In a managed RAP business object, the framework …"],
}
```

Prefer the canonical SAP Help Portal page the MCP returns; fall back to a
dated SAP Community answer only when Help has no equivalent. If the MCP
search turns up nothing authoritative, **soften the claim or cut it** —
do not fill the gap from memory.

## Code examples must lint clean

Every ABAP snippet a learner sees should pass the Clean Core ruleset:

```bash
npm run lint:abap        # abaplint exercises/abaplint.json
```

Author exercise solutions to be lint-clean; author the "before" examples
to fail on a *specific, named* rule so the lesson can point at it. The
`abap_lint` tool from the SAP Docs MCP mirrors this check during drafting.

## Check your work

```bash
npm run lint
npm run type-check       # the TS pack compiles
npm test                 # vitest
```

## Checklist

- [ ] Every ABAP API claim cites a SAP Docs MCP result (Help Portal preferred).
- [ ] No claim rests on training-cutoff recall; unverifiable claims are cut.
- [ ] Learner-facing snippets pass `npm run lint:abap`; "before" snippets fail one named rule.
- [ ] `npm run type-check` and `npm test` pass.
