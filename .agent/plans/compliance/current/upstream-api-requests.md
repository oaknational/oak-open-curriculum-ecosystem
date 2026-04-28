# Upstream API Changes for MCP Directory Compliance

**Date**: 14 April 2026
**From**: Jim and Claude
**To**: Remy and Aakesh
**Context**: We are preparing the Oak MCP server for listing in the
Anthropic Claude and OpenAI ChatGPT app directories. Both directories
have published compliance policies that our server must satisfy. Two
issues require upstream API changes.

---

## Background

Both Anthropic and OpenAI require that tool descriptions **precisely
match actual functionality** (Anthropic §2B, OpenAI "Descriptions
Matching Behavior"), and that **tool response size is proportionate to
task complexity** (Anthropic §5B, OpenAI "Response Minimization").

---

## Request 1: Fix Swapped limit/offset Descriptions

**Endpoint**: `GET /api/v1/key-stages/{keyStage}/subjects/{subject}/lessons`

**Issue**: The `limit` and `offset` parameter descriptions are transposed
in the OpenAPI specification. Verified against the live spec at
`open-api.thenational.academy/api/v0/swagger.json` on 14 April 2026.

**Current (incorrect)**:

| Parameter | Current description |
|-----------|-------------------|
| `offset` | "Limit the number of lessons returned per unit. Units with zero lessons after limiting are omitted." |
| `limit` | "Offset applied to lessons within each unit (not to the unit list)." |

Note: the defaults are correct (`offset`: 0, `limit`: 10) — only the
description text is swapped.

**Expected (correct)**:

| Parameter | Correct description |
|-----------|-------------------|
| `offset` | "Offset applied to lessons within each unit (not to the unit list)." |
| `limit` | "Limit the number of lessons returned per unit. Units with zero lessons after limiting are omitted." |

**Impact**: The MCP server generates tool definitions directly from the
OpenAPI spec. AI assistants reading these descriptions will misuse the
parameters. Both Anthropic and OpenAI require that tool parameter
descriptions precisely match actual functionality.

**Suggested fix**: Swap the `description` fields for `limit` and `offset`
on this endpoint in the OpenAPI specification.

---

## Request 2: Add Pagination to Asset Endpoints

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

Both requests are driven by external compliance requirements for
directory listing. Request 1 (description swap) is a straightforward
metadata fix. Request 2 (pagination) is a feature addition that brings
asset endpoints into parity with existing question endpoints.

Neither request is blocking our current development, but both will
likely be flagged during directory review.

## Questions

These requests are based on our reading of the directory compliance
policies. We are happy to discuss whether these changes are appropriate
or whether alternative approaches would be preferred.
