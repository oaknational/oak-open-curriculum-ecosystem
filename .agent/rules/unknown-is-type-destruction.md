# Unknown Is Type Destruction

Operationalises [ADR-034 (System Boundaries and Type Assertions)](../../docs/architecture/architectural-decisions/034-system-boundaries-and-type-assertions.md)
and [ADR-038 (Compilation Time Revolution)](../../docs/architecture/architectural-decisions/038-compilation-time-revolution.md).

`unknown`, `z.unknown()`, and `Record<string, unknown>` erase
structural type information. They are forbidden except at named
boundaries.

## Permitted

- Function parameter at an incoming external boundary from a
  third-party system (data genuinely has no known shape yet).
- `z.unknown()` only when the upstream schema genuinely declares
  no structure (e.g. polymorphic aggregation buckets from
  Elasticsearch).

## Forbidden

- Replacing a concrete type with `unknown` to avoid a type error.
- Using `z.unknown()` where a concrete Zod schema exists or can
  be generated.
- Using `z.record(z.string(), z.unknown())` as a stand-in for a
  known object shape.
- Hand-crafting a Zod schema that approximates a generated shape.

## The preservation test

If the type information exists anywhere in the pipeline — the
OpenAPI spec, the generated types, a library's exported types —
it MUST be preserved. The test runs on the proposed change: can
the type be sourced from the schema or library? If yes, sourcing
it is mandatory; using `unknown` in its place is forbidden.

The narrowing operators `as const` and `satisfies SomeType`
operate at compile time without widening; they tighten types
rather than disable them, and so are off-topic for this rule
(they are not type destruction).

When using external libraries, prefer official library types and
error classes over local `*Like` shapes.
