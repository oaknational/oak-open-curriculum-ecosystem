# @oaknational/env-resolution

Environment resolution pipeline for MCP applications.

## Purpose

Provides `resolveEnv` — a single-function pipeline that reads `.env` and
`.env.local` files from the monorepo root, merges them with the
caller-provided `processEnv`, validates against a Zod schema, and returns
`Result<T, EnvResolutionError>`.

Schema contracts (`OakApiKeyEnvSchema`, `ElasticsearchEnvSchema`,
`LoggingEnvSchema`) live in `@oaknational/env`. This package owns loading,
merging, validation, and diagnostics. The consuming app composes schemas
from `@oaknational/env` and passes them here.

## resolveEnv

The core function. Apps declare requirements via a Zod schema and get back
either validated config or a structured error.

**Source precedence** (lowest to highest):

```text
.env           — shared defaults (committed)
.env.local     — local developer overrides (gitignored)
processEnv     — explicit vars (e.g. KEY=val command)
```

### Usage

```typescript
import { resolveEnv } from '@oaknational/env-resolution';
import { OakApiKeyEnvSchema, ElasticsearchEnvSchema } from '@oaknational/env';

const AppSchema = OakApiKeyEnvSchema.extend(ElasticsearchEnvSchema.shape);

const result = resolveEnv({
  schema: AppSchema,
  processEnv: process.env,
  startDir: process.cwd(),
});

if (!result.ok) {
  console.error(result.error.message);
  process.exit(1);
}
```

### Contract types

| Type                         | Purpose                                      |
| ---------------------------- | -------------------------------------------- |
| `ResolveEnvOptions<TSchema>` | Input: `{ schema, processEnv, startDir }`    |
| `EnvResolutionError`         | Error: `{ message, diagnostics, zodIssues }` |
| `EnvKeyDiagnostic`           | Per-key: `{ key: string, present: boolean }` |

## findRepoRoot

Walks up from a start directory until it finds `pnpm-workspace.yaml` or
`.git`. Returns `undefined` in serverless environments (e.g. Vercel) where
no repo structure exists.

```typescript
import { findRepoRoot } from '@oaknational/env-resolution';

const root = findRepoRoot(process.cwd());
```

## Development

```bash
pnpm test        # Run tests
pnpm build       # Build the library
pnpm type-check  # Type-check
```
