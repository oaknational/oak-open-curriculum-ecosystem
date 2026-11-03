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

The goal, in the owner's words (2026-10-01): "we are not here to tidy things
away or hit numerical goals, we are here to make sure that knowledge is
preserved, discoverable and accessible. Where there is ceremony it is only
permitted to exist where it serves practical purpose, the ceremony is there as a
sometime required enabler, it has no value in its own right, but it does have
cost." Every count this skill reports (buffer entries, register entries, a
fitness reading, the two-estate divergence measure) is a noticer for that goal
and never the goal; every move answers where a seat will look for the knowledge
afterwards; and every step this skill names is performed only where it serves a
reader or a purpose that day.

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

**Dated note (2026-07-31, ADR-221 obligation 5)**: this invariant's
highest-impact-home test is PDR-134's stratum-homing stated informally —
"a portable decision in the PDR that travels to every repo" is the
generality axis; run the PDR-134 homing questions when the home is in
doubt, and the two disciplines are one.

## Approach

This is deep, thoughtful work. It takes time. It must be done first hand.

Secondhand knowledge is not enough. A consolidation is single-agent: the seat reads every
piece itself and no sub-agent reads for it. The owner, 2026-10-11, verbatim: "Consolidation
sessions are single agent only, work via subagents loses all direct understand and therefore
loses lessons" (seventeen analysts over the notebooks, the stream and the memories were
stopped at the word, and their output was not read as a substitute). A summary of a block is
not the block: the understanding that makes a lesson homeable is formed only in the reading,
and a seat that reads summaries homes plausible artefacts it has not understood. Reviewers and
the Cricket panel verify and judge; they never read for the seat.

Do not rush. Knowledge curation, conservation of insight, they are all that matters.

Never chase fitness functions, they are a signal, not a goal. Caring for understanding is the only goal.

## Required Grounding

Before substantive work:

1. Read and apply
   [`start-right-quick`](../../start-right-quick/SKILL-CANONICAL.md).
2. Read and apply
   [`consolidate-docs`](../consolidate-docs/SKILL-CANONICAL.md).
3. Declare mode `dedicated-knowledge-curation`.
4. State this bridge explicitly in your own words:
   fitness output is routing evidence, while the value is conserving insight
   and completion requires real item-level buffer disposition plus no file
   worse than soft at rest.
5. Check active claims, comms, and git state before edits. Open narrow claims
   for touched surfaces.
6. **Recompute any staged base first-hand.** A pre-staged session input — a
   cut worktree, an input manifest, a pre-named branch or base — is a
   hypothesis, and its BASE is the load-bearing part: before substantive
   work, derive first-hand which branch carries the live memory estate
   (napkin, registers, thread records) and reconcile the working base with
   it. A dedicated pass run on a stale base rotates a stale napkin and sets
   up the stale-capture-wins silent revert (worked instance 2026-07-20: a
   staged consolidation worktree was cut from the default branch while the
   live memory rode the coordination branch; caught only by this
   recomputation, Director-confirmed). Prediction (PDR-130): with this step
   loaded, staged-base mismatches surface AT pickup and stale-base rotations
   drop to zero; if the check never fires across a quarter of staged
   sessions, fold it into the general grounding line. Second instance
   (2026-10-13): the dedicated seat's lane was cut from the default branch by
   the worktree rule's default and lacked three days of records; a side agent
   surfaced it before pickup, and the owner had the lane re-based onto the
   coordination branch with the default branch merged in first. The mismatch
   surfaced at pickup, as predicted, but by another reader; this step's own
   check runs before the first edit, never after a staged cut is trusted.
7. **Read the register for directive-bound entries, and declare the shape.**
   If any due entry in `pending-graduations.md` targets
   `.agent/directives/`, the pass needs a context below 30 % at the directive
   edits (`directive-file-context-budget`), and a first-hand read of the raw
   sources, the napkin and the registers spends most of that headroom. So say
   at open how the pass will meet both, keeping directive work the final step
   the rule sequences: the earlier stages in this context and the directive
   edits alone in the next, or, when the earlier stages are already done, a
   fresh context that opens at the directive step, with the owner seeing the
   shape before any work is staked. A
   review round on a fold, and each read of a large doctrine file, is spent
   out of the same budget. Worked instance (2026-09-16/17): one dedicated
   consolidation reached its directive boundary above 30 % in its first
   context and declared the shape only then; its second context had to fold
   a due branch first, and the fold's pre-publication pass and review rounds
   left too little headroom, so the directive entries moved to a third. Prediction (PDR-130): with this
   step loaded, a consolidation with directive-bound entries names its
   contexts at open and finishes its directive entries in a planned context;
   falsifier: the next such pass discovers the split at its end again.
   The falsifier fired (2026-09-17 to 2026-09-19): the same seat named the shape at
   open at 13 %, then spent the headroom on a fold's three review rounds and on reading
   six directives during the fold's waits, and stood at 51 % with no directive edited;
   across four contexts and four folds no register entry left (eleven, then twelve). Naming
   the shape at open is not enough. Two further requirements: read the figure again
   after any fold's last push and before the first directive edit
   (`directive-file-context-budget` §Sequencing), and state the pass's own measure (the
   register's count, the buffers' undrained items) first in every report to the owner,
   naming work that does not move it as not moving it. Falsifier for these: a pass that
   does both still reaches its directive step over the line, or still reports folds as
   progress while the register's count stands.
   **Price the pass at open, not only the level.** A context figure says where the seat
   is; it does not say whether the next step fits. Every surface the pass must read whole
   is sized before the plan is staked (`wc -c`, bytes over four is a fair token estimate;
   a reader that refuses a read has priced it for you), and the sum is set against the
   headroom. A surface that does not fit is given a context of its own at the outset, never
   started and abandoned: a half-read surface cannot be curated or archived. Worked
   instance (2026-09-19): "the large memory files" was planned as one step; the first big
   record cost 55,000 tokens to read, the next two 75,000 and 90,000, and the seat
   stopped 740 lines into the first with nothing moved. Falsifier: a pass that priced its
   reads still stops mid-surface for lack of headroom.
   A surface larger than a few thousand tokens is read by SPLITTING it, never whole into the
   curating seat's context (owner, 2026-09-20: "Do not fill up the context pointlessly with
   giant files, pick one file, split it, analyse the pieces separately, then analyse the
   analyses to find what was lost by splitting, repeat"): split at entry or section
   boundaries; the seat reads one piece at a time and keeps its notes per entry as it goes
   (the status line verbatim, its class, its cross-references, the cure surface it names),
   never dispatching a piece to an analyst (the owner's word of 2026-10-11 in §Approach; a
   fleet sent on this clause's earlier wording was stopped at the word); then it runs the join
   checks over the whole file by grep (every cross-reference resolves, every id occurs once, a
   status stated in another entry agrees), because the join is where a split loses
   information. Worked instance (2026-09-20): two records of 3,794 and 4,612 lines read whole
   into one context cost about 160,000 tokens; the reading by pieces, notes kept per piece,
   holds one piece in context at a time.
   A context's budget for the job runs to the compaction itself, never to a wrap the seat
   chooses early: a seat cannot trigger its own compaction, so a wrap followed by
   "holding for the compaction" only stops the job (owner, 2026-09-20: "wrapping and pushing is
   no use whatsoever if you can't trigger your own compaction, which you can't, all you are
   achieving is stopping"). Past the meter's peak the seat keeps working in bounded pieces (one
   record, one commit) with its records current, and runs the compaction drill when the owner
   calls a compaction (PDR-063 §Context readings never stop a seat); an owner's freeze order
   governs only the compaction it names.
   The job's scope, in the owner's words (2026-09-20): "you are supposed to analyse the
   buffers, preserve the knowledge, then analyse and preserve the knowledge in the oversized
   memory files, nothing else". A report reads as an end to its writer, so a seat that cannot
   trigger its own compaction stops at the same mark as many times as it reports; the piece
   that follows a report is a named unit of loss-tolerant work, never "continue" (three stops
   at one mark, 2026-09-20). A curation's cost has two parts: the reading, paid by the
   analysts, and the re-emission of every kept line, paid by the seat; the split method halves
   only the first, so the seat chooses Write when the kept text is shorter than the removed
   range and Edit otherwise (about a quarter of one context went on re-emitted kept lines,
   2026-09-20). "Left live" is a verdict with a proof, not a deferral: a record is handled when
   the lifecycle question has been answered for every section and the answer left a proof (an
   archive blob, a recorded verdict, a named home), and a left-live verdict costs one deleted
   snapshot.
   A price is set against the figure of the context that will pay it, so a plan carried
   across a compaction is priced again at resume before it is repeated to the owner. The
   30 % gate prices directive edits only; a memory file needs headroom to be read whole,
   and nothing more. Worked instance (2026-09-20): a plan written at 65 % ("each large
   record needs a context of its own") was told to the owner as a blocker at 40 % of a
   million-token window, with about 600,000 tokens free, and the owner corrected it.
   **Reserve the last step's price.** Directive work is the pass's final step and the one the
   30 % gate closes on, so its cost is set aside at open (the bytes of the directives to be
   read whole, over four, plus the edits), and an earlier stage stops when the headroom
   reaches that reservation, however unfinished it is. Where a standing rule with a deadline
   (a DUE branch fold) would spend the reservation, that collision is put to the owner once,
   as a question about which gives way for this job, at its first occurrence. Where the
   owner's launch prompt already answers it (the dedicated-consolidation prompt ranks the
   job above the daily fold), that answer holds for the session the prompt launched and
   no other, and the seat records on the branch's pull request that the fold is late by
   the owner's word. Source: OCE's retrospective of 2026-09-20 on why
   its register stayed at twelve for three days.
   Falsifier: a pass that reserved still reaches its directive step over the line.

8. **Choose the instruments once, at open; the launch prompt need not.** This skill is the
   whole procedure, so a launch prompt can be one line naming it, the owner's measure and
   anything specific to the day. Loading several skill bodies at open spends the headroom
   step 7 reserves, so each of these is decided here and loaded only when it fires:
   - *Other seats live?* If the claims registry or the stream shows one, apply
     [`start-right-team`](../../start-right-team/SKILL-CANONICAL.md) (watcher first) in
     place of the solo grounding; on a shared host each seat's gate runs stay inside its own
     worktree, at most two side by side
     ([`no-unbounded-host-load`](../../../rules/no-unbounded-host-load.md) item 6), and a
     seat says on the seats' channel when one starts.
   - *A retrospective first?* Only when an arc has finished since the last consolidation
     and its cost or shape surprised; otherwise it follows the pass, at the owner's word.
   - *Parallax?* At screening depth, at a real fork whose frames differ; where each lesson
     belongs is decided by reading the target, not by an inquiry.
   - *Metacognition, free play, concept exploration?* At boundaries (a stage's end, the
     wrap), written to the napkin as they are done; a proposal they produce is landed in its
     home in the same commit when it is small.
   - *Tombstones* found or made along the way are removed as met
     ([`no-tombstones-for-removed-ideas`](../../../rules/no-tombstones-for-removed-ideas.md)).

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
   graduate, then archive, and only after full processing). Never trim understanding or raise a limit to change
   a report: both optimise the proxy and leave the impact untouched (and
   [`permanent-doc-is-the-consolidation-record`](../../../rules/permanent-doc-is-the-consolidation-record.md)
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
   Cursor, Gemini), non-repo plans, entry-point drift, any explicitly named
   comms-event evidence, and any **discovery-run rescue set** named as intake
   for the pass (a plan-carried work-list per `consolidate-docs`
   §Discovery-Run Rescue Sets — every entry dispositioned, the owning plan's
   workstream completed). Platform file lifecycle may be external, but
   the knowledge disposition is not optional.
5. Every decidable item has been decided (graduated, rejected, or duplicate). An
   item that genuinely cannot be decided this pass remains a live decision-debt
   entry (status `pending` / `due` / `overdue`) visible in the count, to be
   graduated or rejected on a later pass.
6. The closeout reports the **value and impact** — what knowledge reached which
   permanent home, what behaviour it changes — not an accounting of dispositions.
   The commits and the permanent homes ARE the record that the pass happened. Per
   [`permanent-doc-is-the-consolidation-record`](../../../rules/permanent-doc-is-the-consolidation-record.md)
   do NOT produce a durable disposition ledger, before/after counts, or
   provenance pointers; completion is verified by the observable end-state
   (buffers drained by deciding, substance live in its permanent home) plus the
   commit, not by an accounting artefact.

Anything else is `pending` or `partial slice landed`, not complete.

## Forbidden Anti-patterns

Never do these to satisfy the goal:

- Substitute orchestration for curation. Curation is first-hand cognition: a mind reads the
  raw material and understands it. A layer of orchestration over it (sub-agents sent to
  discover, filing systems read before anything is found, placement decided before any insight
  exists) yields plausible artefacts that no mind has understood. The owner stopped a
  consolidation session over this on 2026-06-16, after three corrections had each changed the
  output and left the reflex, and affirmed the lesson. A rich harness invites orchestration,
  so the first act of a consolidation is to open one raw source and read it. No fleet reads for
  a consolidation (the owner's word of 2026-10-11, §Approach); where the owner asks for
  reviewers or a Cricket panel, they judge the seat's output, and the seat still reads every
  raw source itself and writes each lesson in its own words.

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
- Perform a step this skill or a rule names when it has no reader and no purpose
  that day (a whole-file snapshot of what the pre-move commit already preserves,
  2026-09-30); a ceremony is an enabler with a cost, never a value in itself
  (owner, 2026-10-01).

Archive moves are allowed only as normal lifecycle cleanup after the item-level
disposition already proves the source content is graduated, duplicate, or
rejected.

A capture surface that accepts appends is a buffer from its birth: name its drain when it is
created. (An append-only record kept as evidence, a diagnostics trace or a provenance log
whose lifecycle the substrate manifest declares as retention, is not a buffer and needs no
drain.) That holds for the consolidation's own working lists. A list of writes still to make is a
buffer, and a session that ends with the list closed, grouped and unlanded has moved the
knowledge from one buffer to another. Count the list's open and landed items first in every
report, and land the memory-surface items as they are found: they need no pull request of
their own, since a records commit on the coordination branch rides its fold (2026-10-02, a list
of 105 with none landed).

## Pre-Archive Verification Gate

Before any command or edit that moves, renames, archives, parks, supersedes, or
replaces a live buffer source, stop and **verify the substance is live in its
permanent home** — read the home, confirm it is there. That verification is the
knowledge-preservation screen. Per
[`permanent-doc-is-the-consolidation-record`](../../../rules/permanent-doc-is-the-consolidation-record.md)
the verification is done in-context and then the item leaves cleanly; do NOT
create a disposition ledger to record what was moved — the commit and the
permanent home are the record. Do not describe the action as making the fitness
check pass; the action is conserving and homing knowledge.

## Work Loop

The pass opens with a counted finish list at the top of its record, each
item with its landing path; a front not on the list does not open until the
list is changed in writing first (a drain whose fronts opened as they were
found had no finish, 2026-10-02). Then repeat this loop until the completion
contract is met:

1. **Inventory.** Run the current fitness validator and build a buffer
   inventory that includes all live drainable buffers and their split or child
   files. Include pending-graduations directories, active/recent memory
   buffers, open-questions, relevant practice boxes, the minimum platform-memory
   set named by `consolidate-docs` (Claude, Codex, Cursor, Gemini), non-repo
   plans, entry-point drift, any discovery-run rescue set named as intake for
   the pass (`consolidate-docs` §Discovery-Run Rescue Sets), and collaboration
   comms only when those surfaces are in scope. For platform-owned files, inventory the learning items and
   record knowledge disposition without taking over file rotation, archival, or
   deletion; if a required platform surface is absent or inaccessible, record
   that as an explicit inventory disposition. The inventory also settles, in the
   owner's words, which surfaces "empty" covers: empty means no un-homed knowledge,
   and a file count is never the measure (owner, 2026-10-01). A bulk act (an archive
   lifecycle, a frontmatter sweep) needs no owner word when every moved entry is
   byte-identical, pointer-linked and its lessons stand at their homes, and the
   close report names the move; the owner's word is asked only for a move that loses
   or relocates knowledge (owner's card, 2026-10-01, re-truing the 2026-09-17
   reading under which "Graduate, then archive" was ruled because the seat asked
   first).
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

Per [`permanent-doc-is-the-consolidation-record`](../../../rules/permanent-doc-is-the-consolidation-record.md):
no disposition-ledger paths, no item counts, no before/after buffer inventories,
no before/after fitness table, no provenance pointers. The commits and the
permanent homes are the record. If a fitness file is still worse than soft at
rest, name it as a live signal and what it points to — that is an observation,
not closeout accounting.
