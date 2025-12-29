# Semantic Search Roadmap

**Status**: Active  
**Last Updated**: 2025-12-28  
**Metrics Source**: [current-state.md](current-state.md)

This is THE authoritative roadmap for semantic search work. All other plan documents reference this file.

---

## ⚠️ Measurement Discipline

**Every search change must be measured.**

Before implementing any milestone that affects search (synonyms, indices, retrievers, ES features):

1. **Baseline**: Record current metrics using ground truth queries
2. **Hypothesis**: Document expected impact in experiment file
3. **Implement**: Make the change
4. **Measure**: Run evaluation against same ground truth
5. **Record**: Update [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md) with results
6. **Decide**: Accept/reject based on evidence

**Framework**: [ADR-081: Search Approach Evaluation Framework](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md)  
**Ground Truths**: [.agent/evaluations/](../../evaluations/README.md)

---

## Current State (Snapshot)

| Metric | Value | Status |
|--------|-------|--------|
| Tier 1 | EXHAUSTED | ✅ All standard approaches verified (2025-12-24) |
| Lesson Hard MRR | 0.614 | ✅ Target (≥0.45) exceeded by 36% |
| Lesson Std MRR | 0.944 | ✅ Target (≥0.92) met |
| Unit Hard MRR | 0.856 | ✅ Target (≥0.50) exceeded |
| Unit Std MRR | 0.988 | ✅ Target (≥0.92) exceeded |
| Index Coverage | Maths KS4 only | 🔄 ~27% of curriculum (436/12,783 lessons) |

**Exception**: Intent-based category MRR (0.229) — requires Tier 4, not Tier 1.

---

## Blocking Work (Do These First)

### 🚫 Milestone 1: Complete ES Ingestion

**Status**: 🔄 BLOCKING — ~27% complete  
**Dependencies**: None  
**Specification**: [active/complete-data-indexing.md](active/complete-data-indexing.md)

All evaluation, ground truth expansion, and synonym validation is blocked until we have FULL curriculum data in Elasticsearch.

| Category | Status | Notes |
|----------|--------|-------|
| ✅ Complete | art, computing, design-technology, citizenship, cooking-nutrition | 5 subjects |
| ⚠️ Incomplete | english | Missing ~1,030 lessons |
| ❌ Lost on Reset | maths, history, geography | Need re-ingestion |
| ❌ Not Started | science, french, spanish, german, PE, RE, music, rshe-pshe | 8 subjects |

**Commands**:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm es:ingest-live -- --subject <subject> --keystage <keystage>
pnpm es:ingest-live -- --all  # Ingest all subjects
```

**Acceptance Criteria**:
- [ ] All 17 subjects ingested
- [ ] Counts verified against bulk download reference (~12,783 lessons)
- [ ] Ground truths expanded to cover all subjects (not just Maths KS4)
- [ ] Baseline metrics recorded for full-curriculum search

**Evaluation**: After ingestion, run `pnpm eval:per-category` to establish full-curriculum baseline. Record in [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md).

---

## Linear Path to Success

### Evaluation Requirements for Each Milestone

Each milestone that affects search quality **must** include:

1. **Ground truth coverage**: Queries that test the feature
2. **Before metrics**: Baseline measurement before implementation
3. **After metrics**: Measurement after implementation
4. **Decision**: Accept if improvement, reject if regression
5. **Recording**: Results in [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md)

### Milestone 2: Pattern-Aware Ingestion

**Status**: 📋 Pending  
**Dependencies**: Milestone 1  
**Specification**: [active/pattern-aware-ingestion.md](active/pattern-aware-ingestion.md)

Required for Science KS4 (triple science) and other subjects with complex sequence structures.

**User Impact**: Scientists sequences correctly indexed with exam board/tier variants.

---

### Milestone 3: Synonym Quality Audit

**Status**: 📋 Pending (blocked on Milestone 1)  
**Dependencies**: Milestone 1 (needs all subjects indexed)  
**Specification**: [active/synonym-quality-audit.md](active/synonym-quality-audit.md)

**Also See**: [active/es-native-enhancements.md](active/es-native-enhancements.md) — Phase 3e work on BM25 optimisation (Phase A complete, +29% MRR)

**User Impact**: Search works correctly for foundational vocabulary (adjective, noun, suffix, etc.).

| Current Coverage | Issue |
|------------------|-------|
| 163 curated synonyms | Target GCSE-level compound terms |
| Top 100 curriculum terms | **0% synonym coverage** |

**Evaluation Requirements**:
- [ ] Create ground truth queries for top 20 foundational vocabulary terms
- [ ] Baseline MRR for vocabulary queries (before adding synonyms)
- [ ] After MRR for vocabulary queries (after adding synonyms)
- [ ] Per-synonym ablation: measure impact of each new synonym set
- [ ] Record all results in EXPERIMENT-LOG.md

---

### Milestone 4: Transcript Mining

**Status**: 📋 Pending  
**Dependencies**: Milestones 1, 3  
**Specification**: [planned/transcript-mining.md](planned/transcript-mining.md)

**User Impact**: +15-25 foundational synonyms in teacher language; +5-10% colloquial query MRR.

**Evaluation Requirements**:
- [ ] Baseline colloquial category MRR (before transcript synonyms)
- [ ] After colloquial category MRR (after transcript synonyms)
- [ ] Target: ≥5% improvement in colloquial category
- [ ] Record results in EXPERIMENT-LOG.md

---

### Milestone 5: Thread-Based Search

**Status**: 📋 Pending  
**Dependencies**: Milestones 1, 2  
**Specification**: [planned/thread-based-search.md](planned/thread-based-search.md)

**User Impact**: "What comes before X?", "What should I teach next?" queries work.

Threads are the pedagogical backbone of Oak's curriculum — they show how ideas BUILD over time.

| Data Point | Count |
|------------|-------|
| Threads | 164 across 14 subjects |
| Thread → Unit mappings | ~1,600 units |

---

### Milestone 6: Reference Indices

**Status**: 📋 Pending  
**Dependencies**: Milestone 1  
**Specification**: [planned/reference-indices.md](planned/reference-indices.md)

**User Impact**: "What subjects are available?", "What key stages for maths?" queries work.

---

### Milestone 7: Resource Types

**Status**: 📋 Pending  
**Dependencies**: Milestone 1  
**Specification**: [planned/resource-types.md](planned/resource-types.md)

**User Impact**: Search for worksheets, quizzes, and other resource types.

---

### Milestone 8: Vocabulary Mining (Bulk)

**Status**: 📋 Pending  
**Dependencies**: Milestones 1, 3, 4  
**Specification**: [planned/vocabulary-mining-bulk.md](planned/vocabulary-mining-bulk.md)

**User Impact**: Searchable glossary with 13K+ terms; enhanced synonym coverage.

Pipeline complete (thread/prerequisite generators done); bulk mining pending.

---

### Milestone 9: MCP Graph Tools

**Status**: 📋 Pending  
**Dependencies**: Milestone 8  
**Specification**: [planned/mcp-graph-tools.md](planned/mcp-graph-tools.md)

**User Impact**: AI agents can answer "What's the learning path to trigonometry?"

---

### Milestone 10: Knowledge Graph Evolution

**Status**: 📋 Pending  
**Dependencies**: Milestones 8, 9  
**Specification**: [planned/knowledge-graph-evolution.md](planned/knowledge-graph-evolution.md)

**User Impact**: True knowledge graph queries connecting concepts across curriculum.

---

### Milestone 11: Search SDK + CLI Extraction

**Status**: 📋 Pending  
**Dependencies**: All above  
**Specification**: [planned/search-sdk-cli.md](planned/search-sdk-cli.md)

**User Impact**: Search functionality available as SDK for MCP and other consumers.

---

## Future (Post-SDK)

These are post-SDK work items that depend on upstream API changes or advanced features.

| Item | Specification | Blocker |
|------|---------------|---------|
| Entity Extraction | [planned/future/entity-extraction.md](planned/future/entity-extraction.md) | SDK complete |
| Advanced Features (RAG, LTR, Knowledge Graph) | [planned/future/advanced-features.md](planned/future/advanced-features.md) | SDK complete |

---

## Tier Progression

Per [ADR-082: Fundamentals-First Strategy](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md):

| Tier | Name | Status | Exit Criteria |
|------|------|--------|---------------|
| **1** | Search Fundamentals | ✅ EXHAUSTED (2025-12-24) | MRR ≥0.45, all approaches verified |
| **2** | Document Relationships | 🔓 Ready | MRR ≥0.55 |
| **3** | Modern ES Features | 📋 Blocked | MRR ≥0.60 |
| **4** | AI Enhancement | ⏸️ Deferred | Only after Tiers 1-3 exhausted |

---

## Quality Gates

Run after every piece of work, from repo root:

```bash
pnpm type-gen          # Generate types from schema
pnpm build             # Build all packages
pnpm type-check        # TypeScript validation
pnpm lint:fix          # Auto-fix linting issues
pnpm format:root       # Format code
pnpm markdownlint:root # Markdown lint
pnpm test              # Unit + integration tests
pnpm test:e2e          # E2E tests
pnpm test:e2e:built    # E2E on built app
pnpm test:ui           # Playwright UI tests
pnpm smoke:dev:stub    # Smoke tests
```

**All gates must pass. No exceptions.**

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [current-state.md](current-state.md) | Authoritative metrics source |
| [search-acceptance-criteria.md](search-acceptance-criteria.md) | Definition of done |
| [ADR-082](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | Fundamentals-first strategy |
| [ADR-085](../../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md) | Ground truth validation |

---

## Foundation Documents (MANDATORY)

Before any work, re-read:

1. [rules.md](../../directives-and-memory/rules.md) — First Question: "Could it be simpler?"
2. [testing-strategy.md](../../directives-and-memory/testing-strategy.md) — TDD at all levels
3. [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md) — Generator is source of truth

