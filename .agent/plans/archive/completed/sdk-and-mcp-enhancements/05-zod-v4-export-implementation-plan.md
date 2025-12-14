# Zod v3 Isolation to Adapter Workspace

**Status**: ✅ COMPLETE  
**Created**: 2025-11-28  
**Completed**: 2025-11-30

---

## Goal

**Strictly isolate Zod v3 AND all Zodios references to the `openapi-zod-client-adapter` workspace.**

- **Adapter workspace** (`packages/libs/openapi-zod-client-adapter`):
  - Has `"zod": "^3"` - only place Zod v3 is allowed
  - Only place Zodios references are allowed (internal implementation detail)
- **All other workspaces**:
  - Have `"zod": "^4"` - import directly from `'zod'`
  - No Zodios references whatsoever

```
┌─────────────────────────────────────────────────────────────────┐
│  openapi-zod-client-adapter (zod@^3)                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Internal: openapi-zod-client, Zodios types             │    │
│  │  zod-v3-to-v4-transform.ts → Zod v4 code strings        │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  SDK + Apps (zod@^4)                                            │
│  • All imports: `import { z } from 'zod'`                       │
│  • No `zod/v4` subpath (doesn't exist in pure Zod v4)           │
│  • No Zodios references                                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Critical Understanding

### Import Paths

| Package                      | `package.json` | Correct Import            |
| ---------------------------- | -------------- | ------------------------- |
| `openapi-zod-client-adapter` | `"zod": "^3"`  | Internal Zod v3 allowed   |
| `oak-curriculum-sdk`         | `"zod": "^4"`  | `import { z } from 'zod'` |
| All apps                     | `"zod": "^4"`  | `import { z } from 'zod'` |

**Key insight**: The `zod/v4` subpath only exists in the dual package (`zod@^3.25.x`). If you have `"zod": "^4"`, there is NO `zod/v4` subpath.

---

## Current Build Error

```
@oaknational/open-curriculum-semantic-search:build: Type error: Type 'unknown' has no matching index signature for type 'number'.
@oaknational/open-curriculum-semantic-search:build: > 41 | export type SubjectSequenceEntry = SearchSubjectSequences[number];
```

This happens because `SearchSubjectSequences` resolves to `unknown`.

---

## Blocking Issues

### Issue 1: `curriculumSchemas` Loses Type Information

**File**: `packages/sdks/oak-curriculum-sdk/src/types/search-response-guards.ts`

```typescript
import type { z } from 'zod';
import { curriculumSchemas } from './generated/zod/curriculumZodSchemas.js';

export const subjectSequencesSchema = curriculumSchemas.SubjectSequenceResponseSchema;
export type SearchSubjectSequences = z.infer<SubjectSequenceResponseSchema>;
```

**Problem chain**:

1. `curriculumSchemas` is typed as `CurriculumSchemaCollection` = `Record<string, z.ZodType>`
2. Accessing `curriculumSchemas.SubjectSequenceResponseSchema` gives `z.ZodType` (generic)
3. `z.infer<z.ZodType>` = `unknown`
4. `unknown[number]` fails

**Fix**: The generator creates `rawCurriculumSchemas` with `as const` which preserves specific types. Change generator to export it, then use it in `search-response-guards.ts`:

```typescript
import { z } from 'zod'; // Value import, not type-only
import { rawCurriculumSchemas } from './generated/zod/curriculumZodSchemas.js';

export const subjectSequencesSchema = rawCurriculumSchemas.SubjectSequenceResponseSchema;
```

### Issue 2: `ZodIssue` Not Exported in Zod v4

**File**: `packages/sdks/oak-curriculum-sdk/src/validation/types.ts` line 7

```typescript
import type { z, ZodIssue } from 'zod'; // ❌ ZodIssue doesn't exist in Zod v4
```

**Verification** (run in SDK directory):

```bash
node -e "const z = require('zod'); console.log('ZodIssue:', typeof z.ZodIssue)"
# Output: ZodIssue: undefined
```

**Fix**: Use `ZodError['issues'][number]` pattern:

```typescript
import type { z, ZodError } from 'zod';
type ZodIssue = ZodError['issues'][number];
```

### Issue 3: Zodios References Outside Adapter

Files with "Zodios" that need fixing:

| File                                                                               | Issue                                         |
| ---------------------------------------------------------------------------------- | --------------------------------------------- |
| `packages/sdks/oak-curriculum-sdk/type-gen/zodgen-core.ts`                         | Defines `ZodiosEndpoint`, has Zodios comments |
| `packages/sdks/oak-curriculum-sdk/type-gen/zodgen-core.unit.test.ts`               | Test fixture has `new Zodios(endpoints)`      |
| `packages/sdks/oak-curriculum-sdk/type-gen/zodgen-core.integration.test.ts`        | Test fixture has `new Zodios(endpoints)`      |
| `packages/sdks/oak-curriculum-sdk/src/types/generated/zod/curriculumZodSchemas.ts` | Generated with `ZodiosEndpoint`               |

**Fix**: In `zodgen-core.ts`:

- Rename `ZodiosEndpoint` → `Endpoint`
- Remove all comments mentioning Zodios/`@zodios/core`
- The interface stays in the generated file (it's for runtime use with `z.ZodType`)

---

## Remediation Tasks

### Task 1: Rename ZodiosEndpoint → Endpoint in Generator

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/zodgen-core.ts`

Find all occurrences of `ZodiosEndpoint` and rename to `Endpoint`. Remove comments mentioning Zodios or `@zodios/core`. The interface should become:

```typescript
'/** Endpoint interface for OpenAPI-derived endpoints */',
'interface Endpoint {',
```

### Task 2: Export rawCurriculumSchemas

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/zodgen-core.ts` (~line 204)

Change:

```typescript
'const rawCurriculumSchemas = ' + body + ' as const satisfies CurriculumSchemaCollection;',
```

To:

```typescript
'export const rawCurriculumSchemas = ' + body + ' as const satisfies CurriculumSchemaCollection;',
```

### Task 3: Fix search-response-guards.ts

**File**: `packages/sdks/oak-curriculum-sdk/src/types/search-response-guards.ts`

Change:

```typescript
import type { z } from 'zod';
import { curriculumSchemas } from './generated/zod/curriculumZodSchemas.js';
```

To:

```typescript
import { z } from 'zod';
import { rawCurriculumSchemas, curriculumSchemas } from './generated/zod/curriculumZodSchemas.js';
```

Then use `rawCurriculumSchemas` for schema assignments that need type preservation:

```typescript
export const lessonSummarySchema = rawCurriculumSchemas.LessonSummaryResponseSchema;
export const unitSummarySchema = rawCurriculumSchemas.UnitSummaryResponseSchema;
export const subjectSequencesSchema = rawCurriculumSchemas.SubjectSequenceResponseSchema;
```

### Task 4: Fix ZodIssue Import

**File**: `packages/sdks/oak-curriculum-sdk/src/validation/types.ts`

Change line 7:

```typescript
import type { z, ZodIssue } from 'zod';
```

To:

```typescript
import type { z, ZodError } from 'zod';
/** ZodIssue type derived from ZodError (not directly exported in Zod v4) */
type ZodIssue = ZodError['issues'][number];
```

### Task 5: Update Test Fixtures

**Files**:

- `packages/sdks/oak-curriculum-sdk/type-gen/zodgen-core.unit.test.ts`
- `packages/sdks/oak-curriculum-sdk/type-gen/zodgen-core.integration.test.ts`

Remove `export const api = new Zodios(endpoints);` from test fixtures. The adapter transformer removes this line, so fixtures should reflect post-transformation state.

### Task 6: Regenerate and Verify

```bash
pnpm type-gen
pnpm build
pnpm check

# Verify no Zodios references in SDK
grep -ri zodios packages/sdks  # Must return empty
```

---

## Zod v3 → v4 API Differences

| Zod v3           | Zod v4                       | Notes               |
| ---------------- | ---------------------------- | ------------------- |
| `ZodSchema`      | `ZodType`                    | Type renamed        |
| `ZodTypeAny`     | `ZodType`                    | Eliminated          |
| `.passthrough()` | `.loose()`                   | Method renamed      |
| `ZodIssue`       | `ZodError['issues'][number]` | Not a direct export |

---

## Key Files

| File                                                                               | Role                                 |
| ---------------------------------------------------------------------------------- | ------------------------------------ |
| `packages/libs/openapi-zod-client-adapter/src/zod-v3-to-v4-transform.ts`           | Adapter: v3 → v4 code transform      |
| `packages/sdks/oak-curriculum-sdk/type-gen/zodgen-core.ts`                         | Generator (has Zodios naming to fix) |
| `packages/sdks/oak-curriculum-sdk/src/types/generated/zod/curriculumZodSchemas.ts` | Generated (never edit directly)      |
| `packages/sdks/oak-curriculum-sdk/src/validation/types.ts`                         | Uses ZodIssue (needs fix)            |
| `packages/sdks/oak-curriculum-sdk/src/types/search-response-guards.ts`             | Type derivation (needs fix)          |

---

## Success Criteria

- [x] `ZodiosEndpoint` renamed to `Endpoint` in generator
- [x] No "Zodios" string anywhere outside adapter workspace (except transformation logic string literals)
- [x] `rawCurriculumSchemas` exported from generated file
- [x] `search-response-guards.ts` uses `rawCurriculumSchemas`
- [x] `ZodIssue` import fixed in `validation/types.ts`
- [x] `pnpm type-gen` succeeds
- [x] `pnpm build` succeeds (including semantic-search app)
- [x] `pnpm check` passes
- [x] Generated output has no Zodios references
