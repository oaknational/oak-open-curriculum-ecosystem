# High-Level Plan

**Last Updated**: 2025-10-28  
**Scope**: Strategic overview. Details are in individual plan documents.

## Current Priorities (2025-10-28)

**Active Work**:

1. Semantic Search (Phase 1 in progress)
2. Ontology Resource Implementation (planned)
3. OAuth/Clerk Integration (planned)

**Future Work**: 4. Advanced MCP Tooling (deferred until priorities 1-3 complete)

---

## Active / Planned (Priority Order)

1. **Semantic Search Phase 1** — Status: ✅ NEAR COMPLETE (Priority 1)
   - Plans: `.agent/plans/semantic-search/semantic-search-high-level-plan.md`, `.agent/plans/semantic-search/context.md`
   - Current: Status-aware response handling complete; quality gates green; remote verification passing; four indices live; search/nl/suggest endpoints operational; UI functional; admin telemetry working; zero-hit observability in place
   - Remaining: Documentation refresh, commit packaging
   - Acceptance: Four indices live; search/nl/suggest endpoints operational; UI functional; admin telemetry working; zero-hit observability in place

2. **Curriculum Ontology MCP Resource** — Status: Planned (Priority 2 - ACTIVE)
   - Plan: `.agent/plans/curriculum-ontology-resource-plan.md`
   - Prerequisite: Sprint 0 (Aggregated tools refactor) — see `.agent/plans/mcp-aggregated-tools-type-gen-refactor-plan.md`
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
   - Plan: `.agent/plans/oak-openai-app-plan.md`
   - Prerequisites: Items #1 (semantic search), #2 (ontology resource)
   - Scope: Metadata optimization for ChatGPT Developer Mode; fix STDIO bug; add MCP annotations; expose outputSchema; add tool titles; create golden prompt test suite
   - Related: `.agent/plans/upstream-api-metadata-wishlist.md` (wishlist for API team)
   - Acceptance: Tools discoverable in ChatGPT; descriptions rich and accurate; ≥90% tool selection accuracy; negative prompts avoid our tools

5. **Semantic Search MCP Integration** — Status: Planned (Priority 5)
   - Scope: Add semantic search to type-gen-generated `search` MCP tool; compose with curriculum data + semantic search APIs
   - Prerequisites: Item #1 (semantic search Phase 1), Item #2 (ontology + aggregated tools refactor)
   - Architecture: Semantic search integration defined in type-gen configuration; generated at `pnpm type-gen` time
   - Acceptance: Generated `search` tool composes curriculum + semantic search APIs; E2E tests (no network) pass; documentation updated

6. **Advanced MCP Tools** — Status: FUTURE (Priority 6 - DEFERRED)
   - Plan: `.agent/plans/advanced-mcp-tools-plan.md`
   - Prerequisites: Items #1-3 (semantic search, ontology, OAuth) MUST complete first
   - Scope: Bulk operations, intelligent filtering, comparative analysis, export capabilities
   - Current State: NOT STARTED (prerequisites not met)
   - Note: Consolidates and supersedes `.agent/plans/curriculum-tools-guidance-playbooks-plan.md` (Phase 1 complete, rest deferred)
   - Note: `.agent/plans/mcp-enhancements-plan.md` deleted (low quality, superseded)
   - Acceptance: Advanced tools generated at type-gen time; schema-first architecture maintained; comprehensive test coverage

7. **Contract Testing with API Schema Evolution** — Status: Planned
   - Plan: `.agent/plans/contract-testing-schema-evolution-plan.md`
   - Scope: Automated contract testing validates Cardinal Rule (schema evolution → `pnpm type-gen` → `pnpm build` → working artefacts)
   - Implementation: 7 synthetic scenarios; four-stage violation detection; `pnpm test:contract` harness
   - Acceptance: All scenarios pass; harness executes in ≤8 minutes; contribution guide validated; ADR published

8. **Separate SDK Type Generation from Runtime** — Status: Planned
   - Plan: `.agent/plans/sdk-workspace-separation-plan.md`
   - Scope: Split into `oak-curriculum-sdk-generation` (types/validators/tools) and `oak-curriculum-sdk-runtime` (client)
   - Enables: Item #10 (OpenAPI-to-MCP Framework Extraction)
   - Acceptance: Two workspaces; clean public API boundaries; zero consumer impact; Schema-First Execution Directive maintained

9. **Enhance MCP Tools/Resources/Prompts** — Status: Planned
   - Scope: Leverage MCP resources and prompts beyond tools; reclassify some tools as resources where appropriate
   - Related: Item #2 (ontology as resource); <https://modelcontextprotocol.io/docs/learn/server-concepts>
   - Note: Partially covered by ontology resource (Item #2) and advanced tools (Item #6)
   - Acceptance: Resources/prompts exposed; E2E tests pass

10. **OpenAPI-to-MCP Framework Extraction** — Status: Blocked (prerequisite: #8)
    - Plan: `.agent/plans/openapi-to-mcp-framework-extraction-plan.md`
    - Prerequisite: Item #8 (SDK workspace separation)
    - Scope: Extract type-gen into general-purpose `@oaknational/openapi-mcp-framework`; make Oak SDK a consumer
    - Acceptance: Framework generates SDK + servers for Oak + two reference specs; quality gates pass; onboarding < 4 hours

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

## Priority Notes (2025-10-28)

**Current Focus**: Semantic search (finishing), ontology resource, OAuth integration are the immediate priorities. Advanced tooling is explicitly deferred until these foundational pieces are complete.

**Rationale**: The ontology resource and OAuth provide the infrastructure required for AI integration, while advanced tools build higher-level workflows on top of that infrastructure.

**Plan Updates**:

- Created `.agent/plans/advanced-mcp-tools-plan.md` (comprehensive plan for future advanced tooling)
- Deleted `.agent/plans/mcp-enhancements-plan.md` (low quality, superseded)
- Marked `.agent/plans/curriculum-tools-guidance-playbooks-plan.md` Phase 2+ as deferred (overlaps with advanced tools)
