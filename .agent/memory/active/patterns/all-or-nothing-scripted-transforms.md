---
name: "A Scripted Transform Is All-or-Nothing, With Asserts at the End"
polarity: pattern
category: process
use_this_when: "A change must be scripted rather than made with the Edit tool — a multi-site rewrite, a regex sweep, a batch of anchored replacements — and a partial application would leave the tree in a state nobody intended."
proven_in: "An all-or-nothing edit script (asserts before one write) converted a stale-anchor failure into ZERO damage during a PR-886 cure batch (2026-08-14); a survey lane adopted assert-on-anchor for every scripted replace after two silent no-ops surfaced only at gates the same day (2026-08-14); a Sonar-cure parcel's regex sweep over-reached twice in one hour — converting lines it had itself inserted and grep character classes, then splitting two already-quoted strings — and the end-of-script asserts refused the first write outright while shellcheck named the second, with pre-transform copies restoring both in one command (2026-09-01). Conserved in .agent/memory/active/archive/napkin-2026-09-02.md."
proven_date: 2026-08-14
related_patterns:
  - harness-shell-and-commit-edge-cases
  - prove-the-checker-with-a-negative-control
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "A scripted rewrite that applies partially, or silently no-ops on a stale anchor, leaves a half-transformed tree whose state nobody can describe — and the smoothness of a fifty-site regex is exactly the warning."
  stable: true
---

> **POLARITY: PATTERN.** This entry names a *shape to repeat*, not a
> failure mode to avoid.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern)
> for the polarity discipline.

## The boundary first: most edits are not scripted

The Edit tool is the right instrument for a single-site edit: it anchors on
exact text and fails safe on a mismatch. A Bash-hook workaround must never
generalise into scripted file editing (owner correction 2026-09-02,
verbatim: "why are you writing python to edit files?"). This pattern
governs the remainder — transforms that are genuinely multi-site or
mechanical, where a script is the honest instrument.

## The shape

1. **Save pre-transform copies** of every file the script will touch, in
   the session scratchpad — never a git overwrite; restoring from the copy
   costs one command and no history.
2. **Anchor every replacement exactly** and **assert on the anchor**: a
   replacement whose anchor is absent is a failure, never a silent no-op.
   Two silent no-ops in one day surfaced only at gates — a scripted replace
   missed a prettier-reflowed import, and a second missed a knip-unexported
   type (2026-08-14).
3. **Assert at the END, not per edit, and write nothing until every assert
   passes.** The all-or-nothing form converts a stale-anchor failure into
   zero damage: the script that found one anchor missing wrote nothing
   (2026-08-14). Per-edit asserts leave a half-applied tree behind the
   first failure.
4. **Read the result as a first-time reader** before the commit — a regex
   that over-reaches converts lines it inserted itself (the `[ … ]` to
   `[[ … ]]` sweep that re-converted its own output and mangled `[: ]`
   character classes, 2026-09-01).

## The tell

The smoother a large mechanical rewrite arrives, the harder the look: the
fifty-site regex "clean refactor" was the warning, not the confirmation
(metacognition §Fluency). A transform that cannot be made all-or-nothing is
too big for one script; split it at a seam where each part can be.

## Related

- [`harness-shell-and-commit-edge-cases`](harness-shell-and-commit-edge-cases.md)
  — a hook-blocked compound command loses ALL its steps, the sibling
  partial-application hazard.
- [`prove-the-checker-with-a-negative-control`](prove-the-checker-with-a-negative-control.md)
  — the asserts are the transform's negative control.
