/* ------------------------------------------------------------------
   Clean Core Academy — curriculum assembly.

   The course follows the 14-module Clean Core & HANA Readiness brief,
   restructured for four developer tracks (new → intermediate → expert
   → admin) plus three independent business tracks (management, key &
   end users, other stakeholders). Each module lives in its own file
   under ./modules/ and is tagged with the `audiences` it serves; the
   track filter on the course home reads those tags.

   - Modules m01–m14 cover the developer/cross-cutting content
     (m14 is the delivery / project-management lens over m08 + m13).
   - Modules b01–b03 are the business / stakeholder lenses.
   - The Quiz Bank (brief §13) is delivered as the practice exam.
   - The readiness self-audit links each risk to the module that fixes it.

   Shape: see src/content/curriculum-types.ts. Authoring template:
   ./modules/m01-foundations.ts.
------------------------------------------------------------------ */

import type { Curriculum } from "./_types";

import { m01Foundations } from "./modules/m01-foundations";
import { m02HanaReadiness } from "./modules/m02-hana-readiness";
import { m03Language } from "./modules/m03-language";
import { m04AbapCloud } from "./modules/m04-abap-cloud";
import { m05ReleasedApis } from "./modules/m05-released-apis";
import { m06CdsAmdp } from "./modules/m06-cds-amdp";
import { m07Performance } from "./modules/m07-performance";
import { m08AtcMigration } from "./modules/m08-atc-migration";
import { m09Tools } from "./modules/m09-tools";
import { m10Gotchas } from "./modules/m10-gotchas";
import { m11DidYouKnow } from "./modules/m11-did-you-know";
import { m12Recipes } from "./modules/m12-recipes";
import { m13Capstones } from "./modules/m13-capstones";
import { m14Delivery } from "./modules/m14-delivery";
import { b01Management } from "./modules/b01-management";
import { b02KeyUsers } from "./modules/b02-key-users";
import { b03Orientation } from "./modules/b03-orientation";
import { practiceExam } from "./modules/exams";
import { withModuleImages } from "./module-images";

export const CURRICULUM: Curriculum = {
  schemaVersion: 1,
  sections: withModuleImages([
    m01Foundations,
    m02HanaReadiness,
    m03Language,
    m04AbapCloud,
    m05ReleasedApis,
    m06CdsAmdp,
    m07Performance,
    m08AtcMigration,
    m09Tools,
    m10Gotchas,
    m11DidYouKnow,
    m12Recipes,
    m13Capstones,
    m14Delivery,
    b01Management,
    b02KeyUsers,
    b03Orientation,
  ]),
  mockExams: [practiceExam],
  readinessAudit: {
    title: "Clean Core readiness self-audit",
    intro:
      "Answer honestly about your custom ABAP. Each risky practice is weighted by how hard it blocks Clean Core; the result is a readiness score plus a remediation list sorted worst-first, each linked to the module that fixes it. This is a triage — the authoritative check is ATC with the CLOUD_READINESS variant on your target system.",
    bands: [
      {
        min: 0,
        max: 39,
        verdict: "Far from Clean Core",
        message:
          "Significant remediation ahead. Start at the top of the list — the highest-weighted findings (direct table writes, modifications) block cloud adoption hardest.",
      },
      {
        min: 40,
        max: 69,
        verdict: "On the way",
        message:
          "The structure is moving but core risks remain. Work the prioritized list module by module rather than all at once.",
      },
      {
        min: 70,
        max: 89,
        verdict: "Mostly Clean Core",
        message:
          "A few risks left. Close them, pin the package language version to ABAP for Cloud Development, and gate new findings in ATC.",
      },
      {
        min: 90,
        max: 100,
        verdict: "Clean Core ready",
        message:
          "Strong posture. Confirm with ATC CLOUD_READINESS / S4HANA_READINESS on your target system and keep the gate green.",
      },
    ],
    questions: [
      {
        id: "a-writes",
        dimension: "Data writes",
        question:
          "Does your code write directly to SAP standard tables (UPDATE / MODIFY / INSERT / DELETE on an SAP table)?",
        detail:
          "Direct writes bypass application logic and break on data-model changes.",
        weight: 5,
        riskAnswer: "yes",
        remediation:
          "Route every write through the released API / BAPI for the business object, or RAP EML (MODIFY ENTITIES ... COMMIT ENTITIES).",
        moduleId: "m05-released-apis",
      },
      {
        id: "a-modify",
        dimension: "Modifications",
        question:
          "Do you modify SAP standard objects or rely on implicit enhancements?",
        weight: 5,
        riskAnswer: "yes",
        remediation:
          "Replace modifications with released BAdIs / extension points or the 3-tier extensibility model; request an extension point from SAP if none exists.",
        moduleId: "m01-foundations",
      },
      {
        id: "a-reads",
        dimension: "Data reads",
        question:
          "Do you SELECT from physical SAP tables (MARA, VBAK, BSID, …) rather than released CDS interface views (I_*)?",
        weight: 3,
        riskAnswer: "yes",
        remediation:
          "Read from the released I_* CDS interface view — the stable contract over the same data.",
        moduleId: "m05-released-apis",
      },
      {
        id: "a-bdc",
        dimension: "Integration",
        question:
          "Do you automate transactions with BDC / CALL TRANSACTION (batch input)?",
        detail:
          "Batch input replays the UI and is not available on ABAP Cloud.",
        weight: 4,
        riskAnswer: "yes",
        remediation:
          "Call the business logic directly: released BAPI/API → RAP EML → OData. Isolate any unavoidable legacy call behind one released wrapper.",
        moduleId: "m04-abap-cloud",
      },
      {
        id: "a-ui",
        dimension: "UI",
        question:
          "Are your apps built on SAP GUI (Dynpro, full-screen ALV, module pools)?",
        weight: 3,
        riskAnswer: "yes",
        remediation:
          "Expose data as CDS → RAP → OData and build Fiori Elements UIs (List Report / Object Page) with no UI code.",
        moduleId: "m04-abap-cloud",
      },
      {
        id: "a-sqlinj",
        dimension: "Security",
        question:
          "Do you build dynamic WHERE / ORDER BY by concatenating user input into the statement?",
        weight: 4,
        riskAnswer: "yes",
        remediation:
          "Use host variables for values; validate genuinely-dynamic identifiers against an allow-list via CL_ABAP_DYN_PRG.",
        moduleId: "m10-gotchas",
      },
      {
        id: "a-perf",
        dimension: "Performance",
        question:
          "Do hot paths contain SELECT * or SELECTs inside loops (N+1 reads)?",
        weight: 3,
        riskAnswer: "yes",
        remediation:
          "Project the columns you need, filter at the source, and replace nested reads with one set-based read (or a CDS join).",
        moduleId: "m07-performance",
      },
      {
        id: "a-syfields",
        dimension: "System fields",
        question:
          "Do you read restricted system fields directly (sy-uname, sy-datum, sy-mandt) instead of a released context API?",
        weight: 2,
        riskAnswer: "yes",
        remediation:
          "Use the released context API (cl_abap_context_info); inject a clock abstraction where the date drives testable logic.",
        moduleId: "m05-released-apis",
      },
      {
        id: "a-config",
        dimension: "Configuration",
        question:
          "Are org values and thresholds hardcoded as literals in the code (company codes, batch sizes, plant ranges)?",
        weight: 2,
        riskAnswer: "yes",
        remediation:
          "Externalize to config (a released entity / config app) read through an accessor; use feature flags to deploy dark.",
        moduleId: "m01-foundations",
      },
      {
        id: "a-langversion",
        dimension: "Tooling",
        question:
          "Is the package's ABAP language version set to 'ABAP for Cloud Development' on new objects?",
        detail:
          "Pinning it makes Clean-Core violations fail at compile time, not just in ATC.",
        weight: 3,
        riskAnswer: "no",
        remediation:
          "Pin new packages to ABAP for Cloud Development so only released APIs compile.",
        moduleId: "m01-foundations",
      },
      {
        id: "a-atc",
        dimension: "Tooling",
        question:
          "Do you run ATC with the CLOUD_READINESS / S4HANA_READINESS variants regularly?",
        weight: 4,
        riskAnswer: "no",
        remediation:
          "Run ATC centrally with the Clean Core variants; treat Prio 1/2 findings as build-breakers and baseline the rest.",
        moduleId: "m08-atc-migration",
      },
    ],
  },
};
