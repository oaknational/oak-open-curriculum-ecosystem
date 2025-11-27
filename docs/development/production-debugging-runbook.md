# Production Debugging Runbook

This runbook provides step-by-step debugging workflows for the Oak MCP Ecosystem using Phase 2 observability features (correlation IDs, timing metrics, error enrichment).

**Last Updated**: 2025-11-08  
**Applies To**: HTTP Server (Vercel), Stdio Server (local/Claude Desktop)

## Overview of Observability Features

The Oak MCP servers include comprehensive instrumentation for production debugging:

### Correlation IDs

- **Format**: `req_{timestamp}_{6-char-hex}` (e.g., `req_1699123456789_a3f2c9`)
- **HTTP Server**: Included in `X-Correlation-ID` response header, logs to stdout (Vercel)
- **Stdio Server**: Generated per tool invocation, logs to `.logs/oak-curriculum-mcp/server.log`
- **Purpose**: Trace requests across the system, correlate client reports with server logs

### Timing Metrics

- **Precision**: Sub-millisecond using `performance.now()`
- **Format**: Includes both formatted (`"1.23s"`) and precise (`1234.56ms`) values
- **Slow Request Warnings**:
  - HTTP: >2 seconds (WARN level, `slowRequest: true`)
  - Stdio: >5 seconds (WARN level, `slowOperation: true`)
- **Purpose**: Identify performance issues, timeout causes, bottlenecks

### Error Context Enrichment

- **Attached Context**: Correlation ID, timing, request/tool details
- **Non-enumerable**: Preserves error structure for JSON serialization
- **Purpose**: Full debugging context in error scenarios

### Log Formats

**HTTP Server (Vercel stdout):**

```json
{
  "level": "info",
  "message": "Request completed",
  "correlationId": "req_1699123456789_a3f2c9",
  "duration": "145ms",
  "durationMs": 145.23,
  "method": "POST",
  "path": "/mcp",
  "statusCode": 200
}
```

**Stdio Server (file logs):**

```json
{
  "level": "info",
  "message": "Tool execution started",
  "correlationId": "req_1699123456789_a3f2c9",
  "toolName": "searchLessons",
  "timestamp": "2024-11-06T12:00:00.000Z"
}
```

### Bootstrap Diagnostics

The HTTP server now logs explicit bootstrap phases so you can pinpoint where startup time is spent (or where it fails):

- `bootstrap.phase.start` / `bootstrap.phase.finish` wrap `setupBaseMiddleware`, `applySecurity`, `initializeCoreEndpoints`, and `setupAuthRoutes`
- `bootstrap.mcp.transport.connect.start` / `bootstrap.mcp.transport.connect.finish` measure the MCP transport handshake (`server.connect`)
- Logs include `appId`, human-readable duration, and raw `durationMs`

```bash
# Inspect the most recent bootstrap phases
jq 'select(.message == "bootstrap.phase.finish") | {appId, phase, duration, durationMs}' vercel-logs.txt | tail -8

# Confirm transport connection latency
jq 'select(.message == "bootstrap.mcp.transport.connect.finish") | {duration, durationMs}' vercel-logs.txt | tail -5
```

### Authentication Setup Diagnostics

Authentication wiring now emits dedicated instrumentation:

- `auth.bootstrap.step.start` / `auth.bootstrap.step.finish` for `clerkMiddleware.create`, `clerkMiddleware.install`, `oauth.metadata.register`, `mcp.auth.register`
- `auth.bootstrap.step.error` when any step throws (includes duration and error context)
- When `DANGEROUSLY_DISABLE_AUTH=true`, the unauthenticated path is recorded as `auth.disabled.register`

```bash
# Validate Clerk instrumentation completed
jq 'select(.message == "auth.bootstrap.step.finish" and .step == "clerkMiddleware.create")' vercel-logs.txt | tail -5

# Detect configuration failures
jq 'select(.message == "auth.bootstrap.step.error")' vercel-logs.txt
```

## Common Scenarios

### Scenario 1: Slow Request Investigation

**Situation**: Client reports a request taking over 5 seconds, or you notice increased latency in monitoring.

#### HTTP Server Debugging

**Step 1: Get Correlation ID**

Ask the client for the correlation ID from response headers:

```bash
curl -i https://your-server.com/mcp \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":"1"}'

# Response headers include:
# X-Correlation-ID: req_1699123456789_a3f2c9
```

Or find slow requests in logs:

```bash
# Vercel CLI (if available)
vercel logs --follow | grep '"slowRequest":true'

# Downloaded logs
grep '"slowRequest":true' vercel-logs.txt | tail -10
```

**Step 2: Filter Logs by Correlation ID**

```bash
# Get all logs for this request
grep 'req_1699123456789_a3f2c9' vercel-logs.txt | jq .

# Pretty-print the sequence
grep 'req_1699123456789_a3f2c9' vercel-logs.txt | jq -s '.'
```

**Step 3: Analyze Timing**

Expected log sequence:

```json
// Request started
{"level":"debug","message":"Request started","correlationId":"req_...","method":"POST","path":"/mcp"}

// Request completed (slow)
{"level":"warn","message":"Request completed","correlationId":"req_...","duration":"5.23s","durationMs":5230.45,"slowRequest":true}
```

**Step 4: Identify Bottleneck**

Check logs between start and complete:

- Look for SDK API calls
- Check for authentication/authorization delays
- Review any error recovery attempts
- Compare with average request times

```bash
# Average request duration
jq -s 'map(select(.message == "Request completed")) | map(.durationMs) | add/length' vercel-logs.txt
```

**Step 5: Take Action**

- **Consistently slow**: Optimize the operation (caching, query optimization)
- **Intermittent**: Check for API rate limiting, network issues, or downstream service problems
- **Specific endpoints**: Profile and optimize that specific handler
- **All requests slow**: Check server resources, consider scaling

#### Stdio Server Debugging

**Step 1: Find Slow Operations**

```bash
# Find all slow tool executions
grep '"slowOperation":true' .logs/oak-curriculum-mcp/server.log | tail -10

# Get correlation IDs
grep '"slowOperation":true' .logs/oak-curriculum-mcp/server.log | jq -r '.correlationId' | tail -5
```

**Step 2: Trace Full Execution**

```bash
# Get all logs for a specific execution
grep 'req_1699123456789_a3f2c9' .logs/oak-curriculum-mcp/server.log | jq .
```

**Step 3: Compare with Baseline**

```bash
# Average timing for this tool
grep '"toolName":"searchLessons"' .logs/oak-curriculum-mcp/server.log | \
  jq -s 'map(select(.durationMs)) | map(.durationMs) | add/length'

# Find slowest executions
grep '"toolName":"searchLessons"' .logs/oak-curriculum-mcp/server.log | \
  jq -s 'sort_by(.durationMs) | reverse | .[0:5]'
```

**Step 4: Take Action**

- Check API rate limits or throttling
- Review input parameters (complex queries, large result sets)
- Monitor network latency to Oak API
- Consider caching frequently accessed data

### Scenario 2: Error Investigation

**Situation**: Client reports a 500 error, or error rate is elevated in monitoring.

#### HTTP Server Debugging

**Step 1: Get Correlation ID from Client**

Client should provide:

- Response header: `X-Correlation-ID`
- Error response body: `correlationId` field

```json
{
  "error": "Internal Server Error",
  "message": "Failed to process request",
  "correlationId": "req_1699123456789_a3f2c9"
}
```

**Step 2: Search Logs**

```bash
# Find all logs for this request
grep 'req_1699123456789_a3f2c9' vercel-logs.txt | jq .
```

**Step 3: Review Error Context**

```json
{
  "level": "error",
  "message": "Request error",
  "context": {
    "message": "Database connection timeout",
    "stack": "Error: Database connection timeout\n    at ...",
    "correlationId": "req_1699123456789_a3f2c9",
    "duration": "5.23s",
    "durationMs": 5230.45,
    "method": "POST",
    "path": "/mcp",
    "statusCode": 500
  }
}
```

**Step 4: Analyze Error Pattern**

Check if this is an isolated incident or a pattern:

```bash
# Find all similar errors
jq 'select(.level == "error" and .context.message | contains("timeout"))' vercel-logs.txt

# Error frequency over time
jq 'select(.level == "error")' vercel-logs.txt | \
  jq -r '.timestamp[:13]' | sort | uniq -c | sort -rn
```

**Step 5: Take Action**

- **Connection timeout**: Check database/API health, increase timeout, add retry logic
- **Validation error**: Review input validation, update schemas
- **Authentication error**: Verify credentials, check token expiration
- **Upstream API error**: Check Oak API status, implement circuit breaker

#### Stdio Server Debugging

**Step 1: Find Recent Errors**

```bash
# Last 10 errors
grep '"level":"error"' .logs/oak-curriculum-mcp/server.log | tail -10 | jq .

# Errors for specific tool
grep '"level":"error"' .logs/oak-curriculum-mcp/server.log | \
  jq 'select(.context.toolName == "searchLessons")'
```

**Step 2: Trace Error Context**

```bash
# Get correlation ID from error, then trace
CORR_ID=$(grep '"level":"error"' .logs/oak-curriculum-mcp/server.log | tail -1 | jq -r '.correlationId')
grep "$CORR_ID" .logs/oak-curriculum-mcp/server.log | jq .
```

**Step 3: Review Error Payload**

Error logs include full context in payload:

```json
{
  "level": "error",
  "message": "Tool execution failed",
  "context": {
    "payload": "{\"toolName\":\"searchLessons\",\"toolInput\":{...},\"toolExecutionError\":{\"message\":\"API rate limit exceeded\"}}",
    "correlationId": "req_...",
    "duration": "2.34s",
    "toolName": "searchLessons"
  }
}
```

**Step 4: Take Action**

- **API error**: Check Oak API key validity, implement backoff/retry
- **Validation error**: Review tool input schema, fix client code
- **Network error**: Check connectivity, DNS resolution
- **Timeout**: Increase timeout threshold, optimize API queries

### Scenario 3: Intermittent Issues

**Situation**: Users report occasional problems, but not consistently reproducible.

#### Data Collection Phase

**HTTP Server:**

```bash
# Collect correlation IDs from affected users
# Compare with unaffected requests

# Find requests around the same time
jq 'select(.timestamp >= "2024-11-06T12:00:00Z" and .timestamp < "2024-11-06T12:05:00Z")' vercel-logs.txt

# Compare timing patterns
# Affected request
grep 'req_AFFECTED' vercel-logs.txt | jq '.durationMs'

# Normal request
grep 'req_NORMAL' vercel-logs.txt | jq '.durationMs'
```

**Stdio Server:**

```bash
# Compare successful vs failed executions
SUCCESS=$(grep "Tool execution completed success" .logs/oak-curriculum-mcp/server.log | \
  jq -s 'map(.durationMs) | add/length')
FAILED=$(grep "Tool execution failed" .logs/oak-curriculum-mcp/server.log | \
  jq -s 'map(.context.durationMs) | add/length')

echo "Average success: ${SUCCESS}ms"
echo "Average failure: ${FAILED}ms"
```

#### Pattern Analysis

**By Time of Day:**

```bash
# HTTP
jq 'select(.slowRequest == true)' vercel-logs.txt | \
  jq -r '.timestamp[:13]' | sort | uniq -c | sort -rn

# Stdio
grep '"slowOperation":true' .logs/oak-curriculum-mcp/server.log | \
  jq -r '.timestamp[:13]' | sort | uniq -c | sort -rn
```

**By Path/Tool:**

```bash
# HTTP - slow requests by path
jq 'select(.slowRequest == true)' vercel-logs.txt | \
  jq -s 'group_by(.path) | map({path: .[0].path, count: length})'

# Stdio - slow operations by tool
grep '"slowOperation":true' .logs/oak-curriculum-mcp/server.log | \
  jq -s 'group_by(.toolName) | map({tool: .[0].toolName, count: length})'
```

**By Error Type:**

```bash
# Group errors by message
jq 'select(.level == "error")' logs.txt | \
  jq -s 'group_by(.context.message) | map({error: .[0].context.message, count: length})'
```

#### Take Action Based on Patterns

- **Time-based**: Peak load issues → implement auto-scaling, caching
- **Path/tool-specific**: Performance issue in specific code → optimize that operation
- **Error pattern**: Upstream dependency issue → implement circuit breaker, fallbacks
- **Random**: External service issues → add monitoring, alerting

### Scenario 4: Client-Reported Issues

**Situation**: Support receives a user complaint with specific symptoms.

#### Information Gathering

**From Client/User:**

1. What action were they trying to perform?
2. When did it occur (timestamp)?
3. What error message did they see?
4. **Most important**: What was the correlation ID? (from response headers or error body)

#### Investigation Steps

**Step 1: Get Correlation ID**

If client can't provide correlation ID, search by approximate time and user context:

```bash
# HTTP - search by time window and user identifier (if logged)
jq 'select(.timestamp >= "2024-11-06T12:30:00Z" and .timestamp < "2024-11-06T12:35:00Z")' \
  vercel-logs.txt | jq 'select(.level == "error")'
```

**Step 2: Reconstruct Request Lifecycle**

```bash
# Get full request lifecycle
grep '<correlation-id>' logs.txt | jq -s 'sort_by(.timestamp)'
```

Expected sequence:

```json
[
  {
    "level": "debug",
    "message": "Request started",
    "correlationId": "...",
    "method": "POST",
    "path": "/mcp"
  },
  {
    "level": "info",
    "message": "Tool execution",
    "correlationId": "...",
    "toolName": "searchLessons"
  },
  { "level": "error", "message": "Tool execution failed", "correlationId": "..." },
  { "level": "error", "message": "Request error", "correlationId": "...", "duration": "2.34s" }
]
```

**Step 3: Extract Root Cause**

- Check first error in sequence
- Review timing (was it a timeout?)
- Examine request parameters
- Check for similar errors from other users

**Step 4: Provide Resolution**

Document findings:

```markdown
**Issue Summary**

- Correlation ID: req_1699123456789_a3f2c9
- Timestamp: 2024-11-06T12:34:56Z
- Root Cause: API rate limit exceeded
- Impact: Single user, single request

**Resolution**

- Implemented: Exponential backoff for API calls
- Monitoring: Added alert for rate limit errors
- Client Action: Retry the request
```

## Tools and Commands Reference

### Vercel CLI Log Filtering

```bash
# Follow logs in real-time
vercel logs --follow

# Filter by project
vercel logs --follow --project=oak-mcp-http

# Download logs for analysis
vercel logs --since=2024-11-06 > logs.txt

# Filter downloaded logs
grep '"level":"error"' logs.txt | jq .
grep '"correlationId":"req_123"' logs.txt | jq .
```

### grep Patterns for Stdio Logs

```bash
# Basic filtering
grep '"level":"error"' .logs/oak-curriculum-mcp/server.log
grep '"slowOperation":true' .logs/oak-curriculum-mcp/server.log
grep '<correlation-id>' .logs/oak-curriculum-mcp/server.log

# With context (lines before/after)
grep -C 5 '"level":"error"' .logs/oak-curriculum-mcp/server.log

# Count occurrences
grep '"level":"error"' .logs/oak-curriculum-mcp/server.log | wc -l

# Unique correlation IDs
grep -o '"correlationId":"req_[^"]*"' .logs/oak-curriculum-mcp/server.log | \
  sort -u | wc -l
```

### jq Patterns for Structured JSON Logs

```bash
# Pretty-print
cat logs.txt | jq .

# Select by field
jq 'select(.level == "error")' logs.txt
jq 'select(.durationMs > 2000)' logs.txt
jq 'select(.correlationId == "req_123")' logs.txt

# Extract specific fields
jq '{level, message, correlationId, duration}' logs.txt

# Group and count
jq -s 'group_by(.level) | map({level: .[0].level, count: length})' logs.txt

# Calculate statistics
jq -s 'map(.durationMs) | {avg: (add/length), min: min, max: max}' logs.txt

# Time range filtering
jq 'select(.timestamp >= "2024-11-06T00:00:00Z" and .timestamp < "2024-11-07T00:00:00Z")' logs.txt

# Sort by field
jq -s 'sort_by(.durationMs) | reverse | .[0:10]' logs.txt
```

### Combining Tools

```bash
# Find slow requests, then get their correlation IDs
grep '"slowRequest":true' logs.txt | jq -r '.correlationId' | \
  while read id; do
    echo "=== $id ==="
    grep "$id" logs.txt | jq .
  done

# Count errors per hour
grep '"level":"error"' logs.txt | \
  jq -r '.timestamp[:13]' | sort | uniq -c

# Find correlation IDs with multiple errors
grep '"level":"error"' logs.txt | \
  jq -r '.correlationId' | sort | uniq -c | sort -rn
```

## Setting Up Alerts

### Vercel Log Drains

Set up log drains to send logs to monitoring platforms:

1. Go to Project Settings → Integrations
2. Add integration for your monitoring service (Datadog, LogDNA, etc.)
3. Configure alerts based on log patterns:
   - `level == "error"` count exceeds threshold
   - `slowRequest == true` frequency increases
   - Specific error messages appear

### Custom Monitoring Scripts

**Monitor log file growth (Stdio):**

```bash
#!/bin/bash
# monitor-logs.sh

LOG_FILE=".logs/oak-curriculum-mcp/server.log"
THRESHOLD_MB=100

while true; do
  SIZE=$(du -m "$LOG_FILE" | cut -f1)
  if [ $SIZE -gt $THRESHOLD_MB ]; then
    echo "WARNING: Log file exceeds ${THRESHOLD_MB}MB (current: ${SIZE}MB)"
    # Send alert (email, Slack, etc.)
  fi
  sleep 300  # Check every 5 minutes
done
```

**Monitor error rate:**

```bash
#!/bin/bash
# monitor-errors.sh

LOG_FILE=".logs/oak-curriculum-mcp/server.log"
THRESHOLD=10  # errors per minute

while true; do
  RECENT_ERRORS=$(grep '"level":"error"' "$LOG_FILE" | \
    jq 'select(.timestamp >= (now - 60 | strftime("%Y-%m-%dT%H:%M:%SZ")))' | \
    wc -l)

  if [ $RECENT_ERRORS -gt $THRESHOLD ]; then
    echo "WARNING: High error rate detected ($RECENT_ERRORS errors in last minute)"
    # Send alert
  fi

  sleep 60
done
```

## Best Practices

### For Operations Teams

1. **Always get correlation IDs** from clients when they report issues
2. **Include correlation IDs** in response to support tickets
3. **Set up log drains** early to avoid losing Vercel's 1-hour log retention
4. **Monitor key metrics**:
   - Error rate by endpoint/tool
   - P95/P99 latency
   - Slow request frequency
5. **Regular log analysis**: Review patterns weekly to identify trends

### For Development Teams

1. **Include correlation ID** in all client error messages
2. **Log liberally** at DEBUG level during development
3. **Use INFO level** for production to reduce log volume
4. **Test with correlation IDs**: Verify they propagate correctly
5. **Document error codes**: Map error messages to known issues

### For Support Teams

1. **First question**: "What's the correlation ID from the error?"
2. **Second question**: "What time did this occur?"
3. **Escalation template**: Always include correlation ID and timestamp
4. **Knowledge base**: Link common errors to correlation ID patterns
5. **Track trends**: Are multiple users seeing the same correlation pattern?

## Troubleshooting the Troubleshooting

### Can't Find Correlation ID in Logs

**Possible causes:**

- Log retention expired (Vercel: 1 hour on hobby/pro)
- Wrong environment (staging vs production)
- Incorrect time zone conversion
- Correlation middleware not installed

**Solutions:**

- Set up log drains immediately
- Check correct Vercel project
- Convert client timestamp to UTC
- Verify middleware in app startup

### Logs Don't Have Enough Detail

**Possible causes:**

- Log level too high (WARN/ERROR only)
- Debug logs filtered out in production
- Sensitive data redaction too aggressive

**Solutions:**

- Temporarily set `LOG_LEVEL=INFO` for more detail
- Use `LOG_LEVEL=DEBUG` in staging for investigation
- Review redaction rules

### Cannot Correlate Client Report with Logs

**Possible causes:**

- Client didn't capture correlation ID
- Logs from different server instance
- Clock skew between client and server

**Solutions:**

- Educate clients on capturing correlation IDs
- Search wider time window (±5 minutes)
- Search by approximate request parameters

## Further Reading

## Local Production Build Testing

The built-server harness allows you to test the production build locally before deploying to Vercel, helping diagnose deployment issues and validate instrumentation in a production-like environment.

### When to Use the Harness

Use the built-server harness when:

- **Pre-deployment validation**: Test production build before pushing to Vercel
- **Deployment hang diagnosis**: Reproduce and diagnose server startup issues
- **Configuration testing**: Validate different auth scenarios (enabled, disabled, misconfigured)
- **Instrumentation verification**: Confirm Phase 1 bootstrap logs work in production build
- **Performance baseline**: Measure bootstrap timing before deploying

**Don't use the harness for:**

- Active development (use `pnpm dev` instead - faster with hot reload)
- Load testing (harness is single-instance, not representative of Vercel scaling)
- Integration testing (e2e tests are better for this)

### Quick Start

```bash
# Navigate to HTTP server directory
cd apps/oak-curriculum-mcp-streamable-http

# Build production bundle
pnpm build

# Set up environment (first time only)
cp config/harness-auth-disabled.env .env.harness.auth-disabled

# Run harness
ENV_FILE=.env.harness.auth-disabled pnpm prod:harness

# In separate terminal, test with automated requests
pnpm prod:requests
```

### Comparing Dev Server vs Built Harness

| Aspect      | Dev Server (`pnpm dev`)       | Built Harness (`pnpm prod:harness`) |
| ----------- | ----------------------------- | ----------------------------------- |
| Purpose     | Active development            | Pre-deployment validation           |
| Build       | TypeScript via tsx (no build) | Production bundle (dist/)           |
| Speed       | Fast (hot reload)             | Slower (requires build)             |
| Environment | Development                   | Production-like                     |
| Auth        | Usually disabled              | Configurable scenarios              |
| Logs        | Debug level, verbose          | Production format (JSON)            |
| Use case    | Feature development           | Deployment diagnosis                |

### Available Configuration Scenarios

The harness supports three pre-configured test scenarios:

**1. Auth Disabled** (Recommended for initial testing)

- Verifies core functionality without Clerk dependencies
- File: `config/harness-auth-disabled.env`
- Use case: Test MCP handlers, instrumentation, basic routes

**2. Auth Enabled with Clerk**

- Tests full OAuth flow with Clerk
- File: `config/harness-auth-enabled.env` (requires real Clerk test keys)
- Use case: Validate authentication middleware, token handling

**3. Missing Clerk Configuration**

- Reproduces error conditions when Clerk is misconfigured
- File: `config/harness-missing-clerk.env`
- Use case: Diagnose deployment hangs, validate error handling

### Interpreting Harness Logs

The harness emits structured JSON logs. Key patterns to look for:

**Successful startup:**

```bash
# Harness starts and loads environment
{"level":"INFO","message":"Server harness starting"}
{"level":"INFO","message":"Environment loaded successfully"}

# Bootstrap phases complete (from Phase 1 instrumentation)
{"level":"INFO","message":"bootstrap.phase.finish","phase":"setupBaseMiddleware","durationMs":12.34}
{"level":"INFO","message":"bootstrap.phase.finish","phase":"applySecurity","durationMs":5.67}

# Server ready
{"level":"INFO","message":"Server listening","port":3001}
{"level":"INFO","message":"Harness ready for requests"}
```

**Hang during startup:**

```bash
# Last bootstrap phase logged
{"level":"DEBUG","message":"bootstrap.phase.start","phase":"setupAuthRoutes"}

# No corresponding finish log - indicates hang in auth setup
# Check for auth.bootstrap.step logs to identify exact step
```

**Auth configuration error:**

```bash
{"level":"ERROR","message":"auth.bootstrap.step.error","step":"clerkMiddleware.create"}
# Check error details and verify Clerk keys in environment
```

### Common Scenarios and Solutions

#### Scenario 1: Diagnosing Vercel Deployment Hang

**Symptoms:**

- Vercel deployment starts but never becomes ready
- Health check timeouts
- No requests processed

**Diagnosis workflow:**

```bash
# Step 1: Build locally
pnpm build

# Step 2: Run harness with same config as Vercel
cp config/harness-missing-clerk.env .env.harness.missing-clerk
ENV_FILE=.env.harness.missing-clerk pnpm prod:harness 2>&1 | tee harness-hang.log

# Step 3: Monitor bootstrap phases
# In another terminal:
tail -f harness-hang.log | grep bootstrap

# Step 4: Identify which phase hangs
# If hang occurs, find last logged phase
grep 'bootstrap.phase.start' harness-hang.log | tail -1
```

**Expected findings:**

If the harness reproduces the hang:

- Identify last completed bootstrap phase
- Check auth.bootstrap.step logs for auth initialization issues
- Verify Clerk keys are valid (or intentionally missing to test error handling)

**Resolution:**

- Missing Clerk keys: Add keys to Vercel environment variables
- Invalid keys: Verify keys match environment (test vs production)
- Auth middleware hang: Check Clerk service status, network connectivity

#### Scenario 2: Validating Instrumentation Before Deploy

**Goal:** Confirm Phase 1 instrumentation logs work correctly in production build.

**Workflow:**

```bash
# Build and run with debug logging
pnpm build
ENV_FILE=.env.harness.auth-disabled pnpm prod:harness 2>&1 | tee validation.log

# Verify bootstrap phases logged
grep 'bootstrap.phase.finish' validation.log | jq '{phase: .phase, duration: .duration}'

# Verify auth setup logged
grep 'auth.bootstrap.step' validation.log | jq '{step: .step, duration: .duration}'

# Check for errors
grep '"level":"ERROR"' validation.log
```

**Expected output:**

```json
{"phase":"setupBaseMiddleware","duration":"12.34ms"}
{"phase":"applySecurity","duration":"5.67ms"}
{"phase":"initializeCoreEndpoints","duration":"8.90ms"}
{"phase":"setupAuthRoutes","duration":"45.67ms"}
{"step":"auth.disabled.register","duration":"2.34ms"}
```

**If instrumentation is working:** You're ready to deploy to Vercel with confidence that logs will be visible.

#### Scenario 3: Testing Configuration Changes

**Goal:** Validate environment variable changes before deploying.

**Workflow:**

```bash
# Create custom environment file
cp config/harness-auth-disabled.env .env.harness.custom

# Edit with your changes
vim .env.harness.custom
# Example: Change LOG_LEVEL=info, add new FEATURE_FLAG=true

# Test with custom config
ENV_FILE=.env.harness.custom pnpm prod:harness

# Run automated tests
pnpm prod:requests
```

**Validation checklist:**

- [ ] Server starts successfully
- [ ] All requests return expected status codes
- [ ] Logs show correct configuration values
- [ ] No unexpected errors or warnings
- [ ] Bootstrap completes within acceptable time (<5s typically)

### Integration with Automated Request Testing

The request runner (`pnpm prod:requests`) sends a sequence of test requests:

**Usage:**

```bash
# Terminal 1: Start harness
ENV_FILE=.env.harness.auth-disabled pnpm prod:harness

# Terminal 2: Wait for "Harness ready" message, then run tests
pnpm prod:requests
```

**Expected output:**

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

Exit code: `0` = all tests passed, `1` = one or more tests failed

**Troubleshooting test failures:**

- **Health check fails**: Server not ready, check harness logs
- **Landing page fails**: Base middleware issue, check setupBaseMiddleware logs
- **MCP initialize fails**: Auth or handler issue, check auth.bootstrap and MCP handler logs

### Harness Limitations and Considerations

**What the harness simulates:**

- ✅ Production bundle execution
- ✅ Environment variable configuration
- ✅ Bootstrap sequence and timing
- ✅ Request handling logic
- ✅ Logging format and content

**What the harness does NOT simulate:**

- ❌ Vercel cold starts (harness stays warm)
- ❌ Vercel's network layer (CDN, edge network)
- ❌ Vercel's automatic scaling (harness is single-instance)
- ❌ Vercel's environment variable encryption
- ❌ Production traffic load

**Implications:**

- Bootstrap timing may differ (Vercel cold starts add ~100-500ms)
- Network latency to external APIs different (Vercel datacenter vs your location)
- Memory/CPU resources different (Vercel's function limits vs your machine)

**Best practice:** Use harness for functional validation and basic timing, but always validate in Vercel staging before production.

### Advanced Harness Usage

**Background execution with log capture:**

```bash
# Run harness in background, capture logs
ENV_FILE=.env.harness.auth-disabled pnpm prod:harness 2>&1 > harness.log &
HARNESS_PID=$!

# Run tests
pnpm prod:requests

# Stop harness gracefully
kill $HARNESS_PID

# Analyze logs
cat harness.log | jq 'select(.message | contains("bootstrap"))'
```

**Custom port to avoid conflicts:**

```bash
# Edit env file to use different port
cp config/harness-auth-disabled.env .env.harness.custom
echo "PORT=4000" >> .env.harness.custom

# Run harness on custom port
ENV_FILE=.env.harness.custom pnpm prod:harness

# Test on custom port
BASE_URL=http://localhost:4000 pnpm prod:requests
```

**Comparing multiple configurations:**

```bash
# Run tests for each scenario, capture results
for scenario in auth-disabled auth-enabled missing-clerk; do
  echo "Testing $scenario..."

  # Start harness
  ENV_FILE=.env.harness.$scenario pnpm prod:harness 2>&1 > harness-$scenario.log &
  PID=$!

  # Wait for ready
  sleep 5

  # Run tests
  pnpm prod:requests > requests-$scenario.log 2>&1
  EXIT_CODE=$?

  # Stop harness
  kill $PID

  # Report
  echo "Scenario $scenario: exit code $EXIT_CODE"
done
```

### Related Documentation

For detailed harness documentation, see the HTTP server README:

- Quick start guide: `apps/oak-curriculum-mcp-streamable-http/README.md#production-diagnostics`
- Configuration scenarios: Details on each test scenario
- Manual testing: curl examples for testing specific endpoints
- Troubleshooting: Common issues and solutions

For tracking diagnostic improvements, see:

- Implementation plan: `.agent/plans/mcp-streamable-http-runtime-diagnostics-plan.md`
- Phase 1 instrumentation: Bootstrap and auth timing (complete)
- Phase 2 harness: Built-server testing (complete)

## Further Reading

- [HTTP Server README](../../apps/oak-curriculum-mcp-streamable-http/README.md) - HTTP-specific instrumentation details
- [Stdio Server README](../../apps/oak-curriculum-mcp-stdio/README.md) - Stdio-specific instrumentation details
- [Logger Package README](../../packages/libs/logger/README.md) - Logger API documentation
- [Testing Strategy](../../.agent/directives-and-memory/testing-strategy.md) - Testing logging code
