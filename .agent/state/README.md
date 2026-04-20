# Repo-Local State Surfaces

**Status**: Active (OAC Phase 4.1 rollout in progress, 2026-04-20). The
continuation prompt has been retired as a state host; state now lives
here and in `../runtime/tracks/`. See
[operational-awareness-and-continuity-surface-separation.plan.md](../plans/agentic-engineering-enhancements/active/operational-awareness-and-continuity-surface-separation.plan.md).

This directory holds **tracked** repo-local state surfaces with explicit
authority, writers, readers, and expiry semantics.

## Surfaces

| Surface | Purpose | Horizon | Writers | Authority |
| --- | --- | --- | --- | --- |
| [`repo-continuity.md`](repo-continuity.md) | Canonical repo-level continuity contract | Current session to a few sessions | `session-handoff` | Canonical for continuity contract; subordinate to active plans for scope |
| [`workstreams/<slug>.md`](workstreams/README.md) | Short-horizon lane resumption brief (one per active workstream) | Days to weeks | `session-handoff`; optionally `GO` when a workstream boundary is crossed | Lane-level short-horizon state; subordinate to both continuity contract and plans |

Runtime tactical track cards live at
[`.agent/runtime/tracks/`](../runtime/README.md) and are **also
git-tracked**. They coordinate across agents, devs, and locations
through the normal git channel — a collaborative track creates
multiple single-writer cards, disambiguated by filename.

## Authority Order

The authority order is a **tiebreaker for same-scope conflicts**, not a
gating rule across different-scope claims. When two surfaces disagree on
the same field, the higher-authority surface wins. It does not mean a
higher-authority surface must contain or override lower-authority
surfaces' scope-specific content.

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
  **git-tracked** single-writer surfaces; multi-agent and
  multi-location collaboration flows through the normal git channel.
  Cards do not persist beyond their resolution — expired cards must
  be resolved, promoted, or deleted at session close.
