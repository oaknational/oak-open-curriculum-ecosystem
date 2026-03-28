# Architecture and Infrastructure — Active

Active execution lives here. The Sentry + OpenTelemetry foundation is now in
progress and is the immediate blocker for Open Public Alpha readiness because
Oak needs actionable, redacted runtime diagnosis before the HTTP MCP server and
Search CLI can be operated confidently in public alpha.

| Plan | Scope | Status |
|---|---|---|
| [sentry-otel-integration.execution.plan.md](./sentry-otel-integration.execution.plan.md) | Shared Sentry + OTel foundation | Phase 3 HTTP adoption in progress; remediation session ran 6 reviewers, began Phase A fixes |
| [sentry-otel-remediation.plan.md](./sentry-otel-remediation.plan.md) | Branch remediation: 21 findings, 5 phases | Phase A mostly done in working tree (F1–F7); Phases B–E pending |

Prompt entry point:

- [sentry-otel-foundation.prompt.md](../../../prompts/architecture-and-infrastructure/sentry-otel-foundation.prompt.md)

Review checkpoint:

- [sentry-otel-foundation.review-checkpoint-2026-03-27.md](./sentry-otel-foundation.review-checkpoint-2026-03-27.md)

Next queue: [current/README.md](../current/README.md)
