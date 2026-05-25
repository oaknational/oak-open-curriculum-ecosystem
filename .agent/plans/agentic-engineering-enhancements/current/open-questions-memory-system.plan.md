---
name: "Open Questions Memory System"
overview: >
  Land the owner-directed open-questions memory buffer as a first-class
  operational-memory surface. The slice wires capture through session
  handoff, drain through consolidate-docs, discoverability through the memory
  indexes and substrate manifest, and structural validation through
  practice-substrate.
todos:
  - id: cycle-1-plan-and-surface-contract
    content: >
      Author this executable plan, add the open-questions frontmatter and
      substrate manifest contract, and register the surface from the
      operational memory entry points.
    status: completed
  - id: cycle-2-validator
    content: >
      Add practice-substrate evaluator tests for valid/empty buffers,
      duplicate question IDs, missing fields, invalid statuses, and open-entry
      backpressure; implement the live evaluator and manifest surface-count
      update.
    status: completed
  - id: cycle-3-workflow-wiring
    content: >
      Amend session-handoff and consolidate-docs so unresolved non-urgent
      decision-shapes are captured here and drained during consolidation.
    status: completed
  - id: cycle-4-verification
    content: >
      Run focused agent-tools tests and practice-substrate validation, record
      evidence, and leave remaining scope explicit.
    status: completed
isProject: false
---

# Open Questions Memory System

**Status**: IMPLEMENTED — verification residual recorded below
**Thread**: `agentic-engineering-enhancements`
**Owner direction**: implement the planned open-questions memory system,
including validator support.

## Goal

Make `.agent/memory/operational/open-questions.md` a durable buffer for
non-urgent unresolved planning, design, and process questions. The landing is
complete when the file is discoverable, structurally validated, captured by
handoff, and drained by consolidation.

## Mechanism

- Treat open questions as operational memory, not active learning and not
  owner-immediate comms.
- Capture only questions that cannot be answered cheaply, do not block the
  current cycle, and are not already owned by a plan, ADR, or PDR.
- Drain during `consolidate-docs` with one of four statuses:
  `open`, `answered-in-place`, `surfaced-to-owner`, or `withdrawn`.
- Validate structure through `practice-substrate check`; leave semantic
  judgement to consolidation.

## Acceptance

- `open-questions.md` has frontmatter, a PDR-050 manifest row, and memory
  index links.
- `session-handoff` and `consolidate-docs` name their capture/drain duties.
- `practice-substrate` reports malformed entries and open-entry backpressure.
- Focused tests and live substrate validation pass, or residual failures are
  proven outside this claim.

## Non-Goals

- Do not add `open-questions.md` to the start-right default read set in v1.
- Do not create a new CLI command or separate validator.
- Do not make more than 10 open entries blocking; it is a cadence signal.

## Verification Evidence

- `pnpm --filter @oaknational/agent-tools exec vitest run tests/practice-substrate/practice-substrate.unit.test.ts tests/practice-substrate/practice-substrate-report.unit.test.ts` — passed, 41 tests.
- `pnpm --filter @oaknational/agent-tools type-check` — passed.
- `pnpm --filter @oaknational/agent-tools lint` — passed.
- `pnpm exec markdownlint --dot ...` on touched markdown files — passed.
- `pnpm exec prettier --check ...` on touched markdown and TypeScript files — passed after formatting the updated test file.
- `pnpm practice:fitness:informational` — SOFT, 20 soft, no hard or critical files; `open-questions.md` is green.
- `pnpm practice:fitness:strict-hard` — SOFT, 20 soft, no hard or critical files.
- `pnpm practice:substrate:check` — failed on a pre-existing
  `active-claims.json` schema defect at `commit_queue[19].files[0] == ""`.
  The report contained no open-questions findings.
