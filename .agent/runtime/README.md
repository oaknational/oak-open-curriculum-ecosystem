# Runtime Surfaces

**Status**: Scaffolding created by OAC Phase 2 (2026-04-20). First
track cards are authored during OAC Phase 3 pilot.

This directory holds **runtime** (thread-aware, short-horizon) state
surfaces. Unlike `.agent/state/`, which is tracked, runtime surfaces are
gitignored so they do not propagate tactical coordination state across
checkouts or agents.

## Surfaces

| Surface | Purpose | Horizon | Writers | Authority |
| --- | --- | --- | --- | --- |
| [`tracks/<workstream>--<agent>--<branch>.md`](tracks/) | Single-writer tactical coordination surface | One focused task or blocker-resolution cycle | The owning agent only | Tactical coordination only; never authoritative for scope |

## Required Fields (tactical track cards)

Every track card must cover:

- **Agent or thread** — identity of the sole writer.
- **Branch or worktree** — pinned to avoid cross-branch confusion.
- **Claimed territory** — which files / surfaces / subsystems this
  track is actively mutating.
- **Current task** — one sentence.
- **Blocker** — explicit; empty allowed.
- **Handoff note** — one paragraph for a resuming peer.
- **`expires_at`** — an explicit ISO-8601 date after which the card
  must be resolved, promoted, or deleted.
- **`promotion_needed`** — flag for signals that should graduate into
  the learning loop or the owning workstream brief.

## Single-Writer Rule

Track cards are single-writer by default. Multiple agents operating in
the same workstream MUST use distinct track cards (by agent + branch
disambiguator). Shared-writer cards are an anti-pattern — they recreate
the prompt-as-state-host collision the OAC lane exists to resolve.

## Gitignore

`tracks/*.md` is gitignored. `.gitkeep` and this README are tracked so
the directory structure and convention remain discoverable on a fresh
checkout.

## Expiry Discipline

Expired cards must be:

1. **Resolved** — the blocker or task completed; card deleted.
2. **Promoted** — a signal of broader relevance; contents routed into
   `workstreams/<slug>.md`'s promotion watchlist or into the napkin.
3. **Deleted** — the track is no longer relevant; card removed.

Expired cards must not persist as historical artefacts. That role
belongs to the learning loop, not to this runtime surface.

## Non-Goals

- Not a memory surface. Durable learnings graduate through the
  existing learning loop.
- Not a plan replacement or a workstream-brief replacement.
- Not a sidecar store. If markdown-first track cards prove
  insufficient under real concurrency, the adjacent
  [cross-vendor-session-sidecars.plan.md](../plans/agentic-engineering-enhancements/future/cross-vendor-session-sidecars.plan.md)
  is the forward path.
