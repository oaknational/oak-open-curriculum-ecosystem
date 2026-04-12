# Architecture and Infrastructure — Active

Active execution lives here. The Sentry + OpenTelemetry foundation is the
immediate blocker for Open Public Alpha readiness.

| Plan | Scope | Status |
|---|---|---|
| [sentry-otel-integration.execution.plan.md](./sentry-otel-integration.execution.plan.md) | Shared Sentry + OTel foundation (parent plan) | HTTP adoption + rate limiting complete (PR #73 merged, ADR-158). Search CLI + deployment pending. Branch: `feat/otel_sentry_enhancements` |

Companion remediation and merge plans archived to `archive/completed/`.

Prompt entry point:

- [sentry-otel-foundation.prompt.md](../../../prompts/architecture-and-infrastructure/sentry-otel-foundation.prompt.md)

Review checkpoint:

- [sentry-otel-foundation.review-checkpoint-2026-03-27.md](./sentry-otel-foundation.review-checkpoint-2026-03-27.md)

Quality gate hardening:

| Plan | Scope | Status |
|---|---|---|
| [knip-triage-and-remediation.plan.md](./knip-triage-and-remediation.plan.md) | Investigate all knip findings with evidence, remediate, promote to blocking gate | **Complete** — all phases (0-4 and 2.5) resolved 2026-04-12 |

Next queue: [current/README.md](../current/README.md)
Strategic context: [../roadmap.md](../roadmap.md)
