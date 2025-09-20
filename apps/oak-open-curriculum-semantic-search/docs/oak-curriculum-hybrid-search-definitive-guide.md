# Oak Curriculum Hybrid Search — **Definitive Guide** (Serverless + `semantic_text` + RRF)

_Last updated: 2025-09-19 (Europe/London)_

This document takes a teammate (human or AI agent) from zero to complete understanding of the **what, why, and how** of Oak’s hybrid search service. It covers **concepts**, **decisions**, **Elasticsearch Serverless setup**, **index definitions**, **indexing flows**, **query patterns** (including **server-side RRF**), **suggestions**, **aggregations**, **admin ops**, **security**, and **maintenance**. It aligns with our Next.js workspace `apps/oak-open-curriculum-semantic-search`, the **official Elasticsearch JS client** (`@elastic/elasticsearch`), and the **Oak Curriculum SDK** (`@oaknational/oak-curriculum-sdk`).

> Headline: We index lessons, units, and sequences into **Elasticsearch Serverless** with analyzer + synonyms and **semantic_text**. We search with **server-side RRF** (lexical + semantic) per scope, return highlights, and optionally compute facets/aggregates. LLM parsing is **optional**.

---

## 1) Background & Goals

### 1.1 Why hybrid?

Teachers ask **natural** questions (“KS4 geography units about mountains”), but also need **structured** filters (subject, keyStage, min lessons). Hybrid combines:

- **Lexical (BM25)** → precise keyword matches, controllable boosts.
- **Semantic (`semantic_text`)** → robust intent matching; better recall for paraphrase.

We **fuse** lexical and semantic ranked lists with **RRF (Reciprocal Rank Fusion)** to get the best of both worlds.

### 1.2 Why Elasticsearch Serverless?

- Managed infra with **`semantic_text`** built-in (no custom vector pipeline needed to start).
- Full text search + highlighting + aggregations + RRF.
- Operational simplicity (we manage mappings, not clusters).

### 1.3 Top-level requirements

- **Best possible search UX** with server-side RRF.
- **Teacher-centric signals**: short curated lesson fields (keywords, key learning points, misconceptions, tips) alongside long transcripts.
- **No transcript duplication** in units: a **rollup** index holds short lesson snippets per unit for highlights & semantic recall.
- **Type-ahead** and **suggestions**.
- **LLM optionality** (natural language endpoint can be disabled, structured search always works).
- **Strict typing** and SDK-first indexing in a Next.js/Node environment.

---

## 2) Architecture Overview

### 2.1 Components

- **Indices (Elasticsearch Serverless)**
  1. `oak_lessons` – lesson metadata + transcript + `lesson_semantic`
  2. `oak_unit_rollup` – unit metadata + short per-lesson snippets + `unit_semantic`
  3. `oak_units` – unit metadata for analytics/joins (search reads `oak_unit_rollup`)
  4. `oak_sequences` – sequences navigation hub (new)
- **Next.js service**
  - `/api/search` (structured; LLM-free)
  - `/api/search/nl` (natural language → structured; LLM optional)
  - Admin: `/api/index-oak`, `/api/rebuild-rollup`
  - Docs: `/api/openapi.json` (Zod → OpenAPI 3.1), `/api/docs` (Redoc)
- **SDK** fetcher (no raw HTTP).

### 2.2 Search flow (server-side RRF, single index per scope)

- **Lessons:** one `_search` to `oak_lessons` with `rank.rrf` across `multi_match`(title+teacher fields+transcript) and `semantic`(`lesson_semantic`); highlights from `transcript_text`.
- **Units:** one `_search` to `oak_unit_rollup` with `rank.rrf` across lexical (`unit_title^3`, `rollup_text`, optional `unit_topics^1.5`) and `semantic`(`unit_semantic`); highlights from `rollup_text`.
- **Sequences:** lexical search (optional semantic) to `oak_sequences`.

### 2.3 Why the rollup index?

- Unit pages comprise **many lessons**. Duplicating full transcripts under each unit would explode storage.
- We store **short snippets** per lesson per unit (≈300 chars) in `rollup_text` and copy both `unit_title` and `rollup_text` to `unit_semantic`.
- This enables **semantic recall + unit highlights** without duplication.

---

## 3) Environment & Security

Server-side env (local `.env.local` / Vercel env):

- `ELASTICSEARCH_URL` – HTTPS endpoint
- `ELASTICSEARCH_API_KEY` – API key with index manage/search perms
- `OAK_API_KEY` **or** `OAK_API_BEARER` – SDK auth
- `SEARCH_API_KEY` – protects admin routes
- `AI_PROVIDER` – `openai` or `none` (default `openai`)
- `OPENAI_API_KEY` – required iff `AI_PROVIDER=openai`

**Never** expose these client-side. Admin routes require `x-api-key: ${SEARCH_API_KEY}`.

---

## 4) Index Creation — Settings, Synonyms, Mappings

We’re creating **from scratch** (no migrations). Commands are **idempotent**.

### 4.1 Shared analysis settings (analyzer + normalizer)

We use:

- `oak_text` analyzer = `standard` tokenizer + `lowercase` + `asciifolding` + `synonym_graph` (via updatable synonyms set `oak-syns`).
- `oak_lower` normalizer for case-insensitive keyword filtering.

> We also set `highlight.max_analyzed_offset` high to avoid snippet truncation on long fields.

### 4.2 Create/update synonyms set

File: `scripts/synonyms.json` — curated starter list (KS1–KS4, subjects, themes).

```bash
curl -X PUT "$ELASTICSEARCH_URL/_synonyms/oak-syns" \
  -H "Authorization: ApiKey $ELASTICSEARCH_API_KEY" \
  -H "Content-Type: application/json" \
  --data-binary @scripts/synonyms.json
```

### 4.3 Create indices

> Replace `@payload@` blocks with JSON bodies below. Create each index separately.

#### 4.3.1 `oak_lessons` (lesson search)

```bash
curl -X PUT "$ELASTICSEARCH_URL/oak_lessons" \
  -H "Authorization: ApiKey $ELASTICSEARCH_API_KEY" \
  -H "Content-Type: application/json" \
  --data-binary @- <<'JSON'
{
  "settings": {
    "index": {
      "number_of_shards": 1,
      "number_of_replicas": 1,
      "highlight.max_analyzed_offset": 10000000,
      "analysis": {
        "normalizer": {
          "oak_lower": { "type": "custom", "filter": ["lowercase", "asciifolding"] }
        },
        "filter": {
          "oak_synonyms": { "type": "synonym_graph", "synonyms_set": "oak-syns" }
        },
        "analyzer": {
          "oak_text": {
            "tokenizer": "standard",
            "filter": ["lowercase", "asciifolding", "oak_synonyms"]
          }
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "lesson_id":     { "type": "keyword", "normalizer": "oak_lower", "doc_values": true },
      "lesson_slug":   { "type": "keyword", "normalizer": "oak_lower", "doc_values": true },
      "lesson_title":  {
        "type": "text", "analyzer": "oak_text",
        "fields": {
          "raw": { "type": "keyword", "ignore_above": 256 },
          "sa":  { "type": "search_as_you_type" }
        }
      },
      "title_suggest": {
        "type": "completion",
        "contexts": [
          { "name": "subject", "type": "category" },
          { "name": "key_stage", "type": "category" }
        ]
      },
      "subject_slug":  { "type": "keyword", "normalizer": "oak_lower", "doc_values": true },
      "key_stage":     { "type": "keyword", "normalizer": "oak_lower", "doc_values": true },

      "unit_ids":      { "type": "keyword", "normalizer": "oak_lower" },
      "unit_titles":   { "type": "text", "analyzer": "oak_text" },
      "unit_count":    { "type": "integer" },

      "lesson_keywords":                 { "type": "text", "analyzer": "oak_text" },
      "key_learning_points":             { "type": "text", "analyzer": "oak_text" },
      "misconceptions_and_common_mistakes": { "type": "text", "analyzer": "oak_text" },
      "teacher_tips":                    { "type": "text", "analyzer": "oak_text" },
      "content_guidance":                { "type": "text", "analyzer": "oak_text" },

      "transcript_text": {
        "type": "text",
        "analyzer": "oak_text",
        "term_vector": "with_positions_offsets"
      },

      "lesson_semantic": { "type": "semantic_text" },

      "lesson_url": { "type": "keyword", "ignore_above": 1024, "doc_values": true }
    }
  }
}
JSON
```

#### 4.3.2 `oak_unit_rollup` (primary **unit search** index)

```bash
curl -X PUT "$ELASTICSEARCH_URL/oak_unit_rollup" \
  -H "Authorization: ApiKey $ELASTICSEARCH_API_KEY" \
  -H "Content-Type: application/json" \
  --data-binary @- <<'JSON'
{
  "settings": {
    "index": {
      "number_of_shards": 1,
      "number_of_replicas": 1,
      "highlight.max_analyzed_offset": 10000000,
      "analysis": {
        "normalizer": {
          "oak_lower": { "type": "custom", "filter": ["lowercase", "asciifolding"] }
        },
        "filter": {
          "oak_synonyms": { "type": "synonym_graph", "synonyms_set": "oak-syns" }
        },
        "analyzer": {
          "oak_text": {
            "tokenizer": "standard",
            "filter": ["lowercase", "asciifolding", "oak_synonyms"]
          }
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "unit_id":       { "type": "keyword", "normalizer": "oak_lower", "doc_values": true },
      "unit_slug":     { "type": "keyword", "normalizer": "oak_lower", "doc_values": true },
      "unit_title":    {
        "type": "text", "analyzer": "oak_text",
        "fields": {
          "raw": { "type": "keyword", "ignore_above": 256 },
          "sa":  { "type": "search_as_you_type" }
        },
        "copy_to": ["unit_semantic"]
      },
      "title_suggest": {
        "type": "completion",
        "contexts": [
          { "name": "subject", "type": "category" },
          { "name": "key_stage", "type": "category" }
        ]
      },
      "subject_slug":  { "type": "keyword", "normalizer": "oak_lower", "doc_values": true },
      "key_stage":     { "type": "keyword", "normalizer": "oak_lower", "doc_values": true },

      "lesson_ids":    { "type": "keyword", "normalizer": "oak_lower" },
      "lesson_count":  { "type": "integer" },
      "unit_topics":   { "type": "text", "analyzer": "oak_text" },

      "rollup_text": {
        "type": "text",
        "analyzer": "oak_text",
        "term_vector": "with_positions_offsets",
        "copy_to": ["unit_semantic"]
      },

      "unit_semantic": { "type": "semantic_text" },

      "unit_url": { "type": "keyword", "ignore_above": 1024, "doc_values": true },
      "subject_programmes_url": { "type": "keyword", "ignore_above": 1024, "doc_values": true }
    }
  }
}
JSON
```

#### 4.3.3 `oak_units` (metadata/analytics index)

```bash
curl -X PUT "$ELASTICSEARCH_URL/oak_units" \
  -H "Authorization: ApiKey $ELASTICSEARCH_API_KEY" \
  -H "Content-Type: application/json" \
  --data-binary @- <<'JSON'
{
  "settings": {
    "index": {
      "number_of_shards": 1,
      "number_of_replicas": 1,
      "analysis": {
        "normalizer": {
          "oak_lower": { "type": "custom", "filter": ["lowercase", "asciifolding"] }
        },
        "filter": {
          "oak_synonyms": { "type": "synonym_graph", "synonyms_set": "oak-syns" }
        },
        "analyzer": {
          "oak_text": {
            "tokenizer": "standard",
            "filter": ["lowercase", "asciifolding", "oak_synonyms"]
          }
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "unit_id":       { "type": "keyword", "normalizer": "oak_lower", "doc_values": true },
      "unit_slug":     { "type": "keyword", "normalizer": "oak_lower", "doc_values": true },
      "unit_title":    {
        "type": "text", "analyzer": "oak_text",
        "fields": { "raw": { "type": "keyword", "ignore_above": 256 } }
      },
      "subject_slug":  { "type": "keyword", "normalizer": "oak_lower", "doc_values": true },
      "key_stage":     { "type": "keyword", "normalizer": "oak_lower", "doc_values": true },
      "lesson_ids":    { "type": "keyword", "normalizer": "oak_lower" },
      "lesson_count":  { "type": "integer" },
      "unit_topics":   { "type": "text", "analyzer": "oak_text" },

      "unit_url": { "type": "keyword", "ignore_above": 1024, "doc_values": true },
      "subject_programmes_url": { "type": "keyword", "ignore_above": 1024, "doc_values": true }
    }
  }
}
JSON
```

#### 4.3.4 `oak_sequences` (navigation & discovery)

```bash
curl -X PUT "$ELASTICSEARCH_URL/oak_sequences" \
  -H "Authorization: ApiKey $ELASTICSEARCH_API_KEY" \
  -H "Content-Type: application/json" \
  --data-binary @- <<'JSON'
{
  "settings": {
    "index": {
      "number_of_shards": 1,
      "number_of_replicas": 1,
      "analysis": {
        "normalizer": {
          "oak_lower": { "type": "custom", "filter": ["lowercase", "asciifolding"] }
        },
        "filter": {
          "oak_synonyms": { "type": "synonym_graph", "synonyms_set": "oak-syns" }
        },
        "analyzer": {
          "oak_text": {
            "tokenizer": "standard",
            "filter": ["lowercase", "asciifolding", "oak_synonyms"]
          }
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "sequence_slug":   { "type": "keyword", "normalizer": "oak_lower", "doc_values": true },
      "sequence_title":  { "type": "text", "analyzer": "oak_text" },
      "sequence_url":    { "type": "keyword", "ignore_above": 1024, "doc_values": true },

      "phase_slug":      { "type": "keyword", "normalizer": "oak_lower" },
      "phase_title":     { "type": "text", "analyzer": "oak_text" },

      "subject_slug":    { "type": "keyword", "normalizer": "oak_lower" },
      "subject_title":   { "type": "text", "analyzer": "oak_text" },

      "key_stages":      { "type": "keyword", "normalizer": "oak_lower" },
      "years":           { "type": "integer" },

      "unit_slugs":      { "type": "keyword", "normalizer": "oak_lower" },
      "thread_slugs":    { "type": "keyword", "normalizer": "oak_lower" },
      "category_titles": { "type": "text", "analyzer": "oak_text" }
    }
  }
}
JSON
```

> If you want semantic recall for sequences too, add a `sequence_semantic` field (`semantic_text`) and copy title + categories into it.

---

## 5) Indexing — What to write & how

### 5.1 Canonical URLs (added by SDK)

We index canonical URLs as **keyword** metadata (non-scoring):

- Lessons: `https://www.thenational.academy/teachers/lessons/{lesson_slug}`
- Units (context-aware): `https://www.thenational.academy/teachers/programmes/{subjectSlug}-{phaseSlug}/units/{unit_slug}`
- Subject programmes: `https://www.thenational.academy/teachers/key-stages/{ks}/subjects/{subject_slug}/programmes`
- Sequences: `https://www.thenational.academy/teachers/programmes/{sequence_slug}/units`

### 5.2 Rollup snippets (units)

For each unit, build `rollup_text` by concatenating **short** per-lesson passages (≈300 chars per lesson). Keep it readable (sentence boundaries when possible).

### 5.3 Derived fields

- `unit_count` in lessons = `unit_ids.length`
- `unit_topics` optional in units/rollup (if SDK provides tags, or derive from titles)

### 5.4 Bulk indexing with the official JS client

```ts
import { Client } from '@elastic/elasticsearch';
const es = new Client({
  node: process.env.ELASTICSEARCH_URL,
  auth: { apiKey: process.env.ELASTICSEARCH_API_KEY! },
});

type BulkItem = { index: { _index: string; _id: string } } | Record<string, unknown>;

async function bulkIndex(
  index: string,
  docs: Array<{ id: string; body: Record<string, unknown> }>,
) {
  const body: BulkItem[] = [];
  for (const d of docs) {
    body.push({ index: { _index: index, _id: d.id } });
    body.push(d.body);
  }
  const res = await es.bulk({ refresh: false, body });
  if (res.errors) {
    const items = res.items.filter((i) => (i as any).index?.error);
    console.error('Bulk errors:', items.slice(0, 3));
    throw new Error(`Bulk indexing had errors (${items.length}).`);
  }
}
```

Batch in 250–500 docs, with backoff & jitter on HTTP 429.

### 5.5 Phase slug helper (KS → phase)

```ts
export type KeyStage = 'ks1' | 'ks2' | 'ks3' | 'ks4';
export function phaseSlugFromKeyStage(ks: KeyStage): 'primary' | 'secondary' {
  return ks === 'ks1' || ks === 'ks2' ? 'primary' : 'secondary';
}
```

### 5.6 What to index (field snapshots)

**Lesson doc (`oak_lessons`):**

```json
{
  "lesson_id": "…",
  "lesson_slug": "…",
  "lesson_title": "…",
  "subject_slug": "geography",
  "key_stage": "ks4",
  "unit_ids": ["…"],
  "unit_titles": ["…"],
  "unit_count": 12,
  "lesson_keywords": ["…"],
  "key_learning_points": ["…"],
  "misconceptions_and_common_mistakes": ["…"],
  "teacher_tips": ["…"],
  "content_guidance": "…",
  "transcript_text": "full transcript …",
  "lesson_url": "https://…/teachers/lessons/<slug>"
}
```

**Unit rollup doc (`oak_unit_rollup`):**

```json
{
  "unit_id": "…",
  "unit_slug": "…",
  "unit_title": "…",
  "subject_slug": "geography",
  "key_stage": "ks4",
  "lesson_ids": ["…"],
  "lesson_count": 10,
  "unit_topics": "glaciation; mountains; …",
  "rollup_text": "Short snippets from lesson A … Short snippet from lesson B …",
  "unit_url": "https://…/teachers/programmes/geography-secondary/units/<slug>",
  "subject_programmes_url": "https://…/teachers/key-stages/ks4/subjects/geography/programmes"
}
```

**Unit metadata doc (`oak_units`):**

```json
{
  "unit_id": "…",
  "unit_slug": "…",
  "unit_title": "…",
  "subject_slug": "geography",
  "key_stage": "ks4",
  "lesson_ids": ["…"],
  "lesson_count": 10,
  "unit_topics": "…",
  "unit_url": "https://…/teachers/programmes/geography-secondary/units/<slug>",
  "subject_programmes_url": "https://…/teachers/key-stages/ks4/subjects/geography/programmes"
}
```

**Sequence doc (`oak_sequences`):**

```json
{
  "sequence_slug": "…",
  "sequence_title": "…",
  "sequence_url": "https://…/teachers/programmes/<sequence_slug>/units",
  "phase_slug": "secondary",
  "phase_title": "Secondary",
  "subject_slug": "geography",
  "subject_title": "Geography",
  "key_stages": ["ks3", "ks4"],
  "years": [7, 8, 9, 10, 11],
  "unit_slugs": ["…"],
  "thread_slugs": ["…"],
  "category_titles": ["…", "…"]
}
```

---

## 6) Querying — RRF, highlights, filters, suggestions, facets

### 6.1 Lessons (server-side RRF, one request)

```json
{
  "size": 25,
  "rank": {
    "rrf": { "window_size": 60, "rank_constant": 60 },
    "queries": [
      {
        "multi_match": {
          "query": "mountains",
          "type": "best_fields",
          "tie_breaker": 0.2,
          "fields": [
            "lesson_title^3",
            "lesson_keywords^2",
            "key_learning_points^2",
            "misconceptions_and_common_mistakes",
            "teacher_tips",
            "content_guidance",
            "transcript_text"
          ]
        }
      },
      { "semantic": { "field": "lesson_semantic", "query": "mountains" } }
    ]
  },
  "query": {
    "bool": {
      "filter": [{ "term": { "subject_slug": "geography" } }, { "term": { "key_stage": "ks4" } }]
    }
  },
  "highlight": {
    "type": "unified",
    "order": "score",
    "fields": {
      "transcript_text": {
        "fragment_size": 160,
        "number_of_fragments": 2,
        "boundary_scanner": "sentence"
      }
    }
  }
}
```

### 6.2 Units (server-side RRF on `oak_unit_rollup`, one request)

```json
{
  "size": 25,
  "rank": {
    "rrf": { "window_size": 60, "rank_constant": 60 },
    "queries": [
      {
        "multi_match": {
          "query": "mountains",
          "fields": ["unit_title^3", "rollup_text", "unit_topics^1.5"],
          "type": "best_fields",
          "tie_breaker": 0.2
        }
      },
      { "semantic": { "field": "unit_semantic", "query": "mountains" } }
    ]
  },
  "query": {
    "bool": {
      "filter": [
        { "term": { "subject_slug": "geography" } },
        { "term": { "key_stage": "ks4" } },
        { "range": { "lesson_count": { "gte": 3 } } }
      ]
    }
  },
  "highlight": {
    "type": "unified",
    "fields": {
      "rollup_text": {
        "fragment_size": 160,
        "number_of_fragments": 2,
        "boundary_scanner": "sentence"
      }
    }
  }
}
```

### 6.3 Sequences (lexical; semantic optional)

```json
{
  "size": 25,
  "query": {
    "bool": {
      "must": [
        {
          "multi_match": {
            "query": "geography ks4",
            "fields": ["sequence_title^2", "category_titles", "subject_title", "phase_title"]
          }
        }
      ],
      "filter": [
        { "term": { "subject_slug": "geography" } },
        { "term": { "phase_slug": "secondary" } }
      ]
    }
  }
}
```

### 6.4 Type-ahead (search-as-you-type)

```json
{
  "size": 10,
  "query": {
    "multi_match": {
      "query": "mount",
      "type": "bool_prefix",
      "fields": ["lesson_title.sa", "lesson_title.sa._2gram", "lesson_title.sa._3gram"]
    }
  }
}
```

### 6.5 Suggestions (completion with contexts)

```json
{
  "suggest": {
    "by_title": {
      "prefix": "mount",
      "completion": {
        "field": "title_suggest",
        "size": 10,
        "contexts": {
          "subject": ["geography"],
          "key_stage": ["ks4"]
        }
      }
    }
  }
}
```

### 6.6 Facets / Aggregations (optional)

- Terms aggs on `subject_slug`, `key_stage`
- Range agg on `lesson_count` (units)
- Admin analytics: sum(lesson_count) by subject; top lessons by `unit_count`

Example (units facet):

```json
{
  "size": 0,
  "query": { "bool": { "filter": [{ "term": { "subject_slug": "geography" } }] } },
  "aggs": {
    "key_stages": { "terms": { "field": "key_stage", "size": 10 } },
    "lesson_count_ranges": {
      "range": {
        "field": "lesson_count",
        "ranges": [{ "to": 3 }, { "from": 3, "to": 6 }, { "from": 6 }]
      }
    }
  }
}
```

---

## 7) Endpoints & OpenAPI (service usage)

- **Structured search**: `POST /api/search` — LLM-free; body validates subject/keyStage via SDK guards.
- **Natural language**: `POST /api/search/nl` — LLM optional; converts `{q}` to structured and calls same core.
- **Admin**: `GET /api/index-oak`, `GET /api/rebuild-rollup` — protected by `x-api-key`.
- **Docs**: `GET /api/openapi.json` (OpenAPI 3.1), `GET /api/docs` (Redoc).

> The service now favors **server-side RRF** queries (one request per scope) and returns highlight snippets and metadata (including canonical URLs).

---

## 8) Maintenance & Ops

### 8.1 Synonyms lifecycle

- Update `scripts/synonyms.json` and PUT to `/_synonyms/oak-syns`.
- Optionally close/open indices to refresh analyzers for completed shards.

### 8.2 Re-indexing

- Content is fairly static; schedule a nightly refresh to catch changes.
- For breaking mapping changes in the future, adopt **versioned indices + alias swap**.

### 8.3 Performance tips

- Batch bulk indexing (250–500 docs), with retry on 429.
- Keep `terms.size` modest in facets; turn on facets only when requested.
- Prefer one index per scope to leverage **server-side RRF**.

### 8.4 Observability

- Log slow queries and bulk failures.
- Track “zero-hit” queries to enrich synonyms or metadata.

### 8.5 Security

- Never expose ES or SDK keys client-side.
- Rate-limit admin endpoints if exposed beyond internal use.

---

## 9) Appendix

### 9.1 Example: Lessons server-side RRF via JS client

```ts
import { Client } from '@elastic/elasticsearch';
const es = new Client({
  node: process.env.ELASTICSEARCH_URL,
  auth: { apiKey: process.env.ELASTICSEARCH_API_KEY! },
});

export async function searchLessons(q: string, subject?: string, keyStage?: string) {
  const body: Record<string, unknown> = {
    size: 25,
    rank: {
      rrf: { window_size: 60, rank_constant: 60 },
      queries: [
        {
          multi_match: {
            query: q,
            type: 'best_fields',
            tie_breaker: 0.2,
            fields: [
              'lesson_title^3',
              'lesson_keywords^2',
              'key_learning_points^2',
              'misconceptions_and_common_mistakes',
              'teacher_tips',
              'content_guidance',
              'transcript_text',
            ],
          },
        },
        { semantic: { field: 'lesson_semantic', query: q } },
      ],
    },
    query: {
      bool: {
        filter: [
          ...(subject ? [{ term: { subject_slug: subject } }] : []),
          ...(keyStage ? [{ term: { key_stage: keyStage } }] : []),
        ],
      },
    },
    highlight: {
      type: 'unified',
      order: 'score',
      fields: {
        transcript_text: {
          fragment_size: 160,
          number_of_fragments: 2,
          boundary_scanner: 'sentence',
        },
      },
    },
  };

  const res = await es.search({ index: 'oak_lessons', body });
  return res.hits.hits;
}
```

### 9.2 Example: Units server-side RRF via JS client

```ts
export async function searchUnits(
  q: string,
  subject?: string,
  keyStage?: string,
  minLessons?: number,
) {
  const filters = [
    ...(subject ? [{ term: { subject_slug: subject } }] : []),
    ...(keyStage ? [{ term: { key_stage: keyStage } }] : []),
    ...(typeof minLessons === 'number' ? [{ range: { lesson_count: { gte: minLessons } } }] : []),
  ];

  const body = {
    size: 25,
    rank: {
      rrf: { window_size: 60, rank_constant: 60 },
      queries: [
        {
          multi_match: {
            query: q,
            fields: ['unit_title^3', 'rollup_text', 'unit_topics^1.5'],
            type: 'best_fields',
            tie_breaker: 0.2,
          },
        },
        { semantic: { field: 'unit_semantic', query: q } },
      ],
    },
    query: { bool: { filter: filters } },
    highlight: {
      type: 'unified',
      fields: {
        rollup_text: { fragment_size: 160, number_of_fragments: 2, boundary_scanner: 'sentence' },
      },
    },
  } as const;

  const res = await es.search({ index: 'oak_unit_rollup', body });
  return res.hits.hits;
}
```

### 9.3 Suggest: completion with contexts

```ts
export async function suggestTitles(prefix: string, subject?: string, keyStage?: string) {
  const res = await es.search({
    index: 'oak_unit_rollup',
    body: {
      suggest: {
        by_title: {
          prefix,
          completion: {
            field: 'title_suggest',
            size: 10,
            contexts: {
              ...(subject ? { subject: [subject] } : {}),
              ...(keyStage ? { key_stage: [keyStage] } : {}),
            },
          },
        },
      },
    },
  });
  return (res as any).suggest.by_title[0].options ?? [];
}
```

### 9.4 Facet example (units — subjects & lesson ranges)

```ts
export async function facetUnits(subject?: string) {
  const body: any = {
    size: 0,
    query: { bool: { filter: [...(subject ? [{ term: { subject_slug: subject } }] : [])] } },
    aggs: {
      subjects: { terms: { field: 'subject_slug', size: 50 } },
      key_stages: { terms: { field: 'key_stage', size: 10 } },
      lesson_count_ranges: {
        range: { field: 'lesson_count', ranges: [{ to: 3 }, { from: 3, to: 6 }, { from: 6 }] },
      },
    },
  };
  const res = await es.search({ index: 'oak_unit_rollup', body });
  return res.aggregations;
}
```

### 9.5 Synonyms update (hot) & analyzer refresh

```bash
curl -X PUT "$ELASTICSEARCH_URL/_synonyms/oak-syns" \
  -H "Authorization: ApiKey $ELASTICSEARCH_API_KEY" \
  -H "Content-Type: application/json" \
  --data-binary @scripts/synonyms.json

# Optional analyzer refresh
for idx in oak_lessons oak_unit_rollup oak_units oak_sequences; do
  curl -X POST "$ELASTICSEARCH_URL/$idx/_close"  -H "Authorization: ApiKey $ELASTICSEARCH_API_KEY"
  curl -X POST "$ELASTICSEARCH_URL/$idx/_open"   -H "Authorization: ApiKey $ELASTICSEARCH_API_KEY"
done
```

---

## 10) FAQ

- **Why one index per scope for RRF?**  
  ES server-side RRF operates over the **`queries` array** inside a single `_search` on a single index. Unifying per scope enables one request, one fusion, consistent scoring, and simpler code.

- **Can we add custom vectors later?**  
  Yes. Add a `dense_vector` field, query with ANN (`knn_search`) in parallel, and include that result as another RRF `query`. Keep everything else unchanged.

- **Do we need more aggs?**  
  Keep production responses lean. Expose facets via an explicit flag or dedicated endpoints. Use terms/range for UX; sum/avg for admin analytics; `significant_terms` optionally for discovery.

- **What about analyzers on keyword fields?**  
  We use a **normalizer** (`oak_lower`) for case-insensitive exact filtering. Do **not** assign analyzers to keywords.

---

### End of Document
