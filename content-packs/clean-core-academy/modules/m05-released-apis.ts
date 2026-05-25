/* ------------------------------------------------------------------
   Module 5 — Released APIs & Extensibility Contracts.

   Source brief: §5 of the Clean Core & HANA Readiness curriculum.
   Audience: intermediate + expert — builders and architects who must
   find Clean-Core-compliant replacements for legacy APIs. Reference
   release S/4HANA 2023 (758). Follows the m01 authoring template:
   paragraphs + keyPoints + simplified.oneLiner + a 3-question quiz with
   per-option explanations; code-bearing concepts add before/after
   examples in lowercase ABAP.
------------------------------------------------------------------ */

import type { Section } from "../_types";

export const m05ReleasedApis: Section = {
  id: "m05-released-apis",
  n: 5,
  title: "Released APIs & Extensibility Contracts",
  sourceCourse: "clean-core-curriculum §5",
  audiences: ["intermediate", "expert"],
  skills: [
    {
      id: "m05-s1",
      label: "Locate released APIs via ADT Released Objects, api.sap.com, and the API State property",
      conceptId: "m05-c1",
    },
    {
      id: "m05-s2",
      label: "Map a high-yield legacy API to its released replacement",
      conceptId: "m05-c2",
    },
    {
      id: "m05-s3",
      label: "Use the XCO library for cross-cutting concerns like JSON parsing",
      conceptId: "m05-c3",
    },
    {
      id: "m05-s4",
      label: "Read released I_* CDS views instead of selecting from underlying tables",
      conceptId: "m05-c4",
    },
  ],
  blurb:
    "Finding and consuming the released contracts that replace legacy APIs: where the released-objects catalog lives, the high-yield legacy-to-released replacement map, the XCO helper library, and the rule that the interface CDS view — not the table — is the contract.",
  concepts: [
    {
      id: "m05-c1",
      code: "5.1",
      title: "Where to find released APIs",
      bloom: "U",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §5.1",
        paragraphs: [
          "Knowing the replacement exists is half the job; finding it is the other half, and there are three complementary entry points. In-system, ADT's Project Explorer has a System Library node with a Released Objects branch — it lists every released object on your system and lets you filter by type (function module, class, CDS view, BAdI), so you can browse what is actually available on your exact release without leaving the IDE.",
          "Externally, the catalog at api.sap.com has an ABAP APIs area that documents released APIs across releases, with signatures and notes — useful when you are deciding an approach before you are even logged into a system. It is the authoritative, release-spanning reference.",
          "In-code, when you are already looking at an object, its Properties pane shows the API State directly — the same C0/C1/C2/C3 contract you met in §1.4. This is the fastest check while reading code: select the object, read its API State, and you know immediately whether you may consume it. The three sources agree; use whichever fits the moment — browse Released Objects to discover, api.sap.com to research, the Properties pane to verify a specific reference.",
        ],
        keyPoints: [
          "ADT Project Explorer → System Library → Released Objects, filterable by type — the in-system catalog.",
          "api.sap.com → ABAP APIs — the external, release-spanning reference with signatures.",
          "An object's Properties pane shows its API State — the fastest in-code verification.",
          "All three agree; discover with Released Objects, research on api.sap.com, verify in Properties.",
        ],
        examples: [
          {
            title: "Three ways to confirm an API is released",
            variant: "neutral",
            body: "Browse the Released Objects node filtered to 'Class' to discover candidates; look the candidate up on api.sap.com for its signature; then open it in ADT and read Properties → API State to confirm it is C1 on your release.",
          },
        ],
        simplified: {
          oneLiner:
            "Find released APIs three ways: the Released Objects node in ADT, the ABAP APIs catalog at api.sap.com, and an object's API State in its Properties pane.",
          analogy:
            "Released Objects is the in-store catalog, api.sap.com is the manufacturer's public spec sheet, and the Properties pane is the label on the item in your hand.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Inside ADT, where do you browse the list of released objects on your system?",
            options: {
              A: "In transaction SM37.",
              B: "In the ABAP Cleaner preferences.",
              C: "In the debugger's variable view.",
              D: "In Project Explorer → System Library → Released Objects.",
            },
            correct: "D",
            explanations: {
              A: "SM37 is job monitoring, unrelated to released objects.",
              B: "ABAP Cleaner formats code; it does not list released APIs.",
              C: "The debugger inspects runtime state, not the released catalog.",
              D: "Correct — the Released Objects node under System Library lists released objects, filterable by type.",
            },
            principle:
              "The in-system released catalog lives under System Library → Released Objects in ADT.",
          },
          {
            n: 2,
            question:
              "Which external resource documents released ABAP APIs across releases?",
            options: {
              A: "api.sap.com (ABAP APIs).",
              B: "The SAP Community blog feed.",
              C: "The kernel patch notes.",
              D: "Transaction SE16.",
            },
            correct: "A",
            explanations: {
              A: "Correct — api.sap.com has an ABAP APIs area that is the authoritative external reference.",
              B: "Community blogs are helpful but not the authoritative catalog.",
              C: "Kernel patch notes cover the runtime, not the released-API catalog.",
              D: "SE16 is a data browser, not an API catalog.",
            },
            principle:
              "api.sap.com is the external, release-spanning released-API reference.",
          },
          {
            n: 3,
            question:
              "While reading code, what is the fastest way to verify a specific object is released?",
            options: {
              A: "Run a full ATC check on the whole package.",
              B: "Email SAP support.",
              C: "Open the object and read its API State in the Properties pane.",
              D: "Check the transport request log.",
            },
            correct: "C",
            explanations: {
              A: "ATC works, but checking one object's Properties is far faster for a single reference.",
              B: "Release state is self-service in the tooling; no need to email support.",
              C: "Correct — the Properties pane shows the object's API State immediately.",
              D: "Transport logs record movement, not release contracts.",
            },
            principle:
              "An object's API State in its Properties pane is the fastest per-object check.",
          },
        ],
      },
    },
    {
      id: "m05-c2",
      code: "5.2",
      title: "High-yield legacy → released replacements",
      bloom: "A",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §5.2",
        paragraphs: [
          "A handful of legacy calls account for most of the migration work, and each has a known released replacement. User detail: `bapi_user_get_detail` gives way to the `xco_cp_user` / `xco_cp` factory. Alpha conversion: the function module `conversion_exit_alpha_input` (C2 from Cloud) is replaced by the string-template form `|{ value alpha = in }|`, which is C1 and type-safe. Number ranges: `number_get_next` becomes the released `cl_numberrange_runtime`. Long text: `read_text` moves to `xco_cp_long_text` where available per release. Outbound mail: the legacy `cl_bcs` is replaced by `xco_cp_mail` for in-stack sending.",
          "The case that trips people up is `rfc_read_table`: it is not released for cloud consumption, and there is no drop-in API replacement. The correct move is architectural — expose the data you need through a released CDS view and read that view instead. There is no 'read any table generically' API in Clean Core by design, because that capability is exactly what breaks upgrade stability.",
          "The discipline is to treat the legacy call as a smell and look up its row in this table before reaching for an exemption. Most replacements are not just compliant but better: the alpha template is inlineable and avoids a function-call round-trip; `cl_numberrange_runtime` is a clean object API; the XCO helpers are fluent and testable. Migration here usually improves the code rather than merely satisfying ATC.",
        ],
        keyPoints: [
          "BAPI_USER_GET_DETAIL → XCO_CP_USER / XCO_CP factory.",
          "CONVERSION_EXIT_ALPHA_INPUT → string template `|{ value ALPHA = IN }|` (C1, type-safe).",
          "NUMBER_GET_NEXT → CL_NUMBERRANGE_RUNTIME; READ_TEXT → XCO_CP_LONG_TEXT; CL_BCS → XCO_CP_MAIL.",
          "RFC_READ_TABLE is NOT released — read a released CDS view instead; there is no generic table-read API by design.",
          "Replacements are usually better code, not just ATC-compliant.",
        ],
        examples: [
          {
            title: "Alpha conversion via function module",
            variant: "before",
            lang: "ABAP",
            body: "The classic CONVERSION_EXIT_ALPHA_INPUT call — a C2 function module from a Cloud package, and a round-trip for a pure string operation.",
            code: [
              "call function 'conversion_exit_alpha_input'",
              "  exporting",
              "    input  = lv_matnr",
              "  importing",
              "    output = lv_matnr.",
            ].join("\n"),
          },
          {
            title: "Alpha conversion via string template",
            variant: "after",
            lang: "ABAP",
            body: "The released, type-safe, inline form — no function call, C1, and clearer at the call site.",
            code: ["data(lv_matnr) = |{ lv_matnr alpha = in }|."].join("\n"),
          },
          {
            title: "Generic table read via RFC",
            variant: "before",
            lang: "ABAP",
            body: "RFC_READ_TABLE is not released for cloud consumption — there is no compliant way to keep this call.",
            code: [
              "call function 'rfc_read_table'",
              "  exporting",
              "    query_table = 'MARA'",
              "  tables",
              "    data        = lt_data.",
            ].join("\n"),
          },
          {
            title: "Read a released CDS view instead",
            variant: "after",
            lang: "ABAP",
            body: "Replace the generic read with a typed SELECT from the released interface view — the contract you are allowed to depend on.",
            code: [
              "select from i_material",
              "  fields material, materialtype",
              "  into table @data(lt_material).",
            ].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "Swap legacy calls for released ones: BAPI_USER_GET_DETAIL→XCO_CP_USER, CONVERSION_EXIT_ALPHA_INPUT→`|{ value ALPHA = IN }|`, NUMBER_GET_NEXT→CL_NUMBERRANGE_RUNTIME, READ_TEXT→XCO_CP_LONG_TEXT, CL_BCS→XCO_CP_MAIL; RFC_READ_TABLE has no API replacement — read a CDS view.",
          analogy:
            "Each legacy tool has a modern equivalent in the shop — except the universal skeleton key (RFC_READ_TABLE), which simply isn't sold any more.",
        },
        deeper: {
          paragraphs: [
            "Why is there no released RFC_READ_TABLE? Because a generic 'give me any table' call is the antithesis of a contract: it couples the caller to physical table shapes SAP reserves the right to change. Forcing you through a released CDS view means SAP can restructure the table beneath the view and keep the view stable — the same decoupling principle as the rest of Clean Core, applied to data access.",
          ],
          keyPoints: [
            "The alpha string template avoids a function-call round-trip and is inlineable.",
            "No generic table-read API exists by design — the CDS view is the stable seam.",
          ],
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Which is the released replacement for `CONVERSION_EXIT_ALPHA_INPUT`?",
            options: {
              A: "CL_BCS.",
              B: "The string template `|{ value ALPHA = IN }|`.",
              C: "RFC_READ_TABLE.",
              D: "NUMBER_GET_NEXT.",
            },
            correct: "B",
            explanations: {
              A: "CL_BCS is legacy mail; it has nothing to do with alpha conversion.",
              B: "Correct — the ALPHA string template is the C1, type-safe replacement for the C2 function module.",
              C: "RFC_READ_TABLE is a generic table read and is not released.",
              D: "NUMBER_GET_NEXT is for number ranges, not alpha conversion.",
            },
            principle:
              "Alpha conversion moves from a C2 FM to the C1 ALPHA string template.",
          },
          {
            n: 2,
            question:
              "Why can't `RFC_READ_TABLE` simply be swapped for a released function module of the same shape?",
            options: {
              A: "Because it is too slow on HANA.",
              B: "Because it only works in the background.",
              C: "Because it requires a special license.",
              D: "Because no generic table-read API exists in Clean Core by design — you read a released CDS view instead.",
            },
            correct: "D",
            explanations: {
              A: "Performance is not the reason; the issue is the contract model.",
              B: "It is not a background-only restriction.",
              C: "Licensing is not the reason it is excluded.",
              D: "Correct — a generic table read couples you to physical tables, so the compliant path is a released CDS view.",
            },
            principle:
              "There is no released generic table read; the CDS view is the stable data seam.",
          },
          {
            n: 3,
            question:
              "Which legacy-to-released mapping is correct?",
            options: {
              A: "NUMBER_GET_NEXT → CL_NUMBERRANGE_RUNTIME.",
              B: "READ_TEXT → CL_BCS.",
              C: "BAPI_USER_GET_DETAIL → RFC_READ_TABLE.",
              D: "CL_BCS → CONVERSION_EXIT_ALPHA_INPUT.",
            },
            correct: "A",
            explanations: {
              A: "Correct — number-range allocation moves to the released CL_NUMBERRANGE_RUNTIME.",
              B: "READ_TEXT maps to XCO_CP_LONG_TEXT, not CL_BCS.",
              C: "BAPI_USER_GET_DETAIL maps to XCO_CP_USER/XCO_CP, not the unreleased RFC_READ_TABLE.",
              D: "CL_BCS maps to XCO_CP_MAIL; alpha conversion is a separate concern.",
            },
            principle:
              "Number ranges use CL_NUMBERRANGE_RUNTIME; learn the high-yield map.",
          },
        ],
      },
    },
    {
      id: "m05-c3",
      code: "5.3",
      title: "The XCO library",
      bloom: "A",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §5.3",
        paragraphs: [
          "XCO (the Extension Component library) is a released, fluent ABAP API for cross-cutting concerns that began in the ABAP Environment and is now broadly available in S/4HANA 758. Rather than hunting for a released class per task, you reach for the relevant `xco_cp_*` facade. It covers JSON (`xco_cp_json`), hashing and encoding (`xco_cp_hash`, `xco_cp_encoding`), date/time and time zones (`xco_cp_time`, `xco_cp_time_zone`), repository introspection (`xco_cp_abap_repository`), HTTP and OData clients (`xco_cp_http`, `xco_cp_odata`), and string and file helpers (`xco_cp_string`, `xco_cp_file_system`).",
          "The fluent style reads as a chain of intent: you get a handle, then navigate to the member or operation you want. For JSON this replaces the old habit of calling `/ui2/cl_json` (not released for Cloud) with a released, explicit traversal. Because every facade is C1, code written against XCO survives upgrades, and because the API is uniform, a developer who learns one facade can read the others.",
          "Repository introspection deserves a special mention: `xco_cp_abap_repository` lets your own code query packages, release states, and ATC findings. That turns XCO from a utility belt into a platform — for instance you can write a short program that asks the repository for every Z class consuming a C2 object and emit your own Clean Core compliance report, something SAP does not ship out of the box.",
        ],
        keyPoints: [
          "XCO is a released, fluent facade library (xco_cp_*) for cross-cutting concerns.",
          "Covers JSON, hashing/encoding, time/time-zone, repository introspection, HTTP/OData clients, string/file.",
          "Use xco_cp_json instead of the unreleased /ui2/cl_json for JSON.",
          "Every facade is C1, so XCO-based code is upgrade-stable and uniform to read.",
          "xco_cp_abap_repository can introspect packages, releases, and ATC findings — build your own compliance tooling.",
        ],
        examples: [
          {
            title: "JSON parsing with /ui2/cl_json",
            variant: "before",
            lang: "ABAP",
            body: "The familiar but unreleased path — /ui2/cl_json is not C1, so this is a Clean Core violation in a cloud package.",
            code: [
              "data(json) = `{\"matnr\":\"4711\",\"mtart\":\"FERT\"}`.",
              "data ls_data type ty_material.",
              "/ui2/cl_json=>deserialize( exporting json = json",
              "                           changing  data = ls_data ).",
            ].join("\n"),
          },
          {
            title: "JSON parsing with xco_cp_json",
            variant: "after",
            lang: "ABAP",
            body: "The released, fluent XCO traversal: get a handle from the string, then navigate to the member and read its value.",
            code: [
              "data(json) = `{\"matnr\":\"4711\",\"mtart\":\"FERT\"}`.",
              "data(handle) = xco_cp_json=>data->from_string( json ).",
              "data(matnr)  = handle->get_member( 'matnr' )->get_value( )->as_string( ).",
            ].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "XCO is a released, fluent library of xco_cp_* helpers for JSON, hashing, time, repository introspection, HTTP/OData, and strings — use xco_cp_json instead of the unreleased /ui2/cl_json.",
          analogy:
            "XCO is the officially supported Swiss-army knife; /ui2/cl_json is a handy blade you found in a drawer with no warranty.",
        },
        deeper: {
          paragraphs: [
            "The 'cp' in the names stands for the cross-platform/cloud-platform lineage; the consistency is deliberate so the library reads the same on ABAP Environment and on-stack S/4. The repository-introspection facade is the highest-leverage piece for architects: a self-checking compliance report against your own codebase is roughly a 30-line program once you know the entry points.",
          ],
          keyPoints: [
            "XCO's uniform fluent style means learning one facade transfers to the rest.",
            "xco_cp_abap_repository enables home-grown Clean Core compliance reporting.",
          ],
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "What is the XCO library, in one phrase?",
            options: {
              A: "An open-source linter that runs outside the SAP system.",
              B: "A transaction for monitoring background jobs.",
              C: "A released, fluent ABAP API for cross-cutting concerns.",
              D: "A replacement user interface for SAP GUI.",
            },
            correct: "C",
            explanations: {
              A: "That describes abaplint, not XCO.",
              B: "XCO is a code library, not a monitoring transaction.",
              C: "Correct — XCO is the released, fluent helper library for cross-cutting concerns.",
              D: "XCO is a programming API, not a UI.",
            },
            principle:
              "XCO is the released, fluent helper library for cross-cutting concerns.",
          },
          {
            n: 2,
            question:
              "Which XCO facade should you use to parse JSON instead of `/ui2/cl_json`?",
            options: {
              A: "xco_cp_http.",
              B: "xco_cp_json.",
              C: "xco_cp_time.",
              D: "xco_cp_hash.",
            },
            correct: "B",
            explanations: {
              A: "xco_cp_http is the HTTP client, not the JSON parser.",
              B: "Correct — xco_cp_json is the released JSON facade replacing the unreleased /ui2/cl_json.",
              C: "xco_cp_time handles date/time, not JSON.",
              D: "xco_cp_hash is for hashing and encoding, not JSON.",
            },
            principle:
              "Parse JSON with the released xco_cp_json, not /ui2/cl_json.",
          },
          {
            n: 3,
            question:
              "Which XCO facade lets your own code query packages, release states, and ATC findings?",
            options: {
              A: "xco_cp_string.",
              B: "xco_cp_mail.",
              C: "xco_cp_encoding.",
              D: "xco_cp_abap_repository.",
            },
            correct: "D",
            explanations: {
              A: "xco_cp_string is for string operations.",
              B: "xco_cp_mail sends mail; it does not introspect the repository.",
              C: "xco_cp_encoding handles encoding, not repository metadata.",
              D: "Correct — xco_cp_abap_repository provides repository introspection, enabling home-grown compliance tooling.",
            },
            principle:
              "xco_cp_abap_repository introspects the repository for your own tooling.",
          },
        ],
      },
    },
    {
      id: "m05-c4",
      code: "5.4",
      title: "Released DDIC artefacts — read CDS, not tables",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §5.4",
        paragraphs: [
          "The most common single violation in custom code is reading a SAP table directly because 'it has always been there.' In Clean Core the interface CDS views — the `i_*` family — are released, but the underlying database tables almost never are. So `select from mara` in a cloud package is a Clean Core violation, while `select from i_material` is the sanctioned read. The same holds across the model: read `i_*` (and the `c_*` consumption views) rather than the physical tables behind them.",
          "The principle is that the interface view is the contract; the table is not. SAP guarantees the shape and semantics of `i_material` across upgrades, and reserves the right to restructure `mara` underneath it — split it, add fields, change buffering. Code bound to the view rides through those changes untouched; code bound to the table is exactly the kind of dependency that turns an upgrade into a regression project.",
          "Practically this also buys you cleaner data: interface views apply the modern field names, associations to related entities, and any compatibility mapping SAP has layered on (for example bridging an old field to a restructured model). You select fewer surprises and more meaning. When you catch a direct table read in review, the fix is almost always a one-line swap to the corresponding interface view — and if no released view exposes what you need, that is a signal to reconsider the requirement, not to reach back to the table.",
        ],
        keyPoints: [
          "I_* interface views are released; the underlying tables are not.",
          "`select from mara` in a cloud package is a violation; use `I_Material`.",
          "The interface view IS the contract — the table is an implementation detail SAP may restructure.",
          "View-bound code survives upgrades; table-bound code is the classic regression risk.",
          "Interface views also give modern names, associations, and compatibility mappings.",
        ],
        examples: [
          {
            title: "Direct table read",
            variant: "before",
            lang: "ABAP",
            body: "Selecting straight from MARA — valid Standard ABAP, a Clean Core violation in a cloud package because the table is not released.",
            code: [
              "select from mara",
              "  fields matnr, mtart",
              "  where mtart = 'FERT'",
              "  into table @data(lt_mara).",
            ].join("\n"),
          },
          {
            title: "Read the released interface view",
            variant: "after",
            lang: "ABAP",
            body: "Select from the released I_Material interface view instead — the contract SAP keeps stable across upgrades.",
            code: [
              "select from i_material",
              "  fields material, materialtype",
              "  where materialtype = 'FERT'",
              "  into table @data(lt_material).",
            ].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "Released I_* interface views are the contract; the tables behind them are not — `select from mara` is a violation, `select from I_Material` is the fix.",
          analogy:
            "Read the published API of the warehouse (the interface view), not the raw shelf layout (the table) that staff rearrange whenever they like.",
        },
        deeper: {
          paragraphs: [
            "This is the data-access twin of §5.2's RFC_READ_TABLE point and §1.4's release-contract rule: stability is promised at the view, not the storage. Note that not every i_* view is released on every release, so you still verify the specific view's API State — but as a rule of thumb, prefer the interface view and confirm rather than defaulting to the table and hoping.",
          ],
          keyPoints: [
            "Verify the specific view's API State — not every i_* is released on every release.",
            "If no released view exposes the data, treat that as a design signal, not a reason to read the table.",
          ],
          pitfalls: [
            "Assuming every i_* view is automatically released — confirm the API State of the specific view.",
          ],
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "In a cloud package, what is the status of `SELECT FROM mara`?",
            options: {
              A: "It is a Clean Core violation — the table is not released; use I_Material.",
              B: "It is fine because MARA has always existed.",
              C: "It is allowed only with a database hint.",
              D: "It is automatically redirected to I_Material.",
            },
            correct: "A",
            explanations: {
              A: "Correct — the underlying table is not released, so reading it directly is a violation; the interface view I_Material is the contract.",
              B: "Longevity does not make a table a released contract.",
              C: "A hint does not change the release contract of the table.",
              D: "There is no automatic redirection; you must select from the view yourself.",
            },
            principle:
              "Underlying tables are not released; read the interface view.",
          },
          {
            n: 2,
            question:
              "Why is the interface view the thing you are allowed to depend on, rather than the table?",
            options: {
              A: "Because views are stored in memory and tables on disk.",
              B: "Because views are always faster than tables.",
              C: "Because SAP keeps the view's shape stable across upgrades and may restructure the table beneath it.",
              D: "Because tables cannot be read in ABAP Cloud at all, ever.",
            },
            correct: "C",
            explanations: {
              A: "Storage location is not the reason; the contract is.",
              B: "Performance is not the governing reason; stability of the contract is.",
              C: "Correct — the view is the upgrade-stable contract; the table is an implementation detail SAP may change.",
              D: "Released tables can exist; the point is most underlying tables are not released, and the view is the contract.",
            },
            principle:
              "Stability is promised at the view, not at the storage table.",
          },
          {
            n: 3,
            question:
              "Which released interface view replaces a direct read of MARA?",
            options: {
              A: "RFC_READ_TABLE.",
              B: "I_Material.",
              C: "/ui2/cl_json.",
              D: "CL_NUMBERRANGE_RUNTIME.",
            },
            correct: "B",
            explanations: {
              A: "RFC_READ_TABLE is an unreleased generic table read, not a view.",
              B: "Correct — I_Material is the released interface view for material master data.",
              C: "/ui2/cl_json is a JSON utility, not a material view.",
              D: "CL_NUMBERRANGE_RUNTIME allocates number ranges; it is unrelated to material reads.",
            },
            principle:
              "I_Material is the released contract for material master reads.",
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
          "Where, inside ADT, do you browse released objects on your system?",
        options: {
          A: "In the debugger.",
          B: "In transaction SM37.",
          C: "In the ABAP Cleaner preferences.",
          D: "In Project Explorer → System Library → Released Objects.",
        },
        correct: "D",
        explanations: {
          A: "The debugger inspects runtime state, not the released catalog.",
          B: "SM37 is job monitoring.",
          C: "ABAP Cleaner formats code; it does not list released APIs.",
          D: "Correct — the Released Objects node lists released objects, filterable by type.",
        },
        principle:
          "The in-system released catalog is under System Library → Released Objects.",
      },
      {
        n: 2,
        question:
          "Which is the released replacement for `BAPI_USER_GET_DETAIL`?",
        options: {
          A: "XCO_CP_USER / XCO_CP factory.",
          B: "RFC_READ_TABLE.",
          C: "/ui2/cl_json.",
          D: "CL_BCS.",
        },
        correct: "A",
        explanations: {
          A: "Correct — user details come from the released XCO_CP_USER / XCO_CP factory.",
          B: "RFC_READ_TABLE is an unreleased generic table read.",
          C: "/ui2/cl_json is an unreleased JSON utility.",
          D: "CL_BCS is legacy mail, unrelated to user details.",
        },
        principle:
          "User details move to the released XCO_CP_USER / XCO_CP factory.",
      },
      {
        n: 3,
        question:
          "Which XCO facade replaces `/ui2/cl_json` for JSON parsing?",
        options: {
          A: "xco_cp_time.",
          B: "xco_cp_http.",
          C: "xco_cp_json.",
          D: "xco_cp_hash.",
        },
        correct: "C",
        explanations: {
          A: "xco_cp_time is for date/time, not JSON.",
          B: "xco_cp_http is the HTTP client.",
          C: "Correct — xco_cp_json is the released JSON facade.",
          D: "xco_cp_hash is for hashing and encoding.",
        },
        principle:
          "Parse JSON with the released xco_cp_json.",
      },
      {
        n: 4,
        question:
          "From a cloud package, how should you read material master data?",
        options: {
          A: "SELECT FROM mara directly.",
          B: "SELECT FROM the released I_Material interface view.",
          C: "CALL FUNCTION 'RFC_READ_TABLE' for MARA.",
          D: "EXPORT MARA TO MEMORY then read it back.",
        },
        correct: "B",
        explanations: {
          A: "MARA is not released; reading it directly is a violation.",
          B: "Correct — I_Material is the released interface view and the contract you may depend on.",
          C: "RFC_READ_TABLE is not released for cloud consumption.",
          D: "EXPORT/IMPORT TO MEMORY is forbidden in a cloud package.",
        },
        principle:
          "Read the released I_Material view, not the MARA table.",
      },
      {
        n: 5,
        question:
          "Why is there no released generic table-read API like `RFC_READ_TABLE`?",
        options: {
          A: "Because RFC is being removed from the kernel.",
          B: "Because generic reads are too slow on HANA.",
          C: "Because it requires a separate license.",
          D: "Because a generic read couples callers to physical tables, defeating upgrade stability — read a released CDS view instead.",
        },
        correct: "D",
        explanations: {
          A: "RFC is not being removed; that is not the reason.",
          B: "Performance is not the governing reason.",
          C: "Licensing is not why it is excluded.",
          D: "Correct — a generic table read binds you to physical tables, so the compliant path is a released CDS view.",
        },
        principle:
          "There is no generic table read by design; the CDS view is the stable seam.",
      },
    ],
  },
};
