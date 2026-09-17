---
id: release-redeploy-guard-truing
node_type: delivery
name: 'Redeploy-guard operating knowledge: recovery-teaching diagnostics, the post-rollback facts, and the live proof'
overview: 'Teach the recovery paths in the guard''s cancellation message, record the post-rollback operating facts in the runbook, and prove the redeploy arm live; the ADR-163 §10 record truing is carried by deploy-reliability-corpus-amendment.'
status: sketch
serves: first-major-release
impact_areas:
  - served-surface
tickets:
  - MCP-479
depends_on: []
owner_gates: []
last_updated: 2026-08-05
---

# Redeploy-guard operating knowledge

## Goal

An operator recovering production works from recorded facts rather
than re-derived guesses: the guard's cancellation message teaches the
legitimate recovery paths, and the runbook states what a rolled-back
project actually does. (The companion outcome — an ADR trail that names
its amendments without collision and cites its vendor premises — is
carried by `deploy-reliability-corpus-amendment`.)

## Problem

The redeploy arm (MCP-479) shipped correct code with an inconsistent
record, and multi-expert review of the sibling plan corpus surfaced
three defects against the record rather than the code:

1. **ADR-163 §10 collides with itself.** The redeploy-arm change is
   labelled "fourth amendment, 2026-08-04" in its prose and truth-table
   row but "Third amendment (2026-08-03, MCP-479)" in its own heading,
   while a pre-existing "third amendment" (2026-04-28, enforcement
   hardening) already holds that ordinal. Two different changes share a
   designation, and one change designates itself twice.
2. **A load-bearing vendor semantic was reviewed as unverified.** The
   guard's equality arm rests on `VERCEL_GIT_PREVIOUS_SHA`. The vendor
   definition — verified verbatim 2026-08-05 from Vercel's
   system-environment-variables reference — is "The git SHA of the last
   successful deployment for the project and branch", exposed at build
   time only when an Ignored Build Step is provided. That is *not* "the
   commit currently serving production", and the two diverge exactly
   after an Instant Rollback. The record nowhere states this, so
   reviewers correctly flagged it as an uncited assumption.
3. **The post-rollback operating facts are recorded nowhere.** Verified
   2026-08-05 from Vercel's Instant Rollback reference: a rollback
   re-points domains at an existing deployment (no build runs, so the
   guard never executes); the rolled-back deployment keeps its original
   environment-variable bindings even if project settings change; and —
   decisive for recovery design — **after a rollback Vercel turns off
   auto-assignment of production domains**, so pushes to `main` stop
   going live until an explicit Undo Rollback / `vercel promote`. No
   Oak runbook states any of this.

## Mechanism

Two small deliverables, one closed design decision. (A third — the
ADR-163 §10 truing: the fourth-amendment heading rename, the
self-reference reconciliation, and the verbatim vendor definitions —
moved to `deploy-reliability-corpus-amendment` §Mechanism 4 at the
owner's direction, 2026-08-05. Problem items 1 and 2 above are cured
there; this node's deliverables assume that truing lands.)

1. **Guard cancellation message teaches recovery.** On the
   `current ≤ previous` CANCEL row, extend the existing stdout message
   with one sentence naming the two legitimate paths: redeploy the
   already-released commit (the equality arm continues it), or advance
   the version through a release. No truth-table change.
2. **Runbook: the rolled-back state.** Add a short section to the
   deployment runbook stating the three post-rollback facts above and
   the recovery sequence (fix the environment → Undo Rollback / promote
   → normal releases resume), and cross-reference it from the
   environment-variable change procedure's recovery note.

**The closed decision — the guard does not grow a post-rollback arm.**
Review asked whether the guard should also permit rebuilding the
rolled-back-to (older) release. Verdict: no, on vendor-verified
grounds. In a rolled-back state Vercel has suspended production domain
auto-assignment, so a git-triggered rebuild of the older release would
not reach the domain anyway; the vendor-designed recovery is promotion,
not a rebuild. Extending the guard would add a dependency on
`VERCEL_GIT_PREVIOUS_SHA`'s undocumented post-rollback value — an
assumption no repo-safe proof can falsify — to serve a path the
platform itself closes. The runbook paragraph carries this knowledge
instead.

## Acceptance criteria

1. **The sibling's ADR-163 §10 truing is landed before this node
   archives** (collision cured; vendor definitions quoted verbatim).
   Proof: repo-safe — the grep set over ADR-163 in the sibling's diff;
   this node re-verifies, it does not duplicate.
2. **The guard's CANCEL message names both recovery paths.**
   Proof: repo-safe — a unit test describing the cancellation output
   state (message includes the redeploy path and the release path),
   alongside the existing truth-table tests.
3. **The runbook carries the rolled-back-state section** with the three
   facts and the recovery sequence, cross-referenced from the
   environment-variable procedure.
   Proof: repo-safe — section present and linked in the PR diff; docs
   lint green.
4. **The redeploy arm is proven live once.** A production Redeploy of
   the already-serving release commit is observed continuing past the
   guard (build proceeds; deployment completes).
   Proof: owner-held — the observer and the build-log evidence are
   recorded on MCP-479. Two neighbouring truth-table rows already have
   live 2026-08-05 evidence recorded there (merge commit cancelled by
   the ignored build step; release commit built and deployed).

## Out of scope

- Any change to the guard's truth table or decision logic — review
  confirmed the shipped logic correct for its scope.
- A post-rollback arm for the guard (closed decision above).
- The sibling plan-corpus amendments (PR #746 carries its own cure
  list from the same review).
- Build-environment secret-surface policy (a distinct estate-level
  question; recorded position pending on its own surface).

## Todos

- [ ] Guard: extend the CANCEL stdout message; add the describing unit
      test.
- [ ] Runbook: rolled-back-state section + cross-reference.
- [ ] Record the live redeploy-arm proof on MCP-479 when the owner (or
      an owner-authorised agent action) next performs a production
      redeploy.

One PR carries the guard-message and runbook todos (a single story:
teach the operating knowledge the shipped code assumes). The live-proof
todo is an observation, not a change.

## Relationship to siblings

The unmerged deployment-reliability corpus (PR #746) contains
`release-redeploy-recovery` (MCP-479's original node). This node does
not replace it: that node records why the redeploy arm exists; this
node cures the record defects found by the 2026-08-05 multi-expert
review of that corpus and lands the operating knowledge the vendor
verification produced. If #746's node is amended to cite the same
vendor facts (its Mechanism 4 carries the ADR-163 §10 truing at the
owner's direction), which is exactly what this node's criterion 1
re-verifies before archive.
