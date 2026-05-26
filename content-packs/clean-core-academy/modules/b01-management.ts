/* ------------------------------------------------------------------
   Module B1 — Clean Core for Management & Leads.

   Source brief: §1 (Foundations), §8 (ATC / governance) and §14
   (Capstone roadmap) of the Clean Core & HANA Readiness curriculum,
   synthesised for a NON-developer leadership audience. Plain language,
   no ABAP — the focus is the business case, the investment trade-offs
   of the 3-tier model, governance ownership, the migration roadmap,
   and the KPIs that prove progress. Every concept ships paragraphs +
   keyPoints + simplified.oneLiner and a 3-question conceptual quiz.
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
      label: "Frame the 3-tier extensibility model as an investment decision",
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
  ],
  blurb:
    "Clean Core for decision-makers: why it lowers the cost of change, how the 3-tier model is really an investment choice, who owns governance, the roadmap from zero to a clean bill of health, and the KPIs that prove you are getting there.",
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
      title: "The 3-tier model as an investment decision",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum (business synthesis)",
        paragraphs: [
          "SAP offers three tiers for building extensions, and each is really a different investment profile. Tier 1, key-user (in-app) extensibility, is done by business power users inside the application itself — adding fields or simple logic. It is the cheapest to own and the lowest risk because no classic development is involved.",
          "Tier 2, developer extensibility, is custom code that lives inside the SAP system but is written against the modern, supported rules. It needs developers, so it costs more than Tier 1, but it keeps the core clean for anything the in-app tools cannot do. Tier 3, side-by-side, runs the extension on a separate SAP Business Technology Platform (BTP) and connects back through published interfaces. It keeps the core cleanest of all but carries the highest cost to own, because you now operate a second runtime.",
          "The management rule is to pick the lowest tier that fully meets the requirement, and escalate only when you must. Reaching for Tier 3 when Tier 1 would do is over-engineering you will pay to run for years.",
        ],
        keyPoints: [
          "Tier 1 key-user (in-app): cheapest, lowest risk, done by power users — no developers.",
          "Tier 2 developer extensibility: in-system custom code on supported rules — moderate cost.",
          "Tier 3 side-by-side on BTP: cleanest core but highest cost to own (a second runtime).",
          "Always choose the lowest tier that fits the need; escalate only when forced.",
        ],
        examples: [
          {
            title: "Matching tier to need",
            variant: "neutral",
            body: "Adding a field to a screen is a Tier 1 decision. A custom transactional app over a custom table is Tier 2. A heavy custom service with its own release schedule is Tier 3 — and a bigger operating bill.",
          },
        ],
        simplified: {
          oneLiner:
            "The three extensibility tiers trade cost and risk — pick the lowest one (key-user, then developer, then side-by-side) that fully meets the need.",
          analogy:
            "Tier 1 is rearranging the furniture, Tier 2 is a permitted renovation, Tier 3 is building a separate annex with its own utilities bill.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Which tier is typically the cheapest to own and the lowest risk?",
            options: {
              A: "Tier 3 side-by-side on BTP.",
              B: "Tier 1 key-user (in-app) extensibility.",
              C: "Tier 2 developer extensibility.",
              D: "Classic modifications to standard.",
            },
            correct: "B",
            explanations: {
              A: "Side-by-side keeps the core cleanest but is the most expensive to operate.",
              B: "Correct — in-app key-user changes need no classic development and carry the least risk.",
              C: "Developer extensibility needs developers and costs more than Tier 1.",
              D: "Modifications are not a Clean Core option and carry the highest upgrade risk.",
            },
            principle:
              "Tier 1 in-app extensibility is the lowest-cost, lowest-risk option.",
          },
          {
            n: 2,
            question:
              "Why does Tier 3 (side-by-side on BTP) carry the highest cost to own?",
            options: {
              A: "It runs and is operated as a separate platform with its own lifecycle.",
              B: "It is the only tier that requires an SAP licence.",
              C: "It cannot be connected to S/4HANA at all.",
              D: "It is always slower than the other tiers.",
            },
            correct: "A",
            explanations: {
              A: "Correct — you gain the cleanest core but now operate a second runtime, which is an ongoing cost.",
              B: "All tiers operate within SAP licensing; this is not the cost driver.",
              C: "Side-by-side connects back through published interfaces — connection is the point.",
              D: "Performance is not what makes it the costliest to own.",
            },
            principle:
              "Side-by-side maximises core cleanliness at the price of a separate platform to run.",
          },
          {
            n: 3,
            question:
              "What is the guiding rule when choosing an extensibility tier?",
            options: {
              A: "Always choose Tier 3 for future-proofing.",
              B: "Always choose Tier 2 so developers stay busy.",
              C: "Pick the lowest tier that fully meets the requirement; escalate only when you must.",
              D: "Let each developer choose their preferred tier per task.",
            },
            correct: "C",
            explanations: {
              A: "Defaulting to Tier 3 means paying to operate a second runtime you may not need.",
              B: "Tier choice should follow the requirement, not staffing.",
              C: "Correct — the lowest sufficient tier minimises long-term cost and risk.",
              D: "Inconsistent per-task choices create a sprawl that is expensive to govern.",
            },
            principle:
              "Lowest-sufficient-tier is the cost-control principle of the model.",
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
          "Which extensibility tier is cheapest to own and lowest risk?",
        options: {
          A: "Tier 1 key-user (in-app) extensibility.",
          B: "Tier 3 side-by-side on BTP.",
          C: "Tier 2 developer extensibility.",
          D: "Classic modifications.",
        },
        correct: "A",
        explanations: {
          A: "Correct — in-app changes need no classic development and carry the least risk.",
          B: "Side-by-side is cleanest for the core but costliest to operate.",
          C: "Developer extensibility costs more than Tier 1.",
          D: "Modifications are not a Clean Core option.",
        },
        principle: "Pick the lowest tier that fits; Tier 1 is the cheapest.",
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
    ],
  },
};
