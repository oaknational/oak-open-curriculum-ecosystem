import { describe, it, expect, vi } from 'vitest';
import type { ReadableStream, WritableStream, Logger } from '@oaknational/mcp-core';
import type { JsonRpcMessage } from '../src/types.js';

describe('StdioTransport Integration', () => {
  function createMinimalMocks() {
    // Store state for behavior testing
    let writtenData = '';
    const handlers = new Map<string, Set<(...args: unknown[]) => void>>();

    // Minimal mock for stdin - stores handlers for later simulation
    const stdin: ReadableStream = {
      on: vi.fn((event: string, handler: (...args: unknown[]) => void) => {
        if (!handlers.has(event)) {
          handlers.set(event, new Set());
        }
        handlers.get(event)?.add(handler);
      }),
      removeListener: vi.fn((event: string, handler: (...args: unknown[]) => void) => {
        handlers.get(event)?.delete(handler);
        return stdin;
      }),
      pause: vi.fn(),
      resume: vi.fn(),
    };

    // Minimal mock for stdout that captures output
    const stdout: WritableStream = {
      write: vi.fn((data: string | Buffer, callback?: (error?: Error | null) => void) => {
        writtenData += data.toString();
        if (callback) callback();
        return true;
      }),
      end: vi.fn(),
    };

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
      const dataHandlers = handlers.get('data');
      if (dataHandlers) {
        dataHandlers.forEach((handler) => {
          handler(data);
        });
      }
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
      const stdout: WritableStream = {
        write: vi.fn((_data: string | Buffer, callback?: (error?: Error | null) => void) => {
          if (callback) callback(new Error('Write failed'));
          return false;
        }),
        end: vi.fn(),
      };

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
