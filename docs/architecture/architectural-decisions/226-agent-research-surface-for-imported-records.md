# ADR-226: `.agent/research/` as the Research Surface for Imported Records

- **Status:** Accepted (2026-08-31; owner-ratified via PR #27 review and merge)
- **Date:** 2026-08-30
- **Related:** [ADR-215](215-top-level-research-surface.md) — superseded by this
  decision; [ADR-041](041-workspace-structure-option-a.md) — workspace tier
  structure, unchanged

## Context

ADR-215 introduced a top-level `research/` surface for the imported
`web-app-deconstruction` research record. On 2026-08-30 that record relocated to
[`.agent/research/innovation-kit/web-app-deconstruction/`](../../../.agent/research/innovation-kit/web-app-deconstruction/README.md)
as historical analysis and examples, retiring its nested package workspace, and
the top-level surface retired with it. The durable decisions ADR-215 carried —
how an externally authored record enters a public repository, and how records
relate to the workspace lattice — outlive the surface and need a live authority.

## Decision

1. `.agent/research/` is the research surface for imported research records.
   Repository tooling recognises it (prose-format and markdown-lint exemptions
   cover the subtree). ADR-041's tier enumeration and dependency-direction
   matrix are unchanged.
2. An imported record enters as a faithful public projection: its documents keep
   their source bytes and stay exempt from house prose formatting; the
   presumption is publication, withholding only owner-directed material for
   which a specific potential harm can be shown; private-repository permalinks
   are reduced to plain-text citations (file name, line range, pinned revision)
   resolved by a stable index in the private source repository; public
   permalinks stay live.
3. Records are self-contained: no product workspace imports from a record, and a
   record imports no product workspace.
4. A record's executable content is held to OCE gates; only its dependency-free
   leaf packages may be registered in the workspace, and the record's own
   integrity harness stays authoritative for its internal discipline.

The
[research index](../../../.agent/research/README.md#importing-external-research-records)
operationalises this pattern for future imports.

## Consequences

- ADR-215 is superseded by this record. Its file keeps the original decision
  text under a supersession banner, and the exact pre-relocation record is
  pinned at commit `4915fe182`.
- The relocated corpus is historical analysis, not maintained product code; the
  corpus README's preservation boundary states exactly what the relocation
  preserves.
- Future research imports follow the pattern above without re-deriving it.
