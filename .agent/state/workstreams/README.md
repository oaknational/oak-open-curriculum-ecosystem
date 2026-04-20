# Workstream Briefs

**Status**: Scaffolding created by OAC Phase 2 (2026-04-20). First
briefs are authored during OAC Phase 3 pilot.

Each active workstream gets one tracked brief at
`.agent/state/workstreams/<slug>.md`. The brief is a short-horizon
resumption surface: enough context for a freshly-resumed agent to pick
up the workstream without reading the whole plan.

## Required Fields

Every brief must cover:

- **Owning plan(s)** — link to the authoritative plan(s) in
  `.agent/plans/*/active/` that own scope, sequencing, and acceptance.
- **Current objective** — what the workstream is currently trying to
  achieve.
- **Current state** — what has landed, what is in-flight, what is
  blocked.
- **Blockers / low-confidence areas** — explicit; empty lists allowed.
- **Next safe step** — the action a resuming agent can execute.
- **Active track links** — pointers to
  `.agent/runtime/tracks/<workstream>--<agent>--<branch>.md` files for
  any tactical coordination in progress.
- **Promotion watchlist** — signals that may warrant graduation into
  the learning loop (`napkin` → `distilled` → permanent docs).

## Writers and Readers

- **Writer**: `session-handoff` during closeout; optionally `GO` when
  crossing into a workstream boundary at resume time.
- **Readers**: `GO` on resume; `session-handoff` on the next closeout.

## Expiry

Workstream briefs live as long as the workstream is active. When the
owning plan archives to `completed/`, the brief archives with it —
content that should persist graduates into permanent docs via the
learning loop; the rest is not preserved.

## Non-Goals

- Not a plan replacement. Plans remain authoritative for scope,
  sequencing, and acceptance.
- Not a second memory doctrine. Durable learnings route through
  `napkin` and `distilled` as they always have.
- Not a tactical coordination surface. That is
  `.agent/runtime/tracks/*.md`.
