I couldn't find anything to build on. This repository has no files and no commits, so there's no code, README or design note about billing. What follows is a first-draft spec. The obligations are ones any billing component needs; anything that depends on your business is marked **[decide]**.

Because there's no consumer yet, I've specified what the component guarantees rather than a shape tuned to one caller. Real consumers should still be checked against it once they exist.

---

# Billing Component: Draft Specification v0

## 1. Responsibility and scope

**It owns:** turning billable facts (subscriptions, usage, one-off charges) into immutable invoices with correct amounts, and recording what has been paid against them.

**It does not own [decide]:** running payment processors, tax rules (it calls a tax provider), customer identity, product catalogue authoring, dunning emails, or revenue recognition.

## 2. Inputs

| Operation | Required inputs | Notes |
|---|---|---|
| `recordUsage` | `accountId`, `meterId`, `quantity` (non-negative decimal), `occurredAt`, `idempotencyKey` | Usage that arrives late is accepted until the period closes. After that it goes to the next period **[decide]** |
| `addCharge` | `accountId`, `amount` (Money), `description`, `idempotencyKey` | One-off charge or credit |
| `setSubscription` | `accountId`, `planId`, `effectiveAt`, `idempotencyKey` | Proration policy **[decide]** |
| `closePeriod` / `issueInvoice` | `accountId`, `periodEnd`, `idempotencyKey` | Produces one invoice |
| `recordPayment` | `invoiceId`, `amount` (Money), `externalRef`, `idempotencyKey` | Reported by the payment side |
| `voidInvoice` / `issueCreditNote` | `invoiceId`, `reason`, `idempotencyKey` | The only ways to correct an issued invoice |
| Queries | `getInvoice`, `listInvoices(accountId, range)`, `getBalance(accountId)` | Read-only |

**Money** is an integer count of minor units plus an ISO 4217 currency, e.g. `{amountMinor: 1999, currency: "EUR"}`. Floating point is never used for money.

**Time:** all timestamps are UTC instants. Billing periods are half-open intervals `[start, end)`.

## 3. Outputs

- **Invoice:** `invoiceId`, `accountId`, `currency`, `period`, `lineItems[]`, `subtotal`, `tax[]`, `total`, `amountPaid`, `amountDue`, `status` (`draft | issued | paid | void | uncollectible`), `issuedAt`, and a stable, gapless `invoiceNumber` **[decide: is gapless numbering legally required?]**
- **Line item:** its source reference (usage aggregate, subscription, or charge), quantity, unit price, amount, and period.
- **Events** (at-least-once delivery, each with an `eventId` for deduplication): `InvoiceIssued`, `InvoicePaid`, `InvoiceVoided`, `CreditNoteIssued`, `PaymentRecorded`.
- **Balance:** the account's outstanding amount per currency.

## 4. Errors

Every error is typed and says whether retrying can help.

| Error | When | Retryable |
|---|---|---|
| `ValidationError` | Malformed input, negative quantity, unknown currency | No |
| `NotFound` | Unknown account, plan, meter or invoice | No |
| `CurrencyMismatch` | Charge or payment currency differs from the invoice or account currency | No |
| `IdempotencyConflict` | Same key reused with a different payload | No |
| `InvalidStateTransition` | For example, paying a voided invoice or editing an issued one | No |
| `PeriodClosed` | Usage arrives for a period that has been finalized (if the policy is "reject") | No |
| `Overpayment` | Payment exceeds amount due (or record it as account credit **[decide]**) | No |
| `DependencyUnavailable` | Tax provider or storage is unavailable | Yes |
| `ConcurrencyConflict` | An optimistic-lock collision | Yes |

No failure may leave a partial result. Each operation either commits in full or leaves no trace.

## 5. Invariants

**Arithmetic**
1. `total = subtotal + Σtax`, and `subtotal = Σ lineItem.amount`, exactly, in minor units.
2. `amountDue = total − amountPaid` and `amountDue ≥ 0`, unless overpayment becomes credit **[decide]**.
3. All amounts on one invoice share one currency. There is no implicit FX conversion.
4. Rounding happens once per line item using a documented mode (e.g. half-even), never on intermediate sums **[decide]**.

**Immutability and history**

5. An issued invoice is never modified. It can only be corrected by voiding it or issuing a credit note, and both leave the original readable.
6. Each billable fact (usage record, charge, subscription interval) is billed on **at most one** non-void invoice. Nothing is billed twice.
7. Every billable fact whose period has closed is eventually billed on exactly one invoice. Nothing is dropped.
8. Every line item traces back to the source facts that produced it.

**State**

9. Status transitions only move forward: `draft → issued → {paid, void, uncollectible}`. `paid` and `void` are terminal.
10. `status = paid` exactly when `amountDue = 0` on an issued invoice.

**Idempotency and concurrency**

11. Repeating an operation with the same idempotency key and payload returns the original result and has no further effect.
12. Concurrent writes to the same account cannot violate invariants 1–10. The account is serialized per account or uses optimistic locking.

**Determinism**

13. Given the same facts, prices and tax results, invoice generation produces the same invoice. Prices and tax rates are snapshotted at issue time, so later catalogue changes never alter issued invoices.

## 6. Open decisions that block implementation

1. Which currencies are supported, and is each account limited to one currency?
2. Proration and plan-change policy.
3. Late usage: bill it in the next period or reject it?
4. Overpayment: reject it or keep it as account credit?
5. Tax: which provider, and what to do when it's down (block issuing, or issue as a draft)?
6. Jurisdiction rules for invoice numbering and how long invoices must be retained.
7. Will this be an in-process library, a service API, or event-driven?

---

Answering the decisions in section 6 would let me tighten this into a final spec. I can also write it into the repo, for example as `docs/billing-spec.md`, or turn the invariants into property-based test stubs, so the first implementation is checked against them.
