---
name: "Oak Misconceptions Graph Features (consolidated)"
overview: "Consolidated park of the four misconception graph feature directions — bounded sub-graph extraction, EEF cross-corpus composition, topic extraction, and extended contexts — each preserved as a distinct named problem. Parked: wider graph work is undefined until the first proper graph tool (EEF) ships."
plan_id: oak-misconceptions-graph-features
type: strategic
status: parked
graph_layer: oak-graph-surface
namespace: "oak-misconceptions-* (compound: oak-misconceptions-eef-*)"
date: 2026-06-02
isProject: false
---

# Oak Misconceptions Graph Features (consolidated)

> **⏸️ PARKED 2026-06-02 — spine scaffold retired.** Wider graph work is
> undefined until the first proper graph tool (EEF) ships
> ([`eef-graph-tool-completion.plan.md`](../../../sector-engagement/eef/current/eef-graph-tool-completion.plan.md)),
> and the MVP-arc spine that scaffolded these slices is quarantined — revisit
> after finishing-plan D7. The gate/slice/increment framing the source plans
> carried (`gate-1a`/`gate-3a`/`spine_slice`/`Inc.3`) is retired scaffold, not
> a live sequencing contract. Park record:
> [`graph-estate-consolidation.plan.md`](../current/graph-estate-consolidation.plan.md).

Four feature directions, consolidated from four source plans (each archived
with a pointer back here). They are variations on one undefined-until-EEF
theme but **not one problem** — each keeps its own named section below so no
contract or design substance is flattened away. Substrate migration is
explicitly *not* one of these features: replatforming the existing
misconception tool onto `graph-corpus-sdk` is migration work, owned by the
single all-tools substrate-migration plan (graph-estate-consolidation
Judgement call 4).

**Shared context.** The misconception graph is bulk-derived, constructed in
this repository from Oak bulk data. The live surface today is the
`curriculum://misconception-graph` resource + `get-misconception-graph`
aggregated tool (whole-graph, ~6.0 MB) — the tool the EEF value proof
(finishing-plan D7) runs against. Every feature below presumes a queryable
misconception substrate; none of them re-authors misconception data.

## 1. Bounded sub-graph extraction

**Problem** (owner direction 2026-05-07): the misconception graph is too
large to use without an impractical amount of context; sub-graph query by
curriculum context is the blocking primitive. Per-IRI single-misconception
lookup already shipped; this is the bounded *traversal* surface.

**Carry-forward substance** (no other home; preserved verbatim in intent):

- **Tool names**: `oak-misconceptions-subgraph-for-thread` (and optional
  `-for-unit`; default was skip — per-thread covers the composition use
  case). Names were spine-locked; treat them as strong prior art, re-ratify
  at promotion.
- **Bounded-traversal contract**: Thread IRI + bound parameter → bounded
  sub-graph of misconceptions transitively attached to the units in that
  thread. The bound is exposed to callers; the default is chosen empirically
  from committed fixture data, with the empirical basis recorded in a code
  comment. Bounded-traversal completeness is verified with small literal
  graph fixtures covering high/median/low/zero density shapes, without
  implementing a second full traversal in the test.
- **Fixture-manifest selection scheme** (20 contexts): manifest schema
  `readonly { iri: string; reachableMisconceptionCount: number; bucket:
  "zero" | "low" | "median" | "high" }[]`. Selection rule: compute
  reachable-misconception counts for all eligible Thread IRIs, sort by count
  descending with IRI lexical tie-break, then commit exactly 5 high,
  5 median-nearest, 5 low-nonzero, and 5 zero-count contexts; if a bucket has
  fewer than 5 candidates, fill from the adjacent bucket by the same ordering
  and record the fill in the manifest comment.
- **`_meta` legacy-substrate disclosure discipline**: while a tool runs on an
  interim substrate, its `_meta` declares that substrate explicitly (e.g.
  `_meta.substrate: "legacy-graph-factory"`) with a pointer to the named
  migration owner, recorded in ADR-123 as non-contractual metadata — every
  consumer can see the interim path and the contract the replatform must
  preserve. Legacy coupling stays isolated to the tool file so migration
  replaces a small surface.
- **Retired**: the `maxResponseTokens = 16000` response-budget cap that sized
  the bound default. That budget mechanism was discarded by the graph-tooling
  rebuild; the bound contract survives, but its sizing discipline must be
  re-derived against whatever response-budget posture the finished EEF tool
  establishes.

## 2. EEF cross-corpus composition

**Problem**: teachers sequencing lessons need *what works* (evidence-backed
approaches) and *what to plan for* (common misconceptions) in one structured
response, not two separate calls.

**Carry-forward substance**:

- **Tool name**: `oak-misconceptions-eef-recommend-for-thread` — the compound
  prefix names both source corpora structurally, making source attribution
  trivially clear (ADR-157 explicit-source-attribution discipline);
  per-response citations carry EEF strand IDs + misconception IRIs.
- **Substrate-only principle**: both corpora flow through `graph-corpus-sdk`;
  the tool never imports a legacy factory and never calls other MCP tools at
  runtime. The tool body stays a thin projection — the cross-corpus join
  primitive carries the composition responsibility; non-trivial composition
  logic in the tool body means the primitive is leaking.
- **Structurally well-formed empty responses**: the compound response holds
  its shape when either or both corpora return empty for a Thread IRI, taking
  the same projection code path as non-empty results, so consumers branch on
  field presence without parsing-failure paths.
- **Fixture discipline**: a committed 10-context manifest of Thread IRIs
  where both corpora are known to have content, selected deterministically by
  descending combined EEF+misconception coverage with IRI lexical tie-break.
- **Source authority**: EEF strand data is the repository-held EEF Toolkit
  snapshot; misconception data is the bulk-derived in-repo graph. Both source
  identities are preserved in citations and response metadata.
- **Retired**: the gate-1a/gate-3a/Inc.3 sequencing scaffold. The real
  prerequisite is now stated directly — a finished EEF tool whose response
  shape and citation envelope are stable (finishing-plan D7), plus both
  corpora queryable on `graph-corpus-sdk` (the substrate-migration plan owns
  the misconception side).

## 3. Topic extraction

**Problem**: free-text topic strings ("fractions", "photosynthesis") need to
resolve to curriculum IRIs before any misconception sub-graph can be
returned. Cut from the bounded-extraction scope on purpose: Thread IRI first.

Open design questions preserved: the topic-resolution contract (how
free text resolves to ontology/thread/unit IRIs), and the ambiguity handling,
response budgets, and citation requirements for topic-derived sub-graphs.
Sequenced after bounded extraction proves the underlying surface.

## 4. Extended contexts

**Problem**: cross-corpus sequencing beyond Thread IRI context — by unit,
lesson, or content descriptor. Cut from the cross-corpus scope on purpose:
Thread IRI only until demand is evidenced.

Open design questions preserved: which context type comes next (chosen only
after the Thread IRI cross-corpus surface ships and demand is evidenced), and
the extended-context join contract, source attribution, empty-result
behaviour, and evaluation fixture set.

## Sequencing

All four directions wait on the same boundary: the finished EEF tool (D7) and
the unified substrate migration. Within the set, the internal order the
source plans established still reads true: bounded extraction first (it is
the blocking primitive and §2 reuses its response shape), cross-corpus
composition second, topic extraction and extended contexts on evidenced
demand after their parents ship.
