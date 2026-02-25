# @oaknational/curriculum-sdk-generation

Generation-time workspace for the Oak Curriculum SDK, implementing
[ADR-108 Step 1](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md).

## Status

**Phases 0–5 complete** — workspace hosts both data pipelines (API
and bulk), all generated artefacts, 11 subpath exports, and ESLint
boundary rules. Phases 6–7 (documentation alignment, CI drift
check) remain.

## Two Data Pipelines

This workspace hosts two internally partitioned data pipelines
that run during `pnpm type-gen`:

- **API pipeline** (`type-gen/`, `schema-cache/`,
  `src/types/generated/`): OpenAPI spec to TypeScript types, Zod
  schemas, and MCP tool descriptors. Consumed by the curriculum
  SDK runtime and MCP server apps.

- **Bulk pipeline** (`vocab-gen/`, `src/bulk/`,
  `src/generated/vocab/`): bulk download JSON files to types,
  extractors, Elasticsearch mappings, knowledge graphs, and
  vocabulary artefacts. Consumed by the search SDK and search CLI.

## Subpath Exports

Generated artefacts are exposed through subpath exports rather than a
single monolithic barrel. Subpaths are one level deep only.

| Subpath                                                   | Domain                                               | Barrel                    |
| --------------------------------------------------------- | ---------------------------------------------------- | ------------------------- |
| `@oaknational/curriculum-sdk-generation`                  | curated subset                                       | `src/index.ts`            |
| `@oaknational/curriculum-sdk-generation/api-schema`       | API types, paths, routing, validation, errors        | `src/api-schema.ts`       |
| `@oaknational/curriculum-sdk-generation/mcp-tools`        | tool descriptors, execution, stubs, scopes           | `src/mcp-tools.ts`        |
| `@oaknational/curriculum-sdk-generation/search`           | index docs, scopes, facets, suggestions, ES mappings | `src/search.ts`           |
| `@oaknational/curriculum-sdk-generation/zod`              | Zod schemas                                          | `src/zod.ts`              |
| `@oaknational/curriculum-sdk-generation/bulk`             | bulk pipeline APIs, schemas, types                   | `src/bulk.ts`             |
| `@oaknational/curriculum-sdk-generation/vocab`            | static graph data, ontology, mined synonyms          | `src/vocab.ts`            |
| `@oaknational/curriculum-sdk-generation/query-parser`     | query parser types                                   | `src/query-parser.ts`     |
| `@oaknational/curriculum-sdk-generation/observability`    | zero-hit telemetry                                   | `src/observability.ts`    |
| `@oaknational/curriculum-sdk-generation/admin`            | admin fixtures                                       | `src/admin.ts`            |
| `@oaknational/curriculum-sdk-generation/widget-constants` | widget URI                                           | `src/widget-constants.ts` |

## Boundary Rules

Enforced by ESLint SDK boundary rules (`createSdkBoundaryRules`
in `@oaknational/eslint-plugin-standards`):

- **This workspace cannot import from the runtime SDK**
  (`@oaknational/curriculum-sdk`). The dependency direction is
  one-way: runtime depends on generation, not vice versa.

- **Consumers must use barrel imports only** via the subpath
  exports listed above. Deep paths into internal directories are
  blocked by the `@oaknational/curriculum-sdk-generation/*/**`
  ESLint pattern.

## Scripts

```bash
pnpm build        # Build with tsup + tsc declarations
pnpm clean        # Remove dist and turbo cache
pnpm type-gen     # Regenerate types from OpenAPI schema (runs generate:clean first)
pnpm type-check   # Type-check without emitting
pnpm lint         # Lint with ESLint
pnpm lint:fix     # Lint and auto-fix
pnpm test         # Run tests
```

### `generate:clean` caveat

`generate:clean` removes `src/types/generated/` before regeneration. If
`type-gen` fails after the clean step, the workspace is left without
generated artefacts and will not compile. Re-run `pnpm type-gen` from the
repo root to recover. A future improvement could use atomic
write-to-temp-then-rename to prevent this intermediate broken state.

## References

- [ADR-108: SDK Workspace Decomposition](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md)
- [ADR-065: Turbo Task Dependencies](../../../docs/architecture/architectural-decisions/065-turbo-task-dependencies.md)
- [ADR-086: Vocab Mining and Graph Export](../../../docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md)
- [SDK Workspace Separation Plan](../../../.agent/plans/semantic-search/active/sdk-workspace-separation.md)
