# @oaknational/mcp-env

Environment utilities for MCP applications.

## Purpose

Provides helpers for `.env` file loading and shared Zod schemas for common
environment variable contracts. Schemas are **opt-in**: apps import only the
contracts they need. If a schema is not imported, the app has no obligation
to satisfy it.

## Shared Schemas (Opt-in Contracts)

Each schema defines a contract: if your app uses that capability, it must
satisfy the schema. Use `.merge()` to compose schemas, and `.partial()` to
make fields optional.

### `OakApiKeyEnvSchema`

Contract for Oak API authentication. Required when your app calls the
Oak curriculum API.

```typescript
import { OakApiKeyEnvSchema } from '@oaknational/mcp-env';

// Required (validation fails without OAK_API_KEY)
const AppEnv = OakApiKeyEnvSchema.extend({ MY_VAR: z.string() });
```

### `ElasticsearchEnvSchema`

Contract for Elasticsearch connectivity. Required when your app uses
Elasticsearch directly. Use `.partial()` when search is an optional feature.

```typescript
import { ElasticsearchEnvSchema } from '@oaknational/mcp-env';

// Required (both ELASTICSEARCH_URL and ELASTICSEARCH_API_KEY must be set)
const AppEnv = ElasticsearchEnvSchema;

// Optional (search features disabled when credentials are absent)
const AppEnv = OakApiKeyEnvSchema.extend(ElasticsearchEnvSchema.partial().shape);
```

### `LoggingEnvSchema`

Contract for logging configuration. All fields are optional.

```typescript
import { LoggingEnvSchema } from '@oaknational/mcp-env';

const AppEnv = OakApiKeyEnvSchema.extend(LoggingEnvSchema.shape);
```

Fields: `LOG_LEVEL` (trace/debug/info/warn/error/fatal), `NODE_ENV`
(development/production/test), `ENVIRONMENT_OVERRIDE` (freeform string).

### Composing Schemas

```typescript
import { OakApiKeyEnvSchema, ElasticsearchEnvSchema, LoggingEnvSchema } from '@oaknational/mcp-env';
import { z } from 'zod';

const AppEnvSchema = OakApiKeyEnvSchema.extend(ElasticsearchEnvSchema.partial().shape)
  .extend(LoggingEnvSchema.shape)
  .extend({
    MY_APP_SPECIFIC_VAR: z.string().min(1),
  });
```

## Utility Functions

### `findRepoRoot(startDir)`

Walks up from a start directory until it finds a directory containing
`pnpm-workspace.yaml` or `.git`, then returns that path.

```typescript
import { findRepoRoot } from '@oaknational/mcp-env';

const root = findRepoRoot(process.cwd());
```

### `loadRootEnv(options)`

Loads environment variables from `.env` files at the repository root when
required keys are missing. Returns `{ repoRoot, loaded, path? }`.

```typescript
import { loadRootEnv } from '@oaknational/mcp-env';

const result = loadRootEnv({
  startDir: process.cwd(),
  requiredKeys: ['OAK_API_KEY'],
  envFileOrder: ['.env.local', '.env'],
});
```

## Development

```bash
pnpm test        # Run tests
pnpm build       # Build the library
pnpm type-check  # Type-check
```
