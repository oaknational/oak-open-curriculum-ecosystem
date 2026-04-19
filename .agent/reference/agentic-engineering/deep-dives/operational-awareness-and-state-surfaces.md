# Operational Awareness and State Surfaces

This deep dive covers the gap between canonical continuity doctrine and the
short-horizon, thread-aware state that real multi-agent work creates inside the
repository.

## Canonical Anchors

- [ADR-150](../../../../docs/architecture/architectural-decisions/150-continuity-surfaces-session-handoff-and-surprise-pipeline.md)
- [continuity-practice.md](../../../../docs/governance/continuity-practice.md)
- [practice.md](../../../practice-core/practice.md)
- [workbench-agent-operating-topology.md](../workbench-agent-operating-topology.md)

## Evidence and Investigations

- [continuity-adoption-baseline.md](../../../analysis/continuity-adoption-baseline.md)
- [continuity-adoption-evidence.md](../../../analysis/continuity-adoption-evidence.md)
- [continuity-operational-awareness-baseline.md](../../../analysis/continuity-operational-awareness-baseline.md)

## Related Plans

- [continuity-and-surprise-practice-adoption.plan.md](../../../plans/agentic-engineering-enhancements/archive/completed/continuity-and-surprise-practice-adoption.plan.md)
- [operational-awareness-and-continuity-surface-separation.plan.md](../../../plans/agentic-engineering-enhancements/current/operational-awareness-and-continuity-surface-separation.plan.md)
- [cross-vendor-session-sidecars.plan.md](../../../plans/agentic-engineering-enhancements/future/cross-vendor-session-sidecars.plan.md)

## Current Synthesis

- The continuity rollout was directionally correct: one canonical continuity
  contract, lightweight `session-handoff`, `GO` as mid-session cadence, and
  the existing learning loop left intact.
- The live continuation prompt then absorbed more than the contract because it
  was the only obvious place to put short-horizon workstream state and
  parallel-track coordination.
- The important gap is therefore not a fourth continuity type. It is a
  repo-local **operational-awareness plane** that sits between plans and the
  learning surfaces.
- The strongest local concept anchor is the workbench topology note: its
  temporary **work ledger** maps well to track-aware, short-horizon state, but
  the repo needs a shared version of that ledger rather than leaving it inside
  one prompt surface.

## Proposed Shape

### Canonical continuity surface

One compact repo-level continuity contract that answers:

- which workstreams are active
- which workstream brief is primary
- repo-wide invariants
- next safe step
- whether deep consolidation is due

### Workstream brief surface

One tracked short-horizon brief per active lane that carries:

- owning plans
- current objective
- current state
- blockers / low-confidence areas
- next safe step
- active track links
- promotion watchlist

### Tactical track-card surface

One gitignored card per active agent or thread that carries:

- agent or thread identity
- branch or worktree
- claimed territory
- current task
- blocker
- handoff note
- `expires_at`
- `promotion_needed`

### Promotion edge

Anything in workstream or tactical state that changes understanding must route
into the existing learning loop rather than becoming a second memory doctrine.

## Why This Is Not the Sidecars Plan

The future sidecars plan is broader and more infrastructural:

- multi-vendor
- adapter-driven
- canonical store oriented
- durable structured metadata beyond one repo

This deep dive recommends a narrower sequence:

1. prove the repo-local operational-awareness shape with markdown-first
   surfaces
2. record where that shape breaks under real concurrency
3. only then decide whether a sidecar store is justified

## Good Follow-Up Questions

- Which workflow should own each write: `session-handoff`, `GO`, or explicit
  manual updates?
- Which operational-awareness behaviours travel well enough to become a PDR or
  Practice Core candidate?
- What are the earliest signs that markdown-first track cards are no longer
  sufficient and the sidecars plan should be promoted?

## Related Lanes

- [continuity-and-knowledge-flow.md](./continuity-and-knowledge-flow.md)
- [research continuity lane](../../../research/agentic-engineering/continuity-memory-and-knowledge-flow/README.md)
- [analysis evidence lane](../../../analysis/README.md)
- [future sidecars plan](../../../plans/agentic-engineering-enhancements/future/cross-vendor-session-sidecars.plan.md)
- [hub README](../README.md)
