# OpenAPI Pipeline Framework Extraction

**Status**: Icebox
**Created**: November 2025
**Last Reviewed**: 23 February 2026
**ADR**: [ADR-108: SDK Workspace Decomposition](../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md)

## Concept

Replace `openapi-typescript` and `openapi-zod-client` with a single-pass,
config-driven generator framework (`@oaknational/openapi-to-tooling`) that
produces all SDK artefacts from an OpenAPI schema in one deterministic run:
TypeScript interfaces, Zod validators, MCP tool descriptors, client helpers,
enumerated constants, and JSON Schema companions.

This maps to Workspaces 1 (Generic Pipeline) and 3 (Generic Runtime) in the
4-workspace decomposition defined by ADR-108.

## Why Icebox

1. **Blocked** on SDK workspace separation (Step 1 of ADR-108), which is
   itself a merge blocker for the current branch.
2. **Speculative** — represents a distant future trajectory with no timeline.
3. **Current toolchain works** — post-processing of `openapi-zod-client`
   output (including the v3-to-v4 transform) is functional.

## Key Concepts Worth Preserving

- **Single-pass generation**: parse the schema once, share an IR across
  modular writers (types, zod, metadata, client, mcp, schema-json).
- **Manifest-driven output**: `GenerationResult` with `GeneratedFile[]`,
  enabling programmatic and CLI consumption.
- **Hook-based customisation**: `SchemaTransform`, `renameEnum`,
  `renameTool`, `sampleOverride` — Oak-specific logic stays outside the core.
- **Behavioural validation over snapshots**: assert type-safety, validation
  correctness, and MCP execution rather than byte-for-byte golden files.
- **Cross-schema robustness**: validate against Oak's schema plus at least
  two non-Oak reference schemas.

## Provenance

Consolidated from five detailed planning and requirements documents that
lived in `pipeline-enhancements/`:

- OpenAPI-to-MCP Framework Extraction Plan
- OpenAPI-to-Tooling Integration Plan
- Phase 4 Artefact Expansion Plan
- Schema-First Type & Validator Generator Client Requirements (two variants)

All were created November 2025 – February 2026, updated to reference ADR-108,
but never moved beyond PROPOSED/DRAFT status.

## Activation Criteria

1. SDK workspace separation (ADR-108 Step 1) is complete.
2. Current code-generation toolchain limitations create measurable pain.
3. Team capacity exists for a multi-week framework extraction.

## References

- [ADR-108: SDK Workspace Decomposition](../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md)
- [SDK Workspace Separation Plan](../semantic-search/active/sdk-workspace-separation.md)
