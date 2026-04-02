# @oaknational/observability

Provider-neutral observability helpers for Oak runtimes.

This workspace owns two shared concerns:

- recursive telemetry redaction that can be reused by logs, spans, breadcrumbs,
  and Sentry hooks, including URL/query values and raw form-encoded OAuth
  bodies
- OpenTelemetry API helpers for reading active span context and running manual
  spans without depending on a concrete runtime transport
