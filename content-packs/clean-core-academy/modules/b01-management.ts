/* ------------------------------------------------------------------
   Module B1 — Clean Core for Management & Leads.

   Source brief: §1 (Foundations), §8 (ATC / governance) and §14
   (Capstone roadmap) of the Clean Core & HANA Readiness curriculum,
   synthesised for a NON-developer leadership audience. Plain language,
   no ABAP — the focus is the business case, the investment trade-offs
   of the 3-tier model, governance ownership, the migration roadmap,
   the KPIs that prove progress, and the leadership view of running the
   programme (duration, cost, staffing, decision rights, conflict, and
   the issues to expect — the management lens on the m14 delivery
   module). Every concept ships paragraphs + keyPoints +
   simplified.oneLiner and a 3-question conceptual quiz.
------------------------------------------------------------------ */

import type { Section } from "../_types";

export const b01Management: Section = {
  id: "b01-management",
  n: 15,
  title: "Clean Core for Management & Leads",
  sourceCourse: "clean-core-curriculum (management synthesis)",
  audiences: ["management"],
  skills: [
    {
      id: "b01-s1",
      label: "Articulate the business case for Clean Core to a budget owner",
      conceptId: "b01-c1",
    },
    {
      id: "b01-s2",
      label: "Frame the extensibility approaches as an investment decision",
      conceptId: "b01-c2",
    },
    {
      id: "b01-s3",
      label: "Define the governance roles for variants, baselines, and exemptions",
      conceptId: "b01-c3",
    },
    {
      id: "b01-s4",
      label: "Sequence a migration roadmap from zero to ATC-green",
      conceptId: "b01-c4",
    },
    {
      id: "b01-s5",
      label: "Choose KPIs that make Clean Core progress visible",
      conceptId: "b01-c5",
    },
    {
      id: "b01-s6",
      label: "Size and fund the programme — a driver-based duration range and protected capacity",
      conceptId: "b01-c6",
    },
    {
      id: "b01-s7",
      label: "Set decision rights and pre-decide the response to the common programme issues",
      conceptId: "b01-c7",
    },
  ],
  blurb:
    "Clean Core for decision-makers: why it lowers the cost of change, how the extensibility approaches are really an investment choice, who owns governance, the roadmap from zero to a clean bill of health, the KPIs that prove you are getting there, and how to size, fund, and steer the programme — duration, decision rights, conflict, and the issues to expect.",
  concepts: [
    {
      id: "b01-c1",
      code: "M.1",
      title: "The business case for Clean Core",
      bloom: "U",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum (business synthesis)",
        paragraphs: [
          "Clean Core is the practice of keeping the standard SAP system (the 'core') untouched and building any custom needs beside it, using the official, supported connection points SAP publishes. When you do this, an upgrade or a new feature pack becomes a routine, low-drama event instead of a multi-month project to re-test and repair custom code.",
          "The business pays for custom code three times: once to build it, again every time an upgrade breaks it, and a third time in the innovation it cannot adopt because the system is frozen. Clean Core attacks the second and third costs directly — it lowers the total cost of change and shortens the time from 'SAP shipped something new' to 'we are using it.'",
          "For leadership the headline is simple: a clean core turns upgrades from a risk to be survived into a capability you can schedule. That predictability is what lets the organisation adopt SAP innovation on SAP's cadence rather than years behind it.",
        ],
        keyPoints: [
          "Clean Core keeps SAP standard untouched and puts custom needs beside it on supported connections.",
          "It converts upgrades from multi-month regression projects into routine, schedulable events.",
          "It lowers the total cost of change and speeds adoption of new SAP innovation.",
          "The payoff is predictability, not just tidier code.",
        ],
        examples: [
          {
            title: "Two upgrade experiences",
            variant: "neutral",
            body: "A clean-core team applies a feature pack over a weekend and goes live Monday. A team with heavy modifications spends three months re-testing custom code before they dare touch the same feature pack.",
          },
        ],
        simplified: {
          oneLiner:
            "Clean Core makes upgrades and new SAP features routine instead of risky, which lowers the long-term cost of change.",
          analogy:
            "It is the difference between a tenant who decorates with removable fittings and one who knocks down walls — only one can move out (or upgrade) easily.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question: "What is the headline business payoff of Clean Core?",
            options: {
              A: "Upgrades and feature packs become routine instead of multi-month regression projects.",
              B: "SAP licence fees are waived.",
              C: "The system needs less storage.",
              D: "Developers can stop writing custom code entirely.",
            },
            correct: "A",
            explanations: {
              A: "Correct — staying on supported connections lets SAP change the core without breaking your extensions, so upgrades become schedulable.",
              B: "Licensing is unaffected by Clean Core.",
              C: "Storage is unrelated to the business case.",
              D: "Clean Core allows custom code; it governs where that code sits.",
            },
            principle:
              "Clean Core buys upgrade predictability and a lower cost of change.",
          },
          {
            n: 2,
            question:
              "Why does the business effectively 'pay three times' for unmanaged custom code?",
            options: {
              A: "Build cost, hosting cost, and decommission cost.",
              B: "Licence, audit, and training cost.",
              C: "Build cost, repeated upgrade-repair cost, and forgone innovation.",
              D: "Hardware, network, and backup cost.",
            },
            correct: "C",
            explanations: {
              A: "Hosting and decommission are real but not the three costs Clean Core targets.",
              B: "These are unrelated to the upgrade-risk argument.",
              C: "Correct — you pay to build it, to repair it after every upgrade, and in the innovation a frozen system cannot adopt.",
              D: "Infrastructure costs are not the point of the Clean Core case.",
            },
            principle:
              "Custom code carries a recurring repair cost and an opportunity cost, not just a build cost.",
          },
          {
            n: 3,
            question:
              "Clean Core lets an organisation adopt SAP innovation on what timeline?",
            options: {
              A: "Only after a full system rebuild.",
              B: "Years behind SAP, regardless of practice.",
              C: "Whenever a third party certifies the code.",
              D: "On SAP's cadence, because upgrades stop being blocked by custom code.",
            },
            correct: "D",
            explanations: {
              A: "No rebuild is required — that is the opposite of the Clean Core promise.",
              B: "Falling years behind is the symptom Clean Core removes.",
              C: "No external certification gates innovation adoption.",
              D: "Correct — when upgrades are routine, new features can be taken up close to when SAP ships them.",
            },
            principle:
              "A clean core keeps the organisation current with SAP's release cadence.",
          },
        ],
      },
    },
    {
      id: "b01-c2",
      code: "M.2",
      title: "Extensibility approaches as an investment decision",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum (business synthesis)",
        paragraphs: [
          "SAP offers three approaches for building extensions, and each is really a different investment profile. Key-user (in-app) extensibility is done by business power users inside the application itself — adding fields or simple logic. It is the cheapest to own and the lowest risk because no classic development is involved.",
          "Developer extensibility is custom code that lives inside the SAP system but is written against the modern, supported rules (on-stack ABAP Cloud). It needs developers, so it costs more than key-user changes, but it keeps the core clean for anything the in-app tools cannot do. Side-by-side extensibility runs the extension on a separate SAP Business Technology Platform (BTP) and connects back through published interfaces. It is just as 'clean' for the core as the on-stack options — it is the right choice when an extension needs its own lifecycle or runtime — but it carries the highest cost to own, because you now operate a second platform.",
          "The management rule is to pick the lowest-effort approach that fully meets the requirement, and escalate only when you must. Reaching for side-by-side when a key-user change would do is over-engineering you will pay to run for years — but note that side-by-side is a deliberate, clean choice, not a fallback.",
        ],
        keyPoints: [
          "Key-user (in-app): cheapest, lowest risk, done by power users — no developers.",
          "Developer extensibility (on-stack ABAP Cloud): in-system custom code on supported rules — moderate cost.",
          "Side-by-side on BTP: just as clean for the core, the right choice for a separate lifecycle, but highest cost to own (a second platform).",
          "Always choose the lowest-effort approach that fits the need; escalate only when forced.",
        ],
        examples: [
          {
            title: "Matching tier to need",
            variant: "neutral",
            body: "Adding a field to a screen is a key-user decision. A custom transactional app over a custom table is developer extensibility. A heavy custom service with its own release schedule is side-by-side on BTP — and a bigger operating bill.",
          },
        ],
        simplified: {
          oneLiner:
            "The three extensibility approaches trade cost and risk — pick the lowest-effort one (key-user, then developer, then side-by-side) that fully meets the need; side-by-side is a clean choice for a separate lifecycle, not a penalty.",
          analogy:
            "Key-user is rearranging the furniture, developer extensibility is a permitted renovation, side-by-side is building a separate annex with its own utilities bill — all sound, just different costs.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Which approach is typically the cheapest to own and the lowest risk?",
            options: {
              A: "Side-by-side on BTP.",
              B: "Key-user (in-app) extensibility.",
              C: "Developer extensibility.",
              D: "Classic modifications to standard.",
            },
            correct: "B",
            explanations: {
              A: "Side-by-side is clean for the core but the most expensive to operate.",
              B: "Correct — in-app key-user changes need no classic development and carry the least risk.",
              C: "Developer extensibility needs developers and costs more than key-user changes.",
              D: "Modifications are not a Clean Core option and carry the highest upgrade risk.",
            },
            principle:
              "Key-user in-app extensibility is the lowest-cost, lowest-risk approach.",
          },
          {
            n: 2,
            question:
              "Why does side-by-side (on BTP) carry the highest cost to own?",
            options: {
              A: "It runs and is operated as a separate platform with its own lifecycle.",
              B: "It is the only approach that requires an SAP licence.",
              C: "It cannot be connected to S/4HANA at all.",
              D: "It is always slower than the other approaches.",
            },
            correct: "A",
            explanations: {
              A: "Correct — it is just as clean for the core, but you now operate a second platform, which is an ongoing cost.",
              B: "All approaches operate within SAP licensing; this is not the cost driver.",
              C: "Side-by-side connects back through published interfaces — connection is the point.",
              D: "Performance is not what makes it the costliest to own.",
            },
            principle:
              "Side-by-side is a clean approach whose cost is operating a separate platform.",
          },
          {
            n: 3,
            question:
              "What is the guiding rule when choosing an extensibility approach?",
            options: {
              A: "Always choose side-by-side for future-proofing.",
              B: "Always choose developer extensibility so developers stay busy.",
              C: "Pick the lowest-effort approach that fully meets the requirement; escalate only when you must.",
              D: "Let each developer choose their preferred approach per task.",
            },
            correct: "C",
            explanations: {
              A: "Defaulting to side-by-side means paying to operate a second platform you may not need.",
              B: "The choice should follow the requirement, not staffing.",
              C: "Correct — the lowest sufficient approach minimises long-term cost and risk.",
              D: "Inconsistent per-task choices create a sprawl that is expensive to govern.",
            },
            principle:
              "Lowest-sufficient-approach is the cost-control principle.",
          },
        ],
      },
    },
    {
      id: "b01-c3",
      code: "M.3",
      title: "Governance: variants, baselines, exemptions, ownership",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum (business synthesis)",
        paragraphs: [
          "Clean Core is enforced by an automated quality check SAP calls the ABAP Test Cockpit (ATC). The set of rules it applies is bundled into a named 'check variant' — think of it as the agreed rulebook. Someone must own that rulebook, because if everyone can change the rules, the standard means nothing.",
          "Existing systems start with years of accumulated issues, so teams take a 'baseline': a dated snapshot that says 'this is the debt we already have — only flag us for anything new.' A named owner also holds the baseline. Where a genuinely unavoidable issue remains, the team files an exemption, and a good exemption always carries three things: a reason, a validity date (when it expires), and an approver. Together those form an audit trail you can defend.",
          "The governance posture that actually works is to treat any new high-priority finding as a build-breaker — the change does not ship until it is fixed or formally exempted. Naming the owners of the variant, the baseline, and the exemption process is the single most important governance decision leadership makes.",
        ],
        keyPoints: [
          "The check variant is the agreed rulebook; it needs one named owner.",
          "A baseline is a dated snapshot of accepted existing debt — new issues still get flagged.",
          "Every exemption carries a reason, a validity date, and an approver — an audit trail.",
          "Treat new high-priority findings as build-breakers, not suggestions.",
        ],
        examples: [
          {
            title: "An exemption that survives an audit",
            variant: "neutral",
            body: "A finding is exempted with: reason ('legacy interface, rewrite scheduled Q4'), validity ('expires 31 Dec'), and approver (the named architecture lead). An auditor can see exactly who accepted what, and until when.",
          },
        ],
        simplified: {
          oneLiner:
            "Name an owner for the rulebook and the baseline, make every exemption carry a reason, an expiry, and an approver, and treat new high-priority findings as build-breakers.",
          analogy:
            "It is a building-code inspection: a fixed code, a record of pre-existing issues, and signed, time-limited waivers for anything not yet fixed.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question: "What does an ATC 'baseline' represent?",
            options: {
              A: "A list of approved developers.",
              B: "A backup of the production database.",
              C: "The minimum hardware specification.",
              D: "A dated snapshot of existing debt, so only new issues get flagged.",
            },
            correct: "D",
            explanations: {
              A: "A baseline is about findings, not people.",
              B: "It is not a database backup.",
              C: "Hardware is unrelated to a baseline.",
              D: "Correct — it accepts today's debt and focuses the team on preventing new debt.",
            },
            principle:
              "A baseline draws a line under existing debt so reviewers see only new findings.",
          },
          {
            n: 2,
            question: "What three things should every exemption carry?",
            options: {
              A: "A reason, a validity date, and an approver.",
              B: "A cost, a vendor, and a contract number.",
              C: "A developer name, a server, and a port.",
              D: "A priority, a colour, and a label.",
            },
            correct: "A",
            explanations: {
              A: "Correct — reason, validity, and approver together form a defensible audit trail.",
              B: "Procurement details are not what an exemption records.",
              C: "Technical addresses are irrelevant to an exemption.",
              D: "Cosmetic tags do not make an exemption auditable.",
            },
            principle:
              "Exemptions must be justified, time-bound, and approved — an audit trail.",
          },
          {
            n: 3,
            question:
              "What is the recommended governance posture toward a new high-priority finding?",
            options: {
              A: "Log it and revisit it next year.",
              B: "Treat it as a build-breaker — it does not ship until fixed or formally exempted.",
              C: "Delete the check that produced it.",
              D: "Let the individual developer decide whether to fix it.",
            },
            correct: "B",
            explanations: {
              A: "Deferring high-priority findings lets debt re-accumulate.",
              B: "Correct — making new high-priority findings block the change is what keeps the core clean over time.",
              C: "Removing the check defeats the purpose of governance.",
              D: "Consistency requires a policy, not per-developer discretion.",
            },
            principle:
              "New high-priority findings should block delivery until resolved or exempted.",
          },
        ],
      },
    },
    {
      id: "b01-c4",
      code: "M.4",
      title: "The migration roadmap (0 → ATC-green)",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum (business synthesis)",
        paragraphs: [
          "A move toward Clean Core is a sequenced programme, not a single switch. The first step is to measure what is actually used: SAP's usage logging (SCMON) shows which custom code real users run, so you scope effort around live code instead of a paper inventory. Code that nobody runs may simply be retired.",
          "Next, stage the automated checks from broad to strict. Teams typically run the general DEFAULT rulebook first, then the release-readiness variant (S4HANA_READINESS) to surface what an upgrade will break, then the strictest CLOUD variant for true Clean Core. You baseline the existing debt so the team only chases new issues, and you set a decommission policy so unused code is removed on a schedule rather than carried forever.",
          "Finally, plan the business communications. Some clean-up changes behaviour that end users will notice, so the roadmap must include who tells the business, and when. The destination — often described as 'ATC-green' — is a state where the agreed rulebook passes with no new high-priority findings.",
        ],
        keyPoints: [
          "Start by measuring live usage (SCMON) to scope around code people actually run.",
          "Stage the check variants: DEFAULT, then S4HANA_READINESS, then CLOUD.",
          "Baseline existing debt and set a decommission policy for unused code.",
          "Plan business communications for any change end users will notice.",
        ],
        examples: [
          {
            title: "A staged rollout",
            variant: "neutral",
            body: "Quarter 1: measure usage and baseline. Quarter 2: clear new DEFAULT findings. Quarter 3: pass S4HANA_READINESS and brief the business on two behavioural changes. Quarter 4: turn on the CLOUD variant for new work.",
          },
        ],
        simplified: {
          oneLiner:
            "Measure live usage first, stage the checks from broad to strict, baseline the old debt, retire unused code, and warn the business about any behaviour changes.",
          analogy:
            "It is a phased renovation with a survey first, a staged inspection schedule, and a notice to the residents before anything visible changes.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "What should be the FIRST step of a Clean Core migration roadmap?",
            options: {
              A: "Turn on the strictest CLOUD checks immediately.",
              B: "Delete all custom code and rebuild.",
              C: "Measure which custom code is actually used (SCMON) to scope the effort.",
              D: "Buy more hardware.",
            },
            correct: "C",
            explanations: {
              A: "Starting with the strictest rules floods the team before the scope is even known.",
              B: "A blanket rebuild discards working investment and is not the recommended start.",
              C: "Correct — usage measurement focuses effort on live code and reveals what can simply be retired.",
              D: "Hardware does not address custom-code readiness.",
            },
            principle:
              "Scope by real usage before you fix anything.",
          },
          {
            n: 2,
            question:
              "What is the recommended staging order for the ATC check variants?",
            options: {
              A: "CLOUD first, then S4HANA_READINESS, then DEFAULT.",
              B: "Only ever run CLOUD.",
              C: "Run them in random order per developer.",
              D: "DEFAULT, then S4HANA_READINESS, then CLOUD.",
            },
            correct: "D",
            explanations: {
              A: "Strict-to-broad overwhelms the team and hides upgrade-readiness signal.",
              B: "Jumping straight to CLOUD skips the upgrade-readiness checkpoint.",
              C: "Random order produces inconsistent, unmanageable results.",
              D: "Correct — broad (DEFAULT) to upgrade-readiness (S4HANA_READINESS) to strict (CLOUD) is the manageable progression.",
            },
            principle:
              "Stage checks from broad to strict so the team is never flooded.",
          },
          {
            n: 3,
            question:
              "Why does the roadmap include a business-communications plan?",
            options: {
              A: "To advertise the project to customers.",
              B: "Because some clean-up changes behaviour that end users will notice.",
              C: "Because SAP requires a press release.",
              D: "Because developers prefer email to meetings.",
            },
            correct: "B",
            explanations: {
              A: "External marketing is not the purpose of the plan.",
              B: "Correct — behavioural changes must be communicated to the affected business users in advance.",
              C: "No press release is mandated.",
              D: "The channel of communication is not the reason it is in the roadmap.",
            },
            principle:
              "Plan who tells the business, and when, about any behavioural change.",
          },
        ],
      },
    },
    {
      id: "b01-c5",
      code: "M.5",
      title: "Measuring progress (KPIs)",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum (business synthesis)",
        paragraphs: [
          "A Clean Core programme needs a small set of metrics leadership can read at a glance. The most important is the findings burndown: how the count of issues is falling against the baseline over time. A burndown that flattens or climbs is an early warning that new debt is being created faster than old debt is cleared.",
          "Two more metrics matter. The percentage of code that is 'cloud-ready' shows how much of the estate would survive the strictest checks today. And the count of eliminated uses of unreleased (C2) interfaces tracks the riskiest dependencies being removed — these are the connections most likely to break on an upgrade.",
          "There is a behavioural lesson worth applying: making 'C2 references eliminated' a visible team metric — a number on a wall, a leaderboard — drives adoption far more than a policy memo. People move what gets measured and celebrated.",
        ],
        keyPoints: [
          "Findings burndown against the baseline is the primary trend KPI.",
          "Percentage of code that is cloud-ready shows overall readiness.",
          "Count of eliminated unreleased (C2) interface uses tracks the riskiest dependencies.",
          "Making 'C2 references eliminated' visible drives adoption better than a memo.",
        ],
        examples: [
          {
            title: "A one-screen dashboard",
            variant: "neutral",
            body: "Three tiles: findings vs baseline (trending down), percent cloud-ready (rising), and C2 references eliminated this quarter (a celebrated running total). Leadership reads progress in ten seconds.",
          },
        ],
        simplified: {
          oneLiner:
            "Track the findings burndown, the percent of code cloud-ready, and the count of eliminated unreleased (C2) interface uses — and make that last number visible.",
          analogy:
            "It is a fitness tracker for the system: the trend line matters more than any single day's number.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "What does the 'findings burndown against the baseline' tell leadership?",
            options: {
              A: "Whether the issue count is falling over time relative to accepted debt.",
              B: "How many users are logged in.",
              C: "The size of the database in gigabytes.",
              D: "How fast the network is.",
            },
            correct: "A",
            explanations: {
              A: "Correct — it is the trend of issues relative to the baseline, and a flat or rising line is an early warning.",
              B: "User counts are unrelated to the burndown.",
              C: "Storage size is not a Clean Core progress metric.",
              D: "Network speed is irrelevant here.",
            },
            principle:
              "The burndown is the primary trend signal for the programme.",
          },
          {
            n: 2,
            question:
              "Why is 'count of eliminated unreleased (C2) interface uses' a valuable KPI?",
            options: {
              A: "It measures how many servers are online.",
              B: "It tracks removal of the riskiest dependencies most likely to break on upgrade.",
              C: "It counts the number of developers on the team.",
              D: "It reports the licence cost.",
            },
            correct: "B",
            explanations: {
              A: "Server counts are unrelated.",
              B: "Correct — unreleased (C2) interfaces are unstable across upgrades, so eliminating their use directly reduces upgrade risk.",
              C: "Team size is not what this KPI measures.",
              D: "Licensing is unrelated to the metric.",
            },
            principle:
              "Eliminating unreleased (C2) uses removes the dependencies most likely to break on upgrade.",
          },
          {
            n: 3,
            question:
              "What behavioural effect does making 'C2 references eliminated' a visible metric tend to have?",
            options: {
              A: "It slows the team down with reporting overhead.",
              B: "It has no measurable effect.",
              C: "It drives adoption more strongly than a policy memo.",
              D: "It increases licence consumption.",
            },
            correct: "C",
            explanations: {
              A: "A single visible number is light-weight, not heavy reporting.",
              B: "Visibility demonstrably shifts behaviour — that is the point.",
              C: "Correct — a visible, celebrated metric motivates the team more than a written policy.",
              D: "It has nothing to do with licence consumption.",
            },
            principle:
              "Teams move what is measured and celebrated.",
          },
        ],
      },
    },
    {
      id: "b01-c6",
      code: "M.6",
      title: "How long, what it costs, and how to staff it",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum (business synthesis)",
        paragraphs: [
          "'How long will this take and what will it cost' is the first question leadership asks, and the honest answer is a range tied to a few measurable drivers — not a fixed date. A useful anchor: a very large estate (around four million lines of custom code) moving to S/4HANA is typically framed as roughly a twelve-month programme, while a smaller or cleaner estate is much less. What moves the number is how much custom code is actually used (most organisations find a large share is dead and can simply be retired), how many modifications and old-style integrations exist, and how much is already on supported interfaces.",
          "The cost lever leadership actually controls is reserved capacity. Clean Core competes with the feature backlog, so if no team time is ring-fenced for it, it never happens. A small, steady, protected allocation — rather than an occasional heroic push — is both cheaper and more predictable, because it lets the work run as a routine cadence and keeps the findings burndown trending down instead of sawing up and down.",
          "Staff it as a thin, cross-functional team with named owners, not a side task bolted onto everyone's day job. The technical depth lives with the developers — the delivery module (m14) covers their side — while leadership's job is to fund the capacity, set the phases with clear exit criteria, and hold the duration as a living estimate that updates each sprint from the actual fix rate.",
        ],
        keyPoints: [
          "Duration is a driver-based range, not a fixed date — anchor ~12 months for a very large (~4M-LOC) estate, less for smaller or cleaner ones.",
          "The biggest sizing surprise is usually upside: much custom code is dead and can be retired, not migrated.",
          "The cost lever leadership controls is reserved, protected capacity — a steady cadence beats a heroic push.",
          "Fund a thin cross-functional team with named owners; don't run it as a side task.",
          "Hold the duration as a living estimate that updates from the burndown each sprint.",
        ],
        examples: [
          {
            title: "Steady capacity versus a heroic push",
            variant: "neutral",
            body: "Ring-fencing 15% of a team every sprint clears debt predictably and keeps the burndown falling; an annual two-week 'cleanup sprint' spikes, then the line climbs again as feature work re-adds debt.",
          },
        ],
        simplified: {
          oneLiner:
            "Give a driver-based range (≈12 months for a very large estate, less for smaller ones), expect much custom code to be dead and retirable, and fund a small protected capacity with named owners rather than a one-off push.",
          analogy:
            "It's funding regular building maintenance, not waiting for the roof to fall in — a small steady budget is cheaper and more predictable than an emergency rebuild.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "What is the most credible answer leadership can give to 'how long and how much'?",
            options: {
              A: "A fixed date and budget, set once at kickoff.",
              B: "A driver-based range, re-estimated each sprint from the actual fix rate.",
              C: "Whatever the largest vendor quotes.",
              D: "It cannot be estimated at all until the work is done.",
            },
            correct: "B",
            explanations: {
              A: "A single fixed figure ignores the drivers and breaks at the first surprise.",
              B: "Correct — a range tied to drivers and updated from the burndown is defensible and stays accurate.",
              C: "A vendor quote is not a substitute for sizing against your own estate.",
              D: "An estimate is needed to fund and plan; refusing one is not an option.",
            },
            principle:
              "State duration and cost as a driver-based range, updated from the burndown.",
          },
          {
            n: 2,
            question:
              "What is often the biggest positive surprise when scoping a Clean Core programme?",
            options: {
              A: "Custom code runs faster simply by being scoped.",
              B: "Upgrades become free of charge.",
              C: "No developers are needed at all.",
              D: "A large share of custom code is unused and can simply be retired.",
            },
            correct: "D",
            explanations: {
              A: "Scoping measures usage; it does not change runtime performance.",
              B: "Licensing and upgrade effort are not made free by Clean Core.",
              C: "Developers do the core of the work; they are very much needed.",
              D: "Correct — most estates carry a large dead fraction that is retired, not migrated, shrinking the job.",
            },
            principle:
              "Much custom code is dead and retirable — scoping usually shrinks the scope.",
          },
          {
            n: 3,
            question: "What is the main cost lever leadership directly controls?",
            options: {
              A: "Reserved, protected team capacity for the work.",
              B: "The version of ABAP the compiler uses.",
              C: "The colour scheme of the dashboards.",
              D: "The number of ATC variants in existence.",
            },
            correct: "A",
            explanations: {
              A: "Correct — ring-fenced capacity is the decision that makes the programme happen predictably.",
              B: "The language version is a technical setting, not a leadership cost lever.",
              C: "Dashboard styling has no bearing on cost or progress.",
              D: "Variant count is a technical detail, not a budget lever.",
            },
            principle:
              "Protected, reserved capacity is the cost lever leadership owns.",
          },
        ],
      },
    },
    {
      id: "b01-c7",
      code: "M.7",
      title: "Running the programme: decision rights, conflict, and issues",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum (business synthesis)",
        paragraphs: [
          "A Clean Core programme creates predictable tension between teams: feature teams feel remediation is a tax on their roadmap, architects worry that shortcuts add new debt, and the business worries about disruption. Leadership resolves this not by adjudicating each case but by setting decision rights in advance — who owns the rulebook (the check variant), who can approve an exception, and what automatically blocks a release. When the rules are agreed and impersonal, most conflicts settle themselves at the gate instead of escalating to a manager's desk.",
          "The collaboration model that works is a light operating rhythm: a single owner accountable for the programme, a short regular steering check on the burndown and the top risks, and a clear escalation path for the rare genuine deadlocks. The aim is to make the common decisions automatic — a new high-priority finding blocks the change — and reserve leadership attention for the rare trade-offs, such as a costly rewrite worth deferring this quarter.",
          "Expect a familiar set of issues and pre-decide the response: scope creep is answered by a phased plan with bounded capacity; exemptions piling up by giving every exception an expiry and a review; a burndown that stops falling by stopping new debt at the gate before chasing old debt; and team resistance by making progress visible and protecting the capacity so the work isn't unpaid overtime. Tracking these as a short, owned risk list — each with a named owner and a review date — is what separates a programme that finishes from one that quietly stalls.",
        ],
        keyPoints: [
          "Set decision rights up front: who owns the rulebook, who approves exceptions, what auto-blocks a release.",
          "Impersonal, pre-agreed rules settle most conflict at the gate, not on a manager's desk.",
          "Run a light cadence: one accountable owner, a short regular steering check on burndown + top risks, a clear escalation path.",
          "Make common decisions automatic; reserve leadership attention for rare, costly trade-offs.",
          "Pre-decide responses to the usual issues (scope creep, exemption sprawl, flat burndown, resistance) and track them as an owned risk list.",
        ],
        examples: [
          {
            title: "Decided by the rules, not the room",
            variant: "neutral",
            body: "A feature team and an architect disagree on whether a shortcut ships. Because a new high-priority finding is a pre-agreed build-breaker, the gate decides — and the only thing escalated is whether to grant a time-boxed, expiring exception.",
          },
        ],
        simplified: {
          oneLiner:
            "Set decision rights and an impersonal rulebook so conflicts settle at the gate, run a light steering cadence on the burndown and top risks, and pre-decide the response to the usual issues — tracked as an owned risk list.",
          analogy:
            "Govern it like a board with clear bylaws: most matters are decided by the rules automatically, and only the rare, genuinely contested item reaches the table.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "How should leadership resolve recurring conflict over whether work is 'clean enough'?",
            options: {
              A: "Adjudicate each disputed case personally as it arises.",
              B: "Pause all delivery until everyone reaches consensus.",
              C: "Set decision rights and an impersonal rulebook so most conflicts settle at the gate.",
              D: "Let whichever team is loudest decide.",
            },
            correct: "C",
            explanations: {
              A: "Deciding every case personally does not scale and politicises the standard.",
              B: "Pausing delivery halts the business and is not a resolution.",
              C: "Correct — pre-agreed rights and an impersonal gate settle most conflict without escalation.",
              D: "Loudest-wins is exactly the inconsistency the gate removes.",
            },
            principle:
              "Pre-agreed decision rights and an impersonal rulebook settle conflict at the gate.",
          },
          {
            n: 2,
            question: "What belongs on the leadership steering check?",
            options: {
              A: "Every individual code finding, reviewed one by one.",
              B: "The findings burndown and the top programme risks.",
              C: "The text editor each developer prefers.",
              D: "Nothing — steering is unnecessary once the rules are set.",
            },
            correct: "B",
            explanations: {
              A: "Findings are a developer-level detail, not a steering agenda.",
              B: "Correct — leadership steers on the trend (burndown) and the few risks that need decisions.",
              C: "Tooling preferences are irrelevant to steering.",
              D: "A light cadence is what keeps the programme from quietly stalling.",
            },
            principle:
              "Steer on the burndown trend and the top risks, not individual findings.",
          },
          {
            n: 3,
            question:
              "A programme's findings burndown has stopped falling. What is the leadership-level response?",
            options: {
              A: "Cancel the programme as unachievable.",
              B: "Remove the burndown metric from the dashboard.",
              C: "Double everyone's working hours indefinitely.",
              D: "Ensure new debt is stopped at the gate before chasing the existing backlog.",
            },
            correct: "D",
            explanations: {
              A: "A flat burndown is a fixable inflow problem, not a reason to cancel.",
              B: "Hiding the metric hides the problem; it does not solve it.",
              C: "Overwork is unsustainable and does not address new-debt inflow.",
              D: "Correct — close the gate on new debt first, or the backlog effort is cancelled out by fresh debt.",
            },
            principle:
              "A flat burndown means stop new-debt inflow at the gate before draining the backlog.",
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
        question: "The clearest one-line business case for Clean Core is…",
        options: {
          A: "it removes the need for any custom code.",
          B: "it makes the database smaller.",
          C: "it lowers SAP licence fees.",
          D: "it turns upgrades into routine, schedulable events and lowers the cost of change.",
        },
        correct: "D",
        explanations: {
          A: "Custom code is allowed; Clean Core governs where it sits.",
          B: "Database size is unrelated.",
          C: "Licensing is unaffected.",
          D: "Correct — predictable upgrades and a lower cost of change are the core case.",
        },
        principle: "Clean Core buys upgrade predictability and lower change cost.",
      },
      {
        n: 2,
        question:
          "Which extensibility approach is cheapest to own and lowest risk?",
        options: {
          A: "Key-user (in-app) extensibility.",
          B: "Side-by-side on BTP.",
          C: "Developer extensibility.",
          D: "Classic modifications.",
        },
        correct: "A",
        explanations: {
          A: "Correct — in-app changes need no classic development and carry the least risk.",
          B: "Side-by-side is clean for the core but costliest to operate.",
          C: "Developer extensibility costs more than key-user changes.",
          D: "Modifications are not a Clean Core option.",
        },
        principle: "Pick the lowest-effort approach that fits; key-user is the cheapest.",
      },
      {
        n: 3,
        question: "A defensible exemption always records…",
        options: {
          A: "a server name, a port, and a developer.",
          B: "a vendor, a contract, and a cost.",
          C: "a reason, a validity date, and an approver.",
          D: "a colour, a label, and a priority.",
        },
        correct: "C",
        explanations: {
          A: "Technical addresses do not make an exemption auditable.",
          B: "Procurement details are not what an exemption captures.",
          C: "Correct — reason, validity, and approver form the audit trail.",
          D: "Cosmetic tags are not an audit trail.",
        },
        principle: "Exemptions must be justified, time-bound, and approved.",
      },
      {
        n: 4,
        question:
          "What is the correct staging order for the ATC check variants on a migration?",
        options: {
          A: "CLOUD, then DEFAULT, then S4HANA_READINESS.",
          B: "DEFAULT, then S4HANA_READINESS, then CLOUD.",
          C: "S4HANA_READINESS only.",
          D: "Whatever order each developer prefers.",
        },
        correct: "B",
        explanations: {
          A: "Starting strict overwhelms the team and hides the readiness signal.",
          B: "Correct — broad to upgrade-readiness to strict is the manageable progression.",
          C: "Skipping the broad and strict stages leaves gaps.",
          D: "Inconsistent ordering produces unmanageable results.",
        },
        principle: "Stage checks broad-to-strict: DEFAULT, S4HANA_READINESS, CLOUD.",
      },
      {
        n: 5,
        question:
          "Which is the primary trend KPI for a Clean Core programme?",
        options: {
          A: "The findings burndown against the baseline.",
          B: "The number of logged-in users.",
          C: "The licence cost per month.",
          D: "The size of the database.",
        },
        correct: "A",
        explanations: {
          A: "Correct — the burndown shows whether debt is falling faster than new debt appears.",
          B: "User counts are unrelated.",
          C: "Licence cost is not a readiness metric.",
          D: "Database size is irrelevant to progress.",
        },
        principle: "The findings burndown is the headline progress signal.",
      },
      {
        n: 6,
        question:
          "What is the most credible way for leadership to communicate duration and cost?",
        options: {
          A: "A single fixed date and budget at kickoff.",
          B: "A driver-based range, re-estimated each sprint from the actual fix rate.",
          C: "The largest vendor's quote.",
          D: "The total custom-code line count converted to months.",
        },
        correct: "B",
        explanations: {
          A: "A single fixed figure ignores the drivers and breaks at the first surprise.",
          B: "Correct — a driver-based range tied to the burndown is defensible and stays accurate.",
          C: "A vendor quote is no substitute for sizing against your own estate.",
          D: "Raw line count overstates the work because much code is dead.",
        },
        principle: "Communicate duration and cost as a driver-based range, updated from the burndown.",
      },
      {
        n: 7,
        question:
          "How should leadership resolve recurring conflict over whether a change is clean enough?",
        options: {
          A: "Adjudicate each case personally.",
          B: "Pause all delivery until consensus is reached.",
          C: "Let the loudest team decide.",
          D: "Set decision rights and an impersonal rulebook so it settles at the gate.",
        },
        correct: "D",
        explanations: {
          A: "Deciding every case personally does not scale and politicises the standard.",
          B: "Pausing delivery halts the business and is not a resolution.",
          C: "Loudest-wins is the inconsistency the gate exists to remove.",
          D: "Correct — pre-agreed decision rights and an impersonal gate settle most conflict without escalation.",
        },
        principle: "Pre-agreed decision rights and an impersonal rulebook settle conflict at the gate.",
      },
    ],
  },
};
