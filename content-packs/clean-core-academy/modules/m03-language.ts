/* ------------------------------------------------------------------
   Module 3 — ABAP Language Modernization.

   Source brief: §3 of the Clean Core & HANA Readiness curriculum.
   Audience: new + intermediate developers learning to swap obsolete
   constructs for modern, Clean-ABAP-compliant equivalents — inline
   declarations, constructor operators, string templates, and
   class-based exceptions. Every concept ships paragraphs + keyPoints +
   simplified.oneLiner and a 3-question quiz with per-option
   explanations; the code-centric concepts add before/after ABAP.
------------------------------------------------------------------ */

import type { Section } from "../_types";

export const m03Language: Section = {
  id: "m03-language",
  n: 3,
  title: "ABAP Language Modernization",
  sourceCourse: "clean-core-curriculum §3",
  audiences: ["new", "intermediate"],
  skills: [
    {
      id: "m03-s1",
      label: "Hunt obsolete language elements and replace them with modern equivalents",
      conceptId: "m03-c1",
    },
    {
      id: "m03-s2",
      label: "Write modern Open SQL with inline declarations and a projected field list",
      conceptId: "m03-c2",
    },
    {
      id: "m03-s3",
      label: "Apply the core constructor operators (VALUE, CORRESPONDING, COND, SWITCH, REDUCE, FILTER, FOR)",
      conceptId: "m03-c3",
    },
    {
      id: "m03-s4",
      label: "Replace CONCATENATE with formatted string templates",
      conceptId: "m03-c4",
    },
    {
      id: "m03-s5",
      label: "Choose the right class-based exception category and wire IF_T100_MESSAGE texts",
      conceptId: "m03-c5",
    },
  ],
  blurb:
    "Bring aging ABAP up to today's standard so it is cheaper to maintain and ready for the cloud. Covers the obsolete constructs to hunt and their modern replacements, inline declarations with modern Open SQL, the constructor operators worth memorizing, string templates, and the class-based exception hierarchy that Clean ABAP (SAP's official style guide) defaults to.",
  concepts: [
    {
      id: "m03-c1",
      code: "3.1",
      title: "Obsolete language elements to hunt",
      bloom: "A",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §3.1",
        paragraphs: [
          "Your logic is sound — most of modernizing ABAP is learning the modern spelling of things you already do well, not relearning the craft. It is largely a search-and-replace of constructs that are obsolete (or outright forbidden in classes and in Restricted ABAP) for their modern forms. MOVE a TO b becomes the assignment operator b = a; MOVE-CORRESPONDING becomes the constructor CORRESPONDING #( ); and a bare LOOP AT itab. with an implicit header line becomes LOOP AT itab ASSIGNING FIELD-SYMBOL(<fs>), because header lines are obsolete and illegal in classes.",
          "Structural relics go too: OCCURS n WITH HEADER LINE becomes a typed DATA itab TYPE STANDARD TABLE OF ty WITH EMPTY KEY; FORM/PERFORM procedures become class methods; and the TABLES statement (outside dynpros) becomes an explicit local DATA declaration. These are not cosmetic — procedural forms and header lines are genuine Clean Core smells that block a package from going to ABAP Cloud.",
          "Finally, prefer the expressive built-ins: DESCRIBE TABLE itab LINES n becomes n = lines( itab ); the double-negative CHECK NOT .. IS INITIAL becomes a positive IF .. IS NOT INITIAL; and CONCATENATE gives way to string templates. Each swap is shorter, inlinable, and easier to read at the call site.",
        ],
        keyPoints: [
          "MOVE → b = a; MOVE-CORRESPONDING → CORRESPONDING #( ).",
          "LOOP AT itab. (header line) → LOOP AT itab ASSIGNING FIELD-SYMBOL(<fs>).",
          "OCCURS/header lines → typed tables; FORM/PERFORM → methods; drop TABLES outside dynpros.",
          "DESCRIBE TABLE ... LINES → lines( ); CHECK NOT .. IS INITIAL → IF .. IS NOT INITIAL.",
          "CONCATENATE → string templates.",
        ],
        examples: [
          {
            title: "Header line and DESCRIBE",
            variant: "before",
            lang: "ABAP",
            body: "Implicit header line plus DESCRIBE TABLE — obsolete, and the header line will not compile in a class.",
            code: [
              "loop at itab.",
              "  write itab-matnr.",
              "endloop.",
              "describe table itab lines lv_n.",
            ].join("\n"),
          },
          {
            title: "Field symbol and lines( )",
            variant: "after",
            lang: "ABAP",
            body: "An explicit field symbol replaces the header line; lines( ) replaces DESCRIBE and is inlinable.",
            code: [
              "loop at itab assigning field-symbol(<row>).",
              "  out->write( <row>-matnr ).",
              "endloop.",
              "data(lv_n) = lines( itab ).",
            ].join("\n"),
          },
          {
            title: "Double-negative CHECK and CONCATENATE",
            variant: "before",
            lang: "ABAP",
            body: "A double negative plus CONCATENATE — both have clearer modern forms.",
            code: [
              "check not lv_name is initial.",
              "concatenate lv_first lv_last into lv_full",
              "  separated by space.",
            ].join("\n"),
          },
          {
            title: "Positive IF and a string template",
            variant: "after",
            lang: "ABAP",
            body: "A positive condition and an inline template read directly.",
            code: [
              "if lv_name is not initial.",
              "  data(lv_full) = |{ lv_first } { lv_last }|.",
              "endif.",
            ].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "Hunt the obsolete constructs — MOVE, MOVE-CORRESPONDING, header lines, FORM/PERFORM, TABLES, DESCRIBE, double-negative CHECK, CONCATENATE — and swap each for its modern, inlinable equivalent.",
          analogy:
            "It is replacing worn-out hand tools with the modern power-tool equivalents — same job, far less effort and risk.",
        },
        deeper: {
          paragraphs: [
            "These swaps are exactly what tools like ABAP Cleaner automate, and what the ABAP-Cloud language version enforces by refusing to compile header lines, PERFORM, and the TABLES statement. Treating the list as a checklist before pinning a package to Restricted ABAP turns a wall of syntax errors into a planned cleanup.",
          ],
          keyPoints: [
            "Header lines, PERFORM, and TABLES are syntax errors under ABAP for Cloud Development.",
            "ABAP Cleaner can apply most of these mechanically.",
          ],
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "What is the modern replacement for DESCRIBE TABLE itab LINES n?",
            options: {
              A: "n = lines( itab ).",
              B: "n = count( itab ).",
              C: "DESCRIBE FIELD itab INTO n.",
              D: "READ TABLE itab INDEX n.",
            },
            correct: "A",
            explanations: {
              A: "Correct — the built-in lines( ) is shorter, expression-friendly, and inlinable.",
              B: "There is no count( ) built-in for internal-table length.",
              C: "DESCRIBE FIELD inspects a field's type, not a table's row count.",
              D: "READ TABLE ... INDEX accesses a row; it does not return the count.",
            },
            principle:
              "Use the built-in lines( ) instead of DESCRIBE TABLE ... LINES.",
          },
          {
            n: 2,
            question:
              "Why must a bare LOOP AT itab. with an implicit header line be rewritten?",
            options: {
              A: "Because LOOP is slower than WHILE.",
              B: "Because header lines are obsolete and illegal in classes (and Restricted ABAP).",
              C: "Because it always sorts the table first.",
              D: "Because it requires a BINARY SEARCH addition.",
            },
            correct: "B",
            explanations: {
              A: "Performance is not the issue; the construct itself is disallowed in modern contexts.",
              B: "Correct — header lines are obsolete and do not compile in classes or ABAP Cloud, so use ASSIGNING FIELD-SYMBOL(<fs>).",
              C: "LOOP does not sort; the rewrite is about the header line, not ordering.",
              D: "BINARY SEARCH is unrelated to looping over a header line.",
            },
            principle:
              "Header lines are obsolete — loop with an explicit work area or field symbol.",
          },
          {
            n: 3,
            question:
              "Which rewrite removes a double negative as Clean ABAP prefers?",
            options: {
              A: "CHECK NOT lv_x IS INITIAL. → CHECK lv_x IS INITIAL.",
              B: "IF lv_x IS NOT INITIAL. → CHECK NOT lv_x IS INITIAL.",
              C: "CHECK NOT lv_x IS INITIAL. → IF lv_x IS NOT INITIAL.",
              D: "MOVE lv_a TO lv_b. → MOVE-CORRESPONDING lv_a TO lv_b.",
            },
            correct: "C",
            explanations: {
              A: "This inverts the logic — it now passes only when the value IS initial.",
              B: "This goes the wrong way, reintroducing the double negative.",
              C: "Correct — CHECK NOT .. IS INITIAL becomes the positive IF .. IS NOT INITIAL.",
              D: "That is unrelated to the double-negative rewrite (and MOVE-CORRESPONDING is itself obsolete).",
            },
            principle:
              "Prefer the positive IF .. IS NOT INITIAL over CHECK NOT .. IS INITIAL.",
          },
        ],
      },
      exercise: {
        id: "m03-c1-ex",
        lang: "ABAP",
        prompt:
          "The two CHECK statements sit deep in this method and exit it silently — abaplint flags the deep CHECK/EXIT anti-pattern. Refactor to fail-fast guard clauses so the contract is explicit and the happy path stays flat, then re-check until it's clean.",
        flaggedRules: ["exit_or_check"],
        hint: "Replace each `check <cond>.` with `if not <cond>. raise exception type cx_static_check. endif.`",
        successNote:
          "That's the modern form: preconditions fail fast up front and the rest of the method reads as a flat happy path.",
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
          '    " TODO: these CHECKs exit the method silently mid-logic.',
          '    " Replace them with fail-fast guard clauses.',
          "    check iv_customer is not initial.",
          "    check iv_amount > 0.",
          '    " ... posting logic runs only when the input is good ...',
          "  endmethod.",
          "endclass.",
        ].join("\n"),
      },
    },
    {
      id: "m03-c2",
      code: "3.2",
      title: "Inline declarations & modern Open SQL",
      bloom: "A",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §3.2",
        paragraphs: [
          "Clean ABAP wants inline declarations wherever they shorten code without obscuring intent. In Open SQL that means a comma-separated field list and an inline @DATA(...) host variable: SELECT matnr, mtart FROM mara WHERE ... INTO TABLE @DATA(lt_mara). The variable is declared exactly where it is filled, so there is no separate DATA block to keep in sync.",
          "The key insight is that INTO CORRESPONDING FIELDS OF TABLE becomes unnecessary when the inline target mirrors the SELECT list, because the compiler builds the target's structure from the projection itself — the columns line up by position and name by construction. CORRESPONDING was only ever needed to reconcile a hand-declared structure with a different field order; remove the mismatch and you remove the need.",
          "Two syntax details matter against 758: the field list is comma-separated (note the comma after matnr), and host variables in the WHERE and INTO clauses must be escaped with @. These are not optional stylistic flourishes — the modern strict Open SQL syntax requires them.",
        ],
        keyPoints: [
          "Use @DATA(...) to declare the target inline at the point of the SELECT.",
          "Comma-separated field list is required in modern (strict) Open SQL.",
          "Host variables need the @ escape in WHERE and INTO.",
          "Drop INTO CORRESPONDING FIELDS when the inline table mirrors the field list exactly.",
        ],
        examples: [
          {
            title: "Old multi-line DATA + INTO CORRESPONDING",
            variant: "before",
            lang: "ABAP",
            body: "A separate DATA block and INTO CORRESPONDING FIELDS to reconcile a hand-declared table.",
            code: [
              "data: lt_mara type standard table of mara,",
              "      ls_mara type mara.",
              "select matnr mtart from mara",
              "  into corresponding fields of table lt_mara",
              "  where mtart = 'FERT'.",
            ].join("\n"),
          },
          {
            title: "Modern inline + projected list",
            variant: "after",
            lang: "ABAP",
            body: "The inline @DATA target mirrors the comma-separated list, so CORRESPONDING is unnecessary.",
            code: [
              "select matnr, mtart",
              "  from mara",
              "  where mtart = 'FERT'",
              "  into table @data(lt_mara).",
            ].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "Modern Open SQL uses a comma-separated field list and an inline @DATA(...) target, which makes INTO CORRESPONDING FIELDS unnecessary when the table mirrors the list.",
          analogy:
            "Instead of pre-labelling empty boxes and hoping they match, you let the packing list cut the boxes to fit exactly.",
        },
        pitfalls: [
          "Forgetting the comma between fields in the new SELECT list, or the @ escape on host variables.",
          "Keeping INTO CORRESPONDING FIELDS out of habit when the inline target already mirrors the list.",
        ],
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "In modern Open SQL, when can you drop INTO CORRESPONDING FIELDS OF TABLE?",
            options: {
              A: "When the inline @DATA target mirrors the SELECT field list.",
              B: "Only when selecting from a single-column table.",
              C: "Never — CORRESPONDING is always required.",
              D: "Only inside a LOOP.",
            },
            correct: "A",
            explanations: {
              A: "Correct — with an inline target built from the projection, columns align by construction, so CORRESPONDING adds nothing.",
              B: "It applies to any field list, not just single-column tables.",
              C: "CORRESPONDING is exactly what becomes unnecessary with a mirroring inline target.",
              D: "It has nothing to do with being inside a LOOP.",
            },
            principle:
              "An inline target that mirrors the field list removes the need for CORRESPONDING.",
          },
          {
            n: 2,
            question:
              "What does the @ in INTO TABLE @DATA(lt_mara) signify?",
            options: {
              A: "It marks a deprecated syntax to avoid.",
              B: "It forces a BYPASSING BUFFER read.",
              C: "It declares the variable as global.",
              D: "It escapes the ABAP host variable as required by modern strict Open SQL.",
            },
            correct: "D",
            explanations: {
              A: "The @ escape is the modern requirement, not a deprecation marker.",
              B: "The @ has nothing to do with buffering.",
              C: "An inline @DATA(...) declaration is local in scope, not global.",
              D: "Correct — modern strict Open SQL requires host variables to be escaped with @ in WHERE and INTO.",
            },
            principle:
              "Modern Open SQL requires the @ escape on host variables.",
          },
          {
            n: 3,
            question:
              "Which is a required syntax detail of the modern SELECT field list?",
            options: {
              A: "Fields must be tab-separated.",
              B: "Fields must be uppercase.",
              C: "Fields must be comma-separated.",
              D: "Fields must be prefixed with a tilde.",
            },
            correct: "C",
            explanations: {
              A: "Separators are commas, not tabs.",
              B: "Case is not what the strict syntax enforces here.",
              C: "Correct — the strict Open SQL field list is comma-separated (note the comma after matnr).",
              D: "The ~ is the component selector for an alias, not a field-list separator.",
            },
            principle:
              "The modern Open SQL field list is comma-separated.",
          },
        ],
      },
      exercise: {
        id: "m03-c2-ex",
        lang: "ABAP",
        prompt:
          "Modern ABAP drops the verbose CALL METHOD ... EXPORTING form for the functional call obj->meth( ... ) — abaplint's functional_writing rule flags the old form. Rewrite the call functionally, then re-check until it's clean.",
        flaggedRules: ["functional_writing"],
        hint: "Replace `call method me->step exporting iv_x = 1.` with `me->step( iv_x = 1 ).`",
        successNote:
          "The functional call is shorter, composes inline, and is the modern default — CALL METHOD now survives only for a few dynamic forms.",
        starterCode: [
          "class zcl_au_ex_call definition public final create public.",
          "  public section.",
          "    methods run.",
          "    methods step importing !iv_x type i.",
          "endclass.",
          "",
          "class zcl_au_ex_call implementation.",
          "  method run.",
          '    " TODO: CALL METHOD ... EXPORTING is the old call style.',
          '    " Rewrite it as a functional call me->step( ... ).',
          "    call method me->step exporting iv_x = 1.",
          "  endmethod.",
          "  method step.",
          "  endmethod.",
          "endclass.",
        ].join("\n"),
      },
    },
    {
      id: "m03-c3",
      code: "3.3",
      title: "Constructor operators worth memorizing",
      bloom: "A",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §3.3",
        paragraphs: [
          "A handful of constructor operators replace most of the boilerplate of building and transforming data. VALUE builds a structure or table inline; CORRESPONDING maps between structures and accepts a MAPPING addition to bridge differently-named fields; COND is the expression-form if/else and SWITCH the expression-form case; REDUCE folds a table down to a single value with INIT and NEXT.",
          "FILTER selects rows from an internal table by a condition, and FOR .. IN is the table comprehension that builds a new table by iterating an existing one (optionally with a WHERE). Used well, these turn multi-statement loops into a single readable assignment that says what you want, not how to accumulate it.",
          "One sharp edge: FILTER requires the source table to carry a SORTED or HASHED secondary key for the filtered components, or it will not even activate — it raises a syntax error. The right fix is to declare the secondary key on the table (for example WITH NON-UNIQUE SORTED KEY status_idx COMPONENTS status), not to abandon FILTER for a LOOP.",
        ],
        keyPoints: [
          "VALUE builds structures/tables; CORRESPONDING maps them (with optional MAPPING).",
          "COND is expression if/else; SWITCH is expression case; REDUCE folds to one value.",
          "FOR .. IN is a table comprehension; FILTER selects rows by condition.",
          "FILTER needs a SORTED/HASHED secondary key or it raises a syntax error.",
        ],
        examples: [
          {
            title: "VALUE and REDUCE",
            variant: "after",
            lang: "ABAP",
            body: "VALUE builds a table inline; REDUCE folds line amounts into a total in one expression.",
            code: [
              "data(lt_nums) = value int_table( ( 1 ) ( 2 ) ( 3 ) ).",
              "data(lv_total) = reduce i( init s = 0",
              "                           for <l> in lt_lines",
              "                           next s = s + <l>-amount ).",
            ].join("\n"),
          },
          {
            title: "FILTER without a secondary key",
            variant: "before",
            lang: "ABAP",
            body: "This will not activate — FILTER needs a declared secondary key for the filtered component.",
            code: [
              "data lt_items type standard table of ty_item.",
              "data(lt_open) = filter #( lt_items where status = 'OPEN' ).",
            ].join("\n"),
          },
          {
            title: "FILTER with the secondary key declared",
            variant: "after",
            lang: "ABAP",
            body: "Declaring a SORTED secondary key on the source makes FILTER activate.",
            code: [
              "data lt_items type standard table of ty_item",
              "  with non-unique sorted key status_idx components status.",
              "data(lt_open) = filter #( lt_items using key status_idx",
              "                          where status = 'OPEN' ).",
            ].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "Memorize VALUE, CORRESPONDING, COND, SWITCH, REDUCE, FILTER, and FOR..IN — but remember FILTER needs a SORTED or HASHED secondary key or it will not activate.",
          analogy:
            "They are the power verbs of ABAP — say 'build this,' 'map that,' 'fold to a total' in one breath instead of narrating every loop step.",
        },
        pitfalls: [
          "Reaching for FILTER without declaring a secondary key, hitting the syntax error, and falling back to a LOOP instead of just adding the key.",
        ],
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Which constructor operator folds an internal table down to a single value?",
            options: {
              A: "VALUE",
              B: "SWITCH",
              C: "CORRESPONDING",
              D: "REDUCE",
            },
            correct: "D",
            explanations: {
              A: "VALUE builds a structure or table; it does not aggregate to one value.",
              B: "SWITCH is an expression-form case statement, not a fold.",
              C: "CORRESPONDING maps between structures; it does not reduce a table.",
              D: "Correct — REDUCE folds a table to a single value via INIT and NEXT.",
            },
            principle:
              "REDUCE is the fold operator: INIT a result, then accumulate with NEXT.",
          },
          {
            n: 2,
            question:
              "What does FILTER require of its source internal table?",
            options: {
              A: "A SORTED or HASHED secondary key for the filtered components.",
              B: "That the table be empty.",
              C: "A prior CONCATENATE.",
              D: "That it be declared with a header line.",
            },
            correct: "A",
            explanations: {
              A: "Correct — without a matching SORTED/HASHED secondary key, FILTER does not even activate; it is a syntax error.",
              B: "FILTER operates on populated tables; emptiness is not a precondition.",
              C: "CONCATENATE is unrelated to FILTER.",
              D: "Header lines are obsolete and are not what FILTER needs.",
            },
            principle:
              "FILTER needs a declared secondary key, or it raises a syntax error.",
          },
          {
            n: 3,
            question:
              "Which operator maps one structure to another with differently-named fields?",
            options: {
              A: "COND with WHEN.",
              B: "CORRESPONDING with MAPPING.",
              C: "REDUCE with NEXT.",
              D: "FOR .. IN with WHERE.",
            },
            correct: "B",
            explanations: {
              A: "COND chooses a value by condition; it does not map fields between structures.",
              B: "Correct — CORRESPONDING #( ... MAPPING a = x ) bridges differently-named components.",
              C: "REDUCE aggregates; it does not map field names.",
              D: "FOR .. IN builds a table by iteration; the MAPPING addition belongs to CORRESPONDING.",
            },
            principle:
              "CORRESPONDING ... MAPPING reconciles differently-named fields.",
          },
        ],
      },
    },
    {
      id: "m03-c4",
      code: "3.4",
      title: "String templates",
      bloom: "A",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §3.4",
        paragraphs: [
          "String templates — written |...{ var }...| — replace CONCATENATE for assembling text. Literal text sits between the bars, and each { expression } is evaluated and inserted in place, so you read the final string left to right instead of mentally concatenating fragments and separators.",
          "Inside the braces you can attach formatting options that used to require WRITE TO or conversion exits. ALPHA = IN/OUT applies the alpha conversion (leading-zero handling); DATE = ISO and the matching TIME = ISO render ISO-formatted dates and times; NUMBER = USER formats a number per the user's settings; and WIDTH, ALIGN, and PAD control fixed-width, padded, aligned output.",
          "Because the formatting is declarative and type-safe at the point of use, templates remove a whole class of brittle WRITE-based conversions — and they are the Clean ABAP default, where CONCATENATE and WRITE-for-conversion are flagged as obsolete.",
        ],
        keyPoints: [
          "|...{ var }...| inserts evaluated expressions into literal text.",
          "ALPHA = IN/OUT handles alpha (leading-zero) conversion inline.",
          "DATE = ISO / TIME = ISO render ISO date and time; NUMBER = USER formats per user settings.",
          "WIDTH / ALIGN / PAD give fixed-width, aligned, padded output.",
        ],
        examples: [
          {
            title: "CONCATENATE with manual separators",
            variant: "before",
            lang: "ABAP",
            body: "Fragment-by-fragment assembly with explicit SEPARATED BY — hard to read and easy to get spacing wrong.",
            code: [
              "concatenate 'Order' lv_id 'total' lv_total",
              "  into lv_msg separated by space.",
            ].join("\n"),
          },
          {
            title: "String template with formatting",
            variant: "after",
            lang: "ABAP",
            body: "ALPHA = OUT strips leading zeros and NUMBER = USER formats per the user; the result reads in order.",
            code: [
              "data(lv_msg) =",
              "  |Order { lv_id alpha = out } total { lv_total number = user }.|.",
            ].join("\n"),
          },
          {
            title: "ISO date/time and padded width",
            variant: "after",
            lang: "ABAP",
            body: "ISO formatting and a padded, left-aligned fixed width, all inline.",
            code: [
              "data(lv_iso) = |{ sy-datum date = iso } { sy-uzeit time = iso }|.",
              "data(lv_pad) = |{ lv_name width = 20 align = left pad = '.' }|.",
            ].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "String templates |...{ var }...| replace CONCATENATE and format inline with options like ALPHA, DATE = ISO, NUMBER = USER, and WIDTH/ALIGN/PAD.",
          analogy:
            "It is a fill-in-the-blanks sentence — write the text once with slots, and each slot formats and inserts its value.",
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Which formatting option in a string template applies alpha (leading-zero) conversion?",
            options: {
              A: "WIDTH",
              B: "ALPHA = IN / OUT",
              C: "DATE = ISO",
              D: "NUMBER = USER",
            },
            correct: "B",
            explanations: {
              A: "WIDTH sets a fixed output width; it does not do alpha conversion.",
              B: "Correct — ALPHA = IN/OUT performs the leading-zero alpha conversion inline, replacing the old conversion exit.",
              C: "DATE = ISO formats dates, not alpha-numeric padding.",
              D: "NUMBER = USER formats numbers per user settings, not alpha conversion.",
            },
            principle:
              "ALPHA = IN/OUT is the inline replacement for the alpha conversion exit.",
          },
          {
            n: 2,
            question:
              "What replaces CONCATENATE ... SEPARATED BY SPACE in modern ABAP?",
            options: {
              A: "A WRITE TO statement.",
              B: "A MOVE-CORRESPONDING.",
              C: "A string template such as |{ a } { b }|.",
              D: "A FILTER expression.",
            },
            correct: "C",
            explanations: {
              A: "WRITE TO is itself an obsolete conversion approach, not the modern replacement.",
              B: "MOVE-CORRESPONDING maps structure fields; it does not build strings.",
              C: "Correct — a string template assembles the text inline, with the space written literally between the braces.",
              D: "FILTER selects internal-table rows; it does not concatenate text.",
            },
            principle:
              "String templates replace CONCATENATE for assembling text.",
          },
          {
            n: 3,
            question:
              "Which option set gives fixed-width, aligned, padded output in a template?",
            options: {
              A: "WIDTH, ALIGN, PAD",
              B: "DATE, TIME, ZONE",
              C: "INIT, NEXT, FOR",
              D: "USING KEY, WHERE",
            },
            correct: "A",
            explanations: {
              A: "Correct — WIDTH sets the field width, ALIGN positions the value, and PAD supplies the fill character.",
              B: "Those are date/time formatting options, not width/alignment controls.",
              C: "INIT, NEXT, and FOR belong to REDUCE and comprehensions, not templates.",
              D: "USING KEY and WHERE belong to FILTER, not string formatting.",
            },
            principle:
              "WIDTH / ALIGN / PAD control fixed-width formatting in a template.",
          },
        ],
      },
    },
    {
      id: "m03-c5",
      code: "3.5",
      title: "Class-based exceptions",
      bloom: "U",
      lesson: {
        status: "ready",
        notesRef: "clean-core-curriculum §3.5",
        paragraphs: [
          "Clean ABAP uses class-based exceptions exclusively, and the category you inherit from sets the contract. CX_STATIC_CHECK must be declared in a method's signature and the compiler enforces that callers handle or propagate it — this compile-time contract is exactly why it is the Clean ABAP default. CX_DYNAMIC_CHECK need not be declared (the check is at runtime), and CX_NO_CHECK propagates silently with no declaration and no obligation on the caller.",
          "Exception texts come from the IF_T100_MESSAGE interface: implement it on your CX_ class and store a T100 message key so the exception carries a proper, translatable message rather than an ad-hoc string. The constructor pattern wires textid to if_t100_message~t100key, defaulting to the class's default text when none is supplied.",
          "For situations that genuinely cannot happen — a state the surrounding logic has already guaranteed — prefer an ASSERT over a raised exception. An ASSERT documents the invariant and fails fast in test, without forcing every caller to handle a 'can't-happen' case; reserve CX_NO_CHECK for the rare cases where assertion is not appropriate.",
        ],
        keyPoints: [
          "CX_STATIC_CHECK: declared in the signature, compiler-enforced — the Clean ABAP default.",
          "CX_DYNAMIC_CHECK: not declared, checked at runtime.",
          "CX_NO_CHECK: propagates silently, no declaration, no caller obligation.",
          "Implement IF_T100_MESSAGE for proper, translatable exception texts.",
          "Prefer ASSERT for can't-happen invariants over a raised exception.",
        ],
        examples: [
          {
            title: "A static-check exception class",
            variant: "after",
            lang: "ABAP",
            body: "Inheriting from cx_static_check makes the exception compile-enforced; if_t100_message carries the text.",
            code: [
              "class zcx_order_invalid definition",
              "  public",
              "  inheriting from cx_static_check",
              "  create public.",
              "  public section.",
              "    interfaces if_t100_message.",
              "endclass.",
            ].join("\n"),
          },
          {
            title: "ASSERT for a can't-happen invariant",
            variant: "neutral",
            lang: "ABAP",
            body: "When prior logic guarantees a non-empty key, an ASSERT documents the invariant instead of a raised exception every caller must handle.",
            code: ["assert lv_key is not initial."].join("\n"),
          },
        ],
        simplified: {
          oneLiner:
            "Inherit CX_STATIC_CHECK (declared, compiler-enforced — the Clean ABAP default) over CX_DYNAMIC_CHECK or CX_NO_CHECK, use IF_T100_MESSAGE for texts, and prefer ASSERT for can't-happen cases.",
          analogy:
            "CX_STATIC_CHECK is a contract the compiler signs for you; CX_NO_CHECK is an unsigned IOU that may quietly bounce.",
        },
        deeper: {
          paragraphs: [
            "The hierarchy reflects a spectrum of caller obligation: static check forces acknowledgement at compile time, dynamic check defers the safety net to runtime, and no-check opts out entirely. Defaulting to static check pushes errors as far left as possible — the strongest contract — which is the same compile-time-enforcement principle behind Restricted ABAP itself.",
          ],
          keyPoints: [
            "Static check = strongest contract, errors surface at compile time.",
            "Reserve CX_NO_CHECK for truly unrecoverable or can't-happen paths, and even then prefer ASSERT.",
          ],
        },
      },
      quiz: {
        questions: [
          {
            n: 1,
            question:
              "Which exception category is the Clean ABAP default, and why?",
            options: {
              A: "CX_NO_CHECK, because it never needs declaring.",
              B: "CX_DYNAMIC_CHECK, because it is checked only at runtime.",
              C: "CX_STATIC_CHECK, because it is declared and compiler-enforced.",
              D: "CX_ROOT, because it is the superclass of everything.",
            },
            correct: "C",
            explanations: {
              A: "CX_NO_CHECK propagates silently — the weakest contract, not the default.",
              B: "Dynamic check defers enforcement to runtime, a weaker contract than static.",
              C: "Correct — static check must be declared and the compiler enforces handling, giving the strongest, earliest contract.",
              D: "CX_ROOT is the abstract root; you do not raise it as the default category.",
            },
            principle:
              "Clean ABAP defaults to CX_STATIC_CHECK for compile-time enforcement.",
          },
          {
            n: 2,
            question:
              "What is IF_T100_MESSAGE used for on an exception class?",
            options: {
              A: "To disable the exception at runtime.",
              B: "To make the exception propagate silently.",
              C: "To convert it into a CX_NO_CHECK exception.",
              D: "To give the exception a proper, translatable T100 message text.",
            },
            correct: "D",
            explanations: {
              A: "It does not disable anything; it supplies message texts.",
              B: "Silent propagation is a function of the category (CX_NO_CHECK), not of IF_T100_MESSAGE.",
              C: "The interface supplies texts; it does not change the exception's category.",
              D: "Correct — implementing IF_T100_MESSAGE links the exception to a T100 message key for proper, translatable texts.",
            },
            principle:
              "IF_T100_MESSAGE wires translatable T100 texts onto an exception.",
          },
          {
            n: 3,
            question:
              "For a condition the surrounding logic has already guaranteed cannot occur, what does Clean ABAP prefer?",
            options: {
              A: "An ASSERT documenting the invariant.",
              B: "A CX_NO_CHECK exception every caller must catch.",
              C: "A WRITE statement to the list.",
              D: "Silently ignoring it.",
            },
            correct: "A",
            explanations: {
              A: "Correct — an ASSERT documents the invariant and fails fast in test without forcing callers to handle a can't-happen case.",
              B: "CX_NO_CHECK is heavier and is reserved for the rare cases assertion cannot cover; it is not the first choice here.",
              C: "WRITE to a list is obsolete and forbidden in Restricted ABAP.",
              D: "Silently ignoring a violated invariant hides defects rather than surfacing them.",
            },
            principle:
              "Use ASSERT for can't-happen invariants — fail fast, no caller burden.",
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
          "Which pairing correctly modernizes an obsolete construct?",
        options: {
          A: "lines( itab ) → DESCRIBE TABLE itab LINES n.",
          B: "DESCRIBE TABLE itab LINES n → n = lines( itab ).",
          C: "b = a → MOVE a TO b.",
          D: "string template → CONCATENATE.",
        },
        correct: "B",
        explanations: {
          A: "This is backwards — lines( ) is the modern form, not the target of modernization.",
          B: "Correct — DESCRIBE TABLE ... LINES is replaced by the inlinable built-in lines( ).",
          C: "Backwards — MOVE is the obsolete form; b = a is modern.",
          D: "Backwards — CONCATENATE is the obsolete form; the template is modern.",
        },
        principle:
          "Modernize toward the built-ins and operators, not away from them.",
      },
      {
        n: 2,
        question:
          "Why does an inline @DATA(...) target let you drop INTO CORRESPONDING FIELDS?",
        options: {
          A: "Because the target's structure is built from the SELECT list, so columns align by construction.",
          B: "Because CORRESPONDING is forbidden in classes.",
          C: "Because @DATA disables type checking.",
          D: "Because it always selects a single row.",
        },
        correct: "A",
        explanations: {
          A: "Correct — the inline target mirrors the projection, so there is no field-order mismatch for CORRESPONDING to reconcile.",
          B: "CORRESPONDING is not forbidden; it is simply unnecessary here.",
          C: "@DATA does not disable type checking; it infers the type.",
          D: "It works for table selects too; row count is irrelevant.",
        },
        principle:
          "A mirroring inline target removes the field-order mismatch CORRESPONDING existed to fix.",
      },
      {
        n: 3,
        question:
          "FILTER raises a syntax error on your table. What is the correct fix?",
        options: {
          A: "Replace it with a LOOP — FILTER cannot be made to work.",
          B: "Empty the table first.",
          C: "Declare a SORTED or HASHED secondary key for the filtered components.",
          D: "Add a header line to the table.",
        },
        correct: "C",
        explanations: {
          A: "Falling back to a LOOP is the common mistake; FILTER works once the key exists.",
          B: "Emptying the table does not satisfy FILTER's key requirement.",
          C: "Correct — FILTER needs a matching SORTED/HASHED secondary key; declare it and FILTER activates.",
          D: "Header lines are obsolete and are not what FILTER requires.",
        },
        principle:
          "Give FILTER the secondary key it needs rather than abandoning it.",
      },
      {
        n: 4,
        question:
          "Which string-template option formats a date in ISO form?",
        options: {
          A: "ALPHA = OUT",
          B: "DATE = ISO",
          C: "WIDTH = 8",
          D: "NUMBER = USER",
        },
        correct: "B",
        explanations: {
          A: "ALPHA handles leading-zero conversion, not date formatting.",
          B: "Correct — DATE = ISO renders the date in ISO format inline.",
          C: "WIDTH sets a fixed width; it does not format a date.",
          D: "NUMBER = USER formats numbers per user settings, not dates.",
        },
        principle:
          "DATE = ISO is the inline ISO date formatter in a template.",
      },
      {
        n: 5,
        question:
          "Which class-based exception category does Clean ABAP default to?",
        options: {
          A: "CX_NO_CHECK.",
          B: "CX_DYNAMIC_CHECK.",
          C: "CX_ROOT.",
          D: "CX_STATIC_CHECK.",
        },
        correct: "D",
        explanations: {
          A: "CX_NO_CHECK propagates silently — the weakest contract.",
          B: "Dynamic check is enforced only at runtime, weaker than static.",
          C: "CX_ROOT is the abstract root, not a category you default to raising.",
          D: "Correct — static check is declared and compiler-enforced, the strongest and earliest contract.",
        },
        principle:
          "CX_STATIC_CHECK is the Clean ABAP default for compile-time enforcement.",
      },
    ],
  },
};
