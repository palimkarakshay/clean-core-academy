/* ------------------------------------------------------------------
   Module 10 — The Gotchas Catalog.

   Source brief: §10 of the Clean Core & HANA Readiness curriculum.
   Audience: every developer tier — these are the silent traps that
   compile clean, pass a casual review, and bite at runtime (or after
   the next FPS). Each concept collects a family of mini-gotchas;
   the lesson explains the WHY and mechanism for a senior ABAP reader,
   and the 3-question quiz drills the 2–3 sharpest of them. Code-bearing
   concepts add before/after ABAP examples (lowercase, real syntax).
------------------------------------------------------------------ */

import type { Section } from "../_types";

export const m10Gotchas: Section = {
  id: "m10-gotchas",
  n: 10,
  title: "The Gotchas Catalog",
  sourceCourse: "clean-core-curriculum §10",
  audiences: ["new", "intermediate", "expert"],
  skills: [
    {
      id: "m10-s1",
      label: "Guard Open SQL against empty-driver FAE, undefined SELECT SINGLE rows, and silent de-duplication",
      conceptId: "m10-c1",
    },
    {
      id: "m10-s2",
      label: "Choose ASSIGNING vs INTO and avoid undefined BINARY SEARCH / unstable SORT in internal tables",
      conceptId: "m10-c2",
    },
    {
      id: "m10-s3",
      label: "Avoid RAP traps: dead ETags, IN LOCAL MODE auth, dropped UPDATE FIELDS, late-numbering order",
      conceptId: "m10-c3",
    },
    {
      id: "m10-s4",
      label: "Read CDS cardinality, #CHECK/DCL coupling and @Consumption layering as declarations, not guarantees",
      conceptId: "m10-c4",
    },
    {
      id: "m10-s5",
      label: "Write AMDP/ABAP Cloud that survives: READ-ONLY, full USING, SQLScript types, drifting ATC variant",
      conceptId: "m10-c5",
    },
    {
      id: "m10-s6",
      label: "Transport DCL roles, BDEFs and draft tables together so the target system isn't half-wired",
      conceptId: "m10-c6",
    },
  ],
  blurb:
    "The silent traps — code that compiles clean, passes a casual review, and then bites at runtime or after the next FPS. Open SQL, internal tables, RAP, CDS, AMDP / ABAP Cloud, and transport topology gotchas, each with the mechanism behind it.",
  concepts: [
    {
      id: "m10-c1",
      code: "10.1",
      title: "Open SQL gotchas",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §10.1",
        paragraphs: [
          "If you have ever lost a night to one of these bugs, you already understand it better than any catalog can teach — this module just names what your scars taught you, so the next developer doesn't pay the same tuition. The two Open SQL traps that cause production incidents are both about *absence*. A SELECT SINGLE without a fully-qualified primary key returns *an* arbitrary row — on HANA the row the optimizer happens to find first, which differs from the AnyDB era and differs run to run. And FOR ALL ENTRIES over an *empty* driver table does not return zero rows; it strips the IN-list condition entirely and returns the *whole* target table. The fix is a one-line guard: `if lines( itab ) > 0`.",
          "FOR ALL ENTRIES has a second silent behaviour: it de-duplicates the driver before building the read, so it can never give you 1:1 cardinality. If you needed one result row per driver row you have already lost rows before the database is touched — you must use a JOIN instead. These behaviours predate HANA but bite harder now because result-set sizes and row order changed under columnar storage.",
          "The rest of the family is about cost you cannot see in the syntax. INTO CORRESPONDING FIELDS OF TABLE is slower than a named field list and obscures the real types (a field that silently doesn't map is a defect, not an error). ORDER BY PRIMARY KEY is not free on HANA — there is no implicit sort, so only ask for ordering you actually consume. And SELECT DISTINCT carries a real de-duplication cost that, for input that is already mostly unique, can be dearer than reading into a SORTED table.",
        ],
        keyPoints: [
          "SELECT SINGLE without the full key returns an undefined row — fully qualify the key or add ORDER BY.",
          "FOR ALL ENTRIES on an empty driver returns ALL rows — always guard with `if lines( itab ) > 0`.",
          "FOR ALL ENTRIES silently de-duplicates the driver; it can never deliver 1:1 cardinality — use a JOIN.",
          "INTO CORRESPONDING is slow and hides type mismatches; ORDER BY PRIMARY KEY and DISTINCT are not free.",
        ],
        examples: [
          {
            title: "Unguarded FOR ALL ENTRIES",
            variant: "before",
            lang: "ABAP",
            body: "If lt_orders is ever empty, this reads every row of zorder_item — the driver condition disappears entirely.",
            code: [
              "select * from zorder_item",
              "  for all entries in @lt_orders",
              "  where order_id = @lt_orders-order_id",
              "  into table @data(lt_items).",
            ].join("\n"),
          },
          {
            title: "Guarded read",
            variant: "after",
            lang: "ABAP",
            body: "The guard short-circuits the empty-driver case; for true 1:1 cardinality, reach for a JOIN instead of FAE.",
            code: [
              "if lines( lt_orders ) > 0.",
              "  select order_id, item_no, line_total",
              "    from zorder_item",
              "    for all entries in @lt_orders",
              "    where order_id = @lt_orders-order_id",
              "    into table @data(lt_items).",
              "endif.",
            ].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "FOR ALL ENTRIES on an empty table returns EVERYTHING, and SELECT SINGLE without the full key returns a random row — guard the driver and qualify the key.",
          analogy:
            "An empty 'only these IDs' filter isn't 'show nothing' — it's 'show everything', like an empty search box returning the whole catalog.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "A FOR ALL ENTRIES SELECT runs with an empty driver table. What comes back?",
            options: {
              A: "All rows of the target table — the driver condition is dropped.",
              B: "Zero rows, because the driver is empty.",
              C: "A runtime exception.",
              D: "A short dump.",
            },
            correct: "A",
            explanations: {
              A: "Correct — with an empty driver the IN-list condition disappears and the full table is read; guard with `if lines( itab ) > 0`.",
              B: "This is the intuitive expectation but the wrong one — empty driver means no filter, not no rows.",
              C: "No exception is raised; the read silently widens.",
              D: "There is no dump — that is what makes it dangerous.",
            },
            principle:
              "An empty FOR ALL ENTRIES driver removes the filter and returns all rows — always guard it.",
          },
          {
            n: 2,
            question:
              "Why can FOR ALL ENTRIES never guarantee one result row per driver row?",
            options: {
              A: "Because it sorts the driver and drops the order.",
              B: "Because HANA ignores the WHERE clause.",
              C: "Because it silently de-duplicates the driver table before building the read.",
              D: "Because it always adds DISTINCT to the target.",
            },
            correct: "C",
            explanations: {
              A: "Sorting is not the issue; lost cardinality is caused by de-duplication.",
              B: "The WHERE clause is honoured; the driver itself is de-duplicated.",
              C: "Correct — FAE de-duplicates the driver, so 1:1 cardinality is lost before the DB is touched; use a JOIN if you need it.",
              D: "DISTINCT is not added to the target; the de-duplication is on the driver.",
            },
            principle:
              "FOR ALL ENTRIES de-duplicates the driver — for 1:1 cardinality use a JOIN.",
          },
          {
            n: 3,
            question:
              "On HANA, what is true of `SELECT SINGLE field FROM t` with no WHERE on the full primary key?",
            options: {
              A: "It is rejected at compile time.",
              B: "It returns an arbitrary, undefined row that can differ run to run.",
              C: "It always returns the row with the lowest key.",
              D: "It returns every matching row.",
            },
            correct: "B",
            explanations: {
              A: "It compiles fine — that is the trap.",
              B: "Correct — without the full key 'the single row' is undefined; on HANA it is whatever the optimizer finds first and is not stable.",
              C: "There is no implicit lowest-key guarantee; add ORDER BY if you need determinism.",
              D: "SELECT SINGLE returns at most one row, not all matches.",
            },
            principle:
              "SELECT SINGLE without a full key is non-deterministic on HANA — qualify the key or order explicitly.",
          },
        ],
      },
    },
    {
      id: "m10-c2",
      code: "10.2",
      title: "Internal-table gotchas",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §10.2",
        paragraphs: [
          "The sharpest internal-table trap is silent and never dumps: READ TABLE ... BINARY SEARCH on a table that is *not* sorted ascending by the search key gives an *undefined* result — usually 'not found' on a row that is present. There is no runtime error, so the bug surfaces as missing data far from its cause. BINARY SEARCH is a promise you make to the runtime about the table's order; if you cannot keep it, use a SORTED or HASHED table whose order the kernel maintains for you.",
          "The access-mode choice is about copies. LOOP AT itab INTO ls copies each row into the work area; LOOP AT itab ASSIGNING FIELD-SYMBOL(<fs>) binds the field symbol to the row in place with no copy, which is faster and lets you mutate the row directly. Because <fs> *is* the row, a MODIFY itab INDEX sy-tabix FROM <fs> inside that loop is pure redundancy — the assignment to <fs> already changed the table.",
          "The remaining gotchas are about cost and stability. DELETE itab WHERE is an O(n) scan even on a SORTED table when the WHERE does not align with the sort key. INSERT INTO TABLE on a HASHED table is O(1) on average but the bucket array grows by reallocation — declare INITIAL SIZE when the row count is roughly known. And SORT is *unstable* by default: rows equal on the sort key may be reordered. If a prior order must be preserved among equal keys, you must write SORT itab STABLE BY f.",
        ],
        keyPoints: [
          "BINARY SEARCH on an unsorted table = undefined result, NO dump — only use it on ascending-sorted data.",
          "LOOP ... INTO copies the row; LOOP ... ASSIGNING <fs> binds it in place (faster, mutable).",
          "MODIFY ... INDEX inside a field-symbol loop is redundant — assigning to <fs> already mutated the row.",
          "SORT is unstable unless you add STABLE; HASHED inserts benefit from INITIAL SIZE; DELETE ... WHERE is O(n).",
        ],
        examples: [
          {
            title: "BINARY SEARCH on an unsorted table",
            variant: "before",
            lang: "ABAP",
            body: "lt_data was never sorted by id; the binary search may report sy-subrc 4 for a row that exists — silently, no dump.",
            code: [
              "read table lt_data into data(ls)",
              "  with key id = lv_id binary search.",
            ].join("\n"),
          },
          {
            title: "Field-symbol loop, no redundant MODIFY",
            variant: "after",
            lang: "ABAP",
            body: "Sort first (or use a SORTED table), and mutate via the field symbol — the row is updated in place with no MODIFY.",
            code: [
              "sort lt_data stable by id.",
              "loop at lt_data assigning field-symbol(<row>).",
              "  <row>-status = 'DONE'.",
              'endloop. " <- the assignment above already updated the table',
            ].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "BINARY SEARCH on an unsorted table silently returns garbage with no dump — and a field symbol already edits the row, so MODIFY ... INDEX is redundant.",
          analogy:
            "Binary search on an unsorted list is like looking up a word in a dictionary whose pages were shuffled — you confidently land on the wrong page.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "What happens when READ TABLE ... BINARY SEARCH runs against a standard table that was never sorted by the search key?",
            options: {
              A: "A runtime dump (CX_SY_ITAB_ERROR).",
              B: "The result is undefined and there is no runtime error.",
              C: "It silently falls back to a linear search.",
              D: "It re-sorts the table first.",
            },
            correct: "B",
            explanations: {
              A: "There is no dump — which is precisely why this trap is so dangerous.",
              B: "Correct — BINARY SEARCH assumes ascending order by the key; without it the result is undefined and silent.",
              C: "There is no automatic fallback to linear search.",
              D: "BINARY SEARCH never sorts the table for you.",
            },
            principle:
              "BINARY SEARCH requires an ascending-sorted table; otherwise the result is undefined and silent.",
          },
          {
            n: 2,
            question:
              "Inside `LOOP AT itab ASSIGNING FIELD-SYMBOL(<fs>)`, you set `<fs>-status = 'X'`. What about a following `MODIFY itab INDEX sy-tabix FROM <fs>`?",
            options: {
              A: "It is required to persist the change.",
              B: "It is redundant — assigning to <fs> already mutated the row in place.",
              C: "It corrupts the table.",
              D: "It converts the loop to INTO mode.",
            },
            correct: "B",
            explanations: {
              A: "No write-back is needed; <fs> points at the actual table row.",
              B: "Correct — the field symbol IS the row, so the assignment already changed the table; the MODIFY is dead code.",
              C: "It does not corrupt anything; it is merely wasted work.",
              D: "It has no effect on the loop's access mode.",
            },
            principle:
              "A field symbol binds the row in place — mutating <fs> needs no MODIFY.",
          },
          {
            n: 3,
            question:
              "Two rows are equal on the sort key. Which statement preserves their prior relative order?",
            options: {
              A: "SORT itab BY f.",
              B: "SORT itab DESCENDING BY f.",
              C: "SORT itab STABLE BY f.",
              D: "SORT itab AS TEXT BY f.",
            },
            correct: "C",
            explanations: {
              A: "Plain SORT is unstable; equal-key rows may be reordered.",
              B: "DESCENDING only changes direction, not stability.",
              C: "Correct — STABLE guarantees that rows equal on the key keep their original relative order.",
              D: "AS TEXT changes collation, not stability.",
            },
            principle:
              "SORT is unstable by default — add STABLE to preserve order among equal keys.",
          },
        ],
      },
      exercise: {
        id: "m10-c2-ex",
        lang: "ABAP",
        prompt:
          "A copy-paste slip left two branches with the same condition, so the second branch is dead code that never runs — abaplint's identical_conditions rule flags it. Fix the duplicated condition so each branch is reachable, then re-check until it's clean.",
        flaggedRules: ["identical_conditions"],
        hint: "The second ELSEIF repeats `iv_score >= 90`; it was meant to be a lower threshold such as `iv_score >= 80`.",
        successNote:
          "Identical branch conditions are a classic silent gotcha — the code compiles and the dead branch quietly never fires. The linter catches what a glance misses.",
        starterCode: [
          "class zcl_au_ex_dup definition public final create public.",
          "  public section.",
          "    class-methods grade",
          "      importing !iv_score type i",
          "      returning value(rv_grade) type string.",
          "endclass.",
          "",
          "class zcl_au_ex_dup implementation.",
          "  method grade.",
          "    if iv_score >= 90.",
          "      rv_grade = 'A'.",
          "    elseif iv_score >= 90.",
          "      rv_grade = 'B'.",
          "    endif.",
          "  endmethod.",
          "endclass.",
        ].join("\n"),
      },
    },
    {
      id: "m10-c3",
      code: "10.3",
      title: "RAP gotchas",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §10.3",
        paragraphs: [
          "The RAP trap that quietly destroys data integrity is a mis-wired ETag. Optimistic locking compares the ETag the client read against the current value on save; if they differ, the save is rejected. But if you bind the ETag to a field that never changes, the comparison always passes and concurrent edits silently overwrite each other — locking is effectively disabled with no error anywhere. The correct pattern is an ETag master on a LocalLastChangedAt field that a determination updates on every save, so the token genuinely moves.",
          "Two more traps come from the LOCAL MODE keyword. READ/MODIFY ENTITIES ... IN LOCAL MODE deliberately skips DCL authorization — which is correct *inside* the behaviour pool where you have already passed the entry-point check, but a defect if you hand that result to a UI or external consumer without re-checking. And MODIFY ENTITIES ... UPDATE FIELDS ( ... ) updates *only* the fields you list: forget one in the parenthesised list and that field is silently left unchanged, with no error. The FIELDS list is an allow-list, not a hint.",
          "The last is ordering with late numbering. ADJUST_NUMBERS assigns the real key once per save, *after* the determination phase. So a DETERMINE ON SAVE that runs before numbering cannot read the final key — it sees the temporary one. If downstream logic depends on the assigned number, it must run in or after the numbering step, not before it.",
        ],
        keyPoints: [
          "An ETag on a non-changing field silently disables optimistic locking — use a LocalLastChangedAt updated by a determination.",
          "READ/MODIFY ENTITIES IN LOCAL MODE skips DCL — fine inside the BO, a leak if surfaced without re-checking auth.",
          "UPDATE FIELDS ( ... ) is an allow-list — a field you forget to list is silently not updated, no error.",
          "Late numbering (ADJUST_NUMBERS) runs after determinations — you cannot read the assigned key before it.",
        ],
        examples: [
          {
            title: "Dead ETag",
            variant: "before",
            lang: "ABAP",
            body: "OrderId never changes, so the ETag comparison always matches — concurrent saves silently clobber each other.",
            code: [
              "managed implementation in class zbp_i_order unique;",
              "define behavior for zi_order alias order",
              "persistent table zorder_hdr",
              "etag master order_id { }",
            ].join("\n"),
          },
          {
            title: "Live ETag on a moving timestamp",
            variant: "after",
            lang: "ABAP",
            body: "A determination updates local_last_changed_at on every save, so the ETag actually moves and stale writes are rejected.",
            code: [
              "managed implementation in class zbp_i_order unique;",
              "define behavior for zi_order alias order",
              "persistent table zorder_hdr",
              "etag master local_last_changed_at { }",
            ].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "An ETag pinned to a field that never changes silently switches off optimistic locking — anchor it to a LocalLastChangedAt that a determination bumps.",
          analogy:
            "A version stamp that never increments is like a tamper seal that is already broken — it can never tell you the box was opened.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "A RAP behavior declares `etag master` on a field that never changes. What is the effect?",
            options: {
              A: "Activation fails.",
              B: "Every save dumps.",
              C: "Optimistic locking is silently disabled — concurrent edits overwrite each other.",
              D: "The entity becomes read-only.",
            },
            correct: "C",
            explanations: {
              A: "It activates without complaint — there is no static check for a 'dead' ETag field.",
              B: "Saves succeed; that is the problem — they succeed even when they should conflict.",
              C: "Correct — an unchanging ETag always compares equal, so the conflict check never fires; use a determination-updated LocalLastChangedAt.",
              D: "Nothing turns read-only; writes proceed unchecked.",
            },
            principle:
              "An ETag must track a field that actually changes — a static field disables optimistic locking silently.",
          },
          {
            n: 2,
            question:
              "What does READ ENTITIES ... IN LOCAL MODE do with respect to authorization?",
            options: {
              A: "It skips the DCL check.",
              B: "It runs the DCL check twice.",
              C: "It enforces a stricter DCL check.",
              D: "It requires an explicit AUTHORITY-CHECK.",
            },
            correct: "A",
            explanations: {
              A: "Correct — IN LOCAL MODE bypasses DCL; appropriate inside the BO, but never surface the result externally without re-checking auth.",
              B: "It does not double-check; it skips the check.",
              C: "It relaxes, not tightens, the check.",
              D: "It needs no AUTHORITY-CHECK; it simply omits DCL.",
            },
            principle:
              "IN LOCAL MODE bypasses DCL — safe inside the BO, a leak if exposed unchecked.",
          },
          {
            n: 3,
            question:
              "In `MODIFY ENTITIES ... UPDATE FIELDS ( total )`, the developer also changed `currency` but left it out of the list. What happens to currency?",
            options: {
              A: "It is updated anyway.",
              B: "It is silently not updated — FIELDS is an allow-list.",
              C: "The whole MODIFY is rejected with an error.",
              D: "It is reset to its initial value.",
            },
            correct: "B",
            explanations: {
              A: "Only listed fields are written; an unlisted field is ignored.",
              B: "Correct — UPDATE FIELDS lists exactly which fields to write; an omitted field is silently skipped with no error.",
              C: "There is no error; the statement runs and just ignores the missing field.",
              D: "It is left at its existing value, not reset.",
            },
            principle:
              "UPDATE FIELDS ( ... ) writes only the listed fields — omissions are silently ignored.",
          },
        ],
      },
    },
    {
      id: "m10-c4",
      code: "10.4",
      title: "CDS gotchas",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §10.4",
        paragraphs: [
          "The most expensive CDS misconception is treating cardinality as a constraint. Writing an association as [1..1] is a *declaration* to the optimizer about expected fan-out, not an enforced rule. If the real data has more than one matching row, the activator says nothing, the join silently fans out, and you get duplicated or wrong aggregates. Cardinality drives pushdown — a [0..1] or [1..1] target can be folded into the parent read, while a wrong cardinality both misleads the optimizer and corrupts results, undetectably at activation time.",
          "The authorization trap mirrors the RAP one. @AccessControl.authorizationCheck: #CHECK declares 'this view is access-controlled' — but the DCL role that actually grants the rows is a *separate* object. With #CHECK and no matching DCL the view activates cleanly, then throws at runtime on the first access because the framework looks for a role that isn't there. Either ship the DCL or use #NOT_REQUIRED deliberately for views that are not end-user-facing.",
          "The third is layering. @Consumption.* annotations (value helps, filters, semantic hints) take effect only in the projection / consumption layer; placed on an interface (I_*) view they are simply ignored, so the value help you 'added' never appears. And path-expression pushdown across associations only happens when the cardinality permits it — check the EXPLAIN plan rather than assuming the database resolved the path for you.",
        ],
        keyPoints: [
          "Cardinality [1..1] is a declaration to the optimizer, NOT an enforced constraint — wrong cardinality corrupts joins silently.",
          "@AccessControl.authorizationCheck: #CHECK without a matching DCL activates fine, then fails at runtime on first access.",
          "@Consumption.* annotations only take effect in projection/consumption views; on interface views they are ignored.",
          "Path-expression pushdown depends on cardinality — verify with EXPLAIN rather than assuming.",
        ],
        examples: [
          {
            title: "#CHECK without a DCL",
            variant: "before",
            lang: "ABAP",
            body: "This activates cleanly; the first SELECT at runtime fails because no DCL role grants the rows.",
            code: [
              "@accesscontrol.authorizationcheck: #check",
              "define view entity zi_order",
              "  as select from zorder_hdr { key order_id, total }",
            ].join("\n"),
          },
          {
            title: "Declare the matching DCL role",
            variant: "after",
            lang: "ABAP",
            body: "A role grants select on the view; now #CHECK has something to enforce and runtime access succeeds.",
            code: [
              "define role zi_order_dcl {",
              "  grant select on zi_order",
              "    where ( company_code ) = aspect pfcg_auth( s_tcode, bukrs, actvt = '03' );",
              "}",
            ].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "CDS cardinality is a hint to the optimizer, not a rule it enforces — and #CHECK with no DCL activates fine but dies at runtime.",
          analogy:
            "Declaring [1..1] is like labelling a box 'contains one item' — the label changes nobody's behaviour if you actually stuffed three inside.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "An association is declared [1..1] but the data actually has several matching rows. What does the activator do?",
            options: {
              A: "It rejects activation until the data is fixed.",
              B: "It enforces uniqueness at runtime.",
              C: "Nothing — cardinality is a declaration, so the join silently fans out and results can be wrong.",
              D: "It rewrites the association to [0..*].",
            },
            correct: "C",
            explanations: {
              A: "The activator does not validate data against cardinality.",
              B: "Cardinality is not enforced at runtime; it informs the optimizer.",
              C: "Correct — [1..1] is a declaration, not a constraint; wrong cardinality fans out the join and corrupts aggregates with no error.",
              D: "It does not auto-correct the cardinality.",
            },
            principle:
              "CDS cardinality is a declaration for the optimizer, not an enforced constraint.",
          },
          {
            n: 2,
            question:
              "A view has `@AccessControl.authorizationCheck: #CHECK` but no DCL role exists for it. When does this fail?",
            options: {
              A: "At activation.",
              B: "At runtime, on the first access.",
              C: "Never — #CHECK supplies its own default role.",
              D: "Only when consumed from RAP.",
            },
            correct: "B",
            explanations: {
              A: "Activation succeeds — the missing role is not a static error.",
              B: "Correct — #CHECK declares the view as access-controlled, so the first runtime access looks for a DCL role and errors when none exists.",
              C: "#CHECK does not provide a default role; you must author one.",
              D: "It fails on any access path, not only RAP.",
            },
            principle:
              "#CHECK needs a matching DCL role or it fails at first runtime access, not at activation.",
          },
          {
            n: 3,
            question:
              "Where do `@Consumption.*` annotations actually take effect?",
            options: {
              A: "Only in projection / consumption views; they are ignored on interface views.",
              B: "On any CDS view, including interface views.",
              C: "Only in the DCL role.",
              D: "Only at the database layer.",
            },
            correct: "A",
            explanations: {
              A: "Correct — @Consumption.* annotations are honoured in the projection/consumption layer and silently ignored on interface (I_*) views.",
              B: "Placing them on an interface view has no effect.",
              C: "DCL governs authorization, not consumption annotations.",
              D: "They are an ABAP/CDS layer concern, not a raw DB feature.",
            },
            principle:
              "@Consumption.* annotations only apply in the projection/consumption layer.",
          },
        ],
      },
    },
    {
      id: "m10-c5",
      code: "10.5",
      title: "AMDP & ABAP Cloud gotchas",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §10.5",
        paragraphs: [
          "Two AMDP traps cause runtime failures rather than wrong answers. The USING clause must list *every* DB object the SQLScript body references; the dependency analyzer uses it to build the procedure's read/write set. Miss one and activation still succeeds — then the first execution fails because the runtime cannot resolve the unlisted object. And the parameters you pass in are *SQLScript* types, not ABAP types: an ABAP packed amount or a long decimal can lose precision crossing the boundary, so reason about the SQLScript type, not the ABAP declaration.",
          "OPTIONS READ-ONLY is a scale-out concern. On a read-only AMDP it tells HANA the procedure performs no DML, which lets the platform route it to a reader node in a scale-out landscape. Omit it on a genuinely read-only procedure and you forfeit that routing — the work is pinned to the writer, degrading throughput under load even though the result is correct.",
          "On the ABAP Cloud side, the gotcha is *time*. The ABAP_CLOUD_DEVELOPMENT_DEFAULT ATC variant gains checks with each release: a pipeline that is green today can turn red after an FPS, not because your code changed but because the rules tightened — so re-run ATC after every upgrade. And for emitting messages, IF_T100_MESSAGE is the released text approach; the classic MESSAGE i001(zx) form is permitted in Standard ABAP but forbidden in Cloud development.",
        ],
        keyPoints: [
          "USING must list ALL referenced DB objects — a missing entry activates fine but fails at first execution.",
          "AMDP parameters are SQLScript types, not ABAP types — implicit conversions can lose precision.",
          "Forgetting OPTIONS READ-ONLY on a read-only AMDP forfeits reader-node routing in scale-out.",
          "ABAP_CLOUD_DEVELOPMENT_DEFAULT gains checks each release (green today, red after an FPS); IF_T100_MESSAGE is the released text approach.",
        ],
        examples: [
          {
            title: "Incomplete USING",
            variant: "before",
            lang: "ABAP",
            body: "The body also reads zorder_item, but only zorder_hdr is listed — this activates yet dumps on first execution.",
            code: [
              "method get by database function for hdb",
              "  language sqlscript options read-only",
              "  using zorder_hdr.",
              '  " ... body also selects from zorder_item',
            ].join("\n"),
          },
          {
            title: "Complete USING, read-only",
            variant: "after",
            lang: "ABAP",
            body: "Every referenced object is listed and READ-ONLY is set, so dependencies resolve and the platform can route to a reader.",
            code: [
              "method get by database function for hdb",
              "  language sqlscript options read-only",
              "  using zorder_hdr zorder_item.",
            ].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "An AMDP whose USING omits a referenced table activates fine but dumps at first run, and missing OPTIONS READ-ONLY costs you reader-node routing.",
          analogy:
            "USING is the packing list for a shipment — if a parcel isn't on the list, customs (the runtime) stops the whole truck on arrival.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "An AMDP method's SQLScript reads two tables but its USING clause lists only one. What happens?",
            options: {
              A: "Activation fails immediately.",
              B: "It activates, then fails at the first execution.",
              C: "It silently reads only the listed table.",
              D: "ATC auto-completes the USING list.",
            },
            correct: "B",
            explanations: {
              A: "Activation succeeds — the missing dependency is not caught statically.",
              B: "Correct — USING must list every referenced DB object; omit one and the runtime cannot resolve it, failing at first execution.",
              C: "It does not quietly drop the read; it errors when it hits the unlisted object.",
              D: "ATC does not rewrite your USING clause for you.",
            },
            principle:
              "USING must list all referenced DB objects or the AMDP fails at first execution.",
          },
          {
            n: 2,
            question:
              "Why add OPTIONS READ-ONLY to an AMDP that performs no DML?",
            options: {
              A: "It encrypts the result set.",
              B: "It marks the method immutable in version control.",
              C: "It tells HANA there is no DML, enabling routing to a reader node in scale-out.",
              D: "It enables implicit client handling.",
            },
            correct: "C",
            explanations: {
              A: "It has nothing to do with encryption.",
              B: "It is a runtime hint, not a source-control attribute.",
              C: "Correct — declaring the procedure read-only lets the platform route it to reader nodes; omitting it pins work to the writer and hurts scale-out.",
              D: "Client handling is separate; READ-ONLY does not inject MANDT.",
            },
            principle:
              "OPTIONS READ-ONLY enables reader-node routing for no-DML AMDPs.",
          },
          {
            n: 3,
            question:
              "Your ABAP Cloud pipeline was green last month and is red today with no code changes. Most likely cause?",
            options: {
              A: "The ABAP_CLOUD_DEVELOPMENT_DEFAULT variant gained checks in the new release.",
              B: "The code was secretly edited.",
              C: "ATC was uninstalled.",
              D: "The package reverted to Standard ABAP.",
            },
            correct: "A",
            explanations: {
              A: "Correct — the cloud ATC variant tightens each release, so unchanged code can newly fail after an FPS; re-run ATC after every upgrade.",
              B: "No edit is implied; the rules changed, not the code.",
              C: "ATC being absent would not produce new findings — it would produce none.",
              D: "A language-version revert is not the default explanation; a tightened variant is.",
            },
            principle:
              "The cloud ATC variant gains checks each release — re-run ATC after every FPS.",
          },
        ],
      },
    },
    {
      id: "m10-c6",
      code: "10.6",
      title: "Transport & topology gotchas",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §10.6",
        paragraphs: [
          "Transport gotchas share one shape: a model is split across several objects, and moving only the obvious one leaves the target system half-wired. A CDS view's DCL role is a *separate* transportable object — transport the view without the role (or in a different request that arrives later) and the target view either fails its #CHECK at runtime or grants nothing, because the access logic never travelled with it. Keep the view and its DCL in the same transport.",
          "The behaviour-pool case is the same trap from the runtime side. The behaviour definition (BDEF) and its implementing pool are distinct objects; ship a pool change without the matching BDEF and the target system reports 'outdated' warnings because the runtime behaviour no longer matches the definition it was generated against. The pair must move together to stay consistent.",
          "OData V4 service bindings hide a structural dependency. A draft-enabled binding carries a *draft node* backed by its own draft persistence tables. Export the binding without those draft tables and the service half-works: the active part responds, but anything touching the draft — edit-draft, resume, discard — fails on the target because the persistence behind the draft node is missing.",
        ],
        keyPoints: [
          "A CDS view's DCL role is a separate object — it isn't auto-transported unless it's in the same transport as the view.",
          "A behavior-pool change without its BDEF produces 'outdated' warnings on the target — move the pair together.",
          "OData V4 service bindings carry a draft node — exporting without the draft tables leaves a half-working service.",
          "The common shape: a model split across objects; transport all of it or the target is half-wired.",
        ],
        examples: [
          {
            title: "View moves, DCL stays behind",
            variant: "neutral",
            body: "Transport TR-A carries zi_order with #CHECK; the role zi_order_dcl is left in an unreleased TR-B. On the target, the view activates but the first access fails — the access logic never arrived.",
          },
          {
            title: "Keep coupled objects together",
            variant: "neutral",
            body: "Bundle the CDS view + its DCL role, the BDEF + its behaviour pool, and the service binding + its draft tables each into one transport so the target is fully wired.",
          },
        ],
        simplified: {
          oneLiner:
            "Coupled objects — view+DCL, BDEF+pool, binding+draft tables — must travel in the same transport, or the target system is left half-wired.",
          analogy:
            "Shipping a lock without its key: the door arrives installed, but nobody on the other end can actually open it.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "You transport a CDS view with #CHECK but its DCL role is in a different, not-yet-imported request. What is the result on the target?",
            options: {
              A: "Nothing breaks — the role is auto-derived.",
              B: "The view fails at runtime because the access logic didn't travel with it.",
              C: "The view refuses to activate.",
              D: "The role is copied automatically from the source system.",
            },
            correct: "B",
            explanations: {
              A: "DCL roles are not auto-derived; they are separate transportable objects.",
              B: "Correct — a DCL role isn't auto-transported with its view; without it the #CHECK view fails (or grants nothing) at runtime on the target.",
              C: "The view itself activates; it is access at runtime that fails.",
              D: "Transports do not silently pull objects across systems on their own.",
            },
            principle:
              "Transport a CDS view and its DCL role together, or the target loses its access logic.",
          },
          {
            n: 2,
            question:
              "A behavior pool is changed and transported, but the matching BDEF is not. What does the target system report?",
            options: {
              A: "Nothing.",
              B: "A short dump on activation.",
              C: "'Outdated' warnings — the runtime no longer matches the definition.",
              D: "The pool is automatically reverted.",
            },
            correct: "C",
            explanations: {
              A: "There is a visible symptom — the runtime and definition diverge.",
              B: "It surfaces as outdated warnings, not necessarily a dump.",
              C: "Correct — the pool and BDEF are distinct objects; moving the pool alone leaves the runtime inconsistent with its definition, raising 'outdated' warnings.",
              D: "Nothing reverts automatically; the inconsistency simply persists.",
            },
            principle:
              "A behavior pool and its BDEF must be transported together to stay consistent.",
          },
          {
            n: 3,
            question:
              "An OData V4 service binding is exported without its draft persistence tables. What is the outcome on the target?",
            options: {
              A: "The whole service is dead.",
              B: "A half-working service — active reads work, draft operations fail.",
              C: "The draft tables are regenerated automatically.",
              D: "The binding cannot be activated at all.",
            },
            correct: "B",
            explanations: {
              A: "The active part still responds; only the draft-backed operations break.",
              B: "Correct — a V4 binding carries a draft node; without its draft tables, edit/resume/discard fail while active access works — a half-wired service.",
              C: "Draft tables are not auto-regenerated on import.",
              D: "The binding activates; it is the draft operations that fail.",
            },
            principle:
              "Export an OData V4 binding together with its draft tables, or draft operations break on the target.",
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
          "FOR ALL ENTRIES runs with an empty driver table. What is returned?",
        options: {
          A: "All rows of the target table.",
          B: "Zero rows.",
          C: "An exception.",
          D: "A short dump.",
        },
        correct: "A",
        explanations: {
          A: "Correct — an empty driver drops the filter and returns everything; guard with `if lines( itab ) > 0`.",
          B: "That is the intuitive but wrong expectation.",
          C: "No exception is raised.",
          D: "No dump occurs.",
        },
        principle: "An empty FOR ALL ENTRIES driver returns all rows.",
      },
      {
        n: 2,
        question:
          "READ TABLE ... BINARY SEARCH on a table not sorted by the search key gives…",
        options: {
          A: "a guaranteed dump.",
          B: "a linear-search fallback.",
          C: "the correct row regardless of order.",
          D: "an undefined result with no runtime error.",
        },
        correct: "D",
        explanations: {
          A: "There is no dump — that is what hides the bug.",
          B: "There is no automatic fallback.",
          C: "Correctness requires ascending order by the key.",
          D: "Correct — BINARY SEARCH assumes ascending order; without it the result is undefined and silent.",
        },
        principle: "BINARY SEARCH demands ascending-sorted data or the result is undefined.",
      },
      {
        n: 3,
        question:
          "A RAP `etag master` is bound to a field that never changes. What is the effect?",
        options: {
          A: "Optimistic locking is silently disabled.",
          B: "Activation fails.",
          C: "The entity becomes read-only.",
          D: "Every save dumps.",
        },
        correct: "A",
        explanations: {
          A: "Correct — an unchanging ETag always matches, so the conflict check never fires; concurrent edits overwrite each other.",
          B: "It activates without complaint.",
          C: "Nothing becomes read-only.",
          D: "Saves succeed, which is the danger.",
        },
        principle: "An ETag on a static field disables optimistic locking silently.",
      },
      {
        n: 4,
        question:
          "`@AccessControl.authorizationCheck: #CHECK` with no matching DCL role fails…",
        options: {
          A: "at activation.",
          B: "never — a default role is supplied.",
          C: "at runtime, on first access.",
          D: "only when consumed from a projection view.",
        },
        correct: "C",
        explanations: {
          A: "Activation succeeds.",
          B: "No default DCL role is supplied.",
          C: "Correct — #CHECK declares the view access-controlled, so the first runtime access errors when no role exists.",
          D: "It fails on any access path.",
        },
        principle: "#CHECK requires a matching DCL or it fails at first runtime access.",
      },
      {
        n: 5,
        question:
          "An AMDP's USING clause omits one of the DB objects its SQLScript reads. What happens?",
        options: {
          A: "Activation fails immediately.",
          B: "It activates but fails at first execution.",
          C: "It silently skips the unlisted table.",
          D: "ATC auto-completes the list.",
        },
        correct: "B",
        explanations: {
          A: "Activation succeeds — the gap is not caught statically.",
          B: "Correct — USING must list every referenced object; a missing one cannot be resolved at runtime and fails on first execution.",
          C: "It errors rather than quietly skipping.",
          D: "ATC does not rewrite USING for you.",
        },
        principle: "USING must list every referenced DB object or the AMDP fails at first run.",
      },
      {
        n: 6,
        question:
          "Why must a CDS view and its DCL role travel in the same transport?",
        options: {
          A: "To compress the transport.",
          B: "Because the DCL role isn't auto-transported, so the target loses its access logic otherwise.",
          C: "Because views cannot activate without a transport.",
          D: "To enable draft handling.",
        },
        correct: "B",
        explanations: {
          A: "Transport size is irrelevant here.",
          B: "Correct — a DCL role is a separate object that isn't pulled automatically; split them and the target view loses (or fails) its access check.",
          C: "Views activate independently of where their role sits.",
          D: "Draft handling is a RAP/binding concern, not DCL transport.",
        },
        principle: "Bundle a CDS view with its DCL role so access logic isn't left behind.",
      },
    ],
  },
};
