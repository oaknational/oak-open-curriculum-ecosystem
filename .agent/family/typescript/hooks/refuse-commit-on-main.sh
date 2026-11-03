#!/usr/bin/env sh

# Shared branch guard (.agent/rules/never-commit-to-main.md): a default
# branch advances only via reviewed pull requests. The guard refuses `main`
# and `master` by name, in any case, and the branch `refs/remotes/origin/HEAD`
# names (the repository's default branch), each read the way `merge-bot push`
# reads it: the current branch through `git branch --show-current`, which a
# tag of the same name cannot shadow, and the default through the origin HEAD
# ref. So no repository's default-branch name is pinned here. A clone with no origin HEAD (`git
# remote set-head origin --auto` sets it) is guarded by the two names alone.
# Sourced by the .husky hooks that git routes commit-creating or ref-rewriting
# operations through — pre-commit (plain/amend commits), pre-merge-commit
# (clean merges), prepare-commit-msg (sequencer commits: cherry-pick, revert),
# applypatch-msg (git am, checked BEFORE the patch touches the tree so a patch
# cannot edit its own guard), and pre-rebase (a rebase rewriting a default
# branch). Each hook sets GUARD_HINT to its own recovery move; pre-rebase
# passes the branch under rebase via GUARD_BRANCH, and every other hook sets
# it EMPTY before sourcing so an ambient exported value cannot redirect the
# check (empty falls through to the checked-out branch). Hooks run with cwd
# at the working-tree top, so the .husky-relative source path resolves in the
# primary checkout and in every worktree. Detached-HEAD states (e.g.
# mid-rebase replays) resolve no branch name and pass. Residual vectors no
# client hook can see (fast-forward merges, fresh clones before install) are
# covered by the rule and by remote branch protection. Being sourced, the
# guard names its own variables `guard_*`. The current-branch read has no
# fallback: if git cannot answer (a git older than 2.22 lacks
# `--show-current`), the guard refuses with its own message, so it fails
# closed under any runner, whether or not that runner aborts on error.
guard_current_branch="${GUARD_BRANCH:-$(git branch --show-current)}" || {
  echo "❌ Refusing to commit: git could not name the current branch, so the guard cannot check it."
  echo "💡 Check that git 2.22 or later is first on PATH: git --version"
  exit 1
}
guard_origin_head="$(git symbolic-ref --quiet refs/remotes/origin/HEAD 2>/dev/null || true)"
guard_default_branch="${guard_origin_head#refs/remotes/origin/}"
guard_current_folded="$(printf '%s' "$guard_current_branch" | tr '[:upper:]' '[:lower:]')"
guard_default_folded="$(printf '%s' "$guard_default_branch" | tr '[:upper:]' '[:lower:]')"
guard_refused=""
case "$guard_current_folded" in
  main | master) guard_refused=1 ;;
esac
if [ -n "$guard_current_folded" ] && [ "$guard_current_folded" = "$guard_default_folded" ]; then
  guard_refused=1
fi
if [ -n "$guard_refused" ]; then
  echo "❌ Refusing to commit on '$guard_current_branch' — a default branch advances only via pull requests."
  echo "💡 ${GUARD_HINT:-Move the work to a branch: git switch -c <branch>}"
  exit 1
fi
