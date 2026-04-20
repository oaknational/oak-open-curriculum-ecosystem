---
name: Execute L8 WS1 RED
overview: Session-scoped operational plan to author and commit the three failing integration tests that gate §L-8's esbuild-native build + `@sentry/esbuild-plugin` wiring. The authoritative WS1 spec lives in the maximisation plan; this is the execution view for this session, not a duplicate.
todos:
  - id: reread-spec
    content: Re-read §L-8 WS1 in the maximisation plan; confirm no drift since opener authored
    status: in_progress
  - id: test-plugin-output
    content: Author plugin-build-output.integration.test.ts (Debug IDs in dist + plugin lifecycle log evidence)
    status: pending
  - id: test-policy
    content: Author policy-invocation.integration.test.ts (resolveSentryEnvironment + resolveSentryRegistrationPolicy invoked once per build, outputs feed plugin config)
    status: pending
  - id: test-equivalence
    content: "Author build-output-equivalence.integration.test.ts (contract-surface diff vs tsup baseline; sourcemap: 'hidden' divergence acknowledged)"
    status: pending
  - id: verify-red
    content: Run tests; confirm all three fail for expected reason; confirm no existing tests broken
    status: pending
  - id: vercel-probe
    content: Author + push Vercel build-env smoke probe branch; confirm VERCEL_ENV/VERCEL_GIT_COMMIT_SHA/VERCEL_GIT_REPO_SLUG populate at build stage
    status: pending
  - id: test-reviewer
    content: "Invoke test-reviewer (readonly): challenge assertion-kind, vendor-neutrality, no process.env reads"
    status: pending
  - id: apply-findings
    content: Apply test-reviewer findings in place
    status: pending
  - id: quality-gate
    content: Run targeted quality gates one at a time (type-check, lint:fix, format:root, scoped test runs)
    status: pending
  - id: commit-red
    content: Commit RED with message tying to §L-8 WS1 acceptance criteria
    status: pending
  - id: decision-point
    content: "Decide: continue to WS2 GREEN + WS3.1 atomic in this session, or stop and rewrite next-session-opener per PDR-026 unlanded-case"
    status: pending
  - id: session-close
    content: Run /jc-session-handoff; update napkin with surprises and pattern instances
    status: pending
isProject: false
---

# Execute §L-8 WS1 RED — Sentry esbuild-native build

Landing target per [next-session-opener.md](.agent/memory/operational/next-session-opener.md): **§L-8 WS1 RED** — failing integration tests for esbuild-native build + plugin lifecycle + build-output equivalence authored and committed.

Authoritative spec: [`sentry-observability-maximisation-mcp.plan.md`](.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md) §L-8 WS1. This session-plan does not duplicate it; it operationalises it.

## Grounding (already loaded)

- Foundation: AGENT.md, principles.md, testing-strategy.md, schema-first-execution.md
- Workstream: observability-sentry-otel (branch `feat/otel_sentry_enhancements`, HEAD `1a10ac39`, clean tree)
- Practice-core incoming: empty
- Plan-time `assumptions-reviewer` already passed for §L-8 (ACCEPT WITH NOTES, findings applied)

## Metacognition lens

- **Action → impact bridge**: three failing tests committed → unblocks WS2 GREEN (atomic with WS3.1 ADR amendment) → MCP server gains release/commit/deploy attribution → alpha-grade observability.
- **Pattern to guard against**: `inherited-framing-without-first-principles-check`. Before each test file, ask: *what is this test for? Is its assertion-kind correct (behaviour, not configuration)?* This is the third instance of the pattern in two sessions, so guard is hot.

## Standing decisions (owner-beats-plan, do not re-open)

- Build tool for MCP app: **raw esbuild** (NOT tsup). `@sentry/esbuild-plugin` + tsup is known-broken (Sentry 608/614, tsup 1260).
- Plugin: `@sentry/esbuild-plugin` — ADOPTED.
- L-7 bespoke orchestrator (953 lines, 5 files) → DELETE in WS2.
- ADR-163 §6 → AMEND from HOW to WHAT, atomic with WS2 (WS3.1).
- `@sentry/cli` devDep → DELETE from BOTH MCP app and `apps/oak-search-cli/`.

## Files to author (per §L-8 WS1.1 + WS1.2)

- [`apps/oak-curriculum-mcp-streamable-http/build-scripts/plugin-build-output.integration.test.ts`](apps/oak-curriculum-mcp-streamable-http/build-scripts/plugin-build-output.integration.test.ts) — asserts `pnpm build` with `SENTRY_AUTH_TOKEN=<fake>` + ADR-163 §3 env-pair inputs produces dist bundles carrying Debug IDs and `.map` files; build logs evidence plugin's release-registration + sourcemap-upload + deploy-event invocations.
- [`packages/libs/sentry-node/src/policy-invocation.integration.test.ts`](packages/libs/sentry-node/src/policy-invocation.integration.test.ts) — asserts `resolveSentryEnvironment` + `resolveSentryRegistrationPolicy` invoked exactly once per build; outputs flow into plugin config.
- [`apps/oak-curriculum-mcp-streamable-http/build-scripts/build-output-equivalence.integration.test.ts`](apps/oak-curriculum-mcp-streamable-http/build-scripts/build-output-equivalence.integration.test.ts) — contract-surface diff against pre-swap tsup baseline: entry-point filenames, `external` boundary (`/node_modules/*/`), top-level exports, sourcemap presence + linkage, `format: 'esm'`, `target: 'es2022'`, `platform: 'node'`. **Deliberate divergence** (NOT part of contract): `sourcemap: 'hidden'` omits `sourceMappingURL` comment per Sentry hidden-source-map posture.

## Acceptance criteria (per §L-8 WS1)

1. All three test files compile and run.
2. All three fail for the expected reason: no esbuild config yet, no plugin wired.
3. No existing tests broken.
4. Tests assert *product behaviour*, not configuration (testing-strategy invariant).
5. Tests do not read or write `process.env` (pass explicit literal inputs via DI).
6. Vercel build-env smoke probe demonstrates `VERCEL_ENV`, `VERCEL_GIT_COMMIT_SHA`, `VERCEL_GIT_REPO_SLUG` populate at the build stage where the esbuild config will load (confirms WS2 design assumption before WS2 lands).

## Reviewer schedule (this session)

- `assumptions-reviewer`: NOT re-run (prior pass valid; spec unchanged).
- `test-reviewer`: after tests drafted, BEFORE commit. Mandate: challenge whether each assertion is behaviour-asserting; confirm no `process.env` access; confirm tests would pass against any vendor-equivalent implementation, not just `@sentry/esbuild-plugin` specifically (vendor-neutrality at the test boundary).

## Quality gate (before commit)

```bash
pnpm type-check && \
pnpm lint:fix && \
pnpm format:root && \
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test && \
pnpm --filter @oaknational/sentry-node test
```

Run one at a time per `start-right-thorough`. Full `pnpm check` not needed at RED — that is WS4's job after GREEN.

## Stop conditions

- `test-reviewer` flags assertion-kind violation → fix in place, do not commit RED first.
- Vercel build-env probe shows any of the three env vars missing → STOP. WS2 design assumption is unsound; surface to owner before proceeding.
- Test compile failure that is not part of the expected RED reason → diagnose; if not fixable in this session, scope down (commit only the tests that compile, defer the rest with explicit next-session target per PDR-026).

## Decision point at WS1 RED commit

Per next-session-opener § Session shape:

- If session capacity allows → proceed to WS2 GREEN **atomically with WS3.1 ADR-163 §6 amendment** (same commit minimum, same PR maximum). WS3.1 MUST NOT precede or trail WS2 — the ADR and the code must agree at every commit boundary.
- Otherwise → stop at RED commit; rewrite [`next-session-opener.md`](.agent/memory/operational/next-session-opener.md) `Target` block per PDR-026 unlanded-case structure; record attempted/prevented/re-attempts in [`repo-continuity.md`](.agent/memory/operational/repo-continuity.md) `§ Next safe step`.

## Learning loop

- Continuously write any surprises, friction signals, or new pattern instances to [`.agent/memory/active/napkin.md`](.agent/memory/active/napkin.md).
- Especially log any further `inherited-framing-without-first-principles-check` instances — pattern is one repeat away from graduation.
- On session close, run `/jc-session-handoff`; consolidation gate triggers `/jc-consolidate-docs` only if conditions met.

## Mode transition

After plan acceptance, switch to agent mode (the §L-8 work requires writing test files, which is non-readonly).
