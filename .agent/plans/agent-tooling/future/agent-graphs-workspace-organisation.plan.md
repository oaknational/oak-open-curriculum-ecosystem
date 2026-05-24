---
name: "Agent Graphs Workspace Organisation"
overview: "Create the top-level `agent-graphs/` organisation so practice-facing graph tooling can live adjacent to `agent-tools/` without being misclassified as substrate or curriculum SDK code."
type: tooling-workspace-organisation
status: future
thread: agentic-engineering-enhancements
graph_layer: oak-graph-surface
related_plans:
  - "../../agentic-engineering-enhancements/current/practice-graph-payoff-peak-pilot.plan.md"
  - "../../connecting-oak-resources/knowledge-graph-integration/active/graph-stack.plan.md"
  - "../../graph-portfolio-index.md"
isProject: false
todos:
  - id: map-workspace-boundary
    content: "Map the `agent-graphs/` boundary against `agent-tools/`, `packages/libs/`, and `packages/sdks/`; record dependency direction and non-goals before scaffolding."
    status: pending
  - id: wire-workspace-globs
    content: "Update package-manager workspace globs and repo docs so `agent-graphs/*` packages build/test like first-class workspaces."
    status: pending
  - id: create-practice-graph-home
    content: "Create `agent-graphs/practice-graph/` only when the Practice graph pilot promotes; keep this organisation plan doc-only until then."
    status: pending
  - id: document-tooling-adjacency
    content: "Document that `agent-tools/` owns command surfaces while `agent-graphs/` owns practice-facing graph libraries; no MCP/stdio/server code in graph libraries."
    status: pending
---

# Agent Graphs Workspace Organisation

## Intent

`practice-graph` is a graph consumer, but it is not curriculum substrate and it
is not an Oak curriculum SDK. Its natural home is adjacent to agent tooling:

```text
agent-tools/                  # command surfaces
agent-graphs/practice-graph/  # practice-facing graph library
```

This plan creates that organisation when the Practice graph pilot promotes.
The PR #102 closeout only records the topology decision; it does not scaffold
`agent-graphs/`, alter workspace globs, or add production code.

## Boundary

`agent-graphs/` workspaces may depend on the graph substrate (`graph-core`,
`graph-ingest`, `graph-project`) and may be consumed by `agent-tools/`.
Dependency direction is one-way:

```text
agent-tools -> agent-graphs/practice-graph -> graph substrate
```

`agent-graphs/` must not own CLI argument parsing, stdio/MCP server code,
canonical memory writes, or curriculum-specific corpus adapters. Those belong
to `agent-tools/`, application workspaces, shared-state workflows, or
`graph-corpus-sdk` respectively.

## Promotion Trigger

Promote this plan only when `practice-graph-payoff-peak-pilot.plan.md` is ready
to create its workspace. At promotion, update workspace globs, collection
README surfaces, and package-boundary docs in the same slice as the first
`agent-graphs/practice-graph/` scaffold.
