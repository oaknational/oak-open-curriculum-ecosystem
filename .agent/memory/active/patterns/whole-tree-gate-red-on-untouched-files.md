---
name: "A Whole-Tree Gate Red on Files You Didn't Touch (and Your Commits Just Passed) Is Not Your Bug"
polarity: pattern
use_this_when: "A whole-tree gate (type-check, lint, full pnpm check) fails on a surface you never changed, in a shared checkout or multi-agent window."
category: process
proven_in: "2026-06-23 (Blazar) — shared-checkout transient red from a peer's in-flight feature (F-83)"
proven_date: 2026-06-23
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Assuming your change broke a whole-tree gate when a concurrent agent's in-flight work left the shared tree transiently red — then patching their work and colliding."
  stable: true
---

> **POLARITY: PATTERN.** In a shared checkout, a whole-tree gate failing
> on a surface you never touched — when your own recent commits passed
> that exact gate minutes ago — points at a peer, not at you.

## The shape

When a whole-tree gate fails on files you didn't change AND your own
recent commits passed it minutes earlier, **read active-claims + comms
for a concurrent agent before assuming your change broke it**. A peer's
in-flight feature can leave the shared working tree transiently red.

## The cure

Coordinate, do not patch: post the exact failing locations to the owning
agent and wait event-driven for their atomic cycle to heal the tree.
Patching their in-flight work is a collision. Multi-developer /
shared-checkout territory (F-83). Sibling:
[`respect-active-agent-claims`](../../../rules/respect-active-agent-claims.md).
