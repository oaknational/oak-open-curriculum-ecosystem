# Operational Memory

Continuity / session-resume memory. The surfaces here answer the
question *"where are we right now, what's live, what's next."* They
let the next session (human or agent) recover orientation after any
interruption, handoff, or restart.

See [`.agent/memory/README.md`](../README.md) for the three-mode
memory taxonomy (active / operational / executive). Doctrine for the
continuity-surface split lives in
[`operational-awareness-and-continuity-surface-separation.plan.md`](../../plans/agentic-engineering-enhancements/active/operational-awareness-and-continuity-surface-separation.plan.md)
(the OAC lane) and
[PDR-011](../../practice-core/decision-records/PDR-011-continuity-surfaces-and-surprise-pipeline.md)
(portable Practice doctrine).

## Surfaces

| Surface | Purpose | Horizon | Writers | Authority |
| --- | --- | --- | --- | --- |
| [`repo-continuity.md`](repo-continuity.md) | Canonical repo-level continuity contract | Current session to a few sessions | `session-handoff` | Canonical for continuity contract; subordinate to active plans for scope |
| [`workstreams/<slug>.md`](workstreams/README.md) | Short-horizon lane resumption brief (one per active workstream) | Days to weeks | `session-handoff`; optionally `GO` when a workstream boundary is crossed | Lane-level short-horizon state; subordinate to both continuity contract and plans |
| [`tracks/<workstream>--<agent>--<branch>.md`](tracks/README.md) | Single-writer tactical coordination card | One focused task or blocker-resolution cycle | The owning agent only | Tactical coordination only; never authoritative for scope |

Track cards are git-tracked; multi-agent and multi-location
collaboration flows through the normal git channel. A collaborative
track creates multiple single-writer cards disambiguated by the
filename convention.

## Authority Order

The authority order is a **tiebreaker for same-scope conflicts**, not
a gating rule across different-scope claims. When two surfaces
disagree on the same field, the higher-authority surface wins. It
does not mean a higher-authority surface must contain or override
lower-authority surfaces' scope-specific content.

1. **Plans** (`.agent/plans/*/active/*`) — scope, sequencing,
   acceptance criteria, validation.
2. **`repo-continuity.md`** — canonical continuity contract.
3. **`workstreams/<slug>.md`** — lane-level short-horizon state.
4. **`tracks/*.md`** — tactical coordination only; never
   authoritative for scope.

## Relationship to Other Memory Modes

- **Active memory** (`../active/`) — learning loop (napkin, distilled,
  patterns). Operational memory is NOT a second memory doctrine;
  promotable signals in workstream briefs or tracks route into active
  memory via the normal capture/distil pipeline.
- **Executive memory** (`../executive/`) — organisational contracts.
  Operational memory is short-horizon; executive memory is stable.

## Relationship to Directives

Directives are read-and-internalise (doctrine). Operational memory is
read-and-written (state). The orientation directive
(`.agent/directives/orientation.md`) names the layering contract that
governs how these surfaces compose.
