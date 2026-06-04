# ADR-190: Heartbeat-Cron Health Monitoring via Watcher-Staleness Substrate

**Status**: Proposed
**Date**: 2026-06-04
**Related**:
[PDR-078](../../../.agent/practice-core/decision-records/PDR-078-liveness-heartbeat-contract.md)
(liveness-heartbeat contract — the cadence/threshold/retirement-on-silence
semantics this ADR makes more robust against a specific false-positive);
[ADR-186](186-comms-event-heartbeat-lifecycle-substrate.md)
(comms-event heartbeat lifecycle substrate — a distinct concern: ADR-186 settles
_which event-shape_ carries a heartbeat; this ADR settles _how peers tell a
heartbeat-emitting cron loop is alive-but-silent from dead_);
[`ping-before-escalate`](../../../.agent/rules/ping-before-escalate.md)
(the current manual retirement-detection cross-check this ADR composes with and
demotes to belt-and-braces);
[`watcher-staleness.ts`](../../../agent-tools/src/collaboration-state/watcher-staleness.ts)
(the existing per-tick staleness substrate this ADR generalises from watchers to
the heartbeat cron).

## Context

PDR-078's retirement-detection fires when an agent's heartbeat is silent past a
10-minute threshold, driving the auto-rebalance of that agent's claims. The
signal is comms-event silence: no heartbeat event in the stream for the
threshold window.

Comms-event silence has two distinct causes that the current detection cannot
tell apart:

1. **The agent retired** — the session ended; the heartbeat cron stopped because
   the agent is gone. Retirement-rebalance is correct.
2. **The heartbeat cron loop degraded** — the loop is alive but not emitting,
   for a platform- or harness-side reason. Retirement-rebalance is a
   false-positive: the agent is still working.

Worked second instance (2026-05-24): two independent Claude-platform Monitor
cron loops degraded concurrently — one silent for 20 minutes, another for 17
minutes, in the same window. Concurrency strongly indicates a platform/harness
cause, not two simultaneous retirements. The current cure is
`ping-before-escalate`: a peer who observes the silence direct-pings and
cross-checks git work-evidence before broadcasting retirement. That cure is
manual and depends on a peer being present and disciplined.

The repository already solves the analogous problem for **watchers**. The
`watcher-staleness.ts` substrate has a watcher write a per-tick heartbeat file
(`WatcherHeartbeat`: identity, `heartbeat_interval_ms`, `last_emit_at`, plus the
file's mtime) and `detectStaleWatcher` returns a five-kind discriminated result
(`live` / `stale-aged` / `stale-no-emit` / `absent` / `malformed`). The mtime is
written every tick regardless of whether the watcher emitted anything, so the
file's age distinguishes "loop alive, just nothing to emit" from "loop dead"
**independently of the event stream**.

## Decision

**The heartbeat cron writes a per-tick staleness file using the existing
watcher-staleness substrate shape, and retirement-detection composes two signals
instead of one: comms-event silence AND staleness-file age.**

Concretely:

- The heartbeat-emitting cron updates a staleness file every tick (the mtime
  advances each tick even when no comms heartbeat event is due), carrying the
  emitting agent's identity tuple and `heartbeat_interval_ms`, reusing the
  `WatcherHeartbeat` shape and `detectStaleWatcher` classifier.
- Retirement-detection composes:
  - comms-silence past threshold **AND** staleness-file `stale-aged` (or
    `absent`) → **retired**; rebalance is correct.
  - comms-silence past threshold **AND** staleness-file `live` → **cron-degraded
    false-positive**; suppress the retirement broadcast (the loop is alive, just
    not emitting comms events).
- `ping-before-escalate` remains, demoted from primary signal to belt-and-braces
  — the deterministic `(silence + staleness-file-age)` pair becomes the primary
  retirement decision, and the manual ping is the human-judgement backstop.

This is a **sibling** decision to ADR-186, not an amendment to it: ADR-186 owns
the comms-event heartbeat substrate (which event carries a heartbeat); this ADR
owns the staleness-file health substrate (whether the emitting loop is alive).
They compose to serve PDR-078's liveness contract but bind to different
substrates.

## Rationale

**Why reuse the watcher-staleness substrate, not invent a new one.** The
substrate already exists, is tested, and returns exactly the five-kind result
the retirement decision needs. Per `replace-dont-bridge` and the additive
extension discipline, generalising a working substrate from watchers to the
heartbeat cron is cheaper and lower-risk than a parallel mechanism.

**Why a staleness file, not a richer event.** The whole point is to have a
signal that advances **independently of the comms-event stream** — exactly the
signal a silent-but-alive loop fails to produce in the event stream. The file's
mtime is that independent signal.

**Why this is Proposed, not Accepted.** The decision and the cure shape are
settled (the second worked instance fired the trigger). The implementation —
the heartbeat emitter writing the file and retirement-detection acquiring the
dual-signal composition — lands when the liveness/collaboration-infra work is
scheduled. Recording the decision now captures the now-evidenced doctrine in its
permanent home so the next implementer inherits the settled shape.

## Consequences

### What this enables

- Deterministic retirement decisions that do not false-positive on a
  cron-degraded-but-alive agent.
- `ping-before-escalate` becomes a backstop rather than the primary mechanism,
  reducing the dependence on a disciplined peer being present at the right
  moment.

### What this costs

- The heartbeat cron acquires a per-tick filesystem write (negligible; the
  watcher already does this).
- Retirement-detection logic acquires the dual-signal composition; it must read
  the staleness file in addition to scanning the comms stream.

### What this forbids

- A future change MUST NOT revert retirement-detection to comms-silence-only;
  the concurrent-degradation false-positive is the failure mode this ADR exists
  to prevent.

## Validation

1. This file exists and references PDR-078, ADR-186, `ping-before-escalate`, and
   the watcher-staleness substrate in §Related.
2. The cure reuses `detectStaleWatcher` and the `WatcherHeartbeat` shape from
   `agent-tools/src/collaboration-state/watcher-staleness.ts` (verified present
   2026-06-04) — no new substrate is introduced.
3. The implementation slice (emitter writes the file; retirement-detection
   composes the dual signal) is gated on the liveness/collaboration-infra work
   being scheduled; its acceptance is TDD cycles authored at that promotion, not
   an ADR-190 prerequisite.

## Notes

### Build-vs-Buy attestation

No third-party vendor is touched by this ADR. The substrate is this
repository's own `watcher-staleness.ts` and the heartbeat cron it already runs.

### Adjacent gap (not folded in)

The 2026-05-24 worked instance also surfaced a heartbeat-cron-drift episode that
appeared platform-wide. Whether the platform/harness cause is itself addressable
is out of scope for this ADR — this ADR makes the _detection_ robust regardless
of the cron-drift cause; it does not attempt to prevent the drift.
