# Semantic Search Roadmap

**Status**: 🔄 ES reset and cache validation pending
**Last Updated**: 2025-12-29
**Metrics Source**: [current-state.md](current-state.md)

This is THE authoritative roadmap for semantic search work. All other plan documents reference this file.

---

## 🔄 Current Status

### Adapter Refactoring — Complete (2025-12-29)

| Metric             | Before    | After       |
| ------------------ | --------- | ----------- |
| `oak-adapter.ts`   | 593 lines | 197 lines   |
| Lint errors        | 70        | 0           |
| New test coverage  | —         | 22 tests    |

### Efficient API Traversal — Complete (2025-12-29)

Implemented bulk `/key-stages/{ks}/subject/{subject}/assets` endpoint to:
- Check video availability BEFORE fetching transcripts
- Skip transcript fetch for lessons without videos
- Eliminate 404 errors and wasted API calls

| Metric               | Before    | After                 |
| -------------------- | --------- | --------------------- |
| API calls            | 2× lessons| 1 bulk + 1× summaries |
| 404 errors           | Many      | Zero                  |

### Pending Before Ingestion — COMPLETE (2025-12-29)

| Task             | Why Needed                                      | Status    |
| ---------------- | ----------------------------------------------- | --------- |
| Quality gates    | Verify implementation works                     | ✅ Complete |
| ES reset         | Fresh indices for clean ingestion               | ✅ Complete |
| Cache validation | Verify new `CacheOperations` interface works    | ✅ Complete (756 hits, 1 miss) |
| ES upsert verify | Confirm incremental mode still works            | ✅ Complete (638 docs ingested) |

### Next Steps (In Order)

1. ✅ **Run quality gates**: All 11 gates passed
2. ✅ **Reset ES**: `pnpm es:setup --reset` — 7 indices, 192 synonyms
3. ✅ **Verify caching**: Dry-run passed, cache hits working
4. ✅ **Verify writes**: Maths KS1 ingested (437 docs + 201 threads)
5. 📋 **Full ingestion**: `pnpm es:ingest-live --all --verbose`

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

## Current State (Snapshot — 2025-12-29)

| Metric                  | Value            | Status                  |
| ----------------------- | ---------------- | ----------------------- |
| Tier 1                  | EXHAUSTED        | ✅ All approaches verified (2025-12-24) |
| Pattern-aware traversal | COMPLETE         | ✅ All 7 patterns implemented |
| Adapter refactoring     | COMPLETE         | ✅ 593→197 lines, TDD-driven |
| Quality gates           | PASSING          | ✅ All 11 gates green   |
| ES reset                | PENDING          | 📋 Need to run          |
| Cache validation        | PENDING          | 📋 Verify new interface |
| Redis cache             | 12,039 entries   | ⚠️ Verify accessibility |

---

## Blocking Work (Do These First)

### 🔄 Milestone 1: Complete ES Ingestion

**Status**: 📋 PENDING — ES reset and cache validation required
**Dependencies**: Pattern-aware traversal (COMPLETE), adapter refactoring (COMPLETE)
**Specification**: [active/complete-data-indexing.md](active/complete-data-indexing.md)

**Pre-requisites**:

1. ✅ Adapter refactoring complete
2. ✅ Quality gates passing
3. 📋 ES reset
4. 📋 Cache validation

**Commands**:

```bash
cd apps/oak-open-curriculum-semantic-search

# Step 1: Reset ES
pnpm es:setup --reset

# Step 2: Verify caching (dry run)
pnpm es:ingest-live --subject maths --keystage ks1 --verbose --dry-run

# Step 3: Full ingestion
pnpm es:ingest-live --all --verbose
```

**Expected**: ~12,316 unique lessons across all 17 subjects.

**Acceptance Criteria**:

- [ ] ES indices reset with current mappings
- [ ] Cache reads/writes verified with new CacheOperations interface
- [ ] All 17 subjects ingested
- [ ] Counts verified against bulk download reference (~12,316 unique lessons)
- [ ] Science KS4 included (requires sequence traversal — IMPLEMENTED)
- [ ] Ground truths expanded to cover all subjects (not just Maths KS4)
- [ ] Baseline metrics recorded for full-curriculum search
- [ ] Quality gates passing after ingestion

---

## ✅ Completed Work

### Milestone 2: Pattern-Aware Ingestion — COMPLETE

**Status**: ✅ COMPLETE (2025-12-29)
**Specification**: [active/pattern-aware-ingestion.md](active/pattern-aware-ingestion.md)

All 7 curriculum structural patterns now handled:

| Pattern               | Implementation        |
| --------------------- | --------------------- |
| `simple-flat`         | ✅ All KS1-KS3, some KS4 |
| `tier-variants`       | ✅ Maths KS4          |
| `exam-subject-split`  | ✅ Science KS4        |
| `exam-board-variants` | ✅ 12 subjects KS4    |
| `unit-options`        | ✅ 6 subjects KS4     |
| `no-ks4`              | ✅ Cooking-nutrition  |
| `empty`               | ✅ Edge cases         |

### Adapter Refactoring — COMPLETE

**Status**: ✅ COMPLETE (2025-12-29)

| Before                       | After                       |
| ---------------------------- | --------------------------- |
| `oak-adapter.ts` (593 lines) | `oak-adapter.ts` (197 lines)|
| 70 lint errors               | 0 lint errors               |
| Quality gates blocked        | All 11 passing              |

**New files created**:

| File                         | Purpose                                |
| ---------------------------- | -------------------------------------- |
| `sdk-cache/cache-wrapper.ts` | Cache wrappers with dependency injection |
| `sdk-api-methods.ts`         | API method factories                   |
| `sdk-client-factory.ts`      | Client creation helpers                |
| `src/adapters/README.md`     | Architecture documentation             |

---

## Linear Path to Success

### Evaluation Requirements for Each Milestone

Each milestone that affects search quality **must** include:

1. **Ground truth coverage**: Queries that test the feature
2. **Before metrics**: Baseline measurement before implementation
3. **After metrics**: Measurement after implementation
4. **Decision**: Accept if improvement, reject if regression
5. **Recording**: Results in [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md)

### Milestone 3: Synonym Quality Audit

**Status**: 📋 Pending (blocked on Milestone 1)
**Dependencies**: Milestone 1 (needs all subjects indexed)
**Specification**: [active/synonym-quality-audit.md](active/synonym-quality-audit.md)

**User Impact**: Search works correctly for foundational vocabulary (adjective, noun, suffix, etc.).

| Current Coverage      | Issue                          |
| --------------------- | ------------------------------ |
| 163 curated synonyms  | Target GCSE-level compound terms |
| Top 100 curriculum terms | **0% synonym coverage**     |

---

### Milestone 4: Transcript Mining

**Status**: 📋 Pending
**Dependencies**: Milestones 1, 3
**Specification**: [planned/transcript-mining.md](planned/transcript-mining.md)

**User Impact**: +15-25 foundational synonyms in teacher language; +5-10% colloquial query MRR.

---

### Milestone 5: Thread-Based Search

**Status**: 📋 Pending
**Dependencies**: Milestones 1, 2
**Specification**: [planned/thread-based-search.md](planned/thread-based-search.md)

**User Impact**: "What comes before X?", "What should I teach next?" queries work.

| Data Point             | Count                    |
| ---------------------- | ------------------------ |
| Threads                | 164 across 14 subjects   |
| Thread → Unit mappings | ~1,600 units             |

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

| Item               | Specification                                     | Blocker      |
| ------------------ | ------------------------------------------------- | ------------ |
| Entity Extraction  | [planned/future/entity-extraction.md](planned/future/entity-extraction.md) | SDK complete |
| Advanced Features  | [planned/future/advanced-features.md](planned/future/advanced-features.md) | SDK complete |

---

## Tier Progression

Per [ADR-082: Fundamentals-First Strategy](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md):

| Tier   | Name                   | Status              | Exit Criteria                         |
| ------ | ---------------------- | ------------------- | ------------------------------------- |
| **1**  | Search Fundamentals    | ✅ EXHAUSTED (2025-12-24) | MRR ≥0.45, all approaches verified |
| **2**  | Document Relationships | 🔓 Ready            | MRR ≥0.55                             |
| **3**  | Modern ES Features     | 📋 Blocked          | MRR ≥0.60                             |
| **4**  | AI Enhancement         | ⏸️ Deferred         | Only after Tiers 1-3 exhausted        |

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

| Document                  | Purpose                        |
| ------------------------- | ------------------------------ |
| [current-state.md](current-state.md) | Authoritative metrics source |
| [search-acceptance-criteria.md](search-acceptance-criteria.md) | Definition of done |
| [ADR-082](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | Fundamentals-first strategy |
| [ADR-085](../../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md) | Ground truth validation |
| [ADR-087](../../../docs/architecture/architectural-decisions/087-batch-atomic-ingestion.md) | Batch-atomic ingestion |

---

## Foundation Documents (MANDATORY)

Before any work, re-read:

1. [rules.md](../../directives-and-memory/rules.md) — First Question: "Could it be simpler?"
2. [testing-strategy.md](../../directives-and-memory/testing-strategy.md) — TDD at all levels
3. [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md) — Generator is source of truth
