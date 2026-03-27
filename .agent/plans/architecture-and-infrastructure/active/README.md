# Architecture and Infrastructure — Active

Active execution lives here. The Sentry + OpenTelemetry foundation is now in
progress and is the immediate blocker for Open Public Alpha readiness.

| Plan | Scope | Status |
|---|---|---|
| [sentry-otel-integration.execution.plan.md](./sentry-otel-integration.execution.plan.md) | Shared Sentry + OTel foundation for `@oaknational/logger`, the HTTP MCP server, and the Search CLI | Initial Phase 1 implementation landed locally; next session starts with blocker remediation (lint export map, clean-break removal, Sentry config fixes, explicit `observability -> core` move plus library-tier rule), then resumes adoption |

Prompt entry point:

- [sentry-otel-foundation.prompt.md](../../../prompts/architecture-and-infrastructure/sentry-otel-foundation.prompt.md)

Review checkpoint:

- [sentry-otel-foundation.review-checkpoint-2026-03-27.md](./sentry-otel-foundation.review-checkpoint-2026-03-27.md)

Next queue: [current/README.md](../current/README.md)
