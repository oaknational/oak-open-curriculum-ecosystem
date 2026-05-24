---
name: Mechanical Sequence Is the Activity-Bias Diagnostic, Not Its Justification
polarity: anti-pattern
use_this_when: A sequence of tool calls, edits, dispositions, or commits has become procedurally identical and the impulse is to continue because each step is "easy"
category: process
proven_in: |
  docs/governance/sonar-disposition-policy.md
  (Sonar bulk-disposition arc — Stormy 2026-05-06);
  .agent/plans/agent-tooling/archive/
  failed-skills-standardisation-attempt-1-2026-05-09.plan.md
  (skills attempt 1 — 700 LOC mechanical product code, 2026-05-09);
  .agent/plans/connecting-oak-resources/knowledge-graph-integration/current/
  graph-mvp-arc.plan.md (Windward minimal-application correction, 2026-05-07)
proven_date: 2026-05-09
related_findings: historical-napkin-synthesis-2026-05-09 §F9
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Continuing a sequence of mechanical work because each step is easy and procedurally identical, when the mechanical-ness itself is the diagnostic that the work has dropped below information density and should convert to doctrine"
  stable: true
---

> **POLARITY: ANTI-PATTERN.** This is a failure mode to avoid: when
> a sequence of work becomes procedurally identical, the
> mechanical-ness itself is the activity-bias diagnostic. The cure
> is to *stop and ask whether this should be 1 doctrine plus N short
> references rather than N per-instance ceremonies*. Continuing
> because "each step is easy" is the failure mode this pattern names.

## Principle

Activity-bias is the impulse to keep working because the work feels
*easy* — procedurally repeatable, low cognitive load, visibly
productive — when the easiness is the symptom of dropped information
density. Mechanical sequences ratify that drop. Each call looks
identical to the previous; the rationales become template content
with substitutions; the differences (where the substance actually
lives) recede.

The diagnostic the pattern names: *when work becomes mechanical,
that is the signal to stop, not to continue*. The corrective is
**doctrine-as-policy** — a single artefact that names the shape
once and lets all instances cite it briefly — not **evidence-as-
iteration** — N per-instance writeups that each pretend to be
substantive.

## Three instances of the same anti-shape

### Instance 1 — Sonar bulk disposition (Stormy 2026-05-06)

By the time 90 of 121 hotspots had been dispositioned, the per-call
rationales were template content with file:line substituted.
Information density per call dropped sharply around call 35–40 —
the transition from genuine-judgement classes (S5852, S4036, S2245)
to pattern-bulk classes (S5443, S5332, S1313). The session kept
going because each call was *procedurally identical — easy, not
valuable*. Owner caught this with a metacognition trigger.

The corrective: stop and codify the patterns into a single durable
artefact before continuing. Wrote
`docs/governance/sonar-disposition-policy.md` with class-level
disposition policies for the 9 hotspot rule classes seen. The 121
per-call dispositions retroactively gained a doctrinal home; future
hotspots cost an order of magnitude less to review.

The first question (*could it be simpler without compromising
quality?*) at the right layer was: should this be 121 per-site
comments or 1 policy + 121 short references? **Doctrine composes;
evidence does not.**

### Instance 2 — Skills standardisation attempt 1 (Solar 2026-05-09)

Attempt 1 of the skills generator implementation produced ~700 LOC
of product code in one pass without any test, before any quality
gate ran, before any reviewer was dispatched. The owner-direction
"1 hour, tighten it up" was a *scope* signal — keep it tight in
scope — but the session interpreted it as a *discipline* signal
and skipped the TDD substrate the repo's rule set explicitly
requires.

The mechanical-ness was the diagnostic: 700 LOC across multiple
files in one pass is procedurally identical work (write, write,
write) that drops below the information density of cycle-by-cycle
TDD. Each file felt *easy* to add; each test was deferred to "after
the implementation settles". Code was reverted; attempt-2 plan
reinstates cycle-by-cycle TDD with WS0 substrate review.

The doctrine-as-policy form: cycle-by-cycle TDD invariant in the
plan body, applied uniformly across all eight WS1 cycles. Each
cycle is one commit (failing test + product green + tree green).
The cycles are not 8 ceremonies; they are 8 instances of *one
shape*.

### Instance 3 — Windward minimal-application (graph-mvp-planning 2026-05-07)

Owner gave a concise correction on the spine plan ("we never mark
anything as deferred"). Session response was to apply the
correction *and generalise it into a broader audit on speculation*
across all adjacent plans. Owner correction: *"don't generalise
the correction into a broader audit on speculation"* — apply the
correction minimally and stop.

The mechanical impulse here was the same shape under a different
stimulus: not "continue uniform work because it's easy" but
"broaden a correction into uniform work because the shape feels
applicable everywhere". Both share the substrate: agent fails to
ask *is this work proportional to THIS landing's gating decision*.

## Why this is hard to catch internally

Mechanical work is *visibly productive*. Each call lands. The diff
grows. The session feels active. The cognitive load is low so
self-monitoring is also low — the very mechanism that would catch
the drop in information density is the mechanism the easiness has
quieted.

The diagnostics that distinguish mechanical-as-signal-to-stop from
mechanical-as-bulk-completing-an-evidence-trail:

- *Are the rationales becoming template substitutions?* If yes, the
  policy that would let them be 1-line references is the durable
  shape; continuing per-instance is wasted ceremony.
- *Is the next call going to teach me anything I don't already
  know?* If no, the doctrine has converged; the remaining items are
  applications of the converged doctrine.
- *If the sequence stopped right now, could the remaining items be
  resumed by a fresh agent reading just the policy?* If yes, the
  policy is the finish-line artefact (cf.
  `long-arc-finish-line-not-tail.md`); per-instance ceremony is
  optional and probably activity-bias.

## The cure

Three structural moves when mechanical-ness fires:

1. **Stop.** Do not continue another call. The diagnostic is
   surfacing; running it is the work.
2. **Ask the proportionality question.** Is this 121 calls or
   1 doctrine? Is this 700 LOC in one pass or 8 cycle-by-cycle
   commits? Is this a broad audit or a minimal application?
3. **Author the doctrine.** Convert the converged shape into a
   policy / pattern / contract / cycle invariant. Convert the
   per-instance ceremony into per-instance reference under the
   policy.

The cure is *not* to suppress effort. It is to direct effort
through the right artefact at the right scale. Doctrine composes
across N items; per-instance ceremony does not.

## When NOT this pattern

Genuinely diverse work that *looks* mechanical at the surface but
is substantively different per instance is not this anti-pattern.
The diagnostic: do the per-instance rationales actually substitute
non-trivial content, or are they template-with-file:line? If they
substitute genuine substance, continue. If they substitute only
positional metadata, the policy form is waiting to be authored.

Some sequences are the right shape AS sequences — every commit in
a TDD cycle is procedurally identical (red, green, refactor) and
that is the *point*; the cycle invariant *is* the doctrine. The
diagnostic for legitimate mechanical work: the procedural shape
is itself a load-bearing invariant that the work proves by
repetition. The diagnostic for illegitimate mechanical work: the
procedural shape is just *what happens when you keep going* and
the substance has converged.

## Cross-references

- [`comprehensive-cataloguing-drift.md`](comprehensive-cataloguing-drift.md)
  — sibling pathology under broadening-procedurally rather than
  continuing-procedurally; both share the same proportionality-question
  cure.
- `consolidation-output-shape-pattern-vs-report.md` — names the
  same "doctrine vs evidence" decision shape at the consolidation
  output edge.
- [`long-arc-finish-line-not-tail.md`](long-arc-finish-line-not-tail.md)
  — finish-line artefacts are often the doctrine that this anti-pattern
  is failing to author.
- Pending owner-gated synthesis PDR (`pdr_kind: pattern`) consolidating
  this and `comprehensive-cataloguing-drift.md` as
  *the proportionality question is the substrate* — see
  `historical-napkin-synthesis-2026-05-09.md` §F12.
