---
name: Bounded Metaloss Recursion
polarity: pattern
use_this_when: Running a loss scan at compaction or session close and a recursive pass over the scan itself risks becoming an unbounded attempt to prove that nothing was omitted
category: process
layer: general
proven_in: three worked instances inlined below (Sloop holds Lagoon, 2026-07-13; Cedar rides Undergrowth and Galleon calls Channel, 2026-07-14), conserved verbatim in the dated napkin archive at .agent/memory/active/archive/napkin-2026-07-14.md
proven_date: 2026-07-14
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Turning a handoff loss scan into an anti-convergent recursion that adds narrative while still failing to recover the scan's unknowable complement"
  stable: true
---

> **POLARITY: PATTERN.** This is a shape to repeat: make the loss boundary explicit,
> recurse once over the scan's own selection function, then stop when decision-changing
> semantics have homes.

# Bounded Metaloss Recursion

## Problem

A loss scan enumerates what the context-holder recognises as load-bearing. It cannot enumerate
its own complement: items filtered out before they became entries are absent from the ledger by
definition. Recursing over the scan can expose that selection effect, but further recursion does
not reconstruct the lost filter. It tends to produce more closing prose, delay custody transfer,
and create new state after the supposed freeze.

The failure shape is especially likely at session close, when completion drive makes both
"everything is captured" and "one more exhaustive pass" feel fluent. The first overclaims;
the second never converges.

## Pattern

Use a bounded two-level shape:

1. **Write at occurrence.** Put decisions, evidence, authority changes, failures, and next
   actions into their consumer surfaces when they happen. The closeout scan should recover
   residue, not reconstruct the whole session from memory.
2. **State the scan window.** Name the context sources and time window inspected. If a prior
   compaction-prep scan was already verified, the terminal scan owes only the delta after it.
3. **Route first-order survivors.** For each item that would change a successor's action, name
   its consumer and durable home. Distinguish permanent evidence from operational residue and
   from intentionally ephemeral texture.
4. **Run one metaloss pass.** Ask what the first scan's categories, compression, or assumed
   audience could erase or distort. Include a representative sample of rejected material so
   absence is read as bounded evidence rather than proof of completeness.
5. **Stop on semantics, not exhaustion.** Stop when decision rationale, rejected alternatives,
   evidence altitude, authority and custody, falsifiers, and next safe actions have durable or
   explicitly custodial homes. Further recursion that only restates the filter adds words, not
   information.

## Worked Instances

- **Sloop holds Lagoon, 13 July 2026:** the first recursive pass showed that a loss ledger
  records its members, never its complement. Naming the sweep scope and sampling rejected
  material made the claim honest; deeper recursion could not recover context that had never
  entered the ledger.
- **Cedar rides Undergrowth, 14 July 2026:** a verified compaction-prep scan followed by a
  terminal closeout established the delta rule. Re-scanning the whole session would have
  reasserted stale PR state; scanning only the later window conserved the new decisions and
  residue without reopening settled work.
- **Galleon calls Channel, 14 July 2026:** the second-level pass separated owner-authored
  Notion presentation, immutable historical capture, live branch state, and local worktree
  residue. A third level produced no new consumer action, so the recursion stopped and the
  reusable method graduated here.

## Anti-Pattern

Do not treat recursive loss analysis as a proof obligation that can reach certainty. An
anti-convergent closeout repeatedly refreshes moving state, writes another summary about the
previous summary, and delays transfer because the latest write created a fresh delta. The cure
is a declared freeze or scan window, write-at-occurrence, one recursive challenge to the
selection function, and explicit custody for late residue.

## Composition

- [`cross-session-pattern-emergence.md`](cross-session-pattern-emergence.md) supplies the
  chronological comparison that made the repeated shape visible.
- [`adversarially-verify-own-synthesis.md`](adversarially-verify-own-synthesis.md) remains the
  verification complement: another reader can falsify written claims, but only the
  context-holder can perform the context-minus-artefacts loss scan.
- [`actuate-mechanism-in-the-same-breath.md`](actuate-mechanism-in-the-same-breath.md) supports
  write-at-occurrence by making promised monitoring and routing real at the moment of intent.

## Source Surfaces

- The three worked instances above are self-contained; their full session entries are conserved
  verbatim (not by live pointer) in the dated archive
  `.agent/memory/active/archive/napkin-2026-07-14.md` — Sloop holds Lagoon (13 July 2026), Cedar
  rides Undergrowth (14 July 2026), and Galleon calls Channel (14 July 2026).
- `.agent/skills/session-handoff/SKILL-CANONICAL.md` step 6e.2, which makes the context-holder's
  loss scan non-delegable and requires loss and metaloss findings to reach the napkin.
