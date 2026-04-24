---
name: "Sentry Release Identifier — Single Source of Truth"
overview: >
  Land two co-equal proofs that ADR-163's release-identifier discipline is
  honoured end-to-end. (1) Build-time and runtime resolvers MUST agree on
  the release identifier for every environment: production = root
  `package.json` semver; preview = the Vercel branch URL host (e.g.
  `poc-oak-open-curriculum-mcp-git-feat-otelsentryenhancements`); dev =
  the same branch-URL shape locally if available else `dev-<shortSha>`.
  (2) Builds on `main` MUST be cancelled unless the commit advances the
  root `package.json` semver — i.e. only semantic-release commits trigger
  a production deploy. The cancellation script exists but is over-built
  and missing the branch gate; WS3 rewrites it (~50 lines, canonical
  `semver` package, asymmetric current/previous input handling),
  re-amends ADR-163 §10 to match, AND deletes the workspace shim by
  re-pointing `vercel.json`'s `ignoreCommand` directly at the canonical
  script (or relocating the canonical script into the app workspace if
  Vercel cannot resolve the upward path) — eliminating the wiring drift
  surface structurally rather than guarding it with a configuration test
  that would not align with `testing-strategy.md`.
derived_from: feature-workstream-template.md
foundational_adr: "docs/architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md"
related_plans:
  - ".agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md (L-8 lane that landed the diverging build-time resolver)"
  - ".agent/plans/observability/current/multi-sink-vendor-independence-conformance.plan.md (downstream consumer of release attribution)"
todos:
  - id: ws0-amend-adr-and-document-direction
    content: "WS0 (DECIDE → DOCUMENT): owner direction collapses the option space (semver for prod, branch-URL for preview, build-cancellation outside semantic-release on main). Land an ADR-163 amendment that records both rules with full truth tables BEFORE WS1 begins. Run assumptions-reviewer + sentry-reviewer + architecture-reviewer-fred against the proposed amendment."
    status: completed
  - id: ws1-red
    content: "WS1 (RED): add @oaknational/build-metadata as a devDependency on @oaknational/sentry-node (libs ← core edge per dep-cruise); add a minimal type-only field VERCEL_BRANCH_URL?: string to SentryConfigEnvironment with TSDoc naming the canonicalisation follow-up; write the cross-resolver contract test (build-time and runtime return identical strings for every truth-table row); ATOMICALLY REPLACE old-shape preview/dev assertions in build-time-release.unit.test.ts and config-resolution.unit.test.ts with branch-URL-host assertions (no dual-spec coexistence — `Replace, don't bridge`). Tests MUST fail because the runtime resolver does not yet read VERCEL_BRANCH_URL and the build-time preview resolver still returns preview-<slug>-<sha>. NO wiring integration test (the shim that creates the wiring drift surface is deleted in WS3 instead — Vercel itself is the only meaningful wiring gate)."
    status: pending
    priority: next
  - id: ws2-green
    content: "WS2 (GREEN): rewrite resolvePreviewRelease and resolveDevelopmentRelease to consume VERCEL_BRANCH_URL host; extend resolveSentryRelease to read the same. Delete the obsolete preview-<slug>-<sha> shape and the slugifyBranch helper. Correct isValidReleaseName denylist to mirror Sentry's documented rules verbatim (accept `latest`, reject `/`). All tests pass."
    status: pending
  - id: ws3-cancellation-rewrite
    content: "WS3 (REWRITE + SHIM DELETION): (a) replace vercel-ignore-production-non-release-build.mjs with a ~50-line implementation that uses the npm `semver` package and the simpler `branch === main AND semver.lte(current, previous)` rule. Add the missing `VERCEL_GIT_COMMIT_REF === main` gate. Asymmetric handling of unresolvable inputs: current undefined → cancel with stderr build-error message; previous undefined → continue (treat as first build). Rewrite unit tests against the new rule. Re-amend ADR-163 §10 to match the new (simpler) truth table and drop the fail-open trade-off framing (it evaporates with the new shape). (b) Delete the workspace shim at apps/oak-curriculum-mcp-streamable-http/build-scripts/vercel-ignore-production-non-release-build.mjs and re-point apps/oak-curriculum-mcp-streamable-http/vercel.json's ignoreCommand directly at the canonical script (relative path upward from the app dir). If Vercel cannot resolve the upward path under deploy probe, fallback is to relocate the canonical script + tests INTO the app workspace (single-consumer abstraction collapsed per principles). Either resolution eliminates the wiring drift surface structurally — no wiring integration test required."
    status: pending
  - id: ws4-refactor-docs
    content: "WS4 (REFACTOR): TSDoc on every changed symbol; rewrite release resolution section in observability.md and sentry-deployment-runbook.md; update napkin if a generalisable pattern emerges."
    status: pending
  - id: ws5-quality-gates
    content: "WS5: pnpm clean && pnpm sdk-codegen && pnpm build && pnpm type-check && pnpm doc-gen && pnpm lint:fix && pnpm format:root && pnpm markdownlint:root && pnpm test && pnpm test:e2e && pnpm smoke:dev:stub. Exit 0, no filtering."
    status: pending
  - id: ws6-adversarial-review
    content: "WS6: post-execution reviewers — sentry-reviewer (vendor-canonical idiom), docs-adr-reviewer (ADR-163 amendment fidelity), release-readiness-reviewer (preview AND production attribution proven via Sentry MCP find_releases + search_events on a fresh deploy)."
    status: pending
  - id: ws7-doc-propagation
    content: "WS7: propagate the amended ADR-163 outcomes — observability.md, sentry-deployment-runbook.md, README, queued observability plans referencing release shape; verify Sentry UI shows correctly-tagged events for the next preview deploy."
    status: pending
isProject: false
---

# Sentry Release Identifier — Single Source of Truth

**Last Updated**: 2026-04-24
**Status**: 🟢 EXECUTING — WS0 landed (ADR-163 amendment + reviewer
dispositions); WS1 RED next.
**Scope**: Resolve the build-time/runtime release-identifier divergence per
owner direction (semver for prod, branch-URL for preview), AND replace the
over-built production build-cancellation script with a ~50-line
canonical-`semver` implementation that matches the simpler rule recorded
in ADR-163 §10. Both correctness fixes ship under one plan because they
share the same ADR amendment surface and the same reviewer-pre-landing
discipline.

---

## Owner Direction (recorded 2026-04-23)

Per principles §Owner Direction Beats Plan, the following two requirements
are settled and not re-opened by this plan:

1. **Release identifier scheme**:
   - **Production** release identifier = root `package.json` semver, read
     at build time (e.g. `1.5.0`).
   - **Preview** release identifier = the host portion of
     `VERCEL_BRANCH_URL` (e.g.
     `poc-oak-open-curriculum-mcp-git-feat-otelsentryenhancements`). This
     ties every preview Sentry release to the Vercel preview URL exactly,
     so an event in Sentry can be opened in the matching preview
     deployment by URL, and all commits on the same branch register
     against the same release (matching ADR-163 §5 _"one release → many
     deploys"_ at the per-branch grain).
   - **Both build-time and runtime** must produce the same string for the
     same environment input — no divergence between what is registered at
     build time and what runtime events are tagged with.

2. **Production build-cancellation rule**:
   - A build on the `main` branch MUST be cancelled unless the commit
     advances the root `package.json` semver beyond the previously-
     deployed version (per `semver.lte` from the canonical npm
     [`semver`](https://www.npmjs.com/package/semver) package — i.e.
     cancellation fires when current ≤ previous, covering both the
     "no bump" case and the "downgrade / revert" case). Merge commits
     that carry the previous version do NOT trigger a production
     deploy; only semantic-release commits (which monotonically
     increment per Oak's single-`main`-branch model) do.
   - Mechanism exists at
     `packages/core/build-metadata/build-scripts/vercel-ignore-production-non-release-build.mjs`,
     wired via `apps/oak-curriculum-mcp-streamable-http/vercel.json`'s
     `ignoreCommand`. The current implementation is over-built (~205
     lines, hand-rolled semver parser/comparator, missing the
     `VERCEL_GIT_COMMIT_REF === 'main'` gate that §1's truth table
     requires, conflates transient git-resolution failures with
     deterministic repo defects under a single fail-open clause).
   - This plan's job for this requirement is **rewrite to the simpler
     rule** (WS3 — ~50 lines using the canonical `semver` package,
     branch-gate added, asymmetric current/previous handling) +
     unit-test rewrite + ADR-163 §10 re-amendment to reflect the new
     behaviour + **deletion of the `apps/.../build-scripts/` shim** so
     `vercel.json` invokes the canonical script directly (WS3.5 —
     structurally eliminating the wiring drift surface rather than
     guarding it with a configuration-parity test).

Both requirements MUST end this plan as **true and proven** — proven by
unit tests (cross-resolver contract; cancellation logic), structural
elimination of indirection (no shim left to drift against), and
end-to-end Sentry-side verification (next preview deploy shows events
tagged with the branch-URL release; next semantic-release commit on
`main` deploys to production while a non-release commit cancels).

---

## Context

ADR-163 §1 (as written) prescribes a single canonical release identifier
— root `package.json` semver — for both build-time registration and
runtime event tagging. ADR-163 §5: _"one release → many deploys… creating
a fresh release per environment would lose the same code, different
environment relationship that regression attribution depends on."_

The MCP app's Sentry integration was end-to-end verified in the preceding
session (transcript [Sentry MCP integration verification](11729e08-3046-448d-af80-d00b790279a6)).
The verification surfaced a hard divergence:

| Surface                                         | Current shape                  | Example                                            |
| ----------------------------------------------- | ------------------------------ | -------------------------------------------------- |
| ADR-163 §1 (intended contract, as written)      | semver everywhere              | `1.5.0`                                            |
| Build-time (`resolveBuildTimeRelease`, prod)    | semver                         | `1.5.0`                                            |
| Build-time (`resolveBuildTimeRelease`, preview) | `preview-<slug>-<shortSha>`    | `preview-feat-otel-sentry-enhancements-10bb956`    |
| Build-time (`resolveBuildTimeRelease`, dev)     | `dev-<shortSha>`               | `dev-10bb956`                                      |
| Runtime (`resolveSentryRelease`, all envs)      | semver via `APP_VERSION`       | `1.5.0`                                            |
| Sentry releases registered (preview build logs) | matches build-time preview     | `preview-feat-otel-sentry-enhancements-10bb956`    |
| Sentry events observed (runtime, preview env)   | matches runtime                | `1.5.0`                                            |

Per owner direction (above), the resolution is **neither** "uphold §1
strictly" **nor** "preserve the build-time shape as-is": both resolvers
adopt a new, identical shape per environment — semver for production,
`VERCEL_BRANCH_URL` host for preview/dev. ADR-163 §1 is amended to record
this; the cancellation rule (production = semantic-release commit only)
is the second amendment that protects the production identifier from
being re-issued by merge-commit builds.

### Existing Capabilities

- `resolveBuildTimeRelease` — pure resolver, fully unit-tested
  (`packages/core/build-metadata/src/build-time-release.ts`).
- `resolveSentryRelease` — pure resolver, fully unit-tested
  (`packages/libs/sentry-node/src/config-resolution.ts`).
- `SENTRY_RELEASE_OVERRIDE` — explicit per-process override, honoured
  first by both resolvers; the bridge any override path can build on.
- `VERCEL_BRANCH_URL` — Vercel system env var, stable per branch (already
  schema-validated in `apps/oak-curriculum-mcp-streamable-http/src/env.ts`
  and consumed in `runtime-config.ts` for hostname allowlisting).
- `@sentry/esbuild-plugin` — owns release registration and source-map
  upload; takes `release.name` from the build-resolved value
  (`apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-build-plugin.ts`).
- `vercel-ignore-production-non-release-build.mjs` + tests — the production
  cancellation mechanism. Wiring is correct; the script's logic and unit
  tests are scheduled for replacement in WS3 against the simpler
  `branch === main AND semver.lte(current, previous)` rule.
- `vercel.json` `ignoreCommand` — already wired to the script (path
  unchanged by the WS3 rewrite).
- `semver` (npm) — canonical semver comparator. NOT yet a workspace
  dependency; WS3 adds it to
  `packages/core/build-metadata/package.json`.
- ADR-163 — the prescriptive contract this plan amends.

---

## Design Principles

1. **One concept, one name** — per principles §Code Design `Consistent
   Naming`, `NEVER create compatibility layers`: a single release
   identifier per (environment, branch), used identically by the build
   plugin and the runtime SDK. No bridge, no fallback shape.
2. **Decision, then code** — the ADR-163 amendment lands as the first
   artefact; tests in WS1 are written against the recorded decision.
3. **Replace, don't bridge** — per `.agent/rules/replace-dont-bridge.md`:
   the obsolete `preview-<slug>-<sha>` shape is deleted, not deprecated.
4. **Pure resolvers, single contract** — both resolvers stay pure; a
   contract test enforces byte-identical output for the same environment
   input. Drift becomes a red unit test, not a production discovery.
5. **Fail fast on divergence** — the cross-resolver contract test runs in
   CI on every commit; ADR-163 amendment names it as the enforcement gate.
6. **Already-proven work counts** — the cancellation script's existing
   unit tests are the proof; this plan adds the integration check and the
   ADR linkage, not duplicate test infrastructure.

**Non-Goals** (YAGNI):

- Not changing the production attribution rule (ADR-163 §3 stays:
  `VERCEL_ENV=production AND VERCEL_GIT_COMMIT_REF=main`).
- Not re-implementing the cancellation script or its unit tests.
- Not introducing a new release-identifier surface beyond the two named
  in owner direction (semver, branch-URL host).
- Not addressing the secondary finding that Vercel platform-layer
  timeouts do not reach Sentry — separate plan if/when prioritised.
- Not re-evaluating Sentry as the observability vendor.

---

## Truth Tables

### Release identifier per environment (owner direction #1)

| `VERCEL_ENV`  | `VERCEL_GIT_COMMIT_REF` | `VERCEL_BRANCH_URL` (host)                                                | Build-time AND runtime release   | Source                  |
| ------------- | ----------------------- | ------------------------------------------------------------------------- | -------------------------------- | ----------------------- |
| `production`  | `main`                  | (typically the project production URL host)                               | root `package.json` semver       | `application_version`   |
| `production`  | non-`main`              | `poc-…-git-<branch>` host                                                 | branch-URL host                  | `vercel_branch_url`     |
| `preview`     | any                     | `poc-…-git-<branch>` host                                                 | branch-URL host                  | `vercel_branch_url`     |
| `development` | any                     | unset (typical local)                                                     | `dev-<shortSha>`                 | `development_short_sha` |
| any           | any                     | (any) — `SENTRY_RELEASE_OVERRIDE` set                                     | override value                   | `SENTRY_RELEASE_OVERRIDE` |

Notes:

- The `production`/non-`main` row exists because Vercel allows
  `vercel --prod` from any branch; ADR-163 §3 already downgrades the
  Sentry **environment** to `preview` in that case. For symmetry, the
  release identifier follows the same downgrade — it is treated as a
  preview-shape release.
- `VERCEL_BRANCH_URL` is documented in the Vercel system env-var
  inventory (`apps/oak-curriculum-mcp-streamable-http/docs/vercel-environment-config.md`)
  and is already validated in
  `apps/oak-curriculum-mcp-streamable-http/src/env.ts`. Format for Oak's
  custom domain looks like
  `poc-oak-open-curriculum-mcp-git-<branch-slug>.vercel.thenational.academy`;
  the release identifier is the **leftmost label** (everything before
  the first `.`).

### Production build cancellation (owner direction #2)

Mirrored here so the plan body is the single place both rules live
during execution. WS3 lands the rewrite that matches this table; the
existing 5-row table in ADR-163 §10 (with its fail-open last row) is
re-amended in WS3 to mirror this one.

The rule, in full: **`branch === 'main' AND current ≤ previous` →
cancel; otherwise continue**, with two asymmetric input-resolution
cases. `current` and `previous` are root `package.json` `version`
strings, compared by `semver.lte` from the canonical npm `semver`
package.

| Branch (`VERCEL_GIT_COMMIT_REF`) | Current version (root `package.json`) | Previous version (`VERCEL_GIT_PREVIOUS_SHA:package.json`) | Outcome           | Reason                                                                                |
| -------------------------------- | ------------------------------------- | --------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------- |
| not `main`                       | (not read)                            | (not read)                                                | Continue build    | Branch gate; per §1 only `main` triggers a production identifier.                     |
| `main`                           | resolvable                            | unresolvable / unset                                      | Continue build    | First build OR previous SHA absent / git-unreachable; treated as "no previous to beat". |
| `main`                           | resolvable                            | resolvable, current ≤ previous                            | **CANCEL build**  | Version did not increment; this is a merge / hot-fix-on-main / accidental downgrade.  |
| `main`                           | resolvable                            | resolvable, current > previous                            | Continue build    | Semantic-release commit advanced the version; the production identifier is fresh.     |
| `main`                           | unresolvable                          | (not read)                                                | **CANCEL with stderr** | Build error: the current app version cannot be determined from root `package.json`. Diagnostic message printed; non-recoverable. |

Asymmetry rationale (WS3 captures it in TSDoc + the ADR re-amendment):

- An unresolvable **current** version is a deterministic repo defect
  (missing/malformed `package.json`); it cannot be "first build"
  noise. Cancel hard with a diagnostic so the failure surfaces at
  build time, not at Sentry-ingest time.
- An unresolvable **previous** version is dominated by transient
  causes (first deploy, shallow clone, `VERCEL_GIT_PREVIOUS_SHA`
  unset, fetch failure). Treat as "no previous to beat" and continue;
  the next build with a resolvable previous will re-gate.
- The fail-open clause documented in ADR-163 §10's first amendment
  (the "set, unresolvable / continue with stderr warning" row) is
  superseded by this asymmetry — git-resolution failure of `previous`
  collapses into the second row above; there is no separate "warn and
  continue" outcome.

---

## WS0 — Amend ADR-163 and document direction (PRE-WS1)

This workstream produces the decision artefact. WS1 cannot start until
WS0 lands an ADR-163 amendment that records both truth tables above and
both reviewer dispositions.

### 0.1 ADR-163 amendment

Land an amendment block in
`docs/architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md`
that:

1. Replaces §1's "release = root `package.json` semver" with the per-
   environment table above. Notes the owner direction date and that the
   amendment closes the previously-undocumented build-vs-runtime
   divergence (transcript [Sentry MCP integration verification](11729e08-3046-448d-af80-d00b790279a6)).
2. Adds a new §10 (or appropriate next section) "Production builds
   require a semantic-release commit" with the cancellation truth table
   and explicit reference to
   `packages/core/build-metadata/build-scripts/vercel-ignore-production-non-release-build.mjs`
   as the enforcement mechanism. Records that the script's unit tests
   ARE the proof for this requirement and names them by path.
3. Records the **process-gap finding**: how implementation diverged from
   §1 (as written) without amendment. The fix is not just resolver
   alignment but a CI-enforced contract test (added in WS1/WS2.3) that
   fails the build on shape divergence between build-time and runtime
   resolvers. Without that gate, the same drift recurs.

### 0.2 Reviewer scheduling — PRE-decision

Per `invoke-code-reviewers` and the workstream-template Plan-phase
reviewers, fire against the proposed amendment text BEFORE it lands:

- `assumptions-reviewer` — proportionality of the chosen shape; does the
  branch-URL choice introduce assumptions that need checking
  (e.g. branch-URL stability across Vercel project renames, branch-URL
  collisions between forks, host-suffix changes if Oak migrates the
  preview domain)?
- `sentry-reviewer` — vendor-canonical posture: does Sentry's release
  model accept arbitrary host-string release identifiers? What happens
  to release health metrics when previews use long-host strings? Are
  there length/character constraints on release identifiers we must
  respect (the existing `SENTRY_RELEASE_NAME_PATTERN` ≤200 chars
  suggests yes)?
- `architecture-reviewer-fred` — principles-first: does the amendment
  preserve §5 _"one release → many deploys"_ at the per-branch grain
  (yes — multiple commits on the same branch produce the same release
  identifier, which IS one-release-many-deploys at branch scope)? Does
  the cancellation rule's existing implementation match the ADR's
  prescribed mechanism (it does today; the amendment names the script
  as canonical to prevent future drift)?

Reviewer findings are action items per principles §Reviewer findings;
record acceptances/rejections inline in the amendment. The full set of
WS0 outputs (amendment text + reviewer dispositions) lands in a single
commit before WS1 begins.

---

## WS1 — Contract tests (RED)

All NEW tests MUST FAIL at the end of WS1; pre-existing tests for
unchanged behaviour stay green.

> See [TDD Phases component](../../templates/components/tdd-phases.md)

### 1.0 Type-system and dependency-graph enablers

Two minimal changes are required before any RED test can compile under
strict typing (per principles §Compiler Time Types — no `as`/`unknown`
shortcuts to bypass missing fields):

1. **Add `@oaknational/build-metadata` as a `devDependency` of
   `@oaknational/sentry-node`.** The cross-resolver contract test
   imports `resolveBuildTimeRelease` from build-metadata; the
   `libs ← core` direction is allowed by `.dependency-cruiser.mjs`'s
   `no-core-to-libs` rule (forbids the reverse only). Land in the same
   commit as the test.

2. **Add a single optional field to `SentryConfigEnvironment`** in
   `packages/libs/sentry-node/src/types.ts`:

   ```typescript
   /**
    * Vercel branch URL host. Consumed by `resolveSentryRelease` for
    * preview/non-main-production release identifiers from WS2 onward
    * (currently ignored by the runtime resolver — declared here so the
    * cross-resolver contract test compiles under strict typing without
    * requiring a `Record<string, unknown>` cast).
    *
    * @remarks Same env-var subset is also declared on
    * `BuildTimeReleaseEnvironmentInput`. The duplication is a known
    * follow-up: a shared `ReleaseEnvironmentInput` schema should live
    * in `@oaknational/env` (alongside `SentryEnvSchema`) so both
    * resolvers' input types derive from a single source — see
    * §Follow-up Work below.
    */
   readonly VERCEL_BRANCH_URL?: string;
   ```

   This is a type-level enabler with **no runtime behaviour change** —
   `resolveSentryRelease` continues to ignore the field until WS2.2
   extends `RELEASE_PRECEDENCE`. `BuildTimeReleaseEnvironmentInput`
   already accepts the field via its open string-string index
   signature; an explicit declaration there lands in WS2.1 alongside
   the resolver rewrite for documentation parity.

### 1.1 Cross-resolver contract test

**Test**:
`packages/libs/sentry-node/tests/release-identifier-cross-resolver.contract.unit.test.ts`
(new) — table-driven; for every row in the §Truth Tables release-
identifier table, asserts that
`resolveBuildTimeRelease(env)` and `resolveSentryRelease(env)` return the
**same `value`**. Lives in `sentry-node` (downstream of `build-metadata`
in the dep graph). One test per row; one shared input fixture (a small
adapter handles the `APP_VERSION` vs `APP_VERSION_OVERRIDE` field-name
difference between the two resolver inputs).

**Acceptance Criteria**:

1. Test compiles (requires §1.0 enablers) and runs.
2. Test fails for at least the preview rows (current build resolver
   returns `preview-<slug>-<sha>`; runtime returns semver).
3. The matched `*.contract.unit.test.ts` filename is collected by
   sentry-node's vitest config (`tests/**/*.test.ts` glob from
   `vitest.config.base.ts`). Confirmed by file-name pattern; no config
   change required.
4. No existing test breaks.

### 1.2 Build-time resolver tests — atomic contract replacement

In `packages/core/build-metadata/tests/build-time-release.unit.test.ts`,
**REPLACE** (do not retain alongside) the assertions of
`preview-<slug>-<sha>` shape with branch-URL-host assertions:

- Old preview-shape assertions are deleted in this commit. Per
  principles `Replace, don't bridge` and `NEVER create compatibility
  layers`, retaining old-contract tests alongside new-contract tests
  during the transition would be a test-layer compatibility layer.
  WS0 already retired the old contract in ADR-163; the tests have been
  stale since `06bf25d7`. They die now.
- New input row: `VERCEL_BRANCH_URL` set; assert resolver returns the
  leftmost label as `value`, with `source: 'vercel_branch_url'`. The
  `BuildTimeReleaseSource` union does not yet include
  `vercel_branch_url`; tests assert on `value` only at WS1 and gain
  `source` assertions when WS2.1 extends the union.
- New error case: `VERCEL_BRANCH_URL` missing in preview — fail-fast
  with a typed error (per principles §Fail FAST). New typed error kind
  `missing_branch_url_in_preview` (additive to `BuildTimeReleaseError`
  in WS2.1; the test asserts the kind name string and goes red until
  WS2 adds it).

### 1.3 Runtime resolver tests — atomic contract replacement

In `packages/libs/sentry-node/src/config-resolution.unit.test.ts`,
**REPLACE** any pre-existing assertions that pin the runtime resolver
to `APP_VERSION` for preview/development environments with
branch-URL-host assertions for those environments:

- New precedence rule: after `SENTRY_RELEASE_OVERRIDE`, the runtime
  resolver consults `VERCEL_BRANCH_URL` for non-production environments
  before falling back to `APP_VERSION`/semver.
- New tests for the branch-URL host extraction (leftmost label) with
  `source: 'vercel_branch_url'` (extension of `SentryReleaseSource`
  union lands in WS2.2).
- New error case: preview env without `VERCEL_BRANCH_URL` —
  fail-fast.
- Override-precedence tests stay (they assert behaviour that does not
  change). Production-semver tests stay (production behaviour does not
  change).

### Acceptance Criteria for WS1 overall

- All new tests compile and fail for the expected reason (RED).
- All replaced (old-contract) assertions are removed atomically in the
  same commit — no transitional dual-spec coexistence.
- Tests for unchanged behaviour (production semver, override
  precedence, environment downgrade) stay green.
- Test names clearly reference the truth-table rows they cover.
- The `libs ← core` devDependency edge is added; `pnpm install`
  resolves cleanly.
- The `SentryConfigEnvironment` type addition is type-only (no
  runtime branch reads `VERCEL_BRANCH_URL` until WS2).
- **No wiring integration test is added.** The wiring drift surface
  the test would have guarded is eliminated structurally in WS3 by
  shim deletion + direct `vercel.json` re-pointing. See §WS3.5 for
  the rationale and §Follow-up Work for the principles trail
  (`No shims`, `Don't extract single-consumer abstractions`,
  `Test real behaviour, not implementation details`).

---

## WS2 — Implementation (GREEN)

All tests MUST PASS at the end of WS2.

### 2.1 Build-time resolver

**Files**:

- `packages/core/build-metadata/src/build-time-release-internals.ts` —
  rewrite `resolvePreviewRelease`:
  - Read `VERCEL_BRANCH_URL`; extract leftmost host label; validate
    against `SENTRY_RELEASE_NAME_PATTERN`; return as the release value
    with source `vercel_branch_url`.
  - Fail-fast (`missing_branch_url_in_preview` typed error) if
    `VERCEL_BRANCH_URL` is unset/blank.
- `build-time-release-types.ts` — add `vercel_branch_url` to
  `BuildTimeReleaseSource`; add the new typed error kind to
  `BuildTimeReleaseError`.
- Delete the `slugifyBranch` helper if no other consumer remains (the
  branch-URL host is already URL-safe by Vercel's construction; no
  slugification needed). Verify with knip / type-check.

### 2.2 Runtime resolver

**File**: `packages/libs/sentry-node/src/config-resolution.ts`

- Extend `RELEASE_PRECEDENCE` (currently `['SENTRY_RELEASE_OVERRIDE']`)
  to add `VERCEL_BRANCH_URL` as the second-precedence source for non-
  production environments. Production stays on the
  `application_version` fallback (semver).
- Add a small `extractBranchUrlHost` helper (leftmost label of the
  host); validated by the same `SENTRY_RELEASE_NAME_PATTERN`.
- Update `SentryEnvironmentSource` / `ResolvedSentryRelease` type union
  to include `vercel_branch_url`.
- Make sure the precedence is environment-aware: production env returns
  semver (`application_version`); preview/dev returns branch-URL host;
  the override wins everywhere. This mirrors the build-time resolver
  exactly, so the cross-resolver contract test passes.

### 2.3 Anti-drift gate

The cross-resolver contract test from §1.1, with one row per truth-
table cell, IS the anti-drift gate. Confirm it runs in
`pnpm test` (default test config) by:

1. Verifying the test file matches the workspace's `vitest.config.ts`
   `include` pattern (`*.contract.unit.test.ts` — extend the include if
   needed; do not invent a new naming convention without updating the
   testing-strategy directive).
2. If the include pattern needs extension, also update
   `apps/.../eslint.config.ts` test-file pattern matchers if they exist
   so the contract tests get the same lint posture as other test files.

### 2.4 Replace, don't bridge

In the same commit that lands the new shape:

- Delete the now-unused branches and helpers in
  `build-time-release-internals.ts` (no `preview-<slug>-<sha>` shape
  retained as fallback, no `slugifyBranch` helper, no error kinds for
  defunct cases).
- Delete tests asserting the old shape (the new tests are the proof).
- Delete any prose in `observability.md` /
  `sentry-deployment-runbook.md` that documents the old shape (handled
  in WS4).

**Deterministic Validation**:

```bash
pnpm --filter @oaknational/build-metadata test
pnpm --filter @oaknational/sentry-node test
# Cross-resolver contract test must pass; resolvers return identical strings.
```

### 2.5 Sentry release-name validator alignment

`packages/core/build-metadata/src/build-time-release-internals.ts`
currently exports `SENTRY_RELEASE_NAME_PATTERN` and `isValidReleaseName`
which diverge from Sentry's documented release-name rules in two
ways:

- The regex permits `/` (forward slash), which Sentry forbids.
- `isValidReleaseName` rejects the literal `latest`, which Sentry
  permits (Sentry only forbids `latest` in API path positions, not
  as a release name).

Replace both with a strict denylist that mirrors
[Sentry's release-naming rules](https://docs.sentry.io/product/releases/usage/sorting-filtering/)
verbatim:

```typescript
export function isValidReleaseName(value: string): boolean {
  if (value.length === 0 || value.length > 200) return false;
  if (value === '.' || value === '..') return false;
  if (/[\n\t\r/\\]/u.test(value)) return false;
  if (/\s/u.test(value)) return false; // Sentry rejects whitespace
  return true;
}
```

Update tests in
`packages/core/build-metadata/tests/build-time-release.unit.test.ts`
to assert the corrected behaviour: `latest` accepted; `a/b` rejected;
exactly the documented denylist enforced. Drop the `SENTRY_RELEASE_NAME_PATTERN`
regex export if no other consumer remains (the function is the
canonical predicate). This is a small but real correctness fix that
belongs with WS2's resolver rewrite because both the build-time and
runtime resolvers consume `isValidReleaseName` for branch-URL host
validation.

### 2.6 Plugin wiring sanity

`apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-build-plugin.ts`
already feeds `release.name` from the build-time resolver output. Confirm
no plugin-side change is needed beyond the resolver rewrite (the plugin
sees the new string transparently). If the plugin contains any
hard-coded assumptions about the `preview-` prefix, remove them.

---

## WS3 — Cancellation: rewrite to the simpler rule

The current script (~205 lines) hand-rolls semver parsing/comparison,
omits the `VERCEL_GIT_COMMIT_REF === 'main'` gate that §1's truth table
requires, and treats every git-resolution failure under a single
fail-open clause. WS3 replaces it with the canonical-rule version
(~50 lines using the npm `semver` package), rewrites unit tests
against the simpler rule, and re-amends ADR-163 §10 to mirror the new
truth table.

### 3.1 Add `semver` as a workspace dependency

`semver` is not yet a workspace dependency. Add it to
`packages/core/build-metadata/package.json` (runtime — the script
imports it). Use the latest stable major; lockfile updated by
`pnpm install`. No app-side install is needed — by the end of WS3.5
the canonical script is invoked directly by `vercel.json` (the shim
is deleted), so `semver` resolves through the canonical script's own
package boundary.

### 3.2 Script rewrite (RED → GREEN within WS3)

**File**:
`packages/core/build-metadata/build-scripts/vercel-ignore-production-non-release-build.mjs`

Replace the implementation with the rule from §Truth Tables /
Production build cancellation:

```javascript
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import semver from 'semver';

function trimToUndefined(value) { /* … */ }

function safeReadCurrentVersion(readFile, packageJsonPath) {
  try {
    const parsed = JSON.parse(readFile(packageJsonPath, 'utf8'));
    const version = trimToUndefined(parsed.version);
    return version && semver.valid(version) ? version : undefined;
  } catch {
    return undefined;
  }
}

function safeReadPreviousVersion(executeGitCommand, repositoryRoot, previousSha) {
  if (!previousSha) return undefined;
  try {
    let text;
    try {
      text = executeGitCommand(['show', `${previousSha}:package.json`], repositoryRoot);
    } catch {
      executeGitCommand(['fetch', '--depth=1', 'origin', previousSha], repositoryRoot);
      text = executeGitCommand(['show', `${previousSha}:package.json`], repositoryRoot);
    }
    const parsed = JSON.parse(text);
    const previousVersion = trimToUndefined(parsed.version);
    return previousVersion && semver.valid(previousVersion) ? previousVersion : undefined;
  } catch {
    return undefined;
  }
}

export function runVercelIgnoreCommand({ env, repositoryRoot, executeGitCommand, readFile, stdout, stderr }) {
  if (env.VERCEL_GIT_COMMIT_REF !== 'main') {
    stdout.write(`Branch is "${env.VERCEL_GIT_COMMIT_REF}", not main; build will continue.\n`);
    return { exitCode: 1 };
  }
  const current = safeReadCurrentVersion(readFile, path.resolve(repositoryRoot, 'package.json'));
  if (!current) {
    stderr.write('The current app version could not be determined from the root package.json file. This is a build error; cancelling.\n');
    return { exitCode: 0 };
  }
  const previous = safeReadPreviousVersion(executeGitCommand, repositoryRoot, env.VERCEL_GIT_PREVIOUS_SHA);
  if (previous && semver.lte(current, previous)) {
    stdout.write(`Cancelling: root package.json version ${current} did not increment beyond previous build version ${previous} (${env.VERCEL_GIT_PREVIOUS_SHA}).\n`);
    return { exitCode: 0 };
  }
  stdout.write(`Continuing: current=${current}, previous=${previous ?? 'unknown (treating as first build)'}.\n`);
  return { exitCode: 1 };
}
```

Constraints inherited from the existing script — keep them in the
rewrite:

- `runVercelIgnoreCommand` stays the named export so the existing
  unit tests (rewritten in §3.3) can import it by name.
- The default-export CLI invocation (whatever invokes
  `runVercelIgnoreCommand` and writes the exit code) stays in place;
  the path it lives at changes via §3.5 below.
- Vercel `ignoreCommand` semantics are unchanged: exit `0` cancels,
  exit `1` continues.

### 3.3 Unit-test rewrite

**File**:
`packages/core/build-metadata/build-scripts/vercel-ignore-production-non-release-build.unit.test.mjs`

Replace the existing test cases with one test per row of the §Truth
Tables / Production build cancellation table (5 rows). Each test
injects `env`, `executeGitCommand` (stubbed), `readFile` (stubbed),
captured `stdout` / `stderr` streams, and asserts:

1. Returned `exitCode`.
2. The expected substring in `stdout` (continue rows) or `stderr`
   (the unresolvable-current row).
3. For the `branch !== 'main'` row: that `readFile` and
   `executeGitCommand` were NEVER called (branch gate short-circuits
   before any I/O).
4. For the `previous unresolvable` row: that the fetch-fallback path
   is exercised AND its failure is swallowed silently (no `stderr`).

Delete the old fail-open-trade-off test cases; they describe a rule
that no longer exists.

### 3.4 Re-amend ADR-163 §10

Land a second amendment block in
`docs/architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md`
§10 that:

1. Replaces the 5-row truth table from the first amendment with the
   one in §Truth Tables / Production build cancellation above.
2. Drops the "Intentionally fail-open" paragraph entirely; the
   asymmetry rationale (current → fail-hard; previous → continue)
   replaces it.
3. Notes that the rule is enforced via the `semver` npm package
   rather than hand-rolled comparison; names the canonical
   comparator (`semver.lte`).
4. Records the date and links to this plan's WS3 commit by hash
   once landed.
5. Updates the History entry accordingly.

### 3.5 Delete the workspace shim and re-point `vercel.json`

**Problem the shim creates.** Today
`apps/oak-curriculum-mcp-streamable-http/vercel.json` declares:

```json
{ "ignoreCommand": "node ./build-scripts/vercel-ignore-production-non-release-build.mjs" }
```

…and that script is a thin re-export shim that loads and runs the
canonical implementation in
`packages/core/build-metadata/build-scripts/vercel-ignore-production-non-release-build.mjs`.

The shim is a single-consumer abstraction with no behaviour of its
own. It exists only to give Vercel a path it can resolve from the app
workspace — not because the indirection adds value. It directly
violates two principles:

- `Don't extract single-consumer abstractions` (§Architectural
  Decision Rules)
- `No shims, no hacks, no workarounds` (§Cardinal Rule of This
  Repository)

It also creates a class of failure the script's own unit tests
cannot detect: rename or move either side and Vercel's
`ignoreCommand` silently misfires (no production cancellation runs;
non-release commits deploy). The original draft of WS1 included an
integration test to guard this. That test would be a procedural
mitigation for an architectural smell — and it would assert
configuration parity, not behaviour, which `testing-strategy.md`
classes as low-value (cf. "Tests that test the test framework, not
the application logic"). The principled fix is to remove the shim,
not to test around it.

**Action — preferred path: re-point `vercel.json` directly.**

1. Update
   `apps/oak-curriculum-mcp-streamable-http/vercel.json`'s
   `ignoreCommand` to invoke the canonical script directly via its
   path (relative to the app workspace, which is Vercel's
   `rootDirectory`):

   ```json
   {
     "ignoreCommand": "node ../../packages/core/build-metadata/build-scripts/vercel-ignore-production-non-release-build.mjs"
   }
   ```

2. Delete
   `apps/oak-curriculum-mcp-streamable-http/build-scripts/vercel-ignore-production-non-release-build.mjs`
   (the shim) and any sibling `*.unit.test.mjs` it carried. The
   canonical tests at
   `packages/core/build-metadata/build-scripts/vercel-ignore-production-non-release-build.unit.test.mjs`
   stay (rewritten in §3.3).

3. Run a Vercel preview deployment of the branch and confirm
   `vercel inspect <deployment-url>` shows `ignoreCommand` resolved
   and ran (exit 0 cancellation OR exit 1 continue, as appropriate).
   This is the only meaningful wiring gate — Vercel itself.

**Action — fallback path: relocate the canonical script into the app
workspace.** If, and only if, the preview deployment in step 3 above
fails because Vercel will not resolve a path that escapes the app
`rootDirectory`:

1. Move the canonical script and its unit-test file from
   `packages/core/build-metadata/build-scripts/` into
   `apps/oak-curriculum-mcp-streamable-http/build-scripts/`.
2. Move the `semver` dependency declaration from
   `packages/core/build-metadata/package.json` to
   `apps/oak-curriculum-mcp-streamable-http/package.json`.
3. Revert `vercel.json` to its original `./build-scripts/…` path.
4. Update ADR-163 §10 amendment text (drafted in §3.4) to reference
   the new canonical location.

The fallback collapses the abstraction in the other direction:
single consumer, single location. Either resolution structurally
eliminates the wiring drift surface — there is no shim left to drift
against.

**No replacement integration test.** The combined effect of (a) the
canonical script's behavioural unit tests + (b) Vercel's own deploy
probe + (c) the absence of any indirection between `vercel.json` and
the canonical implementation leaves nothing for a wiring test to
prove. Adding one would test configuration syntax, not application
behaviour.

### 3.6 End-to-end proof on next production deploy

Document the steps for the next semantic-release-driven production
deploy (whoever runs it executes them):

1. Verify the commit on `main` is a semantic-release commit (e.g.
   `chore(release): X.Y.Z`) with a version bump in root
   `package.json`.
2. Confirm via Vercel that the production deployment ran (not
   cancelled).
3. Verify Sentry `find_releases` shows a release matching the new
   semver.
4. Verify Sentry `search_events` shows production-env events tagged
   with the new semver release.

For the inverse proof — a non-release commit on `main` is cancelled —
either:

- Capture an existing real cancellation event from Vercel project logs
  (preferred — proves the rule fires in production), OR
- Pair with the owner to push a non-version-bump commit to a temporary
  branch that simulates `main` and observe the cancellation; revert.

Record the chosen approach and the captured evidence in the amendment's
"Verified" block (or in a sibling evidence file under
`docs/operations/`).

---

## WS4 — Documentation and Polish (REFACTOR)

### 4.1 TSDoc

Every changed public symbol references the amended ADR-163 section by
number. TSDoc explains _why_ branch-URL host (per-branch grouping at
the release level) and _why_ the cancellation rule (production
identifier integrity). Not _how_ the function works.

### 4.2 Authoritative docs

- `apps/oak-curriculum-mcp-streamable-http/docs/observability.md` —
  release resolution policy section rewritten against the amended
  ADR-163. Includes both truth tables.
- `docs/operations/sentry-deployment-runbook.md` — example identifiers
  updated. Cancellation rule promoted to a dedicated section if not
  already present.
- `apps/oak-curriculum-mcp-streamable-http/docs/vercel-environment-config.md`
  — note that `VERCEL_BRANCH_URL` is now also consumed by the Sentry
  release resolver (additive note; the env var is already documented).
- `apps/oak-curriculum-mcp-streamable-http/README.md` — observability
  section refreshed if it cites release shape.
- `.agent/memory/active/distilled.md` and napkin — record the pattern
  if WS0's process-gap finding generalises.

### 4.3 Cross-references in queued / active plans

Update plans that name release-identifier shape (the L-8 lane in
`active/sentry-observability-maximisation-mcp.plan.md` is the likely
candidate) so they point at the amended ADR-163 section rather than
re-stating the rule.

---

## WS5 — Quality Gates

> See [Quality Gates component](../../templates/components/quality-gates.md)

```bash
pnpm clean && \
pnpm sdk-codegen && \
pnpm build && \
pnpm type-check && \
pnpm doc-gen && \
pnpm lint:fix && \
pnpm format:root && \
pnpm markdownlint:root && \
pnpm test && \
pnpm test:e2e && \
pnpm smoke:dev:stub
```

Exit 0, no filtering. Any failure is a WS2 regression and gets fixed
before WS6 begins (no warning toleration per
`.agent/rules/no-warning-toleration.md`).

---

## WS6 — Adversarial Review (POST-execution)

> See [Adversarial Review component](../../templates/components/adversarial-review.md)

Reviewers fire against the landed code AND deployed-state evidence:

- `sentry-reviewer` — does the implemented shape match the vendor-
  canonical idiom captured in WS0 by the same reviewer? Are Debug-IDs +
  release + deploy correctly threaded? Does the plugin configuration
  fail-fast on release-name mismatch?
- `docs-adr-reviewer` — does the ADR-163 amendment state both
  decisions completely? Are all touched docs internally consistent? Is
  the process-gap finding (§0.1 #3) recorded in a way that prevents
  recurrence (cross-resolver contract test named as the gate)?
- `release-readiness-reviewer` — preview AND production attribution
  proven end-to-end via Sentry MCP `find_releases` + `search_events`
  AND cancellation rule proven by either a captured cancellation event
  or a controlled rehearsal. GO / GO-WITH-CONDITIONS / NO-GO.

Document findings inline below this section. Acceptances and
rejections recorded with rationale per principles §Reviewer findings.

---

## Risk Assessment

> See [Risk Assessment component](../../templates/components/risk-assessment.md)

| Risk                                                                                                   | Mitigation                                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Branch URLs change shape if the Vercel project is renamed or migrated to a new domain.                 | Resolver extracts leftmost host label only; consistent across `*.vercel.app` and `*.vercel.thenational.academy`. Document the assumption in TSDoc and ADR amendment.                    |
| Branch URLs exceed Sentry's 200-char release-name limit on long branch names.                          | Reuse the existing `SENTRY_RELEASE_NAME_PATTERN` validation in both resolvers; fail-fast if exceeded so the diagnostic surfaces at build time, not at Sentry-ingest time.               |
| Forking a branch (or copy-paste branches across forks) produces colliding branch-URL hosts in Sentry.  | Vercel branch URLs are per-project; collision requires same project + same branch name, which is the same logical release line. Document and accept; do not overengineer for this case. |
| Production cancellation script regresses (file move / rename / vercel.json drift).                     | WS3.5 deletes the workspace shim and re-points `vercel.json` directly at the canonical script — no shim left to drift against. ADR-163 amendment (WS3.4) names the canonical path; the next preview deploy proves the wiring (Vercel itself is the gate). Any future move/rename is caught by Vercel's deploy probe AND by `dependency-cruiser` / `knip` if it leaves an orphaned file. |
| WS3 rewrite changes script behaviour silently (unit-test gaps let a buggy semver comparison ship).     | One unit test per row of the §Truth Tables / Production build cancellation table; tests assert exit code AND stream output AND (for the branch-gate row) that no I/O occurred. `semver.lte` is the canonical comparator — the rewrite delegates correctness to a well-tested external package rather than re-deriving it. |
| Adding `semver` as a workspace dependency drags in deep transitive risk.                               | `semver` is a tiny, single-purpose package maintained by the Node.js team; it is already in many transitive dep chains. Verify with `pnpm why semver` post-install; if the resolved version aligns with an existing transitive copy, deduplication is automatic.                                                |
| Renaming/deletion of obsolete resolver branches breaks downstream consumers we have not enumerated.    | Run the full quality-gate chain (WS5) including build, type-check, lint, knip, dependency-cruiser, and tests across all workspaces.                                                      |
| End-to-end Sentry verification (WS6) cannot be run because no fresh preview deploy has shipped post-fix. | Trigger a preview deploy explicitly (push a no-op commit on the working branch) before invoking release-readiness-reviewer; verification requires real Sentry data, not local rehearsal. |
| Owner-direction recording happens in this plan body but not in ADR-163 promptly enough.                | WS0 lands the ADR amendment as its first artefact, in a single commit, before WS1 starts. No code changes precede the amendment.                                                         |

---

## Foundation Alignment

> See [Foundation Alignment component](../../templates/components/foundation-alignment.md)

- **Cardinal Rule** (`.agent/directives/principles.md`): not directly
  applicable (no schema-derived types here), but the same _spirit_:
  one source of truth, resolved once, consumed unchanged. The cross-
  resolver contract test is the structural guarantee.
- **Owner direction beats plan**: the WS0 amendment records the owner
  direction explicitly so future contributors know the option space is
  closed.
- **Strict and complete**: no fallback shapes; the chosen contract is
  total per the truth tables.
- **Replace, don't bridge** (`.agent/rules/replace-dont-bridge.md`): the
  obsolete `preview-<slug>-<sha>` shape and the `slugifyBranch` helper
  are deleted in the same commit they stop being used. Old-shape test
  assertions are atomically replaced by new-shape assertions in WS1
  (no transitional dual-spec coexistence).
- **No shims, no hacks, no workarounds** (`.agent/directives/principles.md`
  §Cardinal Rule of This Repository) + **Don't extract single-consumer
  abstractions** (§Architectural Decision Rules): WS3.5 deletes the
  `apps/.../build-scripts/vercel-ignore-…mjs` shim and re-points
  `vercel.json` directly at the canonical script. The shim was a
  single-consumer indirection with no behaviour of its own; it created
  a wiring drift surface that would otherwise need a configuration-
  parity test. Removing it removes the surface.
- **Test real behaviour, not implementation details**
  (`.agent/directives/testing-strategy.md`): no wiring integration test
  is added for the `vercel.json` → script linkage. Once the shim is
  gone, the only meaningful gate is Vercel's own deploy probe. A
  configuration-parity test would assert syntax, not behaviour.
- **No warning toleration** (`.agent/rules/no-warning-toleration.md`):
  any ESLint/tsc/vitest warnings introduced by the rewrite are
  escalated and fixed in WS2/WS5.
- **TDD at all levels** (`.agent/directives/testing-strategy.md`): WS1
  RED is non-negotiable; WS2 GREEN cannot start until WS1 tests are
  committed and demonstrably failing for the right reason.
- **Schema-first** (`.agent/directives/schema-first-execution.md`): not
  directly applicable, but the principle of "single source, consume
  unchanged" informs the contract-tested-equivalent-resolvers choice.
- **Documentation everywhere**: TSDoc on every changed symbol;
  `observability.md`, `sentry-deployment-runbook.md`,
  `vercel-environment-config.md` updated; ADR-163 amended in the same
  workstream as code.

---

## Documentation Propagation

> See [Documentation Propagation component](../../templates/components/documentation-propagation.md)

| Surface                                                                              | Update                                                                                          |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `docs/architecture/architectural-decisions/163-…release-identifier….md`              | First amendment (WS0 — landed): per-environment release identifier truth table + initial §10 cancellation rule + reviewer dispositions. Second amendment (WS3): §10 re-amendment matching the simplified rule + asymmetric input-resolution rationale + canonical-`semver` reference. |
| `packages/core/build-metadata/build-scripts/vercel-ignore-production-non-release-build.mjs` | Rewrite (~205 → ~50 lines) using `semver.lte`; branch gate added; asymmetric current/previous handling. Wire-format unchanged. (Or, if WS3.5 fallback path is taken, file is moved into `apps/oak-curriculum-mcp-streamable-http/build-scripts/` instead — ADR amendment captures the actual landed location.) |
| `packages/core/build-metadata/build-scripts/vercel-ignore-production-non-release-build.unit.test.mjs` | Test cases rewritten one-per-truth-table-row (5 rows). Old fail-open-trade-off cases deleted.   |
| `packages/core/build-metadata/package.json`                                          | Add `semver` runtime dependency. (Moves to `apps/oak-curriculum-mcp-streamable-http/package.json` if WS3.5 fallback path is taken.) |
| `apps/oak-curriculum-mcp-streamable-http/build-scripts/vercel-ignore-production-non-release-build.mjs` | **Deleted** in WS3.5 (shim with no behaviour of its own; collapses single-consumer abstraction per principles). Sibling `*.unit.test.mjs` (if any) deleted alongside. |
| `apps/oak-curriculum-mcp-streamable-http/vercel.json`                                | `ignoreCommand` re-pointed to the canonical script's path (preferred: `node ../../packages/core/build-metadata/build-scripts/vercel-ignore-production-non-release-build.mjs`; fallback: original `./build-scripts/…` if canonical script is relocated under WS3.5 fallback). |
| `packages/libs/sentry-node/src/types.ts`                                             | `SentryConfigEnvironment` gains `readonly VERCEL_BRANCH_URL?: string` (WS1 — type-only enabler with TSDoc naming the canonicalisation follow-up). |
| `packages/libs/sentry-node/package.json`                                             | Add `@oaknational/build-metadata` as a `devDependency` (WS1 — `libs ← core` edge for cross-resolver contract test). |
| `apps/oak-curriculum-mcp-streamable-http/docs/observability.md`                      | Release resolution section rewritten against amended ADR; both truth tables included.           |
| `docs/operations/sentry-deployment-runbook.md`                                       | Example identifiers updated; cancellation rule explicit.                                        |
| `apps/oak-curriculum-mcp-streamable-http/docs/vercel-environment-config.md`          | Note that `VERCEL_BRANCH_URL` is consumed by the Sentry release resolver.                       |
| `apps/oak-curriculum-mcp-streamable-http/README.md`                                  | Observability section refreshed if it cites release shape.                                      |
| `.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md`    | L-8 lane references the amended ADR section instead of restating the rule.                      |
| `.agent/memory/active/distilled.md` + napkin                                         | Pattern recorded if WS0's process-gap finding generalises.                                      |
| Any new directive or rule introduced to prevent ADR-vs-implementation drift recurring | Filed under `.agent/rules/` or `.agent/directives/` per its scope; named in the ADR amendment. |

---

## Follow-up Work (deferred — out of scope for this plan)

These items are surfaced as direct architectural consequences of WS1's
type-system enabler. They are NOT in scope for this plan (YAGNI — solve
the canonicalisation only when there is a third consumer or a
demonstrated drift cost), but they are recorded here so the deferral is
visible and the trigger conditions are explicit. Per principles, no
stub plan file is created — the trigger conditions ARE the plan.

1. **Canonicalise `ReleaseEnvironmentInput` into `@oaknational/env`.**
   Today both `BuildTimeReleaseEnvironmentInput`
   (`packages/core/build-metadata/src/build-time-release-types.ts`)
   and `SentryConfigEnvironment`
   (`packages/libs/sentry-node/src/types.ts`) declare overlapping
   subsets of release-relevant Vercel env vars (`VERCEL_ENV`,
   `VERCEL_BRANCH_URL`, `VERCEL_GIT_COMMIT_SHA`, `APP_VERSION` /
   `APP_VERSION_OVERRIDE`). After WS2 lands, the cross-resolver
   contract test will be the structural guarantee of behavioural
   parity, but the _type_ duplication remains.

   - **Trigger**: a third consumer of release-resolution env-var
     shapes is introduced, OR a drift between the two declarations is
     observed in a code review or linter run.
   - **Action when triggered**: extract a shared `releaseEnvSchema`
     into `packages/core/env/src/` (alongside the existing
     `sentryEnvSchema` etc.); have both `BuildTimeReleaseEnvironmentInput`
     and `SentryConfigEnvironment` derive their release-env subsets
     from it via TypeScript `Pick<>` or schema composition.
   - **Cost of deferral**: one optional field declared in two
     locations. Minimal as long as the cross-resolver contract test
     passes (the test catches behavioural divergence; the duplication
     is purely declarative).
   - **TSDoc reference**: WS1 §1.0 adds a TSDoc note on the new
     `VERCEL_BRANCH_URL` field naming this follow-up so any future
     contributor reading the type sees the deferral and its trigger.

---

## Consolidation

After WS6 completes and quality gates pass, run `/jc-consolidate-docs`
to graduate any settled patterns, rotate the napkin, and update the
practice exchange.

---

## Dependencies

**Blocking**: none. All inputs (ADR-163, both resolvers, the build
plugin, the cancellation script + tests, the verified Sentry tooling,
the `VERCEL_BRANCH_URL` env-var schema) are present in the repo today.

**Related Plans**:

- `.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md`
  — landed the diverging build-time resolver under L-8; this plan
  corrects the divergence without unwinding L-8's broader work.
- `.agent/plans/observability/current/multi-sink-vendor-independence-conformance.plan.md`
  — downstream consumer of release attribution; benefits from a single
  release identifier across both build and runtime sinks.
- `.agent/plans/observability/future/deployment-impact-bisection.plan.md`
  — depends on correct release-to-deploy attribution to function; this
  plan unblocks that downstream value.
