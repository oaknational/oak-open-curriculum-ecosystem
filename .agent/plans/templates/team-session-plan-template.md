---
name: "[Team Session Plan Title]"
status: planning
overview: "[One line: the team-level impact this multi-agent session drives]"
lineage:
  serves_thread: "[the thread this team session serves]"
  serves_stream: "[the stream above it, if any]"
  strategic_choice: "[the strategic choice above that, if any]"
  derives_from: "[the strategic/roadmap source this team session executes]"
isProject: true
---

<!-- WHAT THIS TEMPLATE IS.
     A TEAM SESSION PLAN is the cohesion anchor for a multi-agent (Director +
     implementers) session: it fixes the team-level IMPACT and OUTCOME goals up
     front and traces every lane back to them, so that as work fans out and seats
     rotate the session does not lose cohesion. It is the STRATEGIC layer that the
     team-session-opener prompt's `Plan authority` line points AT.

     It is NOT the operational setup (entry ritual, worktrees, seats, cadence,
     closeout) — that lives in the team-session-opener prompt TEMPLATE:
     `.agent/prompts/agentic-engineering/team-session-opener.prompt.md`. Author the
     two together: this plan is the WHY/WHAT/COHESION; the opener instance is the HOW.

     It is NOT a per-lane execution plan. Each lane has its own executable plan
     (current/ or active/) carrying the TDD cycles, acceptance, and validation; this
     plan REFERENCES them, never restates them (ADR-117 one-fact-one-home).

     Governance: /oak-plan §Strategic Plan Requirements; ADR-117 (document
     hierarchy); PDR-117 (Director/Implementer roles); the team-session-opener
     prompt template (operational shape). Fill every [bracketed] placeholder, delete
     sections that do not apply, and remove this comment before marking ready. -->

# [Team Session Plan Title]

**Last Updated**: [YYYY-MM-DD]
**Status**: 🟡 PLANNING
**Operating model**: Director + [N] implementers, each in its own git worktree (PDR-117).

---

## Team-Level Impact (the north star)

State, in one or two sentences, the user or system IMPACT this team session exists to
move — the WHY that every seat's work must trace back to. This is the cohesion source:
if a lane cannot be traced to this impact, it does not belong in this session.

+ **Impact**: [who is better off, and how, when this session succeeds — not an activity]
+ **Why now**: [the trigger / evidence that makes this the team's focus]

## Team-Level Outcome Goals (what this session delivers)

The concrete, measurable OUTCOMES that realise the impact. Outcomes, not activity:
"X is true / shipped / proven", never "we worked on X". These are the acceptance
spine; every lane delivers toward one or more of them.

+ **O1** — [outcome]; measured by [observable proof].
+ **O2** — [outcome]; measured by [observable proof].

## Cohesion Mechanism (what the worktree-pilot lacked)

This is the load-bearing section — the absence of it is what let the pilot lose
cohesion. Name explicitly HOW the lanes stay aligned to the impact/outcome as the
session runs and seats rotate:

+ **Lane-to-outcome trace**: every lane below names the outcome (O1/O2/…) it serves;
  a lane serving no outcome is cut or re-scoped, not run.
+ **The Director holds the whole**: the Director's standing job is to keep every live
  lane traceable to an outcome and to re-route or stop drift (PDR-117 minimum-action;
  the Director directs, does not execute). The director brief
  (`.agent/memory/operational/director-handoff.md`) is its operational instance.
+ **Cohesion checkpoints**: [when the team re-checks lanes against the outcomes — e.g.
  at each merge waypoint, each seat rotation, and a mid-arc checkpoint per the
  session-discipline component]. A checkpoint that finds a drifted lane re-routes it.
+ **Owner-interface discipline**: the Director is the single owner-interface; lanes
  surface decisions up to the Director, who lens-resolves or escalates (PDR-117
  routing contract). This prevents the request-driven drift that seeded the pilot.

## Seats and Lanes

One row per seat. Each lane names the OUTCOME it serves, its referenced execution
plan, and any hard sequencing gate (a surface overlap where the dependent lane starts
only after the blocking PR is MERGED). The operational seat-brief detail (owned
surfaces, must-not-touch, worktree) lives in the team-session-opener prompt instance —
reference it, do not duplicate it here.

| Seat | Serves | Lane (one line) | Execution plan | Hard sequencing gate |
| --- | --- | --- | --- | --- |
| Director | all | Direct; hold cohesion; route; merge-sequence; state/continuity writes | director brief (PDR-117) | — |
| [impl-seat-1] | [O1] | [deliverable] | [`path/to/lane-1.plan.md`] | [none / after `<PR>` merged] |
| [impl-seat-2] | [O2] | [deliverable] | [`path/to/lane-2.plan.md`] | [none / after `<PR>` merged] |
| agent-tooling | enablement | Fix agent-tooling frictions AS THE SESSION RUNS (the live friction backlog) | [`.agent/plans/agent-tooling/...`] | — |

<!-- The dedicated agent-tooling implementer seat is a standing recommendation when
     the session is expected to exercise the coordination substrate heavily — it owns
     the friction register's open items and any new friction surfaced live. Delete the
     row if this session does not warrant a dedicated tooling seat. -->

## Referenced Execution Plans (the work — not restated here)

Each lane's controlling plan is authoritative for its scope, sequencing, acceptance,
and validation. The team-session-opener prompt instance's `Plan authority` line lists
the same set.

+ [`path/to/lane-1.plan.md`] — serves O1.
+ [`path/to/lane-2.plan.md`] — serves O2.

## Acceptance Criteria (team-level, outcome-based)

The session succeeds when the outcomes are proven — not when activity occurred.

1. **O1 proven** — [observable proof / command / artefact].
2. **O2 proven** — [observable proof / command / artefact].
3. **Cohesion held** — every lane that ran traced to an outcome; drift was re-routed,
   not absorbed (a closeout assessment, not just "the lanes shipped").
4. [Operating-model evidence, if this session is also exercising the team model:
   record whether the Director/worktree model reduced or added coordination cost.]

## Non-Goals (YAGNI)

+ [What this team session explicitly will NOT pursue, and why — the boundary that
  keeps it cohesive.]

## Operating Model and Cadence (referenced, not restated)

+ **Operational setup**: the team-session-opener prompt template
  (`.agent/prompts/agentic-engineering/team-session-opener.prompt.md`) — entry ritual,
  worktrees + single coordination-home, branch classes, seat briefs, coordination
  cadence, closeout. Instantiate it for this session alongside this plan.
+ **Roles**: [PDR-117](../../practice-core/decision-records/PDR-117-director-and-implementer-roles.md)
  (Director + Implementer); the coordinator doctrine in
  [`agent-collaboration.md`](../../directives/agent-collaboration.md).
+ **Session discipline**: see
  [`components/session-discipline.md`](components/session-discipline.md) — the four
  tripwires (count-is-a-template, mid-arc checkpoints, context-budget thresholds,
  metacognition at open) apply to every seat's sessions.

## Risks

| Risk | Mitigation |
|------|------------|
| Cohesion loss as lanes fan out | The cohesion mechanism above + Director checkpoints |
| [Risk 2] | [Mitigation] |

## Lifecycle and Consolidation

+ **Lifecycle triggers**: see [`components/lifecycle-triggers.md`](components/lifecycle-triggers.md).
+ **Closeout**: the Director is the team closeout owner; runs the full
  `session-handoff` + `consolidate-docs` before the final coordination-branch PR
  merges (team-session-opener prompt §Coordination cadence).
+ **Completion**: outcomes proven (acceptance above); the per-lane plans archived per
  ADR-117; the operating-model evidence folded into its home if this session was a
  model exercise.

<!-- After copying this template into a collection, adjust the relative component /
     directive / decision-record paths above to that location's depth, and run the
     /oak-plan readiness self-check (no unresolved [bracketed] placeholders). -->
