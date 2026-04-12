# Architecture and Infrastructure — Active

Active execution lives here. The Sentry + OpenTelemetry foundation is the
immediate blocker for Open Public Alpha readiness.

| Plan | Scope | Status |
|---|---|---|
| [sentry-otel-integration.execution.plan.md](./sentry-otel-integration.execution.plan.md) | Shared Sentry + OTel foundation (parent plan) | PR #73 open; C1/C2 regex fix pending, then human review. Search CLI + deployment pending |
| [sentry-otel-remediation.plan.md](./sentry-otel-remediation.plan.md) | Specialist reviewer findings: 21 items | 19 resolved, F10 out-of-scope, F18 deferred |
| [sentry-otel-pr73-codeql-remediation.plan.md](./sentry-otel-pr73-codeql-remediation.plan.md) | PR #73 CodeQL + deferred findings | C1/C2 to fix; C3/C4, F10, F18 deferred |
| [sentry-otel-merge-main.plan.md](./sentry-otel-merge-main.plan.md) | Merge origin/main (PR #70) into branch | 22 conflicts + ~14 clerk dirs; phased resolution |

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
