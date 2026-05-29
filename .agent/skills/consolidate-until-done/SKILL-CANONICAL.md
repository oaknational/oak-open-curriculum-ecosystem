---
name: consolidate-until-done
classification: active
description: >-
  Run a persistent dedicated Oak knowledge-curation goal until every live
  curation buffer is empty or explicitly owner-decision-gated and no fitness
  file is worse than soft; wraps start-right-quick and consolidate-docs while
  forbidding archive, split, shard, or rename-only fitness cures.
---

# Consolidate Until Done

## Purpose

Use this wrapper when the owner starts or resumes a persistent goal like:

> Continue knowledge curation until no files are worse than soft, and buffer
> files are either empty or only contain items flagged explicitly for user
> decisions.

This is not a lighter version of
[`consolidate-docs`](../consolidate-docs/SKILL-CANONICAL.md). It is the
strict, persistent version of `dedicated-knowledge-curation`: keep working
until the proof exists, or report the exact remaining owner decisions without
calling the goal complete.

## Required Grounding

Before substantive work:

1. Read and apply
   [`start-right-quick`](../start-right-quick/SKILL-CANONICAL.md).
2. Read and apply
   [`consolidate-docs`](../consolidate-docs/SKILL-CANONICAL.md).
3. Declare mode `dedicated-knowledge-curation`.
4. State this bridge explicitly in your own words:
   fitness output is routing evidence, while completion requires real
   item-level buffer disposition plus no file worse than soft.
5. Check active claims, comms, and git state before edits. Open narrow claims
   for touched surfaces.

## Completion Contract

You may mark the goal complete only when all conditions are verified in the
current session:

1. `pnpm practice:fitness:strict-hard` passes, or an equivalent current
   validator report proves there are zero hard and zero critical files.
2. Every live drainable buffer in scope is empty or ready-empty.
3. Every split, child, adjacent, dated, or directory-partitioned buffer file is
   included in the buffer inventory. A file does not stop being a buffer
   because it is called a shard, split, window, archive candidate, backlog, or
   carry-forward surface.
4. Any remaining non-empty buffer item is explicitly `owner-gated`, with the
   user decision needed, the live holding location, and the evidence a future
   agent can use to tell whether the gate still applies.
5. The closeout cites a durable disposition ledger for each processed buffer
   item and gives before/after counts.

Anything else is `pending` or `partial slice landed`, not complete.

## Forbidden Anti-patterns

Never do these to satisfy the goal:

- Move content to an archive, backup, split file, shard, or differently named
  surface merely to change the fitness report.
- Treat a softer fitness report as proof that curation happened.
- Delete, archive, or hide a buffer before reading each item, routing its
  substance, and recording item-level disposition evidence.
- Convert unresolved work into `carried-forward`, `pending`, `not now`,
  `trigger not fired`, or `out of scope` and then call the buffer done.
- Raise hard limits, character limits, or line-length limits without explicit
  owner approval.
- Redefine the goal around a smaller selected buffer once work has begun.
  Selection can order the pass; it cannot narrow the completion contract.

Archive moves are allowed only as normal lifecycle cleanup after the item-level
disposition ledger already proves the source content is graduated, duplicate,
stale-withdrawn, or owner-gated.

## Work Loop

Repeat this loop until the completion contract is met:

1. **Inventory.** Run the current fitness validator and build a buffer
   inventory that includes all live drainable buffers and their split or child
   files. Include pending-graduations directories, active/recent memory
   buffers, open-questions, relevant practice boxes, and stale collaboration
   comms when those surfaces are in scope.
2. **Choose the next real item.** Prefer critical, then hard, then soft, then
   ready-empty verification. Within a buffer, work item by item.
3. **Read before routing.** Understand the source item before editing. Do not
   infer disposition from filename, age, or fitness status.
4. **Route substance.** Move knowledge to the correct durable home, update the
   existing home, or prove the home already contains it.
5. **Record exactly one disposition per item.** Valid final dispositions are
   `graduated`, `duplicate`, `owner-gated`, or `stale-withdrawn`. Use
   `carried-forward` only for an interrupted mid-run handoff; it does not
   satisfy this skill's completion contract.
6. **Repair structural fitness honestly.** If a file is worse than soft because
   of formatting, wrap or reflow while preserving substance. If it is worse
   than soft because of duplicate or stale live-index material, remove only
   after durable-home proof. If the substance lacks a durable home, create or
   update that home first.
7. **Verify.** Rerun fitness and recheck buffer counts after each meaningful
   batch. If a report improves, explain the real item dispositions that caused
   the improvement.

## Closeout Shape

A closeout must include:

- Mode: `dedicated-knowledge-curation`.
- Fitness before and after, including the command used.
- Buffer inventory before and after, including split or child buffer files.
- Disposition ledger paths and item counts.
- Durable homes touched or verified.
- Remaining owner decisions, if any.
- Verdict: `complete` only if the completion contract is satisfied; otherwise
  `pending` or `partial slice landed`.
