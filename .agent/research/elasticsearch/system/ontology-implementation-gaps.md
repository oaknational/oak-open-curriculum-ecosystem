# Ontology Implementation Gaps Analysis

_Date: 2025-12-04_
_Status: RESEARCH COMPLETE_

## Overview

This document details the specific ontology features that were planned but remain unimplemented in the semantic search system. These features are documented in the original plans but have not been executed due to the priority focus on schema-first migration.

---

## Gap 1: Thread Index and Fields

### Planned Deliverables

**New Index**: `oak_threads`

```typescript
interface SearchThreadIndexDoc {
  thread_slug: string;
  thread_title: string;
  description?: string;
  subject_slugs: string[];
  unit_count: number;
  units: Array<{
    unit_slug: string;
    unit_title: string;
    order: number;
    key_stage: string;
    year: string;
  }>;
  years_span: string[];
  key_stages_span: string[];
  progression_summary: string; // Aggregated text for semantic search
}
```

**Embedded Fields** (in lessons, units, sequences):

```typescript
interface ThreadFields {
  thread_slugs: string[];
  thread_titles: string[];
  thread_orders: number[];
}
```

**Search Scope Addition**:

```typescript
type SearchScope = 'lessons' | 'units' | 'sequences' | 'threads';
```

### Current State

- NO thread index
- NO thread fields in any document schemas
- `SEARCH_SCOPES = ['lessons', 'units', 'sequences']` - no threads
- SDK has `get-threads` and `get-threads-units` tools but unused in search

### Implementation Requirements

1. **Code-gen**: Add thread index document schema to `search/index-documents.ts`
2. **Code-gen**: Add thread fields to existing document schemas
3. **Code-gen**: Update `scopes.ts` to include 'threads'
4. **ES Mappings**: Create `oak_threads` index mapping
5. **Ingestion**: Build thread document transformer using SDK's `get-threads` API
6. **Ingestion**: Enrich lesson/unit documents with thread metadata
7. **Query Builder**: Implement thread search RRF query
8. **API**: Update search endpoint to handle thread scope
9. **UI**: Add thread scope selector and thread result cards

### Priority: HIGH

Threads are a primary navigation concept in Oak's curriculum. Teachers search by vertical progressions.

---

## Gap 2: Programme Factor Fields

### Planned Deliverables

**Fields** (in all index documents):

```typescript
interface ProgrammeFactorFields {
  programme_slugs: string[]; // All applicable programme slugs
  phase?: 'primary' | 'secondary';
  pathway?: 'core' | 'gcse';
  exam_board?: 'aqa' | 'ocr' | 'edexcel' | 'eduqas' | 'edexcelb';
  exam_subject?: 'biology' | 'chemistry' | 'physics' | 'combined-science';
  tier?: 'foundation' | 'higher';
  parent_subject?: string; // For KS4 sciences
}
```

**Request Schema Extension**:

```typescript
interface SearchFilters {
  // Existing
  subject?: string;
  keyStage?: string;

  // New
  tier?: 'foundation' | 'higher';
  exam_board?: string;
  exam_subject?: string;
  pathway?: 'core' | 'gcse';
}
```

### Current State

- NO programme factor fields in any document schemas
- `SearchStructuredRequestSchema` lacks tier/exam_board/pathway filters
- Programme factor parsing exists in SDK but not used in search ingestion

### Implementation Requirements

1. **Code-gen**: Add programme factor fields to document schemas
2. **Code-gen**: Extend `SearchStructuredRequestSchema` with filter params
3. **ES Mappings**: Add programme factor fields to all indices
4. **Ingestion**: Parse programme slugs during document transformation
5. **Query Builder**: Add filter clauses for programme factors
6. **UI**: Add tier/exam board dropdowns to filter panel

### Priority: HIGH

KS4 content requires tier and exam board filtering. Critical for GCSE subjects.

---

## Gap 3: Unit Type Classification

### Planned Deliverables

**Fields** (in unit documents):

```typescript
interface UnitClassification {
  unit_type: 'simple' | 'variant' | 'optionality';
  has_variants: boolean;
  has_optionality: boolean;
  variant_context?: string; // e.g., "tier-based", "pathway-based"
}
```

### Current State

- NO unit type fields in `SearchUnitsIndexDocSchema`
- NO classification logic implemented
- NO filtering by unit type

### Implementation Requirements

1. **Code-gen**: Add unit classification fields to unit schemas
2. **Code-gen**: Add `unit_type` filter to request schema
3. **Classification Logic**: Implement `classifyUnit()` function
   - Simple: Single lesson sequence, no unitOptions
   - Variant: unitOptions with different lessons
   - Optionality: unitOptions with teacher choice
4. **Ingestion**: Run classification during unit document transformation
5. **Query Builder**: Add unit_type filter clause
6. **UI**: Add unit type filter selector

### Priority: MEDIUM

Useful for teachers understanding curriculum flexibility, but not blocking core search functionality.

---

## Gap 4: Structured Content Guidance

### Planned Deliverables

**Replace flat array with structured object**:

```typescript
// Current
content_guidance: string[];

// Target
interface ContentGuidanceStructured {
  resources: string[];    // Equipment, materials, physical resources
  pupil: string[];        // Pupil sensitivities, topics, themes
  classroom: string[];    // Classroom environment, setup
  overarching: string[];  // Broad safeguarding, policies
}

supervision_level?: 1 | 2 | 3 | 4;
```

### Current State

- `SearchLessonsIndexDocSchema` has `content_guidance: z.array(z.string())` (flat)
- NO supervision level field
- NO category parsing logic

### Implementation Requirements

1. **Code-gen**: Define `ContentGuidanceStructured` schema
2. **Code-gen**: Add to lesson document schema
3. **Parser**: Implement `parseContentGuidance()` to categorize strings
4. **Ingestion**: Run parser during lesson transformation
5. **Query Builder**: Add supervision level filter
6. **UI**: Display categorized guidance, supervision level badge

### Priority: MEDIUM

Important for safeguarding but currently functions with flat array.

---

## Gap 5: Lesson Component Availability

### Planned Deliverables

**Boolean flags**:

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

### Current State

- NO component availability fields in `SearchLessonsIndexDocSchema`
- Cannot filter "lessons with video" or "lessons with worksheet"
- SDK's `get-lessons-assets` could provide this data

### Implementation Requirements

1. **Code-gen**: Add component availability fields to lesson schema
2. **Code-gen**: Add component filters to request schema
3. **Detection Logic**: Implement `detectComponents()` checking lesson assets
4. **Ingestion**: Fetch assets and set boolean flags
5. **Query Builder**: Add bool filter for component combinations
6. **UI**: Component filter checkboxes

### Priority: MEDIUM

Valuable for lesson planning but not blocking core search.

---

## Implementation Strategy

### Recommended Approach: Incremental Code-Gen Updates

Rather than a big-bang Phase 2/3 implementation, recommend incremental updates:

1. **Sprint A: Thread Foundation** (1-2 weeks)
   - Add thread scope to generated types
   - Create thread index mapping
   - Basic thread search (title only)
2. **Sprint B: Thread Enrichment** (1-2 weeks)
   - Thread fields in existing documents
   - Thread-aware facets
   - Thread filtering

3. **Sprint C: Programme Factors** (1-2 weeks)
   - Programme factor fields
   - Tier/exam board filtering
   - KS4 search enhancement

4. **Sprint D: Remaining Ontology** (2-3 weeks)
   - Unit type classification
   - Content guidance structure
   - Component availability

### Generator Modifications Required

All changes should flow through sdk-codegen. Key files:

```
packages/sdks/oak-sdk-codegen/code-generation/typegen/
├── search-indices/           # Index document generators
│   ├── generate-index-documents.ts
│   └── ontology-field-definitions.ts  # NEW
├── search-schemas/           # Request/response generators
│   ├── generate-request-schemas.ts
│   └── generate-response-schemas.ts
└── search/                   # Scope and fixture generators
    └── generate-scopes.ts
```

### Quality Gate Validation

After each sprint:

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm lint -- --fix
pnpm format:root
pnpm test
```

---

## Dependencies

### SDK Data Availability

| Feature                | SDK API                            | Available |
| ---------------------- | ---------------------------------- | --------- |
| Threads                | `get-threads`, `get-threads-units` | ✅        |
| Programme factors      | Parsed from programme slugs        | ✅        |
| Unit type              | Inferred from unitOptions          | ✅        |
| Content guidance       | Lesson metadata                    | ✅        |
| Component availability | `get-lessons-assets`               | ✅        |

All ontology data is accessible through existing SDK tools. No upstream API changes required.

### Infrastructure Dependencies

- ES Serverless instance (existing)
- No Kibana required
- No new external services

---

## Risks

1. **Index Reingestion** - Adding new fields requires full reindex
   - Mitigation: Use index aliases, blue-green swap

2. **Schema Complexity** - More fields = more validation
   - Mitigation: Comprehensive type guards, test coverage

3. **Performance** - More fields may impact query speed
   - Mitigation: Benchmark with production-like data volume

---

## Metrics for Success

| Metric                  | Target                               |
| ----------------------- | ------------------------------------ |
| Thread search available | `scope: 'threads'` works             |
| Tier filtering          | Filter KS4 by foundation/higher      |
| Exam board filtering    | Filter by AQA/OCR/etc                |
| Unit type filtering     | Filter by simple/variant/optionality |
| Component filtering     | Filter by video/worksheet/quiz       |
| All schemas generated   | Zero runtime schema definitions      |
| Quality gates pass      | All gates green                      |

---

## Next Steps

1. **Prioritize** with stakeholders (threads vs programme factors first?)
2. **Create tickets** for each sprint
3. **Begin Sprint A** with thread scope addition
4. **Validate** after each sprint before proceeding
