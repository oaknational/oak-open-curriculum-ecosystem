# Testing Against Alpha Server

## Configuration

Add to `.env` in repository root:

```bash
# Alpha Server URL (no auth required yet)
SMOKE_REMOTE_BASE_URL=https://curriculum-mcp-alpha.oaknational.dev/mcp
```

## Running Smoke Tests

```bash
# Test against alpha server
pnpm smoke:remote

# Or specify URL directly (bypasses .env):
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:remote https://curriculum-mcp-alpha.oaknational.dev/mcp
```

## What Gets Tested

The remote smoke suite now exercises **10 different tools**:

### Basic Tools (via tool catalogue)

1. ✅ `search` - Listed in catalogue
2. ✅ `fetch` - Listed in catalogue
3. ✅ `get-key-stages-subject-lessons` - Listed in catalogue
4. ✅ `get-lessons-assets` - Listed in catalogue
5. ✅ `get-lessons-summary` - Listed in catalogue
6. ✅ `get-units-summary` - Listed in catalogue

### Executed Tools (actually called)

1. ✅ `get-key-stages` - Returns list of key stages
2. ✅ `get-lessons-summary` - Returns lesson metadata
3. ✅ `get-lessons-assets` - Returns downloadable assets for a lesson
4. ✅ `get-units-summary` - Returns unit metadata

### Full Assertion List

1. Health endpoints (`/healthz`)
2. Accept header enforcement (`406` for bad headers)
3. Clerk JWKS accessibility (if OAuth configured, gracefully skips if not)
4. Initialize handshake
5. Tool catalogue validation
6. Validation failures (malformed requests return proper errors)
7. Successful tool call (`get-key-stages`)
8. Synonym canonicalisation
9. Lesson tools (`get-lessons-summary`, `get-lessons-assets`)
10. Unit tools (`get-units-summary`)

## Test IDs Used

- **Lesson**: `maths-ks1-place-value-counting-objects-to-10`
- **Unit**: `maths-ks1-place-value`

These are real curriculum IDs that should exist in the Oak API.

## Important Notes

### No Auth Headers

Remote smoke tests do **not** send authentication headers:

- ✅ Works with your no-auth alpha server
- ✅ Gracefully skip Clerk JWKS check (logs warning if OAuth not configured)
- ✅ All MCP protocol tests execute without authentication

### After OAuth Deployment

Once you deploy OAuth to the alpha server:

- Tests will fail with 401 (expected - auth is required)
- You'll need to use Cursor or Claude Desktop as MCP client to test OAuth flow manually
- Or: Implement OAuth client flow in smoke tests (future enhancement)

### Lesson/Unit IDs

If the test IDs don't exist in your deployment, the tests will fail. You can update the IDs in:

- `smoke-tests/smoke-assertions/tools.ts` (lines 184, 249)

To find valid IDs:

```bash
# Get key stages
curl https://curriculum-mcp-alpha.oaknational.dev/mcp -X POST \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":"1","method":"tools/call","params":{"name":"get-key-stages","arguments":{"params":{}}}}'

# Then use a key stage to get lessons/units
```

## Expected Output

```text
✅ GET /healthz returned expected payload
✅ HEAD /healthz returned 200 with empty body
✅ POST /mcp without streaming Accept header rejected with 406
✅ Initialise handshake returned expected payload
✅ tools/list includes expected entries
✅ Malformed tool call returned validation error (as expected)
✅ Validated get-key-stages tool response
✅ Synonym search terms correctly resolved to primary
✅ get-lessons-summary executed successfully
✅ get-lessons-assets executed successfully
✅ get-units-summary executed successfully
```

## Troubleshooting

### "Remote base URL required"

**Solution**: Add `SMOKE_REMOTE_BASE_URL` to `.env` or pass URL as CLI argument

### "401 Unauthorized"

**Problem**: Alpha server now has OAuth enabled (deployment changed)

**Solution**: This is expected. Remote smoke tests will fail once OAuth is deployed. Use Cursor/Claude Desktop to test OAuth flow manually.

### "404 Not Found" for lesson/unit IDs

**Problem**: The test IDs don't exist in your deployment

**Solution**: Update the IDs in `smoke-tests/smoke-assertions/tools.ts` to match your curriculum data

### Clerk JWKS warnings

**Expected**: Remote tests log a warning if OAuth isn't configured yet:

```text
⚠️  Remote deployment does not have Clerk OAuth configured
```

This is normal for pre-OAuth deployments and won't fail the tests.
