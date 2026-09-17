---
id: release-redeploy-recovery
node_type: delivery
name: 'Recovery: the last successfully deployed release can be rebuilt'
overview: "Archived record of the shipped MCP-479 same-commit redeploy arm; ADR-163 owns the decision and release-redeploy-guard-truing owns the residual operating proof."
status: archived
serves: first-major-release
impact_areas:
  - served-surface
tickets:
  - MCP-479
depends_on: []
owner_gates: []
last_updated: 2026-08-11
---

# Recovery: rebuild a known-good release

> **Disposition (2026-08-11): archived as overtaken before ratification.**
> MCP-479 is Done and the same-commit arm shipped in PR #751. ADR-163
> owns the durable decision; `release-redeploy-guard-truing` already owns
> the remaining live operating knowledge and production proof. Keeping
> this unratified sketch live would create a second carrier for completed
> work.

## Goal

In the ordinary non-rollback state, rebuilding Vercel's last successfully
deployed commit can apply repaired project environment settings without a
new release cut.

## Problem

Until 2026-08-04, `vercel-ignore-production-non-release-build.mjs`
cancelled any production build whose root `package.json` version had
not advanced beyond the deployed version. A redeploy of the current
release re-ran the guard at the same version and was therefore always
cancelled — so the last successfully deployed release could not be rebuilt.

The consequence was structural: when a deployment was healthy as a
build but broken by its environment, the repository contained no change
to make, and the guard rejected the only build that would help.
Recovery then required manufacturing a version bump, which coupled
incident response to the release process. Incident narrative, timings,
and the owner ruling that authorised this node are recorded on MCP-479.

## Mechanism

The guard carries a same-commit redeploy arm beside the existing
version-ordering predicate (shipped 2026-08-04, PR #751), leaving that
predicate otherwise intact.

- **Builds:** a commit whose version advanced (unchanged), **and** a
  rebuild whose validated current SHA matches Vercel's last successful
  deployment SHA, identified by
  `VERCEL_GIT_COMMIT_SHA == VERCEL_GIT_PREVIOUS_SHA`. That commit
  passed this gate as a successful deployment, so rebuilding it cannot
  introduce a version it did not already have.
- **Cancels:** any other commit on the default branch whose version has
  not advanced — the guard's original and correct intent, unchanged.

The parity contract with `packages/core/build-metadata/src/semver.ts`
stays intact; the anti-drift parity test still governs.

**The arm is deliberately narrow: it identifies Vercel's last successfully
deployed commit, not necessarily the deployment currently serving traffic.**
Vercel documents
`VERCEL_GIT_PREVIOUS_SHA` as "The git SHA of the last successful
deployment for the project and branch" (system-environment-variables
reference, retrieved 2026-08-05) and exposes no variable naming a
deploy's intent, so the equality above is the only honest signal
available. Selecting an *earlier* release is not expressible through
this guard, and an earlier release still cancels.

Rolling back to an earlier release therefore remains **unsolved by this
node**, and the two candidate routes both have named costs recorded in
ADR-163 §10: Vercel's Instant Rollback re-points domains at an existing
build *without running this script at all*, so it restores the selected
deployment's original environment binding rather than applying a repaired
project setting; and a
revert-and-release cut is the status quo this node exists to avoid.
Naming the gap is the honest state — see §Out of scope.

**Decision record.** This mechanism contradicted ADR-163 §10 as
accepted, which required every production build on `main` to advance
the semver, so landing it carried the decision amendment with it:
ADR-163 §10's normative rule and truth table now state the redeploy
arm as the fourth amendment (2026-08-04, MCP-479), with the vendor
definition of `VERCEL_GIT_PREVIOUS_SHA` quoted verbatim beside the
equality it warrants.

## Acceptance criteria

1. A validated-SHA rebuild of Vercel's last successful deployment commit
   continues rather than cancels —
   proof: **repo-safe**, the shipped guard unit tests
   (`apps/oak-curriculum-mcp-streamable-http/build-scripts/vercel-ignore-production-non-release-build.unit.test.mjs`,
   the MCP-479 redeploy block) covering the
   `VERCEL_GIT_COMMIT_SHA == VERCEL_GIT_PREVIOUS_SHA` continue case.
2. A commit that is **not** Vercel's last successfully deployed commit and
   whose version has not advanced still cancels — proof: **repo-safe**, the
   same suite's different-commit cancel test, plus the live 2026-08-05 pipeline
   evidence recorded on MCP-479 (a merge commit cancelled by the
   ignored build step; a release commit built and deployed). This is
   the criterion that keeps the narrowing honest: it fails if the
   redeploy arm is ever widened into "any release version builds".
3. Both SHA inputs are validated before the equality is trusted —
   proof: **repo-safe**, the same suite's trust-boundary tests
   asserting that a malformed or absent `VERCEL_GIT_COMMIT_SHA` or
   `VERCEL_GIT_PREVIOUS_SHA` leaves the verdict exactly as it was
   before the arm existed. An equality test on unvalidated input could
   compare equal on malformed values and continue a build the truth
   table means to cancel.
4. ADR-163 §10 states one unambiguous rule — proof: **repo-safe**, the
   §10 normative sentence carries the redeploy arm as the fourth
   amendment (2026-08-04, MCP-479) with no table row contradicting the
   sentence above it, and no reference in the repo designates two
   different changes by the same amendment number (re-verified
   2026-08-09 in the amendment round that cured the heading collision).
5. The predicate is stated where an operator will find it — proof:
   **repo-safe**, the guard's own TSDoc names which commits build and
   which cancel, including the arm's evaluation order relative to the
   version comparison.
6. In a non-rollback state, the last successfully deployed production
   release can be rebuilt in the real environment — proof:
   **owner-held**, a redeploy triggered by the owner from the Vercel
   dashboard observed to build rather than cancel; evidence recorded on
   MCP-479 with the deployment id. This is the only criterion the repo
   cannot prove for itself, because the guard's inputs are supplied by
   Vercel at build time. It is the one criterion still open; the
   observation todo is carried by
   [`release-redeploy-guard-truing`](../delivery/release-redeploy-guard-truing.plan.md).

## Out of scope

- **Selecting an earlier release (true rollback).** Not implementable
  through this guard — see §Mechanism. The gap is named rather than
  quietly carried: neither Vercel's Instant Rollback (which never runs
  this script, so it restores the same stale environment binding) nor a
  revert-and-release cut (the status quo) is an acceptable answer, so
  this needs its own node with its own mechanism. It is not a todo of
  this one.
- **The rolled-back state and promotion.** Vendor-verified 2026-08-05:
  after an Instant Rollback, Vercel suspends auto-assignment of
  production domains until an explicit Undo Rollback or promotion.
  Vercel does not document the value of `VERCEL_GIT_PREVIOUS_SHA` after
  rollback, so the guard cannot rely on that variable identifying the
  deployment serving traffic in the rolled-back state. Promotion out of
  a rollback is platform-governed, not guard-governed — the composed
  guards deliberately leave it ungated. The post-rollback operating
  facts and their runbook coverage are
  [`release-redeploy-guard-truing`](../delivery/release-redeploy-guard-truing.plan.md)'s
  deliverable; ADR-163 §10 records the divergence beside the quoted
  vendor definition.
- **Changing the version-ordering predicate itself.** The existing rule is
  correct for every commit that is not Vercel's last successfully deployed
  commit, and this node adds an arm beside it rather than replacing it.
- **Any change to how environment variables reach a deployment.** The
  environment-binding class that motivated this node is a separate
  concern; this node only restores the ability to rebuild.
- **Reducing time-to-detection.** Recovery speed is this node; noticing
  that recovery is needed belongs to
  [`production-liveness-detection`](../delivery/production-liveness-detection.plan.md).
- **A general "redeploy any deployment" capability.** Deliberately not
  built: it would require an operator-supplied signal, and every
  operator-supplied bypass of a safety guard is a surface this estate
  does not add.

## Relationship to the sibling nodes

Recovery arm of the deployment-reliability response. Siblings:
[`deploy-config-fails-the-build`](../delivery/deploy-config-fails-the-build.plan.md),
[`boot-failure-observability`](../delivery/boot-failure-observability.plan.md),
[`production-liveness-detection`](../delivery/production-liveness-detection.plan.md).
Detection without recovery leaves an outage standing; this node is the
floor under every other incident response.

*Authored by Birch holds Seedling (e48fe2, agent), 2026-08-03. Amended
2026-08-09 per the adjudicated 2026-08-05 eleven-expert review
(`deploy-reliability-corpus-amendment`, rows 14–19, 35).*
