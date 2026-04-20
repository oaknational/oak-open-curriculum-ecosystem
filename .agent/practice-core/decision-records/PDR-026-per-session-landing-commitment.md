---
pdr_kind: governance
---

# PDR-026: Per-Session Landing Commitment

**Status**: Accepted
**Date**: 2026-04-20
**Related**:
[PDR-011](PDR-011-continuity-surfaces-and-surprise-pipeline.md)
(continuity surfaces — the landing commitment composes with
operational continuity);
[PDR-013](PDR-013-grounding-and-framing-discipline.md)
(grounding discipline — landing commitment is a framing discipline
at session open);
[PDR-018](PDR-018-planning-discipline.md)
(planning discipline — the commitment is an anti-pattern counter for
"plans produced instead of outcomes").

## Context

Agentic engineering sessions are bounded units of work. When a
session closes, the only durable output that reaches users or the
running system is the change that has landed in code, in enabled
rules, in added tests, in committed artefacts — something
externally verifiable. A session that produces plans, refines
prompts, opens review loops, and updates roadmaps without landing
any externally-observable change has, from the consumer's
perspective, produced nothing.

In auto-mode or long-horizon sessions, this failure mode is easy to
slip into. Each turn of planning feels productive because the plan
improves; the session report can list activities and feel full; and
yet the system in production is unchanged.

The underlying mechanism is **activity mistaken for progress**.
Plans, reviews, and reframing all have genuine value — but only
when they compose toward a landing. Without a named landing
commitment, the session drifts: each sub-task refines something but
nothing completes.

Two specific observed failure shapes:

1. **Auto-mode drift**: a session runs long, produces many
   artefacts, and the closing summary lists accomplishments; but the
   running system is unchanged. The agent feels productive; the
   reviewer/user finds no verifiable output.
2. **Plan inflation**: each reframing produces a better plan, but
   the plan never ships. "Just one more pass" accumulates until the
   session closes with a refined plan and no code.

Both shapes indicate the same underlying gap: no explicit
externally-verifiable outcome targeted at session open, no landing
criterion evaluated at session close.

## Decision

**Every session opens by stating what it will land (a concrete,
externally-verifiable outcome) or explicitly naming that no landing
is targeted and why. The landing target is reviewed at session
close. Exceptions are bounded.**

### Landing target definition

A **landing** is a specific invariant achieved in code or in the
running system:

- A rule enabled in configuration.
- A test added and passing.
- A file authored and committed.
- A commit made.
- A deployment registered.
- A doctrine change propagated across the named surfaces.

A landing is **not**:

- A plan edit.
- A lane "opened" without code change.
- A review loop started.
- A refined document.

Plan edits, reviews, and refinements compose toward landings; they
are not landings themselves.

### Structure at session open

Every session opens by naming its target:

> Target: `<lane-id or artefact>` — `<specific outcome>`.

Or, if no landing is targeted:

> No-landing session — reason: `<reason>`.

### Structure at session close

Every session closes by reporting against the target:

> Landed: `<outcome>` — `<evidence link>`.

Or, if unlanded:

> `<what was attempted>` — `<what prevented>` — `<what next session
> re-attempts>`.

### Bounded exceptions

Three session shapes legitimately have no code-landing target:

- **Deep-consolidation sessions** — graduation of ephemeral learning
  to durable surfaces; closes with a consolidation commit and
  evidence.
- **Core-trinity refinement sessions** — Practice Core doctrine
  work; closes with a trinity-file diff or a PDR.
- **Root-cause investigation sessions** — diagnostic work that
  legitimately produces a report rather than a fix; closes with the
  investigation report artefact.

An exception must be **named at session open**, not claimed at
close. A session that closes with no landing and no declared
exception is indistinguishable from drift.

## Rationale

### Why externally-verifiable outcomes are the unit

The boundary between "session produced evidence" and "session
produced more plans" is observable only from outside the session.
Internal artefacts (plans, reviews, self-assessments) all look like
progress from inside. External artefacts (code diffs, commits,
enabled rules, added tests) can be checked by someone who didn't
run the session.

Tying the commitment to an external unit means the session cannot
self-certify its own productivity.

### Why the open-and-close structure

Naming the target at open forces the session's work to compose
toward it. Without an explicit target, each sub-task is reviewed
only against itself, and the session as a whole never has a
completion criterion.

Reviewing against the target at close distinguishes landed from
unlanded work. The unlanded-case structure (attempted / prevented /
next-session) converts a near-miss from "we tried" into
actionable continuity state for the next session.

### Why exceptions are bounded

Deep consolidation, Core-trinity refinement, and root-cause
investigation genuinely produce different artefact shapes. The
exceptions exist so these legitimate cases don't have to pretend to
have code targets. But the exceptions are bounded — any session
type that can't be named at open is drift.

### Why this is a Practice-level decision

Session framing is portable. The landing-commitment ritual applies
to any Practice-bearing repo running agentic engineering sessions,
not only to this repo's workstreams. It belongs in the portable
Practice Core, not in a repo-local surface.

## Consequences

### Required

- Every session opens with a target statement (or declared
  exception).
- Every session closes with a landing report (or unlanded-case
  structure).
- `session-handoff` records the landing outcome as part of its
  ordinary closeout.
- Workflow surfaces (`start-right-quick`, `start-right-thorough`,
  `session-handoff`) carry the operational ritual; this PDR carries
  the doctrine.
- When a session closes unlanded, the next-session re-attempt
  lands in `repo-continuity.md § Next safe step` so the commitment
  persists across the boundary.

### Forbidden

- Session summaries that list activity without naming landed
  outcomes (or a declared exception).
- Silent exception-taking: claiming at close that no landing was
  ever intended, when no such declaration was made at open.
- Counting plan refinement or review loops as landings.

### Accepted trade-offs

- Some sessions that used to feel productive (lots of planning,
  many reviewer dispatches) will now be named as unlanded. This is
  the point; visibility is the intended outcome.
- Edge cases where a session genuinely produces landable progress
  in multiple small ways (e.g. three different lanes each moving
  forward) will need to either name one as the primary landing or
  declare a multi-landing target. This is a small cost for the
  discipline.

## Alternatives Considered

- **Implicit per-session tracking via commits alone.** Rejected —
  commits happen during work; the landing commitment is about the
  intended outcome of the session as a whole, named before and
  evaluated after.
- **Milestone-level commitment only, not per-session.** Rejected —
  milestones are too coarse to catch drift within a milestone. The
  failure mode this PDR addresses happens at the session boundary,
  not the milestone boundary.
- **No explicit commitment; trust the agent's self-assessment.**
  Rejected — the failure mode is precisely that self-assessment
  from inside the session can't distinguish activity from progress.
  External structure is required.

## Host-local context (this repo only, not part of the decision)

At the time of authoring:

- The target-at-open ritual is carried by
  [`start-right-quick`](../../skills/start-right-quick/shared/start-right.md)
  (session-entry workflow).
- The landed-at-close ritual is carried by
  [`session-handoff`](../../commands/session-handoff.md).
- Connection to observability work: if a session's landing moves a
  matrix cell in
  [`what-the-system-emits-today.md`](../../plans/observability/what-the-system-emits-today.md)
  from empty to populated, the artefact is updated in the same
  commit so the forward-motion evidence stays accurate.
- Connection to operational continuity: unlanded cases propagate
  via
  [`repo-continuity.md`](../../memory/operational/repo-continuity.md)
  `Next safe step`.
