import { describe, it, expect, vi } from 'vitest';
import type { Logger } from '@oaknational/mcp-moria';
import type { JsonRpcMessage } from '../src/types.js';

describe('STDIO Transport', () => {
  function createMockStreams() {
    const dataHandlers: Array<(chunk: Buffer) => void> = [];
    const writtenData: string[] = [];

    const stdin = {
      on: vi.fn((event: string, handler: (chunk: Buffer) => void) => {
        if (event === 'data') {
          dataHandlers.push(handler);
        }
      }),
      resume: vi.fn(),
      pause: vi.fn(),
      removeListener: vi.fn(),
      // Helper to simulate incoming data
      simulateData: (data: string) => {
        dataHandlers.forEach((handler) => handler(Buffer.from(data)));
      },
    };

    const stdout = {
      write: vi.fn((data: string | Buffer, callback?: (error?: Error | null) => void) => {
        writtenData.push(data.toString());
        if (callback) callback();
        return true;
      }),
    };

    return { stdin, stdout, writtenData, dataHandlers };
  }

  function createLogger(): Logger {
    return {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
    };
  }

  describe('Message Sending', () => {
    it('sends JSON-RPC messages as newline-delimited JSON', async () => {
      const { createStdioTransport } = await import('../src/index');
      const { stdin, stdout, writtenData } = createMockStreams();
      const logger = createLogger();

      const transport = createStdioTransport({
        logger,
        stdin: stdin as unknown as NodeJS.ReadStream,
        stdout: stdout as unknown as NodeJS.WriteStream,
      });

      const message = { jsonrpc: '2.0', method: 'test', params: { value: 42 } };
      await transport.send(message);

      expect(writtenData).toEqual([JSON.stringify(message) + '\n']);
    });

    it('propagates write errors', async () => {
      const { createStdioTransport } = await import('../src/index');
      const { stdin } = createMockStreams();
      const logger = createLogger();

      const failingStdout = {
        write: vi.fn((_data: string | Buffer, callback?: (error?: Error | null) => void) => {
          if (callback) callback(new Error('Write failed'));
          return false;
        }),
      };

      const transport = createStdioTransport({
        logger,
        stdin: stdin as unknown as NodeJS.ReadStream,
        stdout: failingStdout as unknown as NodeJS.WriteStream,
      });

      await expect(transport.send({ jsonrpc: '2.0', method: 'test' })).rejects.toThrow(
        'Write failed',
      );
    });
  });

  describe('Message Receiving', () => {
    it('parses newline-delimited JSON messages', async () => {
      const { createStdioTransport } = await import('../src/index');
      const { stdin, stdout } = createMockStreams();
      const logger = createLogger();
      const receivedMessages: JsonRpcMessage[] = [];

      const transport = createStdioTransport({
        logger,
        stdin: stdin as unknown as NodeJS.ReadStream,
        stdout: stdout as unknown as NodeJS.WriteStream,
        onMessage: (msg) => receivedMessages.push(msg),
      });

      transport.start();

      const message = { jsonrpc: '2.0', method: 'test', id: 1 };
      stdin.simulateData(JSON.stringify(message) + '\n');

      expect(receivedMessages).toEqual([message]);
    });

    it('buffers partial messages', async () => {
      const { createStdioTransport } = await import('../src/index');
      const { stdin, stdout } = createMockStreams();
      const logger = createLogger();
      const receivedMessages: JsonRpcMessage[] = [];

      const transport = createStdioTransport({
        logger,
        stdin: stdin as unknown as NodeJS.ReadStream,
        stdout: stdout as unknown as NodeJS.WriteStream,
        onMessage: (msg) => receivedMessages.push(msg),
      });

      transport.start();

      const message = { jsonrpc: '2.0', method: 'test' };
      const json = JSON.stringify(message);

      // Send first part - should not trigger message
      stdin.simulateData(json.slice(0, 10));
      expect(receivedMessages).toEqual([]);

      // Send rest with newline - should trigger message
      stdin.simulateData(json.slice(10) + '\n');
      expect(receivedMessages).toEqual([message]);
    });

    it('handles multiple messages in one chunk', async () => {
      const { createStdioTransport } = await import('../src/index');
      const { stdin, stdout } = createMockStreams();
      const logger = createLogger();
      const receivedMessages: JsonRpcMessage[] = [];

      const transport = createStdioTransport({
        logger,
        stdin: stdin as unknown as NodeJS.ReadStream,
        stdout: stdout as unknown as NodeJS.WriteStream,
        onMessage: (msg) => receivedMessages.push(msg),
      });

      transport.start();

      const msg1 = { jsonrpc: '2.0', method: 'test1' };
      const msg2 = { jsonrpc: '2.0', method: 'test2' };

      stdin.simulateData(JSON.stringify(msg1) + '\n' + JSON.stringify(msg2) + '\n');

      expect(receivedMessages).toEqual([msg1, msg2]);
    });

    it('handles invalid JSON without crashing', async () => {
      const { createStdioTransport } = await import('../src/index');
      const { stdin, stdout } = createMockStreams();
      const logger = createLogger();
      const receivedMessages: JsonRpcMessage[] = [];

      const transport = createStdioTransport({
        logger,
        stdin: stdin as unknown as NodeJS.ReadStream,
        stdout: stdout as unknown as NodeJS.WriteStream,
        onMessage: (msg) => receivedMessages.push(msg),
      });

      transport.start();

      // Send invalid JSON - transport should handle it gracefully
      stdin.simulateData('not valid json\n');
      
      // Valid message should still work after invalid one
      stdin.simulateData('{"jsonrpc":"2.0","method":"test"}\n');

      expect(receivedMessages).toHaveLength(1);
      expect(receivedMessages[0]).toEqual({ jsonrpc: '2.0', method: 'test' });
    });
  });

  describe('Lifecycle', () => {
    it('starts and stops cleanly', async () => {
      const { createStdioTransport } = await import('../src/index');
      const { stdin, stdout } = createMockStreams();
      const logger = createLogger();
      const receivedMessages: JsonRpcMessage[] = [];

      const transport = createStdioTransport({
        logger,
        stdin: stdin as unknown as NodeJS.ReadStream,
        stdout: stdout as unknown as NodeJS.WriteStream,
        onMessage: (msg) => receivedMessages.push(msg),
      });

      transport.start();

      stdin.simulateData('{"jsonrpc":"2.0","method":"test"}\n');
      expect(receivedMessages).toHaveLength(1);

      transport.close();

      // After close, new messages should not be processed
      // (but we can't easily test this without knowing implementation details)
    });
  });
});
