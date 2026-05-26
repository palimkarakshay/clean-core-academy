/* ------------------------------------------------------------------
   Clean Core Academy — pack config.

   Branding, palette, nav, terminology overrides, PWA manifest, and the
   "Ask Claude" hand-off for the SAP-modernization course. The shell is
   content-agnostic; everything course-specific lives here + curriculum.ts.
------------------------------------------------------------------ */

import type { PackConfig } from "./_types";
import { ICON_SVG, ICON_MASKABLE_SVG } from "./icons";
import { pollinationsUrl, HERO_PROMPT, HERO_SEED } from "./module-images";

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
  heroImagePath: pollinationsUrl(HERO_PROMPT, HERO_SEED, 1280, 720),
  nav: [
    { label: "Home", href: "/", icon: "home", mobile: true, match: ["/"] },
    {
      label: "Start here",
      href: "/start",
      icon: "rocket",
      mobile: true,
      match: ["/start"],
    },
    {
      label: "Modules",
      href: "/#sections",
      icon: "layers",
      mobile: true,
      match: ["/section", "/concept"],
    },
    {
      label: "Progress",
      href: "/start",
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
  },
};
