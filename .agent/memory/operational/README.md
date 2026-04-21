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
| [`threads/<slug>.next-session.md`](threads/README.md) | Continuity-unit next-session record — identity table + landing target for a named stream of work that persists across sessions | Indefinite; deleted when thread archives | `session-handoff`; each joining session adds/updates its identity row per the additive-identity rule (PDR-027) | Identity + next-session landing authoritative for the thread; subordinate to plans for scope |
| [`workstreams/<slug>.md`](workstreams/README.md) | Short-horizon lane resumption brief (one or more per thread — a thread can span multiple lanes) | Days to weeks | `session-handoff`; optionally `GO` when a workstream boundary is crossed | Lane-level short-horizon state; subordinate to thread next-session record for identity and to plans for scope |
| [`tracks/<workstream>--<agent>--<branch>.md`](tracks/README.md) | Single-writer tactical coordination card | One focused task or blocker-resolution cycle | The owning agent only | Tactical coordination only; never authoritative for scope |

Track cards are git-tracked; multi-agent and multi-location
collaboration flows through the normal git channel. A collaborative
track creates multiple single-writer cards disambiguated by the
filename convention.

**Thread ↔ workstream relationship** (PDR-027): a **thread** is the
continuity unit — a named stream of work that persists across sessions
and agents; it carries identity and next-session landing. A
**workstream** is a lane-level brief answering "where are we in this
lane?" A thread contains **one or more** workstreams; a workstream
belongs to exactly one thread. In small cases the mapping is 1:1 and
the thread slug equals the workstream slug (e.g.
`observability-sentry-otel`); this is permitted but nominal overlap
should not be mistaken for identity of concern — the surfaces answer
different questions. Whether the 1:1 empirical state warrants
collapsing to a single surface is a Session-5 first-principles
check (see the Deep consolidation status register).

## Authority Order

The authority order is a **tiebreaker for same-scope conflicts**, not
a gating rule across different-scope claims. When two surfaces
disagree on the same field, the higher-authority surface wins. It
does not mean a higher-authority surface must contain or override
lower-authority surfaces' scope-specific content.

1. **Plans** (`.agent/plans/*/active/*`) — scope, sequencing,
   acceptance criteria, validation.
2. **`repo-continuity.md`** — canonical continuity contract.
3. **`threads/<slug>.next-session.md`** — thread-level identity +
   next-session landing.
4. **`workstreams/<slug>.md`** — lane-level short-horizon state.
5. **`tracks/*.md`** — tactical coordination only; never
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
