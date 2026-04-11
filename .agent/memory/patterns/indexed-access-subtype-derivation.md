---
name: "Indexed-access sub-type derivation from generated unions"
use_this_when: "You need to process elements of a generated union type and the existing code uses hand-rolled local types that approximate the schema"
category: code
proven_in: "apps/oak-search-cli/src/adapters/category-supplementation.ts"
proven_date: 2026-03-21
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Hand-rolled types that silently drift from the generated schema, requiring manual maintenance and hiding schema changes from the compiler"
  stable: true
---

## Pattern

When a generated type is a union (e.g. an array of discriminated variants), derive internal processing types using `Extract` and indexed access rather than hand-rolling local interfaces.

## Anti-pattern

```typescript
// Hand-rolled type that approximates the schema
interface ApiUnit {
  readonly unitSlug?: string;    // optional because two variants merged
  readonly unitTitle: string;
  readonly unitOptions?: readonly { unitSlug: string }[];  // optional for same reason
}

function process(units: readonly ApiUnit[]): void { ... }
```

This merges two discriminated variants into one flat type. The compiler cannot enforce the schema's constraint that a unit has *either* `unitSlug` *or* `unitOptions`, never both. If the schema adds a required field, `ApiUnit` silently drifts.

## Correct approach

```typescript
// Derive from the generated type
type YearEntryWithUnits = Extract<GeneratedResponse[number], { units: unknown }>;
type Unit = YearEntryWithUnits['units'][number];
// Unit is a discriminated union — the schema's constraint is preserved

function process(units: readonly Unit[]): void {
  for (const unit of units) {
    if ('unitSlug' in unit) {
      // TypeScript narrows to the unitSlug variant
    }
    if ('unitOptions' in unit) {
      // TypeScript narrows to the unitOptions variant
    }
  }
}
```

## Why it works

- `Extract<Union, Shape>` selects the union member(s) matching a structural constraint
- Indexed access (`Type['prop']`) preserves the exact schema-derived type
- `'prop' in obj` narrows discriminated unions (unlike truthiness checks)
- Schema changes propagate automatically through the chain via `pnpm sdk-codegen`
