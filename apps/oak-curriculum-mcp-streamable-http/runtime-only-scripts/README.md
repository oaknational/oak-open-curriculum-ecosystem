# Runtime-Only Scripts

This directory contains scripts that **cannot have a build step and must
have no external dependencies**. They run in environments where no
compilation, no `pnpm install`, and no tooling is available — typically
before any package install has happened.

This is a deliberately constrained, special-case directory. **All other
scripts in this workspace must be TypeScript** and either:

1. Invoked via `pnpm exec tsx <path>` (strongly preferred), or
2. Built into the workspace's `dist/` via the workspace's normal build.

The runtime-only constraint exists for a small handful of cases. The
canonical example is Vercel's `ignoreCommand`: Vercel runs that script
_before_ `pnpm install`, so the script cannot import any package
dependency and cannot rely on any compilation step.

## Rules for files in this directory

- **No package dependencies.** Only Node.js built-in modules
  (`node:fs`, `node:path`, `node:child_process`, etc.). No imports
  from `node_modules` of any kind.
- **No compilation.** Source files are `.mjs`. They are committed as
  the runtime artefact; there is no build step that produces them.
- **Typed surface for in-repo consumers via `.d.mts`.** Each `.mjs`
  may have a sibling `.d.mts` declaration file so other in-repo
  TypeScript can call it with type safety. The `.mjs` and `.d.mts`
  must remain in parity by convention (and ideally by an enforcing
  parity test).
- **Tests live alongside as `*.unit.test.mjs`.** Tests run under the
  same constraint envelope (no build, no deps) so the test
  validates the actual runtime behaviour of the deployed file.

## When to use this directory

Only when a script genuinely cannot be TypeScript or cannot have its
deps installed. If a script can be TypeScript and run via
`pnpm exec tsx`, it belongs in `build-scripts/`, `scripts/`, or
`bin/`, not here.

## Current contents

- `vercel-ignore-production-non-release-build.mjs` — Vercel
  `ignoreCommand` script. Decides whether to skip a deploy based on
  the commit's release-tag relationship. Runs before `pnpm install`.
  Cited by ADR-024, ADR-078, ADR-158, ADR-163 §10.

## Why this directory exists separately

Owner-directed rule (2026-04-29): _"such scripts are a special and
rare case, which is why where they absolutely need to exist they must
be placed in a specific directory within each workspace, and that all
other scripts must be written in typescript and either invoked with
`pnpm exec tsx` (strongly preferred) or built."_ The dedicated
directory makes the constraint visible and prevents the no-compile
pattern from being adopted in places where TypeScript would be the
right choice.
