---
name: "Generic Factory for DI Composition"
use_this_when: "A DI interface exposes multiple factory functions that callers always compose in the same order"
category: code
proven_in: "apps/oak-curriculum-mcp-streamable-http (ToolHandlerDependencies 5→2 members)"
proven_date: 2026-03-28
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Tests re-implementing the factory composition chain (31 lines of mock setup)"
  stable: true
---

# Generic Factory for DI Composition

## Problem

A DI interface exposes multiple factory functions (e.g. `createClient`,
`executeCall`, `createExecutor`) that every caller composes in the same
order. Tests must re-implement this composition chain, producing verbose
mocks that duplicate production wiring logic.

## Anti-pattern

```typescript
interface Dependencies {
  createClient: (key: string) => Client;
  executeCall: (name: string, args: unknown, client: Client) => Promise<Result>;
  createExecutor: (deps: ExecutorDeps) => Executor;
}
// Tests: 30+ lines re-implementing the composition
```

## Pattern

Collapse the composition into a single generic factory function. Use a
type parameter for the internal dependency (e.g. client type) so the
factory preserves type safety between its own steps without exposing
the internal type to callers.

```typescript
interface RequestExecutorConfig<TClient> {
  apiKey: string;
  createClient: (key: string) => TClient;
  executeCall: (name: string, args: unknown, client: TClient) => Promise<Result>;
  createExecutor: (deps: ExecutorDeps) => Executor;
}

// DI interface: callers see one function, not three
interface Dependencies {
  createRequestExecutor: (config: PerRequestConfig) => Executor;
}

// Tests: 3 lines
const deps = { createRequestExecutor: vi.fn(() => vi.fn()) };
```

## Key insight

The generic `TClient` is erased at the DI boundary — callers of
`createRequestExecutor` never see it. The factory owns the type-safe
composition internally. This is the interface segregation principle
applied to factory composition: expose the capability, not the recipe.
