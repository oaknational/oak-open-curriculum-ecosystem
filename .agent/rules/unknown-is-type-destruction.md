# Unknown Is Type Destruction

`unknown`, `z.unknown()`, and `Record<string, unknown>` are all forms of
type destruction. They erase structural type information that was known at
some point in the pipeline.

## Permitted

- Function parameter at an incoming external boundary from a third-party
  system (data genuinely has no known shape yet)
- `z.unknown()` only when the upstream schema genuinely declares no
  structure (e.g. polymorphic aggregation buckets from Elasticsearch)

## Forbidden

- Replacing a concrete type with `unknown` to avoid a type error
- Using `z.unknown()` where a concrete Zod schema exists or can be
  generated from the OpenAPI spec
- Using `z.record(z.string(), z.unknown())` as a stand-in for a known
  object shape
- Hand-crafting a Zod schema that approximates a generated shape — import
  from `sdk-codegen` instead

## The Test

If the type information exists anywhere in the pipeline — the OpenAPI spec,
the generated types, a library's exported types — it MUST be preserved.
Erasing it is a bug, not a simplification.

See `.agent/directives/principles.md` §Cardinal Rule, ADR-038, and
`.agent/rules/no-type-shortcuts.md`.
