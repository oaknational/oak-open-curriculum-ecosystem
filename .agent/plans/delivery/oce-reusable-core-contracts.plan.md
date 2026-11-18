---
id: oce-reusable-core-contracts
node_type: delivery
name: "Bind retained mechanisms to published configuration contracts"
overview: "The first MCP reference profile has a complete responsibility and consumed-form map, with an explicit source owner, proposed maintained home, public contract and instance datum for every touched mechanism."
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: oce-rearchitecting-programme
impact_areas:
  - innovation-kit
  - practice-and-estate
  - packaging-and-distribution
tickets: []
depends_on:
  - plan: oce-cf-assurance-binding
    kind: beneficial
owner_gates: []
last_updated: 2026-10-10
---

# Bind retained mechanisms to published configuration contracts

## Authority and pickup

Born sketch under the 10 October 2026 programme design. The owner commissioned
this design and documentary incorporation; implementation awaits this node's
ratification and the specific approvals its acceptance requires. Accepted direction
is [ADR-233](../../../docs/architecture/architectural-decisions/233-retained-framework-and-configurable-instances.md).
Read the [architecture](../../../docs/architecture/oce-architecture.md) and
[programme route](../../reports/repo-architecture/oce-rearchitecting/README.md)
for source scope and decision homes. No team measurement is commissioned.

## Goal

The first MCP reference profile has a complete responsibility and consumed-form map, with an explicit source owner, proposed maintained home, public contract and instance datum for every touched mechanism.

## User groups and value

Instance builders can understand exactly what they configure; OCE maintainers can implement a bounded separation without losing host, tooling or operating responsibilities.

## Mechanism

Walk the actual MCP application, served surface, widget, curriculum/search dependencies and build/release paths. Separate mechanism from instance data inside each box. Use the architecture and configuration scenarios, including two independent search configurations. Record compatibility and support obligations; select a bounded supported profile and missing capability homes. Retain useful experimental material without forcing one package per mechanism.

## Acceptance criteria

- **AC1** — repo-safe — A source-to-home matrix covers runtime, auth, presentation/assets, telemetry, source/data models, generation, conformance, evaluation, build, release, deployment and diagnosis; each row has consumer, public seam, retirement condition and evidence.

- **AC2** — repo-safe — All configuration scenarios have an admitted parameter/profile, explicit new-capability classification, or a named missing contract; none silently permits executable app callbacks or copied scripts.

- **AC3** — repo-safe — The first production, type, build, asset and tool closure is enumerated from source/manifests and contracts; known root-package and hardcoded-resource assumptions have exact replacement requirements.

## Todos

1. Start from the source/disposition report and permanent instance contract; inspect affected consumers rather than recensus the estate.
2. Bind one MCP profile and separately named search resource profiles; define the minimal supported public contracts.
3. Assign every first-profile gap to the configured-capability, curriculum, package or search node; refresh fixtures and receiving-role responsibilities.

Each implementation PR is a bounded story with the repository’s default two-review-round
budget; this is a changeset control, not a study of teams or an output metric.

## Out of scope

No migration, package publication, app repository creation or additional organisation-wide taxonomy.
