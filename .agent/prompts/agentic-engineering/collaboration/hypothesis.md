# Hypothesis: N-Agent Collaboration on a Shared-State Substrate

**Status**: First pass. Coherent enough to test; not yet validated. Evidence
base: a single 2-agent session (Pelagic Washing Anchor ↔ Misty Ebbing Pier,
2026-05-03), captured in
[`first-attempts.md`](first-attempts.md) and the two reflection files at
`.agent/experience/2026-05-03-pelagic-two-way-agent-communication-reflection.md`
and `.agent/experience/2026-05-03-misty-two-agent-comms-reflection.md`.

**Stance**: Treat as hypothesis to test, not design to ship. Hypotheses get
falsification criteria and experiments; designs get specifications and
defenders. The distinction matters because if we ship this as a design, we
will defend it instead of falsifying it. Validated primitives graduate to
ADRs / PDRs / rules; falsified primitives are replaced or removed; the
hypothesis evolves through cycles of testing.

## Priority order — absolute

The function of every session on the active threads is to move toward a
provable mergeable condition so that the upstream API change work can land
in main. **Long-term architectural excellence (per
[`principles.md § Architectural Excellence Over Expediency`](../../../directives/principles.md#architectural-excellence-over-expediency))
is the priority** — never compromised for any other goal. The experiment
data described in this directory should absolutely be gathered and acted
on, and the protocol primitives below are validated by exercising them
during real work; but **the experiment is a by-product, never a
justification**. If at any point experiment instrumentation would
compromise the work, drop the instrumentation and ship the work; capture
observations only insofar as they fall out naturally. The hypothesis
exists to make the substrate better at supporting the work; the work is
never reshaped to suit the hypothesis.

Concretely, on the observability-sentry-otel thread the work is the
ARC A → ARC B → ARC C sequence in
[`there-is-no-time-hashed-starfish.plan.md`](../../../plans/observability/current/there-is-no-time-hashed-starfish.plan.md),
ending in a merge to main. Every session on the thread serves that
sequence first.

## Core claim

*N agents can coordinate on a shared-state substrate without a central
scheduler, given a small bundle of primitives derived empirically from
failure modes.*

The substrate is the existing Practice machinery: file-system shared state
under `.agent/`, JSON registries with transaction helpers, append-only
comms-event files, and platform-agnostic rule + skill + command surfaces.
No new infrastructure is hypothesised; the claim is that the existing
substrate is sufficient when the primitives below are applied with
discipline.

## Primitives (the components under test)

Each primitive is a candidate component. None is settled. Each is named in
[`falsification-criteria.md`](falsification-criteria.md) with the observation
that would falsify, weaken, or strengthen it.

1. **Modes, not roles** — agents occupy *functions* for *units of work*,
   not territorial roles. An agent moves between modes within a single
   session as the work evolves; the empirical pattern from the 2026-05-03
   Pelagic ↔ Misty session showed both agents moving through multiple
   modes (Pelagic: Orchestrator → Executor → Orchestrator; Misty:
   Executor → Feedback → Executor). Modes are not mutually exclusive; an
   agent can occupy several at once. Mode transitions are recorded in the
   comms log. Initial taxonomy:
   - **Orchestrator** — high-level planning, coordination, and task
     decomposition.
   - **Executor** — executes tasks.
   - **Feedback** — provides feedback and questions to the orchestrator on
     the progress of tasks; specifically, surfaces assumption-breaking
     facts discovered mid-execution.
   - **Collaborator** — substrate mode; every agent is in this mode
     whenever any other mode is active. Listed for completeness rather
     than as a peer of the others.
2. **Identity-without-negotiation** — PDR-027 deterministic identity from
   session seed; no name-collision protocol needed.
3. **Active-claims registry as discovery primitive** — overlap detection via
   shared JSON registry; advisory rather than mechanical refusal.
4. **Atomic-isolated task offers** — the unit of work transfer, with
   minimum-viable shape: scope + acceptance criterion + output format and
   path + word/scope cap + overflow protocol ("if X is too tight, do Y; do
   not unilaterally Z").
5. **Comms log with directional context** — `audience` and `in_response_to`
   extension fields giving events routing context, not just chronology.
6. **Failure-shaped ceremonies** — every load-bearing discipline maps to a
   specific observed failure; the list evolves as new failures are
   captured and old ones graduate to schema or tooling.
7. **Bootstrap fast-path** — degenerate boundary condition for N=1 (or for
   "first agent in" before peers join). Single comms-event note + proceed.
8. **Verification ceremony** — counter to the "skim is indistinguishable
   from a read" failure mode; the receiving agent posts specific verified
   facts from each linked artefact before first edit.
9. **Pending-graduations register** — explicit mechanism for the hypothesis
   itself to evolve. Cures captured here graduate to permanent doctrine
   only after empirical validation at N≥3.
10. **Cheap self-correction** — derived property, not a primitive: protocol
    failures are routine and reversible because no commits land mid-task.
    Listed because it is the consequence that makes the rest of the bundle
    workable; if it does not hold, the bundle is unsafe.
11. **Housekeeping ownership at session-close** — captured 2026-05-03
    (Woodland + Prismatic parallel session, owner-stated). Some
    session-close housekeeping is **agent-specific** (own observations in
    napkin, identity-row last_session refresh, claim close, subjective
    experience file) and can ONLY be done by the originating agent — no
    other agent has the in-memory context. Other housekeeping is **NOT
    agent-specific** (refresh repo-continuity.md, refresh
    pending-graduations register, sweep platform entry points, commit
    prior-session leftover continuity files, run consolidation gate) — any
    agent could do it, which means without explicit ownership none of them
    does and work is lost or stale. **Cure shape**: when an Orchestrator
    role is assigned, the Orchestrator owns shared / not-agent-specific
    housekeeping. When no Orchestrator is assigned, the **last-to-leave**
    rule applies (final committing agent picks up the shared housekeeping).
    Agent-specific housekeeping remains the originating agent's
    responsibility regardless. First-instance witness in this session's
    handoff (prior-Pelagic continuity files committed under
    orchestrator-owns-shared-housekeeping per owner direction). Status:
    candidate; not yet graduation-ripe.

## What this is NOT

- **Not a design.** Designs ship; this is a model under test.
- **Not a specification.** Specifications constrain; this is a candidate
  bundle whose components may individually fail and be replaced.
- **Not validated.** N=2 is a single data point. The hypothesis becomes
  testable at N≥3; falsifiable at N≥5; useful as doctrine only after
  multiple sessions across multiple platform pairings.
- **Not platform-specific.** The substrate is `.agent/` shared state, which
  is platform-agnostic by construction. The hypothesis applies equally to
  claude-code-only, cursor-only, codex-only, and mixed-platform N-tuples.

## Lifecycle of a primitive

```text
captured ─→ tested at N≥3 ─→ refined ─→ graduated to ADR/PDR/rule
                          ↘
                            falsified ─→ replaced or removed
                          ↗
                  weakened ─→ amendment cycle
```

Each primitive moves through this lifecycle independently. The hypothesis
as a whole is never "done"; primitives graduate out as they harden, new
primitives enter as new failure modes are observed.

## Relationship to other artefacts

- [`first-attempts.md`](first-attempts.md) — the operational brief for the
  one empirical instance we have; the two opening prompts that produced
  the 2026-05-03 session.
- [`falsification-criteria.md`](falsification-criteria.md) — per-primitive
  test conditions: what would falsify, weaken, or strengthen each.
- [`experiments.md`](experiments.md) — proposed N≥3 stress tests and
  adversarial probes designed to exercise specific primitives.
- `.agent/memory/operational/pending-graduations.md` § *inter-agent
  collaboration protocol gaps* — cures (i)–(x) captured this session;
  these are candidate primitive amendments awaiting validation.
- `.agent/memory/active/napkin.md` — top entries on the Pelagic ↔ Misty
  collaboration are the empirical observations the hypothesis is
  abstracted from.
- `.agent/directives/agent-collaboration.md` — the current settled doctrine
  on agent-to-agent collaboration; primitives that graduate from here
  amend that directive.

## How to use this hypothesis

- **If you are about to coordinate with another agent**: read
  `first-attempts.md`'s prompt for your mode and follow it. The primitives
  above are what the prompt operationalises; you do not need to read this
  file to coordinate.
- **If you are designing an experiment**: read `experiments.md`. Run the
  experiment, observe outcomes against `falsification-criteria.md`, capture
  observations in the napkin per the structured surprise format.
- **If you are graduating a primitive**: an empirically validated primitive
  (multiple sessions, multiple pairings, no falsifying observations) is a
  candidate for permanent doctrine. Route via consolidate-docs § graduation
  scan; the destination is `.agent/directives/agent-collaboration.md` for
  doctrine-shaped primitives, a rule under `.agent/rules/` for
  enforcement-shaped primitives, an ADR/PDR for decisions worth preserving
  the rationale of.
- **If you are falsifying a primitive**: write up the observation in the
  napkin, amend the primitive's entry in `falsification-criteria.md` to
  cite the falsifying observation, and either propose a replacement or
  remove the primitive from this file.

## Open questions

These are gaps where the hypothesis is currently silent and should be
named explicitly so the next experiment can address them or surface that
they remain unaddressed:

- **Mode-transition events**: when does Orchestrator-Pelagic become
  Executor-Pelagic? Currently implicit. A formal mode-transition event
  type in the comms log is candidate work.
- **Tie-breakers for overlapping claims**: at N≥3 "knowledge and
  communication, not mechanical refusals" risks chronic deadlock.
  Candidate: earliest `claimed_at` wins, or plan-author has precedence,
  or owner-proxy decides.
- **Liveness vs identity disambiguation**: a session_id_prefix is
  identity; a heartbeat is liveness. The current protocol conflates them.
  Cure (iii) heartbeat-or-die is a partial answer.
- **Plan ownership at N≥2**: when two agents author overlapping plan
  content, what is the integration protocol? Rebase-style? Sectional
  ownership? Currently single-author plans assumed.
- **Owner-proxy mode**: when the human owner is unavailable for routine
  decisions, can one agent act as owner-proxy? Bounded scope? Audit trail?
- **Routing rules for events at scale**: broadcast (`audience: ["*"]`)
  vs targeted (`audience: ["Alice"]`) vs reviewer (separate channel?)
  vs auditor (read-only observer?). Renderer needs filters for any of
  this to be navigable at scale.
- **Volume break point**: at what daily event volume does the rendered
  comms log become unreadable? When does polling become impractical?
  These set the threshold at which a real message bus is required.

End. The hypothesis evolves with each experiment. Treat this file as
under-construction and amend explicitly rather than silently.
