# @oaknational/graph-core

RDF/JS-aligned graph primitives: `Term`, `Dataset`, JSON-LD 1.1 wrappers,
RDF dataset canonicalisation, and a vocabulary registry. Transport-agnostic;
consumed by `graph-ingest`, `graph-project`, and `graph-corpus-sdk`.

## Status

Landed capability: the RDF Term union plus `Quad`, DataFactory
constructors, the DatasetCore-compatible in-memory dataset surface, the
JSON-LD 1.1 processor with remote-context handling, RDFC-1.0 dataset
canonicalisation, and the vocabulary registry.

## Architectural decisions

- ADR-173 — graph stack topology.
- ADR-179 — transport-agnostic graph substrate.
- ADR-221 — the estate knowledge graph (consumer domain; adds thin
  mount/strip combinators and per-node canonical fingerprints here).

## Sub-path exports

- `@oaknational/graph-core/term`
- `@oaknational/graph-core/data-factory`
- `@oaknational/graph-core/dataset`
- `@oaknational/graph-core/jsonld`
- `@oaknational/graph-core/canon`
- `@oaknational/graph-core/vocab`

Each sub-path is pre-declared so consumers can target a stable import
shape from WS1.2 onward without further package.json churn.

## Scripts

```bash
pnpm --filter @oaknational/graph-core type-check
pnpm --filter @oaknational/graph-core lint
pnpm --filter @oaknational/graph-core test
pnpm --filter @oaknational/graph-core build
```

## License

MIT
