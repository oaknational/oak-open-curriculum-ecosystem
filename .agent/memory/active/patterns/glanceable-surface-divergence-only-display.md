---
name: "Glanceable Surfaces: Show a Token Only When It Diverges"
polarity: pattern
use_this_when: "Designing or editing a status surface (statusline, dashboard, badge row) that shows two related facts side by side."
category: process
proven_in: "Two-set statusline divergence-only dedup (2026-06-26, PR #235)"
proven_date: 2026-06-26
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Two near-identical tokens on a glanceable surface forcing a human out of glance-mode into careful reading — and the wrong cure of adding disambiguation, which adds visual load instead of removing it."
  stable: true
---

> **POLARITY: PATTERN.** A glanceable surface earns its value by being
> glanceable. When two facts shown side by side are usually the same,
> the second one is noise that breaks the glance.

## The shape

On a glanceable surface (statusline, dashboard, badge row), **show a
token only when it diverges from its working-side counterpart**; suppress
it when it merely repeats. Two near-identical tokens on adjacent lines
force the reader out of glance-mode into careful comparison — the exact
cost the surface exists to avoid.

Worked instance (PR #235): the two-set statusline suppresses the whole
coordination line when its branch equals the working branch, and drops
the primary-checkout name when it equals the worktree name.

## The cure

The cure for "two things communicating the same information" is
**removal of the redundant token**, not adding disambiguation. Adding a
label or a qualifier to tell two similar tokens apart increases visual
load; suppressing the redundant one when it does not diverge restores the
glance. Default to divergence-only display for any paired fact.
