# ADR-041: Workspace Structure Option A Adopted

Status: Accepted
Date: 2025-09-08

## Context

We compared multiple workspace layouts to improve clarity, onboarding, and long-term maintenance. Options included: conventional apps+packages, domain buckets, and a flat packages-only layout.

## Decision

Adopt Option A (conventional) with clear directories:

- `apps/` – runnable MCP servers
- `packages/libs/` – lib contracts/utilities (logger, storage, transport, env)
- `packages/libs/` – reusable libraries
- `packages/providers/` – platform providers (e.g., Node, Workers)
- `packages/sdks/` – client SDKs (future growth)

Rules & relationships:

- Inter‑workspace imports use `@oaknational/*` package specifiers only.
- Intra‑package relative imports allowed; avoid private/internal subpaths.
- Dependency flow: core → libs → apps/SDKs; core never imports providers.

## Rationale

- Highest familiarity and discoverability; minimal churn from current state.
- Scales cleanly for more SDKs and providers.

## Consequences

- Update architecture README and onboarding to reflect Option A.
- Consider moving SDKs under `packages/sdks/` in a later tidy-up; not required now.

## Links

- Plan: `.agent/plans/architectural-refinements-plan.md`
- Options analysis: `.agent/plans/workspace-structure-options.md`
- Provider system: `docs/architecture/provider-system.md`
