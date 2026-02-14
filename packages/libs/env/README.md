# @oaknational/mcp-env

Runtime-adaptive environment library for MCP applications.

## Purpose

Provides helpers for environment variable access and `.env` file loading across
different JavaScript runtimes (Node.js, Edge, Deno). This package provides
**tools**, not **policy** — each application manages its own configuration
validation and composition.

## API

### `createAdaptiveEnvironment(globalObj)`

Builds an `EnvironmentProvider` by detecting environment variables on the given
global object. Supports `globalThis.process.env` (Node.js) and
`globalThis.env` (Edge/Deno).

```typescript
import { createAdaptiveEnvironment } from '@oaknational/mcp-env';

const env = createAdaptiveEnvironment(globalThis);
const apiKey = env.get('OAK_API_KEY');
```

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
  requiredKeys: ['OAK_API_KEY'],
  envFiles: ['.env.local', '.env'],
});
```

### `EnvironmentProvider` (type)

Interface for consistent environment variable access:

- `get(key: string): string | undefined`
- `getAll(): Record<string, string | undefined>`
- `has(key: string): boolean`

## Configuration Pattern

Each application should manage its own configuration using:

1. **Zod schema validation** in an app-level `env.ts`
2. **Config composition** in an app-level `runtime-config.ts`
3. **Dependency injection** throughout the app

This package provides the runtime primitives; applications define their own
validation and composition logic.

## Development

```bash
pnpm test        # Run tests
pnpm build       # Build the library
pnpm type-check  # Type-check
```
