---
name: "satisfies for Mock Completeness"
use_this_when: "A test mock implements an interface and you need compile-time proof that all methods are present"
category: testing
proven_in: "apps/oak-curriculum-mcp-stdio/src/app/startup.integration.test.ts"
proven_date: 2026-03-03
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Incomplete mocks that satisfy the test but break when a different code path exercises an unimplemented method"
  stable: true
---

# satisfies for Mock Completeness

## Problem

Test mocks often implement only the methods exercised by the current
test. The mock compiles because TypeScript infers its type from the
object literal — no constraint forces it to match the full interface.
When product code later calls an unimplemented method, the failure is
a runtime `TypeError`, not a compile-time error.

## Pattern

Annotate the mock factory with `satisfies Interface` so the compiler
verifies every required member is present:

```typescript
function createLoggerMock() {
  return {
    trace: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
  } satisfies Logger;
}
```

If a method is missing or misspelled, `satisfies` produces an
immediate compile error at the mock definition — not a scattered
runtime failure in a future test run.

## Anti-Pattern

```typescript
const loggerMock = {
  info: vi.fn(),
  error: vi.fn(),
};
// Compiles: TypeScript infers { info, error } — no constraint.
// Breaks at runtime when product code calls loggerMock.warn().
```

## Why It Works

`satisfies` checks structural compatibility without widening the
inferred type. The mock retains its narrow type (so `vi.fn()` call
tracking works), but the compiler guarantees it implements the full
interface. When the interface gains a new method, every mock factory
using `satisfies` fails to compile until updated.

## When NOT to Use

When the code under test genuinely needs only a subset of the
interface, use **Interface Segregation** instead (narrow the interface
at the product-code boundary). `satisfies` is for cases where the
mock truly represents a full implementation of the interface.

## Related

- [Interface Segregation for Test Fakes](interface-segregation-for-test-fakes.md) — complementary pattern for narrowing interfaces
- [ADR-078: Dependency Injection for Testability](../../docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md)
