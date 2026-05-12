# @oaknational/graph-core

RDF/JS-aligned graph primitives: `Term`, `Dataset`, JSON-LD 1.1 wrappers,
RDF dataset canonicalisation, and a vocabulary registry. Transport-agnostic;
consumed by `graph-ingest`, `graph-project`, and `graph-corpus-sdk`.

## Status

Scaffold cycle (Inc.1a WS1.1). All sub-path entries are empty barrels
(`export {};`); the first real types and tests land in WS1.2 (`Term`
union + `Quad`).

## Architectural decisions

- ADR-173 — graph stack topology.
- ADR-179 — transport-agnostic graph substrate.

## Sub-path exports

- `@oaknational/graph-core/term`
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
