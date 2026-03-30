---
plan_id: high-level-plan
title: "High-Level Plan"
type: strategic-index
status: active
last_updated: 2026-03-13
---

# High-Level Plan

**Status**: 🔄 Active strategic index
**Scope**: Strategic cross-collection overview for the Oak Open Curriculum ecosystem.

This file is a strategic index. Execution detail belongs in collection roadmaps
and active plans. Per-milestone summaries (audience, value, progression gates):
[milestones/](../milestones/).

---

## Milestone Sequence

```text
Milestone 0: Open Private Alpha                  ✅ COMPLETE
  → Make the repo public — external teams can build on Oak's curriculum
  → Secrets/PII sweep, docs remediation, merge branch, make repo public
  → Repo public, HTTP server still private alpha (invitation-only)

Milestone 1: Invite-Only Alpha                   ✅ COMPLETE
  → Oak staff and invited users access the MCP server via dev Clerk allowlist
  → Oak email domain + explicit Clerk invitations, no prod Clerk needed
  → Repo public, server live at curriculum-mcp-alpha.oaknational.dev, v1.0.0

Milestone 2: Open Public Alpha                   🔄 NEXT
  → ES re-index + search quality validation
  → Replace OpenAI app with MCP Apps infrastructure
  → Knowledge graph alignment audit
  → Dev Clerk remains; search and graph are the gates

Milestone 3: Public Beta                         📋 PLANNED
  → Production Clerk integration (social providers, public sign-up)
  → Production Sentry + full OTel logging
  → KG alignment (if not completed in M2)
  → Exemplar MCP App UI (user_search tool, React, design input)
  → Operational hardening, extension surfaces, tech debt
```

### Milestone State Progression

| State | Repo | HTTP Server | Auth | Key requirement |
|---|---|---|---|---|
| Closed private alpha | Private | Private alpha | Test Clerk | — |
| Open private alpha (M0) | **Public** | Private alpha | Test Clerk | ✅ Complete |
| Invite-only alpha (M1) | Public | **Invite-only alpha** | Dev Clerk + allowlist | ✅ Complete |
| Open public alpha (M2) | Public | **Open public alpha** | Dev Clerk | ES re-index, MCP Apps, KG alignment |
| Public beta (M3) | Public | **Public beta** | **Prod Clerk** | Prod Clerk, Prod Sentry+OTel, KG alignment, exemplar UI |

---

## Immediate Next Intentions

The next execution sequence is currently:

1. ~~Implement oak-preview MCP snagging and deploy the resulting fixes.~~
   ✅ COMPLETE — all phases done, branch deployed. Archived to
   [oak-preview-mcp-snagging.execution.plan.md](sdk-and-mcp-enhancements/archive/completed/oak-preview-mcp-snagging.execution.plan.md).
2. Re-download the bulk data, re-process it, re-index the Elasticsearch
   instance, and validate that stale search/index issues have cleared.
   🔄 IN PROGRESS — recovery-and-guardrails is now the primary incident lane;
   lifecycle ingest run completed upload but failed metadata commit
   (`strict_dynamic_mapping_exception` on `previous_version`), with salvage-first
   recovery and anti-recurrence guardrails now the active execution path.
3. Implement
   [mcp-app-extension-migration.plan.md](sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md)
   and deploy that migration work.
4. The first graph-enablement slice has now been promoted into
   [kg-alignment-audit.execution.plan.md](semantic-search/current/kg-alignment-audit.execution.plan.md).
   Use its outputs to decide whether the next graph promotion is separate Neo4j
   provisioning, Elasticsearch projection work, or explanation-first graph
   augmentation.

This sequence reflects current user priority ahead of broader Milestone 2 and
Milestone 3 backlog items.

---

## Milestone 0: Open Private Alpha — COMPLETE

**Goal**: Make the repository safe to be public on GitHub. The HTTP MCP
server remains private alpha (invitation-only) at this stage.

**User impact**: The SDK, MCP servers, and search infrastructure become publicly
available — external developers and edtech teams can start building curriculum
tools on Oak's open data for the first time.

**Completed** (2026-03-02):

- `feat/semantic_search_deployment` branch merged to `main`
- SDK workspace separation (archived
  [sdk-workspace-separation.md](semantic-search/archive/completed/sdk-workspace-separation.md))
- Documentation remediation (17 items, 4 onboarding reruns)
- ESLint OOM fix (graph data dedup, vocab/vocab-data split)
- Search results quality (fuzziness `AUTO:6,9`, `DEFAULT_MIN_SCORE = 0.02`,
  ADR-120)
- Phase 3a MCP integration, search dispatch type safety
- OAuth specification compliance (ADR-113), Proxy OAuth AS for Cursor (ADR-115)
- Widget Phases 0-5 (Track 1a + 1b) including Phase 5 resilience hardening
- MCP tool snagging (5 SDK bugs, 32 tools verified)
- Logger architectural bug (DI, OTEL attributes)
- Release workflow fix (Turborepo CI pattern)

Repository made public on GitHub (2026-03-03). Live at
`curriculum-mcp-alpha.oaknational.dev`.

---

## Milestone 1: Invite-Only Alpha

**Goal**: Oak staff and invited users access the MCP server via the
development Clerk instance with an allowlist.

**User impact**: Oak staff and selected partners can use AI assistants
(ChatGPT, Claude, Gemini) to access Oak's curriculum directly. Provides
real-world validation with a controlled user base before broader release.

**Invite-only alpha baseline**:

1. SDK works.
2. Search works.
3. MCP server works.
4. ChatGPT key commands show basic branding.
5. Dev Clerk with allowlist access control (Oak emails + explicit invites).

**Status**: Complete (2026-03-03). All gates satisfied. Server live at
`curriculum-mcp-alpha.oaknational.dev`. v1.0.0 released.

**Not required for this milestone** (deferred to M2 or M3):

- Production Clerk instance
- Social providers (Google, Microsoft, GitHub)
- Full Sentry observability
- Open public access
- Rate limiting beyond upstream API limits

**Post-merge work** (not blocking but valuable):

- Result pattern unification: ✅ COMPLETE —
  [mcp-result-pattern-unification.execution.plan.md](semantic-search/archive/completed/mcp-result-pattern-unification.execution.plan.md)
- STDIO/HTTP alignment:
  [stdio-http-server-alignment.md](architecture-and-infrastructure/future/stdio-http-server-alignment.md)
- no-console + strictness convergence (includes ESLint override removal and boundary/separation lint integration):
  [devx-strictness-convergence.plan.md](developer-experience/active/devx-strictness-convergence.plan.md)

---

## Milestone 2: Open Public Alpha

**Goal**: Deliver reliable search, unified MCP Apps infrastructure, and
initial knowledge graph alignment. Dev Clerk remains; production auth
is deferred to M3.

**User impact**: Invited users get accurate, up-to-date search results
and a single MCP server serving all platforms (ChatGPT, Claude, Cursor).
Graph-augmented curriculum navigation begins to surface.

**Blocking work**:

1. **Elasticsearch re-index and search quality validation** (intention #2)
   - Re-download bulk data, re-process, re-index the Elasticsearch instance
   - Resolve `strict_dynamic_mapping_exception` on `previous_version`
     (recovery-and-guardrails primary lane + supporting incident evidence lane)
   - Validate stale search/index issues have cleared
2. **Replace OpenAI app with MCP Apps infrastructure** (intention #3)
   - Canonical execution plan:
     [mcp-app-extension-migration.plan.md](sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md)
   - **Must include basic branding** for the MCP App (logo, colours,
     metadata visible in Claude Desktop / ChatGPT tool listings)
3. **Knowledge graph alignment audit** (intention #4)
   - First graph-enablement slice:
     [kg-alignment-audit.execution.plan.md](semantic-search/current/kg-alignment-audit.execution.plan.md)
   - Outputs inform whether next graph promotion is separate Neo4j
     provisioning, Elasticsearch projection work, or explanation-first
     graph augmentation

---

## Milestone 3: Public Beta

**Goal**: Operational hardening, extension surfaces, and accumulated tech
debt. Strengthen reliability, observability, and developer experience so
the service is ready for sustained daily use.

**User impact**: More reliable and maintainable platform. Quality
improvements compound: architectural enforcement prevents regression,
observability enables rapid diagnosis, and extension surfaces broaden
platform reach.

**Blocking work**:

1. **Production Clerk integration**
   - Research complete:
     [auth/clerk-production-migration.md](../research/auth/clerk-production-migration.md)
   - Blocking decision: shared vs independent Clerk instance
     (Section 0 of the research report)
   - Social providers Phase 1: Google, Microsoft, GitHub
   - `CLERK_AUTHORIZED_PARTIES` environment variable implementation
   - Public sign-up with disposable email blocking
   - Edge rate limiting on OAuth proxy endpoints
     (`/oauth/register`, `/oauth/authorize`, `/oauth/token`) —
     [m2-public-alpha-auth-rate-limits.execution.plan.md](semantic-search/current/m2-public-alpha-auth-rate-limits.execution.plan.md)
2. **Production Sentry integration with full OTel logging**
   - Full plan:
     [observability-and-quality-metrics.plan.md](architecture-and-infrastructure/current/observability-and-quality-metrics.plan.md)
   - Covers: Sentry configuration, structured logging, monitoring,
     alerting, quality metrics dashboards
   - Execution plan:
     [sentry-otel-integration.execution.plan.md](architecture-and-infrastructure/current/sentry-otel-integration.execution.plan.md)
     — reference implementation exists in `starter-app-spike`
3. **Knowledge graph alignment** (if not completed in M2)
   - [kg-alignment-audit.execution.plan.md](semantic-search/current/kg-alignment-audit.execution.plan.md)
4. **Exemplar MCP App UI experience (`user_search` tool)**
   - New user-facing search tool (`user_search`/`userSearch`) with the same
     capabilities as the existing `search` tool but designed for interactive
     use within Claude Desktop, ChatGPT, and other MCP App hosts
   - React components rendered via
     [MCP Apps UI extensions](https://modelcontextprotocol.io/extensions/apps/overview)
   - Requires design input for layout, interaction patterns, and branding
   - Goal: demonstrate a polished, interactive curriculum search experience
     as the reference MCP App UI

**Additional streams** (drawn from existing plans across collections):

1. **Operational hardening**
   - Monitoring and alerting (sign-up velocity, abuse patterns, Clerk
     API quota)
   - Canonical host enforcement verified on Vercel
   - Incident response procedures documented
   - Vercel log drain verification (tracked from onboarding simulation R29)
2. **Extension surfaces**
   - MCP Apps standard migration: adapter pattern, platform detection, widget/MIME/metadata migration
   - One MCP server serving ChatGPT, Claude, Cursor, and generic MCP hosts via MCP Apps standard
   - Migration plan:
     [roadmap.md](sdk-and-mcp-enhancements/roadmap.md)
   - Supporting:
     [concept-preservation-and-supersession-map.md](sdk-and-mcp-enhancements/concept-preservation-and-supersession-map.md)
3. **Architectural enforcement adoption**
   - Full plan:
     [architectural-enforcement-adoption.plan.md](agentic-engineering-enhancements/current/architectural-enforcement-adoption.plan.md)
   - Covers: ESLint boundary rules, dependency-cruiser, knip dead
     code detection
4. **Mutation testing**
   - Full plan:
     [mutation-testing-implementation.plan.md](agentic-engineering-enhancements/current/mutation-testing-implementation.plan.md)
   - Covers: Stryker integration, `pnpm mutate`, workspace roll-out
5. **Hallucination and evidence guard adoption**
   - Full plan:
     [hallucination-and-evidence-guard-adoption.plan.md](agentic-engineering-enhancements/current/hallucination-and-evidence-guard-adoption.plan.md)
6. **Cross-agent standardisation**
   - Full plan:
     [cross-agent-standardisation.plan.md](agentic-engineering-enhancements/archive/completed/cross-agent-standardisation.plan.md)
7. **Security and privacy hardening**
   - Collection roadmap:
     [security-and-privacy/roadmap.md](security-and-privacy/roadmap.md)
8. **Supply chain controls** (if npm publishing is imminent)
   - Icebox stub:
     [supply-chain-controls.md](icebox/supply-chain-controls.md)
9. **Search quality stream progression** via semantic-search roadmap
10. **Developer experience** — TSDoc overhaul, SDK publishing,
    strictness convergence (`vi.mock`/assertions/no-console/override removal) plus delegated boundary/separation lint hardening

---

## SDK Decomposition Trajectory (ADR-108)

Strategic architecture remains anchored in:

- [ADR-108](../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md)
- [SDK workspace separation plan](semantic-search/archive/completed/sdk-workspace-separation.md) (archived, complete)
- Pipeline framework extraction (iceboxed):
  [icebox/openapi-pipeline-framework.md](icebox/openapi-pipeline-framework.md)

---

## Collection Status

| Collection | Strategic Role | Current Status | Primary Entry |
|------------|----------------|----------------|---------------|
| `sdk-and-mcp-enhancements/` | MCP extension surfaces, SDK pipeline evolution | 📋 M3 Public Beta | [sdk-and-mcp-enhancements/README.md](sdk-and-mcp-enhancements/README.md) |
| `semantic-search/` | Search quality roadmap and SDK integration | 📋 M3 Public Beta | [semantic-search/roadmap.md](semantic-search/roadmap.md) |
| `agentic-engineering-enhancements/` | Architectural constraints, AI guardrails, mutation testing | 📋 M3 Public Beta | [agentic-engineering-enhancements/README.md](agentic-engineering-enhancements/README.md) |
| `security-and-privacy/` | Security hardening, hallucination guards, evidence-backed claims | 📋 M3 Public Beta | [security-and-privacy/roadmap.md](security-and-privacy/roadmap.md) |
| `architecture-and-infrastructure/` | Cross-cutting architecture, observability, system quality | 📋 M3 Public Beta | [architecture-and-infrastructure/README.md](architecture-and-infrastructure/README.md) |
| `user-experience/` | Persona-level outcome contracts | 📋 M1-M2 | [user-experience/README.md](user-experience/README.md) |
| `developer-experience/` | SDK publishing, generated docs, tooling | 📋 M1-M3 mixed lanes | [active/README.md](developer-experience/active/README.md) |
| `external/` | Upstream and external dependency requirements | 📋 Reference | [ooc-api-wishlist/index.md](external/ooc-api-wishlist/index.md) |
| `archive/` | Historical completed/superseded plans | ✅ Reference | [archive/](archive/) |

---

## Recent Completions

Canonical completion index:

- [completed-plans.md](completed-plans.md)

**Milestone 0 completion** (2026-03-03):

- `feat/semantic_search_deployment` merged to `main` (2026-03-02)
- Repository made public on GitHub (2026-03-03)
- Server live at `curriculum-mcp-alpha.oaknational.dev`
- ESLint OOM resolved (graph data dedup, vocab/vocab-data split)
- Release workflow fixed (Turborepo CI pattern)
- All 4 onboarding reruns complete, no P0 blockers
- 32 MCP tools validated against oak-remote-preview

See [release-plan-m1.plan.md](archive/completed/release-plan-m1.plan.md) for full history.

---

## Quality Gates

From repo root, in order:

```bash
pnpm clean
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm format:root
pnpm markdownlint:root
pnpm subagents:check
pnpm lint:fix
pnpm test
pnpm test:ui
pnpm test:e2e
pnpm smoke:dev:stub
```

---

## Foundation Recommitment

Before starting any plan execution phase:

1. [principles.md](../directives/principles.md)
2. [testing-strategy.md](../directives/testing-strategy.md)
3. [schema-first-execution.md](../directives/schema-first-execution.md)

First question:

- Could it be simpler without compromising quality?
