# ADR-130: Zero-Downtime Blue/Green Elasticsearch Index Swapping

**Status**: Accepted
**Date**: 2026-03-07
**Deciders**: Development Team
**Related**: [ADR-067](067-sdk-generated-elasticsearch-mappings.md), [ADR-087](087-batch-atomic-ingestion.md), [ADR-088](088-result-pattern-for-error-handling.md), [ADR-093](093-bulk-first-ingestion-strategy.md)

## Context

The search service is approaching public launch. Currently the six curriculum indexes (`oak_lessons`, `oak_units`, `oak_unit_rollup`, `oak_sequences`, `oak_sequence_facets`, `oak_threads`) exist as **bare concrete Elasticsearch indexes** — not aliases. This creates three operational risks:

1. **Downtime on re-index**: The current `admin.reset()` deletes all indexes and recreates them empty, then ingestion repopulates. Reads fail during this window.
2. **No rollback**: If a new ingestion introduces data quality issues, there is no way to revert without a second full ingest cycle.
3. **No pre-flight validation**: New index content cannot be verified before it becomes live.

Existing infrastructure is partially built but not connected end-to-end:

- `alias-swap.sh` — a working atomic ES alias swap script, but single-alias only and swallows HTTP errors
- `generateVersionFromTimestamp()` — produces version strings of the form `v2026-03-07-143022`
- `IndexMetaDoc` — a schema-first metadata document stored in `oak_meta`
- `INDEXING.md` and `operations/infrastructure/README.md` — document the blue/green intent as a design goal

What is missing: versioned index creation, TypeScript alias management, orchestration, verification, and a one-time migration from bare indexes to alias-backed indexes.

## Decision

Implement blue/green index swapping by separating two concerns:

1. **Alias names** (`oak_lessons`, etc.) become permanently stable Elasticsearch aliases, pointing to the live physical index at any moment.
2. **Physical (versioned) indexes** (`oak_lessons_v2026-03-07-143022`) are created, populated, and verified offline before an atomic alias swap makes them live.

### Versioning is an admin-layer concern only

The retrieval service, `SearchSdkConfig`, MCP servers, and all consumers continue to use alias names unchanged. The `SearchIndexTarget` type (`'primary' | 'sandbox'`) is **not extended**. Queries always target alias names; only the admin orchestration layer knows about versioned physical indexes.

### New `IndexLifecycleService`

A new service, separate from `AdminService`, provides the blue/green lifecycle as composable, testable functions:

- `versionedIngest()` — full blue/green cycle: create versioned indexes, ingest, verify, swap aliases, update metadata
- `stage()` — create and populate versioned indexes without swapping aliases; returns a version string for later promotion
- `promote(version)` — swap aliases to a previously staged version, write metadata, clean up old generations
- `rollback()` — swap aliases back to the previous version recorded in `IndexMetaDoc`
- `validateAliases()` — check alias health across all curriculum indexes

### Alias swap mechanics

A single atomic `POST /_aliases` request handles all six curriculum indexes simultaneously. Actions are built conditionally:

- If an alias already exists: `remove` old binding + `add` new binding
- If no alias exists (first run or migration): `add` only

`is_write_index` is omitted — each alias points to exactly one index, making it unnecessary.

### Metadata as rollback state

`IndexMetaDoc` gains an optional `previous_version` field (via sdk-codegen, per the cardinal rule). This records the immediately preceding version, enabling single-level rollback. This is a deliberate constraint — further rollback requires a new ingest cycle.

### Operational safety

- **Metadata write is the commit point**: If metadata write fails after alias swap, aliases are immediately rolled back
- **2-generation retention**: With `MAX_GENERATIONS=2` and cleanup running after the swap, the retained indexes are always the current version (n) and previous version (n-1). The rollback target is naturally protected without consulting metadata.
- **Coherence precondition before mutation**: Promote/versioned-ingest/rollback fail fast unless `oak_meta.version` matches the current live alias version (bootstrap null/null is allowed).

#### Safety Enhancements

- **Implemented**: distributed lifecycle lease with TTL/renewal semantics to
  prevent overlapping lifecycle operations.
- **Implemented**: mutating lifecycle failures retain lease ownership until TTL expiry so operators can triage readbacks before concurrent mutation resumes.
- **Planned**: pre-flight storage check so orchestration verifies sufficient
  storage before creating new indexes.

### Indexes excluded from versioning

`oak_meta` (metadata) and `oak_zero_hit_events` (telemetry) retain bare index names. Their lifecycle is fundamentally different — they are operational stores, not batch-replaced curriculum data.

## Rationale

### Why alias-backed, not direct index references

Aliases are the standard Elasticsearch mechanism for zero-downtime index rotation. All consumers resolve the same stable name; the physical backing index is invisible to them. This keeps the read path entirely unchanged.

### Why admin-layer only, not extending `SearchIndexTarget`

`SearchIndexTarget` (`'primary' | 'sandbox'`) is a read-path routing concern. Versioning is a write-path lifecycle concern owned entirely by admin orchestration. Mixing them would require every SDK consumer to set versioning state they do not care about and derive no benefit from.

### Why atomic swap, not gradual migration

Elasticsearch's `POST /_aliases` API is atomic — either all actions succeed or none do. This eliminates any window where some aliases point to the new index and others to the old. Partial states are the risk; atomic swap is the mitigation.

### Why full ingest for migration, not `_reindex`

The curriculum indexes contain `semantic_text` fields with ELSER inference pipelines. Using `_reindex` would re-run ELSER inference on every document — slow and resource-intensive, particularly on Elastic Serverless where ML node capacity is managed. Since all curriculum data is fully reproducible from bulk downloads, running the existing ingest pipeline into a fresh versioned index is simpler, faster, and avoids the inference issue entirely.

### Why a separate `IndexLifecycleService`, not extending `AdminService`

`AdminService` currently has eight methods covering cluster health and index lifecycle management. Adding three blue/green operations (including a one-time migration) would increase it to eleven methods across three distinct concerns. The `IndexLifecycleService` is independently testable, independently evolvable, and avoids permanent clutter from the `migrateToAliases` method after the one-time migration is complete.

## Consequences

### Positive

- Zero-downtime re-indexing: new index built and verified offline, alias swapped atomically
- Instant rollback: re-run the alias swap pointing back to the previous versioned index
- All existing consumers (retrieval, MCP, CLI) completely unaffected
- Pre-flight validation: verify document counts and mapping correctness before swap
- Consistent with TDD, Result pattern, and schema-first principles

### Negative

- Temporary storage overhead: two full index copies exist during a blue/green cycle (mitigated by pre-flight storage check)
- One-time migration required before first blue/green cycle
- Operational complexity: versioned indexes accumulate and need application-managed cleanup (ILM is not available on Elastic Serverless)

### Neutral

- `oak_meta` and `oak_zero_hit_events` remain as bare indexes (intentional — different lifecycle)
- `alias-swap.sh` has been deleted and replaced by TypeScript `atomicAliasSwap` (no compatibility layers per principles)
- Single-level rollback only (deliberate constraint — further rollback requires a new ingest cycle)
- Sandbox indexes follow the same alias pattern for consistency
- Alias remove actions use `must_exist=true` so missing expected alias bindings
  fail fast instead of silently allowing partial lifecycle drift.

## Implementation

### Key Files

| File                                                                       | Purpose                                                                     |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `packages/sdks/oak-search-sdk/src/admin/versioned-index-resolver.ts`       | Versioned resolver factory (admin-layer only)                               |
| `packages/sdks/oak-search-sdk/src/admin/alias-operations.ts`               | TypeScript wrappers over ES `/_aliases` API                                 |
| `packages/sdks/oak-search-sdk/src/admin/index-lifecycle-service.ts`        | Blue/green orchestrator                                                     |
| `packages/sdks/oak-search-sdk/src/admin/lifecycle-swap-builders.ts`        | Pure swap-building helpers                                                  |
| `packages/sdks/oak-search-sdk/src/admin/lifecycle-cleanup.ts`              | Generation cleanup                                                          |
| `packages/sdks/oak-search-sdk/src/admin/lifecycle-promote.ts`              | Promote orchestration (stage→live swap)                                     |
| `packages/sdks/oak-search-sdk/src/admin/lifecycle-rollback.ts`             | Rollback and alias validation operations                                    |
| `packages/sdks/oak-search-sdk/src/admin/lifecycle-lease.ts`                | Lease orchestration wrapper for mutating lifecycle commands                 |
| `packages/sdks/oak-search-sdk/src/admin/lifecycle-lease-infra.ts`          | Lease acquire/renew/release infrastructure                                  |
| `packages/sdks/oak-search-sdk/src/admin/lifecycle-meta-alias-coherence.ts` | Metadata/alias coherence enforcement preconditions                          |
| `packages/sdks/oak-search-sdk/src/types/index-lifecycle-types.ts`          | Service types and alias types                                               |
| `packages/sdks/oak-search-sdk/src/internal/index-resolver.ts`              | Shared name resolution helpers                                              |
| `packages/sdks/oak-search-sdk/src/admin/build-lifecycle-deps.ts`           | DI factory for lifecycle deps                                               |
| `apps/oak-search-cli/src/cli/admin/admin-lifecycle-commands.ts`            | CLI commands (versioned-ingest, stage, promote, rollback, validate-aliases) |

### CLI Commands

Registered in `apps/oak-search-cli/src/cli/admin/admin-lifecycle-commands.ts`:

```bash
oak-search admin versioned-ingest --bulk-dir <path> [options]  # Full blue/green cycle
oak-search admin stage --bulk-dir <path> [options]              # Stage without promoting
oak-search admin promote --target-version <version>             # Promote a staged version
oak-search admin rollback                                       # Swap back to previous_version
oak-search admin validate-aliases                                # Check alias health
```

## Alternatives Considered

| Alternative                                                 | Rejected because                                                                                                                                          |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Extend `SearchIndexTarget` with `'versioned'`               | Conflates query-routing with ingestion mechanics. All consumers would change for no read-path benefit.                                                    |
| Add `version` field to `SearchSdkConfig` affecting resolver | Resolver is read-path. Versioning is write-path (admin only). Leaks complexity to consumers.                                                              |
| Keep versioning entirely in bash                            | Cannot verify, orchestrate, or rollback programmatically. Not testable.                                                                                   |
| Use Elasticsearch ILM for index rotation                    | ILM is oriented towards time-series data, not curriculum indexes fully replaced each cycle. Not available on Elastic Serverless.                          |
| Use `_reindex` for migration                                | `_reindex` with `semantic_text` fields re-runs ELSER inference on every document. Full ingest from bulk downloads is simpler, faster, and already proven. |

## References

- [ADR-029: No Manual API Data Structures](029-no-manual-api-data.md) — Cardinal rule; `IndexMetaDoc.previous_version` flows through sdk-codegen
- [ADR-030: SDK as Single Source of Truth](030-sdk-single-source-truth.md) — CLI consolidated onto SDK imports
- [ADR-067: SDK-Generated Elasticsearch Mappings](067-sdk-generated-elasticsearch-mappings.md) — Mappings used by `createAllIndexes`
- [ADR-087: Batch-Atomic Ingestion](087-batch-atomic-ingestion.md) — Ingestion pipeline composed by the orchestrator
- [ADR-088: Result Pattern for Error Handling](088-result-pattern-for-error-handling.md) — All new functions return `Result<T, AdminError>`
- [ADR-093: Bulk-First Ingestion Strategy](093-bulk-first-ingestion-strategy.md) — Bulk data as primary source for ingest and migration

---

**Decision Made By**: Development Team
**Date**: 2026-03-07
**Review Date**: 2026-09-07 (or when scaling requires multi-level rollback or cross-cluster replication)
