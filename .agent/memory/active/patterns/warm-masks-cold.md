---
name: warm-masks-cold
polarity: anti-pattern
category: architecture
use_this_when: >-
  Declaring a dist-consumed package, install-time hook, or environment-touching
  surface "proven" from a long-lived local tree — or diagnosing a failure that
  only appears on CI, a fresh worktree, or a cold clone.
proven_in: >-
  Four instances in one lane plus one out-of-lane (2026-08-09): fresh-worktree
  eslint and knip crashes on unbuilt dists; a CI postinstall cold-install death
  (the workspace-config bootstrap-ordering blocker, cured on PR #836); a
  deliberately-failed probe leaving residue only failure paths create; and the
  primary repo discovered silently SHALLOW (three boundary entries in
  .git/shallow) only when a merge failed "unrelated histories". Conserved in
  .agent/memory/active/archive/napkin-2026-08-14.md (2026-08-09 entries).
proven_date: 2026-08-09
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: >-
    Warm-tree state (built dists, populated caches, full history, happy-path
    residue) silently satisfies preconditions cold environments lack, so
    cold-start defects ship green and surface as CI mysteries.
  stable: true
---

> **POLARITY: ANTI-PATTERN.** This entry names a *failure mode to avoid*,
> not a shape to repeat.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern)
> for the polarity discipline.

## The failure shape

**State that every long-lived local tree accumulates — and no fresh
environment has — masks cold-start defects.** A dist-consumed package has
THREE consumer classes: turbo-ordered builds, direct invocation, and
install-time hooks; only cold environments exercise the third. The warm
tree's built dists, caches, and full clone history satisfy preconditions
silently, so "it works here" is evidence about the warm tree only.

Two sub-shapes recorded first-hand:

- **Warm-green, cold-dead.** The migrated tsup configs imported a
  dist-resolved package at install time; every warm machine had the dist,
  so install died only on cold checkouts (CI, fresh clones).
- **Substrate silently partial.** A tool proceeding happily on a partial
  substrate (a shallow clone, a residue-carrying failure path) reads as
  healthy until an operation needs the missing part.

## The cure

Before declaring a NEGATIVE or a "proven" on anything dist-consumed,
install-time, or substrate-dependent, name which consumer class the
evidence exercised — and prove the cold class deliberately (a fresh
worktree build, a cold-install run, an unshallow check), never by
inference from warm success. Hygiene checks calibrated on happy-path runs
also miss failure-path residue: probe the failure path once.

## Falsifier

A cold-start defect this pattern's checks would catch shipping through a
lane that applied them — that argues the estate needs the structural
bootstrap-closure gate (the #836 follow-up class) extended, not a longer
checklist.

## Related

- `principles.md` §Any User, Any Machine — the review lens this pattern
  gives teeth at the package/build layer.
- [`lockfile-rebuild-survivability`](../../../rules/lockfile-rebuild-survivability.md)
  — the same cold-vs-warm discipline at the dependency layer.
