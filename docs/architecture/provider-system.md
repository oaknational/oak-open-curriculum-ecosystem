# Provider System Overview

> **Status**: STALE — the `@oaknational/mcp-providers-node` package referenced
> below has been deleted. Provider functionality (logger, clock, storage) is now
> composed directly in each app's composition root. The DI pattern and design
> principles described here remain valid conceptually. This document needs a
> full rewrite to reflect the current architecture.

This document explains how providers integrate with the lib packages, how apps compose a runtime, and how dependencies are injected. For a broader context, see the [Architecture index](./README.md) and onboarding in [Developer Onboarding](../development/onboarding.md).

## Concepts

- Lib packages: interfaces and utilities for logger, storage, transport, and environment. No provider imports.
- Apps: read config, compose providers locally (logger, clock, storage), and pass them into tools/integrations via DI.

## Composition

```ts
// Runtime composition is handled locally in each app's composition root
// Provider implementations are defined per-app, not in a shared package
import { loadRuntimeConfig } from '@oaknational/env';

const config = loadRuntimeConfig(process.env);
// Each app composes its own logger, clock, and storage
```

## Design Rules

- Inter-workspace via `@oaknational/*` package imports.
- Intra-package relatives allowed; avoid private/internal subpaths.
- Core stays pure (no provider imports).

## Testing

- Provider behaviour is verified through integration tests in each app.
- The DI pattern ensures testability via injectable dependencies.
