---
id: consolidation-signal
node_type: delivery
name: "The consolidation signal — a noticer, never a nag"
overview: "Unprocessed-mass and oldest-item-age per capture surface, projected where sessions already look; the DUE mark becomes computed."
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: planning-and-intent-estate
impact_areas:
  - practice-and-estate
tickets: []
depends_on:
  - plan: consolidation-ledger
    kind: blocking
owner_gates: []
last_updated: 2026-07-31
---

# The consolidation signal — a noticer, never a nag

## Goal

Consolidation pressure is visible without vigilance: any session, at
open and at close, sees the honest state of the unprocessed stream —
mass and oldest-item age per capture surface — and the repo-continuity
consolidation-DUE mark is computed from the ledger rather than hand-set.
(No Linear ticket by design: owner-ruled untracked subtree.)

## Mechanism

A projection over the consolidation ledger (blocking dependency), in
the estate's computed-confidence class: derived, never authored, no
thresholds-as-gates. Surfaced at the places sessions already look —
the start-right grounding read, the wrap loss-scan, the repo-continuity
next-safe-steps section. The consolidate-until-done doctrine governs
tone: the signal is a crude partial noticer that routes attention; it
never gates work, never nags, and never turns a number into a goal.

## Acceptance criteria (each with a proof — required)

- The signal renders from the ledger by one command and matches a
  first-hand recount — `repo-safe`: projection test.
- The repo-continuity DUE mark derives from the ledger, and a stale
  hand-set mark is flagged — `repo-safe`: validator leg.
- start-right and wrap both surface the signal — `repo-safe`: the
  skills cite the projection; verified by the docs link validator.
- No gating behaviour anywhere: the signal's consumers treat it as
  advisory — `repo-safe`: the projection emits report lines, never
  exit codes that fail a gate.

## Out of scope

Automation that starts sessions from the signal (induction is its own
plan); any per-agent scoring or ranking; notification spam surfaces.

## Todos

Sliced at pickup by the implementer.
