/* ------------------------------------------------------------------
   Pack registry.

   This academy ships a single course — the Clean Core Academy ABAP
   curriculum. The registry stays as the runtime index (so the
   `[packId]` routes, the chrome's URL→pack resolution, and the
   per-pack storage keys keep working unchanged), but there is only
   one entry. Pack lookup happens at request time from the URL
   `[packId]` segment (see `app/[packId]/layout.tsx`).
------------------------------------------------------------------ */

import { pack as cleanCorePack } from "../../content-packs/clean-core-academy";
import type { ContentPack } from "./pack-types";

export const PACK_REGISTRY: Record<string, ContentPack> = {
  "clean-core-academy": cleanCorePack,
};

export const ALL_PACK_IDS: string[] = Object.keys(PACK_REGISTRY);

export const ALL_PACKS: ContentPack[] = Object.values(PACK_REGISTRY);

export function getPack(id: string): ContentPack | null {
  // Object.hasOwn guards against prototype-key leakage — route params
  // like "toString" or "__proto__" must return null, not
  // Object.prototype members.
  return Object.hasOwn(PACK_REGISTRY, id) ? PACK_REGISTRY[id] : null;
}

/**
 * Default pack id: env-var override if present, otherwise the first
 * (only) registered pack.
 */
export const DEFAULT_PACK_ID: string =
  (process.env.NEXT_PUBLIC_CONTENT_PACK_ID &&
  PACK_REGISTRY[process.env.NEXT_PUBLIC_CONTENT_PACK_ID]
    ? process.env.NEXT_PUBLIC_CONTENT_PACK_ID
    : ALL_PACK_IDS[0]) ?? "clean-core-academy";
