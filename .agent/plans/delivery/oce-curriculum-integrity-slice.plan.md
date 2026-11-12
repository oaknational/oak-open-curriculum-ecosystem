---
id: oce-curriculum-integrity-slice
node_type: delivery
name: "Construct a complete small source-to-serving integrity slice"
overview: "One bounded public/synthetic curriculum slice preserves its required identity, meaning, authority and provenance through acquisition, admission, storage and API/SDK delivery, with correction and failure visible."
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
    kind: blocking
  - plan: oce-castr-generator-replacement
    kind: beneficial
  - plan: oce-cf-assurance-binding
    kind: beneficial
owner_gates: []
last_updated: 2026-10-10
---

# Construct a complete small source-to-serving integrity slice

## Authority and pickup

Born sketch under the 10 October 2026 programme design. The owner commissioned
this design and documentary incorporation; implementation awaits this node's
ratification and the specific approvals its acceptance requires. Accepted direction
is [ADR-233](../../../docs/architecture/architectural-decisions/233-retained-framework-and-configurable-instances.md).
Read the [architecture](../../../docs/architecture/oce-architecture.md) and
[programme route](../../reports/repo-architecture/oce-rearchitecting/README.md)
for source scope and decision homes. No team measurement is commissioned.

## Goal

One bounded public/synthetic curriculum slice preserves its required identity, meaning, authority and provenance through acquisition, admission, storage and API/SDK delivery, with correction and failure visible.

## User groups and value

Curriculum capability consumers receive trustworthy declared guarantees; product owners can see the last qualified boundary and what remains unsupported.

## Mechanism

Implement the approved layered fixture with explicit source capture, eligibility, admitted state, immutable observation/continuation and independently checked projections. Use Castr only for supported approved outputs; an existing compliant generator is allowed where the slice does not rely on replacement. Allocate constraints to runtime/storage/schema enforcement and test effects, not merely decoded shapes.

## Acceptance criteria

- **AC1** — repo-safe — Repeated occurrence and independent assertions survive actual storage and wire round trips; missing semantics reject rather than become generic blobs.

- **AC2** — repo-safe — Correction, deletion, mixed-revision pagination and stale eligibility adversarial fixtures prove the declared scope; diagnostics retain lineage with minimum information.

- **AC3** — repo-safe — The receipt binds source/profile/schema/generator/store/package versions and states the last verified consumer boundary; no AI-host fidelity or educational benefit is inferred.

## Todos

1. Implement the contract’s smallest coherent capture/admission/store path and independently expected negative fixtures.
2. Add API/SDK projection with target-enforcement allocation and actual-value checks.
3. Exercise refresh, failure, correction and recovery; return corpus/version contracts to search and package nodes.

Each implementation PR is a bounded story with the repository’s default two-review-round
budget; this is a changeset control, not a study of teams or an output metric.

## Out of scope

No whole curriculum migration, production origin fallback, protected learner records, unqualified host context or all graph capability.
