# Assets and Transcripts Examples

These examples focus on assets endpoints, binary responses, and transcript availability.

## Example 1: `/sequences/{sequence}/assets` year filter ignored

**Request**

```http
GET /api/v0/sequences/maths-primary/assets?year=3
```

**Current response (observed)**

- Returns assets for all years in the sequence, not just year 3.

**Desired response**

- Only lessons in year 3.
- Or remove the `year` parameter until it is supported.

## Example 2: Lesson asset download returns binary data

**Request**

```http
GET /api/v0/lessons/some-lesson/assets/slideDeck
```

**Current OpenAPI**

- Declares a JSON response schema, which generates `z.unknown()` in codegen.

**Desired OpenAPI**

- `contentTypes: ['application/octet-stream']`
- No JSON schema for the response body (or an empty schema explicitly documented as binary).

## Example 3: Transcript availability (empty 200 vs 404)

**Request**

```http
GET /api/v0/lessons/some-lesson/transcript
```

**Current response (observed)**

```json
{ "transcript": "", "vtt": "" }
```

**Desired response (when no transcript exists)**

```json
{
  "error": "not_found",
  "reason": "no_video"
}
```

**Related maths-specific enhancements:** `21-maths-education-enhancements.md` items 6 and 7 (transcript segments and maths-aware transcript search).
