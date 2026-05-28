---
name: "Claim Liveness, Crash Reconciliation, and Session Forensics"
overview: "Make a crashed agent's claim reclaimable promptly without owner intervention, and give any agent a one-command forensics surface to diagnose a stuck or crashed peer session. Coordinates three existing collaboration-substrate plans that each touch a slice of this thread but none own it."
status: future-strategic
todos:
  - id: m1-claim-liveness-binding
    content: "M1: Bind claim liveness to an actual liveness signal (auto-heartbeat live claims off the watcher/check tick, and/or detect the owning session is gone) so staleness reflects reality instead of a manual heartbeat plus a long TTL."
    status: pending
  - id: m2-crashed-claim-reconciliation
    content: "M2: Add a reconciliation path that, on a dead-owner liveness signal, marks the claim orphaned and opens a takeover path — instead of waiting out the full freshness TTL."
    status: pending
  - id: m3-session-forensics-cli
    content: "M3: Add a session-forensics CLI (resolve agent name/prefix -> transcript, enumerate sub-agents, extract last error, pattern-match known failure signatures such as the compaction 400)."
    status: pending
---

# Claim Liveness, Crash Reconciliation, and Session Forensics

**Last Updated**: 2026-05-28
**Status**: 🔵 FUTURE — strategic brief. Not authorised to build now.
**Activation trigger**: a second crashed-agent / orphaned-claim incident, OR a
team session blocked by a phantom claim held by a dead agent, OR the
[`comms-watch-liveness-floor`](comms-watch-liveness-floor.plan.md)
liveness-record primitive lands (making M1's auto-heartbeat cheap to ride), OR
owner-direct promotion.
**Scope**: The thread "make a crashed agent detectable and its claim
reclaimable, with a forensics surface to diagnose it." This thread's pieces are
currently scattered as deferred non-goals and partials across three existing
plans (see Dependencies); this brief gives the thread a single owning home and
coordinates them. It does **not** re-open those plans' committed scopes.

---

## Problem and Intent

On 2026-05-28 a peer agent ("Leafy Regrowing Sapling", session prefix `3c02b9`)
crashed mid-task on a Claude Code compaction bug. The crash exposed two
substrate gaps that are independent of the platform bug that triggered them:

1. **Claim liveness is heartbeat-bound but the heartbeat writer is manual.**
   `agent-tools/src/collaboration-state/claims.ts` computes staleness as
   `(claim.heartbeat_at ?? claim.claimed_at) + freshness_seconds < now`
   (`isClaimStale`, default TTL `14400s`). `heartbeat_at` is only ever written
   by an explicit `claim heartbeat` CLI call (`cli-claim-commands.ts`). Nothing
   auto-heartbeats a *live* agent and nothing detects a *dead* one, so a crashed
   agent's claim stays "fresh" for up to its full TTL. Leafy claimed at 14:00
   with no heartbeat written; the claim was invisible-as-dead until ~18:00,
   roughly 2.5 hours after the 15:21 crash.

2. **There is no automated crashed-claim reconciliation and no session-forensics
   surface.** Recovery depended entirely on the owner noticing the agent was
   stuck and asking another agent to investigate. Diagnosis then required manual
   `session_id_prefix -> transcript file` resolution via `active-claims.json`
   plus hand-rolled `jq` to reconstruct the message structure, find the
   `subagents/` directory, and surface the last error. No CLI resolves a peer's
   session, enumerates its sub-agents, or extracts its last error.

The intent is to convert an owner-in-the-loop recovery into a substrate
primitive. By the doctrine that owner intervention is a stopgap, not a target
cure (`feedback_owner_action_is_not_a_cure`), the current recovery path is a
missing-autonomy symptom, not a process to keep.

## End Goal, Mechanism, Means

**End goal**: A crashed agent's claim is detectably orphaned within a short
liveness floor (minutes) and reclaimable without owner intervention; any agent
can diagnose a stuck or crashed peer session with one command.

**Mechanism**: Staleness currently measures "time since the last *manual*
heartbeat", which is uncorrelated with whether the agent is alive. Binding
liveness to an actual signal makes staleness measure reality; a reconciliation
trigger on that signal closes the detection-latency gap; and a forensics CLI
makes the diagnostic surface that was hand-rolled during this incident a
first-class, repeatable capability.

**Means (strategic moves)**:

- **M1 — Claim-liveness binding.** Auto-heartbeat live claims off the same tick
  as the watcher-liveness primitive introduced by
  [`comms-watch-liveness-floor`](comms-watch-liveness-floor.plan.md), and/or add
  a dead-owner detector (no liveness within a floor; or the owning session is
  provably gone) so claim staleness reflects liveness rather than a manual
  heartbeat plus a long TTL.
- **M2 — Crashed-claim reconciliation.** On a dead-owner signal, mark the claim
  orphaned and open a takeover path, instead of waiting out the freshness TTL.
  This is the liveness *trigger* for the stale/orphaned state transition that
  [`collaboration-state-domain-model-and-comms-reliability`](collaboration-state-domain-model-and-comms-reliability.plan.md)
  already names under active-participant verification.
- **M3 — Session-forensics CLI.** `session inspect <name|prefix>`: resolve
  identity to its transcript, enumerate sub-agents, extract the last error, and
  pattern-match known failure signatures (e.g. the compaction
  `thinking-blocks-cannot-be-modified` 400). Extends the CLI surface owned by
  [`agent-coordination-cli-ergonomics-and-request-correlation`](agent-coordination-cli-ergonomics-and-request-correlation.plan.md).

**Simplest viable shape** (First Question — could it be simpler?): M3 alone
(forensics CLI) plus a standalone dead-owner detector feeding the existing
`archive-stale` path delivers most of the value without the deeper auto-heartbeat
binding. M1's auto-heartbeat is the complete fix and is cheapest once the
liveness-floor primitive exists; until then, the dead-owner detector is the
minimum shippable for M1/M2.

## Domain Boundaries and Non-Goals

- **Not** fixing the Claude Code compaction bug itself — that is a platform
  defect, documented for upstream in
  [`.agent/reports/claude-code-compaction-thinking-block-bug-2026-05-28.md`](../../../reports/claude-code-compaction-thinking-block-bug-2026-05-28.md).
- **Not** building the watcher-liveness primitive — owned by
  [`comms-watch-liveness-floor`](comms-watch-liveness-floor.plan.md); this brief
  *consumes* it.
- **Not** redesigning the collaboration-state domain model — owned by
  [`collaboration-state-domain-model-and-comms-reliability`](collaboration-state-domain-model-and-comms-reliability.plan.md);
  this brief adds the liveness trigger for one transition it already names.
- **Not** the routing-legacy-fallback sunset (see Dependencies for the verdict).

## Dependencies and Sequencing

| Dependency | Classification | Note |
| --- | --- | --- |
| [`comms-watch-liveness-floor`](comms-watch-liveness-floor.plan.md) liveness-record primitive | beneficial | M1's auto-heartbeat is cleanest riding its tick. That plan explicitly defers the claim side as a non-goal ("Claim liveness and watcher liveness are distinct primitives; this plan adds the second without changing the first"). Minimum shippable without it: a standalone dead-owner detector + takeover CLI. |
| [`collaboration-state-domain-model-and-comms-reliability`](collaboration-state-domain-model-and-comms-reliability.plan.md) active-participant verification | beneficial | M2 reconciliation aligns with its stale/orphaned semantics; it names the ghost-claim problem but gives it no liveness trigger. |
| [`agent-coordination-cli-ergonomics-and-request-correlation`](agent-coordination-cli-ergonomics-and-request-correlation.plan.md) | beneficial | M3 shares its CLI surface (claims-overlap query, session-open liveness emission). |
| [`.agent/reports/claude-code-compaction-thinking-block-bug-2026-05-28.md`](../../../reports/claude-code-compaction-thinking-block-bug-2026-05-28.md) | reference | Worked evidence; not a build dependency. |

**Relation to [`routing-legacy-fallback-sunset`](routing-legacy-fallback-sunset.plan.md)
(verified verdict).** Parallel thread, not shared mechanism. Both incidents
made stale collaboration state visible on the same day, but a crashed agent's
claim persists for its full TTL regardless of whether routing is strict or
falls back on a legacy key — fixing the routing sunset does not change *when or
how* a crashed claim is detected. The routing plan cross-links this cluster as a
dependency map, not an architectural overlap. The owner's suspicion of a
connection is understandable from the shared session; the honest finding is that
the cures are independent.

## Strategic Acceptance Criteria and Success Signals

- A crashed agent's claim is flagged orphaned within a short liveness floor
  (target: minutes), not its full freshness TTL (hours), without owner action.
- `session inspect <prefix>` resolves a peer session, lists its sub-agents, and
  surfaces its last error in one command.
- Replaying the worked incident: the `3c02b9` crash would have been diagnosed
  and the claim reclaimed by tooling, with the owner informed rather than
  required to initiate.

## Risks and Unknowns

- **Cross-platform dead-owner detection is unreliable.** OS process-liveness is
  platform-specific; heartbeat-absence is the portable signal. The forensics CLI
  must abstract the session-store location (`~/.claude/projects/...` is
  Claude-Code-specific and machine-local — honour
  [`.agent/rules/no-machine-local-paths.md`](../../../rules/no-machine-local-paths.md)).
- **False-positive orphaning** of a live-but-paused agent (long tool call, owner
  away, deliberate idle). The liveness floor must sit above realistic gaps; a
  takeover should be reversible / re-claimable, not destructive.
- **Forensics over a live peer transcript** must stay strictly read-only and
  must not mutate another agent's session files.

## Related Candidate (same incident, distinct thread)

**Autonomous incremental-artefact-writing for sub-agents.** In this incident the
crashed agent's sub-agent verification report survived only because the owner
entered the sub-agent's session and asked it to write to disk — another
owner-action-is-not-a-cure instance, not autonomous behaviour. A sub-agent
returns only a summary to its parent, so its working context is the most
crash-fragile state in the system. Candidate: sub-agents should write durable
intermediate artefacts to disk *as they go, autonomously*. Recorded here because
it shares the crash-resilience theme; it is a separate work item, not part of
this plan's means. Promote separately if a second instance appears.

## Promotion

Execution decisions (exact CLI shape, the liveness-floor value, the takeover
protocol, schema changes) are finalised only at promotion to `current/`, authored
from the appropriate executable template. Promote on the activation trigger
above; record the trigger evidence, the readiness verdict, and any assumptions
carried forward.
