---
name: "Practice Graph Payoff-Peak Pilot"
overview: "Queued executable slice: build the highest-value derived Practice graph with a bounded TypeScript + esbuild workspace cluster, explicit-edge extraction, and read-only local navigation surfaces."
todos:
  - id: phase-0-red-baseline
    content: "Phase 0 (RED): Lock the pilot corpus, workspace-boundary gate, output contract, and failing tests."
    status: pending
  - id: phase-1-green-workspaces
    content: "Phase 1 (GREEN): Create the graph workspaces and deterministic build pipeline with explicit-edge extraction and frontmatter-insensitive cache behaviour."
    status: pending
  - id: phase-2-green-navigation
    content: "Phase 2 (GREEN): Ship local graph outputs plus CLI build/report/query/path surfaces through agent-tools."
    status: pending
  - id: phase-3-refactor-docs
    content: "Phase 3 (REFACTOR): Add READMEs, acknowledgement, discoverability, documentation propagation, and closeout rationale for any deferred surfaces."
    status: pending
  - id: phase-4-quality-gates
    content: "Phase 4: Run the full quality-gate chain and capture evidence."
    status: pending
  - id: phase-5-review
    content: "Phase 5: Run the scheduled reviewer passes and document findings or follow-ons."
    status: pending
isProject: false
---

# Practice Graph Payoff-Peak Pilot

**Last Updated**: 2026-04-23  
**Status**: 🔴 NOT STARTED  
**Scope**: Build the first high-value derived Practice graph slice as a
strictly bounded internal tool: deterministic, read-only, TypeScript-only,
esbuild-based for all new workspaces, and explicitly non-canonical.

**Strategic parent**:
[graphify-and-graph-memory-exploration.plan.md](../future/graphify-and-graph-memory-exploration.plan.md)

**Authoritative research sources**:

- [graphify-oak-practice-analysis.md](../../../research/graphify-oak-practice-analysis.md)
- [graphify-repo-deep-dive-report.md](../../../reports/agentic-engineering/deep-dive-syntheses/graphify-repo-deep-dive-report.md)
- [learning-loops-and-balancing-feedback-report.md](../../../reports/agentic-engineering/deep-dive-syntheses/learning-loops-and-balancing-feedback-report.md)

**Promotion note**: this is the first promoted executable slice from the
broader graph-memory exploration brief. The pilot question, corpus, boundary,
and likely workspace home are now explicit enough for `current/`.

---

## Intended Impact

This pilot is intended to produce four concrete outcomes:

1. **Navigation becomes materially cheaper across Practice, ADR, onboarding,
   and selected live strategy surfaces.**
   Impact: agents and humans can answer "where do I start?", "what connects
   these two documents?", and "which docs act as hubs or bridges?" without
   relying on repeated raw search alone.
2. **Implicit textual structure becomes explicit and queryable without
   inventing a new truth plane.**
   Impact: the repo gains a "map before grep" layer while canonical sources
   remain canonical.
3. **The first graph implementation lands in repo-native shape, not as an
   imported tool.**
   Impact: TypeScript, esbuild, repo testing discipline, README standards,
   and workspace boundaries all remain under Oak control.
4. **The workspace topology is strong enough for later extension without
   paying the cost of a larger platform up front.**
   Impact: the pilot can later grow into an internal MCP/service surface if
   warranted, but does not pre-commit to it.

---

## Strict Scope

### In Scope

1. A **curated pilot corpus** only, defined in code and tests rather than
   inferred from the whole repo.
2. **Explicit extracted edges only**:
   `MARKDOWN_LINK`, `SEE_ALSO`, `WORKFLOW_ORDER`, `PLAN_RELATION`,
   `INDEX_MEMBERSHIP`, and `DOC_CODE_LINK` where a markdown document links to
   a real local code file.
3. A **bounded workspace cluster**:
   - one required new library workspace for Practice-graph behaviour
   - one optional new core workspace only if the framework/consumer seam is
     proven during RED
   - thin command wiring in the existing `agent-tools` workspace
4. Deterministic local outputs:
   - `.agent/local/practice-graph/graph.json`
   - `.agent/local/practice-graph/GRAPH_REPORT.md`
5. Local command surfaces for:
   - `build`
   - `report`
   - `query`
   - `path`
6. TypeScript only for all new implementation code, and **esbuild for all new
   workspace build pipelines**.
7. Full repo standards: TDD, README coverage, linting, typing, documentation
   propagation, and quality gates.

### Out of Scope

1. LLM-derived semantic edges, embeddings, clustering via model inference, or
   any non-deterministic extraction.
2. Query-result write-back, self-feeding memory, or any automatic mutation of
   `.agent/memory/` based on derived graph output.
3. Whole-repo graphing.
4. HTML visualisation, browser UI, or graph-canvas work.
5. Code-symbol graphs, AST graphs, or dependency-cruiser replacement work.
6. Public curriculum MCP integration, or mixing this graph into
   `packages/sdks/oak-curriculum-sdk`.
7. A dedicated internal app/service workspace in this pilot.
8. Direct Graphify code adoption.
9. Python or shell-script graph logic.

**Stop line**: if the pilot starts needing semantic inference, a dedicated app
workspace, or whole-repo ingestion to feel useful, stop and promote a new
strategic slice rather than expanding this plan.

---

## Pilot Corpus

The pilot corpus is explicit and intentionally high-signal.

The **authoring allow-list** for Phase 0 selection is:

1. `README.md`
2. `docs/README.md`
3. `docs/architecture/architectural-decisions/**/*.md`
4. `.agent/practice-core/**/*.md`
5. `.agent/directives/**/*.md`
6. `.agent/practice-index.md`
7. `.agent/memory/README.md`
8. `.agent/memory/operational/repo-continuity.md`
9. `.agent/plans/developer-experience/active/onboarding-simulations-public-alpha-readiness.md`
10. `.agent/plans/agentic-engineering-enhancements/current/learning-loop-negative-feedback-tightening.plan.md`
11. `.agent/plans/agentic-engineering-enhancements/future/graphify-and-graph-memory-exploration.plan.md`

The **live pilot corpus** must then be frozen as a checked-in manifest with
exact relative file paths, for example
`packages/libs/practice-graph/src/corpus/pilot-corpus.manifest.ts`. Recursive
globs are allowed only to help author the initial selection; they are **not**
the runtime contract for this pilot.

Anything outside the checked-in manifest is out of scope for the pilot unless
a later explicit follow-on changes the manifest and corresponding RED fixtures.

---

## Workspace Organisation

### Required Workspace

#### `packages/libs/practice-graph/`

Owns the Oak-specific behaviour:

- corpus manifest
- markdown/frontmatter parsing
- document typing and metadata extraction
- explicit-edge extraction
- split cache strategy:
  - body-derived extraction may ignore frontmatter-only churn
  - frontmatter-derived metadata/report invalidation must remain sensitive to
    frontmatter changes
- graph build orchestration
- report generation

Rules:

- TypeScript only
- esbuild for `build`
- no CLI argument parsing
- no stdio/MCP server code
- no writes to canonical memory or reference surfaces

### Conditional Workspace

#### `packages/core/graph-core/`

Create this workspace **only if** Phase 0 proves a genuine consumer-agnostic
mechanism that satisfies ADR-154.

Allowed contents:

- immutable graph types
- adjacency/index helpers
- shortest-path logic
- lightweight graph metrics used by the report layer
- serialisation/deserialisation helpers

Forbidden contents:

- filesystem access
- markdown parsing
- frontmatter parsing
- repo-path heuristics
- report prose generation
- corpus manifests

Standards if created:

- TypeScript only
- esbuild for `build`
- README with explicit extraction rationale and non-goals
- no deviation from the repo standard for new workspace build tooling

**Creation gate**: only create `packages/core/graph-core/` if the extracted
mechanism is both:

1. free of repo-specific/document-format dependencies, and
2. useful to more than one internal module boundary inside the pilot
   (e.g. builder + report + query layers) such that keeping it inline would
   actively entangle filesystem/document logic with graph mechanics.

If the gate is not met, keep the code in `packages/libs/practice-graph/` and
record a no-extraction rationale in the workspace README and phase notes.

### Existing Workspace Extension

#### `agent-tools/`

Owns the human/agent command surface only:

- `practice-graph build`
- `practice-graph report`
- `practice-graph query`
- `practice-graph path`

Rules:

- no graph algorithms
- no markdown parsing
- no direct filesystem corpus discovery
- thin adapter over the `practice-graph` public API only

### Deferred Workspace

#### Dedicated internal MCP/service workspace

Explicitly deferred. If a read-only internal MCP/service surface later proves
worthwhile, it should be proposed as a new plan after this pilot demonstrates
that CLI/report usage is valuable enough to justify the extra runtime surface.

---

## Acknowledgement and Borrowing Boundary

This pilot follows the **build our own, with explicit acknowledgement** route.

Implementation artefacts in this plan must:

1. name **Graphify** explicitly,
2. name **Safi Shamsi** explicitly,
3. link to the upstream repo and the specific artefacts being adapted,
4. describe the Oak implementation as **inspired by** or **adapted from**
   Graphify rather than presented as wholly novel,
5. keep outputs advisory, navigational, and derived.

This pilot may adopt ideas such as:

- `graph.json` and `GRAPH_REPORT.md` output shape
- query/path interaction model
- body-aware markdown cache invalidation

This pilot must not adopt:

- Graphify's repo-mutating installer model
- query-memory write-back loop
- Python runtime/tooling dependency
- upstream code copied without separate legal/licensing review

---

## Measurable Pilot Questions

The pilot is only useful if it can answer these concretely:

1. What is the recommended starting path for:
   - a new contributor understanding the Practice,
   - someone tracing how onboarding links back to doctrine,
   - someone moving from ADRs into live agentic-engineering work?
2. What is the shortest path between two named documents in the curated corpus?
3. Which documents are central hubs, bridges, and weakly integrated orphans?
4. Which edges are explicit and traceable enough to justify trust?

If the landed surfaces cannot answer those four questions materially better
than raw `rg` + manual reading, the pilot did not deliver enough value.

---

## Session Discipline

> **Session discipline**: see
> [`../../templates/components/session-discipline.md`](../../templates/components/session-discipline.md).
> The four disciplines (template-not-contract count, mid-arc checkpoints,
> context-budget thresholds, metacognition at open) apply to every session in
> this plan.

Plan-specific amendments:

- Treat the workspace-boundary decision as a **mid-arc checkpoint**. If the
  supposed core seam is not clearly justified after RED, collapse back to the
  simpler single-library shape rather than carrying speculative structure.
- If a session approaches a service/app discussion, stop and re-check the stop
  line before continuing.

---

## Reviewer Scheduling

### Plan-Phase (PRE-execution)

- `assumptions-reviewer` — validate that this is truly the payoff-peak slice,
  not a disguised platform build
- `architecture-reviewer-fred` — validate workspace boundaries and ADR-154
  discipline

### Mid-Cycle (DURING execution)

- `test-reviewer` — after RED fixtures and contracts are written
- `architecture-reviewer-betty` — after workspace scaffold and extraction
  boundary land
- `code-reviewer` — after CLI/report/query/path wiring

### Close (POST-execution)

- `docs-adr-reviewer` — documentation/acknowledgement/drift coherence
- `onboarding-reviewer` — confirm the graph outputs actually help first-contact
  discovery

---

## Resolution Plan

### Phase 0 (RED): Lock the Boundary and Prove the Contract

#### Task 0.1: Write fixture corpus and expected graph contract

**Goal**: create a representative, stable fixture corpus and prove the node,
edge, and path expectations before implementation exists.

**Acceptance Criteria**:

1. A fixture corpus exists under the new graph workspace's tests directory.
2. A checked-in live pilot manifest with exact relative file paths exists.
3. The live pilot manifest contains only files drawn from the authoring
   allow-list and no recursive runtime globs.
4. The fixture includes at least:
   - an ADR
   - a Practice Core file
   - a directive
   - the onboarding hub
   - an operational doc
5. Expected node count, edge count, and at least three shortest-path examples
   are asserted in tests for both the fixture corpus and the checked-in live
   pilot manifest.
6. All new tests fail for the expected reason before implementation begins.

#### Task 0.2: Prove the workspace split

**Goal**: make the `graph-core` decision explicit rather than aesthetic.

**Acceptance Criteria**:

1. A written gate determines whether `packages/core/graph-core/` is created.
2. The gate references ADR-154 directly.
3. If the workspace is created, the gate also confirms it will be TypeScript
   only and use esbuild for `build`.
4. The decision is recorded before Phase 1 scaffolding starts.
5. If the gate fails, the plan stays in the simpler single-library shape.

#### Task 0.3: Write command-surface contract tests

**Goal**: define the CLI outputs before wiring the adapter.

**Acceptance Criteria**:

1. Contract tests exist for `build`, `report`, `query`, and `path`.
2. Out-of-process CLI tests exist for the thin `agent-tools` wrapper, covering
   argument parsing, exit codes, and stdout/stderr contract.
3. Output expectations are deterministic and fixture-backed.
4. Tests fail before implementation.

**Deterministic Validation**:

```bash
pnpm --filter @oaknational/practice-graph test
pnpm --filter @oaknational/agent-tools test
pnpm --filter @oaknational/agent-tools test:e2e
```

**Task Complete When**: the pilot corpus, workspace split, and command surface
are fixed enough that implementation cannot drift into larger scope silently.

---

### Phase 1 (GREEN): Build the Graph Workspaces

#### Task 1.1: Create `packages/libs/practice-graph/`

**Goal**: scaffold the required library workspace with repo-standard tooling.

**Acceptance Criteria**:

1. `packages/libs/practice-graph/` exists with:
   - `package.json`
   - `README.md`
   - `esbuild.config.ts`
   - `tsconfig.json`
   - `tsconfig.build.json`
   - `vitest.config.ts`
2. The workspace builds with esbuild and emits type declarations.
3. The workspace contains no CLI or stdio server code.

#### Task 1.2: Create `packages/core/graph-core/` only if the gate passed

**Acceptance Criteria**:

1. If created, the workspace contains only graph-mechanism concerns.
2. If created, it is TypeScript only and uses esbuild for `build`.
3. If created, it has no markdown/frontmatter/filesystem dependencies.
4. If not created, the no-extraction rationale is written explicitly.

#### Task 1.3: Implement deterministic extraction and cache behaviour

**Goal**: produce the explicit-edge graph without semantic inference.

**Acceptance Criteria**:

1. Every emitted edge is labelled as `EXTRACTED`.
2. Only the in-scope edge kinds are emitted.
3. Body-derived extraction cache entries may ignore frontmatter-only changes.
4. Frontmatter-derived metadata and report invalidation remain sensitive to
   frontmatter changes.
5. Graph output writes only to `.agent/local/practice-graph/`.
6. No writes occur to `.agent/memory/`, `.agent/reference/`, or plan/docs
   surfaces.

**Deterministic Validation**:

```bash
pnpm --filter @oaknational/practice-graph build
pnpm --filter @oaknational/practice-graph test
```

**Task Complete When**: the graph can be built deterministically from the
curated corpus and the workspace split remains within scope.

---

### Phase 2 (GREEN): Ship the Navigation Surfaces

#### Task 2.1: Generate local outputs

**Goal**: make the graph useful without requiring source reading first.

**Acceptance Criteria**:

1. `graph.json` is generated under `.agent/local/practice-graph/`.
2. `GRAPH_REPORT.md` is generated under `.agent/local/practice-graph/`.
3. `GRAPH_REPORT.md` includes at minimum:
   - corpus summary
   - central documents
   - bridge documents
   - weakly integrated/orphan documents
   - suggested starting points
   - at least three example paths

#### Task 2.2: Extend `agent-tools` with graph commands

**Goal**: expose the graph through the repo's existing internal-tool surface.

**Acceptance Criteria**:

1. `agent-tools` exposes `practice-graph build`, `report`, `query`, and
   `path`.
2. The root workspace exposes a discoverable wrapper command:
   `pnpm agent-tools:practice-graph`.
3. The adapter layer in `agent-tools` stays thin and delegates to
   `practice-graph`.
4. Out-of-process E2E coverage exists for `practice-graph build`, `report`,
   `query`, and `path` through the `agent-tools` command surface.
5. Query and path results are deterministic on fixture corpus and checked-in
   live pilot manifest.

**Deterministic Validation**:

```bash
pnpm --filter @oaknational/agent-tools test
pnpm --filter @oaknational/agent-tools test:e2e
pnpm agent-tools:practice-graph build
pnpm agent-tools:practice-graph report
pnpm agent-tools:practice-graph path --from "README.md" --to ".agent/practice-core/practice.md"
```

**Task Complete When**: a contributor or agent can build the graph, read the
report, run a direct query, and request a path without touching raw source
files first.

---

### Phase 3 (REFACTOR): Documentation, Acknowledgement, and Discoverability

#### Task 3.1: Add workspace READMEs and operational guidance

**Acceptance Criteria**:

1. Every new workspace has a README.
2. The README states:
   - advisory/non-canonical status
   - output location
   - command surface
   - acknowledgement to Graphify
3. The `agent-tools` README documents the new command surface.

#### Task 3.2: Propagate architecture and practice documentation

**Acceptance Criteria**:

1. `docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
   is either updated or receives a no-change rationale.
2. `.agent/practice-core/practice.md` is either updated or receives a
   no-change rationale.
3. If the landing introduces a durable new architecture boundary that would be
   surprising without an ADR, a dedicated ADR is authored; otherwise an
   explicit ADR no-change rationale is recorded.

#### Task 3.3: Record what is deliberately deferred

**Acceptance Criteria**:

1. No dedicated internal MCP/service workspace is silently created.
2. No HTML/wiki/visual layer is added without a follow-on plan.
3. No semantic inference or write-back loop is introduced.

**Deterministic Validation**:

```bash
pnpm markdownlint:root
```

**Task Complete When**: the pilot is understandable, attributable, and
discoverable without confusing the graph with canonical memory.

---

## Quality Gates

> See [Quality Gates component](../../templates/components/quality-gates.md)

After each task:

```bash
pnpm type-check
pnpm lint
pnpm test
```

After each phase:

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

This plan is not done while any gate is red, even if the graph-specific tests
pass.

---

## Risk Assessment

> See [Risk Assessment component](../../templates/components/risk-assessment.md)

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| The pilot expands into a platform/app build instead of a navigation layer | Medium | High | Hold the stop line; defer service/UI to a follow-on plan |
| A speculative `graph-core` split creates needless abstraction | Medium | Medium | Use the explicit extraction gate; collapse back if the seam is weak |
| Derived outputs are mistaken for authority | Medium | High | Keep outputs local, advisory, and out of canonical memory; document the boundary in every README |
| Cache complexity outweighs benefit | Low | Medium | Split cache responsibilities: body-only optimisation for link extraction, separate invalidation for frontmatter-derived metadata/report state |
| The curated corpus is too small or too biased to prove value | Medium | Medium | Use a mixed fixture and live corpus with Practice, ADR, onboarding, and operational surfaces |
| CLI layering leaks logic into `agent-tools` | Medium | Medium | Enforce thin-adapter rule; all graph logic lives in the library workspace(s) |

### System-Level Check

1. **Why are we doing this?**
   To make the repo's existing strategy/doctrine/operational structure
   traversable without inventing new canonical surfaces.
2. **Why does that matter?**
   Because the repo is already rich enough that discovery cost is a real
   systems problem.
3. **What if we do not?**
   Cross-document relationships remain implicit, expensive to recover, and easy
   to miss during onboarding and strategy work.

---

## Definition of Done

This pilot is done only when all of the following are true:

1. `packages/libs/practice-graph/` exists, is TypeScript-only, builds with
   esbuild, and has passing unit/integration tests.
2. `packages/core/graph-core/` either exists with a justified framework-only
   boundary, is TypeScript-only, uses esbuild, and has recorded rationale, or
   is explicitly not created with recorded rationale.
3. `agent-tools` exposes `practice-graph build`, `report`, `query`, and
   `path`, and the root workspace exposes `pnpm agent-tools:practice-graph`.
4. `.agent/local/practice-graph/graph.json` and `GRAPH_REPORT.md` are produced
   deterministically from the checked-in live pilot manifest.
5. The report can answer the four measurable pilot questions materially better
   than raw search alone.
6. Out-of-process `agent-tools` E2E coverage exists for argument parsing, exit
   codes, and stdout/stderr contract.
7. No semantic inference, no write-back loop, no public MCP integration, and
   no dedicated service workspace were introduced.
8. Documentation propagation and acknowledgement are complete.
9. All quality gates pass.

---

## Foundation Alignment

> See [Foundation Alignment component](../../templates/components/foundation-alignment.md)

Per-phase emphasis for this pilot:

1. **Could it be simpler without compromising quality?**
   If the answer is "yes", collapse back to fewer workspaces and fewer output
   surfaces.
2. **Separate framework from consumer only when the seam is real.**
   Do not create `graph-core` for aesthetic symmetry.
3. **TDD at all levels.**
   Unit tests for graph mechanics, integration tests for extraction/build, E2E
   tests for CLI command behaviour.
4. **No compatibility layers.**
   The graph is a new internal layer, not a wrapper over existing search tools.

---

## Documentation Propagation

> See [Documentation Propagation component](../../templates/components/documentation-propagation.md)

Required handling before close:

1. `docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
2. `.agent/practice-core/practice.md`
3. `agent-tools/README.md`
4. Any new workspace README files
5. Any ADR added (or explicit no-change rationale if none is needed)

Collection discoverability updates must also be handled:

- `README.md`
- `current/README.md`
- `roadmap.md`

---

## Consolidation

After all work is complete and quality gates pass, run
`/jc-consolidate-docs` to:

1. extract any settled graph-boundary or acknowledgement learnings,
2. decide whether the pilot produced a reusable pattern,
3. ensure no derived-output guidance is stranded in the plan.

---

## Dependencies

**Blocking**:

- [graphify-and-graph-memory-exploration.plan.md](../future/graphify-and-graph-memory-exploration.plan.md)
  — strategic parent and acknowledgement boundary

**Related Plans**:

- [learning-loop-negative-feedback-tightening.plan.md](learning-loop-negative-feedback-tightening.plan.md)
  — adjacent balancing-loop tightening for the memory system
- [onboarding-simulations-public-alpha-readiness.md](../../developer-experience/active/onboarding-simulations-public-alpha-readiness.md)
  — onboarding surface included in the pilot corpus
