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
