---
name: "Oak KG Threads MCP Surface (Slice 2 of MVP arc)"
overview: "Author the executable plan for the slice-2 MCP surface: `curriculum://oak-kg-threads` resource + `oak-kg-get-thread-content` tool, both backed by the `graph-corpus-sdk` Oak Curriculum Ontology adapter. Substance is inherited from the MVP-arc spine; this plan adds TDD cycle structure, file scopes, and reviewer dispatch."
plan_id: oak-kg-threads-surface
type: feature-workstream
status: current
graph_layer: oak-graph-surface
spine_plan: ".agent/plans/graph-mvp-arc.plan.md"
spine_slice: 2
namespace: "oak-kg-*"
substrate_floor:
  - "graph-stack Inc.1 (Oak Curriculum Ontology Threads foundation: generic Turtle/SKOS ingestion, graph-project adjacency, graph-corpus-sdk curric:Thread adapter)"
sequencing_gate: "PARALLEL-SAFE with slice 3a (gate-3a) and slice 1's gates (gate-1a + gate-1b) after graph-stack Inc.1b lands. Per the 2026-05-21 gate-split amendment: gate-2 (Threads slice) does not depend on the slice-1 EEF gates because the Threads adapter does not consume the GraphView<TNode, TEdgeType> interface (different adapter shape: ontology-IRI enumeration + inverse-edge resolution); substrate-floor for gate-2 is Inc.1b alone, not the broader MVP-arc gate-0a/gate-0b path."
last_updated: 2026-05-11
related_indices:
  - ".agent/plans/graph-portfolio-index.md"
  - ".agent/plans/connecting-oak-resources/knowledge-graph-integration/README.md"
adr_amendments_required:
  - "ADR-123: record `curriculum://oak-kg-threads` resource + `oak-kg-get-thread-content` tool"
specialist_reviewers:
  - mcp-expert
  - test-expert
  - type-expert
  - code-expert
foundation_alignment:
  - .agent/directives/principles.md
  - .agent/directives/testing-strategy.md
  - .agent/directives/schema-first-execution.md
isProject: false
todos:
  - id: ws1-cycle-1-resource-stub
    content: "WS1 cycle 1: `oak-kg-threads-resource.integration.test.ts` (RED) asserts the resource lists every `curric:Thread` instance from the ontology with `rdfs:label`; `oak-kg-threads-resource.ts` (GREEN) implements via `graph-corpus-sdk` Oak Curriculum Ontology adapter. One commit. Tree green."
    status: pending
    depends_on: []
  - id: ws1-cycle-2-resource-grouping
    content: "WS1 cycle 2: extend the resource test to assert grouping/sorting (subject + KS) for each Thread row; extend product code minimally. One commit."
    status: pending
    depends_on: [ws1-cycle-1-resource-stub]
  - id: ws2-cycle-1-tool-inverse-edge
    content: "WS2 cycle 1: `oak-kg-get-thread-content.integration.test.ts` (RED) — call with a Thread IRI, assert returned Units contain inverse-edge (`curric:includesThread`) results with `rdfs:label`, `rdfs:comment`, `curric:whyThisWhyNow`; `oak-kg-get-thread-content.ts` (GREEN) implements via the graph-corpus-sdk Thread adapter over graph-project adjacency. One commit."
    status: pending
    depends_on: [ws1-cycle-1-resource-stub]
  - id: ws2-cycle-2-tool-grouping
    content: "WS2 cycle 2: extend tool test to assert grouping by subject + key-stage; extend product code. One commit."
    status: pending
    depends_on: [ws2-cycle-1-tool-inverse-edge]
  - id: ws2-cycle-3-tool-error-shapes
    content: "WS2 cycle 3: error-path tests (unknown Thread IRI; malformed IRI; ontology missing `curric:Thread` instance); error responses follow the SDK's classify-error-response convention. One commit."
    status: pending
    depends_on: [ws2-cycle-1-tool-inverse-edge]
  - id: ws3-cycle-1-mcp-wiring
    content: "WS3 cycle 1: integration test (`oak-kg-threads-mcp.integration.test.ts`) wires the resource + tool through the current in-process MCP registration surfaces (`AGGREGATED_TOOL_DEFS` + `AGGREGATED_HANDLERS` + `registerAllResources`); assert registry/resource discoverability + executor invocation. Transport-level list/read/invoke coverage, if needed, belongs in an e2e test. One commit; tests + wiring together."
    status: pending
    depends_on: [ws1-cycle-2-resource-grouping, ws2-cycle-2-tool-grouping, ws2-cycle-3-tool-error-shapes]
  - id: ws3-cycle-2-tool-descriptors
    content: "WS3 cycle 2: tool/resource descriptor + NL guidance + tool examples land in the SDK's tool-guidance surface. One commit; descriptor tests update accordingly."
    status: pending
    depends_on: [ws3-cycle-1-mcp-wiring]
  - id: ws4-adr-123-update
    content: "WS4: update `docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md` to record `curriculum://oak-kg-threads` + `oak-kg-get-thread-content` per the namespace conventions in ADR-157; recalculate primitive counts and include structured output, annotations, `_meta`, and resource metadata expectations."
    status: pending
    depends_on: [ws3-cycle-2-tool-descriptors]
  - id: ws5-quality-gates
    content: "WS5: full quality-gate chain on the integrated delivery (`pnpm clean && pnpm sdk-codegen && pnpm build && pnpm type-check && pnpm format:root && pnpm markdownlint:root && pnpm lint:fix && pnpm test && pnpm test:ui && pnpm test:e2e`)."
    status: pending
    depends_on: [ws4-adr-123-update]
  - id: ws6-adversarial-review
    content: "WS6: dispatch `mcp-expert` (MCP spec + tool shape + namespace conformance) + `test-expert` (TDD pair audit, no audit-shaped tests, no skipped tests) + `code-expert` (gateway). Document findings; remediate or queue."
    status: pending
    depends_on: [ws5-quality-gates]
  - id: ws7-spine-gate-2-close
    content: "WS7: update spine `gate-2-threads-ships` todo to `completed`; record acceptance evidence (including the shape-understanding paragraph required by the MVP-arc gate-2 acceptance criterion); refresh thread next-session record. This does not gate the combinatorial-arc cross-corpus tool, which composes EEF and misconceptions only."
    status: pending
    depends_on: [ws6-adversarial-review]
---

# Oak KG Threads MCP Surface — Slice 2 of the MVP Arc

**Last Updated**: 2026-05-21 (substrate-floor + parallel-safety wording aligned with the gate-split amendment; previous: 2026-05-10).
**Status**: 🟡 PLANNING (current/) — pending substrate floor (graph-stack
Inc.1b Oak Curriculum Ontology Threads adapter). Per the 2026-05-21 gate-split amendment, gate-2 (this slice) is parallel-safe with gate-1a/gate-1b (slice 1 EEF) and gate-3a (slice 3a misconception) — it does not depend on the slice-1 EEF gates.
**Scope**: Slice 2 of the
[`graph-mvp-arc.plan.md`](../../../graph-mvp-arc.plan.md) — author and
ship the `curriculum://oak-kg-threads` resource + `oak-kg-get-thread-content`
tool via the `graph-corpus-sdk` Oak Curriculum Ontology adapter, with
inverse-edge query primitive verified end-to-end.

## Context

The MVP-arc spine commits this slice as the second vertical delivery
through the graph stack. The spine carries the substance — what ships,
why Threads is the right slice 2, the substrate floor, the acceptance
criteria, the namespace decision. This plan adds the *executable shape*
under the
[`feature-workstream-template`](../../../templates/feature-workstream-template.md):
TDD cycles with file scopes, dispatch-ready briefs, and reviewer
scheduling.

### What ships (locked from spine)

| Primitive | Name | Substrate path |
|---|---|---|
| Resource | `curriculum://oak-kg-threads` | `graph-corpus-sdk` Oak Curriculum Ontology adapter |
| Tool | `oak-kg-get-thread-content` | inverse-edge query via `graph-corpus-sdk` Thread adapter over `graph-project` adjacency |

Tool/resource names are **locked** by the spine — they're named in
the MVP-arc spine and any rename requires a spine amendment, not just
this plan. Note: the combinatorial-arc cross-corpus tool (formerly MVP
slice 3b, now in
[`graph-combinatorial-arc.plan.md`](../../../graph-combinatorial-arc.plan.md))
does **not** consume this slice's tool at runtime (see "Consumed by"
below); the lock is a spine-naming discipline, not a downstream-composition
dependency.

### Existing capabilities consumed

- Graph-stack Inc.1 Oak Curriculum Ontology Threads foundation (see
  [`graph-stack.plan.md`](graph-stack.plan.md)); slice 2 starts only after
  that increment lands the `graph-corpus-sdk` API for `curric:Thread`
  enumeration and inverse `curric:includesThread` resolution over
  `graph-project` adjacency.
- The existing MCP server wiring in
  `apps/oak-curriculum-mcp-streamable-http`
- The SDK's tool-guidance surface
  (`packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-*.ts`)
- Current MCP registration surfaces:
  `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/types.ts`
  (`AggregatedToolName`),
  `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts`
  (`AGGREGATED_TOOL_DEFS`),
  `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/executor.ts`
  (`AGGREGATED_HANDLERS`),
  `packages/sdks/oak-curriculum-sdk/src/public/mcp-tools.ts` (public
  exports), and
  `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts`
  (`registerAllResources`). `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts`
  lists universal tools automatically via `listUniversalTools`.
- The SDK's `classify-error-response` convention
  (`packages/sdks/oak-curriculum-sdk/src/mcp/classify-error-response.ts`)

## Design Principles

1. **Spine-locked names** — `curriculum://oak-kg-threads` and
   `oak-kg-get-thread-content` are named in the spine. This plan does not
   rename. Slice 3b does not consume these tools at runtime.
2. **Substrate-only via adapter** — no direct ontology I/O from the
   resource or tool; everything routes through `graph-corpus-sdk` so the
   substrate-vs-surface boundary holds (per ADR-173 / ADR-154).
3. **Inverse-edge primitive in `graph-corpus-sdk`/`graph-project`** — Thread
   is a forward edge from Unit (`curric:includesThread`); this slice
   exercises the inverse-edge primitive end-to-end and confirms it earns its
   keep.
4. **Bounded responses** — `threads.ttl` is small; per-Thread Unit lists
   are bounded; no context-budget concerns. Responses do not need
   pagination at this scale.
5. **TDD pairs** — every cycle is one commit with the failing test + the
   product code that makes it pass + any refactor. No test-only commits;
   no product-only commits (per `.agent/directives/testing-strategy.md`).

**Non-Goals** (YAGNI):

- Lesson-graph projection (cut-scope; new plan
  `oak-kg-lesson-graph-surface.plan.md` queued)
- Programme/Unit navigator (cut-scope; new plan queued)
- Generic IRI traverser (cut-scope; new plan queued)
- Schema/class browser (cut-scope; new plan queued)
- SPARQL endpoint
  ([`direct-ontology-use-and-graph-serving-prototypes.plan.md`](../future/direct-ontology-use-and-graph-serving-prototypes.plan.md);
  not part of MVP arc)
- Forward-edge enrichment from Thread to Unit (Unit→Thread is the
  forward edge in the ontology; this slice surfaces the inverse on
  purpose)

## Acceptance Criteria (inherited from spine §"Acceptance — Slice 2")

1. All `curric:Thread` instances enumerable from
   `oak-curriculum-ontology/data/threads.ttl` via the resource.
2. For each Thread, `oak-kg-get-thread-content` returns the full set of
   Units with `curric:includesThread` to it, grouped by subject + KS,
   with `rdfs:label`, `rdfs:comment`, and `curric:whyThisWhyNow`.
3. Inverse-edge query primitive in `graph-corpus-sdk`/`graph-project`
   verified (Thread is a forward edge from Unit; resolution requires
   inverse lookup).
4. ADR-123 records the new primitives.
5. Specialist review by `mcp-expert` (mid-cycle and at WS6 close).

## Workstreams

### WS1 — Resource (`curriculum://oak-kg-threads`)

Two TDD cycles. The resource implementation lives in
`packages/sdks/oak-curriculum-sdk/src/mcp/oak-kg-threads-resource.ts`
following the convention set by the existing `*-resource.ts` files
(`misconception-graph-resource.ts`, `thread-progressions-resource.ts`,
`prior-knowledge-graph-resource.ts`,
`curriculum-model-resource.ts`).

#### Cycle 1.1 — list every Thread with label

- **Test** (Red): `oak-kg-threads-resource.integration.test.ts` — use an
  imported/literal fixture ontology with N known Threads; assert resource
  returns exactly N entries, each with IRI + `rdfs:label`. Auditing the real
  pinned ontology revision belongs in a standalone validator, not this
  in-process test.
- **Product code** (Green): minimal adapter call surface; no grouping
  yet.
- **Acceptance**: test passes; full tree green.

#### Cycle 1.2 — group/sort by subject + KS

- **Test**: extend assertions to require subject + key-stage grouping
  (or a stable sort that the consumer can group on).
- **Product code**: extend the resource projection accordingly.
- **Acceptance**: extended test passes; cycle 1.1 still passes.

### WS2 — Tool (`oak-kg-get-thread-content`)

Three TDD cycles. The tool lives at
`packages/sdks/oak-curriculum-sdk/src/mcp/oak-kg-get-thread-content.ts`
with descriptor/schema exports wired into the universal-tool registry
(`AggregatedToolName`, `AGGREGATED_TOOL_DEFS`, and `AGGREGATED_HANDLERS`).
If the implementation uses an `aggregated-oak-kg-threads/` subdirectory,
its `tool-definition.ts` follows the existing `aggregated-*` convention;
the central registry surfaces remain the source of truth.

#### Cycle 2.1 — inverse-edge happy path

- **Test**: Thread IRI → tool returns the set of Units with
  `curric:includesThread` edge to it; Unit projections include
  `rdfs:label`, `rdfs:comment`, `curric:whyThisWhyNow`.
- **Product code**: invoke the inverse-edge primitive through the
  `graph-corpus-sdk` Thread adapter over `graph-project` adjacency; project
  Units to the documented shape.
- **Acceptance**: test passes; full tree green.

MCP envelope acceptance: tool calls return a `CallToolResult` with `content`
containing a short summary plus serialized JSON, `structuredContent` containing
the Thread/Unit payload, a declared `outputSchema`, and `isError: true` on tool
execution errors.

#### Cycle 2.2 — grouping by subject + key-stage

- **Test**: extend assertions for grouping shape.
- **Product code**: extend projection.
- **Acceptance**: cycle 2.1 still passes.

#### Cycle 2.3 — error paths

- **Tests**: unknown IRI → 404-shaped error; malformed IRI → validation
  error; ontology missing `curric:Thread` for the supplied IRI →
  classified error.
- **Product code**: route errors through the SDK's
  `classify-error-response` so MCP surface error contracts hold.
- **Acceptance**: error-path tests pass; happy-path tests still pass.

### WS3 — MCP wiring + descriptor

Two cycles bringing the resource + tool through the in-process MCP registry
composition and into the SDK's tool-guidance / NL surface.

#### Cycle 3.1 — MCP integration test

- **Test**: `oak-kg-threads-mcp.integration.test.ts` exercises in-process
  registry composition (`AGGREGATED_TOOL_DEFS`, `AGGREGATED_HANDLERS`,
  `registerAllResources`) and executor invocation. A transport-level MCP
  list/read/invoke proof uses an e2e test file if execution needs it.
- **Product code**: add the tool to the SDK universal registry
  (`AggregatedToolName`, `AGGREGATED_TOOL_DEFS`, `AGGREGATED_HANDLERS`) and
  export it through `public/mcp-tools.ts`; add the resource constant/getter
  to `public/mcp-tools.ts` and `registerAllResources`. `handlers.ts`
  registers tools by iterating `listUniversalTools`, so no separate
  per-tool app handler is expected.
- **Acceptance**: integration test passes; unit tests still pass.

#### Cycle 3.2 — descriptor + NL guidance

- **Test/code**: tool descriptor and NL guidance land in the SDK's
  `tool-guidance-*.ts` surface; descriptor tests update accordingly.

### WS4 — ADR-123 update

Update `docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md`
to record the new primitives, recalculate primitive counts, and capture
resource/tool metadata expectations (`annotations`, `_meta`, `outputSchema`,
structured content, and resource metadata). Single commit, doc-only.

### WS5 — Quality gates

```bash
pnpm clean && pnpm sdk-codegen && pnpm build && pnpm type-check && \
pnpm format:root && pnpm markdownlint:root && pnpm lint:fix && \
pnpm test && pnpm test:ui && pnpm test:e2e
```

### WS6 — Adversarial review

Dispatch:

- `mcp-expert` — MCP spec + tool/resource shape + namespace
  conformance + descriptor + NL guidance quality
- `test-expert` — TDD pair audit; no audit-shaped tests; no skipped
  tests
- `code-expert` — gateway; routes to additional specialists if
  warranted

### WS7 — Spine gate-2 close

Update spine
[`graph-mvp-arc.plan.md`](../../../graph-mvp-arc.plan.md)
`gate-2-threads-ships` todo to `completed`; record acceptance evidence
(including the shape-understanding paragraph required by the MVP-arc
gate-2 acceptance criterion); refresh
[`connecting-oak-resources.next-session.md`](../../../../memory/operational/threads/connecting-oak-resources.next-session.md).
This does not gate the combinatorial-arc cross-corpus tool, which
composes EEF and misconceptions only.

## Risks

| Risk | Mitigation |
|---|---|
| `graph-corpus-sdk` Oak Curriculum Ontology adapter API drifts before slice-2 execution | Plan locks against named substrate primitives, not signatures; cycles re-validate when substrate lands. |
| Inverse-edge primitive in `graph-corpus-sdk`/`graph-project` ships in a shape that surprises the tool projection | Cycle 2.1 is a contract test — any drift surfaces immediately, before grouping/error cycles consume the contract. |
| `threads.ttl` shape evolves in `oak-curriculum-ontology` between plan-write and execution | Fixture-based unit tests pin the expected shape; any drift surfaces at execution time. |
| MCP descriptor / NL guidance regression breaks downstream agent comprehension | Descriptor tests + `mcp-expert` gate at WS6. |

## Foundation Alignment

- [`principles.md`](../../../../directives/principles.md) — replace-don't-bridge,
  read-before-asking, "could it be simpler".
- [`testing-strategy.md`](../../../../directives/testing-strategy.md) — TDD pairs,
  no audit-shaped tests, no skipped tests.
- ADR-117 (plan templates).
- ADR-123 (MCP primitive naming) — updated by WS4.
- ADR-154 (framework / consumer separation) — surface lives in the SDK,
  substrate lives in `graph-corpus-sdk`.
- ADR-157 (multi-source integration) — `oak-kg-*` namespace.
- ADR-173 (graph stack topology, Proposed) — substrate path.

## Dependencies

**Blocking**:

- Graph-stack Inc.1b (Oak Curriculum Ontology Threads adapter inside
  `graph-corpus-sdk`) — Threads substrate floor; the Threads adapter
  does not consume the GraphView<TNode, TEdgeType> interface from
  Inc.1d, so gate-2 does not depend on the slice-1 EEF substrate floor.
  Per 2026-05-21 gate-split amendment: gate-0a/gate-0b are slice-1
  specific and are not preconditions for this slice.

**Parallel-safe with**:

- [`oak-misconceptions-subgraph-mcp-surface.plan.md`](oak-misconceptions-subgraph-mcp-surface.plan.md)
  (slice 3a, gate-3a) — different substrate path, different namespace, different
  files. Both wait on graph-stack Inc.1b only.
- Slice 1 EEF gates (gate-1a + gate-1b) — per the 2026-05-21
  amendment, slice 2 (gate-2) does not depend on the EEF slice gates,
  and the EEF slice gates do not depend on Inc.1b. The substrate streams
  are co-primary.

**Consumed by**:

- [`../future/oak-misconceptions-eef-cross-corpus-surface.plan.md`](../future/oak-misconceptions-eef-cross-corpus-surface.plan.md)
  (formerly MVP slice 3b, now first concrete combinatorial-arc
  exploration) **does not** consume this slice's tool. The cross-corpus
  tool composes EEF (slice 1) + misconceptions (slice 3a) through
  `graph-corpus-sdk` directly; the Oak Threads surface is not part of
  that composition.

**Related plans**:

- [`graph-mvp-arc.plan.md`](../../../graph-mvp-arc.plan.md) — coordination
  spine.
- [`graph-stack.plan.md`](graph-stack.plan.md) — substrate plan.
- [`graph-query-layer.plan.md`](graph-query-layer.plan.md) — related query
  substrate, but not a slice-2 gate.

## Consolidation

After WS7 closes, run `/jc-consolidate-docs` per the spine's
`learning-loop` todo. Surface graduation candidates from the
inverse-edge query pattern, the `graph-corpus-sdk` Oak adapter shape,
and the spine-locked-name discipline.
