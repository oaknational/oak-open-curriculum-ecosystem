---
classification: core
description: Validate ignored or excluded estates with commands that actually include them.
---

# Validate the Full Target Estate

Operationalises [PDR-020 (Check-Driven Development)](../practice-core/decision-records/PDR-020-check-driven-development.md),
[PDR-045 (Workspace-First Investigation Discipline)](../practice-core/decision-records/PDR-045-workspace-first-investigation-discipline.md)
§Move 1, and the root-gate doctrine in
[`docs/engineering/build-system.md`](../../docs/engineering/build-system.md).

Validation claims must cover the estate they name. If the target estate
contains files hidden from the default search or command context, use a
command that actually enters that estate.

Before claiming an estate is clean:

1. Identify whether the estate is ignored, generated, nested, or outside
   the current command's default include set.
2. Use `rg -uu` or run the relevant check from inside the target directory
   when ignore rules would otherwise hide the files.
3. State the exact estate covered by the evidence.

Default-search silence is not evidence for gitignored or excluded lanes.
False-clean checks are worse than no checks because they teach the next
agent to trust the wrong boundary.

The same discipline covers **explicit command-path narrowing**, not only
hidden files: a truthful "0/0" from `eslint scripts/ lib/course/` hides
warnings elsewhere, and a narrow scope PROPAGATES agent-to-agent — the
successor re-runs the same subset it inherited and re-reports "green"
(worked instance 2026-07-01: two `no-throw` warnings hidden by a
predecessor's narrow subset, caught only on a successor's full
`eslint .`). A gate verdict needs the full gate scope (`eslint .`,
`pnpm check`) before "green" is asserted or a slice counted done.
