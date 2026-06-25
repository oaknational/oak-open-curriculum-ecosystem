---
name: "Agent Work-State Registry"
status: future-strategic
overview: >
  One authoritative, mechanically-maintained surface that binds every live
  agent's (PDR-027 identity -> worktree -> branch -> liveness), DERIVED from git
  ground truth and watcher-mtime liveness rather than authored into free-text.
  Resolves friction F-98. Not yet executable: the agent-work-state model needs an
  ADR/PDR before promotion. The statusline is the first, proving consumer; the
  binding is foundational for every coordination mechanism.
lineage:
  serves_thread: agentic-engineering-enhancements
  serves_stream: agent operating substrate / developer-and-agent experience
  strategic_choice: >
    multi-developer transition (one-dev-many-agents -> many-checkouts,
    variable agent density, author-agnostic substrate)
  derives_from: "F-98 (frictions register); relates F-10, F-69, F-95, F-94"
---

# Agent Work-State Registry — Strategic Plan

> **Lineage (interim oak-plan homing discipline):** serves the
> `agentic-engineering-enhancements` thread under the agent-operating-substrate
> stream; derives from the multi-developer-transition strategic choice and
> friction F-98.

**Status**: 🔵 FUTURE — strategic brief. Not authorised to build now.
**Source**: F-98 (`.agent/plans/agent-tooling/frictions-register.md`), owner-directed
capture 2026-06-25.
**Related** (coordinate, do not duplicate):
[`claim-liveness-crash-reconciliation-and-session-forensics.plan.md`](claim-liveness-crash-reconciliation-and-session-forensics.plan.md)
(owns the liveness signal — this plan **consumes** it);
[`collaboration-state-domain-model-and-comms-reliability.plan.md`](collaboration-state-domain-model-and-comms-reliability.plan.md)
(the broad state-model home this sits under);
[`worktree-per-agent-transition.plan.md`](../../agentic-engineering-enhancements/future/worktree-per-agent-transition.plan.md)
(strategic root);
[PDR-035](../../../practice-core/decision-records/PDR-035-agent-work-capabilities-belong-to-the-practice.md);
[ADR-165](../../../../docs/architecture/architectural-decisions/165-agent-work-practice-phenotype-boundary.md).

## Problem and Intent

There is no single authoritative surface that binds a running agent's
`(identity -> worktree -> branch -> liveness)`. The four facts are scattered, and
the closest thing to a registry records the binding as authored free-text, not
derived ground truth:

- `active-claims.json` — structured identity; branch only as free-text inside
  `intent`; "freshness" is `claimed_at + window`, **not** liveness; maintained
  only when an agent calls the `claims` CLI.
- comms heartbeat events — structured `--branch`, per-emit liveness, but an
  append-only event stream, not a current-state table.
- watcher heartbeats (`comms-seen/*.heartbeat.json`) — true mtime liveness, but
  branch-blind and per-agent.
- `git worktree list` — git-maintained worktree/branch ground truth, but no
  agent binding.

Because the shell cwd resets to the primary checkout after every command, an
agent **cannot determine its own work-location from recorded state** — only from
carried, unverified belief.

**Intent**: an agent (and its peers, and the owner) reads a single authoritative,
mechanically-maintained surface answering, for every live agent, *"who, on which
worktree, on which branch, last alive when"* — and an agent can deterministically
assert its own binding rather than carry it as belief.

The binding is foundational input for **every** coordination mechanism — the
statusline, claims/collision-avoidance, the watcher-presence gate (F-95), handoff
and adoption (F-94), and the owner's at-a-glance who-is-where. Its value is not
in question and is not argued here; this plan builds it.

## End Goal, Mechanism, Means

**End goal**: the `(identity -> worktree -> branch -> liveness)` binding is
observable from one surface, derived not authored, with the statusline showing an
agent's true worktree even when its session launched from the primary checkout.

**Mechanism** (the F-98 cure framing, owner-stated 2026-06-25):

- **Derive, do not author** (`principles.md` §Context Specificity Gradient —
  generated state beats authored state). Worktree/branch are git ground truth
  (`git worktree list`); liveness is the watcher heartbeat mtime. The registry
  **projects** these; it does not ask agents to retype them into `intent`.
- **Decompose at the tension, do not collapse** (`principles.md` §Decompose at
  the Tension). Preserve three distinct signals — *claimed intent* (mutable,
  agent-asserted), *observed liveness* (mechanical), and *git ground truth*
  (worktree/branch). Unify the **read** surface; keep the three sources distinct.
- **Replace, do not bridge** (`principles.md` §No legacy surfaces). One surface
  authoritative; reconcile or retire the others (the free-text `intent` branch,
  the freshness-as-liveness conflation). Do not add a fifth surface.
- **Strict and complete**: close `freshness ≠ liveness` — a registry of live
  agents reflects actual liveness, not a window that outlives a dead process.
- **Practice-owned, host-implemented**: doctrine in practice-core, implementation
  in `agent-tools/src/collaboration-state/`.

**Means** (sequenced; execution decisions finalised at promotion):

1. **Agent-work-state ADR/PDR** — the model: the binding's schema, the
   deterministic self-assertion primitive (how an agent records its worktree
   binding when cwd resets — derived by running git in its worktree, not authored),
   the projection of git + liveness, the three-signal decomposition, and which
   existing surfaces subsume/retire. This is the decision; the rest is downstream.
2. **Derived-registry projection** in `agent-tools/src/collaboration-state/` —
   project worktree/branch (git ground truth) and liveness (consume the
   `claim-liveness-crash-reconciliation` M1 signal — do not re-implement it) into
   one queryable current-state read surface, with the self-assertion primitive.
3. **First consumer — the statusline** — read the binding by identity so the
   working-location line shows the true worktree for a primary-launched agent
   (closes the F-98 statusline symptom). The seam is already stabilised (commit
   `c8324e183`): the statusline shows the session's actual cwd today and is honest
   about it; this step swaps the source from cwd to the registry.
4. **Reconcile / retire** the divergent surfaces — the free-text `intent` branch
   and the freshness-as-liveness read — so one surface is authoritative.

## Domain Boundaries and Non-Goals

- **NOT** "add a `branch` field to the claim schema." Owner-excluded (F-98): it
  would deepen the divergence. The binding is projected/asserted, not authored
  into the claim.
- **NOT** a fifth surface layered on the existing four — one becomes
  authoritative; the rest reconcile or retire.
- **NOT** a change to how sessions launch. The binding is derived/asserted, so it
  works whether a session is rooted in the primary checkout or a worktree (it does
  not depend on `workspace.current_dir` being the worktree).
- **NOT** the liveness mechanism itself — that is owned by
  `claim-liveness-crash-reconciliation` M1; this plan consumes its signal.
- **No value justification** — the registry's worth across coordination
  mechanisms is taken as given.

## Dependencies and Sequencing

| Prerequisite | Class | Note |
| --- | --- | --- |
| Agent-work-state ADR/PDR | **blocking** | The model must be decided before the projection is built; without it the schema and self-assertion primitive are unspecified. |
| `claim-liveness-crash-reconciliation` M1 (liveness signal) | **blocking** for the liveness column | The registry consumes this signal; minimum shippable without it = the `(identity -> worktree -> branch)` projection with liveness still read from the existing (imperfect) freshness, flagged. |
| Statusline seam (commit `c8324e183`) | **beneficial** | Done. The consumer is ready to swap its source from cwd to the registry. |

## Strategic Acceptance Criteria and Success Signals

- An agent answers *"which worktree and branch am I on?"* from the registry, not
  from carried belief (the F-98 worked-instance #1 becomes answerable).
- The statusline shows a primary-launched agent's **true worktree**, not the
  primary checkout's branch (the F-98 statusline symptom is closed end-to-end).
- A dead agent reads as **dead** (liveness reflects the watcher mtime, not a
  freshness window that outlives the process — F-98 worked-instance #2).
- Exactly one surface is authoritative for the binding; the free-text `intent`
  branch and freshness-as-liveness reads are reconciled or retired.

## Risks and Unknowns

- **The self-assertion primitive**: how an agent deterministically records its
  worktree binding when cwd resets after each command is the central design
  unknown the ADR must resolve.
- **Per-tick read cost**: the statusline reads the binding constantly; the
  projection must be cheap (the current design deliberately avoids scanning the
  comms corpus per tick).
- **Decomposition discipline**: unifying the read surface without flattening the
  three distinct signals (claimed / observed / ground-truth) is the failure mode
  to guard against.
- **Scope coordination**: overlap with the domain-model and liveness plans must be
  resolved in the ADR so this plan owns only the binding/projection/unified-read.

## Promotion Trigger

Owner GO to build, AND the agent-work-state ADR/PDR drafted. On promotion, mine
this brief into an executable `current/` plan with TDD cycles, acceptance ids, and
the consumption chain (ADR -> projection -> statusline consumer -> surface
reconciliation). Execution decisions are finalised only at that point.
