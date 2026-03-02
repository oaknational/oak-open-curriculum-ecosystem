---
name: Unknown Until Validated
use_this_when: a function produces data whose type cannot be statically verified and a validation boundary exists downstream
category: validation
proven_in: packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/emit-index.ts
proven_date: 2026-02-27
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: Casting unvalidated data to an expected type before validation runs
  stable: true
---

# Unknown Until Validated

## Problem

A function fetches or produces data whose type depends on a runtime decision (dynamic dispatch, external API response, runtime schema selection). The function claims to return a specific type, but the actual data has not been validated yet. An `as` cast bridges the gap.

```typescript
invoke: async (client, args) => {
  const response = await call(args);
  const payload = response.data;
  return payload as z.infer<typeof descriptorForStatus.zod>;
},
```

The consumer then validates the same data:

```typescript
const output = await descriptor.invoke(client, args);
const validation = descriptor.validateOutput(output);
```

The `as` cast is a lie -- the data is unvalidated at the point of return. If the response shape differs from expectations, the cast silently passes bad data through.

## Solution

Return `unknown` from the producer. Let the validation boundary be the single point where the type narrows.

```typescript
invoke: async (client, args) => {
  const response = await call(args);
  const payload = response.data;
  return payload;
},
```

The contract reflects the truth:

```typescript
readonly invoke: (client: TClient, args: TArgs) => unknown | Promise<unknown>;
```

The validation function already accepts `unknown` and returns the narrowed type:

```typescript
readonly validateOutput: (value: unknown) =>
  | { readonly ok: true; readonly data: TResult; readonly status: TStatus }
  | { readonly ok: false; readonly message: string; /* ... */ };
```

## When this applies

- A function produces data from an external source (API, database, file system)
- The type of the data depends on a runtime decision (status code, dynamic dispatch)
- A validation boundary (Zod `safeParse`, type guard, decoder) exists downstream
- The producer uses `as` to claim a type it cannot verify

## When this does not apply

- The producer can statically guarantee the return type (pure computation, known inputs)
- No validation boundary exists downstream (the `as` cast is the only type narrowing)
- The data genuinely is the claimed type (e.g. constructed by the same function)

## Anti-pattern it replaces

`return data as ExpectedType` followed by validation of the same data.
