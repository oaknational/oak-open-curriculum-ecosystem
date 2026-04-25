# Sentry CLI Usage

Authoritative reference for how Oak uses the two Sentry command-line tools
that ship side-by-side today.

**Status**: active, 2026-04-21. Keyed to the upstream docs at
[docs.sentry.io/cli](https://docs.sentry.io/cli/) (sentry-cli) and
[cli.sentry.dev](https://cli.sentry.dev/) (sentry).

> **§L-8 (2026-04-21) — what changed**: the HTTP MCP server's
> Vercel-build-time release / source-map / deploy automation no longer
> runs `sentry-cli` directly. It is now driven by the vendor's
> first-party [`@sentry/esbuild-plugin`](https://docs.sentry.io/platforms/javascript/sourcemaps/uploading/esbuild/),
> wired in
> [`apps/oak-curriculum-mcp-streamable-http/esbuild.config.ts`](../../apps/oak-curriculum-mcp-streamable-http/esbuild.config.ts).
> The plugin uses `@sentry/cli` internally (still as a transitive
> dependency), so the `.sentryclirc` composition rules below still
> apply, but the bespoke `sentry-cli`-orchestrating shell + TypeScript
> wrappers (`build-scripts/sentry-release-and-deploy*.ts`,
> `scripts/upload-sourcemaps.sh`) and the `apps/oak-search-cli/.sentryclirc`
> stub have all been deleted. See ADR-163 §6 amendment 2026-04-21
> (HOW → WHAT outcomes) and §7 amendment 2026-04-21 (composition root
> replaces orchestrator). This document remains the canonical reference
> for operator / agent ad-hoc CLI use, and explains how the §6
> outcomes map onto the underlying `sentry-cli` operations the plugin
> performs internally.

## TL;DR

There are two Sentry CLIs. They are split by **purpose**, not by age, and
both are actively maintained by Sentry.

- **`sentry-cli`** — the CI/automation CLI. Distributed as `@sentry/cli`
  on npm, plus brew / curl / scoop / Docker. Drives release management,
  source-map upload, debug information files, deploys, crons, and event
  send. Config via `.sentryclirc` + env vars + flags. **This is the
  workspace-scoped tool our build and deploy automation uses.**
- **`sentry`** — the dev-time interactive CLI. Distributed via curl or
  brew (and also `npm install -g sentry`). Drives issue triage, event
  inspection, Sentry Seer (AI) explanations, and ad-hoc REST API calls
  via `sentry api`. Credentials stored in a user-global SQLite database
  at `~/.sentry/cli.db`. **This is the human/agent tool; it is not
  pnpm-installed per-workspace.**

The two tools share the `.sentryclirc` format (same `[defaults]` and
`[auth]` sections) so a committed repo-local config works for both.

## Decision table (per use case)

| Use case                                                  | Tool                                                     | Why                                                                                                                                        |
| --------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Vercel-build source-map upload + release/deploy linkage   | `@sentry/esbuild-plugin` (calls `sentry-cli` internally) | §L-8 default. Library-shaped, runs inside the esbuild build, configured by `createSentryBuildPlugin` from `process.env`. Vendor-owned HOW. |
| Local CI / ad-hoc source-map upload                       | `pnpm exec sentry-cli` (workspace-pinned binary)         | Reproducible workspace binary for operator-driven evidence runs that do not go through the Vercel Build Command                            |
| Release tagging, deploy markers, DIFs (ad-hoc / operator) | `sentry-cli`                                             | Primary operator surface; no user-global state required                                                                                    |
| Send a test event / envelope                              | `sentry-cli send-event`                                  | Drop-in for CI smoke tests against a DSN                                                                                                   |
| Dev-time issue triage / event inspect                     | `sentry`                                                 | Rich TTY output, Seer explanations, quick aliasing by project slug                                                                         |
| Ad-hoc REST API (e.g. alert rules)                        | `sentry api`                                             | `sentry-cli` has no native `api` subcommand; `sentry api` is the intended escape hatch                                                     |
| Interactive setup / guided init                           | `sentry init` / `sentry auth login`                      | Designed for humans; writes to `~/.sentry/cli.db`                                                                                          |

For the three currently Sentry-using workspaces (`apps/oak-curriculum-mcp-streamable-http`,
`apps/oak-search-cli`, `packages/libs/sentry-node`):

- The HTTP MCP server's Vercel-build automation goes through
  `@sentry/esbuild-plugin` (which calls `sentry-cli` internally).
- The Search CLI no longer carries a workspace-local `@sentry/cli`
  devDependency or `.sentryclirc` (deleted §L-8 2026-04-21); it never
  needed one because it has no Vercel Build Command and no
  build-time release-registration step. Operators can still run
  `pnpm dlx @sentry/cli` ad-hoc.
- `packages/libs/sentry-node` keeps its scoping-only `.sentryclirc`
  for operator ad-hoc use against the shared adapter package.

The dev `sentry` CLI is listed in the root [README.md](../../README.md)
prerequisites for humans and agents who want Seer, `sentry issue list`,
or `sentry api`.

## Side-by-side matrix

### Distribution and install

| Aspect         | `sentry-cli`                                                 | `sentry`                                                    |
| -------------- | ------------------------------------------------------------ | ----------------------------------------------------------- |
| npm package    | [`@sentry/cli`](https://www.npmjs.com/package/@sentry/cli)   | [`sentry`](https://www.npmjs.com/package/sentry)            |
| Homebrew       | `brew install getsentry/tools/sentry-cli`                    | `brew install getsentry/tools/sentry`                       |
| curl installer | `curl -sL https://sentry.io/get-cli/ \| sh`                  | `curl https://cli.sentry.dev/install -fsS \| bash`          |
| Docker         | `docker pull getsentry/sentry-cli`                           | Not currently published                                     |
| Monorepo shape | **pnpm devDependency per-workspace** (our Rule 3.5 position) | Root README prereq only (user-global install via brew/curl) |
| Docs home      | <https://docs.sentry.io/cli/>                                | <https://cli.sentry.dev/>                                   |

> **Why we do not pnpm-install `sentry`**: the `sentry` CLI keeps its
> credentials in a user-global SQLite database (`~/.sentry/cli.db`) by
> design, and its value add is interactive (browser-launching OAuth,
> TTY-rendered tables, Seer). Pulling it into a workspace as a
> devDependency would duplicate an interactive binary per package
> without changing how humans invoke it. The CI / automation use case
> is served by `sentry-cli`, which is explicitly designed for that
> purpose.

### Subcommand coverage

| Capability                              | `sentry-cli`                                         | `sentry`                            |
| --------------------------------------- | ---------------------------------------------------- | ----------------------------------- |
| Release create / finalize / set-commits | `releases new/finalize/set-commits`                  | `release` subcommand                |
| Deploys                                 | `deploys new/list`                                   | Via `release` / `api`               |
| Source map upload                       | `sourcemaps inject` + `sourcemaps upload` (two-step) | `sourcemap` subcommand              |
| Debug information files (DIFs)          | `debug-files upload/check`                           | Not a primary surface               |
| Code mappings upload                    | `files upload --type code-mapping`                   | Not a primary surface               |
| Send event / envelope                   | `send-event` / `send-envelope`                       | `event` subcommand (read-heavy)     |
| Crons monitoring                        | `monitors run/create/update`                         | Not a primary surface               |
| Logs view / stream                      | `logs` (read surface for ingested logs)              | `log` subcommand                    |
| Issues list / view / explain (Seer)     | Not covered                                          | `issue list/view/explain/plan`      |
| Events list / inspect                   | Not covered                                          | `event list/view`                   |
| Traces / spans                          | Not covered                                          | `trace`, `span` subcommands         |
| Dashboards                              | Not covered                                          | `dashboard` subcommand              |
| Teams / orgs / projects / repos         | `organizations`, `projects`, `repos`                 | `org`, `project`, `team`, `repo`    |
| Ad-hoc REST API                         | ❌ not exposed — use `curl`                          | ✅ `sentry api <path> -X METHOD …`  |
| Guided init                             | `login` only                                         | `init` (experimental), `auth login` |
| OAuth device flow                       | Not supported                                        | ✅ `sentry auth login`              |

### Authentication and configuration model

| Aspect                   | `sentry-cli`                                                           | `sentry`                                                              |
| ------------------------ | ---------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Primary auth             | `SENTRY_AUTH_TOKEN` env or `[auth] token` in `.sentryclirc`            | OAuth device flow via `sentry auth login` (writes `~/.sentry/cli.db`) |
| CI-friendly auth         | Organization auth token in env                                         | `SENTRY_AUTH_TOKEN` + optional `SENTRY_FORCE_ENV_TOKEN=1`             |
| Credential storage       | Text (`~/.sentryclirc` or `[auth] token=` in the file the user writes) | SQLite at `~/.sentry/cli.db` (mode 600)                               |
| Config file              | `.sentryclirc` (INI, ancestor-discovered)                              | `.sentryclirc` (INI, ancestor-discovered) — same format               |
| Persistent user defaults | Not supported                                                          | `sentry cli defaults <org\|project\|url\|...>` (writes to `cli.db`)   |
| Env var for base URL     | `SENTRY_URL`                                                           | `SENTRY_HOST` (preferred) or `SENTRY_URL`                             |
| Env vars for scope       | `SENTRY_ORG`, `SENTRY_PROJECT`                                         | `SENTRY_ORG`, `SENTRY_PROJECT` (accepts `org/project` shorthand)      |
| Per-invocation override  | `--org` / `--project` / `--url`                                        | `--org` / `--project` / `--url` (varies per command)                  |

### Tokens and regions

Oak is an EU (`de.sentry.io`) tenant. Two token-shape details matter
for both CLIs:

1. **Organization auth tokens (`sntrys_…`) embed the issuing region in
   the token itself.** At runtime the CLI will prefer that embedded
   region over the explicitly-configured `url = https://de.sentry.io`
   in `.sentryclirc`, and emit a warning such as "`Using
https://sentry.io (embedded in token) rather than
manually-configured URL https://de.sentry.io`". The warning is
   load-bearing: a token minted against `sentry.io` and reused against
   a `de.sentry.io` workspace WILL succeed because Sentry routes the
   request based on the token's region, but scoping / routing is no
   longer driven by repo-tracked config.
2. **Always mint rotating tokens from the `de.sentry.io` UI**
   (Settings → Developer Settings → Auth Tokens on the EU host) so
   the embedded region matches the committed `url`. If you ever see
   the region warning, treat it as a rotation signal — not as noise.

This is the single biggest scoping gotcha when following
`.sentryclirc`-first guidance; the evidence notes under
`.agent/plans/architecture-and-infrastructure/evidence/2026-04-16-http-mcp-sentry-validation/`
record a real occurrence.

### Authentication onboarding

To get from zero to a working `pnpm exec sentry-cli sourcemaps upload`:

1. **Pick a token type**:
   - For CI / automation / local source-map uploads → **organization
     auth token** (`sntrys_…`), minted from `de.sentry.io → Settings →
Developer Settings → Auth Tokens` with at minimum scopes
     `project:releases`, `project:read`, and `org:read`. This is the
     token Oak uses today.
   - For interactive dev use of the `sentry` CLI (Seer, `sentry api`,
     etc.) → run `sentry auth login`, which writes `~/.sentry/cli.db`.
     No manual token handling required for humans, but CI must still
     use an org auth token.
2. **Where to place the token**:
   - Locally: `apps/oak-curriculum-mcp-streamable-http/.env.local`
     under `SENTRY_AUTH_TOKEN=…` (never commit).
   - Vercel: project Environment Variables for the HTTP MCP server
     deployment (see `docs/operations/sentry-deployment-runbook.md` §"Configure Environment Variables").
3. **Rotation cadence**: treat org auth tokens as rotating
   credentials. The "Region warning is a rotation signal" rule above
   is the main operational trigger; otherwise follow the team's
   standard credential rotation policy.

## `.sentryclirc` composition — the monorepo answer

This is the question Phase 1 was asked to close, because it decides the
shape of workspace-local scoping config.

**Both CLIs walk up the filesystem from CWD to the root looking for
`.sentryclirc` files, with nearest-wins merge and `~/.sentryclirc` as a
global fallback.** The upstream docs describe the same composition
model on both sides:

- `sentry-cli` ([docs.sentry.io/cli/configuration/](https://docs.sentry.io/cli/configuration/)):
  > "The config file is looked for upwards from the current path and
  > defaults from `~/.sentryclirc` are always loaded. You can also
  > override these settings from command line parameters."
- `sentry` ([cli.sentry.dev/configuration/](https://cli.sentry.dev/configuration/)):
  > "The CLI looks for `.sentryclirc` files by walking up from your
  > current directory toward the filesystem root. If multiple files are
  > found, values from the closest file take priority, with
  > `~/.sentryclirc` serving as a global fallback."
  >
  > "In monorepos, place a `.sentryclirc` at the repo root with your
  > org, then add per-package configs with just the project"

This composes cleanly for our layout. Concretely, we can commit one
`.sentryclirc` per Sentry-using workspace, each pinning
`[defaults] org`, `project`, and `url`, and the nearest-wins rule
guarantees that a command run inside workspace A cannot accidentally
reach workspace B's Sentry project.

Resolution priority, verbatim from
[cli.sentry.dev/configuration/](https://cli.sentry.dev/configuration/)
§"Resolution Priority" for the new CLI (and consistent with the
legacy CLI's published precedence for rungs 2-4 and 6):

1. **Credential Storage** — new-CLI only; token/org/project captured
   via `sentry auth login` and stored in `~/.sentry/cli.db`. Sits
   ABOVE `.sentryclirc` in the order, so a prior `sentry auth login`
   can override repo-tracked scoping. This is the "user-global state
   masquerading as infrastructure" surface that Rule 3.5 is most
   allergic to.
2. **Explicit CLI arguments** — `--org`, `--project`, `--url`.
3. **Environment variables** — `SENTRY_ORG`, `SENTRY_PROJECT`,
   `SENTRY_URL` / `SENTRY_HOST`.
4. **`.sentryclirc`** walked up from CWD, merged with `~/.sentryclirc`.
5. **Persistent defaults** — new-CLI only; values written via
   `sentry cli defaults <key> <value>` and stored in `~/.sentry/cli.db`.
   Sits BELOW `.sentryclirc` in the order.
6. **DSN auto-detection** — new-CLI only.
7. **Directory name inference** — new-CLI only; best avoided, add
   explicit scoping in `.sentryclirc` or env vars instead.

> **Corollary for Rule 3.5 hygiene** — split by which `cli.db` surface
> you are talking about:
>
> - `cli.db` **persistent defaults** (rung 5) sit BELOW `.sentryclirc`,
>   so a committed per-workspace `.sentryclirc` already overrides any
>   stale `sentry cli defaults project …` a maintainer may have set.
>   The user-global project pin is then redundant (and arguably
>   harmful — it is user-global state masquerading as infrastructure
>   config); remove it once the repo-local equivalents land.
> - `cli.db` **credential storage** (rung 1) sits ABOVE `.sentryclirc`,
>   so a prior `sentry auth login` can still override repo-tracked
>   scoping on the dev CLI even after Phase 2c cleanup. The only
>   reliable way to enforce repo-tracked scoping against the dev CLI
>   is to pass `--org` / `--project` / `--url` explicitly (rung 2) or
>   set the matching env vars (rung 3). Phase 2c did not address this
>   surface, and does not need to as long as automation stays on
>   `sentry-cli`.

## Ad-hoc REST API calls

`sentry-cli` does not expose a generic `api` subcommand. When
automation needs to reach a REST endpoint not wrapped by a dedicated
subcommand, the idiomatic options are:

1. **`sentry api`** (if run by a human/agent who already has
   `~/.sentry/cli.db` populated via `sentry auth login`). Example
   against the modern (non-deprecated) org-scoped alerts endpoint:

   ```bash
   sentry api organizations/oak-national-academy/combined-rules/
   ```

2. **`curl` + `SENTRY_AUTH_TOKEN`** (portable across CI / agents with
   no interactive login). Example:

   ```bash
   curl -fsSL \
     -H "Authorization: Bearer ${SENTRY_AUTH_TOKEN}" \
     "${SENTRY_URL:-https://de.sentry.io}/api/0/organizations/oak-national-academy/combined-rules/"
   ```

Both paths hit the same endpoints documented at
<https://docs.sentry.io/api/>. The CLIs do not materially change what
is reachable — they just change ergonomics.

> **Note on deprecated endpoints**: the project-scoped
> `projects/{org}/{project}/alert-rules/` endpoint still works but
> carries a deprecation notice in the upstream API reference (see
> <https://docs.sentry.io/api/alerts/list-a-projects-issue-alert-rules>).
> Prefer org-scoped `organizations/{org}/combined-rules/` (issue +
> metric alerts) and `organizations/{org}/monitors/` (cron / uptime)
> for new tooling.

## Per-workspace ownership in this repo

The two Sentry-using workspaces that still need scoping pins each
commit a `.sentryclirc`:

- [`apps/oak-curriculum-mcp-streamable-http/.sentryclirc`](../../apps/oak-curriculum-mcp-streamable-http/.sentryclirc)
  → project `oak-open-curriculum-mcp`. Used by `@sentry/esbuild-plugin`
  at build time as a fallback for any field not passed in
  `sentryEsbuildPlugin({ … })` directly, and by operators who run
  `pnpm exec sentry-cli` ad-hoc from this workspace. The plugin and
  the CLI share `.sentryclirc` resolution because the plugin uses
  `@sentry/cli` internally.
- [`packages/libs/sentry-node/.sentryclirc`](../../packages/libs/sentry-node/.sentryclirc)
  → readiness-only; intentionally omits `project`. The package is a
  shared adapter consumed by both apps, so it has no correct default
  target. Any ad-hoc CLI invocation run from inside this directory
  must supply `--project` (or `SENTRY_PROJECT`) explicitly; this
  fail-fast posture is preferred over silent cross-targeting.

`@sentry/cli` is no longer a direct workspace `devDependency`. It now
arrives transitively via `@sentry/esbuild-plugin` in the HTTP MCP
server, so `pnpm exec sentry-cli` continues to resolve from that
workspace; in other workspaces, prefer `pnpm dlx @sentry/cli` for
ad-hoc invocations. `SENTRY_AUTH_TOKEN` is supplied via env, never
committed.

## Canonical invocations

### Upload source maps (Vercel build, automation)

Sentry matches uploaded source maps to runtime events via Debug IDs
embedded in the deployed JS, not release strings. As of §L-8
(2026-04-21) this is performed inside the esbuild build by
`@sentry/esbuild-plugin`; no separate CLI shell step is involved. See
<https://docs.sentry.io/platforms/javascript/sourcemaps/uploading/esbuild/>
for the upstream guide.

The composition root in
[`apps/oak-curriculum-mcp-streamable-http/esbuild.config.ts`](../../apps/oak-curriculum-mcp-streamable-http/esbuild.config.ts)
asks
[`build-scripts/sentry-build-plugin.ts`](../../apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-build-plugin.ts)
to map ADR-163 §3 / §4 policy onto the plugin's `release` and
`sourcemaps` fields, then injects the plugin into the esbuild build
options. The plugin internally performs the equivalent of:

```bash
# Library-equivalent of these CLI steps, run by @sentry/esbuild-plugin
# from inside the esbuild build (do NOT run by hand on Vercel):
pnpm exec sentry-cli sourcemaps inject  "$DIST_DIR"
pnpm exec sentry-cli sourcemaps upload  --release "$VERSION" "$DIST_DIR"
```

with `dist/**/*.js.map` deleted post-upload (per
`sourcemaps.filesToDeleteAfterUpload` in the plugin config) so
deployed `dist/` ships hidden source-maps only.

### Upload source maps (operator / local evidence)

When operators need to regenerate evidence locally without going
through the Vercel Build Command, the same two-step CLI pipeline is
the supported manual path. The MCP app's `.sentryclirc` supplies
`org`, `project`, and `url`; `SENTRY_AUTH_TOKEN` is read from the
environment.

```bash
# Step 1: inject Debug IDs into .js and .map files under $DIST_DIR.
pnpm exec sentry-cli sourcemaps inject "$DIST_DIR"

# Step 2: assemble and upload the artefact bundle keyed by those IDs.
pnpm exec sentry-cli sourcemaps upload --release "$RELEASE" "$DIST_DIR"
```

- `$RELEASE` is the ADR-163 per-environment release projection (never the git
  SHA): production-on-`main` app version, preview / production-from-non-main
  branch URL host, development `dev-<shortSha>`, or an explicit
  `SENTRY_RELEASE_OVERRIDE`. See
  [ADR-163 §1–§2](../architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md).
- `--release` is a convenience tag (surfaces the bundle in the
  release UI and drives weak association); the match key is the
  Debug ID.
- Add `--dist "$DIST_TAG"` when a single release is deployed to more
  than one distribution surface (e.g. multiple Vercel regions or
  preview-vs-production slots sharing a release). Omit it for the
  common single-distribution case.

> **Verification**: after the inject step, grep for at least one
> `//# debugId=` comment in `$DIST_DIR` before uploading. Without
> that check, "upload succeeded" is a necessary but not sufficient
> signal for working symbolication.

### Release → commit → deploy linkage (Vercel build, automation)

**Authoritative mechanism**:
[ADR-163](../architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md)
§6 specifies the required outcomes and per-step error-handling
posture; the ADR wins on any divergence.

§L-8 (2026-04-21) replaces the bespoke TypeScript orchestrator
(deleted: `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-release-and-deploy*.ts`)
with `@sentry/esbuild-plugin` configured by the esbuild composition
root. The plugin performs the equivalent of the §6.0–§6.6 sequence
internally, using `@sentry/cli` as a library. The CLI calls below are
the operations the plugin runs internally; they are documented here
so operators can correlate Vercel build-log lines with the §6 outcome
each line represents — they are NOT a recipe operators are expected
to invoke by hand on the Vercel build.

```bash
# Library-equivalent of the §6.0–§6.6 outcomes, run by
# @sentry/esbuild-plugin from inside the esbuild build:

# §6.0 — release upsert. The plugin's release.name field is set;
# re-running the same identity is a no-op and the original deploy's
# commit attribution is preserved (ADR-163 §5 invariant).
pnpm exec sentry-cli releases new "$VERSION"

# §6.2 — explicit set-commits with --commit org/repo@sha. The plugin
# rejects --auto (per release.setCommits.auto = false), matching
# ADR-163 Alt 8.
pnpm exec sentry-cli releases set-commits "$VERSION" \
  --commit "oaknational/oak-open-curriculum-ecosystem@$VERCEL_GIT_COMMIT_SHA"

# §6.3-§6.4 — Debug-ID inject + artefact-bundle upload (as above).
pnpm exec sentry-cli sourcemaps inject "$DIST_DIR"
pnpm exec sentry-cli sourcemaps upload --release "$VERSION" "$DIST_DIR"

# §6.5 — finalize the release (release.finalize = true).
pnpm exec sentry-cli releases finalize "$VERSION"

# §6.6 — emit deploy event for the resolved environment
# (release.deploy.env from resolveSentryEnvironment).
pnpm exec sentry-cli deploys new --release "$VERSION" -e "$DERIVED_ENV"
```

- `$VERSION` is the root `package.json` semver.
- `$VERCEL_GIT_COMMIT_SHA` is metadata; it is never used as the
  release identifier.
- `$DERIVED_ENV` is computed from `VERCEL_ENV` + `VERCEL_GIT_COMMIT_REF`
  per the [ADR-163 §3 truth table](../architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md#3-production-attribution-requires-both-vercel_envproduction-and-vercel_git_commit_refmain).
- The legacy form `sentry-cli releases deploys "$VERSION" new -e $ENV`
  is not used. One form only: `sentry-cli deploys new --release …`.

Operator-driven re-runs of any individual step (e.g. to back-fill
commit attribution) use the same `pnpm exec sentry-cli …` shape from
within the MCP app workspace; that path remains supported even though
the Vercel-build path no longer shells out to the CLI directly.

### Enumerate alert rules (ad-hoc)

```bash
# Preferred when the dev CLI is available. `combined-rules` returns
# both issue-alert and metric-alert configurations for the org.
sentry api organizations/oak-national-academy/combined-rules/ | jq .

# Portable fallback
curl -fsSL \
  -H "Authorization: Bearer ${SENTRY_AUTH_TOKEN}" \
  https://de.sentry.io/api/0/organizations/oak-national-academy/combined-rules/ | jq .
```

### Triage an issue (dev)

```bash
sentry issue list
sentry issue view <SHORT-ID>
sentry issue explain <SHORT-ID>
```

## Artefact bundles vs releases

Under current Sentry guidance the primary source-map primitive is
the **artefact bundle**, keyed by **Debug ID**, with **weak release
association**. What this means in practice for Oak:

| Concept             | Key                                  | Lifecycle                                     |
| ------------------- | ------------------------------------ | --------------------------------------------- |
| Artefact bundle     | Debug IDs embedded in `.js` / `.map` | Created by `sentry-cli sourcemaps upload`     |
| Release (optional)  | Release string (e.g. commit SHA)     | Created by `sentry-cli releases new/finalize` |
| Runtime event match | Debug ID from the thrown stack frame | Resolved server-side at event ingestion time  |

Notes:

- A release is NOT required for symbolication. `--release` on
  `sourcemaps upload` creates a weak association that drives deploy
  markers and release-health signals, nothing more.
- The historical "upload to release X, then events for release X get
  maps" flow has been replaced. Debug IDs are the primary key now.
- `sentry-cli releases new/finalize/set-commits` remains useful for
  deploy markers and release-health, and Oak still uses release tags
  for runtime `@sentry/node` event tagging via `resolveSentryRelease`.
  That tagging is what drives the release-UI view of events; the
  source-map match is orthogonal.

See
<https://docs.sentry.io/platforms/javascript/sourcemaps/troubleshooting_js/debug-ids/>
for upstream rationale.

## Troubleshooting

### "Using <https://sentry.io> (embedded in token) rather than manually-configured URL <https://de.sentry.io>"

Your `SENTRY_AUTH_TOKEN` was minted against the `sentry.io` UI rather
than the `de.sentry.io` UI. The upload will still succeed (Sentry
routes the request based on the token's embedded region) but scoping
is no longer driven by repo-tracked config. Rotate the token by
re-minting it from Settings → Developer Settings → Auth Tokens on
`de.sentry.io`. See "Tokens and regions" above.

### "SENTRY_AUTH_TOKEN is not set"

The upload script intentionally refuses to run without a token.
Export one locally via `.env.local` (or `direnv`), or set it as a
CI / Vercel environment variable. Do NOT add `[auth] token=` to any
tracked `.sentryclirc` file.

### "Which CLI should this script use?"

If the caller is automation (CI, a pnpm script, a shell wrapper),
use `sentry-cli` via `pnpm exec` — no user-global state, workspace
scoping is reproducible. If the caller is a human at a TTY doing
ad-hoc triage, reach for `sentry` instead; it has `sentry api`, Seer
explanations, and interactive OAuth. See "Decision table" above.

### Confirming composition

`sentry-cli` does not have an `info`-style subcommand that dumps
resolved `.sentryclirc` values, but you can verify composition
implicitly by running any scope-sensitive command with `--log-level
debug` (for example `pnpm exec sentry-cli --log-level debug info`
from the target workspace). The first few log lines list the
resolved org / project / url / auth source, which is enough to
confirm that the workspace `.sentryclirc` is being picked up and
that `--org` / `--project` / env overrides (if any) are visible.

### CI vs local invocation

Both environments use the same `pnpm exec sentry-cli …` command
shape; the difference is only how `SENTRY_AUTH_TOKEN` is supplied:

- **CI (Vercel, GitHub Actions)**: token set as a project / repo
  environment variable.
- **Local evidence generation**: token in `.env.local` (never
  committed), loaded into the shell before invoking `pnpm
sourcemaps:upload`.

The committed `.sentryclirc` is identical across both paths, which
is the whole point of the hygiene lane.

### Pipeline boundary: where `sentry-cli` runs — and where it does not

Vendor CLI invocations (including `sentry-cli`) carry network side
effects. The repo's testing taxonomy separates side-effectful
operations from deterministic gates; `sentry-cli` invocations must
respect that separation.

| Pipeline                                                     | Sentry network calls?   | Reason                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------------------------------------------ | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GitHub Actions PR / push checks (unit + integration)         | **No**                  | Per [testing-strategy.md](../../.agent/directives/testing-strategy.md), unit and integration tests do not trigger IO and have no side effects. Any `sentry-cli` invocation (or `@sentry/esbuild-plugin` invocation) would violate that contract: it makes outbound network calls to Sentry, and a Sentry outage would break PR gating for reasons unrelated to code quality.                                                     |
| E2E tests (`*.e2e.test.ts`)                                  | **No**                  | Per testing-strategy.md, E2E tests run against an in-process running system with stdio IO only — not filesystem or network IO.                                                                                                                                                                                                                                                                                                   |
| Vercel Build Command (HTTP MCP server)                       | **Yes**                 | `@sentry/esbuild-plugin` runs inside the build whenever the registration policy returns `registerRelease=true` (preview + production deploys). `SENTRY_AUTH_TOKEN` is set on the Vercel project environment. The plugin performs the §6.0–§6.6 outcomes itself; no separate predeploy/postdeploy `sentry-cli` invocation is wired. Local builds skip registration unless the `SENTRY_RELEASE_REGISTRATION_OVERRIDE` pair is set. |
| Local evidence generation                                    | **Yes**                 | Operator-initiated; token loaded from `.env.local`. Either run the MCP app's `build` script (which exercises `@sentry/esbuild-plugin`) or invoke `pnpm exec sentry-cli …` directly for individual steps.                                                                                                                                                                                                                         |
| Smoke tests (explicitly invoked, never on the PR-check path) | **Yes, on-demand only** | Per testing-strategy.md, smoke tests verify a fully running system locally or deployed, can trigger all IO types, and have side effects. A smoke test that exercises `sentry-cli send-event` or similar is legitimate here but must be explicitly triggered, never attached to the PR gate.                                                                                                                                      |

This is not Sentry-specific — the same boundary applies to any
vendor CLI that touches the network (`clerk`, future ES management
CLI, any other marketplace CLI). Keep PR-check pipelines network-free
regardless of vendor.

Operationally: when a PR-check run logs a Sentry event because a
`sentry-cli` call happened, that is a pipeline-boundary defect. Fix
by moving the invocation into the deploy pipeline or behind a
manual flag; do not silence the log.

## Cross-references

- [ADR-159: Per-Workspace Vendor CLI Ownership with Repo-Tracked
  Configuration](../architecture/architectural-decisions/159-per-workspace-vendor-cli-ownership.md)
  — the canonical decision this document operationalises.
- [ADR-143: Coherent Structured Fan-Out for
  Observability](../architecture/architectural-decisions/143-coherent-structured-fan-out-for-observability.md)
  — the parent observability architecture.
- [ADR-010: tsup for
  Bundling](../architecture/architectural-decisions/010-tsup-for-bundling.md)
  — historical context for the post-build `sentry-cli` step. Superseded
  for the HTTP MCP server by the §L-8 esbuild-native build (2026-04-21);
  see ADR-163 §6 + §7 amendments for the current mechanism.
- [Sentry Deployment Runbook](./sentry-deployment-runbook.md) — how
  Sentry is wired into each runtime at deploy time.
- Parent plan:
  [`sentry-otel-integration.execution.plan.md`](../../.agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md).
- Upstream docs:
  - <https://docs.sentry.io/cli/>
  - <https://docs.sentry.io/cli/configuration/>
  - <https://cli.sentry.dev/>
  - <https://cli.sentry.dev/configuration/>
  - <https://cli.sentry.dev/commands/api/>
