# ADR-010: Use tsup for Bundling

## Status

Revised (2026-04-14) — composable base config added

## Context

We need a build tool that can:

- Bundle TypeScript to JavaScript
- Generate TypeScript declarations
- Support ESM output
- Handle Node.js specifics (shebang, externals)
- Be fast and simple to configure

Options considered: webpack, rollup, esbuild, tsup

## Decision

Use tsup as the bundling tool for the project.

## Rationale

- **Zero Config**: Works out of the box with sensible defaults
- **Built on esbuild**: Extremely fast build times
- **TypeScript First**: Excellent TypeScript support including .d.ts generation
- **ESM Support**: Native support for ESM output
- **Simple Configuration**: Minimal configuration required
- **Active Maintenance**: Well-maintained with regular updates

## Consequences

### Positive

- Fast build times improve developer experience
- Simple configuration reduces maintenance burden
- Built-in TypeScript declaration generation
- Good defaults mean less configuration
- Supports our ESM-only approach

### Negative

- Less flexibility than webpack for complex scenarios
- Another tool to learn (though minimal API)
- Depends on esbuild which may have edge case issues
- `@sentry/esbuild-plugin` does not work with tsup (egoist/tsup#1260):
  plugin file-globbing runs before tsup writes to disk. Source map
  upload uses `sentry-cli` post-build instead; see
  [docs/operations/sentry-cli-usage.md](../../operations/sentry-cli-usage.md)
  for the CLI split, `.sentryclirc` composition, and the two-step
  `sourcemaps inject` → `sourcemaps upload` workflow this ADR relies
  on.

## Implementation

- Configure in `tsup.config.ts`
- Output ESM format only
- Enable TypeScript declarations
- Bundle dependencies except Node built-ins
- Add shebang for CLI execution
- Use source maps for debugging

## Revision: Composable Base Config (2026-04-14)

### Problem

17 workspace `tsup.config.ts` files duplicated the same shared
defaults (`format`, `sourcemap`, `clean`, `minify`, `treeshake`,
`tsconfig`, `outDir`). Adding or changing a default required editing
all 17 files.

### Evaluation

The first question — "could it be simpler?" — was decisive. tsup
works. The two real problems (no composable config, Sentry plugin
incompatibility) have direct solutions without tool replacement.
Full bundler replacement (to unbundled tsc, Rollup, or Vite library
mode) was evaluated and rejected as unnecessary churn across 17
workspaces for problems that have targeted fixes.

### Decision

Keep tsup. Add `tsup.config.base.ts` at the repo root (matching
the existing `vitest.config.base.ts`, `stryker.config.base.ts`,
`tsconfig.base.json` precedent) with 3 factory functions:

1. **`createLibConfig(overrides?)`** — libraries (single entry,
   bundle: true). Covers basic libs, libs with externals, multi-entry,
   and DTS generation via optional overrides.
2. **`createSdkConfig(entries, overrides?)`** — SDKs (multi-entry,
   bundle: false, platform: neutral). `ensure-js-extensions` esbuild
   plugin defined once here.
3. **`createAppConfig(entries, overrides?)`** — apps (external:
   `/node_modules/`, custom entries). CLI overrides with banner for
   shebang.

Workspace configs become 2-5 line imports from the base.

### Infrastructure

- `turbo.json`: `$TURBO_ROOT$/tsup.config.base.ts` added to all
  build task input arrays to prevent stale cache hits.
- Source map upload: `sentry-cli sourcemaps inject` then
  `sentry-cli sourcemaps upload` post-build, separating upload
  (deployment concern) from build (compilation). See
  [docs/operations/sentry-cli-usage.md](../../operations/sentry-cli-usage.md)
  for the canonical invocation, Debug ID semantics, and artefact
  bundle model; the runnable wrapper lives at
  [`apps/oak-curriculum-mcp-streamable-http/scripts/upload-sourcemaps.sh`](../../../apps/oak-curriculum-mcp-streamable-http/scripts/upload-sourcemaps.sh).

### Review Attribution

Decision shaped by Betty (cohesion/change-cost), Barney
(simplification — 3 factories not 4), Fred (boundary discipline),
and assumptions-reviewer (proportionality — tracks are independent).
