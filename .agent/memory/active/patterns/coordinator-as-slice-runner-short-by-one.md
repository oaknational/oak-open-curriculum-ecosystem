---
name: Coordinator as Slice Runner When Team Capacity Is Short by One
polarity: pattern
category: coordination
status: provisional
discovered: 2026-05-21
proven_in: "Single instance 2026-05-21: 4-peer pool minus one closeout, leaving 3 peers against 4 file-disjoint slices. Coordinator took the smallest/freshest slice as a concurrent responsibility (Slice B, graph-stack plan, ~2 edits). Coordinator load remained manageable because other slices were parallel and slice-completion events were event-driven. Total ~2 edits in the coordinator's own slice. Second instance in a different team session would strengthen the pattern."
---

> **POLARITY: PATTERN.** When the team is short by exactly one peer, the coordinator can take the smallest/freshest slice rather than forcing a peer to double up.

# Coordinator as Slice Runner (Short by One)

When a team session has **N peers against N+1 file-disjoint
slices** — a capacity shortfall of exactly one — the coordinator
taking the **smallest and freshest** slice as a concurrent
responsibility is preferable to forcing a peer to double up.

## The Constraint

This pattern only applies when:

1. The shortfall is exactly **one slice** — not two, not three.
   At larger shortfalls the coordinator's routing load itself
   exceeds what one extra slice would consume.
2. The available slice is **the smallest and freshest** — not a
   slice with inherited partial edits, not a slice requiring
   diff-verify, not a slice with cross-workspace cascade
   implications.
3. **Slice-completion events are event-driven** — peers signal
   completion via comms events the coordinator's all-channels
   monitor catches, not via polling the coordinator.

## Why It Works

- **Forces file-disjoint discipline to hold.** With one peer
  doubled up across two slices, file-disjoint discipline becomes
  a sequential-edit discipline — the doubled-up peer has to
  serialise. With the coordinator taking a slice, all slices
  remain truly parallel.
- **Preserves load balance.** Every peer has one slice; the
  coordinator has one slice plus routing.
- **Routing load is naturally bursty.** Routing happens at
  comms-event moments (claim-open, slice-completion, blockers);
  in between, the coordinator's slice work proceeds.

## The Anti-Shape

A coordinator taking a **large or inherited-state** slice creates
two failure modes:

- The slice's complexity consumes coordinator attention at the
  exact moments routing demands it.
- The coordinator becomes a blocker for peers who need routing
  decisions while the coordinator is mid-edit.

The pattern requires the **smallest and freshest** slice — fresh
because there is no inherited state to reason about, small because
the slice work itself stays in spare cycles between routing.

## How to Apply

When a team session opens N peers against N+1 slices, before
assigning slices to peers:

1. Identify the smallest and freshest slice — typically one that
   was added late, has clean grounding, and bounded edits.
2. Ask whether the coordinator can take it without exceeding the
   routing bandwidth threshold.
3. If yes, assign that slice to the coordinator; assign remaining
   slices to peers one-to-one.
4. If no (the only available slice is large, complex, or
   inherited-state), force-multiplex one peer across two slices
   serially rather than degrading coordinator capacity.

## Cross-References

- `.agent/skills/oak-start-right-team/` — the team-bootstrap
  surface where slice assignment happens.
- [PDR-064](../../../practice-core/decision-records/PDR-064-coordinator-handoff-two-moments.md) —
  coordinator-handoff doctrine. The slice-runner role is itself a
  responsibility the coordinator may hand off if their routing
  load rises.
- `.agent/memory/operational/pending-graduations.md` 2026-05-21 —
  capture entry retained until second instance.
