# Agent prompt — Plan 1 (dev-boot bug fix)

You are picking up the **primary unblocker** for the
`feat/eef_exploration` branch. The bug: `pnpm dev` fails to boot when
the developer's `.env.local` (or any committed `.env*`) sets
`SENTRY_MODE=sentry` because release-resolution requires
`VERCEL_GIT_COMMIT_SHA` and that variable cannot exist locally.

## Plan

[`.agent/plans/observability/current/fix-dev-boot-release-resolution.plan.md`](../../plans/observability/current/fix-dev-boot-release-resolution.plan.md)

Single cycle. Single function. Single test file.

## Session-open

1. Run `/jc-start-right-quick`.
2. Read [`.agent/memory/active/napkin.md`](../../memory/active/napkin.md)
   from line ~315 onward (Salty + Tidal 2026-05-03 entries).
3. Read [`.agent/prompts/agentic-engineering/collaboration/experiments/E1/closure.md`](../agentic-engineering/collaboration/experiments/E1/closure.md)
   — short; tells you what was learned and what discipline carries
   forward.
4. Read the plan end-to-end.
5. PDR-027 identity preflight; open a claim covering
   `packages/core/build-metadata/src/release-internals.ts`,
   `packages/core/build-metadata/src/release-types.ts`, and
   `packages/core/build-metadata/tests/release.unit.test.ts` (or the
   actual test home — verify before claiming).
6. Post a session-open comms event with your landing target stated
   plainly.

## Landing target

Edit `resolveDevelopmentRelease` in
`packages/core/build-metadata/src/release-internals.ts:185-220`:
when both `VERCEL_BRANCH_URL` and `VERCEL_GIT_COMMIT_SHA` are absent
in development environment, return
`ok({value: 'local-dev', source: RELEASE_SOURCES.localDev,
environment: RELEASE_ENVIRONMENTS.development})` instead of
`err({kind: 'missing_git_sha'})`.

Add `localDev: 'local-dev'` to `RELEASE_SOURCES` in
`packages/core/build-metadata/src/release-types.ts`. Naming is
`camelCase` per owner direction; existing entries are `snake_case`;
mixed convention is acknowledged and out of scope to normalise here.

Pair with unit test cases proving:

- Empty `ReleaseInput` in development → `ok({value: 'local-dev', ...})`.
- `VERCEL_BRANCH_URL` present in dev still wins.
- `VERCEL_GIT_COMMIT_SHA` present in dev still wins (`dev-<shortSha>`).
- Preview environment with no SHA still errs (regression-guard).
- Production environment with no SHA still errs (regression-guard).

`RELEASE_ERROR_KINDS.missing_git_sha` stays — preview and production
still raise it. Only the dev path stops raising it.

## Acceptance

- `pnpm test --filter @oaknational/build-metadata` exit 0.
- `env -u VERCEL_ENV -u VERCEL_BRANCH_URL -u VERCEL_GIT_COMMIT_SHA -u
  VERCEL_GIT_COMMIT_REF -u SENTRY_RELEASE_OVERRIDE SENTRY_MODE=sentry
  timeout 15 pnpm dev | head -5` from
  `apps/oak-curriculum-mcp-streamable-http/` shows "server listening"
  (manual verification only).
- `grep -rn "missing_git_sha" packages/core/build-metadata/` continues
  to find the error kind.

## Reviewer dispatch

- `type-reviewer` (Result-typed function, discriminated unions, no
  `as`/`!`/`unknown`).
- `test-reviewer` (TDD-as-pairs cycle correctness; the regression-
  guard cases prove the dev fall-through is environment-bounded).
- `code-reviewer` gateway.

## Coordination

Plans 2 and 3 may be running in parallel sessions. Watch
`.agent/state/collaboration/active-claims.json` and the comms
events directory for peer activity. None of plan 2's or plan 3's
files overlap with yours; coordination is awareness, not blocking.

## Session-close

- Close your claim.
- Update thread record identity row.
- Post a comms event noting plan 1 landed (or a session-paused event
  if you didn't land it, with reasons).
- Run the session-handoff protocol per the commit + handoff skills.

## Hard rules in scope

- We never use git to remove work. Forward-going filesystem changes
  only. (`.agent/rules/never-use-git-to-remove-work.md`)
- No "ritual form" framing for landing commitments. State the
  substance plainly.
- TDD-as-pairs: test and product code land together in one commit;
  tree green at the end.
