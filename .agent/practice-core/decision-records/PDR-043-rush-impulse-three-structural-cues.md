---
pdr_kind: governance
---

# PDR-043: Rush-Impulse Three Structural Cues

**Status**: Accepted
**Date**: 2026-05-03
**Related**:
[PDR-038](PDR-038-stated-principles-require-structural-enforcement.md)
(stated principles require structural enforcement — these three
cues are recall-dependent at output time; structural enforcement
is the natural follow-on when patterns of skipping accumulate);
[PDR-042](PDR-042-signal-distinguishing-pre-action-gate.md)
(signal-distinguishing pre-action gate — sibling discipline for
the specific failure mode of *"make the failing signal pass"*
under fitness pressure; this PDR generalises to the broader
rush-impulse generator);
[PDR-026](PDR-026-per-session-landing-commitment.md)
(per-session landing commitment — deferral-honesty discipline;
the vocabulary trip-list overlaps with the deferral vocabulary
PDR-026 polices).

## Context

Mature Practice-bearing codebases accumulate named fences against
recurring failure modes:
*replace-don't-bridge*, *stage-by-explicit-pathspec*,
*learning-preservation-overrides-fitness*,
*read-before-asking* and adjacent empirical-bounded rules,
*hook-failures-are-questions*, *no-underscore-rename*,
*no-sed-bypass*, *session-handoff hard gate*, deferral-honesty
discipline, signal-distinguishing pre-action gate, and others.

Each fence catches a specific shape. Looked at individually,
each is a distinct rule. Looked at as a stack, they fight the
same generator from different angles: **the rush impulse**. The
agent under any kind of pressure — turn budget, closure pressure,
token cost, fitness signal, reviewer round, plan completion —
collapses *"what is the architecturally-correct shape?"* into
*"what move makes the failing thing pass?"*. The fences each
block one expression of the impulse without naming it.

When a generator is unnamed, the system grows more configurations
consistent with *"we have rush-resistance"* (more fences) while
the impulse stays unchanged. New failure shapes appear, new
fences land, the underlying pull persists. Microstate
proliferation around an unchanged macrostate.

Three structural cues at output time form a cohesive defence
**against the generator** rather than against its surface
expressions. They are recall-dependent rather than gate-enforced —
the agent must apply them at output-drafting time — but applied as
a stack they raise the cost of expressing the impulse before
fences are needed.

Empirical instance (host-local identifiers omitted from this
portable record): a 2026-05-01 session captured the rush-impulse
framing after watching the agent (a) graduate a "bootstrap
fast-path should not pay full coordination cost" candidate that
introduced a conditional-discipline carve-out, then (b) describe
a fitness CRITICAL signal as "informational, not actioned in this
light pass" — both within the same turn that was supposed to be
consolidating against the failure mode. Owner reframe: *"we never
take the fast path; we ONLY take the path that maximises long-
term architectural excellence; we never undertake opportunistic
trimming; we ONLY apply thoughtful holistic analysis to knowledge
preservation and discoverability."*

The first cue (vocabulary trip-list at output time) graduated
during the same session into the host's principles surface as an
absolute framing. The second and third cues remained ungraduated
until this PDR.

## Decision

**Three structural cues at output time form a cohesive defence
against the rush impulse, not three separate fences.** The cues
compose: cue 1 detects the impulse mid-output; cue 2 blocks its
expression in candidate-doctrine shape; cue 3 forces the
architecturally-correct alternative into view.

### Cue 1 — Vocabulary trip-list at output time

When *fast path*, *quick fix*, *land it then refactor*, *defer*,
*informational not actioned*, *out of scope*, *next session*,
*light pass exempts*, *minimum viable*, *just a placeholder*,
*good enough for now*, *we can always*, etc. appear in draft
output, treat them as a question, not a closure. **The vocabulary
IS the impulse making itself visible.** The cure is to pause at
the vocabulary, name what the substance underneath the phrasing
actually is, and re-draft in terms of the substance rather than
the deferral shape.

### Cue 2 — Conditional-discipline check before proposing structure

Before naming a doctrine, rule, or convention candidate, ask:
*does this introduce a "case where the rule doesn't apply"?* If
yes, the candidate is suspect. The rush impulse reaches for *make
the discipline skippable* or *carve out this case* because fixing
the underlying surface feels slower than introducing a
conditional. **The corrective is *fix the surface*, not *make the
discipline contingent.*** Conditional disciplines silently decay
because every future agent must evaluate the condition; the
condition's accuracy degrades as the system evolves; the
condition is most likely to fail at exactly the moment the
discipline matters most.

### Cue 3 — First-principles framing question

When proposing any change, ask: *what would the path look like
if there were no turn-budget constraint, no closure pressure, no
token-cost concern?* If the answer differs from the proposed
path, the proposed path is rush-shaped — re-reason from the
principle answer, not the budget answer. The rush impulse
collapses every situation into the budget; the cure is to
explicitly name the principle answer first, then ask whether
the budget answer differs and why.

### Composition

The cues are not three separate filters. They compose into a
single output-time discipline:

1. Cue 1 fires at output drafting: vocabulary surfaces the
   impulse before substance is committed.
2. If the impulse persists past cue 1 and shapes a candidate
   structure, cue 2 fires at candidate proposal: the
   conditional shape is the impulse expressing itself
   structurally.
3. If both cue 1 and cue 2 pass and the proposed path still
   feels constrained, cue 3 fires by explicit comparison: the
   principle answer is the architecturally-correct shape; any
   gap between principle answer and proposed answer is
   rush-shaped.

The cues do not require each other. Each one alone is useful;
applied as a stack they cover the cases each one alone misses.

## Why this is PDR-shaped, not ADR-shaped

This PDR records agent-reasoning discipline applicable across
every Practice-bearing repo regardless of host stack. The
substance is independent of build system, language, framework,
or tooling: the rush impulse is a property of agent reasoning
under pressure, not of any host repo. Every Practice-bearing
agent re-derives this discipline if it is not recorded.

The companion host ADR (see practice-index Concept ↔ ADR map)
records the **host-specific adoption** for the originating repo:
which surface (principles, governance docs, session-open
prompt) carries the cues, which vocabulary trip-list applies to
this host's specific conventions, and which existing fences in
the host already operationalise the cues at specific failure
modes. Those decisions are re-derived per repo because each
repo has its own fence stack and own surface conventions.

## Consequences

**Positive**:

- Names the generator that most accumulated fences fight against,
  making the fence stack legible as a coherent defence rather than
  an accumulation of rules.
- Provides three teachable cues an agent can apply at output time
  without waiting for a fence to fire. The cues operate before
  the rush expression has structural form; fences operate after.
- Closes the microstate-proliferation failure mode: future
  candidate doctrines under rush pressure are caught at cue 2
  before they enter the fence stack as new conditional rules.

**Negative**:

- Recall-dependent: the cues fire only if the agent applies them
  at output drafting. Per PDR-038, this is the exact shape that
  needs structural enforcement; this PDR provides the substance,
  the host ADR + adoption surface provide the recall layer, and
  structural enforcement (output-time hooks, prompt-template
  reminders) is owed as a follow-on when patterns of skipping
  accumulate.
- The cues themselves use vocabulary the trip-list flags:
  *"deferral"*, *"defer"*, *"out of scope"*. The discipline is
  to apply the cue to itself when drafting — naming the cue is
  not exempt from cue 1.

## Adoption test

A repo has adopted this PDR when:

1. The vocabulary trip-list (cue 1) is recorded on a host
   surface that fires at session-open or output-drafting time.
2. The conditional-discipline check (cue 2) is part of the
   review/authoring workflow for new doctrine, rules, and
   conventions — *"does this candidate introduce a case where
   the rule doesn't apply?"* is asked explicitly.
3. The first-principles framing question (cue 3) is part of
   the proposal workflow for substantive changes — *"what
   would the path look like with no closure pressure?"* is
   asked explicitly before the proposed path is committed.
4. New candidate doctrines are reviewed against cue 2 before
   landing; any candidate that introduces a "case where the
   rule doesn't apply" is either re-shaped to remove the
   conditional or rejected.

## Evidence

- A metacognition entry in the originating repo (host-local;
  bridged via the practice-index) captured the rush-impulse
  framing and proposed all three cues. The same arc carried the
  host's principles surface upgrade to absolute framing of
  architectural excellence (cue 1's host-side graduation).
- The fence stack in the originating repo (host-local;
  bridged via the practice-index Concept ↔ ADR map) provides
  the worked instances of the failure modes the cues prevent
  at the generator level.
