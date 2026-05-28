"use client";

/* ------------------------------------------------------------------
   Learner identity holder.

   The LMS owns user assignment/enrolment; a SCORM package can only read
   who it was launched for (cmi.core.student_name). The bridge pushes
   that name in here on init and the player reads it via useLearnerName()
   to show "Signed in as …". A tiny external store keeps it out of React
   context so the headless bridge and the player share it without
   prop-drilling. Empty string off-LMS (the normal web deploy).
------------------------------------------------------------------ */

import { useSyncExternalStore } from "react";

let learnerName = "";
const listeners = new Set<() => void>();

/** Set by the SCORM bridge once the LMS session is initialized. */
export function setLearnerName(name: string): void {
  const next = (name ?? "").trim();
  if (next === learnerName) return;
  learnerName = next;
  for (const l of listeners) l();
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot(): string {
  return learnerName;
}

// Stable empty value for SSR / first client render — avoids a hydration
// mismatch on the static export, which renders with no LMS present.
function getServerSnapshot(): string {
  return "";
}

/** LMS learner display name, or "" when not running inside an LMS. */
export function useLearnerName(): string {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
