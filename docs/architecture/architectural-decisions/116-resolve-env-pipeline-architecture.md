# ADR-116: resolveEnv Pipeline Architecture

## Status

Accepted (Revised 2026-02-23)

**Supersedes**: [ADR-016 (dotenv for configuration)](016-dotenv-for-configuration.md)

**Related**: [ADR-052 (OAuth 2.1)](052-oauth-2.1-for-mcp-http-authentication.md), [ADR-053 (Clerk)](053-clerk-as-identity-provider.md)

> **Revision note (2026-02-23)**: Added serverless environment compatibility.
> The original design unconditionally called `findRepoRoot()`, which threw
> in Vercel's serverless runtime where no `.git` or `pnpm-workspace.yaml`
> exists. `findRepoRoot` now returns `string | undefined`, and `resolveEnv`
> gracefully skips `.env` file loading when no repo root is found. See
> [Serverless Compatibility](#serverless-compatibility) below.

## Context

ADR-016 established dotenv for local development configuration but did not prescribe a pipeline architecture. As the monorepo grew, several problems emerged:

1. **Mutating `process.env`** — the default `dotenv.config()` call mutates the global `process.env` object, making it impossible to test configuration in isolation and creating ordering dependencies between modules.
2. **No source hierarchy** — there was no defined precedence between `.env`, `.env.local`, and explicit env vars. Different apps loaded dotenv differently.
3. **No structured error reporting** — validation failures produced unstructured Zod error arrays with no indication of which keys were present, absent, or from which source.
4. **Conditional requirements** — the HTTP server needs Clerk keys only when authentication is enabled. A flat Zod schema cannot express this; attempting to make all keys required forces developers to provide dummy values in development.
5. **No discriminated config types** — after validation, code could not statically determine whether Clerk keys were present based on the `DANGEROUSLY_DISABLE_AUTH` flag. Runtime type narrowing was required at every usage site.

### Options Considered

| Option                       | Description                                                                                    | Verdict                                                |
| ---------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| **A: resolveEnv pipeline**   | Shared `@oaknational/mcp-env` package with non-mutating parse, source hierarchy, Result return | **Accepted**                                           |
| B: Per-app dotenv.config()   | Each app calls dotenv.config() independently                                                   | Rejected — mutates process.env, no hierarchy, no reuse |
| C: Environment service class | Singleton service with lazy loading                                                            | Rejected — global state, testing difficulty            |

## Decision

Implement a shared environment resolution pipeline in `@oaknational/mcp-env` with the following architecture:

### Source Hierarchy

Three sources, merged with increasing precedence:

1. `.env` — shared defaults (committed to version control)
2. `.env.local` — local developer overrides (gitignored)
3. `processEnv` — explicit environment variables (e.g. `KEY=val command`)

The pipeline uses non-mutating `dotenv.parse()` to read files without modifying `process.env`. The merge is a simple spread: `{ ...dotEnvValues, ...dotEnvLocalValues, ...processEnv }`.

### Result Return

`resolveEnv` returns `Result<z.infer<TSchema>, EnvResolutionError>` from `@oaknational/result`. The error type includes:

- A human-readable message with missing keys and validation errors
- Per-key diagnostics (`EnvKeyDiagnostic[]`) reporting presence/absence
- Raw Zod issues for programmatic error handling

Callers decide what to do with the error — the pipeline does not exit or throw.

### Conditional Clerk Keys via superRefine

The HTTP server's `HttpEnvSchema` uses Zod's `superRefine` to conditionally require Clerk keys:

- When `DANGEROUSLY_DISABLE_AUTH === 'true'`: Clerk keys are optional
- Otherwise: both `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are required, with specific error messages

This avoids the need for dummy credentials in development while maintaining strict validation in production.

### Discriminated RuntimeConfig Union

After environment resolution succeeds, `loadRuntimeConfig()` constructs a discriminated union:

```typescript
type RuntimeConfig = AuthEnabledRuntimeConfig | AuthDisabledRuntimeConfig;
```

The discriminant is `dangerouslyDisableAuth: boolean`. When the compiler narrows on this field:

- `dangerouslyDisableAuth: false` guarantees `CLERK_PUBLISHABLE_KEY: string` and `CLERK_SECRET_KEY: string`
- `dangerouslyDisableAuth: true` allows Clerk keys to be absent

This eliminates runtime type checks for Clerk key presence throughout the application.

### Serverless Compatibility

`findRepoRoot()` returns `string | undefined`. When a repo root is found, `.env` and `.env.local` files are loaded and merged with `processEnv` as described above. When no repo root is found (e.g. Vercel serverless, where the deployed bundle at `/var/task/` contains no `.git` or `pnpm-workspace.yaml`), file loading is skipped and only `processEnv` is validated. This is correct because serverless platforms inject all configuration via process environment variables.

When validation fails on a Vercel deployment (`processEnv.VERCEL === '1'`), the error message includes deployment-specific guidance naming the missing keys and directing the developer to configure them in the Vercel project settings (Settings → Environment Variables).

Callers that require a repo root (STDIO server, smoke tests, build-time scripts) check the return value and fail-fast with a context-appropriate error message.

## Rationale

- **Non-mutating**: `dotenv.parse()` returns a plain object without touching `process.env`, enabling isolated testing and deterministic behaviour
- **Schema-driven**: apps compose their own schemas from shared building blocks (`OakApiKeyEnvSchema`, `ElasticsearchEnvSchema`, `LoggingEnvSchema`), keeping the pipeline generic
- **Fail-fast with diagnostics**: structured `EnvResolutionError` with per-key presence reporting makes misconfiguration immediately obvious
- **Type-safe**: the discriminated union propagates auth-state knowledge through the type system, eliminating an entire class of runtime errors
- **Monorepo-aware**: `findRepoRoot()` walks up the directory tree looking for `pnpm-workspace.yaml` or `.git`, so apps in any workspace directory find the root `.env` files automatically
- **Serverless-safe**: when no repo root exists, the pipeline degrades gracefully to validating `processEnv` only, with platform-specific error guidance when configuration is incomplete

## Consequences

### Positive

- Single source of truth for environment loading across all apps
- Environment validation failures are immediately actionable (per-key diagnostics)
- No `process.env` mutation eliminates ordering dependencies and enables parallel testing
- Conditional Clerk keys via `superRefine` remove the need for dummy credentials
- Discriminated `RuntimeConfig` union provides compile-time auth-state guarantees
- Composable Zod schemas let each app define its own requirements while sharing common shapes
- Works in both monorepo and serverless environments without caller-side branching

### Negative

- `findRepoRoot()` adds filesystem traversal at startup (mitigated: only called once, traversal is bounded)
- The `superRefine` pattern for conditional keys requires Zod-specific knowledge
- Dual `readEnv` (legacy, throws) and `resolveEnv` (new, returns Result) paths coexist during migration
- Callers that genuinely require a repo root (STDIO server, build scripts) must check `findRepoRoot`'s return value and provide their own error handling

## Implementation

- **Core package**: `packages/core/env/src/resolve-env.ts`
- **Repo root finder**: `packages/core/env/src/repo-root.ts`
- **Shared schemas**: `packages/core/env/src/schemas/index.ts`
- **HTTP env schema**: `apps/oak-curriculum-mcp-streamable-http/src/env.ts`
- **Runtime config**: `apps/oak-curriculum-mcp-streamable-http/src/runtime-config.ts`
- **STDIO runtime config**: `apps/oak-curriculum-mcp-stdio/src/runtime-config.ts`

### Migration from ADR-016

ADR-016's guidance to "use dotenv for local development" remains valid as a principle. This ADR supersedes it by specifying the concrete pipeline architecture, source hierarchy, error handling, and type-safe configuration patterns that ADR-016 left undefined.
