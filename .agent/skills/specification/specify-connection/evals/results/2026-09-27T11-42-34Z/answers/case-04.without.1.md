The repo is empty, so this contract doesn't have to fit any existing code. Because nothing consumes it yet, I've kept the surface small: it covers what almost any caller will need, and everything that depends on a real caller is listed as an open question at the end. Guessing those now would lock in APIs nobody asked for.

---

# Billing Component: Contract v0

## Responsibility
Turn billable activity into **invoices**, collect **payment** for them, and keep an **append-only record** of every money movement.

**Out of scope for now:** tax calculation, dunning/retry schedules, pricing catalogue management, UI.

## Core types
- **`Money`**: `{ amount: int64 (minor units, e.g. cents), currency: ISO-4217 }`. Never a float.
- **`AccountId`, `InvoiceId`, `PaymentId`**: opaque strings.
- **`IdempotencyKey`**: a string the caller supplies on every call that changes state.
- **`LineItem`**: `{ description, quantity: int, unit_price: Money, amount: Money }`
- **`Invoice`**: `{ id, account_id, currency, lines[], subtotal, total, status, period_start, period_end, created_at, finalized_at? }`
- **`InvoiceStatus`**: `draft → open → paid | void | uncollectible`

## Operations

| Operation | Inputs | Output |
|---|---|---|
| `createInvoice` | account_id, currency, period, lines[], idempotency_key | `Invoice` (draft) |
| `addLine` / `removeLine` | invoice_id, line | updated `Invoice` (draft only) |
| `finalizeInvoice` | invoice_id | `Invoice` (open) |
| `collectPayment` | invoice_id, payment_method_ref, idempotency_key | `Payment { id, invoice_id, amount, status: succeeded\|failed\|pending }` |
| `voidInvoice` | invoice_id, reason | `Invoice` (void) |
| `refund` | payment_id, amount: Money, reason, idempotency_key | `Refund` |
| `getInvoice` / `listInvoices` | id / account_id + filters | `Invoice` / page of `Invoice` |

## Errors
All errors are typed and are never returned as partial success.

- **`ValidationError`**: bad input, such as a negative quantity, an unknown currency, or an empty invoice at finalize.
- **`NotFound`**: the account, invoice or payment doesn't exist.
- **`InvalidStateTransition`**: for example, editing an open invoice or paying a void one.
- **`CurrencyMismatch`**: a line or refund currency differs from the invoice currency.
- **`IdempotencyConflict`**: a key was reused with different parameters.
- **`RefundExceedsPayment`**: the refund amount is greater than what remains refundable.
- **`PaymentDeclined`**: the provider refused the payment. This is an expected outcome and the caller can retry with another method.
- **`ProviderUnavailable`**: a transient failure. It is safe to retry with the same idempotency key.
- **`Conflict`**: a concurrent modification. The caller should re-read and retry.

## Invariants
1. **All money is integer minor units** with an explicit currency. Currencies are never mixed within an invoice, and nothing converts between them implicitly.
2. **Totals add up.** `line.amount = quantity × unit_price` and `total = Σ lines`. Any rounding happens once per line and uses one documented rule.
3. **Finalized means immutable.** Once an invoice is `open`, its lines and amounts never change. Corrections are made by voiding it or by refunding or crediting it.
4. **Status only moves forward.** The graph above is the only set of allowed transitions; `paid`, `void` and `uncollectible` are terminal.
5. **No double charge.** The same idempotency key always returns the same result. An invoice has at most one successful payment covering its total.
6. **Refunds are bounded.** For each payment, Σ refunds ≤ payment amount.
7. **The ledger is append-only.** Every charge, refund and void writes a ledger entry, and entries are never updated or deleted. For any account, balance = Σ ledger entries.
8. **The component is deterministic.** The same inputs produce the same invoice. Clock and ID generation are injected so tests can control them.
9. **No raw card data enters the component.** It only stores `payment_method_ref` tokens.

## Open questions (answer once there's a real consumer)
- **Where do line items come from?** Callers could push them, or the component could pull usage or subscriptions itself. This is the biggest decision.
- **Which payment provider?** This determines whether `pending` or async webhooks are needed.
- **Tax, discounts and credits:** are they needed in v1?
- **Rounding rule and currency set:** is it a single currency or multi-currency?
- **Delivery mechanism:** a library call, a service API, or events such as `invoice.paid`?

---

I haven't written this to a file. I can save it as a spec (for example `docs/billing-contract.md`) or turn it into typed interfaces and a test skeleton for the invariants, whichever you prefer.
