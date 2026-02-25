# Oak Type Discipline Principles for Castr

This document defines the type discipline principles that castr output must uphold. These are non-negotiable constraints derived from Oak's schema-first architecture.

**Purpose**: Oak's entire runtime behaviour depends on the type system accurately reflecting the API contract. Any deviation risks runtime errors that the type system should have caught at compile time. These principles exist to ensure generated code maintains complete type safety from schema to runtime.

## The Cardinal Rule

> If the upstream OpenAPI schema changes, then running `pnpm sdk-codegen` followed by a `pnpm build` MUST be sufficient to bring all workspaces into alignment with the new schema.

This means:

1. **Complete coverage** - Every schema, every endpoint, every parameter must be generated
2. **No manual intervention** - Generated code must compile and validate without edits
3. **Single source of truth** - The schema IS the type system for runtime data

## Type Discipline

### Zero Type Loss

Type information flows from the schema through to all consumers. Types are NEVER widened.

```typescript
// ❌ WRONG: Type widened from literal to string
const path: string = '/widgets/{id}';

// ✅ CORRECT: Literal type preserved
const path = '/widgets/{id}' as const;
// Type: "/widgets/{id}"
```

```typescript
// ❌ WRONG: Enum widened to string
const keyStage: string = 'ks1';

// ✅ CORRECT: Enum literal preserved
const keyStage: 'ks1' | 'ks2' | 'ks3' | 'ks4' = 'ks1';
```

### No Type Shortcuts

Generated code must not use constructs that disable the type system:

| Forbidden | Why |
|-----------|-----|
| `as any` | Disables all type checking |
| `as unknown` | Forces unnecessary casts |
| `Record<string, unknown>` | Loses all property type information |
| `{ [key: string]: T }` | Same as above |
| `!` (non-null assertion) | Bypasses null checking |
| `// @ts-ignore` | Hides errors |
| `// @ts-expect-error` | Same |

### Single Source of Truth

Types are defined ONCE and derived from the schema.

```typescript
// ❌ WRONG: Duplicate type definition
interface Widget { id: string; name: string; }
const WidgetSchema = z.object({ id: z.string(), name: z.string() });

// ✅ CORRECT: Type inferred from schema
const WidgetSchema = z.object({ id: z.string(), name: z.string() }).strict();
type Widget = z.infer<typeof WidgetSchema>;
```

## Strict Validation

### Object Schemas Reject Unknown Keys

All object schemas MUST use `.strict()` to ensure unknown keys cause validation errors.

```typescript
// ❌ WRONG: Unknown keys silently ignored
const Widget = z.object({ id: z.string() });
Widget.parse({ id: '1', extra: 'ignored' }); // Passes silently

// ❌ WRONG: Unknown keys passed through
const Widget = z.object({ id: z.string() }).passthrough();

// ✅ CORRECT: Unknown keys cause errors
const Widget = z.object({ id: z.string() }).strict();
Widget.parse({ id: '1', extra: 'boom' }); // Throws ZodError
```

### Fail Fast

If something is wrong, fail immediately with a clear error. Never silently continue.

```typescript
// ❌ WRONG: Silent fallback
function getSchema(name: string): z.ZodType {
  return schemas[name] ?? z.unknown();  // Hides missing schema
}

// ✅ CORRECT: Fail fast
function getSchema(name: string): z.ZodType {
  const schema = schemas[name];
  if (!schema) {
    throw new TypeError(`Missing schema: ${name}`);
  }
  return schema;
}
```

## Deterministic Output

Identical input must produce byte-for-byte identical output across runs.

This means:

1. **Sorted output** - Objects and arrays must be ordered deterministically
2. **Stable identifiers** - Schema names, keys, etc. derived from input deterministically
3. **No timestamps** - Unless part of provenance metadata
4. **No random values** - Ever

### Verification

```bash
# Run twice, diff must be empty
castr generate schema.json -o output1/
castr generate schema.json -o output2/
diff -r output1/ output2/
# Expected: no output (files identical)
```

## What Castr Must NOT Do

### Do Not Invent Optionality

If the schema says a field is required, it is required. Period.

```yaml
# OpenAPI
properties:
  name:
    type: string
required:
  - name
```

```typescript
// ❌ WRONG: Made optional "for safety"
z.object({ name: z.string().optional() })

// ✅ CORRECT: Required as specified
z.object({ name: z.string() })
```

### Do Not Provide Fallback Behaviours

If something is missing from the schema, fail. Do not guess.

```typescript
// ❌ WRONG: Guess at missing schema
if (!schema.responses?.['200']) {
  return z.unknown();  // Guessing
}

// ✅ CORRECT: Fail on missing data
if (!schema.responses?.['200']) {
  throw new Error(`Missing 200 response for ${operationId}`);
}
```

### Do Not Widen Types for Convenience

Even if it would be "easier" to work with, do not lose type information.

```typescript
// ❌ WRONG: Widened for easier handling
function getEndpoint(method: string, path: string): Endpoint

// ✅ CORRECT: Literal types preserved
function getEndpoint<M extends Method, P extends Path>(
  method: M,
  path: P
): EndpointFor<M, P>
```

### Do Not Silently Ignore Constructs

If castr encounters an OpenAPI construct it doesn't understand, it must fail with a clear error.

```typescript
// ❌ WRONG: Silently ignore unknown construct
if (schema.discriminator) {
  // TODO: handle discriminator
  return z.unknown();
}

// ✅ CORRECT: Fail fast with clear message
if (schema.discriminator) {
  throw new Error(
    `Unsupported: discriminator at ${pointer}. ` +
    `Castr does not yet support OpenAPI discriminator mappings.`
  );
}
```

## Summary

| Principle | Violation Example | Correct Approach |
|-----------|-------------------|------------------|
| Zero type loss | `path: string` | `path: '/api/v1' as const` |
| No shortcuts | `as any` | Use type guards |
| Single source | Duplicate interfaces | Infer from schema |
| Strict objects | Missing `.strict()` | Always `.strict()` |
| Fail fast | Return `z.unknown()` | Throw with context |
| Deterministic | Random ordering | Sorted by key |
| No invention | Add `.optional()` | Follow schema exactly |
| No widening | `Record<string, T>` | Literal key types |

These principles exist because Oak's entire runtime behaviour depends on the type system accurately reflecting the API contract. Any deviation risks runtime errors that the type system should have caught at compile time.
