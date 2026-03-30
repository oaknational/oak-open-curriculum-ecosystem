# Ingestion Guide

**Purpose**: Complete guide to ingesting curriculum data into Elasticsearch.  
**Last Updated**: 2026-01-03

---

## Ingest Safety Policy

- Do not run ingest/promote commands until the execution plan records
  explicit readiness-gate closure.
- For operator-run ingest:
  1. Agent prepares exact command and pre-check context.
  2. Operator runs command independently.
  3. Agent monitors output and proposes remediation.
- Agent does not start ingest commands unless explicitly requested
  in-session.

---

## 🔴 IMPORTANT: Data Source Architecture

**ADR**: [ADR-083: Complete Lesson Enumeration Strategy](../../../../docs/architecture/architectural-decisions/083-complete-lesson-enumeration-strategy.md)

The Oak API provides different data sources for different purposes. Using the wrong source leads to incomplete data.

### Lesson Enumeration

| Source                  | Endpoint                                     | Complete?       | Use For            |
| ----------------------- | -------------------------------------------- | --------------- | ------------------ |
| ✅ **Lessons Endpoint** | `/key-stages/{ks}/subject/{subject}/lessons` | Yes (paginated) | Lesson enumeration |
| ❌ Unit Summary         | `/units/{slug}/summary` → `unitLessons[]`    | No (truncated)  | Unit metadata only |

**Why?** The unit summary's `unitLessons` is a truncated snapshot embedded in the sequence materialized view. The lessons endpoint uses a normalised view with complete data.

### Critical: Lessons Can Belong to Multiple Units

When ingesting lessons:

- Index each unique lesson **once** by `lessonSlug`
- **Aggregate all unit relationships** — don't just deduplicate
- A lesson in multiple tiers/programmes is legitimate, not a duplicate

### Other Data Sources (OK)

| Data Type | Source                                     | Status      |
| --------- | ------------------------------------------ | ----------- |
| Units     | `/key-stages/{ks}/subject/{subject}/units` | ✅ Complete |
| Threads   | `/threads` + `/threads/{slug}/units`       | ✅ Complete |
| Sequences | `/subjects/{subject}/sequences`            | ✅ Complete |

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
# From apps/oak-search-cli directory

# 1. Setup/verify ES cluster (creates indexes, synonyms)
pnpm es:setup

# 2. Re-ingest Maths KS4 only (API mode; bulk is default)
pnpm es:ingest -- --api --subject maths --key-stage ks4

# 3. Verify ELSER is working
pnpm es:status

# 4. Run smoke tests to measure search quality
pnpm test:smoke
```

---

## Available Commands

| Command                         | Purpose                                      | Duration             |
| ------------------------------- | -------------------------------------------- | -------------------- |
| `pnpm es:setup`                 | Create indexes, synonym sets, verify cluster | ~30 seconds          |
| `pnpm es:status`                | Check index counts, ELSER status             | ~5 seconds           |
| `pnpm es:ingest -- --api`       | Ingest from live Oak API (selective)         | 2-15 min per subject |
| `pnpm es:ingest -- --api --all` | Ingest ALL subjects/keystages (API mode)     | Hours                |
| `pnpm ingest:verify`            | Verify ingestion completeness                | ~1 minute            |

---

## Ingestion Process

### Step 1: Verify Prerequisites

```bash
cd apps/oak-search-cli

# Ensure environment is set up
grep -E '^(ELASTICSEARCH_URL|ELASTICSEARCH_API_KEY|OAK_API_KEY|SEARCH_API_KEY)=' .env.local
# Output includes:
# ELASTICSEARCH_URL=https://...
# ELASTICSEARCH_API_KEY=...
# OAK_API_KEY=...
# SEARCH_API_KEY=...

# Ensure SDK is built
cd ../.. && pnpm build && cd apps/oak-search-cli
```

`pnpm es:ingest` (and `pnpm es:ingest -- --api`) reads required values from `process.env`. If `.env.local` or
`.env` exists in `apps/oak-search-cli`, the CLI loads it automatically and those values
override existing process values.

`.env.local` is local-only and ignored by git. Keep real credentials local-only and keep
tracked files placeholder-only.

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
# Ingest Maths KS4 (API mode; semantic search demo data)
pnpm es:ingest -- --api --subject maths --key-stage ks4

# Ingest History KS2 (API mode; smaller, faster for testing)
pnpm es:ingest -- --api --subject history --key-stage ks2
```

#### Option B: Multiple Subjects

```bash
# Ingest common subjects for all key stages (API mode)
pnpm es:ingest -- --api --subject maths --subject science --subject english
```

#### Option C: All Data

```bash
# Ingest everything (API mode; takes hours)
pnpm es:ingest -- --api --all

# Verify ingestion completeness
pnpm ingest:verify
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

### `pnpm es:ingest`

```bash
pnpm es:ingest -- [options]

Options:
  --api               Use API mode (fetch from Oak API); default is bulk mode
  --subject <slug>    Subject to ingest (can repeat)
                      Required for API mode unless --all
  --key-stage <ks>     Key stage: ks1, ks2, ks3, ks4 (can repeat)
                      Default: all key stages
  --index <kind>      Index type: lessons, units, unit_rollup, sequences, sequence_facets
                      Default: all indexes
  --dry-run           Preview without writing to ES
  --clear-cache       Clear SDK response cache before ingestion
  --verbose, -v       Show detailed output
  --help, -h          Show help

Examples:
  # Re-ingest Maths KS4 lessons only (API mode)
  pnpm es:ingest -- --api --subject maths --key-stage ks4 --index lessons

  # Dry run to see what would be ingested (API mode)
  pnpm es:ingest -- --api --subject maths --dry-run

  # Verbose output for debugging (API mode)
  pnpm es:ingest -- --api --subject maths --key-stage ks4 --verbose
```

### Full Ingestion with `--all`

```bash
pnpm es:ingest -- --all [options]

Options:
  --all              Ingest all subjects
  --dry-run          Preview without writing to ES
  --bypass-cache     Continue without Redis cache
  --max-retries <n>  Max retry attempts
  --retry-delay <ms> Base retry delay in ms
  --no-retry         Disable document-level retry
  -v, --verbose      Show detailed output
  -h, --help         Display help

Examples:
  pnpm es:ingest -- --api --all                  # Full fresh ingestion (API mode)
  pnpm es:ingest -- --api --all --dry-run        # Preview what would be ingested (API mode)
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
# Smoke tests hit live Elasticsearch directly (no server required)
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
pnpm es:ingest -- --api --subject maths --key-stage ks4
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
pnpm es:ingest -- --api --subject maths --key-stage ks4
```

### "Missing environment variables"

**Fix**: Set required values either via exported process environment values or
`apps/oak-search-cli/.env.local`.

`.env.local` option:

```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

Never commit `.env.local`, and never add real credentials to `.env.example`.

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

| Document                                           | Purpose                                                         |
| -------------------------------------------------- | --------------------------------------------------------------- |
| [NEW-SUBJECT-GUIDE.md](./NEW-SUBJECT-GUIDE.md)     | Complete workflow for new subjects (synonyms, quality, logging) |
| [INDEXING.md](./INDEXING.md)                       | Technical indexing playbook                                     |
| [SYNONYMS.md](./SYNONYMS.md)                       | Synonym system documentation                                    |
| [ES_SERVERLESS_SETUP.md](./ES_SERVERLESS_SETUP.md) | ES Serverless setup guide                                       |
| [SDK-CACHING.md](./SDK-CACHING.md)                 | SDK response caching                                            |

## Related ADRs

| ADR                                                                                                       | Topic                                |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| [ADR-083](../../../docs/architecture/architectural-decisions/083-complete-lesson-enumeration-strategy.md) | Complete Lesson Enumeration Strategy |
| [ADR-087](../../../docs/architecture/architectural-decisions/087-batch-atomic-ingestion.md)               | Batch-Atomic Ingestion               |
| [ADR-093](../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md)        | Bulk-First Ingestion Strategy        |
| [ADR-096](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md)               | ES Bulk Retry Strategy               |
