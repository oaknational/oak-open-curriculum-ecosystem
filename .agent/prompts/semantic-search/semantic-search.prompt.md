# Semantic Search — Session Entry Point

**Last Updated**: 2026-02-12

---

## Current Priority: MCP Search Integration (Phase 3)

SDK extraction is complete (Checkpoints A–E2). Thread search SDK
integration is complete — `searchThreads` is wired through the SDK,
exposed via `oaksearch search threads`, benchmarks use the SDK code
path, 8 ground truths span 5 subjects (MRR=0.938, NDCG@10=0.902),
and legacy `test-query-*.ts` scripts have been deleted. All SDK
retrieval methods have been validated against live Elasticsearch.

**Next action**: Wire the Search SDK into the MCP curriculum servers
to provide semantic search as an MCP tool. See
[wire-hybrid-search.md](../../plans/semantic-search/post-sdk/mcp-integration/wire-hybrid-search.md).

**Roadmap**: [roadmap.md](../../plans/semantic-search/roadmap.md)

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
system split across three workspaces:

- **Search SDK** (`packages/sdks/oak-search-sdk/`): Fully
  implemented retrieval, admin, and observability services
  with dependency injection. All methods return
  `Result<T, E>`. 36 tests.
- **Search CLI** (`apps/oak-search-cli/`): Thin wrapper
  over the SDK providing `oaksearch` commands for search,
  admin, evaluation, and observability. 935 tests.
- **Oak API SDK** (`packages/sdks/oak-curriculum-sdk/`):
  Upstream Oak Open Curriculum API types, generated via
  `pnpm type-gen`.

**DI and credential safety**: The Search SDK requires ES
URL and credentials as explicit constructor arguments —
no environment variable access inside the SDK. Only the
CLI reads env vars (centralised in `src/lib/env.ts`,
ESLint-enforced). The `createCliSdk()` factory maps
env → ES client → SDK instance. All other consumers
(MCP servers, future apps) must provide their own
credentials at construction time.

### Search Pipeline

4-way RRF hybrid search (BM25 + ELSER on both Content
and Structure) for lessons and units, 2-way for threads
and sequences. Query processing includes noise phrase
removal, curriculum phrase detection, and transcript-aware
score normalisation.

**Full details**: [ARCHITECTURE.md](/apps/oak-search-cli/docs/ARCHITECTURE.md)

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
| Lessons | 30 | 0.983 | 0.944 |
| Units | 2 | 1.000 | 0.923 |
| Threads | 8 | 0.938 | 0.902 |
| Sequences | 1 | 1.000 | 1.000* |

\* Single-query index — mechanism check only. Thread GTs were
expanded from 1 to 8 across 5 subjects as part of the
[thread search plan](../../plans/semantic-search/archive/completed/thread-search-sdk-integration.plan.md)
(now complete).

**Protocol**: [Ground Truth Protocol](/apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md)

---

## Completed Work

### SDK Extraction (Checkpoints A–E2) ✅

Full details: [search-sdk-cli.plan.md](../../plans/semantic-search/archive/completed/search-sdk-cli.plan.md)

- SDK workspace at `packages/sdks/oak-search-sdk/`
- All 16 I/O methods return `Result<T, E>` with
  per-service error types (`RetrievalError`, `AdminError`,
  `ObservabilityError`)
- Comprehensive TSDoc on all functions
- CLI at `apps/oak-search-cli/` with error boundary pattern
- Evaluation rewired to use SDK retrieval code paths

### TSDoc Compliance Fix ✅

Non-standard TSDoc tags fixed at source across the entire
codebase (462 files). `eslint-plugin-tsdoc` added with
`tsdoc/syntax: warn` for regression prevention.

---

### Remediation: HTTP 451 + Test Strategy + Documentation ✅

Cross-cutting remediation completed 2026-02-12. The upstream
API returns HTTP 451 (Unavailable For Legal Reasons) for
restricted transcripts. Our SDK now classifies 451 as
`legally_restricted` — a distinct error kind, separate from
`not_found` (404). See [ADR-109](/docs/architecture/architectural-decisions/109-http-451-distinct-classification.md).

Four workstreams completed: 451 error handling (new
`SdkLegallyRestrictedError` kind via generator fix), E2E test
compliance (network IO removal, `process.env` cleanup), stale
documentation updates, directive compliance sweep.

**Plan**: [transcript-451-test-doc-remediation.plan.md](../../plans/semantic-search/archive/completed/transcript-451-test-doc-remediation.plan.md)

### Thread Search: SDK Integration + Ground Truth Validation ✅

Thread search wired through the SDK and exposed to all consumers.
Completed 2026-02-12. Six workstreams:

1. **SDK method**: `searchThreads` on `RetrievalService` — 2-way RRF
   (BM25 on `thread_title^2` + ELSER on `thread_semantic`), subject
   filter maps to `subject_slugs` array field. Extracted to
   `search-threads.ts`; `toRetrievalError` extracted to
   `retrieval-error.ts` to break dependency cycle.
2. **CLI command**: `oaksearch search threads <query>` with
   `--subject` and `--size` options. `registerThreadsCmd` extracted
   to dedicated file for max-lines compliance.
3. **Benchmark migration**: `benchmark-all-threads.ts` and
   `benchmark-threads.ts` now use `sdk.retrieval.searchThreads`
   via `createCliSdk(env())`. No direct `esSearch` calls remain.
4. **Ground truth expansion**: 1 → 8 GTs across 5 subjects (maths,
   science, english, computing, geography). Known-Answer-First
   methodology. Live baselines: MRR=0.938, NDCG@10=0.902,
   P@3=0.333, R@10=0.938.
5. **Validation**: Full benchmark suite run against live ES.
   Documentation updated across roadmap, SDK README, session
   prompt, and ground-truth-protocol.
6. **Legacy cleanup**: 4 `test-query-*.ts` scripts deleted (lessons,
   units, sequences, threads). All references updated to use
   `oaksearch search <scope>` CLI commands.

**Plan**: [thread-search-sdk-integration.plan.md](../../plans/semantic-search/archive/completed/thread-search-sdk-integration.plan.md)

---

## What Needs Doing Next

### MCP Search Integration (Phase 3)

Wire the Search SDK into the MCP curriculum servers
(`apps/oak-curriculum-mcp-stdio/`,
`apps/oak-curriculum-mcp-streamable-http/`), then compare
with existing REST API search and likely replace it:

- Add `semantic-search` MCP tool calling SDK retrieval
- Pass filter parameters (subject, key stage, tier, etc.)
- Handle `Result<T, E>` errors as MCP error responses
- Ship tool examples mapping user intent to SDK calls
- NL stays in MCP layer (ADR-107), SDK is deterministic
- Compare semantic search with existing `search` tool (REST API)
- If superior, replace REST API composite search with SDK-backed search

**Plan**: [wire-hybrid-search.md](../../plans/semantic-search/post-sdk/mcp-integration/wire-hybrid-search.md)

### Phase 4 — Search Quality + Ecosystem

Multiple parallel streams:

| Stream | Focus |
|--------|-------|
| GT Expansion | 30 → 80-100 ground truths |
| Search Quality Levels 2-4 | Document relationships → Modern ES → AI enhancement |
| Bulk Data Analysis | Vocabulary mining from curriculum data |
| SDK API | Filter testing across 17 subjects × 4 key stages |
| Subject Domain Model | Move subject knowledge to type-gen time |
| Operations | Governance, latency budgets, failure modes |

**Details**: [roadmap.md](../../plans/semantic-search/roadmap.md)

---

## CLI Commands (`oaksearch`)

See [apps/oak-search-cli/README.md](../../apps/oak-search-cli/README.md#cli-commands-oaksearch) for the full CLI command reference.

---

## Three Workspaces

| Workspace | Location | Purpose |
|-----------|----------|---------|
| **Oak API SDK** | `packages/sdks/oak-curriculum-sdk/` | Upstream OOC API types, type-gen |
| **Search SDK** | `packages/sdks/oak-search-sdk/` | ES-backed semantic search (36 tests) |
| **Search CLI** | `apps/oak-search-cli/` | Operator CLI + evaluation (935 tests) |

The Search SDK consumes types from the Oak API SDK.
The Search CLI consumes the Search SDK.

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

## Related Documents

| Document | Purpose |
|----------|---------|
| [ARCHITECTURE.md](/apps/oak-search-cli/docs/ARCHITECTURE.md) | Search pipeline architecture |
| [Ground Truth Protocol](/apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md) | Baseline metrics and GT process |
| [ADR-106](/docs/architecture/architectural-decisions/106-known-answer-first-ground-truth-methodology.md) | Ground truth methodology |
| [ADR-082](/docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | Fundamentals-first search strategy |
| [ADR-107](/docs/architecture/architectural-decisions/107-deterministic-sdk-nl-in-mcp-boundary.md) | Deterministic SDK / NL-in-MCP boundary |
| [roadmap.md](../../plans/semantic-search/roadmap.md) | Authoritative plan sequence |
| [Multi-Index Plan](../../plans/semantic-search/archive/completed/multi-index-ground-truths.md) | Completed ground truth work |
| [expansion-plan.md](../../plans/semantic-search/post-sdk/search-quality/ground-truth-expansion-plan.md) | Future GT expansion |
