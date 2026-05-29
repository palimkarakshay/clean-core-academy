/* ------------------------------------------------------------------
   Module 11 — Advanced Techniques & Lesser-Known APIs.

   Source brief: §11 of the Clean Core & HANA Readiness curriculum.
   Audience: every tier including admins — the high-leverage techniques
   that rarely get written down: modern language features, ADT tooling,
   released helper classes you'd otherwise implement by hand, operations
   touchpoints, the subtler Clean Core release mechanics, and the numeric
   types that quietly decide correctness. Each concept ships paragraphs +
   keyPoints + simplified.oneLiner and a 3-question quiz with per-option
   explanations; code-relevant concepts add examples (lowercase, real
   ABAP / CDS).
------------------------------------------------------------------ */

import type { Section } from "../_types";

export const m11DidYouKnow: Section = {
  id: "m11-did-you-know",
  n: 11,
  title: "Advanced Techniques & Lesser-Known APIs",
  sourceCourse: "clean-core-curriculum §11",
  audiences: ["new", "intermediate", "expert", "admin"],
  skills: [
    {
      id: "m11-s1",
      label: "Use IS INSTANCE OF, SWITCH on strings, CDS let/cast and conversion built-ins for cleaner code",
      conceptId: "m11-c1",
    },
    {
      id: "m11-s2",
      label: "Drive ADT faster: command palette, ATC Quick Fix, abapGit Explorer, Open Type across ABAP+CDS",
      conceptId: "m11-c2",
    },
    {
      id: "m11-s3",
      label: "Reach for released helper APIs (gzip, base64, HMAC, URL coding, parallel) instead of hand-rolling",
      conceptId: "m11-c3",
    },
    {
      id: "m11-s4",
      label: "Know the operations touchpoints: RZ70 SLD, SE63 translation, the Release Information Note per FPS",
      conceptId: "m11-c4",
    },
    {
      id: "m11-s5",
      label: "Read the release state of a USE, the 'Replaced By' successor, and the green-light release status",
      conceptId: "m11-c5",
    },
    {
      id: "m11-s6",
      label: "Pick the right number type: DECFLOAT for money, explicit DECIMALS, INT8, UTCLONG for timestamps",
      conceptId: "m11-c6",
    },
  ],
  blurb:
    "Small, high-leverage techniques that save real time and prevent quiet correctness bugs — the things experienced developers wish they’d known sooner. Modern language features, ADT (SAP’s modern editor) tooling shortcuts, released helper classes you’d otherwise implement by hand, the operations touchpoints, the subtler Clean Core release mechanics, and the numeric types that quietly decide whether money adds up.",
  concepts: [
    {
      id: "m11-c1",
      code: "11.1",
      title: "Lesser-known language features",
      bloom: "U",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §11.1",
        paragraphs: [
          "IS INSTANCE OF is the type-safe gate for downcasts, and the detail most developers miss is that it accepts a *class or an interface*. Guarding a CAST with `if obj is instance of zif_serializable` lets you narrow to an interface reference without risking the CX_SY_MOVE_CAST_ERROR that a naked CAST throws when the object doesn't implement it. It turns a runtime exception into a branch you control.",
          "Two more expressions remove boilerplate. SWITCH works on *strings*, not just numeric or enumerated values, so a chain of IF/ELSEIF on a character field collapses into one readable expression. And in CDS, `cast( expr as abap.fltp )` forces the cast on the database side — the canonical use is integer division, where casting an operand to floating point before dividing avoids the truncation you would otherwise get from integer arithmetic pushed to HANA.",
          "CDS also ships SQL functions that replace whole function-module calls. currency_conversion( ) and unit_conversion( ) do on the database what most ABAP still does by calling BAPI_CURRENCY_CONV_TO_INTERNAL; concat_with_space( ) joins strings with a separator; and coalesce( a, b ) returns the first non-null argument — standard SQL, fully pushed down. `let ... in` lets you name a reusable expression once inside a single view. Reaching for these keeps logic declarative and out of ABAP loops.",
        ],
        keyPoints: [
          "IS INSTANCE OF accepts a class OR an interface — guard CASTs with it to avoid CX_SY_MOVE_CAST_ERROR.",
          "SWITCH works on strings, collapsing IF/ELSEIF chains on character fields.",
          "CDS `cast( expr as abap.fltp )` forces DB-side float casts — the fix for integer-division precision.",
          "CDS built-ins currency_conversion / unit_conversion / concat_with_space / coalesce push logic down instead of calling FMs.",
        ],
        examples: [
          {
            title: "Safe downcast with IS INSTANCE OF",
            variant: "after",
            lang: "ABAP",
            body: "The guard means the CAST only runs when the object really implements the interface — no move-cast dump.",
            code: [
              "if lo_object is instance of zif_serializable.",
              "  data(serial) = cast zif_serializable( lo_object ).",
              "endif.",
            ].join("\n"),
          },
          {
            title: "SWITCH on a string",
            variant: "neutral",
            lang: "ABAP",
            body: "One expression replaces an IF/ELSEIF ladder over a character field.",
            code: [
              "data(lv) = switch string( country",
              "             when 'CA' then 'Canada'",
              "             else 'Other' ).",
            ].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "IS INSTANCE OF guards a downcast against a class OR interface so it never dumps, SWITCH works on strings, and CDS has built-in conversion functions most devs still call FMs for.",
          analogy:
            "IS INSTANCE OF is checking a key fits the lock before turning it, instead of forcing it and snapping it off.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question: "What can the operand of IS INSTANCE OF be?",
            options: {
              A: "Only a final class.",
              B: "A class or an interface.",
              C: "Only an interface.",
              D: "Only a DDIC structure.",
            },
            correct: "B",
            explanations: {
              A: "It is not restricted to final classes.",
              B: "Correct — IS INSTANCE OF tests against a class or an interface, which is what makes it a safe pre-cast guard.",
              C: "It is not limited to interfaces; classes work too.",
              D: "It checks object types, not DDIC structures.",
            },
            principle:
              "IS INSTANCE OF works for both classes and interfaces — use it to guard downcasts.",
          },
          {
            n: 2,
            question:
              "In CDS, why wrap an operand in `cast( ... as abap.fltp )` before a division?",
            options: {
              A: "To force a database-side float cast and avoid integer-division truncation.",
              B: "To round the result to two decimals.",
              C: "To convert the column to a string.",
              D: "It has no effect on arithmetic.",
            },
            correct: "A",
            explanations: {
              A: "Correct — casting an operand to abap.fltp on the DB side makes the division floating-point, avoiding the truncation of integer arithmetic.",
              B: "It does not round to a fixed number of decimals.",
              C: "fltp is a floating-point cast, not a string conversion.",
              D: "It directly changes how the division is computed.",
            },
            principle:
              "Cast an operand to abap.fltp in CDS to get floating-point (not truncated integer) division.",
          },
          {
            n: 3,
            question:
              "Which CDS built-in returns the first non-null value among its arguments?",
            options: {
              A: "concat_with_space( )",
              B: "currency_conversion( )",
              C: "coalesce( )",
              D: "unit_conversion( )",
            },
            correct: "C",
            explanations: {
              A: "concat_with_space joins strings with a separator.",
              B: "currency_conversion converts amounts between currencies.",
              C: "Correct — coalesce( a, b, ... ) returns the first non-null argument, standard SQL pushed down by CDS.",
              D: "unit_conversion converts quantities between units of measure.",
            },
            principle:
              "coalesce( ) returns the first non-null argument — a pushed-down CDS built-in.",
          },
        ],
      },
    },
    {
      id: "m11-c2",
      code: "11.2",
      title: "ADT productivity features",
      bloom: "U",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §11.2",
        paragraphs: [
          "The single biggest ADT productivity win that most teams never enable is the Eclipse command palette on Ctrl+3. It accepts partial command names — type 'abap repo' and it surfaces every ABAP Repository command — so you can invoke almost any action without hunting through menus. It is the keyboard-first front door to the entire IDE.",
          "ATC is not only a reporter. Many findings carry an 'Apply Quick Fix' action: right-click the finding and ATC *writes the corrected source for you* — replacing an obsolete construct, inlining a declaration, swapping a deprecated call for its successor. Treating ATC findings as fixable-in-place rather than as a backlog to hand-edit changes the economics of a cleanup sprint.",
          "Two navigation tools round it out. The abapGit Explorer view shows uncommitted changes across *all* linked repositories at once — a git-status-across-many-repos overview that catches the object you forgot to stage in another repo. And Open Type (Ctrl+Shift+T) resolves global classes, interfaces, *and* CDS entities by name far faster than navigating SE80, jumping you straight to the object across both the ABAP and CDS worlds.",
        ],
        keyPoints: [
          "Ctrl+3 opens the Eclipse command palette — partial command names invoke almost any ADT action.",
          "ATC 'Apply Quick Fix' writes the corrected source for you — findings are often fixable in place.",
          "abapGit Explorer shows uncommitted changes across all linked repos at once.",
          "Open Type (Ctrl+Shift+T) resolves classes, interfaces AND CDS entities by name, faster than SE80.",
        ],
        examples: [
          {
            title: "Quick Fix, not hand-edit",
            variant: "neutral",
            body: "Right-click an ATC finding (e.g. an obsolete DESCRIBE TABLE LINES) and choose Apply Quick Fix — ATC rewrites it to lines( itab ) in the source, no manual editing.",
          },
        ],
        simplified: {
          oneLiner:
            "Ctrl+3 is a command palette for all of ADT, and ATC's Apply Quick Fix writes the corrected code for you instead of just flagging it.",
          analogy:
            "ATC Quick Fix is spell-check's 'Replace' button, not just the red squiggle under the word.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question: "What does the Eclipse Ctrl+3 command palette do in ADT?",
            options: {
              A: "Opens a SQL console.",
              B: "Accepts partial command names to invoke almost any ADT action.",
              C: "Runs ATC on the current object.",
              D: "Toggles the debugger.",
            },
            correct: "B",
            explanations: {
              A: "It is not a SQL console; that is a different ADT view.",
              B: "Correct — Ctrl+3 is a fuzzy command palette; typing a partial name surfaces and runs matching commands.",
              C: "Running ATC is one possible command, but the palette is general-purpose.",
              D: "It does not toggle the debugger.",
            },
            principle:
              "Ctrl+3 is ADT's command palette — keyboard-first access to nearly every action.",
          },
          {
            n: 2,
            question: "Beyond reporting a finding, what can ATC's 'Apply Quick Fix' do?",
            options: {
              A: "Nothing — it only describes the finding.",
              B: "Open a support ticket.",
              C: "Write the corrected source code for you.",
              D: "Permanently exempt the finding.",
            },
            correct: "C",
            explanations: {
              A: "It does more than describe; it can rewrite the code.",
              B: "It does not file tickets.",
              C: "Correct — for many findings Apply Quick Fix edits the source in place, applying the corrected construct.",
              D: "Exemption is a separate workflow; Quick Fix changes the code instead.",
            },
            principle:
              "ATC Apply Quick Fix writes the fix into the source, not just a description.",
          },
          {
            n: 3,
            question:
              "Open Type (Ctrl+Shift+T) in ADT resolves which kinds of objects?",
            options: {
              A: "Only global classes.",
              B: "Only CDS entities.",
              C: "Only function modules.",
              D: "Classes, interfaces, and CDS entities by name.",
            },
            correct: "D",
            explanations: {
              A: "It covers more than classes.",
              B: "It is not limited to CDS.",
              C: "It is not limited to function modules.",
              D: "Correct — Open Type jumps to global classes, interfaces and CDS entities by name, spanning both the ABAP and CDS worlds.",
            },
            principle:
              "Open Type resolves classes, interfaces and CDS entities by name across ABAP and CDS.",
          },
        ],
      },
    },
    {
      id: "m11-c3",
      code: "11.3",
      title: "Lesser-known released APIs",
      bloom: "U",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §11.3",
        paragraphs: [
          "A surprising amount of plumbing is already released, so hand-rolling it is both wasted effort and a Clean Core risk. CL_ABAP_GZIP does in-stack gzip compression and decompression without any external library; CL_ABAP_BASE64 encodes and decodes Base64 without pulling in a JSON helper just for its codec; and CL_ABAP_HMAC computes keyed message authentication codes for signing and verification. These are released, supported, and upgrade-stable — exactly the contract Clean Core wants.",
          "For web work, CL_HTTP_UTILITY provides URL encoding and decoding (escaping query parameters and form fields correctly), which developers too often reimplement by hand and get subtly wrong on edge characters. Using the released utility means the escaping matches what every other layer expects.",
          "The one that changes how you write concurrent code is CL_ABAP_PARALLEL. It is the released parallel-processing helper (broadly available in 758) that replaces hand-rolled aRFC plus WAIT UNTIL bookkeeping: you supply the units of work and it manages the fan-out and the join. Beyond saving code, it keeps parallelism inside a released, Clean-Core-compliant contract instead of low-level constructs that the cloud language version may forbid.",
        ],
        keyPoints: [
          "CL_ABAP_GZIP (gzip), CL_ABAP_BASE64 (Base64), CL_ABAP_HMAC (keyed MAC) are released — don't hand-roll them.",
          "CL_HTTP_UTILITY does correct URL encode/decode — stop reimplementing escaping by hand.",
          "CL_ABAP_PARALLEL is the released parallel-processing helper that replaces hand-rolled aRFC + WAIT UNTIL.",
          "Using released helpers keeps the work upgrade-stable and Clean-Core-compliant.",
        ],
        examples: [
          {
            title: "Released parallelism over hand-rolled WAIT",
            variant: "after",
            lang: "ABAP",
            body: "CL_ABAP_PARALLEL manages fan-out and join for you, replacing manual aRFC calls paired with WAIT UNTIL counters.",
            code: [
              "data(lo_par) = new cl_abap_parallel( ).",
              '" supply work packages; the helper schedules and joins them',
            ].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "gzip, Base64, HMAC, URL coding and parallel processing are all already released classes — using them beats hand-rolling and keeps you Clean-Core-compliant.",
          analogy:
            "These are tools already in the standard toolbox — soldering your own is slower and voids the warranty (upgrade safety).",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Which released class replaces hand-rolled aRFC + WAIT UNTIL for parallel processing?",
            options: {
              A: "CL_ABAP_PARALLEL.",
              B: "CL_ABAP_GZIP.",
              C: "CL_HTTP_UTILITY.",
              D: "CL_ABAP_HMAC.",
            },
            correct: "A",
            explanations: {
              A: "Correct — CL_ABAP_PARALLEL is the released helper that manages fan-out and join, replacing manual aRFC + WAIT UNTIL.",
              B: "CL_ABAP_GZIP does compression, not parallelism.",
              C: "CL_HTTP_UTILITY handles URL encode/decode.",
              D: "CL_ABAP_HMAC computes keyed MACs.",
            },
            principle:
              "CL_ABAP_PARALLEL is the released parallel-processing helper — prefer it over hand-rolled WAIT loops.",
          },
          {
            n: 2,
            question: "Which released class would you use for correct URL encoding and decoding?",
            options: {
              A: "CL_ABAP_BASE64.",
              B: "CL_HTTP_UTILITY.",
              C: "CL_ABAP_GZIP.",
              D: "CL_ABAP_PARALLEL.",
            },
            correct: "B",
            explanations: {
              A: "CL_ABAP_BASE64 does Base64, not URL escaping.",
              B: "Correct — CL_HTTP_UTILITY provides released URL encode/decode, so you don't reimplement escaping by hand.",
              C: "CL_ABAP_GZIP is for compression.",
              D: "CL_ABAP_PARALLEL is for parallel processing.",
            },
            principle:
              "CL_HTTP_UTILITY provides released URL encode/decode.",
          },
          {
            n: 3,
            question:
              "What is the Clean Core advantage of using these released helper classes instead of hand-rolled code?",
            options: {
              A: "They run only in the debugger.",
              B: "They disable ATC.",
              C: "They are released and upgrade-stable, keeping the work Clean-Core-compliant.",
              D: "They are faster only on AnyDB.",
            },
            correct: "C",
            explanations: {
              A: "They run in normal execution, not only under the debugger.",
              B: "They have no effect on whether ATC runs.",
              C: "Correct — being released (C1) makes them upgrade-stable and compliant, unlike hand-rolled or unreleased constructs.",
              D: "Their value is contract stability, not an AnyDB-only speed-up.",
            },
            principle:
              "Released helper classes are upgrade-stable contracts — preferring them keeps code Clean-Core-compliant.",
          },
        ],
      },
    },
    {
      id: "m11-c4",
      code: "11.4",
      title: "Operations touchpoints",
      bloom: "U",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §11.4",
        paragraphs: [
          "Some operations touchpoints get blamed on Basis but every developer benefits from knowing they exist. RZ70 registers a system with the System Landscape Directory (SLD) — the registration that makes a system discoverable for integration and monitoring scenarios. Knowing where SLD registration lives turns a mysterious 'the system isn't showing up' into a concrete, fixable step.",
          "Translation is a development responsibility, not an afterthought. SE63 is the translation environment, and the point most teams miss is that *extension* texts — the labels, messages and short texts your Z objects ship — need translating exactly like SAP standard texts. A Clean-Core-compliant extension that is monolingual is incomplete in a multi-language landscape; SE63 is where that gap gets closed.",
          "The most underused planning artefact is the Release Information Note (RIN). For every Feature Pack Stack, the RIN lists *every* API state change in that FPS — what became released, what turned deprecated, what was withdrawn. The RIN for SAP_BASIS 758 SP01 alone lists on the order of three thousand deltas. Reading the RIN before an upgrade tells you exactly which contracts under your code moved, instead of discovering it from red ATC findings afterwards.",
        ],
        keyPoints: [
          "RZ70 registers a system with the SLD — the step that makes it discoverable for integration/monitoring.",
          "SE63 is the translation environment; extension texts need translating just like SAP standard texts.",
          "The Release Information Note (RIN) lists every API-state change per FPS (758 SP01 ~3000 deltas).",
          "Read the RIN before an upgrade to see which contracts moved, instead of finding out from ATC after.",
        ],
        examples: [
          {
            title: "Read the RIN before, not after",
            variant: "neutral",
            body: "Before applying an FPS, scan its Release Information Note for API-state changes touching objects your code consumes — it is the proactive version of the post-upgrade ATC red wall.",
          },
        ],
        simplified: {
          oneLiner:
            "RZ70 registers a system in the SLD, SE63 translates your extension texts too, and the Release Information Note lists every API-state change per FPS.",
          analogy:
            "The RIN is the release's changelog for API contracts — reading it before upgrading is checking the weather before the hike.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question: "What does transaction RZ70 do?",
            options: {
              A: "Registers a system with the System Landscape Directory (SLD).",
              B: "Runs ATC remotely.",
              C: "Translates extension texts.",
              D: "Lists API-state changes for an FPS.",
            },
            correct: "A",
            explanations: {
              A: "Correct — RZ70 performs SLD registration, making the system discoverable for integration and monitoring.",
              B: "Remote ATC is configured elsewhere, not in RZ70.",
              C: "Translation is SE63's job.",
              D: "API-state deltas are listed in the Release Information Note, not RZ70.",
            },
            principle: "RZ70 registers a system with the SLD.",
          },
          {
            n: 2,
            question:
              "What is the often-missed point about SE63 and your custom extensions?",
            options: {
              A: "Extensions never need translation.",
              B: "Extension texts must be translated just like SAP standard texts.",
              C: "SE63 only translates SAP-delivered objects.",
              D: "Translation happens automatically at activation.",
            },
            correct: "B",
            explanations: {
              A: "They do need translation in a multi-language landscape.",
              B: "Correct — the labels, messages and short texts your Z objects ship require translating in SE63 exactly like standard texts.",
              C: "SE63 handles custom objects too, not only SAP-delivered ones.",
              D: "Translation is a deliberate step, not an automatic activation side-effect.",
            },
            principle:
              "Extension texts need translating in SE63 like any other texts.",
          },
          {
            n: 3,
            question: "What does the Release Information Note (RIN) for an FPS contain?",
            options: {
              A: "The system's SLD registration data.",
              B: "Only the list of new transactions.",
              C: "Every API-state change introduced by that FPS.",
              D: "The translation status of extension texts.",
            },
            correct: "C",
            explanations: {
              A: "SLD registration is unrelated to the RIN.",
              B: "It covers API-state changes broadly, not just new transactions.",
              C: "Correct — the RIN enumerates every API-state change for the FPS (758 SP01 alone lists ~3000 deltas); read it before upgrading.",
              D: "Translation status is not the RIN's purpose.",
            },
            principle:
              "The RIN lists every API-state change per FPS — read it before an upgrade.",
          },
        ],
      },
    },
    {
      id: "m11-c5",
      code: "11.5",
      title: "Subtle Clean Core mechanics",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §11.5",
        paragraphs: [
          "The subtlety that catches experienced developers is that ATC tracks the release state of a *use*, not only of an API in isolation. The relationship 'consumer X uses producer Y' is itself the unit ATC evaluates: if your code consumes a producer that is C2, the *use* is the finding — even though both objects exist and compile. Clean Core is a property of the edge between two objects, and the tooling models it that way.",
          "When an API is marked C3 (deprecated), SAP rarely leaves you stranded. The object's long text typically fills a 'Replaced By' field naming the successor API — the migration target SAP intends you to move to. Reading that field turns a deprecation finding from a dead end into a concrete next step, and it is the first place to look when ATC flags a C3 consumption.",
          "Finally, the Object Release Status on a class is a graded scale, not a yes/no flag. Values include 'Use as a private API', 'For SAP Internal Use', 'Use System-Internally', and 'Released for ABAP for Cloud Development'. Only that last value is the green light for consumption from a cloud-clean package; the others are progressively more internal. Reading the exact status — rather than assuming 'it exists, so I can use it' — is what keeps a consumer compliant.",
        ],
        keyPoints: [
          "ATC tracks the release state of a USE: consumer X using a C2 producer Y is itself the finding.",
          "A C3/deprecated API's long text fills a 'Replaced By' field naming the successor — your migration target.",
          "Object Release Status is graded; 'Released for ABAP for Cloud Development' is the only green light.",
          "Read the exact status of what you consume rather than assuming existence implies permission.",
        ],
        examples: [
          {
            title: "The finding is the edge, not the object",
            variant: "neutral",
            body: "Both your class and the producer compile, yet ATC flags the line where you consume a C2 producer — because it evaluates the use (consumer → producer), not the producer alone.",
          },
        ],
        simplified: {
          oneLiner:
            "ATC flags the USE of an unreleased API, not just the API; a deprecated API names its successor in 'Replaced By'; and only 'Released for ABAP for Cloud Development' is the green light.",
          analogy:
            "It's not whether a road exists — it's whether you're allowed to drive on it; ATC tickets the trip, and 'Released for Cloud' is the open gate.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "ATC evaluates the release state of what, exactly, when it flags a Clean Core finding?",
            options: {
              A: "Only the producer API in isolation.",
              B: "The use — consumer X consuming producer Y.",
              C: "Only the consumer's package name.",
              D: "The database table behind the API.",
            },
            correct: "B",
            explanations: {
              A: "It does not judge the producer alone; both objects can exist and compile.",
              B: "Correct — ATC models the edge: a consumer using a C2 producer is itself the finding, because Clean Core is a property of the use.",
              C: "The package name alone is not the unit evaluated.",
              D: "It is the API contract on the use, not the underlying table, that is judged here.",
            },
            principle:
              "ATC tracks the release state of a use (consumer → producer), not just the API.",
          },
          {
            n: 2,
            question:
              "An API is marked C3 (deprecated). Where does SAP typically name the successor to migrate to?",
            options: {
              A: "In the SLD.",
              B: "In transaction SE63.",
              C: "In the object's long text 'Replaced By' field.",
              D: "Nowhere — deprecation gives no successor.",
            },
            correct: "C",
            explanations: {
              A: "The SLD is about landscape registration, not successor APIs.",
              B: "SE63 is for translation.",
              C: "Correct — a deprecated API's long text usually fills a 'Replaced By' field naming the successor, your migration target.",
              D: "SAP generally does name a successor; that is the first place to look.",
            },
            principle:
              "A C3 API's 'Replaced By' long-text field names its successor.",
          },
          {
            n: 3,
            question:
              "Which Object Release Status value is the green light for consumption from a cloud-clean package?",
            options: {
              A: "Use as a private API.",
              B: "For SAP Internal Use.",
              C: "Use System-Internally.",
              D: "Released for ABAP for Cloud Development.",
            },
            correct: "D",
            explanations: {
              A: "A private API is not for external consumption.",
              B: "'For SAP Internal Use' is internal, not consumable.",
              C: "'Use System-Internally' is also internal and unstable for custom code.",
              D: "Correct — 'Released for ABAP for Cloud Development' is the only value that signals safe consumption from a cloud-clean package.",
            },
            principle:
              "Only 'Released for ABAP for Cloud Development' is the green light for consumption.",
          },
        ],
      },
    },
    {
      id: "m11-c6",
      code: "11.6",
      title: "Numeric-type pitfalls",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §11.6",
        paragraphs: [
          "Financial math has a hard rule: use DECFLOAT16 or DECFLOAT34, never binary floating point. Binary FLTP cannot represent most decimal fractions exactly, so sums of money drift by fractions of a cent and fail reconciliation. The decimal floating-point types carry 16 and 34 significant digits respectively with exact decimal behaviour, which is why they are the safe choice for amounts and rates.",
          "The packed type P is the historical default for amounts, and its trap is the DECIMALS specification: declare a packed field without explicit DECIMALS and you inherit whatever default applies, which silently truncates or misplaces the decimal point. Always state DECIMALS so the scale is unambiguous. For counters, the trap is range — a four-byte integer overflows at 2^31, so anything that can exceed roughly two billion (document numbers, event counters) needs INT8, the eight-byte integer.",
          "For timestamps in new tables, prefer UTCLONG. It is a single eight-byte high-precision UTC timestamp, which is simpler and less error-prone than the legacy pattern of a separate date field and time field that you must keep consistent and time-zone-correct yourself. One UTCLONG column replaces the (date, time) pair and removes a whole class of off-by-one and time-zone bugs.",
        ],
        keyPoints: [
          "DECFLOAT16 / DECFLOAT34 are the safe types for financial math — binary FLTP drifts and fails reconciliation.",
          "Packed P needs explicit DECIMALS, or the scale is silently wrong.",
          "INT8 (8-byte) is required for counters that can exceed 2^31; INT4 overflows.",
          "UTCLONG — one high-precision UTC timestamp — is preferred over a (date, time) pair for new tables.",
        ],
        examples: [
          {
            title: "DECFLOAT for money, UTCLONG for time",
            variant: "after",
            lang: "ABAP",
            body: "Decimal floating point keeps amounts exact; a single UTCLONG replaces a separate date and time pair.",
            code: [
              "data lv_amount type decfloat34.",
              "data lv_stamp  type utclong.",
            ].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "Use DECFLOAT for money (binary float drifts), always give packed P explicit DECIMALS, reach for INT8 past 2^31, and prefer a single UTCLONG over a date+time pair.",
          analogy:
            "Binary floating point for money is a ruler marked in thirds when you need exact tenths — it can never land on the cent.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question: "Which types are the safe choice for financial math?",
            options: {
              A: "DECFLOAT16 / DECFLOAT34.",
              B: "Binary FLTP (F).",
              C: "INT4.",
              D: "CHAR with manual parsing.",
            },
            correct: "A",
            explanations: {
              A: "Correct — decimal floating-point types represent decimal fractions exactly, so amounts don't drift and reconcile cleanly.",
              B: "Binary FLTP cannot represent most decimal fractions exactly and drifts — the wrong choice for money.",
              C: "INT4 holds no fractional part at all.",
              D: "Parsing money out of CHAR is error-prone and not a numeric type.",
            },
            principle:
              "Use DECFLOAT16/34 for financial math; binary FLTP drifts.",
          },
          {
            n: 2,
            question:
              "What goes wrong if a packed (P) amount field is declared without explicit DECIMALS?",
            options: {
              A: "The field cannot be activated.",
              B: "The decimal scale is silently wrong (default applied), misplacing or truncating decimals.",
              C: "It is automatically promoted to DECFLOAT34.",
              D: "It becomes a character field.",
            },
            correct: "B",
            explanations: {
              A: "It activates; the problem is silent, not a hard error.",
              B: "Correct — without explicit DECIMALS the field takes a default scale, so the decimal point is silently misplaced or truncated; always state DECIMALS.",
              C: "There is no automatic promotion to DECFLOAT.",
              D: "It stays packed numeric, not character.",
            },
            principle:
              "Packed P needs explicit DECIMALS or its scale is silently wrong.",
          },
          {
            n: 3,
            question:
              "For a brand-new table, why prefer a single UTCLONG over a separate date field and time field?",
            options: {
              A: "UTCLONG uses less authorization.",
              B: "A date+time pair is faster to index.",
              C: "One UTCLONG is a high-precision UTC timestamp that removes the date/time consistency and time-zone burden.",
              D: "UTCLONG stores only the date.",
            },
            correct: "C",
            explanations: {
              A: "Authorization is unrelated to the type choice.",
              B: "Indexing speed is not the reason; correctness and simplicity are.",
              C: "Correct — a single UTCLONG is one high-precision UTC value, eliminating the bugs that come from keeping a separate date and time consistent and time-zone-correct.",
              D: "UTCLONG stores both date and time to high precision, not date alone.",
            },
            principle:
              "Prefer a single UTCLONG over a (date, time) pair for new tables.",
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
        question: "What can the operand of IS INSTANCE OF be?",
        options: {
          A: "Only a final class.",
          B: "A class or an interface.",
          C: "Only a DDIC structure.",
          D: "Only an interface.",
        },
        correct: "B",
        explanations: {
          A: "It is not restricted to final classes.",
          B: "Correct — IS INSTANCE OF tests a class or an interface, making it a safe pre-cast guard.",
          C: "It checks object types, not DDIC structures.",
          D: "Classes work too, not only interfaces.",
        },
        principle: "IS INSTANCE OF works for classes and interfaces.",
      },
      {
        n: 2,
        question:
          "Which released class replaces hand-rolled aRFC + WAIT UNTIL for parallel work?",
        options: {
          A: "CL_HTTP_UTILITY.",
          B: "CL_ABAP_GZIP.",
          C: "CL_ABAP_PARALLEL.",
          D: "CL_ABAP_BASE64.",
        },
        correct: "C",
        explanations: {
          A: "CL_HTTP_UTILITY does URL encode/decode.",
          B: "CL_ABAP_GZIP does compression.",
          C: "Correct — CL_ABAP_PARALLEL is the released parallel-processing helper.",
          D: "CL_ABAP_BASE64 does Base64 coding.",
        },
        principle: "CL_ABAP_PARALLEL is the released parallel-processing helper.",
      },
      {
        n: 3,
        question: "What does the Release Information Note (RIN) list for an FPS?",
        options: {
          A: "Every API-state change introduced by that FPS.",
          B: "The SLD registration data.",
          C: "The translation backlog.",
          D: "Only newly added transactions.",
        },
        correct: "A",
        explanations: {
          A: "Correct — the RIN enumerates every API-state change for the FPS; read it before upgrading.",
          B: "SLD registration is unrelated.",
          C: "Translation is an SE63 concern.",
          D: "It covers API-state changes broadly, not just transactions.",
        },
        principle: "The RIN lists every API-state change per FPS.",
      },
      {
        n: 4,
        question:
          "Which Object Release Status is the green light for consumption from a cloud-clean package?",
        options: {
          A: "Use as a private API.",
          B: "Use System-Internally.",
          C: "For SAP Internal Use.",
          D: "Released for ABAP for Cloud Development.",
        },
        correct: "D",
        explanations: {
          A: "A private API is not for external consumption.",
          B: "'Use System-Internally' is internal and unstable for custom code.",
          C: "'For SAP Internal Use' is internal, not consumable.",
          D: "Correct — only this value signals safe consumption from a cloud-clean package.",
        },
        principle: "'Released for ABAP for Cloud Development' is the green light.",
      },
      {
        n: 5,
        question: "Which types are the safe choice for financial math?",
        options: {
          A: "INT8.",
          B: "DECFLOAT16 / DECFLOAT34.",
          C: "Binary FLTP (F).",
          D: "UTCLONG.",
        },
        correct: "B",
        explanations: {
          A: "INT8 is an integer counter type, with no fractional part.",
          B: "Correct — decimal floating-point represents decimal fractions exactly, so money reconciles.",
          C: "Binary FLTP drifts on decimal fractions.",
          D: "UTCLONG is a timestamp type, not for amounts.",
        },
        principle: "Use DECFLOAT16/34 for money.",
      },
      {
        n: 6,
        question:
          "For a new table, why prefer a single UTCLONG over a separate date and time field?",
        options: {
          A: "It stores only the date.",
          B: "A date+time pair indexes faster.",
          C: "One UTCLONG is a high-precision UTC timestamp that removes the consistency and time-zone burden.",
          D: "It uses less authorization.",
        },
        correct: "C",
        explanations: {
          A: "UTCLONG stores date and time to high precision, not date alone.",
          B: "Indexing speed is not the reason.",
          C: "Correct — a single UTCLONG eliminates the bugs of keeping a separate date and time consistent and time-zone-correct.",
          D: "Authorization is unrelated.",
        },
        principle: "Prefer a single UTCLONG over a (date, time) pair for new tables.",
      },
    ],
  },
};
