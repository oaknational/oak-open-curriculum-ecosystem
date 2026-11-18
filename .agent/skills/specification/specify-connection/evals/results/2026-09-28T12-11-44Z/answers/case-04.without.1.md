The repo is empty, so I have nothing to build on. And since there's no consumer yet, some of the contract can't be settled now. Below is a minimal core that holds for any billing consumer. The consumer-dependent choices are listed at the end as open decisions instead of guesses.

# Billing Component: Contract v0

## Scope
It turns billable usage and charges into **invoices**, records **payments and credits** against them, and reports **balances**. It does not move money itself. Payment execution sits behind a `PaymentGateway` port so the provider can be chosen later.

## Core types
- **Money**: `{ amount_minor: int64, currency: ISO-4217 }`. Integer minor units only, never floats.
- **Account**: the party being billed. It has an `id` and a fixed `currency`.
- **LineItem**: `{ description, quantity: decimal, unit_price: Money, tax_code?, period?: [start, end) }`
- **Invoice**: `{ id, account_id, status, line_items[], subtotal, tax, total, amount_paid, amount_due, issued_at?, due_at? }`
- **Status**: `draft → open → paid | void | uncollectible`

## Operations (inputs → outputs)

| Operation | Input | Output | Errors |
|---|---|---|---|
| `createDraft` | account_id, line_items[], idempotency_key | Invoice(draft) | AccountNotFound, CurrencyMismatch, InvalidLineItem |
| `addLineItem` / `removeLineItem` | invoice_id, item | Invoice(draft) | NotFound, InvoiceNotDraft, CurrencyMismatch |
| `finalize` | invoice_id, due_at | Invoice(open), totals frozen | NotFound, InvoiceNotDraft, EmptyInvoice |
| `recordPayment` | invoice_id, Money, external_ref, idempotency_key | Payment + updated Invoice | NotFound, InvoiceNotOpen, CurrencyMismatch, Overpayment |
| `applyCredit` | invoice_id, Money, reason | CreditNote + updated Invoice | NotFound, InvoiceNotOpen, CreditExceedsDue |
| `void` | invoice_id, reason | Invoice(void) | NotFound, InvoiceHasPayments, InvalidTransition |
| `markUncollectible` | invoice_id | Invoice(uncollectible) | NotFound, InvalidTransition |
| `getInvoice` / `listInvoices` | id / account_id + filters | Invoice / page of Invoices | NotFound |
| `getBalance` | account_id | Money (sum of amount_due over open invoices) | AccountNotFound |

**Error model:** errors are typed values, not strings. Every error carries a stable `code`, a `retryable: bool` flag and the offending ids. `ProviderUnavailable` and `ConcurrencyConflict` are the only retryable errors. All the others are caller bugs or business rejections.

## Invariants (these must always hold and should be tested as properties)
1. **Arithmetic:** `total = subtotal + tax`, `subtotal = Σ round(quantity × unit_price)`, and `amount_due = total − amount_paid − credits`. Rounding happens once per line item, using one documented mode (e.g. half-even).
2. **Non-negative:** `amount_due ≥ 0`. Overpayment is rejected, never stored as a negative due.
3. **Single currency:** every Money value on an invoice matches the account's currency. No implicit FX conversion.
4. **Immutability after finalize:** an invoice that is not in draft never changes its line items or totals. Corrections are made with credit notes or by voiding and reissuing, never by editing.
5. **Legal transitions only:** paid, void and uncollectible are terminal states. `paid` is reached exactly when `amount_due == 0` on an open invoice.
6. **Idempotency:** repeating a mutating call with the same idempotency key returns the original result and has no second effect. Reusing a key with a different payload is an error.
7. **Append-only history:** payments and credit notes are never deleted or edited. The balance can always be recomputed from the event history alone.
8. **Unique, gapless numbering:** invoice numbers are unique and sequential per issuer once finalized. Many jurisdictions require this legally.
9. **Determinism:** the same inputs give the same totals. Time comes from an injected clock, never from wall time inside the calculations.

## Open decisions (these need a consumer before they can be answered)
- **Pricing model:** flat, per-seat, metered or tiered. This decides whether the component computes line items or just accepts them. For now v0 accepts precomputed line items.
- **Tax:** calculated here, delegated to an external service, or passed in by the caller.
- **Subscriptions and proration:** in scope, or handled by a separate component that calls this one.
- **Interface shape:** in-process library, HTTP/gRPC service, or event-driven.
- **Payment flow:** synchronous charge vs. async webhooks, and partial payments vs. full payments only.
- **Multi-currency accounts** and refunds (refunds after `paid` are left out of v0 on purpose).

My recommendation: freeze only the types and invariants now, and treat the operation list as provisional until a real consumer exists. Contracts written without a consumer tend to guess the interface shape and pricing model wrong. The invariants will be needed whatever the consumer turns out to be.

I can save this as `docs/billing-contract.md`, or turn the invariants into property-based tests, if either would help.
