# Search Schema Generator Specification

_Last updated: 2025-11-11_  
_Status: REFERENCE DOCUMENT_

## Purpose

Define the compile-time artefacts that the Oak Curriculum SDK must emit so the semantic search application consumes a single source of truth for request/response shapes, fixtures, and runtime guards. This specification enumerates the required schemas, TypeScript types, and helper utilities to be produced by `pnpm type-gen` under `packages/sdks/oak-curriculum-sdk/src/types/generated/search` (and companion runtime entry points), replacing bespoke in-app definitions.

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

## File Layout Proposal

```text
src/types/generated/search/
  facets.ts                 # existing facets
  requests.ts               # structured + natural request schemas/types
  responses.lessons.ts      # lesson-specific result schemas
  responses.units.ts        # unit-specific
  responses.sequences.ts    # sequence-specific
  responses.multi.ts        # multi-scope composition
  suggestions.ts            # suggestion request/response
  parsed-query.ts           # parsed query schema/type
  scopes.ts                 # unions/enums & helper guards
  fixtures.ts               # optional fixture builder helpers
  index.ts                  # re-exports aggregate API
```

Each module should export both `zod` schemas and TypeScript types, plus helper guard functions. Generated files remain `.ts` with `// GENERATED FILE - DO NOT EDIT` headers to align with existing patterns.

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

## Open Questions

- Do we introduce additional SDK surface for zero-hit telemetry payloads? (Not present in current OpenAPI doc; may remain application-specific.)
- Should fixture helpers live under `@oaknational/oak-curriculum-sdk/testing` namespace rather than `types/generated/search`? (Needs alignment with maintainers.)
- Determine whether parsed query schema belongs in SDK (if not defined upstream) or remains app-local but generated from a shared schema definition.

## Next Steps

1. Confirm the OpenAPI specification includes (or can include) the multi-scope `scope: 'all'` variant; if not, define an SDK-specific augmentation to generate the schema.
2. Extend the generator to emit new modules and re-run `pnpm type-gen` to verify output.
3. Update search app imports to reference the generated artefacts, deleting redundant runtime schemas.
4. Adjust fixture builders to consume generated constructors and safeParse helpers.
5. Update documentation (`semantic-search-phase-1-ux.md`, continuation prompt) with the new data flow once implementation lands.

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
