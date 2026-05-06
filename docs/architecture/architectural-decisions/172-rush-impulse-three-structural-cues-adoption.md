# ADR-172: Rush-Impulse Three Structural Cues Adoption

**Status**: Accepted
**Date**: 2026-05-03
**Related**:
[PDR-043](../../../.agent/practice-core/decision-records/PDR-043-rush-impulse-three-structural-cues.md) —
the general Practice-governance principle this ADR adopts. PDR-043
travels with the Core; this ADR records this repo's host-specific
decision to land all three cues in the principles surface as a
cohesive defence;
[`principles.md § Architectural Excellence Over Expediency`](../../../.agent/directives/principles.md) —
the host surface that already carries cue 1 (vocabulary trip-list)
in absolute framing; this ADR records the extension to cues 2
and 3;
[PDR-026](../../../.agent/practice-core/decision-records/PDR-026-per-session-landing-commitment.md) —
deferral-honesty discipline; the vocabulary trip-list overlaps with
deferral vocabulary PDR-026 polices;
[PDR-038](../../../.agent/practice-core/decision-records/PDR-038-stated-principles-require-structural-enforcement.md) —
stated principles require structural enforcement; the cues are
recall-dependent and PDR-038 reasoning applies to follow-on
enforcement;
[PDR-042](../../../.agent/practice-core/decision-records/PDR-042-signal-distinguishing-pre-action-gate.md) —
sibling discipline for the specific failure mode of "make the
failing signal pass" under fitness pressure.

## Context

This repo's `principles.md § Architectural Excellence Over
Expediency` was upgraded to absolute framing on 2026-05-02,
naming cheap-fast as categorically excluded and introducing the
vocabulary trip-list at output time:

> Vocabulary that signals the impulse: _fast path_, _quick fix_,
> _cheap cure_, _good enough for now_, _minimum viable_, _just a
> placeholder_, _for later_, _next session_, _out of scope_,
> _defer_, _informational not actioned_, _light pass exempts_,
> _bootstrap fast-path_, _land it then refactor_, _we can always_.

This is cue 1 of PDR-043's three-cue stack. Cues 2 and 3 were not
yet codified in this repo:

- **Cue 2 — Conditional-discipline check before proposing
  structure**: surfaced in the 2026-05-01 metacognition entry
  (Deep Navigating Stern) when a "bootstrap fast-path should not
  pay full coordination cost" candidate was withdrawn under the
  reasoning that conditional-discipline shapes are themselves the
  rush impulse expressing itself structurally.
- **Cue 3 — First-principles framing question**: surfaced in the
  same metacognition entry as the test of last resort — _"what
  would the path look like if there were no turn-budget constraint,
  no closure pressure, no token-cost concern?"_ If the answer
  differs from the proposed path, the proposed path is rush-shaped.

The absolute framing of architectural excellence carries the
generative principle but does not yet name the three cues as a
cohesive output-time discipline. PDR-043 names them; this ADR
records the host-side adoption.

## Decision

**Land all three cues in
`.agent/directives/principles.md § Architectural Excellence Over
Expediency` as a cohesive stack alongside the existing vocabulary
trip-list paragraph (which becomes cue 1).** A new paragraph
after the existing vocabulary trip-list paragraph states:

> Three structural cues at output time form a cohesive defence
> against the rush impulse, not three separate fences:
>
> 1. **Vocabulary trip-list** (above) — when _fast path_, _quick
>    fix_, _land it then refactor_, _defer_, etc. appear in draft
>    output, treat them as a question, not a closure.
> 2. **Conditional-discipline check before proposing structure** —
>    before naming a doctrine, rule, or convention candidate, ask:
>    _does this introduce a "case where the rule doesn't apply"?_
>    If yes, the candidate is suspect. The rush impulse reaches
>    for _make the discipline skippable_ or _carve out this case_
>    because fixing the underlying surface feels slower than
>    introducing a conditional. The corrective is _fix the surface_,
>    not _make the discipline contingent._
> 3. **First-principles framing question** — when proposing any
>    change, ask: _what would the path look like if there were no
>    turn-budget constraint, no closure pressure, no token-cost
>    concern?_ If the answer differs from the proposed path, the
>    proposed path is rush-shaped — re-reason from the principle
>    answer, not the budget answer.
>
> The cues compose: cue 1 detects the impulse mid-output; cue 2
> blocks its expression in candidate-doctrine shape; cue 3 forces
> the architecturally-correct alternative into view. See ADR-172
> for the host architectural decision and PDR-043 for the
> portable form.

## Composition with the existing fence stack

Many of this repo's existing rules and disciplines exist to catch
specific expressions of the rush impulse:

- `replace-don't-bridge` — catches the impulse in compatibility-
  layer shape.
- `never-disable-checks` — catches the impulse in
  gate-off-fix-gate-on shape.
- `no-warning-toleration` — catches the impulse in
  acknowledged-and-deferred shape.
- `dont-break-build-without-fix-plan` — catches the impulse in
  break-now-fix-later shape.
- `read-before-asking` and adjacent empirical-bounded rules —
  catch the impulse in option-shaped output when action-shaped or
  read-shaped is what the work calls for.
- PDR-026 deferral-honesty — catches the impulse in deferral-
  vocabulary shape.
- PDR-042 signal-distinguishing pre-action gate — catches the
  impulse in fitness-signal-compression shape.

The three cues operate **upstream** of the fence stack: at output
drafting, before substance is committed. The fences are the
backstop when the cues fail. PDR-043 makes the fence stack
legible as a coherent defence rather than an accumulation of
independent rules; this ADR makes that legibility load-bearing in
this repo's principle surface.

## Why this is ADR-shaped, not (only) PDR-shaped

[PDR-043](../../../.agent/practice-core/decision-records/PDR-043-rush-impulse-three-structural-cues.md)
is the general principle: the rush impulse is the entropy
generator under most named fences; three cues compose into a
cohesive output-time defence. The substance applies to every
Practice-bearing repo regardless of host stack.

This ADR records this repo's _adoption_ of the principle — which
surface carries the cues (`principles.md § Architectural
Excellence Over Expediency`), how the cues compose with this
repo's specific fence stack, and which existing host fences
operationalise each cue at specific failure modes. These are
re-derived per repo because each repo has its own fence stack
and surface conventions.

If the only artefact were PDR-043, the next contributor to this
repo would not see _that this repo's principles surface carries
the three cues as a cohesive stack_, _how the cues compose with
the fence stack_, or _which existing fences operationalise each
cue_. The ADR closes that gap. PDR-043 + ADR-172 are companions,
not alternatives.

## Consequences

**Positive**:

- The three cues are loaded passively at session-open via
  principles.md, so the discipline fires without ceremony.
- Future candidate doctrines, rules, and conventions are
  reviewed against cue 2 before landing: any candidate that
  introduces a "case where the rule doesn't apply" is either
  re-shaped to remove the conditional or rejected.
- Output drafting carries the explicit first-principles question
  (cue 3); the proposed path is compared against the
  no-pressure principle answer before commit.
- The fence stack becomes legible as a coherent defence, not an
  accumulation. New fences can be evaluated against whether they
  add to the stack or duplicate existing coverage.

**Negative**:

- Recall-dependent: the cues fire only if the agent applies them
  at output drafting. Per PDR-038, this is exactly the shape that
  needs structural enforcement; the cues at the principles
  surface are the recall layer, and structural enforcement
  (output-time hooks, prompt-template reminders, candidate-
  doctrine review templates) is owed as a follow-on when patterns
  of skipping accumulate.
- The cues themselves use vocabulary that cue 1 flags
  (_"deferral"_, _"defer"_, _"out of scope"_). The discipline is
  to apply the cue to itself when drafting; naming the cue is
  not exempt from cue 1.

## Future work

Per PDR-038, the cues' recall-dependent nature warrants
structural-enforcement follow-on when patterns of skipping
accumulate. Candidate enforcement mechanisms:

- Prompt-template addition that fires cue 1 against draft output
  before commit.
- Plan-authoring template field requiring an explicit cue-3
  framing for substantive changes.
- Reviewer dispatch convention requiring cue 2 to fire on every
  candidate doctrine/rule/convention review.

None of these are owner-authorised yet; promotion is gated on
accumulated evidence of cue-skipping under pressure.

## References

- PDR-043 (memotype): rush-impulse-three-structural-cues.
- `.agent/directives/principles.md § Architectural Excellence
Over Expediency` — the host surface this ADR extends.
- Existing fence stack:
  `.agent/rules/never-disable-checks.md`,
  `.agent/rules/no-warning-toleration.md`,
  `.agent/rules/replace-dont-bridge.md`,
  `.agent/rules/dont-break-build-without-fix-plan.md`,
  PDR-026, PDR-042.
- 2026-05-01 metacognition entry (host-local; recorded in the
  archived napkin
  `.agent/memory/active/archive/napkin-2026-05-03.md` and
  surfaced through the pending-graduations register) where the
  three cues were first articulated.
