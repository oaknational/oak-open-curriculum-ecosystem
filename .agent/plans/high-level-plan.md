# High-Level Plan

**Last Updated**: 2026-02-11  
**Scope**: Strategic overview. Details are in individual plan documents.

**Recent Changes (2026-02-11)**:

- SDK extraction complete (Checkpoints A–E2): all services return `Result<T, E>`, comprehensive TSDoc, all quality gates pass
- SDK extraction plan (`search-sdk-cli.plan.md`) marked ✅ COMPLETE
- MCP search integration is the immediate next priority
- Semantic search roadmap restructured with all post-SDK streams and correct dependencies

**Previous Changes (2026-02-10)**:

- Ground truths complete across all four indexes
- SDK extraction started as immediate priority
- Search enhancements consolidated into one workstream

---

## Current Priorities (2026-02-11)

**Active Work**:

1. **Semantic Search** — MCP integration next (SDK extraction complete, see [roadmap.md](semantic-search/roadmap.md))
2. **Type Discipline Restoration** — Quality gates passing, ongoing refinement
3. **SDK/MCP Enhancements** — Plan 05 (Zod v4) active

**Next Up**: Search enhancements (GT expansion, Levels 2-4), Ontology Resource (Plan 02)

**Deferred**: Global State DI Refactoring, Advanced MCP Tools (Phase 4 of Plan 03)

**Also Active** (lower priority):

- Widget Enhancements — Universal renderers, knowledge graph SVG (Plans 11, 15b in sdk-and-mcp-enhancements; user-experience-enhancements/)

---

## Active / Planned (Priority Order)

### 1. Elasticsearch Semantic Search — Status: 🔄 IN PROGRESS (Priority 1)

**Plan**: `.agent/plans/semantic-search/roadmap.md` (authoritative roadmap)  
**Current Work**: [wire-hybrid-search.md](semantic-search/post-sdk/mcp-integration/wire-hybrid-search.md)

| Milestone | Focus | Status |
|-----------|-------|--------|
| 1 | Complete ES ingestion | ✅ Complete (16,414 docs) |
| 2 | Sequence indexing | ✅ Complete (30 sequences, 57 facets) |
| 3 | Level 1 fundamentals | ✅ Approaches complete |
| 4 | Ground truth foundation | ✅ Complete (30 lessons, 2 units, 1 thread, 1 sequence) |
| 5 | SDK/CLI extraction + Result pattern + TSDoc | ✅ Complete |
| **6** | **MCP search integration** | 📋 **NEXT** |
| 7 | Search quality + ecosystem streams | 📋 Future |

**Current Priority**: MCP Search Integration

SDK extraction is complete. Wire the Search SDK into
MCP curriculum servers so AI agents can use hybrid
Elasticsearch search. See [roadmap.md](./semantic-search/roadmap.md).

---

### 2. Curriculum Ontology MCP Resource — Status: 📋 PLANNED (Priority 2)

**Plan**: `.agent/plans/sdk-and-mcp-enhancements/02-curriculum-ontology-resource-plan.md`

**Prerequisite**: Plan 03 Phase 0 (Aggregated tools type-gen refactor)

**Scope**:

- Schema-derived ontology (type-gen) + educational guidance (hand-authored)
- Exposed as MCP resource AND tool (dual exposure)
- POC available: `00-ontology-poc-static-tool.md` (~1 hour validation)

**Current State**: NOT STARTED (prerequisite not met)

**Enables**: OpenAI App SDK integration; advanced MCP tools; curriculum structure knowledge for AI agents

**Acceptance**: Resources accessible via MCP; schema extraction during `pnpm type-gen` succeeds; all tests pass.

---

### 3. MCP Infrastructure & Advanced Tools — Status: 📋 PLANNED (Priority 3)

**Plan**: `.agent/plans/sdk-and-mcp-enhancements/03-mcp-infrastructure-advanced-tools-plan.md`

**Scope**: Five-phase architecture evolution:

| Phase | Name | Duration | Status |
|-------|------|----------|--------|
| 0 | Aggregated Tools Type-Gen Refactor | ~2 weeks | 📋 Prerequisite for all |
| 1 | Infrastructure Hardening | ~1-2 weeks | 📋 Planned |
| 2 | Tool Taxonomy & Categorization | ~1 week | 📋 Planned |
| 3 | Playbooks & Commands Registry | ~1-2 weeks | 📋 Planned |
| 4 | Advanced MCP Tools | ~8 weeks | 📋 Future |

**Key Issue**: Some MCP tools (`search`, `fetch`) are defined at runtime instead of type-gen time. Phase 0 addresses this, though it's no longer highest priority — the issues may be addressed through other means.

**Acceptance**: All phases complete; advanced tools generated at type-gen time; schema-first architecture maintained.

---

### 4. OpenAI Apps SDK Integration — Status: 📋 PLANNED (Priority 4)

**Plan**: `.agent/plans/sdk-and-mcp-enhancements/08-openai-apps-sdk-feature-adoption-plan.md`

**Prerequisites**: Items #1 (semantic search), #2 (ontology resource)

**Scope**:

- Widget CSP metadata (CRITICAL for production)
- Interactive widget capabilities
- Token optimization
- Tool visibility and localization

**Related**: `.agent/plans/external/upstream-api-metadata-wishlist.md`

**Acceptance**: Tools discoverable in ChatGPT; CSP configured; widgets interactive.

---

### 5. Semantic Search Type-Gen Integration — Status: 📋 PLANNED (Priority 5)

**Scope**: Generate the semantic search MCP tool at `pnpm type-gen` time (replacing the hand-written tool from M8)

**Prerequisites**: Item #1 M8 (basic MCP wiring complete), Item #3 Phase 0 (aggregated tools type-gen refactor)

**Architecture**: Semantic search integration defined in type-gen configuration; generated alongside other aggregated tools

**Note**: Basic MCP search wiring (M8 in Item #1) is hand-written and has no dependency on this. This item upgrades the hand-written tool to a generated one, aligning with the type-gen-first architecture.

**Acceptance**: Generated `search` tool composes curriculum + semantic search APIs; E2E tests pass; documentation updated.

---

### 6. MCP Tool Metadata Enhancement — Status: 🟡 PHASE 0 COMPLETE (Priority 6)

**Plan**: `.agent/plans/sdk-and-mcp-enhancements/01-mcp-tool-metadata-enhancement-plan.md`

**Scope**:

- ✅ Phase 0: Tool annotations (COMPLETE)
- 📋 Phase 1-6: Invocation status, security schemes, parameter examples, error messages, output schema, aggregated tools alignment

**Acceptance**: Enhanced metadata improves ChatGPT tool selection accuracy.

---

### 7. Contract Testing with API Schema Evolution — Status: 📋 PLANNED (Priority 7)

**Plan**: `.agent/plans/dev-tooling-and-dev-ai-support/contract-testing-schema-evolution-plan.md`

**Scope**: Automated contract testing validates Cardinal Rule (schema evolution → `pnpm type-gen` → `pnpm build` → working artefacts)

**Implementation**: 7 synthetic scenarios; four-stage violation detection; `pnpm test:contract` harness

**Acceptance**: All scenarios pass; harness executes in ≤8 minutes; ADR published.

---

### 8. Separate SDK Type Generation from Runtime — Status: 📋 PLANNED (Priority 8)

**Plan**: `.agent/plans/pipeline-enhancements/sdk-workspace-separation-plan.md`

**Scope**: Split into `oak-curriculum-sdk-generation` (types/validators/tools) and `oak-curriculum-sdk-runtime` (client)

**Enables**: Item #9 (OpenAPI-to-MCP Framework Extraction)

**Acceptance**: Two workspaces; clean public API boundaries; zero consumer impact.

---

### 9. OpenAPI-to-MCP Framework Extraction — Status: ⏸ BLOCKED (Priority 9)

**Plan**: `.agent/plans/pipeline-enhancements/openapi-to-mcp-framework-extraction-plan.md`

**Prerequisite**: Item #8 (SDK workspace separation)

**Scope**: Extract type-gen into general-purpose `@oaknational/openapi-mcp-framework`; make Oak SDK a consumer

**Acceptance**: Framework generates SDK + servers for Oak + two reference specs; quality gates pass.

---

### 10. Enhance MCP Tools/Resources/Prompts — Status: 📋 PLANNED (Priority 10)

**Plan**: `.agent/plans/sdk-and-mcp-enhancements/04-mcp-prompts-and-agent-guidance-plan.md`

**Scope**: Fix prompt argument passing; leverage MCP resources and prompts beyond tools

**Related**: Item #2 (ontology as resource); MCP specification

**Acceptance**: Prompts correctly receive arguments; resources/prompts exposed; E2E tests pass.

---

## Backlog / Tidy-ups

- **Logging standardisation** — Adopt shared `@oaknational/mcp-logger` in `apps/oak-curriculum-mcp-streamable-http`; wire `LOG_LEVEL` through central logger factory.

- **Global State DI Refactoring** — Refactor tests to use dependency injection instead of `process.env` mutations. Plan: `.agent/plans/quality-and-maintainability/global-state-test-refactoring.md`. Currently mitigated with `isolate: true` + `pool: 'forks'`.

- **Type Discipline Restoration** — Quality gates passing; 2 lint errors remain. Plan: `.agent/plans/quality-and-maintainability/type-discipline-restoration-plan.md`.

---

## Completed

### 11. OAuth 2.1 / Clerk Integration — Status: ✅ DONE

**Plan**: `.agent/plans/archive/completed/mcp-oauth-implementation-plan.md`

**Scope**: Replaced local demo OAuth AS with Clerk production AS; Google SSO for @thenational.academy

**Outcome**: Clerk AS live with metadata endpoints, auth middleware, smoke/e2e coverage.

---

### 12. Architectural Refinements — Status: ✅ DONE

**Plan**: Completed — see PR #16

**Scope**: DI-only wiring; documentation updates

**Outcome**: Gates green; wiring modernized.

---

### 13. Remote Hosting Support (Streaming HTTP) — Status: ✅ DONE

**Plan**: `.agent/plans/archive/completed/remote-mcp-enablement-plan.md`

**Scope**: Enable Streaming HTTP (not SSE) for MCP servers; Vercel/Node hosting guidance

**Outcome**: Streaming framing implemented; Vercel deploy documented and available for demos.

---

### 14. MCP Hardening — Status: ✅ DONE

**Plan**: `.agent/plans/archive/completed/mcp-hardening-plan.md`

**Scope**: Delegate `/mcp` GET/POST to `StreamableHTTPServerTransport`; transport/tool regression tests

**Outcome**: MCP server aligned with official spec; transport verified against target clients.

---

## Deferred / Won't Implement

### 15. Semantic Search UI & Evidence — Status: ⏸ DEFERRED

**Plan**: `.agent/plans/semantic-search/archive/phase-5-search-ui.md`

**Scope**: Reference UX patterns; admin/status redesign

**Note**: Deferred to Part 3. UI already functional; this is polish/evidence work for future.

---

### 16. Serverless Hosting (Cloudflare Workers) — Status: ⏸ WON'T IMPLEMENT

**Plan**: `.agent/plans/icebox/serverless-hosting-plan.md`

**Note**: Streaming HTTP on Vercel/Node sufficient for current needs.

---

## Milestones

| Milestone | Description | Status |
|-----------|-------------|--------|
| M1 | Typed MCP tools available from SDK | ✅ DONE |
| M2 | Broad MCP platform compatibility | ✅ DONE |
| M3 | Remote Streaming HTTP live (Vercel) | ✅ DONE |
| M4 | OAuth/Clerk Integration | ✅ DONE |
| M5 | Search Level 1: Fundamentals | ✅ DONE |
| M6 | Ground Truth Foundation | ✅ DONE |
| M7 | Search SDK + CLI Extraction + Result + TSDoc | ✅ DONE |
| **M8** | **MCP Search Integration** | 📋 **NEXT** |
| M9 | Ontology Resource Implementation | 📋 Planned |
| M10 | OpenAI Apps SDK Integration | 📋 Planned |
| M11 | Advanced MCP Tools | ⏸ Deferred |
| M12 | Contract Testing | 📋 Planned |
| M13 | SDK Workspace Separation | 📋 Planned |
| M14 | OpenAPI Framework Extraction | ⏸ Blocked by M13 |

---

## Plan Directory Structure

```text
.agent/plans/
├── high-level-plan.md              # This file — strategic coordination
├── semantic-search/                # Elasticsearch search
│   ├── README.md                   # Navigation hub
│   ├── roadmap.md                  # Single authoritative roadmap
│   ├── search-acceptance-criteria.md # Definition of done
│   ├── active/                     # Currently blocking work
│   ├── planned/                    # Future work with specs
│   └── archive/                    # Completed/superseded work
├── sdk-and-mcp-enhancements/       # Numbered plans (00-16)
│   ├── README.md                   # Plan index with dependencies
│   ├── 01-mcp-tool-metadata-enhancement-plan.md
│   ├── 02-curriculum-ontology-resource-plan.md
│   ├── 03-mcp-infrastructure-advanced-tools-plan.md
│   └── ...
├── quality-and-maintainability/    # Type discipline, DI, ESLint
├── pipeline-enhancements/          # SDK separation, framework extraction
├── dev-tooling-and-dev-ai-support/ # Testing, automation
├── observability/                  # Logger, Sentry, OTEL
├── external/                       # Upstream API wishlist
├── icebox/                         # Deferred/low priority
└── archive/                        # Completed/superseded plans
```

---

## Quality Gates

Run after every piece of work, from repo root, in order:

```bash
pnpm clean             # Clean build products
pnpm type-gen          # Generate types from schema
pnpm build             # Build all packages
pnpm type-check        # TypeScript validation
pnpm format:root       # Format code
pnpm markdownlint:root # Markdown lint
pnpm lint:fix          # Auto-fix linting issues
pnpm test              # Unit + integration tests
pnpm test:ui           # Playwright UI tests
pnpm test:e2e          # E2E tests
pnpm test:e2e:built    # E2E on built app
pnpm smoke:dev:stub    # Smoke tests
```

**All gates must pass. No exceptions.**

---

## Foundation Documents

Re-read regularly:

- `.agent/directives/rules.md` — Cardinal Rule, TDD, type safety
- `.agent/directives/testing-strategy.md` — TDD at all levels
- `.agent/directives/schema-first-execution.md` — Generator-first architecture

---

## Notes

**Runtime vs Type-Gen MCP Tools**: Some aggregated tools (`search`, `fetch`) are still defined at runtime. Plan 03 Phase 0 addresses this, but it's lower priority now. The architectural issues may be resolved through other approaches (e.g., keeping thin runtime wrappers acceptable for composition logic).

**Semantic Search vs Ontology**: These were originally conceived as a unified "Schema-First Migration + Ontology Integration" effort but have evolved into distinct workstreams with different timelines and dependencies. The semantic search work focuses on Elasticsearch functionality; the ontology work focuses on exposing curriculum structure as MCP resources.
