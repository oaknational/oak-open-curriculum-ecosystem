---
name: proportionality
classification: active
description: >-
  Size the work and the instrument before shaping either. A pre-decision gate,
  sibling to concept-exploration, asking whether this is the right SIZE of question
  and the right LEVEL to answer it — four findings (too big, too small, wrong
  instrument weight, wrong level) under a non-override clause that keeps it from
  becoming an expediency door. Use before the decision lenses; when a loop stops
  converging; when adjacent findings are being absorbed rather than homed; or when a
  decision is about to route to the wrong seat.
---

# Proportionality

**Governance**: the pre-decision sizing gate that runs alongside
[`concept-exploration`](../concept-exploration/SKILL-CANONICAL.md) and ahead of the
[`principles.md` decision lenses](../../../directives/principles.md#decision-lenses--order-of-resolution).
Concept exploration asks *"is this the right question?"*; this asks *"is this the right
SIZE of question, and the right LEVEL to answer it?"* It carries the general form of a
principle several surfaces already operationalise in their own domains — most
completely [PDR-132](../../../practice-core/decision-records/PDR-132-changeset-health-round-budgets-bind-at-authoring-time.md),
whose owner framing is this skill's thesis: *the shaping principle must reach work at
planning time, because at PR time "that is too late to plan work"*.

## Why it is not a sixth lens

The five lenses resolve **shape** — first that decisively resolves governs. Test every
position for a sixth:

- **Position 1** pre-empts architectural excellence — the door lens 1 categorically closes.
- **Position 2** pre-empts strictness, becoming *"strictness is disproportionate here"* — the
  escape hatch [`no-escape-hatches`](../../../directives/principles.md#strict-and-complete) bans.
- **Position 3 or later** never fires: lenses 1–2 almost always resolve a shape question
  first.

Every position fails, which by the estate's own directive means the either/or is a false
frame. The lenses answer *what shape*; proportionality answers *what size — of the thing,
and of the effort deciding it*. Those are orthogonal axes, and sequencing incommensurable
lenses is a category error. So it runs **before** them, on the question, not on the answer.

## The gate

Ask the three questions in order. Each has a symmetric answer set — a gate that only ever
shrinks things is expediency with better manners.

| Axis | Question | Findings |
|---|---|---|
| **Scope** | Is this one thing, or several wearing one name? | **Too big** → narrow; home the remainder as pointers with named carriers — including expansion BY REVIEW: a finding whose remedy would exceed the declared scope is a scope finding whatever the truth of its observation; [`pr-lifecycle`](../../change-custody/pr-lifecycle/SKILL-CANONICAL.md) §Phase 4 handles it. **Too small** → widen; the real work is larger than the ask implies |
| **Instrument** | Is the tool matched to the question? | **Too heavy** → re-tier (an inline check over a fleet; a cheaper model tier; a probe over a plan). **Too light** → escalate the instrument; a cheap check on an irreversible call is false economy |
| **Level** | Whose decision is this? | **Wrong level** → route it: owner, Director, or resolve at the seat. A decision already covered by standing word is not an escalation |

A plan written under a "finish" word makes its value step the first todo and lets the measure
serve it: instruments (a survey, a ledger, a records pass) placed before the first value step
are meta-work, and the instrument axis reads them as too heavy for the question (four
corrections on one plan, 2026-10-02).

### Step back and be sensible

The owner's own phrasing of the instrument axis (2026-07-19, after a session
whose deliverables landed well under an apparatus that had grown heavy: a
twenty-two-agent audit, a three-agent fleet to verify a deterministic script,
paired conscience checks plus a mid-session adjudication of their divergence,
in a session opened with "absolute minimum of comms ceremony"): "please
remember: step back and be sensible." Standing mandates and effort flags
license scale; they never require it. Before dispatching any fleet, cron,
paired check or formal record: name the cheapest instrument that would settle
the question (a deterministic result needs a spot-check, not a verification
fleet; a divergent conscience check needs a one-line note; a status update
needs the few sentences the reader will act on); use it unless the stakes, a
legal, destructive or owner-facing gate, genuinely warrant redundancy.

The scope axis has the same owner form (2026-07-25, a dependency-update lane
that grew into reachability forensics, a deployed-environment card and an
implied threat posture the product never had): "I asked for an update of
deps, not an overhaul of settled architecture." A remit licenses its remit;
security work inherits the PRODUCT's actual threat model, never a generic
maximal one, and settled architecture, deliberate testing affordances
included, is not a finding.

### The non-override clause

Proportionality bounds **scope, instrument weight, and attention cost**. It never bounds
**correctness, strictness, or architectural quality**.

*"This is smaller than I was treating it as"* is a valid finding. *"This is small enough
to do badly"* is the expediency
[§Architectural Excellence](../../../directives/principles.md#architectural-excellence-over-expediency)
categorically excludes, wearing this gate as a disguise. The word *proportionate* is
exactly what a rush impulse reaches for, so the clause is absolute in the same register as
the doctrine it protects: a proportionality finding may change what is built and how much
review it earns; it may never change whether the built thing is correct.

## Why lens 1 needs it

[§Architectural Excellence](../../../directives/principles.md#architectural-excellence-over-expediency)
is absolute by design, and absoluteness has a known failure mode: it supplies no stopping
condition. Unchecked, it produces rabbit-holing, generic-ideal drift, and craft-as-value —
each step locally excellent, the aggregate a global pessimisation.

The counterweights today are domain-local and complete within their domains (below).
Proportionality is their general form, which is what makes lens 1 safe to apply absolutely:
excellence still decides the shape; proportionality decides how much shape is in scope.

## Domain instances — cite these, never restate them

This skill is the general principle. Each surface below owns the operational detail for its
domain and is the single source of truth there. A restatement here would be the DRY
violation [§Documentation Is Infrastructure](../../../directives/principles.md#documentation-is-infrastructure)
names as a real defect.

- **Review loops** —
  [`pr-lifecycle`](../../change-custody/pr-lifecycle/SKILL-CANONICAL.md) §"The review-round state machine"
  item 2 owns convergence: the tally store, the mechanical step-back predicate, the epoch
  reset, and the generator-recurrence classification. It is the fully-worked instrument;
  build the tally, or the trigger cannot fire. Response-side economics — what answering a
  finding costs and when it is paid — are owned by
  [PDR-140](../../../practice-core/decision-records/PDR-140-review-response-pricing.md)
  (feedback defaults to triage; cures batch into declared settlement pushes), whose intake
  contract binds at PR-open exactly as PDR-132's budgets bind at authoring. The in-loop
  re-pricing checkpoint — the review cost gate's `warn` and the three answers it admits,
  where the estate carries that gate (OCE's `agent-tools review-cost`) — is
  `pr-lifecycle`'s (§Response pricing), as PDR-140 clause 8 requires of every in-loop
  checkpoint; the gate is cited there and never invoked out of band to correct a running
  loop. The wrap's survey and the review-cost ledger audit every answer with hindsight.
- **Changeset size** —
  [PDR-132](../../../practice-core/decision-records/PDR-132-changeset-health-round-budgets-bind-at-authoring-time.md)
  owns the round budget and binds it at authoring time.
- **Absorbing adjacent findings** — `pr-lifecycle`'s two-class disposition ruling
  (owner-ratified 2026-07-25) owns the in-flight recovery: CLASS F cures in the PR, CLASS P
  is replied to with its owning ticket and resolved without growing the diff. Its general
  form is
  [`concept-exploration`](../concept-exploration/SKILL-CANONICAL.md) §Loop Dynamics
  (owner-ratified 2026-07-27), which binds every iterative loop: work the current story does
  not require is routed to a named home, never absorbed, and **individual validity is not
  sufficiency** — correct, relevant, and proportionate are separate conjuncts, tested
  separately.
- **Judgement pipelines** —
  [`agentic-judgment-conserve-by-default`](../../../rules/agentic-judgment-conserve-by-default.md)
  places rigour on the irreversible side. That is this gate's instrument axis with the
  asymmetry named: cheap checks are proportionate where errors are visible and reversible,
  never where they are silent and terminal.
- **Assurance rigour** —
  [§Agentic Quality](../../../directives/principles.md#agentic-quality) risk-tiers assurance to
  the harm of getting it wrong, *"never uniform"*.
- **Private instruments** — a wrong-instrument-weight instance. A tool the owner uses alone on
  his machine takes the basest working version: one observation, one pull request, and no
  reviewer fleet unless he asks. Reviewer and accessibility depth is sized by the audience: a
  public service gets it, a private instrument does not. When he says a thing is SIMPLE, the
  measure is what he must attend to, never the estate's doctrine. The owner, 2026-10-08, on a
  local editor that had drawn six reviewers and a Cricket suite, verbatim: "you are building an
  MVP editing app, which requires the basest ability to be read then changed... and you are
  applying the a11y requirements of a public service, and thus wasting my time, my money, and
  your attention."

**When a domain instance exists, run it.** This skill does not substitute for the
mechanical instrument; it is the reason to reach for one, and the fallback when a domain
has none.

**Proper use, and the anti-pattern this gate is not.** This gate fires at shaping
moments — before a decision, before the lenses, at authoring — and routes running loops
to their domain instruments. It is NOT a mid-loop rescue tool: a manual invocation into
an already-running loop (by owner or agent) is evidence that the domain skill's own
checkpoint failed to fire, and the disposition is a defect report against that skill
(PDR-140 clause 8 names this for PR loops), never normalised repeat rescue. Worked
instance: 2026-08-31, the owner invoked this skill twice in one day to correct a
spiralling PR review loop — the pokes worked, which is exactly what made the hack
invisible; the cure was making the pr-lifecycle machine's own transitions carry the
checkpoints.

## Worked instance — ten rounds that a live trigger would have stopped at four

PR #570 (MCP-189) ran ten review rounds and twelve cure commits, four of which introduced
new defects. Three of those four sat in security hardening the ticket had never asked for;
one, report-provenance verification, had already been ticketed as sequenced-out and was then
built into the same PR anyway.

The instructive part is not the count. `pr-lifecycle`'s step-back predicate would have
fired around round four — *"4 total settled rounds in the epoch"* — and the two-class
disposition ruling would have homed the adjacent findings from the first round. **Both
existed. Neither ran, because no tally store was ever built**, so nothing counted and
non-convergence had no observable surface.

The shepherd then escalated two questions to the owner: how to dispose of the PR, and
whether the cure-defect pattern signalled a personal reliability problem. Applying this
gate's **level** axis dissolves both — the first was already answered by standing owner word
(*fix / reject / merge-and-ticket, never chased*), and the second was a seat-level question
that had climbed the reliability ladder from observation to identity. Neither was the
owner's to answer.

Read the failure precisely: **not an absent framework, but an unbuilt instrument and an
unasked sizing question.** That is the generator this gate exists to catch, and it is why
the gate runs before the work rather than as a review of it.

## Worked instance — the dependency sweep that became an audit

A dependency-update lane grew, step by defensible step, into a security
engagement: an audit surfaced advisories, advisories invited exposure
questions, exposure questions invited import-graph tracing, deployment
checks and an environment question routed to the owner. The owner's word
(2026-07-25, verbatim in substance): **"this MCP is a means of putting free
educational material in the hands of teachers, not preventing terrible
things — I asked for an update of deps, not an overhaul of settled
architecture."** The threat model is the product's own, and a defensible
discovery is not a mandate to keep digging: "update the deps" ends when the
deps are updated, and anything alarming found outside the ask is stated in
one sentence and routed, never opened as a lane. The same pricing from the
other side, 2026-09-02 ("not important enough to spend a cycle on!"): once a
landing is in reach, a further edit to its records earns a cycle only if it
changes what a successor would DO — a factual cure yes, a pointer or a
heading date no.

## The success test

This gate has paid its way only if it **changed the size of the work, the weight of the
instrument, or the level the decision routes to**. A pass that confirms the current shape
is a real outcome — record it as a justified no-change verdict with its reason, exactly as
[`metacognition`](../metacognition/SKILL-CANONICAL.md) requires.

It has failed if it produced a filled-in table, or if it was cited to reduce rigour. The
falsifier is deliberately sharp: **one use of this gate to justify lower quality means the
non-override clause is too weak, and the gate is withdrawn rather than patched** — a cure
that needs its own cure buys false confidence, which is the failure it was written to
prevent.
