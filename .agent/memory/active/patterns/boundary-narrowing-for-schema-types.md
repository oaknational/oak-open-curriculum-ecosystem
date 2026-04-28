---
name: "Boundary Narrowing for Schema Types"
use_this_when: "a schema type is optional but at a specific call site the value is known to exist, and a non-null assertion or runtime throw is tempting"
category: code
proven_in: "packages/sdks/oak-curriculum-sdk/src/bulk/generators/helpers.ts"
proven_date: 2026-04-01
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "non-null assertions (lint violations) or over-widening schema types to always-required (schema infidelity)"
  stable: true
---

# Boundary Narrowing for Schema Types

## Principle

Schema types must stay faithful to the schema. If the upstream
source defines a field as optional, the generated type must be
optional. But at boundaries where the value is *known* to exist,
express that knowledge via a required typed parameter — moving
validation from runtime throws to compile-time requirements.

## The Anti-Pattern

```typescript
// Anti-pattern 1: non-null assertion (lint violation)
const url = summary.oakUrl!;

// Anti-pattern 2: widening the schema type (infidelity)
interface Summary { oakUrl: string } // was string | undefined
```

## The Pattern

1. Keep the schema type faithful: `oakUrl?: string`
2. Create a narrowing helper that validates and throws descriptively:

```typescript
function requireOakUrl(summary: Summary): string {
  if (summary.oakUrl === undefined) {
    throw new TypeError(
      `Expected oakUrl on summary ${summary.slug}`
    );
  }
  return summary.oakUrl;
}
```

3. At the boundary where the value is consumed, accept a
   required parameter:

```typescript
interface DocumentParams {
  unitUrl: string; // required — caller must narrow
}
```

4. The caller narrows before passing:

```typescript
const url = requireOakUrl(summary);
createDocument({ unitUrl: url });
```

## Why This Works

- Schema types remain faithful to the upstream source
- Non-null assertions are eliminated (lint-clean)
- The narrowing helper provides a descriptive error if the
  invariant ever breaks
- The required parameter makes the compile-time contract
  explicit — callers cannot forget to validate
