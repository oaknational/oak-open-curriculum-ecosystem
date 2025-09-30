# SDK Parity Endpoints

We retain parity endpoints under `/api/sdk/*` to compare the enriched Elasticsearch experience against the baseline Oak Curriculum API. These routes proxy the official SDK and are primarily for regression testing and incident response. They require the same environment configuration as the hybrid endpoints and are typically shielded behind feature flags.

## `POST /api/sdk/search-lessons`

Mirrors `sdk.searchLessons` (REST `GET /search/lessons`).

Request body:

```json
{
  "q": "fractions",
  "keyStage": "ks2",
  "subject": "maths",
  "unit": "optional-unit-slug",
  "limit": 20,
  "offset": 0
}
```

Behaviour:

- Returns paginated lexical results from the Oak API.
- Validates `keyStage`, `subject`, `unit` using SDK guards and generated types.
- Useful for comparing recall/precision against `/api/search` (`scope="lessons"`).

## `POST /api/sdk/search-transcripts`

Mirrors `sdk.searchTranscripts` (REST `GET /search/transcripts`).

Request body:

```json
{
  "q": "photosynthesis",
  "keyStage": "ks3",
  "subject": "science",
  "limit": 5
}
```

Behaviour:

- Returns transcript-centric lexical hits from the Oak API (defaults `limit` to 5 when omitted).
- Useful for benchmarking transcript snippets returned by the Elasticsearch hybrid service.

## Why keep these endpoints?

- **Regression guard**: compare enriched indices vs canonical API responses.
- **Fallback**: provide temporary alternative if Elasticsearch service experiences downtime (behind feature flag).
- **Diagnostics**: log parity results during development to tune synonyms/semantic weights.

## Operational notes

- Do **not** expose these routes publicly; guard with authentication/feature flags in production.
- Ensure logging differentiates `sdk/*` from hybrid endpoints to avoid noisy analytics.
- Documentation plan covers how these endpoints feature in onboarding materials; keep payload examples synchronised with SDK releases.
