# Dev Server Management

## The Problem

When developing the MCP server, you may encounter situations where:

- An old dev server is still running on port 3333
- OAuth metadata endpoints return 404 (because old server had auth disabled)
- Changes to auth configuration don't take effect
- Port conflicts prevent new server from starting

This commonly happens when:

1. You start a server with `pnpm dev:observe:noauth` (auth disabled)
2. Later try to test OAuth, but connect to the old server (no OAuth endpoints)
3. Changes to server code aren't reflected (still running old process)

## The Solution

### Quick Restart Script (Recommended)

Use the `restart-dev-server.sh` script to automatically clean up and restart:

```bash
# Standard dev mode with auth
./scripts/restart-dev-server.sh

# Dev mode with auth + logging to file
./scripts/restart-dev-server.sh observe

# Dev mode WITHOUT auth (testing only)
./scripts/restart-dev-server.sh noauth
```

The script automatically:

1. ✅ Kills any existing process on port 3333
2. ✅ Verifies the port is free
3. ✅ Starts the server in the specified mode

### Manual Process

If you prefer to do it manually:

```bash
# 1. Check what's running on port 3333
lsof -i:3333

# 2. Kill any existing process
lsof -ti:3333 | xargs kill -9 2>/dev/null || true

# 3. Verify port is free
lsof -i:3333 || echo "✅ Port 3333 is free"

# 4. Start new server
pnpm dev                    # Auth enabled
pnpm dev:observe            # Auth enabled + logging
pnpm dev:observe:noauth     # Auth DISABLED (testing only)
```

## Dev Server Modes

### `pnpm dev` - Standard Development

- **Auth**: Enabled ✅
- **Logging**: Console only
- **Use for**: Standard development

```bash
pnpm dev
```

### `pnpm dev:observe` - Development with Logging

- **Auth**: Enabled ✅
- **Logging**: Console + file (`.logs/http-dev-*.log`)
- **Use for**: Debugging OAuth flows, observability testing

```bash
pnpm dev:observe
```

Logs are written to timestamped files for later analysis.

### `pnpm dev:observe:noauth` - Development without Auth

- **Auth**: Disabled ⚠️
- **Logging**: Console + file (`.logs/http-dev-noauth-*.log`)
- **Use for**: Testing tool execution without OAuth overhead

```bash
pnpm dev:observe:noauth
```

**⚠️ WARNING**: This mode does NOT register OAuth metadata endpoints. Use only for testing tool logic, not for OAuth validation.

## OAuth Testing Checklist

When testing OAuth flows, ensure:

1. ✅ **Server started with auth enabled** (`pnpm dev` or `pnpm dev:observe`)
2. ✅ **No old servers running** (use `lsof -i:3333` to check)
3. ✅ **OAuth metadata accessible**:

   ```bash
   curl http://localhost:3333/.well-known/oauth-protected-resource | jq
   ```

4. ✅ **Clerk credentials set** (check `.env` or environment)

## Common Issues

### Issue: OAuth metadata returns 404

**Cause**: Server started with `DANGEROUSLY_DISABLE_AUTH=true`

**Solution**:

```bash
./scripts/restart-dev-server.sh observe
curl http://localhost:3333/.well-known/oauth-protected-resource
```

### Issue: Changes not reflected

**Cause**: Old dev server still running

**Solution**:

```bash
./scripts/restart-dev-server.sh
```

### Issue: Port 3333 already in use

**Cause**: Process not cleaned up properly

**Solution**:

```bash
lsof -ti:3333 | xargs kill -9
pnpm dev
```

## Best Practices

1. **Always use the restart script** when switching between auth modes
2. **Check server logs** to confirm OAuth endpoints are registered:

   ```text
   {"Body":"Registering PUBLIC OAuth metadata endpoints (before auth middleware)"}
   ```

3. **Verify OAuth metadata** is accessible before testing flows
4. **Use `dev:observe`** when debugging OAuth to capture full logs

## Related Documentation

- [OAuth Testing Strategy](../TESTING.md#oauth-testing)
- [OAuth Validation Results](../smoke-tests/OAUTH-VALIDATION-RESULTS.md)
- [Testing Strategy](../../../../.agent/directives/testing-strategy.md)
