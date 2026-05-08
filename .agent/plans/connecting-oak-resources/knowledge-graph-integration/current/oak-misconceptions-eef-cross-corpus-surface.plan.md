---
name: "Oak Misconceptions × EEF Cross-Corpus MCP Surface (Slice 3b of MVP arc)"
overview: "Author the executable plan for the slice-3b cross-corpus MCP surface: `oak-misconceptions-eef-recommend-for-thread` composes EEF strands (slice 1) and the bounded misconception sub-graph (slice 3a) through the `graph-corpus-sdk` cross-corpus join primitive (graph-stack Inc.3). Substance inherited from the MVP-arc spine; this plan adds TDD cycle structure, file scopes, and reviewer dispatch. Gate-3b waits on slice 1 + slice 3a + Inc.3; **not** on slice 2."
plan_id: oak-misconceptions-eef-cross-corpus-surface
type: feature-workstream
status: current
graph_layer: oak-graph-surface
spine_plan: ".agent/plans/graph-mvp-arc.plan.md"
spine_slice: 3b
namespace: "oak-misconceptions-eef-*"
substrate_path: "graph-corpus-sdk EEF + misconception adapters via graph-stack Inc.3 cross-corpus join primitive"
substrate_floor:
  - "graph-stack Inc.3 (cross-corpus join primitive + misconception adapter + EEF strand adapter on graph-corpus-sdk)"
  - "gate-1-eef-ships as naming/response-shape prerequisite only; no runtime MCP tool dependency"
  - "gate-3a-mcg-subgraph-ships as bounded-sub-graph response-shape prerequisite only; no runtime MCP tool dependency"
sequencing_gate: "gate-1 + gate-3a + Inc.3 (Phase 2 spine correction 2026-05-07: gate-2 is NOT a dependency)"
last_updated: 2026-05-08
related_indices:
  - ".agent/plans/graph-portfolio-index.md"
  - ".agent/plans/connecting-oak-resources/knowledge-graph-integration/README.md"
adr_amendments_required:
  - "ADR-123: record `oak-misconceptions-eef-recommend-for-thread` (compound-prefix tool)"
  - "ADR-157: confirm compound-prefix convention is recorded (already amended Phase 0 of MVP-arc spine)"
specialist_reviewers:
  - mcp-reviewer
  - test-reviewer
  - type-reviewer
  - architecture-reviewer-betty
  - elasticsearch-reviewer
  - code-reviewer
foundation_alignment:
  - .agent/directives/principles.md
  - .agent/directives/testing-strategy.md
  - .agent/directives/schema-first-execution.md
isProject: false
todos:
  - id: ws1-cycle-1-cross-corpus-happy-path
    content: "WS1 cycle 1: `oak-misconceptions-eef-recommend-for-thread.integration.test.ts` (RED) — Thread IRI → structured `{evidence: [...EEF strands ranked], misconceptions: {...bounded sub-graph}}` payload for a curated set of N Thread IRI contexts where both corpora are known to have content; `oak-misconceptions-eef-recommend-for-thread.ts` (GREEN) implements the response by invoking the `graph-corpus-sdk` cross-corpus join primitive (graph-stack Inc.3), which traverses the EEF and misconception adapters on the substrate. The tool does NOT call slice-1 or slice-3a MCP tools at runtime; both corpora are reached through `graph-corpus-sdk` directly per Design Principle 1. One commit. Tree green."
    status: pending
    depends_on: []
  - id: ws1-cycle-2-substrate-only
    content: "WS1 cycle 2: behavioural integration test exercising the cross-corpus join end-to-end with both EEF strands and misconception nodes supplied through `graph-corpus-sdk` fixture adapters. One commit."
    status: pending
    depends_on: [ws1-cycle-1-cross-corpus-happy-path]
  - id: ws1-cycle-3-cross-corpus-join-verified
    content: "WS1 cycle 3: behavioural test verifies the cross-corpus join result changes when the `graph-corpus-sdk` join fixture changes, proving the tool projects the substrate join output rather than composing stale local data. One commit."
    status: pending
    depends_on: [ws1-cycle-2-substrate-only]
  - id: ws1-cycle-4-error-shapes
    content: "WS1 cycle 4: error paths (Thread IRI with empty EEF result; Thread IRI with empty misconception result; both empty; unknown IRI; malformed IRI). Compound responses are structurally well-formed even when one or both corpora return empty (so consumers can rely on the response shape). One commit."
    status: pending
    depends_on: [ws1-cycle-1-cross-corpus-happy-path]
  - id: ws2-cycle-1-mcp-wiring
    content: "WS2 cycle 1: integration test wires the tool through MCP server registration; assert tool discoverable + invocable end-to-end. One commit; tests + wiring together."
    status: pending
    depends_on: [ws1-cycle-3-cross-corpus-join-verified, ws1-cycle-4-error-shapes]
  - id: ws2-cycle-2-tool-meta-and-attribution
    content: "WS2 cycle 2: tool descriptor + NL guidance + tool examples land. The compound-prefix name (`oak-misconceptions-eef-*`) makes source attribution structurally clear; assert each response carries explicit per-source citations (EEF strand IDs + misconception IRIs) consistent with the explicit-source-attribution discipline (ADR-157 amendment). One commit."
    status: pending
    depends_on: [ws2-cycle-1-mcp-wiring]
  - id: ws3-adr-123-update
    content: "WS3: update `docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md` to record the compound-prefix tool; confirm ADR-157 already records the compound-prefix convention (Phase 0 amendment)."
    status: pending
    depends_on: [ws2-cycle-2-tool-meta-and-attribution]
  - id: ws4-quality-gates
    content: "WS4: full quality-gate chain on integrated delivery."
    status: pending
    depends_on: [ws3-adr-123-update]
  - id: ws5-adversarial-review
    content: "WS5: dispatch `mcp-reviewer` (MCP spec + compound-prefix tool shape + source-attribution discipline + namespace) + `architecture-reviewer-betty` (substrate-only enforcement + cross-corpus join primitive boundary; tool body should be thin) + `elasticsearch-reviewer` (if EEF strand ranking touches Elasticsearch retrieval; otherwise note scope and skip) + `test-reviewer` (TDD pair audit + cross-corpus integration coverage) + `code-reviewer` (gateway). Lint/depcruise/architecture gates, not TDD cycles, enforce no legacy imports, thin-body expectations, file size, and complexity bounds. Document findings; remediate or queue."
    status: pending
    depends_on: [ws4-quality-gates]
  - id: ws6-spine-gate-3b-close-and-arc-archive
    content: "WS6: update spine `gate-3b-cross-corpus-ships` todo to `completed`; record acceptance evidence; refresh thread next-session record; per spine `learning-loop` todo, run `/jc-consolidate-docs` after this gate AND consider archiving the MVP-arc spine plan with key outcomes mined to permanent docs per ADR-117."
    status: pending
    depends_on: [ws5-adversarial-review]
---

# Oak Misconceptions × EEF Cross-Corpus MCP Surface — Slice 3b of the MVP Arc

**Last Updated**: 2026-05-08
**Status**: 🟡 PLANNING (current/) — pending gate-1-eef-ships +
gate-3a-mcg-subgraph-ships + graph-stack Inc.3.
**Scope**: Slice 3b of the
[`graph-mvp-arc.plan.md`](../../../graph-mvp-arc.plan.md) — author and
ship `oak-misconceptions-eef-recommend-for-thread`, the cross-corpus
tool that composes EEF evidence strands (slice 1) and the bounded
misconception sub-graph (slice 3a) into a single structured response
for teacher / agent consumers planning lessons or sequences.

## Context

Slice 3b is the user-value framing on top of slice 3a's blocking
primitive. Teachers sequencing lessons need both *what works*
(evidence-backed approaches) and *what to plan for* (common
misconceptions) in one structured response — not two separate calls.
The compound prefix `oak-misconceptions-eef-*` makes both source
corpora explicit so source attribution is trivially clear during
assessment, observability, debugging, and licensing audit (per the
ADR-157 explicit-source-attribution discipline).

### Spine Phase 2 correction (2026-05-07)

The MVP-arc spine previously listed slice 3b as blocked by
`gate-2-threads-ships + gate-3a + graph-stack Inc.3`. Phase 2 of the
single-session planning closure (assumptions-reviewer FINDING #4)
corrected this: the cross-corpus payload composes EEF (slice 1) and
misconceptions (slice 3a); the Oak Threads MCP surface is **not** part
of the payload. Slice 3b is now blocked by `gate-1-eef-ships +
gate-3a + Inc.3`. Slice 3b can ship before, after, or in parallel with
slice 2 once gate-1, gate-3a, and Inc.3 have landed.

### What ships (locked from spine)

| Primitive | Name | Substrate path |
|---|---|---|
| Tool | `oak-misconceptions-eef-recommend-for-thread` | graph-corpus-sdk EEF + misconception adapters via graph-stack Inc.3 cross-corpus join |

The compound prefix names both source corpora explicitly. Renaming
requires a spine amendment (the spine names the tool by name).

### Existing capabilities consumed (post-substrate-floor)

This slice is substrate-only per Design Principle 1: it consumes the
underlying graph through `graph-corpus-sdk`, NOT the MCP tools shipped
by slices 1 or 3a. Slices 1 and 3a are referenced for naming
conventions (compound prefix, `eef-*`) and structural compatibility of
the response shape, not as runtime dependencies.

- `graph-corpus-sdk` cross-corpus join primitive (lands in graph-stack
  Inc.3)
- `graph-corpus-sdk` EEF strand corpus adapter (explicitly included in
  graph-stack Inc.3 before slice 3b starts — slice 1's EEF substrate may be
  on graph-query-layer at gate-1; the cross-corpus join primitive requires
  both corpora on `graph-corpus-sdk`)
- `graph-corpus-sdk` misconception adapter (lands in Inc.3
  misconception replatform — see
  `oak-misconceptions-substrate-migration.plan.md` future plan that
  slice 3a's WS7 creates)
- Naming/structural conventions from slice 1 (EEF strand response
  shape, compound-prefix `eef-*`) — see
  [`sector-engagement/eef/current/eef-evidence-corpus.plan.md`](../../../sector-engagement/eef/current/eef-evidence-corpus.plan.md)
- Sub-graph extraction shape from slice 3a (bounded sub-graph by Thread IRI
  context) — see
  [`oak-misconceptions-subgraph-mcp-surface.plan.md`](oak-misconceptions-subgraph-mcp-surface.plan.md);
  slice 3a's tool is NOT called at runtime
- The SDK's `classify-error-response` convention
- The SDK's tool-guidance surface
- The MCP server registration in
  `apps/oak-curriculum-mcp-streamable-http`

## Design Principles

1. **Substrate-only** — both corpora flow through `graph-corpus-sdk` +
   `GraphView`. The legacy graph factory MUST NOT be imported by this
   tool. (This is what makes slice 3b genuinely cross-corpus on the
   substrate; slice 3a's interim legacy path is intentionally a slice-3a
   contract, not a slice-3b inheritance.)
2. **Cross-corpus join via primitive, not bespoke logic** — the tool
   body is thin; the join primitive (graph-stack Inc.3) is responsible
   for the cross-corpus composition. If the tool body has more than
   trivial composition logic, the primitive is leaking responsibility.
3. **Compound-prefix structural attribution** — `oak-misconceptions-eef-*`
   makes the source corpora structurally clear. Per-response citations
   (EEF strand IDs + misconception IRIs) carry the explicit per-item
   attribution that the ADR-157 amendment requires.
4. **Structurally well-formed responses on empty corpus results** —
   compound responses must hold their shape even when one or both
   corpora return empty for a given Thread IRI; consumers can branch on
   field presence without parsing-failure paths.
5. **Spine-locked names, parallel authoring honest** — this plan is
   authored 2026-05-07 in the same session as slices 2 and 3a;
   slices 2, 3a, and 3b lock against the tool names already in the
   spine. Renaming during slice-2 / slice-3a execution requires
   amendment of all three plans + the spine.
6. **TDD pairs** — every cycle is one commit with the failing test +
   the product code that makes it pass.

**Non-Goals** (YAGNI):

- Three-corpus joins (EEF + misconceptions + threads simultaneously,
  or with the prerequisite graph) — see existing future plan
  [`cross-source-journeys.plan.md`](cross-source-journeys.plan.md).
- Open-ended sequencing recommendations beyond Thread IRI context
  (e.g. by unit, by lesson, by content descriptor) — future plan
  [`oak-misconceptions-eef-extended-contexts.plan.md`](../future/oak-misconceptions-eef-extended-contexts.plan.md).
- LLM/outcome evaluation — follow-on evaluation infrastructure, not a
  slice-3b gate. `eef-evidence-corpus.plan.md` t19 keeps LLM paraphrase and
  outcome verification out of Vitest; structural citation/data/caveat
  preservation is the load-bearing EEF stance for this arc.
- A per-unit cross-corpus variant (`oak-misconceptions-eef-recommend-for-unit`)
  — defer to a follow-up plan if demand surfaces; the per-thread
  variant covers the named user value.
- Cross-corpus surface that includes the Oak Threads MCP surface
  (slice 2) — slice 3b composes EEF (slice 1) and misconceptions
  (slice 3a) only; the spine Phase 2 correction confirmed this.

## Acceptance Criteria (inherited from spine §"Acceptance — Slice 3b")

1. Per-call response carries non-empty EEF strand list AND non-empty
   misconception sub-graph for a curated set of N Thread IRI contexts
   where both are known to exist.
2. Both corpora flow through `graph-corpus-sdk` + `GraphView` (no
   legacy factory).
3. Cross-corpus join primitive verified end-to-end.
4. ADR-123 records the compound-prefix tool.

## Workstreams

### WS1 — `oak-misconceptions-eef-recommend-for-thread`

Four TDD cycles. Tool lives at
`packages/sdks/oak-curriculum-sdk/src/mcp/oak-misconceptions-eef-recommend-for-thread.ts`
with `tool-definition.ts` and `integration.test.ts` siblings.

#### Cycle 1.1 — cross-corpus happy path

- **Test**: Thread IRI → response carries non-empty `evidence` (EEF
  strand list, ranked) AND non-empty `misconceptions` (bounded
  sub-graph) for a curated set of N Thread IRI contexts where both
  corpora are known to have content. The N contexts are committed as
  fixtures.
- **Product code**: invoke the cross-corpus join primitive composing
  the EEF strand corpus adapter + misconception adapter via
  `graph-corpus-sdk`; project to MCP-friendly response shape.
- **Acceptance**: test passes; full tree green.

#### Cycle 1.2 — behavioural substrate join

- **Tests**: integration test exercises the cross-corpus join
  end-to-end with both EEF strands and misconception nodes supplied
  through `graph-corpus-sdk` fixture adapters.
- **Product code**: any wiring fixes the test exposes.
- **Acceptance**: joined payload comes from the fixture adapters and carries
  explicit source attribution for both corpora.

#### Cycle 1.3 — join-output projection

- **Test**: mutate the `graph-corpus-sdk` join fixture and assert the tool
  response changes accordingly while preserving the MCP response shape.
- **Product code**: projection changes the behavioural test drives.
- **Acceptance**: the tool projects the substrate join output, not stale local
  composition data.

MCP envelope acceptance: tool calls return a `CallToolResult` with `content`
containing a short summary plus serialized JSON, `structuredContent` containing
the compound payload, a declared `outputSchema`, and `isError: true` on tool
execution errors.

#### Cycle 1.4 — error-shape and empty-corpus paths

- **Tests**: Thread IRI with empty EEF result (response holds shape
  with empty `evidence`); Thread IRI with empty misconception result
  (response holds shape with empty `misconceptions`); both empty
  (response holds shape, structured "no match" payload); unknown IRI →
  404-shape; malformed IRI → validation.
- **Product code**: route through `classify-error-response`; ensure
  empty-result paths take the same projection code path as
  non-empty results so the response shape is consistent.

### WS2 — MCP wiring + descriptor + attribution

#### Cycle 2.1 — MCP integration test

- **Test**: integration exercises the full MCP path; tool discoverable
  and invocable end-to-end on a real cross-corpus join primitive.
- **Product code**: registration in MCP app's tool registration path.

#### Cycle 2.2 — descriptor + per-source citations

- **Tests**: descriptor + NL guidance + tool examples land; assertion
  that each response item carries explicit per-source citation (EEF
  strand IDs + misconception IRIs) consistent with the
  explicit-source-attribution discipline (ADR-157 amendment).
- **Product code**: descriptor changes; per-item citation projection.

### WS3 — ADR-123 + ADR-157 confirmation

- ADR-123: record the compound-prefix tool.
- ADR-157: confirm compound-prefix convention already recorded
  (Phase 0 amendment); add cross-reference if needed.

### WS4 — Quality gates

```bash
pnpm clean && pnpm sdk-codegen && pnpm build && pnpm type-check && \
pnpm format:root && pnpm markdownlint:root && pnpm lint:fix && \
pnpm test && pnpm test:ui && pnpm test:e2e
```

### WS5 — Adversarial review

Dispatch:

- `mcp-reviewer` — MCP spec + compound-prefix tool shape +
  source-attribution discipline + namespace conformance
- `architecture-reviewer-betty` — substrate-only enforcement; tool
  body thinness (cross-corpus join primitive carries the composition
  responsibility); cross-corpus boundary durability
- `elasticsearch-reviewer` — applies if EEF strand ranking touches
  Elasticsearch retrieval; if not (the EEF strand corpus is small
  enough for in-process ranking), note scope and skip
- `test-reviewer` — TDD pair audit; cross-corpus integration coverage;
  no audit-shaped tests; no skipped tests
- `code-reviewer` — gateway

Structural enforcement gates at WS5:

- lint/depcruise: no legacy graph factory imports in the slice-3b tool path;
- architecture review: tool body remains a projection over
  `graph-corpus-sdk`, with cross-corpus responsibility in the join primitive;
- code-review gateway: file-size and complexity concerns are reviewed as code
  quality, not encoded as brittle TDD assertions.

### WS6 — Spine gate-3b close + MVP-arc archive trigger

1. Update spine
   [`graph-mvp-arc.plan.md`](../../../graph-mvp-arc.plan.md)
   `gate-3b-cross-corpus-ships` todo to `completed`; record evidence.
2. Per spine `learning-loop` todo: run `/jc-consolidate-docs` after
   this gate.
3. Consider archiving the MVP-arc spine plan with key outcomes mined to
   permanent docs (per ADR-117). The archival decision is
   owner-confirmed at WS6 close.
4. Refresh
   [`connecting-oak-resources.next-session.md`](../../../../memory/operational/threads/connecting-oak-resources.next-session.md).

## Risks

| Risk | Mitigation |
|---|---|
| EEF substrate migration (graph-query-layer → graph-corpus-sdk) ships in a shape that breaks slice 1's already-shipped `eef-*` tools | EEF strand adapter is explicit graph-stack Inc.3 scope before slice 3b starts; cycle 1.2's behavioural join fixture catches drift between slice 1 ship and slice 3b execution. |
| Cross-corpus join primitive (graph-stack Inc.3) lands in a shape that complicates `oak-misconceptions-eef-*` semantics | Per spine risk: slice 3b waits for Inc.3 by design; spine doesn't lock the join API early. Cycle 1.3's join-output projection test catches if the tool has to fight the primitive shape. |
| Empty-corpus response shape inconsistency surprises consumers | Cycle 1.4 covers all four empty-result combinations explicitly. |
| Compound-prefix tool name drift (e.g., consumer-side rename request mid-execution) | Tool name is locked from spine; renaming requires spine + this plan + slice-3a (since it's name-composed) amendment. |
| EEF outcome evaluation is accidentally treated as a slice-3b gate | EEF plan and spine now state structural-only verification for slice 1; slice 3b inherits that stance and routes LLM/outcome measurement to follow-on evaluation infrastructure. |

## Foundation Alignment

- [`principles.md`](../../../../directives/principles.md) — replace-don't-bridge,
  no-moving-targets, "could it be simpler".
- [`testing-strategy.md`](../../../../directives/testing-strategy.md) — TDD
  pairs, no audit-shaped tests, no skipped tests.
- ADR-117 (plan templates).
- ADR-123 (MCP primitive naming) — updated by WS3.
- ADR-157 (multi-source integration) — compound-prefix convention +
  explicit-source-attribution discipline (already amended Phase 0 of
  MVP-arc spine).
- ADR-173 (graph stack topology, Proposed) — substrate path.

## Dependencies

**Blocking**:

- Spine `gate-1-eef-ships` (slice 1's `eef-*` names and response-shape
  contract available).
- Spine `gate-3a-mcg-subgraph-ships`
  ([`oak-misconceptions-subgraph-mcp-surface.plan.md`](oak-misconceptions-subgraph-mcp-surface.plan.md)).
- `graph-stack.plan.md` Inc.3 (cross-corpus join primitive +
  misconception adapter + EEF strand adapter on `graph-corpus-sdk`).
- EEF substrate migration onto `graph-corpus-sdk` is an explicit
  Inc.3 precondition for slice 3b.
- Slice-1 EEF evaluation stance resolved to structural-only: no
  LLM/outcome gate before slice 1 or slice 3b execution.

**Not** blocked by:

- Spine `gate-2-threads-ships` — Phase 2 spine correction 2026-05-07
  removed this dependency. Slice 2 and slice 3b can ship in any order
  relative to each other once gate-1, gate-3a, and Inc.3 have landed.

**Related plans**:

- [`graph-mvp-arc.plan.md`](../../../graph-mvp-arc.plan.md) — coordination
  spine.
- [`graph-stack.plan.md`](graph-stack.plan.md) — substrate plan
  (cross-corpus join primitive lives in Inc.3).
- [`sector-engagement/eef/current/eef-evidence-corpus.plan.md`](../../../sector-engagement/eef/current/eef-evidence-corpus.plan.md)
  — slice 1.
- [`oak-misconceptions-subgraph-mcp-surface.plan.md`](oak-misconceptions-subgraph-mcp-surface.plan.md)
  — slice 3a (sibling sub-graph extraction shape; not called at
  runtime — slice 3b reaches misconception data through
  `graph-corpus-sdk` directly per Design Principle 1).

## Consolidation

After WS6 closes — and given this is the final MVP-arc gate — run
`/jc-consolidate-docs` and consider archiving the MVP-arc spine plan
itself per ADR-117. Surface graduation candidates from the
cross-corpus join primitive shape, the compound-prefix
attribution discipline, and the substrate-only-on-cross-corpus
discipline.
