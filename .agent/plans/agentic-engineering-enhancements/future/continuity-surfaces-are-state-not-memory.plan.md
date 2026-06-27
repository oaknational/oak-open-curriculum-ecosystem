---
status: ratified
kind: architecture
owner_decision_required: false
---

# Three-tier substrate taxonomy: memory / repo state / local state

> **RATIFIED & ABSORBED INTO DOCTRINE (2026-06-27, D1).** The owner ratified this model
> (2026-06-25/26); it now lives in doctrine — `.agent/memory/README.md` §Tracking Tiers and
> `.agent/directives/continuity-practice.md` §Surface Roles (tracking tiers), citing ADR-203 +
> PDR-094 for the untracked-by-design invariant. This file is retained as the ratification
> record. Its *taxonomy* substance is conserved in doctrine; the **§Open sub-question** (whether
> `operational/` knowledge registers should be re-homed as memory) is an unresolved follow-on and
> must be promoted to the `open-questions` register before this file is archived. Archival is gated
> on that promotion, not on this note.

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
  ADR-203 / PDR-094 — likely a small clarifying amendment, not a reversal). **Verdict (D1): no new
  ADR — ADR-203 ("State-Tier Process-and-Archive-Move") already owns the state-tier concept; the
  README + directive cite it for the invariant. (Earlier drafts cited ADR-199, the comms-event
  rotation phenotype — that was the wrong reference.) ADR-203 itself was amended 2026-06-27 for
  tier-classification accuracy: it had described `conversations/`, `escalations/`, `sidebars/` as
  untracked-by-design when the live `.gitignore` deliberately tracks those three (matching ADR-199's
  own repo/instance boundary), so its Context/Decision/Consequences prose now distinguishes the
  untracked instance tier from the tracked repo tier. The ratified disposition decision
  (process-then-archive-move, never `git rm`) is unchanged — this is drift-correction, not a
  reversal.**

## Open sub-question

`operational/` currently mixes repo state (continuity) with knowledge registers
(pending-graduations, open-questions) and methodology (ephemeral-to-permanent-homing). Those
registers are arguably *memory*, not repo state. Whether to re-home them is a finer follow-on; it
does not change the git-ignore boundary (all are tracked either way).
