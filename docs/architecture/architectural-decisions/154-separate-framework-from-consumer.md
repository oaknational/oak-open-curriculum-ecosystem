# ADR-154: Separate Framework from Consumer

**Status**: Accepted
**Date**: 2026-04-10
**Related**: [ADR-006](006-cellular-architecture-pattern.md) — cellular
architecture, [ADR-108](108-sdk-workspace-decomposition.md) — SDK workspace
decomposition, [ADR-148](148-design-token-architecture.md) — design tokens
already follow this pattern

## Context

During workspace topology analysis of the monorepo's dependency graph, a
recurring structural problem emerged: modules that mix general-purpose
mechanism with Oak-specific configuration. When a module contains both the
reusable framework (e.g. a logging pipeline, a token resolution algorithm,
a build tool) and the domain-specific consumer (e.g. Oak resource
attributes, Oak colour palette, Oak MCP server composition), several
problems compound:

1. **Testing becomes entangled.** Tests for the mechanism require
   Oak-specific fixtures; tests for Oak behaviour require understanding
   the mechanism internals.
2. **Reuse is blocked.** The mechanism cannot be extracted or shared
   without carrying Oak-specific dependencies.
3. **Classification is ambiguous.** The module resists clean placement
   in the tier model because it spans multiple concerns.
4. **Change risk spreads.** A change to the mechanism risks breaking
   Oak configuration, and vice versa.

The `@oaknational/logger` package is a concrete example: it contains
both the general-purpose `UnifiedLogger` (mechanism) and Oak-specific
`buildResourceAttributes` / Express middleware (consumer). The
`design-tokens-core` / `oak-design-tokens` split already demonstrates
the correct separation.

## Decision

Whenever we build something, clearly separate:

**(a)** A **purpose-specific, consumer-agnostic framework** — the
reusable mechanism that solves a category of problem, usable by any
consumer.

**(b)** The **Oak-specific consumer instance** — the application of
that framework to Oak's domain, data, and configuration.

This separation must be visible in code structure: different modules,
directories, or packages. If general mechanism and Oak-specific
configuration are mixed in one module, split them.

The framework defines the contract; the consumer provides the specifics.

**The test**: "Could a non-Oak consumer use this component unchanged?"
If not, extract the Oak-specific parts.

### Examples

| Before (mixed)                                                            | After (separated)                                                                                                                       |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `@oaknational/logger` with Oak resource attributes and Express middleware | `logger` (framework: `UnifiedLogger`, error normalisation, log levels) + consumer instance (Oak resource attributes, Vercel middleware) |
| Single design token package with resolution + Oak palette                 | `design-tokens-core` (framework: resolution, contrast validation) + `oak-design-tokens` (consumer: Oak palette, semantic tokens)        |
| Codegen with generators + Oak API schema                                  | `sdk-codegen` engine (framework: OpenAPI parsing, code generation) + Oak schema configuration (consumer: Oak API endpoints, decorators) |

### Relationship to Other Principles

This principle works with "Decompose at the Tension" (ADR-155). When a
module resists clean classification, the tension often reveals a
framework/consumer conflation. Decomposing at that fault line produces
two cleanly classifiable pieces: the framework in one tier, the consumer
in another.

## Consequences

### Positive

- Mechanisms become independently testable with trivial fixtures.
- The tier model classifies cleanly: frameworks sit in infrastructure
  (Tier 1), consumers sit in runtime (Tier 2b).
- Reuse becomes possible without carrying domain dependencies.
- Change boundaries are clear: framework changes require consumer
  updates only at the contract surface.

### Trade-offs

- More packages and directories to maintain. This is a structural
  cost that pays for itself through clarity and testability.
- Not every module warrants the split — single-consumer mechanisms
  with no foreseeable reuse can remain inline until a second consumer
  appears or the module resists classification.

### Migration

Existing mixed modules are not required to split immediately. The
principle applies to new code and to modules that are being
substantially refactored. The [workspace topology exploration
plan](../../../.agent/plans/sdk-and-mcp-enhancements/active/workspace_topology_exploration.plan.md)
identifies specific candidates for decomposition.
