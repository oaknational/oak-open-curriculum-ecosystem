---
name: "Actuate a Mechanism in the Same Breath You Commit to It"
polarity: pattern
use_this_when: "About to say 'I'll watch X' / 'I'll run the gate' / 'the loop will close' / 'I'll monitor the PR' — any committed intent to run a mechanism."
category: process
proven_in: "2026-06-21 (Cutter); recurs across watcher/heartbeat/gate arming"
proven_date: 2026-06-21
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Letting a STATED intent to run a mechanism stand in for the running mechanism — a documented intent is inert; nothing is actually watching, gating, or closing the loop."
  stable: true
---

> **POLARITY: PATTERN.** "I'll watch X" arms nothing. A committed intent
> is inert until the mechanism is actually running.

## The shape

When you commit to running a mechanism — a watcher, a heartbeat cron, a
gate, a monitor, a follow-up loop — **arm the actual mechanism in the
same action**. Never let the sentence stand in for the process, and
never defer actuation to a future turn ("I'll start it next time").

## The cure

The test is observable: is there a running background task / armed cron /
emitted artefact right now? If the only evidence is a sentence you wrote,
the mechanism is not running. Sibling:
[`feedback_run_the_thing_dont_flag_the_gap`], [`wrapped-exit-codes-false-green`](wrapped-exit-codes-false-green.md).
