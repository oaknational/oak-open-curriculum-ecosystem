---
name: "Generator-First for Vendored Static Data"
polarity: pattern
use_this_when: "A vendored/static JSON asset needs validation or narrowing (widened literals, closed unions) and the reflex fix is a runtime guard, a module-init throw, or Result-threading at the import boundary."
category: code
layer: family
proven_in: "curriculum-hub-demo: quality-standards module-init throw (2 no-throw warnings) dissolved by mirroring the existing generate-course generator (2026-07-01, Cinder); the 2026-07-02 content-is-data redesign (Peregrine) then moved both giant generated TS modules to zod-schema SSOT + JSON emission, proving the schema-validates-at-both-belts variant."
proven_date: 2026-07-02
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Result-at-runtime on a vendored static asset ripples to every consumer and has no meaningful error consumer at module-init — a drifted vendored asset must fail the BUILD, not be runtime-recovered (you would unwrap-or-throw anyway, or silently drop rows)."
  stable: true
---

# Generator-First for Vendored Static Data

> **POLARITY: PATTERN.** The type system (or a schema at generate time)
> enforces what the runtime throw was faking.

## The shape

1. A `scripts/generate-*.ts` generator validates the vendored asset's
   closed sets at GENERATE time — fail-loud `throw` is correct there
   (eslint-zoned `scripts/**`; the consumer is the build, and the build
   must die on bad data; see `principled-eslint-zoning`).
2. The generator emits either:
   - a typed-literal TS module whose `: readonly T[]` annotation IS the
     compile-time gate (see
     `validate-sampled-schema-against-complete-corpus`), or
   - **JSON plus a zod schema as SSOT** validating at BOTH belts —
     generator pre-write AND loader module-init (`strictObject` replaces
     excess-property checking; zod v4 `safeParse(data, { reportInput:
     true })` puts the received value in every issue). This variant
     dissolves multi-thousand-line generated TS modules; normalisation
     and policy refinements move INTO the schema, deleting hand-rolled
     `Object.keys/entries` walks.
3. The runtime module becomes pure typed data — no throw, no Result,
   zero consumer ripple.
4. Emission is prettier-programmatic (workspace devDep, `resolveConfig` and
   `format` in the generator shell) so `--check` is a byte comparison
   and format gates stay green after any regeneration — "run prettier
   after generating" as a manual step is a stale-tree trap.

## The boundary

`strict-validation-at-boundary` targets untrusted RUNTIME input (API
responses, user input). A controlled static asset you decoded and
profiled is validated at generate/compile time; a runtime guard there is
over-engineering that trips no-assertions / complexity lint for no
safety gain.
