---
name: "Worktree-per-Agent Transition"
status: future
overview: >
  Strategic brief for moving concurrent agents off a single shared checkout
  onto one git worktree per agent, to dissolve the shared-working-tree and
  shared-index coupling (F-83) that every n>=2 window currently pays. Direction
  is owner-resolved (adopt worktrees); sequencing is owner-prioritised as infra
  "soon". Not yet executable — the worktree lifecycle and the cross-worktree
  coordination-home resolution need design before promotion.
lineage:
  serves_thread: agentic-engineering-enhancements
  serves_stream: agent operating substrate / developer-and-agent experience
  strategic_choice: >
    multi-developer transition (one-dev-many-agents -> many-checkouts,
    variable agent density, author-agnostic substrate)
  derives_from: "F-83 (frictions register); the multi-developer-transition direction"
---

# Worktree-per-Agent Transition — Strategic Plan

> **Lineage (interim oak-plan homing discipline, 2026-06-24):** this plan serves
> the `agentic-engineering-enhancements` thread under the agent-operating-substrate
> stream; it derives from the multi-developer-transition strategic choice and
> F-83. (The full vision->strategy->stream->thread->plan chain is being built as
> machine-traversable edges by ADR-200's living-idea-graph rewrite; this
> frontmatter `lineage` block is the lightweight interim until those edges land.)

## Problem and Intent

The repo runs **one-dev-many-agents** today and is moving to
**many-checkouts / variable-agent-density** with an author-agnostic substrate
([[project_multi_developer_transition]]). Concurrent agents on **one shared
checkout** couple through two shared resources they do not own independently:

- **the shared working tree** — a peer's edit, commit, or gate run mutates
  files under another agent; and
- **the shared git index + `HEAD`** — staging and committing serialise through
  one index, and the whole-tree pre-commit gate sees every agent's in-flight
  work.

This is **F-83**. It is not hypothetical: in the 2026-06-23/24 window alone a
peer co-committed a file mid-edit (HEAD shifted ~5 times), a peer's `pnpm check`
**cleaned shared `dist`** out from under a live agent (breaking its comms CLI and
killing its watcher), and a required-field ripple surfaced as type-check-RED in a
**peer's** claimed files. Each n>=2 window re-pays this coordination cost.

**Intent:** give each concurrent agent its **own git worktree** (own working
tree and index, shared object store and branches), so the coupling dissolves
rather than being coordinated around.

## End Goal, Mechanism, and Means

- **End goal:** a concurrent n>=2 agent window runs with no shared-working-tree
  or shared-index collisions — independent staging, independent gate runs,
  independent build outputs — while coordination state (claims, comms) stays
  coherent across worktrees.
- **Mechanism:** `git worktree` gives each agent a separate working directory
  and index over the same `.git` object store and ref set. Edits, `dist` builds,
  and pre-commit gates are per-worktree, so a peer's gate run or mid-edit commit
  cannot mutate another agent's tree. The decision lens that resolves the
  direction is L4 ("would it be simpler if the system changed?") — worktrees
  dissolve the coupling rather than coordinating around it.
- **Means (strategic, finalised at promotion):**
  1. A worktree lifecycle: create-on-session-open, name/locate by agent
     identity, clean up on retirement.
  2. The cross-worktree **coordination-home** resolution — where shared
     collaboration state (`active-claims.json`, comms, seen-files) lives so all
     worktrees read/write one coherent surface (part-built via
     `resolveCoordinationHome`, WS-3 F-41).
  3. Path discipline: no machine-local or worktree-local absolute paths leak
     into shared state (`no-machine-local-paths`).

## Domain Boundaries and Non-Goals

- **Non-goal:** changing the comms/claims coordination *protocol* — worktrees
  change *where work happens*, not how agents coordinate; the protocol is
  orthogonal.
- **Non-goal:** many-**machine** distribution — a separate, later step; this plan
  is many-worktree on one machine/repo.
- **Non-goal:** removing the whole-tree pre-commit gate — full-tree gating stays
  correct ([[feedback_pre_commit_hook_must_gate_staged_only]] REJECTED); each
  worktree runs its own.

## Dependencies and Sequencing

- **Blocking:** the cross-worktree coordination-home resolution
  (`resolveCoordinationHome`) — claims/comms/seen-files must resolve to one
  shared home regardless of which worktree an agent runs in, or coordination
  fragments. Part-built (WS-3 F-41); needs completion before worktrees are safe.
- **Beneficial:** the agent-identity surfaces (PDR-027) already key on
  name+UUID, which carries across worktrees; minimum shippable shape without
  further identity work is fine.

## Strategic Acceptance Criteria / Success Signals

- A concurrent n>=2 window completes with each agent in its own worktree and
  **zero** shared-index lock contention, mid-edit co-commits, or cross-agent
  gate-tree mutation incidents recorded against F-83.
- Coordination state (claims, comms, seen) is read/written coherently from every
  worktree (one home, verified).
- The per-window coordination overhead the commit-window protocol exists to
  manage drops measurably (fewer abandoned commit-queue entries, no lock waits).

## Risks and Unknowns

- **Coordination-home fragmentation** — if shared state resolves per-worktree,
  agents go blind to each other. Mitigation: the blocking dependency above;
  prove one-coherent-home before adopting.
- **Disk and setup cost** — N worktrees multiply working-tree disk and
  build-cache. Mitigation: shared object store; assess cache strategy at
  promotion.
- **Tooling assumptions** — scripts/hooks assuming a single checkout path may
  break. Mitigation: the `no-machine-local-paths` discipline; audit at promotion.

## Promotion Trigger

Promote to `current/` when: (1) the coordination-home resolution is complete and
proven coherent across worktrees, and (2) the owner scopes a bounded, reversible
worktree-lifecycle slice. Owner has prioritised this as infra "soon"
(2026-06-24); sequencing is the owner's against the ADR-200 rewrite lane.

## Lifecycle Triggers

- **Promotion to `current/`:** the two conditions above.
- **Refinement:** each new F-83 incident (mid-edit co-commit, shared-`dist`
  clean, cross-agent gate-RED) is evidence that sharpens this plan and raises
  its priority.
- **Archival:** only if a different route dissolves the shared-checkout coupling.

## Foundation Alignment

- `principles.md` Second Question ("would this be simpler if the system
  changed?") — the lens that resolves the direction.
- `no-machine-local-paths`, `respect-active-agent-claims`, the commit-window
  protocol (`commit` skill) — the surfaces a worktree model must keep coherent.
