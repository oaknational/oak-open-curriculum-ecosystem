---
id: oce-app-cutover
node_type: delivery
name: "Cut over one accepted configured instance and retire its old execution"
overview: "One authorised instance serves its accepted profile with verified recovery and one defined authority for each execution and state responsibility; obsolete operation is retired without losing reusable source."
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
  - plan: oce-app-handover
    kind: blocking
owner_gates: []
last_updated: 2026-10-10
---

# Cut over one accepted configured instance and retire its old execution

## Authority and pickup

Born sketch under the 10 October 2026 programme design. The owner commissioned
this design and documentary incorporation; implementation awaits this node's
ratification and the specific approvals its acceptance requires. Accepted direction
is [ADR-233](../../../docs/architecture/architectural-decisions/233-retained-framework-and-configurable-instances.md).
Read the [architecture](../../../docs/architecture/oce-architecture.md) and
[programme route](../../reports/repo-architecture/oce-rearchitecting/README.md)
for source scope and decision homes. No team measurement is commissioned.

## Goal

One authorised instance serves its accepted profile with verified recovery and one defined authority for each execution and state responsibility; obsolete operation is retired without losing reusable source.

## User groups and value

The instance’s actual users receive continuity of the promised capability; operators receive explicit failure and correction ownership.

## Mechanism

Bind host/domain/auth/telemetry/state/resource ownership and readiness. Rehearse deployment/config/code rollback separately from state recovery; compare externally observed contracts, assets and required source freshness. Assessed blue/green coexistence is permitted with explicit routing and state ownership. Switch only the authorised instance, retain all mechanisms in OCE, and retire old deployment authority after acceptance.

## Acceptance criteria

- **AC1** — repo-safe — Deployment/configuration and recovery machinery has repeatable rehearsal evidence, including partial state transition and invalid version combinations.

- **AC2** — owner-held — The receiving operator verifies live protocol/auth/assets/telemetry/data readiness and authorised routing; evidence is recorded in the deployment system and acceptance record.

- **AC3** — owner-held — The owner confirms old execution retired and recovery responsibility accepted; historical source remains recoverable and maintained mechanisms remain in OCE.

## Todos

1. At pickup, establish exact operator/host/domain and data recovery decisions; attach any required search-operational acceptance.
2. Rehearse failure and recovery, then seek the separately required deployment authority.
3. Perform authorised cutover and observation, then retire the replaced live authority.

Retirement includes the repository closure: decide which old instance configuration
becomes an OCE reference fixture and which is retired; reconcile obsolete app paths
in workspace registration, Turbo, Knip, root scripts, CI/deployment/configuration
validators and onboarding/architecture navigation. Preserve retained mechanisms
and source history. Retire old public exports only after affected-consumer
accounting. Proof: `repo-safe` — no obsolete workspace/consumer reference remains
in the declared affected closure; reference fixtures exercise maintained public
contracts. Live routing retirement remains the separate owner-held acceptance.

Each implementation PR is a bounded story with the repository’s default two-review-round
budget; this is a changeset control, not a study of teams or an output metric.

## Out of scope

This plan is future implementation and operation; this planning commission performs none of it. No unrelated instance or whole-estate deployment.
