---
name: "Infrastructure operations never mask business logic"
use_this_when: "Recording telemetry, flushing buffers, or ending spans in a catch/finally block"
category: error-handling
proven_in: "packages/libs/sentry-mcp/src/wrappers.ts, apps/oak-curriculum-mcp-streamable-http/src/observability/span-helpers.ts"
---

# Infrastructure Operations Never Mask Business Logic

## Principle

When infrastructure operations (telemetry recording, span lifecycle,
metric emission, buffer flushing) run alongside business logic, guard
them so their failures never propagate to the caller. The caller cares
about the business result or error, not whether the span ended cleanly.

## Anti-pattern

```typescript
try {
  const result = await handler();
  recorder.record({ status: 'success' }); // If this throws, success becomes failure
  return result;
} catch (error) {
  recorder.record({ status: 'error' }); // If this throws, original error is lost
  throw error;
}
```

## Pattern

```typescript
function safeRecord(recorder: Recorder, observation: Observation): void {
  try {
    recorder.record(observation);
  } catch {
    // Infrastructure failures must never mask business logic.
  }
}

try {
  const result = await handler();
  safeRecord(recorder, { status: 'success' });
  return result;
} catch (error) {
  safeRecord(recorder, { status: 'error' });
  throw error;
}
```

## Why

In production, telemetry infrastructure can fail for many reasons
(network issues, quota exhaustion, serialisation errors). If a
recorder throw turns a successful handler result into a thrown
error, or replaces the original handler error with a recorder
error, the system behaves incorrectly and the diagnostic signal
is lost. The guard ensures the business contract is always
honoured regardless of infrastructure health.
