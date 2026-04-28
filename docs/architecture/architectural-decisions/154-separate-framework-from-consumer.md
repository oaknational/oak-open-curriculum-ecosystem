# ADR-154: Separate Framework from Consumer

**Status**: Accepted
**Date**: 2026-04-10
**Related**: [ADR-006](006-cellular-architecture-pattern.md) — cellular
architecture, [ADR-108](108-sdk-workspace-decomposition.md) — SDK workspace
decomposition, [ADR-148](148-design-token-architecture.md) — design tokens
already follow this pattern,
[PDR-035](../../../.agent/practice-core/decision-records/PDR-035-agent-work-capabilities-belong-to-the-practice.md)
— agent-work capabilities are Practice substance,
[ADR-165](165-agent-work-practice-phenotype-boundary.md) — local phenotype
boundary for Practice agent-work implementation

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

The same pressure exists outside application code. The portable Practice
must remain shareable across repos. Agent-work behaviours such as
collaboration, coordination, work management, direction, lifecycle,
identity, claims, handoff, and review routing are Practice substance by
default (PDR-035). Host-local operational tooling such as `agent-tools`
may be needed to make those capabilities executable in this repo, but
that TypeScript implementation is optional and replaceable by another
ecosystem's equivalent. The architecture therefore needs a specificity
gradient, not only a two-part framework/consumer split.

## Decision

Whenever we build something, clearly separate:

**(a)** A **purpose-specific, consumer-agnostic framework** — the
reusable mechanism that solves a category of problem, usable by any
consumer.

**(b)** The **Oak-specific consumer instance** — the application of
that framework to Oak's domain, data, and configuration.

This separation must be visible in workspace topology. Distinct
architectural layers MUST live in distinct workspaces. Modules and
directories may organise implementation inside one layer, but they do
not satisfy layer separation when the concerns have different
generality, lifecycle, dependency weight, or consumer specificity.
If general mechanism and Oak-specific configuration are mixed in one
workspace, split the workspace.

The framework defines the contract; the consumer provides the specifics.

**The test**: "Could a non-Oak consumer use this component unchanged?"
If not, extract the Oak-specific parts.

### Specificity Gradient

Decompose capabilities into layers ordered by context specificity. The
highest-specificity layer sits at the top and must be as thin as possible,
preferably configuration only. General functionality moves downward until
the next push would compromise architectural excellence.

The recurring layers are:

1. **Many-repo capability**: useful across repos or Practice-bearing
   environments.
2. **Repo-local generic capability**: specific to this repository's
   architecture, but not to Oak's curriculum domain.
3. **Purpose-specific reusable tool**: for example, process an OpenAPI
   spec into an SDK for that API.
4. **Oak-specific broad wrapper**: for example, Oak logging or Oak
   resource attributes on top of a general logging framework.
5. **Narrow Oak-domain wrapper**: for example, the Oak Open Curriculum
   OpenAPI spec configuration that produces the Oak Open Curriculum SDK.

Layers 4 and 5 MUST stay thin. Oak-specific state is a pressure signal:
configuration is preferred, generated state beats authored state, and
hand-rolled types beside generated outputs indicate that lower-level
generation should be examined first.

Each distinct layer in this gradient requires a workspace boundary. A
workspace may contain internal modules for one coherent layer, but it
MUST NOT host multiple layers merely separated by folders or naming
conventions. Shared code that is genuinely useful at two layers must
move down to the lower general layer; layer-specific wrappers stay in
their own workspaces.

For agent-work capabilities, layer 1 is the Practice memotype. Local
state files, platform adapters, and tooling are phenotype implementations
of that contract, not repo-owned doctrine.

### Examples

| Before (mixed)                                                               | After (separated)                                                                                                                       |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `@oaknational/logger` with Oak resource attributes and Express middleware    | `logger` (framework: `UnifiedLogger`, error normalisation, log levels) + consumer instance (Oak resource attributes, Vercel middleware) |
| Single design token package with resolution + Oak palette                    | `design-tokens-core` (framework: resolution, contrast validation) + `oak-design-tokens` (consumer: Oak palette, semantic tokens)        |
| Codegen with generators + Oak API schema                                     | `sdk-codegen` engine (framework: OpenAPI parsing, code generation) + Oak schema configuration (consumer: Oak API endpoints, decorators) |
| Portable Practice agent-work capability mixed with TypeScript implementation | Practice doctrine / capability contract + optional host-local implementation in `agent-tools/` or another ecosystem's equivalent        |

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
- Workspace boundaries become the enforcement surface for the layer
  model; same-workspace folder splits are no longer accepted as
  architectural separation between layers.

### Trade-offs

- More packages and directories to maintain. This is a structural
  cost that pays for itself through clarity and testability.
- Not every module warrants the split — single-consumer mechanisms
  with no foreseeable reuse can remain inline until a second consumer
  appears or the module resists classification. Once a distinction is a
  layer distinction rather than an internal module distinction, the split
  is required.

### Migration

Existing mixed workspaces are not required to split immediately, but they
must be tracked as migration work. The principle applies to new code and
to workspaces that are being substantially refactored. The
[workspace-layer separation audit plan](../../../.agent/plans/architecture-and-infrastructure/current/workspace-layer-separation-audit.plan.md)
owns the repo-wide audit and promotion path; the
[Oak surface isolation programme](../../../.agent/plans/architecture-and-infrastructure/future/oak-surface-isolation-and-generic-foundation-programme.plan.md)
is the strategic umbrella for the generic-foundation / Oak-leaf split.
