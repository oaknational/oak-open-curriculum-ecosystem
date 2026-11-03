---
classification: core
description: Never commit on main locally. main advances only via pull requests; branch first. Shared husky branch guards refuse commit-creating operations on main; remote branch protection is the invariant.
---

# Never Commit to Main

Local `main`, and whatever branch `origin/HEAD` names, receives no commits,
ever. A default branch advances only via reviewed pull requests. This covers every commit-creating operation — `git commit`,
`git merge`, `git cherry-pick`, `git commit --amend`, and any operation that
moves the `main` ref (e.g. `git pull --rebase` on a diverged `main`) — run
while `main` is the checked-out branch, in the primary checkout or any
worktree.

## Trigger

Any commit-creating git operation is about to run, or a session discovers
work-in-progress sitting on a checkout of `main`.

## Action

Branch first: `git switch -c <branch>` (staged and unstaged changes travel
with the switch), then commit on the branch and land via a pull request.

If commits are discovered already sitting on local `main` (the failure this
rule exists to prevent), do not push and do not delete them: fetch first
(`git fetch origin` — an unfetched `origin/main` ref is a cached read of a
moving target), preserve the commits on a branch (`git switch -c <branch>`),
re-home `main` to the remote (`git branch -f main origin/main` while `main`
is not checked out — git itself refuses if any worktree has it checked out),
and land the branch via a pull request.

## Failure Mode Prevented

Remote `main` is protected (pull requests required, non-fast-forward pushes
blocked, required status checks), so locally-authored `main` commits can
never be pushed directly — they strand, and while they sit, remote `main`
moves. Worked instance (2026-07-08): a session landed three commits on local
`main`; by discovery, remote `main` had advanced eleven commits, leaving a
diverged local `main` that took a preserve-and-re-home surgery plus a
pull request to resolve.

## Enforcement

Mechanical for every commit-creating or ref-rewriting path git exposes a
usable hook for; the shared guard `.husky/refuse-commit-on-main.sh` is
sourced by five hooks, each covering the path git actually routes it
through. OCE's guard refuses `main` and `master` by name, in any case, and
the default branch `refs/remotes/origin/HEAD` names, so a repository whose
default branch has another name is guarded too while `origin/HEAD` is set
(`git clone` sets it; `git remote set-head origin --auto` restores it);
jimcresswell.net's guard refuses `main` by name and takes that form at the
parity queue's code landing:

- `pre-commit` — plain `git commit` and `git commit --amend`;
- `pre-merge-commit` — clean merges, including a reflexive `git pull` on a
  diverged `main`;
- `prepare-commit-msg` — sequencer commits (`git cherry-pick`, `git revert`),
  which stay on the branch and never reach `pre-commit`;
- `applypatch-msg` — mailbox applies (`git am`), checked BEFORE the patch
  touches the tree, so the guard that runs is always the committed one (a
  patch cannot neuter its own guard first — `pre-applypatch` runs
  post-application and lacks that property);
- `pre-rebase` — a rebase that would rewrite `main` (including
  `git pull --rebase` on a diverged `main`), and a rebase of any branch
  whose rewritten range contains `main` — the state in which
  `--update-refs` (or `rebase.updateRefs=true`) would force-move `main`
  from a topic-branch rebase. The flag itself is invisible to the hook,
  so the state is refused, not the flag detected.

The guard fails closed: if the shared guard file is missing, every sourcing
hook aborts non-zero rather than passing silently.

Residual vectors NO client-side hook can see remain **rule-covered only**:
a fast-forward merge (a ref update, no commit created — and `git pull` on
`main` is the legitimate fast-forward from `origin/main`, so no hook could
distinguish the sanctioned case), a
fresh clone before `pnpm install` wires `core.hooksPath`, and a clone with no
`origin/HEAD` (an `-o upstream` clone, or `git init` plus `remote add`), which
the literal names alone guard. Remote branch
protection (pull requests required, non-fast-forward pushes blocked) is the
invariant that holds regardless; the guards are local hygiene that fails
fast.

This rule has no exception an agent may use or argue from. A hook bypass
does not lift it: `--no-verify` (itself governed by
[`no-verify-requires-fresh-authorisation`](no-verify-requires-fresh-authorisation.md))
covers hook execution only — even with a bypass authorised for another
reason, `main` still receives no local commits. Release automation is
outside this rule's audience and handles its own writes; its mechanics are
not agent-facing knowledge.

## Related Surfaces

- [`.husky/refuse-commit-on-main.sh`](../../.husky/refuse-commit-on-main.sh)
  — the shared mechanical gate, sourced by `pre-commit`, `pre-merge-commit`,
  `prepare-commit-msg`, `applypatch-msg`, and `pre-rebase`.
- [PDR-126](../practice-core/decision-records/PDR-126-gates-land-strict-in-one-landing.md)
  — this gate landed strict with conformance in one landing (the stranded
  commits were re-homed in the same change).
- [`never-use-git-to-remove-work`](never-use-git-to-remove-work.md) — the
  recovery shape preserves the stranded commits on a branch; nothing is
  discarded.
- [The commit skill](../skills/change-custody/commit/SKILL-CANONICAL.md) — carries this
  prohibition at the workflow moment.
