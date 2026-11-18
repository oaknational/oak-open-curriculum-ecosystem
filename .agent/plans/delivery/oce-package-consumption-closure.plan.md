---
id: oce-package-consumption-closure
node_type: delivery
name: "Prove the first complete supported package consumption closure"
overview: "The selected reference profile is usable from packed packages in a real external store with all runtime, type, build, asset and operating dependencies explicit and no checkout assumptions."
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
  - plan: oce-configured-capability-slice
    kind: blocking
  - plan: oce-castr-generator-replacement
    kind: beneficial
  - plan: oce-curriculum-integrity-slice
    kind: beneficial
owner_gates: []
last_updated: 2026-10-10
---

# Prove the first complete supported package consumption closure

## Authority and pickup

Born sketch under the 10 October 2026 programme design. The owner commissioned
this design and documentary incorporation; implementation awaits this node's
ratification and the specific approvals its acceptance requires. Accepted direction
is [ADR-233](../../../docs/architecture/architectural-decisions/233-retained-framework-and-configurable-instances.md).
Read the [architecture](../../../docs/architecture/oce-architecture.md) and
[programme route](../../reports/repo-architecture/oce-rearchitecting/README.md)
for source scope and decision homes. No team measurement is commissioned.

## Goal

The selected reference profile is usable from packed packages in a real external store with all runtime, type, build, asset and operating dependencies explicit and no checkout assumptions.

## User groups and value

A fresh instance implementer can install, configure, build, verify and diagnose through supported public artifacts; publishers receive a finite eligible set.

## Mechanism

Derive closure from the in-place profile and consumed forms, including codegen/CLI, widgets, conformance, CI/release/deploy adapters and documentation. Replace repository-relative reads with explicit bindings. Validate public exports, emitted declarations, licenses, identity assets, deterministic provenance, compatibility and release-age expectations. Construct the smallest missing reusable scaffold, build/test/conformance, workflow/provider, release/deploy, diagnostic and recovery facilities required by this profile; packaging cannot merely attest facilities nobody builds. A published workflow/action or CLI may be a consumed form alongside npm packages, with exact versioned provenance and its source retained in OCE. Use local persistent registry rehearsal before authorised publication.

## Acceptance criteria

- **AC1** — repo-safe — A consumer outside the checkout installs the full candidate set in a real package-store layout and imports/builds/runs/tests the declared profile without deep imports, root files or workspace symlinks.

- **AC2** — repo-safe — Missing asset, private transitive dependency, unsupported configuration/version skew and undeclared emitted dependency fail the evidence; manifest eligibility alone cannot pass.

- **AC3** — repo-safe — The instance contains configuration/references/content only, with reusable build, testing, release, deployment and diagnostic execution supplied by OCE artifacts; the license/provenance ledger covers code/content/assets.

## Todos

1. Freeze first-profile closure and package surface manifests from the contract map.
2. Repair external-install assumptions, construct the missing profile facilities with their own acceptance evidence, and exercise independent consumed-form fixtures.
3. Return the exact eligible versioned set and compatibility matrix to toolkit-publish-mechanism; record future CF reconstruction per unqualified responsibility.

Each implementation PR is a bounded story with the repository’s default two-review-round
budget; this is a changeset control, not a study of teams or an output metric.

## Out of scope

No registry release or app cutover; no claim that every OCE package must be published together.
