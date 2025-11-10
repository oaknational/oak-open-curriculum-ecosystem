# E2E Test Requirements (Task 1.4)

## Status

Deferred to post-implementation phase. Unit and integration tests provide sufficient coverage for TDD implementation.

## Required E2E Tests

### HTTP Server E2E Tests

**File**: `apps/oak-curriculum-mcp-streamable-http/e2e-tests/logging.e2e.test.ts`

**Behaviors to Prove**:

1. HTTP server logs requests to stdout in OTel JSON format
2. Correlation IDs present in all request logs
3. Log level filtering works correctly
4. Resource attributes identify the HTTP server
5. Error logs include stack traces and context
6. Timing information present in logs

**Test Pattern**:

```typescript
describe('HTTP Server Logging E2E', () => {
  let server: Server;
  let stdoutCapture: string[] = [];

  beforeEach(async () => {
    // Capture stdout without mutating global
    const originalWrite = process.stdout.write;
    process.stdout.write = ((chunk: string) => {
      stdoutCapture.push(chunk);
      return originalWrite.call(process.stdout, chunk);
    }) as any;

    server = await startTestServer();
  });

  afterEach(async () => {
    await stopTestServer(server);
    // Restore stdout
  });

  it('logs requests to stdout with correlation IDs', async () => {
    const response = await fetch(`http://localhost:${TEST_PORT}/health`);
    expect(response.ok).toBe(true);

    const logLines = stdoutCapture.filter((line) => line.startsWith('{'));
    expect(logLines.length).toBeGreaterThan(0);

    const parsed = JSON.parse(logLines[0]);
    expect(parsed).toHaveProperty('Timestamp');
    expect(parsed.Resource).toHaveProperty('service.name', 'streamable-http');
    expect(parsed.Attributes).toHaveProperty('correlationId');
  });
});
```

### Stdio Server E2E Tests

**File**: `apps/oak-curriculum-mcp-stdio/e2e-tests/logging.e2e.test.ts`

**Behaviors to Prove**:

1. Stdio server writes logs to file only (stdout clean for MCP protocol)
2. Log file contains OTel formatted JSON
3. Log level filtering works correctly
4. Resource attributes identify the stdio server
5. Tool calls include correlation IDs in logs
6. File sink creates directories if missing

**Test Pattern**:

```typescript
describe('Stdio Server Logging E2E', () => {
  const testLogFile = '/tmp/stdio-e2e-test.log';
  let stdoutCapture: string[] = [];

  beforeEach(async () => {
    // Clean up previous test artifacts
    if (fs.existsSync(testLogFile)) {
      fs.unlinkSync(testLogFile);
    }

    // Capture stdout to verify it's clean
    stdoutCapture = [];
    const originalWrite = process.stdout.write;
    process.stdout.write = ((chunk: string) => {
      stdoutCapture.push(chunk);
      return originalWrite.call(process.stdout, chunk);
    }) as any;
  });

  it('logs to file only, never stdout', async () => {
    // Start server with test log file
    const server = await startStdioServer({ logFile: testLogFile });

    // Execute some MCP operations
    await executeTool(server, 'some-tool', {});

    // Verify stdout contains only MCP protocol frames (no logs)
    const stdoutLines = stdoutCapture.filter((line) => line.trim());
    stdoutLines.forEach((line) => {
      const parsed = JSON.parse(line);
      // MCP protocol frames have jsonrpc field
      expect(parsed).toHaveProperty('jsonrpc', '2.0');
    });

    // Verify file contains OTel logs
    const logContent = fs.readFileSync(testLogFile, 'utf-8');
    const logLines = logContent.split('\n').filter((l) => l.trim());

    expect(logLines.length).toBeGreaterThan(0);
    const firstLog = JSON.parse(logLines[0]);
    expect(firstLog).toHaveProperty('Timestamp');
    expect(firstLog.Resource).toHaveProperty('service.name', 'stdio-mcp');
  });
});
```

## Implementation Priority

1. **Phase 1 (Current)**: Unit + Integration tests ✅
2. **Phase 2**: TDD implementation using existing tests
3. **Phase 3**: E2E tests to verify real server behavior
4. **Phase 4**: Smoke tests in CI/CD

## Notes

- E2E tests require actual server processes
- Must clean up resources (files, processes) after each test
- Should not run automatically in CI without environment setup
- Provides final validation that everything works end-to-end
