# Setup

Follow these steps to run the hybrid search service end-to-end. All commands assume you are in the repository root unless noted otherwise.

## 1. Environment variables

Create `apps/oak-open-curriculum-semantic-search/.env.local` and populate:

```env
ELASTICSEARCH_URL=https://your-elasticsearch-url-here
ELASTICSEARCH_API_KEY=your_elasticsearch_api_key_here
OAK_API_KEY=your_oak_api_key_here
SEARCH_API_KEY=your_search_api_key_here

AI_PROVIDER=openai                         # or 'none' to disable NL endpoint
OPENAI_API_KEY=your_openai_api_key_here
```

Keep these secrets server-side; never expose them to the browser.

## 2. Install & bootstrap

```bash
pnpm install
ELASTICSEARCH_URL=https://your-elasticsearch-url-here
  pnpm -C apps/oak-open-curriculum-semantic-search elastic:setup
```

The `elastic:setup` script:

- Creates/updates the `oak-syns` synonyms set from `scripts/synonyms.json`.
- Configures index settings (analysers, normalisers, highlight offsets).
- Creates the four indices: `oak_lessons`, `oak_unit_rollup`, `oak_units`, `oak_sequences`.

## 3. Run the service

```bash
pnpm -C apps/oak-open-curriculum-semantic-search dev
```

## 4. Index content & build rollups

Call the admin endpoints with the shared secret:

```bash
curl -H "x-api-key: $SEARCH_API_KEY" http://localhost:3000/api/index-oak
curl -H "x-api-key: $SEARCH_API_KEY" http://localhost:3000/api/rebuild-rollup
```

- `/api/index-oak` pulls lessons, units, sequences, and transcripts through the Oak Curriculum SDK and bulk indexes Elasticsearch.
- `/api/rebuild-rollup` regenerates unit rollup snippets (≈300 characters per lesson) and updates `oak_unit_rollup`.

## 5. Verify search

Structured query example:

```bash
curl -X POST http://localhost:3000/api/search \
  -H 'content-type: application/json' \
  -d '{
    "scope": "lessons",
    "text": "mountain formation",
    "subject": "geography",
    "keyStage": "ks4"
  }'
```

Natural language query (only when `AI_PROVIDER=openai`):

```bash
curl -X POST http://localhost:3000/api/search/nl \
  -H 'content-type: application/json' \
  -d '{ "q": "Find KS4 geography units with at least three lessons about mountains" }'
```

Responses include RRF-ranked hits, highlights (`transcript_text` or `rollup_text`), canonical URLs, and optional facets if requested.

## 6. Maintenance reminders

- Re-run the indexing + rollup endpoints on a schedule (nightly recommended).
- Update `scripts/synonyms.json` and re-run `elastic:setup` (or `PUT /_synonyms/oak-syns`) when vocabulary changes.
- Track logs for bulk indexing errors or zero-hit searches; adjust metadata or synonyms accordingly.
- For breaking mapping changes, spin up new indices and swap aliases rather than updating in place.
