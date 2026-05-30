/* ------------------------------------------------------------------
   Module 6 — CDS, AMDP & Code Pushdown.

   Source brief: §6 of the Clean Core & HANA Readiness curriculum.
   Audience: intermediate builders and expert architects (T2).
   Code-pushdown is where Clean Core meets HANA performance: prefer the
   most declarative layer that can express the logic. Every concept
   ships paragraphs + keyPoints + simplified.oneLiner and a 3-question
   quiz with per-option explanations; code-bearing concepts add
   before/after (or neutral) examples in lowercase ABAP / SQLScript
   against S/4HANA 2023 (SAP_BASIS 758).
------------------------------------------------------------------ */

import type { Section } from "../_types";

export const m06CdsAmdp: Section = {
  id: "m06-cds-amdp",
  n: 6,
  title: "CDS, AMDP & Code Pushdown",
  sourceCourse: "clean-core-curriculum §6",
  audiences: ["intermediate", "expert"],
  skills: [
    {
      id: "m06-s1",
      label: "Rank read-heavy logic on the pushdown ladder and pick the most declarative layer that fits",
      conceptId: "m06-c1",
    },
    {
      id: "m06-s2",
      label: "Write a CDS view entity with aggregation, associations and a group by that covers every non-aggregated field",
      conceptId: "m06-c2",
    },
    {
      id: "m06-s3",
      label: "Implement a CDS table function over an AMDP read method with explicit client handling and window functions",
      conceptId: "m06-c3",
    },
    {
      id: "m06-s4",
      label: "Write an AMDP write procedure with a complete USING list, explicit client filter and correct READ-ONLY use",
      conceptId: "m06-c4",
    },
    {
      id: "m06-s5",
      label: "Move authorization into the model with a DCL role and wire it to @AccessControl.authorizationCheck",
      conceptId: "m06-c5",
    },
  ],
  blurb:
    "Get reports and heavy calculations to run far faster by letting the database do the work. This is where Clean Core meets HANA performance using CDS (SAP's modern data-modeling layer) and AMDP (database procedures written in ABAP): the pushdown ladder, CDS patterns that compress code, CDS table functions over AMDP, AMDP write paths, and CDS access control via DCL. Push logic down to the database in the most declarative form that can express it.",
  concepts: [
    {
      id: "m06-c1",
      code: "6.1",
      title: "The pushdown ladder",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §6.1",
        paragraphs: [
          "Code pushdown means doing set-oriented work where the data lives — on HANA — instead of dragging rows up into the ABAP application server to loop over them. The discipline is to choose the *most declarative* layer that can still express the requirement, because the more declarative the layer, the more the HANA optimizer can rewrite, parallelize and reuse plans for it.",
          "For read-heavy logic the preference order is a ladder: a CDS view first; then a CDS table function backed by AMDP when CDS alone cannot express it; then a bare AMDP procedure when you must call imperatively and CDS will not do; then Open SQL with joins or FOR ALL ENTRIES for transactional flow; and only as a last resort, loops in ABAP over selected data. Each rung down trades optimizer freedom and reusability for raw expressiveness.",
          "The reason a senior ABAP developer should internalize the order rather than reaching straight for AMDP is reuse and maintainability: a CDS view is consumable from Open SQL, RAP, analytics and OData, carries annotations and DCL, and survives upgrades as a released contract. An AMDP method is opaque SQLScript that only the database understands, harder to test and analyze. Climb down the ladder only when the rung above genuinely cannot express the logic.",
        ],
        keyPoints: [
          "Ladder: CDS view → CDS table function + AMDP → AMDP procedure → Open SQL (joins/FAE) → ABAP loops.",
          "The most declarative layer that fits wins — it gives the optimizer the most freedom.",
          "CDS views are reusable, annotatable and upgrade-stable; AMDP is opaque SQLScript.",
          "Drop a rung only when the layer above cannot express the requirement.",
          "ABAP loops over fetched rows are the last resort, not the default.",
        ],
        examples: [
          {
            title: "Reading the ladder",
            variant: "neutral",
            body: "Aggregate open orders per customer → CDS view. Rank rows with a window function CDS can't express → CDS table function + AMDP. Bulk set-based close → AMDP procedure. A simple header+text join in a transaction → Open SQL join. Stitching two unrelated result sets row-by-row → only then an ABAP loop.",
          },
        ],
        simplified: {
          oneLiner:
            "Push read logic down using the most declarative layer that can express it: CDS view first, AMDP later, ABAP loops last.",
          analogy:
            "Use the highest-level tool that does the job — a spreadsheet formula before a macro, a macro before hand-copying cells.",
        },
        deeper: {
          paragraphs: [
            "Reusability compounds: a CDS view written once is consumed by an OData service, an analytical query, a RAP behavior and a plain SELECT, and the optimizer can fold path expressions and projections away. An AMDP method gives you none of that — it is a black box at the SQLScript boundary, so put logic there only when the expressiveness is unavoidable.",
          ],
          keyPoints: [
            "A CDS view is consumable everywhere; an AMDP method is callable but not composable.",
            "Each rung down narrows optimizer rewrites and plan reuse.",
          ],
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "For read-heavy logic, which layer should you reach for first on the pushdown ladder?",
            options: {
              A: "A CDS view.",
              B: "An AMDP procedure.",
              C: "An ABAP loop over selected rows.",
              D: "A CDS table function backed by AMDP.",
            },
            correct: "A",
            explanations: {
              A: "Correct — the CDS view is the most declarative, most reusable, optimizer-friendly rung; try it first.",
              B: "An AMDP procedure is lower on the ladder; use it only when CDS cannot express the logic.",
              C: "ABAP loops are the last resort, not the first choice.",
              D: "A table function with AMDP sits below a plain CDS view; reach for it only when CDS alone falls short.",
            },
            principle:
              "Choose the most declarative layer that can express the requirement.",
          },
          {
            n: 2,
            question:
              "Why prefer a CDS view over an AMDP method when both could do the job?",
            options: {
              A: "AMDP runs on the application server, so it is always slower.",
              B: "CDS views cannot be consumed from Open SQL, so they avoid locks.",
              C: "A CDS view is reusable, annotatable and a released, upgrade-stable contract, while AMDP is opaque SQLScript.",
              D: "AMDP cannot read more than one table.",
            },
            correct: "C",
            explanations: {
              A: "AMDP executes on HANA, not the application server; the issue is composability, not raw location.",
              B: "CDS views are consumable from Open SQL — that is precisely a benefit, not a limitation.",
              C: "Correct — the CDS view is composable, carries annotations and DCL, and survives upgrades; AMDP is a black box to everything but the database.",
              D: "AMDP can reference many tables via USING; that is not the distinction.",
            },
            principle:
              "Declarative CDS maximizes reuse, optimizer freedom and upgrade stability.",
          },
          {
            n: 3,
            question:
              "You must rank rows with a window function that CDS alone cannot express. Which rung is appropriate?",
            options: {
              A: "Pull the rows into ABAP and sort them in a loop.",
              B: "A CDS table function backed by an AMDP method.",
              C: "A plain CDS view with a group by.",
              D: "Open SQL with FOR ALL ENTRIES.",
            },
            correct: "B",
            explanations: {
              A: "Looping in ABAP is the last resort and defeats pushdown entirely.",
              B: "Correct — a CDS table function over AMDP is the next rung down when CDS expressiveness runs out, e.g. window functions or recursive CTEs.",
              C: "A plain CDS view is the rung above, but by assumption it cannot express the window function.",
              D: "FOR ALL ENTRIES does not provide ranking; it is lower on the ladder and unrelated to the need.",
            },
            principle:
              "Step down only one rung — to a table function with AMDP — when CDS cannot express the logic.",
          },
        ],
      },
    },
    {
      id: "m06-c2",
      code: "6.2",
      title: "CDS patterns that compress code",
      bloom: "A",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §6.2",
        paragraphs: [
          "A surprising amount of classic ABAP — nested loops, COLLECT statements, manual subtotalling — collapses into a few lines of CDS. The three patterns that compress the most code are aggregation (count, sum, max, min, avg), associations (declared joins you navigate by name), and group by. Written as a `define view entity ... as select from ...`, the view is pushed to HANA and consumable everywhere.",
          "Aggregation replaces hand-rolled totalling: `count(*)`, `sum(h.total)`, `max(h.orderdate)` are computed on the database in a single scan. Associations replace repeated explicit joins: you declare `association [0..*] to zorder_item as _items on ...` once and expose or navigate it by name, and the join is materialized only when the association is actually used. Together they turn a screen of procedural code into a declarative contract.",
          "The rule that commonly trips up newcomers: when a view aggregates, the `group by` must list *every* non-aggregated field in the select list. Miss one and the view often activates but errors at runtime — the activator catches many cases, but not when an expression appears in the select. Treat it as a discipline: every plain field in the projection appears verbatim in the group by.",
        ],
        keyPoints: [
          "Aggregation (count/sum/max/min/avg), associations, and group by compress the most code.",
          "Associations are declared joins, navigated by name and materialized only when used.",
          "Every non-aggregated select field must appear in the group by.",
          "A missing group-by field may activate but error at runtime — expressions slip past the activator.",
          "Use `define view entity` (CDS view entity), not the legacy DDIC-based `define view`.",
        ],
        examples: [
          {
            title: "Hand-rolled totalling in ABAP",
            variant: "before",
            lang: "ABAP",
            body: "Classic: select all rows, then loop and collect per customer — rows travel to the app server just to be counted.",
            code: [
              "select customerid, total, orderdate",
              "  from zorder_hdr",
              "  where status = 'OPEN'",
              "  into table @data(lt_hdr).",
              "loop at lt_hdr assigning field-symbol(<h>).",
              "  ls_sum-customerid = <h>-customerid.",
              "  ls_sum-ordercount = 1.",
              "  ls_sum-totalopen  = <h>-total.",
              "  collect ls_sum into lt_sum.",
              "endloop.",
            ].join("\n"),
          },
          {
            title: "The same logic as a CDS view entity",
            variant: "after",
            lang: "ABAP",
            body: "Aggregation, an association and a group by covering every non-aggregated field; pushed to HANA, consumable from Open SQL, RAP, analytics and OData.",
            code: [
              "@AccessControl.authorizationCheck: #NOT_REQUIRED",
              "@EndUserText.label: 'Open Orders By Customer'",
              "define view entity ZI_OpenOrdersByCustomer",
              "  as select from zorder_hdr as h",
              "  association [0..*] to zorder_item as _items",
              "    on _items.OrderId = h.OrderId",
              "{",
              "  key h.CustomerId,",
              "      count(*)         as OrderCount,",
              "      sum(h.Total)     as TotalOpenAmount,",
              "      max(h.OrderDate) as LastOrderDate,",
              "      _items",
              "}",
              "where h.Status = 'OPEN'",
              "group by h.CustomerId",
            ].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "Aggregation, associations and group by turn loops-and-COLLECT into a few declarative lines — but the group by must list every non-aggregated field.",
          analogy:
            "It's a pivot table: you pick the grouping column and the totals, and the engine does the counting — but you must name every column you're not summing.",
        },
        deeper: {
          paragraphs: [
            "Associations are lazier than joins: declaring `_items` does not cost anything until a consumer selects or navigates it, so a view can expose many associations cheaply and each consumer pays only for what it touches. This is why association-rich interface views (`I_*`) are the backbone of the released CDS model.",
          ],
          keyPoints: [
            "An unused association is free; the join materializes only on navigation.",
            "Expressions in the select list are exactly where a forgotten group-by field escapes the activator and fails at runtime.",
          ],
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "A CDS view selects `customerid`, `count(*)` and `sum(total)`. What must its group by contain?",
            options: {
              A: "Nothing — count and sum imply the grouping automatically.",
              B: "Only the aggregated fields, count and sum.",
              C: "The primary key of the underlying table only.",
              D: "Every non-aggregated field in the select list, i.e. customerid.",
            },
            correct: "D",
            explanations: {
              A: "Aggregation does not infer the grouping; you must state it explicitly.",
              B: "Aggregated fields are exactly what you do not put in the group by.",
              C: "It is the non-aggregated select fields that matter, not the table's primary key.",
              D: "Correct — every plain (non-aggregated) field in the projection, here customerid, must appear in the group by.",
            },
            principle:
              "Group by must cover every non-aggregated field in the select list.",
          },
          {
            n: 2,
            question:
              "What is the danger of a CDS view that aggregates but omits a non-aggregated field from its group by?",
            options: {
              A: "It always fails to activate, so the mistake is caught immediately.",
              B: "It silently returns duplicated rows but never errors.",
              C: "It may activate yet error at runtime — the activator misses cases where an expression is in the select.",
              D: "It downgrades the view's release contract to C2.",
            },
            correct: "C",
            explanations: {
              A: "The activator catches many cases but not all, so it does not always fail at activation.",
              B: "The failure mode is a runtime error, not silent duplication.",
              C: "Correct — it often activates but errors at runtime, and expressions in the select slip past the activator.",
              D: "Release contracts are unrelated to group-by correctness.",
            },
            principle:
              "A forgotten group-by field can pass activation and blow up at runtime.",
          },
          {
            n: 3,
            question:
              "What is true of an association declared in a CDS view but never selected or navigated by a consumer?",
            options: {
              A: "It forces the join to execute on every read, slowing the view.",
              B: "It costs nothing — the join materializes only when the association is actually used.",
              C: "It is rejected by the activator as unused.",
              D: "It converts the view into a table function.",
            },
            correct: "B",
            explanations: {
              A: "An unused association does not execute its join; that is the point of lazy associations.",
              B: "Correct — associations are lazy: the join is materialized only on navigation or selection, so exposing many is cheap.",
              C: "Unused associations are perfectly valid and not rejected.",
              D: "Associations have nothing to do with table functions.",
            },
            principle:
              "Associations are lazy joins — you pay only for the ones you navigate.",
          },
        ],
      },
    },
    {
      id: "m06-c3",
      code: "6.3",
      title: "CDS table function + AMDP",
      bloom: "A",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §6.3",
        paragraphs: [
          "When CDS cannot express the logic — a recursive CTE, or a window function such as `row_number()` for ranking before CDS supported it — drop one rung to a CDS table function whose body is an AMDP method. The table function declares the returned structure and parameters in DDIC-like syntax; the AMDP method supplies the SQLScript that produces those rows. The function is then consumable from Open SQL and other CDS just like a view.",
          "The AMDP read method is implemented `by database function for hdb language sqlscript options read-only using ...`. `options read-only` tells HANA the method does not write, which lets it route and optimize the call on scale-out systems; the `using` clause must name every database object the SQLScript touches so the dependency analyzer wires activation correctly. The body returns a SELECT — here with `row_number() over ( partition by ... order by ... )` to rank rows per customer.",
          "The non-negotiable rule is client handling: AMDP has *no implicit MANDT injection* the way Open SQL does. You must filter `where mandt = :p_client` yourself, where `p_client` is a parameter annotated `@Environment.systemField: #CLIENT` so the framework fills it with the caller's client. Forget it and the method returns cross-client data — a defect ATC's AMDP checks catch, but only when those checks are enabled in your variant.",
        ],
        keyPoints: [
          "Use a table function + AMDP only when CDS can't express it (recursive CTE, window functions).",
          "AMDP read method: `by database function for hdb language sqlscript options read-only using ...`.",
          "`options read-only` enables routing/optimization; `using` must list every referenced object.",
          "No implicit client — you must filter `where mandt = :p_client` explicitly.",
          "Bind the client parameter with `@Environment.systemField: #CLIENT` so the framework fills it.",
        ],
        examples: [
          {
            title: "CDS table function declaration",
            variant: "neutral",
            lang: "ABAP",
            body: "Declares the returned columns and a client parameter bound to the system field; the body lives in an AMDP method.",
            code: [
              "@EndUserText.label: 'Order Ranking'",
              "define table function ZI_OrderRanking",
              "  with parameters",
              "    @Environment.systemField: #CLIENT",
              "    p_client : abap.clnt",
              "  returns {",
              "    client      : abap.clnt;",
              "    OrderId     : zorder_id;",
              "    CustomerId  : kunnr;",
              "    RankPerCust : abap.int4;",
              "  }",
              "  implemented by method zcl_order_ranking=>get;",
            ].join("\n"),
          },
          {
            title: "The AMDP read method with explicit client filter",
            variant: "neutral",
            lang: "ABAP",
            body: "read-only, every table listed in using, and a window function — with the mandatory where mandt = :p_client because AMDP has no implicit client.",
            code: [
              "class zcl_order_ranking definition public.",
              "  public section.",
              "    class-methods get for table function zi_orderranking.",
              "endclass.",
              "",
              "class zcl_order_ranking implementation.",
              "  method get by database function for hdb",
              "             language sqlscript",
              "             options read-only",
              "             using zorder_hdr.",
              "    return",
              "      select",
              "        mandt    as client,",
              "        order_id as \"OrderId\",",
              "        kunnr    as \"CustomerId\",",
              "        row_number() over ( partition by kunnr order by total desc )",
              "                 as \"RankPerCust\"",
              "      from zorder_hdr",
              "      where mandt = :p_client;",
              "  endmethod.",
              "endclass.",
            ].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "When CDS can't express it, a table function over a read-only AMDP method can — but you must filter the client yourself with where mandt = :p_client.",
          analogy:
            "It's a custom database function you write by hand: powerful, but no one auto-fills the client for you the way plain SELECT does.",
        },
        deeper: {
          paragraphs: [
            "The `@Environment.systemField: #CLIENT` parameter is the bridge: the framework fills `p_client` with the caller's client so your SQLScript can reference `:p_client`. Combined with `@ClientHandling.algorithm: #SESSION_VARIABLE`, the table function behaves like a client-aware artefact even though the AMDP body is raw SQLScript with no MANDT magic.",
          ],
          keyPoints: [
            "`@Environment.systemField: #CLIENT` injects the caller's client into the parameter.",
            "ATC's AMDP client checks fire only if enabled in your variant — do not rely on them as the sole guard.",
          ],
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Inside an AMDP read method backing a CDS table function, how is the client handled?",
            options: {
              A: "You must filter it explicitly, e.g. `where mandt = :p_client`.",
              B: "HANA injects MANDT implicitly, exactly like Open SQL.",
              C: "The client is irrelevant inside SQLScript.",
              D: "The `options read-only` clause adds the client filter for you.",
            },
            correct: "A",
            explanations: {
              A: "Correct — you must add `where mandt = :p_client` yourself; nothing fills it implicitly.",
              B: "AMDP has no implicit client injection — that is the key difference from Open SQL.",
              C: "Ignoring the client returns cross-client data, a real defect.",
              D: "`options read-only` concerns optimization/routing, not client filtering.",
            },
            principle:
              "AMDP has no implicit client — filter `where mandt = :p_client` explicitly.",
          },
          {
            n: 2,
            question:
              "When is a CDS table function backed by AMDP the right choice over a plain CDS view?",
            options: {
              A: "Whenever you want the result consumable from Open SQL.",
              B: "Whenever the view aggregates with a group by.",
              C: "When CDS alone cannot express it, e.g. a recursive CTE or a window function.",
              D: "Whenever you need an association to another entity.",
            },
            correct: "C",
            explanations: {
              A: "Plain CDS views are already consumable from Open SQL; that is no reason to drop a rung.",
              B: "Aggregation with group by is squarely a plain CDS view capability.",
              C: "Correct — step down to a table function over AMDP only when CDS expressiveness runs out, such as recursive CTEs or window functions.",
              D: "Associations are a plain CDS view feature, not a reason for a table function.",
            },
            principle:
              "Use a table function + AMDP only when CDS cannot express the logic.",
          },
          {
            n: 3,
            question:
              "What does `options read-only` on the AMDP method signal?",
            options: {
              A: "That the method may write but not read.",
              B: "That the method bypasses the client filter.",
              C: "That the USING clause can be omitted.",
              D: "That the method performs no writes, so HANA can route and optimize it on scale-out.",
            },
            correct: "D",
            explanations: {
              A: "It is the opposite — read-only means no writes occur.",
              B: "It has nothing to do with client filtering, which you still must do.",
              C: "USING must still list every referenced object regardless.",
              D: "Correct — declaring read-only lets HANA optimize replication routing and execution on scale-out systems.",
            },
            principle:
              "`options read-only` declares no writes so HANA can optimize routing.",
          },
        ],
      },
    },
    {
      id: "m06-c4",
      code: "6.4",
      title: "AMDP write paths",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §6.4",
        paragraphs: [
          "Sometimes you must write, not just read, on the database side. An AMDP procedure implemented `by database procedure for hdb language sqlscript using ...` can execute DML — UPDATE, INSERT, DELETE — in SQLScript. This is the rare, careful case: use set-based DML only when it genuinely beats an ABAP loop, for example closing tens of thousands of stale orders in one statement instead of one round trip per row.",
          "Two rules keep an AMDP write method safe and analyzable. First, the `using` clause must list *all* referenced database objects — every table the SQLScript reads or writes — because the dependency analyzer relies on it; a missing entry activates fine but errors at first execution. Second, client handling is again explicit: filter `where mandt = :iv_client` yourself since there is no implicit MANDT. The example sets `status = 'CLOSED'` and a timestamp for open orders older than 90 days, then reads the affected count from `::rowcount`.",
          "Note what is and is not present: a write procedure uses `by database procedure` (not `by database function`), and it does *not* carry `options read-only` precisely because it writes. Reserve `options read-only` for read-only methods — putting it on a method that issues DML is contradictory and wrong. Keep these procedures small, well-bounded, and reach for them only when the set-based win is real.",
        ],
        keyPoints: [
          "AMDP write: `by database procedure for hdb language sqlscript using ...`.",
          "Use set-based DML only when it beats an ABAP loop (bulk closes, mass updates).",
          "List ALL referenced tables in USING — a missing one errors at first execution.",
          "Handle the client explicitly with `where mandt = :iv_client`; there is no implicit MANDT.",
          "`options read-only` is for read-only methods only — never on a procedure that writes.",
        ],
        examples: [
          {
            title: "Row-by-row close in ABAP",
            variant: "before",
            lang: "ABAP",
            body: "One database round trip per row — fine for a handful, ruinous for tens of thousands.",
            code: [
              "loop at lt_open assigning field-symbol(<o>).",
              "  update zorder_hdr",
              "     set status = 'CLOSED'",
              "   where mandt    = @sy-mandt",
              "     and order_id = @<o>-order_id.",
              "endloop.",
            ].join("\n"),
          },
          {
            title: "Set-based bulk close as an AMDP procedure",
            variant: "after",
            lang: "ABAP",
            body: "One statement closes every qualifying row; using lists the table, the client is filtered explicitly, no read-only because it writes, and ::rowcount returns the count.",
            code: [
              "class zcl_bulk_close definition public.",
              "  public section.",
              "    methods run",
              "      importing iv_client type mandt",
              "      exporting ev_rows   type int4.",
              "endclass.",
              "",
              "class zcl_bulk_close implementation.",
              "  method run by database procedure for hdb",
              "            language sqlscript",
              "            using zorder_hdr.",
              "    update zorder_hdr",
              "       set status = 'CLOSED',",
              "           local_last_changed_at = current_utctimestamp",
              "     where mandt = :iv_client",
              "       and status = 'OPEN'",
              "       and order_date < add_days( current_date, -90 );",
              "    ev_rows = ::rowcount;",
              "  endmethod.",
              "endclass.",
            ].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "An AMDP procedure can do set-based DML on HANA — list every table in USING, filter the client yourself, and never put options read-only on a method that writes.",
          analogy:
            "It's a batch SQL script: one statement updates the whole set, but you have to declare every table it touches and scope it to the right client by hand.",
        },
        deeper: {
          paragraphs: [
            "The cost model matters: a set-based UPDATE is one optimized statement, while an ABAP loop is N statements with N round trips and N optimizer parses. But set-based DML also takes broader locks and is harder to debug, so the rule of thumb is to push down a write only when the row count is large enough that the round-trip and parse savings dominate the added lock contention.",
          ],
          keyPoints: [
            "Set-based DML trades N round trips for one statement but takes broader locks.",
            "A missing USING entry passes activation and fails only at first execution — easy to miss in review.",
          ],
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "What must the USING clause of an AMDP write procedure contain?",
            options: {
              A: "Only the tables it writes to, never the ones it reads.",
              B: "Nothing — the dependency analyzer discovers tables automatically.",
              C: "All referenced database objects; a missing one errors at first execution.",
              D: "Only the primary table, with others resolved at runtime.",
            },
            correct: "C",
            explanations: {
              A: "USING must list every referenced object, read or write, not only write targets.",
              B: "The analyzer relies on USING; it does not auto-discover objects.",
              C: "Correct — list all referenced objects; a missing entry activates fine but fails at first execution.",
              D: "Every referenced object must be listed, not just the primary table.",
            },
            principle:
              "USING must enumerate every referenced DB object or the method fails at runtime.",
          },
          {
            n: 2,
            question:
              "Which statement about `options read-only` and AMDP write procedures is correct?",
            options: {
              A: "Write procedures must declare `options read-only` to be safe.",
              B: "`options read-only` is for read-only methods only and must not appear on a procedure that writes.",
              C: "`options read-only` makes DML faster.",
              D: "`options read-only` is mandatory on every AMDP method.",
            },
            correct: "B",
            explanations: {
              A: "A write procedure that claims read-only is contradictory and wrong.",
              B: "Correct — reserve `options read-only` for methods that do not write; a DML procedure omits it.",
              C: "It does not accelerate DML; it signals the absence of writes for read routing.",
              D: "It is appropriate only on read-only methods, not universally.",
            },
            principle:
              "`options read-only` belongs only on methods that perform no writes.",
          },
          {
            n: 3,
            question:
              "When is pushing a write down into an AMDP procedure justified?",
            options: {
              A: "When the set-based DML genuinely beats a row-by-row ABAP loop, e.g. a mass update of many rows.",
              B: "Always — AMDP DML is faster than Open SQL in every case.",
              C: "Whenever you want implicit client handling.",
              D: "Whenever the table has fewer than ten rows.",
            },
            correct: "A",
            explanations: {
              A: "Correct — reach for set-based AMDP DML only when the row count makes the one-statement win dominate the added lock cost.",
              B: "It is not universally faster and takes broader locks; use it selectively.",
              C: "AMDP has no implicit client handling — you must filter the client yourself.",
              D: "For a handful of rows, a simple Open SQL statement is preferable; AMDP DML shines at scale.",
            },
            principle:
              "Push a write down only when set-based DML clearly beats an ABAP loop.",
          },
        ],
      },
    },
    {
      id: "m06-c5",
      code: "6.5",
      title: "CDS access control (DCL)",
      bloom: "U",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §6.5",
        paragraphs: [
          "In the Clean Core model, authorization moves *into* the data model. Instead of scattering AUTHORITY-CHECK statements through ABAP, you declare a Data Control Language (DCL) role — a separate object linked to a CDS view — that constrains which rows a user may read. The view becomes self-protecting: any consumer, whether Open SQL, OData or analytics, inherits the row-level filter automatically.",
          "A DCL role reads `define role ... { grant select on <view> where ( field ) = aspect pfcg_auth( ... ) }`. The `aspect pfcg_auth` clause maps a view field to a classic PFCG authorization object and its fields, so the user's existing authorizations decide which rows pass. For example, granting select where `( companycode ) = aspect pfcg_auth( s_tcode, bukrs, actvt = '03' )` lets a user read only the company codes their authorization permits, with activity 03 (display).",
          "The toggle that wires it together is the view annotation `@AccessControl.authorizationCheck`. Set to `#CHECK`, the view *requires* a matching DCL role — activation succeeds, but the first access errors at runtime if no role exists. Set to `#NOT_REQUIRED`, DCL is skipped entirely, which is appropriate for views you want readable from internal RAP queries that are not end-user-facing. Choosing the wrong value is a classic trap: `#CHECK` with no DCL compiles cleanly and fails only when someone reads the view.",
        ],
        keyPoints: [
          "DCL moves row-level authorization into the model, replacing scattered AUTHORITY-CHECK.",
          "Syntax: `define role ... { grant select on <view> where ( field ) = aspect pfcg_auth( ... ) }`.",
          "`aspect pfcg_auth` maps a CDS field to a PFCG auth object and its fields.",
          "`@AccessControl.authorizationCheck: #CHECK` requires a matching DCL role.",
          "`#NOT_REQUIRED` skips DCL — fine for internal, non-end-user-facing views.",
        ],
        examples: [
          {
            title: "A DCL role on an order view",
            variant: "neutral",
            lang: "ABAP",
            body: "Grants select only on the company codes the user's S_TCODE / BUKRS authorization permits, for display activity 03.",
            code: [
              "@EndUserText.label: 'Auth for Orders'",
              "@MappingRole: true",
              "define role ZI_OrderHeader_DCL {",
              "  grant select on ZI_OrderHeader",
              "    where ( CompanyCode ) = aspect pfcg_auth ( S_TCODE,",
              "                                               BUKRS,",
              "                                               ACTVT = '03' );",
              "}",
            ].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "A DCL role puts row-level authorization inside the CDS model; #CHECK on the view requires a matching role, #NOT_REQUIRED skips it.",
          analogy:
            "It's a bouncer attached to the view itself — #CHECK means there must be a guest list (the DCL role); #NOT_REQUIRED means the door is open.",
        },
        deeper: {
          paragraphs: [
            "Because the filter lives on the view, every downstream consumer is protected consistently — you cannot forget the check in one caller and apply it in another. The `aspect pfcg_auth` mapping reuses the customer's existing PFCG role design, so DCL is an additive layer over established authorizations rather than a parallel scheme to maintain.",
          ],
          keyPoints: [
            "Row-level protection on the view is inherited by all consumers uniformly.",
            "`#CHECK` with no matching DCL role activates but errors on first read — a silent setup gap.",
          ],
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "What does `@AccessControl.authorizationCheck: #CHECK` on a CDS view require?",
            options: {
              A: "A matching DCL role; without one, the first access errors at runtime.",
              B: "An AUTHORITY-CHECK statement inside every consuming program.",
              C: "Nothing — it is purely documentation.",
              D: "That the view be a table function.",
            },
            correct: "A",
            explanations: {
              A: "Correct — #CHECK demands a DCL role; activation succeeds but reading the view fails at runtime if none exists.",
              B: "DCL replaces scattered AUTHORITY-CHECK; the annotation does not require statements in consumers.",
              C: "It is enforced at runtime, not merely documentation.",
              D: "It applies to views generally and has nothing to do with table functions.",
            },
            principle:
              "#CHECK requires a matching DCL role or access fails at runtime.",
          },
          {
            n: 2,
            question:
              "When is `@AccessControl.authorizationCheck: #NOT_REQUIRED` appropriate?",
            options: {
              A: "For every end-user-facing view, to keep things simple.",
              B: "Only for views that write data.",
              C: "For internal views not exposed to end users, where DCL should be skipped.",
              D: "Never — every view must use #CHECK.",
            },
            correct: "C",
            explanations: {
              A: "End-user-facing views generally need row-level checks, so #NOT_REQUIRED is the wrong default there.",
              B: "CDS views do not write data; the annotation is about read authorization.",
              C: "Correct — #NOT_REQUIRED suits internal, non-end-user-facing views, e.g. those read from internal RAP queries.",
              D: "#NOT_REQUIRED is legitimate for internal views; it is not banned.",
            },
            principle:
              "#NOT_REQUIRED skips DCL — use it for internal, non-end-user-facing views.",
          },
          {
            n: 3,
            question:
              "In a DCL role, what does the `aspect pfcg_auth( ... )` clause do?",
            options: {
              A: "It disables all authorization for the view.",
              B: "It grants every user full access regardless of PFCG roles.",
              C: "It defines the view's primary key.",
              D: "It maps a CDS field to a classic PFCG authorization object and its fields, so the user's authorizations decide which rows pass.",
            },
            correct: "D",
            explanations: {
              A: "It enforces authorization; it does not disable it.",
              B: "It restricts by the user's authorizations; it does not grant blanket access.",
              C: "Primary keys are defined in the CDS view, not in the DCL role.",
              D: "Correct — it binds a view field to a PFCG auth object, reusing the user's existing authorizations for row-level filtering.",
            },
            principle:
              "`aspect pfcg_auth` ties row visibility to the user's PFCG authorizations.",
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
          "On the pushdown ladder for read-heavy logic, what is the most-preferred layer?",
        options: {
          A: "An ABAP loop over selected rows.",
          B: "An AMDP procedure.",
          C: "A CDS view.",
          D: "Open SQL with FOR ALL ENTRIES.",
        },
        correct: "C",
        explanations: {
          A: "ABAP loops are the last resort.",
          B: "AMDP procedures sit well below CDS views.",
          C: "Correct — the CDS view is the most declarative, reusable top rung.",
          D: "FOR ALL ENTRIES is lower than both CDS views and table functions.",
        },
        principle:
          "Prefer the most declarative layer: a CDS view first.",
      },
      {
        n: 2,
        question:
          "A CDS view selects a non-aggregated field alongside `sum(...)` but omits that field from the group by. What is the likely outcome?",
        options: {
          A: "It may activate but error at runtime.",
          B: "It is always rejected at activation.",
          C: "It silently returns correct totals.",
          D: "It is converted to a table function automatically.",
        },
        correct: "A",
        explanations: {
          A: "Correct — it often activates yet errors at runtime, especially when expressions are in the select.",
          B: "The activator does not catch every case, so it is not always rejected.",
          C: "The result is a runtime error, not silent correctness.",
          D: "There is no automatic conversion to a table function.",
        },
        principle:
          "Group by must cover every non-aggregated select field.",
      },
      {
        n: 3,
        question:
          "Inside an AMDP method, how must the client be handled?",
        options: {
          A: "It is injected implicitly like Open SQL.",
          B: "It is irrelevant in SQLScript.",
          C: "`options read-only` handles it.",
          D: "Explicitly, e.g. `where mandt = :p_client`.",
        },
        correct: "D",
        explanations: {
          A: "AMDP has no implicit client injection.",
          B: "Ignoring it returns cross-client data.",
          C: "`options read-only` is about routing, not the client.",
          D: "Correct — you must filter the client yourself.",
        },
        principle:
          "AMDP requires an explicit client filter; there is no implicit MANDT.",
      },
      {
        n: 4,
        question:
          "What must an AMDP procedure's USING clause contain, and what happens if an object is missing?",
        options: {
          A: "Only write targets; missing reads are ignored.",
          B: "All referenced DB objects; a missing one errors at first execution.",
          C: "Nothing; dependencies are auto-detected.",
          D: "Only the client parameter.",
        },
        correct: "B",
        explanations: {
          A: "Both reads and writes must be listed, not only write targets.",
          B: "Correct — USING must list every referenced object; a missing entry activates but fails at first execution.",
          C: "USING is not auto-detected; it drives the dependency analyzer.",
          D: "The client is a parameter, not a USING entry.",
        },
        principle:
          "USING must enumerate every referenced object or the method fails at runtime.",
      },
      {
        n: 5,
        question:
          "What does `@AccessControl.authorizationCheck: #CHECK` on a CDS view require?",
        options: {
          A: "A matching DCL role, or access fails at runtime.",
          B: "An AUTHORITY-CHECK in every consumer.",
          C: "That the view perform no aggregation.",
          D: "That the view be read-only.",
        },
        correct: "A",
        explanations: {
          A: "Correct — #CHECK requires a DCL role; without one the view errors on first read.",
          B: "DCL replaces scattered AUTHORITY-CHECK statements.",
          C: "Aggregation is unrelated to the authorization annotation.",
          D: "CDS views are read-only by nature; that is not what #CHECK governs.",
        },
        principle:
          "#CHECK demands a matching DCL role; #NOT_REQUIRED skips the check.",
      },
    ],
  },
};
