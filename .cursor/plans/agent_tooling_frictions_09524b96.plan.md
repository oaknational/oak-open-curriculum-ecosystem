---
name: agent tooling frictions
overview: Fix the repeated `--area-pattern` data-loss bug in the collaboration-state claim CLI, then review the remaining agent-tooling friction register against the current implementation so the backlog reflects what is still open, addressed, duplicated, or ready for promotion.
todos:
  - id: f14-red-tests
    content: Add failing collaboration-state tests for repeated --area-pattern preservation and mixed area-source rejection.
    status: completed
  - id: f14-parser-fix
    content: Implement repeatable area-pattern parsing and exact-one area-source claim construction.
    status: completed
  - id: f14-help-validation
    content: Update claims open help text and run focused agent-tools tests, type-check, and lint.
    status: completed
  - id: friction-review
    content: Review F-01 through F-16 against live source and classify each register entry with evidence.
    status: completed
  - id: specialist-review
    content: Dispatch required reviewers and address any blocker findings.
    status: completed
isProject: false
---

# Agent Tooling Frictions Plan

## Scope

This is a two-part, bounded agent-tooling plan:

- Fix F-14 in [`agent-tools/src/collaboration-state/cli-options.ts`](agent-tools/src/collaboration-state/cli-options.ts) and [`agent-tools/src/collaboration-state/cli-claim-commands.ts`](agent-tools/src/collaboration-state/cli-claim-commands.ts): repeated `--area-pattern` must preserve every supplied pattern.
- Review F-01 through F-16 in [` .agent/plans/agent-tooling/frictions-register.md`](.agent/plans/agent-tooling/frictions-register.md) against the live codebase and update the register/statuses only after implementation evidence exists.

Non-goal: do not fix every friction in the same bundle. The review may promote follow-up plans or mark items as addressed, but implementation stays limited to the `--area-pattern` bug unless a tiny adjacent help-text/status correction is required to keep the fix honest.

## Part 1: Fix F-14

Implement the smallest strict model: `--file` and `--area-pattern` are both repeatable collections, and `claims open` accepts exactly one area source.

Current cause:

```typescript
// agent-tools/src/collaboration-state/cli-options.ts
const values = new Map<string, string>();
const files: string[] = [];
// --file accumulates, but all other flags overwrite in the Map
input.values.set(key, requireFlagValue(input.token, input.next));
```

Planned code shape:

- Extend `Options` with `readonly areaPatterns: readonly string[]`.
- Parse `--area-pattern` like `--file`, pushing each value instead of storing it in `values`.
- Keep scalar options in `values`; do not generalise prematurely into a broad multi-value parser unless the friction review proves a third repeatable option.
- Change `areaFromOptions` to derive patterns from exactly one of `options.files` or `options.areaPatterns`.
- Fail fast if neither source is present or if both are present, with a specific error naming `--file` and `--area-pattern`.
- Update `claims open --help` text in [`agent-tools/src/collaboration-state/cli-specs.ts`](agent-tools/src/collaboration-state/cli-specs.ts) to state repeatability and mutual exclusion.

TDD/validation cycle:

- Add a failing unit test in [`agent-tools/tests/collaboration-state/collaboration-state.unit.test.ts`](agent-tools/tests/collaboration-state/collaboration-state.unit.test.ts) proving `claims open` with repeated `--area-pattern` persists every pattern in the opened claim.
- Add a second focused test for the mixed `--file` + `--area-pattern` error, because the current behaviour silently ignores `--area-pattern` when files are present.
- Green with the parser and claim-construction changes.
- Run `pnpm --filter @oaknational/agent-tools test -- tests/collaboration-state/collaboration-state.unit.test.ts`.
- Run `pnpm --filter @oaknational/agent-tools type-check` and `pnpm --filter @oaknational/agent-tools lint`.

## Part 2: Review Other Frictions

Review the register as a triage task, not a mass implementation task.

For each friction F-01 through F-16:

- Verify current source behaviour using the relevant CLI source and tests.
- Classify status as `open`, `addressed`, `partially-addressed`, `duplicate-of`, `promote-to-current-plan`, or `promote-to-future-plan`.
- For partially addressed entries such as F-08 and F-11, confirm whether the live commands already exist and whether filters/show semantics match the original expected behaviour.
- Group remaining open items by fix family so future work lands coherently:
  - discoverability/help/error handling: F-01, F-02, F-03, F-04, F-09, F-12, F-13;
  - read-side collaboration CLIs: F-07, F-08, F-11;
  - release/build isolation: F-06;
  - identity model: F-10;
  - commit-queue protocol safety: F-15;
  - skills/adapter standardisation: F-16.
- Update [` .agent/plans/agent-tooling/frictions-register.md`](.agent/plans/agent-tooling/frictions-register.md) only where there is concrete evidence, preserving it as a capture surface rather than turning it into an execution plan.

## Reviewers

After implementation and register updates:

- Run `test-reviewer` because the change adds behaviour-proving tests.
- Run `code-reviewer` for CLI parser and claim-state correctness.
- Run `docs-adr-reviewer` if the friction register/help text receives substantive wording changes.

## Acceptance Criteria

- Repeated `--area-pattern` flags produce a claim whose `areas[0].patterns` includes every supplied pattern in order.
- `--file` remains repeatable and unchanged for existing file-area claims.
- Supplying both `--file` and `--area-pattern` fails with a clear error instead of silently dropping one source.
- The F-14 register entry is marked addressed only after tests and implementation pass.
- Other friction entries are reviewed and classified with source-backed status updates or follow-up routing, without bundling unrelated fixes.