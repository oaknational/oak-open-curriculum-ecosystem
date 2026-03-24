# Practice Maturity Diagnostic Framework

**Origin**: oak-open-curriculum-ecosystem, 2026-03-19
**Status**: Proven — used in pine-scripts self-assessment (Level 3) and
validated during deep integration of algo-experiments round-trip

## What It Is

A four-level model that diagnoses Practice **depth** independently of
scope. The key insight is that a Production-scope installation can be at
Level 1 (structurally complete but inert). The levels are diagnostic, not
aspirational — they tell you what's working, what's silent, and where the
failure mode sits.

| Level | Name               | Signals                                                | Failure mode                       |
| ----- | ------------------ | ------------------------------------------------------ | ---------------------------------- |
| 1     | **Structural**     | Files present, references resolve                      | Looks right, nothing works         |
| 2     | **Operational**    | Directives have depth, sub-agents function             | Works but doesn't self-correct     |
| 3     | **Self-Correcting** | Metacognition genuine, consolidation catches drift     | Corrects but doesn't evolve        |
| 4     | **Evolving**       | Lineage captures principles, context processed         | Evolves without selection pressure  |

**Target Level 3** before declaring any integration complete.

## Why It Matters

Without maturity levels, Practice integration checklists measure
**structure** (are the files there? do references resolve?) but not
**depth** (is metacognition genuine? does consolidation actually catch
drift?). This produces the "not even wrong" failure mode — everything
looks correct, nothing is actually working.

The framework was born from observing that the metacognitive prompt — the
tool designed to catch shallow execution — was itself the thing most
frequently reduced to a shallow planning template during integration.
Maturity Level 1 catches this: the file is present and the reference
resolves, but the system is structurally complete yet inert.

## Where It Lives

In `practice-lineage.md`, between §Adaptation Levels and §How the Practice
Evolves. It complements Adaptation Levels (which describe scope: POC vs
Production) with a depth dimension.

## Installation

Add the table and the "target Level 3" mandate to your local
`practice-lineage.md`. Consider adding a cross-reference from
`practice.md` §Self-Teaching Property so agents reading the self-teaching
description can find the diagnostic criteria.

## Relationship to Other Learnings

- Connects to "metacognition is a technology, not a checklist" — the
  Level 1 → Level 2 transition is where this principle has its sharpest
  effect
- Connects to "the not even wrong failure mode" — Level 1 is precisely
  this failure mode, now named and diagnosable
- The integration health check proposal (from pine-scripts) maps to
  Level 2 → Level 3 verification
