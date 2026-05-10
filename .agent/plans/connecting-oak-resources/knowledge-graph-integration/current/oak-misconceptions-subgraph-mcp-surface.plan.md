---
name: "Oak Misconceptions Sub-Graph MCP Surface (Slice 3a of MVP arc)"
overview: "Author the executable plan for the slice-3a MCP surface: `oak-misconceptions-subgraph-for-thread` (and optional `-for-unit`) tool(s) on the legacy misconception graph factory plus graph-stack Inc.1 Thread-to-Unit lookup. Bounded sub-graph extraction is the blocking primitive the misconception graph needs to fit `maxResponseTokens = 16000`. Substance inherited from the MVP-arc spine; this plan adds TDD cycle structure, file scopes, and reviewer dispatch."
plan_id: oak-misconceptions-subgraph-mcp-surface
type: feature-workstream
status: current
graph_layer: oak-graph-surface
spine_plan: ".agent/plans/graph-mvp-arc.plan.md"
spine_slice: 3a
namespace: "oak-misconceptions-*"
substrate_path: "legacy misconception graph factory (interim) + graph-stack Inc.1 Thread-to-Unit lookup"
substrate_floor:
  - "legacy graph factory (already shipped; see existing `misconception-graph-resource.ts` + `aggregated-misconception-graph.ts`)"
  - "graph-stack Inc.1 Oak Ontology Threads foundation (Thread IRI -> Unit lookup)"
  - "ADR-157 amendment for `oak-misconceptions-*` prefix (landed Phase 0 of MVP-arc spine)"
sequencing_gate: "STRICT after gate-1-eef-ships + graph-stack Inc.1 (owner sequencing + Thread lookup); PARALLEL-SAFE with gate-2-threads-ships after those gates"
last_updated: 2026-05-10
related_indices:
  - ".agent/plans/graph-portfolio-index.md"
  - ".agent/plans/connecting-oak-resources/knowledge-graph-integration/README.md"
adr_amendments_required:
  - "ADR-123: record `oak-misconceptions-subgraph-for-thread` (and `-for-unit` if shipped), recalculate primitive counts, and capture `_meta` legacy-substrate disclosure as non-contractual metadata"
  - "ADR-157: confirm `oak-misconceptions-*` prefix is recorded (already amended Phase 0 of MVP-arc spine)"
specialist_reviewers:
  - mcp-reviewer
  - test-reviewer
  - type-reviewer
  - code-reviewer
  - architecture-reviewer-betty
foundation_alignment:
  - .agent/directives/principles.md
  - .agent/directives/testing-strategy.md
  - .agent/directives/schema-first-execution.md
isProject: false
todos:
  - id: ws1-cycle-1-bounded-extraction-thread
    content: "WS1 cycle 1: `oak-misconceptions-subgraph-for-thread.integration.test.ts` (RED) — Thread IRI + bound parameter → bounded sub-graph of misconceptions associated with units in that thread, sized to fit `maxResponseTokens = 16000`; `oak-misconceptions-subgraph-for-thread.ts` (GREEN) resolves Thread->Units via graph-stack Inc.1 and traverses misconceptions via the legacy graph factory. One commit. Tree green."
    status: pending
    depends_on: []
  - id: ws1-cycle-2-bound-default
    content: "WS1 cycle 2: extend test to assert the default bound keeps every context in the committed `20`-context fixture manifest within `maxResponseTokens = 16000`, including model-visible serialized content; product-code adjustment minimal. One commit."
    status: pending
    depends_on: [ws1-cycle-1-bounded-extraction-thread]
  - id: ws1-cycle-3-completeness-control
    content: "WS1 cycle 3: bounded-traversal behaviour tests over small literal graph fixtures — include high/median/low/zero density shapes without implementing a second full traversal in the test. Integration keeps using the committed 20-context manifest for response-budget proof. One commit."
    status: pending
    depends_on: [ws1-cycle-1-bounded-extraction-thread]
  - id: ws1-cycle-4-error-shapes
    content: "WS1 cycle 4: error paths (unknown Thread IRI; malformed IRI; bound parameter out of range; thread with no associated units). One commit."
    status: pending
    depends_on: [ws1-cycle-1-bounded-extraction-thread]
  - id: ws2-cycle-1-for-unit-optional
    content: "WS2 cycle 1 (OPTIONAL — gate at owner direction or T0 owner check): `oak-misconceptions-subgraph-for-unit.integration.test.ts` (RED) + `oak-misconceptions-subgraph-for-unit.ts` (GREEN) ship the per-unit variant on the same legacy substrate. One commit. Skip the WS if owner direction at slice-3a opening confirms thread-only suffices."
    status: pending
    depends_on: [ws1-cycle-3-completeness-control]
  - id: ws3-cycle-1-mcp-wiring
    content: "WS3 cycle 1: integration test wires the tool(s) through the current in-process MCP registration surfaces (`AGGREGATED_TOOL_DEFS` + `AGGREGATED_HANDLERS`; `handlers.ts` lists universal tools automatically); assert registry discoverability + executor invocation. Transport-level list/invoke coverage, if needed, belongs in an e2e test. One commit; tests + wiring together."
    status: pending
    depends_on: [ws1-cycle-3-completeness-control, ws1-cycle-4-error-shapes]
  - id: ws3-cycle-2-tool-meta-legacy-disclosure
    content: "WS3 cycle 2: tool `_meta` declares the legacy-factory interim path explicitly (per spine acceptance #3). Descriptor + NL guidance land. Tests assert `_meta` field presence and content. One commit."
    status: pending
    depends_on: [ws3-cycle-1-mcp-wiring]
  - id: ws4-adr-123-and-157-update
    content: "WS4: update `docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md` to record the new tool(s); confirm ADR-157 already records `oak-misconceptions-*` prefix (Phase 0 amendment); add cross-reference if needed."
    status: pending
    depends_on: [ws3-cycle-2-tool-meta-legacy-disclosure]
  - id: ws5-quality-gates
    content: "WS5: full quality-gate chain on integrated delivery."
    status: pending
    depends_on: [ws4-adr-123-and-157-update]
  - id: ws6-adversarial-review
    content: "WS6: dispatch `mcp-reviewer` (MCP spec + tool shape + `_meta` legacy disclosure + namespace) + `test-reviewer` (TDD pair audit) + `architecture-reviewer-betty` (legacy-factory boundary — ensure the surface does not couple to legacy internals beyond the disclosed `_meta` path) + `code-reviewer` (gateway). Document findings; remediate or queue."
    status: pending
    depends_on: [ws5-quality-gates]
  - id: ws7-spine-gate-3a-close-and-migration-followup
    content: "WS7: update spine `gate-3a-mcg-subgraph-ships` todo to `completed`; record acceptance evidence; refresh thread next-session record; refresh/verify the existing named follow-up plan `oak-misconceptions-substrate-migration.plan.md` (future/) per spine cut-scope row 3a (migration onto graph-corpus-sdk + GraphView when graph-stack Inc.3 misconception adapter ships). Triggers gate-3b execution readiness check with gate-1 + Inc.3."
    status: pending
    depends_on: [ws6-adversarial-review]
---

# Oak Misconceptions Sub-Graph MCP Surface — Slice 3a of the MVP Arc

**Last Updated**: 2026-05-08
**Status**: 🟡 PLANNING (current/) — pending gate-1-eef-ships
(STRICT, owner sequencing). PARALLEL-SAFE with slice 2 — different
substrate path, different namespace, different files.
**Scope**: Slice 3a of the
[`graph-mvp-arc.plan.md`](../../../graph-mvp-arc.plan.md) — author and
ship `oak-misconceptions-subgraph-for-thread` (and optionally
`-for-unit`) on the **legacy graph factory** path. Bounded sub-graph
extraction is the blocking primitive the misconception graph needs to
fit `maxResponseTokens = 16000`.

## Context

Owner direction, 2026-05-07: *"slice 3 the misconception graph, but it
requires the ability to query sub-graphs as the misconception graph is
too large to use without using an impractical amount of context."* The
sub-graph query primitive is the BLOCKING problem to fix; cross-corpus
composition (slice 3b) is the user-value framing on top. This slice
solves the blocking problem on the substrate available **today**
(legacy graph factory), with the substrate-replatform follow-up
named explicitly.

### What ships (locked from spine)

| Primitive | Name | Substrate path |
|---|---|---|
| Tool | `oak-misconceptions-subgraph-for-thread` | legacy graph factory |
| Tool (optional) | `oak-misconceptions-subgraph-for-unit` | legacy graph factory |

The tools return **bounded** sub-graphs sized to fit
`maxResponseTokens = 16000`. Bound is a parameter; default chosen so
every response from the committed `20`-context fixture manifest fits that
budget. The budget is measured by a shared response-budget helper against the
serialized model-visible `content` text payload, including citations, caveats,
and duplicated JSON required for MCP compatibility.

Fixture manifest path:
`packages/sdks/oak-curriculum-sdk/src/mcp/oak-misconceptions-subgraph-for-thread.fixture-manifest.ts`.
The manifest schema is
`readonly { iri: string; reachableMisconceptionCount: number; bucket:
"zero" | "low" | "median" | "high" }[]`.
Selection rule: compute reachable-misconception counts for all eligible Thread
IRIs, sort by count descending with IRI lexical tie-break, then commit exactly
5 high, 5 median-nearest, 5 low-nonzero, and 5 zero-count contexts. If a bucket
has fewer than 5 candidates, fill from the adjacent bucket by the same ordering
and record the fill in the manifest comment.

### Existing capabilities consumed

- The legacy misconception graph factory currently surfaced by
  `packages/sdks/oak-curriculum-sdk/src/mcp/misconception-graph-resource.ts`
  and `aggregated-misconception-graph.ts`
- Graph-stack Inc.1 Oak Ontology Threads foundation for resolving the input
  Thread IRI to Units before misconception traversal.
- The SDK's `classify-error-response` convention
- The SDK's tool-guidance surface
- Current MCP registration surfaces:
  `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/types.ts`
  (`AggregatedToolName`),
  `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts`
  (`AGGREGATED_TOOL_DEFS`),
  `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/executor.ts`
  (`AGGREGATED_HANDLERS`), and
  `packages/sdks/oak-curriculum-sdk/src/public/mcp-tools.ts` (public
  exports). `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts`
  lists universal tools automatically via `listUniversalTools`.

### Why legacy substrate now (not later)

Spine cut-scope row 3a names the substrate-replatform plan
(`oak-misconceptions-substrate-migration.plan.md`) as a follow-up
gated on graph-stack Inc.3 misconception adapter shipping. Shipping
slice 3a now on legacy substrate unblocks the user-facing problem
*today* and writes the contract the substrate must preserve when it
replatforms — every consumer can see the legacy path is named, the
contract is named, and the migration is sequenced.

## Design Principles

1. **Spine-locked names** — `oak-misconceptions-subgraph-for-thread`
   is named in the MVP-arc spine. Renaming requires a spine amendment,
   not just this plan. Note: slice 3b does NOT call this tool at
   runtime — slice 3b reaches misconception data through
   `graph-corpus-sdk` directly (per slice 3b Design Principle 1) once
   graph-stack Inc.3 has replatformed the misconception substrate.
   Slice 3a's contribution to slice 3b is the bounded-sub-graph SHAPE,
   not a runtime MCP composition.
2. **Bounded by parameter, defaulted by data** — the bound is exposed
   to callers; the default is chosen empirically so every committed manifest
   response fits `maxResponseTokens = 16000`.
3. **Legacy disclosed in `_meta`** — every consumer of the tool sees
   from `_meta` that the substrate is the legacy graph factory, with a
   pointer to the substrate-migration follow-up plan. This is the
   contract the substrate replatform must preserve.
4. **No new direct legacy-factory imports outside the tool file** —
   the tool isolates legacy coupling so the substrate-migration
   follow-up replaces a small surface, not a wide one.
5. **TDD pairs** — every cycle is one commit with the failing test +
   the product code that makes it pass.

**Non-Goals** (YAGNI):

- Substrate-based implementation (cut-scope; future plan
  `oak-misconceptions-substrate-migration.plan.md` named in spine).
- Per-IRI single-misconception lookup (already DONE in
  `misconception-graph-mcp-surface.plan.md`).
- Topic-string sub-graph without IRI (cut-scope; future plan
  `oak-misconceptions-topic-extraction.plan.md`).
- Cross-corpus composition with EEF (slice 3b
  [`oak-misconceptions-eef-cross-corpus-surface.plan.md`](oak-misconceptions-eef-cross-corpus-surface.plan.md)).

## Acceptance Criteria (inherited from spine §"Acceptance — Slice 3a")

1. Sub-graph extraction by Thread IRI context returns bounded results that fit
   `maxResponseTokens = 16000` across the committed `20`-context fixture
   manifest. Unit IRI context is accepted only if the optional unit variant is
   explicitly authorised at slice opening.
2. Sub-graph completeness verified versus full-graph control: for each
   sample query, all reachable misconceptions within the bound are
   present.
3. The legacy-factory interim path is explicit in the plan body, in
   tool `_meta`, and in ADR-123 — every consumer can see this is a
   contract the substrate must preserve.
4. ADR-157 records the new `oak-misconceptions-*` prefix (already
   landed Phase 0 of MVP-arc spine).

## Workstreams

### WS1 — `oak-misconceptions-subgraph-for-thread`

Four TDD cycles. Tool lives at
`packages/sdks/oak-curriculum-sdk/src/mcp/oak-misconceptions-subgraph-for-thread.ts`
with descriptor/schema exports wired into the universal-tool registry
(`AggregatedToolName`, `AGGREGATED_TOOL_DEFS`, and `AGGREGATED_HANDLERS`).
If the implementation uses an `aggregated-oak-misconceptions-subgraph/`
subdirectory, its `tool-definition.ts` follows the existing `aggregated-*`
convention; the central registry surfaces remain the source of truth.
Because these cycles exercise the legacy graph factory, the test file is
classified as `integration.test.ts` at implementation time.

#### Cycle 1.1 — bounded extraction happy path

- **Test**: Thread IRI + bound parameter → tool returns a sub-graph
  of misconceptions attached (transitively, within the bound) to units
  in that thread; sub-graph fits `maxResponseTokens = 16000` for the
  committed `20`-context fixture manifest.
- **Product code**: legacy graph factory traversal bounded by the
  parameter; project to MCP-friendly response shape.
- **Acceptance**: test passes; full tree green.

#### Cycle 1.2 — default bound

- **Test**: with no bound supplied, the default chosen makes every context
  in the committed `20`-context fixture manifest fit `maxResponseTokens =
  16000`, including model-visible serialized `content` text.
- **Product code**: default constant + comment naming the empirical
  basis. The fixture manifest is selected deterministically from
  reachable-misconception counts, covering high, median, low, and
  zero-count contexts.
- **Acceptance**: test passes; cycle 1.1 still passes.

MCP envelope acceptance: tool calls return a `CallToolResult` with `content`
containing a short summary plus serialized JSON, `structuredContent` containing
the bounded sub-graph payload, a declared `outputSchema`, and `isError: true`
on tool execution errors.

#### Cycle 1.3 — bounded traversal behaviour

- **Test**: small literal graph fixtures describe the expected bounded
  traversal behaviour directly, including high/median/low/zero density
  shapes. Do not implement a second full traversal in the test.
- **Product code**: any traversal fixes the behaviour tests expose.
- **Acceptance**: behaviour tests pass; cycles 1.1 + 1.2 still
  pass.

#### Cycle 1.4 — error paths

- **Tests**: unknown Thread IRI → 404-shape; malformed IRI →
  validation; bound out of range → validation; thread with no
  associated units → empty-but-well-formed response.
- **Product code**: route through `classify-error-response`.
- **Acceptance**: error-path tests pass.

### WS2 — `oak-misconceptions-subgraph-for-unit` (OPTIONAL)

One cycle, gated by an owner check at slice opening: ship the per-unit
variant on the same legacy substrate, OR skip and capture as a
post-arc follow-up. Default is **skip** — the per-thread tool covers
the slice-3b composition use case; per-unit is incremental value.

If shipped, mirrors WS1 cycles 1.1 + 1.4 over a Unit IRI surface.

### WS3 — MCP wiring + `_meta` legacy disclosure

#### Cycle 3.1 — MCP integration test

- **Test**: integration exercises in-process registry composition and the
  universal-tool executor; tool is discoverable and invocable through those
  surfaces. A transport-level MCP list/invoke proof uses an e2e test file if
  execution needs it.
- **Product code**: add the tool to the SDK universal registry
  (`AggregatedToolName`, `AGGREGATED_TOOL_DEFS`, `AGGREGATED_HANDLERS`) and
  export it through `public/mcp-tools.ts`. `handlers.ts` registers tools by
  iterating `listUniversalTools`, so no separate per-tool app handler is
  expected.

#### Cycle 3.2 — tool `_meta` declares legacy substrate

- **Test**: assertion that `_meta.substrate` (or equivalent field
  per the SDK convention) contains `"legacy-graph-factory"` AND a
  pointer to
  `oak-misconceptions-substrate-migration.plan.md` (future/) so
  consumers see the named migration path.
- **Product code**: descriptor + NL guidance changes; `_meta` field
  populated.
- **Acceptance**: tests pass; descriptor tests update.

### WS4 — ADR-123 + ADR-157 confirmation

- ADR-123: record the new tool(s), recalculate primitive counts, and capture
  `_meta` legacy-substrate disclosure as non-contractual metadata alongside
  structured output and annotation expectations.
- ADR-157: confirm `oak-misconceptions-*` row already present
  (Phase 0 amendment); add cross-reference if needed.

### WS5 — Quality gates

```bash
pnpm clean && pnpm sdk-codegen && pnpm build && pnpm type-check && \
pnpm format:root && pnpm markdownlint:root && pnpm lint:fix && \
pnpm test && pnpm test:ui && pnpm test:e2e
```

### WS6 — Adversarial review

Dispatch:

- `mcp-reviewer` — MCP spec, tool shape, `_meta` legacy disclosure,
  and namespace conformance
- `test-reviewer` — TDD pair audit; no audit-shaped tests; no skipped
  tests
- `architecture-reviewer-betty` — legacy-factory boundary; ensure the
  tool does not couple to legacy internals beyond the disclosed
  `_meta` path; the substrate-migration follow-up plan should replace
  a small surface, not a wide one
- `code-reviewer` — gateway

### WS7 — Spine gate-3a close + migration follow-up plan

1. Update spine
   [`graph-mvp-arc.plan.md`](../../../graph-mvp-arc.plan.md)
   `gate-3a-mcg-subgraph-ships` todo to `completed`; record evidence.
2. Refresh/verify the existing
   [`oak-misconceptions-substrate-migration.plan.md`](../future/oak-misconceptions-substrate-migration.plan.md)
   in `future/` per spine cut-scope row 3a.
3. Refresh
   [`connecting-oak-resources.next-session.md`](../../../../memory/operational/threads/connecting-oak-resources.next-session.md).

## Risks

| Risk | Mitigation |
|---|---|
| Empirical bound default poorly chosen; manifest coverage drifts as misconception data evolves | Cycle 1.2's default constant carries the empirical basis in a comment + committed `20`-context fixture manifest; substrate-migration plan re-validates the default. |
| Legacy graph factory has surprising completeness edges that the bounded traversal misses | Cycle 1.3's small literal graph behaviour tests describe the traversal contract without a second full traversal implementation in the test. |
| Tool `_meta` legacy disclosure omitted by reviewer or by drift, breaking the replatform contract | WS6 `mcp-reviewer` gate; substrate-migration plan re-validates `_meta` shape. |
| Slice 3b authoring (parallel) ends up coupled to a tool name we rename here | Tool name is locked from spine; renaming requires spine + slice-3b amendment. |

## Foundation Alignment

- [`principles.md`](../../../../directives/principles.md) — replace-don't-bridge,
  no-moving-targets, "could it be simpler".
- [`testing-strategy.md`](../../../../directives/testing-strategy.md) — TDD
  pairs, no audit-shaped tests, no skipped tests.
- ADR-117 (plan templates).
- ADR-123 (MCP primitive naming) — updated by WS4.
- ADR-157 (multi-source integration) — `oak-misconceptions-*` namespace
  already present.
- ADR-173 (graph stack topology, Proposed) — names the substrate
  workspaces; this slice intentionally uses Inc.1 for Thread lookup while
  keeping misconception traversal on the legacy substrate pending Inc.3
  misconception replatform.

## Dependencies

**Blocking**:

- Spine `gate-1-eef-ships` (STRICT — owner sequencing; slice 1 first
  establishes the MVP-arc spine pattern + namespace discipline).
- Graph-stack Inc.1 Oak Ontology Threads foundation for Thread→Unit lookup.

**Parallel-safe with**:

- [`oak-kg-threads-surface.plan.md`](oak-kg-threads-surface.plan.md)
  (slice 2) — shared Inc.1 Thread lookup but different implementation path
  after lookup (legacy misconception factory vs Oak Ontology Threads surface),
  different namespace (`oak-misconceptions-*` vs `oak-kg-*`), different
  tool / resource files.

**Consumed by**:

- [`oak-misconceptions-eef-cross-corpus-surface.plan.md`](oak-misconceptions-eef-cross-corpus-surface.plan.md)
  (slice 3b) reuses the bounded-sub-graph response SHAPE established
  here, but reaches misconception data through `graph-corpus-sdk`
  directly once Inc.3 has replatformed the misconception substrate;
  it does NOT call this tool at runtime.

**Related plans**:

- [`graph-mvp-arc.plan.md`](../../../graph-mvp-arc.plan.md) — coordination
  spine.
- `misconception-graph-mcp-surface.plan.md` — already-shipped per-IRI
  lookup; slice-3a is the bounded sub-graph follow-up.
- `oak-misconceptions-substrate-migration.plan.md` — the follow-up
  plan WS7 creates in `future/`.

## Consolidation

After WS7 closes, run `/jc-consolidate-docs` per the spine's
`learning-loop` todo. Surface graduation candidates from the
bounded-extraction primitive shape, the legacy-substrate-disclosure
discipline, and the empirical-default-with-comment pattern.
