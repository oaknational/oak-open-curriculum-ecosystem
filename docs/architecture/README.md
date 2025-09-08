# Architecture

## Start Here

1. **→ Current Architecture Overview (this page)**
2. **→ Historical Context: Greek Ecosystem Deprecation** ([deprecation doc](./greek-ecosystem-deprecation.md))

## Reference Documentation

### Core Architecture (Current)

- Standard structure (Option A):
  - `apps/` – applications (MCP servers)
  - `packages/core/` – core interfaces/utilities (`@oaknational/mcp-core`)
  - `packages/libs/` – reusable libraries (`@oaknational/mcp-*`)
  - `packages/providers/` – platform providers (e.g., Node, Workers)
  - `packages/sdks/` – public SDKs (future growth)
- Boundaries enforced by ESLint rules under `eslint-rules/`
- Provider injection replaces runtime auto‑detection

#### Rules & Relationships

- Inter‑workspace imports use `@oaknational/*` package specifiers only.
- Intra‑package relative imports are allowed; avoid private/internal subpaths.
- Dependencies flow: core depends on nothing; libs depend on core; apps depend on libs/core/providers; SDKs depend on libs/core.

### Implementation Guides

- [Programmatic Tool Generation](./programmatic-tool-generation.md) - MCP tool generation from SDK

### Architectural Decisions

- [ADR-040: Transition to Neutral Architecture and Allowlist Identity Check](./architectural-decisions/040-neutral-architecture-and-identity-allowlist.md)
- [ADR-041: Workspace Structure Option A Adopted](./architectural-decisions/041-workspace-structure-option-a.md)
- [All ADRs](./architectural-decisions/) - Complete decision record (historical ADRs preserved)

## Related Agent Guidance

- [Development Practice](../agent-guidance/development-practice.md)
- [Testing Strategy](../agent-guidance/testing-strategy.md)
- [TypeScript Practice](../agent-guidance/typescript-practice.md)

## Implementation Plans

- [Architectural Refinements Plan](../../.agent/plans/architectural-refinements-plan.md)
- [Workspace Structure Options (analysis)](../../.agent/plans/workspace-structure-options.md)
- [Serverless Hosting Plan (deferred)](../../.agent/plans/serverless-hosting-plan.md)
