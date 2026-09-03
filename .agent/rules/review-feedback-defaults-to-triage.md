# Review feedback defaults to triage, never to a cure-push

Review feedback on a PR is information about the artefact, not an
obligation to change it. The default response to a verified finding is a
written disposition routing it to a named home or rejecting it with
rationale; a cure in the PR is the exception that must earn its place.
The governing contract is
[PDR-140](../practice-core/decision-records/PDR-140-review-response-pricing.md);
this rule is its intake discipline for shepherded PRs, and it binds
prose-class changesets (code-class changesets keep the existing
state-machine behaviour).

## Trigger

Review feedback arrives on a PR this session shepherds whose changeset
is prose-class — or, on a mixed code-and-prose changeset, the feedback
binds a prose artefact (PDR-140 binds the prose findings of mixed
changesets; code findings keep the existing state-machine behaviour).
Fires per wave, before any cure is drafted. At PR-open, the companion moment:
declare the intake contract (artefact class, next verification point,
worthiness-bar reading, settlement-push budget) in the working notes
before the first review arrives, citing the acceptance criterion that
makes any pickup-class home a real verifier.

## Action

1. **Verify first-hand**, per `pr-comments-resolve-and-recheck` — a
   concrete failure scenario or its verified absence, never
   compensating-layer reasoning. A rejection survives only as long as
   its premise: when the same finding returns with new sites, re-derive
   the premise instead of re-issuing the rejection (2026-08-19: a
   round-3 rejection of a conditional-guard class rested on "the expect
   throws first"; round 4 found `.not.toBeNull()` passes for
   `undefined`, so the guarded branch was reachable on a passing run —
   the reviewer's finding was righter than the rejection).
2. **Classify against the declared bar** (PDR-140 clause 2): does the
   defect mislead a consumer before the artefact's next verification
   point, or change what gets built? Evaluate against the surface where
   the defect lives — a finding revealing a defect on an already-served
   surface takes that surface's fast lane regardless of this PR's
   class. The bar decides WHERE the cure lands, never WHETHER truth
   matters.
3. **Below the bar**: reply with the disposition — a route to a named
   home, or a rejection with rationale — and resolve the thread. A
   ROUTE additionally queues the durable write the home's consuming
   step reads (a ledger line in the plan artefact or its ticket for
   pickup-homed findings; the ticket for ticket-homed ones); a
   REJECTION needs no write — the reply's verified rationale is its
   whole record. This is
   `pr-comments-resolve-and-recheck`'s disposition leg; only the write
   landing is batched, no per-finding push. Queued ledger writes ride
   the next settlement push; if none is otherwise needed by
   settled-READY, the ledger write itself is the final settlement push
   (consuming budget normally) — a PR never merges with a queued write
   unlanded.
4. **Over the bar**: add the cure to the settlement batch; it lands in
   the next batched settlement push within the declared budget. Only a
   defect exposed on a served or live surface now fast-tracks an
   immediate push, reason recorded.
5. **Age-out (below-bar only)**: a below-bar finding on text unchanged
   since the last reviewed head is triaged normally but never reopens
   settled state or resets the settlement clock; an over-bar finding
   cures normally whatever text it binds to.
6. **Humans are out of scope**: human reviewers keep conversational
   cadence; this discipline batches bot lanes only, and pending
   bot-lane cures may ride human-lane pushes.

## Failure mode prevented

The call-and-response tail: one cure-push per finding against a reviewer
whose finding supply does not deplete. PR #32 (2026-08-31) ran eleven
review waves and roughly three hours this way; PDR-140's Context holds
the full account. Under the declared budget the same PR settles in about
three cycles — first review plus two settlement pushes — with every
worthiness-bar catch (the whole-plan rewrite, the evidence-chain
corrections) still landing.
