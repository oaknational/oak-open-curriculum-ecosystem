---
related_pdr: PDR-013
name: "Tool Output Framing Bias"
use_this_when: "building a plan from a single tool run and the tool's groupings, counts, or categories are being adopted as plan structure without independent verification"
category: process
proven_in: ".agent/plans/architecture-and-infrastructure/current/depcruise-triage-and-remediation.plan.md"
proven_date: 2026-04-12
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Plans adopt tool framing as authority; 3 of 4 knip-2.5 assumptions and 4 of 12 depcruise assumptions were materially wrong when investigated"
  stable: true
---

# Tool Output Framing Bias

## Pattern

When a static analysis tool (knip, depcruise, ESLint) produces
output, its groupings, counts, and categories are artefacts of
how the tool reports — not verified facts about the codebase.
Before building a plan around tool output, independently verify:

1. **Counts** — re-run the tool, parse every finding, count
   yourself. The tool's summary may aggregate differently than
   your plan needs.
2. **Groupings** — the tool's categories may not match the
   structural clusters that matter for remediation. Investigate
   whether findings that look related actually share root causes.
3. **Severity** — the tool's error/warning distinction reflects
   its config, not your project's priorities.

## Anti-pattern

A tool reports "87 violations in 2 categories." The plan adopts
"~5 distinct cycles" and "~3 orphan categories" from a visual
scan of the output. No one re-runs the tool, traces the actual
import chains, or verifies the groupings. The plan proceeds with
structural assumptions inherited from a single tool invocation.

Later investigation reveals 7 distinct cycles (not 5), 4 orphan
categories (not 3), and that the tool already exits non-zero
(contradicting the plan's claim that it exits 0). Three of twelve
plan assumptions are materially wrong.

## Why it matters

Tool output is a starting point for investigation, not a
conclusion. When a plan adopts tool framing uncritically:

- **Scope errors** — remediation effort is mis-estimated because
  the real cluster count differs from the assumed count.
- **Strategy errors** — fixes are designed for assumed structures
  that don't match the actual dependency graph.
- **False confidence** — the plan looks evidence-based because it
  cites tool output, but the citations are unverified.

## Evidence

Three instances across the same workstream:

1. **Quality gate plan (2026-04-11g)**: planned from assumptions,
   rejected — flaky tests assumed resolved, gate-weakening
   proposed as fixes.
2. **Knip Phase 2.5 (2026-04-12)**: 3 of 4 follow-up assumptions
   materially wrong — auth helpers had no duplication, GT barrels
   were 39 not 54, CLI barrel had 17 consumers not zero.
3. **Depcruise plan (2026-04-12)**: A1 (cycle count), A5 (orphan
   categories), A11 (exit code), A12 (config completeness) all
   partially or fully falsified by Phase 0 deep audit.

## Relationship to other patterns

Complements `evidence-before-classification` (which addresses
labelling individual findings without evidence). This pattern
addresses adopting the tool's *structural frame* — its counts,
groupings, and categories — as plan architecture without
verification.
