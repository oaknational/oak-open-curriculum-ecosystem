# The Noise in the Signal

_Date: 2026-02-28_
_Tags: architecture | error-handling | discovery_

## What happened (brief)

- Remote deployments were crashing with an error listing 8 "missing" environment variables. The actual failure was one stale value in one variable.

## What it was like

The gap between the error message and the root cause was the interesting part. The error was technically accurate — those keys were absent — but it was operationally misleading. It told you everything and nothing at the same time. The signal (one invalid value) was buried in noise (eight absent optionals).

Tracing the production startup path revealed that half the schema was dead weight — functions that existed, were tested, but were never called in production. The `readEnv` path was a shadow of a refactoring that moved on without it. The test suite kept it alive.

The CORS question was unexpectedly clear once framed correctly. The three-mode system was solving a problem that didn't exist for Bearer-token authentication. Once the user asked "is CORS relevant?", the answer was straightforward: CORS is a browser mechanism for cookie-based auth; we use tokens. The complexity wasn't protecting anything — it was blocking legitimate browser clients.

## What emerged

Dead code that is tested looks alive. The test suite gave `readEnv` the appearance of purpose. Only tracing the actual production startup path (`index.ts` -> `loadRuntimeConfig` -> `resolveEnv`) revealed it was never called. The lesson: test coverage is not the same as production relevance.

Error messages are architecture. The way `buildEnvResolutionError` presented its diagnostics shaped how operators understood (or misunderstood) their system. Changing "Missing keys" to "Failing keys" with a subordinate "optional keys not configured" line was a small code change with outsized operational impact.

## Technical content

- Permissive CORS rationale: [ADR-122](../../docs/architecture/architectural-decisions/122-permissive-cors-for-oauth-protected-mcp.md)
- Validation error pattern: [validation-error-severity-separation](../memory/code-patterns/validation-error-severity-separation.md)
