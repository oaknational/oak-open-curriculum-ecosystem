---
fitness_line_target: 160
fitness_line_limit: 220
fitness_char_limit: 10000
fitness_line_length: 100
split_strategy: 'Keep concise — this is the operational checklist. Extract worked examples to docs/operations/<vendor>-cli-usage.md.'
---

# Vendor CLI Adoption

Canonical checklist and worked example for adopting a new vendor CLI that
participates in Oak's build, deploy, release, or operations pipelines.

**Authority**: [ADR-159 (Per-Workspace Vendor CLI Ownership with Repo-Tracked
Configuration)](../architecture/architectural-decisions/159-per-workspace-vendor-cli-ownership.md).
This doc is the operational how-to; ADR-159 is the binding decision.

## When to apply this doc

Apply the eight-point pattern to **any vendor CLI whose primary purpose is
automation** — CI, build, deploy, release, source-map upload, observability
hydration, schema sync, and anything else invoked by scripts the repo owns.

**Do not apply to purely interactive human-only CLIs** (e.g. the dev-time
`sentry` CLI used for `sentry api` and Seer). Those stay user-global and get
listed in the root README prerequisites instead.

## The eight-point checklist

Each new vendor CLI that enters an automation pipeline must satisfy all eight
points. A worked Sentry example sits in
[docs/operations/sentry-cli-usage.md](../operations/sentry-cli-usage.md).

1. **pnpm installs the binary in the owning workspace.** Declare the CLI as
   an exact-pinned `devDependency` in every workspace whose scripts invoke
   it. No caret ranges; no root hoisting; no "this workspace uses the global
   one from brew". Invocation in scripts is always `pnpm exec <cli>` (or a
   `package.json` script wrapper), never a bare binary name.

2. **Configuration lives in a repo-tracked file next to the owner.** Project
   / org / base-URL scope lives in a committed config file beside the
   workspace that owns the pipeline (e.g.
   `apps/oak-curriculum-mcp-streamable-http/.sentryclirc`). Use whatever
   format the CLI discovers natively via ancestor walk or env var — never a
   wrapper shell script that re-exports `--org`/`--project`. Secrets (auth
   tokens) arrive via environment variables only and are never committed.

3. **`onlyBuiltDependencies` lists the binary explicitly.** If the CLI ships
   a native postinstall step (the `@sentry/cli` download script is the
   prototype), add it to `onlyBuiltDependencies` in `pnpm-workspace.yaml` so
   pnpm runs the build script without prompting per-developer.

4. **`knip` ignores pnpm-exec usage explicitly.** `knip` cannot trace
   `pnpm exec <cli>` invocations inside shell scripts, so add the CLI
   dependency to `ignoreDependencies` in `knip.config.ts` for every workspace
   that declares it, with an inline comment explaining why.

5. **Shared libraries with multiple consumers do NOT pin `project`.** A
   shared library workspace consumed by multiple apps with different vendor
   projects (e.g. `packages/libs/sentry-node`) MUST NOT declare a default
   `project`. It MAY declare org / URL (invariants across consumers), but
   `project` is supplied at the call site — via a `--project` flag, a
   `SENTRY_PROJECT` env var, or ancestor-discovery from the consumer app's
   own config file. Silent cross-targeting is strictly worse than a loud
   "no project configured" error.

6. **Fail-fast preflight.** Scripts that wrap a vendor CLI MUST preflight the
   actual invocation path and any auth prerequisite (token, API key) before
   running any pipeline step. For **workspace-local pnpm-installed CLIs**
   (point 1), that means preflighting `pnpm` on `$PATH` AND running
   `pnpm exec <cli> --version >/dev/null` to confirm the CLI resolves through
   pnpm (catches the "somebody skipped `pnpm install`" case). For
   **user-global interactive CLIs** (point 8), a direct `require_command
<cli> <install-url>` PATH check is the correct shape. See
   `apps/oak-curriculum-mcp-streamable-http/scripts/upload-sourcemaps.sh`
   (pnpm-local variant) and
   `apps/oak-curriculum-mcp-streamable-http/scripts/dev-widget-in-host.sh`
   (user-global variant).

7. **Post-condition verification where symbolic correctness matters.** If
   the CLI's "success" exit code is necessary-but-not-sufficient — the
   clearest example: `sentry-cli sourcemaps upload` returns 0 even when
   Debug IDs were not injected, so symbolication silently fails at event
   time — the script MUST run a deterministic post-condition check against
   the filesystem or the vendor API and fail loudly if the post-condition is
   not met.

8. **Root README declares user-global prereqs explicitly.** The small set of
   vendor CLIs that must remain user-global (interactive dev-only tools, not
   CI pipeline tools) MUST be listed in the root README prerequisites block
   alongside `jq`, `lsof`, `bun`, and `gitleaks`, with install instructions
   and a clear statement of scope.

## Worked example

The canonical worked example is `sentry-cli` plus the dev `sentry` CLI —
each covering one of the two patterns above (automation vs interactive).
See [docs/operations/sentry-cli-usage.md](../operations/sentry-cli-usage.md)
for the full CLI usage matrix, `.sentryclirc` composition rules, auth-token
and region gotchas, and day-to-day troubleshooting.

Planned future adoptions (e.g. the Clerk CLI —
`.agent/plans/architecture-and-infrastructure/future/clerk-cli-adoption.plan.md`)
follow this same checklist.

## Why this exists

Without a clear rule, defaults drift. Binaries end up installed by whichever
human ran a command first; scope state leaks into user-global credential
stores invisible to CI and code review; scripts copy-paste `--org` /
`--project` flags that must be grepped and updated one rotation at a time;
shared libraries accrue implicit project pins that silently cross-target the
wrong consumer. ADR-159 closes each of those failure modes at its source.
