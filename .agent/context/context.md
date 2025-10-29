# Context: Oak MCP Ecosystem - Current State

**Last Updated**: 2025-10-29  
**Branch**: `main`  
**Current Focus**: OAuth implementation planning complete, ready for next priority

---

## Recent Completed Work

### 1. Upstream API Metadata Wishlist (✅ COMPLETE - Merged to main)

**What**: Comprehensive enhancement proposals for Oak Curriculum API OpenAPI specification.

**Status**: Completed and merged via PR #32.

**Key Items** (15 total):

1. Enhanced operation descriptions (**High** priority)
2. Pagination support (**High**)
3. Ontology endpoint (**High** - includes stop-gap + Data Platform integration plan)
4. Content sensitivity warnings (**Medium-High**)
5. **Programme context and variant metadata** (**High** - NEW, critical for OWA alignment)
6. Related content linking (**Medium**)
7. Custom schema extensions (**Medium**)
8. Behavioural metadata (`x-oak-behavior`) (**Medium**)
9. Thread enhancements (**Medium-High** - progression tracking)
10. **Standardise parameter types with `$ref`** (**Medium** - NEW, fixes `year` string vs number inconsistency)
11. Expose Zod validators via npm/API (**Medium-High**)
12. Response examples (**Medium**)
13. Canonical URL patterns (**Medium** - MUST match OWA at `https://www.thenational.academy/`)
14. Performance hints (**Low**)
15. **Complete OpenAPI Best Practices Checklist** (**Low-Medium** - NEW, comprehensive with 7 sections A-G)

**Critical Insights**:

- **Sequence vs Programme**: Sequences are broad API structures; Programmes are derived, contextualized views (Sequence + Programme Factors = Programme). Waiting on Data Team for formal definitions.
- **Threads**: Cross-unit conceptual progressions (~200 threads, key pedagogical structure)
- **Programme Factors**: Year, Tier, Exam Board, Pathway, Legacy flag
- **OpenAPI Best Practices**: 7 sections added (Core Metadata, Documentation, Error Handling, Response Headers, Schema Constraints, Pagination, Additional)

**Documentation Created**:

- `.agent/research/api-deep-dive-findings.md`
- `.agent/research/sequence-vs-programme-analysis.md`
- `.agent/research/tier-analysis.md`
- `.agent/research/SEQUENCE_VS_PROGRAMME_SUMMARY.md`
- `.agent/research/threads-analysis.md`
- `.agent/research/curriculum-structure-3d-model.md`

**Updated Docs**:

- `docs/architecture/curriculum-ontology.md` - Separated Sequence and Programme, elevated Threads
- `.agent/plans/upstream-api-metadata-wishlist.md` - 15 items with examples, references to OpenAPI learning site

### 2. Clerk OAuth 2.1 Implementation Plan (✅ COMPLETE - Ready for Implementation)

**What**: Production-ready plan to replace custom OAuth demo with Clerk.

**Status**: Comprehensive plan created, validated against code, aligned with all strategic directives. Branch `feat/oauth_support` pushed with updated plan.

**Scope**: `apps/oak-curriculum-mcp-streamable-http` (Express MCP server on Vercel) ONLY

**Timeline**: ~27 hours (recommend 2 weeks with buffer)

- Phase 0: 2.5 hours (Clerk config, 5 screenshots)
- Phase 1: 6.5 hours (Implementation with TDD, 7 tasks)
- Phase 2: 7 hours (Tests & docs, 4 tasks)
- Phase 3: 11 hours (Deploy & monitor, 7 tasks, 13 screenshots)

**Critical Fixes Identified**:

1. ⚠️ **CORS doesn't expose `WWW-Authenticate` header** - Fixed in Phase 1, task 3b
2. ⚠️ **env.ts cleanup incomplete** - Now removes 6 vars (was 4)
3. ⚠️ **TDD violation** - Restructured with interleaved Red→Green→Refactor cycles
4. ⚠️ **E2E test strategy vague** - Now specific: 11 tests in `server.e2e.test.ts` with line numbers
5. ⚠️ **Monitoring undefined** - Added 4-hour checklist with decision framework

**Key Insights from Clerk Docs**:

- Must use `cors({ exposedHeaders: ['WWW-Authenticate'] })`
- Middleware order: `clerkMiddleware()` global, `mcpAuthClerk` per-route
- Dynamic Client Registration is REQUIRED
- Env vars: `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` (not `NEXT_PUBLIC_*`)
- We use `@oaknational/mcp-env` (don't need `dotenv`)

**Deliverables**:

- Updated plan (2,820 lines, maximum detail)
- 4 Architecture Decision Records
- Comprehensive runbook (5 scenarios, health checks, escalation)
- Testing strategy (13 E2E test specs, smoke test docs)
- Monitoring framework (hourly checklist, 4-hour monitoring loop)

**Plan Location**: `.agent/plans/mcp-oauth-implementation-plan.md`

### 3. Environment Configuration (✅ COMPLETE)

**`.env.example` Updates**:

- ✅ Removed incorrect JWKS multi-line format (backslash continuation doesn't work)
- ✅ Removed unused Clerk vars (FRONT_END_API_URL, BACK_END_API_URL, JWKS_URL)
- ✅ Fixed naming (CLERK*PUBLISHABLE_KEY, not NEXT_PUBLIC*\*)
- ✅ Added MCP server configuration (BASE_URL, MCP_CANONICAL_URI)
- ✅ Added security configuration (ALLOWED_HOSTS, ALLOWED_ORIGINS)
- ✅ Organized by purpose with helpful comments

---

## Current Priorities (Per High-Level Plan)

**From** `.agent/plans/high-level-plan.md`:

1. **Semantic Search Phase 1** — ✅ NEAR COMPLETE
2. **Curriculum Ontology MCP Resource** — Planned (Priority 2)
   - **Blocker**: Aggregated tools refactor (see `.agent/plans/mcp-aggregated-tools-type-gen-refactor-plan.md`)
3. **OAuth 2.1 / Clerk Integration** — ✅ PLAN COMPLETE (Priority 3)
   - Ready for implementation when becomes active
4. **OpenAI Apps SDK Integration** — Planned (Priority 4)
5. **Semantic Search MCP Integration** — Planned (Priority 5)
6. **Advanced MCP Tools** — DEFERRED (Priority 6)

---

## Key Repository Principles

### Cardinal Rule

ALL static data structures, types, type guards, Zod schemas, validators flow from OpenAPI schema at compile time via `pnpm type-gen`. If upstream schema changes → `pnpm type-gen` → `pnpm build` → working artefacts.

### Schema-First Execution

Runtime files are thin façades. All complexity handled at type-gen time. No hand-authoring of types, schemas, or validators.

### TDD Always

Write tests FIRST (Red), implement code (Green), refactor if needed. Unit tests for pure functions (no I/O, no mocks). Integration tests for code units working together (simple mocks injected as args). E2E tests for running systems (separate process, real I/O).

### No Type Shortcuts

Never use `as`, `any`, `!`, `Record<string, unknown>`, `Object.*`, `Reflect.*` - they destroy type information. Use type guards to narrow to specific types.

---

## Repository Structure

### Apps

- `oak-curriculum-mcp-stdio` - STDIO MCP server (for local Claude Desktop)
- `oak-curriculum-mcp-streamable-http` - **HTTP MCP server on Vercel** (OAuth target)
- `oak-notion-mcp` - Notion MCP server
- `oak-open-curriculum-semantic-search` - Next.js semantic search UI

### Packages

- `sdks/oak-curriculum-sdk` - **Core SDK** with type-gen from OpenAPI schema
- `libs/` - Runtime-adaptive libraries (env, logger, storage, transport)
- `providers/` - Platform providers (Node.js)

### Key Directories

- `.agent/plans/` - Implementation plans
- `.agent/reference-docs/` - Clerk, MCP, OpenAPI docs
- `.agent/research/` - Investigation findings
- `docs/architecture/` - Architecture documentation
- `docs/agent-guidance/` - Rules, testing strategy, Sentry guidance

---

## Critical Files

### Strategic Directives

- `.agent/directives-and-memory/rules.md` - **All rules** (Cardinal Rule, TDD, testing, etc.)
- `.agent/directives-and-memory/schema-first-execution.md` - Schema-first mandate
- `docs/agent-guidance/testing-strategy.md` - TDD, unit/integration/E2E definitions

### Active Plans

- `.agent/plans/mcp-oauth-implementation-plan.md` - **Ready for implementation** (2,820 lines)
- `.agent/plans/high-level-plan.md` - Strategic overview, priority order
- `.agent/plans/upstream-api-metadata-wishlist.md` - API enhancement proposals (shared with API team)
- `.agent/plans/curriculum-ontology-resource-plan.md` - Ontology implementation (blocked by aggregated tools)
- `.agent/plans/mcp-aggregated-tools-type-gen-refactor-plan.md` - **Critical prerequisite** for ontology

### Ontology Work

- `docs/architecture/curriculum-ontology.md` - **Refined** (Programmes ≠ Sequences, Threads elevated)
- `.agent/research/SEQUENCE_VS_PROGRAMME_SUMMARY.md` - Key findings, waiting on Data Team

---

## Open Questions / Blockers

### 1. Sequence vs Programme Definitions (WAITING ON DATA TEAM)

- **Question**: Formal definition of "sequence" vs "programme" and their relationships
- **Current Understanding**: Programme = Sequence + Programme Factors (Year, Tier, Exam Board, etc.)
- **Impact**: Blocks final ontology refinement
- **Source**: `.agent/research/SEQUENCE_VS_PROGRAMME_SUMMARY.md`

### 2. Aggregated Tools Refactor (PREREQUISITE)

- **Blocker**: Current `search` and `fetch` tools are hand-written runtime code
- **Required**: Move to type-gen generation (per Cardinal Rule)
- **Blocks**: Ontology resource implementation, semantic search MCP integration
- **Plan**: `.agent/plans/mcp-aggregated-tools-type-gen-refactor-plan.md`

---

## Environment Setup

### Local Development

- **Location**: `.env` in repo root (gitignored, see `.env.example`)
- **Required vars**:
  - `OAK_API_KEY` - Oak Curriculum API key
  - `CLERK_PUBLISHABLE_KEY` - For OAuth (when implementing)
  - `CLERK_SECRET_KEY` - For OAuth (when implementing)
  - `BASE_URL`, `MCP_CANONICAL_URI` - For OAuth
- **Optional vars**:
  - `REMOTE_MCP_ALLOW_NO_AUTH=true` - Bypass auth for local dev
  - `LOG_LEVEL=debug` - Verbose logging

### Vercel Deployment

- **App**: `oak-curriculum-mcp-streamable-http`
- **URL**: `https://open-api.thenational.academy/mcp` (production)
- **OAuth**: Currently demo AS (to be replaced with Clerk per plan)

---

## Testing Commands

```bash
# Type generation (run after OpenAPI schema changes)
pnpm type-gen

# Quality gates (run after code changes)
pnpm format:root        # Format all code
pnpm type-check        # TypeScript validation
pnpm lint              # ESLint (including boundary enforcement)
pnpm test              # Unit + integration tests (auto in CI)
pnpm build             # Build all workspaces

# E2E tests (not auto in CI, may have side effects)
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e

# Smoke tests
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:stub  # Offline
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:live  # Real API
```

---

## Recent Git Activity

**Current Branch**: `main` (working tree clean)

**Recent Branches**:

- `feat/enhancement_research` - Merged (OpenAPI wishlist enhancements)
- `feat/oauth_support` - Pushed (OAuth plan updates, ready for PR)

**Recent Commits** (on main):

- `22442e9` - "chore: update api wish list" (merged from PR #32)
- Earlier: Ontology updates, thread analysis, sequence vs programme research

---

## Next Actions (When Resuming)

### If Continuing OAuth Work

1. Switch to agent mode
2. Checkout `feat/oauth_support` branch
3. Create PR for review
4. Begin Phase 0: Clerk Configuration (see plan task 0.1)

### If Pivoting to Ontology Work

1. Review prerequisite: `.agent/plans/mcp-aggregated-tools-type-gen-refactor-plan.md`
2. Decide: Implement aggregated tools refactor first, OR create shimmed ontology
3. Review: `.agent/plans/curriculum-ontology-resource-plan.md`

### If Continuing API Wishlist Work

1. Share `.agent/plans/upstream-api-metadata-wishlist.md` with API team
2. Prioritize which items to implement first
3. Create tracking issues for API team

---

## Important Notes

### Code Review Findings

- ✅ OAuth plan claims 100% verified against actual code
- ✅ `apps/oak-curriculum-mcp-streamable-http/src/security.ts` line 72 needs `exposedHeaders: ['WWW-Authenticate']`
- ✅ `apps/oak-curriculum-mcp-streamable-http/src/env.ts` needs 6 old OAuth vars removed (not 4)
- ✅ 15 test files in streamable-http app, 11 tests in `server.e2e.test.ts` need OAuth updates

### Strategic Alignment

- ✅ OAuth is orthogonal to tool schemas (Cardinal Rule preserved)
- ✅ MCP tools continue to flow from `pnpm type-gen` (unchanged by OAuth)
- ✅ Clerk auth is pure runtime middleware (Schema-First compliant)

### Dependencies

- `@clerk/mcp-tools` - To be added in Phase 1
- `@clerk/express` - To be added in Phase 1
- `jose` - To be removed in Phase 1 (replaced by Clerk)

---

## Key Stakeholders / External Dependencies

### Data Team

- **Waiting on**: Formal definitions of "sequence" vs "programme"
- **Impact**: Final ontology refinement

### API Team

- **Deliverable**: `.agent/plans/upstream-api-metadata-wishlist.md`
- **Action**: Prioritize and implement enhancements
- **Note**: Breaking changes are acceptable (major version bump)

### Clerk

- **Service**: OAuth 2.1 Authorization Server
- **Account**: `https://native-hippo-15.clerk.accounts.dev`
- **Status**: Configured, awaiting implementation
- **Docs**: Reviewed and insights incorporated into plan

---

## Quality Status

**All Quality Gates**: ✅ PASSING

- 196 tests passing (46 test files)
- Zero TypeScript errors
- Zero ESLint errors
- Zero Prettier formatting issues
- All 10 packages build successfully

**No Technical Debt**: Clean working tree, no skipped tests, no commented code, no dead code.

---

## Reference Documentation (Local)

### OAuth / Clerk

- `.agent/reference-docs/clerk-build-mcp-server.md` - **PRIMARY** Clerk MCP guide
- `.agent/reference-docs/clerk-express-sdk.md` - Clerk Express integration
- `.agent/reference-docs/mcp-auth-spec.md` - MCP OAuth 2.1 spec
- `.agent/reference-docs/mcp-understanding-auth-in-mcp.md` - OAuth flow tutorial

### MCP

- `.agent/reference-docs/mcp-docs-for-agents.md` - MCP specification (large)
- `.agent/reference-docs/mcp-typescript-sdk-readme.md` - SDK documentation

### OpenAI

- `.agent/reference-docs/openai-apps-sdk-guidance.md` - ChatGPT Developer Mode integration
- `.agent/reference-docs/openai-connector-standards.md` - OpenAI Connector spec

---

## External Resources

### OpenAPI

- <https://learn.openapis.org/best-practices.html> - Best practices
- <https://learn.openapis.org/specification/docs.html> - Documentation and examples
- <https://learn.openapis.org/specification/structure.html> - API structure
- <https://spec.openapis.org/oas/v3.1.0> - OpenAPI 3.1 specification

### Clerk

- <https://clerk.com/docs/expressjs/guides/development/mcp/build-mcp-server> - **PRIMARY** MCP guide
- <https://clerk.com/docs/reference/express/overview> - Express SDK reference
- <https://clerk.com/docs/expressjs/getting-started/quickstart> - Express quickstart
- <https://dashboard.clerk.com/> - Clerk Dashboard
- <https://status.clerk.com/> - Clerk status page

### Oak

- <https://open-api.thenational.academy/api/v0> - Production API
- <https://www.thenational.academy/> - Oak Web Application (OWA)
- <https://www.thenational.academy/sitemap.xml> - OWA sitemap

### MCP

- <https://spec.modelcontextprotocol.io/> - MCP specification
- <https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization> - OAuth spec

---

## Common Commands

### Git Workflow

```bash
git checkout main
git pull origin main
git checkout -b feat/your-feature-name
# ... work ...
git add -A
git commit -m "feat(scope): description"  # Follows conventional commits
git push --set-upstream origin feat/your-feature-name
gh pr create --title "..." --body "..."
```

### Development

```bash
# Start local MCP server (streamable HTTP)
cd apps/oak-curriculum-mcp-streamable-http
pnpm dev

# Run quality gates
pnpm format:root && pnpm type-check && pnpm lint && pnpm test && pnpm build

# Run specific workspace tests
pnpm --filter @oaknational/oak-curriculum-sdk test

# Type generation (after schema changes)
cd packages/sdks/oak-curriculum-sdk
pnpm type-gen
```

---

## Decision Log

### OAuth Implementation Approach

- **Decision**: Use Clerk with `@clerk/mcp-tools` (not custom OAuth infrastructure)
- **Rationale**: 80% time savings, SOC 2 compliant, official MCP support
- **Date**: 2024-10-16, revalidated 2025-10-29

### Sequence vs Programme in API

- **Decision**: Keep "sequence" as core API concept, expose "programme" as derived view
- **Rationale**: Leverages existing API structure, provides granularity OWA needs
- **Status**: Pending Data Team formal definitions
- **Date**: 2025-10-29

### OpenAPI Best Practices Scope

- **Decision**: Comprehensive checklist (15 items, 7 sections in Item #15)
- **Rationale**: Multiplier effect - each schema improvement benefits 4 tool layers
- **Date**: 2025-10-29

---

## Known Issues / Tech Debt

**None** - Working tree clean, all quality gates passing.

**Planned Refactors**:

1. Aggregated tools (`search`, `fetch`) from runtime to type-gen
2. OAuth demo AS to Clerk production AS
3. Ontology exposure as MCP resource

---

## Session Handoff Notes

**What Was Being Worked On**: Finalizing OAuth implementation plan based on code review and Clerk documentation.

**What's Ready**:

- ✅ OAuth plan comprehensive and production-ready
- ✅ `.env.example` fixed with correct Clerk configuration
- ✅ All changes committed and pushed to `feat/oauth_support`

**What's Next** (User Choice):

1. Create PR for OAuth plan review
2. Begin OAuth implementation (Phase 0: Clerk configuration)
3. OR pivot to different priority (ontology, semantic search, etc.)

**No Blockers**: All prerequisites documented, all dependencies identified, plan validated.

**Quality Status**: ✅ All gates passing, no technical debt, clean working tree.
