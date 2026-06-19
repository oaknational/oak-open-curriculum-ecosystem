---
name: "Deleting an Operational Memory/State Surface → Reconcile the Substrate-Contracts Manifest in the Same Commit"
polarity: pattern
use_this_when: "Retiring or deleting an operational memory or state surface (a directory, register, or convention) that may have a contract entry in the PDR-049/050 substrate manifest."
category: agent
proven_in: ".agent/memory/executive/memory-state-substrate-contracts.manifest.json — tracks/ + workstreams/ deletion, 2026-06-19 (Drake lifts Obsidian)."
proven_date: 2026-06-19
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Deleting a memory/state surface while leaving its substrate-manifest contract entry declaring lifecycle: live — a live contract for a dead surface that no blocking gate catches."
  stable: true
---

> **POLARITY: PATTERN.** A shape to repeat: grep the substrate manifest and
> reconcile the deleted surface's contract entry in the deletion commit.
> See [`README.md` § Polarity](README.md#polarity-required-every-pattern).

# Deleting an Operational Memory/State Surface → Reconcile the Substrate-Contracts Manifest

## Principle

The PDR-049/050 substrate-contracts manifest
(`.agent/memory/executive/memory-state-substrate-contracts.manifest.json`)
declares a contract per operational memory/state surface, including a
`"lifecycle"` field and a `historical_root`. When a surface is retired or
deleted, the manifest can be left declaring that surface with
`"lifecycle": "live"` — **a live contract for a dead surface**. The coherence of
the manifest is part of the deletion, not a follow-up.

**Why a pre-commit-only mental model misses it:** no *blocking* gate catches this
drift. It is surfaced by `validate-full-target-estate` (an informational report),
not by a pre-commit validator — so a pre-commit-only check, or an agent who
assumes the gates would catch it, will miss it. (This is the recurring-miss the
pattern prevents, and it names a real **gate gap**: manifest-drift-on-surface-
deletion has no blocking validator.)

## The move

When retiring or deleting an operational memory/state surface, in the same commit:

1. `grep` the substrate manifest for the surface's contract entry and its
   `historical_root`.
2. Reconcile both — update the lifecycle to reflect the deletion (or remove the
   entry per the manifest's own conventions for retired surfaces).
3. Land the reconciliation in the deletion commit, not a later coherence pass.

## Worked instance — 2026-06-19 (Drake lifts Obsidian)

Tranche B deleted `tracks/` + `workstreams/`. `validate-full-target-estate`
caught that the manifest still declared `memory-operational-tracks` with
`"lifecycle": "live"`. No blocking gate had flagged it; it was reconciled in the
same deletion commit once the informational report surfaced it.

## Related

- [`migrate-dont-drop-on-deletion`](migrate-dont-drop-on-deletion.md) — the
  broader "deletion has obligations beyond removing the files" discipline.
- [`validate-full-target-estate`](../../rules/validate-full-target-estate.md) —
  the rule whose informational report catches this; this pattern is the
  surface-deleter's checklist that makes the report's finding moot.
- [`governance-claim-needs-a-scanner`](governance-claim-needs-a-scanner.md) — the
  gate gap (manifest drift on deletion) is a candidate for a blocking scanner.
