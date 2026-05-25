# Clean Core Academy

An interactive course that turns the SAP-modernization **cookbooks** in the
[`palimkarakshay/abap-utilities`](https://github.com/palimkarakshay/abap-utilities)
reference repo into hands-on lessons, delivered through a content-agnostic
learning-app shell (ported from `cca-f-prep/web/`).

Every lesson pairs:

- **concept notes** — the *why* (prose + key points),
- **before / after ABAP** — the anti-pattern and its Clean Core remedy, shown
  as side-by-side colour-coded code blocks, and
- a **"spot the Clean-Core violation" quiz** — 4-option MCQs that name the
  *principle*, not just the answer.

> **v0.1 status.** The **ABAP Anti-Patterns → Clean Core** module renders
> end-to-end (notes + before/after + MCQ + a "spot the violation" module check)
> in the shell, and its guard-clauses lesson ships an **in-app code exercise**
> whose submissions are linted live by abaplint — the planted `exit_or_check`
> violation is flagged until you refactor it to guard clauses. All five
> cookbook modules are authored, and the **Clean-Core readiness self-audit**
> (questionnaire → score → prioritized remediation) is live at `/<pack>/audit`.

The reference repo is **read-only** for this project — the academy only reads
its `docs/` and `src/*`; it never modifies `abap-utilities`.

---

## Modules (one per cookbook)

| # | Module | Source cookbook | Highlights |
|---|--------|-----------------|------------|
| 1 | **ABAP Anti-Patterns → Clean Core** *(v0.1 hero)* | `anti-patterns-playbook.md` | `SELECT *`, N+1 reads, unsorted dedup, deep nesting → guards, magic numbers, SQL injection |
| 2 | **Clean Core & ATC: don't touch the standard** | `clean-core-atc-cookbook.md` | table writes → API/RAP, table reads → CDS, non-released → wrapper, sy-fields → context API |
| 3 | **From BDC / CALL TRANSACTION to API / RAP** | `bdc-to-api-cookbook.md` | why batch input breaks, the API→RAP→OData decision tree, mass runs via EML |
| 4 | **Modernizing toward RAP / CDS** | `rap-cds-modernization.md` | report → CDS consumption view, module pool → RAP managed behaviour, VDM layering |
| 5 | **Converting classic apps to Fiori** | `fiori-conversion-cookbook.md` | SM30/SE16 → managed RAP app, ALV → Fiori List Report |
| 6 | **Clean Core Readiness: the self-audit** | `clean-core-readiness.md` | the ✅/⚠️/❌ buckets + a live **readiness self-audit** (questionnaire → score → remediation) |

### The readiness self-audit (`/<pack>/audit`)

A standalone interactive built from the reference repo's clean-core-readiness
matrix and cookbooks: a weighted **questionnaire** about your own codebase
(direct table writes, BDC, GUI apps, sy-fields, dynamic SQL, ATC usage, …)
produces a **readiness score + verdict** and a **prioritized remediation list**
sorted worst-first, each finding deep-linked to the module that fixes it. It is
data-driven from `Curriculum.readinessAudit`, so any pack can ship one; the
shell renders it generically and the home page surfaces a CTA when present.
(Module 6's own lessons + module check additionally drill the ✅/⚠️/❌ buckets.)

---

## Architecture

The app is a **content-agnostic Next.js shell** + a single **content pack**:

```
content-packs/clean-core-academy/   ← the course (the only thing that's course-specific)
  ├── pack.config.ts                ← branding, palette, nav, terminology, prerequisites
  ├── curriculum.ts                 ← 6 modules → lessons + quizzes + module checks,
  │                                   the m1-c4 code exercise, and the readinessAudit
  ├── icons.ts  index.ts  _types.ts
src/                                ← the shell (framework, components, progress engine) — pack-agnostic
  ├── app/[packId]/audit/           ← the readiness self-audit route
  ├── app/api/lint-abap/            ← server route: lints exercise submissions
  ├── lib/abap/lintAbap.ts          ← @abaplint/core + the shared ruleset
  └── components/{concept/CodeExercisePanel, audit/ReadinessAuditView}.tsx
exercises/                          ← abaplint.json (shared ruleset) + clean reference solutions
```

The active pack is selected by `NEXT_PUBLIC_CONTENT_PACK_ID` (default
`clean-core-academy`, set in `.env`), which resolves the `@active-pack` alias in
`next.config.ts` / `vitest.config.ts`. See `content-packs/README.md` for the
shell's pack contract and authoring guide.

**Before/after code** is a small, backward-compatible shell addition:
`LessonExample` gained optional `code` / `lang` / `variant` fields, and
`LessonBody` renders `variant: "before" | "after"` snippets as colour-coded
monospace blocks (`src/components/concept/LessonBody.tsx`).

The shell ships a second pack, **`acme-onboarding`** (a B2B demo fixture). It is
hidden from the course picker (`audience: "b2b"`) and its designer-lane surface
(`/adept`, `/for-teams`) is disabled via `NEXT_PUBLIC_ADEPT_ENABLED=0`, so the
academy is the only course a visitor sees. It is kept so the shell's B2B/contract
tests retain a fixture.

---

## Run it

```sh
npm install
npm run dev            # http://localhost:3000  → pick "Clean Core Academy"
```

Verification loop:

```sh
npm run type-check     # tsc --noEmit
npm test               # vitest — 295 unit/contract tests (incl. the abaplint + audit checks)
npm run lint           # eslint
npm run build          # next build (prerenders every module/concept/quiz/audit route)
npm run lint:abap      # abaplint over the ABAP reference solutions (see below)
```

---

## abaplint — checking code exercises

Code exercises are linted with the **same rules the reference repo uses**:
`exercises/abaplint.json` is a faithful copy of
[`abap-utilities/abaplint.json`](https://github.com/palimkarakshay/abap-utilities/blob/main/abaplint.json),
and it is the single source of truth for **both** the CLI and the in-app check.

**In-app (the learner flow).** The guard-clauses lesson (`m1-c4`) ships a code
exercise: the starter trips `exit_or_check` (a `CHECK` deep in a method). The
learner edits it in the lesson, clicks **Check with abaplint**, and the
submission is POSTed to `/api/lint-abap`, where `@abaplint/core` runs the
ruleset server-side and returns the findings. Refactor to guard clauses and the
check goes green. This is the v0.1 "submit a code exercise → see a planted
Clean-Core violation flagged" loop.

```
src/lib/abap/lintAbap.ts            ← @abaplint/core + the shared ruleset
src/app/api/lint-abap/route.ts      ← POST { code } → { issues, clean }
src/components/concept/CodeExercisePanel.tsx  ← the editor + results UI
```

**CLI / CI.**

```sh
npm run lint:abap      # abaplint exercises/abaplint.json — the clean reference solutions
```

`exercises/src/*.clas.abap` hold clean "after"-pattern solutions
(`zcl_au_ex_itab`, `zcl_au_ex_guard`) that pass abaplint, so the toolchain stays
green. The planted violation lives in the exercise *starter* data, not here.
`src/__tests__/lint-abap.test.ts` asserts (in `npm test`/CI) that the planted
starter is flagged and a guard-clause fix lints clean.

**Scope.** abaplint is the **style + parser** gate (keyword case, indentation,
`7bit_ascii`, `exit_or_check`, …). The **semantic** Clean Core findings
(released-API usage, `CLOUD_READINESS`) are an **ATC** concern — abaplint can't
resolve SAP's released-API classification offline, as module 6 explains.

---

## Inherited from the shell (follow-ups)

- The Playwright **e2e specs** (`e2e/`) still target the shell's original demo
  packs/brand and have not been re-pointed at `clean-core-academy`; `npm test`
  (vitest) is the wired gate for now.
- `content-packs/README.md` is the shell's authoring guide and references demo
  packs that this repo removed; the mechanism it documents is still accurate.
- The exam-domain subsystem (`src/content/domains.ts`, `domain-map.ts`) is
  CCA-F-specific shell infra the academy doesn't use; `domain-map.ts` is
  intentionally empty.
