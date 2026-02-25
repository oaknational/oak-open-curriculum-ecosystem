# CI Policy

This document clarifies what runs in GitHub CI and why.

## Type Generation (OpenAPI → SDK)

- CI does NOT regenerate types. CI validates that the repo builds using the committed generated artifacts.
- Local builds may run type generation via the Turbo task graph for fast feedback.
- If the OpenAPI schema changes, run `pnpm sdk-codegen` locally and commit the changes.

See ADR-043 (`docs/architecture/architectural-decisions/043-codegen-in-build-and-ci.md`).

## Build

- Local: `pnpm build` may trigger `sdk-codegen` through the graph.
- CI: `pnpm build --only` is used to avoid regenerating types and to ensure the committed artifacts are valid.

## Tests

- Unit, integration, and e2e tests run in CI. External APIs are used only where tests explicitly opt in.

## Linting and Formatting

- ESLint and Prettier run to enforce code style and correctness.

## Docs

- API docs generation is run only where needed. In CI we avoid network-dependent regeneration steps.
