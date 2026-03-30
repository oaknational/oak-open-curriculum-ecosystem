---
name: "JSON loader for large generated datasets"
use_this_when: "A generated dataset exceeds TypeScript's max-lines threshold or literal-type serialisation limits"
category: architecture
proven_in: "packages/sdks/oak-sdk-codegen/src/bulk/generators/write-json-dataset.ts"
proven_date: 2026-03-29
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Monolithic 100k+ line TypeScript data files with eslint-disable max-lines, poor editor performance, and TypeScript TS7056 serialisation limit errors"
  stable: true
---

## Pattern

When a generated dataset is too large for a single TypeScript file
(typically > 5,000 lines), write it as a three-file directory:

```text
dataset-name/
├── data.json    ← JSON.stringify(data, null, 2)
├── types.ts     ← TypeScript interface definitions
└── index.ts     ← Typed loader using createRequire
```

The loader uses `createRequire` to load JSON in ESM and exports a
typed constant. A generic `writeJsonDataset` function handles the
mechanical directory creation and three-file write.

## Anti-pattern

Embedding 100k+ lines of data directly in a `.ts` file:

```typescript
/* eslint-disable max-lines -- generated static data file */
export const hugeGraph: HugeGraph = {
  // ... 100,000 lines of data
};
```

This causes: editor lag, `eslint-disable` violations, TypeScript error
TS7056 for `as const` on large literals, and slow type-checking.

## When to use `as const` instead

Small datasets (< 5,000 lines) benefit from `as const` because it
preserves literal types at zero cost. Use the JSON loader only when
the dataset exceeds the max-lines threshold or hits TS7056.

## Validation boundary

When the JSON contains union-literal fields (e.g., `rel:
'prerequisiteFor'`), the loader must validate those fields at runtime
to narrow from `string` to the literal type. For flat-string-only
shapes, direct type annotation is acceptable.
