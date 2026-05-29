"use client";

import { type ReactNode } from "react";
import { useViewMode } from "@/lib/view-mode";
import { ViewModeToggle } from "./ViewModeToggle";

interface SectionViewSwitchProps {
  /** The Current (tabbed) module screen, server-rendered. */
  tabsView: ReactNode;
  /** The RISE (guided linear flow) module screen, server-rendered. */
  flowView: ReactNode;
}

/**
 * Renders BOTH module structures and reveals the one the learner has
 * chosen, toggling visibility with `hidden` rather than unmounting — the
 * same render-all-then-hide approach SectionTabs uses for its panels, so
 * transient UI state (a flipped flashcard, an in-progress check) survives
 * a flip. Both subtrees are server-rendered and hydrate once; switching
 * is a pure visibility change with no navigation and no progress loss.
 *
 * SSR + first paint show the default ("tabs"); a persisted "rise"
 * preference swaps in on the first post-mount commit (see view-mode.ts).
 */
export function SectionViewSwitch({
  tabsView,
  flowView,
}: SectionViewSwitchProps) {
  const mode = useViewMode();
  return (
    <div>
      <div className="mb-4 flex items-center justify-end">
        <ViewModeToggle />
      </div>
      <div hidden={mode !== "tabs"}>{tabsView}</div>
      <div hidden={mode !== "rise"}>{flowView}</div>
    </div>
  );
}
