---
status: future
kind: architecture
owner_decision_required: true
---

# Continuity surfaces are state, not memory — migrate to untracked `.agent/state/`

## Problem (owner insight, 2026-06-25)

The operational **continuity** surfaces hold "where are we right now, on this
branch/checkout" working-state. The same content **would be wrong on another
branch or machine** — so it is local **state**, not shared **memory**, yet it is
currently tracked in `.agent/memory/operational/`. A tracked branch-specific
continuity file conflicts on every branch by construction (the pure-diff problem
`.agent/state/` — untracked-by-design, ADR-199/PDR-094 — already solves for
collaboration state), and it carries one author's working-state into everyone's
checkout. The multi-developer transition makes this acute: an author-agnostic
shared substrate cannot contain one author's branch-state.

The test that classifies each surface: **would this be true on another
branch/machine?** No → state (untracked). Yes → memory (tracked).

## Scope

**Migrate to untracked state** (branch/checkout-specific working-state):

- `.agent/memory/operational/repo-continuity.md`
- `.agent/memory/operational/threads/*.next-session.md`
- `.agent/memory/operational/director-handoff.md`

**Stays tracked memory** (shared across all branches — confirmed correctly placed):

- `active/napkin.md`, `active/distilled.md`, `active/patterns/`
- `operational/pending-graduations.md`, `operational/open-questions.md`,
  `operational/ephemeral-to-permanent-homing.md`,
  `operational/collaboration-state-conventions.md` / `-lifecycle.md`
- `executive/*` (artefact contracts, reviewer catalogue)

## What this is (and why it is gated)

A **foundational architectural change**: ~430 in-repo references
(repo-continuity ≈264, thread records ≈156, director-handoff ≈10) plus the
start-right reading order, `memory/README.md`, the `continuity-practice.md`
directive, and skills. It needs an **ADR amending ADR-199 / PDR-094** (the
`.agent/state/` untracked-by-design decision) to extend the state boundary to
continuity surfaces. Owner-ratified before execution.

## Open sub-questions for the ADR

- **Destination:** `.agent/state/continuity/` alongside `.agent/state/collaboration/`?
- **Fresh-clone continuity:** a fresh clone has no continuity-state (correct — no
  work done yet); orientation grounds from tracked directives/ADRs via start-right.
  Confirm no tracked "seed" is needed.
- **The thread *index* vs thread *lane-state*:** is the existence-of-threads index
  shared (memory) while the per-thread lane-state is local (state), or does the
  whole thread record move?
- **References in archived/historical tracked files:** leave as historical, or
  rewrite? (Most of the ≈430 are likely historical cross-references.)

## Interaction with the knowledge-curation pass that surfaced this

The shared-**memory** curation (registers, napkin, distilled, patterns, rules,
docs) is correctly homed and commits independently of this migration. Until this
plan executes, the continuity surfaces remain tracked; their fitness HARD/CRITICAL
signals are an artefact of the misclassification, resolved here — not chased as
memory-health debt.
