# Semantic Search Sentry Integration Proposal

## Pre-Requisites

- Sentry project
- Working semantic versioning workflow and release creation

## Context

- The `apps/oak-search-cli/` Next.js app currently lacks Sentry instrumentation.
- Observability today relies on `@oaknational/mcp-logger` and bespoke zero-hit telemetry (`src/lib/observability/`).
- This proof of concept will serve extremely low traffic, so sample rates can prioritise visibility over cost.
- Secure configuration supply has been confirmed and can rely on existing environment validation patterns in `src/lib/env.ts`.

## Objectives

- Establish baseline Sentry error and performance monitoring for the semantic search app without disrupting existing logging behaviour.
- Keep the implementation cleanly testable via Vitest to respect repository TDD practices.
- Maintain parity across server, edge, and client execution environments so future expansion (e.g. server actions) is straightforward.
- Produce deployment guidance that works within the pnpm + Turborepo workflow used by the monorepo.

## Proposed Approach

1. **Dependencies and Tooling**
   - Add `@sentry/nextjs` to the app workspace and align versions with Next.js 15 support.
   - Introduce an optional build-time hook for source map upload (e.g. Sentry CLI via `sentry.properties`) but defer activation until credentials are available.

2. **Environment Configuration**
   - Extend `src/lib/env.ts` with validated keys (`SENTRY_DSN`, `SENTRY_ENVIRONMENT`, `SENTRY_TRACES_SAMPLE_RATE`, `SENTRY_PROFILES_SAMPLE_RATE`).
   - Update `.env.example` and corresponding documentation to describe these settings and their expected defaults for the proof of concept.

3. **Initialisation Files**
   - Create `sentry.client.config.ts`, `sentry.server.config.ts`, and `sentry.edge.config.ts` under the app root, each importing `@sentry/nextjs` and deriving configuration from the validated env accessors.
   - Provide an `instrumentation.ts` to register Sentry with the App Router lifecycle and wrap React Server Components where applicable.

4. **Runtime Wiring**
   - Wrap API handlers (e.g. zero-hit observability endpoints) and background jobs using Sentry helpers such as `withSentry`. Ensure existing error handling still returns the documented payloads.
   - Configure `Sentry.consoleLoggingIntegration` so structured logs emitted by `@oaknational/mcp-logger` are mirrored into Sentry without altering logger usage patterns.
   - Add lightweight span helpers for Elastic queries and zero-hit logging so traces capture search latency.

5. **Testing Strategy (TDD)**
   - Create Vitest specs for new env parsing branches to guarantee improper Sentry configuration fails fast.
   - Mock `@sentry/nextjs` in unit tests covering API wrappers to assert `captureException` and `startSpan` invocations occur when expected.
   - Add integration-style tests for the span helper utilities to ensure they propagate attributes correctly.

6. **Documentation and Runbooks**
   - Draft a short operator guide within `docs/agent-guidance/` describing how to verify Sentry events locally (using a dummy DSN) and how to adjust sampling for production.
   - Capture manual smoke steps for release validation, including running `pnpm dev` with Sentry enabled and reviewing the Sentry dashboard for captured events.

## Outstanding Questions and Research

- **Edge coverage**: Which routes (if any) will run on the Edge runtime? Confirm whether additional edge-specific wrappers are required beyond `sentry.edge.config.ts`.
- **Server actions**: Are server actions planned for this app? If so, evaluate the Sentry server action helpers and document their adoption path.
- **Sampling defaults**: Determine precise `tracesSampleRate` and `profilesSampleRate` values suited to the proof of concept while ensuring budgets remain manageable if traffic increases later.
- **Release versioning**: Decide how to set Sentry `release` and `environment` fields so they align with Turborepo artefacts and avoid collisions across deployments.
- **Local developer experience**: Research how to streamline local testing (e.g. using `sentry-cli dev-server`) without leaking credentials.
- **Source map upload**: Investigate whether CI already supports secret storage for Sentry auth tokens and what minimal scaffolding is needed to integrate uploads when the proof of concept graduates.

## Next Steps

1. Refine sampling policy and release naming conventions based on the outstanding research.
2. Implement the dependency and configuration scaffolding under TDD, ensuring env validation and instrumentation files are covered by tests.
3. Extend API handlers and logging modules with Sentry wrappers, verifying compatibility with `@oaknational/mcp-logger`.
4. Document operational procedures and manual verification steps before enabling Sentry in shared environments.
