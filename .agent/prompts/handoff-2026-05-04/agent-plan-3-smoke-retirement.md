# Agent prompt — Plan 3 (smoke-test retirement; all-Vitest; no real-IO)

You are picking up the smoke-test retirement work. The
`apps/oak-curriculum-mcp-streamable-http/smoke-tests/` directory exists
to boot the MCP server with stub/live/remote backends and run HTTP-
level assertions against it. Survey 2026-05-03 found every smoke
mode is duplicative of e2e + unit + integration coverage, or is a
manual operational tool mis-classified as an automated test. The
residual distinct value of `local-stub` smoke reduces to "test that
Express listens" — third-party-framework testing, an absolute
anti-pattern. The whole smoke-tests surface is retiring.

## Plan

[`.agent/plans/architecture-and-infrastructure/current/retire-smoke-tests-all-vitest-no-real-io.plan.md`](../../plans/architecture-and-infrastructure/current/retire-smoke-tests-all-vitest-no-real-io.plan.md)

Eleven cycles total — designed for maximum parallelism.

## Why eleven cycles, parallel-safe

- **1a/1b/1c/1d** (smoke deletion): file-disjoint. Pickup
  independently.
- **2a/2b/2c/2d/2e/2f** (per-workspace audit batches): each batch
  scopes one workspace tree (`packages/core/*`, `packages/libs/*`,
  `packages/sdks/*`, `apps/oak-curriculum-mcp-streamable-http/`,
  `apps/oak-search-cli/`, `agent-tools/`). Pickup independently in
  parallel.
- **3** (`no-real-io-in-tests` ESLint rule): SEQUENCED AFTER all 2-*
  batches close — wiring the rule into root config earlier would
  flag violations cycle 2 hasn't yet fixed.

Up to eight agents can work this plan concurrently if there is
appetite.

## Session-open

1. Run `/jc-start-right-quick`.
2. Read [`.agent/memory/active/napkin.md`](../../memory/active/napkin.md)
   from line ~315 onward (Salty + Tidal 2026-05-03 entries).
3. Read [`.agent/prompts/agentic-engineering/collaboration/experiments/E1/closure.md`](../agentic-engineering/collaboration/experiments/E1/closure.md).
4. Read the plan end-to-end.
5. Decide which cycle(s) you're picking up. If multiple cycles, keep
   them logically grouped (e.g. all of 1a–1d if you're doing the
   smoke-deletion sweep solo; or one workspace batch in cycle 2 if
   you're auditing alone).
6. PDR-027 identity preflight; open a claim covering the file scope
   for your chosen cycle(s).
7. Post a session-open comms event with your landing target stated
   plainly. Note which cycles you're claiming so peer agents can
   pick up the rest.

## What's already done upstream

- The orphaned `dev-server-boots-without-observability-config.e2e.test.ts`
  was deleted in commit `27983ef9` as a damaged-plan artefact. Plan
  3 cycle 1c is now ONLY about adding the replacement
  unit/integration test, not about the deletion.
- The earlier cross-plan sequencing constraint between cycle 1c and
  plan 1 no longer applies. Plan 3 is now fully independent of plan 1.

## Cycle 1a — Delete `smoke-tests/` directory

Move first, delete second:

- `smoke-tests/auth/clerk-oauth-token.test.ts` and
  `smoke-tests/auth/clerk-oauth-token.ts`: if real unit tests, move
  to `apps/.../src/auth/`; otherwise delete.
- `smoke-tests/cli/remote-cli.ts` + `remote-cli.unit.test.ts`: if
  real unit test, move to `apps/.../src/cli/`; otherwise delete.
- Everything else under `smoke-tests/` deletes.

Acceptance: `apps/.../smoke-tests/` does not exist;
`grep -rn "smoke-tests/" apps/.../ --include="*.ts" --include="*.json"`
returns zero matches outside the deletion entries; `pnpm test` and
`pnpm test:e2e` for the workspace exit 0.

## Cycle 1b — Delete `vitest.smoke.config.ts`

Delete `apps/.../vitest.smoke.config.ts`. Search ESLint config
exemptions referencing it and remove them.

## Cycle 1c — Add replacement unit/integration test

Add a new test in `apps/.../src/` (likely
`runtime-config.integration.test.ts` extension or new
`dev-boot-without-observability.integration.test.ts`):

- Builds minimal `processEnv` (no `OBSERVABILITY_*` / `SENTRY_*` /
  `VERCEL_*` keys; only `OAK_API_KEY`, `ELASTICSEARCH_*`,
  `DANGEROUSLY_DISABLE_AUTH=true`, stub-tools).
- `loadRuntimeConfig` returns ok.
- `createApp` instantiates without throwing.
- No spawning, no listening, no real IO.

## Cycle 1d — Remove smoke scripts from package.json + turbo.json

Remove from `apps/.../package.json` scripts:
`smoke:dev:stub`, `smoke:dev:auth`, `smoke:dev:live`,
`smoke:dev:live:auth`, `smoke:remote`, `smoke:oauth:spec`,
`smoke:oauth-inspector`, `smoke:oauth-curl`, `inspect:oauth`,
`trace:oauth`. Remove `smoke:dev:*` and `smoke:remote` references
from root `package.json` and `turbo.json`.

## Cycles 2a–2f — Per-workspace real-IO audit

Per batch (one workspace tree):

```bash
grep -rn "spawn\\|child_process\\|fs\\.\\|readFile\\|writeFile\\|process\\.env\\s*=\\|process\\.env\\[" \
  <batch-scope>/ --include="*.test.ts"
```

Classify each finding:

- Composition root (vitest config / setup file): permitted.
- DI fake / declared allowlisted helper: permitted.
- Real IO elsewhere: violation; fix by injecting a fake (test + fake
  + product-code edit land together in one small commit per
  violation).

A batch may produce zero commits (no violations) or many.

## Cycle 3 — `no-real-io-in-tests` ESLint rule

Author `packages/core/oak-eslint/src/rules/no-real-io-in-tests.ts`.
Pair with RuleTester unit tests + plugin registration. **Do NOT
wire into root `eslint.config.ts` until all 2-* batches close.**
Allowlist: vitest config files at workspace roots; designated DI-fake
helper files.

## Reviewer dispatch

- `test-expert` (per cycle, especially 1c's replacement test and
  cycle 2's audit fixes).
- `architecture-expert-fred` (boundary discipline).
- `config-expert` (cycle 3 ESLint rule + plugin registration).
- `code-expert` gateway.

## Coordination

Plans 1 and 2 may be running in parallel sessions. None of their
files overlap with yours. Coordination is awareness, not blocking.
If you're working a 2-* batch and a peer is working a different
batch, log your batch in your session-open event so the peer can
pick a non-overlapping one.

## Session-close

- Close your claim.
- Update thread record identity row.
- Post a comms event naming which cycles you landed and which remain
  open for the next agent.

## Hard rules in scope

- We never use git to remove work.
  (`.agent/rules/never-use-git-to-remove-work.md`)
- No transitional shims; if a test is shape-wrong, delete it forward
  and add the proper replacement; do not attempt to "fix in place"
  by adding mock-io shims.
- Tests prove product behaviour; tests that assert on third-party
  framework behaviour are out of scope for this codebase.
