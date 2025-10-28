# Transcript Validation Findings - ROOT CAUSE IDENTIFIED

## Issue

The `get-lessons-transcript` tool returns a validation error for the `making-apple-flapjack-bites` lesson:

```text
Execution failed: Invalid response payload. Please match the generated output schema.
```

## Root Cause

**The API returns HTTP 404 for lessons without transcripts, but the OpenAPI schema only defines a 200 response.**

### Actual API Behavior

When requesting a transcript for a lesson that doesn't have video content:

**Request:**

```bash
GET /api/v0/lessons/making-apple-flapjack-bites/transcript
```

**Response:**

```http
HTTP/2 404
Content-Type: application/json

{
  "message": "Transcript not available for this query",
  "code": "NOT_FOUND",
  "data": {
    "code": "NOT_FOUND",
    "httpStatus": 404,
    "path": "getLessonTranscript.getLessonTranscript",
    "zodError": null
  }
}
```

### OpenAPI Schema (Current)

The schema at `packages/sdks/oak-curriculum-sdk/schema-cache/api-schema-original.json` only defines:

```json
{
  "/lessons/{lesson}/transcript": {
    "get": {
      "responses": {
        "200": {
          "description": "Successful response",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/TranscriptResponseSchema"
              }
            }
          }
        }
      }
    }
  }
}
```

Where `TranscriptResponseSchema` requires:

```json
{
  "type": "object",
  "properties": {
    "transcript": { "type": "string" },
    "vtt": { "type": "string" }
  },
  "required": ["transcript", "vtt"]
}
```

**No 404 response is defined in the schema.**

### What Happens in the SDK

1. The `openapi-fetch` client makes the request
2. API returns 404 with error object
3. `openapi-fetch` puts the error in `response.error`, not `response.data`
4. `response.data` is `false` or `undefined`
5. The tool tries to validate `response.data` (which is falsy)
6. Validation fails because it expects an object with `transcript` and `vtt` fields

### Test Results

| Lesson                                              | Has Transcript? | HTTP Status | response.data       | response.error          | Validation |
| --------------------------------------------------- | --------------- | ----------- | ------------------- | ----------------------- | ---------- |
| add-and-subtract-two-numbers-that-bridge-through-10 | ✅ Yes          | 200         | `{transcript, vtt}` | `false`                 | ✅ PASS    |
| making-apple-flapjack-bites                         | ❌ No           | 404         | `false`             | `{message, code, data}` | ❌ FAIL    |

## Solution: Update OpenAPI Schema

The OpenAPI schema needs to be updated to reflect the actual API behavior. Add a 404 response:

```json
{
  "/lessons/{lesson}/transcript": {
    "get": {
      "responses": {
        "200": {
          "description": "Successful response",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/TranscriptResponseSchema"
              }
            }
          }
        },
        "404": {
          "description": "Transcript not available for this lesson",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ErrorResponseSchema"
              }
            }
          }
        }
      }
    }
  }
}
```

Where `ErrorResponseSchema` matches the actual error response:

```json
{
  "ErrorResponseSchema": {
    "type": "object",
    "properties": {
      "message": { "type": "string" },
      "code": { "type": "string" },
      "data": {
        "type": "object",
        "properties": {
          "code": { "type": "string" },
          "httpStatus": { "type": "number" },
          "path": { "type": "string" },
          "zodError": { "type": "null", "nullable": true }
        }
      }
    }
  }
}
```

## Impact

This affects any lesson without video content:

- Practical lessons (cooking, PE activities)
- Lessons with only slideshows
- Lessons with only worksheets
- Any lesson where video is unavailable

## Immediate Workaround

Until the schema is updated, the MCP tool should handle the 404 gracefully by checking for `response.error` before attempting validation:

```typescript
const output = await descriptor.invoke(client, args);

// Check if this is a 404 error (transcript not available)
if (!output) {
  return {
    error: new McpToolError('Transcript not available for this lesson', toolName, {
      code: 'TRANSCRIPT_NOT_FOUND',
    }),
  };
}

const validation = descriptor.validateOutput(output);
```

## Files to Report to API Team

1. **Schema file:** `packages/sdks/oak-curriculum-sdk/schema-cache/api-schema-original.json`
2. **Endpoint:** `/lessons/{lesson}/transcript`
3. **Issue:** Missing 404 response definition
4. **Example lesson without transcript:** `making-apple-flapjack-bites`
5. **Example lesson with transcript:** `add-and-subtract-two-numbers-that-bridge-through-10`

## Test Command

To reproduce:

```bash
curl -i "https://open-api.thenational.academy/api/v0/lessons/making-apple-flapjack-bites/transcript" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Expected: HTTP 404 with error object
Schema says: Only HTTP 200 is possible
