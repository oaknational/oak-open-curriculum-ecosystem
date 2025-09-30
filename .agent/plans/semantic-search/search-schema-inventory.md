# Search Schema Inventory – Runtime Definitions (2025-09-30)

Catalogue of search-related types, Zod schemas, and guards defined inside `apps/oak-open-curriculum-semantic-search` that currently originate in the application runtime rather than the SDK compile step. Each entry notes the construct, its purpose, and immediate consumers to support migration into SDK-generated artefacts.

## apps/oak-open-curriculum-semantic-search/app/ui/structured-search.shared.ts

- `SearchScope` / `SearchScopeWithAll` (type alias): enumerations of permitted search scopes including the synthetic `all` mode used only by the UI.
- `StructuredBody` (interface): request envelope for `/api/search`; duplicates logic already expressed in `SearchRequest` Zod schema.
- `SearchRequest` (Zod schema): validates structured search form payloads; defines scope/text/minLessons/size/facet fields.
- `SuggestionContextSchema`, `SuggestionItemSchema`, `SuggestionCacheSchema`, `SuggestionResponseSchema` (Zod): bespoke suggestion shapes and cache metadata; coerce to SDK facets via runtime transform.
- `FacetsSchema` (Zod with `SdkSearchFacetsSchema.safeParse`): attempts to align runtime facets to SDK type post-hoc.
- `HybridResponseSchema`, `MultiScopeBucketSchema`, `MultiScopeHybridResponseSchema` (Zod): runtime models for search results, multiscope buckets, and suggestions, including default suggestion cache values.
- Derived types `HybridResponse`, `MultiScopeHybridResponse`, `MultiScopeBucket`, `SuggestionItem`, `SuggestionResponse`, `SuggestionCache`: exported throughout fixtures, controllers, and API routes.

## app/ui/search-fixtures/builders

- `single-scope.ts`: `LessonRecord`, `SingleScopeDatasetKey`, `DatasetRecord`, `FixtureOverrides`, `BuildSingleScopeFixtureOptions`, `SingleScopeFixture` – builder-specific structures mapping raw data arrays into `HybridResponse`-like payloads plus ad-hoc aggregations/facets casts.
- `multi-scope.ts`: `UnitRecord`, `SequenceRecord`, `BucketOverride`, `BucketOverrideMap`, local `SuggestionCache` alias, `BuildMultiScopeFixtureOptions`; recreates bucket wiring outside SDK control.
- `empty.ts`: `FixtureScope`, `BuildEmptyFixtureOptions`; uses record of default datasets per scope.
- `timed-out.ts`: `TimedOutSingleScopeFixture`, `TimedOutMultiScopeFixture` – timed-out variants of builder payloads with manual `timedOut: true` overrides.

## app/ui/client/useSearchController.ts

- `StructuredPayloadSchema` (Zod), `SearchMeta`, `MultiScopeBucketView`, `SearchController`, `SearchState`, `SearchAction`: client-side controller state + parsing pipeline; revalidates payloads with locally defined schemas before surfacing them to the UI.

## app/ui/SearchResults.shared.tsx

- `UnitSchema`, `LessonSchema`, `ItemSchema`, `ResultsSchema` (Zod): view-layer validation for search result entries, including highlight arrays and optional lesson/unit metadata.

## app/ui/NaturalSearch.helpers.ts

- `ApiResponseSchema` (Zod `.loose()`), plus helper `normaliseNaturalRequest`: defines expected natural-search response envelope and coercion rules prior to raising UI errors.

## app/api/search/route.ts

- `StructuredSchema` (Zod): validates POST payload for `/api/search`, duplicating `SearchRequest` surface plus pagination/highlight flags.
- `StructuredSearchBody` (type alias), `MultiScopeResponse`, `SearchResponsePayload` (type unions): mirror runtime search result structures instead of importing SDK-generated equivalents.

## app/api/search/nl/route.ts

- `BodySchema` (Zod): natural-language body validator duplicating structured search fields.
- `NaturalStructuredPayload` (type alias) and helper functions `resolveScope`, `pickSubject`, `pickKeyStage`: enforce search scope/filters without SDK source of truth.

## app/api/search/suggest/route.ts

- `SuggestBodySchema` (Zod): defines suggestion request payload including limit and optional filters; converts to `SuggestQuery` manually.

## app/api/sdk/search-lessons/route.ts

- `BodySchema` (Zod): bespoke validator for lesson search proxy to the SDK; uses local `toOptional` helper and numeric coercion guard functions.

## app/api/sdk/search-transcripts/route.ts

- `BodySchema` (Zod): transcript search proxy validator mirroring SDK expectations.

## app/ui/search-fixtures/tests

- `.unit.test.ts` files: rely on Zod inference to assert builder outputs; currently duplicate schema knowledge for fixtures.

## src/lib/query-parser.ts

- `ParsedQuerySchema` (Zod), `ParsedQueryRaw`, `ParsedQuery` interface: runtime interpretation of LLM output into structured search intent; revalidates subject/key stage via SDK guards.

## src/lib/run-hybrid-search.ts

- `MultiScopeHybridResult` (type alias): manual composition of multiscope buckets assembled from `StructuredQuery` + `HybridSearchResult` pairs.

## src/lib/hybrid-search/types.ts

- `StructuredQuery`, `UnitResult`, `LessonResult`, `SequenceResult`, `HybridSearchMeta`, `HybridSearchResult`, `SearchAggregations`: core search request/response contracts built locally from SDK elastic docs rather than generated schemas.

## src/lib/suggestions/types.ts

- `SuggestScope`, `SuggestQuery`, `SuggestionContext`, `SuggestionItem`, `SuggestionResponse`: runtime suggestion models fed by Elasticsearch.

## src/lib/suggestions/scope-config.ts

- `SuggestionHit`, `ScopeConfig<TDoc>`: scope-specific suggestion adapters with manual typing of ES documents, contexts, and mapping functions.

## src/lib/search-index-target.ts

- `SearchIndexTarget`, `SearchIndexKind` (type aliases) plus helper guard `coerceSearchIndexTarget`: define permissible Elasticsearch index identifiers independent of SDK types.

## src/lib/openapi.schemas.ts

- Comprehensive Zod models for structured/natural search payloads, hybrid responses, suggestion contracts, and SDK passthrough bodies decorated with OpenAPI metadata; duplicates many definitions listed above.

## src/lib/openapi.register.ts

- Accepts `z.ZodType` dependencies for all API surfaces, assembling OpenAPI paths with unions such as `HybridResponseLessons|Units|Sequences` – currently reliant on runtime-provided schemas rather than generator output.

## src/lib/env.ts

- `BaseEnvSchema` and `EnvSchema` (Zod): runtime validation for search environment variables, including transforms for booleans and defaults tied to search index settings.

## src/lib/observability/zero-hit.ts & zero-hit-store.ts

- `ZeroHitPayload`, `ZeroHitEvent`: telemetry payloads capturing zero-result searches; currently detached from SDK schema definitions but integral to search observability.

## src/lib/suggestions`,`/src/lib/hybrid-search`,`/src/lib/indexing/\*`

- Numerous helper interfaces (`SuggestionHit`, `ScopeConfig`, `LessonRrfParams`, `SequenceFacetDocument`, etc.) that model search documents, aggregations, and indexing payloads outside the SDK pipeline. These will require evaluation during migration to ensure generator coverage spans Elasticsearch ingest as well as API-facing contracts.

## Scripts referencing Zod

- `scripts/scaffolding/apply-split-search-endpoints.sh` and `oak-open-curriculum-search-scaffolding.sh` rely on `zod-to-openapi` snippets; future automation should source generated artefacts rather than template literal copies.

## Pending Validation

- Need to confirm whether additional Zod schemas exist in other UI controllers (e.g. admin tooling) once fixtures consolidate; any missed entries should be appended here before migration planning concludes.

## SDK Coverage Snapshot (packages/sdks/oak-curriculum-sdk/src/types/generated/search)

- `facets.ts`: exports `SequenceFacetUnit`, `SequenceFacet`, `SearchFacets` derived from the Open Curriculum schema; currently the only generated artefacts consumed by the search app.
- `index.ts`: re-exports the facet types.

Current gap: all other request/response Zod schemas, hybrid result types, suggestion contracts, and controller helpers remain runtime-defined within the app.

## Baseline Checks

- `pnpm type-check`: fails in `apps/oak-open-curriculum-semantic-search` with fixture/search schema errors (see 2025-09-30 baseline).
- `pnpm lint`: fails in the same workspace; key errors include unused fixture exports, disallowed `Record<string, unknown>`, unsafe assignments in fixtures/actions, and deprecated `ZodIssueCode` usage.
