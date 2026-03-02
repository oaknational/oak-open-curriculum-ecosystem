# Shared Error Library

**Status**: Iceboxed
**Original**: `architecture/shared-error-library-plan.md`
**Iceboxed**: 2026-02-23

## Concept

Extend `@oaknational/result` into a comprehensive error library with
typed error taxonomy (`ValidationError`, `TransportError`, `AuthError`),
adapters for third-party errors, and structured error context enrichment.

## Why Iceboxed

- `@oaknational/result` (at `packages/core/result/`) already provides
  the `Result<T, E>` pattern used across the codebase
- Per-service error types are cleaner than a unified error type (each
  service has different failure modes)
- No active milestone references this work
- Original plan dated 2025-11-06, no implementation started

## Reactivation Trigger

- Error handling patterns diverge significantly across services
- New services require shared error contracts
- External SDK consumers need stable, typed error contracts

## References

- `packages/core/result/` (existing Result pattern)
- Original plan contained error taxonomy design and migration strategy
