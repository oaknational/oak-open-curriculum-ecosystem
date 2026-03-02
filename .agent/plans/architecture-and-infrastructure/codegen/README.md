# SDK Codegen Architecture

Plans and analysis for the `oak-sdk-codegen` workspace architecture.

**Status**: Future (post-M1 merge)
**Last Updated**: 2026-03-02

---

## Context

`packages/sdks/oak-sdk-codegen` conflates two distinct data lineages — the
OpenAPI API schema and bulk curriculum data — in a single workspace. This
causes duplicated generators and unclear boundaries.

The ESLint OOM (caused by ~688K lines of generated graph data) has been
resolved structurally:

1. **Deduplicated graph data** — vocab-gen now writes to `src/generated/vocab/`
   (single canonical location). Six orphaned duplicate files deleted from
   `src/mcp/`.
2. **Split the `vocab` subpath** — `./vocab` exports types + concept graph
   only; new `./vocab-data` exports runtime graph data. No linted file
   transitively imports the large data.
3. **Excluded from lint program** — `src/generated/vocab/**` and
   `src/vocab-data.ts` are in `tsconfig.lint.json` exclude and ESLint ignores.

The remaining architectural debt (generator duplication, naming, workspace
decomposition) is captured here.

## Documents

| File | Role |
|------|------|
| `future/sdk-codegen-workspace-decomposition.md` | Strategic plan: decompose into two workspaces |
| `sdk-codegen-architecture-analysis.md` | Research: complete structural analysis |
| `sdk-codegen-reviewer-findings.md` | Research: reviewer findings and owner corrections |

## Key Decision

The owner directed splitting `oak-sdk-codegen` into two workspaces aligned
with data lineage:

- **`oak-sdk-api-codegen`** — OpenAPI schema to types, Zod, MCP descriptors
- **`oak-sdk-bulkdata-codegen`** — Bulk data to curriculum graphs, synonyms

See the strategic plan for details, rationale, and cross-lineage dependency
analysis.

## Milestone Alignment

- **M1** (complete): Graph data deduplication, `vocab`/`vocab-data` subpath
  split, ESLint OOM fixed structurally (no `NODE_OPTIONS`)
- **Post-M1**: Workspace decomposition per the strategic plan
