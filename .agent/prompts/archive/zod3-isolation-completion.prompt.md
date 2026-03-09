# Complete Zod v3 and Zodios Isolation to Adapter Workspace

## Context

The repo requires strict isolation:

- **Adapter workspace** (`packages/libs/openapi-zod-client-adapter`): `"zod": "^3"`, Zodios references OK (internal)
- **All other workspaces**: `"zod": "^4"`, import from `'zod'`, NO Zodios references

## Current Build Error

```
Type error: Type 'unknown' has no matching index signature for type 'number'.
export type SubjectSequenceEntry = SearchSubjectSequences[number];
```

`pnpm type-gen` succeeds, `pnpm build` fails at semantic-search app.

---

## Blocking Issues (in fix order)

### 1. Rename `ZodiosEndpoint` → `Endpoint` in Generator

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/zodgen-core.ts`

- Rename all `ZodiosEndpoint` → `Endpoint`
- Remove all comments mentioning Zodios/`@zodios/core`

### 2. Export `rawCurriculumSchemas` from Generator

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/zodgen-core.ts` (~line 204)

Change `'const rawCurriculumSchemas = '` to `'export const rawCurriculumSchemas = '`

### 3. Fix `search-response-guards.ts`

**File**: `packages/sdks/oak-curriculum-sdk/src/types/search-response-guards.ts`

```typescript
// Change from:
import type { z } from 'zod';
import { curriculumSchemas } from './generated/zod/curriculumZodSchemas.js';

// To:
import { z } from 'zod';
import { rawCurriculumSchemas, curriculumSchemas } from './generated/zod/curriculumZodSchemas.js';
```

Use `rawCurriculumSchemas` for schema assignments (preserves specific types).

### 4. Fix `ZodIssue` Import

**File**: `packages/sdks/oak-curriculum-sdk/src/validation/types.ts` line 7

```typescript
// ZodIssue is not exported in Zod v4. Change from:
import type { z, ZodIssue } from 'zod';

// To:
import type { z, ZodError } from 'zod';
type ZodIssue = ZodError['issues'][number];
```

### 5. Update Test Fixtures

**Files**: `zodgen-core.unit.test.ts`, `zodgen-core.integration.test.ts`

Remove `export const api = new Zodios(endpoints);` from fixtures.

### 6. Regenerate and Verify

```bash
pnpm type-gen
pnpm build
pnpm check

# Must return empty:
grep -ri zodios packages/sdks
```

---

## Detailed Plan

Read: `.agent/plans/sdk-and-mcp-enhancements/05-zod-v4-export-implementation-plan.md`

## Foundation Documents

Read before starting:

- `.agent/directives/principles.md`
- `.agent/directives/testing-strategy.md`
