---
id: oce-search-delivery-design
node_type: delivery
name: "Design the separately scoped operational search capability"
overview: "Search delivery has a complete bounded operating contract and incremental implementation handoff, preserving independently configurable instances and every reusable mechanism in OCE."
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
    kind: beneficial
  - plan: oce-curriculum-contracts
    kind: beneficial
owner_gates: []
last_updated: 2026-10-10
---

# Design the separately scoped operational search capability

## Authority and pickup

Born sketch under the 10 October 2026 programme design. The owner commissioned
this design and documentary incorporation; implementation awaits this node's
ratification and the specific approvals its acceptance requires. Accepted direction
is [ADR-233](../../../docs/architecture/architectural-decisions/233-retained-framework-and-configurable-instances.md).
Read the [architecture](../../../docs/architecture/oce-architecture.md) and
[programme route](../../reports/repo-architecture/oce-rearchitecting/README.md)
for source scope and decision homes. No team measurement is commissioned.

## Goal

Search delivery has a complete bounded operating contract and incremental implementation handoff, preserving independently configurable instances and every reusable mechanism in OCE.

## User groups and value

Search maintainers and receiving service operators can deliver freshness, quality and recovery deliberately; MCP and other consumers receive a precise supported service contract.

## Mechanism

Receive versioned corpus/entity/change/deletion/provenance contracts and validated resource namespace/profile. Design initial population, incremental reconciliation, checkpoints/quarantine, retries and rate/cost bounds, mapping/chunk/inference compatibility, index rebuild and alias activation, freshness, quality evaluation, recovery, auth/retention, diagnostics and infrastructure bindings. Distinguish API/sdk runtime sharing from search source custody.

## Acceptance criteria

- **AC1** — repo-safe — Two meaningfully different instance scenarios cover all resource names including metadata, synonyms, inference and zero-hit storage; permitted sharing is explicit and unintended collisions reject.

- **AC2** — repo-safe — Failure matrix covers partial ingestion, source deletion/correction, incompatible mapping/model, stale results, promotion failure and recovery; every promise has a receiving role and future proof.

- **AC3** — repo-safe — Bounded implementation nodes and actual dependency conditions are authored under the appropriate search parent at pickup, with contracts and evidence; no claim that the service already operates.

- **AC4** — owner-held — Search capability maintainer and chosen instance operator agree runtime tenancy, freshness/retention/cost policy and receiving boundaries before operations are commissioned.

## Todos

1. Inspect current indexing/lifecycle/evaluation implementations against the received contracts; preserve all useful mechanisms.
2. Select supported independent-instance operating profile and failure/recovery semantics.
3. Author implementation handoff with one initial-population slice, one changes/deletions slice and controlled activation/recovery, preserving separate scope.

Each implementation PR is a bounded story with the repository’s default two-review-round
budget; this is a changeset control, not a study of teams or an output metric.

## Out of scope

No provisioning, ingestion operation, deployment, universal shared service decision or gate on unrelated CF/integrity design.
