# Experiment E1 — Brief

**Status**: ready to run, prompts authored.
**Plan**: see [`.agent/plans/agentic-engineering-enhancements/current/n-agent-collaboration-experiments.plan.md`](../../../../../plans/agentic-engineering-enhancements/current/n-agent-collaboration-experiments.plan.md).

## Priority order — absolute

The function of every session running these prompts is to move toward
a provable mergeable condition so that the upstream API change work
can land in main. **Long-term architectural excellence
([`principles.md § Architectural Excellence Over Expediency`](../../../../../directives/principles.md#architectural-excellence-over-expediency))
is the priority** — never compromised for any other goal. The
hypothesis-experiment data should absolutely be gathered and acted on,
but the experiment is a by-product of doing the real work, never a
justification for reshaping it.

## What the experiment is observing

E1 observes how the N-agent collaboration primitives behave during
**real work on ARC A1** (canonical smoke-harness module + RED tests +
vitest.smoke.config.ts + smoke-context.ts) on the
`observability-sentry-otel` thread. The work itself is what the agents
are doing; the experiment is the observation framework for the
primitives that work exercises.

**Primitives under observation** (per
[`hypothesis.md`](../../hypothesis.md) and
[`falsification-criteria.md`](../../falsification-criteria.md)):

- **P1 — Modes, not roles**: do agents fluidly move between
  Orchestrator / Executor / Feedback modes during ARC A1, with
  transitions surfaced via comms event?
- **P3 — Active-claims registry**: does overlap detection function
  advisorily without owner mediation?
- **P5 — Comms log directional context**: do `audience` and
  `in_response_to` route events correctly?
- **P6 — Failure-shaped ceremonies**: do the ceremonies (polling,
  wall-clock authority, verification, etc.) hold under work pressure?
- **P10 — Cheap self-correction**: when a protocol failure occurs
  (and one will), is the recovery routine and reversible?

If a third agent in **Reviewer mode** is available *and* their
participation does not slow the work, that produces full E1 N≥3
observations. If only N=2 (Orchestrator + Executor), the same
primitives are observed at smaller N — still useful evidence, just
narrower.

## What this experiment is NOT

- **Not a justification for reshaping the work.** ARC A1 is what gets
  done; observation is a by-product. If experiment instrumentation
  would compromise the work, drop the instrumentation.
- **Not a single-session graduation event.** Primitives graduate to
  permanent doctrine only after multiple sessions across multiple
  pairings with no falsifying observations. One session's data is
  one data point.
- **Not a research apparatus.** The agents do real work. They
  observe what happens. They capture observations at session-close
  per the structured surprise format.

## Work being done

Read the operational state files at session-open. The active plan
is [`there-is-no-time-hashed-starfish.plan.md`](../../../../../plans/observability/current/there-is-no-time-hashed-starfish.plan.md);
the next safe step is ARC A1; the parallelisable lane is ARC B0
(plan-body corrections to the prior plan body). The two agent
prompts in this directory operationalise that work.

## Capture and analysis plan

**Per-session capture** (at session-close, by each agent
participating):

1. In `.agent/memory/active/napkin.md`, append an entry tagged with
   `[E1]` and the session date, using the structured surprise
   format (expected / observed / why surprising / generator / cure
   shape) for each meaningful observation.
2. For each observation, classify per
   [`falsification-criteria.md`](../../falsification-criteria.md):
   does it falsify, weaken, or strengthen which primitive?
3. Cross-reference any cure that fired (cures (i)–(x) in
   [`pending-graduations.md`](../../../../../memory/operational/pending-graduations.md))
   so the evidence accumulates against the right primitive.
4. If a primitive falsifies, follow the falsification process in
   `falsification-criteria.md § Falsification process`.

**Cross-session analysis** (at `/jc-consolidate-docs`):

1. Aggregate `[E1]`-tagged napkin entries across all sessions that
   have run E1.
2. For each primitive, count strengthening, weakening, and
   falsifying observations.
3. If a primitive has multiple strengthening observations across
   distinct pairings and zero falsifying, propose graduation to
   permanent doctrine (target: `agent-collaboration.md` directive
   for doctrine-shaped, `.agent/rules/` for enforcement-shaped,
   ADR/PDR for decision-shaped).
4. If a primitive has multiple falsifying observations, propose
   replacement or removal in `hypothesis.md` and amend the
   register in `pending-graduations.md`.

**Reflection cadence**:

- Light per-session reflection at session-close (the napkin entry).
- Deeper cross-session reflection at `/jc-consolidate-docs`.
- Subjective-experience reflection (per
  [`.agent/experience/`](../../../../../experience/README.md))
  is optional per-session and recommended after the third
  pairing's session — texture changes that emerge over the
  experiment arc are best captured as they accrue.

## Acceptance criteria

E1 is **complete** when:

- At least three pairings (any combination of platforms / models)
  have run sessions on this thread with E1 capture in the napkin.
- Each primitive under observation has either a graduation
  proposal (multiple strengthening, zero falsifying) or a
  replacement/removal proposal (multiple falsifying).
- The accumulated `[E1]`-tagged napkin entries have been processed
  at `/jc-consolidate-docs` at least once after the third
  pairing's session.

E1 is **not** complete after a single session, regardless of how
clean the observations are.

## Files in this directory

- [`brief.md`](brief.md) — this file.
- [`agent-1-orchestrator.md`](agent-1-orchestrator.md) — opening
  prompt for Agent 1, the orchestrator. Copy-paste as-is to the
  agent at session start.
- [`agent-2-executor.md`](agent-2-executor.md) — opening prompt
  for Agent 2, the executor / feedback. Copy-paste as-is to the
  agent at session start.

If a third agent (Reviewer mode) joins, an `agent-3-reviewer.md`
prompt should be authored before that session opens. The current
two-prompt set is the minimum viable for the next session.
