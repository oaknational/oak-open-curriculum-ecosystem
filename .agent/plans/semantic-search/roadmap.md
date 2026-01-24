# Semantic Search Roadmap

**Status**: 🔄 **Ground Truth Review** — Validating expected slugs  
**Last Updated**: 2026-01-23  
**Metrics Source**: [current-state.md](current-state.md)  
**Session Entry**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)

**Scope**: Search SDK/CLI capabilities. UI delivery is out of scope (separate repository).

This is THE authoritative roadmap for semantic search work.

---

## Recent Changes (2026-01-23)

### Query Tuning + Science GT Fixes

**Key Changes**:

1. **`minimum_should_match: '2<65%'`** — Changed from `75%` to conditional matching:
   - ≤2 terms: all required (unchanged)
   - >2 terms: 65% required (more lenient for multi-term queries)
   - Location: `apps/.../src/lib/hybrid-search/rrf-query-helpers.ts:227`
   - **ADR**: [ADR-102: Conditional minimum_should_match](../../docs/architecture/architectural-decisions/102-conditional-minimum-should-match.md)

2. **Science GT Fixes**:
   - "energy transfers and efficiency": Search was correct, GT was wrong. Updated to efficiency lessons.
   - "plants and animals": Added `animal-habitats`, `protecting-microhabitats`
   - Added control queries for typo comparison

3. **Documented in modern-es-features.md**:
   - Fuzziness tuning (AUTO edit distance limits)
   - minimum_should_match tuning (conditional expressions)
   - Domain term boosting (deferred — highest priority for future work)

**Updated Science Metrics**:

| Phase | MRR | NDCG@10 | P@3 | R@10 |
|-------|-----|---------|-----|------|
| PRIMARY (13 queries) | 0.836 | 0.737 | 0.641 | 0.723 |
| SECONDARY (19 queries) | 0.932 | 0.731 | 0.561 | 0.741 |
| **OVERALL (32 queries)** | **0.893** | 0.733 | 0.594 | 0.734 |

**Known Fuzzy Matching Limitation**: "magnits" (intended: magnets) fuzzy-matches "magnify/magnification" because both share "magni-" prefix and edit distance = 2. This causes microscopy lessons to appear for electromagnet queries. **Solution**: Domain term boosting (documented in modern-es-features.md).

### Science Synonyms Expanded (Bucket A)

Added strict equivalences to `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/science.ts`:

- **Gravity**: gravitational force, gravitational pull, force of gravity
- **State changes**: melting/melt, freezing/freeze, evaporation/evaporate, condensation/condense, sublimation/sublime, deposition, ionisation
- **Oxidation**: oxidise, oxidising, rusting, rust, corrosion
- **Electromagnetism**: electricity, magnetism, electromagnetic field (physics, not electronics)

British English spelling is canonical (no Americanisms).

---

## Previous Changes (2026-01-22)

### Subject Hierarchy Enhancement COMPLETE ✅

The `subject_parent` field has been implemented and verified:

- Added `subject_parent` to SDK field definitions
- Updated document builders (`lesson-document-core.ts`, `unit-document-core.ts`)
- Updated query helpers to filter by `subject_parent`
- Full bulk re-index completed (~24 minutes)
- Verified in Kibana and via curl queries

**ADR**: [ADR-101: Subject Hierarchy for Search Filtering](../../docs/architecture/architectural-decisions/101-subject-hierarchy-for-search-filtering.md)

**Post-fix Science Secondary Metrics**:

| Metric | Score | Status |
|--------|-------|--------|
| MRR | 0.681 | ~ borderline |
| NDCG@10 | 0.521 | ✗ below threshold |
| P@3 | 0.333 | ✗ below threshold |
| R@10 | 0.611 | ✓ passing |

**Key Finding**: Filtering now works correctly. All science queries return science content. The remaining gaps are **search ranking issues** — vocabulary bridging failures and ranking quality.

**Science Phase 1B Discovery COMPLETE (2026-01-22)**:

- All 29 Science queries (12 primary + 17 secondary) have Phase 1B discovery complete
- 5 new queries added: natural-expression-4 + 4 KS4 subject-specific
- GCSE terminology replaced with KS4

**Next**: Science Phase 1C (FRESH RUN) — Run benchmarks for all 29 queries

---

## Previous Changes (2026-01-21)

### Religious Education Phase 1C COMPLETE

All 9 RE queries evaluated with three-way comparison:

| Phase | MRR | NDCG@10 | P@3 | R@10 |
|-------|-----|---------|-----|------|
| PRIMARY | 0.875 | 0.677 | 0.583 | 0.750 |
| SECONDARY | 0.640 | 0.526 | 0.467 | 0.510 |

**GT Corrections Made**: All 9 `.expected.ts` files updated after independent discovery. Original GT was COMPLETELY wrong for 6 of 9 queries (Sikh-specific content for generic queries).

**Bulk API Bug Identified**: Search returns Buddhist meditation content that doesn't exist in bulk data files. The Oak Bulk API returns incomplete data for paired RE units (Islam half only, not Buddhism half). See [bug report](bug-report-bulk-api-incomplete-paired-units.md).

### Physical Education Phase 1C COMPLETE

All 8 PE queries evaluated with three-way comparison:

| Phase | MRR | NDCG@10 | P@3 | R@10 |
|-------|-----|---------|-----|------|
| PRIMARY | 0.833 | 0.797 | 0.583 | 0.875 |
| SECONDARY | 0.813 | 0.725 | 0.667 | 0.787 |

**GT Corrections Made**: All 8 `.expected.ts` files updated after independent discovery.

**Synonym DRY Fix**: Removed duplicate subject name definitions from concept files. `subjects.ts` is now the single source of truth for subject name synonyms (e.g., `physical-education` → `pe`, `p.e.`). This fixed an issue where "sport/sports" was incorrectly expanding from PE queries.

---

## Previous Changes (2026-01-20)

### Music Complete (22/30)

All 8 Music queries evaluated with three-way comparison:

| Phase | MRR | NDCG@10 | P@3 | R@10 |
|-------|-----|---------|-----|------|
| PRIMARY | 0.781 | 0.567 | 0.417 | 0.750 |
| SECONDARY | 0.813 | 0.854 | 0.500 | 1.000 |

**GT Corrections**:

- `music/primary/natural-expression`: "In tune" = pitch accuracy, not timing
- `music/primary/imprecise-input`: KS1-appropriate (removed KS2 syncopation)
- `music/secondary/cross-topic`: Composition-focused film music (not analysis-only)

### Discovery Gate in Template (2026-01-19)

The [ground-truth-session-template.md](templates/ground-truth-session-template.md) now includes:

- **Discovery Gate**: Must complete curriculum exploration BEFORE running benchmark
- **Explicit evidence requirements**: Paste sections that must be filled
- **Two-phase structure**: Phase 1A (Discovery) → Phase 1B (Comparison)

### Benchmark Review Mode

Use `pnpm benchmark -s X -p Y --review` for per-query review showing ALL 4 metrics (MRR, NDCG@10, P@3, R@10).

---

## Execution Order

```
1. Ground Truth Review (active/)              ← CURRENT
   Validate expected slugs until search quality is the constraining factor
         ↓
1.6 Natural Language Paraphrases (post-sdk/bulk-data-analysis/natural-language-paraphrases.md)
    Add Bucket B paraphrase mappings for query-time expansion
         ↓
2. SDK Extraction (sdk-extraction/)
   Extract search from Next.js app into SDK + CLI
         ↓
2.5 Subject Domain Model (post-sdk/move-search-domain-knowledge-to-typegen-time.md)
    Centralise subject knowledge in Curriculum SDK (cleaner after SDK boundaries exist)
         ↓
3. MCP Integration (post-sdk/mcp-integration/)
   Wire hybrid search into MCP tools — FIRST consumer of SDK
         ↓
4. Everything Else (post-sdk/ streams, parallel where independent)
   ├── Search Quality (Levels 2 → 3 → 4)
   ├── Bulk Data Analysis
   ├── SDK API
   ├── Operations
   └── Extensions
```

---

## Status Legend

| Symbol | Status | Meaning |
|--------|--------|---------|
| ✅ | Complete | Work finished and verified |
| 🔄 | In Progress | Actively being worked on |
| 📋 | Pending | Ready to start, not blocked |
| ⏸️ | Blocked | Cannot start until dependency complete |

---

## 🔄 Phase 1: Ground Truth Review

**Status**: 🔄 In Progress (28/30 subject-phases complete)  
**Location**: [active/ground-truth-review-checklist.md](active/ground-truth-review-checklist.md)

**Goal**: Validate ground truths until search quality is the constraining factor.

Ground truths measure "did expected slugs appear?" — they must be correct before metrics are meaningful.

| Complete (28) | In Progress | Remaining (2) |
|---------------|-------------|---------------|
| art (2), citizenship (1), computing (2), cooking-nutrition (2), design-technology (2), english (2), french (2), geography (2), german (1), history (1+partial), maths (2), music (2), physical-education (2), religious-education (2), science (2 — Phase 1C + GT fixes COMPLETE) | None | spanish (2) |

**Immediate Next**: Spanish Phase 1B (Discovery) then Phase 1C

**After First Pass Complete**: Upgrade Maths GTs to match Science sophistication (control queries, more variants, more features). See [checklist](active/ground-truth-review-checklist.md) for details.

### Maths Phase 1C Complete (2026-01-20)

All 24 maths queries evaluated with three-way comparison:

| Phase | MRR | NDCG@10 | P@3 | R@10 |
|-------|-----|---------|-----|------|
| PRIMARY | 0.675 | 0.607 | 0.500 | 0.683 |
| SECONDARY | 0.861 | 0.749 | 0.667 | 0.828 |

**GT Corrections Made**:

- `maths/secondary/natural-expression-2.expected.ts`: Quadratic → linear equations
- `maths/primary/cross-topic`: "fractions word problems money" → "area and perimeter problems together"
- Synonym added: `times-table => timetables, timestables, time tables`

**Level 1 approaches are complete** but Level 1 is NOT exhausted until ground truth review validates the measurements.

---

## 📋 Phase 2.5: Subject Domain Model (After SDK Extraction)

**Status**: ⏸️ Blocked by SDK Extraction  
**Location**: [post-sdk/move-search-domain-knowledge-to-typegen-time.md](post-sdk/move-search-domain-knowledge-to-typegen-time.md)

**Goal**: Centralise subject-specific knowledge in the Curriculum SDK at type-gen time.

**Moved to after SDK extraction** (2026-01-23): Cleaner to do after SDK boundaries exist. The Search SDK extraction will create clear module boundaries, then subject domain model slots naturally into the Curriculum SDK with the Search SDK consuming it.

| Component | Current Location | Target Location |
|-----------|------------------|-----------------|
| Subject hierarchy | `apps/.../bulk-transform-helpers.ts` | SDK type-gen |
| KS4 patterns | `apps/.../curriculum-pattern-config.ts` | SDK type-gen |
| KS4 field config | `ks4-metadata-fields.ts` (shared) | Subject-aware |

---

## 📋 Phase 1.6: Natural Language Paraphrases (Pre-SDK)

**Status**: 📋 Ready after Ground Truth Review  
**Location**: [post-sdk/bulk-data-analysis/natural-language-paraphrases.md](post-sdk/bulk-data-analysis/natural-language-paraphrases.md)

**Goal**: Add Bucket B (pedagogy paraphrase) mappings for query-time weak expansions.

**Background**: Science ground truth analysis (2026-01-23) revealed that ELSER doesn't bridge everyday language to curriculum vocabulary when the gap is too large. For example:

| Natural Query | Curriculum Term | Current Search Behaviour |
|---------------|-----------------|--------------------------|
| "fall down" | gravity | Finds gravity at #1, but no expansion for related terms |
| "turn into water" | melting | Matches "water" broadly, not melting specifically |
| "feel hotter" | thermal conductivity | No semantic bridge |

**Solution**: Create subject-scoped paraphrase mappings that add weak query-time boosts:

| Component | Location |
|-----------|----------|
| Paraphrase data | `packages/sdks/oak-curriculum-sdk/src/mcp/paraphrases/science.ts` |
| Detection logic | `apps/.../src/lib/hybrid-search/paraphrase-detection.ts` |
| Query boosting | `apps/.../src/lib/hybrid-search/rrf-query-helpers.ts` |

**Distinction**: These are NOT synonyms (Bucket A). "fall down" ≠ "gravity". They are weak boosts (0.3-0.5) that help search find related curriculum content.

**Pre-SDK**: This work extends Level 1 (Fundamentals) before SDK extraction. The paraphrase data lives in the Curriculum SDK alongside existing synonyms.

---

## 📋 Phase 2: SDK Extraction

**Status**: 📋 Ready after Ground Truth Review  
**Location**: [sdk-extraction/search-sdk-cli.md](sdk-extraction/search-sdk-cli.md)

**Goal**: Extract semantic search from Next.js app into a dedicated SDK and CLI.

| Component | From | To |
|-----------|------|-----|
| Retrieval services | `apps/.../src/lib/hybrid-search/` | `packages/libs/search-sdk/retrieval/` |
| Admin services | `apps/.../src/lib/admin/` | `packages/libs/search-sdk/admin/` |
| CLI commands | `apps/.../scripts/` | `packages/tools/search-cli/` |

---

## 📋 Phase 3: MCP Integration

**Status**: ⏸️ Blocked by SDK Extraction  
**Location**: [post-sdk/mcp-integration/](post-sdk/mcp-integration/)

**Goal**: Wire hybrid search into MCP tools.

This is the **first consumer** of the SDK. Doing it first:

- Validates that the SDK interface is usable
- Provides immediate value to agent workflows
- Exposes any SDK API issues early

---

## 📋 Phase 4: Streams (Post-SDK)

**Status**: ⏸️ Blocked by MCP Integration  
**Location**: [post-sdk/](post-sdk/)

Work is organized into **streams** — coherent domains with their own intent and impact.

| Stream | Intent | Sequential? |
|--------|--------|-------------|
| [search-quality/](post-sdk/search-quality/) | Improve search result relevance | Yes (Levels 2 → 3 → 4) |
| [bulk-data-analysis/](post-sdk/bulk-data-analysis/) | Mine vocabulary from curriculum data | No |
| [sdk-api/](post-sdk/sdk-api/) | Understand and stabilise SDK API | No |
| [operations/](post-sdk/operations/) | Run the system safely | No |
| [extensions/](post-sdk/extensions/) | Add capabilities beyond core search | No |

Streams can run in parallel where independent. See each stream's README for details.

---

## Search Quality Levels

Within the search-quality stream, work is organized into **levels** (from [ADR-082](../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)):

| Level | Focus | Status |
|-------|-------|--------|
| **1** | Fundamentals (synonyms, phrase boosting) | ✅ Approaches complete |
| **1.6** | Natural Language Paraphrases (Bucket B) | 📋 Pending — extends Level 1 |
| **2** | Document Relationships | 📋 Pending |
| **3** | Modern ES Features (semantic reranking, query rules) | 📋 Pending |
| **4** | AI Enhancement (LLM preprocessing) | 📋 Pending — DESTINATION |

**Levels are sequential.** Exhaust lower levels before moving up.

**Level 1.6 (Paraphrases)** was identified during Science GT review (2026-01-23). It extends Level 1 to handle natural language → curriculum vocabulary bridging that ELSER doesn't cover.

**Level 4 is the destination, not optional.** Some queries cannot be solved without AI.

### MFL-Specific Considerations

Modern Foreign Languages (French, German, Spanish) have unique search challenges:

- **No transcripts**: MFL lessons have no video transcripts, only metadata
- **Vocabulary bridging limited**: ELSER (English-only) struggles with MFL content
- **Low MRR**: Current MFL MRR is 0.19-0.29, significantly below other subjects

**Potential enhancement**: Add a multilingual semantic text retriever for MFL subjects. This would use a multilingual embedding model (e.g., `multilingual-e5-base`) on the metadata semantic_text field, running alongside the existing ELSER and BM25 retrievers.

**Trade-offs to evaluate**:

- Additional index storage and query latency
- Model selection (multilingual E5 vs. mBERT vs. XLM-R)
- Whether to use as replacement or addition to ELSER for MFL
- Integration with existing RRF pipeline

**Plan**: [post-sdk/search-quality/mfl-multilingual-embeddings.md](post-sdk/search-quality/mfl-multilingual-embeddings.md)

---

## Two SDKs

| SDK | Location | Purpose |
|-----|----------|---------|
| **Curriculum SDK** | `packages/sdks/oak-curriculum-sdk/` | Access to upstream Oak API, type-gen |
| **Search SDK** | To be: `packages/libs/search-sdk/` | Elasticsearch-backed semantic search |

The Search SDK **consumes types from** the Curriculum SDK but is a separate concern.

---

## Quality Gates

Run after every piece of work, from repo root:

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

**All gates must pass. No exceptions.**

---

## Research Documents

| Document | Purpose |
|----------|---------|
| [elasticsearch-approaches.md](../../research/elasticsearch/oak-data/elasticsearch-approaches.md) | Elastic-native patterns |
| [aliases-and-equivalances.md](../../research/elasticsearch/oak-data/aliases-and-equivalances.md) | Synonym classification |
| [documentation-gap-analysis.md](../../research/elasticsearch/oak-data/documentation-gap-analysis.md) | Gaps and remediation |

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [completed.md](completed.md) | Historical completed work |
| [current-state.md](current-state.md) | Current metrics |
| [search-acceptance-criteria.md](search-acceptance-criteria.md) | Level definitions |

---

## Foundation Documents

Before any work, read:

1. [rules.md](../../directives-and-memory/rules.md) — First Question, TDD, no type shortcuts
2. [testing-strategy.md](../../directives-and-memory/testing-strategy.md) — TDD at ALL levels
3. [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md) — Generator is source of truth
