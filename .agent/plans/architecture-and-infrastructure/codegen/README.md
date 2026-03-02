# SDK Codegen Architecture

Plans and analysis for the `oak-sdk-codegen` workspace architecture.

**Status**: Future (post-M1 merge)
**Last Updated**: 2026-03-02

---

## Context

`packages/sdks/oak-sdk-codegen` conflates two distinct data lineages — the
OpenAPI API schema and bulk curriculum data — in a single workspace. This
causes ESLint OOM from ~688K lines of duplicated generated data, duplicated
generators, and unclear boundaries.

For M1 merge, the OOM is resolved pragmatically (ESLint ignores for large
data files). The deeper architectural work is captured here.

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

- **M1** (current): Pragmatic ESLint fix only (remove `NODE_OPTIONS`, add
  ignores for large data files)
- **Post-M1**: Workspace decomposition per the strategic plan
