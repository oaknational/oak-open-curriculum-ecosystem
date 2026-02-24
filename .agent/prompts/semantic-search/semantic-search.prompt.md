# Semantic Search — Session Entry Point

**Last Updated**: 2026-02-24

---

## Immediate Context

**Branch target**: `feat/semantic_search_deployment` (verify current checkout, do not assume)

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

**Pre-merge required workstreams remaining**:

1. **SDK workspace separation** (3e) — split `curriculum-sdk`
   into generation and runtime workspaces (API + bulk pipelines
   move to generation)
   ([plan](../../plans/semantic-search/active/sdk-workspace-separation.md))

**Search dispatch type safety** (3g) is now **complete**
([archived plan](../../plans/semantic-search/archive/completed/search-dispatch-type-safety.md)).

**Widget stabilisation**: **COMPLETE** (all phases 0-5).
See [Widget Search Rendering](../../plans/semantic-search/archive/completed/widget-search-rendering.md).

**Plans** (in priority order):

- [SDK workspace separation](../../plans/semantic-search/active/sdk-workspace-separation.md) — **merge-blocking** — split curriculum-sdk (WS5 gate satisfied)
- [MCP Tool Snagging](../../plans/semantic-search/archive/completed/search-snagging.md) — **IMPLEMENTED AND SMOKE-TESTED** — all 5 SDK tool bugs fixed with TDD, verified end-to-end (32 tools)
- [Widget Search Rendering](../../plans/semantic-search/archive/completed/widget-search-rendering.md) — **COMPLETE** — all phases (0-5) done
- [Roadmap](../../plans/semantic-search/roadmap.md) — overall milestone sequence (Milestone 0/1/2)
- [MCP Extensions Future Work](../../plans/sdk-and-mcp-enhancements/mcp-extensions-research-and-planning.md) — post-merge only

---

## Standalone Session Bootstrap

Run this checklist at the start of the next session:

1. Re-ground via:
   - [start-right-thorough.prompt.md](../start-right-thorough.prompt.md)
   - [AGENT.md](../../directives/AGENT.md)
   - [rules.md](../../directives/rules.md)
   - [testing-strategy.md](../../directives/testing-strategy.md)
   - [schema-first-execution.md](../../directives/schema-first-execution.md)
2. Verify current state before planning or coding:

   ```bash
   git status --short
   ls -1 .agent/plans/semantic-search/active
   ls -1 .agent/plans/semantic-search/archive/completed
   ```

3. Read split-critical ADRs:
   - [ADR-108](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md) — two-pipeline architecture, consumer model, boundary invariants, 4-workspace vision
   - [ADR-065](../../../docs/architecture/architectural-decisions/065-turbo-task-dependencies.md) — turbo task dependencies and caching
   - [ADR-086](../../../docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md) — vocab pipeline ownership
4. Treat these as active execution plans:
   - [SDK workspace separation](../../plans/semantic-search/active/sdk-workspace-separation.md) — **merge-blocking** (self-sufficient, all decisions resolved)
5. Treat these as complete/archive references only:
   - [sdk-separation-pre-phase1-decisions.md](../../plans/semantic-search/archive/completed/sdk-separation-pre-phase1-decisions.md) — D1-D5 decision rationale (archived)
   - [search-results-quality.md](../../plans/semantic-search/archive/completed/search-results-quality.md) — search quality (ADR-120)
   - [search-snagging.md](../../plans/semantic-search/archive/completed/search-snagging.md) — 5 SDK tool bugs, smoke-tested
   - [widget-search-rendering.md](../../plans/semantic-search/archive/completed/widget-search-rendering.md) — Widget Phases 0-5
   - [search-dispatch-type-safety.md](../../plans/semantic-search/archive/completed/search-dispatch-type-safety.md)
   - [phase-3a-mcp-search-integration.md](../../plans/semantic-search/archive/completed/phase-3a-mcp-search-integration.md)
6. Keep post-merge MCP extension work separate:
   - [mcp-extensions-research-and-planning.md](../../plans/sdk-and-mcp-enhancements/mcp-extensions-research-and-planning.md)

---

## Next Execution Targets

**Merge blocker — SDK workspace separation** (Milestone 0):

**SDK workspace separation** — Phase 0 + 7 execution phases
(8 total). G0 prerequisites are satisfied, all pre-Phase-1
decisions are resolved (archived:
[sdk-separation-pre-phase1-decisions.md](../../plans/semantic-search/archive/completed/sdk-separation-pre-phase1-decisions.md)).
No execution phases have started. Read the full plan before
creating a platform-specific implementation plan.

**Key architectural insight — two pipelines**: the generation
workspace will host two separate data pipelines:

- **API pipeline**: OpenAPI spec → types, Zod schemas, MCP
  tool descriptors. Consumed by the curriculum SDK runtime
  and MCP server apps.
- **Bulk pipeline**: bulk download JSON files → bulk types,
  extractors, ES mappings, vocabulary, domain ontology.
  Consumed by the search SDK and search CLI.

The search SDK never calls the Oak API — it is purely an
Elasticsearch client consuming bulk-derived data. The
curriculum SDK runtime handles API access. Both pipelines
run during `pnpm type-gen` and are partitioned by directory
within the generation workspace. See
[ADR-108](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md)
for the full decomposition architecture.

**Non-negotiable boundaries** (enforced by ESLint SDK boundary rules):

- Generation → no runtime imports (one-way dependency)
- Runtime → generation barrel-only imports (no deep imports)
- Runtime `public/bulk` is removed (consumers import generation directly)
- Always run `pnpm type-gen` from repo root, not individual workspaces

**Phase 0 execution**: prerequisites are confirmed but Phase 0
must still be executed to commit the
`sdk-workspace-separation-baseline.json` evidence file (AC1)
before proceeding to Phase 1.

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
  schema via `pnpm type-gen`.
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
  change. The existing 33 lesson ground truths (30 per-subject +
  3 cross-subject, MRR 0.962) must not regress.
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
schema via `pnpm type-gen`. No ad-hoc types. No `as`. No `any`.
No `!`. No `Record<string, unknown>`. Preserve type information --
never widen a literal to `string`. If the type system resists,
the code is wrong.

**Result pattern.** All I/O methods return `Result<T, E>`. Handle
all cases explicitly. Never throw. Never return null.

**Fail fast.** Never swallow errors. Never log and continue. Fail
immediately with a message that explains what and why.

**Generator-first.** Change templates, rerun `pnpm type-gen`.
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
2. [rules.md](../../directives/rules.md) -- Core rules: TDD, strictness, types, quality, architecture
3. [testing-strategy.md](../../directives/testing-strategy.md) -- TDD at ALL levels, test definitions, violations
4. [schema-first-execution.md](../../directives/schema-first-execution.md) -- Generator is source of truth, prohibited practices
5. [semantic-search-architecture.md](../../directives/semantic-search-architecture.md) -- Structure is the foundation, correct framing
6. [metacognition.md](../../directives/metacognition.md) -- Think about your thoughts, reflect, gain insights
7. [roadmap.md](../../plans/semantic-search/roadmap.md) -- Authoritative milestone sequence

---

## What We Have

A production-ready Elasticsearch-backed semantic search
system split across five workspaces. **Note**: this table
reflects the pre-split state. During SDK workspace separation
execution, the plan's target state (Section 7) overrides this
table — `type-gen/`, `vocab-gen/`, `src/bulk/`, and
`src/types/generated/` move to
`@oaknational/curriculum-sdk-generation`.

| Workspace | Location | Purpose |
|-----------|----------|---------|
| **Oak API SDK** | `packages/sdks/oak-curriculum-sdk/` | Upstream OOC API types, type-gen, MCP tool definitions |
| **Search SDK** | `packages/sdks/oak-search-sdk/` | ES-backed semantic search |
| **Search CLI** | `apps/oak-search-cli/` | Operator CLI + evaluation |
| **MCP STDIO** | `apps/oak-curriculum-mcp-stdio/` | STDIO transport MCP server |
| **MCP HTTP** | `apps/oak-curriculum-mcp-streamable-http/` | HTTP transport MCP server (Vercel) |

The Search SDK imports shared exports from the Oak API SDK
but serves bulk-derived data exclusively (Elasticsearch, not
the Oak API). The Search CLI consumes the Search SDK and
will depend directly on the generation workspace for bulk
types after the SDK split. Both MCP servers consume the Oak
API SDK (tool definitions) and optionally the Search SDK
(search retrieval). The MCP application layer is where both
SDKs connect — aggregated tools orchestrate API and search
together.

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
| Units | 2 | 1.000 | 0.852 |
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
pnpm type-gen
pnpm build
pnpm type-check
pnpm format:root
pnpm markdownlint:root
pnpm subagents:check
pnpm lint:fix
pnpm test
pnpm test:e2e
pnpm test:ui
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

---

## Related Documents

### Immediately Relevant

| Document | Why |
|----------|-----|
| [SDK workspace separation](../../plans/semantic-search/active/sdk-workspace-separation.md) | **Merge-blocking** — split curriculum-sdk (WS5 gate satisfied, pre-Phase-1 decisions resolved) |
| [ADR-108](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md) | SDK workspace decomposition (4-workspace vision, two-pipeline architecture, consumer model, boundary invariants) |
| [ADR-065](../../../docs/architecture/architectural-decisions/065-turbo-task-dependencies.md) | Turbo task dependencies and caching (split-critical for task graph rewiring) |
| [ADR-086](../../../docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md) | Vocab pipeline ownership and generated graph artefact patterns |
| [ADR-120](../../../docs/architecture/architectural-decisions/120-per-scope-search-tuning.md) | Per-scope search tuning decisions (fuzziness, score filtering, total semantics) |
| [roadmap.md](../../plans/semantic-search/roadmap.md) | Overall milestone sequence (Milestone 0/1/2) — start here for "what's next" |
| [ADR-107](../../../docs/architecture/architectural-decisions/107-deterministic-sdk-nl-in-mcp-boundary.md) | Deterministic SDK / NL-in-MCP boundary (governs tool descriptions) |
| [ADR-117](../../../docs/architecture/architectural-decisions/117-plan-templates-and-components.md) | Plan templates, components, and document hierarchy |

### Background Architecture

| Document | Purpose |
|----------|---------|
| [ARCHITECTURE.md](../../../apps/oak-search-cli/docs/ARCHITECTURE.md) | Search pipeline architecture |
| [ADR-108](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md) | SDK Workspace Decomposition |
| [ADR-112](../../../docs/architecture/architectural-decisions/112-per-request-mcp-transport.md) | Per-request MCP transport |
| [ADR-113](../../../docs/architecture/architectural-decisions/113-mcp-spec-compliant-auth-for-all-methods.md) | MCP spec-compliant auth |
| [ADR-115](../../../docs/architecture/architectural-decisions/115-proxy-oauth-as-for-cursor.md) | Proxy OAuth AS for Cursor |
| [ADR-116](../../../docs/architecture/architectural-decisions/116-resolve-env-pipeline-architecture.md) | resolveEnv pipeline architecture |
