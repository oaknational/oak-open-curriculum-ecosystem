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
[`patterns/`](patterns/README.md). Cross-session pending graduations
live in
[`pending-graduations.md`](../operational/pending-graduations.md).

The most recent rotation is archived at
[`napkin-2026-05-10.md`][archive-pass]. The prior rotation is
[`napkin-2026-05-09.md`][previous-pass].

[archive-pass]: archive/napkin-2026-05-10.md
[previous-pass]: archive/napkin-2026-05-09.md

## 2026-05-10 — Windswept Sweeping Gale / claude-code / opus-4.7 / `726fcb`

### Surprise — assumptions-expert caught a citation drifted by mid-session file rename

- **Expected**: my Phase 0 `ls -la` confirmed
  `.agent/memory/executive/invoke-code-reviewers.md` exists at 11614 B,
  so the disposition ledger row 11 citation was sound and the discard
  rationale held.
- **Actual**: between my first `ls` and the assumptions-expert sub-agent's
  read, the file was renamed to `invoke-code-experts.md` as part of an
  in-flight reviewer→expert rename (commit `249600f1` from the
  Stormbound Floating Current Phase 1B closeout that landed earlier the
  same day). The reviewer's `ls` against the cited path returned ENOENT;
  the audit had recorded a file size for a path that no longer existed.
- **Why expectation failed**: the working tree had three different
  identities making concurrent edits to `.agent/` surfaces during the
  same morning. My Phase 0 read captured a snapshot that was already
  stale by the time of write. The mistake was not the read — the
  mistake was citing the path I read at write-time without re-verifying
  the path was still valid against the post-rename state.
- **Behaviour change**: when a reviewer or write-step references a
  named file path captured earlier in the session, re-`ls` before the
  reference is committed. If the working tree carries multi-agent
  in-flight edits (the brief explicitly named this state), treat all
  earlier path captures as snapshot-only.

### Surprise — substance-preservation under HARD fitness pressure on `pending-graduations.md`

- **Expected**: a single batched candidate entry covering 8 items would
  fit within the existing `pending-graduations.md` budget (line target
  2000 / limit 2500; char limit 150000).
- **Actual**: my first batch authoring pushed character count to 155305
  (HARD over by 5305). After natural pairing of 19+21 (shared target)
  and 29+30 (shared scope), the count came down to 154078 — still HARD
  but reduced by ~1227 chars without losing substance.
- **Why interesting**: the pairing was curation-shaped (pairs were
  genuinely paired by source rationale), not optimisation-shaped. The
  PDR-026 substance-preservation discipline + ADR-144 §9e
  (limit-raise-is-owner-only) yielded the honest two-step: apply
  substance-preserving structural fix (pairing), then surface limit
  decision to owner. I did not trim withdrawal triggers or per-item
  rationale to chase the budget.
- **Cure (worked)**: the natural-pairing move is doctrine-aligned;
  the residual HARD signal is information for owner decision, not a
  blocker on my work.

### Surprise — `git stash --keep-index` is risky during shared-state sessions

- **Expected**: `git stash --keep-index` to compare current vs HEAD
  character counts on `pending-graduations.md` would be a reversible
  read-only-shaped probe.
- **Actual**: owner immediately interrupted: "no, stash is risky" — and
  the cleaner alternative was `git show HEAD:<path> | wc -c` which
  reads HEAD content without touching the working tree.
- **Why expectation failed**: `git stash` is state-mutating even with
  `--keep-index`; in a working tree carrying multi-agent in-flight
  edits, stashing risks losing peer-agent staged content the same way
  the foreign-stage absorption pattern documented. The `git show HEAD:`
  alternative achieves the same goal without any state mutation.
- **Behaviour change**: for "compare current state to HEAD" probes,
  default to `git show HEAD:<path>` over `git stash` even with
  `--keep-index`. Stash is genuinely destructive-shaped under
  multi-agent commit pressure.

## 2026-05-10 — Sylvan Sprouting Grove / codex / GPT-5 / `019e12`

### Deep Consolidation Opening

- Owner requested a deep `consolidate-docs` workflow from the
  `start-right-quick` entrypoint. I read the start-right and
  consolidate-docs skills, AGENT/principles/testing/schema/orientation
  directives, the always-applied rules, active memory, thread state, and
  collaboration state before editing.
- Identity preflight resolved `Sylvan Sprouting Grove` /
  `codex` / `GPT-5` / `019e12`. Active claims at open were fresh:
  Windswept Sweeping Gale owned the Claude insight-report disposition
  plan/pattern/pending-graduations lane; Stormbound Floating Current
  owned invoke-rule/expert cleanup surfaces. I registered a broad
  read-oriented `.agent/**` consolidation claim and logged the overlap
  decision before substantive shared-state work.
- Branch shape is already critical: `branch-touched-files` reports
  510 files against `origin/main`. This makes broad mutating
  consolidation inappropriate without owner decision; this pass favours
  preservation, evidence, and explicit owner-approval points.

### Napkin Rotation

- `pnpm practice:fitness:informational` reported active `napkin.md` as
  critical on lines, characters, and prose width. Per the consolidation
  workflow, I archived the outgoing napkin verbatim to
  `archive/napkin-2026-05-10.md`, distilled behaviour-changing lessons
  to `distilled.md`, and started this fresh active napkin.
- Loop-health diagnosis so far: earlier zones fired repeatedly, but
  same-day multi-agent traffic outpaced per-session closure. The limit
  still looks appropriate for an active capture file; the symptom is not
  that napkin should be larger, but that rotation must happen as soon as
  the file crosses the consolidation threshold.

### Deep Consolidation Findings

- After rotation, the active napkin is healthy; the only remaining hard
  fitness surface is `repo-continuity.md` (lines plus characters). Its
  frontmatter already names the correct split strategy, so the next move
  should be a targeted archive/current-state reconciliation, not prose
  compression.
- `repo-continuity.md` now mixes fresh 2026-05-10 session-close blocks with
  older branch-primary state for `planning/graph-tooling`, while the live
  branch is `feat/mcp-graph-support-foundation`. That is a continuity risk:
  stale "current" text can look more authoritative than the thread records.
- The latest experience files repeat one doctrine through different worked
  examples: gates and fitness signals are prompts to route knowledge to the
  right home. Treating them as numerical or bypass problems is the recurring
  failure mode.

### Session Handoff

- `/jc-session-handoff` after the deep pass did not surface a new ADR/PDR
  candidate. The already-captured finding is operational: `repo-continuity.md`
  should be reconciled by its named split strategy, because stale current-state
  text is now a bigger risk than the line count itself.
- Windswept Sweeping Gale became the sole active claimant on the
  insight-report implementation lane before handoff. The handoff claim stayed
  on continuity surfaces only, which is the right shape for closing a session
  while another agent is actively integrating the plan/pattern/register work.
