# ADR-042: Adopt `packages/runtime-adapters/` for runtime integrations

Status: Accepted

## Context

We need a clear, neutral name for platform-specific implementations of `@oaknational/mcp-core` provider contracts (logger, clock, storage, etc.). Historically these lived under `packages/providers/`.

## Decision

Adopt `packages/runtime-adapters/` as the home for runtime/platform implementations (e.g., Node, Cloudflare Workers). Update docs/plans accordingly.

## Consequences

- Improves clarity: distinguishes core contracts from adapter implementations.
- Aligns with DI/refinements and upcoming serverless support.
- No code moves required immediately; applies to new/adapted packages (e.g., Workers adapter).

## References

- Architectural Refinements Plan
- Serverless Hosting Plan
- Provider System Overview
