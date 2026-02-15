# Build Artifact Verification System

> **Historical Note (2026-02-12)**: The `test:e2e` task and
> `vitest.e2e.built.config.ts` have been removed. Built-server
> behavioural tests were refactored to use in-process supertest
> (DI pattern, ADR-078) and merged into the main `test:e2e` suite.
> The `smoke:dev:stub` script continues to verify that the built
> artefact boots and responds correctly.
>
> All references to `test:e2e` in this document have been
> updated to `test:e2e` to reflect the current state.
>
> **Last Updated**: 2026-02-14
> **Status**: Historical / Archived

## Overview

This document describes the build artifact verification system that was added to catch deployment configuration errors before they reach production.

## The Problem It Solves

**Original Issue**: The Vercel deployment built successfully but the server never responded because:

- Build artifacts were in wrong locations
- `package.json` `main` field pointed to non-existent file
- No tests verified the production build actually worked

**Impact**: Complete production outage that wasn't detected by any existing tests.

## The Solution

A **two-layer verification system** that maintains conceptual separation:

### Layer 1: Structural Verification (postbuild)

**Purpose**: Verify build artifacts are structurally correct  
**When**: Runs automatically after every `pnpm build` via npm lifecycle hook  
**What it checks**:

- ✅ Required files exist (`dist/src/index.js`, `dist/src/index.d.ts`)
- ✅ `package.json` `main` field points to valid file
- ✅ Entry point exports Express app instance as default
- ✅ Entry point exports `createApp` factory function
- ✅ TypeScript declarations are generated

**Script**: `scripts/verify-build-artifacts.js`

**Output Example**:

```text
✅ Build artifact verification PASSED

All required files present and correctly structured:
  • Entry point: dist/src/index.js (exports Express app instance)
  • Package main: dist/src/index.js
```

### Layer 2: Behavioral Verification (test:e2e)

**Purpose**: Verify built artifacts actually work  
**When**: Run as part of quality gate (`pnpm qg`)  
**What it tests**:

- ✅ Server starts from `dist/src/index.js`
- ✅ Server listens on configured port
- ✅ Endpoints respond correctly (healthcheck, landing page, MCP)
- ✅ CORS works
- ✅ Server stays alive (doesn't crash immediately)

**Test**: `e2e-tests/built-server.e2e.test.ts`

## Integration Points

### App Package Scripts

```json
{
  "scripts": {
    "build": "tsup && tsc --emitDeclarationOnly --project tsconfig.build.json",
    "postbuild": "node scripts/verify-build-artifacts.js", // ← Automatic
    "test:e2e": "vitest run --config vitest.e2e.config.ts e2e-tests/built-server.e2e.test.ts"
  }
}
```

### Root Quality Gate

Updated `pnpm qg` to include built server verification:

```bash
pnpm qg  # Now includes test:e2e
```

Full sequence:

1. `pnpm format-check:root`
2. `pnpm type-check`
3. `pnpm lint`
4. `pnpm markdownlint-check:root`
5. `pnpm test` (unit tests)
6. `pnpm test:ui`
7. `pnpm test:e2e` (integration tests)
8. **`pnpm test:e2e`** ← NEW
9. `pnpm smoke:dev:stub`
10. `pnpm smoke:dev:live`

### Turbo Configuration

Added `test:e2e` task to `turbo.json`:

```json
{
  "test:e2e": {
    "dependsOn": ["^build"], // Ensures build completes first
    "outputs": [],
    "cache": false, // Never cache (tests deployment artifacts)
    "inputs": ["e2e-tests/built-server.e2e.test.ts", "dist/**/*.js", "dist/**/*.d.ts"]
  }
}
```

## Conceptual Separation

The system maintains clear separation of concerns:

| Layer         | Purpose              | When        | What                         | Caches              |
| ------------- | -------------------- | ----------- | ---------------------------- | ------------------- |
| **postbuild** | Structural integrity | After build | Files exist, exports correct | N/A (part of build) |
| **test**      | Unit behavior        | Any time    | Code logic works             | Yes                 |
| **test:e2e**  | Integration behavior | Any time    | App works via source         | Yes                 |
| **test:e2e**  | Deployment behavior  | After build | Built artifacts work         | No                  |
| **smoke:\***  | Live system          | Manual/CI   | Production works             | No                  |

## Validation

### Would Have Caught Original Bug

Simulating the original bug (wrong `main` field):

```bash
# Temporarily break package.json main field
cat package.json | jq '.main = "dist/index.js"' > package.json.tmp
mv package.json.tmp package.json

# Run verification
node scripts/verify-build-artifacts.js
```

**Result**:

```text
❌ Build artifact verification FAILED

Errors found:
  • package.json "main" points to non-existent file: dist/index.js
```

**Exit code**: 1 (fails the build) ✅

### Current Test Results

**Postbuild verification**:

```bash
pnpm build
# Output: ✅ Build artifact verification PASSED
```

**Built server e2e tests**:

```bash
pnpm test:e2e
# Output:
#  ✓ Built Server (dist/src/index.js) (5 tests)
#    ✓ should start and listen on configured port
#    ✓ should respond to healthcheck
#    ✓ should serve root landing page
#    ✓ should have MCP endpoint available
#    ✓ should handle CORS preflight requests
```

## Files Created/Modified

### New Files

- ✅ `scripts/verify-build-artifacts.js` - Postbuild verification script
- ✅ `e2e-tests/built-server.e2e.test.ts` - Built server behavioral tests
- ✅ `docs/BUILD_VERIFICATION.md` - This documentation

### Modified Files

- ✅ `apps/oak-curriculum-mcp-streamable-http/package.json` - Added postbuild & test:e2e scripts
- ✅ `package.json` (root) - Added test:e2e to quality gates
- ✅ `turbo.json` - Added test:e2e task configuration

## Benefits

### Before (No Build Verification)

- ❌ Build artifacts could be broken
- ❌ Production deployment could fail silently
- ❌ No way to detect structural issues
- ❌ Tests only verified source code, not build output

### After (With Build Verification)

- ✅ Build fails immediately if artifacts are wrong
- ✅ Deployment issues caught in CI, not production
- ✅ Both structural AND behavioral verification
- ✅ Clear separation between code tests and deployment tests
- ✅ Would have caught the original bug before merge

## Usage

### During Development

```bash
pnpm build  # Postbuild verification runs automatically
```

### Before Commit

```bash
pnpm qg  # Includes all verification layers
```

### CI/CD

```bash
pnpm check  # Full quality gate including build verification
```

### Manual Testing

```bash
# Test just the postbuild verification
pnpm build

# Test just the built server
pnpm test:e2e

# Test both
pnpm build && pnpm test:e2e
```

## Cost/Benefit Analysis

**Additional Time**: ~5 seconds per build (postbuild script + e2e:built test)  
**Benefit**: Catches deployment-breaking bugs before production  
**ROI**: Massive - prevented a complete production outage

## Future Enhancements

Potential additions:

1. Verify environment variable requirements
2. Check for security vulnerabilities in built artifacts
3. Validate bundle sizes
4. Test multiple Node.js versions
5. Verify Docker image (if using containers)

## Related Documentation

- [deployment-architecture.md](./deployment-architecture.md) - Dual-mode deployment pattern
- [DEPLOYMENT_FIX_SUMMARY.md](./archive/DEPLOYMENT_FIX_SUMMARY.md) - Original bug fix (archived)
- [vercel-environment-config.md](./vercel-environment-config.md) - Environment setup
