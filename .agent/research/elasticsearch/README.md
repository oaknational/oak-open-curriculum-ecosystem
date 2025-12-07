# Elasticsearch Research

_Last updated: 2025-12-04_

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

1. **Schema-First Migration** - All search schemas now generated from OpenAPI via `pnpm type-gen`
2. **MCP Tool Generation** - 26 tools with full type safety
3. **Elasticsearch Index Schemas** - Four index mappings defined and generated

### Critical State ⚠️

**Elasticsearch indexes are DEFINED but NOT DEPLOYED**:

- Index mappings exist in `scripts/mappings/`
- Index document schemas generated in SDK
- **NO indexes exist** on any Elasticsearch Serverless instance
- All testing has been against fixtures only
- Semantic embeddings have never been generated

### Remaining Work ❌

1. **Deploy ES Serverless Instance** - BLOCKING (CRITICAL priority)
2. **Run Initial Ingestion** - BLOCKING (CRITICAL priority)
3. **Thread Index and Fields** - Not started (HIGH priority)
4. **Programme Factor Fields** - Not started (HIGH priority)
5. **Unit Type Classification** - Not started (MEDIUM priority)
6. **Structured Content Guidance** - Not started (MEDIUM priority)
7. **Lesson Component Availability** - Not started (MEDIUM priority)
8. **Ontology Index for RAG** - Not started (MEDIUM priority)

### MCP Connectivity Options

Identified approaches for exposing semantic search:

1. **Aggregated tool in SDK** (recommended first) - Calls semantic search app
2. **Enhanced `search` tool** with `mode: semantic` parameter
3. **Direct MCP from semantic search app** (optional later)
4. **Elastic Agent Builder** (evaluate if Kibana deployed)

### New Considerations

- Elastic Agent Builder MCP server exists but doesn't align with schema-first architecture
- RAG opportunities require ontology index + content enhancements
- Knowledge graph and ontology data should be indexed for domain knowledge RAG
- Continue with current approach, re-evaluate after ontology work complete

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
