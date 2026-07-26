# Build System

This document describes the monorepo build system, quality gate commands, and their design rationale.

## Overview

The build system uses:

- **pnpm** - Package manager and workspace orchestration
- **Turborepo** - Task runner with caching and dependency management
- **tsup** - TypeScript bundler for libraries and apps

## pnpm workspace configuration

Workspace membership lives in `pnpm-workspace.yaml` at the repo root. Linking and
hoisting use **pnpm defaults** (no overrides for `linkWorkspacePackages`,
`preferWorkspacePackages`, or `shamefullyHoist`), which keeps the strict
`node_modules` layout described in
[ADR-012](../architecture/architectural-decisions/012-pnpm-package-manager.md).

Internal `@oaknational/*` dependencies must use the `workspace:` protocol in
`package.json` (`workspace:*` or `workspace:^`). Do not point them at the public
registry by semver alone.

Source-executed TypeScript entrypoints are part of the workspace contract.
Invoke source-executed TS tooling through workspace-owned package scripts, such
as `pnpm --filter @oaknational/agent-tools <command>` or the corresponding root
wrapper. Workspace package `exports` maps advertise **standard conditions only**
(`types`, `import`, `default`) and always resolve to built `dist/` output — there
is no `development` export condition, so every consumer (tsx tooling, Vitest,
Next.js/Turbopack) resolves the same built artefacts. Turbo's `^build` dependency
guarantees `dist/` exists before dependent build, lint, test, and type-check
tasks run; when invoking a workspace script directly (outside turbo), build its
workspace dependencies first. `clean` must remove build artefacts only; if
generated files are committed source, keep them in `clean` and reserve
destructive regeneration steps for explicit package-local commands such as
`generate:clean`.

`allowBuilds` in `pnpm-workspace.yaml` is an **intentional** allowlist: only
packages mapped to `true` may run install lifecycle scripts (pnpm v11
replaced the older `onlyBuiltDependencies` list with this map). Security
`overrides` and `peerDependencyRules` also belong in `pnpm-workspace.yaml`,
not in root `package.json` — see the current file for examples.

**pnpm `overrides` rewrite EVERY transitive contract, not just your pins.** An
override earns its place only when the transitive resolution is itself the
problem (a CVE floor = yes; a format-tool version pin = no — package.json
ranges alone are the correct pin). Worked failure (2026-07-03): a
belt-and-braces `prettier: '~3.8.4'` override reached inside
`openapi-zod-client` (which declares `prettier: ^2.7.1` and calls prettier 2's
synchronous `format()`), so the generator passed a Promise to writeFile and
codegen died, cascading 30 tasks.

### Dependency updates

npm dependencies are updated by **agent-run sweeps**, not by Dependabot.
`.github/dependabot.yml` covers github-actions only: Dependabot regenerates the
whole lockfile per PR with its own resolver, pulling in transitives published
within the last 24 hours, which trips `minimumReleaseAge: 1440` at CI install
and makes every npm-ecosystem PR unmergeable. A local `pnpm` sweep cannot hit
that failure, because pnpm's own resolver enforces the floor at resolution
time. Dependabot vulnerability **alerts** stay on — they are a repo setting,
not part of this file.

Two majors are held deliberately. A sweep must not cross either, and
`pnpm -r up --latest` crosses both:

- **`typescript` stays on 6.x.** The binding blocker is the type-aware lint
  stack: every published `typescript-eslint`, including the newest 8.65.1
  alphas, declares `typescript: ">=4.8.4 <6.1.0"`. Nothing admits TS 7, so
  adopting it would run type-aware linting across all 28 packages on an
  unsupported compiler — and the only way to make that pass is to switch the
  layer off, which
  [`never-disable-checks`](../../.agent/rules/never-disable-checks.md) forbids.
  **Lift condition: `typescript-eslint` ships TS 7 support.** Enforced by the
  `^6` ranges in each manifest.

  A second, smaller blocker sits behind it, recorded so it is not rediscovered:
  `agent-tools/src/bootstrap/bootstrap.ts` resolves `typescript/bin/tsc` at
  postinstall, and TS 7's exports map does not expose that subpath (worked
  failure: PR #416). TS 7 still ships `bin/tsc` and still exports
  `./package.json`, so the cure is to read the package's own declared `bin.tsc`
  rather than guess a subpath — correct on TS 6 too. Not built yet: it would
  unblock nothing while the lint stack is the binding constraint.

- **`@types/node` stays on 24.x**, matching `engines.node: 24.x`. Enforced by
  the `'@types/node': '^24.x.y'` override in `pnpm-workspace.yaml`, which
  covers workspaces that pull it only as a transitive peer. Lift it when the
  project moves Node majors.

Both holds must survive a full lockfile rebuild — see
[`lockfile-rebuild-survivability`](../../.agent/rules/lockfile-rebuild-survivability.md).

**Project `.npmrc` is optional.** Use it for npm-compatible registry and auth
only (`registry`, scoped registry maps, tokens). Avoid pnpm-only keys in
`.npmrc`: npm 9+ warns on unknown project config, and a future npm major may
treat that as an error. Other pnpm settings belong in `pnpm-workspace.yaml` (see
[pnpm settings](https://pnpm.io/settings)).

## Build Order

All packages use a unified `build` script. Turbo's `^build` dependency ensures packages build in the correct order based on the workspace dependency graph:

```text
┌─────────────┐
│  oak-eslint │  ← leaf, builds first (no workspace deps)
└──────┬──────┘
       │ devDep
       ▼
┌──────────────────────────────┐
│ openapi-zod-client-adapter   │  ← builds after oak-eslint
└──────────────┬───────────────┘
               │ dep
               ▼
┌──────────────────────────────┐
│    oak-curriculum-sdk        │  ← code-generation, then build
└──────────┬───────────────────┘
           │ dep
           ├─────────────────────────┐
           ▼                         ▼
┌──────────────────┐   ┌──────────────────────┐
│  oak-search-sdk  │   │      apps/*          │  ← build last
└────────┬─────────┘   └──────────────────────┘
         │ dep
         ▼
┌──────────────────────────────┐
│    apps/oak-search-cli/*     │  ← future consumer
└──────────────────────────────┘
```

### Why This Works

- **`^build`** means "run `build` in dependency packages first"
- **`sdk-codegen`** in the `@oaknational/sdk-codegen#build` override means
  "run `sdk-codegen` in this package first" — scoped to the one package that
  generates types. Other packages build from committed generated code.

> **Turbo override gotcha**: Task-specific overrides (e.g.
> `@oaknational/sdk-codegen#build`) **replace** the generic task
> definition entirely — they do NOT merge with it. Every override MUST
> explicitly include `outputs`, `inputs`, and `cache` from the generic
> parent task, or those fields default to empty. An override with only
> `dependsOn` produces `outputs: []`, meaning the cache stores nothing
> and cache hits restore zero files. This caused PR #70 CI failures:
> `sdk-codegen:build` cache hits left `dist/` empty, breaking
> downstream type-check. Verify overrides with
> `turbo run <task> --filter=@package --dry=json` and inspect
> `resolvedTaskDefinition`.
>
> **Corollary**: if a workspace has any `@package#task` override,
> it needs overrides for every task type it uses (build, test,
> type-check, lint, lint:fix). Missing overrides fall through to
> generic tasks with wrong inputs, causing stale cache hits.

Core packages (`oak-eslint`, `openapi-zod-client-adapter`) are leaf nodes with no workspace dependencies, so they build first. Other packages depend on them via `devDependencies` or `dependencies`, ensuring the correct build order without manual configuration.

## Quality Gate Surfaces

Quality is enforced through five surfaces (pre-commit, pre-push, CI, `pnpm
check`, and the commit-msg hook), each triggered at a different point in the
development lifecycle. **The canonical coverage matrix — which check runs on
which surface — is the single source of truth in
[ADR-121 § Coverage matrix](../architecture/architectural-decisions/121-quality-gate-surfaces.md#coverage-matrix);
it is deliberately not duplicated here** (a duplicated matrix drifts — the hook,
this file, and the ADR diverged silently until the 2026-06-05 reconciliation). See
[ADR-121](../architecture/architectural-decisions/121-quality-gate-surfaces.md)
for the matrix, the per-check rationale, and the verify-vs-mutate rule.

**Key principle**: pre-push and CI run the same check set. A CI-only failure
indicates an environmental or configuration issue, not a missing check.
`pnpm check` is the broadest surface, adding clean rebuild, widget
tests, and a11y tests. See ADR-121 for the full rationale.
`pnpm check:docs` is the focused, verify-only aggregate for documentation work;
it does not replace the full gate for product or tooling changes.

The full gate is authoritative in both directions. A **successful push has
already run the entire pre-push gate** — the push cannot succeed otherwise —
so do not offer `pnpm check` or CI-watching merely to "confirm green" after
a push succeeds. Conversely, a green declared on a **partial local subset**
(e.g. lint + type-check + tests, but not format-check) is never proof the
commit or push will pass: the gates are independent, so enumerate the
actual gate set the boundary will run and run that set, never the
convenient subset.

## Quality Gate Commands

This document is the command source of truth that AGENT.md links to. Root
`package.json` remains the executable source of truth for script names; update
this file in the same change whenever command names or gate membership change.

Validate through these canonical root commands, never ad-hoc per-package
invocations from the repo root (e.g. `pnpm vitest run <path>` at root). Ad-hoc
runs bypass per-package config (vitest `globals`, setup files) and the
workspace boundary, producing failures (`describe is not defined`, foreign
worktree copies pulled in) that are artefacts of the wrong command, not the
code — and a red result from the wrong command is still yours to trace to that
root cause, never to dismiss as a harness quirk.

### `pnpm make` - Build and fix

Prepares the codebase by building, checking, and auto-fixing issues:

```bash
pnpm i && turbo run build type-check lint:fix && pnpm subagents:check && pnpm portability:check && pnpm practice:fitness:informational && pnpm markdownlint:root && pnpm format:root
```

**Flow**:

1. Install dependencies
2. Single turbo run:
   - `build` - compile all workspaces (triggers `sdk-codegen` first)
   - `type-check` - TypeScript validation
   - `lint:fix` - auto-fix linting issues
3. Root-only fixes:
   - `subagents:check` - validate sub-agent wrapper/template standards
   - `portability:check` - validate canonical/adaptor and hook parity
   - `practice:fitness:informational` — four-zone report (ADR-144), always exits 0
   - `markdownlint:root` - fix markdown in root
   - `format:root` - format root files

### `pnpm check` - Canonical full gate

Secret scanning, clean rebuild, and full verification:

```bash
# The authoritative expansion lives in package.json "scripts.check".
# Reproduce from there if you ever need to run the stages manually.
pnpm check
```

`pnpm check` is the only canonical **full** aggregate verification command. The
former `pnpm qg` surface was removed to avoid having two competing full-gate
stories. `pnpm check:docs` is deliberately narrower and makes no full-repository
verification claim.

### `pnpm check:docs` - Documentation work gate

Runs the focused verify-only baseline for general documentation changes without
builds, product tests, or browser suites:

```bash
pnpm check:docs
```

It composes root Prettier and Markdownlint checks with the documentation
validators for reference direction, machine-local paths, internal Markdown
links, the patterns index, and ratified lists. Fitness reports are not part of
this gate: they remain signals and never justify deleting or compressing
knowledge. Specialised Markdown surfaces retain their owning validators; for
example, skill or sub-agent definition changes also require their dedicated
checks.

To inspect the many-process shape without running the full gate, use:

```bash
pnpm check:profile --dry-run
```

This writes the Turbo dry graph for the `pnpm check` Turbo task set under
`.turbo/profiles/`. Run `pnpm check:profile` without `--dry-run` when you want
the same graph snapshot plus wall-clock timing for the full `pnpm check`
process.

#### Aggregate gate doctrine

- `pnpm check` is executable truth and the only canonical full aggregate
  verification command. CI, prompts, and READMEs should name this surface for
  full-repository verification; documentation-only work should use the focused
  `pnpm check:docs` surface.
- Design target: a human-facing aggregate gate should own one package-graph run.
  In practice, that means extending `pnpm check` rather than adding a
  second competing full-gate surface. The underlying implementation may still
  compose multiple workspace-owned validator commands today, but
  discoverability and future convergence should stay centred on this one gate.
- Repo-wide claims must stay within the workspace task exports that back them.
  A workspace is only in the repo-wide `clean`, `type-check`, `lint`, or
  `test` story if it actually exports that task.
- Package-local green is navigation, not acceptance. It helps locate a
  problem, but it does not replace the last full repo-root gate when
  making a repo-wide claim.
- Aggregate gates expose failures in layers. Root shell-stage boundaries
  still mean an upstream red stage can hide downstream stages until it is
  fixed. Turbo's `--continue` reveals multiple failures within the Turbo
  stage, but it does not prove the later root-only stages would pass. After
  clearing one failure, expect the next downstream stage to reveal another
  latent problem until `pnpm check` itself is green.

### `pnpm test:all` - All test suites

Runs all test surfaces declared in the root `package.json` script. The script
currently covers `test`, `test:widget`, `test:e2e`, `test:ui`, `test:a11y`,
`test:widget:ui`, and `test:widget:a11y`.

```bash
pnpm test:all
```

### `pnpm test:field-integrity` - Field integrity checks

Runs the root field-integrity harness:

```bash
pnpm test:field-integrity
```

### Practice health commands

```bash
pnpm practice:fitness              # Three-zone, exits 1 on critical
pnpm practice:fitness:strict-hard  # Consolidation closure: exits 1 on hard
pnpm practice:fitness:informational # Four-zone report, always exits 0
pnpm practice:vocabulary           # Vocabulary consistency check
```

### `pnpm fix` - Auto-fix only

Quick fix without full build:

```bash
pnpm format:root && pnpm markdownlint:root && pnpm lint:fix
```

## Task Dependencies

See [ADR 065: Turbo Task Dependencies](../architecture/architectural-decisions/065-turbo-task-dependencies.md) for full details.

### Key relationships

```text
sdk-codegen ──┐ (package-specific override on sdk-codegen#build only)
              ▼
          build → test, type-check, lint / lint:fix  (via ^build)
               ↘ test:e2e, test:ui  (via same-package build)
```

| Task                | Depends On            | Why                                                   |
| ------------------- | --------------------- | ----------------------------------------------------- |
| `sdk-codegen`       | `^build`              | Core adapter must be built before SDK type generation |
| `build` (generic)   | `^build`              | Dependencies build first; generated code is committed |
| `sdk-codegen#build` | `^build`, sdk-codegen | Only this package regenerates types before building   |
| `type-check`        | `^build`              | Upstream `.d.ts` files must exist for type checking   |
| `lint` / `lint:fix` | `^build`              | ESLint plugin must be built before linting            |
| `test`              | `^build`              | SDK must be built before tests run                    |
| `test:e2e`          | `build`               | Same-package build needed for built-server tests      |
| `test:ui`           | `build`               | Same-package build needed for Playwright tests        |

**Undeclared dependencies present as race-shaped failures — never mask them
with concurrency clamps.** A `--concurrency=N` flag added to "stabilise" a
flaky pipeline once turned out to be hiding missing `devDependency`
declarations: serialisation made the undeclared producer happen to build
first. If reducing concurrency "fixes" a build, the real defect is a missing
dependency edge — declare it (in the workspace `package.json` and, where
task-level, `turbo.json`) and remove the clamp.

## Caching

### Cached tasks (fast on repeat runs)

| Task          | Cached | Notes                                           |
| ------------- | ------ | ----------------------------------------------- |
| `build`       | ✅     | Rebuilds only when inputs change                |
| `sdk-codegen` | ✅     | Regenerates only when _committed_ inputs change |
| `type-check`  | ✅     | Re-checks only when source changes              |
| `lint`        | ✅     | Re-lints only when source changes               |
| `test`        | ✅     | Re-runs only when source/tests change           |
| `test:e2e`    | ✅     | Re-runs only when e2e tests change              |
| `test:ui`     | ✅     | Re-runs only when UI tests change               |

### A task's declared outputs must cover its full write-set

Turbo restores exactly the declared `outputs` globs on a cache replay. When a
task script writes a file outside those globs, a replay restores part of the
task's effect and silently skips the rest, leaving an incoherent tree.
Observed 2026-06-12: `sdk-codegen` wrote both `src/types/generated/**` and
`schema-cache/**`, but declared only the former — a replay restored fresh
generated artefacts beside a stale schema cache. When adding or changing a
task, enumerate every path its script writes (read the script, not the task
name) and declare them all.

### `sdk-codegen` is non-hermetic by design

In online mode the `sdk-codegen` task fetches the live upstream OpenAPI spec,
which is not (and cannot be) a turbo input. A cache hit therefore proves the
_committed_ inputs are unchanged, not that the generated artefacts match the
live upstream API. This trade-off is deliberate: `cache: false` would push a
network fetch into every `build`/`test`/`lint` chain and break offline work.
When deliberately aligning with an upstream spec change, bypass turbo with
`pnpm --filter @oaknational/sdk-codegen sdk-codegen` and confirm the schema
cache's `info.version` moved. The full runbook lives in the
[oak-sdk-codegen README](../../packages/sdks/oak-sdk-codegen/README.md#responding-to-upstream-spec-changes).

### Uncached tasks (always run)

| Task       | Cached | Reason                                   |
| ---------- | ------ | ---------------------------------------- |
| `lint:fix` | ❌     | Modifies source files                    |
| `smoke:*`  | ❌     | External system tests, non-deterministic |
| `clean`    | ❌     | Destructive operation                    |
| `dev`      | ❌     | Persistent process                       |

## Mixing pnpm and turbo

### Use turbo for

- Workspace tasks that benefit from caching
- Tasks with cross-workspace dependencies
- Parallel execution of independent tasks

### Use pnpm for

- Root-only operations (`format:root`, `markdownlint:root`)
- Operations without workspace equivalents
- Simple utility commands

### Why not make root tasks turbo tasks?

Root doesn't have a package.json workspace entry. Making root operations turbo tasks would require special configuration. The current approach is simpler and correct.

## SDK Build-Before-Consume

Apps import SDK packages from their built `dist/` output, not from source.
`tsx` transpiles app source on the fly but resolves SDK imports through
`dist/`. This has three consequences:

1. **Always `pnpm build` after SDK changes** before smoke-testing or running
   apps. Without a fresh build, apps see stale SDK output.
2. **New SDK source files need an explicit `tsup.config.ts` `entry`
   addition** AND `pnpm build` before consuming apps can import the new
   module. Turbo caching can mask this — delete `dist/` and rebuild if
   "Cannot find module" appears.
3. **Adapter and core packages must be rebuilt** (`pnpm build`) before
   `pnpm sdk-codegen` picks up their changes — the SDK codegen consumes
   built output, not source.

## Troubleshooting

### Stale build artifacts

```bash
pnpm clean
pnpm make
```

### Test failures with `/@fs/` errors

This was caused by a race condition where tests ran before SDK build completed. Fixed by adding `dependsOn: ["^build"]` to the `test` task. If you see this error:

1. Verify `turbo.json` has `"test": { "dependsOn": ["^build"], ... }`
2. Run `pnpm clean && pnpm make`

### Type-check fails with "Cannot find module '@oaknational/eslint-plugin-standards'"

This indicates core packages weren't built before type-check ran. Ensure:

1. `oak-eslint` has a `build` script (not `build-linting`)
2. The generic `type-check` task in `turbo.json` depends on `["^build"]`. Only `@oaknational/sdk-codegen` has a package-specific override adding `sdk-codegen` (see ADR-065 items 6–7)
3. Run `pnpm clean && pnpm build`

### `pnpm install` runs a bootstrap `tsc` — a surprise early gate

Editing a workspace `package.json` (e.g. adding a script) makes the next pnpm
run re-verify dependencies, which triggers the postinstall bootstrap and a
whole-package `tsc`. This catches real type errors BEFORE any explicit
type-check pass — read the error HEAD (the tail is pnpm plumbing; the
`runDepsStatusCheck` stack is the fingerprint). Used deliberately, it is a
free whole-package pre-gate: run `pnpm install` in a worktree immediately
after resolving a merge, before reaching for the gate suite (three worked
instances, 2026-07-07/08 — one caught a merge fixture defect pre-gate).

### Lint runs against the BUILT eslint plugin — config-source edits are invisible until rebuild

An edit to `@oaknational/eslint-plugin-standards` source (e.g. a rule config
or allowlist in `recommended.ts`) does not affect lint output until the
plugin package rebuilds — ESLint resolves the built `dist/`. Rebuild the
plugin after every config-source edit before trusting a lint readout
(sibling of the F-120 stale-dist family).

### Slow repeated runs

Ensure `build` has `cache: true` in `turbo.json`. Run `turbo run build --dry-run` to check if caching is working.

### Cache misses on every run

Common causes:

1. **Directory paths in inputs** - Using bare directory paths like `$TURBO_ROOT$/packages/libs/logger` causes Turbo to hash entire directories including build outputs. Use file globs instead, or rely on `dependsOn: ["^build"]` for cross-package dependencies.

2. **Both `env` and `passThroughEnv` for same variable** - Using both causes the env var value to affect the cache hash. Use `passThroughEnv` for secrets that shouldn't affect caching.

3. **Unstable generated outputs** - If sdk-codegen produces files with timestamps or random ordering, cache will miss. Ensure generators produce deterministic output.

To debug cache misses:

```bash
# Check what Turbo sees as inputs
turbo run build --dry=json | jq '.tasks[0].inputs'

# Compare hashes between runs
turbo run build --dry=json | jq '.tasks[] | {task: .taskId, hash: .hash}'
```

## Command Naming: Source of Truth

The root `package.json` `scripts` field is the single source of truth for
all command names. When documenting commands in markdown files, always
use the exact names from `package.json`. Key commands that are commonly
mis-referenced:

| Correct                  | Incorrect            |
| ------------------------ | -------------------- |
| `pnpm format:root`       | `pnpm format`        |
| `pnpm lint:fix`          | `pnpm lint -- --fix` |
| `pnpm markdownlint:root` | `pnpm markdownlint`  |
| `pnpm type-check`        | `pnpm check-types`   |

When renaming a command in `package.json`, search all markdown files for
the old name and update them in the same change.

### Drift Prevention Checklist

After renaming or adding commands in `package.json`:

1. Search all `.md` files for the old command name:
   `rg 'pnpm old-name' --glob '*.md'`
2. Update every non-archive match to the new name
3. Run `pnpm markdownlint:root` to verify markdown integrity
4. Verify onboarding-path docs specifically:
   - `README.md` (root, especially the Quick Start section)
   - `CONTRIBUTING.md`
   - `docs/governance/development-practice.md`
   - `.agent/directives/AGENT.md`
   - `.agent/skills/gates/SKILL-CANONICAL.md`

## Documentation Link Integrity

Broken links in documentation silently erode the onboarding experience.

### When to Check

- After deleting or moving any markdown file
- After restructuring directories
- Before merging documentation PRs
- Periodically as part of documentation maintenance

### How to Check

Search for references to the deleted or moved file:

```bash
rg 'old-filename\.md' --glob '*.md'
```

For a broader sweep of all markdown links, check that link targets exist:

```bash
# Find all markdown links and verify targets
rg '\[.*?\]\(((?!http)[^)]+)\)' --glob '*.md' -o
```

### Progressive Disclosure Chain

The documentation follows a progressive disclosure pattern. Verify this
chain is intact after structural changes:

```text
README.md (root, including the Quick Start section)
  → CONTRIBUTING.md
    → workspace READMEs (packages/*, apps/*)
      → deep docs, ADRs, architecture docs
```

## Knip Configuration Gotchas

- **Standalone scripts need `entry`, not just `project`**: knip
  only traces dependency trees from `entry` points. Scripts
  invoked via `tsx` (not imported by the main entry) must be
  listed as entries. `project` defines the file set; `entry`
  defines the dependency graph roots.
- **Root workspace requires `workspaces["."]`**: top-level
  `entry`/`project` fields are ignored when `workspaces` is
  defined. Must use `workspaces["."]` for root entries.
- **A gate whose config is DERIVED from a contract surface breaks
  silently when that surface changes.** knip auto-detected workspace
  entry points by resolving the `development` condition in package.json
  exports; when exports went dist-only (2026-07-03) knip silently lost
  its source entries — 44 phantom "unused" findings. Cure: explicit
  source `entry` declarations mirroring each exports map
  (knip.config.ts), and generally: when changing a contract surface
  (exports maps, tsconfig, lockfile), list the gates that derive config
  from it in the change's checklist and re-derive them.

## File Cleanup After Deletion

- Empty directories persist after file deletion — always rmdir
  after deleting the last file. The portability validator checks
  for `SKILL.md` presence, so empty skill directories without
  `SKILL.md` cause false positives.

## Filtered Gates Certify Less Than They Appear To

A green gate run certifies only the suites it actually ran, against the
artefacts it actually resolved:

- **A filtered `pnpm --filter X type-check` can pass on stale types**:
  `tsc` resolves workspace dependencies via their built `dist/*.d.ts`,
  while vitest resolves `src` — so a filtered type-check can go green
  against stale dist types (or red against types a rebuild would fix)
  while tests see different code. When a filtered result is
  load-bearing, rebuild the producer workspaces first (the full
  `pnpm check` orders `^build` ahead of `type-check` for exactly this
  reason).
- **A fresh checkout or worktree cannot lint until producer workspaces
  are built** — see the start-right worktree-build discipline; ESLint's
  flat config imports a workspace plugin resolved from `dist/`.
- **`pnpm check` does not run every suite** (e.g. `test:smoke` and
  experiment suites are outside it) — verify the aggregate actually
  exercises the suites your change touches before citing it as proof.
  When reporting, distinguish **run-verified** (the gate exercised the
  change) from **construction-verified** (a behaviour-preserving no-op
  the gate never ran) — a green aggregate says nothing about the latter.

## Serial Gate Chains Unmask Downstream Failures

`pnpm check`'s serial chain (e.g. knip:gate → depcruise → markdownlint →
format-check) hides downstream failures behind upstream ones: a gate
that exits red stops the chain, so everything after it is unobserved,
and clearing one gate routinely unmasks previously-latent failures in
the next. Treat each newly-green gate as a magnifying glass on the one
after it — a red gate appearing after you fixed a different gate is
usually unmasking, not regression.

**`pnpm check` opens with `clean` — every red run leaves a STRIPPED tree**
(no dist, and possibly no generated code if the red hit mid-codegen). After any red estate run, restore
buildability (`pnpm sdk-codegen` + `pnpm build`) before the next
iteration, and prefer single-gate iteration over whole-chain reruns —
iterating check-fix-check in a shared checkout otherwise hands the next
reader a broken `pnpm build`.

## Linting and Auto-Fix Safety

- **`lint:fix` can silently revert manual edits**: `pnpm check`
  runs `lint:fix` internally. If an edit introduces code that
  the linter "fixes" back, the edit is lost mid-pipeline. Always
  verify the edited file AFTER the full `pnpm check`, not just
  after a single gate.
- **Reviewer fixes must exist on disk**: a disposition recorded in a
  napkin, summary, or review thread is not evidence. Open or search the
  target file after applying the fix, especially after auto-fix gates.
- **Never edit generated files** — edit the generators instead.
  Hand-trimming generated output causes regeneration footguns.
  When knip or depcruise flags a generated file, fix the
  generator that produced it.

## Related Documentation

- [ADR 065: Turbo Task Dependencies](../architecture/architectural-decisions/065-turbo-task-dependencies.md)
- [ADR 010: tsup for bundling](../architecture/architectural-decisions/010-tsup-for-bundling.md)
- [ADR 012: pnpm package manager](../architecture/architectural-decisions/012-pnpm-package-manager.md)
- [Tooling](./tooling.md)
