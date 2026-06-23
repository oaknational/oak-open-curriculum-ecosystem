---
name: "Skills Eval Harness"
overview: "Adopt the Agent Skills eval-driven iteration model — trigger evals (does the description fire for the right prompts and not near-misses) and quality evals (with-skill vs no-skill baselines) — for model-activated owned skills, following the external oak-skills repo's per-skill evals/ pattern."
status: future
type: agent-tooling
last_updated: 2026-06-14
isProject: false
---

# Skills Eval Harness

**Status**: FUTURE strategic brief. Not executable until promoted to `current/`.
**Source**: skills audit 2026-06-14 (this session) against the Agent Skills
guidance on
[optimizing descriptions](https://agentskills.io/skill-creation/optimizing-descriptions)
and [evaluating skill output quality](https://agentskills.io/skill-creation/evaluating-skills),
cross-referenced with the external
[`oak-skills`](https://github.com/oaknational/oak-skills) repo, which ships a
per-skill `evals/evals.json` with both trigger and quality evals.

## Problem And Intent

No `.agent/skills/` skill has any eval. We have no objective signal for two
questions the Agent Skills guidance treats as first-class:

1. **Triggering** — does a skill's `description` fire on the prompts it should,
   and stay quiet on near-misses? The audit flagged thin descriptions on
   `gates`, `plan`, and `metacognition` (no "Use when…", no trigger keywords),
   but with no eval set the claim that they trigger correctly is unverified.
2. **Output quality** — does activating a skill produce a better result than not
   activating it, and at what token cost?

`oak-skills` already runs both: `trigger_evals` (a judge routes each query against
the full installed skill list) and `quality_evals` (assertions graded against a
with-skill run versus a no-skill baseline), with first-pass results recorded in
each `evals.json`. This brief brings that discipline to the monorepo's owned
skills.

## End Goal

Model-activated owned skills carry a regression eval set; a contributor can run it
to confirm a skill triggers on the right prompts and improves output over baseline,
and can re-run after editing a skill or changing the base model.

## Mechanism

The Agent Skills eval model is the mechanism. Trigger evals turn description
quality into a measurable trigger rate (run each labelled query N times, compare
to a threshold, split train/validation to avoid overfitting). Quality evals turn
"is the skill worth its tokens" into a graded with-skill-vs-baseline delta
(assertions + human review + a token/time cost comparison). Both produce a
feedback loop that replaces opinion about a description or a body with evidence.

## Means

- Decide the eval substrate: reuse/port the `oak-skills` `evals.json` shape and
  runner, or build a thin monorepo harness over the existing `agent-tools` test
  conventions. (Build-vs-buy evaluated at promotion.)
- Pilot on the audit-flagged weak-description skills (`gates`, `plan`,
  `metacognition`) with trigger evals first — the smallest set that proves the
  loop and settles the weak-description question.
- Extend to quality evals where a skill produces an inspectable artefact (most
  monorepo skills are workflow-orchestration, so trigger evals carry more of the
  value than for `oak-skills`' output-producing skills — scope quality evals to
  where they pay).
- Record results per skill (trigger rate, with/without-skill delta) as the
  regression baseline.

## Domain Boundaries And Non-Goals

- **In scope**: trigger + quality evals for model-activated owned skills; the
  eval substrate decision; a pilot on the weak-description skills.
- **Non-goals**: evals for purely user-invoked skills where auto-trigger does not
  apply (low value); the oversized-core decomposition (separate brief
  [`skills-oversized-core-decomposition.plan.md`](skills-oversized-core-decomposition.plan.md));
  the PDR-051 reconciliation (friction F-37); rewriting descriptions before the
  eval loop exists to measure the change.

## Dependencies And Sequencing

- **Blocking**: none. The harness can be built against the skills as they are.
- **Beneficial**: the oversized-core decomposition — re-running evals before and
  after a decomposition would prove no behaviour regressed. Minimum shippable
  shape without it: stand up the harness and the trigger-eval pilot independently.

## Strategic Acceptance Criteria And Success Signals

- A runnable eval set exists for at least the three pilot skills, with recorded
  trigger rates.
- The weak-description question is settled by evidence: either the descriptions
  trigger correctly (no change needed) or the failing queries name the fix.
- The harness is re-runnable after a skill edit or base-model change, and its
  output is a clear pass/fail + delta a contributor can act on.

## Risks And Unknowns

- **Process skills resist quality evals** — orchestration skills have no single
  inspectable artefact. Mitigation: weight trigger evals; scope quality evals to
  artefact-producing skills only.
- **Eval flakiness** — model nondeterminism inflates variance. Mitigation: run
  each query N times and threshold on rate, per the Agent Skills guidance.
- **Substrate duplication** — building a monorepo harness when `oak-skills`
  already has one. Mitigation: the build-vs-buy step at promotion evaluates
  porting the `oak-skills` runner first.

## Promotion Trigger

Promote to `current/` on owner prioritisation of skill-quality measurement, OR
when a skill's mis-triggering causes observed friction, OR alongside promotion of
the oversized-core decomposition (to provide its before/after regression proof).

## Execution Note

Execution decisions (eval substrate, exact pilot scope, assertion design, runner
shape) finalise only at promotion to `current/`. This brief names intent and
constraints, not an execution commitment.
