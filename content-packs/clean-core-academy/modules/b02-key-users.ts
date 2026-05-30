/* ------------------------------------------------------------------
   Module B2 — Clean Core for Key & End Users.

   Source brief: §1 (Foundations, the 3-tier model) of the Clean Core &
   HANA Readiness curriculum, synthesised for business key users and
   functional end users — the people who configure and extend SAP from
   inside the application. Plain language, no ABAP. The throughline:
   changes made through the governed in-app (key-user) tools survive
   upgrades; shadow spreadsheets and off-system workarounds do not.
   Every concept ships paragraphs + keyPoints + simplified.oneLiner and
   a 3-question conceptual quiz.
------------------------------------------------------------------ */

import type { Section } from "../_types";

export const b02KeyUsers: Section = {
  id: "b02-key-users",
  n: 16,
  title: "Clean Core for Key & End Users",
  sourceCourse: "clean-core-curriculum (key-user synthesis)",
  audiences: ["end-user"],
  skills: [
    {
      id: "b02-s1",
      label: "Explain what Clean Core means for your own daily work",
      conceptId: "b02-c1",
    },
    {
      id: "b02-s2",
      label: "Recognise what key-user (in-app) extensibility lets you do",
      conceptId: "b02-c2",
    },
    {
      id: "b02-s3",
      label: "Add custom fields and simple logic without a developer",
      conceptId: "b02-c3",
    },
    {
      id: "b02-s4",
      label: "Decide when to involve a developer and what to ask for",
      conceptId: "b02-c4",
    },
    {
      id: "b02-s5",
      label: "Keep your extensions upgrade-safe and avoid shadow processes",
      conceptId: "b02-c5",
    },
  ],
  blurb:
    "Clean Core for the people who use and configure SAP every day: why the in-app tools keep your changes safe through upgrades, what you can build yourself, when to bring in a developer, and how to avoid the shadow spreadsheets and workarounds that quietly break.",
  concepts: [
    {
      id: "b02-c1",
      code: "K.1",
      title: "What Clean Core means for you",
      bloom: "U",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum (business synthesis)",
        paragraphs: [
          "Clean Core is the principle that the standard SAP system stays untouched and any extra needs are added through the official tools SAP provides. For you as a key or end user, the practical meaning is simple: changes you make through the supported in-app tools survive upgrades, while workarounds built outside the system do not.",
          "The most common off-system workarounds are 'shadow spreadsheets' — a tracker someone keeps in a spreadsheet because the system did not quite do what they needed — and manual steps people pass around informally. These feel faster today, but they are invisible to the system, break silently when anything changes, and carry no audit trail.",
          "So Clean Core is not a restriction on you; it is a promise. If you express your need through the governed tools (or ask for it to be built that way), the organisation keeps the benefit through every upgrade instead of rebuilding it each time.",
        ],
        keyPoints: [
          "Changes made through supported in-app tools survive upgrades.",
          "Shadow spreadsheets and off-system steps are invisible and break silently.",
          "Workarounds carry no audit trail and no upgrade protection.",
          "Clean Core is a promise of durability, not a restriction on what you can ask for.",
        ],
        examples: [
          {
            title: "The spreadsheet that vanished",
            variant: "neutral",
            body: "A team tracked approvals in a private spreadsheet for two years. When the approver left, the spreadsheet — and the only record — went with them. The same need captured in the system would still be there, with a full history.",
          },
        ],
        simplified: {
          oneLiner:
            "If you extend SAP through the supported in-app tools, your changes survive upgrades; shadow spreadsheets and off-system workarounds do not.",
          analogy:
            "It is the difference between writing on the whiteboard everyone shares and keeping notes on a sticky pad in your own drawer.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "What survives a system upgrade safely for a key user?",
            options: {
              A: "A private spreadsheet kept on someone's laptop.",
              B: "Changes made through the supported in-app (key-user) tools.",
              C: "A manual step passed around by email.",
              D: "An undocumented connection to another system.",
            },
            correct: "B",
            explanations: {
              A: "A private spreadsheet is invisible to the system and is not protected by upgrades.",
              B: "Correct — the in-app tools are designed so your changes carry through upgrades.",
              C: "Informal manual steps have no upgrade protection.",
              D: "Undocumented connections are exactly what tends to break.",
            },
            principle:
              "Governed in-app changes are upgrade-safe; off-system workarounds are not.",
          },
          {
            n: 2,
            question: "Why are 'shadow spreadsheets' a risk to the business?",
            options: {
              A: "They are invisible to the system, break silently, and carry no audit trail.",
              B: "They use too much disk space.",
              C: "They are always slower to update than the system.",
              D: "They require a developer to create.",
            },
            correct: "A",
            explanations: {
              A: "Correct — being off-system means no visibility, no upgrade protection, and no history if a person leaves.",
              B: "Disk space is not the concern.",
              C: "Speed of editing is not the risk; durability and visibility are.",
              D: "Anyone can make a spreadsheet — that is part of why they proliferate.",
            },
            principle:
              "Off-system records lack visibility, durability, and an audit trail.",
          },
          {
            n: 3,
            question: "Clean Core is best understood by a key user as…",
            options: {
              A: "a ban on changing anything.",
              B: "a requirement to learn programming.",
              C: "a rule that only IT may touch the system.",
              D: "a promise that needs expressed through governed tools survive upgrades.",
            },
            correct: "D",
            explanations: {
              A: "It is not a ban — it channels changes through durable tools.",
              B: "Key-user tools require no programming.",
              C: "Key users are explicitly empowered, not excluded.",
              D: "Correct — it is a promise of durability for changes made the supported way.",
            },
            principle:
              "Clean Core promises durability for governed extensions.",
          },
        ],
      },
    },
    {
      id: "b02-c2",
      code: "K.2",
      title: "Key-user (in-app) extensibility",
      bloom: "U",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum (business synthesis)",
        paragraphs: [
          "Key-user extensibility is a set of tools built right into the SAP Fiori apps you already use. (Fiori is SAP's modern, web-style user interface.) These tools let business power users adapt the system without any classic programming — the changes are made through screens, not code.",
          "Through them you can add custom fields to standard apps, build custom views of data (SAP calls these CDS views, which are essentially saved, reusable queries), and attach simple custom logic at points SAP has deliberately opened up for this purpose. Those opening points are called released extension points — SAP has marked them as safe and stable to build on.",
          "The important word is 'released.' Because you are only ever extending where SAP has published a stable, supported hook, your additions are upgrade-safe by design. You get genuine flexibility without taking on the upgrade risk that classic development used to carry.",
        ],
        keyPoints: [
          "Key-user tools are built into the Fiori apps — changes are made through screens, not code.",
          "You can add custom fields, custom views of data, and simple custom logic.",
          "You only ever extend at released (SAP-supported, stable) extension points.",
          "Because the hooks are released, the changes are upgrade-safe by design.",
        ],
        examples: [
          {
            title: "A field added the supported way",
            variant: "neutral",
            body: "A purchasing lead adds a 'Preferred Carrier' field to a standard app using the in-app tool. It appears for everyone, reports correctly, and is still there after the next upgrade — no developer involved.",
          },
        ],
        simplified: {
          oneLiner:
            "The in-app (key-user) tools let business users add fields, views, and simple logic through released, supported extension points — no classic development.",
          analogy:
            "It is like the official settings panel of an app: powerful options the maker put there on purpose, not a hack into the source code.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "How are key-user (in-app) changes made?",
            options: {
              A: "Through screens and tools built into the apps — no classic programming.",
              B: "By editing the SAP source code directly.",
              C: "Only by raising a ticket to SAP itself.",
              D: "By exporting data to a spreadsheet and back.",
            },
            correct: "A",
            explanations: {
              A: "Correct — the tools are built into the Fiori apps and need no classic development.",
              B: "Editing source code is exactly what key-user tools avoid.",
              C: "No ticket to SAP is required for in-app extensibility.",
              D: "Spreadsheet round-trips are an off-system workaround, not key-user extensibility.",
            },
            principle:
              "Key-user extensibility is screen-based and needs no classic development.",
          },
          {
            n: 2,
            question:
              "Why are key-user extensions upgrade-safe by design?",
            options: {
              A: "Because they are backed up nightly.",
              B: "Because they are encrypted.",
              C: "Because they only extend at released, SAP-supported, stable points.",
              D: "Because a developer reviews every one.",
            },
            correct: "C",
            explanations: {
              A: "Backups protect against data loss, not upgrade breakage.",
              B: "Encryption is unrelated to upgrade safety.",
              C: "Correct — 'released' means SAP keeps those hooks stable across upgrades, so your additions keep working.",
              D: "No developer review is required for the in-app tools to be upgrade-safe.",
            },
            principle:
              "Released extension points are the reason in-app changes survive upgrades.",
          },
          {
            n: 3,
            question:
              "Which of these can a key user typically create with the in-app tools?",
            options: {
              A: "A replacement operating system.",
              B: "A new physical server.",
              C: "A change to SAP's standard source code.",
              D: "A custom field, a custom view of data, and simple custom logic.",
            },
            correct: "D",
            explanations: {
              A: "Operating systems are far outside the scope of these tools.",
              B: "Hardware is not provisioned through key-user tools.",
              C: "Changing standard source code is precisely what Clean Core avoids.",
              D: "Correct — fields, views, and simple logic at released points are the staples of key-user extensibility.",
            },
            principle:
              "Custom fields, views, and simple logic are the everyday key-user capabilities.",
          },
        ],
      },
    },
    {
      id: "b02-c3",
      code: "K.3",
      title: "Custom fields & logic without a developer",
      bloom: "A",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum (business synthesis)",
        paragraphs: [
          "Day to day, the most useful things you can self-serve are: adding a field to a Fiori app, surfacing that field on a form or report, and setting up a simple validation — for example, requiring that a field is filled in before a record can be saved. None of these need a developer, and all of them are captured inside the system.",
          "The reason this stays upgrade-safe is that the in-app tools record your change as a configuration the system understands and carries forward, rather than as an edit to SAP's own code. When SAP upgrades the underlying app, it knows about your added field and keeps it in place.",
          "A good habit is to ask, before reaching outside the system, 'can the in-app tool do this?' Very often the answer is yes, and choosing the in-app route turns a fragile personal workaround into a durable, shared capability with a proper audit trail.",
        ],
        keyPoints: [
          "Self-service staples: add a field, show it on a form or report, add a simple validation.",
          "The tools store your change as configuration the upgrade carries forward — not a code edit.",
          "Default question: 'can the in-app tool do this?' before going outside the system.",
          "In-app changes are shared and audited, unlike a personal workaround.",
        ],
        examples: [
          {
            title: "A simple validation, self-served",
            variant: "neutral",
            body: "A finance key user adds a rule: a cost-centre record cannot be saved unless the 'Approver' field is filled. It applies to everyone instantly, and survives the next upgrade — all without a developer.",
          },
        ],
        simplified: {
          oneLiner:
            "Adding a field, showing it on a form or report, and setting a simple validation are things you can self-serve through the in-app tools, and they stay upgrade-safe.",
          analogy:
            "It is like adding a custom column to a shared spreadsheet template that everyone inherits — except the system remembers it through every update.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Which of these can a key user typically do without a developer?",
            options: {
              A: "Rewrite how SAP calculates tax internally.",
              B: "Replace the database engine.",
              C: "Build a brand-new microservice on another platform.",
              D: "Add a field to a Fiori app and require it to be filled before saving.",
            },
            correct: "D",
            explanations: {
              A: "Changing SAP's internal calculations is developer or standard territory, not self-service.",
              B: "Database engines are infrastructure, far outside key-user tools.",
              C: "A separate microservice is a developer / side-by-side task.",
              D: "Correct — adding a field and a simple 'must be filled' validation is classic self-service.",
            },
            principle:
              "Fields and simple validations are self-service; deep logic and new platforms are not.",
          },
          {
            n: 2,
            question:
              "Why does a field added with the in-app tool survive an upgrade?",
            options: {
              A: "Because it is stored as configuration the system understands and carries forward.",
              B: "Because it is printed out before each upgrade.",
              C: "Because SAP support manually re-adds it each time.",
              D: "Because it is hidden from the upgrade process.",
            },
            correct: "A",
            explanations: {
              A: "Correct — the change is recorded as something the system knows about, so the upgrade preserves it.",
              B: "Printing has nothing to do with upgrade safety.",
              C: "No manual re-adding by SAP support is involved.",
              D: "It is not hidden; it is known to and respected by the upgrade.",
            },
            principle:
              "In-app changes are stored as carried-forward configuration, not code edits.",
          },
          {
            n: 3,
            question:
              "What is a good default question before building a workaround outside the system?",
            options: {
              A: "'Can the in-app tool do this?'",
              B: "'Who else has a spreadsheet for this?'",
              C: "'Can I email it instead?'",
              D: "'Is there a faster laptop?'",
            },
            correct: "A",
            explanations: {
              A: "Correct — checking the in-app tool first usually yields a durable, shared, audited solution.",
              B: "Copying someone else's spreadsheet spreads the shadow-process problem.",
              C: "Email does not capture the need in the system.",
              D: "Hardware is irrelevant to the choice.",
            },
            principle:
              "Reach for the in-app tool before stepping outside the system.",
          },
        ],
      },
    },
    {
      id: "b02-c4",
      code: "K.4",
      title: "When to involve a developer (and what to ask for)",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum (business synthesis)",
        paragraphs: [
          "Sometimes the in-app tools are not enough — the logic is too complex, or the need spans systems. That is a perfectly good reason to involve a developer. The key is what you ask for: a solution built on released APIs (the official, supported connection points) or on SAP's modern in-system development model, RAP. You can simply say, 'please build this the Clean Core way.'",
          "There is one thing to never ask for, even if someone offers it as a quick fix: a modification to SAP standard. A modification edits SAP's own delivered code, and it is exactly what breaks on upgrades and re-incurs cost every cycle. If a proposal involves 'just tweaking the standard,' that is a red flag.",
          "A useful instinct: describe the business outcome you need, not the technical method, and ask the developer to choose the cleanest supported option (in-system developer extensibility, or a side-by-side app on SAP's platform). Your job is to insist the result is upgrade-safe; their job is to pick the right tool.",
        ],
        keyPoints: [
          "Involve a developer when the in-app tools cannot meet the need.",
          "Ask for a solution on released APIs or the modern RAP model — 'build it the Clean Core way.'",
          "Never accept a modification to SAP standard, even as a quick fix.",
          "Describe the outcome; insist it is upgrade-safe; let the developer pick the method.",
        ],
        examples: [
          {
            title: "The right ask",
            variant: "neutral",
            body: "Instead of 'tweak the standard order screen,' a key user says: 'I need orders over a threshold routed for a second approval — please build it on released APIs so it survives upgrades.' The developer chooses the technical approach.",
          },
        ],
        simplified: {
          oneLiner:
            "When the in-app tools fall short, ask a developer for a solution on released APIs or RAP — never a modification to SAP standard.",
          analogy:
            "Ask a licensed electrician to add a proper new outlet — do not let anyone splice into the wiring inside the wall.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "When the in-app tools are not enough, what should you ask a developer for?",
            options: {
              A: "A quick modification to SAP standard.",
              B: "A private spreadsheet macro.",
              C: "A solution built on released APIs or the modern RAP model.",
              D: "Whatever is fastest to deliver this week.",
            },
            correct: "C",
            explanations: {
              A: "A modification to standard is the one thing to avoid — it breaks on upgrades.",
              B: "A spreadsheet macro is another off-system workaround.",
              C: "Correct — released APIs and RAP keep the result upgrade-safe.",
              D: "Speed alone, without upgrade-safety, recreates the original problem.",
            },
            principle:
              "Ask for released-API / RAP solutions — the Clean Core way.",
          },
          {
            n: 2,
            question:
              "Which proposal should be treated as a red flag?",
            options: {
              A: "'Let's just modify the SAP standard code for a quick fix.'",
              B: "'Let's build it on released APIs.'",
              C: "'Let's check the in-app tool first.'",
              D: "'Let's describe the outcome and let the developer pick the method.'",
            },
            correct: "A",
            explanations: {
              A: "Correct — modifying SAP standard is what breaks on upgrades and re-incurs cost.",
              B: "Building on released APIs is the recommended approach.",
              C: "Checking the in-app tool first is good practice.",
              D: "Describing the outcome and delegating the method is exactly right.",
            },
            principle:
              "A modification to SAP standard is the anti-pattern to refuse.",
          },
          {
            n: 3,
            question:
              "What is the most useful thing for a key user to specify when requesting a developer solution?",
            options: {
              A: "The exact lines of code to write.",
              B: "Which server to deploy it on.",
              C: "The font and colour of the screen.",
              D: "The business outcome needed, plus the insistence that it be upgrade-safe.",
            },
            correct: "D",
            explanations: {
              A: "Specifying code is the developer's job, not the key user's.",
              B: "Deployment location is a technical decision for the developer.",
              C: "Cosmetic details are secondary to the outcome and its durability.",
              D: "Correct — state the outcome and require upgrade-safety; let the developer choose the technical route.",
            },
            principle:
              "Specify the outcome and demand upgrade-safety; delegate the method.",
          },
        ],
      },
    },
    {
      id: "b02-c5",
      code: "K.5",
      title: "Staying upgrade-safe",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum (business synthesis)",
        paragraphs: [
          "Staying upgrade-safe as a key user comes down to a few habits. Keep your extensions inside the governed in-app tools, where the system knows about them and carries them forward. The moment a need leaks into a private spreadsheet or an informal manual step, you have created something the next upgrade cannot protect.",
          "Two specific traps are worth naming. The first is undocumented integrations — quietly wiring SAP to another tool or file feed that nobody has recorded; these are fragile and break without warning. The second is configuration drift — small manual settings changed here and there over time until no one can say what the 'right' configuration is.",
          "The healthiest behaviour is to report needs rather than build shadow processes. When the system does not do something, raise it so it can be solved the supported way and shared by everyone, instead of being patched privately. Reporting the gap is how it gets fixed durably; hiding it in a spreadsheet is how it stays broken.",
        ],
        keyPoints: [
          "Keep extensions inside the governed in-app tools so the system carries them forward.",
          "Avoid undocumented integrations — they break silently and without warning.",
          "Avoid configuration drift — uncontrolled manual settings nobody can reconstruct.",
          "Report needs rather than building private shadow processes.",
        ],
        examples: [
          {
            title: "Reporting instead of patching",
            variant: "neutral",
            body: "A warehouse lead notices a missing status. Instead of starting a side spreadsheet, they log the gap. It is added through the in-app tool, everyone benefits, and it survives the next upgrade.",
          },
        ],
        simplified: {
          oneLiner:
            "Keep extensions inside the governed tools, avoid undocumented integrations and config drift, and report needs instead of building shadow processes.",
          analogy:
            "Use the building's official maintenance request line instead of running your own wires through the ceiling.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "What is the single most reliable way for a key user to stay upgrade-safe?",
            options: {
              A: "Back up a personal spreadsheet weekly.",
              B: "Keep extensions inside the governed in-app tools.",
              C: "Email a copy of every change to IT.",
              D: "Avoid using the system after an upgrade.",
            },
            correct: "B",
            explanations: {
              A: "A personal spreadsheet is itself the upgrade risk, backed up or not.",
              B: "Correct — when changes live in the governed tools, the system carries them forward.",
              C: "Emailing changes does not put them under the system's protection.",
              D: "Avoiding the system is not a strategy and does not protect anything.",
            },
            principle:
              "Governed in-app extensions are the durable, upgrade-safe home for changes.",
          },
          {
            n: 2,
            question:
              "Why are undocumented integrations a problem?",
            options: {
              A: "They are too colourful.",
              B: "They cost extra licence fees.",
              C: "They use more electricity.",
              D: "They are fragile and break silently because nobody has recorded them.",
            },
            correct: "D",
            explanations: {
              A: "Appearance is irrelevant.",
              B: "Licensing is not the issue with undocumented integrations.",
              C: "Power use is unrelated.",
              D: "Correct — being unrecorded means they break without warning and nobody knows why.",
            },
            principle:
              "Undocumented integrations break silently and resist diagnosis.",
          },
          {
            n: 3,
            question:
              "What does 'report needs rather than build shadow processes' mean in practice?",
            options: {
              A: "Raise the gap so it can be solved the supported way and shared.",
              B: "Build a private workaround and keep it secret.",
              C: "Wait for the next upgrade to fix everything automatically.",
              D: "Ask each colleague to make their own copy.",
            },
            correct: "A",
            explanations: {
              A: "Correct — reporting the gap leads to a durable, shared, supported solution.",
              B: "A secret workaround is exactly the shadow process to avoid.",
              C: "Upgrades do not invent missing capabilities on their own.",
              D: "Multiple private copies multiply the shadow-process problem.",
            },
            principle:
              "Reporting a gap gets it fixed durably; hiding it keeps it broken.",
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
          "For a key user, which kind of change survives an upgrade?",
        options: {
          A: "A change made through the supported in-app (key-user) tools.",
          B: "A tracker kept in a private spreadsheet.",
          C: "An informal manual step passed around by email.",
          D: "An undocumented connection to another system.",
        },
        correct: "A",
        explanations: {
          A: "Correct — in-app changes are carried forward by the system through upgrades.",
          B: "Private spreadsheets are invisible to the system and unprotected.",
          C: "Informal steps have no upgrade protection.",
          D: "Undocumented connections are the kind of thing that breaks.",
        },
        principle: "Governed in-app changes are upgrade-safe.",
      },
      {
        n: 2,
        question:
          "What makes key-user extensions upgrade-safe by design?",
        options: {
          A: "They are encrypted at rest.",
          B: "They are reviewed by SAP support each release.",
          C: "They are backed up nightly.",
          D: "They only extend at released, SAP-supported, stable points.",
        },
        correct: "D",
        explanations: {
          A: "Encryption protects confidentiality, not upgrade survival.",
          B: "No per-release SAP support review is involved.",
          C: "Backups guard against data loss, not upgrade breakage.",
          D: "Correct — released hooks stay stable across upgrades, so the additions keep working.",
        },
        principle: "Released extension points are why in-app changes survive upgrades.",
      },
      {
        n: 3,
        question:
          "When the in-app tools are not enough, what should you ask a developer to build on?",
        options: {
          A: "A modification to SAP standard.",
          B: "Released APIs or the modern RAP model.",
          C: "A private spreadsheet macro.",
          D: "Whatever ships fastest, regardless of upgrade-safety.",
        },
        correct: "B",
        explanations: {
          A: "A modification to standard breaks on upgrades — never the right ask.",
          B: "Correct — released APIs and RAP keep the solution upgrade-safe.",
          C: "A macro is an off-system workaround, not a supported solution.",
          D: "Speed without upgrade-safety recreates the problem.",
        },
        principle: "Request released-API / RAP solutions, never modifications.",
      },
      {
        n: 4,
        question:
          "Which proposal is a red flag a key user should refuse?",
        options: {
          A: "'Let's check the in-app tool first.'",
          B: "'Let's build it on released APIs.'",
          C: "'Let's just modify SAP standard for a quick fix.'",
          D: "'Let's describe the outcome and let the developer choose the method.'",
        },
        correct: "C",
        explanations: {
          A: "Checking the in-app tool first is good practice.",
          B: "Building on released APIs is the recommended path.",
          C: "Correct — modifying SAP standard is the anti-pattern that breaks on upgrades.",
          D: "Specifying the outcome and delegating the method is exactly right.",
        },
        principle: "Refuse modifications to SAP standard.",
      },
      {
        n: 5,
        question:
          "What is the healthiest response to a gap the system does not cover?",
        options: {
          A: "Report the need so it can be solved the supported way and shared.",
          B: "Start a private spreadsheet to fill the gap.",
          C: "Wire up an undocumented connection to another tool.",
          D: "Change settings manually until it seems to work.",
        },
        correct: "A",
        explanations: {
          A: "Correct — reporting the gap leads to a durable, shared, upgrade-safe solution.",
          B: "A private spreadsheet is a shadow process that breaks silently.",
          C: "Undocumented connections are fragile and unrecorded.",
          D: "Manual tinkering causes configuration drift nobody can reconstruct.",
        },
        principle: "Report needs; do not build shadow processes.",
      },
    ],
  },
};
