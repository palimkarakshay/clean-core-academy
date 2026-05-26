/* ------------------------------------------------------------------
   Module B3 — Clean Core Orientation for Stakeholders.

   Source brief: §1 (Foundations), §8 (readiness reporting / governance)
   of the Clean Core & HANA Readiness curriculum, synthesised as a
   plain-language orientation for any stakeholder — sponsors, managers,
   business users — who needs to follow Clean Core conversations without
   a technical background. No ABAP. Defines the idea, the five
   dimensions, why upgrades get easier, the shared vocabulary, and how
   to read a readiness report. Every concept ships paragraphs +
   keyPoints + simplified.oneLiner and a 3-question conceptual quiz.
------------------------------------------------------------------ */

import type { Section } from "../_types";

export const b03Orientation: Section = {
  id: "b03-orientation",
  n: 17,
  title: "Clean Core Orientation for Stakeholders",
  sourceCourse: "clean-core-curriculum (orientation synthesis)",
  audiences: ["stakeholder", "management", "end-user"],
  skills: [
    {
      id: "b03-s1",
      label: "Define Clean Core in one plain-language sentence",
      conceptId: "b03-c1",
    },
    {
      id: "b03-s2",
      label: "Name the five Clean Core dimensions and why they span the whole solution",
      conceptId: "b03-c2",
    },
    {
      id: "b03-s3",
      label: "Explain in plain terms why upgrades get easier under Clean Core",
      conceptId: "b03-c3",
    },
    {
      id: "b03-s4",
      label: "Recognise the common Clean Core vocabulary in a conversation",
      conceptId: "b03-c4",
    },
    {
      id: "b03-s5",
      label: "Read a readiness report and focus on the trend, not the headline number",
      conceptId: "b03-c5",
    },
  ],
  blurb:
    "A plain-language orientation to Clean Core for anyone who needs to follow the conversation: what it is, the five dimensions it spans, why it makes upgrades easier, the vocabulary everyone keeps using, and how to read a readiness report without a technical background.",
  concepts: [
    {
      id: "b03-c1",
      code: "O.1",
      title: "What is Clean Core? (plain language)",
      bloom: "U",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum (business synthesis)",
        paragraphs: [
          "Clean Core means keeping the standard SAP system — the 'core' — untouched, and placing any custom needs beside it on supported connection points that SAP publishes and promises to keep stable. The core stays standard; your special requirements live next to it, plugged in through official sockets rather than wired into the internal machinery.",
          "The reason this matters is upgrades. When the custom parts only ever attach at supported, stable points, SAP can improve and update the core without breaking them. That keeps the whole system easy to upgrade — which is the entire point of the approach.",
          "Crucially, Clean Core does not mean 'no customisation.' Organisations still adapt SAP to how they work. It is about where and how that adaptation attaches: beside the core on stable connections, never embedded inside the standard code.",
        ],
        keyPoints: [
          "Keep the SAP standard core untouched.",
          "Put custom needs beside it, on supported, stable connection points.",
          "This keeps the system easy to upgrade.",
          "It is about where customisation attaches — not a ban on customisation.",
        ],
        examples: [
          {
            title: "Beside, not inside",
            variant: "neutral",
            body: "A company needs an extra approval step. The Clean Core way adds it beside the standard process on a supported hook, so the standard order process underneath can still be upgraded freely.",
          },
        ],
        simplified: {
          oneLiner:
            "Clean Core means keeping SAP standard untouched and putting custom needs beside it on supported connection points, so the system stays easy to upgrade.",
          analogy:
            "Plug into the wall socket rather than splicing into the wiring inside the wall — you can still rewire the house later.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question: "Which statement best describes Clean Core?",
            options: {
              A: "Removing all customisation from SAP.",
              B: "A way to make the database run faster.",
              C: "Keeping SAP standard untouched and adding custom needs beside it on supported connections.",
              D: "A new user interface that replaces the old one.",
            },
            correct: "C",
            explanations: {
              A: "Customisation is still allowed — it just attaches beside the core.",
              B: "Performance is not the definition of Clean Core.",
              C: "Correct — standard stays untouched; custom needs sit beside it on supported, stable connections.",
              D: "A user interface is not what Clean Core is.",
            },
            principle:
              "Clean Core keeps the core standard and attaches customisation beside it.",
          },
          {
            n: 2,
            question: "Why does keeping custom parts 'beside' the core help?",
            options: {
              A: "SAP can update the core without breaking the custom parts, keeping upgrades easy.",
              B: "It reduces the electricity bill.",
              C: "It removes the need for any testing.",
              D: "It makes the screens more colourful.",
            },
            correct: "A",
            explanations: {
              A: "Correct — attaching only at supported points means core changes do not collide with custom parts.",
              B: "Energy cost is unrelated.",
              C: "Testing is still needed; Clean Core does not remove it.",
              D: "Appearance is not the benefit.",
            },
            principle:
              "Attaching beside the core lets SAP change the core safely.",
          },
          {
            n: 3,
            question: "Does Clean Core mean an organisation cannot customise SAP?",
            options: {
              A: "Yes — no customisation is permitted at all.",
              B: "No — it governs where and how customisation attaches, not whether it exists.",
              C: "Yes — only SAP may make any change.",
              D: "No — but only if the system is brand new.",
            },
            correct: "B",
            explanations: {
              A: "Customisation is allowed under Clean Core.",
              B: "Correct — it is about attaching beside the core on supported points, not banning adaptation.",
              C: "Organisations still customise; Clean Core just channels how.",
              D: "It applies to existing systems too, not only new ones.",
            },
            principle:
              "Clean Core governs how customisation attaches, not whether it happens.",
          },
        ],
      },
    },
    {
      id: "b03-c2",
      code: "O.2",
      title: "The five Clean Core dimensions",
      bloom: "U",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum (business synthesis)",
        paragraphs: [
          "Clean Core is not only about code. SAP frames it across five dimensions: software (extensions attach through supported connections), business processes (stay close to the standard way of working where you can), master data (keep core data clean and clearly owned), integrations (connect systems through supported, versioned interfaces rather than hidden point-to-point links), and operations (run the system in an observable, automatable way with no uncontrolled manual changes).",
          "The point of naming five dimensions is that 'clean' code alone does not make a clean core. A tidy piece of software running on a heavily distorted process, or feeding off poor-quality data through an undocumented link, is still not upgrade-safe. Clean Core is an end-to-end property of the whole solution.",
          "For a stakeholder this is the key insight: when someone says a project is 'Clean Core,' it should mean attention across all five dimensions — not just that the developers wrote neat code.",
        ],
        keyPoints: [
          "Five dimensions: software, business processes, master data, integrations, operations.",
          "Clean code on a distorted process or poor data is still not Clean Core.",
          "Clean Core is end-to-end — a property of the whole solution.",
          "A genuinely 'Clean Core' project addresses all five, not just the code.",
        ],
        examples: [
          {
            title: "Five lenses on one project",
            variant: "neutral",
            body: "A rollout reviews software (supported extensions), processes (kept standard), master data (clean and owned), integrations (supported interfaces), and operations (no manual drift). All five — not just the first — make it Clean Core.",
          },
        ],
        simplified: {
          oneLiner:
            "Clean Core spans five dimensions — software, business processes, master data, integrations, and operations — so it is end-to-end, not just about code.",
          analogy:
            "A building is only sound if structure, plumbing, wiring, foundations, and upkeep are all in order — not just one of them.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question: "Which is NOT one of the five Clean Core dimensions?",
            options: {
              A: "Software.",
              B: "Hardware.",
              C: "Master data.",
              D: "Operations.",
            },
            correct: "B",
            explanations: {
              A: "Software is one of the five.",
              B: "Correct — the five are software, business processes, master data, integrations, and operations. Hardware is not one of them.",
              C: "Master data is one of the five.",
              D: "Operations is one of the five.",
            },
            principle:
              "The five dimensions: software, business processes, master data, integrations, operations.",
          },
          {
            n: 2,
            question:
              "Why does Clean Core span five dimensions instead of just software?",
            options: {
              A: "To create more documentation.",
              B: "To give each team its own dimension to own.",
              C: "To match the number of SAP products.",
              D: "Because clean code on a distorted process or bad data is still not upgrade-safe.",
            },
            correct: "D",
            explanations: {
              A: "More paperwork is not the reason.",
              B: "The dimensions are not assigned one-per-team by design.",
              C: "They do not map to a product count.",
              D: "Correct — cleanliness must be end-to-end, because weak processes, data, or integrations undermine even neat code.",
            },
            principle:
              "Clean Core is an end-to-end property, not a code-only one.",
          },
          {
            n: 3,
            question:
              "When someone calls a project 'Clean Core,' what should that imply?",
            options: {
              A: "Attention across all five dimensions, not just neat code.",
              B: "That the developers wrote tidy code and nothing more.",
              C: "That no customisation was done at all.",
              D: "That the project skipped testing to move faster.",
            },
            correct: "A",
            explanations: {
              A: "Correct — a genuine Clean Core project covers software, processes, data, integrations, and operations.",
              B: "Tidy code alone is not sufficient for Clean Core.",
              C: "Customisation can still happen; it is about how it attaches.",
              D: "Clean Core relies on testing, not skipping it.",
            },
            principle:
              "'Clean Core' should mean all five dimensions were considered.",
          },
        ],
      },
    },
    {
      id: "b03-c3",
      code: "O.3",
      title: "Why upgrades get easier",
      bloom: "U",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum (business synthesis)",
        paragraphs: [
          "Upgrades get easier because Clean Core extensions only ever attach through released, versioned contracts. 'Released' means SAP has officially published a connection point and promised to keep it stable; 'versioned' means changes to it are managed and announced rather than sprung on you. Because the custom parts depend only on these stable promises, SAP can change the core's internal workings without breaking them.",
          "Compare that to the old way, where custom code reached directly into SAP's internal mechanics. Any internal change SAP made could break that code, so every upgrade became a hunt for what broke — slow, surprising, and expensive. Clean Core removes the surprises by ensuring custom parts never depend on internals that are free to change.",
          "The plain takeaway for a stakeholder: fewer surprises and faster upgrades. The system can keep moving forward on SAP's schedule because the custom parts are insulated behind stable contracts.",
        ],
        keyPoints: [
          "Extensions attach only through released (stable) and versioned (managed-change) contracts.",
          "SAP can change the core's internals without breaking those extensions.",
          "The old way reached into internals, so every upgrade hunted for what broke.",
          "Result: fewer surprises and faster upgrades.",
        ],
        examples: [
          {
            title: "Why the surprises disappear",
            variant: "neutral",
            body: "Old way: a custom report read an internal table SAP later restructured — it broke on upgrade. Clean Core way: the report reads a released, stable view, so the same restructuring underneath changes nothing for it.",
          },
        ],
        simplified: {
          oneLiner:
            "Because extensions use released, versioned contracts, SAP can change the core without breaking them — so upgrades bring fewer surprises and go faster.",
          analogy:
            "A standard plug fits every upgraded socket; a wire soldered directly into old fittings has to be redone every time the fittings change.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Why can SAP change the core without breaking Clean Core extensions?",
            options: {
              A: "The extensions depend only on released, stable, versioned connection points.",
              B: "The extensions are deleted before every upgrade.",
              C: "SAP never actually changes the core.",
              D: "The extensions are written in a faster language.",
            },
            correct: "A",
            explanations: {
              A: "Correct — depending only on stable, published contracts insulates the extensions from internal changes.",
              B: "Extensions are not deleted; they persist through upgrades.",
              C: "SAP does change the core — that is exactly why stable contracts matter.",
              D: "The programming language is not the reason.",
            },
            principle:
              "Stable, released contracts insulate extensions from core changes.",
          },
          {
            n: 2,
            question:
              "What does 'versioned' add on top of 'released' for a connection point?",
            options: {
              A: "It makes the connection run faster.",
              B: "It encrypts the data passing through it.",
              C: "It means changes are managed and announced, not sprung on you.",
              D: "It hides the connection from auditors.",
            },
            correct: "C",
            explanations: {
              A: "Versioning is about managed change, not speed.",
              B: "Encryption is a separate concern.",
              C: "Correct — versioning means changes are tracked and communicated in an orderly way.",
              D: "Versioning improves transparency, it does not hide anything.",
            },
            principle:
              "Versioning means orderly, announced change to a contract.",
          },
          {
            n: 3,
            question:
              "Why was the 'old way' of reaching into SAP internals so painful at upgrade time?",
            options: {
              A: "It made the screens load slowly.",
              B: "It used too much storage.",
              C: "It required new hardware each year.",
              D: "Any internal change SAP made could break the custom code, turning each upgrade into a hunt for breakage.",
            },
            correct: "D",
            explanations: {
              A: "Screen speed was not the issue.",
              B: "Storage was not the cause of the pain.",
              C: "Hardware refresh is unrelated.",
              D: "Correct — depending on changeable internals meant upgrades regularly broke custom code unpredictably.",
            },
            principle:
              "Depending on internals makes upgrades a hunt for what broke.",
          },
        ],
      },
    },
    {
      id: "b03-c4",
      code: "O.4",
      title: "The vocabulary everyone keeps using (glossary)",
      bloom: "R",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum (business synthesis)",
        paragraphs: [
          "Clean Core conversations are full of acronyms. Here is a plain-language glossary. S/4HANA is SAP's current generation of its core business system. BTP (Business Technology Platform) is SAP's separate cloud platform where extensions can run beside the core. RAP (the ABAP RESTful Application Programming model) is SAP's modern, supported way for developers to build extensions inside the system.",
          "A few more: CDS (Core Data Services) is a way of defining reusable views of data — essentially saved, shareable queries. ATC (ABAP Test Cockpit) is the automated quality checker that flags Clean Core problems. A BAdI (Business Add-In) is a pre-built, official 'hook' where custom logic can be plugged in without touching standard code. A released API is any connection point SAP has officially published and promised to keep stable.",
          "And two that come up constantly: FPS (Feature Pack Stack) is a scheduled bundle of new features and fixes SAP ships — the thing you 'upgrade' to. Key-user extensibility is the set of in-app tools that let business power users adapt the system without a developer. You do not need to use these terms yourself, but recognising them lets you follow any Clean Core discussion.",
        ],
        keyPoints: [
          "S/4HANA: SAP's current core business system. BTP: SAP's separate cloud platform for side-by-side extensions.",
          "RAP: the modern supported way to build extensions in-system. CDS: reusable, saved views of data.",
          "ATC: the automated quality checker. BAdI: an official hook for plugging in custom logic.",
          "Released API: an officially published, stable connection point. FPS: a scheduled bundle of features/fixes you upgrade to. Key-user extensibility: in-app tools for business users.",
        ],
        examples: [
          {
            title: "The glossary in a sentence",
            variant: "neutral",
            body: "'We'll use key-user extensibility for the field, a released API via RAP for the logic, run ATC before the next FPS, and read the data through a CDS view.' — every term above, in one real sentence.",
          },
        ],
        simplified: {
          oneLiner:
            "S/4HANA (the core system), BTP (SAP's cloud platform), RAP (modern in-system development), CDS (reusable data views), ATC (the quality checker), BAdI (an official hook), released API (a stable published connection), FPS (a scheduled feature bundle), and key-user extensibility (in-app tools) are the terms you will keep hearing.",
          analogy:
            "It is the cast list for the conversation — once you can recognise the names, you can follow the plot.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question: "In plain terms, what is a 'released API'?",
            options: {
              A: "A piece of hardware in the data centre.",
              B: "A type of spreadsheet.",
              C: "A user's login account.",
              D: "A connection point SAP has officially published and promised to keep stable.",
            },
            correct: "D",
            explanations: {
              A: "It is not hardware.",
              B: "It is not a spreadsheet.",
              C: "It has nothing to do with login accounts.",
              D: "Correct — a released API is an official, stable connection point safe to build on.",
            },
            principle:
              "A released API is an officially published, stable connection point.",
          },
          {
            n: 2,
            question: "What is an FPS (Feature Pack Stack)?",
            options: {
              A: "A scheduled bundle of new features and fixes SAP ships, which you upgrade to.",
              B: "A type of database backup.",
              C: "A security password policy.",
              D: "A report that lists all users.",
            },
            correct: "A",
            explanations: {
              A: "Correct — an FPS is the packaged set of updates an organisation upgrades to.",
              B: "It is not a backup.",
              C: "It is not a password policy.",
              D: "It is not a user report.",
            },
            principle:
              "An FPS is a scheduled bundle of features and fixes you upgrade to.",
          },
          {
            n: 3,
            question: "What does ATC (ABAP Test Cockpit) do?",
            options: {
              A: "It books meeting rooms.",
              B: "It manages user holidays.",
              C: "It is the automated quality checker that flags Clean Core problems.",
              D: "It is the platform where extensions run beside the core.",
            },
            correct: "C",
            explanations: {
              A: "ATC has nothing to do with room booking.",
              B: "It does not manage holidays.",
              C: "Correct — ATC is the automated check that surfaces Clean Core and quality issues.",
              D: "Running extensions beside the core describes BTP, not ATC.",
            },
            principle:
              "ATC is the automated checker for Clean Core and quality issues.",
          },
        ],
      },
    },
    {
      id: "b03-c5",
      code: "O.5",
      title: "How to read a readiness report",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum (business synthesis)",
        paragraphs: [
          "A readiness report lists the issues the automated checker found in the custom code. The findings are grouped by priority — high, medium, low — so the first thing to look at is not the grand total but how many high-priority findings there are. A large total made up mostly of low-priority items is far less alarming than a small total of high-priority ones.",
          "The report also has a baseline: a dated marker that says 'these issues already existed and have been accepted for now.' Findings inside the baseline are known debt the team chose to defer; what you really want to watch is whether new findings are appearing on top of it. A stable baseline with no new high-priority findings is a healthy sign.",
          "The single most useful habit is to read the trend, not the snapshot. Is the number of new findings going down over time? A report that is improving week over week tells you far more than any single day's absolute number. Ask 'which way is it moving?' before asking 'how big is it?'",
        ],
        keyPoints: [
          "Findings are grouped by priority — look at high-priority counts first, not the grand total.",
          "A baseline marks accepted existing debt; watch for new findings on top of it.",
          "A stable baseline with no new high-priority findings is healthy.",
          "Read the trend, not the snapshot — 'which way is it moving?' beats 'how big is it?'",
        ],
        examples: [
          {
            title: "Two reports, same total",
            variant: "neutral",
            body: "Both show 500 findings. Report A: all low-priority, trending down, no new high-priority items. Report B: 80 high-priority, trending up. Same headline number, very different health — the priority mix and the trend tell the real story.",
          },
        ],
        simplified: {
          oneLiner:
            "Findings are grouped by priority, a baseline marks accepted existing debt, and the trend — are new findings going down? — matters more than the absolute number.",
          analogy:
            "Like a medical check-up: the direction your results are trending matters more than any one day's reading.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "When reading a readiness report, what should you look at first?",
            options: {
              A: "The font size of the report.",
              B: "The colour of the charts.",
              C: "The number of high-priority findings, rather than the grand total.",
              D: "The name of the person who ran it.",
            },
            correct: "C",
            explanations: {
              A: "Formatting is irrelevant to readiness.",
              B: "Chart colour tells you nothing about risk.",
              C: "Correct — a small number of high-priority findings can matter more than a large total of low-priority ones.",
              D: "Who ran the report does not change what it means.",
            },
            principle:
              "Priority mix matters more than the grand total.",
          },
          {
            n: 2,
            question: "What does a 'baseline' represent in a readiness report?",
            options: {
              A: "Accepted existing debt that has been deferred for now.",
              B: "The fastest possible upgrade time.",
              C: "A list of approved users.",
              D: "The minimum hardware required.",
            },
            correct: "A",
            explanations: {
              A: "Correct — the baseline marks issues that already existed and were accepted, so attention focuses on new findings.",
              B: "It is not an upgrade-time figure.",
              C: "It is about findings, not users.",
              D: "It has nothing to do with hardware.",
            },
            principle:
              "A baseline marks accepted existing debt so new findings stand out.",
          },
          {
            n: 3,
            question:
              "What is the single most useful question to ask of a readiness report?",
            options: {
              A: "'How big is the absolute number today?'",
              B: "'Which way is the trend moving — are new findings going down?'",
              C: "'How many pages is it?'",
              D: "'What time was it generated?'",
            },
            correct: "B",
            explanations: {
              A: "The absolute number alone can mislead without the trend.",
              B: "Correct — an improving trend tells you more than any single snapshot.",
              C: "Length is irrelevant.",
              D: "The generation time does not indicate health.",
            },
            principle:
              "Read the trend, not the snapshot.",
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
        question: "Clean Core, in plain language, means…",
        options: {
          A: "removing all customisation from SAP.",
          B: "making the database run faster.",
          C: "keeping SAP standard untouched and putting custom needs beside it on supported connection points.",
          D: "replacing the user interface.",
        },
        correct: "C",
        explanations: {
          A: "Customisation is allowed; it attaches beside the core.",
          B: "Performance is not the definition.",
          C: "Correct — standard stays untouched and custom needs sit beside it on supported connections.",
          D: "It is not a user-interface change.",
        },
        principle: "Keep the core standard; attach customisation beside it.",
      },
      {
        n: 2,
        question: "Which is NOT one of the five Clean Core dimensions?",
        options: {
          A: "Integrations.",
          B: "Hardware.",
          C: "Business processes.",
          D: "Operations.",
        },
        correct: "B",
        explanations: {
          A: "Integrations is one of the five.",
          B: "Correct — the five are software, business processes, master data, integrations, and operations. Hardware is not one.",
          C: "Business processes is one of the five.",
          D: "Operations is one of the five.",
        },
        principle: "Software, business processes, master data, integrations, operations.",
      },
      {
        n: 3,
        question:
          "Why do upgrades get easier under Clean Core?",
        options: {
          A: "Extensions depend only on released, stable, versioned contracts, so the core can change without breaking them.",
          B: "Because the system is rebuilt from scratch each time.",
          C: "Because SAP stops releasing updates.",
          D: "Because the screens get simpler.",
        },
        correct: "A",
        explanations: {
          A: "Correct — depending only on stable contracts insulates extensions from internal core changes.",
          B: "No rebuild is required.",
          C: "SAP keeps releasing updates; that is the point of staying current.",
          D: "Screen simplicity is not the reason.",
        },
        principle: "Stable contracts insulate extensions from core change.",
      },
      {
        n: 4,
        question: "In plain terms, what is a 'released API'?",
        options: {
          A: "A type of report listing users.",
          B: "A spreadsheet template.",
          C: "A login account.",
          D: "A connection point SAP has officially published and promised to keep stable.",
        },
        correct: "D",
        explanations: {
          A: "It is not a user report.",
          B: "It is not a spreadsheet.",
          C: "It is not a login account.",
          D: "Correct — a released API is an official, stable, published connection point.",
        },
        principle: "A released API is an officially published, stable connection point.",
      },
      {
        n: 5,
        question:
          "What matters most when reading a readiness report?",
        options: {
          A: "The trend — whether new findings are going down — more than the absolute number.",
          B: "The total number of findings, taken alone.",
          C: "The colour of the charts.",
          D: "The number of pages.",
        },
        correct: "A",
        explanations: {
          A: "Correct — an improving trend, and the high-priority mix, tell you more than a single absolute number.",
          B: "The absolute total alone can mislead without priority and trend.",
          C: "Chart colour is irrelevant.",
          D: "Page count says nothing about health.",
        },
        principle: "Read the trend and the priority mix, not the headline number.",
      },
    ],
  },
};
