---
id: oce-configured-capability-slice
node_type: delivery
name: "Construct one supported configured MCP capability in place"
overview: "One complete MCP reference profile runs through OCE-owned execution facilities and typed instance configuration, preserving its current declared behaviour before any repository move."
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
  - plan: oce-reusable-core-contracts
    kind: blocking
  - plan: oce-cf-assurance-binding
    kind: beneficial
owner_gates: []
last_updated: 2026-10-10
---

# Construct one supported configured MCP capability in place

## Authority and pickup

Born sketch under the 10 October 2026 programme design. The owner commissioned
this design and documentary incorporation; implementation awaits this node's
ratification and the specific approvals its acceptance requires. Accepted direction
is [ADR-233](../../../docs/architecture/architectural-decisions/233-retained-framework-and-configurable-instances.md).
Read the [architecture](../../../docs/architecture/oce-architecture.md) and
[programme route](../../reports/repo-architecture/oce-rearchitecting/README.md)
for source scope and decision homes. No team measurement is commissioned.

## Goal

One complete MCP reference profile runs through OCE-owned execution facilities and typed instance configuration, preserving its current declared behaviour before any repository move.

## User groups and value

Instance builders can change supported composition, presentation and policies without OCE changes; capability maintainers retain one implementation and meaningful regression evidence.

## Mechanism

Implement the selected contracts inside OCE; move reusable bootstrapping, lifecycle, provider binding, served-surface validation, presentation assets and diagnostics behind public seams. Introduce bounded configuration admission and immutable candidate activation. Use independently expected fixtures for preservation and authority rejection. Keep source folders transitional if they satisfy enforced ownership; folder purity is not the outcome.

## Acceptance criteria

- **AC1** — repo-safe — Existing protocol/auth/widget/telemetry behaviour and declared profile tests pass through the new public seams; no old execution fallback remains authoritative.

- **AC2** — repo-safe — Supported tool selection, provider binding, theme and independent search resource selection work with data-only configuration; unknown names, invalid combinations and authority escalation fail before activation.

- **AC3** — repo-safe — Adverse scenarios cover resource isolation, secret redaction, missing assets and config rollback; every relied-on CF unit satisfies its bound qualification, or the profile explicitly avoids that stronger claim.

## Todos

1. Implement and verify the configuration admission and first execution facility with existing in-repo consumer.
2. Move the selected responsibility closure in small behaviour-preserving slices; retain every useful mechanism and its evidence.
3. Record consumed public paths, required assets and compatibility profile for the package closure node.

Each implementation PR is a bounded story with the repository’s default two-review-round
budget; this is a changeset control, not a study of teams or an output metric.

## Out of scope

No app extraction, registry publish, new search operation service, novel product features or entire CF prerequisite.
