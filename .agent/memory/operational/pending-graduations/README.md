# Pending-Graduations Active Shards

This directory holds active queue shards split out of
[`../pending-graduations.md`](../pending-graduations.md) when a coherent
cluster is too large for the main register but is not yet processed enough to
archive.

A shard is live queue substance. Do not treat it as an archive. Before moving a
shard to an archive, process every entry: verify the durable home or unresolved
route, record the disposition, and keep an audit pointer in the main register.

## Shards

- [`2026-05-06-to-2026-05-21-legacy-backlog.md`](2026-05-06-to-2026-05-21-legacy-backlog.md)
  — legacy live backlog covering early-May collaboration, agent-tooling,
  validation, topology, graph/source-authority, insight-report, and
  commands-retirement candidates.
- [`2026-05-23-team-session-autonomy.md`](2026-05-23-team-session-autonomy.md)
  — 2026-05-23 first-out closeout, commit-queue ceremony cures, PDR-074
  autonomy primitives P1-P6, and the PDR-078 / ADR-186 liveness heartbeat
  bundle.
