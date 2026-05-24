---
name: "Repo-Continuity Archive Sweep + Invariants-List Role Decision"
overview: >
  Restore .agent/memory/operational/repo-continuity.md to its split_strategy
  contract by archiving 14 historical session-close blocks plus 8 stale
  Deep-Consolidation-Status entries to a new dated archive companion, then
  resolve the role question for the §Repo-Wide Invariants enumeration
  (curated branch-relevant resume card vs continuity-practice.md vs
  AGENT.md quick-reference).
todos:
  - id: phase-1-archive-sweep
    content: "Phase 1: archive 14 stale session-close blocks + 8 stale Deep Consolidation Status entries to repo-continuity-session-history-2026-05-10.md."
    status: completed
  - id: phase-2-invariants-role
    content: "Phase 2: surface 3 role options for §Repo-Wide Invariants to owner; implement chosen shape."
    status: completed
---

# Repo-Continuity Archive Sweep + Invariants-List Role Decision

**Status**: ✅ COMPLETED 2026-05-10 (Woodland Growing Leaf / claude-code / Opus 4.7 / `0844d9`)
**Opened by**: 2026-05-10 `jc-session-handoff` analysis (Blooming Ripening Glade / claude-code / Opus 4.7 / `0730a8`)
**Owner**: Jim
**Thread**: `agentic-engineering-enhancements`

## Resolution Note (2026-05-10)

- **Group A** (cure-naming + plan landing): commit `d981b2b3` —
  directive-layer foreign-stage cure named in `agent-collaboration.md`
  §c, plan landed, handoff state captured.
- **Phase 1** (archive sweep): commit `6d7d5ee3` — 13 session-close
  blocks + 9 Deep-Consolidation entries archived verbatim to
  `.agent/memory/operational/archive/repo-continuity-session-history-2026-05-10.md`.
  Live file 555 → 270 lines. Three retained 2026-05-10 same-day blocks
  per substance preservation (PDR-026); plan target ≤220 was based on
  one most-recent block, now updated by reality.
- **Phase 2** (invariants-role decision): commit `09b513ae` — owner
  chose **Option A** (keep §Repo-Wide Invariants in
  `repo-continuity.md`, role-justify with cross-references). Section
  header now states the curation role explicitly; each of the 12
  invariants annotated with its canonical home reference (rule path,
  ADR, PDR, or directive). All 13 referenced files verified to exist.
- **Coordination**: parallel agent activity from Iridescent Dancing
  Nebula (Wave 2 + agent-commands-retirement plan), Midnight Stealing
  Candle (codex /rename surprise), and Riverine Drifting Lighthouse
  (third-party skills cleanup). Phase 2 commit was briefly blocked by
  Riverine's in-flight markdownlint state; resolved via comms-event
  exchange (`9344adf1` query → `05ccefb8` reply within 15 min →
  `5bff4178` clearance). The directive-layer cure named in this plan
  was applied throughout: explicit `git add -- <paths>` and `git
  commit -- <paths>` for every commit.

## Trigger

`.agent/memory/operational/repo-continuity.md` is at 520 lines (target
400, hard 525). The file's own `split_strategy` is "Archive historical
session-close summaries to a companion archive file; keep only live
operational state and most recent session summary here". The
2026-05-10 handoff analysis identified ~340 lines of historical
session prose and stale consolidation-status entries that should be
archived per the split_strategy, plus one curated index (§Repo-Wide
Invariants) whose role is unmotivated and needs an owner decision.

The trigger is not the line count itself — substance preservation
overrides fitness pressure (PDR-026). The trigger is that the file's
documented split_strategy has not been honoured since the 2026-05-07
archive pass; archival is overdue independent of fitness.

## Scope

**Phase 1 — Archive sweep (mechanical, agent-executable)**:

- Create new dated archive companion
  `.agent/memory/operational/archive/repo-continuity-session-history-2026-05-10.md`.
- Move 14 stale session-close blocks (all session-close prose
  except the most-recent 2026-05-10 block) verbatim to the new
  archive.
- Move 8 stale Deep-Consolidation-Status entries (all `not due`
  entries from 2026-05-07 → 2026-05-09 plus the two `completed
  this handoff` entries from 2026-05-07 Silvered Masking Moth and
  2026-05-09 Luminous Twinkling Dawn) verbatim to the new archive.
- Keep in the live file: 2026-05-10 most-recent session summary,
  the two `due` consolidation-status entries (2026-05-08
  Opalescent and 2026-05-09 Mistbound — both still carry live
  signal), Current State, Active Threads, Branch-Primary Lane
  State, Current Session Focus, Repo-Wide Invariants (pending
  Phase 2), Current branch non-goals, Next Safe Step, Open
  Owner-Decision Items.
- Update the existing pointer paragraph (currently lines 258–259
  referencing the 2026-05-07 archive) to chain both archives.

**Phase 2 — Invariants-list role decision (owner-gated)**:

- Surface 3 role options to owner with trade-offs:
  - **Option A — keep here, role-justify**: explicitly mark §Repo-Wide
    Invariants as a curated branch-relevant session-resume card with
    cross-references to canonical homes (rules, ADRs, PDRs).
    Trade-off: clearest if the curation IS the value; risk is drift
    against canonical homes.
  - **Option B — move to `continuity-practice.md`**: the invariants
    summary is continuity-strategy-shaped and that directive owns
    continuity strategy/process per session-handoff role-boundary
    rules. Trade-off: aligns role/home; readers must follow one extra
    pointer at session resume.
  - **Option C — move to `AGENT.md`**: the entry-point file is where
    a fresh agent reads first; a quick-resume invariants index there
    helps every platform. Trade-off: AGENT.md is a navigation index,
    not a content home; this would expand its role.
- Implement chosen shape. Substance is preserved verbatim regardless
  of destination; cross-references to canonical homes (rules/ADRs/
  PDRs/directives) added where currently bare.

**Out of scope**:

- Editing any session-close block content during the move (verbatim
  archival only; PDR-026 substance preservation).
- Changing the 12 invariants themselves; this plan addresses only
  where the enumeration lives.
- Touching the existing `repo-continuity-session-history-2026-05-07.md`
  archive.
- Editing `practice.md` char-HARD (out-of-scope per
  branch-non-goals).

## Acceptance Criteria

**Phase 1**:

1. New file `.agent/memory/operational/archive/repo-continuity-session-history-2026-05-10.md`
   exists with 14 session-close blocks + 8 consolidation-status
   entries verbatim. Blocks ordered chronologically (oldest first
   matching the existing archive's convention or newest first
   matching the live file's convention — pick one and document).
2. `.agent/memory/operational/repo-continuity.md` retains the
   2026-05-10 most-recent session summary + the two live `due`
   consolidation-status entries + all structural sections (Current
   State, Active Threads, Branch-Primary, Current Session Focus,
   Repo-Wide Invariants, Next Safe Step, Open Owner-Decision Items).
3. Pointer paragraph chains both archives: 2026-05-07 and 2026-05-10.
4. Live file line count ≤ 220 (well under target 400).
5. `pnpm markdownlint:root` exits 0 on both files.
6. `git diff` shows zero substantive content changes — only
   relocation. Validation: `git diff` of the live-file removed lines
   plus the new-archive added lines yields zero net text change.

**Phase 2**:

1. Owner has explicitly chosen one of A/B/C; choice is recorded in
   this plan body before implementation begins.
2. The 12 invariants substance is preserved verbatim in its chosen
   destination.
3. If chosen destination ≠ A: the §Repo-Wide Invariants section in
   `repo-continuity.md` is removed and replaced with a one-line
   pointer to the new home; "Current branch non-goals" sublist
   stays in `repo-continuity.md` (it is genuinely live ephemeral
   state).
4. Each of the 12 invariants is annotated with its canonical home
   reference (rule/ADR/PDR/directive path), regardless of where the
   enumeration ultimately lives.
5. `pnpm markdownlint:root` exits 0.

## Validation Commands

```bash
# Phase 1 line-count check
wc -l .agent/memory/operational/repo-continuity.md
# Expected: ≤ 220

# Phase 1 archive existence
test -f .agent/memory/operational/archive/repo-continuity-session-history-2026-05-10.md && echo OK
# Expected: OK

# Phase 1 substance preservation (relocation, not edit)
# Manually grep one signature line from each archived block in the new archive file
grep -c "Session close (2026-05-09 — Mistbound" .agent/memory/operational/archive/repo-continuity-session-history-2026-05-10.md
# Expected: 1

# Phase 1 markdownlint
pnpm markdownlint:root
# Expected: exit 0

# Phase 1 fitness check
pnpm practice:fitness:informational 2>&1 | grep -A1 "repo-continuity.md"
# Expected: not flagged as soft or hard, OR flagged soft well below limit

# Phase 2 (after owner choice + implementation)
pnpm markdownlint:root
# Expected: exit 0
```

## Risk Assessment

**Phase 1 risks** — low:

- Risk: archive ordering convention mismatch (existing 2026-05-07
  archive ordering vs new). *Mitigation*: read existing archive head
  before writing new; document choice in new-archive frontmatter.
- Risk: a "stale" session-close block actually carries forward a
  load-bearing next-safe-step that the live `Next Safe Step` section
  does not capture. *Mitigation*: read each block's "Next safe step"
  paragraph before classifying as archive-eligible; carry forward
  any unique live signal into the live `Next Safe Step` or the
  appropriate thread record before archiving.
- Risk: pointer paragraph regression. *Mitigation*: Phase 1
  acceptance criterion 3 explicitly checks both archives are
  pointer-chained.

**Phase 2 risks** — low:

- Risk: moving the invariants enumeration breaks an unknown caller
  (rule, plan, or doc that links to `repo-continuity.md` §Repo-Wide
  Invariants). *Mitigation*: grep before moving:
  `grep -rn "Repo-Wide Invariants\|repo-wide-invariants" .agent docs`.
  Update any inbound references.

## Foundation Alignment

- **PDR-026 (substance preservation overrides fitness pressure)**:
  Phase 1 is verbatim archival, not compression. Phase 2 preserves
  the 12 invariants verbatim regardless of destination.
- **session-handoff role-boundary rules** (Step 2): "Historical
  closeout prose → archive or git history, unless it still changes
  the next safe step" directly authorises Phase 1. "Continuity
  strategy, rules, or process → `.agent/directives/continuity-practice.md`"
  is the rule that motivates Phase 2 Option B.
- **`replace-dont-bridge` rule**: Phase 2 chooses one home for the
  invariants enumeration; it does not maintain the enumeration in
  two places with a sync rule.
- **`no-moving-targets-in-permanent-docs` rule**: this plan only
  moves content; it does not embed any moving-target metric into a
  permanent doc.
- **principles.md "Could it be simpler?"**: Phase 1 is the simplest
  fix (archival per existing pattern). Phase 2 is owner-gated
  because three valid simplifications exist; choosing among them
  is owner-shaped.

## Lifecycle Touch Points

- Plan promotion: `current/` → `active/` when next session opens it.
- Phase 1 commit: one commit, pathspec-staged and pathspec-committed
  per the `agent-collaboration.md` §c cure landed 2026-05-10.
- Phase 2: owner-gated; commit after owner choice + implementation.
- Plan archival on completion: move to
  `.agent/plans/agentic-engineering-enhancements/archive/` with a
  Resolution Note per ADR-117.

## Documentation Propagation

This plan does not touch product code or ADRs. The substance is
operational continuity hygiene. Documentation surfaces touched:

- `.agent/memory/operational/repo-continuity.md` (live file edited).
- `.agent/memory/operational/archive/repo-continuity-session-history-2026-05-10.md`
  (new archive companion).
- `.agent/directives/continuity-practice.md` OR `AGENT.md` (Phase 2
  destination, owner-chosen).
- This plan body itself (record owner choice before implementing
  Phase 2).

No ADR or PDR update required; the doctrine is already settled.

## Reviewer Scheduling

- **Pre-execution**: not required — bounded mechanical work, no
  novel architectural shape. If owner directs, `assumptions-reviewer`
  could challenge the archive-vs-permanent-doc split.
- **During**: `code-reviewer` gateway after Phase 1 commit (catches
  any markdown structure regressions).
- **Post**: `docs-adr-reviewer` after Phase 2 commit to confirm the
  invariants-enumeration home aligns with role-boundary doctrine.

## Dependencies

**Blocking**: none. Phase 1 can start immediately.

**Phase 2 blocked on**: owner role-decision (A/B/C).

**Related plans**:

- `.agent/plans/agent-tooling/current/collaboration-doc-fitness-remediation.plan.md`
  (completed 2026-04-27) — sibling pattern: substance-preserving
  doc-fitness response via structural relocation, not compression.

## Consolidation

After Phase 1 lands, Phase 2 lands, and the live file passes
acceptance: run `/jc-consolidate-docs` to confirm no settled
content is now trapped in this plan and that the napkin
observations from 2026-05-10 (heading-count drift, split_strategy
aging, directive-layer tripwire absence) are correctly classified
for graduation timing.

## Future Enhancements (Out of Scope)

- Automating the archive sweep at consolidate-docs time (cadence
  candidate: every N days OR every M historical session-close
  blocks). Owner-direction-shaped, not consolidation-shaped.
- A fitness gate that flags the split_strategy violation directly
  ("more than K historical session-close blocks present" → soft).
  Currently the only signal is the line-count fitness warning,
  which only fires after substantial accretion.
