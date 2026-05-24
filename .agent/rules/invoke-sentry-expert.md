# Invoke Sentry Expert

Operationalises [ADR-129 (Domain Specialist Capability Pattern)](../../docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md) and [ADR-143 (Coherent Structured Fan-Out for Sentry and OpenTelemetry)](../../docs/architecture/architectural-decisions/143-coherent-structured-fan-out-for-observability.md).

When changes touch Sentry-specific or OpenTelemetry-observability-specific
concerns, invoke the `sentry-expert` specialist in addition to the standard
`code-expert` gateway.

## Trigger Conditions

Invoke `sentry-expert` when the change involves:

- `@sentry/node` configuration or initialisation
- Sentry environment-variable contracts (`SENTRY_MODE`, DSN, release,
  sampling, logs, debug, PII flags)
- Sentry log sinks, handled-error capture, or breadcrumb policy
- OpenTelemetry span helpers or active trace-context correlation in logging
- shared telemetry redaction used for forwarded events or transactions
- Sentry MCP wrapping, MCP Insights, or capture-policy changes
- release resolution, source-map wiring, or Sentry alerting/evidence flows
- `@oaknational/observability` or `@oaknational/sentry-node`

## Non-Goals

Do not invoke `sentry-expert` for:

- generic logging style or message wording
- architecture questions unrelated to observability
- security-only concerns with no Sentry/OTel design component
- MCP protocol questions unrelated to Sentry wrapping

## Overlap Boundaries

- **`code-expert`**: always invoke as the gateway. `sentry-expert` adds
  Sentry and OpenTelemetry depth.
- **`security-expert`**: add when Sentry work touches secrets, PII,
  retention, or redaction boundaries.
- **`mcp-expert`**: add when MCP wrapping or Insights work could affect
  MCP protocol or transport semantics.
- **Architecture reviewers**: add when the logger foundation, package
  boundaries, or dependency direction change.

## Invocation

See `.agent/memory/executive/invoke-code-experts.md` for the full reviewer
catalogue and invocation policy. The `sentry-expert` canonical template is
at `.agent/sub-agents/templates/sentry-expert.md`.
