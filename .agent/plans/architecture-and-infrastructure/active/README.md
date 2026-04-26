# Architecture and Infrastructure — Active

Active execution lives here. The Sentry + OpenTelemetry foundation is the
immediate blocker for Open Public Alpha readiness.

> **Observability plans moved 2026-04-18.** Every observability-scoped
> plan now lives under [`../../observability/`](../../observability/)
> per the
> [observability strategy restructure](../current/observability-strategy-restructure.plan.md).
> The parent foundation plan (`sentry-otel-integration.execution.plan.md`)
> stays here because it is cross-cutting (shared Sentry + OTel
> primitives), not observability-scoped.

| Plan | Scope | Status |
|---|---|---|
| [agent-identity-derivation.plan.md](./agent-identity-derivation.plan.md) | Portable deterministic agent-identity CLI in `agent-tools/` | Repo-owned implementation complete; Phase 8 Claude/platform alignment review pending. |
| [sentry-otel-integration.execution.plan.md](./sentry-otel-integration.execution.plan.md) | Shared Sentry + OTel foundation (parent plan) | Foundation (steps 1–5 of "Road to Provably Working Sentry") **DONE** 2026-04-17. Maximisation lanes run on the same branch before PR. Branch: `feat/otel_sentry_enhancements`. Child lanes live in [`../../observability/`](../../observability/). |

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
