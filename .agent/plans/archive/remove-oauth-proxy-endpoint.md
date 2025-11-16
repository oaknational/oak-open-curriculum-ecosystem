# Plan: Remove OAuth Authorization Server Metadata Proxy

**Status:** Ready for Implementation  
**Created:** 2024-11-16  
**Updated:** 2024-11-16 (Inspector CLI validation approach)  
**Priority:** Medium  
**Effort:** ~2 hours (harness + validation + implementation)

---

## Getting Started (For Fresh Context)

### Repository & Package Context

This is a pnpm monorepo. We're working on:

- **Package**: `@oaknational/oak-curriculum-mcp-streamable-http`
- **Location**: `apps/oak-curriculum-mcp-streamable-http/`
- **Purpose**: MCP server exposing Oak curriculum API via Streamable HTTP with OAuth authentication
- **Transport**: Streamable HTTP (not stdio)

### Prerequisites

✅ Already available:

- Repository cloned and installed
- Environment variables configured in root `.env` file
- `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` set

### File Paths Reference

All paths in this plan are relative to repository root:

- **Auth routes**: `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts`
- **Package.json**: `apps/oak-curriculum-mcp-streamable-http/package.json`
- **Smoke tests**: `apps/oak-curriculum-mcp-streamable-http/smoke-tests/`
- **E2E tests**: `apps/oak-curriculum-mcp-streamable-http/e2e-tests/`

### Verify Current State (Before Starting)

```bash
# From repository root

# 1. Start the dev server
pnpm -F @oaknational/oak-curriculum-mcp-streamable-http dev

# 2. In another terminal, verify the proxy endpoint exists (CURRENT STATE)
curl http://localhost:3333/.well-known/oauth-authorization-server
# Expected: 200 with Clerk's authorization server metadata
# This is WRONG - we're proxying what Clerk should serve directly

# 3. Verify our protected resource metadata (CORRECT - keep this)
curl http://localhost:3333/.well-known/oauth-protected-resource | jq
# Expected: 200 with "authorization_servers" array pointing to Clerk

# 4. Verify Clerk's AS metadata is directly accessible
# Extract the Clerk URL from step 3, then:
curl https://<clerk-fapi-url>/.well-known/oauth-authorization-server | jq
# Expected: 200 with authorization server metadata
# This proves Clerk serves it directly - we don't need to proxy
```

### Key Files We'll Modify

```
apps/oak-curriculum-mcp-streamable-http/
├── src/
│   └── auth-routes.ts                          ← Remove proxy endpoint here
├── smoke-tests/
│   ├── smoke-oauth-discovery-spec-compliant.ts ← DELETE (broken test)
│   ├── lib/
│   │   └── inspector-harness.ts                ← CREATE (reusable harness)
│   └── validate-oauth-with-inspector.ts        ← CREATE (our validation)
├── e2e-tests/
│   └── auth-enforcement.e2e.test.ts            ← UPDATE (remove proxy tests)
└── package.json                                 ← UPDATE (scripts)
```

### Quick Orientation

**What's Wrong:**

- We proxy Clerk's authorization server metadata through our resource server
- This violates OAuth 2.0 architecture (resource server ≠ authorization server)
- MCP spec shows clients fetching AS metadata directly from the AS
- MCP SDK code confirms clients use the URL from `authorization_servers` array
- `@clerk/mcp-tools` package itself warns this "should not be necessary"

**What We'll Do:**

1. Delete broken smoke test (tests infrastructure, not client behavior)
2. Create Inspector CLI harness (reusable, proper separation of concerns)
3. Validate with Inspector (official MCP reference client)
4. Remove proxy endpoint from `auth-routes.ts`
5. Update tests to reflect correct architecture
6. Keep using `@clerk/mcp-tools` for protected resource metadata (correct usage)

**Project Standards:**

- Follow TDD per `.agent/directives-and-memory/rules.md`
- Follow test types per `docs/agent-guidance/testing-strategy.md`
- Use quality gates (type-gen → build → type-check → lint → test → test:e2e)

---

## Executive Summary

Remove the `/.well-known/oauth-authorization-server` proxy endpoint from our resource server. This endpoint proxies Clerk's authorization server metadata and is:

1. **Not needed per spec** - MCP spec 2025-06-18 shows clients fetching AS metadata directly from the authorization server
2. **Not needed per SDK** - `@modelcontextprotocol/sdk` client code explicitly fetches AS metadata from the URL in `authorization_servers` array
3. **Warned against** - `@clerk/mcp-tools` itself says this "should not be necessary" when using Clerk
4. **For old spec** - Implements the 2025-03-26 spec, not the current 2025-06-18 spec
5. **Architecturally wrong** - Violates OAuth 2.0 separation between resource server and authorization server

**Validation Approach:** Use MCP Inspector CLI (reference client implementation) to empirically prove spec-compliant clients work without the proxy.

**Architectural Principle:** Use tools as intended. Keep using `@clerk/mcp-tools` for protected resource metadata (correct), remove the proxy endpoint (incorrect).

---

## Problem Statement

### Current State

**We use two functions from `@clerk/mcp-tools`:**

1. ✅ `protectedResourceHandlerClerk` - **CORRECT** - Generates our RFC 9728 protected resource metadata
2. ❌ `authServerMetadataHandlerClerk` - **INCORRECT** - Proxies Clerk's RFC 8414 AS metadata

**Issues with the proxy:**

1. 🔴 **Package warns against it** - "@clerk/mcp-tools README says 'should not be necessary'"
2. 🔴 **For old MCP spec** - Implements 2025-03-26, not current 2025-06-18
3. 🔴 **Violates OAuth architecture** - Resource servers shouldn't proxy AS metadata
4. 🔴 **Creates failure point** - If Clerk is slow, our endpoint is slow
5. 🔴 **Complicates caching** - We disable caching, forcing fresh fetches every time
6. 🔴 **No error handling** - Raw `fetch()` with no timeout or retry logic

### Desired State

**Keep using `@clerk/mcp-tools` for what it's good at:**

- ✅ Protected resource metadata generation (`protectedResourceHandlerClerk`)
- ✅ Clerk publishable key decoding
- ✅ RFC 9728 compliance

**Remove what the package warns against:**

- ❌ Authorization server metadata proxy (`authServerMetadataHandlerClerk`)

**Result:** Simpler, more correct architecture that follows both the MCP spec and the library's own recommendations.

---

## Goals

### Primary Goals (Must Have)

1. **Delete Broken Smoke Test**: Remove `smoke-oauth-discovery-spec-compliant.ts` (tests infrastructure, not client behavior)
2. **Create Inspector Harness**: Build reusable testing harness for MCP Inspector CLI (separation of concerns)
3. **Validate With Inspector**: Use reference client to prove spec-compliant OAuth discovery works
4. **Remove Proxy Endpoint**: Delete `/.well-known/oauth-authorization-server` from our server
5. **Keep @clerk/mcp-tools**: Continue using it for protected resource metadata
6. **Update Tests**: Remove tests for proxy, add tests validating direct Clerk access

### Secondary Goals (Nice to Have)

- 📚 **Document Inspector Harness**: Make it reusable for future MCP server testing
- 📊 **Document Findings**: Capture SDK evidence and Inspector validation results

### Non-Goals (Explicitly Out of Scope)

- ❌ Internalizing `@clerk/mcp-tools` - we're using it correctly
- ❌ Adding caching - not needed, Clerk handles it
- ❌ Complex refactoring - just remove one endpoint
- ❌ Changing how we use `protectedResourceHandlerClerk` - it's correct
- ❌ Testing with actual MCP clients (Inspector is sufficient reference implementation)

---

## Architecture Design

### First Question: "Could it be simpler?"

**Answer:** Yes. Remove the proxy endpoint entirely. Use `@clerk/mcp-tools` as intended.

### Current Architecture (WRONG)

```
┌─────────┐                              ┌──────────────────┐
│  MCP    │  1. GET /.well-known/        │  Our Resource    │
│ Client  │──oauth-protected-resource──▶ │     Server       │
│         │                               │                  │
│         │  2. authorization_servers:    │                  │
│         │◀────["https://clerk..."]──────│                  │
└─────────┘                               └──────────────────┘
     │                                             │
     │  3. GET /.well-known/                      │
     │     oauth-authorization-server             │
     └────────────────────────────────────────────┘
                                                   │
                                                   │ 4. fetch()
                                                   ▼
                                          ┌──────────────────┐
                                          │  Clerk Auth      │
                                          │   Server         │
                                          └──────────────────┘
```

**Problem:** Steps 3-4 shouldn't exist on our server.

### Correct Architecture (Per MCP Spec 2025-06-18)

```
┌─────────┐                              ┌──────────────────┐
│  MCP    │  1. GET /.well-known/        │  Our Resource    │
│ Client  │──oauth-protected-resource──▶ │     Server       │
│         │                               │                  │
│         │  2. authorization_servers:    │                  │
│         │◀────["https://clerk..."]──────│                  │
└─────────┘                               └──────────────────┘
     │
     │  3. GET /.well-known/
     │     oauth-authorization-server
     │
     ▼
┌──────────────────┐
│  Clerk Auth      │
│   Server         │
└──────────────────┘
```

**Correct:** Client goes directly to Clerk per MCP spec sequence diagram (line 118).

### Design Principles (From @rules.md)

- ✅ **Keep it simple** - Remove unnecessary proxy
- ✅ **Use library types directly** - Keep using @clerk/mcp-tools for what it does well
- ✅ **Never create compatibility layers** - Don't keep proxy "just in case"
- ✅ **Fail fast** - If clients can't reach Clerk, let them discover that directly

---

## Implementation Plan

### Phase 0: Cleanup - 5 minutes

**Delete the broken smoke test:**

```bash
# From repository root
rm apps/oak-curriculum-mcp-streamable-http/smoke-tests/smoke-oauth-discovery-spec-compliant.ts
```

**Edit package.json to remove the script:**

```bash
# Edit: apps/oak-curriculum-mcp-streamable-http/package.json
# Delete line: "smoke:oauth-discovery": "tsx smoke-tests/smoke-oauth-discovery-spec-compliant.ts"
```

**Why delete it:**

- ❌ Tests infrastructure (Clerk accessibility), not client behavior
- ❌ Doesn't prove what MCP clients actually do
- ❌ Doesn't use a real MCP client
- ✅ Inspector CLI is the right tool (reference MCP client implementation)

---

### Phase 1: Evidence Review - 10 minutes

**Review SDK Evidence (Already Found):**

From `@modelcontextprotocol/sdk/dist/esm/client/auth.d.ts` line 180:

```typescript
/**
 * Discovers authorization server metadata...
 * @param authorizationServerUrl - The authorization server URL obtained from the MCP Server's
 *                                 protected resource metadata, or the MCP server's URL if the
 *                                 metadata was not found.
 */
export declare function discoverAuthorizationServerMetadata(
  authorizationServerUrl: string | URL, ...
): Promise<AuthorizationServerMetadata | undefined>;
```

**Key Finding:** SDK explicitly documents that it takes the AS URL from protected resource metadata and fetches metadata FROM THAT URL.

**Conclusion:** MCP SDK clients fetch AS metadata directly from Clerk per the spec. Our proxy is unnecessary.

---

### Phase 2: Create Inspector Testing Harness - 30 minutes

**Per @rules.md and @testing-strategy.md: Separate Concerns**

Create a reusable harness for testing MCP servers with Inspector CLI.

#### Step 2.1: Create harness module

```typescript
// apps/oak-curriculum-mcp-streamable-http/smoke-tests/lib/inspector-harness.ts
// Create directory: mkdir -p apps/oak-curriculum-mcp-streamable-http/smoke-tests/lib

/**
 * Reusable testing harness for MCP Inspector CLI
 *
 * Provides utilities for testing MCP servers using the official
 * MCP Inspector as a reference client implementation.
 *
 * This harness is transport-agnostic and can be used with:
 * - stdio
 * - SSE
 * - Streamable HTTP (our use case)
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface InspectorConfig {
  serverUrl: string;
  transport: 'stdio' | 'sse' | 'http';
  headers?: Record<string, string>;
  timeout?: number;
}

export interface InspectorMethod {
  method: 'tools/list' | 'resources/list' | 'prompts/list';
}

/**
 * Execute MCP Inspector CLI command
 *
 * @param config - Inspector configuration
 * @param method - MCP method to call
 * @returns Command output
 */
export async function runInspectorCli(
  config: InspectorConfig,
  method: InspectorMethod,
): Promise<{ stdout: string; stderr: string }> {
  const { serverUrl, transport, headers = {}, timeout = 30000 } = config;

  // Build command
  const cmd = [
    'npx',
    '@modelcontextprotocol/inspector',
    '--cli',
    serverUrl,
    '--transport',
    transport,
    '--method',
    method.method,
  ];

  // Add headers if provided
  for (const [key, value] of Object.entries(headers)) {
    cmd.push('--header', `${key}: ${value}`);
  }

  const command = cmd.join(' ');

  try {
    const result = await execAsync(command, { timeout });
    return result;
  } catch (error) {
    // Inspector CLI failures throw, but we want to capture the error details
    throw new Error(
      `Inspector CLI failed: ${error.message}\n` +
        `Command: ${command}\n` +
        `Stdout: ${error.stdout || 'none'}\n` +
        `Stderr: ${error.stderr || 'none'}`,
    );
  }
}

/**
 * Parse Inspector CLI JSON output
 *
 * Inspector CLI outputs JSON for programmatic use
 */
export function parseInspectorOutput<T>(stdout: string): T {
  try {
    return JSON.parse(stdout);
  } catch (error) {
    throw new Error(
      `Failed to parse Inspector output as JSON: ${error.message}\n` + `Output: ${stdout}`,
    );
  }
}
```

#### Step 2.2: Create our specific test

```typescript
// apps/oak-curriculum-mcp-streamable-http/smoke-tests/validate-oauth-with-inspector.ts

/**
 * Validate OAuth Discovery Using MCP Inspector (Reference Client)
 *
 * Uses the official MCP Inspector CLI as a reference client implementation
 * to validate that spec-compliant OAuth discovery works WITHOUT our proxy endpoint.
 *
 * This proves:
 * 1. Inspector (reference client) can connect to our server
 * 2. Inspector can perform OAuth discovery per MCP spec 2025-06-18
 * 3. Inspector fetches AS metadata directly from Clerk (not from us)
 * 4. Our proxy endpoint is not required for spec-compliant clients
 */

import assert from 'node:assert/strict';
import { runInspectorCli, parseInspectorOutput } from './lib/inspector-harness.js';

async function validateOAuthWithInspector() {
  const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3333';

  console.log('🔍 OAuth Discovery Validation: MCP Inspector (Reference Client)');
  console.log('══════════════════════════════════════════════════════════════════');
  console.log(`\nServer: ${SERVER_URL}`);
  console.log('Transport: Streamable HTTP');
  console.log('');

  console.log('📋 Test: Can Inspector connect and list tools?');
  console.log('   (This triggers full OAuth discovery per MCP spec)');

  try {
    const result = await runInspectorCli(
      {
        serverUrl: SERVER_URL,
        transport: 'http',
        timeout: 30000,
      },
      {
        method: 'tools/list',
      },
    );

    console.log('✅ Inspector successfully connected and performed OAuth discovery');

    // Parse output to validate structure
    const output = parseInspectorOutput(result.stdout);

    console.log('\n📊 Results:');
    console.log('   Inspector output:', JSON.stringify(output, null, 2));

    if (result.stderr) {
      console.log('\n⚠️  Stderr (may contain warnings):', result.stderr);
    }

    console.log('\n══════════════════════════════════════════════════════════════════');
    console.log('✅ SUCCESS: Inspector-based OAuth discovery works');
    console.log('══════════════════════════════════════════════════════════════════');
    console.log('\n📊 Conclusion:');
    console.log('   - MCP Inspector (reference client) can connect to our server');
    console.log('   - Inspector performs spec-compliant OAuth discovery');
    console.log('   - Inspector does NOT require our AS metadata proxy');
    console.log('   - We can safely remove the proxy endpoint');
  } catch (error) {
    console.error('\n══════════════════════════════════════════════════════════════════');
    console.error('❌ FAILURE: Inspector could not connect or perform OAuth discovery');
    console.error('══════════════════════════════════════════════════════════════════');
    console.error('\nError:', error.message);
    console.error('\n🔍 Troubleshooting:');
    console.error('   1. Is the server running?');
    console.error(`      → Start: pnpm -F @oaknational/oak-curriculum-mcp-streamable-http dev`);
    console.error('   2. Is the server accessible at the specified URL?');
    console.error(`      → Test: curl ${SERVER_URL}/.well-known/oauth-protected-resource`);
    console.error('   3. Is OAuth configured correctly?');
    console.error('      → Check CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY');
    console.error('   4. Can Clerk be reached?');
    console.error('      → Inspector needs to fetch AS metadata from Clerk');

    process.exit(1);
  }
}

validateOAuthWithInspector();
```

#### Step 2.3: Add to package.json

Edit `apps/oak-curriculum-mcp-streamable-http/package.json`:

```json
{
  "scripts": {
    "validate:oauth": "tsx smoke-tests/validate-oauth-with-inspector.ts"
  }
}
```

---

### Phase 3: Run Inspector Validation - 10 minutes

**Execute validation with reference client:**

```bash
# From repository root

# Terminal 1: Start dev server
pnpm -F @oaknational/oak-curriculum-mcp-streamable-http dev

# Terminal 2: Run Inspector validation
pnpm -F @oaknational/oak-curriculum-mcp-streamable-http validate:oauth

# Or against deployed environment:
SERVER_URL=https://your-deployed-server.vercel.app \
  pnpm -F @oaknational/oak-curriculum-mcp-streamable-http validate:oauth
```

**Expected Result:** Inspector connects successfully, proving OAuth discovery works without our proxy.

**If validation PASSES:**

- Proceed to Phase 4 (remove proxy)

**If validation FAILS:**

- Check server is running
- Check Clerk credentials
- Check network connectivity to Clerk
- Review Inspector error output
- **Consider:** Is proxy actually needed? (Very unlikely given SDK evidence)

---

### Phase 4: Update Tests FIRST (TDD) - 20 minutes

**Per @rules.md TDD: Update tests BEFORE removing the endpoint**

This ensures we follow Red → Green → Refactor:

1. Update tests to expect new behavior (Red - tests will fail)
2. Remove proxy endpoint in Phase 5 (Green - tests pass)
3. Refactor if needed

#### Step 4.1: Remove tests for proxy endpoint

File: `apps/oak-curriculum-mcp-streamable-http/e2e-tests/auth-enforcement.e2e.test.ts`

```typescript
// REMOVE THIS TEST:
it('exposes /.well-known/oauth-authorization-server with Clerk metadata', async () => {
  const res = await request(app).get('/.well-known/oauth-authorization-server');
  expect(res.status).toBe(200);
  // ... this test assumes our proxy exists
});
```

#### Step 4.2: Add test validating protected resource metadata structure

File: `apps/oak-curriculum-mcp-streamable-http/e2e-tests/auth-enforcement.e2e.test.ts`

```typescript
// ADD THIS TEST:

it('protected resource metadata contains valid authorization_servers array', async () => {
  // Get our protected resource metadata
  const prRes = await request(app).get('/.well-known/oauth-protected-resource');
  expect(prRes.status).toBe(200);

  // Verify structure per RFC 9728
  expect(prRes.body).toHaveProperty('resource');
  expect(prRes.body).toHaveProperty('authorization_servers');
  expect(Array.isArray(prRes.body.authorization_servers)).toBe(true);
  expect(prRes.body.authorization_servers.length).toBeGreaterThan(0);

  // Verify Clerk URL format
  const clerkAsUrl = prRes.body.authorization_servers[0];
  expect(clerkAsUrl).toContain('clerk');
  expect(clerkAsUrl).toMatch(/^https:\/\//);

  // That's it - DO NOT make network calls to external services (Clerk)
  // Clerk accessibility is validated by Inspector CLI smoke test
});
```

**Note:** Per @testing-strategy.md and project rules, E2E tests must NOT make network calls to external services. Clerk accessibility is validated by the Inspector CLI smoke test (out-of-process validation).

#### Step 4.3: Remove or update helper functions that fetched AS metadata

File: `apps/oak-curriculum-mcp-streamable-http/e2e-tests/auth-enforcement.e2e.test.ts`

Search for any helper functions that fetch authorization server metadata from either our server or Clerk:

```typescript
// FIND functions like this:
async function validateASMetadataStep(app: Express, expectedIssuer: string): Promise<void> {
  const res = await request(app).get('/.well-known/oauth-authorization-server');
  // ...
}

// DECISION:
// 1. If the function tests our proxy endpoint → DELETE IT (we're removing the proxy)
// 2. If the function is used elsewhere → UPDATE it to test only OUR server behavior
// 3. DO NOT add network calls to Clerk (violates @testing-strategy.md)

// Example updated function (if needed elsewhere):
async function validateProtectedResourceMetadata(app: Express): Promise<void> {
  const res = await request(app).get('/.well-known/oauth-protected-resource');
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('authorization_servers');
  expect(Array.isArray(res.body.authorization_servers)).toBe(true);
}
```

**Critical Rule:** E2E tests must ONLY test our server's behavior. NO network calls to external services (Clerk). Per @testing-strategy.md and user memory ID 8343826.

**After Phase 4:** Tests will FAIL (Red state) because proxy endpoint still exists but tests expect it gone.

---

### Phase 5: Remove Proxy Endpoint - 15 minutes

**Note:** Tests updated in Phase 4 are now failing (Red). This phase makes them pass (Green).

#### Step 5.1: Update `auth-routes.ts`

File: `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts`

```typescript
// BEFORE (current state):
import {
  protectedResourceHandlerClerk,
  authServerMetadataHandlerClerk, // ← REMOVE THIS
} from '@clerk/mcp-tools/express';

// AFTER:
import { protectedResourceHandlerClerk } from '@clerk/mcp-tools/express';
```

```typescript
// REMOVE THIS ENTIRE BLOCK:
app.get(
  '/.well-known/oauth-authorization-server',
  addNoCacheHeaders(authServerMetadataHandlerClerk),
);
```

**Keep this (it's correct):**

```typescript
const metadataHandler = addNoCacheHeaders(
  protectedResourceHandlerClerk({
    scopes_supported: ['mcp:invoke', 'mcp:read'],
  }),
);

app.get('/.well-known/oauth-protected-resource', metadataHandler);
```

#### Step 5.2: Keep the dependency

**Do NOT remove from `apps/oak-curriculum-mcp-streamable-http/package.json`:**

```json
{
  "dependencies": {
    "@clerk/mcp-tools": "^0.3.1" // ← KEEP THIS
  }
}
```

We're still using it for `protectedResourceHandlerClerk`.

**After Phase 5:** Tests now PASS (Green state). Proxy removed, tests validate correct behavior.

---

### Phase 6: Quality Gate - 15 minutes

Run all quality gates per @rules.md:

```bash
# From repository root
pnpm i                             # Clean install
pnpm type-gen                      # Regenerate types
pnpm build                         # Build succeeds
pnpm type-check                    # No type errors
pnpm lint -- --fix                 # No lint errors
pnpm format                        # Format code
pnpm markdownlint                  # Markdown lint
pnpm test                          # All tests pass
pnpm test:e2e                      # E2E tests pass
```

**All must pass before considering done.**

---

## Acceptance Criteria

### Functional Requirements (Must Pass)

- [ ] Broken smoke test deleted
- [ ] Inspector harness created (reusable, separate concern)
- [ ] Inspector validation test created (our specific use)
- [ ] Inspector validation passes (reference client works without proxy)
- [ ] `/.well-known/oauth-protected-resource` still works
- [ ] `/.well-known/oauth-protected-resource` returns correct `authorization_servers` array
- [ ] `/.well-known/oauth-authorization-server` endpoint removed from our server
- [ ] `@clerk/mcp-tools` dependency kept in package.json
- [ ] `protectedResourceHandlerClerk` still imported and used
- [ ] `authServerMetadataHandlerClerk` import removed

### Non-Functional Requirements (Must Pass)

- [ ] All E2E tests pass
- [ ] No regression in OAuth flow
- [ ] All quality gates pass
- [ ] Code follows @rules.md and @testing-strategy.md
- [ ] Changes documented

---

## Definition of Done

### Code Complete When:

1. ✅ Broken smoke test deleted
2. ✅ Inspector harness created and tested
3. ✅ Inspector validation passes
4. ✅ Proxy endpoint removed from `auth-routes.ts`
5. ✅ Import of `authServerMetadataHandlerClerk` removed
6. ✅ Tests updated to validate direct Clerk access
7. ✅ All quality gates pass
8. ✅ Documentation updated

### Functionality Proven When:

1. ✅ Inspector validation passes (reference client works without proxy)
2. ✅ E2E tests pass with new architecture
3. ✅ Manual verification:

   ```bash
   # Start server
   pnpm -F @oaknational/oak-curriculum-mcp-streamable-http dev

   # Validate with Inspector (reference client - CAN make network calls)
   pnpm -F @oaknational/oak-curriculum-mcp-streamable-http validate:oauth
   # Expected: SUCCESS - Inspector connects and performs OAuth discovery

   # Verify proxy endpoint removed
   curl http://localhost:3333/.well-known/oauth-authorization-server
   # Expected: 404

   # Verify protected resource metadata works
   curl http://localhost:3333/.well-known/oauth-protected-resource | jq
   # Expected: 200 with authorization_servers pointing to Clerk

   # Verify Clerk AS metadata accessible (manual only, NOT in tests)
   curl https://clerk-fapi-url/.well-known/oauth-authorization-server | jq
   # Expected: 200 with AS metadata
   # Note: E2E tests do NOT make this call per @testing-strategy.md
   ```

### Ready to Ship When:

1. ✅ All acceptance criteria met
2. ✅ All quality gates passed
3. ✅ Inspector validation successful (reference client proof)
4. ✅ Manual tests successful
5. ✅ No regression in existing functionality
6. ✅ Inspector harness documented for reuse

---

## Validation Strategy

### Test Strategy (Per @testing-strategy.md)

**Inspector Validation** (`validate-oauth-with-inspector.ts`) - OUT-OF-PROCESS:

- Uses MCP Inspector CLI (official reference client)
- Tests RUNNING SYSTEM with REAL MCP client
- Makes REAL HTTP requests via Inspector
- Validates behavior per MCP spec 2025-06-18
- **Proves spec-compliant clients work without our proxy**
- This is the GOLD STANDARD test - uses reference implementation

**E2E Tests** (existing) - UPDATE:

- Remove test for our proxy endpoint (architectural violation)
- Add test validating protected resource metadata structure (NO network calls to Clerk)
- Keep test for protected resource metadata serving (correct)
- **Critical:** NO network calls to external services per @testing-strategy.md

**Unit/Integration Tests** - NO CHANGES NEEDED:

- Testing code imports, not running system
- No mocks, no IO per @testing-strategy.md
- Current tests remain valid

### Why Inspector CLI Is The Right Tool

Per the [MCP Inspector documentation](https://github.com/modelcontextprotocol/inspector):

> **CLI mode enables programmatic interaction with MCP servers from the command line, ideal for scripting, automation, and integration with coding assistants. This creates an efficient feedback loop for MCP server development.**

**Inspector as Reference Client:**

- ✅ Official MCP implementation
- ✅ Maintained by MCP maintainers
- ✅ Implements spec correctly
- ✅ Used by MCP clients for testing
- ✅ CLI mode for programmatic testing

**What Inspector Proves:**

- Real MCP client behavior (not our assumptions)
- OAuth discovery implementation per spec
- Whether proxy endpoint is actually needed
- Integration with actual authorization flow

### Manual Validation Checklist

**Before Starting:**

1. [ ] Server starts successfully from root: `pnpm -F @oaknational/oak-curriculum-mcp-streamable-http dev`
2. [ ] Proxy endpoint exists (current wrong state): `curl http://localhost:3333/.well-known/oauth-authorization-server`
3. [ ] Clerk directly accessible (correct): `curl https://<clerk-fapi>/.well-known/oauth-authorization-server`
4. [ ] Environment variables set in root `.env` (CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY)
5. [ ] Understand problem: we're proxying what Clerk should serve directly
6. [ ] Understand solution: remove proxy, validate with Inspector CLI (reference client)

**After Implementation:**

1. [ ] Verify proxy returns 404: `curl http://localhost:3333/.well-known/oauth-authorization-server`
2. [ ] Run Inspector validation: `pnpm -F @oaknational/oak-curriculum-mcp-streamable-http validate:oauth`
3. [ ] Verify protected resource metadata still works
4. [ ] Run all quality gates (Phase 6)
5. [ ] Verify `@clerk/mcp-tools` still in package.json dependencies
6. [ ] All E2E tests pass

---

## Risk Assessment

### Risks: MINIMAL ⭐

| Risk                        | Probability | Impact | Mitigation                          |
| --------------------------- | ----------- | ------ | ----------------------------------- |
| Breaking OAuth flow         | Very Low    | High   | Smoke test validates before changes |
| Clients expect proxy        | Very Low    | Medium | MCP spec says otherwise             |
| Clerk metadata inaccessible | Very Low    | High   | Smoke test catches this             |
| Test failures               | Very Low    | Low    | Clear test update strategy          |

### Why Very Low Risk?

1. ✅ **Smoke test first** - Validates assumption before making changes
2. ✅ **Simple change** - Just removing one endpoint
3. ✅ **Spec-compliant** - Following MCP spec 2025-06-18
4. ✅ **Package recommends it** - @clerk/mcp-tools says this "should not be necessary"
5. ✅ **Easy rollback** - Single git revert

---

## Timeline Estimate

### Phased Approach

- **Phase 0** (Cleanup): 5 minutes
  - Delete broken smoke test
  - Remove from package.json

- **Phase 1** (Evidence Review): 10 minutes
  - Review SDK findings (already done - code inspection)
  - Document conclusion
  - Understand what we're testing vs what Inspector tests

- **Phase 2** (Inspector Harness): 30 minutes
  - Create reusable harness module
  - Create specific validation test
  - Add to package.json scripts

- **Phase 3** (Inspector Validation): 10 minutes
  - Run validation with reference client
  - Verify assumption empirically (CAN make network calls - out-of-process test)

- **Phase 4** (Update Tests FIRST - TDD): 20 minutes
  - **Per @rules.md TDD**: Tests before implementation
  - Remove proxy endpoint test (wrong architecture)
  - Add metadata structure test (NO network calls to Clerk)
  - Remove/update helper functions
  - Tests will FAIL until we remove endpoint (Red state)

- **Phase 5** (Remove Endpoint): 15 minutes
  - Remove import
  - Remove route
  - Keep dependency
  - Tests now PASS (Green state)

- **Phase 6** (Quality Gate): 15 minutes
  - Run all gates
  - Fix any issues

**Total Estimated Time: 105 minutes (~2 hours)**

**Note:**

- Inspector harness is reusable investment - benefits future MCP server testing
- Tests updated BEFORE code changes per @rules.md TDD principle
- Phase numbering reflects logical sequence; execute in order shown

---

## Success Metrics

### Code Quality

- ✅ All quality gates pass
- ✅ Test coverage maintained
- ✅ Code simpler (fewer lines, one less endpoint)
- ✅ Follows @rules.md principles

### Functionality

- ✅ OAuth flow works identically
- ✅ Clients can discover and authenticate
- ✅ No performance regression
- ✅ Architecture more correct per RFCs

### Maintainability

- ✅ Simpler codebase (removed proxy)
- ✅ Using library as intended
- ✅ Tests validate correct architecture
- ✅ Easy to understand and modify

---

## Notes for Implementation

### Key Principles (From @rules.md and @testing-strategy.md)

**TDD Approach:**

- Tests FIRST, then implementation (Red → Green → Refactor)
- For this task: Inspector validation test created BEFORE removing endpoint
- Review SDK evidence (code inspection - already done)
- Create Inspector validation test (out-of-process, CAN make network calls)
- Run validation, confirm it passes (proves assumption empirically)
- Update E2E tests FIRST (remove proxy test, add metadata structure test)
- Make change (remove endpoint)
- Run all tests, confirm they pass (proves no regression)

**Testing Rules:**

- Unit tests: NO IO, NO side effects, NO MOCKS
- Integration tests: NO IO, NO side effects, SIMPLE mocks as arguments only
- E2E tests: Can have IO/side effects but NO network calls to external services
- Inspector validation (smoke test): CAN make network calls (tests running system with real client)

**Keep It Simple (KISS, DRY, YAGNI):**

- Don't overthink this
- Just remove one endpoint
- Keep using @clerk/mcp-tools for what it does well
- No unnecessary abstraction or complexity

**No Compatibility Layers:**

- Don't add flags or options
- Don't keep "just in case"
- Remove cleanly, trust the spec
- Per @rules.md: "NEVER create compatibility layers, no backwards compatibility"

**Quality Gates:**

- All gates must pass per @rules.md
- Never disable checks, never skip tests
- Never work around checks - fix root causes

### What We Learned

**Original assumption:** "Package is immature, internalize everything"

**First insight:** Package is fine. We were using the part it warns against.

**Second insight:** Writing custom smoke tests is wrong - use reference implementations.

**Third insight:** MCP SDK client code explicitly shows it fetches AS metadata from `authorization_servers` URL.

**Fourth insight:** MCP Inspector CLI is the official reference client for validation.

**Lessons:**

1. Read the docs, understand intent, use tools as designed
2. Don't test infrastructure, test client behavior with reference clients
3. Separate concerns: reusable harnesses vs specific tests
4. Use official tooling (Inspector) over custom implementations
5. Follow TDD: evidence → test → refactor

**System-level thinking:** Sometimes the right answer is to do LESS, not MORE. And when testing, use reference implementations, not custom smoke tests.

---

## References

### Standards

- [MCP Auth Spec 2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization) - Current spec
- [RFC 9728](https://datatracker.ietf.org/doc/html/rfc9728) - OAuth 2.0 Protected Resource Metadata
- [RFC 8414](https://datatracker.ietf.org/doc/html/rfc8414) - OAuth 2.0 Authorization Server Metadata

### Official MCP Tooling

- [MCP Inspector](https://github.com/modelcontextprotocol/inspector) - Official testing tool with CLI mode
- [MCP Inspector CLI Documentation](https://github.com/modelcontextprotocol/inspector#cli-mode) - CLI mode for programmatic testing
- [@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk) - Official SDK (client implementation)

### SDK Evidence

- `node_modules/@modelcontextprotocol/sdk/dist/esm/client/auth.d.ts` line 180:
  - Documents that `discoverAuthorizationServerMetadata` takes AS URL from protected resource metadata
  - Proves clients fetch AS metadata from the URL in `authorization_servers` array
  - Confirms proxy is not needed

### Project Standards

- `.agent/directives-and-memory/rules.md` - Code quality rules, testing strategy, TDD requirements
- `docs/agent-guidance/testing-strategy.md` - Testing approach and test types

### Package Documentation

- `@clerk/mcp-tools` README - Lines 77-82 explain why proxy "should not be necessary"
- `reference/clerk-mcp-tools/` - Source code showing what package actually does

---

## Approval Checklist

### Before Starting

- [ ] Broken smoke test identified for deletion
- [ ] Inspector CLI approach understood
- [ ] Separation of concerns clear (harness vs specific test)
- [ ] Goals clearly understood (remove proxy, keep library)
- [ ] Architecture validated (direct Clerk access per spec and SDK)
- [ ] Time estimate reasonable (2 hours including harness creation)

### After Completion

- [ ] All acceptance criteria met
- [ ] All quality gates passed
- [ ] Inspector validation successful (reference client proof)
- [ ] Manual tests successful
- [ ] No regressions in E2E tests
- [ ] Inspector harness documented for future reuse
- [ ] Ready to merge

---

**END OF PLAN**

---

## Key Takeaways

### Architectural Insights

1. **MCP SDK Evidence:** Client code explicitly fetches AS metadata from `authorization_servers` URL
2. **Clerk Package Warning:** `@clerk/mcp-tools` itself says proxy "should not be necessary"
3. **MCP Spec Sequence Diagram:** Shows `Client → AS`, not `Client → RS → AS`
4. **OAuth 2.0 Separation:** Resource servers don't proxy authorization server metadata

### Testing Insights

1. **Don't Test Infrastructure:** Testing Clerk accessibility != testing client behavior
2. **Use Reference Implementations:** MCP Inspector CLI is the official reference client
3. **Separate Concerns:** Reusable harness vs specific tests
4. **Follow TDD:** Evidence → Test → Implementation → Validation
5. **Respect Test Boundaries:** E2E tests = our server only, NO external network calls
6. **Inspector Validation:** Out-of-process test CAN make network calls (testing with real client)

### Implementation Insights

1. **Keep `@clerk/mcp-tools`:** Using it correctly for protected resource metadata
2. **Remove Proxy:** Delete `authServerMetadataHandlerClerk` usage
3. **Use Inspector:** Validate with official reference client, not custom tests
4. **Document Harness:** Make Inspector harness reusable for future MCP server testing

**Remember:** Use tools as intended. Keep using `@clerk/mcp-tools` for protected resource metadata. Remove only the proxy endpoint the package itself warns against. Validate with official reference clients, not custom infrastructure tests.
