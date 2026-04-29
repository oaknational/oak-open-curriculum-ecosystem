# MCP Local Startup Release Boundary — Phase 1 RED Evidence

**Date**: 2026-04-24  
**Plan**: [`mcp-local-startup-release-boundary.plan.md`](mcp-local-startup-release-boundary.plan.md)

## RED Tests Added

- `packages/libs/sentry-node/src/config.unit.test.ts`
  - `SENTRY_MODE=off` should construct without `VERCEL_GIT_COMMIT_SHA`,
    `VERCEL_BRANCH_URL`, or `SENTRY_RELEASE_OVERRIDE`.
  - The off-mode config must not carry `release` or `releaseSource`.
  - `SENTRY_MODE=sentry` remains strict for the same missing-release input and
    fails with `missing_git_sha`.
- `packages/core/build-metadata/tests/release.unit.test.ts`
  - `resolveRelease` should project from canonical build identity instead of
    deriving app identity independently from raw env fields.
- `apps/oak-curriculum-mcp-streamable-http/src/build-identity.unit.test.ts`
  - A typed build-identity boundary should fail fast when the generated app
    version sentinel reaches runtime.
  - Local development identity should resolve without Sentry metadata.
- `apps/oak-curriculum-mcp-streamable-http/src/observability/http-observability.integration.test.ts`
  - Off-mode HTTP observability should construct without deploy release
    metadata, avoid Sentry SDK initialisation, and continue writing
    OTel-shaped logs to stdout with app version in the OTel resource.
  - `HttpObservability` should not expose an ambiguous `release` field. App
    build identity is consumed through OTel resource attributes; Sentry release
    identity remains private to the Sentry adapter path.
- `apps/oak-curriculum-mcp-streamable-http/src/runtime-config.integration.test.ts`
  - A pure validated-env-to-runtime-config seam should build runtime config and
    off-mode observability without env-file IO or deploy release metadata while
    preserving app build identity as `RuntimeConfig.version`.
- `apps/oak-curriculum-mcp-streamable-http/src/app/app-version-header.unit.test.ts`
  - App build identity should be consumed outside observability by a pure header
    resolver that returns `x-app-version`.
- `apps/oak-curriculum-mcp-streamable-http/src/landing-page/render-landing-page.unit.test.ts`
  - HTML rendering should consume app build identity by adding an app-version
    meta tag.
- `apps/oak-curriculum-mcp-streamable-http/smoke-tests/modes/local-stub-env.unit.test.ts`
  - A pure local-stub env-preparation seam should strip inherited deploy
    release metadata instead of mutating `process.env`.
- `apps/oak-curriculum-mcp-streamable-http/operations/development/http-dev-contract.unit.test.ts`
  - The local UI/a11y launcher plan should strip inherited deploy release
    metadata from the child server env.

## Focused RED Evidence

`pnpm --filter @oaknational/sentry-node test` fails on the off-mode boundary
tests:

- `createSentryConfig > defaults to off without becoming a Sentry release carrier`
- `createSentryConfig > does not use production app version as a Sentry release
  carrier in off mode`
- `createSentryConfig > keeps off mode green when deploy release metadata is absent`
- `createSentryConfig > treats off mode as a kill switch even when live-only
  inputs are present`

Current result: off mode either still carries `release` / `releaseSource`, or
fails before off-mode semantics when deploy release metadata is missing.
Intended failure: Sentry release resolution still runs before off-mode semantics
and `SentryOffConfig` still acts as a Sentry release carrier.

`pnpm --filter @oaknational/build-metadata test` fails on the new build identity
projection RED:

- `resolveRelease > projects local development build identity into the Sentry
  release value`

Intended failure: `resolveRelease` still acts as a parallel env-derived release
authority instead of consuming canonical build identity.

Targeted streamable HTTP command:

```bash
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http exec vitest run \
  src/observability/http-observability.integration.test.ts \
  src/runtime-config.integration.test.ts \
  src/build-identity.unit.test.ts \
  src/app/app-version-header.unit.test.ts \
  src/landing-page/render-landing-page.unit.test.ts \
  smoke-tests/modes/local-stub-env.unit.test.ts \
  operations/development/http-dev-contract.unit.test.ts
```

Current failures:

- `smoke-tests/modes/local-stub-env.unit.test.ts`: missing
  `./local-stub-env.js` pure env-preparation module.
- `src/runtime-config.integration.test.ts`: missing
  `createRuntimeConfigFromValidatedEnv` pure runtime-config seam.
- `src/build-identity.unit.test.ts`: missing `build-identity` module and
  `resolveCurrentAppBuildIdentity` boundary.
- `operations/development/http-dev-contract.unit.test.ts`: inherited
  `VERCEL_GIT_COMMIT_SHA` still leaks into the local UI/a11y child server env.
- `src/observability/http-observability.integration.test.ts`: off-mode
  observability still returns `ok: false` before it can prove stdout OTel
  logging with `service.version` sourced from app build identity.
- `src/app/app-version-header.unit.test.ts`: missing pure app-version header
  resolver.
- `src/landing-page/render-landing-page.unit.test.ts`: landing page rendering
  does not yet consume app version identity as a meta tag.

The app-wide
`pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test` also
currently reports unrelated build-script failures from the parallel WS3 lane.
Those failures are not part of this startup-boundary RED slice.

## Reviewer Gates

- `sentry-reviewer`: no Sentry mode/release semantics findings after tightening.
- `test-reviewer`: no blocking test-quality findings after category/naming
  corrections.
- `code-reviewer`: no remaining blocking findings after inherited metadata was
  added to launcher RED tests.

The owner then clarified the deeper invariant: app build identity is
orthogonal to observability; observability consumes it but does not create it.
The RED tests were corrected after that clarification, so the next reviewer pass
must check this updated framing rather than the earlier "no release on
observability" wording.

The owner also identified a likely implementation direction for build identity:
extract all build identity logic into an app or workspace boundary, ensure every
build context produces an appropriate identity, and make that identity available
to the rest of the system. A candidate shape is a generated `.app-version.ts`
module with an explicit unknown/unset sentinel that build/dev tooling overwrites
before runtime imports it. `resolveRelease` should then become the
Sentry-specific projection from build identity plus Sentry context, not a
parallel source of app identity.

Architecture review then caught a remaining wording risk: build identity must
not be substituted directly into Sentry `release` fields. Sentry `release`
continues to come from `resolveRelease` per ADR-163, but `resolveRelease` should
consume the build identity rather than derive app identity independently. Build
identity may also be sent to Sentry as separate metadata, such as an
`app.version` tag, context, or OTel resource attribute.

## GREEN Entry Criteria

The first GREEN step should not broaden into WS3 or release-identifier
rewrites. Implement only the smallest seams needed to satisfy these RED tests:

1. Split off-mode Sentry config from Sentry release identity while keeping live
   mode strict. Do not disable broader app observability.
2. Add the pure validated-env-to-runtime-config builder.
3. Add the pure local-stub env-preparation module and route local stub through
   it.
4. Strip deploy release metadata from local UI/a11y child server env.
5. Add app build identity propagation to HTTP headers and HTML metadata from
   `RuntimeConfig.version`, not from observability.
6. Extract build identity resolution out of observability/Sentry config and
   into its own typed boundary before broadening GREEN implementation.
7. Remove or rename `HttpObservability.release`; the public observability
   surface must not expose a value that conflates app build identity with Sentry
   release identity.
8. Refactor `resolveRelease` to consume canonical build identity for its Sentry
   release projection instead of acting as a parallel app identity authority.
   The first RED row is local development build identity projecting to the
   Sentry release value.
