import {
  BookOpen,
  Briefcase,
  ClipboardCheck,
  Cloud,
  Code,
  Compass,
  Database,
  Gauge,
  Layers,
  Lightbulb,
  Plug,
  ShieldCheck,
  SlidersHorizontal,
  TriangleAlert,
  Trophy,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Resolves a pack-supplied Lucide icon *name* (from a module's `icon`
 * field — see content-packs/<id>/module-images.ts) to a component and
 * renders it inside a themed rounded tile. Pure, server-renderable, no
 * network — this replaced the runtime-fetched AI thumbnails so module
 * tiles can never blank out on a slow/blocked CDN.
 */
const ICONS: Record<string, LucideIcon> = {
  "book-open": BookOpen,
  briefcase: Briefcase,
  "clipboard-check": ClipboardCheck,
  cloud: Cloud,
  code: Code,
  compass: Compass,
  database: Database,
  gauge: Gauge,
  layers: Layers,
  lightbulb: Lightbulb,
  plug: Plug,
  "shield-check": ShieldCheck,
  "sliders-horizontal": SlidersHorizontal,
  "triangle-alert": TriangleAlert,
  trophy: Trophy,
  users: Users,
  wrench: Wrench,
};

export function ModuleIcon({
  name,
  className,
}: {
  name: string | undefined;
  className?: string;
}) {
  const Icon = (name && ICONS[name]) || BookOpen;
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex flex-none items-center justify-center rounded-lg border border-(--accent)/25 bg-(--accent)/10 text-(--accent-2)",
        className
      )}
    >
      <Icon className="h-1/2 w-1/2" />
    </span>
  );
}
