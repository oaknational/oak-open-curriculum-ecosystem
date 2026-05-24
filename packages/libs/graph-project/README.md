# @oaknational/graph-project

Property-graph projection over RDF datasets for the graph stack. Provides
PropertyGraph type definitions, the `toPropertyGraph` projection function
from RDF Dataset to property-graph view, and adjacency primitives over the
projected nodes-and-edges.

The property-graph projection is **derived, not canonical**: the RDF
Dataset (owned by `graph-core/dataset`) remains the source of truth, and
the projection MUST be reconstructable from it. See the §Test discipline
invariant #6 in `graph-stack.plan.md` for the round-trip contract.

## Status

Inc.1a WS3.1 establishes the scaffold only. The first product code and
tests land in WS3.2 with the `toPropertyGraph` projection (load-bearing
for invariant #6) and in WS3.3 with adjacency primitives.

## Architectural decisions

- ADR-173 — graph stack topology.
- ADR-179 — transport-agnostic graph substrate.

## Sub-path exports

- `@oaknational/graph-project/property-graph` — PropertyGraph type
  definitions (Node, Edge, PropertyGraph).
- `@oaknational/graph-project/projection` — `toPropertyGraph` projection
  function (RDF Dataset → PropertyGraph).
- `@oaknational/graph-project/adjacency` — adjacency primitives
  (incoming, outgoing, neighbours) over the projected property-graph.

Each sub-path is pre-declared so later projection and adjacency cycles
can target stable entrypoints without package.json churn. The
`property-graph` sub-path holds only types so that `adjacency` does not
depend on `projection` — adjacency operates on PropertyGraph regardless
of how it was constructed.

## Scripts

```bash
pnpm --filter @oaknational/graph-project type-check
pnpm --filter @oaknational/graph-project lint
pnpm --filter @oaknational/graph-project test
pnpm --filter @oaknational/graph-project build
```

## License

MIT
