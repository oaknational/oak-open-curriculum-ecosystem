---
name: "Narrow re-exports at package boundaries"
use_this_when: "A wrapper library re-exports types from an underlying SDK"
category: code
proven_in: "packages/libs/sentry-node/src/index.ts"
---

# Narrow Re-exports at Package Boundaries

## Principle

When a wrapper library encapsulates an underlying SDK, re-export
only the narrowest types consumers actually need — not the SDK's
configuration bags or wide utility types.

## Anti-pattern

```typescript
// sentry-node/index.ts — leaks SDK shape
export type { NodeOptions, CaptureContext } from '@sentry/node';
```

The consumer now has a structural dependency on the SDK's full
configuration type. Nothing constrains which properties they use,
and SDK version bumps break consumers directly.

## Pattern

Derive narrow types inside the lib and export those:

```typescript
// sentry-node/types.ts — controlled surface
export type SentryErrorEvent = Parameters<NonNullable<NodeOptions['beforeSend']>>[0];
export type SentryBreadcrumb = Parameters<NonNullable<NodeOptions['beforeBreadcrumb']>>[0];

// sentry-node/index.ts — narrow exports
export type { SentryErrorEvent, SentryBreadcrumb } from './types.js';
```

The consumer imports only what they need. The lib owns the
mapping and absorbs SDK changes.

## Why

Wide re-exports defeat the purpose of the encapsulation boundary.
A consumer that imports `NodeOptions` can access any property,
creating invisible coupling. When the SDK changes `NodeOptions`,
every consumer breaks — not just the lib that wraps it.
