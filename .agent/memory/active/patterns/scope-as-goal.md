---
name: Scope as Goal
category: process
status: provisional
discovered: 2026-04-29
proven_in: "Verdant Regrowing Pollen TS6-closeout session — the agent treated the TS6 work-list as the goal because it was full and structured, when the actual goal was 'unblock the Vercel build investigation, branch absolutely not mergeable until Vercel builds with no errors and no warnings'. Owner reframe was the corrective. The session-end summary made the meta-observation that a release-readiness reviewer's 'GO WITH CONDITIONS' read as a green light only because arc-scope was conflated with branch-merge-gate-scope."
related_pdr: PDR-015
---

# Scope as Goal

The work-list is not the goal. A reviewer's verdict is scoped to the
prompt; if the prompt scope ≠ the goal scope, the verdict is silent
about the goal. Treating instrumental work as terminal because the
work-list is full and structured is the failure mode this pattern
names.

## The Anti-Pattern

A scope-as-goal session looks like this:

1. The agent has a structured work-list (a 7-commit plan, a 10-task
   list, a phase-N checklist).
2. The agent executes the work-list. Each item closes cleanly.
3. The agent dispatches a reviewer to gate the work. Reviewer reads
   the brief and answers within scope.
4. Reviewer says "GO WITH CONDITIONS" or "PASS"; agent reads as
   green light.
5. Agent prepares to land/merge.
6. Owner says: "this is not the goal. The goal is X. The branch is
   absolutely not mergeable until X."
7. Agent realises the work-list was instrumental — its purpose was
   to *unblock* the goal, not *be* the goal.

The work-list felt terminal because it was complete. The reviewer's
"GO WITH CONDITIONS" felt like merge readiness because it was
unconditional within its scope. Both readings are scope-bounded; the
goal was outside both scopes.

## Why It Recurs

Three reinforcing pressures:

1. **Work-list closure feels like progress** — and progress feels
   like getting closer to done. A full, ticking-down checklist
   produces an emotional signal that closure is at hand, even when
   the checklist's own scope is upstream of the goal.
2. **Reviewer scope is determined by the prompt** — the agent writes
   the prompt. If the prompt asks "is this arc done?", the reviewer
   answers "yes the arc is done." If the prompt asks "is this branch
   mergeable?", the reviewer evaluates the merge gate. The agent
   controls scope and may unconsciously narrow it.
3. **Goal drift under structure** — when work is broken down into a
   plan, the plan becomes the operating reality. The goal recedes
   into background context. Re-reading the goal at every commit
   boundary is the discipline that keeps the goal foregrounded.

## The Fix

When dispatching a reviewer to gate merge or completion:

- **Brief the reviewer with the full goal scope, not the work-list
  scope.** "We have completed the TS6 migration. Please gate merge to
  main: zero failing gates, zero warnings, all merge conditions
  named, and the underlying goal of 'Vercel builds clean' verified."
- **Re-read the goal at every commit boundary.** Before staging,
  pause and answer: "what is this commit moving us toward, and is
  that thing the goal or instrumental?"
- **Treat reviewer verdicts as scope-bounded artefacts.** A "GO WITH
  CONDITIONS" is a verdict on what was asked; never a verdict on
  what wasn't.
- **Notice the closure-as-progress signal.** If a work-list is
  ticking down cleanly and a reviewer is offering a conditional pass,
  that is the moment to ask "what is the *goal*, and have I asked
  about *that*?"

## Cross-References

- PDR-015 §"Brief reviewers with full merge-gate scope when gating
  merge" amendment (2026-04-29) — the doctrine layer.
- [`tool-error-as-question.md`](tool-error-as-question.md) — sibling
  pattern at the same session, same instinct: read what the surface
  is actually saying, not what the agent's frame expects it to say.
- PDR-018 §"Reviewer scope equals prompted scope" amendment
  (2026-04-29) — the planning-discipline expression of the same
  insight, framed for plan-driven sessions.
