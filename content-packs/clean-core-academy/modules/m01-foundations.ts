/* ------------------------------------------------------------------
   Module 1 — Clean Core Foundations.

   Source brief: §1 of the Clean Core & HANA Readiness curriculum.
   Audience: foundational — every developer tier plus management.
   This module is the canonical authoring template for the pack:
   every concept ships paragraphs + keyPoints + simplified.oneLiner
   (so flashcards derive) + a 3-question quiz with per-option
   explanations. Code-bearing concepts add before/after examples.
------------------------------------------------------------------ */

import type { Section } from "../_types";

export const m01Foundations: Section = {
  id: "m01-foundations",
  n: 1,
  title: "Clean Core Foundations",
  sourceCourse: "clean-core-curriculum §1",
  audiences: ["new", "intermediate", "expert", "admin", "management"],
  skills: [
    {
      id: "m01-s1",
      label: "Explain Clean Core as a contract about where extensions sit, not 'no Z code'",
      conceptId: "m01-c1",
    },
    {
      id: "m01-s2",
      label: "Place any object in the right extensibility approach (key-user / developer / side-by-side) and grade its cleanliness (Levels A–D)",
      conceptId: "m01-c2",
    },
    {
      id: "m01-s3",
      label: "Name what Restricted ABAP forbids and why it protects upgrades",
      conceptId: "m01-c3",
    },
    {
      id: "m01-s4",
      label: "Read an object's API State and classify it C0/C1/C2/C3",
      conceptId: "m01-c4",
    },
    {
      id: "m01-s5",
      label: "Reason about the software-component boundary and released interfaces",
      conceptId: "m01-c5",
    },
  ],
  blurb:
    "The shared vocabulary the whole course rests on: what Clean Core (keeping SAP's standard untouched and building beside it, so upgrades stay easy) actually means and why it lowers upgrade cost and risk. Covers the extensibility approaches (key-user / developer / side-by-side) and the Aug-2025 clean-core compliance levels A–D, Restricted ABAP, the C0–C3 release contracts, and the software-component boundary — the mental model the rest of the academy builds on.",
  concepts: [
    {
      id: "m01-c1",
      code: "1.1",
      title: "What Clean Core actually means",
      bloom: "U",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §1.1",
        paragraphs: [
          "Clean Core is not 'no custom code.' It is a contract about *where* and *how* extensions sit relative to SAP-delivered objects, so that SAP can ship upgrades and feature-pack deltas without colliding with your code, and you can adopt innovation without a custom-code thaw cycle. It is also not a verdict on the code you have already written — the instincts that make you good at ABAP, knowing where logic belongs and what depends on what, are exactly what it rewards.",
          "SAP frames Clean Core across six dimensions: software stack (keep the SAP stack current and unmodified — no modifications or implicit enhancements), extensibility (build custom logic only on released extension points and released APIs, decoupled from the core), integrations (released, versioned, documented interfaces and events — no point-to-point dark RFCs), processes (stay standard end-to-end where you can, using SAP-provided process variability rather than process modification), data (configuration, master, and transactional data with quality, ownership, and governance — 'data,' not just master data), and operations (observable, automatable, no manual config drift). SAP's customer-facing 'five guiding principles of clean core' (Dec 2025) restate the same idea minus software stack — processes, extensibility, data, integration, operations — treating a current, unmodified stack as the baseline precondition rather than a principle you practice.",
          "The payoff is upgrade stability and lower total cost of change. A clean core is one where an FPS or release upgrade is a routine event, not a multi-month regression project.",
        ],
        keyPoints: [
          "Clean Core is a placement-and-method contract, not a ban on Z code.",
          "Six dimensions: software stack, extensibility, integrations, processes, data, operations (the Dec-2025 'five guiding principles' drop software stack).",
          "The goal is upgrade-stability: SAP changes the core, your extensions keep working.",
          "Extensions sit beside the core through released contracts — never inside it.",
        ],
        examples: [
          {
            title: "Two ways to add a discount rule",
            variant: "neutral",
            body: "The 'dirty' way modifies or reads SAP internals; the Clean Core way sits beside the core on a released contract — same feature, very different upgrade risk.",
          },
        ],
        simplified: {
          oneLiner:
            "Clean Core means your extensions sit beside SAP standard on stable, released contracts — so upgrades don't break them.",
          analogy:
            "Build an extension on the official power outlet, not by splicing into the wiring inside the wall.",
        },
        deeper: {
          paragraphs: [
            "The six dimensions matter because 'clean' code that still drives a heavily-modified process, or integrates through an undocumented RFC, is not upgrade-safe. Clean Core is an end-to-end property of the solution, not just the ABAP.",
          ],
          keyPoints: [
            "A clean ABAP layer over a modified process is still not Clean Core.",
            "Each dimension has its own tooling: ATC for the software stack and extensibility, process discovery for processes, the integration assessment for interfaces.",
          ],
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question: "Which statement best captures what Clean Core is?",
            options: {
              A: "A rule that forbids all custom (Z) code.",
              B: "A contract about where and how extensions sit relative to SAP standard, so upgrades don't collide.",
              C: "A performance-tuning methodology for HANA.",
              D: "A UI framework that replaces SAP GUI.",
            },
            correct: "B",
            explanations: {
              A: "Clean Core allows custom code — it governs where and how it sits.",
              B: "Correct — it is a placement-and-method contract that keeps the core upgradeable.",
              C: "Performance matters, but it is not the definition of Clean Core.",
              D: "Fiori is part of the story, but Clean Core is broader than UI.",
            },
            principle:
              "Clean Core governs the relationship between extensions and the core, not the existence of extensions.",
          },
          {
            n: 2,
            question: "Which is NOT one of SAP's six Clean Core dimensions?",
            options: {
              A: "Extensibility",
              B: "Integrations",
              C: "Hardware",
              D: "Operations",
            },
            correct: "C",
            explanations: {
              A: "Extensibility is one of the six — build only on released extension points and APIs.",
              B: "Integrations is one of the six.",
              C: "Correct — the six are software stack, extensibility, integrations, processes, data, operations. Hardware is not one.",
              D: "Operations is one of the six.",
            },
            principle:
              "The six dimensions: software stack, extensibility, integrations, processes, data, operations.",
          },
          {
            n: 3,
            question: "What is the primary business payoff of a clean core?",
            options: {
              A: "Upgrades and feature packs become routine instead of multi-month regression projects.",
              B: "The database needs less disk.",
              C: "Developers can stop writing tests.",
              D: "SAP licences become free.",
            },
            correct: "A",
            explanations: {
              A: "Correct — staying on released contracts means SAP can change the core without breaking you.",
              B: "Disk is unrelated to Clean Core.",
              C: "Clean Core relies on more testing, not less.",
              D: "Licensing is unaffected.",
            },
            principle: "Clean Core buys upgrade stability and lower cost of change.",
          },
        ],
      },
    },
    {
      id: "m01-c2",
      code: "1.2",
      title: "Extensibility approaches and clean-core levels (A–D)",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §1.2",
        paragraphs: [
          "SAP describes extensibility as three approaches (types, not numbered tiers), split on two axes: where the code runs (on-stack inside S/4HANA vs side-by-side on SAP BTP) and, for on-stack, which toolset. Key User Extensibility is the low-code, in-app on-stack option — custom fields, custom CDS, and custom logic at released enhancement points, no classic development. Developer Extensibility is pro-code on-stack ABAP Cloud (Embedded Steampunk) in a cloud-enabled software component. Side-by-Side Extensibility runs decoupled on SAP BTP (ABAP environment, Java, Node, Python) over released OData/RAP/events. Pick the lowest-effort approach that meets the requirement; side-by-side is a cleanest-core option (used when you need a separate lifecycle or runtime), not a 'worst' last resort.",
          "Cleanliness is graded separately, on the Aug-2025 clean-core compliance scale of four levels. Level A ('Extend with SAP Build') uses only publicly released, stable interfaces backed by stability contracts — covering both on-stack ABAP Cloud and side-by-side BTP — and is the gold standard. Level B ('Leverage classic APIs') meets Level A's criteria but also uses SAP's released, documented classic APIs (BAPIs etc.); upgrade-stable and still clean. Level C ('Accesses internal objects') is partially compliant — it reaches SAP internal objects not released for customer use (a grey zone for legacy scenarios). Level D ('Not recommended extensions') is not clean: non-recommended objects, modifications, write access to SAP tables, and implicit enhancements — the highest risk and technical debt.",
          "For context: SAP's earlier '3-tier extensibility model' (TechEd 2024, for S/4HANA Cloud Private Edition and on-premise) named Tier 1 = ABAP Cloud (both key-user and developer extensibility), Tier 2 = Cloud API enablement (released classic APIs/wrappers for objects not yet released for Tier 1), and Tier 3 = classic ABAP. Side-by-side on BTP was a separate, clean column at the Tier-1 level — never Tier 3. SAP evolved that binary model into the A–D levels in August 2025; the 3-tier model lives on mainly as the ABAP_CLOUD_DEVELOPMENT_3TIER ATC variant for Private-Edition custom-code migration.",
        ],
        keyPoints: [
          "Three approaches (not tiers): Key User (in-app low-code, on-stack), Developer (pro-code on-stack ABAP Cloud / Embedded Steampunk), Side-by-side (decoupled on BTP).",
          "Side-by-side is a cleanest-core option for a separate lifecycle/runtime — not the 'worst' last resort.",
          "Clean-core levels (Aug 2025): A = released/stable APIs (on-stack or BTP), B = released classic APIs too, C = accesses SAP internal objects, D = modifications/table writes/implicit enhancements (not clean).",
          "Pick the lowest-effort approach that meets the requirement; aim for Level A.",
          "Legacy context: the old 3-tier model (Tier 1 ABAP Cloud, Tier 2 Cloud API enablement, Tier 3 classic ABAP) was evolved into Levels A–D in Aug 2025.",
        ],
        examples: [
          {
            title: "Choosing an approach",
            variant: "neutral",
            body: "Add a field to a Fiori app → Key User extensibility. Build a transactional app over a Z table → Developer extensibility (on-stack ABAP Cloud). Build a heavy custom service with its own lifecycle → Side-by-side on BTP. All three can be Level A when they stay on released, stable APIs; writing to an SAP table or modifying standard is Level D.",
          },
        ],
        simplified: {
          oneLiner:
            "Three extensibility approaches — Key User (in-app), Developer (on-stack ABAP Cloud), Side-by-side (BTP) — and a separate cleanliness scale, Levels A (released/stable) to D (modifications/table writes); use the lowest-effort approach and aim for Level A.",
          analogy:
            "Key User is rearranging the furniture, Developer is a permitted renovation, Side-by-side is a separate annex with its own utilities — and Levels A–D grade how cleanly any of them was built.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Where does Developer Extensibility run?",
            options: {
              A: "On BTP, connected to S/4 over OData.",
              B: "In ABAP for Cloud Development on-stack inside the S/4 stack.",
              C: "Only in the SAP GUI.",
              D: "In a separate Java microservice.",
            },
            correct: "B",
            explanations: {
              A: "That describes the side-by-side approach.",
              B: "Correct — Developer Extensibility is on-stack ABAP Cloud (Embedded Steampunk) in a cloud-enabled software component.",
              C: "SAP GUI is classic development, not the developer-extensibility approach.",
              D: "A Java microservice is a side-by-side (BTP) option.",
            },
            principle:
              "Developer Extensibility = on-stack ABAP Cloud; side-by-side runs on BTP.",
          },
          {
            n: 2,
            question:
              "A key user wants to add a custom field to a standard Fiori app. Which approach is this?",
            options: {
              A: "Key User (in-app) extensibility.",
              B: "Developer extensibility (on-stack ABAP Cloud).",
              C: "Side-by-side on BTP.",
              D: "None — it requires a modification.",
            },
            correct: "A",
            explanations: {
              A: "Correct — custom fields via the in-app tools are Key User extensibility.",
              B: "Developer extensibility is for pro-code on-stack ABAP development objects.",
              C: "Side-by-side is overkill for a custom field.",
              D: "No modification is needed — the in-app tools are designed for this.",
            },
            principle: "Reach for the lowest-effort approach that satisfies the requirement.",
          },
          {
            n: 3,
            question:
              "On the Aug-2025 clean-core compliance scale, which level is the gold standard?",
            options: {
              A: "Level A — uses only publicly released, stable APIs (on-stack ABAP Cloud or side-by-side BTP).",
              B: "Level B — also uses released classic APIs (BAPIs).",
              C: "Level C — accesses SAP internal objects not released for customer use.",
              D: "Level D — modifications, table writes, implicit enhancements.",
            },
            correct: "A",
            explanations: {
              A: "Correct — Level A uses only released, stable interfaces backed by stability contracts; it is the cleanest, whether on-stack or side-by-side.",
              B: "Level B is upgrade-stable and still clean, but adds released classic APIs on top of Level A.",
              C: "Level C is only partially compliant — a grey zone for legacy scenarios.",
              D: "Level D is not clean: modifications, SAP-table writes, and implicit enhancements.",
            },
            principle:
              "Level A (released/stable APIs only) is the clean-core gold standard; side-by-side is Level A, not a penalty.",
          },
        ],
      },
    },
    {
      id: "m01-c3",
      code: "1.3",
      title: "Restricted ABAP — what changes",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §1.3",
        paragraphs: [
          "Setting a package's ABAP language version to 'ABAP for Cloud Development' switches it into Restricted ABAP. From then on the compiler enforces Clean Core: only released (C1) objects can be consumed, and a long list of classic statements becomes a syntax error.",
          "Forbidden constructs include WRITE-to-list and list processing, CALL TRANSACTION / SUBMIT / LEAVE TO TRANSACTION, classic Dynpro / CALL SCREEN / module pools, CALL FUNCTION ... DESTINATION for direct DB, EXEC SQL / native SQL, macros, and IMPORT/EXPORT FROM MEMORY or SHARED BUFFER. BAdI consumption is limited to released enhancement spots.",
          "The win is that violations fail at compile time, not just in ATC. The package property has four values — Standard ABAP (unrestricted default), ABAP for Key Users, ABAP for Cloud Development, and the legacy 'ABAP for SAP Cloud Platform' — progressively more locked down.",
        ],
        keyPoints: [
          "Restricted ABAP is set per package via the ABAP language version.",
          "Only released (C1) objects compile; classic statements (WRITE, CALL TRANSACTION, EXEC SQL, macros) are syntax errors.",
          "Compile-time enforcement is stronger than an ATC finding you can ignore.",
          "ATC variant ABAP_CLOUD_DEVELOPMENT_DEFAULT is the practical source of truth for what's allowed.",
        ],
        examples: [
          {
            title: "A classic report header",
            variant: "before",
            lang: "ABAP",
            body: "Perfectly valid Standard ABAP — and a syntax error in a Cloud Development package.",
            code: ["write: / 'Hello'.", "call transaction 'VA01'."].join("\n"),
          },
          {
            title: "The Cloud-clean equivalent",
            variant: "after",
            lang: "ABAP",
            body: "Output goes through a released channel (here, application logging); UI/transaction launches move to Fiori + released APIs.",
            code: [
              'data(log) = cl_bali_log=>create( ).',
              '" ... add released messages, persist via the released log API',
            ].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "Set a package to 'ABAP for Cloud Development' and the compiler itself blocks non-Clean-Core code — only released APIs compile.",
          analogy:
            "It's a spell-checker that refuses to save the document until the forbidden words are gone.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "In an ABAP-for-Cloud-Development package, what happens to `CALL TRANSACTION 'VA01'`?",
            options: {
              A: "It runs but logs a warning.",
              B: "It is a syntax error — the statement is forbidden.",
              C: "It works only in the background.",
              D: "It is automatically rewritten to a BAPI.",
            },
            correct: "B",
            explanations: {
              A: "Restricted ABAP rejects it outright, not with a warning.",
              B: "Correct — CALL TRANSACTION is on the forbidden list and fails to compile.",
              C: "It is forbidden in all modes, not just dialog.",
              D: "There is no automatic rewrite.",
            },
            principle:
              "Restricted ABAP turns Clean Core violations into compile errors.",
          },
          {
            n: 2,
            question:
              "What is the main advantage of pinning a package to Restricted ABAP versus relying on ATC alone?",
            options: {
              A: "It makes the code run faster.",
              B: "Violations fail at compile time instead of being an ATC finding you might ignore.",
              C: "It removes the need for unit tests.",
              D: "It enables SELECT *.",
            },
            correct: "B",
            explanations: {
              A: "Performance is unaffected by the language version.",
              B: "Correct — compile-time enforcement is the strongest contract.",
              C: "Tests are still required.",
              D: "SELECT * remains discouraged regardless.",
            },
            principle: "Compile-time enforcement beats an ignorable warning.",
          },
          {
            n: 3,
            question:
              "Which of these is allowed in a Cloud Development package?",
            options: {
              A: "EXEC SQL native SQL.",
              B: "A macro defined with DEFINE.",
              C: "Consuming a released (C1) class.",
              D: "IMPORT FROM MEMORY.",
            },
            correct: "C",
            explanations: {
              A: "Native SQL is forbidden.",
              B: "Macros are forbidden.",
              C: "Correct — consuming released C1 APIs is exactly what Restricted ABAP permits.",
              D: "Shared/ABAP memory transfer is forbidden.",
            },
            principle: "Restricted ABAP permits released APIs and forbids classic escapes.",
          },
        ],
      },
    },
    {
      id: "m01-c4",
      code: "1.4",
      title: "Release contracts: C0 / C1 / C2 / C3",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §1.4",
        paragraphs: [
          "Every SAP object carries a Release Contract (its API State), visible in ADT object properties. C0 means not released — internal, touch at your own risk. C1 means released for Cloud Development: stable across upgrades within the contract, safe to consume from ABAP Cloud.",
          "C2 means 'use system-internal' — sometimes documented, but not stable across upgrades, and not for custom Clean Core code. C3 means deprecated, and ATC reports its use; the long text usually names the successor in a 'Replaced By' field.",
          "API State shows on classes, interfaces, function modules, CDS views, BAdI definitions, and DDIC types. Browse released objects under the system node in ADT, or the catalog at api.sap.com. A subtle trap: a released FM that returns a C2-typed structure surfaces that type into your code — and your reference to it is itself a violation that ATC catches under the cloud variant.",
        ],
        keyPoints: [
          "C0 not released · C1 released (cloud-safe) · C2 use-system-internal (unstable) · C3 deprecated.",
          "Only C1 is safe to consume from a Clean Core package.",
          "API State is visible per object in ADT and browsable at api.sap.com.",
          "A C1 API can still leak a C2 type — consuming that type is a violation ATC flags.",
        ],
        examples: [
          {
            title: "Reading the API State",
            variant: "neutral",
            body: "In ADT, open the object → Properties → API State. 'Released' (C1) is the green light; 'Use System-Internal' (C2) and 'Deprecated' (C3) are not.",
          },
        ],
        simplified: {
          oneLiner:
            "C1 = released and upgrade-stable (safe to use); C0/C2/C3 = internal, unstable, or deprecated (don't build on them).",
          analogy:
            "C1 is a published, supported API; C2 is an undocumented internal function you found by reading the source.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Which release contract is safe to consume from an ABAP Cloud package?",
            options: {
              A: "C0 — not released.",
              B: "C1 — released for Cloud Development.",
              C: "C2 — use system-internal.",
              D: "C3 — deprecated.",
            },
            correct: "B",
            explanations: {
              A: "C0 is internal and unstable.",
              B: "Correct — C1 is released and stable within the contract.",
              C: "C2 is not stable across upgrades.",
              D: "C3 is deprecated and reported by ATC.",
            },
            principle: "Only C1 is the cloud-safe contract.",
          },
          {
            n: 2,
            question:
              "A released (C1) function module returns a structure typed against a C2 DDIC type that you reference. What does ATC say?",
            options: {
              A: "Nothing — the FM is C1, so everything it touches is fine.",
              B: "It flags your reference to the C2 type as a violation.",
              C: "It downgrades the FM to C2.",
              D: "It deletes the structure.",
            },
            correct: "B",
            explanations: {
              A: "C1 on the FM does not make its parameter types C1.",
              B: "Correct — your reference to the C2 type is itself a Clean Core violation under the cloud variant.",
              C: "ATC reports; it does not change contracts.",
              D: "ATC never modifies objects.",
            },
            principle:
              "A released API can still surface unreleased types — check what you actually reference.",
          },
          {
            n: 3,
            question: "Where do you read an object's release contract?",
            options: {
              A: "In transaction SM37.",
              B: "In the ADT object Properties → API State (and at api.sap.com).",
              C: "Only by emailing SAP support.",
              D: "In the database table DD02L only.",
            },
            correct: "B",
            explanations: {
              A: "SM37 is job monitoring.",
              B: "Correct — API State is in ADT properties and the api.sap.com catalog.",
              C: "It's self-service in the tooling.",
              D: "DD02L holds table metadata, not the API State surface developers use.",
            },
            principle: "API State is a first-class, visible property in ADT.",
          },
        ],
      },
    },
    {
      id: "m01-c5",
      code: "1.5",
      title: "The software-component boundary",
      bloom: "U",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §1.5",
        paragraphs: [
          "Custom code lives in a software component (for example a customer-defined one, or HOMEAPP). Two attributes matter: the layer/stack (HOME means it stays on this system; LOCAL packages are not transportable) and the API restriction. When the component is set to 'ABAP for Cloud Development,' the entire component is restricted — you cannot mix restricted and unrestricted code inside one component.",
          "A common architecture uses one software component for the cloud-clean ABAP Cloud code and a separate classical component for unavoidable classic-ABAP leftovers (for example classic print-workbench forms), with a hard, released interface class between them.",
          "Cross-component access is gated by the consumer's release contract: if your component is restricted, it can only reach the other component through released objects. The boundary is therefore the place where you decide and document what is exposed.",
        ],
        keyPoints: [
          "The API restriction applies to the whole software component — no mixing.",
          "Isolate unavoidable classic code in its own component behind a released interface.",
          "Cross-component calls obey the consumer's release contract.",
          "The component boundary is where you declare and document what's exposed.",
        ],
        examples: [
          {
            title: "Two-component split",
            variant: "neutral",
            body: "ZCLEAN (ABAP Cloud) holds the new code; ZCLASSIC holds the legacy form logic; a released interface class is the only door between them.",
          },
        ],
        simplified: {
          oneLiner:
            "The 'ABAP for Cloud Development' restriction is set per software component and applies to all of it — isolate legacy code in its own component behind a released interface.",
          analogy:
            "A clean room and a workshop are separate rooms with one controlled doorway — not one room with a line painted on the floor.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Can you mix restricted (ABAP Cloud) and unrestricted code inside one software component?",
            options: {
              A: "Yes, file by file.",
              B: "No — the API restriction applies to the whole component.",
              C: "Only if both are in the same package.",
              D: "Only on BTP.",
            },
            correct: "B",
            explanations: {
              A: "The restriction is component-wide, not per file.",
              B: "Correct — you split into separate components instead.",
              C: "Packages don't override the component-level restriction.",
              D: "It's a component property regardless of platform.",
            },
            principle:
              "The cloud restriction is a whole-component setting.",
          },
          {
            n: 2,
            question:
              "How should a restricted component reach unavoidable classic logic in another component?",
            options: {
              A: "Through a released interface class — the only door.",
              B: "By calling its private methods directly.",
              C: "By copying the classic code in.",
              D: "It cannot integrate with it at all.",
            },
            correct: "A",
            explanations: {
              A: "Correct — a released interface is the controlled, upgrade-safe boundary.",
              B: "Restricted code can only consume released objects.",
              C: "Copying classic code into a restricted component won't compile.",
              D: "It can integrate — through released contracts.",
            },
            principle: "Expose legacy through a released interface, not raw internals.",
          },
          {
            n: 3,
            question: "What does the HOME layer on a software component signify?",
            options: {
              A: "The code is encrypted.",
              B: "The code stays on this system (and LOCAL packages within are not transportable).",
              C: "The code runs only at night.",
              D: "The code is owned by SAP.",
            },
            correct: "B",
            explanations: {
              A: "Layer has nothing to do with encryption.",
              B: "Correct — HOME means it stays on this system; LOCAL packages are non-transportable.",
              C: "Layer is unrelated to scheduling.",
              D: "HOME components are customer-owned.",
            },
            principle: "The layer/stack attribute governs transportability and ownership.",
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
        question: "Clean Core is best described as…",
        options: {
          A: "a contract about where and how extensions sit relative to SAP standard.",
          B: "a ban on all custom code.",
          C: "a HANA indexing strategy.",
          D: "a replacement for ATC.",
        },
        correct: "A",
        explanations: {
          A: "Correct — Clean Core governs the extension/core relationship.",
          B: "Custom code is allowed; placement is governed.",
          C: "Indexing is unrelated.",
          D: "ATC is a tool that supports Clean Core, not a synonym.",
        },
        principle: "Clean Core governs the extension/core relationship.",
      },
      {
        n: 2,
        question:
          "Which extensibility approach is on-stack pro-code (ABAP Cloud / Embedded Steampunk) for Clean-Core-compliant development?",
        options: {
          A: "Key User extensibility.",
          B: "Side-by-side on BTP.",
          C: "Developer extensibility (ABAP Cloud, on-stack).",
          D: "Classic modifications.",
        },
        correct: "C",
        explanations: {
          A: "Key User extensibility is in-app low-code, not pro-code.",
          B: "Side-by-side runs decoupled on BTP, not on-stack.",
          C: "Correct — Developer extensibility is on-stack ABAP Cloud (Embedded Steampunk).",
          D: "Modifications are not a Clean Core option (Level D).",
        },
        principle: "Developer extensibility is the on-stack pro-code ABAP Cloud approach; side-by-side and on-stack can both be Level A clean.",
      },
      {
        n: 3,
        question: "Which API State is safe to consume from a restricted package?",
        options: {
          A: "C1 — released.",
          B: "C2 — use system-internal.",
          C: "C0 — not released.",
          D: "C3 — deprecated.",
        },
        correct: "A",
        explanations: {
          A: "Correct — C1 is the cloud-safe contract.",
          B: "C2 is unstable across upgrades.",
          C: "C0 is internal.",
          D: "C3 is deprecated.",
        },
        principle: "Only C1 is upgrade-stable for consumers.",
      },
      {
        n: 4,
        question:
          "The 'ABAP for Cloud Development' restriction applies at which scope?",
        options: {
          A: "Per line of code.",
          B: "Per whole software component.",
          C: "Per user.",
          D: "Per transport request.",
        },
        correct: "B",
        explanations: {
          A: "It is not per line.",
          B: "Correct — it is a component-wide property.",
          C: "It is not tied to a user.",
          D: "It is not tied to a transport.",
        },
        principle: "The cloud restriction is component-wide.",
      },
      {
        n: 5,
        question:
          "Why pin a new package to Restricted ABAP rather than rely only on ATC?",
        options: {
          A: "It speeds up the database.",
          B: "It disables version control.",
          C: "It allows native SQL.",
          D: "Violations then fail at compile time instead of being an ignorable finding.",
        },
        correct: "D",
        explanations: {
          A: "No performance effect.",
          B: "Version control is unaffected.",
          C: "Native SQL stays forbidden.",
          D: "Correct — compile-time is the strongest enforcement.",
        },
        principle: "Compile-time enforcement is stronger than a warning.",
      },
    ],
  },
};
