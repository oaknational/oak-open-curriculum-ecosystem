---
name: "Preprocess for Type-Preserving Coercion"
use_this_when: "A Zod schema needs to accept multiple input types but preserve a narrow output type, and z.union with .transform() would widen the output"
category: type-safety
proven_in: "packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/build-zod-type.ts"
proven_date: 2026-03-02
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "z.union with .transform() widens output type to the transform's return type, destroying literal type information"
  stable: true
---

# Preprocess for Type-Preserving Coercion

## The Problem

When a schema must accept multiple input forms (e.g., both `"10"` and `10` for a year field), the natural approach is a Zod union with a transform:

```typescript
z.union([
  z.enum(["1", "2", "3"] as const),
  z.number().int().min(1).max(3).transform(String)
])
```

The output type is `string` — the transform branch returns `string`, which absorbs the literal types from the enum branch. Downstream code that expects the precise enum type (`"1" | "2" | "3"`) gets a type error.

## The Pattern

Use `z.preprocess()` to convert the input **before** validation, so the inner schema's precise output type is preserved:

```typescript
z.preprocess(
  (val) => typeof val === 'number' && Number.isInteger(val)
    && val >= 1 && val <= 3 ? String(val) : val,
  z.enum(["1", "2", "3"] as const)
)
```

Output type: `"1" | "2" | "3"` — the precise enum type, not `string`.

## Why It Works

- `z.preprocess` runs the function first, then validates with the inner schema
- The output type flows from the inner schema, not from the preprocessor
- Invalid inputs (wrong type, out of range) pass through untouched and fail at the inner schema validation — no silent corruption

## Anti-Pattern

```typescript
// WRONG: output type is string, destroying literal information
z.union([z.enum([...] as const), z.number().transform(String)])

// ALSO WRONG: using `as` to narrow back
z.union([...]).transform((v) => v as "1" | "2" | "3")
```

## When to Use

- Input coercion where the output type matters (generated code, typed transforms)
- Schema layers that feed into downstream schemas expecting precise types
- Any `z.union` where one branch uses `.transform()` and the output type is important
