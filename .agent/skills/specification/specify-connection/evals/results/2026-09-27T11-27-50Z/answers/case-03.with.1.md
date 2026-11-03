I worked only from the two rules you described. There were no contracts, revisions or code in the working directory, so I analysed the rules as stated.

**Verdict: no. As stated, the pair can't be relied on to fail over correctly.** Each rule is fine on its own, but together they form a circular dependency. Nothing in the rules decides who acts first or who wins a tie, so some ordinary situations leave nobody serving traffic.

## The connection

| | |
|---|---|
| **Relation** | Each service depends on the other's health signal to decide whether to fail over. |
| **Intended reliance** | Exactly one healthy service carries traffic after either one fails. |
| **What each service provides** | A health report about itself: "I am healthy." |
| **What each service assumes** | "If the peer says it's healthy, it is healthy, will stay healthy after I hand over to it, and isn't handing over to me at the same moment." |
| **Missing from the rules** | What makes a service *want* to fail over (its own degradation isn't mentioned), what "healthy" means, how fresh a report must be, what a missing report means, and who owns traffic when both could. |

## Why the pair fails

The only trigger for failover is the peer's health. A's own state plays no part, and neither does B's. That leaves a guarantee without the assumptions it needs:

- **Implication fails.** B saying "I'm healthy" doesn't mean B can take A's load. B hasn't agreed to become primary, and the failover itself changes B's load.
- **The circularity is unresolved.** A's action depends on B's report and B's action depends on A's report. Nothing sets the starting state or picks a tiebreaker. Neither service's contract can fix this alone; it needs an argument about both together.

## Cases where each service follows its rule and the pair fails

1. **Both healthy.** Both fail over to each other at once. Traffic goes back and forth, or both step down and nobody serves. This happens in normal operation, not just in rare faults.
2. **Both degraded.** Neither sees a healthy peer, so neither fails over. That's acceptable only if it's a deliberate choice, and nothing says it is.
3. **Network partition.**
   - If a missing report counts as unhealthy, neither fails over even though both may be fine.
   - If it counts as healthy, which a stale cached "healthy" amounts to, both fail over, as in case 1.
   - A split-brain variant: both still reach clients but can't see each other.
4. **Flapping.** A hands over to B, and B's health drops under the new load. If A is healthy again, B hands straight back. With no delay or hysteresis, this repeats indefinitely.
5. **Shared failure.** Both depend on the same database, DNS or config. Each keeps reporting "healthy" because it only checks itself, while both are actually broken. Checking the pair against each other can't catch this; you need a third point of view.
6. **Stale report.** A acts on a "healthy" report from B that's older than B's actual failure. Nothing requires reports to be fresh or to expire.

## Evidence that's missing

- **Written definitions of "healthy" from each service.** You'd need to show that "healthy" implies "can take the peer's full load", not just "the process is up".
- **Staleness and missing-report handling.** You'd need a stated maximum age and a stated meaning for "no report".
- **Fault-injection tests of the pair together.** Cover both healthy, both degraded, partition, flapping under load, and a shared dependency failing. Tests of each service alone don't carry over to the pair.
- **A mutual-exclusion argument.** Show that at most one service holds the primary role at any time, for example with a lease plus a fencing token (a counter that rejects commands from an old primary).

## What each side needs to add

- **Service A and service B:** make failover depend on their own degradation *and* the peer being healthy, not the peer's health alone. Define "healthy", including capacity and a maximum report age. Say how a missing report is treated. Add a hold-down period or hysteresis so they don't flap.
- **The pair as a whole:** this belongs to whoever owns the deployment, not to either service. It needs a tiebreaker: a witness or arbiter, a lease with fencing, or a fixed active/standby role with an explicit rule for taking over. Without one, cases 1 and 3 can't be fixed by changing either service by itself.

This should be reopened when either service's health definition or failover trigger changes, when a shared dependency is added, or when the network layout between them changes.
