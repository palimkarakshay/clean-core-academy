"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Layers,
  Award,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { getPack } from "@/content/pack-registry";
import type { NavIcon, NavItem } from "@/lib/site-config";
import { BRAND } from "@/lib/brand";
import { ThemeToggle } from "@/components/primitives/ThemeToggle";
import { DisplayPrefsMenu } from "@/components/primitives/DisplayPrefsMenu";
import { cn } from "@/lib/utils";

const ICONS: Record<NavIcon, LucideIcon> = {
  home: Home,
  layers: Layers,
  award: Award,
  "trending-up": TrendingUp,
};

function isActive(item: NavItem, pathname: string | null): boolean {
  if (!pathname) return false;
  const matches = item.match ?? [];
  for (const m of matches) {
    if (m === "/") {
      if (pathname === "/") return true;
    } else if (pathname === m || pathname.startsWith(`${m}/`)) {
      return true;
    }
  }
  return false;
}

function packIdFromPathname(pathname: string | null): string | null {
  if (!pathname) return null;
  const m = pathname.match(/^\/([^/]+)/);
  return m ? m[1] : null;
}

function prefixWithPack(href: string, packId: string | null): string {
  if (!packId) return href;
  if (href === "/") return `/${packId}`;
  if (href.startsWith("/#") || href.startsWith("#"))
    return `/${packId}${href.startsWith("/") ? href : `/${href}`}`;
  return href.startsWith(`/${packId}/`) || href === `/${packId}`
    ? href
    : `/${packId}${href}`;
}

export function Header() {
  const pathname = usePathname();
  const firstSegment = packIdFromPathname(pathname);
  // The chrome lives in the root layout, *outside* the [packId]
  // PackProvider, so resolve the pack from the URL so the nav stays
  // in sync with the route.
  const pack = firstSegment ? getPack(firstSegment) : null;
  const packId = pack ? firstSegment : null;
  const visibleNav = pack
    ? pack.config.nav.filter((n) => n.href !== "/")
    : [];
  const homeHref = packId ? `/${packId}` : "/";

  return (
    <header className="border-b border-(--border) mb-6">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-4">
        <Link
          href={homeHref}
          aria-label={`${BRAND.name} home`}
          className="flex min-h-11 items-center gap-2 no-underline"
        >
          <Image
            aria-hidden
            src="/images/brand/final/curio-mark.jpg"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 flex-none rounded-md object-cover"
          />
          <span className="flex flex-col justify-center gap-0.5">
            <span className="font-[family-name:var(--font-display)] text-base font-semibold text-(--ink)">
              {BRAND.name}
            </span>
            <span className="text-xs text-(--muted)">{BRAND.tagline}</span>
          </span>
        </Link>
        <nav
          aria-label="Primary"
          className="flex items-center gap-2 sm:gap-3 text-sm"
        >
          <ul className="hidden items-center gap-2 md:flex">
            {visibleNav.map((item) => {
              const href = prefixWithPack(item.href, packId);
              const active = isActive(item, pathname);
              const Icon = item.icon ? ICONS[item.icon] : null;
              return (
                <li key={item.href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm no-underline transition-colors",
                      active
                        ? "text-(--ink) bg-(--panel-2)"
                        : "text-(--muted) hover:bg-(--panel-2) hover:text-(--ink)"
                    )}
                  >
                    {Icon ? <Icon aria-hidden className="h-4 w-4" /> : null}
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <DisplayPrefsMenu />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
