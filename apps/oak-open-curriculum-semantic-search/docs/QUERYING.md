# Query Patterns

The definitive architecture uses **server-side Reciprocal Rank Fusion (RRF)** to combine lexical and semantic relevance in a single Elasticsearch `_search` per scope. This guide documents the canonical request bodies and highlights, facet, and suggestion behaviour.

## Lessons (`oak_lessons`)

```json
{
  "size": 25,
  "rank": {
    "rrf": { "window_size": 60, "rank_constant": 60 },
    "queries": [
      {
        "multi_match": {
          "query": "mountain formation",
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
      { "semantic": { "field": "lesson_semantic", "query": "mountain formation" } }
    ]
  },
  "query": {
    "bool": {
      "filter": [
        { "term": { "subject_slug": "geography" } },
        { "term": { "key_stage": "ks4" } },
        { "terms": { "years": ["year-10", "year-11"] } }
      ]
    }
  },
  "highlight": {
    "type": "unified",
    "order": "score",
    "boundary_scanner": "sentence",
    "fields": {
      "transcript_text": {
        "fragment_size": 160,
        "number_of_fragments": 2,
        "pre_tags": ["<mark>"],
        "post_tags": ["</mark>"]
      }
    }
  },
  "aggs": {
    "key_stages": { "terms": { "field": "key_stage", "size": 10 } },
    "subjects": { "terms": { "field": "subject_slug", "size": 20 } }
  }
}
```

Notes:

- Keep lexical fields focused on lesson-planning data and transcripts to avoid semantic dilution.
- Highlights rely on `term_vector` support; ensure `highlight.max_analyzed_offset` is high enough.
- Facets should only be included when the client requests them to minimise response size.

## Units (`oak_unit_rollup`)

```json
{
  "size": 25,
  "rank": {
    "rrf": { "window_size": 60, "rank_constant": 60 },
    "queries": [
      {
        "multi_match": {
          "query": "glaciation",
          "type": "best_fields",
          "tie_breaker": 0.2,
          "fields": ["unit_title^3", "rollup_text", "unit_topics^1.5"]
        }
      },
      { "semantic": { "field": "unit_semantic", "query": "glaciation" } }
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
    "boundary_scanner": "sentence",
    "fields": {
      "rollup_text": {
        "fragment_size": 160,
        "number_of_fragments": 2,
        "pre_tags": ["<mark>"],
        "post_tags": ["</mark>"]
      }
    }
  },
  "aggs": {
    "lesson_count_ranges": {
      "range": {
        "field": "lesson_count",
        "ranges": [{ "to": 3 }, { "from": 3, "to": 6 }, { "from": 6 }]
      }
    }
  }
}
```

Notes:

- Filters belong in `bool.filter` to avoid impacting scoring.
- `unit_topics` provides topical boost; keep synonyms aligned with `oak-syns`.

## Sequences (`oak_sequences`)

```json
{
  "size": 25,
  "rank": {
    "rrf": {
      "window_size": 40,
      "rank_constant": 40
    },
    "queries": [
      {
        "multi_match": {
          "query": "secondary geography",
          "type": "best_fields",
          "fields": ["sequence_title^2", "category_titles", "subject_title", "phase_title"]
        }
      },
      { "semantic": { "field": "sequence_semantic", "query": "secondary geography" } }
    ]
  },
  "query": {
    "bool": {
      "filter": [
        { "term": { "subject_slug": "geography" } },
        { "term": { "phase_slug": "secondary" } }
      ]
    }
  }
}
```

Notes:

- Omit the semantic clause if `sequence_semantic` not populated yet.
- Return canonical URLs so the UI can deep link to sequence pages.

## Suggestion / type-ahead (`POST /api/search/suggest`)

```json
{
  "prefix": "mount",
  "scope": "lessons",
  "subject": "geography",
  "keyStage": "ks4",
  "limit": 10
}
```

Response structure:

```json
{
  "suggestions": [
    {
      "label": "Mountains and glaciation",
      "scope": "lessons",
      "subject": "geography",
      "keyStage": "ks4",
      "url": "https://www.thenational.academy/...",
      "contexts": { "sequenceId": "seq-123" }
    }
  ],
  "cache": {
    "version": "v2025-03-16",
    "ttlSeconds": 60
  }
}
```

## Zero-hit logging

Whenever a search returns zero hits, log:

```json
{
  "event": "semantic-search.zero-hit",
  "scope": "units",
  "text": "mountain formation",
  "filters": {
    "subject": "geography",
    "keyStage": "ks4"
  },
  "indexVersion": "v2025-03-16"
}
```

These events feed observability pipelines and should trigger UI feedback on the admin console.

### Persisted telemetry

Zero-hit summaries can be persisted to Elasticsearch Serverless when `ZERO_HIT_PERSISTENCE_ENABLED=true` in the app environment. The helper resolves the index name from the current search target:

- `primary` → `oak_zero_hit_events`
- `sandbox` → `oak_zero_hit_events_sandbox`

Persistence automatically provisions an ILM policy (`oak_zero_hit_events_retention_<days>d`) and assigns it to the index so documents older than `ZERO_HIT_INDEX_RETENTION_DAYS` (default 30) are deleted once they age out of the hot tier. Index creation and policy provisioning happen lazily the first time an event is written.

When the index is absent (e.g. fresh sandbox), the dashboard gracefully falls back to empty telemetry until the first event lands. The in-memory ring buffer remains available for non-persisted deployments and webhook consumers, but the admin dashboard reads from Elasticsearch whenever persistence is enabled.

### Manual purges

Use the CLI to purge old events when manual intervention is required (for example, expiring data sooner in a sandbox):

```bash
pnpm -C apps/oak-open-curriculum-semantic-search zero-hit:purge --force \
  --target sandbox \
  --older-than-days 7
```

The script issues a `delete_by_query` request targeting `@timestamp < now-<days>d`. The `--force` flag is mandatory to prevent accidental deletions.

## Implementation guidance

- Build queries using pure functions (see `src/lib/queries`) so they are unit testable.
- Always normalise filters (lowercase slugs) before hashing for caching.
- Update this document and corresponding tests whenever mappings or query logic change.

For more context, review `semantic-search-api-plan.md` and the caching plan to see how queries integrate with versioned caching.
