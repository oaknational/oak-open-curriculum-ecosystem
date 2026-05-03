# Experiments — Index

**Companion to**: [`../hypothesis.md`](../hypothesis.md) and
[`../falsification-criteria.md`](../falsification-criteria.md).

**Decision-complete plan**:
[`.agent/plans/agentic-engineering-enhancements/current/n-agent-collaboration-experiments.plan.md`](../../../../plans/agentic-engineering-enhancements/current/n-agent-collaboration-experiments.plan.md).

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
| E1 | P1 modes, P3 claims, P5 audience, P6 ceremonies, P10 self-correction | **active** — prompts authored, ready to run | [`E1/`](E1/) |
| E2 | P5 directional context, cure (vi) wall-clock authority | queued — adversarial probe; activate when a session is specifically scoped to test it | not yet authored |
| E3 | P5, P6, P9 at scale | queued — synthetic, offline; activate when a researcher has time to author the synthetic corpus | not yet authored |
| E4 | P10 self-correction, P7 bootstrap fast-path | queued — opportunistic; observe when a real session-budget cut-off occurs mid-task; do not engineer one | not yet authored |
| E5 | open question — owner-proxy mode | queued — requires owner-stated unavailability for routine decision; not yet scheduled | not yet authored |

## Selection criteria

Pick the experiment whose observation windows fall naturally within
planned work. Do not pick an experiment that requires the work to
detour. The priority order above is enforced by this rule:
selection that compromises the work shape is selection of the
wrong experiment.

E1 is the natural experiment for any session on the
observability-sentry-otel thread for the foreseeable future, because
the primitives it observes (modes, claims, audience routing,
ceremonies, self-correction) fall out of any agent-pair coordination
during ARC A1 + ARC B0 work. E2-E5 are opportunistic.

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
