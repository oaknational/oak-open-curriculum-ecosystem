# Validation and Schema Examples

These examples cover Zod validator export, `z.unknown()` exceptions, and schema questions.

## Example 1: `/schemas` bundle (Zod validators)

```json
{
  "version": "v0",
  "generatedAt": "2025-01-05T12:00:00Z",
  "schemas": {
    "LessonSummaryResponse": {
      "zodSource": "export const lessonSummaryResponseSchema = z.object({ ... })",
      "jsonSchema": { "type": "object", "properties": { } }
    }
  }
}
```

## Example 2: Legitimate `z.unknown()` exceptions

```typescript
// Elasticsearch aggregations can be dynamic, so schema uses z.unknown()
const aggregationsSchema = z.unknown();
```

## Example 3: Binary responses and schema gaps

```yaml
/lessons/{lesson}/assets/{type}:
  get:
    contentTypes: ['application/octet-stream']
    responses:
      '200':
        description: Binary file stream
```

## Example 4: OpenAPI 3.1 and path-level examples (if supported)

```yaml
paths:
  /lessons/{lesson}/summary:
    get:
      examples:
        basic:
          summary: "Example lesson summary request"
          value:
            lesson: "roman-invasion-of-britain"
```
