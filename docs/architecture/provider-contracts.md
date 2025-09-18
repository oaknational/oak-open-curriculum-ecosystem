# Provider Contracts (Core ⇄ Providers)

Purpose: Define a small, behaviour‑level contract that all runtime providers must satisfy to ensure parity and prevent feature drift.

## What the contracts are

A compact set of behavioural checks for core runtime capabilities:

- Clock: `now()` returns a non‑decreasing number.
- Logger: accepts `debug/info/warn/error` calls without throwing.
- Storage: `set/get/delete` performs a round‑trip and delete clears the value.

These are not implementation tests. They verify behaviours that consumers rely on.

## What they prove

- All providers obey the same minimal semantics.
- Servers can be composed via configuration without changing behaviour.
- Core stays provider‑agnostic; providers only implement contracts.

## How they work

- Core exposes a testing helper:
  - Local testing helpers → `defineProviderContract(factory)`
  - You pass creators for `logger`, `clock`, and `storage`.
  - The helper returns sync/async checks you run in your test suite.

- Providers import this helper and run it against their implementations.

```ts
// providers-node example (integration test)
// Testing helpers are now defined locally in each package
import {
  createConsoleLogger,
  createInMemoryStorage,
  createNodeClock,
} from '@oaknational/mcp-providers-node';

const contract = defineProviderContract({
  createLogger: () => createConsoleLogger('test'),
  createClock: () => createNodeClock(),
  createStorage: () => createInMemoryStorage(),
});

contract.clockBehavesMonotonically();
contract.loggerAcceptsMessages();
await contract.storageRoundtrip();
```

## Design principles

- Behaviour‑only (no internal details or types).
- No network or filesystem IO in tests; simple fakes only.
- Deterministic and fast.
- Portable across environments (Node, Cloudflare, etc.).

## Guidance for new providers

1. Implement the minimal Core contracts

- `CoreClock.now(): number`
- `CoreLogger.{debug,info,warn,error}(message: string, context?: unknown)`
- `CoreStorage.{get,set,delete}(key: string, value?: unknown): Promise<...>`

2. Add tests using the contract helper

- Create a `{provider}/src/index.integration.test.ts` and invoke all checks.
- Avoid side effects; spy on console if needed.

3. Keep scope minimal

- If you add more provider features, extend tests in provider package, not the core contract. Core contract stays minimal.

## FAQs

- Why not test more behaviours?
  - The contract is a safety net, not a full conformance suite. Keep it small to avoid coupling and friction.
- Where are these used?
  - In every provider package. CI runs them as part of the monorepo test gate.
- How do these relate to server DI?
  - Servers depend on the core contracts. Providers supply implementations; the contract ensures they behave equivalently.
