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

The most recent rotation is archived at
[`napkin-2026-05-13.md`][archive-pass]. The prior rotation is
[`napkin-2026-05-12b.md`][previous-pass]. The 2026-05-13 rotation was the
output of a Coppery Kindling Anvil deep-dive consolidation pass across the
three-napkin corpus
(`napkin-2026-05-12.md` + `napkin-2026-05-12b.md` + `napkin-2026-05-13.md`);
ten emergent findings (F1-F10) were captured in
[`historical-napkin-synthesis-2026-05-13.md`][synthesis-report].

[archive-pass]: archive/napkin-2026-05-13.md
[previous-pass]: archive/napkin-2026-05-12b.md
[synthesis-report]: ../../research/agentic-engineering/continuity-memory-and-knowledge-flow/historical-napkin-synthesis-2026-05-13.md
[next-consolidation-opening]: ../../plans/notes/next-session-opening-2026-05-13.md

## 2026-05-13 — Coppery Kindling Anvil / cursor / claude-opus-4-7 / `536dd4`

### Consolidation pass disposition

- Deep dive across three rotated napkins produced 10 numbered findings
  (F1-F10). F1 distilled to [`distilled.md`](distilled.md) as the
  cross-cutting "passive-guidance loses to artefact gravity" constraint
  on cure design. F2-F10 routed to
  [`pending-graduations.md`](../operational/pending-graduations.md) as
  numbered entries with explicit triggers, sizes, and target
  destinations.
- Synthesis report stored at
  [`historical-napkin-synthesis-2026-05-13.md`][synthesis-report] as
  durable evidence base. Future ADR/PDR/rule authors should cite the
  evidence arcs from that report rather than re-scanning the rotated
  napkins.
- Napkin rotated past the 500-line threshold: prior `napkin.md` (605
  lines, covering three sessions across Mossy Blossoming Canopy,
  Quiet Stalking Mirror, and others) became
  `archive/napkin-2026-05-13.md`. Substance preserved via the synthesis
  report and pending-graduations entries.

### Open verdicts surfaced to owner

- Three immediate-action candidates surfaced as numbered verdicts (not
  menus): (1) PDR `coordinator-role-as-allocator-not-gatekeeper`; (2)
  `agent-collaboration.md § Treat Commit as a Short-Lived Shared
  Transaction Surface` amendment for mutual mechanical verification +
  hook-output authority; (3) rule `boundary-design-strictness`
  operationalising the owner four-part doctrine
  (no-aliases / no-fallbacks / fail-fast / replace-don't-bridge).

### Session-bridging opening statement for the next consolidation pass

- Owner asked for an opening statement for the next session to continue
  consolidation with another `/jc-consolidate-docs` run. It lives at
  [`.agent/plans/notes/next-session-opening-2026-05-13.md`][next-consolidation-opening]
  and names the dirty consolidation outputs to commit first, the three
  numbered verdicts to re-surface, the next-touch pending-graduations
  items, the distilled.md graduation walk, and the explicit
  do-not-do list (no commit amendment, no reactive trimming, no
  retargeting the bounded consolidation queue).
- Two commits landed this session: `39b3271d`
  (`docs(graph): absorb WS1.5 canon pre-implementation review`) by this
  session under owner authorisation *"commit ALL files, regardless of
  claims"*; and `c10c75e3` (`chore: learning loop processing`) landed by
  the owner directly during this session's handoff window, capturing
  the consolidation outputs themselves and overriding the earlier
  mid-session *"forget commits"* redirect.

## 2026-05-13 — Pearly Drifting Jetty / codex / GPT-5 / `019e22`

### Controller grounding

- Owner assigned this session as controller-only for the P8 continuation:
  coordinate developers and preserve the P8 acceptance route, but do not do
  implementation. Live grounding falsified the opener's latest-commit
  hypothesis: `HEAD` was already `b39398b6`, four commits after `fb332619`.
  Treat closeout openers as hypotheses even when they are very fresh.
- Three standby developers had already introduced themselves via untracked
  unified comms events, while active claims and the active queue were empty.
  In controller mode, read comms as the actual roster surface, not only
  active claims.

### Practice/tooling feedback

- **Surface**: `agent-tools:collaboration-state claims open`
- **Signal**: friction
- **Observation**: an unquoted `.agent/state/collaboration/**` area pattern
  expanded in zsh before reaching the CLI, causing `claims open` to reject the
  extra path arguments. Retrying with the pattern quoted worked.
- **Behaviour change / candidate follow-up**: controller/claim examples should
  quote glob-shaped `--area-pattern` values, or the CLI should surface a
  friendlier "did your shell expand this glob?" diagnostic when extra path
  tokens appear after `--area-pattern`.
- **Surface**: `agent-tools:collaboration-state comms send`
- **Signal**: friction
- **Observation**: I initially tried to use directed-message flags on
  `comms send`; live help shows directed routing belongs to `comms direct`
  with `--to-agent-name`, `--to-platform`, `--to-model`, and
  `--to-session-prefix`.
- **Behaviour change / candidate follow-up**: controller docs/examples should
  keep shared `send` and directed `direct` examples adjacent, because the
  failure mode is easy to hit during a time-sensitive coordination handoff.

### Controller closeout

- Two exact implementation commits landed without the controller editing source:
  `2791be3c` for operator-value signals and `6e804485` for interaction
  hardening. The useful pattern was: implementation owner reports ready,
  independent read-only reviewer returns GO/BLOCK, marshal verifies exact
  staged pathspecs, and the controller releases one git/index lane at a time.
- After both commits, the next logical P8 route is `p8-attention-state`.
  Nebulous and Arboreal both returned useful read-only scouts during closeout:
  Nebulous on UI/test wiring, Arboreal on the data/value shape. Treat those
  scout responses as input, not as permission to open implementation claims
  without a fresh live-state re-ground.
