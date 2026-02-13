# Provider System Overview

This document explains how providers integrate with the lib packages, how apps compose a runtime, and how dependencies are injected. For a broader context, see the [Architecture index](./README.md) and onboarding in [Developer Onboarding](../development/onboarding.md).

## Concepts

- Lib packages: interfaces and utilities for logger, storage, transport, and environment. No provider imports.
- Providers (e.g., `@oaknational/mcp-providers-node`): implement `CoreProviders` (logger, clock, storage, etc.).
- Apps: read config, select provider set, call `createRuntime`, pass runtime into tools/integrations.

## Composition

```ts
// Runtime composition is now handled locally in each app
import { createNodeClock } from '@oaknational/mcp-providers-node';
import { createInMemoryStorage } from '@oaknational/mcp-providers-node';

const runtime = createRuntime({
  logger: /* bridge your app logger to CoreLogger shape */,
  clock: createNodeClock(),
  storage: createInMemoryStorage(),
});
// Pass runtime to app wiring and tool registration
```

## Design Rules

- Inter‑workspace via `@oaknational/*` package imports.
- Intra‑package relatives allowed; avoid private/internal subpaths.
- Core stays pure (no provider imports).

## Cloudflare (Workers) Considerations

- Target web APIs only; avoid Node built‑ins in provider code.
- Validate with a Workers build target and contract tests.

## Testing

- Contract tests live in core (`testing/provider-contract`).
- Providers run the shared suite to ensure parity.

## Next

- Adopted naming: `packages/runtime-adapters/` for runtime adapter implementations; document boundaries.
