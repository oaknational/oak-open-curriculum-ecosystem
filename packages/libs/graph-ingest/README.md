# @oaknational/graph-ingest

Transport-agnostic graph ingestion modes and source mapping primitives for the
graph stack. Oak-specific corpus mapping belongs in `graph-corpus-sdk`; this
workspace remains a reusable substrate library.

## Status

Landed capability: `jsonld-compatible` ingestion, generic Turtle
parsing, and source-path mapping. The remaining declared sub-paths
(`strict-jsonld`, `plain-json-tree`, `records`, `node-edge-list`,
`custom-mapping`) are pre-declared entrypoints whose implementations
have not landed.

## Architectural decisions

- ADR-173 — graph stack topology.
- ADR-179 — transport-agnostic graph substrate.
- ADR-221 — the estate knowledge graph (adds the front-matter → quads
  ingestion mode here).

## Sub-path exports

- `@oaknational/graph-ingest/strict-jsonld`
- `@oaknational/graph-ingest/jsonld-compatible`
- `@oaknational/graph-ingest/plain-json-tree`
- `@oaknational/graph-ingest/records`
- `@oaknational/graph-ingest/node-edge-list`
- `@oaknational/graph-ingest/custom-mapping`

Each sub-path is pre-declared so later ingestion cycles can target stable
entrypoints without package.json churn.

## Scripts

```bash
pnpm --filter @oaknational/graph-ingest type-check
pnpm --filter @oaknational/graph-ingest lint
pnpm --filter @oaknational/graph-ingest test
pnpm --filter @oaknational/graph-ingest build
```

## License

MIT
