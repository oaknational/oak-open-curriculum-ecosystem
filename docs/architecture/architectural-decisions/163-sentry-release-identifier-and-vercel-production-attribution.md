# ADR-163: Sentry Release Identifier, Source-Map Attachment, and Vercel Production Attribution

**Status**: Accepted (2026-04-19)
**Date**: 2026-04-19
**Related**:
[ADR-051](051-opentelemetry-compliant-logging.md) — OpenTelemetry emission
baseline; releases appear as a structured field on every telemetry event;
[ADR-143](143-coherent-structured-fan-out-for-observability.md) — coherent
fan-out architecture; this ADR names the release/deploy identifiers each
fan-out carries;
[ADR-159](159-per-workspace-vendor-cli-ownership.md) — per-workspace
`sentry-cli` ownership; this ADR specifies the exact CLI invocations used
for release + deploy linkage;
[ADR-160](160-non-bypassable-redaction-barrier-as-principle.md) — release
strings and deploy markers are non-PII by design, so the redaction barrier
does not apply to these identifiers, but the ADR clarifies that nothing in
this flow introduces PII;
[ADR-161](161-network-free-pr-check-ci-boundary.md) — the pipeline boundary
this ADR operationalises (Vercel deploy pipeline = network-capable; PR
checks = network-free);
[ADR-162](162-observability-first.md) — observability-first; this ADR
closes a named gap in the engineering axis (regression-detection
attribution) for the MVP criterion.

## Context

Oak's observability adapters (`@oaknational/sentry-node`; forthcoming
browser adapter per Wave 4 L-12) tag every emitted event with a release
identifier and, at deploy time, register a Sentry deploy event so
regressions can be attributed to a specific release.

As of 2026-04-19 the mechanism was **not explicitly named**. Several
surfaces had carried inconsistent or under-specified framings:

- `docs/operations/sentry-deployment-runbook.md` stated that
  `SENTRY_RELEASE` falls back to `VERCEL_GIT_COMMIT_SHA`. The runtime
  code (`packages/libs/sentry-node/src/config-resolution.ts`) actually
  falls back to the root `package.json` semver via `APP_VERSION`. The
  doc was wrong.
- `apps/oak-curriculum-mcp-streamable-http/scripts/upload-sourcemaps.sh`
  said `RELEASE` can be either the semver or the SHA.
- The L-7 lane in
  `.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md`
  used a partially-stale CLI shape (`sentry-cli releases deploys VERSION
new -e ENV` — the legacy noun-ordering; the current CLI reference
  documents `sentry-cli deploys new --release VERSION -e ENV`).
- The runtime `resolveSentryEnvironment` trusted `VERCEL_ENV` alone to
  determine whether a build is "production". Vercel's own semantics
  allow a production deploy from a non-main branch (`vercel --prod`);
  owner direction is that Oak's production attribution requires BOTH
  the Vercel environment AND the branch to agree.
- Error-handling posture per CLI step (abort vs continue) was not
  named anywhere.
- The attachment point inside the Vercel pipeline (build command vs
  npm `postbuild` vs separate orchestrator script) was not named.

This ADR records every decision with no remaining ambiguity. Every
section corresponds to a named decision; no "open question" survives
the ADR.

## Decision

### 1. Sentry release identifier = root `package.json` semver

The Sentry release identifier is the **semantic version** declared in
the repo root `package.json` (e.g. `1.5.0`), resolved at build time
from the contents of the root `package.json` file. It is not the git
SHA, not the Vercel deployment ID, not a composite value.

At runtime the SDK also tags every emitted event with this same
string via `resolveSentryRelease` in
`packages/libs/sentry-node/src/config-resolution.ts` (which already
falls back to `APP_VERSION` sourced from root `package.json`).

Sentry's own guidance: _"A release version is an identifier that
uniquely identifies the release. It can be a semver identifier, a
git commit SHA, or any other string."_ (Sentry docs,
`https://docs.sentry.io/product/releases/setup/`). Oak picks semver.

### 2. Git SHA is metadata, attached via `set-commits`

The git SHA (`VERCEL_GIT_COMMIT_SHA` at Vercel build time) is captured
and attached to the release as metadata via:

```bash
sentry-cli releases set-commits "$SEMVER" \
  --commit "oaknational/oak-open-curriculum-ecosystem@$VERCEL_GIT_COMMIT_SHA"
```

The SHA additionally surfaces on each runtime event as a **Sentry
tag**, not a context field, so that events can be filtered and
correlated by SHA in the Sentry Issues / Discover UI:

- **Tag key**: `git.commit.sha` (aligned with the OpenTelemetry
  `code.git.commit.sha` resource-attribute semantic convention).
- **Attachment mechanism**: `initialScope.tags` on the Sentry SDK
  `init(...)` call. Set once at startup, visible on every captured
  event for that process lifetime.

Rationale for tag over context: tags are indexed and searchable in
the Sentry UI; contexts display the value but are not indexed.
Correlation-by-SHA is a filtering operation, so the value must be a
tag.

### 3. Production attribution requires BOTH `VERCEL_ENV=production` AND `VERCEL_GIT_COMMIT_REF=main`

A build is considered "production" for the purpose of Sentry release +
deploy registration if and only if **both**:

- `VERCEL_ENV === 'production'`, and
- `VERCEL_GIT_COMMIT_REF === 'main'`.

Derivation table (the full truth table the runtime + build-time
scripts implement):

| `VERCEL_ENV`  | `VERCEL_GIT_COMMIT_REF` | Derived Sentry `environment` | Sentry release registration | Warning logged                                       |
| ------------- | ----------------------- | ---------------------------- | --------------------------- | ---------------------------------------------------- |
| `production`  | `main`                  | `production`                 | yes                         | no                                                   |
| `production`  | any other branch        | `preview`                    | yes (as preview)            | yes — "production_env_with_non_main_branch"          |
| `production`  | unset / empty           | `preview`                    | yes (as preview)            | yes — "production_env_with_missing_branch"           |
| `preview`     | any                     | `preview`                    | yes                         | no                                                   |
| `development` | any                     | `development`                | no — skipped by default     | no (unless `SENTRY_RELEASE_REGISTRATION_OVERRIDE=1`) |
| unset         | any                     | `development`                | no — skipped by default     | no                                                   |

Rationale: Vercel allows production deploys from non-main branches via
`vercel --prod`. Without the belt-and-braces check, a manual
production deploy from a feature branch would register as "production"
in Sentry and pollute the regression-detection signal. Treating
branch-mismatch as `preview` contains the mislabelling surface while
still producing a deploy event (so the deploy is still visible in the
timeline; it is just attributed to the safer environment).

### 4. Local-dev builds do not register Sentry releases or deploys

The release + deploy registration commands (`sentry-cli releases new`,
`set-commits`, `finalize`, `deploys new`) run **only** inside the
Vercel deploy pipeline for `preview` and `production` environments.
Local `pnpm dev` and `pnpm build` do not touch Sentry release state.

Override for UAT evidence generation: both of the following must be
set together to enable local release registration —

- `SENTRY_RELEASE_REGISTRATION_OVERRIDE=1`, and
- `SENTRY_RELEASE_OVERRIDE=<version>` (the version string to register
  and tag events with).

Setting one without the other is a startup error. Intended for UAT
against named releases and bug reproduction; not for routine dev use.

Rationale: the Sentry release manifest is the truth of what users
actually saw. Any dev-session write-back into that manifest pollutes
the regression signal. The override exists so UAT can still exercise
the full deploy-time path when needed.

### 5. One release → many deploys

A single release (semver) is expected to carry multiple Sentry deploy
events across its lifetime: typically one or more `preview` deploys
per preview build and one `production` deploy when the release
promotes to production.

Sentry's data model supports this natively — `sentry-cli deploys list
--release <version>` enumerates the deploy list for a release, and
`releases new` is treated as idempotent by the Sentry API (a second
call against an existing release returns the existing release, not an
error).

Rationale: the release identifier is immutable (a specific set of
commits bundled as version X.Y.Z); the deploy events are the timeline
of that release reaching environments. Creating a fresh release per
environment would lose the "same code, different environment"
relationship that regression attribution depends on.

### 6. Canonical release-and-deploy outcomes inside the Vercel build

> **Amendment 2026-04-21 (§L-8 WS3.1 — HOW → WHAT reframing)**
>
> The §6 mechanism specification originally listed six specific
> `sentry-cli` invocations (§6.0–§6.6) as the build-time sequence. The
> L-7 implementation realised that sequence as a four-file TypeScript
> orchestrator (`build-scripts/sentry-release-and-deploy-cli.ts` and
> friends) wrapping those CLI calls. Owner direction during L-7 close
> (recorded in `napkin.md` 2026-04-20 entry, _ADRs that prescribe HOW
> not WHAT foreclose alternatives_) named the framing as the cost of
> that lane: the ADR specified six bash invocations as if they were the
> requirement, when the actual requirement is a small set of named
> outcomes the build must reach in Sentry.
>
> §L-8 replaces the bespoke orchestrator with the vendor's first-party
> `@sentry/esbuild-plugin` running inside the MCP app's esbuild
> composition root (`apps/oak-curriculum-mcp-streamable-http/esbuild.config.ts`
> — see §7 amendment). The plugin performs every step listed in §6.0
> through §6.6 as library operations during the build; the CLI is no
> longer invoked from the Vercel Build Command.
>
> **The §6.0–§6.6 subsections are RETAINED as the outcome
> specification.** Each subsection's intent (what state Sentry must
> reach, what posture failure carries, what idempotency shape applies)
> remains authoritative. The bash command shown in each subsection is
> read as the canonical _description_ of the outcome, not the canonical
> _realisation_ of it. The plugin's configuration in
> `build-scripts/sentry-build-plugin.ts` (`createSentryBuildPlugin`)
> and the composition root that wires the plugin instance
> (`esbuild.config.ts`) carry the realisation; the unit test
> `build-scripts/sentry-build-plugin.unit.test.ts` proves the policy →
> plugin-input mapping; the Vercel preview smoke probe (§L-8 WS4/WS5)
> proves the plugin's vendor-side effects.
>
> Outcomes-to-plugin-options mapping (read alongside §6.0–§6.6 below):
>
> | §   | Outcome                                                           | `@sentry/esbuild-plugin` realisation                                                                                              |
> | --- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
> | 6.0 | Idempotent release identity — re-running same version is a no-op  | Plugin's `release.name` upsert semantics; commit attribution preserved on the original deploy's binding.                          |
> | 6.1 | Release exists in Sentry under semver                             | `release.name = $VERSION` (set in `createSentryBuildPlugin`).                                                                     |
> | 6.2 | Commit attached via explicit `org/repo@sha` form                  | `release.setCommits = { commit: $SHA, repo: 'oaknational/oak-open-curriculum-ecosystem' }` (no `auto`).                           |
> | 6.3 | Debug IDs embedded in `.js` and `.map` under `dist/`              | Plugin injects Debug IDs as a build step (vendor default behaviour).                                                              |
> | 6.4 | Source-map artefacts uploaded, keyed by Debug IDs, weak-linked    | Plugin uploads sourcemaps using the same Debug IDs; `sourcemaps.filesToDeleteAfterUpload` strips `.map` from `dist/` post-upload. |
> | 6.5 | Release finalized in the Sentry timeline                          | Plugin's `release.finalize: true`.                                                                                                |
> | 6.6 | Deploy event registered with `--release $VERSION -e $DERIVED_ENV` | `release.deploy.env = $DERIVED_ENV` (resolved from `resolveSentryEnvironment`).                                                   |
>
> Per-step error-handling postures (§6.0 abort, §6.1 abort, §6.2 warn,
> §6.3 abort, §6.4 abort, §6.5 warn, §6.6 warn) are preserved as
> _outcome severities_; the plugin surfaces step failures in its log
> output, and the build fails if any abort-posture step fails. The
> bespoke per-step exit-code branching is no longer needed because the
> plugin owns the inter-step ordering and the abort decisions follow
> from its documented behaviour rather than orchestrator code Oak
> maintains.
>
> Files deleted by §L-8 WS2.3 (now historical):
> `build-scripts/sentry-release-and-deploy.ts`,
> `build-scripts/sentry-release-and-deploy-cli.ts`,
> `build-scripts/sentry-release-and-deploy-preflight.ts`,
> `build-scripts/sentry-release-and-deploy-types.ts`,
> `build-scripts/sentry-release-and-deploy.integration.test.ts`,
> `scripts/upload-sourcemaps.sh`. The `vercel.json` `buildCommand`
> override is also removed; the workspace's default `build` script (now
> `tsx esbuild.config.ts`) carries the full sequence.

The L-7 scripts invoke the following sentry-cli commands, in order,
during the Vercel build for a commit where the ignoreCommand has
allowed the build to proceed:

```bash
# Preflight (all must pass or the script exits non-zero immediately).
#
# - VERSION = semver read from root package.json.
# - Verify VERCEL_ENV ∈ { 'production', 'preview' } (otherwise skip
#   registration unless the override pair is set — §4).
# - Compute DERIVED_ENV per §3 truth table.
# - Verify VERCEL_GIT_COMMIT_SHA is set and well-formed (7-40 hex chars).
# - Verify SENTRY_AUTH_TOKEN is set.
# - Verify dist/ exists and is non-empty.

sentry-cli releases info "$VERSION"                         # §6.0 probe

# If §6.0 exits 0: release already exists. Skip §6.1 AND §6.2 to
# preserve the original commit attribution from the deploy that first
# registered the release. (Amendment 2026-04-20.)

sentry-cli releases new "$VERSION"                          # §6.1

sentry-cli releases set-commits "$VERSION" \                # §6.2
  --commit "oaknational/oak-open-curriculum-ecosystem@$VERCEL_GIT_COMMIT_SHA"

sentry-cli sourcemaps inject dist/                          # §6.3

sentry-cli sourcemaps upload --release "$VERSION" dist/     # §6.4

sentry-cli releases finalize "$VERSION"                     # §6.5

sentry-cli deploys new --release "$VERSION" -e "$DERIVED_ENV"  # §6.6
```

Each step is specified below with its exact error-handling posture.

#### 6.0 `releases info` — **idempotency probe** (amendment 2026-04-20)

Probes whether the release with this version already exists in Sentry.
If exit 0 (release exists), §6.1 and §6.2 are SKIPPED entirely — the
release was registered by an earlier build and its commit attribution
must not be overwritten. If non-zero (not found), the full sequence
continues through §6.1 and §6.2. This probe supersedes the
original "abort on failure" framing for §6.1 because Vercel manual
redeploys of the same commit would otherwise cause a hard abort where
the intent (per §5) is idempotence at the release identity.

#### 6.1 `releases new` — **abort on failure** (skipped when §6.0 reports existing)

Creates the release. Failure modes: auth-token invalid; network
unreachable; Sentry region mismatch. If reached (i.e. §6.0 found no
existing release), failure here means the subsequent steps have
nothing to attach to; the build MUST abort.

#### 6.2 `releases set-commits` — **skipped when §6.0 reports existing**

If §6.0 found the release already exists, set-commits is SKIPPED —
re-running it with a different `VERCEL_GIT_COMMIT_SHA` would OVERWRITE
the existing release's commit attribution and orphan the prior SHA
from regression traceability. The first deploy's attribution wins.
When §6.2 does run (new release), the posture remains continue-on-
failure (warn): losing commit attribution on a fresh release doesn't
break symbolication or the release identifier.

#### 6.2 `releases set-commits --commit` — **continue on failure (warn)**

Associates the build-commit with the release. Uses the **explicit
`--commit` form**, not `--auto`, so the repo identifier is pinned in
the command rather than inferred via the Sentry GitHub integration.
Failure here loses commit-level attribution but does not break
symbolication or the release identifier; log a warning and continue.

Note: the explicit `--commit org/repo@sha` form still requires the
Sentry GitHub integration to be installed in the Sentry org for
suspect-commits and PR-level attribution to be fully resolved. Without
the integration, the SHA string is still attached to the release but
deep links into GitHub are unavailable. Oak has the integration
installed (as of 2026-04-19); this is a latent dependency that would
degrade gracefully if the integration is uninstalled.

#### 6.3 `sourcemaps inject` — **abort on failure**

Embeds Debug IDs into each `.js` and its matching `.map` under
`dist/`. Debug IDs are the **primary symbolication key** at event
ingestion time (Sentry docs,
`https://docs.sentry.io/platforms/javascript/sourcemaps/troubleshooting_js/debug-ids/`).
Without this step, uploaded source maps would have no key to match
against runtime events and symbolication would silently fail. The
existing wrapper script
(`apps/oak-curriculum-mcp-streamable-http/scripts/upload-sourcemaps.sh`)
already performs this step and grep-checks that at least one
`//# debugId=` comment is present in `dist/` after injection; this
post-condition check is retained.

#### 6.4 `sourcemaps upload --release` — **abort on failure**

Uploads the artefact bundle, keyed by the Debug IDs from §6.3, and
associates it with the release `$VERSION`. The `--release` flag
creates a **weak association** that drives the Releases → Source
Maps surface in the Sentry UI. Debug IDs are sufficient for
symbolication without `--release`; the weak association is retained
because it is already in the existing wrapper script and provides UI
navigability for humans investigating a specific release. Failure
means symbolication will not work; abort.

#### 6.5 `releases finalize` — **continue on failure (warn)**

Marks the release as released in the Sentry timeline. Per Sentry docs
(`https://docs.sentry.io/cli/releases/#finalizing-releases`) this
remains part of the canonical flow even with Debug-ID-keyed source
maps — Debug IDs resolve symbolication at event time, whereas
`finalize` anchors release health and the release timeline
semantically. Failure here leaves the release in an "unfinalised"
state in the Sentry UI but does not affect symbolication, event
tagging, or deploy creation; log a warning and continue.

#### 6.6 `deploys new --release ... -e` — **continue on failure (warn)**

Registers a deploy event against `$VERSION` for `$DERIVED_ENV`. This
is the current documented CLI noun form
(`https://docs.sentry.io/cli/releases/#creating-deploys`) and is the
form Oak uses. The legacy `sentry-cli releases deploys VERSION new -e
ENV` form is rejected — one form only, to eliminate drift between
scripts and docs.

Failure here loses the deploy-event timeline entry but does not break
release or event tagging; log a warning and continue. The build still
succeeds, so traffic can still promote to the new deployment.

### 7. Pipeline attachment inside Vercel

> **Amendment 2026-04-21 (§L-8 WS3.1)**
>
> The L-7 attachment shape (workspace `build:vercel` script invoking a
> bespoke `sentry-release-and-deploy-cli.ts` orchestrator after `pnpm
build`) is replaced by an esbuild composition root at the workspace
> root: `apps/oak-curriculum-mcp-streamable-http/esbuild.config.ts`.
>
> The composition root is invoked by the workspace's default `build`
> script as `tsx esbuild.config.ts`. It reads `process.env`, asks the
> two app-local pure factories (`createMcpEsbuildOptions` for the
> Oak-owned build contract; `createSentryBuildPlugin` for the
> registration intent per §3 / §4 / §6), and conditionally injects
> `@sentry/esbuild-plugin` into the esbuild build options. The plugin
> performs the §6.0–§6.6 outcomes during the build itself (no
> post-build CLI step). `vercel.json` no longer carries a
> `buildCommand` override; Vercel runs the workspace's `build` script
> directly.
>
> Pipeline shape (§L-8 onwards):
>
> ```text
> build command (Vercel default):
>   pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http run build
>
> workspace build script:
>   node ../../scripts/validate-root-application-version.mjs
>     && tsx esbuild.config.ts
> ```
>
> Rationale for the inversion: the `@sentry/esbuild-plugin` operates
> inside the build, not after it, so the per-step abort-vs-continue
> postures the bespoke orchestrator implemented are now the plugin's
> own behaviour. There is nothing left to chain in `&&` form; the
> co-location problem the orchestrator solved no longer exists. The
> composition root is the documented seam where `process.env` enters
> the build (lint exception recorded in
> `apps/oak-curriculum-mcp-streamable-http/eslint.config.ts`); the two
> factories the composition root calls take env as a typed parameter so
> all policy logic stays test-driven (proven by
> `build-scripts/sentry-build-plugin.unit.test.ts` and
> `build-scripts/esbuild-config.unit.test.ts`).
>
> The pre-amendment text below is preserved as historical record of the
> L-7 attachment shape.

Vercel does not expose pre-build or post-build platform hooks; all
steps run inside the **Build Command**. The L-7 scripts attach by
extending the MCP workspace's build command (via `vercel.json` or the
Vercel Project Settings build-command override) to invoke an
orchestrator script:

```text
build command: pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http run build:vercel
```

…where `build:vercel` (authored by L-7) runs the sequence:

1. `pnpm build` (tsup → `dist/`).
2. The §6 sentry-cli sequence, via a TypeScript orchestrator invoked
   with `tsx` (`build-scripts/sentry-release-and-deploy-cli.ts` in the
   MCP workspace). Amendment 2026-04-20 — originally authored as a
   single bash file; implemented as a four-file TypeScript module
   (types + preflight + orchestrator + CLI composition root) for
   unit-testability under ADR-161 (no subprocess spawn in tests).

This keeps the source-map upload + release registration co-located
with the build in a single Vercel Build-Command step, which is the
only pipeline point where `dist/` exists and `SENTRY_AUTH_TOKEN` is
available. There is no separate "postbuild" npm hook because Vercel
does not run any npm lifecycle hooks after its build command; chaining
the sequence into one Vercel command is the reliable shape.

Rationale for a dedicated orchestrator script rather than inlining the
commands into a single `pnpm build` pipe-chain: error handling per
§6.1–§6.6 (abort vs continue) requires per-step exit-code inspection
that a bash `&&` chain cannot express cleanly. The orchestrator
script owns the per-step posture; `pnpm build` continues to mean
"tsup build only", keeping local builds fast and side-effect-free.

### 8. Runtime contract changes required

The L-7 implementation will add the following to
`packages/libs/sentry-node/src/types.ts#SentryConfigEnvironment`:

- `VERCEL_GIT_COMMIT_REF?: string` — consumed by a new
  `resolveSentryEnvironment` branch-check per §3.
- `SENTRY_RELEASE_REGISTRATION_OVERRIDE?: string` — gates the
  local-override path in §4.

`resolveSentryEnvironment` will be extended to implement the §3 truth
table. `resolveSentryRelease` is unchanged (already returns the root
`package.json` semver via `APP_VERSION` fallback).

### 9. GitHub release workflow — already correctly wired

The repo's existing `.github/workflows/release.yml` uses
`semantic-release` to bump `package.json` and create a commit back to
`main` on every successful CI run on `main`. That commit is the only
commit Vercel builds to production (enforced by
`apps/oak-curriculum-mcp-streamable-http/build-scripts/vercel-ignore-production-non-release-build.mjs`,
which cancels non-version-bump production builds).

This ADR does not change the GitHub release workflow or the ignore
script. L-7 attaches additional steps inside the Vercel build; the
preceding GitHub-side machinery remains as-is.

The `concurrency: release` guard in `release.yml` (with
`cancel-in-progress: false`) serialises release workflows, so
`semantic-release` cannot produce two competing version-bump commits
in parallel. Successive bump commits are processed serially by Vercel,
each subject to the ignoreCommand check.

## Consequences

### Positive

- **Regression attribution works end-to-end.** Every emitted event
  carries a semver release tag and a git SHA tag; every release has a
  timeline of deploys across environments; every deploy carries a
  commit via `set-commits`. A regression in production can be traced
  back to the release that introduced it, the SHA that was built, and
  the commits that went into that release.
- **Semver is stable across preview-then-production promotion.** A
  single release is reused when the same version promotes to
  production, producing one `deploys list` entry per environment.
- **Production mislabelling is bounded.** A manual `vercel --prod`
  from a feature branch produces a `preview` deploy in Sentry, not a
  `production` deploy.
- **Per-step error handling is explicit.** Every CLI step has a named
  abort-vs-continue posture, recorded here, so the orchestrator
  script is a transcription of the ADR, not a novel decision surface.
- **The existing GitHub + Vercel machinery already enforces the
  "version-bump commit is the built commit" invariant.** No new CI
  workflow, no new Vercel webhook.

### Negative / trade-offs

- **Hotfix releases require a version bump.** Vercel will not build a
  production hotfix commit unless the root `package.json` version
  advances. This is the intended shape; hotfix discipline is "bump
  the patch version, merge to main, semantic-release publishes the
  bump commit, Vercel builds it". No emergency out-of-band path.
- **The branch-check is Vercel-specific.** If Oak migrates off Vercel,
  the branch-check will need to be restated against the new
  platform's environment-resolution semantics. The check is a
  platform-boundary guardrail, not an intrinsic property of the
  release mechanism.
- **Runtime code adopts a new Vercel env var.** `VERCEL_GIT_COMMIT_REF`
  is not in `SentryConfigEnvironment` today; the L-7 implementation
  adds it. This is a small, well-bounded contract change (§8).
- **Suspect-commits quality depends on the Sentry GitHub integration.**
  The `--commit org/repo@sha` form attaches the SHA string without
  the integration, but full suspect-commits and PR-level attribution
  requires the integration installed in the Sentry org. Oak has it
  installed today; a future uninstall would degrade commit-level
  attribution without breaking the release/deploy registration.

## Alternatives Considered

1. **Release identifier = git SHA.** Rejected: the SHA does not
   survive the preview→production promotion semantically (the same
   version can have different last-SHA-at-build-time depending on when
   the promote happened) and does not correspond to the user-visible
   version. Semver is the right granularity.
2. **Release identifier = Vercel deployment ID.** Rejected: same
   granularity problem as SHA, and introduces a platform-specific
   identifier into a provider-neutral adapter (ADR-162 vendor-
   independence clause).
3. **Skip `releases new` and let the source-map upload auto-create
   the release.** Rejected: explicit `releases new` anchors the
   release in the Sentry release timeline even before the first
   event arrives. Auto-creation works but produces a later and less
   legible timeline.
4. **Register a fresh release per environment (preview-1.5.0,
   production-1.5.0).** Rejected: loses the one-release-to-many-deploys
   semantics Sentry's data model is designed around; makes the
   "regression introduced in 1.5.0" claim harder to express.
5. **Trust `VERCEL_ENV` alone for production attribution.** Rejected
   (see §3): branch-mismatched production deploys would pollute the
   production signal.
6. **Use the legacy `sentry-cli releases deploys VERSION new -e ENV`
   form.** Rejected (see §6.6): the current CLI reference documents
   the `deploys new --release -e` form; using one form only
   eliminates drift between the docs and the scripts.
7. **Inline the sentry-cli sequence into a `pnpm build && …` chain in
   `vercel.json`.** Rejected (see §7): per-step abort-vs-continue
   posture cannot be expressed cleanly in a bash `&&` chain.
8. **Use `--auto` on `releases set-commits` to let Sentry infer the
   commit range.** Rejected (see §6.2): the explicit `--commit` form
   surfaces the dependency on the Sentry GitHub integration as a
   command error rather than a silent inference failure, narrowing
   the failure mode.
9. **Place the SHA as a Sentry context field rather than a tag.**
   Rejected (see §2): contexts are displayed but not indexed;
   filtering events by SHA requires a tag.
10. **Expose a separate "hotfix" path that bypasses the version-bump
    gate.** Rejected: introduces a parallel release flow with its own
    drift surface. The bump-the-patch-and-merge discipline covers the
    hotfix use case without a separate path.

## Enforcement

1. **Runtime invariant tests** in
   `packages/libs/sentry-node/src/config-resolution.unit.test.ts` (WS
   in the L-7 implementation): the §3 truth table is encoded as a
   parametrised test with one assertion row per table row. A future
   change to the truth table must update the test first.
2. **Build-time preflight** in the orchestrator script (authored by
   L-7): fail-fast refuses to run against `VERCEL_ENV=development`
   unless the override env-pair is set. Verified against a fake
   `sentry-cli` binary in a fixture test before landing.
3. **Docs**:
   - `docs/operations/sentry-deployment-runbook.md` (authoritative
     deploy-time flow).
   - `docs/operations/sentry-cli-usage.md` (command reference, release
     linkage sequence).
   - `apps/oak-curriculum-mcp-streamable-http/scripts/upload-sourcemaps.sh`
     (inline `WHEN TO RUN` comment).
   - `apps/oak-curriculum-mcp-streamable-http/docs/observability.md`
     (points at this ADR for the release/deploy model).
   - `apps/oak-curriculum-mcp-streamable-http/docs/vercel-environment-config.md`
     (env-var listing + the §3 truth table).
     Drift against this ADR in any of those surfaces is caught by
     `docs-adr-reviewer` at lane close.
4. **Cross-reference from ADR-161** — ADR-161 pipeline-boundary table
   already names the Vercel deploy pipeline as the correct home for
   `sentry-cli` invocations. This ADR names the specific sequence.

## References

- Sentry release setup: <https://docs.sentry.io/product/releases/setup/>
- Sentry esbuild plugin (§L-8 onwards):
  <https://docs.sentry.io/platforms/javascript/sourcemaps/uploading/esbuild/>
- Sentry CLI — releases: <https://docs.sentry.io/cli/releases/>
- Sentry CLI — creating deploys:
  <https://docs.sentry.io/cli/releases/#creating-deploys>
- Sentry CLI — finalizing releases:
  <https://docs.sentry.io/cli/releases/#finalizing-releases>
- Sentry CLI — associate commits:
  <https://docs.sentry.io/product/releases/associate-commits/>
- Sentry sourcemap Debug IDs:
  <https://docs.sentry.io/platforms/javascript/sourcemaps/troubleshooting_js/debug-ids/>
- Sentry sourcemap CLI upload:
  <https://docs.sentry.io/platforms/javascript/sourcemaps/uploading/cli/>
- Vercel system environment variables:
  <https://vercel.com/docs/projects/environment-variables/system-environment-variables>
- Vercel build configuration:
  <https://vercel.com/docs/builds/configure-a-build>

## History

- **2026-04-19** — Proposed. Follows owner adjudication of the L-7
  open questions (release identity, SHA provenance, release-creation
  location, source-map interaction, deploy-event scope, pipeline
  boundary, per-step error handling, pipeline attachment shape) during
  the primitives-consolidation close session. All adjudications are
  recorded as numbered §§1–9 above with no residual open questions.
- **2026-04-19** — Accepted by owner in the same session. L-7
  implementation authorised to proceed against the mechanism recorded
  here. No ADR edits accompanied the acceptance; the Proposed text
  stands verbatim.
- **2026-04-20** — Amendment during L-7 implementation. Two changes:
  (1) §6.1 split into a §6.0 `releases info` probe followed by
  conditional §6.1/§6.2 execution — if the release already exists,
  §6.1 AND §6.2 are skipped to preserve the original deploy's commit
  attribution. Re-running `set-commits` on an existing release would
  overwrite the SHA binding and orphan prior regression-traceability.
  Amendment was surfaced by the L-7 assumptions-review as the
  highest-blast-radius assumption in the original text. Matches the §5
  intent ("semver is the immutable release identity; one release ↔
  many deploys") rather than the literal §6.1 "abort on failure" wording.
  (2) §7 path reference updated from `scripts/sentry-release-and-deploy.sh`
  to `build-scripts/sentry-release-and-deploy-cli.ts` — the orchestrator
  is a TypeScript module invoked by `tsx` (not bash), per repo rule that
  scripts are TypeScript when `tsx` is available (the Vercel Build
  Command runs after `pnpm install`). Three-file split (types +
  preflight + orchestrator + CLI composition root) chosen for
  unit-testability under ADR-161 (no subprocess spawn in tests).
- **2026-04-21** — Amendment during §L-8 WS3.1. §6 reframed from HOW
  (six specific `sentry-cli` invocations §6.0–§6.6 wrapped by a
  bespoke TypeScript orchestrator) to WHAT (named outcomes the build
  must reach in Sentry). The realisation switches to the vendor's
  first-party `@sentry/esbuild-plugin` running inside the MCP app's
  esbuild composition root. The §6.0–§6.6 subsections are retained as
  the canonical outcome description (each subsection's intent,
  posture, and idempotency shape stays authoritative); the bash
  invocations they show are read as outcome descriptions, not the
  realisation. §7 amended to point at
  `apps/oak-curriculum-mcp-streamable-http/esbuild.config.ts` as the
  composition root and to remove the `vercel.json` `buildCommand`
  override (Vercel now runs the workspace's default `build` script,
  which invokes `tsx esbuild.config.ts`). Six L-7 orchestrator files
  (~953 LOC) and the `upload-sourcemaps.sh` wrapper are deleted by
  WS2.3. Realisation files are added: `esbuild.config.ts` (composition
  root), `build-scripts/esbuild-config.ts` +
  `build-scripts/esbuild-config.unit.test.ts` (Oak-owned build
  contract; 8 unit-tested invariants), `build-scripts/sentry-build-plugin.ts`
  - `build-scripts/sentry-build-plugin.unit.test.ts` (env →
    registration intent; 14 unit-tested policy permutations).
    Vendor-side effects (Debug-ID injection, source-map upload, deploy
    events) are deferred to §L-8 WS4/WS5 Vercel preview smoke per
    test-strategy directive (no subprocess spawn or filesystem-IO in
    in-process tests). Amendment was authored under the
    `inherited-framing-without-first-principles-check` lesson recorded
    in `napkin.md` 2026-04-20 entry, which named the §6 HOW framing as
    the cost the L-7 lane paid; §L-8 WS3.1 pays that cost back.
