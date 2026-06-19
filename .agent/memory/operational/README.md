# Operational Memory

Continuity / session-resume memory. The surfaces here answer the
question *"where are we right now, what's live, what's next."* They
let the next session (human or agent) recover orientation after any
interruption, handoff, or restart.

See [`.agent/memory/README.md`](../README.md) for the three-mode
memory taxonomy (active / operational / executive). Doctrine for the
continuity-surface split lives in
[`operational-awareness-and-continuity-surface-separation.plan.md`](../../plans/agentic-engineering-enhancements/archive/completed/operational-awareness-and-continuity-surface-separation.plan.md)
(the OAC lane) and
[PDR-011](../../practice-core/decision-records/PDR-011-continuity-surfaces-and-surprise-pipeline.md)
(portable Practice doctrine).

## Surfaces

| Surface | Purpose | Horizon | Writers | Authority |
| --- | --- | --- | --- | --- |
| [`repo-continuity.md`](repo-continuity.md) | Canonical repo-level continuity contract | Current session to a few sessions | `session-handoff` | Canonical for continuity contract; subordinate to active plans for scope |
| [`threads/<slug>.next-session.md`](threads/README.md) | Continuity-unit next-session record — identity table + landing target + lane state for a named stream of work that persists across sessions | Indefinite; deleted when thread archives | `session-handoff`; each joining session adds/updates its identity row per the additive-identity rule (PDR-027) | Identity + next-session landing + lane state authoritative for the thread; subordinate to plans for scope |
| [`pending-graduations.md`](pending-graduations.md) | Canonical pending-graduations register: decision-debt entries (status pending/due/overdue) awaiting graduation or rejection; do not create shard-like sidecar buffers | Until every entry is graduated, rejected, or duplicate — the empty buffer is the target (PDR-100) | `consolidate-docs` / curator passes | Live decision-debt; not archive material |
| [`open-questions.md`](open-questions.md) | Register of non-urgent unresolved planning, design, or process questions | Until answered in place, surfaced to owner, withdrawn, or left open with deferral-honesty | Any agent appends; `consolidate-docs` drains | Sibling to pending-graduations; subordinate to active plans, ADRs, and PDRs |
| [`collaboration-state-conventions.md`](collaboration-state-conventions.md) | Operational guide to live state in `.agent/state/collaboration/` (lifecycle, schema-field provenance, trusted-agents threat model) | Indefinite; evolves alongside `.agent/state/` surfaces | `consolidate-docs` and amendments to `agent-collaboration.md` | Subordinate to `agent-collaboration.md` directive for doctrine |
| [`collaboration-state-lifecycle.md`](collaboration-state-lifecycle.md) | Detailed recipes for opening, refreshing, closing, archiving, and reporting collaboration state | Indefinite; evolves alongside `.agent/state/collaboration/` lifecycle rules | Collaboration protocol implementation and remediation passes | Subordinate to `collaboration-state-conventions.md` for state indexing |

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
   next-session landing + lane state.

## Relationship to Other Memory Modes

- **Active memory** (`../active/`) — learning loop (napkin, distilled,
  patterns). Operational memory is NOT a second memory doctrine;
  promotable signals in thread records route into active
  memory via the normal capture/distil pipeline.
- **Executive memory** (`../executive/`) — organisational contracts.
  Operational memory is short-horizon; executive memory is stable.

## Relationship to Directives

Directives are read-and-internalise (doctrine). Operational memory is
read-and-written (state). The orientation directive
(`.agent/directives/orientation.md`) names the layering contract that
governs how these surfaces compose.
