# ADR-159: Per-Workspace Vendor CLI Ownership with Repo-Tracked Configuration

**Status**: Accepted
**Date**: 2026-04-17
**Related**: [ADR-143](143-coherent-structured-fan-out-for-observability.md) —
coherent structured fan-out for observability;
[ADR-154](154-separate-framework-from-consumer.md) — framework /
consumer separation, load-bearing rationale for point 5 (shared
libraries with multiple consumers MUST NOT pin a default `project`);
[ADR-010](010-tsup-for-bundling.md) — tsup for bundling (source map
upload uses `sentry-cli` post-build);
[docs/operations/sentry-cli-usage.md](../../operations/sentry-cli-usage.md) —
canonical CLI usage matrix and `.sentryclirc` composition rules.

## Context

Several vendor CLIs participate in Oak build and operations pipelines
(currently `sentry-cli`; in the near future `clerk` —
see [`.agent/plans/architecture-and-infrastructure/future/clerk-cli-adoption.plan.md`](../../../.agent/plans/architecture-and-infrastructure/future/clerk-cli-adoption.plan.md)).
Each one presents the same recurring ownership question:

- **Where is the binary installed?** User-global (brew / curl / Docker),
  root-hoisted `devDependency`, or workspace-local `devDependency`?
- **Where is the project / org scope configured?** Via CLI flags in every
  script, via environment variables, via a user-global credential/config
  store (for example `~/.sentry/cli.db`, or any analogous vendor-owned
  path), or via a repo-tracked configuration file next to the workspace
  that owns the pipeline?
- **How do shared libraries that are consumed by multiple apps with
  different vendor projects behave?** A shared adapter package (for
  example `@oaknational/sentry-node`) is consumed by
  `apps/oak-curriculum-mcp-streamable-http` (Sentry project
  `oak-open-curriculum-mcp`) AND `apps/oak-search-cli` (project
  `oak-open-curriculum-search-cli`). A single default target would
  silently cross-target the wrong consumer.

Without a clear rule, the defaults drift:

- Binaries end up installed by whichever human happened to run a command
  first, with no machine-checkable declaration of which version is in
  use.
- Scope state leaks into `~/.<vendor>/` credential stores where it is
  invisible to CI, invisible to code review, and can silently override
  explicit per-workspace configuration.
- Scripts copy-paste `--org` / `--project` flags instead of inheriting
  from configuration, so rotating an org slug or moving a project means
  grepping and editing many call sites.
- Shared libraries accrete "default" project pins that privilege one
  consumer and mis-target the others the next time somebody runs the
  CLI from inside the library workspace.

This ADR captures the pattern we already apply to `sentry-cli`, formalises
it, and makes it the default for all future vendor CLI adoption.

## Decision

Adopt the following **per-workspace vendor CLI ownership pattern** for
every vendor CLI whose primary purpose is build, deploy, release, or
operations automation (i.e. CLIs invoked by scripts the repo owns —
NOT interactive, human-only CLIs like the dev `sentry` CLI used for
`sentry api` / Seer, which remain user-global dependencies declared in
the root README prerequisites).

1. **pnpm installs the binary in the owning workspace.** The CLI MUST
   be declared as an exact-pinned `devDependency` in the
   `package.json` of every workspace whose scripts invoke it. No
   caret ranges; no root hoisting; no "this workspace uses the global
   one from brew". Invocation from our scripts is always `pnpm exec
<cli>` (or a package.json script wrapper), never a bare binary
   name that relies on `$PATH` discovery.

2. **Configuration lives in a repo-tracked file next to the owner.**
   Project / org / base-URL scope MUST live in a committed
   configuration file beside the workspace that owns the pipeline
   (for example `apps/oak-.../.sentryclirc`). The format is whatever
   the vendor CLI discovers natively via ancestor-walk or explicit
   env var — NOT a wrapper shell script that re-exports
   `--org`/`--project`. Secrets (auth tokens) are supplied via
   environment variables only and are never committed.

3. **`onlyBuiltDependencies` lists the binary explicitly.** Any CLI
   that ships a native postinstall step (e.g. `@sentry/cli` running
   its download script) MUST be added to `onlyBuiltDependencies` in
   `pnpm-workspace.yaml` so pnpm allows the build script to run
   without prompting per-developer.

4. **`knip` ignores pnpm-exec usage explicitly.** `knip` cannot trace
   `pnpm exec <cli>` invocations inside shell scripts (knip only
   analyses JS/TS sources), so the CLI dependency MUST be added to
   `ignoreDependencies` in `knip.config.ts` for every workspace that
   declares it, with an inline comment explaining why. This preserves
   the "no unused dependencies" gate without teaching knip to read
   shell.

5. **Shared libraries with multiple consumers do NOT pin `project`.**
   A shared library workspace (e.g. `packages/libs/sentry-node`) that
   is consumed by multiple apps whose vendor projects differ MUST NOT
   declare a default `project` in its workspace config file. It MAY
   declare org/URL (those are invariant across consumers), but
   `project` MUST be supplied explicitly at the call site (either a
   `--project` flag, a `SENTRY_PROJECT` env var, or ancestor-discovery
   from the consumer app's own `.sentryclirc`). Silent cross-targeting
   into the wrong consumer's project is strictly worse than a loud
   "no project configured" error.

6. **Fail-fast preflight.** Scripts that wrap a vendor CLI MUST
   preflight the actual invocation path and any auth prerequisite
   (e.g. `$SENTRY_AUTH_TOKEN`) and fail fast with an actionable error
   (install pointer, token pointer) before running any pipeline step.
   For **workspace-local pnpm-installed CLIs** (point 1 above), that
   means preflighting `pnpm` on `$PATH` via the
   `require_command "pnpm" "<install-url>"` pattern **AND** running
   `pnpm exec <cli> --version >/dev/null` to confirm the CLI actually
   resolves through pnpm (catches the "somebody skipped `pnpm
install`" case). A bare PATH check for the vendor binary itself is
   NOT sufficient and NOT appropriate for pnpm-local CLIs. For
   **user-global interactive CLIs** (point 8 below), a direct
   `require_command "<cli>" "<install-url>"` PATH check is the
   correct shape. The `require_command` helper is currently
   replicated inline at the top of each script; see
   [`apps/oak-curriculum-mcp-streamable-http/scripts/dev-widget-in-host.sh`](../../../apps/oak-curriculum-mcp-streamable-http/scripts/dev-widget-in-host.sh)
   for the user-global variant. The historical pnpm-local variant
   (`apps/oak-curriculum-mcp-streamable-http/scripts/upload-sourcemaps.sh`)
   was deleted §L-8 (2026-04-21) when the HTTP MCP server moved to
   `@sentry/esbuild-plugin` for Vercel-build source-map upload + release
   linkage; the equivalent fail-fast posture (preflight env, fail on
   missing token / SHA / policy violation) is now enforced inside
   `createSentryBuildPlugin` returning a tagged `Result` error before
   the plugin is injected into the esbuild build options. See ADR-163
   §6 amendment 2026-04-21.

7. **Post-condition verification where symbolic correctness matters.**
   Where the CLI's "success" exit code is necessary-but-not-sufficient
   (the clearest example: `sentry-cli sourcemaps upload` reports
   success even when Debug IDs were not injected, so symbolication
   will silently fail at event time), the script MUST run a
   deterministic post-condition check against the filesystem or the
   vendor API and fail loudly if the observable post-condition is not
   met.

8. **Root README declares user-global prereqs explicitly.** The small
   set of vendor CLIs that must remain user-global (because they are
   interactive dev-only tools, not CI pipeline tools) MUST be listed
   in the root `README.md` prerequisites block alongside `jq`,
   `lsof`, `bun`, and `gitleaks`, with install instructions and a
   clear statement of scope ("used only for `sentry api` / Seer from
   a developer shell", etc.).

## Rationale

This pattern is a direct application of the existing `principles.md`
tenets to vendor CLI tooling:

- **"pnpm for monorepo definitions and package management"** — making
  the binary a `devDependency` means the lockfile pins the exact
  version CI uses, the version new developers get on `pnpm install`,
  and the version quality gates assert against. No drift between
  "what the docs say to brew-install" and "what the CI runner
  actually runs".
- **"No shims, no hacks, no workarounds"** — wrapping `pnpm exec
sentry-cli ...` in a bash script that re-exports `--org` /
  `--project` would be exactly the kind of shim-for-convenience the
  principles forbid. The CLIs we use (`sentry-cli`, `clerk`) already
  ship native ancestor-discovery config files — we use that mechanism
  directly.
- **"Fail FAST with helpful error messages"** — `require_command`
  preflights and Debug ID post-conditions replace silent
  misconfiguration (wrong region, missing token, missing
  symbolication) with loud, actionable error output before or
  immediately after the CLI call.
- **Framework/consumer separation (ADR-154)** — shared libraries are
  framework code; apps are consumer code. Pinning a project in a
  shared library inverts that direction and privileges one consumer.
  The library declares what is invariant (org, URL); the app
  declares what is specific (project).
- **"No absolute paths, no user-global state masquerading as
  infrastructure"** — `~/.sentry/cli.db`-style credential stores
  become infrastructure-by-accident if anyone ever runs `sentry auth
login` locally. Repo-tracked config beats user-global state for
  ancestor-discovery-reachable settings; for credentials, environment
  variables are the canonical surface (never `cli.db`).

The explicit `knip` and `onlyBuiltDependencies` steps are the practical
consequences of choosing pnpm-local-install — without them, the first
contributor to run the aggregate quality gate hits false-positive
`knip` failures or `pnpm install` prompts, and the pattern gets
silently abandoned.

## Consequences

### Positive

- One machine-checkable source of truth for vendor CLI version
  (lockfile) and project scope (repo-tracked config file).
- New contributors get the correct CLI version and correct scope
  automatically on `pnpm install` and `cd` into the app workspace;
  no per-developer onboarding step beyond the one auth-token env
  var.
- Rotating an org slug or project ID is a single repo-tracked edit,
  not a grep-and-replace across scripts.
- CI and local behaviour are identical by construction — the only
  per-environment difference is the auth-token env var.
- Shared libraries cannot silently cross-target the wrong consumer's
  vendor project.
- `pnpm check` (aggregate quality gate) stays green: `knip`
  understands the dependency is intentional even though it cannot
  trace shell invocations.

### Negative

- Each new vendor CLI adoption has to touch four surfaces at once
  (`package.json` devDep, `pnpm-workspace.yaml`
  `onlyBuiltDependencies`, workspace `.<vendor>rc`, `knip.config.ts`
  ignore). This ADR exists in part to make that checklist
  non-obvious-to-forget.
- Lockfile churn when a CLI is upgraded is slightly larger than it
  would be for a user-global install, but that is the same trade-off
  we accept for every other `devDependency`.
- CLIs that ship very large native binaries (for example `sentry-cli`
  at ~30MB) consume more `node_modules` disk per workspace than a
  single user-global install. In practice this is dwarfed by other
  monorepo `node_modules` size; it is explicitly acceptable.

### Neutral

- The interactive `sentry` dev CLI (distinct from `sentry-cli`) stays
  user-global, declared in the root README. This is an intentional
  asymmetry: the interactive CLI's value is being always-available
  in any shell for `sentry api` / Seer, not being pinned in the
  lockfile.
- Future vendor CLIs that are purely interactive (authoring,
  triage, observability exploration) may also remain user-global;
  this ADR only binds CLIs that participate in pipelines the repo
  owns.

## Implementation Notes

Concrete realisation for `sentry-cli` (the first CLI adopting this
pattern end-to-end):

- Declared as `"@sentry/cli": "3.3.5"` (exact pin) in the three
  workspaces that use it:
  [`apps/oak-curriculum-mcp-streamable-http/package.json`](../../../apps/oak-curriculum-mcp-streamable-http/package.json),
  [`apps/oak-search-cli/package.json`](../../../apps/oak-search-cli/package.json),
  [`packages/libs/sentry-node/package.json`](../../../packages/libs/sentry-node/package.json).
- Added to `onlyBuiltDependencies` in
  [`pnpm-workspace.yaml`](../../../pnpm-workspace.yaml).
- Added to `ignoreDependencies` in
  [`knip.config.ts`](../../../knip.config.ts) for all three
  workspaces, with inline comments.
- Per-workspace `.sentryclirc` files committed:
  - `apps/oak-curriculum-mcp-streamable-http/.sentryclirc` —
    org/project/url pinned to the MCP HTTP server project.
  - `apps/oak-search-cli/.sentryclirc` — org/project/url pinned to
    the search CLI project.
  - `packages/libs/sentry-node/.sentryclirc` — org + url only,
    `project` intentionally not pinned (point 5 above).
- Source map upload during Vercel builds is performed by
  [`@sentry/esbuild-plugin`](https://docs.sentry.io/platforms/javascript/sourcemaps/uploading/esbuild/)
  inside the MCP app's esbuild composition root (see ADR-163 §6 + §7
  amendments 2026-04-21). The earlier dedicated
  `apps/oak-curriculum-mcp-streamable-http/scripts/upload-sourcemaps.sh`
  wrapper was deleted as part of §L-8; the two-step `sourcemaps inject`
  → `sourcemaps upload` flow, the `require_command` preflights, and
  the `//# debugId=` post-condition are now performed by the plugin
  internally during the build.
- Full CLI usage matrix, `.sentryclirc` composition rules, token /
  region gotchas, and troubleshooting live in
  [`docs/operations/sentry-cli-usage.md`](../../operations/sentry-cli-usage.md).
- Dev-only `sentry` CLI declared as a root
  [`README.md`](../../../README.md) prerequisite (optional,
  interactive use only).

The planned Clerk CLI adoption
([`.agent/plans/architecture-and-infrastructure/future/clerk-cli-adoption.plan.md`](../../../.agent/plans/architecture-and-infrastructure/future/clerk-cli-adoption.plan.md))
is expected to apply this same pattern; that plan references this
ADR as the canonical decision.
