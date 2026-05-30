# Contributing

Short conventions that have to hold across the codebase. Lint /
type-check / tests enforce most of them; the rest live here. See
[`CLAUDE.md`](./CLAUDE.md) for the full architecture map and the
inherited-shell drift notes.

## Run the checks

```sh
npm install
npm run lint           # eslint
npm run type-check     # tsc --noEmit
npm test               # vitest (29 test files under src/__tests__)
npm run build          # next build — production build verification
npm run lint:abap      # abaplint over exercises/ (for ABAP content changes)
npm run test:e2e       # playwright — advisory (see note)
```

Every PR needs lint + type-check + unit + build green; these run in
CI on every push and PR (`.github/workflows/ci.yml`). The Playwright
`e2e/` specs still target the shell's original demo brand and have
not been re-pointed at this pack — treat their result as advisory
until a change touches a flow covered by `e2e/*.spec.ts`.

## Storage discipline

The app stores state in `localStorage` today, but every store routes
through `src/lib/storage/driver.ts`. **Do not call
`localStorage.getItem` / `setItem` directly in new code.** Use
`createLocalDriver` (or a future server-backed driver) so swapping the
persistence layer stays a one-file change rather than a codebase-wide
rewrite.

The discipline test at `src/__tests__/storage-key-discipline.test.ts`
enforces that storage-key literals only appear in their owning module,
and keys are namespaced per `pack.id` so packs don't collide in one
browser.

## AI / LLM boundary

**All LLM calls go through `src/lib/ai/router.ts`.** Do not import
`@anthropic-ai/sdk`, `openai`, or any provider SDK elsewhere in
`src/`. The router is the single seam that holds vendor neutrality
(the Vercel AI Gateway via the AI SDK is the API surface) and the
`not-configured` fallback that keeps the app honest when no credential
is set. It is **scaffolded — not yet wired** to any feature;
`AI_GATEWAY_API_KEY` (and the Vercel OIDC fallback) are unset by default.

Prompt templates live in `prompts/*.md`, imported as strings. Do not
inline system prompts in TypeScript.

Note: the **Ask Claude** panel (`src/components/concept/AskClaudePanel.tsx`)
is a separate, client-side hand-off that opens `claude.ai` in the
browser — it does not go through the router.

## Content quality

- New MCQ quizzes must not skew the correct letter past 60% on a single
  letter — the build-time test in
  `src/__tests__/quiz-letter-distribution.test.ts` enforces this.
- Distractors must be plausible — each one represents a specific
  misconception, not a random wrong fact.
- Every concept's quiz rationale must name the underlying principle,
  not just say "the text says so".
- **Every ABAP API claim must cite a SAP Docs MCP result, never
  training-cutoff recall** — see [`docs/AUTHORING.md`](./docs/AUTHORING.md).
  Learner-facing snippets must pass `npm run lint:abap`; "before"
  snippets should fail one *named* rule.

## Commit / PR style

- Small commits, each green on lint + type-check + unit.
- Don't `--force` push to a feature branch after a PR is open without a
  written reason — the review trail breaks.

## Privacy / terms

`/privacy` and `/terms` are placeholder pages today. If you change
anything user-data-related, update both pages and flag the change in
the PR description so the operator can decide whether legal review is
needed before merging.
