# Semantic Search Plans Deep Review

_Date: 2025-12-04_
_Status: RESEARCH COMPLETE_

## Executive Summary

A deep review of the semantic search plans in `.agent/plans/semantic-search/` reveals that **significant progress has been made** since those plans were written on 2025-11-11. The repository has evolved substantially, with the **schema-first migration largely complete** and comprehensive MCP tool generation now in place. However, **key ontology features remain unimplemented**, and **new Elasticsearch MCP server capabilities** present architectural opportunities not considered in the original plans.

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

**Search App Migration**:

- `src/types/oak.ts` now **re-exports everything from SDK** (`@oaknational/oak-curriculum-sdk/public/search.js`)
- Zero local Zod schema definitions for search functionality
- API routes import schemas from SDK
- Fixtures use SDK factory functions

**Evidence**: Running `grep "export const.*Schema = z\.object"` on the search app returns only 2 matches (env.ts and a scaffolding script), confirming runtime schemas have been eliminated.

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

Four indices are defined with mappings:

- `oak_lessons` - Lesson documents with transcript, semantic text, completion suggestions
- `oak_units` - Basic unit documents
- `oak_unit_rollup` - Aggregated unit text for semantic search
- `oak_sequences` - Sequence documents

---

### What Remains Unimplemented ❌

#### 1. Thread Index and Fields (Phase 2) - NOT STARTED

**Original Plan**: Create `oak_threads` index and add thread fields to all documents.

**Current State**:

- NO `oak_threads` index exists
- NO thread fields in any index document schemas
- NO thread search scope (`'threads'` not in `SEARCH_SCOPES`)
- SDK has `get-threads` and `get-threads-units` tools, but search app doesn't use them

**Missing Fields** (from original plan):

```typescript
interface ThreadFields {
  thread_slugs: string[];
  thread_titles: string[];
  thread_orders: number[];
}
```

#### 2. Programme Factor Fields (Phase 2) - NOT STARTED

**Original Plan**: Add programme context filtering (tier, exam board, pathway).

**Current State**:

- NO programme factor fields in any index documents
- NO tier/exam_board/pathway filtering in search requests
- `SearchStructuredRequestSchema` only has: `scope`, `text`, `subject`, `keyStage`, `minLessons`, `size`, `includeFacets`, `phaseSlug`, `from`, `highlight`

**Missing Fields** (from original plan):

```typescript
interface ProgrammeFactorFields {
  programme_slugs: string[];
  phase?: 'primary' | 'secondary';
  pathway?: 'core' | 'gcse';
  exam_board?: 'aqa' | 'ocr' | 'edexcel' | 'eduqas' | 'edexcelb';
  exam_subject?: string;
  tier?: 'foundation' | 'higher';
  parent_subject?: string;
}
```

#### 3. Unit Type Classification (Phase 3) - NOT STARTED

**Original Plan**: Classify units as simple/variant/optionality.

**Current State**:

- NO unit type fields in `SearchUnitsIndexDocSchema`
- NO classification logic
- NO filtering by unit type

**Missing Fields**:

```typescript
interface UnitClassification {
  unit_type: 'simple' | 'variant' | 'optionality';
  has_variants: boolean;
  has_optionality: boolean;
}
```

#### 4. Structured Content Guidance (Phase 3) - NOT STARTED

**Original Plan**: Replace simple content guidance array with structured categories.

**Current State**:

- `SearchLessonsIndexDocSchema` has `content_guidance: z.array(z.string())` (flat array)
- NO supervision level field
- NO category structure

**Missing Fields**:

```typescript
interface ContentGuidanceStructured {
  resources: string[];
  pupil: string[];
  classroom: string[];
  overarching: string[];
}
supervision_level?: 1 | 2 | 3 | 4;
```

#### 5. Lesson Component Availability (Phase 3) - NOT STARTED

**Original Plan**: Boolean flags for each lesson component type.

**Current State**:

- NO component availability fields in `SearchLessonsIndexDocSchema`
- Cannot filter by "lessons with video" or "lessons with worksheet"

**Missing Fields**:

```typescript
interface LessonComponentAvailability {
  has_slide_deck: boolean;
  has_video: boolean;
  has_starter_quiz: boolean;
  has_exit_quiz: boolean;
  has_worksheet: boolean;
  has_transcript: boolean;
  has_additional_materials: boolean;
  has_supplementary_materials: boolean;
}
```

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

### Priority 2: Consolidate Thread/Ontology Work

The original three-phase approach (Phase 1: Schema Migration, Phase 2: Core Ontology, Phase 3: Ontology Enrichment) should be **collapsed**:

- Phase 1 is COMPLETE
- Phases 2 and 3 should be **re-planned as a single phase** focused on ontology enrichment

### Priority 3: Evaluate Elastic MCP Integration

Create an architectural decision record (ADR) to:

1. Evaluate Elastic Agent Builder MCP vs custom implementation
2. Document trade-offs
3. Decide on integration approach

### Priority 4: Update Timeline

Original timeline (6-8 weeks from 2025-11-11) has passed. New timeline needed reflecting:

- Completed work
- Remaining ontology features
- Elastic MCP evaluation

---

## Files Requiring Updates

| File                                                     | Status             | Action                                           |
| -------------------------------------------------------- | ------------------ | ------------------------------------------------ |
| `semantic-search-overview.md`                            | OUTDATED           | Update current state, mark Phase 1 complete      |
| `search-schema-inventory.md`                             | OBSOLETE           | Archive or rewrite for remaining gaps only       |
| `search-migration-map.md`                                | COMPLETE           | Move to archive                                  |
| `search-generator-spec.md`                               | PARTIALLY COMPLETE | Update to reflect what's done, specify remaining |
| `search-service/schema-first-ontology-implementation.md` | OUTDATED           | Update sessions, mark Phase 1 done               |
| `search-ui/frontend-implementation.md`                   | PARTIALLY OUTDATED | Remove ontology UI that depends on backend       |

---

## Summary

The semantic search plans represent solid architectural thinking that has been **partially executed**. The schema-first migration is essentially complete, which is a major achievement. The remaining work focuses on **ontology enrichment** (threads, programme factors, unit types, content guidance, component availability).

The emergence of Elastic Agent Builder MCP server is a **new architectural consideration** that should be evaluated before proceeding with further MCP integration work.

**Recommended Next Steps**:

1. Archive completed plan sections
2. Create consolidated ontology implementation plan
3. Evaluate Elastic MCP integration
4. Update timelines and dependencies
