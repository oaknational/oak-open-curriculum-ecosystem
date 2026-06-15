# MCP server UAT run reports

Completed run records from the
[UAT validation runbook](../manual-uat-guide.md), kept here as a small,
dated archive.

## Why these are kept

A completed UAT record is normally attached to a PR or handoff. We are
**also keeping records here for now** for one purpose: **to improve the
runbook and the tools themselves.** Patterns across runs — a check that is
always ambiguous, a tool whose expected result keeps needing correction, a
finding that recurs — are the signal that the runbook (or the server) needs a
change. This folder is the feedback loop, not a permanent compliance archive;
revisit its retention once the runbook has stabilised.

## Conventions

- **Filename:** `YYYY-MM-DD-<target>[-<n>].md` — e.g. `2026-06-15-prod.md`,
  `2026-06-15-preview.md`. Target is `prod`, `preview`, or `local`.
- **Contents:** the
  [run-record template](../manual-uat-guide.md#run-record-template), filled in,
  plus per-section evidence notes and any findings with severity.
- **One file per run.** Do not overwrite an earlier run; each is a dated
  data point.

## When a report should change the runbook

If a report's findings include any of these, raise the runbook fix in the same
or a follow-up change:

- An expected-result cell that did not match live behaviour (correct the cell).
- A check that was ambiguous to run or to judge (clarify it).
- A tool/resource/prompt present in `tools/list` but missing from the runbook
  (add it; update [Appendix A](../manual-uat-guide.md#appendix-a-expected-live-inventory)).
- A recurring server finding (route it to the
  [release snag workflow](../../../../docs/engineering/milestone-release-runbook.md#snag-workflow)).

## Index

- [2026-06-15 — production](./2026-06-15-prod.md) — first full-matrix run; GO.
