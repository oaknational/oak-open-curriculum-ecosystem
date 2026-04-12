---
name: "Omit unknown-carrying fields from library types"
use_this_when: "Extending a library type that carries Record<string, unknown> or any on one or more fields, while the rest of the type is valuable."
category: code
proven_in: "packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/generate-tool-descriptor-file.ts"
proven_date: 2026-04-11
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Three sessions tried interface→type alias change to fix TS2430; the real fix was removing the unknown-carrying field."
  stable: true
---

# Omit Unknown-Carrying Fields from Library Types

## Problem

A library type is mostly well-typed, but one or two fields use
`Record<string, unknown>` or similar erasure. Extending the type directly
inherits `unknown` into your type system, causing TS2430 or forcing your
types to accept `unknown` — violating strict typing principles.

Changing `interface` to `type` alias can work around the index-signature
mismatch but treats the symptom. Linters may also revert it.

## Pattern

Use `Omit<LibType, 'problematicField'>` to inherit all fields except the
one carrying `unknown`. Re-declare that field with your own strict type:

```typescript
interface MyDescriptor extends Omit<Tool, '_meta'> {
  readonly _meta?: MyStrictMeta;
}
```

At the SDK boundary where the library expects the original shape, spread
into a fresh object literal so TypeScript can verify the index signature:

```typescript
sdk.register(name, { ...config, _meta: tool._meta ? { ...tool._meta } : undefined });
```

## Why It Works

- Keeps the library type relationship — if the library adds fields, you
  inherit them automatically.
- Surgically removes only the field that carries `unknown`.
- The boundary spread creates a new object literal that satisfies
  `Record<string, unknown>` at the one place it matters.

## Anti-Patterns

- **`interface → type` alias**: Treats the index-signature symptom; may
  be reverted by linters enforcing `consistent-type-definitions`.
- **`extends Tool` with `unknown` in your field**: Lets `unknown` leak
  through your entire type graph.
- **Manual re-declaration of all fields**: Loses the library type
  relationship; breaks when the library adds new fields.
