# Is the reliance justified?

**Not as stated.** The two contracts together prove a narrower claim: *retries of a single call from S will not make P process more than one charge.* "A customer is never charged twice" is a stronger claim. The contracts are about requests and keys, while the reliance is about customers and charges, and nothing connects the two.

## Where the composition breaks

1. **One key per retry loop is not one key per purchase.** S's contract only covers retries of one call. If the same purchase reaches S twice, S creates a new key and P charges again. That happens when:
   - the customer double-clicks;
   - S's caller times out and retries;
   - the order is resubmitted;
   - S crashes mid-loop and restarts with a fresh key.

   This is the most likely real-world double charge, and neither contract rules it out.

2. **Deduplication has limits in time and scope.** Real providers keep idempotency keys for a limited window, such as 24 hours. Keys are also usually scoped per merchant account or API credential. If a retry arrives after the window, or goes through a different account or credential, "at most once per key" no longer protects it. For three quick retries this is mostly fine, but it is an unstated assumption.

3. **Other paths to a charge aren't covered.** The contracts say nothing about:
   - a failover to a second provider, which doesn't share P's key store;
   - another service or a manual process that also charges;
   - separate authorize and capture steps, each with its own semantics.

4. **What P does with a reused key is unspecified.** If a retry reuses the key with a different amount or currency, P might reject it, return the old result, or do something else. That doesn't directly cause a double charge, but S's behaviour then depends on something no contract states.

## What would make the reliance justified

It needs a bridging contract that neither party currently provides:

- **One key per charge intent:** each customer charge intent gets exactly one key, fixed or saved durably *before* the first attempt. For example, derive it from the order ID.
- **Every path uses that key:** all retries at every layer, restarts and resubmissions carry it.
- **No other route:** there is no second provider or other route to a charge that bypasses P's deduplication.
- **Long enough window:** P's deduplication window is longer than the longest possible retry or resubmission gap, with the same account and credential scope.

With those conditions added, the claim holds. Without them, the reliance is a composition gap: each contract is valid, but the property you want is about something neither one covers.
