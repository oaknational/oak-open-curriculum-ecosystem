# Strict Zod Schema Generation & OpenAPI Compliance

> **Status**: ✅ Complete (2025-12-16)  
> **Priority**: High (affects type safety across entire codebase)  
> **Foundation Alignment**: [principles.md](../../directives/principles.md), [schema-first-execution.md](../../directives/schema-first-execution.md), [testing-strategy.md](../../directives/testing-strategy.md)

## Strategic Intent

Ensure all Zod schemas generated from OpenAPI are **strict by default**, rejecting unknown keys and preventing silent data loss. This aligns with the Cardinal Rule: all type information flows from the OpenAPI schema at type-gen time.

### Value Delivered

- **Fail-fast validation**: Unknown keys cause immediate, clear errors rather than being silently ignored
- **No type information loss**: Schemas precisely match the OpenAPI contract
- **No `any` or `unknown` pollution**: All validated data has exact, known types
- **Schema-first compliance**: Generator is single source of truth; runtime code is thin facade

## Problem Statement

### Issue 1: Contradictory Schema Generation

When `openapi-zod-client` generates schemas:

1. `strictObjects: true` → adds `.strict()` to object schemas
2. `additionalProperties: true` in OpenAPI → adds `.passthrough()`
3. Result: `.strict().passthrough()` which is contradictory

### Issue 2: Incorrect Use of `additionalProperties: true`

In `schema-enhancement-404.ts`, we have:

```json
{
  "type": "object",
  "additionalProperties": true,
  "properties": {
    "code": { "type": "string" },
    "httpStatus": { "type": "integer" }
  }
}
```

**Problems**:

1. If we know the properties, why use `additionalProperties: true`?
2. `additionalProperties: true` is equivalent to adding `any` to the codebase
3. Violates principles.md: "No type shortcuts"

### Issue 3: Zod v3 → v4 Migration Confusion

The transform `.passthrough()` → `.loose()` is a **version migration**, not a strictness change:

```typescript
// Zod v3
z.object({ name: z.string() }).passthrough();

// Zod v4 (equivalent)
z.looseObject({ name: z.string() });
```

Both allow unknown keys to pass through. The conversion is necessary for v4 compatibility.

## Solution Design

### Principle 1: Schema Drives Behaviour

The OpenAPI schema transformation (`api-schema-original.json` → `api-schema-sdk.json`) is where we define strictness:

- **No `additionalProperties`** → `additionalPropertiesDefaultValue: false` → strict (no unknown keys)
- **`additionalProperties: { schema }`** → generates `z.record(schema)` (typed dictionary)
- **NEVER use `additionalProperties: true`** → equivalent to `any`

### Principle 2: Options Configuration

```typescript
// In openapi-zod-client-adapter
{
  strictObjects: true,                    // Adds .strict() when no additionalProperties
  additionalPropertiesDefaultValue: false // No .passthrough() when additionalProperties unspecified
}
```

### Principle 3: Correct v3 → v4 Transform

```typescript
// zod-v3-to-v4-transform.ts
result = result.replace(/\.passthrough\(\)/g, '.loose()');
```

This is correct and necessary. Do NOT remove or modify this conversion.

## Implementation Tasks

### Phase 1: Fix Schema Enhancements (TDD)

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/schema-enhancement-404.ts`

#### Task 1.1: Remove `additionalProperties: true` where we have explicit `properties`

**Test First (RED)**:

```typescript
it('schema should not contain additionalProperties: true alongside properties', () => {
  const schema = transcript404Descriptor.media.schema;
  expect(schema).not.toHaveProperty('additionalProperties', true);
  expect(schema.properties.data).not.toHaveProperty('additionalProperties', true);
});
```

**Implementation (GREEN)**:

- Remove `additionalProperties: true` from root object (line 81)
- Remove `additionalProperties: true` from `data` object (line 55)
- Change `zodError` from `anyOf: [{ type: 'object', additionalProperties: true }, { type: 'null' }]` to `type: 'null'`

**Rationale**: We know the exact shape. Strict validation catches mismatches.

### Phase 2: Restore Correct v3 → v4 Transform (TDD)

**File**: `packages/core/openapi-zod-client-adapter/src/zod-v3-to-v4-transform.ts`

#### Task 2.1: Restore `.passthrough()` → `.loose()` conversion

**Test First (RED)**:

```typescript
it('transforms .passthrough() to .loose() for Zod v4 compatibility', () => {
  const input = 'z.object({}).passthrough()';
  const expected = 'z.object({}).loose()';
  expect(transformZodV3ToV4(input)).toBe(expected);
});
```

**Implementation (GREEN)**:

```typescript
// 3. Transform deprecated Zod v3 methods for v4 compatibility
result = result.replace(/\.passthrough\(\)/g, '.loose()');
```

### Phase 3: Remove Crude Hack

**File**: `packages/core/openapi-zod-client-adapter/src/zod-v3-to-v4-transform.ts`

Remove any code that strips `.passthrough()` without converting to `.loose()`.

### Phase 4: Update Tests

Update test files to match new schema expectations:

- `schema-enhancement-404.unit.test.ts`
- `schema-separation.unit.test.ts`
- `build-response-map.integration.test.ts`

### Phase 5: Verify Generation

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm test
```

**Expected Outcome**:

- Generated schemas use `.strict()` where appropriate
- No `.strict().loose()` contradictions
- No `additionalProperties: true` in SDK schema
- All quality gates pass

## Acceptance Criteria

| Criterion                                        | Measurement                                                                                       |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| No `additionalProperties: true` in type-gen code | `grep -r "additionalProperties.*true" type-gen/` returns only test files with negative assertions |
| Generated schemas are strict                     | `grep -c "\.strict\(\)"` shows expected count, no `.strict().loose()` patterns                    |
| v3→v4 transform is correct                       | `.passthrough()` → `.loose()` conversion in place                                                 |
| All quality gates pass                           | `pnpm type-gen && pnpm build && pnpm type-check && pnpm lint:fix && pnpm test` all exit 0         |
| No `any` or `unknown` in generated Zod           | `grep -c "z\.any\(\)\|z\.unknown\(\)"` in generated files is 0 or explained                       |

## Decision Record

### Why `strictObjects: true` + `additionalPropertiesDefaultValue: false`?

Per principles.md "Fail FAST":

> Fail fast with helpful error messages, never silently. NEVER SWALLOW ERRORS.

Unknown keys being silently ignored is swallowing errors.

### Why no `additionalProperties: true`?

Per principles.md "No type shortcuts":

> Never use `as`, `any`, `!`, or `Record<string, unknown>` [...] they ALL disable the type system

`additionalProperties: true` generates `.passthrough()` which allows ANY keys—equivalent to `any`.

### Why `.passthrough()` → `.loose()` is correct?

This is purely a Zod v3 → v4 API migration:

- v3: `.passthrough()` allows unknown keys
- v4: `.loose()` allows unknown keys (`.passthrough()` deprecated but still works)

The conversion ensures we use modern Zod v4 APIs.

## Zod Generation Architecture

### Generation Locations

| Source                        | Generator                      | Behaviour                                                        | Output                                 |
| ----------------------------- | ------------------------------ | ---------------------------------------------------------------- | -------------------------------------- |
| **OpenAPI Schema**            | `openapi-zod-client-adapter`   | `strictObjects: true`, `additionalPropertiesDefaultValue: false` | `curriculumZodSchemas.ts`              |
| **Search Field Definitions**  | `zod-schema-generator.ts`      | Uses `.strict()`                                                 | `index-documents.ts`, `suggestions.ts` |
| **Search Responses/Requests** | `type-gen/typegen/search/*`    | Uses `.strict()`                                                 | `responses.*.ts`, `requests.ts`        |
| **MCP Tool Schemas**          | `type-gen/typegen/mcp-tools/*` | Uses `.strict()`                                                 | Tool descriptor files                  |

### Transform Pipeline

```text
OpenAPI Schema (upstream)
       ↓
api-schema-original.json (fetched, unmodified)
       ↓
api-schema-sdk.json (decorated: canonicalUrl, 404 responses)
       ↓
openapi-zod-client (generates Zod v3 code)
       ↓
zod-v3-to-v4-transform.ts (converts to Zod v4)
       ↓
curriculumZodSchemas.ts (strict Zod v4 schemas)
```

### Key Files

| File                                                                     | Role                                         |
| ------------------------------------------------------------------------ | -------------------------------------------- |
| `packages/core/openapi-zod-client-adapter/src/generate-zod-schemas.ts`   | Calls openapi-zod-client with strict options |
| `packages/core/openapi-zod-client-adapter/src/endpoint-types.ts`         | Defines `DEFAULT_ENDPOINT_OPTIONS`           |
| `packages/core/openapi-zod-client-adapter/src/zod-v3-to-v4-transform.ts` | v3 → v4 syntax conversion                    |
| `packages/sdks/oak-curriculum-sdk/type-gen/schema-enhancement-404.ts`    | Adds 404 response schemas                    |

## Related Documents

- [ADR-065: Build System](../../docs/architecture/architectural-decisions/065-build-system.md)
- [openapi-zod-client-adapter README](../../packages/core/openapi-zod-client-adapter/README.md)
- [oak-curriculum-sdk README](../../packages/sdks/oak-curriculum-sdk/README.md)
- [Zod v3 → v4 Migration](../../.agent/reference-docs/zod-3-to-4-migration-docs.md)

## Checklist

- [x] Update `schema-enhancement-404.ts` to remove `additionalProperties: true`
- [x] Restore `.passthrough()` → `.loose()` transform (already correct)
- [x] Remove crude `.passthrough()` stripping hack (none existed)
- [x] Update unit tests for schema enhancement
- [x] Update integration tests for response map (schema-separation.unit.test.ts updated)
- [x] Run full quality gate suite (all 11 gates passed)
- [x] Verify no `.strict().loose()` in generated output (0 matches)
- [x] Update `SearchSuggestionContextSchema` to use `.strict()` with explicit fields

## Completion Notes (2025-12-16)

### Changes Made

1. **`schema-enhancement-404.ts`**: Removed `additionalProperties: true` from 404 error schema (data object and root object), changed `zodError` to `type: 'null'`

2. **`generate-search-suggestions.ts`**: Changed `.catchall(z.unknown())` to `.strict()` and added explicit context fields (`unitSlug`, `years`, `keyStages`, `ks4OptionSlug`)

3. **Tests updated**: `schema-enhancement-404.unit.test.ts`, `schema-separation.unit.test.ts`

### Verification Results

| Metric                                              | Result |
| --------------------------------------------------- | ------ |
| `additionalProperties: true` in api-schema-sdk.json | 0      |
| `.catchall(z.unknown())` in generated files         | 0      |
| `.strict().loose()` contradictions                  | 0      |
| `.passthrough()` in generated files                 | 0      |
| Quality gates passed                                | 11/11  |

### Remaining `z.unknown()` (Documented as Legitimate)

See [upstream-api-metadata-wishlist.md](../external/upstream-api-metadata-wishlist.md#legitimate-zunknown-exceptions-registry-2025-12-16):

1. **ES Aggregations**: `z.record(z.string(), z.unknown())` — dynamic structure
2. **LessonAssetResponse**: `z.unknown()` — binary stream, pending upstream fix
