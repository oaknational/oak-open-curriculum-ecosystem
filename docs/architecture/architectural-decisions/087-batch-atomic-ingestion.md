# ADR-087: Batch-Atomic Ingestion

**Status**: Accepted  
**Date**: 2025-12-27  
**Deciders**: Development Team  
**Supersedes**: Aspects of [ADR-069](069-systematic-ingestion-progress-tracking.md) (progress file approach)  
**Related**: [ADR-069](069-systematic-ingestion-progress-tracking.md), [ADR-067](067-sdk-generated-elasticsearch-mappings.md), [ADR-066](066-sdk-response-caching.md)

## Context

The original ingestion approach (ADR-069) processed all curriculum data in memory, then dispatched a single large bulk request to Elasticsearch at the very end. This had critical failure modes:

1. **All-or-nothing failure**: If the process was terminated before the final bulk dispatch, ALL prepared data was lost
2. **Memory pressure**: Holding ~50,000+ documents in memory before dispatch
3. **Late failure discovery**: Errors only surfaced after hours of data preparation
4. **Progress opacity**: No visibility into actual ES state until completion

The file-based progress tracker (`.ingest-progress.json`) was a workaround for the combination-level resume capability, but it:

- Required external state management
- Was subject to stale state issues
- Didn't protect against mid-process termination

## Decision

We implement **batch-atomic ingestion** where data is dispatched to Elasticsearch incrementally after each logical batch is prepared:

### Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                    generateIndexBatches()                       │
│              Async generator yielding batches                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  For each batch (subject/keystage):                             │
│                                                                 │
│  1. Prepare operations (API calls, transforms)                  │
│  2. Filter by target index                                      │
│  3. Dispatch to Elasticsearch (/_bulk)     ◄── ATOMIC COMMIT    │
│  4. Log batch completion with cumulative count                  │
│  5. Yield control, continue to next batch                       │
└─────────────────────────────────────────────────────────────────┘
```

### Key Components

1. **Batch Generator** (`index-batch-generator.ts`)
   - Async generator yielding `IngestionBatch` per (subject, keystage) or per subject
   - Configurable granularity: `subject-keystage` (finer) or `subject` (coarser)
   - Separates threads batch from curriculum batches

2. **Ingestion Harness** (`ingest-harness.ts`, formerly `sandbox-harness.ts`)
   - Consumes the batch generator
   - Dispatches each batch immediately to ES
   - Logs progress: `BATCH N: subject/keystage | docs=X | COMMITTED | cumulative=Y`
   - Elasticsearch becomes the source of truth for progress

3. **Ingest CLI** (`ingest.ts`)
   - Single process, foreground execution
   - Logs to both stdout and timestamped file
   - Can be interrupted safely - committed batches persist

### Batch Granularity

Two granularity options:

| Granularity        | Batches                                     | Use Case                                 |
| ------------------ | ------------------------------------------- | ---------------------------------------- |
| `subject-keystage` | ~68 (17 subjects × 4 keystages) + 1 threads | Finer progress, smaller memory footprint |
| `subject`          | ~17 + 1 threads                             | Faster overall, fewer ES round-trips     |

Default is `subject-keystage` for maximum fault tolerance.

## Rationale

### Why Batch-Atomic Over All-or-Nothing?

1. **Fault Tolerance**: Termination at any point preserves all committed batches
2. **Progress Visibility**: ES document counts reflect real-time progress
3. **Memory Efficiency**: Only one batch's worth of documents in memory at a time
4. **Early Error Detection**: Mapping errors surface on first affected batch, not after hours of work

### Why Elasticsearch as Progress Source?

- **No stale state**: `GET /_cat/indices` always reflects reality
- **No file coordination**: Works across machines, terminals, sessions
- **Idempotent operations**: Re-running ingestion updates existing documents (same `_id`)
- **Query-able progress**: `GET /oak_lessons/_count` for precise counts

### Why Not Parallel Batches?

Considered but rejected:

- ES bulk API already parallelises internally
- Sequential batches provide deterministic logging
- Easier to debug when batches complete in order
- No race conditions in progress reporting

## Consequences

### Positive

- ✅ **Fault Tolerant**: Process termination never loses more than one batch
- ✅ **Observable Progress**: ES counts show real-time state
- ✅ **Memory Bounded**: Single batch in memory, not entire curriculum
- ✅ **Simple State**: No external progress files to manage
- ✅ **Idempotent**: Safe to re-run; documents are upserted by `_id`
- ✅ **Debuggable**: Clear batch-by-batch logs with commit confirmation

### Negative

- ⚠️ **More ES Round-Trips**: ~69 bulk requests vs 1 (negligible network cost)
- ⚠️ **Partial State Possible**: Process failure leaves subset of data indexed (acceptable: re-run to complete)

### Neutral

- ℹ️ **No Rollback**: Committed batches cannot be atomically rolled back (design choice: ES is durable)
- ℹ️ **Single Process**: Still sequential, not distributed (sufficient for our scale)

## Migration from ADR-069

The file-based progress tracker from ADR-069 is no longer necessary for batch-level tracking. However:

- The combination generator concept still applies (we iterate all subject/keystage pairs)
- The `pnpm ingest:progress` script can be updated to query ES directly
- The `.ingest-progress.json` file can be deprecated

## Implementation

### Key Files

| File                                       | Purpose                      |
| ------------------------------------------ | ---------------------------- |
| `src/lib/index-batch-generator.ts`         | Async generator for batches  |
| `src/lib/indexing/ingest-harness.ts`       | Batch consumer with dispatch |
| `src/lib/indexing/ingest-harness-batch.ts` | Batch processing logic       |
| `src/lib/elasticsearch/setup/ingest.ts`    | CLI entry point              |

### CLI Usage

```bash
# Ingest all subjects with batch-atomic commits
SDK_CACHE_ENABLED=true pnpm es:ingest -- --api --all

# Single subject (4 keystage batches + threads)
pnpm es:ingest -- --api --subject maths

# Check progress via ES
curl -s "$ES_URL/_cat/indices/oak_*?v&h=index,docs.count"
```

### Log Output Example

```text
BATCH 1: maths/ks1 | docs=142
BATCH 1: maths/ks1 | COMMITTED | cumulative=142
BATCH 2: maths/ks2 | docs=287
BATCH 2: maths/ks2 | COMMITTED | cumulative=429
...
BATCH 68: german/ks4 | COMMITTED | cumulative=47832
BATCH 69: threads | docs=156
BATCH 69: threads | COMMITTED | cumulative=47988
```

## References

- [ADR-069: Systematic Ingestion with Progress Tracking](069-systematic-ingestion-progress-tracking.md) - Original approach
- [ADR-066: SDK Response Caching](066-sdk-response-caching.md) - Cache enables fast re-runs
- [ADR-067: SDK Generated Elasticsearch Mappings](067-sdk-generated-elasticsearch-mappings.md) - Schema-first mappings

---

**Decision Made By**: Development Team  
**Date**: 2025-12-27  
**Review Date**: 2026-06-27 (or when ingestion scale requires further optimisation)
