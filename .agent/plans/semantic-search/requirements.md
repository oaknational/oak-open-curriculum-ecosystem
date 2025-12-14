# Semantic Search Requirements & Strategic Context

**Purpose**: Business context, success criteria, risks, and strategic goals for semantic search implementation  
**Audience**: AI agents and developers starting fresh on semantic search work  
**Last Updated**: 2025-12-13

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

| Metric                     | Target   | Rationale                                        |
| -------------------------- | -------- | ------------------------------------------------ |
| MRR (Mean Reciprocal Rank) | > 0.70   | First relevant result in position 1-2 on average |
| NDCG@10                    | > 0.75   | Highly relevant results ranked near top          |
| Zero-hit rate              | < 10%    | Most queries return results                      |
| p95 latency                | < 300ms  | Good user experience                             |
| Quality gates              | All pass | No regressions, no shortcuts                     |

### Business Success

| Criterion                       | Definition                                                                             |
| ------------------------------- | -------------------------------------------------------------------------------------- |
| **Impressive stakeholder demo** | Can demonstrate semantic search, faceting, and curriculum navigation to Oak leadership |
| **Production-ready code**       | TDD, documented, all quality gates passing, no type shortcuts                          |
| **Scalable to full curriculum** | Architecture supports 340+ subject/key-stage combinations                              |
| **Cost-effective**              | <$100/month operational cost (excluding ES subscription)                               |

### New Deliverables (Updated 2025-12-12)

Remaining work is organized into three parts:

#### Part 1: Search Infrastructure Verification (Phase 3)

| Deliverable                        | Phase | Success Criteria                                         |
| ---------------------------------- | ----- | -------------------------------------------------------- |
| **Hybrid search proven working**   | 3     | BM25 vs ELSER vs Hybrid experiment shows hybrid superior |
| **Lesson-only search verified**    | 3     | Smoke test proves lesson search returns only lessons     |
| **Unit-only search verified**      | 3     | Smoke test proves unit search returns only units         |
| **Joint search verified**          | 3     | Results properly categorised by `doc_type`               |
| **Lesson filter by unit verified** | 3     | Unit filter correctly restricts lesson results           |
| **Feature parity fields added**    | 3     | `pupilLessonOutcome`, display titles, unit enrichment    |

Phase 3 proves the search infrastructure works correctly. MCP tool creation is coordinated separately in `.agent/plans/sdk-and-mcp-enhancements/`.

#### Part 2: Enhancements (Phases 4-10)

| Deliverable           | Phase | Success Criteria                                          |
| --------------------- | ----- | --------------------------------------------------------- |
| **Search SDK + CLI**  | 4     | SDK services + first-class local CLI for admin ops        |
| **Search UI**         | 5     | Functional search experience, portable components         |
| **Cloud Functions**   | 6     | (Future) HTTP-based ingestion control, timeout-safe       |
| **Admin Dashboard**   | 7     | (Future) Browser-based ingestion control, metrics display |
| **Query Enhancement** | 8     | Production patterns, OWA compatibility                    |
| **Entity Extraction** | 9     | NER, concept graphs                                       |
| **Reference Indices** | 10    | Enriched results with titles, prerequisites, NC           |

**Phase 10 Impact**: Transforms `semantic_search` from raw slugs to enriched curriculum discovery (human-readable titles, prerequisites, NC alignment, glossary).

#### Part 3: AI Integration (Phase 11+)

| Deliverable         | Phase | Success Criteria                    |
| ------------------- | ----- | ----------------------------------- |
| **RAG**             | 11    | Retrieval-augmented generation      |
| **Knowledge Graph** | 12    | Curriculum relationship graph       |
| **LTR**             | 13    | Learning to rank with click signals |

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
