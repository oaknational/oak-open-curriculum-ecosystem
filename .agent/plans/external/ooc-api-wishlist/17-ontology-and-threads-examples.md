# Ontology and Threads Examples

These examples focus on the proposed `/ontology` endpoint and enriched thread metadata.

## Example 1: `/ontology` endpoint

```json
{
  "entities": {
    "lesson": {
      "primaryKey": "lessonSlug",
      "fields": ["lessonTitle", "keyStageSlug", "subjectSlug"]
    },
    "unit": {
      "primaryKey": "unitSlug",
      "fields": ["unitTitle", "year", "keyStageSlug"]
    }
  },
  "relationships": [
    { "from": "unit", "to": "lesson", "type": "contains" },
    { "from": "sequence", "to": "unit", "type": "contains" }
  ]
}
```

## Example 2: Enriched thread metadata

```json
{
  "threads": [
    {
      "slug": "number",
      "title": "Number",
      "description": "Core number concepts from counting to surds",
      "keyStagesCovered": ["ks1", "ks2", "ks3", "ks4"],
      "unitCount": 118
    }
  ]
}
```

## Example 3: Thread units with progression metadata

```json
{
  "threadSlug": "number",
  "units": [
    {
      "unitSlug": "counting-recognising-and-comparing-numbers-0-10",
      "unitTitle": "Counting, recognising and comparing numbers 0-10",
      "unitOrder": 15,
      "keyStageSlug": "ks1",
      "year": 1,
      "prerequisiteUnits": [],
      "nextUnits": [16, 19]
    }
  ]
}
```

**Related maths-specific enhancements:** `21-maths-education-enhancements.md` items 2 and 5 (lesson-level thread tags and representation tags).
