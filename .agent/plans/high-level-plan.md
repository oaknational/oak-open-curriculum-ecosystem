# High-Level Plan

**Last Updated**: 2026-02-22
**Status**: 🔄 Active strategic index
**Scope**: Strategic cross-collection overview for the Oak MCP ecosystem.

This file is a strategic index. Execution detail belongs in collection roadmaps
and active plans.

---

## Milestone Sequence

```text
Milestone 0: Open Source Readiness               🔄 IN PROGRESS
  → Secrets/PII sweep, merge branch, make repo public on GitHub

Milestone 1: Public Alpha                        📋 NEXT
  → Clerk production migration, mcp-ext-app UI architecture

Milestone 2: Post-Alpha Enhancements             📋 PLANNED
  → MCP extensions, architectural enforcement
```

---

## Milestone 0: Open Source Readiness

**Goal**: Make the repository safe to be public on GitHub.

**Remaining work**:

1. Complete merge-blocking plans:
   - [sdk-workspace-separation.md](semantic-search/active/sdk-workspace-separation.md)
   - [widget-search-rendering.md](semantic-search/active/widget-search-rendering.md)
     (Phase 5 resilience hardening pending)
2. Final secrets and PII sweep across the entire repository
   - Verify `pnpm secrets:scan:all` passes
   - Manual review of configuration files, environment examples,
     READMEs, and research documents for any sensitive information
3. Merge `feat/semantic_search_deployment` branch
4. Make repository public on GitHub

**Tracking**: [semantic-search/roadmap.md](semantic-search/roadmap.md)

**Already complete for this milestone**:

- Phase 3a MCP integration
- Search dispatch type safety
- OAuth specification compliance (ADR-113)
- Proxy OAuth AS for Cursor (ADR-115)
- Widget Phases 0-4 (Track 1a + 1b)

---

## Milestone 1: Public Alpha

**Goal**: Enable external users to authenticate and use the MCP server.

**Pre-alpha work**:

1. **Clerk production migration**
   - Research complete:
     [auth/clerk-production-migration.md](../research/auth/clerk-production-migration.md)
   - Blocking decision: shared vs independent Clerk instance
     (Section 0 of the research report)
   - Social providers Phase 1: Google, Microsoft, GitHub
   - Access control strategy, edge rate limiting, operational
     security controls
   - `CLERK_AUTHORIZED_PARTIES` environment variable implementation
2. **MCP ext-app UI architecture** — decision gate
   - Research plan:
     [mcp-extensions-research-and-planning.md](sdk-and-mcp-enhancements/mcp-extensions-research-and-planning.md)
     (Domain A)
   - **Decision gate (before Milestone 1 execution starts)**:
     - **Option X**: Migrate to mcp-ext-app before public alpha
       (Milestone 1 includes UI migration)
     - **Option Y**: Launch public alpha with current widget
       architecture, migrate in Milestone 2
   - The decision depends on Domain A research maturity and ext-app
     standard stability. If the standard is not yet stable enough,
     Option Y is the lower-risk path.

**Post-merge, pre-alpha work** (not merge-blocking):

- Result pattern unification:
  [mcp-result-pattern-unification.md](semantic-search/post-sdk/mcp-integration/mcp-result-pattern-unification.md)
- STDIO/HTTP alignment:
  [stdio-http-server-alignment.md](architecture/stdio-http-server-alignment.md)

---

## Milestone 2: Post-Alpha Enhancements

**Goal**: Extend capabilities and harden architecture after public
alpha feedback.

**Primary streams**:

1. **MCP extensions execution**
   - Full plan:
     [mcp-extensions-research-and-planning.md](sdk-and-mcp-enhancements/mcp-extensions-research-and-planning.md)
   - Covers: host-compatibility research, specialist specification,
     metadata contract hardening, feature backlog
   - Depends on: Milestone 1 complete, widget Phase 5 complete
2. **Architectural enforcement adoption**
   - Full plan:
     [architectural-enforcement-adoption.md](agentic-engineering-enhancements/architectural-enforcement-adoption.md)
   - Covers: ESLint boundary rules, dependency-cruiser, knip dead
     code detection, cross-agent standardisation
   - Implements: [ADR-119](../../docs/architecture/architectural-decisions/119-agentic-engineering-practice.md)
3. **Social providers Phase 2**: Apple, LinkedIn, GitLab
4. **Search quality stream progression** via semantic-search roadmap
   (Phase 4)

**Supporting plans**:

- [concept-preservation-and-supersession-map.md](sdk-and-mcp-enhancements/concept-preservation-and-supersession-map.md)
- [folder-disposition-ledger.md](sdk-and-mcp-enhancements/folder-disposition-ledger.md)

---

## SDK Decomposition Trajectory (ADR-108)

Strategic architecture remains anchored in:

- [ADR-108](../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md)
- [semantic-search/active/sdk-workspace-separation.md](semantic-search/active/sdk-workspace-separation.md)
- [pipeline-enhancements/sdk-workspace-separation-plan.md](pipeline-enhancements/sdk-workspace-separation-plan.md)

---

## Collection Status

| Collection | Strategic Role | Current Status | Primary Entry |
|------------|----------------|----------------|---------------|
| `semantic-search/` | Merge-prep execution and search roadmap | 🔄 Active | [semantic-search/roadmap.md](semantic-search/roadmap.md) |
| `agentic-engineering-enhancements/` | System-hardening via architectural constraints and AI guardrails | 📋 Milestone 2 | [architectural-enforcement-adoption.md](agentic-engineering-enhancements/architectural-enforcement-adoption.md) |
| `sdk-and-mcp-enhancements/` | Post-merge MCP/extensions governance and concept preservation | 📋 Milestone 1-2 | [sdk-and-mcp-enhancements/README.md](sdk-and-mcp-enhancements/README.md) |
| `pipeline-enhancements/` | Architecture decomposition and reusable pipeline trajectory | 📋 Planned | [pipeline-enhancements/sdk-workspace-separation-plan.md](pipeline-enhancements/sdk-workspace-separation-plan.md) |
| `architecture/` | Cross-cutting architecture and alignment backlog | 📋 Milestone 1 | [architecture/stdio-http-server-alignment.md](architecture/stdio-http-server-alignment.md) |
| `quality-and-maintainability/` | Quality/system-hardening backlog | 📋 Planned | [global-state-elimination-and-testing-discipline-plan.md](quality-and-maintainability/global-state-elimination-and-testing-discipline-plan.md) |
| `dev-tooling-and-dev-ai-support/` | Tooling and contract-testing enablement | 📋 Planned | [contract-testing-schema-evolution-plan.md](dev-tooling-and-dev-ai-support/contract-testing-schema-evolution-plan.md) |
| `external/` | Upstream and external dependency requirements | 📋 Reference | [ooc-api-wishlist/index.md](external/ooc-api-wishlist/index.md) |
| `archive/` | Historical completed/superseded plans | ✅ Reference | [archive/](archive/) |

---

## Recent Completions

Canonical completion index:

- [completed-plans.md](completed-plans.md)

Recent semantic-search completions include:

1. Phase 3a MCP integration
2. Search dispatch type safety
3. OAuth specification compliance
4. Proxy OAuth AS for Cursor
5. Widget Phase 0 (Track 1a) + post-Phase-0 reviewer fixes (B3 data shape, ESLint DRY, CTA centralisation, dead code removal)
6. Widget Phases 1-4 (Track 1b) — search, browse, explore renderers

---

## Quality Gates

From repo root, in order:

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

---

## Foundation Recommitment

Before starting any plan execution phase:

1. [rules.md](../directives/rules.md)
2. [testing-strategy.md](../directives/testing-strategy.md)
3. [schema-first-execution.md](../directives/schema-first-execution.md)

First question:

- Could it be simpler without compromising quality?
