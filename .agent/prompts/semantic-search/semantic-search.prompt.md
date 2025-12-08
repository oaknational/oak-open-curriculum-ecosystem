# Semantic Search - Fresh Chat Entry Point

**Git Version**: See `git log` for commit history  
**Purpose**: Quick start for continuing Maths KS4 semantic search implementation  
**Status**: Phase 1A Complete ✅ | Ready for Phase 1B/1C

---

## Quick Start

**Current Phase**: Phase 1A infrastructure complete. Ready for Phase 1B (ReRank, filtered kNN) or Phase 1C (Maths KS4 ingestion with two-way hybrid first, then three-way comparison).

**Next Actions**:

- Phase 1B: Elastic Native ReRank, filtered kNN (2-3 days)
- Phase 1C-A: Maths KS4 ingestion with two-way hybrid, establish baseline metrics (1 day)
- Phase 1C-B: Enable dense vectors, re-ingest with three-way hybrid, compare metrics (1 day)

---

## Critical Reading Order

**MUST READ BEFORE ANY WORK**:

1. **`.agent/directives-and-memory/rules.md`** (5 min)
   - TDD mandatory (RED → GREEN → REFACTOR)
   - No type shortcuts (`as`, `any`, `!`, `Record<string, unknown>`)
   - Quality gates must ALL pass
   - Functions ≤8 complexity, files ≤250 lines

2. **`.agent/directives-and-memory/schema-first-execution.md`** (3 min)
   - ALL types flow from field definitions via `pnpm type-gen`
   - Never edit generated files
   - Update generators only

3. **`.agent/directives-and-memory/testing-strategy.md`** (5 min)
   - Unit tests: Pure functions, NO IO, NO mocks
   - Integration tests: IMPORTED code, SIMPLE mocks injected as arguments
   - E2E tests: Running system in separate process

4. **`.agent/plans/semantic-search/maths-ks4-implementation-plan.md`** (30 min) ⭐ **MAIN PLAN**
   - Complete roadmap for all 5 phases
   - Field definitions, extraction functions, ES queries
   - TDD approach, ADRs, success criteria

**Foundation Document Checkpoint**: After every 2-3 features or when stuck, re-read rules.md, schema-first-execution.md, and testing-strategy.md.

---

## Current State Summary

### Phase 1A Complete ✅ (2025-12-08)

**Built**:

- ✅ E5 dense vector generation (`.multilingual-e5-small-elasticsearch`, 384-dim)
- ✅ Dense vector fields in lessons and unit_rollup indexes
- ✅ Tier, exam_board, pathway field extraction for Maths KS4
- ✅ Three-way RRF query (BM25 + ELSER + dense vectors)
- ✅ Extraction functions with unit tests
- ✅ Document transforms with integration tests
- ✅ ADRs 071-074 written

**Remaining**:

- [ ] E2E test comparing two-way vs three-way (requires Phase 1C ingestion)
- [ ] 3 docs with examples

### ES Serverless Status

**Deployment**: Elasticsearch Serverless operational  
**Indexes**: 6 indexes with English KS2 test data  
**Inference Endpoints Available**:

| Endpoint                               | Type                     | Status        | Use Case                    |
| -------------------------------------- | ------------------------ | ------------- | --------------------------- |
| `.elser-2-elasticsearch`               | sparse_embedding         | PRECONFIGURED | ELSER semantic (active)     |
| `.multilingual-e5-small-elasticsearch` | text_embedding (384-dim) | PRECONFIGURED | Dense vectors (active)      |
| `.rerank-v1-elasticsearch`             | rerank                   | TECH PREVIEW  | Result reranking (Phase 1B) |
| `.gp-llm-v2-chat_completion`           | chat_completion          | PRECONFIGURED | RAG chat (Phase 3)          |

**Quality Gates**: All 10 gates passing (1,310+ tests)

---

## Next Steps

### Phase 1B: Relevance Enhancement (2-3 days)

1. Verify `.rerank-v1-elasticsearch` endpoint available
2. Implement Elastic Native ReRank function (TDD)
3. Implement filtered kNN optimization (TDD)
4. Write ADR-075
5. Create 2 docs

### Phase 1C: Maths KS4 Ingestion & Validation (2 days)

**Phase 1C-A** (1 day):

1. Run `pnpm es:ingest-live --subject maths --keystage ks4` with two-way hybrid (BM25 + ELSER only)
2. Establish baseline MRR/NDCG metrics
3. Document two-way search quality

**Phase 1C-B** (1 day):

1. Enable dense vector generation during ingestion
2. Re-ingest Maths KS4 with three-way hybrid (BM25 + ELSER + dense vectors)
3. Compare metrics and document findings in ADR
4. Decision: Keep three-way if measurable improvement, or document why two-way sufficient

**Rationale**: Validates that added complexity of dense vectors delivers measurable value.

---

## Key File Locations

### SDK (Type Generation)

```
packages/sdks/oak-curriculum-sdk/
├── type-gen/typegen/search/
│   ├── field-definitions/
│   │   └── curriculum.ts          ← ADD NEW FIELDS HERE
│   ├── es-field-overrides/        ← ES overrides (split structure)
│   │   ├── index.ts
│   │   ├── common.ts
│   │   ├── lessons-overrides.ts
│   │   ├── units-overrides.ts
│   │   ├── unit-rollup-overrides.ts
│   │   └── ... (other overrides)
│   ├── es-mapping-from-fields.ts  ← Mapping generator
│   └── zod-schema-generator.ts    ← Zod generator
└── src/types/generated/search/    ← GENERATED (don't edit)
```

### App (Indexing & Search)

```
apps/oak-open-curriculum-semantic-search/
├── src/lib/
│   ├── indexing/
│   │   ├── document-transform-helpers.ts
│   │   ├── document-transforms.ts
│   │   └── dense-vector-generation.ts
│   ├── hybrid-search/
│   │   ├── rrf-query-builders.ts
│   │   └── rrf-query-builders-three-way.ts
│   └── elasticsearch/
│       ├── client.ts
│       └── setup/
│           ├── cli.ts
│           ├── cli-commands.ts  ← NEW (after refactor)
│           └── cli-output.ts    ← NEW (after refactor)
└── e2e-tests/                   ← E2E tests
```

---

## Quality Gates

Run after EVERY piece of work, one at a time, with no filters:

```bash
pnpm type-gen          # Makes changes
pnpm build             # Makes changes
pnpm type-check        # Zero type errors
pnpm lint:fix          # Makes changes
pnpm format:root       # Makes changes
pnpm markdownlint:root # Makes changes
pnpm test              # 1,310+ tests must pass
pnpm test:e2e          # E2E in dev mode
pnpm test:e2e:built    # E2E with built code
pnpm test:ui           # Playwright UI tests
pnpm smoke:dev:stub    # Smoke tests
```

**NO EXCEPTIONS**. If any gate fails, STOP and fix before proceeding.

---

## Troubleshooting Quick Reference

| Problem                               | Solution                                                 |
| ------------------------------------- | -------------------------------------------------------- |
| `strict_dynamic_mapping_exception`    | Add field to `field-definitions.ts`, run `pnpm type-gen` |
| Generator/generated drift             | Update generators, never edit generated files            |
| Lint errors after `type-gen`          | Fix generator templates                                  |
| Tests failing                         | Run quality gates one at a time to isolate               |
| Port conflict in smoke tests          | Kill process using port 3333                             |
| ES Serverless `_cluster/health` fails | Use `/` or `/_cat/indices?v` instead                     |

---

## Documentation Links

### Primary Documents

| Document                               | Purpose                                     |
| -------------------------------------- | ------------------------------------------- |
| **`maths-ks4-implementation-plan.md`** | Complete implementation roadmap (MAIN PLAN) |
| **`README.md`**                        | Navigation hub for all planning docs        |
| **`data-completeness-policy.md`**      | What data we upload in full                 |
| **`es-serverless-feature-matrix.md`**  | Feature tracking matrix                     |
| **`archive/phase-1a-complete.md`**     | Phase 1A TDD examples and guidance          |

### Foundation Documents (Re-read Regularly)

| Document                        | Purpose                               |
| ------------------------------- | ------------------------------------- |
| **`rules.md`**                  | TDD, quality gates, no type shortcuts |
| **`schema-first-execution.md`** | All types from field definitions      |
| **`testing-strategy.md`**       | Test types and TDD approach           |

### ADRs Written

| ADR     | Title                                | Status      |
| ------- | ------------------------------------ | ----------- |
| **071** | Elastic-Native Dense Vector Strategy | ✅ Complete |
| **072** | Three-Way Hybrid Search Architecture | ✅ Complete |
| **073** | Dense Vector Field Configuration     | ✅ Complete |
| **074** | Elastic-Native First Philosophy      | ✅ Complete |

---

## Environment Setup

**Required Variables** in `apps/oak-open-curriculum-semantic-search/.env.local`:

```bash
ELASTICSEARCH_URL=https://your-elasticsearch-url-here
ELASTICSEARCH_API_KEY=your_elasticsearch_api_key_here
OAK_API_KEY=your_oak_api_key_here
SEARCH_API_KEY=your_search_api_key_here
LOG_LEVEL=info
```

**Verify Setup**:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm es:status  # Check ES connection and indexes
```

---

## Success Criteria

### Phase 1A Complete When:

- [x] Dense vector fields added
- [x] ES field overrides configured
- [x] Extraction functions with tests
- [x] Document transforms updated
- [x] Three-way RRF query implemented
- [x] ADRs 071-074 written
- [x] All quality gates passing
- [ ] E2E test comparing two-way vs three-way (Phase 1C)
- [ ] 3 docs with examples

### Full Project Complete When:

- [ ] All 5 phases completed
- [ ] 15 ADRs written (071-085)
- [ ] 135+ new tests passing
- [ ] MRR: 0.65 → 0.80 (+23%)
- [ ] NDCG@10: 0.70 → 0.85 (+21%)
- [ ] Zero-hit rate: <5%
- [ ] p95 latency: <300ms
- [ ] Impressive stakeholder demo ready

---

## What To Do If Stuck

1. **Re-read foundation documents** - rules.md, schema-first, testing-strategy
2. **Check main plan** - maths-ks4-implementation-plan.md for detailed guidance
3. **Review existing patterns** - Look at similar implementations in codebase
4. **Run quality gates** - Isolate which gate is failing
5. **Check ADRs** - Previous decisions documented

---

**Remember**: TDD is mandatory (RED → GREEN → REFACTOR). All quality gates must pass. No type shortcuts. Schema-first approach for all types. Re-read foundation documents regularly.

**Now go build something deeply impressive.** 🚀

---

**End of Entry Point**
