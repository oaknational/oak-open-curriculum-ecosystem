---
classification: core
description: Never keep a list by hand when its truth lives elsewhere (owner ruling 2026-09-13, "compute don't hope") — derive it at the point of use from what the repository declares (manifests, ignore rules, directories, frontmatter, imports), or land it with a validator that recomputes it and fails on drift. Use when writing or editing any list, allow-list, exclusion list, index or table whose entries restate facts held elsewhere. Not for declarations that are themselves the source (a package manifest, an ignore rule, a validator's declared scope, a plan node's frontmatter). Failure shapes — a hand-kept bootstrap package list, its gap masked by a warm local build until CI's cold checkout failed; three validators each carrying a copy of one exclusion list; a "keep this in sync with X" comment.
---

# Compute, Don't Hope

Owner ruling (2026-09-13, verbatim): "nothing should be 'hand kept', ever, manual lists
are always going to be wrong eventually, and when they are we have to remember that they
exist, this is a general rule, compute don't hope".

## The Rule

A list whose truth lives somewhere else is never maintained by hand. It is computed from
that truth at the point of use, or it is gated by a validator that recomputes it and
refuses drift ([`validators-must-recompute-not-just-record`](validators-must-recompute-not-just-record.md)
is the gate-shaped half of this rule; this rule is the general form).

The test for "hand-kept": could the entries be derived from something the repository
already declares — a manifest, an ignore rule, a directory, a frontmatter field, the
imports of a file? If yes, the list is a copy of that truth, and a copy drifts the day the
truth moves while nobody remembers the copy exists.

What is **not** hand-kept: declared configuration that is itself the source of truth (a
package manifest, an ignore rule, a host profile, a plan node's frontmatter, a validator's
declared scope). Those are the things lists must be computed from. The line is: a
declaration states an intent; a list restates a fact.

## How to comply

1. **Derive.** Compute the set from its source at run time (the install-time build closure
   from the workspace manifests; the paths a validator may see from the tracked tree and the
   ignore rules; the strategy registry from the stream documents).
2. **Or gate.** Where derivation is genuinely impossible, the list lands with a validator that
   recomputes it from the source and fails on mismatch — the list is then a cache with a
   checker, not a hope.
3. **Never** land a list with a comment saying "keep this in sync with X". The comment is the
   confession that the list should have been computed.
4. **A check resolves against what the repository declares, never against what happens to be
   on the machine.** Twice in one afternoon (2026-09-13) a leg was green here and red in CI: a
   cited-paths validator found instance-tier state and a private boundary on this disk, and
   dependency-cruise found a built output a warm checkout carried; neither exists on a fresh
   checkout. Derive the closure from the tracked tree, the ignore rules and the manifests; a
   check that reads the local disk proves the local disk.

## Worked instances

- 2026-09-13, a transplant's first merge: the postinstall bootstrap built a hand-kept list of
  workspace packages; the ESLint plugin every config file imports was not on it, a warm local
  build output masked the gap, and CI's cold checkout failed dependency-cruise. OCE
  had hit the same class twice before. Cure: the closure is derived from the workspace
  manifests at run time; `agent-tools/src/bootstrap/install-time-closure.ts` defines its
  membership.
- 2026-09-13, the same afternoon: three validators each carried a copy of the same exclusion
  list, including entries that restated the ignore rules. Cure: the walker takes the tracked
  tree as its universe, so the ignore-class entries vanish; what remains is each validator's
  declared scope.
- 2026-09-12: a shared start-right workflow carried a hand-copied gate list, twelve of
  nineteen citations dead after a transplant. Cure: a cited-scripts validator resolves every
  citation against the root package manifest on every run.

## Provenance

This rule was first written in the jimcresswell.net Practice on 2026-09-13, at
[`.agent/rules/compute-dont-hope.md`](https://github.com/jimCresswell/jimcresswell.net/blob/main/.agent/rules/compute-dont-hope.md).
It is shared text between that Practice and the open-curriculum-ecosystem Practice, which
took it through the Practice Box exchange of 2026-09-24 (batch one). The one adaptation is
the worked instances, rewritten to name no host pull request.
