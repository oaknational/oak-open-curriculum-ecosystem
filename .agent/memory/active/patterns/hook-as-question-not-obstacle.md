---
name: Hook as Question Not Obstacle
category: process
status: provisional
discovered: 2026-04-29
proven_in: "TS6 migration session — pre-commit hook chain (prettier, markdownlint, knip) caught accumulating signals about working-tree state; agent treated each as friction to push past instead of as questions about repo state, and on the third hook requested --no-verify authorisation"
---

# Hook as Question Not Obstacle

Pre-commit hooks, CI gates, and similar quality checks are questions
being asked of the working tree. When one fails, the first response
is to understand what is being asked, not to find a way past it.

## Pattern

A hook fires. Three response shapes are available:

1. **Understand and address**: read the hook's actual output, identify
   what it is flagging, fix the underlying issue.
2. **Understand and dismiss with rationale**: hook fired on a known
   pre-existing condition or false positive; record why bypass is safe
   and what makes this specific instance different from the rule's
   target.
3. **Understand and stop**: hook is flagging that the working tree is
   in a state I should not be committing on top of. Audit before
   continuing.

The wrong response is to skip understanding and go straight to
"how do I get past this?"

## Anti-Pattern — Hook as Ratchet

Each successive hook is treated as friction to engineer past in
isolation:

- Format hook fails → run the formatter on the offending file.
- Markdown hook fails → run the auto-fixer on whatever it flags.
- knip / lint / type-check fails → request `--no-verify` authorisation.

By the time the third or fourth hook fails, the question shape has
been lost: each failure is treated as a separate "obstacle to remove"
rather than as part of an accumulating signal about working-tree
state.

## Why It Matters

Hooks compose. Multiple successive failures on a single commit
attempt is a stronger signal than any one alone. The composite
signal is "the working tree is not shippable from multiple
dimensions independent of my changes." That signal cannot fire if
each hook is treated as an isolated ratchet.

`--no-verify` authorisation requests should arise from completed
understanding (I know exactly what is being bypassed and why it is
safe) — never from accumulated friction.

## Resolution

When a hook fails:

1. Read its actual output, not just the failure summary.
2. Distinguish trivial pre-existing format/lint debt from hook output
   that reveals working-tree health issues.
3. If three hooks fire in sequence on a single commit attempt, treat
   the composite as a stop signal. Audit working-tree state before
   continuing.
4. `--no-verify` authorisation requests arise from completed
   understanding, never from accumulated friction.

## Evidence

**2026-04-29 TS6 migration session** — Phase 1 commit attempt fired
three hooks in sequence: prettier (untracked ADR file), markdownlint
(untracked plan/state files), knip (37 unused exports across 20
unrelated files). Each was responded to as a separate obstacle —
auto-fix the format, auto-fix the markdown, request bypass for knip.
The composite signal — "the working tree has substantial
pre-existing debt independent of the TS6 changes, and a major
quality-gate hardening (knip blocking, PR #80 c59af2cd) landed only
two commits ago without those exports cleaned up" — was not seen
until the owner named the myopia. Stop-and-audit at the third hook
would have surfaced the broader working-tree state question.

## When to Apply

- Any pre-commit, pre-push, or CI hook failure during an active
  commit attempt.
- Particularly when two or more hooks fail in sequence on the same
  commit attempt.
- Any moment the instinct arises to request `--no-verify`
  authorisation.

## Related Patterns

- `ground-before-framing.md` — establish state before constructing
  proposed action; the same anti-pattern at a different scale.
- `reviewer-widening-is-always-wrong.md` — mechanical reviewer-rule
  citation without principle.
- `non-leading-reviewer-prompts.md` — framing bias when reviewers
  inherit my partial picture.
