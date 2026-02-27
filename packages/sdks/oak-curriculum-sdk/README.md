# Oak Curriculum SDK

TypeScript SDK for accessing Oak National Academy's Curriculum API. Generated, not hand-written — when the API schema changes, `pnpm sdk-codegen` regenerates all types, validators, and MCP tools automatically.

## Installation

```bash
npm install @oaknational/curriculum-sdk
```

## Usage

```typescript
import { OakCurriculumClient } from '@oaknational/curriculum-sdk';

const client = new OakCurriculumClient({
  apiKey: process.env.OAK_API_KEY,
  baseUrl: 'https://api.oak.academy',
  timeout: 5000,
  retries: 3,
  logger, // optional: enables response augmentation diagnostics
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

// All responses include canonical URLs automatically
const summary = await client.getLessonSummary('add-two-numbers');
console.log(summary.canonicalUrl);
```

## Features

- Type-safe API methods generated from the OpenAPI schema
- Automatic canonical URL generation on all responses
- Automatic retry with exponential backoff
- Response caching
- Error handling with detailed messages
- Runtime-agnostic design
- Shared validation helpers (`parseSchema`, `parseWithCurriculumSchema`, etc.) for safe parsing without manual assertions

## Logging

The SDK integrates with `@oaknational/logger` to provide OpenTelemetry-compliant structured logging, request tracing, and observability.

```typescript
import { OakCurriculumClient } from '@oaknational/curriculum-sdk';
import {
  UnifiedLogger,
  startTimer,
  parseLogLevel,
  logLevelToSeverityNumber,
  buildResourceAttributes,
} from '@oaknational/logger';
import { createNodeStdoutSink } from '@oaknational/logger/node';

const level = parseLogLevel(process.env.LOG_LEVEL, 'INFO');
const logger = new UnifiedLogger({
  minSeverity: logLevelToSeverityNumber(level),
  resourceAttributes: buildResourceAttributes(process.env, 'my-app', '1.0.0'),
  context: {},
  stdoutSink: createNodeStdoutSink(),
  fileSink: null,
});

const client = new OakCurriculumClient({ apiKey: process.env.OAK_API_KEY });

const timer = startTimer();
try {
  const lessons = await client.searchLessons({ subject: 'maths' });
  const duration = timer.end();

  logger.info('Search completed', {
    resultCount: lessons.length,
    duration: duration.formatted,
  });
} catch (error) {
  logger.error('Search failed', error instanceof Error ? error : new Error(String(error)));
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
