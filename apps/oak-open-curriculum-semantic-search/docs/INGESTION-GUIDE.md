# Ingestion Guide

**Purpose**: Complete guide to ingesting curriculum data into Elasticsearch.  
**Last Updated**: 2025-12-20

---

## Adding a New Subject?

If you're onboarding a **new subject/keystage** (not just re-ingesting), see [NEW-SUBJECT-GUIDE.md](./NEW-SUBJECT-GUIDE.md) for the complete workflow including:

- Quality baseline establishment
- Vocabulary gap analysis
- Synonym addition (TDD)
- Experiment logging

---

## Quick Reference

```bash
# From apps/oak-open-curriculum-semantic-search directory

# 1. Setup/verify ES cluster (creates indexes, synonyms)
pnpm es:setup

# 2. Re-ingest Maths KS4 only (semantic search demo)
pnpm es:ingest-live -- --subject maths --keystage ks4

# 3. Verify ELSER is working
pnpm es:status

# 4. Run smoke tests to measure search quality
rm -rf .next && pnpm dev  # Terminal 1
pnpm test:smoke           # Terminal 2
```

---

## Available Commands

| Command                | Purpose                                      | Duration             |
| ---------------------- | -------------------------------------------- | -------------------- |
| `pnpm es:setup`        | Create indexes, synonym sets, verify cluster | ~30 seconds          |
| `pnpm es:status`       | Check index counts, ELSER status             | ~5 seconds           |
| `pnpm es:ingest-live`  | Ingest from live Oak API                     | 2-15 min per subject |
| `pnpm ingest:all`      | Ingest ALL subjects/keystages                | Hours                |
| `pnpm ingest:progress` | Check progress of `ingest:all`               | Instant              |

---

## Ingestion Process

### Step 1: Verify Prerequisites

```bash
cd apps/oak-open-curriculum-semantic-search

# Ensure environment is set up
cat .env.local | grep -E 'ELASTICSEARCH|OAK_API'
# Should show:
# ELASTICSEARCH_URL=https://...
# ELASTICSEARCH_API_KEY=...
# OAK_API_KEY=...

# Ensure SDK is built
cd ../.. && pnpm build && cd apps/oak-open-curriculum-semantic-search
```

### Step 2: Setup Elasticsearch

This creates indexes (if missing) and syncs synonym sets:

```bash
pnpm es:setup
```

Expected output:

```text
✅ Connected to Elasticsearch
✅ Synonym set 'oak-syns' synced (130 rules)
✅ Index 'oak_lessons' ready
✅ Index 'oak_units' ready
✅ Index 'oak_unit_rollup' ready
✅ Index 'oak_threads' ready
✅ Index 'oak_sequences' ready
```

### Step 3: Ingest Data

#### Option A: Single Subject/KeyStage (Recommended for Testing)

```bash
# Ingest Maths KS4 (semantic search demo data)
pnpm es:ingest-live -- --subject maths --keystage ks4

# Ingest History KS2 (smaller, faster for testing)
pnpm es:ingest-live -- --subject history --keystage ks2
```

#### Option B: Multiple Subjects

```bash
# Ingest common subjects for all key stages
pnpm es:ingest-live -- --subject maths --subject science --subject english
```

#### Option C: All Data

```bash
# Ingest everything (takes hours, can resume)
pnpm ingest:all

# Resume after interruption
pnpm ingest:all --resume

# Check progress
pnpm ingest:progress
```

### Step 4: Verify Ingestion

```bash
pnpm es:status
```

Expected output for Maths KS4:

```text
📊 Index Status:
   oak_lessons:     314 documents
   oak_units:       36 documents
   oak_unit_rollup: 244 documents
   oak_threads:     201 documents
   oak_sequences:   2 documents

✅ ELSER Status:
   lesson_semantic:  314 documents (100%)
   unit_semantic:    36 documents (100%)
```

**Critical**: Verify `lesson_semantic` count matches `oak_lessons` count. If `lesson_semantic` is 0, ELSER embeddings were not generated.

---

## CLI Options Reference

### `pnpm es:ingest-live`

```bash
pnpm es:ingest-live -- [options]

Options:
  --subject <slug>    Subject to ingest (can repeat)
                      Default: maths, english, science, history, geography
  --keystage <ks>     Key stage: ks1, ks2, ks3, ks4 (can repeat)
                      Default: all key stages
  --index <kind>      Index type: lessons, units, unit_rollup, sequences, sequence_facets
                      Default: all indexes
  --dry-run           Preview without writing to ES
  --clear-cache       Clear SDK response cache before ingestion
  --verbose, -v       Show detailed output
  --help, -h          Show help

Examples:
  # Re-ingest Maths KS4 lessons only
  pnpm es:ingest-live -- --subject maths --keystage ks4 --index lessons

  # Dry run to see what would be ingested
  pnpm es:ingest-live -- --subject maths --dry-run

  # Verbose output for debugging
  pnpm es:ingest-live -- --subject maths --keystage ks4 --verbose
```

### `pnpm ingest:all`

```bash
pnpm ingest:all [options]

Options:
  --resume      Resume from last checkpoint
  --reset       Reset progress and start fresh
  --dry-run     Preview without actually ingesting
  --help, -h    Show help

Progress:
  Tracked in .ingest-progress.json
  Safe to interrupt (Ctrl+C) and resume later
```

---

## Verification Steps

### 1. Check Index Counts

```bash
pnpm es:status
```

### 2. Verify ELSER Semantic Fields

The `lesson_semantic` and `unit_semantic` fields must be populated for ELSER to work:

```bash
# Quick check via ES query (requires curl)
curl -s -X GET "$ELASTICSEARCH_URL/oak_lessons/_count" \
  -H "Authorization: ApiKey $ELASTICSEARCH_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":{"exists":{"field":"lesson_semantic"}}}' | jq '.count'
```

Expected: Should equal total lesson count (e.g., 314 for Maths KS4).

### 3. Test ELSER Query Directly

```bash
curl -s -X POST "$ELASTICSEARCH_URL/oak_lessons/_search" \
  -H "Authorization: ApiKey $ELASTICSEARCH_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "size": 3,
    "query": {
      "semantic": {
        "field": "lesson_semantic",
        "query": "pythagoras theorem"
      }
    }
  }' | jq '.hits.total.value'
```

Expected: Non-zero value (e.g., 30+ for Pythagoras query).

### 4. Run Search Quality Smoke Tests

```bash
# Terminal 1: Start server
rm -rf .next && pnpm dev

# Terminal 2: Run smoke tests
pnpm test:smoke
```

---

## Troubleshooting

### "lesson_semantic count is 0"

**Cause**: The `lesson_semantic` field wasn't being populated during document creation.

**Fix**: This was fixed on 2025-12-10. Ensure you have the latest code and re-ingest:

```bash
git pull
pnpm build
pnpm es:ingest-live -- --subject maths --keystage ks4
```

### "ELSER query returns 0 hits"

**Cause**: Either the field isn't populated, or ELSER inference isn't running.

**Check**:

1. Verify field count (see verification steps above)
2. Check ES cluster health in Elastic Cloud console
3. Verify inference endpoint `.elser-2-elastic` exists

### "Ingestion times out"

**Cause**: API rate limiting or network issues.

**Fix**:

```bash
# Enable SDK caching to reduce API calls
pnpm redis:up
export SDK_CACHE_ENABLED=true
pnpm es:ingest-live -- --subject maths --keystage ks4
```

### "Missing environment variables"

**Fix**: Copy the example and fill in values:

```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

---

## Expected Results After Re-Indexing

After re-indexing Maths KS4 with the ELSER fix:

| Metric                | Before (Lexical Only) | After (Two-Way Hybrid) |
| --------------------- | --------------------- | ---------------------- |
| MRR                   | 0.892                 | TBD                    |
| NDCG@10               | 0.696                 | Expected > 0.75        |
| lesson_semantic count | 0                     | 314                    |

Run smoke tests after re-indexing to record the two-way hybrid baseline.

---

## Related Documentation

- [`NEW-SUBJECT-GUIDE.md`](./NEW-SUBJECT-GUIDE.md) - **Complete workflow for new subjects** (synonyms, quality, logging)
- [`INDEXING.md`](./INDEXING.md) - Technical indexing playbook
- [`SYNONYMS.md`](./SYNONYMS.md) - Synonym system documentation
- [`ES_SERVERLESS_SETUP.md`](./ES_SERVERLESS_SETUP.md) - ES Serverless setup guide
- [`SDK-CACHING.md`](./SDK-CACHING.md) - SDK response caching
