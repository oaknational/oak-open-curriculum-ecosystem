# ADR-069: Systematic Ingestion with Progress Tracking

**Status**: Superseded  
**Date**: 2025-12-06  
**Superseded**: 2026-01-07  
**Deciders**: Development Team  
**Superseded By**: [ADR-087](087-batch-atomic-ingestion.md)

---

## Current Approach (2026-01-07)

Full ingestion is handled by the unified `es:ingest-live` CLI:

```bash
# Full ingestion
pnpm es:ingest-live -- --all

# Resume interrupted ingestion (skip existing documents)
pnpm es:ingest-live -- --all --incremental

# Check status
pnpm es:status

# Verify completeness
pnpm ingest:verify
```

The `--incremental` flag uses Elasticsearch as the source of truth for progress, querying existing documents and skipping them.

---

## Historical Context

This ADR documented a file-based progress tracking system (`ingest:all`, `ingest:progress`) that was developed in December 2025 to solve the problem of losing ingestion progress when bugs were discovered mid-run.

### Original Problem

With 340 possible combinations (17 subjects × 4 keystages × 5 indexes) and ~30-120 seconds per combination, restarting from scratch after discovering a bug was wasteful.

### Original Solution

A JSON progress file (`.ingest-progress.json`) tracked the state of each combination, allowing resume after interruption.

### Why Superseded

[ADR-087: Batch-Atomic Ingestion](087-batch-atomic-ingestion.md) introduced a simpler approach:

1. Each batch commits to Elasticsearch immediately
2. Elasticsearch becomes the source of truth for progress
3. The `--incremental` flag skips documents that already exist
4. No separate progress file needed

This eliminated the need for separate `ingest:all` and `ingest:progress` commands.

---

## References

- [ADR-087: Batch-Atomic Ingestion](087-batch-atomic-ingestion.md) — Current approach
- [ADR-067: SDK Generated Elasticsearch Mappings](067-sdk-generated-elasticsearch-mappings.md)
- [INGESTION-GUIDE.md](../../../apps/oak-open-curriculum-semantic-search/docs/INGESTION-GUIDE.md) — Current documentation
