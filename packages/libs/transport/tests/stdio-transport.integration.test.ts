import { describe, it, expect, vi } from 'vitest';
import { PassThrough, Writable } from 'stream';
import type { Logger } from '@oaknational/mcp-logger';
import type { JsonRpcMessage } from '../src/types.js';

describe('StdioTransport Integration', () => {
  function createMinimalMocks() {
    // Store state for behavior testing
    let writtenData = '';

    // Use real Node streams to avoid type assertions
    const stdin = new PassThrough();
    const stdout = new PassThrough();
    stdout.on('data', (chunk: Buffer | string) => {
      writtenData += Buffer.isBuffer(chunk) ? chunk.toString() : chunk;
    });

    // Minimal logger
    const logger: Logger = {
      trace: vi.fn(),
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      fatal: vi.fn(),
    };

    // Helper to simulate input - calls all data handlers
    const simulateInput = (data: string | Buffer) => {
      stdin.emit('data', data);
    };

    // Helper to get written output
    const getWrittenData = () => writtenData;
    const clearWrittenData = () => {
      writtenData = '';
    };

    return { stdin, stdout, logger, simulateInput, getWrittenData, clearWrittenData };
  }

  describe('Transport Lifecycle', () => {
    it('should start and stop without errors', async () => {
      const { createStdioTransport } = await import('../src/index.js');
      const { stdin, stdout, logger } = createMinimalMocks();

      const transport = createStdioTransport({
        logger,
        stdin,
        stdout,
      });

      // Test behavior: starts without throwing
      expect(() => {
        transport.start();
      }).not.toThrow();

      // Test behavior: stops without throwing
      expect(() => {
        transport.close();
      }).not.toThrow();
    });

    it('should require stdin and stdout', async () => {
      const { createStdioTransport } = await import('../src/index.js');
      const { logger } = createMinimalMocks();

      // Test behavior: throws when required dependencies are missing
      expect(() =>
        createStdioTransport({
          logger,
          stdin: undefined,
          stdout: undefined,
        }),
      ).toThrow();
    });
  });

  describe('Message Sending', () => {
    it('should format and send messages correctly', async () => {
      const { createStdioTransport } = await import('../src/index.js');
      const { stdin, stdout, logger, getWrittenData } = createMinimalMocks();

      const transport = createStdioTransport({
        logger,
        stdin,
        stdout,
      });

      const message: JsonRpcMessage = {
        jsonrpc: '2.0',
        method: 'test',
        id: 1,
      };

      // Test behavior: sends formatted message
      await transport.send(message);

      // Verify the output behavior, not the implementation
      const output = getWrittenData();
      expect(output).toBe('{"jsonrpc":"2.0","method":"test","id":1}\n');
    });

    it('should handle write errors gracefully', async () => {
      const { createStdioTransport } = await import('../src/index.js');
      const { stdin, logger } = createMinimalMocks();

      // Create a stdout that always fails
      const stdout = new Writable({
        write(_chunk, _enc, cb) {
          cb(new Error('Write failed'));
        },
      });
      // Attach error listener to avoid unhandled exception in the process
      stdout.on('error', () => {
        // handled by the test expectation below
      });

      const transport = createStdioTransport({
        logger,
        stdin,
        stdout,
      });

      const message: JsonRpcMessage = {
        jsonrpc: '2.0',
        method: 'test',
        id: 1,
      };

      // Test behavior: rejects with error when write fails
      await expect(transport.send(message)).rejects.toThrow('Write failed');
    });
  });

  describe('Message Receiving', () => {
    it('should parse and deliver messages', async () => {
      const { createStdioTransport } = await import('../src/index.js');
      const { stdin, stdout, logger, simulateInput } = createMinimalMocks();
      const receivedMessages: JsonRpcMessage[] = [];

      const transport = createStdioTransport({
        logger,
        stdin,
        stdout,
        onMessage: (msg) => receivedMessages.push(msg),
      });

      // Start the transport to enable message receiving
      transport.start();

      // Test behavior: processes incoming JSON-RPC messages
      simulateInput('{"jsonrpc":"2.0","method":"test","id":1}\n');

      // Verify the message was processed correctly
      expect(receivedMessages).toEqual([{ jsonrpc: '2.0', method: 'test', id: 1 }]);
    });

    it('should handle partial messages correctly', async () => {
      const { createStdioTransport } = await import('../src/index.js');
      const { stdin, stdout, logger, simulateInput } = createMinimalMocks();
      const receivedMessages: JsonRpcMessage[] = [];

      const transport = createStdioTransport({
        logger,
        stdin,
        stdout,
        onMessage: (msg) => receivedMessages.push(msg),
      });

      transport.start();

      // Test behavior: buffers partial messages and processes complete ones
      simulateInput('{"jsonrpc":"2.0",');
      simulateInput('"method":"test1","id":1}\n');
      simulateInput('{"jsonrpc":"2.0","method":"test2","id":2}\n');

      // Verify both complete messages were processed
      expect(receivedMessages).toEqual([
        { jsonrpc: '2.0', method: 'test1', id: 1 },
        { jsonrpc: '2.0', method: 'test2', id: 2 },
      ]);
    });

    it('should ignore invalid JSON', async () => {
      const { createStdioTransport } = await import('../src/index.js');
      const { stdin, stdout, simulateInput } = createMinimalMocks();
      const receivedMessages: JsonRpcMessage[] = [];
      let errorCount = 0;

      // Create logger with tracking
      const trackingLogger: Logger = {
        trace: vi.fn(),
        debug: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(() => {
          errorCount++;
        }),
        fatal: vi.fn(),
      };

      const transport = createStdioTransport({
        logger: trackingLogger,
        stdin,
        stdout,
        onMessage: (msg) => receivedMessages.push(msg),
      });

      transport.start();

      // Test behavior: skips invalid JSON and continues processing
      simulateInput('not valid json\n');
      simulateInput('{"jsonrpc":"2.0","method":"test"}\n');

      // Verify only valid message was processed
      expect(receivedMessages).toEqual([{ jsonrpc: '2.0', method: 'test' }]);
      // Verify that invalid JSON triggered an error log (behavior, not implementation)
      expect(errorCount).toBeGreaterThan(0);
    });
  });
});
