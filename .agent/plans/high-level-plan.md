# High-Level Plan

**Last Updated**: 2026-02-17  
**Scope**: Strategic overview for the Oak MCP Ecosystem. Details are in individual plan documents.

---

## Current Priorities

The immediate sequence is:

1. **MCP search integration** — wire the validated SDK
   into MCP tools, compare with existing REST API search,
   likely replace it
2. **SDK workspace separation** — split the Curriculum SDK
   type-gen code from the runtime code
3. **Castr integration** — replace `openapi-zod-client`
   and `openapi3-ts` with Castr for direct Zod v4
   generation

After these: search quality enhancements, ontology
resource, and further MCP improvements.

---

## Active / Planned (Priority Order)

### 1. Semantic Search — Status: 🔄 MCP INTEGRATION IN PROGRESS (Priority 1)

**Roadmap**: [semantic-search/roadmap.md](semantic-search/roadmap.md)

SDK extraction is complete. All three services (retrieval,
admin, observability) return `Result<T, E>` with per-service
error types and comprehensive TSDoc. Thread search is fully
integrated (8 GTs, MRR=0.938). The SDK has 36 tests; the
CLI has 935 tests. All quality gates pass.

| Milestone | Focus | Status |
|-----------|-------|--------|
| ES ingestion | 16,414 docs across 4 indexes | ✅ Complete |
| Level 1 fundamentals | Synonyms, phrase boosting, noise filtering | ✅ Complete |
| Ground truth foundation | 30 lessons, 2 units, 8 threads, 1 sequence | ✅ Complete |
| SDK + CLI extraction | Result pattern, TSDoc, Checkpoints A–E2 | ✅ Complete |
| SDK validation | Validated against real ES (Phase 2e) | ✅ Complete |
| Public release readiness | Secrets, licence, package.json, docs, GitHub config | ✅ Complete |
| Developer onboarding | Canonical journey, command truth, link integrity | ✅ Complete |
| Code quality remediation | TSDoc warnings (0), type shortcuts removed (137 files) | ✅ Complete |
| **MCP search integration** | Wire SDK into MCP tools — WS1-WS4 done, only WS5 (compare/replace) remains | 🔄 **IN PROGRESS** |
| Compare and replace | Evaluate SDK search vs REST API search, likely replace | 📋 Planned (WS5) |
| Search enhancements | GT expansion, Levels 2–4, bulk data analysis | 📋 Future |

**Immediate work**: WS5 (compare SDK search vs REST API on
representative queries; replace if superior). WS1-WS4 complete.
See [phase-3a-mcp-search-integration.md](semantic-search/active/phase-3a-mcp-search-integration.md).

---

### 2. SDK Workspace Decomposition — Status: 📋 PLANNED (Priority 2)

**ADR**: [ADR-108: SDK Workspace Decomposition](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md)  
**Plan**: [pipeline-enhancements/sdk-workspace-separation-plan.md](pipeline-enhancements/sdk-workspace-separation-plan.md)

Decompose `@oaknational/curriculum-sdk` along two
orthogonal axes (generic/Oak x type-gen/runtime) into
four workspaces:

| Workspace | Owns |
|-----------|------|
| WS1: Generic Pipeline | OpenAPI to TypeScript, Zod, MCP tools (reusable) |
| WS2: Oak Type-Gen | Schema decoration, search/ES mappings, domain config |
| WS3: Generic Runtime | HTTP client factory, middleware, MCP execution (reusable) |
| WS4: Oak Runtime | Aggregated tools, canonical URLs, domain features |

**Phased execution**:

- **Step 1** (immediate): 2-way split — extract type-gen
  into `oak-curriculum-sdk-generation` (WS2). This is the
  [SDK workspace separation plan](pipeline-enhancements/sdk-workspace-separation-plan.md).
- **Step 2**: Castr integration (Item #3)
- **Step 3** (future): Extract generic pipeline (WS1)
  from Oak type-gen (WS2), and generic runtime (WS3)
  from Oak runtime (WS4).

**Enables**: Castr integration, reusable OpenAPI pipeline
for external users, cleaner boundaries.

---

### 3. Castr Integration — Status: 📋 PLANNED (Priority 3)

**Requirements**: [external/castr/README.md](external/castr/README.md)  
**Contract docs**: [external/castr/](external/castr/)  
**ADR**: [ADR-108][adr-108] (Castr is a dependency of WS1)

Replace `openapi-zod-client` and `openapi3-ts` (currently
wrapped by `packages/core/openapi-zod-client-adapter/`)
with `@engraph/castr` for direct Zod v4 generation from
OpenAPI schemas.

**Phase 1 deliverable**: Castr produces Zod v4 output
directly, eliminating the adapter's v3→v4 transformation
layer. The adapter can remain in place initially while
Castr output is validated side-by-side against the
existing pipeline. Adapter removal is a subsequent step
once validation is complete.

Per [ADR-108][adr-108], Castr becomes a pluggable
dependency of the Generic Pipeline (WS1). After the
2-way split (Item #2 Step 1), Castr targets the
generation workspace.

**Prerequisites**: Item #2 Step 1 (SDK workspace separation)

**Acceptance**: `pnpm type-gen` uses Castr output; full
quality gate chain passes; adapter removal planned.

[adr-108]: ../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md

---

### 4. Notion MCP Workspace Removal — Status: ✅ COMPLETE (Priority 4)

The `oak-notion-mcp` workspace was originally included to
force generalisation of code that needed to support multiple
MCP servers. That generalisation is now achieved — the
generic pipeline vision (ADR-108) and the existing
multi-server architecture (stdio + streamable-http) have
made Notion's role as an architectural forcing function
obsolete. The workspace code has already been removed.

**What remains**: References to Notion in ~30 active
documentation files across `.agent/plans/`, `docs/`, and
`docs/architecture/`. These need cleaning:

- Remove `oak-notion-mcp` from all active plans (config,
  DI, testing, stryker, publishing, ESLint)
- Remove Notion tools, resources, and API references from
  `docs/development/`, `docs/agent-guidance/`
- Remove Notion SDK from `docs/development/tooling.md`
- Remove `NOTION_API_KEY` from env vars documentation
- Retain a single historical note (in the Completed section
  or an ADR) explaining why the workspace once existed and
  why it was removed
- `docs/usage/` deleted (entirely Notion-specific content)
- Archive `.agent/reference-docs/notion-sdk-readme.md` and
  `notion-api-overview.md`

**Acceptance**: No active documentation references Notion
except the single historical note. Quality gates pass.

---

---

### 5. Search Quality Enhancements — Status: 📋 PLANNED (Priority 5)

**Plan**: [semantic-search/roadmap.md](semantic-search/roadmap.md) (Phase 4)  
**Acceptance criteria**: [semantic-search/search-acceptance-criteria.md](semantic-search/search-acceptance-criteria.md)

Multiple parallel streams after MCP integration:

| Stream | Plan | Status |
|--------|------|--------|
| GT expansion (30 → 80-100 queries) | [ground-truth-expansion-plan.md](semantic-search/post-sdk/search-quality/ground-truth-expansion-plan.md) | 📋 Pending |
| Level 2: Document relationships | [document-relationships.md](semantic-search/post-sdk/search-quality/document-relationships.md) | 📋 Pending |
| Level 3: Modern ES features | [modern-es-features.md](semantic-search/post-sdk/search-quality/modern-es-features.md) | 📋 Pending |
| Level 4: AI enhancement (destination) | [ai-enhancement.md](semantic-search/post-sdk/search-quality/ai-enhancement.md) | ⏸️ Blocked |
| Bulk data / vocabulary mining | [vocabulary-mining.md](semantic-search/post-sdk/bulk-data-analysis/vocabulary-mining.md) | 📋 Pending |
| Bulk schema-driven type-gen | [bulk-schema-driven-type-gen.md](semantic-search/post-sdk/bulk-schema-driven-type-gen.md) | 📋 Pending |
| SDK API / filter testing | [filter-testing.md](semantic-search/post-sdk/sdk-api/filter-testing.md) | 📋 Pending |
| Subject domain model | [move-search-domain-knowledge-to-typegen-time.md](semantic-search/post-sdk/move-search-domain-knowledge-to-typegen-time.md) | 📋 Pending |

---

### 6. Curriculum Ontology MCP Resource — Status: 📋 PLANNED (Priority 6)

**Plan**: [sdk-and-mcp-enhancements/02-curriculum-ontology-resource-plan.md](sdk-and-mcp-enhancements/02-curriculum-ontology-resource-plan.md)

Schema-derived ontology (type-gen) + educational guidance
(hand-authored), exposed as MCP resource AND tool.

**Enables**: Advanced MCP tools, curriculum structure
knowledge for AI agents.

---

### 7. OpenAI Apps SDK Integration — Status: 📋 PLANNED (Priority 7)

**Plan**: [sdk-and-mcp-enhancements/08-openai-apps-sdk-feature-adoption-plan.md](sdk-and-mcp-enhancements/08-openai-apps-sdk-feature-adoption-plan.md)

Widget CSP metadata (critical for production), interactive
widget capabilities, token optimization, tool visibility.

---

### 8. MCP Tool Metadata Enhancement — Status: 🟡 PHASE 0 COMPLETE (Priority 8)

**Plan**: [sdk-and-mcp-enhancements/01-mcp-tool-metadata-enhancement-plan.md](sdk-and-mcp-enhancements/01-mcp-tool-metadata-enhancement-plan.md)

- ✅ Phase 0: Tool annotations (complete)
- 📋 Phases 1–6: Invocation status, security schemes,
  parameter examples, error messages, output schema,
  aggregated tools alignment

---

### 9. Contract Testing — Status: 📋 PLANNED (Priority 9)

**Plan**: [dev-tooling-and-dev-ai-support/contract-testing-schema-evolution-plan.md](dev-tooling-and-dev-ai-support/contract-testing-schema-evolution-plan.md)

Automated contract testing validates the Cardinal Rule:
schema evolution → `pnpm type-gen` → `pnpm build` →
working artefacts.

---

## Backlog

| Item | Plan | Status |
|------|------|--------|
| MCP Infrastructure (aggregated tools refactor) | [sdk-and-mcp-enhancements/03-mcp-infrastructure-advanced-tools-plan.md](sdk-and-mcp-enhancements/03-mcp-infrastructure-advanced-tools-plan.md) | 📋 Planned |
| MCP Prompts and Agent Guidance | [sdk-and-mcp-enhancements/04-mcp-prompts-and-agent-guidance-plan.md](sdk-and-mcp-enhancements/04-mcp-prompts-and-agent-guidance-plan.md) | ⏸️ Deferred |
| Generic Pipeline Extraction (WS1 per ADR-108) | [pipeline-enhancements/openapi-to-tooling-integration-plan.md](pipeline-enhancements/openapi-to-tooling-integration-plan.md) | ⏸️ Blocked by #2 + #3 |
| Generic Runtime Extraction (WS3 per ADR-108) | [pipeline-enhancements/openapi-to-mcp-framework-extraction-plan.md](pipeline-enhancements/openapi-to-mcp-framework-extraction-plan.md) | ⏸️ Blocked by #2 |
| Widget Universal Renderers | [sdk-and-mcp-enhancements/11-widget-universal-renderers-plan.md](sdk-and-mcp-enhancements/11-widget-universal-renderers-plan.md) | 📋 Planned |
| STDIO–HTTP Server Alignment | [architecture/stdio-http-server-alignment.md](architecture/stdio-http-server-alignment.md) | 📋 Backlog |
| Config Architecture Standardisation | [architecture/config-architecture-standardisation-plan.md](architecture/config-architecture-standardisation-plan.md) | 📋 Planned |
| Logger / Sentry / OTEL | [architecture/logger-sentry-otel-integration-plan.md](architecture/logger-sentry-otel-integration-plan.md) | 📋 Planned |
| SDK Publishing and Versioning | [dev-tooling-and-dev-ai-support/sdk-publishing-and-versioning-plan.md](dev-tooling-and-dev-ai-support/sdk-publishing-and-versioning-plan.md) | 📋 Planned |
| Search Operations / Governance | [semantic-search/post-sdk/operations/governance.md](semantic-search/post-sdk/operations/governance.md) | 📋 Pending |

---

## Completed

| Item | Plan | Outcome |
|------|------|---------|
| OAuth 2.1 / Clerk Integration | [archive/completed/mcp-oauth-implementation-plan.md](archive/completed/mcp-oauth-implementation-plan.md) | Clerk AS live with Google SSO |
| Remote Streaming HTTP | [archive/completed/remote-mcp-enablement-plan.md](archive/completed/remote-mcp-enablement-plan.md) | Vercel deploy available |
| MCP Hardening | [archive/completed/mcp-hardening-plan.md](archive/completed/mcp-hardening-plan.md) | Spec-aligned transport |
| Search SDK + CLI Extraction | [semantic-search/archive/completed/search-sdk-cli.plan.md](semantic-search/archive/completed/search-sdk-cli.plan.md) | 36 SDK tests, 935 CLI tests |
| TSDoc Compliance Fix | [archive/tsdoc-canonical-tag-migration.md](archive/tsdoc-canonical-tag-migration.md) | 462 files, eslint-plugin-tsdoc |
| HTTP 451 Remediation | [semantic-search/archive/completed/transcript-451-test-doc-remediation.plan.md](semantic-search/archive/completed/transcript-451-test-doc-remediation.plan.md) | ADR-109, E2E test compliance |
| Thread Search SDK Integration | [semantic-search/archive/completed/thread-search-sdk-integration.plan.md](semantic-search/archive/completed/thread-search-sdk-integration.plan.md) | 8 GTs, MRR=0.938 |
| Public Release Readiness | [semantic-search/archive/completed/public-release-readiness.plan.md](semantic-search/archive/completed/public-release-readiness.plan.md) | npm publish deferred |
| Developer Onboarding Experience | [semantic-search/archive/completed/developer-onboarding-experience.plan.md](semantic-search/archive/completed/developer-onboarding-experience.plan.md) | Canonical journey, command truth |
| Streamable HTTP Transport Bug Fix | [ADR-112](/docs/architecture/architectural-decisions/112-per-request-mcp-transport.md) | Per-request transport pattern; E2E simplified |
| TSDoc Lint Warnings | — | 1,693 → 0 warnings, escaping at generator level |
| Remove Type Shortcuts | — | 137 files, type guards replace assertions |
| Type Discipline Restoration | [archive/type-discipline-restoration-plan.md](archive/type-discipline-restoration-plan.md) | Quality gates passing |
| Strict Zod Schema Generation | [archive/strict-zod-schema-generation.md](archive/strict-zod-schema-generation.md) | .strict() on all schemas |
| Widget Playwright Tests | [sdk-and-mcp-enhancements/archive/07-widget-playwright-tests-plan.md](sdk-and-mcp-enhancements/archive/07-widget-playwright-tests-plan.md) | E2E coverage |
| Synonym Enrichment | [sdk-and-mcp-enhancements/17-synonym-enrichment-from-owa-oala.md](sdk-and-mcp-enhancements/17-synonym-enrichment-from-owa-oala.md) | OWA + OALA synonyms |

---

## Deferred / Won't Implement

| Item | Reason |
|------|--------|
| Serverless Hosting (Cloudflare Workers) | Streaming HTTP on Vercel sufficient |
| Semantic Search UI | Deferred; UI is a separate repository |
| Global State DI Refactoring | Mitigated with `isolate: true` + `pool: 'forks'` |

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
| M7 | Search SDK + CLI + Result + TSDoc | ✅ DONE |
| M7a | SDK Validation against Real ES | ✅ DONE |
| M7b | Public Release Readiness | ✅ DONE |
| M7c | Developer Onboarding Experience | ✅ DONE |
| M7d | Code Quality Remediation (TSDoc warnings, type shortcuts) | ✅ DONE |
| **M8** | **MCP Search Integration** | 🔄 **IN PROGRESS** (WS1-WS4 complete, WS5 remains) |
| M9 | SDK Workspace Decomposition (ADR-108, Step 1: 2-way split) | 📋 Planned |
| M10 | Castr Integration | 📋 Planned |
| M11 | Search Quality Enhancements | 📋 Future |
| M12 | Ontology Resource | 📋 Planned |

---

## Quality Gates

Run after every piece of work, from repo root:

```bash
pnpm clean
pnpm type-gen
pnpm build
pnpm type-check
pnpm format:root
pnpm markdownlint:root
pnpm lint:fix
pnpm test
pnpm test:ui
pnpm test:e2e
pnpm smoke:dev:stub
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

**SDK Workspace Decomposition**: [ADR-108][adr-108-rel]
defines the 4-workspace end state. Item #2 Step 1 (2-way
split) is the first concrete action. The generic pipeline
(WS1) and generic runtime (WS3) extractions follow after
Castr integration. See the ADR for dependency graph and
plugin interface design.

**Runtime vs Type-Gen MCP Tools**: Some aggregated tools
(`search`, `fetch`) are defined at runtime instead of type-gen
time. In the 4-workspace architecture, aggregated tool
configuration belongs in WS2 (Oak Type-Gen) and the generated
output is consumed by WS4 (Oak Runtime).

**Castr**: External library (`@engraph/castr`) being developed
to replace both `openapi-zod-client` and `openapi3-ts`. Per
ADR-108, Castr is a dependency of WS1 (Generic Pipeline).
The existing adapter can stay in place initially during
integration; removal follows once Castr output is validated.
Requirements and fixtures are in
[external/castr/](external/castr/). Local development
checkout at `~/code/personal/castr`.

[adr-108-rel]: ../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md
