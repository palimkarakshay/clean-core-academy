class zcl_au_ex_itab definition
  public
  final
  create public.

  public section.
    "! <p class="shorttext">Remove duplicate rows in place</p>
    "! Sorts first, so the caller can never hit the
    "! "DELETE ADJACENT DUPLICATES on an unsorted table" anti-pattern
    "! (anti-patterns-playbook.md 1.4). Mirrors ZCL_AU_ITAB=>distinct.
    class-methods distinct
      changing
        !ct_table type standard table.

    "! <p class="shorttext">True when the table has at least one row</p>
    "! Reads well inside guard clauses instead of deep IS NOT INITIAL
    "! nesting (anti-patterns-playbook.md 1.7).
    class-methods has_rows
      importing
        !it_table          type any table
      returning
        value(rv_has_rows) type abap_bool.
endclass.


class zcl_au_ex_itab implementation.
  method distinct.
    sort ct_table.
    delete adjacent duplicates from ct_table comparing all fields.
  endmethod.

  method has_rows.
    rv_has_rows = xsdbool( it_table is not initial ).
  endmethod.
endclass.
