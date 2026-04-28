---
pdr_kind: governance
---

# PDR-019: ADR Scope by Reusability, Not Diff Size

**Status**: Accepted (amended 2026-04-21)
**Date**: 2026-04-18 (amended 2026-04-21 — ADR contents discipline
added: an ADR records the **WHAT** of a decision (the choice, the
rejected alternatives, the trade-off rationale) and not the **HOW**
of its implementation. Reusability test for ADR existence
unchanged; this amendment governs what an ADR contains once it
exists.)
**Related**:
[PDR-007](PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md)
(new Core contract — PDRs and ADRs cover different seams per
PDR-001; this PDR governs how host-repo ADRs are scoped);
[PDR-023](PDR-023-documentation-structure-discipline.md)
(documentation structure — ADRs participate in the README-as-Index
mesh; this PDR's WHAT-not-HOW amendment composes with PDR-023's
discoverability discipline).

## Amendment Log

- **2026-04-21** (Accepted): ADR contents discipline added —
  **ADRs state WHAT decisions were made, not HOW they were
  implemented.** Implementation detail belongs in code (with TSDoc
  for intent and trade-offs), in plan bodies (for execution
  sequencing), or in runbooks (for operational procedure) — not in
  ADR body sections that risk becoming maintenance burden when
  implementation drifts. The §Decision section of an ADR records
  the choice and its scope; the §Rationale section records why
  this choice over the rejected alternatives; the §Consequences
  section records the constraint propagation and accepted costs.
  None of these sections describes step-by-step how to implement
  the decision in code. Captured originally in the retracted
  standing-decisions register entry `adrs-state-what-not-how`;
  graduated to this PDR amendment in 2026-04-21 Session 5 per the
  decomposition arc.

## Context

ADRs (architectural decision records in a host repo) are intended
to capture decisions that shape the repo's architecture. In
practice, the decision to write an ADR is often coupled to the
size of the change rather than to the decision's reusability.

Two failure modes emerge:

1. **Large changes get ADRs; small changes don't**. A multi-file
   refactor produces an ADR because the change is visibly
   substantial. A small configuration choice — three lines in a
   config file — doesn't, because the change is trivially small.
   But the small change may have encoded a decision that the
   next adopter of the same configuration will need to re-derive;
   the large change may have been purely mechanical with no
   reusable decision.

2. **Decisions that would be re-derived by every adopter don't
   get ADRs**. The decision is obvious once you've worked through
   the problem. The adopter-cost of not having it recorded
   becomes visible only when a new adopter arrives and re-walks
   the same ground — which may not happen for months.

Underlying cause: diff size is a visible signal at the author's
moment; reusability is a question about future adopters the
author cannot observe. The visible signal wins by default.

## Decision

**At lane closure, ask: "will the next adopter re-derive this same
decision?" If yes, the decision deserves an ADR regardless of how
small the diff was. If no, the change is execution and does not
need an ADR regardless of how large the diff was.**

### The reusability test

When closing a lane, look at the decisions the lane encoded (as
distinct from the execution work the lane performed). For each
decision:

- **Would a future contributor hitting the same question re-derive
  the same answer from scratch?** If yes, the decision is
  pre-derivable and does not need an ADR.
- **Would a future contributor hitting the same question
  re-derive a different answer, or re-walk the same reasoning the
  original author walked?** If yes, the decision is a reusable
  trade-off that deserves an ADR to short-circuit the re-walk.

The test operates at the **decision** level, not the **change**
level. A single-line config change may encode a trade-off that
every subsequent adopter will face; a thousand-line refactor may
be purely execution of an already-decided pattern.

### ADR-worthy signals

A decision is likely ADR-worthy if one or more holds:

- The decision rejected at least one reasonable alternative.
- The decision involves a trade-off between competing goods
  (simplicity vs completeness, speed vs flexibility, portability
  vs locality, etc.).
- The decision encodes a constraint that will propagate to future
  work (what must be preserved; what must be avoided).
- The decision has an articulable rationale that is not obvious
  from the code itself.
- Multiple adopters of the same stack will face the same decision.

A decision is likely not ADR-worthy if:

- The implementation is mechanical execution of a prior decision
  (that prior decision deserves the ADR, if any).
- The answer is derivable from the repo's principles or from
  domain best-practice without trade-off.
- The change is bug-fix: restoring intended behaviour without
  changing the intended behaviour itself.

### ADR vs PDR seam

ADRs govern host-repo product architecture. PDRs govern the
Practice itself. A decision that shapes how work is done inside
the Practice network is PDR-shaped (and portable); a decision
that shapes a specific repo's product architecture is ADR-shaped
(and local).

The reusability test applies to both, but the adopter scope
differs:

- ADR adopter = the next contributor in this repo (or a fork).
- PDR adopter = the next Practice-bearing repo that hydrates the
  Core.

A decision that would be re-derived across repos is a PDR; a
decision that would be re-derived within this repo is an ADR.

### ADRs state WHAT, not HOW (2026-04-21 amendment)

Once an ADR exists (per the reusability test), its **contents** are
disciplined: the ADR records the **WHAT** of the decision, not the
**HOW** of its implementation.

| Section | Records | Does NOT record |
|---|---|---|
| **Status** | Acceptance state, date, amendment lineage | — |
| **Context** | The problem the decision addresses; constraints in play; the question being answered | Step-by-step background of how the team got here unless load-bearing for the trade-off |
| **Decision** | The choice made; the scope of the choice; named rejected alternatives at the choice level | Implementation steps; code snippets longer than necessary to illustrate the choice's shape; configuration values that will drift |
| **Rationale** | Why this choice over the rejected alternatives; trade-offs accepted | How to operate the implementation; recipes for callers |
| **Consequences** | What the decision constrains in future work; accepted costs; mitigations at the decision level | Runbook procedure; troubleshooting steps; deployment instructions |

Implementation belongs in:

- **Code with TSDoc** — the canonical home for *how* a decision
  is realised in a specific module, with intent and trade-off
  context inline.
- **Plan bodies** — the canonical home for *how* the decision is
  rolled out across the codebase (sequencing, gates, rollback).
- **Runbooks and READMEs** — the canonical home for *how* to
  operate the implementation post-landing.

The risk an ADR with HOW-content carries: when the implementation
drifts from the ADR's HOW-section (which it will, because code
changes faster than ADRs), the ADR becomes misleading rather than
useful. A WHAT-only ADR remains correct as long as the underlying
decision holds; only a decision change requires an ADR amendment.

This discipline applies to **new ADRs** authored after the
2026-04-21 amendment date. Existing ADRs with HOW-content are not
required to be retroactively pruned; they are pruned opportunistically
when the surrounding code changes and the HOW-section is observed
to have drifted (per the `Misleading docs are blocking` principle
in `.agent/directives/principles.md` § Code Quality).

## Rationale

**Why reusability, not diff size.** Diff size is a local author-time
signal. Reusability is an adopter-time signal. The adopter is the
beneficiary of the ADR; the author is the one writing it. Scoping
by diff size optimises for the author's visibility; scoping by
reusability optimises for the adopter's cost.

**Why the question "will the next adopter re-derive?" is the
discriminator.** Re-derivation is the real cost the ADR prevents.
A decision that is re-derivable at no cost (obvious, or
derivable from principles) does not need an ADR. A decision whose
re-derivation would require walking the same reasoning path the
original author walked is exactly what an ADR short-circuits.

**Why the test runs at lane closure.** Mid-lane, the decisions
are not yet settled — writing ADRs during work produces ADR churn
and tends to over-produce them. At closure, decisions are stable
and the reusability judgement is reliable.

Alternatives rejected:

- **Write ADRs for all changes above a diff-size threshold.**
  Captures execution-heavy changes; misses decision-heavy small
  ones.
- **Write ADRs only when explicitly requested.** Relies on
  someone noticing; decisions slip through unnoticed.
- **Write every decision.** Produces ADR sprawl; the signal-to-
  noise degrades until ADRs are not read.

## Consequences

### Required

- At the closure of every non-trivial lane, the reusability test
  is applied explicitly — named in the closure checklist, not
  treated as implicit.
- ADR-worthy decisions in small diffs get ADRs.
- Execution-only large diffs do not get ADRs (the prior decision
  ADR, if any, covers them).
- Decisions shaping the Practice itself route to PDRs, not ADRs.

### Forbidden

- Scoping ADR production by diff size alone.
- Omitting an ADR on a small change because "it's just
  configuration" when the configuration encodes a re-derivable
  decision.
- Producing an ADR for mechanical execution work that doesn't
  encode a reusable decision.
- Authoring **HOW-content** in new ADR bodies — implementation
  steps, configuration values that will drift, runbook procedure,
  caller recipes — per §"ADRs state WHAT, not HOW" (2026-04-21
  amendment). Implementation belongs in code with TSDoc, in plan
  bodies, or in runbooks.

### Accepted cost

- The reusability test requires judgement. Judgement is fallible.
  The fallibility is absorbed by the reviewer system (ADRs
  missed at lane closure may be surfaced at review).

## Notes

### Host-local context (this repo only)

Proven instance retained with `related_pdr: PDR-019`:

- `.agent/memory/active/patterns/adr-by-reusability-not-diff-size.md` —
  materialised as ADR-159 (per-workspace vendor CLI ownership)
  from a tight hygiene lane; small diff, ADR-worthy because the
  decision pattern would be re-derived by every next vendor CLI
  adoption.
