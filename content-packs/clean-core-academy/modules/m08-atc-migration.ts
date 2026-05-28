/* ------------------------------------------------------------------
   Module 8 — ATC, Custom-Code Migration & Simplification.

   Source brief: §8 of the Clean Core & HANA Readiness curriculum.
   Audience: intermediate + expert + admin — builders, architects, and
   Basis/DevOps owners of the migration toolchain. Reference release
   S/4HANA 2023 (758). Follows the m01 authoring template: every concept
   ships paragraphs + keyPoints + simplified.oneLiner + a 3-question
   quiz with per-option explanations; tool/process concepts use neutral
   examples, code-relevant ones use lowercase ABAP.
------------------------------------------------------------------ */

import type { Section } from "../_types";

export const m08AtcMigration: Section = {
  id: "m08-atc-migration",
  n: 8,
  title: "ATC, Custom-Code Migration & Simplification",
  sourceCourse: "clean-core-curriculum §8",
  audiences: ["intermediate", "expert", "admin"],
  skills: [
    {
      id: "m08-s1",
      label: "Pick the right ATC variant (readiness, cloud, performance, security) and compose a team union variant with severities",
      conceptId: "m08-c1",
    },
    {
      id: "m08-s2",
      label: "Explain local vs central/remote ATC and how CI/CD invokes it through the Code Inspector API",
      conceptId: "m08-c2",
    },
    {
      id: "m08-s3",
      label: "Create and maintain an exemption baseline so ATC reports only new debt, and transport it across systems",
      conceptId: "m08-c3",
    },
    {
      id: "m08-s4",
      label: "Run the full Custom Code Migration loop from usage scoping through re-baseline each sprint",
      conceptId: "m08-c4",
    },
    {
      id: "m08-s5",
      label: "Map high-impact Simplification Items to their successor tables and bridge old reads with the released interface views (I_*) over the new model",
      conceptId: "m08-c5",
    },
  ],
  blurb:
    "The ATC variants every team should know, the local/central/CI-CD topology, the exemption baseline that hides today's debt, the full Custom Code Migration loop, and the Simplification Items that bite hardest in an upgrade.",
  concepts: [
    {
      id: "m08-c1",
      code: "8.1",
      title: "ATC variants every team should know",
      bloom: "U",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §8.1",
        paragraphs: [
          "An ATC check variant is just a named bundle of Code Inspector checks with their severities. Which variant you run decides what 'clean' even means, so a senior team treats variant selection as a deliberate decision, not a default. SAP ships several you should recognise on sight. `DEFAULT` is the broad, general-purpose variant — useful, but it knows nothing about Clean Core or your target release.",
          "`S4HANA_READINESS_2023` is the release-aligned variant: it runs the Simplification checks (against the Simplification Database for that target release) plus HANA-readiness checks, and it is what you point at custom code before and during a conversion. `ABAP_CLOUD_DEVELOPMENT_DEFAULT` is the Clean Core variant: it enforces Restricted ABAP and released-only API consumption, so it is the source of truth for whether code could live in a Tier-2 cloud package. `PERFORMANCE_DB` concentrates on database-centric performance findings, and `SECURITY_CHECK` runs the Code Vulnerability Analyzer (CVA) checks, which are licence-gated and off unless your system is entitled.",
          "Because each variant answers a different question, mature teams build one custom variant that is a union of the relevant SAP variants, then tune the severities to their own codebase — promoting the findings they will block a transport on to error, and demoting the rest to warning or information. The union variant becomes the single thing the pipeline and every developer runs, so 'green locally' and 'green in CI' mean the same thing.",
        ],
        keyPoints: [
          "DEFAULT is broad and release-agnostic — not Clean Core or readiness aware.",
          "S4HANA_READINESS_2023 = Simplification + HANA readiness for the target release.",
          "ABAP_CLOUD_DEVELOPMENT_DEFAULT enforces Restricted ABAP and released-only consumption.",
          "PERFORMANCE_DB is DB performance; SECURITY_CHECK is CVA and licence-gated.",
          "Build one custom union variant with team-tuned severities as the single source of truth.",
        ],
        examples: [
          {
            title: "Composing a team union variant",
            variant: "neutral",
            body: "In SCI, create a variant that includes the readiness and cloud checks (plus performance where it matters), then raise the handful you gate transports on to error and leave the rest as warnings — so local and CI runs agree.",
          },
        ],
        simplified: {
          oneLiner:
            "The ATC variant you choose defines what 'clean' means — know the SAP ones (readiness, cloud, performance, security) and build one tuned union for your team.",
          analogy:
            "Variants are different inspection checklists for the same building — pick the right checklist for the question you're asking, or staple the relevant ones into one house standard.",
        },
        deeper: {
          paragraphs: [
            "SECURITY_CHECK being licence-gated matters operationally: CVA findings simply will not appear in a system without the entitlement, so a team can believe it is 'clean' while data-flow vulnerabilities go unchecked. Confirm the licence before you rely on security results.",
          ],
          keyPoints: [
            "No CVA licence means no security findings — absence is not proof of safety.",
            "Severities live in the variant, so the same check can block one team and merely inform another.",
          ],
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Which ATC variant is the source of truth for whether code could run in a Tier-2 ABAP Cloud package?",
            options: {
              A: "ABAP_CLOUD_DEVELOPMENT_DEFAULT.",
              B: "DEFAULT.",
              C: "PERFORMANCE_DB.",
              D: "SECURITY_CHECK.",
            },
            correct: "A",
            explanations: {
              A: "Correct — it enforces Restricted ABAP and released-only API consumption, the Clean Core contract.",
              B: "DEFAULT is broad and knows nothing about Clean Core.",
              C: "PERFORMANCE_DB targets database performance, not cloud restrictions.",
              D: "SECURITY_CHECK runs CVA vulnerability checks, not the cloud language rules.",
            },
            principle:
              "ABAP_CLOUD_DEVELOPMENT_DEFAULT is the Clean Core / Restricted ABAP variant.",
          },
          {
            n: 2,
            question:
              "What does the S4HANA_READINESS_2023 variant primarily check?",
            options: {
              A: "Only ABAP code style and formatting.",
              B: "Only side-by-side BTP connectivity.",
              C: "Simplification (against the target-release Simplification DB) plus HANA readiness.",
              D: "Whether a CVA security licence is installed.",
            },
            correct: "C",
            explanations: {
              A: "Style is a Clean ABAP concern, not the focus of the readiness variant.",
              B: "BTP connectivity is not what the readiness variant inspects.",
              C: "Correct — it bundles the release-aligned Simplification checks with HANA-readiness checks.",
              D: "Licence checks are unrelated to the readiness variant.",
            },
            principle:
              "The readiness variant pairs Simplification-DB checks with HANA readiness for a target release.",
          },
          {
            n: 3,
            question:
              "Why does the SECURITY_CHECK variant sometimes return no findings even on risky code?",
            options: {
              A: "Security findings are merged silently into DEFAULT.",
              B: "ATC never inspects security at all.",
              C: "The variant only runs on BTP.",
              D: "CVA checks are licence-gated and inactive without the entitlement.",
            },
            correct: "D",
            explanations: {
              A: "There is no silent merge into DEFAULT.",
              B: "ATC can inspect security via CVA — when licensed.",
              C: "It is not restricted to BTP.",
              D: "Correct — without the CVA licence the checks do not run, so absence of findings is not proof of safety.",
            },
            principle:
              "CVA security checks are licence-gated; no entitlement means no security findings.",
          },
        ],
      },
    },
    {
      id: "m08-c2",
      code: "8.2",
      title: "ATC topology: local, central, CI/CD",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §8.2",
        paragraphs: [
          "ATC runs in three places, and the difference is about where the checks execute and what data they can see. Local ATC is what a developer triggers in ADT on a single object or package — fast inner-loop feedback while writing code. It uses whatever check infrastructure is installed locally, which is fine for language and Clean Core checks but is not where you run a full Simplification analysis.",
          "Central (remote) ATC is the production setup. A dedicated ATC system — usually the DevOps or QA stack — reaches into the source systems over RFC and runs the checks there, reporting back centrally. The reason this is the canonical topology is the Simplification Database: it is maintained centrally on the ATC master, so you keep one current, release-correct catalog instead of trying to install and update it on every system. Central ATC also owns the baselines and the exemption workflow, so governance is in one place.",
          "ATC in CI/CD closes the loop for pipelines: a gCTS or abapGit pipeline invokes remote ATC programmatically through the Code Inspector API (for example `cl_ci_tests` / `cl_ci_check_objects`) rather than a human pressing a button. The pipeline runs the same union variant the central system uses, so a merge or transport can be blocked automatically before unclean code reaches the next system.",
        ],
        keyPoints: [
          "Local ATC: per object/package in ADT — fast inner-loop feedback.",
          "Central/remote ATC over RFC against source systems is the production setup.",
          "The Simplification DB lives centrally on the ATC master — one current catalog for all systems.",
          "Central ATC owns baselines and the exemption workflow (one governance point).",
          "CI/CD calls remote ATC through the Code Inspector API (cl_ci_tests / cl_ci_check_objects).",
        ],
        examples: [
          {
            title: "Why the Simplification DB sits centrally",
            variant: "neutral",
            body: "Rather than installing and patching the Simplification catalog on every box, the central ATC system holds the current release's DB and runs S4HANA_READINESS_2023 remotely against each source system over RFC.",
          },
        ],
        simplified: {
          oneLiner:
            "Run ATC three ways — locally in ADT for fast feedback, centrally over RFC (where the Simplification DB and baselines live) as the real setup, and in CI/CD via the Code Inspector API.",
          analogy:
            "Local ATC is a spell-check as you type; central ATC is the editorial desk with the master style guide; CI/CD is the automated gate that won't publish until the desk signs off.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "In the central/remote ATC topology, where does the Simplification Database live?",
            options: {
              A: "On every developer laptop.",
              B: "Centrally on the ATC master system, which checks source systems over RFC.",
              C: "Inside each Fiori app.",
              D: "Only in the transport directory.",
            },
            correct: "B",
            explanations: {
              A: "Developers do not host the Simplification DB; that would mean patching every machine.",
              B: "Correct — one current catalog on the central ATC master, reaching source systems over RFC, is the production setup.",
              C: "Fiori apps consume results; they do not host the catalog.",
              D: "The transport directory moves objects, not the Simplification DB.",
            },
            principle:
              "Central ATC keeps one current Simplification DB and checks remote systems over RFC.",
          },
          {
            n: 2,
            question:
              "What is the main value of local ATC in ADT?",
            options: {
              A: "Fast inner-loop feedback on a single object or package while coding.",
              B: "It hosts the exemption-approval workflow.",
              C: "It runs the full Simplification analysis against the central DB.",
              D: "It replaces the need for any central system.",
            },
            correct: "A",
            explanations: {
              A: "Correct — local ATC gives quick per-object/package feedback during development.",
              B: "Exemption workflow is owned by the central ATC system.",
              C: "The full Simplification analysis runs centrally where the DB lives.",
              D: "Local runs complement, but do not replace, central governance.",
            },
            principle:
              "Local ATC is the fast inner loop; governance and Simplification stay central.",
          },
          {
            n: 3,
            question:
              "How does a CI/CD pipeline typically trigger ATC?",
            options: {
              A: "By emailing a screenshot to the QA team.",
              B: "By rebuilding the kernel on each commit.",
              C: "Programmatically via the Code Inspector API (e.g. cl_ci_tests / cl_ci_check_objects).",
              D: "By disabling all checks to keep the build green.",
            },
            correct: "C",
            explanations: {
              A: "A manual screenshot is not pipeline automation.",
              B: "Kernel rebuilds are unrelated to running ATC.",
              C: "Correct — the pipeline calls remote ATC through the Code Inspector API instead of a human pressing a button.",
              D: "Disabling checks defeats the purpose of the gate.",
            },
            principle:
              "CI/CD invokes remote ATC through the Code Inspector API to gate merges and transports.",
          },
        ],
      },
    },
    {
      id: "m08-c3",
      code: "8.3",
      title: "The exemption baseline",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §8.3",
        paragraphs: [
          "When you first point a Clean Core or readiness variant at a mature codebase, you get thousands of findings — all of it pre-existing debt. If every run shows that wall, developers stop reading the results, and a finding they actually introduced today drowns. A baseline solves this by snapshotting the findings that exist right now and declaring them the accepted starting point, so future runs warn you only about debt that is *new* relative to the snapshot.",
          "The workflow is simple and repeatable: run ATC across the relevant packages, choose 'Create Baseline' from the result list to store the snapshot system-side, and from then on every run compares against it and surfaces only the deltas. A new violation that did not exist at baseline time shows up immediately and can gate a transport; everything already in the baseline stays quiet. As you genuinely fix old findings, you maintain or re-baseline so the snapshot keeps shrinking and the accepted debt only ever goes down.",
          "Baselines are not trapped on the system that created them — they can be exported and imported, so the same accepted-debt picture travels across the landscape (for example from the central ATC system to a project sandbox). That portability is what lets a whole team share one definition of 'new debt' instead of each system drawing its own line.",
        ],
        keyPoints: [
          "A baseline snapshots today's debt so ATC warns only about NEW debt.",
          "Workflow: run → Create Baseline → future runs show only deltas.",
          "Maintain or re-baseline as you fix findings so accepted debt only shrinks.",
          "Baselines can be transported across systems, so the whole landscape shares one line.",
          "New violations surface immediately and can gate a transport; baselined ones stay quiet.",
        ],
        examples: [
          {
            title: "Baseline then chip away",
            variant: "neutral",
            body: "Run the variant, hit Create Baseline, and the next run is near-empty — only code written after the snapshot appears. Each sprint you fix some baselined items and re-baseline, so the accepted total only ever drops.",
          },
        ],
        simplified: {
          oneLiner:
            "A baseline freezes today's findings as accepted debt so ATC only flags new debt — and it can be transported so the whole landscape shares one line.",
          analogy:
            "It's marking the existing scratches on a rental car at pickup, so you're only charged for new ones you cause.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "What problem does an ATC exemption baseline solve?",
            options: {
              A: "It makes ATC checks run faster on the database.",
              B: "It rewrites legacy code automatically.",
              C: "It grants a CVA security licence.",
              D: "It hides pre-existing debt so only new debt is reported.",
            },
            correct: "D",
            explanations: {
              A: "A baseline filters results; it does not change check runtime.",
              B: "Baselines never modify code — they only classify findings.",
              C: "Licensing is unrelated to baselines.",
              D: "Correct — it snapshots existing findings as accepted so future runs surface only new debt.",
            },
            principle:
              "A baseline snapshots current debt so ATC reports only deltas afterward.",
          },
          {
            n: 2,
            question:
              "What is the correct baseline workflow?",
            options: {
              A: "Delete all findings, then disable ATC.",
              B: "Run ATC, create the baseline, then future runs show only deltas; re-baseline as you fix.",
              C: "Create the baseline before writing any code, once, forever.",
              D: "Export the code to Excel and stop running ATC.",
            },
            correct: "B",
            explanations: {
              A: "Deleting findings and disabling ATC abandons governance entirely.",
              B: "Correct — run, snapshot, compare deltas, and maintain/re-baseline as debt is paid down.",
              C: "A one-time, never-maintained baseline lets accepted debt drift; you re-baseline as you fix.",
              D: "Exporting and stopping ATC removes the very feedback the baseline supports.",
            },
            principle:
              "Run, create baseline, work the deltas, and re-baseline as findings are fixed.",
          },
          {
            n: 3,
            question:
              "Can an ATC baseline be shared across systems in a landscape?",
            options: {
              A: "Yes — baselines can be exported and imported (transported) across systems.",
              B: "No — a baseline is locked to the system that created it.",
              C: "Only if you re-write it as native SQL.",
              D: "Only by retyping every finding by hand.",
            },
            correct: "A",
            explanations: {
              A: "Correct — transporting the baseline lets the whole landscape share one definition of new debt.",
              B: "Baselines are portable, not locked to one system.",
              C: "Native SQL has nothing to do with baseline portability.",
              D: "Manual re-entry is unnecessary because baselines transport.",
            },
            principle:
              "Baselines transport, so a team can share one accepted-debt line across systems.",
          },
        ],
      },
    },
    {
      id: "m08-c4",
      code: "8.4",
      title: "The full Custom Code Migration loop",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §8.5",
        paragraphs: [
          "Custom Code Migration is not a one-shot scan; it is a loop, and running it in order is what keeps the effort proportionate to the value. It starts with scope by usage: enable SCMON on the productive system for a representative period so you know which custom objects are actually executed, and combine it with SUSG when you need a landscape-wide, multi-system roll-up. There is no point spending a sprint fixing a report nobody has run since 2014.",
          "With scope in hand you run the quality scan — ATC with the `S4HANA_READINESS_2023` variant, remotely from the central system against the source — and export the findings (to Excel, or via the results API into a spreadsheet or BI tool) so you can plan rather than firefight. Then you prioritise on three axes at once: is the object actually used, does it touch a standard object that the Simplification items are changing, and what is the cost to fix. High-usage, standard-impacting, low-cost items go first; unused or trivially isolated ones can wait or be retired.",
          "Adaptation means rewriting to released APIs wherever feasible; you grant an exemption only where the rewrite cost is genuinely unjustified this cycle (a legacy interface you will retire next year, say), so exemptions stay the rare exception, not the habit. Finally you re-baseline each sprint, which both records the debt you actually paid down and resets the 'new debt' line for the next iteration — turning migration into a steady, measurable cadence instead of a heroic push.",
        ],
        keyPoints: [
          "Scope by usage first: SCMON for what runs, plus SUSG for multi-system roll-up.",
          "Quality scan: ATC S4HANA_READINESS_2023 remotely against the source, then export findings.",
          "Prioritise on used? × standard-impacting? × cost — fix high-value items first.",
          "Adapt to released APIs; exempt only where the rewrite cost is unjustified this cycle.",
          "Re-baseline each sprint to record progress and reset the new-debt line.",
        ],
        examples: [
          {
            title: "The loop in one pass",
            variant: "neutral",
            body: "SCMON (+ SUSG) says 40% of custom reports are dead; the readiness scan flags 900 findings on the live 60%; you fix the used, standard-impacting, cheap ones, exempt two legacy interfaces, and re-baseline — then repeat next sprint.",
          },
        ],
        simplified: {
          oneLiner:
            "Migration is a loop: scope by usage (SCMON/SUSG), scan with the readiness variant, prioritise by used × standard-impacting × cost, rewrite to released APIs, and re-baseline each sprint.",
          analogy:
            "Like renovating a house room by room — first find which rooms you actually live in, inspect those, fix the worst-and-cheapest first, and re-survey after each phase.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Why does the Custom Code Migration loop start with SCMON (and SUSG for multi-system)?",
            options: {
              A: "To rebuild the HANA indexes before scanning.",
              B: "To install the CVA security licence.",
              C: "To scope by actual usage so effort goes to code that is really executed.",
              D: "To delete all custom code automatically.",
            },
            correct: "C",
            explanations: {
              A: "SCMON records usage; it does not touch indexes.",
              B: "Usage logging is unrelated to security licensing.",
              C: "Correct — scoping by usage avoids spending effort on dead code, with SUSG rolling usage up across systems.",
              D: "SCMON never deletes code; it only records what runs.",
            },
            principle:
              "Scope by real usage first so remediation effort is proportionate to value.",
          },
          {
            n: 2,
            question:
              "Which three axes drive prioritisation in the migration loop?",
            options: {
              A: "Author name, file size, and creation date.",
              B: "Used? × standard-impacting? × cost to fix.",
              C: "Transport number, client, and language.",
              D: "Screen count, table count, and comment count.",
            },
            correct: "B",
            explanations: {
              A: "Author and size do not reflect upgrade risk or value.",
              B: "Correct — whether it is used, whether it touches changing standard objects, and the fix cost decide order.",
              C: "Transport and client metadata are not the prioritisation axes.",
              D: "Raw object counts are not the decision criteria.",
            },
            principle:
              "Prioritise on usage, standard-impact, and cost together.",
          },
          {
            n: 3,
            question:
              "When is requesting an exemption the right move during adaptation?",
            options: {
              A: "Whenever a rewrite would take more than ten minutes.",
              B: "For every finding, to keep the pipeline green.",
              C: "Only where the rewrite cost is genuinely unjustified this cycle.",
              D: "Never — exemptions are forbidden.",
            },
            correct: "C",
            explanations: {
              A: "A ten-minute threshold trivialises exemptions; they are for genuinely unjustified rewrites.",
              B: "Blanket exemptions defeat the migration entirely.",
              C: "Correct — exempt only where rewriting is unjustified (e.g. a legacy interface due for retirement), keeping exemptions rare.",
              D: "Exemptions are allowed; they are simply the rare exception.",
            },
            principle:
              "Default to rewriting on released APIs; exempt only where the rewrite is unjustified.",
          },
        ],
      },
    },
    {
      id: "m08-c5",
      code: "8.5",
      title: "Simplification Items that bite",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §8.6",
        paragraphs: [
          "A Simplification Item is SAP's record of something that changed in S/4 — a table redesigned, a field removed, a process reworked — and a handful of them account for most of the pain a custom-code base feels in a conversion. The biggest are data-model changes. Pricing moved from the cluster-era `konv` to the transparent `prcd_elements`. Inventory's `mseg` is now augmented by the `matdoc` material-document table. The FI line-item world that used to live in `bseg` is subsumed by the universal journal `acdoca`. Output determination that ran on `nast` is replaced by the new Output Management framework.",
          "Code that reads these tables directly will frequently still compile and even run on 758 for backward compatibility, which is exactly why these items are dangerous: nothing screams, but the source of truth for current data and analytics has moved. Reading `bseg` for new reporting, for instance, can quietly miss postings that only exist in `acdoca`. So the readiness variant flags the direct dependency precisely so you treat it as a decision, not an accident.",
          "The clean remedy is the released interface views SAP ships over the new model — for the universal journal that means `I_OperationalAcctgDocItem` and its siblings in the `I_*` family, which are released (C1). Pointing a legacy `select` at the released interface view instead of the raw table gets you upgrade-safe, contract-backed access without rewriting all the surrounding logic at once. (SAP also ships old-name *compatibility views* that preserve the legacy table shape for a lift-and-shift; the durable target is the released interface view.)",
        ],
        keyPoints: [
          "Pricing konv → prcd_elements; inventory mseg augmented by matdoc.",
          "FI document bseg → the universal journal acdoca.",
          "Output management nast → the new Output Management framework.",
          "Direct reads often still work on 758 but miss the new source of truth — the danger is silence.",
          "Released interface views over the new model (the I_* family, e.g. I_OperationalAcctgDocItem) are released (C1) — read through them.",
        ],
        examples: [
          {
            title: "Bridging an FI read",
            variant: "before",
            lang: "ABAP",
            body: "A legacy report reads bseg directly — it compiles on 758 but is no longer the source of truth for the universal journal.",
            code: [
              "select * from bseg",
              "  into table @data(lt_items)",
              "  where bukrs = @lv_bukrs.",
            ].join("\n"),
          },
          {
            title: "Through the released interface view",
            variant: "after",
            lang: "ABAP",
            body: "Reading the released interface view (I_OperationalAcctgDocItem) over the universal journal is contract-backed and upgrade-safe.",
            code: [
              "select * from i_operationalacctgdocitem",
              "  into table @data(lt_items)",
              '" ... a released (c1) interface view over the acdoca universal journal',
              "  where companycode = @lv_bukrs.",
            ].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "A few data-model changes (konv→prcd_elements, mseg+matdoc, bseg→acdoca, nast→Output Management) bite hardest — bridge old reads with the released I_* interface views (e.g. I_OperationalAcctgDocItem).",
          analogy:
            "The old address still gets some mail, but the household has moved — forward your reads through the released interface view to reach the real, current data.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Which Simplification Item describes the FI document change in S/4?",
            options: {
              A: "bseg is subsumed by the universal journal acdoca.",
              B: "acdoca is replaced by bseg.",
              C: "bseg moves into nast.",
              D: "FI documents move to prcd_elements.",
            },
            correct: "A",
            explanations: {
              A: "Correct — the FI line-item world that lived in bseg is now part of the universal journal acdoca.",
              B: "The direction is reversed — acdoca is the new model, not the old one.",
              C: "nast is about output determination, not FI documents.",
              D: "prcd_elements is the pricing target, not FI documents.",
            },
            principle:
              "FI document data moved from bseg into the universal journal acdoca.",
          },
          {
            n: 2,
            question:
              "Where did pricing conditions move from konv?",
            options: {
              A: "To matdoc.",
              B: "To acdoca.",
              C: "To prcd_elements.",
              D: "To nast.",
            },
            correct: "C",
            explanations: {
              A: "matdoc is the inventory material-document table.",
              B: "acdoca is the FI universal journal.",
              C: "Correct — pricing moved from the cluster-era konv to the transparent prcd_elements.",
              D: "nast relates to output determination.",
            },
            principle:
              "Pricing conditions moved from konv to prcd_elements.",
          },
          {
            n: 3,
            question:
              "Why are direct reads of tables like bseg or konv dangerous after conversion even when they still compile?",
            options: {
              A: "They throw a syntax error every time.",
              B: "They silently miss the new source of truth while appearing to work.",
              C: "They automatically migrate to acdoca for you.",
              D: "They force the system into a security audit.",
            },
            correct: "B",
            explanations: {
              A: "They typically still compile and run, which is exactly the trap — no error appears.",
              B: "Correct — the read works yet the current data/analytics source has moved, so results can be quietly incomplete.",
              C: "There is no automatic migration of the read; you must point it at the new model.",
              D: "Direct reads do not trigger a security audit.",
            },
            principle:
              "The danger is silence — the read still works but no longer reflects the new source of truth.",
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
          "Which ATC variant enforces Restricted ABAP and released-only API consumption?",
        options: {
          A: "ABAP_CLOUD_DEVELOPMENT_DEFAULT.",
          B: "DEFAULT.",
          C: "PERFORMANCE_DB.",
          D: "SECURITY_CHECK.",
        },
        correct: "A",
        explanations: {
          A: "Correct — it is the Clean Core variant for Tier-2 cloud eligibility.",
          B: "DEFAULT is broad and not Clean Core aware.",
          C: "PERFORMANCE_DB is database performance.",
          D: "SECURITY_CHECK runs licence-gated CVA checks.",
        },
        principle:
          "The cloud variant is the Clean Core / Restricted ABAP source of truth.",
      },
      {
        n: 2,
        question:
          "In the production ATC topology, what lives on the central master system?",
        options: {
          A: "Every developer's local breakpoints.",
          B: "The Fiori launchpad tiles.",
          C: "The Simplification Database, baselines, and exemption workflow.",
          D: "The kernel source code.",
        },
        correct: "C",
        explanations: {
          A: "Breakpoints are local developer state, not central.",
          B: "Launchpad tiles are unrelated to ATC governance.",
          C: "Correct — the central ATC master holds the Simplification DB and owns baselines and exemptions, checking source systems over RFC.",
          D: "Kernel source is not what the ATC master hosts.",
        },
        principle:
          "Central ATC centralises the Simplification DB, baselines, and exemption governance.",
      },
      {
        n: 3,
        question:
          "An ATC baseline primarily lets a team…",
        options: {
          A: "delete custom code automatically.",
          B: "see only new debt while accepting today's findings as the starting point.",
          C: "skip running ATC entirely.",
          D: "install a security licence.",
        },
        correct: "B",
        explanations: {
          A: "Baselines never modify code.",
          B: "Correct — it snapshots current debt so future runs surface only deltas, and it can be transported across systems.",
          C: "A baseline filters results; it does not replace running ATC.",
          D: "Licensing is unrelated to baselines.",
        },
        principle:
          "A baseline freezes current debt so only new debt is reported.",
      },
      {
        n: 4,
        question:
          "Which sequence reflects the Custom Code Migration loop?",
        options: {
          A: "Exempt everything, then delete the rest.",
          B: "Rebuild the kernel, then re-run Fiori.",
          C: "Encrypt the code, then transport it.",
          D: "Scope by usage (SCMON/SUSG) → readiness scan → prioritise → adapt to released APIs → re-baseline each sprint.",
        },
        correct: "D",
        explanations: {
          A: "Blanket exemption and deletion is not the migration loop.",
          B: "Kernel and Fiori rebuilds are unrelated to the loop.",
          C: "Encryption is not part of custom-code migration.",
          D: "Correct — scope, scan, prioritise, adapt, and re-baseline is the repeatable cadence.",
        },
        principle:
          "Migration is a repeatable loop ending in a re-baseline each sprint.",
      },
      {
        n: 5,
        question:
          "How should custom code reach FI document data after the move from bseg to acdoca, without a full rewrite?",
        options: {
          A: "Through the released interface views (I_*) that map old reads onto the new model.",
          B: "By calling CALL TRANSACTION on the FI dialog.",
          C: "By reading nast directly.",
          D: "By writing native EXEC SQL against acdoca.",
        },
        correct: "A",
        explanations: {
          A: "Correct — the released (C1) interface views map the old shape onto acdoca, giving upgrade-safe access.",
          B: "CALL TRANSACTION is forbidden in cloud code and is not a data-access strategy.",
          C: "nast is output determination, not FI document data.",
          D: "Native SQL bypasses the model and is a Clean Core violation.",
        },
        principle:
          "Released interface views (I_*) are the sanctioned bridge from old reads to the new model.",
      },
    ],
  },
};
