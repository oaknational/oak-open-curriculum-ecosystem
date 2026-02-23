# ADR-041: Workspace Structure Option A Adopted

Status: Accepted (Revised)
Date: 2025-09-08
Updated: 2026-02-22

## Context

We compared multiple workspace layouts to improve clarity, onboarding, and long-term maintenance. Options included: conventional apps+packages, domain buckets, and a flat packages-only layout.

## Decision

Adopt Option A (conventional) with clear directories:

- `apps/` – application runtimes (MCP servers, search CLI)
- `packages/core/` – foundational shared code (result types, ESLint config, env, OpenAPI adapter)
- `packages/libs/` – shared runtime libraries (logger)
- `packages/sdks/` – SDK packages (curriculum-sdk, oak-search-sdk)

Rules & relationships:

- Inter‑workspace imports use `@oaknational/*` package specifiers only.
- Intra‑package relative imports allowed; avoid private/internal subpaths.
- Dependency direction (imports flow upward):

| Importer | core | libs | sdks | apps | Constraint                          |
| -------- | ---- | ---- | ---- | ---- | ----------------------------------- |
| core     | —    | no   | no   | no   | Must remain domain-agnostic         |
| libs     | yes  | —    | no   | no   | —                                   |
| sdks     | yes  | yes  | DAG  | no   | No circular SDK-to-SDK dependencies |
| apps     | yes  | yes  | yes  | —    | —                                   |

## Rationale

- Highest familiarity and discoverability; minimal churn from current state.
- Scales cleanly for more SDKs.
- Cross-SDK imports (the "DAG" cell) are legitimate essential domain coupling: `oak-search-sdk` depends on `curriculum-sdk` because semantic search inherently operates on curriculum concepts. Forbidding this would force type duplication or generic types, violating DRY and the no-type-shortcuts rule. Circular dependencies remain forbidden.

## Consequences

- Architecture README and onboarding updated to reflect Option A.
- SDKs moved under `packages/sdks/` as part of the workspace tidy-up.

## Links

- Plan (completed): `.agent/plans/archive/completed/architectural-refinements-plan.md`
- Options analysis (completed): `.agent/plans/archive/completed/workspace-structure-options.md`
- Provider system: `docs/architecture/provider-system.md`
