import type { SectionMeta } from "./curriculum-types";

/**
 * Per-module metadata for the section-landing "Goals" tab. Each entry's
 * `academyUrl` links to the source cookbook in the reference repo
 * (palimkarakshay/abap-utilities, never modified by this pack);
 * `timeMinutes` is a rough read-through-and-try estimate; the learning
 * objectives are the "what you'll be able to do" for the module.
 *
 * Keys MUST match the section ids in
 * content-packs/clean-core-academy/curriculum.ts.
 */
const COOKBOOK = "https://github.com/palimkarakshay/abap-utilities/blob/main/docs";

export const SECTION_META: Record<string, SectionMeta> = {
  "m1-anti-patterns": {
    academyUrl: `${COOKBOOK}/anti-patterns-playbook.md`,
    timeMinutes: 75,
    track: "Line-level",
    learningObjectives: [
      "Spot SELECT * and ABAP-side filtering and rewrite them as projected, source-filtered reads.",
      "Recognise an N+1 nested read and convert it to a single set-based read.",
      "Explain why DELETE ADJACENT DUPLICATES needs a prior SORT by the comparison key.",
      "Replace deep precondition nesting with fail-fast guard clauses.",
      "Externalise magic numbers / org values and close a dynamic-SQL injection hole.",
    ],
  },
  "m2-clean-core-atc": {
    academyUrl: `${COOKBOOK}/clean-core-atc-cookbook.md`,
    timeMinutes: 60,
    track: "Architecture",
    learningObjectives: [
      "Replace a direct write to an SAP table with a released API / BAPI / RAP call.",
      "Read from a released CDS interface view instead of a physical SAP table.",
      "Isolate a non-released object behind a single released wrapper.",
      "Swap restricted system fields for the released context API.",
      "Name the ATC variants (CLOUD_READINESS / S4HANA_READINESS) that surface these findings.",
    ],
  },
  "m3-bdc-to-api": {
    academyUrl: `${COOKBOOK}/bdc-to-api-cookbook.md`,
    timeMinutes: 50,
    track: "Architecture",
    learningObjectives: [
      "Explain why batch input is brittle and not available on ABAP Cloud.",
      "Apply the API → RAP → OData → wrapped-legacy decision tree.",
      "Replace CALL TRANSACTION with a BAPI plus typed error handling and explicit commit.",
      "Convert a loop+CALL-TRANSACTION mass run into a bulk API / RAP EML call.",
    ],
  },
  "m4-rap-cds": {
    academyUrl: `${COOKBOOK}/rap-cds-modernization.md`,
    timeMinutes: 70,
    track: "Target stack",
    learningObjectives: [
      "Turn a report's direct table access into a CDS consumption view over released interface views.",
      "Consolidate module-pool / FM transaction logic into a RAP managed behaviour.",
      "Apply VDM layering: interface vs consumption views, associations, and extend-don't-modify.",
      "Express row-level authorization declaratively with DCL / @AccessControl.",
    ],
  },
  "m5-fiori": {
    academyUrl: `${COOKBOOK}/fiori-conversion-cookbook.md`,
    timeMinutes: 50,
    track: "Target stack",
    learningObjectives: [
      "Replace SM30 / SE16 maintenance with a generated, managed RAP 'Manage X' app.",
      "Convert a read-only ALV / WRITE report into a Fiori List Report (projection + OData, no behaviour).",
      "Map selection-screen criteria to @UI.selectionField filter-bar fields.",
      "Pick the OData V4 - UI binding type for Fiori Elements.",
    ],
  },
  "m6-readiness-audit": {
    academyUrl: `${COOKBOOK}/clean-core-readiness.md`,
    timeMinutes: 45,
    track: "Readiness",
    learningObjectives: [
      "Classify a statement / API into cloud-safe (✅), confirm/alternative (⚠️), or on-premise-only (❌).",
      "Name the released replacement for common ⚠️ items (JSON, email, number ranges, config).",
      "Explain why ATC CLOUD_READINESS on the target system is the authoritative check.",
      "Run the self-audit module check and read the readiness matrix per object.",
    ],
  },
};
