---
id: toolkit-publish-mechanism
node_type: delivery
name: "Publish the toolkit from this repository at one version"
overview: >-
  Make the existing release workflow publish every workspace whose manifest
  is publishable, at the repository's release version, from a validated tip,
  installable under a real package-store layout — with no human step.
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: public-packages-release
impact_areas:
  - packaging-and-distribution
  - practice-and-estate
tickets:
  - MCP-661
depends_on: []
owner_gates: []
last_updated: 2026-10-10
---

# Publish the toolkit from this repository at one version

## Engraph scope amendment — 10 October 2026

The original 3 September ratification by Jim Cresswell, PR #959 item 13,
is preserved as historical authority for the publication mechanism. Binding
that mechanism to Engraph's current namespace, branch, rights and complete
eligible closure is a scope change, so this node returns to sketch pending
re-ratification. The 10 October commission designs this work; it does not publish.
[ADR-233](../../../docs/architecture/architectural-decisions/233-retained-framework-and-configurable-instances.md)
and `oce-package-consumption-closure` supply the current responsibility boundary.
Design and local-registry rehearsal can proceed before closure; **first live
publish requires the proved complete eligible closure**. Engraph's observed
default branch is `engraph`; inherited `main`/Oak scope assumptions must be
rebound by the Engraph release owner. No configured publisher rights are inferred.
One version per repository remains the initial policy. Source/manifest existence
does not establish registry availability.

## Goal

After Engraph release binding and required publication authority, a releasable merge to the default branch publishes every workspace whose
manifest is publishable to the explicitly authorised package scope at the repository's
release version, in one automatic step of the existing release workflow, from
a tip whose CI run succeeded, and every published package installs and
imports under a real pnpm store layout. The inspected release configuration disables npm publication; no first-publish success is claimed. This is the
"first-publish behind the manifest gate" step of `public-packages-release`'s
banked order, deliverable against the single-version estate (the owner's
ruling for now, recorded in ADR-227: one release version per repository),
and the mechanism `oce-app-handover` depends on. ADR-227 supplies historical
publication direction; ADR-233 and the Engraph binding control this work. Verify
code, content and identity-asset licences/redistribution for the exact eligible set;
the historical MIT/OGL distinction does not establish rights for every new asset.
Use the explicitly authorised scope and repository release version.

## User groups and value

- **Receiving instance owners.** The external instance installs a supported
  published closure; a release reaches it as a version. No handover is complete
  while dependencies require an OCE checkout.
- **Agents in this repository.** Publishing requires no routine manual release step: a workspace becomes eligible only after its full closure, rights and consumed-form evidence pass; the workflow performs the authorised release.
- **Future non-Oak builders.** The packages exist on the registry with
  provenance. Offered value only; no consumer beyond the product is claimed.

## Mechanism

- **The validated tip.** The release job runs on `workflow_run` and checks
  out no explicit ref, so a merge racing CI could be versioned unvalidated
  (the defect `public-packages-release` records). Pinning the checkout would
  detach HEAD and break the release plugin's push, so the job instead asserts
  that the default branch's tip has a successful CI run, or one queued or in
  flight for that exact tip; when the tip is newer than the validated head it
  exits cleanly and lets the newer run release; when it cannot establish
  either it fails loudly, so a validated release is never dropped in silence.
  A head left unreleased because a later tip's CI failed is not lost: the
  release tool versions every commit since the last tag, so the next
  successful run releases it together with the fix, and a broken tip
  releasing nothing is the correct outcome, not a dropped release.
- **Stamping.** The release configuration bumps two manifests today (the root
  and the curriculum SDK) while most other packages remain at
  `0.0.0-development` (some tooling manifests already have other versions). A stamping step writes the release version into every
  publishable manifest before publish and replaces the curriculum SDK's own
  release entry, so one mechanism covers all; the release's git assets cover
  every stamped manifest or none.
- **Order and convergence.** `pnpm -r publish` is not atomic and rewrites
  `workspace:*` to exact versions. The step publishes in topological order,
  treats each package's publish as idempotent, re-runs to completion after a
  partial failure, and marks the release done only when the whole published
  set resolves from a clean store. Provenance is required for a public
  publish: the release job already grants `id-token: write` for Turbo OIDC; bind the actual npm trusted-publisher/provenance path before publishing, and AC1 checks the attestation on the registry.
  Nothing publishes live until the installability smoke below is green for
  every package in the set.
- **Installability.** The packed-form smoke the curriculum SDK already runs
  generalises to every publishable package and installs under a real pnpm
  store layout, not only from a tarball: module-load path arithmetic that
  reaches the monorepo root passes a tarball check and fails an install.
- **Consumers and the release-age floor.** A consumer keeps its
  minimum-release-age floor in force for the authorised scope — a
  compromised first-party publish is exactly what the floor's detection
  window is for — so a release here is installable the following day; a
  genuinely urgent fix is allow-listed for that one package at the owner's
  word, as the floor's own comment permits, never by a standing scope
  exclusion. The package READMEs say so.

## Acceptance criteria (each with a proof — required)

- **AC1 — automatic publish.** A releasable merge publishes every publishable
  workspace at the release version with no human step, every published
  package carries a registry provenance attestation, and a clean-store
  install of the whole set resolves. Proof: `owner-held` — the Engraph release owner verifies the exact registry release, per-package provenance and clean-store resolution in the release acceptance record; workflow/rehearsal checks remain `repo-safe` evidence of their own scope.
- **AC2 — the validated tip.** A run where the default branch advanced during
  CI exits without releasing; the next run releases; a run that cannot find
  a CI result for the tip fails. Proof: `repo-safe` — the three workflow
  runs, linked from the ticket.
- **AC3 — installable.** Every published package installs and imports under
  a pnpm store layout. Proof: `repo-safe` — the smoke job, one row per
  package.
- **AC4 — convergent.** A publish interrupted after part of the set resumes
  to completion on re-run without republishing what landed. Proof:
  `repo-safe` — a rehearsal against a persistent local test registry (one
  that keeps published versions and rejects a duplicate, which a
  package-manager dry run does not): the step is interrupted at an injected
  point after the first package lands, re-run, and the assertions hold —
  the versions already present are skipped, the missing ones publish, and
  the whole set resolves from a clean store.

## Todos

1. **P1** The validated-tip assertion on the release job. Proof: AC2.
2. **P2** The packed-form smoke generalised to every publishable package
   under a pnpm store layout, run in CI on every change; green is the
   precondition of any live publish, because consumers may already hold a published version and the supported correction is a new release. Proof: AC3.
3. **P3** The stamping step, topological publish with provenance,
   clean-store resolve check and convergent re-run, proven as a dry run
   listing the set and as the AC4 rehearsal against the local test
   registry, with no live publish. Proof: AC4; the dry-run listing.
4. **P4** The first live publish at the next release, after P2 is green
   for every package in the set; asserts publish rights at its start (gate).
   (Dated addition, 2026-09-03, a factual true-up from the corpus truing's
   T5: P4 also amends the ratified `release-process` runbook's rollback
   clause, which today rests on publishing being disabled (`npmPublish:
   false` in `.releaserc.mjs`), to cover published packages — a published
   version is never unpublished; the forward path is a new release — with a
   dated note and the runbook's re-ratification per the plan-node schema.)
   Proof: AC1.
5. **P5** The consumer note on the release-age floor (the floor stays in
   force for the scope; per-package allow-listing is the exception) in the
   package README template. Proof: the docs validators.

## Out of scope

- Deciding which workspaces are publishable — `oce-reusable-core-contracts` and `oce-package-consumption-closure` decide the finite set; a manifest flag alone does not; this plan publishes only the verified eligible set after complete closure and rights checks.
- Version-config refinement (releases minted only by changes that reach a
  published surface) — `public-packages-release`'s wager 2, its own slice.
- Clock-group version streams — a separate justified release-policy decision; not automatically triggered by a repository split.
- A second versioning or publishing tool — admitted only on the evidence the
  strategic node names.

## Review dispositions

One dated row per routed finding (PDR-140 ledger surface).

| Date | Source | Finding | Routing |
| --- | --- | --- | --- |
| 2026-09-03 | Owner card (the MCP-673 implementing session) | The publish-rights gate: does the release workflow hold publish rights on the @oaknational scope? | Discharged — owner verbatim: "Yes we have the rights, no we do not need them yet, we are writing a plan, part of implementing the plan will be to make the publish step work in the correct and safe way"; the gate row is removed; P4 still asserts the right at its start |
