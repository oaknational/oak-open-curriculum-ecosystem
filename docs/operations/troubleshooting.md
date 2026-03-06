---
fitness_ceiling: 200
split_strategy: 'Extract workspace-specific troubleshooting to workspace READMEs'
---

# Troubleshooting Guide

## Overview

This guide helps diagnose and resolve common issues with the Oak Open Curriculum Ecosystem. Follow the steps in order for each issue.

## Quick Diagnostics

Run these commands from the repo root to check your setup:

```bash
node --version           # Should be 24.x
pnpm --version           # Should be 10.x
pnpm install             # Install dependencies
pnpm sdk-codegen         # Generate types from OpenAPI schema
pnpm build               # Build all workspaces
pnpm type-check          # Verify no type errors
pnpm test                # Run unit and integration tests
```

## Common Issues

### Credential policy

Real credentials must be kept in local `.env` / `.env.local` files only.
Those files are gitignored and should never be committed.
Use `.env.example` and other docs as placeholders.

### Type Generation Fails

**Symptoms**: `pnpm sdk-codegen` fails or produces unexpected output.

**Steps**:

1. Ensure `OAK_API_KEY` is set in root `.env` (or `.env.e2e`)
2. Check network access to `open-api.thenational.academy`
3. Run `pnpm clean && pnpm sdk-codegen` for a fresh generation

### Build Fails After Type Generation

**Symptoms**: `pnpm build` fails after successful `pnpm sdk-codegen`.

**Steps**:

1. Run `pnpm clean` then `pnpm sdk-codegen && pnpm build` in sequence
2. Check for circular dependencies: generated types should flow from SDK to apps
3. Verify `tsconfig.json` references are correct in the failing workspace

### E2E Tests Fail

**Symptoms**: `pnpm test:e2e` fails with connection or auth errors.

**Steps**:

1. Ensure the app builds successfully: `pnpm build`
2. For streamable-http E2E tests: no env vars needed (tests use DI with isolated config)
3. For smoke tests: ensure `OAK_API_KEY` and `CLERK_*` keys are set
4. Check that no other process is using port 3333 (streamable-http default)

### Smoke Tests Fail

**Symptoms**: `pnpm smoke:dev:stub` fails.

**Steps**:

1. Ensure `pnpm build` succeeds first (smoke tests depend on built artefacts)
2. Check that all E2E tests pass first (`pnpm test:e2e`)
3. For live smoke tests (`smoke:dev:live`): ensure `OAK_API_KEY` is set

### ESLint Reports Boundary Violations

**Symptoms**: `pnpm lint:fix` reports import boundary errors.

**Steps**:

1. Apps must not import from other apps
2. SDKs must not import from apps
3. Core packages must not import from SDKs or apps
4. Check that imports flow in the correct direction: core -> libs -> sdks -> apps

### Missing Environment Variables

**Symptoms**: App fails to start with "required variable" error.

**Steps**:

1. Copy `.env.example` to `.env` at the repo root
2. For search CLI: copy `apps/oak-search-cli/.env.example` to `apps/oak-search-cli/.env.local`
3. See [environment-variables.md](./environment-variables.md) for the complete reference

## Known Gate Caveats

As of **25 February 2026**, `pnpm qg` is known to fail in clean local runs:

- `apps/oak-curriculum-mcp-streamable-http/tests/widget/widget-rendering.spec.ts` (fails in `pnpm qg` via `test:ui`)

If `pnpm qg` fails, run the affected suite directly and check latest issues/ADRs/plans before assuming local setup problems.

## Quick Fixes

| Symptom                                                 | Fix                                                             |
| ------------------------------------------------------- | --------------------------------------------------------------- |
| `pnpm publish --dry-run` fails with uncommitted changes | Add `--no-git-checks` flag                                      |
| `pnpm benchmark` not found                              | The command is `pnpm benchmark` (not `pnpm eval:benchmark`)     |
| E2E `tool-examples-metadata` flaky                      | SSE payload timing issue — retry once before investigating      |
| Test upstream API status codes                          | `curl -s -w "\n%{http_code}" <url>` to see both body and status |

## Quality Gate Failures

If any quality gate fails, run the full chain in order to isolate the issue:

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:ui
pnpm smoke:dev:stub
```

Each gate may fix issues for subsequent gates (e.g. `format:root` fixes formatting that `lint:fix` then passes).

## File Move and Refactoring Issues

### ESLint Rule Overrides After File Moves

When moving files between workspaces, ESLint rule overrides must also move — otherwise lint errors appear silently in the destination. Also check that relative links in README files adjust for directory depth changes (e.g. `../../../docs/` may become `../../../../docs/`).

### Stale tsup Entry Points

Stale tsup entries match nothing silently after file moves — remove dead entry points promptly.

### Stale ADR File Paths

ADR Implementation sections have file paths that go stale when packages are moved. Always grep ADRs for old paths after a move. Similarly, check TSDoc `@see` links for old GitHub repo URLs when removing a workspace.

### Cross-Package Function Moves

After moving functions between packages (e.g. from `search-cli` to `curriculum-sdk`), rebuild the source package (`pnpm --filter <pkg> build`) before downstream tests will see the new exports via `dist/`. Turborepo cache may hide the issue until a clean build.

### Second-Level Barrels

When migrating facade imports, check for second-level barrels (e.g. `oak.ts` re-exporting from the facade) — they add hidden consumers that do not appear in a direct grep for the facade file.

### TS2209 rootDir Ambiguity

When `tsconfig.build.json` narrows `include` from a wide base, add explicit `rootDir: "./src"` for export map resolution.

## TSDoc Issues

- `{@link ./path}` is NOT valid TSDoc — use backtick references for module paths.
- Braces `{ }` in TSDoc trigger malformed inline tag errors.
- `>` in TSDoc examples needs backslash escape.
- Never use `\x00` in regex — use string-based placeholders (e.g. `___TSDOC_SAFE_N___`).
- `openapiTS` emits `@constant` as both single-line (`/** @constant */`) and multi-line — regex must handle both forms.
- ESLint plugins using dynamic file resolution (`@microsoft/tsdoc-config`) must be marked `external` in tsup bundles.
- `tsdoc.json` `extends` works with `@microsoft/tsdoc-config` 0.18.0; `TSDocConfigFile.findConfigPathForFolder` stops at `package.json`/`tsconfig.json` boundaries — each workspace needs its own `tsdoc.json` with `extends`.
