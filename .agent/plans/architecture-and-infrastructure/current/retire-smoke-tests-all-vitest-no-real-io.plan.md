---
name: "Retire smoke-tests; all tests in Vitest; no real network or disk in tests"
overview: >
  Delete the smoke-tests harness and all smoke-test infrastructure as
  duplicative of e2e + unit + integration coverage. Bring all
  remaining tests under Vitest. Audit and fix any tests that make
  real network calls or access the disk; tests that need IO use DI
  fakes per ADR-078.
status: current
isProject: true
todos:
  - id: cycle-1a-delete-smoke-tests-directory
    content: "ONE COMMIT (parallel-safe): delete apps/oak-curriculum-mcp-streamable-http/smoke-tests/ entirely (entire directory). Move smoke-tests/auth/clerk-oauth-token.test.ts and smoke-tests/cli/remote-cli.unit.test.ts to a proper unit-test home in apps/oak-curriculum-mcp-streamable-http/src/ if they are real unit tests; otherwise delete them too. Verify with grep that no remaining file imports from smoke-tests/. Tree green at end."
    status: pending
  - id: cycle-1b-delete-vitest-smoke-config
    content: "ONE COMMIT (parallel-safe): delete apps/oak-curriculum-mcp-streamable-http/vitest.smoke.config.ts. Verify no eslint-config exemption references it. Tree green at end."
    status: pending
  - id: cycle-1c-replace-dev-server-boots-coverage
    content: "ONE COMMIT (parallel-safe; no longer cross-plan-sequenced because the e2e test was deleted upstream): the spawning e2e regression-guard at apps/oak-curriculum-mcp-streamable-http/e2e-tests/dev-server-boots-without-observability-config.e2e.test.ts was deleted as a damaged-plan artefact in a separate commit (multi-commit-TDD shape: test was committed ahead of its WS4 cure; its own header admitted violating testing-strategy.md §'E2E tests MUST NOT spawn additional processes'). This cycle adds the proper replacement test in apps/oak-curriculum-mcp-streamable-http/src/ proving: loadRuntimeConfig({processEnv: <minimal env>, startDir: <path>}) returns ok with a valid RuntimeConfig; createApp instantiates without throwing on that config. Pure in-process, no spawn, no listen. Tree green at end."
    status: pending
  - id: cycle-1d-remove-smoke-scripts-from-package-jsons
    content: "ONE COMMIT (parallel-safe): remove smoke:dev:stub, smoke:dev:auth, smoke:dev:live, smoke:dev:live:auth, smoke:remote, smoke:oauth:spec, smoke:oauth-inspector, smoke:oauth-curl, inspect:oauth, trace:oauth from apps/oak-curriculum-mcp-streamable-http/package.json scripts. Remove any smoke:dev:* references from root package.json + turbo.json. Tree green at end."
    status: pending
  - id: cycle-2a-audit-packages-core
    content: "ONE OR MORE COMMITS (parallel-safe with other 2-* batches and with cycle 1, 3 file-creation): audit packages/core/* test files for real network calls (fetch / http.request / external supertest hosts) and real disk access (fs.* / readFile / writeFile / spawn / exec / process.env mutation / process.cwd reads) outside ADR-078-approved DI patterns. Grep: 'spawn|child_process|fs\\.|readFile|writeFile|process\\.env\\s*=|process\\.env\\[' in *.test.ts. Each violation gets a small commit (test+code together). Allowlisted: composition roots (vitest config, setup files), designated DI fakes."
    status: pending
  - id: cycle-2b-audit-packages-libs
    content: "ONE OR MORE COMMITS (parallel-safe with other 2-* batches and with cycle 1, 3 file-creation): same audit + fix discipline as cycle 2a, scoped to packages/libs/*."
    status: pending
  - id: cycle-2c-audit-packages-sdks
    content: "ONE OR MORE COMMITS (parallel-safe with other 2-* batches and with cycle 1, 3 file-creation): same audit + fix discipline as cycle 2a, scoped to packages/sdks/*."
    status: pending
  - id: cycle-2d-audit-apps-mcp
    content: "ONE OR MORE COMMITS (parallel-safe with other 2-* batches and with cycle 1, 3 file-creation): same audit + fix discipline as cycle 2a, scoped to apps/oak-curriculum-mcp-streamable-http/. Aware: cycle 1c deletes the spawning e2e regression-guard in this workspace; audit covers what remains."
    status: pending
  - id: cycle-2e-audit-apps-search-cli
    content: "ONE OR MORE COMMITS (parallel-safe with other 2-* batches and with cycle 1, 3 file-creation): same audit + fix discipline as cycle 2a, scoped to apps/oak-search-cli/."
    status: pending
  - id: cycle-2f-audit-agent-tools
    content: "ONE OR MORE COMMITS (parallel-safe with other 2-* batches and with cycle 1, 3 file-creation): same audit + fix discipline as cycle 2a, scoped to agent-tools/."
    status: pending
  - id: cycle-3-test-purity-eslint-rule
    content: "ONE COMMIT (parallel-safe with cycle 1; SEQUENCED AFTER cycle 2): author packages/core/oak-eslint/src/rules/no-real-io-in-tests.ts ESLint rule that flags fs/network/spawn calls in *.test.ts files outside ADR-078-permitted patterns (composition roots, designated DI fakes). Pair with RuleTester unit tests + plugin registration. **Do NOT wire into root eslint.config.ts until cycle 2 audit is complete** — wiring earlier would immediately flag violations cycle 2 has not yet fixed and break the build. The rule + its RuleTester tests + its plugin registration land in cycle 3; the root-config wire-up is the FINAL hunk of cycle 3 and is gated on cycle 2 close (or lands in a small follow-on commit). Allowlist: known vitest config files at workspace roots. Tree green at end."
    status: pending
---

# Retire Smoke Tests; All Vitest; No Real IO in Tests

**Last Updated**: 2026-05-03
**Status**: 🔴 NOT STARTED

## Context

The `apps/oak-curriculum-mcp-streamable-http/smoke-tests/` directory
exists to boot the MCP server with stub/live/remote backends and run
HTTP-level assertions against it. Survey 2026-05-03 found:

- `local-stub` mode is fully duplicative of `e2e-tests/stub-mode.e2e.test.ts`
  - `tool-call-success.e2e.test.ts` + `validation-failure.e2e.test.ts` +
  `multi-request-session.e2e.test.ts` + `auth-bypass.e2e.test.ts` +
  `src/app/health-endpoints.*` + `src/mcp-router.integration.test.ts`.
  The residual distinct value is "Express listens on a real socket" —
  testing the framework, an absolute textbook anti-pattern.
- `local-stub-auth` mode is duplicative of `e2e-tests/auth-enforcement.e2e.test.ts`
  - `clerk-auth-middleware.integration.test.ts`. The mode's own header
  even cites those tests as the deterministic alternative.
- `local-live`, `local-live-auth`, `remote` modes target third-party
  systems (live Oak API, Clerk, deployed servers) and are misclassified
  as automated tests; they are operational/manual-verification tools
  that should not pretend to be in any `pnpm test*` lane.
- The planned `local-no-observability` mode reduces to a unit-level
  invariant check on `loadRuntimeConfig` + `createApp`.

The existing `dev-server-boots-without-observability-config.e2e.test.ts`
spawns `pnpm dev` as a child process to assert "the server boots". Its
own TSDoc admits this is a structural violation of `testing-strategy.md`
§"E2E tests MUST NOT spawn additional processes". The same invariant is
provable at unit/integration level via `loadRuntimeConfig` + `createApp`
without any spawn.

Beyond smoke retirement, this plan asserts a stronger property: **no
test in the repo makes real network calls or accesses the real disk.**
Tests that need IO use injected fakes per ADR-078.

## Foundation Alignment

- **principles.md §First Question**: simpler than the smoke-harness
  redesign + per-mode conversion. Delete the duplicative coverage.
- **principles.md §No unused code**: the smoke-tests directory and the
  spawning e2e test are unused-by-purpose (their coverage is reproduced
  elsewhere).
- **testing-strategy.md §Universal testing principles**: "unit tests are
  pure, in-process, and mock-free; integration tests import code
  directly and use only simple DI fakes; tests must not read or mutate
  process.env, global objects, module cache, ambient env files, or
  process.cwd()."
- **ADR-078 §Dependency Injection for Testability**: tests inject fakes
  rather than touching real systems.

## Cycles

### Cycle 1a — Delete `smoke-tests/` directory

**Atomic, parallel-safe with 1b/1c/1d**: yes (different files, no
shared state).

Move first, delete second:

- `smoke-tests/auth/clerk-oauth-token.test.ts` and
  `smoke-tests/auth/clerk-oauth-token.ts` — if they are real unit tests
  for OAuth token logic, move to `apps/oak-curriculum-mcp-streamable-http/src/auth/`
  with proper `*.unit.test.ts` naming. If they exercise real Clerk
  endpoints, delete (they belong in the live-mode operational tools, not
  in any test lane).
- `smoke-tests/cli/remote-cli.ts` and `remote-cli.unit.test.ts` — if it
  is a real unit test, move to `apps/oak-curriculum-mcp-streamable-http/src/cli/`.
  Otherwise delete.
- Everything else under `smoke-tests/` deletes.

**Acceptance criteria**:

- `apps/oak-curriculum-mcp-streamable-http/smoke-tests/` does not exist.
- `grep -rn "smoke-tests/" apps/oak-curriculum-mcp-streamable-http/
  --include="*.ts" --include="*.json"` returns zero matches outside the
  one commit's own deletion entries.
- `pnpm test --filter @oaknational/oak-curriculum-mcp-streamable-http`
  exit 0.
- `pnpm test:e2e --filter @oaknational/oak-curriculum-mcp-streamable-http`
  exit 0.

### Cycle 1b — Delete `vitest.smoke.config.ts`

**Atomic, parallel-safe with 1a/1c/1d**: yes.

Delete `apps/oak-curriculum-mcp-streamable-http/vitest.smoke.config.ts`.
Search for ESLint config exemptions referencing it (`vitest.smoke.config.ts`
in `eslint.config.ts`'s smoke-composition-root allowlist) and remove
them.

**Acceptance criteria**:

- File does not exist.
- `pnpm lint` exit 0 (no exemption for a non-existent file).

### Cycle 1c — Replace dev-server-boots coverage with proper unit/integration test

**Atomic, parallel-safe with 1a/1b/1d**: yes.

The spawning e2e regression-guard
`apps/oak-curriculum-mcp-streamable-http/e2e-tests/dev-server-boots-without-observability-config.e2e.test.ts`
was DELETED upstream as a damaged-plan artefact (separate commit). It
was both:

- **Shape-wrong**: spawning `pnpm dev` as a child process, asserting
  on stdout/stderr — its own header explicitly named the violation
  (testing-strategy.md §"E2E tests MUST NOT spawn additional
  processes").
- **Timing-wrong**: committed RED ahead of its WS4 cure
  (multi-commit-TDD-skip-register pattern that owner deleted in
  `60b9ff4c`).

This cycle adds the proper replacement test in
`apps/oak-curriculum-mcp-streamable-http/src/` (unit or integration
— likely `runtime-config.integration.test.ts` extension or new
`dev-boot-without-observability.integration.test.ts`):

- Builds a minimal `processEnv` with no `OBSERVABILITY_*` / `SENTRY_*`
  / `VERCEL_*` keys (only `OAK_API_KEY`, `ELASTICSEARCH_*`,
  `DANGEROUSLY_DISABLE_AUTH=true`, stub-tools), passes through
  `loadRuntimeConfig`, asserts `ok`.
- Calls `createApp({runtimeConfig, observability, getWidgetHtml})` and
  asserts the app instantiates without throwing.
- No spawning, no listening, no real IO — pure in-process invariants.

**Acceptance criteria**:

- New unit/integration test exists and passes.
- `pnpm test --filter @oaknational/oak-curriculum-mcp-streamable-http`
  exit 0.
- `pnpm test:e2e --filter @oaknational/oak-curriculum-mcp-streamable-http`
  exit 0 (was already 0 after the upstream deletion; this cycle adds
  the replacement coverage at the unit/integration tier).

### Cycle 1d — Remove smoke scripts from package.json + turbo.json

**Atomic, parallel-safe with 1a/1b/1c**: yes.

Remove from `apps/oak-curriculum-mcp-streamable-http/package.json` scripts:

- `smoke:dev:stub`, `smoke:dev:auth`, `smoke:dev:live`,
  `smoke:dev:live:auth`, `smoke:remote`, `smoke:oauth:spec`,
  `smoke:oauth-inspector`, `smoke:oauth-curl`, `inspect:oauth`,
  `trace:oauth`.

Remove any `smoke:dev:*` or `smoke:remote` references from root
`package.json` and `turbo.json`.

**Acceptance criteria**:

- `grep -n "smoke:" apps/oak-curriculum-mcp-streamable-http/package.json`
  returns no matches.
- `grep -n "smoke:" package.json turbo.json` returns no matches.

### Cycle 2a–2f — Audit real-IO in tests (per workspace batch, fully parallel-safe)

**Parallel-safe**: yes across batches. The split into six batches
(2a–2f) is by directory boundary so independent agents can pick up
each batch without coordination. Within a batch, each violation fix
is its own commit so multiple commits per batch is normal and
expected.

The six batches:

| Cycle | Scope |
|---|---|
| 2a | `packages/core/*` |
| 2b | `packages/libs/*` |
| 2c | `packages/sdks/*` |
| 2d | `apps/oak-curriculum-mcp-streamable-http/` (post-cycle-1c) |
| 2e | `apps/oak-search-cli/` |
| 2f | `agent-tools/` |

Per batch, the procedure is identical:

1. Grep for known real-IO patterns in test files:

   ```bash
   grep -rn "spawn\\|child_process\\|fs\\.\\|readFile\\|writeFile\\|process\\.env\\s*=\\|process\\.env\\[" \
     <batch-scope>/ --include="*.test.ts"
   ```

2. For each finding, classify:

   - **Composition root** (vitest config / setup file): permitted per
     `testing-strategy.md`.
   - **DI fake** (`createMockObservability`, etc.) / declared
     allowlisted helper file: permitted.
   - **Real IO** elsewhere: violation; fix by injecting a fake (test +
     fake + product-code edit land together in one small commit).

3. Each fix is its own small commit (test + fake + edit landed
   together). A batch may produce zero commits (no violations) or many
   commits (one per violation found).

**Acceptance criteria per batch**:

- The grep above returns only composition-root and DI-fake matches in
  the batch's scope; no unclassified real-IO violations remain.
- All workspace tests pass after the audit fixes (`pnpm test --filter`
  the workspaces in the batch).

**Cross-batch rendezvous**: cycle 3 (the ESLint rule) wires into the
root config only after every batch (2a–2f) has closed. That is the
hard sequencing point.

### Cycle 3 — Author `no-real-io-in-tests` ESLint rule

**Atomic, parallel-safe**: yes — separate workspace
(`packages/core/oak-eslint/`), separate concern.

Author the rule at `packages/core/oak-eslint/src/rules/no-real-io-in-tests.ts`:

- Triggers in files matching `*.test.ts` (excluding allowlisted
  composition-root files).
- Flags: `child_process.spawn`, `child_process.exec`, direct `fs.*`
  calls, direct `process.env =` mutation, direct `process.cwd()`
  reads, `fetch(...)` to non-localhost URLs.
- Allowlist: vitest config files at workspace roots; designated DI
  fake helper files.

Pair with `no-real-io-in-tests.unit.test.ts` (RuleTester cases) +
plugin registration in `plugin.ts` + root `eslint.config.ts` wire-up.

**Acceptance criteria**:

- `pnpm test --filter @oaknational/eslint-plugin-standards` exit 0.
- `pnpm lint` exit 0 (the new rule fires only on intentional
  violations; the audit in cycle 2 must complete before this rule lands
  in the root config).
- `grep -rn "no-real-io-in-tests" packages/core/oak-eslint/src/` finds
  the rule registered.

## Quality Gates

After all cycles close:

```bash
pnpm clean
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm doc-gen
pnpm format:root
pnpm markdownlint:root
pnpm lint:fix
pnpm test
pnpm test:e2e
pnpm test:ui
pnpm test:a11y
pnpm portability:check
pnpm subagents:check
pnpm test:root-scripts
```

All exit 0.

## Non-Goals

- **NOT** fixing the dev-boot bug. That is plan 1.
- **NOT** renaming `SENTRY_MODE` to `OBSERVABILITY_SINKS`. That is plan 2.
- **NOT** retiring the `apps/oak-search-cli/` smoke equivalents (none
  exist as a directory; if any are found during cycle 2 audit, they
  fold into that audit).
- **NOT** preserving live-API or remote-deployment-check capability via
  some replacement test mechanism. Those checks are operational
  concerns (manual `curl` to deployed URLs, `pnpm exec tsx
  scripts/dev-check-live.ts` if a developer wants one), not automated
  tests. If a replacement is wanted later, plan separately.

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| A genuine unit test inside `smoke-tests/` is mistakenly deleted | Mitigated | Medium | Cycle 1a explicitly identifies the two candidate files (`clerk-oauth-token.test.ts`, `remote-cli.unit.test.ts`) for relocation; grep validates no other file imports from `smoke-tests/` after deletion |
| Live-API smoke (`local-live`) was the only thing exercising real Oak API integration in CI | Low | Medium | CI does not run `smoke:dev:live` today (it requires live API key); deleting the script doesn't remove a working CI gate. If real-API integration testing becomes a need, it lands as a separate operational tool plan |
| The audit in cycle 2 surfaces violations whose fix is non-trivial | Medium | Medium | Each violation is its own small commit; the cycle does not aim for a single atomic fix. Workspaces audited in parallel; large fixes can be deferred to follow-up plans if scope explodes |
| `dev-server-boots-without-observability-config.e2e.test.ts` was the only e2e regression-guard for the dev-boot bug | Mitigated | Medium | Plan 1 fixes the dev-boot bug; the new unit/integration test in cycle 1c proves the same invariant without spawning |

## Reviewer Dispatch

- **`test-reviewer`** (per cycle, especially cycle 1c's unit/integration
  replacement and cycle 2's audit fixes).
- **`architecture-reviewer-fred`** (boundary discipline: tests don't
  reach into shared real systems).
- **`config-reviewer`** (cycle 3 ESLint rule + plugin registration).
- **`code-reviewer`** gateway.

## Plan Exit

- All cycles closed and committed on `feat/eef_exploration`.
- Quality gates green.
- ESLint rule landed and active in root config.

## Consolidation

After plan close, run `/jc-consolidate-docs`.

## Independence

This plan is **fully independent** of plan 1 (dev-boot bug fix) and
plan 2 (config replacement) — file-level AND sequencing-level.

It does not touch `packages/core/build-metadata/` (plan 1) or
`packages/libs/sentry-node/`, `packages/core/env/`,
`apps/.../src/observability/`, `apps/.../src/lib/env.ts` (plan 2).

The earlier sequencing constraint between cycle 1c and plan 1 (the
spawning e2e regression-guard going green) no longer applies because
that e2e test was deleted upstream as a damaged-plan artefact.
Plan 1 now proves the bug fix at unit level only; plan 3 cycle 1c
adds the replacement unit/integration coverage on its own schedule.

All three plans can run in fully parallel sessions.

## Supersession

This plan replaces:

- `.agent/plans/observability/current/there-is-no-time-hashed-starfish.plan.md`
  ARC A (smoke-harness redesign + per-mode conversion + no-observability
  mode + ADR-170). The premise of ARC A — that the smoke harness should
  be redesigned to host more smoke tests — is rejected; the smoke
  tests themselves are duplicative of e2e + unit + integration coverage.
  ARCs B and C of that plan are not in this plan's scope (B is plan 2;
  C is push/preview/merge, which can stay as standalone post-rename
  work).

The superseded ARC A material in
`there-is-no-time-hashed-starfish.plan.md` should be archived to
`archive/superseded/` with a single-line linking note pointing at this
plan as the replacement.
