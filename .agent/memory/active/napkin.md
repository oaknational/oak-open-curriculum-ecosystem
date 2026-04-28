---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
---

# Napkin

Active session observations. Distilled entries live at
[`distilled.md`](distilled.md). Pattern library is at
[`patterns/`](patterns/README.md). Cross-session pending graduations
live in the repo-continuity
[`Deep consolidation status`](../operational/repo-continuity.md#deep-consolidation-status)
register.

The previous active napkin was archived during the 2026-04-28 handoff and
consolidation pass at
[`archive/napkin-2026-04-28.md`](archive/napkin-2026-04-28.md).

## 2026-04-28 — Handoff and consolidation closeout

### What Was Done

- Ran the owner-requested handoff/consolidation path after homing the
  agent-work ownership and workspace-layer separation doctrines.
- Ran the hook-test IO remediation closeout: root-script and agent-tools
  hook tests now prove pure behaviour without filesystem/process IO, and
  the former agent-tools CLI E2E files are deleted from the CI E2E surface.
- Rotated the overweight active napkin into
  `archive/napkin-2026-04-28.md`.
- Distilled the still-actionable shared-state lessons about sweep-up commits,
  surgical shared JSON edits, and orphaned-claim handling.

### Patterns to Remember

- Current settled doctrine lives in PDR-035, ADR-165, ADR-154, and the
  workspace-layer separation audit plan; do not re-expand it here.
- A concurrent non-overlapping implementation claim may coexist with a
  documentation closeout. Keep the commit pathspec scoped and avoid claimed
  code surfaces.

### Surprise

- **Expected**: The commit closeout blocker was still the earlier
  collaboration-state TypeScript build failure.
- **Actual**: A fresh agent-tools build passed, but root `format-check` and
  `knip` found live gate failures in the same active WIP: Prettier drift and
  unused public exports.
- **Why expectation failed**: Shared-branch concurrent work moved between
  handoff and retry; the stale TypeScript failure was not current, but the full
  commit hook still had real repo-wide evidence to enforce.
- **Behaviour change**: Rerun the exact failing gate before touching claimed
  WIP, then make the smallest gate-honest repair and leave a breadcrumb for
  the owning agent.
