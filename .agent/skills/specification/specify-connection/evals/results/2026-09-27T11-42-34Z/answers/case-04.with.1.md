The repo is empty, so there's nothing existing to build on. "Billing" could also mean several different components. So this is a **draft for discussion, not an adopted contract**. I scoped it to the narrowest reading that can be tested and marked every choice I made. I don't have a file-writing tool in this session, so the spec is below rather than saved to the repo.

---

# BILL-001 · Billing component · rev 0.1 · **Status: proposal (not adopted)**

**Subject kind:** a software component that performs a bounded calculation.
**Proposed scope (my assumption, needs your confirmation):** turn one account's priced charges for one billing period into one **draft invoice**. Taking payment, calculating tax, chasing unpaid invoices, bookkeeping and delivering invoices are **out of scope**.
**Consumers:** none yet. **Affected parties:** the customers being billed, and finance, who own the numbers.

## Why no consumer changes what this spec can say
A consumer is who an interface's promises are made to. Without one, this spec only fixes **meaning**: what an invoice is, when it's correct, and what counts as an error. It deliberately leaves **interface shape** open: transport, sync vs. async, field names, paging, timeouts. Nobody should rely on any shape until a consumer exists and that connection has been specified.

## Worked case (success)
Account `A1`, period `[2026-09-01T00:00Z, 2026-10-01T00:00Z)`, currency EUR, price version `P7`:
- 3 × "seat" at 1 000 minor units → 3 000
- 1 × "storage" at 250 → 250

→ Draft invoice: 2 lines, subtotal **3 250 EUR minor units**, reference to price version `P7`, period echoed back, same idempotency key as the request.

## Failure cases these obligations must handle
1. A charge in USD on an EUR invoice.
2. A charge for a product with no price in the pinned price version.
3. A charge dated outside the period, or a period whose end is not after its start.
4. The same request sent twice, or the same idempotency key sent with a different request.
5. The price catalogue is unreachable partway through.
6. Quantities × prices that overflow the number type.
7. A charge with zero or negative quantity. Semantics unknown, see U4.

## Inputs (what they mean, not their format)
| Input | Meaning |
|---|---|
| `account_id` | The party being billed. Treated as an opaque identifier, never interpreted. |
| `period` | Half-open UTC interval `[start, end)`, with `start < end`. |
| `currency` | ISO 4217 code. Exactly one per invoice. |
| `charges[]` | Product reference, quantity, and the time the charge occurred. |
| `price_version` | An explicit pointer to one immutable price catalogue version. |
| `idempotency_key` | Chosen by the caller. Scoped to `account_id`. |

## Outputs
A draft invoice with: account, period, currency, price version, lines (product, quantity, unit price, line amount), subtotal, and idempotency key. It is either returned **whole or not at all**.

## Obligations (invariants)
| ID | Obligation |
|---|---|
| O1 Money | All amounts are integers in the currency's minor unit, each tagged with its currency. No floating point anywhere in the calculation. |
| O2 Sum | `subtotal == Σ line.amount` exactly, and `line.amount == quantity × unit_price` after the rounding rule (U2). |
| O3 Single currency | Every line uses the invoice currency. Mixing currencies is an error, never a conversion. |
| O4 Determinism | The same inputs and the same `price_version` produce identical output, byte for byte, regardless of time, locale or input order. Line order is set by a stated sort key. |
| O5 Pinned prices | Prices come only from the given `price_version`. Catalogue changes made afterwards never change an invoice already produced. |
| O6 Period | Only charges with `start ≤ occurred_at < end` are accepted. Any other charge fails the whole request. It is never silently dropped. |
| O7 Idempotency | Repeating a key with the same request returns the original result and creates nothing new. Repeating a key with a different request is an error. |
| O8 All or nothing | On any error, no invoice or partial invoice is produced or stored. |
| O9 Immutable once issued | This component never changes an issued invoice. Corrections are new documents (U4). |

## Errors
Every error has a stable code, a flag saying whether retrying can help, and the offending item where there is one:
`INVALID_INPUT` (no retry) · `INVALID_PERIOD` (no retry) · `CURRENCY_MISMATCH` (no retry) · `PRICE_NOT_FOUND` (no retry) · `CHARGE_OUTSIDE_PERIOD` (no retry) · `IDEMPOTENCY_CONFLICT` (no retry) · `AMOUNT_OVERFLOW` (no retry) · `DEPENDENCY_UNAVAILABLE` (retry is safe because of O7 and O8).

## Deliberately left open (nobody may rely on these)
Transport and API shape, storage engine, response time, invoice numbering format, how invoices are displayed or worded.

## Unknowns and how each is handled
| # | Unknown | Treatment |
|---|---|---|
| U1 | Is the scope right? Does "billing" here also mean taking payment, metering usage, or subscriptions? | **Blocks adoption.** Every obligation above rests on this. |
| U2 | Rounding rule and where it's applied (per line or on the total; half-even or half-up) | **Blocks implementation.** It's a finance decision, not an engineering one. |
| U3 | Tax | Excluded for now. **Bounded:** the output must leave room for tax lines without breaking O2. |
| U4 | Credits, negative quantities, proration, credit notes | **Blocks** any use involving refunds or plan changes. Otherwise accepted as out of scope. |
| U5 | Who owns and approves this spec (finance or engineering) | **Blocks adoption.** |
| U6 | Retention and legal requirements for invoices as financial records; handling of personal data | **Bounded investigation** before any storage design. Invoice records may be legally required to be kept for years. |

## Connections to other systems
- **Price catalogue (provider):** must supply immutable, versioned prices. It's a material dependency; specify that connection once the catalogue exists.
- **Consumer:** doesn't exist yet. Nothing to hand off. This is the point at which the spec reopens.
- **Payments and bookkeeping:** out of scope. They're named only so nobody assumes this component covers them.

## How each claim will be checked
- O2, O4, O7 and O8: property-based tests over generated charges, including shuffled input order and retry scenarios.
- Worked examples, including rounding edge cases: **expected values calculated independently by finance**, never taken from the implementation's own output.
- Each error: one test per failure case above.
- Current status: **no evidence yet**. Nothing has been built.

## Readiness
**Ready for discussion only.** Not ready for implementation until U1, U2 and U5 are resolved. Not ready to plug into anything until a consumer exists.

---

**To move this forward I need three things:**
1. **Scope:** confirm or correct U1. Is this only the invoice calculation, or does it cover more?
2. **Rounding:** finance's decision on U2.
3. **Owner:** who has the authority to adopt the spec (U5).

Once a consumer is named, the next step is to specify that connection: which of these guarantees the consumer actually relies on, and what API shape it needs.
