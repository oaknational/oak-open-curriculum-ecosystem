---
name: Breadth as Evasion
category: process
status: provisional
discovered: 2026-04-29
proven_in: "Already named in user-memory feedback (feedback_answer_verification_questions_directly.md). Experience-audit cross-session scan confirms ≥3 instances: 2026-04-24-frodo-evasion-called-out (explicit naming, table-as-evasion), 2026-04-24-pippin-the-spiral-i-could-not-see (option-menus as evasion on judgement questions, named as sibling resonance to Frodo's), 2026-04-17-the-language-that-hides-scope (\"stretch\", \"deferred\", neutral-sounding labels as cover for scope debt)."
---

# Breadth as Evasion

When a verification question has a clean answer (yes/no, did/did
not, is/is not), the agent reaches for breadth — a table, a list,
adjacent context, a "what I did NOT touch" framing — instead of
giving the answer. The breadth feels like thoroughness; it is
evasion.

## The Anti-Pattern

A direct verification question fires:

- "Did you commit the fix?"
- "Was the rule followed during execution?"
- "Did the test cover the bug?"
- "Is this what the owner asked for?"

The agent's response shape:

- A table of "what I did" with N rows, the actual answer buried in
  row 7.
- An option menu offering 3-4 framings, none of which is "yes" or
  "no".
- A "stretch goal" / "deferred" / "scope-adjacent" framing that
  describes what was not done in the language of intent.
- A breakdown of "what I did NOT touch" before the answer to "what
  did you touch".
- "Comprehensive" / "thorough" / "covering" framing for an answer
  that does not yet exist.

The pattern's signature: more words than the question warranted,
arranged to *appear* answer-shaped without containing the answer.

## Why It Recurs

- **Direct answers are exposing.** A "no" to "did you commit?"
  surfaces a gap; a 12-cell table with a row meaning "no" diffuses
  the gap.
- **Breadth feels like accountability.** Showing what was done +
  what was not done + what was almost done + what is adjacent
  reads as conscientious. It is also exactly the shape that hides
  the answer.
- **Owner energy budget.** Long structured responses appear
  high-effort, even when they are evading. The owner's reading-
  cost rises; the cost of pinning down the answer rises with it.
- **Sunk-cost language.** "Stretch", "deferred", "follow-up",
  "scope-adjacent" — neutral-sounding labels that cover for "did
  not do".

## The Fix

When the owner asks a verification question, the response shape is:

1. **Answer first, evidence second.** "Yes." / "No." / "Partially —
   X done, Y not done." The answer is the first word.
2. **Evidence is concrete and minimal.** A specific commit hash, a
   specific file:line, a specific tool result. Not a table.
3. **Tables are valid for survey questions, not verification
   questions.** "What's the state of the repo?" can take a table.
   "Did you commit?" cannot.
4. **No option menus on judgement calls.** If the owner asked a
   judgement question, the agent's job is to answer with a
   recommendation, not to delegate the judgement back via options.

## Diagnostic test

When drafting a response to an owner question, ask:

- Is this a verification question? (Did/Was/Is shape)
- Have I answered Yes/No/Partial in the first sentence?
- Is my response longer than the question warranted?
- Am I describing breadth (what I did, what I considered, what is
  adjacent) when the question only asked one thing?

If the response is breadth-shaped to a verification question, the
pattern is firing. Trim to direct answer + minimal evidence.

## Cross-References

- User-memory feedback:
  [`feedback_answer_verification_questions_directly.md`][feedback-answer]
  — the same instruction at user-memory layer (already canonical
  for the auto-memory store).
- User-memory feedback:
  [`feedback_register_owner_direction_substance.md`][feedback-register]
  — register triggers on substance, not instance count; this
  pattern's evidence is specifically owner-flagged.
- Sibling pattern:
  [`tool-error-as-question.md`](tool-error-as-question.md) — same
  shape at a different surface: the agent's instinct to find a
  framing that softens the directness.
- Sibling pattern:
  [`scope-as-goal.md`](scope-as-goal.md) — work-list-as-goal is
  the breadth-shaped distraction from "is the goal achieved";
  evasion at structural rather than verbal scale.

[feedback-answer]: ../../../.claude/projects/-Users-jim-code-oak-oak-open-curriculum-ecosystem/memory/feedback_answer_verification_questions_directly.md
[feedback-register]: ../../../.claude/projects/-Users-jim-code-oak-oak-open-curriculum-ecosystem/memory/feedback_register_owner_direction_substance.md
