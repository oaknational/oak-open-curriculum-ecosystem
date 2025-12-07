# Elasticsearch Serverless Feature Integration Matrix

**Purpose**: Track ES Serverless feature adoption in Maths KS4 vertical slice  
**Last Updated**: 2025-12-08  
**Related Plan**: `maths-ks4-es-serverless-complete.md`

---

## Feature Adoption Overview

| Category | Current | Planned | Total Available | Coverage |
|----------|---------|---------|-----------------|----------|
| **Search & Retrieval** | 7 | +6 | 13 | 100% |
| **AI & ML** | 1 | +7 | 8 | 100% |
| **Knowledge & Graph** | 0 | +4 | 4 | 100% |
| **Performance** | 2 | +3 | 5 | 100% |
| **Data Enhancement** | 2 | +3 | 5 | 100% |
| **TOTAL** | **12** | **+23** | **35** | **100%** |

---

## Detailed Feature Matrix

### Search & Retrieval Features

| Feature | Status | Phase | Impact | TDD | ADR |
|---------|--------|-------|--------|-----|-----|
| **ELSER Sparse Embeddings** | ✅ Current | - | Semantic search foundation | ✅ | - |
| **BM25 Lexical Search** | ✅ Current | - | Traditional keyword matching | ✅ | - |
| **RRF (2-way)** | ✅ Current | - | Fuse lexical + sparse | ✅ | - |
| **Completion Suggesters** | ✅ Current | - | Type-ahead | ✅ | ADR-068 |
| **Unified Highlighter** | ✅ Current | - | Sentence-boundary highlighting | ✅ | - |
| **Term Vectors** | ✅ Current | - | Position/offset for highlights | ✅ | - |
| **Synonym Sets** | ✅ Current | - | 68 rules at search-time | ✅ | ADR-063 |
| **Dense Vector Fields** | 🎯 Phase 1A | HIGH | +15% relevance | ✅ | ADR-073 |
| **Three-Way RRF** | 🎯 Phase 1A | HIGH | Optimal fusion | ✅ | ADR-072 |
| **Filtered kNN** | 🎯 Phase 1B | HIGH | 50% faster constrained search | ✅ | ADR-075 |
| **Semantic Query Rules** | 🎯 Phase 1B | MEDIUM | Pattern-based boosting | ✅ | - |
| **Multi-Vector Fields** | 🎯 Phase 5 | MEDIUM | Aspect-based retrieval | ✅ | ADR-085 |
| **Runtime Fields** | 🎯 Phase 5 | LOW | Computed fields at query time | ✅ | - |

### AI & ML Integration

| Feature | Status | Phase | Impact | TDD | ADR |
|---------|--------|-------|--------|-----|-----|
| **ELSER Auto-Assign** | ✅ Current | - | Automatic sparse vectors | ✅ | - |
| **Inference API** | 🎯 Phase 1A | HIGH | External AI models | ✅ | ADR-071 |
| **OpenAI Embeddings** | 🎯 Phase 1A | HIGH | Dense vectors via API | ✅ | ADR-071 |
| **Cohere ReRank** | 🎯 Phase 1B | HIGH | +10-25% relevance | ✅ | ADR-074 |
| **NER Models** | 🎯 Phase 2A | HIGH | Entity extraction | ✅ | ADR-076 |
| **semantic_text Field** | 🎯 Phase 3 | HIGH | Auto-chunking + embeddings | ✅ | ADR-081 |
| **LLM Chat Completion** | 🎯 Phase 3 | MEDIUM | RAG answer generation | ✅ | ADR-080 |
| **Learning to Rank** | 🎯 Phase 5 | MEDIUM | Personalized relevance | ✅ | ADR-084 |

### Knowledge & Graph

| Feature | Status | Phase | Impact | TDD | ADR |
|---------|--------|-------|--------|-----|-----|
| **Graph API** | 🎯 Phase 2A | HIGH | Co-occurrence relationships | ✅ | ADR-077 |
| **Significant Terms** | 🎯 Phase 2A | MEDIUM | Discover associations | ✅ | ADR-077 |
| **Triple Store** | 🎯 Phase 4 | HIGH | Explicit relationships | ✅ | ADR-082 |
| **Entity Resolution** | 🎯 Phase 4 | HIGH | Canonical entities | ✅ | ADR-083 |

### Performance Optimization

| Feature | Status | Phase | Impact | TDD | ADR |
|---------|--------|-------|--------|-----|-----|
| **Index Aliases** | ✅ Current | - | Zero-downtime updates | ✅ | - |
| **Bulk API** | ✅ Current | - | Efficient batch indexing | ✅ | ADR-069 |
| **Filtered kNN** | 🎯 Phase 1B | HIGH | 50% faster | ✅ | ADR-075 |
| **Query Vector Builder** | 🎯 Phase 1A | MEDIUM | Dynamic embedding gen | ✅ | ADR-071 |
| **ILM Policies** | 🎯 Phase 5 | LOW | Automated data lifecycle | ✅ | - |

### Data Enhancement

| Feature | Status | Phase | Impact | TDD | ADR |
|---------|--------|-------|--------|-----|-----|
| **Schema Generation** | ✅ Current | - | Type-safe mappings | ✅ | ADR-067 |
| **Zod Validation** | ✅ Current | - | Runtime safety | ✅ | ADR-067 |
| **Enrich Processor** | 🎯 Phase 2A | HIGH | Join reference data | ✅ | ADR-078 |
| **Ingest Pipelines** | 🎯 Phase 2A | MEDIUM | Pre-processing | ✅ | ADR-078 |
| **Copy To Fields** | 🎯 Phase 5 | LOW | Unified search fields | ✅ | - |

---

## Impact Assessment by Feature

### Tier 1: Critical Impact (Must Have)

**Three-Way Hybrid Search** (Phase 1A)
- **Impact**: 15-25% relevance improvement over two-way
- **Effort**: 2-3 days
- **Dependencies**: Inference API, Dense Vectors
- **Validation**: A/B testing with human evaluators

**Cohere ReRank** (Phase 1B)
- **Impact**: Additional 10-25% boost on top results
- **Effort**: 1-2 days
- **Dependencies**: Inference API
- **Validation**: NDCG@10 improvement metrics

**NER Entity Extraction** (Phase 2A)
- **Impact**: Enables concept-based search and graph
- **Effort**: 3-4 days
- **Dependencies**: Inference API, Graph API
- **Validation**: Entity coverage >80% for Maths

**Graph API** (Phase 2A)
- **Impact**: Discover non-obvious curriculum connections
- **Effort**: 2-3 days
- **Dependencies**: None
- **Validation**: Manual review of discovered relationships

**ES Playground** (Phase 3)
- **Impact**: 10x faster RAG prototyping
- **Effort**: 1 day setup
- **Dependencies**: Inference API
- **Validation**: Successful prompt iteration

### Tier 2: High Value (Should Have)

**Filtered kNN** (Phase 1B)
- **Impact**: 50% faster filtered searches
- **Effort**: 1 day
- **Dependencies**: Dense Vectors
- **Validation**: Latency benchmarks

**Enrich Processor** (Phase 2A)
- **Impact**: Eliminates manual data joins
- **Effort**: 2 days
- **Dependencies**: Reference indices
- **Validation**: Integration tests

**semantic_text Field** (Phase 3)
- **Impact**: Eliminates custom chunking logic
- **Effort**: 1-2 days
- **Dependencies**: Inference API
- **Validation**: Chunk quality assessment

**LLM Chat Completion** (Phase 3)
- **Impact**: Enables RAG Q&A
- **Effort**: 2-3 days
- **Dependencies**: ES Playground
- **Validation**: Answer accuracy tests

### Tier 3: Enhancement (Nice to Have)

**Multi-Vector Fields** (Phase 5)
- **Impact**: Aspect-based retrieval (title vs content)
- **Effort**: 2 days
- **Dependencies**: Dense Vectors
- **Validation**: Relevance improvements for specific query types

**Learning to Rank** (Phase 5)
- **Impact**: Personalized relevance over time
- **Effort**: 3-4 days (foundations only)
- **Dependencies**: Click-through data
- **Validation**: Long-term A/B testing

---

## Cost-Benefit Analysis

### API Costs (Estimated)

| Feature | Cost per 1K Tokens | Maths KS4 Cost | Monthly Cost (All) |
|---------|-------------------|----------------|-------------------|
| **OpenAI Embeddings** | $0.00002 | ~$2 | ~$40 |
| **Cohere ReRank** | $0.002 | ~$10 | ~$200 |
| **NER Models (HF)** | $0.0001 | ~$1 | ~$20 |
| **GPT-4 Chat** | $0.01 | ~$50 (100 queries) | ~$1000 (20K queries) |
| **TOTAL** | - | ~$63 | ~$1,260 |

**Notes**:
- Embedding costs are one-time (ingest only)
- ReRank cost per query (controllable)
- GPT-4 depends on usage volume
- Can reduce costs with caching and batch processing

### Performance Impact

| Feature | Latency Change | Throughput Change | Storage Change |
|---------|----------------|-------------------|----------------|
| **Dense Vectors** | +50ms | -10% | +20% (1536-dim) |
| **Cohere ReRank** | +100ms | -20% | 0% |
| **Three-Way Hybrid** | +20ms | -5% | 0% |
| **NER Extraction** | +200ms (ingest only) | N/A | +5% |
| **Graph API** | +50ms | -15% | 0% |

**Mitigation Strategies**:
- Cache embeddings for common queries
- Async processing for NER extraction
- Two-stage retrieval (fast candidates → precise rerank)
- Filtered kNN to offset dense vector overhead

### Development Effort

| Phase | Days | Features | ADRs | Tests | Docs |
|-------|------|----------|------|-------|------|
| **1A** | 2-3 | 3 | 3 | 20+ | 3 |
| **1B** | 2-3 | 3 | 2 | 15+ | 2 |
| **1C** | 1 | - | 0 | - | - |
| **2A** | 3-4 | 4 | 3 | 25+ | 3 |
| **2B** | 2-3 | 5 | 1 | 10+ | 2 |
| **3** | 4-5 | 3 | 2 | 20+ | 3 |
| **4** | 5-6 | 2 | 2 | 30+ | 2 |
| **5** | 3-4 | 5 | 2 | 15+ | 2 |
| **TOTAL** | **22-29** | **25** | **15** | **135+** | **17** |

---

## Validation Metrics

### Search Quality

| Metric | Baseline | Target | Measurement Method |
|--------|----------|--------|-------------------|
| **MRR (Mean Reciprocal Rank)** | 0.65 | 0.80 | Human-labeled test set (100 queries) |
| **NDCG@10** | 0.70 | 0.85 | Relevance judgments |
| **Zero-Hit Rate** | 15% | <5% | Query analytics |
| **Click-Through Rate** | 30% | >50% | Usage tracking |

### Performance

| Metric | Current | Target | Measurement Method |
|--------|---------|--------|-------------------|
| **p50 Latency** | 80ms | <100ms | APM monitoring |
| **p95 Latency** | 200ms | <300ms | APM monitoring |
| **p99 Latency** | 500ms | <600ms | APM monitoring |
| **Throughput** | 100 q/s | >80 q/s | Load testing |

### Coverage

| Metric | Current | Target | Measurement Method |
|--------|---------|--------|-------------------|
| **Dense Vector Coverage** | 0% | >95% | Index statistics |
| **Entity Extraction Coverage** | 0% | >80% | Validation sample |
| **Graph Relationship Count** | 0 | >500 | Graph API queries |
| **RAG Answer Accuracy** | N/A | >80% | Human evaluation |

---

## Risk Assessment

### High Risk

1. **OpenAI API Dependency**
   - **Risk**: Service outages affect search
   - **Mitigation**: Graceful degradation to two-way hybrid, caching
   - **Likelihood**: Low | **Impact**: Medium

2. **Cost Escalation**
   - **Risk**: Unexpected API usage
   - **Mitigation**: Budget alerts, rate limiting, usage monitoring
   - **Likelihood**: Medium | **Impact**: Medium

3. **Latency Regression**
   - **Risk**: Too many features slow search
   - **Mitigation**: Performance testing, feature flags, two-stage retrieval
   - **Likelihood**: Medium | **Impact**: High

### Medium Risk

4. **Entity Extraction Accuracy**
   - **Risk**: NER produces poor quality entities
   - **Mitigation**: Manual validation, confidence thresholds
   - **Likelihood**: Medium | **Impact**: Medium

5. **Complexity Burden**
   - **Risk**: Too many features hard to maintain
   - **Mitigation**: Comprehensive docs, ADRs, TDD
   - **Likelihood**: Medium | **Impact**: Medium

### Low Risk

6. **Feature Adoption**
   - **Risk**: Users don't leverage advanced features
   - **Mitigation**: Clear documentation, demos, UI hints
   - **Likelihood**: Low | **Impact**: Low

---

## Success Criteria Summary

### Technical

- [ ] All 23 planned features integrated
- [ ] 15 new ADRs written
- [ ] 135+ new tests passing
- [ ] 17 new docs created
- [ ] Zero type shortcuts
- [ ] All quality gates passing

### Business

- [ ] Search relevance improved by >25%
- [ ] Demo impresses stakeholders
- [ ] Production-ready code quality
- [ ] Scalable to full curriculum
- [ ] Under $100/month operational cost

### User Experience

- [ ] Sub-300ms p95 search latency
- [ ] <5% zero-hit rate
- [ ] >80% RAG answer accuracy
- [ ] Clear value demonstration
- [ ] Intuitive feature discovery

---

**End of Feature Matrix**

This matrix will be updated as features are implemented. Current progress tracked in `maths-ks4-es-serverless-complete.md`.

