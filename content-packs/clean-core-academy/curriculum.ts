/* ------------------------------------------------------------------
   Clean Core Academy — curriculum.

   One module per ABAP-Utilities cookbook (palimkarakshay/abap-utilities
   /docs). Every concept pairs:
     • notes        — paragraphs + keyPoints (the "why")
     • before/after — LessonExample.code with variant "before" | "after"
     • a quiz       — "spot the Clean-Core violation" MCQs

   Source provenance is on each lesson's `notesRef`. The before/after
   ABAP is distilled from the reference repo's docs/ and src/* (which is
   never modified — this pack only reads it). Module 1 (anti-patterns)
   is the fully-authored v0.1 module; modules 2–6 extend the same shape.

   Shape: see src/content/curriculum-types.ts.
------------------------------------------------------------------ */

import type { Curriculum } from "./_types";

export const CURRICULUM: Curriculum = {
  schemaVersion: 1,
  sections: [
    /* ============================================================
       MODULE 1 — ABAP anti-patterns → Clean Core   (v0.1 hero)
       Source: docs/anti-patterns-playbook.md
       ============================================================ */
    {
      id: "m1-anti-patterns",
      n: 1,
      title: "ABAP Anti-Patterns → Clean Core",
      sourceCourse: "anti-patterns-playbook.md",
      blurb:
        "The line-level habits that ATC and Clean Core flag first — SELECT *, N+1 reads, unsorted dedup, deep nesting, magic numbers, SQL injection — and the modern ABAP that replaces each. Spot the violation, then fix it.",
      concepts: [
        {
          id: "m1-c1",
          code: "1.1",
          title: "SELECT * and filtering in ABAP",
          bloom: "An",
          lesson: {
            status: "ready",
            notesRef: "docs/anti-patterns-playbook.md §1.1",
            paragraphs: [
              "SELECT * pulls every column of every row across the network, then the program throws most of it away. It is slower, uses more memory, and — worse for Clean Core — it couples your code to the full table structure, so a new column or an append structure can break or silently slow your program.",
              "Filtering in ABAP (reading broadly, then discarding rows with a LOOP/CHECK or DELETE) makes it worse: the database is the fastest place to filter and aggregate. Push the WHERE, the field list, and any aggregation down to the database; bring back only what you need.",
              "The Clean Core form is an explicit field list plus a WHERE clause that filters at the source. On released CDS views this also keeps you on the stable, version-proof contract instead of a physical table layout.",
            ],
            keyPoints: [
              "Name the columns you need — never SELECT * into a structure you don't fully use.",
              "Filter, sort, and aggregate in the WHERE/GROUP BY, not in ABAP after the fact.",
              "An explicit field list decouples you from table-structure changes (a Clean Core win).",
              "ATC flags this as SELECT_STAR_USAGE; abaplint flags it too.",
            ],
            examples: [
              {
                title: "Read everything, filter in ABAP",
                variant: "before",
                lang: "ABAP",
                body: "Every column and every row crosses the wire; the loop discards most of it.",
                code: [
                  "select * from vbak into table @data(lt_all).",
                  "loop at lt_all into data(ls) where bukrs = p_bukrs.",
                  "  append ls to lt_relevant.",
                  "endloop.",
                ].join("\n"),
              },
              {
                title: "Project columns, filter at the source",
                variant: "after",
                lang: "ABAP",
                body: "Only the needed columns and rows are fetched — one round trip, no ABAP-side filtering.",
                code: [
                  "select vbeln, erdat, netwr",
                  "  from vbak",
                  "  where bukrs = @p_bukrs",
                  "  into table @data(lt_relevant).",
                ].join("\n"),
              },
            ],
            pitfalls: [
              "Selecting into a fully-typed structure 'to be safe' still ships every column — the cost is on the wire, not just in your declaration.",
              "On S/4HANA prefer the released CDS interface view (I_*) over the physical table even with a field list.",
            ],
            simplified: {
              oneLiner:
                "Ask the database for exactly the columns and rows you need — don't fetch everything and sort it out in ABAP.",
              analogy:
                "Don't order the whole menu and eat one dish — order the dish.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "Why is `SELECT *` discouraged beyond raw performance, from a Clean Core standpoint?",
                options: {
                  A: "It always returns rows in the wrong order.",
                  B: "It requires a COMMIT WORK afterwards.",
                  C: "It couples the code to the full table structure, so structure changes can break or slow it.",
                  D: "It cannot be used with host variables.",
                },
                correct: "C",
                explanations: {
                  A: "Order is governed by ORDER BY, not the field list.",
                  B: "Reads don't need a commit.",
                  C: "Correct — an explicit field list decouples you from the table layout; SELECT * recouples you to it.",
                  D: "Host variables work fine with SELECT *; that's not the issue.",
                },
                principle:
                  "Projection (an explicit field list) decouples code from table structure — a Clean Core property, not just a speed tweak.",
              },
              {
                n: 2,
                question:
                  "Where should row filtering happen for a large table read?",
                options: {
                  A: "In a LOOP ... WHERE after selecting all rows.",
                  B: "In the SQL WHERE clause, at the database.",
                  C: "In a separate background job.",
                  D: "It doesn't matter as long as the result is correct.",
                },
                correct: "B",
                explanations: {
                  A: "That pulls every row across the wire first — the anti-pattern.",
                  B: "Correct — the database is the fastest place to filter; bring back only matching rows.",
                  C: "Moving it to a job doesn't remove the wasted I/O.",
                  D: "Correctness isn't the only goal; cost and coupling matter.",
                },
                principle: "Filter at the source; transport only what you need.",
              },
              {
                n: 3,
                question:
                  "Which ATC / lint finding most directly corresponds to this habit?",
                options: {
                  A: "SELECT_STAR_USAGE.",
                  B: "MISSING_AUTHORITY_CHECK.",
                  C: "OPEN_SQL_INJECTION.",
                  D: "EXIT_OR_CHECK.",
                },
                correct: "A",
                explanations: {
                  A: "Correct — SELECT_STAR_USAGE (and the abaplint equivalent) flags unprojected reads.",
                  B: "That's the missing authorization-check finding.",
                  C: "That's the dynamic-SQL injection finding.",
                  D: "That's the CHECK/EXIT-in-nesting style finding.",
                },
                principle: "Know the ATC code so you can baseline and gate it.",
              },
            ],
          },
        },
        {
          id: "m1-c2",
          code: "1.2",
          title: "SELECT inside a LOOP (the N+1 problem)",
          bloom: "An",
          lesson: {
            status: "ready",
            notesRef: "docs/anti-patterns-playbook.md §1.2 · internal-tables-cookbook.md",
            paragraphs: [
              "A SELECT inside a LOOP fires one database round trip per iteration. For N rows that is N+1 statements (one to get the list, one per row). Round-trip latency dominates, so this is the classic reason a report that worked on test data times out in production.",
              "The fix is set-based: read all the related rows in one statement, then look them up in memory. Use FOR ALL ENTRIES (guarding against an empty driver table), a hashed/sorted secondary table, or — best on S/4HANA — a CDS view with the join already expressed.",
            ],
            keyPoints: [
              "One read inside a loop over N rows = N round trips. Latency, not CPU, kills it.",
              "Read once into an internal table, then use a table expression / READ TABLE ... BINARY SEARCH or a hashed key.",
              "FOR ALL ENTRIES on an empty driver table reads the WHOLE target table — always check it's not empty first (habit 1.3).",
            ],
            examples: [
              {
                title: "A DB read per row",
                variant: "before",
                lang: "ABAP",
                body: "Each iteration hits the database — N+1 statements for N items.",
                code: [
                  "loop at lt_items into data(ls_item).",
                  "  select single maktx from makt",
                  "    where matnr = @ls_item-matnr and spras = @sy-langu",
                  "    into @data(lv_text).        \" one DB hit per row",
                  "endloop.",
                ].join("\n"),
              },
              {
                title: "One set-based read, then in-memory lookup",
                variant: "after",
                lang: "ABAP",
                body: "Read all texts in a single statement, then resolve each item from memory.",
                code: [
                  "if lt_items is not initial.            \" guard FOR ALL ENTRIES",
                  "  select matnr, maktx from makt",
                  "    for all entries in @lt_items",
                  "    where matnr = @lt_items-matnr and spras = @sy-langu",
                  "    into table @data(lt_text).",
                  "endif.",
                  "loop at lt_items into data(ls_item).",
                  "  data(lv_text) = value #( lt_text[ matnr = ls_item-matnr ]-maktx",
                  "                           optional ).",
                  "endloop.",
                ].join("\n"),
              },
            ],
            pitfalls: [
              "FOR ALL ENTRIES with an empty driver table silently selects everything — gate it with IS NOT INITIAL.",
              "FOR ALL ENTRIES de-duplicates results; if you need every driver row, key the lookup yourself.",
            ],
            simplified: {
              oneLiner:
                "Don't query inside a loop. Read the set once, then look rows up in memory.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "Why does a SELECT inside a LOOP scale so badly in production?",
                options: {
                  A: "ABAP recompiles the statement each iteration.",
                  B: "Each iteration is a separate database round trip, so latency multiplies with row count.",
                  C: "The database locks the table for the whole loop.",
                  D: "It exceeds the 120-character line limit.",
                },
                correct: "B",
                explanations: {
                  A: "Statement parsing isn't the dominant cost; round trips are.",
                  B: "Correct — N rows means N round trips; latency dominates.",
                  C: "A read doesn't lock the table for the loop.",
                  D: "Line length is unrelated.",
                },
                principle: "N+1 reads turn latency into the bottleneck — go set-based.",
              },
              {
                n: 2,
                question:
                  "Before using FOR ALL ENTRIES to replace the loop, what must you check?",
                options: {
                  A: "That the target table is buffered.",
                  B: "That sy-subrc equals 0.",
                  C: "That CLIENT SPECIFIED is set.",
                  D: "That the driver table is not initial.",
                },
                correct: "D",
                explanations: {
                  A: "Buffering helps but isn't the safety issue here.",
                  B: "There's no prior statement to check yet.",
                  C: "Client handling is unrelated and discouraged.",
                  D: "Correct — an empty driver table makes FOR ALL ENTRIES read the entire target table.",
                },
                principle:
                  "Empty-driver FOR ALL ENTRIES = full-table scan; guard with IS NOT INITIAL.",
              },
              {
                n: 3,
                question:
                  "On S/4HANA, what is usually the cleanest replacement for the nested read?",
                options: {
                  A: "Move the SELECT into a FORM subroutine.",
                  B: "Add WAIT UP TO 1 SECONDS to throttle it.",
                  C: "Express the join in a released CDS view and read it once.",
                  D: "Wrap the loop in a TRY/CATCH.",
                },
                correct: "C",
                explanations: {
                  A: "A subroutine just relocates the same N+1 reads.",
                  B: "Throttling makes it slower, not correct.",
                  C: "Correct — a CDS view pushes the join to HANA and gives you one set-based, released read.",
                  D: "Exception handling doesn't address the round-trip count.",
                },
                principle: "CDS expresses the join once, pushed down to the database.",
              },
            ],
          },
        },
        {
          id: "m1-c3",
          code: "1.4",
          title: "DELETE ADJACENT DUPLICATES on an unsorted table",
          bloom: "A",
          lesson: {
            status: "ready",
            notesRef: "docs/anti-patterns-playbook.md §1.4 · src/itab/README.md",
            paragraphs: [
              "DELETE ADJACENT DUPLICATES only removes duplicates that are next to each other. If the table isn't sorted by the same key you're comparing, duplicates that aren't adjacent survive — a subtle bug that passes on small test data and corrupts totals on real data.",
              "Always SORT by the comparison key first. The intention-revealing alternative is the ZCL_AU_ITAB=>distinct helper, which sorts and dedupes in one call so the reader can't forget the SORT.",
            ],
            keyPoints: [
              "ADJACENT means adjacent — unsorted input leaves non-neighbouring duplicates behind.",
              "SORT by exactly the COMPARING key before deduping.",
              "ZCL_AU_ITAB=>distinct( ) makes the sort+dedup intent explicit and hard to get wrong.",
            ],
            examples: [
              {
                title: "Dedup without sorting first",
                variant: "before",
                lang: "ABAP",
                body: "Non-adjacent duplicates are silently kept — the result still has repeats.",
                code: [
                  "\" lt_matnr is in insertion order, not sorted by matnr",
                  "delete adjacent duplicates from lt_matnr comparing matnr.",
                ].join("\n"),
              },
              {
                title: "Sort first — or use the helper",
                variant: "after",
                lang: "ABAP",
                body: "Sorting by the comparison key makes duplicates adjacent; the helper does both in one call.",
                code: [
                  "sort lt_matnr by matnr.",
                  "delete adjacent duplicates from lt_matnr comparing matnr.",
                  "",
                  "\" intention-revealing equivalent:",
                  "zcl_au_itab=>distinct( changing ct_table = lt_matnr ).",
                ].join("\n"),
              },
            ],
            pitfalls: [
              "Sorting by a different key than you COMPARE re-introduces the bug.",
              "If row order matters downstream, dedupe into a copy or capture the order first.",
            ],
            simplified: {
              oneLiner:
                "SORT by the key before DELETE ADJACENT DUPLICATES — or call distinct(), which can't forget the sort.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "What happens if you DELETE ADJACENT DUPLICATES on a table not sorted by the comparison key?",
                options: {
                  A: "Duplicates that aren't next to each other are left in the table.",
                  B: "A short dump is raised.",
                  C: "All rows are deleted.",
                  D: "The statement sorts the table automatically.",
                },
                correct: "A",
                explanations: {
                  A: "Correct — only adjacent duplicates are removed; the rest survive.",
                  B: "No dump — it just silently under-deletes.",
                  C: "It doesn't clear the table.",
                  D: "It does not sort for you; that's the whole trap.",
                },
                principle: "ADJACENT is literal — sort by the COMPARING key first.",
              },
              {
                n: 2,
                question:
                  "What is the advantage of ZCL_AU_ITAB=>distinct over hand-written SORT + DELETE?",
                options: {
                  A: "It runs on the database instead of in ABAP.",
                  B: "It removes the need for a WHERE clause.",
                  C: "It bundles the sort and dedup so the reader can't omit the SORT.",
                  D: "It is the only cloud-safe option.",
                },
                correct: "C",
                explanations: {
                  A: "It operates on an in-memory internal table, not the DB.",
                  B: "WHERE clauses are unrelated to in-memory dedup.",
                  C: "Correct — the helper is intention-revealing and bundles the easily-forgotten SORT.",
                  D: "Plain SORT + DELETE is also cloud-safe; the win is clarity.",
                },
                principle: "Prefer intention-revealing helpers for easy-to-forget steps.",
              },
              {
                n: 3,
                question:
                  "You must keep the original insertion order but also need a distinct count. What's the safe move?",
                options: {
                  A: "Sort the table in place, then dedupe — order can be restored later.",
                  B: "Dedupe on a copy (or count distinct non-destructively); don't reorder the original.",
                  C: "Use DELETE ADJACENT DUPLICATES without COMPARING.",
                  D: "Loop and compare each row to all others.",
                },
                correct: "B",
                explanations: {
                  A: "In-place sorting destroys the order you need to keep.",
                  B: "Correct — work on a copy or use a non-destructive count_distinct so the original order is preserved.",
                  C: "Without COMPARING it dedupes on the whole row and still needs sorting.",
                  D: "An O(n²) loop is the kind of thing these helpers exist to avoid.",
                },
                principle: "Don't mutate data you still need — dedupe a copy.",
              },
            ],
          },
        },
        {
          id: "m1-c4",
          code: "1.7",
          title: "Deep nesting with CHECK/EXIT → guard clauses",
          bloom: "A",
          lesson: {
            status: "ready",
            notesRef: "docs/anti-patterns-playbook.md §1.7 · src/guard/README.md",
            paragraphs: [
              "Validating inputs with deeply nested IF blocks (or scattering CHECK/EXIT mid-method) hides the happy path under a staircase of indentation and makes failure handling implicit. A reader can't tell at a glance what the method requires.",
              "Guard clauses invert this: check each precondition at the top and fail fast with a clear error. The rest of the method then runs flat, on known-good input. ZCL_AU_GUARD turns bad input into a typed ZCX_AU_ERROR instead of a silent CHECK that just leaves the method.",
            ],
            keyPoints: [
              "State preconditions at the top; fail fast with a clear, typed error.",
              "The happy path stays flat and readable — no staircase indentation.",
              "Prefer guards (which raise) over CHECK/EXIT (which silently leave) for input validation.",
              "Keep ASSERT for true invariants; use guards for caller-supplied input.",
            ],
            examples: [
              {
                title: "Preconditions as nested IFs",
                variant: "before",
                lang: "ABAP",
                body: "The real work is buried four levels deep; what the method requires is unclear.",
                code: [
                  "method post_invoice.",
                  "  if is_invoice-customer is not initial.",
                  "    if lines( it_items ) > 0.",
                  "      if is_invoice-amount > 0.",
                  "        \" ... the actual work, indented 4 levels deep ...",
                  "      endif.",
                  "    endif.",
                  "  endif.",
                  "endmethod.",
                ].join("\n"),
              },
              {
                title: "Guard clauses at the top",
                variant: "after",
                lang: "ABAP",
                body: "Each precondition is explicit and fails fast; the happy path is flat.",
                code: [
                  "method post_invoice.",
                  "  zcl_au_guard=>not_initial( iv_value = is_invoice-customer iv_name = 'customer' ).",
                  "  zcl_au_guard=>not_empty(   it_table = it_items            iv_name = 'items' ).",
                  "  zcl_au_guard=>that( iv_condition = xsdbool( is_invoice-amount > 0 )",
                  "                      iv_message   = 'amount must be positive' ).",
                  "  \" inputs are known-good from here — happy path is flat",
                  "endmethod.",
                ].join("\n"),
              },
            ],
            pitfalls: [
              "CHECK in a method body silently exits the method — easy to misread as a no-op. Guards make the failure explicit.",
              "Don't replace genuine invariants (ASSERT) with guards; guards are for input you don't control.",
            ],
            simplified: {
              oneLiner:
                "Check preconditions at the top and fail fast, so the rest of the method reads as a flat happy path.",
              analogy:
                "A bouncer at the door, not a maze of velvet ropes inside.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "What is the main readability benefit of guard clauses over nested IFs?",
                options: {
                  A: "They make the method run faster.",
                  B: "They remove the need for unit tests.",
                  C: "They let the happy path run flat after preconditions are checked up front.",
                  D: "They avoid declaring local variables.",
                },
                correct: "C",
                explanations: {
                  A: "Performance is essentially unchanged.",
                  B: "Guards don't replace tests.",
                  C: "Correct — fail fast at the top, then the body is flat and the contract is explicit.",
                  D: "Variable declarations are unrelated.",
                },
                principle: "Guard clauses surface the contract and flatten the happy path.",
              },
              {
                n: 2,
                question:
                  "Why prefer ZCL_AU_GUARD over a bare CHECK for validating caller input?",
                options: {
                  A: "A guard raises a clear, typed error instead of silently leaving the method.",
                  B: "CHECK is not allowed in classes.",
                  C: "A guard runs on the database.",
                  D: "CHECK cannot appear at the top of a method.",
                },
                correct: "A",
                explanations: {
                  A: "Correct — guards turn bad input into an explicit ZCX_AU_ERROR; CHECK just exits quietly.",
                  B: "CHECK is allowed; it's just easy to misread.",
                  C: "Guards are pure in-memory checks.",
                  D: "CHECK can appear anywhere; placement isn't the issue.",
                },
                principle: "Fail loudly on bad input; don't exit silently.",
              },
              {
                n: 3,
                question:
                  "Which check should stay an ASSERT rather than become a guard?",
                options: {
                  A: "A required importing parameter is initial.",
                  B: "A user-entered amount is negative.",
                  C: "A true internal invariant that should never be false if the code is correct.",
                  D: "An items table passed by the caller is empty.",
                },
                correct: "C",
                explanations: {
                  A: "Caller input → guard.",
                  B: "User input → guard.",
                  C: "Correct — invariants that 'can't happen' are assertions, not input validation.",
                  D: "Caller-supplied table → guard.",
                },
                principle: "Guards validate external input; assertions document invariants.",
              },
            ],
          },
          exercise: {
            id: "m1-c4-ex",
            lang: "ABAP",
            prompt:
              "The two CHECK statements sit deep in this method and exit it silently — abaplint flags them (the deep CHECK/EXIT anti-pattern, 1.7). Refactor to fail-fast guard clauses so the contract is explicit and the happy path stays flat, then re-check until it's clean.",
            flaggedRules: ["exit_or_check"],
            hint: "Replace each `check <cond>.` with `if not <cond>. raise exception type cx_static_check. endif.` — or delegate to a guard like ZCL_AU_GUARD=>that( ).",
            successNote:
              "That's the 'after' from this lesson: preconditions fail fast up front and the rest of the method reads as a flat happy path.",
            starterCode: [
              "class zcl_au_ex_post definition public final create public.",
              "  public section.",
              "    class-methods post_invoice",
              "      importing",
              "        !iv_customer type string",
              "        !iv_amount   type i",
              "      raising",
              "        cx_static_check.",
              "endclass.",
              "",
              "class zcl_au_ex_post implementation.",
              "  method post_invoice.",
              "    \" TODO: these CHECKs exit the method silently mid-logic.",
              "    \" Replace them with fail-fast guard clauses.",
              "    check iv_customer is not initial.",
              "    check iv_amount > 0.",
              "    \" ... posting logic runs only when the input is good ...",
              "  endmethod.",
              "endclass.",
            ].join("\n"),
          },
        },
        {
          id: "m1-c5",
          code: "1.5",
          title: "Magic numbers and hardcoded org values",
          bloom: "A",
          lesson: {
            status: "ready",
            notesRef: "docs/anti-patterns-playbook.md §1.5 · src/config/README.md",
            paragraphs: [
              "Hardcoded company codes, plant ranges, thresholds, and batch sizes scatter business configuration through the code. Nobody can change '1000' without a developer and a transport, and the same literal means different things in different programs.",
              "Externalize configuration: keep ranges, parameters and toggles in config (TVARVC via STVARV on-premise, or a released custom entity / configuration app on ABAP Cloud) and read them through a small accessor like ZCL_AU_CONFIG. Feature flags then let you deploy dark and switch behaviour on without a transport.",
            ],
            keyPoints: [
              "Org values and thresholds are configuration, not code — externalize them.",
              "A named getter (get_value / get_range / is_enabled) documents intent and centralizes change.",
              "Feature flags decouple deploy from release: ship dark, switch on later.",
              "On ABAP Cloud a direct SELECT on TVARVC isn't released — model config as a released entity; the accessor shape ports unchanged.",
            ],
            examples: [
              {
                title: "Literals embedded in logic",
                variant: "before",
                lang: "ABAP",
                body: "Which company codes? Why 500? Changing either needs a developer and a transport.",
                code: [
                  "if lv_bukrs = '1000' or lv_bukrs = '2000'.   \" which codes? who decides?",
                  "  lv_batch = 500.                            \" magic number",
                  "endif.",
                ].join("\n"),
              },
              {
                title: "Externalized configuration",
                variant: "after",
                lang: "ABAP",
                body: "Ranges and parameters live in config; a flag can switch new behaviour on without a transport.",
                code: [
                  "data(lt_bukrs) = zcl_au_config=>get_range( 'Z_RELEVANT_BUKRS' ).",
                  "if lv_bukrs in lt_bukrs.",
                  "  data(lv_batch) = zcl_au_config=>get_value( 'Z_BATCH_SIZE' ).",
                  "endif.",
                  "",
                  "if zcl_au_config=>is_enabled( 'Z_FEATURE_NEW_PRICING' ).",
                  "  \" new behaviour, deployed dark, switched on without a transport",
                  "endif.",
                ].join("\n"),
              },
            ],
            pitfalls: [
              "Moving a literal into a constant is better than nothing, but a constant still needs a transport to change — config doesn't.",
              "On ABAP Cloud, don't SELECT TVARVC directly; expose config as a released entity (the accessor API is the same).",
            ],
            simplified: {
              oneLiner:
                "Org values and thresholds are configuration — read them from config, don't bake literals into logic.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "What is the core problem with hardcoded org values like company code '1000'?",
                options: {
                  A: "They violate the 7-bit ASCII rule.",
                  B: "Changing business config requires a developer and a transport, and the literal's meaning is opaque.",
                  C: "They cannot be used inside an IF.",
                  D: "They always cause a short dump on upgrade.",
                },
                correct: "B",
                explanations: {
                  A: "ASCII rules are unrelated.",
                  B: "Correct — configuration baked into code can't be changed by the business and is meaning-opaque.",
                  C: "Literals work in IFs; that's not the issue.",
                  D: "They don't inherently dump.",
                },
                principle: "Configuration belongs outside code so it can change without a transport.",
              },
              {
                n: 2,
                question:
                  "What does a feature flag (is_enabled) let you do that a constant does not?",
                options: {
                  A: "Run the code on HANA.",
                  B: "Skip authorization checks.",
                  C: "Deploy code dark and switch behaviour on later without a transport.",
                  D: "Avoid writing unit tests.",
                },
                correct: "C",
                explanations: {
                  A: "Pushdown is a SQL/CDS concern, not a flag.",
                  B: "Flags have nothing to do with authority checks.",
                  C: "Correct — flags decouple deploy from release.",
                  D: "Flags don't replace tests.",
                },
                principle: "Feature flags separate deployment from activation.",
              },
              {
                n: 3,
                question:
                  "On ABAP Cloud, what's the catch with the TVARVC-backed config approach?",
                options: {
                  A: "Nothing — TVARVC SELECT is fully released on cloud.",
                  B: "Feature flags are banned on cloud.",
                  C: "Ranges can't be used in WHERE ... IN on cloud.",
                  D: "A direct SELECT on TVARVC isn't released; model config as a released entity (same accessor shape).",
                },
                correct: "D",
                explanations: {
                  A: "Direct TVARVC SELECT is not released on cloud.",
                  B: "Flags are fine on cloud.",
                  C: "Ranges in WHERE ... IN are fine.",
                  D: "Correct — the API shape ports; the data source must be a released entity / config app.",
                },
                principle: "Keep the accessor API; swap the unreleased data source for a released one on cloud.",
              },
            ],
          },
        },
        {
          id: "m1-c6",
          code: "6.3",
          title: "SQL injection via dynamic WHERE",
          bloom: "An",
          lesson: {
            status: "ready",
            notesRef: "docs/anti-patterns-playbook.md §6.3 · src/dynsql/README.md",
            paragraphs: [
              "Concatenating user input into a dynamic WHERE or ORDER BY opens an OPEN SQL injection hole: a crafted value can read or change rows the user shouldn't touch. ATC flags this as OPEN_SQL_INJECTION, and it's a Clean Core / security must-fix.",
              "The golden rule for dynamic values is to use host variables — no string building, no helper needed. Only when the column or table name itself is genuinely dynamic do you build a string, and then you validate it against an allow-list or as a syntactic identifier with the released CL_ABAP_DYN_PRG (wrapped by ZCL_AU_DYN_SQL).",
            ],
            keyPoints: [
              "Dynamic VALUES → host variables (@var, @ranges). Never concatenate values into the statement.",
              "Dynamic COLUMN/TABLE names → allow-list (best) or validate as an identifier; never raw user input.",
              "CL_ABAP_DYN_PRG is the released sanitizer; ZCL_AU_DYN_SQL wraps it with an allow-list guard.",
            ],
            examples: [
              {
                title: "User input concatenated into the statement",
                variant: "before",
                lang: "ABAP",
                body: "A crafted value escapes the intended predicate — an injection hole.",
                code: [
                  "data(lv_where) = |matnr = '{ iv_user_input }'|.   \" injection hole",
                  "select * from mara where (lv_where) into table @data(lt).",
                ].join("\n"),
              },
              {
                title: "Host variables for values; allow-list for a dynamic column",
                variant: "after",
                lang: "ABAP",
                body: "Values bind safely via host variables; a genuinely-dynamic sort column is checked against an allow-list.",
                code: [
                  "\" values: just use host variables — safe, no helper",
                  "select * from mara where matnr = @iv_matnr into table @data(lt).",
                  "",
                  "\" genuinely-dynamic column: validate against an allow-list",
                  "data(lv_sort) = zcl_au_dyn_sql=>allowed(",
                  "  iv_value   = iv_user_sort",
                  "  it_allowed = value #( ( 'MATNR' ) ( 'ERSDA' ) ) ).",
                  "select * from mara order by (lv_sort) into table @data(lt2).",
                ].join("\n"),
              },
            ],
            pitfalls: [
              "Quoting a value yourself is still risky — prefer host variables, which the kernel binds safely.",
              "An allow-list of column names beats a regex 'is it an identifier' check, because it also enforces business intent.",
            ],
            simplified: {
              oneLiner:
                "Bind values with host variables; only names go dynamic, and only through an allow-list.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "A user-supplied value must go into a WHERE clause. What's the safe approach?",
                options: {
                  A: "Concatenate it into a string with quotes around it.",
                  B: "Run it through a regex first, then concatenate.",
                  C: "Bind it with a host variable (e.g. WHERE matnr = @iv_matnr).",
                  D: "Store it in TVARVC and read it back.",
                },
                correct: "C",
                explanations: {
                  A: "String concatenation of values is the injection hole.",
                  B: "Regex-then-concatenate is fragile; host variables remove the need entirely.",
                  C: "Correct — host variables are bound safely by the kernel; no string building needed.",
                  D: "TVARVC is for configuration, not user input sanitization.",
                },
                principle: "Dynamic values use host variables — never string concatenation.",
              },
              {
                n: 2,
                question:
                  "Only the sort COLUMN is user-chosen. What's the Clean Core way to make it dynamic safely?",
                options: {
                  A: "Validate it against an allow-list of permitted column names.",
                  B: "Pass it as a host variable in ORDER BY.",
                  C: "Disable ATC for that statement.",
                  D: "Uppercase it and trust it.",
                },
                correct: "A",
                explanations: {
                  A: "Correct — column/table names can't be host variables; an allow-list is the safe gate.",
                  B: "Host variables bind values, not identifiers like a sort column.",
                  C: "Suppressing the finding doesn't remove the hole.",
                  D: "Uppercasing isn't validation.",
                },
                principle: "Identifiers go through an allow-list; values go through host variables.",
              },
              {
                n: 3,
                question:
                  "Which released class underpins safe dynamic SQL (and is wrapped by ZCL_AU_DYN_SQL)?",
                options: {
                  A: "CL_GUI_ALV_GRID.",
                  B: "CL_ABAP_DYN_PRG.",
                  C: "CL_SALV_TABLE.",
                  D: "CL_BCS.",
                },
                correct: "B",
                explanations: {
                  A: "That's the on-prem ALV grid.",
                  B: "Correct — CL_ABAP_DYN_PRG (QUOTE / identifier checks) is the released sanitizer.",
                  C: "SALV is for output, not SQL safety.",
                  D: "CL_BCS is email.",
                },
                principle: "Use the released sanitizer (CL_ABAP_DYN_PRG), not hand-rolled escaping.",
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
              "`select * from vbak into table @data(lt). loop at lt where bukrs = p_bukrs. ... endloop.` — which Clean-Core violation is this?",
            options: {
              A: "Filtering in ABAP after an unprojected read (SELECT *).",
              B: "SQL injection.",
              C: "Missing authorization check.",
              D: "Stateful global variable.",
            },
            correct: "A",
            principle: "Project columns and filter in the WHERE — not in ABAP.",
          },
          {
            n: 2,
            question:
              "`loop at lt_items. select single ... where matnr = ls-matnr. endloop.` is flagged because it is…",
            options: {
              A: "A missing COMMIT WORK.",
              B: "A hardcoded org value.",
              C: "An N+1 nested database read.",
              D: "A native SQL statement.",
            },
            correct: "C",
            principle: "Reads inside loops are N+1 — go set-based.",
          },
          {
            n: 3,
            question:
              "`delete adjacent duplicates from lt comparing matnr.` on an insertion-ordered table will…",
            options: {
              A: "Always remove every duplicate.",
              B: "Leave non-adjacent duplicates behind because the table wasn't sorted.",
              C: "Raise a syntax error.",
              D: "Sort the table as a side effect.",
            },
            correct: "B",
            principle: "Sort by the COMPARING key first.",
          },
          {
            n: 4,
            question:
              "Four levels of nested IF validating importing parameters should be replaced with…",
            options: {
              A: "A single mega-CHECK.",
              B: "Native SQL.",
              C: "More comments explaining the nesting.",
              D: "Guard clauses that fail fast at the top of the method.",
            },
            correct: "D",
            principle: "Guard clauses flatten the happy path and surface the contract.",
          },
          {
            n: 5,
            question:
              "`if lv_bukrs = '1000'. lv_batch = 500. endif.` mixes which two anti-patterns?",
            options: {
              A: "Native SQL and EXEC SQL.",
              B: "SELECT * and FOR ALL ENTRIES.",
              C: "Hardcoded org value and a magic number.",
              D: "Header lines and OCCURS.",
            },
            correct: "C",
            principle: "Org values and thresholds are configuration, not literals.",
          },
          {
            n: 6,
            question:
              "`data(w) = |matnr = '{ iv_user }'|. select * from mara where (w).` is which must-fix?",
            options: {
              A: "OPEN SQL injection via a concatenated dynamic WHERE.",
              B: "An unsorted dedup.",
              C: "A guard-clause omission.",
              D: "A SELECT * projection issue.",
            },
            correct: "A",
            principle: "Bind values with host variables; never concatenate user input.",
          },
        ],
      },
    },

    /* ============================================================
       MODULE 2 — Clean Core & ATC: don't touch the standard
       Source: docs/clean-core-atc-cookbook.md
       ============================================================ */
    {
      id: "m2-clean-core-atc",
      n: 2,
      title: "Clean Core & ATC: don't touch the standard",
      sourceCourse: "clean-core-atc-cookbook.md",
      blurb:
        "The architecture-level findings ATC's CLOUD_READINESS / S4HANA_READINESS variants raise: writing to SAP tables, selecting from physical tables, calling non-released objects, and reading system fields — with the released replacement for each.",
      concepts: [
        {
          id: "m2-c1",
          code: "2.1",
          title: "Direct write to an SAP table → released API / BAPI / RAP",
          bloom: "An",
          lesson: {
            status: "ready",
            notesRef: "docs/clean-core-atc-cookbook.md §1",
            paragraphs: [
              "UPDATE/MODIFY/INSERT/DELETE on a standard SAP table bypasses the application logic (validations, determinations, side-effects) and breaks when SAP changes the data model. ATC flags write access to an SAP table as a must-fix.",
              "Go through the released API for the business object: a BAPI, a released function module/class, or — on a RAP business object — EML (MODIFY ENTITIES). The application logic runs, and your code depends on a stable, released contract.",
            ],
            keyPoints: [
              "Never write to an SAP DDIC table directly — you bypass app logic and couple to the physical model.",
              "Use the released BAPI/API, or EML on a RAP BO.",
              "BAPIs need an explicit BAPI_TRANSACTION_COMMIT / ROLLBACK; RAP uses COMMIT ENTITIES.",
            ],
            examples: [
              {
                title: "Writing straight to the table",
                variant: "before",
                lang: "ABAP",
                body: "Bypasses all sales-order logic and breaks on data-model changes. ATC: write access to SAP table.",
                code: "update vbak set netwr = @lv_new where vbeln = @lv_vbeln.",
              },
              {
                title: "Through the released API",
                variant: "after",
                lang: "ABAP",
                body: "The business logic runs; you depend on a released contract.",
                code: [
                  "call function 'BAPI_SALESORDER_CHANGE'",
                  "  exporting salesdocument = lv_vbeln",
                  "            order_header_inx = ls_headerx",
                  "  tables    return = lt_return.",
                  "",
                  "\" or on a RAP business object:",
                  "modify entities of i_salesorder",
                  "  entity salesorder update fields ( netamount )",
                  "  with value #( ( salesorder = lv_vbeln netamount = lv_new ) ).",
                ].join("\n"),
              },
            ],
            pitfalls: [
              "A 'quick' direct update is the classic upgrade-breaker — there is no safe direct write to a standard table.",
            ],
            simplified: {
              oneLiner:
                "Change SAP data through its released API or RAP — never UPDATE the table yourself.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "Why is `UPDATE vbak ...` a Clean Core violation beyond style?",
                options: {
                  A: "VBAK is too large to update.",
                  B: "It bypasses application logic and couples you to the physical model, breaking on data-model changes.",
                  C: "UPDATE needs CLIENT SPECIFIED.",
                  D: "It is slower than MODIFY.",
                },
                correct: "B",
                explanations: {
                  A: "Size isn't the issue.",
                  B: "Correct — you skip validations/determinations and bind to the table layout.",
                  C: "Client handling is unrelated and discouraged.",
                  D: "Performance isn't the point.",
                },
                principle: "Go through the business object's released API, not its table.",
              },
              {
                n: 2,
                question:
                  "On a RAP business object, the released way to change data is…",
                options: {
                  A: "EML — MODIFY ENTITIES ... then COMMIT ENTITIES.",
                  B: "EXEC SQL.",
                  C: "A direct UPDATE on the persistence table.",
                  D: "CALL TRANSACTION in batch mode.",
                },
                correct: "A",
                explanations: {
                  A: "Correct — EML is the type-safe, released way to drive a RAP BO.",
                  B: "Native SQL is itself a finding.",
                  C: "That's the very thing we're avoiding.",
                  D: "Batch input replays the UI and isn't cloud-ready.",
                },
                principle: "RAP changes go through EML, not the table.",
              },
              {
                n: 3,
                question:
                  "After a successful BAPI change, what must you do that a direct UPDATE wouldn't?",
                options: {
                  A: "Re-read the table to confirm.",
                  B: "Call SORT.",
                  C: "Nothing — BAPIs auto-commit.",
                  D: "Call BAPI_TRANSACTION_COMMIT (or ROLLBACK on error).",
                },
                correct: "D",
                explanations: {
                  A: "A re-read isn't the transactional requirement.",
                  B: "Irrelevant.",
                  C: "BAPIs do not auto-commit.",
                  D: "Correct — BAPIs require an explicit commit/rollback at the transaction boundary.",
                },
                principle: "Own the transaction boundary explicitly with BAPIs.",
              },
            ],
          },
        },
        {
          id: "m2-c2",
          code: "2.3",
          title: "SELECT on a physical SAP table → released CDS view",
          bloom: "A",
          lesson: {
            status: "ready",
            notesRef: "docs/clean-core-atc-cookbook.md §2",
            paragraphs: [
              "Reading directly from a physical SAP table (MARA, BSID, …) is fragile across releases — SAP can change or simplify the underlying model. The CLOUD_READINESS check wants you on the released CDS interface view (I_*) instead, which is a stable, documented contract over the same data.",
              "The change is usually mechanical: swap the table for its I_* view and the technical field names for the view's semantic element names.",
            ],
            keyPoints: [
              "Released I_* interface views are the stable contract; physical tables are an implementation detail.",
              "Field names become semantic element names (e.g. MTART → ProductType).",
              "This is a read-side parallel to using APIs on the write side.",
            ],
            examples: [
              {
                title: "Reading the physical table",
                variant: "before",
                lang: "ABAP",
                body: "Fragile across releases; ATC flags the SAP-table read.",
                code: "select * from mara where mtart = 'FERT' into table @data(lt).",
              },
              {
                title: "Reading the released CDS interface view",
                variant: "after",
                lang: "ABAP",
                body: "Stable, released contract over the same data; semantic field names.",
                code: "select * from i_product where producttype = 'FERT' into table @data(lt).",
              },
            ],
            pitfalls: [
              "Not every table has a 1:1 I_* view; sometimes you compose several released views.",
              "Don't forget to also drop SELECT * here — project the columns you need.",
            ],
            simplified: {
              oneLiner:
                "Read from the released I_* CDS view, not the physical SAP table.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "What does reading from I_Product instead of MARA buy you?",
                options: {
                  A: "Automatic authorization.",
                  B: "Faster inserts.",
                  C: "A stable, released contract that survives data-model changes.",
                  D: "Client-independent storage.",
                },
                correct: "C",
                explanations: {
                  A: "Authorization comes from DCL/access control, not the view choice alone.",
                  B: "It's a read concern, not inserts.",
                  C: "Correct — the I_* view is the versioned, released contract over the model.",
                  D: "Client handling is separate.",
                },
                principle: "Depend on released CDS, not physical tables.",
              },
              {
                n: 2,
                question:
                  "When moving from MARA to I_Product, the WHERE field MTART becomes…",
                options: {
                  A: "Still MTART — element names never change.",
                  B: "A semantic element name like ProductType.",
                  C: "A host variable.",
                  D: "An association.",
                },
                correct: "B",
                explanations: {
                  A: "The view exposes semantic names, not the table's technical names.",
                  B: "Correct — I_Product exposes ProductType, etc.",
                  C: "Field naming isn't about host variables.",
                  D: "Associations are for navigation, not this rename.",
                },
                principle: "Released views expose semantic element names.",
              },
              {
                n: 3,
                question:
                  "This read-side fix is the parallel of which write-side Clean Core rule?",
                options: {
                  A: "Use the released API/BAPI/RAP instead of writing the table.",
                  B: "Add more comments.",
                  C: "Use WAIT to throttle writes.",
                  D: "Move logic into a FORM.",
                },
                correct: "A",
                explanations: {
                  A: "Correct — read via released CDS, write via released APIs; same principle, two sides.",
                  B: "Comments don't decouple anything.",
                  C: "Throttling is unrelated.",
                  D: "Subroutines don't address coupling to the model.",
                },
                principle: "Released contracts on both read (CDS) and write (API) sides.",
              },
            ],
          },
        },
        {
          id: "m2-c3",
          code: "2.x",
          title: "Non-released object → released wrapper",
          bloom: "A",
          lesson: {
            status: "ready",
            notesRef: "docs/clean-core-atc-cookbook.md §3 · src/wrapper/README.md",
            paragraphs: [
              "Sometimes the function or class you need isn't released yet. Clean Core's answer is not to sprinkle exemptions everywhere — it's to build one released facade (a wrapper) in your own namespace that isolates the non-released call, get that single class through ATC once, and call the wrapper everywhere else.",
              "Now exactly one place carries the exemption, the rest of your code depends on a clean released contract, and swapping the implementation later (when SAP releases an API) touches one class.",
            ],
            keyPoints: [
              "Isolate the unreleased call behind one released facade; don't spread it.",
              "Only the wrapper needs an ATC exemption — track it so it shrinks over time.",
              "Callers depend on your stable signature, not the volatile internal object.",
            ],
            examples: [
              {
                title: "Non-released calls scattered through the code",
                variant: "before",
                lang: "ABAP",
                body: "Every call site needs an exemption and breaks if the internal object changes.",
                code: [
                  "\" repeated across many programs:",
                  "call function 'SOME_UNRELEASED_PRICING_FM'",
                  "  exporting iv_matnr = lv_matnr importing ev_price = lv_price.",
                ].join("\n"),
              },
              {
                title: "One released facade isolates it",
                variant: "after",
                lang: "ABAP",
                body: "A single released class hides the non-released call; callers use a clean contract.",
                code: [
                  "class zcl_pricing_facade definition public final create public.",
                  "  public section.",
                  "    class-methods get_price",
                  "      importing iv_matnr        type matnr",
                  "      returning value(rv_price) type p length 13 decimals 2.",
                  "endclass.",
                  "\" the one place the exemption lives; callers just do:",
                  "data(lv_price) = zcl_pricing_facade=>get_price( lv_matnr ).",
                ].join("\n"),
              },
            ],
            pitfalls: [
              "A wrapper that just renames the call without a clean, typed signature adds no value — design the contract.",
              "Track every exemption; the wrapper set should shrink as SAP releases more APIs.",
            ],
            simplified: {
              oneLiner:
                "Wrap a non-released call in one released facade; exempt that single class, not every caller.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "What is the benefit of the released-wrapper pattern for a non-released FM?",
                options: {
                  A: "It makes the FM released automatically.",
                  B: "It removes the need for any commit.",
                  C: "Exactly one class needs the exemption, and swapping the implementation later touches one place.",
                  D: "It runs the FM on HANA.",
                },
                correct: "C",
                explanations: {
                  A: "It doesn't change SAP's classification of the FM.",
                  B: "Commits are unrelated.",
                  C: "Correct — localize the exemption and the future swap to one facade.",
                  D: "Pushdown is unrelated.",
                },
                principle: "Localize exemptions behind one released facade.",
              },
              {
                n: 2,
                question:
                  "What makes a wrapper genuinely useful rather than cosmetic?",
                options: {
                  A: "It exposes a clean, typed, released signature callers depend on.",
                  B: "It is named with a Z prefix.",
                  C: "It copies the FM's parameters verbatim.",
                  D: "It disables ATC globally.",
                },
                correct: "A",
                explanations: {
                  A: "Correct — the value is a stable contract, not just a rename.",
                  B: "A Z prefix alone isn't a contract.",
                  C: "Verbatim copying leaks the volatile signature.",
                  D: "Disabling ATC defeats the purpose.",
                },
                principle: "A wrapper's value is its stable, typed contract.",
              },
              {
                n: 3,
                question:
                  "How should the set of wrapper exemptions evolve over time?",
                options: {
                  A: "Grow as you wrap more things.",
                  B: "Stay fixed forever.",
                  C: "Be deleted along with the wrappers immediately.",
                  D: "Shrink as SAP releases more APIs and wrappers are retired.",
                },
                correct: "D",
                explanations: {
                  A: "More wrappers should be the exception, not the trend.",
                  B: "Static exemptions become stale tech debt.",
                  C: "You can't delete a wrapper still hiding an unreleased call.",
                  D: "Correct — track exemptions so they shrink as released APIs arrive.",
                },
                principle: "Treat exemptions as tracked, shrinking debt.",
              },
            ],
          },
        },
        {
          id: "m2-c4",
          code: "1.x",
          title: "System fields (sy-uname / sy-datum) → released context API",
          bloom: "A",
          lesson: {
            status: "ready",
            notesRef: "docs/clean-core-atc-cookbook.md §5 · src/context/README.md",
            paragraphs: [
              "Many system fields are restricted in ABAP Cloud because they carry hidden, hard-to-test global state. sy-datum in particular makes code untestable (you can't fake 'today') and is a frequent source of edge-case bugs around midnight and time zones.",
              "Use the released CL_ABAP_CONTEXT_INFO for user and date, and inject a clock (ZIF_AU_CLOCK) where you need testable time. The intent is the same; the dependency becomes explicit and cloud-safe.",
            ],
            keyPoints: [
              "sy-uname → cl_abap_context_info=>get_user_technical_name( ).",
              "sy-datum → cl_abap_context_info=>get_system_date( ) (or an injected clock for testability).",
              "Explicit context beats hidden global state — and it's cloud-ready.",
            ],
            examples: [
              {
                title: "Reading system fields",
                variant: "before",
                lang: "ABAP",
                body: "Restricted on cloud and untestable — you can't fake the user or 'today'.",
                code: "data(lv_user) = sy-uname.\ndata(lv_today) = sy-datum.",
              },
              {
                title: "Released context API",
                variant: "after",
                lang: "ABAP",
                body: "Released, cloud-safe, and (with an injected clock) testable.",
                code: [
                  "data(lv_user)  = cl_abap_context_info=>get_user_technical_name( ).",
                  "data(lv_today) = cl_abap_context_info=>get_system_date( ).",
                ].join("\n"),
              },
            ],
            pitfalls: [
              "Swapping sy-datum for get_system_date keeps you cloud-safe but still isn't testable — inject a clock when the date drives logic you must test.",
            ],
            simplified: {
              oneLiner:
                "Read user/date from the released context API (and inject a clock for testable time), not sy-fields.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "Why are system fields like sy-datum restricted in ABAP Cloud?",
                options: {
                  A: "They are too slow.",
                  B: "They carry hidden global state that's untestable and edge-case-prone.",
                  C: "They are deprecated keywords.",
                  D: "They only work in reports.",
                },
                correct: "B",
                explanations: {
                  A: "Speed isn't the concern.",
                  B: "Correct — hidden global state (you can't fake 'today') is the problem.",
                  C: "They're fields, not deprecated keywords per se.",
                  D: "They work beyond reports; that's not the issue.",
                },
                principle: "Prefer explicit, released context over hidden sy-field state.",
              },
              {
                n: 2,
                question:
                  "What replaces sy-uname on ABAP Cloud?",
                options: {
                  A: "cl_gui_frontend_services.",
                  B: "A direct SELECT on USR02.",
                  C: "cl_abap_context_info=>get_user_technical_name( ).",
                  D: "sy-uname is fully released on cloud.",
                },
                correct: "C",
                explanations: {
                  A: "Frontend services are GUI-only.",
                  B: "Reading USR02 is itself a finding.",
                  C: "Correct — the released context API provides the technical user name.",
                  D: "sy-uname is restricted on cloud.",
                },
                principle: "Use the released context API for user identity.",
              },
              {
                n: 3,
                question:
                  "You replaced sy-datum with get_system_date but the date drives logic you must unit-test. What else helps?",
                options: {
                  A: "Inject a clock abstraction (e.g. ZIF_AU_CLOCK) so tests can fix 'today'.",
                  B: "Go back to sy-datum in tests only.",
                  C: "Hardcode the date.",
                  D: "Nothing — get_system_date is already testable.",
                },
                correct: "A",
                explanations: {
                  A: "Correct — an injected clock lets tests control the date deterministically.",
                  B: "Reintroducing sy-datum defeats the purpose.",
                  C: "Hardcoding breaks real behaviour.",
                  D: "get_system_date still returns the real date — not controllable in a test.",
                },
                principle: "Cloud-safe ≠ testable; inject a clock for date-driven logic.",
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
            question: "`update vbak set ... where vbeln = @lv.` should become…",
            options: {
              A: "A native SQL UPDATE.",
              B: "A released API/BAPI or RAP EML call.",
              C: "An UPDATE with CLIENT SPECIFIED.",
              D: "A MODIFY instead of UPDATE.",
            },
            correct: "B",
            principle: "Write through released APIs, never the SAP table.",
          },
          {
            n: 2,
            question: "`select * from bsid ...` (a physical SAP table) is best replaced by…",
            options: {
              A: "Reading the released I_* CDS interface view.",
              B: "EXEC SQL.",
              C: "A buffered Z-copy of BSID.",
              D: "CALL TRANSACTION.",
            },
            correct: "A",
            principle: "Read released CDS, not physical tables.",
          },
          {
            n: 3,
            question:
              "You must call a non-released FM. The Clean Core approach is to…",
            options: {
              A: "Add an ATC exemption at every call site.",
              B: "Copy the FM into your namespace.",
              C: "Isolate it behind one released wrapper class and exempt only that.",
              D: "Avoid the requirement entirely.",
            },
            correct: "C",
            principle: "Localize the exemption in one released facade.",
          },
          {
            n: 4,
            question: "`lv_today = sy-datum.` on ABAP Cloud should become…",
            options: {
              A: "A SELECT on a date table.",
              B: "cl_gui_frontend_services.",
              C: "A hardcoded date constant.",
              D: "cl_abap_context_info=>get_system_date( ) (and inject a clock if testable time is needed).",
            },
            correct: "D",
            principle: "Released context API replaces restricted sy-fields.",
          },
          {
            n: 5,
            question:
              "Which two ATC variants surface these Clean Core findings?",
            options: {
              A: "CLOUD_READINESS and S4HANA_READINESS.",
              B: "PERFORMANCE and SECURITY only.",
              C: "DEFAULT and EXTENDED.",
              D: "There is no ATC variant for Clean Core.",
            },
            correct: "A",
            principle: "Run CLOUD_READINESS + S4HANA_READINESS to see the findings.",
          },
        ],
      },
    },

    /* ============================================================
       MODULE 3 — From BDC / CALL TRANSACTION to API / RAP
       Source: docs/bdc-to-api-cookbook.md
       ============================================================ */
    {
      id: "m3-bdc-to-api",
      n: 3,
      title: "From BDC / CALL TRANSACTION to API / RAP",
      sourceCourse: "bdc-to-api-cookbook.md",
      blurb:
        "Batch input replays the UI of a transaction — brittle, slow, and not available in ABAP Cloud. Call the business logic directly instead: a released BAPI/API, RAP (EML), or OData.",
      concepts: [
        {
          id: "m3-c1",
          code: "3.1",
          title: "Why batch input breaks — and the decision tree",
          bloom: "U",
          lesson: {
            status: "ready",
            notesRef: "docs/bdc-to-api-cookbook.md",
            paragraphs: [
              "BDC and CALL TRANSACTION automate the screens of a transaction — they replay keystrokes against dynpros. Any screen change breaks them, error handling is awkward (you parse screen messages), they're slow, and none of it is available in ABAP Cloud.",
              "The decision tree: prefer a released BAPI/API; else use a RAP business object via EML; else call an OData service; and only if nothing is released, isolate the legacy call behind one released wrapper and plan its replacement. Never spread CALL TRANSACTION across the codebase.",
            ],
            keyPoints: [
              "Batch input automates the UI, not the business logic — that's why it's brittle.",
              "Decision tree: released API → RAP/EML → OData → (last resort) wrapped legacy call.",
              "CALL TRANSACTION / BDC_* are not released in ABAP Cloud — there's no cloud equivalent.",
            ],
            examples: [
              {
                title: "Batch input replays the screen",
                variant: "before",
                lang: "ABAP",
                body: "Dozens of screen/field rows; breaks the moment the transaction's UI changes.",
                code: [
                  "perform fill_bdc using 'SAPMV45A' '0101' 'X'.",
                  "perform fill_bdc using 'VBAK-AUART' 'OR'.",
                  "\" ...dozens of screen/field rows...",
                  "call transaction 'VA01' using lt_bdc mode 'N' update 'S'",
                  "  messages into lt_messages.   \" breaks when the screen changes",
                ].join("\n"),
              },
              {
                title: "Call the business logic directly",
                variant: "after",
                lang: "ABAP",
                body: "A released API drives the business object — no screens, robust errors, cloud-ready.",
                code: [
                  "call function 'BAPI_SALESORDER_CREATEFROMDAT2'",
                  "  exporting order_header_in = ls_header",
                  "  importing salesdocument   = data(lv_vbeln)",
                  "  tables    order_items_in  = lt_items",
                  "            return          = lt_return.",
                ].join("\n"),
              },
            ],
            pitfalls: [
              "'Mode N' batch input hides screen errors; you only find out via the messages table.",
              "Don't port the screen sequence 1:1 — map fields to API parameters and drop UI-only steps.",
            ],
            simplified: {
              oneLiner:
                "Stop replaying screens. Call the business logic: API → RAP → OData → (last resort) a wrapped legacy call.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question: "Why is BDC / CALL TRANSACTION inherently brittle?",
                options: {
                  A: "It can only run in the foreground.",
                  B: "It needs a COMMIT after every field.",
                  C: "It automates the transaction's UI, so any screen change breaks it.",
                  D: "It cannot pass internal tables.",
                },
                correct: "C",
                explanations: {
                  A: "It runs in background mode too.",
                  B: "Per-field commits aren't a thing here.",
                  C: "Correct — it replays dynpro keystrokes; UI changes break the recording.",
                  D: "It does pass BDC tables; that's not the fragility.",
                },
                principle: "Batch input couples you to the UI, not the logic.",
              },
              {
                n: 2,
                question:
                  "What is the FIRST choice in the BDC→API decision tree?",
                options: {
                  A: "A RAP business object via EML.",
                  B: "A released BAPI / API for the object.",
                  C: "An OData service call.",
                  D: "A wrapped CALL TRANSACTION.",
                },
                correct: "B",
                explanations: {
                  A: "RAP/EML is the second choice.",
                  B: "Correct — prefer a released BAPI/API when one exists.",
                  C: "OData is third.",
                  D: "Wrapped legacy is the last resort.",
                },
                principle: "API → RAP → OData → wrapped legacy.",
              },
              {
                n: 3,
                question:
                  "On the SAP BTP ABAP environment, CALL TRANSACTION is…",
                options: {
                  A: "Faster than on-premise.",
                  B: "Released for read-only transactions.",
                  C: "The recommended integration method.",
                  D: "Not released — there is no cloud equivalent; move to APIs/RAP.",
                },
                correct: "D",
                explanations: {
                  A: "Speed isn't the point; it isn't available.",
                  B: "It isn't released, read-only or not.",
                  C: "It's the opposite of recommended.",
                  D: "Correct — batch input / BDC_* aren't released on cloud.",
                },
                principle: "No batch input on cloud — use released APIs or RAP.",
              },
            ],
          },
        },
        {
          id: "m3-c2",
          code: "3.2",
          title: "CALL TRANSACTION → released BAPI with proper errors",
          bloom: "A",
          lesson: {
            status: "ready",
            notesRef: "docs/bdc-to-api-cookbook.md",
            paragraphs: [
              "Replacing CALL TRANSACTION with a BAPI changes how you handle results: the screen-messages table becomes a typed BAPIRET2 table you can inspect, and you own the transaction boundary explicitly with BAPI_TRANSACTION_COMMIT / ROLLBACK.",
              "Inspect the return table for errors (e.g. via ZCL_AU_MESSAGE), roll back and raise a typed ZCX_AU_ERROR on failure, and commit only on success. Never surface raw screen messages to callers.",
            ],
            keyPoints: [
              "BDC messages → BAPIRET2; inspect it, don't display raw screen text.",
              "Roll back + raise a typed error on failure; commit only on success.",
              "You own the commit/rollback — BAPIs don't auto-commit.",
            ],
            examples: [
              {
                title: "Screen messages, implicit commit",
                variant: "before",
                lang: "ABAP",
                body: "Errors arrive as parsed screen text; the transaction's implicit commit is opaque.",
                code: [
                  "call transaction 'VA01' using lt_bdc mode 'N' update 'S'",
                  "  messages into lt_messages.",
                  "\" now parse lt_messages screen text to guess what happened",
                ].join("\n"),
              },
              {
                title: "Typed errors, explicit commit/rollback",
                variant: "after",
                lang: "ABAP",
                body: "Inspect BAPIRET2; roll back and raise on error, commit on success.",
                code: [
                  "if zcl_au_message=>has_errors( lt_return ).",
                  "  rollback work.",
                  "  zcl_au_error=>raise( zcl_au_message=>concat( lt_return ) ).",
                  "else.",
                  "  call function 'BAPI_TRANSACTION_COMMIT' exporting wait = abap_true.",
                  "endif.",
                ].join("\n"),
              },
            ],
            pitfalls: [
              "Forgetting BAPI_TRANSACTION_COMMIT leaves the work uncommitted; forgetting the rollback on error leaves a partial state.",
              "Don't leak BAPIRET2 raw text upward — translate to a typed exception.",
            ],
            simplified: {
              oneLiner:
                "Inspect BAPIRET2, roll back + raise on error, and commit explicitly on success.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "When you move from CALL TRANSACTION to a BAPI, the messages table becomes…",
                options: {
                  A: "A typed BAPIRET2 table you inspect programmatically.",
                  B: "An ALV grid.",
                  C: "A spool request.",
                  D: "Unavailable.",
                },
                correct: "A",
                explanations: {
                  A: "Correct — BAPIRET2 is the structured result you inspect.",
                  B: "ALV is output, unrelated.",
                  C: "Spool is unrelated.",
                  D: "You get more structured info, not less.",
                },
                principle: "BAPIRET2 replaces parsed screen messages.",
              },
              {
                n: 2,
                question:
                  "On a BAPI error you should…",
                options: {
                  A: "Commit anyway and log a warning.",
                  B: "Ignore it if mode is N.",
                  C: "Roll back and raise a typed exception (e.g. ZCX_AU_ERROR).",
                  D: "Retry forever.",
                },
                correct: "C",
                explanations: {
                  A: "Committing on error persists a bad state.",
                  B: "Mode is a batch-input concept; irrelevant to a BAPI.",
                  C: "Correct — roll back and surface a typed error.",
                  D: "Unbounded retry is not error handling.",
                },
                principle: "Fail cleanly: rollback + typed exception.",
              },
              {
                n: 3,
                question: "Who is responsible for the COMMIT after a BAPI succeeds?",
                options: {
                  A: "The database, automatically.",
                  B: "Your code, via BAPI_TRANSACTION_COMMIT (or COMMIT WORK).",
                  C: "The dynpro framework.",
                  D: "No commit is ever needed.",
                },
                correct: "B",
                explanations: {
                  A: "There's no automatic commit.",
                  B: "Correct — you own the transaction boundary explicitly.",
                  C: "There's no dynpro involved anymore.",
                  D: "A commit is required to persist.",
                },
                principle: "Own the commit boundary explicitly with BAPIs.",
              },
            ],
          },
        },
        {
          id: "m3-c3",
          code: "3.3",
          title: "Mass runs: loop + CALL TRANSACTION → bulk API / RAP EML",
          bloom: "An",
          lesson: {
            status: "ready",
            notesRef: "docs/bdc-to-api-cookbook.md · src/retry/README.md",
            paragraphs: [
              "A 'loop + CALL TRANSACTION' mass run multiplies every weakness of batch input. Replace it with a single bulk API call or package processing, and on a RAP BO use EML with multiple instances in one MODIFY ENTITIES … then COMMIT ENTITIES.",
              "Wrap genuinely transient failures (locks, temporary unavailability) with a retry helper rather than a blind re-loop, and process in packages so one failure doesn't roll back the whole run.",
            ],
            keyPoints: [
              "Replace loop+CALL TRANSACTION with one bulk API call or package processing.",
              "RAP: many instances in one MODIFY ENTITIES, then COMMIT ENTITIES.",
              "Wrap transient failures with retry (ZCL_AU_RETRY); package so failures are isolated.",
            ],
            examples: [
              {
                title: "Loop of CALL TRANSACTIONs",
                variant: "before",
                lang: "ABAP",
                body: "One brittle UI replay per row — slow and all-or-nothing error handling.",
                code: [
                  "loop at lt_orders into data(ls_order).",
                  "  call transaction 'VA01' using build_bdc( ls_order ) mode 'N'.",
                  "endloop.",
                ].join("\n"),
              },
              {
                title: "One RAP EML modify for all instances",
                variant: "after",
                lang: "ABAP",
                body: "All instances in a single transactional EML call; commit once.",
                code: [
                  "modify entities of zi_salesorder",
                  "  entity salesorder",
                  "  create fields ( ordertype )",
                  "  with value #( for ls in lt_orders",
                  "                ( %cid = ls-cid ordertype = ls-auart ) )",
                  "  mapped data(mapped) failed data(failed) reported data(reported).",
                  "if failed is initial.",
                  "  commit entities responses failed data(commit_failed).",
                  "endif.",
                ].join("\n"),
              },
            ],
            pitfalls: [
              "A blind re-loop on failure can double-post; use idempotent keys and a real retry policy.",
              "Don't commit per row in a mass run unless you truly need per-row durability — package it.",
            ],
            simplified: {
              oneLiner:
                "Replace the loop of CALL TRANSACTIONs with one bulk API / EML call, retry transients, and package the work.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question: "The cloud-native way to create many RAP instances at once is…",
                options: {
                  A: "A loop of CALL TRANSACTIONs.",
                  B: "One MODIFY ENTITIES with all instances, then COMMIT ENTITIES.",
                  C: "EXEC SQL batch insert.",
                  D: "A direct INSERT into the table.",
                },
                correct: "B",
                explanations: {
                  A: "That's the anti-pattern we're removing.",
                  B: "Correct — EML handles multiple instances transactionally in one call.",
                  C: "Native SQL is itself a finding.",
                  D: "Direct table writes bypass the BO.",
                },
                principle: "Batch through EML, commit once.",
              },
              {
                n: 2,
                question:
                  "How should transient failures (e.g. lock contention) be handled in a mass run?",
                options: {
                  A: "Wrap them with a real retry policy (e.g. ZCL_AU_RETRY).",
                  B: "Ignore them.",
                  C: "Blindly re-run the whole loop.",
                  D: "Commit twice.",
                },
                correct: "A",
                explanations: {
                  A: "Correct — a bounded retry with backoff handles transient errors.",
                  B: "Ignoring loses work.",
                  C: "A blind re-loop risks double-posting.",
                  D: "Double-commit doesn't address contention.",
                },
                principle: "Retry transients deliberately; don't blind-loop.",
              },
              {
                n: 3,
                question:
                  "Why prefer package processing over committing each row in a mass run?",
                options: {
                  A: "It needs CLIENT SPECIFIED.",
                  B: "It runs on the frontend.",
                  C: "It isolates failures and avoids per-row commit overhead while keeping the run robust.",
                  D: "It guarantees no errors.",
                },
                correct: "C",
                explanations: {
                  A: "Client handling is unrelated.",
                  B: "It's backend processing.",
                  C: "Correct — packaging isolates failures and avoids per-row commit cost.",
                  D: "Nothing guarantees no errors.",
                },
                principle: "Package mass work to isolate failures and bound commits.",
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
            question: "The root reason batch input is brittle is that it…",
            options: {
              A: "Runs too fast.",
              B: "Automates the transaction's UI rather than its business logic.",
              C: "Requires too many host variables.",
              D: "Cannot be transported.",
            },
            correct: "B",
            principle: "It replays screens, so UI changes break it.",
          },
          {
            n: 2,
            question: "The preferred order to replace a CALL TRANSACTION is…",
            options: {
              A: "OData → wrapper → BAPI → RAP.",
              B: "Wrapper first, always.",
              C: "Keep CALL TRANSACTION but add comments.",
              D: "Released API → RAP/EML → OData → wrapped legacy.",
            },
            correct: "D",
            principle: "API → RAP → OData → wrapped legacy.",
          },
          {
            n: 3,
            question: "After a successful BAPI, persistence requires…",
            options: {
              A: "An explicit BAPI_TRANSACTION_COMMIT (or COMMIT WORK).",
              B: "Nothing — it auto-commits.",
              C: "A CALL SCREEN.",
              D: "A second BAPI call.",
            },
            correct: "A",
            principle: "BAPIs need an explicit commit.",
          },
          {
            n: 4,
            question: "A loop of CALL TRANSACTIONs over 10,000 rows is best replaced by…",
            options: {
              A: "The same loop in a background job.",
              B: "One bulk API / EML call with packaging and retry.",
              C: "EXEC SQL.",
              D: "Per-row direct table inserts.",
            },
            correct: "B",
            principle: "Go bulk + packaged, not row-by-row UI replay.",
          },
        ],
      },
    },

    /* ============================================================
       MODULE 4 — Modernizing toward RAP / CDS
       Source: docs/rap-cds-modernization.md
       ============================================================ */
    {
      id: "m4-rap-cds",
      n: 4,
      title: "Modernizing toward RAP / CDS",
      sourceCourse: "rap-cds-modernization.md",
      blurb:
        "The Clean Core target picture: released CDS data models, RAP behaviour, OData service bindings, and Fiori — runnable on S/4HANA and the BTP ABAP environment. Move a classic report into this stack layer by layer.",
      concepts: [
        {
          id: "m4-c1",
          code: "4.1",
          title: "Classic report with direct table access → CDS consumption view",
          bloom: "An",
          lesson: {
            status: "ready",
            notesRef: "docs/rap-cds-modernization.md",
            paragraphs: [
              "A classic report that SELECTs a physical table and WRITEs a list couples data access, logic, and UI in one program. The modern target separates them: a CDS view holds the data model and logic (pushed to HANA), a service binding exposes it as OData, and Fiori Elements renders it with zero ABAP UI code.",
              "Start by expressing the read as a CDS consumption view over released interface views (I_*), using associations instead of joins where you navigate. UI/analytics annotations then drive Fiori and analytics declaratively.",
            ],
            keyPoints: [
              "CDS replaces SELECT-on-table: stable, reusable, HANA-pushed, analytics-ready.",
              "Associations express navigation; annotations drive UI/analytics declaratively.",
              "Layer the views: interface (I_*) for the contract, consumption (C_*/ZC_*) for UI.",
            ],
            examples: [
              {
                title: "Report with direct table access + WRITE",
                variant: "before",
                lang: "ABAP",
                body: "Data, logic, and UI fused in one program; reads a physical table.",
                code: [
                  "report z_open_items.",
                  "select * from bsid into table @data(lt) where bukrs = p_bukrs.   \" SAP table",
                  "loop at lt into data(ls). write: / ls-belnr, ls-wrbtr. endloop.",
                ].join("\n"),
              },
              {
                title: "CDS consumption view over released interface views",
                variant: "after",
                lang: "ABAP CDS",
                body: "Declarative model over I_* views; expose via service binding, render with Fiori Elements — no ABAP UI code.",
                code: [
                  "@AccessControl.authorizationCheck: #CHECK",
                  "define view entity ZC_OpenItem",
                  "  as select from I_OperationalAcctgDocItem   -- released interface view",
                  "{",
                  "  key AccountingDocument,",
                  "      CompanyCode,",
                  "      AmountInCompanyCodeCurrency as Amount,",
                  "      _CompanyCode.CompanyCodeName            -- via association",
                  "}",
                  "where IsOpenItem = 'X'",
                ].join("\n"),
              },
            ],
            pitfalls: [
              "Don't put @UI annotations on interface (I_*) views — keep them on the consumption layer.",
              "Reach for associations over hard joins where you navigate to a parent/child.",
            ],
            simplified: {
              oneLiner:
                "Turn the report's SELECT+WRITE into a CDS view (logic in the model) and let Fiori render it.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "What does moving a report's data access into a CDS view achieve?",
                options: {
                  A: "It forces the report to run in dialog mode.",
                  B: "A stable, reusable, HANA-pushed model that Fiori/analytics can consume declaratively.",
                  C: "It removes the need for authorizations.",
                  D: "It makes WRITE statements faster.",
                },
                correct: "B",
                explanations: {
                  A: "There's no dialog requirement.",
                  B: "Correct — CDS is the reusable, pushed-down, annotation-driven model.",
                  C: "Authorizations come via DCL, not for free.",
                  D: "WRITE is replaced, not sped up.",
                },
                principle: "CDS is the data-model layer of the Clean Core target.",
              },
              {
                n: 2,
                question:
                  "Where do @UI annotations belong in the VDM layering?",
                options: {
                  A: "On the physical table.",
                  B: "On the interface (I_*) view.",
                  C: "On the consumption (C_*/ZC_*) view.",
                  D: "In the report's selection screen.",
                },
                correct: "C",
                explanations: {
                  A: "Tables don't carry CDS annotations.",
                  B: "Interface views are the reusable contract — keep UI off them.",
                  C: "Correct — UI annotations live on the consumption layer.",
                  D: "Selection screens are the thing we're replacing.",
                },
                principle: "Keep interface views clean; annotate the consumption layer.",
              },
              {
                n: 3,
                question:
                  "To navigate from an item to its company-code text, prefer…",
                options: {
                  A: "An association (e.g. _CompanyCode).",
                  B: "A nested SELECT in a loop.",
                  C: "A hardcoded join on MANDT.",
                  D: "A CALL TRANSACTION.",
                },
                correct: "A",
                explanations: {
                  A: "Correct — associations express navigation cleanly in CDS.",
                  B: "That's the N+1 anti-pattern.",
                  C: "Manual client joins are discouraged.",
                  D: "Batch input is unrelated.",
                },
                principle: "Associations express navigation in the data model.",
              },
            ],
          },
        },
        {
          id: "m4-c2",
          code: "4.2",
          title: "Module-pool / FM logic → RAP managed behaviour",
          bloom: "An",
          lesson: {
            status: "ready",
            notesRef: "docs/rap-cds-modernization.md",
            paragraphs: [
              "Transactional logic scattered across module pools and function modules becomes one RAP behaviour definition. A managed implementation lets the framework own persistence (most new apps); you declare create/update/delete, validations, determinations, and actions against the CDS entity.",
              "Behaviour implementations use EML to read/modify the business object in a type-safe way; use unmanaged only when you must reuse existing logic/BAPIs (behind a Clean-Core wrapper), and add `with draft;` for Fiori draft apps.",
            ],
            keyPoints: [
              "RAP behaviour = one transactional model serving OData, EML and Fiori.",
              "Managed: framework owns persistence; declare CRUD + validations + determinations + actions.",
              "Unmanaged: reuse existing logic/BAPIs (wrapped); draft: add `with draft;`.",
            ],
            examples: [
              {
                title: "Logic spread across a module pool / FMs",
                variant: "before",
                lang: "ABAP",
                body: "Transactional rules live in screen flow logic and function modules — untestable and UI-bound.",
                code: [
                  "* module-pool PBO/PAI + Z_TRAVEL_SAVE function module:",
                  "*   validate dates in PAI, set status in a subroutine,",
                  "*   UPDATE ztravel in the save FM ...",
                ].join("\n"),
              },
              {
                title: "One RAP managed behaviour",
                variant: "after",
                lang: "ABAP RAP",
                body: "CRUD, validation, determination and action declared once; framework owns persistence.",
                code: [
                  "managed implementation in class zbp_i_travel unique;",
                  "define behavior for ZI_Travel alias Travel",
                  "persistent table ztravel",
                  "lock master authorization master ( instance )",
                  "{",
                  "  field ( readonly ) TravelID;",
                  "  create; update; delete;",
                  "  validation validateDates on save { field BeginDate, EndDate; }",
                  "  determination setStatus on modify { create; }",
                  "  action ( features : instance ) acceptTravel result [1] $self;",
                  "}",
                ].join("\n"),
              },
            ],
            pitfalls: [
              "Don't lift-and-shift screen logic into determinations verbatim — model the intent (validations vs determinations vs actions).",
              "Reuse via unmanaged still belongs behind a released wrapper, not a raw legacy call.",
            ],
            simplified: {
              oneLiner:
                "Collapse module-pool/FM transaction logic into one RAP behaviour with declared CRUD, validations and actions.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "In a 'managed' RAP implementation, who owns persistence?",
                options: {
                  A: "The caller, via direct UPDATEs.",
                  B: "A module pool.",
                  C: "The RAP framework.",
                  D: "An external OData client.",
                },
                correct: "C",
                explanations: {
                  A: "Direct UPDATEs are what we're removing.",
                  B: "Module pools are the legacy we're replacing.",
                  C: "Correct — managed RAP lets the framework own persistence.",
                  D: "The client consumes the service; it doesn't persist.",
                },
                principle: "Managed RAP: framework owns persistence.",
              },
              {
                n: 2,
                question:
                  "A rule that derives a field's value automatically on create maps to a RAP…",
                options: {
                  A: "validation.",
                  B: "determination.",
                  C: "action.",
                  D: "service binding.",
                },
                correct: "B",
                explanations: {
                  A: "Validations check, they don't derive.",
                  B: "Correct — determinations derive/adjust data on trigger events.",
                  C: "Actions are explicit, often user-triggered operations.",
                  D: "A binding exposes the service, not field logic.",
                },
                principle: "Determinations derive; validations check; actions act.",
              },
              {
                n: 3,
                question:
                  "When must you choose 'unmanaged' over 'managed'?",
                options: {
                  A: "When you must reuse existing logic/BAPIs (behind a wrapper).",
                  B: "Whenever the entity has more than 10 fields.",
                  C: "Only for read-only views.",
                  D: "Never — managed always works.",
                },
                correct: "A",
                explanations: {
                  A: "Correct — unmanaged is for reusing existing persistence/logic.",
                  B: "Field count is irrelevant.",
                  C: "Read-only is about projections, not unmanaged.",
                  D: "Some scenarios genuinely need unmanaged.",
                },
                principle: "Unmanaged = reuse existing logic (wrapped); managed = greenfield.",
              },
            ],
          },
        },
        {
          id: "m4-c3",
          code: "4.3",
          title: "CDS good practice (VDM): layer, associate, extend",
          bloom: "U",
          lesson: {
            status: "ready",
            notesRef: "docs/rap-cds-modernization.md",
            paragraphs: [
              "The Virtual Data Model (VDM) gives CDS structure: basic/interface views (I_*) are the reusable, stable contract; consumption views (C_*/ZC_*) carry UI annotations and projections. Don't put UI annotations on interface views, and don't reach around the model with raw joins where an association exists.",
              "Extend, don't modify: use `extend view entity` and metadata extensions rather than changing released views. Parameters make filters reusable; DCL (@AccessControl) handles row-level authorizations.",
            ],
            keyPoints: [
              "Interface (I_*) = contract; consumption (C_*/ZC_*) = UI/annotations.",
              "Associations over joins for navigation; parameters for reusable filters.",
              "Extend (extend view entity / metadata extensions), don't modify released views.",
              "DCL / @AccessControl provide row-level authorization declaratively.",
            ],
            examples: [
              {
                title: "Modifying a released view + UI on the interface layer",
                variant: "before",
                lang: "ABAP CDS",
                body: "Editing a released view and annotating the interface layer both break Clean Core layering.",
                code: [
                  "-- editing the released I_* view directly, and putting @UI here:",
                  "@UI.lineItem: [{ position: 10 }]   -- wrong layer",
                  "extend ...   -- (conceptually: modifying the contract)",
                ].join("\n"),
              },
              {
                title: "Extend on the right layer",
                variant: "after",
                lang: "ABAP CDS",
                body: "Add fields via an extend view; keep UI on the consumption layer; never modify the released contract.",
                code: [
                  "extend view entity ZC_OpenItem with",
                  "{",
                  "  _CompanyCode.Currency as DisplayCurrency",
                  "}",
                  "-- @UI annotations live on ZC_* (consumption), not on I_* (interface)",
                ].join("\n"),
              },
            ],
            pitfalls: [
              "Putting analytics/UI annotations on interface views leaks presentation into the reusable contract.",
              "Copy-modifying a released view instead of extending it recreates the 'Z-copy of standard' anti-pattern in CDS.",
            ],
            simplified: {
              oneLiner:
                "Layer your CDS (I_* contract, C_* UI), navigate via associations, and extend — never modify — released views.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "In VDM, which layer carries @UI annotations?",
                options: {
                  A: "Interface (I_*) views.",
                  B: "The physical table.",
                  C: "Consumption (C_*/ZC_*) views.",
                  D: "The service binding.",
                },
                correct: "C",
                explanations: {
                  A: "Interface views are the clean reusable contract.",
                  B: "Tables don't carry annotations.",
                  C: "Correct — UI annotations belong on the consumption layer.",
                  D: "The binding exposes the service; it doesn't hold @UI.",
                },
                principle: "I_* = contract; C_* = UI.",
              },
              {
                n: 2,
                question:
                  "To add a field to a released CDS view the Clean Core way, you…",
                options: {
                  A: "Copy it to a Z-view and edit the copy.",
                  B: "Modify the released view in place.",
                  C: "Use `extend view entity` / metadata extensions.",
                  D: "Add the column to the underlying table.",
                },
                correct: "C",
                explanations: {
                  A: "A Z-copy is the very anti-pattern we avoid.",
                  B: "Modifying released objects breaks Clean Core.",
                  C: "Correct — extend, don't modify.",
                  D: "Adding to the table doesn't extend the view and risks the model.",
                },
                principle: "Extend, don't modify, released views.",
              },
              {
                n: 3,
                question:
                  "Row-level authorization in CDS is expressed via…",
                options: {
                  A: "DCL / @AccessControl access control.",
                  B: "A WRITE statement.",
                  C: "sy-uname checks in ABAP.",
                  D: "A selection-screen AT SELECTION-SCREEN block.",
                },
                correct: "A",
                explanations: {
                  A: "Correct — DCL provides declarative row-level authorization.",
                  B: "WRITE is output.",
                  C: "Ad-hoc sy-uname checks are the legacy approach.",
                  D: "Selection screens are being replaced.",
                },
                principle: "Authorize declaratively with DCL.",
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
            question: "A report that SELECTs a physical table and WRITEs a list should become…",
            options: {
              A: "A CDS view exposed via OData and rendered by Fiori Elements.",
              B: "A module pool.",
              C: "A BDC recording.",
              D: "A native SQL report.",
            },
            correct: "A",
            principle: "CDS → RAP → OData → Fiori is the target stack.",
          },
          {
            n: 2,
            question: "Scattered module-pool/FM transaction logic is consolidated into…",
            options: {
              A: "More function modules.",
              B: "A RAP behaviour definition (managed where possible).",
              C: "A bigger selection screen.",
              D: "EXEC SQL.",
            },
            correct: "B",
            principle: "One RAP behaviour replaces the scattered transaction logic.",
          },
          {
            n: 3,
            question: "@UI annotations belong on…",
            options: {
              A: "The interface (I_*) view.",
              B: "The physical table.",
              C: "A FORM routine.",
              D: "The consumption (C_*/ZC_*) view.",
            },
            correct: "D",
            principle: "Keep UI off the interface layer.",
          },
          {
            n: 4,
            question: "To add a field to a released CDS view, you…",
            options: {
              A: "Modify the released view.",
              B: "Z-copy and edit it.",
              C: "Use `extend view entity` (extend, don't modify).",
              D: "Add a CALL TRANSACTION.",
            },
            correct: "C",
            principle: "Extend, don't modify.",
          },
        ],
      },
    },

    /* ============================================================
       MODULE 5 — Converting classic apps to Fiori
       Source: docs/fiori-conversion-cookbook.md
       ============================================================ */
    {
      id: "m5-fiori",
      n: 5,
      title: "Converting classic apps to Fiori",
      sourceCourse: "fiori-conversion-cookbook.md",
      blurb:
        "The Clean Core way to give a classic app a Fiori tile is not to render UI from ABAP — it's CDS → RAP → OData (service binding) → Fiori Elements, which produces a List Report / Object Page with zero UI code.",
      concepts: [
        {
          id: "m5-c1",
          code: "5.1",
          title: "SM30 / SE16 table maintenance → managed 'Manage X' app",
          bloom: "A",
          lesson: {
            status: "ready",
            notesRef: "docs/fiori-conversion-cookbook.md (Pattern 1)",
            paragraphs: [
              "Editing a custom table via SM30 or SE16 is the sweet spot for a generated, managed RAP app. Instead of a generated maintenance dialog, you produce a CDS interface + projection view, a managed behaviour with create/update/delete, a service definition and an OData V4 (UI) service binding — and Fiori Elements gives you a transportable, authorization-aware 'Manage <X>' app.",
              "ZCL_AU_FIORI_GEN scripts the boilerplate from a structure: seed the fields, mark the key, and generate the artifacts to paste into ADT.",
            ],
            keyPoints: [
              "SM30/SE16 editing → a managed RAP 'Manage X' app (CDS + behaviour + service + binding).",
              "The result is transportable and authorization-aware — unlike an SE16 grant.",
              "ZCL_AU_FIORI_GEN scaffolds the CDS/RAP/SRVD source from a structure.",
            ],
            examples: [
              {
                title: "Maintaining data through SE16 / SM30",
                variant: "before",
                lang: "ABAP",
                body: "Direct table editing — no business logic, no proper authorization model, not cloud-ready.",
                code: "* SM30 / SE16N edit of ZTPRODUCT — raw table maintenance",
              },
              {
                title: "Generate a managed RAP app",
                variant: "after",
                lang: "ABAP",
                body: "Seed fields, mark the key, generate the CDS/RAP/SRVD; activate and bind for a Fiori Manage app.",
                code: [
                  "data(lt) = zcl_au_fiori_gen=>fields_from_structure( 'ZTPRODUCT' ).",
                  "modify lt from value #( is_key = abap_true )",
                  "  transporting is_key where name = 'product_id'.",
                  "data(ls) = zcl_au_fiori_gen=>generate(",
                  "  iv_entity = 'Product' iv_data_source = 'ztproduct' it_fields = lt ).",
                  "\" paste ls-interface_view / projection_view / behavior /",
                  "\" service_definition into ADT, activate, then bind OData V4 - UI",
                ].join("\n"),
              },
            ],
            pitfalls: [
              "An SE16 authorization is not a substitute for a proper app — it bypasses business logic and auditability.",
              "Add `with draft;` only when you want a draft-enabled edit app (the generator omits it by default so the output activates).",
            ],
            simplified: {
              oneLiner:
                "Replace SM30/SE16 editing with a generated, managed RAP 'Manage X' Fiori app.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "Why is a managed RAP app better than granting SE16 edit for a custom table?",
                options: {
                  A: "SE16 is slower.",
                  B: "SE16 cannot show more than 100 rows.",
                  C: "The app runs business logic and is transportable + authorization-aware; SE16 bypasses all that.",
                  D: "SE16 requires a Fiori license.",
                },
                correct: "C",
                explanations: {
                  A: "Speed isn't the point.",
                  B: "Row limits aren't the issue.",
                  C: "Correct — the generated app brings logic, authorization and transportability.",
                  D: "Licensing isn't the distinction.",
                },
                principle: "A real app brings logic + authorization; raw table editing doesn't.",
              },
              {
                n: 2,
                question:
                  "What does ZCL_AU_FIORI_GEN actually produce?",
                options: {
                  A: "A running Fiori app deployed to the launchpad.",
                  B: "The CDS/RAP/service-definition source to paste into ADT and activate.",
                  C: "A BDC recording.",
                  D: "An ALV grid.",
                },
                correct: "B",
                explanations: {
                  A: "It scaffolds source; you still activate + bind in ADT.",
                  B: "Correct — it generates the artifact source from a structure.",
                  C: "It's the opposite of batch input.",
                  D: "ALV is the legacy UI.",
                },
                principle: "The generator scaffolds the cloud-native artifacts; you activate + bind.",
              },
              {
                n: 3,
                question:
                  "Which binding type do you publish for a Fiori Elements UI?",
                options: {
                  A: "OData V4 - UI.",
                  B: "RFC.",
                  C: "IDoc.",
                  D: "BAPI.",
                },
                correct: "A",
                explanations: {
                  A: "Correct — publish an OData V4 (UI) service binding for Fiori Elements.",
                  B: "RFC is a different integration channel.",
                  C: "IDoc is messaging.",
                  D: "A BAPI is a function, not a UI binding.",
                },
                principle: "Fiori Elements consumes an OData V4 - UI binding.",
              },
            ],
          },
        },
        {
          id: "m5-c2",
          code: "5.2",
          title: "ALV report / WRITE list → Fiori List Report",
          bloom: "A",
          lesson: {
            status: "ready",
            notesRef: "docs/fiori-conversion-cookbook.md (Pattern 2 & 3)",
            paragraphs: [
              "An ALV (or WRITE) report becomes a Fiori List Report by exposing its data as CDS → OData and letting Fiori Elements render it — no UI code. If the list is read-only you can drop the behaviour objects and expose only the projection; selection-screen parameters map to @UI.selectionField filter-bar fields.",
              "If you already build an LVC field catalog, ZCL_AU_FIORI_FROM_ALV can fold it into the field list (on cloud, seed fields with fields_from_structure instead, since LVC types are on-premise).",
            ],
            keyPoints: [
              "Read-only ALV → projection-only CDS + OData; no behaviour needed.",
              "SELECT-OPTIONs/PARAMETERs map to @UI.selectionField filter-bar fields.",
              "An existing LVC field catalog can seed the model (on-prem); on cloud seed from a structure.",
            ],
            examples: [
              {
                title: "ALV report rendering a grid from ABAP",
                variant: "before",
                lang: "ABAP",
                body: "UI built in ABAP; selection screen + SALV/ALV grid — on-premise only.",
                code: [
                  "select ... into table @data(lt).",
                  "cl_salv_table=>factory( importing r_salv_table = data(lo)",
                  "                        changing  t_table      = lt ).",
                  "lo->display( ).",
                ].join("\n"),
              },
              {
                title: "Fold the field catalog into a generated model",
                variant: "after",
                lang: "ABAP",
                body: "Reuse the field catalog (or seed from a structure on cloud); generate a display-only List Report.",
                code: [
                  "data(lt) = zcl_au_fiori_from_alv=>fields( lt_fcat ).   \" key & labels mapped",
                  "data(ls) = zcl_au_fiori_gen=>generate(",
                  "  iv_entity = 'Order' iv_data_source = 'ztorder' it_fields = lt ).",
                  "\" read-only: drop create/update/delete — expose the projection only",
                ].join("\n"),
              },
            ],
            pitfalls: [
              "ZCL_AU_FIORI_FROM_ALV uses LVC field-catalog types (on-premise); on cloud seed fields with fields_from_structure.",
              "Don't recreate the WRITE layout pixel-for-pixel — let Fiori Elements + annotations own presentation.",
            ],
            simplified: {
              oneLiner:
                "Expose the ALV's data as CDS→OData and let Fiori Elements render a List Report — drop the behaviour if it's read-only.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "For a read-only ALV report converted to Fiori, you can…",
                options: {
                  A: "Keep CALL SCREEN for the detail page.",
                  B: "Skip OData and use RFC.",
                  C: "Drop the behaviour objects and expose only the projection.",
                  D: "Only convert it if it has fewer than 10 columns.",
                },
                correct: "C",
                explanations: {
                  A: "No dynpro is involved in Fiori Elements.",
                  B: "Fiori Elements consumes OData, not raw RFC.",
                  C: "Correct — display-only needs no create/update/delete behaviour.",
                  D: "Column count is irrelevant.",
                },
                principle: "Read-only list = projection + OData, no behaviour.",
              },
              {
                n: 2,
                question:
                  "A report's SELECT-OPTIONs map in Fiori to…",
                options: {
                  A: "@UI.selectionField filter-bar fields.",
                  B: "WRITE statements.",
                  C: "BDC field rows.",
                  D: "A spool list.",
                },
                correct: "A",
                explanations: {
                  A: "Correct — selection criteria become filter-bar selection fields.",
                  B: "WRITE is being removed.",
                  C: "BDC is unrelated.",
                  D: "Spool is unrelated.",
                },
                principle: "Selection screen → Fiori filter bar via @UI.selectionField.",
              },
              {
                n: 3,
                question:
                  "Why can't ZCL_AU_FIORI_FROM_ALV run on ABAP Cloud?",
                options: {
                  A: "It needs internet access.",
                  B: "It references LVC field-catalog types, which are on-premise; seed from a structure on cloud.",
                  C: "It writes directly to a table.",
                  D: "It uses native SQL.",
                },
                correct: "B",
                explanations: {
                  A: "Network access isn't the constraint.",
                  B: "Correct — LVC types are on-prem; on cloud use fields_from_structure.",
                  C: "It generates source; it doesn't write tables.",
                  D: "It doesn't use native SQL.",
                },
                principle: "LVC types are on-prem; seed cloud models from a structure.",
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
            question: "The Clean Core way to give a classic app a Fiori tile is…",
            options: {
              A: "CDS → RAP → OData (service binding) → Fiori Elements.",
              B: "Render HTML from ABAP.",
              C: "A BDC against the Fiori app.",
              D: "An ITS/Webgui wrapper of the dynpro.",
            },
            correct: "A",
            principle: "Expose data as a service; let Fiori Elements render it.",
          },
          {
            n: 2,
            question: "SM30/SE16 table editing is best replaced by…",
            options: {
              A: "A spreadsheet upload.",
              B: "Wider SE16 authorizations.",
              C: "A generated, managed RAP 'Manage X' app.",
              D: "A module pool.",
            },
            correct: "C",
            principle: "Managed RAP app replaces raw table maintenance.",
          },
          {
            n: 3,
            question: "A read-only ALV list converts to a Fiori List Report that…",
            options: {
              A: "Requires create/update/delete behaviour.",
              B: "Needs only the projection exposed via OData (no behaviour).",
              C: "Must keep the SALV grid.",
              D: "Cannot have a filter bar.",
            },
            correct: "B",
            principle: "Display-only = projection + OData, no behaviour.",
          },
          {
            n: 4,
            question: "Which binding type publishes a Fiori Elements UI service?",
            options: {
              A: "OData V2 - Web API.",
              B: "RFC destination.",
              C: "SOAP.",
              D: "OData V4 - UI.",
            },
            correct: "D",
            principle: "Publish OData V4 - UI for Fiori Elements.",
          },
        ],
      },
    },

    /* ============================================================
       MODULE 6 — Clean Core Readiness: the self-audit  (item #2)
       Source: docs/clean-core-readiness.md
       ============================================================ */
    {
      id: "m6-readiness-audit",
      n: 6,
      title: "Clean Core Readiness: the self-audit",
      sourceCourse: "clean-core-readiness.md",
      blurb:
        "A per-object readiness check: which statements/APIs are cloud-safe today, which need a confirmed released replacement, and which have no cloud equivalent at all. The module check IS the self-audit — classify each item into its bucket.",
      concepts: [
        {
          id: "m6-c1",
          code: "6.1",
          title: "The three readiness buckets",
          bloom: "U",
          lesson: {
            status: "ready",
            notesRef: "docs/clean-core-readiness.md",
            paragraphs: [
              "The readiness matrix sorts each utility/statement into one of three buckets. Cloud-safe (✅) uses only released APIs and cloud-enabled language — install as-is. Confirm-before-cloud (⚠️) has a blocking API but a documented released replacement (for example /UI2/CL_JSON → xco_cp_json/ajson, or a TVARVC SELECT → a released config entity). On-premise only (❌) has no cloud equivalent — classic Dynpro/ALV, OPEN DATASET — and needs a different architecture (CDS+RAP+Fiori, released file/HTTP APIs).",
              "This is a static, best-effort audit. The authoritative check is ATC with the CLOUD_READINESS variant on your target system, because abaplint can't resolve SAP's released-API classification offline. Use the buckets to triage; use ATC to confirm.",
            ],
            keyPoints: [
              "✅ cloud-safe: released APIs / cloud language — keep as is.",
              "⚠️ confirm/alternative: blocking API but a documented released replacement exists.",
              "❌ on-prem only: no cloud equivalent — re-architect (CDS/RAP/Fiori, released file/HTTP APIs).",
              "ATC CLOUD_READINESS on the target system is the authoritative check; the matrix only triages.",
            ],
            examples: [
              {
                title: "A ⚠️ item: TVARVC-backed config",
                variant: "before",
                lang: "ABAP",
                body: "Works on-prem, but a direct SELECT on TVARVC is not released on cloud.",
                code: "select low from tvarvc where name = 'Z_BATCH_SIZE' into @lv.",
              },
              {
                title: "Its released replacement",
                variant: "after",
                lang: "ABAP",
                body: "Model the config as a released CDS/custom entity; keep the accessor API shape.",
                code: "select value from zce_config where key = 'Z_BATCH_SIZE' into @lv.   \" released entity",
              },
            ],
            pitfalls: [
              "Don't treat the static matrix as final — release states change; ATC on the target system is authoritative.",
              "A ❌ item isn't a quick swap — it usually means a different architecture, not a one-line change.",
            ],
            simplified: {
              oneLiner:
                "Sort each statement into cloud-safe (✅), has-a-released-replacement (⚠️), or no-cloud-equivalent (❌) — then confirm with ATC.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question: "What does the ⚠️ bucket mean?",
                options: {
                  A: "It is fully cloud-safe with no changes.",
                  B: "It has a blocking API but a documented released replacement.",
                  C: "It has no cloud equivalent at all.",
                  D: "It is forbidden even on-premise.",
                },
                correct: "B",
                explanations: {
                  A: "That's the ✅ bucket.",
                  B: "Correct — ⚠️ means confirm/replace with a released alternative.",
                  C: "That's the ❌ bucket.",
                  D: "⚠️ items work on-premise fine.",
                },
                principle: "⚠️ = blocked-but-replaceable with a released alternative.",
              },
              {
                n: 2,
                question:
                  "What is the authoritative way to confirm cloud-readiness?",
                options: {
                  A: "The static matrix in the repo.",
                  B: "A code review checklist.",
                  C: "ATC with the CLOUD_READINESS variant on the target system.",
                  D: "abaplint offline.",
                },
                correct: "C",
                explanations: {
                  A: "The matrix is best-effort triage, not authoritative.",
                  B: "A checklist helps but isn't authoritative.",
                  C: "Correct — only ATC on the target resolves SAP's released-API classification.",
                  D: "abaplint can't resolve released-API state offline.",
                },
                principle: "Triage with the matrix; confirm with ATC CLOUD_READINESS.",
              },
              {
                n: 3,
                question:
                  "A ❌ (no cloud equivalent) item typically requires…",
                options: {
                  A: "A one-line statement swap.",
                  B: "An ATC exemption.",
                  C: "Nothing — it works on cloud anyway.",
                  D: "A different architecture (e.g. CDS/RAP/Fiori or released file/HTTP APIs).",
                },
                correct: "D",
                explanations: {
                  A: "❌ is rarely a one-liner.",
                  B: "An exemption doesn't make Dynpro run on cloud.",
                  C: "❌ means it does not run on cloud.",
                  D: "Correct — ❌ items need re-architecting, not a swap.",
                },
                principle: "❌ items mean re-architecture, not a quick fix.",
              },
            ],
          },
        },
        {
          id: "m6-c2",
          code: "6.2",
          title: "Reading the matrix: released replacements per object",
          bloom: "An",
          lesson: {
            status: "ready",
            notesRef: "docs/clean-core-readiness.md",
            paragraphs: [
              "Each ⚠️/❌ row names the exact blocking API and the released replacement to use on cloud. JSON via /UI2/CL_JSON → xco_cp_json or ajson. Email via cl_bcs → cl_bcs_mail. Number ranges via NUMBER_GET_NEXT → cl_numberrange_runtime=>number_get( ). ALV (cl_salv_table full-screen) and OPEN DATASET are ❌ — go CDS+RAP+Fiori, or exchange files via OData/HTTP / released file APIs.",
              "The point of the per-object view is module-by-module migration: each utility names its cloud replacement, so you can move one folder at a time rather than rewriting everything at once.",
            ],
            keyPoints: [
              "JSON: /UI2/CL_JSON → xco_cp_json / ajson (⚠️).",
              "Email: cl_bcs → cl_bcs_mail (⚠️). Number range: NUMBER_GET_NEXT → cl_numberrange_runtime (⚠️).",
              "ALV full-screen & OPEN DATASET → CDS+RAP+Fiori / released file/HTTP APIs (❌).",
              "Migrate module by module, guided by each object's named replacement.",
            ],
            examples: [
              {
                title: "❌ OPEN DATASET file handling",
                variant: "before",
                lang: "ABAP",
                body: "Application-server file I/O has no cloud equivalent.",
                code: "open dataset lv_path for input in text mode encoding utf-8.",
              },
              {
                title: "Released file exchange on cloud",
                variant: "after",
                lang: "ABAP",
                body: "Exchange files via OData/HTTP or released file APIs instead of the file system.",
                code: "data(lo_http) = cl_http_destination_provider=>create_by_url( iv_url ).\n\" stream the payload via the released HTTP client",
              },
            ],
            pitfalls: [
              "Some ⚠️ replacements change behaviour subtly (e.g. JSON casing) — test the swap, don't assume parity.",
              "Cloud-safe modules in this repo depend only on ZCX_AU_ERROR, so you can cherry-pick the ✅ set without dragging in ❌ ones.",
            ],
            simplified: {
              oneLiner:
                "Each matrix row names the blocker and its released replacement — migrate one module at a time.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "The released replacement for /UI2/CL_JSON on cloud is…",
                options: {
                  A: "xco_cp_json (or ajson).",
                  B: "cl_salv_table.",
                  C: "OPEN DATASET.",
                  D: "cl_gui_alv_grid.",
                },
                correct: "A",
                explanations: {
                  A: "Correct — xco_cp_json / ajson are the released JSON options.",
                  B: "SALV is ALV output.",
                  C: "OPEN DATASET is itself ❌.",
                  D: "That's the on-prem ALV grid.",
                },
                principle: "Know the named released replacement per object.",
              },
              {
                n: 2,
                question:
                  "cl_salv_table full-screen ALV is in which bucket, and what's the direction?",
                options: {
                  A: "✅ cloud-safe — keep it.",
                  B: "⚠️ — just confirm the release state.",
                  C: "Not in the matrix at all.",
                  D: "❌ on-prem only — go CDS + RAP + Fiori.",
                },
                correct: "D",
                explanations: {
                  A: "Full-screen ALV is not cloud-safe.",
                  B: "It isn't a confirm-and-keep; it's a re-architecture.",
                  C: "It is in the matrix, under ❌.",
                  D: "Correct — full-screen ALV is ❌; the cloud direction is CDS+RAP+Fiori.",
                },
                principle: "Full-screen ALV → Fiori via CDS/RAP.",
              },
              {
                n: 3,
                question:
                  "Why can you cherry-pick only the ✅ cloud-safe modules from the repo?",
                options: {
                  A: "Because abapGit can't pull subfolders.",
                  B: "Because every cloud-safe module depends only on ZCX_AU_ERROR (also cloud-safe).",
                  C: "Because the ❌ modules are encrypted.",
                  D: "You can't — it's all-or-nothing.",
                },
                correct: "B",
                explanations: {
                  A: "abapGit pulls the repo; the point is dependency isolation.",
                  B: "Correct — minimal coupling (only ZCX_AU_ERROR) lets you take the ✅ set alone.",
                  C: "Nothing is encrypted.",
                  D: "It's explicitly designed to be cherry-pickable.",
                },
                principle: "Low coupling lets you adopt the cloud-safe set incrementally.",
              },
            ],
          },
        },
      ],
      /* The module check IS the self-audit: classify each statement/API
         into its readiness bucket (or name its released replacement). */
      sectionTest: {
        passPct: 0.7,
        questions: [
          {
            n: 1,
            question:
              "Self-audit — `cl_abap_context_info=>get_system_date( )` belongs in which bucket?",
            options: {
              A: "❌ on-premise only.",
              B: "⚠️ confirm / has alternative.",
              C: "✅ cloud-safe.",
              D: "Not classifiable.",
            },
            correct: "C",
            principle: "The released context API is cloud-safe.",
          },
          {
            n: 2,
            question: "Self-audit — `OPEN DATASET` belongs in…",
            options: {
              A: "❌ on-premise only (no cloud equivalent).",
              B: "✅ cloud-safe.",
              C: "⚠️ confirm / has alternative.",
              D: "It's released on cloud.",
            },
            correct: "A",
            principle: "OPEN DATASET is ❌ — exchange files via OData/HTTP / released file APIs.",
          },
          {
            n: 3,
            question:
              "Self-audit — a direct `SELECT` on TVARVC for config belongs in…",
            options: {
              A: "✅ cloud-safe.",
              B: "❌ on-premise only.",
              C: "Not in the matrix.",
              D: "⚠️ confirm / has alternative (model config as a released entity).",
            },
            correct: "D",
            principle: "TVARVC SELECT is ⚠️ — replace with a released config entity.",
          },
          {
            n: 4,
            question: "Self-audit — `cl_salv_table` full-screen ALV belongs in…",
            options: {
              A: "⚠️ confirm / has alternative.",
              B: "❌ on-premise only (→ CDS + RAP + Fiori).",
              C: "✅ cloud-safe.",
              D: "It depends on the table.",
            },
            correct: "B",
            principle: "Full-screen ALV is ❌ — Fiori via CDS/RAP is the direction.",
          },
          {
            n: 5,
            question:
              "Self-audit — JSON via `/UI2/CL_JSON`: bucket + replacement?",
            options: {
              A: "✅ cloud-safe; keep it.",
              B: "❌; no replacement.",
              C: "⚠️; replace with xco_cp_json or ajson.",
              D: "⚠️; replace with cl_bcs_mail.",
            },
            correct: "C",
            principle: "/UI2/CL_JSON is ⚠️ — use xco_cp_json / ajson.",
          },
          {
            n: 6,
            question:
              "Self-audit — `cl_system_uuid` (GUID generation) belongs in…",
            options: {
              A: "✅ cloud-safe.",
              B: "⚠️ confirm / has alternative.",
              C: "❌ on-premise only.",
              D: "Not in the matrix.",
            },
            correct: "A",
            principle: "cl_system_uuid is cloud-safe (the GUID module's released basis).",
          },
          {
            n: 7,
            question:
              "Self-audit — what is the authoritative confirmation for any of these classifications?",
            options: {
              A: "This quiz.",
              B: "ATC with the CLOUD_READINESS variant on the target system.",
              C: "abaplint offline.",
              D: "The developer's memory.",
            },
            correct: "B",
            principle: "ATC CLOUD_READINESS on the target system is authoritative.",
          },
          {
            n: 8,
            question:
              "Self-audit — number ranges via `NUMBER_GET_NEXT`: bucket + replacement?",
            options: {
              A: "✅; keep it.",
              B: "❌; no cloud path.",
              C: "⚠️; replace with cl_salv_table.",
              D: "⚠️; replace with cl_numberrange_runtime=>number_get( ).",
            },
            correct: "D",
            principle: "NUMBER_GET_NEXT is ⚠️ — use cl_numberrange_runtime.",
          },
        ],
      },
    },
  ],

  /* ============================================================
     Clean Core readiness self-audit (item #2).
     Questionnaire -> score -> prioritized remediation list.
     Source: docs/clean-core-readiness.md + the cookbooks.
     ============================================================ */
  readinessAudit: {
    title: "Clean Core readiness self-audit",
    intro:
      "Answer honestly about your custom ABAP. Each risky practice is weighted by how hard it blocks Clean Core; the result is a readiness score plus a remediation list sorted worst-first, each linked to the module that fixes it. This is a triage — the authoritative check is ATC with the CLOUD_READINESS variant on your target system.",
    bands: [
      {
        min: 0,
        max: 39,
        verdict: "Far from Clean Core",
        message:
          "Significant remediation ahead. Start at the top of the list — the highest-weighted findings (direct table writes, modifications) block cloud adoption hardest.",
      },
      {
        min: 40,
        max: 69,
        verdict: "On the way",
        message:
          "The structure is moving but core risks remain. Work the prioritized list module by module rather than all at once.",
      },
      {
        min: 70,
        max: 89,
        verdict: "Mostly Clean Core",
        message:
          "A few risks left. Close them, pin the package language version to ABAP for Cloud Development, and gate new findings in ATC.",
      },
      {
        min: 90,
        max: 100,
        verdict: "Clean Core ready",
        message:
          "Strong posture. Confirm with ATC CLOUD_READINESS / S4HANA_READINESS on your target system and keep the gate green.",
      },
    ],
    questions: [
      {
        id: "a-writes",
        dimension: "Data writes",
        question:
          "Does your code write directly to SAP standard tables (UPDATE / MODIFY / INSERT / DELETE on an SAP table)?",
        detail: "Direct writes bypass application logic and break on data-model changes.",
        weight: 5,
        riskAnswer: "yes",
        remediation:
          "Route every write through the released API / BAPI for the business object, or RAP EML (MODIFY ENTITIES ... COMMIT ENTITIES).",
        moduleId: "m2-clean-core-atc",
      },
      {
        id: "a-modify",
        dimension: "Modifications",
        question:
          "Do you modify SAP standard objects or rely on implicit enhancements?",
        weight: 5,
        riskAnswer: "yes",
        remediation:
          "Replace modifications with released BAdIs / extension points or the A–D extensibility model; request an extension point from SAP if none exists.",
        moduleId: "m2-clean-core-atc",
      },
      {
        id: "a-reads",
        dimension: "Data reads",
        question:
          "Do you SELECT from physical SAP tables (MARA, VBAK, BSID, …) rather than released CDS interface views (I_*)?",
        weight: 3,
        riskAnswer: "yes",
        remediation:
          "Read from the released I_* CDS interface view — the stable contract over the same data.",
        moduleId: "m2-clean-core-atc",
      },
      {
        id: "a-bdc",
        dimension: "Integration",
        question:
          "Do you automate transactions with BDC / CALL TRANSACTION (batch input)?",
        detail: "Batch input replays the UI and is not available on ABAP Cloud.",
        weight: 4,
        riskAnswer: "yes",
        remediation:
          "Call the business logic directly: released BAPI/API → RAP EML → OData. Isolate any unavoidable legacy call behind one released wrapper.",
        moduleId: "m3-bdc-to-api",
      },
      {
        id: "a-ui",
        dimension: "UI",
        question:
          "Are your apps built on SAP GUI (Dynpro, full-screen ALV, module pools)?",
        weight: 3,
        riskAnswer: "yes",
        remediation:
          "Expose data as CDS → RAP → OData and build Fiori Elements UIs (List Report / Object Page) with no UI code.",
        moduleId: "m5-fiori",
      },
      {
        id: "a-sqlinj",
        dimension: "Security",
        question:
          "Do you build dynamic WHERE / ORDER BY by concatenating user input into the statement?",
        weight: 4,
        riskAnswer: "yes",
        remediation:
          "Use host variables for values; validate genuinely-dynamic identifiers against an allow-list via CL_ABAP_DYN_PRG (ZCL_AU_DYN_SQL).",
        moduleId: "m1-anti-patterns",
      },
      {
        id: "a-perf",
        dimension: "Performance",
        question:
          "Do hot paths contain SELECT * or SELECTs inside loops (N+1 reads)?",
        weight: 3,
        riskAnswer: "yes",
        remediation:
          "Project the columns you need, filter at the source, and replace nested reads with one set-based read (or a CDS join).",
        moduleId: "m1-anti-patterns",
      },
      {
        id: "a-syfields",
        dimension: "System fields",
        question:
          "Do you read restricted system fields directly (sy-uname, sy-datum, sy-mandt)?",
        weight: 2,
        riskAnswer: "yes",
        remediation:
          "Use the released context API (cl_abap_context_info); inject a clock abstraction where the date drives testable logic.",
        moduleId: "m2-clean-core-atc",
      },
      {
        id: "a-config",
        dimension: "Configuration",
        question:
          "Are org values and thresholds hardcoded as literals in the code (company codes, batch sizes, plant ranges)?",
        weight: 2,
        riskAnswer: "yes",
        remediation:
          "Externalize to config (a released entity / config app) read through an accessor; use feature flags to deploy dark.",
        moduleId: "m1-anti-patterns",
      },
      {
        id: "a-langversion",
        dimension: "Tooling",
        question:
          "Is the package's ABAP language version set to 'ABAP for Cloud Development' on new objects?",
        detail: "Pinning it makes Clean-Core violations fail at compile time, not just in ATC.",
        weight: 3,
        riskAnswer: "no",
        remediation:
          "Pin new packages to ABAP for Cloud Development so only released APIs compile.",
        moduleId: "m2-clean-core-atc",
      },
      {
        id: "a-atc",
        dimension: "Tooling",
        question:
          "Do you run ATC with the CLOUD_READINESS / S4HANA_READINESS variants regularly?",
        weight: 4,
        riskAnswer: "no",
        remediation:
          "Run ATC centrally (Cloud ATC on BTP) with the Clean Core variants; treat Prio 1/2 findings as build-breakers and baseline the rest.",
        moduleId: "m6-readiness-audit",
      },
    ],
  },
};
