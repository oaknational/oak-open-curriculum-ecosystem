---
status: future
kind: architecture
owner_decision_required: true
---

# Three-tier substrate taxonomy: memory / repo state / local state

## The model (owner, 2026-06-25/26)

The agent substrate has **three** tiers on the tracking/portability axis, and **only local
state is git-ignored**:

| Tier | What it is | Tracked? | Examples |
| --- | --- | --- | --- |
| **memory** | Knowledge — learning and doctrine; portable across sessions (and, for Practice Core, across repos) | tracked | `active/` (napkin, distilled, patterns), the knowledge registers (pending-graduations, open-questions), `executive/` contracts, Practice Core |
| **repo state** | The repo's work-in-progress state — repo-specific but **checkout-portable** (the same content applies on any clone of this repo) | tracked | `operational/` continuity: `repo-continuity.md`, `threads/*.next-session.md`, `director-handoff.md` |
| **local state** | Checkout/machine/session-specific — true only for this checkout right now | **git-ignored** | `.agent/state/`: `active-claims.json`, comms events, the rendered shared-comms log |

The discriminator between repo state and local state: **would this be true on another checkout
of the repo?** A thread record's "WS-1 next" or "PR #224 merged" applies on any clone → **repo
state (tracked)**. "Which agent is editing which file right now" / live coordination → **local
state (git-ignored)**.

## What this corrects

An earlier framing in this pass collapsed "not memory" into "untracked" and proposed migrating the
continuity surfaces to git-ignored state. That was an over-collapse (a two-position cut where there
are three). **Continuity surfaces are repo state — correctly tracked as-is; no migration.** The
git-ignore boundary already sits in the right place (`.agent/state/` = local state).

## The actual (small) work

No file moves. The work is to **name the three tiers in doctrine** so the tracking boundary is
explicit and future agents classify correctly:

- Add the memory / repo-state / local-state tracking-tier taxonomy to `.agent/memory/README.md`
  (it currently describes `active`/`operational`/`executive` by *refresh cadence* — a different,
  complementary axis) and to `continuity-practice.md`.
- State the invariant: **only local state (`.agent/state/`) is git-ignored**; memory and repo
  state are tracked.
- Confirm `.agent/state/` contains exactly local state (claims, comms) and nothing repo-state.
- Decide whether this warrants an ADR (it touches the `.agent/state/` untracked-by-design decision,
  ADR-199 / PDR-094 — likely a small clarifying amendment, not a reversal).

## Open sub-question

`operational/` currently mixes repo state (continuity) with knowledge registers
(pending-graduations, open-questions) and methodology (ephemeral-to-permanent-homing). Those
registers are arguably *memory*, not repo state. Whether to re-home them is a finer follow-on; it
does not change the git-ignore boundary (all are tracked either way).
