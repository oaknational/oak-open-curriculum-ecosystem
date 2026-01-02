# Legacy Oak Search Report (OWA + search-api)

**Scope**: Oak Web Application search (reference/Oak-Web-Application) and legacy search API (reference/search-api).
**Status**: Deployed legacy stack; UI present in OWA.

## Current search abilities

- Keyword search across lessons and units with highlighted snippets (pupil outcomes and other fields).
  - Results rendered as lesson/unit cards with pathway-aware links and optional pathway dropdown.
- Faceted filtering:
  - Key stages, year groups, subjects, exam boards, content types (lesson/unit), and curriculum cohort ("Show new only").
- AI-assisted filter suggestions (feature-flagged):
  - `/api/search/intent` attempts direct programme factor (PF) matches, else calls an LLM to rank subject candidates.
  - Suggestions are combined with subject-derived key stage/exam board hints.
  - Rate-limited per IP; cached via Cloudflare header for AI-based responses.
  - LLM call uses an OpenAI client pointed at the AI gateway with model `cerebras/qwen-3-32b`.
- Client-side pagination (20 per page), plus Aila signpost injection and no-results fallbacks.
- Analytics instrumentation for search access, refinement, filter changes, result open/expand, and suggestion banner clicks.

## How it works (end-to-end)

- `GET /teachers/search` is statically generated and preloads filter metadata from Curriculum API 2023:
  - `searchPage` GraphQL query returns key stages, year groups, subjects, exam boards, content types.
- UI state is driven by URL query params; `useSearch` converts router query into `SearchQuery` and triggers fetch on term change.
- Search request:
  - `performSearch` posts `SearchQuery` to `NEXT_PUBLIC_SEARCH_API_URL_2023/v2`.
  - The `legacy` query value is derived from the curriculum filter: `filterOutAll` or `filterOutEYFS`.
- Response parsing:
  - Raw ES response is validated with Zod, transformed (`lessonTitle`/`unitTitle` -> `title`, `lessonSlug`/`unitSlug` -> `slug`), highlight consolidated, then snake-cased for schema parsing.
- Search API (legacy) behaviour:
  - Cloud Function reverse proxy with CORS allowlist for OWA domains.
  - v2 endpoint constructs a bool query with:
    - Phrase match on `title` and `pupilLessonOutcome` (boosted)
    - Fuzzy match on `all_fields`
    - Filters for key stage, subject, content type, exam boards, year groups, and legacy cohort
  - Uses highlights for `pupilLessonOutcome` and `all_fields`.
  - Targets `units,lessons` indices in Elasticsearch.
- Indexing pipeline:
  - Cloud Run reindexer fetches units/lessons via Curriculum API GraphQL.
  - Dedupes units, groups pathways, and marks legacy based on cohort.
  - Creates two indices (`units`, `lessons`), swaps alias, deletes old indices.
  - Mappings use custom analysers (lowercase + stop + porter stem), plus `copy_to` into `all_fields` and `title`.

## Tech stack

- Oak Web Application: Next.js 15 + React 18, TypeScript, Zod, SWR, styled-components, PostHog, Upstash ratelimit, OpenAI client via AI gateway.
- Search API: Node/TypeScript Google Cloud Functions, Elastic JS client, Zod.
- Indexer: Node/TypeScript Cloud Run job, GraphQL SDK, Elastic JS client.
- Infra: Elastic Cloud in production; Docker Compose for local Elasticsearch + Kibana; Terraform for infra.

## Noteworthy constraints and gaps

- **Result cap**: v2 query `size` is fixed at 100; OWA paginates client-side only, so results beyond 100 are unreachable.
- **Comment drift**: `performSearch` claims to merge 2020 + 2023 results, but only 2023 is queried.
- **Legacy flag mismatch**: index uses `_source.isLegacy`, UI analytics reads `hit.legacy` (optional).
- **Filter brittleness**:
  - `yearGroups` filter strips `year-` and queries `yearSlug` as text, not a keyword.
  - EYFS filter uses tokenised `keyStageSlug` text values.
- **No server-side pagination/sorting**: no `from` or `sort` parameter exposed, scoring is implicit ES order only.
- **No built-in suggestions endpoint**: AI filter suggestions are separate and UI-specific.

## Environment wiring and deployed version (follow-up)

- OWA writes `NEXT_PUBLIC_SEARCH_API_URL_2023` into generated env files via `scripts/build/write_env_file/index.ts`, sourced from `oakConfig.oak.searchApiUrl2023` (or override via env).
- `getBrowserConfig` builds the runtime URL as `${NEXT_PUBLIC_SEARCH_API_URL_2023}/v2`.
- `NEXT_PUBLIC_SEARCH_API_URL` exists for older search but is not used by the 2023 search flow.
- The repo does not contain the live config value; the effective deployed base URL is pulled at build time. The code path confirms **v2** is the live API version when config is present.
- Provided values for reference:
  - `NEXT_PUBLIC_SEARCH_API_URL=https://search-staging.oaknational.workers.dev`
  - `NEXT_PUBLIC_SEARCH_API_URL_2023=https://curriculum-search-api-beta.thenational.academy`

## Data-flow diagram (follow-up)

```
Teacher search UI (OWA)
  |  /teachers/search (SSG)
  |  -> Curriculum API 2023 searchPage (filters)
  |  -> /api/search/intent (optional AI suggestions)
  |  -> POST search to NEXT_PUBLIC_SEARCH_API_URL_2023/v2
  v
Legacy Search API (Cloud Functions)
  |  v2 constructElasticQuery
  |  -> Elasticsearch indices: units, lessons
  v
Elasticsearch (Elastic Cloud)
  ^
  |  Reindexer (Cloud Run)
  |  -> Curriculum API GraphQL (lessons/units)
  +--------------------------------------------
```

## Key file references

- OWA search page: `reference/Oak-Web-Application/src/pages/teachers/search.tsx`
- Search hook + query handling: `reference/Oak-Web-Application/src/context/Search/useSearch.ts`
- Search API caller: `reference/Oak-Web-Application/src/context/Search/search-api/2023/fetchResults.ts`
- Search API construction: `reference/search-api/curriculum/search_endpoint/src/constructElasticQuery.ts`
- Legacy filters: `reference/search-api/curriculum/search_endpoint/src/queryFilters.ts`
- Reindexer mappings: `reference/search-api/curriculum/reindexer/src/reindex/*.mappings.ts`
- Env wiring: `reference/Oak-Web-Application/scripts/build/write_env_file/index.ts`
