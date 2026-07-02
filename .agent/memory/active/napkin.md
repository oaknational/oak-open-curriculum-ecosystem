---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
fitness_content_role: drainable-buffer
---

# Napkin

Current-session observations. Append below. Rotate when over ~400 lines (`consolidate-docs`
step 6): extract every behaviour-changing entry, merge into `distilled.md` or graduate to a
permanent home, verify the home, then archive and start fresh.

## Napkin rotated (2026-07-02 dedicated consolidation, Rosemary stirs Bracken)

Rotated at a goal-gated dedicated-consolidation session. The processed window (2026-06-29 →
2026-07-02: the Falcon arc-closeout tail, Borealis's dedicated pass, the corpus-analysis arc
Wren→Laurel→Linnet→Flare→Tornado→Perseus, the check-encoding sessions Callisto→Limpet, the
statusline session Wyvern, the agent-naming deep-dive Tuna, and the upstream-alignment
closeout
Vanilla) is preserved verbatim in `archive/napkin-2026-07-02-rosemary-consolidation.md`
(byte-identical). Every behaviour-changing entry was dispositioned first-hand before the
archive-move; the commits and the homes are the record. Highlights: the shared-checkout
branch-ops and untracked-live-WIP disciplines → `worktree-hygiene` §5; the instrument-to-goal
and owner-granted-sequencing-exception disciplines → `user-collaboration.md`; rendered-output
test craft → `testing-patterns.md`; notify-at-the-action-moment →
`owner-attention-at-action-moments`;
authority-grounding (cite/govern) → `verify-dont-trust`; status-lines-are-verdicts →
`present-verdicts-not-menus`; two new patterns
(`removing-a-constraint-surfaces-what-it-also-bounded`,
`many-pairwise-links-mean-one-unnamed-lever`); the 2026-07-01/02 recurrence cluster →
the action-time-structural-interrupt pathogen inventory; F-111 (Bash sandbox / zsh dialect) →
the frictions register; the pre-existing red `sdk-codegen` gate + programmes execution facts →
the `upstream-api-alignment` thread record (#291 is MERGED). PDR-122-shaped candidates
(checkpoint-between-stages, calibration-first, throughput-vs-volume) graduated via the same
pass's distilled drain.

New session observations append below.

## 2026-07-02 — the consolidation session's own observations (Rosemary stirs Bracken)

- **The patterns-README index is GENERATED — never hand-edit it.** I hand-added index lines +
  category counts; the pre-commit `validate-patterns-index` gate refused the commit and named the
  fix (`pnpm --filter @oaknational/agent-tools validate-patterns-index:fix`), which regenerated the
  index from pattern frontmatter (including `use_this_when` verbatim). Lesson: before hand-editing
  ANY index, check for its generator/validator first — the repo's own generate-don't-hand-maintain
  doctrine, lived. (New pattern files still need authoring by hand; only the README index is
  derived.)
- **zsh no-word-split bit live, minutes after I documented it as F-111** — `for f in $(echo
  "$FILES")` passed one joined string, silently emptying a commit-queue enqueue whose error my own
  `2>/dev/null | jq` pipe then swallowed. Corroborates F-111 and
  `harness-shell-and-commit-edge-cases`;
  the deeper tell: piping a CLI's output to jq with stderr suppressed hides the failure completely —
  run state-mutating CLIs bare first, parse later.
- **The commit-queue `commit` workflow still dies at the documented depcruise→turbo stream
  truncation (2 attempts, 2026-07-02)** — the commit skill's documented cure (direct
  `git commit -F <msgfile>` with output redirected, hooks intact, then manual `complete` + claim
  close) worked exactly as written. Falsifiability datapoint for the skill: the spawned-commit path
  remains unreliable; keep the workaround.
- **`claims close` requires `--now`; `claims open` defaults it** — inconsistent option surface
  (F-72..F-80 sibling; cost one retry). A body/summary containing an apostrophe also exits 2
  (shell-quoting through the pnpm wrapper) — use apostrophe-free summaries or `--body-file`.
- **OWNER CORRECTION (the session's sharpest): recorded "keep-open granted by user" notes were
  NOT the owner's grants** — "those are not _my_ grants, they are grants made in my name, and I
  do not agree to them." I had treated the 2026-06-28 notes on Q-009/Q-011 as standing
  satisfiers; a recorded grant is a prior session's CLAIM, re-verified live each pass. Same
  correction one layer up: I first held the design-panel item behind a 2026-06-29 trigger
  against TODAY'S "everything graduated" — an older directive invoked against a later one
  (owner direction is a stream). Both homed: `precedence-is-not-approval` (recorded-grant +
  older-directive clauses), the consolidate-docs 7b.1 + consolidate-until-done contract
  (grants are live-per-pass; prefer re-homing long-lived questions into owning artefacts),
  and the register's own drain_strategy. Outcome: Q-009 → the two-altitudes report +
  repo-continuity strategy entry; Q-011 → PDR-118 open question 6; register EMPTY.
