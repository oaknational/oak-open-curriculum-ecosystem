# Oak OpenAPI Bug Report

**Date**: 2026-03-07
**Reporter**: oak-mcp-ecosystem team
**Context**: Identified during a systematic smoke test of the Oak MCP server surface,
which consumes the Oak OpenAPI as its upstream data source. All source references
below are from the `oak-openapi` repository.

---

## Issue 1: Inconsistent content blocking across lesson sub-resource endpoints

### Summary

Different lesson sub-resource endpoints apply different content-gating functions,
leading to inconsistent behaviour where one endpoint returns data for a lesson
while another returns `400 BAD_REQUEST` with `cause: "blocked"` for the same lesson.

### Reproduction

Using a lesson from a non-maths subject (e.g. `engaging-with-the-myth-the-trojan-horse`
in English):

1. `GET /api/v0/lessons/engaging-with-the-myth-the-trojan-horse/summary`
   returns **200 OK** with full lesson data.
2. `GET /api/v0/lessons/engaging-with-the-myth-the-trojan-horse/quiz`
   returns **400 BAD_REQUEST** `{ cause: "blocked" }`.
3. `GET /api/v0/lessons/engaging-with-the-myth-the-trojan-horse/transcript`
   returns **400 BAD_REQUEST** `{ cause: "blocked" }`.

All three requests use the same lesson slug. A consumer that successfully fetches
the summary then cannot fetch the quiz or transcript for the same lesson.

### Root cause: two different gating functions with different logic

The lesson summary handler uses `blockLessonForCopyrightText`, while transcript,
quiz, and asset handlers use `checkLessonAllowedAsset`. These two functions
apply fundamentally different gating logic:

**`blockLessonForCopyrightText`** (`src/lib/queryGate.ts:68-85`):

```text
1. If lessonSlug is in supportedLessons.json → ALLOW
2. Query Hasura for subject/unit
3. Call isBlockedUnitOrSubject → checks supportedUnits, then blockedSubjects
```

This is a "block known bad" approach: only `blockedSubjects` (`['english',
'financial-education']` at line 50) are rejected, and the `supportedUnits`
allow-list can override the block.

**`checkLessonAllowedAsset`** (`src/lib/queryGate.ts:157-211`):

```text
1. If lessonSlug is in assetBlockedLessons.json → BLOCK
2. If unitSlug is in assetBlockedUnits.json → BLOCK
3. If subject is in supportedSubjects (['maths'] at line 49) → ALLOW
4. If unit is in supportedUnits.json → ALLOW
5. If lesson is in supportedLessons.json → ALLOW
6. Otherwise → BLOCK
```

This is an "allow known good" approach: everything is blocked unless it appears
on a specific allow-list. Since `supportedSubjects` is `['maths']` only, any
non-maths lesson that isn't individually allow-listed is blocked.

### Where the handlers make their gating calls

| Endpoint | Handler file | Line | Gating function |
|----------|-------------|------|-----------------|
| `/lessons/{lesson}/summary` | `src/lib/handlers/lesson/lesson.ts` | 54 | `blockLessonForCopyrightText` |
| `/lessons/{lesson}/summary` (downloads flag) | `src/lib/handlers/lesson/lesson.ts` | 140 | `checkLessonAllowedAsset` |
| `/lessons/{lesson}/transcript` | `src/lib/handlers/transcript/transcript.ts` | 33 | `checkLessonAllowedAsset` |
| `/lessons/{lesson}/assets` | `src/lib/handlers/assets/assets.ts` | 62 | `checkLessonAllowedAsset` |

### Suggested fix

Either:

1. **Align** all lesson sub-resource endpoints to the same gating function (most
   likely `checkLessonAllowedAsset` everywhere, since the summary handler already
   uses it for the `downloadsAvailable` flag on line 140), or
2. **Document** the intentional difference and its rationale in the codebase. The
   comment block at the top of `queryGate.ts` (lines 1-12) explains this is a
   "short term fix" from Oct 2024 — if it is still intended to be temporary, it
   may be worth revisiting the approach.

---

## Issue 2: `/threads` response schema omits subject context

### Summary

The `GET /api/v0/threads` endpoint returns threads with only `title` and `slug`.
No subject information is included, making it impossible for consumers to filter
or group threads by subject without making additional calls.

### Reproduction

```text
GET /api/v0/threads
```

Returns:

```json
[
  { "title": "Number: Multiplication and division", "slug": "number-multiplication-and-division" },
  { "title": "Grammatical knowledge", "slug": "grammatical-knowledge" },
  ...
]
```

A consumer wanting to distinguish "Maths threads" from "English threads" has no data
to work with. Threads are progression strands within specific subjects, so this
information exists in the underlying data but is not surfaced.

### Root cause

**Schema** (`src/lib/handlers/threads/types.ts:3-6`):

```typescript
export const threadSchema = z.object({
  title: z.string().meta({ description: 'The thread title' }),
  slug: z.string().meta({ description: 'The thread slug identifier' }),
});
```

Only `title` and `slug` are defined. No subject field.

**GraphQL query** (`src/lib/handlers/threads/threads.ts:31-44`):

```graphql
query {
  threads(
    where: {
      _state: { _eq: "published" }
      thread_units_aggregate: {
        count: { arguments: [order], predicate: { _gt: 0 } }
      }
    }
  ) {
    title
    slug
  }
}
```

The query only selects `title` and `slug`. The Hasura `threads` table has
relationships to units and subjects that could be traversed to include subject
context.

**Type** (`src/lib/owaClient.ts:151-156`):

```typescript
export type ThreadWithUnits = TitleSlug & {
  thread_units: {
    order: number;
    unit: TitleSlug;
  }[];
};
```

The client type only models the unit relationship, not subject.

### Suggested fix

1. Extend the GraphQL query at `src/lib/handlers/threads/threads.ts:31-44` to
   also select subject information via the thread-to-unit-to-subject relationship,
   or if the `threads` table has a direct `subject_slug` field.
2. Add `subjects` to the `threadSchema` at `src/lib/handlers/threads/types.ts:3`:

```typescript
export const threadSchema = z.object({
  title: z.string().meta({ description: 'The thread title' }),
  slug: z.string().meta({ description: 'The thread slug identifier' }),
  subjects: z.array(z.string()).meta({ description: 'Subject slugs this thread belongs to' }),
});
```

3. Update the OpenAPI schema at
   `src/lib/zod-openapi/generated/threads/allThreadsResponse.openapi.ts` — this
   should propagate automatically since it imports `threadSchema`.

---

## Issue 3: Swapped `offset` and `limit` descriptions in key-stages-subject-lessons

### Summary

The OpenAPI spec for `GET /api/v0/key-stages/{keyStage}/subjects/{subject}/lessons`
has the description strings for `offset` and `limit` transposed.

### Reproduction

Open the playground at `/playground` or inspect the OpenAPI spec. The
`offset` parameter says it limits results; the `limit` parameter says it offsets.

### Root cause

The OpenAPI-layer schema override at
`src/lib/zod-openapi/generated/keyStageSubjectLessons/keyStageSubjectLessonsRequest.openapi.ts:23-28`:

```typescript
offset: offsetSchema.describe(
  'Limit the number of lessons returned per unit. Units with zero lessons after limiting are omitted.',
),
limit: limitSchema.describe(
  'Offset applied to lessons within each unit (not to the unit list).',
),
```

The descriptions are assigned to the wrong parameters. Note that the base schemas
in `src/lib/handlers/commonTypes.ts` have correct generic descriptions:

```typescript
// commonTypes.ts:3-10 — correct
export const offsetSchema = z
  .number()
  .describe('If limiting results returned, this allows you to return the next set of results, starting at the given offset point')
  // ...

// commonTypes.ts:12-18 — correct
export const limitSchema = z
  .number()
  .describe('Limit the number of lessons, e.g. return a maximum of 100 lessons')
  // ...
```

The endpoint-specific overrides in the `.openapi.ts` file swap the descriptions.

### Suggested fix

Swap the two `.describe()` calls at
`src/lib/zod-openapi/generated/keyStageSubjectLessons/keyStageSubjectLessonsRequest.openapi.ts:23-28`:

```typescript
offset: offsetSchema.describe(
  'Offset applied to lessons within each unit (not to the unit list).',
),
limit: limitSchema.describe(
  'Limit the number of lessons returned per unit. Units with zero lessons after limiting are omitted.',
),
```

---

## Impact on downstream consumers

These issues were identified while building MCP tools that consume the Oak OpenAPI.

- **Issue 1** causes confusing error flows: an AI agent successfully fetches a lesson
  summary, then fails when trying to retrieve the quiz or transcript for the same
  lesson, with no way to predict which lessons will behave inconsistently.
- **Issue 2** forces consumers to make `O(n)` additional calls or maintain their own
  thread-to-subject mapping.
- **Issue 3** propagates incorrect parameter documentation to every consumer of the
  OpenAPI spec, including generated SDKs and AI tool schemas.

None of these are critical blockers, but they reduce the reliability and usability
of the API surface for programmatic consumers. Happy to discuss any of these in
more detail.
