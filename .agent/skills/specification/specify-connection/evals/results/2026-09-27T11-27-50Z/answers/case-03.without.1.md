There's no code or spec in the working directory (it's empty), so this is based only on the contracts as you described them.

**No, the pair can't be relied on.** Each rule makes sense by itself, but together they produce bad states. Neither rule looks at the service's own health, and nothing guarantees that exactly one service is active.

### Outcomes by state

| A's real state | B's real state | What the rules do | Result |
|---|---|---|---|
| healthy | healthy | A fails over (B is healthy) **and** B fails over (A is healthy) | **Both hand off at once.** Either nobody is serving, or traffic bounces back and forth. This is the normal steady state, so it's the worst case. |
| failing | healthy | A fails over to B. B also fails over only if A still reports healthy. | Works only if A's report is accurate. |
| healthy | failing | Mirror of the row above | Works only if B's report is accurate. |
| failing | failing | Neither sees a healthy peer, so neither fails over | **Total outage with no action taken.** That may be acceptable, but nothing escalates it. |
| partitioned | partitioned | Behaviour when the peer's signal is missing or stale isn't defined | **Undefined.** If "no signal" counts as healthy, both fail over. If it counts as unhealthy, neither does. |

### Why the individual contracts don't catch this

1. **The trigger is incomplete.** Failover should require "I am unhealthy **and** my peer is healthy." These rules only check the second half, so a healthy service gives up its role.
2. **The logic is circular.** Each service's decision rests entirely on the other's self-report. There's no outside source of truth to settle disagreement or check that a report is accurate.
3. **A self-reported "healthy" isn't reliable.** A degraded service (for example, one that's up but returning errors) can still report healthy. In this design, that false report is what triggers the handoff.
4. **Nothing breaks ties or handles timing.** Both services read each other's signal with some lag, so they can make the same decision at the same moment. That causes simultaneous handoffs and repeated flip-flopping.
5. **The property that matters belongs to the pair.** "Exactly one service is active" depends on both services together. You can't prove it by checking each contract separately, and here it's false.

### Fixes, in order of importance

- **Fix the condition:** fail over only when you're unhealthy and your peer is healthy. Better still, the healthy peer should *take over* rather than the failing one *handing off*.
- **Use an outside arbiter:** have a lease or lock (etcd, ZooKeeper, a cloud load balancer, or a quorum of three) decide who is active. Attach a number to each leadership term that increases every time it changes, so a stale former leader's actions get rejected.
- **Define what a missing or stale signal means:** make it explicit and safe, for example "do nothing and alert."
- **Add hysteresis:** require the signal to hold for a period before acting, and enforce a cooldown after each failover so the services can't flip back and forth.
- **Check health from outside:** use probes that exercise the real request path instead of trusting each service's own report.
- **Test the pair together:** model-check or test the combined state machine against the "exactly one active" rule. Include the "both healthy" and "partitioned" cases.

If you have the actual contracts or code, send them and I'll check them against these points.
