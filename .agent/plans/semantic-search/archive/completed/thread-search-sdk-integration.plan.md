# Thread Search: SDK Integration + Ground Truth Validation

**Status**: ✅ Complete -- all 6 workstreams executed and validated
**Parent**: [../README.md](../README.md) | [../roadmap.md](../roadmap.md)
**Last Updated**: 2026-02-12

---

## Instruction

~~Thread search exists only in the CLI via direct Elasticsearch calls.
It is **not** exposed through the Search SDK, **not** available as a
CLI search command, and its benchmarks bypass the SDK entirely. With
only 1 ground truth query, thread search quality is unmeasured. This
is not acceptable.~~

**Resolved.** Thread search is now fully wired through the SDK,
exposed via `oaksearch search threads`, benchmarks use the SDK code
path, 8 ground truths span 5 subjects, and legacy scripts are deleted.
Live baseline: MRR=0.938, NDCG@10=0.902, P@3=0.333, R@10=0.938.

### What Threads Are

Threads are **conceptual progression strands** that run across units
and years, connecting units that build a common body of knowledge
over time. They are programme-agnostic: a single thread can span
multiple programmes, key stages, and years. Threads are the
pedagogical backbone of Oak's curriculum -- they show how ideas
BUILD, not just what to teach.

Example: The "Algebra" thread spans 118 units from Reception to
Year 11, progressing from "Counting 0-10" through "Place value"
to "Algebraic fractions" and "Surds".

**Do not confuse with sequences.** Sequences are API organizational
structures for curriculum data storage and retrieval. A sequence
groups units by subject and phase for data management. Threads cut
across sequences, showing conceptual progression.

### This Plan

This plan wires thread search through the SDK, exposes it via the
CLI, migrates benchmarks to the SDK code path, expands ground truths
to a meaningful corpus, deletes legacy debug scripts that bypass the
SDK across ALL search scopes, and validates the whole pipeline.

**Execute all workstreams in order.** Each workstream depends on
the previous (see [dependency graph](#dependencies)).

### Discipline

Read the directives in `.agent/directives/` before touching any
code. They are the authority. This section summarises what they
demand. When in doubt, the directives win.

**First Question.** Before every decision: could it be simpler
without compromising quality? The answer is often no, but bring
real critical thinking to the question each time.

**Strictness is a design requirement.** Do not invent optionality.
Do not add fallback options. Do not create compatibility layers.
We know exactly what is needed. The proper functioning of the
system depends on acknowledging and embracing those restrictions
and valuing the insights offered by the type system.

**Correctness, not convenience.** Every piece of work in this
plan has an existing implementation that demonstrates the correct
pattern. Find it, read it, replicate it with thread-specific
fields. Do not invent a new approach. Do not "improve" the
pattern. Do not offer alternatives. There is one right way.

**TDD at ALL levels.** RED, GREEN, REFACTOR -- at unit,
integration, AND E2E. Write the test first. Run it. It MUST
fail. Only then write the implementation. Run the test again.
It MUST pass. Then refactor. There is no "tested implicitly."
There is no "verify by running." Test behaviour, not
implementation. No complex mocks -- simple fakes injected as
arguments. No global state manipulation. If tests lag behind
code at any level, TDD was not followed.

**Types from the schema. Always.** All types derive from the
OpenAPI schema via `pnpm type-gen`. No ad-hoc types. No type
assertions (`as`). No `any`. No `!`. No `Record<string, unknown>`.
No `Object.*` methods. Preserve type information -- never widen
a literal to `string` or `number`. If the type system resists,
the code is wrong. Fix the code, not the types.

**Result pattern. Don't throw.** All I/O methods return
`Result<T, E>`. Handle all cases explicitly. Never throw to
indicate failure. Never return null. Never swallow errors.

**Fail fast with helpful errors.** If something goes wrong, it
fails immediately with a message that explains what went wrong
and how to fix it. Never log an error and continue. Never
silently succeed with bad data.

**Quality gates are blocking.** Run the full chain after every
workstream. Every gate must pass. A failing gate means the work
is not done. There is no "it's just a lint warning." There is no
"that's pre-existing." Fix it or do not proceed.

**Never disable checks.** No `@ts-ignore`. No `@ts-expect-error`.
No `eslint-disable`. No `--no-verify`. The check is correct. The
code is wrong. Fix the code.

**Generator-first mindset.** When behaviour needs to change,
update the generator templates and rerun `pnpm type-gen`. Never
edit generated files manually. Missing data is a generator bug --
fail fast.

**Architectural boundaries.** Respect the monorepo structure.
SDK consumes types from the Curriculum SDK. CLI consumes the
SDK. Boundaries are enforced by ESLint. Do not bypass them.

**Document everything.** Exhaustive TSDoc on all functions,
interfaces, types, constants. Public APIs must have examples.
All major decisions must have ADRs. Do not create summary
documents -- progressive disclosure from README to TSDoc.

**Protocol.** If you cannot follow proper protocol, STOP and
explain why. Do not work around the protocol.

---

## Workstream Status

| ID | Workstream | Status |
| --- | --- | --- |
| WS1 | [SDK `searchThreads` method](#workstream-1-sdk-searchthreads-method) | ✅ Complete |
| WS2 | [CLI `search threads` command](#workstream-2-cli-search-threads-command) | ✅ Complete |
| WS3 | [Benchmark migration to SDK](#workstream-3-benchmark-migration-to-sdk) | ✅ Complete |
| WS4 | [Ground truth expansion](#workstream-4-ground-truth-expansion) | ✅ Complete |
| WS5 | [Validation and baseline lock](#workstream-5-validation-and-baseline-lock) | ✅ Complete |
| WS6 | [Delete legacy test-query scripts](#workstream-6-delete-legacy-test-query-scripts) | ✅ Complete |

---

## Current State

### What exists

- **CLI query builders**: `buildThreadRrfRequest` and `createThreadRetriever`
  in `apps/oak-search-cli/src/lib/hybrid-search/rrf-query-builders.ts`
  (lines 170-341). Two-way RRF: BM25 on `thread_title^2` + ELSER on
  `thread_semantic`. Filter on `subject_slugs` array. Threads are
  conceptual progression strands (not sequences or programmes).
- **Index resolver knows about threads**: Both SDK
  (`packages/sdks/oak-search-sdk/src/internal/index-resolver.ts`, line 31)
  and CLI (`apps/oak-search-cli/src/lib/search-index-target.ts`, line 15)
  include `'threads'` in `SEARCH_INDEX_KINDS` and map to `oak_threads`.
- **Document type exists**: `SearchThreadIndexDoc` generated in
  `packages/sdks/oak-curriculum-sdk/src/types/generated/search/index-documents.ts`
  with fields: `thread_slug`, `thread_title`, `unit_count`,
  `subject_slugs`, `thread_semantic`, `thread_url`, `title_suggest`.
- **1 ground truth**: `apps/oak-search-cli/src/lib/search-quality/ground-truth/threads/entries/maths.ts`
  with query `'algebra equations progression'` and expected relevance `{ algebra: 3 }`.
- **Benchmark runner**: `apps/oak-search-cli/evaluation/analysis/benchmark-threads.ts`
  and `benchmark-all-threads.ts` use direct `esSearch` calls, not the SDK.
- **Thread GT type**: `ThreadGroundTruth` in
  `apps/oak-search-cli/src/lib/search-quality/ground-truth/threads/types.ts`.

### What is missing

- **SDK**: No `searchThreads` on `RetrievalService`. No `SearchThreadsParams`,
  `ThreadResult`, or `ThreadsSearchResult` types. No `buildThreadRetriever`
  in the SDK.
- **CLI**: No `oaksearch search threads` command. No `handleSearchThreads` handler.
- **Benchmarks**: `benchmark-all-threads.ts` calls `esSearch` directly --
  it does not exercise the SDK code path that MCP and other consumers will use.
- **Ground truths**: Only 1 query. With ~164 thread documents spanning
  all 16 subjects (some MFL threads like "adjectives" span french,
  german, and spanish simultaneously), a single GT is a mechanism check,
  not quality measurement.
- **Legacy test-query scripts**: Four debug scripts in
  `apps/oak-search-cli/src/lib/search-quality/` bypass the SDK entirely:
  `test-query-lessons.ts`, `test-query-units.ts`,
  `test-query-sequences.ts`, `test-query-threads.ts`. All four call
  `esSearch` directly. This is not just a thread problem -- lessons,
  units, and sequences are also affected. Once the CLI `search` commands
  exist for all scopes (WS2 completes the set), these scripts are
  redundant and must be deleted.

### Pattern to follow

Sequences are the closest analog in terms of search architecture. They
also use 2-way RRF (BM25 + semantic), have a similar document size, and
follow the same SDK patterns. Note: despite the structural similarity in
search, threads and sequences are ontologically different -- threads are
conceptual progression strands while sequences are API data structures.
The SDK already has:

- `SearchSequencesParams` in `retrieval-params.ts`
- `SequenceResult` and `SequencesSearchResult` in `retrieval-results.ts`
- `buildSequenceRetriever` in `retrieval-search-helpers.ts`
- `searchSequences` in `create-retrieval-service.ts`

Thread search MUST follow this exact pattern with thread-specific
fields. Do not deviate.

---

## Workstream 1: SDK `searchThreads` Method

**Goal**: Add `searchThreads` to the Search SDK's `RetrievalService`
using the same patterns as `searchSequences`.

### Files to create/modify

**`packages/sdks/oak-search-sdk/src/types/retrieval-params.ts`**

Add `SearchThreadsParams`:

```typescript
export interface SearchThreadsParams extends SearchParamsBase {
  // No additional fields needed for V1.
  // The inherited `subject?: SearchSubjectSlug` provides subject filtering.
  // Internally, searchThreads maps this to `{ term: { subject_slugs: value } }`
  // because the thread index uses `subject_slugs` (plural array field).
}
```

This follows the same pattern as `SearchSequencesParams`: extend
`SearchParamsBase` and use the inherited `subject?: SearchSubjectSlug`.
`SearchSubjectSlug` resolves to the schema-derived `Subject` type which
includes all 17 canonical subjects (including german and spanish).

The ES index field difference (`subject_slugs` array vs `subject_slug`
scalar) is an implementation detail handled inside the `searchThreads`
function, not exposed to consumers.

Note: `subject_slugs` is optional in `SearchThreadIndexDoc`
(`z.array(z.string().min(1)).optional()`). Some thread documents may
have no subject slugs. The implementation should handle this gracefully:
when no subject filter is provided, return all threads regardless.

**`packages/sdks/oak-search-sdk/src/types/retrieval-results.ts`**

Add `ThreadResult` and `ThreadsSearchResult`:

```typescript
import type { SearchThreadIndexDoc } from '@oaknational/oak-curriculum-sdk/public/search.js';

export interface ThreadResult {
  readonly id: string;
  readonly rankScore: number;
  readonly thread: SearchThreadIndexDoc;
}

export interface ThreadsSearchResult extends SearchResultMeta {
  readonly scope: 'threads';
  readonly results: readonly ThreadResult[];
}
```

**`packages/sdks/oak-search-sdk/src/retrieval/retrieval-search-helpers.ts`**

Add `buildThreadRetriever` (mirrors `buildSequenceRetriever`):

Two-way RRF with BM25 on `thread_title^2` + semantic on `thread_semantic`.
`fuzziness: 'AUTO'` on the BM25 retriever. `rank_window_size: 40`,
`rank_constant: 40`.

**`packages/sdks/oak-search-sdk/src/retrieval/create-retrieval-service.ts`**

Add `searchThreads` function (follows `searchSequences` pattern):

1. Clamp size/from
2. Build filter from `params.subject` (term query on ES field `subject_slugs`)
3. Build request with `resolveIndex('threads')` and `buildThreadRetriever`
4. Execute `search<SearchThreadIndexDoc>(request)`
5. Map hits to `ThreadResult[]`
6. Return `ok({ scope: 'threads', results, total, took, timedOut })`

Wire into `createRetrievalService` return object.

**`packages/sdks/oak-search-sdk/src/types/retrieval.ts`**

Add `searchThreads` to the `RetrievalService` interface. Add
`ThreadResult`, `ThreadsSearchResult` to re-exports.
Add `SearchThreadsParams` to param re-exports.

**SDK barrel exports**

Ensure `ThreadResult`, `ThreadsSearchResult`, `SearchThreadsParams` are
exported from `src/index.ts` and the retrieval type barrels.

### TDD

1. **RED**: Write integration test in a new file
   `src/retrieval/search-threads.integration.test.ts`. Read
   `search-sequences.integration.test.ts` first -- replicate that
   exact structure. Mock the ES client with `vi.spyOn`. Assert:
   - Returns `ok` with `scope: 'threads'`
   - Results contain `ThreadResult` with correct fields
   - Calls ES with correct index (`oak_threads` or `oak_threads_sandbox`)
   - Subject filter maps `params.subject` to `{ term: { subject_slugs: value } }`
   - Size clamping works
   - ES error produces `err` with `RetrievalError`

   Run the test. It MUST fail. If it does not fail, the test is
   wrong -- it is not testing new behaviour.
2. **GREEN**: Implement the method and helpers. Run the test. It
   MUST pass. Do not move on until it does.
3. **REFACTOR**: Ensure code stays within file size limits (250
   lines per file, 50 lines per function). Split by responsibility
   if needed -- never compress documentation to meet limits.

### Checklist

- [x] ~~`SearchThreadsParams` added to `retrieval-params.ts`~~ Used `SearchParamsBase` directly — empty interface violates `@typescript-eslint/no-empty-object-type`
- [x] `ThreadResult` and `ThreadsSearchResult` added to `retrieval-results.ts`
- [x] `buildThreadRetriever` added to `retrieval-search-helpers.ts`
- [x] `searchThreads` function in `search-threads.ts` (extracted — `create-retrieval-service.ts` at 250-line limit)
- [x] `searchThreads` added to `RetrievalService` interface
- [x] Types exported from SDK barrel (`src/index.ts`)
- [x] Integration tests pass (RED then GREEN) — 2 new tests in `create-search-sdk.integration.test.ts`
- [x] Quality gates pass
- [x] `toRetrievalError` extracted to `retrieval-error.ts` to break dependency cycle

---

## Workstream 2: CLI `search threads` Command

**Goal**: Add `oaksearch search threads <query>` to the CLI,
following the existing lessons/units/sequences pattern.

### Files to modify

**`apps/oak-search-cli/src/cli/search/handlers.ts`**

Add `handleSearchThreads`:

```typescript
export async function handleSearchThreads(
  retrieval: RetrievalService,
  params: SearchThreadsParams,
): Promise<Result<ThreadsSearchResult, RetrievalError>> {
  return retrieval.searchThreads(params);
}
```

**`apps/oak-search-cli/src/cli/search/index.ts`**

Add `registerThreadsCmd` following the `registerSequencesCmd` pattern:

- Command: `threads`
- Argument: `<query>` (search query text)
- Options: `-s, --subject <slug>` (subject filter), `--size <n>`
- Action: Create SDK, validate params, call `handleSearchThreads`,
  print JSON result or error

Register in the `registerSearchCommands` function alongside the existing
`registerSequencesCmd`.

### TDD

1. **RED**: Write test for `handleSearchThreads` in `handlers.test.ts`.
   Read the existing handler tests first -- replicate that exact
   structure. Assert it delegates to `retrieval.searchThreads` and
   returns the result unchanged. Run the test. It MUST fail.
2. **GREEN**: Implement handler and command registration. Run the
   test. It MUST pass.
3. **REFACTOR**: Verify max-lines compliance (250 per file, 50 per
   function). Split if needed.

### Checklist

- [x] `handleSearchThreads` added to `handlers.ts`
- [x] `registerThreadsCmd` extracted to `register-threads-cmd.ts` (`index.ts` at 250-line limit)
- [x] CLI command works: `oaksearch search threads "algebra progression"`
- [x] Tests pass — 1 new test in `handlers.integration.test.ts`
- [x] Quality gates pass

---

## Workstream 3: Benchmark Migration to SDK

**Goal**: Migrate thread benchmark runners from direct ES calls to
the SDK `searchThreads` method, so benchmarks exercise the same code
path that MCP and other consumers use.

### Files to modify

**`apps/oak-search-cli/evaluation/analysis/benchmark-all-threads.ts`**

Replace:

```typescript
const searchAdapter: ThreadSearchFunction = async (request) => {
  const response = await esSearch<SearchThreadIndexDoc>(request);
  // ...extracts thread_slug only...
};
```

With an adapter that calls `sdk.retrieval.searchThreads(params)` and
maps the SDK `ThreadsSearchResult` to the format the benchmark runner
expects.

Follow the pattern used by `benchmark-all-lessons.ts` or
`benchmark-all-units.ts` if they use SDK adapters.

**`apps/oak-search-cli/evaluation/analysis/benchmark-query-runner-threads.ts`**

Update `ThreadSearchFunction` type to accept SDK-compatible params
rather than raw `EsSearchRequest`. The runner MUST receive
`{ text, size, subject }` (matching `SearchThreadsParams`) and return
`ThreadResult[]`, not raw ES hits.

The existing lesson/unit benchmark runners have already been
migrated to the SDK. Read `benchmark-all-lessons.ts` and
`benchmark-all-units.ts`. Replicate that exact pattern for threads.
There is one right way.

**`apps/oak-search-cli/evaluation/analysis/benchmark-threads.ts`**

Update the standalone thread benchmark to use the SDK path.

### TDD

1. **RED**: Write a test that constructs the SDK adapter, invokes
   it with a mock `searchThreads`, and asserts the benchmark runner
   receives `ThreadResult[]` (not raw ES hits). The test MUST fail
   because the adapter does not exist yet.
2. **GREEN**: Implement the adapter. The test MUST pass.
3. **VERIFY**: Run `oaksearch eval benchmark threads` against real
   ES and confirm output matches previous baselines. This is
   validation, not a substitute for the unit test above.

### Checklist

- [x] `benchmark-all-threads.ts` uses `sdk.retrieval.searchThreads.bind(sdk.retrieval)`
- [x] `benchmark-query-runner-threads.ts` rewritten: `ThreadSearchFunction` accepts `SearchParamsBase`, returns `Result<ThreadsSearchResult, RetrievalError>`
- [x] `benchmark-threads.ts` uses SDK path via `createCliSdk(env())`
- [x] Direct `esSearch` calls removed from thread benchmarks
- [x] `pnpm benchmark:threads --all` passes: MRR=0.938, NDCG@10=0.902
- [x] Quality gates pass

---

## Workstream 4: Ground Truth Expansion

**Goal**: Expand thread ground truths from 1 to at least 5 queries,
covering multiple thread domains. Follow the Known-Answer-First
methodology strictly.

### Methodology

1. **Explore available threads**: Use ALL bulk data files
   (`bulk-downloads/*.json`) to list thread slugs and titles across
   all 16 subjects. Do not restrict to maths.
2. **Group by subject and domain**: The ~164 threads span all 16 subjects.
   Some MFL threads (adjectives, negation, questions, etc.) span french,
   german, and spanish simultaneously. Group by subject first, then by
   conceptual domain within each subject.
3. **Design realistic queries**: What would a teacher searching for
   how a concept builds across years actually type? Focus on
   progression-oriented vocabulary ("how does algebra develop?",
   "fractions progression across key stages").
4. **Test each query**: Use `oaksearch search threads <query>` (from WS2)
   to verify results via the SDK code path
5. **Capture results**: Record top 3 results with relevance scores (3/2/1)
6. **Create GT entries**: One file per subject or domain in
   `src/lib/search-quality/ground-truth/threads/entries/`

### Target coverage

Threads span all 16 subjects. Ground truths must sample across subjects,
not just maths. The table below is indicative -- exact queries will be
determined by exploring the bulk data using Known-Answer-First methodology.

| Subject(s) | Domain | Example query | Notes |
| --- | --- | --- | --- |
| maths | Algebra | `algebra equations progression` | Existing GT -- review and expand |
| maths | Geometry | `geometry shapes measurement` | Geometry and measure strand |
| science | Scientific enquiry | `scientific enquiry investigation` | Cross-KS progression |
| citizenship | Active citizenship | `active citizenship democracy` | Social/civic strand |
| french/german/spanish | MFL adjectives | `adjective agreement grammar` | Cross-language MFL thread |
| english | Reading comprehension | `reading comprehension inference` | Literacy progression |
| history | Historical enquiry | `historical evidence sources` | Enquiry skills strand |

Aim for 5-8 ground truths spanning at least 3 different subjects.
Maths should not dominate -- the existing GT already covers it.

### Files to create/modify

- New entry files in `apps/oak-search-cli/src/lib/search-quality/ground-truth/threads/entries/`
- Update `apps/oak-search-cli/src/lib/search-quality/ground-truth/threads/index.ts`
  to export new entries
- Update target counts in `threads/index.ts` and `threads/types.ts` TSDoc

### Checklist

- [x] Bulk data explored, ~164 threads catalogued across 16 subjects
- [x] 7 new ground truth entries created (8 total including existing maths algebra)
- [x] Each GT has expected results with relevance scores (3/2/1)
- [x] All GTs registered in `threads/index.ts` — target count updated to 8
- [x] `pnpm type-check` passes
- [x] Quality gates pass

**Ground truths created:**

| File | Subject | Query |
| --- | --- | --- |
| `maths.ts` (existing) | Maths | `algebra equations progression` |
| `maths-fractions.ts` | Maths | `fractions progression primary maths` |
| `maths-geometry.ts` | Maths | `geometry shapes angles measurement` |
| `science-forces.ts` | Science | `forces and motion physics progression` |
| `science-chemical-reactions.ts` | Science | `chemical reactions substances changing` |
| `english-fiction-writing.ts` | English | `fiction creative writing skills progression` |
| `computing-programming.ts` | Computing | `programming coding skills progression` |
| `geography-climate.ts` | Geography | `climate weather patterns geography` |

---

## Workstream 5: Validation and Baseline Lock

**Goal**: Run the full benchmark suite through the SDK code path,
establish stable baselines for thread search, and update documentation.

### Tasks

1. Run `oaksearch eval benchmark threads` (now using SDK)
2. Record MRR, NDCG@10, P@3, R@10 across all thread GTs
3. With 5+ queries, these become real baselines (not mechanism checks)
4. Update the following documentation:

**`apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md`**

- Update thread GT count from 1 to actual count
- Update thread baselines from mechanism check to measured values
- Remove "treat as mechanism check" caveat if 5+ GTs

**`.agent/plans/semantic-search/roadmap.md`**

- Update thread GT count and metrics in the Current State table
- Update thread status from "mechanism check" to "baselined"

**`packages/sdks/oak-search-sdk/README.md`**

- Add `searchThreads` to the SDK method listing

**`.agent/prompts/semantic-search/semantic-search.prompt.md`**

- Update thread search status

### Checklist

- [x] Full benchmark suite runs through SDK: `pnpm benchmark:threads --all`
- [x] Thread metrics recorded: MRR=0.938, NDCG@10=0.902, P@3=0.333, R@10=0.938
- [x] `ground-truth-protocol.md` updated with new baselines
- [x] `roadmap.md` updated — threads status: "✅ SDK integrated, CLI wired, benchmarks migrated"
- [x] SDK README updated — `searchThreads` added, test count updated to 36
- [x] Session prompt updated — current priority advanced to "SDK Validation against Real Elasticsearch (Phase 2e)"
- [x] Quality gates pass
- [x] All tests pass (unit, integration, E2E)

---

## Workstream 6: Delete Legacy Test-Query Scripts

**Goal**: Remove the four `test-query-*.ts` debug scripts that bypass
the SDK by calling `esSearch` directly. These exist for ALL search
scopes, not just threads. Once the CLI `search` commands cover all
scopes (WS2 completes the set), these scripts are redundant and
architecturally harmful -- they exercise a different code path from
what consumers actually use.

### Files to delete

| Script | SDK replacement |
| --- | --- |
| `apps/oak-search-cli/src/lib/search-quality/test-query-lessons.ts` | `oaksearch search lessons <query>` |
| `apps/oak-search-cli/src/lib/search-quality/test-query-units.ts` | `oaksearch search units <query>` |
| `apps/oak-search-cli/src/lib/search-quality/test-query-sequences.ts` | `oaksearch search sequences <query>` |
| `apps/oak-search-cli/src/lib/search-quality/test-query-threads.ts` | `oaksearch search threads <query>` |

### Before deletion

These checks are mandatory, not optional.

- Verify no other code imports from these files. Use `rg` to
  search. Do not guess.
- Verify no `package.json` scripts reference them. Search all
  `package.json` files in the repo.
- Verify the CLI `search` commands produce equivalent output for
  each scope. Run a query through both the legacy script and the
  CLI command, compare results. If they differ, the CLI command
  is authoritative -- investigate why the legacy script differs.

### Checklist

- [x] Verified no imports or script references (searched with `rg`)
- [x] All four `test-query-*.ts` files deleted
- [x] References in GT entries and `ground-truth/README.md` updated to use `oaksearch search <scope>` commands
- [x] Quality gates pass

---

## Dependencies

```text
WS1 (SDK method)
      ↓
WS2 (CLI command)  ←→  WS3 (Benchmark migration)
      ↓                          ↓
      ├──→ WS4 (GT expansion — needs CLI search for query testing)
      └──→ WS6 (Delete legacy test-query scripts — needs CLI search as replacement)
                  ↓
WS5 (Validation — needs all above complete)
```

WS2 and WS3 can be done in parallel after WS1.
WS4 needs WS2 (for query testing via CLI).
WS6 needs WS2 (CLI commands replace the deleted scripts).
WS5 needs WS1-WS4 and WS6 all complete.

---

## Quality Gates

Run the full chain after every workstream, from repo root.
Not some of them. All of them. In this order.

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

Every gate MUST pass. A workstream is not complete until every
gate passes. There is no such thing as an acceptable failure.
There is no such thing as "someone else's problem." If a gate
fails, fix it before proceeding. If fixing it requires changes
outside the current workstream, make those changes.

---

## Related Documents

| Document | Purpose |
| --- | --- |
| [ADR-107](../../../../docs/architecture/architectural-decisions/107-deterministic-sdk-nl-in-mcp-boundary.md) | SDK accepts structured params, no NL parsing |
| [Ground Truth Protocol](/apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md) | Baselines and process |
| [Ground Truth Guide](/apps/oak-search-cli/src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md) | Design principles |
| [Search SDK README](/packages/sdks/oak-search-sdk/README.md) | SDK documentation |
| [Archived SDK-CLI plan](../archive/completed/search-sdk-cli.plan.md) | Reference for extraction patterns |
