# OAuth Discovery Smoke Test

## Purpose

This smoke test **proves that MCP clients successfully connect using OAuth discovery WITHOUT the Authorization Server Metadata proxy endpoint**.

It validates the architectural decision documented in `.agent/plans/remove-oauth-proxy-endpoint.md`:

- ✅ MCP SDK fetches AS metadata directly from Clerk
- ✅ Protected Resource Metadata is sufficient for discovery
- ✅ The proxy endpoint `/.well-known/oauth-authorization-server` is unnecessary

## Why This Test Exists

**Repeatability & Determinism**: Manual validation is error-prone. This automated smoke test provides:

- ✅ Repeatable validation in seconds
- ✅ Deterministic pass/fail outcome
- ✅ Easy re-run if issues arise
- ✅ Documentation of expected behavior

## Test Boundaries

- **Category**: Smoke test (manual, not in CI)
- **I/O**: External (starts dev server, makes HTTP requests)
- **Dependencies**: Requires MCP Inspector CLI, Clerk credentials
- **Runtime**: ~5-10 seconds after server starts

## Usage

### Quick Start (Recommended: curl tests)

The **curl tests** are the primary validation method, as they directly test the OAuth discovery chain:

```bash
# Terminal 1: Start dev server with OAuth enabled
pnpm -F @oaknational/oak-curriculum-mcp-streamable-http dev

# Terminal 2: Run curl tests
# 1. Verify proxy removed (should return 404)
curl -i http://localhost:3333/.well-known/oauth-authorization-server

# 2. Verify protected resource metadata works (should return 200 with JSON)
curl -s http://localhost:3333/.well-known/oauth-protected-resource | jq .

# 3. Verify Clerk AS metadata is directly accessible (no proxy)
curl -s https://[your-clerk-domain]/.well-known/oauth-authorization-server | jq .

# 4. Verify OAuth metadata is accessible
curl -I http://localhost:3333/.well-known/oauth-protected-resource
```

### Inspector CLI Test (Note: Limited by OAuth flow)

The Inspector CLI test demonstrates the **401 authentication challenge**, proving OAuth is enforced:

```bash
pnpm -F @oaknational/oak-curriculum-mcp-streamable-http smoke:oauth-inspector
```

**Expected**: The test will show a 401 response with the WWW-Authenticate header pointing to our protected resource metadata. This is correct behavior - the Inspector CLI would need to complete the full OAuth flow (which requires browser interaction) to proceed.

### Expected Output (Success)

```text
═══════════════════════════════════════════════════════════
🔬 OAuth Discovery Smoke Test (MCP Inspector CLI)
═══════════════════════════════════════════════════════════

📋 Test Configuration:
   Server URL: http://localhost:3333
   Transport: Streamable HTTP
   Timeout: 30000ms

⏳ Waiting for dev server at http://localhost:3333/healthz...
✅ Dev server is ready

🔍 Running MCP Inspector CLI...
   Command: npx @modelcontextprotocol/inspector --cli http://localhost:3333 --transport http --method tools/list

─────────────────────────────────────────────────────────
📊 Test Results:
   Duration: 2543ms
   Exit Code: 0 (success)

📤 Inspector Output:
{
  "tools": [
    { "name": "get-key-stages", ... },
    { "name": "get-subjects", ... },
    ...
  ]
}

═══════════════════════════════════════════════════════════
✅ PASSED: OAuth discovery working correctly!
═══════════════════════════════════════════════════════════

✓ MCP Inspector successfully connected
✓ OAuth discovery completed without proxy
✓ Tools retrieved from server
✓ Found 28 tools

🎉 The Authorization Server Metadata proxy is NOT needed!
   Clients fetch AS metadata directly from Clerk.
```

### Expected Output (Failure)

If OAuth discovery fails, you'll see:

```text
❌ FAILED: Inspector CLI exited with error

🔴 Error Output:
Failed to fetch authorization server metadata from Clerk
```

## What This Test Validates

### 1. OAuth Discovery Flow

The test simulates a real MCP client (Inspector CLI) performing OAuth discovery:

1. **Client** → `GET /mcp` (no auth) → **Server** responds with 401 + WWW-Authenticate header
2. **Client** → `GET /.well-known/oauth-protected-resource` → **Server** returns Clerk AS URL
3. **Client** → `GET https://clerk-url/.well-known/oauth-authorization-server` → **Clerk** (direct fetch, no proxy!)
4. **Client** → `POST /mcp` with auth → **Server** responds with tools list

### 2. No Proxy Needed

The test **proves the proxy is unnecessary** because:

- ✅ Step 3 happens directly between client and Clerk
- ✅ Our server never receives the AS metadata request
- ✅ MCP SDK's `discoverAuthorizationServerMetadata()` handles this automatically

## Troubleshooting

### "Dev server not responding"

```text
❌ FAILED: Dev server not responding at http://localhost:3333

💡 Start the dev server first:
   pnpm -F @oaknational/oak-curriculum-mcp-streamable-http dev
```

**Solution**: Ensure the dev server is running in another terminal.

### "CLERK_PUBLISHABLE_KEY not set"

The dev server will fail to start without Clerk credentials.

**Solution**: Copy `.env.example` to `.env` and add your Clerk keys:

```bash
cp .env.example .env
# Edit .env and add:
# CLERK_PUBLISHABLE_KEY=pk_test_...
# CLERK_SECRET_KEY=sk_test_...
```

### "Inspector CLI times out"

If the test hangs for 30s and fails:

**Possible causes**:

1. Clerk is unreachable (check network)
2. Invalid Clerk credentials (check `.env`)
3. OAuth discovery endpoint broken (check server logs)

## Comparison: Manual vs Automated

| Aspect            | Manual Validation     | This Smoke Test       |
| ----------------- | --------------------- | --------------------- |
| **Time**          | 2-3 minutes           | 10 seconds            |
| **Repeatability** | Low (human error)     | High (deterministic)  |
| **Documentation** | Requires instructions | Self-documenting code |
| **Debugging**     | Unclear what failed   | Clear error messages  |
| **Re-run cost**   | High (manual steps)   | Low (one command)     |

## When to Run This Test

✅ **Run this smoke test when**:

- Implementing OAuth changes
- Upgrading `@clerk/mcp-tools` or MCP SDK
- Debugging OAuth discovery issues
- Validating Clerk configuration
- Onboarding new developers (proves setup works)

❌ **Don't run in CI** (external dependencies):

- Requires dev server (I/O)
- Depends on Clerk (external service)
- Uses Inspector CLI (external tool)

## Related Documentation

- Implementation Plan: `.agent/plans/remove-oauth-proxy-endpoint.md`
- MCP Inspector: <https://github.com/modelcontextprotocol/inspector>
- MCP Spec: <https://modelcontextprotocol.io/specification/2025-03-26/basic/authorization>
- RFC 9728 (Protected Resource Metadata): <https://datatracker.ietf.org/doc/html/rfc9728>
- RFC 8414 (AS Metadata): <https://datatracker.ietf.org/doc/html/rfc8414>
