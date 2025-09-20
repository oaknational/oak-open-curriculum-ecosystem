# SDK Parity Endpoints

The hybrid Elasticsearch search is the primary experience. We retain two parity endpoints that proxy the Oak Curriculum SDK so we can compare behaviours, run regression checks, and provide fallbacks during incident response. Both live under `/api/sdk/*` and require the same environment configuration as the hybrid endpoints.

## `POST /api/sdk/search-lessons`

Mirrors the SDK’s `searchLessons` method (original REST `GET /search/lessons`).

- **Body schema:**

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

- **Behaviour:** Returns paginated lexical search results from the Oak API. Filters (`keyStage`, `subject`, `unit`) are validated via SDK guards.
- **Usage:** Useful for test comparisons against the hybrid `scope="lessons"` endpoint or for smoke tests when Elasticsearch is unavailable.

## `POST /api/sdk/search-transcripts`

Mirrors the SDK’s `searchTranscripts` method (REST `GET /search/transcripts`).

- **Body schema:**

  ```json
  {
    "q": "photosynthesis",
    "keyStage": "ks3",
    "subject": "science",
    "limit": 5
  }
  ```

- **Behaviour:** Returns transcript-centred results (lexical) from the Oak API, defaulting to 5 hits when `limit` is omitted.
- **Usage:** Provides a ground truth when evaluating semantic recall, and a fallback surface if the Elasticsearch deployment is undergoing maintenance.

## Operational Notes

- These routes **do not** implement RRF or semantic ranking; they are straight SDK proxies.
- Keep them hidden behind feature flags if exposing publicly—they are primarily for internal testing and debugging.
- Logging from these endpoints should clearly differentiate `sdk/*` requests from hybrid search to avoid noisy analytics.
