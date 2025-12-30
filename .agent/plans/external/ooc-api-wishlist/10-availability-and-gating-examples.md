# Availability and Gating Examples

These examples illustrate current behaviour and desired documentation/metadata for availability gating (blocked subjects, allowlists, and licensing constraints).

## Example 1: Blocked sequence subjects (current: 400 without reason code)

**Request**

```http
GET /api/v0/sequences/rshe-pshe-primary/units
```

**Current response (observed)**

```json
{
  "error": {
    "message": "The subject \"rshe-pshe\" is not currently available"
  }
}
```

**Desired response (documented + reason code)**

```json
{
  "error": "not_available",
  "reason": "blocked_subject",
  "subject": "rshe-pshe"
}
```

## Example 2: Lesson summary blocked for copyright text

**Request**

```http
GET /api/v0/lessons/some-lesson/summary
```

**Current response (observed)**

```json
{
  "error": {
    "message": "Lesson not available for this query (blocked for copyright text)"
  }
}
```

**Desired response (documented + reason code)**

```json
{
  "error": "not_available",
  "reason": "copyright_text_block",
  "lessonSlug": "some-lesson"
}
```

## Example 3: Assets allowlists and TPC filtering

Assets endpoints return only lessons cleared for downloadable resources. This can lead to partial coverage for a subject/key stage.

**Request**

```http
GET /api/v0/key-stages/ks2/subject/art/assets
```

**Current response (observed)**

```json
[
  {
    "lessonSlug": "a-lesson-with-downloads",
    "assets": [ { "type": "slideDeck", "url": "..." } ]
  }
]
```

**Desired response metadata (to make filtering explicit)**

```json
{
  "availability": {
    "tpcFiltering": true,
    "allowlistApplied": true,
    "coverage": "partial"
  },
  "lessons": [
    {
      "lessonSlug": "a-lesson-with-downloads",
      "assets": [ { "type": "slideDeck", "url": "..." } ]
    }
  ]
}
```
