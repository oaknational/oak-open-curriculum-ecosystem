# Part 1: Search Excellence

**Status**: 🔄 In Progress  
**Priority**: High  
**Done When**: Hard Query MRR ≥0.50, Search SDK ready for MCP consumption  
**Created**: 2025-12-19  
**Strategy**: [ADR-082: Fundamentals-First Search Strategy](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)

---

## Before You Start: Foundation Documents (MANDATORY)

Read and commit to these before ANY work:

1. **[rules.md](../../directives-and-memory/rules.md)** — TDD, quality gates, no type shortcuts
2. **[testing-strategy.md](../../directives-and-memory/testing-strategy.md)** — Test types and TDD at ALL levels
3. **[schema-first-execution.md](../../directives-and-memory/schema-first-execution.md)** — Generator-first architecture
4. **[ADR-082](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)** — Fundamentals-first strategy

### The First Question

Before every change, ask: **"Could it be simpler without compromising quality?"**

### Cardinal Rule

If the upstream schema or SDK changes, running `pnpm type-gen` followed by `pnpm build` MUST be sufficient to bring all workspaces into alignment. This applies to **synonyms** (ADR-063) — they live in the SDK and flow through type-gen.

---

## Success Criteria

From [ADR-081](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md).

For current metrics, see **[current-state.md](current-state.md)**.

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Standard Query MRR (Lessons) | ≥0.92 | 0.944 | ✅ Met |
| Standard Query MRR (Units) | ≥0.92 | 0.988 | ✅ Met |
| Hard Query MRR (Lessons) | ≥0.50 | 0.316 | ❌ Gap: 37% |
| Hard Query MRR (Units) | ≥0.50 | 0.856 | ✅ Exceeded (+71%) |
| Zero-hit Rate | 0% | 0% | ✅ Met |
| p95 Latency | ≤1500ms | ~450ms | ✅ Met |

**Baselines measured**: 2025-12-22 20:29 UTC with complete data (436 lessons, 36 units)

For experiment history, see **[EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md)**.

---

## ✅ Quality Gates Pass (2025-12-22)

All quality gates pass. Test isolation architecture fix is complete.

| Gate | Status |
|------|--------|
| `pnpm test` | ✅ 88 files, 490 tests |
| All other gates | ✅ Pass |

---

## ✅ RESOLVED: Ingestion Data Quality (2025-12-22)

**All ingestion issues resolved. Complete data indexed and validated. Search experimentation resumed.**

**ADR**: [ADR-083: Complete Lesson Enumeration Strategy](../../../docs/architecture/architectural-decisions/083-complete-lesson-enumeration-strategy.md)

| Issue | Status |
|-------|--------|
| ~~Lesson count truncated~~ | ✅ Fixed (314 → 436, validated vs bulk download) |
| ~~Test isolation broken~~ | ✅ Fixed (504 tests pass, 2025-12-22) |
| ~~Unit `lesson_count` wrong~~ | ✅ Fixed (36/36 units correct, 2025-12-22) |
| ~~Thread field naming error~~ | ✅ Fixed (`thread_slugs` populated, 2025-12-22) |
| ~~Vestigial `tier` field~~ | ✅ Verified correct (no cleanup needed) |

**Root Cause**: Upstream API pagination bug where unfiltered `/key-stages/{ks}/subject/{subject}/lessons` returns incomplete data (431 instead of 436 lessons).

**Fix**: Implemented `fetchAllLessonsByUnit()` workaround that fetches lessons unit-by-unit.

**Validation**: 
- ✅ All tests pass (504 tests across 89 files)
- ✅ Bulk download validation (436 lessons, 36 units match exactly)
- ✅ Re-ingested fresh data (2025-12-22 18:47 UTC)
- ✅ Baselines re-measured with complete data (2025-12-22 20:29 UTC)

**See**: [COMPLETION-REPORT-2025-12-22.md](../quality-and-maintainability/COMPLETION-REPORT-2025-12-22.md) for full details.

### Root Cause (Verified via Upstream API Code)

The ingestion derives lessons from unit summaries (`/units/{slug}/summary` → `unitLessons[]`), which are **truncated**. Investigation of `reference/oak-openapi/` revealed:

| Endpoint | Materialized View | Data Source | Status |
|----------|-------------------|-------------|--------|
| Unit Summary | `sequenceView` | JSON array embedded in sequence record | ❌ Truncated snapshot |
| Lessons | `unitVariantLessonsView` | Normalised row-per-lesson view | ✅ Complete with pagination |

The `unitLessons` truncation is **by design** — the `sequenceView` is optimised for quick unit overview, not lesson enumeration. This is not a bug, but we were using the wrong data source.

| Source | Maths KS4 Lessons | Data Loss |
|--------|-------------------|-----------|
| Unit Summary (`unitLessons`) | 314 | — |
| Lessons Endpoint (paginated) | ~650+ | **52% missing** |

**Example**: `algebraic-fractions` unit summary returns **2 lessons**, but lessons endpoint returns **10 lessons** (8 unique).

### Critical Nuance: Aggregation, Not Simple Deduplication

**Lessons can legitimately belong to multiple units, tiers, and programmes.** The lessons endpoint returns one row per (lesson, unit variant) pair.

When indexing lessons:

1. ✅ **Index each unique lesson ONCE** by `lessonSlug`
2. ✅ **Aggregate ALL unit relationships** — collect all units a lesson belongs to
3. ❌ **Do NOT simply deduplicate** — this would drop legitimate unit associations

```typescript
// WRONG: Simple deduplication loses unit relationships
const uniqueLessons = new Set(lessons.map(l => l.lessonSlug));

// CORRECT: Aggregate by lessonSlug, collect all units
const lessonMap = new Map<string, {
  lessonSlug: string;
  lessonTitle: string;
  unitSlugs: Set<string>;  // ALL units this lesson belongs to
}>();
```

### Required Fix

Change the ingestion flow:

```text
❌ CURRENT: /units → /units/{slug}/summary → unitLessons[] (TRUNCATED)
✅ CORRECT: /key-stages/{ks}/subject/{subject}/lessons (PAGINATED) → Aggregate by lessonSlug
```

Keep unit summaries for unit-level metadata (description, threads, curriculum statements).

### TDD Implementation Steps

1. **RED**: Write integration test asserting `algebraic-fractions` returns 8+ lessons
2. **GREEN**: Implement pagination + aggregation in `fetchAllLessons()`
3. **REFACTOR**: Remove `deriveLessonGroupsFromUnitSummaries()` approach

### Actions Before Continuing

1. [ ] **Implement fix** — Refactor ingestion per ADR-083
2. [ ] **Re-index** — Full re-ingestion with corrected source (`pnpm es:ingest-live`)
3. [ ] **Verify** — `pnpm es:status` should show ~650+ lessons (not 314)
4. [ ] **Re-measure baseline** — New MRR metrics against complete index
5. [ ] ✅ **Update upstream wishlist** — Done (see `00-overview-and-known-issues.md`)
6. [ ] ✅ **Create ADR** — Done (ADR-083)

### Files to Modify

| File | Change |
|------|--------|
| `src/lib/index-oak-helpers.ts` | Add `fetchAllLessons()` with pagination |
| `src/lib/indexing/index-bulk-helpers.ts` | Replace `deriveLessonGroupsFromUnitSummaries()` |
| `src/adapters/oak-adapter-sdk.ts` | Ensure pagination params supported |

See [current-state.md](current-state.md) for full analysis.

---

## Strategic Direction (Updated 2025-12-19)

**B.2 (Semantic Reranking) was REJECTED** with a -16.8% regression on lesson MRR. This led to a strategic pivot documented in [ADR-082](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md):

> "We should be able to do an excellent job with traditional methods, and an amazing job with non-AI recent search methods, and a phenomenal job once we take that already optimised approach and add AI into the mix."

**Key Insight**: AI on weak fundamentals = amplified weakness. AI on strong fundamentals = excellence.

**New Priority Order**:

1. **Tier 1: Search Fundamentals** — Synonyms, phrase matching, noise filtering
2. **Tier 2: Document Relationships** — Cross-referencing units↔lessons, thread context
3. **Tier 3: Modern ES Features** — RRF tuning, Linear Retriever
4. **Tier 4: AI Enhancement** — Only when Tiers 1-3 plateau

---

## Stream Overview

```text
═══════════════════════════════════════════════════════════════════
Part 1: Search Excellence (Fundamentals-First Strategy)
═══════════════════════════════════════════════════════════════════
Done when: Hard Query MRR ≥0.50, Search SDK ready for MCP consumption

Stream A: Foundation                                [✅ Complete]
───────────────────────────────────────────────────────────────────
  A.1  4-way hybrid implementation                         ✅
  A.2  KS4 filtering                                       ✅
  A.3  Content-type-aware BM25                             ✅
  A.4  Ground truth queries defined                        ✅

Stream B: Tier 1 — Search Fundamentals              [🔄 In Progress]
───────────────────────────────────────────────────────────────────
  B.1  Baseline documentation                              ✅ Complete
  B.2  Semantic reranking experiment                       ❌ Rejected
  B.3  Comprehensive synonym coverage                      ✅ Complete
  B.4  Noise phrase filtering                              📋
  B.5  Phrase query enhancement                            📋
  B.6  Validate Tier 1 (MRR ≥0.45)                         📋

Stream C: Tier 2 — Document Relationships           [📋 After Tier 1]
───────────────────────────────────────────────────────────────────
  C.1  Unit→Lesson cross-reference                         📋
  C.2  Thread-based relevance                              📋
  C.3  More Like This                                      📋
  C.4  Validate Tier 2 (MRR ≥0.55)                         📋

Stream D: Tier 3 — Modern ES Features               [📋 After Tier 2]
───────────────────────────────────────────────────────────────────
  D.1  RRF parameter optimisation                          📋
  D.2  Linear Retriever                                    📋
  D.3  Field boosting refinement                           📋
  D.4  Validate Tier 3 (MRR ≥0.60)                         📋

Stream E: AI Enhancement                            [⏸️ DEFERRED]
───────────────────────────────────────────────────────────────────
  Only pursue when Tiers 1-3 show diminishing returns
  E.1  LLM query expansion                                 ⏸️
  E.2  LLM reranking (domain-aware)                        ⏸️

Stream F: Infrastructure                            [📋 Ready]
───────────────────────────────────────────────────────────────────
  F.1  Extract Search SDK                                  📋
  F.2  Create CLI workspace                                📋
  F.3  Retire Next.js app                                  📋
  F.4  Documentation                                       📋

Dependencies:
  • Stream C depends on Stream B (Tier 1 exit criteria)
  • Stream D depends on Stream C (Tier 2 exit criteria)
  • Stream E deferred until Tiers 1-3 plateau
  • Stream F can start immediately (no blockers)
```

---

## Stream A: Foundation [✅ Complete]

**Purpose**: Establish the baseline search infrastructure with four-retriever hybrid architecture.

**Completed Work** (see [phase-3-multi-index-and-fields.md](phase-3-multi-index-and-fields.md)):

| Task | Description | Status |
|------|-------------|--------|
| A.1 | Four-way hybrid implementation (BM25 + ELSER on Content + Structure) | ✅ |
| A.2 | KS4 filtering (tier, examBoard, examSubject, ks4Option) | ✅ |
| A.3 | Content-type-aware BM25 (min_should_match: 75% for lessons) | ✅ |
| A.4 | Ground truth queries defined (standard + hard) | ✅ |

**Key Outcomes**:

- Standard Query MRR: 0.931
- Hard Query MRR: 0.367 (improved from 0.250 baseline)
- All quality gates passing

---

## Stream B: Tier 1 — Search Fundamentals [🔄 START HERE]

**Purpose**: Master traditional search techniques before adding complexity.

**Governing ADR**: [ADR-082](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)

### B.1 Baseline Documentation [✅ Complete]

See [hard-query-baseline.md](../../evaluations/baselines/hard-query-baseline.md).

Key findings from baseline:

| Category | Lesson MRR | Status | Root Cause |
|----------|------------|--------|------------|
| Misspelling | 0.833 | ✅ Excellent | — |
| Intent-based | 0.500 | ✅ Good | — |
| Naturalistic | 0.333 | ⚠️ Acceptable | Noise phrases |
| Multi-concept | 0.250 | ❌ Poor | Cross-reference missing |
| Synonym | 0.167 | ❌ Poor | **Vocabulary gap** |
| Colloquial | 0.000 | ❌ Very Poor | Noise + vocabulary |

**Primary failure modes**: 5/8 lesson failures are vocabulary gaps fixable with synonyms.

### B.2 Semantic Reranking [❌ REJECTED]

See [semantic-reranking.experiment.md](../../evaluations/experiments/semantic-reranking.experiment.md).

**Result**: -16.8% regression on lesson MRR. Generic cross-encoder doesn't understand curriculum.

**Lesson Learned**: AI on weak fundamentals = amplified weakness.

### B.3 Comprehensive Synonym Coverage [✅ Complete]

**Result**: Added 40+ Maths KS4 synonyms. Smoke test passes for vocabulary gap queries.

**Impact (measured with complete data 2025-12-22)**:
- Baseline MRR (before synonyms, incomplete index): 0.367 lessons, 0.811 units
- With synonyms + complete index: 0.316 lessons, 0.856 units
- **Note**: Direct comparison not valid due to index completeness change

**Qualitative wins** (from B.1 Evidence):

| Query | Expected Match | Current Rank | Missing Synonym |
|-------|---------------|--------------|-----------------|
| "solving for x" | linear equations | >10 | solving for x → linear equations |
| "straight line graphs" | linear equations | >10 | straight line → linear |
| "rearrange formulas" | changing the subject | >10 | rearrange → change the subject |
| "sohcahtoa" | trigonometry | >10 | SOHCAHTOA → trigonometry |
| "rules for powers" | laws of indices | >10 | rules → laws |

#### TDD Approach (Reference)

**Test Type**: This is a **smoke test** (out-of-process, validates running ES system with real synonyms).

**Step 1: RED** — Write failing smoke test FIRST

```typescript
// smoke-tests/synonym-coverage.smoke.test.ts
describe('B.3: Comprehensive Synonym Coverage', () => {
  it('finds linear equations for "solving for x"', async () => {
    const results = await searchLessons('solving for x');
    const slugs = results.map(r => r.lesson_slug);
    
    // This MUST fail before synonyms are added
    expect(slugs.slice(0, 3)).toContain('solving-linear-equations');
  });
  
  it('finds changing the subject for "rearrange formulas"', async () => {
    const results = await searchLessons('rearrange formulas');
    const slugs = results.map(r => r.lesson_slug);
    
    expect(slugs.slice(0, 3)).toContain('changing-the-subject');
  });
});
```

Run test → **MUST FAIL** (synonyms don't exist yet).

**Step 2: GREEN** — Add synonyms to SDK source of truth

Synonyms are managed via [ADR-063](../../../docs/architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md):

```text
packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/
├── maths-synonyms.ts    # ← Add new synonyms here
└── index.ts
```

Then run:

```bash
pnpm type-gen   # Regenerates synonym artefacts
pnpm build      # Rebuilds all packages
```

**Step 3: Re-index and Verify**

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm es:setup   # Updates index with new synonyms
pnpm es:ingest-live -- --subject maths --keystage ks4
pnpm vitest run -c vitest.smoke.config.ts synonym-coverage
```

Run test → **MUST PASS**.

**Step 4: REFACTOR** — Measure MRR improvement

```bash
pnpm vitest run -c vitest.smoke.config.ts hard-query-baseline
```

Compare to B.1 baseline. Document in experiment file.

**Success Criteria**: Hard query MRR ≥0.45

### B.4 Noise Phrase Filtering [📋 START HERE — NEXT PRIORITY]

**Status**: Ready to start. All blockers resolved, complete index ready.

**Baseline**: Lesson Hard MRR 0.316 (measured 2025-12-22 20:29 UTC with complete data)

**Hypothesis**: Pre-processing to remove colloquial filler will improve those queries.

| Query | Noise | Signal |
|-------|-------|--------|
| "that sohcahtoa stuff for triangles" | "that...stuff for" | "sohcahtoa triangles" |
| "the bit where you complete the square" | "the bit where you" | "complete the square" |

**TDD Entry Point**: Write unit test for `removeNoisePhrase(query: string): string` FIRST.

### B.5 Phrase Query Enhancement [📋 Planned]

**Hypothesis**: Detecting multi-word curriculum terms and boosting phrase matches will improve precision.

**TDD Entry Point**: Write unit test for `detectCurriculumPhrases(query: string): string[]` FIRST.

### B.6 Tier 1 Validation [📋 Planned]

**Exit Criteria**: Hard query MRR ≥0.45 AND no regression on standard queries.

---

## Stream C: Tier 2 — Document Relationships [📋 After Tier 1]

**Purpose**: Exploit the rich relationships we already have indexed.

**Entry Criteria**: Stream B complete (Tier 1 exit criteria met).

### C.1 Unit→Lesson Cross-Reference

**Hypothesis**: Boosting lessons that belong to top-matching units improves lesson ranking.

**Current State**:

- Lessons have `unit_ids[]` field
- Units have `lesson_ids[]` field
- We search these indices SEPARATELY

**TDD Entry Point**: Write unit test for `getLessonIdsFromUnits(units: Unit[]): string[]` FIRST.

### C.2 Thread-Based Relevance

**Hypothesis**: Using thread context can disambiguate similar topics across years.

### C.3 More Like This

**Hypothesis**: MLT can surface related lessons for exploration.

### C.4 Tier 2 Validation

**Exit Criteria**: Hard query MRR ≥0.55 AND cross-reference demonstrably improves ranking.

---

## Stream D: Tier 3 — Modern ES Features [📋 After Tier 2]

**Purpose**: Fine-tune retrieval algorithms after fundamentals are solid.

**Entry Criteria**: Stream C complete (Tier 2 exit criteria met).

| Task | Description |
|------|-------------|
| D.1 | RRF parameter optimisation (rank_constant, window_size) |
| D.2 | Linear Retriever (ELSER weighted higher) |
| D.3 | Field boosting refinement (pedagogical fields) |
| D.4 | Tier 3 validation (MRR ≥0.60) |

---

## Stream E: AI Enhancement [⏸️ DEFERRED]

**Purpose**: Apply AI techniques only when fundamentals can't improve further.

**Entry Criteria**: Tiers 1-3 complete AND MRR plateau demonstrated (≤5% improvement in last 3 experiments).

| Task | Description | Status |
|------|-------------|--------|
| B.2 | Semantic reranking (moved to Stream B) | ❌ Rejected |
| E.1 | LLM query expansion | ⏸️ Deferred |
| E.2 | LLM reranking (domain-aware) | ⏸️ Deferred |

---

## Stream F: Infrastructure [📋 Ready to Start]

**Purpose**: Extract Search SDK for MCP consumption and retire the Next.js app layer.

| ID | Task | Status | Notes |
|----|------|--------|-------|
| F.1 | Extract Search SDK | 📋 | `packages/libs/<search-sdk>/` |
| F.2 | Create CLI workspace | 📋 | First-class CLI, not ad-hoc scripts |
| F.3 | Retire Next.js app | 📋 | Remove from build graph |
| F.4 | Documentation | 📋 | Preserve patterns as docs/examples |

**Dependencies**: None — can start immediately.

---

## Test Types for Search Work

From [testing-strategy.md](../../directives-and-memory/testing-strategy.md):

| Test Type | What It Tests | Used For |
|-----------|---------------|----------|
| **Unit** (`*.unit.test.ts`) | Pure functions, no mocks, no IO | Query builders, helper functions |
| **Integration** (`*.integration.test.ts`) | Units working together with simple injected mocks | SDK wiring, pipeline assembly |
| **Smoke** (`smoke-tests/*.smoke.test.ts`) | Running ES system with real data | **All MRR experiments** |

**Critical**: Smoke tests are out-of-process tests against a running Elasticsearch instance. They are NOT mocked.

---

## Experiment Decision Criteria

From [ADR-081](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md):

| Change Type | Accept If | Reject If |
|-------------|-----------|-----------|
| Synonym addition | Any MRR improvement without regression | Standard MRR regresses |
| Noise filtering | Colloquial MRR improves | Any other category regresses |
| Cross-reference | Hard MRR ≥+10% | p95 latency >1500ms |
| RRF tuning | Any MRR improvement | Regression anywhere |
| AI enhancement | Hard MRR ≥+15% | p95 latency >2000ms |

### After Each Experiment: Codify Learnings

Extract lasting value by updating documentation:

| If the experiment... | Then update... |
|---------------------|----------------|
| Led to an architectural decision | Create or update an **ADR** |
| Revealed operational best practices | Update **INGESTION-GUIDE.md**, **SYNONYMS.md**, etc. |
| Changed the recommended process | Update **NEW-SUBJECT-GUIDE.md** |

**Key principle**:
- **What we DO** → Goes in operational guides
- **What we DON'T DO** → Stays in experiment log
- **Why we decided** → Full reasoning in experiment file

---

## Quality Gates (MANDATORY)

Run from repo root after ANY changes:

```bash
pnpm type-gen          # Makes changes — REQUIRED for synonym changes
pnpm build             # Makes changes
pnpm type-check
pnpm lint:fix          # Makes changes
pnpm format:root       # Makes changes
pnpm markdownlint:root # Makes changes
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

**All gates must pass. No exceptions. Fail fast.**

---

## Elasticsearch Documentation

| Topic | URL |
|-------|-----|
| Search Relevance | <https://www.elastic.co/docs/solutions/search/full-text/search-relevance> |
| Synonyms | <https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-synonym-tokenfilter.html> |
| Terms Lookup | <https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-terms-query.html#query-dsl-terms-lookup> |
| More Like This | <https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-mlt-query.html> |
| Hybrid Search (RRF) | <https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html> |
| Linear Retriever | <https://www.elastic.co/search-labs/blog/linear-retriever-hybrid-search> |
| ELSER | <https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search-elser.html> |

---

## Synonym Rollout Strategy

### B.3 Validated the Approach — Roll Out to All Subjects

The Maths KS4 synonym work (B.3) demonstrated that:

1. **Synonyms fix vocabulary gaps** — 8 of 8 fixable vocabulary gaps addressed
2. **Measurable MRR improvement** — +3.5% lesson MRR, +4.1% unit MRR
3. **No regressions** — Standard queries unaffected
4. **Qualitative wins** — "sohcahtoa" now returns trigonometry, not histograms

**Decision**: Roll out synonyms to all subjects following the same methodology.

### Methodology for Adding New Subjects

Each subject follows this pattern (demonstrated with Maths KS4):

#### 1. Identify Vocabulary Gaps

- Run hard query baseline for the subject
- Analyse failures by category (synonym, colloquial, multi-concept, etc.)
- Identify colloquial teacher language vs curriculum terminology

#### 2. Mine Vocabulary from Bulk Download

```bash
# Extract vocabulary from bulk download
jq '[.[] | .lessonTitle, .unitTitle, (.lessonKeywords // [])[] | .keyword] | unique' \
  {subject}-{keystage}.json > vocabulary.txt
```

#### 3. Create Subject Synonym File (TDD)

```bash
# Location: packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/{subject}.ts
```

- Write failing smoke test for vocabulary gaps FIRST
- Add synonyms to SDK
- Run `pnpm type-gen && pnpm es:setup`
- Verify tests pass

#### 4. Document and Validate

- Record MRR before/after
- Document in experiment file
- Confirm no regression on other subjects

### Subject Rollout Priority

| Subject | Priority | Rationale |
|---------|----------|-----------|
| Maths | ✅ Complete (KS4) | Highest complexity, validated approach |
| Science | High | Rich vocabulary (biology, chemistry, physics terms) |
| English | Medium | Literature terminology, grammar terms |
| History | Medium | Historical periods, events, figures |
| Geography | Medium | Physical/human geography terminology |
| Others | Low | Apply pattern as needed |

### Pending ADR Update

**TODO**: Extend [ADR-063](../../../docs/architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md) with a "Synonym Mining Process" section documenting:

- Ground truth failure analysis methodology
- Bulk download vocabulary extraction process
- TDD workflow for adding synonyms
- Subject-by-subject rollout guidance

---

## Naming Conventions

### Stream/Task Identifiers

Tasks within streams use letter-number codes for tracking:

- **B.x** — Baseline tasks
- **E.x** — AI/ML experiment tasks
- **F.x** — Fundamentals/feature tasks

### Experiment Files

Experiment files in `.agent/evaluations/experiments/` use **descriptive names only** (no prefixes):

- `comprehensive-synonym-coverage.experiment.md` (not ~~B-003-comprehensive-synonym-coverage~~)
- `semantic-reranking.experiment.md` (not ~~E-001-semantic-reranking~~)

The stream/task codes (B.1, B.2, B.3, etc.) are used in plans and trackers to reference these experiments.

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [ADR-082](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | **Governing strategy** — Fundamentals-first |
| [ADR-081](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md) | Metrics and decision criteria |
| [ADR-063](../../../docs/architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md) | **Synonym management via SDK** — To be extended with mining process |
| [EXPERIMENT-PRIORITIES.md](../../evaluations/experiments/EXPERIMENT-PRIORITIES.md) | Detailed experiment tracker |
| [hard-query-baseline](../../evaluations/baselines/hard-query-baseline.md) | Baseline data |
| [semantic-reranking](../../evaluations/experiments/semantic-reranking.experiment.md) | Rejected reranking experiment |
| [comprehensive-synonym-coverage](../../evaluations/experiments/comprehensive-synonym-coverage.experiment.md) | B.3 — Maths KS4 synonyms |

---

## Change Log

| Date | Change |
|------|--------|
| 2025-12-22 | Test isolation architecture fix complete — all quality gates pass |
| 2025-12-22 | MediaQueryProvider DI refactoring complete |
| 2025-12-22 | Updated blocking issues — search paused for ingestion data quality fixes |
| 2025-12-20 | Lesson ingestion gap resolved (314 → 436 lessons via ADR-083) |
| 2025-12-20 | Discovered unit `lesson_count` discrepancy (25/36 wrong) |
| 2025-12-19 | Initial document created from plan restructure |
| 2025-12-19 | B.1 complete — baseline documented, smoke test added |
| 2025-12-19 | B.2 rejected (-16.8% regression) — strategy pivot |
| 2025-12-19 | ADR-082 created — fundamentals-first strategy adopted |
| 2025-12-19 | Streams restructured to reflect tier-based approach |
| 2025-12-19 | Added TDD entry points for B.3, B.4, B.5 |
| 2025-12-19 | Added test type clarification for search experiments |
| 2025-12-19 | B.3 complete — 40+ Maths KS4 synonyms added, smoke test passing |
| 2025-12-19 | Updated experiment/baseline file references (prefix-free naming) |
| 2025-12-19 | Added synonym rollout strategy and methodology for new subjects |
| 2025-12-19 | Added naming conventions section (stream codes vs experiment files) |
| 2025-12-19 | Noted pending ADR-063 update for synonym mining process |
