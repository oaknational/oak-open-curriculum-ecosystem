---
name: "Prove the Checker With an In-Repo Deliberate-RED Negative Control"
polarity: pattern
use_this_when: "Trusting any targeted checker run — a lint over specific paths, an advisory commit-message check, a one-off validator invocation — especially when the result is green."
category: process
proven_in: "markdownlint dot-directory false-greens (2026-06-12 paired controls) and argless commit-message advisory false-greens (two seats, 2026-06-11)"
proven_date: 2026-06-12
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Trusting a green checker run that checked nothing — four instances across two checker classes in one capture window."
  stable: true
---

> **POLARITY: PATTERN.** This is a shape to repeat: before trusting any
> targeted checker run, prove detection with a deliberately bad input
> through the same invocation.

## The failure shape

A green targeted check that never echoed your input checked NOTHING.
Worked instances:

- `markdownlint` without `--dot` matches ZERO files under any dot
  directory — it prints usage and exits 0, a structural false-green.
  Every targeted "markdownlint OK" on `.agent/**` paths run without
  `--dot` was void. The root script passes `--dot .`; targeted runs on
  dot-directory paths must too.
- markdownlint rejects absolute paths outside the repo (its ignore
  module requires relative paths), so a `/tmp` negative-control file
  cannot prove the runner — negative controls live INSIDE the repo
  (delete after).
- Two seats observed an argless advisory commit-message check exit 0
  (the false-green was environment-dependent — not reproducible from
  repo root on re-test — which is itself the point: you cannot know
  without the control).

## The shape

1. Run the checker over a deliberately bad input **through the same
   invocation shape** you intend to trust (same wrapper, same cwd, same
   flags).
2. Demand RED. A checker that stays green on the bad input is checking
   nothing — fix the invocation before reading any result from it.
3. Confirm the real run echoes/enumerates its inputs (a count, the
   linted file list, the message body) — a result with no evidence of
   inputs is not a result.

## Exception: a downstream unconditional gate makes the per-invocation control redundant

When the same input is *also* checked by a downstream gate that fires
**unconditionally** (no flags, no path-scoping that can silently match nothing),
the per-invocation negative control is redundant — trust the gate. The canonical
case: a commit message is gated by the `.husky/commit-msg` hook, which runs
`commitlint` on every commit; the pre-commit advisory checker is convenience, so a
per-commit deliberate-RED control on *it* tests the tool, not the message, and has
no bridge to the goal (a conforming commit). Run a one-off self-check on such a
checker only if you genuinely suspect it is broken on this machine — never as a
per-invocation ritual. The control earns its place precisely when there is **no**
such downstream gate (a targeted `markdownlint` run, a one-off validator) — the
green there could be a structural false-green with nothing else to catch it.

Sibling families: the green-verifier-without-count lesson and the
zero-hit-absence-claims-need-a-positive-control register candidate. The exception
above is the commit-skill reframe (the `commit-msg` hook is the real gate); see the
commit SKILL.
