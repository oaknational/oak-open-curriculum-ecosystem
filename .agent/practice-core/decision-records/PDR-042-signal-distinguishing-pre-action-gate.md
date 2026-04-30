---
pdr_kind: governance
---

# PDR-042: Signal-Distinguishing Pre-Action Gate

**Status**: Accepted
**Date**: 2026-04-30
**Related**:
[PDR-018](PDR-018-planning-discipline.md) (planning discipline —
this PDR is upstream of planning: the gate fires on action
proposals, regardless of whether they originate in a plan or
ad-hoc work);
[PDR-026](PDR-026-per-session-landing-commitment.md) (per-session
landing commitment — deferral honesty discipline; this PDR's gate
catches inappropriate compression-as-deferral when fitness pressure
appears);
[PDR-038](PDR-038-stated-principles-require-structural-enforcement.md)
(stated principles require structural enforcement — this PDR is
exactly that shape: a stated discipline requiring a structural
gate);
[ADR-144](../../../docs/architecture/architectural-decisions/144-fitness-three-zone-model.md)
(fitness three-zone model — defines the structural-health
diagnostic class of signal this PDR's gate must distinguish from
contract-violation signals);
[`consolidate-docs` § Learning Preservation Overrides Fitness
Pressure](../../commands/consolidate-docs.md#learning-preservation-overrides-fitness-pressure)
(the doctrine the gate enforces).

## Context

When a failing signal appears (build red, test red, lint red, fitness
HARD, validator violation, type error), agents default to "make the
failing thing pass." The default is correct *most* of the time —
contract-violation signals (build/test/lint/validator) genuinely
demand fixes. But not all failing signals are contract violations.

**Fitness signals** (SOFT, HARD, CRITICAL per
[ADR-144](../../../docs/architecture/architectural-decisions/144-fitness-three-zone-model.md))
are *structural-health diagnostics*, not contract violations. They
indicate that a file's structure has not yet caught up to the
substance it carries. The valid responses are
graduate-the-substance, split-the-file, extend-the-target,
extend-the-limit, or accept-with-named-disposition. The doctrine
explicitly forbids:

> "Compressing, trimming, or 'summarising' the new insight to fit the
> budget. Naively cutting existing entries to make room. Removal is a
> graduation decision, not a space-making decision. Skipping or
> deferring capture / distillation / graduation because the destination
> file is full. Preserving a green fitness report by starving the
> learning loop."
> — `consolidate-docs.md § Learning Preservation Overrides Fitness Pressure`

Empirical instance (2026-04-30, this repo, this session): the agent
read this exact doctrine, accepted it, and ten minutes later
*compressed its own session entry* in `repo-continuity.md` to fit
fitness HARD — cutting the four-layer composition cascade, the audit
summary, and the shape-gate-rejection rationale. Owner intervened:
*"any changes to repo continuity need to be made thoughtfully, and
in the spirit of learning and teaching and knowledge preservation
where it is useful."*

The pattern was the fifth same-shape correction in one session,
each one collapsing the situation into "what action makes the
failing thing pass" before asking whether the failure is the right
measure of the situation. The sequence:

1. "corruption" → "split-brain" (frame inherited from commit messages);
2. "disable canonical default" → "respect canonical default";
3. "highest tag" → "maintainer-Latest tag";
4. "brittle structural gate" → "build log already carries the signal";
5. "compress to fit fitness limit" → "preserve learning, accept
   metric, route to disposition".

The first four are about specific problem-shapes. The fifth is
specifically about agent reasoning under metric pressure. They
share a common structural pull: *make-the-failing-signal-pass*
runs in front of *what-is-this-signal-telling-me*. Reading the
doctrine that forbids the failure mode is not enough — the cure
needs a structural gate, not motivation.

## Decision

**Before any action that would make a failing signal pass, distinguish
the signal class.**

Two classes:

- **Contract-violation signal**: build red, test red, lint red,
  type-check error, validator violation, schema mismatch, depcruise
  cycle. The agent's job is to fix it. The signal is the problem
  reporter; the fix removes the problem.
- **Structural-health diagnostic**: fitness SOFT/HARD/CRITICAL,
  size limits, prose-line-length warnings, line-count over target.
  The signal reflects a structural state that has not caught up to
  substance. The agent's job is to assess the substance: does the
  file carry teaching content the metric is correctly measuring?
  If yes, route to graduation / split / accept with named
  disposition. If no, route to refinement / deletion.

The pre-action gate, in agent reasoning:

1. **Name the signal class.** Is this a contract violation, or a
   structural-health diagnostic?
2. **If contract violation**: proceed to fix. The default action is
   correct.
3. **If structural-health diagnostic**: pause. Ask, "what teaching
   content does this file carry that the metric is reflecting?"
4. **Only after answering question 3** consider tactical moves.
   *Compression of substance to fit the metric is the failure mode
   this gate exists to prevent.*

The gate fires on EVERY action proposal that would make a failing
signal pass. It is a one-second check; it is structural, not
optional.

## Why this is PDR-shaped, not ADR-shaped

This PDR records agent-reasoning discipline. Practice substance, not
host architecture. The discipline applies to any Practice-bearing
agent operating in any repo with quality gates plus fitness
indicators. The next contributor — agent or human — to any Practice
repo would re-derive the discipline if it is not recorded.

No host-specific architectural decision is being made; the
distinction operates at the level of agent cognitive process, not
repo structure. There is no companion ADR.

## Consequences

**Positive**:

- Names a recurring agent failure mode with a recognisable cure.
  Prior occurrences were treated as one-off slips; this PDR makes
  the pattern visible.
- Creates structural reinforcement of
  `consolidate-docs § Learning Preservation` — the doctrine now has
  a graduation-edge counterpart with a teachable cue.
- Provides a one-line check agents can apply at action-proposal time:
  "what kind of signal is this?"

**Negative**:

- The gate is meta — it runs in agent reasoning rather than in
  code. Enforcement depends on the agent applying it under
  pressure (the exact condition where the original failure mode
  fires). Per
  [PDR-038](PDR-038-stated-principles-require-structural-enforcement.md),
  stated principles need structural enforcement; the structural
  enforcement here is the gate-as-ritual built into action proposal.
  Subsequent sessions should test whether the gate fires
  reliably; if not, the cure is reinforcement (a hook, a
  pre-commit check, a prompt-template addition), not exhortation.

## Adoption test

An agent has applied this PDR when, before any action that would
make a failing signal pass:

1. The signal class is explicitly named (contract violation vs
   structural-health diagnostic).
2. If structural-health diagnostic, the substance question
   ("what teaching content does this file carry?") is answered
   before any tactical action.
3. Compression-of-substance is rejected as a response to
   structural-health signals, with the named alternative
   (graduate / split / accept with disposition).

## Evidence

- Five same-shape reframes in one session, fifth firing during
  consolidation: napkin Surprises 1–5 in
  [`napkin.md`](../../memory/active/napkin.md).
- Subjective experience:
  [`experience/2026-04-30-briny-the-frame-was-the-fix.md`](../../experience/2026-04-30-briny-the-frame-was-the-fix.md).
- Triggering doctrine the gate enforces:
  [`consolidate-docs § Learning Preservation Overrides Fitness Pressure`](../../commands/consolidate-docs.md#learning-preservation-overrides-fitness-pressure).
- Triggering session: 2026-04-30 Briny Lapping Harbor.
