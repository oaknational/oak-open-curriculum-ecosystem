# @oaknational/graph-corpus-sdk

Oak's typed corpus-adapter SDK. Provides `GraphView` adapters over Oak's
evidence and curriculum corpora — starting with EEF strands and the Oak
Curriculum Ontology Threads graph, with prerequisite and misconception
adapters following in Increment 3.

Transport-agnostic per
[ADR-179](../../../docs/architecture/architectural-decisions/179-transport-agnostic-graph-substrate.md):
this package ships no MCP, HTTP, or CLI types. Surfacing graph capability
through any transport is a consumer-side concern handled by the curriculum
SDK MCP module and the curriculum MCP HTTP app, or by future consumer
workspaces that import this SDK.

## Status

Scaffold-only. Public surface consists of three pre-declared barrel exports;
adapters are added in follow-on cycles tracked by the relevant plan estate.

## Architectural decisions

- [ADR-154](../../../docs/architecture/architectural-decisions/154-separate-framework-from-consumer.md)
  — framework / consumer separation.
- [ADR-157](../../../docs/architecture/architectural-decisions/157-multi-source-open-education-integration.md)
  — multi-source open-education integration.
- [ADR-173](../../../docs/architecture/architectural-decisions/173-graph-stack-topology.md)
  — graph stack topology.
- [ADR-179](../../../docs/architecture/architectural-decisions/179-transport-agnostic-graph-substrate.md)
  — transport-agnostic graph substrate.

## Sub-path exports

- `@oaknational/graph-corpus-sdk` — root barrel.
- `@oaknational/graph-corpus-sdk/eef-strands` — EEF strands adapter surface.
- `@oaknational/graph-corpus-sdk/threads` — Oak Curriculum Ontology Threads adapter surface.

Each sub-path is pre-declared so consumers can target a stable import
shape without further `package.json` churn as adapters land.

## Scripts

```bash
pnpm --filter @oaknational/graph-corpus-sdk type-check
pnpm --filter @oaknational/graph-corpus-sdk lint
pnpm --filter @oaknational/graph-corpus-sdk test
pnpm --filter @oaknational/graph-corpus-sdk build
```

## License

MIT
