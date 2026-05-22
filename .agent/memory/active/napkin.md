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
