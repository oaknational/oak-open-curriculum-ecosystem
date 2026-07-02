---
name: "Process With No Committed Assets"
polarity: anti-pattern
use_this_when: "A stretch of work is producing deliberation, coordination, plans-about-plans, or doctrine-about-doctrine — and no committed product, test, or homed-knowledge asset has landed."
category: process
proven_in: "v2 large-corpus-analysis kept candidate C33 (2026-06-30), lived the same session it was discovered: the run proved its method and produced a verdict while the discovered knowledge sat un-homed until the owner asked 'have the napkins actually been processed?'"
proven_date: 2026-06-30
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Meta-activity (deliberation, ceremony, plans creating plans, doctrine creating doctrine) manufacturing a feel-state of progress while the goal variable never moves — invisible to every commit-based meter."
  stable: true
---

> **POLARITY: ANTI-PATTERN.** Activity that commits nothing moves nothing —
> and no meter will tell you, because the meters read commits.

## The failure mode

Process and coordination activity — deliberation, ceremony, planning the
plan, writing doctrine about writing doctrine — produces a genuine feel-state
of progress and completion while the actual goal variable (shipped behaviour,
homed knowledge, a landed test) never moves. It is doubly dangerous because
it is **invisible to commit-based meters**: the session looks busy, the diff
is empty, and nothing external contradicts the feel-state.

## The screen

At any natural checkpoint ask: *what committed asset did this stretch land —
product code, a test, a homed piece of knowledge, a decided register entry?*
If the answer is "a better plan for the plan" more than once in a row, the
meta-trap is live: stop, land the smallest real asset, then resume.

## Related

- [`feel-state-of-completion-preceding-evidence-of-completion.md`](feel-state-of-completion-preceding-evidence-of-completion.md)
  — the same feel-state at the completion end.
- [`monotonic-counter-is-not-quality-indicator.md`](monotonic-counter-is-not-quality-indicator.md)
  — activity counters cannot stand in for the goal variable.
- [`mechanical-sequence-is-activity-bias-diagnostic.md`](mechanical-sequence-is-activity-bias-diagnostic.md)
  — the busy-loop tell at the tool-call grain.
