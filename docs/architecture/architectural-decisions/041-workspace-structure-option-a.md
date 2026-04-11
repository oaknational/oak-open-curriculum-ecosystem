# ADR-041: Workspace Structure Option A Adopted

Status: Accepted (Revised)
Date: 2025-09-08
Updated: 2026-04-02

## Context

We compared multiple workspace layouts to improve clarity, onboarding, and long-term maintenance. Options included: conventional apps+packages, domain buckets, and a flat packages-only layout.

## Decision

Adopt Option A (conventional) with clear directories:

- `apps/` – application runtimes (MCP servers, search CLI)
- `packages/core/` – foundational shared code and provider-neutral primitives
  (result types, ESLint config, env, OpenAPI adapter, observability helpers)
- `packages/libs/` – shared runtime libraries, split into:
  - foundation libs (`env-resolution`, `logger`, `search-contracts`)
  - adapter libs (`sentry-node`, `sentry-mcp`)
- `packages/sdks/` – SDK packages (curriculum-sdk, oak-search-sdk)
- `packages/design/` – design token workspaces producing CSS artefacts
  (design-tokens-core, oak-design-tokens). See ADR-148.

Rules & relationships:

- Inter‑workspace imports use `@oaknational/*` package specifiers only.
- Production source uses those package specifiers; explicit test/config lint
  carve-outs remain allowed where repo-root tooling or fixtures require them.
- Intra‑package relative imports allowed; avoid private/internal subpaths.
- Dependency direction (imports flow upward):

| Importer        | core | foundation libs | adapter libs | sdks                                                                                         | apps | Constraint                                                                                                                          |
| --------------- | ---- | --------------- | ------------ | -------------------------------------------------------------------------------------------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------- |
| core            | —    | no              | no           | no                                                                                           | no   | No monorepo dependencies outside `core`; external deps must stay minimal and provider-neutral                                       |
| foundation libs | yes  | —               | no           | approved generated subpath exports only (`search-contracts` -> `@oaknational/sdk-codegen/*`) | no   | No lib-to-lib back-edges; `search-contracts` is the documented generated-contract exception                                         |
| adapter libs    | yes  | yes             | no           | no                                                                                           | no   | No adapter-to-adapter imports                                                                                                       |
| sdks            | yes  | yes             | yes          | directed only                                                                                | no   | No circular SDK-to-SDK dependencies; ADR-108 requires approved package-surface imports rather than direct runtime/search back-edges |
| design          | yes  | yes             | no           | no                                                                                           | no   | CSS artefact producers; consumed via built CSS, not TS imports                                                                      |
| apps            | yes  | yes             | yes          | yes                                                                                          | —    | —                                                                                                                                   |

## Rationale

- Highest familiarity and discoverability; minimal churn from current state.
- Scales cleanly for more SDKs.
- Keeps provider-neutral observability close to other foundational building
  blocks while preserving a clear distinction between reusable foundation libs
  and runtime adapters.
- Cross-SDK coupling remains legitimate where the domain truly needs it, but it must be expressed through approved package surfaces rather than ad hoc direct imports. In the current SDK decomposition, runtime and search workspaces consume generated curriculum/search artefacts from `@oaknational/sdk-codegen` per ADR-108 instead of importing `@oaknational/curriculum-sdk` internals directly. Circular dependencies remain forbidden.

## Consequences

- Architecture README and onboarding updated to reflect Option A.
- SDKs moved under `packages/sdks/` as part of the workspace tidy-up.
- `packages/libs/` now has an explicit two-tier model, and
  `@oaknational/observability` lives in `packages/core/observability`.

## Links

- Plan (completed): `.agent/plans/archive/completed/architectural-refinements-plan.md`
- Options analysis (completed): `.agent/plans/archive/completed/workspace-structure-options.md`
- Provider system: `docs/architecture/provider-system.md`
