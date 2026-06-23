---
name: "agent-tools test IO compliance"
overview: "Remove real filesystem IO from the remaining agent-tools unit/integration tests, per testing-strategy.md (unit and integration tests trigger no IO). Each is fixed by the same patterns proven on the collaboration-state tests: compile-time JSON import for static-data reads, dependency-injection seams for command/product IO, or delete-with-pure-replacement where a pure seam already covers the logic."
status: "PENDING — opened 2026-06-13 (Skylark wakes Summit) after the collaboration-state schema-fixture + check/preflight IO was cleared (commits a1fb8e9c4, 5c01ee7ee, 221ee4a9f). These remaining files are pre-existing and span unrelated areas (codex, runtime-agent-index, context-cost); owner directed (2026-06-13) that refactoring product code to add testability seams is the correct fix, not deferral."
isProject: false
---

# agent-tools test IO compliance

## Context

`testing-strategy.md` is unambiguous: **unit and integration tests trigger no
IO**. A sweep of the agent-tools test suite (2026-06-13) found real filesystem
IO (`node:fs` / `node:fs/promises`) in tests and test-fixtures beyond the
collaboration-state schema/CLI tests already cured this session. The owner's
governing direction: *"if you need to refactor code to make it testable that is
a good thing — that is surfacing an architectural issue and fixing it"* — so
untestable-without-IO is treated as a product defect (ADR-078), fixed by adding
the DI seam, not by leaving IO in the test.

## Files in scope

| File | IO | Likely pattern |
| --- | --- | --- |
| `tests/codex-project-agents.integration.test.ts` | `node:fs` | investigate: DI seam or static read → JSON/text import |
| `tests/codex-reviewer-resolve.integration.test.ts` | `node:fs` | investigate: DI seam or static read |
| `tests/runtime-agent-index.integration.test.ts` | `node:fs` | investigate: DI seam or static read |
| `src/context-cost/test-helpers/context-cost-fixture.ts` | `node:fs` | likely static-data read → compile-time import |
| `tests/test-helpers/rules-index-classification-fixtures.ts` | `node:fs` | likely static-data read → compile-time import |

Each file gets per-file judgment — the patterns are not uniform.

## Proven fix patterns (from this session)

1. **Static-data file read in a test → compile-time JSON import.**
   `resolveJsonModule` is enabled; a JSON import of a repo data file type-checks
   and runs across the package boundary (depcruise excludes `.agent/`, does not
   forbid the import). Used for the schema fixtures (commit `5c01ee7ee`).
2. **Command/product IO with no seam → add a DI seam.** Route the read/write
   through an injectable `io`/reader (the pattern the comms commands and
   `assertIdentityCanWrite` already use); production wires the real IO, tests
   inject an in-memory fake (`createFakeCollaborationRuntime` or an equivalent).
   Used for `check` + `identity preflight` (commit `221ee4a9f`).
3. **Logic already covered by a pure seam → delete the IO-wiring test.** Extract
   or reuse the pure function test; drop the redundant full-path IO test. Used
   for the dispatch-allowlist guard (commit `a1fb8e9c4`).

## Acceptance

- No `node:fs` / `node:fs/promises` import in any `*.unit.test.ts` /
  `*.integration.test.ts` or the fixtures they consume, across agent-tools.
- `pnpm --filter @oaknational/agent-tools lint` and `test` green at every commit;
  the `@oaknational/no-real-io-in-tests` rule reports zero findings.
- Any product refactor preserves behaviour (the existing tests are the safety
  net) and lands test + code in one commit.

## Verification

`pnpm --filter @oaknational/agent-tools type-check && lint && test` per cycle;
re-run the sweep (`grep -rlE "from ['\"]node:fs" agent-tools/tests agent-tools/src
| grep -E "test|fixture"`) to confirm the inventory reaches empty.
