# Smoke Test Port Conflict Analysis

**Date**: 2025-12-06  
**Issue**: `pnpm smoke:dev:stub` failing with port 3333 already in use

## Root Cause

The smoke test failure is **NOT** related to the type safety cleanup work. It's an environmental issue where a development server is already running on port 3333.

### Process Chain Analysis

```
PID 3615: pnpm dev:observe:noauth (root command)
  └─ PID 3665: sh -c LOG_LEVEL=debug DANGEROUSLY_DISABLE_AUTH=true ... tsx src/index.ts
      └─ PID 3666: node tsx/dist/cli.mjs src/index.ts
          └─ PID 3712: node tsx src/index.ts (actual server, listening on port 3333)
```

**Finding**: A development server (`pnpm dev:observe:noauth`) is running in the background, started from a terminal session, and is holding port 3333.

## Smoke Test Architecture

### Port Usage

All local smoke tests use **port 3333** by default (`DEFAULT_PORT = 3333`):

```typescript
// apps/oak-curriculum-mcp-streamable-http/smoke-tests/environment.ts
export const DEFAULT_PORT = 3333;
```

### Smoke Test Modes

From `package.json` scripts:

1. **`smoke:dev:stub`** - Tests with stub/mock data, no auth, no real API calls
   - Starts local server on port 3333
   - Sets `OAK_CURRICULUM_MCP_USE_STUB_TOOLS=true`
   - Sets `DANGEROUSLY_DISABLE_AUTH=true`

2. **`smoke:dev:live`** - Tests with real API, no auth
   - Starts local server on port 3333
   - Requires `OAK_API_KEY` from `.env`
   - Sets `DANGEROUSLY_DISABLE_AUTH=true`

3. **`smoke:dev:live:auth`** - Tests with real API and auth
   - Starts local server on port 3333
   - Requires `OAK_API_KEY` from `.env`
   - Auth enabled (tests Clerk authentication)

4. **`smoke:remote`** - Tests against deployed remote server
   - Does NOT start local server
   - Tests remote deployment
   - **NOT AFFECTED** by port conflicts

### Port Conflict Detection

The smoke tests have robust port conflict detection:

```typescript
// apps/oak-curriculum-mcp-streamable-http/smoke-tests/local-server.ts:104
socket.once('connect', () => {
  socket.end();
  finish(buildPortInUseError(port)); // Throws error with lsof output
});
```

When a port is in use, the error includes:

- Clear message about port conflict
- Output from `lsof` showing what process is using the port
- Suggestion to stop the process or use `--port` flag

## Impact Assessment

### Affected Scripts

All **local** smoke tests that start a server on port 3333:

- ✗ `pnpm smoke:dev:stub` - **AFFECTED**
- ✗ `pnpm smoke:dev:live` - **AFFECTED**
- ✗ `pnpm smoke:dev:live:auth` - **AFFECTED**
- ✓ `pnpm smoke:remote` - **NOT AFFECTED** (doesn't start local server)

### Quality Gate Impact

From `package.json`:

```json
"qg": "pnpm format-check:root && pnpm markdownlint-check:root && turbo run type-check lint test test:ui test:e2e test:e2e:built smoke:dev:stub"
```

The quality gate (`pnpm qg`) includes `smoke:dev:stub`, so it will fail until the port conflict is resolved.

## Resolution Options

### Option 1: Stop the Running Server (Recommended)

Kill the development server holding port 3333:

```bash
kill 3712  # or kill the parent: kill 3615
```

Then re-run smoke tests.

### Option 2: Use Different Port

Smoke tests support a `--port` flag (though not exposed in package.json scripts):

```typescript
// From smoke-suite.ts
const port = options.port ?? DEFAULT_PORT;
```

Could modify scripts to accept port parameter:

```json
"smoke:dev:stub": "tsx smoke-tests/smoke-dev-stub.ts --port 3334"
```

### Option 3: Check for Running Servers Before Smoke Tests

Add a pre-smoke script that checks if port 3333 is available and fails fast with helpful message.

## Recommendations

1. **Immediate**: Stop the running dev server (`kill 3615` or `kill 3712`)

2. **Short-term**: Document in README that smoke tests require port 3333 to be available

3. **Long-term**: Consider one of these improvements:
   - Add pre-flight check that fails fast if port is in use
   - Use dynamic port allocation for smoke tests
   - Add `--port` flag support to smoke test scripts
   - Add smoke test cleanup to Git hooks or CI setup

## Verification

After stopping the dev server:

```bash
# Verify port is free
lsof -i :3333  # Should return nothing

# Run smoke tests
pnpm smoke:dev:stub  # Should pass
pnpm smoke:dev:live  # Should pass (if OAK_API_KEY is set)
pnpm smoke:dev:live:auth  # Should pass (if OAK_API_KEY is set)
```

## Improvements Made

### Enhanced Error Messages

The port conflict error message has been significantly improved:

**Before:**

```
Smoke test server could not bind to 127.0.0.1:3333 because the port is already in use.
Existing listeners:
COMMAND  PID USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
node    3712  jim   22u  IPv6 0x8bdd81da2174b352      0t0  TCP *:3333 (LISTEN)
Stop the other process or run the smoke suite with a different --port.
```

**After:**

```
PORT CONFLICT: Port 3333 is already in use

Process using port 3333:
  PID:     3712
  Command: node
  User:    jim
  Details: /Users/jim/.nvm/versions/node/v24.11.1/bin/node --require /Users/jim/code/oak/ai_experiments/oak-notion-mcp/node_modu...

Full lsof output:
COMMAND  PID USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
node    3712  jim   22u  IPv6 0x8bdd81da2174b352      0t0  TCP *:3333 (LISTEN)

To resolve:
  1. Stop the process: kill 3712
  2. Or use a different port: --port <different-port>
```

### Code Changes

**New file**: `smoke-tests/process-info.ts`

- Extracted process information gathering logic (116 lines)
- Pure functions for parsing `lsof` and `ps` output
- Proper type definitions for `ProcessInfo`

**Updated file**: `smoke-tests/local-server.ts`

- Reduced from 287 lines to 172 lines (under 250 line limit)
- Clearer error message with "PORT CONFLICT" header
- Structured process information display
- Actionable resolution steps with exact PID

### Benefits

1. **Clearer errors**: "PORT CONFLICT" header makes the issue immediately obvious
2. **Better diagnostics**: Shows PID, command, user, and full command line
3. **Actionable**: Provides exact `kill` command to resolve the issue
4. **Maintainable**: Extracted logic into separate module following single responsibility principle
5. **Compliant**: All files under 250 lines, complexity under 8

## Conclusion

**This is NOT a bug introduced by the type safety cleanup.** It's an environmental issue where a development server was left running. The smoke test infrastructure is working correctly by detecting and reporting the port conflict.

The error messaging has been significantly improved to make port conflicts immediately clear and provide actionable resolution steps.

The type safety cleanup work is complete and all code-level quality gates pass. The smoke test failure is purely operational and can be resolved by stopping the conflicting process.
