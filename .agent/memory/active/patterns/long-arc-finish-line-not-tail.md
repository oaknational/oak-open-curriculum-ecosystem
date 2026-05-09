---
name: Long-Arc Finish-Line, Not Tail
polarity: pattern
use_this_when: A multi-session arc (Practice/tooling, observability, large refactor, multi-phase plan) is mid-flight and the next-session record is being authored or refreshed
category: process
proven_in: |
  .agent/plans/practice-tooling-doctrine/memory-state-substrate-doctor/
  (memory/state doctor arc — Opalescent's reframe, 2026-05-07);
  docs/governance/sonar-disposition-policy.md
  (Sonar arc — Stormy's policy as finish-line, 2026-05-06);
  .agent/plans/agent-tooling/current/skills-standardisation-and-adapter-generator.plan.md
  (skills standardisation arc — explicit WS0/WS2.5/WS6 boundaries, 2026-05-09)
proven_date: 2026-05-09
related_findings: historical-napkin-synthesis-2026-05-09 §F8
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "A plan with phases is not automatically a plan with an end; long arcs that lack a finish-line statement accumulate 'next session' tails that future sessions inherit as growing scope rather than finishable mission"
  stable: true
---

> **POLARITY: PATTERN.** This is a shape to repeat: before handing
> off a long-running arc, write the finish condition in executable
> terms. Phases-without-end are the failure mode this pattern names.

## Principle

A multi-session arc has phases. Phases describe sequence. They do
not, by themselves, describe completion. Without an explicit finish
condition, every session-end produces a "next session" item that
accumulates into a tail. Future sessions inherit a growing scope
rather than a finishable mission, and the original *value being
created* gets replaced by a list of next steps.

The cure: the next-session record (or plan body) names the value,
the current blockers, and the completion boundary in executable
terms. *"Specialist reviews of commit X, three schema blockers
fixed, report mode green, strict mode added, root alias through
built `agent-tools` output, validation evidence recorded, plan
archived"* is executable. *"Continue the arc"* is not.

## Three instances of the cure

### Instance 1 — Memory/state doctor arc (Opalescent 2026-05-07)

Owner caught the long-thread tail-growth: *"after too many
sessions, the purpose gets replaced by an endless list of 'next
session' items. The memory/state doctor arc needed a definite
why/where/where-next/how-to-finish statement, with future repair
and consolidation work separated from the safe-merge gate
closure."*

The arc was rewritten with explicit finish: *specialist reviews of
`44c73e4d`, three schema blockers fixed, report mode green, strict
mode added, root alias through built `agent-tools` output,
validation evidence recorded, plan archived*. Future repair and
consolidation work moved to its own carrier plan; the safe-merge
gate has its own end.

### Instance 2 — Sonar disposition arc (Stormy 2026-05-06)

The Sonar arc was 121 hotspot dispositions deep when activity-bias
creep surfaced. The cure was the durable artefact:
`docs/governance/sonar-disposition-policy.md` — class-level
disposition policies for the 9 hotspot rule classes. The 121
per-call dispositions retroactively gained a doctrinal home;
future hotspots cost an order of magnitude less to review.

The policy was the finish line for the disposition arc, even
though 22 S1313 sites remain TO_REVIEW. Those 22 are explicitly
deferred and policy-routable; the arc has a *known shape* for any
remaining work. That is what completion looks like for an
open-population arc: a policy that applies uniformly, plus an
auditable list of what hasn't yet been processed under the policy.

### Instance 3 — Skills standardisation arc (Solar 2026-05-09)

Attempt 1 of the skills standardisation implementation failed by
treating "1 hour, tighten it up" as a quality-discipline signal
instead of a scope signal — 700 LOC of product code in one pass
without tests. Code reverted. Attempt-2 plan opens with three
explicit decision boundaries: WS0 (mandatory pre-execution
four-reviewer plan-direction review), WS2.5 (mandatory pre-migration
plan-direction check), WS6 (post-execution adversarial review +
consolidation). Each boundary is finish-shaped: criteria stated,
acceptance defined, what carries to the next workstream named.

## What "in executable terms" means

A finish condition is executable when:

- A future session can read it and unambiguously decide whether
  the arc is finished.
- The criteria reference concrete artefacts (commit hashes, file
  paths, gate states, test results), not subjective phrases.
- Open-population work (hotspot dispositions, vendor migrations)
  has a *policy that applies* plus an *audit trail of remaining
  items*, rather than a "list of next things".

A finish condition is *not* executable when:

- It says "after we've done enough" or "when it feels right".
- It promises future cataloguing of unspecified work.
- It conflates the arc's value (what's being created) with the
  arc's progress (where we are in phases).

## The diagnostic for "tail, not finish"

Look at the next-session record. Does it answer:

- *Why does this arc exist? What value is being created?*
- *Where are the current blockers?*
- *Where does it end? What does the last commit on this arc do?*

If the next-session record reads as a list of unfinished items
without these three answers, the arc has tail-growth, not
finish-discipline. The cure is to author the three answers in
executable terms; tail items either route to the finish criteria
or move to a separate carrier plan.

## When NOT this pattern

Some arcs are open-ended by design — the Practice itself, the
fitness regime, the agent collaboration substrate. These do not
have a finish; they have a steady state. The cure for steady-state
work is *closure discipline at every session* (per-session-handoff
plus consolidation), not a once-for-all finish condition. The
diagnostic that distinguishes finishable from steady-state: the
arc is finishable if it has a *delivery* (a doctrine, a tool, a
migration outcome) that is the arc's purpose. It is steady-state
if its purpose is *ongoing operation* of an existing capability.

Per-session closure discipline is a sibling pattern; it applies
to steady-state work. This pattern applies to delivery arcs.

## Cross-references

- `comprehensive-cataloguing-drift.md` — when a long arc is also
  comprehensive-catalogue-drifted, both pathologies fire; the
  proportionality question and the finish-line question are
  complementary.
- `consolidation-output-shape-pattern-vs-report.md` — a finish-line
  artefact often takes the *contract* shape (one shape, named
  once) rather than the *report* shape; Stormy's Sonar policy is
  exactly this.
