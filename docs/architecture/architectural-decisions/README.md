---
boundary: B2-Architecture
doc_role: index
authority: adr-navigation
status: active
last_reviewed: 2026-08-30
---

# Architectural Decision Records

> **Navigation**: [Architecture Home](../README.md) | [OpenAPI Pipeline](../openapi-pipeline.md) | [Practice Core](../../../.agent/practice-core/index.md) | [Practice Index](../../../.agent/practice-index.md)

This file is an index of architectural decisions made during the development of this repository. The wider system that governs how these decisions are authored, propagated, and reviewed is **the Practice** — see [Practice Core](../../../.agent/practice-core/index.md) for the portable definition and [Practice Index](../../../.agent/practice-index.md) for this repository's local bridge.

Current framing: the ADR corpus supports the repository goal of making Oak's
openly licenced, fully sequenced and resourced curriculum reusable through
generated SDKs, MCP and MCP Apps, the OpenAPI-to-MCP pipeline, hybrid semantic
search, knowledge graphs, and the reusable agentic-first Practice.

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
- ADR-020: Biological Architecture Pattern (`../../archive/architecture/architectural-decisions/020-biological-architecture.md`) ← **Archived** (Greek ecosystem deprecated)
- ADR-021: Genotype/Phenotype/Chorai (`../../archive/architecture/architectural-decisions/021-genotype-phenotype-chorai.md`) ← **Archived** (Greek ecosystem deprecated)
- [ADR-022: Conditional Dependencies in Genotype](022-conditional-dependencies-genotype.md)
- ADR-023: Moria/Histoi/Psycha Architecture (`../../archive/architecture/architectural-decisions/023-moria-histoi-psycha-architecture.md`) ← **Archived** (Greek ecosystem deprecated)
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
- [ADR-037: Embedded Tool Information](037-embedded-tool-information.md) ← **Superseded by [ADR-038](038-compilation-time-revolution.md)**
- [ADR-038: Compilation Time Revolution](038-compilation-time-revolution.md)
- [ADR-040: Neutral Architecture and Identity Allowlist](040-neutral-architecture-and-identity-allowlist.md)
- [ADR-041: Workspace Structure Option A](041-workspace-structure-option-a.md)
- [ADR-042: Runtime Adapters Folder](042-runtime-adapters-folder.md)
- [ADR-043: Codegen in Build and CI](043-codegen-in-build-and-ci.md)
- [ADR-044: NL Delegates to Structured Search and Caching Ownership](044-nl-delegates-to-structured-search-and-caching-ownership.md) ← **Superseded by [ADR-107](107-deterministic-sdk-nl-in-mcp-boundary.md)**
- [ADR-045: Hybrid Theming Bridge for Oak Components](045-hybrid-theming-bridge-for-oak-components.md) ← **Superseded by [ADR-151](151-mcp-app-styling-independence.md)**
- [ADR-046: OpenAI Connector Facades in Streamable HTTP](046-openai-connector-facades-in-streamable-http.md) ← **Superseded by [ADR-141](141-mcp-apps-standard-primary.md)**
- [ADR-047: Canonical URL Generation at Code-Gen Time](047-canonical-url-generation-at-codegen-time.md) ← **Partially Superseded** by ADR-145
- [ADR-048: Shared Parse Schema Helper](048-shared-parse-schema-helper.md)
- [ADR-049: SDK-Generated Deterministic Fixtures](049-sdk-generated-fixtures.md)
- [ADR-050: MCP Tool Layering DAG](050-mcp-tool-layering-dag.md)
- [ADR-051: OpenTelemetry-Compliant Single-Line JSON Logging](051-opentelemetry-compliant-logging.md) ← **Supersedes ADR-017**
- [ADR-052: OAuth 2.1 for MCP HTTP Server Authentication](052-oauth-2.1-for-mcp-http-authentication.md)
- [ADR-053: Clerk as Identity Provider and Authorization Server](053-clerk-as-identity-provider.md) (amended 2026-04-21 — temporal scope named: canonical user-ID provider through public alpha)
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
- [ADR-064: Elasticsearch Index Mapping Organization](064-elasticsearch-mapping-organization.md) ← **Superseded by [ADR-067](067-sdk-generated-elasticsearch-mappings.md)**
- [ADR-065: Turbo Task Dependencies](065-turbo-task-dependencies.md)
- [ADR-066: SDK Response Caching](066-sdk-response-caching.md)
- [ADR-067: SDK Generated Elasticsearch Mappings](067-sdk-generated-elasticsearch-mappings.md)
- [ADR-068: Per-Index Completion Context Enforcement](068-per-index-completion-context-enforcement.md)
- [ADR-069: Systematic Ingestion with Progress Tracking](069-systematic-ingestion-progress-tracking.md) ← **Superseded by [ADR-087](087-batch-atomic-ingestion.md)**
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
- [ADR-113: MCP Spec-Compliant Auth for All Methods](113-mcp-spec-compliant-auth-for-all-methods.md) (root cause corrected 2026-08-20 — Clerk enforces the client's own registered grant; it does not refuse `openid` as a platform rule)
- [ADR-114: Layered Sub-agent Prompt Composition Architecture](114-layered-sub-agent-prompt-composition-architecture.md)
- [ADR-115: Proxy OAuth AS for Cursor](115-proxy-oauth-as-for-cursor.md)
- [ADR-116: resolveEnv Pipeline Architecture](116-resolve-env-pipeline-architecture.md) (supersedes ADR-016)
- [ADR-117: Plan Templates and Reusable Plan Components](117-plan-templates-and-components.md) ← **Superseded** by ADR-216
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
- [ADR-141: MCP Apps Standard as Only UI Surface](141-mcp-apps-standard-primary.md)
- [ADR-142: `@clerk/mcp-tools` Adopt-or-Explain Decision](142-clerk-mcp-tools-adopt-or-explain.md)
- [ADR-143: Coherent Structured Fan-Out for the Sentry and OpenTelemetry Foundation](143-coherent-structured-fan-out-for-observability.md)
- [ADR-144: Three-Zone Fitness Model](144-two-threshold-fitness-model.md) — filename
  retains its original ADR-144 slug because the ADR was amended in place; see
  Status block in the ADR for history
- [ADR-145: Oak URL Naming Collision Remediation](145-oak-url-naming-collision-remediation.md)
- [ADR-146: Assumptions Expert — Meta-Level Plan Assessment](146-assumptions-expert-meta-level-plan-assessment.md)
- [ADR-147: Browser Accessibility as a Blocking Quality Gate](147-browser-accessibility-as-blocking-quality-gate.md)
- [ADR-148: Design Token Architecture](148-design-token-architecture.md) (§Source Format
  superseded in part by ADR-213)
- [ADR-149: Frontend Specialist Expert Gateway Cluster](149-frontend-specialist-expert-gateway-cluster.md)
- [ADR-150: Continuity Surfaces, Session Handoff, and Surprise Pipeline](150-continuity-surfaces-session-handoff-and-surprise-pipeline.md)
- [ADR-151: MCP App Styling Independence from Oak Web Application and Oak Components](151-mcp-app-styling-independence.md)
- [ADR-152: Provenance UUID Migration](152-provenance-uuid-migration.md)
- [ADR-153: Constant-Type-Predicate Pattern](153-constant-type-predicate-pattern.md)
- [ADR-154: Separate Framework from Consumer](154-separate-framework-from-consumer.md)
- [ADR-155: Decompose at the Tension](155-decompose-at-the-tension.md)
- [ADR-156: Embed Widget HTML as Committed TypeScript Constant](156-embed-widget-html-at-build-time.md)
- [ADR-157: Multi-Source Open Education Knowledge Integration](157-multi-source-open-education-integration.md) ← **Proposed**
- [ADR-158: Multi-Layer Security Architecture and Application Rate Limiting](158-multi-layer-security-and-rate-limiting.md) ← **Superseded by [ADR-219](219-rate-limiting-is-an-edge-concern.md)**
- [ADR-159: Per-Workspace Vendor CLI Ownership with Repo-Tracked Configuration](159-per-workspace-vendor-cli-ownership.md)
- [ADR-160: Non-Bypassable Redaction Barrier as Principle](160-non-bypassable-redaction-barrier-as-principle.md) (supersedes ADR-143 §6 in part)
- [ADR-161: Network-Free PR-Check CI Boundary](161-network-free-pr-check-ci-boundary.md)
- [ADR-162: Observability-First — Every Capability Emits Across Five Axes](162-observability-first.md) ← **Proposed** (extends ADR-143; acceptance gated on Phase 5 of the observability strategy restructure)
- [ADR-163: Sentry Release Identifier, Source-Map Attachment, and Vercel Production Attribution](163-sentry-release-identifier-and-vercel-production-attribution.md) (operationalises L-7 release/deploy linkage; Accepted 2026-04-19; amended 2026-04-20, 2026-04-21, 2026-04-23, 2026-04-24 §1+§10, 2026-04-24 §10 retraction — see History block)
- [ADR-164: Config-Load Side Effects Must Not Require Test-Execution Resources](164-config-load-side-effects.md) (vitest/ESLint/Prettier configs must not throw at module-evaluation time on missing test-time credentials; Accepted 2026-04-26)
- [ADR-165: Agent Work Practice Phenotype Boundary](165-agent-work-practice-phenotype-boundary.md) (local implementation boundary for PDR-035 agent-work Practice authority; Accepted 2026-04-28)
- [ADR-166: Architectural Budget System Across Scales](166-architectural-budget-system-across-scales.md)
  (cross-scale architectural bounds, visibility-before-enforcement, and
  anti-gaming doctrine; Accepted 2026-04-29)
- [ADR-167: Hook Execution Failures Must Be Observable](167-hook-execution-failures-must-be-observable.md)
  (non-blocking agentic-platform hooks must route through a logging
  wrapper that persists non-zero exits to a developer-readable file;
  host-specific Claude Code reference instance with platform-portable
  generalisation named under Future Work; Accepted 2026-04-29)
- [ADR-168: TypeScript 6 Baseline and Workspace-Script Architectural Rules](168-typescript-6-baseline-and-workspace-script-architectural-rules.md)
  (TS6 compiler-options baseline, ban on workspace-to-root scripts,
  all-TS-scripts rule with the `runtime-only-scripts/` directory
  exception for no-compile-no-deps cases; Accepted 2026-04-29)
- [ADR-169: Pin GitHub Actions to Maintainer-`/releases/latest` SHA](169-pin-github-actions-to-maintainer-latest-sha.md)
  (host adoption of PDR-040; staged enforcement via convention now
  and validator + Dependabot config later via the
  build-pipeline-composition-safeguards future plan; Accepted
  2026-04-30)
- [ADR-172: Rush-Impulse Three Structural Cues Adoption](172-rush-impulse-three-structural-cues-adoption.md)
  (host adoption of PDR-043 rush-impulse-three-structural-cues;
  lands cues 2 and 3 in principles.md alongside the existing
  vocabulary trip-list as a cohesive output-time defence;
  Accepted 2026-05-03)
- [ADR-173: Graph Stack Topology — Standards-First, Layered, MCP-Agnostic](173-graph-stack-topology.md)
  (eight-workspace graph topology — seven active plus one deferred —
  with RDF 1.2-native internals, standards-based wire projection,
  build-vs-buy attestation per library, and standards-evolution
  tripwires; Accepted 2026-05-11)
- [ADR-174: Dependency Vulnerability Scanning as a Quality Gate](174-dependency-vulnerability-scanning-quality-gate.md)
  (dependency vulnerability triage, blocking/disposition policy,
  Dependabot/override governance, and relationship to quality gates;
  Accepted 2026-05-10)
- [ADR-176: Commit-Skill Advisory Orchestrator Naming](176-commit-skill-advisory-orchestrator-naming.md)
  (commit-skill remains advisory, stages by explicit pathspec, and treats
  commit queue / index facts as coordination signals; Accepted 2026-05-11)
- [ADR-177: Asymmetric-Cure Enforcement for Staging](177-asymmetric-cure-enforcement-in-staging.md)
  (`git commit -- <pathspec>` may cure unstaged noise outside the intended
  bundle, but must not hide defects inside the staged boundary; Accepted
  2026-05-11)
- [ADR-178: Agent-Tools Build Isolation](178-agent-tools-build-isolation.md)
  (`agent-tools` is consumed as built `dist/`, not via hidden source-on-each-
  invocation runtime compilation; Accepted 2026-05-11)
- [ADR-179: Transport-Agnostic Graph Substrate — Surfacing Is A Consumer-Side Concern](179-transport-agnostic-graph-substrate.md)
  (transport-discipline corollary of ADR-154 applied across the graph
  stack: substrate ships no MCP/HTTP/CLI/transport-shaped code;
  at-most-one-home per consumer surface; extracted from ADR-173 on
  2026-05-11; Accepted 2026-05-11)
- [ADR-180: Codex-Exec Agent Delegation Pattern](180-codex-exec-agent-delegation-pattern.md)
  (`codex exec` is the preferred scripted delegation surface; `read-only` is
  the default sandbox; Accepted 2026-05-12)
- [ADR-181: Agent Team Start Ritual and Action-Trace Surface](181-agent-team-start-and-action-log.md)
  (`start-right-team`, emergent temporary responsibilities, team handoff
  routing, and future action-trace event surface; Proposed)
- [ADR-182: Mid-Cycle Handoff Record Substrate](182-mid-cycle-handoff-record-substrate.md)
  (handoff records, `handoff_record_path`, and `mid-cycle-handoff`
  directed-message value for token-bounded handoff; Proposed)
- [ADR-183: Comms-Event Tag Namespace Substrate](183-comms-event-tag-namespace-substrate.md)
  (`tags` field on comms events, initial failure-mode / behaviour-note
  namespace, and watcher tag-token rendering; Accepted 2026-05-22)
- [ADR-184: Comms-Event Sync Kind and Urgency Field](184-comms-event-sync-kind-and-urgency-field.md)
  (two-axis separation: `sync` as interaction shape and `urgency` as
  response priority; Proposed 2026-05-23)
- [ADR-185: Comms-Event Auto-Acceptance Metadata](185-comms-event-auto-acceptance-metadata.md)
  (structured impact / size / risk metadata for deterministic
  auto-acceptance of mechanically verifiable comms-event changes;
  Proposed 2026-05-23)
- [ADR-186: Comms-Event Heartbeat Lifecycle Substrate](186-comms-event-heartbeat-lifecycle-substrate.md)
  (repo-bound phenotype for PDR-078's portable liveness-heartbeat
  contract: `lifecycle` event kind with `event_type='heartbeat'`,
  tolerate-unknown-event-type render rule, `[HEARTBEAT]` token via
  ADR-183 tag composition; Accepted 2026-05-24; amended 2026-08-02 —
  migration executed: implemented-superset dual filter,
  tag-retained-until-closure discipline, closure list retargeted)
- [ADR-187: Claude Self-Modification Authorisation Cure-Shape](187-claude-self-modification-authorisation-cure-shape.md)
  (WS-8 ratification: C2-near-term + C5-long-term + C4-fallback
  combination with C2/C5 platform-deferred triggers; C1 + C3
  rejected; C4 operative-in-effect-now; 4 named re-ratification
  triggers; platform-engagement vehicle as named owner-action;
  Accepted 2026-05-25)
- [ADR-189: Audience-Led Agent Capability Taxonomy](189-audience-led-agent-capability-taxonomy.md)
  (three audience-led categories — repo-working skills, Oak
  developer capabilities, curriculum assistance capabilities —
  with `SKILL.md`/MCP/plugin treated as packaging or runtime
  mechanisms, never the category name; Accepted 2026-06-03)
- [ADR-190: Heartbeat-Cron Health Monitoring via Watcher-Staleness Substrate](190-heartbeat-cron-health-monitoring-via-watcher-staleness.md)
  (sibling to ADR-186: the heartbeat cron writes a per-tick staleness file via
  the existing watcher-staleness substrate so retirement-detection composes
  comms-silence AND staleness-file-age, suppressing false-positive retirement on
  a cron-degraded-but-alive agent; `ping-before-escalate` demoted to
  belt-and-braces; Proposed 2026-06-04)
- [ADR-191: Deterministic Data Surface; the Agent Is the Only Reasoner](191-deterministic-data-surface-agent-reasons.md)
  (promotes the EEF plan's Decision 10 to a repo-wide principle: the MCP server
  surfaces deterministic projections of known data; relevance, ranking, scoring,
  and situation→item mapping belong to the consuming agent; no server-side
  scoring formula, recommendation engine, or request-time crosswalk — a
  formal-ontology data crosswalk is out of scope, not forbidden; Accepted
  2026-06-05)
- [ADR-192: Feature-Flag Three-Stage Lifecycle](192-feature-flag-three-stage-lifecycle.md)
  (records the convention for env-var feature flags: pre-release defaults off
  and explicit true enables; release-pre-proof defaults on with an explicit-false
  kill-switch and goes live on merge; release-post-proof removes the flag after
  the value proof passes; Accepted 2026-06-06)
- [ADR-193: System–Vendor Type Boundary — Strict Domain Types, Vendor Types at the Membrane](193-system-vendor-type-boundary-membrane.md)
  (the outgoing mirror of ADR-032: strict domain types hold from the `as const`
  corpus through validation to a per-primitive egress membrane; the vendor's
  loose types — e.g. MCP `CallToolResult.structuredContent: Record<string, unknown>` —
  are the external contract, confined to egress functions, never inside domain
  code; transport code legitimately speaks the vendor type; strict types serve
  internal DX and cross an external junction only for significant clear value;
  Accepted 2026-06-08)
- [ADR-194: Teacher-as-Expert Product Boundary](194-teacher-as-expert-product-boundary.md)
  (the product principle that ADR-191 is the engineering corollary of: Oak's
  curriculum and evidence surfaces inform teachers with information, resources, and
  evidence and may present evidenced options and trade-offs, but never make the
  pedagogical decision that belongs to the teacher; the teacher is the pedagogical
  expert and the authority on what should happen; Accepted
  2026-06-09)
- [ADR-195: Graph Tools Are a First-Class Tool Category](195-graph-tools-first-class-tool-category.md)
  (graph tools are a distinct MCP tool category: anchored, bounded queries on the
  one-graph corpus; complete-within-itself subgraphs, contiguous or sparse;
  navigable links; dual-content responses (`formatToolResponse`: summary +
  serialised-JSON content blocks plus `structuredContent` — superseding the
  original structuredContent-only clause, owner 2026-06-11); the corpus is smart
  and the tool is a thin deterministic formatter; fixed canonical data is
  authority — durable shapes derive from the corpus; validated by the EEF
  rebuild and the executed Track-G redesign; Accepted 2026-06-11)
- [ADR-196: Graph Substrate Migration — One Replacement Unit per Tool](196-graph-substrate-migration-one-unit-per-tool.md)
  (per migrated tool, the data/type re-emission, the rewrite onto the graph
  corpus substrate, and the projection-derived schema land together as one
  replacement unit; a tool's schema arrives when the tool is built or rebuilt,
  never before; existing tools are untouched before their migration; executed
  and validated in full via Track-G; Accepted 2026-06-11)
- [ADR-197: Coordination-Home Checkout Owns Shared Registry State](197-coordination-home-owns-registry-state.md)
  (exactly one checkout — the Director-owned coordination home — owns all shared
  collaboration-registry state; implementer worktrees produce pure-diff feature
  PRs by construction; cross-PR registry conflicts resolve to main's version,
  never the branch's; trial-validated with five concurrent-window PRs and zero
  registry conflicts; Accepted 2026-06-11)
- [ADR-198: Naming-Schema Versioning with a Digest-Pinned Registry](198-naming-schema-versioning-digest-pinned-registry.md)
  (agent display names derive through registered, versioned schema eras with
  digest-pinned wordlist material — edits without a version bump fail the
  tree, so material freezes at activation; old eras stay registered and
  reproducible; the identity tuple records optional `naming_schema_version`
  provenance with absence reading as v1; the UUID v5 id and
  `session_id_prefix` are deliberately untouched; the active v2 era renders
  noun–verb–noun micro-sentences with a lowercase middle word; Accepted
  2026-06-11)
- [ADR-199: Comms-Event Rotation Phenotype — Class-Tiered Archive-Move](199-comms-event-rotation-phenotype.md)
  (the repo phenotype of PDR-094: comms events rotate by a class-tiered,
  age-triggered, archive-move curator pass — heartbeats shortest-retention after
  an aggregate is extracted, research-precious held until graduated; cited-event
  provenance survives via inline excerpts / a tracked digest enforced by a
  pre-archive-move check; the watcher-health justification is honestly a
  hypothesis, the windows hygiene targets; design Accepted 2026-06-13, execution
  deferred to WS7)
- [ADR-200: Intent as a living idea knowledge-graph — graph-authoritative, dual embodiment, frontmatter connection](200-intent-as-a-living-idea-graph.md)
  (ideas are the fundamental unit of intent; the idea knowledge-graph is the authoritative source of truth,
  the human documents its co-equal embodiment connected by frontmatter typed-edges; built as a domain
  instance over graph-core; two drift mechanisms; the planning-estate rewrite; Accepted 2026-06-22)
  ← **Partially superseded by [ADR-221](221-estate-knowledge-graph.md) (authority model, 2026-07-31)**
- [ADR-201: External systems as evidence edges — integrating external state into the idea knowledge-graph](201-external-systems-evidence-integration.md)
  (external systems are typed evidence edges and the graph stays canonical; direction invariant — intent
  projects outward, services report back; capability modes + supervision + no-PII-in-VCS; unlocks the full
  self-measuring-delivery value on top of the substrate; Proposed 2026-06-22, gated on the substrate)
- [ADR-202: Orientation as one intent-discerning lens](202-orientation-as-one-intent-discerning-lens.md)
  (the repo-bound orientation surface is one lens, not mode-specific skills; delivery mode — specific answer /
  area overview / guided tour — is a discerned variable, not a skill boundary; setup is a distinct
  side-effecting capability, never an information mode; PDR-112 seam and primer unchanged, PDR-112 not
  amended; Accepted 2026-06-23)
- [ADR-203: State-Tier Process-and-Archive-Move](203-state-tier-process-and-archive-move.md)
  (generalises ADR-199's class-tiered process-then-archive-move discipline to the other
  collaboration-state tiers — conversations, sidebars, escalations, handoffs; conserve substance into
  canonical homes before archive-moving, never `git rm` untracked state; Accepted 2026-06-23, amended
  2026-06-27 for tier-classification accuracy — instance tier vs tracked repo tier)
- [ADR-204: Merge-Gate Strategy — Require Branches Up To Date, Not a Merge Queue](204-merge-gate-strategy-require-up-to-date-not-merge-queue.md)
  (prevent semantic merge-skew with require-branches-up-to-date rather than a merge queue; the queue is
  incompatible with default-setup CodeQL (codeql-action#1537), app-based SonarCloud, and Vercel's Git
  integration, and the fixes conflict with ADR-161; Accepted 2026-06-26)
- [ADR-205: Classifying MCP resources as public — the per-resource allowlist pattern](205-public-resource-classification-pattern.md)
  (MCP authorization is server/transport-level, so per-resource public-vs-protected is an Oak
  application-level classification, not an MCP mechanism; the rule — static/public-reference content with
  no user or sensitive data is public, else authenticated — plus an app-local-resource extension
  generalise ADR-057; classifies the Oak: Under the Hood orientation pointer public; Accepted 2026-06-27)
- [ADR-207: DORA delivery metrics as a structural property of the intent graph](207-dora-delivery-metrics-as-a-structural-property.md)
  (the DORA delivery metrics fall out of the intent graph as generated projections, not a bolted-on
  dashboard, for the two products — the MCP app (literal DORA) and the Practice / FRAME framework
  (DORA-shaped; shape, not calibrated bands); planned-vs-rework attribution is a graph traversal via
  `serves_strategic_choice` + `kind` + `disposition`; the seven DORA AI-capabilities as leading
  indicators; design constraint Accepted, the build gated downstream to ADR-201; builds on ADR-200 and
  ADR-201; owner-directed 2026-06-21, recorded 2026-06-28)
- [ADR-208: Not specifying a target architecture in SonarQube at this time](208-no-target-architecture-in-sonarqube.md)
  (the ESLint boundary rules plus the ADR corpus are the architectural source of truth, enforced at import
  precision in CI; SonarQube's intended architecture is UI-only to author with no as-code/API/MCP write path
  (the as-code path was deprecated for removal Jan 2026), so authoring it would create a coarser,
  drift-prone second source of truth; we decline the authored model but adopt the read-only half —
  current-architecture map, tangle detection, Context Augmentation (both add-ons are enabled for our org) —
  as an additive check; relates to ADR-040; owner-directed, Accepted 2026-06-28)
- [ADR-209: Planning vocabulary — host instantiation](209-planning-vocabulary.md)
  (how this repo realises the portable planning vocabulary defined in PDR-121:
  collection/lane/plan/thread/roadmap/phase/workstream/cycle, and **programme** as a
  `*.programme.md` index plus a `programmes:` frontmatter edge; disambiguates the
  planning "programme" from the curriculum "programme"; mirrors PDR-121; relates to
  ADR-117 and ADR-200; owner-directed, Accepted 2026-06-28)
- [ADR-210: Comms write-path concept gate](210-comms-write-path-concept-gate.md)
  (the collaboration comms CLI runs every event body through the PDR-044 trip-lists before
  writing: SSOT-loaded from the hook policy, capture-tag recursive exclusion, Result-typed with
  one CLI throw boundary, teaching-payload refusals, fail-closed on a partial policy; widening
  the gated concept set is a governance act routed through the ADR; composes ADR-183;
  owner-ratified route, Accepted 2026-07-02, recorded 2026-07-06)
- [ADR-211: Inter-Practice collaboration — host phenotype](211-inter-practice-collaboration-host-phenotype.md)
  (this repo's concrete realisation of PDR-125: coordination-home declaration, join-key display,
  collaboration-state write path, conformance self-report, shared wire schema, and the runnable
  join ceremony; Accepted 2026-07-06, amended 2026-07-13)
- [ADR-212: Federated visibility authority and evidence boundaries](212-federated-visibility-authority-and-evidence-boundaries.md)
  (the repository remains the durable intent authority while Notion, Linear, GitHub, PostHog, and
  Sentry each serve one audience-shaped role; execution movement, delivery performance,
  operational health, usage/adoption, and value/impact evidence remain distinct; Accepted by owner
  direction 2026-07-13, recorded 2026-07-14; amended 2026-07-14)
- [ADR-213: Design-system integration and component-system architecture](213-design-system-integration-and-component-architecture.md)
  (the design system integrates as a first-class workspace and the estate's design source of
  truth — its CSS the token source with DTCG a generated projection, superseding ADR-148
  §Source Format in part; Claude Design is a first-class team surface with a bidirectional
  design-sync discipline; class-library-first consumption; Base UI default for new hard
  widgets with React Aria scoped to date/locale and Ark UI for non-React; an owned React
  component tier in a separate downstream binding package seeded from studio-source, the
  second-consumer trigger governing app-widget graduation into it; staged atomic
  token-source convergence;
  per-file-class licensing manifest for Oak marks; Proposed 2026-07-19; amended 2026-07-19
  §2 — overlay completeness model and colour-value grammar, evidence-driven; Accepted
  2026-07-20 by owner in-session ratification, with Stage A and the PR3 validation layer
  merged; amended 2026-07-23 §3/§4 — the owned component tier, and §4's graph corrected
  to ADR-041's sibling-inputs shape)
- [ADR-214: ARC-colour statusline infrastructure](214-arc-colour-statusline-infrastructure.md)
  (the ARC channel grammar is the canonical schema authority for the shared rapid-comms
  corpus; feather colour is a projection of recorded channel content; grammar obligations
  bind from the adoption date forward — channel history is append-only, never
  retro-edited — with a loud-failing validator whose blocking-gate wiring lands with the
  grammar; strictness preserves the protocol's zero-per-message-ceremony property;
  Proposed 2026-07-20, Decision items 3–4 amended 2026-07-20 per owner ruling)
- [ADR-215: Top-level `research/` surface for imported research records](215-top-level-research-surface.md)
  ← **Superseded by [ADR-226](226-agent-research-surface-for-imported-records.md)**
  (2026-08-30: the imported record relocated to
  `.agent/research/innovation-kit/web-app-deconstruction/` and the top-level surface
  retired with it)
- [ADR-216: The plan-node estate](216-plan-node-estate.md)
  (three node types — strategic, delivery, runbook — with born-sketch owner
  ratification and delivery state as a Linear projection; supersedes ADR-117's
  lifecycle lanes, promotion workflow, and component library; records the
  owner-ratified D23 estate structure whose validator and templates landed in
  PR #478; carries the dated ADR-200 relationship note — the living idea-graph
  is deferred, not deleted; Proposed born-sketch 2026-07-23)
- [ADR-217: Server-rendered HTML in the MCP app](217-server-rendered-html-in-the-mcp-app.md)
  (React rendered to static markup; the design system delivered as app-served
  static assets under a closure-tested manifest; served-surface claims derived
  at render time; optional affordances as declared flags whose machinery ships
  with their control; Accepted 2026-07-26)
- [ADR-218: PostHog MCP analytics identity, session, and privacy boundary](218-posthog-mcp-analytics-identity-session-and-privacy.md)
  (separates deterministic product-interaction analytics from Sentry
  diagnostics; defines the scoped pseudonymous actor, UUIDv7 call/event,
  no-current-session and no-conversation posture, closed content-free event
  envelope, minimal deletion-index Person, and October public-beta governance
  boundary; Accepted by owner direction 2026-07-26)
- [ADR-219: Rate limiting is an edge concern](219-rate-limiting-is-an-edge-concern.md)
  (volumetric control is owned at the Cloudflare/Vercel edge; the HTTP MCP
  server runs no in-process limiter; static-analysis findings are
  adjudicated against the actual architecture; supersedes ADR-158;
  Accepted 2026-07-30)
- [ADR-220: The comms-event threading edge spans every respondable kind](220-comms-event-threading-edge-across-kinds.md)
  (`in_response_to` is a substrate-wide optional affordance on every kind that
  can be a response — `narrative` and `directed` today, `sync` when ADR-184's
  kind lands; the edge is advisory and unvalidated, with write-time validation
  deferred behind ADR-199's archived-antecedent question, and unrendered, so the
  human-readable back-reference stays an authoring obligation; Accepted
  2026-07-30)
- [ADR-221: The Estate Knowledge Graph — files-authoritative, named-graph strata, concept scheme](221-estate-knowledge-graph.md)
  (the repo-stratum embodiment of PDR-134: authored files are authoritative and
  the graph is a derived, per-home-recomputable index; the quad's graph name is
  the public/operator seam with the clone test as a CI validator; PROV-O/SKOS/DC
  vocabularies; the concept scheme lands with link-as-annotation; refines
  ADR-200 (authority model) and ADR-216, amends ADR-173/ADR-041 by activation;
  Accepted, owner-ratified 2026-07-31)
- [ADR-222: Bulk schema contract — interim hand-truing, then full derivation from the upstream schema](222-bulk-schema-contract-interim-truing-then-derivation.md)
- [ADR-223: Perishable external-surface claims carry risk-based freshness metadata](223-perishable-claims-carry-risk-based-freshness-metadata.md)
- [ADR-224: Restricted-lesson exclusion is a documented, configurable switch](224-restricted-lesson-exclusion-configurable-switch.md)
- [ADR-225: Adopt provider-independent capability composition for runtime services](225-provider-independent-capability-contracts.md) ← **Proposed**
- [ADR-226: `.agent/research/` as the research surface for imported records](226-agent-research-surface-for-imported-records.md)
  (Accepted 2026-08-31; supersedes ADR-215: records enter as faithful public projections —
  byte-preserved documents, publication presumption with owner-directed withholding,
  private-permalink reduction with a private-source index, self-contained records, and
  leaf-package-only workspace registration)

## Key Architectural Decisions

For understanding our API integration approach:

- **[ADR-029](029-no-manual-api-data.md)** - No manual API data structures in MCP
- **[ADR-030](030-sdk-single-source-truth.md)** - SDK as single source of truth for API contracts
- **[ADR-141](141-mcp-apps-standard-primary.md)** - MCP Apps standard as the only UI surface (supersedes ChatGPT-specific coupling)
- **[ADR-157](157-multi-source-open-education-integration.md)** - Proposed multi-source open education knowledge integration across API, ontology, EEF, MCP, and graph surfaces
- **[ADR-194](194-teacher-as-expert-product-boundary.md)** - Teacher-as-expert product boundary: surfaces inform teachers and may present evidenced options and trade-offs, but never make the pedagogical decision that belongs to the teacher; the teacher is the pedagogical expert and the authority on what should happen; the product principle that ADR-191 is the engineering corollary of
- **[ADR-066](066-sdk-response-caching.md)** - SDK response caching with Redis
- **[ADR-070](070-sdk-rate-limiting-and-retry.md)** - SDK rate limiting and exponential backoff retry
- **[ADR-063](063-sdk-domain-synonyms-source-of-truth.md)** - SDK as single source of truth for domain synonyms
- **[ADR-064](064-elasticsearch-mapping-organization.md)** - Elasticsearch index mapping organization
- **[ADR-108](108-sdk-workspace-decomposition.md)** - SDK workspace decomposition (generic/Oak x sdk-codegen/runtime)
- **[ADR-154](154-separate-framework-from-consumer.md)** - Separate framework from consumer: reusable mechanism vs Oak-specific instance, enforced through workspace topology
- **[ADR-155](155-decompose-at-the-tension.md)** - Decompose at the tension: classification resistance signals hidden coupling, decompose at the fault line
- **[ADR-225](225-provider-independent-capability-contracts.md)** - Proposed adoption of provider-independent capability composition: adapter-tier placement, PostgreSQL/Neon separation, and an exercised independent composition for every selected provider
- **[ADR-132](132-sitemap-scanner-for-canonical-url-validation.md)** - Sitemap scanner and reference-map validation for canonical URL generation

For understanding authentication, authorization, and observability:

- **[ADR-052](052-oauth-2.1-for-mcp-http-authentication.md)** - OAuth 2.1 for MCP HTTP server authentication
- **[ADR-053](053-clerk-as-identity-provider.md)** - Clerk as Identity Provider and Authorization Server
- **[ADR-115](115-proxy-oauth-as-for-cursor.md)** - Proxy OAuth AS for Cursor compatibility (transparent passthrough to Clerk; amended 2026-07-26 — transparency scoped against advertised-AS request validation)
- **[ADR-143](143-coherent-structured-fan-out-for-observability.md)** - Coherent structured fan-out for the Sentry and OpenTelemetry foundation (§6 superseded in part by ADR-160)
- **[ADR-158](158-multi-layer-security-and-rate-limiting.md)** - Multi-layer security architecture and application rate limiting ← **Superseded by [ADR-219](219-rate-limiting-is-an-edge-concern.md)**
- **[ADR-219](219-rate-limiting-is-an-edge-concern.md)** - Rate limiting is an edge concern
- **[ADR-159](159-per-workspace-vendor-cli-ownership.md)** - Per-workspace vendor CLI ownership with repo-tracked configuration (formalises the Sentry CLI adoption pattern; applies to all future vendor CLIs)
- **[ADR-160](160-non-bypassable-redaction-barrier-as-principle.md)** - Non-bypassable redaction barrier as principle (generalises ADR-143 §6 from enumerated list to closure property + test gate; covers every current and future fan-out path)
- **[ADR-161](161-network-free-pr-check-ci-boundary.md)** - Network-free PR-check CI boundary (PR-check CI runs unit + integration + E2E without network; Vercel deploy and smoke tests own network-capable work)
- **[ADR-174](174-dependency-vulnerability-scanning-quality-gate.md)** - Dependency vulnerability scanning as a quality gate policy (implementation wiring still belongs in ADR-121/build docs)
- **[ADR-051](051-opentelemetry-compliant-logging.md)** - OpenTelemetry-compliant single-line JSON logging (supersedes ADR-017)
- **[ADR-033](033-centralised-log-level-configuration.md)** - Centralised log level configuration

For understanding the agentic engineering practice:

- **[ADR-114](114-layered-sub-agent-prompt-composition-architecture.md)** - Layered prompt composition architecture (components -> templates -> wrappers)
- **[ADR-216](216-plan-node-estate.md)** - The plan-node estate: three node types, born-sketch ratification, Linear-projected delivery state (supersedes ADR-117)
- **[ADR-119](119-agentic-engineering-practice.md)** - Practice naming, boundary, three-layer model, and self-teaching property
- **[ADR-124](124-practice-propagation-model.md)** - Practice propagation: five-file package, self-containment, practice-index bridge
- **[ADR-125](125-agent-artefact-portability.md)** - Agent artefact portability: canonical `.agent/` source plus thin platform adapters; commands retired into skills by PDR-051
- **[ADR-129](129-domain-specialist-capability-pattern.md)** - Domain specialist capability pattern: unified `*-expert` model with situational invocation
- **[ADR-137](137-specialist-operational-tooling-layer.md)** - Specialist operational tooling layer: optional live-system tooling for domain experts
- **[ADR-131](131-self-reinforcing-improvement-loop.md)** - Self-reinforcing improvement loop: knowledge flow, consolidation hub, self-referential governance, inter-repo propagation
- **[ADR-135](135-agent-classification-taxonomy.md)** - Agent classification taxonomy: domain_expert, process_executor, specialist; operational modes; Practice domain trio
- **[ADR-144](144-two-threshold-fitness-model.md)** - Three-zone fitness model: `healthy` / `soft` / `hard` / `critical` graduated scale with `CRITICAL_RATIO = 1.5`; `critical` is a loop-failure signal requiring a three-question post-mortem (§Loop Health)
- **[ADR-146](146-assumptions-expert-meta-level-plan-assessment.md)** - Assumptions expert: independent proportionality and plan-assumption challenge with an inverted doctrine hierarchy
- **[ADR-150](150-continuity-surfaces-session-handoff-and-surprise-pipeline.md)** - Continuity surfaces, session close through `wrap` with its lightweight `session-handoff` component (amended 2026-07-28), conditional deep consolidation, and the surprise pipeline
- **[ADR-181](181-agent-team-start-and-action-log.md)** - Proposed team start ritual, emergent temporary responsibilities, and future action-trace surface
- **[ADR-147](147-browser-accessibility-as-blocking-quality-gate.md)** - Browser accessibility as a 9th blocking quality gate: WCAG 2.2 AA, Playwright + axe-core, two-level MCP App testing
- **[ADR-148](148-design-token-architecture.md)** - Design token architecture: DTCG JSON source, three-tier model, CSS custom properties output, `packages/design/` location (§Source Format superseded in part by ADR-213)
- **[ADR-149](149-frontend-specialist-expert-gateway-cluster.md)** - Frontend specialist expert gateway cluster: accessibility-expert, design-system-expert, react-component-expert cohort with MCP boundary rule
- **[ADR-151](151-mcp-app-styling-independence.md)** - MCP App styling independence: CSS custom properties over styled-components, self-contained HTML resources, host theme composition
- **[ADR-217](217-server-rendered-html-in-the-mcp-app.md)** - Server-rendered HTML in the MCP app: React static markup, design system as app-served assets under a closure-tested manifest, derived served-surface claims, flagged affordances whose machinery ships with their control
- **[ADR-165](165-agent-work-practice-phenotype-boundary.md)** - Agent work Practice phenotype boundary: local implementation surfaces for PDR-035 agent-work authority

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

- **ADR-020 (`../../archive/architecture/architectural-decisions/020-biological-architecture.md`)** - Current biological architecture with Greek nomenclature
- **[ADR-018](018-complete-biological-architecture.md)** - Evolution to complete biological model
- **[ADR-009](009-mathematical-foundation-for-architecture.md)** - Mathematical grounding from complex systems theory
- **[ADR-006](006-cellular-architecture-pattern.md)** - Original cellular architecture inspiration

## About ADRs

Architecture Decision Records (ADRs) are the **graduation target** of the
learning loop. When captured experience settles into a permanent
architectural decision, it becomes an ADR. ADRs are the architectural
source of truth: they record _why_ the system is shaped as it is, not
just what it does. Rules and directives operationalise ADRs; code
implements them; quality gates enforce them. Custom ESLint rules can
encode ADR constraints as automated enforcement — graduating knowledge
into quality gates.

### Template

```markdown
# ADR-{NNN}: {Title}

**Status**: Proposed | Accepted | Superseded by ADR-{NNN} | Deprecated
**Date**: {YYYY-MM-DD}
**Related**: [ADR-{NNN}]({filename}) — {relationship}

## Context

{What situation or problem prompted this decision? What constraints
apply? What prior decisions does this build on?}

## Decision

{What was decided and why. Be specific enough that an agent or
engineer can determine whether code complies.}

## Consequences

{What follows from this decision — positive, negative, and neutral.
Include migration impact if replacing a prior approach.}
```

### Lifecycle

- **Proposed**: under discussion, not yet binding.
- **Accepted**: binding. Code, rules, and quality gates must comply.
  _Decided is not the same as validated_: an Accepted ADR may still have
  deferred implementation or a `Candidate` paired-PDR. Record that maturity gap
  explicitly (e.g. "acceptance gated on Phase N", a Future Work section) rather
  than silently reading Accepted as fully shipped — and do not downgrade a
  decided ADR to Proposed merely because implementation lags. Validation
  maturity is a separate, explicitly-recorded axis, not a status downgrade.
- **Superseded**: replaced by a newer ADR. Keep the file; update status
  and link to the successor.
- **Deprecated**: no longer applicable (e.g. workspace removed).
- **Withdrawn**: created and then removed entirely because the decision
  should not have existed — distinct from Superseded and Deprecated,
  which keep the file and only update its status. The record file is
  deleted; the number is retired and never reused, so a gap in the ADR
  sequence indicates a withdrawal. The withdrawal and its rationale are
  recoverable from version control; no tombstone is kept in this index.

### Creating an ADR

ADRs are created when a decision is significant enough to shape future
work. The consolidation workflow checks whether completed work produced
decisions that should be recorded. Number sequentially from the highest
existing ADR. Add the new entry to the Index above.
