# Next-session brief (Codex) - longitudinal napkin review

Place this immediately after `/goal`:

```text
Run a dedicated Codex knowledge-curation session over the current napkin and the
last twenty archived napkins. The purpose is not ordinary rotation and not a
fitness drain: look for content that earlier passes missed, and for patterns
that only emerge across long timescales, repeated napkin reads, repeated agent
failures, or cross-session comparisons.

Use $oak-start-right-quick, $oak-consolidate-until-done, $oak-consolidate-docs,
and $oak-napkin. Mode is dedicated-knowledge-curation. Single Codex main-agent
session by default; do not spawn parallel agents unless the owner explicitly
widens scope.

Core rule: preserve substance first. Fitness is routing evidence only. Do not
archive, split, shard, rename, pointer-replace, or move unprocessed content to
make fitness improve. This pass is allowed to read archived napkins as source
material, but it must not rewrite archives. Active surfaces may be edited only
for real dispositions: `graduated`, `duplicate`, `owner-gated`, or
`stale-withdrawn`.

Current context:
- The 2026-05-31 docs consolidation repair is now `failed pass repaired`.
- `pnpm practice:fitness:strict-hard` last passed with SOFT only: 18 soft,
  28 healthy, 0 hard, 0 critical.
- `distilled.md`, `napkin.md`, `pending-graduations.md`, and `repo-continuity.md`
  are healthy / soft-only after the repair.
- The latest full pre-rotation napkin source is archived as
  `.agent/memory/active/archive/napkin-2026-05-31-foamy-docs-consolidation.md`;
  active `.agent/memory/active/napkin.md` is now a compact rotation note.
- Comms-event rotation remains paused until a dedicated comms research plan
  exists. Do not process or rotate comms events in this session unless the owner
  explicitly changes that boundary.
- An EEF plan claim may be active on EEF plan files; avoid EEF plan edits unless
  you re-check active claims and receive owner direction.

Read before editing:
- `.agent/memory/active/distilled.md`
- `.agent/memory/active/napkin.md`
- `.agent/memory/operational/pending-graduations.md`
- `.agent/memory/operational/repo-continuity.md`
- `.agent/memory/operational/curator-passes/2026-05-31-open-lofting-cliff-docs-consolidation.md`
- `.agent/memory/operational/curator-passes/2026-05-31-eclipsed-source-buffer-consolidation.md`
- `.agent/memory/operational/curator-passes/2026-05-29-highland-rising-squall.md`
- `.agent/research/agentic-engineering/continuity-memory-and-knowledge-flow/historical-napkin-synthesis-2026-05-29.md`
- `.agent/research/agentic-engineering/continuity-memory-and-knowledge-flow/historical-napkin-synthesis-2026-05-13.md`
- `.agent/research/agentic-engineering/continuity-memory-and-knowledge-flow/historical-napkin-synthesis-2026-05-09.md`

Corpus:
- Current active napkin: `.agent/memory/active/napkin.md`.
- Then discover the twenty most recent archived napkin files at session start.
  Do not trust this static list if new rotations have landed since the brief was
  written; recompute with `rg --files .agent/memory/active/archive | rg
  'napkin.*\.md$' | sort | tail -20`, then review newest-first if useful.
- At brief-writing time, the expected most recent archive window is:
  1. `.agent/memory/active/archive/napkin-2026-05-31-foamy-docs-consolidation.md`
  2. `.agent/memory/active/archive/napkin-2026-05-28-sylvan-curation.md`
  3. `.agent/memory/active/archive/napkin-2026-05-27-hidden-dimming-threshold-curation.md`
  4. `.agent/memory/active/archive/napkin-2026-05-26-thermal-critical-curation.md`
  5. `.agent/memory/active/archive/napkin-2026-05-26-feathered-hard-curation.md`
  6. `.agent/memory/active/archive/napkin-2026-05-25-misty-director-session.md`
  7. `.agent/memory/active/archive/napkin-2026-05-25-breezy-critical-hard-curation.md`
  8. `.agent/memory/active/archive/napkin-2026-05-24-shaded-silencing-dusk.md`
  9. `.agent/memory/active/archive/napkin-2026-05-24-post-m1-cleanups-window.md`
  10. `.agent/memory/active/archive/napkin-2026-05-24-pelagic-hard-napkin-window.md`
  11. `.agent/memory/active/archive/napkin-2026-05-24-knowledge-curator-continuation.md`
  12. `.agent/memory/active/archive/napkin-2026-05-24-curator-third-rotation.md`
  13. `.agent/memory/active/archive/napkin-2026-05-24-curator-fourth-rotation.md`
  14. `.agent/memory/active/archive/napkin-2026-05-22-evening.md`
  15. `.agent/memory/active/archive/napkin-2026-05-22.md`
  16. `.agent/memory/active/archive/napkin-2026-05-21.md`
  17. `.agent/memory/active/archive/napkin-2026-05-17.md`
  18. `.agent/memory/active/archive/napkin-2026-05-14.md`
  19. `.agent/memory/active/archive/napkin-2026-05-13.md`
  20. `.agent/memory/active/archive/napkin-2026-05-12b.md`

Primary questions:
1. What did earlier napkin passes miss because each pass processed a single
   napkin or a short window?
2. Which patterns only become visible after repeated reads of the same napkin
   lineage?
3. Which candidate lessons were dismissed as one-offs but now have enough
   repeated evidence to become owner-gated entries, PDR/ADR candidates, rules,
   patterns, or skill amendments?
4. Which apparent lessons have already been homed, and should not be re-added?
5. Which failures repeat despite already being written down, implying an
   action-time structural interrupt rather than another prose reminder?
6. Which capture surfaces are thinning, over-dense, contaminated, or otherwise
   losing signal over long timescales?
7. Which owner preferences or corrections have become durable enough to route
   into canonical surfaces, rather than remaining only in napkin prose?

Method:
1. Re-ground in live state: identity preflight, active claims, git status,
   recent git log, strict-hard fitness, and the agentic-engineering thread
   record.
2. Recompute the source corpus and write it into the output report, including
   any deviation from the expected list above.
3. Read the three prior historical synthesis reports first, then read the
   current plus twenty-napkin corpus. The job is to test, extend, and correct
   those reports, not merely repeat them.
4. Keep an explicit "missed by earlier pass" column for each candidate:
   - missed because single-napkin processing could not see recurrence;
   - missed because a prior pass over-trusted a coverage home;
   - missed because the pattern emerged only after later repeats;
   - not missed: already homed, but now has stronger evidence;
   - rejected: apparent pattern, but coverage or evidence does not hold.
5. For any removal or "already homed" verdict, verify the home in the live repo.
   Do not trust earlier curator ledgers as proof; they are claims to test.
6. Bias against loss: if coverage is uncertain, keep or owner-gate rather than
   withdraw. Dropping a captured lesson is the irreversible action.

Expected outputs:
- A new research report under
  `.agent/research/agentic-engineering/continuity-memory-and-knowledge-flow/`,
  suggested name:
  `longitudinal-napkin-review-2026-05-31.md`.
- A curator-pass ledger under
  `.agent/memory/operational/curator-passes/`, suggested name:
  `2026-05-31-codex-napkin-longitudinal-review.md`.
- Updates to `pending-graduations.md` only for owner-gated candidates with clear
  evidence and trigger conditions.
- Updates to `distilled.md`, rules, PDRs, ADRs, skills, or pattern files only if
  the evidence and natural home are strong enough. Otherwise route as owner-gated
  rather than forcing a graduation.
- A short note in `napkin.md` only for genuinely new observations from this
  session; do not add a note just to prove the pass happened.

Validation cadence:
- After report/ledger edits: targeted `markdownlint` and `git diff --check`.
- If `pending-graduations.md`, `distilled.md`, or other fitness-tracked surfaces
  are touched: run targeted `pnpm practice:vocabulary` and then
  `pnpm practice:fitness:strict-hard`.
- If any Practice Core, rule, skill, ADR, or code-facing doc is changed, run the
  relevant portability / adapter / focused validation for that surface.

Completion contract:
- Complete only when the current plus twenty-napkin corpus has been read or a
  specific unreadable file is named as a blocker.
- Complete only when every candidate finding in the report has a disposition:
  `graduated`, `duplicate`, `owner-gated`, `stale-withdrawn`, or `rejected`.
- Do not claim the pass found "nothing" unless the report explains the search
  dimensions and why prior syntheses already cover them.
- Final verdict must be one of:
  - `longitudinal review complete`
  - `partial longitudinal review`
  - `pending`
```

## Coordination note

At the time this brief was written, a fresh EEF claim existed for Hearthlit
Roasting Caldera on EEF plan files only. This brief is in the
`agentic-engineering-enhancements` lane and does not require touching EEF plan
files. Re-check active claims before starting anyway.
