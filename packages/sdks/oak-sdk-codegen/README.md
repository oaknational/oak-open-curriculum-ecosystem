# @oaknational/sdk-codegen

Generation-time workspace for the Oak Curriculum SDK, implementing
[ADR-108 Step 1](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md).

## Status

**Phases 0–6 complete** — workspace hosts both data pipelines (API
and bulk), all generated artefacts, 11 subpath exports, and ESLint
boundary rules. Phase 7 (CI drift check) remains.

## Two Data Pipelines

This workspace hosts two internally partitioned data pipelines
that run during `pnpm sdk-codegen`:

- **API pipeline** (`code-generation/`, `schema-cache/`,
  `src/types/generated/`): OpenAPI spec to TypeScript types, Zod
  schemas, and MCP tool descriptors. Consumed by the curriculum
  SDK runtime and MCP server apps.

- **Bulk pipeline** (`vocab-gen/`, `src/bulk/`,
  `src/generated/vocab/`): bulk download JSON files to types,
  extractors, Elasticsearch mappings, knowledge graphs, and
  vocabulary artefacts. Consumed by the search SDK and search CLI.

### Typegen vs codegen naming

Within `code-generation/`, modules are named by responsibility:

- **`typegen-*`** — type-focused: extract and emit TypeScript types from the
  OpenAPI schema (`typegen-extraction.ts`, `typegen-writers.ts`,
  `typegen-interface-gen.ts`, etc.)
- **`codegen-*`** — orchestration and broad code generation: entry point,
  pipeline coordination, validators, MCP tools (`codegen.ts`, `codegen-core.ts`,
  etc.)
- **`typegen/`** — directory of generator templates (paths, parameters, mcp-tools)

## Subpath Exports

Generated artefacts are exposed through subpath exports rather than a
single monolithic barrel. Subpaths are one level deep only.

| Subpath                                     | Domain                                               | Barrel                    |
| ------------------------------------------- | ---------------------------------------------------- | ------------------------- |
| `@oaknational/sdk-codegen`                  | curated subset                                       | `src/index.ts`            |
| `@oaknational/sdk-codegen/api-schema`       | API types, paths, routing, validation, errors        | `src/api-schema.ts`       |
| `@oaknational/sdk-codegen/mcp-tools`        | tool descriptors, execution, stubs, scopes           | `src/mcp-tools.ts`        |
| `@oaknational/sdk-codegen/search`           | index docs, scopes, facets, suggestions, ES mappings | `src/search.ts`           |
| `@oaknational/sdk-codegen/zod`              | Zod schemas                                          | `src/zod.ts`              |
| `@oaknational/sdk-codegen/bulk`             | bulk pipeline APIs, schemas, types                   | `src/bulk.ts`             |
| `@oaknational/sdk-codegen/vocab`            | types, concept graph ontology                        | `src/vocab.ts`            |
| `@oaknational/sdk-codegen/vocab-data`       | runtime graph data (large generated structures)      | `src/vocab-data.ts`       |
| `@oaknational/sdk-codegen/query-parser`     | query parser types                                   | `src/query-parser.ts`     |
| `@oaknational/sdk-codegen/observability`    | zero-hit telemetry                                   | `src/observability.ts`    |
| `@oaknational/sdk-codegen/admin`            | admin fixtures                                       | `src/admin.ts`            |
| `@oaknational/sdk-codegen/widget-constants` | widget URI                                           | `src/widget-constants.ts` |

## Boundary Rules

Enforced by ESLint SDK boundary rules (`createSdkBoundaryRules`
in `@oaknational/eslint-plugin-standards`):

- **This workspace cannot import from the runtime SDK**
  (`@oaknational/curriculum-sdk`). The dependency direction is
  one-way: runtime depends on generation, not vice versa.

- **Consumers must use barrel imports only** via the subpath
  exports listed above. Deep paths into internal directories are
  blocked by the `@oaknational/sdk-codegen/*/**`
  ESLint pattern.

## Scripts

```bash
pnpm build        # Build with tsup + tsc declarations
pnpm clean        # Remove dist and turbo cache
pnpm sdk-codegen  # Regenerate types from OpenAPI schema (runs generate:clean first)
pnpm type-check   # Type-check without emitting
pnpm lint         # Lint with ESLint
pnpm lint:fix     # Lint and auto-fix
pnpm scan:sitemap # Refresh canonical URL sitemap reference data
pnpm test         # Run tests
```

### `generate:clean` caveat

`generate:clean` removes `src/types/generated/` before regeneration. If
`sdk-codegen` fails after the clean step, the workspace is left without
generated artefacts and will not compile. Re-run `pnpm sdk-codegen` from the
repo root to recover. A future improvement could use atomic
write-to-temp-then-rename to prevent this intermediate broken state.

## Design Decisions

Evaluated during Phase 6 of [ADR-108](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md).

### F12 — Barrel auto-generation

**Decision: keep manual.** Barrel files (`src/mcp-tools.ts`, `src/search.ts`,
etc.) are maintained by hand. Auto-generating them was evaluated and
rejected: the barrels are few (11), change infrequently, and manually
curating named exports prevents accidental public-API expansion. When
adding generated artefacts, update the corresponding barrel file and
run `pnpm build` to verify the export map.

### F13 — Subpath granularity

**Decision: keep as-is.** Each subpath currently exports 8–18 symbols,
which balances discoverability against import specificity. Splitting
further (e.g. per-tool subpaths) was evaluated and rejected: it would
multiply configuration surface in `package.json` exports without
meaningful tree-shaking benefit, since consumers already import only
the symbols they need from each barrel.

### F14 — OakApiPathBasedClient

**Decision: keep in codegen.** `OakApiPathBasedClient` is a
schema-derived type (parameterised over generated API paths) and
belongs in the generation workspace. It was evaluated for migration
to the runtime SDK but rejected because the type's definition depends
on generated path literals that are only available at codegen time.

## References

- [ADR-108: SDK Workspace Decomposition](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md)
- [ADR-065: Turbo Task Dependencies](../../../docs/architecture/architectural-decisions/065-turbo-task-dependencies.md)
- [ADR-086: Vocab Mining and Graph Export](../../../docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md)
- [SDK Workspace Separation Plan](../../../.agent/plans/semantic-search/archive/completed/sdk-workspace-separation.md) (archived)
