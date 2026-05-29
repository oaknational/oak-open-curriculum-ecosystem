---
title: "EEF graph tool — completion (the first proper graph tool)"
status: current
lane: current
type: executable
thread: eef
date: 2026-05-29
supersedes: "./graph-tooling-rebuild.plan.md (its Goal 2 / D1–D6 + DX execution spine; the foundation doc and the resolved design are preserved and cited)"
foundation: "./graph-tooling-rebuild-foundation-2026-05-28.md"
owner_scope: >-
  Authored 2026-05-29 under owner direction: a simple, linear, explicit plan to
  FINISH the first proper graph tool. Value-evaluation of the finished tool is a
  separate plan (future/eef-graph-tool-value-evaluation.plan.md). This plan is
  queued only; no execution has started.
todos:
  - id: s1-contract-adr
    content: "Author the graph-tool contract ADR (next id ADR-188): structuredContent-only; full-node, membership-scoped, complete-within-itself subgraph; integrity floor; navigable frontier via the query surface; budget is a design signal not a runtime cap; no list-ops. Precise enough that S3's worked-example acceptance (contexts A/B/C) derives from it. Owner ratifies."
    status: pending
  - id: s2-query-surface
    content: "Un-stub the GraphView operations the tool consumes on EefStrandsGraphView (getNode, enumerateNodes, summary, neighbours, findByTag); relocate selectEefSeedIds into a NodeFilter consumed by enumerateNodes; remove the type-only EvidenceCorpus rank/explain/compare interface + RankError/CompareError aliases; reconcile stale gate-1a/1b/Inc.3 TSDoc comments in every file touched."
    status: pending
    depends_on: [s1-contract-adr]
  - id: s3-tool-thin-formatter
    content: "Rebuild eef-explore-evidence-for-context as a thin formatter over S2: remove capForBudget (response-budget.ts) and projectExploreNode (projection.ts); return full-node membership-scoped subgraph + all related_strand edges among members + envelope (corpus caveats + EEF attribution once); structuredContent-only (drop the dual content[] block); out-of-subgraph references carry enough id to be fetched via getNode/subgraph; reconcile stale TSDoc comments in touched files."
    status: pending
    depends_on: [s2-query-surface]
  - id: s4-navigation-round-trip
    content: "Prove an agent can consume and traverse: a real MCP-client round-trip receiving a subgraph, then following a related_strand reference pointing OUTSIDE the returned subgraph via getNode/subgraph and receiving the connecting node; >=1 telemetry span recorded."
    status: pending
    depends_on: [s3-tool-thin-formatter]
---

# EEF graph tool — completion (the first proper graph tool)

A **simple, linear, explicit** plan to finish the first proper graph tool:
`eef-explore-evidence-for-context`. Each step is one TDD landing (test +
product code in one commit) and consumes the previous step's output, so a
drifted predecessor breaks the next step's gate. Steps run strictly in order
(`depends_on` chain).

This plan **supersedes the Goal 2 / D1–D6 + DX execution spine** of
[`graph-tooling-rebuild.plan.md`](./graph-tooling-rebuild.plan.md). The
diagnosis, principles, and resolved design are preserved in
[the foundation doc](./graph-tooling-rebuild-foundation-2026-05-28.md) and
restated in §Ratified design below; estate-wide reference reconciliation (the
old DX) and value-exploration (the old D6) move to the
[graph plan-estate consolidation plan](../../../connecting-oak-resources/knowledge-graph-integration/current/graph-estate-consolidation.plan.md)
(which owns the estate cleanup and the authoring of the separate
value-evaluation plan).

## End goal

One graph tool that hands an LLM agent a **complete, navigable, full-node
subgraph** of EEF evidence scoped to a teacher's lesson context — proving the
real graph-tool pattern that the rest of the graph work will reuse. The tool is
the pathfinder: the wider graph tooling is undefined until this one is finished.

## Mechanism

The current tool (verified 2026-05-29) is real, working code in the **wrong
shape**: it slices to 12 strands (`capForBudget`), field-masks nodes
(`projectExploreNode`), and dual-emits `content[]`+`structuredContent`. Five of
the seven `EefStrandsGraphView` operations it should lean on are
`NotImplementedYet` stubs. Completion = build the query operations the tool
needs, then reduce the tool to a thin formatter over them, then prove the
navigation loop. The substrate it needs (`loadEefCorpus`, `selectEefSeedIds`,
`subgraph` BFS, `manifest`, freshness, the 30-strand/37-edge corpus) is already
built and tested (53 tests passing).

## Ratified design (owner-ratified 2026-05-28; this plan does not reopen it)

- **Membership, full nodes** — a delivered subgraph = context-matched seeds ∪
  their bounded traversal neighbourhood (`subgraph`, depth 1) + all
  `related_strand` edges among members. Every member node carries full detail.
  Subgraphs may be contiguous or sparse.
- **Navigable frontier** — `related_strands` pointing outside the subgraph are
  reachable by the agent via `getNode`/`subgraph`. Navigation, not field-mask,
  is the disclosure mechanism.
- **No list-ops** — no slice / cap / field-mask-for-budget / rank-and-cut.
- **Budget is a design signal** — the whole corpus is ~21–26k tokens, around
  the agent ceiling; a scoped subgraph fits. Honest breadth is surfaced, never
  truncated.
- **Encoding** — `structuredContent` only; no dual `content[]`, no context hint.
- **Integrity floor** — every shown node carries `{impact_months,
  evidence_strength rating+label, cost}` inseparably; full nodes satisfy it.
- **Out of scope** — `rank`/`explain`/`compare` (corpus-analytical ops) are
  removed, not deferred; candidates live in
  [`extending-graph-support-tooling.plan.md`](../../../connecting-oak-resources/knowledge-graph-integration/future/extending-graph-support-tooling.plan.md).

## Steps (linear; each one TDD landing)

### S1 — Contract ADR (ADR-188)

- **Do:** author the graph-tool contract ADR crystallising §Ratified design as
  the permanent contract S2–S4 build to. Reconcile the EEF selection/scoping
  definition precisely enough that S3's context A/B/C acceptance is derivable.
- **Acceptance:** ADR exists at `docs/architecture/architectural-decisions/188-*.md`,
  indexed in the ADR README, owner-ratified; the contract can generate S3's
  worked-example assertions.
- **Proof level:** `non-code` (owner ratification + check that S3's acceptance derives from it).
- **Consumes:** §Ratified design + the foundation.
- **Breaks-if-drifted:** if the ADR cannot generate S3's acceptance assertions,
  residual vagueness surfaces at S3 as acceptance that cannot be specified.

### S2 — Build the query surface (no stubs)

- **Do:** implement on `EefStrandsGraphView` (graph-corpus-sdk) the operations
  the tool consumes — `getNode`, `enumerateNodes`, `summary`, `neighbours`,
  `findByTag` — over the real corpus. Relocate `selectEefSeedIds` into a
  `NodeFilter` consumed by `enumerateNodes`. Remove the type-only
  `EvidenceCorpus` rank/explain/compare interface + `RankError`/`CompareError`
  aliases (`types.ts`). Reconcile stale `gate-1a/1b`/`Inc.3` TSDoc comments in
  every file touched.
- **Acceptance:** each op returns real results with integration tests on the
  30-strand corpus; zero `NotImplementedYet` remains in the ops the tool uses;
  `EvidenceCorpus` type-only interface gone; full gate green.
- **Proof level:** `integration` (corpus-backed op tests).
- **Consumes:** S1's contract.
- **Breaks-if-drifted:** S3 assembles the subgraph on these ops; a stub/missing
  op makes the tool unable to assemble (loud failure).
- **Reuse (already built):** `eef-graph-model.ts`, `selection.ts`, `loader.ts`,
  `freshness.ts`, `strand-schema.ts`, `school-context.ts`.

### S3 — Reduce the tool to a thin formatter

- **Do:** rebuild `eef-explore-evidence-for-context` over S2. Remove
  `capForBudget` (`response-budget.ts`) and `projectExploreNode`
  (`projection.ts`). Return the full-node membership-scoped subgraph + all
  edges among members + envelope (corpus caveats + EEF attribution once), as
  `structuredContent` only (drop the dual `content[]` block). Out-of-subgraph
  references carry enough id to be fetched via `getNode`. The tool holds no
  scoping brain beyond `enumerateNodes(filter)` then `subgraph`. Reconcile
  stale TSDoc comments in touched files.
- **Acceptance:** for the worked contexts — **A** (KS2 + `improving_reading` →
  ~14 full strands), **B** (KS3 + `metacognition_and_self_regulation` → ~6),
  **C** (no focus / KS2 only → broad, surfaced not truncated) — the tool
  returns the complete full-node subgraph + all member edges + envelope, as
  `structuredContent` only, on real data; `projection.ts` + `response-budget.ts`
  deleted; full gate green.
- **Proof level:** `integration` + `e2e` (tool-result shape on contexts A/B/C).
- **Consumes:** S2's query surface + S1's contract.
- **Breaks-if-drifted:** if S2 left an op stubbed, assembly fails loudly; if
  S1's contract was vague, the wrong shape surfaces here.

### S4 — Prove navigation round-trip

- **Do:** an MCP-client round-trip — the agent receives a subgraph, follows a
  `related_strand` reference pointing **outside** the returned subgraph by
  calling `getNode`/`subgraph`, and receives the connecting node. Wire the
  existing (currently no-op) `recordSpan` seam so ≥1 span is recorded on the
  tool path.
- **Acceptance:** round-trip test passes (disclosure by navigation, not
  field-mask); ≥1 span recorded; full gate green.
- **Proof level:** `e2e`.
- **Consumes:** S3.
- **Breaks-if-drifted:** if S3 did not expose navigable out-of-subgraph ids,
  the round-trip cannot complete — exposing S3/S2 drift.

## Done-when

S1–S4 each pass their acceptance with all tests green at every level, and the
tool returns full-node navigable subgraphs (no cap, no field-mask,
`structuredContent`-only) on contexts A/B/C with a working navigation loop. At
that point the first proper graph tool is finished and a separate
value-evaluation plan can run against it.

## Non-goals (YAGNI)

- `rank`/`explain`/`compare` and relevance-ordering (→ extending-graph-support).
- Any second corpus, Threads adapter, or other `oak-kg-*` surface — undefined
  until this tool is finished (owner direction 2026-05-29).
- UI/widget or a second (human) audience (foundation §9).
- Value-exploration of the finished tool (→ a separate value-evaluation plan,
  scoped in the graph plan-estate consolidation plan).
- The "working with graphs" doctrine graduation (old D5) — grounded only once
  the tool is built; its home is decided in the consolidation session, not
  pre-committed here.
- Flipping `OAK_CURRICULUM_MCP_EEF_ENABLED` on in any deployed environment — a
  separate owner-timed release decision, out of scope for completion.

## Prerequisites

- **Blocking:** none — all substrate (graph-corpus-sdk eef-strands, corpus,
  loader, freshness, selection) is built and on `main`.
- **Beneficial:** the contract ADR (S1) is internal to this plan and gates the
  rest.

## Foundation alignment

- [`principles.md`](../../../../directives/principles.md) — schema-first,
  strict/complete, no compatibility layers, TDD, fail-fast.
- [`testing-strategy.md`](../../../../directives/testing-strategy.md) — unit /
  integration / e2e at the right levels; corpus-backed integration tests.
- [`schema-first-execution.md`](../../../../directives/schema-first-execution.md)
  — EEF data has its own typing discipline (ADR-157); the integrity floor and
  citations flow from the strand schema.

## Plan-body first-principles check

Per [`plan-body-first-principles-check`](../../../../rules/plan-body-first-principles-check.md):
no escape-hatch shapes (defer/menu/list-op/suppress-signal); the only landing
path is the complete build of each step; vendor-literal call shapes (MCP
`tools/call`, `structuredContent`) are verified against the SDK at S3/S4 author
time, not assumed.

## Quality gates

Per [`components/quality-gates.md`](../../../templates/components/quality-gates.md):
each step runs its focused validation plus local gates; final validation runs
the canonical aggregate (`pnpm check`) on a settled tree.

## Readiness reviewers

Before this plan is marked READY FOR EXECUTION: `assumptions-expert`
(proportionality + the supersession assumption), and `mcp-expert` +
`type-expert` at S3 author time (tool result shape; schema-first type flow).

## Risk

| Risk | Mitigation |
|------|------------|
| S1 ADR too vague to drive S3 tests | S1 not done until it generates S3's A/B/C assertions |
| Removing the cap exceeds the agent ceiling on a broad context | Budget is a design-signal; context C surfaces breadth honestly and is a value-plan input, not a cap trigger |
| `getNode`/`enumerateNodes` semantics drift from the contract | S2 integration tests assert against the ADR; S4 round-trip is the end-to-end check |

## Lifecycle triggers

Per [`components/lifecycle-triggers.md`](../../../templates/components/lifecycle-triggers.md):
session entry grounding, claim registration before edits, handoff closure, and
consolidation on completion. Completion runs the learning loop; the "working
with graphs" doctrine graduation (old D5) is a post-completion follow-on homed
in the consolidation session (see Non-goals), not graduated by this plan.
