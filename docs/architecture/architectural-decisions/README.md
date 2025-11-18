# Architectural Decisions Records

> 🗺️ **Quick Navigation**: [Architecture Map](../../ARCHITECTURE_MAP.md) | [Architecture Overview](../../architecture-overview.md) | [Architecture Home](../README.md)

This file is an index of architectural decisions made during the development of this repository.

## Index

- [ADR-001: ESM-Only Package](001-esm-only-package.md)
- [ADR-002: Pure Functions First](002-pure-functions-first.md)
- [ADR-003: Zod for Runtime Validation](003-zod-for-validation.md)
- [ADR-004: Abstract Notion SDK Behind Interface](004-no-direct-notion-sdk-usage.md)
- [ADR-005: Automatic PII Scrubbing](005-automatic-pii-scrubbing.md)
- [ADR-006: Cellular Architecture Pattern](006-cellular-architecture-pattern.md)
- [ADR-007: Accept Current Technical Debt as Architectural Markers](007-accept-current-technical-debt.md)
- [ADR-008: Ecosystem Architecture Vision](008-ecosystem-architecture-vision.md)
- [ADR-009: Mathematical Foundation for Architecture](009-mathematical-foundation-for-architecture.md)
- [ADR-010: Use tsup for Bundling](010-tsup-for-bundling.md)
- [ADR-011: Use Vitest for Testing](011-vitest-for-testing.md)
- [ADR-012: Use pnpm as Package Manager](012-pnpm-package-manager.md)
- [ADR-013: Git Hooks with Husky and lint-staged](013-husky-and-lint-staged.md)
- [ADR-014: Conventional Commits Standard](014-conventional-commits.md)
- [ADR-015: Node.js 22+ Requirement](015-node-22-minimum.md)
- [ADR-016: Use dotenv for Environment Configuration](016-dotenv-for-configuration.md)
- [ADR-017: Use Consola for Logging](017-consola-for-logging.md)
- [ADR-018: Complete Biological Architecture](018-complete-biological-architecture.md)
- [ADR-019: Domain-Driven File Splitting](019-domain-driven-file-splitting.md)
- [ADR-020: Biological Architecture Pattern](020-biological-architecture.md)
- [ADR-021: Genotype/Phenotype/Chorai](021-genotype-phenotype-chorai.md)
- [ADR-022: Conditional Dependencies in Genotype](022-conditional-dependencies-genotype.md)
- [ADR-023: Moria/Histoi/Psycha Architecture](023-moria-histoi-psycha-architecture.md)
- [ADR-024: Dependency Injection Pattern](024-dependency-injection-pattern.md)
- [ADR-025: Erasable Syntax Only](025-erasable-syntax-only.md)
- [ADR-026: OpenAPI Type Generation Strategy](026-openapi-type-generation-strategy.md)
- [ADR-027: Runtime Isolation Strategy](027-runtime-isolation-strategy.md)
- [ADR-028: Zod Validation Deferral](028-zod-validation-deferral.md)
- [ADR-029: No Manual API Data Structures in MCP](029-no-manual-api-data.md)
- [ADR-030: SDK as Single Source of Truth](030-sdk-single-source-truth.md)
- [ADR-031: Generation-Time Extraction](031-generation-time-extraction.md)
- [ADR-032: External Boundary Validation](032-external-boundary-validation.md)
- [ADR-033: Centralised Log Level Configuration](033-centralised-log-level-configuration.md)
- [ADR-034: System Boundaries and Type Assertions](034-system-boundaries-and-type-assertions.md)
- [ADR-035: Unified SDK-MCP Type Generation](035-unified-sdk-mcp-type-generation.md)
- [ADR-036: Data-Driven Type Generation](036-data-driven-type-generation.md)
- [ADR-037: Embedded Tool Information](037-embedded-tool-information.md)
- [ADR-038: Compilation Time Revolution](038-compilation-time-revolution.md)
- [ADR-040: Neutral Architecture and Identity Allowlist](040-neutral-architecture-and-identity-allowlist.md)
- [ADR-041: Workspace Structure Option A](041-workspace-structure-option-a.md)
- [ADR-042: Runtime Adapters Folder](042-runtime-adapters-folder.md)
- [ADR-043: Typegen in Build and CI](043-typegen-in-build-and-ci.md)
- [ADR-044: NL Delegates to Structured Search and Caching Ownership](044-nl-delegates-to-structured-search-and-caching-ownership.md)
- [ADR-045: Hybrid Theming Bridge for Oak Components](045-hybrid-theming-bridge-for-oak-components.md)
- [ADR-046: OpenAI Connector Facades in Streamable HTTP](046-openai-connector-facades-in-streamable-http.md)
- [ADR-047: Canonical URL Generation at Type-Gen Time](047-canonical-url-generation-at-typegen-time.md)
- [ADR-048: Shared Parse Schema Helper](048-shared-parse-schema-helper.md)
- [ADR-049: SDK-Generated Deterministic Fixtures](049-sdk-generated-fixtures.md)
- [ADR-050: MCP Tool Layering DAG](050-mcp-tool-layering-dag.md)
- [ADR-051: OpenTelemetry-Compliant Single-Line JSON Logging](051-opentelemetry-compliant-logging.md) ← **Supersedes ADR-017**
- [ADR-052: OAuth 2.1 for MCP HTTP Server Authentication](052-oauth-2.1-for-mcp-http-authentication.md)
- [ADR-053: Clerk as Identity Provider and Authorization Server](053-clerk-as-identity-provider.md)

## Key Architectural Decisions

For understanding our biological architecture, these ADRs are most important:

- **[ADR-020](020-biological-architecture.md)** - Current biological architecture with Greek nomenclature
- **[ADR-018](018-complete-biological-architecture.md)** - Evolution to complete biological model
- **[ADR-009](009-mathematical-foundation-for-architecture.md)** - Mathematical grounding from complex systems theory
- **[ADR-006](006-cellular-architecture-pattern.md)** - Original cellular architecture inspiration

For understanding our API integration approach:

- **[ADR-029](029-no-manual-api-data.md)** - No manual API data structures in MCP
- **[ADR-030](030-sdk-single-source-truth.md)** - SDK as single source of truth for API contracts

For understanding authentication, authorization, and observability:

- **[ADR-052](052-oauth-2.1-for-mcp-http-authentication.md)** - OAuth 2.1 for MCP HTTP server authentication
- **[ADR-053](053-clerk-as-identity-provider.md)** - Clerk as Identity Provider and Authorization Server
- **[ADR-051](051-opentelemetry-compliant-logging.md)** - OpenTelemetry-compliant single-line JSON logging (supersedes ADR-017)
- **[ADR-033](033-centralised-log-level-configuration.md)** - Centralised log level configuration

## About ADRs

Architecture Decision Records (ADRs) capture important architectural decisions made in the project. Each ADR includes:

- **Status**: Whether the decision is accepted, superseded, or deprecated
- **Context**: The situation and forces at play
- **Decision**: The change we're making
- **Rationale**: Why we chose this approach
- **Consequences**: What we expect to happen (both positive and negative)

ADRs help future developers (including ourselves) understand why the architecture is the way it is.
