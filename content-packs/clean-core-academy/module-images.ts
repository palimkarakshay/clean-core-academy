/* ------------------------------------------------------------------
   Module artwork — themed Lucide icon names per module.

   Earlier this pack generated AI thumbnails at runtime from
   image.pollinations.ai. That was a live external dependency: a cold
   seed measured ~80s and there was no fallback, so a slow/blocked CDN
   blanked every module tile and the hero on the projector. We now ship
   crisp, on-brand vector icons instead — zero network calls, instant,
   and consistent with the navy/teal theme.

   This module is pure data: it maps each Section.id to a Lucide icon
   *name*. The shell resolves names to components (see
   src/components/primitives/ModuleIcon.tsx), keeping this file free of
   React / lucide imports so the pack stays declarative.
------------------------------------------------------------------ */

import type { Section } from "./_types";

/** One on-theme Lucide icon name per module (keyed by Section.id). */
const MODULE_ICON: Record<string, string> = {
  "m01-foundations": "shield-check",
  "m02-hana-readiness": "database",
  "m03-language": "code",
  "m04-abap-cloud": "cloud",
  "m05-released-apis": "plug",
  "m06-cds-amdp": "layers",
  "m07-performance": "gauge",
  "m08-atc-migration": "clipboard-check",
  "m09-tools": "wrench",
  "m10-gotchas": "triangle-alert",
  "m11-did-you-know": "lightbulb",
  "m12-recipes": "book-open",
  "m13-capstones": "trophy",
  "m14-delivery": "users",
  "b01-management": "briefcase",
  "b02-key-users": "sliders-horizontal",
  "b03-orientation": "compass",
};

/** The Lucide icon name for a module, or undefined if none mapped. */
export function moduleIcon(sectionId: string): string | undefined {
  return Object.hasOwn(MODULE_ICON, sectionId)
    ? MODULE_ICON[sectionId]
    : undefined;
}

/**
 * Attach a themed icon name to sections that don't already carry one,
 * without mutating the source module objects. A section that already
 * sets `icon` keeps it; one with no mapped icon is returned unchanged.
 */
export function withModuleIcons(sections: Section[]): Section[] {
  return sections.map((s) => {
    if (s.icon) return s;
    const icon = moduleIcon(s.id);
    return icon ? { ...s, icon } : s;
  });
}
