# Oak Curriculum SDK

TypeScript SDK for accessing Oak National Academy's Curriculum API.

## Overview

This SDK provides a type-safe, runtime-agnostic client for the Oak Curriculum API. It is designed to be reusable across different environments and applications.

## Architecture

### Generation-Time vs Runtime Processing

This SDK implements a critical architectural principle: **all metadata extraction happens at build/generation time, not runtime**. This approach ensures maximum type safety and runtime performance.

#### How it works:

1. **Build Time**: The OpenAPI schema is fetched and processed to extract all metadata (paths, operations, parameters)
2. **Code Generation**: TypeScript code is generated as string literals containing pre-computed constants
3. **Runtime**: The SDK simply imports and uses these pre-generated, fully-typed constants

This means:

- Zero runtime overhead for schema processing
- Complete type safety without runtime type assertions
- The `as const` schema is used only for type definitions, never for runtime iteration
- All operations metadata is available as typed constants

#### ADR Compliance - The Central Contract

This SDK implements the central contract that **if the API schema changes, the ONLY thing required is to rerun the SDK type generation**. All downstream consumers (like MCP servers) will automatically receive:

- Updated types and interfaces
- New/modified operations and parameters
- Validation rules from the schema
- All without ANY manual code changes

This is achieved through:

- **ADR-029**: No manual API data structures - everything flows from OpenAPI
- **ADR-030**: SDK as the single source of truth - consumers import SDK types directly
- **ADR-031**: Generation at build time - all transformations happen during SDK build

#### Key Components:

- `type-gen/` - Build-time generation scripts that extract metadata from OpenAPI
- `type-gen/mcp-toolgen.ts` - Post-zodgen script that maps MCP tools to actual Zod validators
- `src/types/generated/` - Generated TypeScript types and constants (do not edit manually)
- `src/client/` - Runtime client that uses the pre-generated types
- `src/tool-generation/` - Exports for programmatic tool generation (e.g., MCP servers)

### Canonical URL Generation

This SDK automatically generates canonical URLs for all curriculum resources at type-generation time. This eliminates the need for consuming applications to implement their own URL generation logic.

#### How it works:

1. **Type-Gen Time**: URL helpers are generated during `pnpm type-gen` based on the OpenAPI schema
2. **Response Augmentation**: All API responses are automatically augmented with `canonicalUrl` fields
3. **Schema Decoration**: The OpenAPI schema is decorated to include `canonicalUrl` in response types
4. **Context-Aware**: URL generation uses response context (e.g., subject/phase for units) when available

#### Example:

```typescript
// All responses automatically include canonical URLs
const lesson = await client.getLessonSummary('add-two-numbers');
console.log(lesson.canonicalUrl); // "https://www.thenational.academy/teachers/lessons/add-two-numbers"

const unit = await client.getUnitSummary('place-value');
console.log(unit.canonicalUrl); // "https://www.thenational.academy/teachers/programmes/maths-ks1/units/place-value"

// Context is automatically extracted from response data
const subject = await client.getSubject('maths');
console.log(subject.canonicalUrl); // "https://www.thenational.academy/teachers/key-stages/ks1/subjects/maths/programmes"
```

#### URL Generation Features:

- **Fail-Fast Design**: Missing context results in warnings, not broken URLs
- **Structured Logging**: Clear debugging information for URL generation issues
- **Type Safety**: All URL generation is fully typed based on the OpenAPI schema
- **Consistent Patterns**: All consuming applications generate identical canonical URLs

### MCP Tool Generation

This SDK now generates all MCP (Model Context Protocol) tool types at build time, making the entire SDK+MCP system a pure function of the OpenAPI schema. The generation happens in three phases:

1. **typegen.ts**: Extracts MCP tools from OpenAPI and generates basic types
2. **zodgen.ts**: Generates Zod schemas for runtime validation
3. **mcp-toolgen.ts**: Reads the actual Zod output and creates validator mappings

This ensures that MCP servers can import fully-typed tool definitions directly from the SDK:

```typescript
import {
  MCP_TOOLS_DATA,
  type McpToolName,
  type ToolParameters,
  validateToolResponse,
} from '@oaknational/oak-curriculum-sdk';

// All tool names are literal types
const toolName: McpToolName = 'oak-get-sequences-units';

// Parameters are fully typed based on the tool
const params: ToolParameters<typeof toolName> = {
  sequence: 'maths-primary',
  year: '3',
};

// Runtime validation with Zod
const response = await fetchFromAPI(/* ... */);
const validated = validateToolResponse(toolName, response);
```

### Architectural Decisions

This SDK follows several important architectural patterns documented in our ADRs:

- [ADR-026: OpenAPI Type Generation Strategy](../../docs/architecture/architectural-decisions/026-openapi-type-generation-strategy.md) - How we generate types from OpenAPI
- [ADR-029: No Manual API Data](../../docs/architecture/architectural-decisions/029-no-manual-api-data.md) - All API data comes from the OpenAPI schema
- [ADR-030: SDK as Single Source of Truth](../../docs/architecture/architectural-decisions/030-sdk-single-source-truth.md) - The SDK is the authoritative source for API types
- [ADR-031: Generation-Time Extraction](../../docs/architecture/architectural-decisions/031-generation-time-extraction.md) - Metadata extraction happens at build time, not runtime
- [ADR-035: Unified SDK-MCP Type Generation](../../docs/architecture/architectural-decisions/035-unified-sdk-mcp-type-generation.md) - MCP tool types flow from the SDK
- [ADR-047: Canonical URL Generation at Type-Gen Time](../../docs/architecture/architectural-decisions/047-canonical-url-generation-at-typegen-time.md) - Automatic canonical URL generation in all responses

### Directory Structure

```text
oak-curriculum-sdk/
├── type-gen/
│   ├── typegen.ts         # Phase 1: OpenAPI type generation
│   ├── zodgen.ts          # Phase 2: Zod schema generation
│   ├── mcp-toolgen.ts     # Phase 3: MCP validator mapping
│   ├── operations/        # Extract and generate operation constants
│   ├── parameters/        # Extract and generate parameter constants
│   ├── paths/             # Extract and generate path constants
│   ├── routing/           # Generate canonical URL helpers
│   ├── mcp-tools/         # MCP tool type generation
│   └── lib/               # Shared helpers for generation
├── src/
│   ├── client/            # Runtime API client
│   ├── response-augmentation.ts # Automatic canonical URL augmentation
│   ├── types/
│   │   └── generated/     # Generated types (DO NOT EDIT)
│   │       ├── api-schema/       # OpenAPI types and constants
│   │       │   ├── mcp-tools.ts      # MCP tool definitions
│   │       │   ├── mcp-parameters.ts # MCP parameter types
│   │       │   ├── mcp-validators.ts # MCP validators
│   │       │   └── routing/          # Canonical URL generation
│   │       │       └── url-helpers.ts # Generated URL helper functions
│   │       └── zod/              # Zod validation schemas
│   └── tool-generation/   # Exports for programmatic tool generation
└── dist/                  # Built output
```

## Installation

```bash
npm install @oaknational/oak-curriculum-sdk
```

## Usage

```typescript
import { OakCurriculumClient } from '@oaknational/oak-curriculum-sdk';

const client = new OakCurriculumClient({
  apiKey: process.env.OAK_API_KEY,
  baseUrl: 'https://api.oak.academy',
  timeout: 5000,
  retries: 3,
});

// Search for lessons
const lessons = await client.searchLessons({
  subject: 'maths',
  keyStage: 'ks3',
  query: 'algebra',
});

// Get lesson details
const lesson = await client.getLesson('lesson-id');

// List units in a programme
const units = await client.listUnits('programme-id');
```

## Features

- Type-safe API methods
- **Automatic canonical URL generation** - All responses include canonical URLs
- Automatic retry with exponential backoff
- Response caching
- Error handling with detailed messages
- Runtime-agnostic design

## Documentation

- SDK Docs Pipeline Guide: `packages/oak-curriculum-sdk/docs/docs-pipeline.md` — how to generate, verify, and extend HTML/JSON/MD/AI docs.

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build
pnpm build

# Type check
pnpm type-check
```

## License

MIT
