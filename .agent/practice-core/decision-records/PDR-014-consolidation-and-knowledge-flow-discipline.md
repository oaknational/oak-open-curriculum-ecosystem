---
pdr_kind: governance
---

# PDR-014: Consolidation and Knowledge-Flow Discipline

**Status**: Accepted
**Date**: 2026-04-18
**Related**:
[PDR-007](PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md)
(new Core contract);
[PDR-011](PDR-011-continuity-surfaces-and-surprise-pipeline.md)
(surprise pipeline that feeds consolidation; this PDR governs what
happens inside consolidation).

## Context

The knowledge flow (napkin → distilled → permanent docs / patterns /
PDRs) is the mechanism by which ephemeral session learning becomes
stable Practice. Consolidation is the workflow that operates the
flow. Three disciplines emerged as load-bearing for consolidation
quality:

1. **Cross-session pattern visibility.** Each session captures its
   own surprises and local observations. Session handoffs record
   these faithfully. But the most important patterns — architectural
   drift, compounding debt, fundamental misframings — only become
   visible when observations from multiple sessions are read
   together. A consolidation that reviews only the current session's
   napkin misses the patterns that require multi-session synthesis.

2. **Substance before fitness.** When writing a concept to a
   permanent home, artificially constraining the concept to stay
   under a character or line budget produces under-weighted content
   that fails to teach. Fitness is a post-writing editorial
   concern — not a writing constraint. Concepts should be written
   at the weight they deserve first; fitness pressure is handled
   holistically afterwards through compression of redundant content
   elsewhere, splitting, or raising limits.

3. **Current-plan promotion discipline.** A plan is only truly
   `current/` when it is both **decision-ready** (scope, acceptance
   criteria, and dependencies settled) and **session-entry-ready**
   (a cold-start agent can pick it up and act). A plan that points
   at "current" but lacks cold-start context creates a false
   promise: the queue surface says "here is your next step" but the
   plan itself requires prior-session context to understand.

Underlying cause: consolidation's value depends on three qualities —
cross-session breadth, full-weight substance, and executable
promotion. Each has an anti-pattern that looks acceptable locally
but corrodes the flow over time.

## Decision

**Consolidation runs across sessions (not just the current one).
Concepts are written at the weight they deserve, with fitness
handled editorially afterwards. Plans promoted to `current/` are
both decision-ready and session-entry-ready.**

### Cross-session consolidation

Consolidation reads the full span of recent sessions on a thread,
not just the most-recent session's napkin. Patterns that only
emerge across sessions (compounding debt, repeated corrections at
different abstraction layers, drift visible only in aggregate)
require the multi-session read.

Practically:

- When a thread spans multiple sessions, consolidation reviews
  the rotated napkins, the distilled entries added during the
  thread window, the consolidation reports from prior sessions,
  and the current napkin — as one corpus.
- Patterns observed in a single session are candidate; patterns
  observed across ≥2 sessions on the same thread are stronger
  candidates for graduation.
- A consolidation report from a cross-session review is more durable
  than a single-session handoff — it captures the emergent patterns
  that single-session handoffs cannot.

### Substance before fitness

When writing a concept to a permanent home:

1. **Write the concept fully** at the weight it deserves, in every
   location where it belongs.
2. **Then** check fitness across the file's declared metrics.
3. **Then** handle any fitness violation editorially — through
   compression of redundant content elsewhere in the file, splitting
   the file, or raising the metric's declared limit if the weight is
   justified.

Fitness metrics are signals, not constraints on writing. A concept
that needs 200 lines to teach properly should be written in 200
lines; the file's target may need to rise, other content may need
to compress, or a split may be appropriate — but the concept is
not shrunk to fit.

### Current-plan promotion

A plan in `current/` satisfies two readiness criteria:

| Readiness | Means |
|---|---|
| **Decision-ready** | Scope, acceptance criteria, dependencies, and trade-offs are explicit. No open decisions remain that would block starting. |
| **Session-entry-ready** | A cold-start agent can read the plan and begin work — the plan carries the context needed to act, not just the context needed to understand. Cross-references resolve. The "first concrete step" is explicit. |

When a review tranche settles the real next step, promotion to
`current/` is done in a single pass that ensures both readiness
criteria. A plan pointed at by a queue surface but missing
session-entry-readiness is worse than an empty queue — it promises
executability and delivers confusion.

## Graduation-target routing

When a captured candidate (in napkin, distilled, register, plan
body, or elsewhere) is ready to graduate, **the home is decided
from the candidate's shape, not from convenience or proximity**.
Multiple homes may be appropriate; composition is preferred to
forcing a single home when a candidate has both empirical and
governance dimensions.

### Surfaces and what each holds

| Surface | Holds |
|---|---|
| `pattern` (`.agent/memory/active/patterns/`) | Failure-mode or behaviour shape with concrete instances; recipe-shaped capture |
| `PDR` (new) | Portable Practice-governance decision in novel scope |
| `PDR amendment` | Extension of an existing PDR's scope (preserves provenance via Amendment Log) |
| `ADR` (or amendment) | Architectural decision: technology, structure, boundary; see [PDR-019](PDR-019-adr-scope-by-reusability.md) for ADR↔PDR boundary |
| `rule` (`.agent/rules/`) | Always-applied procedural step requiring per-session/per-handoff firing; platform parity required per [PDR-029](PDR-029-perturbation-mechanism-bundle.md) |
| `principle line` (`principles.md`) | Foundation invariant; cardinal, repo-wide, short; typically composed with an operationalising rule or PDR |
| `command rubric` (`.agent/commands/<workflow>.md`) | Operationalises a doctrine at the firing point inside a workflow step |
| `plan-body` | Plan-local meta-decision (scope, sequencing, fitness tolerance, deferrals) — not portable beyond the plan |
| `practice-md` (`.agent/practice-core/practice.md`) | Visible Artefact Map presence; cross-cuts other surfaces |
| `distilled entry` (`.agent/memory/active/distilled.md`) | Hard-won single-sentence rule-of-thumb that changes behaviour |
| `register entry` | Captured candidate awaiting trigger — not yet graduated |

### Routing decision (run in order; first match wins, then check composition)

1. **Failure-mode or behaviour shape with concrete instances?** →
   `pattern` (this is the empirical-observation home; always start
   here for behaviour-shaped candidates).
2. **Novel portable Practice-governance decision?** → `PDR` (new) —
   but first check: does an existing PDR's scope absorb it? If yes
   → `PDR amendment` (default to amendment when scope-adjacent;
   preserves provenance and avoids governance fragmentation).
3. **Architectural decision (technology, structure, boundary)?** →
   `ADR` or `ADR amendment` per PDR-019.
4. **Needs to fire at every session/handoff/consolidation?** →
   `rule` (always-applied; platform parity required per PDR-029)
   **or** `command rubric` (operationalises at a specific workflow
   step). Choose `rule` when the firing is independent of any
   workflow; choose `command rubric` when the firing belongs to a
   specific workflow step.
5. **Reads as a foundation invariant (cardinal, always-on,
   repo-wide)?** → `principle line` in `principles.md`; typically
   requires composition (see below) with an operationalising rule
   or PDR.
6. **Applies only to one plan's local meta-decision?** →
   `plan-body` (no portable doctrine cost; per
   [PDR-019](PDR-019-adr-scope-by-reusability.md) §plan-local
   meta-decisions).
7. **Otherwise** → `register entry` (pending; trigger on
   second/third independent instance).

### Composition discipline (multiple homes may be appropriate)

A candidate may legitimately need more than one home. Compose, do
not force a single choice:

| Composition | When to use | Example |
|---|---|---|
| `principle` + `rule` | Foundation invariant that needs active firing | *Misleading docs are blocking* + [`tsdoc-and-documentation-hygiene`](../../rules/tsdoc-and-documentation-hygiene.md) |
| `PDR` + `command rubric` | Doctrine ratified portably; fires at a specific workflow step | [PDR-026 §Landing target definition](PDR-026-per-session-landing-commitment.md) + `/session-handoff` close ritual |
| `pattern` + `rule` | Empirical capture + active prevention at firing point | [`inherited-framing-without-first-principles-check`](../../memory/active/patterns/inherited-framing-without-first-principles-check.md) + [`plan-body-first-principles-check`](../../rules/plan-body-first-principles-check.md) |
| `pattern` + `PDR` | Empirical observation + durable portable governance response | `passive-guidance-loses-to-artefact-gravity` + PDR-029 |
| `principle` + `PDR amendment` | Foundation invariant + extension of existing scope | *Owner Direction Beats Plan* + future operationalisation |

### Anti-patterns

- **Rule without companion principle or PDR** — tripwire without
  doctrine; agents fire the rule without understanding why.
- **New PDR for scope already in an existing PDR** — fragments
  governance; amend instead.
- **Principle line without operationalising rule** — passive
  guidance, the exact failure mode
  `passive-guidance-loses-to-artefact-gravity` names.
- **Pattern without a graduation path** — captures forever, never
  converts to active prevention.
- **Picking the surface from convenience** (the file is already
  open / the PDR is short) rather than from shape — produces
  ad-hoc routing the owner direction at 2026-04-22 Session 6
  explicitly forbids.

### When in doubt

Default to **pattern + governance composition**. Pattern alone
captures the empirical instance; the governance surface (PDR,
rule, principle) makes the response durable. Choosing one
prematurely risks either lost provenance (no pattern) or no
active prevention (no governance).

## Rationale

**Why cross-session consolidation beats single-session.** Some
patterns have a cross-session cadence — they emerge from the
accumulation of single-session observations that individually look
routine. Consolidating only within a session misses them. Examples:
compounding workaround debt only becomes visible when three sessions'
worth of workarounds are read together; a repeated failure mode at
different abstraction layers requires multi-session aggregation.

**Why substance before fitness.** Fitness limits exist to prevent
unbounded growth, not to cap individual concepts. When limits
constrain writing, concepts are trimmed to fit rather than written
at their required weight. The result is documentation that is
technically within limits but substantively under-weighted —
teaching poorly, requiring repeated explanation, failing the
self-teaching property. Treating fitness as editorial (applied
after writing) preserves substance; treating it as constraint
(applied during writing) sacrifices substance.

**Why decision-ready + session-entry-ready are both required.** A
plan can be decision-ready (the what is settled) but not
session-entry-ready (a cold-start agent does not know the starting
context). A plan can be session-entry-ready (clear starting point)
but not decision-ready (the what still has open questions). Either
alone produces plans that fail at the queue surface. Both together
produce plans that are safe to promote.

Alternatives rejected:

- **Single-session consolidation only.** Faster, but misses the
  cross-session patterns that are often the most load-bearing.
- **Fitness as writing constraint.** Keeps files neat; destroys
  concept quality. Substance always matters more than line count.
- **Promotion based on decision-readiness alone.** Leaves
  session-entry gaps that surface as friction the next time the
  plan is picked up.

## Consequences

### Required

- Cross-thread consolidation reads the multi-session corpus,
  not just the current session.
- Permanent-home writes happen at full substance; fitness is
  handled editorially in step 6 of the consolidation workflow, not
  during writing.
- Promotion to `current/` verifies both decision-readiness and
  session-entry-readiness before the promotion completes.
- Fitness metric overruns triggered by substance-first writing are
  handled per the fitness model (three-zone; ADR-144 or equivalent
  per host repo), not by post-hoc concept trimming.

### Forbidden

- Consolidation that reads only the current session's napkin when
  multi-session material is relevant.
- Compressing a concept during initial writing to stay under a
  fitness limit.
- Promoting a plan to `current/` without verifying a cold-start
  agent could begin from it.
- Treating fitness warnings as a signal to trim substance rather
  than as a signal to consolidate structure.

### Accepted cost

- Cross-session consolidation takes longer than single-session.
  Justified by the patterns it surfaces.
- Substance-first writing produces larger concept weights; fitness
  pressure rises. Handled editorially.
- Two-criterion promotion is more work than one-criterion
  promotion. Handled by making "promote" a deliberate workflow
  step, not a status toggle.

## Notes

### Host-local context (this repo only)

Proven instances retained with `related_pdr: PDR-014`:

- `.agent/memory/active/patterns/cross-session-pattern-emergence.md` —
  WS3 SDK adoption (4 sessions: investigation → planning → Phase
  1 → Phase 2); the "workaround debt compounds" pattern was only
  visible across all four.
- `.agent/memory/active/patterns/substance-before-fitness.md` — proven
  during Practice Core authoring (2026-04-05); also cited directly
  in `practice.md` §Substance before fitness.
- `.agent/memory/active/patterns/current-plan-promotion.md` — statistical
  roadmap review plus observational tranche promotion (2026-03-22,
  algo-experiments).

## Amendment Log

### 2026-04-22 — Session 6 (Merry / cursor-opus): Graduation-target routing + workstream→thread terminology refresh

**Driver**. Owner direction at 2026-04-22 Session 6 open: *"we
shouldn't be making ad-hoc decisions about rules, pdrs, commands
etc... there should be a right place for this, and there can be
more than one place if appropriate, but we need to establish a
pattern for how we handle this sort of thing."* The
`graduation-target` field exists in the pending-graduations
register schema (PDR-028) but the routing criteria — when each
value is correct, when composition is appropriate — were not
codified. Ratification proceeds as a PDR-014 amendment because
PDR-014's existing scope (consolidation and knowledge-flow
discipline) directly enables routing, and an amendment preserves
provenance over a new PDR per the routing pattern's own anti-
pattern guidance.

**Changes**.

1. New top-level §Graduation-target routing between §Decision and
   §Rationale: surface taxonomy, routing decision tree (run in
   order, first-match-wins then check composition), composition
   discipline (multiple-homes-may-be-appropriate with five
   canonical compositions), anti-patterns, default rule (pattern
   + governance composition).
2. Terminology refresh: five `workstream` references in
   §Cross-session consolidation and §Consequences §Required
   updated to `thread` (per PDR-027 thread-as-continuity-unit;
   the `workstreams/` operational surface was retired Session 5
   per [PDR-027 §Amendment Log 2026-04-21](PDR-027-threads-sessions-and-agent-identity.md)).

**Class A.1 firing** (plan-body first-principles check, the
[`plan-body-first-principles-check`](../../rules/plan-body-first-principles-check.md)
always-applied rule). Three clauses passed: shape (PDR-amendment,
not pattern/rule/distilled), landing-path (PDR-014 tooling
contract is established; substance-first per its own §Substance
before fitness), vendor-literal (N/A; internal vocabulary). No
rewrite. Composition with terminology refresh in single Amendment
Log entry preserves single-amendment honesty.

**Concrete near-term firing trigger** (per PDR-029 retention
discipline; counter-pressure to
`anticipated-surface-installed-then-empirically-unexercised`).
Session 6 Phase A.2 immediately following — applies the routing
to five Pending-band candidates: `deferral-honesty-rule` (3/3),
`manufactured-budget` (2/3),
`anticipated-surface-installed-then-empirically-unexercised`
(2/3),
`owner-mediated-evidence-loop-for-agent-installed-protections`
(1/3), `default-retire-on-empty`. Plus all subsequent Session 6
graduation decisions (Phases B.2 lost-substance re-home, E
PDR-012 amendment for the most-overdue Due-band item).

**Reviewer**. `docs-adr-reviewer` close-pass at Session 6 close
per plan §Reviewer discipline.
