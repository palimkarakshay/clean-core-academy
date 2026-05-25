/* ------------------------------------------------------------------
   Module 9 — Lesser-Known Tools & Utilities.

   Source brief: §9 of the Clean Core & HANA Readiness curriculum.
   Audience: intermediate + expert + admin — builders, architects, and
   Basis/DevOps developers sharpening their toolchain. Reference release
   S/4HANA 2023 (758). Follows the m01 authoring template: every concept
   ships paragraphs + keyPoints + simplified.oneLiner + a 3-question
   quiz with per-option explanations; tool/process concepts use neutral
   examples, code-relevant ones use lowercase ABAP.
------------------------------------------------------------------ */

import type { Section } from "../_types";

export const m09Tools: Section = {
  id: "m09-tools",
  n: 9,
  title: "Lesser-Known Tools & Utilities",
  sourceCourse: "clean-core-curriculum §9",
  audiences: ["intermediate", "expert", "admin"],
  skills: [
    {
      id: "m09-s1",
      label: "Use ABAP Cleaner for in-ADT auto-fixes and abaplint for offline git-based linting in CI",
      conceptId: "m09-c1",
    },
    {
      id: "m09-s2",
      label: "Exploit abapGit beyond the basics: background mode, offline repos, and ATC in the stage step",
      conceptId: "m09-c2",
    },
    {
      id: "m09-s3",
      label: "Distinguish UPL, SCMON, and SUSG and time SCMON activation before a decommission decision",
      conceptId: "m09-c3",
    },
    {
      id: "m09-s4",
      label: "Apply the Decoupling Cockpit to wrap a standard internal API behind a Z-namespace boundary",
      conceptId: "m09-c4",
    },
    {
      id: "m09-s5",
      label: "Choose the right test-double framework for interfaces, CDS views, and RAP behavior",
      conceptId: "m09-c5",
    },
    {
      id: "m09-s6",
      label: "Reach for the right ADT goody or hidden t-code (source search, CDS where-used, STC01, SE95, SQVI)",
      conceptId: "m09-c6",
    },
  ],
  blurb:
    "The underused parts of the toolchain: ABAP Cleaner and abaplint, abapGit beyond the basics, the SCMON/UPL/SUSG trio, the Decoupling Cockpit, the test-double frameworks, and the ADT goodies and hidden t-codes seniors actually use.",
  concepts: [
    {
      id: "m09-c1",
      code: "9.1",
      title: "ABAP Cleaner & abaplint",
      bloom: "U",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §9.1",
        paragraphs: [
          "ABAP Cleaner and abaplint both push code toward Clean ABAP, but they live at different points in the workflow and that distinction is the whole point. ABAP Cleaner is an open-source plug-in that ships into ADT and auto-fixes roughly seventy Clean ABAP rules — inline declarations, constructor expressions, method-chaining cleanup, pragma-versus-pseudo-comment normalisation, whitespace and alignment, dead-section removal. It rewrites the source in place inside the editor, and you can turn on run-on-save so cleanup is friction-free; it is even fork-friendly, letting a shop author its own rules.",
          "abaplint is a different beast: a standalone linter written in TypeScript that runs against ABAP source sitting in a git repository, with no SAP system in the loop. Because it is offline and fast, it slots into continuous integration and pre-commit hooks (via husky or lefthook), catching many of the same findings ATC would — plus style — before code ever gets near the SAP backend. It is configured by a checked-in `abaplint.json`, so the rules travel with the repo.",
          "The senior takeaway is that the two are complementary, not rival. ABAP Cleaner fixes the developer's code automatically while they work inside ADT; abaplint guards the repository in CI where there is no ADT and no system. Using both means style is corrected at authoring time and enforced again at the gate, so neither personal discipline nor a forgotten run-on-save is the only line of defence.",
        ],
        keyPoints: [
          "ABAP Cleaner auto-fixes ~70 Clean ABAP rules inside ADT, with run-on-save and custom rules.",
          "abaplint is a standalone TypeScript linter that runs on ABAP source in git — no SAP system needed.",
          "abaplint suits offline CI and pre-commit hooks (husky / lefthook); configured by abaplint.json.",
          "They are complementary: Cleaner fixes at authoring time, abaplint enforces at the gate.",
          "Both push toward Clean ABAP, but only ABAP Cleaner rewrites the source for you.",
        ],
        examples: [
          {
            title: "Two tools, two moments",
            variant: "neutral",
            body: "A developer hits save in ADT and ABAP Cleaner tidies the unit on the spot; later, the same code lands in a pull request where abaplint runs offline in CI and blocks the merge if a rule still fails.",
          },
        ],
        simplified: {
          oneLiner:
            "ABAP Cleaner auto-fixes ~70 Clean ABAP rules inside ADT; abaplint is an offline TypeScript linter that guards ABAP in git for CI and pre-commit.",
          analogy:
            "ABAP Cleaner is autocorrect as you type; abaplint is the proofreader the document must pass before it ships.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Where does abaplint run, and what does it need?",
            options: {
              A: "Inside the ABAP kernel, requiring a productive client.",
              B: "Offline against ABAP source in git, with no SAP system required.",
              C: "Only inside ADT, requiring a live system connection.",
              D: "On HANA as a SQLScript procedure.",
            },
            correct: "B",
            explanations: {
              A: "abaplint does not run in the kernel and needs no productive client.",
              B: "Correct — it is a standalone TypeScript linter that checks ABAP source in git offline, ideal for CI and pre-commit.",
              C: "Running inside ADT against a live system describes ABAP Cleaner, not abaplint.",
              D: "abaplint is TypeScript tooling, not a database procedure.",
            },
            principle:
              "abaplint lints ABAP source in git offline — no SAP system in the loop.",
          },
          {
            n: 2,
            question:
              "What does ABAP Cleaner do that abaplint does not?",
            options: {
              A: "Run as a pre-commit hook with no SAP system.",
              B: "Validate JSON configuration files.",
              C: "Compile ABAP to the kernel.",
              D: "Auto-fix the source in place inside ADT (e.g. run-on-save).",
            },
            correct: "D",
            explanations: {
              A: "Offline pre-commit hooks are abaplint's territory.",
              B: "Neither tool's purpose is validating arbitrary JSON.",
              C: "Compilation is the ABAP system's job, not either linter's.",
              D: "Correct — ABAP Cleaner rewrites the source automatically in ADT, including on save.",
            },
            principle:
              "ABAP Cleaner auto-fixes source in ADT; abaplint enforces but does not rewrite for you.",
          },
          {
            n: 3,
            question:
              "Roughly how many Clean ABAP rules does ABAP Cleaner auto-fix, and where does it run?",
            options: {
              A: "About 70 rules, inside ADT.",
              B: "Exactly 5 rules, on BTP only.",
              C: "Thousands of rules, in the kernel.",
              D: "Zero — it only reports, never fixes.",
            },
            correct: "A",
            explanations: {
              A: "Correct — ABAP Cleaner auto-fixes roughly seventy Clean ABAP rules from within ADT.",
              B: "It is not limited to five rules nor to BTP.",
              C: "It is not a kernel component and the count is on the order of seventy, not thousands.",
              D: "Its defining feature is that it fixes, not merely reports.",
            },
            principle:
              "ABAP Cleaner auto-fixes ~70 Clean ABAP rules from inside ADT.",
          },
        ],
      },
    },
    {
      id: "m09-c2",
      code: "9.2",
      title: "abapGit beyond the basics",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §9.2",
        paragraphs: [
          "Most teams know abapGit as 'source in git', but its underused features are what make it useful in a governed landscape. Background mode — the `zabapgit_background` program — runs scheduled pulls and pushes without anyone opening the UI, which is exactly what you want in systems where developers have no direct git access: a job synchronises the repository on a schedule instead. Offline (vendored) repositories let you bring an external library into a system as a ZIP, with no internet connectivity at all, which suits locked-down or air-gapped systems.",
          "abapGit also enables branch-based development, but the senior must hold one caveat firmly: in an SAP landscape, transports remain the source of truth. abapGit runs in parallel to the transport system, not as a replacement for it; treating a git branch as the authoritative system-of-record is how teams end up with a repository and a system that quietly disagree. Branches are excellent for collaboration and review, provided the transport reality is respected.",
          "Finally, you can hook ATC into the abapGit stage step, so the act of staging objects for commit triggers a quality check first. That turns the commit boundary into a gate: unclean code is caught as it is being staged rather than after it has spread, which is the same shift-left logic as a pre-commit hook, implemented inside the abapGit flow.",
        ],
        keyPoints: [
          "Background mode (zabapgit_background) runs scheduled pulls/pushes where devs lack git access.",
          "Offline/vendored ZIP repos bring external libraries in with no internet.",
          "Branch-based dev works — but transports remain the SAP source of truth (abapGit is parallel).",
          "Hook ATC into the stage step so staging triggers a quality check (shift-left at commit).",
          "Never treat a git branch as the system-of-record over the transport system.",
        ],
        examples: [
          {
            title: "Scheduled sync without git access",
            variant: "neutral",
            body: "A locked-down system runs zabapgit_background as a periodic job to pull approved changes from an offline repo, while ATC fires at the stage step on push so nothing unclean leaves — yet the transport request is still the authoritative record.",
          },
        ],
        simplified: {
          oneLiner:
            "abapGit's underused powers: background-mode scheduled sync, offline ZIP repos, branch-based dev (but transports stay the SAP truth), and ATC hooked into the stage step.",
          analogy:
            "abapGit is a shared notebook syncing the team's drafts, but the signed transport is still the legal contract of record.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "What is abapGit background mode (zabapgit_background) for?",
            options: {
              A: "Scheduled, unattended pulls/pushes where developers lack direct git access.",
              B: "Rendering Fiori tiles faster.",
              C: "Compiling ABAP into native SQL.",
              D: "Replacing the transport system entirely.",
            },
            correct: "A",
            explanations: {
              A: "Correct — a scheduled job synchronises the repository without anyone opening the UI, ideal where devs have no git access.",
              B: "Background mode has nothing to do with UI tile rendering.",
              C: "It does not compile ABAP to SQL.",
              D: "abapGit runs parallel to transports; it does not replace them.",
            },
            principle:
              "Background mode automates scheduled sync where interactive git access is unavailable.",
          },
          {
            n: 2,
            question:
              "In an SAP landscape using abapGit branches, what remains the source of truth?",
            options: {
              A: "The git branch with the most commits.",
              B: "The abapGit offline ZIP.",
              C: "The transport system — abapGit runs in parallel, not as a replacement.",
              D: "Whichever developer pushed last.",
            },
            correct: "C",
            explanations: {
              A: "Commit count does not make a branch authoritative in an SAP landscape.",
              B: "An offline ZIP is a convenience, not the system-of-record.",
              C: "Correct — transports stay authoritative; treating a branch as the record is how the repo and system drift apart.",
              D: "Last-pusher-wins is not the governance model.",
            },
            principle:
              "Transports remain the SAP source of truth; abapGit is parallel to them.",
          },
          {
            n: 3,
            question:
              "How can abapGit shift quality checks left at the commit boundary?",
            options: {
              A: "By rebuilding the kernel before each push.",
              B: "By hooking ATC into the stage step so staging triggers a check.",
              C: "By disabling ATC during staging.",
              D: "By emailing the code to an approver.",
            },
            correct: "B",
            explanations: {
              A: "Kernel rebuilds are unrelated to the staging flow.",
              B: "Correct — hooking ATC into the stage step catches unclean code as it is staged, like a pre-commit gate.",
              C: "Disabling ATC defeats the purpose of a quality gate.",
              D: "Manual email is not a check hooked into the abapGit flow.",
            },
            principle:
              "Hooking ATC into the stage step turns the commit boundary into a quality gate.",
          },
        ],
      },
    },
    {
      id: "m09-c3",
      code: "9.3",
      title: "SCMON / UPL / SUSG",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §9.3",
        paragraphs: [
          "Three usage-logging tools are easy to confuse, yet picking the wrong one — or misreading what it captures — derails a decommissioning decision. UPL (Usage Procedure Logging) is the oldest: it works at the kernel level, recording procedure-level calls such as form and method invocations, and it is frequently switched on by default in many systems, so historic data may already exist. Because it is kernel-side it is low-overhead and broad.",
          "SCMON is the newer, ABAP-side facility, and it is configured per system and is off by default. Rather than procedure granularity it records object usage — which programs, function modules, and classes are actually executed — which is exactly the lens you want when deciding whether a custom object is dead. SUSG is the aggregation layer: it rolls up usage across systems so you can reason about a whole landscape rather than one box, combining the per-system signals into a single picture.",
          "The operational rule a senior internalises is timing: turn SCMON on one to three months before any decommission decision, on the productive system, so you capture a representative window including period-end and seasonal jobs. Switch it on the week before and you will 'discover' that the quarter-close report is unused — and delete something you very much needed. The tool is only as good as the observation window you give it.",
        ],
        keyPoints: [
          "UPL: kernel-level procedure logging (form/method calls), often on by default.",
          "SCMON: newer, ABAP-side, records object usage (programs, FMs, classes), default off.",
          "SUSG: aggregates usage across systems for a landscape-wide view.",
          "Turn SCMON on 1–3 months before a decommission decision to capture a representative window.",
          "Too short a window misses period-end/seasonal jobs and risks deleting needed code.",
        ],
        examples: [
          {
            title: "Sizing the observation window",
            variant: "neutral",
            body: "Before retiring custom reports, switch SCMON on in production for a full quarter so month-end and quarter-close runs are captured, then use SUSG to confirm the objects are unused across every system in the landscape.",
          },
        ],
        simplified: {
          oneLiner:
            "UPL = kernel procedure logging (often on); SCMON = newer ABAP-side object usage (default off); SUSG = landscape aggregation — turn SCMON on 1–3 months before deciding to decommission.",
          analogy:
            "It's a footfall counter for your code: leave it running long enough to catch the holiday rush before you decide which shops to close.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Which tool is the newer, ABAP-side facility that records object usage and is off by default?",
            options: {
              A: "SCMON.",
              B: "UPL.",
              C: "SUSG.",
              D: "ST05.",
            },
            correct: "A",
            explanations: {
              A: "Correct — SCMON is the newer ABAP-side tool that logs object usage and must be switched on.",
              B: "UPL is the older kernel-level procedure logger, often already on.",
              C: "SUSG aggregates usage across systems; it is not the per-system object logger.",
              D: "ST05 is the SQL trace, not a usage logger.",
            },
            principle:
              "SCMON is the newer ABAP-side object-usage logger, off by default.",
          },
          {
            n: 2,
            question:
              "What does SUSG add on top of UPL/SCMON?",
            options: {
              A: "It rewrites obsolete APIs automatically.",
              B: "It compiles SQLScript.",
              C: "It aggregates usage across systems for a landscape-wide view.",
              D: "It is the kernel-level procedure logger.",
            },
            correct: "C",
            explanations: {
              A: "SUSG does not modify code.",
              B: "SUSG is not a SQLScript compiler.",
              C: "Correct — SUSG rolls up per-system usage signals into one landscape-wide picture.",
              D: "Kernel-level procedure logging is UPL, not SUSG.",
            },
            principle:
              "SUSG aggregates UPL/SCMON usage across the landscape.",
          },
          {
            n: 3,
            question:
              "How long before a decommission decision should SCMON be running, and why?",
            options: {
              A: "A single day — usage is constant.",
              B: "1–3 months, to capture a representative window including period-end and seasonal jobs.",
              C: "After the decision, to confirm it was right.",
              D: "It does not matter when SCMON is enabled.",
            },
            correct: "B",
            explanations: {
              A: "One day misses periodic jobs and badly under-counts usage.",
              B: "Correct — a 1–3 month window on production captures month-end, quarter-close, and seasonal runs before you decide.",
              C: "Turning it on after deciding gives you no data to inform the decision.",
              D: "Timing is decisive — a short window risks deleting code you need.",
            },
            principle:
              "Run SCMON 1–3 months ahead so the observation window is representative.",
          },
        ],
      },
    },
    {
      id: "m09-c4",
      code: "9.4",
      title: "The Decoupling Cockpit",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §9.4",
        paragraphs: [
          "When custom code calls a standard internal API that is not released, every future SAP change to that API is a potential break, scattered across however many call sites you have. The Decoupling Cockpit attacks this by generating wrapper objects in your own Z namespace that mirror the standard internal API's signature exactly. Your code then calls the wrapper, and the wrapper alone calls SAP — so if SAP changes the internal API later, you adjust one wrapper instead of hunting through dozens of callers.",
          "The workflow is deliberate and repeatable: scan the code for the direct calls into standard internals, generate a Z-namespace wrapper class whose signature matches the SAP API, rewrite the caller to use the wrapper instead of the standard object, and then mark that wrapper as the decoupled boundary so it is clearly the single point of future migration. The wrapper is not cleaner code in itself — it is a chokepoint that localises the blast radius of SAP changes.",
          "The senior value is that this converts an unbounded, code-wide coupling problem into a bounded, one-object one. It does not make a non-released API released, and it does not remove the underlying risk; it concentrates that risk at a documented boundary you control, which is precisely the move you want when a clean rewrite to a released API is not yet possible.",
        ],
        keyPoints: [
          "Generates Z-namespace wrapper objects mirroring a standard internal API's signature.",
          "Callers use the wrapper; only the wrapper touches SAP standard.",
          "Future SAP changes touch one wrapper, not every call site.",
          "Workflow: scan → generate wrapper → rewrite caller → mark the decoupled boundary.",
          "It localises risk at a controlled boundary; it does not make the API released.",
        ],
        examples: [
          {
            title: "One wrapper, many callers protected",
            variant: "neutral",
            body: "The cockpit scans for direct calls to an unreleased standard class, generates zcl_*_wrapper mirroring its signature, rewrites all callers to the wrapper, and marks it the decoupled boundary — so a later SAP change is a one-object fix.",
          },
        ],
        simplified: {
          oneLiner:
            "The Decoupling Cockpit generates Z-namespace wrappers mirroring a standard internal API so future SAP changes only touch the wrapper, not every caller.",
          analogy:
            "It's a power adapter between your devices and a foreign socket — if the socket changes, you swap the one adapter, not every device.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "What does the Decoupling Cockpit generate?",
            options: {
              A: "A new HANA index per table.",
              B: "Released versions of SAP standard APIs.",
              C: "A Fiori launchpad space.",
              D: "Z-namespace wrapper objects mirroring a standard internal API's signature.",
            },
            correct: "D",
            explanations: {
              A: "It does not create database indexes.",
              B: "It cannot make a non-released SAP API released.",
              C: "It is not a launchpad configuration tool.",
              D: "Correct — it generates wrappers in your namespace that mirror the standard API's signature.",
            },
            principle:
              "The cockpit produces Z-namespace wrappers that mirror a standard internal API.",
          },
          {
            n: 2,
            question:
              "Why route callers through a generated wrapper instead of calling the standard internal API directly?",
            options: {
              A: "Wrappers run faster than the standard API.",
              B: "Future SAP changes then touch one wrapper instead of every call site.",
              C: "It encrypts the call payload.",
              D: "It deletes the standard API.",
            },
            correct: "B",
            explanations: {
              A: "The wrapper adds a layer; speed is not the point.",
              B: "Correct — the wrapper is a chokepoint, so a later SAP change is a one-object fix rather than a code-wide hunt.",
              C: "Wrapping is not about encryption.",
              D: "The standard API still exists; the wrapper merely fronts it.",
            },
            principle:
              "A wrapper localises the blast radius of future SAP changes to one object.",
          },
          {
            n: 3,
            question:
              "Which sequence describes the Decoupling Cockpit workflow?",
            options: {
              A: "Encrypt the API, then transport it.",
              B: "Delete the caller, then rebuild the kernel.",
              C: "Scan for direct calls → generate Z wrapper → rewrite caller → mark the decoupled boundary.",
              D: "Run ATC, then disable the wrapper.",
            },
            correct: "C",
            explanations: {
              A: "Encryption is not part of the decoupling flow.",
              B: "Deleting callers and rebuilding the kernel is unrelated.",
              C: "Correct — scan, generate the wrapper mirroring the signature, rewrite callers, and mark the boundary for future migration.",
              D: "Disabling the wrapper would defeat the decoupling.",
            },
            principle:
              "Decoupling is scan, generate wrapper, rewrite caller, mark the boundary.",
          },
        ],
      },
    },
    {
      id: "m09-c5",
      code: "9.5",
      title: "Test-double frameworks",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §9.5",
        paragraphs: [
          "Clean Core code is testable code, and SAP ships three test-double frameworks aimed at three different things — knowing which to reach for is the skill. `cl_abap_testdouble` mocks interfaces: you create a double for an interface, configure what a call returns, and inject it into the class under test, replacing a hand-rolled stub with a configurable one. It is the right tool when your dependency is expressed as an interface, which Clean ABAP encourages precisely so it can be doubled.",
          "`cl_cds_test_environment` isolates CDS test data: it spins up a test environment for a CDS entity, lets you insert controlled rows, runs the view against that data, and tears the environment down afterward — so you can unit-test an analytic or projection view deterministically without depending on whatever happens to be in the real database. RAP test doubles, built around `cl_abap_behv_aux_factory`, let you exercise a behavior pool's logic without committing to the database, mocking the RAP runtime so determinations and validations can be asserted in isolation.",
          "The senior point is to match the framework to the boundary you are isolating: an interface dependency, a CDS read, or RAP behavior. Mixing them up — for example trying to test a CDS view's results by mocking an interface — leads to brittle or meaningless tests. Each framework gives you a fast, repeatable test by replacing exactly one kind of expensive or non-deterministic dependency.",
        ],
        keyPoints: [
          "cl_abap_testdouble mocks interfaces with configurable return values.",
          "cl_cds_test_environment provides isolated CDS test data (insert rows, run view, destroy).",
          "RAP test doubles (cl_abap_behv_aux_factory) exercise behavior pools without the DB.",
          "Match the framework to the boundary: interface, CDS read, or RAP behavior.",
          "Each replaces exactly one expensive/non-deterministic dependency for fast, repeatable tests.",
        ],
        examples: [
          {
            title: "Isolated CDS test data",
            variant: "neutral",
            body: "cl_cds_test_environment creates a test schema for the view, you insert known rows, run the view, assert the result count, then destroy the environment — no dependence on live data.",
            code: [
              "data(lo_env) = cl_cds_test_environment=>create(",
              "  i_for_entity = 'ZI_OPENORDERSBYCUSTOMER' ).",
              "lo_env->insert_test_data( lt_seed_orders ).",
              "select * from zi_openordersbycustomer into table @data(lt_actual).",
              "cl_abap_unit_assert=>assert_equals( exp = 1 act = lines( lt_actual ) ).",
              "lo_env->destroy( ).",
            ].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "Three frameworks, three boundaries: cl_abap_testdouble mocks interfaces, cl_cds_test_environment isolates CDS data, and RAP test doubles (cl_abap_behv_aux_factory) exercise behavior without the DB.",
          analogy:
            "Like crash-test dummies sized for the seat — pick the dummy that fits the thing you're actually testing.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Which framework would you use to unit-test a CDS view with controlled, isolated data?",
            options: {
              A: "cl_cds_test_environment.",
              B: "cl_abap_testdouble.",
              C: "cl_abap_behv_aux_factory.",
              D: " st05.",
            },
            correct: "A",
            explanations: {
              A: "Correct — cl_cds_test_environment creates an isolated environment, lets you insert test rows, runs the view, and destroys it.",
              B: "cl_abap_testdouble mocks interfaces, not CDS reads.",
              C: "cl_abap_behv_aux_factory backs RAP behavior doubles, not CDS data.",
              D: "ST05 is the SQL trace, not a test framework.",
            },
            principle:
              "cl_cds_test_environment isolates CDS test data for deterministic view tests.",
          },
          {
            n: 2,
            question:
              "What does cl_abap_testdouble mock?",
            options: {
              A: "Database indexes.",
              B: "Fiori tiles.",
              C: "Transport requests.",
              D: "Interfaces, with configurable return values.",
            },
            correct: "D",
            explanations: {
              A: "It does not deal with indexes.",
              B: "It is unrelated to launchpad tiles.",
              C: "It does not mock transports.",
              D: "Correct — it creates configurable doubles for interfaces injected into the class under test.",
            },
            principle:
              "cl_abap_testdouble produces configurable interface doubles.",
          },
          {
            n: 3,
            question:
              "Which framework underpins RAP behavior test doubles?",
            options: {
              A: "cl_cds_test_environment.",
              B: "cl_abap_behv_aux_factory.",
              C: "cl_abap_testdouble.",
              D: "cl_gui_frontend_services.",
            },
            correct: "B",
            explanations: {
              A: "cl_cds_test_environment is for CDS data, not RAP behavior.",
              B: "Correct — RAP test doubles are built around cl_abap_behv_aux_factory to exercise behavior pools without the DB.",
              C: "cl_abap_testdouble mocks plain interfaces, not RAP behavior.",
              D: "Front-end services are not a test-double framework and are not Clean Core.",
            },
            principle:
              "RAP test doubles use cl_abap_behv_aux_factory to isolate behavior from the database.",
          },
        ],
      },
    },
    {
      id: "m09-c6",
      code: "9.6",
      title: "ADT goodies & hidden t-codes",
      bloom: "U",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §9.6",
        paragraphs: [
          "ADT carries productivity features that many teams never switch on, and a senior who knows them moves faster than one still living in SE80. Full-text 'Search for ABAP Source' does a true content search across the repository — faster and broader than SE16 lookups — while 'Where-Used in CDS' surfaces the CDS dependency graph so you can see what consumes a view before you change it. The ADT Console runs a one-off ABAP snippet without creating a program, which is invaluable for a quick experiment, and modern conditional breakpoints accept full ABAP expressions in their conditions, so you stop at exactly the iteration you care about instead of stepping a thousand times.",
          "On the classic side, several transactions remain quietly useful. STC01 (with STC02) is the Task List Runner for scripting multi-step admin and development workflows. SE95 is the Modification Browser, the fast way to find every modification made to SAP standard — essential before an upgrade. SPAU_ENH handles enhancement adjustments during an upgrade and is the member of the SPDD/SPAU adjustment family teams most often forget. SQVI, the QuickViewer, builds a one-off table join without writing a report.",
          "None of these is exotic, and that is the point: they are sanctioned, already installed, and they shrink everyday tasks from minutes to seconds. The habit worth building is to reach for the precise tool — source search, CDS where-used, the console, a conditional breakpoint, a task list, the modification browser, SPAU_ENH, or a QuickViewer — rather than forcing every job through a general-purpose screen.",
        ],
        keyPoints: [
          "ADT: full-text ABAP source search and Where-Used in CDS for dependency analysis.",
          "ADT Console runs one-off snippets without creating a program.",
          "Conditional breakpoints accept full ABAP expressions to stop on the exact case.",
          "STC01/STC02 task lists script multi-step workflows; SE95 finds every modification.",
          "SPAU_ENH adjusts enhancements on upgrade; SQVI QuickViewer builds ad-hoc joins.",
        ],
        examples: [
          {
            title: "Right tool, seconds not minutes",
            variant: "neutral",
            body: "Before changing a CDS view, run Where-Used in CDS to see consumers; to test a hunch, drop the snippet in the ADT Console; to find all standard modifications ahead of an upgrade, open SE95.",
          },
        ],
        simplified: {
          oneLiner:
            "Know the ADT goodies (source search, CDS where-used, the Console, conditional breakpoints) and hidden t-codes (STC01 task lists, SE95 modification browser, SPAU_ENH, SQVI QuickViewer).",
          analogy:
            "It's the difference between a carpenter who uses the whole toolbox and one who tries to do everything with a single screwdriver.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Which ADT feature lets you run a one-off ABAP snippet without creating a program?",
            options: {
              A: "The ADT Console.",
              B: "The CDS Where-Used view.",
              C: "Full-text source search.",
              D: "A conditional breakpoint.",
            },
            correct: "A",
            explanations: {
              A: "Correct — the ADT Console executes a throwaway snippet directly, no program object needed.",
              B: "Where-Used in CDS shows dependencies, it does not run snippets.",
              C: "Source search finds code; it does not execute it.",
              D: "A conditional breakpoint controls where execution pauses, not ad-hoc execution.",
            },
            principle:
              "The ADT Console runs one-off ABAP snippets without a program.",
          },
          {
            n: 2,
            question:
              "Before an upgrade, which transaction quickly lists every modification made to SAP standard?",
            options: {
              A: "SQVI.",
              B: "STC01.",
              C: "SE95.",
              D: "ST05.",
            },
            correct: "C",
            explanations: {
              A: "SQVI is the QuickViewer for ad-hoc joins, not modifications.",
              B: "STC01 runs task lists; it does not browse modifications.",
              C: "Correct — SE95, the Modification Browser, finds every modification to SAP standard.",
              D: "ST05 is the SQL trace.",
            },
            principle:
              "SE95, the Modification Browser, surfaces all modifications to SAP standard.",
          },
          {
            n: 3,
            question:
              "What is the QuickViewer (SQVI) good for?",
            options: {
              A: "Scripting multi-step admin workflows.",
              B: "Building a one-off table join without writing a report.",
              C: "Adjusting enhancements during an upgrade.",
              D: "Tracing SQL statements in production.",
            },
            correct: "B",
            explanations: {
              A: "Scripting multi-step workflows is STC01/STC02.",
              B: "Correct — SQVI builds an ad-hoc table join quickly, no report development required.",
              C: "Enhancement adjustment on upgrade is SPAU_ENH.",
              D: "SQL tracing is ST05, not SQVI.",
            },
            principle:
              "SQVI builds ad-hoc table joins without writing a report.",
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
          "Which tool generates Z-namespace wrappers so future SAP changes touch one object, not every caller?",
        options: {
          A: "abaplint.",
          B: "SCMON.",
          C: "ABAP Cleaner.",
          D: "The Decoupling Cockpit.",
        },
        correct: "D",
        explanations: {
          A: "abaplint is an offline linter, not a wrapper generator.",
          B: "SCMON logs object usage; it does not generate wrappers.",
          C: "ABAP Cleaner auto-fixes Clean ABAP style, not coupling boundaries.",
          D: "Correct — the Decoupling Cockpit generates wrappers mirroring a standard internal API's signature.",
        },
        principle:
          "The Decoupling Cockpit localises SAP-change risk behind a Z-namespace wrapper.",
      },
      {
        n: 2,
        question:
          "Which statement about ABAP Cleaner versus abaplint is correct?",
        options: {
          A: "ABAP Cleaner auto-fixes ~70 rules inside ADT; abaplint lints ABAP in git offline.",
          B: "Both run only inside the ABAP kernel.",
          C: "abaplint auto-fixes source on save; ABAP Cleaner only reports.",
          D: "Neither has anything to do with Clean ABAP.",
        },
        correct: "A",
        explanations: {
          A: "Correct — Cleaner rewrites in ADT (run-on-save); abaplint is an offline TypeScript linter for git-based CI.",
          B: "Neither runs in the kernel.",
          C: "The roles are reversed — Cleaner auto-fixes, abaplint enforces without rewriting.",
          D: "Both target Clean ABAP.",
        },
        principle:
          "Cleaner fixes in ADT; abaplint enforces offline in git — they are complementary.",
      },
      {
        n: 3,
        question:
          "When should SCMON be switched on relative to a decommission decision?",
        options: {
          A: "After the decision is made.",
          B: "1–3 months before, to capture a representative window including period-end jobs.",
          C: "For a single day only.",
          D: "It is on by default, so timing is irrelevant.",
        },
        correct: "B",
        explanations: {
          A: "Enabling it after deciding yields no data to inform the decision.",
          B: "Correct — a 1–3 month window captures month-end and seasonal runs before you decide.",
          C: "A single day misses periodic usage and risks deleting needed code.",
          D: "SCMON is off by default and must be deliberately enabled in time.",
        },
        principle:
          "Run SCMON 1–3 months ahead so the observation window is representative.",
      },
      {
        n: 4,
        question:
          "Which framework isolates CDS test data for a deterministic view test?",
        options: {
          A: "cl_abap_testdouble.",
          B: "cl_abap_behv_aux_factory.",
          C: "cl_cds_test_environment.",
          D: "cl_gui_frontend_services.",
        },
        correct: "C",
        explanations: {
          A: "cl_abap_testdouble mocks interfaces, not CDS reads.",
          B: "cl_abap_behv_aux_factory backs RAP behavior doubles.",
          C: "Correct — cl_cds_test_environment provides isolated CDS test data: insert rows, run the view, destroy.",
          D: "Front-end services are not a test framework.",
        },
        principle:
          "cl_cds_test_environment isolates CDS data for repeatable view tests.",
      },
      {
        n: 5,
        question:
          "In an SAP landscape using abapGit, what remains the authoritative source of truth?",
        options: {
          A: "The transport system; abapGit runs in parallel, not as a replacement.",
          B: "The git branch with the most recent push.",
          C: "The offline ZIP repository.",
          D: "The ADT Console history.",
        },
        correct: "A",
        explanations: {
          A: "Correct — transports stay authoritative; treating a branch as the record is how the repo and system drift apart.",
          B: "Recency of a push does not confer authority.",
          C: "An offline ZIP is a convenience, not the system-of-record.",
          D: "Console history is ephemeral and irrelevant to governance.",
        },
        principle:
          "Transports remain the SAP source of truth; abapGit is parallel to them.",
      },
    ],
  },
};
