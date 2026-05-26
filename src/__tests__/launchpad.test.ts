import { describe, expect, it } from "vitest";
import {
  buildLaunchpad,
  repoBase,
  vercelDeployUrl,
} from "@/lib/launchpad";

const REPO = "https://github.com/acme/widget";

describe("repoBase", () => {
  it("strips a trailing slash and .git", () => {
    expect(repoBase("https://github.com/acme/widget/")).toBe(REPO);
    expect(repoBase("https://github.com/acme/widget.git")).toBe(REPO);
    expect(repoBase(REPO)).toBe(REPO);
  });
});

describe("vercelDeployUrl", () => {
  it("builds an encoded clone URL", () => {
    expect(vercelDeployUrl(REPO)).toBe(
      "https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Facme%2Fwidget"
    );
  });
});

describe("buildLaunchpad", () => {
  it("includes repo-specific actions when a repoUrl is given", () => {
    const groups = buildLaunchpad({ repoUrl: REPO, aiUrl: "https://claude.ai/new" });
    const all = groups.flatMap((g) => g.links);
    const hrefs = all.map((l) => l.href);
    expect(hrefs).toContain(`${REPO}/fork`);
    expect(hrefs).toContain(`${REPO}/actions`);
    expect(hrefs).toContain(vercelDeployUrl(REPO));
    expect(hrefs.some((h) => h.startsWith("https://vercel.com/new/clone"))).toBe(true);
    // every link is an absolute https URL with the required fields
    for (const l of all) {
      expect(l.href).toMatch(/^https:\/\//);
      expect(l.label.length).toBeGreaterThan(0);
      expect(l.desc.length).toBeGreaterThan(0);
    }
    // the "make it your own" group only appears with a repo
    expect(groups.some((g) => g.id === "make-yours")).toBe(true);
  });

  it("omits repo-specific actions but keeps accounts + AI without a repoUrl", () => {
    const groups = buildLaunchpad({});
    const hrefs = groups.flatMap((g) => g.links).map((l) => l.href);
    expect(hrefs).toContain("https://github.com/new");
    expect(hrefs).toContain("https://github.com/signup");
    expect(hrefs).toContain("https://vercel.com/signup");
    // no fork / actions / clone links without a repo
    expect(hrefs.some((h) => h.includes("/fork") || h.includes("/actions"))).toBe(false);
    expect(hrefs.some((h) => h.startsWith("https://vercel.com/new/clone"))).toBe(false);
    expect(groups.some((g) => g.id === "make-yours")).toBe(false);
  });

  it("defaults the AI link to Claude when no aiUrl is supplied", () => {
    const groups = buildLaunchpad({ repoUrl: REPO });
    const claude = groups
      .flatMap((g) => g.links)
      .find((l) => l.label === "Open Claude");
    expect(claude?.href).toBe("https://claude.ai/new");
  });
});
