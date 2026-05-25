/* ------------------------------------------------------------------
   Skills-matrix self-rating store — pack-aware.

   The learner rates each module skill on the skills matrix
   (/[packId]/skills): "none" → "learning" → "confident". Choice
   persists in localStorage, namespaced by pack id, so the competency
   map survives reloads. Mirrors lesson-depth's StorageDriver pattern.

   Storage shape:
     <pack-id>:skills:v1 → { [skillId]: SkillLevel }
------------------------------------------------------------------ */

import type { StorageDriver } from "./storage/driver";
import { createLocalDriver } from "./storage/local-driver";

export type SkillLevel = "none" | "learning" | "confident";

export type SkillStore = Record<string, SkillLevel>;

/** Stable empty snapshot for SSR / first paint (must keep one identity
 *  so useSyncExternalStore doesn't loop). */
export const EMPTY_SKILLS: SkillStore = Object.freeze({});

function storageKey(packId: string): string {
  return `${packId}:skills:v1`;
}

function sanitize(raw: unknown): SkillStore {
  if (!raw || typeof raw !== "object") return {};
  return raw as SkillStore;
}

const drivers = new Map<string, StorageDriver<SkillStore>>();
const listeners = new Set<() => void>();

function driverFor(packId: string): StorageDriver<SkillStore> {
  let d = drivers.get(packId);
  if (!d) {
    d = createLocalDriver<SkillStore>({
      storageKey: storageKey(packId),
      initial: () => ({}),
      sanitize,
    });
    d.subscribe(notify);
    drivers.set(packId, d);
  }
  return d;
}

function notify(): void {
  for (const l of listeners) l();
}

/** Whole store for one pack — stable reference until a write. */
export function getSkillStore(packId: string): SkillStore {
  return driverFor(packId).getSnapshot();
}

export function setSkillLevel(
  packId: string,
  skillId: string,
  level: SkillLevel
): void {
  const d = driverFor(packId);
  d.setSnapshot({ ...d.getSnapshot(), [skillId]: level });
}

export function subscribeSkills(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function getServerSkillStore(): SkillStore {
  return EMPTY_SKILLS;
}
