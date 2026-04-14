# Upstream API Changes for MCP Directory Compliance

**Date**: 14 April 2026
**From**: Jim and Claude
**To**: Remy and Aakesh
**Context**: We are preparing the Oak MCP server for listing in the
Anthropic Claude and OpenAI ChatGPT app directories. Both directories
have published compliance policies that our server must satisfy. One
issue requires an upstream API change.

---

## Background

Both Anthropic and OpenAI require that **tool response size is
proportionate to task complexity** (Anthropic §5B, OpenAI "Response
Minimization").

---

## Request: Add Pagination to Asset Endpoints

**Endpoints**:

- `GET /api/v1/key-stages/{keyStage}/subjects/{subject}/assets`
- `GET /api/v1/sequences/{sequenceSlug}/assets`

**Issue**: These endpoints have no `limit` or `offset` parameters. A
request for a large subject (e.g. KS3 science, approximately 270 lessons)
returns all asset entries in a single response. Both Anthropic (§5B) and
OpenAI ("Response Minimization") require that tool response size is
proportionate to the task being performed.

For comparison, the equivalent question endpoints already support
pagination:

| Endpoint | `limit` | `offset` |
|----------|---------|----------|
| `GET /key-stages/{keyStage}/subjects/{subject}/questions` | Default 10, max 100 | Default 0 |
| `GET /sequences/{sequenceSlug}/questions` | Default 10, max 100 | Default 0 |
| `GET /key-stages/{keyStage}/subjects/{subject}/assets` | **Not available** | **Not available** |
| `GET /sequences/{sequenceSlug}/assets` | **Not available** | **Not available** |

**Suggested fix**: Add `limit` and `offset` query parameters to both
asset endpoints, with the same defaults as the question endpoints
(`limit` default 10, `offset` default 0).

**Impact**: Without pagination, the MCP server cannot offer scoped
retrieval for asset data. An AI assistant asking "what worksheets are
available for this unit?" triggers a full key-stage-subject asset dump.
We can mitigate this with description guidance ("filter by type and/or
unit to reduce response size"), but server-side pagination would be the
proper solution and would bring asset endpoints into parity with question
endpoints.

---

## Priority

This request is driven by external compliance requirements for directory
listing. It is not blocking our current development, but will likely be
flagged during directory review. We can work around it temporarily with
description guidance in tool descriptions, but the upstream fix would be
the correct resolution.

## Questions

This request is based on our reading of the directory compliance
policies. We are happy to discuss whether this change is appropriate
or whether an alternative approach would be preferred.

---

## Note: limit/offset Description Swap (Resolved)

During this audit we discovered that the `limit` and `offset` parameter
descriptions appeared swapped on the `get-key-stages-subject-lessons`
MCP tool. Investigation traced this to a stale cached copy of the OpenAPI
spec on our side. The live spec at
`open-api.thenational.academy/api/v0/swagger.json` has the correct
descriptions — thank you for fixing that. We will refresh our schema
cache to pick up the correction.
