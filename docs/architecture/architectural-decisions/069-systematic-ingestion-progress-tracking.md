# ADR-069: Systematic Ingestion with Progress Tracking

**Status**: Accepted  
**Date**: 2025-12-06  
**Deciders**: Development Team  
**Related**: [ADR-067](067-sdk-generated-elasticsearch-mappings.md), [ADR-064](064-elasticsearch-mapping-organization.md)

## Context

During semantic search development, we encountered recurring mapping mismatch errors that required iterative bug fixing. The typical workflow involved:

1. Start manual ingestion
2. Discover a bug (e.g., mapping mismatch)
3. Interrupt ingestion
4. Fix the bug
5. Re-run entire ingestion from scratch (losing all previous work)

With 340 possible combinations (17 subjects × 4 keystages × 5 indexes) and ~30-120 seconds per combination, restarting from scratch was extremely wasteful. We needed a way to:

- Track progress across all combinations
- Resume from where we left off after interruptions
- Identify which specific combinations failed for targeted debugging
- Make bug fixing iterative rather than all-or-nothing

## Decision

We implement a systematic ingestion system with persistent progress tracking:

### Components

1. **Combination Generator** (`scripts/ingest-all-combinations.ts`)
   - Generates all 340 possible combinations
   - Each combination is uniquely identified (e.g., `english-ks2-lessons`)
   - Tracks status: `pending`, `running`, `success`, `failed`, `skipped`

2. **Progress File** (`.ingest-progress.json`)
   - Persistent JSON file tracking state of all combinations
   - Contains: timestamps, counts, individual results with exit codes
   - Can be safely committed to version control (but gitignored by default)

3. **Resume Capability**
   - Script reads existing progress on startup
   - Skips already-completed combinations
   - Continues from first `pending` combination
   - Can be interrupted (Ctrl+C) at any time

4. **Progress Monitoring** (`scripts/check-progress.ts`)
   - Shows current Elasticsearch state (document counts)
   - Displays systematic ingestion progress
   - Lists recent successes and all failures
   - Accessible via `pnpm ingest:progress`

### Usage Pattern

```bash
# Start systematic ingestion
pnpm ingest:all

# Press Ctrl+C after discovering a bug at combination #47
# (Progress automatically saved)

# Fix the bug, run quality gates

# Resume exactly from combination #47
pnpm ingest:all

# Or explicitly resume
pnpm ingest:all --resume

# Check current state
pnpm ingest:progress

# Reset and start fresh
pnpm ingest:all --reset
```

### Progress File Structure

```json
{
  "startedAt": "2025-12-06T22:00:00.000Z",
  "lastUpdatedAt": "2025-12-06T22:15:00.000Z",
  "totalCombinations": 340,
  "completed": 47,
  "failed": 2,
  "skipped": 0,
  "results": [
    {
      "combination": {
        "subject": "maths",
        "keyStage": "ks2",
        "index": "lessons",
        "id": "maths-ks2-lessons"
      },
      "status": "success",
      "startedAt": "2025-12-06T22:00:05.000Z",
      "completedAt": "2025-12-06T22:01:23.000Z",
      "exitCode": 0
    }
    // ... 339 more
  ]
}
```

## Rationale

### Why This Approach?

1. **Developer Experience**: Eliminates frustration of losing hours of progress
2. **Efficiency**: Reduces total development time by allowing incremental fixes
3. **Visibility**: Clear understanding of what succeeded and what failed
4. **Iterative Debugging**: Fix bugs as they're discovered without restarting
5. **Testability**: Can dry-run to preview without actually ingesting

### Alternative Considered: Database-Backed Queue

We considered using Redis or a database to track progress, but rejected it because:

- Adds infrastructure dependency
- Overkill for single-process script
- JSON file is simple, version-controllable, and human-readable
- No concurrency concerns (single process)

### Alternative Considered: Parallel Processing

We considered running multiple combinations in parallel, but rejected it because:

- Elasticsearch bulk operations already parallelize internally
- Would complicate error isolation and debugging
- Resource contention could cause spurious failures
- Sequential execution is more predictable and debuggable

## Consequences

### Positive

- ✅ **Resumable Ingestion**: No work is lost when interrupted
- ✅ **Bug Fix Workflow**: Discover bug → fix → resume seamlessly
- ✅ **Failure Analysis**: Exact list of failed combinations for investigation
- ✅ **Progress Visibility**: Always know current state via `pnpm ingest:progress`
- ✅ **Predictable**: Sequential processing is easier to reason about
- ✅ **Simple**: No external dependencies, just a JSON file

### Negative

- ⚠️ **Sequential Performance**: Takes 3-11 hours vs potential ~1-2 hours with parallelization
- ⚠️ **Manual Reset**: Must explicitly run `--reset` to start fresh
- ⚠️ **File Management**: Progress file must be gitignored to avoid conflicts

### Neutral

- ℹ️ **Single Process**: Can't distribute across machines (not needed for our use case)
- ℹ️ **No Rollback**: Individual combination failures don't roll back successful ones

## Implementation Notes

### Files Created

- `apps/oak-open-curriculum-semantic-search/scripts/ingest-all-combinations.ts` - Main script
- `apps/oak-open-curriculum-semantic-search/scripts/check-progress.ts` - Progress monitoring
- `apps/oak-open-curriculum-semantic-search/scripts/README-INGEST-ALL.md` - Documentation
- `.ingest-progress.json` - Progress state (gitignored)

### Package.json Scripts

```json
{
  "ingest:all": "tsx scripts/ingest-all-combinations.ts",
  "ingest:progress": "tsx scripts/check-progress.ts"
}
```

### Integration with Existing Tools

The systematic script calls the existing `ingest-live.ts` CLI for each combination:

```typescript
npx tsx src/lib/elasticsearch/setup/ingest-live.ts \
  --subject maths \
  --keystage ks2 \
  --index lessons \
  --verbose
```

This reuses all existing ingestion logic, validation, and error handling.

## Related Work

This systematic ingestion approach was developed during the [Mapping Remediation](../../.agent/plans/semantic-search/mapping-remediation.md) work (2025-12-06), which consolidated all ES mappings to SDK-generated definitions. The combination of:

1. Schema-first mapping generation (ADR-067)
2. Systematic ingestion with progress tracking (ADR-069)

...eliminates the class of bugs that required this iterative workflow.

## References

- [Mapping Remediation Plan](../../.agent/plans/semantic-search/mapping-remediation.md)
- [Systematic Ingestion Documentation](../../apps/oak-open-curriculum-semantic-search/scripts/README-INGEST-ALL.md)
- [ADR-067: SDK Generated Elasticsearch Mappings](067-sdk-generated-elasticsearch-mappings.md)
- [ADR-064: Elasticsearch Index Mapping Organization](064-elasticsearch-mapping-organization.md)

---

**Decision Made By**: Development Team  
**Date**: 2025-12-06  
**Review Date**: 2026-06-06 (or when ingestion patterns change significantly)
