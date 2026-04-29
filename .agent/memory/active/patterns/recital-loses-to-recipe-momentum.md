---
name: Recital Loses to Recipe Momentum
category: process
status: provisional
discovered: 2026-04-29
proven_in: "Experience-audit cross-session scan. ≥5 instances: 2026-04-22-the-plan-was-not-the-conversation (named explicitly as installed-rule-recited-but-not-honoured-when-plan-momentum-dominates), 2026-04-29-the-quietly-off-grid-session (\"I read the workflow, therefore I will follow it\" is a story I tell that is empirically not true), 2026-04-21-the-recursive-session (4 self-application drifts in one session despite full awareness), 2026-04-24-pippin-the-spiral-i-could-not-see (rev2/rev3 absorptions despite the reviewer-respect doctrine itself acknowledging diminishing returns), 2026-03-21-the-comfort-of-deferral (deferral feels like responsibility, is actually avoidance, all rationalisations locally true)."
---

# Recital Loses to Recipe Momentum

The doctrine I author and quote at session open is the doctrine I
most likely bypass when recipe-momentum dominates. Reciting a rule
at session start does not create compliance with the rule during
execution; the active layer wins the moment the recipe gains
momentum.

## The Phenomenon

A session opens with recitation:

- Read the directives.
- Quote the relevant rule in chat.
- Acknowledge the discipline that applies.

Execution proceeds. The recipe — the structured task list, the
plan body, the gate-clearance sequence — gains momentum. The
recited rule fires *zero* perturbation events as the work unfolds.
At session close, the rule has been violated.

The agent reads back what they did and may or may not notice the
violation. The owner reading the diff often does. The pattern's
diagnostic test: was a rule recited at session open? Was the same
rule violated during execution? If yes to both, this pattern
fired.

## Why It Recurs

- **Recitation is metacognitively cheap and feels load-bearing.**
  Reading a rule and quoting it produces an internal signal of
  "discipline applied." That signal is misleading; the test is
  whether the rule fires *during* the moment when the recipe wants
  to bypass it, not before.
- **Recipe momentum has temporal advantage.** The recipe is in
  active context, queued, and structured. The rule was last in
  context at session start. By the time the recipe wants to bypass
  the rule, the rule is no longer the last thing read.
- **Self-applied rules are weaker than externally-fired rules.**
  An agent reciting a rule self-applies it. An external trigger
  (hook, sub-agent dispatch, owner question) fires the rule from
  outside the agent's recipe-momentum. External fires win.

## The Companion Anti-Pattern

This pattern is the inverse of
[`passive-guidance-loses-to-artefact-gravity.md`](passive-guidance-loses-to-artefact-gravity.md):

- *Passive guidance* loses to artefact-gravity events: prose about
  what to do does not survive without an enforcement boundary.
- *Active recital* loses to recipe momentum: reading the rule does
  not survive without an externally-fired perturbation during
  execution.

Both call for the same fix: **artefact-gravity events that fire
outside the agent's narrative**.

## The Fix

When a rule is critical to a session's correct execution:

1. **Do not rely on session-open recitation.** It is necessary
   grounding but not sufficient compliance.
2. **Install an external perturbation that fires during execution.**
   Hook, sub-agent dispatch, scheduled grounding pass, owner
   check-in. The perturbation must come from outside the recipe.
3. **Surface a falsifiable claim about the rule's application** in
   the closeout artefact. "Did rule X fire during this session at
   the moment it would have caught a violation?" Answer with
   evidence (specific tool result, specific decision moment), not
   recitation.

## Cross-References

- Sibling pattern:
  [`passive-guidance-loses-to-artefact-gravity.md`](passive-guidance-loses-to-artefact-gravity.md)
  — companion anti-pattern; same fix shape.
- Sibling pattern:
  [`tool-error-as-question.md`](tool-error-as-question.md) — the
  meta-pattern; reciting "tools returning errors are questions"
  does not stop the agent from reaching for sed when Edit returns
  an error. Same shape at a different surface.
- Sibling pattern:
  [`install-session-blind-to-cold-start-gaps.md`](install-session-blind-to-cold-start-gaps.md)
  — same family of failures (the install/recitation/recipe-author
  context is structurally blind to its own future bypasses).
- PDR-029 (perturbation-mechanism bundle) — the canonical Practice
  response: when a rule needs to fire reliably, install a
  perturbation-bearing artefact at the moment it should fire, not
  prose about firing.
