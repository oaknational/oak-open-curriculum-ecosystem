---
id: oce-castr-integration-profile
node_type: delivery
name: "Qualify the Castr integration and first generated contract profile"
overview: "OCE and Castr have an explicit integration boundary and finite first-profile acceptance corpus, including every currently consumed generator responsibility and source-owned approval dependency."
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
  - plan: oce-curriculum-contracts
    kind: beneficial
  - plan: oce-cf-assurance-binding
    kind: beneficial
owner_gates: []
last_updated: 2026-10-10
---

# Qualify the Castr integration and first generated contract profile

## Authority and pickup

Born sketch under the 10 October 2026 programme design. The owner commissioned
this design and documentary incorporation; implementation awaits this node's
ratification and the specific approvals its acceptance requires. Accepted direction
is [ADR-233](../../../docs/architecture/architectural-decisions/233-retained-framework-and-configurable-instances.md).
Read the [architecture](../../../docs/architecture/oce-architecture.md) and
[programme route](../../reports/repo-architecture/oce-rearchitecting/README.md)
for source scope and decision homes. No team measurement is commissioned.

## Goal

OCE and Castr have an explicit integration boundary and finite first-profile acceptance corpus, including every currently consumed generator responsibility and source-owned approval dependency.

## User groups and value

Generator and SDK implementers can replace a known boundary without silently weakening consumer contracts; domain owners retain semantic authority.

## Mechanism

Pin Castr specification v0.4.1 or its reviewed successor and its RATIFY/MEASURE/MOVE/PLOT sequence. Inventory OCE generated API, Zod, endpoint, MCP, bulk/search/graph, admin, vocabulary and asset surfaces. Select C-1 profile; independently decide source openness, defaults, formats, status/media/parameter semantics and target editions. Resolve Castr extractability versus shared CF dependencies before cross-boundary imports. OCE retains MCP generation; openapi-fetch remains.

## Acceptance criteria

- **AC1** — repo-safe — Per-output inventory names canonical input, transformation, consumer, failure semantics and replacement/retention decision; no silent z.unknown fallback remains a permitted target contract.

- **AC2** — repo-safe — Public adversarial fixtures independently expect parsed values and rejection, including defaults, unknown properties, status ranges/default, media, recursive constraints and unsupported constructs.

- **AC3** — owner-held — Castr owner’s approved edition, current-model measurement and integration/extractability decisions are linked in the review. Draft capability promises are not implementation evidence.

## Todos

1. Read current Castr authorities at pickup and dispose intervening changes.
2. Build the responsibility/profile matrix and independent semantic examples.
3. Record exact integration location/dependency, measurement→move→finite construction handoff and approved replacement subset, with unresolved decisions blocking only affected outputs.

Each implementation PR is a bounded story with the repository’s default two-review-round
budget; this is a changeset control, not a study of teams or an output metric.

## Out of scope

No Castr move, compiler implementation, OCE generator replacement, later-format blanket gate or publication.
