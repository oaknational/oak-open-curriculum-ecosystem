# Semantic Search Requirements & Strategic Context

**Purpose**: Business context, success criteria, risks, and strategic goals for semantic search implementation  
**Audience**: AI agents and developers starting fresh on semantic search work  
**Last Updated**: 2025-12-19

---

## Strategic Goal

Create a production-ready demo that proves Elasticsearch Serverless as the **definitive platform** for intelligent curriculum search, using Maths KS4 as a complete vertical slice that scales to the full Oak curriculum.

---

## Why Maths KS4 Vertical Slice?

Given the **Oak API 10,000 requests/hour limit** (upgraded from 1,000), full ingestion is significantly faster. Maths KS4 provides:

| Reason                        | Benefit                                                   |
| ----------------------------- | --------------------------------------------------------- |
| **Maximum complexity**        | Tiers (Foundation/Higher), pathways, exam boards, threads |
| **High value**                | Exam preparation content teachers actively need           |
| **Complete feature coverage** | Tests all search, faceting, and semantic capabilities     |
| **Manageable scope**          | ~100-200 API requests = 10-20 minutes to ingest           |
| **Foundation for expansion**  | Patterns and learnings scale to full curriculum           |

---

## Success Criteria

### Technical Success

Aligned with [ADR-081](../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md):

| Metric | Target | Current | Status | Rationale |
|--------|--------|---------|--------|-----------|
| Standard Query MRR | ≥0.92 | 0.931 | ✅ Met | Topic-based queries work well |
| Hard Query MRR | ≥0.50 | 0.367 | ❌ Gap | Naturalistic, misspelled, intent queries |
| NDCG@10 | Per category | — | 📋 | Graded relevance by query type |
| Zero-hit rate | 0% | 0% | ✅ Met | All queries return results |
| p95 latency | ≤1500ms | ~450ms | ✅ Met | Allows for reranking overhead |
| Quality gates | All pass | ✅ | ✅ Met | No regressions, no shortcuts |

**Note**: Original targets (MRR > 0.70, p95 < 300ms) were conservative baselines. ADR-081 defines category-specific targets based on actual user query patterns.

### Business Success

| Criterion                       | Definition                                                                             |
| ------------------------------- | -------------------------------------------------------------------------------------- |
| **Impressive stakeholder demo** | Can demonstrate semantic search, faceting, and curriculum navigation to Oak leadership |
| **Production-ready code**       | TDD, documented, all quality gates passing, no type shortcuts                          |
| **Scalable to full curriculum** | Architecture supports 340+ subject/key-stage combinations                              |
| **Cost-effective**              | <$100/month operational cost (excluding ES subscription)                               |

### Deliverables (Updated 2025-12-19)

Work is organised using Part → Stream → Task hierarchy. See [part-1-search-excellence.md](part-1-search-excellence.md) for detailed plan.

#### Part 1: Search Excellence [🔄 In Progress]

**Done When**: Hard Query MRR ≥0.50, Search SDK ready for MCP consumption

| Stream | Focus | Status | Key Deliverables |
|--------|-------|--------|------------------|
| **A: Foundation** | Baseline infrastructure | ✅ Complete | 4-way hybrid, KS4 filtering, ground truth |
| **B: Relevance Optimisation** | Improve Hard MRR | 📋 Ready | Semantic reranking, linear retriever tuning |
| **C: Query Intelligence** | Pre-processing | 📋 Blocked | Query expansion, phonetic, classification |
| **D: Infrastructure** | SDK extraction | 📋 Ready | Search SDK, CLI, retire Next.js |

MCP tool creation is coordinated separately in `.agent/plans/sdk-and-mcp-enhancements/`.

#### Part 2: MCP Natural Language Tools [📋 Planned]

**Done When**: Agents can search Oak curriculum effectively via MCP

| Stream | Focus | Key Deliverables |
|--------|-------|------------------|
| **A: Structured Search Tools** | SDK consumption | Lesson search, unit search, filter tools |
| **B: Natural Language Pipeline** | Intent handling | NL→Search routing, intent detection, RAG |
| **C: Agent Guidance** | Prompts | Tool prompts, workflow prompts, error handling |

#### Part 3: Future Enhancements [📋 Future]

| Stream | Focus | Reference |
|--------|-------|-----------|
| **A: Reference Indices** | Enriched metadata | [phase-10](phase-10-reference-indices.md) |
| **B: Entity Extraction** | NER, concepts | [phase-9](phase-9-entity-extraction.md) |
| **C: Learning to Rank** | Click signals | [phase-11+](phase-11-plus-future.md) |
| **D: Full Curriculum** | All subjects | Scale patterns |
| **E: Search UI** | User interface | Deferred |

**Design Principles**:

- **Functional over aesthetic** - Clean, working UI; styling deferred
- **Portable** - Self-contained components for future Oak app integration
- **External for complexity** - Link to ES Kibana for advanced management

---

## Cost Model

### One-Time (Maths KS4 Ingestion)

| Component           | Cost   | Notes                                    |
| ------------------- | ------ | ---------------------------------------- |
| E5 embeddings       | $0     | Elastic-native, included in subscription |
| ELSER semantic text | $0     | Included in subscription                 |
| Oak API calls       | $0     | Within existing quota                    |
| **Total**           | **$0** |                                          |

### Ongoing (Monthly, Full Curriculum)

| Component             | Cost         | Notes                                                     |
| --------------------- | ------------ | --------------------------------------------------------- |
| E5 embeddings         | $0           | `.multilingual-e5-small-elasticsearch` - included         |
| ELSER                 | $0           | `.elser-2-elasticsearch` - included                       |
| Elastic Native ReRank | $0           | `.rerank-v1-elasticsearch` - included                     |
| NER models            | $0           | Deployed within ES cluster                                |
| Elastic Native LLM    | $0           | `.gp-llm-v2-chat_completion` - included                   |
| **Total**             | **$0/month** | All AI/ML features included in ES Serverless subscription |

**Note**: The only external costs are the Elasticsearch Serverless subscription itself (resource-based billing) and Oak API calls (within existing quota).

---

## Risk Mitigation

### High Risk

| Risk                           | Impact                    | Mitigation                                                                                        |
| ------------------------------ | ------------------------- | ------------------------------------------------------------------------------------------------- |
| **ES Serverless Availability** | Search unavailable        | Graceful degradation (disable dense vectors/rerank if inference unavailable), caching, monitoring |
| **Latency Regression**         | Poor UX, user abandonment | Two-stage retrieval (fast first-pass, slow rerank on top-K), performance testing, feature flags   |

### Medium Risk

| Risk                           | Impact                 | Mitigation                                                    |
| ------------------------------ | ---------------------- | ------------------------------------------------------------- |
| **Entity Extraction Accuracy** | Poor NER results       | Confidence thresholds (>0.7), manual validation for Maths KS4 |
| **Complexity Burden**          | Maintenance difficulty | Comprehensive docs, ADRs, TDD, regular code reviews           |
| **Ground Truth Validity**      | Meaningless metrics    | Cross-reference with upstream API, curriculum expert review   |

### Low Risk

| Risk                | Impact         | Mitigation                                                         |
| ------------------- | -------------- | ------------------------------------------------------------------ |
| **API Rate Limits** | Slow ingestion | 10,000 req/hr limit is generous; batch requests, caching if needed |
| **Schema Changes**  | Type errors    | Cardinal Rule: `pnpm type-gen` + `pnpm build` brings alignment     |

---

## Demo Scenarios

### Technical Validation Scenarios

Use these to verify the system works correctly:

#### 1. Two-Way Hybrid Search (Phase 1)

**Query**: "Pythagoras theorem"

**Expected**:

- ELSER captures Maths domain semantics
- BM25 captures exact phrase matches
- Results include lessons from `right-angled-trigonometry` unit
- Foundation and Higher tier lessons returned

#### 2. Fuzzy Matching

**Query**: "pythagorus" (misspelled)

**Expected**:

- Fuzziness handles typo
- Returns same results as correct spelling
- No zero-hit

#### 3. Filtered Search

**Query**: "trigonometry" + Filter: `{ tier: 'foundation' }`

**Expected**:

- Only Foundation tier lessons returned
- Facets update to show filtered counts

#### 4. Three-Way Hybrid (Phase 2, if needed)

**Query**: "How do I teach Pythagoras theorem to struggling students?"

**Expected**:

- Dense vector captures semantic intent ("teach", "struggling")
- ELSER captures Maths domain
- BM25 captures exact phrases
- Results include Foundation tier, teaching tips, misconceptions

#### 5. Rerank (Phase 3)

**Query**: "solving quadratic equations"

**Expected**:

- Three-way hybrid returns 50 results
- Elastic Native ReRank reorders top-10 for better relevance
- MRR improves by 10-25%

### User-Focused Demo Scenarios (Stakeholder Presentation)

#### Scenario 1: Teacher Looking for Trigonometry Lessons

**User Story**: "I'm teaching Foundation tier and need trigonometry lessons"

**Demo Flow**:

1. Search "trigonometry foundation tier"
2. Show filtered results with tier badges
3. Click through to lesson detail
4. Show "More like this" suggestions

**Value**: Precise filtering, semantic understanding

#### Scenario 2: Finding Prerequisites

**User Story**: "I need to know what students should learn before Pythagoras"

**Demo Flow**:

1. Search "What do students need to know before Pythagoras?"
2. Show prerequisite concepts (right-angled triangles, square numbers, square roots)
3. Navigate to prerequisite lessons

**Value**: RAG capabilities, knowledge graph, prerequisite mapping

#### Scenario 3: Planning a Unit

**User Story**: "I'm planning a unit on factorisation for Higher tier"

**Demo Flow**:

1. Search "algebra factorisation higher tier"
2. Show units with factorisation focus
3. Display topic hierarchy (single brackets, quadratics, difference of squares)
4. Show common misconceptions

**Value**: Multi-index search, thread navigation, pedagogical metadata

#### Scenario 4: Exploring Concepts Across Tiers

**User Story**: "How are simultaneous equations taught differently in Foundation vs Higher?"

**Demo Flow**:

1. Search "simultaneous equations"
2. Compare Foundation (graphical, substitution) vs Higher (elimination, complex systems)
3. Show progression path

**Value**: Cross-tier analysis, comprehensive concept coverage

---

## Common Issues & Solutions

### Issue: E5 inference returns empty response

**Cause**: Empty text input or endpoint unavailable.

**Solution**:

```typescript
// Test E5 endpoint manually
const response = await esClient.inference.inference({
  inference_id: '.multilingual-e5-small-elasticsearch',
  input: 'Test query for embedding',
});
console.log('Embedding length:', response.text_embedding?.[0]?.length);
// Expected: 384
```

### Issue: Embeddings not generated during ingestion

**Cause**: ES client not passed to document transform functions.

**Solution**:

```typescript
// Ensure esClient is available in createLessonDocument
const doc = await createLessonDocument({
  // ... other params
  esClient, // ← Must be provided for dense vector generation
});
```

### Issue: Type errors after `pnpm type-gen`

**Cause**: Invalid syntax in field-definitions.ts or es-field-overrides.ts.

**Solution**:

```bash
# Validate field definitions
pnpm type-check packages/sdks/oak-curriculum-sdk
```

### Issue: kNN query fails

**Cause**: Dense vector field missing `index: true`.

**Solution**:

```typescript
// Check mapping in es-field-overrides.ts
lesson_dense_vector: {
  type: 'dense_vector',
  dims: 384,  // Must match E5 dimensions
  index: true,  // ← Required for kNN
  similarity: 'cosine',
},
```

### Issue: Zero hits for valid queries

**Cause**: Data not indexed, or filter mismatch.

**Solution**:

```bash
# Verify data in ES
cd apps/oak-open-curriculum-semantic-search
pnpm es:status

# Check specific index
curl -X GET "$ES_URL/oak_lessons/_count"
```

### Issue: Smoke tests fail with "server not available"

**Cause**: Semantic search server not running.

**Solution**:

```bash
# Terminal 1: Start server
cd apps/oak-open-curriculum-semantic-search
pnpm dev

# Terminal 2: Run smoke tests
pnpm test:smoke
```

---

## ADR Requirements

Each phase should produce specific ADRs:

### Phase 1 ADRs (Foundation)

| ADR     | Topic                                               | Status     |
| ------- | --------------------------------------------------- | ---------- |
| ADR-071 | Elastic-Native Dense Vector Strategy (E5 vs OpenAI) | ✅ Written |
| ADR-072 | Three-Way Hybrid Search Architecture                | ✅ Written |
| ADR-073 | Dense Vector Field Configuration                    | ✅ Written |
| ADR-074 | Elastic-Native First Philosophy                     | ✅ Written |

### Phase 2 ADRs (Dense Vectors)

| ADR | Topic                         | Status                   |
| --- | ----------------------------- | ------------------------ |
| -   | Three-Way vs Two-Way Decision | 📋 When Phase 2 executed |

### Phase 3 ADRs (Relevance Enhancement)

| ADR     | Topic                             | Status     |
| ------- | --------------------------------- | ---------- |
| ADR-075 | Elastic Native ReRank Integration | 📋 Planned |
| ADR-076 | Filtered kNN Query Optimization   | 📋 Planned |

### Phase 9 ADRs (Entity Extraction)

| ADR     | Topic                                  | Status     |
| ------- | -------------------------------------- | ---------- |
| ADR-077 | NER Entity Extraction Strategy         | 📋 Planned |
| ADR-078 | Graph API for Curriculum Relationships | 📋 Planned |
| ADR-079 | Enrich Processor for Reference Data    | 📋 Planned |

### Phase 10-13 ADRs

| ADR     | Topic                                      | Phase |
| ------- | ------------------------------------------ | ----- |
| ADR-080 | Reference Indices for Enum Data            | 10    |
| ADR-081 | ES Playground RAG Integration              | 11    |
| ADR-082 | Chunked Transcript Storage (semantic_text) | 11    |
| ADR-083 | Entity Resolution Strategy                 | 12    |
| ADR-084 | Knowledge Graph Multi-Hop Queries          | 12    |
| ADR-085 | Learning to Rank Foundations               | 13    |

---

## Deferred Work

### Phase 1F: Search Filter Improvements (Post-Baseline)

**Goal**: Make facet fields filterable in search queries.

Currently, facets are returned for tier, exam_board, pathway but **cannot be used as query filters**:

| Filter     | In Index | Has Facet | Can Filter |
| ---------- | -------- | --------- | ---------- |
| Subject    | ✅       | ✅        | ✅ YES     |
| Key Stage  | ✅       | ✅        | ✅ YES     |
| Tier       | ✅       | ✅        | ❌ NO      |
| Exam Board | ✅       | ✅        | ❌ NO      |
| Pathway    | ✅       | ✅        | ❌ NO      |
| Year Group | ❌       | ❌        | ❌ NO      |

**Tasks**:

- Add `year_group` field to indices
- Extend `StructuredQuery` interface with tier, examBoard, pathway, yearGroup
- Update query builders to apply filter clauses

### Phase 1G: API Schema Filter Investigation (Post-Baseline)

**Goal**: Identify additional filterable fields from Oak API schema.

**Fields to investigate**:

- `yearSlug` / `yearTitle` - Year group filtering
- `tierSlug` / `tierTitle` - Tier-based filtering
- `contentGuidance` - Content safety filtering
- `supervisionLevel` - Age-appropriate content filtering
- `downloadsAvailable` - Practical lesson filtering
- `priorKnowledgeRequirements` - Prerequisite search
- `nationalCurriculumContent` - Standards alignment search

### UI Implementation (Separate Plan Needed)

The UI plan (`search-ui-plan.md`) has been archived. Key areas needing attention:

- Component architecture
- Theme implementation (~1,200 LOC of custom theme code)
- Fixture testing strategy (4 fixture modes)
- Responsive layout (5 breakpoints)
- Accessibility (WCAG 2.1 AA)
- Playwright E2E coverage
- Client state management
- Performance optimization
- Observability/Sentry integration

**Status**: UI work is **deferred** until backend search quality is validated. Create a new UI plan when ready to proceed.

---

## Environment Requirements

### Required Environment Variables

**File**: `apps/oak-open-curriculum-semantic-search/.env.local`

```bash
# Elasticsearch
ELASTICSEARCH_URL=https://your-elasticsearch-url-here
ELASTICSEARCH_API_KEY=your_elasticsearch_api_key_here

# Oak API
OAK_API_KEY=your_oak_api_key_here

# Search API
SEARCH_API_KEY=your_search_api_key_here

# Logging
LOG_LEVEL=info
```

### ES Inference Endpoints (Pre-configured)

| Endpoint                               | Type             | Dimensions | Cost |
| -------------------------------------- | ---------------- | ---------- | ---- |
| `.multilingual-e5-small-elasticsearch` | text_embedding   | 384        | $0   |
| `.elser-2-elasticsearch`               | sparse_embedding | -          | $0   |
| `.rerank-v1-elasticsearch`             | rerank           | -          | $0   |

---

## Supporting Documents

| Document          | Location                                                                           | Purpose                               |
| ----------------- | ---------------------------------------------------------------------------------- | ------------------------------------- |
| Rules             | `.agent/directives-and-memory/rules.md`                                            | TDD, quality gates, no type shortcuts |
| Schema-First      | `.agent/directives-and-memory/schema-first-execution.md`                           | All types from field definitions      |
| Testing Strategy  | `.agent/directives-and-memory/testing-strategy.md`                                 | Test types and TDD approach           |
| IR Metrics Guide  | `.agent/plans/semantic-search/reference/reference-ir-metrics-guide.md`             | MRR, NDCG explained                   |
| ES Feature Matrix | `.agent/plans/semantic-search/reference/reference-es-serverless-feature-matrix.md` | Feature adoption tracking             |
| Data Completeness | `.agent/plans/semantic-search/reference/reference-data-completeness-policy.md`     | What data to upload                   |

---

**Ready to start?** Read the prompt at `.agent/prompts/semantic-search/semantic-search.prompt.md`
