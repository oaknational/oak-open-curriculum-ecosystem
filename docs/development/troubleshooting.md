# Troubleshooting Guide

## Overview

This guide helps diagnose and resolve common issues with the Oak MCP Ecosystem. Follow the steps in order for each issue.

## Quick Diagnostics

Run these commands from the repo root to check your setup:

```bash
node --version           # Should be 24.x
pnpm --version           # Should be 9.x+
pnpm install             # Install dependencies
pnpm type-gen            # Generate types from OpenAPI schema
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

**Symptoms**: `pnpm type-gen` fails or produces unexpected output.

**Steps**:

1. Ensure `OAK_API_KEY` is set in root `.env` (or `.env.e2e`)
2. Check network access to `open-api.thenational.academy`
3. Run `pnpm clean && pnpm type-gen` for a fresh generation

### Build Fails After Type Generation

**Symptoms**: `pnpm build` fails after successful `pnpm type-gen`.

**Steps**:

1. Run `pnpm clean` then `pnpm type-gen && pnpm build` in sequence
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

## Quality Gate Failures

If any quality gate fails, run the full chain in order to isolate the issue:

```bash
pnpm type-gen
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
