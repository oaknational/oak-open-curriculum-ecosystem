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

The value of this workflow is that knowledge and understanding come to **exist
where they do the most good — where they will be read at the moment they change a
decision.** That is the only goal. "Correctly homing insight" means placing each
piece where it has the most impact: a lesson in the rule that fires at the action
moment, not buried in a thread record read once; a portable decision in the PDR
that travels to every repo, not stranded in a host-local brief; the live next-step
at the top of the surface the next worker opens, not under landed-arc narrative.

**Thresholds are never what we care about — not ever.** Fitness results, line and
character counts, and buffer sizes are at most a *crude, partial noticer* that some
knowledge may be mislocated, and they are blind to the cases that matter most:
correct-but-buried knowledge, a high-traffic surface diluted by low-impact text, a
lesson homed where it never fires — none of which trips a limit. Never chase a
number, trim understanding, or move content to make a report look better. Place the
knowledge where it has impact; let any fitness change fall out as a side effect.
"No file worse than soft" is a weak proxy to glance at, never the work and never
the point.

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

1. **The insight lives where it does the most good.** Completion is an
   **impact-placement** condition, not a threshold condition: for the knowledge this
   pass touched, is each piece where it will be read at the moment it changes a
   decision? Run `pnpm practice:fitness:informational`, but treat it as one weak,
   partial noticer of *possible* mislocation — never as the question or the gate.

   **Ask the disposition question of the content, never let a number trigger or
   answer it.** Open a surface, read it, and ask *"does this knowledge belong here,
   or where would it have more impact?"* — for every surface the pass touched, not
   only the ones a limit flags. The most important mislocations trip no limit:
   correct-but-buried knowledge, a high-traffic surface diluted by low-impact text,
   a lesson homed where it never fires. A disposition resting only on size, role, or
   a limit — "legit growth", "big continuity file", "over/under the limit",
   "owner-routed" — is forbidden: it answers the proxy, not the impact question.
   When a read finds completed or already-homed narrative diluting a live surface,
   the move is *relocate it to where it lives / drain it* — because that frees the
   surface to do its job for the next reader, **not** because a count fell. For a
   continuity/narrative file, judge the content against the file's own
   `overflow_disposition` / `continuity-practice` §Disposition (leave-if-live; else
   conserve-insight-and-delete). Never trim understanding or raise a limit to change
   a report: both optimise the proxy and leave the impact untouched (and
   [`permanent-doc-is-the-consolidation-record`](../../rules/permanent-doc-is-the-consolidation-record.md)
   forbids the report-gaming).
2. Every live drainable buffer in scope is empty or ready-empty. The
   **open-questions register is driven to zero exactly as pending-graduations is**
   (owner directive 2026-06-28): every entry decided — answered, withdrawn, re-homed
   into its owning artefact, or **explicitly kept open by the user, live, in this
   pass**. A recorded `keep-open granted by user, <date>` note from a prior session
   is a claim to re-verify, never a standing satisfier (`precedence-is-not-approval`;
   owner correction 2026-07-02). An undecided "leave open" does not satisfy this
   contract in a dedicated pass.
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
2. **Choose the next real item.** The organising axis is the **knowledge flow**
   (sources → napkin → distilled → pending-graduations → permanent homes;
   PDR-046's staircase, walked **bottom-up**), NOT the fitness report's
   critical → hard → soft grouping. Process the lower layers first; pending
   graduations and the upper buffers fill *as you climb*, so an empty top buffer
   read before processing the layers below it is not "done" — it is unprocessed.
   Letting the fitness signal organise the pass is the signal → goal inversion the
   Conservation Invariant forbids (owner-corrected 2026-06-21). Fitness severity
   may order work *within* the bottom-up flow; it is never the organising axis.
   Within a buffer, work item by item.
3. **Read before routing.** Understand the source item before editing. Do not
   infer disposition from filename, age, or fitness status.
4. **Route substance.** Move knowledge to the correct durable home, update the
   existing home, or prove the home already contains it. **Graduating a learned
   lesson into its doctrine home is non-deferrable consolidation work — it is the
   point of the pass, not a future session's job.** "Owner-routed" / "owner-gated"
   / "deferred to a synthesis session" is valid *only* for a genuinely
   owner-constitutive **decision** (a verdict, a product-scope call) — never for
   the **homing** of an already-learned lesson. When a captured note (a Director
   brief's standing lessons, a session's distilled entry) holds settled craft,
   learn from it and write it into its permanent home now; do not let an adjacent
   owner-gated decision's gating bleed onto the graduation. Deferring a homing as
   "owner-routed" is the deferral-dressed-as-deference failure (see
   `patterns/legitimate-principle-as-avoidance-cover.md`).
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
