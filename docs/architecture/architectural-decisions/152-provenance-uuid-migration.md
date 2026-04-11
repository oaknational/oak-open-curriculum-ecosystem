# ADR-152: Provenance UUID Migration

**Status**: Accepted
**Date**: 2026-04-03
**Related**: [ADR-124](124-practice-propagation-model.md)

## Context

The Practice Core's `provenance.yml` uses sequential integer `index` fields
to identify entries in each trinity file's provenance chain. ADR-124
established the provenance chain mechanism for tracking Practice evolution
across repos.

Sequential indices create a readability problem: `index: 17` reads as "more
evolved than index: 5." The provenance chain is a timeline, not a ranking —
repos evolve independently and a later entry does not imply superiority. The
`date` and `purpose` fields carry the meaningful ordering and context; the
identifier should be neutral.

As the Practice propagates to more repos, sequential indices also create merge
friction when chains diverge and need reconciliation, and cross-reference
fragility if any future mechanism references specific entries.

This migration was first applied in `agent-collaboration` during a Practice
hydration that exposed several operational-surface failures. The UUID format
was validated as a clean, one-time migration with no issues.

## Decision

Replace all `index: N` (integer) fields in `provenance.yml` with
`id: <uuid-v4>` (string) fields. Update the field specification in
`practice-lineage.md` accordingly.

- Each entry receives a fresh UUID v4, unique across all chains.
- The `repo`, `date`, and `purpose` fields are unchanged.
- Array order and `date` preserve the timeline; `id` is for identity only.
- No backwards compatibility shim. Receiving repos that still have `index`
  convert to `id` during integration in one pass.

## Consequences

- **Positive**: No implied hierarchy. Collision-free across repos. Stable
  identifiers that survive structural changes.
- **Negative**: UUIDs are less human-scannable than small integers. Mitigated
  by `date` and `purpose` providing the meaningful context.
- **Migration**: One-time, mechanical. 63 existing entries converted in this
  repo; receiving repos convert during their next integration pass.

## Non-Goals

- This ADR does not change the provenance chain semantics (append-only,
  per-file, evolving repos add entries).
- This ADR does not introduce cross-referencing between provenance entries
  and other artefacts — that is a future consideration that motivated the
  stable-identifier choice.
