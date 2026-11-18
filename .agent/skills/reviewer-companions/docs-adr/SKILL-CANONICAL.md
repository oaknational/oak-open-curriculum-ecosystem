---
name: docs-adr
classification: active
description: Use when work changes ADRs, durable docs, or README contract surfaces.
---

# Docs & ADR

Use this skill while drafting or revising ADRs, PDRs, README contract docs, or
other durable documentation. It complements `docs-adr-expert`; use the
reviewer for the independent truthfulness and cross-reference pass.

## Read in order

1. `.agent/sub-agents/templates/docs-adr-expert.md`
2. The `docs-adr-expert` row of `.agent/rules/invoke-code-experts.md` (the roster)
3. Relevant changed files in `docs/`, `.agent/`, or project README surfaces
4. `docs/architecture/README.md` when architecture records or cross-links are
   involved

## How to use it

1. Start from the decision or contract that changed, then name the impacted
   files, gates, and surfaces explicitly.
2. Keep numbering, status, and supersession chains truthful; do not imply a
   migration or validation result you have not checked.
3. Prefer short, specific prose over broad narrative, and keep British English
   throughout.
4. Hand off to `docs-adr-expert` once the draft is coherent, or sooner if the
   change touches both permanent docs and Practice governance.
