# Setup

## 1) Environment

Create `apps/oak-open-curriculum-semantic-search/.env.local`:

```env
ELASTICSEARCH_URL=...
ELASTICSEARCH_API_KEY=...
OAK_API_KEY=...            # or OAK_API_BEARER=...
SEARCH_API_KEY=...

# LLM parsing (optional):
AI_PROVIDER=openai         # or 'none' to disable NL endpoint
OPENAI_API_KEY=...         # required only if AI_PROVIDER=openai
```

## 2) Bootstrap ES (Serverless)

```shell
ELASTICSEARCH_URL=... ELASTICSEARCH_API_KEY=... pnpm -C apps/oak-open-curriculum-semantic-search run elastic:setup
```

## 3) Index + Rollup

```shell
curl -H "x-api-key: $SEARCH_API_KEY" http://localhost:3000/api/index-oak
curl -H "x-api-key: $SEARCH_API_KEY" http://localhost:3000/api/rebuild-rollup
```

## 4) Search

**Structured (LLM-free)**

```http
POST /api/search
{ "scope":"units","text":"mountains","subject":"geography","keyStage":"ks4","minLessons":3 }
```

**Natural-language (LLM)**

```http
POST /api/search/nl
{ "q":"ks4 geography units about mountains with at least 3 lessons" }
```

If LLM is disabled (`AI_PROVIDER=none` or no OPENAI_API_KEY), `/api/search/nl` returns `501` with `{ "error":"LLM_DISABLED" }`.
