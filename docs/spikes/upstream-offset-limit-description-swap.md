# Upstream offset/limit Description Swap

**Date**: 2026-04-14
**Status**: Historical diagnosis — superseded by the upstream 2026-07 rework;
see the dated update below. The overrides remain live under a new rationale.
**Upstream repo**: `oak-openapi` (Oak Open API)

## Update — 2026-08-03: upstream reworked the wording; overrides re-adjudicated KEEP

The transposition this spike diagnosed no longer exists. Upstream's 2026-07
spec rework (0.7.x) replaced the swapped per-unit descriptions on the lessons
endpoint with the generic whole-list pagination wording from `commonTypes.ts`
("If limiting results returned…" / "Limit the number of lessons, e.g. return
a maximum of 300 lessons"). The transposition is gone, but the generic text
does not describe the endpoint's actual behaviour — the handlers are
unchanged and offset/limit still apply per unit, not to the whole lesson
list (verified against the upstream source, 21 commits in the refresh range,
2026-08-03).

Disposition (owner-ratified at the 2026-08-03 card): the overrides in
`param-description-overrides.ts` are KEPT — their `correctDescription`
values still describe the real per-unit semantics — and each
`upstreamBuggyDescription` is re-pinned to the new upstream wording so the
removal-condition sentinel fires on the next upstream change. The sentinel's
failure message now instructs re-adjudication, never removal on sight.

"The Fix" and "Upstream Fix (Pending)" below describe the retired
transposition and no longer apply as written; the remaining upstream ask is
per-unit-accurate descriptions on this endpoint (raised via the MCP OKR
Linear board rather than a code patch). "Local Fix (Implemented)" is trued
in place below to describe the override mechanism's current behaviour;
the historical sections keep their dated diagnosis in past tense. (The
upstream limit example also moved from "100 lessons" at the time of the
diagnosis to "300 lessons" today.)

## Summary

The upstream OpenAPI spec served at
`open-api.thenational.academy/api/v0/swagger.json` has the
`offset` and `limit` parameter descriptions transposed on the
`/key-stages/{keyStage}/subject/{subject}/lessons` endpoint.
Our codegen faithfully reproduces this bug across three
description surfaces (TSDoc, JSON Schema, Zod `.describe()`).

## Affected Endpoint

Only one endpoint is affected:

- **`GET /key-stages/{keyStage}/subject/{subject}/lessons`**

Other endpoints using offset/limit (`/sequences/{sequence}/questions`,
`/key-stages/{keyStage}/subject/{subject}/questions`) use the
base schemas from `commonTypes.ts` without overrides and have
correct descriptions.

## What's Wrong

In the generated file
`src/lib/zod-openapi/generated/keyStageSubjectLessons/keyStageSubjectLessonsRequest.openapi.ts`
(lines 23-28):

```typescript
offset: offsetSchema.describe(
  'Limit the number of lessons returned per unit. Units with zero lessons after limiting are omitted.',
),
limit: limitSchema.describe(
  'Offset applied to lessons within each unit (not to the unit list).',
),
```

The `.describe()` overrides are on the wrong parameters:

- `offset` has `limit`'s description
- `limit` has `offset`'s description

## Root Cause

Commit `ea55594f` (2026-01-08, Remy Sharp) titled "fix: give
clear instructions (for AI agent) how pagination works":

> I've tested this with codex and gemini. Gemini understood how
> the pagination should work, but codex didn't. Codex suggested
> this text change (doesn't apply to the question endpoints),
> and after the change, it was able to paginate and capture all
> the lessons.

The intent was correct — add per-unit pagination context for AI
agents. The descriptions themselves are accurate about what the
parameters do (limit restricts lessons per unit, offset moves
the starting point within each unit). They were simply placed
on the wrong parameter names.

## Upstream Codebase Structure

### Key facts about oak-openapi

- **Framework**: Next.js 15 (App Router) + tRPC + `trpc-to-openapi`
- **Schema library**: Zod v4 with `zod-openapi` for metadata
- **Package manager**: pnpm v10

### Schema pipeline

```text
handlers/{endpoint}/schemas/*.schema.ts  (source schemas)
  + handlers/{endpoint}/examples/*.json  (example data)
        |
        v
bin/zod-openapi-schema-gen/addExamplesToZodSchema.mjs  (Babel AST codegen)
        |
        v
src/lib/zod-openapi/generated/{endpoint}/*.openapi.ts  (generated output)
        |
        v
handlers/{endpoint}/{endpoint}.ts  (imports generated schemas)
        |
        v
lib/router.ts  →  generateOpenApiDocument()  →  /api/v0/swagger.json
```

### The "generated" directory is generated BUT manually edited

The `generated/` directory IS produced by a code generation
script (`bin/zod-openapi-schema-gen/addExamplesToZodSchema.mjs`).
However, the swapped `.describe()` calls were added as a manual
edit to the generated file AFTER generation. The source schema
(`keyStageSubjectLessonsRequest.schema.ts`, lines 18-19) uses
bare `offsetSchema` and `limitSchema` from `commonTypes.ts`
without any `.describe()` overrides.

### Base schemas are correct

In `src/lib/handlers/commonTypes.ts`:

```typescript
// offsetSchema (line 12-19) — correct description:
// "If limiting results returned, this allows you to return
//  the next set of results, starting at the given offset point"

// limitSchema (line 21-27) — correct description:
// "Limit the number of lessons, e.g. return a maximum of
//  100 lessons"
```

## The Fix

Swap the `.describe()` calls in the generated file (lines 23-28):

```typescript
// Before (wrong):
offset: offsetSchema.describe(
  'Limit the number of lessons returned per unit. ...',
),
limit: limitSchema.describe(
  'Offset applied to lessons within each unit ...',
),

// After (correct):
offset: offsetSchema.describe(
  'Offset applied to lessons within each unit (not to the unit list).',
),
limit: limitSchema.describe(
  'Limit the number of lessons returned per unit. Units with zero lessons after limiting are omitted.',
),
```

Ideally the descriptions should also be added to the source
schema (`keyStageSubjectLessonsRequest.schema.ts`) so they
survive re-generation. However, examining the codegen script
shows it handles `.describe()` propagation already — the cleaner
fix may be to add the overrides in the source schema and
re-run that repository's `generate:openapi` script.

## Impact on This Repo

Our codegen in `packages/sdks/oak-sdk-codegen/` faithfully
reproduces upstream descriptions. At the time of this diagnosis, the
generated MCP tool `get-key-stages-subject-lessons` had swapped
descriptions across all three surfaces:

1. **TSDoc interface** — JSDoc comments on the type
2. **JSON Schema** — `inputSchema` property descriptions
3. **Zod schema** — `.describe()` strings

These descriptions are what AI models read when deciding how to use the
tool parameters; the swap actively misled models. (All three surfaces
now carry the corrected per-unit text via the override below.)

### Automatic propagation when fixed upstream

The codegen fix from session 2026-04-14e (commit `56e92b0d`)
changed `writeSchemaCacheIfChanged` to compare full serialised
content rather than just the schema version. This means that
when upstream fixes the descriptions and deploys, our next
`pnpm sdk-codegen` run will detect the content change and
update the cache, even if the upstream schema version doesn't
change.

## Local Fix (Implemented)

Added a parameter description override in our codegen pipeline:

- **Override module**:
  `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/param-description-overrides.ts`
  — replaces the incorrect upstream descriptions with the per-unit
  text at codegen time, keyed by `{openApiPath}:{paramName}`
- **Integration point**:
  `mcp-tool-generator.ts` calls `applyParamDescriptionOverrides`
  after `buildParamMetadataForOperation`, before generating tool
  files
- **Unit test**:
  `param-description-overrides.unit.test.ts` — proves the
  replacement mechanism and non-interference on other paths/params
- **Removal-condition test**:
  `upstream-param-description-overrides.unit.test.ts` — reads the
  schema cache and asserts the pinned upstream wording persists.
  When upstream's wording moves and `pnpm sdk-codegen` refreshes
  the cache, this test FAILS with a message instructing
  RE-ADJUDICATION against the endpoint's actual behaviour — remove
  the override only if upstream is now correct; re-pin if the new
  wording is still wrong (this is what happened 2026-08-03)

## Upstream Fix (Pending)

The fix in `oak-openapi` is a two-line swap in
`keyStageSubjectLessonsRequest.schema.ts` (source) and the
corresponding generated file. Note: the `generate:openapi` script is
currently broken in that repo (documented in CLAUDE.md), so both
files must be edited by hand.
