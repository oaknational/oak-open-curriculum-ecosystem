# Logger, Sentry, and OpenTelemetry Integration

**Status**: Iceboxed
**Original**: `architecture/logger-sentry-otel-integration-plan.md`
**Iceboxed**: 2026-02-23

## Concept

Integrate the Sentry SDK and OpenTelemetry SDK with the existing
`@oaknational/mcp-logger` package. Covers: correlation ID flow,
Sentry error capture, OTel trace/span instrumentation, and
environment-specific configuration.

## Why Iceboxed

- No Sentry SDK or OpenTelemetry SDK is currently in the codebase
- ADR-051 covers OTel-compliant log **format** only, not SDK integration
- Logger DI foundation is ready (pure DI, injected sinks, no hidden
  dependencies) — the architecture supports future integration
- Original plan dated 2025-11-11, no implementation started
- No active milestone references this work

## Reactivation Trigger

- Production deployment requires observability beyond structured logs
- Error tracking or distributed tracing becomes a requirement
- Milestone planning includes Sentry or OTel as a deliverable

## References

- ADR-051 (OpenTelemetry-compliant logging format)
- `packages/libs/logger/` (current logger architecture)
- Logger DI fixes (2026-02-23) established the injectable pattern
