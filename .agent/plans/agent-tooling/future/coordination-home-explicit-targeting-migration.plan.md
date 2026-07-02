---
name: "Coordination-Home Git Resolution — finish wiring the git-resolved home across the CLI (F-41 tail)"
overview: >
  Finish the F-41 path-safety arc. The core is now solved: `resolveCoordinationHome`
  resolves the PRIMARY checkout via `git worktree list` (commit c90150ffa), so an
  agent in any worktree on a machine resolves the one shared coordination home, and
  comms-send / comms-validate / tui default to it correctly regardless of cwd. The
  tail: the remaining write commands (claims open/close/heartbeat, comms inbox/watch,
  commit-queue) still take REQUIRED explicit path options, so a relative path from a
  linked worktree still resolves against cwd (the wrong copy). Default those options
  via the git-resolved home when omitted, and migrate the estate's invocations to
  omit them. Owner-deferred 2026-06-21 to sequence as one coordinated change.
status: future
type: developer-experience
related_frictions:
  - "F-41 (.agent/plans/agent-tooling/frictions-register.md) — core closed by B1+fix; this is the CLI tail"
related_plans:
  - "../current/agent-experience-improvement.plan.md"
related_doctrine:
  - "docs/architecture/architectural-decisions/197-coordination-home-owns-registry-state.md"
  - ".agent/practice-core/decision-records/PDR-055-cli-affordance-set-discipline.md"
  - ".agent/rules/no-machine-local-paths.md"
  - ".agent/rules/comms-all-channels-watcher.md"
  - ".agent/skills/commit/SKILL-CANONICAL.md"
landed_predecessor: "commits b5408291d (B1 consolidation) + c90150ffa (git-resolved home)"
last_updated: 2026-06-21
isProject: false
---

# Coordination-Home Git Resolution — the F-41 CLI tail

> **PROMOTED 2026-07-01** → [`../current/coordination-home-cli-path-defaulting.plan.md`](../current/coordination-home-cli-path-defaulting.plan.md)
> (executable). A live worktree-launch hit the hazard this brief describes; the executable
> plan carries the TDD cycles plus a new guard-integrity finding (the decoy comms dir +
> false watcher heartbeat defeat the F-95 guards). This brief remains the lineage/strategic
> source; execute from the `current/` plan.

**Status**: 🔵 FUTURE — strategic brief, queued. (Filename predates the
git-resolution reframe below; kept to avoid reference churn.) The proper question —
*"from any worktree on a machine, what one shared location do all worktrees
resolve to?"* — forced a far simpler answer than the "refuse bare-relative +
explicit `--repo-root` migration" this brief originally proposed.

## The mechanism (settled by c90150ffa)

The coordination home is the **primary (main) checkout**, resolved with
`git worktree list --porcelain` (its first entry is the main worktree, regardless
of which worktree `cwd` sits in). This is git-native, per-machine, worktree-aware,
and bakes in no machine-local path. It is the cure the F-41 register itself named
("via the git common dir") and aligns with ADR-197 (one checkout owns shared
registry state). `resolveCoordinationHome(cwd, {runGit})` already does this and
is wired into comms-send / comms-validate / tui defaults; the explicit
`--repo-root` override remains the escape hatch.

Cross-machine is out of scope: the collaboration filesystem is not shared across
machines, so cross-machine coordination (git sync / a network surface) is a
separate problem.

## The remaining tail

`claims open/close/heartbeat`, `comms inbox`, `comms watch`, and `commit-queue`
still `required(...)` their path options (`--active` / `--closed` / `--comms-dir`
/ `--seen-file`). So from a linked worktree, a relative path still resolves
against cwd — the worktree's own copy, the wrong registry. Two coordinated moves:

1. **Default those options via `resolveCoordinationHome` when omitted** — so the
   safe invocation is simply to *omit* the path and let the git-resolved home
   supply it (`--seen-file` carries the agent codename, so derive it as
   `<home>/.agent/state/collaboration/comms-seen/<codename>.json`). Keep explicit
   absolute / `--repo-root` overrides honoured (PDR-055 clause 7).
2. **Migrate the estate's invocations to omit the defaultable paths** — the
   canonical watcher rule (`comms-all-channels-watcher.md`), the commit skill
   (`SKILL-CANONICAL.md`), start-right, and ~a dozen tests pass relative paths
   today. They work from the primary checkout but resolve wrong from a linked
   worktree; migrating them to omit-the-path makes them correct from any worktree.
   This is non-breaking for the primary-checkout case (omitting resolves to the
   same place) and *fixes* the worktree case.

Refusing bare-relative outright is no longer necessary: defaulting via the
git-resolved home removes the cwd-sensitivity that made relative paths dangerous,
so the gentler "default + migrate to omit" achieves the safety without breaking
the estate's existing invocation contract.

## Acceptance (outcome-based)

- From a linked worktree, omitting the path options on claims / comms-inbox /
  watch / commit-queue resolves to the PRIMARY checkout's registry (proven by the
  resolver test pattern + an integration check from a real linked worktree).
- The migrated watcher rule, commit skill, and start-right invocations run green
  from both the primary checkout and a linked worktree; no live watcher bricked.
- F-41 closed in the register with the B1 + fix + this-tail landing SHAs.

## Sequencing

Land as one coordinated change (CLI defaulting + doctrine/skill invocation
migration + test sweep) when a session can absorb it. Pairs naturally with
adopting separate git worktrees per seat — the topology this whole arc serves.
