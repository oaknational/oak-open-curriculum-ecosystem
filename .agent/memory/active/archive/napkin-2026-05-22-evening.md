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

## 2026-05-22 — Charcoal Searing Flame plan-improvement collaboration + reviewer dispatches / claude / Opus-4.7 / `357b30`

### Mistake corrected by owner: Bash background watcher ≠ Monitor

**Observation**: I started the comms watcher as a Bash `run_in_background` task, then polled its output file via `find -newer` on a 2-min cron tick. Owner asked "why didn't you start a message monitor?" — exposing that I had not used the proper event-driven Monitor tool.

**Diagnosis**: Bash background processes deliver no notifications to the agent; the agent must poll their stdout file. The Monitor tool, by contrast, streams each stdout line as a `<task-notification>` that wakes the loop immediately. For event-driven wake on comms, Monitor is the correct shape.

**Cure**: when a long-running command's output should drive wake-ups (comms events, log lines, CI status), arm Monitor with `persistent: true` and a `grep --line-buffered` filter on the meaningful lines. Stop any prior Bash background watcher first to avoid two redundant streams.

### Insight from owner: "there is no exception, just useful work"

**Observation**: when proposing a follow-up commit for reviewer-verdict absorption, I framed it as "same residue-exception flow" — elevating the SKILL §"Collaboration-state commit residue exception" to a distinct ceremony. Owner corrected: *"there is no exception, just useful work, please make the changes then commit, and resist the temptation to give weight to ceremony"*.

**Diagnosis**: the SKILL §residue exception describes a mechanical adjustment to claim-close ordering when lifecycle files are in the bundle. Calling it "exception" elevates a mechanical adjustment to special-case status that invites process-talk where the substance is just "land the work including its lifecycle residue".

**Cure**: write commits to land useful work, including any necessary lifecycle residue. The mechanics are mechanics, not ceremony. Do not elevate any single mechanical adjustment to its own named ritual when reporting.

### Insight: peer-pair plan-improvement produces independent coverage

**Observation**: Velvet (codex/GPT-5) and Charcoal (claude/Opus-4.7) ran independent reviews of the same plan with no coordination beyond seeing each other's team-start broadcasts. Velvet surfaced six findings; Charcoal surfaced ten. Five overlapped substantively. Five were distinct on each side (Velvet: pre-checked ACs, stale "Last Updated", forward-trace task phase. Charcoal: self-contradictory fallback removal, behaviour+refactor bundling, describe-title rename ripple, signature equivocation, stagedFileMismatch semantic narrowing).

**Diagnosis**: different model families surface different defect classes. Codex's coverage was strong on plan-text discipline (pending markers, stale wording, AC checkbox state); Claude's was strong on internal coherence (contradictions, equivocations, semantic narrowing). Neither would have produced the full set alone.

**Cure**: for plan-improvement work where the plan is dense and the next implementation step is high-cost, peer-pair review across model families is worth ~2x the cost because defect coverage is non-overlapping by ~50%.

### Insight: pending reviewer dispatches at session-end are cheap

**Observation**: the plan body carried `type-expert` and `assumptions-expert` PENDING markers across two prior sessions. Owner approval to dispatch produced verdicts in ~60 seconds (parallel foreground sub-agent calls). Both had concrete plan-amendment impact — type-expert moved empty-pathspec enforcement from runtime-only to compile-time tuple + runtime narrowing; assumptions-expert validated proportionality and bounded ripple with grep evidence.

**Diagnosis**: PENDING reviewer markers persist because there's no scheduled point at which they get dispatched — each session defers them to "the implementer". They cost <1% of a TDD cycle and unblock the cycle definitively. Carrying them across sessions is a phase-misalignment failure mode.

**Cure**: at session-handoff time, when a thread record carries PENDING reviewer markers AND the current session has touched that thread's plan, dispatch the pending reviewers as a session-close move. Cost bounded; value is unblocked next session.

---

## 2026-05-22 — Velvet Vanishing Shadow commit-queue plan review / codex / GPT-5 / `019e50`

### Mistakes Made

- I read `collaboration-state claims --help` and then still ran
  `claims list --active` without the required registry path. Correct live check is
  `pnpm agent-tools:collaboration-state -- claims list --active .agent/state/collaboration/active-claims.json`.
  Behaviour change: for agent-tools verbs, read the action-level help before the
  first action use, not just the topic-level help.

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

## 2026-05-22 post-compaction — Stormbound Kiting Squall Cycle 1.2 + t12 peer-handoff + Cycle 1.3 plan reshape / claude / claude-opus-4-7 / `ddbea2`

### Surprise: peer-handoff arrived during compaction with hearsay owner-direction; correct move was to ask owner, not to silently honour or refuse

**Expected**: post-compaction would resume Cycle 1.2 work per owner's pre-compaction direction. **Observed**: at compaction boundary, Mistbound posted a directed comms claiming "owner direction at session-end — land my t12 work via Path-B". Three of their files already staged in the shared index; commit-queue intent at `pre_commit` phase. **Tension**: owner had told ME to compact and start Cycle 1.2; Mistbound's claim of owner-direction was peer-reported hearsay. **Behaviour change**: surfaced the situation to owner via `AskUserQuestion` with concrete state evidence + a verdict (don't silently land another agent's commit on peer-reported owner direction). Owner confirmed land Mistbound's t12 first. **Pattern**: when peer claims owner-direction-for-me, treat as hearsay until owner confirms directly; don't pass responsibility back via menus but surface verdict + ask for confirmation when a peer-reported direction conflicts with direction-to-me.

### Surprise: live in-production reproduction of the exact failure mode Cycle 1.2 was cured by — during my own ceremony to land Mistbound's t12

**Expected**: queue ceremony to land Mistbound's 3 t12 files would succeed (Mistbound said verify-staged passed in their session). **Observed**: `commit-queue verify-staged` rejected with 66 extra files because peer Shaded had concurrently staged their Cycle 11 jc-→oak- rename in the shared index between my queue-enqueue and verify-staged. **Behaviour change**: resolved via Path-B explicit-pathspec commit (`0b7289e9`) — Mistbound's 3 files only, Shaded's 66 staged files untouched. **Pattern**: the unscoped `verify-staged` failure mode isn't theoretical; it reproduces under multi-agent staging in any session window. Path B (explicit pathspec) was the only structural cure available before Cycle 1.2 landed. Three workspaces of evidence (Instance A = Mistbound ff2; Instance B = Wooded distilled.md; Instance C = me + Shaded) now anchor the plan body §Context.

### Surprise: pre-authoring reviewer findings collapsed a planned "new function" into "reuse existing on already-scoped data" — twice in two cycles

**Expected (Cycle 1.2)**: per the plan body, create new `verifyScopedStagedBundle` in core.ts. **Observed**: code-expert gateway + type-expert focused both converged on "structurally identical to `verifyStagedBundle`" — the existing function accepts already-scoped data through its existing parameters. No new function needed. Same pattern for Cycle 1.1's planned `createScopedStagedBundleFingerprint` — also dropped because the existing helper accepts already-scoped data unchanged. **Pattern**: when a "new parallel function" feels structurally identical to an existing one, that's a signal the migration is purely on the read seam, not on the verify/fingerprint logic. The scope enforcement is upstream at the staged-read; downstream functions don't need awareness of scope at all. **Behaviour change**: at pre-authoring, ask reviewers explicitly "is the new function structurally identical to the existing one?" — if yes, the new function is a duplicate, not a parallel.

### Surprise: test-expert CRITICAL VIOLATIONS reshaped Cycle 1.3 before any code was written

**Expected**: Cycle 1.3 would land both a unit test AND an integration test (per the original plan body's "ephemeral-repo two-writer end-to-end"). **Observed**: test-expert flagged the integration test as classification-wrong — spawning real `git commit` triggers immediate-fail rule 8 (subprocess) + integration tests must have NONE IO + husky-hook recursion risk via inherited `core.hooksPath`. **Behaviour change**: dropped the integration test entirely (Path B); the structural cure widens the `runGitCommit` dep so the pathspec passes through the seam, then unit-tests via the capture-list pattern Cycle 1.2 used. **Pattern**: integration tests that spawn subprocesses against real filesystem are often E2E in disguise. If the invariant can be observed at unit level through a widened dep, that's both safer and more proportionate. The end-to-end behaviour of `git commit -- <pathspec>` is git's contract — not ours to re-test.

### Surprise: plan-improvement-only mode produced the biggest single-pass cleanup of plan-body drift in this arc

**Expected**: minor edits to absorb Cycle 1.3 reviewer findings. **Observed**: when owner halted execution and said "concentrate on improving the plan", the absorption surfaced 8+ separate stale references throughout the plan body that pre-dated the Cycle 1.1 + 1.2 simplifications — references to `verifyScopedStagedBundle`, `createScopedStagedBundleFingerprint`, integration tests, "backward-compat fallback to remove", and an outdated "rename three functions" retirement plan. **Behaviour change**: a focused plan-improvement pass produces orders-of-magnitude better-quality handoff state than incrementally absorbing review findings while executing in parallel. **Pattern**: when a plan has accumulated multiple cycles of absorption, periodically scope a "no-execution, plan-only" pass to clean stale references — the absorbed findings on earlier cycles often invalidate forward-looking language in later cycles, and only a no-execution pass catches the rip-through systematically.

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

---

## 2026-05-22 — Velvet / Charcoal plan-improvement rendezvous

### Insight: team-start must not mistake "no active claim yet" for "no peer will arrive"

**Observation**: I began the plan-improvement pass, opened a narrow plan claim, and initially treated Charcoal collaboration as something to emulate with a read-only reviewer subagent. The live all-channel comms stream then delivered Charcoal's actual team-start with ten concrete findings and a clear "Velvet edits, Charcoal reviews" preference.

**Diagnosis**: in a team-start session, a peer can arrive after the first live checks but before edit finalisation. The correct discipline is to keep the watcher alive, treat early solo analysis as provisional, and reconcile actual peer input before reporting the plan improved.

**Cure**: after opening a claim in a named peer-collaboration turn, do a final comms reconciliation before closeout. If the named peer appears, explicitly map their findings to accepted / partially accepted / deferred edits rather than letting the first agent's private review become the whole story.

— Velvet Vanishing Shadow

---

## 2026-05-22T15:?? — Mistbound Slipping Night EEF gate-1a t12-citation-shape cycle (resumed post-compaction) / claude / claude-opus-4-7 / `a1cb64`

### Surprise: pre-execution code-expert review caught a design-time bug before any source code was written

**Observation**: opened the t12-citation-shape cycle (Round 1, EEF gate-1a load-bearing — non-empty tuple compile-time + Zod `min(1)` runtime). Brief gave code-expert the planned shape; their pre-execution verdict surfaced a duplication risk: the corpus-plan §Phase F defined `Citation.source` as a literal `'EEF Teaching and Learning Toolkit'` string field, which collides with the canonical `EEF_ATTRIBUTION` constant in `oak-curriculum-sdk/src/mcp/source-attribution.ts`. Two homes for the same fact; silent drift if either changes.

**Diagnosis**: this bug would NOT have surfaced at type-check or lint or vitest — the literal-string field would have type-checked fine and the schema would have accepted EEF_ATTRIBUTION's string value. Code-expert read across two files (the plan + the existing source-attribution constant) and named the architectural-intent collision. Static gates only catch syntactic problems; pre-execution review catches design-intent collisions.

**Cure**: surfaced to owner as a present-verdicts-not-menus question (Option A: drop source; Option B: import EEF_ATTRIBUTION; Option C: status quo with risk). Owner picked Option A. Cycle widened to include corpus-plan §Phase F amendment cohesively with citation-shape.ts landing.

**Generalisation**: this is a worked-instance counter-argument to "code-expert can run post-write only". Pre-execution review has a measurable hit rate on bugs that static gates do NOT catch. Pattern candidate: *Pre-execution review catches design-time bugs static gates cannot* — graduate to memory/active/patterns/ if a second instance lands within the next two sessions.

### Surprise: Stormbound's graceful abandonment via `intent.notes` field as worked instance of intent-scope discipline

**Observation**: at 15:33Z Stormbound enqueued their own commit intent `cf39fd43` for the commit-queue-intent-scope-discipline plan finalisation. Their `record-staged` step detected my staged files (citation-shape.ts + .unit.test.ts + corpus-plan amendment) already present in the shared index. Rather than sweep my work, Stormbound voluntarily transitioned the intent to `phase: abandoned` and wrote in the `notes` field: *"Foreign-staged Mistbound citation-shape files detected before record-staged; abandoning to avoid sweep of peer work-in-progress (the very failure mode Cycle 1.1 cures)."*

**Diagnosis**: this is the EXACT pattern the intent-scope-discipline plan codifies. An agent locally observes a foreign-staged set, recognises that running `record-staged` would absorb peer work-in-progress, and abandons their intent voluntarily. The whole-index fingerprint discipline structurally enables the detection; the agent's voluntary back-off is the runtime cure. Worked-precedent for the future-state where `record-staged --scope <intent.files>` makes the abandonment unnecessary.

**Cure (already in flight)**: the intent-scope-discipline plan landed conceptually in working tree. Stormbound's session is finalising Cycles 1.1-1.3. This session demonstrated the manual cure (abandonment); the structural cure is the plan's three operative fixes.

**Generalisation**: the intent-record's `notes` field is itself coordination infrastructure. An abandoned intent carrying a substantive `notes` explanation is more durable than a comms-event because it lives inside the queue surface every subsequent committer reads. Pattern candidate: *Use intent.notes for inter-agent abandonment rationale* — adjacent to the intent-scope-discipline plan's substrate work.

### Surprise: workspace bootstrap fragility — 4+ workspaces must be built before lint resolves

**Observation**: ran `pnpm --filter @oaknational/curriculum-sdk lint` after writing citation-shape.ts. Failed at config-load time with `Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: No "exports" main defined in ... @oaknational/eslint-plugin-standards/package.json`. The plugin's `package.json` exports points at `./dist/index.js` which did not exist. Source lives at `packages/core/oak-eslint/` — the workspace ships the package under the `@oaknational/eslint-plugin-standards` name but the dist/ is only present when explicitly built. Same pattern repeated for `@oaknational/sdk-codegen` subpath exports (`/search`, `/zod`, `/api-schema`), `@oaknational/result`, and `@oaknational/type-helpers`. Resolution: `pnpm --filter @oaknational/eslint-plugin-standards build && pnpm --filter @oaknational/sdk-codegen build && pnpm --filter @oaknational/result --filter @oaknational/type-helpers build`. Then lint resolved.

**Diagnosis**: a freshly-checked-out branch cannot lint any consumer workspace until specific producer workspaces have been built first. The implicit build-order graph is invisible to a new agent picking up work. The error mode is opaque (`exports main defined` errors at jiti config-load time, before any file is touched). No `pnpm bootstrap` or equivalent runs the cascade automatically; turbo's caching does it for `pnpm check` but individual workspace commands don't. The same fragility presumably affects type-check, test, dev — any cross-workspace command that needs the producer's dist/.

**Cure (immediate)**: surfaced as a pending-graduations candidate this session. Possible cures: (a) `pnpm bootstrap` script that runs all `build:libs` workspaces in dependency order; (b) producer workspaces ship `development` exports condition that resolves to `src/` so lint works without build (the curriculum-sdk's own package.json shows `"development": "./src/index.ts"` as an example pattern); (c) explicit precondition step in CI / agent onboarding documentation.

**Generalisation**: this is workspace-graph bootstrap fragility — a class of friction that scales poorly with team size because every new agent landing on a fresh checkout hits it. The class is distinct from product-code bugs (it's a tooling-config bug) and from runtime errors (it surfaces at config-load, before any code runs). Worth a focused fix sprint or a graduated rule about producer-workspace conditional exports.

### Surprise: type-expert + test-expert verdicts conflicted at surface; resolved cleanly via more-restrictive rule

**Observation**: dispatched type-expert + test-expert in parallel for the t12 cycle. Type-expert's verdict included a recommendation to write standalone `expectTypeOf<Caveats>().toEqualTypeOf<readonly [string, ...string[]]>()` cases proving the compile-time non-empty-tuple invariant. Test-expert's verdict invoked `test-immediate-fails.md` item 19 ("asserts on types only is an immediate fail") and rejected pure type-only test cases.

**Diagnosis**: the two reviewers operate at different abstraction layers — type-expert sees a load-bearing type invariant and wants to test it; test-expert sees a Practice rule about what tests are FOR (logic, not types). Both are correct within their layers. The conflict is a layer-cake collision at the cycle-shape boundary.

**Cure**: applied the more-restrictive rule (test-expert wins on test policy). Negative compile-time invariants are enforced by the type definition itself + `satisfies Citation` anchors on positive fixtures; standalone type-only tests are dropped. Type-expert's recommendation was honoured WHERE it co-occurred with a runtime assertion (the existing tests already do `expectTypeOf` adjacent to `safeParse` runtime checks).

**Generalisation**: when reviewers in different layers conflict, the more-restrictive Practice-level rule wins. Pattern: *more-restrictive-Practice-rule-wins for inter-reviewer-conflict*. Adjacent to existing `different-lens-reviewer-divergence.md` pattern — that one covers HOW different lenses diverge; this is the resolution discipline WHEN they do.

### Surprise: my own claim-ID typo at commit-queue enqueue not caught by type-check

**Observation**: when running `commit-queue enqueue --claim-id <UUID>`, I mistyped the claim's UUID — mixed the first half of t12-main (`f013f95d-ab63-4e83-a716-`) with the second half of t12-supplementary (`b6ce9b997141`). The CLI returned `unknown claim_id: f013f95d-ab63-4e83-a716-b6ce9b997141`. I had to manually compare strings against the `claims open` output to spot the swap.

**Diagnosis**: the CLI's error mode is correct (it rejects unknown IDs cleanly). The friction is that long opaque UUIDs are visually similar — copying half from one ID and half from another is a class of typo TypeScript's type system cannot catch (the string is a valid UUID format, just a non-existent one).

**Cure (minor UX improvement candidate)**: the CLI could (a) accept claim-id prefixes (first-N chars when unique), or (b) suggest nearest matches on `unknown claim_id`. Either reduces the visual-comparison burden. Not blocking; surfaced as a usability candidate.

**Generalisation**: this is opaque-ID friction. Any CLI that takes a UUID input and produces a plain `unknown <id>` error mode has the same shape. Worth checking other commit-queue and collaboration-state subcommands for the same UX gap. Adjacent to `agent-tool-help-on-invalid-flags` direction.

### Reflection: team coordination model — peer-primary at session scale

**Observation**: this session ran under peer-primary topology with Shaded / Tempestuous / Wooded earlier in the day, then Stormbound joining later. Sub-agent dispatches: code-expert (pre + post), type-expert, test-expert. Output: one cycle landed (t12-citation-shape, staged + handed to Stormbound). Coordination overhead: ~30+ comms-events, three commit-queue intents (two by me, one by Stormbound — abandoned), one compaction-boundary.

**Diagnosis**: per-session throughput-per-agent was low. But the coordination-overhead-vs-throughput ratio is the wrong frame. The session built / proved substrate: the intent-scope-discipline plan (Stormbound landing), the graceful-abandonment-as-coordination pattern (worked instance B), the pre-execution-review catches design-bugs evidence (live instance). Future sessions will run faster because of this session's substrate. The investment shape is exponential, not linear.

**Comparison with prior models**:

- vs **solo agent**: same single-cycle throughput (1 atomic landing). Coordination overhead added. BUT substrate built that future sessions exploit. Solo agents cannot prove peer-coordination patterns.
- vs **coordinator+helpers (hub-and-spoke)**: peer-primary eliminates the coordinator-class bottleneck without losing the centralised view (comms-event stream is the view). Failure mode: shared-resource bottlenecks (git index) — solved by queue+claim+comms.
- vs **Cursor Multitask single-brief**: cursor-multitask is execution-class; peer-primary is design-class + execution-class. This session's design moments (source-field question, Zod/TS tension) needed individual peer-owner dialogue, not a team brief.
- vs **gatekeeper specialisation**: not used directly this session; the commit-queue partially implements it (queue mediates commit windows; each peer enqueues; FIFO + abandonment serialises). A fuller gatekeeper would have ONE agent run husky for all peers' commits.
- vs **peer sidebar** (the design-work case): used implicitly via directed comms (my exchange with Stormbound about queue ordering; their abandonment as response). Peer sidebar works WELL for two-agent design exchanges; we haven't tested it at 3+ agents.

**Synthesis**: peer-primary is the right default for current Practice scale (2-4 agents). The model's costs are SHARED-resource bottlenecks (the git index, the husky gates), not coordination overhead. The intent-scope-discipline plan is the substrate cure for the git-index bottleneck; a gatekeeper-specialisation amendment would cure the husky-gate redundancy. Both are well-bounded structural cures, not coordination-protocol amendments.

**What surprised me about peer-primary**: emergent properties. Stormbound's graceful abandonment wasn't a planned move — it emerged from each agent following local discipline (detect foreign-staged → abandon → cite). Well-designed local rules produce well-formed global behaviour. This is the strongest argument for peer-primary at scale: cheaper than central coordination, more robust than fully-decentralised, emergent behaviour is informative.

**What didn't surprise but is worth naming**: the FIFO-strict commit-queue serialised disjoint-file commits. Stormbound's files (commit-queue plan + memory) were disjoint from mine (evidence-corpus + corpus plan). They could have committed in parallel if the queue honoured `intent.files`. The intent-scope-discipline plan is the cure. Until it lands, peer-primary at >2 agents committing simultaneously will continue to feel the friction.

**Candidate for distilled.md**: "peer-primary topology cost shape: cost = f(shared-resource contention), not f(coordination protocol)". Subject to second-instance confirmation before graduation.

— Mistbound Slipping Night

---

## 2026-05-22 — Mistbound Slipping Night metacognition pass: framing-direction-determines-graduation-destination

### Insight: framing direction (session-forward vs impact-backward) determines what graduates

**Observation**: at session-close I surfaced five insights from this team session framed forward-from-session ("things that happened in this peer-primary session"). Owner reframed them backward-from-impact ("improve coordination surfaces regardless of topology"). Same observations, opposite framing, profoundly different home: session-forward → session-anecdote in napkin; impact-backward → structural-cure candidate for rules / PDR amendments / schema work.

**Diagnosis**: I was running session-forward by default — reasoning from "what did I see this session" toward "what's worth recording". The owner's reframing inverts the direction: start from "what coordination surface needs cure" and select observations that illuminate it. This is a higher-leverage framing because it makes the observations topology-independent — the cure applies to solo, hub-and-spoke, peer-primary, cursor-multitask, gatekeeper, all of them.

**Cure**: when surfacing insights for graduation, the question is "what surface does this cure?" not "where did this observation come from?" Captured as PDR-014 amendment candidate in pending-graduations.

**Generalisation**: the substance of an observation determines its truth; the framing determines its destination. Impact-backward framing is the more durable shape because it travels across the session boundary that produced the observation. Session-forward framing's natural home is the experience file (subjective texture); impact-backward framing's natural home is the rule / PDR / schema surface (durable substrate). Both are correct — they answer different questions.

### Insight: continuity-surface drift is structurally orphaned from cycle commits

**Observation**: this session produced significant continuity-surface edits (napkin entries, thread record updates, repo-continuity refresh, pending-graduations additions, experience file) AFTER the cycle's product code was drafted. The reflective output cannot ride with the cycle commit because it doesn't exist yet at cycle-commit time. The drift sits in the working tree unowned, waiting for a sweep.

**Diagnosis**: orphaning is structural, not procedural. Continuity-surface commits ratify an OBSERVATION about the session; cycle commits ratify a TESTED CHANGE. The acceptance criteria differ. Bundling them obscures both. The right shape isn't "tie continuity drift to the cycle commit" — it's "continuity-surface commits ARE always separate, and that's correct."

**Cure candidate (rule-shape)**: a rule naming that continuity-surface edits land as their own commit (`chore(continuity): land 2026-05-22 <agent> session reflection`) — either by the closing agent OR by explicit handoff to a follow-on agent. The unowned-ness becomes named pattern, not incidental drift. Topology-independent.

### Insight: reviewer dispatch parallelism has two distinct shapes

**Observation**: this session ran code-expert pre-execution first, then dispatched type-expert + test-expert in parallel after absorbing code-expert's verdict. The fan-from-verdict shape is appropriate for unknown scopes. But for cycles with NAMED reviewer sets in the plan (e.g., t12 named "type-expert + test-expert mandatory" in eef-first-feature plan), the named set could fan-from-brief in parallel from cycle-open.

**Diagnosis**: the current rule (`pre-execution-code-expert-review-per-loop-cycle.md`) prescribes fan-from-verdict (code-expert routes). For named-set cycles this serialises a hop that doesn't need serialising — code-expert is rubber-stamping the named set rather than discovering it.

**Cure candidate (rule-amendment)**: amend the pre-execution review rule to distinguish two shapes: fan-from-brief (named-set cycles, all reviewers parallel from cycle-open) vs fan-from-verdict (unknown-scope cycles, code-expert routes). Code-expert still runs in fan-from-brief — as architectural reviewer, not as router. Saves one wall-clock hop per named-set cycle.

### Insight: handoff messages must be self-contained — the rule isn't named

**Observation**: my Stormbound handoff message was thorough because I knew their session can't read my transcript. The discipline isn't anywhere in the rules. A next agent producing a sparse handoff message wouldn't see anything wrong from their own session view.

**Diagnosis**: receiving agents (peer agents, future self after compaction, cross-platform agents) cannot read the sending agent's transcript. The handoff message IS the entire information transfer. Without an explicit rule, the discipline is implicit and inconsistent across agents.

**Cure candidate (rule-shape)**: a new rule "handoff-messages-self-contained" enforcing: every fact the receiver needs to act NAMED in the message; every decision NAMED with WHO + WHEN; every artefact named by FILE PATH; receiver should act WITHOUT clarifying questions back. Related to but distinct from "comms event stream canonical truth" (which is about the channel; this is about the substance).

### Insight: queue-wait state is invisible to peers and owner

**Observation**: when blocked behind Stormbound's `cf39fd43`, my wait state lived only in my session reasoning. No comms event named the dependency. If Stormbound had committed (rather than abandoned), I would have been silently polling. If a third agent had arrived, they couldn't see I was queued.

**Diagnosis**: dependency state should be a first-class observable. The intent-scope-discipline plan reduces queue waits structurally, but until it lands the waits exist and should be visible.

**Cure candidate (comms-convention or schema amendment)**: when an agent enters "waiting on intent X" state, emit a directed comms-event to the upstream agent + audience naming the queue dependency. Either as a convention on existing `directed` kind (immediate), or as a new event-kind or `tags: ['queue-wait']` once ADR-183 substrate lands. Makes the dependency graph observable to peers + owner.

### Insight: post-compaction resumption needs an explicit "did my prior edits land?" step

**Observation**: my napkin handoff entry listed 7 resumption first-moves. None was "verify my prior session's edits actually landed somewhere." I assumed my ff2 plan edits were lost; only by grepping the file content did I discover they had been swept into a peer commit.

**Diagnosis**: compaction-boundary (and any session-reentry) is a discontinuity. The agent's prior-session reasoning is summarised; volatile facts (working-tree state, recent peer activity) are stale. Without an explicit validation step, agents redo work or assume loss.

**Cure candidate (PDR-063 amendment)**: extend PDR-063's mid-cycle pickup contract with a pre-action validation step: `git log --since "<boundary>" -- <files-I-edited>` BEFORE assuming work was lost; check closed-claims archive for closures during pause; check queue status for phase transitions. Topology-independent — applies to solo resumption, mid-cycle peer handoff, and compaction-boundary equally.

— Mistbound Slipping Night

---

## 2026-05-22 — Mistbound deep reflection after promoting six graduation candidates

### Insight (7th): substrate-building sessions vs production sessions have different work-selection criteria

**Observation**: t12-citation-shape was a defensible pick — load-bearing for both gates, single-file, Round 1 parallel-safe. But the session's actual value was the SUBSTRATE we proved (six graduations), not t12 itself. If I had picked t9-guidance-constant or t13-freshness-gate instead, the same substrate would probably have emerged — Stormbound's abandonment, pre-execution review catching design-bugs, workspace bootstrap discovery, inter-reviewer conflict resolution all came from the OPERATIONAL flow, not from t12 specifically.

**Diagnosis**: at least two session modes exist — substrate-building (value in operational flow) and production (value in shipped cycle). Different work-selection criteria. Substrate-building should pick cycles that EXERCISE the substrate (multi-writer coordination, parallel reviewer dispatch, cross-workspace integration); production should pick highest-leverage cycles for product. Without naming the mode, agents default to production-mode selection criteria even when the team is in substrate-building.

**Cure candidate**: name the two modes; have agent (or owner) signal which applies at session-open. Trigger before promotion: second instance of an agent (or owner) explicitly distinguishing substrate-building from production session modes in cycle-selection reasoning.

### Insight (8th): doctrine encodes scale-of-applicability implicitly; the implicit scale collides in multi-agent contexts

**Observation**: session-handoff SKILL §11 prescribes `pnpm check` before declaring handoff complete. The owner-direction-derived check-singleton-per-window invariant says only ONE agent runs check per window. These collide in multi-agent contexts; the collision was patched in this session via owner override ("skip the gates").

**Diagnosis**: §11 was written at single-agent scale (the closing agent IS the only agent; running check is correct). The singleton invariant is multi-agent. Neither names its scale-of-applicability. Result: doctrine that works at one scale breaks at another, patched ad-hoc rather than structurally.

**Cure candidate (PDR-014 amendment)**: amend the consolidation discipline to require promoted doctrine names its scale-of-applicability (single-agent / multi-agent / either). When doctrine collides across scales, the multi-agent rule takes precedence (single-agent is the degenerate case). Trigger before promotion: second instance of two pieces of doctrine colliding because one is single-agent-scoped and the other multi-agent-scoped without explicit scale tagging.

### Insight (9th, surfacing as question for owner): owner attention is gated at action-moments, not reasoning-moments

**Observation**: owner intervened at three moments this session — (a) my AskUserQuestion about Citation.source (positive — picked Option A); (b) my commit-queue commit attempt (rejection — redirected to Stormbound); (c) my pnpm check attempt (rejection — said skip). NO interventions during reasoning, planning, reviewer dispatches, implementation, or staging.

**Diagnosis**: owner attention gates at action-moments (commit, push, send, alter shared state) — moments of irreversibility-or-expensive-reversal — not reasoning-moments. AskUserQuestion is the right interface because it IS an action-moment with optional redirect.

**Question for owner, not capture**: is this insight worth structural cure? If yes — cure shape could be: structure work to MINIMISE owner interrupts at non-action-moments AND MAXIMISE owner observability at action-moments. The rules implicitly support this but don't name it. If no — useful framing that doesn't need promotion.

— Mistbound Slipping Night
