---
boundary: B2-Architecture
doc_role: index
authority: architecture-navigation
status: active
last_reviewed: 2026-11-13
---

# Architecture

**Last Updated**: 2026-11-13
**Status**: Active architectural index

## Start Here

The architecture exists to turn Oak's openly licenced, fully sequenced and
resourced curriculum into reusable primitives: generated SDKs, MCP and MCP App
surfaces, hybrid semantic search, knowledge graph integration, and the
OpenAPI-to-MCP pipeline that lets those pieces be reused inside and beyond Oak.

The proposed rearchitecting direction has its own pages:
[ADR-233](architectural-decisions/233-retained-framework-and-configurable-instances.md),
[OCE architecture and open invariants](oce-architecture.md),
[CF reconstruction](foundations/oce-cf-reconstruction.md),
[instance contracts](oce-configuration-contracts.md) and
[integrity and Castr](oce-integrity-and-castr.md). This page describes the implemented
structure.

1. **→ OpenAPI Pipeline Architecture** ([openapi-pipeline.md](./openapi-pipeline.md)) — **read this first** to understand the core pattern.
2. **→ Current Architecture Overview** (this page) — standard structure and boundaries.
3. **→ [ADR index](./architectural-decisions/)** — the architectural source of truth; start from the ADRs listed below.

The foundational ADRs that shape the entire codebase — the canonical
[Start Here: 5 ADRs in 15 Minutes](./architectural-decisions/README.md#start-here-5-adrs-in-15-minutes)
block in the ADR index:

- [ADR-029](./architectural-decisions/029-no-manual-api-data.md) — No manual API data structures
- [ADR-030](./architectural-decisions/030-sdk-single-source-truth.md) — SDK as single source of truth
- [ADR-031](./architectural-decisions/031-generation-time-extraction.md) — Generation-time extraction
- [ADR-048](./architectural-decisions/048-shared-parse-schema-helper.md) — Shared parsing helper pattern
- [ADR-107](./architectural-decisions/107-deterministic-sdk-nl-in-mcp-boundary.md) — Deterministic SDK and NL boundary

## Workspace Summaries

**Apps:**

| Workspace                                                                              | Purpose                                                                                                                                                                                      |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`oak-curriculum-mcp-streamable-http`](../../apps/oak-curriculum-mcp-streamable-http/) | Canonical MCP server — Streamable HTTP transport, Vercel deployment, the full curriculum tool set (the workspace README is the authoritative inventory), resources, and MCP App widget       |
| [`oak-search-cli`](../../apps/oak-search-cli/)                                         | Search CLI — admin operations, bulk ingestion, blue/green index lifecycle ([ADR-130](./architectural-decisions/130-blue-green-index-swapping.md)), evaluation, and ground-truth benchmarking |

**SDKs:**

| Workspace                                                       | Purpose                                                                                                                                                               |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`oak-curriculum-sdk`](../../packages/sdks/oak-curriculum-sdk/) | Curriculum API SDK — generated types, Zod validators, MCP tool metadata, all flowing from the OpenAPI schema                                                          |
| [`oak-search-sdk`](../../packages/sdks/oak-search-sdk/)         | Search SDK — hybrid lexical (BM25) + semantic (ELSER) retrieval, admin services, observability, and blue/green index lifecycle management (zero downtime index swaps) |
| [`oak-sdk-codegen`](../../packages/sdks/oak-sdk-codegen/)       | Schema-driven code generation — OpenAPI → TypeScript types, Zod schemas, ES mappings, MCP tool definitions                                                            |

**Core and Libraries:**

**Core packages:**

| Workspace                                                      | Purpose                                                               |
| -------------------------------------------------------------- | --------------------------------------------------------------------- |
| [`result`](../../packages/core/result/README.md)               | `Result<T, E>` type for explicit error handling without exceptions    |
| [`env`](../../packages/core/env/README.md)                     | Env schema contracts — Zod-based validation for environment variables |
| [`observability`](../../packages/core/observability/README.md) | Provider-neutral redaction and active-span helpers                    |
| [`type-helpers`](../../packages/core/type-helpers/README.md)   | Shared type-level utilities                                           |
| [`oak-eslint`](../../packages/core/oak-eslint/README.md)       | Custom ESLint rules enforcing architectural boundaries                |

**Libraries:**

| Workspace                                                                         | Purpose                                                                       |
| --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| [`@oaknational/logger`](../../packages/libs/logger/README.md)                     | Structured logger with sink fan-out, redaction, and trace correlation         |
| [`@oaknational/env-resolution`](../../packages/libs/env-resolution/README.md)     | Environment resolution pipeline — `.env` discovery, validation, and injection |
| [`@oaknational/fidelity-review`](../../packages/libs/fidelity-review/README.md)   | Shared fidelity capture/diff/report core for the demo apps                    |
| [`@oaknational/search-contracts`](../../packages/libs/search-contracts/README.md) | Canonical semantic-search field and stage contracts                           |
| [`@oaknational/sentry-node`](../../packages/libs/sentry-node/README.md)           | Shared Sentry Node config, sinks, fixture runtime, and flush helpers          |

**Design:**

| Workspace                                                         | Purpose                                                                            |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [`design-tokens-core`](../../packages/design/design-tokens-core/) | Pure functions for DTCG token parsing and WCAG AA contrast validation              |
| [`oak-design-tokens`](../../packages/design/oak-design-tokens/)   | Oak-specific token definitions (palette, semantic, component) and CSS build output |
| [`oak-design-ink`](../../packages/design/oak-design-ink/)         | Reusable Oak React primitives for Ink-based terminal interfaces                    |

## Architectural invariants

Six stable, ADR-backed properties make this repository what it is. Each links to its authoritative doc, which always carries the detail:

1. **The SDK updates itself from the API spec** — when the upstream OpenAPI schema changes, regeneration brings every workspace into alignment with zero manual type work (the [Cardinal Rule](../../.agent/directives/principles.md#cardinal-rule-of-this-repository); [OpenAPI pipeline](./openapi-pipeline.md)).
2. **Two data feeds, both deliberate** — the live API powers the SDK and MCP tools ([OpenAPI pipeline](./openapi-pipeline.md)), while bulk-downloaded curriculum data is the source of truth for search ingestion and graph derivation ([semantic search architecture](../agent-guidance/semantic-search-architecture.md)).
3. **The curriculum graphs are derived from the bulk data** — prior knowledge, misconceptions, keywords, and progressions served as anchored graph tools ([graph-stack topology, ADR-173](./architectural-decisions/173-graph-stack-topology.md)).
4. **EEF evidence grounds the pedagogy** — the Teaching and Learning Toolkit is integrated for evidence-based support ([Data Sources](../governance/DATA-SOURCES.md)).
5. **The bulk data populates the semantic search** — ingestion builds the search indices from it ([ingestion guide](../../apps/oak-search-cli/docs/INGESTION-GUIDE.md)).
6. **The Search SDK serves both sides** — creating and operating search instances as well as querying them ([Search SDK](../../packages/sdks/oak-search-sdk/README.md)).

## Reference Documentation

### Core Architecture (Current)

- Foundations-first architecture: the
  [software projection of the cost-of-change gradient](./foundations-first.md)
  — how core building blocks, foundational systems, libraries, and products
  concentrate recurring mechanism and assurance at the lowest coherent layer.
  The [general pattern](../foundation/cost-of-change-gradient.md) also applies
  across human-agent systems, inquiry, and the Practice.
- Algorithm and data-structure foundations (a documented direction; no
  implementation has landed yet): [ADR-230](./architectural-decisions/230-own-built-algorithm-and-data-structure-foundations.md)
  records the owner-established direction to author Capability Foundations:
  small completed Primitives and meaningful compositions, informed by openly
  licensed references. The
  [governing policy](./foundations/algorithms-and-data-structures-governance-2026-09-08.md)
  owns scope, research and qualification; the [bundle index](./foundations/foundations-bundle-index-2026-09-08.md)
  locates the graph and non-graph contracts, requirements and worked examples.
- Standard structure:
  - `apps/` – application runtimes (MCP servers, search CLI)
  - `packages/sdks/` – SDK packages (`@oaknational/curriculum-sdk`, `@oaknational/oak-search-sdk`)
  - `packages/core/` – foundational shared code and provider-neutral primitives (result/env/observability/eslint/openapi adapter)
  - `packages/libs/` – shared runtime libraries; the foundation/adapter tier membership is enumerated in [ADR-041](architectural-decisions/041-workspace-structure-option-a.md), the single source for it (this line stopped restating the list after drifting four packages behind it)
- Boundaries enforced by custom ESLint rules in `packages/core/oak-eslint`
- Provider composition is app-local (logger/clock/storage/search retrieval), then injected into server/tool layers
- Apps load runtime config at entry boundaries and inject dependencies (DI) into servers and tools
- A universal MCP translation layer (generated in the SDK) normalises tool inputs/outputs so the canonical Streamable HTTP transport (`/mcp`) — and any future stdio entry point generalised from it — share the same schema-derived contract
- **Key implementation detail**: All MCP tools are generated at compile time from the OpenAPI schema - see [Programmatic Tool Generation](./programmatic-tool-generation.md) and [OpenAPI Pipeline](./openapi-pipeline.md)
- Provider architecture: see [Provider System](./provider-system.md) and [Provider Contracts](./provider-contracts.md)
- Getting started: see the [root README Quick Start](../../README.md#quick-start)

#### Rules & Relationships

- Inter‑workspace imports in production source use `@oaknational/*` package
  specifiers only. Explicit test/config lint carve-outs remain allowed where
  repo-root tooling or fixtures require them.
- Intra‑package relative imports are allowed; avoid private/internal subpaths.
- Dependencies flow: `core` has no monorepo dependencies outside `core` (intra-core dependencies are permitted, and external dependencies must remain minimal and provider-neutral); foundation `libs` depend on `core`, with `search-contracts` as the documented exception that may consume approved `@oaknational/sdk-codegen` subpath exports; adapter `libs` may depend on foundation `libs` plus `core`; `sdks` depend on `core`/`libs` and approved generated SDK surfaces (for example runtime/search consume `@oaknational/sdk-codegen` exports per ADR-108, not direct `oak-search-sdk` → `curriculum-sdk` imports); `apps` depend on `sdks`/`libs`/`core`.
- **Core package decomposition principle**: when splitting a core package that has acquired runtime dependencies, schemas and type-level code stay in `core`; the runtime pipeline moves to `libs`. This preserves core's provider-neutral, minimal-dependency constraint.

### Implementation Guides

- [Programmatic Tool Generation](./programmatic-tool-generation.md) - MCP tool generation from SDK (compile‑time)
- [Provider System](./provider-system.md) - App-local provider composition and DI boundaries
- [Provider Contracts](./provider-contracts.md) - Runtime dependency contract surfaces

### Architectural Decisions

- [ADR-029: No Manual API Data Structures](./architectural-decisions/029-no-manual-api-data.md)
- [ADR-030: SDK as Single Source of Truth](./architectural-decisions/030-sdk-single-source-truth.md)
- [ADR-031: Generation-Time Extraction](./architectural-decisions/031-generation-time-extraction.md)
- [ADR-040: Transition to Neutral Architecture and Allowlist Identity Check](./architectural-decisions/040-neutral-architecture-and-identity-allowlist.md)
- [ADR-041: Workspace Structure Option A Adopted](./architectural-decisions/041-workspace-structure-option-a.md)
- [ADR-174: Dependency Vulnerability Scanning as a Quality Gate](./architectural-decisions/174-dependency-vulnerability-scanning-quality-gate.md)
- [ADR-230: Own-built Algorithm and Data-structure Foundations](./architectural-decisions/230-own-built-algorithm-and-data-structure-foundations.md)
- [ADR-233: Retained framework and configurable instances](./architectural-decisions/233-retained-framework-and-configurable-instances.md)
- [All ADRs](./architectural-decisions/) - Complete decision record (historical ADRs preserved)

## Related Agent Guidance

The wider system that governs how the architectural decisions and
guidance below are authored, propagated, and reviewed is **the
Practice** — see [Practice Core](../../.agent/practice-core/index.md)
for the portable definition and
[Practice Index](../../.agent/practice-index.md) for this
repository's local bridge.

- [Development Practice](../governance/development-practice.md)
- [Testing Strategy](../../.agent/directives/testing-strategy.md)
- [TypeScript Practice](../governance/typescript-practice.md)

## Implementation Plans

Implementation plans are execution artefacts, not canonical architecture
documentation. Durable decisions belong in ADRs; plan-path provenance belongs
in plans and session notes.

## Historical Context

Prior architectural states retained for traceability — evidence trails
cited from current ADRs, not current guidance. See
[historical/README.md](./historical/README.md) for scope and
contents. Do not read these to learn how the system works today.

## Related Design Space

- [Explorations](../explorations/) — option-weighing and research
  documents that sit between session observations and committed ADRs.
  Some inform ADRs that live in this directory; others inform plans
  that live under `.agent/plans/`.
