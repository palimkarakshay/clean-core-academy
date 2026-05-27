# Clean Core Academy

An interactive ABAP developer academy for **SAP Clean Core & S/4HANA
readiness**, delivered through a content-agnostic learning-app shell. The
curriculum follows the 14-module *Clean Core & HANA Readiness* brief and is
restructured for four developer tracks (new → intermediate → expert → admin)
plus three independent business tracks (management, key & end users, other
stakeholders).

Every lesson pairs:

- **concept notes** — the *why* (prose + key points),
- **before / after ABAP** — the anti-pattern and its Clean Core remedy, shown
  as side-by-side colour-coded code blocks, and
- a **"spot the Clean-Core violation" quiz** — 4-option MCQs that name the
  *principle*, not just the answer.

> **Status.** The full **Clean Core & HANA Readiness** curriculum is authored —
> 13 developer/cross-cutting modules plus 3 business-track modules, each with
> concept notes + before/after ABAP + quizzes and a module check. The
> language-modernization module ships an **in-app code exercise** whose
> submissions are linted live by abaplint (the planted `exit_or_check` violation
> is flagged until you refactor to guard clauses). A **practice exam**, the
> **Clean-Core readiness self-audit** (`/<pack>/audit`), and a **per-module
> skills matrix** (`/<pack>/skills`) are all live.

Every lesson pairs concept notes, before/after ABAP, and quizzes; code shown is
written against S/4HANA 2023 (ABAP Platform 758).

---

## Tracks & modules

The course is **one body of content tagged for several audiences**. The course
home carries a **track filter** so each reader sees the modules for their role:

- **Developer ladder** — New → Intermediate → Expert → Admin.
- **Business lenses** — Management · Key & end users · Other stakeholders.

A module can serve several tracks (Foundations serves everyone; Performance
serves intermediate + admin). Modules with no tag appear in every track.

**Developer & cross-cutting (m01–m13)** — Clean Core Foundations · HANA Readiness
(the DB mindset) · ABAP Language Modernization · ABAP Cloud & RAP · Released APIs
& Extensibility Contracts · CDS, AMDP & Code Pushdown · Performance & SQL on HANA
· ATC, Custom-Code Migration & Simplification · Lesser-Known Tools & Utilities ·
Common Pitfalls & Defect Patterns · Advanced Techniques & Lesser-Known APIs ·
How-To Recipes · Capstone Scenarios.

**Business tracks (b01–b03)** — Clean Core for Management & Leads · Clean Core for
Key & End Users · Clean Core Orientation for Stakeholders.

A **practice exam** (`/<pack>/mock`) distils the curriculum's quiz bank.

### The readiness self-audit (`/<pack>/audit`)

A standalone interactive: a weighted **questionnaire** about your own codebase
(direct table writes, BDC, GUI apps, sy-fields, dynamic SQL, ATC usage, …)
produces a **readiness score + verdict** and a **prioritized remediation list**
sorted worst-first, each finding deep-linked to the module that fixes it. It is
data-driven from `Curriculum.readinessAudit`, so any pack can ship one; the
shell renders it generically and the course home surfaces a CTA when present.

---

## Architecture

The app is a **content-agnostic Next.js shell** + a single **content pack**:

```
content-packs/clean-core-academy/   ← the course (the only thing that's course-specific)
  ├── pack.config.ts                ← branding, palette, nav, terminology, prerequisites
  ├── curriculum.ts                 ← assembles the modules + practice exam + readinessAudit
  ├── modules/                      ← one Section per file (m01–m13, b01–b03) + exams.ts
  │                                   (m03-c1 ships the in-app abaplint code exercise)
  ├── icons.ts  index.ts  _types.ts
src/                                ← the shell (framework, components, progress engine) — pack-agnostic
  ├── app/[packId]/audit/           ← the readiness self-audit route
  ├── app/[packId]/skills/          ← the per-module skills matrix route
  ├── app/api/lint-abap/            ← server route: lints exercise submissions
  ├── content/audiences.ts          ← learner-track registry (new/intermediate/expert/admin + business)
  ├── lib/track-filter.ts           ← selected-track store backing the course-home filter
  ├── lib/abap/lintAbap.ts          ← @abaplint/core + the shared ruleset
  ├── lib/skills-store.ts           ← per-pack skill self-ratings (localStorage)
  └── components/{dashboard/TrackFilter, concept/CodeExercisePanel, audit/ReadinessAuditView, skills/SkillsMatrix}.tsx
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

The academy is the only course the shell delivers: the root path redirects
straight into it, and there is no multi-course picker or B2B/designer surface.

---

## Run it

```sh
npm install
npm run dev            # http://localhost:3000  → opens the Clean Core Academy course
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
