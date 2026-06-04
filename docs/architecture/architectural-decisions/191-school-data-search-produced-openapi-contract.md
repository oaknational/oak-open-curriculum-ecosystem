# ADR-191: School Data Search Produced OpenAPI Contract

**Status**: Accepted
**Date**: 2026-06-04
**Related**:
[ADR-003](003-zod-for-validation.md) (Zod for runtime validation),
[ADR-026](026-openapi-code-generation-strategy.md) (OpenAPI code generation),
[ADR-029](029-no-manual-api-data.md) (upstream-consumed OpenAPI cardinal rule),
[ADR-030](030-sdk-single-source-truth.md) (SDK single source of truth),
[ADR-031](031-generation-time-extraction.md) (generation-time extraction),
[ADR-041](041-workspace-structure-option-a.md) (workspace tier),
[ADR-055](055-zod-version-boundaries.md) (Zod version boundaries), and the
[school-data-search active plan](../../../.agent/plans/school-data-search/active/school-data-search-poc.plan.md).

## Context

The school-data-search POC is a new service that **produces** an API contract.
Most existing OpenAPI doctrine in this repository governs a different shape: Oak
consumes an upstream OpenAPI document, generates SDK surfaces from it, and then
keeps downstream code from hand-authoring API facts.

The owner requirement for this POC is stricter than a convenient internal API:
all API routes must expose a comprehensive, strict OpenAPI 3.x specification.
The service is built in this repository until the POC go/no-go decision, and the
client remains unpublished unless the owner explicitly widens scope.

Gate G-1 selected option F-B: code-first contract canon. Zod 4 schemas are the
single authored source, OpenAPI 3.x is generated from those schemas, and the
client is generated from the emitted OpenAPI document. This is not an inversion
of ADR-029's Cardinal Rule because ADR-029 governs upstream-consumed API data;
this ADR governs a new service producing its own spec.

## Decision

School-data-search contracts use **Zod 4 as the canonical authored source** in
`@oaknational/school-data-search-contracts`.

The contracts workspace generates the OpenAPI document from that source using
`@asteasolutions/zod-to-openapi`. The generated document must be OpenAPI 3.x and
must be validated in CI before any API/client surface is treated as complete.

Generated state outranks hand-authored state:

1. API route validation imports or derives from the contracts workspace.
2. The OpenAPI document is generated from the contracts workspace.
3. The typed client is generated from the emitted OpenAPI document.
4. The client returns explicit `Result<T, E>` boundary shapes rather than
   throwing across the public client boundary.

The first client generator proof happens in WS1. `@hey-api/openapi-ts` is the
preferred first candidate because it targets modern TypeScript fetch clients;
`orval` is the recorded fallback if the proof shows a blocking fit issue. The
choice is a compatibility proof inside the generated-client workstream, not a
licence to hand-author client types.

## Rationale

- Zod is already the repository's runtime validation idiom and is the owner-
  ratified source for this service.
- One authored schema source prevents drift between runtime validation, OpenAPI,
  TypeScript types, and client code.
- Producing the OpenAPI document from code keeps the POC small while still
  satisfying the owner's strict OpenAPI requirement.
- A generated client preserves the same shape discipline as the existing SDK
  pipeline: consumers depend on generated public surfaces, not copied API facts.

## Consequences

- The contracts package must stay DB-free and app-free; it cannot import
  `drizzle-orm`, Next.js runtime code, or the API app.
- A route is incomplete until its Zod schema, generated OpenAPI operation, and
  focused validation proof agree.
- The generated client package remains private/unpublished for the POC. Any npm
  publish requires explicit owner direction and a new lifecycle decision.
- If a production-ready neutral schema-definition-to-Zod toolchain appears, the
  owner may revisit F-B. The current TypeSpec-to-Zod path is recorded as a
  revisit trigger only; it is not production-ready for this POC decision.

## Validation

1. `@oaknational/school-data-search-contracts` exposes a Zod canonical school
   schema and a function that emits an OpenAPI 3.x document from it.
2. Unit tests prove the schema accepts the current canonical minimum shape and
   that the emitted document is OpenAPI 3.x with registered schema components.
3. Boundary enforcement prevents contracts from importing runtime app, DB, SDK,
   or client code.
4. Later WS1 client-generation tests prove the selected generator consumes the
   emitted document without hand-authored duplicate client types.
