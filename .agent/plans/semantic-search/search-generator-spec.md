# Search Schema Generator Specification

_Last updated: 2025-12-05_  
_Status: ✅ COMPLETE - Unified field definitions architecture implemented_

## Purpose

This document describes the compile-time artifacts emitted by the Oak Curriculum SDK for semantic search. All schemas are now generated via `pnpm type-gen` under `packages/sdks/oak-curriculum-sdk/src/types/generated/search/`.

**Status**: All artifacts specified in this document have been implemented and are in production use.

## Source of Truth

- Open Curriculum OpenAPI document (`packages/sdks/oak-curriculum-sdk/schema-cache/api-schema-original.json`).
- Existing SDK type generation framework (`packages/sdks/oak-curriculum-sdk/type-gen/*`), which already produces API client types and the `SearchFacets` interfaces under `src/types/generated/search`.
- ADR “038-compilation-time-revolution” for compile-time generation boundaries.

## Target Outputs

### 1. Structured Search Requests & Responses

| Runtime Construct                                                 | Desired Generator Output                                                                                                                      | Notes                                                                                                                                                                                              |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SearchRequest` Zod schema (`app/ui/structured-search.shared.ts`) | `SearchStructuredRequestSchema` (Zod) + `SearchStructuredRequest` (type)                                                                      | Derived from OpenAPI `StructuredQuery` request body. Should live in `search/structured.ts` and include `.openapi()` metadata for reuse in docs.                                                    |
| `HybridResponseSchema` + per-scope result shapes                  | `HybridResponseSchema`, `HybridLessonsResponseSchema`, `HybridUnitsResponseSchema`, `HybridSequencesResponseSchema` (Zod) + matching TS types | Mirror `components.schemas` for search responses (lessons/units/sequences). Reuse existing generated `SearchFacets` interface; expose aggregator field types instead of `Record<string, unknown>`. |
| `MultiScopeHybridResponseSchema` & bucket schema                  | `HybridMultiScopeResponseSchema` (Zod) + types for bucket entries                                                                             | Compose from the per-scope response schemas with `scope: 'all'`. Should include default suggestion cache resolution driven by schema metadata rather than hard-coded `DEFAULT_SUGGESTION_CACHE`.   |
| `StructuredBody` interface                                        | Superseded by `SearchStructuredRequest` export from generator.                                                                                |                                                                                                                                                                                                    |
| `HybridSearchMeta` (src/lib/hybrid-search/types.ts)               | Derived structural type from schema generation (e.g. `HybridResponseMeta`) to eliminate duplicate interface declarations.                     |                                                                                                                                                                                                    |

### 2. Suggestion Contracts

| Runtime Construct                                          | Desired Output                                                               | Notes                                                                                                          |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `SuggestBodySchema` (API) + `SuggestionRequestSchema` (UI) | `SearchSuggestionRequestSchema` (Zod) + `SearchSuggestionRequest` type       | Input derived from OpenAPI suggestion endpoint request. Should enforce `limit` bounds and filter enumerations. |
| `SuggestionItemSchema` & `SuggestionResponseSchema`        | `SearchSuggestionItemSchema`, `SearchSuggestionResponseSchema` (Zod) + types | Should align with OpenAPI `SuggestionResponse`, including cache metadata.                                      |
| UI-only `SuggestionItem`/`SuggestionContext` interfaces    | Replace with generated types imported from SDK.                              |                                                                                                                |

### 3. Natural Language Search

| Runtime Construct                 | Desired Output                                                               | Notes                                                                                           |
| --------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `BodySchema` for `/api/search/nl` | `SearchNaturalLanguageRequestSchema` (Zod) + type                            | Based on OpenAPI NL endpoint definition. Must include optional scope/filters/minLessons fields. |
| Natural search response reuse     | Should reuse `HybridResponseSchema` export without redefining union locally. |                                                                                                 |

### 4. Query Parser Output

| Runtime Construct                  | Desired Output                         | Notes                                                                                                                                                                                                                                                                                                     |
| ---------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ParsedQuerySchema` (LLM response) | `SearchParsedQuerySchema` (Zod) + type | Should be generated alongside request schemas to keep intent/subject/keyStage enumerations aligned. For now, schema is not part of the OpenAPI contract; generator should derive from internal schema definition maintained within SDK (e.g. create `packages/.../openapi-extensions/searchParsedQuery`). |

### 5. Controller & View Helpers

| Runtime Construct                                | Desired Output                                                                                                                                                         | Notes                                                                  |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `SearchScope` / `SearchScopeWithAll` unions      | `SearchScope` enum/union generated from OpenAPI enumerations                                                                                                           | Provide typed literal union plus helper arrays (e.g. `SEARCH_SCOPES`). |
| `StructuredPayloadSchema` extension (controller) | Replace by combination of generated `HybridResponseSchema` and `SearchSuggestionItemSchema`; no bespoke extension necessary once suggestion arrays included in schema. |                                                                        |
| `ItemSchema` (SearchResults)                     | Provide typed view helpers by reusing generated result types, removing redundant Zod parsing.                                                                          |                                                                        |

### 6. Fixture Builders

- Emit typed factory helpers from the SDK for constructing deterministic fixtures:
  - `createHybridLessonResult`, `createHybridUnitResult`, `createHybridSequenceResult` – strongly typed constructors built atop generated types.
  - `createHybridResponse`, `createMultiScopeHybridResponse` – accept partial overrides and enforce schema defaults.
  - Provide deep-freeze utilities or readonly wrappers to ensure immutability by default.
- Generate Zod safeParse helpers (or re-export the schemas) so fixtures can validate outputs without in-app schema duplication.

### 7. Search Index Metadata

- Generate `SearchIndexKind` and `SearchIndexTarget` unions from configuration documented in OpenAPI (if available) or maintain small curated map in SDK.
- Emit helper guard `coerceSearchIndexTarget` to avoid local implementations.

### 8. Zod Guard Utilities

- For every schema exported, generate matching type guard functions (e.g. `isSearchSuggestionResponse(value: unknown): value is SearchSuggestionResponse`). This enables runtime validation without duplicating `safeParse` logic in the app.

## File Layout ✅ IMPLEMENTED

```text
src/types/generated/search/
  facets.ts                 # ✅ Search facet types
  fixtures.ts               # ✅ Test fixture builders
  index-documents.ts        # ✅ Elasticsearch document schemas
  index.ts                  # ✅ Barrel exports
  natural-requests.ts       # ✅ Natural language search requests
  parsed-query.ts           # ✅ Query parser output types
  requests.ts               # ✅ Structured search request schemas
  responses.lessons.ts      # ✅ Lesson search responses
  responses.multi.ts        # ✅ Multi-scope composition
  responses.sequences.ts    # ✅ Sequence search responses
  responses.units.ts        # ✅ Unit search responses
  scopes.ts                 # ✅ Search scope enumerations
  suggestions.ts            # ✅ Suggestion contracts
```

Each module exports both Zod schemas and TypeScript types. Generated files include `// GENERATED FILE - DO NOT EDIT` headers.

## Generation Pipeline Requirements

1. Extend `typegen-core` to select the relevant OpenAPI paths/components:
   - `/search/lessons`, `/search/units`, `/search/sequences`, `/search/suggest`, `/search/nl`.
   - Components: `LessonResult`, `UnitResult`, `SequenceResult`, `StructuredQuery`, `NaturalLanguageBody`, `SuggestionRequest`, `SuggestionResponse`, `HybridResponse*`, `SearchFacets`.
2. Use `zodgen` utilities to emit paired schema + type modules.
3. Provide custom writers for multi-scope composition (union of per-scope responses plus bucket array) since the OpenAPI document may not expose a direct `scope: 'all'` schema.
4. Emit enumerations from OpenAPI enums (scope, subject slug, key stage) where possible.
5. Hook into `type-gen` CLI (`typegen.ts`) so `pnpm type-gen` refreshes these modules automatically.
6. Ensure output passes linting and includes jsdoc comments referencing source schema IDs for traceability.

## Validation Strategy

- Add generator unit tests asserting presence & shape of new files (snapshot or AST-level via `ts-morph` helpers).
- In the search app, replace existing imports with generated equivalents and run `pnpm type-check`, `pnpm test`, `pnpm test:ui` with fixtures toggled to confirm parity.
- Update OpenAPI registration to consume generated schemas instead of local copies.

## Resolved Questions

- ✅ Zero-hit telemetry payloads remain application-specific (not in OpenAPI)
- ✅ Fixture helpers live in `types/generated/search/fixtures.ts`
- ✅ Parsed query schema generated in SDK from shared schema definition

## Implementation Complete

All originally planned steps have been completed:

1. ✅ OpenAPI specification extended with multi-scope support
2. ✅ Generator emits all modules via `pnpm type-gen`
3. ✅ Search app imports from SDK, runtime schemas removed
4. ✅ Fixture builders consume generated constructors
5. ✅ Documentation updated

## ✅ Resolved: Zod/ES Mapping Alignment

**Discovered 2025-12-05** | **Resolved 2025-12-05**

### Problem (Historical)

Two separate generators defined field lists independently, causing bulk indexing failures with `strict_dynamic_mapping_exception`.

### Solution Implemented

Unified field definitions architecture:

```text
field-definitions.ts (IndexFieldDefinitions)
    ↓
├── zod-schema-generator.ts → Zod Schemas
└── es-mapping-from-fields.ts → ES Mappings (+ es-field-overrides.ts)
```

### Key Files Created

| File                             | Purpose                                 |
| -------------------------------- | --------------------------------------- |
| `field-definitions.ts`           | Single source of truth for index fields |
| `field-definitions.unit.test.ts` | Tests for field definitions             |
| `zod-schema-generator.ts`        | Generates Zod from field definitions    |
| `es-mapping-from-fields.ts`      | Generates ES mappings from field defs   |
| `field-alignment.unit.test.ts`   | Proves Zod/ES fields match exactly      |

### Indexes Covered

All content indexes now use unified field definitions:

- `UNITS_INDEX_FIELDS` → `oak_units`
- `LESSONS_INDEX_FIELDS` → `oak_lessons`
- `UNIT_ROLLUP_INDEX_FIELDS` → `oak_unit_rollup`
- `SEQUENCES_INDEX_FIELDS` → `oak_sequences`
- `THREADS_INDEX_FIELDS` → `oak_threads`

### Verification

Field alignment tests prove Zod schemas and ES mappings have identical field sets. Run `pnpm test` in SDK to confirm.

## Remaining Work (Future Phases)

The following ontology-related schemas need to be added in future phases:

- Thread index document schema (`SearchThreadIndexDoc`) - already implemented
- Programme factor fields in existing schemas
- Unit type classification schema
- Structured content guidance schema
- Lesson component availability schema
- Ontology index document schema (for RAG) - see below
- Knowledge graph triple schema - see below
- Entity schema - see below

---

## `oak_ontology` Index Schema

**Purpose**: Combined static domain knowledge for RAG grounding. Merges data from:

- `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts` — Curriculum structure, key stages, phases, subjects, threads, workflows, synonyms
- `packages/sdks/oak-curriculum-sdk/src/mcp/knowledge-graph-data.ts` — Concept TYPE relationships (~28 concepts, ~45 edges)

**Document Types**:

| Type       | Source         | Content                                                       |
| ---------- | -------------- | ------------------------------------------------------------- |
| `concept`  | `conceptGraph` | Knowledge graph concept nodes (subject, lesson, thread, etc.) |
| `keystage` | `ontologyData` | Key stage definitions (KS1-KS4)                               |
| `phase`    | `ontologyData` | Phase definitions (primary, secondary)                        |
| `subject`  | `ontologyData` | Subject definitions with key stage availability               |
| `thread`   | `ontologyData` | Thread definitions with progression examples                  |
| `workflow` | `ontologyData` | Tool usage workflows for AI agents                            |
| `edge`     | `conceptGraph` | Knowledge graph edges (relationships between concepts)        |

### Schema Definition

```typescript
// Target: packages/sdks/oak-curriculum-sdk/src/types/generated/search/ontology-documents.ts

import { z } from 'zod';

/**
 * Base fields for all ontology documents.
 */
const OntologyDocBaseSchema = z.object({
  doc_id: z.string(), // e.g., "concept:lesson", "keystage:ks1", "thread:number"
  doc_type: z.enum(['concept', 'keystage', 'phase', 'subject', 'thread', 'workflow', 'edge']),
  title: z.string(), // Human-readable title
  description: z.string(), // Full text description
  // description_semantic is NOT in Zod - it's ES-specific (semantic_text type)
  category: z.string().optional(),
  related_concepts: z.array(z.string()).optional(), // Links to other doc_ids
  source: z.enum(['ontology-data', 'knowledge-graph-data']),
  content_text: z.string(), // Full content for RAG context assembly
});

/**
 * Concept node from knowledge graph.
 */
export const OntologyConceptDocSchema = OntologyDocBaseSchema.extend({
  doc_type: z.literal('concept'),
  concept_id: z.string(), // e.g., "lesson", "unit", "thread"
  concept_label: z.string(),
  concept_brief: z.string(),
  concept_category: z.enum(['structure', 'content', 'context', 'taxonomy', 'ks4', 'metadata']),
});

/**
 * Edge from knowledge graph.
 */
export const OntologyEdgeDocSchema = OntologyDocBaseSchema.extend({
  doc_type: z.literal('edge'),
  from_concept: z.string(),
  to_concept: z.string(),
  relation: z.string(),
  inferred: z.boolean().optional(),
});

/**
 * Union of all ontology document types.
 */
export const OntologyDocSchema = z.discriminatedUnion('doc_type', [
  OntologyConceptDocSchema,
  OntologyEdgeDocSchema,
  // Additional schemas for concept, keystage, phase, subject, thread, workflow
]);

export type OntologyDoc = z.infer<typeof OntologyDocSchema>;
```

### ES Mapping

```typescript
// Target: packages/sdks/oak-curriculum-sdk/src/types/generated/search/es-mappings/oak-ontology.ts

export const oakOntologyMapping = {
  mappings: {
    properties: {
      doc_id: { type: 'keyword' },
      doc_type: { type: 'keyword' },
      title: { type: 'text', fields: { keyword: { type: 'keyword' } } },
      description: { type: 'text' },
      description_semantic: { type: 'semantic_text' }, // ELSER auto-assigned
      category: { type: 'keyword' },
      related_concepts: { type: 'keyword' },
      source: { type: 'keyword' },
      content_text: { type: 'text' },

      // Concept-specific fields
      concept_id: { type: 'keyword' },
      concept_label: { type: 'keyword' },
      concept_brief: { type: 'text' },
      concept_category: { type: 'keyword' },

      // Edge-specific fields
      from_concept: { type: 'keyword' },
      to_concept: { type: 'keyword' },
      relation: { type: 'keyword' },
      inferred: { type: 'boolean' },
    },
  },
  settings: {
    // Use same analyzers as other oak_ indexes
    analysis: {
      /* oak_text_index, oak_text_search */
    },
  },
};
```

### Document Generation

Documents are generated at type-gen time from the static data:

```typescript
// Target: packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/generate-ontology-docs.ts

import { ontologyData } from '../../../src/mcp/ontology-data.js';
import { conceptGraph } from '../../../src/mcp/knowledge-graph-data.js';

export function generateOntologyDocuments(): OntologyDoc[] {
  const docs: OntologyDoc[] = [];

  // Generate concept documents from knowledge graph
  for (const concept of conceptGraph.concepts) {
    docs.push({
      doc_id: `concept:${concept.id}`,
      doc_type: 'concept',
      title: concept.label,
      description: concept.brief,
      concept_id: concept.id,
      concept_label: concept.label,
      concept_brief: concept.brief,
      concept_category: concept.category,
      source: 'knowledge-graph-data',
      content_text: `${concept.label}: ${concept.brief}`,
    });
  }

  // Generate edge documents from knowledge graph
  for (const edge of conceptGraph.edges) {
    docs.push({
      doc_id: `edge:${edge.from}-${edge.rel}-${edge.to}`,
      doc_type: 'edge',
      title: `${edge.from} ${edge.rel} ${edge.to}`,
      description: `Relationship: ${edge.from} ${edge.rel} ${edge.to}`,
      from_concept: edge.from,
      to_concept: edge.to,
      relation: edge.rel,
      inferred: 'inferred' in edge ? edge.inferred : false,
      source: 'knowledge-graph-data',
      content_text: `${edge.from} ${edge.rel} ${edge.to}`,
    });
  }

  // Generate key stage documents from ontology
  for (const ks of ontologyData.curriculumStructure.keyStages) {
    docs.push({
      doc_id: `keystage:${ks.slug}`,
      doc_type: 'keystage',
      title: ks.name,
      description: ks.description,
      // ... additional fields
    });
  }

  // ... similar for phases, subjects, threads, workflows

  return docs;
}
```

---

## `oak_curriculum_graph` Triple Schema

**Purpose**: Instance-level knowledge graph storing actual curriculum relationships.

**Distinction from `oak_ontology`**:

| Aspect         | `oak_ontology`               | `oak_curriculum_graph`                       |
| -------------- | ---------------------------- | -------------------------------------------- |
| Content        | Schema-level (concept TYPES) | Instance-level (actual lessons, units)       |
| Source         | Static authored data         | Extracted from curriculum API + NER          |
| When populated | At type-gen time             | During/after ingestion (multi-step)          |
| Example        | "lesson hasKeywords keyword" | "lesson:fractions-y4 hasKeyword denominator" |

### Schema Definition

```typescript
// Target: packages/sdks/oak-curriculum-sdk/src/types/generated/search/graph-documents.ts

import { z } from 'zod';

/**
 * A triple representing a relationship in the curriculum graph.
 */
export const CurriculumTripleSchema = z.object({
  triple_id: z.string(), // "lesson:slug|relation|keyword:slug"

  // Source entity
  source_id: z.string(), // "lesson:adding-fractions-y4"
  source_type: z.string(), // "lesson", "unit", "keyword", "thread", etc.
  source_label: z.string(), // Human-readable label

  // Relationship
  relation: z.string(), // "containedIn", "hasKeyword", "addresses", etc.
  relation_category: z.enum([
    'hierarchical', // lesson→unit→sequence
    'semantic', // hasKeyword, mentions
    'pedagogical', // addresses (misconception), requiresPriorKnowledge
    'temporal', // precedes, follows
    'taxonomic', // taggedWith (thread, category)
  ]),

  // Target entity
  target_id: z.string(),
  target_type: z.string(),
  target_label: z.string(),

  // Extraction metadata
  confidence: z.number().min(0).max(1), // 1.0 for explicit, lower for inferred
  extraction_source: z.enum(['api', 'ner', 'cooccurrence', 'manual']),
  source_doc_id: z.string().optional(), // Document this was extracted from
  context: z.string().optional(), // Sentence/context where relationship found

  // Timestamps
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().optional(),
});

export type CurriculumTriple = z.infer<typeof CurriculumTripleSchema>;
```

### Entity Discovery Sources

See [Entity Discovery Pipeline](./entity-discovery-pipeline.md) for the multi-step extraction process.

| Extraction Source | When                 | Confidence | Examples                                 |
| ----------------- | -------------------- | ---------- | ---------------------------------------- |
| `api`             | During ingestion     | 1.0        | lesson→unit, lesson→keywords             |
| `ner`             | Post-ingestion batch | 0.7-0.95   | lesson mentions "William Shakespeare"    |
| `cooccurrence`    | Post-ingestion batch | 0.5-0.9    | keywords that appear together frequently |
| `manual`          | Human curation       | 1.0        | Curated corrections or additions         |

---

## `oak_entities` Entity Schema

**Purpose**: Canonical entity records for disambiguation and graph metrics.

### Schema Definition

```typescript
// Target: packages/sdks/oak-curriculum-sdk/src/types/generated/search/entity-documents.ts

import { z } from 'zod';

/**
 * A canonical entity in the curriculum knowledge graph.
 */
export const CurriculumEntitySchema = z.object({
  entity_id: z.string(), // "keyword:denominator", "lesson:fractions-y4"
  entity_type: z.enum([
    'lesson',
    'unit',
    'sequence',
    'subject',
    'thread',
    'category',
    'keyword',
    'misconception',
    'person',
    'place',
    'concept',
    'term',
  ]),
  canonical_label: z.string(), // "denominator" (normalised)
  aliases: z.array(z.string()), // ["the denominator", "denominators"]
  description: z.string().optional(),
  // description_semantic is ES-specific (semantic_text type)

  // Entity source
  source: z.enum(['ontology', 'api', 'ner', 'cooccurrence']),
  source_doc_ids: z.array(z.string()).optional(), // Documents where entity appears

  // Type-specific metadata (schema varies by entity_type)
  metadata: z.record(zodMetadataSchema).optional(),

  // Graph metrics (computed periodically)
  in_degree: z.number().int().optional(), // Edges pointing TO this entity
  out_degree: z.number().int().optional(), // Edges pointing FROM this entity
  centrality: z.number().optional(), // PageRank or similar

  // Timestamps
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().optional(),
});

export type CurriculumEntity = z.infer<typeof CurriculumEntitySchema>;
```

### Entity Population Sources

| Source         | Timing         | Entity Types                            |
| -------------- | -------------- | --------------------------------------- |
| `ontology`     | Type-gen time  | Concepts from `knowledge-graph-data.ts` |
| `api`          | Ingestion time | lessons, units, sequences, threads      |
| `ner`          | Post-ingestion | person, place, scientific_term, etc.    |
| `cooccurrence` | Post-ingestion | Discovered keyword clusters             |

## Architecture Alignment

- Upholds ADR-038 by shifting all validation into generated artefacts; runtime modules import pre-validated schemas rather than constructing them dynamically.
- Reinforces the repository cardinal rule: running `pnpm type-gen` regenerates every schema/guard, eliminating bespoke Zod definitions in the app.
- Leverages existing `type-gen` infrastructure so no new runtime scaffolding is introduced; all behavioural logic remains compile-time.
- Provides hooks for type guard emission, matching the two-executor philosophy by ensuring validation occurs before execution in downstream consumers.

## Implementation Hooks

- Extend `typegen-core.ts#createFileMap` to merge new `generateSearch*` module outputs alongside existing facet modules.
- Introduce generator modules under `type-gen/typegen/search/` for requests, responses, suggestions, scopes, fixtures, and guard helpers; each should accept the SDK schema to derive enums/structures.
- Add writer utilities to `type-gen/typegen/search/` for composing multi-scope responses and emitting accompanying Zod + type guard files.
- Ensure `typegen-core.ts` passes the SDK schema into the new generators (mirroring how response-map and MCP tools consume it).
- Update or add unit tests within `type-gen` to snapshot the generated file map and guard against regressions when the schema evolves.

## Work Breakdown

This is the reference specification for the type-gen search schema generator. See [Search Service Implementation Plan](search-service/schema-first-ontology-implementation.md#phase-1-schema-first-migration) for the actual implementation sessions.

**Key Modules to Generate:**

1. **requests** – Structured and natural language request schemas (Zod + TypeScript)
2. **responses** – Per-scope result schemas (lessons, units, sequences, threads) plus multi-scope composition
3. **suggestions** – Suggestion request/response schemas and cache metadata
4. **scopes** – Search scope enumerations and guards
5. **fixtures** – Builder helpers for test fixtures
6. **index** – Aggregate exports and re-exports

**Implementation Notes:**

- All schemas derive from the Open Curriculum OpenAPI specification
- Generated files include `// GENERATED FILE - DO NOT EDIT` headers
- Type guards (e.g., `isSearchSuggestionResponse`) generated for runtime validation
- Fixture builders use generated types for type-safe test data construction
