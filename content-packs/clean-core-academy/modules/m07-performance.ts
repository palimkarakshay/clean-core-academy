/* ------------------------------------------------------------------
   Module 7 — Performance & SQL on HANA.

   Source brief: §7 of the Clean Core & HANA Readiness curriculum.
   Audience: intermediate builders (T2) and admin / Basis-facing devs.
   The handful of rules, tools and patterns that fix most slow SQL on
   HANA, plus the pitfalls rarely written down. Every concept ships
   paragraphs + keyPoints + simplified.oneLiner and a 3-question quiz
   with per-option explanations; code-bearing concepts add before/after
   examples in lowercase ABAP against S/4HANA 2023 (SAP_BASIS 758).
------------------------------------------------------------------ */

import type { Section } from "../_types";

export const m07Performance: Section = {
  id: "m07-performance",
  n: 7,
  title: "Performance & SQL on HANA",
  sourceCourse: "clean-core-curriculum §7",
  audiences: ["intermediate", "admin"],
  skills: [
    {
      id: "m07-s1",
      label: "Apply the five rules that fix most slow SQL: push aggregation down, project narrowly, treat FAE with care, key internal tables, drop ENDSELECT",
      conceptId: "m07-c1",
    },
    {
      id: "m07-s2",
      label: "Pick the right diagnostic tool (ST05, SAT, SQLM, SWLT, DBACOCKPIT, PLANVIZ, SCMON, SCOV, SUSG) for a given symptom",
      conceptId: "m07-c2",
    },
    {
      id: "m07-s3",
      label: "Rewrite per-row SELECT SINGLE in a loop into a single projected INNER JOIN or CDS read",
      conceptId: "m07-c3",
    },
    {
      id: "m07-s4",
      label: "Reason about %_HINTS HDB, statement rewrites over hints, ABAP buffering modes and why FAE bypasses the buffer",
      conceptId: "m07-c4",
    },
    {
      id: "m07-s5",
      label: "Avoid the rarely-documented pitfalls: FOR UPDATE locks, counter serialization, dynamic Open SQL, and silently dropped duplicate keys",
      conceptId: "m07-c5",
    },
  ],
  blurb:
    "Find and fix the slow programs that frustrate users and tie up the system — most of it comes down to a handful of habits. Covers the five rules that fix 80% of slow database queries, the diagnostics toolkit, the declarative-projected-joined pattern that wins, hints and buffering, and the performance pitfalls rarely written down. How to make ABAP fast on HANA’s columnar, set-oriented database.",
  concepts: [
    {
      id: "m07-c1",
      code: "7.1",
      title: "Five rules that fix 80% of slow SQL",
      bloom: "A",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §7.1",
        paragraphs: [
          "Most slow ABAP on HANA is slow for one of five reasons, and the same five rules fix the bulk of it. First, push aggregation down: let the database count, sum and group in a single scan instead of pulling rows up to total them in a loop. Second, project narrowly: name the fields you need, never `SELECT *`, and never `INTO CORRESPONDING FIELDS` when you can name the columns — a narrow projection reads fewer columns from the column store and skips the field-mapping overhead.",
          "Third, FOR ALL ENTRIES is not free: it is rewritten into an IN-list or a UNION, it silently de-duplicates the driver table, and it returns *all* rows if the driver is empty. For fewer than about ten driver entries it is fine; for a large driver table a CDS join is far cheaper. Fourth, when you read an internal table by key inside a loop, declare it SORTED or HASHED so the read is logarithmic or constant — STANDARD plus BINARY SEARCH is legacy and fragile.",
          "Fifth, avoid ENDSELECT: a `SELECT ... ENDSELECT` loop holds a cursor open and round-trips row by row. Read straight `INTO TABLE`, or use an explicit PACKAGE SIZE cursor loop with a deliberate close when the result genuinely will not fit in memory. These five together address the overwhelming majority of performance findings a senior developer meets in custom code.",
        ],
        keyPoints: [
          "Push aggregation down — count/sum/group on the DB, not in an ABAP loop.",
          "Project narrowly — no SELECT *, no INTO CORRESPONDING when you can name fields.",
          "FOR ALL ENTRIES is not free: fine under ~10 entries, prefer a CDS join for big drivers.",
          "Read internal tables by key with SORTED/HASHED, not STANDARD + BINARY SEARCH.",
          "Avoid ENDSELECT — use INTO TABLE, or a PACKAGE SIZE cursor when truly needed.",
        ],
        examples: [
          {
            title: "Row-by-row counting with a wide read",
            variant: "before",
            lang: "ABAP",
            body: "SELECT * pulls every column, then ABAP loops to total — the database did almost none of the work.",
            code: [
              "select * from zorder_hdr",
              "  where status = 'OPEN'",
              "  into table @data(lt_hdr).",
              "loop at lt_hdr assigning field-symbol(<h>).",
              "  lv_total = lv_total + <h>-total.",
              "endloop.",
            ].join("\n"),
          },
          {
            title: "Narrow projection with aggregation pushed down",
            variant: "after",
            lang: "ABAP",
            body: "The database sums in one scan and returns a single column; nothing travels up just to be added.",
            code: [
              "select sum( total ) as total_open",
              "  from zorder_hdr",
              "  where status = 'OPEN'",
              "  into @data(lv_total).",
            ].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "Push aggregation down, project only the fields you need, treat FOR ALL ENTRIES with care, key your internal tables, and drop ENDSELECT.",
          analogy:
            "Don't haul the whole warehouse to your desk to count boxes — ask the warehouse for the count, and only the items you actually need.",
        },
        deeper: {
          paragraphs: [
            "Narrow projection matters more on HANA than on a row store: a columnar table reads only the columns you name, so `SELECT *` forces every column's dictionary to be touched even when you use three fields. FOR ALL ENTRIES deserves special caution because its two silent behaviours — de-duplicating the driver and returning everything on an empty driver — produce wrong results, not just slow ones.",
          ],
          keyPoints: [
            "On a column store, projecting narrowly avoids reading unused column dictionaries.",
            "Always guard FOR ALL ENTRIES with `if lines( driver ) > 0` to avoid the empty-driver full read.",
          ],
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "When is FOR ALL ENTRIES a reasonable choice versus a CDS join?",
            options: {
              A: "Always — it is the fastest read on HANA.",
              B: "Only when the driver table is empty.",
              C: "Never — it is forbidden in ABAP Cloud.",
              D: "For a small driver (under ~10 entries); for a large driver, prefer a CDS join.",
            },
            correct: "D",
            explanations: {
              A: "It is not universally fastest; it expands to IN-lists or UNIONs that scale poorly with the driver.",
              B: "An empty driver is exactly the dangerous case — FAE then returns all rows.",
              C: "FAE is permitted; the point is to use it judiciously, not avoid it entirely.",
              D: "Correct — FAE is fine for small drivers but a CDS join is far cheaper once the driver is large.",
            },
            principle:
              "FOR ALL ENTRIES suits small drivers; large drivers belong in a CDS join.",
          },
          {
            n: 2,
            question:
              "Why prefer a narrow field list over `SELECT *` on a HANA column store?",
            options: {
              A: "SELECT * is a syntax error on HANA.",
              B: "A narrow projection reads only the columns named, avoiding unused column dictionaries and field-mapping overhead.",
              C: "SELECT * disables the buffer permanently.",
              D: "It makes no difference on a column store.",
            },
            correct: "B",
            explanations: {
              A: "SELECT * is legal; it is simply wasteful.",
              B: "Correct — columnar storage reads per-column, so naming only the fields you need touches fewer dictionaries and skips CORRESPONDING mapping.",
              C: "SELECT * does not toggle the buffer.",
              D: "On a column store the difference is real, because reads are per-column.",
            },
            principle:
              "Project narrowly so the column store reads only what you need.",
          },
          {
            n: 3,
            question:
              "What is the recommended replacement for a `SELECT ... ENDSELECT` loop?",
            options: {
              A: "Read straight `INTO TABLE`, or use a deliberate PACKAGE SIZE cursor when the set will not fit in memory.",
              B: "Wrap it in a HASHED internal table.",
              C: "Add `%_HINTS HDB 'USE_HEX_PLAN'`.",
              D: "Convert it to native SQL via EXEC SQL.",
            },
            correct: "A",
            explanations: {
              A: "Correct — INTO TABLE avoids the open cursor and row-by-row round trips; a PACKAGE SIZE cursor is the deliberate exception for huge results.",
              B: "A HASHED table is about keyed reads, not about replacing the SELECT loop.",
              C: "A hint does not address the row-by-row round-trip pattern.",
              D: "Native SQL bypasses Open SQL safety and is not the remedy for ENDSELECT.",
            },
            principle:
              "Replace ENDSELECT with INTO TABLE, or a controlled PACKAGE SIZE cursor.",
          },
        ],
      },
    },
    {
      id: "m07-c2",
      code: "7.2",
      title: "The diagnostics toolkit",
      bloom: "U",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §7.2",
        paragraphs: [
          "Performance work begins with measurement, and SAP ships a distinct tool for each kind of question. ST05 is the SQL trace: switch it on, run the suspect path, and read which statements executed, how often, and how long — the first stop for slow SQL or lock waits. SAT is the runtime (ABAP) trace, the successor to SE30, for a CPU profile of an ABAP path when the bottleneck is in the code, not the database.",
          "For production, SQLM (the SQL Monitor) aggregates statement statistics over a long collection window on the live system, and SWLT (the SQL Performance Tuning Worklist) joins SQLM data with Code Inspector findings so you can prioritize remediation by both cost and code smell. To see what HANA itself is running, open DBACOCKPIT and read the SQL plan cache; to tune one statement, PLANVIZ renders its plan tree so you can spot a nested-loop join or a missing pushdown.",
          "Three more tools answer usage and coverage questions rather than latency. SCMON records object usage — which programs, function modules and classes are actually called — for decommissioning and scoping. SCOV reports code coverage after unit tests, surfacing dead code. SUSG aggregates usage statistics across systems for a landscape-wide roll-up. Knowing which tool answers which question is half the battle; reaching for ST05 when the problem is CPU-bound, or SAT when it is a slow join, wastes hours.",
        ],
        keyPoints: [
          "ST05 — SQL trace: what SQL ran, how often, how long; first stop for slow SQL and lock waits.",
          "SAT — runtime/ABAP trace (replaces SE30) for a CPU profile of an ABAP path.",
          "SQLM — SQL Monitor aggregates statements on production; SWLT joins SQLM with Code Inspector findings.",
          "DBACOCKPIT — HANA SQL plan cache; PLANVIZ — per-statement plan tree.",
          "SCMON — object usage; SCOV — code coverage; SUSG — cross-system usage aggregation.",
        ],
        examples: [
          {
            title: "Matching tool to symptom",
            variant: "neutral",
            body: "Slow report, suspect SQL → ST05. High CPU but light DB → SAT. 'Which statements hurt most in prod over a month?' → SQLM, then SWLT to prioritize. 'Why is this one query slow?' → PLANVIZ. 'Is this code even used?' → SCMON; 'covered by tests?' → SCOV; 'across the landscape?' → SUSG.",
          },
        ],
        simplified: {
          oneLiner:
            "Each question has a tool: ST05 for SQL, SAT for CPU, SQLM/SWLT for production hotspots, DBACOCKPIT/PLANVIZ for plans, SCMON/SCOV/SUSG for usage and coverage.",
          analogy:
            "A mechanic's diagnostic bay — a different gauge for fuel, timing and compression; you read the right gauge for the symptom.",
        },
        deeper: {
          paragraphs: [
            "ST05 and SQLM are complementary: ST05 is a short, targeted trace you drive by hand, whereas SQLM runs unattended on production for weeks and aggregates by statement, so it surfaces the costly statements you would never think to trace. SWLT then closes the loop by overlaying static Code Inspector findings on those runtime hotspots, turning 'this is slow' into 'this is slow *and* here is the anti-pattern to fix.'",
          ],
          keyPoints: [
            "ST05 is targeted and manual; SQLM is unattended and aggregated over time.",
            "SWLT marries runtime cost (SQLM) with static findings (Code Inspector) for prioritization.",
          ],
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "A report is slow and you suspect the database. Which tool do you reach for first?",
            options: {
              A: "SCOV — code coverage.",
              B: "ST05 — the SQL trace.",
              C: "SUSG — cross-system usage.",
              D: "SAT — the runtime trace.",
            },
            correct: "B",
            explanations: {
              A: "SCOV reports test coverage, not SQL latency.",
              B: "Correct — ST05 traces the SQL that ran, how often and how long; it is the first stop for suspected slow SQL.",
              C: "SUSG aggregates usage across systems, not statement latency.",
              D: "SAT profiles CPU in ABAP; reach for it when the bottleneck is code, not the database.",
            },
            principle:
              "ST05 is the first tool for suspected slow SQL or lock waits.",
          },
          {
            n: 2,
            question:
              "Which tool joins SQL Monitor data with Code Inspector findings to prioritize remediation?",
            options: {
              A: "PLANVIZ.",
              B: "DBACOCKPIT.",
              C: "SWLT — the SQL Performance Tuning Worklist.",
              D: "SCMON.",
            },
            correct: "C",
            explanations: {
              A: "PLANVIZ renders a single statement's plan tree; it does not merge SQLM with static findings.",
              B: "DBACOCKPIT shows the HANA plan cache, not a Code-Inspector-joined worklist.",
              C: "Correct — SWLT overlays Code Inspector findings on SQLM runtime data so you can prioritize by cost and smell.",
              D: "SCMON records object usage, not a tuning worklist.",
            },
            principle:
              "SWLT combines runtime cost (SQLM) with static findings to rank fixes.",
          },
          {
            n: 3,
            question:
              "You need to know whether a custom program is still being used before decommissioning it. Which tool fits?",
            options: {
              A: "PLANVIZ.",
              B: "ST05.",
              C: "SAT.",
              D: "SCMON — object usage statistics.",
            },
            correct: "D",
            explanations: {
              A: "PLANVIZ tunes a query plan; it says nothing about whether a program is called.",
              B: "ST05 is a short SQL trace, not a usage record over time.",
              C: "SAT profiles a single run's CPU, not long-run usage.",
              D: "Correct — SCMON records which objects are actually used, the basis for decommissioning decisions.",
            },
            principle:
              "SCMON answers 'is this object used?' for decommissioning and scoping.",
          },
        ],
      },
    },
    {
      id: "m07-c3",
      code: "7.3",
      title: "Declarative, projected, joined",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §7.3",
        paragraphs: [
          "The single most common performance fix in custom ABAP is collapsing per-row database access into one set-based read. The anti-pattern is a `SELECT SINGLE` inside a `LOOP AT`: for every order you fire a separate query for the customer name, so a thousand orders cost a thousand round trips. The optimizer never sees the whole problem, and the application server spends its time waiting on the network.",
          "The first improvement is FOR ALL ENTRIES: collect the keys, issue one statement, and merge the result back in ABAP. This cuts a thousand round trips to one, but you still de-duplicate the driver, must guard the empty-driver case, and do the join logic yourself in ABAP. It is better, not best — a useful middle step when the join cannot yet be expressed declaratively.",
          "The winning form is a single INNER JOIN — or, better still, a CDS view consumed by one SELECT. You name exactly the columns you need, the join happens on HANA where the data lives, and the optimizer can choose the plan. The same three columns that took a thousand queries now take one projected, joined statement. Internalize the progression — per-row SELECT SINGLE → FOR ALL ENTRIES → a single join or CDS — because you will apply it again and again.",
        ],
        keyPoints: [
          "Anti-pattern: SELECT SINGLE inside LOOP AT — one round trip per row.",
          "Better: FOR ALL ENTRIES — one statement, but you merge and de-dup yourself.",
          "Best: a single INNER JOIN, or a CDS view consumed by one SELECT.",
          "Name the columns and let the join run on HANA where the data lives.",
          "The progression per-row → FAE → join/CDS recurs constantly in custom code.",
        ],
        examples: [
          {
            title: "Per-row SELECT SINGLE in a loop",
            variant: "before",
            lang: "ABAP",
            body: "One query per order to fetch the customer name — N round trips, no set-based optimization.",
            code: [
              "loop at lt_orders assigning field-symbol(<o>).",
              "  select single name1 from kna1",
              "    into @<o>-customer_name",
              "    where kunnr = @<o>-customer_id.",
              "endloop.",
            ].join("\n"),
          },
          {
            title: "Middle step — FOR ALL ENTRIES, then merge",
            variant: "before",
            lang: "ABAP",
            body: "One statement instead of N, but you still de-duplicate the driver, guard the empty case, and stitch the result back by hand.",
            code: [
              "select kunnr, name1",
              "  from kna1",
              "  for all entries in @lt_orders",
              "  where kunnr = @lt_orders-customer_id",
              "  into table @data(lt_kna1).",
              "\" ... then loop and merge name1 into lt_orders",
            ].join("\n"),
          },
          {
            title: "Best — a single projected INNER JOIN",
            variant: "after",
            lang: "ABAP",
            body: "Named columns, the join executed on HANA, the optimizer free to choose the plan; one statement does it all (a CDS view would be cleaner still).",
            code: [
              "select o~order_id, o~customer_id,",
              "       k~name1 as customer_name, o~total",
              "  from zorder_hdr as o",
              "  inner join kna1 as k on k~kunnr = o~customer_id",
              "  where o~status = 'OPEN'",
              "  into table @data(lt_result).",
            ].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "Replace a SELECT SINGLE in a loop with FOR ALL ENTRIES, and ideally a single INNER JOIN or CDS view — one set-based read instead of N round trips.",
          analogy:
            "Don't phone the warehouse once per item; send one list and get one answer back.",
        },
        deeper: {
          paragraphs: [
            "The reason the join wins over FOR ALL ENTRIES is that the join lets HANA decide the access path and do the matching in the engine, while FAE forces a fixed IN-list or UNION rewrite and pushes the merge logic back into ABAP. A CDS view goes one better: it is reusable, carries the projection and join as a named contract, and is consumable from Open SQL, RAP and analytics alike.",
          ],
          keyPoints: [
            "A join lets the optimizer pick the access path; FAE fixes the rewrite shape.",
            "A CDS view turns the projected join into a reusable, released contract.",
          ],
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "What is the core problem with a `SELECT SINGLE` inside a `LOOP AT`?",
            options: {
              A: "It fires one database round trip per row, so the optimizer never sees the whole problem.",
              B: "It is a syntax error in modern ABAP.",
              C: "It always returns duplicate rows.",
              D: "It bypasses authorization checks.",
            },
            correct: "A",
            explanations: {
              A: "Correct — N iterations mean N queries and N round trips; the database optimizes each in isolation.",
              B: "It is valid syntax, just a poor pattern.",
              C: "SELECT SINGLE returns one row per call; duplication is not the issue.",
              D: "It does not bypass authorization; the issue is round-trip cost.",
            },
            principle:
              "Per-row SELECT SINGLE in a loop means one round trip per iteration.",
          },
          {
            n: 2,
            question:
              "Why is a single INNER JOIN preferable to FOR ALL ENTRIES for the same lookup?",
            options: {
              A: "FOR ALL ENTRIES cannot read more than one table.",
              B: "The join lets HANA choose the access path and match in the engine, instead of a fixed rewrite plus an ABAP-side merge.",
              C: "FOR ALL ENTRIES is forbidden in ABAP Cloud.",
              D: "The join automatically caches results in the ABAP buffer.",
            },
            correct: "B",
            explanations: {
              A: "FAE reads one table against a driver; the distinction is optimizer freedom, not table count.",
              B: "Correct — a join hands the optimizer the whole problem; FAE fixes the rewrite shape and pushes the merge into ABAP.",
              C: "FAE is permitted; the point is that a join is usually better.",
              D: "Joins do not auto-populate the ABAP buffer.",
            },
            principle:
              "A join gives the optimizer the whole problem; FAE constrains the plan.",
          },
          {
            n: 3,
            question:
              "What is the recommended progression for fixing per-row lookups?",
            options: {
              A: "Per-row SELECT SINGLE → native SQL → ABAP loop.",
              B: "FOR ALL ENTRIES → SELECT SINGLE in a loop → join.",
              C: "Per-row SELECT SINGLE → FOR ALL ENTRIES → a single INNER JOIN or CDS view.",
              D: "Buffer everything → then loop.",
            },
            correct: "C",
            explanations: {
              A: "Native SQL and ABAP loops are the wrong direction; this is not the progression.",
              B: "This reverses the order — a loop of SELECT SINGLE is the worst, not a middle step.",
              C: "Correct — start at per-row SELECT SINGLE, improve to FAE, and land on a single join or CDS view.",
              D: "Blanket buffering is not the pattern; the goal is one set-based read.",
            },
            principle:
              "Move from per-row SELECT SINGLE to FAE to a single join or CDS.",
          },
        ],
      },
    },
    {
      id: "m07-c4",
      code: "7.4",
      title: "Hints & buffering",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §7.4",
        paragraphs: [
          "Database hints let you override the optimizer from Open SQL via the `%_HINTS` clause — for HANA, for instance, `%_HINTS HDB 'USE_HEX_PLAN'`. They are a last resort, not a first move: a hint freezes a decision that was correct for one data distribution and one release, and it tends to outlive its justification, so a statement rewrite that makes the optimizer choose the right plan on its own is almost always preferable to pinning the plan with a hint.",
          "The ABAP table buffer is a separate, application-server-side cache with three modes. Single-record buffering caches individual rows by full key — best for frequent point lookups. Generic-area buffering caches groups of rows sharing a leading key prefix — useful for customizing tables read by a leading key. Full buffering caches the whole table — for tiny, rarely-changing config tables. Choosing the mode is a property of the table and the access pattern, not the statement.",
          "Two facts trip people up. FOR ALL ENTRIES and the explicit `BYPASSING BUFFER` addition both skip the ABAP buffer entirely, so a 'buffered' table read with FAE still goes to the database. And the HANA column-store cache is *not* the ABAP buffer — they are independent layers, and both can be in play for the same table. Reasoning about performance means knowing which cache, if any, a given read actually consults.",
        ],
        keyPoints: [
          "Hints go via `%_HINTS`, e.g. `%_HINTS HDB 'USE_HEX_PLAN'` on HANA.",
          "Prefer a statement rewrite over a hint — hints outlive their justification.",
          "Buffer modes: single-record (point lookups), generic (leading-key groups), full (tiny config tables).",
          "FOR ALL ENTRIES and BYPASSING BUFFER skip the ABAP buffer.",
          "The HANA column-store cache is independent of the ABAP buffer; both can apply.",
        ],
        examples: [
          {
            title: "An HDB hint in Open SQL",
            variant: "neutral",
            lang: "ABAP",
            body: "A HANA hint pins the plan — use it only when a rewrite cannot get the optimizer there, because the hint will outlive the data distribution that justified it.",
            code: [
              "select * from bseg",
              "  where bukrs = '1000'",
              "  %_HINTS HDB 'USE_HEX_PLAN'",
              "  into table @data(lt_bseg).",
            ].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "Prefer rewrites over hints (hints outlive their reason); pick the right ABAP buffer mode; and remember FAE and BYPASSING BUFFER skip the buffer, which is not the HANA cache.",
          analogy:
            "A hint is a sticky note overriding the GPS — handy once, but it stays stuck long after the road changed; the ABAP buffer and HANA cache are two different glove-box maps.",
        },
        deeper: {
          paragraphs: [
            "The danger of hints is temporal: the data volume, the statistics and even the kernel that made `USE_HEX_PLAN` the right call all change, yet the hint stays in the code, silently forcing a now-suboptimal plan. A rewrite that expresses intent — a narrower projection, a better join order, a CDS view — lets the optimizer re-decide every release, which is exactly what you want on a moving platform.",
          ],
          keyPoints: [
            "Hints are frozen decisions; rewrites stay adaptive across releases and data growth.",
            "A 'buffered' table read via FAE quietly goes to the database — verify the access path if buffering was the plan.",
          ],
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Why prefer a statement rewrite over a database hint such as `%_HINTS HDB 'USE_HEX_PLAN'`?",
            options: {
              A: "Hints are forbidden in ABAP Cloud, rewrites are not.",
              B: "A hint freezes a plan decision that outlives its justification, while a rewrite lets the optimizer re-decide each release.",
              C: "Hints always slow the query down.",
              D: "Rewrites disable the ABAP buffer, which is faster.",
            },
            correct: "B",
            explanations: {
              A: "The concern is durability of the decision, not a Cloud prohibition.",
              B: "Correct — a hint pins a plan that was right once; a rewrite keeps the optimizer free to adapt as data and releases change.",
              C: "A hint can help in the moment; the problem is that it stops being right over time.",
              D: "Rewrites do not disable the buffer, and that is unrelated to the reasoning.",
            },
            principle:
              "Rewrites stay adaptive; hints freeze a decision that outlives its reason.",
          },
          {
            n: 2,
            question:
              "Which access skips the ABAP table buffer?",
            options: {
              A: "FOR ALL ENTRIES, and a read with the BYPASSING BUFFER addition.",
              B: "A SELECT SINGLE by full key on a single-record-buffered table.",
              C: "Any read of a fully-buffered table.",
              D: "A read of a generic-area-buffered table by its leading key.",
            },
            correct: "A",
            explanations: {
              A: "Correct — FOR ALL ENTRIES and explicit BYPASSING BUFFER both go straight to the database.",
              B: "A full-key point read is exactly what single-record buffering serves from the buffer.",
              C: "Reading a fully-buffered table normally hits the buffer, not bypasses it.",
              D: "A leading-key read is what generic buffering is designed to serve.",
            },
            principle:
              "FOR ALL ENTRIES and BYPASSING BUFFER bypass the ABAP buffer.",
          },
          {
            n: 3,
            question:
              "How do the HANA column-store cache and the ABAP table buffer relate?",
            options: {
              A: "They are the same cache under two names.",
              B: "The HANA cache replaces the ABAP buffer entirely.",
              C: "The ABAP buffer lives inside the HANA cache.",
              D: "They are independent layers, and both can be in play for the same table.",
            },
            correct: "D",
            explanations: {
              A: "They are distinct mechanisms at different tiers, not the same cache.",
              B: "The HANA cache does not replace the application-server-side ABAP buffer.",
              C: "The ABAP buffer is on the application server, not inside HANA.",
              D: "Correct — the HANA column cache (database) and the ABAP buffer (application server) are independent, and both may apply.",
            },
            principle:
              "The HANA column cache and the ABAP buffer are independent layers.",
          },
        ],
      },
    },
    {
      id: "m07-c5",
      code: "7.5",
      title: "Rarely-documented performance pitfalls",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §7.5",
        paragraphs: [
          "A few performance pitfalls almost never appear in the textbooks yet cause real damage in production. The first is `SELECT ... FOR UPDATE`: on HANA it acquires *write* locks, escalating contention, and many developers add it defensively when they only meant to read. Use it only when you genuinely need the consistency guarantee within the same transaction; otherwise you are serializing readers behind a lock they never needed.",
          "The second is the counter anti-pattern: `UPDATE ... SET f = f + 1`. On HANA's MVCC storage, repeatedly incrementing the same column serializes the row's version chain heavily, so a hot counter becomes a contention point. For counters, use a dedicated number-range object, which is built to hand out values without serializing a row. The third is dynamic Open SQL — `SELECT ... FROM (dyntab)` and similar — which defeats both optimizer plan reuse and the static ATC checks, so you lose performance and analyzability at once.",
          "The fourth is `INSERT ... ACCEPTING DUPLICATE KEYS`: it silently drops rows whose key already exists instead of dumping. That is occasionally exactly what you want, but it is a foot-gun if you did not plan for it — rows simply vanish with no error, and a later reconciliation finds fewer rows than were inserted. Each of these is invisible in a quick read of the code, which is precisely why they belong in a senior developer's checklist.",
        ],
        keyPoints: [
          "SELECT ... FOR UPDATE takes write locks on HANA — use only when you truly need the consistency guarantee.",
          "UPDATE SET f = f + 1 serializes the row version chain; use a number-range object for counters.",
          "Dynamic Open SQL defeats optimizer plan reuse and static ATC checks.",
          "INSERT ... ACCEPTING DUPLICATE KEYS silently drops duplicate rows — no error.",
          "All four are invisible on a casual read, so keep them on a review checklist.",
        ],
        examples: [
          {
            title: "A counter that serializes the row",
            variant: "before",
            lang: "ABAP",
            body: "Every increment contends on the same row's version chain — a hotspot under load.",
            code: [
              "update zcounter",
              "   set cnt = cnt + 1",
              " where mandt = @sy-mandt",
              "   and id   = 'GLOBAL'.",
            ].join("\n"),
          },
          {
            title: "Hand the counter to a number-range object",
            variant: "after",
            lang: "ABAP",
            body: "A released number-range runtime hands out the next value without serializing a single hot row.",
            code: [
              "cl_numberrange_runtime=>number_get(",
              "  exporting",
              "    nr_range_nr = '01'",
              "    object      = 'ZORDERNO'",
              "  importing",
              "    number      = data(lv_next) ).",
            ].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "Watch the silent traps: FOR UPDATE takes write locks, SET f = f + 1 serializes the row (use a number range), dynamic Open SQL defeats reuse and ATC, and ACCEPTING DUPLICATE KEYS drops rows without error.",
          analogy:
            "These are the potholes with no warning sign — fine if you know they're there, axle-breaking if you don't.",
        },
        deeper: {
          paragraphs: [
            "The counter case is the most instructive: it shows why a database-correct statement can still be a scalability defect. The increment is atomic and correct, but under MVCC each update creates a new row version, and concurrent updaters queue on that chain — so the right answer is not a faster UPDATE but a different mechanism, the number-range object, designed for exactly this concurrency pattern.",
          ],
          keyPoints: [
            "Correctness and scalability are different properties — `f = f + 1` is correct yet serializes.",
            "ACCEPTING DUPLICATE KEYS trades a dump for silent data loss; only use it when that trade is intended.",
          ],
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "What happens when you increment a hot counter with `UPDATE ... SET f = f + 1` on HANA?",
            options: {
              A: "It serializes the row's version chain, creating a contention hotspot.",
              B: "It is rejected as a syntax error.",
              C: "It is lock-free and scales linearly.",
              D: "It silently drops the update.",
            },
            correct: "A",
            explanations: {
              A: "Correct — under MVCC, repeated increments queue on the same row's version chain; use a number-range object instead.",
              B: "It is valid syntax, just a scalability trap.",
              C: "It is the opposite of lock-free under concurrency.",
              D: "The update is applied; the problem is serialization, not silent loss.",
            },
            principle:
              "Increment-in-place serializes the row; counters belong in a number-range object.",
          },
          {
            n: 2,
            question:
              "What does `INSERT ... ACCEPTING DUPLICATE KEYS` do when a key already exists?",
            options: {
              A: "It raises an exception you must catch.",
              B: "It overwrites the existing row.",
              C: "It silently drops the duplicate row, with no error.",
              D: "It rolls back the whole insert.",
            },
            correct: "C",
            explanations: {
              A: "The whole point of the addition is to suppress the dump, so no exception is raised.",
              B: "It does not overwrite; the existing row stays and the new one is skipped.",
              C: "Correct — duplicates are dropped silently, which is useful but a foot-gun if unplanned.",
              D: "Non-duplicate rows are still inserted; there is no full rollback.",
            },
            principle:
              "ACCEPTING DUPLICATE KEYS drops dup rows silently — plan for the data loss.",
          },
          {
            n: 3,
            question:
              "Why is dynamic Open SQL (e.g. `SELECT ... FROM (dyntab)`) a performance and quality concern?",
            options: {
              A: "It runs only in the ABAP buffer.",
              B: "It defeats optimizer plan reuse and slips past static ATC checks.",
              C: "It always takes a table lock.",
              D: "It is faster but returns wrong results.",
            },
            correct: "B",
            explanations: {
              A: "It does not run in the buffer; the issues are plan reuse and analyzability.",
              B: "Correct — a dynamic statement cannot reuse a cached plan and is invisible to static ATC checks.",
              C: "It does not inherently take a table lock.",
              D: "It is not inherently faster, and the concern is reuse and checkability, not wrong results.",
            },
            principle:
              "Dynamic Open SQL loses both optimizer plan reuse and static ATC coverage.",
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
          "Which is one of the five rules that fix most slow SQL on HANA?",
        options: {
          A: "Always use SELECT * so the buffer can cache everything.",
          B: "Push aggregation down to the database instead of looping to total in ABAP.",
          C: "Replace every join with a loop of SELECT SINGLE.",
          D: "Add a database hint to every statement.",
        },
        correct: "B",
        explanations: {
          A: "SELECT * is the opposite of the rule; project narrowly.",
          B: "Correct — pushing aggregation down lets the database count and sum in one scan.",
          C: "Per-row SELECT SINGLE is the anti-pattern the rules remove.",
          D: "Hints are a last resort, not a default.",
        },
        principle:
          "Push aggregation down rather than totalling rows in ABAP.",
      },
      {
        n: 2,
        question:
          "You suspect a slow statement and want to see exactly what SQL ran and how long it took. Which tool?",
        options: {
          A: "SCOV.",
          B: "SUSG.",
          C: "ST05 — the SQL trace.",
          D: "PLANVIZ.",
        },
        correct: "C",
        explanations: {
          A: "SCOV is code coverage, not SQL latency.",
          B: "SUSG aggregates usage across systems.",
          C: "Correct — ST05 traces which SQL ran, how often and how long.",
          D: "PLANVIZ shows a plan tree for one statement, after you have identified it.",
        },
        principle:
          "ST05 is the first stop for capturing what SQL actually ran.",
      },
      {
        n: 3,
        question:
          "What is the best end state for a per-row `SELECT SINGLE` lookup inside a loop?",
        options: {
          A: "A single INNER JOIN or a CDS view consumed by one SELECT.",
          B: "Keep the loop but add a hint.",
          C: "Convert it to native SQL.",
          D: "Wrap each SELECT SINGLE in its own subroutine.",
        },
        correct: "A",
        explanations: {
          A: "Correct — one projected, joined statement (or a CDS view) replaces N round trips.",
          B: "A hint does not address the per-row round-trip pattern.",
          C: "Native SQL loses Open SQL safety and is not the goal.",
          D: "Wrapping each call changes nothing about the round-trip cost.",
        },
        principle:
          "Collapse per-row reads into one set-based join or CDS read.",
      },
      {
        n: 4,
        question:
          "Which access path skips the ABAP table buffer?",
        options: {
          A: "A full-key read of a single-record-buffered table.",
          B: "FOR ALL ENTRIES.",
          C: "A leading-key read of a generic-buffered table.",
          D: "A read of a fully-buffered config table.",
        },
        correct: "B",
        explanations: {
          A: "That is exactly what single-record buffering serves.",
          B: "Correct — FOR ALL ENTRIES (like BYPASSING BUFFER) goes straight to the database.",
          C: "Generic buffering is built to serve leading-key reads.",
          D: "A fully-buffered table read normally hits the buffer.",
        },
        principle:
          "FOR ALL ENTRIES and BYPASSING BUFFER bypass the ABAP buffer.",
      },
      {
        n: 5,
        question:
          "For a high-frequency counter, what should you use instead of `UPDATE ... SET f = f + 1`?",
        options: {
          A: "A dedicated number-range object.",
          B: "A SELECT ... FOR UPDATE before each increment.",
          C: "Dynamic Open SQL.",
          D: "INSERT ... ACCEPTING DUPLICATE KEYS.",
        },
        correct: "A",
        explanations: {
          A: "Correct — a number-range object hands out values without serializing a hot row.",
          B: "FOR UPDATE adds write locks and makes contention worse.",
          C: "Dynamic Open SQL defeats plan reuse and ATC; it does not help a counter.",
          D: "ACCEPTING DUPLICATE KEYS silently drops rows; it is unrelated to counters.",
        },
        principle:
          "Counters belong in a number-range object, not an in-place increment.",
      },
    ],
  },
};
