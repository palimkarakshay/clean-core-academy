/* ------------------------------------------------------------------
   SCORM runtime adapter.

   Bridges the running course to an LMS via the SCORM JavaScript API,
   supporting both SCORM 1.2 (window.API) and 2004 (window.API_1484_11).
   The API is discovered by walking up the frame chain — the standard
   SCORM lookup. Every method is a safe no-op when no API is found, so
   importing this on the normal web deploy does nothing and ships no
   behavior change. Only the SCORM package (served inside an LMS frame)
   has an API to talk to.
------------------------------------------------------------------ */

import type { ScormStatus } from "./summary";

interface LMSApi12 {
  LMSInitialize: (arg: string) => string;
  LMSFinish: (arg: string) => string;
  LMSGetValue: (key: string) => string;
  LMSSetValue: (key: string, value: string) => string;
  LMSCommit: (arg: string) => string;
}

interface LMSApi2004 {
  Initialize: (arg: string) => string;
  Terminate: (arg: string) => string;
  GetValue: (key: string) => string;
  SetValue: (key: string, value: string) => string;
  Commit: (arg: string) => string;
}

type Found =
  | { version: "1.2"; api: LMSApi12 }
  | { version: "2004"; api: LMSApi2004 };

const MAX_FRAME_DEPTH = 12;

function findInWindow(start: Window | null): Found | null {
  let win: Window | null = start;
  let depth = 0;
  while (win && depth < MAX_FRAME_DEPTH) {
    const w = win as unknown as {
      API?: LMSApi12;
      API_1484_11?: LMSApi2004;
    };
    if (w.API_1484_11) return { version: "2004", api: w.API_1484_11 };
    if (w.API) return { version: "1.2", api: w.API };
    if (win.parent === win) break;
    win = win.parent;
    depth++;
  }
  return null;
}

function discover(): Found | null {
  if (typeof window === "undefined") return null;
  return (
    findInWindow(window) ??
    (window.opener ? findInWindow(window.opener as Window) : null)
  );
}

let found: Found | null = null;
let initialized = false;

/** True once an LMS API has been found and initialized. */
export function isScormActive(): boolean {
  return initialized && found != null;
}

/** Discover + initialize the LMS session. Returns false off-LMS. */
export function scormInit(): boolean {
  if (initialized) return found != null;
  found = discover();
  initialized = true;
  if (!found) return false;
  if (found.version === "2004") found.api.Initialize("");
  else found.api.LMSInitialize("");
  return true;
}

function set(key12: string, key2004: string, value: string): void {
  if (!found) return;
  if (found.version === "2004") found.api.SetValue(key2004, value);
  else found.api.LMSSetValue(key12, value);
}

function get(key12: string, key2004: string): string {
  if (!found) return "";
  return found.version === "2004"
    ? found.api.GetValue(key2004)
    : found.api.LMSGetValue(key12);
}

export interface ScormProgress {
  status: ScormStatus;
  /** 0–100. */
  scoreRaw: number;
  suspendData?: string;
}

export function scormSetProgress(p: ScormProgress): void {
  if (!found) return;
  if (found.version === "2004") {
    // 2004 splits completion + success.
    set("", "cmi.completion_status", p.status === "incomplete" ? "incomplete" : "completed");
    set("", "cmi.success_status", p.status === "passed" || p.status === "completed" ? "passed" : "unknown");
    set("", "cmi.score.raw", String(p.scoreRaw));
    set("", "cmi.score.min", "0");
    set("", "cmi.score.max", "100");
    set("", "cmi.score.scaled", String(p.scoreRaw / 100));
  } else {
    // 1.2 uses a single lesson_status.
    set("cmi.core.lesson_status", "", p.status);
    set("cmi.core.score.raw", "", String(p.scoreRaw));
    set("cmi.core.score.min", "", "0");
    set("cmi.core.score.max", "", "100");
  }
  if (p.suspendData != null) {
    // 1.2 caps suspend_data at 4096 chars; keep the payload tiny.
    set("cmi.suspend_data", "cmi.suspend_data", p.suspendData.slice(0, 4000));
  }
}

export function scormGetSuspendData(): string {
  return get("cmi.suspend_data", "cmi.suspend_data");
}

export function scormCommit(): void {
  if (!found) return;
  if (found.version === "2004") found.api.Commit("");
  else found.api.LMSCommit("");
}

export function scormTerminate(): void {
  if (!found || !initialized) return;
  scormCommit();
  if (found.version === "2004") found.api.Terminate("");
  else found.api.LMSFinish("");
  initialized = false;
  found = null;
}
