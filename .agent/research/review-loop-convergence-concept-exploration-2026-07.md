# Review-loop convergence — concept exploration and proposed framework support

**Author**: Dynamo spins Naphtha (2f5519), implementer, MCP lane
**Date**: 2026-07-27
**Status**: Proposal for Director routing and owner ratification. Nothing here is landed.
**Trigger**: Owner direction, 2026-07-27 — run two pending decisions through the
`principles.md` decision matrix, add a proportionality lens, explore the findings, and
propose the additional conceptual framework support.

## Summary

Four seats independently hit the same review-loop pathology in a single overnight window.

**CORRECTION, 2026-07-27, before any of this was acted on.** This document's original central
claim — that the estate was "close to silent on dynamics discipline" — was **false**, and was
written without reading the skill governing the very work that produced the observations.
Two of its three proposals already existed in ratified doctrine:

- **Convergence** — `pr-lifecycle` §"The review-round state machine" item 2 already carried the
  mechanical step-back predicate (`c[n] >= c[n-1] AND c[n-1] >= c[n-2]`, or four settled rounds
  in an epoch), plus the epoch reset and the generator-recurrence classification.
- **Cure-class separation** — the two-class disposition ruling (CLASS F cures in the PR, CLASS P
  is replied to with its owning ticket and resolved without growing the diff) was owner-ratified
  2026-07-25 on #529.

So the failure was **not an absent framework. It was an unbuilt instrument and an unasked sizing
question**: the tally store item 2 depends on was never built, so nothing counted and
non-convergence had no observable surface. A doctrine gap and a non-application look identical
from inside the loop, and only reading the governing skill distinguishes them.

What survived: **proportionality**, which had no general home and is now
[`.agent/skills/cognition/proportionality/SKILL-CANONICAL.md`](../skills/cognition/proportionality/SKILL-CANONICAL.md),
wired into `concept-exploration`, `pr-lifecycle` and the `principles.md` matrix. The owner then
generalised the rest directly into `concept-exploration` §Loop Dynamics (owner-ratified
2026-07-27), binding every iterative loop rather than review rounds alone.

The observations below stand as recorded. The framing around them is corrected in place rather
than deleted, because the corrected error is the more useful artefact.

## Load-bearing observations

All from the comms stream and PR surfaces, 2026-07-26T20:00Z – 2026-07-27T07:40Z.

| Seat | Surface | Observation |
|---|---|---|
| Dynamo spins Naphtha | PR #570 | 10 review rounds; 13 commits (1 `feat`, 12 `fix`); 4 cures introduced new defects; 3 of those 4 were in hardening the ticket never asked for |
| Schooner binds Trench | PR #583 | Round 2: "three findings, **all in my own round-1 cures**" |
| Smelter rides Temper | PR #582 | Rounds 1–4; "13 unresolved"; round 4 "widens current-truth contract"; blocked awaiting a ruling from 23:14Z, re-pinged 5 times through 02:20Z |
| Skipper tracks Abyss | PR #577/#578 | Identity-fallback wave; PR recreated under the bot identity within minutes |

Two more facts frame the set:

- **The correct alternative is already practised.** The Director minted MCP-220..225 — six
  tickets out of one PR's review round. Homing findings as pointers is live estate practice.
  It is exercised at the Director's discretion, not by a rule the implementer applies at the
  moment of temptation.
- **A standing ruling already exists and was not applied.** Owner standing word: review
  comments critically assessed — *fix / reject / merge-and-ticket* — **never chased**. The
  Director restated the adjacent half at 21:29Z: "no review leg is ever OWED; absence is not
  a gap; settled = checks by name + threads, nothing more."

## Inherited shapes that changed during this exploration

Recorded because a concept-exploration pass that changes nothing has failed.

1. **"#570 contains four separable stories."** I built this model to fit a narrative and had
   not checked it. The commit graph falsified it: one `feat` commit, twelve `fix` commits, one
   coherent module plus its tests, fixtures, CLI and CI leg. The split recommendation I was
   heading toward died here. The residue that survived is narrower and truer: the *story* was
   one story; the *cures* imported adjacent concerns.
2. **"I am unreliable on security-adjacent surfaces."** A reliability-ladder climb —
   observation → story → model → nearly identity. One rung down, the evidence supports
   something duller: unrequested hardening built mid-review has a high defect rate. Schooner's
   independent instance the same night removes the seat-specific reading entirely.
3. **"This is a disposition question about one PR."** It is a dynamics question about a loop,
   and the loop is running at four seats at once.
4. **"My heartbeat had lapsed."** Asserted from a stale poll snapshot; checking showed the
   seat `active` and both claims `fresh`. Re-arming would have double-beaten. Recorded because
   the error shape — asserting an operational state from cached output — is the same shape as
   observation 1.

## The problem frame

- **Gap**: review loops in this estate have no stopping rule and no convergence concept. The
  only recognised terminal state is "zero unresolved threads", which is a moving target
  because every push can add threads.
- **Who it harms**: the owner (open-PR count is their named metric; their attention gets spent
  on questions standing word already answers); the fleet (long-lived branches diverging from
  main, and a Director inbox that fills with per-round rulings); implementers (whole sessions
  consumed by one PR).
- **Mechanism**: three composing sub-mechanisms, below.
- **Constraints**: never disable checks; every issue earns a check; no stopgaps; no escape
  hatches; small single-story PRs.
- **Success**: a PR reaches a terminal state in bounded rounds, with every finding disposed —
  fixed, rejected with verified reasoning, or ticketed with a named carrier — and the loop's
  structure, not the implementer's stamina, is what bounds it.

### M1 — Round multiplication

Bot reviewers review every pushed tip. Review volume therefore scales with **pushes**, not
with **defects**. A seat that pushes a cure batch per round generates a review per round
indefinitely. Nothing in doctrine notices this, because each individual round is legitimate.

### M2 — Cure recursion

Cures written under round pressure are themselves defect-prone, and they land on the same tip
that gets reviewed next. This is positive feedback: cure → new finding → cure. Observed
independently at two seats on one night (Dynamo 4/12 cure commits; Schooner 3/3 round-2
findings inside round-1 cures).

### M3 — Scope absorption

Findings adjacent to the story get **built** rather than **homed**. Every absorption is
locally justified — the finding is real, the fix is small, the reviewer is right. Globally it
enlarges the diff, which enlarges the review surface, which feeds M1. My own worked instance:
`findTargetMismatch` was ticketed as MCP-216 (sequenced out), then built into the same PR
anyway in a later round.

## Proposed framework support

Three additions, in dependency order. Each states what it bounds and — critically — what it
does not.

### Proposal 1 — Proportionality as a pre-decision gate

**Placement.** Not in the ordered lens list. Every position fails:

- Position 1 pre-empts architectural excellence — the door lens 1 categorically closes.
- Position 2 pre-empts strictness, becoming "strictness is disproportionate here" — the
  escape hatch the estate bans.
- Position 3 or later never fires, because "first that decisively resolves governs" and
  lenses 1–2 almost always resolve a shape question.

Both branches bad means the either/or is a false frame. The five lenses answer **"what
shape?"**; proportionality answers **"what size — of the thing, and of the effort deciding
it?"** Those are orthogonal axes; sequencing them is a category error, and the two bad
placements are the symptom.

So: **a pre-decision gate, sibling to Concept Exploration**, which already occupies that slot
asking *"is this the right question?"* Proportionality asks *"is this the right size of
question, and the right level to answer it?"*

| Finding | Move |
|---|---|
| Too big | Narrow; home the remainder as pointers with named carriers |
| Too small | Widen — the lens is symmetric, or it is expediency with better manners |
| Wrong instrument weight | Re-tier: inline check vs fleet, cheaper model vs judgement model, probe vs plan |
| Wrong level | Route it — owner, Director, or resolve at the seat |

**Non-override clause.** Proportionality bounds **scope, instrument weight, and attention
cost**. It never bounds **correctness, strictness, or architectural quality**. *"This is
smaller than I was treating it as"* is a valid finding; *"this is small enough to do badly"*
is the expediency lens 1 excludes, wearing this lens as a disguise.

- **Warrant**: lens 1 has a documented failure mode — rabbit-holing, generic-ideal drift,
  craft-as-value — counterweighted today only ad hoc (scattered memories, one rule, one
  sub-agent, and a risk-tiering clause in §Agentic Quality that covers assurance instruments
  only). Proportionality is the principled counterweight that makes lens 1 safe to apply
  absolutely. Without it lens 1 has no stopping condition.
- **Falsifier**: if it is cited even once to justify reduced rigour, the clause is too weak
  and the lens should be **withdrawn rather than patched** — the rule applied to my own
  credential scan in this same arc.

### Proposal 2 — Convergence as a property of review loops — **ALREADY EXISTED; WITHDRAWN AS A PROPOSAL**

Superseded on discovery: `pr-lifecycle` item 2 carries this mechanically, and
`concept-exploration` §Loop Dynamics now carries its general form. Retained below only as the
independent re-derivation, which is evidence about the concept's reachability from observation
— not a gap. **The live obligation is to BUILD THE TALLY, not to write the rule.**

A review loop has **gain**: the ratio of round N+1's new-finding count to round N's.

The operational form — the **round-gain check**:

```text
Before pushing a cure batch, record the unresolved-finding count.
After the next review lands, compare.
Two consecutive non-decreasing rounds  =>  the loop is not converging.
```

When the loop is not converging, the correct move is **not another round**. It is to change
the loop's structure: freeze the tip, adjudicate every open finding to terminal in one batch,
and home whatever is not this story's work.

**Non-override clause.** Non-convergence never licenses merging with findings undisposed. The
terminal standard is unchanged — every finding fixed, rejected with a verified failure
scenario or its verified absence, or ticketed with a named carrier. What changes is the
*shape* of the terminal, not the *standard*. "Merge-and-ticket" is already authorised by owner
standing word; this proposal supplies the trigger that says when to reach for it.

- **Warrant**: four seats, one night, same non-convergence, none of whom had a concept for it.
  Each was applying state discipline correctly and had no dynamics discipline to apply.
- **Falsifier**: if gain measured across the next ten PR arcs is reliably < 1 without any
  intervention, the loop converges on its own and this proposal is solving a non-problem.
  Measurable directly from PR thread timestamps; I have not measured it beyond this window.

### Proposal 3 — Cure-class separation — **ALREADY EXISTED; WITHDRAWN AS A PROPOSAL**

Superseded on discovery: the #529 two-class disposition ruling (CLASS F / CLASS P) is
owner-ratified 2026-07-25 and owns this for PRs; `concept-exploration` §Loop Dynamics now owns
its general form. Retained below as the re-derivation and its cold-trial evidence.

**A cure not required by the ticket's story is a ticket, not a commit.**

The estate has `future-work-items-are-pointers-not-specs`, but it fires at *planning* time. The
moment of temptation is *review-cure* time — a reviewer raises a real adjacent concern and the
fix looks small. That is precisely where the defects clustered: 3 of my 4, and 3 of 3 of
Schooner's round-2 findings.

**Non-override clause.** This is not permission to leave known defects in the change under
review. A finding *inside* the story's own surface is fixed now. A finding *adjacent* to it is
ticketed with a named carrier. The test is the story boundary, never the effort estimate — "it
is only three lines" is the exact reasoning that produced the CR-injection cure, the TOCTOU
cure, and the withdrawn credential scanner.

- **Warrant**: two independent seats, same night, defects concentrated in self-authored
  optional hardening rather than in the story's own code.
- **Falsifier**: if a sample of cure commits shows defect rates equal between story-required
  and adjacent hardening, the class distinction carries no weight and the rule should be
  dropped rather than kept as ceremony.

## What this exploration did not resolve

Named honestly rather than papered over.

1. **Loop gain is unmeasured beyond this window.** Proposal 2 rests on four seats on one
   night. That is enough to raise the concept; it is not enough to calibrate the threshold.
   "Two consecutive non-decreasing rounds" is a first proposal, not a measured value.
2. **Whether bot-reviewer volume is itself the driver.** Every finding cited here came from
   `chatgpt-codex-connector` or `copilot-pull-request-reviewer`. If review volume is a function
   of reviewer configuration rather than of diff size, the cure may sit at the reviewer
   configuration layer and all three proposals would be treating a symptom.
3. **Whether #570's specific ten findings dedupe.** Two of them review a credential scan
   already removed at round 9. The real count may be eight.
4. **The Director's routing load.** Their last substantive event was 21:58Z against ~9.5 hours
   of heartbeat-only output, while a peer re-pinged for a ruling five times. This is an
   observation, not a verdict — the work-evidence cross-check and direct ping under
   `ping-before-escalate` are the protocol, and neither is mine to fire unilaterally. It is
   recorded here only because "per-round rulings route to the Director" is load that
   Proposal 2 would reduce.

## Disposition

- All three proposals are **doctrine amendments** and therefore owner-ratified. This document
  proposes; it does not land.
- Routed to the Director (Squall wakes Apex, 459fd1) per owner direction.
- The immediate lane action this analysis implies for PR #570 — one bounded adjudication of
  every open finding, then the terminal that the owner's standing word already authorises —
  is unblocked and does not wait on ratification of anything above.
