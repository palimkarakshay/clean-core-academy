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
 * Renders the module structure the learner has chosen — the Current tabbed
 * screen or the RISE guided flow — and ONLY that one.
 *
 * We render the active view conditionally (not both-then-`hidden`) on
 * purpose: the RISE flow's blocks have mount side effects (the first
 * LessonChunk marks its lesson read on reveal), so mounting a hidden flow
 * would silently advance a learner's progress — and partially satisfy the
 * section-test gate — just by visiting a section in tabbed mode. Rendering
 * only the active view keeps each structure's progress writes scoped to
 * when it is actually in use.
 *
 * Progress lives in a shared store keyed by concept/section id, so the
 * remount on switch loses no progress — only transient in-view UI state
 * (e.g. a half-scrolled flow), which is the expected cost of changing
 * layout. SSR + first paint render the default ("tabs"); a persisted
 * "rise" preference swaps in on the first post-mount commit (view-mode.ts),
 * so the first client render matches the server (no hydration mismatch).
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
      {mode === "rise" ? flowView : tabsView}
    </div>
  );
}
