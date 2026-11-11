**No, not as stated.** The two contracts together guarantee something narrower than what you want to rely on.

- **What they guarantee:** one retry sequence from S produces at most one charge. S keeps the key the same within that sequence, and P de-duplicates on the key.
- **What you want to rely on:** a customer is never charged twice. That is about the purchase, not about one call from S. The distance between those two is where the counterexamples below live.

## Seam contract (S depends on P)

| | |
|---|---|
| **P supplies** | A request is processed at most once per idempotency key. P's contract doesn't say how long a key is remembered, which account or credentials it's scoped to, what happens when the same key arrives with a different amount or while the first request is still running, or what a repeated request gets back. Each of these gaps is a finding. |
| **S supplies** | Every retry of a call carries the same key, with at most three retries. S's contract doesn't say where the key comes from, whether it survives S restarting, or what S does when it gives up. |
| **Reliance needs** | One charge per purchase, across every path that can lead to a charge request. |

## Counterexamples (both contracts hold, the customer is charged twice)

1. **S crashes and restarts.** S sends the charge, P processes it, then S dies before getting the response. When S comes back it creates a new key for the same order and charges again. The same key was only promised within one retry sequence.
2. **The request reaches S twice.** A double-click, a queue delivering the same message again, or a client retrying against S all start new calls with new keys. P sees two different keys and charges twice.
3. **Retrying after P forgets the key.** If P only remembers keys for a limited time (24 hours is common) and a retry or replayed message arrives later, P treats it as new.
4. **Giving up is treated as "not charged."** The first attempt succeeds but the response times out. The retries get "in progress" or conflict errors, and S stops after three and reports failure. The customer or support then tries again with a new key, and the customer is charged twice. This isn't a violation by P; it's what S does when it runs out of retries.
5. **Key scope doesn't match.** S sends requests through different P accounts or API credentials, or fails over to a second provider. P's de-duplication doesn't reach across those.
6. **Different amount under the same key.** If S rebuilds the request on retry and the amount changes, P's behaviour isn't specified. It might reject, process, or return the old result, depending on P.

## Status

**Holds only under these conditions:**
- The key is derived from the purchase itself (for example, the order ID) and saved before the first attempt. It is reused after restarts and when the same request reaches S again.
- All retries and replays happen within P's key-retention window.
- Every attempt carries the same request details.
- When S runs out of retries without knowing the outcome, it checks with P (looks up the key's result) rather than reporting failure or starting a new charge.
- Every request goes through one P account and key namespace.

## Missing evidence

- P's documentation on how long keys are kept, what they're scoped to, what a repeated request returns, and how concurrent or mismatched requests are handled.
- The code in S that generates keys.
- Tests that kill S after sending but before it gets the response, retry while the first request is still running, and replay a message after the retention window.

## What each side needs to add

- **S:** Tie the key to the purchase, save it before the first attempt, reuse it across restarts and duplicate requests, and treat "gave up, outcome unknown" as something to check, not as failure. S's contract currently says only "the same key per retry," and that is the main gap.
- **P:** State the retention window, the key scope, and the behaviour for repeated, concurrent and mismatched requests.
- **Whoever owns the purchase flow upstream:** Ensure one purchase maps to one key before the request reaches S. Neither contract covers this.

If S's contract is strengthened as above and P confirms the missing semantics, you can rely on it within P's retention window. Beyond that window, only a reconciliation process can support it.
