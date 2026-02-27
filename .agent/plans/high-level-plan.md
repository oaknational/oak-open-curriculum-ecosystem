# High-Level Plan

**Last Updated**: 2026-02-26
**Status**: 🔄 Active strategic index
**Scope**: Strategic cross-collection overview for the Oak MCP ecosystem.

This file is a strategic index. Execution detail belongs in collection roadmaps
and active plans. Per-milestone summaries (audience, value, progression gates):
[milestones/](../milestones/).

---

## Milestone Sequence

```text
Milestone 0: Open Private Alpha                  🔄 IN PROGRESS
  → Make the repo public — external teams can build on Oak's curriculum
  → Secrets/PII sweep, docs remediation, merge branch, make repo public
  → Repo public, HTTP server still private alpha (invitation-only)

Milestone 1: Open Public Alpha                   📋 NEXT
  → Teachers use AI tools to access curriculum directly
  → Clerk production migration, Sentry verification, rate limiting
  → Repo public, HTTP server publicly accessible with production auth

Milestone 2: Post-Alpha Enhancements             📋 PLANNED
  → Richer curriculum interactions, more tools can connect
  → MCP extensions, architectural enforcement

Milestone 3: Public Beta                         📋 PLANNED
  → Production-grade reliability for daily teacher use
  → Mutation testing, observability, quality metrics, supply chain,
    Vercel log drain verification
```

### Milestone State Progression

| State | Repo | HTTP Server | Auth | Key requirement |
|---|---|---|---|---|
| Closed private alpha | Private | Private alpha | Test Clerk | Current state |
| Open private alpha (M0) | **Public** | Private alpha | Test Clerk | Docs remediation |
| Open public alpha (M1) | Public | **Public alpha** | **Prod Clerk** | Clerk, Sentry, rate limiting |
| Post-alpha (M2) | Public | Public alpha | Prod Clerk | MCP extensions, enforcement |
| Public beta (M3) | Public | **Public beta** | Prod Clerk | Mutation testing, observability |

---

## Milestone 0: Open Private Alpha

**Goal**: Make the repository safe to be public on GitHub. The HTTP MCP
server remains private alpha (invitation-only) at this stage.

**User impact**: The SDK, MCP servers, and search infrastructure become publicly
available — external developers and edtech teams can start building curriculum
tools on Oak's open data for the first time.

**Remaining work**:

1. ~~Complete merge-blocking plans~~ — SDK workspace separation **complete**
   (archived [sdk-workspace-separation.md](semantic-search/archive/completed/sdk-workspace-separation.md))
2. **Documentation remediation** — 17 docs-only items from onboarding
   simulations (G4). Estimated: 1 focused session.
   See [release-plan-m1.plan.md](release-plan-m1.plan.md) §Next Steps.
3. Final secrets and PII sweep across the entire repository
   - Verify `pnpm secrets:scan:all` passes
   - Manual review of configuration files, environment examples,
     READMEs, and research documents for any sensitive information
4. Merge `feat/semantic_search_deployment` branch
5. Make repository public on GitHub

**Tracking**: [semantic-search/roadmap.md](semantic-search/roadmap.md)

**Already complete for this milestone**:

- Search results quality — fuzziness aligned to `AUTO:6,9`,
  score filtering at `DEFAULT_MIN_SCORE = 0.02`, total semantics
  unified, four architecture reviewers invoked
  ([ADR-120](../../docs/architecture/architectural-decisions/120-per-scope-search-tuning.md),
  [archived plan](semantic-search/archive/completed/search-results-quality.md))
- Phase 3a MCP integration
- Search dispatch type safety
- OAuth specification compliance (ADR-113)
- Proxy OAuth AS for Cursor (ADR-115)
- Widget Phases 0-5 (Track 1a + 1b) — including Phase 5 resilience
  hardening
- MCP tool snagging — 5 SDK tool bugs fixed with TDD, smoke-tested
  end-to-end (2026-02-23)
- Logger architectural bug — SDK logger instances fixed with DI
  and proper OTEL attributes

---

## Milestone 1: Open Public Alpha

**Goal**: Enable external users to authenticate and use the MCP server.
The HTTP MCP server transitions from private alpha (invitation-only) to
public alpha (open access with production auth).

**User impact**: Teachers and developers can use AI assistants (ChatGPT, Claude,
Gemini) to access Oak's curriculum directly — asking questions about lessons,
finding resources, and adapting content without leaving their existing tools.

**Public-alpha UX baseline**:

1. SDK works.
2. Search works.
3. MCP server works.
4. ChatGPT key commands show basic branding.

**Remaining non-UX blockers**:

1. Clerk production instance migration.
2. Basic Sentry logging verification.

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
2. **MCP Apps extension / Claude basic branding** — UX decision gate
   - Research plan:
     [mcp-extensions-research-and-planning.md](sdk-and-mcp-enhancements/mcp-extensions-research-and-planning.md)
     (Domain A)
   - **Decision gate (before Milestone 1 execution starts)**:
     - **Option X**: support MCP Apps extension enough to show basic branding in
       Claude before public alpha
     - **Option Y**: launch public alpha with ChatGPT basic branding only and
       add Claude branding support in Milestone 2
   - The decision depends on Domain A research maturity and ext-app
     standard stability. If the standard is not yet stable enough,
     Option Y is the lower-risk path.
3. **Basic Sentry logging verification**
   - Tracking plan:
     [observability-and-quality-metrics.plan.md](architecture-and-infrastructure/observability-and-quality-metrics.plan.md)
   - Minimum alpha gate: runtime errors and basic operational signals visible in
     Sentry for core services
4. **Onboarding simulations rerun (pre-alpha gate)**
   - Canonical plan:
     [onboarding-simulations-public-alpha-readiness.md](developer-experience/onboarding-simulations-public-alpha-readiness.md)
   - Run updated simulations across the 8 baseline personas and close any
     remaining P0 blockers before Milestone 1 exit.
5. **Security and privacy baseline progression**
   - Collection roadmap:
     [security-and-privacy/roadmap.md](security-and-privacy/roadmap.md)
   - Immediate priority sequence:
     - hallucination guarding for security-relevant claims
     - evidence-based claim verification
   - Lower-priority controls (sandboxing expansion and prompt-injection
     automation) tracked as deferred notes until the first two controls
     are operational.
6. **User-experience contract for public alpha**
   - Collection hub:
     [user-experience/README.md](user-experience/README.md)
   - Alpha readiness contract:
     [user-experience/public-alpha-experience-contract.md](user-experience/public-alpha-experience-contract.md)
   - Confirms in-scope users (educator, engineering/Ed-Tech) and explicit
     learner deferment conditions.

**Post-merge, pre-alpha work** (not merge-blocking):

- Result pattern unification:
  [mcp-result-pattern-unification.md](semantic-search/future/06-mcp-consumer-integration/mcp-result-pattern-unification.md)
- STDIO/HTTP alignment:
  [stdio-http-server-alignment.md](architecture-and-infrastructure/stdio-http-server-alignment.md)
- no-console ESLint enforcement (~110 files, largely mechanical):
  [no-console-enforcement.plan.md](architecture-and-infrastructure/no-console-enforcement.plan.md)

---

## Milestone 2: Post-Alpha Enhancements

**Goal**: Extend capabilities and harden architecture after public
alpha feedback.

**User impact**: Richer curriculum interactions through MCP extensions, broader
authentication options, and stronger architectural quality — more tools can
connect to curriculum data, and the ones that do are more reliable.

**Primary streams**:

1. **MCP extensions execution**
   - Full plan:
     [mcp-extensions-research-and-planning.md](sdk-and-mcp-enhancements/mcp-extensions-research-and-planning.md)
   - Covers: host-compatibility research, specialist specification,
     metadata contract hardening, feature backlog
   - Depends on: Milestone 1 complete, widget Phase 5 complete
2. **Architectural enforcement adoption**
   - Full plan:
     [architectural-enforcement-adoption.plan.md](agentic-engineering-enhancements/architectural-enforcement-adoption.plan.md)
   - Covers: ESLint boundary rules, dependency-cruiser, knip dead
     code detection, agentic grounding
   - Implements: [ADR-119](../../docs/architecture/architectural-decisions/119-agentic-engineering-practice.md)
3. **Cross-agent standardisation**
   - Full plan:
     [cross-agent-standardisation.plan.md](agentic-engineering-enhancements/cross-agent-standardisation.plan.md)
   - Covers: skill frontmatter, command portability, YAGNI cleanup,
     workspace context
   - Implements: [ADR-119](../../docs/architecture/architectural-decisions/119-agentic-engineering-practice.md)
4. **Hallucination and evidence guard adoption**
   - Full plan:
     [hallucination-and-evidence-guard-adoption.plan.md](agentic-engineering-enhancements/hallucination-and-evidence-guard-adoption.plan.md)
   - Covers: hallucination guard policy, claim-to-evidence verification,
     and merge-readiness evidence standards
   - Primary artefact: [evidence-bundle.template.md](agentic-engineering-enhancements/evidence-bundle.template.md)
5. **Security and privacy hardening progression**
   - Collection roadmap:
     [security-and-privacy/roadmap.md](security-and-privacy/roadmap.md)
   - Covers: protocol strictness baseline, auth/token handling baseline,
     and tool-governance baseline, after hallucination/evidence
     safeguards are established
6. **Social providers Phase 2**: Apple, LinkedIn, GitLab
7. **Search quality stream progression** via semantic-search roadmap
   (Phase 4)

**Supporting plans**:

- [concept-preservation-and-supersession-map.md](sdk-and-mcp-enhancements/concept-preservation-and-supersession-map.md)

---

## Milestone 3: Public Beta

**Goal**: Achieve production-grade quality assurance and observability
before exiting public alpha and entering public beta.

**User impact**: Production-grade reliability for tools that teachers depend on
daily. Measurable quality assurance ensures curriculum resources maintain high
pedagogical standards, and supply chain controls secure the published packages.

**Pre-beta gates** (all must be operational before beta):

1. **Mutation testing**
   - Full plan:
     [mutation-testing-implementation.plan.md](agentic-engineering-enhancements/mutation-testing-implementation.plan.md)
   - Covers: Stryker integration, `pnpm mutate`, workspace roll-out,
     CI integration
   - Validates: tests actually protect behaviour, not just achieve
     coverage
   - Note: Stryker is already a devDependency with a `pnpm mutate` turbo
     task. Blocks public beta but not public alpha.
2. **Observability and quality metrics**
   - Full plan:
     [observability-and-quality-metrics.plan.md](architecture-and-infrastructure/observability-and-quality-metrics.plan.md)
   - Covers: structured logging, monitoring, alerting, quality metrics
     dashboards (duplication rate, complexity trends, change failure
     rate)
3. **Vercel log drain verification**
   - Configure and verify a log drain for production. Vercel's default
     log retention is 1 hour — insufficient for post-launch diagnostics.
   - Tracked from onboarding simulation R29.
4. **Supply chain controls** (if npm publishing is imminent)
   - Icebox stub:
     [supply-chain-controls.md](icebox/supply-chain-controls.md)
   - Covers: SBOM generation, SLSA provenance, artifact signing,
     dependency scanning

**Depends on**: Milestone 2 complete (architectural enforcement
provides the boundary checks that quality metrics will track).

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
| `semantic-search/` | Merge-prep execution and search roadmap (search quality + SDK separation) | 🔄 Active | [semantic-search/roadmap.md](semantic-search/roadmap.md) |
| `agentic-engineering-enhancements/` | System-hardening: architectural constraints, AI guardrails, mutation testing | 📋 Milestone 2-3 | [hallucination-and-evidence-guard-adoption.plan.md](agentic-engineering-enhancements/hallucination-and-evidence-guard-adoption.plan.md), [architectural-enforcement-adoption.plan.md](agentic-engineering-enhancements/architectural-enforcement-adoption.plan.md), [cross-agent-standardisation.plan.md](agentic-engineering-enhancements/cross-agent-standardisation.plan.md), [mutation-testing-implementation.plan.md](agentic-engineering-enhancements/mutation-testing-implementation.plan.md) |
| `security-and-privacy/` | Security hardening progression with priority on hallucination guards and evidence-backed claims | 📋 Milestone 1-2 | [security-and-privacy/roadmap.md](security-and-privacy/roadmap.md) |
| `sdk-and-mcp-enhancements/` | MCP extensions, SDK pipeline evolution, and concept preservation | 📋 Milestone 1-2 | [sdk-and-mcp-enhancements/README.md](sdk-and-mcp-enhancements/README.md) |
| `user-experience/` | Persona-level outcome contract for public alpha and post-alpha scope progression | 📋 Milestone 1-2 | [user-experience/README.md](user-experience/README.md), [user-experience/public-alpha-experience-contract.md](user-experience/public-alpha-experience-contract.md) |
| `architecture-and-infrastructure/` | Cross-cutting architecture, system quality, and observability | 📋 Milestone 1 / 3 | [architecture-and-infrastructure/README.md](architecture-and-infrastructure/README.md) |
| `developer-experience/` | SDK publishing, generated docs, tooling | 📋 Planned | [tsdoc-generated-docs-overhaul.plan.md](developer-experience/tsdoc-generated-docs-overhaul.plan.md), [sdk-publishing-and-versioning-plan.md](developer-experience/sdk-publishing-and-versioning-plan.md) |
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
5. Widget Phase 0 (Track 1a) + post-Phase-0 reviewer fixes
6. Widget Phases 1-4 (Track 1b) — search, browse, explore renderers
7. Widget Phase 5 — resilience hardening (error containment,
   JSON.stringify for JS generation, delegated click handlers,
   four-way sync enforcement)
8. MCP tool snagging — 5 SDK tool bugs fixed with TDD,
   smoke-tested end-to-end (32 tools verified)
9. Logger architectural bug — SDK logger DI, OTEL attributes
10. Documentation accuracy improvements (6 workstreams)
11. Search quality investigation — cross-subject ground truth
    infrastructure (`CrossSubjectLessonGroundTruth` type,
    `APPLE_LESSONS` entry), root cause analysis (fuzziness,
    no min_score, ELSER volume, transcript amplification)
12. Search quality remediation — fuzziness `AUTO:6,9` for
    lessons/units, `DEFAULT_MIN_SCORE = 0.02`, `total` semantics
    unified as `results.length`, module extractions
    (`rrf-score-processing.ts`, `search-sequences.ts`,
    `unit-doc-mapper.ts`), ADR-120 written

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
