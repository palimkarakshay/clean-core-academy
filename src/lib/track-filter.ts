/* ------------------------------------------------------------------
   Track-filter store.

   Holds the learner's currently-selected track (one `Audience` or
   "all") so the track tabs and the module list on the course home
   stay in sync, and the choice survives reloads.

   Hydration-safety: both the server snapshot and the *first* client
   snapshot are "all" (the full module list). The persisted value is
   read from localStorage inside `subscribe`, which only runs after
   mount — so the first client render matches the server and there is
   no hydration mismatch. The list narrows in a post-mount update.
------------------------------------------------------------------ */

import { useSyncExternalStore } from "react";
import type { Audience } from "@/content/curriculum-types";
import { AUDIENCE_IDS } from "@/content/audiences";

export type Track = Audience | "all";

const STORAGE_KEY = "clean-core-academy:track:v1";

function isTrack(v: string): v is Track {
  return v === "all" || (AUDIENCE_IDS as string[]).includes(v);
}

let current: Track = "all";
let loaded = false;
const listeners = new Set<() => void>();

function load(): void {
  if (loaded) return;
  loaded = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && isTrack(raw)) current = raw;
  } catch {
    /* storage unavailable — keep default */
  }
}

function emit(): void {
  for (const l of listeners) l();
}

function subscribe(cb: () => void): () => void {
  // Read the persisted value lazily, on first subscription (client
  // only) — keeps the initial snapshot === server snapshot.
  load();
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function getTrack(): Track {
  return current;
}

export function setTrack(next: Track): void {
  if (current === next) return;
  current = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* ignore */
  }
  emit();
}

/** React hook — the selected track, reactive across the tree. */
export function useTrack(): Track {
  return useSyncExternalStore(
    subscribe,
    getTrack,
    () => "all" as Track
  );
}
