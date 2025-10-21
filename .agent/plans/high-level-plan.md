# High-Level Plan

Scope: strategic overview. Details are in the individual plan documents.

## Active / Planned (Priority Order)

1. **SDK Quality Gates & Snagging Resolution** — Status: In Progress (Priority 1)
   - Plan: `.agent/plans/semantic-search/snagging-resolution-plan.md`
   - Current: Stage 5 complete; Stage 6 remaining tasks (smoke harness, payload parity analysis); Task 7 (STDIO tool description bug) identified
   - Acceptance: All quality gates green (`pnpm type-gen`, `pnpm build`, `pnpm type-check`, `pnpm lint`, `pnpm test`, `pnpm test:e2e`); smoke tests pass in stub/live/remote modes

2. **OpenAI Apps SDK Integration (Non-UI)** — Status: Planned (Priority 2)
   - Plan: `.agent/plans/oak-openai-app-plan.md`
   - Scope: Metadata optimization for ChatGPT Developer Mode; fix STDIO bug; add MCP annotations; expose outputSchema; add tool titles; create golden prompt test suite
   - Related: `.agent/plans/upstream-api-metadata-wishlist.md` (wishlist for API team)
   - Acceptance: Tools discoverable in ChatGPT; descriptions rich and accurate; ≥90% tool selection accuracy; negative prompts avoid our tools

2a. **Refactor Aggregated MCP Tools to Type-Gen** — Status: Planned (Priority 2a - Prerequisite for 3 & 6) - Plan: `.agent/plans/mcp-aggregated-tools-type-gen-refactor-plan.md` - Scope: Move `search` and `fetch` from runtime to type-gen generation; establish config-driven pattern for composite MCP primitives - Architecture: Declarative JSON config defines composition rules; generators emit descriptors/validators/executors; runtime imports generated code - Enables: Item #3 (ontology resources follow same pattern); Item #6 (semantic search integration via config) - Acceptance: Aggregated tools generated at `pnpm type-gen` time; runtime code is thin plumbing; all tests pass; MCP behaviour unchanged

3. **Curriculum Ontology MCP Resource** — Status: Planned (Priority 3)
   - Plan: `.agent/plans/curriculum-ontology-resource-plan.md`
   - Scope: Schema-derived ontology (type-gen) + educational guidance (hand-authored); exposed as MCP resources; TDD throughout
   - Enables: Item #2 (OpenAI App SDK) by providing curriculum structure knowledge
   - Acceptance: Resources accessible via MCP; schema extraction during `pnpm type-gen` succeeds; ontology includes entities/relationships/tool workflows; all tests pass

4. **Semantic Search UI & Evidence** — Status: Deferred (Priority 4)
   - Plan: `.agent/plans/semantic-search/snagging-resolution-ui-plan.md`
   - Blocked by: Item #1 (SDK quality gates must be green)
   - Scope: Resume Workstreams 4–8; refresh Playwright evidence; admin/status redesign
   - Acceptance: UI tests pass; accessibility validated; visual evidence captured

5. **Semantic Search Back-End Alignment** — Status: Ready (Priority 5)
   - Plans: `.agent/plans/semantic-search/semantic-search-target-alignment-plan.md`
   - Scope: Implement definitive guide (indices, RRF queries, APIs); populate indexes; deploy services
   - Notes: Plan refresh needed to align with target architecture
   - Acceptance: Back-end matches definitive guide; services deployed; E2E tests pass; documentation updated

6. **Integrate Semantic Search into Oak Curriculum MCP** — Status: Planned (Priority 6)
   - Scope: Add semantic search to type-gen-generated `search` MCP tool; compose with curriculum data + semantic search APIs
   - Prerequisites: Item #3 (aggregated tools moved to type-gen); Item #5 (semantic search back-end)
   - Architecture: Semantic search integration defined in type-gen configuration; generated at `pnpm type-gen` time
   - Acceptance: Generated `search` tool composes curriculum + semantic search APIs; E2E tests (no network) pass; documentation updated

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
   - Related: Item #3 (ontology as resource); <https://modelcontextprotocol.io/docs/learn/server-concepts>
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

14. **Curriculum MCP Auth Plan** — Status: ⏸ Deferred
    - Plan: `.agent/plans/curriculum-mcp-enhancements-plan.md` (needs updating)
    - Scope: Authentication using Clerk
    - Note: Deferred pending clearer requirement signal

15. **Serverless Hosting (Cloudflare Workers)** — Status: ⏸ Won't Implement For Now
    - Plan: `.agent/plans/icebox/serverless-hosting-plan.md`
    - Scope: Workers provider parity via contract tests; Wrangler deploy
    - Note: Streaming HTTP on Vercel/Node sufficient for current needs

## Milestones

- M1: Typed MCP tools available from SDK — ✅ DONE
- M2: Broad MCP platform compatibility — ✅ DONE
- M3: Remote Streaming HTTP live (Vercel) — ✅ DONE
- M4: SDK Quality Gates — In Progress (Item #1, Priority 1)
- M5: OpenAI Apps SDK Integration — Planned (Items #2-3, Priority 2-3)
- M6: Semantic Search Back-End Alignment — Ready (Item #5, Priority 5)
- M7: Semantic Search MCP Integration — Planned (Item #6, Priority 6)
- M8: Contract Testing — Planned (Item #7)
- M9: SDK Workspace Separation — Planned (Item #8) - enables framework extraction
- M10: OpenAPI Framework — Blocked by M9 (Item #10) - general-purpose framework for any OpenAPI spec
