# Phase 3+: Future Roadmap

**Status**: 📋 PLANNED  
**Last Updated**: 2025-12-10

---

## Overview

These phases add advanced features **only after** Phase 1/2 establish a solid baseline. Each phase should be validated before adding complexity.

---

## Phase 3: Relevance Enhancement (2-3 days)

### Features

1. **Elastic Native ReRank** (`.rerank-v1-elasticsearch`)
   - Cross-encoder model for top-K reranking
   - Expected MRR improvement: +10-25%

2. **Filtered kNN**
   - Apply filters during vector search (not post-filter)
   - 50% faster for constrained searches

3. **Semantic Query Rules**
   - Pattern-based query rewriting
   - Example: "pythagoras" → add tier:higher filter

### Success Criteria

- [ ] ReRank integrated and tested
- [ ] Filtered kNN with benchmarks
- [ ] 5+ semantic query rules defined
- [ ] ADRs written

---

## Phase 4: Entity Extraction & Graph (3-4 days)

### Features

1. **NER Models** (Hugging Face via ES Inference API)
   - Extract curriculum entities from transcripts
   - Entity types: CONCEPT, TOPIC, SKILL

2. **Graph API Discovery**
   - Find co-occurring concepts
   - Build concept relationship graph

3. **Enrich Processor**
   - Join reference data at ingest time

### Success Criteria

- [ ] NER extracting entities from >80% lessons
- [ ] Graph API discovering >20 relationships
- [ ] ADRs written

---

## Phase 5: Reference Indices & Threads (2-3 days)

### New Indices

| Index                      | Purpose                        |
| -------------------------- | ------------------------------ |
| `oak_ref_subjects`         | Subject metadata               |
| `oak_ref_key_stages`       | Key stage metadata             |
| `oak_curriculum_glossary`  | Keywords with definitions      |
| `oak_curriculum_standards` | National curriculum statements |

### Features

- Thread-based navigation
- Prior knowledge requirements indexing
- National curriculum content search

### Success Criteria

- [ ] Reference indices created
- [ ] Thread filtering working
- [ ] Standards-aligned search enabled

---

## Phase 6: RAG Infrastructure (4-5 days)

### Features

1. **ES Playground** - Low-code RAG prototyping
2. **`semantic_text` Field** - Auto-chunking transcripts
3. **LLM Chat Completion** - Elastic Native LLM integration
4. **Ontology Grounding** - Domain knowledge enhancement

### Success Criteria

- [ ] Chunked transcripts indexed
- [ ] RAG endpoint implemented
- [ ] Ontology index created

---

## Phase 7: Knowledge Graph (5-6 days)

### Features

1. **Triple Store** (`oak_curriculum_graph`)
   - Subject-predicate-object triples
   - Explicit and inferred relationships

2. **Entity Resolution**
   - Deduplicate entities across lessons
   - Canonical entity IDs

3. **Multi-Hop Reasoning**
   - Find learning pathways
   - Prerequisite chains

### Success Criteria

- [ ] Triple store populated
- [ ] Entity resolution >90% precision
- [ ] Multi-hop queries working

---

## Phase 8: Advanced Features (3-4 days)

### Features

1. **Learning to Rank (LTR) Foundations**
   - Click-through data collection
   - Feature extraction for future model training

2. **Multi-Vector Fields**
   - Title + summary + key points as separate vectors
   - Aspect-based retrieval

3. **Runtime Fields**
   - Computed fields at query time
   - Custom relevance scoring

### Success Criteria

- [ ] Click tracking implemented
- [ ] Multi-vector fields tested
- [ ] Runtime field patterns documented

---

## Timeline Estimate

| Phase | Focus                       | Duration |
| ----- | --------------------------- | -------- |
| 3     | Relevance Enhancement       | 2-3 days |
| 4     | Entity Extraction & Graph   | 3-4 days |
| 5     | Reference Indices & Threads | 2-3 days |
| 6     | RAG Infrastructure          | 4-5 days |
| 7     | Knowledge Graph             | 5-6 days |
| 8     | Advanced Features           | 3-4 days |

**Total**: ~4-5 weeks (aggressive: 3 weeks with parallel work)

---

## Guiding Principles

1. **Validate before adding complexity**
2. **Measure impact of each phase**
3. **Document decisions in ADRs**
4. **All quality gates must pass**
5. **First Question**: Could it be simpler?
