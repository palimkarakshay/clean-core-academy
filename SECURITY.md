# Security

Clean Core Academy is a Next.js learning app deployed on Vercel. It has
**no user accounts and no server database** today — all learner state
(progress, quiz attempts, display preferences) lives in the browser's
`localStorage`. The server surface is small: two route handlers
(`/api/health`, `/api/lint-abap`) plus the standard Next.js render/asset
paths.

> **Status note.** This repo was carved out of a larger, multi-pack B2B
> "learning shell." Earlier revisions of this file described a platform
> that does **not** exist here — an LLM PR-review pipeline
> (`codex-review`), `src/lib/feature-flags.ts`, an `/adept` designer lane
> gated by `src/middleware.ts`, "shipped" Subresource Integrity, checked-in
> `dependabot.yml` / `CODEOWNERS`, and a `web/` monorepo layout. None of
> those are in this repo. This version reflects what is actually in the
> tree. See [`CLAUDE.md`](./CLAUDE.md) for the broader inherited-drift map.

## Reporting a vulnerability

Email `palimkarakshay@users.noreply.github.com`, or open a private GitHub
Security Advisory on this repo. Please do **not** open a public issue for a
security report.

## What's actually in place

### Security headers + CSP (`next.config.ts`)

`next.config.ts` attaches a baseline CSP and hardening headers to every
response:

- **Content-Security-Policy** — `default-src 'self'`; `style-src 'self'
  'unsafe-inline'`; `img-src 'self' data: https:`; `font-src 'self' data:`;
  `connect-src 'self' https://claude.ai https://*.claude.ai` (the Ask-Claude
  hand-off); `frame-ancestors 'none'` (clickjacking); `object-src 'none'`;
  `form-action 'self'`; `base-uri 'self'`; `upgrade-insecure-requests`.
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — camera / microphone / geolocation / interest-cohort
  disabled.
- `Strict-Transport-Security` — 2-year max-age, includeSubDomains,
  preload-eligible.

**Known weaknesses (tracked in the ledger below):** `script-src` carries
both `'unsafe-inline'` (Next.js inline hydration scripts) **and**
`'unsafe-eval'`, and Subresource Integrity is **disabled**.

### Subresource Integrity — disabled (was enabled, broke hydration)

`experimental.sri` (sha-384) was enabled previously. On Vercel the
build-time integrity hashes did not match the bytes served from the CDN
(compression-layer differences), so the browser blocked the script, React
never hydrated, and the app was inert. It is disabled in `next.config.ts`
and should only be re-enabled behind a CI step that verifies the served
bytes match the build-time hash.

### Storage-driver boundary

Direct `localStorage` access is confined to `src/lib/storage/` and the
storage-owner modules registered in
`src/__tests__/storage-key-discipline.test.ts`. New stores go through
`createLocalDriver`, which swallows quota / disabled-storage errors so a
constrained browser never throws into a user flow. Keys are namespaced per
`pack.id`, so packs don't collide in one browser. (Note: the discipline
test currently covers a subset of live keys — see issues for the gap.)

### LLM single-seam (scaffolded, not wired)

All LLM calls are funneled through `src/lib/ai/router.ts`. No provider SDK
is imported anywhere else in `src/`. The router uses `server-only` to stay
out of the client bundle, and with no gateway credential (`AI_GATEWAY_API_KEY`
or a Vercel OIDC token) set it returns a structured `not-configured` result
rather than throwing. It is **scaffolded
and not yet wired** to any live feature. Separately, the **Ask Claude**
panel is a client-side hand-off that opens `claude.ai` in the browser — it
does not call the router, which is why `connect-src` allows `claude.ai`.

### CI gate

`.github/workflows/ci.yml` runs lint + type-check + unit/contract tests +
production build + `lint:abap` on every push and PR — hermetic, no secrets.

## Endpoint abuse surface (ledger)

### `POST /api/lint-abap` — unhardened (tracked)

Runs `@abaplint/core` on user-supplied ABAP source server-side. **Current
state: no authentication, no rate limiting, no explicit
timeout/`maxDuration`, and it returns raw parser error strings to the
client.** Risks: CPU/cost denial-of-service via repeated or pathological
input, and information disclosure via raw errors. Mitigations to add before
any public/high-traffic launch:

- per-IP rate limiting (Upstash / a Vercel WAF rule on the path),
- `export const maxDuration = <small>` so runaway parses are killed,
- an LRU cache of `hash(code) → issues` (the repo already ships
  `src/lib/lru-cache.ts`),
- a tighter request-body size cap and generic (non-raw) error responses.

### `GET /api/health`

Returns `{ ok, version, packId, time }`, `no-store`, no auth. Discloses the
app version and active pack id only — low sensitivity by design (it's a
liveness probe for uptime monitors).

## Client data

No personal data is collected server-side. Progress and preferences are
local to the browser and are **not** backed up or synced — clearing site
data destroys them (an export/import stopgap is tracked in issues). The full
curriculum, including quiz/mock answer keys, is currently serialized into the
client bundle via the pack context; treat answer keys as non-secret until
that is addressed (tracked below).

## Deferred / re-evaluation triggers

| Item | Trigger / priority |
|---|---|
| Remove `'unsafe-eval'` from `script-src` | Verify hydration still works — do soon; no known dependency needs it |
| Per-request nonce-based CSP (drop `'unsafe-inline'`) | When middleware is introduced |
| Re-enable SRI behind a matching-bytes CI check | When the CDN-hash mismatch can be verified in CI |
| Rate-limit + `maxDuration` + generic errors on `/api/lint-abap` | Before public launch or any unauthenticated traffic |
| Stop serializing the full curriculum (incl. answer keys) to the client | When auth/grading integrity matters |
| Progress export/import, then cross-device sync | When users ask / accounts ship |
| Auth / accounts | After sync lands |
| IndexedDB engine / Service-Worker offline | When localStorage limits or offline needs are hit |
| i18n / RTL | First non-English pack |

## Operator GitHub settings (recommended)

- **Settings → Code security and analysis** — enable Dependabot alerts and
  security updates. (No `dependabot.yml` is checked in yet; add one if you
  want automated version-bump PRs.)
- **Settings → Branches** — protect the default branch and require the `ci`
  workflow to pass before merge.
