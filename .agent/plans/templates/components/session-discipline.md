# Session Discipline (Multi-Session Plans)

**Use when**: a plan's scope spans multiple sessions — whether
because of owner-gated approval points, context budget, or bounded
landing targets per
[PDR-026](../../../practice-core/decision-records/PDR-026-per-session-landing-commitment.md).

**Origin**: extracted 2026-04-21 from the *Staged Doctrine
Consolidation and Graduation* plan's authoring reflection. The
four disciplines below generalise from that plan; each converts a
passive guideline into an environmental tripwire per the
`passive-guidance-loses-to-artefact-gravity` pattern.

## 1. Session count is a template, not a contract

The session count recorded at plan authoring is a best estimate
from the scoping or dry-run pass. Sessions may **compress, split,
or re-order** based on what happens at each close. The
landing-target orientation is load-bearing; the count is not.

- If a session's work finishes early, close cleanly and begin the
  next — do not stretch to fill the count.
- If a session's work will not close in one sitting, split at the
  nearest landing target and name the split in the thread record
  so the next session can pick up cold.
- If discovery reveals two sessions can merge, merge them and
  record the compression.

Plan authors should write the session count as a projection, not
a commitment. Plan readers should not treat the count as binding.

## 2. Mid-arc checkpoints

After every session that lands doctrine or other load-bearing
output, include a checkpoint step:

> *"Checkpoint — review remaining sessions against what just
> landed. Does the rest of the arc still make sense? Owner decides
> whether to proceed, adjust scope, or pause."*

Mid-arc checkpoints are cheap insurance against the plan's own
inherited framing. A plan authored at moment T may not fit
reality at moment T+3 sessions, especially when each landing
session introduces new doctrine or new patterns.

Typical placement: at the close of any session whose deliverable
changes the doctrine surface of the repo (PDR landings, pattern
extractions, rule installations). Less critical for sessions that
are purely mechanical (napkin rotation, file moves).

## 3. Context-budget thresholds per session

Name the trigger that ends a session, not just the work. Default
thresholds:

- **Wall-clock**: a session exceeding ~30 minutes of continuous
  agent work stops at the next natural boundary.
- **Context window**: when approaching three-quarters of available
  context, stop at the next natural boundary and apply handoff
  discipline.

These are tripwires per the Heath-brothers tripwire concept: a
pre-committed rule converting a continuous decision (*"am I
drifting?"*) into a discrete trigger event (*"this specific
condition just fired, therefore stop and re-evaluate"*). Tripwires
beat vigilance because they offload the watchfulness to the
environment. See the
`passive-guidance-loses-to-artefact-gravity` pattern in
`.agent/memory/active/patterns/` for the underlying reasoning.

Vague context budget is passive guidance; an explicit threshold
is a tripwire. Plans that want their context budget to actually
fire should name numbers, not just the concept.

## 4. Metacognition at session open

Each session opens with a named first-principles check in
addition to the foundation-document commitment (principles,
testing-strategy, schema-first-execution):

> *"What did I inherit here, and has anyone ratified it from
> first principles? Does its shape still fit?"*

Invoke `/jc-metacognition` against the current session's plan
context if the answer is uncertain. See
[`.agent/directives/metacognition.md`](../../../directives/metacognition.md).

This step is most valuable for the first two or three sessions of
an arc, where inherited-framing risk is highest. Later sessions
can rely on the accumulated ratifications if no new doctrine has
landed since the last metacognition pass.

## Usage in a plan

Reference this component in the plan body:

> **Session discipline**: see
> [`../../templates/components/session-discipline.md`](../../templates/components/session-discipline.md).
> The four disciplines (template-not-contract count, mid-arc
> checkpoints, context-budget thresholds, metacognition at open)
> apply to every session in this plan.

Plan-specific amendments (e.g. named context-budget thresholds
different from the defaults, or specific checkpoint placements)
can live alongside the reference. The component sets the baseline;
the plan may tighten or loosen with rationale.
