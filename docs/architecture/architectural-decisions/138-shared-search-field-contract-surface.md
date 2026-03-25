# ADR-138: Shared Search Field Contract Surface

**Status**: Accepted
**Date**: 2026-03-15
**Related**: [ADR-030 (SDK as Single Source of Truth)](030-sdk-single-source-truth.md), [ADR-067 (SDK Generated Elasticsearch Mappings)](067-sdk-generated-elasticsearch-mappings.md), [ADR-121 (Quality Gate Surfaces)](121-quality-gate-surfaces.md)

## Context

Semantic-search field-integrity work requires multiple workspaces to reason about the same field set and stage expectations:

- `apps/oak-search-cli` needs ingest and readback audit checks.
- `packages/sdks/oak-search-sdk` needs retrieval contract checks.
- CI and operator evidence need a common field vocabulary.

Before this decision, field assumptions were duplicated across tests and operational scripts, making drift likely when generated mappings or schemas changed.

## Decision

Introduce `@oaknational/search-contracts` in `packages/libs/search-contracts` as the shared contract surface for search field integrity.

The package exports:

- schema/mapping-derived field inventory (`SEARCH_FIELD_INVENTORY`);
- stage matrices for ingest and retrieval (`STAGE_CONTRACT_MATRIX`);
- supporting constants/types used by test and audit tooling.

Field data remains derived from `@oaknational/sdk-codegen/search` so source-of-truth ownership stays with generated artefacts.

## Rationale

1. **Single contract surface**: All field-integrity tests and audits consume one canonical inventory.
2. **Drift resistance**: Integration tests in `search-contracts` enforce parity against generated schemas/mappings.
3. **Boundary clarity**: Contract definitions live in `packages/libs/` and are consumed by apps/sdks without re-deriving rules per consumer.
4. **Operational consistency**: Readback audits and CI suites report against the same field/stage model.

## Consequences

### Positive

- Reduced duplication and reduced risk of field-name drift across ingest/retrieval checks.
- Easier expansion to new index families via a single package update.
- Cleaner review and debugging because failures map to a shared vocabulary.

### Trade-offs

- New package boundary to maintain in workspace docs and lint boundaries.
- Consumers must respect contract-only usage and avoid adding business logic into the contracts package.

## References

- `packages/libs/search-contracts/README.md`
- `packages/libs/search-contracts/src/field-inventory.integration.test.ts`
- `.agent/plans/semantic-search/archive/completed/field-integrity-test-manifest.json`
