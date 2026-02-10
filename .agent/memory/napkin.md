# Napkin

## Session: 2026-02-10 — SDK Full Extraction (Checkpoints B+C+D)

### Context

- Checkpoints A–D complete: SDK workspace with all three services implemented
- 34 tests GREEN (25 integration + 9 unit), all quality gates pass
- Branch: feat/semantic_search_deployment (ahead of origin)
- Next: Checkpoint E (CLI rename + subcommand wiring)

### What Was Built

- `src/internal/` — ES search adapter (`EsSearchFn`), index resolver, internal types
- `src/retrieval/` — 4-way RRF query builders, query processing, suggestions, facets, score normalisation
- `src/admin/` — Setup, connection, listing, synonyms, index-meta (Result pattern), bulk ingest
- `src/observability/` — Instance-level FIFO store, ES persistence, telemetry queries
- `src/create-search-sdk.ts` — Real factory replacing the stub
- Test helpers — `vi.spyOn` on Client methods, structurally valid empty responses

### What Works

- The DI pattern is clean — extraction worked as a file-move + adaptation exercise
- Types flowing from Curriculum SDK prevented shape mismatches
- `vi.spyOn` on the injected Client is the right mocking strategy — no type assertions needed
- Splitting files to stay under 250-line max-lines rule works well for modularity
- ES client v9 uses `document` not `body` for `client.index()` calls
- Synonym sets need `[...synonymSet.synonyms_set]` to convert readonly to mutable

### Mistakes Made (and Corrected)

- Initially created `ZeroHitEvent` with `query` field — the schema uses `text`
- Used `body` parameter for `client.index()` — ES v9 uses `document`
- Type assertions (`as`) crept in during initial porting — all replaced with type guards
- Files exceeded 250-line limit — had to split into `index-meta.ts`, `ingest.ts`, `es-error-guards.ts`, `zero-hit-telemetry.ts`
- `buildSearchParams` complexity exceeded 8 — split into `assignQueryOrRetriever` + `assignOptionalFields`
- `toMappingParams` returned `unknown` for settings/mappings — needed `estypes.IndicesIndexSettings` + `estypes.MappingTypeMapping`
- Suggestion items need `url` and `contexts` fields, not just `label` and `scope`
- `Record<string, unknown>` is banned — used `isHighlightRecord` type guard instead
- `Object.keys()` is restricted — used `for...in` with `hasOwnProperty` guard

### Patterns to Remember

- ES client v9: `document` not `body` for indexing
- ES client v9: spread readonly arrays before passing to mutable params
- `isPlainObject` type guard satisfies both `IndicesIndexSettings` and `MappingTypeMapping`
- `isKnownSubject` type guard replaces `subject as keyof typeof SUBJECT_TO_PARENT`
- `extractStatusCode` centralises ES error code extraction without assertions
- `for...in` + `Object.prototype.hasOwnProperty.call()` for iterating unknown objects
