/* ------------------------------------------------------------------
   AI cost controls — the defenses that sit around `generate()`.

   Per the v2 plan §9 the AI router must be protected by: (1) a
   per-tenant rate limit, (2) a per-tenant token-budget circuit
   breaker, and (3) a result cache to dedupe identical prompts. On top
   of those per-tenant guards we add process-wide GLOBAL ceilings as a
   blast-radius backstop.

   This module is the single home for all of them so the router body
   stays a thin orchestration. It is server-only by construction.

   Scope caveat (read before trusting this in prod)
   ------------------------------------------------
   The rate limiter and budget breaker are IN-PROCESS (Map-backed).
   On multi-instance / multi-region serverless each instance keeps its
   own counters, so the effective limit is per-instance, not global.
   That is acceptable for a first reference cut (zero extra infra) and
   still stops a single hot instance from runaway spend. A true
   cross-instance limiter needs a shared store (Vercel KV / Upstash);
   because the seam is isolated here, swapping the store later is a
   one-file change and does not touch the router contract.

   Limits are read from env at call time so they can be tuned per
   deployment (and overridden in tests) without a rebuild.
------------------------------------------------------------------ */

import "server-only";
import { createLRU } from "../lru-cache";

function intEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

// ---- result cache ----------------------------------------------------------
/** The success-variant payload of a generation, cached by prompt. */
export interface CachedGeneration {
  text: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
}

// Cap is generous but bounded; the cache dedupes repeated identical prompts
// (e.g. a debounced caller firing on the same input) to protect token spend.
const resultCache = createLRU<string, CachedGeneration>(256);

/** Stable cache key over the inputs that determine the output. */
export function cacheKey(model: string, system: string, user: string, maxTokens: number): string {
  // maxTokens is part of the key: a smaller-cap (possibly truncated) call must
  // not poison the cache for a later full-length call with the same prompt.
  return JSON.stringify([model, system, user, maxTokens]);
}

export function getCached(key: string): CachedGeneration | undefined {
  return resultCache.get(key);
}

export function setCached(key: string, value: CachedGeneration): void {
  resultCache.set(key, value);
}

// ---- per-tenant rate limit (fixed-window counter) --------------------------
interface Window {
  count: number;
  resetAt: number;
}
const rateWindows = new Map<string, Window>();

/**
 * Returns true and consumes one unit if the tenant is under the per-minute
 * cap. `AI_RATE_LIMIT_PER_MIN <= 0` disables the limit.
 */
export function rateLimitOk(tenant: string, now: number = Date.now()): boolean {
  const max = intEnv("AI_RATE_LIMIT_PER_MIN", 20);
  if (max <= 0) return true;
  const w = rateWindows.get(tenant);
  if (!w || now >= w.resetAt) {
    rateWindows.set(tenant, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (w.count >= max) return false;
  w.count += 1;
  return true;
}

// ---- per-tenant token-budget circuit breaker ------------------------------
interface Budget {
  used: number;
  resetAt: number;
}
const budgets = new Map<string, Budget>();

/**
 * Returns true if the tenant still has token budget for the day.
 * `AI_TOKEN_BUDGET_PER_DAY <= 0` disables the breaker. Checked BEFORE the
 * call; actual consumption is recorded afterwards via {@link recordTokens}.
 */
export function budgetOk(tenant: string, now: number = Date.now()): boolean {
  const max = intEnv("AI_TOKEN_BUDGET_PER_DAY", 200_000);
  if (max <= 0) return true;
  const b = budgets.get(tenant);
  if (!b || now >= b.resetAt) return true; // fresh window = full budget
  return b.used < max;
}

/** Record tokens consumed by a successful call against the tenant's daily budget. */
export function recordTokens(tenant: string, tokens: number, now: number = Date.now()): void {
  const max = intEnv("AI_TOKEN_BUDGET_PER_DAY", 200_000);
  if (max <= 0 || tokens <= 0) return;
  const b = budgets.get(tenant);
  if (!b || now >= b.resetAt) {
    budgets.set(tenant, { used: tokens, resetAt: now + 24 * 60 * 60_000 });
  } else {
    b.used += tokens;
  }
}

// ---- global ceilings (blast-radius backstop) ------------------------------
// Per-tenant limits key on an identity the caller can reset (e.g. an anonymous
// cookie), so a caller cycling identities could otherwise evade them. These
// GLOBAL ceilings bound total spend across ALL tenants regardless of identity
// churn — a process-wide backstop, not a fairness control. Caps are higher than
// per-tenant; `<= 0` disables. Same in-process/per-instance caveat applies.
const globalRate: Window = { count: 0, resetAt: 0 };
const globalBudget: Budget = { used: 0, resetAt: 0 };

/** Process-wide rate ceiling across all tenants. */
export function globalRateLimitOk(now: number = Date.now()): boolean {
  const max = intEnv("AI_GLOBAL_RATE_LIMIT_PER_MIN", 120);
  if (max <= 0) return true;
  if (now >= globalRate.resetAt) {
    globalRate.count = 1;
    globalRate.resetAt = now + 60_000;
    return true;
  }
  if (globalRate.count >= max) return false;
  globalRate.count += 1;
  return true;
}

/** Process-wide daily token-budget ceiling across all tenants. */
export function globalBudgetOk(now: number = Date.now()): boolean {
  const max = intEnv("AI_GLOBAL_TOKEN_BUDGET_PER_DAY", 1_000_000);
  if (max <= 0) return true;
  if (now >= globalBudget.resetAt) return true;
  return globalBudget.used < max;
}

/** Record tokens against the process-wide daily budget. */
export function recordGlobalTokens(tokens: number, now: number = Date.now()): void {
  const max = intEnv("AI_GLOBAL_TOKEN_BUDGET_PER_DAY", 1_000_000);
  if (max <= 0 || tokens <= 0) return;
  if (now >= globalBudget.resetAt) {
    globalBudget.used = tokens;
    globalBudget.resetAt = now + 24 * 60 * 60_000;
  } else {
    globalBudget.used += tokens;
  }
}

/** Test-only — drop all in-process counters and the cache between cases. */
export function __resetCostControlsForTests(): void {
  resultCache.clear();
  rateWindows.clear();
  budgets.clear();
  globalRate.count = 0;
  globalRate.resetAt = 0;
  globalBudget.used = 0;
  globalBudget.resetAt = 0;
}
