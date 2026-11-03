# Cross-Machine Collaboration

Worked-instance reference (founding run 2026-07-20, Director seat ↔ a
sibling checkout on a second host over SSH; graduated from the Director's
tenure notes at the dedicated consolidation).

## The visibility gap

All of this estate's coordination substrate — the comms event stream,
claims registry, commit queue, seen-files — is FILE-BASED in one checkout's
`.agent/state/collaboration/`. A sibling checkout of the same repo on
another machine is therefore INVISIBLE to it: no comms event, claim,
heartbeat, or watcher on host A can observe or reach an agent working on
host B. Nothing in the registries distinguishes "no other agents" from
"other agents on hosts this filesystem cannot see".

## The working cure (proven end-to-end)

- **Transport**: an SSH channel from the coordinating host to the sibling
  host carries directed messages and reads remote state first-hand;
  a remote monitor (an event-emitting watch over the sibling's relevant
  surfaces, run via the same SSH channel) provides incoming visibility.
- **Identity**: the PDR-027 identity tuple is carried by the DETERMINISTIC
  seed — the same session id yields the same derived tuple on both
  machines, so a remote seat's events attribute correctly without any
  shared mutable registry.

## Boundaries

- File-based comms remain canonical for same-host coordination; the SSH
  channel is a bridge, not a second canonical stream — substance that must
  reach the team lands as canonical comms events on the coordination home,
  authored by whichever side can write there.
- Treat a remote checkout like any foreign working tree: read-only until
  claims/coordination are established; risk-class git operations remain
  owner-run on the machine that owns the tree.
- The structural successor (if cross-machine work becomes routine) is a
  transport-backed comms substrate rather than per-arc SSH bridges; until
  then this reference is the recipe.
