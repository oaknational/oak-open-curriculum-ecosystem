# Semantic Search Current State

**Last Updated**: 2026-01-05
**Status**: ✅ **Phase 5a Complete** — Ready for Phase 5b (maths/primary ground truths)
**Session Context**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)
**Current Plan**: [m3-revised-phase-aligned-search-quality.md](active/m3-revised-phase-aligned-search-quality.md)

This is THE authoritative source for current system metrics.

---

## ✅ Phase 5a Complete (2026-01-05)

**Ground truth restructure is COMPLETE. All quality gates pass.**

### What Was Done ✅
- All `ks3/` directories renamed to `secondary/`
- All `ks2/` directories renamed to `primary/`  
- English `ks3/` + `ks4/` merged into `english/secondary/`
- Maths files moved to `maths/secondary/`
- Root `index.ts` cleaned up (no deprecated aliases)
- `analyze-cross-curriculum.ts` updated with phase-based exports
- Fixed corrupted UNIT_* export names from sed timeout
- Updated all consumer files with correct imports
- All 934 unit tests pass, e2e tests pass, smoke tests pass

### What's Next: Phase 5b
1. Create `maths/primary/` ground truths (30+ queries for KS1+KS2)
2. Use MCP tools to discover KS1+KS2 maths content
3. Validate all slugs via API

---

## 🚨 Architectural Discovery (2026-01-03)

**The per-key-stage baseline approach is fundamentally flawed.**

English KS1 (0.131) and KS2 (0.107) show catastrophically low MRR because:
- The same "Primary" ground truths were used for both KS1 and KS2 tests
- But expected slugs are key-stage-specific (BFG is KS2, Billy Goats is KS1)
- This is a **test design flaw**, not a search quality issue

**Solution**: Restructure ground truths and filters around **phases** (primary/secondary) as the fundamental division.

See [m3-revised-phase-aligned-search-quality.md](active/m3-revised-phase-aligned-search-quality.md) for the revised plan.

---

## Current ES Index State

From Elastic Cloud Index Management (2026-01-02):

| Index | Documents | Storage |
|-------|-----------|---------|
| `oak_lessons` | 184,985 | 806.62MB |
| `oak_unit_rollup` | 165,345 | 706.06MB |
| `oak_units` | 1,635 | 8.94MB |
| `oak_threads` | 164 | 255.53KB |
| `oak_sequence_facets` | 57 | 375.14KB |
| `oak_sequences` | 30 | 267.67KB |
| `oak_meta` | 1 | 5.34KB |

**Note**: `oak_lessons` and `oak_unit_rollup` counts include ELSER sub-documents for sparse vector storage. Actual document counts:

| Document Type | Count |
|---------------|-------|
| Lessons | 12,833 |
| Units | 1,665 |
| Threads | 164 |
| Sequences | 30 |
| Sequence facets | 57 |
| **Total** | **16,414** |

---

## Search Quality Metrics

### Metrics Tracked

| Metric | Purpose | Reference |
|--------|---------|-----------|
| **MRR** | Position of first relevant result | Primary acceptance metric |
| **NDCG@10** | Overall ranking quality | Secondary quality metric |
| **Precision@10** | Proportion of top 10 that are relevant | Noise detection |
| **Recall@10** | Proportion of relevant found in top 10 | Completeness detection |
| **Zero-Hit Rate** | Queries returning nothing | Coverage gaps |
| **p95 Latency** | User experience | Performance budget |

> **Full definitions**: See [IR-METRICS.md](../../../apps/oak-open-curriculum-semantic-search/docs/IR-METRICS.md)

### Ground Truth Coverage (2026-01-03)

| Dimension | Previous | Current | Status |
|-----------|----------|---------|--------|
| Subjects | 1 (Maths) | **16** | ✅ Complete |
| Key Stages | KS4 only | **KS1-4** | ✅ Complete |
| Query count | 73 | **263** | ✅ M3 Target exceeded |

### Cross-Curriculum MRR Baselines (2026-01-03)

#### Core Subjects (Per Key Stage)

| Subject | Key Stage | Queries | Overall MRR | Nat | Mis | Syn | Multi | Col | Status |
|---------|-----------|---------|-------------|-----|-----|-----|-------|-----|--------|
| **Maths** | KS4 | 55 | **0.894** | 0.930 | 1.000 | 0.833 | 0.750 | 0.500 | ✅ Excellent |
| **English** | KS1 | 14 | **0.131** | 0.136 | 0.000 | 0.333 | — | 0.000 | ⚠️ TEST FLAW |
| **English** | KS2 | 14 | **0.107** | 0.045 | 0.000 | 0.000 | — | 1.000 | ⚠️ TEST FLAW |
| **English** | KS3 | 17 | **0.742** | 0.818 | 0.500 | 0.333 | — | 0.333 | ✅ Good |
| **English** | KS4 | 35 | **0.394** | 0.401 | 0.583 | 0.000 | 0.000 | 1.000 | ⚠️ Acceptable |
| **Science** | KS2 | 15 | **0.852** | 0.938 | 0.333 | 0.200 | — | 1.000 | ✅ Excellent |
| **Science** | KS3 | 20 | **0.899** | 0.874 | 1.000 | 1.000 | 1.000 | — | ✅ Excellent |

**⚠️ TEST FLAW**: English KS1/KS2 baselines are invalid — Primary ground truths span both key stages but were tested against single key stage filters. See architectural discovery above.

#### Humanities (Per Key Stage)

| Subject | Key Stage | Queries | Overall MRR | Nat | Mis | Syn | Multi | Col | Status |
|---------|-----------|---------|-------------|-----|-----|-----|-------|-----|--------|
| **History** | KS2 | 6 | **0.667** | 0.800 | 0.000 | — | — | — | ✅ Good |
| **History** | KS3 | 10 | **0.950** | 0.938 | 1.000 | 1.000 | — | — | ✅ Excellent |
| **Geography** | KS3 | 9 | **0.759** | 0.806 | 0.500 | 0.500 | 1.000 | — | ✅ Good |
| **Religious Ed** | KS3 | 7 | **0.667** | 0.667 | 0.333 | 1.000 | — | — | ✅ Good |

#### Languages (KS3 Only)

| Subject | Key Stage | Queries | Overall MRR | Nat | Mis | Syn | Col | Status |
|---------|-----------|---------|-------------|-----|-----|-----|-----|--------|
| **French** | KS3 | 6 | **0.190** | 0.286 | 0.000 | 0.000 | — | ❌ Poor |
| **Spanish** | KS3 | 6 | **0.294** | 0.417 | 0.000 | 0.100 | — | ❌ Poor |
| **German** | KS3 | 6 | **0.194** | 0.292 | 0.000 | 0.000 | — | ❌ Poor |

#### Creative & Other (KS3 Unless Noted)

| Subject | Key Stage | Queries | Overall MRR | Nat | Mis | Syn | Col | Status |
|---------|-----------|---------|-------------|-----|-----|-----|-----|--------|
| **Computing** | KS3 | 9 | **0.481** | 0.571 | 0.333 | 0.000 | — | ⚠️ Acceptable |
| **Art** | KS3 | 9 | **0.741** | 0.810 | 0.500 | 0.500 | — | ✅ Good |
| **Music** | KS3 | 9 | **0.722** | 0.714 | 0.500 | — | 1.000 | ✅ Good |
| **D&T** | KS3 | 9 | **0.815** | 0.806 | 1.000 | 1.000 | 0.500 | ✅ Excellent |
| **PE** | KS3 | 9 | **0.356** | 0.450 | 0.000 | 0.500 | 0.000 | ❌ Poor |
| **Citizenship** | KS3 | 6 | **0.667** | 0.708 | 0.167 | 1.000 | — | ✅ Good |
| **Cooking** | KS2 | 6 | **0.493** | 0.667 | 0.167 | — | 0.125 | ⚠️ Acceptable |
| **RSHE/PSHE** | — | — | — | — | — | — | — | ⏸️ Deferred |

**Legend**: Nat=Naturalistic, Mis=Misspelling, Syn=Synonym, Multi=Multi-concept, Col=Colloquial

### Performance Tiers (Current State)

| Tier | Count | Subject/KS Combinations |
|------|-------|-------------------------|
| ✅ Excellent (MRR ≥ 0.7) | 11 | Maths KS4, English KS3, Science KS2, Science KS3, History KS3, Geography KS3, Art KS3, Music KS3, D&T KS3 |
| ✅ Good (MRR 0.5-0.7) | 4 | History KS2, RE KS3, Citizenship KS3 |
| ⚠️ Acceptable (MRR 0.4-0.5) | 3 | English KS4, Computing KS3, Cooking KS2 |
| ❌ Poor (MRR < 0.4) | 6 | English KS1, English KS2, French KS3, Spanish KS3, German KS3, PE KS3 |
| ⏸️ Deferred | 1 | RSHE/PSHE (no bulk data) |

### Key Findings from Comprehensive Baselines (2026-01-03)

1. **Primary English severely underperforms** — KS1 (0.131) and KS2 (0.107) have critical MRR gaps
2. **Science performs excellently** — Both KS2 (0.852) and KS3 (0.899) exceed expectations
3. **History KS3 is top performer** — 0.950 MRR demonstrates strong curriculum alignment
4. **MFL continues to struggle** — All three languages remain below 0.3 MRR (upstream transcript issue)
5. **English KS4 needs attention** — GCSE English at 0.394 MRR is below acceptable threshold
6. **Misspelling remains a weakness** — Multiple subjects score 0.000 on typo handling

### ⚠️ Root Cause: MFL Lessons Have No Transcripts (Upstream Issue)

**Discovery (2026-01-03)**: MFL lessons lack transcripts entirely — verified via API.

| Subject | Bulk Transcript Coverage | API Response |
|---------|--------------------------|--------------|
| French | 0.2% (1/417) | **500 server error** |
| Spanish | 0.2% (1/525) | **404 "not available"** |
| German | 0.2% (1/411) | **500 server error** |
| Maths | 99.8% | ✅ Full transcript |

**Root Cause**: Automatic captioning doesn't work for non-English speech. MFL videos exist (confirmed via assets API) but transcripts were never generated.

**Implications**:

- **This is an upstream Oak data issue** — we cannot fix it in our codebase
- MFL search relies entirely on metadata (titles, outcomes, keywords — all in English)
- ELSER limitation is now moot — there's no transcript content to semantically match

See [mfl-multilingual-embeddings.md](post-sdk-extraction/mfl-multilingual-embeddings.md) for full analysis.

**Potential improvements within our scope**:

1. Boost BM25 weight for lesson titles (contain target language)
2. Add MFL-specific synonyms for grammar terms
3. Report issue to Oak for upstream fix

---

## Data Completeness

### Categories (Subject-Specific)

Only 3 subjects have categories:

| Subject | Categories |
|---------|------------|
| English | Grammar, Handwriting, Reading/writing/oracy |
| Science | Biology, Chemistry, Physics |
| Religious Education | Theology, Philosophy, Social science |

Other subjects use **threads** for navigation (all 164 threads indexed).

See [category-availability-by-subject.md](../../analysis/category-availability-by-subject.md).

### Thread Context

Unit documents now include:
- `thread_slugs` — All associated thread slugs
- `thread_titles` — Human-readable thread names
- `thread_orders` — Position in each thread

---

## ✅ Completed Work

| Milestone | Status | ADR |
|-----------|--------|-----|
| M1: Complete ES Ingestion | ✅ Verified | [ADR-096](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md) |
| M2: Sequence Indexing | ✅ Verified | — |
| M3: Ground Truth Expansion | ✅ **Complete** | — |
| M4: DRY/SRP Refactoring | ✅ Complete | — |
| M5: Data Completeness | ✅ Complete | [ADR-097](../../../docs/architecture/architectural-decisions/097-context-enrichment-architecture.md) |

## 🎯 Next Priority

**Post-M3: Search Quality Optimization by Subject**

**Priority subjects for improvement** (based on comprehensive baselines):

| Priority | Subject/KS | MRR | Issue | Recommended Action |
|----------|-----------|-----|-------|-------------------|
| **1** | English KS1/KS2 | 0.13/0.11 | Primary content not found | Investigate ground truth alignment with indexed content |
| **2** | English KS4 | 0.39 | GCSE texts poorly matched | Add An Inspector Calls, Macbeth-specific synonyms |
| **3** | French/Spanish/German | 0.19-0.29 | No transcripts (upstream) | Add MFL grammar synonyms, boost title weighting |
| **4** | PE KS3 | 0.36 | Misspellings not handled | Add PE-specific fuzzy terms |
| **5** | Computing KS3 | 0.48 | "coding" not bridged | Add "coding"→"programming" synonym |

**Recommended next steps**:
1. Investigate English Primary ground truth alignment — expected slugs may not exist in KS1/KS2 content
2. Add subject-specific synonyms for GCSE texts (An Inspector Calls characters, etc.)
3. Add MFL grammar term synonyms ("negation"↔"saying no", etc.)
4. Implement fuzzy matching improvements for common misspellings

See [roadmap.md](roadmap.md) for full details.

---

## Ingestion Performance

| Metric | Value |
|--------|-------|
| Documents indexed | 16,414 |
| Initial failures | 17 (0.10%) |
| Final failures | 0 |
| Retry rounds | 1 |
| Duration | ~22 minutes |

### Optimised Parameters

| Constant | Value | Purpose |
|----------|-------|---------|
| `MAX_CHUNK_SIZE_BYTES` | 8MB | Reduce ELSER queue pressure |
| `DEFAULT_CHUNK_DELAY_MS` | 7001ms | Base delay between chunks |
| `DOCUMENT_RETRY_CHUNK_DELAY_MULTIPLIER` | 1.5× | Progressive delay |

---

## Experiment Protocol

**When making changes to search**, follow the [EXPERIMENTAL-PROTOCOL.md](../../evaluations/EXPERIMENTAL-PROTOCOL.md):

1. **Design** — Document hypothesis and success criteria
2. **Baseline** — Run cross-curriculum analysis, record in EXPERIMENT-LOG
3. **Implement** — Make one change at a time
4. **Measure** — Run benchmarks again
5. **Decide** — Accept if improvement, reject if regression

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [EXPERIMENTAL-PROTOCOL.md](../../evaluations/EXPERIMENTAL-PROTOCOL.md) | **How to run experiments** |
| [roadmap.md](roadmap.md) | Master plan |
| [search-acceptance-criteria.md](search-acceptance-criteria.md) | Tier definitions |
| [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md) | Experiment history |
| [ADR-096](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md) | ES Bulk Retry |
| [ADR-097](../../../docs/architecture/architectural-decisions/097-context-enrichment-architecture.md) | Context Enrichment |
