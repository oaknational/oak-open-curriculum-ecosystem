# Systematic Ingestion Script

## Overview

The `ingest-all-combinations.ts` script systematically ingests all possible combinations of subjects, key stages, and indexes into Elasticsearch. It includes robust progress tracking and can resume after interruptions or failures.

## Features

- ✅ **Progress Tracking**: Tracks completion status of all 340 combinations
- 🔄 **Resume Capability**: Can be safely interrupted (Ctrl+C) and resumed later
- 📊 **Real-time Statistics**: Shows progress, success rate, and failures
- 🛡️ **Error Isolation**: Individual failures don't stop the entire process
- 💾 **Persistent State**: Progress saved to `.ingest-progress.json`
- 🔍 **Dry Run Mode**: Preview what would be ingested without writing

## Combinations

The script processes all combinations of:

- **17 Subjects**: art, citizenship, computing, cooking-nutrition, design-technology, english, french, geography, german, history, maths, music, physical-education, religious-education, rshe-pshe, science, spanish
- **4 Key Stages**: ks1, ks2, ks3, ks4
- **5 Index Kinds**: lessons, unit_rollup, units, sequences, sequence_facets

**Total: 340 combinations** (17 × 4 × 5)

## Usage

### Basic Usage

```bash
# Start ingestion of all combinations
pnpm ingest:all
```

### Resume After Interruption

```bash
# Resume from where you left off (automatic if progress exists)
pnpm ingest:all --resume
```

### Reset and Start Fresh

```bash
# Clear progress and start from the beginning
pnpm ingest:all --reset
```

### Dry Run Mode

```bash
# Preview without actually ingesting data
pnpm ingest:all --dry-run
```

### Get Help

```bash
pnpm ingest:all --help
```

## Progress Tracking

### Progress File

The script maintains a `.ingest-progress.json` file with:

```json
{
  "startedAt": "2025-12-06T22:00:00.000Z",
  "lastUpdatedAt": "2025-12-06T22:15:00.000Z",
  "totalCombinations": 340,
  "completed": 45,
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
    },
    {
      "combination": {
        "subject": "geography",
        "keyStage": "ks4",
        "index": "sequences",
        "id": "geography-ks4-sequences"
      },
      "status": "failed",
      "startedAt": "2025-12-06T22:05:00.000Z",
      "completedAt": "2025-12-06T22:05:15.000Z",
      "exitCode": 1,
      "error": "Connection timeout"
    }
  ]
}
```

### Status Values

- `pending`: Not yet processed
- `running`: Currently being ingested
- `success`: Completed successfully (exit code 0)
- `failed`: Failed to ingest (non-zero exit code)
- `skipped`: Deliberately skipped (future feature)

## Workflow for Bug Fixing

The script is designed to support an iterative bug-fixing workflow:

1. **Start the ingestion**:

   ```bash
   pnpm ingest:all
   ```

2. **Script encounters an error** (e.g., mapping mismatch at combination #47)

3. **Interrupt the script** (Ctrl+C)
   - Progress is saved automatically
   - 46 combinations already completed

4. **Fix the bug** in your code
   - Update SDK types
   - Fix mapping generation
   - Run quality gates

5. **Resume ingestion**:

   ```bash
   pnpm ingest:all --resume
   ```

   - Picks up from combination #47
   - All previous work is preserved

6. **Repeat** until all combinations succeed

## Output Example

```text
🚀 Systematic Ingestion - All Combinations

📂 Loaded existing progress

📊 Progress Summary:
   Total: 340 combinations
   ✅ Completed: 125
   ❌ Failed: 3
   ⏭️  Skipped: 0
   ⏳ Pending: 212
   🏃 Running: 0
   Progress: 37.6%

================================================================================
🔄 Processing: maths / ks3 / unit_rollup
   ID: maths-ks3-unit_rollup
   126 of 340
================================================================================

[... ingestion output ...]

✅ Success: maths-ks3-unit_rollup
```

## Expected Behavior

### Normal Combinations

Not all 340 combinations will have data. Some subject/keystage pairs simply don't exist in the Oak curriculum. These will typically:

- Complete quickly (no data to ingest)
- Exit with code 0
- Be marked as "success"

### Failed Combinations

Failures may occur due to:

- **Mapping mismatches** (the reason this script was created!)
- **Network timeouts** (prolonged connectivity issues)
- **Memory issues** (large datasets)
- **Schema validation errors**
- **Persistent API errors** (500, 502, 504)

**Note**: 429 (rate limit) errors are now automatically handled by the SDK with exponential backoff retry logic, so you should not see these failures anymore.

Failed combinations are tracked in the progress file for later analysis.

## Manual Retry

To retry a specific failed combination manually:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm es:ingest-live --subject maths --keystage ks2 --index lessons --verbose
```

## Cleanup

To remove the progress file:

```bash
rm apps/oak-open-curriculum-semantic-search/.ingest-progress.json
```

A backup is automatically created when using `--reset`:

```bash
# Creates .ingest-progress.json.backup
pnpm ingest:all --reset
```

## Integration with Quality Gates

This script should be run **after** passing all quality gates:

```bash
# 1. Generate types and mappings
pnpm type-gen

# 2. Build SDK
cd packages/sdks/oak-curriculum-sdk && pnpm build

# 3. Run quality gates
pnpm type-check
pnpm lint:fix
pnpm test

# 4. Reset Elasticsearch indexes
cd apps/oak-open-curriculum-semantic-search
pnpm es:setup

# 5. Run systematic ingestion
pnpm ingest:all
```

## Rate Limiting and Retry Behavior

The SDK now includes automatic rate limiting and retry logic to handle API rate limits gracefully:

### Automatic Rate Limiting

- **Default**: 10 requests per second (100ms minimum interval between requests)
- **Purpose**: Prevents overwhelming the Oak API with too many requests
- **Effect on Performance**: Ingestion may take slightly longer, but prevents 429 errors

### Automatic Retry with Exponential Backoff

- **Default**: Up to 3 retry attempts
- **Backoff Delays**: 1 second, 2 seconds, 4 seconds (exponential)
- **Retryable Errors**: 429 (rate limit) and 503 (service unavailable)
- **Effect**: Transient failures are automatically retried without manual intervention

### What This Means for Ingestion

- **No 429 Errors**: The SDK automatically handles rate limits
- **Longer Runtime**: Ingestion takes longer due to rate limiting and retries
- **More Reliable**: Transient failures are handled automatically
- **No Manual Intervention**: You don't need to manually retry failed combinations due to rate limits

### Monitoring Retry Behavior

The SDK logs retry attempts. Watch for messages like:

```text
Retrying request after rate limit (attempt 0/3, next delay: 1000ms)
```

If you see many retries, the API may be experiencing heavy load or rate limits may need adjustment.

## Performance

- **Single combination**: ~30-120 seconds (varies by data size)
- **Total runtime**: ~3-11 hours for all 340 combinations (estimated)
  - **Note**: With rate limiting enabled, runtime may be longer but more reliable
- **Memory usage**: ~500MB-2GB per combination
- **Network**: Moderate (uses SDK caching if enabled)

**Tip**: Enable Redis caching to speed up repeated runs:

```bash
# Start Redis
pnpm redis:up

# Set in .env.local
SDK_CACHE_ENABLED=true
```

## Troubleshooting

### Script Won't Start

```bash
# Check if TypeScript can be executed
npx tsx --version

# Check if the script exists
ls scripts/ingest-all-combinations.ts
```

### Progress File Corruption

```bash
# Backup and reset
cp .ingest-progress.json .ingest-progress.json.manual-backup
pnpm ingest:all --reset
```

### All Combinations Failing

This usually indicates a systemic issue:

1. Check Elasticsearch connection
2. Verify API keys are set
3. Run a single combination manually to see detailed errors
4. Check quality gates are passing

### Memory Issues

If the script runs out of memory:

1. Process combinations in smaller batches
2. Increase Node.js memory limit:

   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" pnpm ingest:all
   ```

3. Run during off-peak hours

## Related Documentation

- [INDEXING.md](../docs/INDEXING.md) - Index schema management
- [SDK README](../../../packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/README.md) - Field definitions
- [Mapping Remediation Plan](../../../.agent/plans/semantic-search/mapping-remediation.md) - Context for why this script exists

## Contributing

When modifying this script:

1. Update subject/keystage/index lists if the OpenAPI schema changes
2. Test with `--dry-run` first
3. Document any new flags or behaviors
4. Update this README

---

**Created**: 2025-12-06  
**Purpose**: Support iterative bug fixing during semantic search index remediation
