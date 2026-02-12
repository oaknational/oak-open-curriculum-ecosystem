# Architectural Decisions Records

> 🗺️ **Quick Navigation**: [Architecture Map](../../archive/ARCHITECTURE_MAP.md) | [Architecture Overview](../../archive/architecture-overview.md) | [Architecture Home](../README.md)

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
- [ADR-027: Runtime Isolation Strategy (Updated: Node.js-only SDK)](027-runtime-isolation-strategy.md)
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
- [ADR-054: Tool-Level Authentication Error Interception](054-tool-level-auth-error-interception.md)
- [ADR-055: Zod Version Boundaries](055-zod-version-boundaries.md)
- [ADR-056: Conditional Clerk Middleware for Discovery](056-conditional-clerk-middleware-for-discovery.md)
- [ADR-057: Selective Authentication for Public MCP Resources](057-selective-auth-public-resources.md)
- [ADR-058: Context Grounding for AI Agents](058-context-grounding-for-ai-agents.md)
- [ADR-059: Knowledge Graph for Agent Context](059-knowledge-graph-for-agent-context.md)
- [ADR-060: Agent Support Tool Metadata System](060-agent-support-metadata-system.md)
- [ADR-061: Widget Call-to-Action System](061-widget-cta-system.md)
- [ADR-062: Knowledge Graph SVG Visualization](062-knowledge-graph-svg-visualization.md)
- [ADR-063: SDK Domain Synonyms Source of Truth](063-sdk-domain-synonyms-source-of-truth.md)
- [ADR-064: Elasticsearch Index Mapping Organization](064-elasticsearch-mapping-organization.md)
- [ADR-065: Turbo Task Dependencies](065-turbo-task-dependencies.md)
- [ADR-066: SDK Response Caching](066-sdk-response-caching.md)
- [ADR-067: SDK Generated Elasticsearch Mappings](067-sdk-generated-elasticsearch-mappings.md)
- [ADR-068: Per-Index Completion Context Enforcement](068-per-index-completion-context-enforcement.md)
- [ADR-069: Systematic Ingestion with Progress Tracking](069-systematic-ingestion-progress-tracking.md)
- [ADR-070: SDK Rate Limiting and Exponential Backoff Retry](070-sdk-rate-limiting-and-retry.md)
- [ADR-071: Widget URI Cache-Busting Simplification](071-widget-uri-cache-busting-simplification.md)
- [ADR-075: Dense Vector Code Removal](075-dense-vector-removal.md) ← **Supersedes ADR-071, 072, 073**
- [ADR-076: ELSER-Only Embedding Strategy](076-elser-only-embedding-strategy.md)
- [ADR-077: Local Semantic Summary Generation at Ingest Time](077-semantic-summary-generation.md)
- [ADR-078: Dependency Injection for Testability](078-dependency-injection-for-testability.md)
- [ADR-079: SDK Cache TTL Jitter](079-sdk-cache-ttl-jitter.md)
- [ADR-080: KS4 Metadata Denormalisation Strategy](080-curriculum-data-denormalization-strategy.md)
- [ADR-081: Search Approach Evaluation Framework](081-search-approach-evaluation-framework.md)
- [ADR-082: Fundamentals-First Search Strategy](082-fundamentals-first-search-strategy.md)
- [ADR-083: Complete Lesson Enumeration Strategy](083-complete-lesson-enumeration-strategy.md)
- [ADR-084: Phrase Query Boosting for Multi-Word Synonym Support](084-phrase-query-boosting.md)
- [ADR-085: Ground Truth Validation Discipline](085-ground-truth-validation-discipline.md)
- [ADR-086: Vocabulary Mining and Graph Export Pattern](086-vocab-gen-graph-export-pattern.md)
- [ADR-087: Batch-Atomic Ingestion](087-batch-atomic-ingestion.md) ← **Supersedes aspects of ADR-069**
- [ADR-088: Result Pattern for Explicit Error Handling](088-result-pattern-for-error-handling.md)
- [ADR-089: Index Everything Principle for Elasticsearch](089-index-everything-principle.md)
- [ADR-091: Video Availability Detection Strategy](091-video-availability-detection-strategy.md) ← **Superseded by ADR-093**
- [ADR-092: Transcript Cache Categorization](092-transcript-cache-categorization.md)
- [ADR-093: Bulk-First Ingestion Strategy](093-bulk-first-ingestion-strategy.md)
- [ADR-094: has_transcript Field for Transcript Presence](094-has-transcript-field.md)
- [ADR-095: Missing Transcript Handling](095-missing-transcript-handling.md)
- [ADR-096: ES Bulk Retry Strategy](096-es-bulk-retry-strategy.md)
- [ADR-097: Context Enrichment Architecture](097-context-enrichment-architecture.md)
- [ADR-098: Ground Truth Registry as Single Source of Truth](098-ground-truth-registry.md)
- [ADR-099: Transcript-Aware RRF Score Normalisation](099-transcript-aware-rrf-normalisation.md)
- [ADR-100: Complete Subject Synonym Coverage](100-complete-subject-synonym-coverage.md)
- [ADR-101: Subject Hierarchy for Search Filtering](101-subject-hierarchy-for-search-filtering.md)
- [ADR-102: Conditional Minimum Should Match](102-conditional-minimum-should-match.md)
- [ADR-103: Fuzzy Matching Limitations](103-fuzzy-matching-limitations.md)
- [ADR-104: Domain Term Boosting](104-domain-term-boosting.md)
- [ADR-105: SDK-Generated Search Constants](105-sdk-generated-search-constants.md)
- [ADR-106: Known-Answer-First Ground Truth Methodology](106-known-answer-first-ground-truth-methodology.md)
- [ADR-107: Deterministic SDK / NL-in-MCP Boundary](107-deterministic-sdk-nl-in-mcp-boundary.md)
- [ADR-108: SDK Workspace Decomposition](108-sdk-workspace-decomposition.md)

## Key Architectural Decisions

For understanding our API integration approach:

- **[ADR-029](029-no-manual-api-data.md)** - No manual API data structures in MCP
- **[ADR-030](030-sdk-single-source-truth.md)** - SDK as single source of truth for API contracts
- **[ADR-066](066-sdk-response-caching.md)** - SDK response caching with Redis
- **[ADR-070](070-sdk-rate-limiting-and-retry.md)** - SDK rate limiting and exponential backoff retry
- **[ADR-063](063-sdk-domain-synonyms-source-of-truth.md)** - SDK as single source of truth for domain synonyms
- **[ADR-064](064-elasticsearch-mapping-organization.md)** - Elasticsearch index mapping organization
- **[ADR-108](108-sdk-workspace-decomposition.md)** - SDK workspace decomposition (generic/Oak x type-gen/runtime)

For understanding authentication, authorization, and observability:

- **[ADR-052](052-oauth-2.1-for-mcp-http-authentication.md)** - OAuth 2.1 for MCP HTTP server authentication
- **[ADR-053](053-clerk-as-identity-provider.md)** - Clerk as Identity Provider and Authorization Server
- **[ADR-051](051-opentelemetry-compliant-logging.md)** - OpenTelemetry-compliant single-line JSON logging (supersedes ADR-017)
- **[ADR-033](033-centralised-log-level-configuration.md)** - Centralised log level configuration

For understanding semantic search and Elastic-native AI/ML approach:

- **[ADR-074](074-elastic-native-first-philosophy.md)** - Elastic-Native-First Philosophy for AI/ML features
- **[ADR-075](075-dense-vector-removal.md)** - Dense vector code removal (supersedes ADR-071, 072, 073)
- **[ADR-076](076-elser-only-embedding-strategy.md)** - ELSER-only sparse embedding strategy
- **[ADR-077](077-semantic-summary-generation.md)** - Local semantic summary generation at ingest time
- **[ADR-079](079-sdk-cache-ttl-jitter.md)** - SDK cache TTL jitter for stampede prevention
- **[ADR-080](080-curriculum-data-denormalization-strategy.md)** - KS4 metadata denormalisation via sequence traversal
- **[ADR-081](081-search-approach-evaluation-framework.md)** - Search approach evaluation framework (metrics, harness)
- **[ADR-082](082-fundamentals-first-search-strategy.md)** - Fundamentals-first search strategy (tier prioritisation)
- **[ADR-085](085-ground-truth-validation-discipline.md)** - Ground truth validation discipline
- **[ADR-098](098-ground-truth-registry.md)** - Ground truth registry as single source of truth
- **[ADR-067](067-sdk-generated-elasticsearch-mappings.md)** - SDK-generated Elasticsearch mappings
- **[ADR-068](068-per-index-completion-context-enforcement.md)** - Per-index completion context enforcement
- **[ADR-069](069-systematic-ingestion-progress-tracking.md)** - Systematic ingestion with progress tracking
- **[ADR-087](087-batch-atomic-ingestion.md)** - Batch-atomic ingestion (supersedes file-based progress from ADR-069)
- **[ADR-089](089-index-everything-principle.md)** - Index Everything principle (ES as complete curriculum view)

For understanding the unified ingestion pipeline architecture:

- **[ADR-093](093-bulk-first-ingestion-strategy.md)** - Bulk-first ingestion (bulk download as primary, API for supplementation)
- **[ADR-094](094-has-transcript-field.md)** - `has_transcript` field for filtering/debugging
- **[ADR-095](095-missing-transcript-handling.md)** - Missing transcript handling (omit content fields, don't pollute index)
- **[ADR-096](096-es-bulk-retry-strategy.md)** - Two-tier retry for ELSER queue overflow recovery
- **[ADR-099](099-transcript-aware-rrf-normalisation.md)** - Post-RRF score normalisation for transcript-less documents
- **[ADR-106](106-known-answer-first-ground-truth-methodology.md)** - Known-answer-first ground truth methodology
- **[ADR-107](107-deterministic-sdk-nl-in-mcp-boundary.md)** - Deterministic SDK / NL parsing stays in MCP layer

**Key principle**: Bulk and API ingestion use the **same indexing pipeline** with different data source adapters. Types are either SDK API types (for input) or SDK Search types (for ES output) — no custom types are invented. See [`src/adapters/README.md`](../../../apps/oak-search-cli/src/adapters/README.md) for detailed architecture.

For historical context on dense vector evaluation (superseded):

- **[ADR-071](071-elastic-native-dense-vector-strategy.md)** - ~~E5 embeddings~~ (SUPERSEDED by ADR-075)
- **[ADR-072](072-three-way-hybrid-search-architecture.md)** - ~~Three-way hybrid~~ (SUPERSEDED by ADR-075)
- **[ADR-073](073-dense-vector-field-configuration.md)** - ~~Dense vector config~~ (SUPERSEDED by ADR-075)

For understanding the now deprecated and removed biological architecture:

- **[ADR-020](020-biological-architecture.md)** - Current biological architecture with Greek nomenclature
- **[ADR-018](018-complete-biological-architecture.md)** - Evolution to complete biological model
- **[ADR-009](009-mathematical-foundation-for-architecture.md)** - Mathematical grounding from complex systems theory
- **[ADR-006](006-cellular-architecture-pattern.md)** - Original cellular architecture inspiration

## About ADRs

Architecture Decision Records (ADRs) capture important architectural decisions made in the project. Each ADR includes:

- **Status**: Whether the decision is accepted, superseded, or deprecated
- **Context**: The situation and forces at play
- **Decision**: The change we're making
- **Rationale**: Why we chose this approach
- **Consequences**: What we expect to happen (both positive and negative)

ADRs help future developers (including ourselves) understand why the architecture is the way it is.
