# Extension Points

Practical guidance for adding new capabilities to the Oak MCP Ecosystem.

## Adding New MCP Tools

MCP tools are generated from the OpenAPI schema — you do not write tool definitions by hand. When a new API endpoint appears in the upstream OpenAPI specification, `pnpm type-gen` generates the corresponding MCP tool automatically.

### Generated tools (from the API)

1. The upstream OpenAPI schema gains a new endpoint
2. Run `pnpm type-gen` — the generator in `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/` produces tool metadata, Zod validators, input/output types, and execution helpers
3. The generated tools appear in `src/types/generated/api-schema/mcp-tools/`
4. MCP servers automatically pick up the new tool from `MCP_TOOL_DESCRIPTORS`
5. Run `pnpm build && pnpm test` to verify

**Key files**:

- Generator templates: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/`
- Generated output: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/`
- Descriptor map: `MCP_TOOL_DESCRIPTORS` in the generated output
- Schema-first execution: see [schema-first-execution.md](../../.agent/directives/schema-first-execution.md)
- Pipeline constraints and edge cases: see [Known Constraints and Limitations](../architecture/openapi-pipeline.md#known-constraints-and-limitations)

### Aggregated tools (combining multiple API calls)

For tools that combine multiple API calls or add natural-language processing:

1. Define the tool in `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts`
2. Add to `AGGREGATED_TOOL_DEFS` — the type `AggregatedToolName` automatically extends
3. Implement the handler (aggregated tools return `Promise<CallToolResult>` directly)
4. Register in the MCP server's tool registration
5. Write tests at all levels (unit, integration, E2E)

**Relevant ADRs**: [ADR-107](../architecture/architectural-decisions/107-deterministic-sdk-nl-in-mcp-boundary.md) (deterministic SDK / NL-in-MCP boundary)

## Adding New Search Indices

The semantic search system uses Elasticsearch Serverless with ELSER embeddings.

1. **Define the index mapping** — Create a mapping generator in the SDK that produces Elasticsearch mappings from the curriculum data model
2. **Create the ingestion pipeline** — Add ingestion logic in `apps/oak-search-cli/` that transforms curriculum data into indexable documents
3. **Add ground truths** — Design ground truth queries using the known-answer-first methodology (see [Ground Truth Protocol](../../apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md))
4. **Run benchmarks** — Use `pnpm benchmark` to evaluate search quality (MRR, NDCG@10)
5. **Wire into search dispatch** — Add the new index to the search dispatch configuration

**Key files**:

- Search SDK: `packages/sdks/oak-search-sdk/`
- Search CLI: `apps/oak-search-cli/`
- Ground truths: `apps/oak-search-cli/src/lib/search-quality/ground-truth/`
- Architecture: `apps/oak-search-cli/docs/ARCHITECTURE.md`

**Relevant ADRs**: [ADR-074](../architecture/architectural-decisions/074-elastic-native-first-philosophy.md) (Elastic-native first), [ADR-076](../architecture/architectural-decisions/076-elser-only-embedding-strategy.md) (ELSER-only embeddings)

## Extending the SDK With New Helpers

The SDK exports validation helpers, type guards, and parsing functions. To add new ones:

1. Write unit tests first (TDD)
2. Implement the helper as a pure function
3. Export from the appropriate `index.ts` (e.g., `src/validation/index.ts` for validators)
4. Run `pnpm doc-gen` to generate API documentation
5. Update the SDK README if the helper is part of the public API

**Key patterns**:

- Validation helpers use `schema.safeParse` and return `ValidationResult`
- Type guards narrow to specific generated types
- New helpers must be tested against real API response shapes, not hand-crafted fixtures

**Relevant ADRs**: [ADR-048](../architecture/architectural-decisions/048-shared-parse-schema-helper.md) (shared parsing helper)

## Adding New Core Packages

Core packages live in `packages/core/` and provide foundational abstractions.

1. **Create the workspace**:

   ```bash
   mkdir -p packages/core/your-package/src
   ```

2. **Set up `package.json`** with `workspace:^` dependencies and `"version": "0.0.0-development"` for semantic-release
3. **Add to `pnpm-workspace.yaml`** — the workspace must be listed
4. **Configure `turbo.json`** — ensure build tasks respect the dependency graph
5. **Set up ESLint** — import the shared ESLint config from `packages/core/oak-eslint`
6. **Respect layer boundaries** — core packages must not import from `sdks/` or `apps/`. Import direction: `core → libs → sdks → apps`
7. **Write tests** — TDD at all levels
8. **Add a README** — document the package purpose, API, and usage

**Relevant ADRs**: [ADR-041](../architecture/architectural-decisions/041-workspace-structure-option-a.md) (workspace structure)

## General Principles

Regardless of what you are adding:

- **Write tests first** — TDD at all levels (unit, integration, E2E where applicable)
- **Types flow from the schema** — Do not create ad-hoc types; derive from generated contracts
- **Fail fast** — Validate inputs, return `Result<T, E>`, never silently ignore errors
- **Document** — TSDoc on all public interfaces, update the workspace README, create ADRs for significant decisions
- **Run quality gates** — `pnpm make` after changes, `pnpm qg` before pushing
- **See [Build System](./build-system.md)** for the single source of truth on commands and gate ordering
