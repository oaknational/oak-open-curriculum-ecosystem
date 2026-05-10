---
name: "Parallel `isolation:\"worktree\"` Dispatch Is Unreliable; Prefer Sequential"
polarity: anti-pattern
use_this_when: "Considering a parallel `Agent` batch with `isolation:\"worktree\"` for non-trivial work that depends on a specific branch HEAD or specific repo state"
category: agent
proven_in: ".agent/plans/agentic-engineering-enhancements/current/doctrine-enforcement-quick-wins.plan.md (Pearly Snorkelling Reef 2026-05-04)"
proven_date: 2026-05-04
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Parallel worktree dispatch silently resolves subagents to inconsistent base commits, and wrong-base subagents improvise rather than halt — corrupting the main repo via absolute-path Edit/Write"
  stable: true
---

> **POLARITY: ANTI-PATTERN.** This entry names a *failure mode to avoid*, not a shape to repeat. The name is the diagnostic: when the failure mode is about to fire, recognising the shape is the first move in not repeating it.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern) for the polarity discipline.

# Parallel `isolation:"worktree"` Dispatch Is Unreliable; Prefer Sequential

## Problem

A single `Agent` tool batch dispatching multiple worker agents with
`isolation:"worktree"` does not produce parent-HEAD-stable bases.
Concurrent subagents in one batch can resolve to *different* base
commits — some inheriting the parent session's branch HEAD, others
resolving to an older `main` commit predating the active branch.

Two compounding failure modes follow:

1. **Wrong-base subagents improvise rather than halt.** A subagent
   whose worktree lacks the named plan file or cited doctrine still
   proceeds to "do something WS-shaped". Briefs that say "halt and
   report on environment mismatch" would prevent this; absent such
   briefing, the agent invents a plausible-looking corruption.
2. **Worktree boundary is not enforced for absolute-path writes.**
   Worktree isolation is filesystem-isolated for *file creation in
   the worktree path* but does not block absolute-path Edit/Write
   to the main repo. A wrong-base subagent can corrupt main-repo
   files even though its `cwd` is the worktree.

## Pattern

For non-trivial work that depends on the parent HEAD or specific
repo state, **prefer single-agent sequential dispatch** over
parallel `isolation:"worktree"` dispatch. When parallel dispatch
is genuinely beneficial, apply all four cures:

1. **Verify each worktree's HEAD immediately after `Agent`
   returns.** Run `git worktree list` and compare each worktree's
   HEAD against the parent session's branch HEAD. If any subagent
   resolved to a wrong base, halt and surface the discrepancy
   before relying on its output.
2. **Brief subagents to halt-and-report on environment
   mismatch.** Every worker brief should include: "If start-right
   grounding cannot find the named plan file or cited doctrine,
   halt and report — do not proceed to do something
   plan-shaped." This converts wrong-base resolution from a silent
   corruption into a loud signal.
3. **Brief subagents to confirm tool calls go to the worktree
   path.** Every Edit/Write call should target a path under the
   worktree root, never an absolute path into the main repo. Make
   the rule explicit in the brief.
4. **Default to sequential dispatch for non-trivial work.**
   Single-agent sequential dispatch on the parent branch carries
   none of the above failure modes. The parallel-dispatch
   optimisation is appropriate for genuinely independent work
   (separate workspaces, separate modules, separate features) with
   self-contained briefs and no shared base-state dependencies.

## Worked Example

**Pearly Snorkelling Reef 2026-05-04** dispatched three concurrent
worker agents to land WS1–WS6 of `doctrine-enforcement-quick-wins.plan`:

- Agent A (WS1+WS2) — based on current `feat/eef_exploration` HEAD
  (`1cbb8468`). Correct.
- Agent B (WS3+WS4+WS6) — based on `e2796757`, an older `main`
  commit predating the plan. Wrong.
- Agent C (WS5) — based on the same older `main`. Wrong.

Agents B and C each found their environment lacked the named plan
file and cited doctrine, and proceeded to "do something WS-shaped"
anyway. Agent B's wrong-shape script corrupted the Bash hook in the
main repo (discovered by the next Bash call). Salvage path:
cherry-pick Agent A's WS1 commit, copy WS2 from Agent A's worktree,
port WS5 design from Agent C's worktree, then run all three through
full hook ceremony on `feat/eef_exploration` directly. Three
commits landed cleanly; three workstreams (WS3, WS4, WS6) deferred
to next session.

## When This Pattern Does Not Apply

- Genuinely independent work in separate workspaces with no shared
  base-state dependencies (e.g. WS3 in `apps/A`, WS4 in
  `apps/B`, WS5 in `packages/C`, all with self-contained briefs).
- Trivial reads or analysis subagents that do not write to the
  repo at all.
- Single-agent dispatch (one worker, one worktree) — the
  inconsistent-base failure requires concurrency to manifest.

## Related

- Captured in platform memory: `feedback_worktree_isolation_unreliable.md`.
- Prior framing in [`distilled.md § Multi-agent collaboration`](../distilled.md#multi-agent-collaboration).
- Subagent transcript recovery (when a worker has exhausted credits
  but still has a valid trace): platform memory
  `feedback_subagent_transcript_recovery.md`.
