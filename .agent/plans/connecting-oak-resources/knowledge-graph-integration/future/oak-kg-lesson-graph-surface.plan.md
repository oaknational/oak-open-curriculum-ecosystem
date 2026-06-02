---
name: "Oak KG Lesson Graph Surface"
overview: "Future MCP surface for lesson-level graph projection once the Thread surface has shipped and lesson graph demand is concrete."
status: parked
graph_layer: oak-graph-surface
parent_plan: "./oak-kg-threads-surface.plan.md"
isProject: false
todos:
  - id: confirm-lesson-user-value
    content: "Confirm the lesson-level user journey and exact graph projection before adding MCP primitives."
    status: pending
  - id: define-projection-contract
    content: "Define the lesson graph response shape, source IRIs, citations, and budget expectations."
    status: pending
---

# Oak KG Lesson Graph Surface

> **⏸️ PARKED 2026-06-02.** Wider graph work is undefined until the first
> proper graph tool (EEF) ships
> ([`eef-graph-tool-completion.plan.md`](../../../sector-engagement/eef/current/eef-graph-tool-completion.plan.md));
> revisit after finishing-plan D7. Park record:
> [`graph-estate-consolidation.plan.md`](../current/graph-estate-consolidation.plan.md).

This follow-on owns lesson-level graph projection cut from slice 2. It does not
block the `curriculum://oak-kg-threads` resource or `oak-kg-get-thread-content`
tool.
