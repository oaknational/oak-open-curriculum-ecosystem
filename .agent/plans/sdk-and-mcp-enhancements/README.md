# SDK and MCP Enhancements

This directory is the governance hub for SDK and MCP enhancement planning.

**Last Updated**: 22 February 2026

## Source of Truth Model

1. ADRs are the architecture source of truth.
2. Code is the current implementation source of truth.
3. Legacy plans are concept sources only.

## Current Execution Sources

Use these for active execution sequencing:

1. Pre-merge widget stabilisation (Tracks 1a + 1b):
   [`../semantic-search/active/widget-search-rendering.md`](../semantic-search/active/widget-search-rendering.md)
2. Search dispatch type safety (B1/W1):
   [`../semantic-search/archive/completed/search-dispatch-type-safety.md`](../semantic-search/archive/completed/search-dispatch-type-safety.md)
3. Post-merge MCP/extensions and ADR-aligned backlog:
   [`./mcp-extensions-research-and-planning.md`](./mcp-extensions-research-and-planning.md)

## Governance Documents

1. File-by-file disposition authority:
   [`./folder-disposition-ledger.md`](./folder-disposition-ledger.md)
2. Concept preservation and ADR supersession crosswalk:
   [`./concept-preservation-and-supersession-map.md`](./concept-preservation-and-supersession-map.md)
3. Completed folder modernisation orchestration record:
   [`./archive/completed/folder-modernisation-meta-plan.md`](./archive/completed/folder-modernisation-meta-plan.md)

## Archive Layout

All legacy materials are archived and should not be executed directly.

1. Legacy numbered plans:
   [`./archive/legacy-numbered/`](./archive/legacy-numbered/)
2. Implemented historical references:
   [`./archive/implemented/`](./archive/implemented/)
3. Historical notes and older archive plans:
   [`./archive/`](./archive/)
4. Raw data artefacts:
   [`./archive/data/`](./archive/data/)
5. Completed plans:
   [`./archive/completed/`](./archive/completed/)

## Workspace Context

Per [ADR-108](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md),
work in this area mainly touches:

- WS2: Oak Type-Gen
- WS4: Oak Runtime

Generator-first and schema-first remain non-negotiable.

## Usage Guidance

When using a legacy concept:

1. Extract the concept from archived sources.
2. Validate it against accepted ADR constraints.
3. Verify current-state claims in code.
4. Promote execution detail into an active plan, not an archived plan.
5. Add provenance links back to the archived source.
