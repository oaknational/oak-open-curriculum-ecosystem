**No, not as stated.** The two contracts together prove something narrower than "a customer is never charged twice."

## What the contracts actually give you

P charges at most once per key, and S's retries of one call reuse that call's key. Together that means **one S call, retried up to three times, produces at most one charge.**

That's a guarantee about a *retry sequence*. The reliance is about a *customer*. The gap between the two is where double charges happen.

## Missing premises

1. **One key per logical charge, not per call.** S's contract only says retries share a key. It doesn't say every attempt at the same purchase uses the same key. A second key, and so a second charge, appears when:
   - the user double-clicks or resubmits,
   - S crashes mid-retry and a restarted instance or another replica picks up the job,
   - S gives up after three tries and a higher layer (queue redelivery, the client, an ops re-run) retries.

   You need the key to come from a durable business identifier, such as an order or payment-intent ID stored before the first call. It shouldn't be generated per invocation.

2. **Retention window.** Providers typically keep idempotency keys for a limited time, often around 24 hours. A retry or replay after the key expires is treated as new. "At most once per key" only holds while P still remembers the key.

3. **Key scope at P.** Dedup may be per API account, environment, region or merchant. If S can reach P through more than one of these, the same key isn't the same key to P.

4. **Same key with a different payload.** If a retry rebuilds the request with a changed amount or currency, P might reject it, return the original result, or process it. The contract doesn't say which.

5. **"Processed" vs "charged."** P promises at-most-once processing of *requests*. The customer cares about *money moved*. Other paths can move money outside that promise: separate auth and capture, P's own internal retries to the card network, or a later manual or reconciliation charge.

6. **Scope of the claim.** "Never charged twice" has to mean "never charged twice *for the same purchase*." Two real orders should produce two charges. Defining that equivalence is S's job, and it's exactly point 1.

## A related risk (not double-charging)

P may answer an in-flight duplicate with a conflict error. S could then mark the order failed while the first request actually succeeds. The customer is charged once but gets no order, which also violates what the business probably intends.

## What would make the reliance justified

Add these as explicit contracts:
- **S:** the key is derived from a durable purchase ID that exists before any call, and every path that can charge for that purchase (retries, restarts, replicas, redeliveries, manual re-runs) uses that ID.
- **S:** all retries and replays for a purchase finish within P's key retention window, or anything later is reconciled against P first (look up the charge by purchase ID) instead of charging blindly.
- **S:** the request payload is fixed per key.
- **P:** dedup covers the account and endpoint S uses, and the key covers the whole money movement, not just request intake.

With those in place the composition holds. Without them, each contract can be correct on its own and the system can still charge twice. The two contracts were never about the same unit: one is scoped to a key, the other to a retry loop, and the reliance is scoped to a purchase.
