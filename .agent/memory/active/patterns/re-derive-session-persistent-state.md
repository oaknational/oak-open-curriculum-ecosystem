---
name: "Re-Derive Session-Persistent State Before Acting"
polarity: pattern
use_this_when: "Any resumed turn, shared-checkout git operation, or compose moment that relies on shell cwd, checked-out branch, the staged set, the clock, or a remembered in-flight action."
category: agent
proven_in: ".agent/memory/active/archive/ napkin window 2026-06-08 → 2026-06-12 (eight-plus worked instances across six seats)"
proven_date: 2026-06-12
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Acting on session state that a peer, another of your own earlier commands, or the clock has silently moved — misreading file state, absorbing foreign staged work, reporting frozen in-flight actions as remembered completions, or emitting stale loop arguments."
  stable: true
---

> **POLARITY: PATTERN.** This is a shape to repeat: re-derive
> session-persistent state from its authoritative surface immediately
> before acting on it.

## Principle

In shared checkouts and resumable sessions, session-persistent state is
**peer-mutable and time-mutable input, never memory**. This covers the
shell cwd, the checked-out branch, the git index, working-tree files,
the wall clock, loop/heartbeat arguments, and any "I just did X"
recollection across a freeze or pause. A value derived earlier in the
session has the standing of a hypothesis.

## The moves

- On ANY resumed turn: `date -u` first; then re-verify every
  claimed-done external action against its authoritative surface
  (`gh`, `git`, the comms dir), citing that surface's own timestamps —
  a frozen in-flight action can complete on wake and read as a
  remembered completion (worked instance: a merge reported ~8h earlier
  than its real `mergedAt`).
- Before ANY git-state operation in a multi-checkout or multi-agent
  session: re-derive `pwd` and `git rev-parse --abbrev-ref HEAD` plus
  `git log -1` — branches move under paused sessions, and an earlier
  `cd` in a compound command persists across calls (read- and
  write-direction crashes both observed).
- Re-derive the staged set from a fresh `git status` immediately before
  every staging or commit action; verify `git diff --cached --name-only`
  against the intended bundle — peers commit and stage into shared trees
  mid-session.
- Loop/cron/heartbeat arguments derive from registry state at emit
  time, never baked at arm time.
- A peer's recorded next-step (continuity entry, handoff note) is a
  hypothesis, superseded by later owner direction or live state.
- Worktree git operations always use `git -C <worktree>`; branch
  creation is `git switch -c` (checkout's overloaded surface is
  guard-blocked); `gh pr merge` of the branch you sit on auto-switches
  to the default branch and pulls.

## Why it holds

Eight-plus instances in one capture window (2026-06-08 → 2026-06-12)
across six independent seats, in both directions (acting agent and
observed peer), with zero misfires once the re-derive moves were
adopted. The same class generated: a "lost" committed report (branch
moved), a peer's 4-file staged bundle absorbed by `git commit` (index
is whole, `git add` is pathspec-scoped), and two phantom-liveness
misreads from comparing UTC comms timestamps against local-display
mtimes (compare like-for-like in UTC only).
