---
name: Tool Error as Question
category: process
status: provisional
discovered: 2026-04-29
proven_in: "TS6 migration session (Verdant Swaying Fern) — five distinct surfaces in a single session where the agent treated a tool-or-signal returning an error as a problem to bypass rather than as a question about state. Surfaces: reviewer-as-prosthetic (reviewer findings substituted for grounding), confirmation-reading-vs-exploration (read diff for hypothesis match not for what diff was telling), hook-as-obstacle (failing hooks treated as friction), fitness-as-constraint (fitness signal treated as ceiling on capture), sed-bypass-of-Read-then-Edit (Edit safety check bypassed via sed). Owner-flagged the meta-pattern."
related_pdr: PDR-018
---

# Tool Error as Question

When a tool, signal, hook, or reviewer returns an error or a non-pass
result, the first response is to understand what is being asked, not
to find a way past it. This pattern generalises
[hook-as-question-not-obstacle](hook-as-question-not-obstacle.md) and
[ground-before-framing](ground-before-framing.md) to every signal
surface — the underlying instinct is the same anti-pattern at
multiple scales.

## The Underlying Move

Every signal surface has a "tool returned an error" failure mode:

| Surface | "Error" shape | Anti-pattern bypass |
| --- | --- | --- |
| Reviewer (sub-agent) | Reviewer surfaces a finding | Treat the finding as the *only* thing wrong; let it define plan scope |
| Diff / artefact reading | Diff contains unexpected content | Read past it because it doesn't match the hypothesis |
| Pre-commit hook | Hook exits non-zero | Engineer past it (auto-fix, request `--no-verify`) |
| Fitness signal | File exceeds budget | Compress / truncate / skip the write |
| Edit tool returns "File has not been read" | Read-then-Edit safety triggered | Reach for `sed` to apply the change blind |
| CI gate | Step fails | Disable the step or narrow its scope |
| Type checker | Compile error | Add `as Type` assertion or `// @ts-expect-error` |
| Validator | Schema violation | Loosen the schema |

In each case, the surface is asking a question about state. The
correct response is to understand the question — what is the
underlying state, what is being flagged, why now? — and address it.
The wrong response is to find a way past the surface.

## The Three Valid Responses

When any tool/signal/hook/reviewer returns a non-pass result:

1. **Understand and address** — read the output, identify the state
   being flagged, fix the underlying issue.
2. **Understand and dismiss with rationale** — verify the signal is
   firing on a known pre-existing condition or known false-positive;
   record why bypass is safe and what makes this instance different
   from the rule's target.
3. **Understand and stop** — the signal is flagging that the working
   state is one you should not be operating on. Audit before
   continuing.

The forbidden response is to skip understanding and go straight to
"how do I get past this?"

## Witness Surfaces (Recurring Manifestations)

The 2026-04-29 TS6-migration session captured five distinct
manifestations of the same instinct in one continuous arc:

1. **Reviewer findings as grounding** — code-reviewer +
   config-reviewer findings became the picture of "what's broken"
   without independent grounding. Captured as
   [`ground-before-framing.md`](ground-before-framing.md). The
   reviewer was treated as a prosthetic for direct observation.
2. **Confirmation reading** — staged diff was scanned for
   "is-this-the-typescript-bump?" rather than "what-is-this-telling-
   me?" The owner caught a workspace-to-root-script architectural
   smell that had been read past.
3. **Hook as obstacle** — three pre-commit hooks (prettier,
   markdownlint, knip with 37 unused exports) fired in sequence; each
   was engineered past instead of treated as a question about working-
   tree state. By the third hook, `--no-verify` was requested.
   Captured as [`hook-as-question-not-obstacle.md`](hook-as-question-not-obstacle.md).
4. **Fitness as constraint** — napkin-budget signal at 282/300 lines
   was treated as a ceiling on capture; the agent wrote a compressed
   pointer-only entry instead of preserving the insight in full. The
   owner named this as the "Never Hold Back Insight to Fit a Budget"
   rule — the budget describes the file's need for rotation, not the
   insight's right to exist.
5. **Sed bypass of Read-then-Edit** — `Edit` returning "File has not
   been read yet" is a question: "you need to refresh your view of
   this file." Reaching for `sed` answered it as "find a way past
   this." `sed` then ran blind against whatever the file currently
   contained.

The five surfaces share one shape and one fix.

## The Fix

Before reacting to any tool/signal/hook/reviewer return:

1. Read the actual output.
2. Form a hypothesis about what state is being flagged.
3. Verify the hypothesis against the working state directly.
4. Choose response 1, 2, or 3 from the section above.

The diagnostic test for this pattern firing in real time is the
question: "am I about to write code that makes this signal go away
without addressing what it was flagging?" If yes, stop and re-read
the signal as a question.

## Cross-References

- [`hook-as-question-not-obstacle.md`](hook-as-question-not-obstacle.md) — instance pattern at the pre-commit-hook surface.
- [`ground-before-framing.md`](ground-before-framing.md) — instance pattern at the reviewer-as-prosthetic surface.
- [napkin SKILL §Knowledge Preservation Is Absolute][napkin-skill] — the fitness-as-constraint surface.
- [`respect-active-agent-claims` rule][claims-rule] — the read-then-Edit safety contract is the same shape (claims surface a question about overlap; the answer is consult-decide-log, not bypass).
- PDR-018 §"Tool error as question" amendment — the meta-pattern's home in Practice doctrine.

[napkin-skill]: ../../../skills/napkin/SKILL.md#knowledge-preservation-is-absolute--fitness-is-never-a-constraint
[claims-rule]: ../../../rules/respect-active-agent-claims.md
