# High-Level Plan

**Last Updated**: 2025-12-14  
**Scope**: Strategic overview. Details are in individual plan documents.

**Recent Changes (2025-12-14)**:

- Type Discipline Restoration (Phases 1-4 complete) - see `quality-and-maintainability/refactor-plan-logger-object-di.md`
- Deleted 3 unused packages: `mcp-transport`, `mcp-storage`, `mcp-providers-node` (workspace count: 14 → 11)
- Created ADR-078 for DI testability patterns
- Archived completed SDK/MCP plans (00, 01, 05, 07, 08a, 09)
- Updated foundation documents with DI guidance

**Previous Changes (2025-11-11)**:

- Semantic Search plans reorganized and consolidated
- Schema-first migration and ontology integration fully planned
- Planning documents moved to clear structure: overview, search-service, search-ui
- Completed Phase 1 work archived
- MCP enhancement plans consolidated into comprehensive three-phase plan
- Plans reorganized into topical subdirectories (dev-tooling-and-dev-ai-support, openai-app, external, mcp-enhancements, etc.)

## Current Priorities (2025-12-14)

**Active Work**:

1. **Type Discipline Restoration** - Quality gates passing, Phase 5 (global state DI) deferred
2. **Semantic Search** - Implementation in progress
3. **Widget Enhancements** - Universal renderers, knowledge graph SVG

**Future Work**: Ontology Resource, OAuth/Clerk, Advanced MCP Tooling (deferred until foundations complete)

---

## Active / Planned (Priority Order)

1. **Semantic Search: Schema-First Migration + Ontology Integration** — Status: 🟡 PLANNING COMPLETE → IMPLEMENTATION STARTING (Priority 1)
   - Plans:
     - Overview: `.agent/plans/semantic-search/semantic-search-overview.md`
     - Backend: `.agent/plans/semantic-search/search-service/schema-first-ontology-implementation.md`
     - Frontend: `.agent/plans/semantic-search/search-ui/frontend-implementation.md`
     - Archive: `.agent/plans/semantic-search/archive/` (completed Phase 1 work)
   - Current Status: Planning documents consolidated; all phases defined with clear sessions; ready for implementation
   - Scope: Migrate all search schemas to type-gen (SDK generation); add ontology fields (threads, programme factors, unit types, content guidance, lesson components)
   - Phase 1 (2-3 weeks): Schema-first migration - move ~2,000 LOC of runtime schemas to type-gen
   - Phase 2 (2-3 weeks): Core ontology - threads search scope, programme factor filtering
   - Phase 3 (2-3 weeks): Ontology enrichment - unit type classification, structured content guidance, component availability
   - Prerequisites: ✅ Curriculum ontology documented, ✅ Cardinal rule defined, ✅ Testing strategy documented
   - Acceptance: All schemas generated at type-gen time; thread filtering operational; programme factor filtering operational; quality gates pass; comprehensive test coverage

2. **Curriculum Ontology MCP Resource** — Status: Planned (Priority 2 - ACTIVE)
   - Plan: `.agent/plans/sdk-and-mcp-enhancements/curriculum-ontology-resource-plan.md`
   - Prerequisite: Sprint 0 (Aggregated tools refactor) — see `.agent/plans/sdk-and-mcp-enhancements/comprehensive-mcp-enhancement-plan.md` Phase 0
   - Scope: Schema-derived ontology (type-gen) + educational guidance (hand-authored); exposed as MCP resources; TDD throughout
   - Current State: NOT STARTED (aggregated tools still hand-written runtime code)
   - Enables: OpenAI App SDK by providing curriculum structure knowledge; advanced MCP tools
   - Acceptance: Resources accessible via MCP; schema extraction during `pnpm type-gen` succeeds; ontology includes entities/relationships/tool workflows; all tests pass

3. **OAuth 2.1 / Clerk Integration** — Status: Planned (Priority 3 - ACTIVE)
   - Plan: `.agent/plans/mcp-oauth-implementation-plan.md`
   - Scope: Replace local demo OAuth AS with Clerk production AS; use `@clerk/mcp-tools` helpers; Google SSO for @thenational.academy
   - Current State: Clerk AS is live with metadata endpoints, auth middleware, and smoke/e2e coverage; remote and local smoke passes with auth bypass, while authenticated smoke awaits M2M bearer support.
   - Acceptance: Clerk AS integrated; Google SSO working; static tokens removed from production; service-token powered smoke assertions in CI; manual browser trace documented; runbook updated.

4. **OpenAI Apps SDK Integration (Non-UI)** — Status: Planned (Priority 4)
   - Plan: `.agent/plans/openai-app/oak-openai-app-plan.md`
   - Prerequisites: Items #1 (semantic search), #2 (ontology resource)
   - Scope: Metadata optimization for ChatGPT Developer Mode; fix STDIO bug; add MCP annotations; expose outputSchema; add tool titles; create golden prompt test suite
   - Related: `.agent/plans/external/upstream-api-metadata-wishlist.md` (wishlist for API team)
   - Acceptance: Tools discoverable in ChatGPT; descriptions rich and accurate; ≥90% tool selection accuracy; negative prompts avoid our tools

5. **Semantic Search MCP Integration** — Status: Planned (Priority 5 - DEFERRED)
   - Scope: Add semantic search to type-gen-generated `search` MCP tool; compose with curriculum data + semantic search APIs
   - Prerequisites: Item #1 (semantic search schema-first migration complete), Item #2 (ontology + aggregated tools refactor)
   - Architecture: Semantic search integration defined in type-gen configuration; generated at `pnpm type-gen` time
   - Note: Deferred until Item #1 (all 3 phases) and Item #2 complete
   - Acceptance: Generated `search` tool composes curriculum + semantic search APIs; E2E tests (no network) pass; documentation updated

6. **MCP Enhancements (Comprehensive)** — Status: FUTURE (Priority 6 - DEFERRED)
   - Plan: `.agent/plans/sdk-and-mcp-enhancements/comprehensive-mcp-enhancement-plan.md` (combines 3 previous plans)
   - Prerequisites: Items #1-3 (semantic search, ontology, OAuth) MUST complete first
   - Scope: Three phases:
     - Phase 0: Aggregated tools type-gen refactor (prerequisite for ontology work)
     - Phase 1: MCP infrastructure hardening (rate limiting, auth, descriptor-first architecture)
     - Phase 2: Advanced MCP tools (bulk operations, intelligent filtering, comparative analysis, export capabilities)
   - Current State: NOT STARTED (prerequisites not met)
   - Note: Consolidates and supersedes previous plans: `.agent/plans/archive/mcp-aggregated-tools-type-gen-refactor-plan.md`, `.agent/plans/archive/mcp-enhancements-plan.md`, `.agent/plans/archive/advanced-mcp-tools-plan.md`
   - Note: Also consolidates with `.agent/plans/curriculum-tools-guidance-playbooks-plan.md` (Phase 1 complete, rest deferred/overlaps with Phase 2)
   - Acceptance: All phases complete; advanced tools generated at type-gen time; schema-first architecture maintained; comprehensive test coverage

7. **Contract Testing with API Schema Evolution** — Status: Planned
   - Plan: `.agent/plans/dev-tooling-and-dev-ai-support/contract-testing-schema-evolution-plan.md`
   - Scope: Automated contract testing validates Cardinal Rule (schema evolution → `pnpm type-gen` → `pnpm build` → working artefacts)
   - Implementation: 7 synthetic scenarios; four-stage violation detection; `pnpm test:contract` harness
   - Acceptance: All scenarios pass; harness executes in ≤8 minutes; contribution guide validated; ADR published

8. **Separate SDK Type Generation from Runtime** — Status: Planned
   - Plan: `.agent/plans/dev-tooling-and-dev-ai-support/sdk-workspace-separation-plan.md`
   - Scope: Split into `oak-curriculum-sdk-generation` (types/validators/tools) and `oak-curriculum-sdk-runtime` (client)
   - Enables: Item #10 (OpenAPI-to-MCP Framework Extraction)
   - Acceptance: Two workspaces; clean public API boundaries; zero consumer impact; Schema-First Execution Directive maintained

9. **Enhance MCP Tools/Resources/Prompts** — Status: Planned
   - Scope: Leverage MCP resources and prompts beyond tools; reclassify some tools as resources where appropriate
   - Related: Item #2 (ontology as resource); <https://modelcontextprotocol.io/docs/learn/server-concepts>
   - Note: Partially covered by ontology resource (Item #2) and advanced tools (Item #6)
   - Acceptance: Resources/prompts exposed; E2E tests pass

10. **OpenAPI-to-MCP Framework Extraction** — Status: Blocked (prerequisite: #8)
    - Plan: `.agent/plans/replacing_openapi_ts_and_openapi_zod_client/openapi-to-mcp-framework-extraction-plan.md`
    - Prerequisite: Item #8 (SDK workspace separation)
    - Scope: Extract type-gen into general-purpose `@oaknational/openapi-mcp-framework`; make Oak SDK a consumer
    - Acceptance: Framework generates SDK + servers for Oak + two reference specs; quality gates pass; onboarding < 4 hours

## Backlog / Tidy-ups

- **Logging standardisation** — Adopt the shared `@oaknational/mcp-logger` in `apps/oak-curriculum-mcp-streamable-http`, wire `LOG_LEVEL` through the central logger factory, and delete the bespoke logger once feature parity is reached.

## Completed

11. **Architectural Refinements** — Status: ✅ DONE
    - Plan: Completed — see PR #16
    - Scope: DI-only wiring; documentation updates
    - Acceptance: Gates green; wiring modernized

12. **Remote Hosting Support (Streaming HTTP)** — Status: ✅ DONE
    - Plan: `.agent/plans/archive/remote-mcp-enablement-plan.md`
    - Scope: Enable Streaming HTTP (not SSE) for MCP servers; Vercel/Node hosting guidance
    - Acceptance: Streaming framing implemented; Vercel deploy documented and available for demos

13. **MCP Hardening** — Status: ✅ DONE
    - Plan: `.agent/plans/semantic-search/semantic-search-target-alignment-plan.md`
    - Scope: Delegate `/mcp` GET/POST to `StreamableHTTPServerTransport`; add transport/tool regression tests; verify compatibility with OpenAI Connector, Gemini, ElevenLabs
    - Acceptance: MCP server aligned with official spec; transport verified against target clients; regression suite in place

## Deferred / Won't Implement

14. **Semantic Search UI & Evidence** — Status: ⏸ Deferred (Priority 7)
    - Plan: `.agent/plans/semantic-search/snagging-resolution-ui-plan.md`
    - Scope: Resume Workstreams 4–8; refresh Playwright evidence; admin/status redesign
    - Note: Phase 1 UI already functional; this is polish/evidence work
    - Acceptance: UI tests pass; accessibility validated; visual evidence captured

15. **Serverless Hosting (Cloudflare Workers)** — Status: ⏸ Won't Implement For Now
    - Plan: `.agent/plans/icebox/serverless-hosting-plan.md`
    - Scope: Workers provider parity via contract tests; Wrangler deploy
    - Note: Streaming HTTP on Vercel/Node sufficient for current needs

## Milestones

- M1: Typed MCP tools available from SDK — ✅ DONE
- M2: Broad MCP platform compatibility — ✅ DONE
- M3: Remote Streaming HTTP live (Vercel) — ✅ DONE
- M4: Semantic Search Phase 1 — ✅ NEAR COMPLETE (Item #1, Priority 1)
- M5: Ontology Resource Implementation — 🔄 ACTIVE (Item #2, Priority 2)
- M6: OAuth/Clerk Integration — 🔄 ACTIVE (Item #3, Priority 3)
- M7: OpenAI Apps SDK Integration — Planned (Item #4, Priority 4)
- M8: Semantic Search MCP Integration — Planned (Item #5, Priority 5)
- M9: Advanced MCP Tools — ⏸ DEFERRED (Item #6, Priority 6 - after M5, M6, M7)
- M10: Contract Testing — Planned (Item #7)
- M11: SDK Workspace Separation — Planned (Item #8) - enables framework extraction
- M12: OpenAPI Framework — Blocked by M11 (Item #10) - general-purpose framework for any OpenAPI spec

## Priority Notes (2025-11-11)

**Current Focus**: Semantic search (finishing), ontology resource, OAuth integration are the immediate priorities. MCP enhancements are explicitly deferred until these foundational pieces are complete.

**Rationale**: The ontology resource and OAuth provide the infrastructure required for AI integration, while MCP enhancements build higher-level workflows on top of that infrastructure.

**Plan Organization (2025-11-11)**:

- **Consolidated MCP plans**: Combined 3 separate MCP plans into `.agent/plans/sdk-and-mcp-enhancements/comprehensive-mcp-enhancement-plan.md`:
  - Phase 0: Aggregated tools type-gen refactor (from `mcp-aggregated-tools-type-gen-refactor-plan.md`)
  - Phase 1: Infrastructure hardening (from `mcp-enhancements-plan.md`, expanded)
  - Phase 2: Advanced MCP tools (from `advanced-mcp-tools-plan.md`)
  - Original plans moved to `.agent/plans/archive/`
- **Reorganized plans** into topical subdirectories:
  - `sdk-and-mcp-enhancements/` - SDK/MCP tool/resource content improvements (what we generate)
  - `pipeline-enhancements/` - Type-gen pipeline improvements (how we generate)
  - `dev-tooling-and-dev-ai-support/` - Testing, tooling, and developer infrastructure
  - `openai-app/` - OpenAI Apps SDK integration
  - `observability/` - Logging, error tracking, monitoring
  - `external/` - External stakeholder documents (e.g., upstream API wishlist)
  - `semantic-search/` - Search service and UI (already well-organized)
- **Moved SDK/MCP content plans**:
  - `curriculum-tools-guidance-playbooks-plan.md` → `sdk-and-mcp-enhancements/`
  - `curriculum-ontology-resource-plan.md` → `sdk-and-mcp-enhancements/`
- **Expanded backlog items into proper plans**:
  - SDK/MCP publishing & versioning → `dev-tooling-and-dev-ai-support/sdk-publishing-and-versioning-plan.md`
  - Agent lifecycle automation → `dev-tooling-and-dev-ai-support/agent-lifecycle-automation-plan.md`
  - Advanced MCP server ideas → `icebox/advanced-mcp-server-ideas.md`
  - Original `backlog.md` and `backlog-analysis.md` → `archive/`
- **New developer experience enhancement**:
  - Pair programming coach agent → `dev-tooling-and-dev-ai-support/pair-programming-coach-agent-plan.md` (event-driven real-time coaching)
- **Context document moved**: `.agent/plans/curriculum-tools-guidance-playbooks-context.md` → `.agent/context/`
- **Plan cross-references updated** throughout high-level plan and PLAN_SUMMARY
