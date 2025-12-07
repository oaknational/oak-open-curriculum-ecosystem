# Enhanced Plan Summary: Complete ES Serverless Integration

**Date**: 2025-12-08  
**Status**: Planning Complete - Ready for Implementation  
**Foundation Alignment**: ✅ Verified

---

## What Changed

### Before (Original Plan)

**Focus**: Basic hybrid field addition (37 fields)
- Tier, exam board, pathway from API
- Computed difficulty and duration
- Empty relationship fields
- **Timeline**: 2-3 weeks
- **ES Features**: 12 current

### After (Enhanced Plan)

**Focus**: Complete ES Serverless feature showcase
- Everything from original plan PLUS
- 23 additional ES Serverless features
- Three-way hybrid search (BM25 + ELSER + Dense)
- AI integration (OpenAI, Cohere, HuggingFace)
- Knowledge graph capabilities
- RAG infrastructure
- **Timeline**: 4-5 weeks
- **ES Features**: 35 total (100% high-impact coverage)

---

## New Planning Documents Created

### Core Plans

1. **`maths-ks4-es-serverless-complete.md`** ⭐ MAIN PLAN
   - Complete phase-by-phase roadmap
   - 5 major phases with sub-phases
   - TDD approach for every feature
   - 15 new ADRs planned
   - Comprehensive success criteria

2. **`phase-1a-implementation-guide.md`** 📖 PRACTICAL GUIDE
   - Day-by-day implementation walkthrough
   - RED → GREEN → REFACTOR examples
   - Code templates with TSDoc
   - Common issues & solutions
   - Quality gate checklists

3. **`es-serverless-feature-matrix.md`** 📊 TRACKING
   - Feature adoption matrix
   - Impact assessment
   - Cost-benefit analysis
   - Risk assessment
   - Success metrics

### Updated Documents

4. **`index.md`** - Updated with enhanced strategy
5. **`semantic-search.prompt.md`** - Updated continuation prompt

---

## Key Features Being Added

### Phase 1A: Three-Way Hybrid Search (2-3 days)

**ES Features**:
- Inference API integration
- Dense vector fields (1536-dim)
- OpenAI text-embedding-3-small
- Three-way RRF (BM25 + ELSER + Dense)

**Deliverables**:
- 3 ADRs (071-073)
- 20+ unit tests
- 5+ integration tests
- 1 E2E test
- 3 docs with examples

**Impact**: 15-25% relevance improvement

### Phase 1B: Relevance Enhancement (2-3 days)

**ES Features**:
- Cohere ReRank via Inference API
- Filtered kNN optimization
- Semantic query rules

**Deliverables**:
- 2 ADRs (074-075)
- 15+ tests
- 2 docs

**Impact**: Additional 10-25% relevance boost, 50% faster filtered searches

### Phase 2A: Entity Extraction & Graph (3-4 days)

**ES Features**:
- NER models (HuggingFace)
- Graph API for co-occurrence
- Enrich processor
- Significant terms aggregation

**Deliverables**:
- 3 ADRs (076-078)
- 25+ tests
- 3 docs

**Impact**: Enables concept-based search, discovers non-obvious relationships

### Phase 2B: Thread & Reference Indices (2-3 days)

**ES Features**:
- New indices: oak_threads, oak_subjects, oak_key_stages, oak_years, oak_maths_topics
- Cross-index enrichment

**Deliverables**:
- 1 ADR (079)
- 10+ tests
- 2 docs

**Impact**: Searchable reference data, enriched metadata

### Phase 3: RAG Infrastructure (4-5 days)

**ES Features**:
- ES Playground for prototyping
- semantic_text field with auto-chunking
- LLM chat completion
- Multi-retriever queries

**Deliverables**:
- 2 ADRs (080-081)
- 20+ tests
- 3 docs

**Impact**: Production-ready RAG, 10x faster prototyping

### Phase 4: Knowledge Graph (5-6 days)

**ES Features**:
- Triple store index
- Entity resolution
- Graph traversal

**Deliverables**:
- 2 ADRs (082-083)
- 30+ tests
- 2 docs

**Impact**: Explicit curriculum relationships, multi-hop reasoning

### Phase 5: Advanced Features (3-4 days)

**ES Features**:
- Learning to Rank foundations
- Multi-vector fields
- Runtime fields
- Scripted similarity

**Deliverables**:
- 2 ADRs (084-085)
- 15+ tests
- 2 docs

**Impact**: Personalized relevance, aspect-based retrieval

---

## Foundation Document Compliance

### Schema-First Execution ✅

**All new features follow schema-first pattern**:

1. Define fields in `field-definitions/curriculum.ts`
2. Add ES overrides in `es-field-overrides.ts`
3. Run `pnpm type-gen` to generate mappings and Zod schemas
4. Never edit generated files
5. Update generators only

**Example**: Dense vector fields
```typescript
// field-definitions/curriculum.ts
{ name: 'lesson_dense_vector', zodType: 'array-number', optional: true },

// es-field-overrides.ts
lesson_dense_vector: {
  type: 'dense_vector',
  dims: 1536,
  index: true,
  similarity: 'cosine',
},

// Run: pnpm type-gen
// Result: Auto-generated mapping + Zod schema
```

### TDD at ALL Levels ✅

**Every feature includes**:

1. **Unit tests FIRST** (RED phase)
   - Pure functions
   - No IO, no side effects
   - No mocks

2. **Integration tests** (RED → GREEN)
   - Code units working together
   - Simple mocks injected as arguments
   - No network calls

3. **E2E tests** (System validation)
   - Running system in separate process
   - Real behavior validation
   - Written BEFORE implementation changes

**Example from Phase 1A**:
```typescript
// 1. RED - Unit test first
describe('extractDenseVector', () => {
  it('should call inference API with lesson text', async () => {
    const mockInference = vi.fn().mockResolvedValue([0.1, 0.2, ...]);
    const vector = await extractDenseVector('text', mockInference);
    expect(vector).toHaveLength(1536);
  });
});

// 2. GREEN - Implement to pass
export async function extractDenseVector(
  text: string,
  inferenceClient: InferenceClient
): Promise<number[] | undefined> {
  // Implementation
}

// 3. REFACTOR - Improve while tests stay green
```

### Documentation Requirements ✅

**For every phase**:

1. **ADRs** - Architectural decisions with rationale
2. **TSDoc** - 100% coverage with examples
3. **Authored docs** - User-facing guides
4. **Prompt updates** - Keep continuation prompt current

**Total documentation deliverables**:
- 15 new ADRs (071-085)
- 17 new docs
- 100% TSDoc coverage
- Updated continuation prompt

---

## Quality Gates

**All phases must pass**:

```bash
pnpm type-gen       # Generate artifacts
pnpm build          # Compile
pnpm type-check     # Zero type errors
pnpm lint:fix       # Zero lint violations
pnpm format:root    # Code formatting
pnpm markdownlint:root  # Doc formatting
pnpm test           # 1,310+ tests pass
pnpm test:e2e       # E2E validation
pnpm test:e2e:built # Built E2E validation
```

**No exceptions. All gates must be green.**

---

## Success Metrics

### Technical

- [ ] 23 new ES features integrated
- [ ] 15 ADRs written
- [ ] 135+ new tests passing
- [ ] 17 new docs created
- [ ] Zero type shortcuts
- [ ] All quality gates passing

### Search Quality

- [ ] MRR improved from 0.65 → 0.80 (23% gain)
- [ ] NDCG@10 improved from 0.70 → 0.85 (21% gain)
- [ ] Zero-hit rate reduced from 15% → <5%
- [ ] p95 latency maintained <300ms

### Business

- [ ] Demo impresses stakeholders
- [ ] Production-ready code
- [ ] Scalable to full curriculum
- [ ] Under $100/month operational cost
- [ ] Clear ROI demonstration

---

## Cost Estimate

### One-Time (Ingestion)

- OpenAI embeddings: ~$2 (Maths KS4)
- NER extraction: ~$1
- **Total**: ~$3

### Ongoing (Per Month, Full Curriculum)

- OpenAI embeddings: ~$40 (new content)
- Cohere ReRank: ~$200 (20K queries)
- NER models: ~$20
- GPT-4 RAG: ~$1,000 (20K queries)
- **Total**: ~$1,260/month

**Mitigation**: Caching, batch processing, feature flags

---

## Risk Mitigation

### High Risk Items

1. **OpenAI API Dependency**
   - Mitigation: Graceful degradation, caching, fallback to two-way hybrid

2. **Cost Escalation**
   - Mitigation: Budget alerts, rate limiting, usage monitoring

3. **Latency Regression**
   - Mitigation: Two-stage retrieval, performance testing, feature flags

### Medium Risk Items

4. **Entity Extraction Accuracy**
   - Mitigation: Confidence thresholds, manual validation

5. **Complexity Burden**
   - Mitigation: Comprehensive docs, ADRs, TDD

---

## Timeline

| Week | Focus | Deliverables |
|------|-------|--------------|
| **1** | Phase 1A-1C | Three-way hybrid, dense vectors, reranking, Maths KS4 ingestion |
| **2** | Phase 2A-2B | Entity extraction, Graph API, reference indices |
| **3** | Phase 3 | RAG infrastructure, ES Playground, chunked transcripts |
| **4** | Phase 4 | Knowledge graph, triple store, entity resolution |
| **5** | Phase 5 | LTR foundations, multi-vector, polish |

**Total**: 4-5 weeks (22-29 days)

**Aggressive**: 3 weeks with parallel work  
**Conservative**: 6 weeks with thorough validation

---

## Next Steps

### Immediate (Day 1)

1. Re-read foundation documents
2. Review `maths-ks4-es-serverless-complete.md`
3. Study `phase-1a-implementation-guide.md`
4. Set up OpenAI API key
5. Begin Phase 1A: Write inference endpoint tests (RED)

### Week 1 Goals

- [ ] Phase 1A complete (three-way hybrid)
- [ ] Phase 1B complete (reranking)
- [ ] Phase 1C complete (Maths KS4 ingested)
- [ ] 5 ADRs written
- [ ] 40+ tests passing
- [ ] 5 docs created

### Success Indicators

- Three-way hybrid demonstrably better than two-way
- Reranking improves top-10 results
- All quality gates passing
- Stakeholder demo ready

---

## References

### Foundation Documents (Re-read Regularly)

- `.agent/directives-and-memory/rules.md`
- `.agent/directives-and-memory/schema-first-execution.md`
- `.agent/directives-and-memory/testing-strategy.md`

### Planning Documents

- 🎯 `maths-ks4-es-serverless-complete.md` - MAIN PLAN
- 📖 `phase-1a-implementation-guide.md` - Practical guide
- 📊 `es-serverless-feature-matrix.md` - Feature tracking
- 📋 `hybrid-field-strategy.md` - Original field plan
- 📋 `phase-4-deferred-fields.md` - AI/Graph fields

### Research

- `.agent/research/elasticsearch/ai/elasticsearch_serverless_ai_kg_detailed.md`
- `.agent/research/elasticsearch/ai/graph-rag-integration-vision.md`

### Existing ADRs

- ADR-067: SDK Generated Elasticsearch Mappings
- ADR-068: Per-Index Completion Context Enforcement
- ADR-069: Systematic Ingestion Progress Tracking
- ADR-070: SDK Rate Limiting and Retry

---

## Conclusion

This enhanced plan transforms the Maths KS4 vertical slice from a basic field addition exercise into a **comprehensive showcase of Elasticsearch Serverless capabilities**. By integrating 23 additional ES features while maintaining strict adherence to foundation documents, we create:

1. **Technical Excellence** - TDD, schema-first, zero shortcuts
2. **Production Quality** - Comprehensive docs, ADRs, tests
3. **Impressive Demo** - Cutting-edge search capabilities
4. **Scalable Foundation** - Patterns applicable to full curriculum

**The plan is ambitious but achievable** with disciplined execution and regular foundation document review.

**Ready to begin Phase 1A** when you are.

---

**End of Summary**

