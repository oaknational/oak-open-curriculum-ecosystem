The repo is empty, so there's no existing code or conventions to build on. There's also no consumer, which is the bigger issue. A contract written without a caller tends to guess wrong about what goes in and comes out. I'd split the spec into two parts:

- **Invariants:** true for any billing system, so we can commit to these now.
- **Inputs, outputs and errors:** a minimal draft that stays open until the first consumer shows up.

## Invariants (commit now)

1. **Money is an integer in minor units plus an ISO 4217 currency code.** No floats. For example, `{amount: 1999, currency: "USD"}`.
2. **One currency per invoice.** Every line item must match the invoice's currency. The component never converts currencies silently.
3. **Totals are derived, never stored independently.** `total = sum(line.amount) + tax - discounts`, and it's recomputed and checked whenever the invoice is finalized.
4. **Finalized invoices can't be changed.** To fix one, you issue a credit note or void it. You never edit it.
5. **Every mutating call is idempotent.** It requires an `idempotency_key`. Replaying the same key with the same payload returns the original result. Replaying it with a different payload is an error.
6. **An append-only ledger.** Balances are always derived from ledger entries, and entries are never updated or deleted.
7. **One-way invoice states:** `draft → open → paid | void | uncollectible`. No transition goes backwards.
8. **Rounding happens once, at line level, with a documented rule** (for example, half-even). It never happens on the aggregated total.

## Inputs (draft)

| Operation | Input |
|---|---|
| `create_invoice` | `account_id`, `currency`, `period_start`/`period_end`, `idempotency_key` |
| `add_line_item` | `invoice_id`, `description`, `quantity`, `unit_amount`, optional `metadata` |
| `finalize_invoice` | `invoice_id` |
| `record_payment` | `invoice_id`, `amount`, `external_ref`, `idempotency_key` |
| `void_invoice` | `invoice_id`, `reason` |
| `get_invoice` / `get_balance` | `invoice_id` / `account_id` |

## Outputs (draft)

- **`Invoice`:** `id`, `account_id`, `status`, `currency`, `lines[]`, `subtotal`, `tax`, `total`, `amount_paid`, `amount_due`, timestamps.
- **`LedgerEntry`:** `id`, `account_id`, `amount` (signed), `currency`, `source` (invoice or payment ID), `created_at`.
- **`Balance`:** `account_id`, `currency`, `amount`.

## Errors (draft)

These are typed errors that aren't retryable, apart from the last one:

- `InvalidAmount`: negative or zero where that isn't allowed, or too many decimal places for the currency.
- `CurrencyMismatch`
- `InvalidStateTransition`: for example, adding a line to a finalized invoice.
- `IdempotencyConflict`: same key, different payload.
- `NotFound`: unknown account or invoice.
- `Overpayment`: or accept it as account credit (see open question 3).
- `TransientFailure`: the only retryable error, and always safe to retry because of idempotency.

## Open questions only a consumer can answer

1. **What is being billed?** Subscriptions, usage-based metering or one-off charges each change the input shape a lot.
2. **Does this component collect payments** through a payment provider, or only record them?
3. **What happens on overpayment?** Reject it, or keep it as credit.
4. **Tax:** calculated here, passed in, or out of scope?
5. **Is the interface sync or async?** Does it need to emit events such as `invoice.paid`?
6. **Multi-currency accounts:** does an account need a separate balance per currency?

My recommendation is to lock in the invariants now and treat everything else as provisional. Only implement the operations the first consumer actually calls, rather than building the whole draft surface in advance.

I can save this as `docs/billing-contract.md`, or turn the invariants into property-based tests, if either would help.
