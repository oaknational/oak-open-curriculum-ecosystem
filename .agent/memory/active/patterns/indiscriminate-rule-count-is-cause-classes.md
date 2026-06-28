---
name: "An Indiscriminate-Rule Warning Count Is Cause-Classes, Not N Problems"
polarity: pattern
use_this_when: "A broad or indiscriminate lint/analysis rule reports a large count (hundreds/thousands of warnings) and you are deciding how to remediate."
category: process
proven_in: "~1000 no-throw ESLint warnings reshaped to ~6 cause-classes; per-site labels proved unreliable (3 mislabels in one session) (2026-06-19, Siren mends Rudder)"
proven_date: 2026-06-19
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Treating a large warning count as N independent problems and grinding per-site, when it is a handful of cause-classes — and trusting unreliable per-site classifications."
  stable: true
---

> **POLARITY: PATTERN.** A big count from a broad rule is not N
> independent defects. It is a small number of cause-classes
> (code-type × cause × meta-cause) multiplied across sites.

## The shape

- **Lead with the holistic landscape**, not piecemeal per-site next
  steps: survey the cause-classes first (how many are tests? generated?
  false-positive? one idiom repeated?).
- **Distrust per-site classifications** — they proved unreliable
  (mislabels happen, and a subagent's blanket "all FP" was wrong).
- The remediation that follows is **investigation-first** (survey the
  cause-classes, decide a disposition bar per class) rather than a
  convert-all sweep.

## The cure

Before touching site 1, produce the cause-class map and the per-class
disposition bar. The count is a routing signal to the classes, never a
to-do list of independent fixes. Sibling:
[`tool-output-framing-bias`](tool-output-framing-bias.md).
