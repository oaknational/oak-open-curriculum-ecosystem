# Liveness Heartbeat Cron

Liveness is observable, or it is not. Where the
[all-channels comms watcher](comms-all-channels-watcher.md) ensures
*incoming* visibility — every event the team emits reaches every agent —
this rule ensures *outgoing* visibility — every agent's continued presence
reaches the team. Both are non-negotiable preconditions; both must be
running before any team-bootstrap step that follows.

The portable contract — cadence, threshold, redundancy rule, exemption
set, and the structural cure they compose — is authoritatively specified
by
[PDR-078 (liveness-heartbeat contract)](../practice-core/decision-records/PDR-078-liveness-heartbeat-contract.md).
The repo-bound phenotype substrate that operationalises the contract in
this repository — the comms-event substrate shape, the canonical event
kind / discriminator field, the watcher render token — is recorded in
[ADR-186 (comms-event heartbeat lifecycle substrate)](../../docs/architecture/architectural-decisions/186-comms-event-heartbeat-lifecycle-substrate.md).
This rule is the operational adoption point: it cites the contract +
phenotype pair as authoritative and prescribes the team-cadence-shaped
discipline that every participating agent runs.

## Trigger

A team session is bootstrapping (`start-right-team` SKILL First Moves
move 2) or an existing team session is being rejoined after compaction
or handoff. This rule fires after the all-channels comms watcher
(`comms-all-channels-watcher.md`) is running and before the team-start
broadcast lands.

## Action

### Operational summary

Binding norms preserved here for fast read; PDR-078 + ADR-186 are the
authoritative source of substance.

- Every active team member emits a heartbeat event at cadence ≤ 4
  minutes (PDR-078 §Emit-side).
- Silence past the 10-minute threshold presumes retirement and fires
  claim auto-rebalance (PDR-078 §Observe-side).
- The current repo phenotype (per ADR-186) emits heartbeats as comms
  events with `tags: ["heartbeat"]` per
  [ADR-183](../../docs/architecture/architectural-decisions/183-comms-event-tag-namespace-substrate.md)'s
  namespace substrate, rendering as a `[HEARTBEAT]` channel token.
  ADR-186 names `lifecycle + event_type='heartbeat'` as the canonical
  shape going forward; both shapes are operationally valid during the
  migration window (per ADR-186 §Migration discipline). The
  identity-tuple subject-line format:

```text
Heartbeat: <agent_name> (<session_id_prefix>) — <current lane>
```

Body composes from typed state args (claim id, intent, branch, current
cycle label) per the A1 typed-origin heartbeat gate; the canonical
agent-tools CLI rejects `--body` argv on `--tag heartbeat` events.
Heartbeats are coordination signal, not narrative content; substrate
weight should be low so the comms stream stays scannable.

### Canonical invocation — platform background-task primitive

Run a 4-minute-cadence loop that emits a heartbeat event each cycle.
Platform-specific shapes:

- **Claude Code**: the `Monitor` tool with `persistent: true` and a
  `while/sleep 240` loop emitting heartbeats; alternatively
  `CronCreate` with `*/4 * * * *` if the cron primitive is preferred.
- **Cursor**: the equivalent watch / background-task primitive per
  platform docs.
- **Codex**: the equivalent background-task mechanism.

The loop SHOULD swallow stdout on success (failures emit so the agent
can react). The loop dies when the session ends, which correctly
satisfies the retirement-on-silence rule for natural session-end.

### Owner-input precedence on every scheduled tick

A cron, scheduled wakeup, or persistent monitor prompt is itself
substrate. Before it emits a heartbeat or resumes prior work, it MUST
read the latest owner turn. If the owner has issued a direction that
supersedes task continuation — pause, stop, wait, hold, standby,
paused-until-X, or an equivalent direction — do not resume the previous
task. Instead emit the final-heartbeat-end / pause-standby signal that
matches the new owner direction, stop the scheduled loop if the
direction requires it, and wait for the next real owner turn. Only when
no superseding owner direction has landed should the tick emit a
heartbeat and return to the in-flight task.

### Owner reroute visibility

When the owner redirects an active team member from the coordinated
boundary to a different lane, the rerouted agent MUST broadcast the
change within one heartbeat cadence. Include the new target lane,
expected duration, and original-lane disposition (`owned`, `handed
off`, `paused`, or `released`). This narrative event counts as
substantive activity for PDR-078's heartbeat-only stall diagnostic.
Until it lands, peers may correctly read heartbeat-only output against
the old lane as stalled and follow the direct-ping / takeover protocol.

### State thresholds

| Time since last heartbeat | State | Director action |
|---|---|---|
| < 4 min | Active | None |
| 4–10 min | Offline (transient) | None; assume resume imminent |
| ≥ 10 min | Retired | Claim auto-rebalance fires |

### Heartbeat-only stall diagnostic

Heartbeats present but no substantive events for two or more cadence
windows means the role is alive-but-stalled-pending-coordination, not
active-on-lane. Direct ping with a one-cadence reply window; if silent,
broadcast takeover or route-adjustment intent before acting. See
PDR-078 §6.

### Claim auto-rebalance protocol on retirement

When an agent crosses the 10-minute threshold without heartbeat:

1. **Director surfaces a retirement-detection event** (broadcast;
   tagged `failure-mode` if the retirement is unexpected, tagged
   `behaviour-note` if it is a normal session-end without explicit
   closeout broadcast). The
   [`ping-before-escalate`](ping-before-escalate.md) discipline applies
   — cross-check git work-evidence, commit queue, and directed inbox
   before broadcasting; direct-ping first.
2. **Per-claim disposition**:
   - **Claims with `handoff_record_path` field set**: read the named
     handoff record (PDR-063 / ADR-182); surface to the natural-next
     agent named in the record or Director-route to a suitable agent.
   - **Claims without a handoff record**: surface as orphan-class;
     Director routes through dialogue to a natural-next-agent based on
     the claim's intent and the team's current shape.
   - **Claims explicitly retained for handoff** (named in the retiring
     agent's closeout): wait until the named successor arrives or the
     retention TTL expires, whichever fires first.

### Exemptions

The retirement-on-silence rule does NOT fire for the following
operational windows — silence is expected during these states and is
not a retirement signal:

- **Coordinator-transfer 30-minute grace window** (PDR-064
  §"Coordinator Handoff (Two Moments)"). Between Moment 1
  pre-positioning and Moment 2 active-acknowledgement, the incoming
  coordinator may be compacting, bootstrapping, or running their own
  start-right discipline; the outgoing coordinator continues
  heartbeats until Moment 2 lands and authority transfers cleanly.
- **Marshal-cycle contiguous-execution exemption**: while a marshal is
  inside a cycle (husky gate-chain in flight, staging window open,
  commit window open), cycle-boundary broadcasts (stage-complete,
  gate-green, commit-landed, tree-green) satisfy heartbeat semantics
  during the contiguous window. The marshal MUST emit an explicit
  heartbeat-tagged event during idle windows between cycles.
- **Sub-agent dispatch verdict-synthesis exemption**: while the
  dispatching agent is awaiting reviewer transcripts, verdict-synthesis
  broadcasts (with subagent transcript ids) satisfy heartbeat
  semantics. The dispatching agent MUST emit an explicit
  heartbeat-tagged event if the dispatch window exceeds 8 minutes (one
  full silence-to-offline transition).

## Worked Instance

A founding worked instance for the heartbeat-only stall diagnostic is
preserved in PDR-078 §Falsifiability: an agent's session emitted
heartbeats every ~4 min for nearly an hour while making zero
substantive lane progress after a peer's commit-landed broadcast. No
investigation, no push attempt, no reply to a direct ping. The
presence-without-progress state looked identical to retirement-
detection from PDR-078's silence-threshold lens but was diagnostically
distinct: alive-but-stalled-pending-coordination, not retired. The
cure shape — direct-ping with bounded deadline ≈ 1 heartbeat cycle,
then broadcast takeover-of-lane intent with rationale — landed via the
takeover broadcast that followed. PDR-078 clause 6 and §Falsifiability
now formalise the diagnostic; the rule's commit-time history records
the specific commit and event identifiers.

## Why a Rule, Not a SKILL Clause

This rule was extracted from `start-right-team` SKILL §0.5 because the
heartbeat cron discipline is a discrete operational invariant with a
single Trigger (team session bootstrap) and a single Action (cron loop
running). The SKILL retains a thin-pointer paragraph naming this rule;
the substance lives here for the same two reasons that govern
[`comms-all-channels-watcher`](comms-all-channels-watcher.md): rule
discoverability and trigger-loaded doctrine cost.

The contract substance lives in PDR-078 (portable contract) and ADR-186
(repo-bound phenotype). This rule's role is the operational adoption
point — the named place where every agent reads the binding norms,
state thresholds, exemptions, and invocation shape at session
bootstrap.

## Related Surfaces

- [PDR-078 (liveness-heartbeat contract)](../practice-core/decision-records/PDR-078-liveness-heartbeat-contract.md)
  — the portable contract this rule operationalises. Cadence, threshold,
  redundancy rule, exemption set, and the structural cure live there.
- [ADR-186 (comms-event heartbeat lifecycle substrate)](../../docs/architecture/architectural-decisions/186-comms-event-heartbeat-lifecycle-substrate.md)
  — the repo-bound phenotype that operationalises PDR-078 here.
  `[HEARTBEAT]` watcher token, at-most-once render guarantee, consumer
  dual-filter contract during migration. See ADR-186 §Migration
  discipline for the migration-window exit criterion.
- [ADR-183 (comms-event tag-namespace substrate)](../../docs/architecture/architectural-decisions/183-comms-event-tag-namespace-substrate.md)
  — the tag-namespace substrate ADR-186 composes through for the
  `[HEARTBEAT]` render token during the migration window.
- [PDR-027 (threads, sessions, and agent identity)](../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md)
  — identity tuple format in the heartbeat subject line.
- [PDR-064 (coordinator handoff two moments)](../practice-core/decision-records/PDR-064-coordinator-handoff-two-moments.md)
  — grace-window exemption for coordinator transitions.
- [`ping-before-escalate`](ping-before-escalate.md) — the cross-check
  discipline that fires before retirement-detection broadcasts at the
  ≥10 min threshold.
- [`comms-all-channels-watcher`](comms-all-channels-watcher.md) — the
  incoming-visibility sibling.
- [`start-right-team` SKILL First Moves move 2](../skills/start-right-team/SKILL-CANONICAL.md)
  — the thin-pointer host that names this rule's firing moment. The First
  Moves entry IS the trigger surface; removing it would make this rule
  unreachable from session bootstrap.

## Enforcement

Behavioural at session open. The cron's presence is observable as a
running background task (Cron job id, Monitor task id, or platform
equivalent); the team-start broadcast names the cron status. The
heartbeat-tagged comms events are observable on the stream at ≤4 min
cadence per active agent. Future hardening could add a session-open
check that fails fast if no heartbeat cron is observable, but the
discipline is the named first-move pause after watcher start.
