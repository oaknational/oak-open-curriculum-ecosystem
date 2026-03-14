# ADR-136: Incremental Refresh and Bulk API Partial-Update Doctrine

**Status**: Accepted (not yet implemented)

**Deciders**: Development Team

**Date**: 2026-03-13

**Related ADRs**:

- [ADR-074: Elastic-Native-First Philosophy](074-elastic-native-first-philosophy.md) — native capabilities over external APIs
- [ADR-076: ELSER-Only Embedding Strategy](076-elser-only-embedding-strategy.md) — ELSER for all semantic search
- [ADR-096: Elasticsearch Bulk Retry Strategy](096-es-bulk-retry-strategy.md) — retry policy for bulk operations
- [ADR-130: Blue-Green Index Swapping](130-blue-green-index-swapping.md) — full re-ingest lifecycle

## Context

Curriculum data changes a few times per week with relatively minor deltas.
The existing blue/green lifecycle (ADR-130) performs a full re-ingest every time,
creating new versioned indexes and swapping aliases. This works, but re-runs
ELSER inference on all ~14,000 documents even when only a handful change.
ELSER inference is the dominant cost of the ingest cycle.

Investigation of current official Elastic documentation (March 2026) revealed a
critical distinction between update mechanisms for documents containing
`semantic_text` fields:

- **Bulk API `update` action with `doc`**: reuses existing embeddings when
  `semantic_text` fields are omitted from the `doc` object. Inference does
  not run for omitted fields.
- **Update API (`POST /<index>/_update/<id>`)**: re-runs inference on **all**
  `semantic_text` fields even when they are omitted from the `doc` object.

This distinction is documented at:
[Ingest data with semantic_text fields](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/semantic-text-ingestions),
section "Updates and partial updates".

## Prerequisites

This ADR requires ADR-130 (blue/green index swapping) to be fully implemented,
including alias-backed indexes, `IndexLifecycleService`, and the
`previous_version` field in `oak_meta`. Implementation also assumes alias and
metadata coherence has been restored (the output of the recovery-and-guardrails
execution plan).

## Decision

Adopt an incremental-first scheduled refresh model:

1. **Per-document fingerprinting**: compute a content hash (full document) and
   a semantic hash (concatenation of all `semantic_text` source texts) for
   each document during the transform pipeline. Persist fingerprints alongside
   the bulk data. Fingerprint keys must use the same document identifiers as
   Bulk API `_id` values.

2. **Diff-driven path selection**: compare new fingerprints against the stored
   baseline. Classify each document as unchanged, metadata-only change,
   semantic content change, new, or removed.

3. **Incremental update via Bulk API**: for metadata-only changes, use the
   Bulk API `update` action with `doc`, omitting all `semantic_text` fields.
   For semantic changes and new documents, use the Bulk API `index` action
   with all fields. For removed documents, use `delete`.

4. **Full re-ingest as mandatory fallback**: mapping changes, missing
   fingerprint baseline, recovery from failed incremental, and periodic
   baseline refresh require the full blue/green lifecycle (ADR-130).

5. **Hard invariant**: the system MUST NOT use the Update API for partial
   updates to documents containing `semantic_text` fields. Only the Bulk API
   `update` action preserves embeddings for omitted fields.

6. **Scripted updates prohibited**: the Bulk API does not support scripted
   updates on indices containing `semantic_text` fields. All partial updates
   use the `doc` form.

7. **Incremental writes target aliases with `require_alias=true`**: this
   prevents accidental writes to wrong concrete indexes during in-place
   incremental updates.

## Rationale

### Why incremental?

For the common case (minor deltas, few times per week), incremental updates
avoid ELSER inference on thousands of unchanged documents. The Bulk API's
embedding-preservation behaviour for omitted `semantic_text` fields makes
this safe.

### Why retain full re-ingest?

- Mapping changes require new indexes (Elasticsearch does not support
  field type changes in place).
- Periodic baselines prevent accumulated drift from many incremental runs.
- Full re-ingest is the recovery path for all incremental failures.
- On Elastic Serverless, snapshot/restore is not yet user-initiated, so
  previous-version indexes from the last full re-ingest are the only
  rollback mechanism.

### Why not the Update API?

The Update API re-runs inference on all `semantic_text` fields even when
they are omitted. This eliminates the entire cost benefit of incremental
updates. This is explicit in official Elastic documentation and is treated
as a hard invariant.

## Alternatives Rejected

1. **Always full re-ingest**: safe and simple, but unnecessarily expensive
   for minor deltas. Rejected as the sole approach; retained as fallback.

2. **Reindex API for incremental**: Elastic documents a reindex path that
   can preserve existing `semantic_text` embeddings when the destination has
   the same `inference_id`, and `_reindex` supports query-based subset
   selection. However, reindex writes into a destination index — it cannot
   perform in-place mutations on live alias-backed indexes. For small
   per-document deltas where only a handful of documents need updating in
   the live index, reindex is the wrong operational fit.

3. **External embedding cache**: storing ELSER embeddings externally and
   replaying them would violate the Elastic-native-first philosophy (ADR-074)
   and add operational complexity.

## Consequences

### Positive

- Reduces ELSER inference cost for the common case (minor deltas) to only
  the changed documents.
- Metadata-only changes (e.g. URL corrections, keyword updates) produce
  zero ELSER inference cost.
- Full re-ingest path is unchanged and remains available for all cases
  that require it.

### Negative

- Per-document fingerprinting adds complexity to the transform pipeline.
- Incremental updates mutate live indexes in place, requiring alias-swap
  rollback to previous-version indexes on failure.
- Fingerprint baseline persistence introduces a new commit boundary that
  must be treated as part of the operational contract.
- Periodic full re-ingests are still required to prevent drift.

## Validation Criteria

1. Bulk API `update` actions with omitted `semantic_text` fields do not
   trigger ELSER re-inference (verified via official docs and Serverless
   testing).
2. Fingerprint generation is deterministic across repeated runs on unchanged
   input.
3. Metadata-only changes produce `update` payloads without `semantic_text`
   field names.
4. Incremental failure triggers automatic escalation to full re-ingest.
5. Previous-version indexes are retained until the next successful full
   re-ingest.

## Implementation

Execution plan:
`.agent/plans/semantic-search/active/semantic-search-scheduled-refresh.operations.plan.md`

This ADR captures the architectural decision. Implementation phases,
acceptance criteria, and TDD execution detail live in the plan.
