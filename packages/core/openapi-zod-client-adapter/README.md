# @oaknational/openapi-zod-client-adapter

Adapter for `openapi-zod-client` that enforces the Zod v3/v4 boundary.

## Purpose

The `openapi-zod-client` library generates Zod v3 schemas from OpenAPI
specifications. The rest of the monorepo uses Zod v4 exclusively. This adapter
bridges the gap: it accepts Zod v3 output from `openapi-zod-client` and
transforms it into Zod v4 compatible code.

## Zod Version Boundary

- **Internals**: the only place in the monorepo where Zod v3 compatible code is
  permitted. That code comes exclusively from `openapi-zod-client` — we must not
  introduce any Zod v3 code elsewhere.
- **Public API**: Zod v4 compatible only. Only Zod v4 compatible code may be
  exported from this workspace.

## Usage

This adapter is consumed by the SDK sdk-codegen pipeline
(`packages/sdks/oak-curriculum-sdk/code-generation/zodgen.ts`) during `pnpm sdk-codegen`.
It is not published to npm.

## Relationship to Castr — lifetime and retirement condition

`@engraph/castr` replaces both `openapi-zod-client` and `openapi3-ts`
([ADR-108](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md);
interface contract in
[ADR-055](../../../docs/architecture/architectural-decisions/055-zod-version-boundaries.md)).
This package therefore carries a **designed retirement condition**: it
retires when Castr output validates side-by-side against the Oak
contract fixtures
([fixture pack](../../../.agent/plans-backlog-2026-07/sector-engagement/castr/README.md)),
per ADR-055's sequencing — the adapter stays in place until that
validation passes, then is removed whole.

Two standing consequences (recorded 2026-08-19, at the ratified
`toolkit-re-architecture` node):

- **Investment freeze**: no internal polish, no finish-bar work — this
  package migrates as-is with the legacy generation cell (this adapter
  plus `openapi-zod-client` and `openapi3-ts`, moved as one bounded
  unit) at the seam migration, and is replaced whole at the Castr
  adoption.
- **The clock is owner-schedulable, not external**: Castr is the
  owner's repository and a Practice repo — focus can move to it if
  adoption becomes urgent, and it could even move into this monorepo
  if that were ever the right call. Adoption is a resource-allocation
  decision, never a wait on a third party.

## Development

```bash
pnpm test        # Run tests
pnpm build       # Build the adapter
pnpm type-check  # Type-check
```
