# ADR-155: Decompose at the Tension

**Status**: Accepted
**Date**: 2026-04-10
**Related**: [ADR-154](154-separate-framework-from-consumer.md) —
framework/consumer separation,
[ADR-108](108-sdk-workspace-decomposition.md) — SDK workspace
decomposition, [ADR-065](065-turbo-task-dependencies.md) — Turbo task
model

## Context

During workspace topology analysis, several modules resisted clean
classification in the tier model (Tier 0 Primitives, Tier 1
Infrastructure, Tier 2a Codegen-time, Tier 2b Runtime). The resistance
manifested as:

- **Compromise labels**: "lifecycle-neutral", "shared", "cross-cutting"
  — classifications that describe the problem rather than solve it.
- **Barrel re-exports that exist to make something work**: a barrel in
  the codegen workspace that re-exports runtime types, existing not
  because the API design requires it, but because the codegen workspace
  serves double duty as both generator and distribution hub.
- **Modules that span concerns**: the logger containing both
  general-purpose infrastructure and Oak-specific Vercel middleware.
  Classifying it as "Tier 1" is inaccurate because parts belong in
  Tier 2b; classifying it as "Tier 2b" loses the infrastructure
  character.

The initial instinct was to create broader categories or softer labels.
But every compromise label hid a structural problem: two distinct
concerns conflated in one module.

## Decision

When code resists clean classification or forces compromise labels,
**decompose at the fault line** — separate the concerns being conflated
— rather than classify around the compromise.

The principle has three parts:

1. **Classification resistance is a signal.** If a module cannot be
   cleanly placed in the tier model, something is structurally wrong.
   The resistance is diagnostic, not a problem with the classification
   system.

2. **Decompose, don't label.** The response to classification
   resistance is to split the module along the fault line that the
   tension reveals. Do not invent a new category to accommodate the
   conflation.

3. **Each decomposition produces cleaner boundaries.** After splitting,
   each piece classifies naturally. The barrel disappears because the
   coupling it bridged no longer exists. The compromise label is
   unnecessary because each piece has a single, clear role.

### Worked Examples

| Tension                                                            | Hidden coupling                                          | Decomposition                                                                    |
| ------------------------------------------------------------------ | -------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Codegen barrel re-exports runtime types                            | Codegen workspace is both generator and distribution hub | Separate codegen engine from output distribution                                 |
| Logger is "shared infrastructure" but contains Vercel middleware   | Framework and consumer mixed in one package              | Split into infrastructure framework + runtime consumer (ADR-154)                 |
| Design tokens are "core" but contain Oak palette                   | Resolution algorithm and domain tokens conflated         | `design-tokens-core` (framework) + `oak-design-tokens` (consumer) — already done |
| Test helpers are "shared" but some need runtime, some need codegen | Different lifecycle contexts conflated under "shared"    | Place each helper in the lifecycle tier where it is consumed                     |

### Relationship to Other Principles

This principle is the diagnostic companion to "Separate Framework from
Consumer" (ADR-154). ADR-154 tells you **what** to separate; this ADR
tells you **when** to separate — the tension is the signal. Together
they form a decomposition discipline: notice the tension, identify
the conflated concerns, split along the fault line, verify each piece
classifies cleanly.

## Consequences

### Positive

- Eliminates compromise labels that hide structural problems.
- Produces modules with single, clear roles that classify naturally.
- Removes coupling-bridging barrels and re-exports.
- Makes the tier model an honest description of the architecture
  rather than an aspirational overlay.

### Trade-offs

- Requires judgement about when tension is worth decomposing versus
  when a module is simply complex. The test: "Does the classification
  resistance reveal two distinct concerns?" If yes, decompose. If the
  module is genuinely one concern that is inherently complex, the
  resistance is not tension — it is complexity, and the response is
  better documentation, not decomposition.
- Produces more, smaller modules. This is acceptable because each
  module is simpler and more focused.

### Non-Goals

- This ADR does not prescribe the tier model itself — the four-tier
  classification is documented in the [workspace topology exploration
  plan](../../../.agent/plans/sdk-and-mcp-enhancements/active/workspace_topology_exploration.plan.md)
  and may graduate to its own ADR when finalised. Tier labels used in
  the examples above are illustrative of the decomposition signal,
  not normative definitions.
- This ADR does not mandate immediate decomposition of all modules
  showing tension. It establishes the principle for new work and
  active refactoring.
