# Semantic Search Planning Documents

**Status**: Phase 1 & 2 Complete | Two-Way Hybrid (BM25 + ELSER) Confirmed Optimal  
**Last Updated**: 2025-12-11

---

## Quick Start

For new implementation sessions, read in this order:

1. **Foundation Documents** (MUST READ FIRST)
   - `.agent/directives-and-memory/rules.md` - TDD, quality gates, no type shortcuts
   - `.agent/directives-and-memory/schema-first-execution.md` - All types from field definitions
   - `.agent/directives-and-memory/testing-strategy.md` - Test types and TDD approach

2. **Requirements & Context** - `requirements.md`
   - Strategic goals and business success criteria
   - Risk mitigation strategies
   - Cost model (spoiler: $0/month for AI/ML features)
   - Demo scenarios for validation
   - Common issues and solutions
   - ADR requirements per phase

3. **Entry Point** - `.agent/prompts/semantic-search/semantic-search.prompt.md`
   - Current state summary
   - Phase status and next steps
   - Quick reference for commands and file locations

---

## Critical Discovery & Resolution (2025-12-10)

**ELSER semantic search was not operational for lessons.** The `lesson_semantic` field was never being populated during indexing.

- **Problem**: ELSER queries on lessons returned **0 hits**; "hybrid" was actually **BM25-only**
- **Fix applied**: Added `lesson_semantic: transcript` to `createLessonDocument()`
- **Verified working**: Re-indexed with 314/314 lessons having `lesson_semantic` populated
- **Result**: Two-way hybrid now measured; NDCG improved by 5.1%

See `.agent/research/elasticsearch/assumptions-validation.md` for full analysis.

---

## Current Status

### Data Completeness ✅ VERIFIED (2025-12-10)

| Index             | Count   | Status |
| ----------------- | ------- | ------ |
| `oak_lessons`     | **314** | ✅     |
| `oak_units`       | 36      | ✅     |
| `oak_unit_rollup` | 244     | ✅     |
| `oak_threads`     | 201     | ✅     |
| `oak_sequences`   | 2       | ✅     |

All 36 Maths KS4 units have their lessons indexed.

### Ground Truth ✅ COMPREHENSIVE (2025-12-10)

Ground truth reviewed and expanded using MCP curriculum tools:

- Comprehensive KS4 Maths coverage (algebra, geometry, number, graphs, statistics)
- Modular structure in `src/lib/search-quality/ground-truth/`
- Edge cases included (misspellings, natural language queries)

### Synonyms ✅ REFACTORED (2025-12-10)

SDK synonyms extracted into modular themed files:

- Location: `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/`
- Added `numbers` group with `squared → quadratic` mapping
- Documentation: `apps/oak-open-curriculum-semantic-search/docs/SYNONYMS.md`

---

## Document Structure

```text
.agent/plans/semantic-search/
├── README.md                      # This file - navigation hub
├── requirements.md                # Strategic context, risks, costs, demos
├── phase-1-foundation.md          # ✅ Complete - lexical baseline + ELSER fix
├── phase-2-dense-vectors.md       # ⏸️ If needed - three-way evaluation
├── phase-3-plus-roadmap.md        # 📋 Future - NER, RAG, knowledge graph
├── reference/                     # Reference documentation
│   ├── reference-data-completeness-policy.md
│   ├── reference-es-serverless-feature-matrix.md
│   └── reference-ir-metrics-guide.md
└── archive/                       # Superseded documents
    ├── maths-ks4-implementation-plan.md  # Original 3000-line plan
    └── search-ui-plan.md                 # UI plan (deferred, see requirements.md)
```

---

## Phase Documents

| Document                     | Status | Purpose                                         |
| ---------------------------- | ------ | ----------------------------------------------- |
| **requirements.md**          | ✅     | Strategic context, risks, costs, demo scenarios |
| **phase-1-foundation.md**    | ✅     | Lexical baseline established, ELSER fix applied |
| **phase-2-dense-vectors.md** | ✅     | E5 & reranking evaluated - no benefit found     |
| **phase-3-plus-roadmap.md**  | 📋     | NER, RAG, knowledge graph, multi-index search   |

### Reference Documents

| Document                                      | Purpose                               |
| --------------------------------------------- | ------------------------------------- |
| **reference-data-completeness-policy.md**     | Policy on what data to upload in full |
| **reference-es-serverless-feature-matrix.md** | Feature adoption tracking             |
| **reference-ir-metrics-guide.md**             | IR metrics (MRR, NDCG) explained      |

### Research Documents

| Document                                                    | Purpose                               |
| ----------------------------------------------------------- | ------------------------------------- |
| **.agent/research/elasticsearch/assumptions-validation.md** | ELSER discovery and fix documentation |

### Archived Documents

| Document                             | Reason for Archive                     |
| ------------------------------------ | -------------------------------------- |
| **maths-ks4-implementation-plan.md** | Superseded - content now in phase docs |
| **search-ui-plan.md**                | Outdated (November 2025)               |

---

## Current Results: Two-Way Hybrid (BM25 + ELSER) - CONFIRMED OPTIMAL

| Metric        | Result    | Target  | Status   |
| ------------- | --------- | ------- | -------- |
| MRR           | **0.900** | > 0.70  | ✅ PASS  |
| NDCG@10       | 0.716     | > 0.75  | ❌ Below |
| Zero-hit rate | **0.0%**  | < 10%   | ✅ PASS  |
| Avg Latency   | **153ms** | < 300ms | ✅ PASS  |

**3 of 4 targets met.** Two-way hybrid confirmed optimal after extensive Phase 2 experimentation.

**Phase 2 Conclusion**: Neither E5 dense vectors nor reranking improved results. See `phase-2-dense-vectors.md` and `.agent/research/elasticsearch/hybrid-search-reranking-evaluation.md` for full analysis.

---

## Search Approach Comparison (Complete)

All approaches empirically evaluated:

| Approach              | Status         | MRR         | NDCG@10     | Latency    | Notes             |
| --------------------- | -------------- | ----------- | ----------- | ---------- | ----------------- |
| 1. Lexical (BM25)     | ✅             | 0.920       | 0.690       | 322ms      | Synonyms + fuzzy  |
| **2. Two-Way Hybrid** | ✅ **OPTIMAL** | **0.900**   | **0.716**   | **153ms**  | Production choice |
| 3. Three-Way Hybrid   | ✅             | 0.892       | 0.715       | 180ms      | No benefit        |
| 4. With Reranking     | ✅             | 0.888-0.893 | 0.681-0.683 | 800-1546ms | Hurts quality     |

**Conclusion**: Two-way hybrid (BM25 + ELSER) is optimal. Dense vectors and reranking evaluated but provide no benefit.

---

## Next Steps: Multi-Index Search Generality

### Current Limitation

All experimentation focused on **lesson search** only. Teachers also need:

1. **Unit search** - Find units by topic
2. **Combined search** - Single query returning both lessons and units
3. **Scoped search** - Find lessons within a specific unit
4. **Result type filtering** - API consumers need to know if result is lesson, unit, or programme

### Phase 3.0 Priorities (See `phase-3-plus-roadmap.md`)

| Task                                 | Priority     | Notes                                                 |
| ------------------------------------ | ------------ | ----------------------------------------------------- |
| **Unit hybrid search**               | **CRITICAL** | Units MUST use BM25 + ELSER like lessons              |
| **Unit reranking experiment**        | **HIGH**     | Test reranking with `rollup_text` (~300 chars/lesson) |
| **Test unit search quality**         | HIGH         | Create ground truth and smoke tests                   |
| Can we distinguish result types?     | Medium       | Add `doc_type` field                                  |
| Can we filter by type?               | Medium       | Unified endpoint with type filter                     |
| Can we search lessons within a unit? | Medium       | Add unit filter to lesson search                      |

**Key insight**: Unit reranking is feasible NOW because `rollup_text` already has appropriate length for cross-encoders. Lesson reranking requires upstream API `rerank_summary` field.

### Re-Running Tests

```bash
# Terminal 1: Start server (clear cache first!)
cd apps/oak-open-curriculum-semantic-search
rm -rf .next && pnpm dev

# Terminal 2: Run smoke tests
pnpm test:smoke
```

### Re-Ingestion (if needed)

**Full ingestion guide**: `apps/oak-open-curriculum-semantic-search/docs/INGESTION-GUIDE.md`

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm es:setup
pnpm es:ingest-live -- --subject maths --keystage ks4
pnpm es:status
```

See `phase-2-dense-vectors.md` for three-way hybrid evaluation if Phase 2 is needed.

---

## Quality Gates

Run after every piece of work, from repo root, in order:

```bash
pnpm i                                            # Install dependencies
pnpm type-gen                                     # Generate types
pnpm build                                        # Build all
pnpm type-check                                   # TypeScript validation
pnpm lint -- --fix                                # Auto-fix linting
pnpm -F @oaknational/oak-curriculum-sdk docs:all  # Generate SDK docs
pnpm format                                       # Format code
pnpm markdownlint                                 # Markdown lint
pnpm test                                         # Unit + integration
pnpm test:e2e                                     # E2E tests
```

All gates must pass. No exceptions.

---

## Key File Locations

### Ground Truth and Metrics

```text
apps/oak-open-curriculum-semantic-search/src/lib/search-quality/
├── ground-truth/           # Modular ground truth (2025-12-10)
│   ├── algebra.ts          # Algebra queries
│   ├── geometry.ts         # Geometry queries
│   ├── number.ts           # Number queries
│   ├── graphs.ts           # Graphs queries
│   ├── statistics.ts       # Statistics queries
│   ├── edge-cases.ts       # Misspellings, natural language
│   ├── types.ts            # GroundTruthQuery interface
│   └── index.ts            # Combined exports
├── ground-truth.ts         # Legacy (imports from ground-truth/)
├── metrics.ts              # MRR, NDCG calculations
└── index.ts                # Public exports
```

### Document Transforms (ELSER Fix)

```text
apps/oak-open-curriculum-semantic-search/src/lib/indexing/
└── document-transforms.ts  # createLessonDocument() - FIXED
```

### Synonyms (SDK)

```text
packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/
├── subjects.ts             # Subject name variations
├── key-stages.ts           # Key stage aliases
├── numbers.ts              # Numbers + maths terms (squared → quadratic)
├── geography.ts            # Geography concepts
├── history.ts              # History periods
├── maths.ts                # Maths operations
├── english.ts              # English concepts
├── science.ts              # Science concepts
├── education.ts            # Generic + educational acronyms
└── index.ts                # Barrel file (exports synonymsData)
```

### Smoke Tests

```text
apps/oak-open-curriculum-semantic-search/smoke-tests/
└── search-quality.smoke.test.ts  # Benchmark test suite
```

### Ingestion Documentation

```text
apps/oak-open-curriculum-semantic-search/docs/
├── INGESTION-GUIDE.md     # Complete re-indexing guide (NEW)
├── INDEXING.md            # Technical indexing playbook
├── SYNONYMS.md            # Synonym system documentation
└── ES_SERVERLESS_SETUP.md # ES Serverless setup guide
```

### RRF Query Builders

```text
apps/oak-open-curriculum-semantic-search/src/lib/hybrid-search/
├── rrf-query-builders.ts           # Two-way (BM25 + ELSER)
├── rrf-query-builders-three-way.ts # Three-way (Phase 2)
└── rrf-query-helpers.ts            # Shared helpers
```

---

## Development Rules (From Foundation Docs)

### TDD is Mandatory

All new code must follow TDD at ALL levels:

1. **RED** - Write test first, run it, prove it fails
2. **GREEN** - Write minimal implementation to pass
3. **REFACTOR** - Improve implementation, tests stay green

### Test Classification

| Type        | File Pattern            | Purpose             | IO Allowed        |
| ----------- | ----------------------- | ------------------- | ----------------- |
| Unit        | `*.unit.test.ts`        | Pure functions      | None              |
| Integration | `*.integration.test.ts` | Code units together | None              |
| Smoke       | `smoke-tests/`          | Running system      | HTTP to localhost |

### No Type Shortcuts

Never use `as`, `any`, `!`, `Record<string, unknown>`. All types flow from `pnpm type-gen`.

### All Quality Gates Must Pass

No exceptions. No `--no-verify`. Fix issues, don't disable checks.

---

## Getting Help

1. **Re-read foundation documents** - rules.md, schema-first, testing-strategy
2. **Check the prompt** - semantic-search.prompt.md has current state
3. **Review phase docs** - phase-1, phase-2, phase-3+
4. **Check research** - assumptions-validation.md for ELSER discovery
5. **Check ADRs** - Previous decisions in `docs/architecture/architectural-decisions/`

---

**Ready to start?** Read `.agent/prompts/semantic-search/semantic-search.prompt.md`
