---
name: migrate-dont-drop-on-deletion
polarity: pattern
category: process
status: emerging
discovered: 2026-06-08
proven_by: "Starless Prowling Veil, graph-estate consolidation: a 'to be synthesised / superseded' holding pen had silently absorbed live forward-intent from an adjacent collection, then its own framing presented everything in it as disposable. Per-file conservation review separated live intent (restored to its value-home) from spent working-out (whose conclusions were already homed); a repo-wide ref sweep caught companion links orphaned by deleting part of a coherent set."
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Deleting a directory or collection on a holding-pen/cleanup framing that has silently absorbed live forward-intent — losing still-useful intent, and orphaning the companion links of any coherent set partially deleted."
  stable: true
---

> **POLARITY: PATTERN.** This entry names a *shape to repeat*, not a failure mode to avoid.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern) for the polarity discipline.

# Migrate, Don't Drop, on Any Judgment-Call Deletion

## Pattern

Before deleting a directory or collection, **verify per-file conservation**: separate
useful forward-intent from spent working-out whose conclusions are already homed
elsewhere. On any judgment call, **migrate, don't drop** — migration is cheap and
reversible, deletion is the loss. Restore live intent to its value-home (often the origin
it drifted from); delete only the genuinely-spent.

## Anti-pattern

A "relocate to synthesise / supersede" holding pen accumulates content, including live
forward-intent absorbed from adjacent collections. Its framing ("staging for deletion")
then presents the whole directory as disposable, and a cleanup pass deletes it wholesale.
The spent working-out is correctly gone; the live intent is gone with it — an unrecoverable
loss masked by the disposable framing. Deleting *part* of a coherent set additionally
orphans the survivors' companion links.

## Why it matters

A cleanup framing biases toward deletion, and a holding pen's own label ("to be
superseded") reads as permission to drop everything in it — but holding pens silently
accrete live intent. The asymmetry is decisive: migration is cheap and reversible while
deletion is irreversible loss, so on any judgment call the conserving move wins. A
workflow's or agent's "deletion-safe" verdict is input-to-verify: a verdict correct in one
framing can be wrong once the surrounding disposition changes.

## When to apply

- Deleting a `synthesise/`, `superseded/`, `holding/`, `to-process/`, or similar staging
  directory.
- Any bulk deletion of a collection that may contain mixed live and spent content.
- After deleting part of a set: run a repo-wide reference sweep, not just over the deleted
  paths, to catch orphaned companion links.

## Adjacent

- [[contamination-scan-method]] — method for separating live from spent before a bulk move.
- [`harvest-from-deleted` (auto-memory)] — the dual: when carrying anything *out* of
  deleted/failed content, it must independently re-derive; default to saving nothing.
