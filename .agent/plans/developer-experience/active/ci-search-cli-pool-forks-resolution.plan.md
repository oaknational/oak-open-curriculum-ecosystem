---
status: COMMITTED to pilot/ws-c-ci-efficiency (keep-set, verified green ×3) — landing gated on owner (passWithNoTests posture + primary-checkout unwind); Director merges when clear
lineage:
  serves_thread: ci-and-test-efficiency
  serves_stream: developer-experience
  strategic_choice: >
    worktree pilot WS-C — standardise the test estate on Vitest 4.1.9 defaults
    (owner direction: use defaults, remove non-standard config), completing the
    CI/test-efficiency lane after WS-A's base flip
  derives_from: >
    worktree-pilot-coordination.plan.md (WS-C); owner direction 2026-06-24
    (use Vitest defaults wherever possible); WS-A (ci-vitest-pool-threads-migration)
---

# WS-C — standardise Vitest config on defaults (remove non-default pool/isolate pins)

> Worktree-pilot WS-C. Worktree `/Users/jim/code/oak/oak-pilot-ws-c-ci`, branch
> `pilot/ws-c-ci-efficiency` (off `coordination/worktree-pilot` @ `6d80d119e`).
> Merge order: WS-C → `coordination/worktree-pilot`; Director verdict review;
> owner code-owner review to `main` (never `--admin`, never `--no-verify`).

## Problem and intent

Owner direction (2026-06-24): use Vitest 4.1.9 defaults wherever possible; remove
non-standard test config. The estate carried explicit `pool`/`isolate` pins, several
of which equal the default (redundant) and one of which deviates from it.

**Key fact — Vitest 4.1.9 defaults are `pool: 'forks'` + `isolate: true`**, established
three independent ways (no assumption): (1) the 4.1.9 type defs declare `@default 'forks'`
on the pool option and `configDefaults` sets `isolate: true`; (2) the current v4 resolver
applies `resolved.pool ??= "forks"`; (3) **empirical** — running the worktree's vitest
against a bare config (no pool/isolate) ran two test files on the main thread
(`threadId=0`) in separate processes (distinct pids) = the forks pool. The pre-WS-A base
and the search-cli/field-integrity configs were already forks, corroborating it.

## What was done (one refactoring-class change)

Deleted the non-default `pool`/`isolate` pins (and their now-stale explanatory comments)
across six configs — 17 deletions, no functional config touched (include / exclude /
coverage / setupFiles / e2e-timeouts / `maxWorkers` / the field-integrity manifest stay):

- `vitest.config.base.ts` — removed `isolate: true` (no-op; default) and **`pool: 'threads'`
  (reverts the base to forks)**. This is the lane's only behaviour change.
- `apps/oak-search-cli/vitest.config.ts` — removed `isolate: true` + `pool: 'forks'` (no-op;
  both are defaults). The `cli-logger-di-audit` concern is moot — deleting the pin keeps the
  suite on forks, so the logger module-state question does not arise here.
- `vitest.field-integrity.config.ts` — removed `isolate: true` + `pool: 'forks'` (no-op).
- `apps/oak-search-cli/vitest.{e2e,experiment,smoke}.config.ts` — removed `isolate: true`
  (no-op; the e2e base sets no isolate, so the default `true` holds).

Governed by [`tdd-for-refactoring`](../../../../rules/tdd-for-refactoring.md): behaviour-preserving,
so the existing suite is the safety net; no new test authored.

**WS-A relationship.** Deleting the base `pool:'threads'` reverts WS-A's flip to the default
forks. The owner chose standardisation over WS-A's perf bet (WS-A's own evidence left the perf
gain indeterminate/unproven). Reverting to forks is the safe direction — forks isolation
(separate process per file) contains threads isolation — so nothing that passed under threads
can fail under forks. WS-A's stale-comment cleanup remains useful and is unaffected.

## Verification

| Run | Command | Result |
|----|---------|--------|
| 1 | full `pnpm check` (worktree) | GREEN — 108/108 turbo tasks; knip clean; depcruise 0 violations; markdownlint 0; prettier clean. The config edits invalidated the affected test caches, so tests re-ran under forks. |
| 2 | `turbo run test --force --continue` | GREEN — 43/43 test tasks (cache defeated; real run under forks) |
| 3 | `turbo run test --force --continue` | GREEN — 43/43 test tasks (cache defeated) — flake count 0 across runs |

Host snapshotted healthy before runs (55% mem free, flat pageouts, calm CPU).

**Verification honesty.** Runs 1–3 RUN-verify the base + search-cli-unit + field-integrity
deletions (the unit/integration suites `pnpm check` exercises). The
`e2e`/`experiment`/`smoke` `isolate` deletions are CONSTRUCTION-verified only (no-op:
`isolate:true` is the default and the e2e base sets none) — those suites hit live infra and
are not exercised by `pnpm check`; they run under `test:e2e`/`test:smoke` in CI.

## Reviewer disposition

- **config-expert** — READY; confirmed at Vitest 4.1.9 source that `isolate` uses the identical
  per-file module-reset path in both pools, so the `isolate` deletions are behavioural no-ops,
  and the search-cli config is blast-radius-local.
- **test-expert / assumptions-expert** — their detailed folds (logger-DI describing surface,
  file-sink risk, perf baseline) addressed the earlier *search-cli flip* framing and fall away
  under use-defaults (no flip; deleting the pin keeps forks). assumptions-expert's correction —
  the file-sink race is not test-surfaceable — stands and is why no logger work was needed.

## Landing gates (open — owner)

Two owner gates remain before the coordination merge (both surfaced via the Director):

1. **`passWithNoTests` posture.** This keep-set RETAINS `passWithNoTests: true` (base) and
   `: false` (field-integrity) — the conservative, behaviour-unchanged choice, so the committed
   branch is GREEN. The Director recommends REMOVING the base `passWithNoTests: true` (= Vitest
   default `false`; stricter — surfaces any zero-coverage workspace; currently a no-op as no
   base-extending workspace is empty-test). If the owner chooses remove, a follow-on applies the
   one-line base deletion + a fresh green before merge.
2. **Primary-checkout unwind.** The owner edited the **coordination** checkout directly (mistake,
   new to worktrees); those uncommitted edits block the coordination merge and are
   owner-authorisation to unwind. Not touched by this lane.

**False-green caveat (load-bearing for any follow-on):** `pnpm check` does NOT run
`test:smoke`/`test:experiment` (not in the check task list), so a green check says nothing about
the smoke/experiment configs — which is why their `testTimeout`/`maxWorkers:1` were RETAINED
(live-ES config, legitimate per testing-strategy §Smoke), not removed. The pins removal IS covered
by `pnpm check` (and was verified green ×3).

## Reintegration

Merge `pilot/ws-c-ci-efficiency` → `coordination/worktree-pilot`; Director verdict review;
owner code-owner review → `main`.
