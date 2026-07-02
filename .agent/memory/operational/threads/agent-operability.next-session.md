# Next-Session Record — `agent-operability`

Thread identity: **`agent-operability`** — the operability of agents *in their
worktrees*: launch-in-worktree as the **derived** `(identity → worktree →
branch)` binding, the worktree lifecycle (create → build → draft-PR → cleanup),
and the seat (`{worktree, branch, role, task, Director}`) carried in the brief.
Distinct from `agent-naming` (display-name derivation) and from the broader
agent-team-operations cluster this is a member of. Governing decision:
[PDR-118](../../../practice-core/decision-records/PDR-118-agent-work-state-model.md)
(work-state binding; OQ2 — supersession-by-launch-in-worktree); frictions
F-98 / F-87 / F-90 / F-91.

## Current Continuation

- **Branch / where to ground (updated 2026-07-01)**: this record, the
  repo-continuity entries, and the controlling plan are **committed on
  `docs/consolidations`** (`2fffb80ff`; the branch is 35 ahead of `origin/main`
  with `origin/main` merged in, release 1.56.0). **Ground on `docs/consolidations`**
  — a fresh worktree off a clean `main` would not yet see this record (it reaches
  `main` only when `docs/consolidations` merges). Create the build worktree off
  `docs/consolidations` so it inherits the enablers and the latest main, dogfooding
  launch-in-worktree (the tool it is building automates this):
  `git worktree add ../oak-spawn-flow -b feat/agent-spawn-flow docs/consolidations`,
  **build it before launching** (a worktree shows no statusline unless built before
  the session starts), then `cd ../oak-spawn-flow && claude`. (The plan's
  how-to-start says `main`; that becomes literal once `docs/consolidations` merges.)
- **Invocation pointer**: continue `agent-operability` from this record.
- **Controlling plan**:
  [`agent-spawn-flow-tool.plan.md`](../../../plans/agent-tooling/current/agent-spawn-flow-tool.plan.md)
  (`current/`, **active**, owner-approved 2026-06-28 — ready to build).
  Authoritative for scope, phases, and acceptance. **Read it whole, including the
  Pitfalls section** (it is the point of the handoff — the originating session hit
  those traps and the owner corrected each).
- **Next safe step**: the **confirmation smoke-test** — `pwd` +
  `git rev-parse --show-toplevel` across 3+ separate Bash calls in a
  worktree-launched session must equal the worktree (the cwd = launch-dir fact is
  owner-confirmed and docs-confirmed; **confirm once, do not re-litigate**). Then
  **Phase 1A** (create worktree + branch + identity via the *injectable* git seam
  — the `GitRunner` shape in `collaboration-state/coordination-home.ts`, NOT the
  non-injectable `core/runtime.ts` `runGit`; sibling `oak-<slug>` topology; extend
  `claude-agent-ops cleanup` to manage `oak-*` siblings).
- **Acceptance bar**: per the plan's §Verification — `agent spawn` end-to-end
  produces a built, draft-PR'd worktree plus a launch command that starts a
  session rendering the true worktree; TDD per slice; reviewers dispatched
  real-time every slice (code-expert gateway → architecture reviewer for the
  spawn boundary → assumptions-expert for scope).
- **Team expectation**: single-owner build lane by default; coordinate with the
  `statusline-enhancements` lane only if both touch `statusline-identity.ts`
  (Layer 0 needs no statusline change — the binding already derives from cwd).
- **Reaching `main`**: the continuity artefacts and the eventual
  `feat/agent-spawn-flow` work reach `main` when `docs/consolidations` merges — a
  code-owner-ruleset merge (`@jimCresswell` review; `--admin` forbidden). This is
  **not a blocker for pickup** (you ground and build off `docs/consolidations`); it
  is the finalization step.

## Standing decisions this thread carries forward (from the plan — do not re-litigate)

1. **The cwd = launch-directory fact is settled** (owner-confirmed 2026-06-28);
   the binding is derived, the primary checkout is not special.
2. **Decoupled from the substrate**: build the standalone tool, substrate-aligned,
   with **no** substrate-PDR / host-ADR / 5-axis contract gating it. The
   knowledge-distribution-substrate stays recorded-future (context only — do not
   build it; ignore its "substrate-PDR first" ordering).
3. **Do not build the Dissolved machinery** (assert-one-validated-anchor,
   `worktree_anchor`, the anchor→stdin→cwd chain, the §B2 primary binary-pin); the
   `future/agent-work-state-registry.plan.md` brief is superseded — do not promote it.
4. **The spawn brief invokes `/oak-start-right-team`** — it does not re-implement it.
5. Phase 0 doc/PDR codifications **follow** the build and are owner-ratification-gated
   (the PDR-118 OQ2-resolved / clause-3-superseded amendment is not an in-place edit).

## Session shape and grounding order for this thread

1. [`repo-continuity.md`](../repo-continuity.md) §Active Threads.
2. This record.
3. The controlling plan (above) — whole, including Pitfalls — authoritative.
4. The memories named in the plan's Pitfalls
   (`feedback_design_from_the_substrate_not_the_instance`,
   `feedback_run_the_thing_dont_flag_the_gap`, `feedback_cowpath_anti_pattern`,
   `feedback_no_responsibility_passback`, and the worktree-hygiene /
   liveness-heartbeat-cron rules).
5. [`knowledge-distribution-substrate.plan.md`](../../../plans/agent-tooling/future/knowledge-distribution-substrate.plan.md)
   — **context only**, do not build (spawn-flow is its first proving instance later).

## Participating Agent Identities

Additive per [PDR-027](../../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md);
joining adds a row, never replaces.

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| `Tuna stirs Fathom` | `claude` | `Opus 4.8 (1M)` | `9767ba` | created this thread record (orphan-fix); reconciled the branch/ground instruction to the post-merge git reality (enablers committed on `docs/consolidations`); no spawn-flow build | 2026-06-30 | 2026-07-01 |
