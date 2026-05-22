---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
---

# Napkin

Active session observations. Distilled entries live at
[`distilled.md`](distilled.md). Pattern library is at
[`patterns/`](patterns/README.md). Cross-session pending graduations live in
[`pending-graduations.md`](../operational/pending-graduations.md).

The most recent rotation is archived at [`napkin-2026-05-22.md`][archive-pass].
Prior rotations are [`napkin-2026-05-21.md`][previous-pass],
[`napkin-2026-05-17.md`][previous-previous-pass], and
[`napkin-2026-05-14.md`][previous-previous-previous-pass]. The 2026-05-22
rotation was Wooded Swaying Thicket's pass over the dense 2026-05-21 and
2026-05-22 multi-agent learning window. The 2026-05-22 day carried 46 entries
across 11 session blocks covering coordinator handoff, compaction-boundary
handoff, dual peer-primary topology, advisory orchestrator worked-instances,
Sonar disposition operations, the watcher seen-file defect, and the
commit-queue commit workflow primitive — behaviour-changing entries were
merged into [`distilled.md`](distilled.md) under "Recently Distilled —
2026-05-22"; graduation candidates remain in
[`pending-graduations.md`](../operational/pending-graduations.md); the full
session-by-session capture lives in the archived napkin.

[archive-pass]: archive/napkin-2026-05-22.md
[previous-pass]: archive/napkin-2026-05-21.md
[previous-previous-pass]: archive/napkin-2026-05-17.md
[previous-previous-previous-pass]: archive/napkin-2026-05-14.md

## 2026-05-22 — Stormbound Kiting Squall Cycle 1.1 landing / claude / claude-opus-4-7 / `ddbea2`

### Surprise: live `2389ff5e` instance of failure mode plan cures — during Cycle 1.1 staging

**Observation**: while grounding for Cycle 1.1 of `commit-queue-intent-scope-discipline.plan.md` (the very plan whose subject is the `record-staged` whole-index scope bug), Wooded's `commit-queue commit` at 14:54Z with intent `692c57a7` scoped to one file (`.remember/distilled.md`) absorbed Shaded's mid-flight Cycle 10 source edits to `agent-tools/src/bin/{commit-queue,collaboration-state}.ts` because `record-staged` fingerprinted the FULL git index, not the intersection of (`intent.files`, currently-staged). Wooded initially mis-DM'd Stormbound thinking the foreign-staged edits were mine; self-corrected via diff inspection within 2 minutes; Shaded acknowledged Cycle 10 LANDED at `2389ff5e` with substance-preserved attribution-misattributed verdict.

**Diagnosis**: this is the SECOND fresh instance of the failure mode this plan cures in a 60-minute window (Instance A was Mistbound's ff2 case at `e48d7f16`, 14:04Z, named in original plan). The repeat-fresh-evidence signal during the very session that's implementing the cure is unusual and strengthens the framing: "intent.files is operative scope" is not a hypothetical concern but a live ongoing failure with measurable cost (attribution noise, audit-trail misalignment, recovery work).

**Cure**: cited Instance B in plan §Context alongside Instance A as anchoring worked-instance evidence. Cycle 1.1's `getStagedBundleScoped` (landed `fb0833a4`) is the first of three operative fixes. Cycles 1.2 + 1.3 close the loop.

**Discipline-pending-structural-cure**: per Wooded + Shaded's same-day extraction — run `git status --short` IMMEDIATELY before `record-staged` to surface foreign-staged files. Lesson applied during my own Cycle 1.1 staging; no foreign-staged absorption.

### Surprise: owner direction during session-handoff — check-singleton invariant + observable-surface gap

**Observation**: while running session-handoff SKILL §11 (`pnpm check` cleanliness gate), owner intervened with direction: *"only one agent needs to run check, and one agent already is, so stop check, and record that invariant, and note that we need some kind of record of who is running check when"*.

**Diagnosis**: session-handoff §11 currently directs every closing agent to run `pnpm check`. In an N-agent window this produces N concurrent invocations of a ~30s+ whole-repo gate sweep, duplicating work and providing no marginal signal. The team has no observable surface for "who is running check (or other whole-repo gate sweep) when". The SKILL prescribes the invocation without prescribing the coordination.

**Cure (immediate)**: captured as standing user-memory entry `feedback_check_singleton_per_window` so the rule applies immediately in this and future sessions even without structural infrastructure.

**Cure (structural-pending)**: pending-graduations register entry "Check-runner singleton claim (rule-shaped or coordination-state-schema-amendment-shaped)" naming three cure-shape options (active-claims `area-kind: gate-sweep` + rule; broadcast convention; SKILL §11 amendment naming the invariant). Likely shape: rule + schema amendment together, but trade-off design needs a focused pass.

**Generalisation**: the SKILL prescribes-without-coordinating pattern is worth watching elsewhere. Any SKILL step that directs "every agent does X" against a shared whole-repo resource has the same structural failure mode as session-handoff §11. The cure pattern is consistent: observable claim/broadcast naming who's running it now, and a SKILL amendment honouring that surface.

## 2026-05-22 — Wooded Swaying Thicket napkin rotation / claude / claude-opus-4-7 / `6c58f3`

### Rotation: 2026-05-22 napkin rotated under owner direction "work on the napkin"

The pre-rotation napkin reached 1327 lines / ~75 kchars (CRITICAL on both
metrics — well past the 450-line and 27000-char critical thresholds).
Rotation completed under owner direction during the multi-agent dual-lane
session, with three peer agents (Shaded Lane A working PR-108 snagging
cycles, Mistbound Lane B in ADR-183 T2 substrate work, Tempestuous Lane C
having just landed `97bf9e97`) still active or recently-landed.

Distillation extracted 14 behaviour-changing rules into `distilled.md` under
"Recently Distilled — 2026-05-22 multi-agent dual-lane + compaction-boundary
window". Graduation candidates (5 entries with `status: due`) remain at
`pending-graduations.md` awaiting routing decisions from owner per SKILL §7a
surface (PDR-064 partial-slice amendment, start-right-team SKILL coordinator-
delegate amendment, CLI Norms backtick cure, hook-policy substring-match
cure, canonical-tool-definitions-code-adjacent plan).

Source plane: `operational` → `process`.

## 2026-05-22 — Wooded Swaying Thicket INPUT-curation post-rotation closeout / claude / claude-opus-4-7 / `6c58f3`

### Surprise: `commit-queue commit` primitive's `record-staged` step fingerprints the FULL git index, not the intent's `files` scope

**Observation**: ran `commit-queue commit` for intent `692c57a7` scoped to one file (`.agent/memory/active/distilled.md`). The primitive landed an 8-file bundle at `2389ff5e` including Shaded's mid-flight Cycle 10 source edits (`agent-tools/src/bin/commit-queue.ts` + `agent-tools/src/bin/collaboration-state.ts`, `.then/.catch` → `try/await` conversion) that were peer-staged in the shared index at the moment of `record-staged`.

**Diagnosis**: `record-staged` snapshots `git diff --cached` without filtering against `intent.files`. Any peer-staged content rides along. This is the failure mode `.agent/plans/agent-tooling/current/commit-queue-intent-scope-discipline.plan.md` (Stormbound implementing) cures via three TDD cycles: record-staged-scope, verify-staged-scope, commit-pathspec.

**Cure** (until structural fix lands): every agent running `commit-queue commit` MUST run `git status --short` immediately before `record-staged` and explicitly pause for any foreign-staged files visible in the index. Treat the workflow primitive as scope-leaky for the duration.

**Pointer**: live evidence at `2389ff5e` (commit subject `docs(distilled): add 8 owner-profile observations...` ate Shaded's Cycle 10 source bundle). Recovery via Shaded's correction broadcast at event `[Lane A Cycle 10 LANDED at 2389ff5e (attribution-correction)]`. Substance preserved; only attribution is suboptimal. No rollback per Shaded's clean reviewer evidence (pre-execution code-expert GO + post-execution code-expert APPROVED + 467 tests green).

### Surprise: `.remember/` plugin dormancy was platform-scope mismatch, not actual failure

**Observation**: at session open, `.remember/recent.md` last entry was 2026-05-13 (9 days stale); 24 daily files unrotated; 8 IDENTITY CANDIDATE rows unprocessed. The plugin appeared dormant.

**Diagnosis**: `/Users/jim/.claude/plugins/installed_plugins.json` showed TWO entries for `remember@claude-plugins-official` — old v0.5.0 was scoped to `/Users/jim/code/personal/project-explorer-especially-names` (the dormancy cause; wrong project path), new v0.7.2 was installed today scoped to this project. The plugin wasn't failing; it was just scoped elsewhere.

**Cure**: owner restarted the plugin pre-session (Claude Code reload). On restart, the v0.7.2 plugin processed Mistbound's session and created `memory-2026-05-22.log` at 13:49Z, confirming the hook flow works on disk. Future sessions auto-bind on SessionStart.

**Generalisation**: when a vendor plugin appears dormant, check `installed_plugins.json` for project-scope mismatches before assuming bug. The plugin lifecycle is owned by the platform; our session's job is to detect-and-route, not to repair plugin internals.

### Surprise: `.remember/recent.md` IDENTITY CANDIDATE rows are owner-profile substance, not project-doctrine

**Observation**: the plugin's Haiku distillation extracted 8 IDENTITY CANDIDATE rows characterising the owner (Jim) — e.g. "Prefers phased, gated activation over big-bang integrations". My first instinct was to surface for owner review, not promote directly.

**Owner direction**: "add them to distilled". Owner wanted these as durable cross-session collaboration knowledge that agents should adopt by default — not just owner-profile material gated on consent.

**Cure shape**: the resulting distilled.md section names each observation as a working pattern of the owner + what it implies for any agent collaborating with them. Provenance retained via `.remember/recent.md` IDENTITY CANDIDATE N` pointers. Owner-profile observations DO graduate into project-doctrine when owner directs — they're not categorically different from owner-direction-derived rules; they're rules-of-engagement.

## 2026-05-22 — Mistbound Slipping Night Lane B T2 compaction-boundary handoff / claude / claude-opus-4-7 / `a1cb64`

### Compaction-boundary handoff — Lane B ADR-183 Tranche 2 at "ready to commit"

Owner directed compaction with Lane B T2 in mid-protocol. Capturing the
state the post-compaction agent needs to land the bundle without redoing
review work.

**Identity (post-compaction continues as)**: Mistbound Slipping Night /
claude / claude-opus-4-7 / `a1cb64`. PRACTICE_AGENT_SESSION_ID_CLAUDE env
preserves identity through the harness.

**Persistent infrastructure that should survive compaction**:

- **Cron `195ef238`** — session-only `*/3 * * * *` re-firing the
  NEW 9-rule /loop instruction (replaces prior `2ffafdad` 8-rule).
  Empirical from prior compaction: session-only cron CAN survive
  compaction within same session. Verify on first wake via CronList; if
  dropped, re-create with the 9-rule prompt below.
- **Monitor `bj2md0z8h`** — persistent all-channels comms watcher.
  Per Mistbound + Shaded prior empirical: persistent-task contract
  does NOT survive conversation rewrite. Wooded's instance survived
  (non-deterministic). MUST re-arm on first wake via the agent-tools
  comms watch CLI; self-exclusion seen-file at
  `.agent/state/collaboration/comms-seen/mistbound-slipping-night.json`
  (already primed to current state — prevent backfill flood by NOT
  re-priming if file exists with content).

**Lane B T2 state at compaction — one CLI command from landing**:

- **Six files staged** (verified via `git diff --staged --name-only`):
  - `agent-tools/src/collaboration-state/comms-relevant-events.ts`
    (helper extraction + TSDoc)
  - `agent-tools/src/collaboration-state/types.ts` (tags? on three
    interfaces)
  - `agent-tools/src/collaboration-state/state-schemas.ts` (tags on
    three Zod schemas + propagation in six mappers)
  - `agent-tools/tests/collaboration-state/format-watcher-event.unit.test.ts`
    (NEW, 12 helper unit tests)
  - `agent-tools/tests/collaboration-state/state-parsers.unit.test.ts`
    (+3 round-trip tests)
  - `docs/architecture/architectural-decisions/183-comms-event-tag-namespace-substrate.md`
    (Proposed → Accepted)
- **Commit-queue intent `12c0a2ba-a198-4d1a-9de9-349c7b1215c3`** at
  phase `staging`, record-staged complete (fingerprint locked).
- **Git claim `eb8048f8-faf5-4e4b-b662-b8c0520c4363`** open
  (TTL 900s from 13:20:51Z — expires ~13:35:51Z; will have expired by
  compaction read; post-compaction agent must open a fresh git claim
  before the `commit-queue commit` call).
- **Files claim `56206b71`** open for the T2 file scope.
- **Lane B presence claim `6ed6ca9a`** open (expires ~14:17Z).
- **Pre-execution code-expert review**: completed pre-fan-out, returned
  GO WITH AMENDMENTS (types.ts + EventView/helper exports — both
  applied).
- **Post-delivery code-expert review on widened 6-file diff**: completed
  this cycle, returned GO (all prior findings closed, no new defects).
- **Both code-expert moments captured per the /loop runbook rule 2 +
  rule 3 two-moment shape**.

**Post-compaction first moves** (do these in order):

1. CronList to verify `195ef238` still scheduled; re-create with 9-rule
   prompt below if dropped.
2. TaskList to find watcher; re-arm via agent-tools comms watch CLI if
   monitor invalidated (likely).
3. Read recent comms backlog for any new events that landed during
   compaction.
4. Verify staged set unchanged (`git diff --staged --name-only` == six
   files above). If staged set drifted, abandon intent, re-stage,
   re-run post-delivery review per /loop rule 3.
5. Open fresh `git:index/head` claim (the original `eb8048f8` will have
   expired by ~13:36Z).
6. Run `commit-queue commit --intent-id 12c0a2ba-a198-4d1a-9de9-349c7b1215c3
   --message-file .git/COMMIT_EDITMSG` — the workflow composes
   verify-staged → advisory orchestrator → phase pre_commit →
   verify-staged-again → git commit → complete. Husky full-tree gate
   runs (no --no-verify).
7. Close all open Mistbound claims (`eb8048f8`-fresh, `56206b71`,
   `6ed6ca9a`) with closure summaries.
8. Broadcast lane-complete event.

**Commit message body to use** (write to `.git/COMMIT_EDITMSG` before
move 6):

```text
feat(comms): land ADR-183 Tranche 2 — comms-event tag-token rendering

Composes [FAILURE-MODE] and [BEHAVIOUR-NOTE] tokens with the existing
channel discriminator on the watcher's per-event header line. Per
ADR-183 §"Landing tranche" item 2.

Helper `formatWatcherEventHeader(view, tags)` extracted from
`comms-relevant-events.ts` and tested directly (12 unit tests). The
three formatters (Directed / Narrative / Lifecycle) call the helper
rather than build the marker line inline.

Q1-Q5 sidebar settlement with Shaded Whispering Dusk captured in
comms event `06d1c07a-9ffb-4bfe-ad3f-30485435960c`:
- Render-site location: same per-event pass as the channel
  discriminator; pure helper extracted for testability.
- Token format: UPPERCASE-HYPHEN matching channel-token style.
- Composition order: channel first, tags after, alphabetical.
- Multi-tag: allow co-tagging; alphabetical render regardless of
  input array order.
- Unknown tags: literal-normalised render; no allowlist; write-time
  validation handles enforcement at a different layer.

Two-moment code-expert review per
`.agent/rules/pre-execution-code-expert-review-per-loop-cycle.md`:
- PRE-EXECUTION: GO WITH AMENDMENTS — surfaced (a) types.ts/schema
  co-consistency gap (TypeScript interfaces lacked the `tags` field
  even though the JSON schema accepted it as of T1) and (b) missing
  EventView + helper exports for the new test file.
- POST-DELIVERY: GO WITH AMENDMENTS — surfaced the Zod-layer
  schema/mapper gap (state-schemas.ts uses z.strictObject so events
  with `tags` were rejected at parse; mappers also dropped the field);
  fixed by adding tags to three Zod schemas plus conditional spread
  to all six mappers (three private dispatch helpers + three public
  parse*Value entrypoints) and three round-trip tests in
  state-parsers.unit.test.ts. Re-reviewed on the widened 6-file
  bundle: GO.

ADR-183 §Status flipped from Proposed to Accepted in this commit per
ADR-183 §"Landing tranche" semantics — both tranches landed.

Atomic-landing: helper + 12 helper unit tests + 3 round-trip tests +
schema/mapper amendments + ADR status flip all in this commit.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

**Owner correction (preserved verbatim, do NOT revert)**: full-tree
pre-commit gating is INTENTIONAL and CORRECT. Multi-writer
coordination is solved by queue + claim + comms, never by narrowing
gate scope. "The worst bugs are often emergent outside of changed
files."

**Tempestuous portability adapter pending owner direction**: the file
`.agents/rules/pre-execution-code-expert-review-per-loop-cycle.md`
(Tempestuous's portability cure for my earlier `b6a8ca52` rule
commit's missing `.agents/` adapter) is unstaged in the working tree
awaiting owner choice on landing path. NOT in scope for the post-
compaction T2 commit; do NOT sweep it.

**The /loop instruction (verbatim, 9 rules — for cron recovery if
`195ef238` drops)**:

```text
/loop 180s Advance lane AND coordinate. (1) Before any sub-agent
dispatch or cycle commit: ensure a peer-level active-claim is open
covering the full file scope of the imminent work; cross-check
.agent/state/collaboration/active-claims.json AND each peer's latest
broadcast for collision. (2) PRE-EXECUTION code-expert review BEFORE
fan-out: brief code-expert on the planned scope + cycle intent + any
disposition rationale; dispatch any specialist reviewers code-expert
names (type-expert, test-expert, security-expert, architecture-expert,
assumptions-expert) before sub-agent edits begin. (3) If a fan-out is
in flight, do NOT spawn another — absorb returns as they arrive; when
the cycle's full bundle is back, run POST-DELIVERY code-expert review
on the staged diff, follow up on any specialist reviewers code-expert
recommends, then run pre-commit gates and commit cohesively via the
jc-commit skill (no --no-verify; full-tree pre-commit gating is
INTENTIONAL and CORRECT — multi-writer coordination is solved by
queue + claim + comms, never by narrowing gate scope). (4) If no
fan-out is in flight and the next cycle is ready, fan out: file-
disjoint sub-agents, one task brief per sub-agent, edits-only-no-
commit-no-gates discipline. (5) If >120s silent on shared comms,
broadcast a brief progress event (lane state, current cycle, blocker
if any). (6) Cross-check each peer's recent broadcast scope against
your intended next-cycle file scope; open a sidebar BEFORE
dispatching if encroachment risk surfaces. (7) Surface anything the
watcher will not surface (silent peer past cadence, inter-peer
routing question, missing owner direction, blocked sub-agent return)
via AskUserQuestion to owner OR directed comms to peer — never block
silently. (8) If >75% context budget, post coordinator-style
pre-positioning per PDR-064 and prepare mid-cycle handoff record per
PDR-063. (9) End the tick when nothing is due — advance where
possible, check where required, post where mandated; do not force
action when none is due.
```

**Peer state at compaction**:

- Lane A: Shaded Whispering Dusk / `763ef4` — Cycle 9 9.1 fan-out
  open (oak-eslint base.ts extraction, three-consumer scope, claim
  `97c6e74e`).
- Lane C: Tempestuous Spiralling Thermal / `9205b8` — natural
  closeout, holding for owner direction on portability adapter
  landing path.
- Consolidation: Wooded Swaying Thicket / `6c58f3` — landed
  `5ed8cf16` (napkin rotation + distilled 14 rules), paused for
  compaction.

Source plane: `operational` → `process`.

---

## 2026-05-22T14:?? — Mistbound Slipping Night EEF First Feature ff2 + commit-queue-intent-scope plan compaction-boundary handoff

Identity: `Mistbound Slipping Night / claude / claude-opus-4-7 / a1cb64`. Owner direction: "finish the plan, then prepare for compaction then stop, the work will be resumed post compaction, no git operations permitted until post compaction".

**Working-tree state at pause** (NOT staged; NOT committed; preserved as edits only):

- `.agent/plans/graph-mvp-arc.plan.md` — ff2 / D-1 / name-ai-client-adoption-owner resolution edits (6 substantive edits: frontmatter status flip, D-1 row resolution, D-1 commentary paragraph, risks-block mitigation update, executive-summary "spine todo" forward-tense fix, sequence-positions list "satisfied" annotation).
- `.agent/plans/sector-engagement/eef/current/eef-first-feature.plan.md` — ff2 resolution edits (frontmatter status flip + § Non-technical preconditions `**Resolved 2026-05-22**` block with owner=Jim Cresswell, mechanism=conversations, future-Notion-token possibility recorded as non-committing).
- `.agent/plans/agent-tooling/current/commit-queue-intent-scope-discipline.plan.md` — NEW; the plan written under /jc-plan + /jc-metacognition this turn. Self-check clean.

**Open Mistbound claim**: `c847fffc-e81b-4a1b-b4d2-e09251803111` (files scope: `.agent/plans/graph-mvp-arc.plan.md` + `.agent/plans/sector-engagement/eef/current/eef-first-feature.plan.md`). Claimed at 2026-05-22T13:57:31Z; TTL 3600s; will expire ~14:57Z. Resumption may need to re-open or extend.

**Pending Shaded sync** (`e48d7f16-e046-4a05-9b02-7d02b21609a2`): sync-urgent posted at 2026-05-22T14:04:01Z asking A/B/C coordination for shared-index conflict (Shaded's staged 9.2 work + my ff2 edits mixed in the index). The 90s default-to-Path-B in that message is INVALIDATED by the compaction pause + no-git-ops constraint; resumption must re-engage Shaded fresh, NOT default to Path B autonomously.

**Owner-discussion context**: Owner spotted the commit-queue pathspec-mode gap; asked for a separate plan. Metacognition pass surfaced that the right fix is NOT a new `--pathspec` flag but to honour the existing `intent.files` field across three subcommands (record-staged, verify-staged/verify-staged-again, commit). Replace-Don't-Bridge applied; no new schema field; no new ADR. The plan (`.agent/plans/agent-tooling/current/commit-queue-intent-scope-discipline.plan.md`) is the artefact.

**Resumption first-moves** (in order):

1. Verify cron `195ef238` (9-rule prompt) survived compaction (re-create if dropped, same prompt).
2. Re-arm comms watcher (the prior watcher `bj2md0z8h` crashed on an ENOENT for a peer-archived comms file; new watcher needed — known issue worth surfacing as a separate fix).
3. Read recent comms backlog for Shaded's response to `e48d7f16` (may have arrived during pause).
4. Decide coordination path with Shaded: if Shaded already committed their 9.2 work during the pause, my working-tree edits proceed via normal queue ceremony. If Shaded is still in-flight, re-engage Shaded fresh — NO autonomous Path-B default.
5. Verify claim `c847fffc` still active or re-open with same scope.
6. Resume ff2 commit flow (working-tree edits intact; staging is `git add` of the two plan files only; queue ceremony from there).
7. Surface the watcher-crash ENOENT issue as a candidate follow-up.

**Working-tree non-Mistbound state** (visible at pause; for resumption awareness):

- 3 graph-* eslint configs (`packages/core/graph-core/eslint.config.ts`, `packages/libs/graph-ingest/eslint.config.ts`, `packages/libs/graph-project/eslint.config.ts`) — Shaded's Cycle 9.2 rewire (may have landed during pause).
- Collab-state drift: comms-seen files for several agents, two new comms events, `active-claims.json` changes.
- Other peer working-tree state I don't own; do NOT sweep on resumption.

**Plan summary** (for the implementer who picks up the commit-queue-intent-scope plan):

- Three TDD cycles + Phase 0 verification + Phase Final hardening.
- One fingerprint helper variant (`createStagedBundleFingerprint` + `getStagedBundle` accept optional pathspec scope).
- Three call-site updates (record-staged + verify-staged + verify-staged-again all pass `intent.files`).
- One runtime injection update (`commit-workflow-runtime.ts`'s `runGitCommit` appends `-- <intent.files>` to argv).
- No new CLI flag; no schema field; no ADR.
- Acceptance: two-writer integration test where both writers commit cohesively with no cross-pollination, full-tree husky gate preserved unchanged.

**No git operations permitted** until owner clears the constraint. Working-tree edits preserved; no staging, no commits, no resets.

— Mistbound Slipping Night
