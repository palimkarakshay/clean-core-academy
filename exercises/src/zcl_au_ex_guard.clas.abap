class zcl_au_ex_guard definition
  public
  final
  create public.

  public section.
    types ty_amount type p length 13 decimals 2.

    "! <p class="shorttext">Raise unless the condition holds</p>
    "! Fail-fast guard clause -- turns bad caller input into a clear
    "! exception instead of a silent CHECK (anti-patterns-playbook.md
    "! 1.7). Mirrors ZCL_AU_GUARD=>that from the reference repo.
    class-methods that
      importing
        !iv_condition type abap_bool
        !iv_message   type string
      raising
        cx_static_check.

    "! <p class="shorttext">Worked "after": guard-first invoice post</p>
    "! Preconditions are checked at the top, so the rest of the method
    "! reads as a flat happy path -- no staircase of nested IFs.
    class-methods post_invoice
      importing
        !iv_customer type string
        !iv_amount   type ty_amount
      raising
        cx_static_check.
endclass.


class zcl_au_ex_guard implementation.
  method that.
    if iv_condition = abap_false.
      raise exception type cx_static_check.
    endif.
  endmethod.

  method post_invoice.
    that( iv_condition = xsdbool( iv_customer is not initial )
          iv_message   = `customer must not be initial` ).
    that( iv_condition = xsdbool( iv_amount > 0 )
          iv_message   = `amount must be positive` ).
    " inputs are known-good from here -- the happy path stays flat
  endmethod.
endclass.
