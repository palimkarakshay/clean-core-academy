/* ------------------------------------------------------------------
   In-app abaplint check.

   POST /api/lint-abap  { code: string, filename?: string }
     → { issues: AbapLintIssue[], clean: boolean }

   Lints a learner's ABAP exercise submission with the Clean Core
   ruleset (exercises/abaplint.json) and returns the findings. abaplint
   only *parses* the source — it never executes it — so untrusted input
   is safe; we still bound the size. nodejs runtime: @abaplint/core is a
   Node library, not edge-compatible.
------------------------------------------------------------------ */

import { NextResponse } from "next/server";
import { lintAbap, MAX_ABAP_CHARS } from "@/lib/abap/lintAbap";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const code = (body as { code?: unknown }).code;
  if (typeof code !== "string" || code.trim().length === 0) {
    return NextResponse.json(
      { error: "body must include a non-empty 'code' string" },
      { status: 400 }
    );
  }
  if (code.length > MAX_ABAP_CHARS) {
    return NextResponse.json(
      { error: `code too long (max ${MAX_ABAP_CHARS} chars)` },
      { status: 413 }
    );
  }

  const rawName = (body as { filename?: unknown }).filename;
  const filename = typeof rawName === "string" ? rawName : undefined;

  try {
    const issues = lintAbap(code, filename);
    return NextResponse.json(
      { issues, clean: issues.length === 0 },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "lint failed", detail: String(err) },
      { status: 500 }
    );
  }
}
