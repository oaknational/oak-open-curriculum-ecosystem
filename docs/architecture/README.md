# Architecture

## Start Here

1. **→ Current Architecture Overview (this page)**
2. **→ Historical Context: Greek Ecosystem Deprecation](./greek-ecosystem-deprecation.md)**

## Reference Documentation

### Core Architecture (Current)

- Standard structure:
  - `apps/` – applications (MCP servers)
  - `packages/core/` – core interfaces/utilities (`@oaknational/mcp-core`)
  - `packages/libs/` – runtime‑adaptive libraries (`@oaknational/mcp-*`)
  - `packages/sdks/` – public SDKs
- Boundaries enforced by ESLint rules under `eslint-rules/`
- Provider injection replaces runtime auto‑detection

### Implementation Guides

- [Programmatic Tool Generation](./programmatic-tool-generation.md) - MCP tool generation from SDK

### Architectural Decisions

- [ADR-040: Transition to Neutral Architecture and Allowlist Identity Check](./architectural-decisions/040-neutral-architecture-and-identity-allowlist.md)
- [All ADRs](./architectural-decisions/) - Complete decision record (historical ADRs preserved)

## Related Agent Guidance

- [Development Practice](../agent-guidance/development-practice.md)
- [Testing Strategy](../agent-guidance/testing-strategy.md)
- [TypeScript Practice](../agent-guidance/typescript-practice.md)

## Implementation Plans

- [Standardising Architecture – Part 2](../../.agent/plans/standardising-architecture-part2.md)
- [High-Level Plan](../../.agent/plans/standardising-architecture-high-level-plan.md)
