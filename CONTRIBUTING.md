# Contributing

Short conventions that have to hold across the codebase. Lint /
type-check / tests enforce most of them; the rest live here.

## Run the checks

```sh
npm install
npm run lint           # eslint
npm run type-check     # tsc --noEmit
npm test               # vitest (unit + contract)
npm run lint:abap      # abaplint over the ABAP reference solutions
npm run build          # production build verification
npm run test:e2e       # playwright (chromium desktop / tablet / mobile)
```

Keep `lint`, `type-check`, `test`, and `build` green on every change.
There is **no CI workflow in this repo yet**, so the local gates are
the gate — run them before you push. The Playwright e2e specs still
target the shell's original demo pack (see the README "Inherited from
the shell" note) and aren't wired into a pipeline; treat them as
advisory until they're re-pointed at `clean-core-academy`.

## Storage discipline

The app stores state in `localStorage` today, but every store routes
through `src/lib/storage/driver.ts`. **Do not call
`localStorage.getItem` / `setItem` directly in new code.** Use
`createLocalDriver` (or a future server-backed driver) so a storage
migration stays a one-file swap rather than a codebase-wide rewrite.
The discipline test at `src/__tests__/storage-key-discipline.test.ts`
enforces that storage-key literals only appear in their owning module.

## AI / LLM boundary

**All LLM calls go through `src/lib/ai/router.ts`.** Do not import
`@anthropic-ai/sdk`, `openai`, or any provider SDK elsewhere in `src/`.
The router is the single seam; it is a stub today and returns a
`not-configured` result when no `OPENROUTER_API_KEY` is set, so the
app stays honest with AI disabled.

Prompt templates live in `prompts/*.md`, imported as strings. Do not
inline system prompts in TypeScript.

## Content quality

- New MCQ quizzes must not skew the correct letter past 60% on a single
  letter — the build-time test in
  `src/__tests__/quiz-letter-distribution.test.ts` enforces this for
  the pack content.
- Distractors must be plausible — each one represents a specific
  misconception, not a random wrong fact.
- Every concept's quiz rationale must name the underlying principle,
  not just say "the text says so".

## Commit / PR style

- Small commits, each green on lint + type-check + unit.
- Don't force-push a feature branch after a PR is open without a
  written reason — the review trail breaks.

## Privacy / terms

`/privacy` and `/terms` are placeholder pages today. If you change
anything user-data-related, update both pages and flag the change in
the PR description so the operator can decide whether to involve a
lawyer before merging.
