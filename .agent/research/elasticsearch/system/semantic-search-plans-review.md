# Semantic Search Plans Deep Review

_Date: 2025-12-04 (updated 2026-01-01)_
_Status: RESEARCH UPDATED_

## Executive Summary

A deep review of the semantic search plans in `.agent/plans/semantic-search/` shows that **most foundational work is complete** and the system has shifted to a **CLI/SDK-only model** (hosted API routes are retired). As of 2026-01-01, the **schema-first migration is complete**, **threads and programme factor fields are implemented**, and the **hybrid retrieval pipeline uses RRF with BM25 + ELSER**. Remaining gaps are now concentrated in **ontology/graph indexing**, **structured content guidance**, **component availability flags**, **unit classification**, and **production observability wiring**.

---

## Current State vs. Original Plans

### What Has Been Completed ✅

#### 1. Schema-First Migration (Phase 1) - COMPLETE

The original plans documented ~2,000 LOC of runtime schema definitions that needed migration. This work is **substantially complete**:

**SDK Generated Types** (`packages/sdks/oak-curriculum-sdk/src/types/generated/search/`):

- `requests.ts` - `SearchStructuredRequestSchema`, `isSearchStructuredRequest()`
- `natural-requests.ts` - `SearchNaturalLanguageRequestSchema`, `isSearchNaturalLanguageRequest()`
- `parsed-query.ts` - `SearchParsedQuerySchema`, `isSearchParsedQuery()`
- `scopes.ts` - `SEARCH_SCOPES`, `SEARCH_SCOPES_WITH_ALL`, guards
- `suggestions.ts` - `SearchSuggestionRequestSchema`, `SearchSuggestionResponseSchema`, etc.
- `responses.lessons.ts` - `SearchLessonsResponseSchema`
- `responses.units.ts` - `SearchUnitsResponseSchema`
- `responses.sequences.ts` - `SearchSequencesResponseSchema`
- `responses.multi.ts` - `SearchMultiScopeResponseSchema`
- `index-documents.ts` - All index document schemas with guards
- `facets.ts` - `SearchFacets`, `SequenceFacet`, `SequenceFacetUnit`
- `fixtures.ts` - Factory functions for test fixtures

**CLI/SDK Integration**:

- `src/types/oak.ts` now **re-exports everything from SDK** (`@oaknational/oak-curriculum-sdk/public/search.js`)
- Zero local Zod schema definitions for search functionality
- CLI ingestion/setup imports SDK mappings and synonyms (no hosted API routes)

**Evidence**: Running `grep "export const.*Schema = z\.object"` on the semantic search workspace returns only 2 matches (env.ts and a scaffolding script), confirming runtime schemas have been eliminated.

#### 2. MCP Tool Generation - COMPLETE

The SDK now generates **26 MCP tools** at type-gen time with full type safety:

```
get-changelog, get-changelog-latest, get-key-stages, get-key-stages-subject-assets,
get-key-stages-subject-lessons, get-key-stages-subject-questions, get-key-stages-subject-units,
get-lessons-assets, get-lessons-assets-by-type, get-lessons-quiz, get-lessons-summary,
get-lessons-transcript, get-rate-limit, get-search-lessons, get-search-transcripts,
get-sequences-assets, get-sequences-questions, get-sequences-units, get-subject-detail,
get-subjects, get-subjects-key-stages, get-subjects-sequences, get-subjects-years,
get-threads, get-threads-units, get-units-summary
```

Each tool has:

- Generated descriptor with args/result types
- Generated stub responses for testing
- Operation ID mapping
- Type-safe execution helpers

#### 3. Elasticsearch Index Infrastructure - OPERATIONAL

Core indices are defined with mappings:

- `oak_lessons` - Lesson documents with transcript, semantic text, completion suggestions
- `oak_units` - Unit documents
- `oak_unit_rollup` - Aggregated unit text for semantic search
- `oak_sequences` - Sequence documents
- `oak_sequence_facets` - Sequence facet index for navigation
- `oak_threads` - Thread documents
- `oak_meta` - Index metadata

---

### What Remains Unimplemented / Partially Implemented

#### 1. Ontology/graph index - NOT STARTED

**Gap**: No dedicated ontology index for concepts, relationships, and graph traversal.

#### 2. Structured content guidance - NOT STARTED

**Gap**: `content_guidance` remains a flat array. Structured categories (resources, pupil, classroom, overarching) are not implemented.

#### 3. Lesson component availability flags - PARTIAL

**Gap**: `downloads_available` and `has_transcript` exist, but per-component flags (video, slide deck, quizzes, worksheets) are still missing.

#### 4. Unit classification fields - NOT STARTED

**Gap**: No `unit_type` or `has_variants/has_optionality` fields in search documents.

#### 5. Production observability wiring - PARTIAL

**Gap**: Zero-hit persistence and ingestion metrics exist in code, but need verified wiring and operational dashboards.

---

## New Considerations Not in Original Plans

### 1. Elastic Agent Builder MCP Server

**Discovery**: Elasticsearch 9.2+ and Serverless now provide a native MCP server endpoint at `{KIBANA_URL}/api/agent_builder/mcp`.

**Implications**:

- Could potentially leverage Elastic's built-in MCP tools instead of custom implementation
- Native RAG, semantic search, and tool capabilities
- Would require Kibana deployment (we currently use Serverless ES directly)

**Recommendation**: Evaluate whether Elastic Agent Builder MCP aligns with our architecture. If we use Kibana anyway, this could simplify MCP integration. However, our current schema-first approach with generated tools from OpenAPI may provide better type safety.

### 2. mcp-server-elasticsearch Package

**Discovery**: `elastic/mcp-server-elasticsearch` provides MCP server for older ES versions.

**Implications**: Could be used as reference implementation for MCP-Elasticsearch patterns.

### 3. Observability Integration

**Current State**: Logger Sentry & OpenTelemetry integration plan exists but implementation is marked as 🚧 Planned.

**Recommendation**: Coordinate with logger integration work before adding more search observability.

---

## Recommended Plan Updates

### Priority 1: Update Schema Inventory (Documentation)

The `search-schema-inventory.md` is now **outdated**. It documents runtime schemas that no longer exist. Should be updated to reflect SDK-generated state and remaining gaps.

### Priority 2: Consolidate Ontology + Enrichment Work

The original three-phase approach (Phase 1: Schema Migration, Phase 2: Core Ontology, Phase 3: Ontology Enrichment) should be **collapsed**:

- Phase 1 is COMPLETE
- Phase 2 and Phase 3 should be **re-planned as a single phase** focused on ontology indexing and remaining enrichment gaps

### Priority 3: Evaluate Elastic MCP Integration (Optional)

Create an architectural decision record (ADR) to:

1. Evaluate Elastic Agent Builder MCP vs custom implementation
2. Document trade-offs
3. Decide on integration approach

### Priority 4: Update Timeline

Original timeline (6-8 weeks from 2025-11-11) has passed. New timeline needed reflecting:

- Completed work
- Remaining ontology and enrichment features
- Elastic MCP evaluation

---

## Files Requiring Updates

| File                                                     | Status             | Action                                                     |
| -------------------------------------------------------- | ------------------ | ---------------------------------------------------------- |
| `semantic-search-overview.md`                            | OUTDATED           | Update current state, note CLI/SDK-only                    |
| `search-schema-inventory.md`                             | OBSOLETE           | Archive or rewrite for remaining gaps only                 |
| `search-migration-map.md`                                | COMPLETE           | Move to archive                                            |
| `search-generator-spec.md`                               | PARTIALLY COMPLETE | Update to reflect what's done, specify remaining           |
| `search-service/schema-first-ontology-implementation.md` | OUTDATED           | Update sessions, note ontology/indexing gap                |
| `search-ui/frontend-implementation.md`                   | OUTDATED           | Retire (hosted UI and API routes are no longer in scope)   |

---

## Summary

The semantic search plans represent solid architectural thinking that has been **mostly executed**. The schema-first migration is complete, threads and programme factors are implemented, and the hybrid retrieval pipeline is mature. The remaining work focuses on **ontology indexing** and **enrichment gaps** (unit classification, structured content guidance, component availability), plus **production observability**.

The emergence of Elastic Agent Builder MCP server remains an **optional architectural consideration** if Kibana becomes a dependency.

**Recommended Next Steps**:

1. Archive completed plan sections
2. Create consolidated ontology + enrichment plan
3. Decide on MCP integration posture (SDK-in-process vs Agent Builder)
4. Update timelines and dependencies
