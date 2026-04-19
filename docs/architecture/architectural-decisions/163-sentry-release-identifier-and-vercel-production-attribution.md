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

### 6. Canonical command sequence inside the Vercel build

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

sentry-cli releases new "$VERSION"                          # §6.1

sentry-cli releases set-commits "$VERSION" \                # §6.2
  --commit "oaknational/oak-open-curriculum-ecosystem@$VERCEL_GIT_COMMIT_SHA"

sentry-cli sourcemaps inject dist/                          # §6.3

sentry-cli sourcemaps upload --release "$VERSION" dist/     # §6.4

sentry-cli releases finalize "$VERSION"                     # §6.5

sentry-cli deploys new --release "$VERSION" -e "$DERIVED_ENV"  # §6.6
```

Each step is specified below with its exact error-handling posture.

#### 6.1 `releases new` — **abort on failure**

Creates the release. Idempotent against Sentry (re-running returns the
existing release). Failure modes: auth-token invalid; network
unreachable; Sentry region mismatch. Any failure here means the
subsequent steps have nothing to attach to; the build MUST abort.

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
2. The §6 sentry-cli sequence, via a dedicated orchestrator script
   (e.g. `scripts/sentry-release-and-deploy.sh` in the MCP workspace).

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
