# Architectural Decisions Records

> **Navigation**: [Architecture Home](../README.md) | [Architecture Map (archived)](../../archive/ARCHITECTURE_MAP.md) | [Architecture Overview (archived)](../../archive/architecture-overview.md)

This file is an index of architectural decisions made during the development of this repository.

## Start Here: 5 ADRs in 15 Minutes

New to the repo? Read these five ADRs first for the architectural foundations:

1. [ADR-029](029-no-manual-api-data.md) — No manual API data structures (the cardinal rule)
2. [ADR-030](030-sdk-single-source-truth.md) — SDK as single source of truth
3. [ADR-031](031-generation-time-extraction.md) — Generation-time extraction
4. [ADR-048](048-shared-parse-schema-helper.md) — Shared parsing helper pattern
5. [ADR-107](107-deterministic-sdk-nl-in-mcp-boundary.md) — Deterministic SDK / NL-in-MCP boundary

## Index

- [ADR-001: ESM-Only Package](001-esm-only-package.md)
- [ADR-002: Pure Functions First](002-pure-functions-first.md)
- [ADR-003: Zod for Runtime Validation](003-zod-for-validation.md)
- [ADR-004: Abstract Notion SDK Behind Interface](004-no-direct-notion-sdk-usage.md) ← **Deprecated** (workspace removed)
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
- [ADR-015: Node.js 24.x Requirement](015-node-24-minimum.md)
- [ADR-016: Use dotenv for Environment Configuration](016-dotenv-for-configuration.md) ← **Superseded** by ADR-116
- [ADR-017: Use Consola for Logging](017-consola-for-logging.md)
- [ADR-018: Complete Biological Architecture](018-complete-biological-architecture.md)
- [ADR-019: Domain-Driven File Splitting](019-domain-driven-file-splitting.md)
- [ADR-020: Biological Architecture Pattern](../../archive/architecture/architectural-decisions/020-biological-architecture.md) ← **Archived** (Greek ecosystem deprecated)
- [ADR-021: Genotype/Phenotype/Chorai](../../archive/architecture/architectural-decisions/021-genotype-phenotype-chorai.md) ← **Archived** (Greek ecosystem deprecated)
- [ADR-022: Conditional Dependencies in Genotype](022-conditional-dependencies-genotype.md)
- [ADR-023: Moria/Histoi/Psycha Architecture](../../archive/architecture/architectural-decisions/023-moria-histoi-psycha-architecture.md) ← **Archived** (Greek ecosystem deprecated)
- [ADR-024: Dependency Injection Pattern](024-dependency-injection-pattern.md)
- [ADR-025: Erasable Syntax Only](025-erasable-syntax-only.md)
- [ADR-026: OpenAPI Code Generation Strategy](026-openapi-code-generation-strategy.md)
- [ADR-027: Runtime Isolation Strategy (Updated: Node.js-only SDK)](027-runtime-isolation-strategy.md)
- [ADR-028: Zod Validation Deferral](028-zod-validation-deferral.md)
- [ADR-029: No Manual API Data Structures in MCP](029-no-manual-api-data.md)
- [ADR-030: SDK as Single Source of Truth](030-sdk-single-source-truth.md)
- [ADR-031: Generation-Time Extraction](031-generation-time-extraction.md)
- [ADR-032: External Boundary Validation](032-external-boundary-validation.md)
- [ADR-033: Centralised Log Level Configuration](033-centralised-log-level-configuration.md)
- [ADR-034: System Boundaries and Type Assertions](034-system-boundaries-and-type-assertions.md)
- [ADR-035: Unified SDK-MCP Code Generation](035-unified-sdk-mcp-code-generation.md)
- [ADR-036: Data-Driven Code Generation](036-data-driven-code-generation.md)
- [ADR-037: Embedded Tool Information](037-embedded-tool-information.md)
- [ADR-038: Compilation Time Revolution](038-compilation-time-revolution.md)
- [ADR-040: Neutral Architecture and Identity Allowlist](040-neutral-architecture-and-identity-allowlist.md)
- [ADR-041: Workspace Structure Option A](041-workspace-structure-option-a.md)
- [ADR-042: Runtime Adapters Folder](042-runtime-adapters-folder.md)
- [ADR-043: Codegen in Build and CI](043-codegen-in-build-and-ci.md)
- [ADR-044: NL Delegates to Structured Search and Caching Ownership](044-nl-delegates-to-structured-search-and-caching-ownership.md)
- [ADR-045: Hybrid Theming Bridge for Oak Components](045-hybrid-theming-bridge-for-oak-components.md)
- [ADR-046: OpenAI Connector Facades in Streamable HTTP](046-openai-connector-facades-in-streamable-http.md)
- [ADR-047: Canonical URL Generation at Code-Gen Time](047-canonical-url-generation-at-codegen-time.md)
- [ADR-048: Shared Parse Schema Helper](048-shared-parse-schema-helper.md)
- [ADR-049: SDK-Generated Deterministic Fixtures](049-sdk-generated-fixtures.md)
- [ADR-050: MCP Tool Layering DAG](050-mcp-tool-layering-dag.md)
- [ADR-051: OpenTelemetry-Compliant Single-Line JSON Logging](051-opentelemetry-compliant-logging.md) ← **Supersedes ADR-017**
- [ADR-052: OAuth 2.1 for MCP HTTP Server Authentication](052-oauth-2.1-for-mcp-http-authentication.md)
- [ADR-053: Clerk as Identity Provider and Authorization Server](053-clerk-as-identity-provider.md)
- [ADR-054: Tool-Level Authentication Error Interception](054-tool-level-auth-error-interception.md)
- [ADR-055: Zod Version Boundaries](055-zod-version-boundaries.md)
- [ADR-056: ~~Conditional Clerk Middleware for Discovery~~](056-conditional-clerk-middleware-for-discovery.md) (SUPERSEDED by ADR-113)
- [ADR-057: Selective Authentication for Public MCP Resources](057-selective-auth-public-resources.md)
- [ADR-058: Context Grounding for AI Agents](058-context-grounding-for-ai-agents.md)
- [ADR-059: Knowledge Graph for Agent Context](059-knowledge-graph-for-agent-context.md)
- [ADR-060: Agent Support Tool Metadata System](060-agent-support-metadata-system.md)
- [ADR-061: Widget Call-to-Action System](061-widget-cta-system.md) _(superseded)_
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
- [ADR-074: Elastic-Native-First Philosophy](074-elastic-native-first-philosophy.md)
- [ADR-075: Dense Vector Code Removal](075-dense-vector-removal.md) ← **Supersedes ADR-118, 072, 073**
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
- [ADR-109: HTTP 451 as Distinct Error Classification](109-http-451-distinct-classification.md)
- [ADR-110: Thread Search Architecture](110-thread-search-architecture.md)
- [ADR-111: Secret Scanning Quality Gate](111-secret-scanning-quality-gate.md)
- [ADR-112: Per-Request MCP Transport](112-per-request-mcp-transport.md)
- [ADR-113: MCP Spec-Compliant Auth for All Methods](113-mcp-spec-compliant-auth-for-all-methods.md)
- [ADR-114: Layered Sub-agent Prompt Composition Architecture](114-layered-sub-agent-prompt-composition-architecture.md)
- [ADR-115: Proxy OAuth AS for Cursor](115-proxy-oauth-as-for-cursor.md)
- [ADR-116: resolveEnv Pipeline Architecture](116-resolve-env-pipeline-architecture.md) (supersedes ADR-016)
- [ADR-117: Plan Templates and Reusable Plan Components](117-plan-templates-and-components.md)
- [ADR-118: Elastic-Native Dense Vector Strategy](118-elastic-native-dense-vector-strategy.md) ← **Superseded** by ADR-075
- [ADR-119: Agentic Engineering Practice](119-agentic-engineering-practice.md)
- [ADR-120: Per-Scope Search Tuning Parameters](120-per-scope-search-tuning.md)
- [ADR-121: Quality Gate Surfaces](121-quality-gate-surfaces.md)
- [ADR-122: Permissive CORS for OAuth-Protected MCP](122-permissive-cors-for-oauth-protected-mcp.md)
- [ADR-123: MCP Server Primitives Strategy](123-mcp-server-primitives-strategy.md)
- [ADR-124: Practice Propagation Model](124-practice-propagation-model.md)
- [ADR-125: Agent Artefact Portability](125-agent-artefact-portability.md)
- [ADR-126: HMAC-Signed Asset Download Proxy](126-asset-download-proxy.md)
- [ADR-127: Documentation as Foundational Infrastructure](127-documentation-as-foundational-infrastructure.md)
- [ADR-128: Retire the Standalone STDIO Workspace and Consolidate MCP Server Evolution in the HTTP Workspace](128-stdio-workspace-retirement-and-http-transport-consolidation.md)
- [ADR-129: Domain Specialist Capability Pattern](129-domain-specialist-capability-pattern.md)
- [ADR-130: Zero-Downtime Blue/Green Elasticsearch Index Swapping](130-blue-green-index-swapping.md)
- [ADR-131: Self-Reinforcing Improvement Loop](131-self-reinforcing-improvement-loop.md)
- [ADR-132: Sitemap Scanner for Canonical URL Validation](132-sitemap-scanner-for-canonical-url-validation.md)
- [ADR-133: CLI Resource Lifecycle Management](133-cli-resource-lifecycle-management.md)
- [ADR-134: Search SDK Capability Surface Boundary](134-search-sdk-capability-surface-boundary.md)
- [ADR-135: Agent Classification Taxonomy](135-agent-classification-taxonomy.md)
- [ADR-136: Incremental Refresh and Bulk API Partial-Update Doctrine](136-incremental-refresh-bulk-api-partial-update-doctrine.md) ← **Deferred** (out of active migration scope)
- [ADR-137: Specialist Operational Tooling Layer](137-specialist-operational-tooling-layer.md)
- [ADR-138: Shared Search Field Contract Surface](138-shared-search-field-contract-surface.md)
- [ADR-139: Sequence Semantic Contract and Ownership](139-sequence-semantic-contract-and-ownership.md)
- [ADR-140: Search Ingestion SDK Boundary](140-search-ingestion-sdk-boundary.md)

## Key Architectural Decisions

For understanding our API integration approach:

- **[ADR-029](029-no-manual-api-data.md)** - No manual API data structures in MCP
- **[ADR-030](030-sdk-single-source-truth.md)** - SDK as single source of truth for API contracts
- **[ADR-066](066-sdk-response-caching.md)** - SDK response caching with Redis
- **[ADR-070](070-sdk-rate-limiting-and-retry.md)** - SDK rate limiting and exponential backoff retry
- **[ADR-063](063-sdk-domain-synonyms-source-of-truth.md)** - SDK as single source of truth for domain synonyms
- **[ADR-064](064-elasticsearch-mapping-organization.md)** - Elasticsearch index mapping organization
- **[ADR-108](108-sdk-workspace-decomposition.md)** - SDK workspace decomposition (generic/Oak x sdk-codegen/runtime)
- **[ADR-132](132-sitemap-scanner-for-canonical-url-validation.md)** - Sitemap scanner and reference-map validation for canonical URL generation

For understanding authentication, authorization, and observability:

- **[ADR-052](052-oauth-2.1-for-mcp-http-authentication.md)** - OAuth 2.1 for MCP HTTP server authentication
- **[ADR-053](053-clerk-as-identity-provider.md)** - Clerk as Identity Provider and Authorization Server
- **[ADR-115](115-proxy-oauth-as-for-cursor.md)** - Proxy OAuth AS for Cursor compatibility (transparent passthrough to Clerk)
- **[ADR-051](051-opentelemetry-compliant-logging.md)** - OpenTelemetry-compliant single-line JSON logging (supersedes ADR-017)
- **[ADR-033](033-centralised-log-level-configuration.md)** - Centralised log level configuration

For understanding the agentic engineering practice:

- **[ADR-114](114-layered-sub-agent-prompt-composition-architecture.md)** - Layered prompt composition architecture (components -> templates -> wrappers)
- **[ADR-117](117-plan-templates-and-components.md)** - Plan templates and reusable plan components (document hierarchy, lifecycle, TDD phases)
- **[ADR-119](119-agentic-engineering-practice.md)** - Practice naming, boundary, three-layer model, and self-teaching property
- **[ADR-124](124-practice-propagation-model.md)** - Practice propagation: five-file package, self-containment, practice-index bridge
- **[ADR-125](125-agent-artefact-portability.md)** - Agent artefact portability: three-layer model for skills, commands, and rules across Cursor, Claude, Gemini, and Codex
- **[ADR-129](129-domain-specialist-capability-pattern.md)** - Domain specialist capability pattern: reviewer + skill + rule triplet with doctrine hierarchy
- **[ADR-137](137-specialist-operational-tooling-layer.md)** - Specialist operational tooling layer: optional fourth layer for agent-accessible CLI/MCP interaction with live domain systems
- **[ADR-131](131-self-reinforcing-improvement-loop.md)** - Self-reinforcing improvement loop: knowledge flow, consolidation hub, self-referential governance, inter-repo propagation
- **[ADR-135](135-agent-classification-taxonomy.md)** - Agent classification taxonomy: domain_expert, process_executor, specialist; operational modes; Practice domain trio

For understanding semantic search and Elastic-native AI/ML approach:

- **[ADR-074](074-elastic-native-first-philosophy.md)** - Elastic-Native-First Philosophy for AI/ML features
- **[ADR-075](075-dense-vector-removal.md)** - Dense vector code removal (supersedes ADR-118, 072, 073)
- **[ADR-076](076-elser-only-embedding-strategy.md)** - ELSER-only sparse embedding strategy
- **[ADR-138](138-shared-search-field-contract-surface.md)** - Shared field-inventory and stage-matrix contract surface for cross-workspace field-integrity checks
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
- **[ADR-110](110-thread-search-architecture.md)** - Thread search architecture (2-way RRF, partially supersedes ADR-097)
- **[ADR-130](130-blue-green-index-swapping.md)** - Zero-downtime blue/green index swapping via Elasticsearch aliases
- **[ADR-136](136-incremental-refresh-bulk-api-partial-update-doctrine.md)** - Deferred doctrine reference (not part of active migration completion scope)
- **[ADR-133](133-cli-resource-lifecycle-management.md)** - CLI resource lifecycle ownership and `withEsClient` cleanup pattern
- **[ADR-134](134-search-sdk-capability-surface-boundary.md)** - Search SDK read/admin capability boundary, internal encapsulation, and lint-enforced import policy
- **[ADR-139](139-sequence-semantic-contract-and-ownership.md)** - Sequence semantic contract: deterministic construction, ownership split, fail-fast validation, and locked retrieval shape
- **[ADR-140](140-search-ingestion-sdk-boundary.md)** - Dedicated Oak-specific ingestion SDK boundary, thin CLI ownership, and private-first/future-public-ready distribution

**Key principle**: Bulk and API ingestion use the **same indexing pipeline** with different data source adapters. Types are either SDK API types (for input) or SDK Search types (for ES output) — no custom types are invented. See [`src/adapters/README.md`](../../../apps/oak-search-cli/src/adapters/README.md) for detailed architecture.

For historical context on dense vector evaluation (superseded):

- **[ADR-118](118-elastic-native-dense-vector-strategy.md)** - ~~E5 embeddings~~ (SUPERSEDED by ADR-075)
- **[ADR-072](072-three-way-hybrid-search-architecture.md)** - ~~Three-way hybrid~~ (SUPERSEDED by ADR-075)
- **[ADR-073](073-dense-vector-field-configuration.md)** - ~~Dense vector config~~ (SUPERSEDED by ADR-075)

For understanding the now deprecated and removed biological architecture:

- **[ADR-020](../../archive/architecture/architectural-decisions/020-biological-architecture.md)** - Current biological architecture with Greek nomenclature
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
