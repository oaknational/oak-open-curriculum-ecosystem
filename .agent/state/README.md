# Repo-Local State Surfaces

**Status**: Scaffolding created by OAC Phase 2 (2026-04-20). Population
happens during OAC Phase 3 pilot and OAC Phase 4 rollout. See
[operational-awareness-and-continuity-surface-separation.plan.md](../plans/agentic-engineering-enhancements/active/operational-awareness-and-continuity-surface-separation.plan.md).

This directory holds **tracked** repo-local state surfaces that separate
what the continuation prompt previously did in one file into distinct
surfaces with explicit authority, writers, readers, and expiry semantics.

## Surfaces

| Surface | Purpose | Horizon | Writers | Authority |
| --- | --- | --- | --- | --- |
| [`repo-continuity.md`](repo-continuity.md) | Canonical repo-level continuity contract | Current session to a few sessions | `session-handoff` | Canonical for continuity contract; subordinate to active plans for scope |
| [`workstreams/<slug>.md`](workstreams/README.md) | Short-horizon lane resumption brief (one per active workstream) | Days to weeks | `session-handoff`; optionally `GO` when a workstream boundary is crossed | Lane-level short-horizon state; subordinate to both continuity contract and plans |

## Authority Order

When surfaces disagree, the order is:

1. **Plans** (`.agent/plans/*/active/*`) — scope, sequencing, acceptance
   criteria, validation.
2. **`repo-continuity.md`** — canonical continuity contract.
3. **`workstreams/<slug>.md`** — lane-level short-horizon state.
4. **Runtime tactical track cards** (`.agent/runtime/tracks/*.md`) —
   tactical coordination only; never authoritative for scope.
5. **`session-continuation.prompt.md`** — read order, routing, and
   operating instructions only; no state host.

## Relationship to Other Surfaces

- **Plans** remain authoritative for scope, sequencing, and acceptance.
  State surfaces hold resumable context, not plan content.
- **`.agent/memory/napkin.md`** remains the capture surface for
  surprises and corrections. State surfaces are not a second memory
  doctrine.
- **`.agent/memory/distilled.md`** remains the refinement surface for
  learnings. Promotable signals observed in workstream briefs or
  tactical track cards route into the existing learning loop.
- **Runtime tactical track cards** (`.agent/runtime/tracks/*.md`) are
  gitignored single-writer surfaces; they never outlive their track.

## Pilot Status

Surfaces are populated during OAC Phase 3's self-hosted parallel-track
pilot on this lane's own implementation. After pilot calibration
(promote / adjust / reject), OAC Phase 4 rolls the model out to the
broader workflow set.
