# Upstream API 500 Errors

Observed 500 responses from the Oak Open Curriculum API (`open-api.thenational.academy/api/v0`).
These are genuine server errors, not expected behaviour.

Discovered: 2026-03-20, during error response classification work.

## 1. Transcript endpoint — null transcript causes TypeError

**Endpoint**: `GET /lessons/{lesson}/transcript`

**Trigger**: Lessons that exist but have no video content (e.g. PE lessons).

**Response**:

```json
{
  "message": "Cannot read properties of null (reading 'replace')",
  "data": { "cause": "TypeError: Cannot read properties of null (reading 'replace')" },
  "code": "INTERNAL_SERVER_ERROR"
}
```

**HTTP status**: 500

**Affected lessons** (all KS1 Physical Education, unit `ball-skills-hitting-and-striking`):

- `hitting-striking-the-ball-with-intent`
- `hitting-striking-a-ball-into-a-space`
- `striking-the-ball-using-a-racket-or-bat-with-accuracy`

**Expected behaviour**: A 404 with `{ message: "Transcript not available", code: "NOT_FOUND" }` or similar — not a null pointer exception.

**Context**: The lesson summary (`/lessons/{slug}/summary`) returns 200 for all three, confirming the lessons exist. Quiz and assets endpoints also return 200. Only the transcript endpoint fails.

## Reproduce

```bash
# Requires OAK_API_KEY
curl -s -H "Authorization: Bearer $OAK_API_KEY" \
  "https://open-api.thenational.academy/api/v0/lessons/hitting-striking-the-ball-with-intent/transcript"
```

## Impact

MCP tool users see `UPSTREAM_SERVER_ERROR` when querying transcripts for lessons without video content. The error is indistinguishable from a genuine server outage.
