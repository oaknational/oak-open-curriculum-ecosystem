---
name: provider-neutral-types-at-boundaries
category: architecture
barrier_met: true
proven_by: "Sentry adapter extension 2026-04-13 — 4 reviewers independently converged: app-layer interfaces must not import adapter types"
---

# Provider-Neutral Types at Adapter Boundaries

## Pattern

When an adapter wraps a third-party provider (Sentry, Clerk,
Elasticsearch, etc.), the app-layer interface that callers use
should define its own types that mirror the provider's shapes
without importing them. The adapter factory maps between the
two.

## Anti-pattern

Importing provider types directly into app-layer interfaces:
`setUser(user: SentryUser)` on `HttpObservability`. This leaks
the provider dependency through the abstraction boundary. A
provider change forces edits at every call site, not just the
factory.

## Correct approach

```typescript
// App layer — provider-neutral
interface ObservabilityUser {
  readonly id: string;
  readonly username?: string;
}

interface HttpObservability {
  setUser(user: ObservabilityUser | null): void;
}

// Factory — maps to provider type
function buildObservability(sentryRuntime) {
  return {
    setUser(user) { sentryRuntime.setUser(user); }
  };
}
```

## Why this matters

The mapping is one line today. At provider-migration time, it
saves touching every caller. The cost of defining the neutral
type is trivial; the cost of not doing it compounds with each
caller.
