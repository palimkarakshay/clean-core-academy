/* ------------------------------------------------------------------
   Module 13 — Capstone Scenarios.

   Source brief: §14 of the Clean Core & HANA Readiness curriculum.
   Audience: expert architects/leads (T3) plus management who own the
   strategy. These three concepts are scenario walk-throughs, not
   recipes: each lesson sets up a realistic situation and lays out the
   expected approach and deliverables, while the quiz tests the
   reasoning — best sequencing, the right tool for the step, the right
   decision under constraints. Every concept ships paragraphs +
   keyPoints + simplified.oneLiner and a 3-question quiz with
   per-option explanations.
------------------------------------------------------------------ */

import type { Section } from "../_types";

export const m13Capstones: Section = {
  id: "m13-capstones",
  n: 13,
  title: "Capstone Scenarios",
  sourceCourse: "clean-core-curriculum §14",
  audiences: ["expert", "management"],
  skills: [
    {
      id: "m13-s1",
      label: "Design a 12-month Clean Core migration roadmap for a large legacy codebase",
      conceptId: "m13-c1",
    },
    {
      id: "m13-s2",
      label: "Architect a released-API-first RAP extension end to end with tests and ATC",
      conceptId: "m13-c2",
    },
    {
      id: "m13-s3",
      label: "Run a HANA performance-forensics path from SAT through PLANVIZ to a fix decision",
      conceptId: "m13-c3",
    },
  ],
  blurb:
    "Put it all together on three realistic, end-to-end scenarios — the kind of judgement calls a lead or architect makes on a real programme. The capstones cover planning a 12-month Clean Core roadmap for a 4M-LOC codebase, building a released-API-first RAP (SAP's modern programming model) extension from scratch, and tracing a HANA performance regression to a defensible fix. The quizzes test sequencing, tool choice, and decision-making.",
  concepts: [
    {
      id: "m13-c1",
      code: "14.1",
      title: "Capstone A — From 0 to ATC-green",
      bloom: "C",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §14.1",
        paragraphs: [
          "The scenario: you inherit a four-million-line custom codebase on ERP 6 EHP8 that is about to migrate to S/4HANA 2023, and you must define a twelve-month roadmap through a Clean Core lens. The trap is to start fixing code; the architect's job is to scope, sequence, and govern before a single line is touched, because at this scale effort spent on dead or low-risk code is effort wasted.",
          "Scoping comes first: deploy SCMON on the productive system for a representative window — one to three months — so the roadmap targets what is actually executed rather than the whole inventory. The check strategy then escalates deliberately through ATC variants: DEFAULT for a broad first pass, S4HANA_READINESS_2023 for migration-specific Simplification findings, and ABAP_CLOUD_DEVELOPMENT_DEFAULT for code heading to developer extensibility. Each escalation is gated by a baseline and an exemption process with named owners, so the team only ever chases new debt.",
          "The remaining deliverables turn analysis into decisions. A decoupling-cockpit matrix records, per standard API touched, whether you wrap it (a Z facade for cheap future-proofing) or rewrite it to a released equivalent. A decommission policy governs unused code — mark, watch one more cycle, then delete — and a communication plan warns business owners of any behavioural change before it ships. The named-owner governance on baselines and exemptions is what keeps a twelve-month programme honest.",
        ],
        keyPoints: [
          "Scope first with SCMON over a 1-3 month window to find the code that is actually executed.",
          "Escalate ATC variants deliberately: DEFAULT, then S4HANA_READINESS_2023, then ABAP_CLOUD_DEVELOPMENT_DEFAULT.",
          "Gate each stage with a baseline plus an exemption process owned by named people.",
          "Use a decoupling-cockpit matrix to decide wrap-versus-rewrite per standard API.",
          "Set a decommission policy (mark, watch a cycle, delete) and a business-comms plan for behavioural change.",
        ],
        simplified: {
          oneLiner:
            "Scope with SCMON, escalate ATC variants DEFAULT to READINESS to CLOUD behind baselines with named owners, decide wrap-versus-rewrite per API, and govern decommissioning and business comms — fix code last, not first.",
          analogy:
            "It is triage before surgery: survey what is alive, decide what to operate on versus splint, and brief the family before you cut.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "At 4M LOC, what should the roadmap do before any code is rewritten?",
            options: {
              A: "Rewrite the largest programs first to maximise visible progress.",
              B: "Turn on ABAP_CLOUD_DEVELOPMENT_DEFAULT and fix every finding immediately.",
              C: "Scope actual usage with SCMON over a representative window.",
              D: "Delete every object with zero references this week.",
            },
            correct: "C",
            explanations: {
              A: "Size is not risk; rewriting big programs that are rarely run wastes the budget.",
              B: "Jumping straight to the strictest variant with no baseline drowns the team in pre-existing debt.",
              C: "Correct — SCMON over 1-3 months reveals what is actually executed so effort targets live code.",
              D: "Deleting on a single snapshot is reckless; the decommission policy mandates a watch cycle first.",
            },
            principle:
              "Scope by real usage before remediating — SCMON tells you what is worth touching.",
          },
          {
            n: 2,
            question:
              "What is the correct escalation order for the ATC variant strategy?",
            options: {
              A: "DEFAULT, then S4HANA_READINESS_2023, then ABAP_CLOUD_DEVELOPMENT_DEFAULT.",
              B: "ABAP_CLOUD_DEVELOPMENT_DEFAULT first, then nothing else is needed.",
              C: "SECURITY_CHECK, then PERFORMANCE_DB, then DEFAULT.",
              D: "Whichever variant returns the fewest findings each week.",
            },
            correct: "A",
            explanations: {
              A: "Correct — a broad DEFAULT pass, then migration-specific readiness, then the Cloud-restriction variant for code going to developer extensibility.",
              B: "Starting at the strictest variant skips the migration-readiness work and overwhelms the team.",
              C: "These are specialised variants in an arbitrary order; they are not the readiness escalation path.",
              D: "Cherry-picking by finding count is gaming the metric, not a strategy.",
            },
            principle:
              "Escalate DEFAULT to READINESS to CLOUD so each stage builds on the last.",
          },
          {
            n: 3,
            question:
              "What keeps the baseline-and-exemption governance honest over a 12-month programme?",
            options: {
              A: "Allowing any developer to self-approve unlimited exemptions.",
              B: "Deleting the baseline whenever findings get inconvenient.",
              C: "Never re-baselining, so the original snapshot is permanent.",
              D: "Named owners on baselines and a reviewed exemption process.",
            },
            correct: "D",
            explanations: {
              A: "Unbounded self-approval turns exemptions into a loophole that hides real debt.",
              B: "Deleting the baseline erases the record of accepted debt and the deltas it protects.",
              C: "Baselines must be maintained and periodically re-cut as findings are fixed, not frozen forever.",
              D: "Correct — named ownership and a reviewed exemption workflow give accountability and an audit trail.",
            },
            principle:
              "Accountable ownership and a reviewed exemption process stop governance from rotting.",
          },
        ],
      },
    },
    {
      id: "m13-c2",
      code: "14.2",
      title: "Capstone B — Released-API-first new development",
      bloom: "C",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §14.2",
        paragraphs: [
          "The scenario: a greenfield purchase-requisition extension, built released-API-first so it is Clean Core by construction rather than by remediation. Because there is no legacy to migrate, every choice can be the modern one, and the capstone is graded on whether the full RAP stack hangs together and proves itself with tests.",
          "The build is the canonical on-stack ABAP Cloud stack. One CDS root view entity sits over a Z table; a managed RAP business object adds exactly one validation and one determination, so the learner shows they can place logic in the behaviour layer without over-building. A consumption projection, a service definition, and an OData V4 binding expose it, and a DCL role tied to a PFCG authorization object moves authorisation into the model rather than scattering AUTHORITY-CHECK through the code.",
          "Proof is non-negotiable. The behaviour is unit-tested with cl_abap_behv_aux_factory, which drives the RAP BO without touching the database, and the CDS view is tested with cl_cds_test_environment against injected rows. The whole thing must come up ATC-clean against ABAP_CLOUD_DEVELOPMENT_DEFAULT — the standing proof that nothing reaches an unreleased object and the extension will survive upgrades.",
        ],
        keyPoints: [
          "Model one CDS root view entity over a Z table as the foundation.",
          "Build a managed RAP BO with exactly one validation and one determination.",
          "Expose it via a consumption projection, a service definition, and an OData V4 binding.",
          "Move authorisation into a DCL role tied to a PFCG authorization object.",
          "Prove it: cl_abap_behv_aux_factory for the BO, cl_cds_test_environment for the view, ATC-clean against ABAP_CLOUD_DEVELOPMENT_DEFAULT.",
        ],
        simplified: {
          oneLiner:
            "Build the full on-stack ABAP Cloud stack greenfield — CDS root entity over a Z table, a managed RAP BO with one validation and one determination, projection plus service plus OData V4, a DCL role, and tests — all ATC-clean against ABAP_CLOUD_DEVELOPMENT_DEFAULT.",
          analogy:
            "It is building a house to code from the foundation up, so the inspection (ATC) passes without any retrofits.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "What sits at the foundation of the greenfield extension's data model?",
            options: {
              A: "A direct SELECT from the standard table EBAN in every method.",
              B: "One CDS root view entity over a Z table.",
              C: "A classic module pool reading the Z table with TABLES.",
              D: "An EXEC SQL native query against the persistence.",
            },
            correct: "B",
            explanations: {
              A: "Reading a standard table directly from a Cloud package is a Clean Core violation; the model is built on its own CDS entity.",
              B: "Correct — a CDS root view entity over the Z table is the foundation of the RAP stack.",
              C: "Module pools and TABLES are forbidden in ABAP Cloud and are not part of the RAP model.",
              D: "Native SQL is forbidden in ABAP Cloud and bypasses the model entirely.",
            },
            principle:
              "A released-API-first extension is founded on a CDS root view entity, not raw table access.",
          },
          {
            n: 2,
            question:
              "Where does authorisation live in this released-API-first design?",
            options: {
              A: "In AUTHORITY-CHECK statements scattered through the behaviour pool.",
              B: "Nowhere — managed RAP BOs need no authorisation.",
              C: "In the OData service binding configuration only.",
              D: "In a DCL role tied to a PFCG authorization object.",
            },
            correct: "D",
            explanations: {
              A: "Scattering AUTHORITY-CHECK is exactly the pattern Clean Core moves away from; authorisation belongs in the model.",
              B: "An end-user-facing BO absolutely needs authorisation; it is not optional.",
              C: "The service binding exposes the service; it does not define row-level authorisation.",
              D: "Correct — a DCL role bound to a PFCG authorization object pushes authorisation into the model.",
            },
            principle:
              "Authorisation moves into a DCL role linked to a PFCG object, not into scattered checks.",
          },
          {
            n: 3,
            question:
              "Which pair of frameworks proves the behaviour and the view, and against which variant must ATC be clean?",
            options: {
              A: "cl_abap_behv_aux_factory and cl_cds_test_environment; ATC-clean against ABAP_CLOUD_DEVELOPMENT_DEFAULT.",
              B: "cl_gui_frontend_services and EXEC SQL; ATC-clean against PERFORMANCE_DB.",
              C: "cl_salv_table and WRITE statements; ATC-clean against DEFAULT.",
              D: "Manual testing in the SAP GUI; no ATC variant required.",
            },
            correct: "A",
            explanations: {
              A: "Correct — cl_abap_behv_aux_factory unit-tests the RAP BO and cl_cds_test_environment tests the view, with ATC clean against ABAP_CLOUD_DEVELOPMENT_DEFAULT.",
              B: "Front-end services and native SQL are forbidden in ABAP Cloud and PERFORMANCE_DB is the wrong gate.",
              C: "ALV rendering and WRITE are not unit-test frameworks, and DEFAULT is not the Cloud-compliance gate.",
              D: "Greenfield Clean Core work demands automated tests and the Cloud variant, not manual GUI checks.",
            },
            principle:
              "Prove RAP with cl_abap_behv_aux_factory, CDS with cl_cds_test_environment, all clean under ABAP_CLOUD_DEVELOPMENT_DEFAULT.",
          },
        ],
      },
    },
    {
      id: "m13-c3",
      code: "14.3",
      title: "Capstone C — Performance forensics",
      bloom: "E",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §14.3",
        paragraphs: [
          "The scenario: a nightly batch job that ran in eight minutes before HANA now takes thirty-five, and you must walk a defensible diagnostic path rather than guess at a fix. The discipline is to measure top-down — find where the time goes before deciding what to change — because the obvious culprit is rarely the real one on a columnar engine.",
          "The path moves from coarse to fine. SAT profiles the runtime and surfaces the time-dominant blocks, telling you whether the cost is in ABAP processing or in database access. If it is the database, ST05 traces the SQL and names the offending statements. PLANVIZ then shows the per-statement execution plan for each offender, exposing the actual operator tree — a full column scan, an unexpected nested-loop join, a missing pushdown.",
          "Only with the plan in hand do you reach the decision tree, and the order reflects rising cost and risk: an index where a scan should be a lookup; a hint where the optimizer needs a nudge; a CDS rewrite to push the logic down declaratively; or, last, an AMDP rewrite when only SQLScript can express it. Every chosen fix is paired with an acceptance test plan that re-measures against the eight-minute baseline, so 'fixed' is proven, not asserted.",
        ],
        keyPoints: [
          "Start with SAT to find the time-dominant blocks (ABAP versus database).",
          "Use ST05 to trace the SQL and surface the offending statements.",
          "Run PLANVIZ per offender to read the actual per-statement execution plan.",
          "Apply the decision tree in rising order: index, hint, CDS rewrite, AMDP rewrite.",
          "Pair the fix with an acceptance test plan that re-measures against the original baseline.",
        ],
        simplified: {
          oneLiner:
            "Measure top-down — SAT for the hot blocks, ST05 for the bad statements, PLANVIZ for each plan — then choose index, hint, CDS rewrite, or AMDP rewrite, and prove it with an acceptance test against the old runtime.",
          analogy:
            "It is medical diagnosis: vitals (SAT), then targeted tests (ST05), then imaging (PLANVIZ) — you prescribe only once you can see the problem.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Where does the performance-forensics path begin?",
            options: {
              A: "Add a database index immediately on the largest table.",
              B: "Rewrite the batch as an AMDP and re-measure.",
              C: "Profile with SAT to find the time-dominant blocks.",
              D: "Open PLANVIZ before any statement has been identified.",
            },
            correct: "C",
            explanations: {
              A: "Indexing before measuring is guessing; the bottleneck may not be where you think.",
              B: "An AMDP rewrite is the last resort, applied only after the plan justifies it.",
              C: "Correct — SAT profiles the run and shows where the time actually goes, ABAP or DB.",
              D: "PLANVIZ explains a specific statement; you need ST05 to identify offenders first.",
            },
            principle:
              "Measure top-down with SAT before changing anything.",
          },
          {
            n: 2,
            question:
              "Once SAT points at database time, what is the right sequence to reach a single statement's plan?",
            options: {
              A: "Go straight from SAT to an AMDP rewrite.",
              B: "ST05 to surface the offending statements, then PLANVIZ per offender.",
              C: "PLANVIZ across the whole batch at once, then ST05.",
              D: "Guess the statement from the code and add a hint.",
            },
            correct: "B",
            explanations: {
              A: "Skipping straight to a rewrite abandons the diagnosis the tools are there to provide.",
              B: "Correct — ST05 names the offending SQL, then PLANVIZ shows each offender's per-statement plan.",
              C: "PLANVIZ works per statement; you must first identify the statements with ST05.",
              D: "Guessing and hinting blind is exactly what the forensic path replaces.",
            },
            principle:
              "ST05 identifies the offenders; PLANVIZ explains each one's plan.",
          },
          {
            n: 3,
            question:
              "With the plan in hand, what is the intended order of the fix decision tree?",
            options: {
              A: "AMDP rewrite, then CDS rewrite, then hint, then index.",
              B: "Index, then hint, then CDS rewrite, then AMDP rewrite.",
              C: "Always a hint, regardless of the plan.",
              D: "Whichever fix is quickest to type that day.",
            },
            correct: "B",
            explanations: {
              A: "That inverts the order — it leads with the most invasive option.",
              B: "Correct — escalate by rising cost and risk: index, hint, CDS rewrite, then AMDP rewrite as the last resort.",
              C: "Hints stick and can outlive their justification; they are not a default.",
              D: "Choosing by typing effort ignores the cost and risk the decision tree is built to weigh.",
            },
            principle:
              "Escalate fixes by cost and risk: index, hint, CDS rewrite, AMDP rewrite.",
          },
        ],
      },
    },
  ],
  sectionTest: {
    passPct: 0.7,
    questions: [
      {
        n: 1,
        question:
          "Inheriting a 4M-LOC codebase bound for S/4HANA 2023, what is the architect's first move?",
        options: {
          A: "Rewrite the biggest programs to show progress.",
          B: "Apply ABAP_CLOUD_DEVELOPMENT_DEFAULT and fix everything at once.",
          C: "Delete all zero-reference objects immediately.",
          D: "Deploy SCMON over a representative window to scope actual usage.",
        },
        correct: "D",
        explanations: {
          A: "Program size is not risk; this burns budget on possibly-dead code.",
          B: "The strictest variant with no baseline buries the team in pre-existing debt.",
          C: "Deletion needs a watch cycle under the decommission policy, not a snapshot.",
          D: "Correct — SCMON scoping reveals the live code worth remediating first.",
        },
        principle: "Scope real usage with SCMON before remediating.",
      },
      {
        n: 2,
        question: "The ATC variant escalation in Capstone A runs in which order?",
        options: {
          A: "SECURITY_CHECK, PERFORMANCE_DB, DEFAULT.",
          B: "DEFAULT, S4HANA_READINESS_2023, ABAP_CLOUD_DEVELOPMENT_DEFAULT.",
          C: "ABAP_CLOUD_DEVELOPMENT_DEFAULT only.",
          D: "Whichever variant yields the fewest findings.",
        },
        correct: "B",
        explanations: {
          A: "These specialised variants in this order are not the readiness escalation path.",
          B: "Correct — broad DEFAULT, then migration readiness, then the Cloud-restriction variant.",
          C: "Starting at the strictest variant skips the readiness stage and overwhelms the team.",
          D: "Selecting by finding count games the metric instead of following a strategy.",
        },
        principle: "Escalate DEFAULT to READINESS to CLOUD.",
      },
      {
        n: 3,
        question:
          "In the greenfield RAP capstone, which frameworks test the BO and the CDS view?",
        options: {
          A: "cl_abap_behv_aux_factory for the BO and cl_cds_test_environment for the view.",
          B: "cl_gui_frontend_services and EXEC SQL.",
          C: "cl_salv_table and WRITE statements.",
          D: "Manual SAP GUI testing only.",
        },
        correct: "A",
        explanations: {
          A: "Correct — cl_abap_behv_aux_factory drives the RAP BO and cl_cds_test_environment tests the view, both without the real DB.",
          B: "Front-end services and native SQL are forbidden in ABAP Cloud and are not test frameworks.",
          C: "ALV and WRITE are output, not unit-test tooling.",
          D: "Clean Core greenfield work demands automated tests, not manual checks.",
        },
        principle:
          "Test RAP with cl_abap_behv_aux_factory and CDS with cl_cds_test_environment.",
      },
      {
        n: 4,
        question:
          "A batch went from 8 to 35 minutes after HANA. Where does the diagnosis start?",
        options: {
          A: "Add an index to the largest table straight away.",
          B: "Rewrite the job as an AMDP first.",
          C: "Profile with SAT to find the time-dominant blocks.",
          D: "Open PLANVIZ before identifying any statement.",
        },
        correct: "C",
        explanations: {
          A: "Indexing before measuring is a guess at an unconfirmed bottleneck.",
          B: "An AMDP rewrite is the last-resort fix, not the first diagnostic step.",
          C: "Correct — SAT shows where the time goes before anything is changed.",
          D: "PLANVIZ needs a specific statement, which ST05 identifies after SAT.",
        },
        principle: "Begin performance forensics top-down with SAT.",
      },
      {
        n: 5,
        question:
          "After PLANVIZ shows the plan, the fix decision tree is applied in which order?",
        options: {
          A: "Index, hint, CDS rewrite, AMDP rewrite.",
          B: "AMDP rewrite, then everything else.",
          C: "Always a hint regardless of the plan.",
          D: "Whatever is fastest to code that day.",
        },
        correct: "A",
        explanations: {
          A: "Correct — escalate by rising cost and risk: index, then hint, then CDS rewrite, then AMDP rewrite.",
          B: "Leading with an AMDP rewrite is the most invasive option first — backwards.",
          C: "Hints persist and can outlive their justification; not a default.",
          D: "Typing effort is the wrong criterion; weigh cost and risk.",
        },
        principle: "Escalate fixes by cost and risk, AMDP last.",
      },
    ],
  },
};
