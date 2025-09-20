# Query Patterns

Hybrid search hinges on **server-side Reciprocal Rank Fusion (RRF)** so we can combine lexical and semantic relevance in a single Elasticsearch `_search` request per scope. This document summarises the queries we issue and how to extend them safely.

## Lessons (`oak_lessons`)

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

### Notes

- Keep lexical fields tightly scoped to avoid noisy semantic boosts (teacher metadata + transcript).
- Adjust boosts cautiously; lexical dominance risks drowning semantic scores in the fused ranking.
- Highlights rely on `term_vector: with_positions_offsets` for `transcript_text`.

## Units (`oak_unit_rollup`)

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

### Notes

- `rollup_text` holds stitched lesson snippets; semantic recall works because `unit_semantic` mirrors those contents via `copy_to`.
- Range filters (e.g. minimum lessons) sit in `bool.filter` to keep scoring unaffected.
- For facets, augment the body with `aggs` rather than separate requests to minimise round trips.

## Sequences (`oak_sequences`)

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

Add a `semantic` query if we introduce a `sequence_semantic` field in future.

## Type-ahead (`search_as_you_type`)

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

## Completion suggestions

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

## Facets / aggregations

Attach aggregations only when the client explicitly requests them to keep responses lean.

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

## Implementation tips

- Keep RRF `window_size` and `rank_constant` consistent across scopes unless we have strong evidence to adjust.
- When adding a new semantic component (e.g. ANN `knn_search`), include it as another entry inside `rank.queries` to preserve the fusion pattern.
- Log query bodies (with sensitive data stripped) alongside response timings to inform synonym and analyser tuning.
