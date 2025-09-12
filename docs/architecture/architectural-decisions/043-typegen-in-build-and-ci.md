# ADR-043: Type Generation in Build and CI

Status: Accepted
Date: 2025-09-12

## Context

We generate SDK types and MCP tool code from the live OpenAPI schema. We want:

- Fast feedback locally when the schema changes (regenerate on local builds).
- Deterministic CI/Preview builds using committed generated artifacts (no regeneration in CI).

Recent CI failures were caused by cleaning generated files and re-running type-gen in CI, which removed required files before dependents built.

## Decision

- Local `pnpm build` may invoke type generation implicitly via task graph, so developers get up-to-date code.
- CI `pnpm build --only` MUST NOT run type generation; it validates that the repo (including committed generated files) builds.
- Generated artifacts remain in version control and are the source of truth for CI/preview builds.

## Implementation

- Turbo task graph: `build` depends on `^type-gen` (ancestors), ensuring upstream packages that need generation do it first. We do not require the current package’s own `type-gen` in CI.
- SDK package scripts: remove `prebuild` that invoked type generation automatically to prevent regeneration in CI.
- Typegen script: Vercel treated as online; CI (non‑Vercel) uses cached schema only.
- Type-only exports from SDK use `export type { ... }` without `.js` extensions to avoid runtime module resolution.

## Consequences

- Local builds stay fresh with schema changes due to the `type-gen` task in the graph.
- CI builds are deterministic and won’t delete or regenerate types.
- Developers must commit generated changes after running type-gen locally.

## Alternatives Considered

- Always regenerate in CI: rejected due to non-determinism and external dependency flakiness.
- Never regenerate locally: rejected; slows developer feedback.

## Follow-ups

- Document policy in CI docs.
- Monitor for regressions if task graph changes.
