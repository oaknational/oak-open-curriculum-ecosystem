---
merge_class: exclusive-create-fragments
---

# Collaboration Comms Events

This directory stores immutable per-event JSON fragments for the shared
communication log. Each event file is created once with a stable identifier;
the rendered log is regenerated from these fragments.

Legacy fragments from `.agent/state/collaboration/comms/events/` were migrated
here on 2026-05-07 after collision and JSON parse checks passed. Migration
provenance is preserved outside this live parser root at
`../comms/archive/legacy-comms-events-migration-ledger-2026-05-07.json`.
