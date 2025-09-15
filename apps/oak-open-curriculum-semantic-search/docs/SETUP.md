# Setup

## 1) Environment

Create `apps/oak-open-curriculum-semantic-search/.env.local`:

```env
ELASTICSEARCH_URL=https://your-elasticsearch-url-here
ELASTICSEARCH_API_KEY=your_elasticsearch_api_key_here
OAK_API_KEY=your_oak_api_key_here
SEARCH_API_KEY=your_search_api_key_here

# LLM parsing (optional):
AI_PROVIDER=openai         # or 'none' to disable NL endpoint
OPENAI_API_KEY=your_openai_api_key_here
```

## 2) Bootstrap ES (Serverless)

```shell
ELASTICSEARCH_URL=https://your-elasticsearch-url-here
```

## 3) Index + rollup

```shell
curl -H "x-api-key: $SEARCH_API_KEY" http://localhost:3000/api/index-oak
curl -H "x-api-key: $SEARCH_API_KEY" http://localhost:3000/api/rebuild-rollup
```

## 4) Search

**Structured (LLM‑free)**

```http
POST /api/search
{ "scope":"units","text":"mountains","subject":"geography","keyStage":"ks4","minLessons":3 }
```

**Natural‑language (LLM)**

```http
POST /api/search/nl
{ "q":"ks4 geography units about mountains with at least 3 lessons" }
```

If LLM is disabled (`AI_PROVIDER=none` or no `OPENAI_API_KEY`), `/api/search/nl` returns `501` with `{ "error":"LLM_DISABLED" }`.
