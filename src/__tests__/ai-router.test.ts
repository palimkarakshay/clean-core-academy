/* ------------------------------------------------------------------
   AI router contract.

   Pins the "no key = no money" guarantee: without a gateway credential
   (AI_GATEWAY_API_KEY or a Vercel OIDC token) generate() must return a
   structured `not-configured` result — never throw, never call the
   provider. This is the safety any future feature flag depends on (the
   AI surface can stay off and the calling code still reads cleanly via
   the disabled case).

   The router now calls the Vercel AI Gateway via the AI SDK's
   `generateText`, so we mock that (not global fetch) and assert the
   discriminated-union contract plus the cost defenses.
------------------------------------------------------------------ */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("ai", () => ({ generateText: vi.fn() }));

import { generateText } from "ai";
import { generate } from "../lib/ai/router";
import { __resetCostControlsForTests } from "../lib/ai/cost-controls";

const mockGenerateText = vi.mocked(generateText);

/** Build a minimal generateText result with the fields the router reads. */
function modelResult(text: string, inputTokens: number, outputTokens: number) {
  return { text, usage: { inputTokens, outputTokens, totalTokens: inputTokens + outputTokens } } as unknown as Awaited<
    ReturnType<typeof generateText>
  >;
}

describe("ai router", () => {
  beforeEach(() => {
    // Hermetic env: stub every credential/limit explicitly OFF via vi.stubEnv
    // so cross-file process.env pollution in vitest's shared worker can NEVER
    // leak a real credential into the "no key = no money" test (a credential
    // leak would make that load-bearing test flaky on cold full runs).
    // Individual tests stub what they need on top of this.
    vi.stubEnv("AI_GATEWAY_API_KEY", "");
    vi.stubEnv("VERCEL_OIDC_TOKEN", "");
    vi.stubEnv("AI_RATE_LIMIT_PER_MIN", "");
    vi.stubEnv("AI_TOKEN_BUDGET_PER_DAY", "");
    vi.stubEnv("AI_GLOBAL_RATE_LIMIT_PER_MIN", "");
    vi.stubEnv("AI_GLOBAL_TOKEN_BUDGET_PER_DAY", "");
    __resetCostControlsForTests();
    mockGenerateText.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("returns not-configured when no gateway credential is set, without calling the provider", async () => {
    const res = await generate({ system: "S", user: "U" });
    expect(res).toEqual({ ok: false, reason: "not-configured" });
    expect(mockGenerateText).not.toHaveBeenCalled();
  });

  it("does not throw on upstream error", async () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", "test-key");
    mockGenerateText.mockRejectedValue(new Error("502 Bad Gateway"));
    const res = await generate({ system: "S", user: "U" });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.reason).toBe("upstream-error");
      expect(res.detail).toContain("502");
    }
  });

  it("returns ok with text + token counts on success", async () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", "test-key");
    mockGenerateText.mockResolvedValue(modelResult("hello world", 12, 3));
    const res = await generate({ system: "S", user: "U", cache: false });
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.text).toBe("hello world");
      expect(res.promptTokens).toBe(12);
      expect(res.completionTokens).toBe(3);
      expect(res.model).toMatch(/anthropic\//);
    }
  });

  it("serves a cached result on an identical prompt without a second provider call", async () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", "test-key");
    mockGenerateText.mockResolvedValue(modelResult("cached", 5, 5));
    const a = await generate({ system: "S", user: "SAME" });
    const b = await generate({ system: "S", user: "SAME" });
    expect(a.ok && b.ok).toBe(true);
    expect(mockGenerateText).toHaveBeenCalledTimes(1);
  });

  it("rate-limits a tenant after the per-minute cap", async () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", "test-key");
    vi.stubEnv("AI_RATE_LIMIT_PER_MIN", "2");
    mockGenerateText.mockResolvedValue(modelResult("ok", 1, 1));
    // cache:false so each call passes the cache and consumes a rate-limit unit
    const r1 = await generate({ system: "S", user: "a", tenantId: "t1", cache: false });
    const r2 = await generate({ system: "S", user: "b", tenantId: "t1", cache: false });
    const r3 = await generate({ system: "S", user: "c", tenantId: "t1", cache: false });
    expect(r1.ok).toBe(true);
    expect(r2.ok).toBe(true);
    expect(r3.ok).toBe(false);
    if (!r3.ok) expect(r3.reason).toBe("rate-limited");
  });

  it("trips the token-budget circuit breaker once the daily budget is spent", async () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", "test-key");
    vi.stubEnv("AI_TOKEN_BUDGET_PER_DAY", "10");
    mockGenerateText.mockResolvedValue(modelResult("spendy", 6, 4)); // 10 tokens/call
    const first = await generate({ system: "S", user: "x", tenantId: "t2", cache: false });
    const second = await generate({ system: "S", user: "y", tenantId: "t2", cache: false });
    expect(first.ok).toBe(true); // consumes the full 10-token budget
    expect(second.ok).toBe(false);
    if (!second.ok) expect(second.reason).toBe("budget-exceeded");
  });

  it("trips the GLOBAL rate ceiling across distinct tenants (closes the identity-churn bypass)", async () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", "test-key");
    vi.stubEnv("AI_RATE_LIMIT_PER_MIN", "0"); // disable per-tenant to isolate the global cap
    vi.stubEnv("AI_GLOBAL_RATE_LIMIT_PER_MIN", "2");
    mockGenerateText.mockResolvedValue(modelResult("ok", 1, 1));
    // Each call uses a DIFFERENT tenantId — the per-tenant limiter would never
    // fire, but the process-wide ceiling must still bound total spend.
    const r1 = await generate({ system: "S", user: "a", tenantId: "fresh-1", cache: false });
    const r2 = await generate({ system: "S", user: "b", tenantId: "fresh-2", cache: false });
    const r3 = await generate({ system: "S", user: "c", tenantId: "fresh-3", cache: false });
    expect(r1.ok).toBe(true);
    expect(r2.ok).toBe(true);
    expect(r3.ok).toBe(false);
    if (!r3.ok) expect(r3.reason).toBe("rate-limited");
  });
});
