I couldn't check this against real contracts because the working directory is empty. So this is a structural answer that applies to any design where two peers watch each other. The short answer is **no, not as described.** Each service can be correct on its own and the pair can still fail, because each one's decision to fail over depends on the other, and nothing outside the pair settles who is right.

## The arrangement

| | |
|---|---|
| **Relation** | Each service depends on the other's health signal (A reads B's, B reads A's) |
| **Endpoints** | Service A and service B. Versions and contract sources weren't provided, which is itself a finding. |
| **Intended use** | Each one decides whether to take over, or hand over, based on the other's health signal |
| **What each side promises** | Not stated. At minimum each needs to say what "healthy" means, how fresh the signal is, and what it reports when it's degraded rather than down. |
| **What each side assumes** | That the other's signal is true and current, and that a missing signal means the peer is down. |
| **Who has authority** | Unassigned. Neither service can make the other stop doing work. |
| **Failure and recovery** | Undefined when both are degraded at once, when the link between them fails, and when a failed service comes back. |

## Can it be relied on?

**It fails as described.** It could hold under three conditions:

1. **Something outside the pair decides.** Two peers that each judge the other can't reliably tell "my peer is down" from "I can't reach my peer." You need a third party that settles it: a witness, a quorum or a lease service.
2. **The old primary is blocked from acting.** When a failover happens, the old primary must be prevented from continuing to act. The usual tool is fencing: an increasing token (a number each new primary gets and the shared resource checks) or cutting its access to storage or the network.
3. **Health means the service can do its job.** The signal should reflect whether the service can serve requests on its critical paths, not just whether the process is running. It should be stamped with a time and treated as unknown once it's stale.

## Where the pair breaks

In every case below, both services behave exactly as designed and the pair still fails.

1. **The link between them fails.** Each sees the other as down and both take over. You get two primaries writing at once (split-brain), with duplicated or conflicting work. Nothing in the current design survives this.
2. **One side can reach the other but not the reverse.** A thinks B is down while B thinks A is fine. The result is one takeover plus an old primary that is still active, which brings you back to case 1.
3. **A service reports healthy but isn't working.** The health check passes while real requests fail. No failover happens, so this kind of partial outage goes unnoticed.
4. **Both depend on the same thing, such as a database, DNS or a certificate.** Both report unhealthy, or each waits for the other to take over, and nobody serves.
5. **Failover overloads the survivor.** It takes on the full load, its own health check starts failing, and it hands back to a service that hasn't recovered. Without a delay between switches (hysteresis), it flaps back and forth.
6. **A recovered service reclaims the primary role with stale data.** Recovery rules and fencing are missing.
7. **The two sides run different versions.** They were never tested against each other's definition of "healthy."

## What evidence is missing

- The written health contract for each service: what the signal covers, how often it's checked, the timeouts and the freshness limit.
- Chaos or partition tests of cases 1, 2 and 5, with a check that only one primary is active at any time.
- A list of dependencies the two services share (case 4).
- Proof that fencing actually works: the old primary's writes get rejected.

## What each side needs to add

- **Service A and service B:**
  - Publish what "healthy" means and how fresh the signal must be.
  - Treat a stale or missing signal as unknown, not as down.
  - Refuse to act as primary without a valid lease or fencing token.
  - Leave primary mode cleanly when it loses the lease.
- **The system as a whole:** Name the component that decides who is primary. This design has no owner for that job, and adding one is the fix.

If you share the actual services (health endpoints, failover logic, deployment topology), I can replace the unknowns with specific findings. If you'd like, I can also write up the arbiter's own obligations as a separate spec.
