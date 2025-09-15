# SDK Fallback Endpoints

These expose the original API search for completeness and parity checks. The hybrid Elasticsearch search remains the primary experience.

## POST /api/sdk/search-lessons

- **What it does:** mirrors `GET /search/lessons` (title-similarity) from the SDK.
- **Defaults:** 20 results if `limit` is omitted.
- **Filters:** `keyStage`, `subject`, **`unit`** (optional).
  Body:

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

## POST /api/sdk/search-transcripts

- **What it does:** mirrors `GET /search/transcripts` (transcript‑similarity) from the SDK.
- **Defaults:** 5 results (as per public docs).
  Body:

```json
{ "q": "photosynthesis", "keyStage": "ks3", "subject": "science" }
```
