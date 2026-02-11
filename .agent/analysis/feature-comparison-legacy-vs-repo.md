# Feature Comparison: Legacy Oak Search vs Repo Semantic Search

**Scope**: Legacy deployed search (OWA + search-api) compared with the semantic-search stack in this repo. UI-specific features are noted but not prioritised. Note: anything under `app/api` in this repo is aspirational and not built/deployed yet.

## Capability matrix (high level)

| Area | Legacy deployed (OWA + search-api) | Repo semantic search (SDK/CLI stack) | Gap / opportunity |
| --- | --- | --- | --- |
| Retrieval approach | Lexical ES query (phrase + fuzzy) over `all_fields`, no semantic embeddings. | Hybrid RRF (BM25 + ELSER on content + structure) for lessons/units; 2-way RRF for sequences. | Repo already ahead on relevance; tune weights and evaluations to prove gains. |
| Scope coverage | Lessons + units only. | Lessons, units, sequences, threads, rollups, sequence facets. | Repo ahead; add threads/sequence use cases in client integrations. |
| Filters | Multi-select arrays (subject, key stage, year group, exam board, content type), plus legacy cohort filter. | Single subject/keyStage; metadata filters (tier, examBoard, examSubject, ks4Option, year, threadSlug, category); minLessons, unitSlug, phaseSlug. | Legacy ahead on multi-select + cohort filter; repo ahead on richer metadata. |
| Suggestions | No search suggestion endpoint; UI has AI filter suggestion service. | ES data supports typeahead, but no API or UI integration yet. | Legacy ahead on shipped suggestions; repo has data foundation. |
| Natural language | LLM-assisted filter suggestions only (feature-flag). | Not implemented or deployed. | Legacy ahead on shipped intent support. |
| Pagination | Client-side; API caps at 100 results. | Planned API supports `from` + `size` with 1–100 bounds. | Rough parity; extend size or add cursor-based pagination if needed. |
| Observability | Basic error reporting; UI analytics. | Ingestion metrics exist; zero-hit logging is planned in the aspirational API layer. | Legacy ahead on shipped analytics; repo ahead on ingestion telemetry. |
| Indexing pipeline | GraphQL reindexer, 2 indices, basic analysers and copy_to. | Multi-index ingestion harness, bulk retries, rollup/snippet generation, SDK-driven mappings, synonyms. | Repo ahead in robustness and richness. |
| Type safety | Zod parsing in OWA, but ES mappings and types hand-authored. | SDK-generated mappings, Zod schemas, and types from OpenAPI. | Repo ahead and more consistent. |
| Caching | None for search results; AI intent responses cached via CDN. | Planned search + suggestion cache tagged by `SEARCH_INDEX_VERSION`; SDK response caching via Redis exists for ingestion. | Repo ahead on ingestion caching; legacy only caches AI intent. |

## Where legacy is ahead

- Multi-select filtering on subjects, key stages, year groups, exam boards, and content types.
- Cohort control for legacy vs new content (`filterOutAll` / `filterOutEYFS`).
- Deployed and integrated into OWA with existing analytics and UX patterns (AI filter suggestions in UI).

## Where the repo is ahead

- Hybrid lexical + semantic retrieval (ELSER) with RRF fusion and phrase boosting.
- Richer content scope: sequences, threads, rollup content, and facets.
- Synonym and phrase vocabulary centrally managed in SDK and pushed into ES synonym sets.
- SDK-driven mappings and ingestion with schema-first guarantees.
- Observability pipeline for zero-hit logging and ingestion telemetry.
- Robust ingestion (bulk + retries + alias swaps + data integrity reporting).

## Steps to match legacy capabilities

1. **Multi-select filters**: extend `SearchStructuredRequestSchema` to accept arrays for `subject`, `keyStage`, `year`, and `examBoard`, then propagate to filter builders.
2. **Cohort filtering**: add a cohort/legacy field to SDK search mappings and ingestion, then expose a structured filter equivalent to `legacy`.
3. **Content type filter parity**: allow multi-scope payloads to return a combined, interleaved ranking (not just bucketed results) if required by clients.
4. **Year-group semantics**: align year filters with legacy behaviour (single vs multi, KS4 grouping) and ensure `year` is backed by keyword fields.
5. **AI filter suggestions**: provide a server-side `intent` endpoint (or reuse query parser + deterministic rules) for suggested filters to replace UI-specific logic once the API layer is built.

## Multi-select and cohort filter design (proposal)

### Multi-select filters

**Breaking schema change (preferred to avoid compatibility layers):**

- Replace scalar fields with arrays in `SearchStructuredRequestSchema`:
  - `subject: SearchSubjectSlug[]`
  - `keyStage: KeyStage[]`
  - `year: string[]`
  - `examBoard: string[]`
- Keep `scope` as-is; interpret filter arrays with OR semantics within a field and AND across fields.
- Update query normalisation to:
  - Deduplicate and sort arrays before building cache keys.
  - Reject empty arrays at validation time (min length 1) to avoid ambiguous behaviour.

**Query builder behaviour:**

- Use `terms` filters for arrays (e.g., `subject_slug` in `["maths", "science"]`).
- Maintain `bool.filter` for filters so scoring remains driven by RRF retrievers.
- Ensure fields used for filtering are keyword-normalised in mappings (avoid tokenised text fields for filters).

**Evaluation impact:**

- Add tests around filter normalisation and caching stability.
- Extend evaluation scripts to include multi-select test cases and compare against legacy.

### Cohort filtering

**Schema additions:**

- Add `cohort` to index docs and `SearchStructuredRequestSchema`:
  - `cohort: string[]` or an enum (`2020-2023`, `2023-2026`) if canonical cohorts are fixed.
- Prefer an array field in index docs (`cohorts`) to avoid losing mixed-cohort units or rollups.

**Ingestion rules:**

- Lessons: set `cohorts` from source metadata, with `isLegacy` as a derived boolean for convenience.
- Units/rollups:
  - Aggregate cohorts from constituent lessons (unique array).
  - If a unit spans cohorts, it should match either cohort filter when selected.

**Query behaviour:**

- `cohort` filter uses `terms` over `cohorts`.
- If the client wants legacy-only or new-only, they pass the explicit cohort slug(s).
- Avoid implicit defaults; let the client choose, matching the repo’s “no hidden fallback” rule.

**Migration notes:**

- Because this is a breaking change, version the API contract (OpenAPI update + `pnpm type-gen`).
- Update all consumers in lockstep; do not introduce dual fields or silent fallback behaviour.

## Example request shape for multi-select (proposed)

```json
{
  "scope": "lessons",
  "text": "fractions",
  "subject": ["maths", "science"],
  "keyStage": ["ks2", "ks3"],
  "year": ["year-5", "year-6"],
  "examBoard": ["aqa"],
  "cohort": ["2023-2026"]
}
```

## Opportunities to outshine the legacy system

- **Search quality**: measure and publish gains using existing evaluation tooling and acceptance criteria.
- **Richer intent handling**: use query parsing plus structured metadata to support pedagogical intent (Tier 4 in acceptance criteria).
- **Sequence and thread discovery**: enable progression-centric navigation not available in legacy search.
- **Operational resilience**: leverage bulk retries, data integrity reporting, and versioned caches for reliable reindexing.
- **Schema-first governance**: keep mappings, Zod validation, and SDK types locked to OpenAPI, reducing drift.

## Migration gap matrix (legacy v2 -> semantic search)

| Legacy search input | Semantic search input | Notes |
| --- | --- | --- |
| `term` (string) | `text` (string) | Rename only. |
| `keyStages` (string[]) | `keyStage` (string) | **Gap**: legacy supports multi-select. |
| `subjects` (string[]) | `subject` (string) | **Gap**: legacy supports multi-select. |
| `yearGroups` (string[]) | `year` (string) | **Gap**: legacy supports multi-select. |
| `examBoards` (string[]) | `examBoard` (string) | **Gap**: legacy supports multi-select. |
| `contentTypes` (lesson/unit) | `scope` (lessons/units/sequences/all) | **Partial**: multi-scope is bucketed, not interleaved. |
| `legacy` / `curriculum` | none | **Gap**: cohort filter not yet modelled. |
| `page` (client-side) | `from`, `size` | Repo supports server-side pagination. |
| none | `minLessons`, `unitSlug`, `phaseSlug`, `tier`, `examSubject`, `ks4Option`, `threadSlug`, `category` | **Repo-only**: richer metadata filters. |

## Output shape differences (summary)

- Legacy API returns raw ES hits with `_source` and `highlight` fields.
- Semantic search returns scoped payloads with `results`, `rankScore`, `highlights`, optional `facets`, and versioned cache metadata.
- Semantic search can also return multi-scope buckets and type-ahead suggestions.

## Key file references

- Legacy request shape: `reference/Oak-Web-Application/src/context/Search/search.types.ts`
- Legacy v2 query builder: `reference/search-api/curriculum/search_endpoint/src/constructElasticQuery.ts`
- Semantic request schema: `packages/sdks/oak-curriculum-sdk/src/types/generated/search/requests.ts`
- Semantic query builders: `apps/oak-search-cli/src/lib/hybrid-search/rrf-query-builders.ts`
