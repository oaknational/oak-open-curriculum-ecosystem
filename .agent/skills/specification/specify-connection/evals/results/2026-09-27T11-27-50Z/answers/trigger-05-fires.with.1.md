I couldn't check this against real services because the working directory is empty. There are no service names, versions, health-check definitions or failover configs to read. So this answer is about the pattern as you described it. **As described, you can't rely on the pair.** It becomes reliable only if a few specific conditions below are in place.

## The connection

- **Relation:** each service depends on the other's health signal and delegates the failover decision to it. The reliance runs both ways, so it's a loop.
- **What you rely on:** when one service is actually down, the other takes over. When it isn't down, the other doesn't.
- **What each side sends:** a health signal, like a heartbeat or a `/health` response. The records don't say what "healthy" means, how fresh the signal must be, or how it behaves during a network problem. That gap is itself a finding.
- **What each side assumes:** that a missing or bad signal means the other service is dead.

## Why it doesn't hold

The link needs "no healthy signal received" to mean "the peer is down." The signal can't guarantee that. Over an unreliable network, a dead peer, a slow peer and a broken link look the same from the receiving side. Each service can pass its own checks and the pair can still fail. Because the reliance is a loop, there's no independent tie-breaker, so there has to be a starting rule for who is primary.

**Status:** it fails as described. It holds only if all of these are true:
1. **Third-party arbiter:** a witness, quorum or lock service outside both services decides who is primary. The peer's signal alone doesn't.
2. **Fencing:** the old primary is blocked from acting once it's replaced. That can be a lease with a known limit on clock drift, fencing tokens that downstream systems check, or STONITH (forcibly shutting down the old node).
3. **"Healthy" means able to serve:** the check tests the real work path, including its dependencies, not just "the process is running."
4. **Hysteresis and failback rules:** a set number of failures before failover, a hold-down period, and a defined way to fail back.
5. **Protection against duplicate work:** requests are idempotent, or in-flight work is fenced, so retries during the switch don't happen twice.

## Failure cases where each service works on its own but the pair fails

| Case | What happens |
|---|---|
| Network partition | Each side sees the other as down and both become primary (split-brain): writes diverge and effects happen twice. Fixed by conditions 1 and 2. |
| Shared-cause outage (same DNS, network, zone or bad deploy) | Both are down or both think the other is down. Failover does nothing or makes things worse. Fixed by independent infrastructure plus condition 1. |
| Partial failure | The health check passes but real requests fail, so failover never happens. Fixed by condition 3. |
| Long GC pause or slow node | The peer takes over, then the paused node wakes up and still acts as primary. Fixed by condition 2. |
| Flapping | The signal goes up and down near the threshold, so the pair keeps switching and requests fail on each switch. Fixed by condition 4. |
| Retry during the switch | A client times out on the old primary and retries on the new one, so the action happens twice. Fixed by condition 5. |
| Mismatched versions | The two versions read health or state differently, and that pairing was never tested. Needs a test of each version pair you run, or a versioned health contract. |
| Cold start | Both start without seeing the other, so it's unclear who is primary. Needs a starting rule, for example the arbiter decides or a fixed priority order. |

## Missing evidence

- A written health-signal contract: what it means, how fresh it must be, and what the timeouts are.
- Partition tests, such as Jepsen-style or chaos tests that cut the link between the two services.
- Proof that the failure domains are independent.
- A fencing mechanism and proof that downstream systems enforce it.
- Tests of failover and failback, including requests in flight during the switch.

## What each side needs to add to its own definition

- **Each service:** define what "healthy" means, how fresh the signal is, and how it behaves when unreachable. It must also give up the primary role when its lease expires or it gets a newer fencing token.
- **Whatever writes downstream (database, queue):** reject writes from a primary that has been replaced.
- **The deployment or platform owner:** provide the arbiter and show the two failure domains are independent.

If you share the actual services, their health-check definitions and the failover config, I can check this against them and give a definite answer.
