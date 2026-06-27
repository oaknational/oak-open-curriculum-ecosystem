---
name: "Parsing Parallel/Interleaved Tool Output: Key by a Stable Prefix, Cross-Check Sums"
polarity: pattern
use_this_when: "Parsing stateful logs from a concurrent/interleaved runner — turbo, a parallel test runner, multi-workspace gate output — to attribute lines to a source."
category: process
proven_in: "turbo no-throw warning misparse — a phantom '307 warnings in one file' that was a misattribution; the workspace's true total was 77 (2026-06-19, Siren mends Rudder)"
proven_date: 2026-06-19
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Misattributing interleaved log lines by 'nearest header', producing phantom aggregates that drive wrong conclusions about where work is needed."
  stable: true
---

> **POLARITY: PATTERN.** When a runner emits lines from many tasks
> concurrently (often with CR line-endings), "the line belongs to the
> nearest header above it" is false — interleaving and `\r` rewrites
> scramble the attribution.

## The shape

- **Key the stateful parse on the stable workspace/task prefix** the
  runner emits on each line, not on position relative to a header.
- **Cross-check** the per-file/per-task sums against the gate's own
  authoritative per-workspace totals as an independent checksum. A
  per-file total that does not reconcile with the gate's reported total
  is a parse artefact, not a finding.

## The cure

Trust the runner's explicit task tag over line proximity, and reconcile
your aggregate against the tool's own summary before reasoning over it.
Sibling: [`tool-output-framing-bias`](tool-output-framing-bias.md),
[`wrapped-exit-codes-false-green`](wrapped-exit-codes-false-green.md).
