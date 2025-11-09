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

- [HTTP Server README](../../apps/oak-curriculum-mcp-streamable-http/README.md) - HTTP-specific instrumentation details
- [Stdio Server README](../../apps/oak-curriculum-mcp-stdio/README.md) - Stdio-specific instrumentation details
- [Logger Package README](../../packages/libs/logger/README.md) - Logger API documentation
- [Testing Strategy](../agent-guidance/testing-strategy.md) - Testing logging code
