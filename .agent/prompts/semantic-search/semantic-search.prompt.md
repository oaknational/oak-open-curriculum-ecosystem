# Semantic Search — Complete Curriculum Ingestion & Evaluation

**Status**: BLOCKED — Complete ES ingestion required before evaluation work  
**Master Plan**: [Semantic Search Roadmap](../../plans/semantic-search/roadmap.md)  
**Last Updated**: 2025-12-28

---

## 🎯 PRIMARY OBJECTIVE

**Complete Elasticsearch ingestion of ALL 17 subjects to enable comprehensive ground truth and benchmark evaluation across the full UK curriculum.**

Current state: Only 6 of 17 subjects are in ES. This blocks all evaluation and synonym validation work.

---

## 📊 ES vs BULK DOWNLOAD COMPARISON (2025-12-28)

Reference data: `reference/bulk_download_data/oak-bulk-download-2025-12-07T09_37_04.693Z/`

### ⚠️ IMPORTANT: Bulk Download Contains Tier Duplicates

The bulk download contains **duplicate entries** for lessons in multiple tiers (foundation/higher) WITHOUT the tier discriminator field. Our ingestion correctly aggregates these into single documents with `tiers: ["foundation", "higher"]`.

**Example**: Maths secondary bulk = 1,235 entries → 862 unique lessons (373 tier duplicates).

See [upstream API wishlist](../../plans/external/ooc-api-wishlist/00-overview-and-known-issues.md) → Issue 2 for fix request.

### Target Counts (Unique Lessons)

| Subject | ES Count | Bulk Raw | Unique Target | Dups | Status |
|---------|----------|----------|---------------|------|--------|
| maths | 1,934 | 2,307 | 1,934 | 373 | ✅ Complete |
| english | 1,521 | 2,551 | 2,525 | 26 | ⚠️ Missing ~1,004 |
| art | 537 | 403 | 403 | 0 | ✅ Complete (ES has unitOptions) |
| computing | 528 | 528 | 528 | 0 | ✅ Complete |
| design-technology | 426 | 360 | 360 | 0 | ✅ Complete (ES has unitOptions) |
| citizenship | 318 | 318 | 318 | 0 | ✅ Complete |
| cooking-nutrition | 108 | 108 | 108 | 0 | ✅ Complete |
| science | 679 | 1,278 | 1,277 | 1 | ⚠️ KS4 needs sequences endpoint |
| **physical-education** | 0 | 992 | 992 | 0 | ❌ NOT INGESTED |
| **geography** | 0 | 750 | 683 | 67 | ❌ NOT INGESTED |
| **history** | 0 | 684 | 684 | 0 | ❌ NOT INGESTED |
| **religious-education** | 0 | 612 | 612 | 0 | ❌ NOT INGESTED |
| **french** | 0 | 522 | 522 | 0 | ❌ NOT INGESTED |
| **spanish** | 0 | 525 | 525 | 0 | ❌ NOT INGESTED |
| **music** | 0 | 434 | 434 | 0 | ❌ NOT INGESTED |
| **german** | 0 | 411 | 411 | 0 | ❌ NOT INGESTED |
| rshe-pshe | 0 | ? | ? | — | ❌ NOT INGESTED (no bulk file) |

**Total in ES**: ~5,372 lessons  
**Total Unique Target**: ~12,316 lessons  
**Coverage**: ~44%

**Duplicate causes**: Maths (tier variants), English/Geography (unit options), Science (cross-unit)

### Verify ES State

```bash
cd apps/oak-open-curriculum-semantic-search
source .env.local && curl -s -H "Authorization: ApiKey $ELASTICSEARCH_API_KEY" \
  "$ELASTICSEARCH_URL/oak_lessons/_search" -H "Content-Type: application/json" \
  -d '{"size": 0, "aggs": {"subjects": {"terms": {"field": "subject_slug", "size": 50}}}}' | jq '.aggregations.subjects.buckets'
```

---

## 🚀 IMMEDIATE ACTIONS (In Order)

### 1. Start Redis (required for SDK caching)

```bash
cd apps/oak-open-curriculum-semantic-search
docker compose up -d
```

### 2. Complete ALL Subject Ingestion

Run each subject one at a time. Each takes 5-30 minutes.

```bash
cd apps/oak-open-curriculum-semantic-search

# Priority 1: Core curriculum (largest)
SDK_CACHE_ENABLED=true pnpm es:ingest-live -- --subject maths
SDK_CACHE_ENABLED=true pnpm es:ingest-live -- --subject science

# Priority 2: Previously lost
SDK_CACHE_ENABLED=true pnpm es:ingest-live -- --subject history
SDK_CACHE_ENABLED=true pnpm es:ingest-live -- --subject geography

# Priority 3: Languages
SDK_CACHE_ENABLED=true pnpm es:ingest-live -- --subject french
SDK_CACHE_ENABLED=true pnpm es:ingest-live -- --subject spanish
SDK_CACHE_ENABLED=true pnpm es:ingest-live -- --subject german

# Priority 4: Remaining subjects
SDK_CACHE_ENABLED=true pnpm es:ingest-live -- --subject physical-education
SDK_CACHE_ENABLED=true pnpm es:ingest-live -- --subject religious-education
SDK_CACHE_ENABLED=true pnpm es:ingest-live -- --subject music
SDK_CACHE_ENABLED=true pnpm es:ingest-live -- --subject rshe-pshe
```

### 3. Verify Complete Ingestion

After all subjects complete, verify counts match expectations:

```bash
# Get per-subject counts
curl -s -H "Authorization: ApiKey $ELASTICSEARCH_API_KEY" \
  "$ELASTICSEARCH_URL/oak_lessons/_search" -H "Content-Type: application/json" \
  -d '{"size": 0, "aggs": {"subjects": {"terms": {"field": "subject_slug", "size": 50}}}}' | \
  jq '.aggregations.subjects.buckets | sort_by(.doc_count) | reverse'
```

---

## ✅ COMPLETED WORK

### Plan 17: Synonym Enrichment from OWA/OALA — COMPLETE

All OWA and OALA synonym aliases have been merged:

| Source | Items Added | Location |
|--------|-------------|----------|
| OWA subjects | art and design, phys ed, personal development, combined-science | `subjects.ts` |
| OALA key stages | eyfs, a-level, sixth form, reception | `key-stages.ts` |
| OWA year variants | yr1, year1, y1 formats | `key-stages.ts` |
| Exam boards | AQA, Edexcel, OCR, WJEC | `exam-boards.ts` |

### SDK Error Types — COMPLETE

`SdkFetchError` discriminated union is now **generated at type-gen time** in the SDK:

- Location: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/error-types/sdk-error-types.ts`
- Export: `@oaknational/oak-curriculum-sdk` exports `SdkFetchError`, `classifyHttpError`, `formatSdkError`
- Search app imports from SDK (no local copy)

### Architecture (ADR-087, ADR-088) — COMPLETE

- **ADR-087**: Batch-atomic ingestion — each (subject, keystage) commits immediately
- **ADR-088**: Result pattern — all SDK methods return `Result<T, SdkFetchError>`

---

## 🎯 AFTER INGESTION: Ground Truth & Evaluation

### Requirements

1. **Comprehensive Ground Truth Corpus**
   - Queries for ALL 17 subjects
   - Queries for ALL 4 key stages (KS1-KS4)
   - Include all query categories: naturalistic, synonym, misspelling, colloquial, multi-concept, intent-based

2. **Comprehensive Benchmark Evaluations**
   - Per-subject MRR baseline
   - Per-keystage MRR baseline
   - Overall MRR across full curriculum
   - Category-level breakdown (as currently exists for maths)

3. **Synonym Quality Audit**
   - Audit existing synonyms for noise/low-value entries
   - Measure impact of English foundational synonyms (adjective, noun, verb, etc.)
   - Document precision vs recall tradeoffs

### Current Ground Truth Status

| Scope | Status | Notes |
|-------|--------|-------|
| GCSE Maths | ✅ Complete | Existing corpus |
| KS1-3 Maths | ❌ Missing | |
| English (all KS) | ❌ Missing | Critical for foundational synonym validation |
| Science (all KS) | ❌ Missing | |
| Other subjects | ❌ Missing | |

---

## 📋 Architecture Reference

### Error Types (ADR-088)

```typescript
// Import from SDK — NOT local file
import { SdkFetchError, classifyHttpError, formatSdkError } from '@oaknational/oak-curriculum-sdk';

type SdkFetchError =
  | SdkNotFoundError      // 404 - skip and continue
  | SdkServerError        // 5xx - skip and continue  
  | SdkRateLimitError     // 429 - retry with backoff
  | SdkNetworkError       // Network failure - propagate
  | SdkValidationError    // Invalid response - propagate
```

### Ingestion CLI

```bash
# Single subject
pnpm es:ingest-live -- --subject maths

# Multiple subjects
pnpm es:ingest-live -- --subject maths --subject english

# ALL subjects (17 total)
pnpm es:ingest-live -- --all
```

### Key Files

| File | Purpose |
|------|---------|
| `src/lib/elasticsearch/setup/ingest-live.ts` | CLI entry point |
| `src/lib/indexing/ingest-harness.ts` | Orchestration |
| `src/lib/indexing/ingest-harness-batch.ts` | Batch iteration |
| `src/adapters/oak-adapter-sdk.ts` | SDK adapter (Result pattern) |

---

## 🔍 Synonym System Architecture

### Two Complementary Mechanisms

| Mechanism | Applies To | How It Works | Precision Risk |
|-----------|------------|--------------|----------------|
| ES Synonym Expansion | Single-word tokens | `oak_syns_filter` at query time | Higher |
| Phrase Detection + Boost | Multi-word terms | `detectCurriculumPhrases()` → `match_phrase` boost | Lower |

### Current Synonym Coverage

| File | Entries | Focus |
|------|---------|-------|
| `maths.ts` | ~375 lines | GCSE compounds, algebra, geometry |
| `key-stages.ts` | ~155 lines | KS abbreviations, OALA mappings |
| `subjects.ts` | ~118 lines | Subject name variants, OWA aliases |
| `english.ts` | ~78 lines | Foundational grammar terms |
| `numbers.ts` | ~69 lines | one↔1, two↔2, etc. |
| Others | ~200 lines | History, science, computing, music, etc. |

---

## Before You Start

### 1. Read Foundation Documents

1. **[rules.md](../../directives-and-memory/rules.md)** — TDD, quality gates, Result pattern
2. **[testing-strategy.md](../../directives-and-memory/testing-strategy.md)** — Test types
3. **[schema-first-execution.md](../../directives-and-memory/schema-first-execution.md)** — Generator-first

### 2. Verify Quality Gates

```bash
cd /Users/jim/code/oak/ai_experiments/oak-notion-mcp
pnpm type-gen && pnpm build && pnpm type-check && pnpm lint:fix && pnpm test
```

---

## Related Documents

- [Semantic Search Roadmap](../../plans/semantic-search/roadmap.md) — Master plan
- [synonym-quality-audit.md](../../plans/semantic-search/active/synonym-quality-audit.md) — Synonym audit plan
- [ADR-087](../../../docs/architecture/architectural-decisions/087-batch-atomic-ingestion.md) — Batch-atomic ingestion
- [ADR-088](../../../docs/architecture/architectural-decisions/088-result-pattern-for-error-handling.md) — Result pattern

---

## Success Criteria

1. ✅ ALL 17 subjects ingested to ES
2. ✅ ES counts verified against bulk download reference
3. ⏳ Ground truth queries created for all subjects/keystages
4. ⏳ Baseline MRR established across full curriculum
5. ⏳ Synonym quality audit complete
