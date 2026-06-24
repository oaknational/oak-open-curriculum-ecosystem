---
status: active
lineage:
  serves_thread: ci-and-test-efficiency
  serves_stream: developer-experience
  strategic_choice: >
    worktree pilot WS-A — exercise the worktree-per-agent / minimum-action-Director
    model while delivering the largest CI wall-clock lever
  derives_from: >
    ../future/ci-vitest-pool-threads-migration.plan.md (strategic brief);
    worktree-pilot-coordination.plan.md WS-A delegation brief (Director-framed 2026-06-24)
todos:
  - id: ws-a-c0-baseline
    content: "Baseline (pool:forks): 5 runs, all green, wall 18-23s (min 18s) on a load-25→81 host"
    status: completed
  - id: ws-a-c1-threads-trial
    content: "Trial pool:threads: full suite green, zero failing files"
    status: completed
    depends_on: [ws-a-c0-baseline]
  - id: ws-a-c2-resolve-failures
    content: "N/A — zero files failed under threads across all runs (no global-state tests surfaced)"
    status: completed
    depends_on: [ws-a-c1-threads-trial]
  - id: ws-a-c3-flip-and-stabilise
    content: "Flip applied (pool:threads + corrected comment); K=5 threaded stability green; perf indeterminate locally (host oversubscribed)"
    status: completed
    depends_on: [ws-a-c1-threads-trial]
  - id: ws-a-c4-decision
    content: "VERDICT: proceed on CORRECTNESS (stale workaround retired); NOT a measured local perf gain. Pending Director verdict review + owner code-owner review to main"
    status: in_progress
    depends_on: [ws-a-c3-flip-and-stabilise]
---

# WS-A — Vitest pool forks→threads (executable)

> Worktree-pilot WS-A. Worktree `/Users/jim/code/oak/oak-pilot-ws-a-vitest`,
> branch `pilot/ws-a-vitest-stability`. Executable promotion of the strategic
> brief at [`../future/ci-vitest-pool-threads-migration.plan.md`](../future/ci-vitest-pool-threads-migration.plan.md),
> which stays the source of strategic intent. Delegated by the Director's
> coordination plan (WS-A brief). Lands first per the pilot merge order
> (WS-A → `coordination/worktree-pilot` before WS-B rebases onto it).

## Problem and intent

`vitest.config.base.ts:15-16` forces `isolate: true` + `pool: 'forks'` — the
slowest Vitest mode, forking a fresh OS process per test file across a 630-file
suite. The justifying comment ("Many tests mutate process.env which causes race
conditions in parallel execution") is **stale**: doctrine now forbids global
state in tests (testing-strategy.md, principles.md) and enforces it via ESLint,
so the precondition the workaround protected against has been removed by the
system. **Who it harms:** every contributor and CI run pays per-file
process-spawn overhead (CI `run-quality-gates` ~8–9 min). **Success:** materially
lower full-suite wall-clock with zero coverage change, or an evidence-backed
decision to retain with the real root cause named.

## End goal · mechanism · means

- **End goal:** lower full-suite wall-clock; faster feedback; the stale
  workaround retired or its retention justified by evidence.
- **Mechanism:** a thread pool avoids per-file process forks; the
  enforced no-global-state rule makes shared-thread execution race-free, so the
  isolation is no longer load-bearing.
- **Means:** measure-first. Baseline (forks) → single threads trial →
  resolve any surfaced global-state test → flip + stability runs → decide.

## Cycles (measure-first; this is refactoring-class — the existing suite is the safety net)

Governed by [`tdd-for-refactoring`](../../../../rules/tdd-for-refactoring.md): the
change is behaviour-preserving, so the existing 630-file suite is the test. No new
failing test is authored for the flip itself; a file that fails under `threads`
is a latent global-state defect the rule already forbids, fixed to DI under its
own cycle.

- **C0 — Baseline (forks).** Run `pnpm test` full suite K=5 times; record
  wall-clock and a flake count (files green→red across runs). Capture host load
  before each run (host-health-aware; swap currently high). Validation:
  `pnpm test` exits 0 each run; numbers recorded in §Evidence.
- **C1 — Threads trial.** On-branch, flip `pool: 'threads'` (and re-evaluate
  `isolate`); run `pnpm test` once. Record pass/fail, wall-clock, and the exact
  list of any failing files. Validation: deterministic file list captured.
- **C2 — Resolve failures (conditional).** Each failing file is a global-state
  test. Fix to dependency injection (test + product-code-aware, landing as its
  own cycle and extending this claim's file scope), or — if not cheaply fixable —
  STOP and surface the rule gap to the Director (`no-warning-toleration`: do not
  re-paper with retries/serialisation).
- **C3 — Flip + stabilise.** With the trial clean, commit the
  `vitest.config.base.ts` flip; run `pnpm test` K=5 times under `threads`; record
  after wall-clock and flake count. Validation: 5/5 green, flake count = 0.
- **C4 — Decision.** EITHER land the removal (perf delta + stability evidence in
  the commit/UAT note) OR write the retain-decision naming the root cause.
  Reintegration: merge `pilot/ws-a-vitest-stability` → `coordination/worktree-pilot`
  first; Director reviews the verdict; owner reviews to `main`.

## Acceptance criteria · proof contract

| id | acceptance | proof level | proof command/observation |
|----|-----------|-------------|---------------------------|
| ws-a-c0-baseline | baseline wall-clock + flake recorded over 5 runs | non-code (measurement) | `pnpm test` ×5; numbers in §Evidence |
| ws-a-c1-threads-trial | trial result + failing-file list captured | integration | single `pnpm test` under threads |
| ws-a-c3-flip-and-stabilise | 5/5 green under threads, flake=0, after wall-clock recorded | integration | `pnpm test` ×5 under threads |
| ws-a-c4-decision | removal landed with measured gain + stability, OR retain-decision with named root cause | non-code + integration | commit + §Evidence; or retain note |

Outcome, not activity: the flip lands only if the trial is clean and the perf
gain is measured; otherwise the retain-decision must name the underlying
instability root cause.

## Evidence (2026-06-24, worktree, 14-core host)

Measured `turbo run test --continue --force --only` (warm build; `--only` isolates
the test phase from cached build; `--force` defeats turbo's test-cache so each run
is real). Full unit/integration suite = 24 workspaces, ~599 test files.

- **C0/C3 stability — DECISIVE.** 10/10 runs GREEN, zero failing files: 5 runs with
  the base at `pool:forks` + 5 with the base at `pool:threads`, all exit 0, all 24
  workspaces green. **Blast-radius precision** (config-expert): the base flip affects
  the **19 workspaces that extend `vitest.config.base.ts`** — those ran green under
  threads across 5 runs. The ~5 workspaces with custom configs (incl.
  `apps/oak-search-cli`, which deliberately keeps `pool:forks` for a *tracked,
  unresolved* logger module-state issue — `test-isolation-architecture-fix.md`) run
  their own pool regardless and are unaffected by this change.
- **Safety basis — the ESLint gate, not the run count** (test-expert). The guarantee
  that threads is race-free is the hard-error lint gate in
  `@oaknational/eslint-plugin-standards` (blocks `process.env`/`globalThis`/`vi.mock`
  at `error` on test files) — the empirical green is a confidence signal, not the
  proof. `isolate: true` resets the module registry per file in the thread pool,
  identical to the forks per-file isolation, and is retained because the 15-file
  `vi.mock` migration backlog is not yet fully cleared. Residual native-addon risk
  (shared C-level state across threads) closed empirically: zero native-addon usage
  or deps in source. ADR-078 explicitly names removing `pool:forks` and "all
  integration tests pass without `pool:forks`" as DI-migration acceptance criteria —
  this change fulfils that criterion. Reviewers: config-expert + test-expert both
  verdict COMMIT.
- **Perf — INDETERMINATE locally (no measured gain).** forks wall 18/19/20/21/23s
  (min 18s); threads 19/19/20/21/21s (min 19s) — statistically indistinguishable.
  Host was severely oversubscribed (load avg climbed 25→81 on 14 cores; `forks`
  itself spawns hundreds of short-lived processes that inflate load and confound
  the comparison), so wall-clock is not a valid perf signal here. The local test
  phase is ~20s either way — NOT the 8–9 min the future brief premised (that figure
  was the whole `run-quality-gates`, not the test phase).
- **Reframed justification.** The change is justified on CORRECTNESS — retire a
  stale workaround whose comment claims `process.env` races that doctrine now forbids
  (ESLint-enforced), and stop forking a process per file — NOT on a measured local
  perf gain. Likely-but-unmeasured CI upside (process-fork overhead bites harder on
  constrained CI runners). Surfaced to the Director: the brief's perf-gain acceptance
  clause is unsatisfiable as written because its premise was a misread; the
  correctness case stands and is owner-reviewable.

## Non-goals (YAGNI)

- Not changing the test set, assertions, or coverage.
- Not touching `vitest.e2e.config.base.ts` (keeps its 60s timeouts).
- Not raising any timeout or adding retries to mask slowness.
- Not WS-B's surface (`register-resources.ts`), not the MCP app.

## Risks and mitigation

- **Hidden global-state test breaks under threads** → the C1 trial surfaces it
  before any flip; fix to DI (C2) or retain + escalate the rule gap. Reversible:
  one-line config revert.
- **High host swap (6.9G/8G) skews timings** → capture host load per run; treat
  a starved-host run as void and re-measure (`no-unbounded-host-load`).
- **Magnitude unknown until measured** → measure-first is the whole shape; the
  decision is evidence-gated, not assumed.

## Plan-body first-principles check

- **Shape:** measurement cycles, not vendor-literal command recipes — the gate is
  the canonical `pnpm test`, not a copied invocation.
- **Landing path:** WS-A → `coordination/worktree-pilot` (owner code-owner review
  to `main`); never `--admin`, never `--no-verify`.
- **First-principles:** this is the "would it be simpler if the system changed?"
  lens already resolved — the system (no-global-state rule) moved, making the
  isolation workaround removable; we verify that empirically before flipping.

## Foundation alignment

- `principles.md` (strict; tooling: vitest; Second Question), `testing-strategy.md`
  (no global state in tests; canonical vitest config), `tdd-for-refactoring`
  (existing suite is the safety net), `no-warning-toleration` (no re-papering),
  `no-unbounded-host-load` (host-health-aware measurement).

## Lifecycle triggers

- **Refinement:** any worktree-mechanics friction hit during execution is logged
  to the Director's coordination plan §Research Capture (F-83 evidence).
- **Completion:** on C4, run the consolidation workflow; archive the `future/`
  brief per ADR-117; fold any rule-gap findings back to doctrine.
- **Archival:** per ADR-117 after the coordination branch merges.
