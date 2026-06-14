---
name: cross-branch-consolidation-re-derive-full-workstream
use_this_when: "Consolidating a lane or workstream from one branch onto another — drive completeness from the workstream's full definition (code plus the activating skills, rules, tests, and lessons), not just the source files you copied across."
polarity: pattern
category: process
status: emerging
discovered: 2026-06-13
proven_by: "Skylark wakes Summit consolidating the statusline WS1 lane onto feat/comms-research. `git show <branch>:<file> > <file>` carried the CODE but stranded the doctrine that ACTIVATES it — the --role skill amendment (without which the role/director indicators never light up; the feature ships inert), the check-singleton 'cure landed' update, and the WS1 mechanism lessons all stayed on the source branch. A half-landing that surfaced only on the owner's 'anything orphaned?' probe."
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Consolidating a workstream across branches by materialising only its CODE (git show / cherry-pick of source files), silently orphaning the non-code surfaces that activate it — skills, rules, tests, and lessons — so the feature lands inert and the learning is lost on the source branch."
  stable: false
---

> **POLARITY: PATTERN.** This entry names a *shape to repeat*, not a failure mode to avoid.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern) for the polarity discipline.

# Cross-Branch Consolidation Re-Derives the Full Workstream, Not Just the Code

## Pattern

When consolidating a lane from one branch onto another, re-derive the **full workstream
definition** — code **plus** the surfaces that activate it: skills, rules, directives,
tests, and the lessons captured for it. Use the plan's own WS todo list as the
completeness checklist, and run a **branch-vs-branch divergence sweep over the non-code
surfaces** (skills, rules, memory, patterns) before declaring the consolidation complete.

## Anti-pattern

The agent brings a lane across via `git show <branch>:<path> > <path>` (or cherry-pick of
source files), gates the code green, and calls the consolidation done. But the code's
*activating doctrine* lives elsewhere: a skill amendment that makes a CLI flag do anything,
a rule update, the tests that prove it, the napkin/pattern lessons that explain it. Those
stayed on the source branch. The feature is now present but inert; the next agent finds
code with no doctrine telling it when or how the behaviour fires, and the lessons are
stranded where no reader on the target branch will find them.

## Why it matters

Code is the most visible part of a workstream and the easiest to move, so a code-only
materialisation *feels* complete and passes gates. The parts that make it work and make it
learnable — the skill/rule that activates it, the tests that pin it, the lessons that
preserve why — are exactly the parts a code-only move drops. The failure is silent: nothing
is broken, the feature simply does nothing, and only an explicit "anything orphaned?" audit
catches it.

## When to apply

- Materialising peer-branch file content onto a shared branch without a worktree.
- Cherry-picking or `git show`-copying a feature between long-lived branches.
- Any "consolidate lane X onto branch Y" task — drive completeness from the workstream's
  WS todo, not from the set of source files you happened to copy.

## Adjacent

- [[passive-guidance-loses-to-artefact-gravity]] — the activating skill/rule IS the active
  layer; without it the code is passive guidance that never fires.
- [[substrate-pointer-read-as-current-state]] — "code carried, so consolidation complete"
  is a convenient completeness claim read off the wrong surface.
