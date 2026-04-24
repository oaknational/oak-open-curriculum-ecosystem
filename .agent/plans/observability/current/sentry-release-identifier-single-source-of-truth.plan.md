---
name: "Sentry Release Identifier — Single Source of Truth"
overview: >
  Land two co-equal proofs that ADR-163's release-identifier discipline is
  honoured end-to-end. (1) Build-time and runtime resolvers MUST agree on
  the release identifier for every environment: production = root
  `package.json` semver; preview = the Vercel branch URL host (e.g.
  `poc-oak-open-curriculum-mcp-git-feat-otelsentryenhancements`); dev =
  the same branch-URL shape locally if available else `dev-<shortSha>`.
  (2) Production builds on `main` MUST be cancelled unless the commit
  advances the root `package.json` semver — i.e. only semantic-release
  commits trigger a production deploy. The cancellation script and unit
  tests already exist; this plan adds ADR linkage, end-to-end verification,
  and the cross-resolver contract test.
derived_from: feature-workstream-template.md
foundational_adr: "docs/architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md"
related_plans:
  - ".agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md (L-8 lane that landed the diverging build-time resolver)"
  - ".agent/plans/observability/current/multi-sink-vendor-independence-conformance.plan.md (downstream consumer of release attribution)"
todos:
  - id: ws0-amend-adr-and-document-direction
    content: "WS0 (DECIDE → DOCUMENT): owner direction collapses the option space (semver for prod, branch-URL for preview, build-cancellation outside semantic-release on main). Land an ADR-163 amendment that records both rules with full truth tables BEFORE WS1 begins. Run assumptions-reviewer + sentry-reviewer + architecture-reviewer-fred against the proposed amendment."
    status: pending
    priority: next
  - id: ws1-red
    content: "WS1 (RED): write the cross-resolver contract test (build-time and runtime return identical strings for every truth-table row) and the runtime branch-URL resolver tests. Tests MUST fail because the runtime resolver does not yet read VERCEL_BRANCH_URL and the build-time preview resolver still returns preview-<slug>-<sha>."
    status: pending
  - id: ws2-green
    content: "WS2 (GREEN): rewrite resolvePreviewRelease and resolveDevelopmentRelease to consume VERCEL_BRANCH_URL host; extend resolveSentryRelease to read the same. Delete the obsolete preview-<slug>-<sha> shape. All tests pass."
    status: pending
  - id: ws3-cancellation-verification
    content: "WS3 (VERIFY EXISTING): confirm vercel-ignore-production-non-release-build.mjs is wired in vercel.json, its unit tests pass, and ADR-163 names it as the enforcement mechanism. Add an integration check that asserts the wiring is intact (script exists at the resolved path, vercel.json references it)."
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

**Last Updated**: 2026-04-23
**Status**: 🟡 PLANNING — queued for next session
**Scope**: Resolve the build-time/runtime release-identifier divergence per
owner direction (semver for prod, branch-URL for preview), and link the
already-implemented production build-cancellation script to ADR-163 as the
enforcement mechanism for "production builds only on semantic-release
commits."

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
   - A production build on `main` MUST be cancelled unless the commit
     advances the root `package.json` semver beyond the previously-
     deployed version. Merge commits that carry the previous version
     number do NOT trigger a production build; only semantic-release
     commits (which bump the version) do.
   - Mechanism is already implemented at
     `packages/core/build-metadata/build-scripts/vercel-ignore-production-non-release-build.mjs`,
     wired via `apps/oak-curriculum-mcp-streamable-http/vercel.json`'s
     `ignoreCommand`, and unit-tested at
     `…/vercel-ignore-production-non-release-build.unit.test.mjs`.
   - This plan's job for this requirement is ADR linkage + end-to-end
     verification + an integration check that asserts the wiring stays
     intact, NOT re-implementation.

Both requirements MUST end this plan as **true and proven** — proven by
unit tests (cross-resolver contract; cancellation logic), an integration
check (wiring intact), and end-to-end Sentry-side verification (next
preview deploy shows events tagged with the branch-URL release).

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
  cancellation mechanism, ALREADY implemented per the owner direction's
  requirement #2.
- `vercel.json` `ignoreCommand` — already wired to the script.
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

Already implemented; mirrored here so the plan body is the single place
both rules live during execution.

| `VERCEL_ENV`  | `VERCEL_GIT_PREVIOUS_SHA` | Current vs previous root `package.json` version | Outcome           |
| ------------- | ------------------------- | ----------------------------------------------- | ----------------- |
| not `production` | (any)                  | (any)                                           | Continue build    |
| `production`  | unset                     | (any)                                           | Continue build (first deploy) |
| `production`  | set, resolvable           | current ≤ previous                              | **CANCEL build**  |
| `production`  | set, resolvable           | current > previous                              | Continue build    |
| `production`  | set, unresolvable         | (cannot compare)                                | Continue build (with stderr warning) |

The "current ≤ previous" row is the critical one: a merge commit on
`main` carries the previous semver, so the production build is cancelled.
Only semantic-release commits (which bump the version) get through.

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

All tests MUST FAIL at the end of WS1.

> See [TDD Phases component](../../templates/components/tdd-phases.md)

### 1.1 Cross-resolver contract test

**Test**:
`packages/libs/sentry-node/tests/release-identifier-cross-resolver.contract.unit.test.ts`
(new) — table-driven; for every row in the §Truth Tables release-
identifier table, asserts that
`resolveBuildTimeRelease(env)` and `resolveSentryRelease(env)` return the
**same `value`**. Lives in `sentry-node` (downstream of `build-metadata`
in the dep graph). One test per row; one shared input fixture.

**Acceptance Criteria**:

1. Test compiles and runs.
2. Test fails for at least the preview rows (current build resolver
   returns `preview-<slug>-<sha>`; runtime returns semver).
3. No existing test breaks.

### 1.2 Build-time resolver tests

Extend `packages/core/build-metadata/tests/build-time-release.unit.test.ts`:

- Replace assertions of `preview-<slug>-<sha>` shape with branch-URL-
  host shape. New input row: `VERCEL_BRANCH_URL` set; assert resolver
  returns the leftmost label.
- New error case: `VERCEL_BRANCH_URL` missing in preview — fail-fast
  with a typed error (per principles §Fail FAST). The current
  `missing_branch_in_preview` error kind extends to cover this case (or
  a new typed error if WS0 reviewer prefers explicit naming).

### 1.3 Runtime resolver tests

Extend `packages/libs/sentry-node/tests/config-resolution.unit.test.ts`:

- New precedence rule: after `SENTRY_RELEASE_OVERRIDE`, the runtime
  resolver consults `VERCEL_BRANCH_URL` for non-production environments
  before falling back to `APP_VERSION`/semver.
- New tests for the branch-URL host extraction (leftmost label).
- New error case: preview env without `VERCEL_BRANCH_URL` — fail-fast.

### 1.4 Cancellation wiring integration check

**Test**:
`apps/oak-curriculum-mcp-streamable-http/tests/vercel-ignore-command-wiring.integration.test.ts`
(new) — asserts:

1. `vercel.json` parses, contains `ignoreCommand`, and the command
   string resolves (relative to the workspace) to the existing script
   file on disk.
2. The script file is executable (or at least invokable via `node`).
3. The script's exported `runVercelIgnoreCommand` is importable (catches
   accidental rename / move).

This protects the wiring that the existing unit tests depend on but
which they cannot themselves observe. Fails today only if the file moves
unexpectedly; once landed, it fails on any future regression.

**Acceptance Criteria for WS1 overall**:

- All new tests run and fail for the expected reason (RED).
- No existing test breaks.
- Test names clearly reference the truth-table rows they cover.

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

### 2.5 Plugin wiring sanity

`apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-build-plugin.ts`
already feeds `release.name` from the build-time resolver output. Confirm
no plugin-side change is needed beyond the resolver rewrite (the plugin
sees the new string transparently). If the plugin contains any
hard-coded assumptions about the `preview-` prefix, remove them.

---

## WS3 — Cancellation: ADR linkage and verification

The script + unit tests already exist; this workstream adds the missing
non-code linkage and the integration-level wiring proof.

### 3.1 ADR linkage

Confirmed via WS0.1 amendment §10. Cross-checked here: the amendment
must name the script by path AND link to its unit-test file by path. No
ambiguity about which file is the canonical mechanism.

### 3.2 Integration check

The wiring integration test from §1.4 lands as part of WS1 RED, passes
in WS2 GREEN (because it validates already-correct wiring); confirmed
green here.

### 3.3 End-to-end proof on next production deploy

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
| Production cancellation script regresses (file move / rename / vercel.json drift).                     | WS1.4 wiring integration test fails on any structural drift. ADR-163 amendment names the canonical path.                                                                                 |
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
  are deleted in the same commit they stop being used.
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
| `docs/architecture/architectural-decisions/163-…release-identifier….md`              | Amendment block recording both owner-direction rules + truth tables + process-gap finding.      |
| `apps/oak-curriculum-mcp-streamable-http/docs/observability.md`                      | Release resolution section rewritten against amended ADR; both truth tables included.           |
| `docs/operations/sentry-deployment-runbook.md`                                       | Example identifiers updated; cancellation rule explicit.                                        |
| `apps/oak-curriculum-mcp-streamable-http/docs/vercel-environment-config.md`          | Note that `VERCEL_BRANCH_URL` is consumed by the Sentry release resolver.                       |
| `apps/oak-curriculum-mcp-streamable-http/README.md`                                  | Observability section refreshed if it cites release shape.                                      |
| `.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md`    | L-8 lane references the amended ADR section instead of restating the rule.                      |
| `.agent/memory/active/distilled.md` + napkin                                         | Pattern recorded if WS0's process-gap finding generalises.                                      |
| Any new directive or rule introduced to prevent ADR-vs-implementation drift recurring | Filed under `.agent/rules/` or `.agent/directives/` per its scope; named in the ADR amendment. |

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
