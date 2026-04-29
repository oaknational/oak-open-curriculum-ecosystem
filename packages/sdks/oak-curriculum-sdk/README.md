# Oak Curriculum SDK

TypeScript SDK for accessing Oak National Academy's Curriculum API. Generated, not hand-written — when the API schema changes, `pnpm sdk-codegen` regenerates all types, validators, and MCP tools automatically.

## Why This Exists

The SDK makes Oak's openly licenced, fully sequenced and resourced curriculum
usable by internal Oak teams and the wider education and technology sectors. It
is the typed foundation for direct API integration, generated MCP tools, and
the OpenAPI-to-MCP server pipeline. The aim is to provide a world-class
primitive that application builders can compose with MCP, hybrid semantic
search, and knowledge graph surfaces without copying Oak-specific schema logic.

## Installation

```bash
npm install @oaknational/curriculum-sdk
```

## Usage

```typescript
import { createOakClient } from '@oaknational/curriculum-sdk';

const client = createOakClient({
  apiKey: 'your-api-key',
  logger, // optional: enables response augmentation diagnostics
});

// List all subjects
const { data: subjects } = await client.GET('/api/v0/subjects');

// Get key stages for a subject
const { data: keyStages } = await client.GET('/api/v0/subjects/{subjectSlug}/key-stages', {
  params: { path: { subjectSlug: 'maths' } },
});

// Get lesson summary
const { data: lesson } = await client.GET(
  '/api/v0/key-stages/{keyStageSlug}/subjects/{subjectSlug}/lessons/{lessonSlug}/summary',
  {
    params: {
      path: { keyStageSlug: 'ks3', subjectSlug: 'maths', lessonSlug: 'add-two-numbers' },
    },
  },
);
```

The client is an [openapi-fetch](https://openapi-ts.dev/openapi-fetch/) instance — all paths are type-checked against the OpenAPI schema.

## Features

- Type-safe API client generated from the OpenAPI schema (paths, parameters, and responses are all checked at compile time)
- Automatic Oak URL (`oakUrl`) generation on responses via middleware
- Configurable rate limiting and retry with exponential backoff
- Shared validation helpers (`parseSchema`, `parseWithCurriculumSchema`, etc.) for safe parsing without manual assertions
- Runtime-agnostic design

## Logging

The SDK accepts an optional `logger` parameter for structured logging and response augmentation diagnostics. It integrates with `@oaknational/logger` for OpenTelemetry-compliant observability.

```typescript
import { createOakClient } from '@oaknational/curriculum-sdk';
import {
  UnifiedLogger,
  buildResourceAttributes,
  logLevelToSeverityNumber,
  normalizeError,
  parseLogLevel,
  startTimer,
  type LogSink,
} from '@oaknational/logger';
import { createNodeStdoutSink } from '@oaknational/logger/node';

const sinks: readonly LogSink[] = [createNodeStdoutSink()];
const logger = new UnifiedLogger({
  minSeverity: logLevelToSeverityNumber(parseLogLevel(process.env.LOG_LEVEL, 'INFO')),
  resourceAttributes: buildResourceAttributes(process.env, 'oak-curriculum-sdk-consumer', '1.0.0'),
  context: {},
  sinks,
  getActiveSpanContext: () => undefined,
});

const client = createOakClient({
  apiKey: 'your-api-key',
  logger,
});

const timer = startTimer();
const { data, error } = await client.GET('/api/v0/subjects');
const duration = timer.end();

if (error) {
  logger.error('Request failed', normalizeError(error), {
    duration: duration.formatted,
  });
} else {
  logger.info('Subjects fetched', {
    count: data.length,
    duration: duration.formatted,
  });
}
```

For comprehensive logging patterns, integration examples, and best practices, see the [Logging Guide](docs/logging-guide.md).

## Architecture Overview

This SDK implements the **OpenAPI-First Pipeline** pattern: everything is generated from the OpenAPI schema at compile time via a three-phase pipeline (type generation, Zod schema generation, MCP validator mapping). Zero runtime overhead for schema processing.

For the full architectural explanation, see [OpenAPI Pipeline Architecture](../../../docs/architecture/openapi-pipeline.md) and [SDK Architecture](docs/architecture.md).

ADRs define how the system should work and are the architectural source of truth. These ADRs are particularly relevant to SDK development — they explain why the SDK is generated rather than hand-written:

- [ADR-029](../../../docs/architecture/architectural-decisions/029-no-manual-api-data.md) — No manual API data structures
- [ADR-030](../../../docs/architecture/architectural-decisions/030-sdk-single-source-truth.md) — SDK as single source of truth
- [ADR-031](../../../docs/architecture/architectural-decisions/031-generation-time-extraction.md) — Generation-time extraction
- [ADR-035](../../../docs/architecture/architectural-decisions/035-unified-sdk-mcp-code-generation.md) — Unified SDK and MCP code generation
- [ADR-048](../../../docs/architecture/architectural-decisions/048-shared-parse-schema-helper.md) — Shared parsing helper pattern

See the [ADR index](../../../docs/architecture/architectural-decisions/) for the full list.

## Documentation

- [SDK Architecture](docs/architecture.md) — generation pipeline, canonical URLs, search tools, MCP tool generation, validation helpers, directory structure
- [SDK Docs Pipeline Guide](docs/docs-pipeline.md) — how to generate, verify, and extend HTML/JSON/MD/AI docs

## Development

```bash
pnpm install     # Install dependencies
pnpm test        # Run tests
pnpm build       # Build
pnpm type-check  # Type check
```

## Licence

MIT
