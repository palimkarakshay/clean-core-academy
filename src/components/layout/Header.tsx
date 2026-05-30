"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Layers,
  Award,
  TrendingUp,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { getPack } from "@/content/pack-registry";
import type { NavIcon, NavItem } from "@/lib/site-config";
import { BRAND } from "@/lib/brand";
import { BrandLogo } from "./BrandLogo";
import { ThemeToggle } from "@/components/primitives/ThemeToggle";
import { DisplayPrefsMenu } from "@/components/primitives/DisplayPrefsMenu";
import { cn } from "@/lib/utils";

const ICONS: Record<NavIcon, LucideIcon> = {
  home: Home,
  layers: Layers,
  award: Award,
  "trending-up": TrendingUp,
  rocket: Rocket,
};

function isActive(
  item: NavItem,
  pathname: string | null,
  packId: string | null
): boolean {
  if (!pathname) return false;
  const matches = item.match ?? [];
  for (const m of matches) {
    // Match values are authored pack-relative (e.g. "/start", "/section");
    // prefix with the active packId so they line up with the real pathname
    // ("/clean-core-academy/start"). "Home" ("/") is an exact match only,
    // so it doesn't light up on every sub-page.
    const target = prefixWithPack(m, packId);
    if (m === "/") {
      if (pathname === target) return true;
    } else if (pathname === target || pathname.startsWith(`${target}/`)) {
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
  // The SCORM single-page package has no route navigation, so the primary
  // nav is hidden and the brand isn't a link there (it would dead-end).
  const scorm = process.env.NEXT_PUBLIC_SCORM === "1";
  const visibleNav =
    pack && !scorm ? pack.config.nav.filter((n) => n.href !== "/") : [];
  const homeHref = packId ? `/${packId}` : "/";

  // BrandLogo is an inline SVG (no raster asset), so it renders correctly
  // in the static SCORM export too — only the link wrapper differs.
  const brand = (
    <>
      <BrandLogo className="h-8 w-8 flex-none" />
      <span className="flex flex-col justify-center gap-0.5">
        <span className="flex items-center gap-2">
          <span className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-(--ink)">
            {BRAND.name}
          </span>
          <span className="rounded-full border border-(--accent-2)/40 bg-(--accent-2)/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-(--accent-2)">
            {BRAND.product}
          </span>
        </span>
        <span className="hidden text-xs text-(--muted) sm:block">
          {BRAND.tagline}
        </span>
      </span>
    </>
  );

  return (
    <header className="border-b border-(--border) mb-6">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-4">
        {scorm ? (
          <div className="flex min-h-11 items-center gap-2.5">{brand}</div>
        ) : (
          <Link
            href={homeHref}
            aria-label={`${BRAND.name} — ${BRAND.product} home`}
            className="flex min-h-11 items-center gap-2.5 no-underline"
          >
            {brand}
          </Link>
        )}
        <nav
          aria-label="Primary"
          className="flex items-center gap-2 sm:gap-3 text-sm"
        >
          <ul className="hidden items-center gap-2 md:flex">
            {visibleNav.map((item) => {
              const href = prefixWithPack(item.href, packId);
              const active = isActive(item, pathname, packId);
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
