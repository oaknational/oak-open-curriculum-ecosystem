# @oaknational/observability

Provider-neutral observability helpers for Oak runtimes.

This workspace owns four shared concerns:

- **Recursive telemetry redaction** (`redactTelemetryValue`, `redactTelemetryObject`, `redactHeaderRecord`, `redactHeaderValue`, `REDACTED_VALUE`) — the non-bypassable redaction policy applied before any fan-out path reaches the network. Covers URL/query values and raw form-encoded OAuth bodies as well as already-parsed objects. See [ADR-160](../../../docs/architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md).
- **Value-level redaction primitives** (`redactText`, `redactUnknownValue`, `redactJsonObject`, `redactStringRecord`) — thin wrappers every Sentry adapter (Node today, browser under L-12 tomorrow) composes onto its vendor-typed event shapes. The adapters own their own event-shape wiring because vendor `Event`/`Breadcrumb`/`Exception`/`Log`/`Span` types diverge between runtimes.
- **JSON sanitisation** (`sanitiseForJson`, `sanitiseObject`, `isJsonValue`) — converts arbitrary values to JSON-safe form (primitives pass through; `undefined` becomes `null`; `Date` becomes ISO string; `Error` becomes `{message, name, stack}`; arrays/objects recurse; unserialisable values become `'[unserializable]'`; circular references become `'[Circular]'`).
- **OpenTelemetry span context** (`getActiveSpanContextSnapshot`, `withActiveSpan`) — read the active span context and run manual spans without depending on a concrete runtime transport.

## Canonical JSON-safe type

`JsonValue` and `JsonObject` are the **single canonical** recursive JSON-safe shape for the whole observability pipeline. This shape was previously defined twice — as `JsonValue`/`JsonObject` inside `@oaknational/logger` and as `TelemetryValue`/`TelemetryRecord` inside `@oaknational/observability` — with both pairs structurally identical; the two pairs were consolidated into this single canonical pair on 2026-04-19 (see the [ADR-160 history entry](../../../docs/architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md#history)).

## Browser safety

This workspace is browser-safe by construction: no `@sentry/*` imports, no `node:*` imports in runtime source. Enforced structurally by `src/no-node-only-imports.unit.test.ts`. The future `@sentry/browser` widget adapter (Wave 4 L-12) will compose these primitives directly; no intermediate extraction is required.

## Boundaries

- `@oaknational/observability` depends on: `@oaknational/type-helpers`, `@opentelemetry/api`. Zero lib-tier dependencies (ADR-041).
- Consumers: `@oaknational/logger` (for sanitisation + redaction in log context handling), `@oaknational/sentry-node` (for the primitives composed onto Sentry event shapes), apps composing observability directly.
