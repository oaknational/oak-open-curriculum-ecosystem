# Test Review Findings - Task 1.1

## Tests Reviewed

### KEEP (Behavior-focused tests)

- ✅ `unified-logger.unit.test.ts` - Tests behavior via injected mock sinks
- ✅ `otel-format.unit.test.ts` - Tests pure formatting functions
- ✅ `resource-attributes.unit.test.ts` - Tests pure functions
- ✅ `context-merging.unit.test.ts` - Tests pure function
- ✅ `file-sink.unit.test.ts` - Tests behavior via injected mock filesystem
- ✅ `log-level-conversion.unit.test.ts` - Tests pure function
- ✅ `timing.unit.test.ts` - Tests pure function
- ✅ `error-context.unit.test.ts` - Tests pure function
- ✅ `json-sanitisation.unit.test.ts` - Tests pure function
- ✅ `log-levels.unit.test.ts` - Tests pure function
- ✅ `error-normalisation.unit.test.ts` - Tests pure function
- ✅ `express-middleware.integration.test.ts` - Tests Express middleware integration

### UPDATE (References deprecated code)

- ⚠️ `entrypoints.integration.test.ts` - References `createAdaptiveLogger` which will be deleted

### Summary

All existing unit tests are behavior-focused and use proper dependency injection. No tests need to be deleted for testing implementation details.

## Missing Behavior Test Coverage

### 1. DI Wiring Integration Tests

**Missing File**: `packages/libs/logger/src/logger-di.integration.test.ts`

**Missing Behaviors**:

- HTTP context: Logger with stdout sink only
- Stdio context: Logger with file sink only (never stdout)
- Dual sink: Logger writing to both stdout and file
- Child logger inheritance of sinks
- Child logger context merging
- Correlation ID propagation in child loggers
- Severity filtering across sinks
- Resource attributes in all output

### 2. E2E Server Logging Tests

**Missing Files**:

- `apps/oak-curriculum-mcp-streamable-http/e2e-tests/logging.e2e.test.ts`
- `apps/oak-curriculum-mcp-stdio/e2e-tests/logging.e2e.test.ts`

**Missing Behaviors**:

- HTTP server logs to stdout in OTel format
- HTTP server includes correlation IDs
- Stdio server logs to file only (stdout clean)
- Stdio server file contains OTel JSON
- Log level filtering works in real servers
- Resource attributes identify services correctly

### 3. Node.js Sink Factory Tests

**Missing File**: `packages/libs/logger/src/node-sinks.unit.test.ts`

**Missing Behaviors**:

- `createNodeStdoutSink()` writes to process.stdout
- `createNodeFileSink()` writes via injected filesystem
- File sink creates directories
- File sink handles append/overwrite modes

### 4. Pure Function Edge Cases (may have partial coverage)

**To verify coverage for**:

- `formatOtelLogRecord()` - All OTel required fields present
- `parseLogLevel()` - Invalid input handling
- `buildResourceAttributes()` - Environment variable extraction
- `mergeLogContext()` - Deep nesting, arrays, null handling
- `sanitiseForJson()` - Circular references, special values
- `enrichError()` - Error mutation behavior

## Actions Required

1. Create `logger-di.integration.test.ts` with 7 key integration scenarios
2. Create E2E test files for HTTP and stdio servers
3. Create `node-sinks.unit.test.ts` for Node.js-specific sink factories
4. Verify/augment pure function test coverage
5. Update `entrypoints.integration.test.ts` to remove `createAdaptiveLogger` references

## Test Count Impact

- Current: 175 tests in logger package
- Expected after additions: ~200-220 tests in logger package
- Expected after E2E additions: +10-15 E2E tests across servers
