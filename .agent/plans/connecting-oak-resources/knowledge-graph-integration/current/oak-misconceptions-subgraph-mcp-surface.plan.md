---
name: "Oak Misconceptions Sub-Graph MCP Surface (Slice 3a of MVP arc)"
overview: "Author the executable plan for the slice-3a MCP surface: `oak-misconceptions-subgraph-for-thread` (and optional `-for-unit`) tool(s) on the legacy graph factory. Bounded sub-graph extraction is the blocking primitive the misconception graph needs to be usable inside normal context windows. Substance inherited from the MVP-arc spine; this plan adds TDD cycle structure, file scopes, and reviewer dispatch."
plan_id: oak-misconceptions-subgraph-mcp-surface
type: feature-workstream
status: current
graph_layer: surface
spine_plan: ".agent/plans/graph-mvp-arc.plan.md"
spine_slice: 3a
namespace: "oak-misconceptions-*"
substrate_path: "legacy graph factory (interim)"
substrate_floor:
  - "legacy graph factory (already shipped; see existing `misconception-graph-resource.ts` + `aggregated-misconception-graph.ts`)"
  - "ADR-157 amendment for `oak-misconceptions-*` prefix (landed Phase 0 of MVP-arc spine)"
sequencing_gate: "STRICT after gate-1-eef-ships (owner sequencing); PARALLEL-SAFE with gate-2-threads-ships"
last_updated: 2026-05-07
related_indices:
  - ".agent/plans/graph-portfolio-index.md"
  - ".agent/plans/connecting-oak-resources/knowledge-graph-integration/README.md"
adr_amendments_required:
  - "ADR-123: record `oak-misconceptions-subgraph-for-thread` (and `-for-unit` if shipped)"
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
    content: "WS1 cycle 1: `oak-misconceptions-subgraph-for-thread.unit.test.ts` (RED) — Thread IRI + bound parameter → bounded sub-graph of misconceptions associated with units in that thread, sized to fit stated context budget; `oak-misconceptions-subgraph-for-thread.ts` (GREEN) implements via legacy graph factory. One commit. Tree green."
    status: pending
    depends_on: []
  - id: ws1-cycle-2-bound-default
    content: "WS1 cycle 2: extend test to assert default bound chosen so 95th-percentile responses fit standard context windows (per spine acceptance #1); product-code adjustment minimal. One commit."
    status: pending
    depends_on: [ws1-cycle-1-bounded-extraction-thread]
  - id: ws1-cycle-3-completeness-control
    content: "WS1 cycle 3: completeness test — for sample queries, all reachable misconceptions WITHIN THE BOUND are present versus a full-graph control. Property-style assertion across N representative queries. One commit."
    status: pending
    depends_on: [ws1-cycle-1-bounded-extraction-thread]
  - id: ws1-cycle-4-error-shapes
    content: "WS1 cycle 4: error paths (unknown Thread IRI; malformed IRI; bound parameter out of range; thread with no associated units). One commit."
    status: pending
    depends_on: [ws1-cycle-1-bounded-extraction-thread]
  - id: ws2-cycle-1-for-unit-optional
    content: "WS2 cycle 1 (OPTIONAL — gate at owner direction or T0 owner check): `oak-misconceptions-subgraph-for-unit.unit.test.ts` (RED) + `oak-misconceptions-subgraph-for-unit.ts` (GREEN) ship the per-unit variant on the same legacy substrate. One commit. Skip the WS if owner direction at slice-3a opening confirms thread-only suffices."
    status: pending
    depends_on: [ws1-cycle-3-completeness-control]
  - id: ws3-cycle-1-mcp-wiring
    content: "WS3 cycle 1: integration test wires the tool(s) through MCP server registration; assert tool discoverable + invocable end-to-end. One commit; tests + wiring together."
    status: pending
    depends_on: [ws1-cycle-3-completeness-control, ws1-cycle-4-error-shapes]
  - id: ws3-cycle-2-tool-meta-legacy-disclosure
    content: "WS3 cycle 2: tool `_meta` declares the legacy-factory interim path explicitly (per spine acceptance #3). Descriptor + NL guidance land. Tests assert `_meta` field presence and content. One commit."
    status: pending
    depends_on: [ws3-cycle-1-mcp-wiring]
  - id: ws4-adr-123-and-157-update
    content: "WS4: update `docs/architecture/architectural-decisions/123-mcp-primitive-naming.md` to record the new tool(s); confirm ADR-157 already records `oak-misconceptions-*` prefix (Phase 0 amendment); add cross-reference if needed."
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
    content: "WS7: update spine `gate-3a-mcg-subgraph-ships` todo to `completed`; record acceptance evidence; refresh thread next-session record; create the named follow-up plan `oak-misconceptions-substrate-migration.plan.md` (future/) per spine cut-scope row 3a (migration onto graph-corpus-sdk + GraphView when graph-stack Inc.3 misconception adapter ships). Triggers gate-3b authoring readiness check."
    status: pending
    depends_on: [ws6-adversarial-review]
---

# Oak Misconceptions Sub-Graph MCP Surface — Slice 3a of the MVP Arc

**Last Updated**: 2026-05-07
**Status**: 🟡 PLANNING (current/) — pending gate-1-eef-ships
(STRICT, owner sequencing). PARALLEL-SAFE with slice 2 — different
substrate path, different namespace, different files.
**Scope**: Slice 3a of the
[`graph-mvp-arc.plan.md`](../../../graph-mvp-arc.plan.md) — author and
ship `oak-misconceptions-subgraph-for-thread` (and optionally
`-for-unit`) on the **legacy graph factory** path. Bounded sub-graph
extraction is the blocking primitive the misconception graph needs to
be usable inside normal context windows.

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

The tools return **bounded** sub-graphs sized to fit a stated context
budget. Bound is a parameter; default chosen so 95th-percentile
responses fit standard context windows.

### Existing capabilities consumed

- The legacy misconception graph factory currently surfaced by
  `packages/sdks/oak-curriculum-sdk/src/mcp/misconception-graph-resource.ts`
  and `aggregated-misconception-graph.ts`
- The SDK's `classify-error-response` convention
- The SDK's tool-guidance surface
- The MCP server registration in
  `apps/oak-curriculum-mcp-streamable-http`

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
   is named in the spine; slice 3b composes it by name. Renaming
   requires spine + slice-3b amendment, not just this plan.
2. **Bounded by parameter, defaulted by data** — the bound is exposed
   to callers; the default is chosen empirically so 95th-percentile
   responses fit standard context windows.
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

1. Sub-graph extraction by topic/thread/unit context returns bounded
   results that fit stated context budgets across N representative
   queries.
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
with `tool-definition.ts` and `unit.test.ts` siblings.

#### Cycle 1.1 — bounded extraction happy path

- **Test**: Thread IRI + bound parameter → tool returns a sub-graph
  of misconceptions attached (transitively, within the bound) to units
  in that thread; sub-graph fits the stated context budget for N
  representative queries.
- **Product code**: legacy graph factory traversal bounded by the
  parameter; project to MCP-friendly response shape.
- **Acceptance**: test passes; full tree green.

#### Cycle 1.2 — default bound

- **Test**: with no bound supplied, the default chosen makes 95th
  percentile of N representative responses fit a standard context
  window. (The N representative queries are committed as fixtures.)
- **Product code**: default constant + comment naming the empirical
  basis.
- **Acceptance**: test passes; cycle 1.1 still passes.

#### Cycle 1.3 — completeness control

- **Test**: for each of N sample queries, assert that every
  misconception reachable within the bound IS present in the
  response (versus a full-graph control walked separately in the
  test).
- **Product code**: any traversal-completeness fixes the test
  exposes.
- **Acceptance**: completeness test passes; cycles 1.1 + 1.2 still
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

- **Test**: integration exercises the full MCP path; tool discoverable
  and invocable end-to-end.
- **Product code**: registration in MCP app's tool registration path.

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

- ADR-123: record the new tool(s).
- ADR-157: confirm `oak-misconceptions-*` row already present
  (Phase 0 amendment); add cross-reference if needed.

### WS5 — Quality gates

```bash
pnpm clean && pnpm sdk-codegen && pnpm build && pnpm type-check && \
pnpm format:root && pnpm markdownlint:root && pnpm lint:fix && \
pnpm test && pnpm test:ui && pnpm test:e2e && pnpm smoke:dev:stub
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
2. Create `oak-misconceptions-substrate-migration.plan.md` in
   `future/` per spine cut-scope row 3a.
3. Refresh
   [`connecting-oak-resources.next-session.md`](../../../../memory/operational/threads/connecting-oak-resources.next-session.md).

## Risks

| Risk | Mitigation |
|---|---|
| Empirical bound default poorly chosen; 95th percentile drifts as misconception data evolves | Cycle 1.2's default constant carries the empirical basis in a comment + fixture; substrate-migration plan re-validates the default. |
| Legacy graph factory has surprising completeness edges that the bounded traversal misses | Cycle 1.3's full-graph control test surfaces this directly. |
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
- ADR-168 (graph stack topology, Proposed) — names the substrate
  workspaces; this slice intentionally lives on the legacy substrate
  pending Inc.3 misconception replatform.

## Dependencies

**Blocking**:

- Spine `gate-1-eef-ships` (STRICT — owner sequencing; slice 1 first
  establishes the MVP-arc spine pattern + namespace discipline).

**Parallel-safe with**:

- [`oak-kg-threads-surface.plan.md`](oak-kg-threads-surface.plan.md)
  (slice 2) — different substrate path (legacy vs Inc.2 substrate),
  different namespace (`oak-misconceptions-*` vs `oak-kg-*`), different
  tool / resource files.

**Consumed by**:

- [`oak-misconceptions-eef-cross-corpus-surface.plan.md`](oak-misconceptions-eef-cross-corpus-surface.plan.md)
  (slice 3b) composes `oak-misconceptions-subgraph-for-thread` by name;
  rename here triggers slice-3b amendment.

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
