---
name: "Error Response Classification Architecture"
overview: "Design and implement domain-aware error classification for documented error responses (400, 401, 404) across the SDK and MCP layers."
status: complete
priority: high
prerequisite: codegen-schema-error-response-adaptation (complete)
blocking: F2 categoryMap closure (error handling confidence during re-ingest validation) → P0 unified versioned ingestion final phases
todos:
  - id: experiment-upstream-errors
    content: "Fetch actual error responses from the upstream API for each scenario (expected absence, content blocked, genuine not-found) and document the body shapes."
    status: complete
  - id: design-classification-architecture
    content: "Design the error classification architecture: where classification happens (SDK vs MCP), how to distinguish the three scenarios, how to handle the validator-ordering problem."
    status: complete
  - id: add-behavioural-validation-tests
    content: "Add behavioural validation tests for documented error codes (400/401/404) at SDK and MCP levels."
    status: complete
  - id: implement-classification
    content: "Implement the error classification in the SDK layer and the presentation logic in the MCP layer."
    status: complete
  - id: full-gates
    content: "Run pnpm check end-to-end."
    status: complete
---

# Error Response Classification Architecture

**Status**: Complete (2026-03-20)
**Priority**: High — user-facing behaviour quality
**Branch**: `feat/es_index_update` (continues from codegen fix)
**Prerequisite**: Codegen error response adaptation (complete as of 2026-03-20)

## Context

The upstream OpenAPI schema (v0.6.0) now documents error responses (400, 401, 404)
across all 26 endpoints. The codegen pipeline was fixed to handle this (see
`codegen-schema-error-response-adaptation.plan.md`). The pipeline is green.

However, the error responses now flow through schema validation and return as
`ok: true` at the SDK level, which changes the downstream error handling behaviour.
Previously, 4xx responses were "undocumented" and classified via
`UndocumentedResponseError`. Now they're validated successfully and need a new
classification mechanism.

## Three Domain Scenarios

The user identified three distinct domain scenarios that all use 4xx HTTP status
codes but have different meanings:

### 1. Expected Absence (not an error)

**Example**: A lesson has no transcript — not all lessons have video content.
**HTTP**: 404
**Meaning**: Normal — the resource type doesn't apply to this entity.
**SDK handling**: Validated response, classified as "expected absence".
**MCP handling**: Informational: "No transcript available for this lesson."

### 2. Content Blocked (not an error, but needs separate handling)

**Example**: A lesson exists conceptually but is not available due to third-party
copyright restrictions.
**HTTP**: 400 (historically; needs verification)
**Meaning**: Legitimate restriction — resource described but not available.
**SDK handling**: Validated response, classified as "content blocked".
**MCP handling**: Specific: "This content is not available due to licensing."

### 3. Genuine Not-Found (actual error)

**Example**: Request for a lesson slug that doesn't exist.
**HTTP**: 404
**Meaning**: The requested resource should exist but doesn't.
**SDK handling**: Validated response, classified as "not found error".
**MCP handling**: Error: "Lesson not found."

## Key Findings from Implementation Session (2026-03-20)

### Upstream Error Schema Shape

The generated Zod schemas for all three error types are identical:

```typescript
z.object({
  message: z.string(),
  code: z.string(),
  issues: z.array(z.object({ message: z.string() }).strict()).optional(),
}).strict()
```

- `message` (required): Human-readable error description
- `code` (required): Error classification code (e.g., `'BAD_REQUEST'`, `'NOT_FOUND'`)
- `issues` (optional): Array of detailed issue descriptions

**No `data` field** — the old decorator schema had `{ data: { code, httpStatus, path, zodError } }`.
The upstream error schema uses `issues` instead of `data`.

### Validator-Ordering Problem

The response validator (`validateOutput`) iterates documented statuses in order
(200, 400, 401, 404) and picks the first schema that passes `safeParse`. Since all
three error schemas are identical, a 404 error body always validates as **400**
(first match). This means:

- `validateOutput(descriptor, { status: 404, data: errorBody })` → status mismatch
  (validated as 400, received 404)
- The validator cannot distinguish between error types by body shape alone

**This is a structural gap** that needs addressing. Options:
1. Pass the HTTP status as a discriminant to the validator
2. Make the error schemas distinguishable (unlikely — upstream controls the schemas)
3. Accept first-match and treat all error statuses equivalently in the validator

### Content-Blocking Detection Gap

The existing `isContentBlockedResponse` in `execute-tool-call.ts` checks for
`data.cause` containing "blocked". But:

1. The upstream error schema has `issues`, not `data`
2. `isContentBlockedResponse` sits behind the `UndocumentedResponseError` gate,
   which no longer fires for documented statuses

**Experiment needed**: Fetch an actual content-blocked response from the upstream API
to determine:
- What status code does it return? (400? 404? Something else?)
- Does the `message` field contain distinguishing information?
- Does the `issues` array contain the "blocked" information?
- Is the response shape consistent with the documented error schema?

### What the `message` and `issues` Fields Might Tell Us

The user suspects that `message` and `issues` contain enough information to
distinguish the three scenarios. For example:
- Expected absence: `message` might say "Transcript not available"
- Content blocked: `message` might mention "not available" with `issues` containing
  licensing/blocking details
- Genuine not-found: `message` might say "Lesson not found"

**This needs empirical verification via API calls.**

## Changes Made in This Session

### Codegen Fixes (Bug 2 + Bug 1)

1. **`build-response-map.ts`**: Applied `sanitizeIdentifier` to component names from
   `$ref` in `collectResponses` — fixes dotted names like `error.BAD_REQUEST` →
   `error_BAD_REQUEST`
2. **`cross-validate.ts`**: Taught `collectExpectedResponseKeys` to detect shared
   components and generate `*:{status}` wildcard expected keys. Refactored to use
   narrow types from `openapi3-ts` instead of defensive `unknown` narrowing.

### Test Updates

3. **`build-response-map.unit.test.ts`**: Added 2 unit tests (sanitisation +
   wildcard emission)
4. **`build-response-map.integration.test.ts`**: Added 4 integration tests
   (multi-endpoint dotted errors)
5. **`cross-validate.unit.test.ts`**: Added 2 unit tests (wildcard accept + reject)
6. **`cross-validate.integration.test.ts`**: New file — 2 integration tests
   (builder + validator pipeline)
7. **`schema-separation.unit.test.ts`**: Deleted 3 stale decorator tests (behaviour
   proven at lower level by `schema-enhancement-404.unit.test.ts`)
8. **`execute-tool-call.unit.test.ts`**: Changed 2 tests from status 400 to 418
   (truly undocumented) to match the new reality
9. **`response-validators.unit.test.ts`**: Removed assertion for `data` field
   (not in upstream schema; upstream has `issues` instead)
10. **`server.integration.test.ts` (MCP stdio)**: Updated error response body to
    match actual schema, updated documented-statuses expectation

### Dead Code Removal

11. **`schema-enhancement-404.ts`**: Deleted unused `transcript404Descriptor`
    constant

## Execution Plan for Next Session

### Phase 1: Upstream API Experimentation

Fetch actual error responses to understand the body shapes:

```bash
# Expected absence: lesson without transcript
curl -s https://open-api.thenational.academy/api/v0/lessons/{known-no-transcript-slug}/transcript

# Genuine not-found: non-existent lesson
curl -s https://open-api.thenational.academy/api/v0/lessons/this-does-not-exist/transcript

# Content blocked: lesson in a blocked subject/unit
# (need to identify a known blocked lesson — check bulk data or API)

# Bad request: invalid parameter format
curl -s https://open-api.thenational.academy/api/v0/key-stages/INVALID/subjects/INVALID/lessons
```

Document the response shapes, paying attention to:
- `message` field content for each scenario
- `issues` array content and structure
- Whether content-blocked responses match the documented error schema
- Whether the `code` field varies between scenarios

### Phase 2: Classification Architecture Design

Based on experimental findings, design:

1. **SDK-level classification**: A pure function that takes a validated error
   response and returns a domain classification enum:
   - `EXPECTED_ABSENCE` — not an error, resource type doesn't apply
   - `CONTENT_BLOCKED` — not an error, licensing restriction
   - `GENUINE_ERROR` — actual problem requiring user attention
   - `AUTHENTICATION_REQUIRED` — 401 responses

2. **Validator-ordering fix**: Either pass HTTP status as discriminant or handle
   at the MCP layer where both status and body are available.

3. **MCP-layer presentation**: Map each classification to appropriate MCP tool
   response formatting.

### Phase 3: TDD Implementation

Write tests first for each classification scenario, then implement.

### Phase 4: Quality Gates

`pnpm check` end-to-end.

## Constraints

- TDD at all levels. No type shortcuts.
- Classification logic lives in ONE place (DRY) — probably SDK layer.
- Semi-official values (message patterns, issue shapes) should be defined in one
  place with clear documentation that they're based on observed behaviour.
- All reviewer findings are blocking.

## Implementation Results (2026-03-20)

### Approach: Preserve HTTP Status Through Generator + Classify in Authored Code

The root cause was that the generated `invoke` method dropped the HTTP status and
returned only the response body. The fix preserves the status through the pipeline.

### Phase 1 Findings: Upstream API Response Shapes

| Scenario | Endpoint | HTTP | Body Shape | Matches Schema? |
|----------|----------|------|------------|-----------------|
| Non-existent lesson | /summary | 404 | `{ message, code }` | Yes → validator-ordering problem |
| Non-existent lesson | /transcript | 400 | `{ message, data: { cause }, code }` | No → strict rejects `data` |
| Content blocked | /transcript | 400 | `{ message, data: { cause: "...restricted...blocked..." }, code }` | No → strict rejects `data` |
| Content blocked | /summary | 200 | success data | N/A (lesson metadata still available) |
| Unauthenticated | any | 401 | `{ message, code }` | Yes → validator-ordering problem |

Key insight: Two distinct problems existed — validator-ordering for clean bodies (401/404),
and strict schema rejection for bodies with extra `data` field (400 from gated endpoints).

### Files Changed

| File | Layer | Change |
|------|-------|--------|
| `code-generation/.../generate-tool-descriptor-file.ts` | Generator | Added `InvokeResult` interface |
| `code-generation/.../emit-index.ts` | Generator | `invoke` returns `{ httpStatus, payload }` |
| `code-generation/.../generate-execute-file.ts` | Generator | Unwraps invoke result, throws for httpStatus >= 400 |
| `packages/sdks/oak-curriculum-sdk/src/mcp/error-types.ts` | Authored | Extracted McpToolError, McpParameterError |
| `packages/sdks/oak-curriculum-sdk/src/mcp/classify-error-response.ts` | Authored | Classification pure functions |
| `packages/sdks/oak-curriculum-sdk/src/mcp/execute-tool-call.ts` | Authored | Thin executor, imports classification |
| 23 generated tool files + execute.ts | Generated | Regenerated by `pnpm sdk-codegen` |

### Classification Codes

| HTTP Status | Body Signal | Code | Meaning |
|-------------|------------|------|---------|
| 401 | any | `AUTHENTICATION_REQUIRED` | Missing or invalid API token |
| 400 | `data.cause` contains "blocked" | `CONTENT_NOT_AVAILABLE` | Copyright restriction |
| 404 | any | `RESOURCE_NOT_FOUND` | Resource does not exist |
| 400 | other | `UPSTREAM_API_ERROR` | Generic bad request |
| 5xx (undocumented) | any | `UPSTREAM_SERVER_ERROR` | Upstream failure |

### Tests Added

- 2 generator contract tests (InvokeResult interface, invoke return type)
- 1 generator invoke test (returns `{ httpStatus, payload }`)
- 5 generator execute tests (unwrap, validate payload, error detection, success path)
- 5 classification tests (404, 401, 400 generic, 400 blocked, 200 unchanged)
