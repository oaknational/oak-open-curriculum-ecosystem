# @oaknational/curriculum-sdk-generation

Generation-time workspace for the Oak Curriculum SDK, implementing
[ADR-108 Step 1](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md).

## Status

**Phase 1 scaffold** — workspace structure is in place. Content
(type-gen, vocab-gen, generated types, bulk infrastructure) will
be moved from `@oaknational/curriculum-sdk` in subsequent phases.

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

## Boundary Rules

Enforced by ESLint SDK boundary rules (`createSdkBoundaryRules`
in `@oaknational/eslint-plugin-standards`):

- **This workspace cannot import from the runtime SDK**
  (`@oaknational/curriculum-sdk`). The dependency direction is
  one-way: runtime depends on generation, not vice versa.

- **Consumers must use barrel imports only**
  (`@oaknational/curriculum-sdk-generation`), not deep paths
  into internal directories.

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
