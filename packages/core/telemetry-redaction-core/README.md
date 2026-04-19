# @oaknational/telemetry-redaction-core

Runtime-agnostic, browser-safe **telemetry redaction primitives** composed by
every Sentry adapter in the Oak stack.

## Why this workspace exists

[ADR-160](../../../docs/architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md)
establishes the **non-bypassable redaction barrier** as a closure property:
every fan-out path that carries telemetry beyond the stdout sink MUST apply
the shared redaction policy before the destination receives the data. The
closure holds across runtimes — Node today and browser under L-12 tomorrow.

`@oaknational/sentry-node` cannot be the home of the shared policy because it
transitively imports `@sentry/node`, which pulls Node-only built-ins
(`net`, `tls`, `http`, `crypto`) a browser bundle cannot tolerate. This
workspace is the minimum boundary: **a separate package with zero `@sentry/*`
dependencies** that both runtimes compose.

See ADR-160's [§Closed Questions](../../../docs/architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md#closed-questions-2026-04-17)
for the decision record.

## What this workspace ships

**Value-level primitives only**:

| Export                 | Purpose                                                                             |
| ---------------------- | ----------------------------------------------------------------------------------- |
| `redactText`           | Redact a free-text string using the shared telemetry policy                         |
| `redactUnknownValue`   | Sanitise an unknown value to JSON-safe form, then redact it                         |
| `redactJsonObject`     | Sanitise and redact a JSON-shaped object; returns `undefined` for non-object inputs |
| `redactStringRecord`   | Redact a `Record<string, string>` using the header-aware policy                     |
| `describeUnknownError` | Normalise an unknown error-like value into a displayable message                    |

## What this workspace does _not_ ship

**Event-shape redactors.** Each vendor adapter — `@oaknational/sentry-node`
today, the browser adapter tomorrow — owns its own event-shape wiring
(`Event`, `Breadcrumb`, `Exception`, `Log`, `Span`, `TransactionEvent`).

Why this decomposition: preserving vendor-specific event types through a
shared neutral helper requires type assertions that the repository's
[`no-type-shortcuts` rule](../../../.agent/rules/no-type-shortcuts.md)
forbids. The _value-level_ redaction is genuinely neutral; _event-shape_
redaction is vendor-specific. Decomposing at this tension keeps the core
pure and each adapter typed to its own vendor.

## Composition pattern

```ts
// Adapter (sentry-node):
import {
  redactText,
  redactJsonObject,
  redactStringRecord,
  redactUnknownValue,
} from '@oaknational/telemetry-redaction-core';
import type { Breadcrumb } from '@sentry/node';

export function redactSentryBreadcrumb(b: Breadcrumb): Breadcrumb {
  return {
    ...b,
    ...(b.message !== undefined ? { message: redactText(b.message) } : {}),
    ...(b.data !== undefined ? { data: redactJsonObject(b.data) } : {}),
  };
}
```

The adapter's function keeps its vendor-typed signature; the core provides
the value-level primitives that redact each field.

## Invariants

1. **Zero `@sentry/*` imports** — enforced by the
   [`zero-sentry-imports.unit.test.ts`](./src/zero-sentry-imports.unit.test.ts)
   structural scan. Any `import '@sentry/*'` in `src/**/*.ts` fails the gate.
2. **Node + browser composable** — dependencies limited to
   `@oaknational/logger`, `@oaknational/observability`, and
   `@oaknational/type-helpers`, all of which are themselves runtime-neutral.
3. **Value-level only** — event-shape redactors live in adapters. If a new
   helper needs vendor type awareness, it belongs in the consuming adapter,
   not here.

## Adding a new adapter

1. Create the adapter workspace (e.g. `@oaknational/sentry-browser`).
2. Add `@oaknational/telemetry-redaction-core` as a `workspace:*` dependency.
3. Author event-shape redactors in the adapter, typed to the vendor's
   concrete event types, composing primitives from this workspace.
4. Add a per-workspace conformance test that asserts the adapter's
   composed options apply the redactor to every fan-out path
   (ADR-160 closure property, per-consuming-workspace test location).

## Related

- [ADR-160](../../../docs/architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md)
  — The non-bypassable redaction barrier closure property.
- [ADR-143](../../../docs/architecture/architectural-decisions/143-coherent-structured-fan-out-for-observability.md)
  — Parent observability architecture.
- [ADR-154](../../../docs/architecture/architectural-decisions/154-separate-framework-from-consumer.md)
  — Framework vs. consumer separation (this workspace is the framework; the
  Node and browser Sentry adapters are consumers).
- [ADR-162](../../../docs/architecture/architectural-decisions/162-observability-first.md)
  — Observability-first with vendor-independence clause.
- [`@oaknational/observability`](../observability/README.md)
  — Provides the underlying recursive redaction policy (`redactTelemetryValue`,
  `redactTelemetryObject`, `redactHeaderValue`).
- [`@oaknational/sentry-node`](../../libs/sentry-node/README.md)
  — First consumer; owns Node-side event-shape redactors.
