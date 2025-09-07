# Provider System Overview

This document explains how providers integrate with `@oaknational/mcp-core`, how apps compose a runtime, and how dependencies are injected.

## Concepts
- Core (`@oaknational/mcp-core`): interfaces and `createRuntime(providers)` factory. No provider imports.
- Providers (e.g., `@oaknational/mcp-providers-node`): implement `CoreProviders` (logger, clock, storage, etc.).
- Apps: read config, select provider set, call `createRuntime`, pass runtime into tools/integrations.

## Composition
```ts
import { createRuntime } from '@oaknational/mcp-core';
import { nodeProviders } from '@oaknational/mcp-providers-node';

const runtime = createRuntime(nodeProviders);
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
- Decide on folder naming (`providers/` vs alternatives) and document boundaries.
