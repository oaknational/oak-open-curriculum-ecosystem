---
classification: situational
description: "Review feedback on a shepherded PR is information, not an obligation - the default response to a verified finding is a written disposition routing it to a named home (the artefact's next verification point, an owning plan, a ticket); a cure in the PR lands only when the defect would mislead a consumer before that verification point or changes what gets built, and cures batch into declared settlement pushes rather than one push per finding. Governing contract: PDR-140. Named failure (PR #32, 2026-08-31): eleven bot-review rounds at a flat cycle price buying polish already guarded at pickup."
trigger: ceremony:pr-lifecycle
---

# Review feedback defaults to triage, never to a cure-push

Review feedback on a PR is information about the artefact, not an
obligation to change it. The default response to a verified finding is a
written disposition routing it to a named home or rejecting it with
rationale; a cure in the PR is the exception that must earn its place.
This holds for every reviewing agent, not only a pull request's reviewers:
GitHub review bots, sub-reviewers dispatched by a seat, Cricket seats. The
owner, 2026-10-14, verbatim: "Reviewing agents are NEVER a source of
authority, they are ALWAYS a source of information to critically evaluate.
ALWAYS". A reviewing agent's finding is a hypothesis: the seat verifies the
rule's precondition and the owner's prior rulings first-hand before the
finding reaches a record, a cure or the owner, and a finding never reaches
the owner as an open question on the reviewer's authority (a reviewer read
an invariant against the Cardinal Rule by surface analogy and the seat
carried it to the owner as a directive decision when a decision record had
already settled the pattern, 2026-10-13).
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
worthiness-bar reading, settlement-push budget) in the pull request
description's §Scope — the template's section, which reviewers read —
before the first review arrives, citing the acceptance criterion that
makes any pickup-class home a real verifier.

## Action

Before step 1, apply `pr-lifecycle` §Phase 4's scope-first test to the
finding's remedy; the observation still passes step 1.

1. **Verify first-hand**, per `pr-comments-resolve-and-recheck` — a
   concrete failure scenario or its verified absence, never
   compensating-layer reasoning. A reviewer's premise about vendor behaviour
   is a hypothesis: read the vendor's source at the tag before paying for the
   change a review motivates (two reviewers' premise about resume was refuted
   in minutes at the tag, 2026-09-24). A thread earns a cure only when it
   names a defect the tree can falsify — wrong behaviour, a wrong permanent
   statement, a gate-changer; everything else is a disposition with evidence
   (Director steer, 2026-09-04). A rejection survives only as long as
   its premise: when the same finding returns with new sites, re-derive
   the premise instead of re-issuing the rejection (2026-08-19: a
   round-3 rejection of a conditional-guard class rested on "the expect
   throws first"; round 4 found `.not.toBeNull()` passes for
   `undefined`, so the guarded branch was reachable on a passing run —
   the reviewer's finding was righter than the rejection). A finding on
   text both estates carry is read against the twin before any cure
   travels; two reviewers' opposite narrowings of one sentence are cured
   by citing the governing loop, never by restating it; a cure over the
   risk bar (a credential in a log, a validator that can pass silently)
   travels to the sibling as the same bytes, and a wording finding travels
   as a note (two reviewers on one sentence while the sibling's rule lacked
   the paragraph, 2026-10-02; eleven findings on one twin, 2026-10-03).
2. **Classify against the declared bar** (PDR-140 clause 2): does the
   defect mislead a consumer before the artefact's next verification
   point, or change what gets built? Evaluate against the surface where
   the defect lives — a finding revealing a defect on an already-served
   surface takes that surface's fast lane regardless of this PR's
   class. The bar decides WHERE the cure lands, never WHETHER truth
   matters. On a records-class artefact whose verification point is
   merge, a statement wrong under a rule today is not over-bar per se:
   the test is whether a reader acting on the artefact would be misled
   (PDR-140 clause 9, amended 2026-09-07).
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
   immediate push, reason recorded. Budget exhaustion with an over-bar
   cure pending is the step-back moment, never a deadlock: record it, run
   the generator question over the full raised set, and rebudget by
   recorded decision — once per PR on a records-class artefact, its push
   carrying over-bar cures and queued ledger writes only (PDR-140 clause 4
   and clause 9b). After that, every below-bar finding is dispositioned
   without a cure, and a later over-bar finding still cures, in a push
   carrying nothing beyond that cure and any queued ledger writes. The
   owner's three words of 2026-10-02 govern the whole step: "we do not need
   to pay attention to feedback, we need to triage it and _decide_ what we
   do with it"; "the point of the PR response budgets is to reduce time
   spent on PR ceremony. Cutting a new branch and a separate PR does not
   serve that goal, does it?"; "we deal in risk, cost, value, assessement".
   So one assessment per finding (risk, cost, value, home) comes before
   anything is touched; at budget exhaustion the only moves are absorb into
   work that already exists or decline with a reason, never a pull request
   of its own; and a triage never cures all nor declines all.
5. **Age-out (below-bar only)**: a below-bar finding on text unchanged
   since the last reviewed head is triaged normally but never reopens
   settled state or resets the settlement clock; an over-bar finding
   cures normally whatever text it binds to.
6. **Humans are out of scope**: human reviewers keep conversational
   cadence; this discipline batches bot lanes only, and pending
   bot-lane cures may ride human-lane pushes.

Two triggers operate inside the bar's batching, never outside it: a
below-bar finding whose cure is cheaper than its written disposition
joins the next settlement push instead of earning a route or a
rejection (a disposition that costs more than the fix is the wrong
instrument), and a second raising of the same finding by an independent
reviewer moves a disposed finding into that batch. Neither opens a push
of its own.

## Failure mode prevented

The call-and-response tail: one cure-push per finding against a reviewer
whose finding supply does not deplete. PR #32 (2026-08-31) ran eleven
review waves and roughly three hours this way; PDR-140's Context holds
the full account. Under the declared budget the same PR settles in about
three cycles — first review plus two settlement pushes — with every
worthiness-bar catch (the whole-plan rewrite, the evidence-chain
corrections) still landing.
