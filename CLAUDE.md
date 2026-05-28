# CLAUDE.md

Guidance for Claude Code (claude.ai/code) working in this repository.

> **Read this first — inherited-shell drift.** This repo was carved out of a
> larger, multi-pack B2B "learning shell." Several inherited docs and the
> `.env.example` still describe features that **do not exist in this repo's
> source**. When they conflict with reality, trust (in order): this file →
> `README.md` (esp. its "Inherited from the shell" section) → the actual `src/`
> tree. See [Known drift](#known-drift--do-not-trust-blindly) at the bottom.

## What this is

**Clean Core Academy** — an interactive ABAP developer course for **SAP Clean
Core & S/4HANA readiness**, delivered through a content-agnostic learning-app
shell. One body of content, tagged for several **audiences** (developer ladder:
new → intermediate → expert → admin; plus business tracks). Each lesson pairs
concept notes, before/after ABAP, and a "spot the Clean-Core violation" quiz.

Stack: **Next.js 16 (App Router) + React 19 + Tailwind CSS v4**, deployed on
Vercel. Client state persists to `localStorage`; there is no server DB today.

## Develop

```sh
npm install
npm run dev            # http://localhost:3000  → redirects into the active pack
```

## Verify — the build gate

Run all of these before considering a change done:

```sh
npm run lint           # eslint
npm run type-check     # tsc --noEmit
npm test               # vitest — 29 test files under src/__tests__
npm run build          # next build (prerenders module/concept/quiz/audit routes)
```

For any change touching ABAP exercise content, also:

```sh
npm run lint:abap      # abaplint over exercises/ (the clean reference solutions)
npm run smoke:swap     # scripts/swap-smoke.sh — exercises every pack still present
```

`npm run test:e2e` runs Playwright, but the `e2e/` specs still target the
shell's original demo brand and have **not** been re-pointed at this pack —
treat e2e as advisory; vitest is the wired gate.

Note: there was **no CI** in this repo until the `.github/workflows/ci.yml`
added alongside this file (lint + type-check + test + build + lint:abap,
hermetic / no secrets). `CONTRIBUTING.md`'s "every PR is green" now refers to
that workflow.

## Architecture — content-agnostic shell + one content pack

The app is a **pack-agnostic Next.js shell** (`src/`) plus a single **content
pack** (`content-packs/clean-core-academy/`). Switching packs is a build-time
choice; the shell never changes per pack.

- **Active pack selection:** `NEXT_PUBLIC_CONTENT_PACK_ID` (default + fallback
  `clean-core-academy`) resolves the **`@active-pack`** alias in both
  `next.config.ts` and `vitest.config.ts`. `src/content/active-pack.ts` imports
  `@active-pack`; tree-shaking drops inactive packs. A stale env var pointing at
  a missing pack folder falls back to `clean-core-academy` (don't "fix" that
  fallback — it's deliberate). *(The comment header in `active-pack.ts` still
  says the default is `cca-f-prep` and points at `web/content-packs/` — inherited
  drift; the real default is `clean-core-academy`.)*
- **Pack contract:** `src/content/pack-types.ts` + `src/content/curriculum-types.ts`.
  A pack folder is self-contained except `<pack>/_types.ts`, which re-exports
  those shell types. Two tests enforce the boundary:
  `src/__tests__/pack-contract.test.ts` and `no-curriculum-coupling.test.ts`.
- **Routes** (`src/app/`): root `/` redirects into the pack; `[packId]/`
  holds the dashboard, `concept/[sectionId]/[conceptId]` (+`/quiz`),
  `section/[sectionId]` (+`/test`, +`/games/{flashcard-battle,time-trivia}`),
  `mock` (+`[mockId]`, +`result`), `audit` (readiness self-audit), `skills`
  (per-module matrix). API: `api/lint-abap`, `api/health`.
- **Pack content** (`content-packs/clean-core-academy/`): `pack.config.ts`
  (branding/theme/nav/copy), `curriculum.ts` (assembles modules + practice exam
  + `readinessAudit`), `modules/*.ts` (one Section per file: `m01`–`m13`,
  `b01`–`b03`, `exams.ts`), `icons.ts`, `index.ts`, `_types.ts`.
- **Path aliases:** `@/*` → `src/*`, `@active-pack` → `content-packs/<id>`.

### ABAP linting — one ruleset, two consumers
`exercises/abaplint.json` is a faithful copy of the ABAP-Utilities ruleset and is
the **single source of truth** for both the CLI (`npm run lint:abap`) and the
in-app check (`POST /api/lint-abap` → `src/lib/abap/lintAbap.ts` →
`@abaplint/core`). `@abaplint/core` is large with internal dynamic requires, so
it's kept in `serverExternalPackages` (next.config.ts) and `require()`d at
runtime. Clean reference solutions live in `exercises/src/*.clas.abap`; the
*planted* violation lives in exercise starter data, asserted by
`src/__tests__/lint-abap.test.ts`.

### Conventions that actually hold (enforced by tests)
- **Storage discipline.** All client state routes through
  `src/lib/storage/driver.ts` (`createLocalDriver`). **Never call
  `localStorage.getItem/setItem` directly in new code** —
  `src/__tests__/storage-key-discipline.test.ts` fails if a storage-key literal
  appears outside its owning module. Keys are namespaced per `pack.id`, so packs
  don't collide in one browser.
- **AI boundary.** All LLM calls go through `src/lib/ai/router.ts` (OpenRouter
  as the surface; **scaffolded — not wired** until an API key + the v2 work
  land). Do not import a provider SDK elsewhere in `src/`. Prompt templates live
  in `prompts/*.md` imported as strings. Separately, the **Ask Claude** panel
  (`AskClaudePanel.tsx`) is a *client-side hand-off* that opens `claude.ai` in
  the browser — that's why the CSP `connect-src` allows `claude.ai`.
- **Quiz quality.** New MCQs must not skew the correct letter past 60% on a
  single letter — `src/__tests__/quiz-letter-distribution.test.ts` enforces it.

### Security / headers
CSP and security headers are set in `next.config.ts`. `script-src` carries
`'unsafe-inline'` (Next hydration scripts) and `'unsafe-eval'`; tightening to
per-request nonces is a deferred follow-up. **Subresource Integrity is
intentionally disabled** — on Vercel the build-time hashes didn't match the
CDN-served bytes, which blocked hydration; re-enable only after a matching-bytes
CI check. See `SECURITY.md`.

### Authoring ABAP content — cite SAP Docs, don't guess
`docs/AUTHORING.md` is authoritative: **every ABAP API claim in a lesson must be
backed by a SAP Docs MCP search result, never by training-cutoff recall** (the
ABAP Cloud / released-API surface drifts every release). The `sap-docs` MCP
server is wired in `.mcp.json` (`http://localhost:3124/mcp`, brought up via
`docker compose up -d --build sap-docs`). abaplint is only the *style/parser*
gate; *semantic* Clean Core findings (released-API usage) are an ATC concern.

### Observability / instrumentation
`instrumentation.ts` is the Next instrumentation hook; `src/lib/observability.ts`
holds the app's telemetry helpers. Sentry is scaffolded via `NEXT_PUBLIC_SENTRY_DSN`
but no-ops when the DSN is empty.

## Conventions / gotchas

- `cd ~/projects/clean-core-academy` first — never run git/build from `~`.
- Package manager is **npm** (`package-lock.json`). Node **>= 20** (CI uses 22).
- Don't move shell infra into a pack (and vice-versa) — `content-packs/README.md`
  lists exactly what stays in the shell.
- `/privacy` and `/terms` are placeholder pages; if you change anything
  user-data-related, update both and flag it in the PR.
- Build artifacts: `.next/`, `tsconfig.tsbuildinfo`, `test-results/`.

## Known drift — do not trust blindly

This repo is a single-pack ABAP rebuild of a multi-pack shell. The following
inherited material references things that **don't exist here**:

- **`.env.example`** documents v2/roadmap features whose source files are absent:
  the *Adept* designer lane + `NEXT_PUBLIC_ADEPT_ENABLED` (no `src/middleware.ts`
  in this repo), `src/lib/journey-decoder.ts`, `LearningGoalCapture.tsx` /
  `DesignerJourneyDecoder.tsx`, Clerk auth, Neon `DATABASE_URL`, and the
  OpenRouter `router.ts` wiring. Treat these as roadmap, not current behavior.
- **`content-packs/README.md`** documents demo packs (`cca-f-prep`,
  `learn-french`, `sample-pack`, `sewing-beginners`) and a `web/` directory
  prefix — none exist here. The swap *mechanism* it describes is accurate.
- **`e2e/` specs** target the old demo brand (advisory, not re-pointed).
- The **exam-domain subsystem** (`src/content/domains.ts`, `domain-map.ts`) is
  CCA-F-specific shell infra this academy doesn't use; `domain-map.ts` is
  intentionally empty.
