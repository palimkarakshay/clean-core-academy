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
> in the shell. The other five modules and the Clean-Core readiness self-audit
> are authored on the same schema and render too; expand them over time.

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
| 6 | **Clean Core Readiness: the self-audit** | `clean-core-readiness.md` | the ✅/⚠️/❌ buckets; the **module check is the self-audit** — classify each statement/API |

The **self-audit** (module 6) is the interactive built from the reference repo's
clean-core-readiness matrix: the module check asks you to sort statements/APIs
into cloud-safe (✅), confirm/has-a-released-replacement (⚠️), or
on-premise-only (❌), and to name the released replacement.

---

## Architecture

The app is a **content-agnostic Next.js shell** + a single **content pack**:

```
content-packs/clean-core-academy/   ← the course (the only thing that's course-specific)
  ├── pack.config.ts                ← branding, palette, nav, terminology, prerequisites
  ├── curriculum.ts                 ← 6 modules → concepts → lessons + quizzes + module checks
  ├── icons.ts  index.ts  _types.ts
src/                                ← the shell (framework, components, progress engine) — pack-agnostic
exercises/                          ← ABAP code exercises + abaplint wiring (see below)
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
npm test               # vitest — 287 unit/contract tests
npm run lint           # eslint
npm run build          # next build (prerenders every module/concept/quiz route)
npm run lint:abap      # abaplint over the ABAP code exercises (see below)
```

---

## abaplint — checking code exercises

`exercises/` is a self-contained ABAP project so that code exercises can be
checked with the **same rules the reference repo uses**:
`exercises/abaplint.json` is a faithful copy of
[`abap-utilities/abaplint.json`](https://github.com/palimkarakshay/abap-utilities/blob/main/abaplint.json).

```sh
npm run lint:abap      # abaplint exercises/abaplint.json
```

- `exercises/src/*.clas.abap` hold clean "after"-pattern solutions
  (`zcl_au_ex_itab` — sorted dedup + `has_rows`; `zcl_au_ex_guard` — guard
  clauses). They pass abaplint, so the toolchain stays green.
- abaplint is the **style + parser** gate (keyword case, indentation,
  `7bit_ascii`, `exit_or_check`, …). The **semantic** Clean Core findings
  (released-API usage, `CLOUD_READINESS`) are an **ATC** concern — abaplint
  can't resolve SAP's released-API classification offline, as module 6 explains.
- To see the linter catch a violation, drop an anti-pattern into a
  `exercises/src/*.clas.abap` (e.g. a `CHECK` deep in nesting, a tab, or an
  `ENDSELECT` loop) and re-run `npm run lint:abap`.

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
