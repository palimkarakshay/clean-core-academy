/* ------------------------------------------------------------------
   Practice exam — distilled from the curriculum's Quiz Bank (§13).

   Independent of module progress: a calibration exam spanning Clean
   Core, HANA readiness, modern ABAP, released APIs, AMDP, and tooling.
   Mixes MCQ, true/false, and fill-in. Surfaced at /[packId]/mock.
------------------------------------------------------------------ */

import type { MockExam } from "../_types";

export const practiceExam: MockExam = {
  id: "clean-core-practice",
  title: "Clean Core & HANA readiness — practice exam",
  blurb:
    "20 mixed questions across foundations, HANA, modern ABAP, released APIs, AMDP, and tooling. Use it to calibrate before a real ATC-readiness review.",
  sourceFile: "clean-core-curriculum §13",
  timeMinutes: 30,
  passPct: 0.7,
  scoreBands: [
    {
      min: 0,
      max: 69,
      verdict: "Keep studying",
      message:
        "Below the pass gate. Revisit the modules behind the questions you missed — the explanations link the principle back to a module.",
    },
    {
      min: 70,
      max: 89,
      verdict: "Solid",
      message:
        "A passing, working grasp of Clean Core and HANA readiness. Tighten the few gaps and you're review-ready.",
    },
    {
      min: 90,
      max: 100,
      verdict: "Clean Core ready",
      message:
        "Strong across the board. Confirm on a real system with ATC ABAP_CLOUD_DEVELOPMENT_DEFAULT / S4HANA_READINESS_2023.",
    },
  ],
  questions: [
    {
      n: 1,
      question: "Which of the following is NOT one of the six Clean Core dimensions?",
      options: {
        A: "Software stack",
        B: "Data",
        C: "Hardware",
        D: "Operations",
      },
      correct: "C",
      explanations: {
        A: "Software stack is a dimension — keep the SAP stack current and unmodified.",
        B: "Data (configuration, master, and transactional data) is a dimension; SAP's name is 'data,' not 'master data.'",
        C: "Correct — the six are software stack, extensibility, integrations, processes, data, operations. Hardware is not one.",
        D: "Operations is one of the six.",
      },
      principle: "The six dimensions: software stack, extensibility, integrations, processes, data, operations.",
    },
    {
      n: 2,
      question:
        "What does the C1 release contract mean for a class consumed from an ABAP-for-Cloud-Development package?",
      options: {
        A: "It can be used and SAP guarantees behavioural stability within the contract.",
        B: "It is deprecated.",
        C: "It is internal and may change without notice.",
        D: "It is encrypted.",
      },
      correct: "A",
      explanations: {
        A: "Correct — C1 is released and stable within the contract.",
        B: "Deprecated is C3.",
        C: "Internal/unstable is C2 (or C0).",
        D: "Contracts have nothing to do with encryption.",
      },
      principle: "C1 = released and upgrade-stable.",
    },
    {
      n: 3,
      question:
        "A package set to ABAP for Cloud Development can still do which one of the following?",
      options: {
        A: "WRITE / 'Hello'.",
        B: "CALL TRANSACTION 'VA01'.",
        C: "EXEC SQL.",
        D: "Call a released BAdI's implementation.",
      },
      correct: "D",
      explanations: {
        A: "List processing is forbidden.",
        B: "CALL TRANSACTION is forbidden.",
        C: "Native SQL is forbidden.",
        D: "Correct — consuming released enhancement spots / APIs is exactly what's allowed.",
      },
      principle: "Restricted ABAP permits released APIs and forbids classic escapes.",
    },
    {
      n: 4,
      question: "Which CDS annotation enforces a DCL authorization role at runtime?",
      options: {
        A: "@VDM.viewType: #BASIC",
        B: "@AccessControl.authorizationCheck: #CHECK",
        C: "@ObjectModel.dataCategory: #FACT",
        D: "@AbapCatalog.compiler.compareFilter: true",
      },
      correct: "B",
      explanations: {
        A: "viewType is a VDM classification, not an auth switch.",
        B: "Correct — #CHECK requires a matching DCL role at runtime.",
        C: "dataCategory is analytics metadata.",
        D: "compareFilter is a compiler hint.",
      },
      principle: "#CHECK ties a CDS view to its DCL role.",
    },
    {
      n: 5,
      question:
        "SELECT SINGLE matnr FROM mara returns different values after migration to HANA. Most likely cause?",
      options: {
        A: "HANA does not implement SELECT SINGLE.",
        B: "MARA was deleted in S/4.",
        C: "The statement lacks a WHERE on the full key, so 'the' single row is undefined.",
        D: "The Open SQL parser is buggy.",
      },
      correct: "C",
      explanations: {
        A: "SELECT SINGLE is fully supported.",
        B: "MARA still exists.",
        C: "Correct — without a full-key WHERE, which row you get is undefined and HANA may pick a different one.",
        D: "It's a semantics issue, not a parser bug.",
      },
      principle: "SELECT SINGLE without a full key is non-deterministic.",
    },
    {
      n: 6,
      question:
        "Which pattern is most performant for 'filter a list of orders by customer name'?",
      options: {
        A: "Loop the orders, SELECT SINGLE on KNA1 per order.",
        B: "SELECT FOR ALL ENTRIES from KNA1, then merge.",
        C: "EXEC SQL with a HANA hint.",
        D: "One SELECT with an INNER JOIN of the order table and KNA1.",
      },
      correct: "D",
      explanations: {
        A: "That's the N+1 anti-pattern.",
        B: "Better than N+1, but still two steps and a merge.",
        C: "Native SQL bypasses Open SQL safety and the optimizer's reuse.",
        D: "Correct — push the join to the database in one statement.",
      },
      principle: "Join at the database; transport only what you need.",
    },
    {
      n: 7,
      question:
        "SELECT ... FOR ALL ENTRIES IN @lt_driver when lt_driver is empty returns:",
      options: {
        A: "Zero rows.",
        B: "A short dump.",
        C: "All rows of the target table.",
        D: "An exception.",
      },
      correct: "C",
      explanations: {
        A: "It does NOT return zero rows — that's the trap.",
        B: "No dump occurs.",
        C: "Correct — an empty driver drops the WHERE and returns everything. Always guard with lines( ) > 0.",
        D: "No exception is raised.",
      },
      principle: "Guard FOR ALL ENTRIES against an empty driver table.",
    },
    {
      n: 8,
      question: "What does the AMDP OPTIONS READ-ONLY clause do?",
      options: {
        A: "Tells HANA the procedure performs no DML, so it can route to readers in scale-out.",
        B: "Marks the method immutable in version control.",
        C: "Locks the method against modification.",
        D: "Enables row-level encryption.",
      },
      correct: "A",
      explanations: {
        A: "Correct — it declares the procedure side-effect-free, enabling reader routing.",
        B: "Nothing to do with version control.",
        C: "It doesn't lock the source.",
        D: "Unrelated to encryption.",
      },
      principle: "OPTIONS READ-ONLY declares a side-effect-free AMDP.",
    },
    {
      n: 9,
      question: "Which modern equivalent replaces MOVE-CORRESPONDING ls_a TO ls_b?",
      options: {
        A: "ls_b = ls_a.",
        B: "ls_b = CORRESPONDING #( ls_a ).",
        C: "ls_b = VALUE #( ls_a ).",
        D: "ls_b = NEW #( ls_a ).",
      },
      correct: "B",
      explanations: {
        A: "Plain assignment copies the whole structure, not matching components.",
        B: "Correct — CORRESPONDING #( ) maps matching components.",
        C: "VALUE constructs a new value, not a corresponding map.",
        D: "NEW creates a reference.",
      },
      principle: "CORRESPONDING #( ) is the modern MOVE-CORRESPONDING.",
    },
    {
      n: 10,
      question: "FILTER #( lt_data WHERE status = 'OPEN' ) fails to activate. Most likely fix?",
      options: {
        A: "Declare lt_data with a SORTED or HASHED secondary key on status.",
        B: "Rewrite it as a LOOP.",
        C: "Use REDUCE instead.",
        D: "Move the WHERE outside the constructor.",
      },
      correct: "A",
      explanations: {
        A: "Correct — FILTER needs a secondary key on the filtered component.",
        B: "A loop works but isn't the fix for the error.",
        C: "REDUCE folds; it doesn't address the missing key.",
        D: "The WHERE belongs inside FILTER.",
      },
      principle: "FILTER requires a declared secondary key.",
    },
    {
      n: 11,
      question:
        "In a cloud package, what is the released way to compute a SHA-256 hash?",
      options: {
        A: "CALL FUNCTION 'CALCULATE_HASH_FOR_CHAR'.",
        B: "A native SQL hash function.",
        C: "XCO_CP_HASH with algorithm SHA-256.",
        D: "CL_ABAP_MESSAGE_DIGEST legacy methods.",
      },
      correct: "C",
      explanations: {
        A: "That function module is not released for cloud.",
        B: "Native SQL is forbidden.",
        C: "Correct — the XCO hash API is the released path.",
        D: "The legacy digest class isn't the cloud-clean choice.",
      },
      principle: "Reach for XCO for cross-cutting concerns in cloud ABAP.",
    },
    {
      n: 12,
      question: "Where do ATC baselines live, conceptually?",
      options: {
        A: "In the local Eclipse workspace.",
        B: "In the central ATC system, attached to a check-run scope.",
        C: "In Solution Manager.",
        D: "In version control.",
      },
      correct: "B",
      explanations: {
        A: "Not the workspace.",
        B: "Correct — the central ATC system stores the baseline against the scope.",
        C: "Not SolMan.",
        D: "Not in git.",
      },
      principle: "Baselines are central, scoped to a check run.",
    },
    {
      n: 13,
      question: "A check using CL_CI_TEST_SCAN runs against:",
      options: {
        A: "Compiled bytecode.",
        B: "The HANA query plan.",
        C: "Network packets.",
        D: "The token stream of ABAP source.",
      },
      correct: "D",
      explanations: {
        A: "Not bytecode.",
        B: "Not the query plan.",
        C: "Not packets.",
        D: "Correct — scan checks operate on the source token stream.",
      },
      principle: "Token-scan checks read the source tokens.",
    },
    {
      n: 14,
      question:
        "Which transaction collects per-object runtime usage statistics that aid decommissioning?",
      options: {
        A: "SAT",
        B: "SCMON",
        C: "ST22",
        D: "SE16N",
      },
      correct: "B",
      explanations: {
        A: "SAT is a runtime trace, not usage logging.",
        B: "Correct — SCMON logs object usage over time.",
        C: "ST22 lists dumps.",
        D: "SE16N is a data browser.",
      },
      principle: "SCMON scopes what's actually used before you decommission.",
    },
    {
      n: 15,
      question:
        "BSEG reads are slow after the S/4HANA upgrade. What is the modern source of truth for new analytics?",
      options: {
        A: "KONV",
        B: "ACDOCA (the Universal Journal), via released CDS.",
        C: "NAST",
        D: "MSEG only.",
      },
      correct: "B",
      explanations: {
        A: "KONV is pricing, replaced by PRCD_ELEMENTS.",
        B: "Correct — ACDOCA is the Universal Journal; read it through released CDS interface views (I_*).",
        C: "NAST is output management.",
        D: "MSEG is inventory, augmented by MATDOC.",
      },
      principle: "New financial analytics read ACDOCA, not BSEG directly.",
    },
    {
      n: 16,
      question:
        "An AMDP table function reads cross-client data unexpectedly. The defect is:",
      options: {
        A: "Missing OPTIONS READ-ONLY.",
        B: "Wrong LANGUAGE keyword.",
        C: "No explicit client filter (WHERE mandt = :p_client).",
        D: "Missing RETURNING parameter.",
      },
      correct: "C",
      explanations: {
        A: "READ-ONLY affects routing, not client scoping.",
        B: "The language keyword wouldn't leak clients.",
        C: "Correct — AMDP has no implicit MANDT; you must filter the client yourself.",
        D: "Table functions return their declared structure regardless.",
      },
      principle: "AMDP must handle the client explicitly.",
    },
    {
      n: 17,
      kind: "true-false",
      question:
        "READ TABLE lt WITH KEY f = v BINARY SEARCH always raises a runtime error if lt is not sorted.",
      correct: false,
      explanationFalse:
        "Correct — it returns an undefined result with no error, which is exactly why it's dangerous.",
      explanationTrue:
        "It does not raise an error; it silently returns an undefined result.",
      principle: "BINARY SEARCH on an unsorted table fails silently.",
    },
    {
      n: 18,
      kind: "true-false",
      question: "FOR ALL ENTRIES discards duplicate driver rows before issuing the query.",
      correct: true,
      explanationTrue:
        "Correct — the driver is de-duplicated, so a 1:1 cardinality assumption can be wrong.",
      explanationFalse:
        "It does de-duplicate the driver — that's a documented behaviour.",
      principle: "FOR ALL ENTRIES de-duplicates the driver table.",
    },
    {
      n: 19,
      kind: "fill-in",
      question:
        "The released ABAP library for cross-cutting concerns (JSON, hashing, time, repository introspection) has the prefix ____.",
      acceptedAnswers: ["XCO_CP", "XCO", "xco_cp", "xco"],
      placeholder: "e.g. CL_…",
      explanation: "The XCO (Extension Component) library — classes prefixed XCO_CP.",
      principle: "XCO_CP is the released cross-cutting library.",
    },
    {
      n: 20,
      kind: "fill-in",
      question:
        "The ATC check variant aligned to the ABAP Cloud (Restricted ABAP) restrictions is ____.",
      acceptedAnswers: [
        "ABAP_CLOUD_DEVELOPMENT_DEFAULT",
        "abap_cloud_development_default",
      ],
      placeholder: "variant name",
      explanation:
        "ABAP_CLOUD_DEVELOPMENT_DEFAULT is the practical source of truth for what compiles in a cloud package.",
      principle: "Gate cloud packages with ABAP_CLOUD_DEVELOPMENT_DEFAULT.",
    },
  ],
};
