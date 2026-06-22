# Schema and Metadata Examples

These examples cover descriptive metadata, schema quality, and OpenAPI patterns used in the wishlist.

## Example 1: "Use this when" descriptions

```yaml
/lessons/{lesson}/summary:
  get:
    summary: Lesson summary
    description: |
      Use this when you need the core teaching metadata for a single lesson
      (keywords, key learning points, misconceptions, and teacher tips).
```

## Example 2: Operation summaries

```yaml
/search/lessons:
  get:
    summary: Lesson search by title
    description: Searches lesson titles for lexical similarity.
```

## Example 3: Error response docs

```yaml
/lessons/{lesson}/transcript:
  get:
    responses:
      '404':
        description: Transcript not available for this lesson
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ErrorResponse'
            examples:
              noTranscript:
                value:
                  error: not_found
                  reason: no_video
```

## Example 4: Parameter examples

```yaml
parameters:
  - name: year
    in: query
    schema:
      type: string
      enum: ["1", "2", "3", "4", "5", "6", "all-years"]
      example: "3"
    description: Year group to filter by.
```

## Example 5: Custom schema extensions

```yaml
/search/lessons:
  get:
    x-oak-metadata:
      category: "discovery"
      use-cases: ["lesson-planning", "resource-discovery"]
      read-only: true
      typical-response-time-ms: 200
```

## Example 6: Behavioural metadata

```yaml
/lessons/{lesson}/assets:
  get:
    x-oak-behavior:
      readOnly: true
      idempotent: true
      requiresConfirmation: false
      retryable: true
```

## Example 7: Standardise types with `$ref`

```yaml
components:
  parameters:
    YearQueryParameter:
      name: year
      in: query
      schema:
        $ref: '#/components/schemas/Year'
```

## Example 8: Response examples

```yaml
responses:
  '200':
    content:
      application/json:
        examples:
          minimal:
            value: { "lessonSlug": "roman-invasion-of-britain" }
```

## Example 9: Canonical URL patterns

```yaml
/lessons/{lesson}/summary:
  get:
    x-oak-canonical-url:
      template: "https://www.thenational.academy/teachers/lessons/{lesson}"
      context: "lesson"
```

## Example 10: Resource timestamps

```yaml
components:
  schemas:
    ResourceTimestamp:
      type: object
      properties:
        resourceSlug: { type: string }
        updatedAt: { type: string, format: date-time }
```

## Example 11: Performance hints

```yaml
/search/transcripts:
  get:
    x-oak-performance:
      expected-latency-ms: 800
      cost: "high"
      best-use: "batch or background indexing"
```

## Example 12: OpenAPI best practices

```yaml
info:
  title: "Oak Open Curriculum API"
  version: "v0"
  description: "Public curriculum API for lessons, units, and resources."
tags:
  - name: lessons
    description: "Lesson summaries, search, and transcripts."
```
