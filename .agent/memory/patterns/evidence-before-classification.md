---
related_pdr: PDR-013
name: evidence-before-classification
category: process
status: active
discovered: 2026-04-11
proven_by: "Knip triage plan initially labelled 96 unused files and 749 unused exports as 'false positives' or 'likely leftover' without any investigation — user corrected: no finding may be classified without evidence."
---

# Evidence Before Classification

## Pattern

When a static analysis tool (knip, depcruise, ESLint, etc.) reports a
finding, treat every finding as unclassified until evidence proves
otherwise. Investigation determines the classification; the
classification does not precede the investigation.

## Anti-pattern

A tool reports 96 unused files. The agent assumes many are "false
positives caused by unusual consumption patterns" and labels them as
such in the plan. The plan then treats those items as lower priority
or skips them entirely. No evidence was gathered — the labels were
based on plausible-sounding narratives about dynamic imports and barrel
re-exports.

## Why it matters

Premature classification creates two risks:

1. **Genuine dead code survives** — if a truly unused file is labelled
   "consumed via dynamic import," nobody investigates and the dead code
   persists.
2. **Sensitivity reduction as a fix** — once items are mentally
   classified as false positives, the natural remedy is to add ignore
   rules, reducing the tool's effectiveness for all future code.

The correct flow is: tool reports → investigate each finding → evidence
determines classification → evidence determines remediation.

## When to apply

- When triaging any static analysis output (knip, depcruise, ESLint,
  type-check warnings)
- When writing a plan that includes tool findings
- When deciding whether to add an ignore rule — require evidence that
  the finding is genuinely non-actionable before suppressing it
