# Architecture and Infrastructure — Active

Active execution lives here. The Sentry + OpenTelemetry foundation is the
immediate blocker for Open Public Alpha readiness.

| Plan | Scope | Status |
|---|---|---|
| [sentry-otel-integration.execution.plan.md](./sentry-otel-integration.execution.plan.md) | Shared Sentry + OTel foundation (parent plan) | Foundation (steps 1–5 of "Road to Provably Working Sentry") **DONE** 2026-04-17. Maximisation lanes run on the same branch before PR. Branch: `feat/otel_sentry_enhancements`. |
| [sentry-observability-maximisation-mcp.plan.md](./sentry-observability-maximisation-mcp.plan.md) | MCP server + widget: close every available Sentry product loop (errors, logs, traces, performance, profiling, measurement, release linkage, feedback, feature-flag scaffolding, AI scaffolding, widget Sentry, alerts, runbooks); cross-cutting L-EH (Result<T, E> + cause preservation via ESLint) and L-DOC (documentation coverage). | Active — ready for fresh session. Strategic parent: [../future/sentry-observability-maximisation.plan.md](../future/sentry-observability-maximisation.plan.md). Supersedes `sentry-observability-expansion.plan.md` (archived 2026-04-17 under `../archive/superseded/`). |
| [sentry-observability-translation-crosswalk.plan.md](./sentry-observability-translation-crosswalk.plan.md) | Lossless mapping from superseded broad plan to current plan set | Reference — crosswalk audit complete. Update pending: reference the maximisation plan as the authoritative successor. |
| [search-observability.plan.md](./search-observability.plan.md) | End-to-end search observability: CLI Sentry runtime, Elasticsearch operations, retrieval quality, trace propagation | Pending — deferred to the next branch (Search CLI maximisation mirrors on that branch). |

Build tooling:

| Plan | Scope | Status |
|---|---|---|
| [build-tools-workspace-extraction.plan.md](./build-tools-workspace-extraction.plan.md) | Move repo-level scripts + tests into a `build-tools/` workspace | Queued — not yet executable. |

Remediation and merge hygiene:

| Plan | Scope | Status |
|---|---|---|
| [ci-green-for-merge.plan.md](./ci-green-for-merge.plan.md) | Keep CI green through the Sentry + practice-enforce merge | In-flight — `verify-ci-green` todo pending. |
| [eslint-disable-remediation.plan.md](./eslint-disable-remediation.plan.md) | Remove 64 actionable `eslint-disable` comments | In-progress — 7 todo categories pending. |

Archived:

- Completed plans (Sentry child plans, knip remediation, build-tooling
  composability, search-CLI observability adoption, PR #80 merge) →
  [archive/completed/](../archive/completed/).
- Superseded plans (knip phase-2 exports triage; the Sentry reference
  setup vendor-boilerplate snippet) → [archive/superseded/](../archive/superseded/).
- Historical review checkpoint (2026-03-27 handover bundle proof) →
  [evidence/sentry-otel-foundation.review-checkpoint-2026-03-27.md](../evidence/sentry-otel-foundation.review-checkpoint-2026-03-27.md).

Prompt entry point:

- [sentry-otel-foundation.prompt.md](../../../prompts/architecture-and-infrastructure/sentry-otel-foundation.prompt.md)

Next queue: [current/README.md](../current/README.md)
Strategic context: [../roadmap.md](../roadmap.md)
