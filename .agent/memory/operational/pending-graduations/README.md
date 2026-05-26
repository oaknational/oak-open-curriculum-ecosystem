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
- [`2026-05-24-napkin-tail-candidates.md`](2026-05-24-napkin-tail-candidates.md)
  — second-instance-gated candidates from the 2026-05-24 napkin tail:
  redundant config markers, attribution-preserving commit splits,
  substrate-write windows, and goal-backed handoff state.
- [`2026-05-25-fiery-collaboration-decomposition-and-n2-efficiency.md`](2026-05-25-fiery-collaboration-decomposition-and-n2-efficiency.md)
  — owner-direction-triggered marshal-cycle decomposition and n=2 efficiency
  candidates.
- [`2026-05-25-mistbound-inherited-frame-and-hook-signal-candidates.md`](2026-05-25-mistbound-inherited-frame-and-hook-signal-candidates.md)
  — inherited-frame, hook-policy, and start-right/team-doctrine signals from
  the Mistbound/Quiet consolidation pass.
- [`2026-05-25-misty-director-session-candidates.md`](2026-05-25-misty-director-session-candidates.md)
  — director-session candidates covering plan liveness, heartbeat state,
  inbox semantics, owner-direction provenance, and Director-seat threshold.
- [`2026-05-25-planning-and-autofix-candidates.md`](2026-05-25-planning-and-autofix-candidates.md)
  — Briny/Hushed planning, role-emission, template, auto-fix, and
  human-composer plan audit-trail candidates.
- [`2026-05-26-feathered-torrid-n2-cycle-1-candidates.md`](2026-05-26-feathered-torrid-n2-cycle-1-candidates.md)
  — n=2 enforcement-bundle route map; full source window archived under
  `../archive/`.
