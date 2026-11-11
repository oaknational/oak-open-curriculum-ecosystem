---
id: oce-app-handover
node_type: delivery
name: "Prepare a configuration-only external instance from published OCE"
overview: "A fresh external instance can be installed, configured, verified and maintained from published artifacts and repository documentation, with accountable receiving roles and no private-context dependency."
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
  - plan: toolkit-publish-mechanism
    kind: blocking
  - plan: oce-package-consumption-closure
    kind: blocking
owner_gates: []
last_updated: 2026-10-10
---

# Prepare a configuration-only external instance from published OCE

## Authority and pickup

Born sketch under the 10 October 2026 programme design. The owner commissioned
this design and documentary incorporation; implementation awaits this node's
ratification and the specific approvals its acceptance requires. Accepted direction
is [ADR-233](../../../docs/architecture/architectural-decisions/233-retained-framework-and-configurable-instances.md).
Read the [architecture](../../../docs/architecture/oce-architecture.md) and
[programme route](../../reports/repo-architecture/oce-rearchitecting/README.md)
for source scope and decision homes. No team measurement is commissioned.

## Goal

A fresh external instance can be installed, configured, verified and maintained from published artifacts and repository documentation, with accountable receiving roles and no private-context dependency.

## User groups and value

Receiving instance owners get a usable supported product surface and recovery instructions; OCE maintainers retain every mechanism and its source authority.

## Mechanism

Use the published closure and scaffold/configuration facilities. Include package/lock/config manifests, permitted authored instance content, host and credential references, policy selections and declared operational profile. Rehearse supported changes and upgrade/recovery using reusable OCE facilities. Bind actual repository/registry/provider ownership at pickup rather than infer Oak rights for Engraph.

## Acceptance criteria

- **AC1** — repo-safe — A fresh consumer exercises the declared profile and ordinary-change scenarios without editing or releasing OCE; no custom bootstrap, validators, callbacks, conformance fallback or workflow implementation remains.

- **AC2** — repo-safe — Receiving documentation names compatibility, upgrade, incident/rollback, contribution and missing-capability routes and exact package/config/source identities.

- **AC3** — owner-held — OCE release owner and instance receiving owner verify registry read-back/provenance, repository/provider rights and receipt of the supported profile in their acceptance record. No actual staffing or rights are inferred.

## Todos

1. Verify the exact published closure, registry rights and supported profile.
2. Create the minimal permitted instance using the reusable scaffold and rehearse maintenance/failure scenarios.
3. Record technical handover and named receiving authority; return deployment-specific decisions to the cutover step.

Each implementation PR is a bounded story with the repository’s default two-review-round
budget; this is a changeset control, not a study of teams or an output metric.

## Out of scope

No live traffic move or search-operational commitment; no team study or automatic Oak repository creation.
