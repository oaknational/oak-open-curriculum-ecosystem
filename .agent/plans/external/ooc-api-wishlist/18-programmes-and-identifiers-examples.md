# Programmes and Identifiers Examples

These examples cover flat tier/examBoard fields, programme variant metadata, and consistent resource identifiers.

## Example 1: Flat tier/examBoard fields on lesson/unit

```json
{
  "lessonSlug": "lesson-slug-1",
  "tier": "foundation",
  "examBoard": "aqa",
  "keyStageSlug": "ks4",
  "subjectSlug": "science"
}
```

## Example 2: Programme variants endpoint

```http
GET /api/v0/programmes?subject=biology&keyStage=ks4&tier=foundation&examBoard=aqa
```

```json
{
  "programmes": [
    {
      "programmeSlug": "biology-secondary-ks4-foundation-aqa",
      "programmeTitle": "Biology Foundation AQA",
      "examBoard": { "slug": "aqa", "title": "AQA" },
      "canonicalUrl": "https://www.thenational.academy/teachers/programmes/biology-secondary-ks4-foundation-aqa"
    }
  ]
}
```

## Example 3: Consistent resource identifiers

```json
{
  "lessonSlug": "roman-invasion-of-britain",
  "owaSlug": "roman-invasion-of-britain",
  "lessonId": "lesson-id-1"
}
```
