# ADR-197: Coordination-Home Checkout Owns Shared Registry State

**Status**: Accepted
**Date**: 2026-06-11 (convention owner-ratified in the graph-team opener 2026-06-10;
trial-validated live the same day; ADR authoring owner-approved 2026-06-11)
**Related**:
[ADR-176](176-commit-skill-advisory-orchestrator-naming.md) — commit-skill advisory orchestrator
naming; the commit ceremony whose registry writes this ADR re-homes (its advisory/blocking
polarity is unchanged here);
[ADR-177](177-asymmetric-cure-enforcement-in-staging.md) — asymmetric-cure enforcement for
staging; the per-commit bundle-boundary discipline that this ADR extends to the branch level
(a feature branch, like a staged bundle, carries exactly its authored content);
the [commit-skill canonical](../../../.agent/skills/commit/SKILL-CANONICAL.md) — its four
operational moves write the shared registries on every commit, and its "collaboration-state
commit residue exception" is the single-checkout precursor of this decision;
[PDR-064](../../../.agent/practice-core/decision-records/PDR-064-coordinator-handoff-two-moments.md)
— coordinator handoff two-moments shape; the Director role that owns the coordination home
transfers by PDR-064, so the home outlives any individual holder;
the [graph-implementation team opener](../../../.agent/prompts/connecting-oak-resources/graph-implementation-team.prompt.md)
— the owner-ratified statement of the convention this ADR records, including the branching
strategy that resolves its conflict semantics;
validation evidence:
[`graph-team-first-worktree-run-analysis-2026-06-10.md`](../../../.agent/reports/graph-team-first-worktree-run-analysis-2026-06-10.md)
§1 and §6.
Operationalised by the rules `stage-by-explicit-pathspec`, `no-machine-local-paths`,
`important-state-not-in-temp-files`, and `agent-state-observable`.

## Context

The multi-agent collaboration registries are versioned repo files under
`.agent/state/collaboration/`: `active-claims.json` (which also carries the `commit_queue`),
`closed-claims.archive.json`, the comms event store (`comms/`, `comms-seen/`), the rendered
`shared-comms-log.md`, and the handoff records. Versioning them is deliberate — the audit trail
(`claim_id` ↔ `intent_id` ↔ commit SHA ↔ closure summary) is durable, observable state, not
temp-file residue.

The commit ceremony writes those registries on **every** commit: opening the `git:index/head`
claim writes `active-claims.json`; the queue ceremony (`enqueue` → `record-staged` → `commit`)
writes `commit_queue` entries into the same file; closing the claim writes both
`active-claims.json` and `closed-claims.archive.json`. The structural consequence: if registry
state rides feature-branch commits, **any two open PRs collide by construction** — both carry
diverging writes to the same always-written files, regardless of how disjoint their source
changes are.

This was a worked failure, not a hypothesis. On the morning of 2026-06-10, PR #146 went
CONFLICTING on `active-claims.json` / `closed-claims.archive.json` within minutes of opening,
while concurrent sessions kept committing; the cure was resetting the registry files to main's
content so the PR carried a pure policy diff. The commit-skill canonical's residue exception
(folding lifecycle closure into the same collaboration-state commit) addresses the within-commit
audit-trail seam but not this cross-PR class: every ceremony in a shared checkout still writes
the same shared files.

The worktree team shape (one Director plus per-session implementer worktrees) then sharpened the
question: coordination state is repo-file-based, so three worktrees would mean three diverging
copies of `.agent/state/`. The underlying tension is audit-trail durability versus cross-PR
conflict generation — both wanted, neither negotiable.

## Decision

**Exactly one checkout — the coordination home — owns all shared registry state. Feature PRs are
pure diffs by construction. Where a cross-PR registry conflict arises anyway, main's version of
the registry wins, never the branch's.**

### The coordination home

- One checkout per team session is the coordination home: the Director's primary checkout, on
  one long-lived Director-owned `docs/<team>-<date>` branch with a sole writer. It holds all
  `.agent/state/` and `.agent/memory/` writes and lands them as `docs(continuity)` commits,
  pushed at waypoints; the branch is never PR'd mid-arc and never rebased.
- The collaboration CLIs are fully path-parameterised (`--comms-dir`, `--active`,
  `--repo-root`), so every seat points every comms/claims/queue invocation at the coordination
  home by absolute path, resolved at session open. A machine-local path is never written into a
  versioned file (`no-machine-local-paths`).
- The Director role, not the individual, owns the home. Role succession transfers it via
  PDR-064's two moments; the registries persist across holders.

### Pure-diff implementer PRs by construction

Implementer feature branches are cut from current `origin/main` in the seat's own worktree and
landed as one small PR per deliverable. Because every commit ceremony's registry writes land in
the coordination home — a different checkout — no collaboration-registry or continuity file can
ride a feature branch. The PR diff is exactly the authored source change. This is structural,
not disciplinary: the implementer's worktree contains no registry write to accidentally stage.

### Registry conflicts resolve to main

Registry truth lives at the coordination home and, once landed, on `main`. A feature branch's
copy of any registry file is stale residue by definition. Therefore:

- A cross-PR conflict on a registry file resolves to **main's version of the registry, never the
  branch's** — the cure applied to PR #146 is the standing rule.
- When the Director merges `origin/main` into the coordination home (forward-only, merge commit,
  never rebase), conflicts resolve main-authoritative for source and generated files and
  branch-authoritative for coordination state — the home is the live writer of that state, ahead
  of main by construction. Drift baselines are always `origin/main`, never branch HEAD.

### Scope

The convention governs any multi-checkout (worktree-team) operation. A single-checkout session
satisfies it trivially — the one checkout is the coordination home — and continues to use the
commit-skill canonical's residue exception for self-contained collaboration-state commits.

## Consequences

- **Positive — validated, not predicted.** The first live run (2026-06-10) put five
  concurrent-window PRs (#152–#156) through merge in under three hours of parallel implementer
  work with zero registry conflicts, zero index/HEAD races, and zero cross-agent gate coupling —
  the cross-PR `active-claims.json` conflict class of that same morning did not recur. The
  Director's analysis names the load-bearing pair explicitly: the claim on `.agent/state/**`
  plus pure-diff implementer PRs meant every coordination write had exactly one owner, which is
  why the conflict class vanished (report §1, §6).
- **Positive.** The tension dissolves rather than trades off: the audit trail stays durable and
  versioned (landed from the home as `docs(continuity)` commits) AND feature PRs stay
  conflict-free, reviewable as pure source diffs.
- **Positive.** Conflict resolution on registry files is now mechanical — main wins — instead of
  a per-conflict judgement over interleaved lifecycle writes.
- **Cost.** Every seat must resolve the coordination home's absolute path at session open, and
  the path-parameterised CLI flags must be carried on every invocation; an unparameterised call
  silently writes to the wrong checkout's copy.
- **Cost.** The Director seat serialises registry writes. At the validated scale (five merges,
  one team) the serialisation cost was approximately zero; whether it stays sublinear as cast
  size grows is the named open observation in the validation report.
- **Migration.** None required for source code. The convention is operative in the team opener's
  entry ritual; single-checkout sessions are already compliant.

## Alternatives considered

- **Keep registry writes out of feature-PR commits by discipline alone** (state stays
  working-tree-local until a dedicated continuity commit). Reduces but does not remove the
  class in a shared checkout: every ceremony still writes the same shared files in one tree, and
  index/HEAD races and full-tree gate coupling across agents remain. The worktree-plus-home
  shape removes all three structurally (report §1).
- **A dedicated state branch in each checkout.** Adds branch-switching and merge surface to
  every commit ceremony without removing multi-writer contention on the registries themselves.
- **Out-of-tree (unversioned) state.** Removes conflicts by removing the audit trail — rejected
  by the standing doctrine that important coordination state is versioned and observable, never
  temp-file residue.
