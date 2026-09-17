---
pdr_kind: governance
---

# PDR-140: Review feedback is information — the response is what gets priced

**Status**: Accepted (owner-ratified 2026-08-31, in-session; the owner's
framing: "enough, these long tails are costing us hours, what are they
providing?" and, on the cure direction, "flipping the default action on
feedback to no action unless action is critically determined as
worthwhile" — with the explicit constraint that auto-merge is not the
answer, because "that just ignores feedback"; and, on sufficiency, the
PR skill must correct its own loops without out-of-band skill pokes).
**Date**: 2026-08-31

## Context

On 2026-08-31 an eleven-wave bot-review arc ran over a seven-file
born-sketch planning changeset, costing roughly three hours of shepherd
attention across ten settled rounds (one wave was superseded
mid-review). The convergence tally, built retroactively when the owner
asked whether the comments were converging, read 9, 3, 2, 1, 2, 1, 1,
1, 2, 3 findings across the settled rounds — never reaching a stable
zero. The early rounds were high-value: a round-six whole-plan rewrite
that stopped three duplicate tools being planned, and evidence-chain
corrections that materially improved the artefact's factual grounding.
The later rounds bought evidence-polish on sketch documents whose own
acceptance criteria re-verify every polished claim at pickup. The final
settled round's three findings all targeted text unchanged for five or
more rounds. The full corpus (tally, dispositions, per-round record) is
conserved in the delivering estate's memory and PR record.

That last observation carries the diagnosis. A competent adversarial
reviewer of a prose-class artefact (plans, doctrine, documentation) does
not enumerate a finite defect list and deplete it; it re-reads the whole
artefact each push and surfaces its top few observations from an
effectively unbounded pool — every sentence of nontrivial prose admits a
true improvement. **Each response purchases the next sample from that
pool.** The per-round finding count measures the sampler, not the
artefact, so "review until zero findings" is not a convergence process
for prose; it terminates only when a round's samples happen to fall
below the reviewer's reporting threshold. This is the mechanism behind
PDR-132's measured finding that reviews do not converge by attrition.
Code-class changesets sit differently: executable checks give defects an
enumerable surface, so depletion review can fit there — but that contrast
is a working hypothesis, not a measured result (PDR-132's corpus carries
no class field, and the estate holds at least one code-PR
non-convergence instance), which is one reason this record scopes its
decision to prose.

The tail is then the product of three defaults stacking:

1. **Every finding defaults to action** — the obligation reflex makes
   "cure it" the null response, and makes standing down the act that
   needs justification. Against an unbounded finding supply, an
   every-finding-cured protocol never terminates on merit.
2. **Every action defaults to immediate republish** — response cadence is
   slaved to feedback cadence, one push per review wave.
3. **Every republish solicits the next sample** — and a full cycle
   (CI + review + shepherd turnaround, ~30–40 minutes on the worked
   instance) is charged at a flat rate regardless of the finding's
   value.

A one-word imprecision and a build-the-wrong-thing defect currently cost
identical response cycles. That flat pricing is the defect this record
cures. The review cycle is a core value-creation mechanism — the worked
instance's early rounds prove it — so the cure must preserve the value
channel: every finding stays engaged with; what changes is what a
response costs and when it is paid.

Relationship to neighbours: PDR-131 owns the merge boundary (quality
binds at settled-READY; a disposition-with-resolution is how a finding
reaches zero) and is unchanged. PDR-132 owns the authoring-time
changeset budget (rounds a changeset should need) and is unchanged; this
record extends its bind-at-authoring principle to the response side. A
PDR-132 amendment could not own this contract: the two records carry
different falsifier regimes (reviewer-side round counts there;
response-side push counts and disposition integrity here), and welding
them would blur both. The rule `pr-comments-resolve-and-recheck`
receives two surgical amendments so the contracts compose (its terminal
condition counts undispositioned comments rather than new ones, and its
compensating-layer ban is split from cure-placement); everything else in
it — every comment dispositioned, dispositions grounded in verified
failure scenarios — binds unchanged.

## Decision

Clauses 1–6 bind **prose-class changesets** (plans, doctrine,
documentation, and the prose findings of mixed changesets). Code-class
changesets keep the existing review-round state machine unchanged; if
measurement shows the sampler mechanism operating on code lanes, this
scope widens by dated amendment, never by improvisation.

1. **Feedback is information; the cure is the exception.** Every review
   finding still receives first-hand verification, a written
   disposition, and thread resolution. The default disposition for a
   verified finding is **routing to a named home** or **rejection with
   rationale** — never a cure-push. A routing disposition is valid only
   when the home takes a **durable write that its consuming step
   reads**: a finding routed to a plan's pickup lands a ledger line in
   the plan artefact itself (batched into the next settlement push, at
   zero marginal push cost) or in the plan's linked ticket; a finding
   routed to a ticket lands the ticket. A resolved PR thread or a
   session's working notes is never the sole carrier. A cure in the PR
   lands only over the worthiness bar (clause 2).

2. **The worthiness bar has two prongs**: the defect would mislead a
   consumer of the artefact **before its next verification point**, or
   it **changes what gets built**. The bar is evaluated against the
   surface **where the defect lives**, not the surface under review: a
   finding on a reviewed sketch that reveals a defect on an
   already-served surface takes that surface's fast lane (clause 4)
   regardless of this PR's declared class. The bar decides WHERE a cure
   lands (this PR, the pickup step, a ticket) — never WHETHER truth
   matters. Using it to leave a served surface lying, or to lower
   quality on any surface without a later guard, is the expediency that
   proportionality's non-override clause categorically excludes. An
   artefact class with no future verification point (a served doc; a
   doctrine change already owner-ratified in-session) declares "merge"
   as its verification point at open: any genuine falsehood then clears
   prong one and cures in the PR; below-bar findings there disposition
   by rejection-with-rationale or a ticket.

3. **The intake contract binds at PR-open.** The shepherd's opening
   working notes declare: the changeset's artefact class, its next
   verification point (pickup for born-sketch plans; ratification
   reading for doctrine not yet ratified; merge where no later point
   exists), the worthiness-bar reading that follows from those two, and
   the settlement-push budget (clause 4). Where a routing home is a
   plan's pickup, the declaration cites the acceptance criterion or
   ledger surface that makes the pickup a real verifier — a quoted
   property of the artefact, never an assumption. Deciding these
   mid-loop, under live review pressure, is what the worked instance
   shows failing; declaring them before the first review wave is
   PDR-132's bind-at-authoring principle applied to the response side.

4. **Pushes are the rationed unit; response cadence decouples from
   feedback cadence.** Cures that clear the bar accumulate and land in
   **batched settlement pushes** — default budget two per PR after
   first review, declared at open. Replies, dispositions, and thread
   resolutions stay free, continuous, and unbatched. **Fast-track** is
   defined mechanically: a cure pushes outside the settlement batch
   only when the defect is exposed on a served or live surface now — a
   consumer who is not this PR's reviewer can currently act on it —
   with the reason recorded; a fast-track not meeting that test
   consumes settlement budget. Pushes that change no reviewed content
   (a CI cure, a sync, a rebase) sit outside the budget and never carry
   cures; pending cures ride only declared settlement pushes or
   human-lane pushes (clause 6). A queued ledger write (clause 1) rides
   the next settlement push; if none is otherwise pending at
   settled-READY, the ledger write itself is the final settlement push.
   **Budget exhaustion with a mandatory cure pending is never a
   deadlock and never a silent overrun**: it is the step-back moment —
   record budget-exceeded, run the generator question over the full
   raised set, and rebudget by recorded decision (one further
   settlement push with its reason in the working notes). The budget is
   a tripwire forcing that deliberate decision; the cure obligation
   (clause 2) always survives it.

5. **Age-out, scoped to below-bar findings.** A below-bar finding that
   binds to text unchanged since the last reviewed head reveals the
   pool's depth, not new information about the artefact; it is verified
   and dispositioned like any finding but never reopens settled state
   and never resets the settlement clock (the countdown to the next
   batched settlement push). An **over-bar** finding takes the normal
   cure path whatever text it binds to — a first discovery of a real
   defect is new information regardless of the text's age. Age-out
   governs settlement accounting only; it never blocks a cure.

6. **Scope boundary.** Bot-review lanes batch under clauses 4–5. Human
   reviewers keep conversational cadence: their patience is a genuinely
   depleting resource, per-comment responsiveness carries real
   relationship value there, and a human's asks follow the pr-lifecycle
   state machine's existing small/large dispositions unchanged.
   Human-lane cure pushes sit outside the settlement budget and serve
   as batching opportunities — pending bot-lane cures ride them; bot
   findings raised on such a push triage normally under this record.

7. **Nothing is silently dropped, and the trail has a reader.** The
   written dispositions and their durable ledger writes are the audit
   trail. The consuming step reads them: slicing a plan at pickup
   consumes the plan's disposition ledger (the plan skill carries the
   step). The trailing-month measurement (below) re-classifies a
   fixed-size random sample of below-bar dispositions against their
   declared bars; an over-bar finding found routed is a recorded breach
   counting toward the falsifier — bar erosion becomes observable
   before an incident, not after one. A finding raised only in a
   review BODY has no thread to resolve: its disposition lands as a PR
   comment answering that review and the tally row records it
   dispositioned — that is this record's dispositioned-with-resolution
   for summary-only findings.

8. **Sufficiency.** The pr-lifecycle state machine carries every
   checkpoint this record requires as transitions of its own loop — the
   intake declaration and tally at PR-open, the bar at each finding,
   the budget at each push, the step-back arms at each settle. Needing
   an out-of-band cognitive-skill invocation (proportionality or any
   other) to correct a running PR loop is a defect against pr-lifecycle
   and is filed as one; it is never a usage pattern. (Worked instance:
   the owner manually invoked the proportionality skill twice in one
   day to correct the founding arc — the hack this clause retires.)

## Prediction and falsifier

Per the PDR-130 fast-lane obligation. **Prediction**: for bot-reviewed
prose-class PRs born after this lands, post-first-review pushes per PR
fall within the declared settlement budget, while worthiness-bar
catches (the whole-plan-rewrite class and the evidence-chain-correction
class the worked instance's early rounds delivered) continue to land —
measured over the trailing month by the per-PR commits and
review-thread read of PDR-132's methodology, PLUS the clause-7
disposition sample (push counts alone improve under bar erosion, so
they are never read without it). **Falsifier**: if a dispositioned
finding's defect misleads a consumer before its named verification
point, if the disposition sample finds routed over-bar findings, or if
pickup steps fail to consume disposition ledgers (routed findings
resurfacing unhandled at implementation), the default reverts to
cure-in-PR and this record says so in a dated amendment. Either failure
is evidence the bar or the ledger, not the reviewer, was the weak link.

## Consequences

- `pr-lifecycle` SKILL: the review-round state machine opens with the
  intake contract as its firing gate (pointer form — this record owns
  the clauses), pins the tally semantics under triage (the tally counts
  RAISED findings, measuring the sampler; the step-back arms and
  terminal-success state read the cure-worthy count; generator
  classification runs over each settlement round's full raised set,
  dispositioned findings included, and an accumulated disposition set
  that jointly changes what gets built escalates even at net zero), and
  reconciles Phase 4's triage ruling for bot lanes. The born-sketch
  plan-PR convergence cap (owner ruling 2026-07-25) is subsumed: it was
  this record's clauses 1–2 specialised to one artefact class, and its
  falsehood exception now reads through the bar — a falsehood earns a
  cure only if it would mislead before pickup, the reading that lets
  the loop terminate.
- `plan` SKILL: the Todos requirement gains "slicing at pickup consumes
  the plan's disposition ledger."
- `proportionality` SKILL: the review-loops domain instance points
  here, and its proper-use guidance names the clause-8 anti-pattern.
- New rule `review-feedback-defaults-to-triage` carries the intake
  discipline in pointer form; `pr-comments-resolve-and-recheck` takes
  the two composing amendments named in Context.
- No ADR: this is Practice-process substance (practice-core), not host
  product architecture.
- Named follow-up: a per-finding retro-triage of the founding arc's
  full finding corpus against the declared bar, published as the
  calibration corpus for the judgement call — the bar's case law.
