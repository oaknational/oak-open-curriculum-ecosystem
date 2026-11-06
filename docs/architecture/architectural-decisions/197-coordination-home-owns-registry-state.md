# ADR-197: Coordination-Home Checkout Owns Shared Registry State

**Status**: Accepted (Revised 2026-07-29)
**Date**: 2026-06-11 (convention owner-ratified in the graph-team opener 2026-06-10;
trial-validated live the same day; ADR authoring owner-approved 2026-06-11;
coordination-home defaulting revision 2026-07-29)
**Related**:
[ADR-176](176-commit-skill-advisory-orchestrator-naming.md) — commit-skill advisory orchestrator
naming; the commit ceremony whose registry writes this ADR re-homes (its advisory/blocking
polarity is unchanged here);
[ADR-177](177-asymmetric-cure-enforcement-in-staging.md) — asymmetric-cure enforcement for
staging; the per-commit bundle-boundary discipline that this ADR extends to the branch level
(a feature branch, like a staged bundle, carries exactly its authored content);
the [commit-skill canonical](../../../.agent/skills/change-custody/commit/SKILL-CANONICAL.md) — its four
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
Operationalised by the rules `stage-by-explicit-pathspec`,
`important-state-not-in-temp-files`, and `agent-state-observable`, and by the
machine-local-path enforcement surface (principles.md §No machine-local paths;
the `validate-no-machine-local-paths` repo-validator and write hook).

## Context

The multi-agent collaboration registries are versioned repo files under
`.agent/state/collaboration/`: `active-claims.json` (with, since registry schema 1.4.0, the
per-intent `commit-queue/` store beside it — machine-local ephemera, never versioned),
`closed-claims.archive.json`, the comms event store (`comms/`, `comms-seen/`), the rendered
`shared-comms-log.md`, and the handoff records. Versioning them is deliberate — the audit trail
(`claim_id` ↔ `intent_id` ↔ commit SHA ↔ closure summary) is durable, observable state, not
temp-file residue.

The commit ceremony writes those registries on **every** commit: opening the `git:index/head`
claim writes `active-claims.json`; the queue ceremony (`enqueue` → `record-staged` → `commit`)
writes intent files into the `commit-queue/` store beside it; closing the claim writes both
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
- Collaboration tooling must resolve shared-state operations to the coordination home by default,
  regardless of which linked worktree invokes it. A deliberate alternate home remains an
  explicit caller choice through `--repo-root` or the declared
  `PRACTICE_COORDINATION_HOME`, ahead of git-native resolution. Explicit watcher destination
  paths may target another stream, but they do not redefine the canonical home or mint canonical
  F-95 proof: watcher heartbeats bind to the actual absolute comms source and canonical readers
  reject a source mismatch. Machine-local paths are runtime inputs only and are never written
  into a versioned file (principles.md §No machine-local paths, mechanically enforced).
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
- **Cost.** Default resolution depends on the repository's checkout topology and must fail loud
  when the coordination home cannot be established. A caller selecting an alternate home owns
  that explicit choice.
- **Cost.** The Director seat serialises registry writes. At the validated scale (five merges,
  one team) the serialisation cost was approximately zero; whether it stays sublinear as cast
  size grows is the named open observation in the validation report.
- **Migration.** Tooling that touches shared state must converge on this default-resolution
  outcome. Single-checkout sessions remain the degenerate compliant case.

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

## Change log

- 2026-09-04 — Context corrected for registry schema 1.4.0 (PR #38, MCP-612): the commit queue
  is no longer carried by `active-claims.json`; it is the per-intent `commit-queue/` store beside
  the claims file at the coordination home — machine-local TTL ephemera by the owner's
  QUEUE-LOCAL ruling (2026-08-17), never versioned. The decision is unchanged: the claims file and
  the closed-claims archive stay versioned at the coordination home; the queue is the ruled
  exception to the "versioned and observable" doctrine named under Alternatives, as ephemera
  rather than audit trail (the `claim_id` ↔ `intent_id` ↔ commit SHA trail survives in the
  closure summaries).
