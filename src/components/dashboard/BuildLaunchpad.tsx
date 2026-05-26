import {
  FolderGit2,
  GitFork,
  Rocket,
  Triangle,
  Sparkles,
  Workflow,
  Star,
  BookOpen,
  UserPlus,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import { buildLaunchpad, type LaunchIcon, type LaunchpadOptions } from "@/lib/launchpad";
import { cn } from "@/lib/utils";

const ICONS: Record<LaunchIcon, LucideIcon> = {
  vercel: Triangle,
  "git-fork": GitFork,
  github: FolderGit2,
  "user-plus": UserPlus,
  sparkles: Sparkles,
  workflow: Workflow,
  star: Star,
  book: BookOpen,
};

/**
 * Grid of once-off "make your own copy and run it" actions, grouped
 * (get the code & deploy · accounts · automate with AI · make it yours).
 * Static deep links — server component, opens each in a new tab.
 */
export function BuildLaunchpad(opts: LaunchpadOptions) {
  const groups = buildLaunchpad(opts);

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <section key={group.id} aria-label={group.title} className="flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
              {group.title}
            </h3>
            <p className="text-xs text-(--muted)">{group.blurb}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {group.links.map((link) => {
              const Icon = ICONS[link.icon] ?? Rocket;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group flex items-start gap-3 rounded-lg border p-4 no-underline transition-colors",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)",
                    link.primary
                      ? "border-(--accent) bg-(--accent)/8 hover:bg-(--accent)/12"
                      : "border-(--border) bg-(--panel-2) hover:border-(--accent)"
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "mt-0.5 inline-flex h-9 w-9 flex-none items-center justify-center rounded-md",
                      link.primary
                        ? "bg-(--accent)/15 text-(--accent)"
                        : "bg-(--panel) text-(--accent-2)"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1 text-sm font-semibold text-(--ink)">
                      {link.label}
                      <ExternalLink
                        aria-hidden
                        className="h-3 w-3 flex-none text-(--muted) opacity-0 transition-opacity group-hover:opacity-100"
                      />
                    </span>
                    <span className="mt-0.5 block text-xs text-(--muted)">
                      {link.desc}
                    </span>
                  </span>
                </a>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
