# Sentry Specialist Capability — Strategic Plan

**Status**: NOT STARTED
**Domain**: Agentic Engineering Enhancements
**Pattern**: [ADR-129 (Domain Specialist Capability Pattern)](../../../../docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md)
**Related Integration Plan**: [sentry-otel-integration.execution.plan.md](../../architecture-and-infrastructure/current/sentry-otel-integration.execution.plan.md)

## Problem and Intent

The repo has an established OpenTelemetry-compliant logging infrastructure
(ADR-051) and a pending Sentry integration plan (M3 blocker). Once Sentry is
integrated, agents will need specialist capability to assess Sentry/OTel usage
against current official documentation — covering SDK configuration, distributed
tracing, error tracking, performance monitoring, MCP Insights, alerting, and
OpenTelemetry instrumentation patterns.

Without a dedicated specialist, agents risk:

- inheriting local patterns that diverge from current Sentry SDK best practice
- misapplying OpenTelemetry concepts (e.g. provider conflicts from dual SDK installs)
- missing Sentry-native capabilities (MCP Insights, Logs API, breadcrumbs)
- conflating Sentry configuration with generic observability or security concerns

## Scope

### In scope

- Sentry SDK configuration and best practice (`@sentry/node`)
- OpenTelemetry instrumentation patterns (spans, traces, attributes)
- Sentry as OTel provider (not separate `@opentelemetry/*` SDKs)
- MCP server wrapping (`Sentry.wrapMcpServerWithSentry()`)
- MCP Insights dashboard configuration and verification
- Error tracking adapter patterns and level routing
- Distributed tracing with W3C TraceId correlation
- Alerting threshold design and configuration
- Performance monitoring and sampling strategies
- Source map upload configuration (Vercel/tsup)
- PII policy for MCP tool inputs/outputs (`recordInputs`/`recordOutputs`)
- `SENTRY_MODE` fixture toggle for credential-free local development

### Out of scope

- Generic logging concerns (covered by existing code-reviewer + ADR-051)
- Security vulnerability assessment (covered by security-reviewer)
- MCP protocol compliance (covered by mcp-reviewer)
- Infrastructure/deployment beyond Sentry-specific configuration
- Client-side/browser Sentry (no browser runtimes in this monorepo)

## Doctrine Hierarchy

1. **Current official Sentry documentation** — fetched live from docs.sentry.io
2. **Current official OpenTelemetry documentation** — fetched live from opentelemetry.io/docs
3. **Official packages** — `@sentry/node`, `@sentry/types`; `getsentry/sentry-javascript` on GitHub
4. **Repository ADRs and research** — ADR-051, Sentry integration ADR (pending), archived Sentry guidance
5. **Existing implementation** — evidence, not authority
6. **Reference implementation** — `~/code/personal/starter-app-spike/` as pattern source (not authority)

## Deployment Context

**Vercel (Node.js) + `@sentry/node`** is the default. Key constraints:

- HTTP MCP server runs on Vercel with stdout-only logging
- Stdio MCP server uses file-only logging (stdout reserved for MCP protocol)
- Search CLI uses both stdout and file sinks
- `@sentry/node` (not `@sentry/nextjs`) is the canonical SDK — no Next.js in this monorepo
- Sentry provides built-in OTel support — do NOT install separate `@opentelemetry/*` SDKs

## Capability Split

- **`sentry-reviewer`**: read-only specialist reviewer assessing Sentry/OTel
  correctness against official documentation
- **`sentry-expert`**: active workflow skill for planning, research, and
  implementation of Sentry/OTel features

## Deliverables

Following the ADR-129 triplet pattern:

1. Canonical reviewer template: `.agent/sub-agents/templates/sentry-reviewer.md`
2. Canonical skill: `.agent/skills/sentry-expert/SKILL.md`
3. Canonical situational rule: `.agent/rules/invoke-sentry-reviewer.md`
4. Platform adapters (Claude, Cursor, Codex) for reviewer, skill, and rule
5. Discoverability updates (AGENT.md, invoke-code-reviewers.md, collection indexes)
6. Validation (`subagents:check`, `portability:check`, `markdownlint:root`)

### Must-Read (always loaded)

| Document | Purpose |
|----------|---------|
| `docs/architecture/architectural-decisions/051-opentelemetry-compliant-logging.md` | OTel logging format and sink architecture |
| Sentry integration ADR (pending) | Sentry-as-OTel-provider strategy |
| `docs/agent-guidance/archive/sentry-guidance.md` | Historical Sentry patterns (archived but informative) |

### Consult-If-Relevant

- ADR-078 (dependency injection) — config and sink DI patterns
- ADR-033 (centralised log level configuration) — level routing
- Sentry MCP monitoring docs — MCP Insights dashboard
- Reference implementation patterns from starter-app-spike

## Overlap Boundaries

| Specialist | Owns | Does NOT own |
|-----------|------|-------------|
| **sentry-reviewer** | Sentry SDK usage, OTel instrumentation, MCP Insights config, alerting, tracing | Exploitability, MCP spec compliance, generic logging |
| **security-reviewer** | Exploitability of error handling, PII exposure via Sentry | Sentry SDK configuration correctness |
| **mcp-reviewer** | MCP protocol compliance, transport, session | MCP Insights dashboard, Sentry wrapping |
| **code-reviewer** | General code quality, gateway triage | Sentry/OTel domain knowledge |

## Dependencies and Sequencing

- The triplet MUST be created before or as the very first step of Sentry
  integration — so agents can review Sentry SDK usage as it's being written,
  catching mistakes during integration rather than after
- Depends on: ADR-129 pattern (done), portability infrastructure (done)
- Sequencing: create triplet → then begin Sentry integration execution plan

## Operational Tooling Consideration (ADR-137)

Sentry has a live external system (the Sentry project/dashboard). A future
fourth-layer operational tooling extension could include:

- Sentry API inspection (issue counts, error rates, release health)
- Alert configuration audit
- Source map upload verification
- MCP Insights dashboard health check

This is out of scope for the initial triplet but noted for ADR-137 alignment.

## Promotion Trigger

This plan promotes to `current/` when:

1. The Sentry integration execution plan begins or is about to begin
2. No conflicting work is in progress on the agent artefact layer
