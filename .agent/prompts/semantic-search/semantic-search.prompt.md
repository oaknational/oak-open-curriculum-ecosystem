# Semantic Search Implementation - Fresh Chat Entry Point

**Git Version**: See `git log` for commit history  
**Purpose**: Complete context for continuing Maths KS4 semantic search implementation in a fresh chat session  
**Status**: Active Implementation - Phase 1A Infrastructure Complete, Implementation Ready

---

## 🚀 Quick Start (60 seconds)

**You are here**: Ready to implement **complete ES Serverless feature integration** for Maths KS4

**Next action**: Phase 1A - Three-way hybrid search with dense vectors (2-3 days)

**Time estimate**: 4-5 weeks total for complete vertical slice with all ES features

---

## 📖 Critical Reading Order (MUST READ BEFORE ANY WORK)

### Foundation Documents (Read FIRST, 15 minutes)

1. **`.agent/directives-and-memory/rules.md`**
   - TDD at all levels (RED → GREEN → REFACTOR)
   - No type shortcuts (`as`, `any`, `!`, `Record<string, unknown>`)
   - Quality gates must ALL pass
   - Functions ≤8 complexity, files ≤250 lines
   - Re-read this REGULARLY during implementation

2. **`.agent/directives-and-memory/schema-first-execution.md`**
   - ALL types flow from field definitions via `pnpm type-gen`
   - Never edit generated files
   - Update generators only
   - This is MANDATORY for SDK and ES mappings

3. **`.agent/directives-and-memory/testing-strategy.md`**
   - Unit tests: Pure functions, NO IO, NO side effects, NO mocks
   - Integration tests: IMPORTED code units, SIMPLE mocks injected as arguments
   - E2E tests: Running system in separate process, CAN trigger FS/STDIO, NOT network

### Main Implementation Plan (Read SECOND, 30 minutes)

4. **`.agent/plans/semantic-search/maths-ks4-implementation-plan.md`** ⭐ MAIN PLAN
   - Complete roadmap for all 5 phases
   - Field definitions, extraction functions, ES queries
   - TDD approach for every feature
   - 15 ADRs to create (071-085)
   - Success criteria and quality gates

**Total reading time**: ~45 minutes. DO NOT SKIP. These documents contain everything needed for success.

**Note**: This prompt contains the practical TDD examples and day-by-day guidance for Phase 1A. See "Phase 1A: Start Here" section below.

---

## 🎯 What Is This Project?

### System Overview

The Oak Open Curriculum Semantic Search is a Next.js application providing **cutting-edge hybrid search** across Oak's curriculum data using Elasticsearch Serverless. We're building a vertical slice demo with Maths KS4 content.

### Current Capabilities ✅

- **Elasticsearch Serverless deployed** with 6 indexes
- **Hybrid search**: ELSER sparse embeddings + BM25 lexical with RRF fusion
- **Three search endpoints**: Structured, natural language, suggestions
- **Faceted navigation**: Filter by subject, key stage, year, category
- **Type-ahead suggestions**: Context-aware completion
- **SDK rate limiting**: 5 req/sec with exponential backoff (ADR-070)
- **Schema-first architecture**: All types from field definitions (ADR-067)
- **Per-index completion contexts**: Type-safe at compile time (ADR-068)
- **Quality gates**: All 10 gates passing (1,310+ tests)

### What We're Adding (Maths KS4 Vertical Slice)

- **Three-way hybrid search**: BM25 + ELSER + E5 dense vectors (Elastic-native, no external API)
- **AI-powered relevance**: Elastic Native ReRank, NER entity extraction (deployed on Elasticsearch)
- **Knowledge graph**: ES Graph API for curriculum relationships
- **RAG infrastructure**: ES Playground, chunked transcripts, Elastic Native LLM, ontology
- **Advanced features**: Learning to Rank foundations, multi-vector search
- **Curriculum metadata leverage**: Index all available API schema fields (Phase 2B)

### Key Insight: Untapped Schema Fields (2025-12-08)

The Oak API provides **rich pedagogical metadata** not currently indexed:

| Field                          | Value                                  | Phase           |
| ------------------------------ | -------------------------------------- | --------------- |
| `lessonKeywords[].description` | Curriculum vocabulary with definitions | 1A (embeddings) |
| `priorKnowledgeRequirements`   | Prerequisite chain for graph           | 2B              |
| `nationalCurriculumContent`    | Standards alignment search             | 2B              |
| `threads`                      | Curriculum coherence graph             | 2B              |
| `pupilLessonOutcome`           | "I can..." outcome search              | 2B              |
| `starterQuiz`, `exitQuiz`      | Assessment content search              | 2B              |

**See**: `.agent/research/elasticsearch/curriculum-schema-field-analysis.md` for complete analysis.

**Why this matters**: Expert-curated curriculum data outperforms AI-generated content. Zero external dependencies, zero additional cost.

### Verified ES Serverless Inference Endpoints (2025-12-07)

| Endpoint                               | Type                     | Status        | Use Case                           |
| -------------------------------------- | ------------------------ | ------------- | ---------------------------------- |
| `.elser-2-elasticsearch`               | sparse_embedding         | PRECONFIGURED | ELSER semantic (in use)            |
| `.multilingual-e5-small-elasticsearch` | text_embedding (384-dim) | PRECONFIGURED | Dense vectors for three-way hybrid |
| `.rerank-v1-elasticsearch`             | rerank                   | TECH PREVIEW  | Result reranking (Phase 1B)        |
| `.gp-llm-v2-chat_completion`           | chat_completion          | PRECONFIGURED | RAG chat (Phase 3)                 |

**Key Decision**: Use Elastic-native E5 model instead of OpenAI for dense vectors. No external API dependencies for core search functionality.

---

## 🔧 Prerequisites & Environment Setup

### Step 0: Verify System Ready (5 minutes)

**Before starting Phase 1A**, verify:

#### 1. Quality Gates Status

```bash
# From repo root - run one at a time, with no filters
pnpm type-gen        # Makes changes
pnpm build           # Makes changes
pnpm type-check
pnpm lint:fix        # Makes changes
pnpm format:root     # Makes changes
pnpm markdownlint:root  # Makes changes
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub

# Expected: ALL PASS (1,310+ tests)
```

If any gate fails, **STOP**. Fix issues before proceeding.

#### 2. Elasticsearch Status

```bash
cd apps/oak-open-curriculum-semantic-search

# Check ES connection and indexes
pnpm es:status

# Expected output:
# ✓ Connected to ES Serverless
# ✓ 6 indexes exist: oak_lessons, oak_units, oak_unit_rollup, oak_sequences, oak_sequence_facets, oak_meta
# ✓ Synonym set 'oak-syns' configured
# ✓ Test data: English KS2 (~350 documents)
```

If ES unreachable or indexes missing, check `.env.local` configuration.

#### 3. Environment Variables

**File**: `apps/oak-open-curriculum-semantic-search/.env.local`

```bash
# Elasticsearch Serverless (REQUIRED)
ELASTICSEARCH_URL=https://your-elasticsearch-url-here
ELASTICSEARCH_API_KEY=your_elasticsearch_api_key_here

# Oak Curriculum API (REQUIRED)
OAK_API_KEY=your_oak_api_key_here

# Search API (REQUIRED)
SEARCH_API_KEY=your_search_api_key_here

# Logging
LOG_LEVEL=info

# Optional: Redis caching for faster dev
SDK_CACHE_ENABLED=false
SDK_CACHE_REDIS_URL=redis://localhost:6379
```

**If any required keys are missing**:

- **Elasticsearch**: Contact Oak infrastructure team or use existing deployment
- **Oak API**: Use existing key from vault

**Note**: All AI/ML features use Elastic-native services. No external API keys required. All inference endpoints (E5 embeddings, ELSER, Elastic ReRank, Elastic LLM) are preconfigured and included in the ES Serverless subscription.

#### 4. Quick Smoke Test

```bash
# Dry-run ingestion (no actual upload)
pnpm es:ingest-live --subject maths --keystage ks1 --dry-run --verbose

# Expected: Fetches API data, transforms documents, shows what would be uploaded, NO ERRORS
```

If this fails, check API keys and network connectivity.

---

## 🎯 Current State & What's Next

### Completed Milestones ✅

#### ES Serverless Deployed (2025-12-04)

- 6 indexes operational: lessons, units, unit_rollup, sequences, sequence_facets, meta
- ELSER sparse embeddings configured
- Synonym set with 68 rules
- Kibana access: <https://poc-open-curriculum-api-search-dd21a1.kb.europe-west1.gcp.elastic.cloud>

#### SDK Rate Limiting (2025-12-07, ADR-070)

- Discovered Oak API limit: **1000 requests/hour**
- Implemented: 5 req/sec throttle, exponential backoff, real-time monitoring
- Singleton client pattern ensures shared rate limiting state
- All 867 SDK tests passing with fake timers

#### Mapping Remediation (2025-12-06, ADR-067)

- **Single source of truth**: Field definitions → Zod schemas + ES mappings
- Impossible for mapping/data mismatch going forward
- All 7 search indexes flow from SDK field definitions
- `pnpm type-gen` generates everything

#### Test Data Ingestion (2025-12-06)

- English KS2: 89 lessons, 129 units, 129 rollups, 1 sequence facet
- Zero mapping errors
- Full transcripts uploaded (no sampling)

### Current Elasticsearch State

**Last verified**: Run `pnpm es:status` for current state

| Index                 | Docs | Purpose                                  |
| --------------------- | ---- | ---------------------------------------- |
| `oak_lessons`         | 89   | Lesson-level search                      |
| `oak_units`           | 129  | Unit-level search                        |
| `oak_unit_rollup`     | 129  | Aggregated unit search                   |
| `oak_sequence_facets` | 1    | Sequence navigation                      |
| `oak_sequences`       | 0    | Sequence metadata (none for English KS2) |
| `oak_meta`            | 1    | Ingestion version tracking               |

**Next**: Ingest Maths KS4 with enhanced schema (Phase 1C)

### What You're About to Build (Phase 1A)

**Duration**: 2-3 days  
**Goal**: Implement three-way hybrid search (BM25 + ELSER + E5 Dense Vectors)

**Deliverables**:

- E5 dense vector generation using `.multilingual-e5-small-elasticsearch` (Elastic-native)
- Dense vector fields (384-dim) in lessons and unit_rollup indexes
- Tier, exam_board, pathway field extraction for Maths KS4
- Three-way RRF query combining all signals
- Extraction functions with unit tests
- Document transforms with integration tests
- E2E test proving three-way beats two-way
- ADR-071: Elastic-Native Dense Vector Strategy
- ADR-072: Three-Way Hybrid Search Architecture
- ADR-073: Dense Vector Field Configuration

**Success criteria**:

- MRR improves from 0.65 → 0.75 (15% gain)
- All quality gates passing
- Zero external API dependencies for core search
- Zero type shortcuts introduced

---

## 📋 Implementation Phases Overview

| Phase  | Duration | Focus                            | Key Features                                               | ADRs |
| ------ | -------- | -------------------------------- | ---------------------------------------------------------- | ---- |
| **1A** | 2-3 days | Three-Way Hybrid + Dense Vectors | E5 dense vectors (Elastic-native), three-way RRF           | 3    |
| **1B** | 2-3 days | Relevance Enhancement            | Elastic Native ReRank, filtered kNN, query rules           | 2    |
| **1C** | 1 day    | Maths KS4 Ingestion              | Full content with enhanced schema                          | -    |
| **2A** | 3-4 days | Entity Extraction & Graph        | NER, Graph API, enrich processor                           | 3    |
| **2B** | 2-3 days | Reference Indices & Threads      | 5 new indices, thread support                              | 1    |
| **3**  | 4-5 days | RAG Infrastructure               | ES Playground, semantic_text, chunking, Elastic Native LLM | 2    |
| **4**  | 5-6 days | Knowledge Graph                  | Triple store, entity resolution                            | 2    |
| **5**  | 3-4 days | Advanced Features                | LTR foundations, multi-vector                              | 2    |

**Total**: 4-5 weeks (22-29 days)

**See**: `maths-ks4-implementation-plan.md` for complete details on each phase

---

## 🚀 Phase 1A: Start Here (Immediate Next Steps)

### Day 1 Morning: Foundation & Tests (RED Phase)

#### 1. Re-read Foundation Documents (15 min)

```bash
# Open in editor
code .agent/directives-and-memory/rules.md
code .agent/directives-and-memory/schema-first-execution.md
code .agent/directives-and-memory/testing-strategy.md
```

Remind yourself of:

- TDD is MANDATORY (RED → GREEN → REFACTOR)
- No type shortcuts EVER
- All quality gates must pass

#### 2. Create Dense Vector Extraction Tests (2 hours)

**File**: `apps/oak-open-curriculum-semantic-search/src/lib/indexing/dense-vector-extraction.unit.test.ts` (NEW)

Write tests FIRST for:

- `generateDenseVector()` - Generate 384-dim vector using E5 endpoint
- Error handling: Inference failure, empty input
- Text preparation for embedding

**Example**:

```typescript
describe('Dense Vector Extraction', () => {
  it('should generate 384-dimensional vector from text', async () => {
    const mockEsClient = createMockEsClient({
      inferenceResponse: {
        text_embedding: {
          embeddings: [Array(384).fill(0.1)],
        },
      },
    });

    const vector = await generateDenseVector(mockEsClient, 'Pythagoras theorem lesson');

    expect(vector).toHaveLength(384);
  });

  it('should return undefined on inference failure', async () => {
    const mockEsClient = createMockEsClient({ throwError: true });

    const vector = await generateDenseVector(mockEsClient, 'test');

    expect(vector).toBeUndefined();
  });
});
```

#### 3. Run Tests (Should FAIL - RED)

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm test dense-vector-extraction.unit.test.ts

# Expected: FAIL - function doesn't exist yet
```

This proves tests are actually testing something.

### Day 1 Afternoon: Implementation (GREEN Phase)

#### 4. Implement Dense Vector Extraction

**File**: `apps/oak-open-curriculum-semantic-search/src/lib/indexing/dense-vector-extraction.ts` (NEW)

Implement to pass tests:

````typescript
/**
 * Generates dense vector embedding using Elastic-native E5 model.
 *
 * Uses the preconfigured `.multilingual-e5-small-elasticsearch` endpoint
 * which produces 384-dimensional dense vectors.
 *
 * @see ADR-071 - Elastic-Native Dense Vector Strategy
 *
 * @example
 * ```typescript
 * const vector = await generateDenseVector(esClient, 'How to teach Pythagoras theorem');
 * // Returns: number[384] or undefined on error
 * ```
 */
export async function generateDenseVector(
  esClient: Client,
  text: string,
): Promise<number[] | undefined> {
  try {
    const response = await esClient.inference.inference({
      inference_id: '.multilingual-e5-small-elasticsearch',
      input: text,
    });
    // Extract and return 384-dim embedding
  } catch {
    // Graceful degradation - return undefined, search still works via BM25 + ELSER
    return undefined;
  }
}
````

#### 5. Run Tests Again (Should PASS - GREEN)

```bash
pnpm test dense-vector-extraction.unit.test.ts

# Expected: PASS - all tests green
```

### Day 2: Field Definitions & Extraction Functions

See the detailed steps in `maths-ks4-implementation-plan.md` Phase 1A section.

**Key steps**:

1. Add field definitions to SDK (`field-definitions/curriculum.ts`)
2. Run `pnpm type-gen` to generate mappings and Zod schemas
3. Write unit tests for extraction functions (RED)
4. Implement extraction functions (GREEN)
5. Write integration tests for document transforms (RED)
6. Update document transforms (GREEN)
7. Run all quality gates

### Day 3: Three-Way RRF Query

1. Write E2E test for three-way hybrid (RED)
2. Implement three-way RRF query (GREEN)
3. Benchmark against two-way hybrid
4. Run all quality gates
5. Write ADRs 071-073
6. Create docs with examples

---

## 🧪 Quality Gates (Run After EVERY Phase)

```bash
# From repo root, one at a time, with no filters
pnpm type-gen          # Makes changes - generates artifacts from field definitions
pnpm build             # Makes changes - compiles TypeScript
pnpm type-check        # Zero type errors
pnpm lint:fix          # Makes changes - zero lint violations
pnpm format:root       # Makes changes - code formatting
pnpm markdownlint:root # Makes changes - doc formatting
pnpm test              # 1,310+ tests must pass
pnpm test:e2e          # E2E tests in dev mode
pnpm test:e2e:built    # E2E tests with built code
pnpm test:ui           # Playwright UI tests
pnpm smoke:dev:stub    # Smoke tests with stub data
```

**NO EXCEPTIONS. If any gate fails, STOP and fix before proceeding.**

---

## 📚 Key Architectural Concepts

### Schema-First Type Generation (ADR-067)

**Cardinal Rule**: ALL types, Zod schemas, and ES mappings flow from field definitions.

**Workflow**:

```text
1. Update field definitions
   packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/field-definitions/curriculum.ts

2. Run type-gen
   pnpm type-gen

3. Generated outputs:
   - ES mappings: src/types/generated/search/mappings/*.ts
   - Zod schemas: src/types/generated/search/schemas/*.ts
   - TypeScript types: src/types/generated/search/types/*.ts
```

**Never edit generated files.** Update generators only.

### Test Types (From testing-strategy.md)

1. **Unit test** (`*.unit.test.ts`)
   - Tests single PURE function
   - NO IO, NO side effects, NO mocks
   - Fast and isolated

2. **Integration test** (`*.integration.test.ts`)
   - Tests code units working together (IMPORTED, not running system)
   - NO IO, SIMPLE mocks injected as arguments
   - Uses supertest for Express apps (imported code, not deployed)

3. **E2E test** (`*.e2e.test.ts`)
   - Tests running system in separate process
   - CAN trigger File System and STDIO, NOT network
   - Located in `e2e-tests/` directory

### Rate Limiting & Retry (ADR-070)

- **Oak API limit**: 1000 requests/hour
- **SDK throttle**: 5 req/sec with exponential backoff
- **Monitoring**: Real-time quota warnings at 75%/90%
- **Singleton pattern**: Shared rate limiting state

### Public API Boundaries

**Use only public exports**:

- Core: `@oaknational/oak-curriculum-sdk`
- Search: `.../public/search`
- MCP: `.../public/mcp-tools`

❌ Never import from `types/generated/` or internal paths

---

## 🗂️ File Locations (Quick Reference)

### SDK (Type Generation)

```
packages/sdks/oak-curriculum-sdk/
├── type-gen/typegen/search/
│   ├── field-definitions/
│   │   └── curriculum.ts          ← ADD NEW FIELDS HERE
│   ├── es-field-overrides.ts      ← ADD ES OVERRIDES HERE
│   ├── es-mapping-from-fields.ts  ← Mapping generator
│   └── zod-schema-generator.ts    ← Zod generator
└── src/types/generated/search/    ← GENERATED (don't edit)
```

### App (Ingestion & Search)

```
apps/oak-open-curriculum-semantic-search/
├── src/lib/
│   ├── indexing/
│   │   ├── document-transform-helpers.ts  ← Extraction functions (tier, exam_board, pathway)
│   │   ├── document-transforms.ts         ← Create ES documents with dense vectors
│   │   └── dense-vector-extraction.ts     ← NEW: E5 embedding generation
│   ├── hybrid-search/
│   │   └── rrf-query-builders.ts          ← UPDATE: Add kNN for three-way RRF
│   └── elasticsearch/
│       └── client.ts                       ← ES client setup
└── e2e-tests/                              ← E2E tests
```

### Tests

```
packages/sdks/oak-curriculum-sdk/
└── src/
    └── **/*.unit.test.ts                   ← Unit tests (pure functions)
    └── **/*.integration.test.ts            ← Integration tests (imported code)

apps/oak-open-curriculum-semantic-search/
└── e2e-tests/
    └── **/*.e2e.test.ts                    ← E2E tests (running system)
```

---

## 📖 Documentation Links

### Primary Documents

| Document                               | Purpose                                     |
| -------------------------------------- | ------------------------------------------- |
| **`maths-ks4-implementation-plan.md`** | Complete implementation roadmap (MAIN PLAN) |
| **`search-ui-plan.md`**                | Frontend implementation plan                |
| **`README.md`**                        | Navigation hub for all planning docs        |
| **`data-completeness-policy.md`**      | What data we upload in full                 |
| **`es-serverless-feature-matrix.md`**  | Feature tracking matrix                     |

### Research Documents

| Document                                                 | Purpose                                     |
| -------------------------------------------------------- | ------------------------------------------- |
| **`curriculum-schema-field-analysis.md`**                | Untapped API schema fields for search (NEW) |
| **`natural-language-search-with-es-native-features.md`** | ES-native NLP capabilities                  |

### Foundation Documents (Re-read Regularly)

| Document                        | Purpose                               |
| ------------------------------- | ------------------------------------- |
| **`rules.md`**                  | TDD, quality gates, no type shortcuts |
| **`schema-first-execution.md`** | All types from field definitions      |
| **`testing-strategy.md`**       | Test types and TDD approach           |

### ADRs (Architectural Decision Records)

| ADR     | Title                                           | Status      |
| ------- | ----------------------------------------------- | ----------- |
| **067** | SDK Generated Elasticsearch Mappings            | ✅ Complete |
| **068** | Per-Index Completion Context Enforcement        | ✅ Complete |
| **069** | Systematic Ingestion Progress Tracking          | ✅ Complete |
| **070** | SDK Rate Limiting and Retry                     | ✅ Complete |
| **071** | Elastic-Native Dense Vector Strategy (Phase 1A) | 📝 To Write |
| **072** | Three-Way Hybrid Search Architecture (Phase 1A) | 📝 To Write |
| **073** | Dense Vector Field Configuration (Phase 1A)     | 📝 To Write |

---

## 🐛 Troubleshooting

### Common Issues

| Problem                            | Solution                                                                        |
| ---------------------------------- | ------------------------------------------------------------------------------- |
| `strict_dynamic_mapping_exception` | Field missing from ES mapping. Add to field-definitions.ts, run `pnpm type-gen` |
| Generator/generated drift          | Update generators, never edit generated files. Run `pnpm type-gen`              |
| Lint errors after `type-gen`       | Generators emit bad code. Fix generator templates                               |
| `console` statements               | Replace with `@oaknational/mcp-logger`. See `src/lib/logger.ts`                 |
| Tests failing                      | Run quality gates one at a time to isolate issue                                |
| Port conflict in smoke tests       | Kill process using port 3333 or use `--port`                                    |

### ES Serverless Gotchas

| Issue                                   | Solution                                                                  |
| --------------------------------------- | ------------------------------------------------------------------------- |
| `_cluster/health` fails                 | Use `/` or `/_cat/indices?v` instead                                      |
| `synonym_graph` at index time           | Split analyzers: `oak_text_index` (no synonyms), `oak_text_search` (with) |
| `optional: true` on completion contexts | Not supported—remove from definitions                                     |
| `number_of_shards/replicas`             | Not supported in Serverless—omit from mappings                            |

---

## 🎯 Success Criteria (Know When You're Done)

### Phase 1A Complete When:

- [x] Dense vector fields added to lessons and unit_rollup indexes (384-dim)
- [x] ES field overrides configured for dense_vector type
- [x] `pnpm type-gen` generates correct mappings
- [ ] All extraction functions have passing unit tests (tier, exam_board, pathway)
- [ ] Dense vector generation using `.multilingual-e5-small-elasticsearch`
- [ ] Document transforms include dense vector generation
- [ ] Three-way RRF query implemented
- [ ] E2E test proves three-way beats two-way (MRR improvement)
- [ ] All 10 quality gates passing
- [ ] ADR-071 written (Elastic-Native Dense Vector Strategy)
- [ ] ADR-072 written (Three-Way Hybrid Search Architecture)
- [ ] ADR-073 written (Dense Vector Field Configuration)
- [ ] No type shortcuts introduced
- [ ] No external API dependencies for core search
- [ ] Prompt updated with Phase 1A completion

### Full Project Complete When:

- [ ] All 5 phases completed
- [ ] 23 new ES features integrated
- [ ] 15 ADRs written (071-085)
- [ ] 135+ new tests passing
- [ ] 17 new docs created
- [ ] MRR: 0.65 → 0.80 (+23%)
- [ ] NDCG@10: 0.70 → 0.85 (+21%)
- [ ] Zero-hit rate: 15% → <5%
- [ ] p95 latency: <300ms
- [ ] Impressive stakeholder demo ready
- [ ] <$100/month operational cost

---

## 📞 What To Do If Stuck

### If Tests Won't Pass

1. Check you wrote tests FIRST (RED phase)
2. Verify test actually fails when implementation is wrong
3. Review test fixtures and mock data
4. Check foundation docs for testing patterns
5. Look at existing tests for similar patterns

### If Quality Gates Fail

1. Run gates one at a time to isolate failure
2. Read error messages carefully
3. Check if generator templates need fixes (for type-gen issues)
4. Review rules.md for coding standards
5. Never use `eslint-disable` comments

### If Uncertain About Architecture

1. Re-read foundation documents
2. Check existing ADRs for similar decisions
3. Review `maths-ks4-implementation-plan.md` for guidance
4. Prefer schema-first approach
5. Favor type-safe solutions over shortcuts

---

## 🚦 Ready to Start?

### Final Checklist

- [ ] Read foundation documents (rules.md, schema-first, testing-strategy)
- [ ] Read main plan (maths-ks4-implementation-plan.md)
- [ ] Verified all quality gates passing
- [ ] Verified ES status (`pnpm es:status`)
- [ ] Configured `.env.local` with ES and Oak API keys
- [ ] Verified E5 endpoint available (`.multilingual-e5-small-elasticsearch`)
- [ ] Committed to TDD (RED → GREEN → REFACTOR)
- [ ] Committed to schema-first approach
- [ ] Committed to zero type shortcuts
- [ ] Committed to Elastic-native approach (no external API for core search)

### If ALL checked:

**Begin Phase 1A Day 1**: Write dense vector extraction tests (RED phase)

**See**: "Phase 1A: Start Here" section above for step-by-step guidance

---

## 📝 After Each Work Session

### Update This Prompt

When you complete a phase or major milestone:

1. Update "Current State & What's Next" section
2. Add completed ADRs to ADR table
3. Update success criteria checkboxes
4. Add any new troubleshooting items discovered
5. Commit changes with descriptive message

### Maintain Quality

- Run all quality gates before ending session
- Update phase 1A implementation guide with lessons learned
- Document any deviations from plan with rationale
- Keep this prompt as THE single source of truth for fresh chats

---

**Remember**: You have everything you need. The foundation documents and main plan contain complete specifications. Trust the TDD process: RED → GREEN → REFACTOR. All quality gates must pass. No type shortcuts. Ever.

**Now go build something deeply impressive.** 🚀

---

**End of Entry Point**
