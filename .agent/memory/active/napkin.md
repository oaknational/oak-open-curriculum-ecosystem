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
