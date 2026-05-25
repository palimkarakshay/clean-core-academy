/* ------------------------------------------------------------------
   Module 2 — HANA Readiness: the DB Mindset.

   Source brief: §2 of the Clean Core & HANA Readiness curriculum.
   Audience: new + intermediate developers, plus admins scoping a
   migration. The shift from AnyDB to HANA is conceptual, not just
   "faster" — columnar storage, no implicit sort, MVCC snapshot reads.
   Every concept ships paragraphs + keyPoints + simplified.oneLiner and
   a 3-question quiz with per-option explanations. Code-bearing
   concepts (the gotchas) add before/after ABAP examples.
------------------------------------------------------------------ */

import type { Section } from "../_types";

export const m02HanaReadiness: Section = {
  id: "m02-hana-readiness",
  n: 2,
  title: "HANA Readiness: the DB Mindset",
  sourceCourse: "clean-core-curriculum §2",
  audiences: ["new", "intermediate", "admin"],
  skills: [
    {
      id: "m02-s1",
      label: "Explain the six conceptual shifts HANA introduces (columnar, no implicit sort, MVCC)",
      conceptId: "m02-c1",
    },
    {
      id: "m02-s2",
      label: "Spot and fix the classic HANA gotchas (empty-driver FAE, missing ORDER BY, partial-key SELECT SINGLE)",
      conceptId: "m02-c2",
    },
    {
      id: "m02-s3",
      label: "Avoid the deep-cut internal-table and SQL traps that produce wrong results without a dump",
      conceptId: "m02-c3",
    },
    {
      id: "m02-s4",
      label: "Run a custom-code migration loop: SCMON usage scoping, ATC quality scan, exemption baseline",
      conceptId: "m02-c4",
    },
    {
      id: "m02-s5",
      label: "Use the Simplification Database and the right release-aligned ATC variant",
      conceptId: "m02-c5",
    },
  ],
  blurb:
    "What actually changes underneath your code when you move to HANA, the classic and not-so-classic gotchas that silently return wrong results, and the SCMON to ATC to baseline loop that scopes and tames the migration.",
  concepts: [
    {
      id: "m02-c1",
      code: "2.1",
      title: "What actually changed when you moved to HANA",
      bloom: "U",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §2.1",
        paragraphs: [
          "The conceptual shift to HANA is not 'faster' — it is six structural changes, and every well-known gotcha derives from one of them. Tables are columnar by default, so the row order you used to get implicitly is gone; a result set arrives in whatever order the column-store engine finds cheapest unless you ask for an order.",
          "Reads no longer take row locks, and HANA serves them from an MVCC snapshot — a consistent view as of the statement's start — so concurrent writers don't block your SELECT and you don't block them. Pool and cluster tables were dissolved into transparent tables (BSEG, KONV, CDPOS and friends), so reads against them now behave like any other table but with subtly different cardinality.",
          "Finally the optimizer thinks differently: it favours set-based, projected, pushed-down access and is unimpressed by row-at-a-time loops and AnyDB-era hints. Internalising these six shifts is what turns 'my code broke after the migration' into 'of course it did, and here is why.'",
        ],
        keyPoints: [
          "Columnar by default — no implicit physical row order to rely on.",
          "No implicit sort: order must be requested, or it is arbitrary.",
          "SELECT takes no row lock; reads come from an MVCC snapshot.",
          "Pool/cluster tables are now transparent — same SQL, different cardinality.",
          "The optimizer rewards set-based, projected access and ignores AnyDB hints.",
        ],
        examples: [
          {
            title: "Why the same SELECT returns rows in a new order",
            variant: "neutral",
            body: "On AnyDB a clustered B-tree often handed back rows in key order for free; the HANA column store has no such physical order, so without ORDER BY the sequence is whatever the engine picks.",
          },
        ],
        simplified: {
          oneLiner:
            "HANA changed the storage and execution model — columnar, no implicit sort, snapshot reads, transparent pool/cluster tables — so old assumptions about order and locking no longer hold.",
          analogy:
            "AnyDB was a filing cabinet that kept folders in a fixed order; HANA is a warehouse of loose cards it re-shuffles for speed, so you must label the order you want.",
        },
        deeper: {
          paragraphs: [
            "MVCC matters beyond performance: a long-running report reads a consistent snapshot from its start time, so it will not see rows committed by other transactions mid-read. That is usually what you want, but it means 'I selected twice in one method and got different counts' is a real, correct outcome under concurrency.",
          ],
          keyPoints: [
            "Snapshot reads give consistency without readers blocking writers.",
            "Transparent BSEG/KONV reads can over-fan in joins where the old PK cardinality differed.",
          ],
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Why is there no longer a reliable implicit row order in a HANA SELECT without ORDER BY?",
            options: {
              A: "Because tables are stored columnar, with no physical row order to fall back on.",
              B: "Because HANA sorts everything descending by default.",
              C: "Because SELECT now always returns rows in primary-key order.",
              D: "Because the ABAP buffer reorders the rows.",
            },
            correct: "A",
            explanations: {
              A: "Correct — columnar storage has no clustered physical order, so without ORDER BY the sequence is whatever the engine finds cheapest.",
              B: "HANA does not impose any default sort; order is simply undefined without ORDER BY.",
              C: "Primary-key order is exactly what you can no longer assume.",
              D: "The ABAP buffer is not involved in ordering result sets.",
            },
            principle:
              "Columnar storage removes the implicit physical order AnyDB often gave you for free.",
          },
          {
            n: 2,
            question:
              "What does a plain SELECT do with respect to locking on HANA?",
            options: {
              A: "It takes a shared row lock for the duration of the transaction.",
              B: "It escalates to a table lock on large reads.",
              C: "It takes no row lock and reads from an MVCC snapshot.",
              D: "It blocks all writers until the cursor is closed.",
            },
            correct: "C",
            explanations: {
              A: "Reads do not acquire row locks on HANA.",
              B: "There is no lock escalation on a read; the read is lock-free.",
              C: "Correct — reads are lock-free and served from a consistent MVCC snapshot taken at statement start.",
              D: "Readers do not block writers under MVCC.",
            },
            principle:
              "HANA reads are lock-free snapshot reads — readers and writers do not block each other.",
          },
          {
            n: 3,
            question:
              "What happened to pool and cluster tables such as BSEG and KONV on HANA?",
            options: {
              A: "They were deleted and must be rebuilt by the customer.",
              B: "They were converted to transparent tables and are read with ordinary SQL.",
              C: "They became read-only views with no underlying storage.",
              D: "They moved into the ABAP shared buffer.",
            },
            correct: "B",
            explanations: {
              A: "The data was migrated, not deleted.",
              B: "Correct — pool/cluster structures were dissolved into transparent tables, so the same SQL works but cardinality can differ subtly.",
              C: "They are real transparent tables, not view-only objects.",
              D: "They live in the database, not the ABAP buffer.",
            },
            principle:
              "Pool/cluster tables are now transparent — same SQL surface, different physical model.",
          },
        ],
      },
    },
    {
      id: "m02-c2",
      code: "2.2",
      title: "The classic HANA gotchas",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §2.2",
        paragraphs: [
          "The classics all stem from the §2.1 shifts. ORDER BY is no longer free — if you assumed sorted output you now read 'random' rows; and SELECT SINGLE without a fully-qualified key returns an arbitrary matching row, which on HANA is often a different one than before. The fix for both is to be explicit: request the order you depend on, and never SELECT SINGLE on a partial key when you mean 'a specific row.'",
          "FOR ALL ENTRIES carries two traps that bite harder under HANA because result-set sizes differ: it silently de-duplicates the driver table, and — critically — an empty driver table returns ALL rows of the target, not none. Always guard with IF lines( itab ) > 0 before the FAE, or you will table-scan production.",
          "The remaining classics are quieter: implicit type conversion in a WHERE clause (comparing a CHAR18 MATNR to a short literal forces padding and can drop the index), COUNT(*) on a wide column-store table is a column scan rather than a free metadata read, and LIKE behaviour depends on HANA collation so CDS pattern filters should use the escape mechanism.",
        ],
        keyPoints: [
          "ORDER BY is not free — request it explicitly when you depend on order.",
          "SELECT SINGLE on a partial key returns an arbitrary row; supply the full key.",
          "FOR ALL ENTRIES de-duplicates the driver AND returns ALL rows on an empty driver — guard it.",
          "Implicit type conversion in WHERE can cost the index; match the field's type.",
          "COUNT(*) on a wide table is a column scan, not a free count.",
        ],
        examples: [
          {
            title: "Unguarded FOR ALL ENTRIES",
            variant: "before",
            lang: "ABAP",
            body: "If lt_keys is empty, this returns every row of mara — a full table scan nobody intended.",
            code: [
              "select matnr, mtart from mara",
              "  for all entries in @lt_keys",
              "  where matnr = @lt_keys-matnr",
              "  into table @data(lt_mara).",
            ].join("\n"),
          },
          {
            title: "Guarded FOR ALL ENTRIES",
            variant: "after",
            lang: "ABAP",
            body: "The empty-driver guard turns the dangerous all-rows case into a deliberate no-op.",
            code: [
              "if lt_keys is not initial.",
              "  select matnr, mtart from mara",
              "    for all entries in @lt_keys",
              "    where matnr = @lt_keys-matnr",
              "    into table @data(lt_mara).",
              "endif.",
            ].join("\n"),
          },
          {
            title: "Relying on implicit order",
            variant: "before",
            lang: "ABAP",
            body: "On HANA the 'first' row here is undefined — the read is not ordered.",
            code: [
              "select matnr, ersda from mara",
              "  into table @data(lt_mara)",
              "  up to 10 rows.",
            ].join("\n"),
          },
          {
            title: "Requesting the order you depend on",
            variant: "after",
            lang: "ABAP",
            body: "An explicit ORDER BY makes the 'first 10' deterministic.",
            code: [
              "select matnr, ersda from mara",
              "  order by ersda descending",
              "  into table @data(lt_mara)",
              "  up to 10 rows.",
            ].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "The classic traps: ORDER BY is no longer free, partial-key SELECT SINGLE is arbitrary, and an empty FOR ALL ENTRIES driver returns every row — so guard it.",
          analogy:
            "FOR ALL ENTRIES with an empty driver is like an unfiltered search box returning the entire catalog instead of nothing.",
        },
        pitfalls: [
          "Forgetting the IF lines( itab ) > 0 guard before FOR ALL ENTRIES — the empty-driver case silently returns all rows.",
          "Trusting SELECT ... UP TO n ROWS without ORDER BY to be deterministic.",
        ],
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "What does FOR ALL ENTRIES return when the driver internal table is empty?",
            options: {
              A: "No rows — the WHERE has nothing to match.",
              B: "A short dump at runtime.",
              C: "Only the first row of the target table.",
              D: "ALL rows of the target table — the FAE WHERE is effectively dropped.",
            },
            correct: "D",
            explanations: {
              A: "This is the intuitive expectation, and exactly the trap — it is wrong.",
              B: "There is no dump; the behaviour is silent, which is what makes it dangerous.",
              C: "It returns all rows, not one; nothing limits it to a single row.",
              D: "Correct — an empty driver removes the FAE condition, so the statement returns every row; always guard with IF lines( itab ) > 0.",
            },
            principle:
              "Always guard FOR ALL ENTRIES against an empty driver, or it table-scans the target.",
          },
          {
            n: 2,
            question:
              "On HANA, what does SELECT SINGLE return when the WHERE clause does not specify the full primary key?",
            options: {
              A: "An arbitrary matching row, which may differ from AnyDB.",
              B: "A syntax error at compile time.",
              C: "Always the row with the lowest primary key.",
              D: "All matching rows in a table.",
            },
            correct: "A",
            explanations: {
              A: "Correct — with a partial key the database may return any matching row, and the HANA choice often differs from the old one.",
              B: "It compiles fine; the danger is that it is silently non-deterministic.",
              C: "There is no guarantee it returns the lowest key without an explicit order.",
              D: "SELECT SINGLE returns one row, never a set.",
            },
            principle:
              "SELECT SINGLE needs a full key, or the row you get back is arbitrary.",
          },
          {
            n: 3,
            question:
              "Why can SELECT COUNT(*) on a wide column-store table be surprisingly expensive on HANA?",
            options: {
              A: "Because it locks the whole table while counting.",
              B: "Because it copies the table into the ABAP buffer first.",
              C: "Because it forces a descending sort before counting.",
              D: "Because it is a column scan rather than a free metadata read.",
            },
            correct: "D",
            explanations: {
              A: "COUNT(*) does not take a table lock; reads are lock-free.",
              B: "It does not stage the table in the ABAP buffer.",
              C: "Counting requires no sort.",
              D: "Correct — with a WHERE on a non-trivial column it scans that column rather than reading a cheap cached total.",
            },
            principle:
              "COUNT(*) with a filter is a column scan on HANA, not a free count.",
          },
        ],
      },
    },
    {
      id: "m02-c3",
      code: "2.3",
      title: "Deep cuts: the not-so-classic gotchas",
      bloom: "An",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §2.3",
        paragraphs: [
          "These are the quieter traps that produce wrong results without a dump. SELECT ... INTO TABLE ... PACKAGE SIZE n issues separate database calls and can break consistent-read in some isolation modes, so reach for explicit cursoring only when you truly need it. MODIFY ... FROM TABLE into a HASHED target reallocates buckets and is costly on hot paths — prefer INSERT INTO TABLE with a SORTED table when you are building up data in a loop.",
          "Two ordering assumptions cause silent corruption. DELETE ADJACENT DUPLICATES only removes duplicates that are physically adjacent, so without a prior SORT by the same comparison fields you delete some but not all duplicates. READ TABLE ... BINARY SEARCH assumes the table is already sorted ascending by the search key in declaration order; on an unsorted standard table the result is undefined — and there is no runtime error to warn you.",
          "The rest reward precision: COLLECT requires numeric addend components and a unique non-addend key, or it silently mis-totals; LOOP AT ... GROUP BY is HANA-friendly because it streams; and SELECT ... UP TO 1 ROWS needs an explicit ORDER BY (typically ORDER BY PRIMARY KEY) for 'the first row' to mean anything deterministic.",
        ],
        keyPoints: [
          "PACKAGE SIZE issues separate DB calls and can break consistent-read; use cursoring deliberately.",
          "MODIFY into a HASHED table reallocates buckets — prefer INSERT INTO a SORTED table on hot paths.",
          "DELETE ADJACENT DUPLICATES needs a prior SORT by the same fields, or it misses non-adjacent dups.",
          "READ TABLE BINARY SEARCH on an unsorted table is undefined — no dump, just wrong results.",
          "SELECT UP TO 1 ROWS needs an explicit ORDER BY to be deterministic.",
        ],
        examples: [
          {
            title: "DELETE ADJACENT DUPLICATES without a sort",
            variant: "before",
            lang: "ABAP",
            body: "On an unsorted table only physically adjacent duplicates vanish — scattered duplicates survive.",
            code: [
              "delete adjacent duplicates from lt_items",
              "  comparing matnr werks.",
            ].join("\n"),
          },
          {
            title: "Sort first, then de-duplicate",
            variant: "after",
            lang: "ABAP",
            body: "Sorting by the same fields first makes every duplicate adjacent, so all of them are removed.",
            code: [
              "sort lt_items by matnr werks.",
              "delete adjacent duplicates from lt_items",
              "  comparing matnr werks.",
            ].join("\n"),
          },
          {
            title: "BINARY SEARCH on an unsorted table",
            variant: "before",
            lang: "ABAP",
            body: "Undefined result and no runtime error — the read may report not-found for a row that exists.",
            code: [
              "read table lt_items into data(ls_item)",
              "  with key matnr = '4711'",
              "  binary search.",
            ].join("\n"),
          },
          {
            title: "Sort, or use a SORTED table key",
            variant: "after",
            lang: "ABAP",
            body: "Either sort by the search key first, or declare a SORTED table so the read is well-defined.",
            code: [
              "sort lt_items by matnr.",
              "read table lt_items into data(ls_item)",
              "  with key matnr = '4711'",
              "  binary search.",
            ].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "The deep cuts corrupt results silently: BINARY SEARCH and DELETE ADJACENT DUPLICATES both assume a prior SORT, and UP TO 1 ROWS needs an explicit ORDER BY.",
          analogy:
            "BINARY SEARCH on an unsorted table is like using a dictionary's binary lookup on pages that were shuffled — you confidently land on the wrong page.",
        },
        pitfalls: [
          "Calling DELETE ADJACENT DUPLICATES or READ ... BINARY SEARCH without first SORTing by exactly those fields.",
          "Assuming LOOP AT a HASHED table iterates in a meaningful order — hash order is undefined.",
        ],
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "What must precede DELETE ADJACENT DUPLICATES ... COMPARING f1 f2 for it to remove all duplicates?",
            options: {
              A: "A SORT by the same fields f1 f2.",
              B: "A COLLECT into a hashed table.",
              C: "A READ TABLE with BINARY SEARCH.",
              D: "Nothing — it always removes every duplicate.",
            },
            correct: "A",
            explanations: {
              A: "Correct — it only deletes physically adjacent duplicates, so the table must first be sorted by exactly those comparison fields.",
              B: "COLLECT aggregates numeric fields; it does not arrange the table for adjacency deletion.",
              C: "A binary-search read does not reorder the table.",
              D: "Without a prior sort it removes only adjacent duplicates, leaving scattered ones behind.",
            },
            principle:
              "DELETE ADJACENT DUPLICATES removes only adjacent rows — sort by the comparison fields first.",
          },
          {
            n: 2,
            question:
              "You run READ TABLE ... BINARY SEARCH on a standard table that was never sorted. What happens?",
            options: {
              A: "A short dump halts the program.",
              B: "It silently re-sorts the table for you.",
              C: "It always falls back to a linear scan.",
              D: "The result is undefined and there is no runtime error.",
            },
            correct: "D",
            explanations: {
              A: "There is no dump — that is precisely why this trap is dangerous.",
              B: "BINARY SEARCH never sorts the table; it assumes the table is already sorted.",
              C: "It does not fall back to a linear scan; it trusts the (false) precondition.",
              D: "Correct — on an unsorted table the outcome is undefined and silent, so it may report not-found for a row that exists.",
            },
            principle:
              "BINARY SEARCH on an unsorted table is undefined behaviour with no warning.",
          },
          {
            n: 3,
            question:
              "Which precondition does COLLECT require to total correctly?",
            options: {
              A: "The table must be declared as HASHED.",
              B: "The addend components must be numeric and the non-addend components must form a unique key.",
              C: "A BINARY SEARCH must run first.",
              D: "The table must be sorted descending.",
            },
            correct: "B",
            explanations: {
              A: "COLLECT works on standard, sorted, or hashed tables; the table kind is not the requirement.",
              B: "Correct — violating either rule (non-numeric addends, or a non-unique grouping key) silently produces wrong totals.",
              C: "COLLECT does not depend on a prior binary search.",
              D: "Sort order is irrelevant to COLLECT's correctness.",
            },
            principle:
              "COLLECT needs numeric addends and a unique non-addend key, or it mis-totals silently.",
          },
        ],
      },
    },
    {
      id: "m02-c4",
      code: "2.4",
      title: "What to actually do: SCMON → ATC → baseline",
      bloom: "A",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §2.4",
        paragraphs: [
          "Knowing the gotchas is not a plan; the plan is a four-step loop that scopes effort to code that actually runs. First, run SCMON (object usage) and UPL (procedure-level usage) on the productive system for a representative period of one to three months, so you fix live code and decommission the dead rather than rewriting everything.",
          "Second, run the Custom Code Migration app (Fiori) or SYCM in the back end to produce a prioritized quality report against the Simplification Database — a findings list per object, ranked by impact. Third, bring those findings under an ATC baseline: the baseline freezes today's debt so the team is only alerted about new debt, then chips away at the frozen set deliberately.",
          "Fourth, re-run after every FPS, because the Clean-Core and readiness checks gain rules each release — a pipeline that is green today can turn red after the next feature pack. The loop, not any single scan, is what keeps custom code converging on upgrade-safety.",
        ],
        keyPoints: [
          "Scope with SCMON/UPL for 1–3 months so you fix live code, not dead code.",
          "Quality-scan with the Custom Code Migration app or SYCM against the Simplification DB.",
          "Baseline the findings so only new debt raises alerts; then chip away at the baseline.",
          "Re-run after every FPS — readiness checks gain rules each release.",
        ],
        examples: [
          {
            title: "The migration loop, in order",
            variant: "neutral",
            body: "SCMON/UPL scopes what is live → Custom Code Migration app / SYCM ranks the findings → ATC baseline freezes existing debt → re-run after each FPS to catch new rules.",
          },
        ],
        simplified: {
          oneLiner:
            "Scope live code with SCMON/UPL, quality-scan it with the Custom Code Migration app, freeze today's debt under an ATC baseline, and re-run after every FPS.",
          analogy:
            "It is triage then a debt freeze: find out which patients are actually in the building, stop the bleeding for new injuries, and work down the old caseload.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Why run SCMON/UPL for one to three months before starting the rewrite?",
            options: {
              A: "To compress the database before the upgrade.",
              B: "To scope which custom code is actually live, so you fix that and decommission the dead.",
              C: "To disable the ABAP buffer during migration.",
              D: "To generate the OData service bindings automatically.",
            },
            correct: "B",
            explanations: {
              A: "Usage logging has nothing to do with database compression.",
              B: "Correct — usage data over a representative period tells you what runs, so effort goes to live code and dead code is retired.",
              C: "SCMON does not touch buffering behaviour.",
              D: "It records usage; it does not generate services.",
            },
            principle:
              "SCMON/UPL scopes the migration to code that actually runs.",
          },
          {
            n: 2,
            question:
              "What is the purpose of creating an ATC baseline during custom-code migration?",
            options: {
              A: "It deletes all existing findings permanently.",
              B: "It rewrites the flagged code automatically.",
              C: "It freezes today's debt so the team is alerted only about new debt.",
              D: "It exempts the code from all future ATC runs forever.",
            },
            correct: "C",
            explanations: {
              A: "A baseline freezes findings; it does not delete them — they are still there to chip away at.",
              B: "ATC reports and baselines; it does not auto-rewrite the code here.",
              C: "Correct — the baseline snapshots existing debt, so future runs surface only deltas while you work the frozen set down.",
              D: "It is not a blanket permanent exemption; you re-run and reduce the baseline over time.",
            },
            principle:
              "A baseline stops the alert fatigue of old debt so new debt stands out.",
          },
          {
            n: 3,
            question:
              "Why must the ATC quality scan be re-run after every FPS?",
            options: {
              A: "Because the readiness and Clean-Core checks gain rules each release.",
              B: "Because the baseline file expires after 30 days.",
              C: "Because SCMON deletes its log after each FPS.",
              D: "Because OData bindings break on every upgrade.",
            },
            correct: "A",
            explanations: {
              A: "Correct — each feature pack can add checks, so a green pipeline can turn red after an FPS even with unchanged code.",
              B: "Baselines do not expire on a timer.",
              C: "An FPS does not wipe the SCMON log.",
              D: "Bindings are not the reason the scan is repeated.",
            },
            principle:
              "Readiness checks are a moving target — re-scan after each FPS.",
          },
        ],
      },
    },
    {
      id: "m02-c5",
      code: "2.5",
      title: "The Simplification Database",
      bloom: "U",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §2.5",
        paragraphs: [
          "The Simplification Database is SAP's shipped catalog of everything that changed in S/4 — removed transactions, function modules, tables, and fields — and it is the data the readiness checks compare your code against. You reach it through transaction SYCM or the Fiori app 'Analyze Custom Code,' driven by the release-aligned ATC check variant S4HANA_READINESS_2023.",
          "There is exactly one Simplification Database per target release, so you must load the target release's DB rather than an older one; checking against yesterday's catalog gives findings for the wrong destination. This release-pinning is why the variant name carries the year — the 2023 variant maps to the 2023 simplification content.",
          "You can even run the simplification check from a non-S/4 source system by importing the Simplification Item Catalog there, per SAP Note 2436688 — and that import is exactly what makes the Remote ATC topology work, with a central ATC system holding the catalog and checking remote source systems over RFC.",
        ],
        keyPoints: [
          "The Simplification DB catalogs what S/4 removed or changed; readiness checks compare against it.",
          "Reach it via SYCM or the 'Analyze Custom Code' app.",
          "Use the release-aligned variant S4HANA_READINESS_2023.",
          "One DB per target release — always load the target's, not an older one.",
          "Import the Simplification Item Catalog (SAP Note 2436688) to enable Remote ATC.",
        ],
        examples: [
          {
            title: "Pointing the check at the right release",
            variant: "neutral",
            body: "Run 'Analyze Custom Code' (or SYCM) with variant S4HANA_READINESS_2023 against the target-release Simplification Database — never an older release's catalog.",
          },
        ],
        simplified: {
          oneLiner:
            "The Simplification Database is SAP's catalog of what changed in S/4; check against it with the release-matched S4HANA_READINESS_2023 variant via SYCM or 'Analyze Custom Code.'",
          analogy:
            "It is the official 'what moved or was discontinued' list for a given release — use the edition that matches where you are going, not last year's.",
        },
        deeper: {
          paragraphs: [
            "The Remote ATC topology centralises this: one ATC/QA system imports the Simplification Item Catalog and runs checks against remote productive or development systems over RFC, so source systems need not host the catalog themselves. SAP Note 2436688 documents importing the catalog onto a non-S/4 source to make that work.",
          ],
          keyPoints: [
            "Central ATC + imported catalog = Remote ATC over RFC.",
            "Lets you scan a pre-conversion (non-S/4) source against the target simplification content.",
          ],
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Which ATC check variant is the release-aligned one for the S/4HANA 2023 simplification content?",
            options: {
              A: "ABAP_CLOUD_DEVELOPMENT_DEFAULT",
              B: "S4HANA_READINESS_2023",
              C: "PERFORMANCE_DB",
              D: "SECURITY_CHECK",
            },
            correct: "B",
            explanations: {
              A: "That variant enforces Restricted ABAP and released-only consumption, not simplification readiness.",
              B: "Correct — the year in the variant name maps it to the matching release's simplification content.",
              C: "PERFORMANCE_DB targets DB performance, not simplification items.",
              D: "SECURITY_CHECK runs CVA security checks, unrelated to the Simplification DB.",
            },
            principle:
              "The readiness variant is release-pinned: S4HANA_READINESS_2023 for the 2023 content.",
          },
          {
            n: 2,
            question:
              "How many Simplification Databases apply, and which do you load?",
            options: {
              A: "One shared DB for all releases; load it once.",
              B: "One per ABAP package; load each separately.",
              C: "One per target release; load the target release's DB.",
              D: "One per developer; each maintains their own.",
            },
            correct: "C",
            explanations: {
              A: "It is not a single shared catalog; content differs per release.",
              B: "The DB is keyed to a release, not to individual packages.",
              C: "Correct — there is one DB per target release, so you must load the destination release's catalog, not an older one.",
              D: "It is a system-level catalog, not a per-developer artefact.",
            },
            principle:
              "Use the target release's Simplification DB — yesterday's catalog gives wrong findings.",
          },
          {
            n: 3,
            question:
              "What does importing the Simplification Item Catalog (SAP Note 2436688) onto a non-S/4 source system enable?",
            options: {
              A: "Running the simplification check remotely, enabling the Remote ATC topology.",
              B: "Automatically rewriting all flagged objects.",
              C: "Upgrading the source system to S/4 without SUM.",
              D: "Disabling the ABAP buffer on the source.",
            },
            correct: "A",
            explanations: {
              A: "Correct — importing the catalog lets a non-S/4 source be checked against the target content, which is what makes central Remote ATC work over RFC.",
              B: "Importing the catalog enables checking, not automatic remediation.",
              C: "It does not perform or replace the technical conversion.",
              D: "It has nothing to do with buffering.",
            },
            principle:
              "Importing the catalog onto a source system is what makes Remote ATC possible.",
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
          "Which is NOT one of the conceptual shifts HANA introduced?",
        options: {
          A: "Columnar storage by default.",
          B: "No implicit sort on a plain SELECT.",
          C: "Mandatory row locks on every SELECT.",
          D: "MVCC snapshot reads.",
        },
        correct: "C",
        explanations: {
          A: "Columnar-by-default is one of the shifts.",
          B: "Loss of implicit order is one of the shifts.",
          C: "Correct — the opposite is true: SELECT takes no row lock and reads from a snapshot.",
          D: "Snapshot reads are one of the shifts.",
        },
        principle:
          "HANA reads are lock-free; there is no mandatory row lock on SELECT.",
      },
      {
        n: 2,
        question:
          "A FOR ALL ENTRIES with an empty driver table will…",
        options: {
          A: "return all rows of the target table.",
          B: "return no rows.",
          C: "raise a short dump.",
          D: "return exactly one row.",
        },
        correct: "A",
        explanations: {
          A: "Correct — an empty driver drops the FAE condition, returning every row, so always guard with IF lines( itab ) > 0.",
          B: "Returning nothing is the intuitive but wrong expectation.",
          C: "There is no dump; the behaviour is silent.",
          D: "It is not limited to one row.",
        },
        principle: "Guard FOR ALL ENTRIES against an empty driver.",
      },
      {
        n: 3,
        question:
          "Before READ TABLE ... BINARY SEARCH on a standard table, you must…",
        options: {
          A: "run COLLECT first.",
          B: "convert it to a hashed table.",
          C: "do nothing — it sorts on the fly.",
          D: "SORT it ascending by the search key.",
        },
        correct: "D",
        explanations: {
          A: "COLLECT aggregates; it does not order the table for binary search.",
          B: "A hashed table is read by key directly and not via BINARY SEARCH.",
          C: "BINARY SEARCH never sorts; on an unsorted table the result is undefined with no error.",
          D: "Correct — BINARY SEARCH requires the table sorted ascending by the search key in declaration order.",
        },
        principle:
          "BINARY SEARCH demands a prior ascending SORT by the search key.",
      },
      {
        n: 4,
        question:
          "What is the correct order of the custom-code migration loop?",
        options: {
          A: "ATC baseline → SCMON → rewrite → never re-run.",
          B: "SCMON/UPL usage scoping → quality scan → ATC baseline → re-run after each FPS.",
          C: "Rewrite everything → then measure usage.",
          D: "Run SECURITY_CHECK → import OData → stop.",
        },
        correct: "B",
        explanations: {
          A: "You scope with usage data before baselining, and you must re-run after each FPS.",
          B: "Correct — scope live code, scan it for quality, freeze the debt with a baseline, then re-run after every feature pack.",
          C: "Measuring usage first is the whole point — it prevents rewriting dead code.",
          D: "Security checks and OData are not the migration loop.",
        },
        principle:
          "Scope, then scan, then baseline, then re-run after every FPS.",
      },
      {
        n: 5,
        question:
          "Which statement about the Simplification Database is correct?",
        options: {
          A: "There is one shared DB used unchanged across all releases.",
          B: "It is reached only by reading table DD02L directly.",
          C: "There is one DB per target release; use the target release's via SYCM or 'Analyze Custom Code.'",
          D: "It auto-rewrites every flagged object.",
        },
        correct: "C",
        explanations: {
          A: "Content is release-specific; there is one DB per target release.",
          B: "It is reached via SYCM or the 'Analyze Custom Code' app, not by raw table reads.",
          C: "Correct — load the target release's DB and drive it with the release-aligned readiness variant.",
          D: "It catalogs changes for checking; it does not rewrite code.",
        },
        principle:
          "One Simplification DB per release — use the target's, via SYCM / 'Analyze Custom Code.'",
      },
    ],
  },
};
