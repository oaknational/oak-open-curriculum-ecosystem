# Testing Gap Analysis & Resolution

> **Historical Note (2026-02-12)**: The `test:e2e:built` task referenced throughout this document has been removed. Built-server behavioural tests were refactored to use in-process supertest with DI (ADR-078) and merged into the main `test:e2e` suite. The `smoke:dev:stub` script continues to verify built artefact boot behaviour. This document is preserved for historical context.

## Executive Summary

**Problem**: Production deployment was completely non-functional, but all 27 test files passed.  
**Root Cause**: Tests only verified source code behavior, not build artifacts or deployment configurations.  
**Solution**: Implemented two-layer build verification system that catches structural and behavioral deployment issues.  
**Status**: ✅ Implemented, tested, and integrated into quality gates.

## The Gap That Existed

### What We Had (Before)

**27 test files** covering:

- ✅ Unit tests (`*.unit.test.ts`) - 100% pass rate
- ✅ Integration tests (`*.integration.test.ts`) - 100% pass rate
- ✅ E2E tests (`*.e2e.test.ts`) - 100% pass rate
- ✅ Smoke tests (manual verification) - All passed

### What We Missed

**Critical blind spot**: Every single test imported from **source**, not **build**:

```typescript
// What all tests did:
import { createApp } from '../src/index.js'; // ❌ Source
```

**Never tested**:

- ❌ Build artifacts exist and are structurally correct
- ❌ `package.json` `main` field points to valid file
- ❌ Production entry points can be imported
- ❌ `pnpm start` actually starts a server
- ❌ Both Vercel and traditional deployment modes work

## The Original Bug

**Symptoms**:

- Build succeeded ✅
- All 27 tests passed ✅
- Deployed to Vercel ✅
- **Server never responded** ❌

**Actual Issues** (Historical - Now Resolved):

1. `tsup.config.ts` had incorrect entry points
2. `package.json` `main` field pointed to wrong location
3. Server entry point pattern was not canonical for Vercel

**Result**: Complete production outage despite passing all tests.

## The Solution: Two-Layer Verification

### Layer 1: Structural Verification (postbuild)

**File**: `scripts/verify-build-artifacts.js`  
**Trigger**: Automatically after `pnpm build` (npm postbuild lifecycle hook)  
**Purpose**: Verify build artifacts are structurally correct

**Checks**:

```javascript
✓ dist/src/index.js exists
✓ dist/src/index.d.ts exists
✓ package.json main points to valid file
✓ Entry point exports Express app instance as default
✓ Entry point exports createApp factory function
✓ TypeScript declarations generated
```

**Would have caught original bug**:

```text
❌ Build artifact verification FAILED

Errors found:
  • package.json "main" points to non-existent file: dist/index.js

Exit code: 1  ← Build would fail
```

### Layer 2: Behavioral Verification (test:e2e:built)

**File**: `e2e-tests/built-server.e2e.test.ts`  
**Trigger**: Part of `pnpm qg` quality gate  
**Purpose**: Verify built artifacts actually work

**Tests**:

```typescript
✓ Server starts from dist/src/index.js
✓ Server listens on configured port
✓ Healthcheck endpoint responds
✓ Landing page serves
✓ MCP endpoint available
✓ CORS works
```

**Tests real deployment behavior**:

- Spawns actual `node dist/src/index.js` process
- Makes real HTTP requests
- Verifies server stays alive
- Tests with production-like configuration

## Integration Into Quality Gates

### Build Process

```bash
pnpm build
# 1. tsup compiles TypeScript → dist/
# 2. tsc generates declarations → dist/**/*.d.ts
# 3. postbuild runs automatically → verifies structure
```

### Quality Gate Process

```bash
pnpm qg
# Now includes:
# 1. format-check:root
# 2. type-check
# 3. lint
# 4. markdownlint-check:root
# 5. test (unit)
# 6. test:ui
# 7. test:e2e (integration)
# 8. test:e2e:built ← NEW: deployment verification
# 9. smoke:dev:stub
# 10. smoke:dev:live
```

### Turbo Configuration

```json
{
  "test:e2e:built": {
    "dependsOn": ["^build"], // Build must complete first
    "outputs": [],
    "cache": false, // Never cache deployment tests
    "inputs": ["e2e-tests/built-server.e2e.test.ts", "dist/**/*.js", "dist/**/*.d.ts"]
  }
}
```

## Verification Results

### Postbuild Verification

```bash
$ pnpm build

> postbuild
> node scripts/verify-build-artifacts.js

✓ Checking build artifacts exist...
✓ Checking package.json main field...
✓ Checking Vercel entry point (default export)...
✓ Checking traditional hosting entry point...
✓ Checking TypeScript declarations...

============================================================
✅ Build artifact verification PASSED

All required files present and correctly structured:
  • Entry point: dist/src/index.js (exports Express app instance)
  • Package main: dist/src/index.js
============================================================
```

### Built Server E2E Tests

```bash
$ pnpm test:e2e:built

 ✓ e2e-tests/built-server.e2e.test.ts (5 tests) 3048ms
   ✓ Built Server (dist/src/index.js) > should start and listen on configured port
   ✓ Built Server (dist/src/index.js) > should respond to healthcheck
   ✓ Built Server (dist/src/index.js) > should serve root landing page
   ✓ Built Server (dist/src/index.js) > should have MCP endpoint available
   ✓ Built Server (dist/src/index.js) > should handle CORS preflight requests

 Test Files  1 passed (1)
      Tests  5 passed (5)
   Duration  3.34s
```

## Cost/Benefit Analysis

### Performance Impact

- **postbuild**: ~200ms (part of build, negligible)
- **test:e2e:built**: ~3.3s (only runs in quality gate)
- **Total added time**: ~3.5s per full quality gate run

### Value Delivered

- ✅ Catches deployment configuration errors
- ✅ Verifies production artifacts work
- ✅ Prevents production outages
- ✅ Clear separation of concerns (structure vs behavior)
- ✅ Fast feedback (fails at build time, not deploy time)

### ROI

**Before**: Complete production outage, manual investigation, emergency fix  
**After**: Build fails immediately with clear error message  
**Time saved**: Hours of debugging + production downtime  
**Cost**: 3.5 seconds per quality gate run

## Conceptual Separation Maintained

| Verification Type     | Tests What            | When         | Source | Deployment |
| --------------------- | --------------------- | ------------ | ------ | ---------- |
| **Unit Tests**        | Function logic        | Any time     | ✅     | ❌         |
| **Integration Tests** | Component interaction | Any time     | ✅     | ❌         |
| **E2E Tests**         | Full app behavior     | Any time     | ✅     | ❌         |
| **postbuild**         | Artifact structure    | After build  | ❌     | ✅         |
| **test:e2e:built**    | Deployment behavior   | Quality gate | ❌     | ✅         |
| **Smoke Tests**       | Live production       | Manual/CI    | ❌     | ✅         |

## Key Takeaways

### What We Learned

1. **Source tests ≠ Deployment tests** - Code can work perfectly but deployment can fail
2. **Structure ≠ Behavior** - Files can exist but not work correctly
3. **Build artifacts are first-class citizens** - They need their own test coverage
4. **Fast feedback is critical** - Catch issues at build time, not deploy time

### Best Practices Established

1. ✅ Always verify build artifacts structurally (postbuild)
2. ✅ Always test deployment behavior (test:e2e:built)
3. ✅ Never cache deployment tests (they test artifacts, not code)
4. ✅ Make postbuild automatic (npm lifecycle hook)
5. ✅ Integrate into quality gates (not optional)

## Files Added/Modified

### New Files

- ✅ `scripts/verify-build-artifacts.js`
- ✅ `e2e-tests/built-server.e2e.test.ts`
- ✅ `docs/BUILD_VERIFICATION.md`
- ✅ `docs/TESTING_GAP_ANALYSIS.md`

### Modified Files

- ✅ `package.json` (app) - Added postbuild & test:e2e:built
- ✅ `package.json` (root) - Added test:e2e:built to quality gates
- ✅ `turbo.json` - Added test:e2e:built task

## Future Improvements

Potential enhancements:

1. Verify Docker images (if using containers)
2. Test multiple Node.js versions
3. Validate environment variable requirements
4. Check for security vulnerabilities in artifacts
5. Measure and enforce bundle size limits

## References

- [BUILD_VERIFICATION.md](./BUILD_VERIFICATION.md) - Implementation details
- [deployment-architecture.md](./deployment-architecture.md) - Dual-mode deployment
- [DEPLOYMENT_FIX_SUMMARY.md](./archive/DEPLOYMENT_FIX_SUMMARY.md) - Original bug fix (archived)

---

**Status**: ✅ Complete and integrated  
**Date**: November 11, 2025  
**Impact**: Critical - prevents production outages
