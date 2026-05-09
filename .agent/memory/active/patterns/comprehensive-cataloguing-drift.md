---
name: Comprehensive-Cataloguing Drift
polarity: anti-pattern
use_this_when: Authoring a spine plan, dispatching a reviewer pass, extending a rule, or otherwise scoping any artefact whose substance crosses a "what's in vs what's adjacent" boundary
category: process
proven_in: |
  .agent/plans/connecting-oak-resources/knowledge-graph-integration/current/
  graph-mvp-arc.plan.md (spine instance, 2026-05-07);
  .agent/plans/connecting-oak-resources/knowledge-graph-integration/current/
  slice-3a + slice-3b plans (reviewer-pass instance, 2026-05-07);
  .agent/rules/no-moving-targets-in-permanent-docs.md
  (rule-extension instance, 2026-05-06)
proven_date: 2026-05-09
related_findings: historical-napkin-synthesis-2026-05-09 §F2
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Broadening an artefact's scope to 'be comprehensive' instead of asking what is the proportional shape for THIS landing's gating decision; produces spines that catalogue adjacent work, reviewer passes that re-litigate closed decisions, and rule extensions that self-violate"
  stable: true
---

> **POLARITY: ANTI-PATTERN.** This is a failure mode to avoid:
> when the impulse is to broaden an artefact's scope to "be
> comprehensive" or "cover everything related", the proportionality
> question is the substrate. The cure is asking, in the moment,
> *"what is the proportional shape for THIS landing's specific
> gating decision?"* before broadening.

## Principle

An artefact has a specific gating decision it is created to make:
a spine plan gates an MVP arc's commitment; a reviewer pass gates
a landing's quality; a rule extension gates a category of failure.
Each gating decision implies a proportional substance scope. Substance
*adjacent* to the gating decision belongs in *adjacent* artefacts —
companion plans, follow-up reviewer passes, sibling rules — not
absorbed into the artefact under authoring.

The drift mode is to broaden procedurally — *catalogue every nearby
thing for completeness* — without asking whether the broader scope
is proportional to the landing decision the artefact actually gates.
The result is comprehensive-on-the-surface, mis-shaped underneath.

## Three instances proving the same shape

### Instance 1 — Spine drift (Windward 2026-05-07)

Top-level MVP-arc spine plan grew an unsequenced `mvp_arc_status:
deferred` annotation on adjacent NC SKOS work (which was *not* in
the MVP commitment). Owner correction: *"we never mark anything as
deferred, we sequence things properly or we admit we are not going
to do them"*. A subsequent re-frame as `## Out-of-MVP-Arc Items`
section in the spine was again over-scoped — owner correction:
*"the NC work is explicitly NOT part of the MVP, you have clearly
become confused"*.

The proportionality question: a spine gates *what's in the MVP
commitment*. NC SKOS was adjacent, not in. Spine substance was
broadened past its gating decision.

### Instance 2 — Reviewer pass drift (Breezy 2026-05-07)

Planning closure for the graph-MVP arc was framed as a 5-reviewer
parallel pass over 4 sessions ("comprehensive review"). Owner directed
*"Reduce the reviewers to the code reviewer and the assumption
reviewer, and finish the planning this session. … Have a specialist
do the topology review in parallel."* The 2 + 1 set hit the same
surface (composition discipline, assumption audit, topology coupling)
as the 5-reviewer plan, without the redundancy. All five planning
phases landed cleanly in one session.

The proportionality question: a reviewer pass gates *the BLOCKERs
that need surfacing for THIS landing decision*. Five reviewers were
proportional to a 4-session arc, not a single-session landing
commitment.

### Instance 3 — Rule-extension self-violation (Hidden 2026-05-06)

Extending `no-moving-targets-in-permanent-docs.md` with a new
"Citation Directionality" clause did not first scan the rule body
itself. The rule's own `## Source Landing` footer cited a source
plan — the exact prohibition the new clause forbids. Self-violation
in the same change set. Both reviewers (docs-adr + code) flagged it
as P1.

The proportionality question: a prohibition extension gates *a
shape of violation*. The most likely place that shape already lives
is the rule body itself; the extension's scope must include the
rule body before it includes the wider repo.

## Why this drift is hard to catch internally

Comprehensive-cataloguing feels like discipline. It looks like
"thoroughness". It produces artefacts that are dense, list-heavy,
and easy to defend at review time as "we covered everything".

The diagnostic that distinguishes drift from genuine completeness
is the proportionality question, asked *before* broadening. If the
question has a clean answer, broaden. If the answer is *"I think we
should also catalogue X because it's related"*, that is the drift
shape — X belongs in an adjacent artefact whose own gating decision
it serves.

## The cure

Three structural moves before any broadening:

1. **Name the gating decision.** What specific landing or quality
   judgement does this artefact gate? Write it as a sentence.
2. **Ask the proportionality question.** Is the proposed broader
   scope proportional to that gating decision? Or is it adjacent
   substance looking for a home?
3. **Route adjacent substance to adjacent artefacts.** A spine
   adjacent to NC SKOS work routes NC promotion-triggers to the
   NC plan. A reviewer pass adjacent to a future arc routes future
   reviewers to the future arc's pass. A rule extension adjacent
   to neighbouring rules routes their substance to those rules.

The cure is *not* to suppress completeness. It is to direct
completeness through the right artefact at the right gating
boundary, rather than absorbing all adjacent substance into one
artefact.

## When NOT this anti-pattern

Genuine cross-cutting concerns *do* belong in a single artefact —
ADR-125 covers all canonical-first artefacts intentionally, because
the decision-shape is the same across rules, skills, sub-agents,
and commands. The diagnostic for legitimate broadening: the gating
decision is genuinely *one* decision applied uniformly. If the
decisions are subtly different per item ("do we want X in the MVP?"
vs "do we want Y in the MVP?"), they are adjacent decisions in
adjacent artefacts.

## Cross-references

- [`mechanical-sequence-is-activity-bias-diagnostic.md`](mechanical-sequence-is-activity-bias-diagnostic.md)
  — sibling pathology under continuing-procedurally rather than
  broadening-procedurally; both share the same proportionality-question
  cure.
- `consolidation-output-shape-pattern-vs-report.md` — names the
  output-shape side of the same proportionality discipline.
- Pending owner-gated synthesis PDR (`pdr_kind: pattern`) consolidating
  this and the mechanical-sequence anti-pattern as
  *the proportionality question is the substrate* — see
  `historical-napkin-synthesis-2026-05-09.md` §F12.
