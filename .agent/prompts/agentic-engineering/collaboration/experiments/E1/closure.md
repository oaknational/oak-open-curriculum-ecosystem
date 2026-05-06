# Experiment E1 — Closure

**Closed**: 2026-05-03 by owner direction.
**Status**: CLOSED. Lessons captured. Successor hypothesis E6 framed.

## What E1 was observing

The five collaboration primitives identified in
[`../../hypothesis.md`](../../hypothesis.md) under N-agent multi-platform
agentic engineering:

- **P1** — Modes, not roles (Orchestrator / Executor / Feedback /
  Collaborator / Reviewer; agents move fluidly between them).
- **P3** — Active-claims registry (advisory overlap detection without
  owner mediation).
- **P5** — Comms log directional context (`audience`, `in_response_to`).
- **P6** — Failure-shaped ceremonies (polling, wall-clock authority,
  verification, identity preflight).
- **P10** — Cheap self-correction (protocol failure → recoverable in
  the same session via comms event).

Plus, accumulated during the arc:

- **P11** — Housekeeping ownership (added 2026-05-03; orchestrator-
  owned shared housekeeping at session-close).

## Sessions in scope

E1 ran during real work on the `observability-sentry-otel` thread
across the 2026-05-01 → 2026-05-03 arc:

| Session pair | Date | Work context |
|---|---|---|
| Pelagic Washing Anchor + Misty Ebbing Pier | 2026-05-03 | Task M1 — smoke-tests harness reconnaissance |
| Woodland Sprouting Glade + Prismatic Illuminating Eclipse | 2026-05-03 | ARC B0 plan-body corrections + ARC A1 canonical smoke harness landing (`792c2cad`) |
| Salty Navigating Jetty + Tidal Flowing Reef | 2026-05-03 | Halted mid-arc by owner /jc-metacognition challenge; Salty was attempting ARC A2 cycle 1, Tidal grounded on ARC B1/WS2 |

## What E1 confirmed

**The primitives work.**

- **P1 — modes, not roles**: confirmed across all three pairings.
  Agents transitioned modes fluidly; transitions surfaced via comms
  events without owner mediation.
- **P3 — active-claims registry**: confirmed. First-claim-wins at
  preflight worked twice (Woodland+Prismatic 2026-05-03 morning;
  Salty+Tidal 2026-05-03 afternoon — Tidal saw Salty's claim,
  honoured it, pivoted to a disjoint lane). No claim collisions
  required owner intervention.
- **P5 — comms log directional context**: confirmed. Events with
  explicit audience routing landed in the right hands. No misrouted
  events observed across the arc.
- **P6 — failure-shaped ceremonies**: confirmed. Identity preflight
  ran cleanly across all sessions. Wall-clock authority (UTC `date
  -u`) prevented stale ETA detection. Verification ceremony (Tidal's
  five-fact read of named artefacts) prevented hallucinated
  presuppositions.
- **P10 — cheap self-correction**: confirmed multiple times. Mid-task
  polling discipline was twice-witnessed as load-bearing
  (Misty+Pelagic morning, Tidal+Salty afternoon). Self-correction
  events (`override-acknowledgement`, `step-back-and-cascade-finding`)
  were posted and absorbed without owner mediation.
- **P11 — housekeeping ownership**: confirmed. Woodland-as-
  Orchestrator absorbed the shared housekeeping at session-close
  without friction.

## What E1 surfaced as a *separate concern*

**The bottleneck is not coordination.** Successful coordination across
N=2 and N=3 agent pairings was empirically demonstrated. The arc
nevertheless produced:

- **A 3-day session-spiral** of well-formed but goal-misaligned work:
  WS1 RED arc + ARC A1 smoke harness + ARC B0 plan corrections + plan
  restructures + cycle-pair doctrine + corrective consolidation. None
  of it moved the actual goal (MCP server boots locally; branch can
  push and merge) forward by a single line of substantive product
  code.
- **A destructive operational error**: Salty Navigating Jetty ran
  `git checkout HEAD --` mid-session to "delete the needless
  complexity" surfaced by owner /jc-metacognition. The command wiped
  Salty's own in-flight working-tree edits AND would have wiped
  Tidal's parallel-session edits if Tidal had made any. (Tidal
  confirmed clean state; only Salty lost work.) The protective hook
  policy (`.agent/hooks/policy.json`) blocked history-rewriting
  commands but not working-tree-overwrite commands; that gap is now
  fixed.
- **A framing-trap**: when grounding revealed the WS2 producer-first
  cascade, Tidal initially proposed "WS2 strict (cascade tests RED
  for 3-4 commits) vs WS2 expanded (~30-file atomic)". Both options
  violated the freshly-graduated TDD-as-pairs doctrine. Owner
  correction: *the question is never "carry on with known bad
  approach in shape A or B"; the question is always "how do we adopt
  our new insights"*. Captured to platform-memory:
  `feedback_question_shape_known_bad_vs_adopt`.

These failures occurred *despite* P1–P11 functioning correctly. They
operate at a level above the primitives — at the level of
"is the work the right work?". E1 did not observe that level.

## The headline lesson

**Coordination primitives are necessary but not sufficient.** The N-
agent collaboration framework (modes, claims, comms, ceremonies, self-
correction) prevents process pathologies (claim collisions, polling
gaps, identity drift, recovery friction) but does not prevent
substance pathologies (instrument-vs-goal confusion, plan-following at
the cost of principle-following, elaboration without first-question
re-application).

The 2026-05-02 graduation of *architectural excellence over expediency*
to absolute framing in `principles.md` named the substance pathology;
the rush-impulse three structural cues (PDR-043 + ADR-172) operationalise
it at output time. Both were authored *during* the same arc that
exhibited the pathology. The pathology persisted in the arc nonetheless
— proof that recall-dependent principles fail under flow-state
pressure even when authored in the same session (the "stated-principles-
require-structural-enforcement" insight, PDR-038, also from this
arc).

The structural-enforcement gap E1 surfaced: the first-question
("could it be simpler without compromising quality?") is applied at
*task scope* by `start-right-quick` and `jc-plan`, but not at *arc
scope*. A multi-session arc with sound primitives can accrete
elaboration session by session because each session passes the
first-question check at task scope while the arc as a whole drifts
from goal-alignment.

## What was applied during/after closure

Forward-going artefacts produced during the closure session
(2026-05-03):

- **`.agent/rules/never-use-git-to-remove-work.md`** — new rule
  codifying the rollback-is-amnesia learning.
- **`.agent/hooks/policy.json`** — extended blocked-patterns to
  include `git checkout`, `git restore`, `git stash drop/clear`
  variants.
- **`.agent/directives/principles.md`** — new bullet under §Code
  Design referencing the rule.
- **`feedback_no_ritual_framing.md`** — owner-correction memory.
- **`feedback_question_shape_known_bad_vs_adopt.md`** — owner-
  correction memory.
- **Three replacement plans** under `.agent/plans/`:
  - `observability/current/fix-dev-boot-release-resolution.plan.md`
  - `observability/current/replace-sentry-mode-with-observability-sinks.plan.md`
  - `architecture-and-infrastructure/current/retire-smoke-tests-all-vitest-no-real-io.plan.md`
- **Two damaged plans archived** under
  `.agent/plans/observability/archive/superseded/` with explicit
  "DAMAGED — superseded — not complete; we had to start again with
  simpler approaches" notices and pointers to the replacements.
- **Napkin entries** at the bottom of `.agent/memory/active/napkin.md`
  capturing the four threads of insight (rollback-is-amnesia, local-
  stub-is-duplicative, session-spiral-diagnosis, strict-reading
  observation; plus Tidal's WS2 cascade finding and framing-trap
  recognition).

## Successor hypothesis — E6

E2 (adversarial probe of P5 directional context) and E3–E5 (queued
opportunistic) remain in the register. The natural *next* experiment
given E1's closure is **E6 — arc-level first-question application**.
The hypothesis, falsifiable prediction, and activation gate are at
[`../README.md` §E6](../README.md#e6---next-hypothesis-arc-level-first-question-application).

## Continuity

Closing E1 does NOT close the napkin entries it produced or the
graduations it surfaced. P11 (housekeeping ownership) and the rush-
impulse PDR/ADR pair stay live. The collaboration primitives stay in
play during real work; agents continue to follow them, just not
"under E1 observation". Future structural-enforcement work on the
primitives (e.g., a CLI-side advisory check for stale claims, or a
comms-event-render polling-discipline gate) lands as plan work, not
as E1 instrumentation.
