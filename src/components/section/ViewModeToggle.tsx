"use client";

import { LayoutGrid, ScrollText } from "lucide-react";
import { useViewMode, setViewMode, type ViewMode } from "@/lib/view-mode";
import { cn } from "@/lib/utils";

const OPTIONS: {
  id: ViewMode;
  label: string;
  hint: string;
  Icon: typeof LayoutGrid;
}[] = [
  {
    id: "rise",
    label: "Guided flow",
    hint: "One scrolling Learn → Practice → Test → Apply path",
    Icon: ScrollText,
  },
  {
    id: "tabs",
    label: "Tabbed",
    hint: "Goals · Lessons · Flashcards · Quiz · Apply · Games tabs",
    Icon: LayoutGrid,
  },
];

/**
 * Segmented control that switches the module content structure between
 * the simplified RISE "Guided flow" and the Current "Tabbed" layout.
 * Both render the same content from the same progress store, so flipping
 * is instant and lossless. The preference persists across sessions.
 */
export function ViewModeToggle({ className }: { className?: string }) {
  const mode = useViewMode();
  return (
    <div
      role="radiogroup"
      aria-label="Module layout"
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-(--border) bg-(--panel-2) p-1",
        className
      )}
    >
      <span className="px-2 text-xs font-medium text-(--muted)">Layout</span>
      {OPTIONS.map(({ id, label, hint, Icon }) => {
        const active = mode === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            title={hint}
            onClick={() => setViewMode(id)}
            className={cn(
              "inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)",
              active
                ? "bg-(--accent) text-white shadow-sm"
                : "text-(--ink) hover:bg-(--panel)"
            )}
          >
            <Icon aria-hidden className="h-3.5 w-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
