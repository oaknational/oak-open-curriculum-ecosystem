---
name: "MCP Deploy-Boundary Repair + Sentry Verification"
status: active
status_reason: >
  Contract verified from primary evidence; the smallest local
  deploy-boundary repair is landed, supporting root-gate fallout is
  repaired, and preview `/healthz` plus Sentry proof are the only
  remaining close conditions.
overview: >
  Single-session operational repair for
  `apps/oak-curriculum-mcp-streamable-http`. Verify the actual Vercel import
  contract from primary evidence, land the smallest correct deploy boundary,
  preserve local runner behaviour unless the repair requires otherwise, repair
  supporting tooling drift, rerun the preview probe, and close with ADR,
  parent-plan, and continuity updates. The warnings doctrine is already landed
  and remains binding.
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
  - id: prove-preview-and-sentry
    content: "Deploy a preview, prove the function boots and `/healthz` responds, and record preview/Sentry evidence sufficient to verify the release-linkage lane is actually live."
    status: pending
  - id: close-repo-owned-follow-through
    content: "Amend ADR-163 for the repaired deploy shape, update the parent L-8 lane, archive the repo monitoring plan, move canonicalisation into its own separate plan, and refresh thread/continuity/napkin surfaces."
    status: completed
---

# MCP Deploy-Boundary Repair + Sentry Verification

**Last Updated**: 2026-04-23
**Status**: 🟡 ACTIVE — verified contract + local repair landed; preview/Sentry proof pending push
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
- keeping E2E and smoke coverage green.

### 4. Prove the preview and prove Sentry

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
- `pnpm check` exits 0 on the branch after the repair.

### 5. Close the documentation and planning fallout

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
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http check
pnpm check
```

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
