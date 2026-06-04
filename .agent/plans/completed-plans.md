# Completed Plans

Index of archived plans across all collections. When a plan is completed,
move it to `archive/completed/`, add an entry here, and fix all references
at the source (clean break — no stubs, no redirects).

Before archival, mine completed outcomes into permanent documentation
(ADRs, directives, README files, and other canonical references).

---

## Semantic Search

| Plan | Completed | Key Outcomes | Archive |
|------|-----------|--------------|---------|
| Short-Term PR Snagging | 2026-03-11 | PR snagging pass complete. Checks and review findings resolved. | [archived plan](semantic-search/archive/completed/short-term-pr-snagging.plan.md) |
| MCP Result Pattern Unification | 2026-03-08 | Converged MCP tool execution on `Result<T, E>` across curriculum SDK and MCP consumers. `executeToolCall` returns `Result<ToolExecutionSuccess, McpToolError \| McpParameterError>`, `extractExecutionData` removed, stdio + streamable-http consumers migrated. | [archived plan](semantic-search/archive/completed/mcp-result-pattern-unification.execution.plan.md) |
| SDK Workspace Separation | 2026-02-25 | Split curriculum-sdk into generation (`@oaknational/sdk-codegen`) and runtime workspaces. Phases 0-7 complete. Two pipelines (API + bulk), 11 subpath exports, boundary rules, 4 package/repo renames. 12-gate quality chain, 8 specialist reviews. | [archived plan](semantic-search/archive/completed/sdk-workspace-separation.md) |
| Phase 7 Merge Readiness | 2026-02-25 | Consolidation, full quality gate chain, determinism verification, specialist reviews. F16 drift check implemented then removed (redundant with pnpm check). | [archived plan](semantic-search/archive/completed/phase_7_and_merge_readiness.plan.md) |
| MCP Tool Snagging | 2026-02-23 | 5 SDK tool bugs (response augmentation, suggest, schema validation) fixed with TDD, smoke-tested end-to-end across 32 tools. Logger architectural bug also fixed with DI. | [archived plan](semantic-search/archive/completed/search-snagging.md) |
| Pre-Merge Widget Stabilisation (3h) | 2026-02-22 | Phases 0-5: 18 non-search renderers deleted, 3 renderers built (search, browse, explore), Zod contract tests, XSS hardening, Phase 5 resilience hardening (error containment, JSON.stringify, delegated clicks, four-way sync) | [archived plan](semantic-search/archive/completed/widget-search-rendering.md) |
| Search Dispatch Type Safety (3g) | 2026-02-22 | Eliminated `ScopeDispatcher` type erasure (B1) with switch-based `SearchDispatchResult` union + `default: never` exhaustiveness + `AssertNoSuggestions` invariant guard. Renamed `aggregated-search-sdk/` → `aggregated-search/`, `SEARCH_SDK_*` → `SEARCH_*` (W1). | [archived plan](semantic-search/archive/completed/search-dispatch-type-safety.md) |
| Phase 3a: MCP Search Integration | 2026-02-22 | Three MCP search tools wired (`search`, `browse-curriculum`, `explore-topic`), old REST search deleted, `search-sdk` promoted to `search`, adversarial review (B1-B4, W1-W8) | [archived plan](semantic-search/archive/completed/phase-3a-mcp-search-integration.md) |
| Thread Search SDK Integration | 2026-02 | SDK method, CLI command, benchmarks, 8 GTs across 5 subjects | [archived plan](semantic-search/archive/completed/thread-search-sdk-integration.plan.md) |
| Developer Onboarding Experience | 2026-02 | Onboarding journey, command/link integrity, release runbook | [archived plan](semantic-search/archive/completed/developer-onboarding-experience.plan.md) |
| Public Release Readiness | 2026-02 | Secrets, licence, package.json, docs, GitHub config, npm publish | [archived plan](semantic-search/archive/completed/public-release-readiness.plan.md) |
| 451 + Test Remediation | 2026-01 | HTTP 451 handling, E2E test compliance, stale docs | [archived plan](semantic-search/archive/completed/transcript-451-test-doc-remediation.plan.md) |
| Fail-Fast ES Credentials | 2026-02 | Silent degradation removed, fail-fast on missing creds | [archived plan](semantic-search/archive/completed/fail-fast-elasticsearch-credentials.md) |
| Search Response Tuning | 2026-02 | Response unification, type dedup, ES source filtering | [archived plan](semantic-search/archive/completed/search-response-tuning.md) |
| Env Architecture Overhaul | 2026-02 | `resolveEnv` pipeline, discriminated `RuntimeConfig` (ADR-116) | [archived plan](semantic-search/archive/completed/env-architecture-overhaul.md) |
| Search SDK + CLI | 2026-02 | SDK extraction, 16 I/O methods, `Result<T, E>` pattern | [archived plan](semantic-search/archive/completed/search-sdk-cli.plan.md) |

---

## SDK and MCP Enhancements

| Plan | Completed | Key Outcomes | Archive |
|------|-----------|--------------|---------|
| Generate Widget HTML as Committed TypeScript Constant | 2026-04-10 | Replaced runtime widget filesystem reads with a committed TypeScript constant produced by the widget build, preserved the DI seam for tests, removed the runtime validation/path helpers, and recorded the decision in ADR-156. | [archived plan](sdk-and-mcp-enhancements/archive/completed/embed-widget-html-at-build-time.plan.md) |
| Graph Data Integrity Snagging | 2026-03-11 | Graph integrity defects classified and resolved: bulk data dedup, thread ordering contract, generation invariant enforcement (self-loops, duplicate edges, node payload arrays), MCP pass-through boundary preserved. | [archived plan](sdk-and-mcp-enhancements/archive/completed/graph-data-integrity-snagging.execution.plan.md) |
| WS3 Design Token Infrastructure Prerequisite | 2026-04-02 | Replaced the temporary widget shell with the canonical MCP Apps runtime, landed the minimal `packages/design/` token foundation, passed `pnpm check`, and completed the design-system/config/test/code-review cycle before Phase 4 work. | [archived plan](sdk-and-mcp-enhancements/archive/completed/ws3-design-token-prerequisite.plan.md) |
| Oak Preview MCP Snagging | 2026-03-11 | All 4 phases complete: canonical URL fix, reindex boundary documented, MCP guidance tightened, reviewer gates passed. Plus sequence keyStage filter fix and suggestion URL schema fix. Post-deploy reindex is operational only. | [archived plan](sdk-and-mcp-enhancements/archive/completed/oak-preview-mcp-snagging.execution.plan.md) |
| Merge Readiness | 2026-03-02 | `feat/semantic_search_deployment` merged to `main`. MCP prompts investigated (ADR-123), onboarding review complete, quality gates green, secrets sweep done. | [archived plan](sdk-and-mcp-enhancements/archive/completed/merge-readiness.plan.md) |
| Search `text` → `query` Rename | 2026-03-07 | Renamed the primary search/explore-topic MCP parameter from `text` to `query` across SDK, MCP, CLI, codegen, tests, prompts, and docs. Full specialist-review remediation completed and the governance follow-through that closed the wrapper/rules gap was recorded. | [archived plan](sdk-and-mcp-enhancements/archive/completed/search-tool-text-to-query-rename.plan.md) |
| Folder Modernisation Meta Plan | 2026-02-22 | Legacy numbered plans archived under collection archive classes, disposition ledger established, governance docs normalised, and ADR-071 collision resolved by retaining widget URI ADR as 071 and renumbering dense-vector ADR to 118. | [archived plan](sdk-and-mcp-enhancements/archive/completed/folder-modernisation-meta-plan.md) |
| Graph-Tool Output Schemas (DESIGN) | 2026-06-02 | Design content absorbed by `connecting-oak-resources/knowledge-graph-integration/future/graph-tools-value-redesign.plan.md` as its own overview directed: projection doctrine + Q2/Q4 → its Ratified decisions; Q1/Q3/Q5 → its Decisions A/B/D; W-mech rides EEF D4–D6. | [archived plan](sdk-and-mcp-enhancements/archive/completed/graph-tool-output-schemas.plan.md) |

---

## Release Plans

| Plan | Completed | Key Outcomes | Archive |
|------|-----------|--------------|---------|
| Milestone 1 Release Plan | 2026-03-02 | M0 release complete and milestone sequence re-baselined (Invite-Only Alpha → Extension Surfaces → Tech Debt & Hardening). Durable release governance extracted to `docs/engineering/milestone-release-runbook.md`. | [archived plan](archive/completed/release-plan-m1.plan.md) |

---

## Quality and Architecture

| Plan | Completed | Key Outcomes | Archive |
|------|-----------|--------------|---------|
| Test Isolation Architecture Fix | 2025-12-22 | Vitest exit-code bug fixed, MediaQueryContext DI pattern created, global state mutations eliminated. Work later superseded when oak-search-cli UI layer was removed. | [archived plan](archive/completed/test-isolation-architecture-fix.md) |
| Test Isolation Root Cause Analysis | 2025-12-22 | Identified global state mutation as root cause (not missing cleanup). Led to DI refactoring pattern. | [archived plan](archive/completed/ANALYSIS-test-isolation-root-cause.md) |
| Ingestion Data Quality Fix | 2025-12-22 | Upstream API pagination bug workaround (unit-by-unit fetching), 436/436 lessons indexed. | [archived plan](archive/completed/COMPLETION-REPORT-2025-12-22.md) |
| matchMedia DI Refactoring | 2025-12-22 | MediaQueryContext provider, DI pattern for browser APIs. Work later superseded when oak-search-cli UI layer was removed. | [archived plan](archive/completed/matchmedia-di-refactoring-plan.md) |
| Global State Elimination | 2025-12-22 | vi.stubGlobal and vi.doMock eliminated, matchMedia DI completed. Remaining phases (config DI, testing discipline) tracked separately. UI-specific work superseded when oak-search-cli UI layer was removed. | [archived plan](archive/completed/global-state-elimination-and-testing-discipline-plan.md) |

---

## Agentic Engineering Enhancements

| Plan | Completed | Key Outcomes | Archive |
|------|-----------|--------------|---------|
| Documentation Accuracy Improvements | 2026-02 | Documentation inaccuracies and structural issues fixed as prerequisite for enforcement work. | [archived plan](agentic-engineering-enhancements/archive/completed/documentation-accuracy-improvements.plan.md) |
| Continuity and Surprise Practice Adoption | 2026-04-03 | Installed `session-handoff`, split ordinary continuity from deep consolidation, closed the evidence window with an explicit `promote` decision, and graduated the portable continuity note that later promoted into Practice Core. | [archived plan](agentic-engineering-enhancements/archive/completed/continuity-and-surprise-practice-adoption.plan.md) |
| Owner-Directed Intent-to-Commit Queue | 2026-04-27 | Implemented the advisory FIFO `commit_queue` and exact staged-bundle verification in `5c39d1d4`, then graduated the shared git transaction / authorial-bundle tripwire into PDR-029 Family A Class A.3 while keeping `session_counter` future-only. | [archived plan](agentic-engineering-enhancements/archive/completed/intent-to-commit-queue.execution.plan.md) |
| Cross-Agent Standardisation | 2026-03 | Superseded — absorbed into ADR-125 (Agent Artefact Portability). | [archived plan](agentic-engineering-enhancements/archive/completed/cross-agent-standardisation.plan.md) |

---

## Agent Tooling

| Plan | Completed | Key Outcomes | Archive |
|------|-----------|--------------|---------|
| Memory/State Contract Doctor | 2026-05-07 | Completed the safe-merge gate: report mode is green on live substrate state, strict mode and the root built-output alias exist, collaboration schema blockers are normalised without deleting historical evidence, and repair/consolidation integration remain future arcs. | [archived plan](agent-tooling/archive/completed/memory-state-contract-doctor.plan.md) |

---

## Architecture and Infrastructure

| Plan | Completed | Key Outcomes | Archive |
|------|-----------|--------------|---------|
| No-Console Enforcement | 2026-03-04 | Superseded — folded into `developer-experience/active/devx-strictness-convergence.plan.md`. | [archived plan](architecture-and-infrastructure/archive/completed/no-console-enforcement.plan.md) |
| TypeScript 6 Migration and Workspace-Script Architectural Rules | 2026-04-29 | Migrated to TS6 (baseUrl removal, `types: ["node"]`, `rootDir` for build configs); banned workspace-to-root scripts; ratified the all-TS-scripts rule with the `runtime-only-scripts/` directory exception for no-compile-no-deps cases. Doctrine landed in [ADR-168](../../docs/architecture/architectural-decisions/168-typescript-6-baseline-and-workspace-script-architectural-rules.md). Implementation across `a34f8402`–`dcd45776`. | [archived plan](architecture-and-infrastructure/archive/completed/typescript-6-migration-and-workspace-script-rules.plan.md) |

---

## Observability

| Plan | Completed | Key Outcomes | Archive |
|------|-----------|--------------|---------|
| MCP Post-Root-Green Follow-Through | 2026-04-23 | Closed the bounded repo-owned corrective lane after the root-green rerun: strict sitemap validation restored, wrapper/fallback drift removed, the configured Sentry build gate aligned to canonical env loading, and remaining manual validation stages explicitly externalised to the owner. | [archived plan](observability/archive/completed/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md) |

---

## Graph Coordination Spines (Superseded Framing)

These four cross-collection graph coordination artefacts encoded the pre-rebuild
architecture (gate-1a/1b, the 7-method `GraphView`, the withdrawn ADR-175 freshness
gate, `recommend`/`explain`/`compare`, the Inc.3 cross-corpus join). The EEF
graph-tooling rebuild discarded that framing; they were quarantined 2026-06-01 under
[`graph-estate-consolidation.plan.md`](connecting-oak-resources/knowledge-graph-integration/current/graph-estate-consolidation.plan.md).
Superseded by the live EEF plan
([`eef-graph-tool-completion.plan.md`](sector-engagement/eef/current/eef-graph-tool-completion.plan.md))
and the live KG hub
([`knowledge-graph-integration/`](connecting-oak-resources/knowledge-graph-integration/README.md)).

| Plan | Archived | Why superseded | Archive |
|------|----------|----------------|---------|
| Graph Portfolio — Index | 2026-06-01 | Cross-collection index routing into archived EEF plans and citing withdrawn ADR-175; replaced by collection-level navigation | [archived plan](archive/completed/graph-portfolio-index.md) |
| Graph MVP Arc | 2026-06-01 | Gate-1a/1b spine over the discarded `EefStrandsGraphView` / 7-method `GraphView` / freshness-gate stack | [archived plan](archive/completed/graph-mvp-arc.plan.md) |
| Graph Combinatorial Arc | 2026-06-01 | Follow-on spine depending on gates and graph-stack Inc.3 that the rebuild removed | [archived plan](archive/completed/graph-combinatorial-arc.plan.md) |
| Meta — feat/mcp-graph-support-foundation | 2026-06-01 | Branch-scoped navigation index, two branches stale; inbound links all archived | [archived plan](archive/completed/feat-mcp-graph-support-foundation-meta.md) |
| Graph-Tooling Rebuild (SPECIFIED) | 2026-05-30 | Quarantined symptom of the superseded broken concept (gate-1a/1b, the list-shaped tool, Zod-over-corpus, freshness); the live EEF plan replaced it | [archived plan](sector-engagement/eef/archive/graph-tooling-rebuild.plan.md) |

---

## Knowledge Graph Integration (2026-06-02 Estate Consolidation)

The graph-estate consolidation
([`graph-estate-consolidation.plan.md`](connecting-oak-resources/knowledge-graph-integration/current/graph-estate-consolidation.plan.md)
t2–t5+t7) archived the superseded gate-1a/1b plan estate, archived the
genuinely-completed plans, and consolidated the four misconception feature
plans into
[`oak-misconceptions-graph-features.plan.md`](connecting-oak-resources/knowledge-graph-integration/future/oak-misconceptions-graph-features.plan.md)
(parked). This is the single where-did-they-go record for that move set.

**Completed:**

| Plan | Completed | Key Outcomes | Archive |
|------|-----------|--------------|---------|
| Graph Resource Factory | 2026-04-11 | Shared graph resource/tool factory extracted (SDK-internal) in `1eb302e8`; prior-knowledge + thread-progressions surfaces refactored onto it; curriculum-model documented exception; behaviour-preserving (full suite green). | [archived plan](connecting-oak-resources/knowledge-graph-integration/archive/completed/graph-resource-factory.plan.md) |
| Misconception Graph MCP Surface | 2026-04-11 | `curriculum://misconception-graph` resource + `get-misconception-graph` tool live in `1eb302e8`; ADR-123 updated; E2E assertions landed. | [archived plan](connecting-oak-resources/knowledge-graph-integration/archive/completed/misconception-graph-mcp-surface.plan.md) |
| Graph-Stack WS1.6 Vocab Prep | 2026-06-02 | Prep note served its purpose: WS1.6 scope boundary + open design questions surfaced for owner review; vocabulary direction owned by `graph-stack.plan.md`. | [archived plan](connecting-oak-resources/knowledge-graph-integration/archive/completed/graph-stack-ws1.6-vocab-prep.md) |
| PR 108 Quality-Gate Snagging | 2026-05-22 | CodeQL alert #90 and the failing SonarCloud Quality Gate on PR #108 cleared by per-finding disposition (FIXED / FALSE_POSITIVE / SAFE) and policy-aligned mechanical exclusion — gates never weakened; PR #108 merged 2026-05-24. | [archived plan](connecting-oak-resources/knowledge-graph-integration/archive/completed/pr-108-snagging.plan.md) |
| Ontology / Knowledge Graph Widget Tidy-Up | 2026-04-28 | Widget crash fixed, KG SVGs migrated to the ontology renderer, preview cleaned, stale active documentation references resolved; all 26 UI tests pass. | [archived plan](connecting-oak-resources/knowledge-graph-integration/archive/completed/ontology-knowledge-graph-tidy-up.md) |

**Superseded framing (archived 2026-06-02):**

| Plan | Archived | Why superseded | Archive |
|------|----------|----------------|---------|
| Graph Query Layer | 2026-06-02 | Pre-rebuild 7-operation polymorphic `GraphView` layer with mandatory projection, gate-1a/0b sequencing | [archived plan](connecting-oak-resources/knowledge-graph-integration/archive/completed/graph-query-layer.plan.md) |
| Gate-1a Delivery Parallel Execution Addendum | 2026-06-02 | Rotating-cast coordination addendum for the retired gate-1a arc | [archived plan](connecting-oak-resources/knowledge-graph-integration/archive/completed/gate-1a-delivery-parallel-execution-addendum.plan.md) |
| Graph MVP-Arc Specialist Review Opener (2026-05-08) | 2026-06-02 | Superseded session opener; review completed 2026-05-07 | [archived plan](connecting-oak-resources/knowledge-graph-integration/archive/completed/2026-05-08-graph-mvp-arc-specialist-review-opener.md) |
| PR 102 Graph Decision-Complete Closeout | 2026-06-02 | Completed session record of a closeout for the later-discarded architecture | [archived plan](connecting-oak-resources/knowledge-graph-integration/archive/completed/2026-05-08-pr102-graph-decision-complete-closeout.plan.md) |
| Graph Execution Prep Opener (2026-05-11) | 2026-06-02 | Superseded session opener for the retired MVP-arc prep; steps 1–3 landed | [archived plan](connecting-oak-resources/knowledge-graph-integration/archive/completed/2026-05-11-graph-execution-prep-opener.md) |
| PR 108 Sonar Live Issues (2026-05-24) | 2026-06-02 | Point-in-time Sonar snapshot for merged PR #108 | [archived plan](connecting-oak-resources/knowledge-graph-integration/archive/completed/pr-108-sonar-live-issues-2026-05-24.md) |
| Open Education Knowledge Surfaces | 2026-06-02 | Historical umbrella: WS-0/1/2 landed (`1eb302e8`), WS-3 superseded by the rebuild, WS-4/5/6 owned by their own plans | [archived plan](connecting-oak-resources/knowledge-graph-integration/archive/completed/open-education-knowledge-surfaces.plan.md) |
| Oak Misconceptions Sub-Graph MCP Surface | 2026-06-02 | Consolidated into `oak-misconceptions-graph-features` §1 (bounded-traversal contract, fixture-manifest scheme, `_meta` discipline preserved; `maxResponseTokens=16000` retired) | [archived plan](connecting-oak-resources/knowledge-graph-integration/archive/completed/oak-misconceptions-subgraph-mcp-surface.plan.md) |
| Oak Misconceptions × EEF Cross-Corpus Surface | 2026-06-02 | Consolidated into `oak-misconceptions-graph-features` §2 (compound-prefix attribution, substrate-only principle preserved) | [archived plan](connecting-oak-resources/knowledge-graph-integration/archive/completed/oak-misconceptions-eef-cross-corpus-surface.plan.md) |
| Oak Misconceptions Topic Extraction | 2026-06-02 | Consolidated into `oak-misconceptions-graph-features` §3 | [archived plan](connecting-oak-resources/knowledge-graph-integration/archive/completed/oak-misconceptions-topic-extraction.plan.md) |
| Oak Misconceptions EEF Extended Contexts | 2026-06-02 | Consolidated into `oak-misconceptions-graph-features` §4 | [archived plan](connecting-oak-resources/knowledge-graph-integration/archive/completed/oak-misconceptions-eef-extended-contexts.plan.md) |
| Oak Misconceptions Substrate Migration | 2026-06-02 | Absorbed by the unified Judgement-call-4 plan `future/graph-tools-value-redesign.plan.md` via independent re-grounding (disposition ledger in its §Absorption record); the `Inc.3` trigger and `maxResponseTokens=16000` demand were retired framing | [archived plan](connecting-oak-resources/knowledge-graph-integration/archive/completed/oak-misconceptions-substrate-migration.plan.md) |

---

## Adding Entries

When archiving a plan:

1. **Mine outcomes into permanent docs** (ADRs/directives/READMEs/reference docs).
2. **Move** the plan file to `{collection}/archive/completed/`.
3. **Add an entry** to the table above (plan name, date, key outcomes, archive link).
4. **Fix all references** to the old `active/`, `current/`, or `future/` path — update them to point
   directly to `archive/completed/`. Clean break, no stubs.
5. **Run** `/jc-consolidate-docs` to verify no stale references remain.

---

## Migration: Removing Existing Closeout Stubs

If a closeout stub exists in an `active/` directory (a file with
frontmatter `todos: []` and a redirect to `archive/completed/`):

1. Delete the stub from `active/`.
2. Add an entry to this index (if not already present).
3. Find all references to the deleted stub path
   (`rg "active/[stub-filename]" .agent/ .cursor/ docs/`).
4. Update each reference to point to `archive/completed/[filename]`.
5. Commit: `"chore: replace closeout stub with clean-break archival"`.
