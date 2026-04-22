---
pdr_kind: governance
---

# PDR-026: Per-Session Landing Commitment

**Status**: Accepted (amended 2026-04-21, amended 2026-04-21
Session 5, amended 2026-04-22 Session 6)
**Date**: 2026-04-20 (amended 2026-04-21 — landing commitment
clarified as **per-thread-per-session**: a session commits to
landing one thread's target; cross-thread spread within a single
session is anti-pattern. Underlying decision — externally-verifiable
outcomes as the landing unit, the open-and-close structure, and
the bounded exceptions — unchanged. Amended 2026-04-21 Session 5
— **docs-as-definition-of-done extension**: the landing-target
definition is extended so that a code or doctrine change that has
not also updated the docs the change invalidates is not yet landed.
Doc updates compose into the landing, not into a separate later
phase. Underlying decision unchanged. Amended 2026-04-22 Session 6
— **deferral-honesty discipline**: deferrals at session-handoff or
consolidation close are honest when they satisfy three requirements
— named constraint or trade-off, evidence, and falsifiability;
operationalised by command rubrics in `/session-handoff` step 1
and `/consolidate-docs`. Underlying decision unchanged.)
**Related**:
[PDR-011](PDR-011-continuity-surfaces-and-surprise-pipeline.md)
(continuity surfaces — the landing commitment composes with
operational continuity; PDR-011's 2026-04-21 amendment scopes
continuity to the thread);
[PDR-013](PDR-013-grounding-and-framing-discipline.md)
(grounding discipline — landing commitment is a framing discipline
at session open);
[PDR-018](PDR-018-planning-discipline.md)
(planning discipline — the commitment is an anti-pattern counter for
"plans produced instead of outcomes");
[PDR-027](PDR-027-threads-sessions-and-agent-identity.md)
(threads, sessions, and agent identity — this PDR's 2026-04-21
amendment clarifies landing commitment against the thread
continuity unit).

## Amendment Log

- **2026-04-21** (Accepted): landing commitment clarified as
  **per-thread-per-session**. A session with more than one active thread in scope
  still commits to landing ONE thread's target; the other
  threads must be explicitly declared as non-participating for
  the duration of the session. Cross-thread spread within a
  single session is anti-pattern. The underlying doctrine
  (externally-verifiable outcomes, open-and-close structure,
  bounded exceptions) is unchanged; this amendment aligns the
  commitment's scope language with PDR-027's continuity unit
  (thread).
- **2026-04-21 Session 5** (Accepted): **docs-as-definition-of-
  done extension** to §"Landing target definition". A code or
  doctrine change that invalidates passages in surrounding
  documentation (READMEs, ADRs, PDRs, plan bodies, runbooks,
  TSDoc) is **not landed** until those docs have been updated to
  reflect the change. Doc updates compose into the landing
  commit, not a deferred follow-up. The principle is symmetric
  with the `Misleading docs are blocking` principle in
  `.agent/directives/principles.md` § Code Quality: shipping a
  change without the doc update is shipping a misleading-doc.
  Captured originally in the retracted standing-decisions
  register entry `docs-as-definition-of-done-on-every-lane`;
  graduated to this PDR amendment in 2026-04-21 Session 5 per
  the decomposition arc.
- **2026-04-22 Session 6** (Accepted): **deferral-honesty
  discipline** added as a new §Decision sub-section after
  §Bounded exceptions. A deferral asserted at session-handoff
  or consolidation close is *honest* when it satisfies three
  requirements: (1) named constraint or named priority
  trade-off, (2) evidence establishing the constraint or
  trade-off, (3) falsifiability — a future agent can check
  whether the constraint or trade-off held. Convenience
  phrasings ("budget consumed", "out of scope", "for later",
  "next session", "ran out of time") fail one or more
  requirements. Operationalised by command-rubric additions in
  [`/session-handoff` step 1](../../commands/session-handoff.md)
  (the `<what prevented>` field on unlanded cases) and
  [`/consolidate-docs`](../../commands/consolidate-docs.md)
  (cross-cutting top-of-Steps note covering all deferrals
  surfaced by the workflow). Routed under the new
  [PDR-014 §Graduation-target routing](PDR-014-consolidation-and-knowledge-flow-discipline.md#graduation-target-routing)
  as the canonical `PDR + command rubric` composition (Driver:
  the `feel-state-of-completion-preceding-evidence-of-completion`
  parent pattern at 2/3 cross-session instances; the
  `deferral-honesty-rule` candidate reached 3/3 with the
  post-handoff consolidation deferral counting as the third
  instance per owner direction at Session 6 open). Symmetric
  with §Landing target definition: that section sets the
  standard for what counts as landed; this section sets the
  standard for what counts as honest non-landing.

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
close. Exceptions are bounded. The commitment is
**per-thread-per-session** — a session commits to landing ONE
thread's target, and cross-thread spread within a single session
is anti-pattern.**

### Per-thread-per-session (2026-04-21 amendment)

Under PDR-027, the continuity unit is the **thread** (a named
stream of work persisting across sessions). A session may touch
one or more threads. This PDR's landing commitment scopes to
**one thread per session**:

- At session open, the session **names the thread it is
  landing against** alongside the landing target. If more than
  one thread is in view, one is named as the landing target's
  thread and the others are explicitly declared as
  non-participating for the duration of the session.
- At session close, the landing report is **scoped to that
  thread**. Progress on non-participating threads is noted
  only as incidental side-effect (if any); it does not count
  against or toward the landing commitment.
- Cross-thread spread within a single session — advancing
  landing targets on multiple threads simultaneously — is
  anti-pattern. The failure mode: each thread receives partial
  attention; none receives complete landing; the session
  closes with two half-landed targets which is strictly worse
  than one fully-landed target.

Bounded exceptions (deep-consolidation, Core-trinity
refinement, root-cause investigation) remain bounded; they
apply per thread as before, and a no-landing declaration still
names its thread even when no code landing is targeted.

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

**Docs-as-definition-of-done (2026-04-21 Session 5 amendment).**
A landing is **not complete** while documentation invalidated by
the change remains stale. Specifically: any README, ADR, PDR,
plan body, runbook, or TSDoc passage that the change makes
incorrect, misleading, or pointing-at-a-retired-surface MUST be
updated as part of the landing — in the same commit (or in the
same close-out batch when the change spans multiple commits) — not
deferred to a later "doc sync" phase. The doc update is **part of
the landing**, not a follow-up. A change that ships the code
without the doc update is shipping a misleading-doc, which the
`Misleading docs are blocking` principle (`.agent/directives/
principles.md` § Code Quality) categorises as a quality-gate
breach. The two surfaces are symmetric: PDR-026 says doc updates
compose into landings; the principle says misleading docs cannot
ship.

### Structure at session open

Every session opens by naming its target and the thread it
lands against:

> Thread: `<thread-slug>` — Target: `<lane-id or artefact>` —
> `<specific outcome>`.

Or, if no landing is targeted:

> Thread: `<thread-slug>` — No-landing session —
> reason: `<reason>`.

If additional threads are in view but not participating, the
session explicitly names them:

> Non-participating threads this session: `<thread-slug>`,
> `<thread-slug>`.

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

### Deferral-honesty discipline

A deferral made at session-handoff or consolidation close is
**honest** when it satisfies three requirements:

1. **Named constraint or trade-off** — cite a specific external
   constraint (clock, cost, dependency, owner veto) or a specific
   priority trade-off (named scope being protected, named risk
   being avoided).
2. **Evidence** — name the concrete observation that establishes
   the constraint or trade-off: the meter, the deadline, the
   missing dependency, the load-bearing target the trade-off
   protects.
3. **Falsifiability** — state how a future agent could check
   whether the constraint or trade-off held: what would prove the
   deferral was correct, what would prove it was premature.

A deferral satisfying all three becomes a load-bearing handoff
signal. The next session knows what changed (constraint resolved?
trade-off no longer relevant?) and can act accordingly.

A deferral that fails one or more requirements is an abandonment
dressed as a deferral. Common diagnostic phrasings that signal
failure: *"budget consumed"*, *"out of scope"*, *"for later"*,
*"next session"*, *"ran out of time"* — these are convenience
labels, not constraints. None can be checked later; none names
what changed.

The deferral-honesty discipline composes with §Landing target
definition. §Landing target definition sets the standard for what
counts as landed; deferral-honesty sets the standard for what
counts as honest non-landing. Together they prevent
partial-completion theatre at session boundaries.

Operationalisation:

- [`/session-handoff` step 1](../../commands/session-handoff.md) —
  the `<what prevented>` field on unlanded cases must satisfy the
  three requirements above.
- [`/consolidate-docs`](../../commands/consolidate-docs.md) —
  cross-cutting top-of-Steps note covering deferrals surfaced
  anywhere in the workflow (Pending-band candidates kept rather
  than promoted, fitness items deferred, Practice Core refinement
  queued).

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
- Every deferral asserted at session-handoff or consolidation
  close satisfies the three requirements of the
  2026-04-22 Session 6 deferral-honesty amendment (named
  constraint or trade-off, evidence, falsifiability).

### Forbidden

- Session summaries that list activity without naming landed
  outcomes (or a declared exception).
- Silent exception-taking: claiming at close that no landing was
  ever intended, when no such declaration was made at open.
- Counting plan refinement or review loops as landings.
- Reporting a change as landed while documentation invalidated by
  the change remains stale, per the 2026-04-21 Session 5
  docs-as-definition-of-done amendment.
- Asserting a deferral with a convenience phrase ("budget
  consumed", "out of scope", "for later", "next session", "ran
  out of time") in place of a named constraint or trade-off with
  evidence and falsifiability, per the 2026-04-22 Session 6
  deferral-honesty amendment.

### Accepted trade-offs

- Some sessions that used to feel productive (lots of planning,
  many reviewer dispatches) will now be named as unlanded. This is
  the point; visibility is the intended outcome.
- Edge cases where a session genuinely produces landable progress
  in multiple small ways (e.g. three different lanes each moving
  forward) will need to either name one as the primary landing or
  declare a multi-landing target. This is a small cost for the
  discipline.
- Under the 2026-04-21 per-thread-per-session amendment,
  sessions with multiple threads in view must pick one and
  explicitly declare non-participation in the others. This
  forecloses the "work a little on each" cross-thread pattern.
  The trade-off is acknowledged: some throughput is lost on
  sessions where cross-thread work genuinely composes, in
  exchange for elimination of the more common failure mode
  where cross-thread spread produces two half-landings.

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

## Notes

### Graduation intent

Like PDR-011 and the 2026-04-21 bundle's sibling PDRs (PDR-027,
PDR-028, PDR-029, PDR-030), this PDR's substance is a candidate
for eventual graduation into `practice.md` (the session /
workflow section) once the landing-commitment discipline has
been exercised across multiple cross-repo hydrations. The
per-thread-per-session clarification brought in by the
2026-04-21 amendment is part of the candidate substance.
Graduation marks the PDR `Superseded by <Core section>` and
retains it as provenance.

### Host-local context (this repo only, not part of the decision)

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
