import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { rmSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createConsoleLogger } from './logger.js';
import { LOG_LEVELS } from './logger-interface.js';

/**
 * Verify log content has expected messages and format
 */
function verifyLogContent(logContent: string): void {
  // Verify all messages are present with correct levels
  expect(logContent).toContain('[DEBUG] Debug test message');
  expect(logContent).toContain('"debugData": true');
  expect(logContent).toContain('[INFO] Info test message');
  expect(logContent).toContain('"infoData": 123');
  expect(logContent).toContain('[WARN] Warning test message');
  expect(logContent).toContain('"warnData": "test"');
  expect(logContent).toContain('[ERROR] Error test message');
  expect(logContent).toContain('"nested": "value"');

  // Verify ISO timestamps
  const lines = logContent.split('\n').filter((line) => line.trim());
  lines.forEach((line) => {
    if (line) {
      expect(line).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/);
    }
  });
}

describe('File Logger E2E', () => {
  const testLogDir = join(process.cwd(), '.logs', 'oak-notion-mcp-test');

  beforeEach(() => {
    // Clean up any existing test logs
    if (existsSync(testLogDir)) {
      rmSync(testLogDir, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    // Clean up test logs
    if (existsSync(testLogDir)) {
      rmSync(testLogDir, { recursive: true, force: true });
    }
  });

  it('should create log files and write all log levels', async () => {
    // Override process.cwd to use test directory
    const originalCwd = () => process.cwd();
    process.cwd = () => join(originalCwd(), '..', 'oak-notion-mcp-test');

    try {
      const logger = createConsoleLogger(LOG_LEVELS.DEBUG.value);

      // Log messages at different levels
      logger.debug('Debug test message', { debugData: true });
      logger.info('Info test message', { infoData: 123 });
      logger.warn('Warning test message', { warnData: 'test' });
      logger.error('Error test message', { errorData: { nested: 'value' } });

      // Find the created log file
      const files = await import('node:fs').then((fs) =>
        fs.readdirSync(join(process.cwd(), '.logs', 'oak-notion-mcp')),
      );
      const logFile = files.find((f) => f.endsWith('.log'));
      expect(logFile).toBeDefined();

      if (!logFile) {
        throw new Error('Log file not found');
      }

      // Read and verify log contents
      const logPath = join(process.cwd(), '.logs', 'oak-notion-mcp', logFile);
      const logContent = readFileSync(logPath, 'utf-8');

      // Verify log content
      verifyLogContent(logContent);
    } finally {
      // Restore original cwd
      process.cwd = originalCwd;
    }
  });
});
