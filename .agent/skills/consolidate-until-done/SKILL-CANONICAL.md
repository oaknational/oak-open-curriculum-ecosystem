---
name: consolidate-until-done
classification: active
description: >-
  Run a persistent dedicated Oak knowledge-curation goal until every live
  curation buffer is empty or explicitly owner-decision-gated and its insight is
  conserved into permanent homes; wraps start-right-quick and consolidate-docs.
  Fitness is a signal that routes work, never a completion gate or a reason to
  trim, archive, split, shard, or rename.
---

# Consolidate Until Done

## Purpose

Use this wrapper when the owner starts or resumes a persistent goal like:

> Continue knowledge curation until no files are worse than soft, and buffer
> files are either empty or only contain items flagged explicitly for user
> decisions.

This is a strict superset of
[`consolidate-docs`](../consolidate-docs/SKILL-CANONICAL.md). It is the
strict, persistent version of `dedicated-knowledge-curation`: keep working
until the proof exists, or report the exact remaining owner decisions without
calling the goal complete.

## Conservation Invariant

The value of this workflow is conserving and correctly homing insight until the
knowledge substrate is genuinely cared for. Fitness results, line counts, and
buffer sizes are diagnostic signals, not goals. Do not chase lower numbers, trim
understanding, or hide buffers to make a report look better. Process the
knowledge item by item, preserve the learning at full weight, move it to the
right durable home, and let any fitness improvement happen only as the side
effect of real curation. "No file worse than soft" is a health condition to
verify at rest, not the work itself.

## Approach

This is deep, thoughtful work. It takes time. It must be done first hand.

Secondhand knowledge is not enough. If you use subagents at all you MUST first-hand critically assess their work, responses, claims, and evidence, verifying sources.

Do not rush. Knowledge curation, conservation of insight, they are all that matters.

Never chase fitness functions, they are a signal, not a goal. Caring for understanding is the only goal.

## Required Grounding

Before substantive work:

1. Read and apply
   [`start-right-quick`](../start-right-quick/SKILL-CANONICAL.md).
2. Read and apply
   [`consolidate-docs`](../consolidate-docs/SKILL-CANONICAL.md).
3. Declare mode `dedicated-knowledge-curation`.
4. State this bridge explicitly in your own words:
   fitness output is routing evidence, while the value is conserving insight
   and completion requires real item-level buffer disposition plus no file
   worse than soft at rest.
5. Check active claims, comms, and git state before edits. Open narrow claims
   for touched surfaces.

## Completion Contract

You may mark the goal complete only when all conditions are verified in the
current session:

1. **The insight is conserved.** Fitness is a **signal, not a completion gate**
   (the Conservation Invariant above; reinforced by the owner repeatedly).
   Run `pnpm practice:fitness:informational` and investigate any file worse than
   soft: a HARD usually means either un-homed substance still to route, or genuine
   structural debt (a section exceeding its design). Route the substance or fix
   the structure — but if no substance is un-homed, a residual signal is
   **reported, not chased**. Never trim, archive-to-fit, or raise a limit to force
   the report green; that is the signal→goal inversion the Conservation Invariant
   and
   [`permanent-doc-is-the-consolidation-record`](../../rules/permanent-doc-is-the-consolidation-record.md)
   forbid.
2. Every live drainable buffer in scope is empty or ready-empty.
3. Every split, child, adjacent, dated, or directory-partitioned buffer file is
   included in the buffer inventory. A file does not stop being a buffer
   because it is called a shard, split, window, archive candidate, backlog, or
   carry-forward surface.
4. Additional capture/source buffers named by `consolidate-docs` are accounted
   for when they are in scope: the minimum platform-memory set (Claude, Codex,
   Cursor, Gemini), non-repo plans, entry-point drift, and any explicitly named
   comms-event evidence. Platform file lifecycle may be external, but
   the knowledge disposition is not optional.
5. Every decidable item has been decided (graduated, rejected, or duplicate). An
   item that genuinely cannot be decided this pass remains a live decision-debt
   entry (status `pending` / `due` / `overdue`) visible in the count, to be
   graduated or rejected on a later pass.
6. The closeout reports the **value and impact** — what knowledge reached which
   permanent home, what behaviour it changes — not an accounting of dispositions.
   The commits and the permanent homes ARE the record that the pass happened. Per
   [`permanent-doc-is-the-consolidation-record`](../../rules/permanent-doc-is-the-consolidation-record.md)
   do NOT produce a durable disposition ledger, before/after counts, or
   provenance pointers; completion is verified by the observable end-state
   (buffers drained by deciding, substance live in its permanent home) plus the
   commit, not by an accounting artefact.

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
disposition already proves the source content is graduated, duplicate, or
rejected.

## Pre-Archive Verification Gate

Before any command or edit that moves, renames, archives, parks, supersedes, or
replaces a live buffer source, stop and **verify the substance is live in its
permanent home** — read the home, confirm it is there. That verification is the
knowledge-preservation screen. Per
[`permanent-doc-is-the-consolidation-record`](../../rules/permanent-doc-is-the-consolidation-record.md)
the verification is done in-context and then the item leaves cleanly; do NOT
create a disposition ledger to record what was moved — the commit and the
permanent home are the record. Do not describe the action as making the fitness
check pass; the action is conserving and homing knowledge.

## Work Loop

Repeat this loop until the completion contract is met:

1. **Inventory.** Run the current fitness validator and build a buffer
   inventory that includes all live drainable buffers and their split or child
   files. Include pending-graduations directories, active/recent memory
   buffers, open-questions, relevant practice boxes, the minimum platform-memory
   set named by `consolidate-docs` (Claude, Codex, Cursor, Gemini), non-repo
   plans, entry-point drift, and collaboration comms only when those surfaces
   are in scope. For platform-owned files, inventory the learning items and
   record knowledge disposition without taking over file rotation, archival, or
   deletion; if a required platform surface is absent or inaccessible, record
   that as an explicit inventory disposition.
2. **Choose the next real item.** Prefer critical, then hard, then soft, then
   ready-empty verification. Within a buffer, work item by item.
3. **Read before routing.** Understand the source item before editing. Do not
   infer disposition from filename, age, or fitness status.
4. **Route substance.** Move knowledge to the correct durable home, update the
   existing home, or prove the home already contains it.
5. **Classify each item's disposition as you process it** — `graduated`,
   `duplicate`, or `rejected` (`carried-forward` only for an
   interrupted mid-run handoff, and it does not satisfy the completion contract).
   The classification is reasoning, not a record to persist: home the substance,
   confirm a duplicate's home, or reject it with the reason.
   Do not write the dispositions into a ledger — see the Pre-Archive Verification
   Gate and `permanent-doc-is-the-consolidation-record`.
6. **Repair structural fitness honestly.** If a file is worse than soft because
   of formatting, wrap or reflow while preserving substance. If it is worse
   than soft because of duplicate or stale live-index material, remove only
   after durable-home proof. If the substance lacks a durable home, create or
   update that home first.
7. **Verify.** Rerun fitness and recheck buffer counts after each meaningful
   batch. If a report improves, explain the real item dispositions that caused
   the improvement.

## Closeout Shape

Report **value and impact**, not accounting:

- What knowledge reached which permanent home, and what behaviour it changes.
- Any remaining owner decisions, and where they live.
- Verdict: `complete` only if the completion contract is satisfied; otherwise
  `pending` or `partial slice landed`.

Per [`permanent-doc-is-the-consolidation-record`](../../rules/permanent-doc-is-the-consolidation-record.md):
no disposition-ledger paths, no item counts, no before/after buffer inventories,
no before/after fitness table, no provenance pointers. The commits and the
permanent homes are the record. If a fitness file is still worse than soft at
rest, name it as a live signal and what it points to — that is an observation,
not closeout accounting.
