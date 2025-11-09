# ADR-051: OpenTelemetry-Compliant Single-Line JSON Logging

## Status

Proposed (2025-11-08)

**Supersedes**: ADR-017 (Consola for Logging)

## Context

Our current logging implementation uses Consola for pretty-printing logs to stdout. During Phase 2 observability work (correlation IDs, timing metrics, error enrichment), we discovered several production-readiness issues:

### Current State Problems

1. **Multi-Line Pretty-Printing**: Consola outputs logs as multi-line, human-readable text
   - Breaks log parsers (grep, jq, log aggregation tools)
   - Cannot be ingested by standard observability platforms
   - Difficult to parse programmatically

2. **Not Production-Ready**: Logs are optimized for development, not production
   - No standard format for log aggregation (Datadog, Kibana, Google Cloud Logging)
   - Missing required fields for distributed tracing
   - Incompatible with industry-standard log analysis tools

3. **Unnecessary Dependency**: Consola adds ~200KB to bundle size
   - Only used for formatting
   - Provides features we don't need (emojis, fancy colors)
   - Can be replaced with simpler, native approaches

### Industry Standards

OpenTelemetry Logs Data Model is the canonical standard for structured logging, supported by:

- Datadog
- Google Cloud Logging
- Elastic (Kibana)
- Splunk
- AWS CloudWatch
- Azure Monitor
- All major observability platforms

## Decision

Remove Consola completely and implement OpenTelemetry-compliant single-line JSON logging across all environments (development and production).

### Log Format Specification

```typescript
interface OpenTelemetryLogRecord {
  Timestamp: string; // ISO 8601 timestamp
  ObservedTimestamp: string; // ISO 8601 (when log was observed)
  SeverityNumber: number; // 1-24 (OpenTelemetry severity enum)
  SeverityText: string; // "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL"
  Body: string; // Log message
  Attributes: {
    // Context data
    [key: string]: unknown;
    correlationId?: string;
    duration?: string;
    durationMs?: number;
    // ... semantic conventions
  };
  Resource: {
    // Service identification
    'service.name': string;
    'service.version': string;
    'deployment.environment': string;
    'host.name'?: string;
    'cloud.provider'?: string;
    'cloud.region'?: string;
  };
  TraceId?: string; // W3C trace ID (hex)
  SpanId?: string; // W3C span ID (hex)
  TraceFlags?: number; // W3C trace flags
}
```

### Implementation Approach

1. **Unified Logger**: Single logger implementation, multiple sinks
   - `UnifiedLogger` class replaces `MultiSinkLogger` and `ConsolaLogger`
   - Same logic for all output destinations
   - No Consola dependency

2. **Output Sinks**: Transport-specific sinks with identical format
   - `StdoutSink`: Writes single-line JSON to `process.stdout`
   - `FileSink`: Writes single-line JSON to file
   - Both produce identical OpenTelemetry-compliant JSON

3. **Resource Attributes**: Environment-based service identification
   - `ENVIRONMENT_OVERRIDE` env var (highest priority)
   - Vercel environment variables (`VERCEL_ENV`, `VERCEL_REGION`, etc.)
   - Fallback to `'development'`

4. **Severity Mapping**:
   - TRACE → 1 (TRACE)
   - DEBUG → 5 (DEBUG)
   - INFO → 9 (INFO)
   - WARN → 13 (WARN)
   - ERROR → 17 (ERROR)
   - FATAL → 21 (FATAL)

5. **Single-Line Everywhere**: JSON Lines (JSONL) format
   - One JSON object per line
   - Terminated with `\n`
   - No pretty-printing in any environment
   - Human readability via `jq` when needed

## Rationale

### Why Remove Consola

1. **Production Requirements**: Multi-line logs are incompatible with log aggregation
2. **Bundle Size**: ~200KB reduction with no functional loss
3. **Simplicity**: Native `process.stdout.write()` is simpler and faster
4. **Industry Standard**: OpenTelemetry is the universal format

### Why OpenTelemetry Format

1. **Universal Compatibility**: Works with all major observability platforms
2. **Future-Proof**: Foundation for OpenTelemetry SDK integration
3. **Semantic Conventions**: Standard attribute names and meanings
4. **Distributed Tracing**: Built-in support for trace context

### Why Single-Line JSON Everywhere

1. **Parser Compatibility**: Works with `jq`, `grep`, `awk`, standard Unix tools
2. **Consistency**: Same format in development and production
3. **Simplicity**: One code path, no environment-specific logic
4. **Performance**: Faster parsing and ingestion
5. **Temporary Human Readability**: `tail -f logs | jq` when needed

### Why No Backwards Compatibility

Per `.agent/directives-and-memory/rules.md` and `docs/agent-guidance/testing-strategy.md`:

- We iterate quickly and fix forward
- Breaking changes are acceptable when justified
- No legacy logger users to support (internal-only package)

## Consequences

### Positive

1. **Production-Ready Logs**: Immediate compatibility with all log aggregation platforms
2. **Reduced Bundle Size**: ~200KB smaller, faster builds
3. **Simpler Codebase**: One logger implementation, no conditional logic
4. **Better Performance**: Direct stdout writes, no formatting overhead
5. **Industry Standard**: OpenTelemetry compliance opens all doors
6. **Future-Proof**: Ready for OpenTelemetry SDK integration (separate ADR coming)
7. **Consistent**: Same format everywhere eliminates environment-specific bugs

### Negative

1. **Development Experience**: Logs less human-readable in terminal
   - **Mitigation**: `pnpm dev | jq` or `tail -f logs | jq` for pretty output
   - **Mitigation**: Most debugging uses file logs anyway

2. **Breaking Change**: Log format changes completely
   - **Mitigation**: No external consumers (internal package only)
   - **Mitigation**: No backwards compatibility needed (per rules)

3. **Learning Curve**: Team needs to learn `jq` for log inspection
   - **Mitigation**: Simple commands documented in READMEs
   - **Mitigation**: Better long-term skill (industry standard)

## Implementation Plan

See `.agent/plans/opentelemetry-logging-implementation.md` (linked from Session 3.B in main plan) for detailed implementation tasks.

### High-Level Steps

1. Create `otel-format.ts` with OpenTelemetry log record formatting
2. Create `resource-attributes.ts` with environment-based resource building
3. Create `UnifiedLogger` class with single-line JSON output
4. Create `StdoutSink` and update `FileSink` for pre-formatted strings
5. Update entry points (`adaptive.ts`, `adaptive-node.ts`) to use UnifiedLogger
6. Remove Consola files and dependency
7. Update all tests for new format
8. Update documentation with `jq` examples

### Validation

- All logs output as single-line JSON
- `tail -f logs | jq .` parses successfully
- All required OpenTelemetry fields present
- Resource attributes populated from environment
- Quality gates pass (738+ tests)

## Related Decisions

- **ADR-017**: Superseded by this decision
- **ADR-033**: Centralised Log Level Configuration (still applies)
- **ADR-024**: Dependency Injection Pattern (still applies to logger creation)
- **Future ADR**: OpenTelemetry SDK Integration (separate decision, builds on this)

## References

- [OpenTelemetry Logs Data Model](https://opentelemetry.io/docs/specs/otel/logs/data-model/)
- [OpenTelemetry Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/)
- [JSON Lines Format](https://jsonlines.org/)
- Phase 2 Observability Work: `.agent/plans/mcp-oauth-implementation-plan.md` (Sessions 2.1-2.5)
- Implementation Plan: Session 3.B in main plan

## Timeline

- **Proposed**: 2025-11-08
- **Target Implementation**: Session 3.B (next work session)
- **Full Rollout**: With Phase 3 production deployment

---

**Note**: This ADR focuses on the log format change. A separate ADR will cover full OpenTelemetry SDK integration (OTLP exporters, automatic instrumentation, etc.) as future work.
