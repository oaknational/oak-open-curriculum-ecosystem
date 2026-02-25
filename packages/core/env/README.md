# @oaknational/env

Environment resolution pipeline for MCP applications.

## Purpose

Provides a single-function environment resolution pipeline (`resolveEnv`)
and shared Zod schemas for common environment variable contracts. Apps
compose a schema from shared building blocks, pass it to `resolveEnv`,
and get back a typed `Result` — validated config or structured error.

## resolveEnv — the pipeline

The core function. Reads `.env` and `.env.local` from the monorepo root
(non-mutating `dotenv.parse()`), merges them with `processEnv`, validates
against the app-provided Zod schema, and returns `Result<T, EnvResolutionError>`.

**Source precedence** (lowest to highest):

```text
.env           — shared defaults (committed)
.env.local     — local developer overrides (gitignored)
processEnv     — explicit vars (e.g. KEY=val command)
```

### Usage

```typescript
import { resolveEnv } from '@oaknational/env';
import { OakApiKeyEnvSchema, ElasticsearchEnvSchema } from '@oaknational/env';

const AppSchema = OakApiKeyEnvSchema.extend(ElasticsearchEnvSchema.shape);

const result = resolveEnv({
  schema: AppSchema,
  processEnv: process.env,
  startDir: process.cwd(),
});

if (!result.ok) {
  console.error(result.error.message);
  // result.error.diagnostics — per-key presence/absence
  // result.error.zodIssues   — raw Zod validation issues
  process.exit(1);
}

// result.value is fully typed: { OAK_API_KEY: string, ELASTICSEARCH_URL: string, ... }
```

### Contract types

| Type                         | Purpose                                      |
| ---------------------------- | -------------------------------------------- |
| `ResolveEnvOptions<TSchema>` | Input: `{ schema, processEnv, startDir }`    |
| `EnvResolutionError`         | Error: `{ message, diagnostics, zodIssues }` |
| `EnvKeyDiagnostic`           | Per-key: `{ key: string, present: boolean }` |

### How apps use it

The env lib defines the contract. The consuming app:

1. Composes a Zod schema from shared schemas + app-specific fields
2. Calls `resolveEnv({ schema, processEnv, startDir })`
3. Handles the `Result` — start the app or log diagnostics and exit

The app does not know about `.env` files, merge order, or `dotenv`.
It declares what it needs and gets back either a validated config or
a structured error.

## Shared schemas (opt-in contracts)

Each schema defines a contract: if your app uses that capability, it must
satisfy the schema. Schemas are **opt-in** — apps import only what they need.

### `OakApiKeyEnvSchema`

Contract for Oak API authentication. Required when your app calls the
Oak Curriculum API.

```typescript
import { OakApiKeyEnvSchema } from '@oaknational/env';

const AppSchema = OakApiKeyEnvSchema.extend({ MY_VAR: z.string() });
```

### `ElasticsearchEnvSchema`

Contract for Elasticsearch connectivity. Required when your app uses
Elasticsearch directly.

```typescript
import { ElasticsearchEnvSchema } from '@oaknational/env';

// Required (both ELASTICSEARCH_URL and ELASTICSEARCH_API_KEY must be set)
const AppSchema = ElasticsearchEnvSchema;

// Optional (search features disabled when credentials are absent)
const AppSchema = OakApiKeyEnvSchema.extend(ElasticsearchEnvSchema.partial().shape);
```

### `LoggingEnvSchema`

Contract for logging configuration. All fields are optional.

```typescript
import { LoggingEnvSchema } from '@oaknational/env';

const AppSchema = OakApiKeyEnvSchema.extend(LoggingEnvSchema.shape);
```

Fields: `LOG_LEVEL` (trace/debug/info/warn/error/fatal), `NODE_ENV`
(development/production/test), `ENVIRONMENT_OVERRIDE` (freeform string).

### Composing schemas

```typescript
import { OakApiKeyEnvSchema, ElasticsearchEnvSchema, LoggingEnvSchema } from '@oaknational/env';
import { z } from 'zod';

const AppEnvSchema = OakApiKeyEnvSchema.extend(ElasticsearchEnvSchema.shape)
  .extend(LoggingEnvSchema.shape)
  .extend({
    MY_APP_SPECIFIC_VAR: z.string().min(1),
  });
```

Use `.extend(OtherSchema.shape)` (not `.merge()` which is deprecated in Zod v4).

## Utility functions

### `findRepoRoot(startDir)`

Walks up from a start directory until it finds a directory containing
`pnpm-workspace.yaml` or `.git`, then returns that path.

```typescript
import { findRepoRoot } from '@oaknational/env';

const root = findRepoRoot(process.cwd());
```

## Development

```bash
pnpm test        # Run tests
pnpm build       # Build the library
pnpm type-check  # Type-check
```
