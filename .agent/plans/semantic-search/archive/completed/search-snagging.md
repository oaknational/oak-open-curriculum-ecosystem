---
name: "MCP Tool Snagging — Pre-Alpha Fixes"
overview: >
  Five tool issues discovered during systematic MCP tool smoke testing
  (2026-02-22). All are SDK-layer bugs except one possible upstream schema
  mismatch. None are regressions from recent widget work — they are
  pre-existing edge cases in less-commonly-exercised paths. Root causes
  are in response augmentation (canonical URL generation), search dispatch,
  and schema validation.
todos:
  - id: snag-1-suggest-scope
    content: "Snag 1: search(scope:'suggest') — Elasticsearch context query error. Fix suggest retrieval to supply mandatory completion contexts."
    status: completed
  - id: snag-2-fetch-subject
    content: "Snag 2: fetch('subject:maths') — canonical URL generation fails due to property name mismatch (keyStageSlugs vs keyStages) in extractSubjectContext."
    status: completed
  - id: snag-3-subjects-key-stages
    content: "Snag 3: get-subjects-key-stages — isSingleEntityEndpoint misclassifies /subjects/{s}/key-stages as 'subject' content type."
    status: completed
  - id: snag-4-subjects-years
    content: "Snag 4: get-subjects-years — ID extraction fails on numeric array response. isSingleEntityEndpoint misclassifies /subjects/{s}/years."
    status: completed
  - id: snag-5-ks-subject-questions
    content: "Snag 5: get-key-stages-subject-questions — response schema validation failure. Verify upstream response against generated schema."
    status: completed
isProject: false
---

# MCP Tool Snagging — Pre-Alpha Fixes

**Last Updated**: 2026-02-23
**Status**: IMPLEMENTED AND SMOKE-TESTED — all five fixes verified
end-to-end against running HTTP MCP server. Snag 1 additionally
received an input validation guard (subject/keyStage required for
suggest scope). Implementation details were captured in the session plan and are
now consolidated in this archived canonical plan.
**Milestone**: Post-merge, pre-Milestone-1 (public alpha). These were
pre-existing bugs, not regressions.

---

## Standalone Session Bootstrap

**Session entry point**:
[semantic-search.prompt.md](../../../prompts/semantic-search/semantic-search.prompt.md)
provides broader context (architecture, search landscape, quality gates).

**Before starting any fix**, re-read:

- [AGENT.md](../../../directives/AGENT.md) — project directives
- [principles.md](../../../directives/principles.md) — core rules
- [testing-strategy.md](../../../directives/testing-strategy.md) — TDD
  requirements

---

## Discovery Context

During a systematic smoke test of all 31 oak-local MCP tools, 27 passed
and 5 exhibited failures. The failures are all in the SDK layer
(`packages/sdks/oak-curriculum-sdk/`) — specifically in response
augmentation (canonical URL generation), search dispatch, and schema
validation.

### Tools Verified Working (27/31)

Every tool in the agent support, discovery (except suggest), browsing,
fetching, progression, sequences, and meta categories passed. Full
results are in the conversation transcript.

---

## Architectural Root Cause Analysis

The five snags look like isolated coding errors but they share a
single architectural weakness: **the response augmentation system was
built outside the schema-first discipline** that governs the rest of
the codebase.

### The Disease Behind the Five Symptoms

| Symptom | Architectural Weakness |
|---------|----------------------|
| Snags 3, 4 — `isSingleEntityEndpoint` over-matches | **Heuristic path dispatch** — `path.includes('/subjects/')` is a substring heuristic that over-broadly matches nested resource paths. A schema-derived path-to-content-type map would make this class of bug impossible. |
| Snag 2 — `extractSubjectContext` wrong property name | **Manual contract assumption** — the code checks for `keyStageSlugs` but the API returns `keyStages` (array of objects). The test suite encoded the same wrong assumption. Schema-driven validation against `SubjectResponseSchema` would prevent property name drift. |
| Snags 2, 3, 4 — middleware kills API calls | **Missing error boundary** — `augmentBody()` in the client middleware has no error handling. Canonical URL decoration is supplementary; it should never kill the API call. This conflates best-effort enhancement with critical functionality. |
| Snag 1 — `suggest()` ignores `subject`/`keyStage` | **Silent parameter acceptance** — the interface promises context filtering but the implementation ignores it. The `oak-search-cli` has a working implementation that shows how contexts should be built. |
| Snag 5 — generated schema rejects valid response | **No schema conformance testing** — generated Zod schemas are never tested against captured real API responses. Schema drift is invisible until a user hits it at runtime. |

### Why the Tests Did Not Catch These

See [Testability Analysis > Why these bugs were not caught](#why-these-bugs-were-not-caught)
below for the detailed test coverage gap analysis with specific file
references.

---

## What Would Prevent This Class of Bug

### Immediate (part of this snagging work)

- **Positive exact-depth regex matching** instead of
  `path.includes()` — prevents future sub-resource mismatches
  without a blocklist.
- **Error containment at middleware boundary** — best-effort
  augmentation must never kill the API call.
- **Missing test file for helpers module** — pure functions with zero
  tests are a test coverage gap, not an edge case.
- **Fix `extractSubjectContext`** to handle the actual API response
  shape (`keyStages` array of objects).

### Medium-term (roadmap Phase 4)

- **Schema-driven path-to-content-type mapping** generated at
  `pnpm type-gen` time from the OpenAPI path definitions.
- **Schema-driven context extraction** using generated Zod schemas
  (e.g., `SubjectResponseSchema`) instead of hand-written property
  checks.
- **Schema conformance tests** as part of the type-gen quality gates,
  using captured API response fixtures.

---

## Metacognitive Reframing

What initially appeared as five isolated bugs reveals a single
architectural insight: the response augmentation system was built
*outside* the schema-first discipline. Path matching uses substring
heuristics instead of schema-derived maps. Context extraction
manually checks property names instead of validating against
generated schemas. The middleware treats best-effort decoration as
critical path.

The tests then *encoded the same wrong assumptions as the code*. When
the test and the product code agree on the wrong contract (Snag 2's
`keyStageSlugs` vs the API's `keyStages`), the test provides false
confidence rather than genuine verification.

**What has changed**: The bridge from action to impact is clear.
Short-term: fix the 5 bugs with proper TDD and error containment.
Medium-term: bring response augmentation into the schema-first
discipline, making this entire class of bug impossible. The immediate
fixes address symptoms; the medium-term architectural correction
addresses the cause.

**The critical lesson**: tests that agree with the code on the wrong
contract are worse than no tests — they provide false confidence. The
antidote is to anchor test fixtures to the schema (or captured API
responses), not to the assumptions of the code under test.

---

## Snag 1: `search(scope: 'suggest')` — Elasticsearch Context Error

### Symptom

```text
Elasticsearch error: search_phase_execution_exception
  Caused by: illegal_argument_exception:
    Missing mandatory contexts in context query (status 400)
```

### Root Cause

In `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/execution.ts`
(line 90-98), `buildSuggestParams()` hardcodes `scope: 'lessons'`:

```typescript
function buildSuggestParams(args: SearchSdkArgs): SuggestParams {
  return {
    prefix: args.text,
    scope: 'lessons',   // hardcoded
    subject: args.subject,
    keyStage: args.keyStage,
    limit: args.limit,
  };
}
```

The downstream `suggest()` function in
`packages/sdks/oak-search-sdk/src/retrieval/suggestions.ts` (line 63-70)
accepts `subject` and `keyStage` in `SuggestParams` but **never uses
them** — they are accepted but not referenced in the function body. The
ES completion query is built without a `contexts` field regardless of
inputs. The ES index mapping requires mandatory contexts, so the query
always fails with a 400.

### Fix Approach

**Prefer Option B** — fix the query construction rather than changing
the public tool contract.

1. **Investigate the ES completion suggester mapping** to determine
   which contexts are mandatory. Check `oak-search-sdk`'s `suggest()`
   method to understand how it builds the ES query.
2. **Option B (preferred)**: Fix the suggest query builder in
   `oak-search-sdk` to always include the `contexts` field, providing
   empty arrays when no filter is specified. This keeps the MCP tool
   schema stable and avoids pushing ES index constraints into the
   public tool contract.
3. **Option A (fallback)**: If the ES mapping fundamentally requires
   contexts, make `subject` or `keyStage` required for suggest scope
   (update the tool schema and validation). This is a breaking change
   to the tool contract and should only be used if Option B is
   infeasible.

### TDD Plan

- **Unit test** (if fix is in validation): In `validation.unit.test.ts`,
  assert `validateSearchSdkArgs({ text: 'photo', scope: 'suggest' })`
  without subject/keyStage fails validation.
- **Integration test** (if fix is in query construction): In
  `execution.integration.test.ts`, assert that `retrieval.suggest` is
  called with params that include context fields (even if empty arrays).
  The existing suggest test (line 134) uses a fake and does not verify
  context params.

### Implementation

Implemented as **Option A** (validation guard) — the ES completion
index mapping defines `subject` and `key_stage` as mandatory contexts,
meaning empty arrays do NOT satisfy the constraint. Option B was
proven infeasible via live testing.

Fix: `suggest()` in `oak-search-sdk` now returns a validation error
when neither `subject` nor `keyStage` is provided:

```text
suggest: at least one of subject or keyStage is required
(the completion index has mandatory contexts)
```

When contexts ARE provided, they are correctly passed through to the
ES completion query and results are returned successfully. The
`buildCompletionClause` + `buildCompletionContexts` functions handle
partial contexts (subject-only or keyStage-only).

### Acceptance Criteria (revised)

- `search({ text: 'photo', scope: 'suggest', subject: 'science' })`
  returns typeahead suggestions (PASS)
- `search({ text: 'photo', scope: 'suggest' })` without any context
  returns a clear validation error (PASS)

### Files

- `packages/sdks/oak-search-sdk/src/retrieval/suggestions.ts`
  (validation guard + context passing)
- `packages/sdks/oak-search-sdk/src/retrieval/suggestions.integration.test.ts`
  (5 tests covering context scenarios)
  (line 134: existing suggest test)

### Severity: Medium

Suggest is a useful but not critical scope. Teachers can still search
all four primary scopes.

---

## Snag 2: `fetch('subject:maths')` — Property Name Mismatch in Context Extraction

### Symptom

```text
Canonical URL generation failed: Missing required context for subject,
  id: maths, context: {}
```

### Root Cause

There are **two contributing bugs**, both in the SDK:

**Primary bug — property name mismatch in `extractSubjectContext`**:
In `packages/sdks/oak-curriculum-sdk/src/response-augmentation.ts`
(line 82-90), `extractSubjectContext()` looks for a property called
`keyStageSlugs`:

```typescript
function extractSubjectContext(response: unknown): SubjectContext | undefined {
  if ('keyStageSlugs' in response && isReadonlyStringArray(response.keyStageSlugs)) {
    return { keyStageSlugs: response.keyStageSlugs };
  }
  return undefined;
}
```

But the upstream API response (per the generated `SubjectResponseSchema`
in `curriculumZodSchemas.ts`) returns `keyStages` — an **array of
objects** with `keyStageTitle` and `keyStageSlug` properties — not a
flat `keyStageSlugs` string array. Context extraction silently returns
`undefined`, producing `context: {}`, and `generateCanonicalUrlWithContext`
correctly throws.

**Secondary bug — missing context in `runFetchTool`**:
In `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch.ts`
(line 143), `runFetchTool()` calls `generateCanonicalUrlWithContext()`
without passing any context at all. The call site already has a
try-catch that degrades to `canonicalUrl: null`, so the tool returns
data successfully but with a missing canonical URL. Fixing the
middleware alone prevents API call failures; fixing `runFetchTool`
is an enhancement that produces a correct canonical URL in the tool
response.

**Scope note**: Units have the same secondary bug — `runFetchTool`
passes no context for units either, so `fetch('unit:fractions')` also
fails to generate a canonical URL. The fix must cover both content
types.

**Severity escalation**: The error originates in the client middleware
(`client/middleware/response-augmentation.ts`, line 67-74), where
`augmentBody()` has **no error handling**. When `augmentResponseWithCanonicalUrl`
throws, the throw propagates through the middleware chain and the entire
API call fails — not just the canonical URL field.

### Fix Approach

1. **Fix `extractSubjectContext`** to map from the actual API response
   shape. The generated `SubjectResponseSchema` defines `keyStages` as
   `z.array(z.object({ keyStageTitle: z.string(), keyStageSlug: z.string() }).strict())`.

   **Mandatory approach (schema-driven)**: validate the response
   against `SubjectResponseSchema` (or a narrower Zod projection of
   the `keyStages` field) and derive `keyStageSlugs` from the parsed
   result. This keeps type flow anchored to the single source of truth
   per the cardinal rule and the schema-first execution directive.
   Manual property narrowing would perpetuate the exact architectural
   weakness this plan diagnoses — tests would then encode a second
   hand-written assumption about the shape instead of anchoring to
   the schema.

2. **Export `extractContextFromResponse`** (currently module-private in
   `response-augmentation.ts`, line 95) so that `runFetchTool` in
   `aggregated-fetch.ts` can reuse the same extraction logic. Both
   paths (middleware and `runFetchTool`) must use shared extraction
   to prevent divergence. Pass the extracted context to
   `generateCanonicalUrlWithContext()` for subjects and units.

3. **Add resilience to `augmentBody`** in
   `client/middleware/response-augmentation.ts` — wrap in try-catch
   that **logs the error** via `logger.warn` (with path, content type,
   and error message) before returning the unaugmented response. This
   is a best-effort degradation layer, not a substitute for fixing
   root causes. The log ensures augmentation failures remain visible
   in production and are not silently swallowed.

**Note on DRY**: `ObjectResponse` / `isNonNullObject` are duplicated
identically in `response-augmentation.ts` and
`response-augmentation-helpers.ts`. Extract to a shared location
during implementation.

### TDD Plan

- **Unit test** in `response-augmentation.unit.test.ts`: Test
  `augmentResponseWithCanonicalUrl` with a subject response containing
  `keyStages: [{ keyStageTitle: 'KS1', keyStageSlug: 'ks1' }]` on
  path `/subjects/maths`. Assert `canonicalUrl` is non-null.
- **Integration test** in `aggregated-fetch.integration.test.ts`: Test
  `runFetchTool({ id: 'subject:maths' }, deps)` with a mock executor
  returning `{ keyStages: [...], subjectTitle: 'Maths' }`. Assert the
  structured result contains a non-null `canonicalUrl`.

### Acceptance Criteria

- `fetch('subject:maths')` returns complete data with a non-null
  `canonicalUrl`.
- `fetch('unit:cells')` returns complete data with a non-null
  `canonicalUrl`.
- Augmentation failures in the client middleware log a warning and
  return the unaugmented response (not kill the API call).

### Files

- `packages/sdks/oak-curriculum-sdk/src/response-augmentation.ts`
  (line 82-90: `extractSubjectContext` — primary bug)
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch.ts`
  (line 140-146: `runFetchTool` — secondary bug)
- `packages/sdks/oak-curriculum-sdk/src/client/middleware/response-augmentation.ts`
  (line 67-74: `augmentBody` — resilience improvement)
- `packages/sdks/oak-curriculum-sdk/src/response-augmentation.unit.test.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch.integration.test.ts`

### Severity: Medium

The middleware throw kills the entire API call, not just the canonical
URL field. The tool returns an error rather than partial data.

---

## Snag 3: `get-subjects-key-stages` — Content Type Misclassification

### Symptom

```text
Canonical URL generation failed: Missing required context for subject,
  id: key-stages, context: {}
```

### Root Cause

The response augmentation middleware calls `getContentTypeFromPath()`
on the API path `/subjects/maths/key-stages`. The `isSingleEntityEndpoint()`
function in `response-augmentation-helpers.ts` (line 70) matches
`path.includes('/subjects/')` and returns `'subject'` as the content
type. But this endpoint does not return a subject entity — it returns
an **array of key stage objects**.

The augmentation then tries to extract a subject ID from the response.
The `extractIdFromPath` fallback (line 169-175) takes the last path
segment (`key-stages`) as the ID. It then calls
`generateCanonicalUrlWithContext('subject', 'key-stages', {})`, which
correctly fails because a subject URL requires `keyStageSlugs` context.

The production entry point is `augmentBody()` in
`client/middleware/response-augmentation.ts` (line 67-74), which has
no error handling and propagates the throw.

**Path contract note**: The generated SDK uses `/subject/` (singular)
in key-stage-scoped routes, while the heuristic `isSingleEntityEndpoint`
matches `/subjects/` (plural). This singular/plural drift is a latent
risk for future mismatches. During implementation, verify which path
form reaches the middleware (raw API paths vs SDK-rewritten paths) to
ensure the fix targets the correct namespace.

### Fix Approach

Replace the broad `path.includes('/subjects/')` heuristic in
`isSingleEntityEndpoint()` with a **positive exact-depth match** that
only matches the base collection or single-entity paths:

```typescript
if (path.match(/\/subjects(\/[^/]+)?$/)) return 'subject';
```

This automatically excludes all deep sub-resource paths
(`/subjects/{s}/key-stages`, `/subjects/{s}/years`, etc.) without
needing a blocklist. **Do not apply this pattern to lessons or units**
as they have valid deeper paths (`/lessons/{l}/summary`,
`/lessons/{l}/transcript`, `/units/{u}/summary`) that should
continue to match.

A suffix blocklist (e.g. "exclude paths ending in `/key-stages`")
is a whack-a-mole anti-pattern — the next time a nested array
endpoint is added under `/subjects/`, the middleware would crash
again. Positive matching prevents this class of bug entirely.

### TDD Plan

- **Unit test** in a new `response-augmentation-helpers.unit.test.ts`:
  - `isSingleEntityEndpoint('/subjects/maths/key-stages')` returns `undefined`
  - `isSingleEntityEndpoint('/subjects/maths')` still returns `'subject'` (regression guard)
  - `getContentTypeFromPath('/subjects/maths/key-stages')` returns `undefined`
- **Unit test** in `response-augmentation.unit.test.ts`:
  - `augmentResponseWithCanonicalUrl(response, '/subjects/maths/key-stages', 'get')`
    returns response without `canonicalUrl`

### Acceptance Criteria

`get-subjects-key-stages({ subject: 'maths' })` returns key stage data
without error logging or augmentation failure.

### Files

- `packages/sdks/oak-curriculum-sdk/src/response-augmentation-helpers.ts`
  (line 55-77: `isSingleEntityEndpoint` — no test file exists for this
  module; create `response-augmentation-helpers.unit.test.ts`)
- `packages/sdks/oak-curriculum-sdk/src/client/middleware/response-augmentation.ts`
  (line 67-74: production entry point)
- `packages/sdks/oak-curriculum-sdk/src/response-augmentation.unit.test.ts`

### Severity: Medium

The middleware throw kills the entire API call. The tool returns an
error rather than the key stage data.

---

## Snag 4: `get-subjects-years` — ID Extraction from Numeric Array

### Symptom

```text
Could not extract ID for path: /subjects/maths/years
  from response: 1
```

### Root Cause

The `/subjects/{subject}/years` endpoint returns a **flat array of
numbers** (e.g., `[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]`). Response
augmentation via `augmentArrayResponseWithCanonicalUrl()` in
`response-augmentation.ts` (line 182-197) iterates over the array
and calls `extractCanonicalUrlFields()` on each item. When it
processes the number `1`, `extractIdFromResponse(1, path)` fails
because a number has no `slug` or `id` property.

This is the same root cause family as Snag 3 — `isSingleEntityEndpoint`
over-broadly matches `/subjects/maths/years` as a `'subject'` content
type, triggering augmentation on a primitive array.

### Fix Approach

Same fix as Snag 3. Replacing `path.includes('/subjects/')` with a
positive exact-depth match automatically excludes this sub-resource
path without needing a specific blocklist entry.

### TDD Plan

- **Unit test** in `response-augmentation-helpers.unit.test.ts`:
  - `isSingleEntityEndpoint('/subjects/maths/years')` returns `undefined`
  - `getContentTypeFromPath('/subjects/maths/years')` returns `undefined`

### Acceptance Criteria

`get-subjects-years({ subject: 'maths' })` returns `[1, 2, ..., 11]`
without error logging or augmentation failure.

### Files

- `packages/sdks/oak-curriculum-sdk/src/response-augmentation-helpers.ts`
  (line 55-77: `isSingleEntityEndpoint` — same fix as Snag 3)
- `packages/sdks/oak-curriculum-sdk/src/response-augmentation.ts`
  (line 182-197: `augmentArrayResponseWithCanonicalUrl`)

### Severity: Medium

Same as Snag 3 — the middleware throw kills the API call.

---

## Snag 5: `get-key-stages-subject-questions` — Schema Validation Failure

### Symptom

```text
Execution failed: Response does not match any documented schema
  for statuses: 200
```

### Root Cause

The SDK's generated Zod schema for the
`/key-stages/{ks}/subjects/{subject}/questions` endpoint does not match
the actual API response structure. The response validation in the
generated tool handler (`validateOutput`) rejects the upstream response.

**Path contract note**: The generated tool path uses `/subject/`
(singular): `/key-stages/{keyStage}/subject/{subject}/questions`. If
the upstream path has drifted to `/subjects/` (plural), this is a
contract boundary mismatch, not just a schema issue.

This could be caused by:

1. **Schema drift**: The upstream API evolved but the OpenAPI spec (and
   therefore the generated schema) was not updated.
2. **Codegen gap**: The schema generator may not handle this endpoint's
   response shape correctly (e.g., nested arrays of quiz objects with
   varying question types).
3. **Optional fields**: The response may include fields not present in
   the schema, or vice versa.

### Fix Approach

1. **Capture the raw upstream response** by calling the API directly
   (e.g., `curl`) and comparing it against the generated Zod schema.
2. **Identify the mismatch** — is it a missing field, an extra field,
   a type mismatch, or a structural difference?
3. **If the API is correct**: update the OpenAPI spec and regenerate
   schemas with `pnpm type-gen`.
4. **If the schema is correct**: file an upstream API issue.
5. Note: the `get-sequences-questions` tool (similar endpoint pattern)
   works correctly, so compare the two schemas to find the divergence.

### TDD Plan

1. Capture a real response from
   `GET /api/v0/key-stages/ks3/subjects/science/questions` via curl.
2. Write a unit test that passes the captured response to the
   generated `validateOutput` function.
3. Assert `ok: true` — this test will fail (RED) because the current
   schema rejects the response.
4. Fix the schema (via OpenAPI spec update + `pnpm type-gen`) — test
   passes (GREEN).

### Acceptance Criteria

`get-key-stages-subject-questions({ keyStage: 'ks3', subject: 'science' })`
returns quiz data without schema validation errors.

### Files

- `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/generated/data/tools/get-key-stages-subject-questions.ts`
  (generated schema and `validateOutput`)
- Upstream: `GET /api/v0/key-stages/{ks}/subject/{subject}/questions`

### Severity: Medium

This endpoint is a convenience tool for bulk quiz retrieval. Teachers
can still get quizzes per-lesson via `get-lessons-quiz`, which works
correctly.

---

## Testability Analysis

**All 5 snags are catchable without network calls.** Every root cause
is in code that is either pure (unit-testable) or has IO injected as
arguments (integration-testable with simple mocks).

| Snag | Unit testable? | Integration testable? | Network needed? |
|------|----------------|----------------------|-----------------|
| 1 | Partially (`buildSuggestParams` is private) | Yes (mock ES client, mock retrieval) | No |
| 2 | Yes (all augmentation functions are pure) | Yes (mock executor) | No |
| 3 | Yes (pure path-matching functions) | Optional (middleware mock) | No |
| 4 | Yes (pure path-matching functions) | Optional (middleware mock) | No |
| 5 | Yes (Zod parse against captured fixture) | Optional | One-time fixture capture only |

### Why these bugs were not caught

The existing test suite has good coverage for the **happy paths** but
missed these **edge cases** because:

1. **No test file exists for `response-augmentation-helpers.ts`** — 6
   exported pure functions with zero direct unit tests. Path-matching
   bugs (Snags 3/4) were invisible because the only tests exercised
   paths that worked.
2. **`response-augmentation.unit.test.ts` tests subjects with
   `keyStageSlugs`** (the property the code looks for) rather than
   `keyStages` (the property the API actually returns). The test and
   the code agree on the wrong contract (Snag 2).
3. **`execution.integration.test.ts` suggest test** verifies dispatch
   happens but does not assert the params shape passed to
   `retrieval.suggest()` — so the missing context fields were
   invisible (Snag 1).
4. **`aggregated-fetch.integration.test.ts`** never tests `subject`
   type fetch, and never asserts `canonicalUrl` value for
   context-dependent types (Snag 2 secondary bug).
5. **No schema conformance test** for
   `get-key-stages-subject-questions` with a real response fixture
   (Snag 5).

---

## Comprehensive Test Scenarios

### Track A — Response Augmentation (Snags 2, 3, 4)

All functions are pure or have IO injected as arguments. **No network
calls needed at any level.**

#### A1. `response-augmentation-helpers.unit.test.ts` — NEW FILE

This module has 6 exported pure functions and zero tests. Create this
file with direct unit tests.

**Path classification — `isSingleEntityEndpoint`:**

```typescript
// Snag 3: sub-resource paths must NOT match as subject
it('returns undefined for /subjects/{s}/key-stages', () => {
  expect(isSingleEntityEndpoint('/subjects/maths/key-stages'))
    .toBeUndefined();
});

// Snag 4: sub-resource paths must NOT match as subject
it('returns undefined for /subjects/{s}/years', () => {
  expect(isSingleEntityEndpoint('/subjects/maths/years'))
    .toBeUndefined();
});

// Regression guards — existing working paths
it('returns subject for /subjects/{s}', () => {
  expect(isSingleEntityEndpoint('/subjects/maths')).toBe('subject');
});
it('returns sequence for /subjects/{s}/sequences', () => {
  expect(isSingleEntityEndpoint('/subjects/maths/sequences'))
    .toBe('sequence');
});
it('returns lesson for /lessons/{l}', () => {
  expect(isSingleEntityEndpoint('/lessons/add-fractions'))
    .toBe('lesson');
});
it('returns lesson for /lessons/{l}/summary', () => {
  expect(isSingleEntityEndpoint('/lessons/add-fractions/summary'))
    .toBe('lesson');
});
it('returns unit for /units/{u}', () => {
  expect(isSingleEntityEndpoint('/units/fractions')).toBe('unit');
});
it('returns unit for /units/{u}/summary', () => {
  expect(isSingleEntityEndpoint('/units/fractions/summary'))
    .toBe('unit');
});
it('returns sequence for /sequences/{s}', () => {
  expect(isSingleEntityEndpoint('/sequences/maths-ks1'))
    .toBe('sequence');
});
it('returns thread for /threads/{t}', () => {
  expect(isSingleEntityEndpoint('/threads/algebra')).toBe('thread');
});
it('returns undefined for unrecognised paths', () => {
  expect(isSingleEntityEndpoint('/unknown/path')).toBeUndefined();
});
```

**Content type derivation — `getContentTypeFromPath`:**

```typescript
// Snag 3+4: sub-resource paths must return undefined
it('returns undefined for /subjects/{s}/key-stages', () => {
  expect(getContentTypeFromPath('/subjects/maths/key-stages'))
    .toBeUndefined();
});
it('returns undefined for /subjects/{s}/years', () => {
  expect(getContentTypeFromPath('/subjects/maths/years'))
    .toBeUndefined();
});

// Regression guards
it('returns subject for /subjects/{s}', () => {
  expect(getContentTypeFromPath('/subjects/maths')).toBe('subject');
});
it('returns lesson for /search/lessons', () => {
  expect(getContentTypeFromPath('/search/lessons')).toBe('lesson');
});
it('returns lesson for key-stage scoped lessons', () => {
  expect(getContentTypeFromPath(
    '/key-stages/ks3/subjects/science/lessons',
  )).toBe('lesson');
});
it('returns unit for key-stage scoped units', () => {
  expect(getContentTypeFromPath(
    '/key-stages/ks2/subjects/maths/units',
  )).toBe('unit');
});
```

**Slug extraction — `extractSubjectSlug`, `extractGenericId`, etc.:**

```typescript
it('extracts subjectSlug from object', () => {
  expect(extractSubjectSlug({ subjectSlug: 'maths' })).toBe('maths');
});
it('returns undefined for non-object', () => {
  expect(extractSubjectSlug(42)).toBeUndefined();
});
it('returns undefined for null', () => {
  expect(extractSubjectSlug(null)).toBeUndefined();
});
it('extracts slug from generic id', () => {
  expect(extractGenericId({ slug: 'test' })).toBe('test');
});
it('extracts id from generic id', () => {
  expect(extractGenericId({ id: 'test-id' })).toBe('test-id');
});
it('returns undefined for non-object generic id', () => {
  expect(extractGenericId(42)).toBeUndefined();
});
```

#### A2. `response-augmentation.unit.test.ts` — EXTEND

Add test cases for the bug-triggering paths. These are all pure
function calls — no IO, no mocks.

**Subject context with actual API response shape (Snag 2):**

```typescript
describe('subject responses with keyStages objects', () => {
  it('extracts canonicalUrl from API response shape', () => {
    const response = {
      subjectSlug: 'maths',
      subjectTitle: 'Maths',
      keyStages: [
        { keyStageSlug: 'ks1', keyStageTitle: 'Key Stage 1' },
        { keyStageSlug: 'ks2', keyStageTitle: 'Key Stage 2' },
      ],
    };
    const result = augmentResponseWithCanonicalUrl(
      response, '/subjects/maths', 'get',
    );
    expect(result.canonicalUrl).toBe(
      'https://www.thenational.academy/teachers/key-stages/ks1/subjects/maths/programmes',
    );
  });

  it('handles keyStages with non-string slugs gracefully', () => {
    const response = {
      subjectSlug: 'maths',
      keyStages: [{ keyStageSlug: 123 }],
    };
    expect(() => {
      augmentResponseWithCanonicalUrl(
        response, '/subjects/maths', 'get',
      );
    }).toThrow(/Missing required context for subject/);
  });

  it('handles empty keyStages array', () => {
    const response = {
      subjectSlug: 'maths',
      keyStages: [],
    };
    expect(() => {
      augmentResponseWithCanonicalUrl(
        response, '/subjects/maths', 'get',
      );
    }).toThrow(/Missing required context for subject/);
  });
});
```

**Sub-resource path handling (Snags 3/4):**

```typescript
describe('sub-resource paths under /subjects/', () => {
  it('does not augment /subjects/{s}/key-stages response', () => {
    const response = {
      keyStageSlug: 'ks1',
      keyStageTitle: 'Key Stage 1',
    };
    const result = augmentResponseWithCanonicalUrl(
      response, '/subjects/maths/key-stages', 'get',
    );
    expect(result).not.toHaveProperty('canonicalUrl');
  });

  it('does not augment /subjects/{s}/years array', () => {
    const response = [{ year: 1 }, { year: 2 }];
    const result = augmentArrayResponseWithCanonicalUrl(
      response, '/subjects/maths/years', 'get',
    );
    expect(result).toEqual(response);
  });
});
```

#### A3. `aggregated-fetch.integration.test.ts` — EXTEND

These are integration tests using simple mock executors injected as
arguments. No IO, no network calls.

**Subject fetch with context (Snag 2 secondary bug):**

```typescript
it('includes canonicalUrl for subject fetch', async () => {
  const deps = createMockExecutor({
    status: 200,
    data: {
      subjectTitle: 'Maths',
      subjectSlug: 'maths',
      keyStages: [
        { keyStageSlug: 'ks1', keyStageTitle: 'KS1' },
      ],
    },
  });
  const result = await runFetchTool({ id: 'subject:maths' }, deps);
  const structured = result.structuredContent as {
    canonicalUrl?: string | null;
  };
  expect(structured.canonicalUrl).not.toBeNull();
});

it('includes canonicalUrl for unit fetch', async () => {
  const deps = createMockExecutor({
    status: 200,
    data: {
      unitTitle: 'Fractions',
      unitSlug: 'fractions',
      subjectSlug: 'maths',
      phaseSlug: 'primary',
    },
  });
  const result = await runFetchTool({ id: 'unit:fractions' }, deps);
  const structured = result.structuredContent as {
    canonicalUrl?: string | null;
  };
  expect(structured.canonicalUrl).not.toBeNull();
});
```

#### A4. Client middleware resilience — EXTEND or NEW

Integration test using mock Request/Response objects. No network calls
— `Request` and `Response` are standard Web API objects constructable
in-process.

```typescript
it('returns unaugmented response when augmentation throws', async () => {
  const middleware = createResponseAugmentationMiddleware();
  const body = { subjectSlug: 'maths', subjectTitle: 'Maths' };
  const request = new Request(
    'https://api.example.com/api/v0/subjects/maths',
    { method: 'GET' },
  );
  const response = new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
  const result = await middleware.onResponse({
    request, response, options: {},
  });
  expect(result.status).toBe(200);
  const resultBody = await result.json();
  expect(resultBody).toHaveProperty('subjectSlug', 'maths');
});
```

### Track B — Suggest Search (Snag 1)

The `suggest()` function calls `client.search()` which is IO, but the
ES client is injected as an argument — integration-testable with a
mock. `buildSuggestParams()` is private, but its output is visible
through the mock.

**No network calls needed at any level.**

#### B1. `execution.integration.test.ts` — EXTEND

Verify the params shape passed to `retrieval.suggest()`. The existing
test at line 277-294 verifies `prefix` and `limit` but not `scope` or
context handling.

```typescript
it('passes scope through to suggest call', async () => {
  const retrieval = createFakeRetrieval();
  const deps = createDeps(retrieval);
  const args: SearchSdkArgs = {
    text: 'photo',
    scope: 'suggest',
    subject: 'science',
    keyStage: 'ks3',
  };

  await runSearchSdkTool(args, deps);

  expect(retrieval.suggest).toHaveBeenCalledWith(
    expect.objectContaining({
      prefix: 'photo',
      scope: 'lessons',
      subject: 'science',
      keyStage: 'ks3',
    }),
  );
});
```

#### B2. `suggestions.unit.test.ts` or `suggestions.integration.test.ts` — NEW

Test that `suggest()` builds the correct ES query by injecting a mock
ES client and asserting the query shape. This is an integration test
(code units working together with a simple injected mock).

```typescript
it('includes contexts in ES completion query', async () => {
  const mockSearch = vi.fn().mockResolvedValue({
    suggest: { suggestions: [] },
  });
  const mockClient = { search: mockSearch } as unknown;

  await suggest(
    { prefix: 'photo', scope: 'lessons' },
    mockClient,
    () => 'lessons-index',
    { indexVersion: 'v1' },
  );

  const query = mockSearch.mock.calls[0][0];
  expect(query.suggest.suggestions.completion).toHaveProperty(
    'contexts',
  );
});

it('includes subject and keyStage as contexts', async () => {
  const mockSearch = vi.fn().mockResolvedValue({
    suggest: { suggestions: [] },
  });
  const mockClient = { search: mockSearch } as unknown;

  await suggest(
    { prefix: 'photo', scope: 'lessons',
      subject: 'science', keyStage: 'ks3' },
    mockClient,
    () => 'lessons-index',
    { indexVersion: 'v1' },
  );

  const contexts =
    mockSearch.mock.calls[0][0].suggest.suggestions.completion.contexts;
  expect(contexts).toBeDefined();
});
```

#### B3. `extractSuggestionItems` — pure function, unit testable

```typescript
it('extracts suggestion items from ES response', () => {
  const response = {
    suggest: {
      suggestions: [{
        options: [
          { text: 'photosynthesis' },
          { text: 'photography' },
        ],
      }],
    },
  };
  const items = extractSuggestionItems(response, 10, 'lessons');
  expect(items).toHaveLength(2);
  expect(items[0].label).toBe('photosynthesis');
});

it('respects limit', () => {
  const response = {
    suggest: {
      suggestions: [{
        options: [
          { text: 'a' }, { text: 'b' }, { text: 'c' },
        ],
      }],
    },
  };
  const items = extractSuggestionItems(response, 2, 'lessons');
  expect(items).toHaveLength(2);
});
```

### Track C — Schema Validation (Snag 5)

The Zod `validateOutput` is a pure function. Testing requires a
captured response fixture — one network call to obtain the fixture,
then the test is pure and runs without network.

**No network calls in the test itself.**

#### C1. Schema conformance test — NEW

```typescript
import fixture from './fixtures/ks-subject-questions-response.json';
import { getKeyStagesSubjectQuestions } from
  './generated/data/tools/get-key-stages-subject-questions.js';

it('validates a real API response', () => {
  const result = getKeyStagesSubjectQuestions.validateOutput(fixture);
  expect(result.ok).toBe(true);
});
```

#### C2. Schema comparison test — diagnostic, optional

```typescript
import { getKeyStagesSubjectQuestions } from
  './generated/data/tools/get-key-stages-subject-questions.js';
import { getSequencesQuestions } from
  './generated/data/tools/get-sequences-questions.js';

it('has compatible schema structure with sequences questions', () => {
  // Diagnostic: compare the two schemas to find divergence
  // Both endpoints return arrays of quiz objects
});
```

---

## Execution Strategy

### Grouping

Snags are grouped by root cause family. Track A fixes address the
core architectural weakness (response augmentation outside schema-first
discipline). Track B and C are independent bug fixes.

- **Track A (response augmentation)**: Snags 2 + 3 + 4
  - **A0 (pre-requisite)**: Unify `ContentType` — delete hand-authored
    `ContentType` from `types/response-augmentation.ts` and import
    from generated `url-helpers.ts` (fixes type duplication that
    violates the cardinal rule)
  - **A1**: Add error containment to `augmentBody()` — try-catch with
    `logger.warn` (wrapped in inner try-catch for logger resilience),
    returning unaugmented response on failure
  - **A2**: Refine `isSingleEntityEndpoint()` — positive exact-depth
    regex for subjects only (lessons/units keep current matching as
    they have valid deeper paths)
  - **A3**: Fix `extractSubjectContext()` — schema-driven extraction
    via generated Zod schema (mandatory, not manual narrowing)
  - **A4**: Export `extractContextFromResponse()` for shared use by
    both middleware and `runFetchTool()`; extract context in
    `runFetchTool()` for subjects and units
  - Create `response-augmentation-helpers.unit.test.ts`
  - Extract duplicated `ObjectResponse`/`isNonNullObject` to
    `response-augmentation-helpers.ts` (existing module, not new)
  - Delete `ResponseWithCanonicalUrl` from `types/response-augmentation.ts`
    if unused (index signature `[key: string]: unknown` violates the
    cardinal rule)
  - Estimated effort: ~3h

- **Track B (suggest search)**: Snag 1
  - Investigate ES completion suggester context requirements
  - Fix suggest query construction in `oak-search-sdk`
  - Estimated effort: ~1h investigation + ~1h fix

- **Track C (schema validation)**: Snag 5
  - Capture raw API response and compare against generated schema
  - Fix schema or codegen, regenerate with `pnpm type-gen`
  - Note: `pnpm type-gen` regenerates all schemas, which may affect
    Track A types. Run Track A tests after type-gen to verify.
  - Estimated effort: ~2h

### Test Strategy

Each snag specifies its own TDD plan with explicit test files and
levels. Summary:

| Snag | Primary Test Level | Test File |
|------|--------------------|-----------|
| 1 | Integration | `execution.integration.test.ts` + `suggestions.integration.test.ts` (new) |
| 2 | Unit + Integration | `response-augmentation.unit.test.ts` + `aggregated-fetch.integration.test.ts` |
| 3 | Unit | `response-augmentation-helpers.unit.test.ts` (new) + `response-augmentation.unit.test.ts` |
| 4 | Unit | `response-augmentation-helpers.unit.test.ts` (new) + `response-augmentation.unit.test.ts` |
| 5 | Unit (schema conformance) | Fixture-based test against `validateOutput` |

**Regression verification**: After all fixes, run `pnpm test` across
the SDK workspace. There is no automated 31-tool smoke test; the
original discovery was a manual ad-hoc test. Consider adding the 5
failing tool names to integration-level tests as regression guards.

### Dependencies

- No dependency on widget work or auth migration
- No dependency on SDK workspace separation (these fixes are in the
  existing SDK workspace)
- All fixes are in `packages/sdks/oak-curriculum-sdk/src/` (except
  Snag 1 which may also touch `packages/sdks/oak-search-sdk/src/`)
- **Track A ↔ Track C**: If Track C runs `pnpm type-gen`, regenerated
  schemas may affect Track A types. Re-run Track A tests after type-gen.
  Prefer landing both tracks in the same PR or sequencing Track C
  first.
- **Track B (suggest)**: If the fix depends on ES index mapping
  changes, deployment order matters. The SDK change could fail against
  the current index until the index is updated.

---

## Implementation Notes (2026-02-22)

All three tracks were implemented with full TDD in a single session.

**Track A**: Error containment added to `augmentBody()` with
`logger.warn` (double try-catch for logger resilience).
`isSingleEntityEndpoint()` updated with positive exact-depth
regex for subjects. `extractSubjectContext()` rewritten with
schema-driven extraction using `keyStagesSchema` from generated
Zod schemas. New `response-augmentation-helpers.unit.test.ts`
created.

**Track B**: `suggest()` in oak-search-sdk now builds completion
contexts from `subject` and `keyStage` params. Helper functions
`clampLimit`, `resolveIndexKind`, and `buildCompletionClause`
extracted for lint compliance.

**Track C**: Root cause was `openapi-zod-client` generating
`.strict().and(.strict())` for `allOf` schemas — each `.strict()`
rejects the other side's properties. Fixed via two-pass regex in
`zod-v3-to-v4-transform.ts`. Schema conformance tests added with
real API response fixtures.

### Related finding: logger construction in SDK

During implementation, two logger instances in the SDK were found
to deviate from the established `@oaknational/mcp-logger` pattern:

- `packages/sdks/oak-curriculum-sdk/src/response-augmentation.ts`
- `packages/sdks/oak-curriculum-sdk/src/client/middleware/response-augmentation.ts`

Both used custom inline stdout sinks (`console.log`) instead of
`createNodeStdoutSink()`, passed empty env `{}` instead of
`process.env` (losing OTEL metadata), and hardcoded version
`'1.0.0'`. Additionally, these were module-level singletons rather
than injectable — consuming apps could not control logger
configuration.

**FIXED (2026-02-23)**: Both files updated to use
`createNodeStdoutSink()` and `buildResourceAttributes(process.env, ...)`
for proper OTEL attributes. The middleware factory now accepts an
optional `Logger` for DI. Integration tests added (4 tests covering
injection, fallback, and error containment). The broader `no-console`
enforcement across the codebase is tracked separately in
[no-console-enforcement.plan.md](../../../architecture-and-infrastructure/archive/completed/no-console-enforcement.plan.md).

---

## Related Plans

- [Semantic search roadmap](../roadmap.md) — milestone context
- [Widget search rendering](widget-search-rendering.md) — completed;
  no dependency
- [SDK workspace separation](sdk-workspace-separation.md) — pending;
  no dependency (fixes are in existing workspace)
- [High-level plan](../../high-level-plan.md) — milestone sequence
