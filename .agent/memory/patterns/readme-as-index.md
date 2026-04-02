---
name: "README as Index"
use_this_when: "A plan-directory README is growing to contain session instructions, outcome narratives, or design rationale that duplicates or replaces .plan.md content"
category: process
proven_in: "Plan architecture refactor (2026-03-23, algo-experiments)"
proven_date: 2026-03-23
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Plan content accumulating in index files, making them bloated and stale across tranche boundaries"
  stable: true
---

# README as Index

## Principle

Every `README.md` inside a plan directory (`current/`, `active/`, `future/`, `archive/`) is
strictly an index file. It lists plans, links companion material, and provides high-level
navigation. It never contains plan content: no detailed narratives, step-by-step session
instructions, outcome summaries, or design rationale.

## Pattern

- **Plan content** (phases, acceptance criteria, design rationale, session instructions) lives in
  `.plan.md` files.
- **Outcome narratives** live in evaluation artefacts or research notes.
- **READMEs** contain: a one-line domain description, a plan table (name and status), a companion
  material table, a brief next-session entry point (pointers, not procedures), and optional recent
  archive links.
- When a plan is promoted, archived, or completed, the README update is a table-row edit, not a
  content rewrite.

## Anti-pattern

A `current/README.md` grows to contain session entry checklists, detailed outcome histories, and
strategic explanations that duplicate or replace content that should live in `.plan.md` files,
evaluation artefacts, or research notes. When a tranche completes or moves, the README must be
rewritten because it has become the plan.

## When to Apply

Use this when a plan-directory README is growing beyond a simple index, or when tranche promotions
and archives require rewriting prose in index files rather than just updating table rows.
