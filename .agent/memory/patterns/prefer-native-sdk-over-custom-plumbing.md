---
title: "Prefer Native SDK Over Custom Plumbing"
category: architecture
barrier_met: true
source_sessions: ["2026-04-14d"]
---

# Prefer Native SDK Over Custom Plumbing

## Pattern

When a library or SDK provides a capability natively, use it
instead of maintaining custom plumbing that reimplements the
same functionality.

## Anti-pattern

Building and maintaining a custom wrapper layer (types,
interfaces, DI seams, tests) for functionality that the
upstream SDK already provides. The custom layer falls behind
the SDK's feature set, requires maintenance when the SDK
changes, and prevents adopting new SDK capabilities.

## Application

Before extending a custom adapter layer, check whether the
upstream SDK has added native support. If it has:

1. Adopt the native mechanism for the primary (live) mode
2. Retain the custom layer only for modes where the native
   mechanism cannot operate (e.g. fixture/test recording)
3. Gate the wrapping strategy on mode at the composition root
4. Document the mode split — future maintainers need to
   understand why two paths exist

## Evidence

`@oaknational/sentry-mcp` provided custom per-handler MCP
observation wrapping. Sentry SDK v10.47.0 added
`wrapMcpServerWithSentry()` which is a strict superset
(transport correlation, error classification, 20+ OTel
attributes). Barney: "custom plumbing where a library provides
the mechanism is a violation."
