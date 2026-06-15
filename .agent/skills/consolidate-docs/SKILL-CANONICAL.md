---
name: consolidate-docs
classification: active
description: >-
  Declare and run session-completion or dedicated-knowledge-curation
  consolidation, including buffer disposition and closeout proof.
---

# Consolidate Docs

**Scope**: **THREAD-SCOPED** (cross-session). This workflow acts on
artefacts that accumulate across multiple sessions on one or more
threads — pattern candidates reaching the repeats bar, distilled
entries reaching stability, napkin reaching its rotation threshold,
Practice Core drifting from current practice, fitness pressure
accumulating. Session-scoped capture (surprises, ADR/PDR
candidates, subjective experience) belongs to
[`session-handoff`](../session-handoff/SKILL-CANONICAL.md) and fires
every session. This workflow is the **distil-and-graduate edge** of
the capture → distil → graduate → enforce pipeline.

**Governance**: This workflow operationalises ADR-150, PDR-011, PDR-014, and
PDR-046.
Those authorities define the pair: `session-handoff` captures at session
close, while `consolidate-docs` distils, graduates, and enforces only when
cross-session convergence is due.

Deep convergence workflow. This is **not** the default end-of-session flow.

Use this workflow only when one or more triggers hold. If none apply, use
[`session-handoff`](../session-handoff/SKILL-CANONICAL.md) instead.

## Trigger Checklist

Run `consolidate-docs` when one or more of these is true:

- a plan or milestone has closed
- settled doctrine or design rationale exists only in ephemeral artefacts
- practice-box incoming or outgoing needs processing
- napkin, distilled, pattern, or fitness pressure now needs convergence work
- repeated surprises or corrections suggest a new rule, pattern, ADR, or
  governance change
- `.agent/memory/operational/open-questions.md` has more than ten open entries
  or the owner asks for unresolved questions to be drained
- a repeated pattern spans multiple napkin rotations, the owner requests
  historical synthesis, or prior consolidations keep reporting the same
  family without naming its deeper cause
- documentation drift or stale cross-references now need graduation
- a class retention window has elapsed for live comms events (the curator-pass
  archive-move trigger — see step 3a), or the owner opens a comms-corpus
  research / retention plan

This workflow preserves the full deep-convergence role: graduation, pattern
extraction, napkin rotation, fitness management, and practice exchange.

## Mode Contract

### Conservation Invariant

The value of every mode is conserving and correctly homing insight. Fitness
results, line counts, and buffer sizes are diagnostic signals, not goals. Do not
chase lower numbers, trim understanding, or suppress capture to make a report
look better. Process the knowledge, preserve the learning at full weight, move
it to the right durable home, and let any fitness improvement happen only as the
side effect of real curation. Completion evidence is item-level disposition and
truthful closeout, not a softer fitness report.

Start every invocation by declaring one mode. The mode fixes the default scope,
completion criteria, and closeout evidence for the pass.

- **`session-completion`** - bounded closeout. This is the default when the
  owner invokes `consolidate-docs` as part of winding down a session or when no
  dedicated curation objective is named. Capture fresh learning, route obvious
  substance to durable homes, and leave unresolved buffers live with honest
  next actions. A truthful `partial slice landed` verdict is valid here.
- **`dedicated-knowledge-curation`** - proper curation pass. This is the
  default when the owner sets a curation goal, mentions buffers, asks for a
  curation pass, or names fitness pressure as work to process. Route
  documentation/reference surfaces toward healthy-to-soft by preserving and
  homing substance; process drainable buffers item by item until empty unless a
  specific item is owner-gated and remains live with its blocker recorded.

Fitness output is routing evidence in both modes. It is never completion
evidence by itself. `session-completion` must not imply that all curation
buffers were drained. `dedicated-knowledge-curation` may claim `complete` only
when the closeout proof shows both documentation fitness at the agreed
healthy-to-soft target and every drainable buffer item dispositioned.

## Cardinal Rule: Plans, Memory, and Entry Points Are Not Documentation

The canonical methodology and destinations table for moving content out
of ephemeral surfaces lives at
[`ephemeral-to-permanent-homing`](../../memory/operational/ephemeral-to-permanent-homing.md).
Read that methodology before steps 1, 3, 7, and 10 — it carries the
destinations table, the entry-point sweep rule, and the
deferral-honesty discipline that this workflow's homing actions all
defer to. The session-scoped counterpart is
[`session-handoff` step 6d](../session-handoff/SKILL-CANONICAL.md),
which sweeps platform-specific entry points (`CLAUDE.md`, `AGENTS.md`,
`GEMINI.md`, etc.) at every session close.

**A completed plan MUST be safe to delete at any point.** Plans are
execution instructions — they describe what to do and track progress.
They are NOT permanent documentation. Before marking a plan as complete
or archiving it, extract ALL documentation content to permanent locations
per the homing partial. If documentation exists ONLY in a plan, it is at
risk.

## Deferral-honesty discipline applies throughout

Consolidation routinely produces deferrals: pattern candidates kept
in Pending rather than promoted, fitness items deferred to a later
pass, Practice Core refinement queued for owner approval, register
items left unactioned. Every deferral surfaced or recorded by this
workflow MUST satisfy
[PDR-026 §Deferral-honesty discipline](../../practice-core/decision-records/PDR-026-per-session-landing-commitment.md#deferral-honesty-discipline)
(2026-04-22 Session 6 amendment): a named constraint (clock, cost,
dependency, owner veto) or a named priority trade-off, plus
evidence, plus falsifiability (how a future agent could check
whether the constraint or trade-off held). Convenience phrasings
— *"budget consumed"*, *"out of scope"*, *"for later"*, *"next
session"*, *"ran out of time"* — are not acceptable; replace with
the underlying constraint or trade-off and the falsifiability
check. This applies in particular to step 5 (pattern candidates
kept in Pending), step 7 (graduation outcomes deferred), step 9
(fitness items deferred), and step 10 (incoming/outgoing items
held over).

## Learning Preservation Overrides Fitness Pressure

This section is the **per-write rule**: it governs the moment of
individual capture or graduation. The companion **layer-orchestration
rule** is
[PDR-046 (Layered Knowledge Processing — Preserve First, Restructure
Second)](../../practice-core/decision-records/PDR-046-layered-knowledge-processing.md),
which governs how the per-write rule composes when work intentionally
traverses multiple layers (capture → distillation → permanent doctrine
→ permanent-doctrine internal restructuring) in a single pass. Read
PDR-046 alongside this section. Together they form one discipline:
substance is never compressed (per-write rule); fitness applies at
rest, not in-process; the staircase is walked bottom-up until
knowledge has reached its durable home (PDR-046 §Decision).

**Writing to shared-state records of knowledge is NEVER blocked by
fitness limits.** Fitness signals — including SOFT, HARD, and CRITICAL
— are health indicators about the destination file's structure; they
are never a constraint on the insight itself. This rule applies to
the napkin, `distilled.md`, `patterns/*.md`, per-thread next-session
records, repo-continuity, the shared communication log, conversations,
escalations, claims, and every other surface that records shared
state.

The only two valid responses when a write would push a file past
target or limit are:

1. **Write the full observation and flag the file for attention** —
   capture, distil, or graduate at the weight the signal deserves;
   record fitness pressure for routing to step 9.
2. **Thoughtful, holistic promotion of mature concepts and knowledge**
   out of the file to a permanent home — apply the step 7a/7b
   graduation criteria to entries that are stable and have a natural
   permanent destination (ADR, PDR, governance doc, principles, rule,
   README, TSDoc). Promotion is substance-led, not space-led.

**What is NEVER valid**:

- Compressing, trimming, or "summarising" the new insight to fit the
  budget.
- Naively cutting existing entries to make room. Removal is a
  graduation decision, not a space-making decision.
- Skipping or deferring capture / distillation / graduation because
  the destination file is full.
- Preserving a green fitness report by starving the learning loop.

If learning belongs in `napkin.md`, write it. If napkin rotation is
due, distil it. If distilled learning belongs in `distilled.md` or a
permanent home, write it there at full weight. Resulting fitness
pressure routes to step 9 as follow-up structure work — refine,
split, graduate, or adjust limits — never as retroactive permission
to have written less.

When residual fitness pressure persists at rest after a layer's
processing completes, the default response is **graduation upward, not
compression** ([PDR-046 §Move 3](../../practice-core/decision-records/PDR-046-layered-knowledge-processing.md#move-3--a-layers-fitness-pressure-is-addressed-by-processing-the-next-layer-up-not-by-compression)).
Substance ready for its durable home leaves the layer to that home;
the source layer's shape relaxes naturally. Refinement / split /
target-revision becomes the appropriate response **only** when no
substance remains ready to graduate. This is the structural cure for
"the destination is full" reasoning at consolidation: the layer is
not full of substance to remove, it is full of substance to graduate.

## Drainable Buffer Protocol

Drainable buffers are flow-control surfaces. In
`dedicated-knowledge-curation`, "empty" means every item in the selected buffer
has a recorded disposition. It does not mean the content was moved into an
archive, made smaller, split into another buffer, renamed, or hidden from the
live surface.

Buffer identity follows the role, not the filename. Split, child, adjacent,
dated, windowed, backlog, or so-called shard files still count as part of the
same buffer inventory until their items are dispositioned. Do not exclude a file
from the buffer count merely because it was moved under a directory, given a
smaller date range, or labelled as a shard.

Do not create new drainable-buffer child files as a capture, overflow,
decomposition, or fitness-management strategy. New pending-graduation capture
belongs in the canonical register, and existing child files are legacy recovery
debt to inventory and drain in place. If a source item is too large to process
in one sitting, record item-level disposition progress in a ledger; do not make
another buffer file to stand in for that work.

For each buffer item, read the source, understand the substance, route it, and
**classify its disposition as you go** — this is reasoning, not a record to
persist:

- `graduated` - durable home created or updated (verify it is there).
- `duplicate` - already represented in a durable home (verify it is there).
- `owner-gated` - cannot proceed without owner decision; mark it owner-gated in
  its live holding location, with the question.
- `stale-withdrawn` - no longer valid, with reason.
- `carried-forward` - still valid but not drainable in this pass, with trigger
  and next action. This is valid for honest mid-pass handoff or
  `session-completion`; it is not a final completion state for an owner goal
  that asks to continue until buffers are empty or explicitly owner-gated.

Per [`permanent-doc-is-the-consolidation-record`](../../rules/permanent-doc-is-the-consolidation-record.md),
do **not** write these dispositions into a durable ledger, adjacent disposition
note, curation report, or count line. The commit and the permanent home are the
record; a ledger restating "item X went to home Y" is accounting, not value.

**Pre-archive verification gate**: before any command or edit that moves,
renames, archives, parks, supersedes, or replaces a live buffer source, stop and
**verify the substance is live in its permanent home** — read the home, confirm
it is there. That in-context verification is the knowledge-preservation screen;
do not create a ledger to record it. Do not frame the action as making a fitness
check pass; the action is conserving and homing knowledge.

**Checklist failure / anti-example**: archiving a buffer or source file before
reading, extracting, routing, and verifying the home is not curation. An
archive-only "drain" leaves the buffer live for completion purposes, even if
the fitness report becomes softer afterward.

**Fitness anti-pattern**: split, shard, archive, rename, or delete operations
performed primarily to change the fitness category are self-delusion, not
curation. Curation is verified by the homed substance and the commit, never by an
accounting record of what was moved.

## Plan supersession discipline

When a plan is narrowed, reframed, or superseded, the same change set
that performs the supersession MUST also land a supersession mapping.
The mapping records, for every dropped scope item:

1. **Item moved** — verbatim frontmatter id or section heading.
2. **New owner plan** — file path of the plan now owning the scope.
3. **Acceptance lane** — the named todo or section in the new owner.
4. **Rationale for move** — one-sentence reason for the route choice.

The mapping lives in the receiving archive's README (e.g.
`.agent/plans/<workspace>/archive/superseded/README.md`) or as an
appendix on the archived source plan itself, **never as a standalone
plan**. A standalone crosswalk plan after the supersession lands is
duplicative; the audit trail belongs adjacent to the artefact it
traces.

(Doctrine graduated 2026-04-29 from
`sentry-observability-translation-crosswalk.plan.md` §Verification
Rule; the standalone crosswalk plan was archived in the same pass.)

## Steps

1. **Verify documentation is current.** Documentation should be produced during work, not deferred to consolidation. Check that architectural decisions, system behaviour, and technical reference are already documented in their permanent locations (ADRs, `docs/`, READMEs, source TSDoc). Then scan active and recently completed plans for any remaining content that describes how things work (not what to do next) and move it to the appropriate permanent location. Plans should contain only: status, next steps, execution instructions, and references to permanent docs. When a repo-level workflow surface has been renamed, explicitly sweep live milestones, roadmaps, active/current/future plans, templates, and platform memory for the old term; surface drift often survives there after the canonical docs are fixed. **Include non-repo plans**: check platform-specific plan locations (e.g., `~/.claude/plans/`) for plans generated by the current platform that contain valuable grounding, audit findings, or design rationale not yet captured in repo plans. Extract any such content to the canonical plan or permanent docs before it is lost.
   **Audience-facing freshness (owner-directed 2026-06-12)**: two
   evaluator-facing signals are checked at every dedicated consolidation
   pass. (a) *Progress reports*: compare the newest
   `oak-ecosystem-progress-*` report in `.agent/reports/` against what has
   materially shipped since its date; when materially stale, draft a
   successor from the consolidated knowledge for owner review —
   agent-drafted, owner-approved, never auto-published. (b) *Onboarding
   signal* (internal only): when onboarding entry paths have changed
   materially since the last persona-simulation evidence in the onboarding
   status register, record a rerun recommendation on that register so the
   simulation scores stay a live direction-of-travel signal. Neither check
   publishes anything by itself; both convert staleness from silent decay
   into a named consolidation output.
2. Make sure all plans and prompts are fully up to date (status lines, completion markers, cross-references). After archive/delete moves, explicitly sweep for the two most common stale-link classes: `active/` or `current/` plan paths that should now point at `archive/completed/`, and deleted platform-plan paths such as `.cursor/plans/*.plan.md` that should now point at the canonical repo artefact they delivered.
3. **Sweep ephemeral surfaces and home settled content.** Identify
   any content in ephemeral locations that now functions as settled
   documentation, and home it per the
   [ephemeral-to-permanent-homing methodology](../../memory/operational/ephemeral-to-permanent-homing.md)
   (canonical destinations table, entry-point rule, deferral-honesty
   discipline). At thread-scoped depth, the surfaces to sweep are
   the full superset of what `session-handoff` step 6a auxiliary
   inputs and step 6d entry-point sweep already cover — the same
   surfaces are read at session close (own-platform, session-scoped
   substance) and again at consolidation (cross-platform, cross-session
   substance):

   - **Capture surfaces**: `.agent/memory/active/napkin.md`,
     `.agent/memory/active/distilled.md` (the staging surface itself,
     not yet graduated), prompt artefacts.
   - **Session comms-events** (mandatory curation — the untrack safety
     net): `.agent/state/collaboration/comms/` (and the generated
     `shared-comms-log.md`) carry coordination-context substance —
     owner-direction-captured-inline, inter-agent surprises, tooling
     friction discovered during cross-agent work, decision timelines,
     PDR-066 failure-mode / behaviour-note events, and worked instances of
     coordination-cure patterns. `.agent/state/` is untracked-by-design
     (ADR-199 / PDR-094 Invariant 6): the comms tier is on disk but no
     longer in version control, so curating its durable knowledge into
     permanent homes is a **non-optional** consolidation step — version
     history is no longer a backstop. Extract durable substance to the
     smallest appropriate home (napkin → `distilled.md` → ADR/PDR/pattern).
     Rotation of the raw events (archive-move into the gitignored
     `comms-archive/`) is the curator-pass mechanism in step 3a below;
     do not delete events, and remember the archive-move is gated on a
     recorded disposition per event.
   - **Plan surfaces**: active and recently completed plans (per step
     1 above) — surface any content that describes how things work
     rather than what to do next.
   - **Platform-specific per-user memory**: session logs and
     curated memory outside the repo, one location per platform
     per user. Every consolidation run checks at least Claude, Codex,
     Cursor, and Gemini. If a surface is absent or inaccessible on the
     current machine, record that fact in the disposition evidence instead
     of silently skipping it. Named instances:
     - Claude Code: `~/.claude/projects/<project>/memory/`
       (curated auto-memory; `MEMORY.md` + per-entry files)
     - Codex: `~/.codex/memories/` (curated memory files),
       `~/.codex/history.jsonl` (rolling session history),
       `~/.codex/archived_sessions/` (older session archives)
     - Cursor: `~/.cursor/chats/` (per-session transcripts),
       `~/.cursor/prompt_history.json` (accumulated prompts)
     - Gemini CLI: `~/.gemini/` memory, history, or session surfaces
       when present; if Gemini exposes no separate memory surface on the
       current machine, record `not present` rather than inventing a path.

     These are platform-specific napkin analogues. Agents
     running on any platform scan the minimum four-platform set above
     when accessible; at consolidation, insights with cross-platform value
     flow into the canonical napkin or `distilled.md`, or directly to
     permanent homes if stable. Do not assume every platform's memory is
     readable on every machine — unavailable surfaces are explicit
     dispositions, not silent skips. Cross-platform ingestion is a
     consolidation-time activity, not a session-open activity.
   - **Platform-specific entry points**: `CLAUDE.md`, `AGENTS.md`,
     `GEMINI.md`, and analogous host adapters. Session-handoff
     should already have caught these; re-sweep at thread-scoped
     depth as a backstop and to catch any drift the session-scoped
     pass missed.

   Per the standing direction codified in the homing partial: *all
   content must be moved to permanent homes or, if not useful,
   removed*. Silent deletion without homing is not the default.
3a. **Comms-event rotation is a class-tiered, archive-not-delete curator pass**
    (ADR-199 / PDR-094 — the preservation hold ended when WS7 of the comms-corpus
    research plan ratified and executed the rotation, 2026-06-14). Rotation
    **never deletes**: it archive-moves events past their class retention window
    out of `.agent/state/collaboration/comms/` into the gitignored, off-drain-path
    `.agent/state/collaboration/comms-archive/`, recording one `manifest.jsonl`
    disposition row per event. It is gated three ways and these gates are
    non-negotiable:

    - **Absorption gate (PDR-094 operative gate):** an event moves only once its
      disposition is recorded — absorbed into a durable home, classified routine,
      or quarantined. Bulk routine/noise classification on **title genre alone is
      never sufficient**; a bulk pass body-reads a sample plus every over-length
      body (the `3cc1fb93` falsifier).
    - **Provenance gate (Invariant 3):** the pre-archive-move provenance check
      (`pnpm --filter @oaknational/agent-tools comms-provenance-check`) must report
      0 violations — it refuses to move any event cited in a permanent doc that
      lacks inline-quote or digest coverage.
    - **Class tiers:** heartbeat 48h (cadence aggregate extracted once first),
      coordination/directed 7d, diagnostic/test/noise immediate-after-body-read,
      research-precious until graduated. The windows are hygiene targets, not
      drain-health-derived bounds (Invariant 4).

    The mechanism is the tested agent-tools harness
    (`comms-archive-move`, dry-run by default; `--execute` gated). Knowledge
    curation (the step-3 comms-events bullet above) is the **absorption** that
    satisfies the gate; it precedes or accompanies any move. `shared-comms-log.md`
    is a generated recent-view artefact (regenerate when comms-state writes make
    it necessary) and goes untracked with no disposition-ledger entry — provenance
    attaches to the events, never to the rendered log.
4. **Audit `.agent/experience/` for three things, not one.** The experience directory is for *subjective experience* — what work was like, not what was done. The audit therefore has three distinct purposes (see [`../../experience/README.md § Why the audit step exists`](../../experience/README.md)):

   a. **Preserve the purpose** — scan for files that have drifted into technical content; this displaces the subjective register the files are meant to hold.

   b. **Recover stranded insight** — where technical content is found, extract it to its proper home (`distilled.md`, permanent docs in `docs/`, ADRs, READMEs) and replace the experience file with a brief reflective stub.

   c. **Surface emergent insight across experiences** — read recent experience files together, not individually. Patterns, principles, or decisions that no single experience named may become visible only when several are read as a whole. Name these elsewhere as pattern candidates, PDR candidates, ADR candidates (surface to step 7a for graduation).

   Purpose (c) is the most valuable and the most easily skipped. Even when purposes (a) and (b) produce no work (no drift, no stranded content), purpose (c) still fires — read across the recent experiences with the cross-plane / cross-session lens, and record any emergent observation for the graduation scan.

   Experience writing is **strictly voluntary** (see [`experience/README.md`](../../experience/README.md)): there is no quota, obligation, or session-close requirement, and the corpus is **not** monitored for volume or thinning. Pressure to record distorts the motivation and the result — a reflection written because it felt *due* is performance, not experience. Do **not** treat a quiet or thinning corpus as a problem, a degraded capture edge, or a loop-health signal; not writing is a valid, ordinary outcome. Purpose (c) reads across the experiences that *do* exist to surface emergent insight — it never measures whether enough were written.
5. **Extract reusable patterns.** Review completed work for patterns that meet the barrier: broadly applicable, proven by implementation, prevents a recurring mistake, and stable. This covers all types of learning — code patterns, process patterns, architecture patterns, structural observations, agent operational concerns, behavioural rules, domain-specific gotchas — anything reusable that would change behaviour if read before similar work. Extract qualifying patterns to `.agent/memory/active/patterns/` as specific ecosystem-grounded instances (one pattern per file, markdown with frontmatter). See `.agent/memory/active/patterns/README.md` for the frontmatter schema, category options, and barrier criteria.

   **Three destinations, not one** (per PDR-007). The substance shape determines the home:

   - **Engineering instance, ecosystem-specific** → `.agent/memory/active/patterns/`. TypeScript/Zod/Vitest/SDK-specific patterns live here. Each entry is proven in a concrete repo context. Most pattern candidates land here.
   - **Engineering abstraction, ecosystem-agnostic** → Practice Core PDR
     with `pdr_kind: pattern` (via **synthesis**, not move). When ≥2
     instance patterns across repos or ecosystems express the same underlying
     general principle, author the general form fresh as a PDR. **Instances
     stay in `memory/active/patterns/`** — synthesis does not move them. The
     former Practice Core `patterns/` directory is retired by PDR-007.
   - **Practice governance** (review discipline, planning discipline, knowledge-flow discipline, reviewer authority, agent infrastructure, etc.) → **not a pattern; it is PDR-shaped.** Surface the candidate under step 7a (PDR scan) instead. Practice-governance patterns absorbed into PDRs keep their instance files in `memory/active/patterns/` with `related_pdr: PDR-NNN` frontmatter linking to the general governance form.

   **Cross-session scan**: Read napkin entries from the current rotation window as a chronological sequence, not just the latest session. The most important patterns often emerge from the *interaction* of observations across sessions — a correction in session 4 may reframe an observation from session 1, or a recurring mistake across sessions may reveal a structural cause invisible in any single session. Ask: "What do these sessions know together that none knows alone?" See `patterns/cross-session-pattern-emergence.md`.

   **Taxonomy-seam meta-check** (Family B Layer 1 per [PDR-029](../../practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md); consumes register item `memory-taxonomy-meta-check`): ask — *"Did any napkin entry or pattern candidate in this pass resist classification into the three memory planes (`active/`, `operational/`, `executive/`)? Did any entry naturally belong in multiple planes at once?"* If yes, capture as a seam-review candidate in the pending-graduations register with `graduation-target: taxonomy-review`. Multiple seam-review candidates accumulating (≥3 in a single consolidation, or ≥5 across consecutive consolidations) signal that the three-plane taxonomy itself needs re-evaluation — raise with owner for a `taxonomy-review` session rather than forcing candidates into an ill-fitting plane.

   **Cross-plane path scan** (Family B complement; per PDR-028 Executive-Memory Feedback Loop): for each napkin entry or pattern candidate in this pass, ask — *"Does this carry `Source plane: executive` or `cross_plane: true` as an origin / span tag (per [PDR-030](../../practice-core/decision-records/PDR-030-plane-tag-vocabulary.md))?"* Entries tagged across planes route through the graduation channels defined in PDR-028 rather than the default same-plane channel.
6. **Rotate the napkin if needed.** If `.agent/memory/active/napkin.md` exceeds ~500 lines, perform the distillation rotation:

   **Process before archive**: archiving is the final preservation move for an
   already-processed source, not a parking place for unfinished curation. Do
   not archive unprocessed napkin content. Steps (a) through (c) must leave each
   behaviour-changing item with a disposition - merged, refined, explicitly
   skipped as duplicate, routed to pending graduation, or investigated as a
   contradiction - before step (d) moves the outgoing source. If the pass is
   `dedicated-knowledge-curation`, this disposition evidence must satisfy the
   drainable-buffer ledger protocol above.

   In a multi-agent window, the napkin is a moving surface: a peer may commit a
   lesson between your read and your rotation. Diff the archived window against
   your working read (or `git log -p` the napkin) BEFORE asserting the rotation
   homed everything; a verbatim archive conserves the peer's entry but your
   graduation pass never saw it.

   a. **Extract** — read every "Patterns to Remember", "Mistakes Made", "Key Insight", and "Lessons" section from the outgoing napkin. Collect all entries that would change behaviour if read next session.
   b. **Merge** — compare extracted entries against existing `distilled.md`. For each entry: new insight → add it to the appropriate section; duplicate → skip; refinement of existing rule → update with the sharper formulation; contradiction → investigate (the more recent finding usually wins, but verify before overwriting).
   c. **Prune** — remove entries from `distilled.md` that have already been captured in permanent documentation. No duplication across tiers. (Graduation of settled content happens in step 7.)
   d. **Archive** — move the processed outgoing napkin to `.agent/memory/active/archive/napkin-YYYY-MM-DD.md` using the current date.
   e. **Start fresh** — create a new `.agent/memory/active/napkin.md` with a session heading documenting the distillation.

   Target: `distilled.md` should stay under 200 lines of high-signal content.
   Every entry earns its place by being specific, actionable, non-obvious,
   and terse. This target is a refinement signal, not a veto: if preserving
   the learning pushes `distilled.md` over target or hard limit, preserve the
   learning first and route the resulting fitness pressure to step 9. Do not
   distil mid-session, do not distil if the napkin is under 400 lines, and do
   not distil "What Was Done" sections — those are session history, not
   learnings.
6a. **Run archive-scale historical synthesis when triggered.** This is a
    distinct cadence from the current-rotation cross-session scan. Run it when
    the trigger checklist names historical synthesis, when the owner asks for a
    holistic napkin pass, or when repeated observations span multiple archived
    rotations. If the current napkin belongs in the selected corpus and is due
    for rotation, complete step 6 first so the historical pass reads processed
    capture rather than in-flight capture.

    Read the selected current + archived napkins as one historical corpus after
    their ordinary per-napkin processing has happened. Ask: "What does the
    archive know now that no individual rotation could have known then?"

    Keep the pass bounded. Before reading, name the corpus window: either all
    napkins since the last historical-synthesis marker, the last N archived
    napkins, or the napkins matching a specific thread / theme. Do not reread
    the whole archive by default unless the consolidation is explicitly a
    historical pass.

    Write a synthesis report before mutating doctrine. Default home:
    `.agent/research/agentic-engineering/continuity-memory-and-knowledge-flow/`
    with filename `historical-napkin-synthesis-YYYY-MM-DD.md`. The report is
    the persisted marker ledger; the newest report's processed marker is where
    the next "since last marker" pass starts. The report records:

    - `Corpus window` — exact current / archived napkins read.
    - `Selection rationale` — why this window was selected.
    - `Processed marker` — the archive boundary future passes can start after.
    - `Emergent findings` — what the corpus knows that no single napkin knew.
    - `Evidence arcs` — chronological links across entries that support each
      finding.
    - `Rejected near-patterns` — tempting syntheses that did not clear the bar.
    - `Routing decisions` — destination and status for each finding.

    Findings then route through the ordinary destinations: `distilled.md`, the
    pending-graduations register, host pattern instances, ADRs, PDRs (including
    `pdr_kind: pattern` for ecosystem-agnostic abstractions), rules, skills,
    or permanent docs. Source archived napkins are evidence; do not rewrite
    them.
7. **Graduate settled content.** This is the "enforce" edge of the knowledge flow (ADR-131 §Interaction Points, ADR-150 §Decision §5 — capture → distil → **graduate → enforce**). Treat it as a structural step, not a pass-through.

   **Inputs to the graduation scan**:

   - `.agent/memory/active/distilled.md` — refined cross-session entries from prior napkin rotations.
   - `.agent/memory/active/napkin.md` — recent surprises and candidate tags.
   - **[`.agent/memory/operational/pending-graduations.md`](../../memory/operational/pending-graduations.md) (the pending-graduations register)** — the structured list of captured candidates with per-item `captured-date`, `source-surface`, `graduation-target`, `trigger-condition`, and `status`. Items with `status: due` or `status: overdue` are the primary graduation candidates for this pass. Items with `status: pending` are reviewed to see whether their trigger condition has fired since last consolidation. Items with `status: owner-gated` are **not** parked indefinitely. Per the owner direction of 2026-06-04 ("owner-gated should be collapsed into owner-directed"), `owner-gated` must not function as a graveyard: a consolidation session with the owner present is itself the venue, so **walk every owner-gated item with the owner** during the pass, not only those whose sole trigger is owner-direction. Present them as a recommendation-first digest (graduate / withdraw / confirm genuinely-event-gated); the owner may graduate a strong single-instance candidate now or override an external-event gate (a second-instance trigger is a default, not a barrier when the owner is present). Items left after the walk are those the owner explicitly confirms are genuinely waiting on an external event. The register was split out from `repo-continuity.md § Deep consolidation status` on 2026-04-30; older references to that location route here.
   - **[`.agent/memory/operational/open-questions.md`](../../memory/operational/open-questions.md) (the open-questions register)** — the structured list of non-urgent unresolved decision-shapes with `Q-NNN` identity, context, deferral reason, suggested resolution path, status, and links. Open entries are not graduation candidates by default; they are consolidation-time questions to answer, surface to owner, withdraw, or leave open with deferral-honesty.

   **7a. Scan for ADR-shaped and PDR-shaped doctrine** (do this *before* applying the three outcomes below). Walk every entry in `distilled.md` and every recent napkin surprise and ask two questions:

   **Is this ADR-shaped?** An entry is ADR-shaped when:

   - It names an **architectural constraint, trade-off, or boundary** (not just an operational convention);
   - It is **stable across sessions** (has survived at least one subsequent session without correction);
   - It has **no existing governance home** (no ADR, no `docs/governance/` doc, no README section that already covers it);
   - It shapes **this repo's product architecture** (the next contributor in this repo would re-derive this decision without an ADR).

   **Is this PDR-shaped?** An entry is PDR-shaped when:

   - It names a **decision about how the Practice itself operates** (review discipline, planning discipline, knowledge-flow discipline, reviewer authority, consolidation discipline, agent infrastructure, cross-platform architecture, etc.) — substance about the Practice as a system, not about a specific repo's product;
   - It is **stable across sessions**;
   - It has **no existing Practice-governance home** (no PDR in `.agent/practice-core/decision-records/`, no section in the trinity that already covers it);
   - It would be **re-derived across repos** in the Practice network if not recorded. The adopter scope test: ADR adopter = next contributor in this repo; PDR adopter = next Practice-bearing repo that hydrates the Core. Decisions that would be re-derived across repos are PDRs; decisions re-derived within this repo are ADRs. See PDR-019 for the full reusability test.

   Pattern-shaped governance (e.g. reviewer dispatch patterns, review-discipline patterns) takes the PDR shape with `pdr_kind: pattern` frontmatter, not a memory/patterns entry. See PDR-007.

   Surface ADR candidates and PDR candidates explicitly to the user as two separate numbered lists, with a one-line justification each. The user decides which to promote, which to send to other governance surfaces, and which to leave distilled for further validation. **Do not silently leave ADR- or PDR-shaped doctrine unpromoted** — that is the enforce-edge failure mode ADR-131 §Self-Referential Property warns about. If nothing qualifies in a given category, say so and move on.

   **7b. Apply graduation to each distilled entry.** For each entry, apply two criteria:

   a. **Stable?** — not contradicted by recent work.
   b. **Natural home?** — an existing permanent doc (ADR, governance doc, README, TSDoc) where it belongs.

   A fired trigger is not "graduate standalone now". When a pending-graduation's
   trigger fires, the next check is WHERE its permanent home lives. If that home
   (an ADR, contract, doc section) is owned by an active mid-flight thread,
   authoring a standalone artefact collides and duplicates — defer to the owning
   thread, and survey the plan estate (not just the register) before authoring.

   Three outcomes:

   - **Both met** — create the permanent doc entry first, then remove from `distilled.md`.
   - **Stable but no natural home** — do not leave it in distilled.md indefinitely. Raise this with the user: the content may justify *creating* a new permanent home (a new doc section, a new ADR, a new governance page). The conversation is the point — stable knowledge without a home is a signal that the documentation structure has a gap.
   - **Not yet stable** — leave in distilled.md for further validation.

   Always graduate useful understanding — fitness pressure on the target doc is handled in step 9 via the three-zone scale, never by deferring graduation. The barrier is "stable and useful enough to place," not "no longer agent-operational." Common destinations:

   - **Rules / principles** codified in `.agent/directives/principles.md`.
   - **Host-repo architectural decisions** → ADRs in `docs/architecture/architectural-decisions/` (or host equivalent).
   - **Practice-governance decisions** → PDRs in `.agent/practice-core/decision-records/` (portable; travels with Core). Pattern-shaped governance uses `pdr_kind: pattern` frontmatter.
   - **General abstract engineering patterns** (ecosystem-agnostic, synthesised from ≥2 instances) → PDRs in `.agent/practice-core/decision-records/` with `pdr_kind: pattern` (portable; travels with Core; authored fresh via synthesis — instances stay in `memory/active/patterns/`).
   - **Specific engineering pattern instances** → `.agent/memory/active/patterns/` (repo-local, ecosystem-grounded).
   - **Tooling documentation** → `docs/engineering/build-system.md` or equivalent.
   - **Workspace-specific gotchas** → workspace READMEs.
   - **Meta-principles about the Practice itself** → `.agent/practice-core/practice-lineage.md` Learned Principles section, OR (when substantial enough) a dedicated PDR in `decision-records/`.

   Practice Core structural changes (new sections, reorganisation, new artefact types, new Core directories) are rare but valid — they require user approval and are typically captured as PDRs against the Core contract. This **closes the loop** on the knowledge gained from sessions.

   **7b.1. Drain the open-questions register.** Walk every entry in
   [`.agent/memory/operational/open-questions.md`](../../memory/operational/open-questions.md)
   whose `Status` begins with `open`. For each entry, choose one outcome and
   update the entry in place:

   - **answered-in-place** — a clear answer has emerged from repo evidence,
     comments, a landed plan, an ADR, a PDR, or another durable artefact; update
     the status and link the evidence.
   - **surfaced-to-owner** — the question is genuinely owner-decision-class;
     update the status and include it in the consolidation closeout report.
   - **withdrawn** — the question has been overtaken by events or no longer
     applies; update the status with a one-line reason.
   - **open** — only when a named constraint still prevents resolution; record
     deferral-honesty evidence and falsifiability in the entry or closeout.

   Do not convert open questions into pending-graduations entries unless the
   question has become a candidate doctrine, pattern, ADR, or PDR. When both
   surfaces are relevant, cross-link rather than duplicate.

   **Every new or amended rule in `.agent/rules/`** MUST cite the ADR(s) AND/OR PDR(s) it operationalises at the top of the file. Every new or amended skill in `.agent/skills/`** SHOULD cite its establishing ADR(s) and/or PDR(s). This is the enforce-edge reinforcement: enforcement surfaces that cannot name their source decision cannot evolve with it. Rules operationalising Practice-governance substance (review discipline, planning discipline, etc.) cite the relevant PDR — they do not need to cite a host ADR if the substance lives only as Practice governance.

   **7c. Audit thread-register freshness** <a id="thread-register-freshness"></a> (Family-A Class-A.2 operational layer per [PDR-029](../../practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md), as amended 2026-04-21 to make documentation-first the canonical shape). Walk these seven checks over the thread identity register. Each check is performed by reading markdown from authoritative sources — no code, no platform-specific tooling. Findings surface as a numbered list for owner action; the audit itself does not mutate surfaces.

   The seven checks:

   1. **Stale `last_session`** — for every active thread listed in [`.agent/memory/operational/repo-continuity.md § Active threads`](../../memory/operational/repo-continuity.md#active-threads), open the thread's next-session record and compute today's date minus each identity row's `last_session`. Flag any identity row on a still-active thread where `last_session` is older than 14 days (the `IDENTITY_STALENESS_DAYS` threshold named in PDR-029).
   2. **Orphan threads** — flag any active thread whose `Participating agent identities` table is empty.
   3. **Missing required identity fields** — flag any row missing one of `agent_name`, `platform`, `model`, `session_id_prefix`, `role`, `first_session`, `last_session` (per the PDR-027 identity schema).
   4. **Expired track cards** — read every file under [`.agent/memory/operational/tracks/`](../../memory/operational/tracks/); flag any whose `expires_at:` frontmatter is past today's date.
   5. **Duplicate identity rows** — flag any thread where two rows share the same platform + model + `agent_name` tuple (additive-identity violation per PDR-027 — two visits should have coalesced into one row with an updated `last_session`, not accumulated).
   6. **Active threads ↔ next-session record correspondence** — for every thread listed in `§ Active threads`, confirm a file exists at the declared `Next-session record` path (canonical `threads/<slug>.next-session.md`). Flag any mismatch.
   7. **Retired-record banner hygiene** — checks 1–6 verify that *live* threads (active or paused) have well-formed records; this check covers the *retired* case. For every `*.next-session.md` file under [`threads/`](../../memory/operational/threads/), confirm the thread appears in either [`repo-continuity.md § Active Threads`](../../memory/operational/repo-continuity.md#active-threads) or `§ Paused Threads`. A record present on disk but absent from **both** indexes is a retired or completed thread (its work has concluded — e.g. a merged single-PR closure thread). Flag any such record whose top lacks a **retirement banner** per the convention in [`threads/README.md`](../../memory/operational/threads/README.md#retirement-banner-convention) (a leading blockquote naming the retired/completed state, the conclusion date, and where the work concluded). Unlike checks 1–6, this check's remedy is a small edit: apply the missing banner as a follow-on consolidation diff (the same way 7e's archival edits land), not merely a flag — a retired record left unbannered silently reads as live to the next agent who opens it.

   Record each finding as `[thread-slug-or-path]: <observed state> (<what the rule says it should be>)`. Present the aggregated list to the owner at consolidation close. The audit's enforcement force is that this step is part of `/oak-consolidate-docs` — any agent running the consolidation ritual is obligated to walk the six checks, not remember them. The "do not silently skip" posture is the same authority as earlier steps (7a ADR/PDR scan, 7b graduation application).

   **7d. Validate bidirectional rule ↔ plan citations.** Some `.agent/rules/` entries cite an authority surface in `.agent/plans/` (or vice versa) where the citation is load-bearing for the rule's authority. When such a pair exists, both directions must resolve so the rule and plan evolve together.

   Walk the named pairs and confirm each direction resolves:

   - [`.agent/rules/dont-break-build-without-fix-plan.md`](../../rules/dont-break-build-without-fix-plan.md) ↔ [`.agent/plans/observability/active/gate-recovery-cadence.plan.md`](../../plans/observability/active/gate-recovery-cadence.plan.md). Rule cites plan's `## Intent` and `## Recovery Sequence` point 2; plan cites rule under its own `## Cross-references` section. Flag any direction missing or pointing at a stale file path.

   Findings surface as `[<rule>] ↔ [<plan>]: <observed direction missing>`. New bidirectional pairs are added here when subsequent rules cite plan authorities.

   <a id="stale-claim-audit"></a>**7e. Audit collaboration state for protocol observability.** The
   [`active-claims.json`](../../state/collaboration/active-claims.json),
   [`closed-claims.archive.json`](../../state/collaboration/closed-claims.archive.json),
   and
   [`conversations/`](../../state/collaboration/conversations/) plus
   [`escalations/`](../../state/collaboration/escalations/) surfaces are
   signal-like state plus durable lifecycle history. The audit reports the
   live protocol state before archiving stale entries. Findings are
   informational unless they identify malformed state.

   1. **Active-claim snapshot**: read
      `.agent/state/collaboration/active-claims.json`. For every
      entry, compute `staleness_threshold = claimed_at + freshness_seconds`
      (default `freshness_seconds` is 14400 = 4 hours). Use `heartbeat_at`
      in place of `claimed_at` if present and more recent. Report
      `[active] <claim_id> <thread> <agent_name>: fresh|stale; areas=<n>`.
      If any area is `git:index/head`, mark it as a commit-window claim.
   2. **Intent-to-commit snapshot**: read the root `commit_queue` array. For
      every entry, compare `expires_at` with now and report
      `[intent] <intent_id> <claim_id> <phase> fresh|stale; files=<n>`.
      If a fresh entry is in `queued`, `staging`, or `pre_commit`, mark it as
      an active advisory commit-turn signal; array order is FIFO. Stale or
      `abandoned` entries are cleanup signals, not blockers. Do not auto-clear
      them unless this consolidation deliberately records the cleanup and
      cites evidence.
   3. **Stale entries**: any claim where `staleness_threshold < now()`.
      Move each stale entry to
      [`closed-claims.archive.json`](../../state/collaboration/closed-claims.archive.json),
      preserving the entry verbatim and adding `archived_at` plus
      `closure.kind: "stale"`, `closure.closed_at`, `closure.closed_by`,
      `closure.summary`, and one or more `closure.evidence[]`
      references. Remove the entry from `active-claims.json`. Archive, do
      not delete — conversation files, napkin observations, and
      shared-communication-log entries may cite archived `claim_id` values
      permanently. A stale commit-window claim is a high-signal interrupted
      staging/commit attempt; archive it as stale and surface the summary.
   4. **Unclosed-but-fresh entries**: any claim whose agent has not
      registered a subsequent thread-record entry (no `last_session`
      update in the matching `<thread>.next-session.md` since
      `claimed_at`). This is *informational only* — possible crash, not a
      block. Surface to the owner as `[<claim_id>] <agent_name>: claim
      open since <claimed_at>; no thread-record activity since`. The agent
      is not stranded by a peer's silent failure to close a claim; the
      stale-archive pass cleans up at the next staleness threshold. Fresh
      commit-window claims are stronger liveness signals than normal area
      claims and should be surfaced before any consolidation commit.
   5. **Explicit and owner-forced closes**: ordinary session close should
      already have archived the claim with `closure.kind: "explicit"`.
      Owner-directed cleanup uses `closure.kind: "owner_forced"` and
      cites the owner direction as evidence. Report recent closures as
      `[closed] <claim_id> <kind> <closed_at>: <summary>`.
   6. **Decision-thread snapshot**: scan
      `.agent/state/collaboration/conversations/*.json`. Report
      `[decision-thread] <conversation_id> <status> <thread>: <title>`.
      Open threads whose latest entry is more than 7 days old are stale
      unresolved threads; surface them as owner-review noise, not blockers.
      Open threads with a `decision_request` and no later `decision` or
      `resolution` are unresolved decisions.
   7. **Sidebar snapshot**: within each open conversation, group
      `sidebar_request`, `sidebar_message`, and `sidebar_resolution`
      entries by `sidebar_id`. Report
      `[sidebar] <conversation_id>#<sidebar_id>: open|resolved|declined|expired|escalated|stale`.
      A sidebar is stale when the latest entry for that `sidebar_id` is not
      a `sidebar_resolution` and the latest request's `expires_at < now()`.
      Stale sidebars are owner-review signals, not automatic closures.
   8. **Joint-decision snapshot**: within each open conversation, group
      `joint_decision` and `joint_decision_acknowledgement` entries by
      `joint_decision_id`. Report
      `[joint-decision] <conversation_id>#<joint_decision_id>: <latest-state>; ack=<complete|missing|declined|overdue>; evidence=<present|missing>`.
      A proposed joint decision with no acknowledgement after `ack_due_at`
      is overdue. A `complete` joint decision without evidence is malformed.
      A `role_handoff` without `handoff_to` and evidence or `next_action`
      is malformed. Unacknowledged proposals are not settled commitments.
   9. **Escalation snapshot**: scan
      `.agent/state/collaboration/escalations/*.json`. Report
      `[escalation] <escalation_id> <status> <thread>: <title>`.
      Every escalation must reference `conversation_id` and
      `originating_entry_id`. A closed escalation must cite
      `resolution_conversation_entry_id`; that entry is the durable
      decision authority. Escalation files are live unresolved case
      records, not report mirrors and not final decision records.
   10. **Evidence-bundle check**: for non-trivial protocol claims in plans,
      claims, or decision threads, confirm the artefact names a claim
      statement, claim class, evidence references, verification status, and
      next action / owner. Missing fields surface as
      `[evidence-bundle] <path-or-id>: <missing field>`.
   11. **Schema validation**: confirm `active-claims.json` parses as JSON
      and conforms to
      [`active-claims.schema.json`](../../../agent-tools/src/collaboration-state/schemas/active-claims.schema.json).
      Confirm `closed-claims.archive.json` parses as JSON and conforms to
      [`closed-claims.schema.json`](../../../agent-tools/src/collaboration-state/schemas/closed-claims.schema.json).
      Confirm each conversation file parses as JSON and conforms to
      [`conversation.schema.json`](../../../agent-tools/src/collaboration-state/schemas/conversation.schema.json).
      Confirm each escalation file parses as JSON and conforms to
      [`escalation.schema.json`](../../../agent-tools/src/collaboration-state/schemas/escalation.schema.json).
      Malformed JSON or schema violations surface as
      `[<file>]: <validator output>` for owner review. There is no
      automated validation tooling at this surface (per the source plan's
      files-first non-goal); the audit relies on the consolidator running
      `node -e 'JSON.parse(...)'` or a similar inline check.

   Findings surface alongside the 7a–7d findings; archival edits land as
   normal consolidation diffs. New cross-thread coordination signals
   (e.g. an unclosed claim from an agent on another thread) flow up to
   `repo-continuity.md § Active threads` if they affect another thread's
   next safe step.

8. **Review the Practice Core for upstream refinement.** The previous step moves new knowledge *into* permanent homes (downstream). This step does the opposite: reads *existing* Practice Core content against current practice and surfaces refinement opportunities (upstream). Without this step, the Core carries intent, mechanisms, examples, and templates that drift from current practice as everything around them evolves. Session learning that contradicts, extends, or refines existing Core substance must reach the Core or the Core stagnates.

   **Surfaces reviewed**:

   - **Trinity** (`.agent/practice-core/practice.md`, `practice-lineage.md`, `practice-bootstrap.md`) — blueprint prose: artefact map, knowledge flow, evolution rules, bootstrap templates.
   - **Entry points** (`.agent/practice-core/README.md`, `index.md`) — orientation and hydration guidance.
   - **Verification and operational** (`.agent/practice-core/practice-verification.md`, `CHANGELOG.md`) — bootstrap checklist, acceptance criteria, change log.
   - **Decision Records** (`.agent/practice-core/decision-records/`) — every existing PDR (001 onward), including PDRs with `pdr_kind: pattern` for authored abstractions.

   **What to review for**:

   - **Contradiction**: session learning directly contradicts a trinity claim, a PDR's rationale, or a pattern's decision. The session is more recent evidence; the Core content must be updated or the session evidence explicitly rejected with written rationale.
   - **Extension**: session learning extends a Core substance — new instance of a pattern, new consequence of a PDR, new case the bootstrap template did not cover. The extension belongs in the existing Core surface (amendment), not as a separate new document, if it is genuinely an extension.
   - **Refinement**: session learning sharpens the Core's existing statement — a looser rule becomes tighter; an abstract principle gains a concrete example; a template acquires a clarified variant. Refinement lands as an in-place edit to the existing surface.
   - **Supersession**: session learning renders a Core substance obsolete or partially superseded. Old PDRs use `Status: Superseded in part by PDR-NNN` or `Superseded by <Core section>` rather than being deleted. Trinity sections that no longer match current practice are rewritten with a reference to the superseding substance.
   - **Drift detection**: does the trinity still describe how work actually happens? Do bootstrap templates still reflect current stack decisions? Do PDR Notes sections (the host-local context fences) still match repo reality? Drift is more common than contradiction; it accumulates silently and surfaces only on deliberate review.

   **How to run the review**:

   1. Enumerate Core surfaces. For each, the question is: does recent session content (this session's work, the rotated napkin entries, the graduated PDRs) contradict, extend, refine, or supersede anything here?
   2. Surface candidates to the user as a numbered list. For each candidate: Core surface affected + type of change (contradict / extend / refine / supersede) + one-sentence summary of the evidence and proposed amendment.
   3. **Owner approves each amendment before editing Core surfaces.** Per PDR-003 and the care-and-consult posture on dense Core content: the main agent drafts; the owner reviews each diff; no ad-hoc sub-agent dispatch for Core edits. PDRs in `decision-records/` follow the same discipline as the trinity.
   4. Apply approved amendments as diffs. If substantive, amendments are captured in the Core `CHANGELOG.md` with a short summary.

   **When nothing qualifies**: say so and move on. Not every consolidation produces Core refinement. But "nothing qualifies" is a conclusion reached by review, not by skipping review.

   **Scope signal**: if a single consolidation surfaces many Core amendments (> 3), the rate of structural change is high. That count is an **untuned reflection-trigger, not a hard cap** — the `> 3` default was reasoned early and never calibrated under heavy usage. When it fires, run the reflection — *is validation keeping pace with the structural change? is there any instability evidence (a recent Core change reverted, churned, or contradicted)?* — and let the **answer**, not the count, decide whether to pause-and-stabilise before further Core restructuring. The absorbable rate scales with validation capacity (the sessions and agents applying the Core), so under heavy usage the ceiling is plausibly higher; tune it empirically by observing whether Core changes **stabilise** (stay in use) rather than revert in subsequent sessions, not by guessing a new number. This is the diagnostic signal ADR-131 §Self-Referential Property names; when a pause is genuinely warranted, record it in `.agent/memory/active/napkin.md` so the posture persists into the next session.

9. **Actively manage fitness thresholds** (ADR-144 three-zone model).
   **Fitness warnings must be analysed and routed to the proper structural
   response, not answered by opportunistic trimming and never used to
   suppress learning.** A SOFT, HARD, or CRITICAL warning is a signal —
   sometimes the file has accumulated low-value entries (refine), sometimes a
   reference surface needs an intended long-term structure, sometimes the limit
   was set before the substance grew legitimately (extend target or limit), and
   sometimes the file simply received important knowledge before the structure
   caught up. Reaching for "delete some lines" first is the
   failure mode this discipline forbids. Refusing to write or distil useful
   learning in order to keep fitness green is the companion failure. Run
   `pnpm practice:fitness` (or `pnpm practice:fitness:informational` for a
   non-blocking report). The validator discovers every live markdown file
   that declares fitness or lifecycle metadata in YAML frontmatter, excluding
   archives, backups, and incoming practice boxes. Every declared metric
   lands in one of four zones:

   - `healthy`: within design envelope. No action.
   - `soft` ("think about it"): above target, within hard limit. Consider refinement at this consolidation or the next natural boundary. Never blocks.
   - `hard` ("do something soon"): above hard limit but within
     `hard limit × CRITICAL_RATIO` (1.5). Preserve learning first, then
     remediate before consolidation closure, open an explicit remediation
     lane, or record owner-approved deferral. Do not roll back or suppress
     the learning to make the gate green.
   - `critical` ("loop failure signal"): above `hard limit × CRITICAL_RATIO`.
     Stop routine work and open a remediation lane — see ADR-144 §Loop
     Health. Critical is a loop-health alarm, not permission to delete or
     withhold understanding.

   For any file in `soft`, `hard`, or `critical`:

   a. **Analyse** — is the content appropriately dense, or has it accumulated low-value entries?
   b. **Refine** — compress, deduplicate, remove entries covered elsewhere.
   c. **Restructure reference surfaces** — follow `split_strategy` only for
      reference or documentation surfaces where the change is the right
      long-term structure for already-understood substance. Drainable buffers
      use `drain_strategy` and item dispositions instead.
   d. **Extend target** — agents may raise `fitness_line_target` modestly with rationale.
   e. **Extend limit** — only the user may raise `fitness_line_limit`, `fitness_char_limit`, or `fitness_line_length`.

   For any file in `critical`, also run the short three-question post-mortem from ADR-144 §Loop Health: why the earlier zones did not fire, whether the hard limit is set correctly for the file's role, and whether the file is a symptom of a missing graduation (ADR, governance doc, README) elsewhere. Record the answers in the consolidation output.

   At consolidation closure, run `pnpm practice:fitness:strict-hard` to
   expose unresolved hard or critical pressure. If the command fails because
   knowledge was preserved correctly, do not undo the knowledge. Closure
   still needs a concrete disposition: remediate now, open an explicit
   remediation lane with acceptance criteria, or record owner-approved
   deferral/limit change. Changes to fitness thresholds are self-documenting
   via frontmatter. An ADR amendment is only needed if the fitness system
   itself changes.
10. **Manage the practice exchange.** Two directions:

    **Incoming**: If `.agent/practice-core/incoming/` contains files, follow the integration flow in `.agent/practice-core/practice-lineage.md`. **Practice evolution is not linear** — an incoming Practice can be behind in some areas and ahead in others. Never dismiss an incoming as "stale" because one file or section is older than the current version. Compare bidirectionally, file by file and section by section. Key steps: (a) check the provenance chain in the YAML frontmatter; (b) compare across the full Practice system bidirectionally — including `practice-core/decision-records/` (PDRs and PDRs with `pdr_kind: pattern`), which is the first-class Core decision surface per PDR-007; (c) apply the three-part bar (validated by real work? prevents recurring mistakes? stable?); (d) present specific proposals to the user; (e) clear the box only after integration is complete and user-approved. Do not clear the box unilaterally. If distilled.md entries have matured into meta-principles about the Practice itself, they may graduate to the Learned Principles section in `.agent/practice-core/practice-lineage.md` or (when substantial) to a dedicated PDR.

    **Outgoing**: PDR-007 narrowed `.agent/practice-context/outgoing/` to **ephemeral exchange only** — transient sender→receiver notes that expire after integration. Substance with durable value has four proper homes:

    - **Portable Practice governance** (review/planning/consolidation/etc. discipline) → PDR in `practice-core/decision-records/` (travels with Core; no outgoing copy needed).
    - **General abstract patterns** (ecosystem-agnostic, ≥2 instance synthesis) → PDR with `pdr_kind: pattern` in `practice-core/decision-records/` (travels with Core; authored fresh via synthesis).
    - **Host-local reference material** (platform-specific notes, ecosystem-specific examples, scripts) → `.agent/reference/` (host-local; does not travel).
    - **Ephemeral exchange context** (framing notes, short-lived write-back packs targeted at a specific receiver) → `.agent/practice-context/outgoing/`.

    At consolidation, any `outgoing/` file whose substance exists nowhere else is a **defect** (per PDR-007): it must promote to one of the three durable homes or be deleted as a staging artefact that never graduated. New insights from completed work route to the appropriate home by substance shape, not by legacy "put it in outgoing" habit.

    Practice Core structural changes (new Core directories, changes to the contract) are proposed as PDRs against the Core contract, with user approval.

## Closeout Proof

Close every `consolidate-docs` invocation with a report of **value and impact**
that matches the declared mode:

- mode used;
- what knowledge reached which permanent home, and what behaviour it changes;
- unresolved live items and blockers — including any fitness file still worse
  than soft, named as a live signal (un-homed substance? structural debt?), not
  as a before/after accounting table;
- explicit verdict: `complete`, `partial slice landed`, or `pending`.

Per [`permanent-doc-is-the-consolidation-record`](../../rules/permanent-doc-is-the-consolidation-record.md):
the commits and the permanent homes ARE the record the pass happened. Do not
report before/after counts, a disposition-ledger pointer, a before/after fitness
table, or provenance pointers. Fitness is a signal to explain when it points at
real work, never the thing delivered.

For `session-completion`, `partial slice landed` is acceptable when fresh
learning was captured and obvious substance was routed while larger curation
buffers remain live. Name those live buffers and next actions honestly.

For `dedicated-knowledge-curation`, `complete` requires two evidence classes:
documentation/reference surfaces are at the agreed healthy-to-soft target, and
drainable buffers selected for the pass are empty by ledger evidence. A softer
fitness report without item-level dispositions is not completion evidence.
