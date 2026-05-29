/* ------------------------------------------------------------------
   Clean Core Academy — pack config.

   Branding, palette, nav, terminology overrides, PWA manifest, and the
   "Ask Claude" hand-off for the SAP-modernization course. The shell is
   content-agnostic; everything course-specific lives here + curriculum.ts.
------------------------------------------------------------------ */

import type { PackConfig } from "./_types";
import { ICON_SVG, ICON_MASKABLE_SVG } from "./icons";

export const packConfig: PackConfig = {
  id: "clean-core-academy",
  name: "Clean Core Academy",
  shortName: "Clean Core",
  tagline: "Modernize ABAP toward SAP Clean Core.",
  description:
    "Turn the ABAP-Utilities SAP-modernization cookbooks into hands-on modules: ABAP anti-patterns, Clean Core & ATC, BDC→API, RAP/CDS, and Fiori conversion. Every lesson pairs concept notes with before/after ABAP and a spot-the-Clean-Core-violation quiz.",
  url: "https://clean-core-academy.vercel.app",
  repoUrl: "https://github.com/palimkarakshay/clean-core-academy",
  author: "palimkarakshay",
  nav: [
    { label: "Home", href: "/", icon: "home", mobile: true, match: ["/"] },
    {
      label: "Modules",
      href: "/#sections",
      icon: "layers",
      mobile: true,
      match: ["/section", "/concept"],
    },
    {
      label: "Progress",
      href: "/#progress",
      icon: "trending-up",
      mobile: true,
      match: [],
    },
  ],
  askAI: {
    projectUrl: "",
    fallbackUrl: "https://claude.ai/new",
    heading: "Ask Claude",
    description:
      "Build a prompt from this lesson + your question and open a fresh Claude chat with it pre-filled — handy for adapting a before/after pattern to your own object.",
  },
  // The academy is a course, not a proctored exam — retune the
  // exam-coded shell copy to learning-course terminology.
  copy: {
    courseSingular: "Course",
    coursePlural: "Courses",
    moduleSingular: "Module",
    modulePlural: "Modules",
    lessonSingular: "Lesson",
    lessonPlural: "Lessons",
    sectionTestSingular: "Module check",
    conceptsMasteredLabel: "Lessons mastered",
    sectionsCompleteLabel: "Modules complete",
    bestMockScoreLabel: "Best practice score",
    whatYoullLearnHeading: "What you'll learn",
    recoDrillLabel: "Practice",
    recoLessonTitle: "Read the next lesson",
    recoSectionTestTitle: "Take the module check",
    passLabel: "passed",
    belowPassGateLabel: "needs another pass",
  },
  manifest: {
    backgroundColor: "#0a2540",
    themeColor: "#0a2540",
    categories: ["education", "developer"],
  },
  theme: {
    light: {
      "--canvas": "#f4f8fb",
      "--panel": "#ffffff",
      "--panel-2": "#eef3f8",
      "--border": "#d6e0ea",
      "--ink": "#0a2540",
      "--muted": "#56708a",
      "--accent": "#0a6e8a",
      "--accent-2": "#1aa899",
      "--good": "#2f7a4a",
      "--bad": "#c0392b",
      "--warn": "#b07d10",
      "--code": "#0a2540",
    },
    dark: {
      "--canvas": "#08182a",
      "--panel": "#0e2438",
      "--panel-2": "#14324a",
      "--border": "#244863",
      "--ink": "#e6eef5",
      "--muted": "#90a8bd",
      "--accent": "#2ec4b6",
      "--accent-2": "#5cd6c8",
      "--good": "#5fb878",
      "--bad": "#e06a5a",
      "--warn": "#d9b35a",
      "--code": "#e6eef5",
    },
  },
  iconSvg: ICON_SVG,
  iconMaskableSvg: ICON_MASKABLE_SVG,
  prerequisites: {
    heading: "Before you begin",
    intro:
      "This course assumes working ABAP and walks through modernizing it toward SAP Clean Core. You don't need a live system to read the lessons, but a sandbox makes the exercises stick.",
    requirements: [
      {
        label: "Comfortable reading ABAP",
        detail: "OpenSQL, internal tables, classes — you can follow a method.",
      },
      {
        label: "Access to ADT (ABAP Development Tools)",
        detail: "Eclipse-based ADT is the modern, cloud-ready editor; SE80 won't show Clean Core tooling.",
      },
      {
        label: "An S/4HANA or BTP ABAP environment to try the fixes",
        detail: "On-prem S/4HANA, an ABAP trial, or the SAP BTP ABAP environment (Steampunk).",
      },
    ],
    assumptions: [
      {
        label: "ATC with the Clean Core variants",
        detail: "CLOUD_READINESS + S4HANA_READINESS are the authoritative checks; abaplint catches the style layer.",
      },
    ],
    externalLinks: [
      {
        label: "SAP — ABAP Extensibility Guide: Clean Core",
        href: "https://community.sap.com/t5/technology-blog-posts-by-sap/abap-extensibility-guide-clean-core-for-sap-s-4hana-cloud-august-2025/ba-p/14175399",
      },
      {
        label: "Source cookbooks — palimkarakshay/abap-utilities /docs",
        href: "https://github.com/palimkarakshay/abap-utilities/tree/main/docs",
      },
    ],
    notForYouIf: [
      "You're looking for a beginner ABAP syntax course — this assumes you already write ABAP.",
      "You want SAP functional/config training — this is a developer modernization course.",
    ],
    byRole: {
      new: {
        roleLabel: "New developers",
        intro:
          "New to ABAP or to SAP? Start here. You'll pick up the Clean Core vocabulary and the upgrade-safe habits before they become hard to unlearn — no modernization experience needed.",
        requirements: [
          {
            label: "Basic ABAP — you can read a method",
            detail: "Variables, internal tables, a simple SELECT. We build from there.",
          },
          {
            label: "ADT (ABAP Development Tools) installed",
            detail: "The Eclipse-based editor — this is where the Clean Core tooling lives.",
          },
          {
            label: "A sandbox to experiment in",
            detail: "An ABAP trial or BTP ABAP environment is plenty — no production access.",
          },
        ],
        notForYouIf: [
          "You've never written code before — try an intro ABAP course first.",
        ],
      },
      intermediate: {
        roleLabel: "Intermediate developers",
        intro:
          "You write extensions day-to-day. This track sharpens that into Clean-Core-compliant ABAP — released APIs, RAP and CDS, and the patterns that win on HANA.",
        requirements: [
          {
            label: "Comfortable writing ABAP classes and OpenSQL",
            detail: "You ship extensions today — we focus on making them upgrade-safe.",
          },
          {
            label: "Access to ADT",
            detail: "SE80 won't surface the Clean Core checks; ADT will.",
          },
          {
            label: "An S/4HANA or BTP ABAP environment",
            detail: "On-prem S/4HANA, an ABAP trial, or BTP ABAP (Steampunk).",
          },
        ],
      },
      expert: {
        roleLabel: "Expert developers & architects",
        intro:
          "You own the strategy. This track concentrates on release contracts, decoupling, ATC governance, and designing an end-to-end migration that survives upgrades.",
        requirements: [
          {
            label: "Deep ABAP plus architecture experience",
            detail: "You make the build-vs-extend calls and set team standards.",
          },
          {
            label: "ATC access with the Clean Core variants",
            detail: "You'll run and interpret CLOUD_READINESS / S4HANA_READINESS results.",
          },
          {
            label: "A real landscape to assess",
            detail: "Existing custom code you can profile makes the strategy lessons concrete.",
          },
        ],
      },
      admin: {
        roleLabel: "Admin & Basis developers",
        intro:
          "Landscape-facing work. You'll stand up ATC topology, custom-code analysis, transports, and the operational tooling that keeps the core clean over time.",
        requirements: [
          {
            label: "Basis / admin access to your systems",
            detail: "You manage landscapes, transports, and the central check setup.",
          },
          {
            label: "ATC and custom-code migration tooling",
            detail: "Central ATC, the custom-code migration app, and transport tools.",
          },
          {
            label: "Familiarity with transport management",
            detail: "You move objects between systems and own the pipeline.",
          },
        ],
      },
      management: {
        roleLabel: "Management & leads",
        intro:
          "No coding required. You'll get the business case, the governance model, and the roadmap — what Clean Core buys you and how to steer the migration.",
        requirements: [
          {
            label: "A high-level picture of your SAP landscape",
            detail: "Roughly what runs where, and how much custom code you carry.",
          },
          {
            label: "Access to your team's roadmap or backlog",
            detail: "So the governance ideas land against real planned work.",
          },
        ],
        assumptions: [],
        notForYouIf: [
          "You want a hands-on coding course — pick a developer track for that.",
        ],
      },
      "end-user": {
        roleLabel: "Key & end users",
        intro:
          "Extend SAP from the app itself. You'll learn what you can safely change with the in-app tools — custom fields and logic — and exactly when to hand off to a developer. No ABAP needed.",
        requirements: [
          {
            label: "Key-user access to your Fiori apps",
            detail: "The in-app extensibility tools must be visible to you.",
          },
          {
            label: "In-app extensibility enabled in your system",
            detail: "Your admin has switched on key-user extensibility.",
          },
        ],
        assumptions: [],
        notForYouIf: [
          "You need to build full applications — that's the developer tracks.",
        ],
      },
      stakeholder: {
        roleLabel: "Other stakeholders",
        intro:
          "A plain-language orientation. You'll learn what Clean Core is, why upgrades get easier, and the words everyone keeps using — no technical background required.",
        requirements: [
          {
            label: "An interest in why SAP modernization matters",
            detail: "That's genuinely the only prerequisite for this track.",
          },
        ],
        assumptions: [],
        notForYouIf: [
          "You need hands-on technical depth — start with a developer track instead.",
        ],
      },
    },
  },
};
