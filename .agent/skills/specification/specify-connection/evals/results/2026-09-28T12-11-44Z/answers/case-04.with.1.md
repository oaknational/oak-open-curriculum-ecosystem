I read the relevant skill reference and checked the repo. The working directory has no files, so there's no existing schema, code or tests to build on. There's also no consumer, which means nobody has yet said what "billing" has to do. Below is a draft spec for discussion. Every obligation in it is a **proposal** until someone with authority over billing adopts it.

---

## BILL-01 · revision 0.1 · software component · **proposed, not adopted**

**Purpose:** Turn priced charges for one account and one billing period into an invoice whose amounts are correct.

**Consumers:** None yet. Parties affected downstream are the customers who get invoiced and whoever reconciles revenue.

**Scope (my working choice, not yet confirmed):**
- **Included:** calculating and issuing invoices.
- **Excluded:** taking payment, measuring usage, looking up prices, calculating tax, dunning, and sending or rendering invoices.

"Billing" could mean any of these. Choosing the wrong scope would invalidate everything below.

### Worked cases

- **Success:** account `A1`, period 2026-09-01 to 2026-10-01 (end date excluded), currency EUR, lines `[{sku: seat, qty: 3, unit: 1000}, {sku: addon, qty: 1, unit: 499}]`. The result is invoice `INV-…` with a subtotal of 3499, status `issued`, and a total of 3499 plus the tax figure passed in.
- **Adverse:**
  1. A USD line appears on a EUR invoice.
  2. The quantity is negative.
  3. The same request key is resent with the same payload.
  4. The same request key is resent with a different payload.
  5. Someone tries to change an issued invoice.
  6. The invoice has no lines.
  7. The amount overflows.
  8. The period end is on or before the period start.

### Inputs
- `request_key`: an idempotency key supplied by the caller
- `account_id`
- `period`: half-open, `[start, end)`, in UTC
- `currency`: ISO 4217 code
- `lines[]`: each has `sku`, `quantity` (integer ≥ 0), `unit_amount` (integer, in minor units), and optionally `description`
- `adjustments[]`: signed amounts in minor units, each with a reason
- `tax`: amounts per line or per invoice, supplied from outside the component

### Outputs
- An `Invoice` with `id`, `account_id`, `period`, `currency`, `lines` (each with `amount = qty × unit_amount`), `subtotal`, `adjustments_total`, `tax_total`, `total`, `status`, `issued_at` and `request_key`.

### Errors
All errors are typed and have no side effects. Nothing is persisted when an error is returned.

| Error | Trigger |
| --- | --- |
| `InvalidPeriod` | Case 8 |
| `CurrencyMismatch` | Case 1 |
| `UnsupportedCurrency` | The currency code is not supported |
| `InvalidQuantity` / `InvalidAmount` | Case 2, or a value that isn't an integer |
| `AmountOverflow` | Case 7 |
| `IdempotencyConflict` | Case 4 |
| `InvoiceImmutable` | Case 5 |
| `EmptyInvoice` | Case 6, unless the policy decision below allows empty invoices |

### Invariants
Each of these must hold for every invoice that is returned or stored.
1. **Integer money.** Amounts are integers in minor units. No floats are used anywhere.
2. **One currency.** Every amount on an invoice is in that invoice's currency.
3. **Arithmetic.** `line.amount = qty × unit_amount`. `total = subtotal + adjustments_total + tax_total`. Each sum exactly matches its parts.
4. **Idempotency.** The same `request_key` with the same payload returns the invoice that already exists. The same key with a different payload returns `IdempotencyConflict`. Neither case creates a second invoice.
5. **Immutability.** An `issued` invoice never changes. Corrections are made with a separate credit note (see the unknowns).
6. **Determinism.** The same inputs always produce the same amounts. Timestamps and IDs may differ.
7. **Non-negative total.** An invoice's total is ≥ 0. A negative result is an error, not an invoice.

### Deliberately left open
Consumers must not rely on any of these:
- the ID format
- the order in which errors are reported when an input has several problems
- the storage technology
- line ordering, beyond the order the input was given in

### Evidence plan
- **Invariants 1–3, 6 and 7:** property-based tests. The expected values come from arithmetic written independently of the implementation, not from the implementation itself.
- **Invariant 4:** a concurrency test with duplicate keys running in parallel.
- **Invariant 5:** a test that tries to change an issued invoice.
- **Error table:** one example test for each row.

**Current status:** none of this exists yet.

### Unknowns
| Unknown | Treatment | Why it matters |
|---|---|---|
| What "billing" covers (payment capture? metering?) | **Blocks** implementation | It decides the scope and possibly the whole design |
| Who owns tax and the rounding rule | **Blocks** anything to do with tax | Invariant 3 depends on it |
| Proration within a period | Bounded investigation | It would add another kind of input |
| Credit notes and refunds | Bounded investigation | It decides how invariants 5 and 7 play out in practice |
| Whether empty invoices are allowed | Accepted residual. For now they are rejected; the billing owner can reverse this | Low impact |
| Who has authority to adopt or change this spec | **Blocks** adoption | Without an owner, nothing here is binding |

### Seams, once they exist
The spec will need connection work where it meets:
- the price source (who guarantees that `unit_amount` is right),
- the tax provider,
- whatever consumes invoices (payment or ledger).

None of these can be specified until a consumer exists.

**Readiness:** ready for **discussion only**. It isn't ready for implementation, because of the three blocking unknowns.

---

**What would move this forward:**
1. Confirm or correct the scope.
2. Say who owns tax and rounding.
3. Name one likely first consumer, even a hypothetical one, so the output shape has something to be checked against.

Nothing has been written to disk. If you tell me where specs should live (for example `docs/specs/BILL-01.md`), I'll save it there.
