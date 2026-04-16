# @oaknational/env

Environment schema contracts for MCP applications.

## Purpose

Provides shared Zod schemas for common environment variable contracts.
Schemas are opt-in: apps import only what they need, compose them into
an app-specific schema, and pass it to `resolveEnv` from
`@oaknational/env-resolution`.

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

const AppSchema = ElasticsearchEnvSchema;
```

### `LoggingEnvSchema`

Contract for logging configuration. All fields are optional.

```typescript
import { LoggingEnvSchema } from '@oaknational/env';

const AppSchema = OakApiKeyEnvSchema.extend(LoggingEnvSchema.shape);
```

Fields: `LOG_LEVEL` (trace/debug/info/warn/error/fatal), `NODE_ENV`
(development/production/test), `ENVIRONMENT_OVERRIDE` (freeform string).

### `SentryEnvSchema`

Contract for shared Sentry configuration.

Fields:
`SENTRY_MODE`, `SENTRY_DSN`, `SENTRY_ENVIRONMENT_OVERRIDE`,
`SENTRY_RELEASE_OVERRIDE`, `SENTRY_TRACES_SAMPLE_RATE`,
`SENTRY_ENABLE_LOGS`, `SENTRY_SEND_DEFAULT_PII`, `SENTRY_DEBUG`.

The `*_OVERRIDE` names are deliberate: these values are only ever explicit
overrides. Any non-override release/version policy belongs in the consumer
runtime config, not in the shared raw-env schema.

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

## Resolution pipeline

The environment resolution pipeline (`resolveEnv`, `findRepoRoot`) lives in
`@oaknational/env-resolution`. Pass your composed schema there for loading,
merging, and validation.

## Development

```bash
pnpm test        # Run tests
pnpm build       # Build the library
pnpm type-check  # Type-check
```
