/* ------------------------------------------------------------------
   Module 4 — ABAP Cloud Development & RAP.

   Source brief: §4 of the Clean Core & HANA Readiness curriculum.
   Audience: intermediate + expert — builders and architects writing
   on-stack Tier-2 code. Reference release S/4HANA 2023 (758).
   Follows the m01 authoring template: every concept ships paragraphs
   + keyPoints + simplified.oneLiner + a 3-question quiz with per-option
   explanations; code-bearing concepts add before/after examples in
   lowercase ABAP.
------------------------------------------------------------------ */

import type { Section } from "../_types";

export const m04AbapCloud: Section = {
  id: "m04-abap-cloud",
  n: 4,
  title: "ABAP Cloud Development & RAP",
  sourceCourse: "clean-core-curriculum §4",
  audiences: ["intermediate", "expert"],
  skills: [
    {
      id: "m04-s1",
      label: "Assemble the five mandatory artefacts of a managed RAP business object",
      conceptId: "m04-c1",
    },
    {
      id: "m04-s2",
      label: "Implement a behavior pool with local handlers using READ/MODIFY ENTITIES in local mode",
      conceptId: "m04-c2",
    },
    {
      id: "m04-s3",
      label: "Recognise the classic statements that are syntax errors in a Cloud Development package",
      conceptId: "m04-c3",
    },
    {
      id: "m04-s4",
      label: "Implement a released BAdI without referencing its unreleased filter values",
      conceptId: "m04-c4",
    },
  ],
  blurb:
    "Building Tier-2 transactional apps the Clean Core way: the five-artefact RAP scaffold, the behavior-pool implementation pattern, the Restricted ABAP forbidden list, and the BAdI rules — including the released-spot-with-unreleased-filter trap.",
  concepts: [
    {
      id: "m04-c1",
      code: "4.1",
      title: "The RAP scaffold",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §4.1",
        paragraphs: [
          "Every Tier-2 transactional app in ABAP Cloud is a RAP business object, and a managed BO is assembled from five mandatory artefacts. The persistence is a DDIC table (or a CDS table function over a custom table); on top of it sits an interface CDS root view entity — `define root view entity` — that carries the model and its annotations. That interface view is the stable, technical layer.",
          "The projection CDS view exposes a tailored subset of the interface entity to one service, declared with `provider contract transactional_query`; this is the contract a UI or API actually consumes, so it can hide fields and add consumption annotations without disturbing the interface layer. Behavior is split the same way: a behavior definition for the interface entity (declaring create/update/delete, fields, validations, determinations) and a thin projection behavior definition that re-exposes the operations the service offers via `use create/update/delete`.",
          "Finally a service definition (`define service`) lists which projection entities to expose, and a service binding turns that definition into a concrete protocol endpoint — OData V4 UI being the default for Fiori. The reason for the two-layer split (interface vs projection, BDEF vs projection BDEF) is decoupling: SAP and you can evolve the underlying model while each service keeps a narrow, versionable contract, which is exactly the Clean Core promise applied inside your own code.",
        ],
        keyPoints: [
          "Five artefacts: persistence table, interface CDS root view entity, projection view, behavior definitions (interface + projection), service definition + binding.",
          "The interface view is the model; the projection view is the per-service contract (provider contract transactional_query).",
          "Behavior is layered too: the interface BDEF declares operations; the projection BDEF re-exposes them with `use`.",
          "The service binding fixes the protocol — OData V4 UI for Fiori transactional apps.",
          "The two-layer split decouples model evolution from the consumed contract.",
        ],
        examples: [
          {
            title: "Interface root view entity",
            variant: "neutral",
            lang: "ABAP",
            body: "The persistence-facing model layer: a root view entity over the custom table, carrying keys, fields, and the etag-bearing change timestamp.",
            code: [
              "@accesscontrol.authorizationcheck: #check",
              "@endusertext.label: 'Order Header'",
              "define root view entity zi_orderheader",
              "  as select from zorder_hdr",
              "{",
              "  key orderid,",
              "      customerid,",
              "      orderdate,",
              "      total,",
              "      currency,",
              "      locallastchangedat",
              "}",
            ].join("\n"),
          },
          {
            title: "Behavior definition (interface)",
            variant: "neutral",
            lang: "ABAP",
            body: "Managed implementation, strict(2), with create/update/delete plus a validation and a determination on save — the declarative half of the BO.",
            code: [
              "managed implementation in class zbp_i_orderheader unique;",
              "strict ( 2 );",
              "",
              "define behavior for zi_orderheader alias orderheader",
              "persistent table zorder_hdr",
              "lock master",
              "authorization master ( instance )",
              "etag master locallastchangedat",
              "{",
              "  create;",
              "  update;",
              "  delete;",
              "  field ( readonly ) orderid;",
              "  field ( mandatory ) customerid, orderdate;",
              "  validation validatecustomer on save { create; field customerid; }",
              "  determination calculatetotal on save { create; update; }",
              "}",
            ].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "A managed RAP business object is five artefacts: a table, an interface CDS root view, a projection view, behavior definitions for both, and a service definition plus binding.",
          analogy:
            "The interface view is the engine; the projection view is the dashboard you actually let the driver touch.",
        },
        deeper: {
          paragraphs: [
            "'Managed' means the RAP runtime owns the persistence (it writes your table for you); 'unmanaged' is for wrapping a legacy transaction's own save logic. Greenfield Tier-2 apps are almost always managed. The projection contract keyword matters: `transactional_query` marks a read-write projection for a transactional service, distinct from analytical or value-help contracts.",
          ],
          keyPoints: [
            "Managed BO = runtime owns persistence; unmanaged = you wrap existing save logic.",
            "provider contract transactional_query marks a read-write transactional projection.",
          ],
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Which set correctly lists the five mandatory artefacts of a managed RAP business object?",
            options: {
              A: "Persistence table, interface view, projection view, a single behavior definition, and a Fiori tile.",
              B: "Table, projection view, service definition, service binding, and an ATC variant.",
              C: "Persistence table, interface CDS root view, projection view, behavior definitions (interface + projection), and service definition + binding.",
              D: "Interface view, AMDP procedure, DCL role, service binding, and a number range.",
            },
            correct: "C",
            explanations: {
              A: "There are two behavior definitions (interface + projection), and a Fiori tile is not a RAP artefact.",
              B: "It omits the interface view and both behavior definitions; an ATC variant is tooling, not a BO artefact.",
              C: "Correct — table, interface root view, projection view, behavior definitions for both layers, and the service definition + binding.",
              D: "An AMDP procedure and a number range are not mandatory scaffold artefacts; the behavior definitions are missing.",
            },
            principle:
              "The managed RAP scaffold is exactly five artefacts spanning persistence, model, contract, behavior, and service.",
          },
          {
            n: 2,
            question:
              "What does the projection view's `provider contract transactional_query` declaration establish?",
            options: {
              A: "That this view is the read-write transactional contract a service consumes.",
              B: "That the view is read-only and analytical.",
              C: "That the view bypasses the behavior definition entirely.",
              D: "That client handling is set to session variable.",
            },
            correct: "A",
            explanations: {
              A: "Correct — it marks the projection as the transactional read-write contract exposed to a service.",
              B: "Analytical contracts are a different declaration; transactional_query is read-write.",
              C: "The projection still relies on a projection behavior definition; it does not bypass behavior.",
              D: "Client handling is a separate annotation, unrelated to the provider contract.",
            },
            principle:
              "The projection's provider contract defines the per-service transactional contract over the interface model.",
          },
          {
            n: 3,
            question:
              "For a Fiori transactional app, what protocol does the service binding typically expose?",
            options: {
              A: "RFC.",
              B: "SOAP web service.",
              C: "IDoc.",
              D: "OData V4 (UI).",
            },
            correct: "D",
            explanations: {
              A: "RFC is a classic remote-call protocol, not the RAP UI binding.",
              B: "SOAP is legacy web-service technology, not the default Fiori binding.",
              C: "IDoc is for asynchronous document exchange, not transactional UI.",
              D: "Correct — the binding is created as OData V4 UI targeting the service definition.",
            },
            principle:
              "The service binding fixes the protocol; OData V4 UI is the Fiori transactional default.",
          },
        ],
      },
    },
    {
      id: "m04-c2",
      code: "4.2",
      title: "Behavior implementation pattern",
      bloom: "A",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §4.2",
        paragraphs: [
          "The behavior definition declares what happens; the behavior pool implements it. The pool is a single global class (named in the BDEF's `implementation in class`), and inside it you define one local handler class — `lhc_<entity>` — per entity, each inheriting from `cl_abap_behavior_handler`. The validations and determinations declared in the BDEF map to handler methods marked `for validate on save` and `for determine on save`.",
          "Inside a handler you never touch the database directly. You read and write through the BO runtime with `read entities of ... in local mode` and `modify entities of ... in local mode`. 'In local mode' means the call runs inside the current BO transaction and skips the DCL authorization check — appropriate because you are already inside the trusted BO boundary, but it means you must never hand that result to a UI without re-checking authorization. Failures are reported back through the framework tables `failed-<entity>` and `reported-<entity>`, not by raising exceptions.",
          "Use `strict ( 2 )` in all new RAP code. Strict mode 2 enables the latest syntax checks and forbids deprecated patterns (for example an eager `read` without an explicit `result`), so the compiler catches contract mistakes early. The pattern for a determination is: read the keys you were handed, compute, then `modify entities ... update fields ( ... )` naming exactly the fields you set — a field omitted from that list is silently not updated.",
        ],
        keyPoints: [
          "The behavior pool is one global class; one local lhc_<entity> handler per entity inherits from cl_abap_behavior_handler.",
          "Validations map to methods `for validate on save`; determinations to `for determine on save`.",
          "Access data only via READ ENTITIES / MODIFY ENTITIES ... IN LOCAL MODE — never direct SQL.",
          "IN LOCAL MODE runs inside the BO transaction and skips DCL — re-check auth before exposing results.",
          "Report problems through failed-<entity> / reported-<entity>, and always use strict ( 2 ).",
        ],
        examples: [
          {
            title: "A validation handler method",
            variant: "neutral",
            lang: "ABAP",
            body: "Read the keys in local mode, loop, and append to failed/reported instead of raising — the RAP way to reject a save.",
            code: [
              "method validatecustomer.",
              "  read entities of zi_orderheader in local mode",
              "    entity orderheader",
              "    fields ( customerid )",
              "    with corresponding #( keys )",
              "    result data(orders).",
              "",
              "  loop at orders assigning field-symbol(<order>).",
              "    if <order>-customerid is initial.",
              "      append value #( %tky = <order>-%tky ) to failed-orderheader.",
              "      append value #( %tky = <order>-%tky",
              "                      %msg = new_message_with_text(",
              "                               severity = if_abap_behv_message=>severity-error",
              "                               text     = 'CustomerId required' ) )",
              "             to reported-orderheader.",
              "    endif.",
              "  endloop.",
              "endmethod.",
            ].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "Implement RAP behavior in a behavior pool with one lhc_<entity> handler per entity, reading and writing only via READ/MODIFY ENTITIES in local mode under strict(2).",
          analogy:
            "Handlers are staff who can only move stock through the warehouse's own forklifts (the BO runtime), never by reaching onto the shelves (direct SQL) themselves.",
        },
        deeper: {
          paragraphs: [
            "`in local mode` is the key phrase: it tells the runtime the operation is part of the same logical transaction and authorization context, so it neither re-evaluates DCL nor starts a nested unit of work. That is exactly why a determination can update a field it would not, from outside, be allowed to write — and exactly why you must re-impose authorization if you ever surface those rows.",
          ],
          keyPoints: [
            "A field left out of MODIFY ENTITIES ... UPDATE FIELDS ( ... ) is silently not written — no error.",
            "strict ( 2 ) forbids deprecated handler patterns that older strict modes tolerated.",
          ],
          pitfalls: [
            "Treating failed/reported as optional — omitting failed means a rejected instance still gets saved.",
          ],
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "How is a behavior pool structured for a BO with two entities?",
            options: {
              A: "Two global behavior pools, one per entity, each with no local classes.",
              B: "One global class containing one local lhc_<entity> handler per entity, each inheriting from cl_abap_behavior_handler.",
              C: "One local class implementing both entities in a single handler method.",
              D: "A function group with one function module per operation.",
            },
            correct: "B",
            explanations: {
              A: "There is a single behavior pool per BO, not one global class per entity.",
              B: "Correct — one global pool class holds one local lhc_<entity> handler per entity, each extending cl_abap_behavior_handler.",
              C: "Each entity gets its own local handler class; they are not collapsed into one method.",
              D: "RAP behavior is implemented in classes, not function groups.",
            },
            principle:
              "One behavior pool, one local lhc_<entity> handler per entity.",
          },
          {
            n: 2,
            question:
              "What is the effect of `READ ENTITIES ... IN LOCAL MODE` inside a handler?",
            options: {
              A: "It opens a new database connection outside the BO transaction.",
              B: "It forces a re-login of the current user.",
              C: "It bypasses the BO runtime and reads the table directly.",
              D: "It runs within the current BO transaction and skips the DCL authorization check.",
            },
            correct: "D",
            explanations: {
              A: "Local mode stays inside the current BO transaction, not a new connection.",
              B: "It has nothing to do with re-authentication.",
              C: "It still goes through the BO runtime; it does not read the table directly.",
              D: "Correct — it executes inside the BO transaction and skips DCL, so results must be re-checked before reaching a UI.",
            },
            principle:
              "IN LOCAL MODE = inside the BO transaction, DCL skipped — trusted internally, re-check before exposing.",
          },
          {
            n: 3,
            question:
              "In a handler, how should a validation reject an invalid instance?",
            options: {
              A: "By appending the key to failed-<entity> and a message to reported-<entity>.",
              B: "By raising a CX_STATIC_CHECK exception.",
              C: "By calling ROLLBACK WORK.",
              D: "By issuing MESSAGE ... TYPE 'E'.",
            },
            correct: "A",
            explanations: {
              A: "Correct — RAP rejects via the framework tables failed-<entity> and reported-<entity>.",
              B: "Handlers report through framework tables, not by throwing exceptions.",
              C: "Explicit ROLLBACK WORK is not the RAP transactional model.",
              D: "Classic MESSAGE statements are not how RAP reports save failures (and TYPE 'I' is forbidden in Cloud).",
            },
            principle:
              "Report RAP failures through failed/reported tables, not exceptions or MESSAGE.",
          },
        ],
      },
    },
    {
      id: "m04-c3",
      code: "4.3",
      title: "Restricted ABAP — the forbidden list",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §4.3",
        paragraphs: [
          "Inside an ABAP-for-Cloud-Development package the compiler refuses a long list of classic statements outright — they are syntax errors, not warnings. The categories worth memorising are: list processing and screen output (`write ... /`, `new-page`, `list-processing`); program and transaction control (`call transaction`, `submit`, `leave to transaction`); classic dialog UI (`call screen`, `set screen`, `call dialog`); destination-based remote calls (`call function ... destination`); and macros (`define` / `end-of-definition`).",
          "It continues with the data-tunnelling and native escapes: native SQL (`exec sql`) and held cursors (`open cursor ... with hold`); and any transfer through ABAP or shared memory — `import from memory` / `export to memory`, and `import/export from shared buffer`, plus the shared-memory-objects framework. Authority checks against non-released objects are out too; you use the released authorization API instead. The common thread is that every one of these either renders to a GUI, jumps out of the controlled stack, or reaches data behind SAP's back — all incompatible with an upgrade-stable contract.",
          "The full forbidden set ships with the kernel (inspectable via `cl_abap_restriction_descr_factory`), but in day-to-day work the ATC check variant `ABAP_CLOUD_DEVELOPMENT_DEFAULT` is the practical source of truth: it is what gates your transports and your pipeline, and it grows stricter with each release, so a package that is clean today can surface new findings after an FPS.",
        ],
        keyPoints: [
          "These are syntax errors, not warnings: WRITE/LIST-PROCESSING, CALL TRANSACTION/SUBMIT/LEAVE TO TRANSACTION.",
          "Also forbidden: CALL SCREEN/SET SCREEN/CALL DIALOG, CALL FUNCTION ... DESTINATION, and macros.",
          "Native SQL (EXEC SQL), held cursors, and IMPORT/EXPORT FROM MEMORY or SHARED BUFFER are out too.",
          "ATC variant ABAP_CLOUD_DEVELOPMENT_DEFAULT is the practical source of truth for what is allowed.",
          "The variant gains checks each release — a green pipeline today can red after an FPS.",
        ],
        examples: [
          {
            title: "A classic control-flow snippet",
            variant: "before",
            lang: "ABAP",
            body: "Valid Standard ABAP, every line a syntax error in a Cloud Development package: list output, a transaction launch, a memory tunnel, and a macro.",
            code: [
              "write: / 'Posting order'.",
              "call transaction 'va01'.",
              "export lt_buffer to memory id 'ZORD'.",
              "define add_one.",
              "  &1 = &1 + 1.",
              "end-of-definition.",
            ].join("\n"),
          },
          {
            title: "The Cloud-clean shape",
            variant: "after",
            lang: "ABAP",
            body: "Output goes through a released log API; navigation moves to Fiori + released services; state passes as typed method parameters; the macro becomes a normal method call.",
            code: [
              "data(log) = cl_bali_log=>create( ).",
              '" hand data on as typed parameters, not via memory',
              "data(result) = me->process_order( lt_orders ).",
              '" no macros: add_one becomes a real method',
              "data(next) = me->increment( current ).",
            ].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "In a Cloud Development package, classic statements like WRITE, CALL TRANSACTION, CALL SCREEN, CALL FUNCTION DESTINATION, macros, EXEC SQL and IMPORT/EXPORT FROM MEMORY are syntax errors — ATC variant ABAP_CLOUD_DEVELOPMENT_DEFAULT is the source of truth.",
          analogy:
            "The compiler is a customs officer that simply will not let the contraband statements cross the border.",
        },
        deeper: {
          paragraphs: [
            "Why a syntax error rather than a runtime check? Because the language version is a compile-time contract: if forbidden constructs cannot even be activated, there is no path by which non-Clean-Core code reaches production. ATC then provides the cross-object and consumption-level checks (like referencing a C2 type) that the single-statement syntax rules cannot express on their own.",
          ],
          keyPoints: [
            "cl_abap_restriction_descr_factory exposes the kernel-shipped restriction set programmatically.",
            "AUTHORITY-CHECK against non-released objects is forbidden; use the released auth API.",
          ],
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Which group of statements is forbidden (a syntax error) in an ABAP-for-Cloud-Development package?",
            options: {
              A: "DATA, SELECT ... INTO TABLE, and LOOP AT ... ASSIGNING.",
              B: "TRY/CATCH and RAISE EXCEPTION TYPE.",
              C: "CALL TRANSACTION, CALL SCREEN, and EXEC SQL.",
              D: "READ ENTITIES and MODIFY ENTITIES.",
            },
            correct: "C",
            explanations: {
              A: "These are core, allowed statements in ABAP Cloud.",
              B: "Class-based exception handling is fully allowed.",
              C: "Correct — transaction launches, classic dynpro screens, and native SQL are all forbidden.",
              D: "READ/MODIFY ENTITIES are the sanctioned RAP data statements.",
            },
            principle:
              "Forbidden constructs render to GUI, jump out of the stack, or reach data behind SAP's back.",
          },
          {
            n: 2,
            question:
              "How does a Cloud Development package treat `export ... to memory id '...'`?",
            options: {
              A: "It is a syntax error — ABAP/shared-memory transfer is forbidden.",
              B: "It compiles but logs an ATC warning at runtime.",
              C: "It is allowed only inside RAP handlers.",
              D: "It is silently converted to a database write.",
            },
            correct: "A",
            explanations: {
              A: "Correct — IMPORT/EXPORT FROM MEMORY and SHARED BUFFER are on the forbidden list and fail to compile.",
              B: "It does not compile at all, so there is no runtime warning.",
              C: "It is forbidden everywhere in the package, including handlers.",
              D: "There is no automatic conversion; pass data as typed parameters.",
            },
            principle:
              "Memory/shared-buffer tunnelling is forbidden; pass state through typed parameters.",
          },
          {
            n: 3,
            question:
              "What is the practical source of truth for what a Cloud Development package allows?",
            options: {
              A: "Transaction SE80's object list.",
              B: "The DEFAULT ATC variant.",
              C: "Whatever the developer's local Eclipse settings permit.",
              D: "The ATC check variant ABAP_CLOUD_DEVELOPMENT_DEFAULT.",
            },
            correct: "D",
            explanations: {
              A: "SE80 is a classic navigation tool, not the Clean Core ruleset.",
              B: "DEFAULT is broad and not Clean Core specific.",
              C: "Local editor settings do not define the contract; the central variant does.",
              D: "Correct — ABAP_CLOUD_DEVELOPMENT_DEFAULT is the authoritative variant and gains checks each release.",
            },
            principle:
              "ABAP_CLOUD_DEVELOPMENT_DEFAULT is the authoritative, evolving Clean Core check variant.",
          },
        ],
      },
      exercise: {
        id: "m04-c3-ex",
        lang: "ABAP",
        prompt:
          "Macros (DEFINE ... END-OF-DEFINITION) are on the forbidden list for ABAP for Cloud Development — abaplint flags the DEFINE. Replace the macro with plain inline ABAP so the method reads straight through, then re-check until it's clean.",
        flaggedRules: ["avoid_use"],
        hint: "Delete the DEFINE/END-OF-DEFINITION block and its call, and write the one line it expanded to directly: rv_x = iv_x + 1.",
        successNote:
          "Macros hide control flow from the reader, the debugger, and the compiler. Inline ABAP is debuggable, refactorable, and Cloud-legal.",
        starterCode: [
          "class zcl_au_ex_mac definition public final create public.",
          "  public section.",
          "    class-methods bump",
          "      importing !iv_x type i",
          "      returning value(rv_x) type i.",
          "endclass.",
          "",
          "class zcl_au_ex_mac implementation.",
          "  method bump.",
          '    " TODO: macros are forbidden in ABAP for Cloud Development.',
          '    " Replace this DEFINE macro with inline ABAP.',
          "    define _add_one.",
          "      &1 = &1 + 1.",
          "    end-of-definition.",
          "    rv_x = iv_x.",
          "    _add_one rv_x.",
          "  endmethod.",
          "endclass.",
        ].join("\n"),
      },
    },
    {
      id: "m04-c4",
      code: "4.4",
      title: "BAdIs in ABAP Cloud",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §4.4",
        paragraphs: [
          "BAdIs remain the sanctioned way to inject custom logic into SAP standard from a cloud-clean package — but only through released enhancement spots. In ABAP Cloud, the enhancement-spot picker shows you only released spots (for example `badi_sd_sls_quotation`); unreleased spots simply are not visible, so you cannot accidentally hook into an internal extension point. Implementing one is ordinary work: you create an implementing class in your own package, and it activates fine as long as the BAdI's supertype interface is released.",
          "The subtle trap is filters. A released BAdI can still define filter values that are themselves unreleased — typed against a C2 constant from SAP standard. Writing your implementation's filter to match that SAP constant means your code references a C2 object, and that reference is a Clean Core violation even though the BAdI itself is released. ATC catches it under the cloud variant.",
          "The remediation is to declare your own constant in your package holding the literal filter value, use that, and document in a comment that it binds to the SAP value. You lose nothing functionally — the filter still matches at runtime — but your code no longer has a compile-time dependency on an unreleased SAP object, so an upgrade that re-types or renames the SAP constant cannot break you.",
        ],
        keyPoints: [
          "Only released enhancement spots are visible in a cloud package; unreleased spots cannot be picked.",
          "You can implement a released BAdI normally — its supertype interface being released is what matters.",
          "Caution: a released BAdI may expose UNRELEASED (C2) filter values.",
          "Referencing a C2 filter constant is a violation ATC flags, even though the BAdI is released.",
          "Fix: define your own constant for the filter value and document its binding to the SAP value.",
        ],
        examples: [
          {
            title: "Filter against a C2 SAP constant",
            variant: "before",
            lang: "ABAP",
            body: "The BAdI is released, but the filter value references an unreleased SAP standard constant — a Clean Core violation under the cloud ATC variant.",
            code: [
              "method if_badi_sd_sls_quotation~modify.",
              '  " filter bound to an unreleased C2 constant from SAP standard',
              "  if i_doc_category = if_sd_doc_categ_c=>quotation.",
              '    " ... custom logic',
              "  endif.",
              "endmethod.",
            ].join("\n"),
          },
          {
            title: "Own constant, documented binding",
            variant: "after",
            lang: "ABAP",
            body: "Define the literal in your own package and document that it binds to the SAP value; the runtime match is identical, the compile-time C2 dependency is gone.",
            code: [
              "constants c_doc_quotation type c length 1 value 'B'.",
              '" binds to SAP doc category Quotation (see released doc)',
              "method if_badi_sd_sls_quotation~modify.",
              "  if i_doc_category = c_doc_quotation.",
              '    " ... custom logic',
              "  endif.",
              "endmethod.",
            ].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "You can implement a released BAdI in a cloud-clean package, but if it exposes an unreleased (C2) filter value, define your own constant for that value instead of referencing the SAP one.",
          analogy:
            "The door (the BAdI) is officially open, but one of its keys is stamped 'internal use only' — cut your own copy of that key rather than borrowing theirs.",
        },
        deeper: {
          paragraphs: [
            "This mirrors the §1.4 pitfall that a C1 API can surface a C2 type: release state does not propagate transitively. A released spot guarantees the spot and its interface are stable, not every value, type, or constant reachable through it. The discipline is always 'check what you actually reference,' not 'trust the headline release state of the container.'",
          ],
          keyPoints: [
            "Release state is not transitive — a released BAdI does not bless its C2 filter values.",
            "Documenting the binding keeps the future maintainer's mapping to the SAP value explicit.",
          ],
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Which enhancement spots are visible to implement from within an ABAP Cloud package?",
            options: {
              A: "Only released enhancement spots.",
              B: "All enhancement spots in the system.",
              C: "Only spots in the customer namespace.",
              D: "None — BAdIs are forbidden in ABAP Cloud.",
            },
            correct: "A",
            explanations: {
              A: "Correct — the picker shows only released spots; unreleased ones are hidden.",
              B: "Unreleased spots are deliberately not shown.",
              C: "Visibility is governed by release state, not namespace.",
              D: "Released BAdIs are explicitly a sanctioned extension mechanism.",
            },
            principle:
              "Cloud packages can consume only released enhancement spots.",
          },
          {
            n: 2,
            question:
              "A released BAdI defines a filter value typed against a C2 SAP constant, and your implementation references that constant. What happens?",
            options: {
              A: "Nothing — because the BAdI is released, everything it exposes is released too.",
              B: "ATC flags your reference to the C2 constant as a Clean Core violation.",
              C: "The BAdI is automatically downgraded to C2.",
              D: "The filter is ignored at runtime.",
            },
            correct: "B",
            explanations: {
              A: "Release state is not transitive — a released BAdI does not bless its C2 filter values.",
              B: "Correct — referencing the unreleased constant is a violation ATC catches under the cloud variant.",
              C: "ATC reports findings; it does not change contracts.",
              D: "The filter still matches at runtime; the problem is the compile-time C2 dependency.",
            },
            principle:
              "A released BAdI can still expose unreleased filter values — check what you reference.",
          },
          {
            n: 3,
            question:
              "What is the correct remediation when a released BAdI's needed filter value is a C2 constant?",
            options: {
              A: "Request an exemption and reference the C2 constant anyway.",
              B: "Stop using the BAdI entirely.",
              C: "Define your own constant for the filter value and document its binding to the SAP value.",
              D: "Copy the SAP standard interface into your package.",
            },
            correct: "C",
            explanations: {
              A: "An exemption hides the finding but keeps the brittle C2 dependency; it is not the fix.",
              B: "The BAdI is released and fine to use; only the C2 reference is the problem.",
              C: "Correct — declare your own constant with the literal value and document the binding, removing the C2 dependency.",
              D: "Copying SAP standard objects is a modification and will not compile in a cloud package.",
            },
            principle:
              "Replace a C2 filter reference with your own documented constant to break the unreleased dependency.",
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
          "Which artefact is the per-service, read-write contract over the interface model in a managed RAP BO?",
        options: {
          A: "The persistence table.",
          B: "The behavior pool class.",
          C: "The service binding.",
          D: "The projection view with provider contract transactional_query.",
        },
        correct: "D",
        explanations: {
          A: "The table is persistence, not the consumed contract.",
          B: "The behavior pool implements behavior; it is not the projection contract.",
          C: "The binding fixes the protocol; the contract is the projection view.",
          D: "Correct — the projection view declared transactional_query is the per-service read-write contract.",
        },
        principle:
          "The projection view is the per-service contract over the interface model.",
      },
      {
        n: 2,
        question:
          "Inside a behavior handler, how do you read the BO's data?",
        options: {
          A: "With SELECT directly against the persistence table.",
          B: "With CALL FUNCTION to a released read module.",
          C: "With READ ENTITIES OF ... IN LOCAL MODE.",
          D: "With an AMDP procedure.",
        },
        correct: "C",
        explanations: {
          A: "Direct SQL is not the RAP access path inside a handler.",
          B: "Handlers use the BO runtime, not function-module reads.",
          C: "Correct — READ ENTITIES ... IN LOCAL MODE is the sanctioned read inside a handler.",
          D: "AMDP is for code pushdown, not behavior-handler reads.",
        },
        principle:
          "Behavior handlers read and write only through READ/MODIFY ENTITIES in local mode.",
      },
      {
        n: 3,
        question:
          "Which statement is a syntax error in an ABAP-for-Cloud-Development package?",
        options: {
          A: "CALL TRANSACTION 'VA01'.",
          B: "SELECT FROM i_material INTO TABLE @DATA(lt).",
          C: "DATA(log) = cl_bali_log=>create( ).",
          D: "TRY. ... CATCH cx_root. ... ENDTRY.",
        },
        correct: "A",
        explanations: {
          A: "Correct — CALL TRANSACTION is on the forbidden list and fails to compile.",
          B: "Reading a released CDS view is allowed.",
          C: "Consuming a released class is exactly what Restricted ABAP permits.",
          D: "Class-based exception handling is allowed.",
        },
        principle:
          "Transaction launches are forbidden; released APIs and core language are fine.",
      },
      {
        n: 4,
        question:
          "What does `strict ( 2 )` do in a RAP behavior definition?",
        options: {
          A: "It disables all validations.",
          B: "It enables the latest syntax checks and forbids deprecated patterns.",
          C: "It switches the BO from managed to unmanaged.",
          D: "It exposes the BO as SOAP.",
        },
        correct: "B",
        explanations: {
          A: "It does not disable validations; it tightens checks.",
          B: "Correct — strict(2) turns on the newest checks and rejects deprecated patterns.",
          C: "The managed/unmanaged choice is separate from strict mode.",
          D: "Protocol is set by the binding, not by strict mode.",
        },
        principle:
          "strict ( 2 ) is the current strict mode for new RAP code.",
      },
      {
        n: 5,
        question:
          "A released BAdI needs a filter value that is a C2 SAP constant. The Clean Core fix is to…",
        options: {
          A: "define your own constant for the value and document its binding to the SAP value.",
          B: "reference the C2 constant and add a pragma.",
          C: "abandon the BAdI implementation.",
          D: "copy the SAP interface into your package.",
        },
        correct: "A",
        explanations: {
          A: "Correct — your own documented constant removes the unreleased C2 dependency while matching at runtime.",
          B: "A pragma does not remove the brittle dependency on an unreleased object.",
          C: "The BAdI is released and usable; only the C2 reference is the issue.",
          D: "Copying SAP standard is a modification and will not compile.",
        },
        principle:
          "Break the C2 dependency with your own constant; don't suppress or abandon.",
      },
    ],
  },
};
