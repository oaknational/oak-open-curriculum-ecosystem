# Tactical Track Cards (Operational Memory)

**Status**: Active. Scaffolded by OAC Phase 2 (2026-04-20); cards are
authored per-session during OAC Phase 3+ work. Moved from the legacy
top-level `runtime/tracks/` location into this path during the
memory-taxonomy restructure (2026-04-20) — tracks are now
operational memory alongside the continuity contract and thread
next-session records.

This directory holds **thread-aware, short-horizon operational memory
cards**. See [`.agent/memory/README.md`](../../README.md) for the
three-mode memory taxonomy.

Track cards are **git-tracked**: multi-agent and multi-location
collaboration on a track happens through the normal git channel. A
dev in one location, an agent in another session, and a second dev in
a third checkout can all read and coordinate off the same track cards.

Single-writer-per-card still holds. Multiple writers on the same
conceptual track create multiple cards, disambiguated by the
`<thread>--<agent>--<branch>.md` naming convention (see *Naming
convention* below).

## Surfaces

| Surface | Purpose | Horizon | Writers | Authority |
| --- | --- | --- | --- | --- |
| `<thread>--<agent>--<branch>.md` | Single-writer tactical coordination surface | One focused task or blocker-resolution cycle | The owning agent only | Tactical coordination only; never authoritative for scope |

## Naming convention

Track cards use `<thread>--<agent>--<branch>.md`. Before the
2026-04-21 Session 5 workstream-layer retirement (owner-ratified
TIER-2 E1 simplification), the canonical form was
`<workstream>--<agent>--<branch>.md`; with the workstream surface
retired, the `<scope>` token is now the **thread slug** by default.
If a future thread exercises multi-lane scope, the `<scope>` token
may carry a lane qualifier (`<thread>-<lane>`); the format remains
declarative, not schema-enforced. See
[PDR-027 §Amendment Log 2026-04-21 Session 5](../../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md#amendment-log).

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
  the learning loop or the owning thread's next-session record.

## Single-Writer Per Card

Each card is single-writer. A collaborative track creates multiple
cards — one per agent/dev — each with its own writer. Readers
consume the set. Shared-writer cards are an anti-pattern; they
recreate the prompt-as-state-host collision the OAC lane exists to
resolve.

The writer is the agent or dev named in the card's
`<thread>--<agent>--<branch>` filename. Another agent wanting
to coordinate creates its own card with a distinct identity
segment; it does not write to someone else's card.

## Tracked, Not Gitignored

`tracks/*.md` is git-tracked. The `.gitkeep` preserves the directory
when no cards exist. Collaboration across agents, devs, and locations
happens through normal git operations: commits, pulls, merges.

Cards should be created, updated, resolved, and deleted through the
same cadence as any other tracked file — commit when you create or
meaningfully update; don't leave uncommitted card edits across session
boundaries.

The git-tracked discipline is portable doctrine: see
[PDR-011 §The continuity contract + 2026-04-21 Session 5 amendment](../../../practice-core/decision-records/PDR-011-continuity-surfaces-and-surprise-pipeline.md#amendment-log).
Tactical track cards are continuity surfaces; gitignored cards
break the continuity guarantee at the cross-machine boundary the
cards exist to bridge.

## Expiry Discipline

Expired cards must be:

1. **Resolved** — the blocker or task completed; card deleted.
2. **Promoted** — a signal of broader relevance; contents routed into
   the owning thread's next-session record (lane state section) or
   into the napkin.
3. **Deleted** — the track is no longer relevant; card removed.

Expired cards must not persist as historical artefacts. That role
belongs to the learning loop, not to this runtime surface.

## Non-Goals

- Not a **learning-loop** memory surface. Track cards are operational
  memory (short-horizon, ephemeral); durable learnings graduate
  through the active-memory pipeline (napkin → distilled → permanent
  docs) at [`.agent/memory/active/`](../../active/).
- Not a plan replacement or a thread-record replacement.
- Not a sidecar store. If markdown-first track cards prove
  insufficient under real concurrency, the adjacent
  [cross-vendor-session-sidecars.plan.md](../../../plans/agentic-engineering-enhancements/future/cross-vendor-session-sidecars.plan.md)
  is the forward path.
