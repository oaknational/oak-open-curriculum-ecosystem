# Elasticsearch Research

_Last updated: 2025-12-11_

## Overview

This directory contains research and analysis related to Elasticsearch integration with the Oak Curriculum semantic search system.

## Documents

### Schema Analysis (NEW - 2025-12-08)

- [Curriculum Schema Field Analysis](./curriculum-schema-field-analysis.md) - **Untapped API schema fields** for enhanced search. Catalogs `priorKnowledgeRequirements`, `nationalCurriculumContent`, `threads`, `lessonKeywords[].description`, quiz data, and other pedagogical metadata. Maps fields to implementation phases.

### Natural Language Search

- [Natural Language Search with ES-Native Features](./natural-language-search-with-es-native-features.md) - Research on ES-native NLP capabilities including NER, semantic parsing, and query understanding without external APIs.

### Deep Review

- [Semantic Search Plans Review](./semantic-search-plans-review.md) - Comprehensive review of `.agent/plans/semantic-search/` comparing original plans to current implementation state. **Key finding**: Schema-first migration is complete; ontology features remain unimplemented.

### Evaluations

- [Hybrid Search and Reranking Evaluation](./hybrid-search-reranking-evaluation.md) - **Comprehensive evaluation** (2025-12-11) of two-way vs three-way hybrid search, RRF parameter tuning, and Elastic Rerank model. **Key finding**: Two-way hybrid (BM25 + ELSER) without reranking is optimal. E5 dense vectors provide no benefit; reranking on short fields degrades quality.

- [Elastic MCP Integration Evaluation](./elastic-mcp-integration-evaluation.md) - Analysis of Elastic Agent Builder MCP server and `mcp-server-elasticsearch` package vs our current generated tools approach. **Recommendation**: Continue with current schema-first generated tools.

### Gap Analysis

- [Ontology Implementation Gaps](./ontology-implementation-gaps.md) - Detailed breakdown of planned but unimplemented ontology features: threads, programme factors, unit types, content guidance, component availability.

### Expanded Architecture

- [Expanded Architecture Analysis](./expanded-architecture-analysis.md) - Deep dive into:
  - Indexing `ontology-data.ts` and `knowledge-graph-data.ts` in Elasticsearch
  - MCP connectivity options (direct from semantic search app vs aggregated tool)
  - RAG opportunities with Elasticsearch Serverless
  - Current deployment state (indexes defined but NOT populated)

## Key Findings Summary

### Completed Work ✅

1. **Schema-First Migration** - All search schemas generated from OpenAPI via `pnpm type-gen`
2. **MCP Tool Generation** - 26 tools with full type safety
3. **Elasticsearch Indexes Deployed** - Four indexes on ES Serverless with 314 Maths KS4 lessons
4. **Hybrid Search Evaluated** - Two-way hybrid (BM25 + ELSER) confirmed optimal
5. **Reranking Investigated** - Not beneficial without dedicated combined field

### Search Configuration (Production-Ready) ✅

**Two-way hybrid (BM25 + ELSER) without reranking**:

- MRR: 0.900 (target: >0.70) ✅
- NDCG@10: 0.716 (target: >0.75) ❌ 3.4% below
- Latency: 153ms (target: <300ms) ✅
- Zero-hit rate: 0% ✅

### What Didn't Work ❌

1. **E5 Dense Vectors** - Three-way hybrid provided no improvement over two-way
2. **Reranking on transcript_text** - 22+ second latency (document length issue)
3. **Reranking on lesson_title** - Degraded quality (too short for semantic signal)
4. **RRF Parameter Tuning** - Minimal impact (<1% change)

### Remaining Work

1. **Thread Index and Fields** - Not started (HIGH priority)
2. **Unit Search Reranking** - Evaluate with `rollup_text` field (MEDIUM priority)
3. **Combined Rerank Field** - Consider if NDCG gap becomes critical (LOW priority)

### Critical Learnings

- **ELSER is sufficient** - Sparse vectors capture semantic meaning effectively for curriculum content
- **Reranker field selection matters critically** - Too long = extreme latency; too short = no semantic signal
- **Cross-encoder O(n²) complexity** - Input length dominates latency, not cold starts
- **Simplest solution won** - Two-way hybrid outperformed all more complex alternatives

## Relationship to Plans

This research should inform updates to:

- `.agent/plans/semantic-search/semantic-search-overview.md` - Mark Phase 1 complete
- `.agent/plans/semantic-search/search-schema-inventory.md` - Archive or rewrite
- `.agent/plans/semantic-search/search-migration-map.md` - Move to archive
- `.agent/plans/semantic-search/search-service/schema-first-ontology-implementation.md` - Update phases

## References

### Elasticsearch Documentation (Local)

- [`.agent/reference-docs/elasticsearch/`](../../reference-docs/elasticsearch/) - Elasticsearch SDK, UI SDK, Serverless, and MCP documentation

### Plans (Local)

- [`.agent/plans/semantic-search/`](../../plans/semantic-search/) - Original semantic search planning documentation
