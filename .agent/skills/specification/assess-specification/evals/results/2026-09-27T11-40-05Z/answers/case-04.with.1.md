I've written revision 3 below. It closes the three gaps the assessment found, but it can't pass assessment yet, for two reasons:

1. **The store-failure behaviour is a security vs. availability decision, and I don't have the authority to make it.** I've written in my recommended option and marked it *proposed*. Whoever owns authentication security needs to adopt it or pick another option.
2. **The new evidence doesn't exist yet.** All we have is "the unit tests pass" for revision 2, and those tests don't cover the new obligations. I've rewritten the evidence section as a plan with the status "not run". Saying the evidence is satisfied would be false.

Once both are resolved, the spec is ready to go back to the assessor for operational reliance. Whether it passes is the assessor's call, not mine.

---

## Login throttling: specification, revision 3 (draft; repairs revision 2)

**Subject:** the login-throttling component, for each account.
**Intended reliance:** operation (running it in production).
**Status:** T-1 and T-2 are restated from revision 2. T-3 is new and **proposed, pending adoption**. The evidence plan has **not been run**.

### Terms
- **Account key:** the account identifier after the login service's canonical normalisation. The component uses whatever the login service passes in. It does not normalise the identifier itself.
- **Failed attempt:** a login attempt that reached credential checking and was rejected. Attempts refused by throttling are **not** failed attempts.
- **Authoritative clock:** the attempt-count store's server time, recorded when the store writes each entry. Application nodes' clocks are never used for window or lockout arithmetic.

### Cases
- **Success:** the account has 3 failures in the last 4 minutes. The user logs in correctly and is admitted.
- **Adverse 1:** the 5th failure comes 9 m 59 s after the 1st. The account is locked for 15 minutes.
- **Adverse 2:** the 5th failure comes exactly 10 m 00 s after the 1st. The 1st failure has left the window, so there are 4 failures and no lock.
- **Adverse 3:** during a lockout, someone submits the correct password. The attempt is refused. It is not counted and does not extend the lockout.
- **Adverse 4:** the store times out. The T-3 behaviour applies.
- **Adverse 5:** node clocks are 2 minutes apart. The outcome is the same as with synchronised clocks, because only the store clock is used.

### Obligations
**T-1 (lockout trigger), retained from revision 2 and made precise.** This is a sliding window measured on the authoritative clock. When a failed attempt is recorded at time *t*, and the account then has ≥ 5 failed attempts with timestamps in the half-open interval (*t* − 600 s, *t*], the component must place the account in lockout starting at *t*.

**T-2 (lockout effect), retained from revision 2 and made precise.** While *now* < *t* + 900 s on the authoritative clock, the component must refuse every login attempt for that account before credential checking. This includes attempts with correct credentials. Refused attempts are not counted and do not extend the lockout. The refusal must tell the caller the attempt was throttled. It must not reveal whether the credentials were correct.

**T-3 (store unavailable), new and PROPOSED: needs adoption by the authentication security owner.** The store counts as unavailable if a read or write doesn't complete within **200 ms** (a proposed value) or returns an error. While it is unavailable, the component must:
- (a) Apply T-1 and T-2 using per-node in-memory counters, timed by the node's monotonic clock, with the same thresholds.
- (b) Emit a `throttle_store_degraded` signal within 60 s of the first failure. The operational alerting route for it is still undecided (see U-2).
- (c) When the store is reachable again, go back to store-based counting. Failures counted in memory are **not** merged into the store. Any lockouts active on a node continue until they expire.

**Accepted consequence of T-3:** while degraded, an attacker spread across *N* nodes gets up to 5 × *N* attempts per window instead of 5.

**Alternatives kept for the decision-maker:**
- **Fail closed:** refuse all logins while the store is unavailable. This gives no brute-force exposure, but a store outage becomes a full login outage, and an attacker can cause that outage.
- **Fail open:** don't throttle while the store is unavailable. Availability is unaffected, but brute force is unlimited during the outage.

What decides between them: the frequency and length of store outages, the node count *N*, and the password-guessing risk tolerance.

### Deliberately unspecified; no consumer may rely on these
- Throttling by IP address or device.
- Notifying the user about a lockout.
- Administrative unlock.
- Whether a successful login resets the failure count (see U-1).

### Unresolved issues
| ID | Issue | Treatment | Effect on operational reliance |
|---|---|---|---|
| U-0 | Adopting T-3, or choosing an alternative | **Block** | Operational assessment can't be passed until resolved |
| U-1 | Does a successful login clear earlier failures? | Bounded investigation: ask the product/security owner. Until then, it does **not** reset (this is what revision 2 implied). | Minor. Record the decision. |
| U-2 | Alert routing and owner for `throttle_store_degraded` | Block for operation | Without a route, T-3(b) produces a signal nobody acts on |

### Evidence (replaces "the unit tests pass")
The expected results come from the obligations above, not from the implementation's own output. Tests use an injected clock and an injected store.

| Claim | Method | Required cases | Status |
|---|---|---|---|
| T-1 window boundary | Unit test with a controllable clock | 5th failure at +599.999 s locks. 5th at +600.000 s does not. 4 failures never lock. | Not run |
| T-2 lockout duration and non-extension | Unit test | Refused at +899.999 s. Admitted at +900.000 s. Attempts during the lockout don't extend it. A correct password during the lockout is refused. | Not run |
| Clock authority | Integration test against a real store, with node clocks skewed ±5 min | Outcomes identical to the unskewed run | Not run |
| T-3 degraded behaviour | Fault injection: store timeout (>200 ms), connection refused, error response | In-memory throttling works. The signal is emitted within 60 s. Recovery goes back to the store with no merge. Active node lockouts continue. | Not run. Blocked on U-0. |
| T-3 signal reaches an operator | Operational drill in staging | Alert delivered to the U-2 owner | Not run. Blocked on U-2. |

The existing revision 2 unit-test result is still valid evidence for the basic 5-in-10 → 15-minute behaviour. It is not evidence for any of the claims above.

### Mapping from revision 2
- The single revision 2 sentence → **T-1 and T-2**. The wording is split, and the behaviour is unchanged except where revision 2 said nothing.
- **T-3** is new.
- Revision 2's evidence ("the unit tests pass") is replaced by the plan above. Its existing result is kept only for the basic behaviour.

---

**Next steps:**
1. The security owner decides U-0 and U-2, and U-1 if they want to.
2. Implement and run the evidence plan.
3. Send revision 3, with the results, back to the assessor for operational reliance.

The 200 ms timeout and 60 s signal deadline are values I proposed. Replace them if you have operational figures.
