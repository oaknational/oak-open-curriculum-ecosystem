---
name: "MCP Deploy-Boundary Repair + Sentry Verification"
status: active
status_reason: >
  Contract verified from primary evidence, the deploy-boundary repair
  is landed, and the former Step 4 consumer backlog in
  `@oaknational/oak-search-sdk`, `@oaknational/sdk-codegen`, and
  `@oaknational/search-cli` is now validated by a green full
  repo-root gate rerun through `pnpm format:root`. Preview/Sentry
  proof is still blocked because the dedicated realistic
  production-build gate for the env path that loads the Sentry
  esbuild plugin is still missing, and the lingering
  `Multiple projects found ...` lint diagnostic still needs an
  honest disposition.
overview: >
  Single-session operational repair for
  `apps/oak-curriculum-mcp-streamable-http`. Verify the actual Vercel import
  contract from primary evidence, land the smallest correct deploy boundary,
  preserve local runner behaviour unless the repair requires otherwise, repair
  supporting tooling drift, absorb the lint/config/test-governance fallout
  exposed by making the local gates honest, replace spawned-process proof with
  doctrine-compliant code-level tests plus a realistic production-build
  quality gate, rerun the preview probe, and close with ADR, parent-plan, and
  continuity updates. The warnings doctrine is already landed and remains
  binding.
parent_plan: "../active/sentry-observability-maximisation-mcp.plan.md"
related_plans:
  - "../future/mcp-http-runtime-canonicalisation.plan.md"
branch: "feat/otel_sentry_enhancements"
depends_on:
  - "../active/sentry-observability-maximisation-mcp.plan.md"
todos:
  - id: warnings-doctrine
    content: "Warnings doctrine already landed; every step below remains bound by `.agent/rules/no-warning-toleration.md`."
    status: completed
  - id: verify-contract-and-land-boundary
    content: "Verify the exact `@vercel/node` package-`main` contract from primary evidence, record it inline, then land the deploy-boundary repair (`src/server.ts`, composition helper, `package.json` `main`, esbuild warnings-as-errors + export assertion, doc updates)."
    status: completed
  - id: repair-local-tooling
    content: "Keep local runtime behaviour honest while the deploy boundary changes: retain vendor preload, repair local harness drift, and update only the local tooling surfaces that genuinely need the new artefact."
    status: completed
  - id: restore-lint-governance
    content: "Repair the repo-owned lint governance drift exposed during local validation: make `pnpm check` and the shared standards package tell the truth again by inventorying and removing current warn/off carve-outs, suppressions, and false-green wiring in the strictness surface, and make the shared `@oaknational` plugin/config surface single-source-of-truth so exported rules cannot silently fail to enforce."
    status: pending
  - id: rationalise-eslint-rule-tests
    content: "Review `packages/core/oak-eslint/src/rules/*test.ts` against `testing-strategy.md`; keep only correctly classified behaviour-proof tests, delete or relocate implementation/config/IO-mechanics tests, and redesign `max-files-per-dir` so both the rule and its proof are deterministic and activation-ready even though the rule is not active yet."
    status: completed
  - id: remove-dynamic-import-and-assertion-debt
    content: "Fix `packages/core/oak-eslint/src/rules/no-dynamic-import.ts` type errors without type assertions while preserving rule behaviour, then remove the repo-owned dynamic imports and assertion/suppression escape hatches surfaced once honest enforcement is active."
    status: pending
  - id: realistic-production-build-gate
    content: "Replace the old built-artifact spawned-process proof doctrine with DI-friendly code-level tests plus a repo-owned quality gate that completes a realistic production build, including the env path that loads the Sentry esbuild plugin."
    status: pending
  - id: prove-preview-and-sentry
    content: "Deploy a preview, prove the function boots and `/healthz` responds, and record preview/Sentry evidence sufficient to verify the release-linkage lane is actually live."
    status: pending
  - id: close-repo-owned-follow-through
    content: "Amend ADR-163 for the repaired deploy shape, update the parent L-8 lane, archive the repo monitoring plan, move canonicalisation into its own separate plan, and refresh thread/continuity/napkin surfaces."
    status: completed
---

# MCP Deploy-Boundary Repair + Sentry Verification

**Last Updated**: 2026-04-23
**Status**: 🟡 ACTIVE — verified contract, deploy-boundary repair, and
the former Step 4 consumer backlog are now validated by a green full
repo-root gate rerun; the dedicated realistic-build gate and lingering
non-fatal diagnostics still block preview/Sentry proof
**Session shape**: one operational session, not a multi-session stream.

## Why this plan exists

The current branch has three coupled failures:

1. The Vercel preview build can go green while the deployed function crashes
   at boot because `dist/index.js` does not honour the adapter's import
   contract.
2. The build currently allows the same contract break to surface as warnings
   instead of hard failure.
3. The branch cannot yet prove from a real preview deployment whether the
   Sentry release-linkage lane is actually working end to end.

This plan owns the repo changes required to fix those three things in one
session.

Subsequent local validation on 2026-04-23 expanded the remaining lane:

4. Shared ESLint plugin/config registration can drift, so a rule may be
   exported but not actually enforced.
5. The repo has accumulated warn/off overrides and inline suppressions that
   undermine the warnings doctrine and the repo rule set.
6. The ESLint rule test estate now needs explicit justification against the
   testing strategy; many tests currently prove config or RuleTester mechanics
   rather than owned product behaviour.
7. The newly added `no-dynamic-import` rule currently has package type errors,
   and honest enforcement surfaces real dynamic-import debt in repo-owned code.
8. The earlier local-vs-preview build mismatch came from local builds not
   exercising the same Sentry esbuild-plugin branch unless the relevant env
   was present, so code-level tests alone are insufficient without a realistic
   production-build gate that completes under representative env.

The session remains single-pass, but preview proof is now gated on absorbing
this governance fallout instead of pushing around it.

Owner clarification on 2026-04-23 makes that blocking relationship explicit:
sorting out `check` strictness and removing overrides is not optional. Preview
or other product-impact proof gathered before the repo can see its own failures
is non-authoritative, because masked problems would make the evidence
untrustworthy. This plan therefore treats gate-honesty repair as a prerequisite,
not as optional cleanup.

## Scope

In scope:

- Verify the actual `@vercel/node` package-`main` contract from primary
  evidence and record the answer in this plan before coding against it.
- Land the smallest correct Vercel deploy boundary in
  `apps/oak-curriculum-mcp-streamable-http/`.
- Repoint the deployed artefact to that boundary and fail the build if the
  contract is broken again.
- Repair any local-tooling surfaces made inaccurate by the deploy-boundary
  change.
- Restore lint/config gate honesty before push by removing repo-owned
  override/suppression drift in scope rather than adding new exceptions.
- Replace built-artifact spawned-process proof with doctrine-compliant
  code-level tests at the correct levels plus a realistic production-build
  quality gate.
- Rationalise the ESLint rule test estate against
  [`testing-strategy.md`](../../../directives/testing-strategy.md), keeping
  `max-files-per-dir` healthy and activation-ready even though it is not active
  yet.
- Eliminate the dynamic-import and assertion escape hatches surfaced once the
  shared standards plugin is enforcing honestly.
- Re-run the Vercel preview probe and record repo-owned evidence that:
  - the function boots;
  - `/healthz` returns 200;
  - the expected preview release appears in Sentry;
  - preview traffic can be seen in Sentry with the expected release and
    environment linkage.
- Amend ADR-163 and the parent L-8 lane so the repaired shape is the
  documented truth.

Out of scope:

- Monitor creation, registration, or alert wiring. The owner will create the
  uptime monitor outside this repo once the endpoint and preview proof are
  real.
- Broader runtime canonicalisation. That work is moved to
  [`mcp-http-runtime-canonicalisation.plan.md`](../future/mcp-http-runtime-canonicalisation.plan.md).
- Deleting the local runner stack unless the verified contract forces a
  smaller change to it.

## Non-Goals

- No new monitoring plan.
- No follow-up placeholders.
- No speculative reshaping beyond the minimum repair that the verified
  contract requires.
- No relaxation of repo rules, no temporary lint downgrades, and no new
  sanctioned-looking exceptions added to get the branch over the line.
- No child-process proof or other test-owned process spawning. If confidence
  depends on a build-only branch, cover it through DI-friendly code tests plus
  a realistic build gate rather than subprocess tests.

## Operational Steps

### 1. Verify the contract, then use it immediately

Read the primary source that actually governs Vercel's Node serverless import
shape. If the docs are ambiguous, use a disposable probe deployment and treat
the observed behaviour as the load-bearing answer.

Record the result directly in this plan as a short contract note before
changing code. The repair step below must be derivable from that note without
further guesswork.

**Contract note (verified 2026-04-23)**:

- [Vercel's Express documentation](https://vercel.com/docs/frameworks/backend/express)
  shows the ESM deployment shape as `export default app` — the deployed
  module must default-export the Express app rather than only starting a local
  listener.
- The current `@vercel/node` runtime source (`@vercel/node@5.7.13`
  `dist/bundling-handler.js`, inspected from the npm tarball during this
  session) unwraps nested default exports and then accepts exactly three
  handler shapes: a web-handler object (`GET`/`POST`/`fetch`), a function
  handler, or a listened `http.Server`.
- Therefore this app's deployed artefact must live at a dedicated
  `dist/server.js` default export. The current `dist/index.js` shape is invalid
  for `package.json` `main` because it exports no default handler and only
  boots the local Node listener.

### 2. Land the deploy-boundary repair

Make the deployed artefact explicit.

Required changes:

- add `src/server.ts` with the exact export shape the verified contract
  requires;
- add a workspace-local composition helper if needed so Result-bearing setup is
  unwrapped once at the boundary rather than smeared across entry points;
- add the `server` entry to the esbuild factory and tests;
- repoint `package.json` `main` at `dist/server.js`;
- make the build fail on any esbuild warning;
- make the build fail if the emitted `dist/server.js` no longer satisfies the
  export contract;
- update `README.md` and `docs/deployment-architecture.md` in the same landing
  so they stop describing `dist/index.js` as the deployed artefact.

The warnings gate and the export-contract gate are distinct and both required.

### 3. Keep local execution honest

Local development is not the deployed boundary. Preserve the vendor preload
and keep the local runner path working unless the deploy repair proves it must
move.

Repo-owned local follow-through in this session is limited to:

- keeping `start-server.sh` honest;
- updating any development contract that genuinely needs the new deployed
  artefact;
- repairing `scripts/server-harness.js` so it matches the real
  `CreateAppOptions` surface;
- keeping E2E and smoke coverage green;
- removing any repo-owned spawned-process test proof in favour of
  doctrine-compliant DI seams.

### 4. Repair the gate-honesty fallout before push

The deploy-boundary repair exposed that local validation was not yet honest
enough to support a trustworthy preview push. This plan now owns the minimum
repo cleanup needed to make the gates tell the truth again.

For this session, the strictness surface is the set of repo-owned configs,
shared standards surfaces, and rule/test seams that can make root `pnpm check`
look greener than reality. That includes the root check/lint wiring, the shared
`@oaknational/eslint-plugin-standards` package, `packages/core/type-helpers`,
and every workspace config participating in `pnpm check` that currently
downgrades lint findings or suppresses them.

Required changes:

- enumerate every current `warn` rule, `off` override, allowlist carve-out,
  inline suppression, and assertion-based escape hatch in the strictness
  surface, then delete it or rewrite the owning code seam so the exception
  disappears; carry-forward exceptions are not allowed in this lane;
- make the shared `@oaknational` ESLint plugin/config registration
  single-source-of-truth so exported rules cannot drift away from enforced
  rules;
- separate registration drift from policy drift: fix the duplicate custom-rule
  registry problem, and separately remove the shared/workspace `warn` policy
  that currently tells consumers to accept non-fatal enforcement;
- keep the shared standards package on the root `pnpm check` path, including
  `lint:fix`, so the branch is validated by the same repo gate it relies on;
- repair `packages/core/oak-eslint/src/rules/no-dynamic-import.ts` so the
  standards package type-checks without assertions and without silently
  narrowing rule behaviour;
- remove every repo-owned dynamic import that the stricter, honest gates now
  surface rather than hiding it behind exclusions or delayed follow-up;
- review the ESLint rule test estate and keep only correctly named
  behaviour-proof tests; delete or relocate config-mechanics, inventory, and
  in-process IO audits out of the unit/integration test path;
- delete or rewrite test surfaces that prove builds or runtime loading via
  child processes; where build-only branches still matter, cover them with
  code-level DI tests and a dedicated realistic-build quality gate instead;
- redesign `max-files-per-dir` so activation-ready means deterministic lint
  behaviour and doctrine-compliant proof, not live filesystem state,
  `process.cwd()`, or RuleTester-specific type-assertion shims;
- remove assertion and suppression bunkers in the shared standards/type-helper
  surfaces touched by this lane rather than documenting them as permanent.

Additional remaining work discovered under honest `require-observability-emission`:

- `packages/sdks/oak-search-sdk`: exported async admin/retrieval/observability
  helpers still need structured emission wired through the existing optional
  logger/deps seams rather than via new carve-outs;
- `packages/sdks/oak-sdk-codegen`: exported async bulk readers/writers and MCP
  runtime helpers still need explicit observability emission and, where
  needed, DI-friendly logger seams;
- `apps/oak-search-cli`: exported async adapter/CLI/indexing helpers still
  need structured emission, and the runtime-config test surfaces that import
  `.env`-reading code directly must be deleted or rewritten around simple
  fakes;
- `apps/oak-curriculum-mcp-streamable-http`: local `lint` exits 0, but still
  prints the `Multiple projects found ...` parser/tooling diagnostic; that
  warning-like surface must be root-caused or removed honestly rather than
  suppressed;
- root/local validation still needs a repo-owned quality gate that runs a
  realistic production build with the env needed to load the Sentry esbuild
  plugin, because that branch is exactly where the earlier local/preview drift
  hid.

This step is complete only when the branch can pass local gates without hidden
policy downgrades, without false-green validation gaps, and without relying on
"not active yet" as an excuse for leaving a rule or its tests in poor
condition.

### 5. Prove the preview and prove Sentry

After the code lands locally, deploy a preview and record all of the
following in the plan or thread record:

- preview URL;
- `/healthz` 200 proof;
- absence of the previous boot-time `FUNCTION_INVOCATION_FAILED` shape;
- expected preview release identifier in Sentry;
- preview traffic visible in Sentry with the expected release and environment
  linkage.

This is the repo-owned close condition for "can we test if Sentry is actually
working?". Monitor creation remains owner-external.

## Local landing evidence (2026-04-23)

- Verified the deploy contract from both Vercel's Express docs and the
  `@vercel/node@5.7.13` runtime source.
- Landed a dedicated `src/server.ts` / `dist/server.js` deploy boundary,
  with `package.json` `main` now pointing at `dist/server.js`.
- Added two build-time contract gates: esbuild warnings now fail the build,
  and the built deployed artefact must default-export a function.
- Repaired supporting local surfaces made inaccurate by the new boundary:
  `scripts/server-harness.js`, `knip.config.ts`, and the missing
  `.claude/rules/no-warning-toleration.md` portability mirror.
- `pnpm check` exited 0 immediately after the deploy-boundary repair and
  repo-tail follow-through; that apparent green was then deliberately
  invalidated by the later `warn` → `error` honesty move in the five
  scoped workspaces, which surfaced the remaining Step 4 backlog below.
- `@oaknational/eslint-plugin-standards` now has the missing `lint:fix` script,
  so root `pnpm check` no longer skips linting that workspace.
- `@oaknational/eslint-plugin-standards` now has one authoritative
  plugin/rule registry, typed custom rules, deterministic
  `max-files-per-dir`, and a rationalised rule-test estate; package
  `lint`, `type-check`, and `test` are green locally.
- `@oaknational/type-helpers` now removes `typeSafeFromEntries` and
  `typeSafeOwnKeys`, rewrites their consumers in observability/logger/SDK
  code, and passes local `lint`, `type-check`, and `test`; the affected
  `@oaknational/logger` and `@oaknational/observability` gates are also green.
- Follow-on analysis then found additional repo-owned lint/config/test-governance
  drift that must be absorbed before a trustworthy preview push: shared plugin
  registration drift, broad warn/off override surfaces, inline suppressions,
  ESLint rule tests that need justification or deletion under the testing
  doctrine, and package type errors in `no-dynamic-import.ts`.
- `apps/oak-curriculum-mcp-streamable-http` now passes local `lint`,
  `type-check`, and `test` after removing the spawned-process built-artifact
  test surface and moving the harness back onto the source DI path.
- The user-flipped `warn` → `error` severity move remains in place for
  `@oaknational/require-observability-emission` across the five scoped
  workspaces, and the former 27/14/48 backlog is now retired as
  authoritative history.
- The former remaining consumer backlog is now remediated authoritatively:
  - `packages/sdks/oak-search-sdk`,
    `packages/sdks/oak-sdk-codegen`, and `apps/oak-search-cli`
    satisfy the emission rule in the full repo-root rerun;
  - `apps/oak-search-cli` no longer carries the two runtime-config
    test-boundary violations;
  - the generated MCP execute path plus the
    `@oaknational/curriculum-sdk` caller now thread the execution
    logger through the runtime seam.
- The last authoritative full repo-root gate run followed
  [`.agent/commands/gates.md`](../../../commands/gates.md) from the
  repo root and passed `pnpm secrets:scan:all`, `pnpm clean`,
  `pnpm test:root-scripts`, `pnpm sdk-codegen`, `pnpm build`,
  `pnpm type-check`, `pnpm doc-gen`, `pnpm lint:fix`, `pnpm test`,
  `pnpm test:widget`, `pnpm test:e2e`, `pnpm test:ui`,
  `pnpm test:a11y`, `pnpm test:widget:ui`,
  `pnpm test:widget:a11y`, `pnpm smoke:dev:stub`,
  `pnpm subagents:check`, `pnpm portability:check`,
  `pnpm markdownlint:root`, and `pnpm format:root`.
- The authoritative rerun still surfaced two non-fatal outputs:
  - `pnpm sdk-codegen` printed `Invalid programme URLs detected` for
    five Foundation programme URLs while exiting 0;
  - `@oaknational/oak-curriculum-mcp-streamable-http` lint still
    printed the `Multiple projects found ...` parser/tooling
    diagnostic while root `pnpm lint:fix` exited 0.
- The repo still lacks the dedicated realistic production-build gate for
  the env path that loads the Sentry esbuild plugin.
- Preview `/healthz` and Sentry proof were deliberately not attempted
  after the green root rerun because that dedicated realistic
  production-build gate is still missing.
- The build-confidence doctrine is now updated: extensive code-level tests at
  the correct levels plus a realistic production build completing are
  sufficient; built-artifact subprocess proof is not.

### 6. Close the documentation and planning fallout

Land the durable follow-through in the same pass:

- ADR-163 amended for the repaired deploy boundary;
- parent L-8 lane updated to point at this operational plan as the execution
  authority for the remaining preview/Sentry proof;
- the repo monitoring plan closed as repo-owned work and was archived
  because monitor setup is owner-external;
- canonicalisation moved to its own separate plan;
- thread record, `repo-continuity`, and napkin refreshed to match the final
  shape.

## Acceptance

The plan is complete only when all of the following are true:

- `pnpm check` passes after the deploy-boundary repair.
- The build hard-fails on esbuild warnings and on a broken deployed export
  contract.
- The repo has a quality gate that completes a realistic production build
  under representative env, including the branch that loads the Sentry
  esbuild plugin.
- Root `pnpm check` is strict enough to expose real failures, including
  `lint:fix`, `type-check`, and `test` coverage for
  `@oaknational/eslint-plugin-standards`, so its config/rule surfaces are not
  false-green.
- The shared custom-rule registry has one authoritative source for both the
  exported plugin surface and the enforced recommended config surface.
- The shared ESLint standards package lints and type-checks, including
  `no-dynamic-import.ts`, without type assertions or behaviour-narrowing
  shortcuts.
- The branch no longer depends on `warn` severities, `off` overrides,
  allowlist carve-outs, or inline suppressions anywhere in the strictness
  surface enumerated by this session.
- Any surviving ESLint rule tests are correctly classified and explicitly
  justified as behaviour proofs under `testing-strategy.md`; mechanics/IO
  audits are deleted or moved out of the in-process test lane.
- Build/runtime confidence for production-only branches is provided by
  doctrine-compliant code-level tests plus the realistic production-build
  gate, not by child-process tests.
- `max-files-per-dir` remains activation-ready, meaning deterministic rule
  behaviour and doctrine-compliant proof rather than live filesystem or cwd
  dependence.
- The preview deployment boots successfully.
- `/healthz` returns 200 on the preview.
- Sentry shows the expected preview release and preview traffic with the
  expected release and environment linkage.
- ADR-163, the parent L-8 lane, and the operational memory surfaces all
  describe the same repaired architecture.
- No repo surface still claims that monitor setup is a live repo workstream.

## Validation

Local:

```bash
# Authoritative only when run from the repo root, following
# .agent/commands/gates.md exactly and restarting from the top after each fix.
pnpm secrets:scan:all
pnpm clean
pnpm test:root-scripts
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm doc-gen
pnpm lint:fix
pnpm test
pnpm test:widget
pnpm test:e2e
pnpm test:ui
pnpm test:a11y
pnpm test:widget:ui
pnpm test:widget:a11y
pnpm smoke:dev:stub
pnpm subagents:check
pnpm portability:check
pnpm markdownlint:root
pnpm format:root
# and the dedicated realistic-production-build gate with representative env
```

Workspace-local `lint` / `type-check` / `test` runs can still be used for
diagnosis, but they are not branch-level success criteria because the owner has
explicitly reasserted that inter-workspace side-effects keep surfacing later in
the repo-root sequence.

Preview / external:

- deploy a preview from `feat/otel_sentry_enhancements`;
- hit `/healthz`;
- inspect the Vercel runtime result;
- inspect the Sentry release and preview traffic surfaces.

External validation is manual by design. The repo only owns making the
verification possible and recording the evidence.

## Related Work Moved Elsewhere

- Runtime canonicalisation:
  [`mcp-http-runtime-canonicalisation.plan.md`](../future/mcp-http-runtime-canonicalisation.plan.md)
- Monitor creation: owner-external, not a repo plan
