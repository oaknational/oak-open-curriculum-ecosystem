---
id: oce-core-value-reconstruction
node_type: delivery
name: "Reconstruct honest object-key and entry access"
overview: "Replace the first unsound core value contract with a complete honest capability and migrate its actual consumers without losing reusable material."
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: reliable-atoms-programme
impact_areas:
  - practice-and-estate
  - innovation-kit
tickets: []
depends_on:
  - plan: oce-cf-assurance-binding
    kind: beneficial
  - plan: oce-reusable-core-contracts
    kind: beneficial
owner_gates: []
last_updated: 2026-10-10
---

# Reconstruct honest object-key and entry access

## Goal

The current `type-helpers` object-key/entry responsibility has a complete honest
contract and maintained replacement, with affected consumers migrated and false
narrowing retired. This is the first core reconstruction increment alongside the
preferred geometry-first construction; it does not wait for the entire heap.

## User groups and value

Capability and generator authors receive trustworthy runtime/static value
relationships. Instance builders benefit through correct published dependencies;
they neither implement introspection nor patch its type assertions.

## Mechanism

Use the [CF reconstruction](../../../docs/architecture/foundations/oce-cf-reconstruction.md)
and [architecture](../../../docs/architecture/oce-architecture.md). Enumerate actual
imports and emitted compatibility exports. A runtime own-key test cannot infer
`keyof T` for an open structural value. Prefer an honest wider output for arbitrary
objects, and a separately admitted finite key-space view where correlated key/value
outputs are required. Bind own versus inherited keys, enumerable/string/symbol
coverage, numeric-key stringification, mutation/getter/proxy assumptions and error
behaviour before choosing the public surface. Do not generalise beyond the complete
supported contract or copy Result to claim Primitive independence.

Construct the selected capability, preserve full assurance and consumed-form
obligations, and migrate actual consumers with independent negative examples.
One replacement authority owns each responsibility; any adapter has a declared
old contract and retirement condition. Useful source, rationale and fixtures stay
in OCE and history. Package placement follows ownership and closure.

## Acceptance criteria

- **AC1 — repo-safe:** an extra runtime property on a structurally narrower value
  cannot create false type narrowing; numeric, symbol, inherited and repeated
  entry cases have independently expected outcomes under the supported profile.
- **AC2 — repo-safe:** contract/grade/dependency/exposure and production-correspondence
  evidence covers the complete replacement responsibility. Unsupported object
  behaviour is explicitly excluded or rejected, not silently treated as proven.
- **AC3 — repo-safe:** affected runtime, generated and emitted-type consumers use
  the supported public seam; native/packed consumer evidence passes. Old unsound
  exports and fallback execution are retired only after consumer accounting.

## Todos

1. Bind the complete first object-value contract and public exposure from actual
   consumers; return any semantic decision to the CF owner.
2. Construct and assure the bounded capability with independent source/type misuse
   examples and declared object-effect assumptions.
3. Migrate and prove the affected consumption closure, then retire obsolete forms.

Each construction PR is a bounded story under the default two-review-round rule.
No team timing or workload study is part of acceptance.

## Out of scope

No mass core rename, all-ten-package cutover, universal object schema system or
app publication. Other core responsibilities retain the explicit native receiving
allocations in the [programme route](../../reports/repo-architecture/oce-rearchitecting/README.md);
they are not silently dropped when this first value unit completes.
