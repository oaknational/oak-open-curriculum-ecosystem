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

Consolidation reads the full span of recent sessions on a workstream,
not just the most-recent session's napkin. Patterns that only
emerge across sessions (compounding debt, repeated corrections at
different abstraction layers, drift visible only in aggregate)
require the multi-session read.

Practically:

- When a workstream spans multiple sessions, consolidation reviews
  the rotated napkins, the distilled entries added during the
  workstream window, the consolidation reports from prior sessions,
  and the current napkin — as one corpus.
- Patterns observed in a single session are candidate; patterns
  observed across ≥2 sessions on the same workstream are stronger
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

- Cross-workstream consolidation reads the multi-session corpus,
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
