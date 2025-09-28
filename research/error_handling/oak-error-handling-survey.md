# Oak MCP Ecosystem Error Handling Survey and Strategy

## Core references

- **GO.md** (primary grounding)
- **AGENT.md**
- **docs/agent-guidance/development-practice.md**
- **docs/agent-guidance/testing-strategy.md**
- **docs/agent-guidance/typescript-practice.md**

## Executive summary

The Oak MCP ecosystem currently mixes multiple error handling styles: direct exception throwing, silent fallback values (`null`, `false`), bespoke result discriminated unions, and logging without consistent propagation. This document surveys existing patterns, highlights risks, and recommends converging on an explicit `Result<T, E>` style for all fallible operations. A dedicated error-handling library workspace will anchor the shared abstractions, offer utilities for wrapping throwing dependencies, and define a structured error taxonomy. A staged adoption plan (Part 1: library design, Part 2: incremental integration) will reduce migration risk while preserving observable behaviour.

## Current-state survey

### Explicit throws with generic `Error`

- **`apps/oak-open-curriculum-semantic-search/src/adapters/oak-adapter-sdk.ts`** throws plain `Error`s for shape mismatches after calling generated SDK methods.
- **`apps/oak-open-curriculum-semantic-search/src/lib/indexing/index-bulk-helpers.ts`** raises `Error` on validation failures (e.g. missing canonical URL).
- **`packages/sdks/oak-curriculum-sdk/src/validation/response-validators.ts`** throws `TypeError` when routing metadata is invalid.
- **`apps/oak-notion-mcp/src/tools/resources/handlers/read-resource.ts`** throws `Error` for URI validation failures and unsupported resource types.

These throws surface quickly but lack typed context or structured remediation guidance. Downstream code often rethrows or converts to plain strings, limiting introspection.

### Silent fallbacks and implicit failures

- **`packages/libs/storage/src/file-storage.ts`** swallows file system errors (e.g. `catch { return null; }`), making it impossible to distinguish "missing file" from "IO failure".
- **`packages/libs/storage/src/detect-storage-options.ts`** catches and ignores module import errors, returning `null` without diagnostic data.
- Several scripts (e.g. `packages/sdks/oak-curriculum-sdk/type-gen/*`) call `.catch(() => undefined)` or log-and-continue, obscuring root causes during automation.

Silent fallbacks complicate observability and undermine fast failure principles stated in `AGENT.md`.

### Bespoke `Result`-like discriminated unions

- **`packages/sdks/oak-curriculum-sdk/src/mcp/argument-normaliser.ts`** defines `Result<T>` with `{ ok: true; value } | { ok: false; message }`.
- **`packages/sdks/oak-curriculum-sdk/src/mcp/execute-tool-call.ts`** returns `ToolExecutionResult` unions with optional `error`.
- **`packages/sdks/oak-curriculum-sdk/src/validation/types.ts`** defines `ValidationResult<T>` with helper predicates.
- **`apps/oak-curriculum-mcp-stdio/src/app/server.ts`** expects `{ ok: true } | { ok: false; message }` from validators.

These unions improve clarity locally but differ in naming, shape, helper functions, and error metadata. There is no shared abstraction for mapping or chaining results.

### Logging without structured propagation

- **`apps/oak-curriculum-mcp-streamable-http/src/auth.ts`** logs warnings for auth failures but responds with HTTP 401 using string messages, losing machine-actionable classification.
- **`packages/libs/logger/src/pure-functions.ts`** provides `normalizeError`, yet many paths bypass it, logging raw values.

### External dependency throws

the ecosystem relies on libraries that throw:

- **`jose`** via `verifyAccessToken()` in `apps/oak-curriculum-mcp-streamable-http/src/auth-jwt.ts`.
- **`@elastic/elasticsearch`** in `apps/oak-open-curriculum-semantic-search/src/lib/elastic-http.ts`.
- Node built-ins (`fs`, `path`) throughout `packages/libs/storage/`.
- Notion SDK in `apps/oak-notion-mcp/` handlers.
- Generated SDK clients throw inside fetch implementations when network errors occur.

Currently, throwing dependencies are wrapped inconsistently—some rethrow, some swallow, others wrap in ad-hoc unions.

## Observed challenges

- No repository-wide error type taxonomy; teams cannot rely on consistent categories (validation, transport, auth, configuration, etc.).
- Inconsistent return signatures impede composition and TDD-first design.
- Asynchronous contexts lack utilities to convert rejected promises into structured outcomes.
- Logging and tracing lose causality metadata because ad-hoc error messages omit context.
- Partial migrations risk double-handling (both throwing and returning `Result`), increasing complexity.

## Recommended target architecture

### Establish a dedicated error-handling library workspace

Create a new workspace (suggested location: `packages/libs/result/`) exporting shared primitives:

- `Result<T, E extends ResultError>` discriminated union with methods (`map`, `mapError`, `andThen`, `asyncFrom`).
- `ResultError` base interface capturing `kind`, `message`, optional `cause`, and structured metadata.
- Families of domain errors (`ValidationError`, `TransportError`, `AuthError`, `ConfigError`, `InvariantError`) with literal `kind` discriminants.
- Helper constructors: `ok(value)`, `err(error)`, `fromThrowable(fn, classify)`, `fromPromise(promise, classify)`, `combine(results)`.
- Utilities for bridging to existing unions (`toValidationResult`, `fromValidationResult`) to ease migration.

### Error taxonomy and naming conventions

Adopt consistent naming: `OakErrorKind = 'validation' | 'authorisation' | 'transport' | 'configuration' | 'unexpected' | ...`. All errors should record:

- human-readable message (British spelling)
- machine-friendly `kind`
- optional `context` object (`{ path, method, subjectSlug }`)
- optional `cause` referencing the thrown error (leveraging native `ErrorOptions`)

### Integration patterns

- Service functions return `Result<T, OakError>` instead of throwing.
- HTTP/CLI entry-points convert `Result` to protocol responses (e.g. HTTP JSON, MCP responses) with consistent error envelopes.
- Logging middleware uses `normalizeError` with structured metadata from `Result` instances.

### Bridging throwing dependencies

Provide wrapper helpers:

```ts
import { fromThrowable, Result } from '@oaknational/result';

const readFileSafe = fromThrowable(fs.promises.readFile, {
  classify: (error) => ({
    kind: 'io',
    message: 'Failed to read file',
    context: { path },
    cause: error,
  }),
});

const jwkKey = await fromPromise(importJWK(jwk, 'RS256'), (error) => ({
  kind: 'configuration',
  message: 'Invalid LOCAL_AS_JWK value',
  context: { envVar: 'LOCAL_AS_JWK' },
  cause: error,
}));
```

These helpers should ensure all external interactions surface `Result` objects, preserving root causes while avoiding uncaught exceptions.

### Async composition utilities

Expose `asyncMap`, `asyncAndThen`, and `settleAll` to compose multiple asynchronous operations (e.g. indexing flows) without nested `try/catch`. Provide `unwrapOr`, `unwrapOrElse`, and explicit `panic` (for truly unrecoverable invariants) gated behind assertions.

## Evaluation of supporting libraries

| Library            | Strengths                                                                | Considerations                                                                         |
| ------------------ | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| `neverthrow`       | Mature `Result` implementation with async helpers, good ergonomics.      | Adds runtime dependency, limited custom error typing (error is generic `E`).           |
| `oxide.ts`         | Mirrors Rust `Result`/`Option`, provides pattern matching.               | Smaller community, less TypeScript-first ergonomics, requires tree-shaking care.       |
| `ts-results`       | Lightweight, no external dependencies, simple API.                       | Lacks async helpers, `Ok`/`Err` classes require `.value` access (imperative feel).     |
| `true-myth`        | Functional approach with `Maybe`/`Result`, interoperates with pipelines. | Larger bundle, encourages point-free style that may differ from existing code style.   |
| `fp-ts` (`Either`) | Comprehensive functional toolkit.                                        | Steep learning curve, introduces FP jargon, conflicts with "keep it simple" directive. |

Recommendation: build a bespoke thin wrapper inspired by `neverthrow`, tailored to Oak needs (structured error taxonomy, logging integration). Implementation can leverage existing patterns from `ValidationResult` to preserve familiarity while standardising API ergonomics.

## Wrapping external dependencies

- **Node.js modules** (`fs`, `path`): define adapters (`readJsonFile(path): Result<unknown, OakError>`) that classify `ENOENT` vs other IO errors.
- **HTTP/Fetch**: wrap `fetch` responses via `Result` to distinguish transport errors, HTTP status failures, and decoding issues.
- **Elasticsearch client**: wrap `esClient().search` and `transport.request` to capture response metadata and error codes.
- **Notion SDK**: use `fromPromise` helper to convert API rejects into `Result`, classify rate limiting vs validation.
- **`jose` JWT verification**: convert thrown `JOSEError` into `AuthError` with contextual env details, feeding consistent responses in `auth.ts`.

For libraries that only throw, create adapter modules (e.g. `packages/libs/result/adapters/jose.ts`) exporting safe wrappers so application code never touches raw throws.

## Migration strategy

### Part 1 — Design and scaffolding

- Define `@oaknational/result` package with primitives, taxonomy, and helper utilities.
- Provide codemods or lint rules encouraging explicit result handling.
- Document usage patterns (MCP tools, Express handlers, Next routes, CLI scripts).

### Part 2 — Incremental adoption

- Prioritise high-risk boundaries: external API calls, storage adapters, auth flows.
- Replace silent fallbacks with explicit `Result` propagation and logging.
- Update MCP tool execution (`executeToolCall`) and SDK adapters to return standard `Result`.
- Extend logger to accept `ResultError` metadata, ensuring consistent observability.

## Risks and mitigations

- **Dual error paths** (throw + `Result`): enforce rule that functions returning `Result` must not throw except for truly unrecoverable invariants. Provide ESLint rule to flag `throw` inside `Result` functions.
- **Adoption fatigue**: supply reference implementations, pairing sessions, and automated checks to ease transition.
- **Type drift**: centralise error types in the new library to avoid bespoke unions.
- **Performance concerns**: `Result` wrapping is lightweight; document benchmarks to reassure teams.

## Recommended next steps

- **Author** architecture RFC for `@oaknational/result`, referencing this survey.
- **Prototype** helper set (`fromPromise`, `combine`) and validate against `index-bulk-helpers.ts` use cases.
- **Draft** codemod or lint rules to flag `catch {}` with empty bodies and `throw new Error` without classification.
- **Plan** staged migration per application (MCP stdio, streamable HTTP, Notion MCP, semantic search) with clear success metrics (e.g. `% of functions returning `Result`).

This strategy aligns with the Prime Directive (“could it be simpler without compromising quality”) by consolidating error handling into a single Chōra of patterns while preserving developer ergonomics and observability.
