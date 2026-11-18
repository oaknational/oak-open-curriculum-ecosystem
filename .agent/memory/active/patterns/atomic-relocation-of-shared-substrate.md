---
name: "Atomic Relocation of Shared Substrate"
polarity: pattern
use_this_when: "Moving a directory, workspace, or state surface that other agents' tooling reads live (comms dirs, registries, built CLIs) — plan the move, the repoint of every reader, and the rebuild as one atomic change."
category: process
layer: general
proven_in: "Discovery-run rescued candidate C10 (2026-07-02 salvage; two independent windows): a substrate/workspace relocation via git mv that was not atomic across {move, repoint all readers, rebuild dist} within one window broke canonical comms/tooling team-wide until the trailing steps completed."
proven_date: 2026-07-02
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Relocating a live shared surface in stages — peers' watchers, CLIs, and hooks resolve the old path (or a half-built dist) for the whole gap window, and every consumer breaks at once."
  stable: true
---

> **POLARITY: PATTERN.** This entry names a *shape to repeat*, not a failure mode to avoid.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern) for the polarity discipline.

A shared substrate — a comms directory, a claims registry, a workspace a
built CLI resolves — has live readers the moment it exists. Relocating it
is not one edit but three coupled ones:

1. **Move** the files (`git mv` or equivalent).
2. **Repoint every reader** — path constants, configs, hooks, docs,
   watcher invocations — found by searching for the old path, not from
   memory.
3. **Rebuild** any dist/compiled artefact that embeds the old path.

All three must land within one window (one commit, or one tightly
sequenced set with peers paused). A relocation that stops after step 1
breaks canonical comms and tooling **team-wide** until the trailing steps
complete: peers' watchers watch a dead directory, CLIs write to a decoy,
and the failure is silent (see the comms decoy-directory class in
[`comms-all-channels-watcher`](../../../rules/comms-all-channels-watcher.md)
§Known Silent-Failure Class).

Before the move, enumerate readers with a literal-path sweep; after it,
prove one end-to-end read/write through the new location before declaring
the relocation done.
