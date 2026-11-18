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
PR skill must correct its own loops without out-of-band skill pokes;
amended 2026-09-07, 2026-09-26, 2026-10-01 and 2026-10-24 — see Amendment Log).
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
   by rejection-with-rationale or a ticket. Records-class artefacts read
   this sentence through clause 9.

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
   (clause 2) always survives it. On records-class artefacts the
   rebudget is granted once per PR and its push carries over-bar cures
   and queued ledger writes only (clause 9). Read with the owner's ruling
   of 2026-09-14, verbatim "I don't want the number of rounds of PRs to go
   up": the rebudget licenses the one settlement push that carries the
   pending mandatory cure and the dispositions, never a further cure round
   after it; past round two each later below-bar finding is a disposition
   riding the settlement (a prose-class pull request took two rebudget
   pushes under this clause before the ruling reached its seat, 2026-09-24).
   An over-bar finding found after that push keeps the cure path clauses 2
   and 5 give it, because the cure obligation survives budget exhaustion:
   one late-cure push carrying that cure and its disposition line. That
   push requests the expected leg, so the tip binds for the merge boundary;
   the leg's findings are dispositions only, in signed lines, and a
   correctness defect among them opens a further push only through this
   clause's doors.

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

9. **Records-class reading (amended 2026-09-07; the Amendment Log
   entry of that date is the revision record, with the measurement
   and the falsifier).** For a records-class artefact — a served
   doc, a record, doctrine already ratified — whose declared
   verification point is merge:
   - (a) Clause 2's merge-verification sentence reads through prong
     one as written: a falsehood clears the bar when a reader acting
     on the artefact would be misled by it. A statement wrong under
     a rule today is not over-bar per se; an imprecision, a bent
     vocabulary, a missing qualifier or a stale aside that no reader
     acts on is below the bar and dispositions by rejection with
     rationale or by a route to a register row.
   - (b) Clause 4's rebudget is granted once per PR, never once per
     exhaustion, and a rebudgeted push carries over-bar cures and
     queued ledger writes only. After it, every below-bar finding is
     dispositioned without a cure — a rejection needs no write; a
     route's durable write (clause 1) queues — and the final head is
     named. The cure obligation survives every exhaustion exactly as
     clause 4 says: an over-bar finding arriving later still cures,
     in a push that carries nothing beyond that cure and any queued
     ledger writes. That path terminates on merit: once (a) is
     applied, the supply of statements that would mislead a reader
     is finite, which the bent-vocabulary class never was.
   - (c) Post-final-head route writes are bounded: queued writes land
     together in at most ONE ledger push (clause 4's final settlement
     push, which may also carry a late cure). A route arriving after
     that push writes its row to the seat's napkin — the tracked
     capture surface every consolidation pass consumes, landing with
     the seat's own capture commits, never by reopening the reviewed
     PR — or to a records PR of the lane that is already open; the
     reply names the carrier. The thread is never the sole carrier,
     and the reviewed PR merges with no write queued on it.
   - (d) A routed residue's named home is an existing surface — a
     register row (the pending-graduations register, the gotchas
     reference, a plan's `## Review dispositions` section) or a PR
     already open for its own story — never a PR opened to carry
     residue. A residue PR that exists anyway is terminal: a
     settlement budget of one push, no rebudget, the paths of (b) and
     (c) unchanged, and no further residue PR opened from it.

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

## Amendment Log

### 2026-09-07 — the records-class reading of prong one; one rebudget per PR; where residue is homed

**Context** (measured first-hand on a fork's consolidation lane,
2026-09-07). Five records-class PRs — continuity records, rules,
skills and reference pages whose verification point is merge —
each declared a two-push settlement budget at open and together ran
seventeen settled rounds and fifty-three cures. Every finding was
real at its anchor. Almost every cure answered a statement "wrong
under a rule today": a sentence bending a rule's vocabulary, an
unqualified claim, a missing dated qualifier. Each was read as a
genuine falsehood under clause 2's merge-verification sentence,
therefore as a mandatory cure, so every budget exhaustion rebudgeted
under clause 4 and the next push drew the next sample from the
reviewer's pool. The loop ended when the owner invoked
`proportionality` and `pr-lifecycle` out of band, with no words;
this seat read the invocation as the clause-8 correction and ended
the loop — the anti-pattern recurring, filed here as the defect it
names. A sixth PR was opened to carry two of the five PRs'
step-back residue and cost two rounds, seven cures and a CI cycle
of its own.

**Decision** — clause 9 of the Decision section, authored there per
`new-rule-vs-pdr-clause` item 2 (an amendment is a new numbered clause
inside the Decision; this entry is the revision record): the
records-class reading of prong one (9a), one rebudget per PR with
over-bar cures and queued ledger writes only (9b), the bound on
post-final-head ledger pushes (9c), and residue homes on existing
surfaces (9d). Clauses 2 and 4 carry one-line pointers to clause 9
where their unqualified text would otherwise contradict it.

**Falsifiers**, one axis per control, measured by the trailing-month
PR read of PDR-132's methodology and the clause-7 disposition sample;
one verified instance amends the failing sub-clause by dated
amendment: 9(a) — a records-class statement dispositioned below the
bar that misleads a reader acting on it before the next records pass
over that file; 9(b) — a records-class PR whose working notes record
a second rebudget, or a below-bar cure landing on a post-budget push;
9(c) — more than one post-final-head ledger push on a records-class
PR, or a routed write found in no napkin, register or PR by the
seat's session close; 9(d) — a PR whose body carries another PR's
review residue as its story.

### 2026-09-26 — clause 4 reads its rebudget with the owner's two-round ruling

Clause 4 gained the reading of its rebudget under the owner's ruling of 2026-09-14, verbatim "I
don't want the number of rounds of PRs to go up": the rebudget licenses the one settlement push
that carries the pending mandatory cure and the dispositions, never a further cure round; past
round two a later below-bar finding is a disposition riding the settlement; and an over-bar
finding found after that push keeps one late-cure push. OCE wrote the paragraph on
2026-09-25 with no entry, and this entry records it. On 2026-09-26 the Director's ruling
replaced the paragraph's "with no further round of review requests": the late-cure push
requests its expected leg, so the tip binds for the merge boundary (PDR-132 item 6), and that
leg's findings are dispositions only. A binding leg whose findings cannot be cured is not a
round; the owner's concept, that the number of rounds does not go up, is kept.

### 2026-10-01 — clause 4's rebudget is bounded by the owner's rounds word of 2026-09-14

The owner, 2026-09-14 (PDR-132 §Decision item 1 carries it: "I don't want the number of rounds of
PRs to go up"; the closure record of that day carries the operating form: the two rounds bind as
written, after round two every remaining finding is dispositioned in the same slot turn as the last
push, and a round three is a call on a correctness defect only). Clause 4's rebudget by recorded
decision therefore never adds a review round: one further settlement push may carry over-bar cures,
and a third review round opens only for a correctness defect, by the coordinating seat's recorded
call. Recorded 2026-10-01 by the two-estate consolidation's retrospective seat as the application of
the owner's own word to owner-ratified text; the draft reconciliation a Director prepared on
2026-09-28 (OCE comms events a847fc35, a3b0f6bd) is the instance, and nothing beyond the owner's
word is carried.

### 2026-10-24 — clause 4's tripwire is a hold the seat lifts by deciding, never the owner

The owner, on a pre-push gate that refused the push of a fix because the pull
request's settlement budget was spent, verbatim: "does blocking a push on an
important fix sound like it is ever the right choice? The point of the tools
is efficiency and value, not ceremony", and, on the shape of the cure: "not
blocking is one option, but either way the check must be a trigger that makes
the agent think", with no comment and no further push added. Read into clause
4: the budget is the tripwire that forces the step-back decision, and the
gate makes that decision happen by holding the push, before the long check
and for seconds, until the seat has written the decision as one line in the
local, untracked note `.agent/state/collaboration/review-rebudgets.md`
(`<pull request> — <date> — <reason>`, one line per push past the budget);
the same push then passes. The rebudget is the seat's recorded decision, as
clause 4 always said; the gate no longer names the owner as its lifter, and
the wrap's ledger row carries the reasons. The cure obligation survives
exhaustion exactly as before. The instance, 24 October: a coordination pull
request with two settlement rounds spent (its opening head and a hand-resolved
merge of the default branch, which the sync exemption could not cover), the
refused push carrying the comms-log render-at-write cure.
