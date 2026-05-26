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
      label: "Place any object in the right extensibility tier (key-user / developer / side-by-side)",
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
    "What Clean Core actually means, the 3-tier extensibility model, Restricted ABAP, the C0–C3 release contracts, and the software-component boundary. The mental model the rest of the academy builds on.",
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
          "SAP frames Clean Core across five dimensions: software (extend only through released APIs, public SDKs, or side-by-side on BTP), business processes (stay standard end-to-end where you can), master data (quality and ownership), integrations (released, versioned interfaces — no point-to-point dark RFCs), and operations (observable, automatable, no manual config drift).",
          "The payoff is upgrade stability and lower total cost of change. A clean core is one where an FPS or release upgrade is a routine event, not a multi-month regression project.",
        ],
        keyPoints: [
          "Clean Core is a placement-and-method contract, not a ban on Z code.",
          "Five dimensions: software, business processes, master data, integrations, operations.",
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
            "The five dimensions matter because 'clean' code that still drives a heavily-modified process, or integrates through an undocumented RFC, is not upgrade-safe. Clean Core is an end-to-end property of the solution, not just the ABAP.",
          ],
          keyPoints: [
            "A clean ABAP layer over a modified process is still not Clean Core.",
            "Each dimension has its own tooling: ATC for software, process discovery for business processes, the integration assessment for interfaces.",
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
            question: "Which is NOT one of SAP's five Clean Core dimensions?",
            options: {
              A: "Software",
              B: "Integrations",
              C: "Hardware",
              D: "Operations",
            },
            correct: "C",
            explanations: {
              A: "Software is dimension one.",
              B: "Integrations is one of the five.",
              C: "Correct — the five are software, business processes, master data, integrations, operations. Hardware is not one.",
              D: "Operations is one of the five.",
            },
            principle:
              "The five dimensions: software, business processes, master data, integrations, operations.",
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
      title: "The 3-tier extensibility model",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §1.2",
        paragraphs: [
          "SAP offers three tiers of extensibility. Tier 1 — key-user (in-app) extensibility — is Fiori-based: custom fields, custom CDS, and custom logic through BAdIs released to key users. It is the lowest-risk option and needs no classic development.",
          "Tier 2 — developer extensibility (in-stack) — is ABAP for Cloud Development inside the S/4 stack, in a software component marked for cloud development. This is the sweet spot for Clean-Core-compliant on-stack code.",
          "Tier 3 — side-by-side — runs on BTP (ABAP environment, Java, Node, Python) connected through released OData/RAP/events. It keeps the core cleanest but carries the highest total cost of ownership.",
        ],
        keyPoints: [
          "Tier 1 key-user: in-app, Fiori-based, no classic dev — lowest risk.",
          "Tier 2 developer extensibility: ABAP Cloud inside the stack — the on-stack sweet spot.",
          "Tier 3 side-by-side: BTP, connected via released interfaces — cleanest core, highest TCO.",
          "Pick the lowest tier that meets the requirement; escalate only when you must.",
        ],
        examples: [
          {
            title: "Choosing a tier",
            variant: "neutral",
            body: "Add a field to a Fiori app → Tier 1. Build a transactional app over a Z table → Tier 2. Build a heavy custom microservice with its own lifecycle → Tier 3.",
          },
        ],
        simplified: {
          oneLiner:
            "Three tiers — key-user in-app (Tier 1), developer ABAP Cloud in-stack (Tier 2), and side-by-side on BTP (Tier 3); use the lowest one that fits.",
          analogy:
            "Tier 1 is rearranging furniture, Tier 2 is a permitted renovation, Tier 3 is building a separate annex.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Where does Tier 2 'developer extensibility' run?",
            options: {
              A: "On BTP, connected to S/4 over OData.",
              B: "In ABAP for Cloud Development inside the S/4 stack.",
              C: "Only in the SAP GUI.",
              D: "In a separate Java microservice.",
            },
            correct: "B",
            explanations: {
              A: "That describes Tier 3 side-by-side.",
              B: "Correct — Tier 2 is in-stack ABAP Cloud in a cloud-enabled software component.",
              C: "SAP GUI is classic development, not the Tier 2 model.",
              D: "A Java microservice is a Tier 3 side-by-side option.",
            },
            principle:
              "Tier 2 = ABAP for Cloud Development, on-stack — the Clean-Core sweet spot.",
          },
          {
            n: 2,
            question:
              "A key user wants to add a custom field to a standard Fiori app. Which tier is this?",
            options: {
              A: "Tier 1 — key-user (in-app) extensibility.",
              B: "Tier 2 — developer extensibility.",
              C: "Tier 3 — side-by-side.",
              D: "None — it requires a modification.",
            },
            correct: "A",
            explanations: {
              A: "Correct — custom fields via the in-app tools are Tier 1 key-user extensibility.",
              B: "Tier 2 is for classic-style ABAP development objects.",
              C: "Side-by-side is overkill for a custom field.",
              D: "No modification is needed — the in-app tools are designed for this.",
            },
            principle: "Reach for the lowest tier that satisfies the requirement.",
          },
          {
            n: 3,
            question:
              "Which tier keeps the core cleanest but typically costs the most to own?",
            options: {
              A: "Tier 1 key-user.",
              B: "Tier 2 developer extensibility.",
              C: "Tier 3 side-by-side on BTP.",
              D: "Classic modifications.",
            },
            correct: "C",
            explanations: {
              A: "Tier 1 is the lowest risk and low cost, but limited in scope.",
              B: "Tier 2 is in-stack and moderate cost.",
              C: "Correct — side-by-side fully decouples from the core but you own a whole separate runtime.",
              D: "Modifications are not a Clean Core option at all.",
            },
            principle:
              "Side-by-side maximises core cleanliness at the cost of a separate lifecycle to operate.",
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
          "A common architecture uses one Tier-2 software component for the cloud-clean code and a separate classical component for unavoidable Tier-3 leftovers (for example classic print-workbench forms), with a hard, released interface class between them.",
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
          "Which extensibility tier is the on-stack 'sweet spot' for Clean-Core-compliant development?",
        options: {
          A: "Tier 1 key-user.",
          B: "Tier 3 side-by-side.",
          C: "Tier 2 developer extensibility (ABAP Cloud, in-stack).",
          D: "Classic modifications.",
        },
        correct: "C",
        explanations: {
          A: "Tier 1 is powerful but limited to in-app changes.",
          B: "Tier 3 is cleanest but highest TCO.",
          C: "Correct — Tier 2 ABAP Cloud in-stack is the sweet spot.",
          D: "Modifications are not a Clean Core option.",
        },
        principle: "Tier 2 ABAP Cloud is the on-stack Clean Core target.",
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
