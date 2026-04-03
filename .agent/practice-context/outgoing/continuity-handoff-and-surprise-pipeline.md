# Continuity Handoff and Surprise Pipeline

**Type**: Transferable Pattern
**Origin**: oak-mcp-ecosystem (2026-04-03 promotion)
**Related ADR**: ADR-150 (Continuity Surfaces, Session Handoff, and Surprise Pipeline)

## Summary

Treat continuity as an engineering property, not a claim about model memory.
Separate ordinary session continuity from deep convergence so the lightweight
workflow is cheap enough to use every day.

## The Pattern

1. **Operational continuity** lives in a compact continuity contract with fixed
   fields for workstream, current state, invariants, surprises, and next safe
   step.
2. **Ordinary session end** uses a lightweight `session-handoff` command to
   refresh that contract, sync next-action surfaces, and capture surprises.
3. **Deep convergence** stays in `consolidate-docs` and runs only when clear
   triggers fire.
4. **Surprise** follows an explicit pipeline:
   `capture -> distil -> graduate -> enforce`.

## Why It Matters

The old single closeout ritual bundled handoff, review, consolidation, commit,
and push. It was too heavy for ordinary sessions, so continuity was skipped.
The split-loop model keeps the cheap path cheap while preserving a route into
deep convergence when the session has genuinely reached a natural boundary.

## Portable Doctrine

- Keep the continuity contract operational-only; plans remain authoritative for
  scope, sequencing, acceptance criteria, and validation.
- `session-handoff` must not smuggle in review or git actions by default.
- `consolidate-docs` still owns graduation, pattern extraction, fitness
  management, and practice exchange.
- Surprise becomes durable only when it changes future behaviour and clears the
  normal graduation bar.

## Adoption Guidance

Use this pattern when a repo already has plans, memory layers, and a
consolidation workflow, but ordinary resumptions are still expensive or
inconsistent. If the repo has no deep-convergence workflow yet, build that
first; the handoff surface needs somewhere principled to escalate.
