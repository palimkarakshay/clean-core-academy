/* ------------------------------------------------------------------
   Module 12 — How-To Recipes.

   Source brief: §12 of the Clean Core & HANA Readiness curriculum.
   Audience: new + intermediate builders, plus admins running the
   tooling. These concepts are step-by-step procedures: the lesson
   paragraphs carry the rationale ("why each step exists") and the
   keyPoints carry the ordered, numbered steps the learner follows in
   ADT / ATC / the pipeline. Every concept ships paragraphs +
   keyPoints + simplified.oneLiner and a 3-question quiz with
   per-option explanations; code-bearing recipes add before/after (or
   neutral) examples in lowercase ABAP against S/4HANA 2023
   (SAP_BASIS 758).
------------------------------------------------------------------ */

import type { Section } from "../_types";

export const m12Recipes: Section = {
  id: "m12-recipes",
  n: 12,
  title: "How-To Recipes",
  sourceCourse: "clean-core-curriculum §12",
  audiences: ["new", "intermediate", "admin"],
  skills: [
    {
      id: "m12-s1",
      label: "Release an object as a C1 API so downstream code can consume it",
      conceptId: "m12-c1",
    },
    {
      id: "m12-s2",
      label: "Run remote ATC against a package and create a findings baseline",
      conceptId: "m12-c2",
    },
    {
      id: "m12-s3",
      label: "Refactor a FORM/PERFORM program into a class with one method per FORM",
      conceptId: "m12-c3",
    },
    {
      id: "m12-s4",
      label: "Write a CDS unit test with cl_cds_test_environment and assert results",
      conceptId: "m12-c4",
    },
    {
      id: "m12-s5",
      label: "Wire static lint and remote ATC into a CI/CD pull-request gate",
      conceptId: "m12-c5",
    },
    {
      id: "m12-s6",
      label: "Write a client-safe AMDP that filters MANDT explicitly",
      conceptId: "m12-c6",
    },
  ],
  blurb:
    "Six common modernization jobs, broken into ordered, repeatable steps a developer can follow start to finish. Each recipe is a procedure a senior ABAP developer runs by hand: release an object as a stable interface, run a code-quality scan and baseline it, convert old procedural code into classes, add an automated test for a data model, gate a delivery pipeline on quality checks, and write a multi-tenant-safe database procedure. The rationale is in the prose; the ordered steps are in the key points.",
  concepts: [
    {
      id: "m12-c1",
      code: "12.1",
      title: "Release an object for downstream consumption",
      bloom: "A",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §12.1",
        paragraphs: [
          "Publishing an object as a released API is the act that turns your code into a contract other components can depend on. Until you do it, the object carries no API State, and any ABAP-Cloud package that consumes it raises a Clean Core violation — the consumer can only reach released (C1) objects.",
          "The release lives on the object itself, edited in the ADT Properties view under API State. You set the Release State to 'Released' (specifically, Released for ABAP for Cloud Development) and choose the Release Contract, which for in-stack developer extensibility is normally C1. The contract is a promise: SAP-style stability guarantees now apply to your signature within that contract.",
          "Releasing is not free. Once an object is C1 you owe downstream consumers signature stability across your own upgrades, so release deliberately — interface classes and CDS views, not every helper. The moment you activate, the object appears in the Released APIs browse list under the system node and its API State is visible to every consumer.",
        ],
        keyPoints: [
          "1. In ADT, open the object and go to Properties → API State.",
          "2. Set the Release State to 'Released' (Released for ABAP for Cloud Development).",
          "3. Choose the Release Contract — C1 for normal developer-extensibility consumption.",
          "4. Activate the object.",
          "5. Confirm it now appears in the Released APIs list and its API State is visible to consumers.",
        ],
        simplified: {
          oneLiner:
            "Open the object's Properties → API State, set it to Released with contract C1, and activate — now it shows up in the Released APIs list for everyone to consume.",
          analogy:
            "It is like publishing a library version: once tagged, callers can rely on the signature and you promise not to break it.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "In ADT, where do you set an object's release so downstream ABAP Cloud code can consume it?",
            options: {
              A: "In transaction SE93, the transaction-code maintenance screen.",
              B: "In the abapGit repository settings.",
              C: "In the ATC Run Configuration.",
              D: "In the object's Properties view, under API State.",
            },
            correct: "D",
            explanations: {
              A: "SE93 maintains transaction codes, not API release state.",
              B: "abapGit versions source; it does not set the API State.",
              C: "ATC checks consumption of released APIs; it does not publish them.",
              D: "Correct — the Release State is edited in Properties → API State on the object itself.",
            },
            principle:
              "Release State is a first-class property of the object, edited in ADT Properties → API State.",
          },
          {
            n: 2,
            question:
              "Which Release Contract do you normally choose when releasing an in-stack object for developer extensibility?",
            options: {
              A: "C1 — Released for Cloud Development.",
              B: "C0 — not released.",
              C: "C2 — use system-internal.",
              D: "C3 — deprecated.",
            },
            correct: "A",
            explanations: {
              A: "Correct — C1 is the cloud-safe contract consumers are allowed to depend on.",
              B: "C0 means not released — it would not be consumable at all.",
              C: "C2 is internal and unstable; you would not publish a new API as C2.",
              D: "C3 marks something deprecated; you do not release fresh code as deprecated.",
            },
            principle: "Publish new consumable APIs under the C1 contract.",
          },
          {
            n: 3,
            question:
              "What happens immediately after you activate a newly released object?",
            options: {
              A: "ATC permanently exempts every consumer of it.",
              B: "It is deleted from the system library.",
              C: "It appears in the Released APIs browse list and its API State is visible to consumers.",
              D: "All non-released objects in the package are auto-released too.",
            },
            correct: "C",
            explanations: {
              A: "Releasing publishes a contract; it does not create ATC exemptions.",
              B: "Activation publishes the object, it does not remove it.",
              C: "Correct — once activated, the release publishes to the Released APIs list and the API State is visible to all consumers.",
              D: "Release is per object; activating one does not cascade to the whole package.",
            },
            principle:
              "Activation publishes the release: the object joins the Released APIs list with a visible API State.",
          },
        ],
      },
    },
    {
      id: "m12-c2",
      code: "12.2",
      title: "Run remote ATC and create a baseline",
      bloom: "A",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §12.2",
        paragraphs: [
          "Remote ATC is the production topology: a central ATC system (usually the DevOps/QA stack) runs checks against the source code on remote systems over RFC, because that central system is where the Simplification Database lives. Before anything else you confirm the RFC destination to the source system is set up, so the central checker can actually reach the code.",
          "You then describe the run with an ATC Run Configuration: the Object Set names the remote package to check, and the Check Variant names the rule set. For S/4HANA migration readiness that variant is S4HANA_READINESS_2023, the release-aligned Simplification and HANA-readiness checks. Executing it populates the ATC Results view, from which you can double-click straight into the remote source.",
          "A first run against four million lines is a wall of red, so the second half of the recipe is a baseline. From ATC Results you create a baseline, which snapshots today's findings as accepted debt; every subsequent run against the same scope then shows only the deltas — the new debt the team just introduced — so reviewers are never drowned by pre-existing findings.",
        ],
        keyPoints: [
          "1. In the central ATC system, confirm the RFC destination to the source system is configured.",
          "2. Create a new ATC Run Configuration with Object Set = the remote package.",
          "3. Set the Check Variant to S4HANA_READINESS_2023.",
          "4. Execute the run; results land in the ATC Results view.",
          "5. In ATC Results, choose Baseline → Create Baseline so subsequent runs show only deltas.",
        ],
        simplified: {
          oneLiner:
            "Point the central ATC system at the remote package over RFC, run the S4HANA_READINESS_2023 variant, then create a baseline so future runs only flag new debt.",
          analogy:
            "The baseline is like marking all current bug-tracker tickets as 'known' so tomorrow you only see the ones filed today.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Why does remote ATC run from a central system rather than each developer's box?",
            options: {
              A: "Because developers are not allowed to run ATC locally at all.",
              B: "Because the central system hosts the Simplification Database and reaches source systems over RFC.",
              C: "Because RFC is faster than running checks in-stack.",
              D: "Because baselines can only be created in Eclipse.",
            },
            correct: "B",
            explanations: {
              A: "Local ATC still exists for individual objects; remote is the team-wide topology, not a ban on local runs.",
              B: "Correct — the central ATC system holds the Simplification Database and checks remote source via RFC.",
              C: "Remote checking is not chosen for raw speed; it centralises the check infrastructure and rule database.",
              D: "Baselines live in the central ATC system, not the Eclipse workspace.",
            },
            principle:
              "Central/remote ATC centralises the Simplification Database and reaches source systems via RFC.",
          },
          {
            n: 2,
            question:
              "Which Check Variant does the recipe use for S/4HANA migration readiness?",
            options: {
              A: "ABAP_CLOUD_DEVELOPMENT_DEFAULT.",
              B: "PERFORMANCE_DB.",
              C: "SECURITY_CHECK.",
              D: "S4HANA_READINESS_2023.",
            },
            correct: "D",
            explanations: {
              A: "That variant enforces ABAP Cloud restrictions, not the release-aligned Simplification readiness checks.",
              B: "PERFORMANCE_DB is the DB-performance variant, a different concern.",
              C: "SECURITY_CHECK runs CVA security checks, not readiness.",
              D: "Correct — S4HANA_READINESS_2023 is the release-aligned Simplification and HANA-readiness variant.",
            },
            principle:
              "Readiness scoping uses the release-aligned S4HANA_READINESS_2023 variant.",
          },
          {
            n: 3,
            question:
              "After creating a baseline, what do subsequent ATC runs against the same scope show?",
            options: {
              A: "Only delta findings — the new debt introduced since the baseline.",
              B: "Nothing — the baseline silences all future findings.",
              C: "Every finding again, baseline or not.",
              D: "Only findings the approver has signed off.",
            },
            correct: "A",
            explanations: {
              A: "Correct — the baseline snapshots existing findings so only new (delta) findings surface afterwards.",
              B: "A baseline hides known debt, not new debt — it does not silence everything.",
              C: "Showing everything again defeats the purpose of a baseline.",
              D: "That describes the exemption workflow, not a baseline.",
            },
            principle:
              "A baseline accepts today's debt so future runs surface only the deltas.",
          },
        ],
      },
    },
    {
      id: "m12-c3",
      code: "12.3",
      title: "Migrate FORM/PERFORM to classes",
      bloom: "A",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §12.4",
        paragraphs: [
          "FORM/PERFORM is a procedural smell that ABAP Cloud forbids outright: subroutines and the global program state they lean on do not exist in a class-based, restricted world. Migrating them is a mechanical refactor, but the discipline is to keep behaviour identical at each step so ATC and your tests stay the arbiter, not your memory of what the program did.",
          "Start by reading each FORM as a unit of responsibility: what does it take in, what does it change, what does it return. You then create a ZCL_ class with one public method per FORM, initially mirroring the FORM's signature so the mapping is one-to-one. Move each FORM body into its method and replace every PERFORM with the corresponding method call.",
          "The real work is killing global state. Classic programs share data through global variables; the class equivalent is instance attributes for genuinely shared state and explicit parameters for everything else. Once the bodies are in and globals are pulled in, run ATC to surface obsolete-API findings exposed by the move, fix them, and only then delete the FORM scaffolding — when nothing references it anymore.",
        ],
        keyPoints: [
          "1. Identify each FORM's responsibilities and its inputs/outputs.",
          "2. Create a ZCL_ class with one public method per FORM, mirroring the signatures.",
          "3. Move each FORM body into its method and replace PERFORM calls with method calls.",
          "4. Pull global state into instance attributes or method parameters.",
          "5. Run ATC and fix the obsolete-API findings the move exposes.",
          "6. Delete the original FORM scaffolding once nothing references it.",
        ],
        examples: [
          {
            title: "A FORM and its PERFORM caller",
            variant: "before",
            lang: "ABAP",
            body: "Classic procedural style: a subroutine mutating a global, invoked with perform. Forbidden in ABAP Cloud and a Clean Core smell.",
            code: [
              "data gv_total type p decimals 2.",
              "",
              "perform add_line using ls_item-amount.",
              "",
              "form add_line using iv_amount type p.",
              "  gv_total = gv_total + iv_amount.",
              "endform.",
            ].join("\n"),
          },
          {
            title: "One method per FORM, no global",
            variant: "after",
            lang: "ABAP",
            body: "The FORM becomes a public method; the global becomes an instance attribute; perform becomes a method call.",
            code: [
              "class zcl_order_totals definition public.",
              "  public section.",
              "    methods add_line importing iv_amount type p.",
              "  private section.",
              "    data mv_total type p decimals 2.",
              "endclass.",
              "",
              "class zcl_order_totals implementation.",
              "  method add_line.",
              "    mv_total = mv_total + iv_amount.",
              "  endmethod.",
              "endclass.",
              "",
              "go_totals->add_line( ls_item-amount ).",
            ].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "Map each FORM to one public method on a ZCL_ class, turn PERFORM into method calls, replace globals with attributes/parameters, then ATC and delete the old FORMs.",
          analogy:
            "It is like turning loose shared sticky-notes (globals) into a tidy object that owns its own data and exposes named actions.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "When migrating, how should each FORM map onto the new ZCL_ class?",
            options: {
              A: "All FORMs collapse into a single do-everything method.",
              B: "Each FORM becomes a separate global program include.",
              C: "Each FORM becomes one public method, initially mirroring its signature.",
              D: "Each FORM becomes a database table.",
            },
            correct: "C",
            explanations: {
              A: "Collapsing them loses the one-to-one mapping that keeps the refactor verifiable.",
              B: "Includes are still procedural program structure, not the class-based target.",
              C: "Correct — one public method per FORM, mirroring the signature, keeps the migration mechanical and checkable.",
              D: "A FORM is behaviour, not data; it does not become a table.",
            },
            principle:
              "One public method per FORM keeps the refactor one-to-one and verifiable.",
          },
          {
            n: 2,
            question:
              "How does the recipe handle the global variables a classic program shared between FORMs?",
            options: {
              A: "Leave them global; classes can read program globals directly.",
              B: "Pull them into instance attributes or method parameters.",
              C: "Move them into EXPORT TO MEMORY.",
              D: "Store them in a custom database table per run.",
            },
            correct: "B",
            explanations: {
              A: "Restricted ABAP and class encapsulation do not let methods lean on program globals.",
              B: "Correct — shared state becomes instance attributes; the rest becomes explicit parameters.",
              C: "IMPORT/EXPORT FROM MEMORY is itself forbidden in ABAP Cloud.",
              D: "Persisting transient state to a table changes behaviour and is unnecessary.",
            },
            principle:
              "Eliminate global state by promoting it to attributes or passing it as parameters.",
          },
          {
            n: 3,
            question:
              "At what point in the recipe do you delete the original FORM scaffolding?",
            options: {
              A: "First, before writing any methods, to force the rewrite.",
              B: "Once all references are migrated and nothing calls the FORMs anymore.",
              C: "Never — the FORMs must remain for backward compatibility.",
              D: "Immediately after creating the class, before moving any bodies.",
            },
            correct: "B",
            explanations: {
              A: "Deleting first leaves the program non-compiling and untestable mid-refactor.",
              B: "Correct — you delete the FORM scaffolding only after every reference is migrated.",
              C: "The whole point is to remove the procedural code; FORMs are forbidden in ABAP Cloud.",
              D: "Bodies still need to move into methods first; deleting early loses the source.",
            },
            principle:
              "Remove the FORM scaffolding last — only once nothing references it.",
          },
        ],
      },
    },
    {
      id: "m12-c4",
      code: "12.4",
      title: "Write a CDS unit test",
      bloom: "A",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §12.5",
        paragraphs: [
          "A CDS view embeds logic — joins, aggregations, filters — that you cannot trust to be correct just because it activates. The CDS Test Double Framework lets you unit-test that logic in isolation: it builds a test schema, injects rows you control, runs your SELECT against the entity, and lets you assert on the result, all without depending on whatever happens to be in the real tables.",
          "The test class is declared FOR TESTING RISK LEVEL HARMLESS because it touches no productive data — only the generated test doubles. You create the environment with cl_cds_test_environment=>create( i_for_entity = '...' ), naming the CDS entity under test, then seed it with insert_test_data passing a table of rows for the underlying source.",
          "With data in place you SELECT from the entity exactly as production code would and assert the outcome with cl_abap_unit_assert — typically assert_equals on a row count or an aggregated value. The one piece teams forget is teardown: call lo_env->destroy( ) so the generated doubles are cleaned up and tests stay independent of one another.",
        ],
        keyPoints: [
          "1. Declare the test class FOR TESTING RISK LEVEL HARMLESS.",
          "2. Build the environment with cl_cds_test_environment=>create( i_for_entity = '...' ).",
          "3. Seed rows via lo_env->insert_test_data( ... ).",
          "4. SELECT from the CDS entity under test.",
          "5. Assert the result with cl_abap_unit_assert.",
          "6. Call lo_env->destroy( ) in teardown.",
        ],
        examples: [
          {
            title: "A self-contained CDS unit test",
            variant: "neutral",
            lang: "ABAP",
            body: "Create the test double for the entity, inject two rows, query, and assert that only the OPEN order is aggregated; destroy in teardown.",
            code: [
              "class ltc_open_orders definition for testing risk level harmless duration short.",
              "  private section.",
              "    class-data go_env type ref to if_cds_test_environment.",
              "    class-methods class_setup.",
              "    class-methods class_teardown.",
              "    methods aggregates_only_open for testing.",
              "endclass.",
              "",
              "class ltc_open_orders implementation.",
              "  method class_setup.",
              "    go_env = cl_cds_test_environment=>create( i_for_entity = 'ZI_OPENORDERSBYCUSTOMER' ).",
              "  endmethod.",
              "",
              "  method aggregates_only_open.",
              "    go_env->insert_test_data( value zorder_hdr_t(",
              "      ( client = sy-mandt orderid = '01' customerid = 'c1' total = 100 status = 'OPEN' )",
              "      ( client = sy-mandt orderid = '02' customerid = 'c1' total = 50  status = 'CLOSED' ) ) ).",
              "",
              "    select * from zi_openordersbycustomer into table @data(lt_actual).",
              "",
              "    cl_abap_unit_assert=>assert_equals( exp = 1 act = lines( lt_actual ) ).",
              "  endmethod.",
              "",
              "  method class_teardown.",
              "    go_env->destroy( ).",
              "  endmethod.",
              "endclass.",
            ].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "Spin up cl_cds_test_environment for the entity, inject known rows, SELECT, assert with cl_abap_unit_assert, and destroy the environment in teardown.",
          analogy:
            "It is a flight simulator for your CDS view: controlled inputs, no real-world data, and you reset the cockpit when you are done.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Which class builds the isolated test schema for a CDS unit test?",
            options: {
              A: "cl_salv_table.",
              B: "cl_abap_typedescr.",
              C: "cl_gui_frontend_services.",
              D: "cl_cds_test_environment.",
            },
            correct: "D",
            explanations: {
              A: "cl_salv_table renders ALV grids; it has nothing to do with CDS testing.",
              B: "cl_abap_typedescr is runtime type introspection, not a test environment.",
              C: "Front-end services are forbidden in ABAP Cloud and unrelated to CDS testing.",
              D: "Correct — cl_cds_test_environment=>create( i_for_entity = '...' ) generates the isolated test schema.",
            },
            principle:
              "cl_cds_test_environment generates a controlled schema so a CDS view can be tested in isolation.",
          },
          {
            n: 2,
            question:
              "What risk level is appropriate for a CDS unit test that touches only generated test doubles?",
            options: {
              A: "RISK LEVEL HARMLESS.",
              B: "RISK LEVEL CRITICAL.",
              C: "RISK LEVEL DANGEROUS.",
              D: "No risk level is allowed on CDS tests.",
            },
            correct: "A",
            explanations: {
              A: "Correct — because no productive data is touched, the test is declared FOR TESTING RISK LEVEL HARMLESS.",
              B: "CRITICAL signals tests that change persistent customizing or repository data — not the case here.",
              C: "DANGEROUS signals tests that change persistent application data — the test doubles are isolated, so this is wrong.",
              D: "A risk level is exactly what the test class declares; it is required, not forbidden.",
            },
            principle:
              "Test-double-only CDS tests are HARMLESS — they touch no productive data.",
          },
          {
            n: 3,
            question:
              "Why must the test call lo_env->destroy( ) in teardown?",
            options: {
              A: "To commit the test rows to the productive tables.",
              B: "To clean up the generated test doubles and keep tests independent.",
              C: "To release the CDS view as a C1 API.",
              D: "To trigger an ATC run.",
            },
            correct: "B",
            explanations: {
              A: "The framework never writes to productive tables; there is nothing to commit there.",
              B: "Correct — destroy( ) tears down the generated doubles so one test does not leak state into the next.",
              C: "Releasing an API is unrelated to test teardown.",
              D: "destroy( ) cleans up the environment; it does not start ATC.",
            },
            principle:
              "Tearing down the environment keeps unit tests isolated and repeatable.",
          },
        ],
      },
    },
    {
      id: "m12-c5",
      code: "12.5",
      title: "ATC in a CI/CD pipeline",
      bloom: "A",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §12.6",
        paragraphs: [
          "Shifting quality left means catching findings before they ever reach a transport. With the source mirrored to git via abapGit, an external CI runner can react to a pull request and run two complementary checks: a fast static lint that needs no SAP system, and the authoritative remote ATC that does.",
          "The static stage runs abaplint with --format=json so the runner can parse findings programmatically — it catches style and many ATC-equivalent issues offline, in seconds, on the PR branch. The authoritative stage then invokes remote ATC through the Code Inspector RFC against the package, applying the same rule set the central system enforces.",
          "The gate is a policy decision: the pipeline fails when findings exceed an agreed severity threshold, so trivial warnings do not block merges but real violations do. Finally, log the ATC run id back onto the PR, so a reviewer can open the exact run that justified the green (or red) check and the audit trail is intact.",
        ],
        keyPoints: [
          "1. Keep the source in git via abapGit.",
          "2. On a pull request, run static lint with abaplint --format=json.",
          "3. Run remote ATC via the Code Inspector RFC against the package.",
          "4. Fail the pipeline when findings exceed the agreed severity threshold.",
          "5. Log the ATC run id on the PR for traceability.",
        ],
        simplified: {
          oneLiner:
            "On each PR, run abaplint (--format=json) plus remote ATC over the Code Inspector RFC, fail above an agreed severity, and log the ATC run id back on the PR.",
          analogy:
            "abaplint is the spell-checker that runs as you type; remote ATC is the editor's sign-off before the article can be published.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "What is the role of the abaplint --format=json stage in the pipeline?",
            options: {
              A: "It deploys the transport to production.",
              B: "It is the only authoritative Clean Core gate, replacing ATC entirely.",
              C: "It runs fast, offline static lint whose JSON output the runner can parse.",
              D: "It creates the ATC baseline.",
            },
            correct: "C",
            explanations: {
              A: "Linting does not deploy anything; it inspects source.",
              B: "abaplint complements ATC but does not replace the authoritative remote ATC run.",
              C: "Correct — abaplint runs offline against git source and emits JSON the CI runner consumes.",
              D: "Baselines are an ATC concept, created in the central ATC system, not by abaplint.",
            },
            principle:
              "abaplint gives a fast, machine-readable, SAP-system-free first pass on the PR.",
          },
          {
            n: 2,
            question:
              "How does the pipeline invoke the authoritative ATC check against the package?",
            options: {
              A: "Via the Code Inspector RFC into the SAP system.",
              B: "By scraping the SAP GUI screen with a UI bot.",
              C: "By querying api.sap.com over HTTPS.",
              D: "By reading the abaplint.json file a second time.",
            },
            correct: "A",
            explanations: {
              A: "Correct — the runner calls remote ATC through the Code Inspector RFC against the package.",
              B: "ATC has a programmatic RFC entry point; screen-scraping is neither needed nor reliable.",
              C: "api.sap.com is the public API catalog, not your system's ATC engine.",
              D: "Re-reading the lint output is not an ATC run; ATC is a separate, authoritative stage.",
            },
            principle:
              "Remote ATC is invoked programmatically through the Code Inspector RFC.",
          },
          {
            n: 3,
            question:
              "What does the recipe log back onto the pull request, and why?",
            options: {
              A: "The full ABAP source, so reviewers need not open the system.",
              B: "Every developer's local ATC history.",
              C: "The contents of api.sap.com for the package.",
              D: "The ATC run id, so the exact run behind the check is traceable.",
            },
            correct: "D",
            explanations: {
              A: "The source already lives in git; duplicating it on the PR adds noise, not traceability.",
              B: "Local histories are not the authoritative pipeline run and are not what gets logged.",
              C: "The API catalog is not specific to this run and proves nothing about the gate.",
              D: "Correct — logging the ATC run id lets a reviewer open the exact run that gated the PR.",
            },
            principle:
              "Recording the ATC run id on the PR preserves a verifiable audit trail for the gate.",
          },
        ],
      },
    },
    {
      id: "m12-c6",
      code: "12.6",
      title: "Write an AMDP that respects MANDT",
      bloom: "A",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §12.8",
        paragraphs: [
          "Open SQL injects the client automatically, but AMDP does not: SQLScript runs on the database and sees the raw tables, so a careless table function returns rows from every client. A cross-client leak is a real defect, not a style nit, and the fix is to handle MANDT explicitly at three points that must agree.",
          "First, the client column must appear both in the table function's returns list and in the underlying source SELECT, so the client travels with each row. Second, you declare a parameter annotated @Environment.systemField: #CLIENT typed abap.clnt; the framework binds the caller's client into that parameter at runtime. Third, the SQLScript body filters on it explicitly with a predicate such as where mandt = :p_client.",
          "Because nothing in the language forces this, you confirm it with tooling: ATC's AMDP client-handling check flags a table function or procedure that reads a client-dependent table without filtering the client. Enable that check in your variant so the safety net catches the omission that the compiler will not.",
        ],
        keyPoints: [
          "1. Include the client column in both the returns list and the source SELECT.",
          "2. Declare a parameter with @Environment.systemField: #CLIENT typed abap.clnt.",
          "3. Filter explicitly in SQLScript: where mandt = :p_client.",
          "4. Confirm with ATC's AMDP client-handling check, enabled in your variant.",
        ],
        examples: [
          {
            title: "Cross-client leak — no MANDT filter",
            variant: "before",
            lang: "ABAP",
            body: "The SQLScript reads the raw table with no client predicate, so it returns rows from every client — a defect Open SQL would have prevented.",
            code: [
              "method get by database function for hdb",
              "           language sqlscript",
              "           options read-only",
              "           using zorder_hdr.",
              "  return",
              "    select order_id as \"OrderId\", kunnr as \"CustomerId\", total",
              "      from zorder_hdr;",
              "endmethod.",
            ].join("\n"),
          },
          {
            title: "Client-safe table function",
            variant: "after",
            lang: "ABAP",
            body: "The client is a #CLIENT parameter, carried in the returns list, and filtered explicitly with where mandt = :p_client.",
            code: [
              "define table function zi_orderranking",
              "  with parameters",
              "    @Environment.systemField: #CLIENT",
              "    p_client : abap.clnt",
              "  returns {",
              "    client     : abap.clnt;",
              "    orderid    : zorder_id;",
              "    customerid : kunnr;",
              "  }",
              "  implemented by method zcl_order_ranking=>get;",
              "",
              "method get by database function for hdb",
              "           language sqlscript",
              "           options read-only",
              "           using zorder_hdr.",
              "  return",
              "    select mandt as client, order_id as \"orderid\", kunnr as \"customerid\"",
              "      from zorder_hdr",
              "      where mandt = :p_client;",
              "endmethod.",
            ].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "AMDP has no implicit client, so carry the client column in the returns list, take it as a @Environment.systemField #CLIENT parameter, filter where mandt = :p_client, and let ATC's AMDP check confirm it.",
          analogy:
            "Open SQL stamps your client on every query for you; in AMDP you are the rubber stamp, and you must apply it by hand.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Why must an AMDP filter MANDT explicitly when Open SQL does not?",
            options: {
              A: "Because AMDP runs on the application server where the client is undefined.",
              B: "Because SQLScript runs on the database and has no implicit client injection, so it sees all clients.",
              C: "Because MANDT was removed from S/4HANA tables.",
              D: "Because ATC rewrites the SELECT automatically at activation.",
            },
            correct: "B",
            explanations: {
              A: "AMDP runs on the database, not the application server, and that is precisely why the client is not injected.",
              B: "Correct — SQLScript executes in HANA against raw tables with no implicit MANDT, so an unfiltered read crosses clients.",
              C: "Client-dependent tables still carry MANDT in S/4HANA; it was not removed.",
              D: "ATC reports the missing filter; it does not silently rewrite your code.",
            },
            principle:
              "AMDP runs on the DB with no implicit client, so client handling is the developer's responsibility.",
          },
          {
            n: 2,
            question:
              "How is the caller's client made available inside the table function?",
            options: {
              A: "By reading sy-mandt directly inside the SQLScript.",
              B: "By hard-coding the productive client number.",
              C: "By joining to table T000.",
              D: "Via a parameter annotated @Environment.systemField: #CLIENT typed abap.clnt.",
            },
            correct: "D",
            explanations: {
              A: "ABAP system fields like sy-mandt are not available inside SQLScript running on the DB.",
              B: "Hard-coding a client is a defect that breaks every other client and any client copy.",
              C: "T000 lists clients; it does not tell the function which client the caller is in.",
              D: "Correct — the #CLIENT system-field parameter, typed abap.clnt, is bound to the caller's client at runtime.",
            },
            principle:
              "Declare the client as an @Environment.systemField #CLIENT parameter typed abap.clnt.",
          },
          {
            n: 3,
            question:
              "What confirms that the AMDP handles the client correctly?",
            options: {
              A: "The activation step rejects any AMDP without a client filter.",
              B: "Open SQL adds the filter at runtime for AMDP too.",
              C: "ATC's AMDP client-handling check, enabled in your variant.",
              D: "abaplint's offline parser detects the missing client.",
            },
            correct: "C",
            explanations: {
              A: "Activation succeeds even without the filter; that is exactly why a separate check is needed.",
              B: "Open SQL's implicit client does not extend into hand-written SQLScript.",
              C: "Correct — ATC's AMDP client-handling check flags client-dependent reads that lack a filter, once enabled in the variant.",
              D: "abaplint works on source style and structure; the client-handling semantics are ATC's AMDP check.",
            },
            principle:
              "Enable ATC's AMDP client-handling check to catch missing MANDT filters.",
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
          "To make a class consumable from an ABAP Cloud package, you release it with which contract?",
        options: {
          A: "C1 via Properties → API State, then activate.",
          B: "C3, so ATC tracks every consumer.",
          C: "C0, leaving it internal.",
          D: "No release is needed; ABAP Cloud can consume anything.",
        },
        correct: "A",
        explanations: {
          A: "Correct — set Release State to Released with contract C1 in Properties → API State, then activate.",
          B: "C3 is deprecation, not how you publish a new consumable API.",
          C: "C0 is not released, so a restricted package cannot consume it.",
          D: "Restricted ABAP can only consume released (C1) objects.",
        },
        principle: "Publish consumable APIs as C1 via Properties → API State.",
      },
      {
        n: 2,
        question:
          "Which Check Variant does the remote-ATC readiness recipe use, and what does a baseline then do?",
        options: {
          A: "ABAP_CLOUD_DEVELOPMENT_DEFAULT; the baseline deletes all findings.",
          B: "PERFORMANCE_DB; the baseline exempts every consumer.",
          C: "S4HANA_READINESS_2023; the baseline makes later runs show only deltas.",
          D: "SECURITY_CHECK; the baseline disables ATC.",
        },
        correct: "C",
        explanations: {
          A: "That is the Cloud-restriction variant, and baselines never delete findings.",
          B: "PERFORMANCE_DB is the wrong variant and baselines do not create exemptions.",
          C: "Correct — readiness uses S4HANA_READINESS_2023 and a baseline leaves only new (delta) findings on later runs.",
          D: "SECURITY_CHECK is for CVA, and a baseline does not disable ATC.",
        },
        principle:
          "Run S4HANA_READINESS_2023 remotely, then baseline so only deltas surface.",
      },
      {
        n: 3,
        question:
          "In the FORM-to-class recipe, the global variables shared between FORMs become…",
        options: {
          A: "entries in EXPORT TO MEMORY.",
          B: "instance attributes or method parameters.",
          C: "rows in a new database table.",
          D: "macros expanded at compile time.",
        },
        correct: "B",
        explanations: {
          A: "IMPORT/EXPORT FROM MEMORY is forbidden in ABAP Cloud.",
          B: "Correct — shared state moves to instance attributes, and the rest is passed as parameters.",
          C: "Persisting transient state to a table changes behaviour unnecessarily.",
          D: "Macros are forbidden in ABAP Cloud and would not hold state.",
        },
        principle: "Replace global state with attributes and explicit parameters.",
      },
      {
        n: 4,
        question:
          "What does a CDS unit test call in teardown, and why?",
        options: {
          A: "commit work, to persist the rows.",
          B: "abaplint, to lint the view.",
          C: "lo_env->destroy( ), to clean up the generated test doubles.",
          D: "an ATC run, to baseline the view.",
        },
        correct: "C",
        explanations: {
          A: "The framework never writes to productive tables; there is nothing to commit.",
          B: "Linting is unrelated to test teardown.",
          C: "Correct — destroy( ) removes the generated doubles so tests stay isolated.",
          D: "ATC is not invoked from a unit-test teardown.",
        },
        principle: "Destroy the CDS test environment so tests stay independent.",
      },
      {
        n: 5,
        question:
          "An AMDP table function reads a client-dependent table. What keeps it from leaking other clients' rows?",
        options: {
          A: "Nothing — AMDP inherits Open SQL's implicit client.",
          B: "Declaring OPTIONS READ-ONLY.",
          C: "Releasing the function as C1.",
          D: "An explicit where mandt = :p_client, with client as a #CLIENT parameter.",
        },
        correct: "D",
        explanations: {
          A: "AMDP has no implicit client; that is the whole problem.",
          B: "READ-ONLY is about optimisation/routing, not client isolation.",
          C: "Releasing publishes a contract; it does nothing for client filtering.",
          D: "Correct — carry the client column, take it as a #CLIENT parameter, and filter where mandt = :p_client.",
        },
        principle: "AMDP must filter MANDT explicitly against a #CLIENT parameter.",
      },
    ],
  },
};
