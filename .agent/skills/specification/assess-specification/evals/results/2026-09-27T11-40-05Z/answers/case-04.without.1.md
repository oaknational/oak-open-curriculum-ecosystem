# Login-throttling component: specification, revision 3

This draft can't pass assessment yet. The obligations below are now fully stated. But the new evidence items are tests that don't exist yet, and I can't truthfully say they pass. The evidence section lists what has to be produced and marks each item as outstanding. The specification is ready for reassessment once those tests exist and pass.

Two of the fixes are design choices, not just clarifications. They are marked **[decision]**, and the owner should confirm them before this is adopted.

---

## 1. Obligations

**O1 — Throttling rule.** Every failed attempt for an account is recorded with a timestamp taken from the reference clock (O3). Suppose an attempt arrives for an account at time *now*. If at least five recorded failures for that account have a timestamp *t* where *now − t < 600 s*, the attempt is refused. Refused attempts are not recorded as failures, so they do not extend the refusal.

**O2 — Refusal period.** The refusal lasts until 900 s after the fifth failure that triggered it. An attempt is refused while *now − t₅ < 900 s*. At *now − t₅ = 900 s* or later, attempts are allowed again. While the refusal lasts, every attempt is refused, including ones with correct credentials.

**O3 — Clock. [decision]** All timestamps and all comparisons in O1 and O2 use one clock: the server time of the attempt-count store. The component does not use:
- the application host's wall clock
- any time supplied by the client

So clock skew between application hosts can't change how long the window or the refusal lasts. Both boundaries are exclusive: an attempt at exactly 600 s after a failure no longer counts that failure, and an attempt at exactly 900 s after t₅ is allowed.

**O4 — Store unavailable. [decision: fail closed]** If the store can't be read or written within 200 ms, or returns an error, the login attempt is refused. Specifically:
- a) The response to the user is a "temporarily unavailable" refusal, which is distinct from the throttling refusal. It does not reveal whether the account exists or whether the credentials were correct.
- b) Credentials are not checked. So a store outage can never let an attempt through that O1 or O2 would have refused.
- c) Each such refusal emits a metric and an alert-level log event.
- d) No state is inferred from the failed store call. Once the store is available again, O1 and O2 apply to whatever it holds.

*Consequence the owner must accept:* while the store is down, nobody can log in. The alternative is to fail open, which means brute-force protection is lost during outages. If you choose that instead, O4(b) needs to be rewritten and the evidence for E5 changes.

## 2. Evidence

Each obligation is covered by named evidence. Time-dependent tests drive O3's clock through an injectable clock source, never through real sleeps. Status is as of revision 3.

| ID | Obligation | Evidence required | Status |
|---|---|---|---|
| E1 | O1 | Unit: 4 failures, then an attempt → allowed. 5 failures in the window, then an attempt → refused. | Existing unit tests; confirm they map to this item |
| E2 | O1, O3 | Unit (window boundary): 5 failures, the first at T. Attempt at T+599.999 s → refused. Attempt at T+600 s → allowed, because only 4 failures are still in the window. | **Outstanding** |
| E3 | O2, O3 | Unit (refusal boundary): refusal triggered at t₅. Attempt at t₅+899.999 s → refused. Attempt at t₅+900 s → allowed. Refused attempts during the period don't extend it. | **Outstanding** |
| E4 | O3 | Integration: two application hosts with wall clocks skewed ±5 min against one store. Their throttling decisions are identical and follow store time. | **Outstanding** |
| E5 | O4 | Integration with fault injection against a real store instance. Cover store down, a timeout over 200 ms, and an error response. In each case: the attempt is refused with the "unavailable" response, credentials are not checked (verified with a spy), and the metric and log event are emitted. After the store recovers, O1 and O2 behave as before. | **Outstanding** |
| E6 | O2 | Unit: correct credentials during a refusal → refused. | **Outstanding** |

**Acceptance condition:** the specification is ready for operational reliance when E1–E6 all pass in CI, with the test run linked here. Until then, "the unit tests pass" is evidence for E1 only.

---

**Choices I made that you should check:**
- **Failing closed (O4):** this chooses security over availability during a store outage. I explained the reasoning, but it's your call.
- **Store time as the clock (O3):** this assumes one shared store. If the store is sharded or replicated across regions, O3 needs to name which node's clock is used.
- **Numbers and rules I added:** the 200 ms timeout, exclusive boundaries, and not counting refused attempts all fill gaps the original left open. Change them freely, but update E2, E3 and E5 to match.
- **Left alone:** the assessment didn't raise whether a successful login resets the count, so I haven't added a rule for it. It may come up at reassessment.
