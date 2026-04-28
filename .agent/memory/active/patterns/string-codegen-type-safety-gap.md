---
name: "String-Based Codegen Type-Safety Gap"
use_this_when: "A code generator emits code as string templates rather than AST nodes, and the output includes API calls with specific argument names or shapes"
category: code
proven_in: "packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/build-zod-type.ts — .meta({ examples }) emitted as string literal"
proven_date: 2026-04-05
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Semantic errors in string-based codegen (typos in property names, wrong argument shapes) compile successfully but silently produce incorrect output"
  stable: true
---

# String-Based Codegen Type-Safety Gap

## Problem

A code generator builds output by concatenating strings (template
literals, string builders). The generated code compiles and type-checks
when consumed — but the *generator itself* cannot catch semantic errors
in the templates. A typo like `.meta({ example: [...] })` instead of
`.meta({ examples: [...] })` produces valid TypeScript that silently
drops data.

## Pattern

For every semantic property emitted by string-based codegen, add a
**round-trip test** that:

1. Imports the generated output.
2. Exercises the runtime behaviour the codegen intended.
3. Asserts the expected effect in the final output.

```typescript
// The codegen emits .meta({ examples: [...] }) as a string.
// This test proves the string was correct by exercising the
// full Zod 4 globalRegistry path.
it('z.toJSONSchema() produces examples', () => {
  const schema = z.toJSONSchema(generatedSchema);
  expect(schema).toHaveProperty('properties.field.examples', ['value']);
});
```

## Anti-Pattern

Asserting the generated *string* contains `.meta(` — this proves the
template emitted text, not that the text produces the intended effect.
String matching cannot catch misspelled property names, wrong nesting,
or missing arguments.

## When This Applies

- OpenAPI → Zod/TypeScript code generators
- Schema-driven code generators that emit validation logic
- Any string-template-based codegen where the output calls
  library functions with specific argument shapes
