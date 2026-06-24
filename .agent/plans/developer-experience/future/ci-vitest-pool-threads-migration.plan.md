---
lineage:
  serves_thread: ci-and-test-efficiency # nascent — opened by the 2026-06-24 CI-efficiency scan
  serves_stream: developer-experience
  derives_from: "2026-06-24 CI-efficiency scan (after #218/#219); base vitest config TODO"
---

# CI: migrate vitest pool from `forks` to `threads`

**Status**: FUTURE (strategic brief — not executable until promoted)
**Priority**: High (largest CI wall-clock lever found in the 2026-06-24 scan)
**Created**: 2026-06-24
**Owner**: Engineering

## Problem and intent

`vitest.config.base.ts` sets `pool: 'forks'` + `isolate: true` — the slowest vitest
execution mode, forking a fresh OS process per test file. The suite is **630 test
files**, so per-file process-spawn overhead is plausibly the largest single slice of
test wall-clock (CI `run-quality-gates` ran ~8–9 min). The config comment states the
reason and names the exit:

> `// Many tests mutate process.env which causes race conditions in parallel execution`
> `// TODO: Refactor tests to use dependency injection instead of process.env mutation`

That workaround is **stale**: current doctrine forbids global-state in tests
(testing-strategy.md "NEVER manipulate global state… no `process.env`"; principles.md
"tests must never read or mutate `process.env`") and enforces it via ESLint. Once the
TODO holds, the isolation is unnecessary and `pool: 'threads'` (or `isolate: false`)
becomes safe — and much faster for a 630-file suite.

Intent: cut test wall-clock with **zero coverage change** by retiring the stale
isolation workaround.

## End goal · mechanism · means

- **Goal**: materially lower `run-quality-gates` wall-clock; faster contributor feedback.
- **Mechanism**: a thread pool avoids per-file process forks; the enforced
  no-global-state rule makes shared-thread execution race-free.
- **Means**: (1) measured trial on a branch — flip `pool: 'threads'`, run the full
  suite, capture before/after timing and any failures; (2) any test that fails under
  threads is a global-state test the rule should already forbid → fix to DI (or surface
  the rule gap); (3) when the trial is clean, flip the base config.

## Acceptance criteria (outcome, not activity)

- Full in-process suite passes under `threads`.
- Measured wall-clock reduction recorded (before/after on the same runner class).
- No change to which tests run or what they assert (coverage identical).
- Zero remaining global-state tests (the trial run surfaces them; each fixed or none exist).

## Dependencies and sequencing

- **Blocking (precondition)**: the trial must be clean, OR each global-state test fixed
  to DI first. The config flip does not land until the trial is green.
- Independent of the other CI-efficiency plans (sole file: `vitest.config.base.ts`;
  no `ci.yml` overlap). Compounds with all of them.

## Non-goals

- Not changing the test set, assertions, or coverage.
- Not touching the e2e config (`vitest.e2e.config.base.ts` keeps its 60s timeouts).
- Not raising any timeout to mask slowness.

## Risks and unknowns

- A hidden global-state test breaks under threads → the trial surfaces it before any
  flip; fix to DI or stay on `forks` and escalate the rule gap. Reversible (one-line
  config revert).
- Unknown: actual magnitude of the win until measured — hence trial-first.

## Promotion trigger

Owner greenlights the thread. First promoted action is the measured `threads` trial
(its result decides whether the flip lands or the precondition work comes first).

## Foundation alignment

testing-strategy.md (no global state in tests; canonical vitest config), principles.md
(strict; tooling: vitest), and the enforcing ESLint rule together make this the
"would it be simpler if the system changed?" lens resolving — the system already moved.
