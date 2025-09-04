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

## Key Architectural Decisions

For understanding our biological architecture, these ADRs are most important:

- **[ADR-020](020-biological-architecture.md)** - Current biological architecture with Greek nomenclature
- **[ADR-018](018-complete-biological-architecture.md)** - Evolution to complete biological model
- **[ADR-009](009-mathematical-foundation-for-architecture.md)** - Mathematical grounding from complex systems theory
- **[ADR-006](006-cellular-architecture-pattern.md)** - Original cellular architecture inspiration

For understanding our API integration approach:

- **[ADR-029](029-no-manual-api-data.md)** - No manual API data structures in MCP
- **[ADR-030](030-sdk-single-source-truth.md)** - SDK as single source of truth for API contracts

## About ADRs

Architecture Decision Records (ADRs) capture important architectural decisions made in the project. Each ADR includes:

- **Status**: Whether the decision is accepted, superseded, or deprecated
- **Context**: The situation and forces at play
- **Decision**: The change we're making
- **Rationale**: Why we chose this approach
- **Consequences**: What we expect to happen (both positive and negative)

ADRs help future developers (including ourselves) understand why the architecture is the way it is.
