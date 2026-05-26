/* ------------------------------------------------------------------
   Module 14 — Delivering Clean Core: People, Conflict & Cadence.

   The developer/architect *delivery* lens over the technical machinery
   in module 8 (the Custom Code Migration loop, ATC variants, baselines)
   and module 13 (the 12-month roadmap, decoupling cockpit). Where those
   modules teach what to change, this one teaches how to run the change
   across teams: why it needs managing, how long it takes and what
   drives that, collaborating with other teams, resolving transport and
   priority conflict, prioritising the backlog, and the issues every
   programme hits with their resolutions. Process content — no ABAP — so
   examples are neutral; every SAP-specific claim reuses a fact already
   established (and verified) in modules 8/10/13/B1. Every concept ships
   paragraphs + keyPoints + simplified.oneLiner and a 3-question quiz
   with per-option explanations.
------------------------------------------------------------------ */

import type { Section } from "../_types";

export const m14Delivery: Section = {
  id: "m14-delivery",
  n: 14,
  title: "Delivering Clean Core: People, Conflict & Cadence",
  sourceCourse: "clean-core-curriculum (delivery synthesis)",
  audiences: ["intermediate", "expert", "admin"],
  skills: [
    {
      id: "m14-s1",
      label: "Justify Clean Core as a managed cross-team programme, not ad-hoc cleanup",
      conceptId: "m14-c1",
    },
    {
      id: "m14-s2",
      label: "Size a migration from measurable drivers and express duration as phases with exit criteria",
      conceptId: "m14-c2",
    },
    {
      id: "m14-s3",
      label: "Name the team interfaces (functional, Basis, security, SAP) and run handoffs with a shared definition of done",
      conceptId: "m14-c3",
    },
    {
      id: "m14-s4",
      label: "Prevent transport collisions and resolve priority friction with impersonal, pre-agreed rules",
      conceptId: "m14-c4",
    },
    {
      id: "m14-s5",
      label: "Prioritise the backlog by usage × standard-impact × cost, weighted by upgrade severity",
      conceptId: "m14-c5",
    },
    {
      id: "m14-s6",
      label: "Recognise the common programme issues and apply the known resolution for each",
      conceptId: "m14-c6",
    },
  ],
  blurb:
    "The delivery layer over modules 8 and 13: why Clean Core needs deliberate project management, how long it takes and what drives that, how to collaborate across teams, how to resolve transport and priority conflicts, how to prioritise the backlog, and the issues every programme hits — with the move that resolves each.",
  concepts: [
    {
      id: "m14-c1",
      code: "14.1",
      title: "Why Clean Core delivery has to be managed",
      bloom: "U",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum (delivery synthesis)",
        paragraphs: [
          "Clean Core is rarely a solo refactor. It is a cross-cutting programme that touches functional configuration, the Basis/transport landscape, security roles, integration partners, and live business processes. The technical moves — the Custom Code Migration loop in module 8, the roadmap in the module 13 capstone — only land if someone manages the dependencies between those teams, the sequencing across systems, and the people whose work changes. Treating it as 'just code cleanup' is the most common way these initiatives stall.",
          "The work also competes with the feature backlog. Without an explicit mandate, a named owner, and a slice of every sprint reserved for it, remediation is always the thing that slips. And Clean Core decays the moment new debt is added faster than old debt is cleared — the findings burndown from the management module (B1) is a trend, not a finish line — so the management job is continuous, not a one-off push.",
          "Most of the risk, finally, is organisational rather than technical: a transport collision between two teams, a business owner surprised by a behavioural change, an exemption nobody re-reviewed. The practices in this module exist to surface those risks early, while they are still cheap to fix.",
        ],
        keyPoints: [
          "Clean Core spans functional, Basis, security, integration, and business teams — it is not a solo refactor.",
          "It competes with the feature backlog, so it needs a named owner and reserved capacity or it slips.",
          "The burndown only stays down if remediation is continuous; new debt can outpace fixes.",
          "Most failure modes are organisational (collisions, surprises, stale exemptions), not coding errors.",
          "Managing the seams between teams is the core of delivery; the code change is the easy part.",
        ],
        simplified: {
          oneLiner:
            "Clean Core is a cross-team programme competing with the feature backlog — without a named owner, reserved capacity, and someone managing the seams between teams, it stalls.",
          analogy:
            "It's a city-wide road resurfacing, not patching your own driveway — most of the work is coordinating closures, detours, and the other crews.",
        },
        deeper: {
          paragraphs: [
            "Your instinct as a senior developer — that the risky part is the integration, not the isolated unit of code — applies here too. The hardest defects in a migration live at the boundaries: a released-API wrapper two teams both depend on, a transport that must travel with its DCL and behaviour definition, a Simplification Item that changes a table a downstream report silently relies on. Delivery management is the discipline of making those boundaries explicit and owned.",
          ],
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Why is Clean Core best treated as a managed programme rather than ad-hoc cleanup?",
            options: {
              A: "It is a cross-team effort competing with the feature backlog, so it needs a mandate and reserved capacity.",
              B: "SAP requires a certified project manager by licence.",
              C: "The code changes are too complex for developers to attempt.",
              D: "It only involves the ABAP team, so coordination is trivial.",
            },
            correct: "A",
            explanations: {
              A: "Correct — it spans teams and competes for capacity, so it needs explicit ownership and reserved effort.",
              B: "No licence mandates a project manager; the need is organisational, not contractual.",
              C: "Developers can do the code; the difficulty is coordination, not complexity.",
              D: "It is precisely not single-team — functional, Basis, security, and business are all involved.",
            },
            principle:
              "Clean Core spans teams and competes for capacity — it needs explicit ownership and reserved effort.",
          },
          {
            n: 2,
            question: "What most commonly causes a Clean Core initiative to stall?",
            options: {
              A: "The compiler rejecting released APIs.",
              B: "Running out of ATC variants to choose from.",
              C: "Remediation slipping because it competes with feature work and has no reserved capacity.",
              D: "Too few developers knowing modern ABAP syntax.",
            },
            correct: "C",
            explanations: {
              A: "Released APIs compile fine in a cloud package; that is the point of them.",
              B: "There is no shortage of variants; that is not a real failure mode.",
              C: "Correct — without reserved capacity and a named owner, remediation always loses to the feature backlog.",
              D: "Syntax is learnable and rarely the blocker; capacity and coordination are.",
            },
            principle:
              "Without reserved capacity and a named owner, remediation always loses to the feature backlog.",
          },
          {
            n: 3,
            question: "Where do a migration's hardest risks usually live?",
            options: {
              A: "In the choice of code editor and theme.",
              B: "At the boundaries between teams, systems, and dependencies.",
              C: "In the number of comments in the code.",
              D: "In the unit of code each developer writes alone.",
            },
            correct: "B",
            explanations: {
              A: "Editor choice is irrelevant to migration risk.",
              B: "Correct — the hardest defects live at the seams: shared wrappers, coupled transports, silent downstream dependencies.",
              C: "Comment count does not drive risk.",
              D: "Isolated units are the easy part; the danger is how they connect.",
            },
            principle:
              "The hardest migration risks live at the seams — boundaries between teams, transports, and dependencies.",
          },
        ],
      },
    },
    {
      id: "m14-c2",
      code: "14.2",
      title: "How long, and what drives it",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum (delivery synthesis)",
        paragraphs: [
          "There is no single answer to 'how long does Clean Core take.' The honest answer is a range driven by a few measurable factors, not a calendar pulled from thin air. The module 13 capstone anchors a realistic shape: a four-million-line custom codebase converting to S/4HANA 2023 is framed as a twelve-month programme. Smaller estates compress that; estates with heavy modifications and many integrations stretch it.",
          "The drivers that actually move the estimate are concrete: the volume of *live* custom code (from SCMON, not the raw inventory — a large fraction is usually dead), the number of direct modifications and BDC/GUI dependencies, the count of point-to-point integrations that must be re-pointed at released interfaces, and the share of the estate already on released APIs. Estimate from these, and re-estimate every sprint as the burndown reveals the real fix rate.",
          "Sizing is also sequencing. Because you scope by usage first (module 8's loop) and escalate ATC variants deliberately — DEFAULT, then readiness, then cloud — the timeline naturally falls into phases: a measurement-and-baseline phase, a high-value-remediation phase, and a steady-state gate phase. Communicating duration as phases with exit criteria is far more credible than a single end date.",
        ],
        keyPoints: [
          "There is no fixed duration — estimate from drivers, not a guessed calendar.",
          "Anchor: ~12 months for a 4M-LOC estate converting to S/4HANA 2023 (module 13); scale up or down from there.",
          "Drivers: live-code volume (SCMON), modifications, BDC/GUI dependencies, integration count, share already on released APIs.",
          "Re-estimate each sprint from the actual burndown fix rate.",
          "Express duration as phases with exit criteria (measure/baseline → remediate → steady-state gate), not one end date.",
        ],
        simplified: {
          oneLiner:
            "Don't guess a calendar — size from drivers (live code, modifications, integrations), anchored to the ~12-month / 4M-LOC capstone, and express it as phases with exit criteria you re-estimate each sprint.",
          analogy:
            "Estimating a migration from total lines of code is like quoting a house move by the size of the house, not the boxes you still use — measure what's live first.",
        },
        deeper: {
          paragraphs: [
            "Resist false precision. Senior stakeholders trust a range with named drivers ('12-18 months, driven by ~600k live lines and 40 integrations') far more than a confident single date that the first surprise will blow. Tie the estimate to the burndown KPI from module B1 so the forecast updates itself: a steady fix rate over three sprints makes the projection real; a volatile one signals a scoping or capacity problem to name now, not later.",
          ],
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "What is the most credible way to answer 'how long will Clean Core take'?",
            options: {
              A: "Quote a fixed industry-standard six months for everyone.",
              B: "Estimate from measurable drivers and express it as phases with exit criteria.",
              C: "Use the total line count of all custom code as the estimate.",
              D: "Decline to estimate until the work is already finished.",
            },
            correct: "B",
            explanations: {
              A: "A one-size figure ignores the drivers that actually vary the work.",
              B: "Correct — drivers plus phased exit criteria give a defensible, updatable estimate.",
              C: "Raw line count overstates the work because much custom code is dead.",
              D: "An estimate is needed to plan; refusing one is not an option for a programme.",
            },
            principle:
              "Size from measurable drivers and phase exit criteria, not a guessed single date.",
          },
          {
            n: 2,
            question: "Which figure does the course use as a sizing anchor?",
            options: {
              A: "Two weeks for any estate, regardless of size.",
              B: "Five years regardless of size.",
              C: "~12 months for a 4M-LOC estate converting to S/4HANA 2023.",
              D: "Exactly one sprint per million lines, fixed.",
            },
            correct: "C",
            explanations: {
              A: "Two weeks is unrealistic for a real migration.",
              B: "A fixed five years ignores estate size and live-code share.",
              C: "Correct — the module 13 capstone anchors ~12 months for a 4M-LOC conversion; scale from there.",
              D: "A fixed per-line rate ignores that much code is dead and drivers vary.",
            },
            principle:
              "The capstone anchors ~12 months for a 4M-LOC conversion; scale from there.",
          },
          {
            n: 3,
            question:
              "Why scope from SCMON live usage rather than the raw custom-code inventory when sizing?",
            options: {
              A: "SCMON counts lines of code faster than other tools.",
              B: "The inventory is encrypted and cannot be read.",
              C: "SCMON is the only tool that can compile ABAP.",
              D: "A large share of custom code is typically dead, so the inventory overstates the work.",
            },
            correct: "D",
            explanations: {
              A: "SCMON records execution, not a faster line count.",
              B: "The inventory is readable; that is not the reason.",
              C: "SCMON does not compile code; it logs usage.",
              D: "Correct — much custom code is never run, so live usage is the honest basis for sizing.",
            },
            principle:
              "Much custom code is dead; size from live usage, not the raw inventory.",
          },
        ],
      },
    },
    {
      id: "m14-c3",
      code: "14.3",
      title: "Collaborating across teams",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum (delivery synthesis)",
        paragraphs: [
          "A developer on a Clean Core programme has standing interfaces to at least four other groups, and naming them up front prevents most friction. Functional consultants own the business processes you must not silently change — you need them to confirm a remediation is behaviour-preserving, or to own the communication when it is not. Basis/DevOps own the transport landscape, the central ATC system, and the CI/CD gate (module 8's topology) — they decide when and how your changes move. Security owns the roles and authorization objects your DCL ties into (the capstone's PFCG-linked role). And where no released API exists, you escalate to SAP through the channel that requests an extension point or a new released object.",
          "The practical mechanism is a light RACI plus explicit handoffs: who is Responsible for a remediation, who Accountable signs it off, who must be Consulted (functional, security), and who is merely Informed (the business owner of a changed screen). The single most useful artefact is a shared definition of 'done' that reads: ATC-clean against the team's union variant, behaviour confirmed by the functional owner, and transport sequenced with Basis.",
          "Collaboration also means not surprising people. The capstone's communication plan and module B1's governance ownership exist precisely so a behavioural change reaches the affected business team before it ships, and so an exemption has a named approver rather than being a quiet developer decision.",
        ],
        keyPoints: [
          "Name your interfaces: functional (process owners), Basis/DevOps (transports, central ATC, CI gate), security (roles/auth objects), SAP (extension-point requests).",
          "Use a light RACI and explicit handoffs per remediation.",
          "Make 'done' shared: ATC-clean against the union variant, behaviour confirmed by the functional owner, transport sequenced with Basis.",
          "Never surprise a business owner — communicate behavioural change before it ships.",
          "Exemptions get a named approver (module B1 governance), not a quiet developer decision.",
        ],
        simplified: {
          oneLiner:
            "Name your interfaces to functional, Basis, security, and SAP up front; run handoffs with a light RACI and a shared 'done', and communicate behavioural changes before they ship.",
          analogy:
            "Like a kitchen on a busy night — food goes out smoothly only when each station knows the handoff; a brilliant line cook who ignores the pass still causes chaos.",
        },
        deeper: {
          paragraphs: [
            "Where no released API exists for something you genuinely need, the Clean Core answer is not to reach into an internal object — it is to raise the gap with SAP (an extension-point or released-API request) and to isolate the unavoidable legacy behind a single released wrapper in its own software component (module 1's boundary) while you wait. That keeps one documented, owned seam instead of a scatter of violations.",
          ],
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Which set of teams does a Clean Core developer typically interface with?",
            options: {
              A: "Only the database administrators.",
              B: "Functional consultants, Basis/DevOps, security, and SAP for extension points.",
              C: "Only other ABAP developers.",
              D: "Only end users of the Fiori apps.",
            },
            correct: "B",
            explanations: {
              A: "DBAs are one touchpoint at most, not the whole picture.",
              B: "Correct — delivery spans functional, Basis/DevOps, security, and SAP itself.",
              C: "Other developers are colleagues, but the cross-team interfaces are wider.",
              D: "End users matter for comms, but they are not the working interfaces.",
            },
            principle:
              "Clean Core delivery spans functional, Basis/DevOps, security, and SAP — name those interfaces.",
          },
          {
            n: 2,
            question:
              "What makes a shared 'definition of done' effective on a Clean Core remediation?",
            options: {
              A: "It only requires the code to compile.",
              B: "It is decided privately by each developer for their own work.",
              C: "It includes ATC-clean against the union variant, functional behaviour sign-off, and a Basis-sequenced transport.",
              D: "It is measured by the line count of the change.",
            },
            correct: "C",
            explanations: {
              A: "Compiling is necessary but far from sufficient for a behaviour-safe, governed change.",
              B: "A private 'done' defeats the point — it must be shared and consistent.",
              C: "Correct — it spans the variant gate, functional sign-off, and transport sequencing.",
              D: "Line count says nothing about correctness or upgrade safety.",
            },
            principle:
              "A shared 'done' spans the variant gate, functional sign-off, and transport sequencing.",
          },
          {
            n: 3,
            question:
              "When no released API exists for a needed capability, what is the collaborative Clean Core move?",
            options: {
              A: "Modify the SAP internal object directly to keep momentum.",
              B: "Abandon the requirement entirely.",
              C: "Copy the SAP standard code into your own package.",
              D: "Raise the gap with SAP and isolate any unavoidable legacy behind one released wrapper while you wait.",
            },
            correct: "D",
            explanations: {
              A: "Modifying internals is exactly the violation Clean Core removes.",
              B: "The requirement is real; the answer is to route it safely, not drop it.",
              C: "Copying standard code into your package is unmaintainable and still not released-safe.",
              D: "Correct — request the extension point and wrap unavoidable legacy behind one owned, released seam.",
            },
            principle:
              "Request the extension point from SAP and wrap unavoidable legacy behind one owned, released seam.",
          },
        ],
      },
    },
    {
      id: "m14-c4",
      code: "14.4",
      title: "Conflicts: transport collisions and team friction",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum (delivery synthesis)",
        paragraphs: [
          "Two kinds of conflict dominate a Clean Core programme, and they need different tools. The first is technical: transport collisions. Because remediation and feature work touch the same objects, two transports can race — and Clean Core objects are unforgiving, since a CDS view, its DCL access-control role, and a RAP behaviour definition must travel together or the target system gets a half-activated, broken object (module 10's transport gotcha). The remedy is sequencing and object-level ownership: agree who owns each object for the sprint, keep remediation transports small and frequently integrated, and let the CI/CD ATC gate (module 8) catch a collision before it reaches the next system.",
          "The second is human: friction over priorities and approach. A feature team sees remediation as a tax; an architect sees a shortcut as new debt. These are resolved not by argument but by the governance already defined — the union variant is the agreed rulebook, the baseline is the agreed line, and a new high-priority finding is a build-breaker by policy, not by someone's opinion in a review. When the rule is impersonal and pre-agreed, the conflict moves from 'you versus me' to 'does this pass the gate.'",
          "Where a genuine disagreement remains — a rewrite that is expensive this cycle — the escape valve is a time-boxed exemption with a named approver and an expiry (module B1), not a silent override. That converts an argument into a logged, reviewable decision.",
        ],
        keyPoints: [
          "Transport collisions: CDS + DCL + behaviour definition must travel together (module 10) — sequence and own objects per sprint.",
          "Keep remediation transports small and frequently integrated; let the CI/CD ATC gate catch collisions early.",
          "Resolve priority friction with impersonal pre-agreed rules: the union variant, the baseline, the build-breaker policy (modules 8 / B1).",
          "Move conflict from 'you versus me' to 'does it pass the gate.'",
          "Genuine disagreements become time-boxed exemptions with a named approver and an expiry — not silent overrides.",
        ],
        simplified: {
          oneLiner:
            "Sequence transports and own objects to avoid collisions (CDS + DCL + behaviour travel together); resolve priority friction with the impersonal gate, and log real disagreements as time-boxed exemptions.",
          analogy:
            "Good fences and a shared rulebook: clear object ownership stops collisions, and an agreed gate settles 'is this clean?' the way a referee settles a foul — not by who argues loudest.",
        },
        deeper: {
          paragraphs: [
            "The deeper move is to make the gate the authority before the conflict arises. Teams that agree the union variant and the build-breaker policy up front almost never argue in code review, because the standard is not a matter of taste. Teams that skip that step re-litigate every finding, and the loudest senior voice wins — which is exactly how inconsistent, ungovernable debt accumulates.",
          ],
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Why must a CDS view, its DCL role, and its behaviour definition be transported together?",
            options: {
              A: "Otherwise the target system gets a half-activated, broken object.",
              B: "To make the transport file smaller.",
              C: "Because SAP charges per transport request.",
              D: "To skip the ATC gate on the target system.",
            },
            correct: "A",
            explanations: {
              A: "Correct — these coupled artefacts activate broken if split, so they must travel as a unit.",
              B: "Transport size is not the concern; correct activation is.",
              C: "There is no per-transport charge driving this.",
              D: "Transport coupling has nothing to do with bypassing ATC.",
            },
            principle:
              "Coupled Clean Core artefacts must travel together or the target activates broken — sequence them.",
          },
          {
            n: 2,
            question:
              "How does the module recommend resolving friction over whether a change is 'clean enough'?",
            options: {
              A: "Let the most senior developer decide in review.",
              B: "Defer to impersonal pre-agreed rules — the union variant, baseline, and build-breaker policy.",
              C: "Skip ATC on that change to avoid the argument.",
              D: "Escalate every case to the CIO.",
            },
            correct: "B",
            explanations: {
              A: "Seniority deciding by opinion is exactly the inconsistency the gate removes.",
              B: "Correct — pre-agreed rules move the conflict from people to the gate.",
              C: "Skipping ATC abandons the standard entirely.",
              D: "Escalating everything does not scale and is not the mechanism.",
            },
            principle:
              "Pre-agreed rules (variant, baseline, build-breaker) move conflict from people to the gate.",
          },
          {
            n: 3,
            question:
              "What is the right way to handle a genuine disagreement where a rewrite is too costly this cycle?",
            options: {
              A: "Silently override the finding in the pipeline.",
              B: "Delete the ATC check that produced the finding.",
              C: "A time-boxed exemption with a named approver and an expiry.",
              D: "Leave it undocumented and revisit it never.",
            },
            correct: "C",
            explanations: {
              A: "A silent override hides the decision and erodes the gate.",
              B: "Deleting the check defeats governance for everyone.",
              C: "Correct — a logged, time-boxed exemption with an approver keeps it accountable.",
              D: "Undocumented deferral is how debt quietly re-accumulates.",
            },
            principle:
              "Real disagreements become logged, time-boxed exemptions with an approver — not silent overrides.",
          },
        ],
      },
    },
    {
      id: "m14-c5",
      code: "14.5",
      title: "Prioritising the backlog",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum (delivery synthesis)",
        paragraphs: [
          "A readiness scan on a real estate returns more findings than any team can fix at once, so prioritisation is the whole game — and the course already gives you the model. Module 8's migration loop prioritises on three axes: is the object actually *used* (SCMON), does it touch a *standard object the Simplification Items are changing*, and what is the *cost to fix*. The readiness self-audit applies the same logic at the practice level, weighting each risky pattern by how hard it blocks cloud adoption (direct table writes and modifications weigh most). Reuse that weighting rather than inventing a new one.",
          "The resulting rule of thumb: high-usage, standard-impacting, low-cost findings go first, because they retire the most upgrade risk per unit of effort. Unused code is a candidate for the decommission policy — mark, watch a cycle, delete (the capstone) — rather than remediation; the cheapest fix is the code you delete. The wrap-versus-rewrite decision (the decoupling-cockpit matrix) sequences the rest: wrap cheaply now where a released equivalent is far off, rewrite where the released API is ready.",
          "Make the priority visible. A single ordered list — deep-linked the way the readiness audit links each finding to the module that fixes it — keeps the team working worst-first instead of cherry-picking easy wins, and lets a lead defend why item B waits while item A ships.",
        ],
        keyPoints: [
          "Prioritise on used? × standard-impacting? × cost-to-fix (module 8), weighted by upgrade-blocking severity (the readiness audit).",
          "High-usage, standard-impacting, low-cost first — most upgrade risk retired per unit of effort.",
          "Unused code → decommission policy (mark, watch, delete), not remediation — deletion is the cheapest fix.",
          "Sequence the rest with wrap-versus-rewrite (the decoupling-cockpit matrix).",
          "Keep one visible, ordered, worst-first list so the team doesn't cherry-pick easy wins.",
        ],
        simplified: {
          oneLiner:
            "Reuse the course's own model — prioritise by used × standard-impacting × cost weighted by upgrade severity, delete dead code, sequence the rest wrap-versus-rewrite, and keep one visible worst-first list.",
          analogy:
            "Triage in an emergency room: treat by severity and survivability, not by who's easiest or who shouts — and don't operate on someone who has already left (dead code).",
        },
        deeper: {
          paragraphs: [
            "The trap is the 'easy wins' instinct. Clearing fifty trivial style findings feels productive but retires almost no upgrade risk, while one direct write to a standard table that an upgrade will break sits untouched. The weighting exists to resist that pull. If you have run the readiness self-audit, its prioritised remediation list is already your starting backlog — start there, not at the top of an alphabetical findings export.",
          ],
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question: "Which findings should generally be remediated first?",
            options: {
              A: "The ones that are quickest to type, regardless of impact.",
              B: "Whichever a developer finds most interesting that day.",
              C: "High-usage, standard-impacting, low-cost findings.",
              D: "The ones with the longest source code.",
            },
            correct: "C",
            explanations: {
              A: "Quick-to-type is the 'easy wins' trap; it retires little real risk.",
              B: "Interest is not a prioritisation axis.",
              C: "Correct — these retire the most upgrade risk per unit of effort.",
              D: "Length is not a measure of risk or value.",
            },
            principle:
              "Fix high-usage, standard-impacting, low-cost findings first — most risk retired per effort.",
          },
          {
            n: 2,
            question:
              "What is the cheapest way to 'fix' a finding in unused custom code?",
            options: {
              A: "Rewrite it to released APIs immediately.",
              B: "Retire it under the decommission policy — mark, watch a cycle, delete.",
              C: "Wrap it behind a released facade.",
              D: "Grant it a permanent exemption.",
            },
            correct: "B",
            explanations: {
              A: "Rewriting code nobody runs spends effort for no value.",
              B: "Correct — dead code is retired, not remediated; deletion is the cheapest fix.",
              C: "Wrapping unused code still maintains code nobody runs.",
              D: "A permanent exemption leaves dead, risky code in place forever.",
            },
            principle:
              "Dead code is retired, not remediated — deletion is the cheapest fix.",
          },
          {
            n: 3,
            question:
              "If you have completed the readiness self-audit, what is your starting backlog?",
            options: {
              A: "The audit's prioritised, severity-weighted remediation list.",
              B: "The alphabetical findings export, top to bottom.",
              C: "The largest programs first, by line count.",
              D: "Whatever the newest team member picks.",
            },
            correct: "A",
            explanations: {
              A: "Correct — the audit already orders findings worst-first and links each to its fix.",
              B: "Alphabetical order has no relationship to risk.",
              C: "Size is not risk; big programs may be rarely run.",
              D: "Random selection ignores the weighting entirely.",
            },
            principle:
              "The readiness audit's weighted remediation list is the ready-made starting backlog.",
          },
        ],
      },
    },
    {
      id: "m14-c6",
      code: "14.6",
      title: "The issues you'll hit, and the resolution playbook",
      bloom: "E",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum (delivery synthesis)",
        paragraphs: [
          "Most Clean Core programmes hit the same handful of problems, and naming them in advance turns each from a crisis into a known move. Scope creep / 'boil the ocean' — the team tries to fix everything at once and burns out — is resolved by the usage-scoped, phased plan and bounded reserved capacity. Exemption sprawl — exemptions accumulate until the baseline is meaningless — is resolved by mandatory expiry dates and a periodic renew-or-fix review. A stalled or rising burndown — new debt is added as fast as old debt is cleared — is resolved by tightening the build-breaker gate on *new* code so the inflow stops before you chase the backlog.",
          "Two more are organisational. Team resistance ('this is a tax') is resolved by making the value visible — the burndown and the celebrated 'C2 references eliminated' metric from module B1 — and by reserving capacity so remediation isn't unpaid overtime. The 'frozen for the upgrade' stand-off, where nobody dares touch anything, is resolved by the baseline itself, which makes it safe to keep shipping features because only *new* debt is gated.",
          "The meta-skill is to treat issues as a managed list with owners and review dates, exactly like findings. An issue without an owner and a next review is a surprise waiting to happen; an issue on the list with a named owner is just work. The same governance machinery that tracks code debt (modules 8 / B1) tracks delivery risk.",
        ],
        keyPoints: [
          "Scope creep → usage-scoped, phased plan with bounded reserved capacity.",
          "Exemption sprawl → mandatory expiry plus a periodic renew-or-fix review.",
          "Stalled/rising burndown → tighten the build-breaker gate on NEW code to stop the inflow first.",
          "Team resistance → make value visible (burndown, celebrated 'C2 eliminated' metric) and reserve capacity.",
          "'Frozen for the upgrade' → the baseline makes it safe to keep shipping; only new debt is gated.",
          "Track issues like findings: every issue gets an owner and a next review date.",
        ],
        simplified: {
          oneLiner:
            "Expect scope creep, exemption sprawl, a stalled burndown, resistance, and upgrade-freeze — each has a known move, and the meta-fix is to track delivery issues like ATC findings: owner, expiry, review.",
          analogy:
            "A pre-flight checklist: the emergencies are known and rehearsed, so when one happens you run the procedure instead of improvising.",
        },
        deeper: {
          paragraphs: [
            "The single highest-leverage move is to stop the inflow before chasing the backlog. A team that gates new debt as a build-breaker (module 8) but lets old debt sit will still see its burndown fall as features re-touch the code; a team that pours effort into the backlog while new violations stream past an open gate will watch the line flatten no matter how hard it works. Close the gate first, then drain the pool.",
          ],
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "A team's findings burndown has flattened despite steady remediation effort. What is the most likely cause and fix?",
            options: {
              A: "ATC is broken; reinstall it.",
              B: "New debt is being added as fast as it's cleared; tighten the build-breaker gate on new code.",
              C: "The team should delete the baseline and start over.",
              D: "The estate is simply too large to ever improve.",
            },
            correct: "B",
            explanations: {
              A: "A flat burndown is rarely a tooling fault; it is an inflow problem.",
              B: "Correct — close the gate on new code before chasing the backlog, or the line never moves.",
              C: "Deleting the baseline erases the record of accepted debt; it does not fix inflow.",
              D: "Size is not the cause; uncontrolled new debt is.",
            },
            principle:
              "A flat burndown means new-debt inflow — close the gate on new code before chasing the backlog.",
          },
          {
            n: 2,
            question: "How does the module recommend handling exemption sprawl?",
            options: {
              A: "Approve all exemptions permanently to save review time.",
              B: "Ban exemptions entirely.",
              C: "Mandatory expiry dates plus a periodic renew-or-fix review.",
              D: "Let each developer manage their own exemptions privately.",
            },
            correct: "C",
            explanations: {
              A: "Permanent approval is exactly how the baseline becomes meaningless.",
              B: "A total ban is impractical; some legacy genuinely needs deferral.",
              C: "Correct — expiry plus periodic review forces each exemption to be renewed or fixed.",
              D: "Private, unmanaged exemptions defeat governance.",
            },
            principle:
              "Exemptions need expiry and periodic review or the baseline loses meaning.",
          },
          {
            n: 3,
            question:
              "What makes it safe to keep shipping features during a migration instead of freezing the system?",
            options: {
              A: "Turning ATC off for the duration of the upgrade.",
              B: "The baseline — only new debt is gated, so existing debt doesn't block feature work.",
              C: "Refusing all transports for a year.",
              D: "Rewriting the entire estate before any feature ships.",
            },
            correct: "B",
            explanations: {
              A: "Turning ATC off removes the very safety the gate provides.",
              B: "Correct — the baseline gates only new debt, so feature work and remediation coexist.",
              C: "A transport freeze halts the business; it is not the answer.",
              D: "A full rewrite-first is the boil-the-ocean trap, not a safe path.",
            },
            principle:
              "The baseline lets feature work continue safely by gating only new debt.",
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
          "Why does Clean Core need deliberate delivery management rather than ad-hoc cleanup?",
        options: {
          A: "It is a single-team task with no dependencies.",
          B: "It is a cross-team programme competing with the feature backlog, so it needs ownership and reserved capacity.",
          C: "SAP licences mandate a project manager.",
          D: "The code is too hard for developers to write.",
        },
        correct: "B",
        explanations: {
          A: "It is the opposite of single-team — functional, Basis, security, and business are all involved.",
          B: "Correct — cross-team scope plus backlog competition demands explicit ownership and reserved effort.",
          C: "No licence mandates this; the need is organisational.",
          D: "The difficulty is coordination, not code complexity.",
        },
        principle:
          "Clean Core spans teams and competes for capacity — it needs ownership and reserved effort.",
      },
      {
        n: 2,
        question:
          "What is the most credible way to communicate how long a migration will take?",
        options: {
          A: "A single fixed end date, set once at kickoff.",
          B: "The total custom-code line count, converted to weeks.",
          C: "A flat industry figure that applies to every estate.",
          D: "Driver-based phases with exit criteria, re-estimated each sprint against the burndown.",
        },
        correct: "D",
        explanations: {
          A: "A single date ignores the drivers and breaks at the first surprise.",
          B: "Raw line count overstates the work because much code is dead.",
          C: "A flat figure ignores estate-specific drivers.",
          D: "Correct — phased exit criteria tied to the burndown give a defensible, updatable forecast.",
        },
        principle:
          "Express duration as driver-based phases with exit criteria, re-estimated against the burndown.",
      },
      {
        n: 3,
        question:
          "Why must coupled Clean Core artefacts (CDS view, DCL role, behaviour definition) be transported together?",
        options: {
          A: "Otherwise the target system activates a half-built, broken object.",
          B: "To reduce the number of transport requests for billing.",
          C: "To bypass the central ATC gate.",
          D: "Because DCL cannot exist in a transport at all.",
        },
        correct: "A",
        explanations: {
          A: "Correct — split coupled artefacts activate broken, so they must move as one unit.",
          B: "There is no billing motive; correctness is the reason.",
          C: "Coupling is unrelated to bypassing ATC.",
          D: "DCL is transportable; it just must travel with its view and behaviour.",
        },
        principle:
          "Coupled Clean Core artefacts must travel together or the target activates broken.",
      },
      {
        n: 4,
        question:
          "Which findings retire the most upgrade risk per unit of effort and should go first?",
        options: {
          A: "The shortest findings to type.",
          B: "Findings in code nobody runs.",
          C: "High-usage, standard-impacting, low-cost findings.",
          D: "Findings in the largest programs by line count.",
        },
        correct: "C",
        explanations: {
          A: "Quick-to-type is the easy-wins trap with little real impact.",
          B: "Unused code is retired, not prioritised for remediation.",
          C: "Correct — used, standard-impacting, cheap findings give the best risk-retired-per-effort.",
          D: "Size is not risk; large programs may be rarely executed.",
        },
        principle:
          "Prioritise high-usage, standard-impacting, low-cost findings first.",
      },
      {
        n: 5,
        question:
          "A burndown is flat despite hard remediation work. What does the playbook say to do first?",
        options: {
          A: "Delete the baseline and re-snapshot.",
          B: "Tighten the build-breaker gate on new code to stop the inflow.",
          C: "Accept that the estate cannot improve.",
          D: "Reassign the whole team to feature work.",
        },
        correct: "B",
        explanations: {
          A: "Re-snapshotting hides the problem; it does not stop new debt.",
          B: "Correct — close the gate on new code before draining the backlog, or the line never moves.",
          C: "Defeatism is not a resolution; the inflow is fixable.",
          D: "Abandoning remediation guarantees the burndown never falls.",
        },
        principle:
          "Stop new-debt inflow at the gate before chasing the backlog.",
      },
    ],
  },
};
