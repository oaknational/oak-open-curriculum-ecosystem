# Oak Curriculum MCP – Streamable HTTP (Vercel-ready)

This app exposes the Curriculum MCP server over Streamable HTTP using the official TypeScript SDK transport. It uses **stateless session management** (no server-side state) and is designed for Vercel's serverless Node runtime. Responses are streamed using Server-Sent Events (SSE) as per the MCP specification.

**Architecture**: This server imports all MCP tool definitions from `@oaknational/curriculum-sdk`. The tools are generated at compile time from the OpenAPI schema - no manual tool definitions exist in this application. When the API changes, `pnpm type-gen` updates the SDK, and this server automatically has access to new/changed tools.

## Quick start (local)

1. Set env vars (minimal):

```bash
export OAK_API_KEY=your_api_key
export REMOTE_MCP_DEV_TOKEN=dev-token
export ALLOWED_HOSTS=localhost,127.0.0.1,::1
```

2. Run dev server:

```bash
pnpm -C apps/oak-curriculum-mcp-streamable-http dev
```

3. List tools (dev token):

```bash
curl -sS \
  -H "Authorization: Bearer $REMOTE_MCP_DEV_TOKEN" \
  -H 'Content-Type: application/json' \
  -X POST http://localhost:3333/mcp \
  -d '{"jsonrpc":"2.0","id":"1","method":"tools/list"}'
```

Note: The server automatically adds the required `Accept: application/json, text/event-stream` header if missing, improving UX for simple curl commands and UI integrations.

## Vercel deployment

- Use Node runtime (not Edge)
- Required env:
  - `CLERK_PUBLISHABLE_KEY` - Clerk publishable key for OAuth
  - `CLERK_SECRET_KEY` - Clerk secret key for auth middleware
  - `OAK_API_KEY` - Oak Curriculum API key
- Optional env:
  - `ALLOWED_HOSTS` (comma-separated, must include your primary hostname; supports `*` wildcards)
  - `ALLOWED_ORIGINS` for browser CORS
  - `LOG_LEVEL` (default `info`, use `debug` for staging)
  - `REMOTE_MCP_MODE` (default `stateless`, recommended for Vercel - see `docs/vercel-environment-config.md`)
  - `BASE_URL` (recommended; if omitted we derive from request host)
  - `MCP_CANONICAL_URI` (recommended; defaults to `${BASE_URL}/mcp` if `BASE_URL` is set)

**Important**: This server uses **stateless mode** by default, which is correct for Vercel's serverless architecture. Session state is not maintained between requests. See `docs/vercel-environment-config.md` for detailed explanation of transport modes.

### Smoke-test checklist (post-deploy)

- Confirm Node runtime (not Edge) in project settings
- Verify envs set: `OAK_API_KEY`, `ALLOWED_HOSTS` (+ optionally `BASE_URL`, `MCP_CANONICAL_URI`)
- Curl `/.well-known/oauth-protected-resource` returns resource + auth servers
- POST `/mcp` without auth returns 401 with `WWW-Authenticate` containing `resource` and `authorization_uri`
- POST `/mcp` with a valid Bearer token returns 200 and SSE-wrapped JSON-RPC

### OAuth discovery

- `GET /.well-known/oauth-protected-resource` returns the canonical resource and authorisation servers
- 401 responses include a `WWW-Authenticate` header with `resource` and `authorization_uri` to guide clients

## Request Tracing with Correlation IDs

The HTTP server automatically generates unique correlation IDs for each request to enable end-to-end request tracing and debugging.

### How it works

- Each incoming request receives a unique correlation ID in the format `req_{timestamp}_{randomHex}` (e.g., `req_1699123456789_a3f2c9`)
- If a client provides an `X-Correlation-ID` header, that ID is preserved and reused
- The correlation ID is included in the `X-Correlation-ID` response header
- All logs for a request include the correlation ID, making it easy to trace request flows

### Using correlation IDs

**Making a request:**

```bash
curl -i http://localhost:3333/healthz
# Response includes: X-Correlation-ID: req_1699123456789_a3f2c9
```

**Providing your own correlation ID:**

```bash
curl -i -H "X-Correlation-ID: my-trace-123" http://localhost:3333/healthz
# Response includes: X-Correlation-ID: my-trace-123
```

**Debugging with correlation IDs:**

1. Find the correlation ID from the response header or logs
2. Filter server logs by that correlation ID
3. See all operations for that specific request

**Example log filtering:**

```bash
# If logs are in stdout (Vercel):
grep "req_1699123456789_a3f2c9" logs.txt

# If using structured logging (JSON), filter by correlationId field
```

### Benefits

- **Distributed tracing**: Track requests across multiple services
- **Debugging**: Quickly find all logs related to a specific request
- **Error investigation**: Trace the full context of errors
- **Performance analysis**: Measure request latency by following correlation IDs

## Request Timing

All HTTP requests are automatically timed and logged with duration information. Slow requests (>2 seconds) are logged at WARN level for easy identification.

### How it works

- Every request starts a high-precision timer when received
- Duration is logged when the response completes
- Timing data includes both formatted ("1.23s") and precise (1234.56ms) values
- Slow requests are automatically flagged with `slowRequest: true`

### Example logs

**Normal request** (DEBUG level):

```json
{
  "level": "debug",
  "message": "Request completed",
  "correlationId": "req_1699123456789_a3f2c9",
  "duration": "145ms",
  "durationMs": 145.23,
  "method": "POST",
  "path": "/",
  "statusCode": 200
}
```

**Slow request** (WARN level):

```json
{
  "level": "warn",
  "message": "Request completed",
  "correlationId": "req_1699123456790_b4e3d0",
  "duration": "2.34s",
  "durationMs": 2340.12,
  "method": "POST",
  "path": "/",
  "statusCode": 200,
  "slowRequest": true
}
```

### Filtering and analyzing timing logs

**Find all slow requests:**

```bash
# Using grep
grep '"slowRequest":true' logs/server.log

# Using jq for better formatting
grep '"slowRequest":true' logs/server.log | jq .
```

**Find requests over 1 second:**

```bash
jq 'select(.durationMs > 1000)' logs/server.log
```

**Average request duration:**

```bash
jq -s 'map(.durationMs) | add/length' logs/server.log
```

**Find slowest requests:**

```bash
jq -s 'sort_by(.durationMs) | reverse | .[0:10]' logs/server.log
```

## Runtime Bootstrap Diagnostics

The server emits structured diagnostics while building the Express app so you can identify which stage is slow or failing in production.

- `bootstrap.phase.start` / `bootstrap.phase.finish` – wraps key startup phases (`setupBaseMiddleware`, `applySecurity`, `initializeCoreEndpoints`, `setupAuthRoutes`)
- `bootstrap.mcp.transport.connect.start` / `bootstrap.mcp.transport.connect.finish` – measures the MCP transport handshake (`server.connect`)
- `auth.bootstrap.step.start` / `auth.bootstrap.step.finish` / `auth.bootstrap.step.error` – instruments Clerk/OAuth setup (middleware creation, registration, unauthenticated fallback)

> Tip: set `LOG_LEVEL=debug` locally or in staging to see the corresponding `*.start` entries. Finish/error logs are emitted at `info`/`error` regardless of log level so they remain visible in production.

### Inspecting bootstrap performance

```bash
# Most recent bootstrap phases with duration
jq 'select(.message == "bootstrap.phase.finish") | {appId, phase, duration, durationMs}' vercel-logs.txt | tail -8

# Total startup time per app instance
jq 'select(.message == "bootstrap.complete") | {appId, duration, durationMs}' vercel-logs.txt | tail -5

# MCP transport connection timing
jq 'select(.message == "bootstrap.mcp.transport.connect.finish") | {duration, durationMs}' vercel-logs.txt | tail -5
```

### Inspecting authentication setup

```bash
# Clerk middleware lifecycle
jq 'select(.message == "auth.bootstrap.step.finish" and .step == "clerkMiddleware.create")' vercel-logs.txt | tail -5

# Detect auth setup failures
jq 'select(.message == "auth.bootstrap.step.error")' vercel-logs.txt
```

These diagnostics help distinguish between Express wiring issues, MCP transport delays, and authentication configuration problems (e.g., missing Clerk keys).

## Error Debugging

The HTTP server enriches all errors with correlation IDs, timing information, and request context for improved production debugging. Error logs include:

- **Correlation ID**: Unique identifier for tracing requests across the system
- **Timing**: Request duration when the error occurred
- **Request details**: HTTP method, path, and status code
- **Error context**: Original error message and stack trace

### Example enriched error log

```json
{
  "level": "error",
  "message": "Request error",
  "context": {
    "message": "Database connection timeout",
    "stack": "Error: Database connection timeout\n    at ...",
    "correlationId": "req_1699123456789_a3f2c9",
    "duration": "2.34s",
    "durationMs": 2340.56,
    "method": "POST",
    "path": "/mcp/v1/messages",
    "statusCode": 500
  },
  "timestamp": "2024-11-06T12:34:56.789Z"
}
```

### Filtering errors by correlation ID

When a client reports an error, use the correlation ID (returned in the `X-Correlation-ID` response header) to find all logs for that request:

```bash
# Find all logs for a specific request
grep 'req_1699123456789_a3f2c9' logs/server.log

# Pretty-print with jq
grep 'req_1699123456789_a3f2c9' logs/server.log | jq .

# Find the error and surrounding context
grep -C 5 'req_1699123456789_a3f2c9.*error' logs/server.log
```

### Example curl request with error response

```bash
curl -v https://your-server.com/mcp/v1/messages \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"invalid": "request"}'

# Response includes X-Correlation-ID header
< HTTP/1.1 500 Internal Server Error
< X-Correlation-ID: req_1699123456789_a3f2c9
< Content-Type: application/json
{
  "error": "Internal Server Error",
  "message": "Invalid request format",
  "correlationId": "req_1699123456789_a3f2c9"
}
```

### Troubleshooting workflow for errors

1. **Client reports error** → Note the `X-Correlation-ID` from the response headers
2. **Search logs** → `grep '<correlation-id>' logs/server.log | jq .`
3. **Review request** → Check the "Request started" log for request details
4. **Find error** → Look for error log with same correlation ID
5. **Check timing** → Compare duration to identify timeout or slow operations
6. **Analyze stack trace** → Error log includes full stack trace for debugging

### Finding all errors

**All errors in logs:**

```bash
jq 'select(.level == "error")' logs/server.log
```

**Errors with timing over 2 seconds (slow request timeouts):**

```bash
jq 'select(.level == "error" and .context.durationMs > 2000)' logs/server.log
```

**Group errors by path:**

```bash
jq -s 'group_by(.context.path) | map({path: .[0].context.path, count: length})' logs/server.log
```

## Production Logging

The HTTP server uses structured JSON logging with comprehensive instrumentation for production monitoring and debugging.

### Log Structure

All logs follow a consistent JSON structure with correlation IDs, timing data, and contextual information:

```json
{
  "level": "info|debug|warn|error",
  "message": "Human-readable message",
  "correlationId": "req_1699123456789_a3f2c9",
  "duration": "145ms",
  "durationMs": 145.23,
  "method": "POST",
  "path": "/mcp",
  "statusCode": 200,
  "timestamp": "2024-11-06T12:34:56.789Z",
  "context": {}
}
```

### Log Levels

The server uses the following log levels:

- **DEBUG**: Request start/complete, detailed operation traces (development only)
- **INFO**: Normal operations, successful requests, service lifecycle events
- **WARN**: Slow requests (>2s), recoverable errors, performance warnings
- **ERROR**: Failed requests, unhandled errors, service degradation

**Production recommendation**: Set `LOG_LEVEL=INFO` or `LOG_LEVEL=WARN` to reduce log volume.

### Log Volume Estimates

Typical production log volume (per request):

- **Minimal (INFO level)**: 1-2 log entries per request (lifecycle events only)
- **Standard (INFO level with timing)**: 2-3 log entries per request
- **Debug (DEBUG level)**: 5-10 log entries per request (includes all operations)

Expected daily volume for 1M requests/day at INFO level: ~2-3 GB uncompressed JSON logs.

### Log Retention Recommendations

**Vercel**:

- Vercel stores logs for 1 hour by default (hobby/pro plans)
- Consider using Log Drains to export logs to external storage (Datadog, LogDNA, S3)
- Recommended retention: 30 days for operational logs, 90+ days for compliance

**Log Drains Setup** (Vercel Dashboard):

1. Project Settings → Integrations → Add Integration
2. Search for log drain provider (Datadog, Logplex, etc.)
3. Configure with provider credentials
4. Logs are automatically streamed in real-time

### Filtering Techniques

**By Correlation ID** (find all logs for a specific request):

```bash
grep 'req_1699123456789_a3f2c9' logs.txt | jq .
```

**By Timing** (find slow requests):

```bash
jq 'select(.durationMs > 2000)' logs.txt
```

**By Error** (find all errors):

```bash
jq 'select(.level == "error")' logs.txt
```

**By Path** (analyze specific endpoints):

```bash
jq 'select(.path == "/mcp")' logs.txt
```

**By Date Range** (using ISO timestamps):

```bash
jq 'select(.timestamp >= "2024-11-06T00:00:00Z" and .timestamp < "2024-11-07T00:00:00Z")' logs.txt
```

### Vercel Logging Configuration

The server automatically logs to stdout, which Vercel captures and makes available in the dashboard.

**Environment Variables:**

- `LOG_LEVEL`: Set log verbosity
  - Development/Staging: `DEBUG` or `INFO`
  - Production: `INFO` or `WARN` (recommended)

**Vercel Dashboard Configuration:**

In the Vercel UI, verify/configure:

1. **Environment Variables** → Confirm `LOG_LEVEL` is set appropriately for each environment
2. **Logs Tab** → Confirm log retention settings match your requirements
3. **Log Drains** → Configure if using external log aggregation (Datadog, LogDNA, etc.)
4. **Runtime Logs** → Verify structured JSON format appears correctly
5. **Search/Filter** → Test filtering logs by `correlationId` field

**Vercel Log Drains Documentation**: [https://vercel.com/docs/observability/log-drains](https://vercel.com/docs/observability/log-drains)

### Operational Debugging Workflows

#### Workflow 1: Investigating a Slow Request

**Scenario**: Client reports a request that took over 5 seconds to complete.

**Steps:**

1. **Get correlation ID** from the response headers: `X-Correlation-ID: req_1699123456789_a3f2c9`
2. **Search logs** for that correlation ID:

   ```bash
   grep 'req_1699123456789_a3f2c9' logs.txt | jq .
   ```

3. **Analyze timing**:
   - Check "Request started" log for request details
   - Check "Request completed" log for total duration
   - Look for `slowRequest: true` flag

4. **Identify bottleneck**:
   - Review operations between start and complete
   - Check for external API calls or database queries
   - Compare with average request duration

5. **Take action**:
   - If consistently slow: optimize the operation
   - If intermittent: check for timeouts or rate limiting
   - If specific to certain requests: analyze request patterns

#### Workflow 2: Investigating a Failed Request

**Scenario**: Client reports a 500 error when calling the API.

**Steps:**

1. **Get correlation ID** from client (response header or error response body)
2. **Find all logs** for that request:

   ```bash
   grep '<correlation-id>' logs.txt | jq .
   ```

3. **Review sequence**:
   - Find "Request started" log → See what was requested
   - Find error log → See what failed and why
   - Check timing → See if timeout was involved

4. **Extract error context**:

   ```json
   {
     "level": "error",
     "correlationId": "req_1699123456789_a3f2c9",
     "context": {
       "message": "Database connection timeout",
       "stack": "...",
       "duration": "5.23s",
       "method": "POST",
       "path": "/mcp"
     }
   }
   ```

5. **Take action**:
   - Check error message and stack trace
   - Review request timing for timeouts
   - Verify external dependencies (database, APIs)
   - Look for similar errors in logs

#### Workflow 3: Investigating Intermittent Issues

**Scenario**: Users report occasional slow responses or timeouts, but not consistently.

**Steps:**

1. **Collect correlation IDs** from affected and unaffected requests
2. **Compare timing patterns**:

   ```bash
   # Fast requests
   grep 'req_1699123456789_a3f2c9' logs.txt | jq '.durationMs'

   # Slow requests
   grep 'req_1699123456790_b4e3d0' logs.txt | jq '.durationMs'
   ```

3. **Analyze patterns**:
   - Time of day (peak vs off-peak)
   - Request type or path
   - Geographic region (if available)
   - Request size or complexity

4. **Find commonalities**:

   ```bash
   # Find all slow requests
   jq 'select(.slowRequest == true)' logs.txt | jq -s 'group_by(.path) | map({path: .[0].path, count: length})'
   ```

5. **Take action**:
   - If time-based: consider auto-scaling
   - If path-specific: optimize that endpoint
   - If random: check for external service issues

#### Workflow 4: Client-Reported Issues

**Scenario**: Support team receives a user complaint about an error or unexpected behavior.

**Steps:**

1. **Request correlation ID** from client:
   - Check response headers: `X-Correlation-ID`
   - Check error response body: `correlationId` field

2. **Search logs** with correlation ID:

   ```bash
   grep 'req_1699123456789_a3f2c9' logs.txt | jq .
   ```

3. **Reconstruct request lifecycle**:

   ```json
   // Request started
   {"level":"debug","message":"Request started","correlationId":"req_...","method":"POST","path":"/mcp"}

   // Request completed (or error)
   {"level":"warn","message":"Request completed","correlationId":"req_...","duration":"2.34s","slowRequest":true}
   ```

4. **Identify root cause**:
   - Check for errors in the log sequence
   - Review timing for performance issues
   - Examine request parameters and context

5. **Provide resolution**:
   - Share specific error details with client
   - Document issue for engineering team
   - Apply fix or workaround

### Monitoring and Alerting

Consider setting up alerts for:

- **High error rate**: `level == "error"` count exceeds threshold
- **Slow requests**: `slowRequest == true` frequency increases
- **Request volume**: Total request count anomalies
- **Failed authentications**: 401 responses spike

Use log drain integrations to send logs to monitoring platforms that support alerting (Datadog, New Relic, CloudWatch, etc.).

## Production Diagnostics

The built-server harness allows you to test the production build locally under multiple configuration scenarios to diagnose deployment issues and validate instrumentation before deploying to Vercel.

### Quick Start

The harness executes the built production bundle (`dist/src/index.js`) with configurable environment files, mirroring Vercel's invocation pattern:

```bash
# Step 1: Build the production bundle
cd apps/oak-curriculum-mcp-streamable-http
pnpm build

# Step 2: Set up environment configuration (first time only)
cp config/harness-auth-disabled.env .env.harness.auth-disabled

# Step 3: Run the harness
ENV_FILE=.env.harness.auth-disabled pnpm prod:harness
```

The server starts on port 3001 (configurable via `PORT` in the env file) and emits structured JSON logs showing bootstrap timing, authentication setup, and runtime diagnostics.

### Configuration Scenarios

Three pre-configured scenarios are available to test different authentication and configuration states:

#### 1. Auth Disabled (Recommended for Initial Testing)

Tests the server without Clerk dependencies:

```bash
# Setup (first time)
cp config/harness-auth-disabled.env .env.harness.auth-disabled

# Run
ENV_FILE=.env.harness.auth-disabled pnpm prod:harness
```

**Use case**: Verify core server functionality, MCP handlers, and instrumentation without authentication complexity.

#### 2. Auth Enabled with Clerk Keys

Tests the full authentication flow with Clerk:

```bash
# Setup (first time)
cp config/harness-auth-enabled.env .env.harness.auth-enabled
# Edit .env.harness.auth-enabled and replace Clerk keys with real test keys

# Run
ENV_FILE=.env.harness.auth-enabled pnpm prod:harness
```

**Use case**: Validate OAuth flow, Clerk middleware initialization, and authenticated requests.

#### 3. Missing Clerk Configuration

Tests error handling when auth is enabled but Clerk keys are missing:

```bash
# Setup (first time)
cp config/harness-missing-clerk.env .env.harness.missing-clerk

# Run
ENV_FILE=.env.harness.missing-clerk pnpm prod:harness
```

**Use case**: Reproduce deployment hangs or initialization failures when Clerk is misconfigured.

**Expected behavior**: Server should fail fast with a clear error message or demonstrate the hang condition for diagnosis.

### Automated Request Testing

The request runner script sends a sequence of test requests and reports timing and success/failure:

```bash
# In a separate terminal (while harness is running)
pnpm prod:requests
```

**Request sequence:**

1. `GET /healthz` - Basic health check
2. `GET /` - Landing page (exercises base middleware)
3. `POST /mcp` - MCP initialize message (exercises full auth + MCP handler stack)

**Output example:**

```text
================================================================================
REQUEST SUMMARY
================================================================================
Name                    | Method | Status | Duration | Result
--------------------------------------------------------------------------------
Health Check            | GET    | 200    | 45ms     | ✅ OK
Landing Page            | GET    | 200    | 67ms     | ✅ OK
MCP Initialize          | POST   | 200    | 234ms    | ✅ OK
================================================================================
```

Exit code: 0 if all requests succeed, 1 if any fail.

### Manual Request Testing

You can also test requests manually using curl:

**Health check:**

```bash
curl -i http://localhost:3001/healthz
```

**Landing page:**

```bash
curl -i http://localhost:3001/
```

**MCP initialize (no auth):**

```bash
curl -i -X POST http://localhost:3001/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05",
      "capabilities": {},
      "clientInfo": {
        "name": "test-client",
        "version": "1.0.0"
      }
    }
  }'
```

**MCP initialize (with auth):**

```bash
curl -i -X POST http://localhost:3001/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-test-token>" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05",
      "capabilities": {},
      "clientInfo": {
        "name": "test-client",
        "version": "1.0.0"
      }
    }
  }'
```

### Interpreting Harness Logs

The harness emits structured JSON logs. Key log messages to look for:

**Server startup:**

```json
{"timestamp":"...","level":"INFO","message":"Server harness starting","harness":"production-build"}
{"timestamp":"...","level":"INFO","message":"Environment loaded successfully","fileLoaded":true}
{"timestamp":"...","level":"INFO","message":"Configuration snapshot","PORT":"3001","LOG_LEVEL":"debug"}
```

**Bootstrap phases (from Phase 1 instrumentation):**

```json
{"timestamp":"...","level":"DEBUG","message":"bootstrap.phase.start","phase":"setupBaseMiddleware"}
{"timestamp":"...","level":"INFO","message":"bootstrap.phase.finish","phase":"setupBaseMiddleware","durationMs":12.34}
```

**Authentication setup:**

```json
{"timestamp":"...","level":"DEBUG","message":"auth.bootstrap.step.start","step":"clerkMiddleware.create"}
{"timestamp":"...","level":"INFO","message":"auth.bootstrap.step.finish","step":"clerkMiddleware.create","durationMs":45.67}
```

**Server ready:**

```json
{"timestamp":"...","level":"INFO","message":"Server listening","port":3001,"totalBootstrapMs":234}
{"timestamp":"...","level":"INFO","message":"Harness ready for requests","healthCheck":"http://localhost:3001/healthz"}
```

### Troubleshooting Common Issues

#### Server Fails to Start

**Symptom**: Harness exits with error during startup.

**Check:**

1. **Build artifacts exist**: Verify `dist/src/index.js` exists (run `pnpm build`)
2. **Environment file loaded**: Look for "Environment loaded successfully" in logs
3. **Configuration issues**: Check "Configuration snapshot" log for missing/invalid values
4. **Port already in use**: Change `PORT=3001` to another port in env file

#### Server Hangs During Startup

**Symptom**: Harness starts but never reaches "Server listening" message.

**Check:**

1. **Bootstrap phase logs**: Find which phase is last logged before hang
2. **Auth setup logs**: Look for `auth.bootstrap.step.start` without matching `finish`
3. **Clerk middleware**: If using auth-enabled scenario, verify Clerk keys are valid
4. **Missing config**: If using missing-clerk scenario, this may be the expected behavior

**Diagnosis workflow:**

```bash
# Run harness with debug logging
ENV_FILE=.env.harness.missing-clerk pnpm prod:harness 2>&1 | tee harness-debug.log

# In another terminal, monitor bootstrap phases
tail -f harness-debug.log | grep bootstrap.phase
```

#### Requests Timeout or Fail

**Symptom**: `pnpm prod:requests` reports failures or timeouts.

**Check:**

1. **Server is ready**: Wait for "Harness ready for requests" log before running requests
2. **Port mismatch**: Ensure request runner uses same port as harness (default 3001)
3. **Auth requirements**: MCP requests may require Bearer token in auth-enabled scenario
4. **Request timeout**: Increase `TIMEOUT_MS` env var for request runner if needed

**Manual test:**

```bash
# Test health check first
curl -v http://localhost:3001/healthz

# If health check works but MCP fails, check auth requirements
curl -v -X POST http://localhost:3001/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}'
```

#### Auth Middleware Errors

**Symptom**: Logs show `auth.bootstrap.step.error` or auth-related failures.

**Common causes:**

1. **Invalid Clerk keys**: Verify keys start with `pk_test_` and `sk_test_` in env file
2. **Missing Clerk keys**: If auth is enabled, both keys must be present
3. **Network issues**: Clerk middleware may attempt to fetch public keys on init
4. **Environment mismatch**: Test keys only work in development; use production keys in production

**Resolution:**

- For testing without Clerk: Use `harness-auth-disabled.env` scenario
- For testing with Clerk: Use valid test keys from Clerk dashboard
- For reproducing hang: Use `harness-missing-clerk.env` to test error handling

### Comparing with Vercel Behavior

The harness mirrors Vercel's invocation pattern:

| Aspect           | Vercel Serverless                    | Local Harness                   |
| ---------------- | ------------------------------------ | ------------------------------- |
| Entry point      | `dist/src/index.js` default export   | Same (imported via `createApp`) |
| Node version     | Configurable (Node 24.x recommended) | Uses local Node version         |
| Environment      | Vercel env vars                      | Local `.env.harness.*` files    |
| Logging          | stdout captured by Vercel            | stdout to terminal              |
| Request handling | Per-request invocation (cold starts) | Long-running server (warm)      |

**Key differences:**

- **Cold starts**: Vercel may create new instances per request; harness reuses same instance
- **Network**: Harness runs on localhost; Vercel uses public endpoints
- **Secrets**: Harness uses local env files; Vercel uses encrypted environment variables

### Advanced Usage

**Custom port:**

```bash
# Modify PORT in env file, then run
PORT=4000 ENV_FILE=.env.harness.auth-disabled pnpm prod:harness
```

**Custom environment file:**

```bash
# Create your own .env.harness.custom file, then run
ENV_FILE=.env.harness.custom pnpm prod:harness
```

**Background execution:**

```bash
# Run harness in background
ENV_FILE=.env.harness.auth-disabled pnpm prod:harness &
HARNESS_PID=$!

# Run requests
pnpm prod:requests

# Stop harness
kill $HARNESS_PID
```

**Capture logs to file:**

```bash
ENV_FILE=.env.harness.auth-disabled pnpm prod:harness 2>&1 | tee harness-$(date +%Y%m%d-%H%M%S).log
```

**One-liner (build + run):**

```bash
ENV_FILE=.env.harness.auth-disabled pnpm prod:diagnostics
```

### Related Documentation

- Phase 1 instrumentation details: See "Runtime Bootstrap Diagnostics" section above
- Production debugging workflows: See `docs/development/production-debugging-runbook.md`
- Vercel deployment guide: See "Vercel deployment" section above

## Cursor (local STDIO) configuration

- The local STDIO server is configured via `.mcp.json` / `.cursor/mcp.json`. Ensure the command path points to:

```json
{
  "command": "pnpm",
  "args": ["exec", "tsx", "apps/oak-curriculum-mcp-stdio/bin/oak-curriculum-mcp.ts"]
}
```

If tools do not appear, check `.logs/oak-curriculum-mcp-startup/startup.log` for diagnostics.

## Authentication

The server uses **Clerk OAuth** for production authentication. All requests to `/mcp` must include a valid Bearer token in the `Authorization` header.

> **Current status**: Authentication is provided by a Clerk test
> instance. Only internal Oak team members are supported as users
> at this time. External access is not available.

### OAuth Flow

1. Unauthenticated requests return `401` with `WWW-Authenticate` header containing OAuth discovery information
2. Client discovers authorization server via `/.well-known/oauth-protected-resource` endpoint
3. Client follows OAuth Authorization Code + PKCE flow to obtain access token
4. Client includes token in `Authorization: Bearer <token>` header

### Development Authentication

For local development only:

- Set `DANGEROUSLY_DISABLE_AUTH=true` to bypass authentication
- **NEVER** enable this in production or preview environments

### MCP Client Configuration

When configuring MCP clients (like Claude Desktop), they will automatically:

1. Detect the OAuth requirement from the 401 response
2. Follow the OAuth discovery flow
3. Redirect users to Clerk for authentication
4. Store and use the resulting access token

See `docs/clerk-oauth-trace-instructions.md` for detailed OAuth flow documentation.

## Troubleshooting

- 500 on `/.well-known/oauth-protected-resource` or `/mcp`:
  - Ensure Vercel framework is Express and the app default‑exports an Express instance (this repo does in `src/index.ts`).
  - Verify `ALLOWED_HOSTS` includes your alias host (e.g. `curriculum-mcp-alpha.oaknational.dev`).
  - If using local demo AS, ensure `ENABLE_LOCAL_AS=true` and `LOCAL_AS_JWK` is present or allow the app to generate it.
- 401 without `Authorization`: client must send a Bearer token; see OAuth metadata endpoint. For demo: enable `ENABLE_LOCAL_AS=true` and mint a short‑lived JWT.
- CORS blocked: set `ALLOWED_ORIGINS` to include your origin
- Host blocked: add host to `ALLOWED_HOSTS`
- Dev local AS: set `ENABLE_LOCAL_AS=true` and provide `LOCAL_AS_JWK` or let the app generate one

## Search tools (optional)

Three additional search tools (`search-sdk`, `browse-curriculum`, `explore-topic`) provide Elasticsearch-backed semantic search. Set `ELASTICSEARCH_URL` and `ELASTICSEARCH_API_KEY` in the environment to enable them. The factory in `src/search-retrieval-factory.ts` creates the Search SDK instance when credentials are present. Without credentials, the search tools return "not configured" errors; all other tools work normally.

## How it works

- MCP handlers are attached via `@oaknational/mcp-server-kit` `attachMcpHandlers`, using a registry of tools generated in the SDK.
- Request validation uses Zod schemas derived at compile-time from the OpenAPI spec; invalid inputs return a formatted error body (200 status, `isError: true`).
- Successful results are SSE-wrapped JSON-RPC responses formatted with `formatStandardContent`.

## Widget Cache-Busting

The Oak JSON viewer widget uses a **hash-based URI strategy** to ensure ChatGPT always loads the latest widget version. This approach eliminates URI mismatches and aligns with OpenAI's best practice: "give the template a new URI" when widget content changes.

### How It Works

Widget cache-busting happens at **type-generation time** (not runtime):

1. During `pnpm type-gen`, a SHA-256 hash is generated from the current timestamp
2. The hash is embedded in the widget filename: `ui://widget/oak-json-viewer-<hash>.html`
3. All generated tool descriptors reference this hashed URI in `_meta['openai/outputTemplate']`
4. The widget resource is registered at the same hashed URI
5. ChatGPT sees a new URI → fetches fresh widget content (no stale cache)

**Example URIs:**

- Generated URI: `ui://widget/oak-json-viewer-aa744679.html`
- Next build: `ui://widget/oak-json-viewer-b3c9d412.html`

### Why This Approach

**Previous approach (query parameters):**

- Tool descriptors: `ui://widget/oak-json-viewer.html`
- Runtime registration: `ui://widget/oak-json-viewer.html?v=abc12345`
- **Problem**: URI mismatch caused ChatGPT to fail loading widgets (MCP error `-32602: Resource not found`)

**Current approach (hashed filename):**

- Tool descriptors: `ui://widget/oak-json-viewer-abc12345.html`
- Runtime registration: `ui://widget/oak-json-viewer-abc12345.html`
- **Result**: URIs match perfectly, no runtime logic needed

### Benefits

- ✅ **Eliminates URI mismatch**: Tools and resource use identical URI
- ✅ **Simpler architecture**: No runtime cache-busting logic
- ✅ **Aligns with OpenAI guidance**: New URI for new widget versions
- ✅ **Works identically** in local dev and production
- ✅ **Schema-first compliant**: No runtime modification of generated artifacts

### Trade-offs

- Every `pnpm type-gen` produces a new widget URI (even if widget content unchanged)
- This is an acceptable simplicity trade-off; ChatGPT handles URI changes gracefully

### Implementation Details

**Hash generation** (`type-gen/typegen/cross-domain-constants.ts`):

```typescript
function generateWidgetUriHash(): string {
  const timestamp = Date.now().toString();
  const hash = createHash('sha256').update(timestamp).digest('hex');
  return hash.slice(0, 8); // First 8 chars
}

export const BASE_WIDGET_URI = `ui://widget/oak-json-viewer-${generateWidgetUriHash()}.html`;
```

**Runtime usage** (zero transformation):

```typescript
export function getToolWidgetUri(): string {
  return WIDGET_URI; // Direct passthrough from SDK
}
```

### Related Documentation

- [ADR-071: Widget URI Cache-Busting Simplification](../../docs/architecture/architectural-decisions/071-widget-uri-cache-busting-simplification.md)
- [OpenAI Apps SDK: Build MCP Server](https://developers.openai.com/apps-sdk/build/mcp-server)

## Widget Call-to-Action (CTA) System

The Oak widget includes a reusable CTA system for adding buttons that send follow-up messages to the model. This enables users to trigger workflows without manually typing prompts.

### Overview

When the widget renders in ChatGPT, CTA buttons appear in the header (right side). Clicking a button sends a pre-configured prompt to the model using the OpenAI Apps SDK's `window.openai.sendFollowUpMessage()` API.

**Current CTAs:**

| Button             | Purpose                                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------------------------- |
| 🌳 Learn About Oak | Prompts the model to call `get-ontology`, `get-knowledge-graph`, and `get-help` to build curriculum context |

### Adding a New CTA

CTAs are defined in `src/widget-cta.ts`. To add a new CTA:

1. **Add an entry to `CTA_REGISTRY`:**

```typescript
export const CTA_REGISTRY = {
  learnOak: { ... },

  // New CTA
  startLessonPlanning: {
    id: 'start-lesson-planning',
    label: 'Plan a Lesson',
    loadingLabel: 'Starting...',
    icon: '📝',
    prompt: 'Help me plan a lesson. First ask about the subject and key stage.',
  },
} as const satisfies Record<string, CtaConfig>;
```

2. **Rebuild the widget:**

```bash
pnpm build
```

3. **Test in ChatGPT** - The new button automatically appears

### CTA Configuration

Each CTA requires:

| Field          | Type      | Description                                              |
| -------------- | --------- | -------------------------------------------------------- |
| `id`           | `string`  | Unique identifier (kebab-case), used for DOM element IDs |
| `label`        | `string`  | Button text (2-4 words, action verb)                     |
| `loadingLabel` | `string`  | Text shown while sending (1-2 words + ellipsis)          |
| `icon`         | `string?` | Optional emoji prefix                                    |
| `prompt`       | `string`  | Follow-up message sent to the model                      |

### Architecture

The CTA system uses a **registry + generator** pattern:

```text
src/widget-cta.ts
├── CTA_REGISTRY           → Single source of truth for all CTAs
├── generateCtaButtonHtml()     → Pure function: config → button HTML
├── generateCtaContainerHtml()  → Pure function: all CTAs → container HTML
└── generateCtaHandlerJs()      → Pure function: all CTAs → JavaScript handlers
```

Integration points:

- `aggregated-tool-widget.ts` - Embeds `generateCtaContainerHtml()` in header
- `widget-script-state.ts` - Embeds `generateCtaHandlerJs()` output
- `widget-styles.ts` - Contains `.cta-container` and `.cta-btn` styles

### UX Behavior

1. **Feature detection**: CTAs only appear when `sendFollowUpMessage` is available
2. **Loading state**: Button shows "🌳 Loading..." while sending
3. **Hide on success**: All CTAs hide after any button is clicked
4. **Error recovery**: Button re-enables on error for retry

### Related Documentation

- [OpenAI Apps SDK - Build UI](https://developers.openai.com/apps-sdk/build/chatgpt-ui)
- [ADR-061: Widget Call-to-Action System](../../docs/architecture/architectural-decisions/061-widget-cta-system.md)
- [ADR-060: Agent Support Tool Metadata System](../../docs/architecture/architectural-decisions/060-agent-support-metadata-system.md)

## Testing

This application has comprehensive test coverage across three testing layers:

### Unit Tests (53 tests)

- **Header Redaction** (`src/logging/header-redaction.unit.test.ts`): 53 tests covering:
  - Full redaction of sensitive headers (Authorization, Cookie, API keys, tokens)
  - Partial redaction of IP addresses (CF-Connecting-IP, X-Forwarded-For, etc.)
  - Preservation of non-sensitive headers
  - Edge cases (undefined values, arrays, IPv6, case insensitivity)
  - Both `redactHeaders()` and `redactHeadersSummary()` functions

### Integration Tests (20 tests)

- **Correlation Middleware** (`src/correlation/middleware.integration.test.ts`): 20 tests including:
  - 10 new tests for header redaction in request/response logging
  - Verification that sensitive headers are redacted in correlation middleware logs
  - Testing mixed sensitive/non-sensitive header handling

### End-to-End Tests (63 tests)

- **Header Redaction E2E** (`e2e-tests/header-redaction.e2e.test.ts`): 6 tests covering:
  - Full request/response cycles with sensitive headers
  - IP header handling
  - Simulated Clerk OAuth scenarios
  - Production-like header sets
  - Auth failure responses with WWW-Authenticate

**Total Test Count**: 200+ tests (137 unit/integration + 63 E2E)

### Running Tests

```bash
# Run all unit and integration tests
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test

# Run E2E tests
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e

# Run all tests
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:all
```

## Historical Context: OAuth Metadata Workarounds

### Problem Discovery (2025-01)

During deployment to Vercel, we encountered intermittent 401 responses on public OAuth metadata endpoints (`/.well-known/oauth-protected-resource`, `/.well-known/oauth-authorization-server`) that should always be publicly accessible per RFC 9470. These 401s were being cached by Vercel's CDN, blocking proper OAuth discovery and preventing clients from authenticating.

### Root Cause

The issue had two components:

1. **Middleware Registration Order**: OAuth metadata endpoints were registered AFTER `clerkMiddleware()` in the middleware chain. This caused Clerk's authentication middleware to intercept requests to these public endpoints, resulting in 401 responses in development environments where Clerk expected authentication.

2. **Vercel CDN Caching**: Vercel was caching the 401 error responses, and cached error responses don't appear in Vercel's downloadable logs. This made diagnosis extremely difficult as we could see 401s in the UI but not in log files.

### Attempted Workarounds (Removed 2025-01-15)

We implemented several workarounds that masked the root cause:

1. **Duplicate `/mcp` Route** (`clerk-workaround.ts`): We served OAuth metadata at both the canonical path (`/.well-known/oauth-protected-resource`) and a suffixed path (`/.well-known/oauth-protected-resource/mcp`) due to a bug in `@clerk/mcp-tools@0.3.1` where `getPRMUrl()` incorrectly appended `req.originalUrl` to metadata URLs.

2. **WWW-Authenticate Header Interception**: We intercepted 401 responses to fix malformed `WWW-Authenticate` headers generated by the Clerk bug, replacing the broken `/mcp` suffix URLs with correct paths.

3. **Comprehensive Integration Tests**: We wrote tests specifically to verify these workarounds were functioning, including `clerk-bug-reproduction.integration.test.ts` and `clerk-workaround-effectiveness.integration.test.ts`.

These workarounds were hiding the real issue: the metadata endpoints were being protected by authentication middleware when they should have been publicly accessible.

### Solution (Implemented 2025-01-15)

We removed all workarounds and fixed the root cause:

1. **Middleware Re-ordering**: Moved OAuth metadata endpoint registration to Phase 2.5 (BEFORE `clerkMiddleware` in Phase 3). This ensures these endpoints are never subject to authentication checks, making them truly public per RFC 9470.

2. **Error Response No-Cache Headers**: Added Phase 2.6 middleware that intercepts error responses (status codes >= 400) and adds strict no-cache headers. This prevents Vercel from caching error responses and enables proper logging and diagnosis.

3. **Removed Workaround Code**:
   - Deleted `clerk-workaround.ts` and its middleware
   - Removed duplicate `/mcp` route from `auth-routes.ts`
   - Deleted workaround-specific tests
   - Cleaned up related documentation references

### Key Lessons

1. **Caching Breaks Diagnosis**: CDN caching of error responses made the problem nearly impossible to diagnose. The fix (no-cache headers on all errors) prevents this class of issue.

2. **Workarounds Hide Root Causes**: By serving metadata at both correct and incorrect paths, we masked the real issue (middleware order) and prevented proper OAuth client behavior.

3. **Middleware Order Matters**: Express middleware order is critical for public endpoints. Public OAuth discovery endpoints MUST be registered before any authentication middleware to ensure they remain publicly accessible.

4. **Test What You Ship**: Our comprehensive workaround tests were testing the wrong behavior. After removing workarounds, we added a skip annotation to one test that relied on the Clerk bug to explain why it no longer works.

### Bringing Auth Code In-House (Implemented 2025-01-15)

After removing the workarounds, we discovered a persistent bug in `@clerk/mcp-tools@0.3.1` where `getPRMUrl()` incorrectly appends `req.originalUrl` to the OAuth metadata path, generating URLs like `/.well-known/oauth-protected-resource/mcp` instead of `/.well-known/oauth-protected-resource`.

Rather than wait for an upstream fix, we brought the essential authentication code in-house:

**Implementation** (`src/auth/mcp-auth/`):

1. **`types.ts`**: Type definitions including Express `Request` augmentation via declaration merging
2. **`get-prm-url.ts`**: Fixed implementation of OAuth metadata URL generation (without the `/mcp` suffix bug)
3. **`verify-clerk-token.ts`**: Pure function to convert Clerk's `MachineAuthObject` to MCP SDK's `AuthInfo` structure
4. **`mcp-auth.ts`**: Generic MCP authentication middleware using the fixed `getPRMUrl`
5. **`mcp-auth-clerk.ts`**: Clerk-specific integration wrapping the generic middleware
6. **`index.ts`**: Clean public API boundary exporting only `mcpAuthClerk`

**Development Process**:

- Followed strict TDD (Test-Driven Development) with red-green-refactor cycles
- Implemented as pure functions with comprehensive unit tests (13 test cases)
- Used type-guards and library types instead of type assertions
- Maintained type information flow without broadening types
- All type manipulation contained to `types.ts` for easy iteration

**Result**:

- All tests pass (162 passed, 2 skipped)
- Zero type assertions or workarounds
- Complete control over authentication behavior
- No dependency on external bug fixes

### References

- RFC 9470: OAuth 2.0 Protected Resource Metadata - <https://www.rfc-editor.org/rfc/rfc9470.html>
- RFC 8414: OAuth 2.0 Authorization Server Metadata - <https://www.rfc-editor.org/rfc/rfc8414.html>
- Clerk Bug: `@clerk/mcp-tools@0.3.1` `getPRMUrl()` incorrectly appends `req.originalUrl`

---

**Documentation Status**: Last verified 2025-01-15 against `src/application.ts`, `src/auth-routes.ts`, and deployed infrastructure.

**Related Documentation**:

- [deployment-architecture.md](./docs/deployment-architecture.md) - Deployment patterns and architecture
- [middleware-chain.md](./docs/middleware-chain.md) - Complete middleware execution order
- [vercel-environment-config.md](./docs/vercel-environment-config.md) - Environment variable reference
