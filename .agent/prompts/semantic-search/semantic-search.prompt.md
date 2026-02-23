# Semantic Search — Session Entry Point

**Last Updated**: 2026-02-23

---

## Immediate Context

**Branch target**: `feat/semantic_search_deployment` (verify current checkout, do not assume)

**Phase 3a** (MCP search integration) is **complete** — all five
workstreams done, all quality gates pass. The old REST-based
search has been replaced by SDK-backed Elasticsearch search.
Three tools (`search`, `browse-curriculum`, `explore-topic`)
are the sole search interface.

**Pre-merge required workstreams remaining**:

1. **SDK workspace separation** (3e) — split `curriculum-sdk`
   into type-gen and runtime workspaces
   ([plan](../../plans/semantic-search/active/sdk-workspace-separation.md))

**Search results quality** is a **merge blocker** — single-word
cross-subject queries return the entire lesson index (8,000–10,000
results) with poor-to-mixed ranking:
[search-results-quality.md](../../plans/semantic-search/active/search-results-quality.md)

**Search dispatch type safety** (3g) is now **complete**
([archived plan](../../plans/semantic-search/archive/completed/search-dispatch-type-safety.md)).

**Widget stabilisation status**: **COMPLETE** (all phases 0-5).
Three renderers (search, browse, explore) handle all tool output
shapes with integration contract tests, Zod schema validation,
and Playwright E2E coverage. XSS prevention hardened (single-quote
escaping, `rel="noopener noreferrer"`, `data-oak-url` delegated
click handlers). Phase 5 resilience hardening addressed all
critical and important findings: error containment, JSON.stringify
for JS generation, fail-fast scope validation, four-way sync
enforcement.
See [Widget Search Rendering](../../plans/semantic-search/archive/completed/widget-search-rendering.md).

**Plans** (in priority order):

- [Search results quality](../../plans/semantic-search/active/search-results-quality.md) — **merge-blocking** — fix single-word query pollution (fuzziness, min_score)
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

3. **Read the search quality plan first** — this is the primary
   execution target for the next session:
   - [search-results-quality.md](../../plans/semantic-search/active/search-results-quality.md)
   — contains full root cause analysis, cross-query evidence
   (apple/tree/mountain), impact analysis, and five remediation
   options with file pointers
4. Treat these as active execution plans:
   - [search-results-quality.md](../../plans/semantic-search/active/search-results-quality.md) — **merge-blocking** — search configuration fixes
   - [SDK workspace separation](../../plans/semantic-search/active/sdk-workspace-separation.md) — **merge-blocking**
5. Treat these as complete/archive references only:
   - [search-snagging.md](../../plans/semantic-search/archive/completed/search-snagging.md) — 5 SDK tool bugs, smoke-tested
   - [widget-search-rendering.md](../../plans/semantic-search/archive/completed/widget-search-rendering.md) — Widget Phases 0-5
   - [search-dispatch-type-safety.md](../../plans/semantic-search/archive/completed/search-dispatch-type-safety.md)
   - [phase-3a-mcp-search-integration.md](../../plans/semantic-search/archive/completed/phase-3a-mcp-search-integration.md)
6. Keep post-merge MCP extension work separate:
   - [mcp-extensions-research-and-planning.md](../../plans/sdk-and-mcp-enhancements/mcp-extensions-research-and-planning.md)

### Next Execution Targets

**Merge blocker — Search quality** (Milestone 0):

**Search results quality** — single-word cross-subject queries
return the entire lesson index with poor-to-mixed ranking. The
plan documents three reference queries ("apple", "tree",
"mountain"), root cause analysis (fuzziness, no min_score, ELSER
volume, transcript amplification), and five remediation options.

**Recommended execution order** for search quality fixes:

1. **Create additional cross-subject ground truths** — "tree"
   and "mountain" entries following the `APPLE_LESSONS` pattern in
   `apps/oak-search-cli/src/lib/search-quality/ground-truth/cross-subject/`
2. **Adapt benchmark runner** for cross-subject queries — make
   `subject` optional in `RunQueryInput`, `GroundTruthEntry`,
   `EntryBenchmarkResult`, and adapt output formatting in
   `apps/oak-search-cli/evaluation/analysis/`
3. **Run baseline benchmarks** — capture current MRR/NDCG@10 for
   all ground truths (per-subject + cross-subject) before changes
4. **Implement Option 1** (reduce fuzziness) — change lesson
   BM25 config from `fuzziness: 'AUTO'` to `fuzziness: 'AUTO:4,7'`
   in `packages/sdks/oak-search-sdk/src/retrieval/rrf-query-builders.ts`
5. **Implement Option 2** (add min_score threshold) — filter
   results below a calibrated score threshold
6. **Run comparison benchmarks** — verify cross-subject MRR
   improves while per-subject MRR ≥ 0.95 (no regression)
7. **Evaluate Option 3** (transcript weighting) if Options 1+2
   are insufficient

**Key files for search quality work**:

- `packages/sdks/oak-search-sdk/src/retrieval/rrf-query-builders.ts` — fuzziness and field weights
- `packages/sdks/oak-search-sdk/src/retrieval/rrf-query-helpers.ts` — filter builders, score normalisation
- `packages/sdks/oak-search-sdk/src/retrieval/create-retrieval-service.ts` — query preprocessing
- `apps/oak-search-cli/src/lib/search-quality/ground-truth/cross-subject/` — cross-subject ground truths
- `apps/oak-search-cli/evaluation/analysis/benchmark-query-runner-lessons.ts` — benchmark runner

**Merge blocker — SDK workspace separation** (Milestone 0):

**SDK workspace separation** — 7 phases. G0 gate is
satisfied but no execution phases have started. Read the full
plan before creating a platform-specific implementation plan.

**Post-merge, pre-alpha** (Milestone 0 → Milestone 1):

**MCP Tool Snagging** — **IMPLEMENTED AND SMOKE-TESTED**
(2026-02-22 fixes, 2026-02-23 end-to-end verification). All 5
SDK bugs fixed with full TDD across three execution tracks (A:
response augmentation, B: suggest search, C: schema validation).
All 32 tools verified against running HTTP MCP server. Additionally:
logger architectural bug fixed (DI + OTEL attributes), Snag 1
received input validation guard (subject/keyStage required for
suggest scope). See the
[full plan](../../plans/semantic-search/archive/completed/search-snagging.md)
for root cause analysis and implementation notes.

**Architectural insight from snagging analysis**: all five bugs
stemmed from the same root cause — the response augmentation
system was built outside the schema-first discipline. Medium-term
correction (Phase 4): schema-driven path mapping and context
extraction at `pnpm type-gen` time. See the
[roadmap](../../plans/semantic-search/roadmap.md) for the Phase 4
schema alignment item.

Widget stabilisation is **complete** (all phases 0-5).

**Critical principles for the next session**:

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
  issues, those issues become next steps.
- **Tests that agree with the code on the wrong contract are
  worse than no tests.** They provide false confidence instead
  of genuine verification. Anchor test fixtures to the schema
  (or captured API responses), not to the assumptions of the
  code under test.
- **Ground truths before configuration changes.** Always run
  baseline benchmarks before and after any search configuration
  change. The existing 30 per-subject lesson ground truths
  (MRR 0.983) must not regress.

---

## Search Quality Problem Summary

Single-word cross-subject queries are fundamentally broken:

| Query | Length | Total results | Top-3 quality | Root cause |
|-------|--------|---------------|---------------|------------|
| "apple" | 5 | 8,329 | Poor — #1 is false positive | `fuzziness:AUTO` matches "apply" |
| "tree" | 4 | 10,000 | Mixed — trees + maths "tree diagrams" | `fuzziness:AUTO` matches "three"/"true" |
| "mountain" | 8 | 8,277 | Good — genuine mountains | Volume only (no fuzzy poison) |

**Two compounding problems**:

1. **Volume**: Every query returns the entire index. No `min_score`
   threshold. ELSER assigns non-zero scores to everything.
2. **Ranking** (short words): `fuzziness: 'AUTO'` allows 1-edit
   matches to common words ("apply", "three", "true") that appear
   in thousands of transcripts, overwhelming genuine matches.

**Full analysis**: [search-results-quality.md](../../plans/semantic-search/active/search-results-quality.md)

**Existing ground truth**: `CrossSubjectLessonGroundTruth` type and
`APPLE_LESSONS` entry in
`apps/oak-search-cli/src/lib/search-quality/ground-truth/cross-subject/apple-lessons.ts`

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

4-way RRF hybrid search (BM25 + ELSER on Content + Structure):

```text
query
  → removeNoisePhrases()
  → detectCurriculumPhrases()
  → buildFourWayRetriever():
     BM25 Content  (fuzziness: AUTO, lesson_title^3, lesson_keywords^2, ...)
     ELSER Content  (lesson_content_semantic)
     BM25 Structure (fuzziness: AUTO, lesson_structure^2, lesson_title^3)
     ELSER Structure (lesson_structure_semantic)
  → RRF (rank_window_size: 80, rank_constant: 60)
  → normaliseTranscriptScores()
  → results (no min_score filtering currently)
```

**Key configuration file**: `packages/sdks/oak-search-sdk/src/retrieval/rrf-query-builders.ts`

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
system split across five workspaces:

| Workspace | Location | Purpose |
|-----------|----------|---------|
| **Oak API SDK** | `packages/sdks/oak-curriculum-sdk/` | Upstream OOC API types, type-gen, MCP tool definitions |
| **Search SDK** | `packages/sdks/oak-search-sdk/` | ES-backed semantic search (36 tests) |
| **Search CLI** | `apps/oak-search-cli/` | Operator CLI + evaluation (935 tests) |
| **MCP STDIO** | `apps/oak-curriculum-mcp-stdio/` | STDIO transport MCP server |
| **MCP HTTP** | `apps/oak-curriculum-mcp-streamable-http/` | HTTP transport MCP server (Vercel) |

The Search SDK consumes types from the Oak API SDK.
The Search CLI consumes the Search SDK.
Both MCP servers consume the Oak API SDK (tool definitions)
and optionally the Search SDK (search retrieval).

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

### Ground Truth Baselines

| Index | GTs | MRR | NDCG@10 |
|-------|-----|-----|---------|
| Lessons (per-subject) | 30 | 0.983 | 0.944 |
| Lessons (cross-subject) | 1 | — | — |
| Units | 2 | 1.000 | 0.923 |
| Threads | 8 | 0.938 | 0.902 |
| Sequences | 1 | 1.000 | 1.000* |

\* Single-query index — mechanism check only.

Cross-subject ground truth (1 entry: "apple") cannot yet be
benchmarked — benchmark runner needs adaptation to support
queries without subject filters. This is follow-on work
documented in [search-results-quality.md](../../plans/semantic-search/active/search-results-quality.md).

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
| [Search results quality](../../plans/semantic-search/active/search-results-quality.md) | **Merge-blocking** — fix single-word query pollution |
| [SDK workspace separation](../../plans/semantic-search/active/sdk-workspace-separation.md) | **Merge-blocking** — split curriculum-sdk (WS5 gate satisfied) |
| [MCP Tool Snagging](../../plans/semantic-search/archive/completed/search-snagging.md) | **Post-merge, pre-alpha** — 5 SDK tool bugs with TDD test specs |
| [Widget Search Rendering](../../plans/semantic-search/archive/completed/widget-search-rendering.md) | **COMPLETE** — reference only |
| [roadmap.md](../../plans/semantic-search/roadmap.md) | Overall milestone sequence (Milestone 0/1/2) — start here for "what's next" |
| [MCP Extensions Future Work](../../plans/sdk-and-mcp-enhancements/mcp-extensions-research-and-planning.md) | Post-merge extensions backlog only (not pre-merge execution) |
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
