# SDK Architecture

Detailed architecture documentation for the Oak Curriculum SDK.

## Generation-Time vs Runtime Processing

This SDK implements a critical architectural principle: **all metadata extraction happens at build/generation time, not runtime**. This approach ensures maximum type safety and runtime performance.

### How it works

1. **Build Time**: The OpenAPI schema is fetched and processed to extract all metadata (paths, operations, parameters)
2. **Code Generation**: TypeScript code is generated as string literals containing pre-computed constants
3. **Runtime**: The SDK simply imports and uses these pre-generated, fully-typed constants

This means:

- Zero runtime overhead for schema processing
- Complete type safety without runtime type assertions
- The `as const` schema is used only for type definitions, never for runtime iteration
- All operations metadata is available as typed constants

### ADR Compliance — The Central Contract

This SDK implements the central contract that **if the API schema changes, the ONLY thing required is to rerun the SDK type generation**. All downstream consumers (like MCP servers) will automatically receive:

- Updated types and interfaces
- New/modified operations and parameters
- Validation rules from the schema
- All without ANY manual code changes

This is achieved through:

- **ADR-029**: No manual API data structures — everything flows from OpenAPI
- **ADR-030**: SDK as the single source of truth — consumers import SDK types directly
- **ADR-031**: Generation at build time — all transformations happen during SDK build

> **This SDK demonstrates the compile-time generation pattern that works for any OpenAPI-compliant API.** The same pattern can be applied to other APIs, different versions, or custom implementations. See [OpenAPI Pipeline Architecture](../../../../docs/architecture/openapi-pipeline.md) for how to extend this to new APIs.

### Key Components

- `src/client/` — Runtime client that uses the pre-generated types
- `src/types/` — Type re-exports from `@oaknational/sdk-codegen` and search response guards
- `src/mcp/` — MCP tool aggregation and universal tools

> **Note**: Code generation scripts and generated types live in
> `packages/sdks/oak-sdk-codegen/`, not in this package. This package
> is the runtime SDK that re-exports generated types and provides
> runtime client functionality.

## Canonical URL Generation

This SDK automatically generates canonical URLs for all curriculum resources at code-generation time. This eliminates the need for consuming applications to implement their own URL generation logic.

### How it works

1. **SDK-Codegen Time**: URL helpers are generated during `pnpm sdk-codegen` based on the OpenAPI schema
2. **Response Augmentation**: SDK client responses are augmented with `canonicalUrl` fields via response middleware when a concrete request URL is available; schema validation alone does not derive the URL
3. **Schema Decoration**: The OpenAPI schema is decorated to include `canonicalUrl` in response types
4. **Context-Aware**: URL generation uses response context (e.g., derived `sequenceSlug` for units) when available

### Example

```typescript
const lesson = await client.getLessonSummary('add-two-numbers');
console.log(lesson.canonicalUrl); // "https://www.thenational.academy/teachers/lessons/add-two-numbers"

const unit = await client.getUnitSummary('place-value');
console.log(unit.canonicalUrl); // "https://www.thenational.academy/teachers/curriculum/maths-primary/units/place-value"

const subject = await client.getSubject('maths');
console.log(subject.canonicalUrl); // "https://www.thenational.academy/teachers/key-stages/ks1/subjects/maths/programmes"
```

### URL Generation Features

- **Fail-Fast Design**: Missing context results in warnings, not broken URLs
- **Structured Logging**: Clear debugging information for URL generation issues
- **Type Safety**: All URL generation is fully typed based on the OpenAPI schema
- **Consistent Patterns**: All consuming applications generate identical canonical URLs

## Search Tools (Aggregated)

Three aggregated MCP tools expose the Search SDK's Elasticsearch-backed semantic search to agents and teachers:

| Tool                | Purpose                                                               | SDK Methods                                                                   |
| ------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `search`            | 5-scope semantic search (lessons, units, threads, sequences, suggest) | `searchLessons`, `searchUnits`, `searchThreads`, `searchSequences`, `suggest` |
| `browse-curriculum` | Faceted navigation without a search query                             | `fetchSequenceFacets`                                                         |
| `explore-topic`     | Compound parallel cross-scope discovery                               | `searchLessons` + `searchUnits` + `searchThreads` in parallel                 |

These tools consume a `SearchRetrievalService` interface defined in `src/mcp/search-retrieval-types.ts`. This interface is structurally compatible with the Search SDK's `RetrievalService` but does not import from it, avoiding a circular dependency between curriculum-sdk and oak-search-sdk. The MCP servers inject the concrete implementation when Elasticsearch credentials are available.

When `searchRetrieval` is not provided, the tools return a "not configured" error. All other tools continue to work normally.

## MCP Tool Generation

This SDK generates all MCP (Model Context Protocol) tool types at build time, making the entire SDK+MCP system a pure function of the OpenAPI schema. The generation happens in three phases:

1. **codegen.ts**: Extracts MCP tools from OpenAPI and generates basic types
2. **zodgen.ts**: Generates Zod schemas for runtime validation
3. **mcp-toolgen.ts**: Reads the actual Zod output and creates validator mappings

This ensures that MCP servers can import fully-typed tool definitions directly from the SDK:

```typescript
import {
  MCP_TOOLS_DATA,
  type McpToolName,
  type ToolParameters,
  validateToolResponse,
} from '@oaknational/curriculum-sdk';

const toolName: McpToolName = 'oak-get-sequences-units';

const params: ToolParameters<typeof toolName> = {
  sequence: 'maths-primary',
  year: '3',
};

const response = await fetchFromAPI(/* ... */);
const validated = validateToolResponse(toolName, response);
```

## Shared Validation Helpers

- `parseSchema` wraps `schema.safeParse`, returning a typed `ValidationResult` without `any` casts.
- `parseWithCurriculumSchema`, `parseWithCurriculumSchemaInstance`, `parseEndpointParameters`, and `parseSearchResponse` delegate to `parseSchema`, covering curriculum responses, request parameter maps, and search responses.
- `parseSearchSuggestionResponse` applies the same pattern for suggestions.

Downstream consumers **must** import these helpers rather than duplicating validation logic. If the OpenAPI schema changes, rerunning `pnpm sdk-codegen` updates the generated Zod schemas and the helpers continue to provide the correct `_input`/`_output` types.

## Architectural Decisions (Deep Dive)

This SDK follows several important architectural patterns documented in our ADRs:

- [ADR-026: OpenAPI Code Generation Strategy](../../../../docs/architecture/architectural-decisions/026-openapi-code-generation-strategy.md) — How we generate types from OpenAPI
- [ADR-029: No Manual API Data](../../../../docs/architecture/architectural-decisions/029-no-manual-api-data.md) — All API data comes from the OpenAPI schema
- [ADR-030: SDK as Single Source of Truth](../../../../docs/architecture/architectural-decisions/030-sdk-single-source-truth.md) — The SDK is the authoritative source for API types
- [ADR-031: Generation-Time Extraction](../../../../docs/architecture/architectural-decisions/031-generation-time-extraction.md) — Metadata extraction happens at build time, not runtime
- [ADR-035: Unified SDK-MCP Code Generation](../../../../docs/architecture/architectural-decisions/035-unified-sdk-mcp-code-generation.md) — MCP tool types flow from the SDK
- [ADR-047: Canonical URL Generation at Code-Gen Time](../../../../docs/architecture/architectural-decisions/047-canonical-url-generation-at-codegen-time.md) — Automatic canonical URL generation in all responses
- [ADR-048: Shared Parse Schema Helper](../../../../docs/architecture/architectural-decisions/048-shared-parse-schema-helper.md) — Describes how `parseSchema` validates curriculum/search requests and responses

## Directory Structure

```text
oak-curriculum-sdk/
├── src/
│   ├── client/            # Runtime API client (createOakClient, etc.)
│   ├── response-augmentation.ts # Automatic canonical URL augmentation
│   ├── mcp/               # MCP tool aggregation and universal tools
│   ├── public/            # Public API surface re-exports
│   └── types/             # Type re-exports from sdk-codegen
├── docs/                  # Authored and generated package documentation
└── dist/                  # Built output
```
