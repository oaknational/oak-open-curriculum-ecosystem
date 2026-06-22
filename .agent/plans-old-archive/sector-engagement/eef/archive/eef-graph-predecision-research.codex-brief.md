# Next-session brief - EEF graph pre-decision research

Summary: Research the graph decision space so D3/D4 start with more information once D1 is ratified.

**For**: Self-contained; read this in full before starting.
**Authored**: 2026-05-31 after the architecture-review repair and the owner
clarification that the old list implementation is evidence only for what to
delete. **Scope owner**: the `eef` thread.

## Why This Session Exists

D1 is the teacher value/impact session. It owns the value contract and must remain
upstream of the MCP and graph contracts.

Some graph-design work can still happen in parallel with D1, but only as
pre-decision research. This session prepares the graph decision space so D3/D4
can move faster once D1 is ratified. It must not ratify graph structure, lock
operations, implement D5, or design the new graph around the old list tool's
outputs.

The core distinction:

- **Raw data**: `EEF_TOOLKIT_DATA` is the known fixed corpus and type source.
- **Graph**: the graph-native EEF view is a distinct design surface derived from
  the raw data. Its structure, form, and functionality are still open until D4
  ratifies them from the D1 value contract and D3 MCP surface.

## Required Boundaries

This is a research-only session.

Allowed:

- inspect current graph-core, graph-corpus-sdk, and EEF MCP code;
- map existing shapes, imports, and coupling;
- draft graph questions for D3/D4;
- compare candidate graph-native view forms;
- identify type, boundary, proof, and deletion-ordering risks;
- produce an option matrix and decision criteria.

Not allowed without explicit owner widening:

- editing implementation code;
- changing the live plan;
- ratifying graph operations or graph-native shape;
- treating raw data as the graph contract;
- treating the old list implementation as a source of expected behaviour;
- preserving, repairing, wrapping, consulting, or targeting old list logic.

Any overlap between a future graph result and an old list-tool result is only
acceptable as an incidental result independently derived from the ratified D1
value contract, D3 MCP surface, and D4/D5 graph structure. The old implementation
is evidence only for what must be deleted.

## Read First

- `.agent/plans/sector-engagement/eef/current/eef-graph-tool-completion.plan.md`
  - controlling plan and D1-D7 boundaries.
- `.agent/plans/sector-engagement/eef/current/eef-plan-architecture-reviewers.codex-brief.md`
  - architecture-review context already folded into the live plan.
- `.agent/plans/sector-engagement/eef/current/eef-d0-decontamination-ledger.md`
  - residue classes and deletion expectations.
- `.agent/plans/sector-engagement/eef/README.md`
  - live EEF lane framing.
- `.agent/memory/operational/threads/eef.next-session.md`
  - current thread banner and continuity.
- `.agent/directives/principles.md`
  - especially correctness over expediency and no preservation of wrong shapes.
- `.agent/directives/schema-first-execution.md`
  - contrast unknown external surfaces with known in-repo constants.

Then inspect the relevant code surfaces:

- `packages/core/graph-core/`
- `packages/sdks/graph-corpus-sdk/src/eef-strands/`
- `packages/sdks/oak-curriculum-sdk/src/mcp/evidence-corpus/`
- `apps/oak-curriculum-mcp-streamable-http/`

## Research Questions

Answer these without locking final decisions.

### 1. Graph-Native View Form

- What graph-native view forms are plausible: materialised graph, lazy view, or a
  hybrid index over the typed raw foundation?
- For each form, what would be the node id policy, node kind policy, edge type
  policy, payload/reference policy, frontier representation, and provenance
  envelope shape?
- Which form most safely preserves exact `EefStrandId`, `StrandByStrandId[Id]`, and
  derived edge relationships without broad `string`, generic records, `unknown`,
  or later re-narrowing?

### 2. Graph-Core Primitives Vs EEF/Oak Binding

- Which candidate operations belong in shared graph-core as domain-generic
  primitives?
- Which belong in the EEF/Oak binding because they mention EEF evidence, Oak
  lesson context, MCP payloads, or teacher-facing semantics?
- What is the smallest graph-core operation set that could support the likely D3
  surface without keeping speculative `rank`, `explain`, `compare`, or old-list
  behaviour?

### 3. MCP-Driven Functionality

- Given the current likely MCP surface, what graph capabilities might be needed
  for strand lookup, lesson-context evidence, subgraph expansion, resources, and
  corpus metadata?
- Which questions must wait for D1/D3 because they depend on teacher value or
  model-facing interaction design?
- What schema-subset/schema-builder values might D6 need, and what type
  relationships must they preserve?

### 4. Type And Proof Obligations

- Where could a graph-native design accidentally erase literal type information?
- What compile-time proofs would show graph-core result/error ids preserve
  `TNodeId` and the EEF binding instantiates it as `EefStrandId`?
- What runtime tests over the real corpus would prove graph construction,
  complete member nodes, member edges, frontier refs, and provenance envelopes?

### 5. Deletion And Atomicity Risks

- Which current old-list imports or helper surfaces become blockers if D5 deletes
  loader/freshness/cap/projection/citation code before D6?
- What D5/D6 co-landing or delete-first constraints are required so the tree does
  not go red without preserving old logic?
- What current code could pull implementation back toward the failed list/rank/Zod
  loader/freshness shape?

## Required Output

Produce a concise research report with these sections:

1. **Executive Summary** - the most important graph-design implications for D3/D4.
2. **Known Constraints** - settled boundaries that graph design must obey.
3. **Open Questions For D1/D3/D4** - separated by owner/value, MCP, graph-core,
   EEF/Oak binding, and type/proof questions.
4. **Candidate Graph-Native View Options** - compare materialised, lazy, and
   hybrid/indexed forms; include pros, risks, and proof needs.
5. **Layer Split Map** - raw foundation, graph-native EEF view, graph-core
   primitives, EEF/Oak binding, Oak lesson-context mapping, MCP composition.
6. **Risk Register** - type erasure, premature generality, stale old-list
   coupling, deletion ordering, SDK schema registration.
7. **Suggested D3/D4 Decision Agenda** - what the owner and reviewers should
   ratify later.

Use file/line references for concrete code observations. Keep suggestions
clearly labelled as `pre-decision research`, not ratified decisions.

## Quality Bar

- Do not optimise toward old list outputs.
- Do not propose a generic graph framework before a real second consumer exists.
- Do not hide EEF-specific concerns in graph-core.
- Do not hide MCP concerns in substrate packages.
- Do not replace exact raw-derived types with broad strings or generic payloads.
- Do not make D1 irrelevant by pre-choosing graph functionality.

If the research discovers that D3/D4 cannot be answered cleanly without more D1
value detail, say that directly and list the missing value questions.
