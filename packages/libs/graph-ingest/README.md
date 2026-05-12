# @oaknational/graph-ingest

Transport-agnostic graph ingestion modes and source mapping primitives for the
graph stack. Oak-specific corpus mapping belongs in `graph-corpus-sdk`; this
workspace remains a reusable substrate library.

## Status

Inc.1a WS2.1 establishes the scaffold only. The first product code and tests
land in WS2.2 with `jsonld-compatible` ingestion and generic Turtle/SKOS
parsing.

## Architectural decisions

- ADR-173 — graph stack topology.
- ADR-179 — transport-agnostic graph substrate.

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
