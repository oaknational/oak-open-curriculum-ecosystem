---
fitness_content_role: reference
---

# 2026-05-28 Sylvan Whispering Fern Curation Pass

Mode: `dedicated-knowledge-curation` (`/oak-consolidate-until-done`).

## Fitness (routing evidence only)

- **Before**: 1 HARD (`napkin.md`: 408 lines / 19558 chars / 1 prose line at
  114), 18 soft, 0 critical.
- **After**: 0 hard, 0 critical, 18 soft. `pnpm practice:fitness:strict-hard`
  exit 0.

The 18 soft files are within the goal envelope ("no file worse than soft") and
were not touched — soft is "think about it", never a drain target.

## Buffer inventory (before → after)

| Buffer | Before | After | Disposition |
| --- | --- | --- | --- |
| `napkin.md` | HARD, 408 lines | healthy, 36 lines | rotated (see ledger) |
| `distilled.md` | healthy, ~91 lines | healthy, 127 lines | +4 graduated entries |
| `open-questions.md` | 1 open (Q-001) | 0 open | Q-001 withdrawn |
| `pending-graduations.md` | 66 owner-gated + 6 new | unchanged | owner-gated by design |
| `pending-graduations/` dir | empty | empty | no sidecars (collapsed 2026-05-27) |
| comms corpus (`comms/`) | 2765 events | unchanged | owner-gated preservation |

## Disposition ledger — napkin rotation

The full 2026-05-27/28 napkin is archived verbatim at
[`archive/napkin-2026-05-28-sylvan-curation.md`](../../active/archive/napkin-2026-05-28-sylvan-curation.md)
(evidence). Behaviour-changing lessons:

| Lesson | Disposition | Durable home |
| --- | --- | --- |
| `tail -F \| grep` re-emits whole history on file rewrite; use a dedup poll (2 instances) | graduated | `distilled.md` |
| Read git merge/divergence risk from content, not raw `HEAD..origin` name-status | graduated | `distilled.md` |
| Generated adapters never hand-written — fix the generator, don't stub (owner-corrected) | graduated | `distilled.md` |
| Treat session-opener fitness as stale until rerun this session | graduated | `distilled.md` |
| routing-legacy-fallback is a compatibility-layer breach; remove + migrate, don't filter | duplicate | `replace-dont-bridge` + `never-ignore-signals` + `routing-legacy-fallback-sunset` plan |
| consolidate-docs needs a mode contract | duplicate | `consolidate-docs` SKILL Mode Contract |
| supersession must refresh the auto-surfaced continuity chain | duplicate | `distilled.md` (2026-05-27 entry) |
| collaboration state is source, not storage | duplicate | `distilled.md` (2026-05-27 entry) |
| proportionate exploration / don't invent optionality (under "costume") | duplicate | per-user memory + `pending-graduations.md` candidate |
| Cursor statusline: delegate shim to Claude adapter | duplicate | `distilled.md` (2026-05-28 entry) |
| various claim/identity/comms-tag/migration operational tics | duplicate | existing rules (`register-active-areas`, ADR-183 tags, `verify-dont-trust`) |

## Disposition ledger — other buffers

| Item | Disposition | Evidence / holding location |
| --- | --- | --- |
| open-questions Q-001 (gate-1a whole-graph) | withdrawn | Framing superseded by the graph-tooling rebuild; live substance (selection/scoping strategy) is GOAL 1 of the rebuild plan/foundation. No substance lost. |
| pending-graduations: "reflection/experience is foundational" (status `due`) | owner-gated | Graduation target is a PDR-011/ADR-150 + `session-handoff` §6c amendment (Core/PDR = owner-approval class). Surfaced to owner. |
| pending-graduations: 5 new 2026-05-28 EEF captures | owner-gated | Triggers tied to EEF rebuild plan D1/D5 / second-instance; preserve until fired. |
| pending-graduations: 66 legacy owner-gated items | owner-gated | Well-formed (decision + location + evidence each). Repo-continuity: preserve until trigger fires; "not another sidecar drain". |
| comms corpus (2765 events) | owner-gated | Preservation boundary for the `agent-collaboration-research` thread; process item-level only when owner opens the research/cleanup window. |

## Durable homes touched

- `distilled.md` — 4 lessons graduated.
- `napkin.md` — rotated to a fresh session heading.
- `archive/napkin-2026-05-28-sylvan-curation.md` — full source preserved.
- `open-questions.md` — Q-001 withdrawn with substance pointer.

No archive/split/shard/rename was used as a fitness cure. The napkin archive
move is normal lifecycle cleanup *after* the item-level ledger above.

## Remaining owner decisions (surfaced, not drained)

1. **Both commits — OWNER-HELD 2026-05-28.** A foreign `.git/index.lock`
   (0-byte, stale, Cursor gitWorker/GitLens — not an agent) blocked the index;
   the owner was offered remove/clear/hold and chose **hold**. The curation
   (commit B) and the PDR renumber D4 (commit A) are complete + validated in the
   working tree and will land when the owner clears the lock and authorises the
   commits. Nothing is lost; the 7 dirty files carry the full work.
2. **"Reflection/experience is foundational" (due)** — approve the
   PDR-011/ADR-150 + `session-handoff` §6c amendment, or keep watching.
3. **66 + 5 pending-graduations items** — graduate / withdraw / keep-watching,
   per owner appetite. Preserved by design until triggers fire.
4. **comms corpus (2765 events)** — open the research/cleanup window for
   `agent-collaboration-research`, or leave preserved.
5. **Comms-coord plan-cluster defects** — a prior session segment (today
   ~12:01) diagnosed 6 defects (stale n2-program index, PDR collision, orphaned
   plans) but only D4 (the renumber) is in the tree. The other 5 may be
   unhandled — verify in a plan-consolidation lane (outside this buffer/fitness
   goal).

## Verdict

Curation **complete** by the completion contract: strict-hard green (0 hard / 0
critical), every live drainable buffer empty or explicitly owner-gated, and this
ledger records each item with before/after counts. The curation lives in the
working tree (7 dirty files); the owner explicitly **held** the commits
(stale-lock decision), so the durable landing is owner-deferred, not unfinished
curation. Goal-state: `consolidate-until-done` is substantively complete; the
only outstanding act is the owner-deferred commit.
