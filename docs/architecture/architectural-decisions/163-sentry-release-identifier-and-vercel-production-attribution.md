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

### 1. Sentry release identifier — per environment

> **Amendment 2026-04-24 (release identifier per environment)**
>
> The §1 mechanism originally specified "release identifier = root
> `package.json` semver, everywhere". L-8 implementation diverged from
> that wording without amending the ADR: the build-time resolver
> (`resolveBuildTimeRelease` in
> `packages/core/build-metadata/src/build-time-release.ts`) returned
> `preview-<branch-slug>-<shortSha>` for preview / non-`main`-production
> builds, while the runtime resolver (`resolveSentryRelease` in
> `packages/libs/sentry-node/src/config-resolution.ts`) continued to
> return semver via `APP_VERSION` for every environment. The Sentry MCP
> integration verification (transcript
> [Sentry MCP integration verification](11729e08-3046-448d-af80-d00b790279a6),
> 2026-04-23) surfaced the divergence as a real attribution failure:
> preview Sentry releases were registered under one identifier and the
> events that landed against them were tagged with another, so
> event-to-release attribution did not survive ingest.
>
> Owner direction (recorded 2026-04-23, applied here 2026-04-24)
> collapses the option space: the release identifier is **per
> environment**, not "semver everywhere". Both resolvers MUST produce
> the **same string** for the **same environment input** — no
> divergence between what is registered at build time and what runtime
> events are tagged with.
>
> **Per-environment release-identifier truth table**:
>
> | `VERCEL_ENV`  | `VERCEL_GIT_COMMIT_REF` | `VERCEL_BRANCH_URL` (host)            | Build-time AND runtime release | Source                    |
> | ------------- | ----------------------- | ------------------------------------- | ------------------------------ | ------------------------- |
> | `production`  | `main`                  | (not consulted on this row)           | root `package.json` semver     | `application_version`     |
> | `production`  | non-`main`              | `poc-…-git-<branch>` host             | branch-URL host                | `vercel_branch_url`       |
> | `preview`     | any                     | `poc-…-git-<branch>` host             | branch-URL host                | `vercel_branch_url`       |
> | `development` | any                     | unset (typical local)                 | `dev-<shortSha>`               | `development_short_sha`   |
> | any           | any                     | (any) — `SENTRY_RELEASE_OVERRIDE` set | override value                 | `SENTRY_RELEASE_OVERRIDE` |
>
> Notes:
>
> - Row 2 (`production` / non-`main`) exists because Vercel allows
>   `vercel --prod` from any branch; §3 below already downgrades the
>   Sentry **environment** to `preview` in that case, and the release
>   identifier follows the same downgrade — branch-URL-host shape.
> - The release identifier for preview / non-`main`-production is the
>   **leftmost host label** of `VERCEL_BRANCH_URL` (everything before
>   the first `.`), e.g.
>   `poc-oak-open-curriculum-mcp-git-feat-otelsentryenhancements`. The
>   full host (e.g. `…-git-feat-otelsentryenhancements.vercel.thenational.academy`)
>   is NOT used directly so that a future custom-domain change does not
>   invalidate prior release identifiers, and so the value remains
>   compact in the Sentry UI. Oak relies on the branch-stable
>   identifier being encoded in the leftmost host label of its
>   generated branch URL — this is an **Oak operational assumption**
>   about the current Vercel-generated host shape, not a vendor-
>   guaranteed contract; if Vercel changes that host shape, this
>   amendment must be revisited.
> - Oak relies on `VERCEL_BRANCH_URL` for preview / non-`main`-
>   production release resolution when Vercel system environment
>   variables are enabled; if it is absent on those rows, release
>   resolution **fails fast** rather than silently falling back to
>   another shape (per `.agent/directives/principles.md` §Fail FAST and
>   `.agent/rules/replace-dont-bridge.md`).
> - All five rows MUST validate against Sentry's documented release-
>   name rule before being passed to the Sentry SDK / CLI / plugin:
>   ≤200 chars; no newlines, tabs, `/`, or `\`; not `.`, `..`, or a
>   single space (Sentry docs,
>   `https://docs.sentry.io/product/releases/naming-releases/`). The
>   existing Oak-local `SENTRY_RELEASE_NAME_PATTERN` in
>   `packages/core/build-metadata/src/build-time-release-internals.ts`
>   (currently `/^[\w.\-+/=:@~]{1,200}$/u`) is **close to** but not
>   byte-equivalent to the vendor rule — it permits `/` (which Sentry
>   forbids) and rejects characters Sentry would accept. Aligning the
>   Oak validator with the vendor rule is in scope for the WS2
>   implementation of the release-identifier plan; the new shapes
>   (semver, branch-URL host, `dev-<shortSha>`) do not contain `/` so
>   the misalignment does not bite the new shapes in practice, but the
>   override path could submit `/`-bearing strings and should be
>   tightened.
> - `SENTRY_RELEASE_OVERRIDE` (row 5) wins over every other row, in
>   every environment. This preserves the §4 UAT override pair and the
>   one-off rehearsal hook.
>
> **Rationale for branch-URL host over `preview-<slug>-<sha>`**:
> Sentry release-health metrics (crash-free sessions / users) are keyed
> by release identifier (Sentry docs,
> `https://docs.sentry.io/product/releases/health/`). With `<sha>`
> baked in, every commit on a preview branch produces a fresh release
> and release-health metrics are fragmented into single-deploy
> aggregations. With the branch-URL host (no `<sha>`), every commit on
> the same branch contributes to the same release-health aggregation —
> the right granularity for "is this branch healthier or sicker than
> the others?". The branch-URL host is also discoverable from the
> Sentry event back to the matching Vercel preview deployment URL: an
> investigator can open the deployment that produced an event by URL.
> §5 ("one release → many deploys") still applies, but at the
> per-environment grain rather than the per-version grain — see the §5
> cross-link below.
>
> **Process-gap finding (recorded for the lineage)**: §1 (as written)
> and the L-8 implementation diverged for ~four months without an ADR
> amendment. Code review and reviewer dispatch on the L-8 lane did not
> detect the divergence because no test asserted cross-resolver shape
> equivalence — both resolvers' unit tests passed because each was
> internally consistent. The vendor failure mode this drift produced is
> **split-release pollution**, not ingest rejection: Sentry will
> auto-create a release the first time it sees an event tagged with an
> unknown identifier (Sentry docs,
> `https://docs.sentry.io/platforms/javascript/guides/node/configuration/releases/`),
> so the build-time `releases new` registered release A and the runtime
> events landed on auto-created release B, fragmenting commit / deploy /
> release-health data across two release entities for the same logical
> preview deployment.
>
> **Structural fix (second amendment, 2026-04-24)**: the fix is
> structural and goes further than the first amendment promised. WS2 of
> `.agent/plans/observability/current/sentry-release-identifier-single-source-of-truth.plan.md`
> (commit `f5a009ab`) collapsed `resolveBuildTimeRelease` and the
> runtime-resolution path into a single `resolveRelease` function in
> `@oaknational/build-metadata`. `@oaknational/sentry-node` delegates at
> runtime via `SentryConfigEnvironment extends ReleaseInput`, so the
> build-time resolver and the runtime resolver are the same function —
> shape divergence between them is impossible by construction. The
> dep-cruise edge `libs ← core` (enforced by the existing boundary
> rules) is the structural gate that prevents future inversion. The
> first amendment's plan to add a cross-resolver contract test in
> `packages/libs/sentry-node/tests/release-identifier-cross-resolver.contract.unit.test.ts`
> is superseded by the collapse — there is no second resolver to compare
> against. Enforcement §5 is retracted accordingly and replaced with a
> structural-unification note (see Enforcement §5 below).
>
> **The §1 text below is preserved as historical record of the
> L-7/L-8 mechanism specification before this amendment.**

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

> **Cross-link 2026-04-24**: per the §1 amendment above, the release
> identifier on each row of the truth table below is taken from §1's
> per-environment release-identifier table — the `production` /
> non-`main` and `production` / unset rows here are tagged with the
> branch-URL host (or `dev-<shortSha>` if `VERCEL_BRANCH_URL` is
> unset), not with semver, mirroring the environment downgrade.

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

> **Cross-link 2026-04-24**: per the §1 amendment above, the "one
> release" referenced in this section is the per-environment release
> identifier from §1's truth table — semver for production-on-`main`,
> branch-URL host for preview / non-`main`-production. The
> "one release → many deploys" relationship now operates **at the
> per-environment grain**: one semver release carries the production
> deploy(s) for that semver; one branch-URL release carries the
> multiple preview deploys for that branch. The preview→production
> "same code, different environment" relationship is **no longer
> modelled by a shared release identifier**; it is modelled by the
> matching commits being captured on the production release via
> `set-commits` (§2 / §6.2). The §5 text below is preserved as
> historical record of the pre-amendment "single release identifier
> per release line" framing.

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
against runtime events and symbolication would silently fail. Under the
current esbuild-plugin realisation this injection happens inside the
build itself; there is no separate wrapper script. Oak's repo-owned
post-condition is now the combination of the build succeeding, the
deployed artefact contract gate passing (§7/§8), and the preview smoke
probe proving the deployed function boots and reports with the expected
release.

#### 6.4 `sourcemaps upload --release` — **abort on failure**

Uploads the artefact bundle, keyed by the Debug IDs from §6.3, and
associates it with the release `$VERSION`. The `--release` flag
creates a **weak association** that drives the Releases → Source
Maps surface in the Sentry UI. Debug IDs are sufficient for
symbolication without `--release`; the weak association is retained
because the plugin's release configuration still provides that UI path
for humans investigating a specific release. Failure
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
> **Amendment 2026-04-23 (deploy-boundary repair)**
>
> The build no longer treats `dist/index.js` as both the local Node
> listener and the deployed artefact. The workspace now emits three
> distinct bundles:
>
> - `dist/server.js` — the deployed Vercel entry;
> - `dist/index.js` — the local Node listener entry;
> - `dist/application.js` — the importable async Express app factory.
>
> `package.json` `main` now points at `dist/server.js`. The esbuild
> composition root imports the built `dist/server.js` immediately after
> build and fails if the module does not default-export a function.
> That same root also fails the build on any esbuild warning, closing
> the exact warning-to-runtime-crash path surfaced by the 2026-04-22
> preview failure.
>
> Pipeline shape (2026-04-23 onwards):
>
> ```text
> build command (Vercel default):
>   pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http run build
>
> workspace build script:
>   tsx esbuild.config.ts
> ```
>
> The deploy-boundary split is intentional: Vercel imports
> `dist/server.js`; local Node starts `dist/index.js`; diagnostics use
> `pnpm prod:harness`, which wraps `dist/server.js` in a local
> `http.createServer(...)`.
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

### 8. Runtime and deploy-boundary contract changes required

The L-7 and L-8 work together to ratify three contract changes:

- `packages/libs/sentry-node/src/types.ts#SentryConfigEnvironment`
  includes `VERCEL_GIT_COMMIT_REF?: string` (for the §3 branch-check)
  and `SENTRY_RELEASE_REGISTRATION_OVERRIDE?: string` (for the §4
  local-override gate).
- The deployed workspace entry is
  `apps/oak-curriculum-mcp-streamable-http/src/server.ts`; the built
  deployed artefact is `dist/server.js`; `package.json` `main` must
  point at that file.
- `dist/server.js` must default-export a function that satisfies
  Vercel's `@vercel/node` import contract. `src/index.ts` remains the
  local Node listener and must not be reused as the deployed `main`.

`resolveSentryEnvironment` implements the §3 truth table.
`resolveSentryRelease` is now a thin adapter over the canonical
`@oaknational/build-metadata` `resolveRelease(input)` resolver. The
HTTP runtime schema includes `VERCEL_GIT_COMMIT_REF`, so runtime Sentry
events receive the same production-main vs preview attribution inputs
that the Vercel build-time registration path receives. The MCP app
resolves the application version at the app build/runtime boundary and
projects it into Sentry's release input as `APP_VERSION`; Sentry
observability consumes that identity, it does not create it.
`apps/oak-curriculum-mcp-streamable-http/esbuild.config.ts` enforces the
deployed-entry contract with two repo-owned gates:
`assertNoEsbuildWarnings(...)` and
`assertBuiltServerDefaultExport(...)`.

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

### 10. Production builds require a semantic-release commit

> **Amendment 2026-04-24 (production cancellation rule)**
>
> ADR-163 §9 names
> `apps/oak-curriculum-mcp-streamable-http/build-scripts/vercel-ignore-production-non-release-build.mjs`
> as the script that cancels non-version-bump production builds, but
> the **cancellation rule itself** was never stated as a numbered ADR
> decision. The rule lived only in the script and its tests; the ADR
> referenced the consequence ("only the version-bump commit reaches
> production") without recording the rule that produces it. This new
> §10 makes the rule a numbered decision, co-equal with the §1
> release-identifier rule, because §1 is keepable only if production
> deploys correspond exactly to semantic-release commits.

A production build on `main` MUST be cancelled unless the commit
advances the root `package.json` semver beyond the previously-deployed
version. Merge commits (which carry the previous semver) do not
trigger a production deploy; only semantic-release commits (which
bump the semver) do.

**Cancellation truth table**:

| Branch (`VERCEL_GIT_COMMIT_REF`) | Current version (root `package.json`) | Previous version (`VERCEL_GIT_PREVIOUS_SHA:package.json`) | Outcome                | Reason                                                                                                                           |
| -------------------------------- | ------------------------------------- | --------------------------------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| not `main`                       | (not read)                            | (not read)                                                | Continue build         | Branch gate; per §1 only `main` triggers a production identifier.                                                                |
| `main`                           | resolvable                            | unresolvable / unset                                      | Continue build         | First build OR previous SHA absent / git-unreachable; treated as "no previous to beat".                                          |
| `main`                           | resolvable                            | resolvable, current ≤ previous                            | **CANCEL build**       | Version did not increment; this is a merge / hot-fix-on-main / accidental downgrade.                                             |
| `main`                           | resolvable                            | resolvable, current > previous                            | Continue build         | Semantic-release commit advanced the version; the production identifier is fresh.                                                |
| `main`                           | unresolvable                          | (not read)                                                | **CANCEL with stderr** | Build error: the current app version cannot be determined from root `package.json`. Diagnostic message printed; non-recoverable. |

Mapping to Vercel `ignoreCommand` exit codes: exit 0 = "ignore this
build" (Vercel cancels), exit 1 = "do not ignore" (Vercel proceeds).
The script returns exit 0 on rows 3 (current ≤ previous) and 5
(current unresolvable); exit 1 on rows 1, 2, 4.

**Asymmetry rationale**: an unresolvable **current** version is a
deterministic repo defect under Oak's current build topology (single
root `package.json` read by all consumers) — missing or malformed file,
missing `version` field, or non-semver value. The script cancels with a
stderr diagnostic so the failure surfaces at build time rather than at
Sentry-ingest time; bumping a patch / merging a fresh version bump is
the recovery path, not a retry. An unresolvable **previous** version is
dominated by transient causes (first deploy, shallow clone,
`VERCEL_GIT_PREVIOUS_SHA` unset, fetch failure); the script treats it
as "no previous to beat" and continues silently, because the next build
with a resolvable previous will re-gate. This asymmetry replaces the
first amendment's single fail-open clause and eliminates the separate
"warn and continue" outcome for previous-resolution failure. If Oak's
build topology changes (e.g. nested roots, per-workspace version
sourcing), the "current is a deterministic defect" claim needs
revisiting. The stderr diagnostic on row 5 is the structured
operator-visible signal per `.agent/rules/no-warning-toleration.md` §3
(Vercel build logs are the structured-signal capture surface; the
script does not silently swallow the diagnostic).

**Enforcement mechanism** (second amendment, 2026-04-24):

- **Canonical implementation**:
  `apps/oak-curriculum-mcp-streamable-http/build-scripts/vercel-ignore-production-non-release-build.mjs`
  exports the pure `runVercelIgnoreCommand` function. All decision
  logic (branch gate, current-vs-previous semver comparison,
  exit-code mapping, stderr diagnostic emission) lives here. The
  script is co-located with its sole consumer and `#!/usr/bin/env
node` headed so `vercel.json`'s `ignoreCommand` invokes it
  directly.
- **Wiring**:
  `apps/oak-curriculum-mcp-streamable-http/vercel.json`'s
  `ignoreCommand` field names the workspace-relative path to the
  canonical implementation. Vercel runs that command before every
  build and uses its exit code to decide whether to proceed. The
  field value is unchanged by WS3 of the release-identifier plan —
  it previously resolved to a workspace shim, and now resolves
  directly to the canonical implementation at the same path. The
  literal command string is owned by `vercel.json`, not by this ADR.
- **Unit tests**:
  `apps/oak-curriculum-mcp-streamable-http/build-scripts/vercel-ignore-production-non-release-build.unit.test.mjs`
  covers all rows of the truth table above and is the proof for the
  rule itself.
- **Comparator**: the version comparison uses the npm `semver`
  package's `semver.lte` function rather than hand-rolled comparison
  logic. `semver.valid()` validates both current and previous version
  strings; `semver.lte(current, previous)` determines the
  cancel/continue outcome on rows 3 and 4. The package is declared as
  a `devDependency` of the `apps/oak-curriculum-mcp-streamable-http`
  workspace (build-time tooling for the one consumer only).
- **Wiring integration test — removed**: Enforcement §6 (added by the
  first amendment) was removed because the wiring drift surface it
  would have guarded was structurally eliminated by relocating the
  canonical script into the consuming app workspace (WS3.1 of
  `.agent/plans/observability/current/sentry-release-identifier-single-source-of-truth.plan.md`).
  Per `.agent/directives/testing-strategy.md` `Test real behaviour,
not implementation details`, no behavioural test was lost — the
  script's unit tests at the new in-app location cover the rule's
  behaviour, and Vercel's deploy probe covers wiring. There is no
  longer an indirection layer between `vercel.json` and the canonical
  implementation for an integration test to assert against.

Rationale: the §1 release identifier is meaningful only if production
deploys correspond exactly to semantic-release commits. Without this
rule, a merge commit on `main` would deploy under a stale semver
(because `package.json` has not yet been bumped by `semantic-release`),
and Sentry's release model would react in a specifically painful way:
Sentry would not refuse the build and would not create a second
release with the same identifier — it would **reuse the existing
org-global semver release** and append more deploy / event / session
data to it (Sentry docs,
`https://docs.sentry.io/cli/releases/#creating-deploys`,
`https://docs.sentry.io/product/releases/health/`). That contaminates
release-health metrics and regression-attribution semantics for that
semver: a regression introduced by the merge commit would be
attributed to the previously-released semver, hiding it from the
release-introduced-by view. The script enforces "production = bumped
version" structurally, so the §1 promise (release identifier per
environment) is keepable and Sentry's release-health attribution stays
intact.

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
11. **Keep both resolvers on their pre-amendment shapes (semver
    runtime, `preview-<slug>-<sha>` build-time).** Rejected (see §1
    amendment 2026-04-24): Sentry releases registered at build time
    under one identifier and runtime events tagged with a different
    identifier break event-to-release attribution outright. The
    2026-04-23 verification surfaced the divergence as a real
    attribution failure, not a cosmetic one.
12. **Make both resolvers return semver everywhere (the original §1
    intent).** Rejected (see §1 amendment 2026-04-24): preview
    branches share the same semver across builds, but the same code
    is _not_ in two preview deployments — Sentry release-health
    metrics would conflate genuinely different deployments under one
    release. The branch-URL host gives one release per branch, which
    is the right granularity for preview attribution.
13. **Use the full `VERCEL_BRANCH_URL` (host + path) as the preview
    release identifier.** Rejected: the leftmost host label alone is
    unique per branch and well under Sentry's 200-char release-name
    limit; including the rest of the host adds drift surface (custom
    domain or routing changes) without information.
14. **Promote the production cancellation rule to its own ADR.**
    Rejected (see §10 amendment 2026-04-24): the cancellation rule
    exists only because the §1 release identifier requires
    "production = bumped semver" to be meaningful. Co-locating both
    rules in this ADR keeps the dependency visible.

## Enforcement

1. **Runtime invariant tests** in
   `packages/libs/sentry-node/src/config-resolution.unit.test.ts` (WS
   in the L-7 implementation): the §3 truth table is encoded as a
   parametrised test with one assertion row per table row. A future
   change to the truth table must update the test first.
2. **Build-time contract gate** in
   `apps/oak-curriculum-mcp-streamable-http/esbuild.config.ts`:
   fail-fast rejects esbuild warnings, imports the built
   `dist/server.js`, and requires a default-exported function. This is
   the local guardrail for the 2026-04-22
   `FUNCTION_INVOCATION_FAILED` class; preview smoke still provides the
   external proof.
3. **Docs**:
   - `docs/operations/sentry-deployment-runbook.md` (authoritative
     deploy-time flow).
   - `apps/oak-curriculum-mcp-streamable-http/docs/deployment-architecture.md`
     (deployed vs local runtime boundary).
   - `apps/oak-curriculum-mcp-streamable-http/docs/observability.md`
     (points at this ADR for the release/deploy model).
   - `apps/oak-curriculum-mcp-streamable-http/docs/vercel-environment-config.md`
     (env-var listing + the §3 truth table).
   - `apps/oak-curriculum-mcp-streamable-http/docs/operational-debugging.md`
     (local deploy-boundary diagnostics via `pnpm prod:harness`).
     Drift against this ADR in any of those surfaces is caught by
     `docs-adr-reviewer` at lane close.
4. **Cross-reference from ADR-161** — ADR-161 pipeline-boundary table
   already names the Vercel deploy pipeline as the correct home for
   the release/deploy realisation. This ADR now names the esbuild
   composition root + deployed-entry contract that make that pipeline
   bootable in practice.
5. **Structural release-identifier unification** (replaces the
   cross-resolver contract test that was added by the §1 amendment
   2026-04-24 and retracted 2026-04-24 second amendment). Build-time
   and runtime release identifiers are produced by a single
   `resolveRelease` function in `@oaknational/build-metadata`
   (introduced by WS2 of the release-identifier plan, commit
   `f5a009ab`). `@oaknational/sentry-node` consumes the resolver via
   `SentryConfigEnvironment extends ReleaseInput`, so there is no
   parallel runtime resolver to drift against. The dep-cruise edge
   `libs ← core` is the structural gate preventing inversion; the
   TypeScript type system prevents shape divergence at compile time.
   No runtime contract test is required — the drift surface has been
   eliminated, not merely guarded. The prior Enforcement §5 text
   (which named the contract test as the primary anti-drift gate) is
   preserved in the first-amendment History entry for lineage.

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
- **2026-04-23** — Amendment during the deploy-boundary repair. §7 now
  names the built artefact split explicitly: `dist/server.js` is the
  deployed Vercel entry, `dist/index.js` remains the local listener,
  and `package.json` `main` points at `dist/server.js`. §8 now records
  the deploy-boundary contract itself, and Enforcement §2 replaces the
  old orchestrator-preflight framing with the build-output contract
  gate (`assertNoEsbuildWarnings` +
  `assertBuiltServerDefaultExport`). This closes the exact
  2026-04-22 preview failure mode where a green build could still ship
  an unimportable deployed entry.
- **2026-04-24** — Two co-equal amendments recording owner direction
  (recorded 2026-04-23 during the Sentry MCP integration verification
  follow-through). (1) §1 release-identifier mechanism becomes
  **per environment**: semver for production-on-`main`,
  `VERCEL_BRANCH_URL` host for preview / non-`main`-production,
  `dev-<shortSha>` for development, `SENTRY_RELEASE_OVERRIDE` always
  wins. Both build-time and runtime resolvers MUST produce the same
  string for the same input — proven by a new cross-resolver contract
  test (Enforcement §5). The pre-amendment §1 text is preserved as
  historical record. (2) New §10 records the production cancellation
  rule (production builds on `main` are cancelled unless the commit
  advances root `package.json` semver), naming
  `packages/core/build-metadata/build-scripts/vercel-ignore-production-non-release-build.mjs`
  as the canonical implementation and the workspace shim +
  `vercel.json` `ignoreCommand` as the wiring. Wiring integrity
  proven by a new wiring integration test (Enforcement §6); rule
  itself proven by the existing six-row unit-test file.
  Process-gap finding: ADR-vs-implementation drift went undetected on
  the L-8 lane because no test asserted cross-resolver shape
  equivalence — the §1 amendment names the new contract test as the
  structural fix, not a procedural review-discipline change.
  Amendment landed by WS0 of
  `.agent/plans/observability/current/sentry-release-identifier-single-source-of-truth.plan.md`.
  Reviewer dispositions: see the
  `Reviewer Dispositions (2026-04-24 amendment)` block at the bottom
  of this file.
- **2026-04-24 (second amendment, §10 retraction)** — Amendment during
  WS3 of
  `.agent/plans/observability/current/sentry-release-identifier-single-source-of-truth.plan.md`.
  §10's first amendment (above) named a canonical implementation in
  `packages/core/build-metadata/build-scripts/` plus a workspace shim
  in `apps/oak-curriculum-mcp-streamable-http/build-scripts/`, with a
  wiring integration test (Enforcement §6) as the structural gate
  catching shim-vs-canonical drift. WS3 of the release-identifier plan
  relocates the canonical script directly into the app workspace
  (single consumer), eliminates the shim in-place, deletes the `.d.ts`
  companion, rewrites the ~205-line hand-rolled implementation as ~50
  lines using the npm `semver` package, and adds the
  `VERCEL_GIT_COMMIT_REF === 'main'` branch gate that the first
  amendment's truth table required but the script omitted. §10's truth
  table is replaced; the fail-open paragraph is dropped in favour of
  asymmetric current/previous handling; the workspace-shim subsection
  is dropped; the wiring integration test Enforcement §6 entry is
  dropped; path references throughout §10 are updated to the new
  canonical location; the `vercel.json` literal command string is
  replaced with a symbolic reference. The §1 amendment's "structural
  fix" paragraph (which named a cross-resolver contract test as the
  primary anti-drift gate) is retracted in favour of a structural
  collapse: WS2 of the release-identifier plan (commit `f5a009ab`)
  unified `resolveBuildTimeRelease` and the runtime-resolution path
  into a single `resolveRelease` function in
  `@oaknational/build-metadata`, with `SentryConfigEnvironment extends
ReleaseInput` so that `@oaknational/sentry-node` delegates at
  runtime — shape divergence between build-time and runtime is
  impossible by construction, and the anti-drift gate is the type
  system and the dep-cruise `libs ← core` edge rather than a runtime
  contract test. Enforcement §5 (cross-resolver contract test) is
  retracted accordingly. The assumptions-reviewer Dispositions #4
  (fail-open row), #5 (two-file shim explanation), and #6 (cross-
  resolver contract test as primary anti-drift gate) are retracted
  because the text they confirmed has been replaced, along with
  architecture-reviewer-fred Disposition #3 (the contract test's
  devDep edge) and two sub-clauses of its positive note #4 (boundary
  discipline for the cross-resolver and wiring integration test
  placements). Reviewer dispositions for this second amendment are
  recorded in the
  `Reviewer Dispositions (2026-04-24 second amendment)` block at the
  bottom of this file. This is the second amendment to ADR-163's §1 +
  §10 pair; the first landed at commit `06bf25d7`, the second at
  commit `2822e525`.

## Reviewer Dispositions (2026-04-24 first amendment)

Per the WS0.2 step of
`.agent/plans/observability/current/sentry-release-identifier-single-source-of-truth.plan.md`,
the §1 + §10 amendments above were dispatched to three reviewers
**before landing**. Reviewer findings are action items per principles
§Reviewer findings; acceptances and rejections are recorded inline
below with rationale.

### `assumptions-reviewer`

**Recommendation**: BLOCK ON FINDINGS #1, #2 (factual / assumption
precision). Other findings: IMPORTANT #3, #4, #6; SUGGESTION #5.

**Dispositions**:

1. **Finding #1 (BLOCKING — `VERCEL_BRANCH_URL` overstated as Vercel
   guarantee)** — **ACCEPTED**. §1 amendment text changed: removed
   "Vercel preview builds always populate this" framing and replaced
   with explicit fail-fast posture ("Oak relies on `VERCEL_BRANCH_URL`
   for preview / non-`main`-production release resolution when Vercel
   system environment variables are enabled; if it is absent on those
   rows, release resolution **fails fast** rather than silently
   falling back to another shape").
2. **Finding #2 (BLOCKING — production row's "(typically the project
   production URL host)" conflates `VERCEL_BRANCH_URL` with
   `VERCEL_PROJECT_PRODUCTION_URL`)** — **ACCEPTED**. §1 truth-table
   production-on-`main` row's host cell changed to "(not consulted on
   this row)". The host is not the governing input on that row anyway
   (source = `application_version`), so the cell now states that
   exactly.
3. **Finding #3 (IMPORTANT — leftmost-host-label uniqueness as Oak
   operational assumption, not vendor guarantee)** — **ACCEPTED**.
   §1 notes section now explicitly frames the leftmost-host-label
   assumption as Oak operational, with the trigger condition for
   revisiting the amendment ("if Vercel changes that host shape, this
   amendment must be revisited") spelled out.
4. **Finding #4 (IMPORTANT — §10 unresolvable row as fail-open
   trade-off)** — **ACCEPTED at first amendment; retracted at second
   amendment (2026-04-24 §10 retraction)**: the fail-open framing this
   disposition confirmed has been replaced by the asymmetric
   current/previous handling in the second amendment. The concern the
   original finding addressed (resolution-failure tolerance) is now
   handled more precisely: unresolvable **previous** version collapses
   into "no previous to beat" and continues silently; unresolvable
   **current** version is a deterministic repo defect and cancels with
   a stderr diagnostic. The disposition is moot; the new framing
   supersedes it.
5. **Finding #5 (SUGGESTION — soften two-file shim explanation)** —
   **ACCEPTED at first amendment; retracted at second amendment
   (2026-04-24 §10 retraction)**: the two-file shim framing addressed
   by this disposition was superseded by WS3.1 of the release-
   identifier plan, which relocated the canonical script directly into
   the app workspace. The suggestion is moot — no shim remains to
   explain.
6. **Finding #6 (IMPORTANT — tighten anti-drift gate claim)** —
   **ACCEPTED at first amendment; superseded at second amendment
   (2026-04-24 §10 retraction)**: the "primary anti-drift gate for
   release-identifier equivalence" text this disposition confirmed in
   §1 and mirrored in Enforcement §5 has itself been retracted. WS2
   of the release-identifier plan (commit `f5a009ab`) collapsed
   build-time and runtime resolvers into a single `resolveRelease`
   function in `@oaknational/build-metadata`, with
   `@oaknational/sentry-node` delegating at runtime via
   `SentryConfigEnvironment extends ReleaseInput`. There is no second
   resolver for a contract test to compare against; the drift surface
   has been eliminated rather than guarded. The residual drift modes
   Finding #6 asked to be named (source-provenance, error-shape) are
   subsumed by the structural collapse — they remain the
   responsibility of the single resolver's unit tests in
   `@oaknational/build-metadata`. The disposition is moot; the
   structural collapse supersedes the tightening this finding
   requested.

### `sentry-reviewer`

**Recommendation**: BLOCK ON FINDINGS #1, #2 (vendor-canonical
corrections). Other findings: SUGGESTION #3, #4.

**Dispositions**:

1. **Finding #1 (BLOCKING — `SENTRY_RELEASE_NAME_PATTERN` not
   Sentry-canonical; in particular it permits `/` which Sentry
   forbids; `latest` is not vendor-forbidden)** — **ACCEPTED**. §1
   amendment now states Sentry's documented rule verbatim with
   citation to
   `https://docs.sentry.io/product/releases/naming-releases/`, and
   labels the existing Oak-local pattern as **"close to but not byte-
   equivalent to the vendor rule"** with the specific gap named (it
   permits `/`). The amendment scopes "align Oak validator with
   vendor rule" into WS2 implementation work of the release-identifier
   plan; it does not change the regex in WS0. The new shapes (semver,
   branch-URL host, `dev-<shortSha>`) do not contain `/` so the gap
   does not bite the new shapes in practice; the override path is
   noted as the residual surface to tighten.
2. **Finding #2 (BLOCKING — divergence framing as ingest rejection
   is wrong; Sentry auto-creates a second release)** — **ACCEPTED**.
   §1 amendment process-gap finding now correctly describes the
   vendor failure mode as **split-release pollution**, with citation
   to Sentry's auto-create-on-first-event behaviour
   (`https://docs.sentry.io/platforms/javascript/guides/node/configuration/releases/`)
   and explicit description of how data fragments across two release
   entities for the same logical preview deployment.
3. **Finding #3 (SUGGESTION — preview branch-host rationale framed
   as aggregation trade-off, not response to hidden hard limits)** —
   **ACCEPTED**. §1 rationale section rewritten around Sentry release-
   health metrics being keyed by release identifier (with vendor
   citation `https://docs.sentry.io/product/releases/health/`),
   removing implicit suggestions of hidden Sentry length / cardinality
   ceilings.
4. **Finding #4 (SUGGESTION — §10 should describe consequence
   precisely: Sentry reuses existing release, contaminates release-
   health and regression semantics)** — **ACCEPTED**. §10 rationale
   now describes the violation consequence with vendor citations
   (`https://docs.sentry.io/cli/releases/#creating-deploys`,
   `https://docs.sentry.io/product/releases/health/`) — Sentry would
   reuse the existing semver release and append more deploy / event /
   session data to it, hiding regressions introduced by the merge
   commit from the release-introduced-by view.

### `architecture-reviewer-fred`

**Recommendation**: ACCEPT WITH SUGGESTED EDITS — block on Finding #1,
suggested follow-ups for Findings #2 and #3. Findings #4–#10 are
positive notes (no action).

**Dispositions**:

1. **Finding #1 (IMPORTANT — §5 not cross-linked / amended; current
   text contradicts the per-environment grain shift)** — **ACCEPTED**.
   §5 now carries a Cross-link 2026-04-24 blockquote at its top,
   reframing "one release → many deploys" at the per-environment
   grain (one semver release for production deploys; one branch-URL
   release for preview deploys per branch), explicitly noting that
   the preview→production "same code, different environment" relation
   is no longer modelled by a shared release identifier and is now
   carried by `set-commits` (§2 / §6.2). Pre-amendment §5 text is
   preserved as historical record per ADR amendment precedent.
2. **Finding #2 (SUGGESTION — cite `no-warning-toleration` §3 for
   §10 stderr-warning row)** — **ACCEPTED**. §10 now explicitly cites
   `.agent/rules/no-warning-toleration.md` §3 and names Vercel build
   logs as the structured-signal capture surface.
3. **Finding #3 (SUGGESTION — note new `sentry-node → build-metadata`
   devDep edge introduced by the cross-resolver contract test)** —
   **ACCEPTED at first amendment; superseded at second amendment
   (2026-04-24 §10 retraction)**: the contract test that would have
   introduced a `devDependency` edge is superseded by WS2's structural
   collapse (commit `f5a009ab`), which introduces a **runtime**
   `dependency` edge `@oaknational/sentry-node →
@oaknational/build-metadata` (via `SentryConfigEnvironment extends
ReleaseInput` and `resolveSentryRelease` delegation). The dep
   direction is unchanged (`libs ← core`, no boundary violation); the
   edge's purpose tightened from devDep-for-test to
   runtime-for-delegation. The disposition's concern (deliberate
   dep-edge introduction with direction explicit) is preserved and
   strengthened by the structural collapse.
4. **Findings #4–#10 (POSITIVE NOTES)** — acknowledged at first
   amendment; two sub-clauses retracted at second amendment
   (2026-04-24 §10 retraction). The "boundary discipline
   (cross-resolver test placement, wiring integration test placement)"
   sub-clause is retracted because both tests are retracted in the
   second amendment: the cross-resolver contract test is superseded by
   the `resolveRelease` structural collapse, and the wiring
   integration test is superseded by the script relocation into the
   consuming app workspace. The remaining sub-clauses (§10
   co-equality framing, process-gap wording, replace-don't-bridge
   compliance, cardinal rule non-invocation, ADR structural hygiene)
   remain accepted and unchanged. No further action required beyond
   this retraction note.

## Reviewer Dispositions (2026-04-24 second amendment)

Per the §3.0 step of
`.agent/plans/observability/current/sentry-release-identifier-single-source-of-truth.plan.md`,
the §10 retraction above was dispatched to `docs-adr-reviewer` and
`assumptions-reviewer` BEFORE landing. Reviewer findings are action
items per principles §Reviewer findings; acceptances and rejections are
recorded inline below with rationale.

### `docs-adr-reviewer`

**Recommendation**: BLOCK ON two findings (incomplete enumeration —
`assumptions-reviewer` Disposition #6 and
`architecture-reviewer-fred` Disposition #3 + positive-note #4
sub-clauses). Other findings: MAJOR on two line-range items; MINOR on
three prose / placeholder items; NITs and POSITIVE NOTES noted for
information.

**Dispositions**:

1. **BLOCKING (Cross-check Matrix missed Disposition #6)** —
   **ACCEPTED**. Enumeration expanded from 13 → 14 items to add an
   explicit retraction of `assumptions-reviewer` Disposition #6
   (parallel to Items 8 and 12 for Dispositions #4 and #5). Without
   this, Disposition #6 would remain as a dangling reference to
   §1/Enforcement-§5 text retracted elsewhere in this amendment — the
   same drift class this amendment exists to repair.
2. **BLOCKING (Cross-check Matrix missed architecture-reviewer-fred
   Disposition #3 + positive-note #4 sub-clauses)** — **ACCEPTED**.
   Enumeration expanded further to Item 15 covering both Fred
   sub-surfaces. Item 15a retracts Disposition #3 (devDep edge — now
   supersedes as runtime dep edge via WS2's collapse); Item 15b
   retracts two sub-clauses of positive-note #4 (cross-resolver and
   wiring-integration-test placement boundary-discipline claims).
3. **MAJOR (Item 1 line range)** — **ACCEPTED**. Range narrowed to
   preserve the `**Cancellation truth table**:` label and its blank
   line intact.
4. **MAJOR (Item 10 line range)** — **ACCEPTED**. Range narrowed to
   preserve the trailing blockquote separator before the preserved
   historical-record sentence intact.
5. **MINOR (Item 11 retract-with-replacement-note framing)** —
   **ACCEPTED**; merged with assumptions-reviewer I1.
6. **MINOR (Item 9 placeholder → grep-friendly token)** —
   **ACCEPTED**; placeholder installed for pre-commit review and filled
   with `2822e525` after WS3 landed.
7. **MINOR (Item 7 final bullet-order note)** — **ACCEPTED**; order
   documented as Canonical implementation → Wiring → Unit tests →
   Comparator → Wiring-integration-test-removed.
8. **NITs and POSITIVE NOTES** — acknowledged; no action.

### `assumptions-reviewer`

**Recommendation**: BLOCK on B1 (Disposition #6 dangling reference).
IMPORTANT I1 (retract-with-note uniformity), I2 (atomic-commit
proportionality + commit-body enumeration), I3 (Item 2 phrasing
softening). SUGGESTIONS and NOTES for information.

**Dispositions**:

1. **BLOCKING (B1 — Disposition #6 must be retracted)** —
   **ACCEPTED**; folded as Item 14 above (parallel to Items 8 and
   12). The 13 → 15 enumeration expansion is preferred over silently
   extending Item 12 — each retraction is self-contained and the
   count in the History entry accurately reflects the scope.
2. **IMPORTANT (I1 — retract-with-note uniformity for Items 10, 11)**
   — **ACCEPTED**. Item 11 reframed to retract-with-replacement-note
   ("replaces the cross-resolver contract test that was added by the
   §1 amendment 2026-04-24 and retracted 2026-04-24 second
   amendment"). Item 10 structural-fix-rewrite framing kept; the
   retraction lineage is preserved inline via the History block and
   the superseded-text-preserved-in-History pattern per ADR-053.
3. **IMPORTANT (I2 — atomic commit + commit-body enumeration)** —
   **ACCEPTED**. Atomic 15-item commit posture confirmed as
   proportional (Items 10, 11 are structurally coupled to WS2 via
   `f5a009ab`; separating them would create cross-amendment pointers
   and a 14th amendment surface). The WS3 commit message body lists
   all items as bullets, not prose, so `git log` readers see full
   scope without reading the diff.
4. **IMPORTANT (I3 — Item 2 phrasing softening)** — **ACCEPTED**.
   Softened to "deterministic repo defect under Oak's current build
   topology" with explicit revisit-trigger note ("if Oak's build
   topology changes (e.g. nested roots, per-workspace version
   sourcing), the 'current is a deterministic defect' claim needs
   revisiting").
5. **SUGGESTION (S1 — History-entry summary sentence)** — **REJECTED
   (not load-bearing)**: the History entry is dense but scannable.
   A summary opening sentence can be added as polish in a future
   amendment if a third reader reports friction. Rejecting preserves
   the current-amendment scope discipline.
6. **SUGGESTION (S2 — fill-at-landing sanity check records three
   assumptions-reviewer dispositions)** — **ACCEPTED**; this
   dispositions block records Dispositions #4, #5, #6 as retracted.
7. **NOTES (N1–N3)** — acknowledged; no action.

**Q1 (Item 14 vs extend Item 12)**: new Item 14 (and Item 15 for
Fred parallels) — enumeration count accurately reflects scope.
**Q2 (Item 2 softening)**: adopted. **Q3 (commit message body)**:
confirmed — WS3 commit body enumerates all items inline.
