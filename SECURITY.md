# Security baseline + deferred-item ledger

This document captures the app's current security posture: the
mitigations that actually ship in **this** repo, and the items that
are deliberately deferred. The "Not yet implemented" list is written
to match the code, not a roadmap, so a reader can trust it.

> **Scope note.** This repo is the rebuilt, ABAP-only, single-pack
> academy. An earlier iteration carried a multi-pack B2B platform, a
> codex-review CI pipeline, auth/DB scaffolding, and Subresource
> Integrity. Those are **not** part of this repo — anything not listed
> under "Shipped" below is not in force here.

## Reporting a vulnerability

Email `palimkarakshay@users.noreply.github.com` (or open a private
GitHub Security Advisory on this repo). Do **not** open a public issue
for a security report.

## Shipped (in this repo)

### Content Security Policy + hardening headers

`next.config.ts` `headers()` applies to every route:

- `Content-Security-Policy` — `default-src 'self'`; no remote scripts;
  `frame-ancestors 'none'` (clickjacking); `object-src 'none'`;
  `upgrade-insecure-requests`. `script-src` keeps `'unsafe-inline'`
  (Next.js injects inline hydration scripts) and adds `'unsafe-eval'`
  **only in development** (Fast Refresh) — the production build drops
  it.
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — camera / microphone / geolocation /
  interest-cohort disabled.
- `Strict-Transport-Security` — 2-year max-age, includeSubDomains,
  preload-eligible.

### LLM boundary (single-seam discipline)

All LLM calls go through `src/lib/ai/router.ts` — no
`@anthropic-ai/sdk` / `openai` imports anywhere else in `src/`. The
router is `server-only`, reads `OPENROUTER_API_KEY` server-side, and
returns a structured `not-configured` result (it never throws) when no
key is set, so the disabled state is part of the type and every call
site handles it. It is a stub today; cost controls are deferred (below).
Prompt templates live in `prompts/*.md`, imported as strings — inlining
a system prompt in TypeScript is a review-blocker.

### Untrusted input on `/api/lint-abap`

The public lint endpoint feeds learner-submitted ABAP to
`@abaplint/core`, which **parses** the source — it never executes it.
Input is size-capped (`MAX_ABAP_CHARS` in `src/lib/abap/lintAbap.ts`)
and the response is `no-store`. There is no `eval` / exec path.

### Storage driver boundary

Direct `localStorage` access is confined to `src/lib/storage/` and the
storage-owner modules enumerated in
`src/__tests__/storage-key-discipline.test.ts`. Stores use
`createLocalDriver`, which swallows quota / disabled-storage errors so
a constrained browser never throws into a user flow. `loadProgressFor`
normalizes a corrupt or partial persisted blob to a safe shape rather
than crashing a later handler.

## Not yet implemented (deferred)

These are honestly **absent** from this repo today. Each carries a
re-evaluation trigger so the work isn't forgotten.

| Item | Why deferred | Re-evaluate when |
|---|---|---|
| Per-request nonce CSP (drop `'unsafe-inline'`) | Needs middleware + nonce propagation through Next's inline scripts | Tightening becomes a customer / compliance ask |
| Subresource Integrity (SRI) | `experimental.sri` was enabled then **reverted** — on Vercel the build-time hashes didn't match the CDN-served bytes and blocked hydration (see the note in `next.config.ts`) | A matching-bytes verification step exists in CI |
| CI pipeline (lint / type / test / e2e gates) | No `.github/` workflows in this repo; the local gates are the gate | The repo gains a CI runner |
| Dependabot + CODEOWNERS | No `.github/` config present | CI lands |
| Cross-engine a11y (WebKit + Firefox) | `playwright.config.ts` runs chromium desktop / tablet / mobile only; the WebKit + Firefox projects are commented out pending a green cross-engine pass | The cross-engine target-size / console-noise pass lands |
| AI cost controls (rate-limit, token-budget breaker, result cache) | The router is a stub with no live callers | The first paid AI path lights up |
| Auth / accounts, database, payments, telemetry | Not built — single-pack, client-only app | A paid tier / multi-device / cohort need appears |

## Operator notes

- The app is static + client-side with two server routes
  (`/api/health`, `/api/lint-abap`). There is no user-data store, no
  auth, and no PII collected; progress lives in the visitor's
  `localStorage`.
- `/privacy` and `/terms` are placeholder pages — populate them before
  collecting any user data.
