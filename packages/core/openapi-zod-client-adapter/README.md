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

## Relationship to Castr

[Castr](../../../.agent/plans/sector-engagement/castr/README.md) is planned to replace both
`openapi-zod-client` and `openapi3-ts` in a future release
([ADR-108](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md)).
When Castr is integrated, this adapter will be validated side-by-side and then
removed.

## Development

```bash
pnpm test        # Run tests
pnpm build       # Build the adapter
pnpm type-check  # Type-check
```
