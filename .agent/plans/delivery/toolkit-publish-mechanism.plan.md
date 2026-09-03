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
owner_gates:
  - awaiting: owner-decision
    clears_when: >-
      The owner confirms on the ticket that this repository's release
      workflow holds publish rights for the @oaknational npm scope, or names
      who grants them; P4 asserts the right at its start.
    expires: 2026-09-23
last_updated: 2026-09-02
---

# Publish the toolkit from this repository at one version

## Goal

A releasable merge to the default branch publishes every workspace whose
manifest is publishable to the `@oaknational` scope at the repository's
release version, in one automatic step of the existing release workflow, from
a tip whose CI run succeeded, and every published package installs and
imports under a real pnpm store layout. Nothing publishes today. This is the
"first-publish behind the manifest gate" step of `public-packages-release`'s
banked order, deliverable against the single-version estate (the owner's
ruling for now: one release version per repository), and the mechanism the
extraction plan `oak-open-curriculum-mcp-extraction` depends on.

## User groups and value

- **The extraction plan and the product squad it serves.** The product
  repository installs the toolkit from the registry; a release here reaches
  it as a version. Without this mechanism nothing below the line can leave
  this repository.
- **Agents in this repository.** Publishing costs nothing per release: a
  workspace becomes public by flipping its manifest, and the workflow does
  the rest.
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
  and the curriculum SDK) and every other package sits at
  `0.0.0-development`. A stamping step writes the release version into every
  publishable manifest before publish and replaces the curriculum SDK's own
  release entry, so one mechanism covers all; the release's git assets cover
  every stamped manifest or none.
- **Order and convergence.** `pnpm -r publish` is not atomic and rewrites
  `workspace:*` to exact versions. The step publishes in topological order,
  treats each package's publish as idempotent, re-runs to completion after a
  partial failure, and marks the release done only when the whole published
  set resolves from a clean store. Provenance is required for a public
  publish: the release job grants `id-token: write` (it does not today) and
  publishes with provenance, and AC1 checks the attestation on the registry.
  Nothing publishes live until the installability smoke below is green for
  every package in the set.
- **Installability.** The packed-form smoke the curriculum SDK already runs
  generalises to every publishable package and installs under a real pnpm
  store layout, not only from a tarball: module-load path arithmetic that
  reaches the monorepo root passes a tarball check and fails an install.
- **Consumers and the release-age floor.** A consumer keeps its
  minimum-release-age floor in force for the `@oaknational` scope — a
  compromised first-party publish is exactly what the floor's detection
  window is for — so a release here is installable the following day; a
  genuinely urgent fix is allow-listed for that one package at the owner's
  word, as the floor's own comment permits, never by a standing scope
  exclusion. The package READMEs say so.

## Acceptance criteria (each with a proof — required)

- **AC1 — automatic publish.** A releasable merge publishes every publishable
  workspace at the release version with no human step, every published
  package carries a registry provenance attestation, and a clean-store
  install of the whole set resolves. Proof: `repo-safe` — the release run,
  the attestation read back from the registry per package, and the resolve
  check the run ends with.
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
   precondition of any live publish, because a published version cannot be
   withdrawn. Proof: AC3.
3. **P3** The stamping step, topological publish with provenance,
   clean-store resolve check and convergent re-run, proven as a dry run
   listing the set and as the AC4 rehearsal against the local test
   registry, with no live publish. Proof: AC4; the dry-run listing.
4. **P4** The first live publish at the next release, after P2 is green
   for every package in the set; asserts publish rights at its start (gate).
   Proof: AC1.
5. **P5** The consumer note on the release-age floor (the floor stays in
   force for the scope; per-package allow-listing is the exception) in the
   package README template. Proof: the docs validators.

## Out of scope

- Deciding which workspaces are publishable — the extraction plan's design
  slice and the seam's manifest gate decide; this plan publishes whatever
  carries a publishable manifest.
- Version-config refinement (releases minted only by changes that reach a
  published surface) — `public-packages-release`'s wager 2, its own slice.
- Clock-group version streams — `public-packages-release`'s wager 3, at the
  split.
- A second versioning or publishing tool — admitted only on the evidence the
  strategic node names.
