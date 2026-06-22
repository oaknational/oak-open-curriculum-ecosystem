# Listing and Pagination Examples

These examples cover lesson/unit listing behaviour, pagination, and KS4 science access patterns.

## Example 1: Lessons endpoint pagination bug

**Request**

```http
GET /api/v0/key-stages/ks4/subject/maths/lessons?offset=0&limit=20
```

**Current behaviour (observed)**

- Results are truncated when no filters are applied.
- The endpoint returns fewer lessons than expected relative to bulk download and filtered variants.

**Desired behaviour**

- Consistent pagination with complete coverage across all lessons.

## Example 2: Unit summary truncation

**Request**

```http
GET /api/v0/units/algebraic-fractions/summary
```

**Current behaviour (observed)**

```json
{
  "unitSlug": "algebraic-fractions",
  "unitLessons": [
    { "lessonSlug": "lesson-slug-1", "lessonOrder": 1 },
    { "lessonSlug": "lesson-slug-2", "lessonOrder": 2 }
    // ... missing lessons
  ]
}
```

**Desired behaviour**

- `unitLessons` includes all lessons that belong to the unit in the authoritative source.

## Example 3: KS4 science access via sequences

**Request (non-working for KS4 science)**

```http
GET /api/v0/key-stages/ks4/subject/science/lessons
```

**Current response (observed)**

```json
[]
```

**Working approach**

```http
GET /api/v0/sequences/science-secondary-aqa/units
```

**Example response snippet (Year 10)**

```json
{
  "year": 10,
  "examSubjects": [
    {
      "examSubjectSlug": "chemistry",
      "tiers": [
        { "tierSlug": "foundation", "units": ["unit-slug-1"] },
        { "tierSlug": "higher", "units": ["unit-slug-1", "unit-slug-2"] }
      ]
    }
  ]
}
```

**Desired documentation**

- Clarify that KS4 science is accessed via sequences and nested exam subjects.
