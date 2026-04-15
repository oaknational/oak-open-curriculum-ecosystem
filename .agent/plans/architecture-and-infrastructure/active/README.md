# Architecture and Infrastructure — Active

Active execution lives here. The Sentry + OpenTelemetry foundation is the
immediate blocker for Open Public Alpha readiness.

| Plan | Scope | Status |
|---|---|---|
| [sentry-otel-integration.execution.plan.md](./sentry-otel-integration.execution.plan.md) | Shared Sentry + OTel foundation (parent plan) | HTTP adoption + rate limiting + Search CLI adoption complete. Remaining: Vercel credential completion, deployment evidence, and child-plan HTTP MCP runtime alignment. Branch: `feat/otel_sentry_enhancements` |
| [sentry-canonical-alignment.plan.md](./sentry-canonical-alignment.plan.md) | Narrow HTTP MCP live-path alignment (child plan) | In progress — native baseline adoption + minimum `register*` gap closure |
| [sentry-observability-expansion.plan.md](./sentry-observability-expansion.plan.md) | Full post-baseline Sentry capability envelope (metrics, propagation, profiling, source maps, operations, option strategy) | New — pending |
| [sentry-cli-observability-extension.plan.md](./sentry-cli-observability-extension.plan.md) | Search CLI observability expansion (metrics, propagation, preload decision, context completion, evidence) | New — pending |
| [sentry-observability-translation-crosswalk.plan.md](./sentry-observability-translation-crosswalk.plan.md) | Lossless mapping from superseded broad plan to current plan set | New — crosswalk audit complete |

Build tooling:

| Plan | Scope | Status |
|---|---|---|
| [build-tooling-composability.plan.md](./build-tooling-composability.plan.md) | Composable tsup base config + tsconfig `$schema` cleanup | **Complete** — all 7 todos done 2026-04-14 |

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
