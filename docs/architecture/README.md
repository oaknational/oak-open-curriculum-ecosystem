# Architecture

## Start Here

1. **→ OpenAPI Pipeline Architecture** ([openapi-pipeline.md](./openapi-pipeline.md)) - **Read this first** to understand the core pattern
2. **→ Current Architecture Overview (this page)** - Standard structure and boundaries
3. **→ Historical Context: Greek Ecosystem Deprecation** ([deprecation doc](./greek-ecosystem-deprecation.md))

Architectural Decision Records (ADRs) define how the system should work and are the architectural source of truth.
Start with the [ADR index](./architectural-decisions/), then read a lightweight foundational set:

- [ADR-029](./architectural-decisions/029-no-manual-api-data.md) - No manual API data structures
- [ADR-030](./architectural-decisions/030-sdk-single-source-truth.md) - SDK as single source of truth
- [ADR-031](./architectural-decisions/031-generation-time-extraction.md) - Generation-time extraction
- [ADR-107](./architectural-decisions/107-deterministic-sdk-nl-in-mcp-boundary.md) - Deterministic SDK and NL boundary

## Reference Documentation

### Core Architecture (Current)

- Standard structure:
  - `apps/` – application runtimes (MCP servers, search CLI)
  - `packages/sdks/` – SDK packages (`@oaknational/curriculum-sdk`, `@oaknational/oak-search-sdk`)
  - `packages/core/` – foundational shared code (result/env/eslint/openapi adapter)
  - `packages/libs/` – shared runtime libraries (logger)
- Boundaries enforced by custom ESLint rules in `packages/core/oak-eslint`
- Provider injection replaces runtime auto‑detection
- Apps compose a `CoreRuntime` and inject dependencies (DI) into servers and tools
- A universal MCP translation layer (generated in the SDK) normalises tool inputs/outputs so every transport (`/mcp`, stdio) shares the same schema-derived contract
- **Key implementation detail**: All MCP tools are generated at compile time from the OpenAPI schema - see [Programmatic Tool Generation](./programmatic-tool-generation.md) and [OpenAPI Pipeline](./openapi-pipeline.md)
- Provider system overview: see [Provider System](./provider-system.md)
- Onboarding guide: see [Onboarding](../development/onboarding.md)

#### Rules & Relationships

- Inter‑workspace imports use `@oaknational/*` package specifiers only.
- Intra‑package relative imports are allowed; avoid private/internal subpaths.
- Dependencies flow: `core` depends on nothing; `libs` depend on `core`; `sdks` depend on `core`/`libs`/other `sdks` (no circular dependencies); `apps` depend on `sdks`/`libs`/`core`.

### Implementation Guides

- [Programmatic Tool Generation](./programmatic-tool-generation.md) - MCP tool generation from SDK (compile‑time)

### Architectural Decisions

- [ADR-029: No Manual API Data Structures](./architectural-decisions/029-no-manual-api-data.md)
- [ADR-030: SDK as Single Source of Truth](./architectural-decisions/030-sdk-single-source-truth.md)
- [ADR-031: Generation-Time Extraction](./architectural-decisions/031-generation-time-extraction.md)
- [ADR-040: Transition to Neutral Architecture and Allowlist Identity Check](./architectural-decisions/040-neutral-architecture-and-identity-allowlist.md)
- [ADR-041: Workspace Structure Option A Adopted](./architectural-decisions/041-workspace-structure-option-a.md)
- [All ADRs](./architectural-decisions/) - Complete decision record (historical ADRs preserved)

## Related Agent Guidance

- [Development Practice](../agent-guidance/development-practice.md)
- [Testing Strategy](../../.agent/directives/testing-strategy.md)
- [TypeScript Practice](../agent-guidance/typescript-practice.md)

## Implementation Plans

- [Architectural Refinements Plan (completed)](../../.agent/plans/archive/completed/architectural-refinements-plan.md)
- [Workspace Structure Options (completed analysis)](../../.agent/plans/archive/completed/workspace-structure-options.md)
- [Serverless Hosting Plan (deferred)](../../.agent/plans/icebox/serverless-hosting-plan.md)
- [OpenAI Connector Alias Removal](./openai-connector-deprecation.md)
