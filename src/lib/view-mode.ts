/* ------------------------------------------------------------------
   Content-structure view-mode store.

   Holds the learner's preferred way of working through a module:

     - "tabs"  → the Current structure: a tabbed module screen
                 (Goals / Lessons / Flashcards / Quiz / Apply / Games).
     - "rise"  → the simplified RISE structure: one scrolling
                 Learn → Practice → Test → Apply flow, revealed a step
                 at a time.

   Both are different *renderings* of the same pack content and share
   the same progress store, so a learner can flip between them at any
   time without losing progress.

   Hydration-safety (same contract as track-filter): the server snapshot
   and the *first* client snapshot are both the default ("tabs", the
   established structure). The persisted choice is read from localStorage
   inside `subscribe`, which only runs after mount — so the first client
   render matches the server and there is no hydration mismatch. The view
   swaps in a post-mount update.
------------------------------------------------------------------ */

import { useSyncExternalStore } from "react";

export type ViewMode = "tabs" | "rise";

export const DEFAULT_VIEW_MODE: ViewMode = "tabs";

// Owns this key literal (see storage-key-discipline.test.ts — this is a
// fresh suffix, not one of the guarded progress/theme/games keys).
const STORAGE_KEY = "clean-core-academy:view-mode:v1";

function isViewMode(v: string): v is ViewMode {
  return v === "tabs" || v === "rise";
}

let current: ViewMode = DEFAULT_VIEW_MODE;
let loaded = false;
const listeners = new Set<() => void>();

function load(): void {
  if (loaded) return;
  loaded = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && isViewMode(raw)) current = raw;
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

export function getViewMode(): ViewMode {
  return current;
}

export function setViewMode(next: ViewMode): void {
  if (current === next) return;
  current = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* ignore */
  }
  emit();
}

/** React hook — the selected content-structure view, reactive across the tree. */
export function useViewMode(): ViewMode {
  return useSyncExternalStore(
    subscribe,
    getViewMode,
    () => DEFAULT_VIEW_MODE
  );
}
