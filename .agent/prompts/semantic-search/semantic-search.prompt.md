---
prompt_id: semantic-search
title: "Semantic Search Session Entry Point"
type: handover
status: active
last_updated: 2026-03-07
---

# Semantic Search — Session Entry Point

**Last Updated**: 2026-03-07 (active graph alignment-audit lane and cross-collection sequencing refreshed)

**Recent session (7 Mar 2026)**: Graph-enablement planning was promoted from
strategy into a queued parent quick-win plan and then into the active
`kg-alignment-audit` slice. The semantic-search navigation surfaces now reflect
that active/queued hierarchy explicitly.

---

## Immediate Context

**Branch context**: use the current checkout and verify it explicitly; do not assume a named target branch

**Phase 3a** (MCP search integration) is **complete** — all five
workstreams done, all quality gates pass. The old REST-based
search has been replaced by SDK-backed Elasticsearch search.
Three tools (`search`, `browse-curriculum`, `explore-topic`)
are the sole search interface.

**Search results quality** is **complete** — fuzziness aligned,
score filtering added, `total` semantics unified, all four
architecture reviewers invoked. Decisions documented in
[ADR-120](../../../docs/architecture/architectural-decisions/120-per-scope-search-tuning.md).
Archived plan:
[search-results-quality.md](../../plans/semantic-search/archive/completed/search-results-quality.md)

**Search dispatch type safety** (3g) is now **complete**
([archived plan](../../plans/semantic-search/archive/completed/search-dispatch-type-safety.md)).

**Widget stabilisation**: **COMPLETE** (all phases 0-5).
See [Widget Search Rendering](../../plans/semantic-search/archive/completed/widget-search-rendering.md).

**Plans** (in priority order):

- [SDK workspace separation](../../plans/semantic-search/archive/completed/sdk-workspace-separation.md) — **COMPLETE** — archived
- [MCP Tool Snagging](../../plans/semantic-search/archive/completed/search-snagging.md) — **IMPLEMENTED AND SMOKE-TESTED** — all 5 SDK tool bugs fixed with TDD, verified end-to-end (32 tools)
- [Widget Search Rendering](../../plans/semantic-search/archive/completed/widget-search-rendering.md) — **COMPLETE** — all phases (0-5) done
- [Roadmap](../../plans/semantic-search/roadmap.md) — overall milestone sequence through Milestone 3 / Public Beta
- [Active Plans](../../plans/semantic-search/active/README.md) — includes the active Boundary 03 lane and the active graph-enablement alignment-audit lane
- [Current Queue](../../plans/semantic-search/current/README.md) — includes the P0 blocker, the keyword/thread-sequence follow-ons, and the parent queued graph quick-win plan
- [Research Index](../../plans/semantic-search/research-index.md) — cross-cutting research pack for the Phase 4 queue
- [MCP Extensions Roadmap](../../plans/sdk-and-mcp-enhancements/roadmap.md) — post-merge only

Important: the active bulk metadata quick-win stream can progress without
waiting for the public-release blocker to close. Treat Milestone 2 blocker work
and Boundary 03 search-quality work as separate streams unless a session
explicitly chooses the release track.

Also note the current cross-collection ordering in
[high-level-plan.md](../../plans/high-level-plan.md): `oak-preview`
snagging/deploy comes first, then post-deploy bulk-data re-download and
Elasticsearch reindex validation, then MCP Apps infrastructure migration, then
the graph follow-on decisions informed by the active alignment audit. Treat
[kg-alignment-audit.execution.plan.md](../../plans/semantic-search/active/kg-alignment-audit.execution.plan.md)
as the active graph lane and
[kg-integration-quick-wins.plan.md](../../plans/semantic-search/current/kg-integration-quick-wins.plan.md)
as the parent queued plan for the remaining ontology/Neo4j quick wins.

---

## Standalone Session Bootstrap

Run this checklist at the start of the next session:

1. Re-ground via:
   - [start-right-thorough.md](../../skills/start-right-thorough/shared/start-right-thorough.md)
   - [AGENT.md](../../directives/AGENT.md)
   - [principles.md](../../directives/principles.md)
   - [testing-strategy.md](../../directives/testing-strategy.md)
   - [schema-first-execution.md](../../directives/schema-first-execution.md)
2. Verify current state before planning or coding:

   ```bash
   git status --short
   git branch --show-current
   ls -1 .agent/plans/semantic-search/active
   ```

3. If the session touches historical SDK workspace separation concerns, use the
   archived plan and baseline files directly rather than replaying the old split
   verification by default.

4. Read split-critical ADRs:
   - [ADR-108](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md) — two-pipeline architecture, consumer model, boundary invariants, 4-workspace vision
   - [ADR-065](../../../docs/architecture/architectural-decisions/065-turbo-task-dependencies.md) — turbo task dependencies and caching
   - [ADR-086](../../../docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md) — vocab pipeline ownership
5. Read the active execution plan you are working from — it should be self-sufficient:
   - [bulk-metadata-quick-wins.execution.plan.md](../../plans/semantic-search/active/bulk-metadata-quick-wins.execution.plan.md) — active Boundary 03 execution plan
   - [mcp-result-pattern-unification.execution.plan.md](../../plans/semantic-search/active/mcp-result-pattern-unification.execution.plan.md)
   - [search-sdk-args-extraction.plan.md](../../plans/semantic-search/active/search-sdk-args-extraction.plan.md)
   - [kg-alignment-audit.execution.plan.md](../../plans/semantic-search/active/kg-alignment-audit.execution.plan.md) — active graph-enablement execution plan
6. Treat these as complete/archive references only:
   - [architecture-review-remediation.md](../../plans/semantic-search/archive/completed/architecture-review-remediation.md) — N1-N6 findings from four-reviewer sweep (all completed)
   - [sdk-separation-pre-phase1-decisions.md](../../plans/semantic-search/archive/completed/sdk-separation-pre-phase1-decisions.md) — D1-D5 decision rationale (archived)
   - [search-results-quality.md](../../plans/semantic-search/archive/completed/search-results-quality.md) — search quality (ADR-120)
   - [search-snagging.md](../../plans/semantic-search/archive/completed/search-snagging.md) — 5 SDK tool bugs, smoke-tested
   - [widget-search-rendering.md](../../plans/semantic-search/archive/completed/widget-search-rendering.md) — Widget Phases 0-5
   - [search-dispatch-type-safety.md](../../plans/semantic-search/archive/completed/search-dispatch-type-safety.md)
   - [phase-3a-mcp-search-integration.md](../../plans/semantic-search/archive/completed/phase-3a-mcp-search-integration.md)
7. Keep post-merge MCP extension work separate:
   - [../../plans/sdk-and-mcp-enhancements/roadmap.md](../../plans/sdk-and-mcp-enhancements/roadmap.md)

---

## Next Execution Targets

Active now:

1. [bulk-metadata-quick-wins.execution.plan.md](../../plans/semantic-search/active/bulk-metadata-quick-wins.execution.plan.md) — active by user priority and standalone-ready
2. [mcp-result-pattern-unification.execution.plan.md](../../plans/semantic-search/active/mcp-result-pattern-unification.execution.plan.md)
3. [search-sdk-args-extraction.plan.md](../../plans/semantic-search/active/search-sdk-args-extraction.plan.md)
4. [kg-alignment-audit.execution.plan.md](../../plans/semantic-search/active/kg-alignment-audit.execution.plan.md) — active evidence-first graph-enablement lane

Queued:

1. [m2-public-alpha-auth-rate-limits.execution.plan.md](../../plans/semantic-search/current/m2-public-alpha-auth-rate-limits.execution.plan.md) — P0 blocker in a separate Milestone 2 release-readiness stream
2. [keyword-definition-assets.execution.plan.md](../../plans/semantic-search/current/keyword-definition-assets.execution.plan.md) — P1 follow-on after bulk metadata quick wins
3. [thread-sequence-semantic-surfaces.execution.plan.md](../../plans/semantic-search/current/thread-sequence-semantic-surfaces.execution.plan.md) — P2 follow-on
4. [kg-integration-quick-wins.plan.md](../../plans/semantic-search/current/kg-integration-quick-wins.plan.md) — parent queued graph quick-win plan after the active alignment audit

---

**Merge blocker — SDK workspace separation** (Milestone 0):

**SDK workspace separation** — Phases 0-7 **complete**. Architecture
review remediation (N1-N6) complete. Merge-ready.

**Completed**:

- Phase 0: baseline evidence committed
- Phase 1: generation workspace scaffold, SDK boundary rules,
  turbo vocab-gen inputs
- Phase 2: `code-generation/`, `schema-cache/`, `src/types/generated/`
  moved to generation workspace. ~70 runtime SDK files rewired
  to use 10 subpath exports. E2E tests migrated. 8 specialist
  reviews completed, all blocking findings resolved. Full
  quality gate chain passed.
- Phase 3: `vocab-gen/` (39 files), `src/bulk/` (36 files),
  5 graph data files, `definition-synonyms.ts`, and
  `property-graph-data.ts` moved to generation workspace.
  Generation barrel exports and config updated.
- Phase 4: reverse dependency resolved (4.1), runtime SDK
  internal imports rewired (4.2), 22 search CLI files rewired
  from `public/bulk` to generation (4.3), `public/bulk.ts`
  facade deleted (4.4). Compilation gate passed.
- Architecture remediation: N1 (turbo schema-cache inputs),
  N2 (ESLint boundary gap), N3 (`@oaknational/type-helpers`
  extraction), N4 (`/vocab` subpath), N5 (MCP tool dir
  flattening), N6 (generator bootstrap cycle). All 6 completed.

- Phase 5 COMPLETED: 13 findings triaged (7 already resolved,
  6 implemented). Scope guard stale entries removed. Test split
  to integration (F4). Barrel simplification — duplicate exports
  removed (F10). DI refactoring — `GeneratedToolRegistry` interface
  and `ToolRegistryDescriptor` (ISP), eliminated `vi.mock`/`vi.hoisted`,
  removed all `as` assertions (F18). `generate:clean` recovery
  documented (F8). All gates pass. 4 specialist reviewers approved.
  Phase 5 reviewer suggestions tracked in plan §13.6.

**Phase 6 complete** (25 Feb 2026) — renames, provenance, decisions,
documentation. Four package/repo renames executed alongside original
Phase 6 scope:

- **6.1**: Phase 5 reviewer suggestions S1-S3 (DRY test helper,
  executor test split, `_meta` guard simplification). Done.
- **6.2**: Library renames — `@oaknational/logger` (was `mcp-logger`),
  `@oaknational/env` (was `mcp-env`). Done.
- **6.3**: Workspace rename — `@oaknational/sdk-codegen` (was
  `curriculum-sdk-generation`), dir `oak-sdk-codegen`. Done.
- **6.4**: Repo rename — `oak-open-curriculum-ecosystem` (was
  `oak-open-curriculum-ecosystem`, internal refs only). Done.
- **6.5**: Provenance banner updates (F11). Done.
- **6.6**: Evaluation decisions — F12-F14 documented in codegen SDK
  README. Done.
- **6.7**: Documentation alignment — ADR-108, READMEs, plan, prompt.
  Done.
- **6.8**: Quality gates + specialist reviews. Done.

**Phase 7 complete**: Full quality gate chain, determinism verification,
8 specialist reviews. (F16 drift check implemented then removed —
redundant with pnpm check clean+build.)

See [canonical plan](../../plans/semantic-search/archive/completed/sdk-workspace-separation.md) for full detail on every step.

**Two-pipeline architecture** (see
[ADR-108](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md)):
generation workspace hosts API pipeline (OpenAPI → types, Zod,
MCP descriptors) and bulk pipeline (bulk JSON → types, ES
mappings, vocabulary, ontology). Both run during `pnpm sdk-codegen`.

**Non-negotiable boundaries** (enforced by ESLint SDK boundary rules,
implemented in `createSdkBoundaryRules()` in `boundary.ts`):

- Generation → no runtime imports (one-way dependency)
- Runtime → generation subpath exports only (no deep imports)
- Both roles → no `@workspace/*` alias imports
- Runtime `public/bulk` is removed (consumers import generation directly)
- Always run `pnpm sdk-codegen` from repo root, not individual workspaces

**Post-merge work** (Milestone 0 → Milestone 1): MCP tool snagging
(complete), widget stabilisation (complete), schema alignment
(roadmap Phase 4). See [Completed Work](#completed-work-reference-only)
and [roadmap](../../plans/semantic-search/roadmap.md).

---

## Critical Principles

These are not suggestions. They are requirements. If any
principle was violated during implementation, the work is
not done until the violation is corrected.

- **Never manipulate global state.** Step back and consider the
  desired impact, whether it is valid, and whether this is the
  right level of abstraction.
- **Ask reviewers about intentions before implementing.** Describe
  the approach and alternatives; catch architectural issues before
  writing code.
- **Types flow from the schema.** The cardinal rule applies
  throughout all work — ensure types derive from the OpenAPI
  schema via `pnpm sdk-codegen`.
- **We always choose long-term architectural excellence.** We do
  not put important work off until later. If reviewers find
  issues, those issues become next steps — they are not
  "non-blocking". Critical issues are always blocking.
- **Tests that agree with the code on the wrong contract are
  worse than no tests.** They provide false confidence instead
  of genuine verification. Anchor test fixtures to the schema
  (or captured API responses), not to the assumptions of the
  code under test.
- **Ground truths before AND after configuration changes.** Always
  run baseline benchmarks before and after any search configuration
  change. The existing lesson ground truths and their documented
  baselines must not regress; use the Ground Truth Protocol and
  roadmap tables as the authority for the current benchmark figures.
- **Never make files shorter by removing documentation.** The
  point is to improve developer experience, not make it worse.
  If a file is too long, split it into smaller files with clear
  boundaries and index.ts re-exports.
- **All reviewer issues are blocking.** There is no such thing as
  a "non-blocking critical issue". If a reviewer flags it as
  critical, it gets fixed before the work is considered done.

---

## Current Search Tool Landscape

| Tool | Module | Backend |
|------|--------|---------|
| `search` | `aggregated-search/` | Elasticsearch via Search SDK (4 scopes + suggest) |
| `browse-curriculum` | `aggregated-browse/` | `fetchSequenceFacets` |
| `explore-topic` | `aggregated-explore/` | Parallel `searchLessons` + `searchUnits` + `searchThreads` |

### Architecture Context

- **DI**: `SearchRetrievalService` interface breaks circular dependency.
  `searchRetrieval` is **required** on `UniversalToolExecutorDependencies`.
- **Fail-fast**: Servers fail at startup without ES credentials. Stub
  mode uses `createStubSearchRetrieval()`.
- **Dispatch**: `switch` on `args.scope` with `default: never`
  exhaustiveness guard, returning `SearchDispatchResult` union.
- **`isAggregatedToolName`**: Derives from `AGGREGATED_TOOL_DEFS` via
  `value in AGGREGATED_TOOL_DEFS` — do NOT revert to a hardcoded list.
- **`AggregatedToolName`**: Derived as `keyof typeof AGGREGATED_TOOL_DEFS`
  in `universal-tools/types.ts`, re-exported from `tool-guidance-types.ts`.
  Do NOT create manual unions — they drift.
- **Response format**: Unified `formatToolResponse()` — all tools return
  2-item `content` array (summary + JSON), `structuredContent`, `_meta`.
- **Scopes via `SCOPES_SUPPORTED`**: All aggregated tool definitions
  import OAuth scopes from the stable re-export at
  `src/mcp/scopes-supported.ts` (not hardcoded). Follow this pattern.

### Search Pipeline Architecture

Per-scope configuration documented in
[ADR-120](../../../docs/architecture/architectural-decisions/120-per-scope-search-tuning.md).

**Lessons/Units** (4-way RRF): `fuzziness: AUTO:6,9`,
`filterByMinScore(0.02)`, `total = results.length`.

**Threads/Sequences** (2-way RRF): `fuzziness: AUTO`,
no score filtering, `total = results.length`.

**Key files**:

- `packages/sdks/oak-search-sdk/src/retrieval/rrf-query-builders.ts` — 4-way RRF
- `packages/sdks/oak-search-sdk/src/retrieval/retrieval-search-helpers.ts` — 2-way RRF
- `packages/sdks/oak-search-sdk/src/retrieval/rrf-score-processing.ts` — score filtering + clamping
- `packages/sdks/oak-search-sdk/src/retrieval/create-retrieval-service.ts` — orchestrator
- `packages/sdks/oak-search-sdk/src/retrieval/search-sequences.ts` — sequence search
- `packages/sdks/oak-search-sdk/src/retrieval/search-threads.ts` — thread search

### Widget Rendering Architecture

Widget rendering documentation (dispatch pattern, data shapes,
sandbox dependencies, edge cases, contract tests, known
resilience gaps) lives permanently in the HTTP MCP server README:
[README.md — Widget Rendering Architecture](../../../apps/oak-curriculum-mcp-streamable-http/README.md)

---

## Discipline, Correctness, Architectural Excellence

The directives in `.agent/directives/` are the authority. Read
them. Follow them. There is one right way to do everything in
this codebase, and it is defined there. What follows is a
summary -- when in doubt, the directives win.

**Strictness is a design requirement.** Do not invent optionality.
Do not add fallback options. Do not create compatibility layers.
We know exactly what is needed. The proper functioning of the
system depends on acknowledging those restrictions and valuing the
insights offered by the type system.

**First Question.** Before every decision: could it be simpler
without compromising quality?

**TDD at ALL levels.** RED, GREEN, REFACTOR -- at unit,
integration, AND E2E. The test comes first. It MUST fail before
implementation exists. Test behaviour, not implementation. Simple
fakes injected as arguments, never complex mocks. No global state
manipulation. If tests lag behind code at any level, TDD was not
followed.

**Types from the schema.** All types derive from the OpenAPI
schema via `pnpm sdk-codegen`. No ad-hoc types. No `as`. No `any`.
No `!`. No `Record<string, unknown>`. Preserve type information --
never widen a literal to `string`. If the type system resists,
the code is wrong.

**Result pattern.** All I/O methods return `Result<T, E>`. Handle
all cases explicitly. Never throw. Never return null.

**Fail fast.** Never swallow errors. Never log and continue. Fail
immediately with a message that explains what and why.

**Generator-first.** Change templates, rerun `pnpm sdk-codegen`.
Never edit generated files. Missing data is a generator bug.

**Quality gates are blocking.** Every gate, every time. A failing
gate means the work is not done. There is no such thing as an
acceptable failure.

**Never disable checks.** No `@ts-ignore`. No `eslint-disable`.
No `--no-verify`. Fix the code, not the check.

**Architectural boundaries.** SDK consumes Curriculum SDK types.
CLI consumes SDK. Enforced by ESLint. Do not bypass.

**Document everything.** Exhaustive TSDoc. Public APIs with
examples. ADRs for decisions. Progressive disclosure from README
to source.

**Protocol.** If you cannot follow proper protocol, STOP and
explain why. Do not work around it.

## Mandatory Reading

Read ALL of these before writing any code. Not after. Before.
They are the authority. They define how this codebase works,
what is expected, and why. If you skip them, you will violate
the standards and produce work that must be rejected.

1. [AGENT.md](../../directives/AGENT.md) -- Cardinal rule, first question, essential links
2. [principles.md](../../directives/principles.md) -- Core rules: TDD, strictness, types, quality, architecture
3. [testing-strategy.md](../../directives/testing-strategy.md) -- TDD at ALL levels, test definitions, violations
4. [schema-first-execution.md](../../directives/schema-first-execution.md) -- Generator is source of truth, prohibited practices
5. [semantic-search-architecture.md](../../../docs/agent-guidance/semantic-search-architecture.md) -- Structure is the foundation, correct framing
6. [metacognition.md](../../directives/metacognition.md) -- Think about your thoughts, reflect, gain insights
7. [roadmap.md](../../plans/semantic-search/roadmap.md) -- Authoritative milestone sequence

---

## What We Have

A production-ready Elasticsearch-backed semantic search
system split across six workspaces.

| Workspace | Location | Purpose |
|-----------|----------|---------|
| **Codegen SDK** | `packages/sdks/oak-sdk-codegen/` | Two pipelines: API (sdk-codegen, generated types, Zod, MCP descriptors) and bulk (vocab-gen, bulk infrastructure, graph data, mined synonyms). 11 subpath exports. `@oaknational/sdk-codegen`. Type-focused modules: `typegen-*`; orchestration: `codegen-*`. |
| **Runtime SDK** | `packages/sdks/oak-curriculum-sdk/` | Runtime client, auth, validation, MCP tool composition |
| **Search SDK** | `packages/sdks/oak-search-sdk/` | ES-backed semantic search |
| **Search CLI** | `apps/oak-search-cli/` | Operator CLI + evaluation |
| **MCP STDIO** | `apps/oak-curriculum-mcp-stdio/` | STDIO transport MCP server |
| **MCP HTTP** | `apps/oak-curriculum-mcp-streamable-http/` | HTTP transport MCP server (Vercel) |

The codegen SDK is the shared foundation — runtime SDK and
search CLI import generated types through its subpath exports.
The Search SDK imports from the runtime SDK (shared exports)
and serves bulk-derived data exclusively. Both MCP servers
consume the runtime SDK (tool definitions) and optionally the
Search SDK (search retrieval). The MCP application layer is
where both SDKs connect — aggregated tools orchestrate API
and search together.

**Synonym system**: ~500 curated vocabulary entries across
23 categories serve two distinct concerns currently conflated
into one `synonymsData` object: (1) agent context injection
via the `get-curriculum-model` MCP tool (primary intent), and
(2) interim Elasticsearch query expansion pending a
bulk-data-derived synonym pipeline. All curated synonym content
and transform utilities are co-located in sdk-codegen
(`src/synonyms/`). See ADR-063 and the
[Synonyms README](../../../packages/sdks/oak-sdk-codegen/src/synonyms/README.md)
for full details.

### Search Pipeline

4-way RRF hybrid search (BM25 + ELSER on both Content
and Structure) for lessons and units, 2-way for threads
and sequences. Query processing includes noise phrase
removal, curriculum phrase detection, and transcript-aware
score normalisation.

**Full details**: [ARCHITECTURE.md](../../../apps/oak-search-cli/docs/ARCHITECTURE.md)

### Indexes

| Index | Documents | Purpose |
|-------|-----------|---------|
| `oak_lessons` | 12,833 | Primary lesson retrieval |
| `oak_unit_rollup` | 1,665 | Unit search and highlights |
| `oak_threads` | 164 | Conceptual progression strands |
| `oak_sequences` | 30 | API data structures (generate programme views) |

### Ground Truth Baselines (validated 2026-02-23)

| Index | GTs | MRR | NDCG@10 |
|-------|-----|-----|---------|
| Lessons (all 33) | 33 | 0.962 | 0.912 |
| Units | 2 | 1.000 | 0.923 |
| Threads | 8 | 0.938 | 0.902 |
| Sequences | 1 | 1.000 | 1.000* |

\* Single-query index — mechanism check only.

**Ground truths**: 33 lesson queries (30 per-subject + 3
cross-subject), 2 unit, 8 thread, 1 sequence. All in
`apps/oak-search-cli/src/lib/search-quality/ground-truth/`.

**Protocol**: [Ground Truth Protocol](../../../apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md)

---

## Quality Gates

Run the full chain after every piece of work, from repo root.
Not some of them. All of them. In this order. Every time.

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

**Every gate MUST pass. There is no such thing as an acceptable
failure. If a gate fails, the work is not done. Fix it.**

---

## Completed Work (Reference Only)

All archived plans: `.agent/plans/semantic-search/archive/completed/`

| Work | Key Outcome | Reference |
|------|------------|-----------|
| Search Quality | Fuzziness aligned, score filtering, total semantics unified, ADR-120 | [ADR-120](../../../docs/architecture/architectural-decisions/120-per-scope-search-tuning.md) |
| Dispatch Type Safety (3g) | B1 type erasure eliminated (switch dispatch + discriminated union), W1 rename complete | [archived plan](../../plans/semantic-search/archive/completed/search-dispatch-type-safety.md) |
| Phase 3a Complete | MCP search wiring (WS1-WS4), old search replaced (WS5), adversarial review, follow-up cleanup | [archived plan](../../plans/semantic-search/archive/completed/phase-3a-mcp-search-integration.md) |
| Proxy OAuth AS | Transparent proxy to Clerk, Cursor works (ADR-115) | [ADR-115](../../../docs/architecture/architectural-decisions/115-proxy-oauth-as-for-cursor.md) |
| OAuth Spec Compliance | All MCP methods require auth (ADR-113) | [ADR-113](../../../docs/architecture/architectural-decisions/113-mcp-spec-compliant-auth-for-all-methods.md) |
| Transport Bug Fix | Per-request transport pattern (ADR-112) | [ADR-112](../../../docs/architecture/architectural-decisions/112-per-request-mcp-transport.md) |
| SDK Extraction | 16 I/O methods returning `Result<T, E>` | [plan](../../plans/semantic-search/archive/completed/search-sdk-cli.plan.md) |
| Fail-Fast ES Credentials | Silent degradation removed | [plan](../../plans/semantic-search/archive/completed/fail-fast-elasticsearch-credentials.md) |
| Env Architecture | `resolveEnv` pipeline, discriminated `RuntimeConfig` (ADR-116) | [ADR-116](../../../docs/architecture/architectural-decisions/116-resolve-env-pipeline-architecture.md) |
| Code Quality | TSDoc warnings 0, type shortcuts eliminated | -- |
| Widget Phases 0-5 | 18 renderers deleted, 3 renderers built, Zod contract tests, XSS hardening, resilience hardening (error containment, JSON.stringify, fail-fast, delegated clicks, four-way sync) | [plan](../../plans/semantic-search/archive/completed/widget-search-rendering.md) |
| Architecture Remediation (N1-N6) | Turbo schema-cache, ESLint boundary gap, `@oaknational/type-helpers` core package, `/vocab` subpath, MCP tool dir flattening, generator bootstrap cycle | [plan](../../plans/semantic-search/archive/completed/architecture-review-remediation.md) |

---

## Related Documents

### Immediately Relevant

| Document | Why |
|----------|-----|
| [SDK workspace separation](../../plans/semantic-search/archive/completed/sdk-workspace-separation.md) | **Complete** — archived |
| [ADR-108](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md) | SDK workspace decomposition (4-workspace vision, two-pipeline architecture, consumer model, boundary invariants) |
| [ADR-065](../../../docs/architecture/architectural-decisions/065-turbo-task-dependencies.md) | Turbo task dependencies and caching (split-critical for task graph rewiring) |
| [ADR-086](../../../docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md) | Vocab pipeline ownership and generated graph artefact patterns |
| [ADR-120](../../../docs/architecture/architectural-decisions/120-per-scope-search-tuning.md) | Per-scope search tuning decisions (fuzziness, score filtering, total semantics) |
| [roadmap.md](../../plans/semantic-search/roadmap.md) | Overall milestone sequence through Milestone 3 / Public Beta — start here for "what's next" |
| [ADR-107](../../../docs/architecture/architectural-decisions/107-deterministic-sdk-nl-in-mcp-boundary.md) | Deterministic SDK / NL-in-MCP boundary (governs tool descriptions) |
| [ADR-117](../../../docs/architecture/architectural-decisions/117-plan-templates-and-components.md) | Plan templates, components, and document hierarchy |
| [ADR-063](../../../docs/architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md) | SDK domain synonyms source of truth (predates two-concern insight; revision needed post-pipeline) |

### Background Architecture

| Document | Purpose |
|----------|---------|
| [ARCHITECTURE.md](../../../apps/oak-search-cli/docs/ARCHITECTURE.md) | Search pipeline architecture |
| [ADR-108](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md) | SDK Workspace Decomposition |
| [ADR-112](../../../docs/architecture/architectural-decisions/112-per-request-mcp-transport.md) | Per-request MCP transport |
| [ADR-113](../../../docs/architecture/architectural-decisions/113-mcp-spec-compliant-auth-for-all-methods.md) | MCP spec-compliant auth |
| [ADR-115](../../../docs/architecture/architectural-decisions/115-proxy-oauth-as-for-cursor.md) | Proxy OAuth AS for Cursor |
| [ADR-116](../../../docs/architecture/architectural-decisions/116-resolve-env-pipeline-architecture.md) | resolveEnv pipeline architecture |
