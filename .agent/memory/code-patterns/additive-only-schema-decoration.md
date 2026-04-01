---
name: Additive-Only Schema Decoration
use_this_when: a decorator or enrichment pass modifies a third-party schema and must not overwrite properties that the upstream source already defines
category: architecture
proven_in: packages/sdks/oak-sdk-codegen/code-generation/schema-separation-decorators.ts
proven_date: 2026-04-01
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: Overwriting upstream schema properties with locally-generated definitions, losing type precision and creating naming collisions
  stable: true
---

# Additive-Only Schema Decoration

## Problem

A code generator or schema pipeline decorates third-party schemas with
additional properties before generating types, validators, or runtime
helpers. The decorator unconditionally adds its properties using a spread
or assignment, replacing any existing properties with the same name.

When the upstream source later introduces a property with the same name
(but richer metadata — stricter type, `format`, description), the
decorator silently overwrites it. The generated output loses the
upstream's type precision. Runtime guards may mask the problem by
preserving upstream values, but the type contract is wrong: consumers
see `string` where the upstream defined `string & format: "uri"`.

The damage compounds when the upstream adds the same property to more
schemas — each one triggers the same silent overwrite.

## Solution

Schema decorators must be **additive-only**: they add properties where
the upstream does not provide them, and they never overwrite
upstream-defined properties.

Before injecting a property, check whether it already exists in the
schema:

```typescript
function decorateWithField(
  schema: SchemaObject & { properties: SchemaProperties },
  fieldName: string,
  fieldDefinition: SchemaObject,
): SchemaObject {
  if (fieldName in schema.properties) {
    return schema;
  }
  schema.properties = { ...schema.properties, [fieldName]: fieldDefinition };
  return schema;
}
```

When the upstream provides the property, trust it. The upstream is the
source of truth — its `format`, `description`, `enum`, and `required`
constraints are authoritative.

When the upstream does not provide the property, the decorator fills the
gap with the best definition it can generate. Include `format` and other
metadata to match the precision the upstream would have used.

## When this applies

- Schema decoration pipelines that enrich third-party API schemas
- OpenAPI schema post-processing before code generation
- Any enrichment pass that adds computed or derived fields to external
  data contracts
- Middleware that injects fields into API responses before validation

## When this does not apply

- Internal schemas where the decorator owns the canonical definition
- Schemas where the upstream has explicitly delegated ownership of the
  field to the consumer
- Migration passes that intentionally replace deprecated upstream
  definitions (document the override explicitly)

## Anti-pattern it replaces

Unconditional property injection via spread:

```typescript
const nextProps = { ...schema.properties, myField: myDefinition };
```

This silently overwrites `myField` if the upstream already defines it,
losing `format`, `description`, `enum`, and any other metadata the
upstream attached. The overwrite is invisible — no error, no warning,
no type-check failure. The downstream type is widened (e.g. `z.url()`
becomes `z.string()`), and consumers lose compile-time and runtime
validation guarantees.
