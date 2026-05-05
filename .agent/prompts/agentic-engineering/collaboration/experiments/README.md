# Experiments — Index

**Companion to**: [`../hypothesis.md`](../hypothesis.md) and
[`../falsification-criteria.md`](../falsification-criteria.md).

**Decision-complete plan**:
[`.agent/plans/agent-tooling/current/n-agent-collaboration-experiments.plan.md`](../../../../plans/agent-tooling/current/n-agent-collaboration-experiments.plan.md).

## Priority order — absolute

The function of every session running these experiments is to move
toward a provable mergeable condition so that the upstream API
change work can land in main. **Long-term architectural excellence
is the priority** — never compromised for any other goal.
Experiments are observed *during* real work, never run as standalone
exercises. If at any point experiment instrumentation would
compromise the work, drop the instrumentation and ship the work;
capture observations only insofar as they fall out naturally.

## Experiment register

Each experiment exercises one or more primitives from
[`../hypothesis.md`](../hypothesis.md). The order below is by
**activation status**, not by ID — E1 is the only experiment with
operational prompts; the others are queued and become operational
only when the work shape produces the conditions they need to
observe.

| ID | Targets | Status | Directory |
|---|---|---|---|
| E1 | P1 modes, P3 claims, P5 audience, P6 ceremonies, P10 self-correction | **CLOSED 2026-05-03** — see [`E1/closure.md`](E1/closure.md) | [`E1/`](E1/) |
| E2 | P5 directional context, cure (vi) wall-clock authority | queued — adversarial probe; activate when a session is specifically scoped to test it | not yet authored |
| E3 | P5, P6, P9 at scale | queued — synthetic, offline; activate when a researcher has time to author the synthetic corpus | not yet authored |
| E4 | P10 self-correction, P7 bootstrap fast-path | queued — opportunistic; observe when a real session-budget cut-off occurs mid-task; do not engineer one | not yet authored |
| E5 | open question — owner-proxy mode | queued — requires owner-stated unavailability for routine decision; not yet scheduled | not yet authored |
| E6 | **NEW** — first-question application at arc and plan scope; principle-vs-plan failure mode; goal-alignment under elaboration pressure | **next** — see [hypothesis below](#e6---next-hypothesis-arc-level-first-question-application) | not yet authored |

## E1 closure summary

E1 ran across multiple agent-pairings on the
`observability-sentry-otel` thread (Pelagic+Misty, Woodland+Prismatic,
Salty+Tidal). Closed 2026-05-03 by owner direction. Detailed write-up
at [`E1/closure.md`](E1/closure.md). Headline result: **the primitives
work; coordination is not the bottleneck. The bottleneck is principle-
application at arc scope, which is what E6 will probe.**

## Selection criteria

Pick the experiment whose observation windows fall naturally within
planned work. Do not pick an experiment that requires the work to
detour. The priority order above is enforced by this rule:
selection that compromises the work shape is selection of the
wrong experiment.

E6 is the natural next experiment because the lesson E1 surfaced —
plan-following can mask rush-impulse at arc scope even with sound
coordination — applies to every multi-session arc. E2-E5 remain
opportunistic.

## E6 — next hypothesis: arc-level first-question application

**Hypothesis**: in multi-session work arcs, principles.md §First
Question (*could it be simpler without compromising quality?*) needs
to be re-applied at every elaboration boundary — not only at
task scope. Without that re-application, plan-following accretes
instrument-vs-goal confusion: the work becomes internally coherent
but goal-misaligned, and the misalignment is invisible to the agents
participating because it lives at the arc level, above the cycle and
plan they are executing.

**Falsifiable prediction**: if every plan-promotion-to-current AND
every cycle-completion event includes an explicit re-application of
the first-question to the *whole arc* (not just the next task), the
incidence of "session-spiral" episodes (3+ days of well-formed work
with no goal-aligned product progress) will fall to zero across the
next quarter of multi-session arcs. If session-spirals continue to
occur despite the re-application, the hypothesis is falsified — the
mechanism is structural, not procedural, and a different cure is
needed.

**Observation surface**: every multi-session arc on any thread
becomes an E6 datapoint. No special prompts; the discipline lives
inside `start-right-quick` and `jc-plan` (both already touch the
first-question at task scope; E6 extends them to arc scope).

**Activation gate**: prompts and discipline updates are part of E6
authoring — to be done in a follow-on session. Until then, agents
running real work apply the first-question at arc scope manually,
referring to napkin entries on plan-following-vs-principle-following
and the rollback-is-amnesia learning.

## Per-experiment artefacts

Each active experiment has its own subdirectory with:

- `brief.md` — what is being observed, work context, capture and
  analysis plan, acceptance criteria.
- `agent-N-<mode>.md` — opening prompts, one per agent, ready to
  copy-paste at session start.

Per-session observation capture goes to
[`.agent/memory/active/napkin.md`](../../../../memory/active/napkin.md)
tagged with the experiment ID (e.g. `[E1]`) per the structured
surprise format. Cross-session analysis happens at
`/jc-consolidate-docs`.

## When to author an experiment's prompts

Author a new experiment's prompts when:

1. The work scheduled for the next session naturally produces the
   observation conditions the experiment targets, AND
2. The agents who would run it are available, AND
3. The owner has signalled the experiment should be run (e.g., E5
   needs explicit owner direction; E2 needs deliberate scoping).

Do not author prompts speculatively. The prompts are operational
artefacts; they get written when the next session is imminent.

## Falsification process

If an experiment's observations falsify a primitive, follow
[`../falsification-criteria.md § Falsification process`](../falsification-criteria.md#falsification-process).
The hypothesis is amended, the primitive is replaced or removed,
and the experiments may need to be re-scoped to target the new
primitive.

## Graduation process

If an experiment's observations strengthen a primitive across
multiple sessions and pairings with no falsifying observations,
the primitive is a graduation candidate. Route via
`/jc-consolidate-docs § graduation scan`. Destinations:

- Doctrine-shaped → `.agent/directives/agent-collaboration.md`.
- Enforcement-shaped → a rule under `.agent/rules/`.
- Decision-shaped with rationale worth preserving → ADR or PDR.
