# Hawthorn → Callisto (Director): #259 napkin-union handoff

**Author:** Hawthorn rides Foliage (a1fb02). **Retiring** per owner direction (2026-06-27). This transfers my remaining responsibility — getting my consolidation onto `main` via #259 — to you (Director). Everything is pre-authored and verified; you apply it.

## State

- My consolidation (#260, 5 commits) is **merged onto coord** (`82c7daf96`). It is **NOT yet on main** — it rides your #259 (coord→main).
- `distilled.md` + `pending-graduations.md` on coord are emptied and do **not** diverge from main → take coord's versions (nothing to reconcile).
- Only `napkin.md` needs the union.

## The napkin union (my lane — COMPLETE, do not re-derive)

The exact napkin content to land is in **`hawthorn-259-napkin-union-CONTENT.md`** (same dir): **166 lines, markdownlint 0 errors**, all 8 entries, fits fitness (limit 300). It is the complete concept-union of every surviving napkin source:

1. Napkin-rotated summary (Hawthorn) · 2. Ask-the-Director shared-state (Hawthorn) · 3. Gull S8786 tool-rule-criterion (from main) · 4. Starling full 8-bullet idiom append (from primary-tree) · 5. Skipper tests-prove-behaviour (from #243) · 6. Cedar unobserved-session-state (from #243) · 7. Cedar cross-worktree-fragmentation (from #243) · 8. Drain-by-promotion meta-lesson (Hawthorn).

### Apply instruction

**IMPORTANT:** coord's current napkin is the 52-line fresh-rotated version — it does NOT yet contain Gull/Starling/Seal-3. So do **not** blindly "take coord's current napkin". Instead, at #259 assembly set `.agent/memory/active/napkin.md` = the CONTENT file. That file IS what take-coord's-napkin would have been had I folded to coord — I authored + verified it instead of pushing, to avoid a working-tree conflict in your primary checkout.

- The old ~360-line window stays only in `archive/napkin-2026-06-27-hawthorn-consolidation.md` (already on coord; respects the rotation; reaches main via the archive file).
- **Discard the primary-tree's uncommitted `napkin.md` append** — Starling's append is already absorbed into the CONTENT union (entry 4). Committing it separately would double it.
- Re-verify the 4 external sources are unchanged at assembly (all reported frozen as of 16:18Z: main's Gull entry, #243's 3 entries, primary-tree's Starling append).

## Also for #259 (or a follow-up) — one frictions-register entry

**F-NNN — `claims open` F-95 gate false-negatives despite a live heartbeat file.** Observed 2026-06-27 (Hawthorn): re-armed the all-channels watcher with `--heartbeat-file <seen>.heartbeat.json --heartbeat-interval-ms 30000`; the heartbeat file was present at the exact path the gate names with a fresh mtime, yet `claims open` refused with "no comms watcher heartbeat … watcher not running." Not root-caused: gate-side freshness check tighter than file mtime, or a path-derivation mismatch on the spaced display-name. Effect: a live, event-delivering watcher cannot open a claim. Adjacent to F-95/F-99 and F-88 (display-name vs filesystem-id). Investigate `claims-open-watcher-gate.ts` / `cli-comms-assert-watcher-live.ts`. (I worked under claims-never-block; the partition covered collision-safety.)

## Remaining responsibility (yours)

The coord→main #259 merge carries all the above to main — your first-hand gate + owner code-owner click. After it lands, my consolidation is finally live. Thank you for the clean coordination. — Hawthorn rides Foliage (a1fb02)
