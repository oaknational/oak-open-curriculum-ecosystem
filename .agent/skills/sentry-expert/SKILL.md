---
name: sentry-expert
classification: active
description: Active workflow skill for Sentry and OpenTelemetry planning, research, and implementation support. Grounded in current official Sentry and OpenTelemetry documentation with Vercel Node.js plus the HTTP MCP server and Search CLI as the default Oak deployment context.
---

# Sentry Expert

Active workflow skill for Sentry and OpenTelemetry planning, research, and
implementation work. This skill supports the working agent during tasks that
involve observability foundations. It does not replace the
`sentry-reviewer`, which provides independent read-only assessment.

## When to Use

Use this skill when the working agent needs to:

- design or implement `@sentry/node` initialisation
- design or implement shared observability helpers
- design or implement Sentry log sinks or handled-error capture
- design or implement log-trace correlation with `@opentelemetry/api`
- design or implement MCP wrapping and capture policy for Sentry Insights
- design or implement shared telemetry redaction
- plan source-map, release, or alerting workflows

## When NOT to Use

- For independent review of completed work — use `sentry-reviewer`
- For generic logging or refactoring questions unrelated to Sentry/OTel — use
  normal engineering judgement and the standard reviewers
- For exploitability or privacy-signoff questions — involve
  `security-reviewer`
- For MCP protocol compliance unrelated to Sentry wrapping — use
  `mcp-reviewer`

## Doctrine Hierarchy

This skill follows the same authority hierarchy as the `sentry-reviewer`
(ADR-129):

1. **Current official Sentry documentation** — fetched live from the web
2. **Current official OpenTelemetry documentation** — fetched live from the web
3. **Official packages and client sources** — `@sentry/node`,
   `getsentry/sentry-javascript`, `@opentelemetry/api`
4. **Repository ADRs and plans** — local constraints and trade-offs
5. **Existing implementation** — evidence, not authority
6. **`starter-app-spike`** — pattern source only

Do not cargo-cult existing repo patterns or `starter-app-spike`. Always verify
against current official documentation first.

## Deployment Context

Default Oak runtime context:

1. Vercel Node.js
2. `apps/oak-curriculum-mcp-streamable-http`
3. `apps/oak-search-cli`

The standalone stdio MCP workspace is deprecated and is not a target for new
observability investment in this phase.

## Required External Reading

Before planning or implementation, consult live official documentation:

| Source | URL | Use for |
|--------|-----|---------|
| Sentry Node docs | `https://docs.sentry.io/platforms/javascript/guides/node/` | Init, traces, logs, shutdown, integrations |
| Sentry MCP monitoring docs | `https://docs.sentry.io/ai/monitoring/mcp/` | MCP Insights and capture policy |
| npm: `@sentry/node` | `https://www.npmjs.com/package/@sentry/node` | Package version and published surface |
| GitHub: `getsentry/sentry-javascript` | `https://github.com/getsentry/sentry-javascript` | Source and types |
| OpenTelemetry JS docs | `https://opentelemetry.io/docs/languages/js/` | Manual spans and trace context |
| OTel logs data model | `https://opentelemetry.io/docs/specs/otel/logs/data-model/` | Log record expectations |

## Required Local Reading

### Must-Read (always loaded)

| Document | Purpose |
|----------|---------|
| `docs/architecture/architectural-decisions/051-opentelemetry-compliant-logging.md` | Existing logging foundation |
| `docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md` | DI rules for sinks and adapters |
| `docs/architecture/architectural-decisions/128-stdio-workspace-retirement-and-http-transport-consolidation.md` | Runtime scope boundary |
| `docs/architecture/architectural-decisions/141-coherent-structured-fan-out-for-observability.md` | Chosen architecture for this phase |
| `.agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md` | Current implementation plan |

### Consult-If-Relevant

| Document | Load when |
|----------|-----------|
| `.agent/plans/architecture-and-infrastructure/future/observability-and-quality-metrics.plan.md` | Milestone/gate planning |
| `.agent/plans/agentic-engineering-enhancements/current/sentry-specialist-capability.plan.md` | Capability/discoverability work |
| `docs/agent-guidance/archive/sentry-guidance.md` | Historical patterns |
| `docs/governance/safety-and-security.md` | Privacy/redaction work |
| `.agent/plans/user-experience/public-alpha-experience-contract.md` | Public-alpha blocker alignment |

## Workflow

### 1. Understand the task

Identify which observability area is involved:

1. config/init
2. log sink / log routing
3. handled-error capture
4. tracing / spans
5. redaction
6. MCP wrapping
7. release / source maps / alerting

### 2. Consult official documentation

Fetch the current official Sentry and OpenTelemetry docs for the specific area.
Do not rely on cached knowledge.

### 3. Check Oak constraints

Apply Oak ADRs:

- coherent structured fan-out, not speculative async transport
- single redaction barrier before any sink
- Result-based init/config surfaces where reasonable
- HTTP server and Search CLI are in scope; deprecated standalone stdio is not

### 4. Plan or implement

Choose the simplest solution that remains strong over the long term. Long-term
architectural excellence wins over expedient layering.

### 5. Prepare for independent review

After implementation, invoke `sentry-reviewer` plus the standard reviewers that
match the change profile.

## Guardrails

- Never install separate OpenTelemetry SDK providers unless an ADR explicitly
  changes the strategy.
- Never bypass the shared telemetry redaction policy.
- Never scope redaction only to events and transactions; forwarded spans and
  forwarded logs must share the same redaction barrier.
- Never let `SENTRY_MODE=sentry` fail open on invalid DSN or invalid sampling
  config.
- Never treat `starter-app-spike` as authority.
- Never substitute this skill for the reviewer.
