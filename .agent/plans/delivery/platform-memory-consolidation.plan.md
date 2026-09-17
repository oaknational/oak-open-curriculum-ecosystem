---
id: platform-memory-consolidation
node_type: delivery
name: "Platform memory consolidation: drain the Claude per-user buffer with a fleet, mint the skill"
overview: "Run a dedicated-knowledge-curation session over the live Claude Code per-user memory corpus (147 undispositioned files of 381; 0.92MB total) with a fleet: disposition every live memory through the per-user-memory-is-a-buffer lifecycle — a graduation-led pass whose real cost centre is authoring ~72 missing repo homes through reviewed PRs — then rewrite MEMORY.md as a live-entries-only index of correct, unique points and pointers, and mint the platform-memory-consolidation skill from the session's own transcripts so the drain is repeatable across all four platform surfaces."
status: ratified
ratified_by: 'Jim Cresswell'
ratified_date: 2026-08-11
ratified_where: >-
  Owner card at the Director seat 2026-08-11 ~07:1xZ (card answer:
  "Ratify, incl. MEMORY.md rewrite" — the card carried the
  2026-08-10 "Don't change it at all!" tension explicitly, so the
  index rewrite is owner-confirmed as part of this commission;
  session Plover lifts Troposphere b10c37).
serves: planning-and-intent-estate
impact_areas:
  - practice-and-estate
tickets: []
depends_on:
  - plan: skill-standard-pilot
    kind: beneficial
owner_gates: []
last_updated: 2026-08-11
---

# Platform memory consolidation

## Goal

Owner words (2026-08-11, verbatim): "design a session to review and
process Claude platform memory with a fleet, using
/oak-consolidate-docs, preserving knowledge, reducing Claude memory to
correct, unique points and pointers, bringing anything truly durable
into the repo … as part of that process we need to design a skill to
make this easier in future. When the plan is fully ready I will start a
seat to pick it up. This is off the back of Wren's report."

The plan governs no work until it carries the owner's ratification
stamp; the executing seat is the one the owner starts.

## Grounding (first-hand 2026-08-11; assumptions-reviewed same day, all findings adopted)

- The corpus: `~/.claude/projects/<this-project>/memory/` holds
  `MEMORY.md` (the session-injected index: 150 lines, ~17KB, loads
  whole) plus 381 per-entry files, 0.92MB of content. Corpus types:
  333 feedback, 33 project, 7 user, 4 reference (4 files lack a
  `type:` field — census items).
- **The underscore-named generation is a COMPLETED drain, not
  backlog**: 234 `<type>_snake_case` files (212 `feedback_`, 19
  `project_`, 3 `reference_`) all carry disposition markers from the
  2026-07-03/04 buffer-drain (retirement banners naming the draining
  seats), none is indexed, and the 2026-08-05 audit independently
  finds that stratum 97.5% present in repo homes. Naming generation
  IS disposition state — a free partition key.
- **The working set is 147 files**: 143 live-indexed entries plus 4
  dispositionless unindexed files
  (`commit-queue-guard-compares-prefix-not-id.md`,
  `merges-owner-executed-during-sonar-outage.md`,
  `owner-cards-fully-self-contained.md`,
  `spend-limits-never-agent-concern.md`). This pass covers the
  accumulation since 2026-07-04; entries created after the S1 census
  timestamp are live-keep and out of scope (the corpus grows ~3
  files/day and mutates during any session).
- **The pass is graduation-led, not duplicate-led** (measured, not
  assumed): joining the 2026-08-05 audit's per-file verdicts against
  today's index MATCHED 124 of the 147-file baseline — those matches
  read 48 present / 44 partial / 28 absent / 3 ephemeral /
  1 vendor-scoped, **58% absent-or-partial OF THE AUDITED SUBSET**;
  the 23 unmatched files (post-audit additions) get their verdicts at
  the S1 census, and the overview's ~72-homes estimate is scoped to
  the audited matches until then.
  The cheap duplicate-verify class dominates only the already-drained
  stratum. The audit's own disposition note applies: graduating these
  is curation-lane work — each row needs its named home authored,
  several as new rules or PDR clauses, `new-rule-vs-pdr-clause`
  discipline per item, reviewed PRs. Spot-check: of 19 high-value
  absent rows, exactly one home has landed since the audit.
- The machinery exists and this session EXECUTES it: the
  `consolidate-docs` skill names this surface as mandatory intake
  (§step 3, four-platform set) in `dedicated-knowledge-curation` mode
  with the drainable-buffer protocol and the conservation invariant.
  The lifecycle is the law (`per-user-memory-is-a-buffer`,
  PDR-124 §Decision 4): graduate → mark the entry body "Graduated to
  <repo-path>" keeping substance as audit trail → retire the
  `MEMORY.md` index line. The index carries live, ungraduated entries
  only. "Correct, unique points and pointers" additionally applies
  the rule's mutable-state test (volatile world-state stated as fact
  is re-phrased as pointer-and-check or retired).
- Instigating evidence ("Wren's report", identified by Wren
  2026-08-11): their in-session report to the owner that morning —
  a size GUARD fired during a MEMORY.md capture (21.5KB reading
  against a 24.4KB limit) and the write completed only after
  compacting to pointers. Distinct mechanism from harness truncation
  (PDR-124's 2026-07 cure took the index 44KB/241 entries →
  ~17KB/144 lines; it loads whole today): the signal is
  capture-time headroom exhaustion — the buffer is full and the
  rule's discharge is consolidation.
- Standing baseline this session re-verifies rather than re-derives:
  `.agent/reports/vendor-memory-graduation-audit-2026-08-05.md` +
  fleet JSON (executed by the then-Director seat Petrel holds
  Turbulence, a0892f): 362 files audited in full, per-file verdicts,
  27 high-value graduations named. Six days of drift on BOTH sides
  since — corpus drift (~19 new files) and repo drift (verdicts decay
  as homes land: the audit's sharpest "dangling pointer" finding,
  `linear-mcp-team-and-project-hygiene`, has since become a real
  rule).

## Decisions made (decision-complete ledger)

- **Retention shape**: graduated and duplicate entries KEEP their
  bodies (audit trail + "Graduated to <path>" marker); only index
  lines retire. True deletion is reserved for wrong/never-true
  content, each with a recorded reason and falsifier
  (file-deletion-is-exceptional). Before any disposition executes, S1
  takes a dated safety snapshot of the whole memory directory to a
  sibling per-user path (outside the repo — per-user content is not
  repo material); the snapshot never lowers the extraction bar.
- **Baseline reuse, with its misdiagnosis quarantined**: S2 readers
  receive each file's 2026-08-05 verdict as a PRIOR to re-verify —
  never a disposition. The audit's "shadow-corpus / two-thirds dark"
  paragraph describes the drained stratum's CORRECT end state
  (verified-homed, index lines retired by the lifecycle), not a
  defect; no seat re-indexes or re-graduates the 234 drained files.
- **Mode**: `dedicated-knowledge-curation` per consolidate-docs.
  Complete = every live-set file dispositioned; fitness numbers are
  routing evidence only. Taxonomy mapping for the cold seat: this
  plan's {graduate, duplicate, retire} = the skill's {graduated,
  duplicate, rejected}; `live-keep` (correct, unique, still
  platform-appropriate — body sharpened, index line kept) is the
  per-user-surface disposition the skill's buffer vocabulary lacks;
  honest mid-pass handoff uses the skill's `carried-forward` with its
  deferral-honesty evidence.
- **Fleet shape** (sized to the 147-file live set): ~5 reader windows
  of ~30 files partitioned by the S1 census; each proposes per-memory
  dispositions with named repo homes; mechanical home-existence
  verification by script wherever a home is claimed; adversarial
  verify legs on every RETIRE proposal and every novel graduation
  target; one opus frame-challenger over the whole disposition set;
  the seat adjudicates; execution lands as batched changes per
  disposition class. The drained stratum gets a SAMPLED verification
  leg (one reader, random ~20 of 234, confirming homes still carry
  the substance), not per-file re-work.
- **Graduation batches, value-ordered**: S3 executes graduations in
  batches — batch 1 is the audit's high-value set re-verified at S1
  (~27 rows), subsequent batches by value tier. Each batch is a small
  reviewed PR (or a few, by home surface); `new-rule-vs-pdr-clause`
  adjudication applies per item. The pass's disposition duty covers
  the ENTIRE S1-censused live set (147 files at the dated 2026-08-11
  baseline; S1 recomputes membership at census time, so later-added
  files join the duty); graduation EXECUTION may span batches with the
  remaining batches carried in this plan's slice state as named work
  (constraint: authoring ~72 homes through reviewed PRs exceeds one
  sitting; falsifiable via the batch list here), never silently
  deferred.
- **Repo landings ride PRs**; the per-user side (bodies, index) is
  direct — it is not version-controlled.
- **No closeout ledger**: the S1 census re-run at S3 close is a
  completion GATE (recomputed, compared in-context), and the commits
  plus the homed substance are the record. No persisted before/after
  report, no graduated-items list
  (`permanent-doc-is-the-consolidation-record`).
- **The skill is minted FROM the session**: S2/S3 transcripts and
  frictions are preserved as authoring substrate; S4 authors
  `platform-memory-consolidation` covering all four platform surfaces
  (Claude executed; Codex/Cursor/Gemini specified from the
  consolidate-docs step-3 contract), born to the WS8 skill standard
  if `skill-standard-pilot` has proven it by then (beneficial
  dependency), else lean with the standard queued.
- **Skill name and tree home** adjudicated at S4 open against the
  ratified skills structure (pointer, not spec).
- **Owner surface**: the stamp card carries the MEMORY.md-rewrite
  confirmation (recorded in the frontmatter stamp: `ratified_where`
  cites the owner card answer "Ratify, incl. MEMORY.md rewrite"). Mid-session, one card ONLY if S2
  proposes true deletion of owner-guidance substance not verified in
  any repo home; everything else proceeds under the stamp.

## Slices

1. **S1 — Census, snapshot, partition** (fleet-free prep, one
   sitting). Safety snapshot to a dated sibling directory; census
   recomputed at a recorded timestamp (live set membership; type
   counts incl. the 4 missing-`type:` files; the duplicate index-line
   pair under `core-skills-grouped-by-concern.md`; index size vs the
   24.4KB guard); **audit-diff on BOTH sides**: corpus drift (files
   new/gone since 2026-08-05) AND repo-side re-verification of every
   absent/partial row (~75 cheap home-existence checks — has a home
   landed since?); emit the ~5-window partition with re-verified
   priors attached. Acceptance: census in the session workspace;
   snapshot verified readable; every live-set file in exactly one
   window; both diff legs present.
2. **S2 — Fleet disposition pass** over the live set per the fleet
   shape; every file gets exactly one adjudicated disposition
   {graduate→home | duplicate→verify+retire-line | live-keep |
   retire (reason+falsifier)}; PDR-098 recurrence check on
   recurring-despite-home items (recurrence evidence routes to the
   doctrine-traction lane before the duplicate is marked); the
   drained-stratum sampled verification leg runs alongside.
   Acceptance: adjudicated disposition set completely covering the
   recomputed S1 live set, with baseline entries that disappeared
   before the census reconciled separately (counts are sizing
   context, never load-bearing); verify legs recorded; sample leg
   reported.
3. **S3 — Execute.** Graduation batches value-ordered through
   reviewed PRs per the batching decision; mark bodies; retire index
   lines; rewrite `MEMORY.md` as the live-entries-only index (under
   the stamp's explicit confirmation); re-run the S1 census as the
   completion gate (every graduate/duplicate home read back before
   its index line retired — the pre-archive verification gate).
   Acceptance: every disposition EXECUTED — the named-batch list is
   empty at slice close (a queued batch is in-progress state, never
   acceptance); index = live entries only; gate recomputation clean.
4. **S4 — Mint the skill.** `platform-memory-consolidation` authored
   from the preserved S2/S3 transcripts and frictions; four-platform
   scope; standard per the dependency note. Acceptance: skill lands
   through the normal skills machinery (canonical + projections +
   lock), authoring evidence cited.

## Loop exit criteria

S2 runs once over the finite live set. S3's graduation batches
continue until the batch list is empty; each batch is a bounded PR
round under the ordinary review discipline. One completeness-critic
sweep after the final batch (window skipped? home unverified? index
line orphaned?) may open ONE remediation batch; a second remediation
need is a new owner word. S4 runs once.

## Follow-ons (pointers, not specs)

- Codex/Cursor/Gemini executions of the minted skill (the skill
  specifies them; running them is new sessions' work).
- Doctrine-traction findings from PDR-098 recurrence checks route to
  their existing lane.
- The in-repo buffers (napkin, distilled, pending-graduations) are
  consolidate-docs' ordinary scope, NOT this plan's; a full pass over
  them is its own session if triggered.
