# Invoke Sentry Reviewer

When changes touch Sentry-specific or OpenTelemetry-observability-specific
concerns, invoke the `sentry-reviewer` specialist in addition to the standard
`code-reviewer` gateway.

## Trigger Conditions

Invoke `sentry-reviewer` when the change involves:

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

Do not invoke `sentry-reviewer` for:

- generic logging style or message wording
- architecture questions unrelated to observability
- security-only concerns with no Sentry/OTel design component
- MCP protocol questions unrelated to Sentry wrapping

## Overlap Boundaries

- **`code-reviewer`**: always invoke as the gateway. `sentry-reviewer` adds
  Sentry and OpenTelemetry depth.
- **`security-reviewer`**: add when Sentry work touches secrets, PII,
  retention, or redaction boundaries.
- **`mcp-reviewer`**: add when MCP wrapping or Insights work could affect
  MCP protocol or transport semantics.
- **Architecture reviewers**: add when the logger foundation, package
  boundaries, or dependency direction change.

## Invocation

See `.agent/directives/invoke-code-reviewers.md` for the full reviewer
catalogue and invocation policy. The `sentry-reviewer` canonical template is
at `.agent/sub-agents/templates/sentry-reviewer.md`.
