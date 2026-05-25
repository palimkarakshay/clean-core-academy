import type { SectionMeta } from "./curriculum-types";

/**
 * Per-module metadata for the section-landing "Goals" tab. `academyUrl`
 * links to an authoritative source (SAP Help / Community / the
 * open-source Clean ABAP + tooling repos) for deep readers;
 * `timeMinutes` is a rough read-through-and-try estimate; the learning
 * objectives are the "what you'll be able to do" for the module.
 *
 * Keys MUST match the section ids in
 * content-packs/clean-core-academy/curriculum.ts.
 */
const CLEAN_CORE =
  "https://community.sap.com/t5/technology-blog-posts-by-sap/abap-extensibility-guide-clean-core-for-sap-s-4hana-cloud-august-2025/ba-p/14175399";
const HELP = "https://help.sap.com/docs/abap-cloud";
const API_HUB = "https://api.sap.com";
const CLEAN_ABAP =
  "https://github.com/SAP/styleguides/blob/main/clean-abap/CleanABAP.md";

export const SECTION_META: Record<string, SectionMeta> = {
  "m01-foundations": {
    academyUrl: CLEAN_CORE,
    timeMinutes: 55,
    track: "Foundations",
    learningObjectives: [
      "Explain Clean Core as a contract about where extensions sit — not a ban on custom code.",
      "Place any object in the right extensibility tier (key-user / developer / side-by-side).",
      "Describe what Restricted ABAP forbids and why compile-time enforcement matters.",
      "Read an object's API State and classify it C0 / C1 / C2 / C3.",
      "Reason about the software-component boundary and released interfaces.",
    ],
  },
  "m02-hana-readiness": {
    academyUrl: HELP,
    timeMinutes: 55,
    track: "HANA mindset",
    learningObjectives: [
      "Name what actually changed moving to HANA: columnar store, no implicit sort, MVCC reads.",
      "Avoid the classic gotchas — ORDER BY, SELECT SINGLE without a full key, FOR ALL ENTRIES.",
      "Recognise the deeper internal-table and cursor gotchas before they bite.",
      "Run the scope-then-fix loop: SCMON → ATC → baseline → re-run per FPS.",
      "Use the Simplification Database for your target release.",
    ],
  },
  "m03-language": {
    academyUrl: CLEAN_ABAP,
    timeMinutes: 50,
    track: "Modern ABAP",
    learningObjectives: [
      "Replace obsolete statements (MOVE, header lines, FORM/PERFORM, CONCATENATE) with modern equivalents.",
      "Use inline declarations and modern Open SQL (comma field lists, @DATA).",
      "Apply the constructor operators: VALUE, CORRESPONDING, COND, SWITCH, REDUCE, FILTER, FOR.",
      "Format output with string templates.",
      "Model errors with class-based exceptions (CX_STATIC_CHECK + IF_T100_MESSAGE).",
    ],
  },
  "m04-abap-cloud": {
    academyUrl: HELP,
    timeMinutes: 65,
    track: "ABAP Cloud / RAP",
    learningObjectives: [
      "Identify the five mandatory artefacts of a managed RAP business object.",
      "Implement behaviour with a behavior pool, local handlers, and strict(2).",
      "List the statements Restricted ABAP forbids in a cloud package.",
      "Consume and implement released BAdIs the Clean Core way.",
    ],
  },
  "m05-released-apis": {
    academyUrl: API_HUB,
    timeMinutes: 50,
    track: "Released APIs",
    learningObjectives: [
      "Find released objects in ADT and on api.sap.com and read their API State.",
      "Map common legacy APIs to their released replacements.",
      "Use the XCO library for JSON, hashing, time, and repository introspection.",
      "Read released CDS interface views (I_*) instead of physical tables.",
    ],
  },
  "m06-cds-amdp": {
    academyUrl: HELP,
    timeMinutes: 60,
    track: "Pushdown",
    learningObjectives: [
      "Order logic on the pushdown ladder: CDS → table function/AMDP → Open SQL → ABAP.",
      "Write CDS views with aggregation, associations, and correct group by.",
      "Build a CDS table function backed by AMDP with explicit client handling.",
      "Express row-level authorization declaratively with DCL.",
    ],
  },
  "m07-performance": {
    academyUrl: HELP,
    timeMinutes: 55,
    track: "Performance",
    learningObjectives: [
      "Apply the five rules that fix most slow SQL on HANA.",
      "Pick the right diagnostic tool (ST05, SAT, SQLM, SWLT, PLANVIZ).",
      "Rewrite loop lookups as projected, joined, declarative reads.",
      "Use hints and buffering judiciously, and avoid the rare-but-nasty perf gotchas.",
    ],
  },
  "m08-atc-migration": {
    academyUrl: HELP,
    timeMinutes: 60,
    track: "ATC & migration",
    learningObjectives: [
      "Choose the right ATC variant for the job.",
      "Set up local, central/remote, and CI/CD ATC topologies.",
      "Create and maintain an exemption baseline so only new debt surfaces.",
      "Run the full custom-code migration loop and handle the Simplification Items that bite.",
    ],
  },
  "m09-tools": {
    academyUrl: "https://github.com/SAP/abap-cleaner",
    timeMinutes: 55,
    track: "Tooling",
    learningObjectives: [
      "Adopt ABAP Cleaner and abaplint into the editor and CI.",
      "Use abapGit's lesser-known features (background mode, offline repos).",
      "Pick between SCMON, UPL, and SUSG for usage analysis.",
      "Decouple standard-API calls with the Decoupling Cockpit and test with the double frameworks.",
    ],
  },
  "m10-gotchas": {
    academyUrl: CLEAN_ABAP,
    timeMinutes: 55,
    track: "Gotchas",
    learningObjectives: [
      "Spot the Open SQL and internal-table gotchas that produce silent wrong results.",
      "Avoid the RAP and CDS traps (ETag, IN LOCAL MODE, #CHECK without DCL).",
      "Handle the AMDP and ABAP Cloud edge cases.",
      "Transport CDS/DCL/behaviour artefacts together to avoid half-working objects.",
    ],
  },
  "m11-did-you-know": {
    academyUrl: HELP,
    timeMinutes: 40,
    track: "Curiosities",
    learningObjectives: [
      "Use lesser-known language features (IS INSTANCE OF, CDS built-ins, SWITCH on strings).",
      "Discover ADT and ATC tooling shortcuts.",
      "Reach for hidden released APIs (GZIP, BASE64, HMAC, parallel processing).",
      "Choose the right numeric types for money, counters, and timestamps.",
    ],
  },
  "m12-recipes": {
    academyUrl: "https://docs.abapgit.org",
    timeMinutes: 55,
    track: "Recipes",
    learningObjectives: [
      "Release an object for downstream consumption.",
      "Run remote ATC and create a baseline.",
      "Migrate FORM/PERFORM code to classes and write a CDS unit test.",
      "Wire ATC into a CI/CD pipeline and write a MANDT-safe AMDP.",
    ],
  },
  "m13-capstones": {
    academyUrl: CLEAN_CORE,
    timeMinutes: 60,
    track: "Capstones",
    learningObjectives: [
      "Sequence a 12-month custom-code migration from zero to ATC-green.",
      "Build a greenfield extension released-API-first, end to end.",
      "Run a performance-forensics investigation from symptom to fix.",
    ],
  },
  "b01-management": {
    academyUrl: CLEAN_CORE,
    timeMinutes: 40,
    track: "Management",
    learningObjectives: [
      "Make the business case for Clean Core in terms of upgrade cost and innovation speed.",
      "Treat the 3-tier model as an investment decision.",
      "Stand up governance: variant ownership, baselines, exemptions with an audit trail.",
      "Frame the migration roadmap and the KPIs that track it.",
    ],
  },
  "b02-key-users": {
    academyUrl: CLEAN_CORE,
    timeMinutes: 35,
    track: "Key users",
    learningObjectives: [
      "Explain what Clean Core means for the work key users do.",
      "Use in-app (key-user) extensibility for fields, views, and logic.",
      "Know what you can self-serve and when to involve a developer.",
      "Keep extensions upgrade-safe and out of shadow processes.",
    ],
  },
  "b03-orientation": {
    academyUrl: CLEAN_CORE,
    timeMinutes: 30,
    track: "Orientation",
    learningObjectives: [
      "Describe Clean Core in plain language.",
      "Name the five Clean Core dimensions.",
      "Explain why released contracts make upgrades easier.",
      "Recognise the common vocabulary and read a readiness report.",
    ],
  },
};
