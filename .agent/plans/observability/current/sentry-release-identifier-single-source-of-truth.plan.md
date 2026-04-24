---
name: "Sentry Release Identifier — Single Source of Truth"
overview: >
  Land ADR-163's release-identifier discipline as a true single source of
  truth (one resolver, not two with a referee), and land the simpler
  production-build-cancellation rule, both proven end-to-end. (1) COLLAPSE
  to ONE resolver in `@oaknational/build-metadata` — `resolveRelease(input)`
  — that produces the canonical release identifier for every environment:
  production = root `package.json` semver; preview = the `VERCEL_BRANCH_URL`
  host (e.g. `poc-oak-open-curriculum-mcp-git-feat-otelsentryenhancements`);
  development = same branch-URL shape locally if available else
  `dev-<shortSha>`. `@oaknational/sentry-node`'s `resolveSentryRelease`
  becomes a thin adapter that delegates to the core resolver — no separate
  algorithm, no cross-resolver contract test, no algorithm duplication to
  drift. New runtime dependency `libs ← core` (`sentry-node` →
  `build-metadata`), allowed by dep-cruise. (2) Builds on `main` MUST be
  cancelled unless the commit advances the root `package.json` semver —
  i.e. only semantic-release commits trigger a production deploy. WS3
  rewrites the cancellation script (~50 lines, canonical `semver` package,
  branch gate added, asymmetric current/previous input handling),
  re-amends ADR-163 §10, AND relocates the canonical script INTO the
  consuming app workspace (`apps/oak-curriculum-mcp-streamable-http/build-scripts/`)
  while deleting the existing shim. Single-consumer script lives where
  it's consumed; `vercel.json` keeps its existing `./build-scripts/...`
  path; no upward path traversal; no Vercel deploy-probe contingency.
derived_from: feature-workstream-template.md
foundational_adr: "docs/architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md"
related_plans:
  - ".agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md (L-8 lane that landed the diverging build-time resolver)"
  - ".agent/plans/observability/current/multi-sink-vendor-independence-conformance.plan.md (downstream consumer of release attribution)"
todos:
  - id: ws0-amend-adr-and-document-direction
    content: "WS0 (DECIDE → DOCUMENT): owner direction collapses the option space (semver for prod, branch-URL for preview, build-cancellation outside semantic-release on main). Land an ADR-163 amendment that records both rules with full truth tables BEFORE WS1 begins. Run assumptions-reviewer + sentry-reviewer + architecture-reviewer-fred against the proposed amendment."
    status: completed
  - id: ws1-pre-flight-audit
    content: "WS1 (PRE-FLIGHT AUDIT): exhaustively enumerate every consumer of the obsolete `preview-<slug>-<sha>` shape and the `slugifyBranch` helper across code, tests, and docs (`rg 'preview-' --type ts --type tsx --type md` etc.). Confirmed-known consumers (will be widened by the audit): `packages/core/build-metadata/tests/build-time-release.unit.test.ts`, `packages/libs/sentry-node/src/config.unit.test.ts`, `packages/libs/sentry-node/src/config-resolution.unit.test.ts`, `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-build-plugin.unit.test.ts`, `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-configured-build-gate.unit.test.ts` and its source `sentry-configured-build-gate.ts`, `apps/oak-curriculum-mcp-streamable-http/build-scripts/run-sentry-configured-build.ts`, `packages/core/build-metadata/tests/build-info.unit.test.ts`, `apps/oak-curriculum-mcp-streamable-http/src/runtime-config.ts`, `apps/oak-curriculum-mcp-streamable-http/src/env.ts`, `apps/oak-curriculum-mcp-streamable-http/src/security-config.ts`, `apps/oak-curriculum-mcp-streamable-http/docs/observability.md`, `apps/oak-curriculum-mcp-streamable-http/docs/deployment-architecture.md`, `apps/oak-curriculum-mcp-streamable-http/docs/vercel-environment-config.md`, `docs/operations/sentry-deployment-runbook.md`, `docs/operations/sentry-cli-usage.md`. Output: a concrete deletion/edit checklist that drives WS2/WS3 — execution does NOT proceed until the audit is complete and the checklist is reviewed."
    status: completed
  - id: ws2-collapse-and-implement
    content: "WS2 (COLLAPSE + IMPLEMENT): land the architecture in a SINGLE commit (no committed RED state — `*.unit.test.ts` files cannot be red on commit per repo pre-commit hook). Steps: (a) Define `ReleaseInput` type and `resolveRelease(input)` function in `@oaknational/build-metadata` per the §Truth Tables. Replace `resolveBuildTimeRelease`'s body with delegation to `resolveRelease`. (b) Add `@oaknational/build-metadata` as a runtime `dependency` of `@oaknational/sentry-node`. Make `SentryConfigEnvironment extends ReleaseInput` (structural composition). Reduce `resolveSentryRelease` to a thin adapter that delegates to `resolveRelease` and re-maps `ReleaseError` → `ObservabilityConfigError`. (c) Per the WS1 audit checklist, atomically replace EVERY old-shape `preview-<slug>-<sha>` assertion with branch-URL-host assertions; delete `slugifyBranch` and its tests; delete obsolete `preview_branch_sha` from the `BuildTimeReleaseSource` union; rename or repurpose the `missing_branch_in_preview` error kind to `missing_branch_url_in_preview`. (d) Correct `isValidReleaseName` to MATCH Sentry's documented denylist EXACTLY (no newlines, no tabs, no `/`, no `\\`, not exact `.`, not exact `..`, not exact single space, ≤200 chars) — drop any Oak-local additions OR explicitly mark them as Oak-local tightening (decision recorded in TSDoc). (e) Remove or update consumers identified in WS1 audit (sentry-build-plugin, sentry-configured-build-gate, build-info.unit.test.ts, etc.). All tests pass. LANDED: WS2 §2.0 in a4e8facb (resolveGitSha module split); WS2 §2.1-§2.7 in f5a009ab (unified resolveRelease, sentry-node thin adapter, atomic test-fixture replacement, isValidReleaseName denylist alignment, snapshot-env at composition root)."
    status: completed
  - id: ws3-cancellation-rewrite-and-relocate
    content: "WS3 (REWRITE + RELOCATE): (a) Move `vercel-ignore-production-non-release-build.mjs` AND its `*.unit.test.mjs` from `packages/core/build-metadata/build-scripts/` INTO `apps/oak-curriculum-mcp-streamable-http/build-scripts/`, REPLACING the existing thin ~17-line shim AND DELETING its companion `.d.ts` declaration file. Add `semver` as a `devDependency` of the app workspace (NOT a runtime dep of build-metadata — the script is build-time tooling, not part of any published artefact). `vercel.json`'s `ignoreCommand` keeps its existing `node build-scripts/vercel-ignore-production-non-release-build.mjs` path — no upward traversal, no Vercel deploy-probe contingency, no fallback. (b) Replace the script body with a ~50-line implementation using `semver.lte` and the simpler `VERCEL_GIT_COMMIT_REF === main AND semver.lte(current, previous)` rule. Add the missing branch gate. Asymmetric handling: current undefined → SKIP DEPLOYMENT (Vercel-correct semantics: `ignoreCommand` exit 0 = skip, NOT a failed build) with loud stderr; previous undefined → continue (first build). (c) Rewrite unit tests one-per-truth-table-row (5 rows); preserve coverage of fetch-fallback recovery on resolvable previous SHA. (d) Re-amend ADR-163 §10 with the FULL retraction enumeration: drop the truth table's fail-open row, drop the `Workspace invocation shim` prose, drop `Enforcement §6 wiring integration test` + its in-text reference, update the canonical script path text to its new in-app location, retract assumptions-reviewer Disposition #5 (two-file shim no longer exists), update History."
    status: pending
    priority: next
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
**Status**: 🟢 EXECUTING — WS0, WS1, AND WS2 landed:
ADR-163 amendment + reviewer dispositions (WS0, `06bf25d7`); three-layer
pre-flight audit (WS1, read-only); `resolveGitSha` module split
(WS2 §2.0, `a4e8facb`); unified `resolveRelease` + sentry-node thin
adapter + atomic old-shape replacement + validator alignment +
composition-root snapshot-env (WS2 §2.1-§2.7, `f5a009ab`). **WS3 is
next**: relocate + rewrite the cancellation script into the consuming
app workspace + ADR-163 §10 second amendment.
**Scope**: Collapse build-time and runtime release resolution to ONE
implementation in `@oaknational/build-metadata`'s `resolveRelease`
(structural single source of truth, not contract-tested duplication);
`@oaknational/sentry-node`'s `resolveSentryRelease` becomes a thin
adapter. Replace the over-built production build-cancellation script
with a ~50-line canonical-`semver` implementation matching the simpler
ADR-163 §10 rule, RELOCATED into the consuming app workspace
(`apps/oak-curriculum-mcp-streamable-http/build-scripts/`) — single
consumer, single location, no shim, no Vercel-deploy-probe contingency.
Both correctness fixes ship under one plan because they share the same
ADR amendment surface and the same reviewer-pre-landing discipline.

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
     build time and what runtime events are tagged with. (Post-revision:
     this is now achieved STRUCTURALLY by collapsing both paths to a
     single `resolveRelease` function in `@oaknational/build-metadata`,
     not by maintaining two implementations and asserting their parity in
     a contract test. See WS2.)

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
     behaviour + **relocation of the canonical script INTO the consuming
     app workspace** (replacing the existing thin ~17-line shim) so
     `vercel.json`'s existing `./build-scripts/...` `ignoreCommand` path
     stays unchanged, no upward path traversal is required, and the
     single-consumer abstraction is collapsed at the source per
     principles (`Don't extract single-consumer abstractions`,
     `WE DON'T HEDGE`). See WS3.

Both requirements MUST end this plan as **true and proven** — proven by:
the structural single source of truth (one resolver, used by both
build-time and runtime callers via thin adapter — drift is structurally
impossible), the rewritten cancellation unit tests, the structural
elimination of cross-workspace indirection (canonical script lives in
the only consuming workspace), and end-to-end Sentry-side verification
(next preview deploy shows events tagged with the branch-URL release;
next semantic-release commit on `main` deploys to production while a
non-release commit cancels).

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
  (`packages/core/build-metadata/src/build-time-release.ts`). Post-WS2
  this becomes a thin export wrapper around the unified `resolveRelease`
  (or the rename target itself).
- `resolveSentryRelease` — pure resolver, fully unit-tested
  (`packages/libs/sentry-node/src/config-resolution.ts`). Post-WS2 this
  becomes a thin adapter (~3 lines) that delegates to `resolveRelease`
  in `@oaknational/build-metadata` and re-maps `ReleaseError` →
  `ObservabilityConfigError`. Currently the runtime resolver only honours
  `SENTRY_RELEASE_OVERRIDE` precedence and falls through to `APP_VERSION`
  — it does NOT consume `VERCEL_ENV` or `VERCEL_BRANCH_URL` for
  per-environment derivation; that capability arrives via collapse.
- `SENTRY_RELEASE_OVERRIDE` — explicit per-process override, honoured
  first by both call sites (post-collapse: by the unified resolver).
- `VERCEL_BRANCH_URL` — Vercel system env var, stable per branch (already
  schema-validated in `apps/oak-curriculum-mcp-streamable-http/src/env.ts`
  and consumed in `runtime-config.ts` for hostname allowlisting). Adding
  it to the `SentryConfigEnvironment` interface (which extends
  `ReleaseInput`) is a structural type-system change in WS2, not a
  separate type-only enabler.
- `@sentry/esbuild-plugin` — owns release registration and source-map
  upload; takes `release.name` from the build-resolved value
  (`apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-build-plugin.ts`).
  Post-collapse this consumes the SAME `resolveRelease` output as the
  runtime path — third release-consumer parity is automatic.
- `vercel-ignore-production-non-release-build.mjs` (canonical at
  `packages/core/build-metadata/build-scripts/`) + the thin ~17-line shim at
  `apps/oak-curriculum-mcp-streamable-http/build-scripts/` + canonical
  unit tests at `packages/core/build-metadata/build-scripts/` — the
  production cancellation mechanism. WS3 relocates the canonical script
  AND its unit tests INTO the app workspace (replacing the shim);
  `vercel.json` keeps its existing `./build-scripts/...` path.
- `vercel.json` `ignoreCommand` — currently `node build-scripts/vercel-ignore-production-non-release-build.mjs`.
  This string is **unchanged** by WS3 — the relocation makes the path
  resolve directly to the (now in-app) canonical script instead of via
  the shim.
- `semver` (npm) — canonical semver comparator. NOT yet a workspace
  dependency; WS3 adds it as a `devDependency` of the
  `apps/oak-curriculum-mcp-streamable-http` workspace (NOT
  `@oaknational/build-metadata` — the script is build-time tooling for
  the single consuming app, not part of any published package artefact).
- ADR-163 — the prescriptive contract this plan amends.

---

## Design Principles

1. **Structural single source of truth** — per principles §Compiler Time
   Types `Single source of truth for types` and §Code Design
   `NEVER create compatibility layers`: ONE function (`resolveRelease`
   in `@oaknational/build-metadata`) implements the algorithm; both
   build-time callers and runtime callers (via a thin adapter in
   `@oaknational/sentry-node`) delegate to it. Drift becomes
   structurally impossible — there is no second implementation to drift
   from. No contract-tested duplication, no parity referee.
2. **Decision, then code** — the ADR-163 amendment lands as the first
   artefact; tests are written against the recorded decision.
3. **Replace, don't bridge** — per `.agent/rules/replace-dont-bridge.md`:
   the obsolete `preview-<slug>-<sha>` shape is deleted (atomically,
   across every consumer surfaced by the WS1 audit), not deprecated.
4. **One algorithm, two thin adapters where input shapes differ** —
   build-time callers can pass the resolver's expected `ReleaseInput`
   directly (env vars + injected `APP_VERSION` from a `package.json`
   read). Runtime callers (`sentry-node`) have a broader
   `SentryConfigEnvironment` type that `extends ReleaseInput` so the
   subset is structural, and the adapter is a 3-line delegation.
5. **Fail fast on missing required input** — the unified resolver
   returns typed errors (`missing_branch_url_in_preview`,
   `missing_application_version`, etc.); the composition root throws on
   `err`. No silent fallbacks.
6. **Single-consumer code lives where it's consumed** — the
   cancellation script and its unit tests are relocated INTO the app
   workspace per `Don't extract single-consumer abstractions`. No
   shims, no upward-traversal paths, no Vercel-deploy-probe contingency.

**Non-Goals** (YAGNI):

- Not changing the production attribution rule (ADR-163 §3 stays:
  `VERCEL_ENV=production AND VERCEL_GIT_COMMIT_REF=main`).
- Not introducing a new release-identifier surface beyond the two named
  in owner direction (semver, branch-URL host).
- Not addressing the secondary finding that Vercel platform-layer
  timeouts do not reach Sentry — separate plan if/when prioritised.
- Not re-evaluating Sentry as the observability vendor.
- Not project-prefixing production release identifiers — bare semver
  (`1.42.0`) is org-global in Sentry, accepted as a known multi-project
  trade-off (Oak Sentry org currently has MCP and Search CLI projects;
  shared release identifiers across projects is the intended attribution
  model). Recorded here so the trade-off is explicit, not implicit.

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

**Pre-release semver on `main` is out of scope** (Wilma MINOR #9):
Oak's release pipeline does not push pre-releases (`1.2.3-rc.1`,
`1.2.3-beta.0`, etc.) to `main`; `semver.lte` would treat them as
LESS than their stable counterpart, so a pre-release on `main` would
cancel against any prior stable. The cancellation rule does the
conservative thing (skip), not the destructive thing (deploy a
prerelease as production). If Oak ever changes this discipline, this
table needs an extra row.

**Same-version re-deploy on `main` cancels** (Wilma MINOR #10): a
second build for the same `current === previous` semver hits row 3
(`current ≤ previous`) and cancels. This is intentional — same-
version re-deploys go through Vercel's redeploy UI, which bypasses
`ignoreCommand`.

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
   §1 (as written) without amendment. **Post-revision**: the
   structural fix replaces the originally-planned CI-enforced contract
   test. WS2 collapses build-time and runtime resolvers to a single
   `resolveRelease` function in `@oaknational/build-metadata`, so
   shape divergence between build and runtime is impossible by
   construction — no gate needs to assert it. This is recorded in
   WS3.4's second amendment to ADR-163 alongside the script
   relocation.

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

## WS1 — Pre-flight audit (NO CODE CHANGES)

Per principles `Strict and complete`, the WS2 atomic replacement
cannot be safely scoped without first enumerating every consumer of
the obsolete `preview-<slug>-<sha>` shape, the `slugifyBranch` helper,
and any prose that documents the old contract. WS1 produces that
checklist. **No code or tests change in WS1.**

### Why an audit is the first workstream (not a design step inside WS2)

The Tier 1 reviewer pass (2026-04-24) surfaced that the original WS1
named only two test files (`build-time-release.unit.test.ts` and
`config-resolution.unit.test.ts`) for atomic replacement. A
spot-check showed the actual consumer surface is wider:

- The runtime release-related assertions in `sentry-node` are split
  across **two** files: `config.unit.test.ts` (~31 hits) AND
  `config-resolution.unit.test.ts` (~9 hits). The first was missed.
- Three additional test files in the consuming app reference the old
  shape: `sentry-build-plugin.unit.test.ts`,
  `sentry-configured-build-gate.unit.test.ts`,
  `build-info.unit.test.ts`.
- Multiple source files reference the old shape:
  `sentry-configured-build-gate.ts`, `run-sentry-configured-build.ts`,
  `apps/.../src/runtime-config.ts`, `src/env.ts`, `src/security-config.ts`.
- Multiple docs cite the old shape:
  `docs/operations/sentry-deployment-runbook.md`,
  `docs/operations/sentry-cli-usage.md`,
  `apps/.../docs/observability.md`,
  `apps/.../docs/deployment-architecture.md`,
  `apps/.../docs/vercel-environment-config.md`.

Landing the WS2 collapse without an exhaustive audit risks orphan
references that pin the old shape after the algorithm has changed.
The audit is cheap (one repo-wide search), runs on read-only access,
and is reusable by WS4 for documentation propagation.

### 1.1 Run the audit

Execute (and capture the full output for the WS2 commit message). The
audit has THREE layers per Wilma MAJOR #4:

**Layer A — string-pattern grep (catches static references)**:

```bash
rg -n 'preview-[a-z0-9-]+-[a-f0-9]{7,40}' --type ts --type tsx --type md --type js --type mjs
rg -n '\bslugifyBranch\b' --type ts --type js --type mjs
rg -n '\bpreview_branch_sha\b' --type ts
rg -n '\bmissing_branch_in_preview\b' --type ts
rg -n 'preview-<slug>' --type md
```

**Layer B — import-site grep (catches consumers of the resolvers
themselves, even if they don't construct the old shape inline)**:

```bash
rg -n '\bresolveBuildTimeRelease\b' --type ts --type tsx --type js --type mjs
rg -n '\bresolveSentryRelease\b' --type ts --type tsx --type js --type mjs
rg -n "from\s+['\"]@oaknational/build-metadata['\"]" --type ts --type tsx --type js --type mjs
rg -n '\bResolvedBuildTimeRelease\b|\bBuildTimeReleaseEnvironmentInput\b|\bBuildTimeReleaseError\b|\bBuildTimeReleaseSource\b' --type ts --type tsx
rg -n "\bawait\s+import\(['\"\`].*build-metadata" --type ts --type tsx --type js --type mjs
```

The `await import(...)` line catches dynamic imports that Layer A's
shape-pattern scan cannot see.

**Layer C — orphan / consumer scan (catches what the greps missed)**:

```bash
pnpm knip
pnpm depcruise
```

Run these in dry-run mode against the current branch state BEFORE
WS2 starts. Capture any reports that mention `build-metadata`,
`sentry-node`, `slugifyBranch`, `preview_branch_sha`, or
`missing_branch_in_preview`. WS5 re-runs the same gates after the
collapse — the WS1 baseline is the diff target.

Plus a structural scan for the obsolete error kind name and the
`BuildTimeReleaseSource` `'preview_branch_sha'` union member.

### 1.2 Produce the audit checklist

Output a structured checklist (saved to `.agent/memory/active/` or
inline in the WS2 commit message) of the form:

```text
## Old-shape consumers — atomic-replacement checklist

### Tests (assertions to replace)
- [ ] packages/core/build-metadata/tests/build-time-release.unit.test.ts
      — N assertions of preview-<slug>-<sha> shape; replace with branch-URL-host
- [ ] packages/libs/sentry-node/src/config.unit.test.ts
      — N assertions; …
- [ ] packages/libs/sentry-node/src/config-resolution.unit.test.ts
      — N assertions; …
- [ ] packages/core/build-metadata/tests/build-info.unit.test.ts
      — N assertions; …
- [ ] apps/.../build-scripts/sentry-build-plugin.unit.test.ts
      — N assertions; …
- [ ] apps/.../build-scripts/sentry-configured-build-gate.unit.test.ts
      — N assertions; …
- [ ] (any others surfaced by the audit)

### Source files (logic that constructs/consumes the old shape)
- [ ] packages/core/build-metadata/src/build-time-release-internals.ts
      — slugifyBranch helper + resolvePreviewRelease branch
- [ ] packages/core/build-metadata/src/build-time-release-types.ts
      — preview_branch_sha union member, missing_branch_in_preview kind
- [ ] apps/.../build-scripts/sentry-configured-build-gate.ts
      — N references; …
- [ ] apps/.../build-scripts/run-sentry-configured-build.ts
      — N references; …
- [ ] apps/.../src/runtime-config.ts
      — N references; …
- [ ] apps/.../src/env.ts
      — N references; …
- [ ] apps/.../src/security-config.ts
      — N references; …
- [ ] (any others surfaced by the audit)

### Docs (prose to rewrite — drives WS4)
- [ ] docs/operations/sentry-deployment-runbook.md
- [ ] docs/operations/sentry-cli-usage.md
- [ ] apps/.../docs/observability.md
- [ ] apps/.../docs/deployment-architecture.md
- [ ] apps/.../docs/vercel-environment-config.md
- [ ] (any others surfaced by the audit)

### Memory / plan files (historical record — DO NOT EDIT)
Record matches but do not modify. Past plans and napkins describe
the historical shape; rewriting them would corrupt the record.
```

### 1.3 Acceptance criteria for WS1

- The audit checklist exists and is reviewed.
- Every search above has been run; output is captured.
- The checklist is the input to WS2.4 (atomic replacement) and WS4.2
  (docs rewrites).
- No code or test files are modified in WS1.
- No commit is required for WS1 (the checklist can be embedded in
  the WS2 commit message), OR — if the checklist is large — it
  lives at `.agent/memory/active/release-shape-audit-2026-04-24.md`
  and is referenced from the WS2 commit.

---

## WS2 — Collapse and implement (SINGLE COMMIT)

WS2 lands the architectural collapse, the new behaviour, and the
atomic replacement of obsolete shape consumers in **one commit**.
The repo's pre-commit hook runs unit tests; an in-process `*.unit.test.ts`
file cannot be committed in a RED state. The phase boundary between
"design / failing test" and "implementation / passing test" is
therefore a logical one, not a commit one. Drafting and validating
locally happens in any sequence the executor prefers; only the final
green state is committed.

### 2.0 Prerequisite — split `resolveGitSha` out of `runtime-metadata.ts` (Wilma BLOCKING)

**Why this runs first.** `packages/core/build-metadata/src/runtime-metadata.ts:1`
imports `ROOT_PACKAGE_VERSION` from `@oaknational/env`, and
`packages/core/env/src/root-package-version.ts:36` initialises that
constant via `readFileSync(ROOT_PACKAGE_JSON_URL)` at module-evaluation
time. Today, `build-time-release.ts:15` imports `resolveGitSha` from
`runtime-metadata.js` — so just importing the resolver triggers the
eager filesystem read. After WS2 §2.3 adds `@oaknational/build-metadata`
as a runtime dep of `@oaknational/sentry-node`, **every Sentry runtime
cold-start** would inherit this exposure: bundled paths where
`import.meta.url` no longer resolves to a real `package.json` four
levels up, read-only filesystems on serverless runtimes, etc., would
throw at module init **before** the `Result`-based error handling can
report the failure cleanly.

**Action.**

1. Create `packages/core/build-metadata/src/git-sha.ts` (or similar)
   containing only `resolveGitSha`, `GitShaSource`, the
   `GIT_SHA_PATTERN` regex, the `trimToUndefined` helper, and the
   `RuntimeMetadataError` type alias used by it. **No import of
   `ROOT_PACKAGE_VERSION` or `@oaknational/env`.**
2. Re-point `build-time-release.ts:15` from
   `import { resolveGitSha } from './runtime-metadata.js';` to
   `import { resolveGitSha } from './git-sha.js';`.
3. Re-point any other importers of `resolveGitSha` from
   `runtime-metadata` to `git-sha`. Identify them via the WS1
   audit's import-site grep.
4. **Do NOT** modify `resolveApplicationVersion` or its
   `ROOT_PACKAGE_VERSION` import — that path is build-time-only by
   intent and stays where it is.
5. Add a structural fitness test to
   `packages/core/build-metadata/src/release.unit.test.ts` (or the
   resolver's test file) that asserts `resolveRelease`'s import
   subgraph does NOT include `@oaknational/env`'s
   `ROOT_PACKAGE_VERSION` symbol — e.g. via a `dependency-cruiser`
   rule, OR via a small test that imports `resolveRelease` in a
   child process with a stubbed `readFileSync` that throws if
   called, and asserts the import succeeds. The structural fitness
   test is the durable guard against regression.

**Acceptance criteria for §2.0**:

- `resolveGitSha` lives in a module that has no transitive import of
  `@oaknational/env`.
- All existing callers continue to compile and pass.
- The new structural fitness test passes.

### 2.1 Define the unified resolver in `@oaknational/build-metadata`

**File**: `packages/core/build-metadata/src/build-time-release-types.ts`
(or rename to `release-types.ts` if the renaming clarifies it covers
both build-time and runtime callers).

Define the unified input and output types:

```typescript
/**
 * Subset of environment variables consumed by `resolveRelease`.
 * Both build-time callers and runtime callers (via the
 * `SentryConfigEnvironment extends ReleaseInput` pattern) supply this
 * shape.
 *
 * @remarks `APP_VERSION` is the production semver. Build-time callers
 * inject it from a `package.json` read; runtime callers pass through
 * the env-var that build-time persisted into the deploy environment.
 */
export interface ReleaseInput {
  readonly SENTRY_RELEASE_OVERRIDE?: string;
  readonly VERCEL_ENV?: string;
  readonly VERCEL_BRANCH_URL?: string;
  readonly VERCEL_GIT_COMMIT_REF?: string;
  readonly VERCEL_GIT_COMMIT_SHA?: string;
  readonly APP_VERSION?: string;
}
// Wilma MINOR #11: NO arbitrary `[key: string]: string | undefined`
// index signature. Excess-property checking is preserved so typos in
// env keys surface as compile errors, not as silent `undefined`-branch
// drift at runtime. Callers pass a typed projection of `process.env`
// (snapshotted per §2.7), not `process.env` itself.

export type ReleaseSource =
  | 'SENTRY_RELEASE_OVERRIDE'
  | 'application_version'   // production: root package.json semver
  | 'vercel_branch_url'     // preview / non-main-production: VERCEL_BRANCH_URL host (leftmost label)
  | 'development_short_sha'; // development fallback: dev-<shortSha>

export type ReleaseEnvironment = 'production' | 'preview' | 'development';

export interface ResolvedRelease {
  readonly value: string;
  readonly source: ReleaseSource;
  readonly environment: ReleaseEnvironment;
}

export interface ReleaseError {
  readonly kind:
    | 'invalid_release_override'
    | 'missing_application_version'
    | 'invalid_application_version'
    | 'missing_branch_url_in_preview'
    | 'missing_git_sha';
  readonly message: string;
}
```

Notes:

- `BuildTimeReleaseSource`'s `'preview_branch_sha'` member is **deleted**
  (obsolete shape). `BuildTimeReleaseError`'s `'missing_branch_in_preview'`
  kind is **renamed** to `'missing_branch_url_in_preview'` (the new
  fail-fast condition is missing `VERCEL_BRANCH_URL`, not missing
  `VERCEL_GIT_COMMIT_REF`).
- The legacy export aliases (`BuildTimeReleaseEnvironmentInput`,
  `BuildTimeReleaseSource`, etc.) can be retained as type re-exports
  pointing at the unified names if external callers depend on them; or
  removed if the WS1 audit confirms no out-of-tree consumers exist.

### 2.2 Implement `resolveRelease` in `@oaknational/build-metadata`

**File**: `packages/core/build-metadata/src/build-time-release.ts`
(or rename to `release.ts`).

```typescript
export function resolveRelease(
  input: ReleaseInput,
): Result<ResolvedRelease, ReleaseError> {
  // 1. SENTRY_RELEASE_OVERRIDE wins everywhere (validated against
  //    isValidReleaseName from §2.5).
  // 2. Effective environment derivation (production requires VERCEL_ENV
  //    === 'production' AND VERCEL_GIT_COMMIT_REF === 'main'; otherwise
  //    preview/development per the §Truth Tables release-identifier
  //    table).
  // 3. Per-environment derivation:
  //    - production: input.APP_VERSION (validated as semver via
  //      `semver.valid(input.APP_VERSION)`; pre-releases on `main`
  //      are NOT accepted — see §Truth Tables note on pre-release
  //      semver below).
  //    - preview: extract leftmost host label of
  //      input.VERCEL_BRANCH_URL via `new URL(input.VERCEL_BRANCH_URL)`
  //      then `.hostname.split('.')[0]`. Reject (return ReleaseError
  //      kind `missing_branch_url_in_preview`) when:
  //        * `URL` constructor throws (malformed URL)
  //        * `.hostname` is empty
  //        * `.hostname` is an IPv4 / IPv6 literal (host label = the
  //          IP, which is meaningless as a release identifier)
  //        * Resulting label fails `isValidReleaseName` (length /
  //          denylist) per §2.5.
  //      Wilma MAJOR #8: do NOT use string-split shortcuts — a hard
  //      `URL` parse is the only reliable way to handle scheme-only
  //      strings, port suffixes, and userinfo.
  //    - development: dev-<shortSha> from VERCEL_GIT_COMMIT_SHA, or
  //      branch-URL host if available locally (same URL parse
  //      discipline as preview).
  // 4. Typed errors per ReleaseError; composition root throws on err.
}

// Backwards-compatible export: build-time callers continue to call
// `resolveBuildTimeRelease`. Trivial alias.
export const resolveBuildTimeRelease = resolveRelease;
```

`SENTRY_RELEASE_OVERRIDE` validation runs once here (per §2.5);
runtime callers automatically inherit it via the adapter (sentry-reviewer
finding: this closes today's runtime-validation gap structurally).

### 2.3 Make `@oaknational/sentry-node` a thin adapter

**Files**:

- `packages/libs/sentry-node/package.json` — add `@oaknational/build-metadata`
  as a runtime `dependency` (workspace:*). Edge `libs ← core` is
  permitted by `.dependency-cruiser.mjs` (`no-core-to-libs` forbids
  the reverse only).
- `packages/libs/sentry-node/src/types.ts` — make `SentryConfigEnvironment`
  extend the shared `ReleaseInput`:

  ```typescript
  import type { ReleaseInput } from '@oaknational/build-metadata';

  export interface SentryConfigEnvironment extends ReleaseInput {
    // sentry-node-specific env vars (not consumed by resolveRelease)
    readonly SENTRY_ENVIRONMENT_OVERRIDE?: string;
    readonly SENTRY_RELEASE_REGISTRATION_OVERRIDE?: string;
    readonly APP_VERSION_SOURCE?: ApplicationVersionSource;
    readonly GIT_SHA?: string;
    readonly GIT_SHA_SOURCE?: GitShaSource;
    // … any other existing fields not in ReleaseInput
  }
  ```

- `packages/libs/sentry-node/src/config-resolution.ts` — replace
  `resolveSentryRelease`'s body with delegation:

  ```typescript
  import { resolveRelease } from '@oaknational/build-metadata';

  export function resolveSentryRelease(
    input: SentryConfigEnvironment,
  ): Result<ResolvedSentryRelease, ObservabilityConfigError> {
    const result = resolveRelease(input);
    if (!result.ok) {
      return err(toObservabilityConfigError(result.error));
    }
    return ok(toResolvedSentryRelease(result.value));
  }
  ```

  The `toObservabilityConfigError` and `toResolvedSentryRelease`
  helpers are pure, total mappers (each `ReleaseError.kind` has a
  corresponding `ObservabilityConfigError.kind`). If those error
  unions can themselves be unified, do that here as a follow-on
  simplification — not blocking.

### 2.4 Atomic replacement per the WS1 audit checklist

For every entry in the WS1 audit checklist that asserts/constructs/
references the obsolete shape:

- **Test files**: update assertions from `preview-<slug>-<sha>` shape
  to `VERCEL_BRANCH_URL`-host shape per the §Truth Tables release-
  identifier table. Test fixtures must include a `VERCEL_BRANCH_URL`
  for preview rows; for negative-path tests, omit it and assert the
  `missing_branch_url_in_preview` error kind. **No old-shape
  assertions retained as regression guards** — the new positive
  branch-URL-host assertions plus a semver `APP_VERSION` fixture
  already prove the negative.
- **Source files**: remove any branches that consume or construct the
  old shape. `slugifyBranch` is deleted (no consumers remain after
  the audit).
- **Documentation**: handled in WS4.2 per the same audit checklist.

### 2.5 Sentry release-name validator alignment

`packages/core/build-metadata/src/build-time-release-internals.ts`
currently exports `SENTRY_RELEASE_NAME_PATTERN` and
`isValidReleaseName`. Per current Sentry documentation
([Naming Releases → Release Names](https://docs.sentry.io/product/releases/naming-releases/#release-names)),
the documented denylist is:

- No newlines (`\n`).
- No tabs (`\t`).
- No forward slash (`/`).
- No backslash (`\`).
- Not exactly `.`.
- Not exactly `..`.
- Not exactly a single space.
- Length ≤ 200 characters.

Replace `isValidReleaseName` with a predicate that matches Sentry's
documented denylist **exactly**:

```typescript
export function isValidReleaseName(value: string): boolean {
  if (value.length === 0 || value.length > 200) return false;
  if (value === '.' || value === '..') return false;
  if (value === ' ') return false;
  if (/[\n\t/\\]/u.test(value)) return false;
  return true;
}
```

If Oak wants additional tightenings beyond Sentry's documented rules
(e.g. rejecting all whitespace, rejecting carriage returns), record
each addition in TSDoc as **Oak-local tightening — not Sentry-required**
so future readers can audit the divergence. Do NOT call the predicate
"verbatim" Sentry alignment if it's stricter.

Use `isValidReleaseName` to validate `SENTRY_RELEASE_OVERRIDE` and
the resolved `VERCEL_BRANCH_URL` host inside `resolveRelease`. Drop
`SENTRY_RELEASE_NAME_PATTERN` if no other consumer remains.

### 2.6 Plugin wiring sanity

`apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-build-plugin.ts`
already feeds `release.name` from the build-time resolver output. Post-
collapse, the resolver returns the new branch-URL-host string for
previews — the plugin sees this transparently. Confirm no hard-coded
`preview-` prefix assumptions remain (handled by the WS1 audit).
The default `release.inject: true` is left as-is (intentional: the
build plugin should inject the resolved release identifier into the
runtime bundle for SDK pickup parity).

### 2.7 Caller discipline — snapshot env at boundary, never mutate (Wilma MAJOR #7)

`resolveRelease` is pure per call. It takes a `ReleaseInput` shape
(structurally typed, not the live `process.env` object). Callers MUST
snapshot the relevant env vars at the boundary they care about:

```typescript
// Build-time caller (esbuild-plugin invocation):
const release = resolveRelease({
  SENTRY_RELEASE_OVERRIDE: process.env.SENTRY_RELEASE_OVERRIDE,
  VERCEL_ENV: process.env.VERCEL_ENV,
  VERCEL_BRANCH_URL: process.env.VERCEL_BRANCH_URL,
  VERCEL_GIT_COMMIT_REF: process.env.VERCEL_GIT_COMMIT_REF,
  VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA,
  APP_VERSION: process.env.APP_VERSION,
});
```

NOT:

```typescript
// FORBIDDEN — passes a live reference; subsequent mutations affect
// re-evaluations and tests that stub process.env see non-deterministic
// behaviour:
const release = resolveRelease(process.env);
```

The acceptance criterion below requires the snapshot pattern at every
call site. Lint rules can be added in WS4 if drift is observed.

### Acceptance Criteria for WS2 overall

- §2.0's prerequisite split has landed: `resolveGitSha` is in a
  module with no transitive import of `@oaknational/env`, and the
  structural fitness test guarding the import subgraph passes.
- The unified `resolveRelease` exists in `@oaknational/build-metadata`
  and returns the per-environment release identifier per the §Truth
  Tables release-identifier table.
- `resolveSentryRelease` is a thin adapter that delegates to
  `resolveRelease`.
- `@oaknational/sentry-node` lists `@oaknational/build-metadata` as a
  runtime `dependency` (workspace:*); `pnpm install` and dep-cruise
  pass.
- Every consumer of the obsolete shape from the WS1 audit checklist
  has been updated; `rg 'preview-' --type ts` returns only matches in
  memory/plan files (historical record, not modified).
- `slugifyBranch` is deleted.
- `BuildTimeReleaseSource`'s `'preview_branch_sha'` member is deleted.
- `missing_branch_in_preview` error kind is renamed to
  `missing_branch_url_in_preview`.
- `isValidReleaseName` matches Sentry's documented denylist exactly,
  or any divergence is recorded in TSDoc as Oak-local tightening.
- `resolveRelease`'s preview branch parses `VERCEL_BRANCH_URL` via
  the `URL` constructor (not string-split shortcuts) and rejects
  malformed URLs, IP-literal hosts, and empty hostnames with typed
  errors.
- `ReleaseInput` has NO arbitrary `[key: string]: string | undefined`
  index signature (Wilma MINOR #11).
- All call sites use the snapshot-env pattern from §2.7 — no caller
  passes `process.env` by reference.
- Runtime `SENTRY_RELEASE_OVERRIDE` validation parity is automatic
  (one validation in `resolveRelease`, both call sites inherit).
- **Test classification** (Wilma MINOR #15): tests that import
  `@oaknational/build-metadata` AND `@oaknational/sentry-node` AND
  app-side fixtures cross module boundaries — they belong in
  `*.integration.test.ts`, not `*.unit.test.ts`. The WS1 audit
  flags these. Where the new `resolveRelease` test imports only one
  module, it stays as `*.unit.test.ts`.
- All tests pass. WS2 commits as a single commit.

**Deterministic Validation**:

```bash
pnpm --filter @oaknational/build-metadata test
pnpm --filter @oaknational/sentry-node test
pnpm --filter oak-curriculum-mcp-streamable-http test
pnpm depcruise:check
```

---

## WS3 — Cancellation: relocate, rewrite, and amend ADR-163

WS3 lands three changes in a single commit, preceded by a
pre-landing reviewer dispatch:

0. **Pre-landing reviewer dispatch** (§3.0): draft the §3.4
   amendment text and dispatch `docs-adr-reviewer` (and
   `assumptions-reviewer` if scope warrants) BEFORE the WS3 commit.
   Same discipline as WS0.2.
1. **Relocate** the canonical cancellation script (and its unit-test
   file) from `packages/core/build-metadata/build-scripts/` into
   `apps/oak-curriculum-mcp-streamable-http/build-scripts/`,
   structurally eliminating the in-app shim by replacing it
   in-place. `semver` becomes a `devDependency` of the app workspace
   (it is build-time tooling for one consumer only). `vercel.json`'s
   `ignoreCommand` is unchanged — its existing path already resolves
   to the new canonical location.
2. **Rewrite** the script body. The current script (~205 lines)
   hand-rolls semver parsing/comparison, omits the
   `VERCEL_GIT_COMMIT_REF === 'main'` gate that §Truth Tables /
   Production build cancellation requires, and treats every git-
   resolution failure under a single fail-open clause. Replace it
   with the canonical-rule version (~50 lines using the npm `semver`
   package). Rewrite the unit tests against the simpler rule.
3. **Re-amend ADR-163 §10** with a full retraction enumeration —
   replace the truth table, drop the fail-open paragraph, drop the
   workspace-shim subsection, drop the named §6 wiring integration
   test from both the §10 prose and the top-level `## Enforcement`
   list, and update the canonical script path text.

Single commit so the script's physical location, its content, and
the ADR text describing it move atomically. There is no intermediate
state in which the ADR points to the old path, the shim has been
deleted, or the new script body executes without `semver` declared.

### 3.0 Pre-landing reviewer dispatch — DRAFT amendment text reviewed BEFORE WS3 commit (per docs-adr-reviewer rev2 M5)

**Trigger.** The §3.4 amendment is a load-bearing retraction touching
ADR-163's §1, §10, top-level `## Enforcement` list, Reviewer
Dispositions, History block, and the ADR index. The first amendment
(WS0) was protected by an analogous WS0.2 pre-landing reviewer
dispatch which caught two BLOCKING findings before they shipped. The
second amendment is at least as load-bearing as the first; the same
discipline applies.

**Action.** Before opening the WS3 commit, draft the §3.4 amendment
text inline as part of WS3's prep, then dispatch:

- `docs-adr-reviewer` — validate the 13-item enumeration against the
  current ADR-163 surface (does every retracted clause actually exist
  at the line cited? does every NEW clause cite WS2's commit hash
  correctly?).
- `assumptions-reviewer` if the amendment text introduces or revises
  ACCEPTED dispositions (it MUST cover the rev2 B2 retraction of
  Disposition #4 at minimum).

**Reviewer findings are action items** per
`.agent/directives/principles.md` §Reviewer findings. Record
acceptances/rejections inline in the amendment commit (same posture as
WS0). Do NOT open the WS3 commit until the pre-landing review is
clean — the post-WS6 review (which catches fidelity-vs-implementation)
is the wrong place to discover an incomplete enumeration, by which
point the amendment is committed and a third amendment is required.

**Why this WS exists.** The drift this entire plan repairs was caused
by a first amendment whose 9-item enumeration was incomplete.
Repeating that pattern at WS3.4 — even after expanding the enumeration
to 13 items — risks the same outcome. Pre-landing review converts the
"§Risk row 1430 promise" (executor self-checks the enumeration)
into a verified property (a fresh reviewer cross-checks it against
ADR-163's actual surface).

### 3.1 Relocate the canonical script INTO the app workspace + add `semver` as the app's devDependency

Per `Don't extract single-consumer abstractions` (`.agent/directives/principles.md`
§Refactoring) and `WE DON'T HEDGE` (§Code Quality), the script and its
unit tests live where they're consumed. There is exactly one consumer
(`apps/oak-curriculum-mcp-streamable-http/vercel.json`'s `ignoreCommand`).

Actions (single commit):

1. Move `packages/core/build-metadata/build-scripts/vercel-ignore-production-non-release-build.mjs`
   AND `packages/core/build-metadata/build-scripts/vercel-ignore-production-non-release-build.unit.test.mjs`
   INTO `apps/oak-curriculum-mcp-streamable-http/build-scripts/`.

2. The destination path already contains a thin ~17-line shim
   (`apps/oak-curriculum-mcp-streamable-http/build-scripts/vercel-ignore-production-non-release-build.mjs`,
   verified line count) that re-exports the canonical implementation.
   The relocate REPLACES the shim — net effect is one `.mjs` file and
   one `.unit.test.mjs` file in the app's `build-scripts/`, where the
   shim used to live and the canonical implementation now lives
   directly. (Per docs-adr-reviewer rev1 Mi3: prior plan-body wording
   "one-line shim" understated the replacement scope.)

3. **Delete the `.d.ts` companion file** at
   `apps/oak-curriculum-mcp-streamable-http/build-scripts/vercel-ignore-production-non-release-build.d.ts`.
   This file declares `runVercelIgnoreCommand`,
   `parseSemanticVersion`, `compareSemanticVersions`, and option
   types for the previous shim. After WS3.2's rewrite the canonical
   `.mjs` is JS-only and consumes `semver` types directly; the
   hand-rolled `parseSemanticVersion` / `compareSemanticVersions`
   helpers cease to exist. Per `.agent/directives/principles.md`
   §Refactoring `Removing unused code`, the `.d.ts` is dead and
   must be deleted in the same commit as the relocate. `knip` will
   flag it post-commit; deleting it pre-empts the gate. Per
   docs-adr-reviewer rev1 M1: leaving the `.d.ts` either ships dead
   code or breaks an unstated TypeScript consumer.

4. Add `semver` as a `devDependency` of the
   `apps/oak-curriculum-mcp-streamable-http` workspace. It is build-
   time tooling for this app only — NOT a runtime dependency, NOT a
   dependency of `@oaknational/build-metadata` (the script is no
   longer in build-metadata). `pnpm install` updates the lockfile.

5. **`vercel.json` is unchanged.** Its existing
   `"ignoreCommand": "node build-scripts/vercel-ignore-production-non-release-build.mjs"`
   string already resolves to the in-app path. No upward-traversal
   path, no Vercel-deploy-probe contingency, no fallback path.

6. Update `packages/core/build-metadata/src/index.ts` and any
   internal exports if they re-exported the script — though as a
   build-time `.mjs` it likely was never re-exported through the
   package's TypeScript surface.

### 3.2 Replace the script body with the simpler rule

**File** (now at its new location):
`apps/oak-curriculum-mcp-streamable-http/build-scripts/vercel-ignore-production-non-release-build.mjs`

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

**File** (now at its new location):
`apps/oak-curriculum-mcp-streamable-http/build-scripts/vercel-ignore-production-non-release-build.unit.test.mjs`

Replace the existing test cases with one test per row of the §Truth
Tables / Production build cancellation table (5 rows). Each test
injects `env`, `executeGitCommand` (stubbed), `readFile` (stubbed),
captured `stdout` / `stderr` streams, and asserts:

1. Returned `exitCode` (0 = skip deployment, 1 = continue).
2. The expected substring in `stdout` (continue / skip-with-version-not-incremented
   rows) or `stderr` (the unresolvable-current row).
3. For the `branch !== 'main'` row: that `readFile` and
   `executeGitCommand` were NEVER called (branch gate short-circuits
   before any I/O — assertion at the injected dependency seam, NOT
   on internal call counts).
4. For the `previous resolvable via fetch fallback` row (one of the
   `current > previous` cases): that the fetch-fallback path is
   exercised AND the resulting comparison runs correctly. **Preserve
   the existing fetch-recovery proof — recovering from shallow git
   history is meaningful behaviour, not an implementation detail.**
5. For the `previous unresolvable` row: that fetch-fallback failure
   is swallowed silently (no `stderr`) and the build continues
   (treated as "no previous to beat").

Use simple per-test stubs (queue-based fakes returning pre-seeded
outcomes in order). Do NOT build a call-count-driven mini state
machine inside the mock — per `testing-strategy.md` "KISS: No complex
mocks".

Delete the old fail-open-trade-off test cases; they describe a rule
that no longer exists.

### 3.4 Re-amend ADR-163 §10 — full retraction enumeration

Land a second amendment block in
`docs/architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md`
§10 that performs ALL of the following (per architecture-reviewer-fred
finding I1: incomplete WS3.4 amendment lists are exactly the process
gap that caused the ADR-163 §1 drift in the first place):

1. **Replace** the 5-row truth table from the first amendment with the
   one in §Truth Tables / Production build cancellation above.
2. **Drop** the "Intentionally fail-open" paragraph entirely; the
   asymmetry rationale (current → skip with stderr; previous →
   continue) replaces it.
3. **Drop** the "Workspace invocation shim" subsection from §10's
   Enforcement mechanism prose. The two-file shim no longer exists —
   the canonical script lives directly in
   `apps/oak-curriculum-mcp-streamable-http/build-scripts/`.
4. **Drop** the named Enforcement §6 wiring integration test entry
   (the file `apps/.../tests/vercel-ignore-command-wiring.integration.test.ts`
   that the first amendment promised). Drop both the §10 in-text
   reference ("Wiring integration test:" bullet) AND the entry in
   the top-level `## Enforcement` list at the bottom of the ADR.
   Add an in-text retraction rationale: _"Enforcement §6 was
   removed because the wiring drift surface it would have guarded
   was structurally eliminated by relocating the canonical script
   into the consuming app workspace (WS3.1). Per `testing-strategy.md`
   `Test real behaviour, not implementation details`, no behavioural
   test was lost — the script's unit tests at the new in-app
   location cover the rule's behaviour, and Vercel's deploy probe
   covers the wiring."_
5. **Update ALL path references** in §10's Enforcement bullets — both
   the canonical-implementation bullet AND the unit-tests bullet —
   from `packages/core/build-metadata/build-scripts/...` to
   `apps/oak-curriculum-mcp-streamable-http/build-scripts/...`. Drop
   or rewrite the unit-tests parenthetical _("The shim has no
   decision logic and therefore needs no separate unit test (the
   wiring integration test covers its existence and import
   resolution)")_ — both the shim and the wiring integration test it
   references no longer exist post-WS3. Per docs-adr-reviewer rev2 B1:
   the singular "the path" framing is exactly the drift class this
   plan repairs; enumerate ALL path occurrences atomically.
6. **Refer to `vercel.json`'s `ignoreCommand` symbolically** in §10's
   Enforcement bullet — name the wiring file
   (`apps/oak-curriculum-mcp-streamable-http/vercel.json`) and the
   field (`ignoreCommand`); do NOT quote the literal command string in
   the ADR. Note that the field value is unchanged by WS3 (previously
   resolved to the shim, now resolves directly to the canonical
   implementation). Per docs-adr-reviewer NIT N1 (rev1) and template
   §3 (`ADRs that prescribe HOW instead of WHAT`): literal command
   strings are owned by the executable file, not the ADR; copying them
   in is the same drift class this plan exists to repair.
7. **Note** that the rule is enforced via the npm `semver` package
   rather than hand-rolled comparison; names the canonical
   comparator (`semver.lte`).
8. **Retract** the assumptions-reviewer Disposition #5 recorded in
   the first amendment (the SUGGESTION about softening the two-file
   shim explanation). Either retract with a follow-up note (the
   suggestion is moot — the shim no longer exists) or move it to the
   History entry as historical context.
9. **ADD** a new dated entry to the History section recording this
   second amendment. **PRESERVE** the existing first-amendment
   History entry verbatim — it is historical record of what the
   first amendment did, including its now-superseded shim framing.
   Per docs-adr-reviewer rev2 M1: the singular "Update the History
   entry" framing risks an executor over-correcting and rewriting
   the first-amendment entry; ADR-amendment precedent (e.g. ADR-053)
   is to ADD new dated entries, not rewrite old ones. The new entry
   should: record the date, link to this plan's WS2 + WS3 commits
   by hash once landed, and note that this is the second amendment
   to ADR-163 (the first landed at commit `06bf25d7`).
10. **Retract the §1 amendment "structural fix" paragraph** (the
    paragraph naming the cross-resolver contract test as the
    "primary anti-drift gate for release-identifier equivalence").
    Replace with a one-paragraph note that the structural fix was
    implemented by collapsing both resolvers to a single
    `resolveRelease` function in `@oaknational/build-metadata`,
    with `SentryConfigEnvironment extends ReleaseInput` and
    `@oaknational/sentry-node` delegating at runtime, making
    shape divergence impossible by construction. Cite the WS2
    commit by hash once landed. Per docs-adr-reviewer rev1 B3:
    leaving §1's prose unchanged would have ADR-163 point at a
    non-existent contract test as the primary anti-drift gate.
11. **Retract Enforcement §5** (the cross-resolver contract test
    entry) from ADR-163's top-level `## Enforcement` list. Replace
    with an Enforcement note about the structural composition
    (`SentryConfigEnvironment extends ReleaseInput`) and the
    dep-cruise edge `libs ← core` as the structural gate. Per
    docs-adr-reviewer rev1 B3: the top-level Enforcement §5 entry
    is a parallel surface to §1 — both must be retracted in the
    same amendment.
12. **Retract `assumptions-reviewer` Disposition #4** (the
    ACCEPTED finding about the §10 unresolvable row as a fail-open
    trade-off). Disposition #4's quoted rationale references §10
    text being dropped by item 2 of this enumeration; without
    explicit retraction it becomes a dangling reference. Either:
    (a) retract with a note _"Disposition #4 is moot — the
    fail-open framing it confirmed has been replaced by the
    asymmetric current/previous handling in this second amendment;
    the new framing addresses the same concern (resolution-failure
    tolerance) more precisely"_; OR (b) move it under a "Retracted
    by 2026-04-24 (second amendment)" subheading. Per
    docs-adr-reviewer rev2 B2.
13. **Update the ADR index** at
    `docs/architecture/architectural-decisions/README.md` (the
    ADR-163 entry, currently reading "Accepted 2026-04-19" only)
    to flag the amendment lineage per ADR-053 precedent. Append
    `(amended 2026-04-20, 2026-04-21, 2026-04-23, 2026-04-24 §1+§10,
    2026-04-24 §10 retraction — see History block)`. Per
    docs-adr-reviewer rev2 M3: ADR-163 has had multiple amendment
    dates but the index entry shows none of them — readers
    scanning the index get no signal that the ADR has been
    substantially restructured.

### 3.5 Confirm shim elimination is structural (no further action)

The shim elimination is already accomplished by §3.1's relocation:
the previously-shim file at
`apps/oak-curriculum-mcp-streamable-http/build-scripts/vercel-ignore-production-non-release-build.mjs`
is replaced in-place by the canonical implementation. There is no
intermediate "preferred path / fallback path" decision to make —
relocation is the only path.

**Why no `vercel.json` re-point.** `vercel.json`'s
`"ignoreCommand": "node build-scripts/vercel-ignore-production-non-release-build.mjs"`
already resolves to the in-app path. After relocation that same path
resolves directly to the canonical implementation. Zero config drift,
zero Vercel-deploy-probe contingency.

**Why no replacement integration test.** Per
`testing-strategy.md` `Test real behaviour, not implementation
details` and `.agent/directives/principles.md` §Testing
`No useless tests` (_"Each test must prove something useful about
the product code. If a test is only testing the test or mocks,
delete it."_): the script's
behavioural unit tests at the new in-app location cover the rule's
behaviour; Vercel's own deploy probe covers wiring; and there is no
indirection layer left between `vercel.json` and the canonical
implementation that could drift. An integration test asserting
"`vercel.json`'s `ignoreCommand` string resolves to a file that
exists" would test configuration syntax, not behaviour.

**Architectural retraction recorded in §3.4.** The named Enforcement
§6 wiring integration test promised in the first ADR-163 amendment
(commit `06bf25d7`) is dropped in WS3.4 step 4 — its drift surface
no longer exists.

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
  ADR-163. Includes both truth tables. Single-resolver framing
  (`resolveRelease`) replaces any prior dual-resolver references.
- `apps/oak-curriculum-mcp-streamable-http/docs/deployment-architecture.md`
  — release-identifier shape diagram (if present) updated; reference
  to the in-app cancellation script path (no longer
  `packages/core/build-metadata/build-scripts/…`).
- `docs/operations/sentry-deployment-runbook.md` — example identifiers
  updated. Cancellation rule promoted to a dedicated section if not
  already present.
- `apps/oak-curriculum-mcp-streamable-http/docs/vercel-environment-config.md`
  — note that `VERCEL_BRANCH_URL` is now consumed by the unified
  `resolveRelease` function (the env var is already documented).
- `apps/oak-curriculum-mcp-streamable-http/README.md` — observability
  section refreshed if it cites release shape.
- `.agent/memory/active/distilled.md` and napkin — record the pattern
  if WS0's process-gap finding generalises.
- Any further consumer surfaced by the WS1 audit checklist —
  updated atomically in WS2's single commit (this WS4 list is the
  documentation tail; non-doc consumers belong to WS2).

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
pnpm knip && \
pnpm depcruise && \
pnpm test && \
pnpm test:e2e && \
pnpm smoke:dev:stub
```

(`pnpm knip` and `pnpm depcruise` are second-line gates that catch
any orphaned reference to the deleted `preview-<slug>-<sha>` shape,
the deleted `slugifyBranch` helper, the relocated cancellation
script, or the deleted shim. They are part of root `pnpm check`; the
plan calls them out explicitly per Wilma MAJOR #6 to prevent
"executor runs the bash block literally and skips them".)

Exit 0, no filtering. Any failure is a WS2 / WS3 regression and gets
fixed before WS6 begins (no warning toleration per
`.agent/rules/no-warning-toleration.md`).

`knip` and `dependency-cruiser` are second-line gates against missed
audit entries: any orphaned reference to the deleted
`preview-<slug>-<sha>` shape, the deleted `slugifyBranch` helper, the
relocated cancellation script, or the deleted shim must surface here
before WS6.

---

## WS6 — Adversarial Review (POST-execution)

> See [Adversarial Review component](../../templates/components/adversarial-review.md)

Reviewers fire against the landed code AND deployed-state evidence:

- `sentry-reviewer` — does the implemented shape match the vendor-
  canonical idiom captured in WS0 by the same reviewer? Are Debug-IDs +
  release + deploy correctly threaded? Does `isValidReleaseName` match
  Sentry's documented denylist (or explicitly mark Oak-local
  tightenings per WS2 §2.5)? Does `@sentry/esbuild-plugin` consume
  the unified `resolveRelease` output transparently (per WS2 §2.6)?
- `docs-adr-reviewer` — does the ADR-163 second amendment land all
  13 items in WS3.4's retraction enumeration (expanded from the
  original 9 per docs-adr-reviewer rev1 + rev2 findings)? Are all touched docs
  internally consistent (the `## Documentation Propagation` table
  is the checklist)? Is the process-gap finding (§0.1 #3) recorded
  in a way that prevents recurrence?
- `architecture-reviewer-barney` — re-validate the collapse
  architecture against `Single source of truth for types` and
  `Don't extract single-consumer abstractions`: does the landed
  code actually achieve structural single-source-of-truth, or did
  the implementation re-introduce parallel resolvers under a
  different name? Does the relocated cancellation script live
  exactly where its single consumer needs it?
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
| Branch URLs exceed Sentry's 200-char release-name limit on long branch names.                          | `isValidReleaseName` (aligned to Sentry's documented denylist in WS2 §2.5) fail-fasts at build/start time, before the string reaches Sentry ingest. |
| Forking a branch (or copy-paste branches across forks) produces colliding branch-URL hosts in Sentry.  | Vercel branch URLs are per-project; collision requires same project + same branch name, which is the same logical release line. Document and accept; do not overengineer for this case. |
| Single-resolver collapse misses a consumer of the old `preview-<slug>-<sha>` shape and ships drift.    | WS1 is a dedicated **pre-flight audit workstream** that exhaustively enumerates every consumer (code, tests, docs) via `rg` for the obsolete shape pattern AND for the `slugifyBranch` helper. Output is a structured checklist that drives WS2's atomic replacement and WS4's documentation propagation. WS5's quality-gate chain (`pnpm build && type-check && lint && knip && dependency-cruiser && test && test:e2e`) is the second-line gate. |
| Atomic single-commit WS2 means a large diff that's harder to review.                                   | WS1's audit checklist makes the blast radius visible BEFORE the commit. The commit message MUST list each affected file with a one-line rationale tied to the audit checklist. WS6 adversarial review (post-execution) explicitly inspects WS2's commit for completeness against the audit. |
| `@oaknational/sentry-node` adds `@oaknational/build-metadata` as a runtime dep, dragging eager `readFileSync` of root `package.json` into runtime via the existing `runtime-metadata.ts → @oaknational/env → ROOT_PACKAGE_VERSION` import chain. **This is real, validated against code**: `packages/core/env/src/root-package-version.ts:36` initialises `ROOT_PACKAGE_VERSION` at module-evaluation time via `readFileSync(ROOT_PACKAGE_JSON_URL)`; `runtime-metadata.ts:1` imports it; `build-time-release.ts:15` imports `resolveGitSha` from `runtime-metadata.js` — so importing the resolver triggers the eager fs read before any `Result`-based error handling runs. After WS2, every `sentry-node` consumer inherits this cold-init exposure on Vercel runtimes (read-only fs, bundled paths that don't preserve `import.meta.url`'s `../../../../package.json` resolution, etc.). | **WS2 §2.0 (NEW — must run BEFORE §2.1)** structurally splits `resolveGitSha` out of `runtime-metadata.ts` into a no-fs module (e.g. `git-sha.ts`) and re-points `build-time-release.ts:15` at the new module. `ROOT_PACKAGE_VERSION`'s eager init stays where it is (it's only consumed by `resolveApplicationVersion`, which IS used at build time intentionally — but that path is build-only). The unified `resolveRelease` MUST NOT import any module that transitively pulls `ROOT_PACKAGE_VERSION` at module-init. After the split, the only runtime side effect from importing `@oaknational/build-metadata`'s `resolveRelease` is module evaluation of pure functions. WS6 verification step explicitly probes a Vercel preview cold-start to confirm no module-init throw. |
| `@oaknational/sentry-node` runtime dep on `@oaknational/build-metadata` widens the bundle's transitive surface (zod, `@oaknational/env`, `@oaknational/result`). | Bundle size impact is bounded — `zod` is already in many transitive paths via Vercel/Next adapters. Verify with `pnpm why zod` post-install. The _security review surface_ widens, however: future changes to `@oaknational/env`'s root-version logic now affect runtime Sentry init. WS6 `release-readiness-reviewer` checks the bundle size delta as part of GO/NO-GO. |
| Production cancellation script regresses (file move / rename / vercel.json drift).                     | WS3 structurally eliminates the shim by relocating the canonical script in-place over it — no shim left to drift against. `vercel.json` is unchanged. ADR-163 amendment (WS3.4) names the canonical path; the next preview deploy proves the wiring (Vercel itself is the gate). Any future move/rename is caught by Vercel's deploy probe AND by `dependency-cruiser` / `knip`. |
| WS3 rewrite changes script behaviour silently (unit-test gaps let a buggy semver comparison ship).     | One unit test per row of the §Truth Tables / Production build cancellation table; tests assert exit code AND stream output AND (for the branch-gate row) that no I/O occurred at the injected dependency seam. `semver.lte` is the canonical comparator — the rewrite delegates correctness to a well-tested external package rather than re-deriving it. |
| `VERCEL_GIT_PREVIOUS_SHA` is stale or wrong under concurrent main builds (Wilma MAJOR #3) — `semver.lte(current, previous)` compares against the wrong baseline. Asymmetric "previous unresolvable → continue" amplifies exposure: any systematic "unresolvable previous" looks like "first build" and ALWAYS continues. | Vercel populates `VERCEL_GIT_PREVIOUS_SHA` per build invocation; on the first build of a branch it is undefined; on subsequent builds it points at the immediately-preceding commit on the same branch. Concurrency: two near-simultaneous main pushes can produce two builds where each sees the other's `previous` as either the merge-base or itself — but in either case the rule "current advances semver" is correct. The asymmetric fail-open is intentional: a missing baseline means we cannot prove non-advancement, so we continue (the worst case is one extra build, not a missed deploy). Documented in WS3.4's ADR amendment under "Asymmetric input handling". |
| Pre-release semver on `main` (`1.2.3-rc.1`) interacts unexpectedly with `semver.lte` (Wilma MINOR #9) — pre-releases sort BEFORE their release counterpart, so `semver.lte('1.2.3-rc.1', '1.2.3')` is true → cancellation when ops expected continuation. | Oak's release pipeline does NOT push pre-releases to `main` (semantic-release publishes from `main` only on stable bumps). Recorded as an ops-discipline assumption in WS3.4's ADR amendment; if violated, the cancellation rule does the conservative thing (skip), not the destructive thing (deploy a prerelease as a release). |
| Same-version re-deploy on `main` (re-running a build for the same semver) cancels (Wilma MINOR #10) — operator expectation may be "rebuild same semver", but the rule treats this as `current ≤ previous` → SKIP. | This is intentional per §Truth Tables — the rule is "advance semver to deploy". Operators wanting a same-version rebuild use Vercel's redeploy UI (which bypasses `ignoreCommand`). Documented in the WS3.4 ADR amendment + `docs/operations/sentry-deployment-runbook.md` (WS4). |
| Cross-org / cross-team Vercel project produces colliding bare-semver release identifiers in Sentry (Wilma MINOR #13) — the plan explicitly accepts bare semver for production across all Oak projects. | Residual risk is Sentry UI ambiguity, NOT silent data loss — auditable via Sentry's `project` filter. Recorded as a non-goal in §Design Principles (line 265-269) and in this Risk row. |
| ADR-163 second amendment lands in the same commit as WS3 code; cherry-pick / partial revert / commit amend breaks the "ADR says X, repo at hash Y" pairing (Wilma MINOR #14). | Standard branching discipline: WS3 lands as a single non-amended commit; cherry-picks must include the ADR change. WS3.4's amendment notes the commit hash explicitly. If a hot-fix to ADR-163 lands between WS0 and WS3, the WS3 amendment authors a three-way reconciliation paragraph in the History entry. |
| Relocating the cancellation script into the app workspace breaks Vercel's build (path resolution).    | `vercel.json`'s `ignoreCommand` already references `./build-scripts/vercel-ignore-production-non-release-build.mjs` (the in-app path). Relocate replaces the shim file in-place; the `ignoreCommand` string is unchanged. Vercel resolves from the app's `rootDirectory` exactly as today. |
| Adding `semver` as a workspace devDependency drags in deep transitive risk.                            | `semver` is a tiny, single-purpose package maintained by the Node.js team; it is already in many transitive dep chains. Verify with `pnpm why semver` post-install; if the resolved version aligns with an existing transitive copy, deduplication is automatic. |
| End-to-end Sentry verification (WS6) cannot be run because no fresh preview deploy has shipped post-fix. | Trigger a preview deploy explicitly (push a no-op commit on the working branch) before invoking release-readiness-reviewer; verification requires real Sentry data, not local rehearsal. |
| ADR-163 §10 retraction enumeration (WS3.4) is incomplete and the amendment leaves stale prose.        | WS3.4 specifies a **13-item full retraction enumeration** explicitly (expanded from an original 9-item draft after docs-adr-reviewer rev1 + rev2 caught three classes of missed retractions: §1's parallel structural-fix paragraph, the top-level Enforcement §5, the orphaned Disposition #4, the second §10 path bullet, and the ADR index entry) — the same kind of incomplete-amendment process gap that this plan's WS0 was set up to repair. WS3.0 (NEW per rev2 M5) dispatches `docs-adr-reviewer` against the proposed amendment text BEFORE landing; WS6 `docs-adr-reviewer` validates the amendment lands all 13 items post-WS3. |
| Owner-direction recording happens in this plan body but not in ADR-163 promptly enough.                | WS0 lands the first ADR amendment as its first artefact, in a single commit, before WS1 starts. The collapse decision (post-Tier-1) is recorded in the second ADR amendment in WS3, atomically with the code that implements it. |

---

## Foundation Alignment

> See [Foundation Alignment component](../../templates/components/foundation-alignment.md)

- **Single source of truth for types** (`.agent/directives/principles.md`
  §Compiler Time Types and Runtime Validation): the new `ReleaseInput` interface in
  `@oaknational/build-metadata` is the single declared shape of
  release-resolution input. `SentryConfigEnvironment extends ReleaseInput`
  in WS2 — runtime callers consume the same declared shape, not a
  parallel one. This replaces the previous "two parallel resolvers
  guarded by a contract test" framing with a structural guarantee.
- **No shims, no hacks, no workarounds** (`.agent/directives/principles.md`
  §Code Design): WS3 structurally deletes the in-app
  `vercel-ignore-…mjs` shim by replacing it in-place with the
  canonical implementation. The shim was a single-consumer
  indirection with no behaviour of its own; it created a wiring
  drift surface that would otherwise need a configuration-parity
  test. Removing it removes the surface.
- **Don't extract single-consumer abstractions**
  (`.agent/directives/principles.md` §Refactoring): WS3 collapses
  the cancellation-script abstraction by relocating it from
  `packages/core/build-metadata/build-scripts/` (zero internal
  consumers) into `apps/oak-curriculum-mcp-streamable-http/build-scripts/`
  (its single consumer). `semver` follows as the app's
  `devDependency`. No package boundary remains where none was
  earned.
- **WE DON'T HEDGE** (`.agent/directives/principles.md`
  §Code Quality): WS3.5 records exactly one path (relocate-into-app),
  not a "preferred + fallback" pair. The preferred-path /
  fallback-path framing in the prior draft was a hedge — it gave
  Vercel-deploy-probe behaviour decision authority that belongs to
  the architectural choice.
- **Owner direction beats plan**: the WS0 amendment records the owner
  direction explicitly so future contributors know the option space is
  closed. The collapse decision recorded in WS-Revision (post-Tier-1)
  closes a further sub-option space.
- **Strict and complete**: no fallback shapes; the chosen contract is
  total per the truth tables. `resolveRelease` returns `Result<...>`
  with typed error kinds rather than throwing or returning sentinels.
- **Replace, don't bridge** (`.agent/rules/replace-dont-bridge.md`): the
  obsolete `preview-<slug>-<sha>` shape and the `slugifyBranch` helper
  are deleted in the same commit they stop being used. Old-shape test
  assertions across **every consumer surfaced by the WS1 audit** are
  atomically replaced by new-shape assertions in WS2's single commit
  (no transitional dual-spec coexistence; no committed RED state in
  `*.unit.test.ts`).
- **Test real behaviour, not implementation details**
  (`.agent/directives/testing-strategy.md`): no wiring integration test
  is added for the `vercel.json` → script linkage. Once the shim is
  gone, the only meaningful gate is Vercel's own deploy probe. A
  configuration-parity test would assert syntax, not behaviour.
- **No warning toleration** (`.agent/rules/no-warning-toleration.md`):
  any ESLint/tsc/vitest warnings introduced by the rewrite are
  escalated and fixed in WS2/WS5.
- **TDD at all levels** (`.agent/directives/testing-strategy.md`): WS2
  is a single GREEN commit produced under TDD discipline locally —
  RED state is reached and verified in the working tree before the
  commit but is NOT itself committed (committing RED `*.unit.test.ts`
  files is forbidden by repo convention; see WS2 §2 framing).
- **Documentation everywhere**: TSDoc on every changed symbol;
  `observability.md`, `sentry-deployment-runbook.md`,
  `vercel-environment-config.md`, `deployment-architecture.md`
  updated; ADR-163 amended in the same commit as the code (WS3).

---

## Documentation Propagation

> See [Documentation Propagation component](../../templates/components/documentation-propagation.md)

| Surface                                                                              | Update                                                                                          |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `docs/architecture/architectural-decisions/163-…release-identifier….md`              | First amendment (WS0 — landed): per-environment release identifier truth table + initial §10 cancellation rule + reviewer dispositions. Second amendment (WS3.4): **13-item full retraction enumeration** — §10 truth-table replacement; fail-open paragraph dropped; workspace-shim subsection dropped; named §6 wiring integration test dropped from both §10 prose and the top-level `## Enforcement` list; ALL §10 path bullets (canonical impl + unit tests) updated to the new in-app location with the dependent parenthetical rewritten; `vercel.json`'s `ignoreCommand` referred to symbolically rather than quoted; `semver.lte` named as canonical comparator; **§1 amendment "structural fix" paragraph retracted** (replaced by single-resolver structural-collapse note); **top-level Enforcement §5 entry retracted** (cross-resolver contract test no longer exists post-WS2); `assumptions-reviewer` Disposition #4 + Disposition #5 retracted; new History entry ADDED (first-amendment History entry preserved verbatim). Pre-landing `docs-adr-reviewer` dispatch in WS3.0 protects the amendment. |
| `docs/architecture/architectural-decisions/README.md` (line 185, ADR-163 entry)      | Index entry updated to reflect the amendment lineage per ADR-053 precedent. Append `(amended 2026-04-20, 2026-04-21, 2026-04-23, 2026-04-24 §1+§10, 2026-04-24 §10 retraction — see History block)`. Per docs-adr-reviewer rev2 M3: the index currently shows "Accepted 2026-04-19" only despite multiple amendment dates. |
| `docs/operations/sentry-cli-usage.md`                                                | `$RELEASE` / `$VERSION` framing rewritten to per-environment shape (semver for production, branch-URL host for preview); references to "the release identifier is the same value (also the root semver)" updated to point at the unified `resolveRelease` per-environment table. Per docs-adr-reviewer rev2 M2: the runbook currently asserts `$RELEASE = "root package.json semver"` which becomes wrong for previews after WS2. |
| `packages/core/build-metadata/src/build-time-release.ts` (or new `release.ts`)       | Hosts the new single `resolveRelease` function returning `Result<ResolvedRelease, ReleaseError>`. `resolveBuildTimeRelease` becomes a re-export alias for back-compat at the package boundary. |
| `packages/core/build-metadata/src/build-time-release-types.ts`                       | Replaced by (or renamed to) the new unified `ReleaseInput`, `ReleaseSource`, `ReleaseEnvironment`, `ResolvedRelease`, `ReleaseError` types. Old `BuildTimeReleaseEnvironmentInput` deleted or aliased to `ReleaseInput`. |
| `packages/libs/sentry-node/src/config-resolution.ts`                                 | `resolveSentryRelease` collapsed to a 3-line delegation to `resolveRelease`. Old branching logic (preview/production/development arms; old `preview-<slug>-<sha>` shape) deleted. |
| `packages/libs/sentry-node/src/config.unit.test.ts`                                  | Old-shape release assertions (31 matches) atomically replaced with new-shape assertions matching the §Truth Tables / Per-environment release identifier table. |
| `packages/libs/sentry-node/src/config-resolution.unit.test.ts`                       | Old-shape release assertions (9 matches) atomically replaced with new-shape assertions. |
| `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-build-plugin.ts` + `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-build-plugin.unit.test.ts` | Audit-driven update if release-string consumption assumptions changed (third consumer of the resolver — the `@sentry/esbuild-plugin` invocation). |
| `packages/core/build-metadata/src/build-info.ts` + `packages/core/build-metadata/tests/build-info.unit.test.ts` | Audit-driven update if release-string is exposed through build-info shape. |
| `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-configured-build-gate.ts` + `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-configured-build-gate.unit.test.ts` | Audit-driven update if the configured-build gate inspects release shape. |
| `apps/oak-curriculum-mcp-streamable-http/build-scripts/run-sentry-configured-build.ts` | Audit-driven update if it references release shape. Per WS1 known-consumer list. |
| `apps/oak-curriculum-mcp-streamable-http/src/runtime-config.ts`, `src/env.ts`, `src/security-config.ts` | WS1-flagged "candidates to verify" — current refs are to `VERCEL_BRANCH_URL` for hostname allowlisting (still valid post-amendment); audit confirms no shape-related changes needed unless the audit surfaces new references. |
| `packages/core/build-metadata/src/build-time-release-internals.ts` | **Deleted** by WS2 atomic replacement — this is the `slugifyBranch` source location. Per `.agent/rules/replace-dont-bridge.md`, the file is removed in the same commit as the replacement. |
| `packages/core/build-metadata/tests/build-time-release.unit.test.ts` | Old-shape release assertions atomically replaced with new-shape assertions per the §Truth Tables. |
| `packages/libs/sentry-node/src/types.ts`                                             | `SentryConfigEnvironment extends ReleaseInput` — structural single source of truth. Old standalone declaration of overlapping env-var fields deleted. |
| `packages/libs/sentry-node/package.json`                                             | Add `@oaknational/build-metadata` as a runtime `dependency` (WS2 — sentry-node delegates to it at runtime, not just at type-check). |
| `apps/oak-curriculum-mcp-streamable-http/build-scripts/vercel-ignore-production-non-release-build.mjs` | **Replaced in-place** in WS3 — the shim is overwritten by the canonical implementation moved from `packages/core/build-metadata/build-scripts/`. Single file, single consumer, single location. |
| `apps/oak-curriculum-mcp-streamable-http/build-scripts/vercel-ignore-production-non-release-build.unit.test.mjs` | **Moved into** the app workspace from `packages/core/build-metadata/build-scripts/`. Test cases rewritten one-per-truth-table-row (5 rows). Old fail-open-trade-off cases deleted. |
| `apps/oak-curriculum-mcp-streamable-http/package.json`                               | Add `semver` as a `devDependency` (build-time tooling for this app's `ignoreCommand` only — NOT a runtime dep, NOT a dep of `@oaknational/build-metadata`). |
| `apps/oak-curriculum-mcp-streamable-http/vercel.json`                                | **Unchanged.** `"ignoreCommand": "node build-scripts/vercel-ignore-production-non-release-build.mjs"` already resolves to the in-app path; after WS3.1's relocate, that path resolves directly to the canonical implementation. |
| `packages/core/build-metadata/build-scripts/`                                        | Directory likely empty after the relocate. Delete the directory if no other build-scripts remain. |
| `packages/core/build-metadata/package.json`                                          | If `semver` was previously declared here (it was added by an earlier draft of this plan), remove it. The script is no longer in this package. |
| `apps/oak-curriculum-mcp-streamable-http/docs/observability.md`                      | Release resolution section rewritten against amended ADR; both truth tables included.           |
| `apps/oak-curriculum-mcp-streamable-http/docs/deployment-architecture.md`            | Release-identifier shape diagram (if present) updated; reference to the in-app cancellation script path updated. |
| `apps/oak-curriculum-mcp-streamable-http/docs/vercel-environment-config.md`          | Note that `VERCEL_BRANCH_URL` is consumed by the unified `resolveRelease` function (single resolver, both build-time and runtime). |
| `docs/operations/sentry-deployment-runbook.md`                                       | Example identifiers updated; cancellation rule explicit. |
| `apps/oak-curriculum-mcp-streamable-http/README.md`                                  | Observability section refreshed if it cites release shape. |
| `.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md`    | L-8 lane references the amended ADR section instead of restating the rule. |
| `.agent/memory/active/distilled.md` + napkin                                         | Pattern recorded if WS0's process-gap finding generalises.                                      |
| Any other consumer file surfaced by the WS1 pre-flight audit                         | Updated atomically in WS2's single commit per the audit checklist. |
| Any new directive or rule introduced to prevent ADR-vs-implementation drift recurring | Filed under `.agent/rules/` or `.agent/directives/` per its scope; named in the ADR amendment. |

---

## Follow-up Work (deferred — out of scope for this plan)

The WS2 collapse to a single `resolveRelease` function in
`@oaknational/build-metadata` (with `SentryConfigEnvironment extends
ReleaseInput`) resolves the previously-recorded type-duplication
follow-up in this plan's earlier draft. There is no longer a parallel
`BuildTimeReleaseEnvironmentInput` / `SentryConfigEnvironment` pair to
canonicalise — they are structurally one shape after WS2.

What remains is a smaller, optional follow-up:

1. **Move `ReleaseInput` into `@oaknational/env` if a release-env
   schema converges with the existing env schemas there.** Today
   `ReleaseInput` lives in `@oaknational/build-metadata` because that
   package owns the resolver. If at some future point
   `@oaknational/env` consolidates Vercel-env-var schemas (currently
   it hosts `sentryEnvSchema` and similar), `ReleaseInput` could be
   derived there via Zod and re-exported, with `@oaknational/build-metadata`
   importing the type rather than declaring it.

   - **Trigger**: a third Vercel-env-var schema is added to
     `@oaknational/env`, making "all Vercel-env-var schemas live in
     `@oaknational/env`" a meaningful invariant; OR a Zod-validated
     entry point for `resolveRelease` is wanted (e.g. Vercel build
     env loaded from `process.env` at the app boundary).
   - **Action when triggered**: declare `releaseEnvSchema` in
     `@oaknational/env`, derive `ReleaseInput` via
     `z.infer<typeof releaseEnvSchema>`, re-export from
     `@oaknational/build-metadata` with the existing name so call
     sites are unaffected.
   - **Cost of deferral**: one interface declared in
     `@oaknational/build-metadata` rather than `@oaknational/env`.
     Negligible — the canonical resolver lives in build-metadata
     anyway, so co-locating the input type there is defensible until
     the trigger fires.
   - **No TSDoc reference needed** — the follow-up is purely about
     where the type is declared, not what shape it has.

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
