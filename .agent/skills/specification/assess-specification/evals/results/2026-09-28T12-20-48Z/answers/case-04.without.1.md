I've rewritten the specification below. One caveat first: the new evidence section only helps once the tests it describes exist and pass. I can't truthfully state that they do, so I wrote it as a list of required evidence with a status line. Assessment should still fail until those tests are written and their results recorded.

---

## Login throttling — specification (revision 3)

### 1. Behaviour

**1.1 Counting.** A *failed attempt* is a login attempt for an existing or non-existent account identifier where the credential check fails. Attempts refused under 1.3 are not counted and do not extend a lockout. A successful login clears the account's failed-attempt record.

**1.2 Window.** An attempt at time *t* counts toward the threshold at time *now* if `0 ≤ now − t < 600 s`. The window slides, and an attempt exactly 600 s old no longer counts.

**1.3 Lockout.** When a failed attempt brings the count within the window to 5, the account is locked from that attempt's timestamp *L*. Any attempt at time *now* with `now − L < 900 s` is refused without checking the credential. An attempt at exactly `L + 900 s` is processed normally, starting from an empty count.

**1.4 Refusal response.** A refusal returns the same response as a failed credential check, with the same status and body and no lockout indication. This stops an attacker from using the response to find out which accounts exist or are locked.

### 2. Clock

**2.1** All attempt and lockout timestamps come from one authoritative clock: the attempt-count store's server time, read atomically with the write (for example Redis `TIME` inside the same script). Application-node clocks are never used for window or lockout arithmetic.

**2.2** Timestamps have at least millisecond resolution. The window and lockout comparisons in 1.2 and 1.3 use that resolution.

**2.3** If the store's clock steps backwards, an elapsed time that computes as negative is treated as 0. This errs toward keeping attempts counted and lockouts in force.

### 3. Store failure behaviour

**3.1** The store is *unavailable* if a read or write fails or takes longer than 200 ms.

**3.2** While the store is unavailable, the component **fails closed per account, fails open globally**:
- Each application node keeps an in-memory fallback counter per account, timed by its own monotonic clock and following the rules in sections 1 and 2.
- Accounts over the threshold in the fallback counter are refused as in 1.3.
- Other accounts proceed to the credential check.

**3.3** Every store failure increments a metric (`login_throttle_store_unavailable_total`). An alert fires if the store stays unavailable for more than 60 s.

**3.4** When the store recovers, fallback counts are discarded and are not merged back. Accepted risk: during an outage, an attacker spread across N nodes gets up to 5·N attempts per window.

> **Decision required by the spec owner:** 3.2 is my recommendation, not something the original spec settled. The alternatives are pure fail-closed (a store outage becomes a login outage for everyone) and pure fail-open (no throttling during an outage). Whichever is chosen, it has to be written down explicitly and have a test.

### 4. Evidence

The tests below use an injected clock and a store double that can inject faults. Each one must exist, pass in CI, and be linked by its test ID.

| ID | Obligation | Assertion |
|---|---|---|
| E1 | 1.1, 1.3 | Attempts 1–4 fail normally. Attempt 5 fails and sets the lockout. Attempt 6 is refused without a credential check (the credential checker is verified as not called). |
| E2 | 1.2 | Five failures where the first is at T and the fifth at T+599.999 s: locked. |
| E3 | 1.2 | Same attempts with the fifth at T+600.000 s: not locked, because the first has left the window. |
| E4 | 1.3 | Attempt at L+899.999 s is refused. Attempt at L+900.000 s reaches the credential check. |
| E5 | 1.1 | Refused attempts during a lockout neither count nor extend it: the attempt at L+900 s is still processed. |
| E6 | 1.1 | A success after 4 failures clears the count. The next 4 failures do not lock. |
| E7 | 1.4 | A refused response is byte-identical to a failed-credential response. |
| E8 | 2.1 | App-node clocks skewed ±1 h from the store clock have no effect on E2–E4 outcomes. |
| E9 | 2.3 | A backwards step in the store clock does not unlock an account or drop counted attempts. |
| E10 | 3.1, 3.2 | Store raises an error or takes 201 ms: the fallback counter takes over. An account over the threshold is refused and other accounts proceed. |
| E11 | 3.3 | A store failure increments the metric. An integration or alert-rule test confirms the 60 s alert fires. |
| E12 | 3.4 | After recovery, the store's state governs and fallback counts are discarded. |

**Status:** not yet satisfied. Section 3's policy needs owner sign-off, and E1–E12 have to be implemented and passing with a CI run linked here. The earlier statement "the unit tests pass" is withdrawn as evidence, because those tests don't cover the window boundary or store failure.

---

The three assessment findings are handled like this:
- **Failure behaviour:** section 3, which needs the owner's decision.
- **Clock:** section 2.
- **Test coverage:** E2–E4 and E8–E12 in section 4.

I also defined several things the original left open that the boundary tests depend on:
- whether the window is inclusive or exclusive at 600 s,
- when the lockout starts,
- whether refused attempts count,
- whether a successful login resets the count,
- what a refusal response looks like.

If the existing code behaves differently on any of these, tell me which and I'll change the spec to match, unless you'd rather change the code.
