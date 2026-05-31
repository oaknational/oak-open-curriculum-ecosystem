# Next-session brief (Codex) - consolidation repair and full docs curation

Place this immediately after `/goal`:

```text
Continue the Oak docs consolidation repair and real knowledge-curation pass until
every live consolidation/docs buffer is either item-dispositioned or explicitly
owner-gated. This is a single-agent session: do not spawn parallel agents and do
not allow another agent to repair the same material independently.

Use $oak-start-right-quick, $oak-consolidate-until-done, and
$oak-consolidate-docs. Re-read
.agent/skills/consolidate-until-done/SKILL-CANONICAL.md first. Mode is
dedicated-knowledge-curation.

Core rule: fitness output is routing evidence only. Completion requires real
item-level dispositions plus no hard/critical files. Do not archive, split,
shard, rename, pointer-replace, or move unprocessed content to make fitness
improve. Archive relocation is allowed only after an item-level ledger proves
every source item is graduated, duplicate, owner-gated, or stale-withdrawn.

Current repair truth:
- Failed 2026-05-31 archive-only moves have been repaired to live-buffer state.
- active/napkin.md and active/distilled.md content has been restored to counted
  live buffers.
- Fresh failed archive sidecars under .agent/memory/active/archive/*2026-05-31*
  and .agent/memory/operational/archive/*2026-05-31* were removed.
- The original consolidation is NOT complete.
- Last strict-hard truth during repair: napkin.md CRITICAL, distilled.md HARD,
  repo-continuity.md HARD. Rerun before acting.

Read these before editing:
- .agent/memory/operational/codex-docs-consolidation.brief.md
- .agent/memory/operational/curator-passes/2026-05-31-open-lofting-cliff-docs-consolidation.md
- .agent/memory/operational/curator-passes/2026-05-31-eclipsed-source-buffer-consolidation.md
- .agent/memory/active/distilled.md
- .agent/memory/active/napkin.md
- .agent/memory/operational/pending-graduations.md
- .agent/memory/operational/repo-continuity.md
- .agent/memory/operational/open-questions.md

Process order:
1. Rebuild the live buffer inventory from current files and
   `pnpm practice:fitness:strict-hard`.
2. Start with draft ADRs/PDRs and pending-graduations if unresolved
   acceptance/index drift remains.
3. Continue item-by-item through `distilled.md`.
4. Then process `napkin.md` item-by-item, especially entries already covered by
   PDR-089 or explicit pending-graduations gates.
5. Then process `repo-continuity.md` honestly; do not move history to archive
   unless each restored historical item has a valid disposition.
6. Keep a durable ledger in the 2026-05-31 curator-pass report or a new same-date
   continuation report.

Already processed in the repair batch:
- PDR-089 accepted/indexed.
- Removed from `distilled.md` because PDR-089 covers them:
  corrected-decision propagation and default-replace remediation.
- Removed from `distilled.md` because canonical pending-graduations now
  owner-gates them: flag-gated surface enumeration and fixed-canonical-data
  derive-never-verify/read-primary-artefact.
- Removed from `distilled.md` as duplicate durable homes: Cursor statusline
  delegate shim, EEF wrong-shape episode, generated adapters never hand-written.
- Do not re-add those to `distilled.md`; verify their homes instead.

Validation cadence:
- After each meaningful batch: run targeted `markdownlint`, `git diff --check`,
  and `pnpm practice:vocabulary` on touched surfaces.
- Rerun `pnpm practice:fitness:strict-hard` after real batches and explain what
  item dispositions changed before mentioning any fitness improvement.

Final verdict must be one of:
- failed pass repaired
- partial repair
- pending

Do not call the original consolidation complete unless the canonical completion
contract is actually satisfied.
```

## Current Coordination Note

Open Lofting Cliff closed its repair claims after restoring the hidden source
buffers and preparing this brief. A separate active EEF claim may exist on
`.agent/plans/sector-engagement/eef/current/eef-graph-tool-completion.plan.md`;
verify active claims before touching EEF plan files.
