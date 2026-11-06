I've written revision 3 below. It will not pass an operational assessment yet, and rewriting the text can't change that. Two things are still missing:

1. **What happens when the store fails is a security-versus-availability decision, and it isn't mine to make.** I've drafted a recommended behaviour, but it needs sign-off from whoever owns login security.
2. **The evidence doesn't exist yet.** The tests the findings ask for have not been written or run. Replacing "the unit tests pass" with wording that implies they cover the boundary and store failure would be a false assurance. So the evidence section is now a plan, and each item is marked as not done.

---

## Login throttling: specification, revision 3

**Subject:** the login-throttling component. **Intended use:** operation. **Supersedes:** revision 2.

### Terms
- **Failed attempt:** a login request for an existing account whose credentials were checked and rejected. Refused requests (T3) are not failed attempts.
- **Store:** the shared store of failed-attempt timestamps and lockout expiry times.
- **Store time:** the current time as reported by the store. All window and lockout times use store time, never the application host's clock (so skew between hosts can't move the window).
- **Store unavailable:** a store read or write that errors or takes longer than *[timeout, to be set by the owner; proposed 200 ms]*.

### Obligations
- **T1 – Counting.** For each failed attempt, the component must record it with the current store time, in a single atomic operation, before the login response is returned.
- **T2 – Window.** An account locks when it has 5 failed attempts with timestamps *t* such that `now − t < 600 s` (a sliding window, measured in store time). An attempt exactly 600 s old no longer counts.
- **T3 – Refusal.** Once an account locks at time *L* (the store time of the fifth failure), every login request for that account while `now < L + 900 s` must be refused without checking credentials. The refusal response must be the same whatever password was sent. Refused requests don't extend the lockout. At `now ≥ L + 900 s`, requests are handled normally.
- **T4 – Store unavailable.** *(Pending decision: see U1.)* Recommended draft: if the store is unavailable, the component must keep enforcing T2 and T3 using a local in-memory counter on each instance, log each degraded decision, and raise an operational alert within 60 s. It must never let an attempt through unthrottled without logging and alerting.
- **T5 – Recovery.** When the store comes back, T1 to T3 resume using store data. Failures counted only in local memory during the outage are not merged into the store (an accepted limitation; see U2).

### Deliberately unspecified
- Whether a successful login resets the count. No consumer may rely on it either way.
- How unknown accounts are handled. That belongs to the account-enumeration spec, not this one.

### Unresolved
- **U1 – blocks operational use.** The store-failure policy (T4) needs acceptance from the login-security owner. The alternatives are:
  - **Fail-closed:** refuse all logins while the store is down. Safe against guessing, but a store outage becomes a full login outage.
  - **Fail-open:** skip throttling while the store is down. Logins keep working, but password guessing is unthrottled during the outage.
  - **Local fallback (recommended):** as drafted in T4.
- **U2 – accepted limitation, if the owner agrees.** With the local fallback, an attacker spreading requests across *n* instances gets up to 5·*n* attempts per window during an outage.
- **U3 – bounded investigation.** Set the store timeout from measured store latency.

### Evidence (plan and status)
Expected results come from T1 to T5 above, not from the implementation. Tests use an injected store clock and a fault-injecting fake store.

| # | Claim | Method | Status |
|---|---|---|---|
| E1 | T2 boundary | Unit test: 5 failures, then check lock state at 599.999 s and 600.000 s from the first failure | Not written |
| E2 | T3 boundary | Unit test: refused at `L + 899.999 s`, normal handling at `L + 900 s`; refusals don't extend the lockout | Not written |
| E3 | T3 no credential check | Unit test: a locked account with the correct password is refused the same way as with a wrong one; the credential checker is never called | Not written |
| E4 | T4 degraded mode | Unit test: the store errors and, separately, times out; T2 and T3 still hold using the local counter; a log line and an alert are produced | Not written (depends on U1) |
| E5 | T1 atomicity | Integration test against the real store: concurrent failures still give an exact count; host clock skewed ±5 min changes nothing | Not written |
| E6 | T4 alert and T5 recovery | Operational drill in staging: stop the store, see the alert within 60 s, restart it, see normal throttling resume | Not done |
| — | Existing unit tests | Pass, but cover only the basic lock-after-5 path | Held; doesn't cover T2 to T5 |

---

**What changed from revision 2:**
- The one sentence was split into T1 to T3, and the window, clock and refusal are now precisely defined.
- T4, T5 and the unresolved items U1 to U3 are new.
- The evidence claim "unit tests pass" was replaced with the plan above; its truthful status is kept as the last row.

**Two definitions I chose that the assessment didn't dictate:** the window slides (rather than resetting at fixed intervals), and a failure exactly 600 s old stops counting. If you intended otherwise, tell me and I'll change T2 and E1.

**Next steps:** get U1 accepted, write E1 to E5, then run the drill (E6). After that, send revision 3 back for operational assessment. Until then it is ready for discussion and implementation, not for operation.
