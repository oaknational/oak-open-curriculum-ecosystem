# Request/Response Examples (Scenario-based)

These examples are illustrative and use real schema shapes from the legacy and semantic search stacks. Payloads use placeholder IDs and truncated fields for clarity. Semantic search examples are transport-agnostic SDK contract payloads (no `app/api` layer).

## Legacy base URLs (provided)

- Legacy search API (2023): `https://curriculum-search-api-beta.thenational.academy/v2`
- Legacy search API (older): `https://search-staging.oaknational.workers.dev`

## Scenario 1: Legacy search – basic keyword (lessons + units)

**Request** (legacy v2, OWA → search API):

```http
POST https://curriculum-search-api-beta.thenational.academy/v2
Content-Type: application/json

{
  "term": "macbeth",
  "keyStages": ["ks4"],
  "subjects": ["english"],
  "contentTypes": ["lesson", "unit"],
  "examBoards": ["aqa"],
  "yearGroups": ["year-10"],
  "legacy": "filterOutEYFS"
}
```

**Response** (legacy ES response shape, abbreviated):

```json
{
  "took": 50,
  "timed_out": false,
  "hits": {
    "hits": [
      {
        "_id": "Z38Yx44Bc8iIk5N9Klp6",
        "_index": "lessons_1712737230873",
        "_score": 104.2,
        "_source": {
          "lessonSlug": "the-relationship-between-macbeth-and-lady-macbeth",
          "lessonTitle": "The relationship between Macbeth and Lady Macbeth",
          "unitSlug": "macbeth-lady-macbeth-as-a-machiavellian-villain",
          "unitTitle": "Macbeth: Lady Macbeth as a machiavellian villain",
          "keyStageSlug": "ks4",
          "subjectSlug": "english",
          "examBoardSlug": "eduqas",
          "yearSlug": "year-10",
          "type": "lesson",
          "pathways": []
        },
        "highlight": {
          "pupilLessonOutcome": ["I can describe the relationship between <b>Macbeth</b>..."]
        }
      }
    ]
  }
}
```

## Scenario 2: Legacy search – AI filter suggestions (intent endpoint)

**Note**: This legacy intent endpoint is outside the scope of this repo's delivery surface.

**Request**:

```http
GET https://www.thenational.academy/api/search/intent?v=1&searchTerm=maths%20fractions
```

**Response** (shape from `searchIntentSchema`):

```json
{
  "directMatch": {
    "subject": { "slug": "maths", "title": "Maths" },
    "keyStage": null,
    "year": null,
    "examBoard": null
  },
  "suggestedFilters": [
    { "type": "key-stage", "slug": "ks2", "title": "Key Stage 2" },
    { "type": "key-stage", "slug": "ks3", "title": "Key Stage 3" }
  ]
}
```

## Scenario 3: Semantic search – structured lessons query (SDK contract)

**SDK request payload** (`SearchStructuredRequest`):

```json
{
  "scope": "lessons",
  "text": "mountain formation",
  "subject": "geography",
  "keyStage": "ks4",
  "includeFacets": true,
  "size": 25,
  "from": 0
}
```

**Response** (hybrid response shape, abbreviated):

```json
{
  "scope": "lessons",
  "results": [
    {
      "id": "lesson-123",
      "rankScore": 4.82,
      "lesson": {
        "lesson_id": "lesson-123",
        "lesson_slug": "mountain-formation",
        "lesson_title": "Mountain formation",
        "subject_slug": "geography",
        "key_stage": "ks4",
        "lesson_url": "https://www.thenational.academy/teachers/lessons/mountain-formation"
      },
      "highlights": ["<mark>mountain</mark> formation ..."]
    }
  ],
  "total": 84,
  "took": 42,
  "timedOut": false,
  "aggregations": {
    "subjects": { "doc_count_error_upper_bound": 0, "sum_other_doc_count": 0, "buckets": [] }
  },
  "facets": {
    "subjects": [],
    "keyStages": []
  }
}
```

## Scenario 4: Semantic search – units with minimum lessons (SDK contract)

**SDK request payload** (`SearchStructuredRequest`):

```json
{
  "scope": "units",
  "text": "glaciation",
  "subject": "geography",
  "keyStage": "ks4",
  "minLessons": 3
}
```

**Response** (abbreviated):

```json
{
  "scope": "units",
  "results": [
    {
      "id": "unit-456",
      "rankScore": 3.11,
      "unit": {
        "unit_id": "unit-456",
        "unit_slug": "glaciation",
        "unit_title": "Glaciation",
        "lesson_count": 5,
        "unit_url": "https://www.thenational.academy/teachers/programmes/geography-secondary/units/glaciation"
      },
      "highlights": ["... glaciers <mark>formation</mark> ..."]
    }
  ],
  "total": 12,
  "took": 30,
  "timedOut": false
}
```

## Scenario 5: Semantic search – multi-scope buckets (SDK contract)

**SDK request payload** (`SearchStructuredRequest`):

```json
{
  "scope": "all",
  "text": "photosynthesis",
  "subject": "science"
}
```

**Response** (multi-bucket, abbreviated):

```json
{
  "scope": "all",
  "buckets": [
    { "scope": "lessons", "result": { "scope": "lessons", "results": [], "total": 0, "took": 20, "timedOut": false } },
    { "scope": "units", "result": { "scope": "units", "results": [], "total": 0, "took": 18, "timedOut": false } },
    { "scope": "sequences", "result": { "scope": "sequences", "results": [], "total": 0, "took": 15, "timedOut": false } }
  ],
  "suggestions": [
    { "label": "Photosynthesis", "scope": "lessons", "url": "https://www.thenational.academy/..." }
  ]
}
```

## Scenario 6: Typeahead suggestions (planned SDK surface)

**Status**: ES data exists for completion contexts, but UI/MCP integration is pending.

**SDK request payload** (planned suggestion contract):

```json
{
  "prefix": "mount",
  "scope": "lessons",
  "subject": "geography",
  "keyStage": "ks4",
  "limit": 5
}
```

**Response shape** (abbreviated):

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
  "cache": { "version": "v2025-03-16", "ttlSeconds": 60 }
}
```
