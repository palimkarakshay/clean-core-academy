/* ------------------------------------------------------------------
   AI router — the single seam between the app and any LLM provider.

   Per the v2 plan §9:

     "All AI calls go through `lib/ai/router.ts` — a single file,
      one function `generate({ system, user, model })`. No provider
      SDK calls outside this file."

   Rules
   -----
   1. Do NOT import a provider SDK (`@anthropic-ai/sdk`, `openai`,
      `@ai-sdk/anthropic`, …) outside this file. All access goes
      through the Vercel AI Gateway via the AI SDK's default provider,
      so a bare "provider/model" string is the only model reference.
   2. Do NOT use provider-specific features (prompt caching, XML tool
      use, etc.) in core paths. When they land, isolate them behind a
      helper with a graceful fallback.
   3. Prompt templates live in `prompts/*.md` and are imported as
      strings, never inlined.
   4. The router is server-only — never expose to the client bundle.
      Any future AI callsite hits a route handler that itself calls
      this module; there is no consumer route wired in this repo yet.

   Status
   ------
   Lit up via Vercel AI Gateway + AI SDK v6 (`generateText`). With no
   gateway credential (`AI_GATEWAY_API_KEY` or a Vercel OIDC token)
   `generate()` returns the "not-configured" result BEFORE any network
   call — the "AI off = no spend" guarantee. The contract below is the
   stable seam any future feature flag depends on.

   Cost defenses (per-tenant rate limit, daily token-budget circuit
   breaker, result cache, plus process-wide ceilings) live in
   `./cost-controls` and are applied around the provider call below.
   They surface as the reserved `rate-limited` / `budget-exceeded`
   result reasons.
------------------------------------------------------------------ */

import "server-only";
import { generateText } from "ai";
import { getVercelOidcTokenSync } from "@vercel/oidc";
import {
  cacheKey,
  getCached,
  setCached,
  rateLimitOk,
  budgetOk,
  recordTokens,
  globalRateLimitOk,
  globalBudgetOk,
  recordGlobalTokens,
} from "./cost-controls";

export type ModelSlug =
  | "anthropic/claude-haiku-4.5"
  | "anthropic/claude-sonnet-4.6"
  | "anthropic/claude-opus-4.8"
  | (string & {}); // open for any gateway slug we haven't named yet

export interface GenerateInput {
  /** System prompt — usually the markdown content of a prompts/*.md file. */
  system: string;
  /** User message. */
  user: string;
  /** Optional model override. Defaults to AI_DEFAULT_MODEL or Haiku. */
  model?: ModelSlug;
  /** Optional max output tokens for the response. Defaults to a sane cap. */
  maxTokens?: number;
  /**
   * Optional tenant/identity for per-tenant rate-limit + token budget.
   * Defaults to "global". Pass the authenticated org/user id at the callsite.
   */
  tenantId?: string;
  /** Set false to bypass the result cache for this call (default: cached). */
  cache?: boolean;
}

export type GenerateResult =
  | { ok: true; text: string; model: ModelSlug; promptTokens: number; completionTokens: number }
  | { ok: false; reason: "not-configured" | "rate-limited" | "budget-exceeded" | "upstream-error"; detail?: string };

const DEFAULT_MODEL: ModelSlug =
  (process.env.AI_DEFAULT_MODEL as ModelSlug | undefined) ?? "anthropic/claude-haiku-4.5";
const DEFAULT_MAX_TOKENS = 1024;

/** AI is "configured" when a gateway credential is present. */
function isConfigured(): boolean {
  if (process.env.AI_GATEWAY_API_KEY) return true;
  // Keyless Vercel: the OIDC token is request-scoped (x-vercel-oidc-token header),
  // not in process.env at runtime. getVercelOidcTokenSync() resolves it from the
  // ambient request context (or VERCEL_OIDC_TOKEN locally) and THROWS when absent.
  try {
    return Boolean(getVercelOidcTokenSync());
  } catch {
    return false;
  }
}

/**
 * The single entry point for AI generation. Returns a discriminated
 * union — callers MUST handle the disabled / error cases. There is
 * no thrown-exception path for "AI is off"; that state is reified.
 */
export async function generate(input: GenerateInput): Promise<GenerateResult> {
  // 1. "No key = no money": bail before ANY provider construction or network
  //    call. This is the load-bearing guarantee any feature flag relies on.
  if (!isConfigured()) {
    return { ok: false, reason: "not-configured" };
  }

  const model = input.model ?? DEFAULT_MODEL;
  const maxOutputTokens = input.maxTokens ?? DEFAULT_MAX_TOKENS;
  const tenant = input.tenantId ?? "global";
  const useCache = input.cache !== false;
  const now = Date.now();

  // 2. Result cache — repeated identical prompts cost nothing.
  const key = cacheKey(model, input.system, input.user, maxOutputTokens);
  if (useCache) {
    const hit = getCached(key);
    if (hit) {
      return { ok: true, text: hit.text, model: hit.model, promptTokens: hit.promptTokens, completionTokens: hit.completionTokens };
    }
  }

  // 3. Per-tenant rate limit, then the process-wide rate ceiling (the latter
  //    bounds spend even if a caller cycles tenant identities to evade #3).
  if (!rateLimitOk(tenant, now) || !globalRateLimitOk(now)) {
    return { ok: false, reason: "rate-limited" };
  }

  // 4. Per-tenant + process-wide daily token-budget circuit breaker.
  if (!budgetOk(tenant, now) || !globalBudgetOk(now)) {
    return { ok: false, reason: "budget-exceeded" };
  }

  // 5. Provider call through the Vercel AI Gateway. The bare "provider/model"
  //    string is resolved by the gateway (the AI SDK's default provider).
  try {
    const result = await generateText({
      model,
      system: input.system,
      prompt: input.user,
      maxOutputTokens,
    });
    const promptTokens = result.usage?.inputTokens ?? 0;
    const completionTokens = result.usage?.outputTokens ?? 0;

    const totalTokens = promptTokens + completionTokens;
    recordTokens(tenant, totalTokens, now);
    recordGlobalTokens(totalTokens, now);

    const payload = { text: result.text, model, promptTokens, completionTokens };
    if (useCache) setCached(key, payload);

    return { ok: true, ...payload };
  } catch (err) {
    return {
      ok: false,
      reason: "upstream-error",
      detail: err instanceof Error ? err.message : String(err),
    };
  }
}
